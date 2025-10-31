import { MongoClient, Db } from 'mongodb';

// Singleton Pattern สำหรับ Database Connection
export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private client: MongoClient | null = null;
  private database: Db | null = null;
  private readonly uri: string;

  // Private constructor - Singleton Pattern
  private constructor(uri: string) {
    this.uri = uri;
  }

  // Singleton getInstance
  public static getInstance(uri?: string): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      if (!uri) {
        throw new Error('URI is required for first initialization');
      }
      DatabaseConnection.instance = new DatabaseConnection(uri);
    }
    return DatabaseConnection.instance;
  }

  // Connect to MongoDB
  public async connect(dbName: string = 'popcat'): Promise<Db> {
    if (this.database) {
      return this.database;
    }

    try {
      this.client = new MongoClient(this.uri);
      await this.client.connect();
      this.database = this.client.db(dbName);
      console.log('✅ Connected to MongoDB');
      return this.database;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  // Get database instance
  public getDatabase(): Db {
    if (!this.database) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.database;
  }

  // Disconnect
  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.database = null;
      this.client = null;
      console.log('✅ Disconnected from MongoDB');
    }
  }
}
