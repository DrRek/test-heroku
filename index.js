const https = require("https");
const fs = require("fs");
const express = require("express");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const options = {
  key: fs.readFileSync("certificates/key.pem"),
  cert: fs.readFileSync("certificates/cert.pem"),
};

https
  .createServer(options, function (req, res) {
    console.log("il server interno riceve la richeista");
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      console.log("request received");
      res.writeHead(200, {});
      res.write(JSON.stringify({ message: "ok" }));
      res.end();
    });
  })
  .listen(8083);
console.log(
  "https server for socket is listening on internal address and port 8083"
);

const app = express();

app.listen(process.env.PORT || 8080);

app.get("/", (req, res) => {
  console.log("ho ricevuto una richiesta");
  const options2 = {
    hostname: "127.0.0.1",
    port: 8083,
    path: "/",
    method: "GET",
  };
  const req2 = https.request(options2, (res2) => {
    console.log(`statusCode: ${res.statusCode}`);

    res2.on("data", (d) => {
      res.writeHead(200, {});
      res.write(JSON.stringify(JSON.parse(d)["message"]));
      res.end();
    });
  });
  req2.on("error", (error) => {
    console.error(error);
  });

  req2.end();
});
