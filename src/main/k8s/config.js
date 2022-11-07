
/**  
 * Base class for Config(urations): eg: kubeconfig, clusterconfig, awsconfig...
 */
export class Config {
  constructor() {
    this.env_fields = []
  }

  //TODO:
  async exportAsFile(destination) {
    throw 'Not Implemented'
  }

  //TODO:
  async exportAsEnvironment(destination) {
    throw 'Not Implemented'
  }

  /**
   * Returns an environment object, with keys representing names.
   * Should be implemented in sub-classes.
   */
  toEnvObject() {
    throw 'Not Implemented'
  }
}
