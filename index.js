const fs = require("fs")
const path = require("path")

const dir = process.cwd()

const file = "memmory-game.apk"
const files = "platforms/android/app/build/outputs/apk/release/app-release.apk"
const path_delete = path.join(dir, "memmory-game.apk")


fs.access(path_delete, fs.constants.F_OK, (err) => {
    if (!err) {
        fs.unlink(path_delete, (err) => {
            if (err) {
                console.error(`Error deleting the file: ${err}`);
            } else {
                console.log(`File "${file}" has been deleted.`);
            }
        });
    } else {
        console.log(`File "${file}" does not exist in the current directory.`);
    }
});

fs.copyFile(files, path.join(__dirname, file), (err) => {
    if (err) {
        console.error('Error copying file:', err);
    } else {
        console.log('File copied successfully!');
    }
})