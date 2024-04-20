const express = require("express");
const fs = require("fs");
const path = require("path");
const cluster = require("cluster");
const os = require("os");
const compression = require("compression");
const app = express();
const staticRoot = `${__dirname}/`;
const port = process.env.PORT || 4200;
// const expressBrotli = require('express-brotli');

app.set("port", port);
app.use(compression());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin: *");
  res.header(
    "Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS",
  );
  res.header("Access-Control-Allow-Credentials: true");
  res.header(
    "Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token",
  );
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  const proto = req.headers["x-forwarded-proto"];
  if (proto == "http") {
    return res
      .status(301)
      .redirect(["https://", req.get("Host"), req.url].join(""));
  }

  const accept = req.accepts("html", "json", "xml");
  if (accept !== "html") {
    return next();
  }

  const ext = path.extname(req.path);
  if (ext !== "") {
    return next();
  }

  fs.createReadStream(`${staticRoot}dist/text2speech/index.html`).pipe(res);
});

app.use(express.static(`${staticRoot}dist/text2speech`));

function start_app() {
  app.listen(port, function () {
    console.log("app running on port: ", port);
  });
}

if (cluster.isMaster) {
  const max_cpu = os.cpus().length;
  for (let i = 0; i < max_cpu; i++) {
    cluster.fork();
  }
} else {
  start_app();
}
