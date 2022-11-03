

/**
 * Holds configuration settings for clusterawsadm
 */
class AwsConfig extends Config {
  // export AWS_REGION=us-east-1 # This is used to help encode your environment variables
  // export AWS_ACCESS_KEY_ID=<your-access-key>
  // export AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
  // export AWS_SESSION_TOKEN=<session-token> # If you are using Multi-Factor Auth.
  
  constructor(
      region = "eu-west-1", 
      access_key = "", 
      secret_access_key = "", 
      session_token = "") {
    
    super();

    this.aws_region = region;
    this.aws_access_key_id = access_key;
    this.aws_secret_access_key = secret_access_key;
    this.aws_session_token = session_token;
    this.aws_b64encoded_credentials = null;
  }

  toEnvObject() {
    return {
      AWS_REGION : this.aws_region,
      AWS_ACCESS_KEY_ID : this.aws_access_key_id,
      AWS_SECRET_ACCESS_KEY : this.aws_secret_access_key,
      AWS_SESSION_TOKEN : this.aws_session_token,
      AWS_B64ENCODED_CREDENTIALS : this.aws_b64encoded_credentials,
    }
  }


}