import { ObjectId } from 'mongodb';

// Abstract class - หลักการ Abstraction
export abstract class BaseEntity {
  protected _id?: ObjectId;
  protected createdAt: Date;
  protected updatedAt: Date;

  // Constructor - หลักการ OOP
  constructor(id?: ObjectId) {
    this._id = id;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Encapsulation - getter/setter
  get id(): string | undefined {
    return this._id?.toString();
  }

  get createdDate(): Date {
    return this.createdAt;
  }

  get modifiedDate(): Date {
    return this.updatedAt;
  }

  // Abstract method - ต้อง implement ใน child class
  abstract toJSON(): Record<string, any>;
  abstract validate(): boolean;

  // Common method for all entities
  protected updateTimestamp(): void {
    this.updatedAt = new Date();
  }
}
