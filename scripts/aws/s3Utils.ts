import { S3 } from 'aws-sdk';
import { config } from 'dotenv';

// Load environment variables
config();

// S3 configuration
const S3_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  bucketName: process.env.AWS_S3_BUCKET_NAME,
};

// Validate S3 configuration
function validateS3Config(): void {
  const missingKeys = Object.entries(S3_CONFIG)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(`Missing S3 configuration: ${missingKeys.join(', ')}`);
  }
}

// Initialize S3 client
function initializeS3Client(): S3 {
  validateS3Config();
  return new S3({
    accessKeyId: S3_CONFIG.accessKeyId,
    secretAccessKey: S3_CONFIG.secretAccessKey,
    region: S3_CONFIG.region,
  });
}

const s3Client = initializeS3Client();

export async function readFileFromS3(key: string): Promise<string> {
  try {
    const params: S3.GetObjectRequest = {
      Bucket: S3_CONFIG.bucketName!,
      Key: key,
    };
    const data = await s3Client.getObject(params).promise();
    return data.Body?.toString('utf-8') ?? '';
  } catch (error) {
    console.error(`Error reading file from S3: ${key}`, error);
    throw error;
  }
}

export async function writeFileToS3(key: string, content: string): Promise<void> {
  try {
    const params: S3.PutObjectRequest = {
      Bucket: S3_CONFIG.bucketName!,
      Key: key,
      Body: content,
      ContentType: 'application/json',
    };
    await s3Client.putObject(params).promise();
  } catch (error) {
    console.error(`Error writing file to S3: ${key}`, error);
    throw error;
  }
}
