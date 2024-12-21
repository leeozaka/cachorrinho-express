export class UserUtils {
  /**
   * Validates a Brazilian phone number
   * Accepts formats:
   * - (XX) XXXXX-XXXX (mobile)
   * - (XX) XXXX-XXXX (landline)
   * - XX XXXXX-XXXX
   * - XX XXXX-XXXX
   * - XXXXXXXXXXX
   * @param telephone Phone number to validate
   * @returns boolean indicating if phone number is valid
   */
  static isValidPhone(telephone: string): boolean {
    const cleanPhone = telephone.replace(/\D/g, '');

    if (cleanPhone.length !== 10 && cleanPhone.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleanPhone)) return false;

    const ddd = parseInt(cleanPhone.substring(0, 2));
    if (ddd < 11 || ddd > 99) return false;

    if (cleanPhone.length === 11 && cleanPhone.charAt(2) !== '9') return false;

    return true;
  }
  /**
   * Validates a Brazilian CPF number
   * @param cpf CPF number to validate
   * @returns boolean indicating if CPF is valid
   */
  static isValidCPF(cpf: string): boolean {
    const cleanCPF = cpf.replace(/\D/g, '');

    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

    const cpfDigits = cleanCPF.split('').map(Number);

    const firstDigit = UserUtils.calculateCPFDigit(cpfDigits, 9);
    if (firstDigit !== cpfDigits[9]) return false;

    const secondDigit = UserUtils.calculateCPFDigit(cpfDigits, 10);
    return secondDigit === cpfDigits[10];
  }

  /**
   * Calculates a CPF verification digit
   * @param digits Array of CPF digits
   * @param position Position to calculate (9 for first digit, 10 for second)
   */
  private static calculateCPFDigit(digits: number[], position: number): number {
    const sum = digits
      .slice(0, position)
      .reduce((acc, curr, index) => acc + curr * (position + 1 - index), 0);

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  /**
   * Validates an email address
   * @param email Email address to validate
   * @returns boolean indicating if email is valid
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Validates a password strength
   * Must contain:
   * - At least 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   * @param password Password to validate
   * @returns boolean indicating if password meets requirements
   */
  static isValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-])[A-Za-z\d#?!@$%^&*-]{8,}$/;
    return passwordRegex.test(password);
  }
}
