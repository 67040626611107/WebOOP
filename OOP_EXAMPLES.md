# 🎯 OOP PRINCIPLES - CODE EXAMPLES

เอกสารนี้แสดงตัวอย่างโค้ดจริงของหลักการ OOP ทั้ง 6 แบบในโปรเจคนี้

---

## 1️⃣ Constructor (ตัวสร้าง)

### คืออะไร?
Method พิเศษที่ถูกเรียกเมื่อสร้าง object ใหม่ ใช้กำหนดค่าเริ่มต้น

### ตัวอย่างจากโค้ด

**File: backend/src/entities/Click.ts**
```typescript
export class Click extends BaseEntity {
  private count: number;
  private sessionId: string;

  // Constructor - รับค่าเริ่มต้น
  constructor(sessionId: string, count: number = 0, id?: ObjectId) {
    super(id);  // เรียก parent constructor
    this.sessionId = sessionId;  // กำหนดค่า
    this.count = count;
  }
}

// การใช้งาน:
const click = new Click("session123", 10);
```

**File: backend/src/entities/LeaderboardEntry.ts**
```typescript
constructor(username: string, totalClicks: number, rank: number = 0, id?: ObjectId) {
  super(id);
  this.username = username;
  this.totalClicks = totalClicks;
  this.rank = rank;
}
```

**File: backend/src/services/ClickService.ts**
```typescript
export class ClickService extends BaseService<Click> {
  // Constructor รับ dependency
  constructor(private clickRepository: ClickRepository) {
    super();  // เรียก parent constructor
  }
}
```

### ประโยชน์:
- กำหนดค่าเริ่มต้นให้ object
- รับ dependencies (Dependency Injection)
- Setup การทำงานเบื้องต้น

---

## 2️⃣ Encapsulation (การห่อหุ้มข้อมูล)

### คืออะไร?
การซ่อนข้อมูลภายใน class และเข้าถึงผ่าน methods เท่านั้น

### ตัวอย่างจากโค้ด

**File: backend/src/entities/Click.ts**
```typescript
export class Click extends BaseEntity {
  // Private - ซ่อนข้อมูล ไม่ให้เข้าถึงจากภายนอก
  private count: number;
  private sessionId: string;

  // Getter - อ่านค่าได้อย่างเดียว
  get clickCount(): number {
    return this.count;
  }

  get session(): string {
    return this.sessionId;
  }

  // Setter with Validation - เขียนค่าพร้อมตรวจสอบ
  setCount(value: number): void {
    if (value < 0) {
      throw new Error('Count cannot be negative');
    }
    this.count = value;
    this.updateTimestamp();
  }

  // Public method
  increment(): void {
    this.count++;  // เข้าถึง private ภายใน class ได้
    this.updateTimestamp();
  }
}

// การใช้งาน:
const click = new Click("session123", 5);
console.log(click.clickCount);  // ✅ อ่านได้
// click.count = 10;  // ❌ Error! private
click.setCount(10);  // ✅ ต้องผ่าน setter
click.increment();   // ✅ เพิ่มค่าผ่าน method
```

**File: backend/src/config/Config.ts**
```typescript
export class Config {
  private static instance: Config;
  private env: NodeJS.ProcessEnv;  // Private - ซ่อนข้อมูล

  private constructor() {  // Private constructor
    config();
    this.env = process.env;
  }

  // Getter - เข้าถึงข้อมูลผ่าน method
  get mongoUri(): string {
    return this.env.MONGODB_URI || 'mongodb://localhost:27017/popcat';
  }

  get apiPort(): number {
    return parseInt(this.env.API_PORT || '3001');
  }
}
```

### ประโยชน์:
- ป้องกันการแก้ไขข้อมูลโดยตรง
- Validation ก่อนเปลี่ยนค่า
- ควบคุมการเข้าถึงข้อมูล
- ลด coupling

---

## 3️⃣ Inheritance (การสืบทอด)

### คืออะไร?
Child class สืบทอด properties และ methods จาก Parent class

### ตัวอย่างจากโค้ด

**File: backend/src/entities/BaseEntity.ts (Parent)**
```typescript
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

  protected updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  abstract toJSON(): Record<string, any>;
}
```

**File: backend/src/entities/Click.ts (Child)**
```typescript
// Click สืบทอดจาก BaseEntity
export class Click extends BaseEntity {
  private count: number;

  constructor(sessionId: string, count: number = 0, id?: ObjectId) {
    super(id);  // เรียก parent constructor
    this.count = count;
  }

  // ใช้ method จาก parent
  increment(): void {
    this.count++;
    this.updateTimestamp();  // ✅ ได้รับจาก parent
  }

  // ใช้ getter จาก parent
  getClickId(): string | undefined {
    return this.id;  // ✅ ได้รับจาก parent
  }

  // Override abstract method
  toJSON(): Record<string, any> {
    return {
      _id: this._id,
      count: this.count,
      createdAt: this.createdAt,  // ✅ ได้รับจาก parent
      updatedAt: this.updatedAt,  // ✅ ได้รับจาก parent
    };
  }
}
```

**File: backend/src/services/ClickService.ts**
```typescript
// BaseService (Parent)
export abstract class BaseService<T> {
  abstract processData(data: T): Promise<T>;
  
  protected log(message: string): void {
    console.log(`[${this.constructor.name}] ${message}`);
  }
}

// ClickService (Child)
export class ClickService extends BaseService<Click> {
  async handleClick(sessionId: string): Promise<Click> {
    this.log(`Handling click`);  // ✅ ใช้ method จาก parent
    // ...
  }
}
```

**Frontend Example:**
```typescript
// frontend/src/lib/api/BaseApiClient.ts (Parent)
export abstract class BaseApiClient {
  protected baseUrl: string;
  
  protected async get<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET' });
  }
}

// frontend/src/lib/api/PopcatApiClient.ts (Child)
export class PopcatApiClient extends BaseApiClient {
  async getTotalClicks(): Promise<ApiResponse<number>> {
    return this.get<ApiResponse<number>>('/api/clicks/total');
    // ✅ ใช้ get() จาก parent
  }
}
```

### ประโยชน์:
- Code Reuse - ไม่ต้องเขียนซ้ำ
- Hierarchy ที่ชัดเจน
- Easy Maintenance
- DRY Principle

---

## 4️⃣ Abstraction (การทำนามธรรม)

### คืออะไร?
กำหนดโครงสร้างโดยไม่บอกรายละเอียด ให้ child class implement เอง

### ตัวอย่างจากโค้ด

**File: backend/src/entities/BaseEntity.ts**
```typescript
// Abstract class - ไม่สามารถสร้าง instance ได้โดยตรง
export abstract class BaseEntity {
  protected _id?: ObjectId;
  
  constructor(id?: ObjectId) {
    this._id = id;
  }

  // Abstract methods - ต้อง implement ใน child class
  abstract toJSON(): Record<string, any>;
  abstract validate(): boolean;

  // Concrete method - มี implementation
  protected updateTimestamp(): void {
    this.updatedAt = new Date();
  }
}

// ❌ ทำไม่ได้:
// const entity = new BaseEntity();

// ✅ ต้อง extend และ implement:
export class Click extends BaseEntity {
  // บังคับต้อง implement
  toJSON(): Record<string, any> {
    return { /* ... */ };
  }

  validate(): boolean {
    return this.count >= 0;
  }
}
```

**File: backend/src/services/BaseService.ts**
```typescript
export abstract class BaseService<T> {
  // Abstract methods - child ต้อง implement
  abstract processData(data: T): Promise<T>;
  abstract validateInput(data: any): boolean;
  
  // Concrete method
  protected log(message: string): void {
    console.log(`[${this.constructor.name}] ${message}`);
  }
}

// Child class ต้อง implement abstract methods
export class ClickService extends BaseService<Click> {
  // ✅ บังคับต้องมี
  async processData(data: Click): Promise<Click> {
    this.log('Processing click data');
    return await this.clickRepository.create(data);
  }

  // ✅ บังคับต้องมี
  validateInput(data: any): boolean {
    return data && typeof data.session === 'string';
  }
}
```

**File: frontend/src/lib/api/BaseApiClient.ts**
```typescript
export abstract class BaseApiClient {
  protected baseUrl: string;

  // Abstract methods - ต้อง implement
  protected abstract handleResponse<T>(response: Response): Promise<T>;
  protected abstract handleError(error: any): void;

  // Concrete method
  protected async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return await this.handleResponse<T>(response);  // เรียก abstract
  }
}

// PopcatApiClient ต้อง implement
export class PopcatApiClient extends BaseApiClient {
  protected async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) throw new Error('HTTP error');
    return await response.json();
  }

  protected handleError(error: any): void {
    console.error('[PopcatApiClient] Error:', error);
  }
}
```

### ประโยชน์:
- กำหนด Contract ที่ชัดเจน
- บังคับให้ implement methods
- ซ่อนรายละเอียดที่ไม่จำเป็น
- เพิ่ม Flexibility

---

## 5️⃣ Polymorphism (พหุสัณฐาน)

### คืออะไร?
Object ต่างชนิดสามารถใช้ interface เดียวกัน แต่ทำงานต่างกันได้

### ตัวอย่างจากโค้ด

**File: backend/src/repositories/IRepository.ts**
```typescript
// Interface เดียว
export interface IRepository<T> {
  create(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, entity: T): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<T[]>;
}

// Extension สำหรับ Click
export interface IClickRepository extends IRepository<any> {
  findBySessionId(sessionId: string): Promise<any | null>;
  incrementClick(sessionId: string): Promise<any>;
}

// Extension สำหรับ Leaderboard
export interface ILeaderboardRepository extends IRepository<any> {
  findTopPlayers(limit: number): Promise<any[]>;
  updateRankings(): Promise<void>;
}
```

**Implementation แตกต่างกัน:**

**File: backend/src/repositories/ClickRepository.ts**
```typescript
export class ClickRepository implements IClickRepository {
  // Implementation สำหรับ Click
  async create(entity: Click): Promise<Click> {
    const result = await this.collection.insertOne(entity.toJSON());
    return new Click(entity.session, entity.clickCount, result.insertedId);
  }

  // Polymorphism - method เฉพาะ Click
  async incrementClick(sessionId: string): Promise<Click> {
    const existing = await this.findBySessionId(sessionId);
    if (existing) {
      existing.increment();
      await this.collection.updateOne(/* ... */);
      return existing;
    }
    // ...
  }
}
```

**File: backend/src/repositories/LeaderboardRepository.ts**
```typescript
export class LeaderboardRepository implements ILeaderboardRepository {
  // Implementation สำหรับ Leaderboard - ต่างจาก ClickRepository
  async create(entity: LeaderboardEntry): Promise<LeaderboardEntry> {
    const result = await this.collection.insertOne(entity.toJSON());
    return new LeaderboardEntry(
      entity.playerName,
      entity.clicks,
      entity.position,
      result.insertedId
    );
  }

  // Polymorphism - method เฉพาะ Leaderboard
  async findTopPlayers(limit: number): Promise<LeaderboardEntry[]> {
    const docs = await this.collection
      .find()
      .sort({ totalClicks: -1 })
      .limit(limit)
      .toArray();
    return docs.map(doc => new LeaderboardEntry(/* ... */));
  }
}
```

**การใช้งาน Polymorphism:**
```typescript
// ใช้ interface เดียวกัน แต่ behavior ต่างกัน
class Service<T> {
  constructor(private repository: IRepository<T>) {}
  
  async getById(id: string): Promise<T | null> {
    // เรียก method เดียวกัน แต่ implementation ต่างกัน
    return await this.repository.findById(id);
  }
}

const clickService = new Service(new ClickRepository());
const leaderboardService = new Service(new LeaderboardRepository());

// เรียก method เดียวกัน แต่ทำงานต่างกัน
await clickService.getById("123");  // ค้นหา Click
await leaderboardService.getById("456");  // ค้นหา LeaderboardEntry
```

**Method Overriding:**
```typescript
// Parent
class BaseService {
  protected log(message: string): void {
    console.log(message);
  }
}

// Child 1
class ClickService extends BaseService {
  protected log(message: string): void {
    console.log(`[CLICK] ${message}`);  // Override
  }
}

// Child 2
class LeaderboardService extends BaseService {
  protected log(message: string): void {
    console.log(`[LEADERBOARD] ${message}`);  // Override ต่างกัน
  }
}
```

### ประโยชน์:
- Interface เดียว หลาย implementations
- Flexible และ Extensible
- ลด coupling
- Easy to test

---

## 6️⃣ Composition (การประกอบ)

### คืออะไร?
รวม objects หลายตัวเข้าด้วยกัน (Has-A relationship)

### ตัวอย่างจากโค้ด

**File: backend/src/Application.ts**
```typescript
export class PopcatApplication {
  // Composition - ประกอบด้วย objects อื่น
  private app: Elysia;
  private config: Config;
  private dbConnection: DatabaseConnection;
  private clickService: ClickService;
  private leaderboardService: LeaderboardService;

  constructor() {
    // สร้าง objects ที่ต้องการ
    this.config = Config.getInstance();
    this.dbConnection = DatabaseConnection.getInstance(this.config.mongoUri);
    this.app = new Elysia();
  }

  private async initializeServices(): Promise<void> {
    await this.dbConnection.connect();
    
    // สร้าง repositories
    const clickRepo = new ClickRepository(this.dbConnection);
    const leaderboardRepo = new LeaderboardRepository(this.dbConnection);
    
    // สร้าง services ด้วย repositories
    this.clickService = new ClickService(clickRepo);
    this.leaderboardService = new LeaderboardService(leaderboardRepo);
  }

  // ใช้งาน services
  private setupRoutes(): void {
    this.app.post('/api/click', async ({ body }: any) => {
      const click = await this.clickService.handleClick(body.sessionId);
      return { success: true, data: click.toJSON() };
    });
  }
}
```

**File: backend/src/services/ClickService.ts**
```typescript
export class ClickService extends BaseService<Click> {
  // Composition - มี ClickRepository
  constructor(private clickRepository: ClickRepository) {
    super();
  }

  async handleClick(sessionId: string): Promise<Click> {
    // ใช้งาน repository
    const click = await this.clickRepository.incrementClick(sessionId);
    return click;
  }
}
```

**File: backend/src/repositories/ClickRepository.ts**
```typescript
export class ClickRepository implements IClickRepository {
  private collection: Collection;
  
  // Composition - มี DatabaseConnection
  constructor(private dbConnection: DatabaseConnection) {
    this.collection = this.dbConnection.getDatabase().collection('clicks');
  }

  async create(entity: Click): Promise<Click> {
    // ใช้งาน collection
    const result = await this.collection.insertOne(entity.toJSON());
    return new Click(entity.session, entity.clickCount, result.insertedId);
  }
}
```

**Frontend Example:**
```typescript
// frontend/src/components/PopcatButton.tsx
export default function PopcatButton() {
  // Composition - ใช้ API Client และ State Manager
  const apiClient = PopcatApiClient.getInstance();
  const stateManager = GameStateManager.getInstance();

  const handleClick = async () => {
    stateManager.incrementClick();  // ใช้ state manager
    
    const state = stateManager.getState();
    await apiClient.recordClick(state.sessionId);  // ใช้ api client
  };

  return <button onClick={handleClick}>Click!</button>;
}
```

**Relationship Chart:**
```
PopcatApplication
├── Config (has-a)
├── DatabaseConnection (has-a)
├── ClickService (has-a)
│   └── ClickRepository (has-a)
│       └── DatabaseConnection (has-a)
└── LeaderboardService (has-a)
    └── LeaderboardRepository (has-a)
        └── DatabaseConnection (has-a)
```

### ประโยชน์:
- Flexible - เปลี่ยน components ได้ง่าย
- Reusable - ใช้ซ้ำได้
- Loosely Coupled
- Easy to Test (Mock dependencies)
- Single Responsibility

---

## 🎯 สรุปการใช้งานทั้ง 6 หลักการ

| หลักการ | ใช้ที่ไหน | ประโยชน์หลัก |
|---------|----------|--------------|
| **Constructor** | ทุก Class | กำหนดค่าเริ่มต้น, DI |
| **Encapsulation** | Entities, Config | ป้องกันข้อมูล, Validation |
| **Inheritance** | Entities, Services | Code Reuse, Hierarchy |
| **Abstraction** | Base Classes | Contract, Flexibility |
| **Polymorphism** | Repositories | Interface เดียว, หลาย implementations |
| **Composition** | Application, Services | Has-A, Loose Coupling |

---

## 💡 Best Practices

1. **Constructor**: ใช้สำหรับ setup เท่านั้น ไม่ทำ logic ซับซ้อน
2. **Encapsulation**: Private by default, Expose เฉพาะที่จำเป็น
3. **Inheritance**: ใช้เมื่อมี IS-A relationship
4. **Abstraction**: กำหนด Contract ที่ชัดเจน
5. **Polymorphism**: Interface > Implementation
6. **Composition**: ใช้แทน Inheritance เมื่อมี HAS-A relationship

---

Made with ❤️ and Clean OOP Principles
