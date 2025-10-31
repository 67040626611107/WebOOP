import { BaseService } from './BaseService';
import { ClickRepository } from '../repositories/ClickRepository';
import { Click } from '../entities/Click';


export class ClickService extends BaseService<Click> {
  constructor(private clickRepository: ClickRepository) {
    super();
  }

  async processData(data: Click): Promise<Click> {
    this.log('Processing click data');
    
    if (!this.validateInput(data)) {
      throw new Error('Invalid click data');
    }

    return await this.clickRepository.create(data);
  }

  validateInput(data: any): boolean {
    return data && typeof data.session === 'string';
  }

  async handleClick(sessionId: string): Promise<Click> {
    try {
      this.log(`Handling click for session: ${sessionId}`);
      const click = await this.clickRepository.incrementClick(sessionId);
      return click;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async getClicksBySession(sessionId: string): Promise<Click | null> {
    try {
      return await this.clickRepository.findBySessionId(sessionId);
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async getTotalClicks(): Promise<number> {
    try {
      return await this.clickRepository.getTotalClicks();
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async getAllClicks(): Promise<Click[]> {
    try {
      return await this.clickRepository.findAll();
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }
}
