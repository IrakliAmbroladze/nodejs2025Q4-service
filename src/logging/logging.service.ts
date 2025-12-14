import { Injectable, LogLevel } from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';

@Injectable()
export class LoggingService {
  private readonly logDir = path.join(process.cwd(), 'logs');
  private readonly logFile = path.join(this.logDir, 'app.log');
  private readonly errorLogFile = path.join(this.logDir, 'error.log');
  private readonly maxFileSize: number;
  private readonly logLevel: number;

  private readonly LOG_LEVELS: LogLevel[] = [
    'verbose',
    'debug',
    'log',
    'warn',
    'error',
  ];

  constructor() {
    this.maxFileSize = parseInt(process.env.LOG_MAX_FILE_SIZE, 10) || 1024;
    this.logLevel = parseInt(process.env.LOG_LEVEL, 10) || 2;

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levelIndex = this.LOG_LEVELS.indexOf(level);
    return levelIndex >= this.logLevel;
  }

  private rotateLogFile(filePath: string): void {
    try {
      const stats = fs.statSync(filePath);
      const fileSizeInKB = stats.size / 1024;

      if (fileSizeInKB >= this.maxFileSize) {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const rotatedFile = filePath.replace('.log', `-${timestamp}.log`);
        fs.renameSync(filePath, rotatedFile);
      }
    } catch (error) {}
  }

  private writeToFile(filePath: string, message: string): void {
    this.rotateLogFile(filePath);
    fs.appendFileSync(filePath, message + '\n', 'utf8');
  }

  private formatMessage(
    level: string,
    message: string,
    context?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const ctx = context ? `[${context}]` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${ctx} ${message}`;
  }

  log(message: string, context?: string): void {
    if (this.shouldLog('log')) {
      const formatted = this.formatMessage('log', message, context);
      console.log(formatted);
      this.writeToFile(this.logFile, formatted);
    }
  }

  error(message: string, trace?: string, context?: string): void {
    if (this.shouldLog('error')) {
      const formatted = this.formatMessage('error', message, context);
      const fullMessage = trace ? `${formatted}\n${trace}` : formatted;

      console.error(fullMessage);
      this.writeToFile(this.logFile, fullMessage);
      this.writeToFile(this.errorLogFile, fullMessage);
    }
  }

  warn(message: string, context?: string): void {
    if (this.shouldLog('warn')) {
      const formatted = this.formatMessage('warn', message, context);
      console.warn(formatted);
      this.writeToFile(this.logFile, formatted);
    }
  }

  debug(message: string, context?: string): void {
    if (this.shouldLog('debug')) {
      const formatted = this.formatMessage('debug', message, context);
      console.debug(formatted);
      this.writeToFile(this.logFile, formatted);
    }
  }

  verbose(message: string, context?: string): void {
    if (this.shouldLog('verbose')) {
      const formatted = this.formatMessage('verbose', message, context);
      console.log(formatted);
      this.writeToFile(this.logFile, formatted);
    }
  }

  logRequest(method: string, url: string, query: any, body: any): void {
    const message = `Incoming Request: ${method} ${url} | Query: ${JSON.stringify(query)} | Body: ${JSON.stringify(body)}`;
    this.log(message, 'HTTP');
  }

  logResponse(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
  ): void {
    const message = `Response: ${method} ${url} | Status: ${statusCode} | Time: ${responseTime}ms`;
    this.log(message, 'HTTP');
  }
}
