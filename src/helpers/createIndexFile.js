const fs = require("fs-extra");
const path = require("path");
const removeExtensionFromFilePath = require("./removeExtensionFromFilePath");

function createIndexFile(dir) {
    const files = fs.readdirSync(dir);

    const imports = files
        .reduce((acc, file) => {
            const fileString = fs.statSync(path.join(dir, file)).isDirectory()
                ? `import * as ${removeExtensionFromFilePath(file)} from './${removeExtensionFromFilePath(file)}';`
                : `import ${removeExtensionFromFilePath(file)} from './${removeExtensionFromFilePath(file)}';`;
            return `${acc}\n${fileString}`;
        }, "")
        // Remove the first line break
        .replace(/^\n/, "");

    // 'export' is a reserved keyword
    const xport = files
        .reduce((acc, file) => `${acc}\n\t${removeExtensionFromFilePath(file)},`, `export default {`)
        .concat("\n}");

    fs.outputFileSync(path.join(dir, "index.js"), `${imports}\n\n${xport}\n`, "utf-8");
}

module.exports = createIndexFile;
