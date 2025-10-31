import { ObjectId } from 'mongodb';
import { BaseEntity } from './BaseEntity';


export class Click extends BaseEntity {
  private count: number;
  private sessionId: string;

  
  constructor(sessionId: string, count: number = 0, id?: ObjectId) {
    super(id);
    this.sessionId = sessionId;
    this.count = count;
  }

  
  get clickCount(): number {
    return this.count;
  }

  get session(): string {
    return this.sessionId;
  }

  increment(): void {
    this.count++;
    this.updateTimestamp();
  }

  setCount(value: number): void {
    if (value < 0) {
      throw new Error('Count cannot be negative');
    }
    this.count = value;
    this.updateTimestamp();
  }

  
  validate(): boolean {
    return this.sessionId.length > 0 && this.count >= 0;
  }

  toJSON(): Record<string, any> {
    return {
      _id: this._id,
      sessionId: this.sessionId,
      count: this.count,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
