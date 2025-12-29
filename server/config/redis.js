
import Redis from 'ioredis';
let redis;
try {
	if (process.env.REDIS_URL) {
		redis = new Redis(process.env.REDIS_URL);
		redis.on('error', (err) => {
			if (process.env.NODE_ENV === 'development') {
				console.warn('[redis] connection error (ignored in dev):', err.message);
			} else {
				console.error('[redis] connection error:', err);
			}
		});
	} else {
		throw new Error('No REDIS_URL set');
	}
} catch (e) {
	// Fallback mock for dev
	redis = {
		get: async () => null,
		set: async () => 'OK',
		del: async () => 1,
		on: () => {},
	};
	if (process.env.NODE_ENV === 'development') {
		console.warn('[redis] Using mock redis in development');
	}
}
export default redis;
