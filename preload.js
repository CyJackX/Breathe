const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("breathe", {
  version: "0.1.0"
});
