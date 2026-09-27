const ImageKit = require('imagekit');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }
});

let imageKitClient;

function getImageKitClient() {
  const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;
  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
    throw new Error('ImageKit credentials are required to upload media');
  }

  if (!imageKitClient) {
    imageKitClient = new ImageKit({
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_URL_ENDPOINT
    });
  }

  return imageKitClient;
}

async function uploadMedia(file, folder) {
  const fileName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_') || 'upload';
  const result = await getImageKitClient().upload({
    file: file.buffer,
    fileName,
    folder,
    useUniqueFileName: true
  });

  return { url: result.url, fileId: result.fileId };
}

async function deleteMedia(fileId) {
  if (fileId) {
    await getImageKitClient().deleteFile(fileId);
  }
}

module.exports = { upload, uploadMedia, deleteMedia };
