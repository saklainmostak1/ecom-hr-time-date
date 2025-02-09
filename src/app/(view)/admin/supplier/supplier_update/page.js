'use client'
//ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';


const SupplierUpdate = ({ id }) => {



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



    const [assetTypeName, setAssetType] = useState({
        name: '',
        email: '',
        mobile: '',
        address: '',
        trade_license: '',
        vat: '',
        tin: '',
        status_id: '',
        img: '',
        description: '',
        modified_by: created
    });


    const [selectedFile, setSelectedFile] = useState(Array(assetTypeName.length).fill(null));

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
        const _path = 'asset_info/' + time + '/' + newName;

        const newSelectedFiles = [...selectedFile];
        newSelectedFiles[0] = files; // Assuming you are updating the first element
        newSelectedFiles[0].path = _path;


        if (Number(files.size) <= 2097152) {
            console.log('checking the file size is okay');
            set_file_size_error("");
            setFileNames(newName);
            setSelectedFile(newSelectedFiles);
            setAssetType((prevAssetInfo) => ({
                ...prevAssetInfo,
                img: newSelectedFiles[0]?.path
            }));
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
    const brand_image_remove = (index) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this?');
        if (confirmDelete) {
            const newSelectedFiles = [...selectedFile];
            newSelectedFiles[0] = null;
            setSelectedFile(newSelectedFiles);
            const filePathToDelete = assetTypeName.img;
            if (filePathToDelete) {
                axios.delete(`${process.env.NEXT_PUBLIC_API_URL}:5003/${filePathToDelete}`)
                    .then(res => {
                        console.log(`File ${filePathToDelete} deleted successfully`);
                        // Update assetInfo to remove the file path
                        setAssetType(prevData => ({
                            ...prevData,
                            img: '',
                        }));
                    })
                    .catch(err => {
                        console.error(`Error deleting file ${filePathToDelete}:`, err);
                    });
            }
        }
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

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/asset_info/asset_info_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };




    const { data: supplier = [], isLoading, refetch } = useQuery({
        queryKey: ['supplier'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/supplier/supplier_all/${id}`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });


    useEffect(() => {

        setAssetType({
            asset_type_name: supplier[0]?.asset_type_name || '',
            name: supplier[0]?.name || '',
            email: supplier[0]?.email || '',
            mobile: supplier[0]?.mobile || '',
            address: supplier[0]?.address || '',
            trade_license: supplier[0]?.trade_license || '',
            vat: supplier[0]?.vat || '',
            tin: supplier[0]?.tin || '',
            status_id: supplier[0]?.status_id || '',
            description: supplier[0]?.description || '',
            modified_by: created,
            img:supplier[0]?.img || '',
        });

    }, [supplier, created]);


    const [status, setStatus] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');

    const brand_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...assetTypeName }
        attribute[name] = value
        setAssetType(attribute)
        // setSameBrandName('')

        const names = attribute['name'];
        if (names) {
            setName(""); // Clear the error message
        }
        const email = attribute['email'];
        if (email) {
            setEmail(""); // Clear the error message
        }
        const mobile = attribute['mobile'];
        if (mobile) {
            setMobile(""); // Clear the error message
        }
        const address = attribute['address'];
        if (address) {
            setAddress(""); // Clear the error message
        }

        const status = attribute['status_id'];
        if (status) {
            setStatus(""); // Clear the error message
        }


    };

    const router = useRouter()

    const asset_type_create = (e) => {
        e.preventDefault()

        if (!assetTypeName.name) {
            setName('This is required');
            return; // Prevent further execution
        }
        if (!assetTypeName.email) {
            setEmail('This is required');
            return; // Prevent further execution
        }
        if (!assetTypeName.mobile) {
            setMobile('This is required');
            return; // Prevent further execution
        }
        if (!assetTypeName.address) {
            setAddress('This is required');
            return; // Prevent further execution
        }

        if (!assetTypeName.status_id) {
            setStatus('This is required');
            return; // Prevent further execution
        }


        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/supplier/supplier_edit/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(assetTypeName)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data) {
                    sessionStorage.setItem("message", "Data Updated successfully!");
                    router.push('/Admin/supplier/supplier_all?page_group=asset_management')

                }
                // Handle success or show a success message to the user
            })
            .catch(error => {
                console.error('Error updating brand:', error);
                // Handle error or show an error message to the user
            });


    };

    const [page_group, setPageGroup] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pageGroup') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('pageGroup');
            setPageGroup(storedUserId);
        }
    }, []);



    const [statuss, setStatuss] = useState([]);
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
            .then(res => res.json())
            .then(data => setStatuss(data))
    }, [])


    return (

        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class=" border-primary shadow-sm border-0">
                            <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
                                <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Supplier</h5>
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                    <Link href={`/Admin/supplier/supplier_all?page_group=${page_group}`} class="btn btn-sm btn-info">Supplier List</Link></div>
                            </div>
                            <form action="" onSubmit={asset_type_create}>

                                <div class="card-body">


                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Supplier Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="name" value={assetTypeName.name} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter Supplier Name'
                                                maxLength={256}
                                            />
                                            {
                                                name && <p className='text-danger'>{name}</p>
                                            }


                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong> Image:</strong></label>
                                        <div class="col-md-6">

                                            <div>
                                                <span class="btn btn-success btn-sm " >
                                                    <label for="fileInput" className='mb-0' ><FaUpload></FaUpload><span className='ml-1'>Select Image</span></label>
                                                    <input
                                                        // multiple
                                                        // name="img"
                                                        onChange={brand_file_change}
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
                                                        assetTypeName.img ?
                                                            <>

                                                                <img
                                                                    className="w-100"
                                                                    src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${assetTypeName.img}`}
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
                                        <label class="col-form-label col-md-3"><strong>Email<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="email" value={assetTypeName.email} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter email'
                                                maxLength={256}
                                            />

                                            {
                                                email && <p className='text-danger'>{email}</p>
                                            }

                                        </div>
                                    </div>


                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Mobile<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="mobile" value={assetTypeName.mobile} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter mobile'
                                                maxLength={256}
                                            />
                                            {
                                                mobile && <p className='text-danger'>{mobile}</p>
                                            }


                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Address<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="address" value={assetTypeName.address} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter address'
                                                maxLength={256}
                                            />
                                            {
                                                address && <p className='text-danger'>{address}</p>
                                            }


                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Trade License:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="trade_license" value={assetTypeName.trade_license} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter trade license'
                                                maxLength={256}
                                            />


                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Vat:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="vat" value={assetTypeName.vat} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter vat'
                                                maxLength={256}
                                            />


                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Tin:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="tin" value={assetTypeName.tin} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter tin'
                                                maxLength={256}
                                            />


                                        </div>
                                    </div>



                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Description:</strong></label>
                                        <div className='form-group col-md-6'>

                                            <textarea
                                                value={assetTypeName.description} onChange={brand_input_change}
                                                name="description"
                                                className="form-control form-control-sm"
                                                placeholder="Enter note"
                                                rows={5}
                                                cols={73}
                                                // style={{ width: '550px', height: '100px' }}
                                                maxLength={500}
                                            ></textarea>
                                            <small className="text-muted">{assetTypeName.description.length} / 500</small>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <select
                                                value={assetTypeName.status_id} onChange={brand_input_change}
                                                name='status_id'

                                                class="form-control form-control-sm " placeholder="Enter Role Name">
                                                <option value=''>Select Status</option>
                                                {
                                                    statuss.map(sta =>
                                                        <>

                                                            <option value={sta.id}>{sta.status_name}</option>
                                                        </>

                                                    )
                                                }
                                            </select>

                                            {
                                                status && <p className='text-danger'>{status}</p>
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

export default SupplierUpdate;
