'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import '../../../admin_layout/modal/fa.css'

const CopyMaterial = ({ id }) => {


    const { data: materials = [], isLoading, refetch
    } = useQuery({
        queryKey: ['materials'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/material/material_all`)

            const data = await res.json()
            return data
        }
    })



    const [brandSingle, setBrandSingle] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/material/material_all/${id}`)
            .then(Response => Response.json())
            .then(data => setBrandSingle(data))
    }, [id])

    console.log(brandSingle[0])




    const [brandData, setBrandData] = useState({
        material_name: '',
        status_id: '',
        file_path: '',
        description: '',
        modified_by: ''
    });


    const [selectedFile, setSelectedFile] = useState(Array(brandData.length).fill(null));

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


    const [page_group, setPage_group] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pageGroup') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('pageGroup');
            setPage_group(storedUserId);
        }
    }, []);

    const [modified, setUserId] = useState(() => {
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


    useEffect(() => {

        setBrandData({
            material_name: brandSingle[0]?.material_name || '',
            status_id: brandSingle[0]?.status_id || '',
            // file_path: `${`${selectedFile ? `images/${getCurrentDateTime()}/${selectedFile.name}` : brandSingle[0]?.file_path}`}`,
            file_path: selectedFile[0]?.path ? selectedFile[0]?.path : brandSingle[0]?.file_path,
            description: brandSingle[0]?.description || '',
            modified_by: modified
        });
    }, [brandSingle, modified, selectedFile]);

    console.log(brandData, selectedFile?.name)

    const [sameMaterialName, setSameMaterialName] = useState([])
    const [materialName, setmaterialName] = useState('')
    const [error, setError] = useState('')

    const material_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...brandData }
        attribute[name] = value
        setBrandData(attribute)
        // setSameMaterialName('')
        // if (brandData.material_name) {
        //     setmaterialName("")
        // }
        const materialName = attribute['material_name']
        if (!materialName || materialName === '') {
            setmaterialName('Please enter a material name.');
        } else {
            setmaterialName("");
        }
        const existingBrand = materials?.find((material) => material?.material_name?.toLowerCase() === brandData?.material_name?.toLowerCase());
        if (!existingBrand) {
            setSameMaterialName('')
        }
        if (name === "status_id") {
            setError("");
        }

    };


    const router = useRouter()

    const material_copy = (event) => {
        event.preventDefault();
        const form = event.target

        const material_name = form.material_name.value
        const status_id = form.status_id.value
        // const file_path = form.file_path.value || form?.file_path[index]?.value
        const description = form.description.value
        if (!material_name.trim()) {
            // Show error message
            setmaterialName("Material name are required fields.");
            return; // Exit function without submitting the form
        }
        if (!status_id.trim()) {
            // Show error message
            setError("Status is a required field.");
            return; // Exit function without submitting the form
        }

        const normalizebrandName = (name) => {
            return name?.trim().replace(/\s+/g, '');
        };
        // Add your form submission logic here using the 'fields' state.
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/material/material_all`)
            .then((response) => response.json())
            .then((materialData) => {
                // Check if brand_name already exists in materialData
                const existingBrand = materialData.find((material) => normalizebrandName(material.material_name.toLowerCase()) === normalizebrandName(material_name.toLowerCase()));
                if (existingBrand) {
                    // Show error message
                    setSameMaterialName("Material name already exists. Please choose a different Material name.");
                } else {

                    const addValue = {
                        material_name, status_id,
                        // file_path: `${`images/${getCurrentDateTime()}/${selectedFile ? selectedFile.name : brandSingle[0]?.file_path}`}`,

                        file_path: selectedFile[0]?.path ? selectedFile[0]?.path : brandSingle[0]?.file_path,


                        description, created_by: modified
                    }
                    console.log(addValue.file_path)
                    console.log(addValue)
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/material/material_copy`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify(addValue),
                    })
                        .then((Response) => Response.json())
                        .then((data) => {

                            console.log(data);
                            console.log(addValue);
                            if (data.affectedRows > 0) {
                                sessionStorage.setItem("message", "Data Submit successfully!");
                                router.push('/Admin/material/material_all')
                            }
                        })
                        .catch((error) => console.error(error));
                }
            })
            .catch((error) => console.error(error));
    }

    const material_combined_change = (e) => {

        material_input_change(e);
        material_file_change(e);
    };

    // const material_copyData = (e) => {
    //     upload(e);
    //     handleUpdateBrand(e);
    // };




    console.log(brandData.file_path)

    const material_image_remove = (index) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this?');
        if (confirmDelete) {
            const newSelectedFiles = [...selectedFile];
            newSelectedFiles[0] = null;
            setSelectedFile(newSelectedFiles);
            const filePathToDelete = brandData.file_path;
            if (filePathToDelete) {
                axios.delete(`${process.env.NEXT_PUBLIC_API_URL}:5003/${filePathToDelete}`)
                    .then(res => {
                        console.log(`File ${filePathToDelete} deleted successfully`);
                        // Update brandData to remove the file path
                        setBrandData(prevData => ({
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
                        <div class="body-content bg-light">

                            <div class=" border-primary shadow-sm border-0">
                                <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Copy Material</h5>
                                    <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/material/material_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back Material List</Link></div>
                                </div>
                                <form action="" onSubmit={material_copy}>

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
                                                            onChange={material_combined_change}
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
                                                            brandData.file_path ?
                                                                <>

                                                                    <img
                                                                        className="w-100"
                                                                        src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${brandData.file_path}`}
                                                                        alt="No Image Found"
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

                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Material Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                            <div class="col-md-6">
                                                <input type="text" name="material_name" defaultValue={brandData.material_name} onChange={material_input_change}
                                                    class="form-control form-control-sm  required "
                                                    placeholder='Material Name'
                                                    maxLength={256}
                                                />
                                                {
                                                    sameMaterialName && <p className='text-danger'>{sameMaterialName}</p>
                                                }
                                                {
                                                    materialName && <p className='text-danger'>{materialName}</p>
                                                }
                                                {brandData.material_name.length > 255 && (
                                                    <p className='text-danger'>Brand name cannot more than 255 characters.</p>
                                                )}
                                            </div>
                                        </div>



                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Description:</strong></label>
                                            <div className='form-group col-md-6'>
                                                <textarea
                                                    defaultValue={brandData.description} onChange={material_input_change}
                                                    name="description"
                                                    className="form-control form-control-sm"
                                                    placeholder="Enter description"
                                                    rows={4}
                                                    cols={73}
                                                    // style={{ width: '550px', height: '100px' }}
                                                    maxLength={500}
                                                ></textarea>
                                                <small className="text-muted">{brandData.description.length} / 500</small>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                            <div class="col-md-6">
                                                <select
                                                    value={brandData.status_id} onChange={material_input_change}
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

export default CopyMaterial;
