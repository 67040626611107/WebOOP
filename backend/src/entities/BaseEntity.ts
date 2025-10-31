import { ObjectId } from 'mongodb';


export abstract class BaseEntity {
  protected _id?: ObjectId;
  protected createdAt: Date;
  protected updatedAt: Date;

  
  constructor(id?: ObjectId) {
    this._id = id;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  
  get id(): string | undefined {
    return this._id?.toString();
  }

  get createdDate(): Date {
    return this.createdAt;
  }

  get modifiedDate(): Date {
    return this.updatedAt;
  }

  
  abstract toJSON(): Record<string, any>;
  abstract validate(): boolean;

  
  protected updateTimestamp(): void {
    this.updatedAt = new Date();
  }
}
