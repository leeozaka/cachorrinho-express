export enum Table {
  User,
  Address,
  Account,
}

export enum Field {
  Id,
  Cpf,
  Password,
  Email,
  Phone,
  Token,
  Birthday,
}

export type HTTP_Codes = 200 | 201 | 400 | 401 | 404 | 500;

export interface Error {
  table: Table;
  field: Field;
  code: HTTP_Codes;
  message: string;
}
