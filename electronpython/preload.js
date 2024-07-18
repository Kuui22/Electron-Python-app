
//renderer process function exposed
const { contextBridge, ipcRenderer } = require('electron');
const Dexie = require('dexie');
const { spawn } = require("child_process");
const nodeConsole = require("console");
const fs = require('fs');
const path = require('path');
// vars
const terminalConsole = new nodeConsole.Console(process.stdout, process.stderr);
let child;

/* DEXIE DB FUNCTIONS */ 

//creating db from dexie
const db = new Dexie('myDb');
//db.delete()
db.version(1).stores({
  mode: 'id, current'
});
db.open().catch(function (error) {
  console.error("ERROR: " + error);
});
//expose functions to interact with db
contextBridge.exposeInMainWorld('dexie', {
  addData: async (data) => {
    await db.mode.add(data);
  },
  getAllData: async () => {
    return await db.mode.toArray();
  },
  updateCurrentMode: async (newMode) => {
    await db.mode.update(1, { current: newMode });
  },
  clearData: async () => {
    await db.mode.clear();
  },
  modeExists: async () => {
    const currmode = await db.mode.get(1);
    if (currmode) {
      return currmode.current
    }
    else {
      return undefined
    }
  }
});
//log to console
function printBoth(str) {
  console.log("preload:" + str);
  terminalConsole.log("preload:" + str);
}
/* PYTHON FUNCTIONS*/
//start the python process
function startPythongen() {
  terminalConsole.log('Starting python...');
  // :TODO Replace the python and [] to the path of the executable when ready
  child = spawn("python", ["./python/imggeneration.py"], { stdio: ["pipe", "pipe", "pipe"] });
  child.stdout.on("data", (data) => {
    printBoth(`Python: ${data}`);
  });

  child.stderr.on("data", (data) => {
    printBoth(`Python error: ${data}`);
  });

  child.on("close", (code) => {
    printBoth(`Python process exited with code ${code}`);
  });

  global.pythonChild = child;
}
function startPythonDownload() {
  terminalConsole.log('Starting python...');
  // :TODO Replace the python and [] to the path of the executable when ready
  child = spawn("python", ["./python/download.py"], { stdio: ["pipe", "pipe", "pipe"] });
  child.stdout.on("data", (data) => {
    printBoth(`Python: ${data}`);
  });

  child.stderr.on("data", (data) => {
    printBoth(`Python error: ${data}`);
  });

  child.on("close", (code) => {
    printBoth(`Python process exited with code ${code}`);
  });

  global.pythonChild = child;
}
//send a message to the python process that is currently listening
const sendToPython = (str) => {
  if (child && child.stdin.writable) {
    child.stdin.write(str + "\n");
  } else {
    printBoth("Python process is not running.");
  }
}

function getModelsFromType(type) {
  cwd = process.cwd()
  directoryPath = cwd+"\\static\\"+type
  directorynames = fs.readdirSync(directoryPath).filter(file => fs.statSync(path.join(directoryPath, file)).isDirectory());
  /*async (directoryPath) => {
    return fs.readdirSync(directoryPath).filter(file => fs.statSync(path.join(directoryPath, file)).isDirectory());
  }*/
  //ipcRenderer.send('log-message',"cwd:"+cwd)
  //ipcRenderer.send('log-message',"dir:"+directoryPath)
  //ipcRenderer.send('log-message',"x:"+x)
  return directorynames
}

contextBridge.exposeInMainWorld('electron', {
  log: (...args) => { ipcRenderer.send('log-message', ...args) },
  testboth: (str) => {
    console.log(`Javascript: ${str}`);
    terminalConsole.log(`Javascript: ${str}`);
  },
  startPythongen: () => {
    startPythongen()
  },
  startPythonDownload: () => {
    startPythonDownload()
  },
  sendPython:(str) => {
    sendToPython(str)
  },
  killPython: () => {
    if (child) {
      child.kill();
    }
  },
  getModelsFolder:async(type) =>{
    return models = await getModelsFromType(type)
    //ipcRenderer.send('log-message',"models:"+models)
    
  }
});
//retrieve images path from a directory
contextBridge.exposeInMainWorld('imageAPI', {
  getImagesFromDirectory: (reldirectory) => {
    return ipcRenderer.invoke('get-images', reldirectory);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
  console.log('DOM fully loaded and parsed');
});

