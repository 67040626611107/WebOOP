import { Collection, ObjectId } from 'mongodb';
import { ILeaderboardRepository } from './IRepository';
import { LeaderboardEntry } from '../entities/LeaderboardEntry';
import { DatabaseConnection } from '../database/DatabaseConnection';

export class LeaderboardRepository implements ILeaderboardRepository {
  private collection: Collection;
  private readonly collectionName = 'leaderboard';

  constructor(private dbConnection: DatabaseConnection) {
    this.collection = this.dbConnection.getDatabase().collection(this.collectionName);
  }

  async create(entity: LeaderboardEntry): Promise<LeaderboardEntry> {
    if (!entity.validate()) {
      throw new Error('Invalid leaderboard entry');
    }

    const result = await this.collection.insertOne(entity.toJSON());
    return new LeaderboardEntry(
      entity.playerName,
      entity.clicks,
      entity.position,
      result.insertedId
    );
  }

  async findById(id: string): Promise<LeaderboardEntry | null> {
    const doc = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!doc) return null;

    return new LeaderboardEntry(doc.username, doc.totalClicks, doc.rank, doc._id);
  }

  async update(id: string, entity: LeaderboardEntry): Promise<LeaderboardEntry | null> {
    if (!entity.validate()) {
      throw new Error('Invalid leaderboard entry');
    }

    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: entity.toJSON() },
      { returnDocument: 'after' }
    );

    if (!result) return null;
    return new LeaderboardEntry(result.username, result.totalClicks, result.rank, result._id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async findAll(): Promise<LeaderboardEntry[]> {
    const docs = await this.collection.find().sort({ totalClicks: -1 }).toArray();
    return docs.map(doc => 
      new LeaderboardEntry(doc.username, doc.totalClicks, doc.rank, doc._id)
    );
  }

  async findTopPlayers(limit: number = 10): Promise<LeaderboardEntry[]> {
    const docs = await this.collection
      .find()
      .sort({ totalClicks: -1 })
      .limit(limit)
      .toArray();

    return docs.map((doc, index) => {
      const entry = new LeaderboardEntry(doc.username, doc.totalClicks, index + 1, doc._id);
      return entry;
    });
  }

  async updateRankings(): Promise<void> {
    const entries = await this.findAll();
    
    for (let i = 0; i < entries.length; i++) {
      entries[i].setRank(i + 1);
      await this.collection.updateOne(
        { _id: new ObjectId(entries[i].id!) },
        { $set: { rank: i + 1 } }
      );
    }
  }

  async upsertPlayer(username: string, clicks: number): Promise<LeaderboardEntry> {
    const existing = await this.collection.findOne({ username });

    if (existing) {
      const entry = new LeaderboardEntry(username, clicks, existing.rank, existing._id);
      await this.collection.updateOne(
        { username },
        { $set: entry.toJSON() }
      );
      return entry;
    }

    const entry = new LeaderboardEntry(username, clicks);
    await this.create(entry);
    return entry;
  }

  async deletePlayer(username: string): Promise<void> {
    await this.collection.deleteOne({ username });
  }
}
