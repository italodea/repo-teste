const express = require('express');
const bodyParser = require('body-parser');

var db = require("./database/manage.js")

const app = express();
app.use(bodyParser.json());



const port = 3000;

app.post('/account/create', function (req, res) {
    if (!req.body.hasOwnProperty('id'))
        return res.status(400).json({ "error": true, "message": "Required parameter missing" });
    else {
        req.body.id += "";

        var sql = "select * from accounts where account = ?"
        var params = [req.body.id.replace('-', '')]

        db.get(sql, params, (err, row) => {
            if (row) {
                return res.status(503).json({ "error": true, "message": "Account already exists." });
            } else {
                var sql = 'INSERT INTO accounts (account, balance) VALUES (?,?)';
                db.run(sql, [req.body.id.replace("-", ""), 0], (err) => {
                    if (err) {
                        return res.status(503).json({ "error": true, "message": "Cannot query database" });
                    } else {
                        var acc = {
                            "id": req.body.id.replace("-", ""),
                            "balance": 0
                        }
                        return res.json({ "error": false, "data": acc });
                    }
                })
            }
        });
    }
})


app.get('/account/balance/:id', (req, res) => {

    // Check if the req has the parameter id
    if (!req.params.hasOwnProperty('id'))
        return res.status(400).json({ "error": true, "message": "Required parameter missing." });


    var sql = "select * from accounts where account = ?"
    var params = [req.params.id.replace('-', '')]

    db.get(sql, params, (err, row) => {
        if (err) {
            return res.status(503).json({ "error": true, "message": "Cannot query database" });
        } else {
            if (row) {
                const acc = {
                    "id": row.account,
                    "balance": row.balance
                };
                return res.json({ "error": false, "data": acc });
            } else {
                return res.status(404).json({ "error": true, "message": "Account not found." });
            }
        }
    });


})

app.put('/account/credit/', (req, res) => {
    if (!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('value'))
        return res.status(400).json({ "error": true, "message": "Required parameter missing." });


    var sql = "select * from accounts where account = ?";
    //convert id into string if it comes without the '-'
    req.body.id += ""
    var ammount = parseFloat(req.body.value)

    if (!(ammount && ammount > 0))
        return res.status(400).json({ "error": true, "message": "Required parameter invalid." });


    var params = [req.body.id.replace("-", "")];

    /**
     * Get the account by the account number and then run the update with new balance
     */
    db.get(sql, params, (err, row) => {
        if (err) {
            return res.status(503).json({ "error": true, "message": "Cannot query database" });
        } else {
            if (row) {
                var balance = row.balance + ammount;
                var sql = "update accounts set balance = ? where account = ? "
                var params = [balance, req.body.id.replace("-", "")]

                db.run(sql, params, (err) => {
                    if (err) {
                        return res.status(503).json({ "error": true, "message": "Cannot query database" });
                    }
                });
                const acc = {
                    "id": row.account,
                    "balance": balance
                };
                return res.json({ "error": false, "data": acc });
            } else {
                return res.status(404).json({ "error": true, "message": "Account not found." });
            }
        }
    });


})

app.put('/account/debit/', (req, res) => {
    if (!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('value'))
        return res.status(400).json({ "error": true, "message": "Required parameter missing." });


    var sql = "select * from accounts where account = ?";
    //convert id into string if it comes without the '-'
    req.body.id += ""
    var ammount = parseFloat(req.body.value)

    if (!(ammount && ammount > 0))
        return res.status(400).json({ "error": true, "message": "Required parameter invalid." });


    var params = [req.body.id.replace("-", "")];

    /**
     * Get the account by the account number and then run the update with new balance
     */
    db.get(sql, params, (err, row) => {
        if (err) {
            return res.status(503).json({ "error": true, "message": "Cannot query database" });
        } else {
            if (row) {
                var balance = row.balance - ammount;
                var sql = "update accounts set balance = ? where account = ? "
                var params = [balance, req.body.id.replace("-", "")]

                db.run(sql, params, (err) => {
                    if (err) {
                        return res.status(503).json({ "error": true, "message": "Cannot query database" });
                    }
                });
                const acc = {
                    "id": row.account,
                    "balance": balance
                };
                return res.json({ "error": false, "data": acc });
            } else {
                return res.status(404).json({ "error": true, "message": "Account not found." });
            }
        }
    });
})

app.put('/account/transfer/', (req, res) => {
    if (!req.body.hasOwnProperty('originId') || !req.body.hasOwnProperty('destinationId') || !req.body.hasOwnProperty('value'))
        return res.status(400).json({ "error": true, "message": "Required parameter missing." });

    if (req.body.originId.replace("-", "") === req.body.destinationId.replace("-", ""))
        return res.status(400).json({ "error": true, "message": "Parameters for 'originId' and 'destinationId' must be different." });



    var sql = "select * from accounts where account = ?";
    //convert id into string if it comes without the '-'
    req.body.originId += ""
    req.body.destinationId += ""

    var ammount = parseFloat(req.body.value)

    if (!(ammount && ammount > 0))
        return res.status(400).json({ "error": true, "message": "Required parameter invalid." });


    var params = [req.body.originId.replace("-", "")];

    // get the origin account
    db.get(sql, params, (err, rowOrigin) => {
        if (err) {
            return res.status(503).json({ "error": true, "message": "Cannot query database" });
        } else {
            if (rowOrigin) {

                //get the destination account
                params = [req.body.destinationId.replace("-", "")];
                db.get(sql, params, (err, rowDestination) => {

                    if (err) {
                        return res.status(503).json({ "error": true, "message": "Cannot query database" });
                    } else {

                        // check if origin is ok
                        if (!rowOrigin) {
                            return res.status(404).json({ "error": true, "message": "Origin account not found." });
                        }
                        // check if destination is ok
                        else if (!rowDestination) {
                            return res.status(404).json({ "error": true, "message": "Destination account not found." });
                        }

                        else {

                            // debit from the origin account
                            var balance = rowOrigin.balance - ammount;
                            var sql = "update accounts set balance = ? where account = ? "
                            var params = [balance, rowOrigin.account]

                            db.run(sql, params, (err) => {
                                if (err) {
                                    return res.status(503).json({ "error": true, "message": "Cannot query database" });
                                }
                            });


                            const acc = [{
                                "id": rowOrigin.account,
                                "balance": balance
                            }];

                            // credit in the destination account
                            balance = rowDestination.balance + ammount;
                            sql = "update accounts set balance = ? where account = ? "
                            params = [balance, rowDestination.account]

                            db.run(sql, params, (err) => {
                                if (err) {
                                    return res.status(503).json({ "error": true, "message": "Cannot query database" });
                                }
                            });

                            acc.push({
                                "id": rowDestination.account,
                                "balance": balance
                            });

                            return res.json({ "error": false, "data": acc });
                        }
                    }
                });
            } else {
                return res.status(404).json({ "error": true, "message": `Account with id : ${req.body.originId} not found.` });
            }
        }
    });
})


// Default response for any other request
app.use(function (req, res) {
    return res.status(404);
});

app.listen(port, () => {
    console.log(`servidor iniciado na porta ${port}`);
})