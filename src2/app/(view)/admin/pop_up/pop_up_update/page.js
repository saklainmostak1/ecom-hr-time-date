'use client' 
 //ismile
import React, { useEffect, useState } from 'react';
import FroalaEditorComponent from "react-froala-wysiwyg";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PopUpUpdate = ({ id }) => {
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

    const [created_by, setUserId] = useState(() => {
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

    const [formData, setFormData] = useState({
        title_en: "",
        pop_up_type: "1",
        img: "",
        status: "1",
        description: "",
        description1: "",
        pop_up_end_date: "",
        pop_up_start_date: "",
        pop_up_size: "",
        pop_up_animation: "",
        pop_up_delay: "",
        pop_up_design: "null",
        pop_up_scrollable: "",
        pop_up_design_id: "null",
        pop_up_schedule: "",
        pop_up_align: "",
        modified_by: created_by,
    });
    const handleModelChange = (content) => {
        setFormData({ ...formData, description: content });
    };

    // const handleInputChanges = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: value,
    //     }));
    // };
    const [title, setTitle] = useState('')
    const handleInputChanges = (e) => {
        const { name, value, checked, type } = e.target; // Get the name, value, checked, and type
        if (name === 'title_en') {
            setTitle('')
        }
        // Check if it's a checkbox and handle accordingly
        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: checked ? value : "", // If checked, set the value; else empty string
            }));
        } else {
            // Handle other input types (like select, text inputs, etc.)
            setFormData((prev) => ({
                ...prev,
                [name]: value, // For other inputs, update the value
            }));
        }
    };

    // const handleInputChanges = (e) => {
    //     const { name, value, checked } = e.target;  // Get the checkbox's name, value, and checked status
    //     setFormData((prev) => ({
    //         ...prev,
    //         // Conditionally set the value and checked status based on checked state
    //         [name]: checked ? value : ""  // If checked, set the value, else set it as an empty string
    //     }));
    // };

    const [fileNames, setFileNames] = useState([]);
    const [selectedFile, setSelectedFile] = useState(Array(formData.length).fill(null));

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
            setFormData((prevAssetInfo) => ({
                ...prevAssetInfo,
                img: newSelectedFiles[0]?.path
            }));
            upload(files);
        } else {
            console.log('checking the file size is High');
            set_file_size_error("Max file size 2 MB");

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

    console.log(formData)

    const [linkData, setLinkData] = useState({
        link1: { type: '1', value: 'https//', disabled: false, name: '', align: '' },
        link2: { type: '1', value: 'https//', disabled: false, name: '' },
        link3: { type: '1', value: 'https//', disabled: false, name: '' },
        link4: { type: '1', value: 'https//', disabled: false, name: '' },
        link5: { type: '1', value: 'https//', disabled: false, name: '' },
    });


    const handleSelectChange = (id, value) => {
        const updatedLinkData = { ...linkData };
        updatedLinkData[id].type = value;

        switch (value) {
            case '1': // External
                updatedLinkData[id].value = 'https//';
                updatedLinkData[id].disabled = false;
                break;
            case '2': // Front page
                updatedLinkData[id].value = 'font';
                updatedLinkData[id].disabled = true;
                break;
            case '3': // No Link
                updatedLinkData[id].value = 'no link';
                updatedLinkData[id].disabled = true;
                break;
            case '4': // Content Reference
                updatedLinkData[id].value = '';
                updatedLinkData[id].disabled = true;
                break;
            default:
                break;
        }


        setLinkData(updatedLinkData)

    };


    const [modalData, setModalData] = useState({ id: '', value: '' });

    const handleInputChange = (id, key, value) => {
        setLinkData((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [key]: value,
            },
        }));


    };


    const openModal = (id) => {
        if (linkData[id].type === '4') {
            // Show the modal for content reference and set the modal data
            setModalData({ id, value: linkData[id].value });
        }


    };



    const { data: pop_up_single = [], } = useQuery({
        queryKey: ['pop_up_single'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pop_up/pop_up_list/${id}`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });

    useEffect(() => {
        // Update formData with fetched data
        setFormData({

            title_en: pop_up_single[0]?.title_en || '',
            pop_up_type: pop_up_single[0]?.pop_up_type,
            img: pop_up_single[0]?.img,
            status: pop_up_single[0]?.active,
            description: pop_up_single[0]?.body_en,
            description1: pop_up_single[0]?.body_en,
            pop_up_end_date: pop_up_single[0]?.pop_up_end_date,
            pop_up_start_date: pop_up_single[0]?.pop_up_start_date,
            pop_up_size: pop_up_single[0]?.pop_up_size,
            pop_up_animation: pop_up_single[0]?.pop_up_animation,
            pop_up_delay: pop_up_single[0]?.pop_up_delay,
            pop_up_design: "null",
            pop_up_scrollable: pop_up_single[0]?.pop_up_scrollable,
            pop_up_design_id: "null",
            pop_up_schedule: pop_up_single[0]?.pop_up_schedule,
            pop_up_align: pop_up_single[0]?.pop_up_align,
            modified_by: created_by,
        });

        // Dynamically set linkData based on fetched data
        const links = ['link1'];
        const updatedLinkData = {};

        links.forEach((link) => {
            const url = pop_up_single[0]?.pop_up_link;
            const name = pop_up_single[0]?.btn_name; // Explicitly use btn_name here
            const btn_align = pop_up_single[0]?.btn_align; // Explicitly use btn_name here

            updatedLinkData[link] = {
                type:
                    url === 'no link' ? '3' : // No Link
                        url === 'font' ? '2' :   // Front Page
                            url?.startsWith('https//') ? '1' : // External Link
                                '4', // Content Reference
                value: url || 'no link', // Default value
                disabled: url === 'no link' || url === 'font' || !url, // Disable for No Link, Front Page, or empty
                name: name || '', // Set name from fetched data
                align: btn_align || '', // Set name from fetched data
            };
        });

        setLinkData((prev) => ({
            ...prev,
            ...updatedLinkData,
        }));
    }, [pop_up_single, created_by]);

    console.log(modalData)


    const saveModalChanges = (page) => {
        setActiveTabs('')
        setModalData((prev) => {
            const updatedData = { ...prev, value: page };
            setLinkData((prevState) => ({
                ...prevState,
                [updatedData.id]: {
                    ...prevState[updatedData.id],
                    value: updatedData.value,
                },
            }));
            return updatedData; // Return the updated modalData
        });

        $('#exampleModal').modal('hide'); // Close the modal
    };



    const [pageListTable, setPageListTable] = useState('')

    console.log(pageListTable)


    const { data: page_list = []
    } = useQuery({
        queryKey: ['page_list'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/page_list/page_list_list`)

            const data = await res.json()
            return data
        }
    })
    const { data: page_list_status = []
    } = useQuery({
        queryKey: ['page_list_status'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/page_list/page_list_list_one`)

            const data = await res.json()
            return data
        }
    })
    const [tableData, setTableData] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/page_list/all_table_data`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pageListTable }) // Sending table name dynamically
                });

                if (response.ok) {
                    const data = await response.json();
                    setTableData(data);  // Store data in state
                } else {
                    console.error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [pageListTable]); // Re-fetch if the table name changes

    console.log(tableData)

    const [activeTabs, setActiveTabs] = useState([]); // Manage multiple active tabs


    const handleTabClick = (tabName, tabNames) => {
        setActiveTabs([tabName, tabNames]); // Reset active tabs and add only the clicked tab
    };

    console.log(activeTabs)

    console.log(linkData)




    const [displayDatess, setDisplayDatess] = useState(''); // Stores the formatted date as "11-08-2024"
    const [displayTimess, setDisplayTimess] = useState(''); // Stores the formatted time as "11:20 AM/PM"
    const [errorss, setErrorss] = useState(''); // State to manage error messages


    const handleDateSelections = (event) => {
        const inputDate = event.target.value; // Get the date-time input in yyyy-mm-ddTHH:MM format
        const [datePart, timePart] = inputDate.split('T'); // Separate the date and time parts

        const [year, month, day] = datePart.split('-');
        const formattedDisplayDate = `${day}-${month}-${year}`; // Format: 11-08-2024


        // Convert time to 12-hour format with AM/PM
        let hours = parseInt(timePart?.split(':')[0], 10);
        const minutes = timePart.split(':')[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        const formattedDisplayTime = `${hours}:${minutes} ${ampm}`; // Format: 11:20 AM/PM

        setDisplayDatess(formattedDisplayDate); // Display format: 11-08-2024
        setDisplayTimess(formattedDisplayTime); // Display format: 11:20 AM/PM

        setFormData((prevData) => ({
            ...prevData,
            pop_up_end_date: `${datePart} ${timePart}`, // Store in MySQL format: "2024-08-11 11:20"
        }));
    };

    useEffect(() => {
        let dob = formData.pop_up_end_date;

        // Auto-select current date and time if dob is empty
        if (!dob) {
            const currentDate = new Date();
            const datePart = currentDate.toISOString().split('T')[0]; // Format: 2024-08-11
            const timePart = currentDate.toTimeString().slice(0, 5); // Format: 11:20

            dob = `${datePart} ${timePart}`;
            setFormData((prevData) => ({
                ...prevData,
                pop_up_end_date: dob,
            }));

            const [year, month, day] = datePart.split('-');
            setDisplayDatess(`${day}-${month}-${year}`);

            // Convert time to 12-hour format with AM/PM
            let hours = parseInt(timePart.split(':')[0], 10);
            const minutes = timePart.split(':')[1];
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            setDisplayTimess(`${hours}:${minutes} ${ampm}`);
        }
    }, [formData]);

    const [displayDates, setDisplayDates] = useState(''); // Stores the formatted date as "11-08-2024"
    const [displayTimes, setDisplayTimes] = useState(''); // Stores the formatted time as "11:20 AM/PM"
    const [errors, setErrors] = useState(''); // State to manage error messages


    const handleDateSelection = (event) => {
        const inputDate = event.target.value; // Get the date-time input in yyyy-mm-ddTHH:MM format
        const [datePart, timePart] = inputDate.split('T'); // Separate the date and time parts

        const [year, month, day] = datePart.split('-');
        const formattedDisplayDate = `${day}-${month}-${year}`; // Format: 11-08-2024




        // Convert time to 12-hour format with AM/PM
        let hours = parseInt(timePart?.split(':')[0], 10);
        const minutes = timePart.split(':')[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        const formattedDisplayTime = `${hours}:${minutes} ${ampm}`; // Format: 11:20 AM/PM

        setDisplayDates(formattedDisplayDate); // Display format: 11-08-2024
        setDisplayTimes(formattedDisplayTime); // Display format: 11:20 AM/PM

        setFormData((prevData) => ({
            ...prevData,
            pop_up_start_date: `${datePart} ${timePart}`, // Store in MySQL format: "2024-08-11 11:20"
        }));
    };

    useEffect(() => {
        let dob = formData.pop_up_start_date;

        // Auto-select current date and time if dob is empty
        if (!dob) {
            const currentDate = new Date();
            const datePart = currentDate.toISOString().split('T')[0]; // Format: 2024-08-11
            const timePart = currentDate.toTimeString().slice(0, 5); // Format: 11:20

            dob = `${datePart} ${timePart}`;
            setFormData((prevData) => ({
                ...prevData,
                pop_up_start_date: dob,
            }));

            const [year, month, day] = datePart.split('-');
            setDisplayDates(`${day}-${month}-${year}`);

            // Convert time to 12-hour format with AM/PM
            let hours = parseInt(timePart.split(':')[0], 10);
            const minutes = timePart.split(':')[1];
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            setDisplayTimes(`${hours}:${minutes} ${ampm}`);
        }
    }, [formData]);


    const [formattedTime, setformattedTime] = useState([])
    const [formattedDate, setformattedDate] = useState([])


    useEffect(() => {

        const date = new Date(formData.pop_up_start_date);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        setformattedDate(formattedDate)
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        const formattedTime = date.toLocaleTimeString('en-US', options);
        setformattedTime(formattedTime)
    }, [formData])

    const [formattedTimes, setformattedTimes] = useState([])
    const [formattedDates, setformattedDates] = useState([])


    useEffect(() => {

        const date = new Date(formData.pop_up_end_date);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        setformattedDates(formattedDate)
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        const formattedTime = date.toLocaleTimeString('en-US', options);
        setformattedTimes(formattedTime)
    }, [formData])


    const { data: pop_up_size_list = []
    } = useQuery({
        queryKey: ['pop_up_size_list'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pop_up/pop_up_size_list`)

            const data = await res.json()
            return data
        }
    })

    const { data: pop_up_animation_list = []
    } = useQuery({
        queryKey: ['pop_up_animation_list'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pop_up/pop_up_animation_list`)

            const data = await res.json()
            return data
        }
    })
    const generateOptions = () => {
        let options = [];
        for (let i = 0; i <= 30; i++) {
            const milliseconds = i * 1000; // Convert seconds to milliseconds
            options.push(
                <option key={milliseconds} value={milliseconds}>
                    {i} Second{i !== 1 ? 's' : ''}
                </option>
            );
        }
        return options;
    };

    const router = useRouter()

    const front_service_box_create = (event) => {
        event.preventDefault();


        const allData = {
            linkData, formData
        }
        if (!formData.title_en) {
            setTitle('This field is required')
            return
        }


        console.log(allData)

        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pop_up/pop_up_update/${id}
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pop_up/pop_up_update/${id}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(allData),
        })
            .then((Response) => {

                Response.json()
                if (Response) {
                    sessionStorage.setItem("message", "Data Updated successfully!");
                    router.push('/Admin/pop_up/pop_up_all?page_group=dynamic_website')

                }
            })
            .then((data) => {
                console.log(data)

                if (data) {
                    sessionStorage.setItem("message", "Data Updated successfully!");
                    router.push('/Admin/pop_up/pop_up_all?page_group=dynamic_website')

                }
            })
            .catch((error) => console.error(error));
        // }
    }

    console.log(formData)

    const renderLinkRow = (label, id) => (
        <div className="form-group row">
            <label className="col-form-label font-weight-bold col-md-2">Pop Up Link:</label>
            <div className="col-md-8">

                <div className="input-group input-group-sm">
                    <input
                        type="text"
                        style={{ flex: '1' }}
                        className="form-control form-control-sm name_input"
                        value={linkData[id].name}
                        onChange={(e) => handleInputChange(id, 'name', e.target.value)}
                        placeholder="Name"
                    />

                    <select
                        style={{ flex: '1' }}
                        className="form-control form-control-sm link_type"
                        value={linkData[id].align}
                        onChange={(e) => handleInputChange(id, 'align', e.target.value)}
                    >
                        <option value="">Button Center</option>
                        <option value="float-left">Button Left Align</option>
                        <option value="float-right">Button Right Align</option>
                    </select>

                    <select
                        style={{ flex: '1' }}
                        className="form-control form-control-sm link_type"
                        value={linkData[id].type}
                        onChange={(e) => handleSelectChange(id, e.target.value)}
                    >
                        <option value="1">External</option>
                        <option value="2">Front page</option>
                        <option value="3">No Link</option>
                        <option value="4">Content Reference</option>
                    </select>
                    <input
                        style={{ flex: '1' }}
                        type="text"
                        className="form-control form-control-sm select_result"
                        value={linkData[id].value}
                        // disabled={linkData[id].disabled}
                        disabled={!linkData[id].value.startsWith('https//')}
                        onChange={(e) => handleInputChange(id, 'value', e.target.value)}
                    />
                    {
                        linkData[id].type == '4' &&

                        <div className="input-group-append"  >
                            <span
                                className="input-group-text search_icon"
                                data-toggle={linkData[id].type === '4' ? 'modal' : ''}
                                data-target={linkData[id].type === '4' ? '#exampleModal' : ''}
                                onClick={() => linkData[id].type === '4' && openModal(id)}
                            >
                                <i className="fas fa-search"></i>
                            </span>
                        </div>
                    }
                </div>
                {/* { // Display the error message conditionally for this specific link
                    name && !linkData[id].name && <p className="text-danger">{name}</p>
                } */}
            </div>
        </div>
    );

    return (
        <div class="col-md-12 bg-light p-4">
            <div class="card border-primary shadow-sm border-0">
                <div class="card-header py-1  clearfix bg-gradient-primary text-white">
                    <h5 class="card-title font-weight-bold mb-0  float-left mt-1">Update Pop Up</h5>
                    <div class="card-title font-weight-bold mb-0  float-right"> <Link href="/Admin/pop_up/pop_up_all?page_group=dynamic_website" class="btn btn-sm btn-info">Back to Pop up List</Link></div>
                </div>
                <div class="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">

                    (<small><sup><i class="text-danger fas fa-star"></i></sup></small>) field required

                </div>		<div class="card-body">
                    <form class="" method="post" autocomplete="off" onSubmit={front_service_box_create}>
                        {/* <div className="form-group row">
                            <label className="col-form-label font-weight-bold col-md-2">Pop Up Type:</label>
                            <div className="col-md-8">
                                <label>
                                    <input
                                        className="block_type1"
                                        type="radio"
                                        name="pop_up_type"
                                        value="1"
                                        checked={formData.pop_up_type == "1"}
                                        onChange={handleInputChanges}
                                    />{" "}
                                    Default Pop Up
                                </label>
                                <label className="ml-3">
                                    <input
                                        className="block_type2 ml-2"
                                        type="radio"
                                        name="pop_up_type"
                                        value="2"
                                        checked={formData.pop_up_type == "2"}
                                        onChange={handleInputChanges}
                                    />{" "}
                                    Custom Pop Up
                                </label>
                            </div>
                        </div> */}
                        <input type="hidden" name="hidden" value="1" />

                        <div class="form-group row">
                            <label class="col-form-label font-weight-bold col-md-2">Title:<sup><i class="text-danger fas fa-star"></i></sup></label>
                            <div class="col-md-8">
                                <input value={formData.title_en} type="text" name="title_en" class="form-control form-control-sm  required block_custom_editor" placeholder="Enter Title" onChange={handleInputChanges} />
                                {
                                    title && <p className='text-danger'>{title}</p>
                                }
                            </div>
                        </div>
                        {formData.pop_up_type == "2" && (
                            <>

                                <div className="form-group row">
                                    <label className="col-form-label font-weight-bold col-md-2">
                                        Description:

                                    </label>

                                    <div className="col-md-8">
                                        <FroalaEditorComponent
                                            tag="textarea"
                                            // model={content}
                                            model={formData.description}
                                            onModelChange={handleModelChange}
                                            onChange={handleInputChanges}
                                            config={{
                                                placeholderText: "Type Here",
                                                toolbarButtons: [
                                                    "undo",
                                                    "redo",
                                                    "bold",
                                                    "italic",
                                                    "underline",
                                                    "strikethrough",
                                                    "subscript",
                                                    "superscript",
                                                    "fontFamily",
                                                    "fontSize",
                                                    "color",
                                                    "emoticons",
                                                    "paragraphFormat",
                                                    "align",
                                                    "formatOL",
                                                    "formatUL",
                                                    "outdent",
                                                    "indent",
                                                    "quote",
                                                    "insertLink",
                                                    "insertImage",
                                                    "insertVideo",
                                                    "insertFile",
                                                    "insertTable",
                                                    "html",
                                                    "undo",
                                                    "redo",
                                                    "fullscreen",
                                                    "print",
                                                    "save",
                                                    "help",
                                                ],
                                                toolbarButtonsXS: [
                                                    "undo",
                                                    "redo",
                                                    "bold",
                                                    "italic",
                                                    "underline",
                                                    "strikethrough",
                                                    "subscript",
                                                    "superscript",
                                                    "fontFamily",
                                                    "fontSize",
                                                    "color",
                                                    "emoticons",
                                                    "paragraphFormat",
                                                    "align",
                                                    "formatOL",
                                                    "formatUL",
                                                    "outdent",
                                                    "indent",
                                                    "quote",
                                                    "insertLink",
                                                    "insertImage",
                                                    "insertVideo",
                                                    "insertFile",
                                                    "insertTable",
                                                    "html",
                                                    "fullscreen",
                                                ],
                                                toolbarButtonsMD: [
                                                    "undo",
                                                    "redo",
                                                    "bold",
                                                    "italic",
                                                    "underline",
                                                    "strikethrough",
                                                    "subscript",
                                                    "superscript",
                                                    "fontFamily",
                                                    "fontSize",
                                                    "color",
                                                    "emoticons",
                                                    "paragraphFormat",
                                                    "align",
                                                    "formatOL",
                                                    "formatUL",
                                                    "outdent",
                                                    "indent",
                                                    "quote",
                                                    "insertLink",
                                                    "insertImage",
                                                    "insertVideo",
                                                    "insertFile",
                                                    "insertTable",
                                                    "html",
                                                    "fullscreen",
                                                ],
                                                toolbarButtonsLG: [
                                                    "undo",
                                                    "redo",
                                                    "bold",
                                                    "italic",
                                                    "underline",
                                                    "strikethrough",
                                                    "subscript",
                                                    "superscript",
                                                    "fontFamily",
                                                    "fontSize",
                                                    "color",
                                                    "emoticons",
                                                    "paragraphFormat",
                                                    "align",
                                                    "formatOL",
                                                    "formatUL",
                                                    "outdent",
                                                    "indent",
                                                    "quote",
                                                    "insertLink",
                                                    "insertImage",
                                                    "insertVideo",
                                                    "insertFile",
                                                    "insertTable",
                                                    "html",
                                                    "fullscreen",
                                                ],

                                                videoUploadURL: `${process.env.NEXT_PUBLIC_API_URL}:5003/editor`, // Video upload URL
                                                videoUploadParams: { id: "editor" },
                                                videoUploadMethod: "POST",
                                                videoMaxSize: 50 * 1024 * 1024, // 50MB max size for videos
                                                videoAllowedTypes: ["mp4", "webm", "ogg"], // Allowed video formats
                                                imageUploadURL: `${process.env.NEXT_PUBLIC_API_URL}:5003/editor`,
                                                imageUploadParams: { id: "editor" },
                                                imageUploadMethod: "POST",
                                                fileUploadURL: `${process.env.NEXT_PUBLIC_API_URL}:5003/editor`,
                                                fileUploadParams: { id: "editor" },
                                                fileUploadMethod: "POST",
                                                fileMaxSize: 10 * 1024 * 1024, // 10MB
                                                fileAllowedTypes: [
                                                    "image/jpeg",
                                                    "image/png",
                                                    "application/pdf",
                                                ],
                                                pluginsEnabled: [
                                                    "align",
                                                    "charCounter",
                                                    "codeBeautifier",
                                                    "colors",
                                                    "draggable",
                                                    "embedly",
                                                    "entities",
                                                    "file",
                                                    "fontFamily",
                                                    "fontSize",
                                                    "fullscreen",
                                                    "image",
                                                    "inlineStyle",
                                                    "link",
                                                    "lists",
                                                    "paragraphFormat",
                                                    "paragraphStyle",
                                                    "print",
                                                    "save",
                                                    "table",
                                                    "url",
                                                    "video",
                                                    "wordPaste",
                                                ],
                                            }}
                                        />

                                        {/* {description && (
                        <div className="text-danger">{description}</div>
                      )} */}
                                    </div>
                                </div>
                            </>
                        )}
                        {formData.pop_up_type == "1" && (
                            <>

                                <div class="form-group row block_div1" >
                                    <label class="col-form-label font-weight-bold col-md-2">Description:</label>
                                    <div class="col-md-8">
                                        <div class="input-group">
                                            <textarea
                                                value={formData.description1}
                                                onChange={handleInputChanges}
                                                name="description1" class="form-control form-control-sm" rows="4" placeholder="Enter Description"></textarea>
                                            <div class="input-group-append overflow-hidden">
                                                <span
                                                    className="input-group-text overflow-hidden position-relative justify-content-center"
                                                    style={{
                                                        width: '114px',
                                                        position: 'relative',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <input
                                                        className="h-100 w-100 position-absolute"
                                                        title="Upload Image"
                                                        type="file"
                                                        onChange={brand_file_change}
                                                        name="files"
                                                        id="software_upload_logo"
                                                        style={{
                                                            opacity: 0,
                                                            zIndex: 3,
                                                            position: 'absolute',
                                                            width: '100%',
                                                            height: '100%',
                                                        }}
                                                    />
                                                    {selectedFile[0] ?
                                                        <>

                                                            <img className="mb-2 img-thumbnail" onChange={(e) => brand_file_change(e)} src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${selectedFile[0].path}`} alt="Uploaded File" />


                                                            <input type="hidden" name="img" value={selectedFile[0].path} />

                                                        </>
                                                        :
                                                        <>
                                                            {
                                                                formData.img ?
                                                                    <>
                                                                        <img
                                                                            className="w-100"
                                                                            src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${formData.img}`}
                                                                            alt="Uploaded File"
                                                                        />
                                                                    </>
                                                                    :
                                                                    <i
                                                                        className="fas fa-image position-absolute zt-8"
                                                                        style={{
                                                                            zIndex: 1,
                                                                            position: 'absolute',
                                                                        }}
                                                                    ></i>
                                                            }
                                                        </>

                                                        // <i
                                                        //     className="fas fa-image position-absolute zt-8"
                                                        //     style={{
                                                        //         zIndex: 1,
                                                        //         position: 'absolute',
                                                        //     }}
                                                        // ></i>

                                                    }


                                                    <div
                                                        id="software_logo"
                                                        style={{
                                                            zIndex: 2,
                                                            position: 'relative',
                                                        }}
                                                    ></div>
                                                </span>


                                            </div>
                                        </div>
                                    </div>
                                </div>




                                {renderLinkRow('Link1', 'link1')}




                                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-lg" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Content Reference</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <div>
                                                    <table className="table table-bordered table-striped table-sm" align="center">
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>Page List</td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-sm btn-secondary"
                                                                        onClick={(event) => {
                                                                            event.preventDefault(); // Prevent the page reload
                                                                            handleTabClick("pageList");
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-bars"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Content List</td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-sm btn-secondary"
                                                                        onClick={(event) => {
                                                                            event.preventDefault(); // Prevent the page reload
                                                                            handleTabClick("contentList");
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-bars"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>

                                                    {activeTabs.includes("pageList") && (
                                                        <div id="page_list" className="tab-pane">
                                                            <table id="modal-view-list" className="table table-bordered table-striped table-sm" align="center">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Page Name</th>
                                                                        <th>Human Page Link</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {/* {page_list.map(page => (
                                                            <tr onClick={() => setLink1(page.page_link)} key={page.page_name}>
                                                                <td>{page.page_name}</td>
                                                                <td>{page.page_link}</td>
                                                            </tr>
                                                        ))} */}
                                                                    {page_list.map(page => (
                                                                        <tr
                                                                            onClick={() => saveModalChanges(page.page_link)}
                                                                            key={page.page_name}
                                                                        >
                                                                            <td >{page.page_name}</td>
                                                                            <td>{page.page_link}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}

                                                    {activeTabs.includes("contentList") && (
                                                        <div id="content_list" className="tab-content">
                                                            <table className="table table-bordered table-striped table-sm" align="center">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Name</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {page_list_status.map(pageStatus => (
                                                                        <tr key={pageStatus.page_name}>
                                                                            <td>{pageStatus.page_name}</td>
                                                                            <td>
                                                                                <button
                                                                                    onClick={(event) => {
                                                                                        event.preventDefault();
                                                                                        setPageListTable(pageStatus.table_name);
                                                                                        handleTabClick("contentLists", "contentList");
                                                                                    }}
                                                                                    className="btn btn-sm btn-secondary"
                                                                                >
                                                                                    <i className="fas fa-bars"></i>
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}

                                                    {activeTabs.includes("contentLists") && (
                                                        <div id="content_lists" className="tab-pane">
                                                            <table className="table table-bordered table-striped table-sm" align="center">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Title</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {tableData.map(page => (
                                                                        <tr onClick={() => saveModalChanges(`${pageListTable}/${page?.id}`)} key={page.id}>
                                                                            <td>{page?.name ? page?.name : page?.title}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button onClick={() => saveModalChanges('')} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                {/* <button onClick={saveModalChanges} type="button" className="btn btn-primary">Save changes</button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </>
                        )}

                        <div class="form-group row">
                            <label class="col-form-label font-weight-bold col-md-2">Start-End Date:<sup><i class="text-danger fas fa-star"></i></sup></label>
                            <div class="col-md-8">
                                <div class="input-group input-group-sm ">
                                    <input
                                        type="text"
                                        readOnly
                                        value={`${formattedDate} ${formattedTime}`}
                                        onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
                                        placeholder="dd-mm-yyyy"
                                        className="form-control form-control-sm"
                                        style={{ display: 'inline-block', }}
                                    />
                                    <input
                                        name='travel_from_time'
                                        type="datetime-local"
                                        id={`dateInput-nt`}
                                        onChange={(e) => handleDateSelection(e)}
                                        style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                    />



                                    <input
                                        type="text"
                                        readOnly
                                        // value={`${displayDatess} ${displayTimess}`}
                                        value={`${formattedDates} ${formattedTimes}`}
                                        onClick={() => document.getElementById(`dateInput-ntn`).showPicker()}
                                        placeholder="dd-mm-yyyy"
                                        className="form-control form-control-sm"
                                        style={{ display: 'inline-block', }}
                                    />
                                    <input
                                        name='travel_to_time'
                                        type="datetime-local"
                                        id={`dateInput-ntn`}
                                        onChange={(e) => handleDateSelections(e)}
                                        style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                    />
                                    <div class="input-group-append" data-toggle="popover" title="" data-content="If you tick 'Scheduled' Pop Up will run given scheduled every day. Not whole Day" data-original-title="Scheduled">
                                        <div class="input-group-text">
                                            <input onChange={handleInputChanges} checked={formData.pop_up_schedule == "1"} type="checkbox" name="pop_up_schedule" aria-label="Checkbox for following text input" value="1" />
                                        </div>
                                        <span class="input-group-text "><i class="fas fa-info-circle mr-1"></i>Scheduled</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div class="form-group row">
                            <label class="col-form-label font-weight-bold col-md-2">Pop Up Size:</label>
                            <div class="col-md-3">
                                <select onChange={handleInputChanges} value={formData.pop_up_size} name="pop_up_size" class="form-control form-control-sm  trim">
                                    {
                                        pop_up_size_list.map(popUp =>

                                            <>
                                                <option value={popUp.pop_up_class}>{popUp.pop_up_name}</option>
                                            </>
                                        )
                                    }
                                </select>
                            </div>
                            <label class="col-form-label font-weight-bold col-md-2">Pop Up Animation:</label>
                            <div class="col-md-3">
                                <select onChange={handleInputChanges} value={formData.pop_up_animation} name="pop_up_animation" class="form-control form-control-sm  trim">
                                    {
                                        pop_up_animation_list.map(animation =>
                                            <>
                                                <option value={animation.pop_up_animation_class}> {animation.pop_up_animation_name}</option>

                                            </>
                                        )
                                    }

                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-form-label font-weight-bold col-md-2">Pop Up Delay:</label>
                            <div class="col-md-3">
                                <select onChange={handleInputChanges} value={formData.pop_up_delay} name="pop_up_delay" class="form-control form-control-sm  trim">
                                    {/* <option value="0">0 Second</option>
                                    <option value="1000">1 Seconds</option>

                                    <option value="30000">30 Seconds</option> */}
                                    {generateOptions()}
                                </select>
                            </div>
                            <label class="col-form-label font-weight-bold col-md-2">Align &amp; Scrollable:</label>

                            <div class="col-md-4">
                                <div class="form-check form-check-inline mt-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        name="pop_up_align"
                                        onChange={handleInputChanges}
                                        checked={formData.pop_up_align === "modal-dialog-centered"} // Checks if it should be checked
                                        value="modal-dialog-centered"  // Set the value for pop_up_align
                                    />
                                    <label class="form-check-label" for="autoSizingCheck">
                                        Window Center
                                    </label>
                                </div>
                                <div class="form-check form-check-inline mt-2">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        name="pop_up_scrollable"
                                        onChange={handleInputChanges}
                                        checked={formData.pop_up_scrollable === "modal-dialog-scrollable"} // Checks if it should be checked
                                        value="modal-dialog-scrollable"  // Set the value for pop_up_scrollable
                                    />
                                    <label class="form-check-label" for="autoSizingCheck">
                                        Scrollable Content
                                    </label>
                                </div>
                            </div>

                        </div>


                        <div class="block-layout default-layout-list form-group row">

                            <label class="col-form-label font-weight-bold col-md-2">Status:</label>
                            <div class="col-md-3">
                                <select onChange={handleInputChanges} value={formData.status} required="" name="status" class="form-control form-control-sm  trim integer_no_zero required" id="status">
                                    <option value="1">Active</option>
                                    <option value="2">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="offset-md-3 col-sm-6">
                                <input type="submit" class="btn btn-sm btn-success" name="create" value="Update" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PopUpUpdate;