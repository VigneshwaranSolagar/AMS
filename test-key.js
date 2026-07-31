require("dotenv").config();

const keyGen =
require("./licensing/keyGenerator");


const result =
keyGen.generateActivationKey({

    customer:
    "VinSolve Demo",

    machineFingerprint:
    "0cc912831cc9c086a253887f6a1c7828bc42a7738342aaa691c0ec0f308a0b8d",

    plan:
    "TRIAL",

    days:
    30

});


console.log("\nPAYLOAD\n");

console.log(result.payload);


console.log("\nACTIVATION KEY\n");

console.log(result.activationKey);