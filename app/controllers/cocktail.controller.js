const azureStorage = require('azure-storage');
const path = require('path');
const fs = require('fs');
const busboy = require('connect-busboy');
// const uuidv4 = require('uuid/v4');
//var multer  = require('multer');
//var upload = multer({ dest: 'uploads/' });

const utilities = require('../utilities/utilities');
const {Cocktail} = require('../models/cocktail.model');

exports.create = async function(req, res) {
    console.log('req.body @ create @ cocktail.controller: ', req.body);

    // Save the parameters passed from frontend
    let { cocktail } = req.body;
    let cocktailToSave = new Cocktail(cocktail);

    cocktailToSave.save()
    .then((theCocktail) => {
        console.log('cocktail @ cocktail.save: ', theCocktail);
        res.send({theCocktail});
    })
    .catch((err) => {
        res.status(400).send(err);
    })
};



exports.uploadImage = async function(req, res) {
    console.log('req.file @ uploadImage @ cocktail.controller: ', req.file);  // works
    console.log('req.file @ uploadImage @ cocktail.controller: ', req.files); // undefined
    console.log('req.body @ uploadImage @ cocktail.controller: ', req.body);  // empty {}

    let file = 'dummyFile';     // Change me later

    // Connect to storage in Azure
    const blobService = azureStorage.createBlobService('cocktailsappimages', '2tDehEUuFEQI2AR+yHbedd9LwQgwgN2oGRfxTeV0p0yKhnorI3GpPyr0+TduVwhJVWz7O6KiPXuJvnK6YzxorQ==');
    const storageLocation = 'apac1';

    let containerCreation = await createContainer(blobService, 'testcontainer');
    console.log('containerCreation: ', containerCreation);
   // let uploading = await upload('testcontainer', req.file.originalname, )

    var stream = fs.createReadStream(req.file.destination + path.sep + req.file.filename);
    const options = {};
    stream.pipe(blobService.createWriteStreamToBlockBlob('testcontainer', req.file.originalname, options, function(error, result, response) {
        if (error) {
            // remove from DB, send msg to support!
            // res.send({ error: error }).end();
        }
        else {

            blobService.getBlobProperties('testcontainer', req.file.originalname, function (err, result2) {
                // DriveFile.setSize(theFile._id, result2.contentLength, function(err, theFile2) {
                // });
                console.log('File uploaded!');
                //remove file from temporary uploads folder
                try {
                  setTimeout( function() { 
                    console.log('remove file', req.file.originalname);
                    fs.unlink(req.file.destination + path.sep + req.file.filename, (err) => {
                      // if (err) throw err;
                      // console.log('successfully deleted file');
                    });
                  }, 90000);
                }
                catch (error) {
                  console.log('Removing file failed!');
                  // decide whether to delete from blob again as well as from the driveFiles collection...
                }
            });
        }
    }))
    /*
    blobService.createContainerIfNotExists(driveId, function (error, result, response) {
        if (!error) {
          // Container exists and is private
          var stream = fs.createReadStream(uploadPath + path.sep + fileInfo.filename);
          const options = {};
          stream.pipe(blobSvc.createWriteStreamToBlockBlob(driveId, hash, options, function(error, result, response) {
            if (error) {
              // remove from DB, send msg to support!
              // res.send({ error: error }).end();
            }
            else {*/

};

const createContainer = (blobService, containerName) => {
    return new Promise((resolve, reject) => {
        blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, err => {
            if(err) {
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
            if(err) {
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
            if(err) {
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
            if(err) {
                reject(err);
            } else {
                resolve({ message: `Block blob '${blobName}' deleted` });
            }
        });
    });
};