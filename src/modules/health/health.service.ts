import os from 'os';

class HealthService {
  getStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSec: Math.round(process.uptime()),
      hostname: os.hostname(),
      pid: process.pid
    } as const;
  }
}

export const healthService = new HealthService();