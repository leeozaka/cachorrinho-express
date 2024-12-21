export interface LoginRequest {
  cpf: string;
  password: string;
}

export interface LoginResponse {
  user: string;
  token: string;
}
