'use client' 
 //ismile
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaTimes, FaTrash, FaUpload } from 'react-icons/fa';
import IconModalCustomBox from '../custom_page_creates/modal';



const CustomPageUpdate = ({ id }) => {

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
        title: "",
        pop_up_type: "1",
        summary: "",
        description: "",
        img: "",
        pop_up_schedule: "",
        created_by: created_by,
    });

    const [title, setTitle] = useState('')

    const handleInputChanges = (e) => {
        const { name, value, checked, type } = e.target; // Get the name, value, checked, and type

        if (name === 'title') {
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
        const _path = 'custom_page/' + time + '/' + newName;

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

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/custom_page/custom_page_image`, formData)
            .then(res => {
                console.log(res);
            })
            .catch(er => console.log(er));
    };

    console.log(formData)

    const [linkData, setLinkData] = useState({
        link1: { type: '1', value: 'https//', disabled: false, name: '', align: '' },
        // link2: { type: '1', value: 'https//', disabled: false, name: '' },
        // link3: { type: '1', value: 'https//', disabled: false, name: '' },
        // link4: { type: '1', value: 'https//', disabled: false, name: '' },
        // link5: { type: '1', value: 'https//', disabled: false, name: '' },
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



    const router = useRouter()


    //  linkData1 start


    const [linkData1, setLinkData1] = useState({
        link1: { type: '1', value: 'https//', disabled: false, name: '', align: '' },
    });

    // Handle the change for link type
    const handleSelectChange1 = (id, value) => {
        const updatedLinkData1 = { ...linkData1 };
        updatedLinkData1[id].type = value;

        switch (value) {
            case '1': // External
                updatedLinkData1[id].value = 'https//';
                updatedLinkData1[id].disabled = false;
                break;
            case '2': // Front page
                updatedLinkData1[id].value = 'font';
                updatedLinkData1[id].disabled = true;
                break;
            case '3': // No Link
                updatedLinkData1[id].value = 'no link';
                updatedLinkData1[id].disabled = true;
                break;
            case '4': // Content Reference
                updatedLinkData1[id].value = '';
                updatedLinkData1[id].disabled = true;
                break;
            default:
                break;
        }
        setLinkData1(updatedLinkData1);
    };

    // Handle input changes for link data
    const handleInputChange1 = (id, key, value) => {
        setLinkData1((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [key]: value,
            },
        }));
    };

    // Add a new link entry dynamically
    const addLink = () => {
        const newLinkKey = `link${Object.keys(linkData1).length + 1}`;
        const newLinkData1 = {
            ...linkData1,
            [newLinkKey]: { type: '1', value: 'https//', disabled: false, name: '', align: '' },
        };
        setLinkData1(newLinkData1);
    };
    const handleRemoveField = (key) => {
        setLinkData1((prevState) => {
            const updatedState = { ...prevState }; // Create a shallow copy
            delete updatedState[key]; // Remove the key
            return updatedState; // Return the updated object
        });
    };

    const [modalData1, setModalData1] = useState({ id: '', value: '' });
    const openModal1 = (id) => {
        if (linkData1[id].type === '4') {
            setModalData1({ id, value: linkData1[id].value });
            $('#exampleModal').modal('show'); // Ensure modal shows when opened
        }
    };

    const saveModalChanges1 = (page) => {
        setActiveTabs('');
        setModalData1((prev) => {
            const updatedData = { ...prev, value: page };
            setLinkData1((prevState) => ({
                ...prevState,
                [updatedData.id]: {
                    ...prevState[updatedData.id],
                    value: updatedData.value,
                },
            }));
            return updatedData;
        });

        $('#exampleModal').modal('hide'); // Close the modal
    };


    //  linkData1 end


    //  linkData2 start



    const [linkData2, setLinkData2] = useState({
        link1: { type: '1', file_path: '', value: 'https//', disabled: false, name: '', align: '' },
    });

    const [selectedFile2, setSelectedFile2] = useState({});
    const [fileErrors, setFileErrors] = useState({});
    const [fileNames2, setFileNames2] = useState({});

    const handleSelectChange2 = (id, value) => {
        const updatedLinkData2 = { ...linkData2 };
        updatedLinkData2[id].type = value;

        switch (value) {
            case '1': // External
                updatedLinkData2[id].value = 'https//';
                updatedLinkData2[id].disabled = false;
                break;
            case '2': // Front page
                updatedLinkData2[id].value = 'font';
                updatedLinkData2[id].disabled = true;
                break;
            case '3': // No Link
                updatedLinkData2[id].value = 'no link';
                updatedLinkData2[id].disabled = true;
                break;
            case '4': // Content Reference
                updatedLinkData2[id].value = '';
                updatedLinkData2[id].disabled = true;
                break;
            default:
                break;
        }
        setLinkData2(updatedLinkData2);
    };

    const handleInputChange2 = (id, key, value) => {
        setLinkData2((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [key]: value,
            },
        }));
    };

    const addLink2 = () => {
        const newLinkKey = `link${Object.keys(linkData2).length + 1}`;
        setLinkData2((prevState) => ({
            ...prevState,
            [newLinkKey]: { type: '1', file_path: '', value: 'https//', disabled: false, name: '', align: '' },
        }));
    };

    const handleRemoveField2 = (key) => {
        setLinkData2((prevState) => {
            const updatedState = { ...prevState };
            delete updatedState[key];
            return updatedState;
        });

        setSelectedFile2((prevState) => {
            const updatedFiles = { ...prevState };
            delete updatedFiles[key];
            return updatedFiles;
        });

        setFileNames2((prevState) => {
            const updatedNames = { ...prevState };
            delete updatedNames[key];
            return updatedNames;
        });
    };

    const type_file_change = (key, e) => {
        e.preventDefault();
        const file = e.target.files[0];

        if (!file) return;

        if (file.size > 2097152) {
            setFileErrors((prev) => ({ ...prev, [key]: 'Max file size is 2 MB' }));
            return;
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const fileName = file.name.split('.')[0];
        const extension = file.name.split('.').pop();
        const newName = `${fileName}(${key}).${extension}`;
        const filePath = `custom_page/${year}/${month}/${day}/${hours}/${minutes}/${fileName}.${extension}`;

        setSelectedFile2((prevState) => ({ ...prevState, [key]: file }));
        setFileNames2((prevState) => ({ ...prevState, [key]: newName }));
        setLinkData2((prevState) => ({
            ...prevState,
            [key]: { ...prevState[key], file_path: filePath },
        }));

        upload2(file, filePath);
    };

    const upload2 = (file, path) => {
        const formData = new FormData();
        formData.append('files', file);
        formData.append('path', path);

        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}:5003/custom_page/custom_page_image`, formData)
            .then((res) => {
                console.log('File uploaded successfully:', res.data);
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
            });
    };

    console.log(linkData2)



    const [modalData2, setModalData2] = useState({ id: '', value: '' });
    const openModal2 = (id) => {
        if (linkData2[id].type === '4') {
            setModalData2({ id, value: linkData2[id].value });
            $('#exampleModal').modal('show'); // Ensure modal shows when opened
        }
    };

    const saveModalChanges2 = (page) => {
        setActiveTabs('');
        setModalData2((prev) => {
            const updatedData = { ...prev, value: page };
            setLinkData2((prevState) => ({
                ...prevState,
                [updatedData.id]: {
                    ...prevState[updatedData.id],
                    value: updatedData.value,
                },
            }));
            return updatedData;
        });

        $('#exampleModal').modal('hide'); // Close the modal
    };


    console.log(linkData2)


    //  linkData2 end


    //  linkData3 start


    const [linkData3, setLinkData3] = useState({
        link1: { type: '1', page_group_icon: '', value: 'https//', disabled: false, name: '', align: '' },
    });

    // Handle the change for link type
    const handleSelectChange3 = (id, value) => {
        const updatedLinkData3 = { ...linkData3 };
        updatedLinkData3[id].type = value;

        switch (value) {
            case '1': // External
                updatedLinkData3[id].value = 'https//';
                updatedLinkData3[id].disabled = false;
                break;
            case '2': // Front page
                updatedLinkData3[id].value = 'font';
                updatedLinkData3[id].disabled = true;
                break;
            case '3': // No Link
                updatedLinkData3[id].value = 'no link';
                updatedLinkData3[id].disabled = true;
                break;
            case '4': // Content Reference
                updatedLinkData3[id].value = '';
                updatedLinkData3[id].disabled = true;
                break;
            default:
                break;
        }
        setLinkData3(updatedLinkData3);
    };

    // Handle input changes for link data
    const handleInputChange3 = (id, key, value) => {
        setLinkData3((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [key]: value,
            },
        }));
    };

    // Add a new link entry dynamically
    const addLink3 = () => {
        const newLinkKey = `link${Object.keys(linkData3).length + 1}`;
        const newLinkData3 = {
            ...linkData3,
            [newLinkKey]: { type: '1', page_group_icon: '', value: 'https//', disabled: false, name: '', align: '' },
        };
        setLinkData3(newLinkData3);
    };

    // Remove a link entry dynamically
    const handleRemoveField3 = (key) => {
        setLinkData3((prevState) => {
            const updatedState = { ...prevState };
            delete updatedState[key]; // Remove the key
            return updatedState;
        });
    };

    // Open the modal for content reference (type 4)
    const [modalData3, setModalData3] = useState({ id: '', value: '' });

    const openModal3 = (id) => {
        if (linkData3[id].type === '4') {
            setModalData3({ id, value: linkData3[id].value });
            $('#exampleModal').modal('show'); // Ensure modal shows when opened
        }
    };

    // Save modal changes


    // Handling input change in the modal
    const handleInputChange4 = (index, event) => {
        const { name, value } = event.target;
        setLinkData3((prevState) => ({
            ...prevState,
            [index]: {
                ...prevState[index],
                [name]: value,
            },
        }));
    };

    // Handle row deletion inside the modal (if necessary)
    const handleDeleteRow = (index) => {
        setLinkData3((prevState) => {
            const newState = { ...prevState };
            delete newState[index]; // Remove the row
            return newState;
        });
    };

    console.log(linkData3)

    const saveModalChanges3 = (page) => {
        setActiveTabs('');
        setModalData3((prev) => {
            const updatedData = { ...prev, value: page };
            setLinkData3((prevState) => ({
                ...prevState,
                [updatedData.id]: {
                    ...prevState[updatedData.id],
                    value: updatedData.value,
                },
            }));
            return updatedData;
        });

        $('#exampleModal').modal('hide'); // Close the modal
    };

    //  linkData3 end

    console.log(linkData)
    console.log(linkData2)
    console.log(linkData3)
    console.log(linkData1)

    const { data: custom_page_single = [], } = useQuery({
        queryKey: ['custom_page_single'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/custom_page/custom_page_list_all/${id}`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });

    // useEffect(() => {
    //     // Update formData with fetched data
    //     if (custom_page_single ) {
    //         const customPage = custom_page_single;

    //         setFormData((prev) => ({
    //             ...prev,
    //             title: customPage?.title || '',
    //             pop_up_type: customPage?.content_type,
    //             img: customPage?.img || '',
    //             status: customPage?.status || 0,
    //             description: customPage?.description || '',
    //             summary: customPage?.summary || '',
    //             modified_by: created_by,
    //         }));

    //         // Prepare link data dynamically
    //         const links = customPage?.content_block_list || [];
    //         const linkDataMap = {
    //             1: setLinkData,
    //             2: setLinkData1,
    //             3: setLinkData2,
    //             4: setLinkData3,
    //         };

    //         const updateLinkData = linkDataMap[customPage.content_type];
    //         if (updateLinkData) {
    //             const updatedLinkData = {};
    //             links.forEach((link, index) => {
    //                 const key = `link${index + 1}`;
    //                 updatedLinkData[key] = {
    //                     type:
    //                         link.links_url === 'no link' ? '3' :
    //                             link.links_url === 'font' ? '2' :
    //                                 link.links_url?.startsWith('https//') ? '1' :
    //                                     '4', // Determine type based on links_url
    //                     value: link.links_url || 'no link',
    //                     disabled: ['no link', 'font', ''].includes(link.links_url),
    //                     name: link.links_name || '',
    //                     align: customPage.btn_align || '',
    //                     file_path: link.image || '', // Include file_path if applicable
    //                     page_group_icon: link.image || '', // For type 4 icons
    //                 };
    //             });

    //             // Update the appropriate link data state
    //             updateLinkData((prev) => ({
    //                 ...prev,
    //                 ...updatedLinkData,
    //             }));
    //         }
    //     }
    // }, [custom_page_single, created_by]);

    useEffect(() => {
        // Update formData with fetched data
        if (custom_page_single) {
            const customPage = custom_page_single;

            setFormData((prev) => ({
                ...prev,
                title: customPage?.title || '',
                pop_up_type: customPage?.content_type,
                img: customPage?.img || '',
                status: customPage?.status || 0,
                description: customPage?.description || '',
                summary: customPage?.summary || '',
                pop_up_schedule: customPage?.btn_hide || '',
                modified_by: created_by,
            }));

            // Prepare link data dynamically
            const links = customPage?.content_block_list || [];
            const linkDataMap = {
                1: setLinkData,   // For content_type 1, use setLinkData
                2: setLinkData1,
                3: setLinkData2,
                4: setLinkData3,
            };

            const updateLinkData = linkDataMap[customPage.content_type];
            if (updateLinkData) {
                const updatedLinkData = {};

                if (customPage.content_type == 1) {
                    // Handle content_type 1 specifically
                    updatedLinkData.link1 = {
                        name: customPage.btn_name || '',  // Set name to btn_name
                        value: customPage.title_url || '', // Set value to title_url
                        align: customPage.btn_align || '', // Set align to btn_align
                        file_path: customPage.img || '',   // Set file_path to img
                        type:
                            customPage.title_url === 'no link' ? '3' :
                                customPage.title_url === 'font' ? '2' :
                                    customPage.title_url?.startsWith('https//') ? '1' :
                                        '4', // Determine type based on links_url                       // Assign a default type (could be customized)
                        disabled: !customPage.title_url,   // Disable if there's no title_url
                    };
                } else {
                    // For other content types, process the content_block_list
                    links.forEach((link, index) => {
                        const key = `link${index + 1}`;
                        updatedLinkData[key] = {
                            type:
                                link.links_url === 'no link' ? '3' :
                                    link.links_url === 'font' ? '2' :
                                        link.links_url?.startsWith('https//') ? '1' :
                                            '4', // Determine type based on links_url
                            value: link.links_url || 'no link',
                            disabled: ['no link', 'font', ''].includes(link.links_url),
                            name: link.links_name || '',
                            align: customPage.btn_align || '',
                            file_path: link.image || '', // Include file_path if applicable
                            page_group_icon: link.image || '', // For type 4 icons
                        };
                    });
                }

                // Update the appropriate link data state
                updateLinkData((prev) => ({
                    ...prev,
                    ...updatedLinkData,
                }));
            }
        }
    }, [custom_page_single, created_by]);


    const custom_page_update = (event) => {
        event.preventDefault();


        const allData = {
            formData, linkData, linkData1, linkData2, linkData3
        }
        if (!formData.title) {
            setTitle("This is required")
            return
        }
        console.log(allData)

        //${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/front_service_box/custom_page_update

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/custom_page/custom_page_update/${id}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(allData),
        })
            .then((Response) => {

                Response.json()
                if (Response) {
                    sessionStorage.setItem("message", "Data saved successfully!");
                    router.push('/Admin/custom_page/custom_page_all?page_group=dynamic_website')

                }
            })
            .then((data) => {
                console.log(data)

                if (data) {
                    sessionStorage.setItem("message", "Data saved successfully!");
                    router.push('/Admin/custom_page/custom_page_all?page_group=dynamic_website')

                }
            })
            .catch((error) => console.error(error));
        // }
    }

    console.log(formData)
    console.log(custom_page_single)

    const renderLinkRow = (label, id) => (
        <div className="form-group row">
            <label className="col-form-label font-weight-bold col-md-2">Button Link:</label>
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
                    <div class="input-group-append" data-toggle="popover" title="" data-content="If you tick 'Scheduled' Pop Up will run given scheduled every day. Not whole Day" data-original-title="Scheduled">
                        <div class="input-group-text">
                            <input onChange={handleInputChanges} checked={formData.pop_up_schedule == 1} type="checkbox" name="pop_up_schedule" aria-label="Checkbox for following text input" value="1" />
                        </div>
                        <span class="input-group-text "><i class="fas fa-info-circle mr-1"></i>Scheduled</span>
                    </div>
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

            </div>
        </div>
    );

    return (
        <div class="col-md-12 bg-light p-4">
            <div class="card border-primary shadow-sm border-0">
                <div class="card-header py-1  clearfix bg-gradient-primary text-white">
                    <h5 class="card-title font-weight-bold mb-0  float-left mt-1">Edit Custom Page</h5>
                    <div class="card-title font-weight-bold mb-0  float-right"> <Link href="/Admin/custom_page/custom_page_all?page_group=dynamic_website" class="btn btn-sm btn-info">Back to Custom Page List</Link></div>
                </div>
                <div class="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">

                    (<small><sup><i class="text-danger fas fa-star"></i></sup></small>) field required

                </div>		<div class="card-body">
                    <form class="" method="post" autocomplete="off" onSubmit={custom_page_update}>
                        {/* <div className="form-group row">
                            <label className="col-form-label font-weight-bold col-md-2">Content Type:</label>
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
                                    Block & Custom Page
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
                                    Only Block Link List
                                </label>
                                <label className="ml-3">
                                    <input
                                        className="block_type2 ml-2"
                                        type="radio"
                                        name="pop_up_type"
                                        value="3"
                                        checked={formData.pop_up_type == "3"}
                                        onChange={handleInputChanges}
                                    />{" "}
                                    Image Block List
                                </label>
                                <label className="ml-3">
                                    <input
                                        className="block_type2 ml-2"
                                        type="radio"
                                        name="pop_up_type"
                                        value="4"
                                        checked={formData.pop_up_type == "4"}
                                        onChange={handleInputChanges}
                                    />{" "}
                                    Icon Block List
                                </label>
                            </div>
                        </div> */}
                        <input type="hidden" name="hidden" value="1" />

                        <div class="form-group row">
                            <label class="col-form-label font-weight-bold col-md-2">Title:<sup><i class="text-danger fas fa-star"></i></sup></label>
                            <div class="col-md-8">
                                <input value={formData.title} type="text" name="title" class="form-control form-control-sm  required block_custom_editor" placeholder="Enter Title" onChange={handleInputChanges} />
                                {
                                    title && <p className='text-danger'>{title}</p>
                                }
                            </div>
                        </div>

                        {formData.pop_up_type == 1 && (
                            <>

                                <div class="form-group row block_div1" >
                                    <label class="col-form-label font-weight-bold col-md-2">Summary:</label>
                                    <div class="col-md-8">
                                        <div class="input-group">
                                            <textarea
                                                value={formData.summary}
                                                onChange={handleInputChanges}
                                                name="summary" class="form-control form-control-sm" rows="4" placeholder="Enter Summary"></textarea>
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
                                <div class="form-group row">
                                    <label class="col-form-label font-weight-bold col-md-2">Description:<sup><i class="text-danger fas fa-star"></i></sup></label>
                                    <div class="col-md-8">
                                        <div class="input-group input-group-sm ">
                                            <textarea
                                                value={formData.description}
                                                onChange={handleInputChanges}
                                                name="description" class="form-control form-control-sm" rows="4" placeholder="Enter Description"></textarea>

                                        </div>
                                    </div>
                                </div>

                            </>
                        )}
                        {formData.pop_up_type == 2 && (
                            <>



                                <div className="form-group row block_div2">
                                    <label className="col-form-label font-weight-bold col-md-3">
                                        Links Name &amp; URL: <i className="fas fa-info-circle text-info" data-toggle="popover" data-placement="top" data-content="Summary text and Image will be used in block" title=""></i> :
                                    </label>
                                    <div className="col-md-12">
                                        <div className="card border-light">
                                            <div className="card-header py-1 clearfix  bg-gradient-primary text-white">
                                                <div className="card-title font-weight-bold mb-0 float-left mt-1">Box Effect</div>
                                                <div className="card-title font-weight-bold mb-0 float-right">
                                                    <div className="input-group input-group-sm">
                                                        <input style={{ width: '40px' }} type="text" className="form-control add_text" value="1" />
                                                        <span className="input-group-btn">
                                                            <button className="btn btn-info btn-sm add_more" type="button" onClick={addLink}>
                                                                Add
                                                            </button>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">

                                                <div className='table-responsive'>

                                                    <table className="table table-bordered  table-hover table-striped table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    Name
                                                                </th>

                                                                <th>
                                                                    Option
                                                                </th>
                                                                <th>
                                                                    Link
                                                                </th>


                                                                <th>
                                                                    Action
                                                                </th>
                                                            </tr>

                                                        </thead>

                                                        <tbody>




                                                            <>

                                                                {Object.keys(linkData1).map((key) => (
                                                                    <>

                                                                        <tr >
                                                                            <td>
                                                                                <input
                                                                                    type="text"
                                                                                    style={{ flex: '1' }}
                                                                                    className="form-control form-control-sm name_input"
                                                                                    value={linkData1[key].name}
                                                                                    onChange={(e) => handleInputChange1(key, 'name', e.target.value)}
                                                                                    placeholder="Name"
                                                                                />

                                                                            </td>



                                                                            <td>
                                                                                <select
                                                                                    style={{ flex: '1' }}
                                                                                    className="form-control form-control-sm link_type"
                                                                                    value={linkData1[key].type}
                                                                                    onChange={(e) => handleSelectChange1(key, e.target.value)}
                                                                                >
                                                                                    <option value="1">External</option>
                                                                                    <option value="2">Front page</option>
                                                                                    <option value="3">No Link</option>
                                                                                    <option value="4">Content Reference</option>
                                                                                </select>
                                                                            </td>



                                                                            <td>
                                                                                <input
                                                                                    style={{ flex: '1' }}
                                                                                    type="text"
                                                                                    className="form-control form-control-sm select_result"
                                                                                    value={linkData1[key].value}
                                                                                    disabled={!linkData1[key].value.startsWith('https//')}
                                                                                    // disabled={linkData1[key].disabled}
                                                                                    onChange={(e) => handleInputChange1(key, 'value', e.target.value)}
                                                                                />
                                                                                {linkData1[key].type === '4' && (
                                                                                    <div className="input-group-append">
                                                                                        <span
                                                                                            className="input-group-text search_icon"
                                                                                            data-toggle={linkData1[key].type === '4' ? 'modal' : ''}
                                                                                            data-target={linkData1[key].type === '4' ? '#exampleModal' : ''}
                                                                                            onClick={() => openModal1(key)}
                                                                                        >
                                                                                            <i className="fas fa-search"></i>
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                            <td> <button
                                                                                onClick={() => handleRemoveField(key)}
                                                                                type="button" className="btn btn-danger btn-sm float-lg-right float-md-right" ><FaTrash></FaTrash></button></td>

                                                                        </tr>
                                                                    </>
                                                                ))}
                                                            </>

                                                        </tbody>

                                                    </table>
                                                </div>
                                                {/* {Object.keys(linkData1).map((key) => (
                             <div className="form-group row mb-0" key={key}>
                                 <div className="col-md-12">
                                     <div className="input-group input-group-sm">
                                         <input
                                             type="text"
                                             style={{ flex: '1' }}
                                             className="form-control form-control-sm name_input"
                                             value={linkData1[key].name}
                                             onChange={(e) => handleInputChange1(key, 'name', e.target.value)}
                                             placeholder="Name"
                                         />
                                         <select
                                             style={{ flex: '1' }}
                                             className="form-control form-control-sm link_type"
                                             value={linkData1[key].align}
                                             onChange={(e) => handleInputChange1(key, 'align', e.target.value)}
                                         >
                                             <option value="">Button Center</option>
                                             <option value="float-left">Button Left Align</option>
                                             <option value="float-right">Button Right Align</option>
                                         </select>
                                         <select
                                             style={{ flex: '1' }}
                                             className="form-control form-control-sm link_type"
                                             value={linkData1[key].type}
                                             onChange={(e) => handleSelectChange1(key, e.target.value)}
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
                                             value={linkData1[key].value}
                                             disabled={linkData1[key].disabled}
                                             onChange={(e) => handleInputChange1(key, 'value', e.target.value)}
                                         />
                                         {linkData1[key].type === '4' && (
                                             <div className="input-group-append">
                                                 <span
                                                     className="input-group-text search_icon"
                                                     data-toggle={linkData1[key].type === '4' ? 'modal' : ''}
                                                     data-target={linkData1[key].type === '4' ? '#exampleModal' : ''}
                                                     onClick={() => openModal1(key)}
                                                 >
                                                     <i className="fas fa-search"></i>
                                                 </span>
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             </div>
                         ))} */}
                                            </div>
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
                                                                                        event.preventDefault();
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
                                                                                        event.preventDefault();
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
                                                                                {page_list.map((page) => (
                                                                                    <tr
                                                                                        onClick={() => saveModalChanges1(page.page_link)}
                                                                                        key={page.page_name}
                                                                                    >
                                                                                        <td>{page.page_name}</td>
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
                                                                                {page_list_status.map((pageStatus) => (
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
                                                                                {tableData.map((page) => (
                                                                                    <tr onClick={() => saveModalChanges1(`${pageListTable}/${page?.id}`)} key={page.id}>
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
                                                            <button onClick={() => saveModalChanges1('')} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </>
                        )}
                        {formData.pop_up_type == 3 && (
                            <>
                                <div className="form-group row block_div2">
                                    <label className="col-form-label font-weight-bold col-md-3">
                                        Links Name &amp; URL: <i className="fas fa-info-circle text-info" data-toggle="popover" data-placement="top" data-content="Summary text and Image will be used in block" title=""></i> :
                                    </label>
                                    <div className="col-md-12">
                                        <div className="card border-light">
                                            <div className="card-header py-1 clearfix bg-gradient-primary text-white">
                                                <div className="card-title font-weight-bold mb-0 float-left mt-1">Box Effect</div>
                                                <div className="card-title font-weight-bold mb-0 float-right">
                                                    <div className="input-group input-group-sm">
                                                        <input style={{ width: '40px' }} type="text" className="form-control add_text" value="1" readOnly />
                                                        <span className="input-group-btn">
                                                            <button className="btn btn-info btn-sm add_more" type="button" onClick={addLink2}>
                                                                Add
                                                            </button>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className='table-responsive'>

                                                    <table className="table table-bordered table-hover table-striped table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: '170px' }}>Image</th>
                                                                <th>Name</th>

                                                                <th>Option</th>
                                                                <th>Link</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Object.keys(linkData2).map((key) => (
                                                                <tr key={key}>
                                                                    {/* <td>
                                                                    <div>
                                                                        <span style={{ width: '150px' }} className="btn btn-success btn-sm mb-2">
                                                                            <label htmlFor={`fileInput${key}`} className="mb-0">
                                                                                <FaUpload /> Select Image
                                                                            </label>
                                                                            <input
                                                                                type="file"
                                                                                id={`fileInput${key}`}
                                                                                style={{ display: 'none' }}
                                                                                onChange={(e) => type_file_change(key, e)}
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                    {selectedFile2[key] && (
                                                                        <>
                                                                            <img
                                                                                style={{ width: '150px', height: '100px' }}
                                                                                className="mb-2 img-thumbnail"
                                                                                src={URL.createObjectURL(selectedFile2[key])}
                                                                                alt="Uploaded File"
                                                                            />
                                                                            <input type="hidden" name="file_path" value={selectedFile2[key].path} />
                                                                            
                                                                        </>
                                                                    )}
                                                                    {fileErrors[key] && <div className="text-danger">{fileErrors[key]}</div>}
                                                                </td>  */}

                                                                    <td>
                                                                        <div>
                                                                            <span style={{ width: '150px' }} className="btn btn-success btn-sm mb-2">
                                                                                <label htmlFor={`fileInput${key}`} className="mb-0">
                                                                                    <FaUpload /> Select Image
                                                                                </label>
                                                                                <input

                                                                                    type="file"
                                                                                    id={`fileInput${key}`}
                                                                                    style={{ display: 'none' }}
                                                                                    onChange={(e) => type_file_change(key, e)}
                                                                                />
                                                                            </span>
                                                                        </div>

                                                                        {selectedFile2[key] ? (
                                                                            <>
                                                                                <img
                                                                                    style={{ width: '150px', height: '100px' }}
                                                                                    className="mb-2 img-thumbnail"
                                                                                    src={URL.createObjectURL(selectedFile2[key])}
                                                                                    alt="Uploaded File"
                                                                                />
                                                                                <input type="hidden" name="file_path" value={selectedFile2[key].path} />
                                                                            </>
                                                                        ) : (
                                                                            linkData2[key]?.file_path ?
                                                                                <img
                                                                                    style={{ width: '150px', height: '100px' }}
                                                                                    className="mb-2 img-thumbnail"
                                                                                    //   src={block.image} // Use the image path from content_block_list
                                                                                    src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${linkData2[key]?.file_path}`}
                                                                                    alt={key.links_name} // Alt text from links_name
                                                                                />
                                                                                :
                                                                                ''


                                                                        )}

                                                                        {fileErrors[key] && <div className="text-danger">{fileErrors[key]}</div>}
                                                                    </td>

                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={linkData2[key].name}
                                                                            onChange={(e) => handleInputChange2(key, 'name', e.target.value)}
                                                                            placeholder="Name"
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <select
                                                                            className="form-control form-control-sm"
                                                                            value={linkData2[key].type}
                                                                            onChange={(e) => handleSelectChange2(key, e.target.value)}
                                                                        >
                                                                            <option value="1">External</option>
                                                                            <option value="2">Front page</option>
                                                                            <option value="3">No Link</option>
                                                                            <option value="4">Content Reference</option>
                                                                        </select>
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={linkData2[key].value}
                                                                            // disabled={linkData2[key].disabled}
                                                                            disabled={!linkData2[key].value.startsWith('https//')}
                                                                            onChange={(e) => handleInputChange2(key, 'value', e.target.value)}
                                                                        />
                                                                        {linkData2[key].type === '4' && (
                                                                            <div className="input-group-append">
                                                                                <span
                                                                                    className="input-group-text search_icon"
                                                                                    data-toggle={linkData2[key].type === '4' ? 'modal' : ''}
                                                                                    data-target={linkData2[key].type === '4' ? '#exampleModal' : ''}
                                                                                    onClick={() => openModal2(key)}
                                                                                >
                                                                                    <i className="fas fa-search"></i>
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-danger btn-sm"
                                                                            onClick={() => handleRemoveField2(key)}
                                                                        >
                                                                            <FaTrash />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
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
                                                                                        event.preventDefault();
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
                                                                                        event.preventDefault();
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
                                                                                {page_list.map((page) => (
                                                                                    <tr
                                                                                        onClick={() => saveModalChanges2(page.page_link)}
                                                                                        key={page.page_name}
                                                                                    >
                                                                                        <td>{page.page_name}</td>
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
                                                                                {page_list_status.map((pageStatus) => (
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
                                                                                {tableData.map((page) => (
                                                                                    <tr onClick={() => saveModalChanges2(`${pageListTable}/${page?.id}`)} key={page.id}>
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
                                                            <button onClick={() => saveModalChanges2('')} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </>
                        )}
                        {formData.pop_up_type == 4 && (
                            <>
                                <div className="form-group row block_div2">
                                    <label className="col-form-label font-weight-bold col-md-3">
                                        Links Name &amp; URL: <i className="fas fa-info-circle text-info" data-toggle="popover" data-placement="top" data-content="Summary text and Image will be used in block" title=""></i> :
                                    </label>
                                    <div className="col-md-12">
                                        <div className="card border-light">
                                            <div className="card-header py-1 clearfix bg-gradient-primary text-white">
                                                <div className="card-title font-weight-bold mb-0 float-left mt-1">Box Effect</div>
                                                <div className="card-title font-weight-bold mb-0 float-right">
                                                    <div className="input-group input-group-sm">
                                                        <input style={{ width: '40px' }} type="text" className="form-control add_text" value="1" />
                                                        <span className="input-group-btn">
                                                            <button className="btn btn-info btn-sm add_more" type="button" onClick={addLink3}>
                                                                Add
                                                            </button>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className='table-responsive'>

                                                    <table className="table table-bordered table-hover table-striped table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: '150px', }}>Icon</th>
                                                                <th>Name</th>

                                                                <th>Option</th>
                                                                <th>Link</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Object.keys(linkData3).map((key) => (
                                                                <tr key={key}>
                                                                    <td >
                                                                        <IconModalCustomBox
                                                                            index={key}
                                                                            names="page_group_icon"
                                                                            handleInputChange={handleInputChange4}
                                                                            handleDeleteRow={handleDeleteRow}
                                                                            page_group_icon={linkData3[key].page_group_icon}
                                                                            inputValue={linkData3[key]}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={linkData3[key].name}
                                                                            onChange={(e) => handleInputChange3(key, 'name', e.target.value)}
                                                                            placeholder="Name"
                                                                        />
                                                                    </td>
                                                                    {/* <td>
                                    <select
                                        className="form-control form-control-sm"
                                        value={linkData3[key].align}
                                        onChange={(e) => handleInputChange3(key, 'align', e.target.value)}
                                    >
                                        <option value="">Button Center</option>
                                        <option value="float-left">Button Left Align</option>
                                        <option value="float-right">Button Right Align</option>
                                    </select>
                                </td> */}
                                                                    <td>
                                                                        <select
                                                                            className="form-control form-control-sm"
                                                                            value={linkData3[key].type}
                                                                            onChange={(e) => handleSelectChange3(key, e.target.value)}
                                                                        >
                                                                            <option value="1">External</option>
                                                                            <option value="2">Front page</option>
                                                                            <option value="3">No Link</option>
                                                                            <option value="4">Content Reference</option>
                                                                        </select>
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={linkData3[key].value}
                                                                            // disabled={linkData3[key].disabled}
                                                                            disabled={!linkData3[key].value.startsWith('https//')}
                                                                            onChange={(e) => handleInputChange3(key, 'value', e.target.value)}
                                                                        />
                                                                        {linkData3[key].type === '4' && (
                                                                            <div className="input-group-append">
                                                                                <span
                                                                                    className="input-group-text search_icon"
                                                                                    data-toggle="modal"
                                                                                    data-target="#exampleModal"
                                                                                    onClick={() => openModal3(key)}
                                                                                >
                                                                                    <i className="fas fa-search"></i>
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-danger btn-sm"
                                                                            onClick={() => handleRemoveField3(key)}
                                                                        >
                                                                            <FaTrash />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
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
                                                                                        event.preventDefault();
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
                                                                                        event.preventDefault();
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
                                                                                {page_list.map((page) => (
                                                                                    <tr
                                                                                        onClick={() => saveModalChanges3(page.page_link)}
                                                                                        key={page.page_name}
                                                                                    >
                                                                                        <td>{page.page_name}</td>
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
                                                                                {page_list_status.map((pageStatus) => (
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
                                                                                {tableData.map((page) => (
                                                                                    <tr onClick={() => saveModalChanges3(`${pageListTable}/${page?.id}`)} key={page.id}>
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
                                                            <button onClick={() => saveModalChanges3('')} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </>
                        )}

                        <div class="form-group row">
                            <div class="offset-md-3 col-sm-6">
                                <input type="submit" class="btn btn-sm btn-success" name="create" value="Save" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomPageUpdate;