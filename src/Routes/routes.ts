
import Errors from '../Utils/Functions/Errors';
import Files from '../Utils/Functions/Files';
import { Request, Response } from 'express'; // Import the necessary types
import { ErrorType } from '../Utils/Functions/Errors';

const routes = Files('./src/Routes/', '../../Routes', true);

const route = async (req: Request, res: Response): Promise<Response> => {
  try{
    const params = (req.params as { [key: string]: string })[0].replace('/', '').split("/"); // Add type declaration for 'params'

    let currentRoute = routes;

    for (const param of params) {
      if (!currentRoute[param]) {
        return res.status(404).send({ error: `A URI inserida é inválida...` });
      }
      currentRoute = currentRoute[param];
    }

    if (!currentRoute) {
      return res.status(404).send({ error: `A URI inserida não foi encontrada...` });
    }

    req.method = req.method.toLowerCase();
    req.method = req.method.toLowerCase();

    if (!currentRoute[req.method] || typeof currentRoute[req.method] !== 'function') {
      return res.status(405).send({ error: `O método solicitado é inválido para essa URI...` });
    }

    const response = await currentRoute[req.method](req, res);

    if (!response) {
      return res.status(502).send({ error: `A API não retornou uma resposta válida...` });
    }

    return res.status(response.status || 500).send(response);
  }
  catch (err) {
    let errorType: ErrorType;

    if (typeof err === 'string') {
      errorType = { error: err };
    } else if (err instanceof Error) {
      errorType = { error: err.message };
    } else {
      // Trate outros tipos de erro ou lance uma exceção
      throw new Error('Erro desconhecido');
    }

    return Errors(errorType, `ROUTE ${__filename}`)
      .then(() => route(req, res)) // Supondo que route está definida no mesmo escopo
      .catch((e) => e);
  }
};

export default route;