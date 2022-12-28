import { logger } from "../logger";
import { Config } from "./config";

/**
 * Holds configuration settings for clusterawsadm
 */
export class AwsConfig extends Config {
  // export AWS_REGION=us-east-1 # This is used to help encode your environment variables
  // export AWS_ACCESS_KEY_ID=<your-access-key>
  // export AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
  // export AWS_SESSION_TOKEN=<session-token> # If you are using Multi-Factor Auth.

  // export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
  // export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
  // export AWS_DEFAULT_REGION=us-west-2


  constructor(
      region = "eu-west-1", 
      access_key = "", 
      secret_access_key = "", 
      session_token = "") {
    
    super();

    this.aws_region = region;
    this.aws_access_key_id = access_key;
    this.aws_secret_access_key = secret_access_key;
    // aws_session_token is only valid when using Multi-Factor Auth.
    this.aws_session_token = session_token;
    this.aws_b64encoded_credentials = null;
  }

  static IS_SYNCHED = {
    AWS_REGION : true,
    AWS_ACCESS_KEY_ID: true,
    AWS_SECRET_ACCESS_KEY : true,
  };

  toEnvObject() {
    return {
      AWS_REGION : this.aws_region,
      AWS_DEFAULT_REGION : this.aws_region,
      AWS_ACCESS_KEY_ID : this.aws_access_key_id,
      AWS_SECRET_ACCESS_KEY : this.aws_secret_access_key,
      // AWS_SESSION_TOKEN : this.aws_session_token,
      AWS_B64ENCODED_CREDENTIALS : this.aws_b64encoded_credentials,
      AWS_PAGER : "" 
    }
  }

  /**
   * 
   * @param {NodeJS.Process.env} env 
   * @returns {AwsConfig} instance, newly created with environment variables. 
   */
  static fromEnv(env) {
    let awsConfig = new AwsConfig();

    const has_aws_region = env.AWS_REGION && env.AWS_REGION.trim().length > 0;
    const has_default_region = env.AWS_DEFAULT_REGION && env.AWS_DEFAULT_REGION.trim().length > 0

    awsConfig.aws_region = '';

    if (has_aws_region && has_default_region &&
        env.AWS_REGION != env.AWS_DEFAULT_REGION ) {

        logger.warn(`Both AWS_REGION (${AWS_REGION}) and AWS_DEFAULT_REGION (${AWS_DEFAULT_REGION}) is set and are different.`);
        logger.warn(`using AWS_REGION (${AWS_REGION})`);
    }
    
    if (has_aws_region) { awsConfig.aws_region = env.AWS_REGION; }
    else if (has_default_region) { awsConfig.aws_region =  env.AWS_DEFAULT_REGION; }
    
    awsConfig.aws_access_key_id = env.AWS_ACCESS_KEY_ID;
    awsConfig.aws_secret_access_key = env.AWS_SECRET_ACCESS_KEY;
    awsConfig.aws_session_token = env.AWS_SESSION_TOKEN;
    // NOTICE: not caching aws_b64encoded_credentials, when blocked..
    // awsConfig.aws_b64encoded_credentials = env.AWS_B64ENCODED_CREDENTIALS;

    return awsConfig;
  }

  /**
   * Returns a .property formatted string form of the object, consisting of `property=value` lines.
   * @param {bool} isSkipUndefined if set to true, empty properties are skipped. Defaults to false. 
   * @returns a .property formatted string form of the object, consisting of `property=value` lines
   */
  toPropertiesString(isSkipUndefined=false) {
    let env='';
    const env_obj = this.toEnvObject();

    for (key in Object.keys(env_obj)) {
      if ( AwsConfig.IS_SYNCHED[key] && (!isSkipUndefined || env[key]) ) {
        env += `${key}=${env[key]}`;
      }
    }

    return env;
  }

};

