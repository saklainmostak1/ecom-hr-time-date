
'use client'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import '../../../admin_layout/modal/fa.css'

const EditMaterial = ({ id }) => {


    const { data: material = [], isLoading, refetch } = useQuery({
        queryKey: ['material'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/material/material_all`);
            const data = await res.json();
            // Filter out the brand with id 
            const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return filteredBrands;
        }
    });

    console.log(material);


    const [materials, setmaterials] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/material/material_all/${id}`)
            .then(Response => Response.json())
            .then(data => setmaterials(data))
    }, [id])

    console.log(materials[0])

    const [materialData, setmaterialData] = useState({
        material_name: '',
        status_id: '',
        file_path: '',
        description: '',
        modified_by: ''
    });


    const [selectedFile, setSelectedFile] = useState(Array(materialData.length).fill(null));

    // const material_file_change = (e) => {
    //     const files = e.target.files[0];
    //     setSelectedFile(files);
    // };


    const [fileNames, setFileNames] = useState([]);
    let [file_size_error, set_file_size_error] = useState(null);

    const material_file_change = (e) => {
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
        const _path = 'material/' + time + '/' + newName;

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

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/material/material_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };

    const modified = localStorage.getItem('userId')


    useEffect(() => {

        setmaterialData({
            material_name: materials[0]?.material_name || '',
            status_id: materials[0]?.status_id || '',
            // file_path: `${`${selectedFile ? `images/${getCurrentDateTime()}/${selectedFile.name}` : materials[0]?.file_path}`}`,
            file_path: selectedFile[0]?.path ? selectedFile[0]?.path : materials[0]?.file_path,
            description: materials[0]?.description || '',
            modified_by: modified
        });
    }, [materials, modified, selectedFile]);

    console.log(materialData, selectedFile?.name)
    const [sameMaterialName, setSameMaterialName] = useState([])
    const [materialName, setmaterialName] = useState('')
    const [error, setError] = useState([]);

    const material_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...materialData }
        attribute[name] = value
        setmaterialData(attribute)
        // setSameMaterialName('')
        const existingBrand = material.find((material) => material?.material_name?.toLowerCase() === materialData?.material_name?.toLowerCase());
        if (!existingBrand) {
            // Show error message
            setSameMaterialName("");
        }
        const status = attribute['status_id'];
        if (status) {
            setError(""); // Clear the error message
        }
        const materialName = attribute['material_name']
        if (!materialName || materialName === '') {
            setmaterialName('Please enter a Material name.');
        } else {
            setmaterialName("");
        }

    };

    const router = useRouter()

    const material_update = (e) => {
        e.preventDefault()

        if (!materialData.material_name) {
            setmaterialName('Please enter a material name.');
            return; // Prevent further execution
        }
        if (!materialData.status_id) {
            setError('Please select a status.');
            return; // Prevent further execution
        }

        const existingBrand = material.find((materials) => materials?.material_name?.toLowerCase() === materialData?.material_name?.toLowerCase());
        if (existingBrand) {
            // Show error message
            setSameMaterialName("Material name already exists. Please choose a different Material name.");
        }
        else {

            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/material/material_edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(materialData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.affectedRows > 0) {
                        sessionStorage.setItem("message", "Data Update successfully!");
                        router.push('/Admin/material/material_all')

                    }
                    // Handle success or show a success message to the user
                })
                .catch(error => {
                    console.error('Error updating brand:', error);
                    // Handle error or show an error message to the user
                });
        }
    };

    const handleCombinedChange = (e) => {

        material_input_change(e);
        material_file_change(e);
    };

    // const handleSubmitData = (e) => {
    //     upload(e);
    //     material_update(e);
    // };

    const page_group = localStorage.getItem('pageGroup')

    const material_image_removeFile = () => {
        const confirmRemove = window.confirm('Are you sure you want to remove the image?');
        if (confirmRemove) {
            if (selectedFile[0]) {
                console.log('object')
                // If there's a newly uploaded file, remove it
                setSelectedFile(null);
            } else if (materialData.file_path) {
                // If the image is from the database, set the database value to an empty string
                setmaterialData(prevData => ({
                    ...prevData,
                    file_path: '',
                }));
            }
        }
    };

    console.log(materialData.file_path)


    // const material_image_remove = (index) => {
    //     const confirmDelete = window.confirm('Are you sure you want to delete this?');
    //     if (confirmDelete) {
    //         const newSelectedFiles = [...selectedFile];
    //         newSelectedFiles[0] = null;
    //         setSelectedFile(newSelectedFiles);
    //         const filePathToDelete = materialData.file_path;
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

    const material_image_remove = (index) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this?');
        if (confirmDelete) {
            const newSelectedFiles = [...selectedFile];
            newSelectedFiles[0] = null;
            setSelectedFile(newSelectedFiles);
            const filePathToDelete = materialData.file_path;
            if (filePathToDelete) {
                axios.delete(`${process.env.NEXT_PUBLIC_API_URL}:5003/${filePathToDelete}`)
                    .then(res => {
                        console.log(`File ${filePathToDelete} deleted successfully`);
                        // Update materialData to remove the file path
                        setmaterialData(prevData => ({
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
                                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Update Material</h5>
                                    <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/material/material_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back Material List</Link></div>
                                </div>
                                <form action="" onSubmit={material_update}>

                                    <div class="card-body">
                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Material Image:</strong></label>
                                            <div class="col-md-6">

                                                <div>
                                                    <span class="btn btn-success btn-sm " >
                                                        <label for="fileInput" className='mb-0' ><FaUpload></FaUpload> Select Image </label>
                                                        <input
                                                            // multiple
                                                            name="file_path"
                                                            onChange={handleCombinedChange}
                                                            type="file" id="fileInput" style={{ display: "none" }} />
                                                    </span>
                                                </div>

                                                {selectedFile[0] ?
                                                    <>
                                                        <img className="w-100 mb-2 img-thumbnail" onChange={(e) => material_file_change(e)} src={URL.createObjectURL(selectedFile[0])} alt="Uploaded File" />

                                                        <input type="hidden" name="file_path" value={selectedFile[0].path} />
                                                        <button onClick={material_image_remove} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                                    </>
                                                    :
                                                    <>
                                                        {
                                                            materialData.file_path ?
                                                                <>

                                                                    <img
                                                                        className="w-100"
                                                                        src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${materialData.file_path}`}
                                                                        alt="Uploaded File"
                                                                    />
                                                                    <button
                                                                        onClick={material_image_remove}
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
                                            onClick={material_image_remove}
                                            type="button" class="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                    </>
                                    :
                                    <>
                                        {
                                            materialData.file_path ?
                                                <>

                                                    <img
                                                        className="w-100"
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${materialData.file_path}`}
                                                        alt="Uploaded File"
                                                    />
                                                    <button
                                                        onClick={material_image_removeFile}
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
                                            <label class="col-form-label col-md-3"><strong>Material Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                            <div class="col-md-6">
                                                <input type="text" name="material_name" defaultValue={materialData.material_name} onChange={material_input_change}
                                                    class="form-control form-control-sm  required "
                                                    placeholder='Material Name'
                                                    maxLength={256}
                                                />
                                                {
                                                    sameMaterialName && (
                                                        <p className='text-danger'>{sameMaterialName}</p>
                                                    )
                                                }
                                                {
                                                    materialName && (
                                                        <p className='text-danger'>{materialName}</p>
                                                    )
                                                }
                                                {materialData.material_name.length > 255 && (
                                                    <p className='text-danger'>material name cannot more than 255 characters.</p>
                                                )}

                                            </div>
                                        </div>



                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Description:</strong></label>
                                            <div className='form-group col-md-6'>

                                                <textarea
                                                    defaultValue={materialData.description} onChange={material_input_change}
                                                    name="description"
                                                    className="form-control form-control-sm"
                                                    placeholder="Enter description"
                                                    rows={4}
                                                    cols={73}
                                                    // style={{ width: '550px', height: '100px' }}
                                                    maxLength={500}
                                                ></textarea>
                                                <small className="text-muted">{materialData.description.length} / 500</small>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                            <div class="col-md-6">
                                                <select
                                                    value={materialData.status_id} onChange={material_input_change}
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

export default EditMaterial;
