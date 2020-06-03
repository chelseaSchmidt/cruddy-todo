const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const Promise = require('bluebird');
const counter = require('./counter');
const readFile = Promise.promisify(fs.readFile);
const writeFile = Promise.promisify(fs.writeFile);
const readdir = Promise.promisify(fs.readdir);
const unlink = Promise.promisify(fs.unlink);

var items = {};

// Helper functions
const makeFilePath = id => path.join(exports.dataDir, `${id}.txt`);

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = text => {
  let newId;
  return new Promise((resolve, reject) => {
    counter.getNextUniqueId()
      .then(id => {
        newId = id;
        items[newId] = text;
        return writeFile(makeFilePath(id), text);
      })
      .then(() => {
        resolve({id: newId, text});
      })
      .catch(reject);
  });
};

exports.readAll = () => {
  let fileNames;
  return new Promise((resolve, reject) => {
    readdir(exports.dataDir)
      .then(files => {
        fileNames = files;
        return _.map(files, file => {
          return readFile(path.join(exports.dataDir, file), 'utf8');
        });
      })
      .then(promises => {
        return Promise.all(promises);
      })
      .then(fileStrings => {
        const idContents = _.zip(fileNames, fileStrings);
        resolve(_.map(idContents, ([name, content]) => {
          const fileExt = /\.txt$/;
          const id = name.replace(fileExt, '');
          return { id, text: content };
        }));
      })
      .catch(reject);
  });
};

exports.readOne = (id) => {
  return new Promise((resolve, reject) => {
    readFile(makeFilePath(id), 'utf8')
      .then(fileData => {
        items[id] = fileData;
        resolve({ id, text: fileData });
      })
      .catch(reject);
  });
};

exports.update = (id, text) => {
  // var item = items[id];
  return new Promise((resolve, reject) => {
    readFile(makeFilePath(id), 'utf8')
      .then(() => {
        return writeFile(makeFilePath(id), text);
      })
      .then(() => {
        resolve({id, text});
      })
      .catch(reject);
  });
};

exports.delete = id => {
  return new Promise((resolve, reject) => {
    unlink(makeFilePath(id))
      .then(resolve)
      .catch(reject);
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
