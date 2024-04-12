type ErrorType = {
    error: string;
  };
  
  const route = (err: ErrorType, menu: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      menu = menu.replace(process.cwd(), '').replace('\\src','').replace(/\\/g,'/');
      if (err.error) {
        return reject({ error: err.error });
      } else {
        console.log(err);
        console.log(`[${menu}]=> Ocorreu algum ERRO não esperado em nosso sistema...`);
        return reject({ error: `[${menu}]=> Ocorreu algum ERRO não esperado em nosso sistema! Tente novamente mais tarde...` });
      }
    });
  }
  
  export default route;