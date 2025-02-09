
'use client'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import '../../../admin_layout/modal/fa.css'

const EditModel = ({ id }) => {



    const { data: model = [], isLoading, refetch } = useQuery({
        queryKey: ['model'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/model/model_all`);
            const data = await res.json();
            // Filter out the brand with id 
            const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return filteredBrands;
        }
    });

    console.log(model);

    const [brand, setBrand] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/brand/brand_all`)
            .then(res => res.json())
            .then(data => setBrand(data))
    }, [])


    const [models, setmodels] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/model/model_all/${id}`)
            .then(Response => Response.json())
            .then(data => setmodels(data))
    }, [id])

    console.log(models[0])




    const [modelData, setmodelData] = useState({
        brand_id: '',
        model_name: '',
        status_id: '',
        file_path: '',
        description: '',
        modified_by: ''
    });


    const [selectedFile, setSelectedFile] = useState(Array(modelData.length).fill(null));

    // const model_file_change = (e) => {
    //     const files = e.target.files[0];
    //     setSelectedFile(files);
    // };


    const [fileNames, setFileNames] = useState([]);
    let [file_size_error, set_file_size_error] = useState(null);

    const model_file_change = (e) => {
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
        const _path = 'model/' + time + '/' + newName;

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

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/model/model_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };

    const modified = localStorage.getItem('userId')


    useEffect(() => {

        setmodelData({
            model_name: models[0]?.model_name || '',
            brand_id: models[0]?.brand_id || '',
            status_id: models[0]?.status_id || '',
            // file_path: `${`${selectedFile ? `images/${getCurrentDateTime()}/${selectedFile.name}` : models[0]?.file_path}`}`,
            file_path: selectedFile[0]?.path ? selectedFile[0]?.path : models[0]?.file_path,
            description: models[0]?.description || '',
            modified_by: modified
        });
    }, [models, modified, selectedFile]);

    console.log(modelData, selectedFile?.name)
    const [sameModelName, setSameModelName] = useState([])
    const [brandName, setbrandName] = useState([])
    const [modelName, setmodelName] = useState('')
    const [error, setError] = useState([]);

    const model_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...modelData }
        attribute[name] = value
        setmodelData(attribute)
        // setSameModelName('')
        const existingBrand = model?.find((model) => model?.model_name?.toLowerCase() === modelData?.model_name?.toLowerCase());
        if (!existingBrand) {
            // Show error message
            setSameModelName("");
        }
        const status = attribute['status_id'];
        if (status) {
            setError(""); // Clear the error message
        }
        const modelName = attribute['model_name']
        if (!modelName || modelName === '') {
            setmodelName('Please enter a model name.');
        } else {
            setmodelName("");
        }
        const brandName = attribute['brand_id']
        if (!brandName || brandName === '') {
            setbrandName('Please enter a Brand name.');
        } else {
            setbrandName("");
        }

    };
    const router = useRouter()
    const model_update = (e) => {
        e.preventDefault()

        if (!modelData.model_name) {
            setmodelName('Please enter a model name.');
            return; // Prevent further execution
        }
        if (!modelData.status_id) {
            setError('Please select a status.');
            return; // Prevent further execution
        }
        if (!modelData.brand_id) {
            setbrandName('Please enter a Brand name.');
            return; // Prevent further execution
        }

        const existingBrand = model.find((models) => models?.model_name?.toLowerCase() === modelData?.model_name?.toLowerCase());
        if (existingBrand) {
            // Show error message
            setSameModelName("Model name already exists. Please choose a different Model name.");
        }
        else {

            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/model/model_edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(modelData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.affectedRows > 0) {
                        sessionStorage.setItem("message", "Data Update successfully!");
                        router.push('/Admin/model/model_all')

                    }
                    // Handle success or show a success message to the user
                })
                .catch(error => {
                    console.error('Error updating brand:', error);
                    // Handle error or show an error message to the user
                });
        }
    };

    const model_combined_change = (e) => {

        model_input_change(e);
        model_file_change(e);
    };

    // const handleSubmitData = (e) => {
    //     upload(e);
    //     model_update(e);
    // };

    const page_group = localStorage.getItem('pageGroup')

    const model_image_removeFile = () => {
        const confirmRemove = window.confirm('Are you sure you want to remove the image?');
        if (confirmRemove) {
            if (selectedFile[0]) {
                console.log('object')
                // If there's a newly uploaded file, remove it
                setSelectedFile(null);
            } else if (modelData.file_path) {
                // If the image is from the database, set the database value to an empty string
                setmodelData(prevData => ({
                    ...prevData,
                    file_path: '',
                }));
            }
        }
    };

    console.log(modelData.file_path)


    // const model_image_remove = (index) => {
    //     const confirmDelete = window.confirm('Are you sure you want to delete this?');
    //     if (confirmDelete) {
    //         const newSelectedFiles = [...selectedFile];
    //         newSelectedFiles[0] = null;
    //         setSelectedFile(newSelectedFiles);
    //         const filePathToDelete = modelData.file_path;
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

    const model_image_remove = (index) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this?');
        if (confirmDelete) {
            const newSelectedFiles = [...selectedFile];
            newSelectedFiles[0] = null;
            setSelectedFile(newSelectedFiles);
            const filePathToDelete = modelData.file_path;
            if (filePathToDelete) {
                axios.delete(`${process.env.NEXT_PUBLIC_API_URL}:5003/${filePathToDelete}`)
                    .then(res => {
                        console.log(`File ${filePathToDelete} deleted successfully`);
                        // Update modelData to remove the file path
                        setmodelData(prevData => ({
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
                        <div class=" body-content bg-light">

                            <div class=" border-primary shadow-sm border-0">
                                <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Update Model</h5>
                                    <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/model/model_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back Model List</Link></div>
                                </div>
                                <form action="" onSubmit={model_update}>

                                    <div class="card-body">
                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Model Image:</strong></label>
                                            <div class="col-md-6">

                                                <div>
                                                    <span class="btn btn-success btn-sm " >
                                                        <label for="fileInput" className='mb-0' ><FaUpload></FaUpload> Select Image </label>
                                                        <input
                                                            // multiple
                                                            name="file_path"
                                                            onChange={model_combined_change}
                                                            type="file" id="fileInput" style={{ display: "none" }} />
                                                    </span>
                                                </div>

                                                {selectedFile[0] ?
                                                    <>
                                                        <img className="w-100 mb-2 img-thumbnail" onChange={(e) => model_file_change(e)} src={URL.createObjectURL(selectedFile[0])} alt="Uploaded File" />

                                                        <input type="hidden" name="file_path" value={selectedFile[0].path} />
                                                        <button onClick={model_image_remove} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                                    </>
                                                    :
                                                    <>
                                                        {
                                                            modelData.file_path ?
                                                                <>

                                                                    <img
                                                                        className="w-100"
                                                                        src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${modelData.file_path}`}
                                                                        alt="Uploaded File"
                                                                    />
                                                                    <button
                                                                        onClick={model_image_remove}
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
                                            onClick={model_image_remove}
                                            type="button" class="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                    </>
                                    :
                                    <>
                                        {
                                            modelData.file_path ?
                                                <>

                                                    <img
                                                        className="w-100"
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${modelData.file_path}`}
                                                        alt="Uploaded File"
                                                    />
                                                    <button
                                                        onClick={model_image_removeFile}
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
                                            <label class="col-form-label col-md-3"><strong>Brand Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                            <div class="col-md-6">
                                                <select
                                                    value={modelData.brand_id}
                                                    onChange={model_input_change}
                                                    name='brand_id'

                                                    class="form-control form-control-sm " placeholder="Enter Role Name">
                                                    <option value="">Select Brand name</option>
                                                    {
                                                        brand.map(sta =>
                                                            <>

                                                                <option value={sta.id}>{sta.brand_name}</option>
                                                            </>

                                                        )
                                                    }
                                                </select>
                                                {
                                                    brandName && <p className='text-danger'>{brandName}</p>
                                                }
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Model Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                            <div class="col-md-6">
                                                <input type="text" name="model_name" defaultValue={modelData.model_name} onChange={model_input_change}
                                                    class="form-control form-control-sm  required "
                                                    placeholder='Model Name'
                                                    maxLength={256}
                                                />
                                                {
                                                    sameModelName && (
                                                        <p className='text-danger'>{sameModelName}</p>
                                                    )
                                                }
                                                {
                                                    modelName && (
                                                        <p className='text-danger'>{modelName}</p>
                                                    )
                                                }
                                                {modelData.model_name.length > 255 && (
                                                    <p className='text-danger'>Model name cannot more than 255 characters.</p>
                                                )}

                                            </div>
                                        </div>



                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Description:</strong></label>
                                            <div className='form-group col-md-6'>
                                                <textarea
                                                    defaultValue={modelData.description} onChange={model_input_change}
                                                    name="description"
                                                    className="form-control form-control-sm"
                                                    placeholder="Enter description"
                                                    rows={4}
                                                    cols={73}
                                                    // style={{ width: '550px', height: '100px' }}
                                                    maxLength={500}
                                                ></textarea>
                                                <small className="text-muted">{modelData.description.length} / 500</small>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                            <div class="col-md-6">
                                                <select
                                                    value={modelData.status_id} onChange={model_input_change}
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

export default EditModel;
