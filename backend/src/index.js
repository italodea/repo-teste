const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var db = require("./database/models.js");

const app = express();
app.use(bodyParser.json());
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));


const port = 3000;

app.post('/account/create', async function (req, res) {
    if (!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('type'))
    return res.status(400).json({ "error": true, "message": "Required parameter missing" });
    
    else {
        try {
            req.body.id += "";
            var id = req.body.id.replace("-", "");

            var row = await db.Accounts.findOne({
                where: {
                    account: id
                }
            });

            if (row == null) {
                var ammount = 0;
                if (req.body.type == "Simples") {
                    if(!req.body.hasOwnProperty('balance'))
                        return res.status(400).json({ "error": true, "message": "Required parameter missing" });                        
                    

                    ammount = parseFloat(req.body.balance)
                    if (!(ammount && ammount >= 0))
                        return res.status(400).json({ "error": true, "message": "Required parameter invalid." });
                    
                    await db.Accounts.create({
                        account: id,
                        balance: 0,
                        type: "Simples"
                    });

                } else if (req.body.type == "Bonus") {

                    await db.Accounts.create({
                        account: id,
                        balance: 0,
                        type: "Bonus",
                        bonus_points: 10
                    });

                } else if (req.body.type == "Poupanca") {

                    await db.Accounts.create({
                        account: id,
                        balance: 0,
                        type: "Poupanca"
                    });

                } else {
                    return res.status(400).json({ "error": true, "message": "Wrong type for account." });
                }

                var acc = {
                    "id": id,
                    "balance": ammount,
                    "type": req.body.type,
                };

                if (acc.type == "Bonus") {
                    acc.bonus_points = 10;
                }

                return res.json({ "error": false, "data": acc });
            } else {
                return res.status(400).json({ "error": true, "message": "Account already exists." });
            }
        } catch (error) {
            return res.status(503).json({ "error": true, "message": "Cannot query database" });
        }
    }
})

app.get('/account/balance/:id', async (req, res) => {
    if (!req.params.hasOwnProperty('id'))
        return res.status(400).json({ "error": true, "message": "Required parameter missing." });

    req.params.id += "";
    var id = req.params.id.replace('-', '')

    try {
        var row = await db.Accounts.findOne({
            where: {
                account: id
            }
        });

        if (row == null)
            return res.status(404).json({ "error": true, "message": "Account not found." });

        const acc = {
            "id": row.account,
            "balance": row.balance,
            "type": row.type
        };

        return res.json({ "error": false, "data": acc });
    } catch (error) {
        return res.status(503).json({ "error": true, "message": "Cannot query database" });
    }
})

app.put('/account/credit/', async (req, res) => {
    if (!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('value'))
        return res.status(400).json({ "error": true, "message": "Required parameter missing." });

    req.body.id += "";
    var id = req.body.id.replace('-', '');

    var ammount = parseFloat(req.body.value);

    if (!(ammount && ammount > 0))
        return res.status(400).json({ "error": true, "message": "Required parameter invalid." });

    try {

        await db.Accounts.update({
            balance: db.sequelize.literal('balance + ' + ammount)
        }, {
            where: {
                account: id
            }
        });

        var row = await db.Accounts.findOne({
            where: {
                account: id
            },
        });

        if (row == null)
            return res.status(404).json({ "error": true, "message": "Account not found." });
        
        if (row.type == "Bonus") {
            var points = Math.floor(ammount / 100);
            await db.Accounts.update({
                bonus_points: db.sequelize.literal('bonus_points +' + points)
            }, {
                where: {
                    account: id
                }
            });

        }

        const acc = row.type == "Bonus" ? 
        {
            "id": row.account,
            "balance": row.balance,
            "type": "Bonus",
            "bonus_points": row.bonus_points + points
        } : {
            "id": row.account,
            "balance": row.balance,
            "type": row.type
        };
        
        return res.json({ "error": false, "data": acc });
    } catch (error) {
        return res.status(503).json({ "error": true, "message": "Cannot query database" });
    }
})

app.put('/account/debit/', async (req, res) => {
    if (!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('value'))
        return res.status(400).json({ "error": true, "message": "Required parameter missing." });

    req.body.id += "";
    var id = req.body.id.replace('-', '');

    var ammount = parseFloat(req.body.value);

    if (!(ammount && ammount > 0))
        return res.status(400).json({ "error": true, "message": "Required parameter invalid." });

    try {
        
        await db.Accounts.update({
            balance: db.sequelize.literal('balance - ' + ammount)
        }, {
            where: {
                account: id
            },
        });

        var row = await db.Accounts.findOne({
            where: {
                account: id
            },
        });

        if (row == null)
            return res.status(404).json({ "error": true, "message": "Account not found." });

        if (row.balance < 0) {
            
            await db.Accounts.update({
                balance: db.sequelize.literal('balance + ' + ammount)
            }, {
                where: {
                    account: id
                },
            });

            return res.status(503).json({ "error": true, "message": "Insufficient balance." });
        }

        const acc = row.type == "Bonus" ? 
        {
            "id": row.account,
            "balance": row.balance,
            "type": "Bonus",
            "bonus_points": row.bonus_points
        } : {
            "id": row.account,
            "balance": row.balance,
            "type": row.type
        };
        
        return res.json({ "error": false, "data": acc });
    } catch (error) {
        return res.status(503).json({ "error": true, "message": "Cannot query database" });
    }
})

app.put('/account/transfer/', async (req, res) => {

    if (!req.body.hasOwnProperty('originId') || !req.body.hasOwnProperty('destinationId') || !req.body.hasOwnProperty('value'))
        return res.status(400).json({ "error": true, "message": "Required parameter missing." });

    req.body.originId += "";
    var originId = req.body.originId.replace('-', '');
    
    req.body.destinationId += "";
    var destinationId = req.body.destinationId.replace('-', '');

    var ammount = parseFloat(req.body.value);

    if (!(ammount && ammount > 0))
        return res.status(400).json({ "error": true, "message": "Required parameter invalid." });

    try {
        var originAccount = await db.Accounts.findOne({
            where: {
                account: originId
            },
        });

        if (originAccount == null)
            return res.status(404).json({ "error": true, "message": "Origin Account not found." });

        if (originAccount.balance < ammount)
            return res.status(503).json({ "error": true, "message": "Insufficient balance" });

        var destinationAccount = await db.Accounts.findOne({
            where: {
                account: destinationId
            },
        });

        if (destinationAccount == null)
            return res.status(404).json({ "error": true, "message": "Destination Account not found." });

        var bonus_points = 0;
        if(destinationAccount.type == "Bonus")
            bonus_points += destinationAccount.bonus_points + Math.floor(ammount / 150);

        await db.Accounts.update({
            balance: db.sequelize.literal('balance - ' + ammount)
        }, {
            where: {
                account: originId
            },
        });

        await db.Accounts.update({
            balance: db.sequelize.literal('balance + ' + ammount),
            bonus_points: bonus_points
        }, {
            where: {
                account: destinationId
            },
        });

        const acc = [ originAccount.type == "Bonus" ?
            { "id": originAccount.account,
            "balance": originAccount.balance - ammount,
            "type": "Bonus",
            "bonus_points": originAccount.bonus_points
            } : {
            "id": originAccount.account,
            "balance": originAccount.balance - ammount,
            "type": originAccount.type
            } 
        ];

        acc.push(destinationAccount.type == "Bonus" ?
        { "id": destinationAccount.account,
          "balance": destinationAccount.balance + ammount,
          "type": "Bonus",
          "bonus_points": bonus_points
        } : {
          "id": destinationAccount.account,
          "balance": destinationAccount.balance + ammount,
          "type": destinationAccount.type
        });

        return res.json({ "error": false, "data": acc });
    } catch (error) {
        return res.status(503).json({ "error": true, "message": "Cannot query database" });
    }
})

app.put('/account/yieldInterest/', async (req, res) => {
    if (!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('interestRate'))
        return res.status(400).json({ "error": true, "message": "Required parameter missing." });

    req.body.id += "";
    var id = req.body.id.replace('-', '');

    var interestRate = parseFloat(req.body.interestRate);

    if (!(interestRate && interestRate > 0))
        return res.status(400).json({ "error": true, "message": "Required parameter invalid." });

    try {
        var accPoupanca = await db.Accounts.findOne({
            where: {
                account: id
            },
        });

        if (accPoupanca == null)
            return res.status(404).json({ "error": true, "message": "Account not found." });

        if(accPoupanca.type != "Poupanca")
            return res.status(400).json({ "error": true, "message": "Operation 'Yield Interests' only supported for account type 'Poupança'." });

        await db.Accounts.update({
            balance: db.sequelize.literal('balance * ' + ( 1 + interestRate/100) )
        }, {
            where: {
                account: id
            },
        });
        
        const acc = {
            "id": accPoupanca.account,
            "balance": accPoupanca.balance * ( 1 + interestRate/100),
            "account type" : accPoupanca.type
        };

        return res.json({ "error": false, "data": acc });
    } catch (error) {
        return res.status(503).json({ "error": true, "message": "Cannot query database" });
    }
})

/* Default response for any other request */ 
app.use(function (req, res) {
    return res.status(404);
});

app.listen(port, () => {
    console.log(`servidor iniciado na porta ${port}`);
})