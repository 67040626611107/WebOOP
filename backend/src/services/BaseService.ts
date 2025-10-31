// Abstract Service - Abstraction Pattern
export abstract class BaseService<T> {
  // Abstract methods ที่ child classes ต้อง implement
  abstract processData(data: T): Promise<T>;
  abstract validateInput(data: any): boolean;
  
  // Common logging method
  protected log(message: string): void {
    console.log(`[${this.constructor.name}] ${message}`);
  }

  protected logError(error: any): void {
    console.error(`[${this.constructor.name}] Error:`, error);
  }
}
