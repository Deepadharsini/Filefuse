const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const BUCKET = process.env.S3_BUCKET_NAME;

const uploadFile = (buffer, filename, mimetype) => {
  const key = `${uuidv4()}-${filename}`;
  return s3
    .upload({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
      Tagging: "ExpireAfter=1d"
    })
    .promise();
};

//  Add Content-Disposition to force download
const generateDownloadURL = async (key, expiresIn = 600) => {
  return s3.getSignedUrlPromise("getObject", {
    Bucket: BUCKET,
    Key: key,
    Expires: expiresIn,
    ResponseContentDisposition: "attachment" //  forces browser to download
  });
};

module.exports = { uploadFile, generateDownloadURL };
