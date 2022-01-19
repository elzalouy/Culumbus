var os = require("os");
module.exports = function (app) {
  var interfaces = os.networkInterfaces();
  var addresses = [];
  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      if (address.family === "IPv4" && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  console.log("connected with ip address, ", addresses);
  app.use((req, res, next) => {
    // let allowedOrigins = [
    //   "http://" + config.get("FrontEndUrl"),
    //   "https://" + config.get("FrontEndUrl"),
    // ];
    // let origin = req.headers.origin;
    // if (allowedOrigins.includes(origin)) {
    //   res.header("Access-Control-Allow-Origin", origin);
    // }
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header(
    //   "Access-Control-Allow-Headers",
    //   "*"
    // );
    // res.header(
    //   "Access-Control-Allow-Methods",
    //   "PUT, POST, GET, DELETE, OPTIONS"
    // );
    next();
  });
};
