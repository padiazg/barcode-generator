const { Duplex } = require("stream");
const PNGDecoder = require("png-stream/decoder");
const JPEGEncoder = require("jpg-stream/encoder");
const ColorTransform = require("color-transform");

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

// returns a Promise
const PNG2JPG = buffer => toBuffer(toStream(buffer)
    .pipe(new PNGDecoder)
    .pipe(new ColorTransform('gray'))
    .pipe(new JPEGEncoder({ quality: 80 }))
)

module.exports = {
    toStream,
    toBuffer,
    PNG2JPG,
}