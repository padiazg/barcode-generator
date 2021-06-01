const { Duplex } = require("stream");

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

module.exports = {
    toStream,
    toBuffer,
}