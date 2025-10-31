import { PopcatApplication } from './Application';

// Entry point
const app = new PopcatApplication();

// Start server
app.start();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await app.stop();
  process.exit(0);
});
