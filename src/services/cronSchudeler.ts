import cron from "node-cron";
import { join } from "path";
import { Bot } from "../handlers/bot,interface"; // Asegúrate de que Bot esté correctamente importado
import { getAllUsers } from "../services/getAllUsers"; // Asegúrate de que getAllUsers esté correctamente importado

let bot: Bot; // Asegúrate de inicializar tu bot correctamente

export const sendScheduledMessage = async (bot: Bot, req: any, res: any) => {
  const messages = ["Hola {{nombre}}, revisa el siguiente enlace: {{link}}"];
  const imagePath = join(process.cwd(), "src/images/bot.jpg");
  const users = await getAllUsers(); // Obtén la lista de usuarios

  for (const user of users) {
    // Personaliza el mensaje para cada usuario
    const personalizedMessage = messages[0]
      .replace("{{link}}", user.linkURL || "https://default-link.com")
      .replace("{{nombre}}", user.fullName || "Usuario");

    try {
      // Envía el mensaje y el archivo (si existe)
      await bot.sendMessage(
        user.phone,
        personalizedMessage,
        imagePath ? { media: imagePath } : {} // Enviar media si existe, de lo contrario solo texto
      );
    } catch (error) {
      console.error(`Error al enviar el mensaje al usuario ${user.fullName}:`, error);
    }
  }
};

// Programar una tarea cron para el 3 de cada mes a las 10:00 AM
cron.schedule('0 10 3 * *', async () => {
  console.log("Enviando mensaje programado...");
  try {
    await sendScheduledMessage();
  } catch (error) {
    console.error("Error al enviar el mensaje programado:", error);
  }
});
