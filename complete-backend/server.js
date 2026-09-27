require('dotenv').config();

const app = require('./src/app');
const connectDatabase = require('./src/db/db');

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(port, '0.0.0.0', () => {
      console.log(`Spotify clone API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start the API:', error.message);
    process.exitCode = 1;
  }
}

startServer();