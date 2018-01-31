declare function logger(source: string): {
    info(message: any): void;
    debug(message: any): void;
    warn(message: any): void;
    error(message: any): void;
    trace(message: any): void;
};
export = logger;
