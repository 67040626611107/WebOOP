import { BaseStateManager } from './BaseStateManager';

export interface GameState {
  clicks: number;
  sessionId: string;
  isClicking: boolean;
  username: string;
}

export class GameStateManager extends BaseStateManager<GameState> {
  private static instance: GameStateManager;

  private constructor() {
    const sessionId = typeof window !== 'undefined' 
      ? localStorage.getItem('sessionId') || GameStateManager.generateSessionId()
      : GameStateManager.generateSessionId();

    super({
      clicks: 0,
      sessionId,
      isClicking: false,
      username: '',
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionId', sessionId);
    }
  }

  public static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setState(newState: Partial<GameState>): void {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  reset(): void {
    this.state = {
      ...this.state,
      clicks: 0,
      isClicking: false,
    };
    this.notifyListeners();
  }

  incrementClick(): void {
    this.state.clicks++;
    this.state.isClicking = true;
    this.notifyListeners();

    setTimeout(() => {
      this.state.isClicking = false;
      this.notifyListeners();
    }, 100);
  }

  setUsername(username: string): void {
    this.state.username = username;
    if (typeof window !== 'undefined') {
      localStorage.setItem('username', username);
    }
    this.notifyListeners();
  }

  loadUsername(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('username');
      if (saved) {
        this.state.username = saved;
        this.notifyListeners();
      }
    }
  }
}
