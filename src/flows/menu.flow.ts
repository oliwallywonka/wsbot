import { EVENTS, addKeyword } from "@bot-whatsapp/bot";
import { getCardIDFlow } from "./getCardIDFlow";
import { invalidFlow } from "./invalidFlow";
import { sendDocumentFlow } from "./sendDocumentFlow";
import { getMothsFlow } from "./getMonthsFlow";

const menuAnswer = `
📋 *Documentos Personales* 📋

1. *Informacion usuario* 🆔
2. *Imagen Pasaporte* 🛂 📝
3. *Obtener meses* 🚗 📄
4. *Certificado de Nacimiento* 🏥

Por favor, selecciona el *número* correspondiente al documento que necesitas ¡Estamos aquí para ayudarte con tus trámites! 📝🔍
`;

const answerActions = {
  "1": getCardIDFlow,
  "2": sendDocumentFlow,
  "3": getMothsFlow,
  "4": getCardIDFlow,
};

export const menuFlow = addKeyword([EVENTS.WELCOME, "menu"])
  .addAnswer(
  menuAnswer,
  { capture: true },
  async (ctx, { gotoFlow }) => {
    const flow =
      answerActions[ctx.body as keyof typeof answerActions] || invalidFlow;
    gotoFlow(flow);
  }
);

