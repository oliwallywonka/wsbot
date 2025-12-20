import "dotenv/config";

import {
  MemoryDB,
  createBot,
  createFlow,
  createProvider,
} from "@builderbot/bot";
 import { MetaProvider } from "@builderbot/provider-meta";

import { getCardIDFlow } from "./flows/getCardIDFlow";
import { invalidFlow } from "./flows/invalidFlow";
import { menuFlow } from "./flows/menu.flow";
import { sendDocumentFlow } from "./flows/sendDocumentFlow";
import { getMothsFlow } from "./flows/getMonthsFlow";


const main = async () => {
  const provider = createProvider(MetaProvider, {
    jwtToken: 'EAAQNSyNmZBOsBQCIYe5hZAqZC0dfv03TT6s4rOPHRia1nkctePwbBtAgOPhZBRZCrlT2QX4KLvoO4EFKdcemk51arADjEp4IbgH8dfwCJummwWns6rYZCOQgGECxDfeD5fp9vcb0hw9oHSCeHBFb7EnG3wlQgQWwIHqrJGC73TwmDNmmVgehYpMbROIFlBJsoSmsSbY85HZCG18yGFk1rUYS27UicSxJ519PzQHtCnVNBIrwUTbfeTe8JqmGe70MV3FdlD8qewhQ1coK4FDKiffaOGG',
    numberId: '970600996127515',
    verifyToken: '123',
    version: 'v24.0',    
  });

  const { httpServer } = await createBot({
    flow: createFlow([menuFlow, invalidFlow, getCardIDFlow, sendDocumentFlow, getMothsFlow]),
    database: new MemoryDB(),
    provider: provider,
  });

  httpServer(3000);

};

main();
