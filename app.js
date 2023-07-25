// In order to use the MinIO JavaScript API to generate the pre-signed URL, begin by instantiating
// a `Minio.Client` object and pass in the values for your server.
// The example below uses values for play.min.io:9000

const Minio = require("minio");
const cors = require("cors");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
// Instantiate the `Minio.Client` with an endpoint and access keys.
var client = new Minio.Client({
  // endPoint: "localhost",
  // port: 9000,
  // useSSL: true,
  // accessKey: "Q3AM3UQ867SPQQA43P2F",
  // secretKey: "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG",

  endPoint: "localhost",
  port: 9000,
  useSSL: true,
  accessKey: "AUPYyebR1sfW2gXtjjbp",
  secretKey: "lGJXHZ6M3NRd26cnex55wJ5DeYc7MQy07nYtvPqs",
});

// Instantiate an `express` server and expose an endpoint called `/presignedUrl` as a `GET` request that
// accepts a filename through a query parameter called `name`. For the implementation of this endpoint,
// invoke [`presignedPutObject`](https://min.io/docs/minio/linux/developers/javascript/API.html#presignedPutObjectt)
// on the `Minio.Client` instance to generate a pre-signed URL, and return that URL in the response:

// express is a small HTTP server wrapper, but this works with any HTTP server
const server = require("express")();
server.use(cors());

server.get("/presignedUrl", (req, res) => {
  client.presignedPutObject("minio-test", req.query.name, (err, url) => {
    if (err) throw err;
    res.end(url);
  });
});

server.get("/minioDirectory", (req, res) => {
const stream = Client.extensions.listObjectsV2WithMetadata('mybucket','', true,'')
stream.on('data', function(obj) { console.log(obj) } )
stream.on('error', function(err) { console.log(err) } )
})

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => console.log("Server started on port 3000"));
