import process from "process";
import { logger } from "../../logger";

/**
 * Loads and holds (friendly names and utilities for) platform specific client properties. 
 * A singleton.
 * @class {Platform}
 */
class Platform {

  constructor() {

    if (Platform._instance) {
      return Platform._instance
    }
    Platform._instance = this;

    /**
     * @property Architecture name of the current client.
     * @type string
     * @see process.arch
     */
    this.arch = process.arch;
    if (this.arch === 'x64') { this.arch = 'amd64'; }

    /**
     * @property Executable filename extension convention, used in the current client.
     * @type string
     */    
    this.exeExt = '';

    /**
     * @property Operating system (family) name of the current client.
     * @see process.platform
     * @type string
     */
    this.osFamily = process.platform;
    if (this.osFamily === 'win32') { 
      this.osFamily = 'windows';
      this.exeExt = '.exe'; 
    }

    logger.debug(`constructed Platform instance for ${this.osFamily}/${this.arch}`);
  } // constructor


} // class

/**
 * Singleton Platform class instance.
 * @type Platform
 * @see Platform
 */
const platform = new Platform();

// make 1-level immutable.
Object.freeze(platform);

// no default export, per: https://google.github.io/styleguide/jsguide.html#es-module-exports
export  { platform };