import { config } from '../config';
import { createLogger, LogLevel } from './logger';

const logLevel: LogLevel = LogLevel[config.logLevel] ?? LogLevel.ALL;

export const logger = createLogger({ level: logLevel });

