'use client' 
 //ismile
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../../admin_layout/modal/fa.css'
import { FaDownload, FaTimes, FaUpload } from 'react-icons/fa';

import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
const ExcelJS = require('exceljs');

const CreateSubCategory = () => {

    const created = localStorage.getItem('userId');

    const { data: subCategorys = [], isLoading, refetch
    } = useQuery({
        queryKey: ['subCategorys'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sub_category/sub_category_all`)
            const data = await res.json()
            return data
        }
    })

    console.log(subCategorys)

    const [numToAdd, setNumToAdd] = useState(1);
    const [fields, setFields] = useState([{ category_id: '', sub_category_name: '', status_id: '', file_path: '', description: '', created_by: created }]);


    const [selectedFile, setSelectedFile] = useState(Array(fields.length).fill(null));

    const [fileNames, setFileNames] = useState([])


    const [rowError, setRowErrors] = useState([]);
    const [error, setError] = useState([]);
    const [file_size_error, set_file_size_error] = useState(null);
    const [filePathError, setFilePathError] = useState([])
    const [sameSubCategoryName, setSameSubCategoryName] = useState([])

    const sub_category_file_change = (index, e) => {

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
        const _path = 'sub_category/' + time + '/' + newName;
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

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/sub_category/sub_category_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };


    const sub_category_change = (index, event) => {
        const newFields = [...fields];
        if (event.target.type === 'file') {
            newFields[index][event.target.name] = event.target.files[0];
        } else {
            newFields[index][event.target.name] = event.target.value;
        }
        const brandName = newFields[index]['sub_category_name'];
        if (brandName) {
            setRowErrors(""); // Clear the error message

        }
        const brandNames = newFields[index]['category_id'];
        if (brandNames) {
            setBrandName(""); // Clear the error message

        }
        const status = newFields[index]['status_id'];
        if (status) {
            setError(""); // Clear the error message
        }
        const matchingBrand = subCategorys.find(item => item.sub_category_name.toLowerCase() === brandName.toLowerCase());
        if (!matchingBrand) {
            setSameSubCategoryName('');
            // You can also set an error state to show the message in the UI instead of using alert
        }
        // else {
        //     setSameSubCategoryName("")
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

    const sub_category_add_more = () => {
        const numToAddInt = parseInt(numToAdd);
        if (!isNaN(numToAddInt) && numToAddInt > 0) {
            const newInputValues = [...fields];
            for (let i = 0; i < numToAddInt; i++) {
                newInputValues.push({
                    category_id: '',
                    sub_category_name: '',
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

    const sub_category_remove_field = (index) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };



    const router = useRouter()

    const [brandName, setBrandName] = useState([])


    const sub_category_create = (event) => {

        event.preventDefault();

        const newErrorss = new Array(fields.length).fill('');
        const isValidss = fields.every((inputValue, index) => {
            if (!inputValue.category_id.trim()) {
                newErrorss[index] = 'Category Name must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidss) {
            setBrandName(newErrorss);
            return;
        }
        setBrandName(new Array(fields.length).fill(''));

        const newErrors = new Array(fields.length).fill('');
        const isValid = fields.every((inputValue, index) => {
            if (!inputValue.sub_category_name.trim()) {
                newErrors[index] = 'sub category Name must be filled.';
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

        const normalizesub_categoryName = (name) => {
            return name?.trim().replace(/\s+/g, '');
        };

        if (fields.length === 1) {
            const newErrorSamesub_categoryName = new Array(fields.length).fill('');
            const isValidsSamesub_category = fields.every((inputValue, index) => {
                const isExistingsub_category = subCategorys.find(item => normalizesub_categoryName(item.sub_category_name.toLowerCase()) === normalizesub_categoryName(inputValue.sub_category_name.toLowerCase()));
                if (isExistingsub_category) {
                    newErrorSamesub_categoryName[index] = 'sub category name already exists!';
                    return false;
                }
                return true;
            });

            if (!isValidsSamesub_category) {
                setSameSubCategoryName(newErrorSamesub_categoryName);
                return;
            }
            setSameSubCategoryName(new Array(fields.length).fill(''));
        } else if (fields.length > 1) {
            const newErrorSamesub_categoryName = new Array(fields.length).fill('');
            let errorMessageSet = false;

            fields.forEach((inputValue, index) => {
                const isExistingsub_category = subCategorys.find(item => normalizesub_categoryName(item.sub_category_name.toLowerCase()) === normalizesub_categoryName(inputValue.sub_category_name.toLowerCase()));
                if (isExistingsub_category && !errorMessageSet) {
                    newErrorSamesub_categoryName[index] = 'sub category name already exists!';
                    errorMessageSet = true;
                }
            });

            setSameSubCategoryName(newErrorSamesub_categoryName);
        }

        const normalizedsub_categoryNames = fields.map(inputValue => normalizesub_categoryName(inputValue.sub_category_name.toLowerCase()));
        const uniquesub_categoryNames = Array.from(new Set(normalizedsub_categoryNames));
        const uniqueFields = uniquesub_categoryNames.map(sub_categoryName => {
            const index = normalizedsub_categoryNames.indexOf(sub_categoryName);
            return fields[index];
        });

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sub_category/sub_category_create`, {
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
                    router.push('/Admin/sub_category/sub_category_all');
                }
                console.log(data)
            })
            .catch((error) => console.error(error));
    }


    const page_group = localStorage.getItem('pageGroup')
    // const sub_category_image_remove = (index) => {
    //     const confirmDelete = window.confirm('Are you sure you want to delete this?');
    //     if (confirmDelete) {
    //         const newSelectedFiles = [...selectedFile];
    //         newSelectedFiles[index] = null;
    //         setSelectedFile(newSelectedFiles);
    //     }
    // };

    const sub_category_image_remove = (index) => {
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


    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_all`)
            .then(res => res.json())
            .then(data => setCategories(data))
    }, [])
    console.log(categories)

    return (
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-sub_category font-weight-bold mb-0  float-left mt-1">Sub Category Create </h5>
                                <div className="card-title card-header-sub_category font-weight-bold mb-0  float-right ">
                                    <Link href="/Admin/sub_category/sub_category_all" className="btn btn-sm btn-info">Back to Sub Category List</Link>
                                </div>
                            </div>

                


                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={sub_category_create}>
                                    <div>
                                        <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                                            <div className="card-title card-header-sub_category font-weight-bold mb-0 float-left mt-1">
                                                <strong>Sub Category</strong>
                                            </div>
                                            <div className="card-title card-header-sub_category font-weight-bold mb-0 float-right">
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
                                                            onClick={sub_category_add_more}
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
                                                    <div className='col-lg-2 border'>

                                                        <label className='font-weight-bold'>Category Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>

                                                        <select
                                                            required=""
                                                            name="category_id"
                                                            className="form-control form-control-sm mb-2"
                                                            value={field.category_id}
                                                            onChange={(e) => sub_category_change(index, e)}
                                                        >
                                                            <option value="">Select Status</option>
                                                            {
                                                                categories.map(category =>
                                                                    <>

                                                                        <option value={category.id}>{category.category_name}</option>
                                                                    </>

                                                                )
                                                            }


                                                            {/* <option value="2">Inactive</option> */}
                                                        </select>
                                                        {
                                                            brandName[index] && <p className='text-danger'>{brandName[index]}</p>
                                                        }
                                                    </div>
                                                    <div className='col-lg-2  border '>

                                                        <label className='font-weight-bold'>Sub Category Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <input
                                                            type="text"
                                                            required=""
                                                            name="sub_category_name"
                                                            className="form-control form-control-sm mb-2"
                                                            placeholder="Enter Sub Category Name"
                                                            value={field.sub_category_name}
                                                            onChange={(e) => sub_category_change(index, e)}
                                                            maxLength={256}
                                                        />
                                                        {/* <small className="text-muted">{field.brand_name.length} / 255</small> */}
                                                        {field.sub_category_name.length > 255 && (
                                                            <p className='text-danger'>Sub Category name cannot more than 255 characters.</p>
                                                        )}
                                                        {
                                                            rowError[index] && <p className='text-danger'>{rowError[index]}</p>
                                                        }
                                                        {
                                                            sameSubCategoryName[index] && <p className='text-danger'>{sameSubCategoryName}</p>
                                                        }
                                                    </div>
                                                    <div className='col-lg-2 border'>

                                                        <label className='font-weight-bold'>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>

                                                        <select
                                                            required=""
                                                            name="status_id"
                                                            className="form-control form-control-sm mb-2"
                                                            value={field.status_id}
                                                            onChange={(e) => sub_category_change(index, e)}
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
                        onChange={sub_category_createData}
                        type="file" id="fileInput" style={{ display: "none" }} />
                </span>
  
            </div>

            {selectedFile ?

                <>
                    <img className="w-100 mb-2"

                        src={URL.createObjectURL(selectedFile)}
                        alt="Uploaded File" />
                    <button
                        onClick={sub_category_image_remove}
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
                                                                <label htmlFor={`fileInput${index}`} className='mb-0'><FaUpload></FaUpload> Select Image </label>
                                                                <input

                                                                    className='mb-0'

                                                                    onChange={(e) => sub_category_file_change(index, e)}
                                                                    type="file" id={`fileInput${index}`} style={{ display: "none" }}
                                                                />
                                                            </span>
                                                        </div>

                                                        {selectedFile[index] ?
                                                            <>
                                                                <img className="w-100 mb-2 img-thumbnail" onChange={(e) => sub_category_file_change(index, e)} src={URL.createObjectURL(selectedFile[index])} alt="Uploaded File" />

                                                                <input type="hidden" name="file_path" value={selectedFile[index].path} />
                                                                <button onClick={() => sub_category_image_remove(index)} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
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
                                                            onChange={(e) => sub_category_change(index, e)}

                                                            maxLength={500}
                                                        ></textarea>
                                                        <small className="text-muted">{field.description.length} / 500</small>
                                                    </div>

                                                    <div className='col-lg-1 border'>
                                                        <label className='font-weight-bold'>Action</label>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm form-control form-control-sm mb-2"
                                                            onClick={() => sub_category_remove_field(index)}
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

export default CreateSubCategory;