const http = require('http');
const fs = require('fs');

//-- Definir el puerto a utilizar
const PUERTO = 3333;

//-- Crear el servidor
const server = http.createServer((req, res) => {
    
    fs.readFile('./index.html', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Not Found');
        return res.end();
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      return res.end();
    });
    
});

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Happy server activado!. Escuchando en puerto: " + PUERTO);
