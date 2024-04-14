import { addKeyword, EVENTS } from "@bot-whatsapp/bot";
import path from "path";

export const sendDocumentFlow = addKeyword(EVENTS.ACTION)
  .addAnswer("⏰ Enviando documento espere....", {
    media: path.resolve(__dirname, "../../bot.qr.png"),
  })
  .addAnswer("Imagen enviada.");