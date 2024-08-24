import { addKeyword, EVENTS } from "@builderbot/bot";

import { invalidFlow } from "./invalidFlow";
import { getMothsFlow } from "./getMonthsFlow";

const menuAnswer = `
😊 *¡Gracias por comunicarte con RRHH!* 😊

📄 *Solicitud de Boletas de Pago* 📄

Para solicitar tu boleta de pago, por favor escribe el *número 1*.

*1. Boleta de Pago 📑*

Luego, selecciona el mes de la boleta de pago que necesites. 🗓️

`;

const answerActions = {
  "1": getMothsFlow,
 
};


export const sendMenuImage = addKeyword([EVENTS.WELCOME, "menu"])// El asterisco indica que puede ser cualquier palabra clave
  .addAnswer(menuAnswer, {
    media: 'http://177.222.106.83:86/img/boot.png', // URL de la imagen a enviar
  });

export const captureMenuResponse = addKeyword(["captureResponse"])
  .addAnswer("Por favor, selecciona una opción del menú:", { capture: true }, async (ctx, { gotoFlow }) => {
    const flow =
      answerActions[ctx.body as keyof typeof answerActions] || invalidFlow;
    gotoFlow(flow);
  });

export const menuFlow = sendMenuImage.addAnswer("Por favor, selecciona una opción del menú:", { capture: true }, (ctx, { gotoFlow }) => {
  const flow =
    answerActions[ctx.body as keyof typeof answerActions] || invalidFlow;
  gotoFlow(flow);
});

