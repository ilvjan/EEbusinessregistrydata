function findcompanies(companyname, callback) {
  const sqlite3 = require('sqlite3').verbose();

  // open the database
  let db = new sqlite3.Database('./db/ettevotja_rekvisiidid__lihtandmed.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
  });

  let valmis = [];

  db.each("SELECT ariregistri_kood, nimi, ettevotja_staatus_tekstina FROM ettevotte_info WHERE nimi LIKE '%' || ? || '%'", companyname,
    (error, row) => {
      if (error) {
        throw error;
      }
      /*gets called for every row our query returns*/
      const objekt = { regcode: row.ariregistri_kood, name: row.nimi, staatus: row.ettevotja_staatus_tekstina };
      //console.log(objekt);
      valmis.push(objekt);
    },
    () => {
      console.log(valmis);
      callback(valmis);
      db.close();
    });
};


function getcompanies(registrycode, callback) {
  const sqlite3 = require('sqlite3').verbose();

  // open the database
  let db = new sqlite3.Database('./db/ettevotja_rekvisiidid__lihtandmed.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
  });

  let valmis = [];

  db.each("SELECT * FROM ettevotte_info WHERE ariregistri_kood = ?", registrycode,
    (error, row) => {
      if (error) {
        throw error;
      }
      /*gets called for every row our query returns*/
      const objekt = { regcode: row.ariregistri_kood, name: row.nimi, street: row.asukoht_ettevotja_aadressis, postCode: row.indeks_ettevotja_aadressis, city: row.asukoha_ehak_tekstina, kmkr: row.kmkr_nr, staatus:row.ettevotja_staatus_tekstina, email: row.email, www: row.www, mob: row.mob };
      //console.log(objekt);
      valmis.push(objekt);
    },
    () => {
      console.log(valmis);
      callback(valmis);
      db.close();
    });
};


module.exports = {
  findcompanies,
  getcompanies
};

