# 🐱 Popcat Game - TypeScript Full Stack

เว็บแอปพลิเคชัน Popcat แบบ Modern Stack พร้อมหลักการ OOP ครบถ้วน

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Elysia (Bun), TypeScript
- **Database**: MongoDB
- **Environment**: .env configuration

## 🎯 OOP Principles ที่ใช้

### 1. **Constructor** ()
```typescript
// BaseEntity.ts
constructor(id?: ObjectId) {
  this._id = id;
  this.createdAt = new Date();
  this.updatedAt = new Date();
}
```
ใช้ในทุก Class สำหรับกำหนดค่าเริ่มต้น

### 2. **Encapsulation** ()
```typescript
// Click.ts
private count: number;
private sessionId: string;

get clickCount(): number {
  return this.count;
}

setCount(value: number): void {
  if (value < 0) throw new Error('Count cannot be negative');
  this.count = value;
}
```
- ใช้ `private` ซ่อนข้อมูลภายใน
- ใช้ `getter/setter` เข้าถึงข้อมูลอย่างปลอดภัย

### 3. **Inheritance** ()
```typescript
// Click.ts สืบทอดจาก BaseEntity.ts
export class Click extends BaseEntity {
  // สืบทอด properties และ methods
}
```
- `BaseEntity` เป็น parent class
- `Click`, `LeaderboardEntry` เป็น child classes

### 4. **Abstraction** ()
```typescript
// BaseEntity.ts
export abstract class BaseEntity {
  abstract toJSON(): Record<string, any>;
  abstract validate(): boolean;
}
```
- กำหนด interface ที่ child class ต้อง implement
- ซ่อนรายละเอียดการทำงานภายใน

### 5. **Polymorphism** ()
```typescript
// IRepository.ts
export interface IRepository<T> {
  create(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
}

// ClickRepository และ LeaderboardRepository implement แตกต่างกัน
```
- Interface เดียวกัน แต่ implementation ต่างกัน
- Method overriding ใน child classes

### 6. **Composition** (การประกอบ)
```typescript
// PopcatApplication.ts
export class PopcatApplication {
  private dbConnection: DatabaseConnection;
  private clickService: ClickService;
  private leaderboardService: LeaderboardService;
  
  constructor() {
    this.dbConnection = DatabaseConnection.getInstance(...);
    // ใช้งาน classes อื่นภายใน
  }
}
```
- ใช้ Has-A relationship
- รวม objects หลายตัวเข้าด้วยกัน

## 📁 โครงสร้างโปรเจค

```
popcat-game/
├── backend/
│   ├── src/
│   │   ├── entities/          # Entity classes (OOP)
│   │   │   ├── BaseEntity.ts       # Abstract base
│   │   │   ├── Click.ts            # Inheritance
│   │   │   └── LeaderboardEntry.ts
│   │   ├── repositories/      # Repository pattern
│   │   │   ├── IRepository.ts      # Polymorphism
│   │   │   ├── ClickRepository.ts
│   │   │   └── LeaderboardRepository.ts
│   │   ├── services/          # Business logic
│   │   │   ├── BaseService.ts      # Abstract service
│   │   │   ├── ClickService.ts
│   │   │   └── LeaderboardService.ts
│   │   ├── database/          # Database connection
│   │   │   └── DatabaseConnection.ts # Singleton
│   │   ├── config/            # Configuration
│   │   │   └── Config.ts           # Singleton
│   │   ├── Application.ts     # Main app (Composition)
│   │   └── index.ts          # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js app router
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/       # React components
│   │   │   ├── PopcatButton.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   └── UsernameForm.tsx
│   │   └── lib/              # Libraries (OOP)
│   │       ├── api/
│   │       │   ├── BaseApiClient.ts    # Abstract
│   │       │   └── PopcatApiClient.ts  # Inheritance
│   │       └── state/
│   │           ├── BaseStateManager.ts # Abstract
│   │           └── GameStateManager.ts # Inheritance
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
│
└── .env.example
```

## 🛠️ การติดตั้ง

### 1. ติดตั้ง MongoDB
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community

# หรือใช้ Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. ตั้งค่า Environment Variables
```bash
cp .env.example .env
# แก้ไขค่าใน .env ตามต้องการ
```

**Environment Variables:**
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/popcat

# Backend Server Configuration
BACKEND_PORT=3001     # Port สำหรับ Backend API

# Frontend Server Configuration
FRONTEND_PORT=3000    # Port สำหรับ Frontend Web

# Frontend API URL (ต้องตรงกับ BACKEND_PORT)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. ติดตั้ง Dependencies

**Backend:**
```bash
cd backend
bun install
# หรือ npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

## 🚀 การรัน

### Development Mode

**Terminal 1 - MongoDB:**
```bash
mongod --dbpath ~/data/db
```

**Terminal 2 - Backend:**
```bash
cd backend
bun run dev
# API จะรันที่ http://localhost:3001
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
# เว็บจะรันที่ http://localhost:3000
```

## 📝 API Endpoints

### Click APIs
- `POST /api/click` - บันทึกการคลิก
- `GET /api/clicks/:sessionId` - ดูจำนวนคลิกของ session
- `GET /api/clicks/total` - ดูจำนวนคลิกทั้งหมด

### Leaderboard APIs
- `GET /api/leaderboard?limit=10` - ดู top players
- `POST /api/leaderboard` - อัพเดทคะแนน
- `POST /api/leaderboard/refresh` - รีเฟรช rankings

## 🎨 Features

- ✅ Click Counter แบบ Real-time
- ✅ Global Leaderboard
- ✅ Session Management
- ✅ Username System
- ✅ Responsive Design
- ✅ Modern UI/UX
- ✅ Type Safety (TypeScript)
- ✅ Clean Architecture

## 🧪 Design Patterns ที่ใช้

1. **Singleton Pattern** - DatabaseConnection, Config
2. **Repository Pattern** - Data access layer
3. **Service Pattern** - Business logic layer
4. **Observer Pattern** - State management
5. **Factory Pattern** - Entity creation
6. **Abstract Factory** - Base classes

## 📚 หลักการ SOLID

- **S**ingle Responsibility - แต่ละ class ทำหน้าที่เดียว
- **O**pen/Closed - เปิดให้ขยาย ปิดให้แก้ไข
- **L**iskov Substitution - Child class แทนที่ Parent ได้
- **I**nterface Segregation - Interface แยกตามหน้าที่
- **D**ependency Inversion - พึ่งพา abstractions

## 🎓 การเรียนรู้ OOP จาก Code นี้

### ดูตัวอย่างที่:
1. **Constructor** → `entities/Click.ts`, `entities/LeaderboardEntry.ts`
2. **Encapsulation** → `entities/Click.ts` (private + getter/setter)
3. **Inheritance** → `Click extends BaseEntity`
4. **Abstraction** → `BaseEntity.ts`, `BaseService.ts`
5. **Polymorphism** → `IRepository.ts` interface
6. **Composition** → `Application.ts`, `ClickService.ts`

## 🔒 Security

- Input validation ในทุก layer
- Type safety ด้วย TypeScript
- Encapsulation ป้องกันการเข้าถึงข้อมูล
- Environment variables สำหรับ sensitive data

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ

---

**สร้างด้วย ❤️ และหลักการ OOP ที่ดี**
