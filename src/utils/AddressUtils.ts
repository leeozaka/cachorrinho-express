import { errAsync, okAsync, ResultAsync } from 'neverthrow';

/**
 * Utility class for handling address-related operations
 */
export default class AddressUtils {
  private static readonly POSTAL_CODE_LENGTH = 8;
  private static readonly POSTAL_CODE_REGEX = /^[\d]{8}$/;

  /**
   * Validates if a given postal code (CEP) is in the correct format
   * @param postalCode - The postal code to validate (can include special characters)
   * @returns ResultAsync<true> if valid, ResultAsync<Error> if invalid
   * @example
   * // Returns ok
   * AddressUtils.isValidPostalCode("12345-678")
   * // Returns error
   * AddressUtils.isValidPostalCode("123")
   */
  static isValidPostalCode(postalCode: string): ResultAsync<true, Error> {
    if (!postalCode?.trim()) return errAsync(new Error('Postal code cannot be empty or null'));

    const cleanPostalCode = this.sanitizePostalCode(postalCode);

    if (!this.POSTAL_CODE_REGEX.test(cleanPostalCode))
      return errAsync(
        new Error(`Postal code must contain exactly ${this.POSTAL_CODE_LENGTH} digits`),
      );

    return okAsync(true);
  }

  /**
   * Removes all non-digit characters from the postal code
   */
  private static sanitizePostalCode(postalCode: string): string {
    return postalCode.replace(/\D/g, '');
  }
}
