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
    console.log(req.body.id);

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
    
    
        console.log(accounts[req.body.id]);
    
        res.json({"error": false, "data" : accounts});
    }

    
    
})


app.listen(port, () => {
    console.log("servidor iniciado");
})