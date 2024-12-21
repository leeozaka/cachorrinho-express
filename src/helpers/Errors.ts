import { Table, Field, HTTP_Codes, Error } from '../dtos/ErrorDTO';

export class ErrorHandler {
  private errors: Error[];

  constructor() {
    this.errors = [];
  }

  addError(table: Table, field: Field, code: HTTP_Codes, message: string) {
    this.errors.push({ table, field, code, message });
  }

  getErrors() {
    return this.errors;
  }

  concatenateErrors(ERRORS: ErrorHandler) {
    this.errors = this.errors.concat(ERRORS.getErrors());
  }
}
