import { ObjectId } from 'mongodb';
import { BaseEntity } from './BaseEntity';

export class LeaderboardEntry extends BaseEntity {
  private username: string;
  private totalClicks: number;
  private rank: number;

  constructor(username: string, totalClicks: number, rank: number = 0, id?: ObjectId) {
    super(id);
    this.username = username;
    this.totalClicks = totalClicks;
    this.rank = rank;
  }

  get playerName(): string {
    return this.username;
  }

  get clicks(): number {
    return this.totalClicks;
  }

  get position(): number {
    return this.rank;
  }

  setRank(rank: number): void {
    this.rank = rank;
    this.updateTimestamp();
  }

  addClicks(amount: number): void {
    this.totalClicks += amount;
    this.updateTimestamp();
  }

  validate(): boolean {
    return this.username.length > 0 && this.totalClicks >= 0;
  }

  toJSON(): Record<string, any> {
    return {
      _id: this._id,
      username: this.username,
      totalClicks: this.totalClicks,
      rank: this.rank,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
