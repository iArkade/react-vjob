
// NOTE: A tracking system such as Sentry should replace the console

export enum LogLevel {
     NONE = 'NONE',
     ERROR = 'ERROR',
     WARN = 'WARN',
     DEBUG = 'DEBUG',
     ALL = 'ALL'
}

const LogLevelNumber: { [key in LogLevel]: number } = { NONE: 0, ERROR: 1, WARN: 2, DEBUG: 3, ALL: 4 };

export class Logger {
     prefix;
     level;
     showLevel;
     levelNumber;

     constructor({ prefix = '', level = LogLevel.ALL, showLevel = true }) {
          this.prefix = prefix;
          this.level = level;
          this.levelNumber = LogLevelNumber[this.level];
          this.showLevel = showLevel;
     }

     debug = (...args:unknown[]) => {
          if (this.canWrite(LogLevel.DEBUG)) {
               this.write(LogLevel.DEBUG, ...args);
          }
     };

     warn = (...args:unknown[]) => {
          if (this.canWrite(LogLevel.WARN)) {
               this.write(LogLevel.WARN, ...args);
          }
     };

     error = (...args:unknown[]) => {
          if (this.canWrite(LogLevel.ERROR)) {
               this.write(LogLevel.ERROR, ...args);
          }
     };

     canWrite(level:LogLevel) {
          return this.levelNumber >= LogLevelNumber[level];
     }

     write(level:LogLevel, ...args:unknown[]) {
          let prefix = this.prefix;

          if (this.showLevel) {
               prefix = `- ${level} ${prefix}`;
          }

          if (level === LogLevel.ERROR) {
               console.error(prefix, ...args);
          } else {
               console.log(prefix, ...args);
          }
     }
}

// This can be extended to create context specific logger (Server Action, Router Handler, etc.)
// to add context information (IP, User-Agent, timestamp, etc.)

export function createLogger({ prefix, level }:{prefix?:string; level?:LogLevel} = {}) {
     return new Logger({ prefix, level });
}
