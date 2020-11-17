let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");

const server = new grpc.Server();
const URL = "0.0.0.0:60000";

let proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("../proto/hola-mundo.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

function greetUser(call, callBack) {
    callBack(null, { message: `Hola ${call.request.name} bienvenido a la UdeA` });
}

server.addService(proto.welcome.WelcomeService.service, { greetUser: greetUser });
server.bind(URL, grpc.ServerCredentials.createInsecure());
server.start();