const path = require('path');
const fs = require('fs');

const dictionariesFolder = path.join(__dirname, 'dictionaries');
const outputFolder = path.join(__dirname, 'output');

async function main() {
    try {
        const files = await getFiles();

        for (const file of files) {
            const dictionary = dictionariesFolder + "/" + file;
            const outputFile = outputFolder + "/" + file;

            const convertedDictionary = await convertDictionary(dictionary);
            await writeResult(outputFile, convertedDictionary);
        }
    } catch (err) {
        throw err;
    }
}

async function getFiles() {
    try {
        return await fs.promises.readdir(dictionariesFolder);
    } catch (err) {
        console.error('Error occurred while reading directory!', err);
    }
}

async function convertDictionary(dictionaryPath) {
    try {
        const data = await fs.promises.readFile(dictionaryPath);
        const content = data.toString();
        return await normalizeDictionary(content);
    } catch (err) {
        console.error('Error occurred while converting a dictionary!', err);
    }
}


function normalizeDictionary(content) {
    return new Promise((resolve, reject) => {

        // Remove BOM and \r characters.
        content = stripBOM(content);
        content = content.replace(/\/(.*)/g, '');

        // Sort words.
        let lines = content.split('\n');
        const collator = new Intl.Collator(); // Use this comparator for consider accents and special characters.
        lines = lines.sort(collator.compare);

        // Generate output content.
        let newContent = '';
        let first = true;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i] !== '' && lines[i] !== '\n') {
                if (!first) { newContent += '\n'; }
                newContent += lines[i];
                first = false;
            }
        }

        resolve(newContent);
    });
}

function stripBOM(s) {
    if (s.charCodeAt(0) === 0xFEFF) {
        return s.slice(1);
    }

    return s;
}

async function writeResult(fileName, content) {
    try {
        return await fs.promises.writeFile(fileName, content);
    } catch (err) {
        console.error('Error occurred while reading directory!', err);
    }
}

main().catch(console.error)
