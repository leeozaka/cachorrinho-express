import ErrorDetail from 'interfaces/ErrorDetailInterface';

export default class ErrorHandler {
  private errors: ErrorDetail[] = [];
  private status: number = 500;

  addError(entity: string, attribute: string, status: number, message: string): Error {
    this.errors.push({
      entity,
      attribute,
      status,
      message,
    });

    // Update status to most severe error
    this.status = status < 500 ? Math.max(this.status, status) : status;

    return new Error(message);
  }

  getErrors(): ErrorDetail[] {
    return this.errors;
  }

  getStatus(): number {
    return this.status;
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  clearErrors(): void {
    this.errors = [];
    this.status = 500;
  }

  formatError(code: string, message: string) {
    return {
      error: code,
      message: message,
    };
  }

  validationError(field: string, message: string) {
    return {
      error: 'VAL-01',
      field: field,
      message: message,
    };
  }

  notFoundError(entity: string) {
    return {
      error: 'NFD-01',
      message: `${entity} not found`,
    };
  }

  unauthorized() {
    return {
      error: 'AUTH-01',
      message: 'Unauthorized access',
    };
  }
}
