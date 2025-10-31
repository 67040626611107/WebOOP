
export abstract class BaseApiClient {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  
  protected abstract handleResponse<T>(response: Response): Promise<T>;
  protected abstract handleError(error: any): void;

  
  protected async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  
  protected async get<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET' });
  }

  
  protected async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  
  protected async delete<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'DELETE' });
  }
}
