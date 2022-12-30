// import { Clusterawsadm } from "../../../main/services/clusterawsadm";
import { AwsConfig } from "../../../main/k8s/awsConfig";
import { logger } from "../../../main/logger";
import { Aws } from "../../../main/services/aws";

function makeAWSConfigFromEnvVars() {
  return AwsConfig.fromEnv(process.env);
} 

function isNonEmptyString(str) {
  return (typeof str !== 'undefined') && 
         (str.length > 0);
}

test(`testing AwsConfig from environment variables`, () => {
  const awsConfig = makeAWSConfigFromEnvVars();

  expect(isNonEmptyString(awsConfig.aws_region)).toBeTruthy();
  expect(isNonEmptyString(awsConfig.aws_access_key_id)).toBeTruthy();
  expect(isNonEmptyString(awsConfig.aws_secret_access_key)).toBeTruthy();
});

test(`testing region listing via aws`, async () => {
  const awsConfig = makeAWSConfigFromEnvVars();
  const aws = new Aws(awsConfig);

  let regionList = await aws.listRegions();

  expect(regionList.length > 0).toBeTruthy();

  logger.debug(`regionList = ${JSON.stringify(regionList,null,'\t')}`);
});

test(`testing keyPair listing via aws`, async () => {
  const awsConfig = makeAWSConfigFromEnvVars();
  const aws = new Aws(awsConfig);

  let keyPairs = await aws.listKeyPairs();
  // let keyPairs = await aws.listKeyPairs({region:'us-east-1'});

  // only tests a non-exceptional return..There may be no key-pairs for the default region.
  expect(keyPairs && keyPairs.length >= 0).toBeTruthy();

  logger.debug(`keyPairs = ${JSON.stringify(keyPairs,null,'\t')}`);
});
