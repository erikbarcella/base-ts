import { Request, Response } from 'express';
import { db } from '../Utils/bases';
import { Errors, Files } from '../Utils/functions';

let routes = Files('./src/Routes/', '../../Routes', 1);

const route = async (req: Request, res: Response): Promise<Response> => {
  try {
    let route = routes;
    for (let param of req.params[0].replace('/','').split("/")) {
      if (!route[param]) return res.status(404).send({ error: `A URI inserida é invalida...` });
      route = route[param]
    }
    if (!route) return res.status(404).send({ error: `A URI inserida não foi encontrada...` });

    req.method = req.method.toLowerCase()
    if (!route[req.method] || typeof route[req.method] != 'function') return res.status(405).send({ error: `O metodo solicitado é invalido para essa URI...` });

    route = await route[req.method](req, res);
    if (!route) return res.status(502).send({ error: `A API não retornou uma resposta valida...` });
    return res.status(route.status || 500).send(route);

  } catch(err) {
    return Errors(err, `Routes ${__filename}`)
      .then(() => { return route(req, res) })
      .catch((e) => { return res.status(e.status || 500).send(e) })
  }
}

export default route;