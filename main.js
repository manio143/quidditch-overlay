// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')

const express = require('express')
const path = require('path')
var server = express()
require('express-ws')(server)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('gui.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("setVar", function (event, msg) {
  let {variable, value} = JSON.parse(msg);
  global[variable] = value;
});

function sendDataToClient() {
    if(globalWs == null) return;
    let data = global.data;
    if(data.teamAname != lastData.teamAname || data.teamAcolor != lastData.teamAcolor || data.teamBname != lastData.teamBname || data.teamBcolor != lastData.teamBcolor) {
        data.type = "teamSetup";
        globalWs.send(JSON.stringify(data));
    }
    if(data.teamAscore != lastData.teamAscore || data.teamBscore != lastData.teamBscore || data.teamAsnitches != lastData.teamAsnitches || data.teamBsnitches != lastData.teamBsnitches) {
        data.type = "score";
        globalWs.send(JSON.stringify(data));
    }
    if(data.period != lastData.period) {
        data.type = "period";
        globalWs.send(JSON.stringify(data));
    }
    if(data.gameTime != lastData.gameTime) {
        globalWs.send(JSON.stringify({type: "time", gameTime: (new String(Math.floor(data.gameTime / 60))).padStart(2, '0') + " : " + (new String(data.gameTime % 60)).padStart(2, '0') }));
    }
    lastData = data;
}
ipcMain.on("updateClient", sendDataToClient);

var lastData = {};

server.use(express.static(__dirname + '/client'));
var sampleDataSet = {
    teamAname: "Kraków Dragons",
    teamAcolor: "green",
    teamAscore: 80,
    teamAsnitches: [true],
    teamBname: "Wrocław Wanderers",
    teamBcolor: "blue",
    teamBscore: 90,
    teamBsnitches: [false],
    period: 2,
    gameTime: 114
}
server.get('/data', function (request, response) {
  response.send(JSON.stringify(sampleDataSet));
});
var globalWs = null;
server.ws("/socket", function (ws, req) {
  ws.on("message", function(msg) {
    if(msg == "ready") {
      globalWs = ws;
      sendDataToClient();
    }
  });
});
server.listen(8080);
console.log('Started server on localhost:8080');
