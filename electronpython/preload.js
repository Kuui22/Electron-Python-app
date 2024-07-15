
//renderer process function exposed
const { contextBridge, ipcRenderer } = require('electron');
const Dexie = require('dexie');

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
    await db.mode.update(1, {current: newMode });
  },
  clearData: async () => {
    await db.mode.clear();
  },
  modeExists: async () => {
    const currmode = await db.mode.get(1);
    if(currmode){
      return currmode.current
    }
    else{
      return undefined
    }
}
});

contextBridge.exposeInMainWorld('electron', {
  log: (...args) => ipcRenderer.send('log-message', ...args)
});
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

