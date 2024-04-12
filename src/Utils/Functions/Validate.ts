import Errors from './Errors';

type Camps = {
  [key: string]: {
    default?: any;
    required?: boolean;
    name?: string;
    remove_zeros?: boolean;
    replace?: string[];
    type?: string;
    equal?: boolean;
    len?: number;
    min?: number;
    max?: number;
    include?: string[];
  };
};

type Body = {
  [key: string]: any;
};

type Functions = {
  Zeros: (value: string) => Promise<string>;
  Replace: (camps: Camps, body: Body, key: string) => Promise<void>;
  Equal: (camps: Camps, body: Body, key: string) => Promise<void>;
  Length: (camps: Camps, body: Body, key: string) => Promise<void>;
};

type Types = {
  [key: string]: (camps: Camps, body: Body, key: string) => Promise<void>;
};

const route = async (body: Body, camps: Camps, error: string = ''): Promise<Body> => {
  try {
    if (body && camps) {
      for (const [key, value] of Object.entries(camps)) {
        if (!body[key] && value.default) body[key] = value.default;

        if (!body[key] && value.required) {
          error += `\n* O campo '${value.name || key}' não foi preenchido...`;
        } else if (body[key] || body[key] === '0') {
          if (typeof body[key] === 'string') body[key] = body[key].trim();

          if (value.type) {
            const type = value.type;
            if (type) {
              value.type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
            }
          }
        }
      }

      if (error) throw new Error(error.replace('\n', ''));
      return body;
    } else {
      return body;
    }
  } catch (err: any | string) {
    await Errors(err, `Validate ${__filename}`);
    return route(body, {}, '');
  }
};

const Functions: Functions = {
  Zeros: async (value) => {
    if (String(value).slice(0, 1) === '0') value = value.slice(1, value.length);
    if (String(value).slice(0, 1) === '0') return Functions.Zeros(value);
    return value;
  },

  Replace: async (camps: any, body: any, key: string) => {
    for (const replaceValue of camps[key].replace) {
      if (replaceValue !== undefined && replaceValue !== null) {
        if (replaceValue.includes('/')) {
          body[key] = String(body[key]).replace(new RegExp(replaceValue.split('/')[0], 'g'), replaceValue.split('/')[1]);
        } else {
          body[key] = String(body[key]).replace(new RegExp(replaceValue, 'g'), '');
        }
      }
    }
  },

  Equal: async (camps, body, key) => {
    if (camps[key].include && String(camps[key].include).includes(body[key])) {
      return;
    } else {
      throw new Error(`O campo '${camps[key].name || key}' precisa ser igual a um desses: '${camps[key].include?.join(', ')}'`);
    }
  },

  Length: async (camps: any, body: any, key: string) => {
    let error = '';
    if (camps[key] && camps[key].len && String(body[key]).length !== camps[key].len) {
      error += `\n* O campo '${camps[key].name || key}' precisa conter '${camps[key].len}' caracteres...`;
    }
    if (camps[key] && camps[key].min && body[key] && String(body[key]).length < camps[key].min) {
      error += `\n* O campo '${camps[key].name || key}' precisa conter no mínimo '${camps[key].min}' caracteres...`;
    }
    if (camps[key] && camps[key].max && String(body[key]).length > camps[key].max) {
      error += `\n* O campo '${camps[key].name || key}' precisa conter no máximo '${camps[key].max}' caracteres...`;
    }
    if (error) {
      throw new Error(error);
    }
  },
};

const Types: Types = {
  // Your Types object here...
};

export default route;
export { Functions, Types };
