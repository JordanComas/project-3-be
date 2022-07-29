const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;
  // NOTE: if your token authentication is failing in Postman, uncomment the line below, and comment out the line above
  // const token = req.headers.authorization?.split(" ")[1];
  if (!token || token === "null") {
    console.log("NO TOKEN");
    return res.status(400).json({ message: "Token not found" });
  }
  try {
    const tokenInfo = jwt.verify(token, process.env.SECRET);
    console.log(tokenInfo);
    //If you have req.payload, change line 12 to:
    // req.payload = tokenInfo;
    req.user = tokenInfo;
    next();
  } catch (error) {
    return res.json(error);
  }
};

// Export the middleware so that we can use it to create a protected routes
module.exports = {
  isAuthenticated,
};
