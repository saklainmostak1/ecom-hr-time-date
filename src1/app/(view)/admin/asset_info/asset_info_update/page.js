'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';



const AssetInfoCreates = ({ id }) => {

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

    const [fromDate, setFromDate] = useState('');


    const [assetInfo, setAssetInfo] = useState({
        asset_name: '', asset_type_id: '', asset_cost: '', note: '', depreciation: '', date: '', status: '', modified_by: created, img: ''
    });



    const { data: assetInfoSingle = [], } = useQuery({
        queryKey: ['assetInfoSingle'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/asset_info/asset_info_all/${id}`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });


    useEffect(() => {
        setAssetInfo({

            asset_name: assetInfoSingle[0]?.asset_name || '',
            asset_type_id: assetInfoSingle[0]?.asset_type_id || '',
            asset_cost: assetInfoSingle[0]?.asset_cost || '',
            note: assetInfoSingle[0]?.note || '',
            depreciation: assetInfoSingle[0]?.depreciation || '',
            date: assetInfoSingle[0]?.date || '',
            status: assetInfoSingle[0]?.status || '',
            img: assetInfoSingle[0]?.img || '',
            modified_by: created,

        });

    }, [assetInfoSingle, created]);



    const [formattedDisplayDate, setFormattedDisplayDate] = useState('');

    const handleDateSelection = (event) => {
        const inputDate = event.target.value; // Directly get the value from the input

        const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
        const month = String(inputDate.split('-')[1]).padStart(2, '0');
        const year = String(inputDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;
        setFromDate(formattedDate);
        setAssetInfo(prevData => ({
            ...prevData,
            date: formattedDatabaseDate // Update the dob field in the state
        }));
        if (formattedDate) {
            setDate('')
        }
    };



    useEffect(() => {
        const dob = assetInfo.date;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [assetInfo]);




    const { data: assetType = [], isLoading, refetch } = useQuery({
        queryKey: ['assetType'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/asset_type/asset_type_all`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });




    const [selectedFile, setSelectedFile] = useState(Array(assetInfo.length).fill(null));

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
            setAssetInfo((prevAssetInfo) => ({
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




    console.log(assetInfo, selectedFile?.name)


    const [brandName, setBrandName] = useState('')
    const [error, setError] = useState([]);
    const [asset_type_id, setAsset_type_id] = useState('');
    const [asset_cost, setAsset_cost] = useState('');
    const [depreciation, setDepreciation] = useState('');
    const [date, setDate] = useState('');

    const brand_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...assetInfo }
        attribute[name] = value
        setAssetInfo(attribute)
        // setSameBrandName('')

        const status = attribute['status'];
        if (status) {
            setError(""); // Clear the error message
        }
        const asset_type_id = attribute['asset_type_id'];
        if (asset_type_id) {
            setAsset_type_id(""); // Clear the error message
        }

        const asset_cost = attribute['asset_cost'];
        if (asset_cost) {
            setAsset_cost(""); // Clear the error message
        }

        const depreciation = attribute['depreciation'];
        if (depreciation) {
            setDepreciation(""); // Clear the error message
        }

        const brandName = attribute['asset_name']
        if (!brandName || brandName === '') {
            setBrandName('Please enter a brand name.');
        } else {
            setBrandName("");
        }

    };

    const router = useRouter()

    const brand_update = (e) => {
        e.preventDefault();
        const form = e.target; // Access the form

        if (!assetInfo.asset_name) {
            setBrandName('Please enter a brand name.');
            return; // Prevent further execution
        }
        if (!assetInfo.asset_type_id) {
            setAsset_type_id('Please select a asset type.');
            return; // Prevent further execution
        }
        if (!assetInfo.asset_cost) {
            setAsset_cost('Please enter a asset cost.');
            return; // Prevent further execution
        }
        if (!assetInfo.depreciation) {
            setDepreciation('Please enter a depreciation.');
            return; // Prevent further execution
        }
        if (!assetInfo.date) {
            setDate('Please Select  a Date.');
            return; // Prevent further execution
        }
        if (!assetInfo.status) {
            setError('Please select a status.');
            return; // Prevent further execution
        }

        // Retrieve the form's image value


        // Make the fetch request
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/asset_info/asset_info_edit/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(assetInfo)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.affectedRows > 0) {
                    sessionStorage.setItem("message", "Data Update successfully!");
                    router.push(`/Admin/asset_info/asset_info_all?page_group=${page_group}`);
                }
            })
            .catch(error => {
                console.error('Error updating brand:', error);
            });
    };


    const brand_combined_change = (e) => {


        brand_file_change(e);
    };






    const brand_image_remove = (index) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this?');
        if (confirmDelete) {
            const newSelectedFiles = [...selectedFile];
            newSelectedFiles[0] = null;
            setSelectedFile(newSelectedFiles);
            const filePathToDelete = assetInfo.img;
            if (filePathToDelete) {
                axios.delete(`${process.env.NEXT_PUBLIC_API_URL}:5003/${filePathToDelete}`)
                    .then(res => {
                        console.log(`File ${filePathToDelete} deleted successfully`);
                        // Update assetInfo to remove the file path
                        setAssetInfo(prevData => ({
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



    const [status, setStatus] = useState([]);
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
            .then(res => res.json())
            .then(data => setStatus(data))
    }, [])


    console.log(selectedFile[0]?.path)

    return (
        // col-md-12
        // <div class=" body-content bg-light">
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class=" border-primary shadow-sm border-0">
                            <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
                                <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Update Asset Info</h5>
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                    <Link href={`/Admin/asset_info/asset_info_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back Asset Info List</Link></div>
                            </div>
                            <form action="" onSubmit={brand_update}>
                                <div class="card-body">
                                    <div class=" row no-gutters">
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Asset Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input type="text" name="asset_name" value={assetInfo.asset_name} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter Asset Name'
                                                        maxLength={256}
                                                    />

                                                    {
                                                        brandName && (
                                                            <p className='text-danger'>{brandName}</p>
                                                        )
                                                    }
                                                    {assetInfo.asset_name.length > 255 && (
                                                        <p className='text-danger'>Brand name cannot more than 255 characters.</p>
                                                    )}

                                                </div>
                                            </div>

                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Asset Type Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <select
                                                        value={assetInfo.asset_type_id} onChange={brand_input_change}
                                                        name='asset_type_id'

                                                        class="form-control form-control-sm " placeholder="Enter Role Name">
                                                        <option value=''>Select Asset Type Name</option>
                                                        {
                                                            assetType.map(sta =>
                                                                <>

                                                                    <option value={sta.id}>{sta.asset_type_name}</option>
                                                                </>

                                                            )
                                                        }
                                                    </select>
                                                    {
                                                        asset_type_id && <p className='text-danger'>{asset_type_id}</p>
                                                    }
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Asset Cost<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input type="number" name="asset_cost" value={assetInfo.asset_cost} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter Asset Cost'
                                                        maxLength={256}
                                                    />

                                                    {assetInfo.asset_cost.length > 255 && (
                                                        <p className='text-danger'>Brand name cannot more than 255 characters.</p>
                                                    )}
                                                    {
                                                        asset_cost && <p className='text-danger'>{asset_cost}</p>
                                                    }
                                                </div>
                                            </div>


                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Depreciation<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <input type="text" name="depreciation" value={assetInfo.depreciation} onChange={brand_input_change}
                                                        class="form-control form-control-sm  required "
                                                        placeholder='Enter Depreciation'
                                                        maxLength={256}
                                                    />

                                                    {/* {
                                                brandName && (
                                                    <p className='text-danger'>{brandName}</p>
                                                )
                                            } */}
                                                    {assetInfo.depreciation.length > 255 && (
                                                        <p className='text-danger'>Brand name cannot more than 255 characters.</p>
                                                    )}

                                                    {
                                                        depreciation && <p className='text-danger'>{depreciation}</p>
                                                    }

                                                </div>
                                            </div>

                                            {/* date  */}
                                            <div className="form-group row student">
                                                <label className="col-form-label col-md-3 font-weight-bold"> Date:</label>
                                                <div className="col-md-8">

                                                    <input
                                                        type="text"
                                                        readOnly

                                                        defaultValue={formattedDisplayDate}
                                                        onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
                                                        placeholder="dd-mm-yyyy"
                                                        className="form-control form-control-sm mb-2"
                                                        style={{ display: 'inline-block', }}
                                                    />
                                                    <input
                                                        name='join_date'
                                                        type="date"
                                                        id={`dateInput-nt`}
                                                        onChange={(e) => handleDateSelection(e)}
                                                        style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                    />
                                                    {
                                                        date && <p className='text-danger'>{date}</p>
                                                    }
                                                </div>


                                            </div>
                                        </div>


                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong>Description:</strong></label>
                                                <div className='form-group col-md-8'>

                                                    <textarea
                                                        value={assetInfo.note} onChange={brand_input_change}
                                                        name="note"
                                                        className="form-control form-control-sm"
                                                        placeholder="Enter note"
                                                        rows={5}
                                                        cols={73}
                                                        // style={{ width: '550px', height: '100px' }}
                                                        maxLength={500}
                                                    ></textarea>
                                                    <small className="text-muted">{assetInfo.note.length} / 500</small>
                                                </div>
                                            </div>

                                            <div class="form-group row">
                                                <label class="col-form-label col-md-3"><strong> Image:</strong></label>
                                                <div class="col-md-8">

                                                    <div>
                                                        <span class="btn btn-success btn-sm " >
                                                            <label for="fileInput" className='mb-0' ><FaUpload></FaUpload><span className='ml-1'>Select Image</span></label>
                                                            <input
                                                                // multiple
                                                                // name="img"
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
                                                                assetInfo.img ?
                                                                    <>

                                                                        <img
                                                                            className="w-100"
                                                                            src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${assetInfo.img}`}
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
                                                <label class="col-form-label col-md-3"><strong>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                                <div class="col-md-8">
                                                    <select
                                                        value={assetInfo.status} onChange={brand_input_change}
                                                        name='status'

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
                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-3 col-sm-6">

                                                <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                            </div>
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

export default AssetInfoCreates;
