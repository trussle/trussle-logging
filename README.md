# trussle-logging

---

A simple library for all things logging.

---
##Simplest Usage

```js
var log = require("trussle-logging")("MyComponent");
```

If you are going for the simplest usage you will need to set the **NODE_LOG_LEVEL** Environment Variable


---

```bash
export NODE_LOG_LEVEL=DEBUG
```

---
##Advanced Usage

If you are going for some advanced usage you there are several options

```js
{
  source: "ComponentName", // Name for component useful for navigating to your js file
  transport: new TransportClass(), // Logging transport can also be an array, default is console transport
  level: "INFO", //See log sevels, if not set the the NODE_LOG_LEVEL environment will be used.
  formatter: (logData) => `${logData.message}` //See Formatters
}
```

###Log Levels
* TRACE
* DEBUG
* INFO
* WARN
* ERROR
* CRITICAL

###Transports

The default Transport logs to the console.
If you want to write to own trasport then it will have to comply with the following interface.

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

###Templates

Templates are functions that take a logData object and return the output to be sent to the transport.

The logData Object has these properies

```js
{
  timestamp, // A moment object of the current utc time
  source, // The source component of the log
  level, //The log level
  message // The original log message
}
```

For more info on moment objects check out [momentjs](http://momentjs.com/)

If no formatter is chosen then the default will be chosen.
```js

(logData) => `(${logData.source}) [${logData.level}] ${logData.message}`;

```

###Multiple Logs

If your usecase requires you to have multiple logs seperate log files for INFO and ERROR logs for instance (*only the ConsoleTransport at this time so if you need to log to a file you'll need to roll your own transport class*) then you can add a variants property to your config, this will create a wrapper logger that will delegate to multiple loggers.

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
