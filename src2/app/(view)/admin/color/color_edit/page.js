

'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import '../../../admin_layout/modal/fa.css'

const EditColor = ({ id }) => {


    const { data: color = [], isLoading, refetch } = useQuery({
        queryKey: ['color'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/color/color_all`);
            const data = await res.json();
            // Filter out the brand with id 
            const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return filteredBrands;
        }
    });

    console.log(color);

    const [colors, setcolors] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/color/color_all/${id}`)
            .then(Response => Response.json())
            .then(data => setcolors(data))
    }, [id])

    console.log(colors[0])




    const [colorData, setcolorData] = useState({
        color_name: '',
        status_id: '',
        file_path: '',
        description: '',
        modified_by: ''
    });


    const [selectedFile, setSelectedFile] = useState(Array(colorData.length).fill(null));

    // const color_file_change = (e) => {
    //     const files = e.target.files[0];
    //     setSelectedFile(files);
    // };


    const [fileNames, setFileNames] = useState([]);
    let [file_size_error, set_file_size_error] = useState(null);
    const color_file_change = (e) => {
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
        const _path = 'color/' + time + '/' + newName;

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

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/color/color_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };

    const modified = localStorage.getItem('userId')


    useEffect(() => {

        setcolorData({
            color_name: colors[0]?.color_name || '',
            status_id: colors[0]?.status_id || '',
            // file_path: `${`${selectedFile ? `images/${getCurrentDateTime()}/${selectedFile.name}` : colors[0]?.file_path}`}`,
            file_path: selectedFile[0]?.path ? selectedFile[0]?.path : colors[0]?.file_path,
            description: colors[0]?.description || '',
            modified_by: modified
        });
    }, [colors, modified, selectedFile]);

    console.log(colorData, selectedFile?.name)

    const [sameColorName, setSameColorName] = useState([])
    const [colorName, setcolorName] = useState('')
    const [error, setError] = useState([]);

    const color_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...colorData }
        attribute[name] = value
        setcolorData(attribute)
        // setSameColorName('')
        const existingBrand = color.find((color) => color?.color_name?.toLowerCase() === colorData?.color_name?.toLowerCase());
        if (!existingBrand) {
            // Show error message
            setSameColorName("");
        }
        const status = attribute['status_id'];
        if (status) {
            setError(""); // Clear the error message
        }
        const colorName = attribute['color_name']
        if (!colorName || colorName === '') {
            setcolorName('Please enter a Color name.');
        } else {
            setcolorName("");
        }

    };
    const router = useRouter()
    const color_update = (e) => {
        e.preventDefault()


        if (!colorData.color_name) {
            setcolorName('Please enter a color name.');
            return; // Prevent further execution
        }
        if (!colorData.status_id) {
            setError('Please select a status.');
            return; // Prevent further execution
        }

        const existingBrand = color.find((colors) => colors?.color_name?.toLowerCase() === colorData?.color_name?.toLowerCase());
        if (existingBrand) {
            // Show error message
            setSameColorName("Color name already exists. Please choose a different Color name.");
        }
        else {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/color/color_edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(colorData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.affectedRows > 0) {
                        sessionStorage.setItem("message", "Data Update successfully!");
                        router.push('/Admin/color/color_all')

                    }
                    console.log(data);
                    // Handle success or show a success message to the user
                })
                .catch(error => {
                    console.error('Error updating brand:', error);
                    // Handle error or show an error message to the user
                });
        }
    };

    const color_combined_change = (e) => {

        color_input_change(e);
        color_file_change(e);
    };

    // const handleSubmitData = (e) => {
    //     upload(e);
    //     color_update(e);
    // };

    const page_group = localStorage.getItem('pageGroup')



    const color_image_remove = (index) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this?');
        if (confirmDelete) {
            const newSelectedFiles = [...selectedFile];
            newSelectedFiles[0] = null;
            setSelectedFile(newSelectedFiles);
            const filePathToDelete = colorData.file_path;
            if (filePathToDelete) {
                axios.delete(`${process.env.NEXT_PUBLIC_API_URL}:5003/${filePathToDelete}`)
                    .then(res => {
                        console.log(`File ${filePathToDelete} deleted successfully`);
                        // Update colorData to remove the file path
                        setcolorData(prevData => ({
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
                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Update Color</h5>
                    <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                        <Link href={`/Admin/color/color_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back Color List</Link></div>
                </div>
                <form action="" onSubmit={color_update}>

                    <div class="card-body">
                        <div class="form-group row">
                            <label class="col-form-label col-md-3"><strong>Color Image:</strong></label>
                            <div class="col-md-6">

                                <div>
                                    <span class="btn btn-success btn-sm " >
                                        <label for="fileInput" className='mb-0' ><FaUpload></FaUpload> Select Image </label>
                                        <input
                                            // multiple
                                            name="file_path"
                                            onChange={color_combined_change}
                                            type="file" id="fileInput" style={{ display: "none" }} />
                                    </span>
                                </div>

                                {selectedFile[0] ?
                                    <>
                                        <img className="w-100 mb-2 img-thumbnail" onChange={(e) => color_file_change(e)} src={URL.createObjectURL(selectedFile[0])} alt="Uploaded File" />

                                        <input type="hidden" name="file_path" value={selectedFile[0].path} />
                                        <button onClick={color_image_remove} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                    </>
                                    :
                                    <>
                                        {
                                            colorData.file_path ?
                                                <>

                                                    <img
                                                        className="w-100"
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${colorData.file_path}`}
                                                        alt="Uploaded File"
                                                    />
                                                    <button
                                                        onClick={color_image_remove}
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
                            <label class="col-form-label col-md-3"><strong>Color Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                            <div class="col-md-6">
                                <input type="text" name="color_name" defaultValue={colorData.color_name} onChange={color_input_change}
                                    class="form-control form-control-sm  required "
                                    placeholder='Color Name'
                                    maxLength={256}

                                />
                                {
                                    sameColorName && (
                                        <p className='text-danger'>{sameColorName}</p>
                                    )
                                }
                                {
                                    colorName && (
                                        <p className='text-danger'>{colorName}</p>
                                    )
                                }
                                {colorData.color_name.length > 255 && (
                                    <p className='text-danger'>color name cannot more than 255 characters.</p>
                                )}

                            </div>
                        </div>



                        <div class="form-group row">
                            <label class="col-form-label col-md-3"><strong>Description:</strong></label>
                            <div className='form-group col-md-6'>

                                <textarea
                                    defaultValue={colorData.description} onChange={color_input_change}
                                    name="description"
                                    className="form-control form-control-sm"
                                    placeholder="Enter description"
                                    // style={{ width: '550px', height: '100px' }}
                                    rows={4}
                                    cols={73}
                                    // style={{ width: '550px', height: '100px' }}
                                    maxLength={500}
                                ></textarea>
                                <small className="text-muted">{colorData.description.length} / 500</small>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-form-label col-md-3"><strong>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                            <div class="col-md-6">
                                <select
                                    value={colorData.status_id} onChange={color_input_change}
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

export default EditColor;
