const path = require("path");
const fs = require("fs");
const MT = require("mark-twain");

const XXH = require("xxhashjs");

const H = XXH.h32(0xabcd); // seed = 0xABCD

const Utils = require("./utils");

function getFileList(root) {
  let res = [],
    files = fs.readdirSync(root);

  files.forEach(file => {
    const pathname = path.join(root, file),
      stat = fs.lstatSync(pathname);

    if (!stat.isDirectory()) {
      res.push(pathname);
    } else {
      res = res.concat(getFileList(pathname));
    }
  });
  return res;
}

const handle = function(folderPath, generatedPath) {
  var result = getFileList(folderPath)
    .filter(file => {
      return /\.md$/i.test(file);
    })
    .map(file => {
      const filePath = path.relative(folderPath, file);
      const pathHash = H.update(file)
        .digest()
        .toString(16);
      const contentUrl = path.relative(folderPath, file).replace(/[\/\\]/, "_") + "." + pathHash + ".json";

      const ml = MT(fs.readFileSync(file));
      const originalDatas = {
        metas: ml.meta,
        path: filePath,
        contentUrl: contentUrl,
        id: filePath.replace(/[\/\\]/g, "-").replace(/\.md$/g, "")
      };

      Utils.writeSync(
        path.join(generatedPath, contentUrl),
        JSON.stringify(
          Object.assign(
            {
              body: ml.content
            },
            originalDatas
          )
        )
      );

      return originalDatas;
    });

  return result;
};
function ParseReadMe(options, generatedPath) {
  var results = {};
  if (!options) {
    return null;
  }

  if (typeof options === "string") {
    results = handle(options, generatedPath);
  } else {
    throw new Error("仅支持某一路径：String类型");
  }

  fs.writeFileSync(path.join(generatedPath, "metadatas.json"), JSON.stringify(results));

  return results;
}

module.exports = { ParseReadMe };
