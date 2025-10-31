import { BaseService } from './BaseService';
import { LeaderboardRepository } from '../repositories/LeaderboardRepository';
import { LeaderboardEntry } from '../entities/LeaderboardEntry';

export class LeaderboardService extends BaseService<LeaderboardEntry> {
  constructor(private leaderboardRepository: LeaderboardRepository) {
    super();
  }

  async processData(data: LeaderboardEntry): Promise<LeaderboardEntry> {
    this.log('Processing leaderboard data');
    
    if (!this.validateInput(data)) {
      throw new Error('Invalid leaderboard data');
    }

    return await this.leaderboardRepository.create(data);
  }

  validateInput(data: any): boolean {
    return data && typeof data.playerName === 'string' && typeof data.clicks === 'number';
  }

  async getTopPlayers(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      this.log(`Fetching top ${limit} players`);
      return await this.leaderboardRepository.findTopPlayers(limit);
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async updatePlayerScore(username: string, clicks: number): Promise<LeaderboardEntry> {
    try {
      this.log(`Updating score for ${username}: ${clicks}`);
      const entry = await this.leaderboardRepository.upsertPlayer(username, clicks);
      await this.leaderboardRepository.updateRankings();
      return entry;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async refreshRankings(): Promise<void> {
    try {
      this.log('Refreshing rankings');
      await this.leaderboardRepository.updateRankings();
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async removePlayer(username: string): Promise<void> {
    try {
      this.log(`Removing player ${username} from leaderboard`);
      await this.leaderboardRepository.deletePlayer(username);
      await this.leaderboardRepository.updateRankings();
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }
}
