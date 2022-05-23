const firebaseAdmin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const serviceAccount = require('./quixotic-moment-329818-firebase-adminsdk-pab8i-416f20ad0d.json');

const admin = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const gs = 'gs://'
const bucketName = 'quixotic-moment-329818.appspot.com';

const storageRef = admin.storage().bucket(`${gs}${bucketName}`);

const uploadToFirebase = async (path, destinationFolder, filename) => {
  try {
    const storage = await storageRef.upload(path, {
      public: true,
      destination: `${destinationFolder}/${filename}`,
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: uuidv4()
        }
      }
    });

    return {
      url: `https://storage.googleapis.com/${bucketName}/${storage[0].metadata.name}`,
      urlDownload: storage[0].metadata.mediaLink
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  uploadToFirebase
}
