const sqlite3 = require('sqlite3').verbose();
const csvtojson = require('./basicdatadownload');
const readjson3 = require('./generaldatadownload.js');



let db = new sqlite3.Database('./db/ettevotja_rekvisiidid__lihtandmed.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

db.serialize(function() {

const createTableSql = `
    CREATE TABLE IF NOT EXISTS ettevotte_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nimi TEXT,
    ariregistri_kood INTEGER NOT NULL,
    ettevotja_oiguslik_vorm TEXT,
    ettevotja_oigusliku_vormi_alaliik TEXT,
    kmkr_nr TEXT,
    ettevotja_staatus TEXT,
    ettevotja_staatus_tekstina TEXT,
    ettevotja_esmakande_kpv TEXT,
    ettevotja_aadress TEXT,
    asukoht_ettevotja_aadressis TEXT,
    asukoha_ehak_kood,asukoha_ehak_tekstina TEXT,
    indeks_ettevotja_aadressis TEXT,
    ads_adr_id TEXT,
    ads_ads_oid TEXT,
    ads_normaliseeritud_taisaadress TEXT,
    teabesysteemi_link TEXT,
    email TEXT,
    www TEXT,
    mob TEXT
    )
`;

db.run(createTableSql, function (err) {
    if (err) {
        return console.error('Error creating table:', err.message);
    }
    console.log('Table created successfully');
});

db.run('CREATE INDEX IF NOT EXISTS registrycode_idx ON ettevotte_info(ariregistri_kood)')

})

function dbliteconnection() {
  let start = Date.now();

 csvtojson()
    .then((jsonformaat) => {
        db.run("BEGIN TRANSACTION;");
        jsonformaat.forEach((element, index, array) => {
                console.log(element);
                const data = Object.values(element);
                const insertStatement = db.prepare("INSERT OR REPLACE INTO ettevotte_info (nimi,ariregistri_kood,ettevotja_oiguslik_vorm,ettevotja_oigusliku_vormi_alaliik,kmkr_nr,ettevotja_staatus,ettevotja_staatus_tekstina,ettevotja_esmakande_kpv,ettevotja_aadress,asukoht_ettevotja_aadressis,asukoha_ehak_kood,asukoha_ehak_tekstina,indeks_ettevotja_aadressis,ads_adr_id,ads_ads_oid,ads_normaliseeritud_taisaadress,teabesysteemi_link ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)");
                // many times
                insertStatement.run(data);
                insertStatement.finalize();
        });

        db.run("END;", () =>
          console.log(`Companies added to DB`));
        const minutes = (Date.now() - start) / 60000;
        console.log(Math.floor(minutes) + "min", (minutes - (Math.floor(minutes))) * 60 + "seconds");

    })
    .catch((err) => {
      console.log(err);
    });




  readjson3()
      .then((objektid) => {
          db.run("BEGIN TRANSACTION;");
          objektid.forEach((element, index, array) => {
              console.log(element);
              const data = Object.values(element);
              const insertStatement = db.prepare("UPDATE ettevotte_info SET (email, www, mob) = (?, ?, ?) WHERE (ariregistri_kood) = (?) ");
              insertStatement.run(data[2], data[4], data[3], data[0]);
              insertStatement.finalize();
          });
            console.log("Running DB run");
          db.run("END;", () =>
            console.log(`Companies updated with contact info`));

      db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Closed the database connection.');
        const minutes = (Date.now() - start) / 60000;
        console.log("Raw minutes " + minutes);
          console.log(Math.floor(minutes) + "min", (minutes - (Math.floor(minutes))) * 60 + "seconds");
      });
    })
    .catch((err) => {
      console.log(err);
    });



};

dbliteconnection();
