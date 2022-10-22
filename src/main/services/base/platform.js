import process from "process";
import {logger} from "../../logger";


// singleton. Loads and holds (friendly names and utilities for) platform specific client properties.
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
    logger.debug(`constructed Platform instance for ${this.osFamily}/${this.arch}`);
  } // constructor


} // class

// There is this single client (current), so we just need to export a single constant.
const platform = new Platform();
// make 1-level immutable.
Object.freeze(platform);
// no default export, per: https://google.github.io/styleguide/jsguide.html#es-module-exports
export  { platform };