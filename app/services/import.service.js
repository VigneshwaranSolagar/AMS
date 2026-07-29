const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const ExcelJS = require("exceljs");

const contactModel = require("../models/contact.model");



function normalizePhone(value) {

    if (!value) return "";


    let phone =
        String(value).trim();



    phone =
        phone.replace(/\.0$/, "");



    phone =
        phone.replace(/\D/g, "");



    if (
        phone.startsWith("91") &&
        phone.length === 12
    ) {

        return phone;

    }



    if (phone.length === 10) {

        return "91" + phone;

    }



    return phone;

}





function mapContact(row, mapping = {}) {


    return {


        first_name:
            row[mapping.first_name] ||
            "",



        last_name:
            row[mapping.last_name] ||
            "",



        phone:
            normalizePhone(
                row[mapping.phone]
            ),



        email:
            row[mapping.email] ||
            "",



        company:
            row[mapping.company] ||
            "",



        tags:
            row[mapping.tags] ||
            "",



        group_name:
            row[mapping.group_name] ||
            "",



        notes:
            row[mapping.notes] ||
            ""


    };


}






async function saveContacts(
    rows,
    mapping
) {


    let imported = 0;

    let duplicates = 0;

    let failed = 0;



    for (const row of rows) {


        try {


            const contact =
                mapContact(
                    row,
                    mapping
                );



            if (!contact.phone) {

                failed++;

                continue;

            }



            await contactModel.create(
                contact
            );



            imported++;


        }


        catch(err) {


            if (
                err.message.includes(
                    "UNIQUE constraint failed"
                )
            ) {


                duplicates++;


            }

            else {


                console.error(err);

                failed++;


            }


        }


    }



    return {


        totalRows: rows.length,

        imported,

        duplicates,

        failed


    };


}








async function readCSV(filePath) {


    return new Promise(
        (resolve,reject)=>{


            const rows=[];



            fs.createReadStream(filePath)

            .pipe(csv())

            .on(
                "data",
                row=>rows.push(row)
            )

            .on(
                "end",
                ()=>resolve(rows)
            )

            .on(
                "error",
                reject
            );


        }
    );


}







async function readExcel(filePath) {


    const workbook =
        new ExcelJS.Workbook();



    await workbook.xlsx.readFile(
        filePath
    );



    const worksheet =
        workbook.worksheets[0];



    const rows=[];

    const headers=[];



    worksheet.eachRow(
        (row,rowNumber)=>{


            if(rowNumber===1){


                row.eachCell(
                    (cell,col)=>{


                        headers[col]=
                            String(cell.value)
                            .trim();


                    }
                );


            }

            else{


                const data={};



                row.eachCell(
                    (cell,col)=>{


                        let value =
                            cell.value ?? "";



                        if(
                            typeof value === "number"
                        ){

                            value =
                                String(value);

                        }



                        data[
                            headers[col]
                        ] = value;


                    }
                );



                rows.push(data);


            }


        }
    );



    return rows;


}








async function importContacts(
    filePath,
    mapping = {}
) {


    const extension =
        path.extname(filePath)
        .toLowerCase();



    let contacts=[];



    if(extension === ".csv") {


        contacts =
            await readCSV(filePath);


    }


    else if(extension === ".xlsx") {


        contacts =
            await readExcel(filePath);


    }


    else {


        throw new Error(
            "Only .xlsx and .csv files are supported."
        );


    }



    return await saveContacts(
        contacts,
        mapping
    );


}







async function previewHeaders(filePath){


    const extension =
        path.extname(filePath)
        .toLowerCase();



    if(extension === ".csv"){


        return new Promise(
            (resolve,reject)=>{


                let headers=[];


                fs.createReadStream(filePath)

                .pipe(csv())

                .on(
                    "headers",
                    data=>headers=data
                )

                .on(
                    "end",
                    ()=>resolve(headers)
                )

                .on(
                    "error",
                    reject
                );


            }
        );


    }



    if(extension === ".xlsx"){


        const workbook =
            new ExcelJS.Workbook();



        await workbook.xlsx.readFile(
            filePath
        );



        const worksheet =
            workbook.worksheets[0];



        const headers=[];



        worksheet
        .getRow(1)
        .eachCell(
            (cell,col)=>{


                headers.push(
                    String(cell.value)
                    .trim()
                );


            }
        );



        return headers;


    }



    throw new Error(
        "Unsupported file"
    );


}






module.exports = {

    importContacts,

    previewHeaders

};