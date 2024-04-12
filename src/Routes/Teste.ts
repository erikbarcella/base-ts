import Errors from './../Utils/Functions/Errors';
import Validate from './../Utils/Functions/Validate';
import { ErrorType } from './../Utils/Functions/Errors';

interface Field {
  required?: boolean;
  type?: string;
  remove_zeros?: boolean;
  default?: any;
}

type RouteResponse = { status: number } & { [key: string]: any };

const route = async (req: Request, res: Response): Promise<RouteResponse | Error> => {
  try {
    const validatedBody = await Validate(Request, {
      string: { required: true, type: 'string' } as Field,
      number: { required: true, type: 'number', remove_zeros: true } as Field,
      array: { required: true, type: 'array' } as Field,
      cpf: { required: true, type: 'cpf' } as Field,
      phone: { required: true, type: 'phone' } as Field,
      email: { required: true, type: 'email' } as Field,
      date: { required: true, type: 'date', default: new Date() } as Field,
    });

    return { status: 201, ...req.body };
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
}

export default {
  route,
  method: 'POST',
};
