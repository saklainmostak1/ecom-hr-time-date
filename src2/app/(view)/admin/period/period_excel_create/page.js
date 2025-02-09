'use client' 
 //ismile
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../../admin_layout/modal/fa.css'
import { FaDownload, FaTimes, FaUpload } from 'react-icons/fa';
import { parse, format } from 'date-fns';
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
const ExcelJS = require('exceljs');


const PeriodExcelCreate = () => {

    const created = localStorage.getItem('userId');

    const { data: periods = [], isLoading, refetch
    } = useQuery({
        queryKey: ['periods'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/period/period_all`)

            const data = await res.json()
            return data
        }
    })

    console.log(periods)

    const [numToAdd, setNumToAdd] = useState(1);
    const [fields, setFields] = useState([{ period_name: '', status_id: '', file_path: '', description: '', created_by: created }]);


    const [selectedFile, setSelectedFile] = useState(Array(fields.length).fill(null));


    const [fileNames, setFileNames] = useState([])

    const [rowError, setRowErrors] = useState([]);
    const [error, setError] = useState([]);
    const [file_size_error, set_file_size_error] = useState(null);
    const [filePathError, setFilePathError] = useState([])
    const [samePeriodName, setSamePeriodName] = useState([])

    const period_file_change = (index, e) => {

        e.preventDefault();
        let files = e.target.files[0];
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const fileName = files.name.split('.')[0]
        const extension = files.name.split('.').pop();
        const newName = `${fileName}(${index}).${extension}`;
        const time = `${year}/${month}/${day}/${hours}/${minutes}`;
        const _path = 'period/' + time + '/' + newName;
        console.log(files.name.split('.')[0])
        const newSelectedFiles = [...selectedFile];
        newSelectedFiles[index] = files;
        newSelectedFiles[index].path = _path;
        // setFileNames(newName)
        // setSelectedFile(newSelectedFiles);
        // upload(files, index);

        if (Number(files.size) <= 2097152) {
            console.log('checking the file size is okay');
            set_file_size_error[index] = ("");
            setError("")
            setFilePathError("")
            setFileNames(newName);
            setSelectedFile(newSelectedFiles);
            upload(files, index);
        } else {
            console.log('checking the file size is High');
            set_file_size_error[index] = ("Max file size 2 MB");
            newSelectedFiles[index] = null;
            setSelectedFile(newSelectedFiles);
            setFileNames(null);
        }
        const newFields = [...fields];
        newFields[index].file_path = _path;
        setFields(newFields);

    };

    console.log(fileNames)

    const upload = (file, index) => {
        const formData = new FormData();
        // Create a new name for the file
        const extension = file.name.split('.').pop();
        console.log(file.name.split('.')[0])
        const fileName = file.name.split('.')[0]

        // Get file extension
        const newName = `${fileName}(${index}).${extension}`;
        // Append the file with the new name
        formData.append('files', file, newName);
        console.log(file);
        setFileNames(newName)

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/period/period_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };


    const period_change = (index, event) => {
        const newFields = [...fields];
        if (event.target.type === 'file') {
            newFields[index][event.target.name] = event.target.files[0];
        } else {
            newFields[index][event.target.name] = event.target.value;
        }
        const brandName = newFields[index]['period_name'];
        if (brandName) {
            setRowErrors(""); // Clear the error message

        }
        const status = newFields[index]['status_id'];
        if (status) {
            setError(""); // Clear the error message
        }
        const matchingBrand = periods.find(item => item.period_name.toLowerCase() === brandName.toLowerCase());
        if (!matchingBrand) {
            setSamePeriodName('');
            // You can also set an error state to show the message in the UI instead of using alert
        }
        // else {
        //     setSamePeriodName("")
        // }
        const file_path = newFields[index]['file_path'];
        if (file_path === '') {
            // setFilePathError('This must be filled'); // Clear the error message
        }
        else {
            setFilePathError("")
        }
        setFields(newFields);
    };

    const period_add_more = () => {
        const numToAddInt = parseInt(numToAdd);
        if (!isNaN(numToAddInt) && numToAddInt > 0) {
            const newInputValues = [...fields];
            for (let i = 0; i < numToAddInt; i++) {
                newInputValues.push({
                    period_name: '',
                    status_id: '',
                    file_path: '',
                    description: '',
                    created_by: created
                });
            }
            setFields(newInputValues);
            setNumToAdd(1);
        }
    };

    const period_remove_field = (index) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };


    const router = useRouter()

    const period_create = (event) => {

        event.preventDefault();

        const newErrors = new Array(fields.length).fill('');
        const isValid = fields.every((inputValue, index) => {
            if (!inputValue.period_name) {
                newErrors[index] = 'period Name must be filled.';
                return false;
            }
            return true;
        });

        if (!isValid) {
            setRowErrors(newErrors);
            return;
        }
        setRowErrors(new Array(fields.length).fill(''));

        const newError = new Array(fields.length).fill('');
        const isValids = fields.every((inputValue, index) => {
            if (!inputValue.status_id) {
                newError[index] = 'This must be filled.';
                return false;
            }
            return true;
        });

        if (!isValids) {
            setError(newError);
            return;
        }
        setError(new Array(fields.length).fill(''));

        const normalizeperiodName = (name) => {
            return name?.trim().replace(/\s+/g, '');
        };

        if (fields.length === 1) {
            const newErrorSameperiodName = new Array(fields.length).fill('');
            const isValidsSameperiod = fields.every((inputValue, index) => {
                const isExistingperiod = periods.find(item => normalizeperiodName(item.period_name.toLowerCase()) === normalizeperiodName(inputValue.period_name.toLowerCase()));
                if (isExistingperiod) {
                    newErrorSameperiodName[index] = 'period name already exists!';
                    return false;
                }
                return true;
            });

            if (!isValidsSameperiod) {
                setSamePeriodName(newErrorSameperiodName);
                return;
            }
            setSamePeriodName(new Array(fields.length).fill(''));
        } else if (fields.length > 1) {
            const newErrorSameperiodName = new Array(fields.length).fill('');
            let errorMessageSet = false;

            fields.forEach((inputValue, index) => {
                const isExistingperiod = periods.find(item => normalizeperiodName(item.period_name.toLowerCase()) === normalizeperiodName(inputValue.period_name.toLowerCase()));
                if (isExistingperiod && !errorMessageSet) {
                    newErrorSameperiodName[index] = 'period name already exists!';
                    errorMessageSet = true;
                }
            });

            setSamePeriodName(newErrorSameperiodName);
        }

        const normalizedperiodNames = fields.map(inputValue => normalizeperiodName(inputValue.period_name.toLowerCase()));
        const uniqueperiodNames = Array.from(new Set(normalizedperiodNames));
        const uniqueFields = uniqueperiodNames.map(periodName => {
            const index = normalizedperiodNames.indexOf(periodName);
            return fields[index];
        });

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/period/period_create`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(uniqueFields),
        })
            .then((Response) =>
                Response.json()
            )
            .then((data) => {
                console.log(data)
                if (data[0]?.affectedRows > 0) {
                    sessionStorage.setItem("message", "Data saved successfully!");
                    router.push('/Admin/period/period_all');
                }
                console.log(data)

            })
            .catch((error) => console.error(error));
    }



    const page_group = localStorage.getItem('pageGroup')
    // const period_image_remove = (index) => {
    //     const confirmDelete = window.confirm('Are you sure you want to delete this?');
    //     if (confirmDelete) {
    //         const newSelectedFiles = [...selectedFile];
    //         newSelectedFiles[index] = null;
    //         setSelectedFile(newSelectedFiles);
    //     }
    // };


    const period_image_remove = (index) => {
        console.log(fields[index]?.file_path);
        const confirmDelete = window.confirm('Are you sure you want to delete this?');
        if (confirmDelete) {
            const newSelectedFiles = [...selectedFile];
            newSelectedFiles[index] = null;
            setSelectedFile(newSelectedFiles);
            const filePathToDelete = fields[index]?.file_path; // Accessing file_path with index
            if (filePathToDelete) {
                axios.delete(`${process.env.NEXT_PUBLIC_API_URL}:5003/${filePathToDelete}`)
                    .then(res => {
                        console.log(`File ${filePathToDelete} deleted successfully`);
                        setFields(prevData => {
                            const updatedFields = [...prevData]; // Copying previous data
                            updatedFields[index] = { ...updatedFields[index], file_path: '' }; // Updating file_path at index
                            return updatedFields;
                        });
                    })
                    .catch(err => {
                        console.error(`Error deleting file ${filePathToDelete}:`, err);
                    });
            }
        }
    };

    // const [status, setStatus] = useState([])
    // useEffect(() => {
    //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
    //         .then(res => res.json())
    //         .then(data => setStatus(data))
    // }, [])

    // console.log(status)




    // //----------------------------------------data upload process
    // let [counter, setCounter] = useState(true);
    // const [data, setData] = useState([]);
    // let excelData = [];

    // // uploading multiple file
    // const period_file_upload = (e) => {
    //     e.preventDefault();
    //     const files = e.target.files;
    //     Array.from(files).forEach((file) => {
    //         const reader = new FileReader();
    //         reader.readAsBinaryString(file);
    //         reader.onload = (event) => {
    //             const data = event.target.result;
    //             const workbook = XLSX.read(data, { type: "binary" });
    //             const sheetName = workbook.SheetNames[0];
    //             const sheet = workbook.Sheets[sheetName];
    //             setCounter(true);
    //             setData((prevData) => [...prevData, sheet]);
    //         };
    //     });
    // };




    // // extracted value organization
    // data.forEach((_data) => {
    //     const dataArray = [];
    //     const rows = {};

    //     const keys = Object.keys(_data).filter(key => !key.startsWith('!'));

    //     keys.forEach(key => {
    //         const col = key[0];
    //         const row = key.slice(1);
    //         const value = _data[key].v;

    //         if (!rows[row]) {
    //             rows[row] = {};
    //         } rows[row][col] = value;
    //     });

    //     Object.values(rows).forEach(rowObject => {
    //         dataArray.push(rowObject);
    //     });

    //     const userId = localStorage.getItem('userId');
    //     let _status_id = 0;

    //     for (let index = 1; index < dataArray.length; index++) {
    //         const element = dataArray[index];
    //         element.B == 'Active' ? _status_id = 1 : element.B == 'Inactive' ? _status_id = 2 : _status_id = 3;
    //         const arrObj = {
    //             brand_name: element.A,
    //             status_id: _status_id,
    //             file_path: '',
    //             description: element.C,
    //             userId: userId,
    //         }
    //         excelData.push(arrObj);
    //     }

    // });


    // if (excelData.length > 0 && counter == true) {
    //     setFields(excelData);
    //     setCounter(false);
    // }


    // // ---------------------------------------------------Export Excel form
    // //  const [status, setStatus] = useState([]);
    // //  const router = useRouter();

    // //  useEffect(() => {
    // //      fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
    // //          .then(res => res.json())
    // //          .then(data => setStatus(data))
    // //  }, [])

    // const statusValueObj = status.map(status => status.status_name);
    // const statusValue = statusValueObj.join(', ');



    // const period_excel_file_export = () => {

    //     const workbook = new ExcelJS.Workbook();
    //     const sheet = workbook.addWorksheet("Excel Sheet 1");
    //     sheet.properties.defaultRowHeight = 15;
    //     sheet.properties.defaultColWidth = 15;
    //     sheet.pageSetup.horizontalCentered = true
    //     sheet.pageSetup.verticalCentered = true
    //     sheet.getRow(1).alignment = { horizontal: 'center' };

    //     sheet.views = [
    //         { state: 'frozen', xSplit: 3, ySplit: 1 }
    //     ];

    //     for (let i = 0; i <= 2; i++) {
    //         let columnLetter = String.fromCharCode(i + 65) + "1";

    //         sheet.getCell(columnLetter).fill = {
    //             type: 'pattern',
    //             pattern: 'solid',
    //             fgColor: { argb: '9bcbf0' },
    //         };
    //         sheet.getCell(columnLetter).border = {
    //             top: { style: "thin", color: { argb: "939090" } },
    //             left: { style: "thin", color: { argb: "939090" } },
    //             bottom: { style: "thin", color: { argb: "939090" } },
    //             right: { style: "thin", color: { argb: "939090" } },
    //         };

    //         sheet.getCell(columnLetter).font = {
    //             name: "Verdana",
    //             family: 4,
    //             size: 11,
    //             bold: true,
    //         };

    //     }


    //     sheet.columns = [
    //         {
    //             header: "Period Name",
    //             key: "period_name",
    //             width: 20,
    //         },
    //         {
    //             header: "Status",
    //             key: "status",
    //             width: 15,
    //         },
    //         {
    //             header: "Description",
    //             key: "description",
    //             width: 25,
    //         },

    //     ];



    //     // Set the column format to text
    //     sheet.getColumn('A').numFmt = '@';
    //     sheet.getColumn('B').numFmt = '@';
    //     sheet.getColumn('C').numFmt = '@';


    //     //dropdown of status value
    //     const statusDropdownList = `"${statusValue}"`;
    //     sheet.dataValidations.add("B2:B9999", {
    //         type: 'list',
    //         allowBlank: false,
    //         showErrorMessage: true,
    //         formulae: [statusDropdownList],
    //     });


    //     // download of excel sheet
    //     workbook.xlsx.writeBuffer().then(function (data) {
    //         const blob = new Blob([data], {
    //             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //         });
    //         const url = window.URL.createObjectURL(blob);
    //         const anchor = document.createElement("a");
    //         anchor.href = url;
    //         anchor.download = "Period Excel Form.xlsx";
    //         anchor.click();
    //         window.URL.revokeObjectURL(url);
    //     });


    // };


    // const [data, setData] = useState([]);
    // const [counter, setCounter] = useState(true);
    // const [status, setStatus] = useState([]);
    // const [excelData, setExcelData] = useState([]);

    // useEffect(() => {
    //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
    //         .then(res => res.json())
    //         .then(data => setStatus(data));
    // }, []);

    // const period_file_upload = (e) => {
    //     e.preventDefault();
    //     const files = e.target.files;
    //     Array.from(files).forEach((file) => {
    //         const reader = new FileReader();
    //         reader.readAsBinaryString(file);
    //         reader.onload = (event) => {
    //             const data = event.target.result;
    //             const workbook = XLSX.read(data, { type: "binary" });
    //             const sheetName = workbook.SheetNames[0];
    //             const sheet = workbook.Sheets[sheetName];
    //             setData((prevData) => [...prevData, sheet]);
    //         };
    //     });
    // };

    // useEffect(() => {
    //     if (data.length > 0) {
    //         const processedData = [];
    //         data.forEach((sheet) => {
    //             const dataArray = [];
    //             const rows = {};

    //             const keys = Object.keys(sheet).filter(key => !key.startsWith('!'));

    //             keys.forEach(key => {
    //                 const col = key[0];
    //                 const row = key.slice(1);
    //                 const value = sheet[key].v;

    //                 if (!rows[row]) {
    //                     rows[row] = {};
    //                 }
    //                 rows[row][col] = value;
    //             });

    //             Object.values(rows).forEach(rowObject => {
    //                 dataArray.push(rowObject);
    //             });

    //             const userId = localStorage.getItem('userId');
    //             let _status_id = 0;

    //             for (let index = 1; index < dataArray.length; index++) {
    //                 const element = dataArray[index];
    //                 _status_id = element.B === 'Active' ? 1 : element.B === 'Inactive' ? 2 : 3;
    //                 const arrObj = {
    //                     brand_name: element.A,
    //                     status_id: _status_id,
    //                     file_path: '',
    //                     description: element.C,
    //                     userId: userId,
    //                     created_by: created // Replace 'created' with appropriate variable if needed
    //                 };
    //                 processedData.push(arrObj);
    //             }
    //         });

    //         setExcelData(processedData);
    //         if (counter) {
    //             setFields(processedData); // Assuming setFields is defined somewhere in your code
    //             setCounter(false);
    //         }
    //     }
    // }, [data, counter ]);

    // const statusValueObj = status.map(status => status.status_name);
    // const statusValue = statusValueObj.join(', ');
    // const period_excel_file_export = () => {
    //     const workbook = new ExcelJS.Workbook();
    //     const sheet = workbook.addWorksheet("Excel Sheet 1");

    //     // Set sheet properties
    //     sheet.properties.defaultRowHeight = 15;
    //     sheet.properties.defaultColWidth = 15;
    //     sheet.pageSetup.horizontalCentered = true;
    //     sheet.pageSetup.verticalCentered = true;
    //     sheet.getRow(1).alignment = { horizontal: 'center' };

    //     // Freeze the first row and first three columns
    //     sheet.views = [{ state: 'frozen', xSplit: 3, ySplit: 1 }];

    //     // Define column headers
    //     const headers = [
    //         { header: "Period Name*", key: "period_name", width: 25 },
    //         { header: "Status*", key: "status", width: 25 },
    //         { header: "Description(Optional)", key: "description", width: 25 }
    //     ];

    //     // Set columns with headers
    //     sheet.columns = headers.map(col => ({
    //         header: col.header,
    //         key: col.key,
    //         width: col.width
    //     }));

    //     // Apply styles to header cells
    //     headers.forEach((col, index) => {
    //         const cell = sheet.getCell(1, index + 1);
    //         cell.fill = {
    //             type: 'pattern',
    //             pattern: 'solid',
    //             fgColor: { argb: '9bcbf0' },
    //         };
    //         cell.border = {
    //             top: { style: "thin", color: { argb: "939090" } },
    //             left: { style: "thin", color: { argb: "939090" } },
    //             bottom: { style: "thin", color: { argb: "939090" } },
    //             right: { style: "thin", color: { argb: "939090" } },
    //         };
    //         cell.font = {
    //             name: "Verdana",
    //             family: 4,
    //             size: 11,
    //             bold: true,
    //         };

    //         // Add red asterisk if needed
    //         if (col.header.includes('*')) {
    //             const richText = [
    //                 { text: col.header.replace('*', ''), font: { color: { argb: '000000' }, bold: true } },
    //                 { text: '*', font: { color: { argb: 'FF0000' }, bold: true } },
    //             ];
    //             cell.value = { richText };
    //             cell.note = "(*) field required";

    //         } else if(col.header.includes('(Optional)')){
    //             const richText = [
    //                 { text: col.header.replace('(Optional)', ''), font: { color: { argb: '000000' }, bold: true } },
    //                 // { text: '(Optional)', font: { color: { argb: '000000' }, bold: true } },
    //             ];
    //             cell.value = { richText };
    //             cell.note = "This is Optional";
    //         }
    //     });

    //     // Set column format to text
    //     ['A', 'B', 'C'].forEach(col => {
    //         sheet.getColumn(col).numFmt = '@';
    //     });

    //     // Dropdown of status value (assuming statusValue is a comma-separated string of options)
    //     // const statusValue = {statusValue};  // Replace with your actual status values
    //     const statusDropdownList = `"${statusValue}"`;
    //     sheet.dataValidations.add("B2:B9999", {
    //         type: 'list',
    //         allowBlank: false,
    //         showErrorMessage: true,
    //         formulae: [statusDropdownList],
    //     });

    //     // Download Excel sheet
    //     workbook.xlsx.writeBuffer().then((data) => {
    //         const blob = new Blob([data], {
    //             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //         });
    //         const url = window.URL.createObjectURL(blob);
    //         const anchor = document.createElement("a");
    //         anchor.href = url;
    //         anchor.download = "Period Excel Form.xlsx";
    //         anchor.click();
    //         window.URL.revokeObjectURL(url);
    //     });
    // };

// const period_file_upload = (e) => {
    //     e.preventDefault();
    //     const files = e.target.files;
    //     Array.from(files).forEach((file) => {
    //         if (file.size > 2 * 1024 * 1024) { // 2 MB in bytes
    //             setFileSizeExcel("File size should be less than 2 MB.");
    //             return;
    //         } else {
    //             setFileSizeExcel('');
    //         }
    
    //         const reader = new FileReader();
    //         reader.readAsBinaryString(file);
    //         reader.onload = (event) => {
    //             const data = event.target.result;
    //             const workbook = XLSX.read(data, { type: "binary" });
    //             const sheetName = workbook.SheetNames[0];
    //             const sheet = workbook.Sheets[sheetName];
    //             setCounter(true);
    
    //             // Get the range of the sheet
    //             const range = XLSX.utils.decode_range(sheet['!ref']);
    
    //             // Extracting dates from the Excel sheet and converting to the desired format
    //             const dates = [];
    //             for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    //                 const cell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: 0 })]; // Assuming dates are in the first column
    //                 if (cell && cell.v) {
    //                     const parsedDate = parse(cell.v, 'dd-MM-yyyy', new Date()); // Parsing the date using date-fns
                        
    //                     if (!isNaN(parsedDate.getTime())) {
    //                         const formattedDate = format(parsedDate, 'dd-MM-yyyy'); // Formatting the date as dd-mm-yyyy
    //                         dates.push(formattedDate);
    //                         console.log(formattedDate)
    //                     } else {
    //                         dates.push("Invalid date");
    //                     }
    //                 } else {
    //                     dates.push("Invalid date");
    //                 }
    //             }
    
    //             console.log("Dates:", dates[1]);
    //             const filteredDate = dates.slice(1); 
    //             console.log(filteredDate)
    //             // Update currentDates state with formatted dates
    //             setCurrentDates(filteredDate);
              

    //             const formattedDates = filteredDate.map(dateString => {
    //                 const parts = dateString.split('-');
    //                 const formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    //                 return formattedDate;
    //             });
                
    //             console.log(formattedDates); // Output: ['2024-12-04', '2022-01-04']
                
    //             // Update period names in fields state with formatted dates
    //             setFields(formattedDates.map((date, index) => ({
                    
    //                 period_name: date,
    //                 status_id: '',
    //                 file_path: '',
    //                 description: '',
    //                 created_by: created
    //             })));
    
    //             setData((prevData) => [...prevData, sheet]);
    //         };
    //     });
    // };

    // extracted value organization

    const [data, setData] = useState([]);
    let [counter, setCounter] = useState(true);
    let excelData = [];

  
    
    const [fileSizeExcel, setFileSizeExcel] = useState([])


    // const period_file_upload = (e) => {
    //     e.preventDefault();
    //     const files = e.target.files;
    //     Array.from(files).forEach((file) => {
    //         if (file.size > 2 * 1024 * 1024) { // 2 MB in bytes
    //             setFileSizeExcel("File size should be less than 2 MB.");
    //             return;
    //         } else {
    //             setFileSizeExcel('');
    //         }
    
    //         const reader = new FileReader();
    //         reader.readAsBinaryString(file);
    //         reader.onload = (event) => {
    //             const data = event.target.result;
    //             const workbook = XLSX.read(data, { type: "binary" });
    //             const sheetName = workbook.SheetNames[0];
    //             const sheet = workbook.Sheets[sheetName];
    //             setCounter(true);
    
    //             // Get the range of the sheet
    //             const range = XLSX.utils.decode_range(sheet['!ref']);
    
    //             // Extracting dates from the Excel sheet and converting to the desired format
    //             const dates = [];
    //             for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    //                 const cell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: 0 })]; // Assuming dates are in the first column
    //                 if (cell && cell.v) {
    //                     let parsedDate = null;
    //                     // const dateFormats = ['dd-MM-yyyy', 'dd/MM/yyyy', 'yyyy-MM-dd']; // Add more date formats as needed
    //                     const dateFormats = [
    //                         'dd-mm-yyyy',      // Day-Month-Year (e.g., 06-06-2024)
    //                         'dd/mm/yyyy',      // Day/Month/Year (e.g., 06/06/2024)
    //                         'yyyy-mm-dd',      // Year-Month-Day (e.g., 2024-06-06)
    //                         'mm/dd/yyyy',      // Month/Day/Year (e.g., 06/06/2024)
    //                         'dd/mm/yyyy',      // Day/Month/Year (e.g., 06/06/2024)
    //                         'yyyy/mm/dd',      // Year/Month/Day (e.g., 2024/06/06)
    //                         'month dd, yyyy',  // Month Day, Year (e.g., June 06, 2024)
    //                         'dd month yyyy',   // Day Month Year (e.g., 06 June 2024)
    //                         'month dd yyyy',   // Month Day Year (e.g., June 06 2024)
    //                         'yyyy-mm-dd',      // Year-Month-Day (e.g., 2024-06-06)
    //                         'mm-dd-yyyy',      // Month-Day-Year (e.g., 06-06-2024)
    //                         'dd-mm-yyyy',      // Day-Month-Year (e.g., 06-06-2024)
    //                         'yyyy.mm.dd',      // Year.Month.Day (e.g., 2024.06.06)
    //                         'day, month dd, yyyy', // Day, Month Day, Year (e.g., Sunday, June 06, 2024)
    //                         'dd/mm/yy',        // Day/Month/Year (e.g., 06/06/24)
    //                         'mm/dd/yy',        // Month/Day/Year (e.g., 06/06/24)
    //                         'yy/mm/dd',        // Year/Month/Day (e.g., 24/06/06)
    //                         'month yyyy',      // Month Year (e.g., June 2024)
    //                         'month, yyyy',     // Month, Year (e.g., June, 2024)
    //                         'yyyy-mm',         // Year-Month (e.g., 2024-06)
    //                         'mm-yyyy',         // Month-Year (e.g., 06-2024)
    //                         'yyyymmdd'         // YearMonthDay (e.g., 20240606)
    //                     ];
                        
    //                     for (let i = 0; i < dateFormats.length; i++) {
    //                         parsedDate = parse(cell.v, dateFormats[i], new Date());
    //                         if (!isNaN(parsedDate.getTime())) {
    //                             break; // If parsing succeeds, break the loop
    //                         }
    //                     }
    //                     if (!isNaN(parsedDate.getTime())) {
    //                         const formattedDate = format(parsedDate, 'dd-MM-yyyy'); // Formatting the date as dd-mm-yyyy
    //                         dates.push(formattedDate);
    //                         console.log(formattedDate);
    //                     } else {
    //                         dates.push("Invalid date");
    //                     }
    //                 } else {
    //                     dates.push("Invalid date");
    //                 }
    //             }
    
    //             console.log("Dates:", dates);
    //             const filteredDate = dates.slice(1);
    //             console.log(filteredDate);
    //             // Update currentDates state with formatted dates
    //             setCurrentDates(filteredDate);
    
    //             const formattedDates = filteredDate.map(dateString => {
    //                 const parts = dateString.split('-');
    //                 if (parts.length === 3) {
    //                     const formattedDate = `${parts[2].padStart(4, '0')}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    //                     return formattedDate;
    //                 } else {
    //                     return "Invalid date";
    //                 }
    //             });
    
    //             console.log(formattedDates); // Output: ['2024-12-04', '2022-01-04']
    
    //             // Update period names in fields state with formatted dates
    //             setFields(formattedDates.map((date, index) => ({
    //                 period_name: date,
    //                 status_id: '',
    //                 file_path: '',
    //                 description: '',
    //                 created_by: created
    //             })));
    
    //             setData((prevData) => [...prevData, sheet]);
    //         };
    //     });
    // };
    

    
    const period_file_upload = (e) => {
        e.preventDefault();
        const files = e.target.files;
        Array.from(files).forEach((file) => {
            if (file.size > 2 * 1024 * 1024) { // 2 MB in bytes
                setFileSizeExcel("File size should be less than 2 MB.");
                return;
            } else {
                setFileSizeExcel('');
            }
    
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (event) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                setCounter(true);
    
                // Get the range of the sheet
                const range = XLSX.utils.decode_range(sheet['!ref']);
    
                // Extracting dates from the Excel sheet and converting to the desired format
                const dates = [];
                for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
                    const cell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: 0 })]; // Assuming dates are in the first column
                    if (cell && cell.v) {
                        let parsedDate = null;
                        const dateFormats = [
                            'dd-MM-yyyy',     // Day-Month-Year (e.g., 06-06-2024)
                            'dd/MM/yyyy',     // Day/Month/Year (e.g., 06/06/2024)
                            'yyyy-MM-dd',     // Year-Month-Day (e.g., 2024-06-06)
                            'MM/dd/yyyy',     // Month/Day/Year (e.g., 06/06/2024)
                            'yyyy/MM/dd',     // Year/Month/Day (e.g., 2024/06/06)
                            'MMMM dd, yyyy',  // Month Day, Year (e.g., June 06, 2024)
                            'dd MMMM yyyy',   // Day Month Year (e.g., 06 June 2024)
                            'MMMM dd yyyy',   // Month Day Year (e.g., June 06 2024)
                            'yyyy.MM.dd',     // Year.Month.Day (e.g., 2024.06.06)
                            'EEEE, MMMM dd, yyyy', // Day, Month Day, Year (e.g., Sunday, June 06, 2024)
                            'dd/MM/yy',       // Day/Month/Year (e.g., 06/06/24)
                            'MM/dd/yy',       // Month/Day/Year (e.g., 06/06/24)
                            'yy/MM/dd',       // Year/Month/Day (e.g., 24/06/06)
                            'MMMM yyyy',      // Month Year (e.g., June 2024)
                            'MMMM, yyyy',     // Month, Year (e.g., June, 2024)
                            'yyyy-MM',        // Year-Month (e.g., 2024-06)
                            'MM-yyyy',        // Month-Year (e.g., 06-2024)
                            'yyyyMMdd'        // YearMonthDay (e.g., 20240606)
                        ];
                        
                        for (let i = 0; i < dateFormats.length; i++) {
                            parsedDate = parse(cell.v, dateFormats[i], new Date());
                            if (!isNaN(parsedDate.getTime())) {
                                break; // If parsing succeeds, break the loop
                            }
                        }
                        if (!isNaN(parsedDate.getTime())) {
                            const formattedDate = format(parsedDate, 'dd-MM-yyyy'); // Formatting the date as dd-MM-yyyy
                            dates.push(formattedDate);
                            console.log(formattedDate);
                        } else {
                            dates.push("Invalid date");
                        }
                    } else {
                        dates.push("Invalid date");
                    }
                }
    
                console.log("Dates:", dates);
                const filteredDate = dates.slice(1);
                console.log(filteredDate);
                // Update currentDates state with formatted dates
                setCurrentDates(filteredDate);
    
                const formattedDates = filteredDate.map(dateString => {
                    const parts = dateString.split('-');
                    if (parts.length === 3) {
                        const formattedDate = `${parts[2].padStart(4, '0')}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                        return formattedDate;
                    } else {
                        return "Invalid date";
                    }
                });
    
                console.log(formattedDates); // Output: ['2024-12-04', '2022-01-04']
    
                // Update period names in fields state with formatted dates
                setFields(formattedDates.map((date, index) => ({
                    period_name: date,
                    status_id: '',
                    file_path: '',
                    description: '',
                    created_by: created
                })));
    
                setData((prevData) => [...prevData, sheet]);
            };
        });
    };
    
 
    
    

    // data.forEach((_data) => {
    //     const dataArray = [];
    //     const rows = {};
    
    //     const keys = Object.keys(_data).filter(key => !key.startsWith('!'));
    
    //     keys.forEach(key => {
    //         const col = key[0];
    //         const row = key.slice(1);
    //         const value = _data[key].v;
    
    //         if (!rows[row]) {
    //             rows[row] = {};
    //         }
    //         rows[row][col] = value;
    //     });
    
    //     Object.values(rows).forEach(rowObject => {
    //         dataArray.push(rowObject);
    //     });
    
    //     const userId = localStorage.getItem('userId');
    //     let _status_id = 0;
    
    //     for (let index = 1; index < dataArray.length; index++) {
    //         const element = dataArray[index];
    //         console.log(element.A);
    
    //         // Convert date format from "dd-mm-yyyy" to "yyyy-mm-dd"
    //         // const parts = element.A.split('-');
    //         // const formattedDate = `${parts[2]}-${parts[1]?.padStart(2, '0')}-${parts[0]?.padStart(2, '0')}`;
    //     //     let formattedDate;
    //     // if (element.A.includes('/')) {
    //     //     const parts = element.A.split('/');
    //     //     formattedDate = `${parts[2]}-${parts[1]?.padStart(2, '0')}-${parts[0]?.padStart(2, '0')}`;
    //     // } else {
    //     //     const parts = element.A.split('-');
    //     //     formattedDate = `${parts[2]}-${parts[1]?.padStart(2, '0')}-${parts[0]?.padStart(2, '0')}`;
    //     // }

    //     // let formattedDate;
    //     // if (element.A.includes('/')) {
    //     //     const parts = element.A.split('/');
    //     //     formattedDate = `${parts[2]}-${parts[1]?.padStart(2, '0')}-${parts[0]?.padStart(2, '0')}`;
    //     // } else if (element.A.includes('-')) {
    //     //     const parts = element.A.split('-');
    //     //     formattedDate = `${parts[2]}-${parts[1]?.padStart(2, '0')}-${parts[0]?.padStart(2, '0')}`;
    //     // } else if (element.A.includes('.')) {
    //     //     const parts = element.A.split('.');
    //     //     formattedDate = `${parts[0]}-${parts[1]?.padStart(2, '0')}-${parts[2]?.padStart(2, '0')}`;
    //     // }
    //     let formattedDate;

    //     if (element.A.includes('/')) {
    //         const parts = element.A.split('/');
    //         formattedDate = `${parts[2]}-${parts[1]?.padStart(2, '0')}-${parts[0]?.padStart(2, '0')}`;
    //     } else if (element.A.includes('-')) {
    //         const parts = element.A.split('-');
    //         // If it's already in the yyyy-mm-dd format, no need to change it
    //         if (parts[0].length === 4) {
    //             formattedDate = element.A;
    //         } else {
    //             formattedDate = `${parts[2]}-${parts[1]?.padStart(2, '0')}-${parts[0]?.padStart(2, '0')}`;
    //         }
    //     } else if (element.A.includes('.')) {
    //         const parts = element.A.split('.');
    //         formattedDate = `${parts[0]}-${parts[1]?.padStart(2, '0')}-${parts[2]?.padStart(2, '0')}`;
    //     }
    //         _status_id = element.B === 'Active' ? 1 : element.B === 'Inactive' ? 2 : element.B === 'Pending' ? 3 : '';
    
    //         const arrObj = {
    //             period_name: formattedDate, // Use the formatted date here
    //             status_id: _status_id,
    //             file_path: '',
    //             description: element.C,
    //             userId: userId,
    //             created_by: created
    //         };
    //         excelData.push(arrObj);
    //     }
    // });
    
   // Helper function to format date parts with leading zeros
function pad(number) {
    return number < 10 ? '0' + number : number;
}

data.forEach((_data) => {
    const dataArray = [];
    const rows = {};

    const keys = Object.keys(_data).filter(key => !key.startsWith('!'));

    keys.forEach(key => {
        const col = key[0];
        const row = key.slice(1);
        const value = _data[key].v;

        if (!rows[row]) {
            rows[row] = {};
        }
        rows[row][col] = value;
    });

    Object.values(rows).forEach(rowObject => {
        dataArray.push(rowObject);
    });

    const userId = localStorage.getItem('userId');
    let _status_id = 0;

    for (let index = 1; index < dataArray.length; index++) {
        const element = dataArray[index];
        console.log(element.A);

        let formattedDate;
        const dateStr = element.A;

        // Determine date format and parse accordingly
        // if (dateStr.includes('/')) {
        //     const parts = dateStr.split('/');
        //     if (parts[2].length === 4) { // dd/MM/yyyy or MM/dd/yyyy
        //         if (parseInt(parts[0]) > 12) { // dd/MM/yyyy
        //             formattedDate = `${parts[2]}-${pad(parts[1])}-${pad(parts[0])}`;
        //         } else { // MM/dd/yyyy
        //             formattedDate = `${parts[2]}-${pad(parts[0])}-${pad(parts[1])}`;
        //         }
        //     } else if (parts[2].length === 2) { // yy/MM/dd or dd/MM/yy or MM/dd/yy
        //         if (parseInt(parts[0]) > 12) { // dd/MM/yy
        //             formattedDate = `20${parts[2]}-${pad(parts[1])}-${pad(parts[0])}`;
        //         } else { // MM/dd/yy or yy/MM/dd
        //             if (parseInt(parts[0]) > 31) { // yy/MM/dd
        //                 formattedDate = `20${parts[0]}-${pad(parts[1])}-${pad(parts[2])}`;
        //             } else { // MM/dd/yy
        //                 formattedDate = `20${parts[2]}-${pad(parts[0])}-${pad(parts[1])}`;
        //             }
        //         }
        //     } else { // yyyy/MM/dd
        //         formattedDate = `${parts[0]}-${pad(parts[1])}-${pad(parts[2])}`;
        //     }
        // } else if (dateStr.includes('-')) {
        //     const parts = dateStr.split('-');
        //     if (parts[0].length === 4) { // yyyy-MM-dd or yyyy-MM
        //         if (parts.length === 3) {
        //             formattedDate = dateStr;
        //         } else if (parts.length === 2) {
        //             formattedDate = `${parts[0]}-${pad(parts[1])}-01`;
        //         }
        //     } else { // dd-MM-yyyy
        //         formattedDate = `${parts[2]}-${pad(parts[1])}-${pad(parts[0])}`;
        //     }
        // } else if (dateStr.includes('.')) {
        //     const parts = dateStr.split('.');
        //     formattedDate = `${parts[0]}-${pad(parts[1])}-${pad(parts[2])}`;
        // } else if (dateStr.includes(',')) { // MMMM dd, yyyy or EEEE, MMMM dd, yyyy or MMMM, yyyy
        //     const parts = dateStr.split(' ');
        //     if (parts.length === 4) { // EEEE, MMMM dd, yyyy
        //         formattedDate = new Date(dateStr).toISOString().slice(0, 10);
        //     } else if (parts.length === 3) { // MMMM dd, yyyy
        //         formattedDate = new Date(`${parts[1]} ${parts[0]} ${parts[2]}`).toISOString().slice(0, 10);
        //     } else { // MMMM, yyyy
        //         const monthYear = dateStr.split(', ');
        //         formattedDate = new Date(`${monthYear[0]} 01, ${monthYear[1]}`).toISOString().slice(0, 10);
        //     }
        // } else if (dateStr.length === 8) { // yyyyMMdd
        //     formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
        // }
        // if (dateStr.includes('/')) {
        //     const parts = dateStr.split('/');
        //     if (parts[2].length === 4) { // dd/MM/yyyy or MM/dd/yyyy
        //         if (parseInt(parts[0]) > 12) { // dd/MM/yyyy
        //             formattedDate = `${parts[2]}-${pad(parts[1])}-${pad(parts[0])}`;
        //         } else { // MM/dd/yyyy
        //             formattedDate = `${parts[2]}-${pad(parts[0])}-${pad(parts[1])}`;
        //         }
        //     } else if (parts[2].length === 2) { // yy/MM/dd or dd/MM/yy or MM/dd/yy
        //         if (parseInt(parts[0]) > 12) { // dd/MM/yy
        //             formattedDate = `20${parts[2]}-${pad(parts[1])}-${pad(parts[0])}`;
        //         } else { // MM/dd/yy or yy/MM/dd
        //             if (parseInt(parts[0]) > 31) { // yy/MM/dd
        //                 formattedDate = `20${parts[0]}-${pad(parts[1])}-${pad(parts[2])}`;
        //             } else { // MM/dd/yy
        //                 formattedDate = `20${parts[2]}-${pad(parts[0])}-${pad(parts[1])}`;
        //             }
        //         }
        //     } else { // yyyy/MM/dd
        //         formattedDate = `${parts[0]}-${pad(parts[1])}-${pad(parts[2])}`;
        //     }
        // } else if (dateStr.includes('-')) {
        //     const parts = dateStr.split('-');
        //     if (parts[0].length === 4) { // yyyy-MM-dd or yyyy-MM
        //         if (parts.length === 3) {
        //             formattedDate = dateStr;
        //         } else if (parts.length === 2) {
        //             formattedDate = `${parts[0]}-${pad(parts[1])}-01`;
        //         }
        //     } else if (parts.length === 2 && parts[1].length === 4) { // MM-yyyy
        //         formattedDate = `${parts[1]}-${pad(parts[0])}-01`;
        //     } else { // dd-MM-yyyy
        //         formattedDate = `${parts[2]}-${pad(parts[1])}-${pad(parts[0])}`;
        //     }
        // } else if (dateStr.includes('.')) {
        //     const parts = dateStr.split('.');
        //     formattedDate = `${parts[0]}-${pad(parts[1])}-${pad(parts[2])}`;
        // } else if (dateStr.includes(',')) { // MMMM dd, yyyy or EEEE, MMMM dd, yyyy or MMMM, yyyy
        //     const parts = dateStr.split(' ');
        //     if (parts.length === 4) { // EEEE, MMMM dd, yyyy
        //         formattedDate = new Date(dateStr).toISOString().slice(0, 10);
        //     } else if (parts.length === 3) { // MMMM dd, yyyy
        //         formattedDate = new Date(`${parts[1]} ${parts[0]} ${parts[2]}`).toISOString().slice(0, 10);
        //     } else { // MMMM, yyyy
        //         const monthYear = dateStr.split(', ');
        //         formattedDate = new Date(`${monthYear[0]} 01, ${monthYear[1]}`).toISOString().slice(0, 10);
        //     }
        // } else if (dateStr.length === 8) { // yyyyMMdd
        //     formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
        // }



        // if (dateStr.includes('/')) {
        //     const parts = dateStr.split('/');
        //     if (parts[2].length === 4) { // dd/MM/yyyy or MM/dd/yyyy
        //         if (parseInt(parts[0]) > 12) { // dd/MM/yyyy
        //             formattedDate = `${parts[2]}-${pad(parts[1])}-${pad(parts[0])}`;
        //         } else { // MM/dd/yyyy
        //             formattedDate = `${parts[2]}-${pad(parts[0])}-${pad(parts[1])}`;
        //         }
        //     } else if (parts[2].length === 2) { // yy/MM/dd or dd/MM/yy or MM/dd/yy
        //         if (parseInt(parts[0]) > 12) { // dd/MM/yy
        //             formattedDate = `20${parts[2]}-${pad(parts[1])}-${pad(parts[0])}`;
        //         } else { // MM/dd/yy or yy/MM/dd
        //             if (parseInt(parts[0]) > 31) { // yy/MM/dd
        //                 formattedDate = `20${parts[0]}-${pad(parts[1])}-${pad(parts[2])}`;
        //             } else { // MM/dd/yy
        //                 formattedDate = `20${parts[2]}-${pad(parts[0])}-${pad(parts[1])}`;
        //             }
        //         }
        //     } else { // yyyy/MM/dd
        //         formattedDate = `${parts[0]}-${pad(parts[1])}-${pad(parts[2])}`;
        //     }
        // } else if (dateStr.includes('-')) {
        //     const parts = dateStr.split('-');
        //     if (parts[0].length === 4) { // yyyy-MM-dd or yyyy-MM
        //         if (parts.length === 3) {
        //             formattedDate = dateStr;
        //         } else if (parts.length === 2) {
        //             formattedDate = `${parts[0]}-${pad(parts[1])}-01`;
        //         }
        //     } else if (parts.length === 2 && parts[1].length === 4) { // MM-yyyy
        //         formattedDate = `${parts[1]}-${pad(parts[0])}-01`;
        //     } else { // dd-MM-yyyy
        //         formattedDate = `${parts[2]}-${pad(parts[1])}-${pad(parts[0])}`;
        //     }
        // } else if (dateStr.includes(',')) { // MMMM, yyyy
        //     const [month, year] = dateStr.split(', ');
        //     formattedDate = new Date(`${month} 01, ${year}`).toISOString().slice(0, 10);
        // } else if (dateStr.includes('.')) {
        //     const parts = dateStr.split('.');
        //     formattedDate = `${parts[0]}-${pad(parts[1])}-${pad(parts[2])}`;
        // } else if (dateStr.length === 8) { // yyyyMMdd
        //     formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
        // }else { // Month Year (e.g., "May 2024")
        //     const [month, year] = dateStr.split(' ');
        //     const monthNum = new Date(Date.parse(`${month} 1, 2000`)).getMonth() + 1; // Get month number
        //     formattedDate = `${year}-${pad(monthNum)}-01`;
        // }
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts[2].length === 4) { // dd/MM/yyyy or MM/dd/yyyy
                if (parseInt(parts[0]) > 12) { // dd/MM/yyyy
                    formattedDate = `${parts[2]}-${pad(parts[1])}-${pad(parts[0])}`;
                } else { // MM/dd/yyyy
                    formattedDate = `${parts[2]}-${pad(parts[0])}-${pad(parts[1])}`;
                }
            } else if (parts[2].length === 2) { // yy/MM/dd or dd/MM/yy or MM/dd/yy
                if (parseInt(parts[0]) > 12) { // dd/MM/yy
                    formattedDate = `20${parts[2]}-${pad(parts[1])}-${pad(parts[0])}`;
                } else { // MM/dd/yy or yy/MM/dd
                    if (parseInt(parts[0]) > 31) { // yy/MM/dd
                        formattedDate = `20${parts[0]}-${pad(parts[1])}-${pad(parts[2])}`;
                    } else { // MM/dd/yy
                        formattedDate = `20${parts[2]}-${pad(parts[0])}-${pad(parts[1])}`;
                    }
                }
            } else { // yyyy/MM/dd
                formattedDate = `${parts[0]}-${pad(parts[1])}-${pad(parts[2])}`;
            }
        } else if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            if (parts[0].length === 4) { // yyyy-MM-dd or yyyy-MM
                if (parts.length === 3) {
                    formattedDate = dateStr;
                } else if (parts.length === 2) {
                    formattedDate = `${parts[0]}-${pad(parts[1])}-01`;
                }
            } else if (parts.length === 2 && parts[1].length === 4) { // MM-yyyy
                formattedDate = `${parts[1]}-${pad(parts[0])}-01`;
            } else { // dd-MM-yyyy
                formattedDate = `${parts[2]}-${pad(parts[1])}-${pad(parts[0])}`;
            }
        } else if (dateStr.includes('.')) {
            const parts = dateStr.split('.');
            formattedDate = `${parts[0]}-${pad(parts[1])}-${pad(parts[2])}`;
        }
        else if (dateStr.includes(',')) { // MMMM, yyyy
            const [month, year] = dateStr.split(', ');
            formattedDate = new Date(`${month} 01, ${year}`).toISOString().slice(0, 10);
        } else if (dateStr.length === 8) { // yyyyMMdd
            formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
        } else if(dateStr.includes(' ')){ // Month Year (e.g., "May 2024")
                const [month, year] = dateStr.split(' ');
                const monthNum = new Date(Date.parse(`${month} 1, 2000`)).getMonth() + 1; // Get month number
                formattedDate = `${year}-${pad(monthNum)}-01`;
            }
            else { // Month Day Year (e.g., "June 09 2024")
                const [month, day, year] = dateStr.split(' ');
                const monthNum = new Date(Date.parse(`${month} 1, 2000`)).getMonth() + 1; // Get month number
                formattedDate = `${year}-${pad(monthNum)}-${pad(day)}`;
            }
            

        _status_id = element.B === 'Active' ? 1 : element.B === 'Inactive' ? 2 : element.B === 'Pending' ? 3 : '';

        const arrObj = {
            period_name: formattedDate, // Use the formatted date here
            status_id: _status_id,
            file_path: '',
            description: element.C,
            userId: userId,
            created_by: created
        };
        excelData.push(arrObj);
    }
});



    if (excelData.length > 0 && counter == true) {
        setFields(excelData);
        setCounter(false);
    }

    // ---------------------------------------------------Export Excel form
    // const router = useRouter();


    const [status, setStatus] = useState([]);
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
            .then(res => res.json())
            .then(data => setStatus(data))
    }, [])



    const statusValueObj = status.map(status => status.status_name);
    const statusValue = statusValueObj.join(', ');
    const period_excel_file_export = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Excel Sheet 1");

        // Set sheet properties
        sheet.properties.defaultRowHeight = 15;
        sheet.properties.defaultColWidth = 15;
        sheet.pageSetup.horizontalCentered = true;
        sheet.pageSetup.verticalCentered = true;
        sheet.getRow(1).alignment = { horizontal: 'center' };

        // Freeze the first row and first three columns
        sheet.views = [{ state: 'frozen', xSplit: 3, ySplit: 1 }];

        // Define column headers
        const headers = [
            { header: "Period Name*", key: "period_name", width: 25 },
            { header: "Status*", key: "status", width: 25 },
            { header: "Description(Optional)", key: "description", width: 25 }
        ];

        // Set columns with headers
        sheet.columns = headers.map(col => ({
            header: col.header,
            key: col.key,
            width: col.width
        }));

        // Apply styles to header cells
        headers.forEach((col, index) => {
            const cell = sheet.getCell(1, index + 1);
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '9bcbf0' },
            };
            cell.border = {
                top: { style: "thin", color: { argb: "939090" } },
                left: { style: "thin", color: { argb: "939090" } },
                bottom: { style: "thin", color: { argb: "939090" } },
                right: { style: "thin", color: { argb: "939090" } },
            };
            cell.font = {
                name: "Verdana",
                family: 4,
                size: 11,
                bold: true,
            };

            // Add red asterisk if needed
            if (col.header.includes('*')) {
                const richText = [
                    { text: col.header.replace('*', ''), font: { color: { argb: '000000' }, bold: true } },
                    { text: '*', font: { color: { argb: 'FF0000' }, bold: true } },
                ];
                cell.value = { richText };
                cell.note = "(*) field required";

            } else if (col.header.includes('(Optional)')) {
                const richText = [
                    { text: col.header.replace('(Optional)', ''), font: { color: { argb: '000000' }, bold: true } },
                    // { text: '(Optional)', font: { color: { argb: '000000' }, bold: true } },
                ];
                cell.value = { richText };
                cell.note = "This is Optional";
            }
        });

        // Set column format to text
        ['A', 'B', 'C'].forEach(col => {
            sheet.getColumn(col).numFmt = '@';
        });

        // Dropdown of status value (assuming statusValue is a comma-separated string of options)
        // const statusValue = {statusValue};  // Replace with your actual status values
        const statusDropdownList = `"${statusValue}"`;
        sheet.dataValidations.add("B2:B9999", {
            type: 'list',
            allowBlank: false,
            showErrorMessage: true,
            formulae: [statusDropdownList],
        });

        // Download Excel sheet
        workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "Period Excel Form.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });
    };

    const [currentDates, setCurrentDates] = useState(Array(fields.length).fill(''));

    // Modify handleDateChange to accept index parameter
    const handleDateChange = (index, event) => {
        const selectedDate = new Date(event.target.value);
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const year = String(selectedDate.getFullYear());
        const formattedDate = `${day}-${month}-${year}`;

        // Update currentDates array with the new formatted date at the specified index
        const newCurrentDates = [...currentDates];
        newCurrentDates[index] = formattedDate;
        setCurrentDates(newCurrentDates);

        const formattedDatabaseDate = `${year}-${month}-${day}`;
        const newFields = [...fields];
        newFields[index]['period_name'] = formattedDatabaseDate;
        setFields(newFields);
    };

    return (
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">period Create </h5>
                                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                                    <Link href="/Admin/period/period_all" className="btn btn-sm btn-info">Back to Period List</Link>
                                </div>
                            </div>
                            {/* Excel */}

                            {/* <div class="form-group row ml-2">
                                <div class="col-md-6 ">
                                    <span className=" mb-2 mt-2">
                                        <label htmlFor={`fileInput`} className='mb-0 btn btn-sm btn-success '><FaUpload></FaUpload> Upload Excel File </label>
                                        <input className='mb-0' type="file" multiple accept=".xlsx, .xls" onChange={period_file_upload} id={`fileInput`} style={{ display: "none" }} />
                                    </span>
                                    <span className=" mb-2 mt-2 ml-3">
                                        <label htmlFor={`fileInpu`} className='mb-0 btn btn-sm btn-secondary mb-2 mt-2'><FaDownload></FaDownload> Sample Excel File </label>
                                        <input onClick={period_excel_file_export} type="button" name="search" class="btn btn-sm btn-secondary excel_btn ml-2" id={`fileInpu`} style={{ display: "none" }} />
                                    </span>
                                </div>
                            </div> */}

                            <div class="col-md-9 offset-md-1">
                                <div class="row">
                                    <div class="col-md-6">
                                        <span className=" mb-2 mt-2 ml-3">
                                            <label htmlFor={`fileInput`} className='btn btn-sm btn-success btn-sm btn-block'><FaUpload></FaUpload> Upload Excel File </label>
                                            <input className='mb-0' type="file" multiple accept=".xlsx, .xls" onChange={period_file_upload} id={`fileInput`} style={{ display: "none" }} />
                                        </span>
                                        {
                                            fileSizeExcel && <p className='text-danger'>{fileSizeExcel}</p>
                                        }
                                    </div>
                                    <div class="col-md-6">


                                        <span className=" mb-2 mt-2 ml-3">
                                            <label htmlFor={`fileInpu`} className='btn btn-sm btn-secondary btn-sm btn-block'><FaDownload></FaDownload> Sample Excel File </label>
                                            <input onClick={period_excel_file_export} type="button" name="search" class="btn btn-sm btn-secondary excel_btn ml-2" id={`fileInpu`} style={{ display: "none" }} />
                                        </span>

                                        <small><span className='text-danger font-weight-bold'>***</span>Download period Excell Format. Fill up with period information and upload this file to quick data entry. </small>
                                    </div>
                                </div>

                            </div>

                            {/* Excel */}
                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={period_create}>
                                    <div>
                                        <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                                            <div className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">
                                                <strong>Period</strong>
                                            </div>
                                            <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                                                <div className="input-group">
                                                    <input
                                                        style={{ width: '80px', marginTop: '1px' }}
                                                        type="number"
                                                        min="1"
                                                        className="form-control-sm "
                                                        placeholder="Enter number of forms to add"
                                                        value={numToAdd}
                                                        onChange={(event) => setNumToAdd(event.target.value)}
                                                    />
                                                    <div className="input-group-append">
                                                        <button
                                                            type="button"
                                                            className="btn btn-info btn-sm py-1 add_more "
                                                            onClick={period_add_more}
                                                        >
                                                            Add More
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">

                                            {fields.map((field, index) => (
                                                <div key={index} className={`brand-item d-lg-flex d-md-flex col-lg-12 mx-auto justify-content-between`}>
                                                    <div className='col-lg-3  border '>

                                                        <label className='font-weight-bold'>Period Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            value={currentDates[index]}
                                                            onClick={() => document.getElementById(`dateInput-${index}`).showPicker()}
                                                            placeholder="dd-mm-yyyy"
                                                            className="form-control form-control-sm mb-2"
                                                            style={{ display: 'inline-block', }}
                                                        />
                                                        <input
                                                            type="date"
                                                            id={`dateInput-${index}`}
                                                            onChange={(e) => handleDateChange(index, e)}
                                                            style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                        />

                                                        {/* <input
                                                            type="text"
                                                            required=""
                                                            name="period_name"
                                                            className="form-control form-control-sm mb-2"
                                                            placeholder="Enter Period Name"
                                                            value={field.period_name}
                                                            onChange={(e) => period_change(index, e)}
                                                            maxLength={256}
                                                        /> */}
                                                        {/* <small className="text-muted">{field.brand_name.length} / 255</small> */}
                                                        {field?.period_name?.length > 255 && (
                                                            <p className='text-danger'>Brand name cannot more than 255 characters.</p>
                                                        )}
                                                        {
                                                            rowError[index] && <p className='text-danger'>{rowError[index]}</p>
                                                        }
                                                        {
                                                            samePeriodName[index] && <p className='text-danger'>{samePeriodName}</p>
                                                        }

                                                    </div>
                                                    <div className='col-lg-3 border'>

                                                        <label className='font-weight-bold'>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>

                                                        <select
                                                            required=""
                                                            name="status_id"
                                                            className="form-control form-control-sm mb-2"
                                                            value={field.status_id}
                                                            onChange={(e) => period_change(index, e)}
                                                        >
                                                            <option value="">Select Status</option>
                                                            {
                                                                status.map(sta =>
                                                                    <>

                                                                        <option value={sta.id}>{sta.status_name}</option>
                                                                    </>

                                                                )
                                                            }


                                                            {/* <option value="2">Inactive</option> */}
                                                        </select>
                                                        {
                                                            error[index] && <p className='text-danger'>{error[index]}</p>
                                                        }
                                                    </div>
                                                    {/* <div className='w-lg-25 col-lg-2 border'>
                                        <label className='font-weight-bold'>File:</label>
                                        <div>
                                            <span class="btn btn-success btn-sm mb-2" >
                                                <label for="fileInput" className='mb-0' ><FaUpload></FaUpload>Select Image </label>
                                                <input
                                                    className='mb-0'
                                                    name="file_path"
                                                    onChange={period_createData}
                                                    type="file" id="fileInput" style={{ display: "none" }} />
                                            </span>

                                        </div>

                                        {selectedFile ?

                                            <>
                                                <img className="w-100 mb-2"

                                                    src={URL.createObjectURL(selectedFile)}
                                                    alt="Uploaded File" />
                                                <button
                                                    onClick={period_image_remove}
                                                    type="button" class="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                            </>
                                            :
                                            ''

                                        }

                                    </div> */}
                                                    <div className='w-lg-25 col-lg-2 border'>
                                                        <label className='font-weight-bold'>File</label>
                                                        <div>
                                                            <span className="btn btn-success btn-sm mb-2">
                                                                <label htmlFor={`fileInput${index}`} className='mb-0'><FaUpload></FaUpload> Select Image</label>
                                                                <input

                                                                    className='mb-0'

                                                                    onChange={(e) => period_file_change(index, e)}
                                                                    type="file" id={`fileInput${index}`} style={{ display: "none" }}
                                                                />
                                                            </span>
                                                        </div>

                                                        {selectedFile[index] ?
                                                            <>
                                                                <img className="w-100 mb-2 img-thumbnail" onChange={(e) => period_file_change(index, e)} src={URL.createObjectURL(selectedFile[index])} alt="Uploaded File" />

                                                                <input type="hidden" name="file_path" value={selectedFile[index].path} />
                                                                <button onClick={() => period_image_remove(index)} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                                            </>
                                                            :
                                                            ''
                                                        }
                                                        {
                                                            set_file_size_error[index] && (
                                                                <p className='text-danger'>{set_file_size_error[index]}</p>
                                                            )
                                                        }
                                                        {
                                                            filePathError[index] && (
                                                                <p className='text-danger'>{filePathError}</p>
                                                            )
                                                        }
                                                    </div>


                                                    <div className='col-lg-3 border'>

                                                        <label className='font-weight-bold'>Description</label>
                                                        <textarea
                                                            name="description"
                                                            className="form-control form-control-sm mb-2"
                                                            placeholder="Enter description"
                                                            value={field.description}
                                                            onChange={(e) => period_change(index, e)}


                                                            maxLength={500}
                                                        ></textarea>
                                                        <small className="text-muted">{field?.description?.length} / 500</small>
                                                    </div>

                                                    <div className='col-lg-1 border'>
                                                        <label className='font-weight-bold'>Action</label>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm form-control form-control-sm mb-2"
                                                            onClick={() => period_remove_field(index)}
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="offset-md-3 col-sm-6">
                                            <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeriodExcelCreate;


// 'use client' 
 //ismile
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import '../../../admin_layout/modal/fa.css'
// import { FaDownload, FaTimes, FaUpload } from 'react-icons/fa';
// import { parse, format } from 'date-fns';
// import * as XLSX from "xlsx";
// import Swal from "sweetalert2";
// import Link from 'next/link';
// import { useQuery } from '@tanstack/react-query';
// import { useRouter } from 'next/navigation';
// const ExcelJS = require('exceljs');


// const PeriodExcelCreate = () => {

//     const created = localStorage.getItem('userId');

//     const { data: periods = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['periods'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/period/period_all`)

//             const data = await res.json()
//             return data
//         }
//     })

//     console.log(periods)

//     const [numToAdd, setNumToAdd] = useState(1);
//     const [fields, setFields] = useState([{ period_name: '', status_id: '', file_path: '', description: '', created_by: created }]);


//     const [selectedFile, setSelectedFile] = useState(Array(fields.length).fill(null));


//     const [fileNames, setFileNames] = useState([])

//     const [rowError, setRowErrors] = useState([]);
//     const [error, setError] = useState([]);
//     const [file_size_error, set_file_size_error] = useState(null);
//     const [filePathError, setFilePathError] = useState([])
//     const [samePeriodName, setSamePeriodName] = useState([])

//     const period_change = (index, event) => {
//         const newFields = [...fields];
//         if (event.target.type === 'file') {
//             newFields[index][event.target.name] = event.target.files[0];
//         } else {
//             newFields[index][event.target.name] = event.target.value;
//         }
//         const brandName = newFields[index]['period_name'];
//         if (brandName) {
//             setRowErrors(""); // Clear the error message

//         }
//         const status = newFields[index]['status_id'];
//         if (status) {
//             setError(""); // Clear the error message
//         }
//         const matchingBrand = periods.find(item => item.period_name.toLowerCase() === brandName.toLowerCase());
//         if (!matchingBrand) {
//             setSamePeriodName('');
//             // You can also set an error state to show the message in the UI instead of using alert
//         }
//         // else {
//         //     setSamePeriodName("")
//         // }
//         const file_path = newFields[index]['file_path'];
//         if (file_path === '') {
//             // setFilePathError('This must be filled'); // Clear the error message
//         }
//         else {
//             setFilePathError("")
//         }
//         setFields(newFields);
//     };

//     const period_add_more = () => {
//         const numToAddInt = parseInt(numToAdd);
//         if (!isNaN(numToAddInt) && numToAddInt > 0) {
//             const newInputValues = [...fields];
//             for (let i = 0; i < numToAddInt; i++) {
//                 newInputValues.push({
//                     period_name: '',
//                     status_id: '',
//                     file_path: '',
//                     description: '',
//                     created_by: created
//                 });
//             }
//             setFields(newInputValues);
//             setNumToAdd(1);
//         }
//     };

//     const period_remove_field = (index) => {
//         const newFields = [...fields];
//         newFields.splice(index, 1);
//         setFields(newFields);
//     };


//     const router = useRouter()


//     const page_group = localStorage.getItem('pageGroup')


//     const [data, setData] = useState([]);
//     let [counter, setCounter] = useState(true);
//     let excelData = [];

//     const [fileSizeExcel, setFileSizeExcel] = useState([])
//     const period_file_upload = (e) => {
//         e.preventDefault();
//         const files = e.target.files;
//         Array.from(files).forEach((file) => {
//             if (file.size > 2 * 1024 * 1024) { // 2 MB in bytes
//                 setFileSizeExcel("File size should be less than 2 MB.");
//                 return;
//             } else {
//                 setFileSizeExcel('');
//             }
    
//             const reader = new FileReader();
//             reader.readAsBinaryString(file);
//             reader.onload = (event) => {
//                 const data = event.target.result;
//                 const workbook = XLSX.read(data, { type: "binary" });
//                 const sheetName = workbook.SheetNames[0];
//                 const sheet = workbook.Sheets[sheetName];
//                 setCounter(true);
    
//                 // Get the range of the sheet
//                 const range = XLSX.utils.decode_range(sheet['!ref']);
    
//                 // Extracting dates from the Excel sheet and converting to the desired format
//                 const dates = [];
//                 for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
//                     const cell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: 0 })]; // Assuming dates are in the first column
//                     if (cell && cell.v) {
//                         const parsedDate = parse(cell.v, 'dd-MM-yyyy', new Date()); // Parsing the date using date-fns
//                         if (!isNaN(parsedDate.getTime())) {
//                             const formattedDate = format(parsedDate, 'dd-MM-yyyy'); // Formatting the date as dd-mm-yyyy
//                             dates.push(formattedDate);
//                             console.log(formattedDate)
//                         } else {
//                             dates.push("Invalid date");
//                         }
//                     } else {
//                         dates.push("Invalid date");
//                     }
//                 }
    
//                 console.log("Dates:", dates[1]);
//                 const filteredDate = dates.slice(1); 
//                 console.log(filteredDate)
//                 // Update currentDates state with formatted dates
//                 setCurrentDates(filteredDate);

//                 // Update period names in fields state with formatted dates
//                 setFields(filteredDate.map((date, index) => ({
                    
//                     period_name: date,
//                     status_id: '',
//                     file_path: '',
//                     description: '',
//                     created_by: created
//                 })));
    
//                 setData((prevData) => [...prevData, sheet]);
//             };
//         });
//     };
//     // const period_file_upload = (e) => {
//     //     e.preventDefault();
//     //     const files = e.target.files;
//     //     Array.from(files).forEach((file) => {
//     //         if (file.size > 2 * 1024 * 1024) { // 2 MB in bytes
//     //             setFileSizeExcel("File size should be less than 2 MB.");
//     //             return;
//     //         } else {
//     //             setFileSizeExcel('');
//     //         }
    
//     //         const reader = new FileReader();
//     //         reader.readAsBinaryString(file);
//     //         reader.onload = (event) => {
//     //             const data = event.target.result;
//     //             const workbook = XLSX.read(data, { type: "binary" });
//     //             const sheetName = workbook.SheetNames[0];
//     //             const sheet = workbook.Sheets[sheetName];
//     //             setCounter(true);
    
//     //             // Extracting dates from the Excel sheet and converting to the desired format
//     //             const dates = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0].map(cell => {
//     //                 // Parse the cell value as a Date object
//     //                 const date = new Date(Date.parse(cell));
//     //                 // Check if the parsed date is valid and not NaN
//     //                 if (!isNaN(date) && date instanceof Date && isFinite(date)) {
//     //                     // Format the date as dd-mm-yyyy
//     //                     const day = String(date.getDate()).padStart(2, '0');
//     //                     const month = String(date.getMonth() + 1).padStart(2, '0');
//     //                     const year = String(date.getFullYear());
//     //                     const formateDate = `${day}-${month}-${year}`
//     //                     return String(formateDate);
//     //                 } else {
//     //                     return "Invalid date"; // Return a placeholder for invalid dates
//     //                 }
//     //             });
    
//     //             console.log("Dates:", dates);
    
//     //             // Update currentDates state with formatted dates
//     //             setCurrentDates(dates);
    
//     //             // Update period names in fields state with formatted dates
//     //             setFields(dates.map((date, index) => ({
//     //                 period_name: date,
//     //                 status_id: '',
//     //                 file_path: '',
//     //                 description: '',
//     //                 created_by: created
//     //             })));
    
//     //             setData((prevData) => [...prevData, sheet]);
//     //         };
//     //     });
//     // };
    
    
    
    
    
//     // const period_file_upload = (e) => {
//     //     e.preventDefault();
//     //     const files = e.target.files;
//     //     Array.from(files).forEach((file) => {
//     //         if (file.size > 2 * 1024 * 1024) { // 2 MB in bytes
//     //             setFileSizeExcel("File size should be less than 2 MB.");
//     //             return;
//     //         } else {
//     //             setFileSizeExcel('');
//     //         }

//     //         const reader = new FileReader();
//     //         reader.readAsBinaryString(file);
//     //         reader.onload = (event) => {
//     //             const data = event.target.result;
//     //             const workbook = XLSX.read(data, { type: "binary" });
//     //             const sheetName = workbook.SheetNames[0];
//     //             const sheet = workbook.Sheets[sheetName];
//     //             setCounter(true);

//     //             // Extracting dates from the Excel sheet
//     //             const dates = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0].map(cell => {
//     //                 // Assuming the dates are in the first row
//     //                 const [day, month, year] = cell.split('-').map(Number);
//     //                 return new Date(year, month - 1, day); // month is 0-indexed in JavaScript dates
//     //             });

//     //             // Update currentDates state with formatted dates
//     //             setCurrentDates(dates.map(date => {
//     //                 const day = String(date.getDate()).padStart(2, '0');
//     //                 const month = String(date.getMonth() + 1).padStart(2, '0');
//     //                 const year = String(date.getFullYear());
//     //                 return `${day}-${month}-${year}`;
//     //             }));

//     //             // Update period names in fields state with formatted dates
//     //             setFields(dates.map(date => {
//     //                 const day = String(date.getDate()).padStart(2, '0');
//     //                 const month = String(date.getMonth() + 1).padStart(2, '0');
//     //                 const year = String(date.getFullYear());
//     //                 const formattedDate = `${day}-${month}-${year}`;
//     //                 console.log(parseFloat(formattedDate))
//     //                 return {
//     //                     period_name: formattedDate,
//     //                     status_id: '',
//     //                     file_path: '',
//     //                     description: '',
//     //                     created_by: created
//     //                 };
//     //             }));

//     //             setData((prevData) => [...prevData, sheet]);
//     //         };
//     //     });
//     // };

   

//     // extracted value organization
//     data.forEach((_data) => {
//         const dataArray = [];
//         const rows = {};

//         const keys = Object.keys(_data).filter(key => !key.startsWith('!'));

//         keys.forEach(key => {
//             const col = key[0];
//             const row = key.slice(1);
//             const value = _data[key].v;

//             if (!rows[row]) {
//                 rows[row] = {};
//             } rows[row][col] = value;
//         });

//         Object.values(rows).forEach(rowObject => {
//             dataArray.push(rowObject);
//         });

//         const userId = localStorage.getItem('userId');
//         let _status_id = 0;

//         for (let index = 1; index < dataArray.length; index++) {
//             const element = dataArray[index];
//             _status_id = element.B === 'Active' ? 1 : element.B === 'Inactive' ? 2 : element.B === 'Pending' ? 3 : '';
//             const arrObj = {
//                 period_name: element.A,
//                 status_id: _status_id,
//                 file_path: '',
//                 description: element.C,
//                 userId: userId,
//                 created_by: created
//             }
//             excelData.push(arrObj);
//         }

//     });


//     if (excelData.length > 0 && counter == true) {
//         setFields(excelData);
//         setCounter(false);
//     }

//     // ---------------------------------------------------Export Excel form
//     // const router = useRouter();


//     const [status, setStatus] = useState([]);
//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
//             .then(res => res.json())
//             .then(data => setStatus(data))
//     }, [])



//     const statusValueObj = status.map(status => status.status_name);
//     const statusValue = statusValueObj.join(', ');
//     const period_excel_file_export = () => {
//         const workbook = new ExcelJS.Workbook();
//         const sheet = workbook.addWorksheet("Excel Sheet 1");

//         // Set sheet properties
//         sheet.properties.defaultRowHeight = 15;
//         sheet.properties.defaultColWidth = 15;
//         sheet.pageSetup.horizontalCentered = true;
//         sheet.pageSetup.verticalCentered = true;
//         sheet.getRow(1).alignment = { horizontal: 'center' };

//         // Freeze the first row and first three columns
//         sheet.views = [{ state: 'frozen', xSplit: 3, ySplit: 1 }];

//         // Define column headers
//         const headers = [
//             { header: "Period Name*", key: "period_name", width: 25 },
//             { header: "Status*", key: "status", width: 25 },
//             { header: "Description(Optional)", key: "description", width: 25 }
//         ];

//         // Set columns with headers
//         sheet.columns = headers.map(col => ({
//             header: col.header,
//             key: col.key,
//             width: col.width
//         }));

//         // Apply styles to header cells
//         headers.forEach((col, index) => {
//             const cell = sheet.getCell(1, index + 1);
//             cell.fill = {
//                 type: 'pattern',
//                 pattern: 'solid',
//                 fgColor: { argb: '9bcbf0' },
//             };
//             cell.border = {
//                 top: { style: "thin", color: { argb: "939090" } },
//                 left: { style: "thin", color: { argb: "939090" } },
//                 bottom: { style: "thin", color: { argb: "939090" } },
//                 right: { style: "thin", color: { argb: "939090" } },
//             };
//             cell.font = {
//                 name: "Verdana",
//                 family: 4,
//                 size: 11,
//                 bold: true,
//             };

//             // Add red asterisk if needed
//             if (col.header.includes('*')) {
//                 const richText = [
//                     { text: col.header.replace('*', ''), font: { color: { argb: '000000' }, bold: true } },
//                     { text: '*', font: { color: { argb: 'FF0000' }, bold: true } },
//                 ];
//                 cell.value = { richText };
//                 cell.note = "(*) field required";

//             } else if (col.header.includes('(Optional)')) {
//                 const richText = [
//                     { text: col.header.replace('(Optional)', ''), font: { color: { argb: '000000' }, bold: true } },
//                     // { text: '(Optional)', font: { color: { argb: '000000' }, bold: true } },
//                 ];
//                 cell.value = { richText };
//                 cell.note = "This is Optional";
//             }
//         });

//         // Set column format to text
//         ['A', 'B', 'C'].forEach(col => {
//             sheet.getColumn(col).numFmt = '@';
//         });

//         // Dropdown of status value (assuming statusValue is a comma-separated string of options)
//         // const statusValue = {statusValue};  // Replace with your actual status values
//         const statusDropdownList = `"${statusValue}"`;
//         sheet.dataValidations.add("B2:B9999", {
//             type: 'list',
//             allowBlank: false,
//             showErrorMessage: true,
//             formulae: [statusDropdownList],
//         });

//         // Download Excel sheet
//         workbook.xlsx.writeBuffer().then((data) => {
//             const blob = new Blob([data], {
//                 type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//             });
//             const url = window.URL.createObjectURL(blob);
//             const anchor = document.createElement("a");
//             anchor.href = url;
//             anchor.download = "Period Excel Form.xlsx";
//             anchor.click();
//             window.URL.revokeObjectURL(url);
//         });
//     };

//     const [currentDates, setCurrentDates] = useState(Array(fields.length).fill(''));

//     // Modify handleDateChange to accept index parameter
//     const handleDateChange = (index, event) => {
//         const selectedDate = new Date(event.target.value);
//         const day = String(selectedDate.getDate()).padStart(2, '0');
//         const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
//         const year = String(selectedDate.getFullYear());
//         const formattedDate = `${day}-${month}-${year}`;

//         // Update currentDates array with the new formatted date at the specified index
//         const newCurrentDates = [...currentDates];
//         newCurrentDates[index] = formattedDate;
//         setCurrentDates(newCurrentDates);

//         const formattedDatabaseDate = `${year}-${month}-${day}`;
//         const newFields = [...fields];
//         newFields[index]['period_name'] = formattedDatabaseDate;
//         setFields(newFields);
//     };

//     return (
//         <div class="container-fluid">
//             <div class=" row ">

//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="card-default">
//                             <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
//                                 <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">period Create </h5>
//                                 <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
//                                     <Link href="/Admin/period/period_all" className="btn btn-sm btn-info">Back to Period List</Link>
//                                 </div>
//                             </div>
//                             {/* Excel */}

//                             <div class="col-md-9 offset-md-1">
//                                 <div class="row">
//                                     <div class="col-md-6">
//                                         <span className=" mb-2 mt-2 ml-3">
//                                             <label htmlFor={`fileInput`} className='btn btn-sm btn-success btn-sm btn-block'><FaUpload></FaUpload> Upload Excel File </label>
//                                             <input className='mb-0' type="file" multiple accept=".xlsx, .xls" onChange={period_file_upload} id={`fileInput`} style={{ display: "none" }} />
//                                         </span>
//                                         {
//                                             fileSizeExcel && <p className='text-danger'>{fileSizeExcel}</p>
//                                         }
//                                     </div>
//                                     <div class="col-md-6">


//                                         <span className=" mb-2 mt-2 ml-3">
//                                             <label htmlFor={`fileInpu`} className='btn btn-sm btn-secondary btn-sm btn-block'><FaDownload></FaDownload> Sample Excel File </label>
//                                             <input onClick={period_excel_file_export} type="button" name="search" class="btn btn-sm btn-secondary excel_btn ml-2" id={`fileInpu`} style={{ display: "none" }} />
//                                         </span>

//                                         <small><span className='text-danger font-weight-bold'>***</span>Download period Excell Format. Fill up with period information and upload this file to quick data entry. </small>
//                                     </div>
//                                 </div>

//                             </div>

//                             {/* Excel */}
//                             <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                 (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                             </div>
//                             <div className="card-body">
//                                 <form className="form-horizontal" method="post" autoComplete="off" >
//                                     <div>
//                                         <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
//                                             <div className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">
//                                                 <strong>Period</strong>
//                                             </div>
//                                             <div className="card-title card-header-period font-weight-bold mb-0 float-right">
//                                                 <div className="input-group">
//                                                     <input
//                                                         style={{ width: '80px', marginTop: '1px' }}
//                                                         type="number"
//                                                         min="1"
//                                                         className="form-control-sm "
//                                                         placeholder="Enter number of forms to add"
//                                                         value={numToAdd}
//                                                         onChange={(event) => setNumToAdd(event.target.value)}
//                                                     />
//                                                     <div className="input-group-append">
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-info btn-sm py-1 add_more "
//                                                             onClick={period_add_more}
//                                                         >
//                                                             Add More
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">

//                                             {fields.map((field, index) => (
//                                                 <div key={index} className={`brand-item d-lg-flex d-md-flex col-lg-12 mx-auto justify-content-between`}>
//                                                     <div className='col-lg-3  border '>

//                                                         <label className='font-weight-bold'>Period Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                         <input
//                                                             type="text"
//                                                             readOnly
//                                                             value={currentDates[index]}
//                                                             onClick={() => document.getElementById(`dateInput-${index}`).showPicker()}
//                                                             placeholder="dd-mm-yyyy"
//                                                             className="form-control form-control-sm mb-2"
//                                                             style={{ display: 'inline-block', }}
//                                                         />
//                                                         <input
//                                                             type="date"
//                                                             id={`dateInput-${index}`}
//                                                             onChange={(e) => handleDateChange(index, e)}
//                                                             style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                                         />


//                                                         {field?.period_name?.length > 255 && (
//                                                             <p className='text-danger'>Brand name cannot more than 255 characters.</p>
//                                                         )}
//                                                         {
//                                                             rowError[index] && <p className='text-danger'>{rowError[index]}</p>
//                                                         }
//                                                         {
//                                                             samePeriodName[index] && <p className='text-danger'>{samePeriodName}</p>
//                                                         }

//                                                     </div>
//                                                     <div className='col-lg-3 border'>

//                                                         <label className='font-weight-bold'>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>

//                                                         <select
//                                                             required=""
//                                                             name="status_id"
//                                                             className="form-control form-control-sm mb-2"
//                                                             value={field.status_id}
//                                                             onChange={(e) => period_change(index, e)}
//                                                         >
//                                                             <option value="">Select Status</option>
//                                                             {
//                                                                 status.map(sta =>
//                                                                     <>

//                                                                         <option value={sta.id}>{sta.status_name}</option>
//                                                                     </>

//                                                                 )
//                                                             }


//                                                             {/* <option value="2">Inactive</option> */}
//                                                         </select>
//                                                         {
//                                                             error[index] && <p className='text-danger'>{error[index]}</p>
//                                                         }
//                                                     </div>

//                                                     <div className='col-lg-3 border'>

//                                                         <label className='font-weight-bold'>Description</label>
//                                                         <textarea
//                                                             name="description"
//                                                             className="form-control form-control-sm mb-2"
//                                                             placeholder="Enter description"
//                                                             value={field.description}
//                                                             onChange={(e) => period_change(index, e)}


//                                                             maxLength={500}
//                                                         ></textarea>
//                                                         <small className="text-muted">{field?.description?.length} / 500</small>
//                                                     </div>

//                                                     <div className='col-lg-1 border'>
//                                                         <label className='font-weight-bold'>Action</label>
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-danger btn-sm form-control form-control-sm mb-2"
//                                                             onClick={() => period_remove_field(index)}
//                                                         >
//                                                             <i className="fas fa-trash-alt"></i>
//                                                         </button>

//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                     <div className="form-group row">
//                                         <div className="offset-md-3 col-sm-6">
//                                             <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PeriodExcelCreate;