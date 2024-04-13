import { EVENTS, addKeyword } from "@bot-whatsapp/bot";
import { getCardIDFlow } from "./getCardIDFlow";
import { invalidFlow } from "./invalidFlow";
import path from "path";

const menuAnswer = `
📋 *Documentos Personales* 📋

1. *Informacion usuario* 🆔
2. *Imagen Pasaporte* 🛂 📝
3. *Licencia de Conducir* 🚗 📄
4. *Certificado de Nacimiento* 🏥

Por favor, selecciona el *número* correspondiente al documento que necesitas ¡Estamos aquí para ayudarte con tus trámites! 📝🔍
`;

const sendDocumentFlow = addKeyword(EVENTS.ACTION)
  .addAnswer("⏰ Enviando documento espere....", {
    media: path.resolve(__dirname, "../../bot.qr.png"),
  })
  .addAnswer("Imagen enviada.");

const answerActions = {
  "1": getCardIDFlow,
  "2": sendDocumentFlow,
  "3": getCardIDFlow,
  "4": getCardIDFlow,
};

export const menuFlow = addKeyword([EVENTS.WELCOME, "menu"]).addAnswer(
  menuAnswer,
  { capture: true },
  async (ctx, { gotoFlow }) => {
    console.log(ctx.body);
    const flow =
      answerActions[ctx.body as keyof typeof answerActions] || invalidFlow;
    gotoFlow(flow);
  }
);
