
import { Bot } from "./bot,interface"; // Asegúrate de que la ruta sea correcta

export const sendPDFHandler = async (bot: Bot, req: any, res: any) => {
  if (!bot) {
    return res.status(500).send("Lo sentimos, no hay un número conectado al servidor");
  }

  const { phone,id }: { phone: string;id: string  } = req.body; 

  if (!phone) {
    return res.status(400).send("Número de teléfono no proporcionado.");
  }
  
  try {
    console.log(phone);
    await bot.sendMessage(phone, "Gabriel", {
      media: `https://chaside.gabnetic.com/pdf/${id}`
    });

    console.log(`Mensaje enviado a ${phone}`);
    res.end("Mensaje Enviado");

  } catch (error) {
    console.error("Error enviando el mensaje:", error);
    res.end("Lo sentimos no hay un numero conectado al servidor");
  }
};
