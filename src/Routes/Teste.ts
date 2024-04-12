import { Errors, Validate } from '../Utils/functions'; // Assuming functions are exported properly

interface Field {
  required?: boolean;
  type?: string;
  remove_zeros?: boolean;
  default?: any;
}

type RouteResponse = { status: number } & { [key: string]: any };

const route = async (req: Request, res: Response): Promise<RouteResponse | Error> => {
  try {
    const validatedBody = await Validate(req.body, {
      string: { required: true, type: 'string' } as Field,
      number: { required: true, type: 'number', remove_zeros: true } as Field,
      array: { required: true, type: 'array' } as Field,
      cpf: { required: true, type: 'cpf' } as Field,
      phone: { required: true, type: 'phone' } as Field,
      email: { required: true, type: 'email' } as Field,
      date: { required: true, type: 'date', default: new Date() } as Field,
    });
    req.body = validatedBody; // Update request body with validated data

    return { status: 201, ...req.body };
  } catch (err) {
    return Errors(err, `ROUTE ${__filename}`)
      .then(() => route(req, res)) // Assuming route is defined within the same scope
      .catch((e) => e);
  }
};

export default {
  route,
  method: 'POST',
};
