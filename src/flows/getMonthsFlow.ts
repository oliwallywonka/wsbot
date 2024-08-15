import { EVENTS, addKeyword } from "@bot-whatsapp/bot";
import axios from "axios";
import fs from "fs/promises";
import { join } from "path";
function getStringDate(date: Date): string {
  return date.toLocaleDateString("es", {
    month: "long",
    year: "numeric",
  });
}

function monthDicctionary(dates: Date[]) {
  const map = new Map<string, Date>();
  for (let i = 0; i < dates.length; i++) {
    map.set((i + 1).toString(), dates[i]);
  }
  return map;
}

function getLastMonths() {
    const today = new Date(); // Obtenemos la fecha actual
    const currentMonth = today.getMonth() - 1; 
    const currentDate = today.getDate(); 
    const lastThreeMonths = [];
    let startMonthIndex = 0;
    
    if (currentDate <= 2) {
        startMonthIndex = 1; 
    }
    // Añadimos los últimos tres meses completos
    for (let i = startMonthIndex; i < startMonthIndex + 7; i++) {
        const month = new Date(today.getFullYear(), currentMonth - i, 1);
        lastThreeMonths.push(month);
    }
    return lastThreeMonths;
}



console.log(getLastMonths());


const monthsAnswer = `
📋 *Meses disponibles* 📋

${getLastMonths().map((month, index) => `${index + 1}. ${getStringDate(month)}\n`).join('')}
`;


export const getMothsFlow = addKeyword([EVENTS.ACTION]).addAnswer(
  monthsAnswer,

).addAction({capture:true},async(ctx,{flowDynamic})=> {const monthsDicc = monthDicctionary(getLastMonths());
  const date = monthsDicc.get(ctx.body) || new Date();
  
  

  const userPhone = ctx.from;

  const phoneSanitizied = userPhone.slice(3, userPhone.length);

  // TODO : Verify month number is getting a wrong number in some cases.
  const selectedMonth = ('0' + (date.getMonth() + 1)).slice(-2);
  const dateTenDaysLater = new Date(selectedMonth);
  dateTenDaysLater.setDate(dateTenDaysLater.getDate() + 50);
  const selectedYear = date.getFullYear();
  const dateParsed = `${selectedYear}${selectedMonth}`;

  console.log(phoneSanitizied, dateParsed);
  try {
    await flowDynamic([
      {
        body: "📥 Enviando documento...",
      },
    ]);
    
    const doc = await axios
      .get(`http://177.222.106.83:86/api/boleta?numero=${phoneSanitizied}&fecha=${dateParsed}`,{
        responseType: 'arraybuffer',
        headers: {
            'Accept': 'application/pdf'
        }
    })
      .then((res) => res.data);

      
    await fs.writeFile(`${getStringDate(date)}.pdf`, doc);
    const url = join(process.cwd(),`${getStringDate(date)}.pdf` ).replace(/\\/g, "/");
    await flowDynamic([
      {
        body: "😜",
        media: url,
      },
    ]);
  } catch (error) {
    console.log('error');
    await flowDynamic([
      {
        body: "Tu numero no se encuentra registrado. Por favor, comunícate con Recursos Humanos (RRHH).",
      },
    ]);
  }
});
