const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const Promise = require('bluebird');
const counter = require('./counter');
const readFilePromise = Promise.promisify(fs.readFile);

var items = {};

// Helper functions
const makeFilePath = id => path.join(exports.dataDir, `${id}.txt`);

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    items[id] = text;
    fs.writeFile(makeFilePath(id), text, (err) => {
      if(err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    }
    const promises = _.map(files, file => {
      return readFilePromise(path.join(exports.dataDir, file), 'utf8');
    });
    Promise.all(promises)
      .then(fileStrings => {
        const idContents = _.zip(files, fileStrings);
        const data = _.map(idContents, ([name, content]) => {
          const fileExt = /\.txt$/;
          const id = name.replace(fileExt, '');
          return { id, text: content };
        });
        callback(null, data);
      })
      .catch(err => {
        callback(err);
      });
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(makeFilePath(id), 'utf8', (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      items[id] = fileData;
      callback(null, { id, text: fileData });
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  fs.readFile(makeFilePath(id), (err) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(makeFilePath(id), text, (err) => {
        if(err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(makeFilePath(id), (err) => {
    if (err) {
      // report an error if item not found
      callback(err);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
