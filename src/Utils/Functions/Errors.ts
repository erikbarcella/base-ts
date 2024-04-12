export interface ErrorType {
  error: string;
}

const route = (err: ErrorType, menu: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    menu = menu.replace(process.cwd(), '').replace('\\src','').replace(/\\/g,'/');
    if (err.error) {
      console.error(err);
      console.error(`[${menu}]=> Ocorreu algum ERRO não esperado em nosso sistema...`);
      reject({ error: `[${menu}]=> Ocorreu algum ERRO não esperado em nosso sistema! Tente novamente mais tarde...` });
    } else {
      console.error('Erro desconhecido');
      reject(new Error('Erro desconhecido'));
    }
  });
}

export default route;
