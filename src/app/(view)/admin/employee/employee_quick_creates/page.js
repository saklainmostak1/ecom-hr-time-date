
'use client' 
 //ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaDownload, FaUpload } from 'react-icons/fa';
import * as XLSX from "xlsx";
const ExcelJS = require('exceljs');

const EmployeeExcelCreate = () => {



    
    const [created, setCreated] = useState(() => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('userId') || '';
        }
        return '';
      });
    
      useEffect(() => {
        if (typeof window !== 'undefined') {
          const storedUserId = localStorage.getItem('userId');
          setCreated(storedUserId);
        }
      }, []);


    const [userId, setUserId] = useState(() => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('userId') || '';
        }
        return '';
      });
    
      useEffect(() => {
        if (typeof window !== 'undefined') {
          const storedUserId = localStorage.getItem('userId');
          setUserId(storedUserId);
        }
      }, []);



    let [fields, setFields] = useState([{
        school_shift_id: '', unique_id: '',
        full_name: '', gender: '', religion: '', mobile: '', dob: '', created_by: created
    }]);

    const [numToAdd, setNumToAdd] = useState(1);


    const handleAddMore = () => {
        const numToAddInt = parseInt(numToAdd);
        if (!isNaN(numToAddInt) && numToAddInt > 0) {
            const newInputValues = [...fields];
            for (let i = 0; i < numToAddInt; i++) {
                newInputValues.push({
                    school_shift_id: '', unique_id: '',
                    full_name: '', gender: '', religion: '', mobile: '', dob: '', created_by: created
                });
            }
            setFields(newInputValues);
            setNumToAdd(1);
        }
    };

    const [schoolShift, setSchoolShift] = useState([])
    const [employeeId, setEmployeeId] = useState([])
    const [fullName, setFullName] = useState([])
    const [gender, setGender] = useState([])
    const [religion, setReligion] = useState([])
    const [mobile, setMobile] = useState([])
    const [dob, setDob] = useState([])

    const handleChange = (index, event) => {

        const newFields = [...fields];

        if (event.target.type === 'file') {
            newFields[index][event.target.name] = event.target.files[0];
        } else {
            newFields[index][event.target.name] = event.target.value;

        }
        const school_shift_id = newFields[index]['school_shift_id']; 
        if(school_shift_id){
            setSchoolShift('')
        }

        const unique_id = newFields[index]['unique_id']; 
        if(unique_id){
            setEmployeeId('')
        }

        const full_name = newFields[index]['full_name']; 
        if(full_name){
            setFullName('')
        }

        const gender = newFields[index]['gender']; 
        if(gender){
            setGender('')
        }

        const religion = newFields[index]['religion']; 
        if(religion){
            setReligion('')
        }

        const mobile = newFields[index]['mobile']; 
        if(mobile){
            setMobile('')
        }

        const dob = newFields[index]['dob']; 
        if(dob){
            setDob('')
        }


        setFields(newFields);
    };

    const handleRemoveField = (index) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };

    const { data: schoolShiftList = [], isLoading, refetch
    } = useQuery({
        queryKey: ['schoolShiftList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all`)

            const data = await res.json()
            return data
        }
    })

    console.log(schoolShiftList)


    const { data: genderList = [],
    } = useQuery({
        queryKey: ['genderList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/gender/gender_list`)

            const data = await res.json()
            return data
        }
    })

    const { data: religionList = [],
    } = useQuery({
        queryKey: ['religionList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_list`)

            const data = await res.json()
            return data
        }
    })

    console.log(religionList)


    const escapeExcelFormula = (str) => {
        return str.replace(/"/g, '""')

    };

    console.log(genderList)
    const model_excel_file_export = async () => {

        const rolePermissionResponses = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_list`);
        const rolePermissionData = await rolePermissionResponses.json();
        const religionList = rolePermissionData

        const rolePermissionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/gender/gender_list`);
        const rolePermissionDatas = await rolePermissionResponse.json();
        const genderList = rolePermissionDatas

        const statusValueObj = genderList.map(gender => gender.gender_name);
        const statusValue = statusValueObj.join(',');

        const brandValueObj = religionList.map(religion => (religion.name));
        const brandValue = brandValueObj.join(',');

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
            { header: "Religion*", key: "religion", width: 25 },
            { header: "shift*", key: "school_shift_id", width: 25 },
            { header: "Gender*", key: "gender", width: 25 },
            { header: "Employe Id*", key: "unique_id", width: 25 },
            { header: "Name*", key: "full_name", width: 25 },
            { header: "Mobile*", key: "mobile", width: 25 },
            { header: "Date Of Bath(dd-mm-yyyy)*", key: "dob", width: 25 }
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
        ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
            sheet.getColumn(col).numFmt = '@';
        });


        const statusDropdownLists = `"${brandValue}"`;
        console.log(statusDropdownLists.length)
        sheet.dataValidations.add("A2:A9999", {
            type: 'list',
            allowBlank: false,
            showErrorMessage: true,
            formulae: [statusDropdownLists],
        });

        const statusDropdownList = `"${statusValue}"`;
        sheet.dataValidations.add("C2:C9999", {
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
            anchor.download = "Employe Excel Form.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });
    };


    const [data, setData] = useState([]);
    let [counter, setCounter] = useState(true);
    let excelData = [];

    // uploading multiple file
    const [fileSizeExcel, setFileSizeExcel] = useState([])

    const model_file_upload = (e) => {
        e.preventDefault();
        const files = e.target.files;
        Array.from(files).forEach((file) => {
            if (file.size > 2 * 1024 * 1024) { // 2 MB in bytes
                setFileSizeExcel("File size should be less than 2 MB.");
                return;
            }
            else {
                setFileSizeExcel('')
            }

            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (event) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                setCounter(true);
                setData((prevData) => [...prevData, sheet]);
            };
        });
    };

    // extracted value organization
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
            } rows[row][col] = value;
        });

        Object.values(rows).forEach(rowObject => {
            dataArray.push(rowObject);
        });

       


        for (let index = 1; index < dataArray.length; index++) {
            const element = dataArray[index];
            console.log(schoolShiftList.find(schoolShift => schoolShift.name.toLowerCase()))
            let brandName = schoolShiftList.find(schoolShift => schoolShift.name.toLowerCase() === element.B.toLowerCase())
            let gender = genderList.find(gender => gender.gender_name.toLowerCase() === element.C.toLowerCase())
            let religion = religionList.find(religion => religion.name.toLowerCase() === element.A.toLowerCase())
            const brandData = brandName?.id
            const genderData = gender?.id
            const religionData = religion?.id
            console.log(brandData)
            console.log(brandData)
            console.log(element.B)
            console.log(element.C)
            console.log(element.D)
            console.log(element.G)


            const arrObj = {
                religion: religionData,
                school_shift_id: brandData,
                gender: genderData,
                unique_id: element.D,
                full_name: element.E,
                mobile: element.F,
                dob: element.G,
                created_by: userId,
            };
            excelData.push(arrObj);
        }

    });


    if (excelData.length > 0 && counter == true) {
        setFields(excelData);
        setCounter(false);
    }

    // ---------------------------------------------------Export Excel form



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
        newFields[index]['dob'] = formattedDatabaseDate;
        setFields(newFields);
    };


    const quick_employe_create = (event) => {

        event.preventDefault();

        // const form = event.target
    
        // const full_name = form.name.value
        // const school_shift_id = form.school_shift_id.value
        // const unique_id = form.unique_id.value
        // const gender = form.gender.value
        // const religion = form.religion.value
        // const mobile = form.mobile.value
        // const password = form.mobile.value
        // // const dob = form.dob.value

        // const addValue = {
        //     full_name,  created_by: created, school_shift_id, unique_id, gender, religion, mobile, 
        //     dob: currentDates ? currentDates : fields.dob, password
        // }

           

        const newErrors = new Array(fields.length).fill('');
        const isValid = fields.every((inputValue, index) => {
            if (!inputValue.school_shift_id) {
                newErrors[index] = 'School Shift Name must be filled.';
                return false;
            }
            return true;
        });

        if (!isValid) {
            setSchoolShift(newErrors);
            return;
        }
        setSchoolShift(new Array(fields.length).fill(''));

        const newError = new Array(fields.length).fill('');
        const isValids = fields.every((inputValue, index) => {
            if (!inputValue?.unique_id) {
                newError[index] = 'This must be filled.';
                return false;
            }
            return true;
        });

        if (!isValids) {
            setEmployeeId(newError);
            return;
        }
        setEmployeeId(new Array(fields.length).fill(''));


        const newErrorName = new Array(fields.length).fill('');
        const isValidsName = fields.every((inputValue, index) => {
            if (!inputValue?.full_name) {
                newErrorName[index] = 'Name must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidsName) {
            setFullName(newErrorName);
            return;
        }
        setFullName(new Array(fields.length).fill(''));


        const newErrorGender = new Array(fields.length).fill('');
        const isValidsGender = fields.every((inputValue, index) => {
            if (!inputValue?.gender) {
                newErrorGender[index] = 'Gender must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidsGender) {
            setGender(newErrorGender);
            return;
        }
        setGender(new Array(fields.length).fill(''));
      
        const newErrorReligion = new Array(fields.length).fill('');
        const isValidsReligion = fields.every((inputValue, index) => {
            if (!inputValue?.religion) {
                newErrorReligion[index] = 'religion must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidsReligion) {
            setReligion(newErrorReligion);
            return;
        }
        setReligion(new Array(fields.length).fill(''));


        const newErrorMobile = new Array(fields.length).fill('');
        const isValidsMobile = fields.every((inputValue, index) => {
            if (!inputValue?.mobile) {
                newErrorMobile[index] = 'Mobile Number must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidsMobile) {
            setMobile(newErrorMobile);
            return;
        }
        setMobile(new Array(fields.length).fill(''));

        // const newErrorDob = new Array(fields.length).fill('');
        // const isValidsDob = fields.every((inputValue, index) => {
        //     if (!inputValue?.dob) {
        //         newErrorDob[index] = 'Date Of Birthday must be filled.';
        //         return false;
        //     }
        //     return true;
        // });

        // if (!isValidsDob) {
        //     setDob(newErrorDob);
        //     return;
        // }
        // setDob(new Array(fields.length).fill(''));
      

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/quick_create_employee`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(fields),
        })

            .then((Response) =>
                Response.json()
            )
            .then((data) => {
                console.log(data)
                if (data) {

                    if(typeof window !=='undefined'){

                        sessionStorage.setItem("message", "Data saved successfully!");
                    }
                    // router.push('/Admin/employee/employee_all?page_group=hr_management');
                }
                console.log(data)

            })
            .catch((error) => console.error(error));
    }

const router = useRouter()
    return (
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Create Brand</h5>
                                <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
                                    <Link href={`/Admin/brand/brand_all?page_group=`} className="btn btn-sm btn-info h-50">Back to Brand List</Link>
                                </div>
                            </div>
                            <div class="col-md-9 offset-md-1">
                                <div class="row">
                                    <div class="col-md-6">
                                        <span className=" mb-2 mt-2 ml-3">
                                            <label htmlFor={`fileInput`} className='btn btn-sm btn-success btn-sm btn-block'><FaUpload></FaUpload> Upload Excel File </label>
                                            <input className='mb-0' type="file" multiple accept=".xlsx, .xls" onChange={model_file_upload} id={`fileInput`} style={{ display: "none" }} />
                                        </span>
                                        {
                                            fileSizeExcel && <p className='text-danger'>{fileSizeExcel}</p>
                                        }
                                    </div>
                                    <div class="col-md-6">


                                        <span className=" mb-2 mt-2 ml-3">
                                            <label htmlFor={`fileInpu`} className='btn btn-sm btn-secondary btn-sm btn-block'><FaDownload></FaDownload> Sample Excel File </label>
                                            <input onClick={model_excel_file_export} type="button" name="search" class="btn btn-sm btn-secondary excel_btn ml-2" id={`fileInpu`} style={{ display: "none" }} />
                                        </span>

                                        <small><span className='text-danger font-weight-bold'>***</span>Download model Excell Format. Fill up with model information and upload this file to quick data entry. </small>
                                    </div>
                                </div>

                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form action="" onSubmit={quick_employe_create}>
                                    <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary text-white">

                                        <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
                                            <strong>Educational Qualification</strong>
                                        </div>

                                        <div className="card-title card-header-color font-weight-bold mb-0 float-right">
                                            <div className="input-group printable">
                                                <input
                                                    style={{ width: '80px' }}
                                                    type="number"
                                                    min="1"
                                                    className="form-control "
                                                    placeholder="Enter number of forms to add"
                                                    value={numToAdd}
                                                    onChange={(event) => setNumToAdd(event.target.value)}
                                                />
                                                <div className="input-group-append">
                                                    <button
                                                        type="button"
                                                        className="btn btn-info btn-sm py-1 add_more "
                                                        onClick={handleAddMore}
                                                    >
                                                        Add More
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-group row px-3 ">
                                            <table className="table table-bordered  table-hover table-striped table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Shift<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                        <th>Employee Id<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                        <th>Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                        <th>Date of bath<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                        <th>Gender<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                        <th>Religion<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                        <th>Mobile<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                        <th>Action</th>
                                                    </tr>

                                                </thead>

                                                <tbody>

                                                    {isLoading ? <div className='text-center'>
                                                        <div className='  text-center text-dark'>

                                                            <FontAwesomeIcon style={{
                                                                height: '33px',
                                                                width: '33px',
                                                            }} icon={faSpinner} spin />

                                                        </div>
                                                    </div>

                                                        :


                                                        <>

                                                            {
                                                                fields.map((field, index) => (
                                                                    <>

                                                                        <tr >
                                                                            <td>
                                                                                <select
                                                                                    value={field.school_shift_id}
                                                                                    onChange={(e) => handleChange(index, e)}
                                                                                    required="" name="school_shift_id" class="form-control form-control-sm  trim integer_no_zero row_unique_education" id="education" placeholder="Enter Education">
                                                                                    <option >Select Shift</option>
                                                                                    {
                                                                                        schoolShiftList.map(schoolShift =>
                                                                                            <>
                                                                                                <option value={schoolShift.id}>
                                                                                                    {schoolShift.name}
                                                                                                </option>
                                                                                            </>

                                                                                        )
                                                                                    }

                                                                                </select>
                                                                                {
                                                                                    schoolShift[index] && <p className='text-danger'>{schoolShift[index] }</p>
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    value={field.unique_id}
                                                                                    onChange={(e) => handleChange(index, e)}
                                                                                    type="text" required="" name="unique_id" class="form-control form-control-sm  required row_unique_institute" id="institute" placeholder="Enter Employee Id" />
                                                                            </td>
                                                                            {
                                                                                    employeeId[index] && <p className='text-danger'>{employeeId[index] }</p>
                                                                                }
                                                                            <td>
                                                                                <input
                                                                                    value={field.full_name}
                                                                                    onChange={(e) => handleChange(index, e)}
                                                                                    type="text" required="" name="full_name" class="form-control form-control-sm  required row_unique_result" id="result" placeholder="Enter Full Name" />
                                                                            </td>
                                                                            {
                                                                                    fullName[index] && <p className='text-danger'>{fullName[index] }</p>
                                                                                }
                                                                            <td>

                                                                                <input

                                                                                    type="text"
                                                                                    readOnly
                                                                                    value={currentDates[index] ? currentDates[index] : field.dob}
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
                                                                            </td>
                                                                            <td>
                                                                                <select
                                                                                    onChange={(e) => handleChange(index, e)}
                                                                                    value={field.gender}
                                                                                    required="" name="gender" class="form-control form-control-sm  required integer_no_zero" id="gender_name">
                                                                                    <option >Select Gender</option>
                                                                                    {
                                                                                        genderList.map(gender =>


                                                                                            <>
                                                                                                <option value={gender.id}>{gender.gender_name}</option>

                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                </select>
                                                                                {
                                                                                    gender[index] && <p className='text-danger'>{gender[index] }</p>
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                <select
                                                                                    onChange={(e) => handleChange(index, e)}
                                                                                    value={field.religion}
                                                                                    required="" name="religion" class="form-control form-control-sm  required integer_no_zero" id="gender_name">
                                                                                    <option >Select Religion</option>
                                                                                    {
                                                                                        religionList.map(religion =>

                                                                                            <>
                                                                                                <option value={religion.id}>{religion.name}</option>

                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                </select>
                                                                                {
                                                                                    religion[index] && <p className='text-danger'>{religion[index] }</p>
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    value={field.mobile}
                                                                                    onChange={(e) => handleChange(index, e)}
                                                                                    type="text" required="" name="mobile" class="form-control form-control-sm  required row_unique_passing_year" id="passing_year" placeholder="Enter mobile number" />
                                                                                     {
                                                                                    mobile[index] && <p className='text-danger'>{mobile[index] }</p>
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                <button
                                                                                    onClick={() => handleRemoveField(index)}
                                                                                    type="button" class="btn btn-sm btn-danger btn-sm remove delete"><i class="fas fa-trash-alt"></i></button>
                                                                            </td>


                                                                        </tr>
                                                                    </>
                                                                ))
                                                            }
                                                        </>
                                                    }
                                                </tbody>

                                            </table>

                                        </div>
                                            <div class="row no-gutters">
                                                <div class="col-md-12 offset-md-3">
                                                    <input type="submit" name="create" class="btn btn-sm btn-success" value="Submit" />
                                                </div>
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

export default EmployeeExcelCreate;












































// 'use client' 
 //ismile
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';
// import { FaDownload, FaUpload } from 'react-icons/fa';
// import * as XLSX from "xlsx";
// const ExcelJS = require('exceljs');

// const EmployeeExcelCreate = () => {

//     const created = localStorage.getItem('userId')


//     let [fields, setFields] = useState([{
//         school_shift_id: '', unique_id: '',
//         full_name: '', gender: '', religion: '', mobile: '', dob: '', created_by: created
//     }]);

//     const [numToAdd, setNumToAdd] = useState(1);


//     const handleAddMore = () => {
//         const numToAddInt = parseInt(numToAdd);
//         if (!isNaN(numToAddInt) && numToAddInt > 0) {
//             const newInputValues = [...fields];
//             for (let i = 0; i < numToAddInt; i++) {
//                 newInputValues.push({
//                     school_shift_id: '', unique_id: '',
//                     full_name: '', gender: '', religion: '', mobile: '', dob: '', created_by: created
//                 });
//             }
//             setFields(newInputValues);
//             setNumToAdd(1);
//         }
//     };

//     const [schoolShift, setSchoolShift] = useState([])
//     const [employeeId, setEmployeeId] = useState([])
//     const [fullName, setFullName] = useState([])
//     const [gender, setGender] = useState([])
//     const [religion, setReligion] = useState([])
//     const [mobile, setMobile] = useState([])
//     const [dob, setDob] = useState([])

//     const handleChange = (index, event) => {

//         const newFields = [...fields];

//         if (event.target.type === 'file') {
//             newFields[index][event.target.name] = event.target.files[0];
//         } else {
//             newFields[index][event.target.name] = event.target.value;

//         }
//         const school_shift_id = newFields[index]['school_shift_id']; 
//         if(school_shift_id){
//             setSchoolShift('')
//         }

//         const unique_id = newFields[index]['unique_id']; 
//         if(unique_id){
//             setEmployeeId('')
//         }

//         const full_name = newFields[index]['full_name']; 
//         if(full_name){
//             setFullName('')
//         }

//         const gender = newFields[index]['gender']; 
//         if(gender){
//             setGender('')
//         }

//         const religion = newFields[index]['religion']; 
//         if(religion){
//             setReligion('')
//         }

//         const mobile = newFields[index]['mobile']; 
//         if(mobile){
//             setMobile('')
//         }

//         const dob = newFields[index]['dob']; 
//         if(dob){
//             setDob('')
//         }


//         setFields(newFields);
//     };

//     const handleRemoveField = (index) => {
//         const newFields = [...fields];
//         newFields.splice(index, 1);
//         setFields(newFields);
//     };

//     const { data: schoolShiftList = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['schoolShiftList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all`)

//             const data = await res.json()
//             return data
//         }
//     })

//     console.log(schoolShiftList)


//     const { data: genderList = [],
//     } = useQuery({
//         queryKey: ['genderList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/gender/gender_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: religionList = [],
//     } = useQuery({
//         queryKey: ['religionList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     console.log(religionList)


//     // ---------------------------------------------------Export Excel form



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
//         newFields[index]['dob'] = formattedDatabaseDate;
//         setFields(newFields);
//     };


//     const quick_employe_create = (event) => {

//         event.preventDefault();


        

//         const newErrors = new Array(fields.length).fill('');
//         const isValid = fields.every((inputValue, index) => {
//             if (!inputValue.school_shift_id) {
//                 newErrors[index] = 'School Shift Name must be filled.';
//                 return false;
//             }
//             return true;
//         });

//         if (!isValid) {
//             setSchoolShift(newErrors);
//             return;
//         }
//         setSchoolShift(new Array(fields.length).fill(''));

//         const newError = new Array(fields.length).fill('');
//         const isValids = fields.every((inputValue, index) => {
//             if (!inputValue?.unique_id) {
//                 newError[index] = 'This must be filled.';
//                 return false;
//             }
//             return true;
//         });

//         if (!isValids) {
//             setEmployeeId(newError);
//             return;
//         }
//         setEmployeeId(new Array(fields.length).fill(''));


//         const newErrorName = new Array(fields.length).fill('');
//         const isValidsName = fields.every((inputValue, index) => {
//             if (!inputValue?.full_name) {
//                 newErrorName[index] = 'Name must be filled.';
//                 return false;
//             }
//             return true;
//         });

//         if (!isValidsName) {
//             setFullName(newErrorName);
//             return;
//         }
//         setFullName(new Array(fields.length).fill(''));


//         const newErrorGender = new Array(fields.length).fill('');
//         const isValidsGender = fields.every((inputValue, index) => {
//             if (!inputValue?.gender) {
//                 newErrorGender[index] = 'Gender must be filled.';
//                 return false;
//             }
//             return true;
//         });

//         if (!isValidsGender) {
//             setGender(newErrorGender);
//             return;
//         }
//         setGender(new Array(fields.length).fill(''));
      
//         const newErrorReligion = new Array(fields.length).fill('');
//         const isValidsReligion = fields.every((inputValue, index) => {
//             if (!inputValue?.religion) {
//                 newErrorReligion[index] = 'religion must be filled.';
//                 return false;
//             }
//             return true;
//         });

//         if (!isValidsReligion) {
//             setReligion(newErrorReligion);
//             return;
//         }
//         setReligion(new Array(fields.length).fill(''));


//         const newErrorMobile = new Array(fields.length).fill('');
//         const isValidsMobile = fields.every((inputValue, index) => {
//             if (!inputValue?.mobile) {
//                 newErrorMobile[index] = 'Mobile Number must be filled.';
//                 return false;
//             }
//             return true;
//         });

//         if (!isValidsMobile) {
//             setMobile(newErrorMobile);
//             return;
//         }
//         setMobile(new Array(fields.length).fill(''));

//         const newErrorDob = new Array(fields.length).fill('');
//         const isValidsDob = fields.every((inputValue, index) => {
//             if (!inputValue?.dob) {
//                 newErrorDob[index] = 'Date Of Birthday must be filled.';
//                 return false;
//             }
//             return true;
//         });

//         if (!isValidsDob) {
//             setDob(newErrorDob);
//             return;
//         }
//         setDob(new Array(fields.length).fill(''));
      


       
 

//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/quick_create_employee`, {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json',
//             },
//             body: JSON.stringify(fields),
//         })

//             .then((Response) =>
//                 Response.json()
//             )
//             .then((data) => {
//                 console.log(data)
//                 if (data[0]?.affectedRows > 0) {
//                     sessionStorage.setItem("message", "Data saved successfully!");
//                     // router.push('/Admin/period/period_all');
//                 }
//                 console.log(data)

//             })
//             .catch((error) => console.error(error));
//     }


//     return (
//         <div class="container-fluid">
//             <div class=" row ">

//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="card-default">
//                             <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
//                                 <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Create Brand</h5>
//                                 <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
//                                     <Link href={`/Admin/brand/brand_all?page_group=`} className="btn btn-sm btn-info h-50">Back to Brand List</Link>
//                                 </div>
//                             </div>
                        
//                             <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                 (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                             </div>
//                             <div className="card-body">
//                                 <form action="" onSubmit={quick_employe_create}>
//                                     <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary text-white">

//                                         <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
//                                             <strong>Educational Qualification</strong>
//                                         </div>

//                                         <div className="card-title card-header-color font-weight-bold mb-0 float-right">
//                                             <div className="input-group printable">
//                                                 <input
//                                                     style={{ width: '80px' }}
//                                                     type="number"
//                                                     min="1"
//                                                     className="form-control "
//                                                     placeholder="Enter number of forms to add"
//                                                     value={numToAdd}
//                                                     onChange={(event) => setNumToAdd(event.target.value)}
//                                                 />
//                                                 <div className="input-group-append">
//                                                     <button
//                                                         type="button"
//                                                         className="btn btn-info btn-sm py-1 add_more "
//                                                         onClick={handleAddMore}
//                                                     >
//                                                         Add More
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <div className="form-group row px-3 ">
//                                             <table className="table table-bordered  table-hover table-striped table-sm">
//                                                 <thead>
//                                                     <tr>
//                                                         <th>Shift<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
//                                                         <th>Employee Id<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
//                                                         <th>Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
//                                                         <th>Date of bath</th>
//                                                         <th>Gender<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
//                                                         <th>Religion<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
//                                                         <th>Mobile<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
//                                                         <th>Action</th>
//                                                     </tr>

//                                                 </thead>

//                                                 <tbody>

//                                                     {isLoading ? <div className='text-center'>
//                                                         <div className='  text-center text-dark'>

//                                                             <FontAwesomeIcon style={{
//                                                                 height: '33px',
//                                                                 width: '33px',
//                                                             }} icon={faSpinner} spin />

//                                                         </div>
//                                                     </div>

//                                                         :


//                                                         <>

//                                                             {
//                                                                 fields.map((field, index) => (
//                                                                     <>

//                                                                         <tr >
//                                                                             <td>
//                                                                                 <select
//                                                                                     value={field.school_shift_id}
//                                                                                     onChange={(e) => handleChange(index, e)}
//                                                                                     required="" name="school_shift_id" class="form-control form-control-sm  trim integer_no_zero row_unique_education" id="education" placeholder="Enter Education">
//                                                                                     <option >Select Shift</option>
//                                                                                     {
//                                                                                         schoolShiftList.map(schoolShift =>
//                                                                                             <>
//                                                                                                 <option value={schoolShift.id}>
//                                                                                                     {schoolShift.name}
//                                                                                                 </option>
//                                                                                             </>

//                                                                                         )
//                                                                                     }

//                                                                                 </select>
//                                                                                 {
//                                                                                     schoolShift[index] && <p className='text-danger'>{schoolShift[index] }</p>
//                                                                                 }
//                                                                             </td>
//                                                                             <td>
//                                                                                 <input
//                                                                                     value={field.unique_id}
//                                                                                     onChange={(e) => handleChange(index, e)}
//                                                                                     type="text" required="" name="unique_id" class="form-control form-control-sm  required row_unique_institute" id="institute" placeholder="Enter Institute" />
//                                                                                      {
//                                                                                     employeeId[index] && <p className='text-danger'>{employeeId[index] }</p>
//                                                                                 }
//                                                                             </td>
//                                                                             <td>
//                                                                                 <input
//                                                                                     value={field.full_name}
//                                                                                     onChange={(e) => handleChange(index, e)}
//                                                                                     type="text" required="" name="full_name" class="form-control form-control-sm  required row_unique_result" id="result" placeholder="Enter Result" />
//                                                                                      {
//                                                                                     fullName[index] && <p className='text-danger'>{fullName[index] }</p>
//                                                                                 }
//                                                                             </td>
//                                                                             <td>

//                                                                                 <input
// // name='dob'
//                                                                                     type="text"
//                                                                                     readOnly
//                                                                                     value={currentDates[index] ? currentDates[index] : field.dob}
//                                                                                     onClick={() => document.getElementById(`dateInput-${index}`).showPicker()}
//                                                                                     placeholder="dd-mm-yyyy"
//                                                                                     className="form-control form-control-sm mb-2"
//                                                                                     style={{ display: 'inline-block', }}
//                                                                                 />
//                                                                                  {
//                                                                                     dob[index] && <p className='text-danger'>{dob[index] }</p>
//                                                                                 }
//                                                                                 <input

//                                                                                     type="date"
//                                                                                     id={`dateInput-${index}`}
//                                                                                     onChange={(e) => handleDateChange(index, e)}
//                                                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                                                                 />
//                                                                             </td>
//                                                                             <td>
//                                                                                 <select
//                                                                                     onChange={(e) => handleChange(index, e)}
//                                                                                     value={field.gender}
//                                                                                     required="" name="gender" class="form-control form-control-sm  required integer_no_zero" id="gender_name">
//                                                                                     <option >Select Gender</option>
//                                                                                     {
//                                                                                         genderList.map(gender =>


//                                                                                             <>
//                                                                                                 <option value={gender.id}>{gender.gender_name}</option>

//                                                                                             </>
//                                                                                         )
//                                                                                     }
//                                                                                 </select>
//                                                                                 {
//                                                                                     gender[index] && <p className='text-danger'>{gender[index] }</p>
//                                                                                 }
//                                                                             </td>
//                                                                             <td>
//                                                                                 <select
//                                                                                     onChange={(e) => handleChange(index, e)}
//                                                                                     value={field.religion}
//                                                                                     required="" name="religion" class="form-control form-control-sm  required integer_no_zero" id="gender_name">
//                                                                                     <option >Select Religion</option>
//                                                                                     {
//                                                                                         religionList.map(religion =>

//                                                                                             <>
//                                                                                                 <option value={religion.id}>{religion.name}</option>

//                                                                                             </>
//                                                                                         )
//                                                                                     }
//                                                                                 </select>
//                                                                                 {
//                                                                                     religion[index] && <p className='text-danger'>{religion[index] }</p>
//                                                                                 }
//                                                                             </td>
//                                                                             <td>
//                                                                                 <input
//                                                                                     value={field.mobile}
//                                                                                     onChange={(e) => handleChange(index, e)}
//                                                                                     type="text" required="" name="mobile" class="form-control form-control-sm  required row_unique_passing_year" id="passing_year" placeholder="Enter mobile number" />
//                                                                                      {
//                                                                                     mobile[index] && <p className='text-danger'>{mobile[index] }</p>
//                                                                                 }
//                                                                             </td>
//                                                                             <td>
//                                                                                 <button
//                                                                                     onClick={() => handleRemoveField(index)}
//                                                                                     type="button" class="btn btn-sm btn-danger btn-sm remove delete"><i class="fas fa-trash-alt"></i></button>
//                                                                             </td>


//                                                                         </tr>
//                                                                     </>
//                                                                 ))
//                                                             }
//                                                         </>
//                                                     }
//                                                 </tbody>

//                                             </table>

//                                         </div>
//                                             <div class="row no-gutters">
//                                                 <div class="col-md-12 offset-md-3">
//                                                     <input type="submit" name="create" class="btn btn-sm btn-success" value="Submit" />
//                                                 </div>
//                                             </div>
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

// export default EmployeeExcelCreate;