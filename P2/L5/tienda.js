const fs = require('fs');
const http = require('http');
const path = require('path');

const port = 9000;

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