'use client' 
 //ismile
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaDownload, FaRegTrashAlt, FaTimes, FaTrashAlt, FaUpload } from 'react-icons/fa';

import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
const ExcelJS = require('exceljs');

const CreateColor = () => {

    const created = localStorage.getItem('userId')

    const { data: colors = [], isLoading, refetch
    } = useQuery({
        queryKey: ['colors'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/color/color_all`)

            const data = await res.json()
            return data
        }
    })

    console.log(colors)


    const [numToAdd, setNumToAdd] = useState(1);
    const [fields, setFields] = useState([{ color_name: '', status_id: '', file_path: '', description: '', created_by: created }]);

    const [selectedFile, setSelectedFile] = useState(Array(fields.length).fill(null));


    const [fileNames, setFileNames] = useState([])

    const [sameColorName, setSameColorName] = useState([])
    const [rowError, setRowErrors] = useState([]);
    const [error, setError] = useState([]);
    const [file_size_error, set_file_size_error] = useState(null);
    const [filePathError, setFilePathError] = useState([])

    const color_file_change = (index, e) => {

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
        const _path = 'color/' + time + '/' + newName;
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

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/color/color_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };


    const color_change = (index, event) => {
        const newFields = [...fields];
        if (event.target.type === 'file') {
            newFields[index][event.target.name] = event.target.files[0];
        } else {
            newFields[index][event.target.name] = event.target.value;
        }

        const brandName = newFields[index]['color_name'];
        if (brandName) {
            setRowErrors(""); // Clear the error message

        }
        const status = newFields[index]['status_id'];
        if (status) {
            setError(""); // Clear the error message
        }
        const matchingBrand = colors.find(item => item?.color_name?.toLowerCase() === brandName?.toLowerCase());
        if (!matchingBrand) {
            setSameColorName('');
            // You can also set an error state to show the message in the UI instead of using alert
        }
        // else {
        //     setSameColorName("")
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

    const color_add_more = () => {
        const numToAddInt = parseInt(numToAdd);
        if (!isNaN(numToAddInt) && numToAddInt > 0) {
            const newInputValues = [...fields];
            for (let i = 0; i < numToAddInt; i++) {
                newInputValues.push({
                    color_name: '',
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

    // const color_field_remove = (index) => {
    //     const newFields = [...fields];
    //     newFields.splice(index, 1);
    //     setFields(newFields);
    // };


    const color_field_remove = (index) => {
        // console.log(`${`images/${getCurrentDateTime()}/${selectedFile ? selectedFile[index].name : ''}`}`)

        const confirmDelete = window.confirm('Are you sure you want to delete this?');
        if (confirmDelete) {
            const newFields = [...fields];
            const newSelectedFiles = [...selectedFile];

            // Remove the form from the fields state
            newFields.splice(index, 1);

            // Remove the associated file from the selectedFile state
            newSelectedFiles.splice(index, 1);

            setFields(newFields);
            setSelectedFile(newSelectedFiles);

        }

    };



    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        // const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}/${month}/${day}/${hours}/${minutes}`;
    }

    const router = useRouter()

    const color_create = (event) => {

        event.preventDefault();

        const newErrors = new Array(fields.length).fill('');
        const isValid = fields.every((inputValue, index) => {
            if (!inputValue.color_name.trim()) {
                newErrors[index] = 'color Name must be filled.';
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
            if (!inputValue.status_id.trim()) {
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

        const normalizecolorName = (name) => {
            return name?.trim().replace(/\s+/g, '');
        };

        if (fields.length === 1) {
            const newErrorSamecolorName = new Array(fields.length).fill('');
            const isValidsSamecolor = fields.every((inputValue, index) => {
                const isExistingcolor = colors.find(item => normalizecolorName(item.color_name.toLowerCase()) === normalizecolorName(inputValue.color_name.toLowerCase()));
                if (isExistingcolor) {
                    newErrorSamecolorName[index] = 'color name already exists!';
                    return false;
                }
                return true;
            });

            if (!isValidsSamecolor) {
                setSameColorName(newErrorSamecolorName);
                return;
            }
            setSameColorName(new Array(fields.length).fill(''));

        } else if (fields.length > 1) {
            const newErrorSamecolorName = new Array(fields.length).fill('');
            let errorMessageSet = false;

            fields.forEach((inputValue, index) => {
                const isExistingcolor = colors.find(item => normalizecolorName(item.color_name.toLowerCase()) === normalizecolorName(inputValue.color_name.toLowerCase()));
                if (isExistingcolor && !errorMessageSet) {
                    newErrorSamecolorName[index] = 'color name already exists!';
                    errorMessageSet = true;
                }
            });

            setSameColorName(newErrorSamecolorName);
        }

        const normalizedcolorNames = fields.map(inputValue => normalizecolorName(inputValue.color_name.toLowerCase()));
        const uniquecolorNames = Array.from(new Set(normalizedcolorNames));
        const uniqueFields = uniquecolorNames.map(colorName => {
            const index = normalizedcolorNames.indexOf(colorName);
            return fields[index];
        });

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/color/color_create`, {
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
                    router.push('/Admin/color/color_all');
                }
                console.log(data)

            })
            .catch((error) => console.error(error));
    }


    const page_group = localStorage.getItem('pageGroup')
   

    // const color_image_remove = (index) => {
    //     const confirmDelete = window.confirm('Are you sure you want to delete this?');
    //     if (confirmDelete) {
    //         const newSelectedFiles = [...selectedFile];
    //         newSelectedFiles[index] = null;
    //         setSelectedFile(newSelectedFiles);
    //         const filePathToDelete = fields.file_path;
    //         if (filePathToDelete) {
    //             axios.delete(`${process.env.NEXT_PUBLIC_API_URL}:5003/${filePathToDelete}`)
    //                 .then(res => {
    //                     console.log(`File ${filePathToDelete} deleted successfully`);
    //                     setFields(prevData => ({
    //                         ...prevData,
    //                         file_path: '',
    //                     }));
    //                 })
    //                 .catch(err => {
    //                     console.error(`Error deleting file ${filePathToDelete}:`, err);
    //                 });
    //         }
    //     }
    // };

    
    const color_image_remove = (index) => {
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

    const [status, setStatus] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
            .then(res => res.json())
            .then(data => setStatus(data))
    }, [])

    console.log(status)




   
    

    return (
        <div class="container-fluid">
        <div class=" row ">

            <div className='col-12 p-4'>
                <div className='card'>
        <div className="card-default">
            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Color Create </h5>
                <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
                    <Link href={`/Admin/color/color_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to Color List</Link>
                </div>
            </div>



            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
            </div>
            <div className="card-body">
                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={color_create}>
                    <div>
                        <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                            <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
                                <strong>Color</strong>
                            </div>
                            <div className="card-title card-header-color font-weight-bold mb-0 float-right">
                                <div className="input-group">
                                    <input
                                         style={{ width: '80px', marginTop:'1px' }}
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
                                            onClick={color_add_more}
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

                                        <label className='font-weight-bold'>Color Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                        <input
                                            type="text"
                                            required=""
                                            name="color_name"
                                            className="form-control form-control-sm mb-2"
                                            placeholder="Enter Color Name"
                                            value={field.color_name}
                                            onChange={(e) => color_change(index, e)}
                                            maxLength={256}
                                        />
                                        {field.color_name.length > 255 && (
                                            <p className='text-danger'>Brand name cannot more than 255 characters.</p>
                                        )}
                                        {
                                            rowError[index] && <p className='text-danger'>{rowError[index]}</p>
                                        }
                                        {
                                            sameColorName[index] && <p className='text-danger'>{sameColorName}</p>
                                        }

                                    </div>
                                    <div className='col-lg-3 border'>

                                        <label className='font-weight-bold'>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>

                                        <select
                                            required=""
                                            name="status_id"
                                            className="form-control form-control-sm mb-2"
                                            value={field.status_id}
                                            onChange={(e) => color_change(index, e)}
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

                                    <div className='w-lg-25 col-lg-2 border'>
                                        <label className='font-weight-bold'>File</label>
                                        <div>
                                            <span className="btn btn-success btn-sm mb-2">
                                                <label htmlFor={`fileInput${index}`} className='mb-0'><FaUpload></FaUpload> Select Image</label>
                                                <input

                                                    className='mb-0'

                                                    onChange={(e) => color_file_change(index, e)}
                                                    type="file" id={`fileInput${index}`} style={{ display: "none" }}
                                                />
                                            </span>
                                        </div>

                                        {selectedFile[index] ?
                                            <>
                                                <img className="w-100 mb-2 img-thumbnail" onChange={(e) => color_file_change(index, e)} src={URL.createObjectURL(selectedFile[index])} alt="Uploaded File" />

                                                <input type="hidden" name="file_path" value={selectedFile[index].path} />
                                                <button onClick={() => color_image_remove(index)} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
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
                                            onChange={(e) => color_change(index, e)}

                                            // style={{ width: '550px', height: '100px' }}
                                            maxLength={500}
                                        ></textarea>
                                        <small className="text-muted">{field.description.length} / 500</small>
                                    </div>

                                    <div className='col-lg-1 border'>
                                        <label className='font-weight-bold'>Action</label>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm form-control form-control-sm mb-2"
                                            onClick={() => color_field_remove(index)}
                                        >
                                            <FaTrashAlt />
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

export default CreateColor;