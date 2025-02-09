'use client'
//ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';
import { FaTrash, FaUpload } from 'react-icons/fa';
import "../slider_creates/jssor.slider.min.css"; // Ensure you have the appropriate CSS file for Jssor Slider
import "../js/jssor.slider.min.js"; // Ensure this file exists and is correctly loaded


const SliderUpdate = ({ id }) => {





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

    const [userId, setUserId] = useState(() => {
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

    // const [modalData2, setModalData2] = useState({ index: null, key: '', value: '' });
    // const openModal2 = (key, index) => {
    //     // Set the modal data with index and key
    //     const selectedData = formData[index]?.linkDataValue2[key];
    //     if (selectedData && selectedData.type === '4') {
    //         setModalData2({ index, key, value: selectedData.value });
    //         $('#exampleModal2').modal('show'); // Show the modal
    //     }
    // };

    // const saveModalChanges2 = (page) => {
    //     const { index, key } = modalData2;  // Get the index and key from modalData2

    //     console.log("Saving changes for index:", index, "key:", key, "with page:", page);

    //     setActiveTabs(''); // Clear active tab if needed

    //     // Update the formData with the new page link value
    //     setFormData((prevFormData) => {
    //         const updatedFormData = prevFormData.map((item, itemIndex) => {
    //             if (itemIndex === index) {
    //                 return {
    //                     ...item,
    //                     linkDataValue2: {
    //                         ...item.linkDataValue2,
    //                         [key]: {
    //                             ...item.linkDataValue2[key],
    //                             value: page, // Set the value from the selected page link
    //                         },
    //                     },
    //                 };
    //             }
    //             return item;
    //         });
    //         return updatedFormData;
    //     });

    //     $('#exampleModal2').modal('hide'); // Close the modal
    // };

    const [modalData2, setModalData2] = useState({ index: '', key: '', value: '' });

    // const openModal2 = (key, index) => {
    //     console.log(key, index)
    //     const selectedData = formData.linkDataValue2?.[index]; // Access the correct array element
    //     if (selectedData && selectedData.type == '4') {
    //         setModalData2({ index, key, value: selectedData.value });
    //         $('#exampleModal2').modal('show'); // Show the modal
    //     }
    // };
    const openModal2 = (key, index) => {
        console.log("Selected key:", key, "Selected index:", index); // Log key and index
        const selectedData = formData.linkDataValue2?.[index];
        console.log("Selected Data:", selectedData); // Log the selected data
    
        if (selectedData && selectedData.type === '4') {
            setModalData2({ index, key, value: selectedData.value });
            $('#exampleModal2').modal('show');
        }
    };
    

    const saveModalChanges2 = (page) => {
        // Safely extract index and key from modalData2 with default values
     
        setActiveTabs(''); // Clear active tab if needed
       console.log(modalData2)
    
        setFormData((prevFormData) => {
            // Ensure linkDataValue2 exists as an object
            const updatedLinkDataValue2 = { ...prevFormData.linkDataValue2 };
    
            // Ensure the specified index exists in linkDataValue2
            if (!updatedLinkDataValue2[modalData2.index]) {
                updatedLinkDataValue2[modalData2.index] = {}; // Initialize if it doesn't exist
            }
    
            // Update the value property for the specified index
            updatedLinkDataValue2[modalData2.index] = {
                ...updatedLinkDataValue2[modalData2.index],
                value: page,
            };
    
            console.log("Updated linkDataValue2:", updatedLinkDataValue2);
    
            // Return the updated formData
            return {
                ...prevFormData,
                linkDataValue2: updatedLinkDataValue2,
            };
        });
    
        // Close the modal
        $('#exampleModal2').modal('hide');
    };
    
    


    // const [modalData, setModalData] = useState({ index: '', key: '', value: '' });


    // const openModal = (index, key) => {
    //     console.log("Selected key:", key, "Selected index:", index); // Log key and index
    //     const selectedData = formData.linkDataValue1?.[index];
    //     console.log("Selected Data:", selectedData); // Log the selected data
    
    //     if (selectedData && selectedData.type === '4') {
    //         setModalData({ index, key, value: selectedData.value });
    //         $('#exampleModal2').modal('show');
    //     }


    // };

    // console.log(modalData)



    // const saveModalChanges = (page) => {
    //     const { index, key } = modalData;  // Get the index and key from modalData2

    //     console.log("Saving changes for index:", index, "key:", key, "with page:", page);

    //     setActiveTabs(''); // Clear active tab if needed

    //     // Update the formData with the new page link value
    //     setFormData((prevFormData) => {
    //         const updatedFormData = prevFormData.map((item, itemIndex) => {
    //             if (itemIndex == index) {
    //                 return {
    //                     ...item,
    //                     linkDataValue1: {
    //                         ...item.linkDataValue1,
    //                         [key]: {
    //                             ...item.linkDataValue1[key],
    //                             value: page, // Set the value from the selected page link
    //                         },
    //                     },
    //                 };
    //             }
    //             return item;
    //         });
    //         return updatedFormData;
    //     });

    //     $('#exampleModal').modal('hide'); // Close the modal
    // };

    const [modalData, setModalData] = useState({ index: '', key: '', value: '' });

const openModal = (index, key) => {
    console.log("Selected key:", key, "Selected index:", index); // Log key and index
    const selectedData = formData.linkDataValue2?.[index]?.linkDataValue1?.[key];
    console.log("Selected Data:", selectedData); // Log the selected data

    if (selectedData && selectedData.type === '4') {
        setModalData({ index, key, value: selectedData.value });
        $('#exampleModal').modal('show');
    }
};

const saveModalChanges = (page) => {
    const { index, key } = modalData; // Get the index and key from modalData
    setActiveTabs('');
    console.log("Saving changes for index:", index, "key:", key, "with page:", page);

    setFormData((prevFormData) => {
        // Create a deep copy of the current formData
        const updatedFormData = { ...prevFormData };

        // Update the specific value in linkDataValue1
        if (updatedFormData.linkDataValue2?.[index]?.linkDataValue1?.[key]) {
            updatedFormData.linkDataValue2[index].linkDataValue1[key] = {
                ...updatedFormData.linkDataValue2[index].linkDataValue1[key],
                value: page, // Set the value from the selected page link
            };
        }

        return updatedFormData;
    });

    $('#exampleModal').modal('hide'); // Close the modal
};


    const [formData, setFormData] = useState({});
    const brandInputChange = (event) => {
        const { name, value } = event.target; // Destructure name and value from the event
        setFormData((prevState) => ({
            ...prevState,
            [name]: value, // Dynamically update the key-value pair
        }));
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

    const { data: sales_list_single = []
    } = useQuery({
        queryKey: ['sales_list_single'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/sales_list_single/${id}`)

            const data = await res.json()
            return data
        }
    })


    const handleSelectChange2 = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            linkDataValue2: {
                ...prevData.linkDataValue2,
                [key]: {
                    ...prevData.linkDataValue2[key],
                    type: value, // Update the type based on the selected value
                    value: value == '1' ? 'https//' : value == '2' ? 'font' : value == '3' ? 'no link' : '', // Adjust other values accordingly
                    disabled: value !== '1', // Enable/disable based on the selected value
                },
            },
        }));
    };

    const handleInputChange2 = (key, field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            linkDataValue2: {
                ...prevData.linkDataValue2,
                [key]: {
                    ...prevData.linkDataValue2[key],
                    [field]: value,
                },
            },
        }));
    };

    
    useEffect(() => {
        if (sales_list_single.length > 0) {
            // Populate formData based on the first item of sales_list_single
            const sliderData = sales_list_single[0];

            const updatedFormData = {
                slider_name: sliderData.slider_name || '',
                created_by: sliderData.created_by || userId,
                modified_by: sliderData.modified_by || 0,
                created_date: sliderData.created_date || '',
                modified_date: sliderData.modified_date || '',
                transition: sliderData.transition || '',
                slider_type: sliderData.slider_type || 0,
                slider_design_id: sliderData.slider_design_id || 0,
                linkDataValue2: sliderData.linkDataValue2?.map((linkData) => ({
                    ...linkData,
                    name: linkData.name,
                    status: linkData.status,
                    title: linkData.title,
                    title_sub: linkData.sub_title,
                    summary: linkData.summary,
                    type: linkData.value?.startsWith('https://') ? '1' :
                        linkData.value == 'font' ? '2' :
                            linkData.value == 'no link' ? '3' : '4',
                    disabled: !linkData.value == '', // Disable if no link
                    linkDataValue1: linkData.linkDataValue1?.map((innerLink) => ({
                        ...innerLink,
                        type: innerLink.value?.startsWith('https://') ? '1' :
                            innerLink.value == 'font' ? '2' :
                                innerLink.value == 'no link' ? '3' : '4',
                        disabled: !innerLink.value == '', // Disable if no link
                    })) || [],

                })) || [],
            };

            // Set the updated form data
            setFormData(updatedFormData);
        }
    }, [sales_list_single, userId]);


    // useEffect(() => {
    //     if (!sales_list_single.length) return;

    //     const salesData = sales_list_single[0];

    //     setFormData((prevData) => {
    //         const updatedFormData = salesData.linkDataValue1.map((linkData) => {
    //             const linkDataValue2 = linkData.linkDataValue2 || [];

    //             // Process the linkDataValue2 array
    //             const formattedLinkDataValue2 = linkDataValue2.map((item) => ({
    //                 id: item.id,
    //                 type: item.value === "no link" ? "3" : "2",
    //                 value: item.value,
    //                 name: item.name || "",
    //                 disabled: item.value === "no link" || !item.value,
    //             }));

    //             return {
    //                 file_path: linkData.file_path,
    //                 linkDataValue1: {
    //                     type:
    //                         linkData.value === "no link"
    //                             ? "3" // No Link
    //                             : linkData.value === "font"
    //                             ? "2" // Front Page
    //                             : linkData.value.startsWith("https//")
    //                             ? "1" // External Link
    //                             : "4", // Content Reference
    //                     value: linkData.value || "no link",
    //                     disabled: ["no link", "font", ""].includes(linkData.value),
    //                     name: linkData.name || "",
    //                     align: linkData.align || "",
    //                     show: linkData.show || "1",
    //                 },
    //                 linkDataValue2: formattedLinkDataValue2,
    //             };
    //         });

    //         return {
    //             ...prevData,
    //             slider_name: salesData.slider_name || "",
    //             created_by: salesData.created_by,
    //             modified_by: salesData.modified_by || salesData.created_by,
    //             selectedMonths: salesData.transition
    //                 ? salesData.transition.split(", ").map((item) => {
    //                       const [key, value] = item.split(":");
    //                       return {
    //                           value: item,
    //                           label: key.trim(),
    //                       };
    //                   })
    //                 : [],
    //             formData: updatedFormData,
    //         };
    //     });
    // }, [sales_list_single]);

    // console.log(formData)


    const { data: transition_list = []
    } = useQuery({
        queryKey: ['transition_list'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/transition_list`)

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

    // console.log(linkData)

    // 
    const remove_field = (index) => {
        // Create a shallow copy of formData
        const updatedFormData = { ...formData };
    
        // Remove the object at the specified index from linkDataValue2
        updatedFormData.linkDataValue2 = updatedFormData.linkDataValue2.filter((_, i) => i !== index);
    
        // Update the state
        setFormData(updatedFormData);
    };
    
    


    const [linkData, setLinkData] = useState({
        link1: { type: "1", value: "https//", disabled: false, name: "", align: "", show: "" },
        link2: { type: "1", value: "https//", disabled: false, name: "", align: "", show: "" },
    });
    const [linkData2, setLinkData2] = useState({
        link1: { type: "1", file_path: "", value: "https//", disabled: false, name: "", align: "" },
    });

    const [selectedFile2, setSelectedFile2] = useState({});
    const [fileNames2, setFileNames2] = useState({});
    const [fileErrors, setFileErrors] = useState({});


    // const handleSelectChange = (index, linkKey, value) => {
    //     setFormData((prevFormData) => {
    //         const updatedFormData = [...prevFormData]; // Clone the array

    //         // Update the type and handle other properties accordingly
    //         updatedFormData[index] = {
    //             ...updatedFormData[index],
    //             linkDataValue1: {
    //                 ...updatedFormData[index].linkDataValue1,
    //                 [linkKey]: {
    //                     ...updatedFormData[index].linkDataValue1[linkKey],
    //                     type: value, // Update the type field
    //                     value: value === '1' ? 'https://' : value === '2' ? 'font' : value === '3' ? 'no link' : '',
    //                     disabled: value === '2' || value === '3' || value === '4', // Handle disabled state based on value
    //                 },
    //             },
    //         };

    //         return updatedFormData; // Return the updated state
    //     });
    // };

    // const handleInputChange = (index, linkKey, key, value, type = null) => {
    //     setFormData((prevFormData) => {
    //         const updatedFormData = [...prevFormData]; // Clone the array

    //         // Update the nested properties for the specific index and linkKey
    //         updatedFormData[index] = {
    //             ...updatedFormData[index],
    //             linkDataValue1: {
    //                 ...updatedFormData[index].linkDataValue1,
    //                 [linkKey]: {
    //                     ...updatedFormData[index].linkDataValue1[linkKey],
    //                     [key]: type === "checkbox" ? (value ? "1" : "0") : value, // Handle checkbox values
    //                 },
    //             },
    //         };

    //         return updatedFormData; // Return the updated state
    //     });
    // };

    // const handleSelectChange = (index, linkKey, value) => {

    //     console.log(index, linkKey, value)

    //     setFormData((prevFormData) => {
    //         const updatedFormData = { ...prevFormData }; // Clone the object to update
    
    //         updatedFormData.linkDataValue2[index].linkDataValue1 = updatedFormData.linkDataValue2[index].linkDataValue1.map((linkItem, idx) => {
    //             if (idx == linkKey) {  // Match the correct linkKey in the linkDataValue1 array
    //                 const updatedLinkItem = {
    //                     ...linkItem,
    //                     type: value,
    //                     value: value === '1' ? 'https://' : value === '2' ? 'font' : value === '3' ? 'no link' : '',
    //                     disabled: value === '2' || value === '3' || value === '4', // Set disabled based on the selected value
    //                 };
    //                 return updatedLinkItem;
    //             }
    //             return linkItem;
    //         });
    
    //         return updatedFormData; // Return the updated form data
    //     });
    // };

    // const handleSelectChange = (index, linkKey, value) => {
    //     console.log("Index:", index, "LinkKey:", linkKey, "Value:", value);
    
    //     setFormData((prevFormData) => {
    //         // Deep clone the structure
    //         const updatedFormData = { ...prevFormData };
    //         let updatedLinkDataValue2 = [...updatedFormData?.linkDataValue2];
    //         const updatedLinkDataValue1 = [...updatedLinkDataValue2[index].linkDataValue1];
    
    //         // Update the specific item
    //         updatedLinkDataValue1[linkKey] = {
    //             ...updatedLinkDataValue1[linkKey],
    //             type: value,
    //             value: value === '1' ? 'https://' : value === '2' ? 'font' : value === '3' ? 'no link' : '',
    //             disabled: value === '2' || value === '3' || value === '4',
    //         };
    
    //         // Assign back the updated arrays
    //         updatedLinkDataValue2[index].linkDataValue1 = updatedLinkDataValue1;
    //         updatedFormData.linkDataValue2 = updatedLinkDataValue2;
    
    //         return updatedFormData;
    //     });
    // };
    const handleSelectChange = (index, linkKey, value) => {
        console.log("Index:", index, "LinkKey:", linkKey, "Value:", value);
    
        setFormData((prevFormData) => {
            // Clone the structure
            const updatedFormData = { ...prevFormData };
            const linkDataValue2 = { ...updatedFormData.linkDataValue2 };
    
            // Ensure the index exists in linkDataValue2
            if (!linkDataValue2[index]) {
                console.error(`Index ${index} does not exist in linkDataValue2.`);
                return updatedFormData;
            }
    
            const linkDataValue1 = Array.isArray(linkDataValue2[index].linkDataValue1)
                ? [...linkDataValue2[index].linkDataValue1]
                : []; // Fallback to an empty array if undefined
    
            // Ensure linkKey exists in linkDataValue1
            if (!linkDataValue1[linkKey]) {
                console.error(`LinkKey ${linkKey} does not exist in linkDataValue1.`);
                return updatedFormData;
            }
    
            // Update the specific item
            linkDataValue1[linkKey] = {
                ...linkDataValue1[linkKey],
                type: value,
                value: value === '1' ? 'https://' : value === '2' ? 'font' : value === '3' ? 'no link' : '',
                disabled: value === '2' || value === '3' || value === '4',
            };
    
            // Assign back the updated arrays and objects
            linkDataValue2[index].linkDataValue1 = linkDataValue1;
            updatedFormData.linkDataValue2 = linkDataValue2;
    
            return updatedFormData;
        });
    };
    
    const handleInputChange = (index, linkKey, key, value, type = null) => {
        setFormData((prevFormData) => {
            let updatedFormData = { ...prevFormData };
            // Ensure the structure exists before modification
            if (!updatedFormData.linkDataValue2[index]) return prevFormData;
    
            let linkDataValue1 = [...updatedFormData?.linkDataValue2[index]?.linkDataValue1];
    
            // Update the specific link item
            linkDataValue1[linkKey] = {
                ...linkDataValue1[linkKey],
                [key]: type === "checkbox" ? (value ? "1" : "0") : value,
            };
    
            updatedFormData.linkDataValue2[index] = {
                ...updatedFormData.linkDataValue2[index],
                linkDataValue1,
            };
    
            return updatedFormData; // Return the updated state
        });
    };
    console.log(formData, 'Max file size is 2 MB')
    // const handleInputChange = (index, linkKey, key, value, type = null) => {
    //     console.log(index, linkKey, key, value, type = null)
    //     setFormData((prevFormData) => {
    //         const updatedFormData = { ...prevFormData }; // Clone the object to update
    // console.log(updatedFormData.linkDataValue2[index].linkDataValue1)
    //         updatedFormData.linkDataValue2[index].linkDataValue1 = updatedFormData.linkDataValue2[index].linkDataValue1.map((linkItem, idx) => {
    //          console.log(linkItem, 'linkItem')
    //             if (idx == linkKey) {  // Match the correct linkKey in the linkDataValue1 array
    //                 console.log(idx == linkKey, 'idx == linkKey')
    //                 const updatedLinkItem = {
    //                     ...linkItem,
    //                     [key]: type === "checkbox" ? (value ? "1" : "0") : value, // Handle checkbox change
    //                 };
    //                 return updatedLinkItem;
    //             }
    //             return linkItem;
    //         });
    
    //         return updatedFormData; // Return the updated form data
    //     });
    // };

    
    // Handle file input change
    // const type_file_change = (key, e) => {
    //     e.preventDefault();
    //     const file = e.target.files[0];

    //     if (!file) return;

    //     if (file.size > 2097152) {
    //         setFileErrors((prev) => ({ ...prev, [key]: "Max file size is 2 MB" }));
    //         return;
    //     }

    //     const now = new Date();
    //     const year = now.getFullYear();
    //     const month = String(now.getMonth() + 1).padStart(2, "0");
    //     const day = String(now.getDate()).padStart(2, "0");
    //     const hours = String(now.getHours()).padStart(2, "0");
    //     const minutes = String(now.getMinutes()).padStart(2, "0");

    //     const fileName = file.name.split(".")[0];
    //     const extension = file.name.split(".").pop();
    //     const newName = `${fileName}(${key}).${extension}`;
    //     const filePath = `custom_page/${year}/${month}/${day}/${hours}/${minutes}/${fileName}.${extension}`;

    //     setSelectedFile2((prevState) => ({ ...prevState, [key]: file }));
    //     setFileNames2((prevState) => ({ ...prevState, [key]: newName }));
       
        
        

    //     upload2(file, filePath);
    // };
    
    // const type_file_change = (key, e) => {
    //     e.preventDefault();
    //     const file = e.target.files[0];
    
    //     if (!file) return;
    
    //     if (file.size > 2097152) {
    //         setFileErrors((prev) => ({ ...prev, [key]: "Max file size is 2 MB" }));
    //         return;
    //     }
    
    //     const now = new Date();
    //     const year = now.getFullYear();
    //     const month = String(now.getMonth() + 1).padStart(2, "0");
    //     const day = String(now.getDate()).padStart(2, "0");
    //     const hours = String(now.getHours()).padStart(2, "0");
    //     const minutes = String(now.getMinutes()).padStart(2, "0");
    
    //     const fileName = file.name.split(".")[0];
    //     const extension = file.name.split(".").pop();
    //     const newName = `${fileName}(${key}).${extension}`;
    //     const filePath = `custom_page/${year}/${month}/${day}/${hours}/${minutes}/${fileName}.${extension}`;
    
    //     setSelectedFile2((prevState) => ({ ...prevState, [key]: file }));
    //     setFileNames2((prevState) => ({ ...prevState, [key]: newName }));
    
    //     // Find the existing linkDataValue2 and update only the file_path
    //     const updatedLinkDataValue2 = {
    //         ...formData.linkDataValue2,
    //         [key]: {
    //             ...formData.linkDataValue2[key],
    //             file_path: filePath, // Update only the file_path here
    //         }
    //     };
    
    //     // Update the formData state
    //     setFormData((prevState) => ({
    //         ...prevState,
    //         linkDataValue2: updatedLinkDataValue2,
    //     }));
    
    //     upload2(file, filePath);
    // };
    
    const type_file_change = (key, e) => {
        e.preventDefault();
        const file = e.target.files[0];
    
        if (!file) return;
    
        if (file.size > 2097152) {
            setFileErrors((prev) => ({ ...prev, [key]: "Max file size is 2 MB" }));
            return;
        }
    
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
    
        const fileName = file.name.split(".")[0];
        const extension = file.name.split(".").pop();
        const newName = `${fileName}(${key}).${extension}`;
        const filePath = `custom_page/${year}/${month}/${day}/${hours}/${minutes}/${fileName}.${extension}`;
    
        setSelectedFile2((prevState) => ({ ...prevState, [key]: file }));
        setFileNames2((prevState) => ({ ...prevState, [key]: newName }));
    
        // Find the next available index in linkDataValue2
        const nextIndex = Object.keys(formData.linkDataValue2).length;
    
        // Create the new fileInput object at the next index
        const updatedLinkDataValue2 = {
            ...formData.linkDataValue2,
            [nextIndex]: {
                file_path: filePath,
                linkDataValue1: [
                    ...formData.linkDataValue2[nextIndex]?.linkDataValue1 || [],
                     { type: "1", value: "https://",disabled: false, name: "", align: "", show: "" },
                     { type: "1", value: "https://",disabled: false, name: "", align: "", show: "" },
                ],
            },
        };
        
    
        // Update the formData state
        setFormData((prevState) => ({
            ...prevState,
            linkDataValue2: updatedLinkDataValue2,
        }));
    
        upload2(file, filePath);
    };
    
    // File upload function
    const upload2 = (file, path) => {
        const formData = new FormData();
        formData.append("files", file);
        formData.append("path", path);

        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}:5003/custom_page/custom_page_image`, formData)
            .then((res) => {
                console.log("File uploaded successfully:", res.data);
            })
            .catch((error) => {
                console.error("Error uploading file:", error);
            });
    };


    console.log(formData)


    const [selectedMonths, setSelectedMonths] = useState([]);



    // Handle changes in selection
    const handleChange = (selectedOptions) => {
        setSelectedMonths(selectedOptions || []);
    };
    const formatString = (str) => {
        const words = str?.split('_');

        const formattedWords = words?.map((word) => {
            const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return capitalizedWord;
        });

        return formattedWords?.join(' ');
    };



// const columnListSelected = sales_list_single[0]?.transition;

// console.log(columnListSelected);

// // Extract { ... } blocks and convert to objects
// const columnListSelectedArrays = columnListSelected
//   ?.match(/{[^}]+}/g) // Extracts substrings that are valid { ... } blocks
//   .map(item => {
//     try {
//       // Replace `Jease` placeholder if it exists, so it doesn't throw an error
//       const cleanedItem = item.replace(/Jease\.[A-Za-z]+/g, '"placeholder"');
      
//       // Convert the string to an object using `JSON.parse`
//       return JSON.parse(cleanedItem
//         .replace(/(\w+):/g, '"$1":') // Add double quotes around keys
//         .replace(/'/g, '"')          // Replace single quotes with double quotes
//       );
//     } catch (error) {
//       console.error("Parsing error for:", item);
//       return null;
//     }
//   });

// console.log(columnListSelectedArrays);
const columnListSelected = sales_list_single[0]?.transition;



let columnListSelectedArray = columnListSelected?.match(/(\{Duration:[\s\S]*?)(?=\{Duration:|$)/g);
columnListSelectedArray = columnListSelectedArray?.map(item => item.replace(/,\s*$/, ''));

console.log(columnListSelectedArray?.map(column => {
    const matchingTransition = transition_list.filter(
        transition => transition.transition_code === column.trim()
    );
    return matchingTransition.map(transition => ({
        label: transition.transition_name,
        value: transition.transition_code
    }));
}).flat())

// const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());

// Clean and organize each part


// console.log(splitTransitions);



console.log(columnListSelectedArray)

    const router = useRouter()

    const slider_edit = (event) => {
        event.preventDefault();
        const form = event.target;
        const slider_name = form.slider_name.value
        const allData = {
            formData, selectedMonths, slider_name, created_by: userId
        }


        console.log(allData)

        //${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/slider_update/${id}

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/slider_update/${id}`, {
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
                    // router.push('/Admin/pop_up/pop_up_all?page_group=dynamic_website')

                }
            })
            .then((data) => {
                console.log(data)

                if (data) {
                    sessionStorage.setItem("message", "Data saved successfully!");
                    // router.push('/Admin/pop_up/pop_up_all?page_group=dynamic_website')

                }
            })
            .catch((error) => console.error(error));
        // }
    }



    // const renderLinkRow = (label, linkKey, index) => {
    //     // Access the correct link data from formData based on the index and linkKey
    //     const currentLinkData = formData.linkDataValue2[index]?.linkDataValue1[index];
    //     console.log(label, linkKey, index)
    //     console.log(currentLinkData)
    //     if (!currentLinkData) return null; // Return null if currentLinkData is undefined

    //     return (
    //         <div key={index} className="input-group input-group-sm mb-2">
    //             {/* Link Form Elements */}
    //             <input
    //                 style={{ flex: '1' }}
    //                 type="text"
    //                 className="form-control form-control-sm name_input w-25"
    //                 value={currentLinkData.name || ''}
    //                 onChange={(e) => handleInputChange(index, linkKey, 'name', e.target.value)}
    //                 placeholder={`${label} Name`}
    //             />
    //             <select
    //                 style={{ flex: '1' }}
    //                 className="form-control form-control-sm link_type"
    //                 value={currentLinkData.align || ''}
    //                 onChange={(e) => handleInputChange(index, linkKey, 'align', e.target.value)}
    //             >
    //                 <option value="">Button Center</option>
    //                 <option value="float-left">Button Left Align</option>
    //                 <option value="float-right">Button Right Align</option>
    //             </select>

    //             <div className="input-group-append" data-toggle="popover" title="" data-content="If you tick 'Scheduled' Pop Up will run given scheduled every day. Not whole Day" data-original-title="Scheduled">
    //                 <div className="input-group-text">
    //                     <input
    //                         style={{ flex: '1' }}
    //                         onChange={(e) => handleInputChange(index, linkKey, 'show', e.target.checked ? "1" : "0", 'checkbox')}
    //                         checked={currentLinkData.show === "1"}
    //                         type="checkbox"
    //                         aria-label="Checkbox for following text input"
    //                         value={currentLinkData.show}
    //                     />
    //                 </div>
    //                 <span className="input-group-text"><i className="fas fa-info-circle mr-1"></i>Button Show</span>
    //             </div>
    //             <select
    //                 style={{ flex: '1' }}
    //                 className="form-control form-control-sm link_type w-25"
    //                 value={currentLinkData.type || ''}
    //                 onChange={(e) => handleSelectChange(index, linkKey, e.target.value)}
    //             >
    //                 <option value="1">External</option>
    //                 <option value="2">Front page</option>
    //                 <option value="3">No Link</option>
    //                 <option value="4">Content Reference</option>
    //             </select>
    //             <input
    //                 style={{ flex: '1' }}
    //                 type="text"
    //                 className="form-control form-control-sm select_result w-25"
    //                 value={currentLinkData.value || ''}
    //                 disabled={currentLinkData.disabled}
    //                 onChange={(e) => handleInputChange(index, linkKey, 'value', e.target.value)}
    //             />
    //             {currentLinkData.type == '4' && (
    //                 <div className="input-group-append">
    //                     <span
    //                         style={{ flex: '1' }}
    //                         className="input-group-text search_icon"
    //                         data-toggle={currentLinkData.type == '4' ? 'modal' : ''}
    //                         data-target={currentLinkData.type == '4' ? '#exampleModal' : ''}
    //                         onClick={() => currentLinkData.type == '4' && openModal(index, linkKey)}
    //                     >
    //                         <i className="fas fa-search"></i>
    //                     </span>
    //                 </div>
    //             )}
    //         </div>
    //     );
    // };
    // const renderLinkRow = (label, linkKey, index) => {
    //     const currentLinkData = formData.linkDataValue2[index]?.linkDataValue1[linkKey];
    //     if (!currentLinkData) return null;
    
    //     return (
    //         <div key={`${index}-${linkKey}`} className="input-group input-group-sm mb-2">
    //             {/* Name Input */}
    //             <input
    //                 style={{ flex: '1' }}
    //                 type="text"
    //                 className="form-control form-control-sm name_input w-25"
    //                 value={currentLinkData.name || ''}
    //                 onChange={(e) => handleInputChange(index, linkKey, 'name', e.target.value)}
    //                 placeholder={`${label} Name`}
    //             />
    //             {/* Alignment Dropdown */}
    //             <select
    //                 style={{ flex: '1' }}
    //                 className="form-control form-control-sm link_type"
    //                 value={currentLinkData.align || ''}
    //                 onChange={(e) => handleInputChange(index, linkKey, 'align', e.target.value)}
    //             >
    //                 <option value="">Button Center</option>
    //                 <option value="float-left">Button Left Align</option>
    //                 <option value="float-right">Button Right Align</option>
    //             </select>
    //             {/* Checkbox */}
    //             <div className="input-group-append">
    //                 <div className="input-group-text">
    //                     <input
    //                         type="checkbox"
    //                         checked={currentLinkData.show === "1"}
    //                         onChange={(e) => handleInputChange(index, linkKey, 'show', e.target.checked, 'checkbox')}
    //                     />
    //                 </div>
    //                 <span className="input-group-text">
    //                     <i className="fas fa-info-circle mr-1"></i>Button Show
    //                 </span>
    //             </div>
    //             {/* Link Type Dropdown */}
    //             <select
    //                 style={{ flex: '1' }}
    //                 className="form-control form-control-sm link_type w-25"
    //                 value={currentLinkData.type || ''}
    //                 onChange={(e) => handleSelectChange(index, linkKey, e.target.value)}
    //             >
    //                 <option value="1">External</option>
    //                 <option value="2">Front page</option>
    //                 <option value="3">No Link</option>
    //                 <option value="4">Content Reference</option>
    //             </select>
    //             {/* Link Value Input */}
    //             <input
    //                 style={{ flex: '1' }}
    //                 type="text"
    //                 className="form-control form-control-sm select_result w-25"
    //                 value={currentLinkData.value || ''}
    //                 // disabled={currentLinkData.disabled}
    //                 disabled={currentLinkData.type !== '1'}
    //                 onChange={(e) => handleInputChange(index, linkKey, 'value', e.target.value)}
    //             />
    //             {/* Conditional Modal Button */}
    //             {currentLinkData.type === '4' && (
    //                 <div className="input-group-append">
    //                     <span
    //                         style={{ flex: '1' }}
    //                                                 className="input-group-text search_icon"
    //                                                 data-toggle={currentLinkData.type == '4' ? 'modal' : ''}
    //                                                 data-target={currentLinkData.type == '4' ? '#exampleModal' : ''}
    //                                                 onClick={() => currentLinkData.type == '4' && openModal(index, linkKey)}
    //                     >
    //                         <i className="fas fa-search"></i>
    //                     </span>
    //                 </div>
    //             )}
    //         </div>
    //     );
    // };

   
    const handleDelete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete item`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/slider_img_link_delete/${id}`, {
                method: "POST",

            })
                .then(Response => Response.json())
                .then(data => {

                    if (data) {
                        // refetch()
                        // caregory_list()
                        // slider_search()

                    }
                })
        }
    }
    useEffect(() => {
    
        setTimeout(() => {
            slideshow_transition_controller_starter("slider1_container");
                    }, 1000)
      }, []);


      

    const renderLinkRow = (label, linkKey, index) => {
        const currentIndexData = formData.linkDataValue2[index];
        const currentLinkData = currentIndexData?.linkDataValue1?.[linkKey];
    
        // If the data does not exist, return null
        if (!currentIndexData || !currentLinkData) {
            return null;
        }
    
        return (
            <div key={`${index}-${linkKey}`} className="input-group input-group-sm mb-2">
                {/* Name Input */}
                <input
                    style={{ flex: '1' }}
                    type="text"
                    className="form-control form-control-sm name_input w-25"
                    value={currentLinkData.name || ''}
                    onChange={(e) => handleInputChange(index, linkKey, 'name', e.target.value)}
                    placeholder={`${label} Name`}
                />
                {/* Alignment Dropdown */}
                <select
                    style={{ flex: '1' }}
                    className="form-control form-control-sm link_type"
                    value={currentLinkData.align || ''}
                    onChange={(e) => handleInputChange(index, linkKey, 'align', e.target.value)}
                >
                    <option value="">Button Center</option>
                    <option value="float-left">Button Left Align</option>
                    <option value="float-right">Button Right Align</option>
                </select>
                {/* Checkbox */}
                <div className="input-group-append">
                    <div className="input-group-text">
                        <input
                            type="checkbox"
                            checked={currentLinkData.show === "1"}
                            onChange={(e) => handleInputChange(index, linkKey, 'show', e.target.checked, 'checkbox')}
                        />
                    </div>
                    <span className="input-group-text">
                        <i className="fas fa-info-circle mr-1"></i>Button Show
                    </span>
                </div>
                {/* Link Type Dropdown */}
                <select
                    style={{ flex: '1' }}
                    className="form-control form-control-sm link_type w-25"
                    value={currentLinkData.type || ''}
                    onChange={(e) => handleSelectChange(index, linkKey, e.target.value)}
                >
                    <option value="1">External</option>
                    <option value="2">Front page</option>
                    <option value="3">No Link</option>
                    <option value="4">Content Reference</option>
                </select>
                {/* Link Value Input */}
                <input
                    style={{ flex: '1' }}
                    type="text"
                    className="form-control form-control-sm select_result w-25"
                    value={currentLinkData.value || ''}
                    disabled={currentLinkData.type !== '1'}
                    onChange={(e) => handleInputChange(index, linkKey, 'value', e.target.value)}
                />
                {/* Conditional Modal Button */}
                {currentLinkData.type === '4' && (
                    <div className="input-group-append">
                        <span
                            style={{ flex: '1' }}
                            className="input-group-text search_icon"
                            data-toggle={currentLinkData.type === '4' ? 'modal' : ''}
                            data-target={currentLinkData.type === '4' ? '#exampleModal' : ''}
                            onClick={() => currentLinkData.type === '4' && openModal(index, linkKey)}
                        >
                            <i className="fas fa-search"></i>
                        </span>
                    </div>
                )}
            </div>
        );
    };
    
    // Rendering the rows
    // <div className="mt-2">
    //     {renderLinkRow('Link1', 0, index)} {/* Pass index here */}
    //     {renderLinkRow('Link2', 1, index)} {/* Pass index here */}
    // </div>;
    

    return (
        <div className="col-md-12 bg-light body-content p-4">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-gradient-primary py-1 text-white d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Create Slider</h5>
                    <a
                        href="https://usms.urbanitsolution.com/Admin/slider/slider_all?page_group=dynamic_website"
                        className="btn btn-sm btn-info"
                    >
                        Back to Slider List
                    </a>
                </div>
                <div className="alert alert-warning mx-4 mt-4 text-danger font-weight-bold">
                    (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) fields required
                </div>
                <div className="card-body bg-gradient-light">
                    <form className="form-horizontal" method="post" autoComplete="off" onSubmit={slider_edit}>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-7">
                                    <div className="form-group row">
                                        <label className="col-md-3 col-form-label font-weight-bold">
                                            Slider Name:
                                            <small>
                                                <sup>
                                                    <i className="text-danger fas fa-star"></i>
                                                </sup>
                                            </small>
                                        </label>
                                        <div className="col-md-9">
                                            <input
                                                type="text"
                                                onChange={brandInputChange}
                                                value={formData.slider_name}
                                                name="slider_name"
                                                className="form-control form-control-sm"
                                                placeholder="Enter Slider Name"

                                            />
                                        </div>
                                    </div>

                                    <div className="card mb-3 shadow-sm">
                                        <div className="card-header bg-gradient-primary text-white py-1 d-flex justify-content-between align-items-center">
                                            <h6 className="card-title mb-0">Image List</h6>
                                            <span style={{ width: "150px" }} className="btn btn-success btn-sm mb-2">
                                                <label htmlFor={`fileInput`} className="mb-0">
                                                    <FaUpload /> Select Image
                                                </label>
                                                <input
                                                    type="file"
                                                    id={`fileInput`}
                                                    style={{ display: "none" }}
                                                    onChange={(e) => type_file_change("fileInput", e)}
                                                />
                                            </span>
                                        </div>
                                        <div className="media-body">
                                            <div style={{ width: "100%" }}>
                                            <ul style={{ listStyleType: "none", padding: 0 }}>
                                                    {Object?.entries(formData?.linkDataValue2 || {}).map(([key, data] , index) => (
                                                        <li
                                                            key={key}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "flex-start",
                                                                marginBottom: "8px",
                                                                border: "1px solid #ddd",
                                                                padding: "8px",
                                                                borderRadius: "4px",
                                                            }}
                                                        >
                                                            <img
                                                                src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${data.file_path}`}
                                                                alt="Slider"
                                                                style={{ width: "50px", height: "auto", marginRight: "8px" }}
                                                            />
                                                            <div style={{ flex: 1, marginRight: "8px" }}>
                                                                <div
                                                                    style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}
                                                                >
                                                                    <select
                                                                        className="form-control form-control-sm"
                                                                        value={data.type}
                                                                        onChange={(e) => handleSelectChange2(key, e.target.value)}
                                                                    >
                                                                        <option value="1">External</option>
                                                                        <option value="2">Front page</option>
                                                                        <option value="3">No Link</option>
                                                                        <option value="4">Content Reference</option>
                                                                    </select>

                                                                    <input
                                                                        type="text"
                                                                        className="form-control form-control-sm"
                                                                        value={data.value}
                                                                        disabled={data.disabled}
                                                                        onChange={(e) => handleInputChange2(key, "value", e.target.value)}
                                                                    />
                                                                    {
                                                                        data.type == '4' &&
                                                                        <div className="input-group-append">
                                                                            <span
                                                                                className="input-group-text search_icon"
                                                                                data-toggle={data.type == '4' ? 'modal' : ''}
                                                                                data-target={data.type == '4' ? '#exampleModal2' : ''}
                                                                                onClick={() => openModal2(key, index)}
                                                                            >
                                                                                <i className="fas fa-search"></i>
                                                                            </span>
                                                                            <div className="modal fade" id="exampleModal2" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                                                                                                onClick={() => saveModalChanges2(page.page_link, index)}
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
                                                                    }
                                                                </div>
                                                                <h5 style={{ margin: "0 0 8px 0" }}>
                                                                    <input
                                                                        name="name"
                                                                        value={ data.name}
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Enter name"
                                                                        type="text"
                                                                        style={{ width: "100%" }}
                                                                        onChange={(e) => handleInputChange2(key, "name", e.target.value)} // Pass index here
                                                                    />
                                                                </h5>
                                                                <h5 style={{ margin: "0 0 8px 0" }}>
                                                                    <input
                                                                        name="title_sub"
                                                                        value={ data.title_sub}
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Enter Sub Title"
                                                                        type="text"
                                                                        style={{ width: "100%" }}
                                                                        onChange={(e) => handleInputChange2(key, "title_sub", e.target.value)} // Pass index here
                                                                    />
                                                                </h5>
                                                                <h5 style={{ margin: "0 0 8px 0" }}>

                                                                    <select 
                                                                     value={ data.status}
                                                                    style={{ width: "100%" }}
                                                                        onChange={(e) => handleInputChange2(key, "status", e.target.value)} name="status" class="form-control form-control-sm mt-2 " id="status">
                                                                        <option value="">Select Status</option>
                                                                        <option value="1" >Active</option>
                                                                        <option value="2">Inactive</option>
                                                                        <option value="3">Pending</option>
                                                                    </select>
                                                                </h5>
                                                                <textarea
                                                                 value={ data.summary}
                                                                    name="summary"
                                                                    className="form-control form-control-sm"
                                                                    placeholder="Enter Brief"
                                                                    style={{ width: "100%" }}
                                                                    onChange={(e) => handleInputChange2(key, "summary", e.target.value)} // Pass index here
                                                                />

                                                                <div className='mt-2'>
                                                                    {renderLinkRow('Link1', 0, index)} {/* Pass index here */}
                                                                    {renderLinkRow('Link2', 1, index)} {/* Pass index here */}
                                                                </div>
                                                                <h5 style={{ margin: "0 0 8px 0" }}>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger btn-sm form-control form-control-sm mb-2"
                                                                        onClick={() =>{ remove_field(index), handleDelete(data.id)}}
                                                                    >
                                                                        <i className="fas fa-trash-alt"></i>
                                                                    </button>
                                                                </h5>

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

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>


                                              
                                            </div>
                                        </div>
                                    </div>


                                    <div className="form-group row">
                                        <label className="col-md-3 col-form-label font-weight-bold">
                                            Transition (Animation):
                                            <small>
                                                <sup>
                                                    <i className="text-danger fas fa-star"></i>
                                                </sup>
                                            </small>
                                        </label>
                                        <div className="col-md-9">
                                            <Select
                                                multi
                                                options={transition_list.map((transition) => ({
                                                    value: transition.transition_code, // value is transition_code
                                                    label: transition.transition_name, // label is transition_name
                                                }))}
                                                values={columnListSelectedArray?.map(column => {
                                                    const matchingTransition = transition_list.filter(
                                                        transition => transition.transition_code == column.trim()
                                                    );
                                                    return matchingTransition.map(transition => ({
                                                        label: transition.transition_name,
                                                        value: transition.transition_code
                                                    }));
                                                }).flat()}
                                     
                                                onChange={(e) => {
                                                    handleChange(e);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-12 text-right">
                                            <button
                                                type="submit"
                                                className="btn btn-success btn-sm"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="card shadow-sm">
                                        <div className="card-header bg-gradient-primary text-white py-1">
                                            <h6 className="card-title mb-0">Transition Animation Example</h6>
                                        </div>
                                        <div style={{ backgroundColor: '', color: '#fff', margin: 0, padding: 0, fontFamily: 'Helvetica, Arial, sans-serif' }}>
      

      <table cellpadding="0" cellspacing="0" border="0" align="center">
        <tr>
          <td width="850" height="20"></td>
        </tr>
      </table>

      <table cellpadding="0" cellspacing="0" border="0" bgcolor="#EEEEEE" align="center" style={{ color: '#000' }}>
        <tr>
          <td width="10"></td>
          <td width="110"><b>&nbsp; Select Transition</b></td>
          <td width="320" height="40">
            <select name="ssTransition" id="ssTransition" style={{ width: '300px' }}>
              <option value=""></option>
            </select>
          </td>
          <td width="490" className='d-none'>
            <input type="button" value="Play" id="sButtonPlay" style={{ width: '110px' }} name="sButtonPlay" disabled="disabled" />
          </td>
          <td width="30"></td>
        </tr>
      </table>

      <table className='d-none' cellpadding="0" cellspacing="0" border="0" bgcolor="#EEEEEE" align="center" style={{ color: '#000', backgroundColor: 'silver' }}>
        <tr>
          <td width="10" height="40"></td>
          <td width="110"><b>&nbsp; Transition Code</b></td>
          <td width="840" valign="center">
            <input id="stTransition" style={{ width: '833px', height: '25px' }} type="text" name="stTransition" />
          </td>
        </tr>
      </table>

      <div style={{ height: '30px' }}></div>

      <div style={{ position: 'relative', margin: '0 auto', width: '600px', height: '240px' }} id="slider1_container">
        <div data-u="loading" className="jssorl-009-spin" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <img style={{ marginTop: '-19px', position: 'relative', top: '50%', width: '38px', height: '38px' }} src="../svg/loading/static-svg/spin.svg" alt="Loading" />
        </div>
        <div u="slides" style={{ position: 'absolute', width: '600px', height: '240px', top: 0, left: 0, overflow: 'hidden' }}>
          <div>
            <img u="image" src="https://usms.urbanitsolution.com/web_content/img/1.jpg" alt="Slide 1" />
          </div>
          <div>
            <img u="image" src="https://usms.urbanitsolution.com/web_content/img/2.jpg" alt="Slide 2" />
          </div>
        </div>
      </div>

      <div style={{ height: '30px' }}></div>

     

      {/* <table align="center" border="0" cellSpacing="0" cellPadding="0" style={{ width: '800px', height: '50px' }}>
        <tr>
          <td></td>
        </tr>
      </table> */}

     
    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SliderUpdate;



// 'use client'
// //ismile
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import Select from 'react-dropdown-select';
// import { FaTrash, FaUpload } from 'react-icons/fa';
// import "../slider_creates/jssor.slider.min.css"; // Ensure you have the appropriate CSS file for Jssor Slider
// import "../js/jssor.slider.min.js"; // Ensure this file exists and is correctly loaded


// const SliderUpdate = ({ id }) => {


//     const [userId, setUserId] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('userId') || '';
//         }
//         return '';
//     });

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedUserId = localStorage.getItem('userId');
//             setUserId(storedUserId);
//         }
//     }, []);


//     const [formData, setFormData] = useState([]);


//     const { data: sales_list_single = []
//     } = useQuery({
//         queryKey: ['sales_list_single'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/sales_list_single/${id}`)

//             const data = await res.json()
//             return data
//         }
//     })


//     useEffect(() => {
//         if (sales_list_single.length > 0) {
//             // Populate formData based on the first item of sales_list_single
//             const sliderData = sales_list_single[0];

//             const updatedFormData = {
//                 slider_name: sliderData.slider_name || '',
//                 created_by: sliderData.created_by || userId,
//                 modified_by: sliderData.modified_by || 0,
//                 created_date: sliderData.created_date || '',
//                 modified_date: sliderData.modified_date || '',
//                 transition: sliderData.transition || '',
//                 slider_type: sliderData.slider_type || 0,
//                 slider_design_id: sliderData.slider_design_id || 0,
//                 linkDataValue2: sliderData.linkDataValue2?.map((linkData) => ({
//                     ...linkData,
//                     type: linkData.value?.startsWith('https//') ? '1' :
//                         linkData.value == 'font' ? '2' :
//                             linkData.value == 'no link' ? '3' : '4',
//                     disabled: !linkData.value == '', // Disable if no link
//                     linkDataValue1: linkData.linkDataValue1?.map((innerLink) => ({
//                         ...innerLink,
//                         type: innerLink.value?.startsWith('https//') ? '1' :
//                             innerLink.value == 'font' ? '2' :
//                                 innerLink.value == 'no link' ? '3' : '4',
//                         disabled: !innerLink.value == '', // Disable if no link
//                     })) || [],

//                 })) || [],
//             };

//             // Set the updated form data
//             setFormData(updatedFormData);
//         }
//     }, [sales_list_single, userId]);

//     console.log(formData)

//     const [linkData2, setLinkData2] = useState({
//         link1: { type: "1", file_path: "", value: "https//", disabled: false, name: "", align: "" },
//     });

//     const [selectedFile2, setSelectedFile2] = useState({});
//     const [fileNames2, setFileNames2] = useState({});
//     const [fileErrors, setFileErrors] = useState({});


//     const handleSelectChange2 = (key, value) => {
//         setFormData((prevData) => ({
//             ...prevData,
//             linkDataValue2: {
//                 ...prevData.linkDataValue2,
//                 [key]: {
//                     ...prevData.linkDataValue2[key],
//                     type: value, // Update the type based on the selected value
//                     value: value == '1' ? 'https//' : value == '2' ? 'font' : value == '3' ? 'no link' : '', // Adjust other values accordingly
//                     disabled: value !== '1', // Enable/disable based on the selected value
//                 },
//             },
//         }));
//     };

//     const handleInputChange2 = (key, field, value) => {
//         setFormData((prevData) => ({
//             ...prevData,
//             linkDataValue2: {
//                 ...prevData.linkDataValue2,
//                 [key]: {
//                     ...prevData.linkDataValue2[key],
//                     [field]: value,
//                 },
//             },
//         }));
//     };



//     // Handle file input change
//     const type_file_change = (key, e) => {
//         e.preventDefault();
//         const file = e.target.files[0];

//         if (!file) return;

//         if (file.size > 2097152) {
//             setFileErrors((prev) => ({ ...prev, [key]: "Max file size is 2 MB" }));
//             return;
//         }

//         const now = new Date();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, "0");
//         const day = String(now.getDate()).padStart(2, "0");
//         const hours = String(now.getHours()).padStart(2, "0");
//         const minutes = String(now.getMinutes()).padStart(2, "0");

//         const fileName = file.name.split(".")[0];
//         const extension = file.name.split(".").pop();
//         const newName = `${fileName}(${key}).${extension}`;
//         const filePath = `custom_page/${year}/${month}/${day}/${hours}/${minutes}/${fileName}.${extension}`;

//         setSelectedFile2((prevState) => ({ ...prevState, [key]: file }));
//         setFileNames2((prevState) => ({ ...prevState, [key]: newName }));
//         setFormData((prevState) => [
//             ...prevState,
//             {
//                 file_path: filePath,

//                 linkDataValue2: { ...linkData2 },
//                 linkDataValue1: { ...linkData },
//             },
//         ]);

//         upload2(file, filePath);
//     };



//     // File upload function
//     const upload2 = (file, path) => {
//         const formData = new FormData();
//         formData.append("files", file);
//         formData.append("path", path);

//         axios
//             .post(`${process.env.NEXT_PUBLIC_API_URL}:5003/custom_page/custom_page_image`, formData)
//             .then((res) => {
//                 console.log("File uploaded successfully:", res.data);
//             })
//             .catch((error) => {
//                 console.error("Error uploading file:", error);
//             });
//     };


//     const router = useRouter()
//     const [linkData, setLinkData] = useState({
//         link1: { type: "1", value: "https//", disabled: false, name: "", align: "", show: "" },
//         link2: { type: "1", value: "https//", disabled: false, name: "", align: "", show: "" },
//     });

//     const slider_create = (event) => {
//         event.preventDefault();
//         const form = event.target;
//         const slider_name = form.slider_name.value
//         const allData = {
//             formData, slider_name, created_by: userId
//         }


//         console.log(allData)

//         //${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/slider_create

//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/slider_create`, {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json',
//             },
//             body: JSON.stringify(allData),
//         })
//             .then((Response) => {

//                 Response.json()
//                 if (Response) {
//                     sessionStorage.setItem("message", "Data saved successfully!");
//                     // router.push('/Admin/pop_up/pop_up_all?page_group=dynamic_website')

//                 }
//             })
//             .then((data) => {
//                 console.log(data)

//                 if (data) {
//                     sessionStorage.setItem("message", "Data saved successfully!");
//                     // router.push('/Admin/pop_up/pop_up_all?page_group=dynamic_website')

//                 }
//             })
//             .catch((error) => console.error(error));
//         // }
//     }


//     const handleInputChangeForTitle = (value, index) => {
//         setFormData((prevFormData) => {
//             // Clone the current formData array
//             const updatedFormData = [...prevFormData];
    
//             // Update the specific field in the array based on index
//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue2: {
//                     ...updatedFormData[index].linkDataValue2, // Keep the other properties intact
//                     title: value, // Update the title field
//                 },
//             };
    
//             // Return the updated formData
//             return updatedFormData;
//         });
//     };
    
//     console.log(formData)

 

//     return (
//         <div className="col-md-12 bg-light body-content p-4">
//             <div className="card shadow-sm border-0">
//                 <div className="card-header bg-gradient-primary py-1 text-white d-flex justify-content-between align-items-center">
//                     <h5 className="card-title mb-0">Create Slider</h5>
//                     <a
//                         href="https://usms.urbanitsolution.com/Admin/slider/slider_all?page_group=dynamic_website"
//                         className="btn btn-sm btn-info"
//                     >
//                         Back to Slider List
//                     </a>
//                 </div>
//                 <div className="alert alert-warning mx-4 mt-4 text-danger font-weight-bold">
//                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) fields required
//                 </div>
//                 <div className="card-body bg-gradient-light">
//                     <form className="form-horizontal" method="post" autoComplete="off" onSubmit={slider_create}>
//                         <div className="container">
//                             <div className="row">
//                                 <div className="col-md-7">
//                                     <div className="form-group row">
//                                         <label className="col-md-3 col-form-label font-weight-bold">
//                                             Slider Name:
//                                             <small>
//                                                 <sup>
//                                                     <i className="text-danger fas fa-star"></i>
//                                                 </sup>
//                                             </small>
//                                         </label>
//                                         <div className="col-md-9">
//                                             <input
//                                                 type="text"
//                                                 name="slider_name"
//                                                 className="form-control form-control-sm"
//                                                 placeholder="Enter Slider Name"

//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="card mb-3 shadow-sm">
//                                         <div className="card-header bg-gradient-primary text-white py-1 d-flex justify-content-between align-items-center">
//                                             <h6 className="card-title mb-0">Image List</h6>
//                                             <span style={{ width: "150px" }} className="btn btn-success btn-sm mb-2">
//                                                 <label htmlFor={`fileInput`} className="mb-0">
//                                                     <FaUpload /> Select Image
//                                                 </label>
//                                                 <input
//                                                     type="file"
//                                                     id={`fileInput`}
//                                                     style={{ display: "none" }}
//                                                     onChange={(e) => type_file_change("fileInput", e)}
//                                                 />
//                                             </span>
//                                         </div>
//                                         <div className="media-body">
//                                             <div style={{ width: "100%" }}>
//                                                 <ul style={{ listStyleType: "none", padding: 0 }}>
//                                                     {Object?.entries(formData?.linkDataValue2 || {}).map(([key, data, index]) => (
//                                                         <li
//                                                             key={key}
//                                                             style={{
//                                                                 display: "flex",
//                                                                 alignItems: "flex-start",
//                                                                 marginBottom: "8px",
//                                                                 border: "1px solid #ddd",
//                                                                 padding: "8px",
//                                                                 borderRadius: "4px",
//                                                             }}
//                                                         >
//                                                             <img
//                                                                 src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${data.file_path}`}
//                                                                 alt="Slider"
//                                                                 style={{ width: "50px", height: "auto", marginRight: "8px" }}
//                                                             />
//                                                             <div style={{ flex: 1, marginRight: "8px" }}>
//                                                                 <div
//                                                                     style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}
//                                                                 >
//                                                                     <select
//                                                                         className="form-control form-control-sm"
//                                                                         value={data.type}
//                                                                         onChange={(e) => handleSelectChange2(key, e.target.value)}
//                                                                     >
//                                                                         <option value="1">External</option>
//                                                                         <option value="2">Front page</option>
//                                                                         <option value="3">No Link</option>
//                                                                         <option value="4">Content Reference</option>
//                                                                     </select>

//                                                                     <input
//                                                                         type="text"
//                                                                         className="form-control form-control-sm"
//                                                                         value={data.value}
//                                                                         disabled={data.disabled}
//                                                                         onChange={(e) => handleInputChange2(key, "value", e.target.value)}
//                                                                     />
//                                                                     {
//                                                                         data.type == '4' &&
//                                                                         <div className="input-group-append">
//                                                                             <span
//                                                                                 className="input-group-text search_icon"
//                                                                                 data-toggle={data.type == '4' ? 'modal' : ''}
//                                                                                 data-target={data.type == '4' ? '#exampleModal2' : ''}
//                                                                                 onClick={() => openModal2(key, index)}
//                                                                             >
//                                                                                 <i className="fas fa-search"></i>
//                                                                             </span>

//                                                                         </div>
//                                                                     }
//                                                                 </div>
//                                                                 <h5 style={{ margin: "0 0 8px 0" }}>
//                                                                     <input
//                                                                         name="title"
//                                                                         className="form-control form-control-sm"
//                                                                         placeholder="Enter Title"
//                                                                         type="text"
//                                                                         style={{ width: "100%" }}
//                                                                         onChange={(e) => handleInputChange2(key, "title", e.target.value)}
//                                                                     />
//                                                                 </h5>
                                                              
//                                                             </div>
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </div>
//                                         </div>

//                                     </div>

//                                     <div className="form-group row">
//                                         <div className="col-md-12 text-right">
//                                             <button
//                                                 type="submit"
//                                                 className="btn btn-success btn-sm"
//                                             >
//                                                 Submit
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>

//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SliderUpdate;


// 'use client'
// //ismile
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import Select from 'react-dropdown-select';
// import { FaTrash, FaUpload } from 'react-icons/fa';
// import "../slider_creates/jssor.slider.min.css"; // Ensure you have the appropriate CSS file for Jssor Slider
// import "../js/jssor.slider.min.js"; // Ensure this file exists and is correctly loaded


// const SliderUpdate = ({ id }) => {


//     const [userId, setUserId] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('userId') || '';
//         }
//         return '';
//     });

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedUserId = localStorage.getItem('userId');
//             setUserId(storedUserId);
//         }
//     }, []);


//     const [formData, setFormData] = useState({});


//     const { data: sales_list_single = []
//     } = useQuery({
//         queryKey: ['sales_list_single'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/sales_list_single/${id}`)

//             const data = await res.json()
//             return data
//         }
//     })


//     useEffect(() => {
//         if (sales_list_single.length > 0) {
//             // Populate formData based on the first item of sales_list_single
//             const sliderData = sales_list_single[0];

//             const updatedFormData = {
//                 slider_name: sliderData.slider_name || '',
//                 created_by: sliderData.created_by || userId,
//                 modified_by: sliderData.modified_by || 0,
//                 created_date: sliderData.created_date || '',
//                 modified_date: sliderData.modified_date || '',
//                 transition: sliderData.transition || '',
//                 slider_type: sliderData.slider_type || 0,
//                 slider_design_id: sliderData.slider_design_id || 0,
//                 linkDataValue2: sliderData.linkDataValue2?.map((linkData) => ({
//                     ...linkData,
//                     type: linkData.value?.startsWith('https//') ? '1' :
//                         linkData.value == 'font' ? '2' :
//                             linkData.value == 'no link' ? '3' : '4',
//                     disabled: !linkData.value == '', // Disable if no link
//                     linkDataValue1: linkData.linkDataValue1?.map((innerLink) => ({
//                         ...innerLink,
//                         type: innerLink.value?.startsWith('https//') ? '1' :
//                             innerLink.value == 'font' ? '2' :
//                                 innerLink.value == 'no link' ? '3' : '4',
//                         disabled: !innerLink.value == '', // Disable if no link
//                     })) || [],

//                 })) || [],
//             };

//             // Set the updated form data
//             setFormData(updatedFormData);
//         }
//     }, [sales_list_single, userId]);

//     console.log(formData)

//     const [linkData2, setLinkData2] = useState({
//         link1: { type: "1", file_path: "", value: "https//", disabled: false, name: "", align: "" },
//     });

//     const [selectedFile2, setSelectedFile2] = useState({});
//     const [fileNames2, setFileNames2] = useState({});
//     const [fileErrors, setFileErrors] = useState({});


//     // Handle file input change
//     const type_file_change = (key, e) => {
//         e.preventDefault();
//         const file = e.target.files[0];

//         if (!file) return;

//         if (file.size > 2097152) {
//             setFileErrors((prev) => ({ ...prev, [key]: "Max file size is 2 MB" }));
//             return;
//         }

//         const now = new Date();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, "0");
//         const day = String(now.getDate()).padStart(2, "0");
//         const hours = String(now.getHours()).padStart(2, "0");
//         const minutes = String(now.getMinutes()).padStart(2, "0");

//         const fileName = file.name.split(".")[0];
//         const extension = file.name.split(".").pop();
//         const newName = `${fileName}(${key}).${extension}`;
//         const filePath = `custom_page/${year}/${month}/${day}/${hours}/${minutes}/${fileName}.${extension}`;

//         setSelectedFile2((prevState) => ({ ...prevState, [key]: file }));
//         setFileNames2((prevState) => ({ ...prevState, [key]: newName }));
//         setFormData((prevState) => [
//             ...prevState,
//             {
//                 file_path: filePath,

//                 linkDataValue2: { ...linkData2 },
//                 linkDataValue1: { ...linkData },
//             },
//         ]);

//         upload2(file, filePath);
//     };



//     // File upload function
//     const upload2 = (file, path) => {
//         const formData = new FormData();
//         formData.append("files", file);
//         formData.append("path", path);

//         axios
//             .post(`${process.env.NEXT_PUBLIC_API_URL}:5003/custom_page/custom_page_image`, formData)
//             .then((res) => {
//                 console.log("File uploaded successfully:", res.data);
//             })
//             .catch((error) => {
//                 console.error("Error uploading file:", error);
//             });
//     };


//     const router = useRouter()
//     const [linkData, setLinkData] = useState({
//         link1: { type: "1", value: "https//", disabled: false, name: "", align: "", show: "" },
//         link2: { type: "1", value: "https//", disabled: false, name: "", align: "", show: "" },
//     });

//     const slider_create = (event) => {
//         event.preventDefault();
//         const form = event.target;
//         const slider_name = form.slider_name.value
//         const allData = {
//             formData, slider_name, created_by: userId
//         }


//         console.log(allData)

//         //${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/slider_create

//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/slider_create`, {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json',
//             },
//             body: JSON.stringify(allData),
//         })
//             .then((Response) => {

//                 Response.json()
//                 if (Response) {
//                     sessionStorage.setItem("message", "Data saved successfully!");
//                     // router.push('/Admin/pop_up/pop_up_all?page_group=dynamic_website')

//                 }
//             })
//             .then((data) => {
//                 console.log(data)

//                 if (data) {
//                     sessionStorage.setItem("message", "Data saved successfully!");
//                     // router.push('/Admin/pop_up/pop_up_all?page_group=dynamic_website')

//                 }
//             })
//             .catch((error) => console.error(error));
//         // }
//     }

//     // const handleSelectChange = (index, linkKey, value) => {
//     //     setFormData((prevFormData) => {
//     //         let updatedFormData = [...prevFormData]; // Clone the array

//     //         // Update the type and handle other properties accordingly
//     //         updatedFormData[index] = {
//     //             ...updatedFormData[index],
//     //             linkDataValue1: {
//     //                 ...updatedFormData[index].linkDataValue1,
//     //                 [linkKey]: {
//     //                     ...updatedFormData[index].linkDataValue1[linkKey],
//     //                     type: value, // Update the type field
//     //                     value: value === '1' ? 'https://' : value === '2' ? 'font' : value === '3' ? 'no link' : '',
//     //                     disabled: value === '2' || value === '3' || value === '4', // Handle disabled state based on value
//     //                 },
//     //             },
//     //         };

//     //         return updatedFormData; // Return the updated state
//     //     });
//     // };

//     // const handleInputChange = (index, linkKey, key, value, type = null) => {
//     //     setFormData((prevFormData) => {
//     //         let updatedFormData = [...prevFormData]; // Clone the array

//     //         // Update the nested properties for the specific index and linkKey
//     //         updatedFormData[index] = {
//     //             ...updatedFormData[index],
//     //             linkDataValue1: {
//     //                 ...updatedFormData[index].linkDataValue1,
//     //                 [linkKey]: {
//     //                     ...updatedFormData[index].linkDataValue1[linkKey],
//     //                     [key]: type === "checkbox" ? (value ? "1" : "0") : value, // Handle checkbox values
//     //                 },
//     //             },
//     //         };

//     //         return updatedFormData; // Return the updated state
//     //     });
//     // };
//     const handleInputChange = (index, linkKey, key, value, type = null) => {
//         setFormData((prevFormData) => {
//             let updatedFormData = {...prevFormData}; // Clone the array
    
//             // Update the nested properties for the specific index and linkKey
//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue1: {
//                     ...updatedFormData[index].linkDataValue1,
//                     [linkKey]: {
//                         ...updatedFormData[index].linkDataValue1[linkKey],
//                         [key]: type === "checkbox" ? (value ? "1" : "0") : value, // Handle checkbox values
//                     },
//                 },
//             };
    
//             return updatedFormData; // Return the updated state
//         });
//     };
    

//     console.log(formData)

//     const renderLinkRow = (label, linkKey, index) => {
//         // Access the correct link data from formData based on the index and linkKey
//         const currentLinkData = formData.linkDataValue2[index]?.linkDataValue1[index];
//         console.log(label, linkKey, index)
//         console.log(currentLinkData)
//         if (!currentLinkData) return null; // Return null if currentLinkData is undefined

//         return (
//             <div key={index} className="input-group input-group-sm mb-2">
//                 {/* Link Form Elements */}
//                 <input
//                     style={{ flex: '1' }}
//                     type="text"
//                     className="form-control form-control-sm name_input w-25"
//                     value={currentLinkData.name || ''}
//                     onChange={(e) => handleInputChange(index, linkKey, 'name', e.target.value)}
//                     placeholder={`${label} Name`}
//                 />
//                 <select
//                     style={{ flex: '1' }}
//                     className="form-control form-control-sm link_type"
//                     value={currentLinkData.align || ''}
//                     onChange={(e) => handleInputChange(index, linkKey, 'align', e.target.value)}
//                 >
//                     <option value="">Button Center</option>
//                     <option value="float-left">Button Left Align</option>
//                     <option value="float-right">Button Right Align</option>
//                 </select>

//                 <div className="input-group-append" data-toggle="popover" title="" data-content="If you tick 'Scheduled' Pop Up will run given scheduled every day. Not whole Day" data-original-title="Scheduled">
//                     <div className="input-group-text">
//                         <input
//                             style={{ flex: '1' }}
//                             onChange={(e) => handleInputChange(index, linkKey, 'show', e.target.checked ? "1" : "0", 'checkbox')}
//                             checked={currentLinkData.show === "1"}
//                             type="checkbox"
//                             aria-label="Checkbox for following text input"
//                             value={currentLinkData.show}
//                         />
//                     </div>
//                     <span className="input-group-text"><i className="fas fa-info-circle mr-1"></i>Button Show</span>
//                 </div>
//                 <select
//                     style={{ flex: '1' }}
//                     className="form-control form-control-sm link_type w-25"
//                     value={currentLinkData.type || ''}
//                     onChange={(e) => handleSelectChange(index, linkKey, e.target.value)}
//                 >
//                     <option value="1">External</option>
//                     <option value="2">Front page</option>
//                     <option value="3">No Link</option>
//                     <option value="4">Content Reference</option>
//                 </select>
//                 <input
//                     style={{ flex: '1' }}
//                     type="text"
//                     className="form-control form-control-sm select_result w-25"
//                     value={currentLinkData.value || ''}
//                     disabled={currentLinkData.disabled}
//                     onChange={(e) => handleInputChange(index, linkKey, 'value', e.target.value)}
//                 />
//             </div>
//         );
//     };


//     return (
//         <div className="col-md-12 bg-light body-content p-4">
//             <div className="card shadow-sm border-0">
//                 <div className="card-header bg-gradient-primary py-1 text-white d-flex justify-content-between align-items-center">
//                     <h5 className="card-title mb-0">Create Slider</h5>
//                     <a
//                         href="https://usms.urbanitsolution.com/Admin/slider/slider_all?page_group=dynamic_website"
//                         className="btn btn-sm btn-info"
//                     >
//                         Back to Slider List
//                     </a>
//                 </div>
//                 <div className="alert alert-warning mx-4 mt-4 text-danger font-weight-bold">
//                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) fields required
//                 </div>
//                 <div className="card-body bg-gradient-light">
//                     <form className="form-horizontal" method="post" autoComplete="off" onSubmit={slider_create}>
//                         <div className="container">
//                             <div className="row">
//                                 <div className="col-md-7">
//                                     <div className="form-group row">
//                                         <label className="col-md-3 col-form-label font-weight-bold">
//                                             Slider Name:
//                                             <small>
//                                                 <sup>
//                                                     <i className="text-danger fas fa-star"></i>
//                                                 </sup>
//                                             </small>
//                                         </label>
//                                         <div className="col-md-9">
//                                             <input
//                                                 type="text"
//                                                 name="slider_name"
//                                                 className="form-control form-control-sm"
//                                                 placeholder="Enter Slider Name"

//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="card mb-3 shadow-sm">
//                                         <div className="card-header bg-gradient-primary text-white py-1 d-flex justify-content-between align-items-center">
//                                             <h6 className="card-title mb-0">Image List</h6>
//                                             <span style={{ width: "150px" }} className="btn btn-success btn-sm mb-2">
//                                                 <label htmlFor={`fileInput`} className="mb-0">
//                                                     <FaUpload /> Select Image
//                                                 </label>
//                                                 <input
//                                                     type="file"
//                                                     id={`fileInput`}
//                                                     style={{ display: "none" }}
//                                                     onChange={(e) => type_file_change("fileInput", e)}
//                                                 />
//                                             </span>
//                                         </div>
//                                         <div className="media-body">
//                                             <div style={{ width: "100%" }}>
//                                                 <ul style={{ listStyleType: "none", padding: 0 }}>
//                                                     {Object?.entries(formData?.linkDataValue2 || {}).map(([key, data, index]) => (
//                                                         <li
//                                                             key={key}
//                                                             style={{
//                                                                 display: "flex",
//                                                                 alignItems: "flex-start",
//                                                                 marginBottom: "8px",
//                                                                 border: "1px solid #ddd",
//                                                                 padding: "8px",
//                                                                 borderRadius: "4px",
//                                                             }}
//                                                         >
//                                                             <img
//                                                                 src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${data.file_path}`}
//                                                                 alt="Slider"
//                                                                 style={{ width: "50px", height: "auto", marginRight: "8px" }}
//                                                             />
//                                                             <div className='mt-2'>
                                                                
//                                                                 {renderLinkRow('Link1', 'link1', 0)} {/* Pass index here */}
//                                                                 {renderLinkRow('Link2', 'link2', 1)} {/* Pass index here */}
//                                                             </div>
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </div>
//                                         </div>

//                                     </div>

//                                     <div className="form-group row">
//                                         <div className="col-md-12 text-right">
//                                             <button
//                                                 type="submit"
//                                                 className="btn btn-success btn-sm"
//                                             >
//                                                 Submit
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>

//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SliderUpdate;


// 'use client'
// //ismile
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import Select from 'react-dropdown-select';
// import { FaTrash, FaUpload } from 'react-icons/fa';
// import "../slider_creates/jssor.slider.min.css"; // Ensure you have the appropriate CSS file for Jssor Slider
// import "../js/jssor.slider.min.js"; // Ensure this file exists and is correctly loaded
// import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';


// const SliderUpdate = ({ id }) => {





//     const [page_group, setPage_group] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('pageGroup') || '';
//         }
//         return '';
//     });

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedUserId = localStorage.getItem('pageGroup');
//             setPage_group(storedUserId);
//         }
//     }, []);

//     const [userId, setUserId] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('userId') || '';
//         }
//         return '';
//     });

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedUserId = localStorage.getItem('userId');
//             setUserId(storedUserId);
//         }
//     }, []);

//     // const [modalData2, setModalData2] = useState({ index: null, key: '', value: '' });
//     // const openModal2 = (key, index) => {
//     //     // Set the modal data with index and key
//     //     const selectedData = formData[index]?.linkDataValue2[key];
//     //     if (selectedData && selectedData.type === '4') {
//     //         setModalData2({ index, key, value: selectedData.value });
//     //         $('#exampleModal2').modal('show'); // Show the modal
//     //     }
//     // };

//     // const saveModalChanges2 = (page) => {
//     //     const { index, key } = modalData2;  // Get the index and key from modalData2

//     //     console.log("Saving changes for index:", index, "key:", key, "with page:", page);

//     //     setActiveTabs(''); // Clear active tab if needed

//     //     // Update the formData with the new page link value
//     //     setFormData((prevFormData) => {
//     //         const updatedFormData = prevFormData.map((item, itemIndex) => {
//     //             if (itemIndex === index) {
//     //                 return {
//     //                     ...item,
//     //                     linkDataValue2: {
//     //                         ...item.linkDataValue2,
//     //                         [key]: {
//     //                             ...item.linkDataValue2[key],
//     //                             value: page, // Set the value from the selected page link
//     //                         },
//     //                     },
//     //                 };
//     //             }
//     //             return item;
//     //         });
//     //         return updatedFormData;
//     //     });

//     //     $('#exampleModal2').modal('hide'); // Close the modal
//     // };

//     const [modalData2, setModalData2] = useState({ index: '', key: '', value: '' });

//     // const openModal2 = (key, index) => {
//     //     console.log(key, index)
//     //     const selectedData = formData.linkDataValue2?.[index]; // Access the correct array element
//     //     if (selectedData && selectedData.type == '4') {
//     //         setModalData2({ index, key, value: selectedData.value });
//     //         $('#exampleModal2').modal('show'); // Show the modal
//     //     }
//     // };
//     const openModal2 = (key, index) => {
//         console.log("Selected key:", key, "Selected index:", index); // Log key and index
//         const selectedData = formData.linkDataValue2?.[index];
//         console.log("Selected Data:", selectedData); // Log the selected data
    
//         if (selectedData && selectedData.type === '4') {
//             setModalData2({ index, key, value: selectedData.value });
//             $('#exampleModal2').modal('show');
//         }
//     };
    

//     const saveModalChanges2 = (page) => {
//         // Safely extract index and key from modalData2 with default values
     
//         setActiveTabs(''); // Clear active tab if needed
//        console.log(modalData2)
    
//         setFormData((prevFormData) => {
//             // Ensure linkDataValue2 exists as an object
//             const updatedLinkDataValue2 = { ...prevFormData.linkDataValue2 };
    
//             // Ensure the specified index exists in linkDataValue2
//             if (!updatedLinkDataValue2[modalData2.index]) {
//                 updatedLinkDataValue2[modalData2.index] = {}; // Initialize if it doesn't exist
//             }
    
//             // Update the value property for the specified index
//             updatedLinkDataValue2[modalData2.index] = {
//                 ...updatedLinkDataValue2[modalData2.index],
//                 value: page,
//             };
    
//             console.log("Updated linkDataValue2:", updatedLinkDataValue2);
    
//             // Return the updated formData
//             return {
//                 ...prevFormData,
//                 linkDataValue2: updatedLinkDataValue2,
//             };
//         });
    
//         // Close the modal
//         $('#exampleModal2').modal('hide');
//     };
    
    


//     // const [modalData, setModalData] = useState({ index: '', key: '', value: '' });


//     // const openModal = (index, key) => {
//     //     console.log("Selected key:", key, "Selected index:", index); // Log key and index
//     //     const selectedData = formData.linkDataValue1?.[index];
//     //     console.log("Selected Data:", selectedData); // Log the selected data
    
//     //     if (selectedData && selectedData.type === '4') {
//     //         setModalData({ index, key, value: selectedData.value });
//     //         $('#exampleModal2').modal('show');
//     //     }


//     // };

//     // console.log(modalData)



//     // const saveModalChanges = (page) => {
//     //     const { index, key } = modalData;  // Get the index and key from modalData2

//     //     console.log("Saving changes for index:", index, "key:", key, "with page:", page);

//     //     setActiveTabs(''); // Clear active tab if needed

//     //     // Update the formData with the new page link value
//     //     setFormData((prevFormData) => {
//     //         const updatedFormData = prevFormData.map((item, itemIndex) => {
//     //             if (itemIndex == index) {
//     //                 return {
//     //                     ...item,
//     //                     linkDataValue1: {
//     //                         ...item.linkDataValue1,
//     //                         [key]: {
//     //                             ...item.linkDataValue1[key],
//     //                             value: page, // Set the value from the selected page link
//     //                         },
//     //                     },
//     //                 };
//     //             }
//     //             return item;
//     //         });
//     //         return updatedFormData;
//     //     });

//     //     $('#exampleModal').modal('hide'); // Close the modal
//     // };

//     const [modalData, setModalData] = useState({ index: '', key: '', value: '' });

// const openModal = (index, key) => {
//     console.log("Selected key:", key, "Selected index:", index); // Log key and index
//     const selectedData = formData.linkDataValue2?.[index]?.linkDataValue1?.[key];
//     console.log("Selected Data:", selectedData); // Log the selected data

//     if (selectedData && selectedData.type === '4') {
//         setModalData({ index, key, value: selectedData.value });
//         $('#exampleModal').modal('show');
//     }
// };

// const saveModalChanges = (page) => {
//     const { index, key } = modalData; // Get the index and key from modalData
//     setActiveTabs('');
//     console.log("Saving changes for index:", index, "key:", key, "with page:", page);

//     setFormData((prevFormData) => {
//         // Create a deep copy of the current formData
//         const updatedFormData = { ...prevFormData };

//         // Update the specific value in linkDataValue1
//         if (updatedFormData.linkDataValue2?.[index]?.linkDataValue1?.[key]) {
//             updatedFormData.linkDataValue2[index].linkDataValue1[key] = {
//                 ...updatedFormData.linkDataValue2[index].linkDataValue1[key],
//                 value: page, // Set the value from the selected page link
//             };
//         }

//         return updatedFormData;
//     });

//     $('#exampleModal').modal('hide'); // Close the modal
// };


//     const [formData, setFormData] = useState({});
//     const [pageListTable, setPageListTable] = useState('')

//     console.log(pageListTable)


//     const { data: page_list = []
//     } = useQuery({
//         queryKey: ['page_list'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/page_list/page_list_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: sales_list_single = []
//     } = useQuery({
//         queryKey: ['sales_list_single'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/sales_list_single/${id}`)

//             const data = await res.json()
//             return data
//         }
//     })


//     const handleSelectChange2 = (key, value) => {
//         setFormData((prevData) => ({
//             ...prevData,
//             linkDataValue2: {
//                 ...prevData.linkDataValue2,
//                 [key]: {
//                     ...prevData.linkDataValue2[key],
//                     type: value, // Update the type based on the selected value
//                     value: value == '1' ? 'https//' : value == '2' ? 'font' : value == '3' ? 'no link' : '', // Adjust other values accordingly
//                     disabled: value !== '1', // Enable/disable based on the selected value
//                 },
//             },
//         }));
//     };

//     const handleInputChange2 = (key, field, value) => {
//         setFormData((prevData) => ({
//             ...prevData,
//             linkDataValue2: {
//                 ...prevData.linkDataValue2,
//                 [key]: {
//                     ...prevData.linkDataValue2[key],
//                     [field]: value,
//                 },
//             },
//         }));
//     };

    
//     useEffect(() => {
//         if (sales_list_single.length > 0) {
//             // Populate formData based on the first item of sales_list_single
//             const sliderData = sales_list_single[0];

//             const updatedFormData = {
//                 slider_name: sliderData.slider_name || '',
//                 created_by: sliderData.created_by || userId,
//                 modified_by: sliderData.modified_by || 0,
//                 created_date: sliderData.created_date || '',
//                 modified_date: sliderData.modified_date || '',
//                 transition: sliderData.transition || '',
//                 slider_type: sliderData.slider_type || 0,
//                 slider_design_id: sliderData.slider_design_id || 0,
//                 linkDataValue2: sliderData.linkDataValue2?.map((linkData) => ({
//                     ...linkData,
//                     name: linkData.name,
//                     status: linkData.status,
//                     title: linkData.title,
//                     title_sub: linkData.sub_title,
//                     summary: linkData.summary,
//                     type: linkData.value?.startsWith('https://') ? '1' :
//                         linkData.value == 'font' ? '2' :
//                             linkData.value == 'no link' ? '3' : '4',
//                     disabled: !linkData.value == '', // Disable if no link
//                     linkDataValue1: linkData.linkDataValue1?.map((innerLink) => ({
//                         ...innerLink,
//                         type: innerLink.value?.startsWith('https://') ? '1' :
//                             innerLink.value == 'font' ? '2' :
//                                 innerLink.value == 'no link' ? '3' : '4',
//                         disabled: !innerLink.value == '', // Disable if no link
//                     })) || [],

//                 })) || [],
//             };

//             // Set the updated form data
//             setFormData(updatedFormData);
//         }
//     }, [sales_list_single, userId]);


//     // useEffect(() => {
//     //     if (!sales_list_single.length) return;

//     //     const salesData = sales_list_single[0];

//     //     setFormData((prevData) => {
//     //         const updatedFormData = salesData.linkDataValue1.map((linkData) => {
//     //             const linkDataValue2 = linkData.linkDataValue2 || [];

//     //             // Process the linkDataValue2 array
//     //             const formattedLinkDataValue2 = linkDataValue2.map((item) => ({
//     //                 id: item.id,
//     //                 type: item.value === "no link" ? "3" : "2",
//     //                 value: item.value,
//     //                 name: item.name || "",
//     //                 disabled: item.value === "no link" || !item.value,
//     //             }));

//     //             return {
//     //                 file_path: linkData.file_path,
//     //                 linkDataValue1: {
//     //                     type:
//     //                         linkData.value === "no link"
//     //                             ? "3" // No Link
//     //                             : linkData.value === "font"
//     //                             ? "2" // Front Page
//     //                             : linkData.value.startsWith("https//")
//     //                             ? "1" // External Link
//     //                             : "4", // Content Reference
//     //                     value: linkData.value || "no link",
//     //                     disabled: ["no link", "font", ""].includes(linkData.value),
//     //                     name: linkData.name || "",
//     //                     align: linkData.align || "",
//     //                     show: linkData.show || "1",
//     //                 },
//     //                 linkDataValue2: formattedLinkDataValue2,
//     //             };
//     //         });

//     //         return {
//     //             ...prevData,
//     //             slider_name: salesData.slider_name || "",
//     //             created_by: salesData.created_by,
//     //             modified_by: salesData.modified_by || salesData.created_by,
//     //             selectedMonths: salesData.transition
//     //                 ? salesData.transition.split(", ").map((item) => {
//     //                       const [key, value] = item.split(":");
//     //                       return {
//     //                           value: item,
//     //                           label: key.trim(),
//     //                       };
//     //                   })
//     //                 : [],
//     //             formData: updatedFormData,
//     //         };
//     //     });
//     // }, [sales_list_single]);

//     // console.log(formData)


//     const { data: transition_list = []
//     } = useQuery({
//         queryKey: ['transition_list'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/transition_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: page_list_status = []
//     } = useQuery({
//         queryKey: ['page_list_status'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/page_list/page_list_list_one`)

//             const data = await res.json()
//             return data
//         }
//     })
//     const [tableData, setTableData] = useState([]);


//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/page_list/all_table_data`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ pageListTable }) // Sending table name dynamically
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     setTableData(data);  // Store data in state
//                 } else {
//                     console.error('Failed to fetch data');
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };

//         fetchData();
//     }, [pageListTable]); // Re-fetch if the table name changes

//     console.log(tableData)

//     const [activeTabs, setActiveTabs] = useState([]); // Manage multiple active tabs




//     const handleTabClick = (tabName, tabNames) => {
//         setActiveTabs([tabName, tabNames]); // Reset active tabs and add only the clicked tab
//     };

//     console.log(activeTabs)

//     // console.log(linkData)

//     // 

//     const remove_field = (index) => {
//         const newFields = [...formData];
//         newFields.splice(index, 1);
//         setFormData(newFields);
//     };


//     const [linkData, setLinkData] = useState({
//         link1: { type: "1", value: "https//", disabled: false, name: "", align: "", show: "" },
//         link2: { type: "1", value: "https//", disabled: false, name: "", align: "", show: "" },
//     });
//     const [linkData2, setLinkData2] = useState({
//         link1: { type: "1", file_path: "", value: "https//", disabled: false, name: "", align: "" },
//     });

//     const [selectedFile2, setSelectedFile2] = useState({});
//     const [fileNames2, setFileNames2] = useState({});
//     const [fileErrors, setFileErrors] = useState({});


//     // const handleSelectChange = (index, linkKey, value) => {
//     //     setFormData((prevFormData) => {
//     //         const updatedFormData = [...prevFormData]; // Clone the array

//     //         // Update the type and handle other properties accordingly
//     //         updatedFormData[index] = {
//     //             ...updatedFormData[index],
//     //             linkDataValue1: {
//     //                 ...updatedFormData[index].linkDataValue1,
//     //                 [linkKey]: {
//     //                     ...updatedFormData[index].linkDataValue1[linkKey],
//     //                     type: value, // Update the type field
//     //                     value: value === '1' ? 'https://' : value === '2' ? 'font' : value === '3' ? 'no link' : '',
//     //                     disabled: value === '2' || value === '3' || value === '4', // Handle disabled state based on value
//     //                 },
//     //             },
//     //         };

//     //         return updatedFormData; // Return the updated state
//     //     });
//     // };

//     // const handleInputChange = (index, linkKey, key, value, type = null) => {
//     //     setFormData((prevFormData) => {
//     //         const updatedFormData = [...prevFormData]; // Clone the array

//     //         // Update the nested properties for the specific index and linkKey
//     //         updatedFormData[index] = {
//     //             ...updatedFormData[index],
//     //             linkDataValue1: {
//     //                 ...updatedFormData[index].linkDataValue1,
//     //                 [linkKey]: {
//     //                     ...updatedFormData[index].linkDataValue1[linkKey],
//     //                     [key]: type === "checkbox" ? (value ? "1" : "0") : value, // Handle checkbox values
//     //                 },
//     //             },
//     //         };

//     //         return updatedFormData; // Return the updated state
//     //     });
//     // };

//     // const handleSelectChange = (index, linkKey, value) => {

//     //     console.log(index, linkKey, value)

//     //     setFormData((prevFormData) => {
//     //         const updatedFormData = { ...prevFormData }; // Clone the object to update
    
//     //         updatedFormData.linkDataValue2[index].linkDataValue1 = updatedFormData.linkDataValue2[index].linkDataValue1.map((linkItem, idx) => {
//     //             if (idx == linkKey) {  // Match the correct linkKey in the linkDataValue1 array
//     //                 const updatedLinkItem = {
//     //                     ...linkItem,
//     //                     type: value,
//     //                     value: value === '1' ? 'https://' : value === '2' ? 'font' : value === '3' ? 'no link' : '',
//     //                     disabled: value === '2' || value === '3' || value === '4', // Set disabled based on the selected value
//     //                 };
//     //                 return updatedLinkItem;
//     //             }
//     //             return linkItem;
//     //         });
    
//     //         return updatedFormData; // Return the updated form data
//     //     });
//     // };

//     // const handleSelectChange = (index, linkKey, value) => {
//     //     console.log("Index:", index, "LinkKey:", linkKey, "Value:", value);
    
//     //     setFormData((prevFormData) => {
//     //         // Deep clone the structure
//     //         const updatedFormData = { ...prevFormData };
//     //         let updatedLinkDataValue2 = [...updatedFormData?.linkDataValue2];
//     //         const updatedLinkDataValue1 = [...updatedLinkDataValue2[index].linkDataValue1];
    
//     //         // Update the specific item
//     //         updatedLinkDataValue1[linkKey] = {
//     //             ...updatedLinkDataValue1[linkKey],
//     //             type: value,
//     //             value: value === '1' ? 'https://' : value === '2' ? 'font' : value === '3' ? 'no link' : '',
//     //             disabled: value === '2' || value === '3' || value === '4',
//     //         };
    
//     //         // Assign back the updated arrays
//     //         updatedLinkDataValue2[index].linkDataValue1 = updatedLinkDataValue1;
//     //         updatedFormData.linkDataValue2 = updatedLinkDataValue2;
    
//     //         return updatedFormData;
//     //     });
//     // };
//     const handleSelectChange = (index, linkKey, value) => {
//         console.log("Index:", index, "LinkKey:", linkKey, "Value:", value);
    
//         setFormData((prevFormData) => {
//             // Clone the structure
//             const updatedFormData = { ...prevFormData };
//             const linkDataValue2 = { ...updatedFormData.linkDataValue2 };
    
//             // Ensure the index exists in linkDataValue2
//             if (!linkDataValue2[index]) {
//                 console.error(`Index ${index} does not exist in linkDataValue2.`);
//                 return updatedFormData;
//             }
    
//             const linkDataValue1 = Array.isArray(linkDataValue2[index].linkDataValue1)
//                 ? [...linkDataValue2[index].linkDataValue1]
//                 : []; // Fallback to an empty array if undefined
    
//             // Ensure linkKey exists in linkDataValue1
//             if (!linkDataValue1[linkKey]) {
//                 console.error(`LinkKey ${linkKey} does not exist in linkDataValue1.`);
//                 return updatedFormData;
//             }
    
//             // Update the specific item
//             linkDataValue1[linkKey] = {
//                 ...linkDataValue1[linkKey],
//                 type: value,
//                 value: value === '1' ? 'https://' : value === '2' ? 'font' : value === '3' ? 'no link' : '',
//                 disabled: value === '2' || value === '3' || value === '4',
//             };
    
//             // Assign back the updated arrays and objects
//             linkDataValue2[index].linkDataValue1 = linkDataValue1;
//             updatedFormData.linkDataValue2 = linkDataValue2;
    
//             return updatedFormData;
//         });
//     };
    
//     const handleInputChange = (index, linkKey, key, value, type = null) => {
//         setFormData((prevFormData) => {
//             let updatedFormData = { ...prevFormData };
//             // Ensure the structure exists before modification
//             if (!updatedFormData.linkDataValue2[index]) return prevFormData;
    
//             let linkDataValue1 = [...updatedFormData?.linkDataValue2[index]?.linkDataValue1];
    
//             // Update the specific link item
//             linkDataValue1[linkKey] = {
//                 ...linkDataValue1[linkKey],
//                 [key]: type === "checkbox" ? (value ? "1" : "0") : value,
//             };
    
//             updatedFormData.linkDataValue2[index] = {
//                 ...updatedFormData.linkDataValue2[index],
//                 linkDataValue1,
//             };
    
//             return updatedFormData; // Return the updated state
//         });
//     };
//     console.log(formData, 'Max file size is 2 MB')
//     // const handleInputChange = (index, linkKey, key, value, type = null) => {
//     //     console.log(index, linkKey, key, value, type = null)
//     //     setFormData((prevFormData) => {
//     //         const updatedFormData = { ...prevFormData }; // Clone the object to update
//     // console.log(updatedFormData.linkDataValue2[index].linkDataValue1)
//     //         updatedFormData.linkDataValue2[index].linkDataValue1 = updatedFormData.linkDataValue2[index].linkDataValue1.map((linkItem, idx) => {
//     //          console.log(linkItem, 'linkItem')
//     //             if (idx == linkKey) {  // Match the correct linkKey in the linkDataValue1 array
//     //                 console.log(idx == linkKey, 'idx == linkKey')
//     //                 const updatedLinkItem = {
//     //                     ...linkItem,
//     //                     [key]: type === "checkbox" ? (value ? "1" : "0") : value, // Handle checkbox change
//     //                 };
//     //                 return updatedLinkItem;
//     //             }
//     //             return linkItem;
//     //         });
    
//     //         return updatedFormData; // Return the updated form data
//     //     });
//     // };

    
//     // Handle file input change
//     // const type_file_change = (key, e) => {
//     //     e.preventDefault();
//     //     const file = e.target.files[0];

//     //     if (!file) return;

//     //     if (file.size > 2097152) {
//     //         setFileErrors((prev) => ({ ...prev, [key]: "Max file size is 2 MB" }));
//     //         return;
//     //     }

//     //     const now = new Date();
//     //     const year = now.getFullYear();
//     //     const month = String(now.getMonth() + 1).padStart(2, "0");
//     //     const day = String(now.getDate()).padStart(2, "0");
//     //     const hours = String(now.getHours()).padStart(2, "0");
//     //     const minutes = String(now.getMinutes()).padStart(2, "0");

//     //     const fileName = file.name.split(".")[0];
//     //     const extension = file.name.split(".").pop();
//     //     const newName = `${fileName}(${key}).${extension}`;
//     //     const filePath = `custom_page/${year}/${month}/${day}/${hours}/${minutes}/${fileName}.${extension}`;

//     //     setSelectedFile2((prevState) => ({ ...prevState, [key]: file }));
//     //     setFileNames2((prevState) => ({ ...prevState, [key]: newName }));
       
        
        

//     //     upload2(file, filePath);
//     // };
    
//     // const type_file_change = (key, e) => {
//     //     e.preventDefault();
//     //     const file = e.target.files[0];
    
//     //     if (!file) return;
    
//     //     if (file.size > 2097152) {
//     //         setFileErrors((prev) => ({ ...prev, [key]: "Max file size is 2 MB" }));
//     //         return;
//     //     }
    
//     //     const now = new Date();
//     //     const year = now.getFullYear();
//     //     const month = String(now.getMonth() + 1).padStart(2, "0");
//     //     const day = String(now.getDate()).padStart(2, "0");
//     //     const hours = String(now.getHours()).padStart(2, "0");
//     //     const minutes = String(now.getMinutes()).padStart(2, "0");
    
//     //     const fileName = file.name.split(".")[0];
//     //     const extension = file.name.split(".").pop();
//     //     const newName = `${fileName}(${key}).${extension}`;
//     //     const filePath = `custom_page/${year}/${month}/${day}/${hours}/${minutes}/${fileName}.${extension}`;
    
//     //     setSelectedFile2((prevState) => ({ ...prevState, [key]: file }));
//     //     setFileNames2((prevState) => ({ ...prevState, [key]: newName }));
    
//     //     // Find the existing linkDataValue2 and update only the file_path
//     //     const updatedLinkDataValue2 = {
//     //         ...formData.linkDataValue2,
//     //         [key]: {
//     //             ...formData.linkDataValue2[key],
//     //             file_path: filePath, // Update only the file_path here
//     //         }
//     //     };
    
//     //     // Update the formData state
//     //     setFormData((prevState) => ({
//     //         ...prevState,
//     //         linkDataValue2: updatedLinkDataValue2,
//     //     }));
    
//     //     upload2(file, filePath);
//     // };
    
//     const type_file_change = (key, e) => {
//         e.preventDefault();
//         const file = e.target.files[0];
    
//         if (!file) return;
    
//         if (file.size > 2097152) {
//             setFileErrors((prev) => ({ ...prev, [key]: "Max file size is 2 MB" }));
//             return;
//         }
    
//         const now = new Date();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, "0");
//         const day = String(now.getDate()).padStart(2, "0");
//         const hours = String(now.getHours()).padStart(2, "0");
//         const minutes = String(now.getMinutes()).padStart(2, "0");
    
//         const fileName = file.name.split(".")[0];
//         const extension = file.name.split(".").pop();
//         const newName = `${fileName}(${key}).${extension}`;
//         const filePath = `custom_page/${year}/${month}/${day}/${hours}/${minutes}/${fileName}.${extension}`;
    
//         setSelectedFile2((prevState) => ({ ...prevState, [key]: file }));
//         setFileNames2((prevState) => ({ ...prevState, [key]: newName }));
    
//         // Find the next available index in linkDataValue2
//         const nextIndex = Object.keys(formData.linkDataValue2).length;
    
//         // Create the new fileInput object at the next index
//         const updatedLinkDataValue2 = {
//             ...formData.linkDataValue2,
//             [nextIndex]: {
//                 file_path: filePath,
//                 linkDataValue1: [
//                     ...formData.linkDataValue2[nextIndex]?.linkDataValue1 || [],
//                      { type: "1", value: "https://",disabled: false, name: "", align: "", show: "" },
//                      { type: "1", value: "https://",disabled: false, name: "", align: "", show: "" },
//                 ],
//             },
//         };
        
    
//         // Update the formData state
//         setFormData((prevState) => ({
//             ...prevState,
//             linkDataValue2: updatedLinkDataValue2,
//         }));
    
//         upload2(file, filePath);
//     };
    
//     // File upload function
//     const upload2 = (file, path) => {
//         const formData = new FormData();
//         formData.append("files", file);
//         formData.append("path", path);

//         axios
//             .post(`${process.env.NEXT_PUBLIC_API_URL}:5003/custom_page/custom_page_image`, formData)
//             .then((res) => {
//                 console.log("File uploaded successfully:", res.data);
//             })
//             .catch((error) => {
//                 console.error("Error uploading file:", error);
//             });
//     };


//     console.log(formData)


//     const [selectedMonths, setSelectedMonths] = useState([]);



//     // Handle changes in selection
//     const handleChange = (selectedOptions) => {
//         setSelectedMonths(selectedOptions || []);
//     };

//     console.log(selectedMonths)

//     const router = useRouter()

//     const slider_edit = (event) => {
//         event.preventDefault();
//         const form = event.target;
//         const slider_name = form.slider_name.value
//         const allData = {
//             formData, selectedMonths, slider_name, created_by: userId
//         }


//         console.log(allData)

//         //${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/slider_update/${id}

//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/slider_update/${id}`, {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json',
//             },
//             body: JSON.stringify(allData),
//         })
//             .then((Response) => {

//                 Response.json()
//                 if (Response) {
//                     sessionStorage.setItem("message", "Data saved successfully!");
//                     // router.push('/Admin/pop_up/pop_up_all?page_group=dynamic_website')

//                 }
//             })
//             .then((data) => {
//                 console.log(data)

//                 if (data) {
//                     sessionStorage.setItem("message", "Data saved successfully!");
//                     // router.push('/Admin/pop_up/pop_up_all?page_group=dynamic_website')

//                 }
//             })
//             .catch((error) => console.error(error));
//         // }
//     }
//     let [selectedTransition, setSelectedTransition] = useState(null); // State to store selected 

//     const handleTransitionChange = (event) => {
//         let selectedValue = event.target.value;

//         // Replace special values with quoted strings or valid expressions
//         selectedValue = selectedValue
//             .replace(/([a-zA-Z0-9_]+):/g, '"$1":')  // Add quotes to property names
//             .replace(/JssorSlideshowFormations\.FormationStraightStairs/g, '"JssorSlideshowFormations.FormationStraightStairs"')  // Convert function or object name to string
//             .replace(/Jease\.(\w+)/g, '"Jease.$1"');  // Convert function name (e.g., Jease.InCu) to string

//         try {
//             // Parse the modified string into a JavaScript object
//             const parsedValue = JSON.parse(selectedValue);
//             setSelectedTransition(parsedValue); // Update state with selected object
//             console.log("Selected Transition: ", parsedValue); // Optionally log or handle the selected transition
//         } catch (error) {
//             console.error("Error parsing the selected transition value:", error);
//         }

//     };



//     useEffect(() => {
//         const initSlider = () => {
//             if (window.JssorSlider) {
//                 console.log(selectedTransition)

//                 const jssor_1_SlideshowTransitions = [
//                     selectedTransition

//                 ];
//                 // Define the slideshow transitions

//                 console.log(jssor_1_SlideshowTransitions)

//                 const jssor_1_options = {
//                     AutoPlay: 1,
//                     SlideshowOptions: {
//                         Class: window.JssorSlideshowRunner,
//                         Transitions: jssor_1_SlideshowTransitions,
//                         TransitionsOrder: 1,
//                     },
//                     ArrowNavigatorOptions: {
//                         Class: window.JssorArrowNavigator,
//                     },
//                     BulletNavigatorOptions: {
//                         Class: window.JssorBulletNavigator,
//                     },
//                 };

//                 const slider = new window.JssorSlider("jssor_1", jssor_1_options);

//                 const MAX_WIDTH = 980;

//                 const ScaleSlider = () => {
//                     const containerWidth = slider.Elmt.parentNode.clientWidth;
//                     if (containerWidth) {
//                         const expectedWidth = Math.min(MAX_WIDTH, containerWidth);
//                         slider.ScaleWidth(expectedWidth);
//                     } else {
//                         window.setTimeout(ScaleSlider, 30);
//                     }
//                 };

//                 ScaleSlider();

//                 window.addEventListener("resize", ScaleSlider);
//                 window.addEventListener("orientationchange", ScaleSlider);

//                 return () => {
//                     window.removeEventListener("resize", ScaleSlider);
//                     window.removeEventListener("orientationchange", ScaleSlider);
//                 };
//             } else {
//                 console.error("JssorSlider is not loaded.");
//             }
//         };

//         setTimeout(() => {
//             initSlider();
//         }, 1000)
//     }, [selectedTransition]);


//     // const renderLinkRow = (label, linkKey, index) => {
//     //     // Access the correct link data from formData based on the index and linkKey
//     //     const currentLinkData = formData.linkDataValue2[index]?.linkDataValue1[index];
//     //     console.log(label, linkKey, index)
//     //     console.log(currentLinkData)
//     //     if (!currentLinkData) return null; // Return null if currentLinkData is undefined

//     //     return (
//     //         <div key={index} className="input-group input-group-sm mb-2">
//     //             {/* Link Form Elements */}
//     //             <input
//     //                 style={{ flex: '1' }}
//     //                 type="text"
//     //                 className="form-control form-control-sm name_input w-25"
//     //                 value={currentLinkData.name || ''}
//     //                 onChange={(e) => handleInputChange(index, linkKey, 'name', e.target.value)}
//     //                 placeholder={`${label} Name`}
//     //             />
//     //             <select
//     //                 style={{ flex: '1' }}
//     //                 className="form-control form-control-sm link_type"
//     //                 value={currentLinkData.align || ''}
//     //                 onChange={(e) => handleInputChange(index, linkKey, 'align', e.target.value)}
//     //             >
//     //                 <option value="">Button Center</option>
//     //                 <option value="float-left">Button Left Align</option>
//     //                 <option value="float-right">Button Right Align</option>
//     //             </select>

//     //             <div className="input-group-append" data-toggle="popover" title="" data-content="If you tick 'Scheduled' Pop Up will run given scheduled every day. Not whole Day" data-original-title="Scheduled">
//     //                 <div className="input-group-text">
//     //                     <input
//     //                         style={{ flex: '1' }}
//     //                         onChange={(e) => handleInputChange(index, linkKey, 'show', e.target.checked ? "1" : "0", 'checkbox')}
//     //                         checked={currentLinkData.show === "1"}
//     //                         type="checkbox"
//     //                         aria-label="Checkbox for following text input"
//     //                         value={currentLinkData.show}
//     //                     />
//     //                 </div>
//     //                 <span className="input-group-text"><i className="fas fa-info-circle mr-1"></i>Button Show</span>
//     //             </div>
//     //             <select
//     //                 style={{ flex: '1' }}
//     //                 className="form-control form-control-sm link_type w-25"
//     //                 value={currentLinkData.type || ''}
//     //                 onChange={(e) => handleSelectChange(index, linkKey, e.target.value)}
//     //             >
//     //                 <option value="1">External</option>
//     //                 <option value="2">Front page</option>
//     //                 <option value="3">No Link</option>
//     //                 <option value="4">Content Reference</option>
//     //             </select>
//     //             <input
//     //                 style={{ flex: '1' }}
//     //                 type="text"
//     //                 className="form-control form-control-sm select_result w-25"
//     //                 value={currentLinkData.value || ''}
//     //                 disabled={currentLinkData.disabled}
//     //                 onChange={(e) => handleInputChange(index, linkKey, 'value', e.target.value)}
//     //             />
//     //             {currentLinkData.type == '4' && (
//     //                 <div className="input-group-append">
//     //                     <span
//     //                         style={{ flex: '1' }}
//     //                         className="input-group-text search_icon"
//     //                         data-toggle={currentLinkData.type == '4' ? 'modal' : ''}
//     //                         data-target={currentLinkData.type == '4' ? '#exampleModal' : ''}
//     //                         onClick={() => currentLinkData.type == '4' && openModal(index, linkKey)}
//     //                     >
//     //                         <i className="fas fa-search"></i>
//     //                     </span>
//     //                 </div>
//     //             )}
//     //         </div>
//     //     );
//     // };
//     // const renderLinkRow = (label, linkKey, index) => {
//     //     const currentLinkData = formData.linkDataValue2[index]?.linkDataValue1[linkKey];
//     //     if (!currentLinkData) return null;
    
//     //     return (
//     //         <div key={`${index}-${linkKey}`} className="input-group input-group-sm mb-2">
//     //             {/* Name Input */}
//     //             <input
//     //                 style={{ flex: '1' }}
//     //                 type="text"
//     //                 className="form-control form-control-sm name_input w-25"
//     //                 value={currentLinkData.name || ''}
//     //                 onChange={(e) => handleInputChange(index, linkKey, 'name', e.target.value)}
//     //                 placeholder={`${label} Name`}
//     //             />
//     //             {/* Alignment Dropdown */}
//     //             <select
//     //                 style={{ flex: '1' }}
//     //                 className="form-control form-control-sm link_type"
//     //                 value={currentLinkData.align || ''}
//     //                 onChange={(e) => handleInputChange(index, linkKey, 'align', e.target.value)}
//     //             >
//     //                 <option value="">Button Center</option>
//     //                 <option value="float-left">Button Left Align</option>
//     //                 <option value="float-right">Button Right Align</option>
//     //             </select>
//     //             {/* Checkbox */}
//     //             <div className="input-group-append">
//     //                 <div className="input-group-text">
//     //                     <input
//     //                         type="checkbox"
//     //                         checked={currentLinkData.show === "1"}
//     //                         onChange={(e) => handleInputChange(index, linkKey, 'show', e.target.checked, 'checkbox')}
//     //                     />
//     //                 </div>
//     //                 <span className="input-group-text">
//     //                     <i className="fas fa-info-circle mr-1"></i>Button Show
//     //                 </span>
//     //             </div>
//     //             {/* Link Type Dropdown */}
//     //             <select
//     //                 style={{ flex: '1' }}
//     //                 className="form-control form-control-sm link_type w-25"
//     //                 value={currentLinkData.type || ''}
//     //                 onChange={(e) => handleSelectChange(index, linkKey, e.target.value)}
//     //             >
//     //                 <option value="1">External</option>
//     //                 <option value="2">Front page</option>
//     //                 <option value="3">No Link</option>
//     //                 <option value="4">Content Reference</option>
//     //             </select>
//     //             {/* Link Value Input */}
//     //             <input
//     //                 style={{ flex: '1' }}
//     //                 type="text"
//     //                 className="form-control form-control-sm select_result w-25"
//     //                 value={currentLinkData.value || ''}
//     //                 // disabled={currentLinkData.disabled}
//     //                 disabled={currentLinkData.type !== '1'}
//     //                 onChange={(e) => handleInputChange(index, linkKey, 'value', e.target.value)}
//     //             />
//     //             {/* Conditional Modal Button */}
//     //             {currentLinkData.type === '4' && (
//     //                 <div className="input-group-append">
//     //                     <span
//     //                         style={{ flex: '1' }}
//     //                                                 className="input-group-text search_icon"
//     //                                                 data-toggle={currentLinkData.type == '4' ? 'modal' : ''}
//     //                                                 data-target={currentLinkData.type == '4' ? '#exampleModal' : ''}
//     //                                                 onClick={() => currentLinkData.type == '4' && openModal(index, linkKey)}
//     //                     >
//     //                         <i className="fas fa-search"></i>
//     //                     </span>
//     //                 </div>
//     //             )}
//     //         </div>
//     //     );
//     // };
//     const onDragEnd = (result) => {
//         const { source, destination } = result;
    
//         // If no destination, exit
//         if (!destination) return;
    
//         // Reorder the items
//         const reorderedItems = Array.from(formData.linkDataValue2);
//         const [movedItem] = reorderedItems.splice(source.index, 1);
//         reorderedItems.splice(destination.index, 0, movedItem);
    
//         // Update state
//         setFormData({ ...formData, linkDataValue2: reorderedItems });
//       };
//     const renderLinkRow = (label, linkKey, index) => {
//         const currentIndexData = formData.linkDataValue2[index];
//         const currentLinkData = currentIndexData?.linkDataValue1?.[linkKey];
    
//         // If the data does not exist, return null
//         if (!currentIndexData || !currentLinkData) {
//             return null;
//         }
    
//         return (
//             <div key={`${index}-${linkKey}`} className="input-group input-group-sm mb-2">
//                 {/* Name Input */}
//                 <input
//                     style={{ flex: '1' }}
//                     type="text"
//                     className="form-control form-control-sm name_input w-25"
//                     value={currentLinkData.name || ''}
//                     onChange={(e) => handleInputChange(index, linkKey, 'name', e.target.value)}
//                     placeholder={`${label} Name`}
//                 />
//                 {/* Alignment Dropdown */}
//                 <select
//                     style={{ flex: '1' }}
//                     className="form-control form-control-sm link_type"
//                     value={currentLinkData.align || ''}
//                     onChange={(e) => handleInputChange(index, linkKey, 'align', e.target.value)}
//                 >
//                     <option value="">Button Center</option>
//                     <option value="float-left">Button Left Align</option>
//                     <option value="float-right">Button Right Align</option>
//                 </select>
//                 {/* Checkbox */}
//                 <div className="input-group-append">
//                     <div className="input-group-text">
//                         <input
//                             type="checkbox"
//                             checked={currentLinkData.show === "1"}
//                             onChange={(e) => handleInputChange(index, linkKey, 'show', e.target.checked, 'checkbox')}
//                         />
//                     </div>
//                     <span className="input-group-text">
//                         <i className="fas fa-info-circle mr-1"></i>Button Show
//                     </span>
//                 </div>
//                 {/* Link Type Dropdown */}
//                 <select
//                     style={{ flex: '1' }}
//                     className="form-control form-control-sm link_type w-25"
//                     value={currentLinkData.type || ''}
//                     onChange={(e) => handleSelectChange(index, linkKey, e.target.value)}
//                 >
//                     <option value="1">External</option>
//                     <option value="2">Front page</option>
//                     <option value="3">No Link</option>
//                     <option value="4">Content Reference</option>
//                 </select>
//                 {/* Link Value Input */}
//                 <input
//                     style={{ flex: '1' }}
//                     type="text"
//                     className="form-control form-control-sm select_result w-25"
//                     value={currentLinkData.value || ''}
//                     disabled={currentLinkData.type !== '1'}
//                     onChange={(e) => handleInputChange(index, linkKey, 'value', e.target.value)}
//                 />
//                 {/* Conditional Modal Button */}
//                 {currentLinkData.type === '4' && (
//                     <div className="input-group-append">
//                         <span
//                             style={{ flex: '1' }}
//                             className="input-group-text search_icon"
//                             data-toggle={currentLinkData.type === '4' ? 'modal' : ''}
//                             data-target={currentLinkData.type === '4' ? '#exampleModal' : ''}
//                             onClick={() => currentLinkData.type === '4' && openModal(index, linkKey)}
//                         >
//                             <i className="fas fa-search"></i>
//                         </span>
//                     </div>
//                 )}
//             </div>
//         );
//     };


//     return (
//         <DragDropContext onDragEnd={onDragEnd}>
//         <div className="col-md-12 bg-light body-content p-4">
//           <div className="card shadow-sm border-0">
//             <div className="card-header bg-gradient-primary py-1 text-white d-flex justify-content-between align-items-center">
//               <h5 className="card-title mb-0">Create Slider</h5>
//               <a href="#" className="btn btn-sm btn-info">Back to Slider List</a>
//             </div>
//             <div className="card-body bg-gradient-light">
//               <form className="form-horizontal" method="post" autoComplete="off">
//                 <Droppable droppableId="sliderList">
//                   {(provided) => (
//                     <ul
//                       {...provided.droppableProps}
//                       ref={provided.innerRef}
//                       style={{ listStyleType: "none", padding: 0 }}
//                     >
//                       {formData?.linkDataValue2?.map((data, index) => (
//                         <Draggable key={index} draggableId={`${index}`} index={index}>
//                           {(provided) => (
//                             <li
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               style={{
//                                 ...provided.draggableProps.style,
//                                 display: "flex",
//                                 alignItems: "flex-start",
//                                 marginBottom: "8px",
//                                 border: "1px solid #ddd",
//                                 padding: "8px",
//                                 borderRadius: "4px",
//                                 background: "#fff"
//                               }}
//                             >
//                               <img
//                                 src={data.file_path}
//                                 alt="Slider"
//                                 style={{ width: "50px", height: "auto", marginRight: "8px" }}
//                               />
//                               <div style={{ flex: 1 }}>
//                                 <input
//                                   type="text"
//                                   className="form-control form-control-sm mb-2"
//                                   value={data.name}
//                                   onChange={(e) => {
//                                     const newData = [...formData.linkDataValue2];
//                                     newData[index].name = e.target.value;
//                                     setFormData({ ...formData, linkDataValue2: newData });
//                                   }}
//                                   placeholder="Enter Name"
//                                 />
//                                 {/* Additional Fields and `renderLinkRow` */}
//                               </div>
//                             </li>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </ul>
//                   )}
//                 </Droppable>
//               </form>
//             </div>
//           </div>
//         </div>
//       </DragDropContext>
//     );
// };

// export default SliderUpdate;