
export interface IRepository<T> {
  create(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, entity: T): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<T[]>;
}

export interface IClickRepository extends IRepository<any> {
  findBySessionId(sessionId: string): Promise<any | null>;
  incrementClick(sessionId: string): Promise<any>;
}

export interface ILeaderboardRepository extends IRepository<any> {
  findTopPlayers(limit: number): Promise<any[]>;
  updateRankings(): Promise<void>;
}
