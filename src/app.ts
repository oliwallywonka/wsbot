import "dotenv/config";

import { PORT } from "./config/config";
import { getCardIDFlow } from "./flows/getCardIDFlow";
import { invalidFlow } from "./flows/invalidFlow";
import { menuFlow } from "./flows/menu.flow";
import { sendDocumentFlow } from "./flows/sendDocumentFlow";
import { getMothsFlow } from "./flows/getMonthsFlow";

import { messageHandler } from "./handlers/message";
import { sendMessagesHandler } from "./handlers/sendMessages";
import { statusHandler } from "./handlers/status";
import { stopHandler } from "./handlers/stop";
import { uploadFile } from "./middlewares/fileMiddleware";
import {
  createBot,
  createFlow,
  createProvider,
  MemoryDB,
} from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";

const main = async () => {
  const provider = createProvider(BaileysProvider);

  const { httpServer, handleCtx } = await createBot({
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

  httpServer(PORT);

  provider.server.post("/message", uploadFile.single("file"), handleCtx(messageHandler));

  // QUEUE WS ROUTES
  provider.server.get("/status", handleCtx(statusHandler));
  provider.server.post("/sendMessages", uploadFile.single("file"), handleCtx(sendMessagesHandler));
  provider.server.post("/stop", handleCtx(stopHandler));
};

main();
