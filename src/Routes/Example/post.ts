import { Errors, Validate } from '../../../Utils/functions'; // Assuming functions are exported properly

interface Field {
  required?: boolean;
  type?: string;
}

type RouteResponse = { status: number } & { [key: string]: any };

const route = async (req: Request, res: Response): Promise<RouteResponse | Error> => {
  try {
    const validatedBody = await Validate(req.body, {
      cpf: { required: true, type: 'cpf' } as Field,
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
  method: 'POST', // Explicitly define the HTTP method
};
