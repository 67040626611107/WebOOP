import { Collection, ObjectId } from 'mongodb';
import { IClickRepository } from './IRepository';
import { Click } from '../entities/Click';
import { DatabaseConnection } from '../database/DatabaseConnection';


export class ClickRepository implements IClickRepository {
  private collection: Collection;
  private readonly collectionName = 'clicks';

  
  constructor(private dbConnection: DatabaseConnection) {
    this.collection = this.dbConnection.getDatabase().collection(this.collectionName);
  }

  async create(entity: Click): Promise<Click> {
    if (!entity.validate()) {
      throw new Error('Invalid click entity');
    }

    const result = await this.collection.insertOne(entity.toJSON());
    return new Click(entity.session, entity.clickCount, result.insertedId);
  }

  async findById(id: string): Promise<Click | null> {
    const doc = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!doc) return null;

    return new Click(doc.sessionId, doc.count, doc._id);
  }

  async findBySessionId(sessionId: string): Promise<Click | null> {
    const doc = await this.collection.findOne({ sessionId });
    if (!doc) return null;

    return new Click(doc.sessionId, doc.count, doc._id);
  }

  async update(id: string, entity: Click): Promise<Click | null> {
    if (!entity.validate()) {
      throw new Error('Invalid click entity');
    }

    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: entity.toJSON() },
      { returnDocument: 'after' }
    );

    if (!result) return null;
    return new Click(result.sessionId, result.count, result._id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async findAll(): Promise<Click[]> {
    const docs = await this.collection.find().toArray();
    return docs.map(doc => new Click(doc.sessionId, doc.count, doc._id));
  }

  
  async incrementClick(sessionId: string): Promise<Click> {
    const existing = await this.findBySessionId(sessionId);

    if (existing) {
      existing.increment();
      await this.collection.updateOne(
        { sessionId },
        { $set: existing.toJSON() }
      );
      return existing;
    }

    const newClick = new Click(sessionId, 1);
    await this.create(newClick);
    return newClick;
  }

  async getTotalClicks(): Promise<number> {
    const result = await this.collection.aggregate([
      { $group: { _id: null, total: { $sum: '$count' } } }
    ]).toArray();

    return result[0]?.total || 0;
  }
}
