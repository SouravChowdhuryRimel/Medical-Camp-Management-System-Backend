declare module "json2csv" {
  export class Parser {
    constructor(opts?: { fields?: string[]; [key: string]: any });
    parse(data: any[]): string;
  }
}
