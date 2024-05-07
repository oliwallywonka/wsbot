import { EVENTS, addKeyword } from "@bot-whatsapp/bot";
import { getCardIDFlow } from "./getCardIDFlow";
import { invalidFlow } from "./invalidFlow";
import { sendDocumentFlow } from "./sendDocumentFlow";

const menuAnswer = `
📋 *Documentos Personales* 📋

1. *Informacion usuario* 🆔
2. *Imagen Pasaporte* 🛂 📝
3. *Obtener meses* 🚗 📄
4. *Certificado de Nacimiento* 🏥

Por favor, selecciona el *número* correspondiente al documento que necesitas ¡Estamos aquí para ayudarte con tus trámites! 📝🔍
`;

function getLast3Months() {
  const today = new Date();
  const firstMonth = today.toLocaleDateString("es", {
    month: "long",
    year: "numeric"
  })
  today.setMonth(today.getMonth() - 1)
  const secondMonth = today.toLocaleDateString("es", {
    month: "long",
    year: "numeric"
  })
  today.setMonth(today.getMonth() - 1)
  const thirdMonth = today.toLocaleDateString("es", {
    month: "long",
    year: "numeric"
  })
  return {
    "1": firstMonth,
    "2": secondMonth,
    "3": thirdMonth
  }
}



const monthsAnswer = `
📋 *Meses disponibles* 📋

   1: ${getLast3Months()[1]}
   2: ${getLast3Months()[2]}
   3: ${getLast3Months()[3]}
`;

export const getMothsFlow = addKeyword([EVENTS.ACTION]).addAnswer(
  monthsAnswer,
  { capture: true },
  async (ctx, {flowDynamic}) => {

    const date = getLast3Months()[ctx.body as keyof typeof getLast3Months] || new Date().toLocaleDateString("es", {
      month: "long",
      year: "numeric"
    });

    const userPhone = ctx.from;

    const phoneSanitizied = userPhone.slice(3, userPhone.length - 1);

    const selectedMonth = new Date(date).getMonth() + 1
    const selectedYear = new Date(date).getFullYear()
    const dateParsed = `${selectedYear}-${selectedMonth}`

    console.log(phoneSanitizied, dateParsed)

    await flowDynamic([{body:'😜', media: `http://177.222.106.83:86/api/boleta?numero=${phoneSanitizied}&fecha=${dateParsed}`}])
  }
)

const answerActions = {
  "1": getCardIDFlow,
  "2": sendDocumentFlow,
  "3": getMothsFlow,
  "4": getCardIDFlow,
};

export const menuFlow = addKeyword([EVENTS.WELCOME, "menu"]).addAnswer(
  menuAnswer,
  { capture: true },
  async (ctx, { gotoFlow }) => {
    const flow =
      answerActions[ctx.body as keyof typeof answerActions] || invalidFlow;
    gotoFlow(flow);
  }
);

