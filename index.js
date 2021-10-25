const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("certificates/key.pem"),
  cert: fs.readFileSync("certificates/cert.pem"),
};

https
  .createServer(options, function (req, res) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      console.log("request received");
      res.writeHead(200, {});
      res.write(JSON.stringify({ hello: true }));
      res.end();
    });
  })
  .listen(process.env.PORT || 8082);
console.log("https server for socket is listening on port 8082");
