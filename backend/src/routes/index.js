const express = require('express');

const AccountsRoutes = require('./AccountsRoutes');

module.exports = app => {
    //Routes for accounts
    app.use(AccountsRoutes);


    //default route for undefined paths
    app.use(function (req, res) {
        return res.status(404);
    });
}