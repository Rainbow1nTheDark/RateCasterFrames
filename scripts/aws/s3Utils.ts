import AWS from 'aws-sdk';

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

export async function readFileFromS3(key: string): Promise<string> {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not defined');
  }
  const data = await s3.getObject({...params, Bucket: BUCKET_NAME}).promise();
  return data.Body?.toString('utf-8') ?? '';
}

export async function writeFileToS3(key: string, content: string) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: content,
    ContentType: 'application/json',
  };
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not defined');
  }
  await s3.putObject({...params, Bucket: BUCKET_NAME}).promise();
}