// 'use client' 
//ismile
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';
// import Swal from 'sweetalert2';


// const UpdateUsers = ({ id }) => {


//     const { data: adminPageListSingle = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['adminPageListSingle'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/allUser/${id}`)
//             const data = await res.json()
//             return data
//         }
//     })


//     const [userInfo, setUserInfo] = useState({
//         full_name: '',
//         email: '',
//         mobile: '',
//         role_name: '',
//     });

//     console.log(userInfo)

//     const modified = localStorage.getItem('userId')

//     useEffect(() => {

//         setUserInfo({
//             full_name: adminPageListSingle[0]?.full_name || '',
//             email: adminPageListSingle[0]?.email || '',
//             mobile: adminPageListSingle[0]?.mobile || '',
//             role_name: adminPageListSingle[0]?.role_name || '',
//             modified_by: modified
//         });
//     }, [ modified, adminPageListSingle]);

//     console.log(adminPageListSingle)

//     const [editProfile, setEditProfile] = useState(adminPageListSingle)

//     const users_update = event => {
//         event.preventDefault()
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/updateUsers/${id}`, {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json'
//             },
//             body: JSON.stringify(userInfo)
//         })
//             .then(Response => Response.json())
//             .then(data => {
//                 console.log(data)

//                 if (data.affectedRows > 0) {
//                     refetch()

//                 }


//             })
//     }

//     const users_input_change = event => {
//         const field = event.target.name
//         const value = event.target.value
//         const review = { ...userInfo }
//         review[field] = value
//         setUserInfo(review)
//     }

//     return (
//         <div>
//             <div className='p-3'>

//                 <div className=" mx-auto">
//                     <section className=" border  rounded mx-auto">
//                         <li className="list-group-item text-light  p-1 px-4" aria-current="true" style={{ background: '#4267b2' }}>
//                             <div className='d-flex justify-content-between'>
//                                 <h5 >Create Users </h5>
//                                 <button style={{ background: '#17a2b8' }} className='border-0 text-white shadow-sm rounded-1'><Link href='/Admin/users/users_all'>Back To Users List</Link></button>
//                             </div>
//                         </li>
//                         <form className='p-3' onSubmit={users_update}>
//                             <div className="form-group row">
//                                 <label className="col-form-label col-md-3"><strong>Full Name:</strong></label>
//                                 <div className="col-md-6">
//                                     <input type="text"
//                                         onChange={users_input_change}
//                                         value={ userInfo?.full_name}
//                                         name='full_name' className="form-control mb-3" placeholder="Enter Full Name" />

//                                 </div>
//                             </div>
//                             <div className="form-group row">
//                                 <label className="col-form-label col-md-3"><strong>Email:</strong></label>
//                                 <div className="col-md-6">
//                                     <input type="text" onChange={users_input_change}
//                                     defaultValue={ userInfo?.email}
//                                         name='email' className="form-control mb-3" placeholder="Enter Email" />
//                                 </div>
//                             </div>
//                             <div className="form-group row">
//                                 <label className="col-form-label col-md-3"><strong>Mobile:</strong></label>
//                                 <div className="col-md-6">
//                                     <input type="text" onChange={users_input_change}
//                                     defaultValue={ userInfo?.mobile}
//                                         name='mobile' className="form-control mb-3" placeholder="Enter Mobile" />
//                                 </div>
//                             </div>
//                             <div className="form-group row">
//                                 <label className="col-form-label col-md-3"><strong>Role Name:</strong></label>
//                                 <div className="col-md-6">

//                                     <select required="" name="role_name" onChange={users_input_change} className="form-control form-control-sm  required integer_no_zero" placeholder="Enter Role Name"

//                                     value={ userInfo?.role_name}
//                                     >
//                                         <option>Select users Role</option>
//                                         <option value="8">Accountant</option>
//                                         <option value="6">admin</option>
//                                         <option value="9">Administrator</option>
//                                         <option value="10">Employee</option>
//                                         <option value="5">Librarian</option>
//                                         <option value="2">Student</option>
//                                         <option value="1">system_analist_admin</option>
//                                         <option value="4">Teacher</option>
//                                         <option value="12">বিভাগ প্রধান (হেফজ)</option>
//                                     </select>

//                                 </div>
//                             </div>
//                             <div className="form-group row mt-2">
//                                 <div className="offset-md-3 col-sm-6">
//                                     <input type="submit" className="btn btn-sm btn-success" value="Submit" />
//                                 </div>
//                             </div>
//                         </form>
//                     </section>
//                 </div>
//             </div>
//         </div >
//     );
// };

// export default UpdateUsers;
'use client'
//ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import Swal from 'sweetalert2';

const UpdateUsers = ({ id }) => {
    const { data: adminPageListSingle = [], isLoading, refetch } = useQuery({
        queryKey: ['adminPageListSingle'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/allUser/${id}`)
            const data = await res.json()
            return data
        }
    });

    const [userInfo, setUserInfo] = useState({
        full_name: '',
        email: '',
        mobile: '',
        role_name: '',
        img: ''

    });

    const [errors, setErrors] = useState({
        full_name: '',
        email: '',
        role_name: ''
    });



    const [modified, setModified] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setModified(storedUserId);
        }
    }, []);

    const router = useRouter()
    useEffect(() => {
        setUserInfo({
            full_name: adminPageListSingle[0]?.full_name || '',
            email: adminPageListSingle[0]?.email || '',
            mobile: adminPageListSingle[0]?.mobile || '',
            role_name: adminPageListSingle[0]?.role_name || '',
            img: adminPageListSingle[0]?.photo || '',
            modified_by: modified
        });
    }, [modified, adminPageListSingle]);


    const [selectedFile, setSelectedFile] = useState(Array(userInfo.length).fill(null));

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
            setUserInfo((prevAssetInfo) => ({
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
                        setUserInfo(prevData => ({
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

    const users_update = event => {
        event.preventDefault();
        const newErrors = {};
        if (!userInfo.full_name) {
            newErrors.full_name = 'Full Name is required';
        }
        if (!userInfo.email) {
            newErrors.email = 'Email is required';
        }
        if (!userInfo.role_name) {
            newErrors.role_name = 'Role Name is required';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/updateUsers/${id}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        })
            .then((Response) => {
                Response.json()
                console.log(Response)
                if (Response.ok === true) {
                    sessionStorage.setItem("message", "Data Update successfully!");
                    router.push('/Admin/users/users_all')
                }
            })
            .then(data => {
                console.log(data)

            });
    };

    const users_input_change = event => {
        const field = event.target.name;
        const value = event.target.value;
        setUserInfo(prevState => ({
            ...prevState,
            [field]: value
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [field]: ''
        }));
    };

    return (
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <section className="rounded">
                                <li className="list-group-item text-light  p-1 px-4" aria-current="true" style={{ background: '#4267b2' }}>
                                    <div className='d-flex justify-content-between'>
                                        <h5 >Create Users </h5>
                                        <button style={{ background: '#17a2b8' }} className='border-0 text-white shadow-sm rounded-1'><Link href='/Admin/users/users_all'>Back To Users List</Link></button>
                                    </div>
                                </li>
                                <form className='p-3' onSubmit={users_update}>
                                    <div className="form-group row">
                                        <label className="col-form-label col-md-3"><strong>Full Name:</strong></label>
                                        <div className="col-md-6">
                                            <input type="text"
                                                onChange={users_input_change}
                                                value={userInfo.full_name}
                                                name='full_name' className="form-control mb-3" placeholder="Enter Full Name" />
                                            {errors.full_name && <div className="text-danger">{errors.full_name}</div>}
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
                                                        onChange={brand_file_change}
                                                        type="file" id="fileInput" style={{ display: "none" }} />
                                                </span>
                                            </div>

                                            {selectedFile[0] ?
                                                <>
                                                    <img className="w-75 mb-2 img-thumbnail" onChange={(e) => brand_file_change(e)} src={URL.createObjectURL(selectedFile[0])} alt="Uploaded File" />

                                                    <input type="hidden" name="file_path" value={selectedFile[0].path} />
                                                    <button onClick={brand_image_remove} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                                </>
                                                :
                                                <>
                                                    {
                                                        userInfo.img ?
                                                            <>

                                                                <img
                                                                    className="w-75"
                                                                    src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${userInfo.img}`}
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
                                    <div className="form-group row">
                                        <label className="col-form-label col-md-3"><strong>Email:</strong></label>
                                        <div className="col-md-6">
                                            <input type="text" onChange={users_input_change}
                                                value={userInfo.email}
                                                name='email' className="form-control mb-3" placeholder="Enter Email" />
                                            {errors.email && <div className="text-danger">{errors.email}</div>}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-form-label col-md-3"><strong>Mobile:</strong></label>
                                        <div className="col-md-6">
                                            <input type="text" onChange={users_input_change}
                                                value={userInfo.mobile}
                                                name='mobile' className="form-control mb-3" placeholder="Enter Mobile" />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-form-label col-md-3"><strong>Role Name:</strong></label>
                                        <div className="col-md-6">
                                            <select required="" name="role_name" onChange={users_input_change} className="form-control form-control-sm  required integer_no_zero" placeholder="Enter Role Name"
                                                value={userInfo.role_name}
                                            >
                                                <option>Select users Role</option>
                                                <option value="8">Accountant</option>
                                                <option value="6">admin</option>
                                                <option value="9">Administrator</option>
                                                <option value="10">Employee</option>
                                                <option value="5">Librarian</option>
                                                <option value="2">Student</option>
                                                <option value="1">system_analist_admin</option>
                                                <option value="4">Teacher</option>
                                                <option value="12">বিভাগ প্রধান (হেফজ)</option>
                                            </select>
                                            {errors.role_name && <div className="text-danger">{errors.role_name}</div>}
                                        </div>
                                    </div>
                                    <div className="form-group row mt-2">
                                        <div className="offset-md-3 col-sm-6">
                                            <input type="submit" className="btn btn-sm btn-success" value="Submit" />
                                        </div>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default UpdateUsers;

