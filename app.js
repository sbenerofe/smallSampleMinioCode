// In order to use the MinIO JavaScript API to generate the pre-signed URL, begin by instantiating
// a `Minio.Client` object and pass in the values for your server.
// The example below uses values for play.min.io:9000

const Minio = require("minio");
const cors = require("cors");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
// Instantiate the `Minio.Client` with an endpoint and access keys.
const client = new Minio.Client({
  // endPoint: "localhost",
  // port: 9000,
  // useSSL: true,
  // accessKey: "Q3AM3UQ867SPQQA43P2F",
  // secretKey: "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG",

  endPoint: "192.168.7.254",
  port: 9000,
  useSSL: true,
  accessKey: "LhaSCU0SrA9RdYWUZFLB",
  secretKey: "OVvJ8xtdClWlf32KjHcNFdpaIlxC56eE7Y6pwpEA",
});

// Instantiate an `express` server and expose an endpoint called `/presignedUrl` as a `GET` request that
// accepts a filename through a query parameter called `name`. For the implementation of this endpoint,
// invoke [`presignedPutObject`](https://min.io/docs/minio/linux/developers/javascript/API.html#presignedPutObjectt)
// on the `Minio.Client` instance to generate a pre-signed URL, and return that URL in the response:

// express is a small HTTP server wrapper, but this works with any HTTP server
const server = require("express")();
server.use(cors());
const bucketName = "minio-test";
const objectName = "";
const expires = 24 * 60 * 60;

server.get("/presignedUrl", (req, res) => {
  client.presignedPutObject(bucketName, req.query.name, (err, url) => {
    if (err) throw err;
    res.end(url);
  });
});

server.get("/minioDirectory", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const stream = client.extensions.listObjectsV2WithMetadata(
    bucketName,
    "",
    true,
    ""
  );
  stream.on("data", function (obj) {
    console.log(obj);
    res.write(`data: ${JSON.stringify(obj)}\n\n`);
  });
  stream.on("error", function (err) {
    console.error(err);
    res.end();
  });
});

server.post("/loadObject", (req, res) => {
  const objectName = `goldenRetriever.jpg`; //req.body.files && req.body.files[0];
  client.presignedGetObject(bucketName, objectName, (err, url) => {
    if (err) throw err;
    res.json([url]);
  });
});

// server.get("/minioDirectory", (req, res) => {
//   const stream = client.extensions.listObjectsV2WithMetadata(
//     bucketName,
//     "",
//     true,
//     ""
//   );
//   stream.on("data", function (obj) {
//     console.log(obj);
//     res.end(JSON.stringify(obj));
//   });
//   stream.on("error", function (err) {
//     console.log(err);
//   }); // client.presignedListObjects(
//   bucketName,
//   objectName,
//   expires,
//   function (err, presignedUrl) {
//     if (err) throw err;
//     console.log(presignedUrl);
//     res.end(presignedUrl);
//   }
// );
// });

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3100, () => console.log("Server started on port 3100"));
