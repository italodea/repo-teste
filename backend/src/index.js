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
]

app.post('/account/create', function (req, res) {
    if (!req.body.hasOwnProperty('id')){
        res.status(400).json({"error": true, "message": "The id key was not supplied"});
    }
    if (accounts.find(a => a.id === req.body.id.replace("-",""))) {
        res.status(409).json({"error": true, "message": "The account already exists" });
    }else{
        accounts.push({
            "id": req.body.id.replace("-",""),
            "balance" : 0
        });
    
        res.json({"error": false, "data" : accounts});
    }
})


app.get('/account/balance/', (req, res) => {
    res.status(400).json({"error" : true, "message" : "Required parameter missing."});
});


app.get('/account/balance/:id', (req, res) => {
    // if (!req.params.hasOwnProperty('id'))
    //     res.status(400).json({"error" : true, "message" : "Required parameter missing."});
    const acc = accounts.find( a => a.id === req.params.id.replace("-","") );
    
    if (!acc)
        res.status(404).json({"error" : true, "message" : "Account not found"});
    else
        res.json({"error" : false, "data" : acc});
})

app.listen(port, () => {
    console.log(`servidor iniciado na porta ${port}`);
})