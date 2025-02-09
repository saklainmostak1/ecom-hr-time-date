"use client";
const ExcelJS = require('exceljs');
import { useEffect, useState } from "react";
import React from 'react';

import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import toast from 'react-hot-toast';


const QuickProductEntry = () => {

    const [status, setStatus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const notifyS = (text) => toast.success(text);


    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/getStatus`)
            .then(res => res.json())
            .then(data => setStatus(data))
    }, [])
    const statusValueObj = status.map(status => status.status_name);
    const statusValue = statusValueObj.join(', ');


    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/getCategories`)
            .then(res => res.json())
            .then(data => setCategories(data))
    }, [])
    const categoryValueObj = categories.map(category => category.category_name);
    const categoryValue = categoryValueObj.join(', ');


    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/getSubCategories`)
            .then(res => res.json())
            .then(data => setSubCategories(data))
    }, [])
    const subCategoryValueObj = subCategories.map(sub_category => sub_category.sub_category_name);
    const subCategoryValue = subCategoryValueObj.join(', ');

    // export Excel form
    const exportExcelFile = () => {

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Excel Sheet 1");
        sheet.properties.defaultRowHeight = 15;
        sheet.properties.defaultColWidth = 15;
        sheet.pageSetup.horizontalCentered = true
        sheet.pageSetup.verticalCentered = true
        sheet.getRow(1).alignment = { horizontal: 'center' };
        // sheet.pageSetup.printArea = 'A1:G20';


        sheet.views = [
            { state: 'frozen', xSplit: 7, ySplit: 1 }
        ];



        for (let i = 0; i <= 6; i++) {
            let columnLetter = String.fromCharCode(i + 65) + "1";

            sheet.getCell(columnLetter).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '9bcbf0' },
            };
            sheet.getCell(columnLetter).border = {
                top: { style: "thin", color: { argb: "939090" } },
                left: { style: "thin", color: { argb: "939090" } },
                bottom: { style: "thin", color: { argb: "939090" } },
                right: { style: "thin", color: { argb: "939090" } },
            };

            sheet.getCell(columnLetter).font = {
                name: "Verdana",
                family: 4,
                size: 11,
                bold: true,
            };


        }

        // sheet.getCell('C1').protection = {
        //     locked: true,
        //     hidden: true,
        // };

        let column_header = [
            {
                header: "Category",
                key: "category",
                width: 20,
            },
            {
                header: "Sub Category",
                key: "sub_category",
                width: 20,
            }, {
                header: "Product Name",
                key: "product_name",
                width: 20,
            },
            {
                header: "Status",
                key: "status",
                width: 20,
            },
            {
                header: "Description",
                key: "description",
                width: 20,
            },
            {
                header: "Weight",
                key: "weight",
                width: 20,
            },
            {
                header: "Price",
                key: "price",
                width: 20,
                // style: {fill: {type: 'pattern', pattern: 'solid', bgColor: {argb: 'FF00FF00'}}},
            },

        ];
        sheet.columns = column_header;


        // Set the column format to text
        sheet.getColumn('A').numFmt = '@';
        sheet.getColumn('B').numFmt = '@';
        sheet.getColumn('C').numFmt = '@';
        sheet.getColumn('D').numFmt = '@';
        sheet.getColumn('E').numFmt = '@';
        sheet.getColumn('F').numFmt = '0';
        sheet.getColumn('G').numFmt = '0';



        const categoryList = `"${categoryValue}"`;
        sheet.dataValidations.add("A2:A9999", {
            type: 'list',
            allowBlank: true,
            formulae: [categoryList],
        });


        const subCategoryList = `"${subCategoryValue}"`;
        sheet.dataValidations.add("B2:B9999", {
            type: 'list',
            allowBlank: true,
            formulae: [subCategoryList],
        });


        const statusList = `"${statusValue}"`;
        sheet.dataValidations.add("D2:D9999", {
            type: 'list',
            allowBlank: true,
            showErrorMessage: true,
            formulae: [statusList],
        });


        workbook.xlsx.writeBuffer().then(function (data) {
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "Product Data Form.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });


    };

    // upload Excel form
    const [data, setData] = useState([]);
    const dataArray = [];
    const newArray = [];
    const rows = {};


    // reading excel file and storing value into data
    const handleFileUpload = (e) => {
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            setData(sheet);
        };
    }

    const keys = Object.keys(data).filter(key => !key.startsWith('!'));

    keys.forEach(key => {
        const col = key[0];
        const row = key.slice(1);
        const value = data[key].v;

        if (!rows[row]) {
            rows[row] = {};
        }
        rows[row][col] = value;
    });

    Object.values(rows).forEach(rowObject => {
        dataArray.push(rowObject);
    });


    const userId = localStorage.getItem('userId')
    let status_id = 0;

    for (let index = 1; index < dataArray.length; index++) {
        const element = dataArray[index];
        element.D == 'Active' ? status_id = 1 : element.D == 'Inactive' ? status_id = 2 : status_id = 3;

        const arrObj = {
            category_name: element.A,
            sub_category_name: element.B,
            product_name: element.C,
            status_id: status_id,
            description: element.E,
            weight: element.F,
            price: element.G,
            created_by: userId
        }
        newArray.push(arrObj);
    }

    const dataPost = () => {
        for (let index = 0; index < newArray.length; index++) {
            const updateValue = newArray[index];

            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/excelInsertProductData`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                }, body: JSON.stringify(updateValue)
            })
                .then(Response => Response.json())
                .then(data => {
                    if (data?.affectedRows) {
                        Swal.fire({
                            title: 'Success!',
                            text: 'admin page list edit Successful !!',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        })
                    }
                })
        }

    }



    return (
        <div className="mt-6 ml-5 mr-5 ">
            <button className="btn btn-info float-end mt-2 mb-5" onClick={exportExcelFile}>
                Product info form
            </button>


            <div>
                <div className=" mb-5">
                    <input type="file" className="light mr-2" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    <button className="btn btn-info" onClick={() => dataPost()}>Save Data</button>
                </div>


                {newArray.length > 0 && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Sub Category</th>
                                <th>Product Name</th>
                                <th>Status</th>
                                <th>Description</th>
                                <th>Weight</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newArray.map((value, index) => (
                                <tr key={index}>
                                    <td>{value.category_name}</td>
                                    <td>{value.sub_category_name}</td>
                                    <td>{value.product_name}</td>
                                    <td>{value.status_id}</td>
                                    <td>{value.description}</td>
                                    <td>{value.weight}</td>
                                    <td>{value.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>



        </div>
    );

};

export default QuickProductEntry;