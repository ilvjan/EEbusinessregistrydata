module.exports = function () {

  const fs = require('fs');
  let i = 1;
  let jsonformaat = [];
  const downloadcsv = require('./downloadcsv.js');
  const regex = /;(?=(?:(?:[^"]*"){2})*[^"]*$)/;

  const csvtojson = new Promise((resolve, reject) => {

    downloadcsv('https://avaandmed.ariregister.rik.ee/sites/default/files/avaandmed/ettevotja_rekvisiidid__lihtandmed.csv.zip','ettevotja_rekvisiidid__lihtandmed.zip','ettevotja_rekvisiidid__lihtandmed.csv' )
      .then((path) => {
        //'./dist/ettevotja_rekvisiidid__lihtandmed.csv'
        let data = fs.readFileSync(path)
          .toString() // convert Buffer to string
          .split('\n') // split string to lines
          .map(e => e.trim()) // remove white spaces for each line
          .map(e => e.split(regex)); // split each line to array

        let headerrow = data[0];
        headerrow[data[0].length - 1] = headerrow[data[0].length - 1].replace(/\,/g, '') // .csv faili iga rea lõpus on palju komasid. Sellega eemaldan n.ö header realt komad. 

        while (i < data.length - 1) { // käime läbi ettevõtete järjendi
          let row = {};
          for (let j = 0; j < data[i].length; j++) { // käime läbi ettevõte andmete järjendi
            if (!data[i][j]) { // kui on tühi siis pane väärtuseks null
              row[headerrow[j]] = null;
            }
            else if (!isNaN(data[i][j])) { // kui väärtus on number siis salvesta numbrina
              row[headerrow[j]] = parseInt(data[i][j]);
            }
            else if (j == data[i].length - 1) {
              data[i][j] = data[i][j].replace(/\,/g, ''); // kui on viimane andmetükk järjendis siis eemaldame sellelt komad
              row[headerrow[j]] = data[i][j];
            }
            else {
              row[headerrow[j]] = data[i][j];
            }
          }
          jsonformaat.push(row);
          i++;
        }
        resolve();
      })
      .catch((err) => {
        console.log(err);
        reject();
      });

  });

  //console.log(jsonformaat.slice(1065,1071));
  //console.log(jsonformaat[182]);


  return new Promise(function (resolve, reject) {
    csvtojson
      .then(() => {
        console.log("Fail JSON formaadis")
        resolve(jsonformaat);
      })
      .catch(err => {
        reject(err);
      });
  })

};

