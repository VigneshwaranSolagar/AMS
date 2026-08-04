/**
 * AMS
 * RSA Key Pair Generator
 * Run only once.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const keysDir = path.join(
    __dirname,
    "..",
    "licensing",
    "keys"
);

if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, {
        recursive: true
    });
}

const {
    publicKey,
    privateKey
} = crypto.generateKeyPairSync("rsa", {

    modulusLength: 4096,

    publicKeyEncoding: {
        type: "spki",
        format: "pem"
    },

    privateKeyEncoding: {
        type: "pkcs8",
        format: "pem"
    }

});

fs.writeFileSync(
    path.join(keysDir, "private.pem"),
    privateKey
);

fs.writeFileSync(
    path.join(keysDir, "public.pem"),
    publicKey
);

console.log("=================================");
console.log("AMS RSA Keys Generated");
console.log("=================================");
console.log("Private:", path.join(keysDir, "private.pem"));
console.log("Public :", path.join(keysDir, "public.pem"));
console.log();
console.log("IMPORTANT:");
console.log("- Keep private.pem SECRET.");
console.log("- Ship ONLY public.pem with AMS.");