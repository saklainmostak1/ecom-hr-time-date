'use client' 
 //ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';

const ModuleInfoTutorials = ({ searchParams }) => {

    const { data: moduleInfoTutorial = [], isLoading, refetch
    } = useQuery({
        queryKey: ['moduleInfoTutorial'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_tutorial_all`)

            const data = await res.json()
            return data
        }
    })


    const [assetInfo, setAssetInfo] = useState({
        video_link: '', img: ''
    });


    

 

    const [selectedFile, setSelectedFile] = useState(Array(assetInfo.length).fill(null));

    const [fileNames, setFileNames] = useState([]);


    let [file_size_error, set_file_size_error] = useState(null);
    const brand_file_change = (e, id) => {
        let files = e.target.files[0];
        if (!files) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const fileName = files.name.split('.')[0];
        const extension = files.name.split('.').pop();
        const newName = `${fileName}.${extension}`;
        const time = `${year}/${month}/${day}/${hours}/${minutes}`;
        const _path = 'module_info_tutorial/' + time + '/' + newName;

        if (Number(files.size) <= 2097152) {
            set_file_size_error('');
            setSelectedFile((prevSelectedFiles) => ({
                ...prevSelectedFiles,
                [id]: { ...files, path: _path },
            }));

            setAssetInfo((prevAssetInfo) => ({
                ...prevAssetInfo,
                [id]: {
                    ...prevAssetInfo[id],
                    img: _path,
                },
            }));

            // Call the function to upload the file
            upload(files);

            // Now update the image path in the database
            updateImageInDatabase(id, _path);
        } else {
            set_file_size_error("Max file size 2 MB");
        }
    };

    // Function to update the image path in the database
    const updateImageInDatabase = (id, imagePath) => {
        const updatedData = { ...assetInfo, [id]: { ...assetInfo[id], img: imagePath } };
        // You can make an API call to your backend to update the image in the database
        // Assuming you have an API endpoint like `updateImage` to handle this operation
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_tutorial_update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
            .then(response => {
                console.log(response)
                response.json()
                if (response.ok === false) {
                    refetch()
                }
            })
            .then(data => {
                if (data) {
                    refetch()
                }
                if (data.success) {

                    console.log('Image updated successfully!');
                } else {
                    refetch()
                    console.error('Failed to update image in the database');
                }
            })
            .catch(error => {
                if (error) {
                    refetch()
                }
                console.error('Error:', error);
            });
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

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/module_info_tutorial/module_info_tutorial_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };

    console.log(assetInfo, selectedFile?.name)


    // Paigination start
    const parentUsers = moduleInfoTutorial

    const totalData = parentUsers?.length
    const dataPerPage = 50

    const totalPages = Math.ceil(totalData / dataPerPage)

    let currentPage = 1


    if (Number(searchParams.page) >= 1) {
        currentPage = Number(searchParams.page)
    }


    let pageNumber = []
    for (let index = currentPage - 2; index <= currentPage + 2; index++) {
        if (index < 1) {
            continue
        }
        if (index > totalPages) {
            break
        }
        pageNumber.push(index)
    }
    const [pageUsers, setPageUsers] = useState([]);
    const caregory_list = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_tutorial_all_paigination/${currentPage}/${dataPerPage}`;
        const response = await fetch(url);
        const data = await response.json();
        setPageUsers(data);
    };
    useEffect(() => {
        caregory_list();
    }, [currentPage]);

    const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;



    const [message, setMessage] = useState();
    useEffect(() => {
        if (typeof window !== 'undefined') {

            if (sessionStorage.getItem("message")) {
                setMessage(sessionStorage.getItem("message"));
                sessionStorage.removeItem("message");
            }
        }
    }, [])

    const brand_input_change = (event, id) => {
        const { name, value } = event.target;

        // Update the local state
        setAssetInfo((prevAssetInfo) => ({
            ...prevAssetInfo,
            [id]: {
                ...prevAssetInfo[id],
                [name]: value
            }
        }));

        // Immediately send an update request to the backend
        // updateDatabase(value, id);
    };
 
    // Function to send updated data to the backend
    const updateDatabase = (videoLink, id, event) => {
        event.preventDefault();
        const updatedData = { ...assetInfo, [id]: { ...assetInfo[id], video_link: videoLink } };

        // Make the fetch request to update the database
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_tutorial_update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
            .then(response => {
                response.json()
                console.log(response.ok)
                if (response.ok === false) {
                    refetch()
                }
            })
            .then(data => {
                if (data) {
                    refetch()
                }
                console.log('Updated successfully:', data);
                // Optionally handle success or update state with confirmation
            })
            .catch(error => {
                if (error) {
                    refetch()
                }
                console.error('Error updating:', error);
            });
    };

    console.log(selectedFile)
    console.log(assetInfo)

    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    {
                        message &&

                        <div className="alert alert-success font-weight-bold">
                            {message}
                        </div>
                    }
                    <div className='card'>


                        {
                            isLoading ? <>
                                <div>
                                    <p>Loading....</p>
                                </div>
                            </> : <>

                                <div className=" bg-light rounded">
                                    <li className="list-group-item text-light  p-1 px-4" aria-current="true" style={{ background: '#4267b2' }}>
                                        <div className='d-flex justify-content-between'>
                                            <h5 className='mt-2'> Module Info List</h5>
                                            <button style={{ background: '#17a2b8' }} className='border-0 text-white shadow-sm rounded-1 rounded'><Link href='/Admin/module_info/module_info_create'>Module Info Create</Link></button>
                                        </div>
                                    </li>
                                    <div className='table-responsive'>
                                        <form action="">
                                            <table className="table  table-bordered table-hover table-striped table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Display Name</th>
                                                        <th>Controller Name</th>
                                                        <th>Method Name</th>
                                                        <th >Img/Pdf</th>
                                                        <th >Pdf</th>
                                                        <th>Video Link</th>
                                                        <th>Video</th>
                                                        <th>Options</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        pageUsers?.map((adminPageAll, index) =>
                                                            <tr key={adminPageAll.id} >
                                                                <td>

                                                                    {((currentPage - 1) * 20) + (index + 1)}

                                                                </td>
                                                                <td>
                                                                    <p className=" text-sm">
                                                                        {adminPageAll.display_name}
                                                                    </p>
                                                                </td>

                                                                <td>
                                                                    <p className=" text-sm">
                                                                        {adminPageAll.controller_name}
                                                                    </p>
                                                                </td>

                                                                <td>
                                                                    <p className=" text-sm">
                                                                        {adminPageAll.method_name}
                                                                    </p>
                                                                </td>
                                                                <td>
                                                                    {
                                                                        assetInfo[adminPageAll.id]?.img ?
                                                                            // adminPageAll.tutorial_pdf !== '' && adminPageAll.tutorial_pdf !== null &&

                                                                            <a
                                                                                className='text-primary'
                                                                                href={`${process.env.NEXT_PUBLIC_API_URL}:5003/${assetInfo[adminPageAll.id]?.img ? assetInfo[adminPageAll.id]?.img : adminPageAll.tutorial_pdf}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer">
                                                                                Download
                                                                            </a>
                                                                            :
                                                                            adminPageAll.tutorial_pdf !== '' && adminPageAll.tutorial_pdf !== null &&

                                                                            <a
                                                                                className='text-primary'
                                                                                href={`${process.env.NEXT_PUBLIC_API_URL}:5003/${assetInfo[adminPageAll.id]?.img ? assetInfo[adminPageAll.id]?.img : adminPageAll.tutorial_pdf}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer">
                                                                                Download
                                                                            </a>
                                                                    }
                                                                </td>

                                                                <td style={{ width: '120px' }}>
                                                                    <div>
                                                                        <div>
                                                                            <span className="btn btn-success btn-sm">
                                                                                <label htmlFor={`fileInput-${adminPageAll.id}`} className="mb-0">
                                                                                    <FaUpload />
                                                                                    <span className="ml-1">Select Pdf</span>
                                                                                </label>
                                                                                <input
                                                                                    onChange={(e) => brand_file_change(e, adminPageAll.id)}
                                                                                    type="file"
                                                                                    id={`fileInput-${adminPageAll.id}`}
                                                                                    style={{ display: "none" }}
                                                                                />
                                                                            </span>
                                                                        </div>

                                                                        {selectedFile[adminPageAll.id] ? (
                                                                            // <>
                                                                            //     <img
                                                                            //         className="mb-2 img-thumbnail"
                                                                            //         src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${selectedFile[adminPageAll.id].path}`}
                                                                            //         alt="Uploaded File"
                                                                            //     />
                                                                            //     <input type="hidden" name="img" value={selectedFile[adminPageAll.id].path} />
                                                                            //     {/* <button
                                                                            //         onClick={() => brand_image_remove(adminPageAll.id)}
                                                                            //         type="button"
                                                                            //         className="btn btn-danger btn-sm position-absolute float-right ml-n4"
                                                                            //     >
                                                                            //         <FaTimes />
                                                                            //     </button> */}
                                                                            // </>
                                                                            <>
                                                                                <object
                                                                                    className="mb-2"
                                                                                    data={`${process.env.NEXT_PUBLIC_API_URL}:5003/${selectedFile[adminPageAll.id].path}`}
                                                                                    type="application/pdf"
                                                                                    width="100%"
                                                                                    height="100px"
                                                                                >
                                                                                    <p>Your browser does not support PDFs. <a href={`${process.env.NEXT_PUBLIC_API_URL}:5003/${selectedFile[adminPageAll.id].path}`}>Download the PDF</a>.</p>
                                                                                </object>
                                                                                <input type="hidden" name="img" value={selectedFile[adminPageAll.id].path} />
                                                                            </>
                                                                        )

                                                                            :
                                                                            <>
                                                                                {
                                                                                    assetInfo.img[adminPageAll.id] ?
                                                                                        <>
                                                                                            <img
                                                                                                className="w-100"
                                                                                                src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${assetInfo.img}`}
                                                                                                alt="Uploaded File"
                                                                                            />
                                                                                            <button onClick={() => brand_image_remove(adminPageAll.id)} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4">
                                                                                                <FaTimes />
                                                                                            </button>
                                                                                        </>
                                                                                        : ''
                                                                                }
                                                                            </>


                                                                        }


                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    {

                                                                        assetInfo[adminPageAll.id]?.video_link ?


                                                                            <a
                                                                                className='text-primary'
                                                                                href={`${assetInfo[adminPageAll.id]?.video_link ? assetInfo[adminPageAll.id]?.video_link : adminPageAll.tutorial_video}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer">
                                                                                Visit
                                                                            </a>
                                                                            :
                                                                            adminPageAll.tutorial_video !== '' && adminPageAll.tutorial_video !== null &&

                                                                            <a
                                                                                className='text-primary'
                                                                                href={`${assetInfo.video_link ? assetInfo.video_link[adminPageAll.id] : adminPageAll.tutorial_video}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer">
                                                                                Visit
                                                                            </a>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        name="video_link"
                                                                        value={assetInfo[adminPageAll.id]?.video_link || adminPageAll.tutorial_video}
                                                                        onChange={(e) => brand_input_change(e, adminPageAll.id)}
                                                                        className="form-control form-control-sm required"
                                                                        placeholder="Enter Video Link"
                                                                        maxLength={256}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <div >
                                                                        <div className="">
                                                                            <input
                                                                                type="submit"
                                                                                onClick={(event) => {
                                                                                    event.preventDefault(); // Prevents the form from reloading the page
                                                                                    updateDatabase(assetInfo[adminPageAll.id]?.video_link, adminPageAll.id, event);
                                                                                }}
                                                                                name="create"
                                                                                className="btn btn-success btn-sm"
                                                                                defaultValue="Submit"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                            </tr>
                                                        )
                                                    }


                                                    {
                                                        isLoading && <tr className='text-center'>
                                                            <td colSpan='100%' className='my-5 py-5 border-bottom-0 '>
                                                                <div className=' my-5 py-5 text-primary'>
                                                                    <FontAwesomeIcon style={{
                                                                        height: '40px',
                                                                        width: '40px',
                                                                    }} icon={faSpinner} spin />
                                                                </div>

                                                            </td>
                                                        </tr>
                                                    }
                                                </tbody>

                                            </table>
                                        </form>
                                    </div>
                                </div>
                            </>
                        }
                        <div className=" d-flex justify-content-between">
                            <div>
                                Total Data: {totalData}
                            </div>
                            <div class="pagination float-right pagination-sm border">
                                {
                                    currentPage - 3 >= 1 && (
                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/module_info/module_info_tutorial?page=${1}`}>‹ First</Link>
                                    )
                                }
                                {
                                    currentPage > 1 && (
                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/module_info/module_info_tutorial?page=${activePage - 1}`}>&lt;</Link>
                                    )
                                }
                                {
                                    pageNumber.map((page) =>
                                        <Link
                                            key={page}
                                            href={`/Admin/module_info/module_info_tutorial?page=${page}`}
                                            className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                        > {page}
                                        </Link>
                                    )
                                }
                                {
                                    currentPage < totalPages && (
                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/module_info/module_info_tutorial?page=${activePage + 1}`}>&gt;</Link>
                                    )
                                }
                                {
                                    currentPage + 3 <= totalPages && (
                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/module_info/module_info_tutorial?page=${totalPages}`}>Last ›</Link>
                                    )
                                }
                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
};

export default ModuleInfoTutorials;





// const brand_file_change = (e, id) => {
//     let files = e.target.files[0];
//     if (!files) return;

//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const day = String(now.getDate()).padStart(2, '0');
//     const hours = String(now.getHours()).padStart(2, '0');
//     const minutes = String(now.getMinutes()).padStart(2, '0');

//     const fileName = files.name.split('.')[0];
//     const extension = files.name.split('.').pop();
//     const newName = `${fileName}.${extension}`;
//     const time = `${year}/${month}/${day}/${hours}/${minutes}`;
//     const _path = 'module_info_tutorial/' + time + '/' + newName;

//     if (Number(files.size) <= 2097152) {
//         set_file_size_error('');
//         setSelectedFile((prevSelectedFiles) => ({
//             ...prevSelectedFiles,
//             [id]: { ...files, path: _path },
//         }));

//         setAssetInfo((prevAssetInfo) => ({
//             ...prevAssetInfo,
//             [id]: {
//                 ...prevAssetInfo[id],
//                 img: _path,
//             },
//         }));

//         upload(files);
//     } else {
//         set_file_size_error("Max file size 2 MB");
//     }
// };



// const brand_file_change = (e, id) => {
//     let files = e.target.files[0];
//     if (!files) return;

//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const day = String(now.getDate()).padStart(2, '0');
//     const hours = String(now.getHours()).padStart(2, '0');
//     const minutes = String(now.getMinutes()).padStart(2, '0');

//     const fileName = files.name.split('.')[0];
//     const extension = files.name.split('.').pop();
//     const newName = `${fileName}.${extension}`;
//     const time = `${year}/${month}/${day}/${hours}/${minutes}`;
//     const _path = 'module_info_tutorial/' + time + '/' + newName;

//     if (Number(files.size) <= 2097152) {
//         set_file_size_error('');
//         setFileNames((prevFileNames) => ({
//             ...prevFileNames,
//             [id]: newName,
//         }));
//         setSelectedFile((prevSelectedFiles) => ({
//             ...prevSelectedFiles,
//             [id]: { ...files, path: _path },
//         }));
//         setAssetInfo((prevAssetInfo) => ({
//             ...prevAssetInfo,
//             img: _path,
//         }));

//         upload(files);
//     } else {
//         set_file_size_error("Max file size 2 MB");
//     }
// };
// const brand_file_change = (e) => {
//     const files = e.target.files[0];
//     setSelectedFile(files);
// };

// const brand_input_change = (event, id) => {
//     const { name, value } = event.target;
//     setAssetInfo((prevAssetInfo) => ({
//         ...prevAssetInfo,
//         [id]: {
//             ...prevAssetInfo[id],
//             [name]: value,
//         },
//     }));
// };

// const brand_input_change = (event, id) => {
//     const { name, value } = event.target;

//     setAssetInfo((prevAssetInfo) => ({
//         ...prevAssetInfo,
//         [id]: {
//             ...prevAssetInfo[id],
//             [name]: value
//         }
//     }));
// };


// const brand_update = (e) => {
//     e.preventDefault();

//     // Retrieve the form's image value


//     // Make the fetch request
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_tutorial_update`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(assetInfo)
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             if (data.affectedRows > 0) {
//                 sessionStorage.setItem("message", "Data Update successfully!");
//                 router.push(`/Admin/loan/loan_all?page_group=${page_group}`);
//             }
//         })
//         .catch(error => {
//             console.error('Error updating brand:', error);
//         });
// };


// const brand_combined_change = (e) => {


//     brand_file_change(e);
//     updateDatabase
// };