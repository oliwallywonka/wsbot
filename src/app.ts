import "dotenv/config";

import {
  MemoryDB,
  createBot,
  createFlow,
  createProvider,
} from "@bot-whatsapp/bot";
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys";

import { PORT } from "./config/config";
import { getCardIDFlow } from "./flows/getCardIDFlow";
import { invalidFlow } from "./flows/invalidFlow";
import { menuFlow } from "./flows/menu.flow";
import { sendDocumentFlow } from "./flows/sendDocumentFlow";
import { getMothsFlow } from "./flows/getMonthsFlow";

import { WSTask, InMemoryQueue } from "./classes/WSTask";

const wsQueue = new InMemoryQueue<void>();

const main = async () => {
  const wSTask = WSTask.instance();

  const provider = createProvider(BaileysProvider);
  provider.initHttpServer(PORT);

  provider.http?.server.post(
    "sendMessages",
    handleCtx(async (bot, req, res) => {
      const { message }: { message: string | undefined } = req.body;
      try {
        if (wsQueue.getActiveCount() > 0) {
          return res.end("Ya existen mensajes en cola.");
        }
        await wSTask.getData();

        for (const data of wSTask.data) {
          wsQueue.add(async () => {
            const d = {
              ...data,
              message: message?.replace("{{link}}", data.linkURL) || "",
            };
            await new Promise((resolve) => setTimeout(resolve, 4000));
            await bot.sendMessage(data.phone, d.message, {});
            console.log(data.phone);
            return;
          });
        }
        res.end("Mensajes añadidos a la cola");
      } catch (error) {
        console.log(error);
        res.end("Error en el servidor");
      }
    })
  );

  provider.http?.server.get(
    "status",
    handleCtx(async (bot, req, res) => {
      try {
        const jobs = wsQueue.getActiveCount();
        res.end(`Mensajes en cola ${String(jobs)}`);
      } catch (error) {
        console.error("Error obteniendo el estado de los trabajos:", error);
        res.end("Error obteniendo el estado de los trabajos");
      }
    })
  );

  provider.http?.server.post(
    "stop",
    handleCtx(async (bot, req, res) => {
      wsQueue.stopActiveTask();
      res.end("tareas eliminadas exitosamente");
    })
  );

  await createBot({
    flow: createFlow([
      menuFlow,
      invalidFlow,
      getCardIDFlow,
      sendDocumentFlow,
      getMothsFlow,
    ]),
    database: new MemoryDB(),
    provider: provider,
  });
};

main();
