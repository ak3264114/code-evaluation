const redis = require("redis");

const redisClient = redis.createClient();

redisClient.on("error", (err) => {
	console.error("Redis client error:", err);
});

redisClient.on("connect", () => {
	console.log("Connected to Redis server");
});

async function fetchDataFromCache(cacheKey) {
	return new Promise((resolve, reject) => {
		redisClient.get(cacheKey, (err, cachedData) => {
			if (err) {
				console.error("Error fetching data from Redis cache:", err);
				reject(err);
				return;
			}

			if (cachedData) {
				resolve(JSON.parse(cachedData));
			} else {
				resolve(null);
			}
		});
	});
}

// Function to cache data in the Redis cache
function cacheData(cacheKey, data) {
	redisClient.set(cacheKey, JSON.stringify(data), (err) => {
		if (err) {
			console.error("Error caching data in Redis:", err);
		}
	});
}

module.exports = { fetchDataFromCache, cacheData };
