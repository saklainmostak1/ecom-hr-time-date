// 'use client' 
 //ismile
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { FaTrash, FaUpload } from 'react-icons/fa';

// const SliderCreates = () => {


//     //  linkData2 start



//     // const [linkData2, setLinkData2] = useState({
//     //     link1: { type: '1', file_path: '', value: 'https//', disabled: false, name: '', align: '' },
//     // });

//     // const [selectedFile2, setSelectedFile2] = useState({});
//     // const [fileErrors, setFileErrors] = useState({});
//     // const [fileNames2, setFileNames2] = useState({});

//     // const handleSelectChange2 = (id, value) => {
//     //     const updatedLinkData2 = { ...linkData2 };
//     //     updatedLinkData2[id].type = value;

//     //     switch (value) {
//     //         case '1': // External
//     //             updatedLinkData2[id].value = 'https//';
//     //             updatedLinkData2[id].disabled = false;
//     //             break;
//     //         case '2': // Front page
//     //             updatedLinkData2[id].value = 'font';
//     //             updatedLinkData2[id].disabled = true;
//     //             break;
//     //         case '3': // No Link
//     //             updatedLinkData2[id].value = 'no link';
//     //             updatedLinkData2[id].disabled = true;
//     //             break;
//     //         case '4': // Content Reference
//     //             updatedLinkData2[id].value = '';
//     //             updatedLinkData2[id].disabled = true;
//     //             break;
//     //         default:
//     //             break;
//     //     }
//     //     setLinkData2(updatedLinkData2);
//     // };

//     // const handleInputChange2 = (id, key, value) => {
//     //     setLinkData2((prevState) => ({
//     //         ...prevState,
//     //         [id]: {
//     //             ...prevState[id],
//     //             [key]: value,
//     //         },
//     //     }));
//     // };



//     // const [formData, setFormData] = useState({
//     //     title: "",
//     //     file_path: ""
//     // });


//     // const type_file_change = (key, e) => {
//     //     e.preventDefault();
//     //     const file = e.target.files[0];

//     //     if (!file) return;

//     //     if (file.size > 2097152) {
//     //         setFileErrors((prev) => ({ ...prev, [key]: 'Max file size is 2 MB' }));
//     //         return;
//     //     }

//     //     const now = new Date();
//     //     const year = now.getFullYear();
//     //     const month = String(now.getMonth() + 1).padStart(2, '0');
//     //     const day = String(now.getDate()).padStart(2, '0');
//     //     const hours = String(now.getHours()).padStart(2, '0');
//     //     const minutes = String(now.getMinutes()).padStart(2, '0');

//     //     const fileName = file.name.split('.')[0];
//     //     const extension = file.name.split('.').pop();
//     //     const newName = `${fileName}(${key}).${extension}`;
//     //     const filePath = `custom_page/${year}/${month}/${day}/${hours}/${minutes}/${fileName}.${extension}`;
//     //     console.log(filePath)
//     //     // console.log(newName)
//     //     console.log(extension)
//     //     console.log(fileName)
//     //     setSelectedFile2((prevState) => ({ ...prevState, [key]: file }));
//     //     setFileNames2((prevState) => ({ ...prevState, [key]: newName }));
//     //     setFormData((prevState) => ({
//     //         ...prevState,
//     //         [key]: { ...prevState[key], file_path: filePath },
//     //     }));

//     //     upload2(file, filePath);
//     // };

//     // const upload2 = (file, path) => {
//     //     const formData = new FormData();
//     //     formData.append('files', file);
//     //     formData.append('path', path);

//     //     axios
//     //         .post(`${process.env.NEXT_PUBLIC_API_URL}:5003/custom_page/custom_page_image`, formData)
//     //         .then((res) => {
//     //             console.log('File uploaded successfully:', res.data);
//     //         })
//     //         .catch((error) => {
//     //             console.error('Error uploading file:', error);
//     //         });
//     // };

//     // console.log(linkData2)



//     const [modalData2, setModalData2] = useState({ id: '', value: '' });
//     const openModal2 = (id) => {
//         if (linkData2[id].type === '4') {
//             setModalData2({ id, value: linkData2[id].value });
//             $('#exampleModal').modal('show'); // Ensure modal shows when opened
//         }
//     };

//     const saveModalChanges2 = (page) => {
//         setActiveTabs('');
//         setModalData2((prev) => {
//             const updatedData = { ...prev, value: page };
//             setLinkData2((prevState) => ({
//                 ...prevState,
//                 [updatedData.id]: {
//                     ...prevState[updatedData.id],
//                     value: updatedData.value,
//                 },
//             }));
//             return updatedData;
//         });

//         $('#exampleModal').modal('hide'); // Close the modal
//     };


//     // console.log(linkData2)


//     // const [linkData, setLinkData] = useState({
//     //     link1: { type: '1', value: 'https//', disabled: false, name: '', align: '', show: '' },
//     //     link2: { type: '1', value: 'https//', disabled: false, name: '', align: '', show: '' },

//     // });

//     // const handleSelectChange = (id, value) => {
//     //     const updatedLinkData = { ...linkData };
//     //     updatedLinkData[id].type = value;

//     //     switch (value) {
//     //         case '1': // External
//     //             updatedLinkData[id].value = 'https//';
//     //             updatedLinkData[id].disabled = false;
//     //             break;
//     //         case '2': // Front page
//     //             updatedLinkData[id].value = 'font';
//     //             updatedLinkData[id].disabled = true;
//     //             break;
//     //         case '3': // No Link
//     //             updatedLinkData[id].value = 'no link';
//     //             updatedLinkData[id].disabled = true;
//     //             break;
//     //         case '4': // Content Reference
//     //             updatedLinkData[id].value = '';
//     //             updatedLinkData[id].disabled = true;
//     //             break;
//     //         default:
//     //             break;
//     //     }


//     //     setLinkData(updatedLinkData)

//     // };
//     const [modalData, setModalData] = useState({ id: '', value: '' });

//     // const handleInputChange = (id, key, value, type = null) => {
//     //     setLinkData((prevState) => {
//     //         const updatedState = { ...prevState };

//     //         if (type === "checkbox") {
//     //             updatedState[id] = {
//     //                 ...updatedState[id],
//     //                 [key]: value ? "1" : "0", // Set "1" if checked, "0" otherwise
//     //             };
//     //         } else {
//     //             updatedState[id] = {
//     //                 ...updatedState[id],
//     //                 [key]: value,
//     //             };
//     //         }

//     //         return updatedState;
//     //     });
//     // };

//     const openModal = (id) => {
//         if (linkData[id].type === '4') {
//             // Show the modal for content reference and set the modal data
//             setModalData({ id, value: linkData[id].value });
//         }


//     };

//     console.log(modalData)



//     const saveModalChanges = (page) => {
//         setActiveTabs('')
//         setModalData((prev) => {
//             const updatedData = { ...prev, value: page };
//             setLinkData((prevState) => ({
//                 ...prevState,
//                 [updatedData.id]: {
//                     ...prevState[updatedData.id],
//                     value: updatedData.value,
//                 },
//             }));
//             return updatedData; // Return the updated modalData
//         });

//         $('#exampleModal').modal('hide'); // Close the modal
//     };



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
//     const [formData, setFormData] = useState([]);
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

//     // Handle input changes for linkData
//     // const handleInputChange = (id, key, value, type = null) => {
//     //     setLinkData((prevState) => {
//     //         const updatedState = { ...prevState };
//     //         if (type === "checkbox") {
//     //             updatedState[id] = {
//     //                 ...updatedState[id],
//     //                 [key]: value ? "1" : "0", // Set "1" if checked, "0" otherwise
//     //             };
//     //         } else {
//     //             updatedState[id] = {
//     //                 ...updatedState[id],
//     //                 [key]: value,
//     //             };
//     //         }
//     //         return updatedState;
//     //     });
//     // };

//     // // Handle select changes for linkData
//     // const handleSelectChange = (id, value) => {
//     //     const updatedLinkData = { ...linkData };
//     //     updatedLinkData[id].type = value;

//     //     switch (value) {
//     //         case '1': // External
//     //             updatedLinkData[id].value = 'https//';
//     //             updatedLinkData[id].disabled = false;
//     //             break;
//     //         case '2': // Front page
//     //             updatedLinkData[id].value = 'font';
//     //             updatedLinkData[id].disabled = true;
//     //             break;
//     //         case '3': // No Link
//     //             updatedLinkData[id].value = 'no link';
//     //             updatedLinkData[id].disabled = true;
//     //             break;
//     //         case '4': // Content Reference
//     //             updatedLinkData[id].value = '';
//     //             updatedLinkData[id].disabled = true;
//     //             break;
//     //         default:
//     //             break;
//     //     }

//     //     setLinkData(updatedLinkData);
//     // };

//     const handleSelectChange = (index, linkKey, value) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData]; // Clone the array

//             // Update the type and handle other properties accordingly
//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue1: {
//                     ...updatedFormData[index].linkDataValue1,
//                     [linkKey]: {
//                         ...updatedFormData[index].linkDataValue1[linkKey],
//                         type: value, // Update the type field
//                         value: value === '1' ? 'https://' : value === '2' ? 'font' : value === '3' ? 'no link' : '',
//                         disabled: value === '2' || value === '3' || value === '4', // Handle disabled state based on value
//                     },
//                 },
//             };

//             return updatedFormData; // Return the updated state
//         });
//     };

//     const handleInputChange = (index, linkKey, key, value, type = null) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData]; // Clone the array

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

//     // Handle select changes for linkData2
//     // const handleSelectChange2 = (id, value) => {
//     //     const updatedLinkData2 = { ...linkData2 };
//     //     updatedLinkData2[id].type = value;

//     //     switch (value) {
//     //         case '1': // External
//     //             updatedLinkData2[id].value = 'https//';
//     //             updatedLinkData2[id].disabled = false;
//     //             break;
//     //         case '2': // Front page
//     //             updatedLinkData2[id].value = 'font';
//     //             updatedLinkData2[id].disabled = true;
//     //             break;
//     //         case '3': // No Link
//     //             updatedLinkData2[id].value = 'no link';
//     //             updatedLinkData2[id].disabled = true;
//     //             break;
//     //         case '4': // Content Reference
//     //             updatedLinkData2[id].value = '';
//     //             updatedLinkData2[id].disabled = true;
//     //             break;
//     //         default:
//     //             break;
//     //     }

//     //     setLinkData2(updatedLinkData2);
//     // };

//     const handleSelectChange2 = (key, value, index) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData];
//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue2: {
//                     ...updatedFormData[index].linkDataValue2,
//                     [key]: {
//                         ...updatedFormData[index].linkDataValue2[key],
//                         type: value, // Update the type based on the selected value
//                         value: value === '1' ? 'https//' : value === '2' ? 'font' : value === '3' ? 'no link' : '', // Adjust other values accordingly
//                         disabled: value !== '1', // Enable/disable based on the selected value
//                     },
//                 },
//             };
//             return updatedFormData;
//         });
//     };

//     // Handle input changes for linkData2
//     // const handleInputChange2 = (id, key, value) => {
//     //     setLinkData2((prevState) => ({
//     //         ...prevState,
//     //         [id]: {
//     //             ...prevState[id],
//     //             [key]: value,
//     //         },
//     //     }));
//     // };

//     const handleInputChange2 = (id, key, value, index) => {
//         // Create a copy of formData to avoid mutating the original state directly
//         const updatedFormData = [...formData];

//         // Update the nested structure within the specific index
//         updatedFormData[index] = {
//             ...updatedFormData[index],  // Copy the current object at the index
//             linkDataValue2: {
//                 ...updatedFormData[index].linkDataValue2,  // Copy existing linkDataValue2
//                 [id]: {
//                     ...updatedFormData[index].linkDataValue2[id],  // Copy the specific id
//                     [key]: value,  // Update the specific key with the new value
//                 },
//             },
//         };

//         // Update the formData state with the new updatedFormData
//         setFormData(updatedFormData);
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
//                 linkDataValue1: { ...linkData },
//                 linkDataValue2: { ...linkData2 },
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

//     const handleInputChangeForTitle = (value, index) => {
//         setFormData((prevFormData) => {
//             // Clone the current formData array
//             const updatedFormData = [...prevFormData];

//             // Update the specific field in the array based on index
//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue1: {
//                     ...updatedFormData[index].linkDataValue1,
//                     // Update the title field or any other nested property
//                     title: value,
//                 },
//             };

//             // Return the updated formData
//             return updatedFormData;
//         });
//     };

//     // Example for updating other fields (like summary, or any other nested fields)
//     const handleInputChangeForSummary = (value, index) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData];

//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue1: {
//                     ...updatedFormData[index].linkDataValue1,
//                     summary: value,
//                 },
//             };

//             return updatedFormData;
//         });
//     };

//     console.log(formData)


//     // const renderLinkRow = (label, id) => (
//     //     <div className="form-group row">

//     //         <div className="col-md-12">

//     //             <div className="input-group input-group-sm">
//     //                 <input
//     //                     style={{ flex: '1' }}
//     //                     type="text"
//     //                     className="form-control form-control-sm name_input w-25"
//     //                     value={linkData[id].name}
//     //                     onChange={(e) => handleInputChange(id, 'name', e.target.value)}
//     //                     placeholder="Name"
//     //                 />
//     //                 <select
//     //                     style={{ flex: '1' }}
//     //                     className="form-control form-control-sm link_type"
//     //                     value={linkData[id].align}
//     //                     onChange={(e) => handleInputChange(id, 'align', e.target.value)}
//     //                 >
//     //                     <option value="">Button Center</option>
//     //                     <option value="float-left">Button Left Align</option>
//     //                     <option value="float-right">Button Right Align</option>
//     //                 </select>
//     //                 <div class="input-group-append" data-toggle="popover" title="" data-content="If you tick 'Scheduled' Pop Up will run given scheduled every day. Not whole Day" data-original-title="Scheduled">
//     //                     <div class="input-group-text">
//     //                         <input style={{ flex: '1' }} onChange={(e) =>
//     //                             handleInputChange(id, "show", e.target.checked, "checkbox")
//     //                         } checked={linkData[id].show == "1"} type="checkbox" aria-label="Checkbox for following text input" value={linkData[id].show} />
//     //                     </div>
//     //                     <span class="input-group-text "><i class="fas fa-info-circle mr-1"></i>Button Show</span>
//     //                 </div>
//     //                 <select
//     //                     style={{ flex: '1' }}
//     //                     className="form-control form-control-sm link_type w-25"
//     //                     value={linkData[id].type}
//     //                     onChange={(e) => handleSelectChange(id, e.target.value)}
//     //                 >
//     //                     <option value="1">External</option>
//     //                     <option value="2">Front page</option>
//     //                     <option value="3">No Link</option>
//     //                     <option value="4">Content Reference</option>
//     //                 </select>
//     //                 <input
//     //                     style={{ flex: '1' }}
//     //                     type="text"
//     //                     className="form-control form-control-sm select_result w-25"
//     //                     value={linkData[id].value}
//     //                     disabled={linkData[id].disabled}
//     //                     onChange={(e) => handleInputChange(id, 'value', e.target.value)}
//     //                 />
//     //                 {linkData[id].type === '4' && (
//     //                     <div className="input-group-append">
//     //                         <span
//     //                             style={{ flex: '1' }}
//     //                             className="input-group-text search_icon"
//     //                             data-toggle={linkData[id].type === '4' ? 'modal' : ''}
//     //                             data-target={linkData[id].type === '4' ? '#exampleModal' : ''}
//     //                             onClick={() => linkData[id].type === '4' && openModal(id)}
//     //                         >
//     //                             <i className="fas fa-search"></i>
//     //                         </span>
//     //                     </div>
//     //                 )}
//     //             </div>

//     //         </div>
//     //     </div>
//     // );

//     const renderLinkRow = (label, linkKey, index) => {
//         const currentLinkData = formData[index].linkDataValue1[linkKey]; // Access the correct link data

//         return (
//             <div key={index} className="input-group input-group-sm mb-2">
//                 {/* Link Form Elements */}
//                 <input
//                     style={{ flex: '1' }}
//                     type="text"
//                     className="form-control form-control-sm name_input w-25"
//                     value={currentLinkData.name}
//                     onChange={(e) => handleInputChange(index, linkKey, 'name', e.target.value)}
//                     placeholder={`${label} Name`}
//                 />
//                 <select
//                     style={{ flex: '1' }}
//                     className="form-control form-control-sm link_type"
//                     value={currentLinkData.align}
//                     onChange={(e) => handleInputChange(index, linkKey, 'align', e.target.value)}
//                 >
//                     <option value="">Button Center</option>
//                     <option value="float-left">Button Left Align</option>
//                     <option value="float-right">Button Right Align</option>
//                 </select>

//                     <div class="input-group-append" data-toggle="popover" title="" data-content="If you tick 'Scheduled' Pop Up will run given scheduled every day. Not whole Day" data-original-title="Scheduled">
//                     <div class="input-group-text">
//                     <input
//                         style={{ flex: '1' }}
//                         onChange={(e) => handleInputChange(index, linkKey, 'show', e.target.checked, 'checkbox')}
//                         checked={currentLinkData.show === "1"}
//                         type="checkbox"
//                         aria-label="Checkbox for following text input"
//                         value={currentLinkData.show}
//                     />
//                        </div>
//                         <span class="input-group-text "><i class="fas fa-info-circle mr-1"></i>Button Show</span>
//                     </div>
//                 <select
//                     style={{ flex: '1' }}
//                     className="form-control form-control-sm link_type w-25"
//                     value={currentLinkData.type}
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
//                     value={currentLinkData.value}
//                     disabled={currentLinkData.disabled}
//                     onChange={(e) => handleInputChange(index, linkKey, 'value', e.target.value)}
//                 />
//                 {currentLinkData.type === '4' && (
//                         <div className="input-group-append">
//                             <span
//                                 style={{ flex: '1' }}
//                                 className="input-group-text search_icon"
//                                 data-toggle={currentLinkData.type === '4' ? 'modal' : ''}
//                                 data-target={currentLinkData.type === '4' ? '#exampleModal' : ''}
//                                 onClick={() => currentLinkData.type === '4' && openModal(index, linkKey)}
//                             >
//                                 <i className="fas fa-search"></i>
//                             </span>
//                         </div>
//                     )}
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
//                     <form className="form-horizontal" method="post" autoComplete="off">
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
//                                                 required
//                                             />
//                                         </div>
//                                     </div>
//                                     {/* <div className="card mb-3 shadow-sm">
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
//                                                     {formData.map((data, index) => (
//                                                         <li
//                                                             key={index}
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
//                                                                 src={`https://usms.urbanitsolution.com/files/slider/${data.file_path}`}
//                                                                 alt="Slider"
//                                                                 style={{ width: "50px", height: "auto", marginRight: "8px" }}
//                                                             />
//                                                             <div style={{ flex: 1, marginRight: "8px" }}>
//                                                                 <h5 style={{ margin: "0 0 8px 0" }}>
//                                                                     {Object.keys(linkData2).map((key) => (
//                                                                         <div key={key} style={{ display: "flex", justifyContent: "space-between" }}>
//                                                                             <select
//                                                                                 className="form-control form-control-sm"
//                                                                                 value={linkData2[key].type}
//                                                                                 onChange={(e) => handleSelectChange2(key, e.target.value)}
//                                                                             >
//                                                                                 <option value="1">External</option>
//                                                                                 <option value="2">Front page</option>
//                                                                                 <option value="3">No Link</option>
//                                                                                 <option value="4">Content Reference</option>
//                                                                             </select>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className="form-control form-control-sm"
//                                                                                 value={linkData2[key].value}
//                                                                                 disabled={linkData2[key].disabled}
//                                                                                 onChange={(e) => handleInputChange2(key, "value", e.target.value)}
//                                                                             />
//                                                                         </div>
//                                                                     ))}
//                                                                 </h5>
//                                                                 <h5 style={{ margin: "0 0 8px 0" }}>
//                                                                     <input
//                                                                         name="title"
//                                                                         className="form-control form-control-sm"
//                                                                         placeholder="Enter Title"
//                                                                         type="text"
//                                                                         style={{ width: "100%" }}
//                                                                     />
//                                                                 </h5>
//                                                                 <textarea
//                                                                     name="summary"
//                                                                     className="form-control form-control-sm"
//                                                                     placeholder="Enter Brief"
//                                                                     style={{ width: "100%" }}
//                                                                 />
//                                                                 <div className='mt-2'>
//                                                                     {renderLinkRow('Link1', 'link1')}
//                                                                     {renderLinkRow('Link2', 'link2')}
//                                                                 </div>
//                                                             </div>
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </div>
//                                         </div>
//                                     </div> */}
//                                     {/* <div className="card mb-3 shadow-sm">
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
//                                                     {formData.map((data, index) => (
//                                                         <li
//                                                             key={index}
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
//                                                                 <h5 style={{ margin: "0 0 8px 0" }}>
//                                                                     {Object.keys(linkData2).map((key) => (
//                                                                         <div key={key} style={{ display: "flex", justifyContent: "space-between" }}>
//                                                                             <select
//                                                                                 className="form-control form-control-sm"
//                                                                                 value={linkData2[key].type}
//                                                                                 onChange={(e) => handleSelectChange2(key, e.target.value, index)} // Pass index here
//                                                                             >
//                                                                                 <option value="1">External</option>
//                                                                                 <option value="2">Front page</option>
//                                                                                 <option value="3">No Link</option>
//                                                                                 <option value="4">Content Reference</option>
//                                                                             </select>
//                                                                             <input
//                                                                                 type="text"
//                                                                                 className="form-control form-control-sm"
//                                                                                 value={linkData2[key].value}
//                                                                                 disabled={linkData2[key].disabled}
//                                                                                 onChange={(e) => handleInputChange2(key, "value", e.target.value, index)} // Pass index here
//                                                                             />
//                                                                         </div>
//                                                                     ))}
//                                                                 </h5>
//                                                                 <h5 style={{ margin: "0 0 8px 0" }}>
//                                                                     <input
//                                                                         name="title"
//                                                                         className="form-control form-control-sm"
//                                                                         placeholder="Enter Title"
//                                                                         type="text"
//                                                                         style={{ width: "100%" }}
//                                                                         onChange={(e) => handleInputChangeForTitle(e.target.value, index)} // Pass index here
//                                                                     />
//                                                                 </h5>
//                                                                 <textarea
//                                                                     name="summary"
//                                                                     className="form-control form-control-sm"
//                                                                     placeholder="Enter Brief"
//                                                                     style={{ width: "100%" }}
//                                                                     onChange={(e) => handleInputChangeForSummary(e.target.value, index)} // Pass index here
//                                                                 />
//                                                                 <div className='mt-2'>
//                                                                     {renderLinkRow('Link1', 'link1', index)} 
//                                                                     {renderLinkRow('Link2', 'link2', index)} 
//                                                                 </div>
//                                                             </div>
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </div>
//                                         </div>
//                                     </div> */}
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
//                                                     {formData.map((data, index) => (
//                                                         <li
//                                                             key={index}
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
//                                                             <h5 style={{ margin: "0 0 8px 0" }}>
//                                                                     {Object.keys(data.linkDataValue2).map((key) => (
//                                                                         <div key={key} style={{ display: "flex", justifyContent: "space-between" }}>
//                                                                             <select
//                                                                                 className="form-control form-control-sm"
//                                                                                 value={data.linkDataValue2[key].type}
//                                                                                 onChange={(e) => handleSelectChange2(key, e.target.value, index)} // Pass index here
//                                                                             >
//                                                                                 <option value="1">External</option>
//                                                                                 <option value="2">Front page</option>
//                                                                                 <option value="3">No Link</option>
//                                                                                 <option value="4">Content Reference</option>
//                                                                             </select>

//                                                                             <input
//                                                                                 type="text"
//                                                                                 className="form-control form-control-sm"
//                                                                                 value={data.linkDataValue2[key].value}
//                                                                                 disabled={data.linkDataValue2[key].disabled}
//                                                                                 onChange={(e) => handleInputChange2(key, "value", e.target.value, index)} // Pass index here
//                                                                             />
//  {data?.linkDataValue2[key].type == '4' && (
//                                                                                 <div className="input-group-append">
//                                                                                     <span
//                                                                                         className="input-group-text search_icon"
//                                                                                         data-toggle={linkData2[key].type === '4' ? 'modal' : ''}
//                                                                                         data-target={linkData2[key].type === '4' ? '#exampleModal' : ''}
//                                                                                         onClick={() => openModal2(key)}
//                                                                                     >
//                                                                                         <i className="fas fa-search"></i>
//                                                                                     </span>
//                                                                                 </div>
//                                                                             )}
//                                                                         </div>
//                                                                     ))}
//                                                                 </h5>
//                                                                 <h5 style={{ margin: "0 0 8px 0" }}>
//                                                                     <input
//                                                                         name="title"
//                                                                         className="form-control form-control-sm"
//                                                                         placeholder="Enter Title"
//                                                                         type="text"
//                                                                         style={{ width: "100%" }}
//                                                                         onChange={(e) => handleInputChangeForTitle(e.target.value, index)} // Pass index here
//                                                                     />
//                                                                 </h5>
//                                                                 <textarea
//                                                                     name="summary"
//                                                                     className="form-control form-control-sm"
//                                                                     placeholder="Enter Brief"
//                                                                     style={{ width: "100%" }}
//                                                                     onChange={(e) => handleInputChangeForSummary(e.target.value, index)} // Pass index here
//                                                                 />

//                                                                 <div className='mt-2'>
//                                                                     {renderLinkRow('Link1', 'link1', index)} {/* Pass index here */}
//                                                                     {renderLinkRow('Link2', 'link2', index)} {/* Pass index here */}
//                                                                 </div>
//                                                             </div>
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* <div className="card mb-3 shadow-sm">
//                                         <div className="card-header bg-gradient-primary text-white py-1 d-flex justify-content-between align-items-center">
//                                             <h6 className="card-title mb-0">Image List</h6>
//                                             <span style={{ width: '150px' }} className="btn btn-success btn-sm mb-2">
//                                                 <label htmlFor={`fileInput`} className="mb-0">
//                                                     <FaUpload /> Select Image
//                                                 </label>
//                                                 <input
//                                                     type="file"
//                                                     id={`fileInput`}
//                                                     style={{ display: 'none' }}
//                                                     onChange={(e) => type_file_change(e)}
//                                                 />
//                                             </span>
//                                         </div>
//                                         <div className="media-body">
//                                             <div style={{ width: "100%" }}>
//                                                 <ul style={{ listStyleType: "none", padding: 0 }}>

//                                                     <li
//                                                         key=''
//                                                         style={{
//                                                             display: "flex",
//                                                             alignItems: "flex-start",
//                                                             marginBottom: "8px",
//                                                             border: "1px solid #ddd",
//                                                             padding: "8px",
//                                                             borderRadius: "4px",
//                                                         }}
//                                                     >
//                                                         <img
//                                                             src='https://usms.urbanitsolution.com/files/slider/137d3b3bd1f57be4d8a018e49cd375eb3f239526.png'
//                                                             alt="Slider"
//                                                             style={{ width: "50px", height: "auto", marginRight: "8px" }}
//                                                         />
//                                                         <div style={{ flex: 1, marginRight: "8px" }}>

//                                                             <h5 style={{ margin: "0 0 8px 0" }}>


//                                                                 {Object.keys(linkData2).map((key) => (
//                                                                     <>
//                                                                         <div style={{ display: "flex", justifyContent: "space-between" }}>

//                                                                             <select
//                                                                                 className="form-control form-control-sm"
//                                                                                 value={linkData2[key].type}
//                                                                                 onChange={(e) => handleSelectChange2(key, e.target.value)}
//                                                                             >
//                                                                                 <option value="1">External</option>
//                                                                                 <option value="2">Front page</option>
//                                                                                 <option value="3">No Link</option>
//                                                                                 <option value="4">Content Reference</option>
//                                                                             </select>

//                                                                             <input
//                                                                                 type="text"
//                                                                                 className="form-control form-control-sm"
//                                                                                 value={linkData2[key].value}
//                                                                                 disabled={linkData2[key].disabled}
//                                                                                 onChange={(e) => handleInputChange2(key, 'value', e.target.value)}
//                                                                             />
//                                                                             {linkData2[key].type === '4' && (
//                                                                                 <div className="input-group-append">
//                                                                                     <span
//                                                                                         className="input-group-text search_icon"
//                                                                                         data-toggle={linkData2[key].type === '4' ? 'modal' : ''}
//                                                                                         data-target={linkData2[key].type === '4' ? '#exampleModal' : ''}
//                                                                                         onClick={() => openModal2(key)}
//                                                                                     >
//                                                                                         <i className="fas fa-search"></i>
//                                                                                     </span>
//                                                                                 </div>
//                                                                             )}
//                                                                         </div>
//                                                                     </>
//                                                                 ))}


//                                                             </h5>
//                                                             <h5 style={{ margin: "0 0 8px 0" }}>
//                                                                 <input
//                                                                     name='title'
//                                                                     className="form-control form-control-sm"
//                                                                     placeholder="Enter Title"
//                                                                     type="text"
//                                                                     style={{ width: "100%" }}
//                                                                 />
//                                                             </h5>
//                                                             <h5 style={{ margin: "0 0 8px 0" }}>
//                                                                 <input
//                                                                     name='title'
//                                                                     className="form-control form-control-sm"
//                                                                     placeholder="Enter Title"
//                                                                     type="text"
//                                                                     style={{ width: "100%" }}
//                                                                 />
//                                                             </h5>
//                                                             <textarea
//                                                                 name='summary'
//                                                                 className="form-control form-control-sm"
//                                                                 placeholder="Enter Brief"
//                                                                 style={{ width: "100%", marginBottom: "8px" }}
//                                                             ></textarea>
//                                                             <div >
//                                                                 {renderLinkRow('Link1', 'link1')}
//                                                                 {renderLinkRow('Link2', 'link2')}
//                                                             </div>
//                                                         </div>
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-danger btn-sm"
//                                                             style={{ alignSelf: "center" }}
//                                                         >
//                                                             <i className="fas fa-trash-alt"></i>
//                                                             <span style={{ marginLeft: "4px" }}>Delete</span>
//                                                         </button>
//                                                         <input
//                                                             type="hidden"
//                                                             name='slider_image'
//                                                             value='https://usms.urbanitsolution.com/files/slider/137d3b3bd1f57be4d8a018e49cd375eb3f239526.png'
//                                                         />
//                                                     </li>

//                                                 </ul>
//                                             </div>

//                                         </div>
//                                     </div> */}
//                                     <div className="form-group row">
//                                         <label className="col-md-3 col-form-label font-weight-bold">
//                                             Transition (Animation):
//                                             <small>
//                                                 <sup>
//                                                     <i className="text-danger fas fa-star"></i>
//                                                 </sup>
//                                             </small>
//                                         </label>
//                                         <div className="col-md-9">
//                                             <select className="form-control form-control-sm"></select>
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
//                                 <div className="col-md-5">
//                                     <div className="card shadow-sm">
//                                         <div className="card-header bg-gradient-primary text-white py-1">
//                                             <h6 className="card-title mb-0">Transition Animation Example</h6>
//                                         </div>
//                                         <div className="card-body">
//                                             <div id="sliderPreview">
//                                                 <img
//                                                     src="https://usms.urbanitsolution.com/web_content/img/1.jpg"
//                                                     alt="Example Slider"
//                                                     className="img-fluid"
//                                                 />
//                                             </div>
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

// export default SliderCreates;


// 'use client' 
 //ismile
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { FaTrash, FaUpload } from 'react-icons/fa';

// const SliderCreates = () => {

//     const [modalData, setModalData] = useState({ id: '', value: '' });


//     const openModal = (id) => {
//         if (linkData[id].type === '4') {
//             // Show the modal for content reference and set the modal data
//             setModalData({ id, value: linkData[id].value });
//         }


//     };

//     // 
//     const [formData, setFormData] = useState([]);
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

//     // // Handle input changes for linkData
//     // const handleInputChange = (id, key, value, type = null) => {
//     //     setLinkData((prevState) => {
//     //         const updatedState = { ...prevState };
//     //         if (type === "checkbox") {
//     //             updatedState[id] = {
//     //                 ...updatedState[id],
//     //                 [key]: value ? "1" : "0", // Set "1" if checked, "0" otherwise
//     //             };
//     //         } else {
//     //             updatedState[id] = {
//     //                 ...updatedState[id],
//     //                 [key]: value,
//     //             };
//     //         }
//     //         return updatedState;
//     //     });
//     // };

//     // // Handle select changes for linkData
//     // const handleSelectChange = (id, value) => {
//     //     const updatedLinkData = { ...linkData };
//     //     updatedLinkData[id].type = value;

//     //     switch (value) {
//     //         case '1': // External
//     //             updatedLinkData[id].value = 'https//';
//     //             updatedLinkData[id].disabled = false;
//     //             break;
//     //         case '2': // Front page
//     //             updatedLinkData[id].value = 'font';
//     //             updatedLinkData[id].disabled = true;
//     //             break;
//     //         case '3': // No Link
//     //             updatedLinkData[id].value = 'no link';
//     //             updatedLinkData[id].disabled = true;
//     //             break;
//     //         case '4': // Content Reference
//     //             updatedLinkData[id].value = '';
//     //             updatedLinkData[id].disabled = true;
//     //             break;
//     //         default:
//     //             break;
//     //     }

//     //     setLinkData(updatedLinkData);
//     // };
//     const handleSelectChange = (index, linkKey, value) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData]; // Clone the array

//             // Update the type and handle other properties accordingly
//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue1: {
//                     ...updatedFormData[index].linkDataValue1,
//                     [linkKey]: {
//                         ...updatedFormData[index].linkDataValue1[linkKey],
//                         type: value, // Update the type field
//                         value: value === '1' ? 'https://' : value === '2' ? 'font' : value === '3' ? 'no link' : '',
//                         disabled: value === '2' || value === '3' || value === '4', // Handle disabled state based on value
//                     },
//                 },
//             };

//             return updatedFormData; // Return the updated state
//         });
//     };

//     const handleInputChange = (index, linkKey, key, value, type = null) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData]; // Clone the array

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
//                 linkDataValue1: { ...linkData },
//                 linkDataValue2: { ...linkData2 },
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

//     const handleInputChangeForTitle = (value, index) => {
//         setFormData((prevFormData) => {
//             // Clone the current formData array
//             const updatedFormData = [...prevFormData];

//             // Update the specific field in the array based on index
//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue1: {
//                     ...updatedFormData[index].linkDataValue1,
//                     // Update the title field or any other nested property
//                     title: value,
//                 },
//             };

//             // Return the updated formData
//             return updatedFormData;
//         });
//     };

//     // Example for updating other fields (like summary, or any other nested fields)
//     const handleInputChangeForSummary = (value, index) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData];

//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue1: {
//                     ...updatedFormData[index].linkDataValue1,
//                     summary: value,
//                 },
//             };

//             return updatedFormData;
//         });
//     };

//     console.log(formData)

//     const renderLinkRow = (label, linkKey, index) => {
//         const currentLinkData = formData[index].linkDataValue1[linkKey]; // Access the correct link data

//         return (
//             <div key={index} className="input-group input-group-sm mb-2">
//                 {/* Link Form Elements */}
//                 <input
//                     style={{ flex: '1' }}
//                     type="text"
//                     className="form-control form-control-sm name_input w-25"
//                     value={currentLinkData.name}
//                     onChange={(e) => handleInputChange(index, linkKey, 'name', e.target.value)}
//                     placeholder={`${label} Name`}
//                 />
//                 <select
//                     style={{ flex: '1' }}
//                     className="form-control form-control-sm link_type"
//                     value={currentLinkData.align}
//                     onChange={(e) => handleInputChange(index, linkKey, 'align', e.target.value)}
//                 >
//                     <option value="">Button Center</option>
//                     <option value="float-left">Button Left Align</option>
//                     <option value="float-right">Button Right Align</option>
//                 </select>

//                     <div class="input-group-append" data-toggle="popover" title="" data-content="If you tick 'Scheduled' Pop Up will run given scheduled every day. Not whole Day" data-original-title="Scheduled">
//                     <div class="input-group-text">
//                     <input
//                         style={{ flex: '1' }}
//                         onChange={(e) => handleInputChange(index, linkKey, 'show', e.target.checked, 'checkbox')}
//                         checked={currentLinkData.show === "1"}
//                         type="checkbox"
//                         aria-label="Checkbox for following text input"
//                         value={currentLinkData.show}
//                     />
//                        </div>
//                         <span class="input-group-text "><i class="fas fa-info-circle mr-1"></i>Button Show</span>
//                     </div>
//                 <select
//                     style={{ flex: '1' }}
//                     className="form-control form-control-sm link_type w-25"
//                     value={currentLinkData.type}
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
//                     value={currentLinkData.value}
//                     disabled={currentLinkData.disabled}
//                     onChange={(e) => handleInputChange(index, linkKey, 'value', e.target.value)}
//                 />
//                 {currentLinkData.type === '4' && (
//                         <div className="input-group-append">
//                             <span
//                                 style={{ flex: '1' }}
//                                 className="input-group-text search_icon"
//                                 data-toggle={currentLinkData.type === '4' ? 'modal' : ''}
//                                 data-target={currentLinkData.type === '4' ? '#exampleModal' : ''}
//                                 onClick={() => currentLinkData.type === '4' && openModal(index, linkKey)}
//                             >
//                                 <i className="fas fa-search"></i>
//                             </span>
//                         </div>
//                     )}
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
//                     <form className="form-horizontal" method="post" autoComplete="off">
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
//                                                 required
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
//                                                     {formData.map((data, index) => (
//                                                         <li
//                                                             key={index}
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

//                                                                 <h5 style={{ margin: "0 0 8px 0" }}>
//                                                                     <input
//                                                                         name="title"
//                                                                         className="form-control form-control-sm"
//                                                                         placeholder="Enter Title"
//                                                                         type="text"
//                                                                         style={{ width: "100%" }}
//                                                                         onChange={(e) => handleInputChangeForTitle(e.target.value, index)} // Pass index here
//                                                                     />
//                                                                 </h5>
//                                                                 <textarea
//                                                                     name="summary"
//                                                                     className="form-control form-control-sm"
//                                                                     placeholder="Enter Brief"
//                                                                     style={{ width: "100%" }}
//                                                                     onChange={(e) => handleInputChangeForSummary(e.target.value, index)} // Pass index here
//                                                                 />

//                                                                 <div className='mt-2'>
//                                                                     {renderLinkRow('Link1', 'link1', index)} {/* Pass index here */}
//                                                                     {renderLinkRow('Link2', 'link2', index)} {/* Pass index here */}
//                                                                 </div>
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

// export default SliderCreates;


// 'use client' 
 //ismile
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { FaTrash, FaUpload } from 'react-icons/fa';

// const SliderCreates = () => {

//     const [formData, setFormData] = useState([]);

//     const [linkData2, setLinkData2] = useState({
//         link1: { type: "1", file_path: "", value: "https//", disabled: false, name: "", align: "" },
//     });

//     const [selectedFile2, setSelectedFile2] = useState({});
//     const [fileNames2, setFileNames2] = useState({});
//     const [fileErrors, setFileErrors] = useState({});


//     // Handle select changes for linkData2
//     // const handleSelectChange2 = (id, value) => {
//     //     const updatedLinkData2 = { ...linkData2 };
//     //     updatedLinkData2[id].type = value;

//     //     switch (value) {
//     //         case '1': // External
//     //             updatedLinkData2[id].value = 'https//';
//     //             updatedLinkData2[id].disabled = false;
//     //             break;
//     //         case '2': // Front page
//     //             updatedLinkData2[id].value = 'font';
//     //             updatedLinkData2[id].disabled = true;
//     //             break;
//     //         case '3': // No Link
//     //             updatedLinkData2[id].value = 'no link';
//     //             updatedLinkData2[id].disabled = true;
//     //             break;
//     //         case '4': // Content Reference
//     //             updatedLinkData2[id].value = '';
//     //             updatedLinkData2[id].disabled = true;
//     //             break;
//     //         default:
//     //             break;
//     //     }

//     //     setLinkData2(updatedLinkData2);
//     // };
//     const handleSelectChange2 = (key, value, index) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData];
//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue2: {
//                     ...updatedFormData[index].linkDataValue2,
//                     [key]: {
//                         ...updatedFormData[index].linkDataValue2[key],
//                         type: value, // Update the type based on the selected value
//                         value: value === '1' ? 'https//' : value === '2' ? 'font' : value === '3' ? 'no link' : '', // Adjust other values accordingly
//                         disabled: value !== '1', // Enable/disable based on the selected value
//                     },
//                 },
//             };
//             return updatedFormData;
//         });
//     };


//     const handleInputChange2 = (id, key, value, index) => {
//         // Create a copy of formData to avoid mutating the original state directly
//         const updatedFormData = [...formData];

//         // Update the nested structure within the specific index
//         updatedFormData[index] = {
//             ...updatedFormData[index],  // Copy the current object at the index
//             linkDataValue2: {
//                 ...updatedFormData[index].linkDataValue2,  // Copy existing linkDataValue2
//                 [id]: {
//                     ...updatedFormData[index].linkDataValue2[id],  // Copy the specific id
//                     [key]: value,  // Update the specific key with the new value
//                 },
//             },
//         };

//         // Update the formData state with the new updatedFormData
//         setFormData(updatedFormData);
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

//     const handleInputChangeForTitle = (value, index) => {
//         setFormData((prevFormData) => {
//             // Clone the current formData array
//             const updatedFormData = [...prevFormData];

//             // Update the specific field in the array based on index
//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue1: {
//                     ...updatedFormData[index].linkDataValue1,
//                     // Update the title field or any other nested property
//                     title: value,
//                 },
//             };

//             // Return the updated formData
//             return updatedFormData;
//         });
//     };

//     // Example for updating other fields (like summary, or any other nested fields)
//     const handleInputChangeForSummary = (value, index) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData];

//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue1: {
//                     ...updatedFormData[index].linkDataValue1,
//                     summary: value,
//                 },
//             };

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
//                     <form className="form-horizontal" method="post" autoComplete="off">
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
//                                                 required
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
//                                                     {formData.map((data, index) => (
//                                                         <li
//                                                             key={index}
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
//                                                                 <h5 style={{ margin: "0 0 8px 0" }}>
//                                                                     {Object.keys(data.linkDataValue2).map((key) => (
//                                                                         <div key={key} style={{ display: "flex", justifyContent: "space-between" }}>
//                                                                             <select
//                                                                                 className="form-control form-control-sm"
//                                                                                 value={data.linkDataValue2[key].type}
//                                                                                 onChange={(e) => handleSelectChange2(key, e.target.value, index)} // Pass index here
//                                                                             >
//                                                                                 <option value="1">External</option>
//                                                                                 <option value="2">Front page</option>
//                                                                                 <option value="3">No Link</option>
//                                                                                 <option value="4">Content Reference</option>
//                                                                             </select>

//                                                                             <input
//                                                                                 type="text"
//                                                                                 className="form-control form-control-sm"
//                                                                                 value={data.linkDataValue2[key].value}
//                                                                                 disabled={data.linkDataValue2[key].disabled}
//                                                                                 onChange={(e) => handleInputChange2(key, "value", e.target.value, index)} // Pass index here
//                                                                             />

//                                                                         </div>
//                                                                     ))}
//                                                                 </h5>
//                                                                 <h5 style={{ margin: "0 0 8px 0" }}>
//                                                                     <input
//                                                                         name="title"
//                                                                         className="form-control form-control-sm"
//                                                                         placeholder="Enter Title"
//                                                                         type="text"
//                                                                         style={{ width: "100%" }}
//                                                                         onChange={(e) => handleInputChangeForTitle(e.target.value, index)} // Pass index here
//                                                                     />
//                                                                 </h5>
//                                                                 <textarea
//                                                                     name="summary"
//                                                                     className="form-control form-control-sm"
//                                                                     placeholder="Enter Brief"
//                                                                     style={{ width: "100%" }}
//                                                                     onChange={(e) => handleInputChangeForSummary(e.target.value, index)} // Pass index here
//                                                                 />


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

// export default SliderCreates;










// 'use client' 
 //ismile
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { FaTrash, FaUpload } from 'react-icons/fa';

// const SliderCreates = () => {



//     const { data: transition_list = []
//     } = useQuery({
//         queryKey: ['transition_list'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/transition_list`)

//             const data = await res.json()
//             return data
//         }
//     })



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
//                     <form className="form-horizontal" method="post" autoComplete="off">
//                         <div className="col-md-5">
//                             <div className="card shadow-sm">
//                                 <div className="card-header bg-gradient-primary text-white py-1">
//                                     <h6 className="card-title mb-0">Transition Animation Example</h6>
//                                 </div>
//                                 <div className="card-body">
//                                     <select name="ssTransition" class="form-control form-control-sm mb-2 " id="ssTransition">
//                                         {
//                                             transition_list.map(transition =>
//                                                 <>
//                                                     <option value={transition.transition_code}>{transition.transition_name}</option>
//                                                 </>

//                                             )
//                                         }
//                                     </select>
//                                     <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
//                                         <ol class="carousel-indicators">
//                                             <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
//                                             <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
//                                             <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
//                                         </ol>
//                                         <div class="carousel-inner">
//                                             <div class="carousel-item active">
//                                                 <img class="d-block w-100" src="https://ammkbhs.xyz/web_content/img/1.jpg" alt="First slide" />
//                                             </div>
//                                             <div class="carousel-item">
//                                                 <img class="d-block w-100" src="https://ammkbhs.xyz/web_content/img/2.jpg" alt="Second slide" />
//                                             </div>

//                                         </div>
//                                         <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
//                                             <span class="carousel-control-prev-icon" aria-hidden="true"></span>
//                                             <span class="sr-only">Previous</span>
//                                         </a>
//                                         <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
//                                             <span class="carousel-control-next-icon" aria-hidden="true"></span>
//                                             <span class="sr-only">Next</span>
//                                         </a>
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

// export default SliderCreates;


// 'use client' 
 //ismile
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { FaTrash, FaUpload } from 'react-icons/fa';

// const SliderCreates = () => {
//   const [selectedTransition, setSelectedTransition] = useState(null);

//   const { data: transition_list = [] } = useQuery({
//     queryKey: ['transition_list'],
//     queryFn: async () => {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/transition_list`);
//       const data = await res.json();
//       return data;
//     }
//   });

//   // Update the transition on selection change
//   const handleTransitionChange = (event) => {
//     setSelectedTransition(event.target.value);
//   };



//   return (
//     <div className="col-md-12 bg-light body-content p-4">
//       <div className="card shadow-sm border-0">
//         <div className="card-header bg-gradient-primary py-1 text-white d-flex justify-content-between align-items-center">
//           <h5 className="card-title mb-0">Create Slider</h5>
//           <a
//             href="https://usms.urbanitsolution.com/Admin/slider/slider_all?page_group=dynamic_website"
//             className="btn btn-sm btn-info"
//           >
//             Back to Slider List
//           </a>
//         </div>
//         <div className="alert alert-warning mx-4 mt-4 text-danger font-weight-bold">
//           (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) fields required
//         </div>
//         <div className="card-body bg-gradient-light">
//           <form className="form-horizontal" method="post" autoComplete="off">
//             <div className="col-md-5">
//               <div className="card shadow-sm">
//                 <div className="card-header bg-gradient-primary text-white py-1">
//                   <h6 className="card-title mb-0">Transition Animation Example</h6>
//                 </div>
//                 <div className="card-body">
//                   <select
//                     name="ssTransition"
//                     className="form-control form-control-sm mb-2"
//                     id="ssTransition"
//                     onChange={handleTransitionChange}
//                     value={selectedTransition}
//                   >
//                     {transition_list.map((transition) => (
//                       <option key={transition.transition_code} value={transition.transition_code}>
//                         {transition.transition_name}
//                       </option>
//                     ))}
//                   </select>
//                   <div
//                     id="carouselExampleIndicators"
//                     className={`carousel slide ${selectedTransition ? 'carousel-' + selectedTransition : ''}`}
//                     data-ride="carousel"
//                   >
//                     <ol className="carousel-indicators">
//                       <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
//                       <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
//                       <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
//                     </ol>
//                     <div className="carousel-inner">
//                       <div className="carousel-item active">
//                         <img className="d-block w-100" src="https://ammkbhs.xyz/web_content/img/1.jpg" alt="First slide" />
//                       </div>
//                       <div className="carousel-item">
//                         <img className="d-block w-100" src="https://ammkbhs.xyz/web_content/img/2.jpg" alt="Second slide" />
//                       </div>
//                     </div>
//                     <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
//                       <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//                       <span className="sr-only">Previous</span>
//                     </a>
//                     <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
//                       <span className="carousel-control-next-icon" aria-hidden="true"></span>
//                       <span className="sr-only">Next</span>
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SliderCreates;


// 'use client' 
 //ismile
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { FaTrash, FaUpload } from 'react-icons/fa';

// const SliderCreates = () => {

//     const [modalData2, setModalData2] = useState({ index: null, key: '', value: '' });


//     const openModal2 = ( key, index) => {
//         // Set the modal data with index and key
//         const selectedData = formData[index]?.linkDataValue2[key];
//         if (selectedData && selectedData.type === '4') {
//             setModalData2({ index, key, value: selectedData.value });
//             $('#exampleModal2').modal('show'); // Show the modal
//         }
//     };
//     const saveModalChanges2 = ( page) => {
//         const { index, key } = modalData2;  // Get the index and key from modalData2

//         console.log("Saving changes for index:", index, "key:", key, "with page:", page);

//         setActiveTabs(''); // Clear active tab if needed

//         // Update the formData with the new page link value
//         setFormData((prevFormData) => {
//             const updatedFormData = prevFormData.map((item, itemIndex) => {
//                 if (itemIndex === index) {
//                     return {
//                         ...item,
//                         linkDataValue2: {
//                             ...item.linkDataValue2,
//                             [key]: {
//                                 ...item.linkDataValue2[key],
//                                 value: page, // Set the value from the selected page link
//                             },
//                         },
//                     };
//                 }
//                 return item;
//             });
//             return updatedFormData;
//         });

//         $('#exampleModal2').modal('hide'); // Close the modal
//     };




//     const [pageListTable, setPageListTable] = useState('')




//     const { data: page_list = []
//     } = useQuery({
//         queryKey: ['page_list'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/page_list/page_list_list`)

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
//     const [formData, setFormData] = useState([]);
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


//     const handleSelectChange2 = (key, value, index) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData];
//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue2: {
//                     ...updatedFormData[index].linkDataValue2,
//                     [key]: {
//                         ...updatedFormData[index].linkDataValue2[key],
//                         type: value, // Update the type based on the selected value
//                         value: value === '1' ? 'https//' : value === '2' ? 'font' : value === '3' ? 'no link' : '', // Adjust other values accordingly
//                         disabled: value !== '1', // Enable/disable based on the selected value
//                     },
//                 },
//             };
//             return updatedFormData;
//         });
//     };


//     const handleInputChange2 = (id, key, value, index) => {
//         // Create a copy of formData to avoid mutating the original state directly
//         const updatedFormData = [...formData];

//         // Update the nested structure within the specific index
//         updatedFormData[index] = {
//             ...updatedFormData[index],  // Copy the current object at the index
//             linkDataValue2: {
//                 ...updatedFormData[index].linkDataValue2,  // Copy existing linkDataValue2
//                 [id]: {
//                     ...updatedFormData[index].linkDataValue2[id],  // Copy the specific id
//                     [key]: value,  // Update the specific key with the new value
//                 },
//             },
//         };

//         // Update the formData state with the new updatedFormData
//         setFormData(updatedFormData);
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
//                 linkDataValue1: { ...linkData },
//                 linkDataValue2: { ...linkData2 },
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

// console.log(formData)
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
//                     <form className="form-horizontal" method="post" autoComplete="off">
//                     <div className="card mb-3 shadow-sm">
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
//                                                     {formData.map((data, index) => (
//                                                         <li
//                                                             key={index}
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
//                                                                 <h5 style={{ margin: "0 0 8px 0" }}>
//                                                                     {Object.keys(data.linkDataValue2).map((key) => (
//                                                                         <div key={key} style={{ display: "flex", justifyContent: "space-between" }}>
//                                                                             <select
//                                                                                 className="form-control form-control-sm"
//                                                                                 value={data.linkDataValue2[key].type}
//                                                                                 onChange={(e) => handleSelectChange2(key, e.target.value, index)} // Pass index here
//                                                                             >
//                                                                                 <option value="1">External</option>
//                                                                                 <option value="2">Front page</option>
//                                                                                 <option value="3">No Link</option>
//                                                                                 <option value="4">Content Reference</option>
//                                                                             </select>

//                                                                             <input
//                                                                                 type="text"
//                                                                                 className="form-control form-control-sm"
//                                                                                 value={data.linkDataValue2[key].value}
//                                                                                 disabled={data.linkDataValue2[key].disabled}
//                                                                                 onChange={(e) => handleInputChange2(key, "value", e.target.value, index)} // Pass index here
//                                                                             />
//                                                                             {data?.linkDataValue2[key].type == '4' && (
//                                                                                 <div className="input-group-append">
//                                                                                     <span
//                                                                                         className="input-group-text search_icon"
//                                                                                         data-toggle={data.linkDataValue2[key].type === '4' ? 'modal' : ''}
//                                                                                         data-target={data.linkDataValue2[key].type === '4' ? '#exampleModal2' : ''}
//                                                                                         onClick={() => openModal2(key, index)}
//                                                                                     >
//                                                                                         <i className="fas fa-search"></i>
//                                                                                     </span>
//                                                                                     <div className="modal fade" id="exampleModal2" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                          <div className="modal-dialog modal-lg" role="document">
//                              <div className="modal-content">
//                                  <div className="modal-header">
//                                      <h5 className="modal-title" id="exampleModalLabel">Content Reference</h5>
//                                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
//                                          <span aria-hidden="true">&times;</span>
//                                      </button>
//                                  </div>
//                                  <div className="modal-body">
//                                      <div>
//                                          <table className="table table-bordered table-striped table-sm" align="center">
//                                              <thead>
//                                                  <tr>
//                                                      <th>Name</th>
//                                                      <th>Action</th>
//                                                  </tr>
//                                              </thead>
//                                              <tbody>
//                                                  <tr>
//                                                      <td>Page List</td>
//                                                      <td>
//                                                          <button
//                                                              className="btn btn-sm btn-secondary"
//                                                              onClick={(event) => {
//                                                                  event.preventDefault();
//                                                                  handleTabClick("pageList");
//                                                              }}
//                                                          >
//                                                              <i className="fas fa-bars"></i>
//                                                          </button>
//                                                      </td>
//                                                  </tr>
//                                                  <tr>
//                                                      <td>Content List</td>
//                                                      <td>
//                                                          <button
//                                                              className="btn btn-sm btn-secondary"
//                                                              onClick={(event) => {
//                                                                  event.preventDefault();
//                                                                  handleTabClick("contentList");
//                                                              }}
//                                                          >
//                                                              <i className="fas fa-bars"></i>
//                                                          </button>
//                                                      </td>
//                                                  </tr>
//                                              </tbody>
//                                          </table>

//                                          {activeTabs.includes("pageList") && (
//                                              <div id="page_list" className="tab-pane">
//                                                  <table id="modal-view-list" className="table table-bordered table-striped table-sm" align="center">
//                                                      <thead>
//                                                          <tr>
//                                                              <th>Page Name</th>
//                                                              <th>Human Page Link</th>
//                                                          </tr>
//                                                      </thead>
//                                                      <tbody>
//                                                          {page_list.map((page) => (
//                                                              <tr
//                                                                  onClick={() => saveModalChanges2(  page.page_link)}
//                                                                  key={page.page_name}
//                                                              >
//                                                                  <td>{page.page_name}</td>
//                                                                  <td>{page.page_link}</td>
//                                                              </tr>
//                                                          ))}
//                                                      </tbody>
//                                                  </table>
//                                              </div>
//                                          )}


//                                      </div>
//                                  </div>
//                                  <div className="modal-footer">
//                                      <button onClick={() => saveModalChanges2('')} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
//                                  </div>
//                              </div>
//                          </div>
//                      </div>

//                                                                                 </div>

//                                                                             )}
//                                                                         </div>
//                                                                     ))}
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
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SliderCreates;

// 'use client' 
 //ismile
// import React, { useEffect } from 'react';
// import '../js/jssor.slider.min'

// const JssorSlider = () => {

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = '../js/jssor.slider.min';

//     const jssor_1_SlideshowTransitions = [
//       { $Duration: 500, $Delay: 30, $Cols: 8, $Rows: 4, $Clip: 15, $SlideOut: true, $Formation: $JssorSlideshowFormations.$FormationStraightStairs, $Assembly: 2049, $Easing: $Jease.$OutQuad },
//       { $Duration: 500, $Delay: 80, $Cols: 8, $Rows: 4, $Clip: 15, $SlideOut: true, $Easing: $Jease.$OutQuad },
//       { $Duration: 1000, x: -0.2, $Delay: 40, $Cols: 12, $SlideOut: true, $Formation: $JssorSlideshowFormations.$FormationStraight, $Assembly: 260, $Easing: { $Left: $Jease.$InOutExpo, $Opacity: $Jease.$InOutQuad }, $Opacity: 2, $Outside: true, $Round: { $Top: 0.5 } },
//       { $Duration: 2000, y: -1, $Delay: 60, $Cols: 15, $SlideOut: true, $Formation: $JssorSlideshowFormations.$FormationStraight, $Easing: $Jease.$OutJump, $Round: { $Top: 1.5 } },
//       { $Duration: 1200, x: 0.2, y: -0.1, $Delay: 20, $Cols: 8, $Rows: 4, $Clip: 15, $During: { $Left: [0.3, 0.7], $Top: [0.3, 0.7] }, $Formation: $JssorSlideshowFormations.$FormationStraightStairs, $Assembly: 260, $Easing: { $Left: $Jease.$InWave, $Top: $Jease.$InWave, $Clip: $Jease.$OutQuad }, $Round: { $Left: 1.3, $Top: 2.5 } },
//     ];

//     const jssor_1_options = {
//       $AutoPlay: 1,
//       $SlideshowOptions: {
//         $Class: $JssorSlideshowRunner$,
//         $Transitions: jssor_1_SlideshowTransitions,
//         $TransitionsOrder: 1,
//       },
//       $ArrowNavigatorOptions: {
//         $Class: $JssorArrowNavigator$,
//       },
//       $BulletNavigatorOptions: {
//         $Class: $JssorBulletNavigator$,
//       },
//     };

//     const jssor_1_slider = new $JssorSlider$('jssor_1', jssor_1_options);

//     // Responsive scaling
//     const MAX_WIDTH = 980;

//     const scaleSlider = () => {
//       const containerElement = jssor_1_slider.$Elmt.parentNode;
//       const containerWidth = containerElement.clientWidth;

//       if (containerWidth) {
//         const expectedWidth = Math.min(MAX_WIDTH || containerWidth, containerWidth);
//         jssor_1_slider.$ScaleWidth(expectedWidth);
//       } else {
//         window.setTimeout(scaleSlider, 30);
//       }
//     };

//     scaleSlider();
//     window.addEventListener('load', scaleSlider);
//     window.addEventListener('resize', scaleSlider);
//     window.addEventListener('orientationchange', scaleSlider);
//   }, []);

//   return (
//     <div id="jssor_1" style={{ position: 'relative', margin: '0 auto', top: '0px', left: '0px', width: '980px', height: '380px', overflow: 'hidden', visibility: 'hidden' }}>
//       {/* Loading Screen */}
//       <div
//         data-u="loading"
//         className="jssorl-009-spin"
//         style={{ position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}
//       >
//         <img
//           style={{ marginTop: '-19px', position: 'relative', top: '50%', width: '38px', height: '38px' }}
//           src="../svg/loading/static-svg/spin.svg"
//           alt="Loading"
//         />
//       </div>

//       {/* Slides */}
//       <div
//         data-u="slides"
//         style={{ cursor: 'default', position: 'relative', top: '0px', left: '0px', width: '980px', height: '380px', overflow: 'hidden' }}
//       >
//         <div>
//           <img data-u="image" src="../img/gallery/980x380/011.jpg" alt="Slide 1" />
//         </div>
//         <div>
//           <img data-u="image" src="../img/gallery/980x380/012.jpg" alt="Slide 2" />
//         </div>
//         <div>
//           <img data-u="image" src="../img/gallery/980x380/013.jpg" alt="Slide 3" />
//         </div>
//         <div>
//           <img data-u="image" src="../img/gallery/980x380/014.jpg" alt="Slide 4" />
//         </div>
//         <div>
//           <img data-u="image" src="../img/gallery/980x380/015.jpg" alt="Slide 5" />
//         </div>
//         <div>
//           <img data-u="image" src="../img/gallery/980x380/016.jpg" alt="Slide 6" />
//         </div>
//         <div style={{ backgroundColor: '#ff7c28' }}>
//           <div
//             style={{
//               position: 'absolute',
//               top: '50px',
//               left: '50px',
//               width: '450px',
//               height: '62px',
//               zIndex: '0',
//               fontSize: '16px',
//               color: '#000000',
//               lineHeight: '24px',
//               textAlign: 'left',
//               padding: '5px',
//               boxSizing: 'border-box',
//             }}
//           >
//             Photos in this slider are to demonstrate jssor slider,
//             <br />
//             which are not licensed for any other purpose.
//           </div>
//         </div>
//       </div>

//       {/* Bullet Navigator */}
//       <div
//         data-u="navigator"
//         className="jssorb053"
//         style={{ position: 'absolute', bottom: '12px', right: '12px' }}
//         data-autocenter="1"
//         data-scale="0.5"
//         data-scale-bottom="0.75"
//       >
//         <div data-u="prototype" className="i" style={{ width: '16px', height: '16px' }}>
//           <svg viewBox="0 0 16000 16000" style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}>
//             <path
//               className="b"
//               d="M11400,13800H4600c-1320,0-2400-1080-2400-2400V4600c0-1320,1080-2400,2400-2400h6800 c1320,0,2400,1080,2400,2400v6800C13800,12720,12720,13800,11400,13800z"
//             ></path>
//           </svg>
//         </div>
//       </div>

//       {/* Arrow Navigator */}
//       <div
//         data-u="arrowleft"
//         className="jssora093"
//         style={{ width: '50px', height: '50px', top: '0px', left: '30px' }}
//         data-autocenter="2"
//         data-scale="0.75"
//         data-scale-left="0.75"
//       >
//         <svg viewBox="0 0 16000 16000" style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}>
//           <circle className="c" cx="8000" cy="8000" r="5920"></circle>
//           <polyline className="a" points="7777.8,6080 5857.8,8000 7777.8,9920 "></polyline>
//           <line className="a" x1="10142.2" y1="8000" x2="5857.8" y2="8000"></line>
//         </svg>
//       </div>
//       <div
//         data-u="arrowright"
//         className="jssora093"
//         style={{ width: '50px', height: '50px', top: '0px', right: '30px' }}
//         data-autocenter="2"
//         data-scale="0.75"
//         data-scale-right="0.75"
//       >
//         <svg viewBox="0 0 16000 16000" style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}>
//           <circle className="c" cx="8000" cy="8000" r="5920"></circle>
//           <polyline className="a" points="8222.2,6080 10142.2,8000 8222.2,9920 "></polyline>
//           <line className="a" x1="5857.8" y1="8000" x2="10142.2" y2="8000"></line>
//         </svg>
//       </div>
//     </div>
//   );
// };

// export default JssorSlider;



// 'use client' 
 //ismile
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import Select from 'react-dropdown-select';
// import { FaTrash, FaUpload } from 'react-icons/fa';

// const SliderCreates = () => {
//     const [selectedTransition, setSelectedTransition] = useState(null); // State to store selected transition

//     const { data: transition_list = [] } = useQuery({
//         queryKey: ['transition_list'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/transition_list`);
//             const data = await res.json();
//             return data;
//         },
//     });

//     // onChange handler for select element
//     const handleTransitionChange = (event) => {
//         const selectedValue = event.target.value;
//         setSelectedTransition(selectedValue); // Update state with selected value
//         console.log("Selected Transition: ", selectedValue); // Optionally log or handle the selected transition
//     };

//     // Function to remove dollar signs from transition code
//     // const removeDollarSigns = (transition_code) => {
//     //     return transition_code.replace(/\$/g, '').replace(/{}/g, ''); // Remove all dollar signs and empty curly braces
//     // };
//     const removeDollarSigns = (transition_code) => {
//         return transition_code.replace(/\$/g, '').replace(/[{}]/g, ''); // Remove dollar signs and curly brackets
//     };


//     console.log(selectedTransition);

//     // const transitionStyles = transition_list.map(transition => ({
//     //     ...transition,
//     //     style: {
//     //         transitionDuration: `${transition.duration}ms`,
//     //         // Example: If you want to apply other styles based on transition_code, you can do it here.
//     //         // This is an example of mapping properties, modify this to suit your transition's style logic.
//     //         opacity: transition.transition_code.includes('Opacity') ? 2 : 1,
//     //         transform: transition.transition_code.includes('x') ? `translateX(${parseFloat(transition.transition_code.match(/x:([-+]?[0-9]*\.?[0-9]+)/)[1])}px)` : 'none',
//     //     }
//     // }));

//     // console.log(transitionStyles);
//     // const transitionStyles = transition_list.map(transition => {
//     //     const xMatch = transition.transition_code.match(/x:([-+]?[0-9]*\.?[0-9]+)/);

//     //     return {
//     //         ...transition,
//     //         style: {
//     //             transitionDuration: `${transition.duration}ms`,
//     //             opacity: transition.transition_code.includes('Opacity') ? 2 : 1,
//     //             transform: xMatch ? `translateX(${parseFloat(xMatch[1])}px)` : 'none',
//     //         }
//     //     };
//     // });

//     // const transitionStyles = transition_list.map(transition => {
//     //     // Extract values from transition_code using regex
//     //     const xMatch = transition.transition_code.match(/x:([-+]?[0-9]*\.?[0-9]+)/);
//     //     const yMatch = transition.transition_code.match(/y:([-+]?[0-9]*\.?[0-9]+)/);
//     //     const zoomMatch = transition.transition_code.match(/\$Zoom:([0-9\.]+)/);
//     //     const rotateMatch = transition.transition_code.match(/\$Rotate:([0-9\.]+)/);
//     //     const slideOutMatch = transition.transition_code.match(/\$SlideOut:(true|false)/);

//     //     // Extract Easing values for different properties
//     //     const easingMatch = transition.transition_code.match(/\$Easing:\{([^}]+)\}/);
//     //     const easing = easingMatch ? easingMatch[1].split(',').reduce((acc, curr) => {
//     //         const [key, value] = curr.split(':');
//     //         acc[key.trim()] = value.trim();
//     //         return acc;
//     //     }, {}) : {};

//     //     return {
//     //         ...transition,
//     //         style: {
//     //             transitionDuration: `${transition.duration}ms`,
//     //             opacity: transition.transition_code.includes('Opacity') ? 2 : 1,
//     //             transform: `
//     //                 ${xMatch ? `translateX(${parseFloat(xMatch[1])}px)` : 'none'}
//     //                 ${yMatch ? `translateY(${parseFloat(yMatch[1])}px)` : ''}
//     //                 ${rotateMatch ? `rotate(${parseFloat(rotateMatch[1])}deg)` : ''}
//     //                 ${zoomMatch ? `scale(${parseFloat(zoomMatch[1])})` : ''}
//     //             `,
//     //             // If $SlideOut is true, you can add additional styles for slide-out animation
//     //             display: slideOutMatch && slideOutMatch[1] === 'true' ? 'none' : 'block',

//     //             // Apply easing to different properties
//     //             transitionTimingFunction: easing.Rotate || 'ease', // default to ease if no Rotate easing is provided
//     //             // Add more properties for other easing values if needed
//     //         }
//     //     };
//     // });

//     const transitionStyles = transition_list.map(transition => {
//         // Extract values from transition_code using regex
//         const xMatch = transition.transition_code.match(/x:([-+]?[0-9]*\.?[0-9]+)/);
//         const yMatch = transition.transition_code.match(/y:([-+]?[0-9]*\.?[0-9]+)/);
//         const colsMatch = transition.transition_code.match(/\$Cols:([0-9]+)/);
//         const rowsMatch = transition.transition_code.match(/\$Rows:([0-9]+)/);
//         const duringMatch = transition.transition_code.match(/\$During:\{([^}]+)\}/);
//         const slideOutMatch = transition.transition_code.match(/\$SlideOut:(true|false)/);
//         const chessModeMatch = transition.transition_code.match(/\$ChessMode:\{([^}]+)\}/);
//         const opacityMatch = transition.transition_code.match(/\$Opacity:([0-9\.]+)/);
//         const outsideMatch = transition.transition_code.match(/\$Outside:(true|false)/);

//         // Extract Easing values for different properties
//         const easingMatch = transition.transition_code.match(/\$Easing:\{([^}]+)\}/);
//         const easing = easingMatch ? easingMatch[1].split(',').reduce((acc, curr) => {
//             const [key, value] = curr.split(':');
//             acc[key.trim()] = value.trim();
//             return acc;
//         }, {}) : {};

//         // Parse During values (Left and Top)
//         const duringValues = duringMatch ? duringMatch[1].split(',').reduce((acc, curr) => {
//             const [key, value] = curr.split(':');
//             acc[key.trim()] = value?.split('[').pop().split(']')[0].split(',').map(Number);
//             return acc;
//         }, {}) : {};

//         // Parse ChessMode values (Column and Row)
//         const chessModeValues = chessModeMatch ? chessModeMatch[1].split(',').reduce((acc, curr) => {
//             const [key, value] = curr.split(':');
//             acc[key.trim()] = parseInt(value, 10);
//             return acc;
//         }, {}) : {};

//         return {
//             ...transition,
//             style: {
//                 transitionDuration: `${transition.duration}ms`,
//                 opacity: opacityMatch ? parseFloat(opacityMatch[1]) : 1,
//                 transform: `
//                     ${xMatch ? `translateX(${parseFloat(xMatch[1])}px)` : 'none'}
//                     ${yMatch ? `translateY(${parseFloat(yMatch[1])}px)` : ''}
//                 `,
//                 // Apply grid-related styles if Cols and Rows are defined
//                 gridTemplateColumns: colsMatch ? `repeat(${parseInt(colsMatch[1], 10)}, 1fr)` : 'none',
//                 gridTemplateRows: rowsMatch ? `repeat(${parseInt(rowsMatch[1], 10)}, 1fr)` : 'none',

//                 // Apply 'During' left and top ranges if defined
//                 left: duringValues.Left ? `${duringValues.Left[0]}%` : 'auto',
//                 top: duringValues.Top ? `${duringValues.Top[0]}%` : 'auto',

//                 // Apply ChessMode column and row styles if defined
//                 gridColumn: chessModeValues.Column ? `span ${chessModeValues.Column}` : 'none',
//                 gridRow: chessModeValues.Row ? `span ${chessModeValues.Row}` : 'none',

//                 // If SlideOut is true, set display to none
//                 display: slideOutMatch && slideOutMatch[1] === 'true' ? 'none' : 'block',

//                 // Apply Outside style if defined
//                 position: outsideMatch && outsideMatch[1] === 'true' ? 'absolute' : 'relative',

//                 // Apply easing to different properties
//                 transitionTimingFunction: easing.Left || easing.Top || easing.Opacity || 'ease', // default to ease if no specific easing
//             }
//         };
//     });

//     console.log(transitionStyles);


//     console.log(transitionStyles);


//     console.log(transitionStyles);


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
//                     <form className="form-horizontal" method="post" autoComplete="off">
//                         <div className="col-md-5">
//                             <div className="card shadow-sm">
//                                 <div className="card-header bg-gradient-primary text-white py-1">
//                                     <h6 className="card-title mb-0">Transition Animation Example</h6>
//                                 </div>
//                                 <div className="card-body">
//                                     <select
//                                         name="ssTransition"
//                                         className="form-control form-control-sm mb-2"
//                                         id="ssTransition"
//                                         onChange={handleTransitionChange} // Add the onChange handler here
//                                     >
//                                         {transitionStyles.map((transition) => (
//                                             <option key={transition.transition_code} value={removeDollarSigns(transition.transition_code)}>
//                                                 {transition.transition_name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                     <div  id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
//                                         <ol className="carousel-indicators">
//                                             <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
//                                             <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
//                                             <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
//                                         </ol>
//                                         <div className="carousel-inner">
//                                             <div className="carousel-item active">
//                                                 <img  className="d-block w-100" src="https://ammkbhs.xyz/web_content/img/1.jpg" alt="First slide" />
//                                             </div>
//                                             <div className="carousel-item">
//                                                 <img style={{
//     "transitionDuration": "1200ms",
//     "opacity": 2,
//     "transform": "\n                    translateX(0.2px)\n                    translateY(40px)\n                ",
//     "gridTemplateColumns": "repeat(12, 1fr)",
//     "gridTemplateRows": "none",
//     "left": "auto",
//     "top": "auto",
//     "gridColumn": "none",
//     "gridRow": "none",
//     "display": "none",
//     "position": "absolute",
//     "transitionTimingFunction": "ease"
// }} className="d-block w-100" src="https://ammkbhs.xyz/web_content/img/2.jpg" alt="Second slide" />
//                                             </div>
//                                         </div>
//                                         <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
//                                             <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//                                             <span className="sr-only">Previous</span>
//                                         </a>
//                                         <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
//                                             <span className="carousel-control-next-icon" aria-hidden="true"></span>
//                                             <span className="sr-only">Next</span>
//                                         </a>
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

// export default SliderCreates;
// 'use client' 
 //ismile
// import React, { useEffect } from 'react';
// import "./jssor.slider.min.css"; // Ensure you have the appropriate CSS file for Jssor Slider
// import '../js/jssor.slider.min.js'

// const JssorSlider = () => {
//     useEffect(() => {
//         const initSlider = () => {
//           // Define the slideshow transitions
//           const jssor_1_SlideshowTransitions = [
//             { Duration: 500, Delay: 30, Cols: 8, Rows: 4, Clip: 15, SlideOut: true, Formation: JssorSlideshowFormations.FormationStraightStairs, Assembly: 2049, Easing: Jease.OutQuad },
//             { Duration: 500, Delay: 80, Cols: 8, Rows: 4, Clip: 15, SlideOut: true, Easing: Jease.OutQuad },
//             { Duration: 1000, x: -0.2, Delay: 40, Cols: 12, SlideOut: true, Formation: JssorSlideshowFormations.FormationStraight, Assembly: 260, Easing: { Left: Jease.InOutExpo, Opacity: Jease.InOutQuad }, Opacity: 2, Outside: true, Round: { Top: 0.5 } },
//             { Duration: 2000, y: -1, Delay: 60, Cols: 15, SlideOut: true, Formation: JssorSlideshowFormations.FormationStraight, Easing: Jease.OutJump, Round: { Top: 1.5 } },
//             { Duration: 1200, x: 0.2, y: -0.1, Delay: 20, Cols: 8, Rows: 4, Clip: 15, During: { Left: [0.3, 0.7], Top: [0.3, 0.7] }, Formation: JssorSlideshowFormations.FormationStraightStairs, Assembly: 260, Easing: { Left: Jease.InWave, Top: Jease.InWave, Clip: Jease.OutQuad }, Round: { Left: 1.3, Top: 2.5 } }
//           ];

//           const jssor_1_options = {
//             AutoPlay: 1,
//             SlideshowOptions: {
//               Class: JssorSlideshowRunner,
//               Transitions: jssor_1_SlideshowTransitions,
//               TransitionsOrder: 1,
//             },
//             ArrowNavigatorOptions: {
//               Class: JssorArrowNavigator,
//             },
//             BulletNavigatorOptions: {
//               Class: JssorBulletNavigator,
//             },
//           };

//           const jssor_1_slider = new JssorSlider("jssor_1", jssor_1_options);

//           const MAX_WIDTH = 980;

//           const ScaleSlider = () => {
//             const containerElement = jssor_1_slider.Elmt.parentNode;
//             const containerWidth = containerElement.clientWidth;

//             if (containerWidth) {
//               const expectedWidth = Math.min(MAX_WIDTH || containerWidth, containerWidth);
//               jssor_1_slider.ScaleWidth(expectedWidth);
//             } else {
//               window.setTimeout(ScaleSlider, 30);
//             }
//           };

//           ScaleSlider();

//           Jssor.AddEvent(window, "load", ScaleSlider);
//           Jssor.AddEvent(window, "resize", ScaleSlider);
//           Jssor.AddEvent(window, "orientationchange", ScaleSlider);
//         };

//         initSlider();
//       }, []);

//     return (
//         <div
//             id="jssor_1"
//             style={{
//                 position: "relative",
//                 margin: "0 auto",
//                 top: 0,
//                 left: 0,
//                 width: "980px",
//                 height: "380px",
//                 overflow: "hidden",
//                 visibility: "hidden",
//             }}
//         >
//             {/* Loading Screen */}
//             <div
//                 data-u="loading"
//                 className="jssorl-009-spin"
//                 style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "100%",
//                     textAlign: "center",
//                     backgroundColor: "rgba(0,0,0,0.7)",
//                 }}
//             >
//                 <img
//                     style={{
//                         marginTop: "-19px",
//                         position: "relative",
//                         top: "50%",
//                         width: "38px",
//                         height: "38px",
//                     }}
//                     src="../svg/loading/static-svg/spin.svg"
//                     alt="Loading"
//                 />
//             </div>

//             {/* Slides */}
//             <div
//                 data-u="slides"
//                 style={{
//                     cursor: "default",
//                     position: "relative",
//                     top: 0,
//                     left: 0,
//                     width: "980px",
//                     height: "380px",
//                     overflow: "hidden",
//                 }}
//             >
//                 <div>
//                     <img data-u="image" src="../img/gallery/980x380/011.jpg" alt="Slide 1" />
//                 </div>
//                 <div>
//                     <img data-u="image" src="../img/gallery/980x380/012.jpg" alt="Slide 2" />
//                 </div>
//                 <div>
//                     <img data-u="image" src="../img/gallery/980x380/013.jpg" alt="Slide 3" />
//                 </div>
//                 <div>
//                     <img data-u="image" src="../img/gallery/980x380/014.jpg" alt="Slide 4" />
//                 </div>
//                 <div>
//                     <img data-u="image" src="../img/gallery/980x380/015.jpg" alt="Slide 5" />
//                 </div>
//                 <div>
//                     <img data-u="image" src="../img/gallery/980x380/016.jpg" alt="Slide 6" />
//                 </div>
//                 <div style={{ backgroundColor: "#ff7c28" }}>
//                     <div
//                         style={{
//                             position: "absolute",
//                             top: "50px",
//                             left: "50px",
//                             width: "450px",
//                             height: "62px",
//                             zIndex: 0,
//                             fontSize: "16px",
//                             color: "#000000",
//                             lineHeight: "24px",
//                             textAlign: "left",
//                             padding: "5px",
//                             boxSizing: "border-box",
//                         }}
//                     >
//                         Photos in this slider are to demonstrate Jssor slider, <br />
//                         which are not licensed for any other purpose.
//                     </div>
//                 </div>
//             </div>

//             {/* Bullet Navigator */}
//             <div
//                 data-u="navigator"
//                 className="jssorb053"
//                 style={{
//                     position: "absolute",
//                     bottom: "12px",
//                     right: "12px",
//                 }}
//                 data-autocenter="1"
//                 data-scale="0.5"
//                 data-scale-bottom="0.75"
//             >
//                 <div
//                     data-u="prototype"
//                     className="i"
//                     style={{ width: "16px", height: "16px" }}
//                 >
//                     <svg
//                         viewBox="0 0 16000 16000"
//                         style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
//                     >
//                         <path
//                             className="b"
//                             d="M11400,13800H4600c-1320,0-2400-1080-2400-2400V4600c0-1320,1080-2400,2400-2400h6800 c1320,0,2400,1080,2400,2400v6800C13800,12720,12720,13800,11400,13800z"
//                         ></path>
//                     </svg>
//                 </div>
//             </div>

//             {/* Arrow Navigator */}
//             <div
//                 data-u="arrowleft"
//                 className="jssora093"
//                 style={{ width: "50px", height: "50px", top: "0px", left: "30px" }}
//                 data-autocenter="2"
//                 data-scale="0.75"
//                 data-scale-left="0.75"
//             >
//                 <svg
//                     viewBox="0 0 16000 16000"
//                     style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
//                 >
//                     <circle className="c" cx="8000" cy="8000" r="5920"></circle>
//                     <polyline
//                         className="a"
//                         points="9770,8113 7020,5800 9770,3487 "
//                     ></polyline>
//                 </svg>
//             </div>
//             <div
//                 data-u="arrowright"
//                 className="jssora093"
//                 style={{ width: "50px", height: "50px", top: "0px", right: "30px" }}
//                 data-autocenter="2"
//                 data-scale="0.75"
//                 data-scale-right="0.75"
//             >
//                 <svg
//                     viewBox="0 0 16000 16000"
//                     style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
//                 >
//                     <circle className="c" cx="8000" cy="8000" r="5920"></circle>
//                     <polyline
//                         className="a"
//                         points="6230,3487 8980,5800 6230,8113 "
//                     ></polyline>
//                 </svg>
//             </div>
//         </div>
//     );
// };

// export default JssorSlider;


// "use client";
// import React, { useEffect } from "react";
// import "./jssor.slider.min.css"; // Ensure you have the appropriate CSS file for Jssor Slider
// import "../js/jssor.slider.min.js"; // Ensure this file exists and is correctly loaded
// import img1 from '../img/gallery/980x380/011.jpg'
// import img2 from '../img/gallery/980x380/012.jpg'
// import img3 from '../img/gallery/980x380/013.jpg'
// import img4 from '../img/gallery/980x380/014.jpg'
// import img5 from '../img/gallery/980x380/015.jpg'
// import img6 from '../img/gallery/980x380/016.jpg'
// import img7 from '../svg/loading/static-svg/spin.svg'


// const JssorSlider = () => {
//     console.log(img1)
//     console.log(img2)
//     console.log(img3)
//     console.log(img4)
//     console.log(img5)
//     console.log(img6)
//     console.log(img7)

//     useEffect(() => {
//         const initSlider = () => {
//             if (window.JssorSlider) {
//                 const jssor_1_SlideshowTransitions = [
//                     { Duration: 500, Delay: 30, Cols: 8, Rows: 4, Clip: 15, SlideOut: true, Formation: JssorSlideshowFormations.FormationStraightStairs, Assembly: 2049, Easing: Jease.OutQuad },
//                     { Duration: 500, Delay: 80, Cols: 8, Rows: 4, Clip: 15, SlideOut: true, Easing: Jease.OutQuad },
//                     { Duration: 1000, x: -0.2, Delay: 40, Cols: 12, SlideOut: true, Formation: JssorSlideshowFormations.FormationStraight, Assembly: 260, Easing: { Left: Jease.InOutExpo, Opacity: Jease.InOutQuad }, Opacity: 2, Outside: true, Round: { Top: 0.5 } },
//                     { Duration: 2000, y: -1, Delay: 60, Cols: 15, SlideOut: true, Formation: JssorSlideshowFormations.FormationStraight, Easing: Jease.OutJump, Round: { Top: 1.5 } },
//                     { Duration: 1200, x: 0.2, y: -0.1, Delay: 20, Cols: 8, Rows: 4, Clip: 15, During: { Left: [0.3, 0.7], Top: [0.3, 0.7] }, Formation: JssorSlideshowFormations.FormationStraightStairs, Assembly: 260, Easing: { Left: Jease.InWave, Top: Jease.InWave, Clip: Jease.OutQuad }, Round: { Left: 1.3, Top: 2.5 } }
//                 ];
//                 // Define the slideshow transitions


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
//     }, []);

//     return (
//         <div
//             id="jssor_1"
//             style={{
//                 position: "relative",
//                 margin: "0 auto",
//                 top: 0,
//                 left: 0,
//                 width: "980px",
//                 height: "380px",
//                 overflow: "hidden",
//                 visibility: "hidden",
//             }}
//         >
//             {/* Loading Screen */}
//             <div
//                 data-u="loading"
//                 className="jssorl-009-spin"
//                 style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "100%",
//                     textAlign: "center",
//                     backgroundColor: "rgba(0,0,0,0.7)",
//                 }}
//             >
//                 <img
//                     style={{
//                         marginTop: "-19px",
//                         position: "relative",
//                         top: "50%",
//                         width: "38px",
//                         height: "38px",
//                     }}
//                     src={img7.src}
//                     alt="Loading"
//                 />
//             </div>

//             {/* Slides */}
//             <div
//                 data-u="slides"
//                 style={{
//                     cursor: "default",
//                     position: "relative",
//                     top: 0,
//                     left: 0,
//                     width: "980px",
//                     height: "380px",
//                     overflow: "hidden",
//                 }}
//             >
//                 <div>
//                     {/* <img
//                                                                 src='http://127.0.0.1:5500/img/gallery/980x380/011.jpg'
//                                                                 alt="Slider"
//                                                                 style={{ width: "50px", height: "auto", marginRight: "8px" }}
//                                                             /> */}
//                     <img data-u="image" src='http://127.0.0.1:5500/img/gallery/980x380/011.jpg' alt="Slide 1" />
//                 </div>
//                 <div>
//                     <img data-u="image" src={`${img6.src}`} alt="Slide 2" />
//                 </div>
//                 <div>
//                     <img data-u="image" src={img2.src} alt="Slide 3" />
//                 </div>
//                 <div>
//                     <img data-u="image" src={img3.src} alt="Slide 4" />
//                 </div>
//                 <div>
//                     <img data-u="image" src={img4.src} alt="Slide 5" />
//                 </div>
//                 <div>
//                     <img data-u="image" src={img5.src} alt="Slide 6" />
//                 </div>
//                 <div style={{ backgroundColor: "#ff7c28" }}>
//                     <div
//                         style={{
//                             position: "absolute",
//                             top: "50px",
//                             left: "50px",
//                             width: "450px",
//                             height: "62px",
//                             zIndex: 0,
//                             fontSize: "16px",
//                             color: "#000000",
//                             lineHeight: "24px",
//                             textAlign: "left",
//                             padding: "5px",
//                             boxSizing: "border-box",
//                         }}
//                     >
//                         Photos in this slider are to demonstrate Jssor slider, <br />
//                         which are not licensed for any other purpose.
//                     </div>
//                 </div>
//             </div>

//             {/* Bullet Navigator */}
//             <div
//                 data-u="navigator"
//                 className="jssorb053"
//                 style={{
//                     position: "absolute",
//                     bottom: "12px",
//                     right: "12px",
//                 }}
//                 data-autocenter="1"
//                 data-scale="0.5"
//                 data-scale-bottom="0.75"
//             >
//                 <div
//                     data-u="prototype"
//                     className="i"
//                     style={{ width: "16px", height: "16px" }}
//                 >
//                     <svg
//                         viewBox="0 0 16000 16000"
//                         style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
//                     >
//                         <path
//                             className="b"
//                             d="M11400,13800H4600c-1320,0-2400-1080-2400-2400V4600c0-1320,1080-2400,2400-2400h6800 c1320,0,2400,1080,2400,2400v6800C13800,12720,12720,13800,11400,13800z"
//                         ></path>
//                     </svg>
//                 </div>
//             </div>

//             {/* Arrow Navigator */}
//             <div
//                 data-u="arrowleft"
//                 className="jssora093"
//                 style={{ width: "50px", height: "50px", top: "0px", left: "30px" }}
//                 data-autocenter="2"
//                 data-scale="0.75"
//                 data-scale-left="0.75"
//             >
//                 <svg viewBox="0 0 16000 16000">
//                     <path
//                         d="M11100,8000L6100,4000L4900,5200l3300,2800l-3300,2800l1200,1200L11100,8000z"
//                         className="a"
//                     ></path>
//                 </svg>
//             </div>
//             <div
//                 data-u="arrowright"
//                 className="jssora093"
//                 style={{ width: "50px", height: "50px", top: "0px", right: "30px" }}
//                 data-autocenter="2"
//                 data-scale="0.75"
//                 data-scale-right="0.75"
//             >
//                 <svg viewBox="0 0 16000 16000">
//                     <path
//                         d="M4900,8000l5000-4000l1200,1200L6800,8000l3300,2800L9900,8000z"
//                         className="a"
//                     ></path>
//                 </svg>
//             </div>
//         </div>
//     );
// };

// export default JssorSlider;

// 'use client'

// import { useEffect } from 'react';
// import Select from 'react-dropdown-select';
// import "./jssor.slider.min.css"; // Ensure you have the appropriate CSS file for Jssor Slider
// import "../js/jssor.slider.min"; // Ensure this file exists and is correctly loaded

// const SliderCreates = () => {
//   useEffect(() => {

//     setTimeout(() => {
//         slideshow_transition_controller_starter("slider1_container");
//                 }, 1000)
//   }, []);

//   return (
    
//     <div style={{ backgroundColor: '#191919', color: '#fff', margin: 0, padding: 0, fontFamily: 'Helvetica, Arial, sans-serif' }}>
//       <table align="center" border="0" cellspacing="0" cellpadding="0" style={{ width: '960px', height: '60px' }}>
//         <tr>
//           <td style={{ textAlign: 'center', fontSize: '26px' }}>
//             Tool - Slideshow Transition Viewer
//           </td>
//         </tr>
//       </table>

//       <table cellpadding="0" cellspacing="0" border="0" align="center">
//         <tr>
//           <td width="850" height="20"></td>
//         </tr>
//       </table>

//       <table cellpadding="0" cellspacing="0" border="0" bgcolor="#EEEEEE" align="center" style={{ color: '#000' }}>
//         <tr>
//           <td width="10"></td>
//           <td width="110"><b>&nbsp; Select Transition</b></td>
//           <td width="320" height="40">
//             <select name="ssTransition" id="ssTransition" style={{ width: '300px' }}>
//               <option value=""></option>
//             </select>
//           </td>
//           <td width="490">
//             <input type="button" value="Play" id="sButtonPlay" style={{ width: '110px' }} name="sButtonPlay" disabled="disabled" />
//           </td>
//           <td width="30"></td>
//         </tr>
//       </table>

//       <table cellpadding="0" cellspacing="0" border="0" bgcolor="#EEEEEE" align="center" style={{ color: '#000', backgroundColor: 'silver' }}>
//         <tr>
//           <td width="10" height="40"></td>
//           <td width="110"><b>&nbsp; Transition Code</b></td>
//           <td width="840" valign="center">
//             <input id="stTransition" style={{ width: '833px', height: '25px' }} type="text" name="stTransition" />
//           </td>
//         </tr>
//       </table>

//       <div style={{ height: '60px' }}></div>

//       <div style={{ position: 'relative', margin: '0 auto', width: '600px', height: '240px' }} id="slider1_container">
//         <div data-u="loading" className="jssorl-009-spin" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
//           <img style={{ marginTop: '-19px', position: 'relative', top: '50%', width: '38px', height: '38px' }} src="../svg/loading/static-svg/spin.svg" alt="Loading" />
//         </div>
//         <div u="slides" style={{ position: 'absolute', width: '600px', height: '240px', top: 0, left: 0, overflow: 'hidden' }}>
//           <div>
//             <img u="image" src="https://usms.urbanitsolution.com/web_content/img/1.jpg" alt="Slide 1" />
//           </div>
//           <div>
//             <img u="image" src="https://usms.urbanitsolution.com/web_content/img/2.jpg" alt="Slide 2" />
//           </div>
//         </div>
//       </div>

//       <div style={{ height: '60px' }}></div>

//       <div className="backGreen" style={{ position: 'relative', margin: '0 auto', padding: '5px', width: '960px' }}>
//         <div style={{ height: '25px' }}></div>
//         <div className="description backBlue" style={{ height: '210px' }}>
//           <div className="descriptiont">
//             The form above is to preview slideshow transition. You can select any slideshow transition from 360+ predefined slideshow transitions to play.<br />
//             A slideshow transition can be any or combination of 'Fly (Hor)', 'Fly (Ver)', 'Clip', 'Zoom' and 'Rotate'.<br />
//             Select transition to preview effect, once you get a transition that you prefer, you can copy the transition code from the transition code text box.<br />
//             You can change value of '$Duration' to adjust speed of transition. e.g. '$Duration:1200' - '$Duration: 2000'.<br />
//             Also you can change '$Col' or '$Row' value to adjust columns or rows count.
//           </div>
//         </div>
//       </div>

//       <table align="center" border="0" cellSpacing="0" cellPadding="0" style={{ width: '800px', height: '50px' }}>
//         <tr>
//           <td></td>
//         </tr>
//       </table>

//       <table align="center" border="0" cellSpacing="0" cellPadding="0" style={{ width: '960px', height: '30px' }}>
//         <tr>
//           <td valign="top" style={{ padding: '0px' }}>
//             <div style={{ position: 'absolute', width: '960px', height: '30px', overflow: 'hidden' }}>
//               <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#27a9e3', filter: 'alpha(opacity=30)', opacity: 0.3 }}></div>
//               <div style={{ position: 'absolute', width: '100%', height: '100%', fontSize: '13px', color: '#fff', lineHeight: '30px' }}>
//                 <span>&nbsp;&nbsp;Copy right 2009-2017</span><span style={{ float: 'right' }}>Powered by Jssor&nbsp;&nbsp;</span>
//               </div>
//             </div>
//           </td>
//         </tr>
//       </table>
//     </div>
//   );
// };

// export default SliderCreates;




//  original start

'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';
import { FaTrash, FaUpload } from 'react-icons/fa';
import "./jssor.slider.min.css"; // Ensure you have the appropriate CSS file for Jssor Slider
import "../js/jssor.slider.min.js"; // Ensure this file exists and is correctly loaded


const SliderCreates = () => {


    const [modalData2, setModalData2] = useState({ index: null, key: '', value: '' });


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

    const openModal2 = (key, index) => {
        // Set the modal data with index and key
        const selectedData = formData[index]?.linkDataValue2[key];
        if (selectedData && selectedData.type === '4') {
            setModalData2({ index, key, value: selectedData.value });
            $('#exampleModal2').modal('show'); // Show the modal
        }
    };
    const saveModalChanges2 = (page) => {
        const { index, key } = modalData2;  // Get the index and key from modalData2

        console.log("Saving changes for index:", index, "key:", key, "with page:", page);

        setActiveTabs(''); // Clear active tab if needed

        // Update the formData with the new page link value
        setFormData((prevFormData) => {
            const updatedFormData = prevFormData.map((item, itemIndex) => {
                if (itemIndex === index) {
                    return {
                        ...item,
                        linkDataValue2: {
                            ...item.linkDataValue2,
                            [key]: {
                                ...item.linkDataValue2[key],
                                value: page, // Set the value from the selected page link
                            },
                        },
                    };
                }
                return item;
            });
            return updatedFormData;
        });

        $('#exampleModal2').modal('hide'); // Close the modal
    };




    const [modalData, setModalData] = useState({ index: null, key: '', value: '' });


    const openModal = (index, key) => {
        const selectedData = formData[index]?.linkDataValue1[key];
        if (selectedData && selectedData.type == '4') {
            setModalData({ index, key, value: selectedData.value });
            $('#exampleModal').modal('show'); // Show the modal
        }


    };

    console.log(modalData)



    const saveModalChanges = (page) => {
        const { index, key } = modalData;  // Get the index and key from modalData2

        console.log("Saving changes for index:", index, "key:", key, "with page:", page);

        setActiveTabs(''); // Clear active tab if needed

        // Update the formData with the new page link value
        setFormData((prevFormData) => {
            const updatedFormData = prevFormData.map((item, itemIndex) => {
                if (itemIndex === index) {
                    return {
                        ...item,
                        linkDataValue1: {
                            ...item.linkDataValue1,
                            [key]: {
                                ...item.linkDataValue1[key],
                                value: page, // Set the value from the selected page link
                            },
                        },
                    };
                }
                return item;
            });
            return updatedFormData;
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
    const [formData, setFormData] = useState([]);
    const remove_field = (index) => {
        const newFields = [...formData];
        newFields.splice(index, 1);
        setFormData(newFields);
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


    const handleSelectChange = (index, linkKey, value) => {
        setFormData((prevFormData) => {
            const updatedFormData = [...prevFormData]; // Clone the array

            // Update the type and handle other properties accordingly
            updatedFormData[index] = {
                ...updatedFormData[index],
                linkDataValue1: {
                    ...updatedFormData[index].linkDataValue1,
                    [linkKey]: {
                        ...updatedFormData[index].linkDataValue1[linkKey],
                        type: value, // Update the type field
                        value: value === '1' ? 'https://' : value === '2' ? 'font' : value === '3' ? 'no link' : '',
                        disabled: value === '2' || value === '3' || value === '4', // Handle disabled state based on value
                    },
                },
            };

            return updatedFormData; // Return the updated state
        });
    };

    const handleInputChange = (index, linkKey, key, value, type = null) => {
        setFormData((prevFormData) => {
            const updatedFormData = [...prevFormData]; // Clone the array

            // Update the nested properties for the specific index and linkKey
            updatedFormData[index] = {
                ...updatedFormData[index],
                linkDataValue1: {
                    ...updatedFormData[index].linkDataValue1,
                    [linkKey]: {
                        ...updatedFormData[index].linkDataValue1[linkKey],
                        [key]: type === "checkbox" ? (value ? "1" : "0") : value, // Handle checkbox values
                    },
                },
            };

            return updatedFormData; // Return the updated state
        });
    };


    const handleSelectChange2 = (key, value, index) => {
        setFormData((prevFormData) => {
            const updatedFormData = [...prevFormData];
            updatedFormData[index] = {
                ...updatedFormData[index],
                linkDataValue2: {
                    ...updatedFormData[index].linkDataValue2,
                    [key]: {
                        ...updatedFormData[index].linkDataValue2[key],
                        type: value, // Update the type based on the selected value
                        value: value === '1' ? 'https//' : value === '2' ? 'font' : value === '3' ? 'no link' : '', // Adjust other values accordingly
                        disabled: value !== '1', // Enable/disable based on the selected value
                    },
                },
            };
            return updatedFormData;
        });
    };



    const handleInputChange2 = (id, key, value, index) => {
        // Create a copy of formData to avoid mutating the original state directly
        const updatedFormData = [...formData];

        // Update the nested structure within the specific index
        updatedFormData[index] = {
            ...updatedFormData[index],  // Copy the current object at the index
            linkDataValue2: {
                ...updatedFormData[index].linkDataValue2,  // Copy existing linkDataValue2
                [id]: {
                    ...updatedFormData[index].linkDataValue2[id],  // Copy the specific id
                    [key]: value,  // Update the specific key with the new value
                },
            },
        };

        // Update the formData state with the new updatedFormData
        setFormData(updatedFormData);
    };


    // Handle file input change
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
        setFormData((prevState) => [
            ...prevState,
            {
                file_path: filePath,
                linkDataValue1: { ...linkData },
                linkDataValue2: { ...linkData2 },
            },
        ]);

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

  
    const handleInputChangeForTitle = (value, index) => {
        setFormData((prevFormData) => {
            // Clone the current formData array
            const updatedFormData = [...prevFormData];

            // Update the specific field in the array based on index
            updatedFormData[index] = {
                ...updatedFormData[index],
                linkDataValue1: {
                    ...updatedFormData[index].linkDataValue1,
                    // Update the title field or any other nested property
                    title: value,
                },
            };

            // Return the updated formData
            return updatedFormData;
        });
    };

    // Example for updating other fields (like summary, or any other nested fields)
    const handleInputChangeForSummary = (value, index) => {
        setFormData((prevFormData) => {
            const updatedFormData = [...prevFormData];

            updatedFormData[index] = {
                ...updatedFormData[index],
                linkDataValue1: {
                    ...updatedFormData[index].linkDataValue1,
                    summary: value,
                },
            };

            return updatedFormData;
        });
    };
    const handleInputChangeForTitleSub = (value, index) => {
        setFormData((prevFormData) => {
            const updatedFormData = [...prevFormData];

            updatedFormData[index] = {
                ...updatedFormData[index],
                linkDataValue1: {
                    ...updatedFormData[index].linkDataValue1,
                    title_sub: value,
                },
            };

            return updatedFormData;
        });
    };
    const handleInputChangeForStatus = (value, index) => {
        setFormData((prevFormData) => {
            const updatedFormData = [...prevFormData];

            updatedFormData[index] = {
                ...updatedFormData[index],
                linkDataValue1: {
                    ...updatedFormData[index].linkDataValue1,
                    status: value,
                },
            };

            return updatedFormData;
        });
    };

    


    console.log(formData)


    const [selectedMonths, setSelectedMonths] = useState([]);



    // Handle changes in selection
    const handleChange = (selectedOptions) => {
        setSelectedMonths(selectedOptions || []);
    };

    console.log(selectedMonths)

    const router = useRouter()

    const slider_create = (event) => {
        event.preventDefault();
        const form = event.target;
        const slider_name = form.slider_name.value
        const allData = {
            formData, selectedMonths, slider_name, created_by: userId
        }


        console.log(allData)

        //${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/slider_create
        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/slider/slider_create

        fetch(``, {
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
    
useEffect(() => {

    setTimeout(() => {
        slideshow_transition_controller_starter("slider1_container");
                }, 1000)
  }, []);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
};

const handleDrop = (e, targetIndex) => {
    const draggedIndex = e.dataTransfer.getData("index");

    if (draggedIndex === targetIndex) return;

    const newFormData = [...formData];
    const draggedItem = newFormData[draggedIndex];
    newFormData.splice(draggedIndex, 1);
    newFormData.splice(targetIndex, 0, draggedItem);

    setFormData(newFormData);
};

const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow drop
};



    const renderLinkRow = (label, linkKey, index) => {
        const currentLinkData = formData[index].linkDataValue1[linkKey]; // Access the correct link data

        return (
            <div key={index} className="input-group input-group-sm mb-2">
                {/* Link Form Elements */}
                <input
                    style={{ flex: '1' }}
                    type="text"
                    className="form-control form-control-sm name_input w-25"
                    value={currentLinkData.name}
                    onChange={(e) => handleInputChange(index, linkKey, 'name', e.target.value)}
                    placeholder={`${label} Name`}
                />
                <select
                    style={{ flex: '1' }}
                    className="form-control form-control-sm link_type"
                    value={currentLinkData.align}
                    onChange={(e) => handleInputChange(index, linkKey, 'align', e.target.value)}
                >
                    <option value="">Button Center</option>
                    <option value="float-left">Button Left Align</option>
                    <option value="float-right">Button Right Align</option>
                </select>

                <div class="input-group-append" data-toggle="popover" title="" data-content="If you tick 'Scheduled' Pop Up will run given scheduled every day. Not whole Day" data-original-title="Scheduled">
                    <div class="input-group-text">
                        <input
                            style={{ flex: '1' }}
                            onChange={(e) => handleInputChange(index, linkKey, 'show', e.target.checked, 'checkbox')}
                            checked={currentLinkData.show === "1"}
                            type="checkbox"
                            aria-label="Checkbox for following text input"
                            value={currentLinkData.show}
                        />
                    </div>
                    <span class="input-group-text "><i class="fas fa-info-circle mr-1"></i>Button Show</span>
                </div>
                <select
                    style={{ flex: '1' }}
                    className="form-control form-control-sm link_type w-25"
                    value={currentLinkData.type}
                    onChange={(e) => handleSelectChange(index, linkKey, e.target.value)}
                >
                    <option value="1">External</option>
                    <option value="2">Front page</option>
                    <option value="3">No Link</option>
                    <option value="4">Content Reference</option>
                </select>
                <input
                    style={{ flex: '1' }}
                    type="text"
                    className="form-control form-control-sm select_result w-25"
                    value={currentLinkData.value}
                    disabled={currentLinkData.disabled}
                    onChange={(e) => handleInputChange(index, linkKey, 'value', e.target.value)}
                />
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
                    <form className="form-horizontal" method="post" autoComplete="off" onSubmit={slider_create}>
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
                                                    {formData.map((data, index) => (
                                                        <li
                                                            key={index}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "flex-start",
                                                                marginBottom: "8px",
                                                                border: "1px solid #ddd",
                                                                padding: "8px",
                                                                borderRadius: "4px",
                                                            }}
                                                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragOver={handleDragOver}
                                                        >
                                                            <img
                                                                src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${data.file_path}`}
                                                                alt="Slider"
                                                                style={{ width: "50px", height: "auto", marginRight: "8px" }}
                                                            />
                                                            <div style={{ flex: 1, marginRight: "8px" }}>
                                                                <h5 style={{ margin: "0 0 8px 0" }}>
                                                                    {Object.keys(data.linkDataValue2).map((key) => (
                                                                        <div key={key} style={{ display: "flex", justifyContent: "space-between" }}>
                                                                            <select
                                                                                className="form-control form-control-sm"
                                                                                value={data.linkDataValue2[key].type}
                                                                                onChange={(e) => handleSelectChange2(key, e.target.value, index)} // Pass index here
                                                                            >
                                                                                <option value="1">External</option>
                                                                                <option value="2">Front page</option>
                                                                                <option value="3">No Link</option>
                                                                                <option value="4">Content Reference</option>
                                                                            </select>

                                                                            <input
                                                                                type="text"
                                                                                className="form-control form-control-sm"
                                                                                value={data.linkDataValue2[key].value}
                                                                                disabled={data.linkDataValue2[key].disabled}
                                                                                onChange={(e) => handleInputChange2(key, "value", e.target.value, index)} // Pass index here
                                                                            />
                                                                            {data?.linkDataValue2[key].type == '4' && (
                                                                                <div className="input-group-append">
                                                                                    <span
                                                                                        className="input-group-text search_icon"
                                                                                        data-toggle={data.linkDataValue2[key].type === '4' ? 'modal' : ''}
                                                                                        data-target={data.linkDataValue2[key].type === '4' ? '#exampleModal2' : ''}
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

                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </h5>
                                                                <h5 style={{ margin: "0 0 8px 0" }}>
                                                                    <input
                                                                        name="title"
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Enter Title"
                                                                        type="text"
                                                                        style={{ width: "100%" }}
                                                                        onChange={(e) => handleInputChangeForTitle(e.target.value, index)} // Pass index here
                                                                    />
                                                                </h5>
                                                                <h5 style={{ margin: "0 0 8px 0" }}>
                                                                    <input
                                                                        name="title_sub"
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Enter Sub Title"
                                                                        type="text"
                                                                        style={{ width: "100%" }}
                                                                        onChange={(e) => handleInputChangeForTitleSub(e.target.value, index)} // Pass index here
                                                                    />
                                                                </h5>
                                                                <h5 style={{ margin: "0 0 8px 0" }}>

                                                                    <select style={{ width: "100%" }}
                                                                        onChange={(e) => handleInputChangeForStatus(e.target.value, index)} name="status" class="form-control form-control-sm mt-2 " id="status">
                                                                        <option value="">Select Status</option>
                                                                        <option value="1" >Active</option>
                                                                        <option value="2">Inactive</option>
                                                                        <option value="3">Pending</option>
                                                                    </select>
                                                                </h5>
                                                                <textarea
                                                                    name="summary"
                                                                    className="form-control form-control-sm"
                                                                    placeholder="Enter Brief"
                                                                    style={{ width: "100%" }}
                                                                    onChange={(e) => handleInputChangeForSummary(e.target.value, index)} // Pass index here
                                                                />

                                                                <div className='mt-2'>
                                                                    {renderLinkRow('Link1', 'link1', index)} {/* Pass index here */}
                                                                    {renderLinkRow('Link2', 'link2', index)} {/* Pass index here */}
                                                                </div>
                                                                <h5 style={{ margin: "0 0 8px 0" }}>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger btn-sm form-control form-control-sm mb-2"
                                                                        onClick={() => remove_field(index)}
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
                                                                                {/* <button onClick={saveModalChanges} type="button" className="btn btn-primary">Save changes</button> */}
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

export default SliderCreates;

//  original end


// 'use client' 
//  //ismile
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import Select from 'react-dropdown-select';
// import { FaTrash, FaUpload } from 'react-icons/fa';
// import "./jssor.slider.min.css"; // Ensure you have the appropriate CSS file for Jssor Slider
// import "../js/jssor.slider.min.js"; // Ensure this file exists and is correctly loaded


// const SliderCreates = () => {

//     const [formData, setFormData] = useState([]);
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


//     const handleSelectChange = (index, linkKey, value) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData]; // Clone the array

//             // Update the type and handle other properties accordingly
//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue1: {
//                     ...updatedFormData[index].linkDataValue1,
//                     [linkKey]: {
//                         ...updatedFormData[index].linkDataValue1[linkKey],
//                         type: value, // Update the type field
//                         value: value === '1' ? 'https://' : value === '2' ? 'font' : value === '3' ? 'no link' : '',
//                         disabled: value === '2' || value === '3' || value === '4', // Handle disabled state based on value
//                     },
//                 },
//             };

//             return updatedFormData; // Return the updated state
//         });
//     };

//     const handleInputChange = (index, linkKey, key, value, type = null) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData]; // Clone the array

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


//     const handleSelectChange2 = (key, value, index) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData];
//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue2: {
//                     ...updatedFormData[index].linkDataValue2,
//                     [key]: {
//                         ...updatedFormData[index].linkDataValue2[key],
//                         type: value, // Update the type based on the selected value
//                         value: value === '1' ? 'https//' : value === '2' ? 'font' : value === '3' ? 'no link' : '', // Adjust other values accordingly
//                         disabled: value !== '1', // Enable/disable based on the selected value
//                     },
//                 },
//             };
//             return updatedFormData;
//         });
//     };



//     const handleInputChange2 = (id, key, value, index) => {
//         // Create a copy of formData to avoid mutating the original state directly
//         const updatedFormData = [...formData];

//         // Update the nested structure within the specific index
//         updatedFormData[index] = {
//             ...updatedFormData[index],  // Copy the current object at the index
//             linkDataValue2: {
//                 ...updatedFormData[index].linkDataValue2,  // Copy existing linkDataValue2
//                 [id]: {
//                     ...updatedFormData[index].linkDataValue2[id],  // Copy the specific id
//                     [key]: value,  // Update the specific key with the new value
//                 },
//             },
//         };

//         // Update the formData state with the new updatedFormData
//         setFormData(updatedFormData);
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
//                 linkDataValue1: { ...linkData },
//                 linkDataValue2: { ...linkData2 },
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

  
//     const handleInputChangeForTitle = (value, index) => {
//         setFormData((prevFormData) => {
//             // Clone the current formData array
//             const updatedFormData = [...prevFormData];

//             // Update the specific field in the array based on index
//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue1: {
//                     ...updatedFormData[index].linkDataValue1,
//                     // Update the title field or any other nested property
//                     title: value,
//                 },
//             };

//             // Return the updated formData
//             return updatedFormData;
//         });
//     };

//     // Example for updating other fields (like summary, or any other nested fields)
//     const handleInputChangeForSummary = (value, index) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData];

//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue1: {
//                     ...updatedFormData[index].linkDataValue1,
//                     summary: value,
//                 },
//             };

//             return updatedFormData;
//         });
//     };
//     const handleInputChangeForTitleSub = (value, index) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData];

//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue1: {
//                     ...updatedFormData[index].linkDataValue1,
//                     title_sub: value,
//                 },
//             };

//             return updatedFormData;
//         });
//     };
//     const handleInputChangeForStatus = (value, index) => {
//         setFormData((prevFormData) => {
//             const updatedFormData = [...prevFormData];

//             updatedFormData[index] = {
//                 ...updatedFormData[index],
//                 linkDataValue1: {
//                     ...updatedFormData[index].linkDataValue1,
//                     status: value,
//                 },
//             };

//             return updatedFormData;
//         });
//     };

    


//     return (
//         <div className="card mb-3 shadow-sm">
//         <div className="card-header bg-gradient-primary text-white py-1 d-flex justify-content-between align-items-center">
//             <h6 className="card-title mb-0">Image List</h6>
//             <span style={{ width: "150px" }} className="btn btn-success btn-sm mb-2">
//                 <label htmlFor={`fileInput`} className="mb-0">
//                     <FaUpload /> Select Image
//                 </label>
//                 <input
//                     type="file"
//                     id={`fileInput`}
//                     style={{ display: "none" }}
//                     onChange={(e) => type_file_change("fileInput", e)}
//                 />
//             </span>
//         </div>
//         <div className="media-body">
//             <div style={{ width: "100%" }}>
//                 <ul style={{ listStyleType: "none", padding: 0 }}>
//                     {formData.map((data, index) => (
//                         <li
//                             key={index}
//                             style={{
//                                 display: "flex",
//                                 alignItems: "flex-start",
//                                 marginBottom: "8px",
//                                 border: "1px solid #ddd",
//                                 padding: "8px",
//                                 borderRadius: "4px",
//                             }}
                            
//                         >
//                             <img
//                                 src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${data.file_path}`}
//                                 alt="Slider"
//                                 style={{ width: "50px", height: "auto", marginRight: "8px" }}
//                             />
//                             <div style={{ flex: 1, marginRight: "8px" }}>
//                                 <h5 style={{ margin: "0 0 8px 0" }}>
//                                     {Object.keys(data.linkDataValue2).map((key) => (
//                                         <div key={key} style={{ display: "flex", justifyContent: "space-between" }}>
//                                             <select
//                                                 className="form-control form-control-sm"
//                                                 value={data.linkDataValue2[key].type}
//                                                 onChange={(e) => handleSelectChange2(key, e.target.value, index)} // Pass index here
//                                             >
//                                                 <option value="1">External</option>
//                                                 <option value="2">Front page</option>
//                                                 <option value="3">No Link</option>
//                                                 <option value="4">Content Reference</option>
//                                             </select>

//                                             <input
//                                                 type="text"
//                                                 className="form-control form-control-sm"
//                                                 value={data.linkDataValue2[key].value}
//                                                 disabled={data.linkDataValue2[key].disabled}
//                                                 onChange={(e) => handleInputChange2(key, "value", e.target.value, index)} // Pass index here
//                                             />
                                            
//                                         </div>
//                                     ))}
//                                 </h5>
//                                 <h5 style={{ margin: "0 0 8px 0" }}>
//                                     <input
//                                         name="title"
//                                         className="form-control form-control-sm"
//                                         placeholder="Enter Title"
//                                         type="text"
//                                         style={{ width: "100%" }}
//                                         onChange={(e) => handleInputChangeForTitle(e.target.value, index)} // Pass index here
//                                     />
//                                 </h5>
//                                 <h5 style={{ margin: "0 0 8px 0" }}>
//                                     <input
//                                         name="title_sub"
//                                         className="form-control form-control-sm"
//                                         placeholder="Enter Sub Title"
//                                         type="text"
//                                         style={{ width: "100%" }}
//                                         onChange={(e) => handleInputChangeForTitleSub(e.target.value, index)} // Pass index here
//                                     />
//                                 </h5>
//                                 <h5 style={{ margin: "0 0 8px 0" }}>

//                                     <select style={{ width: "100%" }}
//                                         onChange={(e) => handleInputChangeForStatus(e.target.value, index)} name="status" class="form-control form-control-sm mt-2 " id="status">
//                                         <option value="">Select Status</option>
//                                         <option value="1" >Active</option>
//                                         <option value="2">Inactive</option>
//                                         <option value="3">Pending</option>
//                                     </select>
//                                 </h5>
//                                 <textarea
//                                     name="summary"
//                                     className="form-control form-control-sm"
//                                     placeholder="Enter Brief"
//                                     style={{ width: "100%" }}
//                                     onChange={(e) => handleInputChangeForSummary(e.target.value, index)} // Pass index here
//                                 />

//                                 <div className='mt-2'>
//                                     {renderLinkRow('Link1', 'link1', index)} {/* Pass index here */}
//                                     {renderLinkRow('Link2', 'link2', index)} {/* Pass index here */}
//                                 </div>
//                                 <h5 style={{ margin: "0 0 8px 0" }}>
//                                     <button
//                                         type="button"
//                                         className="btn btn-danger btn-sm form-control form-control-sm mb-2"
//                                         onClick={() => remove_field(index)}
//                                     >
//                                         <i className="fas fa-trash-alt"></i>
//                                     </button>
//                                 </h5>

                              
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     </div>
//     );
// };

// export default SliderCreates;