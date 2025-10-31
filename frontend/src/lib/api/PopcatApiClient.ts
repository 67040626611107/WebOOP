import { BaseApiClient } from './BaseApiClient';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  total?: number;
  message?: string;
}

export interface ClickData {
  _id?: string;
  sessionId: string;
  count: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LeaderboardEntry {
  _id?: string;
  username: string;
  totalClicks: number;
  rank: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PopcatApiClient extends BaseApiClient {
  private static instance: PopcatApiClient;

  private constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
  }

  public static getInstance(): PopcatApiClient {
    if (!PopcatApiClient.instance) {
      PopcatApiClient.instance = new PopcatApiClient();
    }
    return PopcatApiClient.instance;
  }

  protected async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  protected handleError(error: any): void {
    console.error('[PopcatApiClient] Error:', error);
  }

  async recordClick(sessionId: string): Promise<ApiResponse<ClickData>> {
    return this.post<ApiResponse<ClickData>>('/api/click', { sessionId });
  }

  async getClicksBySession(sessionId: string): Promise<ApiResponse<ClickData>> {
    return this.get<ApiResponse<ClickData>>(`/api/clicks/${sessionId}`);
  }

  async getTotalClicks(): Promise<ApiResponse<number>> {
    return this.get<ApiResponse<number>>('/api/clicks/total');
  }

  async getLeaderboard(limit: number = 10): Promise<ApiResponse<LeaderboardEntry[]>> {
    return this.get<ApiResponse<LeaderboardEntry[]>>(`/api/leaderboard?limit=${limit}`);
  }

  async updateLeaderboard(
    username: string,
    clicks: number
  ): Promise<ApiResponse<LeaderboardEntry>> {
    return this.post<ApiResponse<LeaderboardEntry>>('/api/leaderboard', {
      username,
      clicks,
    });
  }

  async removeFromLeaderboard(username: string): Promise<ApiResponse<any>> {
    return this.delete<ApiResponse<any>>(`/api/leaderboard/${username}`);
  }
}
