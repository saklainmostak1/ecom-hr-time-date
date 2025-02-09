

'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import '../../../admin_layout/modal/fa.css'

const CopyBrand = ({ id }) => {
    

    const { data: brands = [], isLoading, refetch
    } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/brand/brand_all`)

            const data = await res.json()
            return data
        }
    })

    // console.log(brands)

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

    console.log(brandData.brand_name)
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

    const modified = localStorage.getItem('userId')

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
    const [BrandName, setBrandName] = useState('')
    const [error, setError] = useState('')
    const brand_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...brandData }
        attribute[name] = value
        setBrandData(attribute)

        // if (brandData.brand_name) {
        //     setBrandName("")
        // }
        const brandName = attribute['brand_name']
        if (!brandName || brandName === '') {
            setBrandName('Please enter a brand name.');
        } else {
            setBrandName("");
        }

        const existingBrand = brands?.find((brand) => brand?.brand_name?.toLowerCase() === brandData?.brand_name?.toLowerCase());
        if (!existingBrand) {
            setSameBrandName('')
        }
        if (name === "status_id") {
            setError("");
        }


    };

    const created = localStorage.getItem('userId')


    const router = useRouter()
    const brand_copy = (event) => {
        event.preventDefault();

        const form = event.target;
        const brand_name = form.brand_name.value;
        const status_id = form.status_id.value;
        const description = form.description.value;
        if (!brand_name.trim()) {
            // Show error message
            setBrandName("Please enter a brand name.");
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
        // Fetch existing brand data from API
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/brand/brand_all`)
            .then((response) => response.json())
            .then((brandData) => {
                // Check if brand_name already exists in brandData
                const existingBrand = brandData.find((brand) => normalizebrandName(brand.brand_name.toLowerCase()) === normalizebrandName(brand_name.toLowerCase()));
                if (existingBrand) {
                    // Show error message
                    setSameBrandName("Brand name already exists. Please choose a different brand name.");
                } else {
                    // If brand_name doesn't exist, proceed with form submission
                    const addValue = {
                        brand_name,
                        status_id,
                        file_path: selectedFile[0]?.path ? selectedFile[0]?.path : brandSingle[0]?.file_path,
                        description,
                        created_by: created
                    };
                    console.log(addValue.file_path);
                    console.log(addValue);
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/brand/brand_copy`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify(addValue),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log(data);
                            console.log(addValue);
                            if (data.affectedRows > 0) {
                                sessionStorage.setItem("message", "Data Submit successfully!");
                                router.push('/Admin/brand/brand_all')

                            }
                        })
                        .catch((error) => console.error(error));
                }
            })
            .catch((error) => console.error(error));
    };

    const brand_combined_change = (e) => {

        brand_input_change(e);
        brand_file_change(e);
    };

    // const brand_copyData = (e) => {
    //     upload(e);
    //     handleUpdateBrand(e);
    // };

    const page_group = localStorage.getItem('pageGroup')


    console.log(brandData.file_path)

    const brand_remove_image = (index) => {
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
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        {/* <div class=" body-content "> */}

                            <div class=" border-primary shadow-sm border-0">
                                <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Copy Brand</h5>
                                    <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/brand/brand_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back Brand List</Link></div>
                                </div>
                                <form action="" onSubmit={brand_copy}>

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
                                                        <button onClick={brand_remove_image} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" >
                                                            <FaTimes></FaTimes>
                                                        </button>
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
                                                                        onClick={brand_remove_image}
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
                                                    sameBrandName && <p className='text-danger'>{sameBrandName}</p>
                                                }
                                                {
                                                    BrandName && <p className='text-danger'>{BrandName}</p>
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
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CopyBrand;



// const brand_file_change = (e) => {
//     // e?.preventDefault();
//     let files = e.target.files[0];
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const day = String(now.getDate()).padStart(2, '0');
//     const hours = String(now.getHours()).padStart(2, '0');
//     const minutes = String(now.getMinutes()).padStart(2, '0');

//     const fileName = files.name.split('.')[0]
//     const extension = files.name.split('.').pop();
//     const newName = `${fileName}.${extension}`;
//     const time = `${year}/${month}/${day}/${hours}/${minutes}`;
//     const _path = 'images/' + time + '/' + newName;

//     const newSelectedFiles = [...selectedFile];
//     newSelectedFiles[0] = files; // Assuming you are updating the first element
//     newSelectedFiles[0].path = _path;
//     setFileNames(newName);
//     setSelectedFile(newSelectedFiles);
//     upload(files);
// };

// console.log(fileNames);
// console.log(selectedFile[0]?.path);

// const brand_copy = (event) => {
//     event.preventDefault();


//     const form = event.target

//     const brand_name = form.brand_name.value
//     const status_id = form.status_id.value
//     // const file_path = form.file_path.value || form?.file_path[index]?.value
//     const description = form.description.value

//     // Add your form submission logic here using the 'fields' state.

//     const addValue = {
//         brand_name, status_id,
//         // file_path: `${`images/${getCurrentDateTime()}/${selectedFile ? selectedFile.name : brandSingle[0]?.file_path}`}`,

//         file_path: selectedFile[0]?.path ? selectedFile[0]?.path : brandSingle[0]?.file_path,


//         description, created_by: created
//     }
//     console.log(addValue.file_path)
//     console.log(addValue)
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/brand/brand_create`, {
//         method: 'POST',
//         headers: {
//             'content-type': 'application/json',
//         },
//         body: JSON.stringify(addValue),
//     })
//         .then((Response) => Response.json())
//         .then((data) => {

//             console.log(data);
//             console.log(addValue);
//         })
//         .catch((error) => console.error(error));
// }
