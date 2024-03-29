//-- Cargar el módulo de electron
const electron = require('electron');


console.log("Arrancando electron...");

//-- Variable para acceder a la ventana principal
//-- Se pone aquí para que sea global al módulo principal
let win = null;

//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
electron.app.on('ready', () => {
    console.log("Evento Ready!");

    //-- Crear la ventana principal de nuestra aplicación
    win = new electron.BrowserWindow({
        width: 600,   //-- Anchura 
        height: 600,  //-- Altura

        //-- Permitir que la ventana tenga ACCESO AL SISTEMA
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
    });


  //-- Cargar interfaz gráfica en HTML
  win.loadFile("index.html");

  //-- Esperar a que la página se cargue y se muestre
  //-- y luego enviar el mensaje al proceso de renderizado para que 
  //-- lo saque por la interfaz gráfica
  win.on('ready-to-show', () => {
    win.webContents.send('IP', `http://${ip.address()}:${PUERTO}`);  
  });

});

//-- Esperar a recibir los mensajes de botón apretado (Test) del proceso de 
//-- renderizado. Al recibirlos se escribe una cadena en la consola
electron.ipcMain.handle('test', (event, msg) => {
  console.log("-> Mensaje: " + msg);
});

//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const fs = require('fs');
const ip = require('ip');


const PUERTO = 9000;

let date = new Date()
//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

const chat = fs.readFileSync('chat.html','utf-8')

//-- Inicializamos la variable de users
let users = 0;
//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  res.send(chat);
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  users = users + 1;
  console.log('** NUEVA CONEXIÓN **'.green);
  socket.send("SERVER: Bienvenido al chat")
  win.webContents.send("users", users);
  io.send("SERVER: Se ha conectado un nuevo usuario");
  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.red);
    users = users - 1;
    win.webContents.send("users", users);
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);
    if (msg == "/help"){
        socket.send("SERVER: /help: Mostrará una lista con todos los comandos soportados <br> /list: Devolverá el número de usuarios conectados <br> /hello: El servidor nos devolverá el saludo <br> /date: Nos devolverá la fecha");
      } else if (msg == "/list"){
        socket.send("SERVER: Usuarios conectados:" + users);
    } else if (msg == "/hello"){
        socket.send("SERVER: Hola!");
    } else if (msg == "/date"){
        socket.send("SERVER: " + date.toLocaleDateString("es-ES"));
    } else {
        //-- Reenviarlo a todos los clientes conectados
        io.send(msg);
        win.webContents.send("msg", msg);
    }
    
  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);


