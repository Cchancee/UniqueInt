const fs = require('fs');
const path = require('path');


// Custom function to trim whitespace from a string
function customTrim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}


// Function to check if a string represents a valid integer
function isValidInteger(str) {
    return /^-?\d+$/.test(str.trim());
}

function readFilesInDirectory(inputDir) {
    fs.readdir(inputDir, (err, files) => {
        if (err) {
            console.error('Error reading input directory:', err);
            return;
        }

        files.forEach(file => {
            if (file.endsWith('.txt')) {
                const filePath = path.join(inputDir, file);
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(`Error reading file ${filePath}:`, err);
                    } else {
                        processFileContents(data, filePath);
                    }
                });
            }
        });
    });
}



// Function to process the contents of a file
function processFileContents(data, filePath) {
    const lines = data.split(/\r?\n/);
    const uniqueIntegers = [];
    const seenIntegers = {};

    lines.forEach(line => {
        const trimmedLine = customTrim(line);
        if (trimmedLine && isValidInteger(trimmedLine)) {
            const number = parseInt(trimmedLine, 10);
            if (!seenIntegers[number]) {
                uniqueIntegers.push(number);
                seenIntegers[number] = true;
            }
        }
    });

    // Sort the unique integers using bubble sort
    insertionSort(uniqueIntegers);

    // Write to output file
    writeOutputFile(filePath, uniqueIntegers);
}

// Function using insertion sort to sort an array of integers in ascending order

function insertionSort(arr) {
    let last = arr.length - 1
    let greater = arr[last]

    for (let j = 0; j <= arr.length; j++) {
        for (let i = last; i >= 0; i--) {   
            if (greater < arr[i]) {
                greater = arr[i]

                let temp = arr[i]
                arr[i] =  arr[last]
                arr[last] = temp
            }
        }
        last--
        greater = arr[last]
    }
}



// Function to write sorted unique integers to output file
function writeOutputFile(inputFilePath, uniqueIntegers) {
    const baseDir = path.join(__dirname, '../..'); // Adjust the base directory as per your structure
    const outputDir = path.join(baseDir, 'sample_results');
    const outputFileName = path.basename(inputFilePath) + '_results.txt';
    const outputFilePath = path.join(outputDir, outputFileName);

    // Write the sorted unique integers to the output file
    fs.writeFile(outputFilePath, uniqueIntegers.join('\n'), err => {
        if (err) {
            console.error(`Error writing file ${outputFilePath}:`, err);
        } else {
            console.log(`Successfully processed ${inputFilePath} and saved to ${outputFilePath}`);
        }
    });
}


// Main function to read and log files
function main() {
    const baseDir = path.join(__dirname, '../..'); // Adjust the base directory as per your structure
    const inputDir = path.join(baseDir, 'sample_inputs');

    // Read and log the contents of the files in the input directory
    readFilesInDirectory(inputDir);
}

// Run the main function
main();
