import Errors,{ ErrorType } from './../../Utils/Functions/Errors';
import Validate from './../../Utils/Functions/Validate';
import { Request } from 'express';
interface Field {
  required?: boolean;
  type?: string;
}

type RouteResponse = { status: number } & { [key: string]: any };

const route = async (req: Request, res: Response): Promise<RouteResponse | Error> => {
  try {
    const validatedQuery = await Validate(req.query, {
      cpf: { required: true, type: 'cpf' } as Field,
    });
    req.query = validatedQuery; // Update request query with validated data

    return { status: 200, ...req.query };
  } catch (err) {
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

export default {
  route,
  method: 'GET',
};
