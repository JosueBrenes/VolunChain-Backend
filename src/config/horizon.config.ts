import dotenv from 'dotenv';

dotenv.config();

export const horizonConfig = {
  url: process.env.HORIZON_URL || 'https://horizon-testnet.stellar.org',
  network: process.env.STELLAR_NETWORK || 'testnet',
  timeout: 30000, // 30 seconds timeout for API calls
};

// Validate required environment variables
if (!horizonConfig.url) {
  throw new Error('HORIZON_URL environment variable is required');
}

// Network validation
const validNetworks = ['testnet', 'mainnet'];
if (!validNetworks.includes(horizonConfig.network)) {
  throw new Error(`STELLAR_NETWORK must be one of: ${validNetworks.join(', ')}`);
}
