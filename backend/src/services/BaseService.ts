
export abstract class BaseService<T> {
  
  abstract processData(data: T): Promise<T>;
  abstract validateInput(data: any): boolean;
  
  
  protected log(message: string): void {
    console.log(`[${this.constructor.name}] ${message}`);
  }

  protected logError(error: any): void {
    console.error(`[${this.constructor.name}] Error:`, error);
  }
}
