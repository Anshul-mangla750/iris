import dotenv from 'dotenv';
dotenv.config();

export default {
  port: parseInt(process.env.PORT || '5000', 10),
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8100',
  nodeEnv: process.env.NODE_ENV || 'development',
};
