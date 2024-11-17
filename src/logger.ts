import winston from "winston";

// Create separate transports for info and error logs
const infoTransport = new winston.transports.File({
  filename: "worker.info.log",
  level: "info",
});
const errorTransport = new winston.transports.File({
  filename: "worker.error.log",
  level: "error",
});

// Create a logger instance
export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    infoTransport,
    errorTransport,
  ],
});
