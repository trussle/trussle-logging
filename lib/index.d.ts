type Loggable = string | number | {};

interface ILog {
    info(message: Loggable): void;
    debug(message: Loggable): void;
    warn(message: Loggable): void;
    error(message: Loggable): void;
    trace(message: Loggable): void;
}

declare function logger(source: string): ILog;
export = logger;