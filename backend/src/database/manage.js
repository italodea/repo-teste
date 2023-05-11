var sqlite3 = require('sqlite3')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        // Create tables if not exists
        db.run(`
        CREATE TABLE accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account INTEGER, 
            balance REAL,
            CONSTRAINT id_unique UNIQUE (id),
            CONSTRAINT account_unique UNIQUE (account)
        )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO accounts (account, balance) VALUES (?,?)'
                db.run(insert, [1234567,0])
                db.run(insert, [1234568,0])
            }
        });  
    }
});


module.exports = db