'use client'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import '../../../admin_layout/modal/fa.css'


const EditSubCategory = ({ id }) => {

    const { data: sub_category = [], isLoading, refetch } = useQuery({
        queryKey: ['sub_category'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sub_category/sub_category_all`);
            const data = await res.json();
            // Filter out the brand with id 
            const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return filteredBrands;
        }
    });

    console.log(sub_category);


    const [subCategories, setsubCategories] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sub_category/sub_category_all/${id}`)
            .then(Response => Response.json())
            .then(data => setsubCategories(data))
    }, [id])

    console.log(subCategories[0])




    const [subCategoryData, setsubCategoryData] = useState({
        category_id: '',
        sub_category_name: '',
        status_id: '',
        file_path: '',
        description: '',
        modified_by: ''
    });


    const [selectedFile, setSelectedFile] = useState(Array(subCategoryData.length).fill(null));

    // const sub_category_file_change = (e) => {
    //     const files = e.target.files[0];
    //     setSelectedFile(files);
    // };


    const [fileNames, setFileNames] = useState([]);

    let [file_size_error, set_file_size_error] = useState(null);

    const sub_category_file_change = (e) => {
        // e?.preventDefault();
        let files = e.target.files[0];
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const fileName = files.name.split('.')[0]
        const extension = files.name.split('.').pop();
        const newName = `${fileName}.${extension}`;
        const time = `${year}/${month}/${day}/${hours}/${minutes}`;
        const _path = 'sub_category/' + time + '/' + newName;

        const newSelectedFiles = [...selectedFile];
        newSelectedFiles[0] = files; // Assuming you are updating the first element
        newSelectedFiles[0].path = _path;
        // setFileNames(newName);
        // setSelectedFile(newSelectedFiles);
        // upload(files);
        if (Number(files.size) <= 2097152) {
            console.log('checking the file size is okay');
            set_file_size_error("");
            setFileNames(newName);
            setSelectedFile(newSelectedFiles);
            upload(files);
        } else {
            console.log('checking the file size is High');
            set_file_size_error("Max file size 2 MB");
            // newSelectedFiles[index] = null;
            // setSelectedFile(newSelectedFiles);
            // setFileNames(null);
        }
    };

    console.log(fileNames);
    console.log(selectedFile[0]?.path);

    const upload = (file) => {
        const formData = new FormData();
        const extension = file.name.split('.').pop();
        const fileName = file.name.split('.')[0];
        const newName = `${fileName}.${extension}`;
        formData.append('files', file, newName);
        console.log(file);
        setFileNames(newName);

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/sub_category/sub_category_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };

    const modified = localStorage.getItem('userId')


    useEffect(() => {

        setsubCategoryData({
            sub_category_name: subCategories[0]?.sub_category_name || '',
            category_id: subCategories[0]?.category_id || '',
            status_id: subCategories[0]?.status_id || '',
            // file_path: `${`${selectedFile ? `images/${getCurrentDateTime()}/${selectedFile.name}` : subCategories[0]?.file_path}`}`,
            file_path: selectedFile[0]?.path ? selectedFile[0]?.path : subCategories[0]?.file_path,
            description: subCategories[0]?.description || '',
            modified_by: modified
        });
    }, [subCategories, modified, selectedFile]);

    console.log(subCategoryData, selectedFile?.name)
    const [sameSubCategoryName, setSameSubCategoryName] = useState([])
    const [CategoryName, setCategoryName] = useState([])
    const [subCategoryName, setsubCategoryName] = useState('')
    const [error, setError] = useState([]);

    const sub_category_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...subCategoryData }
        attribute[name] = value
        setsubCategoryData(attribute)
        // setSameSubCategoryName('')
        const existingBrand = sub_category?.find((sub_category) => sub_category?.sub_category_name?.toLowerCase() === subCategoryData?.sub_category_name?.toLowerCase());
        if (!existingBrand) {
            // Show error message
            setSameSubCategoryName("");
        }
        const status = attribute['status_id'];
        if (status) {
            setError(""); // Clear the error message
        }
        const subCategoryName = attribute['sub_category_name']
        if (!subCategoryName || subCategoryName === '') {
            setsubCategoryName('Please enter a Sub Category name.');
        } else {
            setsubCategoryName("");
        }
        const CategoryName = attribute['category_id']
        if (!CategoryName || CategoryName === '') {
            setCategoryName('Please enter a Category name.');
        } else {
            setCategoryName("");
        }

    };
    const router = useRouter()
    const sub_category_update = (e) => {
        e.preventDefault()

        if (!subCategoryData.sub_category_name) {
            setBrandName('Please enter a Sub Category name.');
            return; // Prevent further execution
        }
        if (!subCategoryData.status_id) {
            setError('Please select a status.');
            return; // Prevent further execution
        }
        if (!subCategoryData.category_id) {
            setCategoryName('Please enter a Category name.');
            return; // Prevent further execution
        }

        const existingBrand = sub_category.find((sub_categorys) => sub_categorys?.sub_category_name?.toLowerCase() === subCategoryData?.sub_category_name?.toLowerCase());
        if (existingBrand) {
            // Show error message
            setSameSubCategoryName("Sub Category name already exists. Please choose a different Sub Category name.");
        }
        else {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sub_category/sub_category_edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subCategoryData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.affectedRows > 0) {
                        sessionStorage.setItem("message", "Data Update successfully!");
                        router.push('/Admin/sub_category/sub_category_all')

                    }
                    // Handle success or show a success message to the user
                })
                .catch(error => {
                    console.error('Error updating brand:', error);
                    // Handle error or show an error message to the user
                });
        }
    };

    const sub_category_combined_change = (e) => {

        sub_category_input_change(e);
        sub_category_file_change(e);
    };

    // const handleSubmitData = (e) => {
    //     upload(e);
    //     sub_category_update(e);
    // };

    const page_group = localStorage.getItem('pageGroup')

    const sub_category_image_removeFile = () => {
        const confirmRemove = window.confirm('Are you sure you want to remove the image?');
        if (confirmRemove) {
            if (selectedFile[0]) {
                console.log('object')
                // If there's a newly uploaded file, remove it
                setSelectedFile(null);
            } else if (subCategoryData.file_path) {
                // If the image is from the database, set the database value to an empty string
                setsubCategoryData(prevData => ({
                    ...prevData,
                    file_path: '',
                }));
            }
        }
    };

    console.log(subCategoryData.file_path)


    // const sub_category_image_remove = (index) => {
    //     const confirmDelete = window.confirm('Are you sure you want to delete this?');
    //     if (confirmDelete) {
    //         const newSelectedFiles = [...selectedFile];
    //         newSelectedFiles[0] = null;
    //         setSelectedFile(newSelectedFiles);
    //         const filePathToDelete = subCategoryData.file_path;
    //         if (filePathToDelete) {
    //             axios.delete(`http://localhost:5003/${filePathToDelete}`)
    //                 .then(res => {
    //                     console.log(`File ${filePathToDelete} deleted successfully`);
    //                 })
    //                 .catch(err => {
    //                     console.error(`Error deleting file ${filePathToDelete}:`, err);
    //                 });
    //         }
    //     }
    // };

    const sub_category_image_remove = (index) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this?');
        if (confirmDelete) {
            const newSelectedFiles = [...selectedFile];
            newSelectedFiles[0] = null;
            setSelectedFile(newSelectedFiles);
            const filePathToDelete = subCategoryData.file_path;
            if (filePathToDelete) {
                axios.delete(`${process.env.NEXT_PUBLIC_API_URL}:5003/${filePathToDelete}`)
                    .then(res => {
                        console.log(`File ${filePathToDelete} deleted successfully`);
                        // Update subCategoryData to remove the file path
                        setsubCategoryData(prevData => ({
                            ...prevData,
                            file_path: '',
                        }));
                    })
                    .catch(err => {
                        console.error(`Error deleting file ${filePathToDelete}:`, err);
                    });
            }
        }
    };

    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_all`)
            .then(res => res.json())
            .then(data => setCategories(data))
    }, [])
    console.log(categories)


    const [status, setStatus] = useState([]);
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
            .then(res => res.json())
            .then(data => setStatus(data))
    }, [])


    return (
        <div class="container-fluid">
            <div class="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class="body-content bg-light">

                            <div class=" border-primary shadow-sm border-0">
                                <div class="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Update Sub Category</h5>
                                    <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/sub_category/sub_category_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back Sub Category List</Link></div>
                                </div>
                                <form action="" onSubmit={sub_category_update}>

                                    <div class="card-body">
                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Sub Category Image:</strong></label>
                                            <div class="col-md-6">

                                                <div>
                                                    <span class="btn btn-success btn-sm " >
                                                        <label for="fileInput" className='mb-0' ><FaUpload></FaUpload> Select Image </label>
                                                        <input
                                                            // multiple
                                                            name="file_path"
                                                            onChange={sub_category_combined_change}
                                                            type="file" id="fileInput" style={{ display: "none" }} />
                                                    </span>
                                                </div>

                                                {selectedFile[0] ?
                                                    <>
                                                        <img className="w-100 mb-2 img-thumbnail" onChange={(e) => sub_category_file_change(e)} src={URL.createObjectURL(selectedFile[0])} alt="Uploaded File" />

                                                        <input type="hidden" name="file_path" value={selectedFile[0].path} />
                                                        <button onClick={sub_category_image_remove} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                                    </>
                                                    :
                                                    <>
                                                        {
                                                            subCategoryData.file_path ?
                                                                <>

                                                                    <img
                                                                        className="w-100"
                                                                        src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${subCategoryData.file_path}`}
                                                                        alt="Uploaded File"
                                                                    />
                                                                    <button
                                                                        onClick={sub_category_image_remove}
                                                                        type="button"
                                                                        className="btn btn-danger btn-sm position-absolute float-right ml-n4"
                                                                    >
                                                                        <FaTimes />
                                                                    </button>
                                                                </>
                                                                :
                                                                ''
                                                        }
                                                    </>
                                                }
                                                {
                                                    file_size_error && (
                                                        <p className='text-danger'>{file_size_error}</p>
                                                    )
                                                }
                                                {/* {selectedFile ?

                                    <>
                                        <img className="w-100"

                                            src={URL.createObjectURL(selectedFile)}
                                            alt="Uploaded File" />
                                        <button
                                            onClick={sub_category_image_remove}
                                            type="button" class="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                    </>
                                    :
                                    <>
                                        {
                                            subCategoryData.file_path ?
                                                <>

                                                    <img
                                                        className="w-100"
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${subCategoryData.file_path}`}
                                                        alt="Uploaded File"
                                                    />
                                                    <button
                                                        onClick={sub_category_image_removeFile}
                                                        type="button"
                                                        className="btn btn-danger btn-sm position-absolute float-right ml-n4"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                                :
                                                ''
                                        }
                                    </>


                                } */}

                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Category Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                            <div class="col-md-6">
                                                <select
                                                    value={subCategoryData.category_id}
                                                    onChange={sub_category_input_change}
                                                    name='category_id'

                                                    class="form-control form-control-sm " placeholder="Enter Role Name">
                                                    <option value="">Select Category name</option>
                                                    {
                                                        categories.map(category =>
                                                            <>

                                                                <option value={category.id}>{category.category_name}</option>
                                                            </>

                                                        )
                                                    }

                                                </select>
                                                {
                                                    CategoryName && <p className='text-danger'>{CategoryName}</p>
                                                }
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Sub Category Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                            <div class="col-md-6">
                                                <input type="text" name="sub_category_name" defaultValue={subCategoryData.sub_category_name} onChange={sub_category_input_change}
                                                    class="form-control form-control-sm  required "
                                                    placeholder='Sub Category Name'
                                                    maxLength={256}
                                                />
                                                {
                                                    sameSubCategoryName && (
                                                        <p className='text-danger'>{sameSubCategoryName}</p>
                                                    )
                                                }
                                                {
                                                    subCategoryName && (
                                                        <p className='text-danger'>{subCategoryName}</p>
                                                    )
                                                }
                                                {subCategoryData.sub_category_name.length > 255 && (
                                                    <p className='text-danger'>sub Catgeory name cannot more than 255 characters.</p>
                                                )}

                                            </div>
                                        </div>



                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Description:</strong></label>
                                            <div className='form-group col-md-6'>

                                                <textarea
                                                    defaultValue={subCategoryData.description} onChange={sub_category_input_change}
                                                    name="description"
                                                    className="form-control form-control-sm"
                                                    placeholder="Enter description"
                                                    rows={4}
                                                    cols={73}
                                                    // style={{ width: '550px', height: '100px' }}
                                                    maxLength={500}
                                                ></textarea>
                                                <small className="text-muted">{subCategoryData.description.length} / 500</small>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                            <div class="col-md-6">
                                                <select
                                                    value={subCategoryData.status_id} onChange={sub_category_input_change}
                                                    name='status_id'

                                                    class="form-control form-control-sm " placeholder="Enter Role Name">
                                                    <option value=''>Select</option>
                                                    {
                                                        status.map(sta =>
                                                            <>

                                                                <option value={sta.id}>{sta.status_name}</option>
                                                            </>

                                                        )
                                                    }
                                                </select>
                                                {
                                                    error && <p className='text-danger'>{error}</p>
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-3 col-sm-6">

                                                <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
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

export default EditSubCategory;
