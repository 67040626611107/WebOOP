# 🚀 POPCAT GAME - QUICK START GUIDE

## 📦 ไฟล์ที่คุณได้รับ

โปรเจคนี้มี **31 ไฟล์** แบ่งเป็น:
- Backend (Elysia + MongoDB): 14 ไฟล์
- Frontend (Next.js): 15 ไฟล์
- Config files: 2 ไฟล์

---

## 🎯 หลักการ OOP ที่ใช้ทั้งหมด

### ✅ 1. Constructor (ตัวสร้าง)
**ที่ไหน:** ทุก Class
```typescript
// backend/src/entities/Click.ts
constructor(sessionId: string, count: number = 0, id?: ObjectId) {
  super(id);
  this.sessionId = sessionId;
  this.count = count;
}
```

### ✅ 2. Encapsulation (การห่อหุ้ม)
**ที่ไหน:** entities/Click.ts, entities/LeaderboardEntry.ts
```typescript
private count: number;  // ซ่อนข้อมูล

get clickCount(): number {  // getter
  return this.count;
}

setCount(value: number): void {  // setter with validation
  if (value < 0) throw new Error('Count cannot be negative');
  this.count = value;
}
```

### ✅ 3. Inheritance (การสืบทอด)
**ที่ไหน:** หลายจุด
```typescript
// Backend
- Click extends BaseEntity
- LeaderboardEntry extends BaseEntity
- ClickService extends BaseService
- LeaderboardService extends BaseService

// Frontend
- PopcatApiClient extends BaseApiClient
- GameStateManager extends BaseStateManager
```

### ✅ 4. Abstraction (การทำนามธรรม)
**ที่ไหน:** BaseEntity.ts, BaseService.ts, BaseApiClient.ts
```typescript
// backend/src/entities/BaseEntity.ts
export abstract class BaseEntity {
  abstract toJSON(): Record<string, any>;
  abstract validate(): boolean;
}
```

### ✅ 5. Polymorphism (พหุสัณฐาน)
**ที่ไหน:** repositories/IRepository.ts
```typescript
// Interface เดียวกัน แต่ implementation ต่างกัน
export interface IRepository<T> {
  create(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
}

// ClickRepository และ LeaderboardRepository implement ต่างกัน
```

### ✅ 6. Composition (การประกอบ)
**ที่ไหน:** Application.ts, Services, Components
```typescript
// backend/src/Application.ts
export class PopcatApplication {
  private dbConnection: DatabaseConnection;  // Has-A
  private clickService: ClickService;        // Has-A
  private leaderboardService: LeaderboardService;  // Has-A
}
```

---

## 📁 โครงสร้างโปรเจค

```
popcat-game/
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── README.md            # เอกสารหลัก
│
├── backend/             # API Server (Elysia + MongoDB)
│   ├── package.json
│   └── src/
│       ├── index.ts                    # Entry point
│       ├── Application.ts              # Main app (Composition)
│       │
│       ├── config/
│       │   └── Config.ts              # Singleton config
│       │
│       ├── database/
│       │   └── DatabaseConnection.ts  # Singleton DB connection
│       │
│       ├── entities/                  # Domain models
│       │   ├── BaseEntity.ts         # Abstract base (Abstraction)
│       │   ├── Click.ts              # Click entity (Inheritance, Encapsulation)
│       │   └── LeaderboardEntry.ts   # Leaderboard entity
│       │
│       ├── repositories/              # Data access layer
│       │   ├── IRepository.ts        # Interface (Polymorphism)
│       │   ├── ClickRepository.ts    # Click data access
│       │   └── LeaderboardRepository.ts
│       │
│       └── services/                  # Business logic
│           ├── BaseService.ts        # Abstract service
│           ├── ClickService.ts       # Click business logic
│           └── LeaderboardService.ts
│
└── frontend/            # Web App (Next.js 14)
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    │
    └── src/
        ├── app/                       # Next.js App Router
        │   ├── page.tsx              # Main page
        │   ├── layout.tsx            # Root layout
        │   └── globals.css           # Global styles
        │
        ├── components/                # React components
        │   ├── PopcatButton.tsx      # Main game button
        │   ├── Leaderboard.tsx       # Leaderboard display
        │   └── UsernameForm.tsx      # Username input
        │
        └── lib/                       # Libraries
            ├── api/
            │   ├── BaseApiClient.ts  # Abstract API client
            │   └── PopcatApiClient.ts # API implementation
            │
            └── state/
                ├── BaseStateManager.ts # Abstract state
                └── GameStateManager.ts # Game state
```

---

## ⚙️ การติดตั้งและรัน

### ขั้นตอนที่ 1: ติดตั้ง MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
ดาวน์โหลดจาก: https://www.mongodb.com/try/download/community

**Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### ขั้นตอนที่ 2: ตั้งค่า Environment

```bash
# คัดลอก .env.example ไปเป็น .env
cp .env.example backend/.env

# แก้ไขค่าใน .env (ถ้าจำเป็น)
MONGODB_URI=mongodb://localhost:27017/popcat
API_PORT=3001
```

### ขั้นตอนที่ 3: รัน Backend

```bash
cd backend

# ติดตั้ง Bun (ถ้ายังไม่มี)
curl -fsSL https://bun.sh/install | bash

# ติดตั้ง dependencies
bun install

# รัน dev server
bun run dev
```

Backend จะรันที่: **http://localhost:3001**

### ขั้นตอนที่ 4: รัน Frontend (Terminal ใหม่)

```bash
cd frontend

# ติดตั้ง dependencies
npm install

# รัน dev server
npm run dev
```

Frontend จะรันที่: **http://localhost:3000**

---

## 🧪 ทดสอบ API

### 1. Health Check
```bash
curl http://localhost:3001/health
```

### 2. Record Click
```bash
curl -X POST http://localhost:3001/api/click \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test123"}'
```

### 3. Get Total Clicks
```bash
curl http://localhost:3001/api/clicks/total
```

### 4. Get Leaderboard
```bash
curl http://localhost:3001/api/leaderboard?limit=10
```

---

## 🎮 การใช้งาน

1. เปิดเว็บที่ http://localhost:3000
2. กรอก Username
3. คลิกที่แมว 😸 ให้เร็วที่สุด!
4. ดูคะแนนใน Leaderboard

---

## 📊 Features

### Backend Features
- ✅ RESTful API ด้วย Elysia
- ✅ MongoDB integration
- ✅ Repository Pattern
- ✅ Service Layer
- ✅ OOP Architecture
- ✅ Type Safety
- ✅ Error Handling

### Frontend Features
- ✅ Next.js 14 App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Real-time Updates
- ✅ State Management
- ✅ Responsive Design
- ✅ Modern UI/UX

---

## 🎨 Design Patterns

1. **Singleton** - DatabaseConnection, Config, API Client
2. **Repository** - Data access abstraction
3. **Service Layer** - Business logic separation
4. **Observer** - State management
5. **Factory** - Entity creation
6. **Abstract Factory** - Base classes

---

## 📝 API Reference

### Click Endpoints

**POST /api/click**
```json
Request: { "sessionId": "string" }
Response: { "success": true, "data": {...} }
```

**GET /api/clicks/:sessionId**
```json
Response: { "success": true, "data": {...} }
```

**GET /api/clicks/total**
```json
Response: { "success": true, "total": 0 }
```

### Leaderboard Endpoints

**GET /api/leaderboard?limit=10**
```json
Response: { "success": true, "data": [...] }
```

**POST /api/leaderboard**
```json
Request: { "username": "string", "clicks": 0 }
Response: { "success": true, "data": {...} }
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# ตรวจสอบว่า MongoDB รันอยู่
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community
```

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Bun Not Found
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# หรือใช้ npm แทน
cd backend
npm install
npm run dev
```

---

## 🎓 เรียนรู้ OOP จากโค้ดนี้

### ดูตัวอย่างที่:

**Constructor:**
- `backend/src/entities/Click.ts` (line 10-15)
- `backend/src/entities/LeaderboardEntry.ts` (line 6-11)

**Encapsulation:**
- `backend/src/entities/Click.ts` (line 8-9, 17-24)
- Private properties + Getter/Setter

**Inheritance:**
- `backend/src/entities/Click.ts` extends `BaseEntity`
- `backend/src/services/ClickService.ts` extends `BaseService`

**Abstraction:**
- `backend/src/entities/BaseEntity.ts` (abstract class)
- `backend/src/services/BaseService.ts` (abstract methods)

**Polymorphism:**
- `backend/src/repositories/IRepository.ts` (interface)
- Different implementations in repositories

**Composition:**
- `backend/src/Application.ts` (uses multiple services)
- `frontend/src/components/PopcatButton.tsx` (uses API + State)

---

## 📚 ความรู้เพิ่มเติม

### SOLID Principles
- **S**: Single Responsibility - แต่ละ class ทำหน้าที่เดียว
- **O**: Open/Closed - เปิดให้ขยาย ปิดให้แก้ไข
- **L**: Liskov Substitution - Child แทนที่ Parent ได้
- **I**: Interface Segregation - Interface แยกตามหน้าที่
- **D**: Dependency Inversion - พึ่งพา abstractions

### Clean Code
- Type Safety ด้วย TypeScript
- Meaningful names
- Small functions
- Error handling
- Comments where needed

---

## 🎉 Summary

โปรเจคนี้เป็นตัวอย่าง **Production-Ready** ที่:
- ✅ มีหลักการ OOP ครบทั้ง 6 หลักการ
- ✅ ใช้ Design Patterns ที่เหมาะสม
- ✅ Clean Architecture
- ✅ Type Safety
- ✅ Modern Tech Stack
- ✅ Ready to Deploy

**ไม่มีโค้ดงมงาย - ทุกบรรทัดมีความหมาย!** 🚀

---

Made with ❤️ and Clean Code Principles
