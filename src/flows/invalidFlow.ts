import { EVENTS, addKeyword } from "@bot-whatsapp/bot";

export const invalidFlow = addKeyword(EVENTS.ACTION).addAnswer(
  "❌ Opcion invalida",
  null,
  async (_, { endFlow }) => {
    return endFlow();
  }
);
