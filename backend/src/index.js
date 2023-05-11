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

app.get('/account/balance/', (req, res) => {
    res.status(400).json({"error" : true, "message" : "Required parameter missing."});
})

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