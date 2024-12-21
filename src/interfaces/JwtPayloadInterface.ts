/**
 * JWT payload structure
 */
export default interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}
