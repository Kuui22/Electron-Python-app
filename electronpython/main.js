const { app, BrowserWindow, ipcMain } = require('electron')
// include the Node.js 'path' module at the top of your file
const fs = require('fs');
const path = require('node:path')
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false
    }
  })
  win.setMinimumSize(800, 600);
  win.loadFile('index.html')
  // Log messages from renderer process
  ipcMain.on('log-message', (event, ...args) => {
    console.log(...args);
  });
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


ipcMain.handle('get-images', async (event, reldirectory) => {
  const directory = path.join(__dirname, reldirectory);
  try {
    const files = fs.readdirSync(directory);
    const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file)).map(file => `file://${path.join(directory, file)}`);
    return images;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
});