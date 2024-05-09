import { EVENTS, addKeyword } from "@bot-whatsapp/bot";

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

function getLastMonths(monthsQuantity: number = 3) {
  const monthsList: Date[] = [];
  for (let i = 0; i < monthsQuantity; i++) {
    const today = new Date();
    monthsList.push(today);
    today.setMonth(today.getMonth() - (i));
  }
  return monthsList;
}

const monthsAnswer = `
📋 *Meses disponibles* 📋

   ${getLastMonths().map(
     (month, index) => `${index + 1}: *${getStringDate(month)}* \n`
   )}
`;

export const getMothsFlow = addKeyword([EVENTS.ACTION]).addAnswer(
  monthsAnswer,
  { capture: true },
  async (ctx, { flowDynamic }) => {
    const date =
      monthDicctionary(getLastMonths())[
        ctx.body as keyof typeof monthDicctionary
      ] || new Date();

    const userPhone = ctx.from;

    const phoneSanitizied = userPhone.slice(3, userPhone.length - 1);

    // TODO : Verify month number is getting a wrong number in some cases.
    const selectedMonth = new Date(date).getMonth() + 1;
    const selectedYear = new Date(date).getFullYear();
    const dateParsed = `${selectedYear}-${selectedMonth}`;

    console.log(phoneSanitizied, dateParsed);

    await flowDynamic([
      {
        body: "😜",
        media: `http://177.222.106.83:86/api/boleta?numero=${phoneSanitizied}&fecha=${dateParsed}`,
      },
    ]);
  }
);
