type ErrorType = {
  error: string,
  // outras propriedades, se houver...
};

const feriados: string[] = [
  '01-01', // ANO NOVO
  '02-20', // CARNAVAL
  '02-21', // CARNAVAL
  '04-07', // SEXTA SANTA
  '04-21', // TIRADENTES
  '05-01', // DIA DO TRABALHADOR
  '06-08', // CORPUS CHRISTI
  '09-07', // INDEPENDENCIA
  '09-20', // FARROUPILHA
  '10-12', // NOSSA SENHORA
  '11-02', // FINADOS
  '11-15', // REPUBLICA
  '12-25', // NATAL
];

const route = (data: string | null, timer: { seconds?: number, minutes?: number, hours?: number, days?: number, months?: number } = {}, ignore: { uteis?: boolean, feriados?: boolean } = {}): Promise<Date> => new Promise<Date>(async (res, rej) => {
  try {
    const date = data ? new Date(data) : new Date();
    if (!data) date.setHours(date.getHours() - 3);

    date.setSeconds(date.getSeconds() + (timer.seconds || 0));
    date.setMinutes(date.getMinutes() + (timer.minutes || 0));
    date.setHours(date.getHours() + (timer.hours || 0));
    date.setDate(date.getDate() + (timer.days || 0));
    date.setMonth(date.getMonth() + (timer.months || 0));

    if (timer.days && (ignore.uteis || ignore.feriados)) {
      let negativo;
      if (timer.days < 0) {
        negativo = true;
        timer.days = Math.abs(timer.days);
      }
      while (timer.days > 0) {
        date.setDate(date.getDate() + (negativo ? -1 : 1));
        const check = date.toISOString().slice(5, 10);
        if (ignore.uteis && (date.getDay() === 0 || date.getDay() === 6)) {
          console.log('[Final de Semana]=> ' + check);
        } else if (ignore.feriados && feriados.includes(check)) {
          console.log('[Feriado]=> ' + check);
        } else {
          timer.days -= 1;
        }
      }
    }
    return res(date);
  } catch (err) {
    if (err instanceof Error) {
      const errorObj: ErrorType = {
        error: err.message,
        // outras propriedades do tipo ErrorType, se houver...
      };
      return rej(errorObj);
    } else {
      const errorMessage = typeof err === 'string' ? err : 'Erro desconhecido';
      return rej(new Error(errorMessage));
    }
  }
});

export default route;
