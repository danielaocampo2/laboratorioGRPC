let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");

const server = new grpc.Server();
const URL = "0.0.0.0:60000";

let proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("C://Users/ASUS/Desktop/laboratorioOP1/chat-grupo/proto/chat.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

//creo un arreglo vacio para almacenar mis usuarios
let users = [];

//Metodo para implementar el RPC join
let join = (call) => {
    users.push(call);
    //Tomo los datos desde el request
    call.on('data', (message) => {
        //mando la notificacion al join
        sendNotification({ user: message.user, text: message.text });
    })
}

//enviar el mensaje a todos los clientes conectados
let sendNotification = (message) => {
    //para cada usuario se escribe el mensaje retornado
    users.forEach(user => {
        user.write(message);
    });
}

//Adicionar el metodo implementado al servicio
server.addService(proto.chatGroup.Chat.service, { join: join });
server.bind(URL, grpc.ServerCredentials.createInsecure());
server.start();