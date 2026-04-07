const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data");

function readFile(fileName) {
  try {
    const data = fs.readFileSync(path.join(dataPath, fileName));
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeFile(fileName, data) {
  fs.writeFileSync(
    path.join(dataPath, fileName),
    JSON.stringify(data, null, 2)
  );
}

module.exports = { readFile, writeFile };