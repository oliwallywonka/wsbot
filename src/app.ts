import "dotenv/config";

import {
  MemoryDB,
  createBot,
  createFlow,
  createProvider,
} from "@bot-whatsapp/bot";
import { BotContext } from "@bot-whatsapp/bot/dist/types";
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys";

import { PORT } from "./config/config";
import { getCardIDFlow } from "./flows/getCardIDFlow";
import { invalidFlow } from "./flows/invalidFlow";
import { menuFlow } from "./flows/menu.flow";
import { sendDocumentFlow } from "./flows/sendDocumentFlow";
import { getMothsFlow } from "./flows/getMonthsFlow";


const main = async () => {
  const provider = createProvider(BaileysProvider);
  provider.initHttpServer(PORT);

  provider.http?.server.get(
    "healt-check",
    handleCtx(async (bot, req, res) => {
      try {
        res.end("El servidor esta operativo ✅");
      } catch (error) {
        console.log(error);
      }
    })
  );

  provider.on("message", (ctx: BotContext) => {
    //console.log(ctx.body)
  });

  await createBot({
    flow: createFlow([menuFlow, invalidFlow, getCardIDFlow, sendDocumentFlow, getMothsFlow]),
    database: new MemoryDB(),
    provider: provider,
  });
};

main();
