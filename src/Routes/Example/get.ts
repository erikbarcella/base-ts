import { Errors, Validate } from '../../../Utils/functions'; // Assuming functions are exported properly

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
    return Errors(err, `ROUTE ${__filename}`)
      .then(() => route(req, res)) // Assuming route is defined within the same scope
      .catch((e) => e);
  }
};

export default {
  route,
  method: 'GET',
};
