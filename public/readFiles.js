function readFiles(myDir){
    const fs = require('fs');

    fs.readdir(myDir, (err, files) => {
        debugger;
        files.forEach(file => {
            console.log(file);
        });
    });
}
readFiles('./pictures');

