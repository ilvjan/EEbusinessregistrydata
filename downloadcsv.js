module.exports = function (this_url, this_filepath, this_result) {
  const fs = require('fs');
  const http = require('http');
  const https = require('https');
  //const decompress = require("decompress");
  let yauzl = require("yauzl");


  const url = this_url;
  const filePath = this_filepath;
  const result = this_result;
  const folder = "dist";
  
  

  /**
   * Downloads file from remote HTTP[S] host and puts its contents to the
   * specified location.
   */
  async function download(url, filePath) {
    const proto = !url.charAt(4).localeCompare('s') ? https : http;

    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filePath);
      let fileInfo = null;

      const request = proto.get(url, response => {
        if (response.statusCode !== 200) {
          fs.unlink(filePath, () => {
            reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
          });
          return;
        }

        fileInfo = {
          mime: response.headers['content-type'],
          size: parseInt(response.headers['content-length'], 10),
        };

        response.pipe(file);
      });

      // The destination stream is ended by the time it's called
      file.on('finish', () => resolve(fileInfo));

      request.on('error', err => {
        fs.unlink(filePath, () => reject(err));
      });

      file.on('error', err => {
        fs.unlink(filePath, () => reject(err));
      });

      request.end();

    });

  }

  function unzip (){
    return new Promise((resolve, reject) => {
    let writeStream = fs.createWriteStream("./" + folder + "/" + result);
  yauzl.open(filePath, {lazyEntries: true}, function(err, zipfile) {
    if (err) throw err;
    zipfile.readEntry();
    zipfile.on("entry", function(entry) {
      if (/\/$/.test(entry.fileName)) {
        // Directory file names end with '/'.
        // Note that entries for directories themselves are optional.
        // An entry's fileName implicitly requires its parent directories to exist.
        zipfile.readEntry();
      } else {
        // file entry
        zipfile.openReadStream(entry, function(err, readStream) {
          if (err) throw err;
          readStream.on("end", function() {
            zipfile.readEntry();
          });
          readStream.pipe(writeStream); 
        });
      }
    });
  });
  writeStream.on('finish', () => resolve());
});
  };
  



  return new Promise(function (resolve, reject) {
    download(url, filePath)
      .then(() => {
        console.log("Allalaetud");
        //decompress(filePath, folder)
        unzip()
          .then(() => {
            resolve("./" + folder + "/" + result);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch(err => {
        reject(err);
      });
  })

};
