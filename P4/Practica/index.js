const electron = require('electron');


console.log("Hola desde el proceso de la web...");
//-- Obtener elementos de la interfaz
const btn_test = document.getElementById("btn_test");
const display = document.getElementById("display");
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");
const print = document.getElementById("print");
const users = document.getElementById("users");
const ip = document.getElementById("IP");
//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
info1.textContent = process.version;
info2.textContent = process.versions.electron;
info3.textContent = process.versions.chrome;

users.textContent = 0;


btn_test.onclick = () => {
    display.innerHTML += "He pulsado el botón" + "</br>";
    console.log("Botón apretado!");
    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "MENSAJE DE PRUEBA: Boton apretado");
}

//-- Mensaje recibido del proceso MAIN

  electron.ipcRenderer.on('msg', (event, message) => {
    console.log("Recibido: " + message);
    display.innerHTML += message + "</br>";
  });

  electron.ipcRenderer.on('users', (event, message) => {
    users.textContent = message;
  });
  electron.ipcRenderer.on('IP', (event, message) => {
    IP.textContent = message;
  });
  electron.ipcRenderer.on('QR', (event, message) => {
    QR.textContent = message;
  });
