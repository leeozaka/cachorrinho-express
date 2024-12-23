export interface LoginRequest {
  cpf: string;
  password: string;
}

export interface LoginResponse {
  expires: Date;
  token: string;
}
