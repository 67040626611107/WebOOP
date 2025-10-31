import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

// In-memory storage for mock data
const mockData = {
    totalClicks: 0,
    sessions: new Map<string, number>(),
    leaderboard: [
        { username: 'Player1', score: 1000, timestamp: new Date() },
        { username: 'Player2', score: 800, timestamp: new Date() },
        { username: 'Player3', score: 600, timestamp: new Date() }
    ]
};

const app = new Elysia()
    .use(cors({
        origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
        credentials: true
    }))
    // Click endpoints
    .post('/api/click', ({ body }: any) => {
        const { sessionId } = body || {};

        if (!sessionId) {
            return new Response(JSON.stringify({ error: 'Session ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Increment total clicks
        mockData.totalClicks++;

        // Track session clicks
        const currentClicks = mockData.sessions.get(sessionId) || 0;
        mockData.sessions.set(sessionId, currentClicks + 1);

        return {
            success: true,
            totalClicks: mockData.totalClicks,
            sessionClicks: currentClicks + 1
        };
    })
    .get('/api/clicks/total', () => {
        return { totalClicks: mockData.totalClicks };
    })
    .get('/api/clicks/:sessionId', ({ params }) => {
        const clicks = mockData.sessions.get(params.sessionId) || 0;
        return { sessionId: params.sessionId, clicks };
    })

    // Leaderboard endpoints
    .get('/api/leaderboard', ({ query }) => {
        const limit = parseInt(query?.limit as string) || 10;
        return mockData.leaderboard.slice(0, limit);
    })
    .post('/api/leaderboard', ({ body }: any) => {
        const { username, score } = body || {};

        if (!username || score === undefined) {
            return new Response(JSON.stringify({ error: 'Username and score are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Add or update player in leaderboard
        const existingIndex = mockData.leaderboard.findIndex(
            entry => entry.username === username
        );

        if (existingIndex !== -1) {
            mockData.leaderboard[existingIndex].score = score;
            mockData.leaderboard[existingIndex].timestamp = new Date();
        } else {
            mockData.leaderboard.push({ username, score, timestamp: new Date() });
        }

        // Sort leaderboard by score
        mockData.leaderboard.sort((a, b) => b.score - a.score);

        return { success: true, rank: mockData.leaderboard.findIndex(e => e.username === username) + 1 };
    })
    .post('/api/leaderboard/refresh', () => {
        // In a real app, this would recalculate rankings
        mockData.leaderboard.sort((a, b) => b.score - a.score);
        return { success: true, message: 'Leaderboard refreshed' };
    })

    // Health check
    .get('/health', () => ({ status: 'ok', message: 'Mock server is running' }))
    .listen(3001);

console.log(`🎮 PopCat Mock Backend running at http://localhost:3001`);
console.log(`📝 This is a mock server - data is stored in memory only`);
console.log(`🔗 Frontend should be accessible at http://localhost:3002`);