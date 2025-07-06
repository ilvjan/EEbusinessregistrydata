Makes the Estonian e-business registry open data available through API endpoints.

1. Downloads basic data from https://avaandmed.ariregister.rik.ee/sites/default/files/avaandmed/ettevotja_rekvisiidid__lihtandmed.csv.zip
2. Adds to SQLITE
3. Downloads general data from https://avaandmed.ariregister.rik.ee/sites/default/files/avaandmed/ettevotja_rekvisiidid__yldandmed.json.zip
4. Adds contact details from general data to basic data DB
5. Takes about 5 minutes to add to database.
6. Makes 2 API endpoints available locally 1) search for companies by keyword 2) get the company data by registry code

Takes about 5 minutes.

How to run:
1. npm install
2. node dbliteconnection.js

