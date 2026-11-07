import dotenv from 'dotenv';

dotenv.config();

import app from './app';

const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
  console.log(`NCLEX RN Prep API listening on http://localhost:${port}`);
  console.log(`Health check: GET http://localhost:${port}/health`);
});
