let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");

let readLine = require("readline");
const { PRIORITY_ABOVE_NORMAL } = require("constants");

let reader = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});
let proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("../proto/hola-mundo.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);
const REMOTE_URL = "0.0.0.0:60000";
let client = new proto.welcome.WelcomeService(REMOTE_URL,
    grpc.credentials.createInsecure());
reader.question("Por favor ingrese su nombre: ", answer => {
    client.greetUser({ name: answer }, (err, res) => { console.log(res.message); });
});