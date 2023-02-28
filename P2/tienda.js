const fs = require('fs');

//-- Npmbre del fichero JSON a leer
const USERS = "users.json"

const PRODUCTS = "products.json"

const order = "pedidos.json"

//-- Leer el fichero JSON
const  users_json = fs.readFileSync(USERS);
const  PRODUCTS_JSON = fs.readFileSync(PRODUCTS);
const  PEDIDOS_JSON = fs.readFileSync(order);
//-- Crear la estructura tienda a partir del contenido del fichero
const usuarios = JSON.parse(users_json);
const productos = JSON.parse(PRODUCTS_JSON);
const pedidos = JSON.parse(PEDIDOS_JSON);


//-- Mostrar informacion sobre la tienda
console.log("Productos en la tienda: " + productos.length);
//-- Usuarios
console.log("Usuarios registrados: " + usuarios.length);
//-- Pedidos pendientes
console.log("Pedidos pendientes: " + pedidos.length);


//-- Recorrer el array de productos
productos.forEach((element, index)=>{
  console.log("Producto: " + (index + 1) + ": " + element["name"]);
});
//-- Recorrer el array de usuarios
usuarios.forEach((element, index)=>{
    console.log("Nombre: " + (index + 1) + ": " + element["username"]);
});
pedidos.forEach((element, index)=>{
    console.log("Pedido: " + (index + 1) + ": " + element["idpedido"]);
});
  
