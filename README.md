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

If you are going for some advanced usage you there are 3 options

```js
{
  source: "ComponentName", // Name for component useful for navigating to your js file
  transport: new TransportClass(), // Logging transport can also be an array, default is console transport
  level: "INFO", //See log sevels
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

The default transport logs to console.
If you are to add your own custom transport then you it has to conform to this interface

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
