'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import '../../../admin_layout/modal/fa.css'


const EditBrand = ({ id }) => {


    
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



    const { data: brands = [], isLoading, refetch } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/brand/brand_all`);
            const data = await res.json();
            // Filter out the brand with id 
            const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return filteredBrands;
        }
    });

    console.log(brands);

    const [brandSingle, setBrandSingle] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/brand/brand_all/${id}`)
            .then(Response => Response.json())
            .then(data => setBrandSingle(data))
    }, [id])

    console.log(brandSingle[0])




    const [brandData, setBrandData] = useState({
        brand_name: '',
        status_id: '',
        file_path: '',
        description: '',
        modified_by: ''
    });


    const [selectedFile, setSelectedFile] = useState(Array(brandData.length).fill(null));

    // const brand_file_change = (e) => {
    //     const files = e.target.files[0];
    //     setSelectedFile(files);
    // };


    const [fileNames, setFileNames] = useState([]);


    let [file_size_error, set_file_size_error] = useState(null);
    const brand_file_change = (e) => {
        // e?.preventDefault();
        let files = e.target.files[0];
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const fileName = files?.name?.split('.')[0]
        const extension = files?.name?.split('.').pop();
        const newName = `${fileName}.${extension}`;
        const time = `${year}/${month}/${day}/${hours}/${minutes}`;
        const _path = 'brand/' + time + '/' + newName;

        const newSelectedFiles = [...selectedFile];
        newSelectedFiles[0] = files; // Assuming you are updating the first element
        newSelectedFiles[0].path = _path;


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


        // setFileNames(newName);
        // setSelectedFile(newSelectedFiles);
        // upload(files);
    };

    console.log(fileNames);

    const upload = (file) => {
        const formData = new FormData();
        const extension = file.name.split('.').pop();
        const fileName = file.name.split('.')[0];
        const newName = `${fileName}.${extension}`;
        formData.append('files', file, newName);
        console.log(file);
        setFileNames(newName);

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/brand/brand_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };

  


    useEffect(() => {

        setBrandData({
            brand_name: brandSingle[0]?.brand_name || '',
            status_id: brandSingle[0]?.status_id || '',
            // file_path: `${`${selectedFile ? `images/${getCurrentDateTime()}/${selectedFile.name}` : brandSingle[0]?.file_path}`}`,
            file_path: selectedFile[0]?.path ? selectedFile[0]?.path : brandSingle[0]?.file_path,
            description: brandSingle[0]?.description || '',
            modified_by: modified
        });

    }, [brandSingle, modified, selectedFile]);

    console.log(brandData, selectedFile?.name)

    const [sameBrandName, setSameBrandName] = useState([])
    const [brandName, setBrandName] = useState('')
    const [error, setError] = useState([]);

    const brand_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...brandData }
        attribute[name] = value
        setBrandData(attribute)
        // setSameBrandName('')
        const existingBrand = brands.find((brand) => brand?.brand_name?.toLowerCase() === brandData?.brand_name?.toLowerCase());
        if (!existingBrand) {
            // Show error message
            setSameBrandName("");
        }
        const status = attribute['status_id'];
        if (status) {
            setError(""); // Clear the error message
        }
        const brandName = attribute['brand_name']
        if (!brandName || brandName === '') {
            setBrandName('Please enter a brand name.');
        } else {
            setBrandName("");
        }

    };

    const router = useRouter()

    const brand_update = (e) => {
        e.preventDefault()
        if (!brandData.brand_name) {
            setBrandName('Please enter a brand name.');
            return; // Prevent further execution
        }
        if (!brandData.status_id) {
            setError('Please select a status.');
            return; // Prevent further execution
        }

        const existingBrand = brands.find((brand) => brand.brand_name.toLowerCase() === brandData.brand_name.toLowerCase());
        if (existingBrand) {
            // Show error message
            setSameBrandName("Brand name already exists. Please choose a different brand name.");

        }

        else {

            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/brand/brand_edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(brandData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.affectedRows > 0) {
                        sessionStorage.setItem("message", "Data Update successfully!");
                        router.push('/Admin/brand/brand_all')

                    }
                    // Handle success or show a success message to the user
                })
                .catch(error => {
                    console.error('Error updating brand:', error);
                    // Handle error or show an error message to the user
                });
        }

    };

    const brand_combined_change = (e) => {

        brand_input_change(e);
        brand_file_change(e);
    };





    const brand_image_removeFile = () => {
        const confirmRemove = window.confirm('Are you sure you want to remove the image?');
        if (confirmRemove) {
            if (selectedFile[0]) {
                console.log('object')
                // If there's a newly uploaded file, remove it
                setSelectedFile(null);
            } else if (brandData.file_path) {
                // If the image is from the database, set the database value to an empty string
                setBrandData(prevData => ({
                    ...prevData,
                    file_path: '',
                }));
            }
        }
    };

    console.log(brandData.file_path)


    const brand_image_remove = (index) => {
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
        // col-md-12
        // <div class=" body-content bg-light">
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class=" border-primary shadow-sm border-0">
                            <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
                                <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Update Brand</h5>
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                    <Link href={`/Admin/brand/brand_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back Brand List</Link></div>
                            </div>
                            <form action="" onSubmit={brand_update}>

                                <div class="card-body">
                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Brand Image:</strong></label>
                                        <div class="col-md-6">

                                            <div>
                                                <span class="btn btn-success btn-sm " >
                                                    <label for="fileInput" className='mb-0' ><FaUpload></FaUpload><span className='ml-1'>Select Image</span></label>
                                                    <input
                                                        // multiple
                                                        name="file_path"
                                                        onChange={brand_combined_change}
                                                        type="file" id="fileInput" style={{ display: "none" }} />
                                                </span>
                                            </div>

                                            {selectedFile[0] ?
                                                <>
                                                    <img className="w-100 mb-2 img-thumbnail" onChange={(e) => brand_file_change(e)} src={URL.createObjectURL(selectedFile[0])} alt="Uploaded File" />

                                                    <input type="hidden" name="file_path" value={selectedFile[0].path} />
                                                    <button onClick={brand_image_remove} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                                </>
                                                :
                                                <>
                                                    {
                                                        brandData.file_path ?
                                                            <>

                                                                <img
                                                                    className="w-100"
                                                                    src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${brandData.file_path}`}
                                                                    alt="Uploaded File"
                                                                />
                                                                <button
                                                                    onClick={brand_image_remove}
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
                                        <label class="col-form-label col-md-3"><strong>Brand Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="brand_name" defaultValue={brandData.brand_name} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Brand Name'
                                                maxLength={256}
                                            />
                                            {
                                                sameBrandName && (
                                                    <p className='text-danger'>{sameBrandName}</p>
                                                )
                                            }
                                            {
                                                brandName && (
                                                    <p className='text-danger'>{brandName}</p>
                                                )
                                            }
                                            {brandData.brand_name.length > 255 && (
                                                <p className='text-danger'>Brand name cannot more than 255 characters.</p>
                                            )}

                                        </div>
                                    </div>



                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Description:</strong></label>
                                        <div className='form-group col-md-6'>

                                            <textarea
                                                defaultValue={brandData.description} onChange={brand_input_change}
                                                name="description"
                                                className="form-control form-control-sm"
                                                placeholder="Enter description"
                                                rows={5}
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
                                                value={brandData.status_id} onChange={brand_input_change}
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
    );
};

export default EditBrand;
