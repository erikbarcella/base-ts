import { readdirSync } from 'fs';
import { join } from 'path';

interface Route {
  method?: string;
  route: any;
}

const route = (base: string, path: string, lower: boolean, dir: string = '', obj: Record<string, any> = {}): Record<string, any> => {
  readdirSync(join(base, dir)).forEach(async(file: string) => {
    let file_dir = file;
    if (lower) file = file.toLowerCase();
    const fileArray = file.split('.');
    file = fileArray[0];
    if (!dir && ['routes'].includes(file.toLowerCase())) return;
    if (fileArray[1] === 'ts') {
        const route: Route = await import(`${path}/${dir}/${file}`);
        if (['get','post','put','delete'].includes(file)) {
            return obj[file] = route.route;
        } else if (route.method) {
            return obj[file] = { [route.method.toLowerCase()]: route.route };
        } else {
            return obj[file] = route;
        }
    }
    obj[file] = {};
    route(base, path, lower,`${dir ? dir + '/' : ''}${file_dir}`, obj[file[0]]);
  });
  return obj;
};

export default route;