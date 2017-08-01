interface ILog {
    info(message: any): void;
    debug(message: any): void;
    warn(message: any): void;
    error(message: any): void;
    trace(message: any): void;
}

declare function logger(source: string): ILog;
export = logger;
