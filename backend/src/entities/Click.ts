import { ObjectId } from 'mongodb';
import { BaseEntity } from './BaseEntity';

// Inheritance - สืบทอดจาก BaseEntity
export class Click extends BaseEntity {
  private count: number;
  private sessionId: string;

  // Constructor - รับค่าเริ่มต้น
  constructor(sessionId: string, count: number = 0, id?: ObjectId) {
    super(id);
    this.sessionId = sessionId;
    this.count = count;
  }

  // Encapsulation - getter/setter with validation
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

  // Implementation ของ abstract methods
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
