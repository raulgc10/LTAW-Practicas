const fs = require('fs');
const http = require('http');
const path = require('path');

//-- Nombre del fichero JSON a leer
const SHOP = "tienda.json"
//-- Leer el fichero JSON
const  SHOP_json = fs.readFileSync(SHOP);

//-- Crear la estructura tienda a partir del contenido del fichero
const TIENDA = JSON.parse(SHOP_json);

//-- Mostrar informacion sobre la tienda
console.log("Productos en la tienda: " + TIENDA.products.length);
//-- Usuarios
console.log("Usuarios registrados: " + TIENDA.users.length);
//-- Pedidos pendientes
console.log("Pedidos pendientes: " + TIENDA.orders.length);


//-- Recorrer el array de productos
TIENDA.products.forEach((element, index)=>{
  console.log("Producto: " + (index + 1) + ": " + element["name"]);
});
//-- Recorrer el array de usuarios
TIENDA.users.forEach((element, index)=>{
    console.log("Nombre: " + (index + 1) + ": " + element["username"]);
});
TIENDA.orders.forEach((element, index)=>{
    console.log("Pedido: " + (index + 1) + ": " + element["idpedido"]);
});

const server = http.createServer((req, res) => {
  // Ruta del archivo solicitado
  const filePath = req.url === '/' ? '/index.html' : req.url;
  const extname = path.extname(filePath);

  // Tipo de contenido
  let contentType = 'text/html';
  if (extname === '.css') {
    contentType = 'text/css';
  } else if (extname === '.js') {
    contentType = "text/javascript"
  } else if (extname === '.jpg') {
    contentType = "image/jpg"
  } else if (extname === '.png') {
    contentType = "image/png"
  }


  // Lee el archivo
  fs.readFile(path.join(__dirname, filePath), (err, content) => {
    if (err) {
        res.writeHead(404);
        res.end('Archivo no encontrado');

    }
    else {
      // Archivo encontrado
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Puerto en el que escucha el servidor
const port = 9000;

// Inicia el servidor
server.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
