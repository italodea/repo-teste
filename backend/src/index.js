const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));


routes(app)

app.listen(port, () => {
    console.log(`servidor iniciado na porta ${port}`);
})