require("dotenv").config();

const keyGen =
    require("./licensing/keyGenerator");


const result =
    keyGen.generateActivationKey({

        customer:
            "VinSolve Demo",


        fingerprintVersion:
            1,


        machineFingerprint:
            "0858e0aa737df187504c677d995624af49ac33188077170144fee1bdf348fe93",


        plan:
            "TRIAL",


        days:
            30

    });



console.log("\nPAYLOAD\n");

console.log(
    result.payload
);



console.log("\nACTIVATION KEY\n");

console.log(
    result.activationKey
);