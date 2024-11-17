import winston from "winston";
import { errorFile, infoFile } from "../config/constants";

// Create separate transports for info and error logs
const infoTransport = new winston.transports.File({
  filename: infoFile,
  level: "info",
});
const errorTransport = new winston.transports.File({
  filename: errorFile,
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
  transports: [infoTransport, errorTransport],
});
