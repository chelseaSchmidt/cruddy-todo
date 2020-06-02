const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');
const readFile = Promise.promisify(fs.readFile);
const writeFile = Promise.promisify(fs.writeFile);

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  return new Promise((resolve, reject) => {
    readFile(exports.counterFile)
      .then(fileData => {
        resolve(Number(fileData));
      })
      .catch(err => {
        reject(err);
      });
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  return new Promise((resolve, reject) => {
    writeFile(exports.counterFile, counterString)
    .then(() => {
      resolve(counterString);
    })
    .catch(err => {
      reject(err);
    });
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  return readCounter()
    .then(id => {
      const newId = id + 1;
      return writeCounter(newId);
    });
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
