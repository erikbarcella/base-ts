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

const route = (body: Body, camps: Camps, error: string = ''): Promise<Body> =>
  new Promise(async (res, rej) => {
    try {
      if (body && camps) {
        for (let key in camps) {
          if (!body[key] && camps[key].default) body[key] = camps[key].default;

          if (!body[key] && camps[key].required) {
            error += `\n* O campo '${camps[key].name || key}' não foi preenchido...`;
          } else if (body[key] || body[key] == '0') {
            if (typeof body[key] == 'string') body[key] = body[key].trim();

            if (camps[key].type) {
              const type = camps[key].type;
              if (type) {
                camps[key].type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
              }
            }
          }
        }

        if (error) return rej({ error: error.replace('\n', '') });
        return res(body);
      } else return res(body);
    } catch (err) {
        return Errors(err, `Validate ${__filename}`)
            .then(() => {
                return route(body, {}, ''); 
            })
            .catch((e: any) => rej(e));
    }
  });

export default route;

const Functions: Functions = {
  Zeros: async (value) => {
    if (String(value).slice(0, 1) == '0') value = value.slice(1, value.length);
    if (String(value).slice(0, 1) == '0') return Functions.Zeros(value);
    return value;
  },

 Replace: async (camps: any, body: any, key: string) => {
    for (let i in camps[key].replace) {
      if (camps[key].replace[i] !== undefined && camps[key].replace[i] !== null) {
        const replaceValue: string = camps[key].replace[i]; // Assuming replaceValue is always a string
        if (replaceValue.includes('/')) {
          body[key] = String(body[key]).replace(new RegExp(replaceValue.split('/')[0], 'g'), replaceValue.split('/')[1]);
        } else {
          body[key] = String(body[key]).replace(new RegExp(replaceValue, 'g'), '');
        }
      }
    }
  },

  Equal: async (camps, body, key) =>
    new Promise(async (res, rej) => {
      if (camps[key].include && String(camps[key].include).includes(body[key])) {
        return res();
      } else
        return rej(`O campo '${camps[key].name || key}' precisa ser igual a um desses: '${camps[key].include?.join(', ')}'`);
    }),

  Length: async (camps: any, body: any, key: string) =>
    new Promise<void>(async (res, rej) => {
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
        rej(error);
      } else {
        res();
      }
    }),
};

const Types: Types = {
  // Your Types object here...
};