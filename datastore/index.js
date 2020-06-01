const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
    var data = _.map(files, (fileName) => {
      const fileExt = /\.txt$/;
      const id = fileName.replace(fileExt, '');
      return { id, text: id };
    });
    callback(null, data);
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
  var item = items[id];
  fs.writeFile(makeFilePath(id), text, {flag: 'wx'}, (err) => {
    if(err) {
      callback(err);
    } else {
      callback(null, { id, text });
    }
  });
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
