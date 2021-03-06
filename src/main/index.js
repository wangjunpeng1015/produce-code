import { app, BrowserWindow, ipcMain } from 'electron'
import store from "../renderer/store/index.js"

app.commandLine.appendSwitch("--disable-http-cache");
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  // ? `http://www.hightopo.com/demos/index.html`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  store.dispatch('reset')

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

const fs = require('fs')
const path = require('path')

const view = require('./ViewsVue/index')
const component = require('./ComponentVue/index')
const backend = require('./backend/index')
const services = require('./ServicesJs/index')
const Router = require('./Router/index')

ipcMain.on('produce-front', function (event, arg) {
  Router.default(arg.data, arg.project, arg.option.routePath)
  new services(arg.data, arg.project, arg.option.apiPath)
  new view(arg.data, arg.project, arg.option, function (model, currentPath) {
    component(model, currentPath)
    event.sender.send('produce-front-success', '')
  })
})

ipcMain.on('produce-backend', function (event, arg) {
  // let path = arg
  // let data = store.state.json
  backend.default(arg.data, arg.project)
  event.sender.send('produce-backend-success', '')
})


ipcMain.on('set-json', function (event, arg) {
  fs.readFile(arg, 'utf-8', function (e, data) {
    event.sender.send('set-json-success', data)
  })
})