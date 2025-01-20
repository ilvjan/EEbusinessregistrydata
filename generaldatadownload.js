module.exports = function () {

  const fs = require('fs');
  const path = require('path');
  const json = require('big-json');
  const downloadcsv = require('./downloadcsv.js');
  let objekt = {};
  let objektid = [];

  const readjson = new Promise((resolve, reject) => {

    downloadcsv('https://avaandmed.ariregister.rik.ee/sites/default/files/avaandmed/ettevotja_rekvisiidid__yldandmed.json.zip', 'ettevotja_rekvisiidid__yldandmed.zip', "ettevotja_rekvisiidid__yldandmed.json")
      .then((path) => {
        const readStream = fs.createReadStream(path);
        const parseStream = json.createParseStream();
        parseStream.on('data', function (pojo) {
          pojo.forEach(function (item, index) {
            objekt = { "ariregistri_kood": item.ariregistri_kood, "nimi": item.nimi, "EMAIL": null, "MOB": null, "WWW": null, "TEL": null }
            let sidevahendid = item["yldandmed"]["sidevahendid"];
            if (sidevahendid != null) {
              sidevahendid.forEach(function (item, index) {
                objekt[item.liik] = item.sisu;
              })
            }
            objektid.push(objekt);
          })
          resolve();
        });
        readStream.pipe(parseStream);
      })
      .catch((err) => {
        console.log(err);
        reject();
      });
  });

  return new Promise(function (resolve, reject) {
    readjson
      .then(() => {
        console.log("Fail sisselaetud")
        resolve(objektid);
      })
      .catch(err => {
        reject(err);
      });
  })

}


