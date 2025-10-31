import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { DatabaseConnection } from './database/DatabaseConnection';
import { ClickRepository } from './repositories/ClickRepository';
import { LeaderboardRepository } from './repositories/LeaderboardRepository';
import { ClickService } from './services/ClickService';
import { LeaderboardService } from './services/LeaderboardService';
import { Config } from './config/Config';

// Main Application Class - Composition Pattern
export class PopcatApplication {
  private app: Elysia;
  private config: Config;
  private dbConnection: DatabaseConnection;
  private clickService: ClickService;
  private leaderboardService: LeaderboardService;

  // Constructor - Dependency Injection
  constructor() {
    this.config = Config.getInstance();
    this.dbConnection = DatabaseConnection.getInstance(this.config.mongoUri);
    this.app = new Elysia();
    
    // Initialize services after database connection
    this.clickService = null as any;
    this.leaderboardService = null as any;
  }

  // Initialize database and repositories
  private async initializeServices(): Promise<void> {
    await this.dbConnection.connect();
    
    const clickRepo = new ClickRepository(this.dbConnection);
    const leaderboardRepo = new LeaderboardRepository(this.dbConnection);
    
    this.clickService = new ClickService(clickRepo);
    this.leaderboardService = new LeaderboardService(leaderboardRepo);
  }

  // Setup routes
  private setupRoutes(): void {
    this.app
      .use(cors())
      
      // Health check
      .get('/health', () => ({ status: 'ok', timestamp: new Date() }))
      
      // Click endpoints
      .post('/api/click', async ({ body }: any) => {
        const { sessionId } = body;
        const click = await this.clickService.handleClick(sessionId);
        return { success: true, data: click.toJSON() };
      })
      
      .get('/api/clicks/:sessionId', async ({ params }: any) => {
        const click = await this.clickService.getClicksBySession(params.sessionId);
        return { success: true, data: click?.toJSON() || null };
      })
      
      .get('/api/clicks/total', async () => {
        const total = await this.clickService.getTotalClicks();
        return { success: true, total };
      })
      
      // Leaderboard endpoints
      .get('/api/leaderboard', async ({ query }: any) => {
        const limit = parseInt(query.limit || '10');
        const entries = await this.leaderboardService.getTopPlayers(limit);
        return { 
          success: true, 
          data: entries.map(e => e.toJSON()) 
        };
      })
      
      .post('/api/leaderboard', async ({ body }: any) => {
        const { username, clicks } = body;
        const entry = await this.leaderboardService.updatePlayerScore(username, clicks);
        return { success: true, data: entry.toJSON() };
      })
      
      .post('/api/leaderboard/refresh', async () => {
        await this.leaderboardService.refreshRankings();
        return { success: true, message: 'Rankings refreshed' };
      })

      .delete('/api/leaderboard/:username', async ({ params }: any) => {
        const { username } = params;
        await this.leaderboardService.removePlayer(username);
        return { success: true, message: `Player ${username} removed from leaderboard` };
      });
  }

  // Start application
  public async start(): Promise<void> {
    try {
      await this.initializeServices();
      this.setupRoutes();
      
      this.app.listen(this.config.apiPort);
      
      console.log(`
🚀 Popcat API Server Started!
📡 Port: ${this.config.apiPort}
🗄️  Database: Connected
      `);
    } catch (error) {
      console.error('Failed to start application:', error);
      process.exit(1);
    }
  }

  // Graceful shutdown
  public async stop(): Promise<void> {
    await this.dbConnection.disconnect();
    console.log('Application stopped');
  }
}
