/*
Adapted from  https://github.com/metafloor/bwip-js to use Express.js
*/
const express = require("express");
const bwipjs = require('bwip-js');
const app = express();

app.get("/", (req, res) => {
    if (!req.query.bcid || !req.query.text) {
        res.status(400).end();
    } else {
        bwipjs(req, res);
    }
});

const server = app.listen(process.env.EXPRESS_PORT || 3000, () => {
    console.log("barcode-generator is listening on port", server.address().port);
});
