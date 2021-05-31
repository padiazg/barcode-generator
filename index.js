/*
Adapted from  https://github.com/metafloor/bwip-js to use Express.js
*/
const express = require("express");
const bwipjs = require('bwip-js');
// const gm = require('gm');
const { Readable, Duplex } = require("stream");
const PNGDecoder = require("png-stream/decoder");
const JPEGEncoder = require("jpg-stream/encoder");
const ColorTransform = require("color-transform");

// const { buffer } = require("jpg-stream/build/jpeg");
const fs = require("fs");

const app = express();

// converts a Buffer to a Stream
const toStream = buffer => {
    const stream = new Duplex()
    stream.push(buffer);
    stream.push(null);
    return stream
} // toStream ...

// converts a Stream to a Buffer
const toBuffer = stream => new Promise((resolve, reject) => {
    let b0 = [];
    stream.on('error', reject);
    stream.on('data', data => b0.push(data));
    stream.on('end', () => resolve(Buffer.concat(b0)));
}); // toBuffer ...

// Converts a PNG stream into a JPG
const toJPG = stream => stream
    .pipe(new PNGDecoder)
    .pipe(new ColorTransform('gray'))
    .pipe(new JPEGEncoder)
    ;

app.get("/", (req, res) => {
    let parameters = req.query;

    if (!req.query.bcid || !req.query.text) {
        return res
            .status(404)
            .contentType('text/plain')
            .end('BarcodeGenerator: Missing bcid or text parameter', 'utf8')
            ;
    }

    // parameters from this project
    const base64 = parameters.base64 ? parameters.base64 : false;
    delete parameters.base64;

    const format = parameters.format ? parameters.format.toLowerCase() : 'png';
    delete parameters.format;

    // parameters from bwip-js project
    // set some defaults
    parameters.bcid = parameters.bcid.toLowerCase();
    parameters.backgroundcolor = parameters.backgroundcolor ? parameters.backgroundcolor : 'FFFFFF';
    parameters.padding = parameters.padding ? parameters.padding : 1;
    parameters.guardwhitespace = true;
    parameters.paddingwidth = parameters.paddingwidth != undefined ? parameters.paddingwidth : 1;
    parameters.paddingheight = parameters.paddingheight != undefined ? parameters.paddingheight : 1;

    bwipjs.toBuffer(parameters, async (error, img) => {
        if (error) {
            return res
                .status(500)
                .contentType('text/plain')
                .send(`BarcodeGenerator: ${error.message}`)
                ;
        } // if (error) ... 

        let r0;
        let contentType;

        // convert to desired image format if needed
        switch (format) {
            case "jpg":
                r0 = await toBuffer(toStream(img));
                contentType = "image/jpg";
                break;
            case "png":
            default:
                r0 = img;
                contentType = "image/png";
        } // switch ...

        // return base64 encoded if requested
        if (base64) {
            contentType = "text/plain"
        }

        res.status(200).contentType(contentType).send(base64 ? r0.toString("base64") : r0 );
    }); // bwipjs.toBuffer ...
}); // app.get("/", ...

const server = app.listen(process.env.EXPRESS_PORT || 3000, () => {
    console.log("barcode-generator is listening on port", server.address().port);
});
