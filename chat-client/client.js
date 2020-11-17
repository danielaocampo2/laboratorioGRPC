let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");

let readLine = require("readline");
const { Server } = require("http");

let reader = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});
let proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("C://Users/ASUS/Desktop/laboratorioOP1/chat-grupo/proto/chat.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);
const REMOTE_SERVER = "0.0.0.0:60000";
let username;
// Creamos nuestro cliente grpc
let client = new proto.chatGroup.Chat(
    REMOTE_SERVER, grpc.credentials.createInsecure()
);

//Preguntamos al usuario el nombre
reader.question("Por favor ingrese su username ", answer => {
    username = answer;
    startChat();
});

//Iiciamos el stream entre el cliente y el servidor
let startChat = () => {
    //HAcer el join con el servicio de chat
    let channel = client.join();
    //Escribimos el request
    channel.write({ user: username, text: "Ya estoy logueado ...." });
    //Obtenga los datos desde el response
    channel.on("data", (message) => {
        if (message.user == username) {
            return;
        }
        console.log(`${message.user}: ${message.text}`);
    });
    //Lea cada linea desde la terminal
    reader.on("line", (text) => {
        channel.write({ user: username, text: text });
    });
}