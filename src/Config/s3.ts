import 'dotenv/config'
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export const uploadS3Images = async (filename: string, buffer: Buffer ) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${filename}`,
    Body: buffer
  }
  const command = new PutObjectCommand(params)
  const result = await s3.send(command)
  return result
}

export const getS3Images = async (filename: string) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${filename}`,
  }
  const command = new GetObjectCommand(params)
  const urlImage = await getSignedUrl(s3, command, { expiresIn: 60 })
  return urlImage
}

export const deleteS3Images = async (filename: string) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${filename}`,
  }
  const command = new DeleteObjectCommand(params)
  const result = await s3.send(command)
  return result
}