# trussle-logging

*Maintained by [@jonnyarnold](https://github.com/jonnyarnold/)*

A simple library for all things logging.


## Usage

```js
import buildLogger from "trussle-logging";
const logger = buildLogger("MyComponent");

logger.info("Testing, testing, 123!");
```

You will need to set the **NODE_LOG_LEVEL** environment variable to choose the verbosity of the logger.

```bash
export NODE_LOG_LEVEL=DEBUG
```

## Advanced Usage

There are several advanced usage options:

```js
import buildLogger from "trussle-logging";
const logger = buildLogger({
  source: "ComponentName", // Name for component; useful for navigating to your js file
  transport: new TransportClass(), // Logging transport. Can also be an array: default is console transport
  level: "INFO", // See Log Levels; if not set the the NODE_LOG_LEVEL environment will be used.
  formatter: (logData) => `${logData.message}`, // See Formatters
  variants: [] // See Variants
}
```

### Log Levels

* TRACE
* DEBUG
* INFO
* WARN
* ERROR
* CRITICAL
* NONE

### Transports

The default Transport logs to the console. If you want to write to your own transport then it will have to comply with the following interface:

```js
{
  trace(message),
  debug(message),
  info(message),
  warn(message),
  error(message),
  critical(message)
}
```

### Templates

Templates are functions that take a logData object and return the output to be sent to the transport.

The logData object has these properies

```js
{
  timestamp, // A moment object of the current utc time
  source, // The source component of the log
  level, //The log level
  message // The original log message
}
```

For more info on moment objects check out [momentjs](http://momentjs.com/).

If no formatter is chosen then the default will be chosen.
```js
(logData) => `(${logData.source}) [${logData.level}] ${logData.message}`;
```

### Multiple Logs

If your usecase requires you to have multiple logs - separate log files for INFO and ERROR logs for instance then you can add a variants property to your config; this will create a wrapper logger that will delegate to multiple loggers.

*(Only the ConsoleTransport supports variants at this time, so if you need to log to a file you'll need to roll your own transport class.)*

```js
{
  source: "ComponentName",
  level: "INFO",
  variants: [
    {
      level: "ERROR",
      transport: new MyCustomTransport()
    }
  ]
}
```
