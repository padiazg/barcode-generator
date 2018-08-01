const bwipjs = require("bwip-js");
const fs = require("fs");

const options = {
    bcid: "qrcode", // Barcode type
    text: "123456789012", // Text to encode
    scale: 3, // 3x scaling factor
    guardwhitespace: true,
    includetext: true, // Show human-readable text
    // showborder: true,
    // bordercolor: 0xFFFFFF,
    // borderwidth: 2,
    paddingwidth: 1,
    paddingheight: 1,
    backgroundcolor: 0xFFFFFF,
    // textyoffset: -8,
}

bwipjs.toBuffer(options, (err, png) => {
        if (err) {
            // Decide how to handle the error
            // `err` may be a string or Error object
            console.log("error =>", err);
        } else {
            // `png` is a Buffer
            // png.length           : PNG file length
            // png.readUInt32BE(16) : PNG image width
            // png.readUInt32BE(20) : PNG image height
            fs.open('ean13.png', "w", (err, fd) => {
                if (err) {
                    throw "could not open file: " + err;
                }

                // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
                fs.write(fd, png, 0, png.length, null, (err) => {
                    if (err) throw "error writing file: " + err;
                    fs.close(fd, function() {
                        console.log("wrote the file successfully");
                    });
                });
            });
        }
    }
);
