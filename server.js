const http = require('http');
const app = require('./backend/app');
const debug = require('debug')('node-angular');


// Normalize port value
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// Error handler for HTTP server
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Logging listener
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

// Set port
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// Create HTTP server
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port); 