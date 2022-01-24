const winston = require("winston");
const config = require("config");

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.File({ filename: "logfile.log" })
  );
  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
      handleExceptions: true,
    })
  );
};
