'use client'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import '../../../admin_layout/modal/fa.css'


const EditPeriod = ({ id }) => {

    const { data: period = [], isLoading, refetch } = useQuery({
        queryKey: ['period'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/period/period_all`);
            const data = await res.json();
            // Filter out the brand with id 
            const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return filteredBrands;
        }
    });

    console.log(period);


    const [periods, setperiods] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/period/period_all/${id}`)
            .then(Response => Response.json())
            .then(data => setperiods(data))
    }, [id])

    console.log(periods[0])




    const [periodData, setperiodData] = useState({
        period_name: '',
        status_id: '',
        file_path: '',
        description: '',
        modified_by: ''
    });


    const [selectedFile, setSelectedFile] = useState(Array(periodData.length).fill(null));

    // const period_file_change = (e) => {
    //     const files = e.target.files[0];
    //     setSelectedFile(files);
    // };


    const [fileNames, setFileNames] = useState([]);
    let [file_size_error, set_file_size_error] = useState(null);

    const period_file_change = (e) => {
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
        const _path = 'period/' + time + '/' + newName;

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

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/period/period_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };

    const modified = localStorage.getItem('userId')


    useEffect(() => {

        setperiodData({
            period_name: periods[0]?.period_name || '',
            status_id: periods[0]?.status_id || '',
            // file_path: `${`${selectedFile ? `images/${getCurrentDateTime()}/${selectedFile.name}` : periods[0]?.file_path}`}`,
            file_path: selectedFile[0]?.path ? selectedFile[0]?.path : periods[0]?.file_path,
            description: periods[0]?.description || '',
            modified_by: modified
        });
    }, [periods, modified, selectedFile]);
    const [sameperiodName, setSameperiodName] = useState([])
    console.log(periodData, selectedFile?.name)
    const [periodName, setperiodName] = useState('')
    const [error, setError] = useState([]);

    const period_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...periodData }
        attribute[name] = value
        setperiodData(attribute)
        // setSameperiodName('')
        const existingBrand = period.find((period) => period?.period_name?.toLowerCase() === periodData?.period_name?.toLowerCase());
        if (!existingBrand) {
            // Show error message
            setSameperiodName("");
        }
        const status = attribute['status_id'];
        if (status) {
            setError(""); // Clear the error message
        }
        const periodName = attribute['period_name']
        if (!periodName || periodName === '') {
            setperiodName('Please enter a period name.');
        } else {
            setperiodName("");
        }

    };
    const router = useRouter()
    const period_update = (e) => {
        e.preventDefault()

        if (!periodData.period_name) {
            setperiodName('Please enter a period name.');
            return; // Prevent further execution
        }
        if (!periodData.status_id) {
            setError('Please select a status.');
            return; // Prevent further execution
        }

        const existingBrand = period.find((periods) => periods?.period_name?.toLowerCase() === periodData?.period_name?.toLowerCase());
        if (existingBrand) {
            // Show error message
            setSameperiodName("Period name already exists. Please choose a different Period name.");
        }
        else {

            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/period/period_edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(periodData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.affectedRows > 0) {
                        sessionStorage.setItem("message", "Data Update successfully!");
                        router.push('/Admin/period/period_all')

                    }
                    // Handle success or show a success message to the user
                })
                .catch(error => {
                    console.error('Error updating brand:', error);
                    // Handle error or show an error message to the user
                });
        }
    };

    const period_combined_change = (e) => {

        period_input_change(e);
        period_file_change(e);
    };

    // const handleSubmitData = (e) => {
    //     upload(e);
    //     period_update(e);
    // };

    const page_group = localStorage.getItem('pageGroup')

    const period_image_removeFile = () => {
        const confirmRemove = window.confirm('Are you sure you want to remove the image?');
        if (confirmRemove) {
            if (selectedFile[0]) {
                console.log('object')
                // If there's a newly uploaded file, remove it
                setSelectedFile(null);
            } else if (periodData.file_path) {
                // If the image is from the database, set the database value to an empty string
                setperiodData(prevData => ({
                    ...prevData,
                    file_path: '',
                }));
            }
        }
    };

    console.log(periodData.file_path)




    const period_image_remove = (index) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this?');
        if (confirmDelete) {
            const newSelectedFiles = [...selectedFile];
            newSelectedFiles[0] = null;
            setSelectedFile(newSelectedFiles);
            const filePathToDelete = periodData.file_path;
            if (filePathToDelete) {
                axios.delete(`http://localhost:5003/${filePathToDelete}`)
                    .then(res => {
                        console.log(`File ${filePathToDelete} deleted successfully`);
                        // Update periodData to remove the file path
                        setperiodData(prevData => ({
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


    const [currentDate, setCurrentDate] = useState([])
    const handleDateChange = (event) => {
        const selectedDate = event.target.value; // Directly get the value from the input

        const day = String(selectedDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
        const month = String(selectedDate.split('-')[1]).padStart(2, '0');
        const year = String(selectedDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;
        setCurrentDate(formattedDate)
        setperiodData(prevData => ({
            ...prevData,
            period_name: formattedDatabaseDate // Update the period_name field in the state
        }));
    };
    console.log(currentDate)

    const period_name = periodData.period_name;
    const formattedDate = period_name.split('T')[0];

    const [reformattedDate, setReformattedDate] = useState('');

    useEffect(() => {
        const period_name = periodData.period_name;
        const formattedDate = period_name.split('T')[0];

        if (formattedDate.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setReformattedDate(`${day}-${month}-${year}`);
        } else {
            console.error("Date format is incorrect:", formattedDate);
        }
    }, [periodData]);
    
    // const formattedDateParts = formattedDates.split('-');
    // const formattedDate = formattedDateParts[2] + '-' + formattedDateParts[1] + '-' + formattedDateParts[0];
    
    // console.log(formattedDate); 


    // let formattedDate;

    // try {
    //     const date = new Date(period_name);
    //     const day = date.getDate();
    //     const month = date.getMonth() + 1; // Month is zero-based, so we add 1
    //     const year = date.getFullYear();
    //     formattedDate = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`; // Formatting the date
    // } catch (error) {
    //     console.error('Error parsing date:', error.message);
    //     formattedDate = 'Invalid Date';
    // }
    // console.log(formattedDate)


    return (
        <div class="container-fluid">
            <div class="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class=" body-content bg-light">

                            <div class=" border-primary shadow-sm border-0">
                                <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Update Period</h5>
                                    <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/period/period_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back Period List</Link></div>
                                </div>
                                <form action="" onSubmit={period_update}>

                                    <div class="card-body">
                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Period Image:</strong></label>
                                            <div class="col-md-6">

                                                <div>
                                                    <span class="btn btn-success btn-sm " >
                                                        <label for="fileInput" className='mb-0' ><FaUpload></FaUpload> Select Image </label>
                                                        <input
                                                            // multiple
                                                            name="file_path"
                                                            onChange={period_combined_change}
                                                            type="file" id="fileInput" style={{ display: "none" }} />
                                                    </span>
                                                </div>

                                                {selectedFile[0] ?
                                                    <>
                                                        <img className="w-100 mb-2 img-thumbnail" onChange={(e) => period_file_change(e)} src={URL.createObjectURL(selectedFile[0])} alt="Uploaded File" />

                                                        <input type="hidden" name="file_path" value={selectedFile[0].path} />
                                                        <button onClick={period_image_remove} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                                    </>
                                                    :
                                                    <>
                                                        {
                                                            periodData.file_path ?
                                                                <>

                                                                    <img
                                                                        className="w-100"
                                                                        src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${periodData.file_path}`}
                                                                        alt="Uploaded File"
                                                                    />
                                                                    <button
                                                                        onClick={period_image_remove}
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
                                            <label class="col-form-label col-md-3"><strong>Period Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                            <div class="col-md-6">

                                                <input
                                                    type="text"
                                                    readOnly
                                                    defaultValue={reformattedDate}

                                                    onClick={() => document.getElementById(`dateInput-n`).showPicker()}

                                                    placeholder="dd-mm-yyyy"
                                                    className="form-control form-control-sm mb-2"
                                                    style={{ display: 'inline-block', }}
                                                />
                                                <input
                                                    type="date"
                                                    id={`dateInput-n`}
                                                    onChange={(e) => handleDateChange(e)}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                />
                                                {
                                                    sameperiodName && (
                                                        <p className='text-danger'>{sameperiodName}</p>
                                                    )
                                                }
                                                {
                                                    periodName && (
                                                        <p className='text-danger'>{periodName}</p>
                                                    )
                                                }
                                                {periodData.period_name.length > 255 && (
                                                    <p className='text-danger'>period name cannot more than 255 characters.</p>
                                                )}


                                            </div>
                                        </div>



                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Description:</strong></label>
                                            <div className='form-group col-md-6'>
                                                <textarea
                                                    defaultValue={periodData.description} onChange={period_input_change}
                                                    name="description"
                                                    className="form-control form-control-sm"
                                                    placeholder="Enter description"
                                                    style={{ width: '550px', height: '100px' }}
                                                    rows={4}
                                                    cols={73}
                                                    // style={{ width: '550px', height: '100px' }}
                                                    maxLength={500}
                                                ></textarea>
                                                <small className="text-muted">{periodData.description.length} / 500</small>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-form-label col-md-3"><strong>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                            <div class="col-md-6">
                                                <select
                                                    value={periodData.status_id} onChange={period_input_change}
                                                    name='status_id'

                                                    class="form-control form-control-sm " placeholder="Enter Role Name">
                                                    <option value='' >Select</option>
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

export default EditPeriod;

// 'use client'
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import { FaTimes, FaUpload } from 'react-icons/fa';
// import '../../../admin_layout/modal/fa.css'

// const EditPeriod = ({ id }) => {
//     const { data: period = [], isLoading, refetch } = useQuery({
//         queryKey: ['period'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/period/period_all`);
//             const data = await res.json();
//             const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
//             return filteredBrands;
//         }
//     });

//     console.log(period);

//     const [periods, setPeriods] = useState([]);
//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/period/period_all/${id}`)
//             .then(response => response.json())
//             .then(data => setPeriods(data))
//     }, [id]);

//     console.log(periods[0]);

//     const [periodData, setPeriodData] = useState({
//         period_name: '',
//         status_id: '',
//         file_path: '',
//         description: '',
//         modified_by: ''
//     });

//     const [selectedFile, setSelectedFile] = useState(Array(periodData.length).fill(null));
//     const [fileNames, setFileNames] = useState([]);
//     let [file_size_error, set_file_size_error] = useState(null);

//     const period_file_change = (e) => {
//         let files = e.target.files[0];
//         const now = new Date();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const day = String(now.getDate()).padStart(2, '0');
//         const hours = String(now.getHours()).padStart(2, '0');
//         const minutes = String(now.getMinutes()).padStart(2, '0');

//         const fileName = files.name.split('.')[0];
//         const extension = files.name.split('.').pop();
//         const newName = `${fileName}.${extension}`;
//         const time = `${year}/${month}/${day}/${hours}/${minutes}`;
//         const _path = 'period/' + time + '/' + newName;

//         const newSelectedFiles = [...selectedFile];
//         newSelectedFiles[0] = files;
//         newSelectedFiles[0].path = _path;

//         if (Number(files.size) <= 2097152) {
//             console.log('checking the file size is okay');
//             set_file_size_error("");
//             setFileNames(newName);
//             setSelectedFile(newSelectedFiles);
//             upload(files);
//         } else {
//             console.log('checking the file size is High');
//             set_file_size_error("Max file size 2 MB");
//         }
//     };

//     console.log(fileNames);
//     console.log(selectedFile[0]?.path);

//     const upload = (file) => {
//         const formData = new FormData();
//         const extension = file.name.split('.').pop();
//         const fileName = file.name.split('.')[0];
//         const newName = `${fileName}.${extension}`;
//         formData.append('files', file, newName);
//         console.log(file);
//         setFileNames(newName);

//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/period/period_image`, formData)
//             .then(res => {
//                 console.log(res);
//             })
//             .catch(er => console.log(er));
//     };

//     const modified = localStorage.getItem('userId');

//     useEffect(() => {
//         setPeriodData({
//             period_name: periods[0]?.period_name || '',
//             status_id: periods[0]?.status_id || '',
//             file_path: selectedFile[0]?.path ? selectedFile[0]?.path : periods[0]?.file_path,
//             description: periods[0]?.description || '',
//             modified_by: modified
//         });
//     }, [periods, modified, selectedFile]);

//     const [samePeriodName, setSamePeriodName] = useState([]);
//     console.log(periodData, selectedFile?.name);
//     const [periodName, setPeriodName] = useState('');
//     const [error, setError] = useState([]);

//     const period_input_change = (event) => {
//         const name = event.target.name;
//         const value = event.target.value;
//         const attribute = { ...periodData };
//         attribute[name] = value;
//         setPeriodData(attribute);
//         const existingBrand = period.find((period) => period?.period_name?.toLowerCase() === periodData?.period_name?.toLowerCase());
//         if (!existingBrand) {
//             setSamePeriodName("");
//         }
//         const status = attribute['status_id'];
//         if (status) {
//             setError("");
//         }
//         const periodName = attribute['period_name'];
//         if (!periodName || periodName === '') {
//             setPeriodName('Please enter a period name.');
//         } else {
//             setPeriodName("");
//         }
//     };

//     const router = useRouter();
//     const period_update = (e) => {
//         e.preventDefault();

//         if (!periodData.period_name) {
//             setPeriodName('Please enter a period name.');
//             return;
//         }
//         if (!periodData.status_id) {
//             setError('Please select a status.');
//             return;
//         }

//         const existingBrand = period.find((periods) => periods?.period_name?.toLowerCase() === periodData?.period_name?.toLowerCase());
//         if (existingBrand) {
//             setSamePeriodName("Period name already exists. Please choose a different Period name.");
//         } else {
//             fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/period/period_edit/${id}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(periodData)
//             })
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log(data);
//                     if (data.affectedRows > 0) {
//                         sessionStorage.setItem("message", "Data Update successfully!");
//                         router.push('/Admin/period/period_all');
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error updating brand:', error);
//                 });
//         }
//     };

//     const period_combined_change = (e) => {
//         period_input_change(e);
//         period_file_change(e);
//     };

//     const page_group = localStorage.getItem('pageGroup');

//     const period_image_removeFile = () => {
//         const confirmRemove = window.confirm('Are you sure you want to remove the image?');
//         if (confirmRemove) {
//             if (selectedFile[0]) {
//                 setSelectedFile(null);
//             } else if (periodData.file_path) {
//                 setPeriodData(prevData => ({
//                     ...prevData,
//                     file_path: '',
//                 }));
//             }
//         }
//     };

//     console.log(periodData.file_path);

//     const period_image_remove = (index) => {
//         const confirmDelete = window.confirm('Are you sure you want to delete this?');
//         if (confirmDelete) {
//             const newSelectedFiles = [...selectedFile];
//             newSelectedFiles[0] = null;
//             setSelectedFile(newSelectedFiles);
//             const filePathToDelete = periodData.file_path;
//             if (filePathToDelete) {
//                 axios.delete(`http://localhost:5003/${filePathToDelete}`)
//                     .then(res => {
//                         console.log(`File ${filePathToDelete} deleted successfully`);
//                         setPeriodData(prevData => ({
//                             ...prevData,
//                             file_path: '',
//                         }));
//                     })
//                     .catch(err => {
//                         console.error(`Error deleting file ${filePathToDelete}:`, err);
//                     });
//             }
//         }
//     };

//     const [status, setStatus] = useState([]);
//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
//             .then(res => res.json())
//             .then(data => setStatus(data))
//     }, []);

//     const [currentDate, setCurrentDate] = useState([]);
//     const handleDateChange = (event) => {
//         const selectedDate = event.target.value;

//         const day = String(selectedDate.split('-')[2]).padStart(2, '0');
//         const month = String(selectedDate.split('-')[1]).padStart(2, '0');
//         const year = String(selectedDate.split('-')[0]);
//         const formattedDate = `${day}-${month}-${year}`;
//         const formattedDatabaseDate = `${year}-${month}-${day}`;
//         setCurrentDate(formattedDate);
//         setPeriodData(prevData => ({
//             ...prevData,
//             period_name: formattedDatabaseDate
//         }));
//     };

//     console.log(currentDate);

//     const period_name = periodData.period_name;

//     let formattedDate;

//     try {
//         const date = new Date(period_name);
//         formattedDate = date.toISOString().split('T')[0];
//     } catch (error) {
//         console.error('Error parsing date:', error.message);
//         formattedDate = 'Invalid Date';
//     }

//     return (
//         <div class="container-fluid">
//             <div class="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div class="body-content bg-light">
//                             <div class="border-primary shadow-sm border-0">
//                                 <div class="card-header py-3 border-0">
//                                     <div class="d-sm-flex align-items-center justify-content-between">
//                                         <h4 className="h4 mb-0 text-primary">Update Period</h4>
//                                         <Link href="/Admin/period/period_all/" className="btn btn-danger"> Close </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div class="card-body">
//                                 <form class="custom-validation" onSubmit={period_update}>
//                                     <div class="row">
//                                         <div class="col-md-6 mb-3">
//                                             <div class="form-group">
//                                                 <label class="form-label">Period Name</label>
//                                                 <input
//                                                     name="period_name"
//                                                     type="date"
//                                                     class="form-control"
//                                                     value={currentDate}
//                                                     onChange={handleDateChange}
//                                                 />
//                                                 {periodName && <p class="text-danger">{periodName}</p>}
//                                             </div>
//                                         </div>
//                                         <div class="col-md-6 mb-3">
//                                             <div class="form-group">
//                                                 <label class="form-label">Status</label>
//                                                 <select
//                                                     name="status_id"
//                                                     class="form-control"
//                                                     value={periodData.status_id}
//                                                     onChange={period_input_change}
//                                                 >
//                                                     <option value="">Select Status</option>
//                                                     {status.map((option, index) => (
//                                                         <option key={index} value={option.id}>
//                                                             {option.status_name}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 {error && <p class="text-danger">{error}</p>}
//                                             </div>
//                                         </div>
//                                         <div class="col-md-6 mb-3">
//                                             <div class="form-group">
//                                                 <label class="form-label">File</label>
//                                                 <div class="input-group">
//                                                     <input
//                                                         type="file"
//                                                         class="form-control"
//                                                         onChange={period_combined_change}
//                                                     />
//                                                     {selectedFile[0] && (
//                                                         <div class="input-group-append">
//                                                             <button
//                                                                 type="button"
//                                                                 class="btn btn-danger"
//                                                                 onClick={period_image_removeFile}
//                                                             >
//                                                                 <FaTimes />
//                                                             </button>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                                 {file_size_error && (
//                                                     <p class="text-danger">{file_size_error}</p>
//                                                 )}
//                                                 {periodData.file_path && !selectedFile[0] && (
//                                                     <div class="mt-2">
//                                                         <span>{periodData.file_path}</span>
//                                                         <button
//                                                             type="button"
//                                                             class="btn btn-danger ml-2"
//                                                             onClick={period_image_remove}
//                                                         >
//                                                             <FaTimes />
//                                                         </button>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                         <div class="col-md-6 mb-3">
//                                             <div class="form-group">
//                                                 <label class="form-label">Description</label>
//                                                 <textarea
//                                                     name="description"
//                                                     class="form-control"
//                                                     value={periodData.description}
//                                                     onChange={period_input_change}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div class="col-md-12">
//                                             <button type="submit" class="btn btn-primary">
//                                                 Update Period
//                                             </button>
//                                         </div>
//                                     </div>
//                                     {samePeriodName && <p class="text-danger">{samePeriodName}</p>}
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditPeriod;

