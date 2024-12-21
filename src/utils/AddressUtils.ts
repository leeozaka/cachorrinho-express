/**
 * Utility class for handling address-related operations
 * @class AddressUtils
 */
export default class AddressUtils {
  /**
   * Validates if a given postal code (CEP) is in the correct format
   * @param postalCode - The postal code to validate
   * @returns {Promise<boolean>} True if postal code is valid, false otherwise
   * @throws {Error} If postal code is not provided
   */
  static async isValidPostalCode(postalCode: string): Promise<boolean> {
    if (!postalCode) {
      throw new Error('Postal code is required');
    }

    const cleanPostalCode = postalCode.replace(/\D/g, '');

    if (!/^[\d]{8}$/.test(cleanPostalCode)) {
      return false;
    }

    return true;
  }
}
