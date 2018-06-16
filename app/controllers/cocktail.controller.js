const azureStorage = require('azure-storage');
const path = require('path');
const fs = require('fs');
const utilities = require('../utilities/utilities');
// const uuidv4 = require('uuid/v4');
// var multer  = require('multer');
// var upload = multer({ dest: 'uploads/' });
const { Cocktail } = require('../models/cocktail.model');

exports.create = async function (req, res) {
  console.log('req.body @ create @ cocktail.controller: ', req.body);
  let { cocktail } = req.body;
  try {
    let theCocktail = await Cocktail.save(cocktail);
    res.send({ theCocktail });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getAll = async function(req, res) {
  console.log('req.body @ getAll @ cocktail.controller: ', req.body);
  try {
    let theCocktails = await Cocktail.getAll();
    res.send({ theCocktails });
  }
  catch (err) {
    res.status(400).send(err);
  }
}


exports.uploadImage = async function (req, res) {
  console.log('req.file @ uploadImage @ cocktail.controller: ', req.file);  // works
  console.log('req.file @ uploadImage @ cocktail.controller: ', req.files); // undefined
  console.log('req.body @ uploadImage @ cocktail.controller: ', req.body);  // empty {} unless extra appends

  // ===== cocktail name might not be needed ===== //
  let { cocktailName, cocktailId} = req.body;

  // Create a unique id to use as a filename
  // =====> TODO: Check if the id already exists in DB
  let randString = utilities.randomString(12);
  let splitNameExtension = req.file.originalname.split('.');
  let fileExtension = splitNameExtension[splitNameExtension.length - 1];
  let uniqueFileName = randString + '.' + fileExtension;
  
  console.log('===> unique file name: ', uniqueFileName);

  // \
  //  \
  //   \
  //    |  LOOK AT ME ===> TODO: Save the access key to an env variable
  //   /
  //  /
  // /
  
  // Connect to storage in Azure
  const blobService = azureStorage.createBlobService('cocktailsappimages', '2tDehEUuFEQI2AR+yHbedd9LwQgwgN2oGRfxTeV0p0yKhnorI3GpPyr0+TduVwhJVWz7O6KiPXuJvnK6YzxorQ==');
  const storageLocation = 'apac1';

  // Create container to hold the blob in Azure (if container with same name doesn't exist)
  let containerCreation = await createContainer(blobService, 'testcontainer');
  console.log('containerCreation: ', containerCreation);
  // let uploading = await upload('testcontainer', req.file.originalname, )

  // Create a stream and start the blob upload to the container
  var stream = fs.createReadStream(req.file.destination + path.sep + req.file.filename);
  const options = {};
  stream.pipe(blobService.createWriteStreamToBlockBlob('testcontainer', uniqueFileName, options, (error, result, response) => {
    if (error) {
      // A horrible error happened
    }
    else {
      // Blob is uploaded successfully
      blobService.getBlobProperties('testcontainer', uniqueFileName, async (err, result) => {
        // DriveFile.setSize(theFile._id, result2.contentLength, function(err, theFile2) {
        // });
        console.log('File uploaded successfully: ', result);

        // Add the imageLink to the cocktail document
        let imgLink = await Cocktail.addImageLink(cocktailId, uniqueFileName);
        

        res.send({ "status": "ok" });

        //remove file from temporary uploads folder
        try {
          setTimeout(function () {
            console.log('remove file', req.file.originalname);
            fs.unlink(req.file.destination + path.sep + req.file.filename, (err) => {
              // if (err) throw err;
              console.log('successfully deleted file');
            });
          }, 90000);
        }
        catch (error) {
          console.log('Removing file failed!');
          // decide whether to delete from blob again as well as from collection
        }
      });
    }
  }))
};

const createContainer = (blobService, containerName) => {
  return new Promise((resolve, reject) => {
    blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, err => {
      if (err) {
        reject(err);
      } else {
        resolve({ message: `Container '${containerName}' created` });
      }
    });
  });
};

const upload = (containerName, blobName, sourceFilePath) => {
  return new Promise((resolve, reject) => {
    blobService.createBlockBlobFromLocalFile(containerName, blobName, sourceFilePath, err => {
      if (err) {
        reject(err);
      } else {
        resolve({ message: `Upload of '${blobName}' complete` });
      }
    });
  });
};

const download = (containerName, blobName, downloadFilePath) => {
  const dowloadFilePath = sourceFilePath.replace('.txt', '.downloaded.txt');
  return new Promise((resolve, reject) => {
    blobService.getBlobToLocalFile(containerName, blobName, dowloadFilePath, err => {
      if (err) {
        reject(err);
      } else {
        resolve({ message: `Download of '${blobName}' complete` });
      }
    });
  });
};

const deleteBlock = (containerName, blobName) => {
  return new Promise((resolve, reject) => {
    blobService.deleteBlobIfExists(containerName, blobName, err => {
      if (err) {
        reject(err);
      } else {
        resolve({ message: `Block blob '${blobName}' deleted` });
      }
    });
  });
};