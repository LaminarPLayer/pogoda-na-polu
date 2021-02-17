function readFiles(myDir){
    const fs = require('fs');

    fs.readdir(myDir, (err, files) => {
        files.forEach(file => {
            console.log(file);
        });
    });
}
readFiles('./pictures');

