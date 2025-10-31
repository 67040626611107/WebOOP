# 🪟 Windows Setup Guide for PopCat Game

## 🚀 RECOMMENDED: Use MongoDB Atlas (Cloud Database)

No need to install MongoDB locally! Use the free cloud database:

1. **Get your MongoDB Atlas connection string** (already provided)
2. **Create `.env` file** from `.env.windows`:
   ```cmd
   copy .env.windows .env
   ```
3. **Edit `.env`** with your MongoDB Atlas URL
4. **Run the backend** - it will connect to cloud database!

## Quick Start (Easiest Method)

### Option 1: Use the Batch File
```cmd
# Just double-click the file:
run-windows.bat
```

### Option 2: Use PowerShell
```powershell
# Right-click and "Run with PowerShell":
run-windows.ps1
```

These scripts will automatically:
- Check if MongoDB is installed
- Use mock server if MongoDB is not available
- Start both backend and frontend servers
- Open the game in your browser

---

## Manual Setup for Windows

### Prerequisites
1. **Node.js** (Download from https://nodejs.org/)
2. **Bun** (Install via PowerShell as Administrator):
   ```powershell
   powershell -c "irm bun.sh/install.ps1 | iex"
   ```

### Step 1: Install Dependencies

Open Command Prompt or PowerShell in the project folder:

```cmd
# Backend dependencies
cd backend
bun install

# Frontend dependencies (new terminal)
cd frontend
npm install
```

### Step 2: MongoDB Setup (Choose One)

#### Option A: Install MongoDB Locally
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer as Administrator
3. Choose "Complete" installation
4. Install as Windows Service (recommended)
5. Start MongoDB:
   ```cmd
   net start MongoDB
   ```

#### Option B: Use Mock Server (No Database)
Skip MongoDB installation and use the mock server:
```cmd
cd backend
bun run src/mock-server.ts
```

#### Option C: Use MongoDB Atlas (Cloud)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Update `.env` with your connection string

### Step 3: Configure Environment
```cmd
# Copy environment template
copy .env.example .env

# Edit .env file with notepad
notepad .env
```

### Step 4: Run the Servers

**Terminal 1 - Backend:**
```cmd
cd backend
bun run dev
# OR if MongoDB not installed:
bun run src/mock-server.ts
```

**Terminal 2 - Frontend:**
```cmd
cd frontend
npm run dev
```

### Step 5: Open the Game
Open your browser and go to: http://localhost:3000

---

## Common Windows Issues

### Issue: MongoDB Connection Failed
**Error:** `connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Check if MongoDB is running:
   ```cmd
   sc query MongoDB
   ```
2. Start MongoDB service:
   ```cmd
   net start MongoDB
   ```
3. Or use the mock server instead:
   ```cmd
   cd backend
   bun run src/mock-server.ts
   ```

### Issue: Port Already in Use
**Error:** `Port 3000/3001 is already in use`

**Solution:**
```cmd
# Find and kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID [PID_NUMBER] /F

# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### Issue: Bun Command Not Found
**Solution:**
1. Restart your terminal after installation
2. Or use npm instead:
   ```cmd
   cd backend
   npm install
   npm run dev
   ```

### Issue: Permission Denied
**Solution:**
Run Command Prompt or PowerShell as Administrator

---

## Windows Firewall

If you can't access the game, Windows Firewall might be blocking it:

1. Open Windows Defender Firewall
2. Click "Allow an app or feature"
3. Add Node.js and Bun to the allowed list
4. Allow both Private and Public networks

---

## Using WSL (Windows Subsystem for Linux)

For a Linux-like experience on Windows:

1. Install WSL2:
   ```powershell
   wsl --install
   ```

2. Install Ubuntu from Microsoft Store

3. In WSL terminal:
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install Bun
   curl -fsSL https://bun.sh/install | bash

   # Install MongoDB
   sudo apt-get install -y mongodb

   # Run the project
   cd /mnt/c/Users/YOUR_USERNAME/Desktop/WebOOP
   # Follow Linux setup instructions
   ```

---

## Quick Commands Reference

| Action | Command |
|--------|---------|
| Start MongoDB | `net start MongoDB` |
| Stop MongoDB | `net stop MongoDB` |
| Check MongoDB Status | `sc query MongoDB` |
| Install Dependencies | `bun install` or `npm install` |
| Run Backend | `bun run dev` |
| Run Mock Server | `bun run src/mock-server.ts` |
| Run Frontend | `npm run dev` |
| Kill Process on Port | `taskkill /PID [PID] /F` |

---

## Need Help?

1. Make sure all prerequisites are installed
2. Try using the mock server if MongoDB issues persist
3. Check that ports 3000 and 3001 are not in use
4. Run terminals as Administrator if permission issues occur

The game should now be running at http://localhost:3000! 🎮