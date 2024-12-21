/**
 * JWT payload structure
 */
export default interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}
