import process from "process";

// loads and holds (friendly names and utilities for) platform specific client properties.
class Platform {

  constructor() {

    if (Platform._instance) {
      return Platform._instance
    }
    Platform._instance = this;

    this.arch = process.arch;
    if (this.arch === 'x64') { this.arch = 'amd64'; }
    this.exeExt = ''
    this.osFamily = process.platform;
    if (this.osFamily === 'win32') { 
      this.osFamily = 'windows';
      this.exeExt = '.exe'; 
    }    
  } // constructor


} // class

// There is this single client (current), so we just need to export a single constant.
const platform = new Platform();
export default platform;