const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

//-- Nombre del fichero JSON a leer
const SHOP = "tienda.json"
//-- Leer el fichero JSON
const  SHOP_json = fs.readFileSync(SHOP);

//-- Crear la estructura tienda a partir del contenido del fichero
const TIENDA = JSON.parse(SHOP_json);

function get_user(req) {

  //-- Leer la Cookie recibida
  const cookie = req.headers.cookie;

  //-- Hay cookie
  if (cookie) {
    
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split(";");
    
    //-- Variable para guardar el usuario
    let user;

    //-- Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {

      //-- Obtener los nombres y valores por separado
      let [nombre, valor] = element.split('=');

      //-- Leer el usuario
      //-- Solo si el nombre es 'user'
      if (nombre.trim() === 'user') {
        user = valor;
      }
    });

    //-- Si la variable user no está asignada
    //-- se devuelve null
    return user || null;
  }
}
const server = http.createServer((req, res) => {
  // Ruta del archivo solicitado
  const myURL = new URL(req.url, 'http://' + req.headers['host']);  
  console.log("");
  console.log("Método: " + req.method);
  console.log("Recurso: " + req.url);
  console.log("  Ruta: " + myURL.pathname);
  console.log("  Parametros: " + myURL.searchParams);

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
      if (myURL.pathname == '/response.html' && myURL.searchParams.has('username') && myURL.searchParams.has('password')) {
        // Es una solicitud de autenticación, procesa los parámetros y envía una respuesta personalizada
        const username = myURL.searchParams.get('username');
        const password = myURL.searchParams.get('password');
        console.log(username);
        console.log(password);
        if ((username === "root" || username === "client") && password === "1234"){
          content = fs.readFileSync('response.html', 'utf-8');
          if (username === "root")
            res.setHeader('Set-Cookie', 'user=root');
          else{
            res.setHeader('Set-Cookie', 'user=client');
          }
        }
        else{
          content = fs.readFileSync('response copy.html', 'utf-8');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      } else {
        // No es una solicitud de autenticación, envía un error 404
        res.writeHead(404);
        res.end('Archivo no encontrado');
      }
    } else {
      // Archivo encontrado, envía el contenido con el tipo de contenido adecuado
      res.writeHead(200, { 'Content-Type': contentType });
      let user = get_user(req);
      console.log(user);
      if (myURL.pathname == '/' || myURL.pathname == '/index.html'){
        if (user === "root"){
          content = fs.readFileSync('indexroot.html', 'utf-8');
        } else if (user === "client"){
          content = fs.readFileSync('indexclient.html', 'utf-8');
        }
      }
        
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
