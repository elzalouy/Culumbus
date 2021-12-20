const auth = require("../graphql/resolvers/auth");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //console.log(req.headers.authorization)
  const authHeader = req.headers.authorization;
  // console.log(authHeader)
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];

  if (!token || token === "") {

    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_KEY);

  } catch (error) {

    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {

    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userData = decodedToken;
  next();
};
