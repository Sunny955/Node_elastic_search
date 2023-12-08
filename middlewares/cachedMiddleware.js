const { getAsync, setAsync } = require("../config/redisConnect");

const cacheMiddleware = async (req, res, next) => {
  try {
    // Only cache GET requests
    if (req.method !== "GET") {
      const key = req.originalUrl;
      await delAsync(key);
      return next();
    }
    const key = req.originalUrl;

    // Check if data is in the cache
    const cachedData = await getAsync(key);

    if (cachedData) {
      // If data is in the cache, return it
      const data = JSON.parse(cachedData);
      return res.status(200).json(data);
    }

    // If data is not in the cache, proceed to the controller
    res.sendResponse = res.json;
    res.json = (body) => {
      setAsync(key, JSON.stringify(body), "EX", 7200);
      res.sendResponse(body);
    };

    next();
  } catch (error) {
    console.error("Cache middleware error:", error);
    next();
  }
};

module.exports = cacheMiddleware;
