const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const port = 3000;

let accounts = [
    {
        id: "1234567",
        balance: 0
    }
];

app.post('/account/create', function (req, res) {
    if (!req.body.hasOwnProperty('id'))
        return res.status(400).json({"error": true, "message": "Required parameter missing"});

    if (accounts.find(a => a.id === req.body.id.toString().replace("-",""))) 
        return res.status(409).json({"error": true, "message": "Account already exists." });
    else {
        accounts.push(
            {
                "id": req.body.id.toString().replace("-",""),
                "balance" : 0
            });
    
        return res.json({"error": false, "data" : accounts});
    }
})

app.get('/account/balance/', (req, res) => {
    return res.status(400).json({"error" : true, "message" : "Required parameter missing."});
})

app.get('/account/balance/:id', (req, res) => {
    // if (!req.params.hasOwnProperty('id'))
    //     res.status(400).json({"error" : true, "message" : "Required parameter missing."});
    const acc = accounts.find( a => a.id === req.params.id.toString().replace("-","") );
    
    if (!acc)
        return res.status(404).json({"error" : true, "message" : "Account not found."});
    else
        return res.json({"error" : false, "data" : acc});
})

app.put('/account/credit/', (req, res) => {
    if (!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('value'))
        return res.status(400).json({"error": true, "message": "Required parameter missing."});
    
    const aux = parseFloat(req.body.value);
    
    if (aux && aux > 0) {
        const acc = accounts.find( a => a.id === req.body.id.toString().replace("-","") );
        if (!acc) 
            return res.status(404).json({"error" : true, "message" : "Account not found."});
        else {
            acc.balance += aux;
            return res.json({"error" : false, "data" : acc});
        }
    } else
        return res.status(400).json({"error": true, "message": "Required parameter invalid."});
})

app.put('/account/debit/', (req, res) => {
    if (!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('value'))
        return res.status(400).json({"error": true, "message": "Required parameter missing."});
    
    const aux = parseFloat(req.body.value);

    if (aux && aux > 0) {
        const acc = accounts.find( a => a.id === req.body.id.toString().replace("-","") );
        if (!acc) 
            return res.status(404).json({"error" : true, "message" : "Account not found."});
        else {
            acc.balance -= aux;
            return res.json({"error" : false, "data" : acc});
        }
    } else
        return res.status(400).json({"error": true, "message": "Required parameter invalid."});
})

app.put('/account/transfer/', (req, res) => {
    if (!req.body.hasOwnProperty('originId') || !req.body.hasOwnProperty('destinationId') || !req.body.hasOwnProperty('value'))
        return res.status(400).json({"error": true, "message": "Required parameter missing."});

    if (req.body.originId.toString().replace("-","") === req.body.destinationId.toString().replace("-",""))
        return res.status(400).json({"error": true, "message": "Parameters for 'originId' and 'destinationId' must be different."});
    
    const aux = parseFloat(req.body.value);

    if (aux && aux > 0) {
        const accOrigin = accounts.find( a => a.id === req.body.originId.toString().replace("-","") );
        const accDestination = accounts.find( a => a.id === req.body.destinationId.toString().replace("-",""));
        if (!accOrigin) 
            return res.status(404).json({"error" : true, "message" : `Account with id : ${req.body.originId} not found.`});
        else if (!accDestination)
            return res.status(404).json({"error" : true, "message" : `Account with id : ${req.body.destinationId} not found.`});
        else {
            accOrigin.balance -= aux;
            accDestination.balance += aux;
            return res.json({"error" : false, "data" : {"origin": accOrigin, "destination": accDestination}});
        }
    } else
        return res.status(400).json({"error": true, "message": "Required parameter invalid."});
})

app.listen(port, () => {
    console.log(`servidor iniciado na porta ${port}`);
})