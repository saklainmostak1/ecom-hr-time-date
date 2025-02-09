'use client'
//ismile
import React from 'react';
import '../../../admin_layout/modal/fa.css'
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const UserRoleEdit = ({ id }) => {


    const { data: usersRoleCreate = [], isLoading, refetch
    } = useQuery({
        queryKey: ['usersRoleCreate'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/page-group/display-name/with-id`)

            const data = await res.json()
            return data
        }
    })

    const [userRole, setUserRole] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/user-role-single/${id}`)
            .then(Response => Response.json())
            .then(data => setUserRole(data))
    }, [id])


    console.log(userRole, 'role of this page')





    const formatString = (str) => {
        const words = str.split('_');

        const formattedWords = words.map((word) => {
            const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return capitalizedWord;
        });

        return formattedWords.join(' ');
    };

    const convertToCamelCase = (input) => {
        return input.toLowerCase().replace(/ /g, '_');
    };



    let selectedMethodsArrays = userRole?.user_role?.user_role_permission[0]?.user_page_list_id





    // console.log(           usersRoleCreate.map((roleCreate => roleCreate.controllers.map((controllers =>   controllers.display_names.map((display => display?.method_names[0]?.method_id)))))))
    // const [selectedMethodsArray, setSelectedMethodsArray] = useState(
    //     []
    // );

    // useEffect(() => {
    //     setSelectedMethodsArray(selectedMethodsArrays)
    // }, [selectedMethodsArrays])

    let [selectedMethods, setSelectedMethods] = useState(
        []
    );




    console.log(selectedMethodsArrays)


    // useEffect(() => {
    //     setSelectedMethods(selectedMethodsArrays)
    // }, [selectedMethodsArrays])


    console.log(selectedMethods, 'selectedMethods')

    let [selectedMethodsArray, setSelectedMethodsArray] = useState([])


    console.log(selectedMethodsArray, 'selectedMethodsArrayselectedMethodsArrayselectedMethodsArrayselectedMethodsArray')
    let [counter, setCounter] = useState(true);

    const handleCheckboxClick = (methodId, checked) => {

        let updatedSelectedMethods;
        let method_id_array = [];
        let method_sort;
        let methond_length;

        if (counter) {
            const checkedId = [];
            const arr = selectedMethodsArrays?.split(',');
            for (let index = 0; index < arr?.length; index++) {
                const element = arr[index];
                if (+element !== methodId && element !== '' && !isNaN(element)) {
                    checkedId.push(parseInt(element, 10))
                }
            }
            setCounter(false);
            setSelectedMethodsArray(checkedId);
            updatedSelectedMethods = new Set(checkedId);
        } else {
            updatedSelectedMethods = new Set(selectedMethodsArray);
        }


        const controller = usersRoleCreate
            .flatMap((roleCreate) => roleCreate.controllers)
            .find((controller) => controller.display_names.some((display) => display.method_names.some((m) => m.method_id === methodId)));


        if (controller) {
            controller.display_names.forEach(display => {
                const method = display.method_names[0];
                method_id_array[method.method_sort] = method.method_id;
            });
            method_sort = method_id_array.indexOf(methodId);
            methond_length = method_id_array.length;
        }



        const value_assign = (element, value) => {

            if (element) {
                if (value) {
                    updatedSelectedMethods.add(element);
                    document.getElementById(`yourCheckboxId_${element}`).checked = true;
                } else if (!value) {
                    updatedSelectedMethods.delete(element);
                    document.getElementById(`yourCheckboxId_${element}`).checked = false;
                }
            }

        }


        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


        if (method_sort === 0) {
            for (let index = 0; index < methond_length; index++) {
                const element = method_id_array[index];
                value_assign(element, checked);
            }
        }
        else if (method_sort == 1 || method_sort == 4) {

            if ((!checked && updatedSelectedMethods.has(method_id_array[3])) || (!checked && updatedSelectedMethods.has(method_id_array[5]))) {
                value_assign(methodId, checked);
            } else {
                for (let index = 0; index < method_id_array.length; index++) {
                    const element = method_id_array[index];
                    if (element == method_id_array[0] || element == method_id_array[1] || element == method_id_array[2] || element == method_id_array[4]) {
                        value_assign(element, checked);
                    }
                }
            }
        }
        else if (method_sort == 2) {

            if (!checked) {
                value_assign(methodId, checked);
                !updatedSelectedMethods.has(method_id_array[1]) ? value_assign(method_id_array[0], checked) : '';
                method_id_array[3] ? value_assign(method_id_array[3], checked) : '';
                method_id_array[4] ? value_assign(method_id_array[4], checked) : '';
                method_id_array[5] ? value_assign(method_id_array[5], checked) : '';

            } else {
                for (let index = 0; index < method_id_array.length; index++) {
                    const element = method_id_array[index];
                    if (element) {
                        if (element == method_id_array[0] || element == method_id_array[2]) {
                            value_assign(element, checked);
                        }
                    }
                }

            }

        }
        else if (method_sort == 3) {

            if ((!checked && updatedSelectedMethods.has(method_id_array[1])) || (!checked && updatedSelectedMethods.has(method_id_array[4])) || (!checked && updatedSelectedMethods.has(method_id_array[5]))) {
                value_assign(methodId, checked);
            } else {
                for (let index = 0; index < method_id_array.length; index++) {
                    const element = method_id_array[index];
                    if (element) {
                        if (element == method_id_array[0] || element == method_id_array[2] || element == method_id_array[3]) {
                            value_assign(element, checked);
                        }
                    }
                }
            }
        }
        else if (method_sort == 5) {

            if ((!checked && updatedSelectedMethods.has(method_id_array[1])) || (!checked && updatedSelectedMethods.has(method_id_array[3])) || (!checked && updatedSelectedMethods.has(method_id_array[4]))) {
                value_assign(methodId, checked);
            } else {
                for (let index = 0; index < method_id_array.length; index++) {
                    const element = method_id_array[index];
                    if (element) {
                        if (element == method_id_array[0] || element == method_id_array[2] || element == method_id_array[5]) {
                            value_assign(element, checked);
                        }
                    }
                }
            }

        }

        const uniqueSelectedMethods = Array.from(updatedSelectedMethods);
        setSelectedMethodsArray(uniqueSelectedMethods);

        // console.log(updatedSelectedMethods, 'updatedSelectedMethods');

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    };


    console.log(selectedMethodsArray);


    const [doubleClickedDisplayName, setDoubleClickedDisplayName] = useState(0);

    const handleDoubleClick = (display) => {
        // const default_page = userRole?.role_name?.user_role_permission[0]?.user_default_page
        const page = display.method_names[0].method_id;
        const page1 = display.method_names[0].parent_id;
        console.log(page, page1);
        const checkbox = document.querySelector(`#yourCheckboxId_${display.method_names[0].method_id}`);

        if (display.method_names[0].menu_type === 1 && display.method_names[0].parent_id !== 0 && checkbox && checkbox.checked) {

            if (doubleClickedDisplayName === display.display_name) {
                setDoubleClickedDisplayName(null); // Remove 
                const statusInput = document.querySelector('input[name="default_page"]');
                if (statusInput) {
                    statusInput.value = '0'
                }
            } else {
                setDoubleClickedDisplayName(display.display_name);
                const statusInput = document.querySelector('input[name="default_page"]');
                if (statusInput) {
                    statusInput.value = page.toString();
                }
            }
        }
        else if (display.method_names[0].menu_type === 1 && display.method_names[0].parent_id !== 0) {
            alert('Please! At first checked selected page')
        }
    };



    // console.log(usersRoleCreate.map(userRole => userRole.controllers.map(nayan => nayan.display_names.map(hasan => hasan.method_names.map(method => method.method_id)))), 'user role')

    // const handleSelectAll = (e) => {
    //     const isChecked = e.target.checked;
    //     const checkboxes = document.querySelectorAll('.form-check-input');

    //     checkboxes.forEach((checkbox) => {
    //       checkbox.checked = isChecked;
    //       // You may also want to update the state or do something with the checked checkboxes here
    //     });
    //   };

    const router = useRouter()
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserRole((prevState) => ({
            ...prevState,
            user_role: {
                ...prevState.user_role,
                [name]: value,
            },
        }));
    };
    console.log(userRole?.user_role?.id)
    console.log(selectedMethodsArray.toString())
    // selectedMethodsArrays + ',' +
    const handleEditUserRole = (event) => {
        event.preventDefault();
        // const user_page_list_id = selectedMethodsArray && selectedMethodsArray.length > 0
        //     ? selectedMethodsArray.toString()
        //     : selectedMethodsArrays.toString();

        const selectedMethodsArraysParsed = selectedMethodsArrays.split(',');


        const combinedMethods = [
            ...selectedMethods,
            ...selectedMethodsArraysParsed
        ];


        // selectedMethods

        console.log(selectedMethodsArray.toString())
        console.log(selectedMethodsArrays)
        console.log(selectedMethods)


        const user_page_list_id = selectedMethodsArray && selectedMethodsArray.length > 0
            ? selectedMethodsArray.toString()
            : combinedMethods.toString();


        const userRoleId = userRole.user_role?.id; // Get the user role ID
        const formData = {
            otp_expire: otp_expire,
            pass_reset: pass_reset,
            OTP: selectedOption,
            user_role_id: userRoleId,
            role_name: userRole.user_role.role_name,
            // Include other user role properties...
            // user_page_list_id: selectedMethodsArrays + ',' + selectedMethods.toString(),
            // user_page_list_id: selectedMethodsArray ? selectedMethodsArray.toString() : selectedMethodsArrays.toString(),
            user_page_list_id: user_page_list_id,
            //  || "0", // Convert to string  + ',' + selectedMethodsArrays
            user_default_page:
                document.querySelector('input[name="default_page"]').value, // Example value, adjust as needed
            status: document.querySelector('input[name="status"]').value, // Example value, adjust as needed
        };
        console.log(formData)


        // Make a PUT request to update the user role
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/user-role/edit/${userRoleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((Response) => {
                Response.json()
                console.log(Response)
                if (Response.ok === true) {
                    localStorage.setItem('otp_expire', otp_expire)
                    sessionStorage.setItem("message", "Data Update successfully!");
                    window.location.href = '/Admin/user_role/user_role_all';

                }
            }
            )
            .then((data) => {
                console.log(data);
                // Handle success or error based on the response data
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle error
            });
        // console.log('Selected Method IDs:', selectedMethods);
    };


    console.log(selectedMethods)
    //  original start

    // const handleSelectAll = (e) => {
    //     const isChecked = e.target.checked;
    //     const checkboxes = document.querySelectorAll('.form-check-input');
    //     const methodIdArray = []; // Initialize an array to collect method_id values

    //     checkboxes.forEach((checkbox) => {
    //         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //         if (methodSort === 0 || methodSort === 1 || methodSort === 2 || methodSort === 3 || methodSort === 4 || methodSort === 5 || methodSort > 5) {
    //             checkbox.checked = isChecked;
    //             if (isChecked) {
    //                 // Capture the associated method_id when checking
    //                 const methodId = parseInt(checkbox.getAttribute('data-method-id'));
    //                 methodIdArray.push(methodId); // Add the method_id to the array
    //             }
    //             else {
    //                 const methodId = parseInt(checkbox.getAttribute('data-method-id'));
    //                 methodIdArray.pop(methodId);
    //             }
    //             // You may also want to update the state or do something with the checked checkboxes here
    //         }
    //     });
    //     if (!isChecked) {
    //         // Clear selectedMethods if SelectAll is unchecked
    //         selectedMethods.length = 0;
    //     } else {
    //         selectedMethods.push(...methodIdArray);
    //     }
    //     selectedMethods.push(...methodIdArray)
    //     console.log(selectedMethods, 'selectedMethods')
    //     console.log("Checked method_id values:", methodIdArray);
    //     // You now have an array containing the method_id values for checkboxes with method_sort values 0 or 2.
    // };
    //  original end

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll('.form-check-input');
        const methodIdArray = []; // Initialize an array to collect method_id values

        checkboxes.forEach((checkbox) => {
            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
            const methodId = parseInt(checkbox.getAttribute('data-method-id'));

            // Check if methodSort is 0-5 or greater than 5
            if (methodSort === 0 || methodSort === 1 || methodSort === 2 || methodSort === 3 || methodSort === 4 || methodSort === 5 || methodSort > 5) {
                checkbox.checked = isChecked;

                if (isChecked) {
                    // Capture the associated method_id when checking
                    if (!selectedMethods.includes(methodId)) {
                        selectedMethods.push(methodId); // Add the method_id to the selectedMethods array
                    }
                    methodIdArray.push(methodId); // Add the method_id to the array to track the selected ones
                } else {
                    // Remove method_id from the selectedMethods and methodIdArray if unchecked
                    const index = selectedMethods.indexOf(methodId);
                    if (index !== -1) {
                        selectedMethods.splice(index, 1); // Remove the method_id from selectedMethods
                    }
                    const arrayIndex = methodIdArray.indexOf(methodId);
                    if (arrayIndex !== -1) {
                        methodIdArray.splice(arrayIndex, 1); // Remove method_id from methodIdArray
                    }
                }
            }
        });

        // Update selectedMethodsArrays string
        if (!isChecked) {
            // If SelectAll is unchecked, remove the methodIds from selectedMethodsArrays
            selectedMethodsArrays = selectedMethodsArrays.split(',').map(Number).filter(id => !methodIdArray.includes(id)).join(',');
        } else {
            // If SelectAll is checked, add methodIdArray to selectedMethodsArrays
            selectedMethodsArrays = [...new Set([...selectedMethodsArrays.split(',').map(Number), ...methodIdArray])].join(',');
        }

        // Clear selectedMethodsArrays if selectedMethods is empty
        if (selectedMethods.length === 0) {
            selectedMethodsArrays = '';
        }

        console.log("Updated selectedMethods:", selectedMethods);
        console.log("Updated selectedMethodsArrays:", selectedMethodsArrays);
        console.log("Checked method_id values:", methodIdArray);
    };

    const handleCreateAllChange = (e) => {

        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll('.form-check-input');

        const methodIdSet = new Set(selectedMethods);

        checkboxes.forEach((checkbox) => {
            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
            const methodId = parseInt(checkbox.getAttribute('data-method-id'));

            if (methodSort === 0 || methodSort === 1 || methodSort === 2 || methodSort === 4) {
                checkbox.checked = isChecked;

                if (isChecked) {
                    // Add methodId to the methodIdSet
                    methodIdSet.add(methodId);
                } else {
                    // If checkbox is unchecked, remove methodId from the methodIdSet
                    methodIdSet.delete(methodId);

                    // Also remove the methodId from selectedMethodsArrays if checkbox is unchecked
                    selectedMethodsArrays = selectedMethodsArrays
                        .split(',')
                        .filter((id) => parseInt(id) !== methodId)
                        .join(',');
                }

                // When other specific checkboxes are still checked, ensure methods 0 and 2 are kept checked
                if (!isChecked) {
                    const selectAll = document.getElementById('selectAll');
                    // Check if any of the other checkboxes are still checked
                    const viewAllCheckbox = document.getElementById('viewAllCheckbox'); // Replace with the actual ID
                    const editAllCheckbox = document.getElementById('editAllCheckbox'); // Replace with the actual ID
                    const copyAllCheckbox = document.getElementById('copyAllCheckbox'); // Replace with the actual ID
                    const deleteAllCheckbox = document.getElementById('deleteAllCheckbox'); // Replace with the actual ID
                    const createAllCheckbox = document.getElementById('createAllCheckbox'); // Replace with the actual ID

                    if (selectAll.checked || viewAllCheckbox.checked || editAllCheckbox.checked || createAllCheckbox.checked || deleteAllCheckbox.checked) {
                        // Don't remove method_sort 0 and 2 when other checkboxes are still checked
                        checkboxes.forEach((checkbox) => {
                            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
                            if (methodSort === 0 || methodSort === 2) {
                                checkbox.checked = true;
                            }
                        });
                        if (methodSort !== 0 && methodSort !== 2) {
                            methodIdSet.delete(methodId);

                        }
                    } else {
                        // Remove the method_id if no other checkboxes are checked
                        methodIdSet.delete(methodId);
                    }
                }
            }
        });

        // Update selectedMethods with the final values from methodIdSet
        selectedMethods = Array.from(methodIdSet);
        console.log(selectedMethods, 'selectedMethods');
        console.log(selectedMethodsArrays, 'selectedMethodsArrays');

    };

    const handleViewAllChange = (e) => {

        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll('.form-check-input');

        const methodIdSet = new Set(selectedMethods);

        checkboxes.forEach((checkbox) => {
            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
            const methodId = parseInt(checkbox.getAttribute('data-method-id'));

            if (methodSort === 0 || methodSort === 2) {
                checkbox.checked = isChecked;

                if (isChecked) {
                    // Add methodId to the methodIdSet
                    methodIdSet.add(methodId);
                } else {
                    // If checkbox is unchecked, remove methodId from the methodIdSet
                    methodIdSet.delete(methodId);

                    // Also remove the methodId from selectedMethodsArrays if checkbox is unchecked
                    selectedMethodsArrays = selectedMethodsArrays
                        .split(',')
                        .filter((id) => parseInt(id) !== methodId)
                        .join(',');
                }

                // When other specific checkboxes are still checked, ensure methods 0 and 2 are kept checked
                if (!isChecked) {
                    const selectAll = document.getElementById('selectAll');
                    // Check if any of the other checkboxes are still checked
                    const viewAllCheckbox = document.getElementById('viewAllCheckbox'); // Replace with the actual ID
                    const editAllCheckbox = document.getElementById('editAllCheckbox'); // Replace with the actual ID
                    const copyAllCheckbox = document.getElementById('copyAllCheckbox'); // Replace with the actual ID
                    const deleteAllCheckbox = document.getElementById('deleteAllCheckbox'); // Replace with the actual ID
                    const createAllCheckbox = document.getElementById('createAllCheckbox'); // Replace with the actual ID

                    if (selectAll.checked || createAllCheckbox.checked || editAllCheckbox.checked || copyAllCheckbox.checked || deleteAllCheckbox.checked) {
                        // Don't remove method_sort 0 and 2 when other checkboxes are still checked
                        checkboxes.forEach((checkbox) => {
                            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
                            if (methodSort === 0) {
                                checkbox.checked = true;
                            }
                        });
                        if (methodSort !== 0) {
                            methodIdSet.delete(methodId);

                        }
                    } else {
                        // Remove the method_id if no other checkboxes are checked
                        methodIdSet.delete(methodId);
                    }
                }
            }
        });

        // Update selectedMethods with the final values from methodIdSet
        selectedMethods = Array.from(methodIdSet);
        console.log(selectedMethods, 'selectedMethods');
        console.log(selectedMethodsArrays, 'selectedMethodsArrays');

    };


    const handleEditAllChange = (e) => {

        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll('.form-check-input');

        const methodIdSet = new Set(selectedMethods);

        checkboxes.forEach((checkbox) => {
            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
            const methodId = parseInt(checkbox.getAttribute('data-method-id'));

            if (methodSort === 0 || methodSort === 2 || methodSort === 3) {
                checkbox.checked = isChecked;

                if (isChecked) {
                    // Add methodId to the methodIdSet
                    methodIdSet.add(methodId);
                } else {
                    // If checkbox is unchecked, remove methodId from the methodIdSet
                    methodIdSet.delete(methodId);

                    // Also remove the methodId from selectedMethodsArrays if checkbox is unchecked
                    selectedMethodsArrays = selectedMethodsArrays
                        .split(',')
                        .filter((id) => parseInt(id) !== methodId)
                        .join(',');
                }

                // When other specific checkboxes are still checked, ensure methods 0 and 2 are kept checked
                if (!isChecked) {
                    const selectAll = document.getElementById('selectAll');
                    // Check if any of the other checkboxes are still checked
                    const viewAllCheckbox = document.getElementById('viewAllCheckbox'); // Replace with the actual ID
                    const editAllCheckbox = document.getElementById('editAllCheckbox'); // Replace with the actual ID
                    const copyAllCheckbox = document.getElementById('copyAllCheckbox'); // Replace with the actual ID
                    const deleteAllCheckbox = document.getElementById('deleteAllCheckbox'); // Replace with the actual ID
                    const createAllCheckbox = document.getElementById('createAllCheckbox'); // Replace with the actual ID

                    if (selectAll.checked || viewAllCheckbox.checked || createAllCheckbox.checked || copyAllCheckbox.checked || deleteAllCheckbox.checked) {
                        // Don't remove method_sort 0 and 2 when other checkboxes are still checked
                        checkboxes.forEach((checkbox) => {
                            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
                            if (methodSort === 0 || methodSort === 2) {
                                checkbox.checked = true;
                            }
                        });
                        if (methodSort !== 0 && methodSort !== 2) {
                            methodIdSet.delete(methodId);

                        }
                    } else {
                        // Remove the method_id if no other checkboxes are checked
                        methodIdSet.delete(methodId);
                    }
                }
            }
        });

        // Update selectedMethods with the final values from methodIdSet
        selectedMethods = Array.from(methodIdSet);
        console.log(selectedMethods, 'selectedMethods');
        console.log(selectedMethodsArrays, 'selectedMethodsArrays');

    };



    const handleCopyAllChange = (e) => {

        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll('.form-check-input');

        const methodIdSet = new Set(selectedMethods);

        checkboxes.forEach((checkbox) => {
            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
            const methodId = parseInt(checkbox.getAttribute('data-method-id'));

            if (methodSort === 0 || methodSort === 1 || methodSort === 2 || methodSort === 4) {
                checkbox.checked = isChecked;

                if (isChecked) {
                    // Add methodId to the methodIdSet
                    methodIdSet.add(methodId);
                } else {
                    // If checkbox is unchecked, remove methodId from the methodIdSet
                    methodIdSet.delete(methodId);

                    // Also remove the methodId from selectedMethodsArrays if checkbox is unchecked
                    selectedMethodsArrays = selectedMethodsArrays
                        .split(',')
                        .filter((id) => parseInt(id) !== methodId)
                        .join(',');
                }

                // When other specific checkboxes are still checked, ensure methods 0 and 2 are kept checked
                if (!isChecked) {
                    const selectAll = document.getElementById('selectAll');
                    // Check if any of the other checkboxes are still checked
                    const viewAllCheckbox = document.getElementById('viewAllCheckbox'); // Replace with the actual ID
                    const editAllCheckbox = document.getElementById('editAllCheckbox'); // Replace with the actual ID
                    const copyAllCheckbox = document.getElementById('copyAllCheckbox'); // Replace with the actual ID
                    const deleteAllCheckbox = document.getElementById('deleteAllCheckbox'); // Replace with the actual ID
                    const createAllCheckbox = document.getElementById('createAllCheckbox'); // Replace with the actual ID

                    if (selectAll.checked || viewAllCheckbox.checked || editAllCheckbox.checked || createAllCheckbox.checked || deleteAllCheckbox.checked) {
                        // Don't remove method_sort 0 and 2 when other checkboxes are still checked
                        checkboxes.forEach((checkbox) => {
                            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
                            if (methodSort === 0 || methodSort === 2) {
                                checkbox.checked = true;
                            }
                        });
                        if (methodSort !== 0 && methodSort !== 2) {
                            methodIdSet.delete(methodId);

                        }
                    } else {
                        // Remove the method_id if no other checkboxes are checked
                        methodIdSet.delete(methodId);
                    }
                }
            }
        });

        // Update selectedMethods with the final values from methodIdSet
        selectedMethods = Array.from(methodIdSet);
        console.log(selectedMethods, 'selectedMethods');
        console.log(selectedMethodsArrays, 'selectedMethodsArrays');

    };



    const handleDeleteAllChange = (e) => {

        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll('.form-check-input');

        const methodIdSet = new Set(selectedMethods);

        checkboxes.forEach((checkbox) => {
            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
            const methodId = parseInt(checkbox.getAttribute('data-method-id'));

            if (methodSort === 0 || methodSort === 2 || methodSort === 5) {
                checkbox.checked = isChecked;

                if (isChecked) {
                    // Add methodId to the methodIdSet
                    methodIdSet.add(methodId);
                } else {
                    // If checkbox is unchecked, remove methodId from the methodIdSet
                    methodIdSet.delete(methodId);

                    // Also remove the methodId from selectedMethodsArrays if checkbox is unchecked
                    selectedMethodsArrays = selectedMethodsArrays
                        .split(',')
                        .filter((id) => parseInt(id) !== methodId)
                        .join(',');
                }

                // When other specific checkboxes are still checked, ensure methods 0 and 2 are kept checked
                if (!isChecked) {
                    const selectAll = document.getElementById('selectAll');
                    // Check if any of the other checkboxes are still checked
                    const viewAllCheckbox = document.getElementById('viewAllCheckbox'); // Replace with the actual ID
                    const editAllCheckbox = document.getElementById('editAllCheckbox'); // Replace with the actual ID
                    const copyAllCheckbox = document.getElementById('copyAllCheckbox'); // Replace with the actual ID
                    const deleteAllCheckbox = document.getElementById('deleteAllCheckbox'); // Replace with the actual ID
                    const createAllCheckbox = document.getElementById('createAllCheckbox'); // Replace with the actual ID

                    if (selectAll.checked || viewAllCheckbox.checked || editAllCheckbox.checked || copyAllCheckbox.checked || createAllCheckbox.checked) {
                        // Don't remove method_sort 0 and 2 when other checkboxes are still checked
                        checkboxes.forEach((checkbox) => {
                            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
                            if (methodSort === 0 || methodSort === 2) {
                                checkbox.checked = true;
                            }
                        });
                        if (methodSort !== 0 && methodSort !== 2) {
                            methodIdSet.delete(methodId);

                        }
                    } else {
                        // Remove the method_id if no other checkboxes are checked
                        methodIdSet.delete(methodId);
                    }
                }
            }
        });

        // Update selectedMethods with the final values from methodIdSet
        selectedMethods = Array.from(methodIdSet);
        console.log(selectedMethods, 'selectedMethods');
        console.log(selectedMethodsArrays, 'selectedMethodsArrays');

    };


    // const handleCreateAllChange = (e) => {

    //     const isChecked = e.target.checked;
    //     const checkboxes = document.querySelectorAll('.form-check-input');

    //     const methodIdSet = new Set(selectedMethods);

    //     checkboxes.forEach((checkbox) => {
    //         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //         console.log(methodSort)
    //         if (methodSort === 0 || methodSort === 1 || methodSort === 2 || methodSort === 4) {
    //             checkbox.checked = isChecked;
    //             const methodId = parseInt(checkbox.getAttribute('data-method-id'));

    //             if (isChecked) {
    //                 methodIdSet.add(methodId);
    //             } else {
    //                 const selectAll = document.getElementById('selectAll');
    //                 // Check if any of the other checkboxes are still checked
    //                 const viewAllCheckbox = document.getElementById('viewAllCheckbox'); // Replace with the actual ID
    //                 const editAllCheckbox = document.getElementById('editAllCheckbox'); // Replace with the actual ID
    //                 const copyAllCheckbox = document.getElementById('copyAllCheckbox'); // Replace with the actual ID
    //                 const deleteAllCheckbox = document.getElementById('deleteAllCheckbox'); // Replace with the actual ID
    //                 const createAllCheckbox = document.getElementById('createAllCheckbox'); // Replace with the actual ID

    //                 if (selectAll.checked || viewAllCheckbox.checked || editAllCheckbox.checked || createAllCheckbox.checked || deleteAllCheckbox.checked) {
    //                     // Don't remove method_sort 0 and 2 when other checkboxes are still checked
    //                     checkboxes.forEach((checkbox) => {
    //                         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //                         if (methodSort === 0 || methodSort === 2) {
    //                             checkbox.checked = true;
    //                         }
    //                     });
    //                     if (methodSort !== 0 && methodSort !== 2) {
    //                         methodIdSet.delete(methodId);

    //                     }
    //                 } else {
    //                     // Remove the method_id if no other checkboxes are checked
    //                     methodIdSet.delete(methodId);
    //                 }
    //             }
    //         }
    //     });

    //     selectedMethods = Array.from(methodIdSet);
    //     // selectedMethodsArray = Array.from(methodIdSet);
    //     console.log(selectedMethods, 'selectedMethods');
    //     // console.log(selectedMethodsArray, 'selectedMethodsArray');

    // };



    // const handleViewAllChange = (e) => {
    //     const isChecked = e.target.checked;
    //     const checkboxes = document.querySelectorAll('.form-check-input');

    //     const methodIdSet = new Set(selectedMethods);

    //     checkboxes.forEach((checkbox) => {
    //         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //         if (methodSort === 0 || methodSort === 2) {
    //             checkbox.checked = isChecked;
    //             const methodId = parseInt(checkbox.getAttribute('data-method-id'));

    //             if (isChecked) {
    //                 methodIdSet.add(methodId);
    //             } else {

    //                 // Check if any of the other checkboxes are still checked
    //                 const viewAllCheckbox = document.getElementById('viewAllCheckbox'); // Replace with the actual ID
    //                 const selectAll = document.getElementById('selectAll'); // Replace with the actual ID
    //                 const editAllCheckbox = document.getElementById('editAllCheckbox'); // Replace with the actual ID
    //                 const copyAllCheckbox = document.getElementById('copyAllCheckbox'); // Replace with the actual ID
    //                 const deleteAllCheckbox = document.getElementById('deleteAllCheckbox'); // Replace with the actual ID
    //                 const createAllCheckbox = document.getElementById('createAllCheckbox'); // Replace with the actual ID

    //                 if (selectAll.checked || createAllCheckbox.checked || editAllCheckbox.checked || copyAllCheckbox.checked || deleteAllCheckbox.checked) {
    //                     // Don't remove method_sort 0 and 2 when other checkboxes are still checked
    //                     checkboxes.forEach((checkbox) => {
    //                         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //                         if (methodSort === 0) {
    //                             checkbox.checked = true;
    //                         }
    //                     });
    //                     if (methodSort !== 0) {
    //                         methodIdSet.delete(methodId);

    //                     }
    //                 } else {
    //                     // Remove the method_id if no other checkboxes are checked
    //                     methodIdSet.delete(methodId);
    //                 }
    //             }
    //         }
    //     });

    //     selectedMethods = Array.from(methodIdSet);
    //     console.log(selectedMethods, 'selectedMethods');

    // };

    // const handleEditAllChange = (e) => {
    //     const isChecked = e.target.checked;
    //     const checkboxes = document.querySelectorAll('.form-check-input');

    //     const methodIdSet = new Set(selectedMethods);

    //     checkboxes.forEach((checkbox) => {
    //         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //         if (methodSort === 0 || methodSort === 2 || methodSort === 3) {
    //             checkbox.checked = isChecked;
    //             const methodId = parseInt(checkbox.getAttribute('data-method-id'));

    //             if (isChecked) {
    //                 methodIdSet.add(methodId);
    //             } else {
    //                 const selectAll = document.getElementById('selectAll');
    //                 // Check if any of the other checkboxes are still checked
    //                 const viewAllCheckbox = document.getElementById('viewAllCheckbox'); // Replace with the actual ID
    //                 const editAllCheckbox = document.getElementById('editAllCheckbox'); // Replace with the actual ID
    //                 const copyAllCheckbox = document.getElementById('copyAllCheckbox'); // Replace with the actual ID
    //                 const deleteAllCheckbox = document.getElementById('deleteAllCheckbox'); // Replace with the actual ID
    //                 const createAllCheckbox = document.getElementById('createAllCheckbox'); // Replace with the actual ID

    //                 if (selectAll.checked || viewAllCheckbox.checked || createAllCheckbox.checked || copyAllCheckbox.checked || deleteAllCheckbox.checked) {
    //                     // Don't remove method_sort 0 and 2 when other checkboxes are still checked
    //                     checkboxes.forEach((checkbox) => {
    //                         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //                         if (methodSort === 0 || methodSort === 2) {
    //                             checkbox.checked = true;
    //                         }
    //                     });
    //                     if (methodSort !== 0 && methodSort !== 2) {
    //                         methodIdSet.delete(methodId);

    //                     }
    //                 } else {
    //                     // Remove the method_id if no other checkboxes are checked
    //                     methodIdSet.delete(methodId);
    //                 }
    //             }
    //         }
    //     });

    //     selectedMethods = Array.from(methodIdSet);
    //     console.log(selectedMethods, 'selectedMethods');

    // };

    // const handleCopyAllChange = (e) => {

    //     const isChecked = e.target.checked;
    //     const checkboxes = document.querySelectorAll('.form-check-input');

    //     const methodIdSet = new Set(selectedMethods);

    //     checkboxes.forEach((checkbox) => {
    //         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //         if (methodSort === 0 || methodSort === 1 || methodSort === 2 || methodSort === 4) {
    //             checkbox.checked = isChecked;
    //             const methodId = parseInt(checkbox.getAttribute('data-method-id'));

    //             if (isChecked) {
    //                 methodIdSet.add(methodId);
    //             } else {
    //                 const selectAll = document.getElementById('selectAll');
    //                 // Check if any of the other checkboxes are still checked
    //                 const viewAllCheckbox = document.getElementById('viewAllCheckbox'); // Replace with the actual ID
    //                 const editAllCheckbox = document.getElementById('editAllCheckbox'); // Replace with the actual ID
    //                 const copyAllCheckbox = document.getElementById('copyAllCheckbox'); // Replace with the actual ID
    //                 const deleteAllCheckbox = document.getElementById('deleteAllCheckbox'); // Replace with the actual ID
    //                 const createAllCheckbox = document.getElementById('createAllCheckbox'); // Replace with the actual ID

    //                 if (selectAll.checked || viewAllCheckbox.checked || editAllCheckbox.checked || createAllCheckbox.checked || deleteAllCheckbox.checked) {
    //                     // Don't remove method_sort 0 and 2 when other checkboxes are still checked
    //                     checkboxes.forEach((checkbox) => {
    //                         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //                         if (methodSort === 0 || methodSort === 2) {
    //                             checkbox.checked = true;
    //                         }
    //                     });
    //                     if (methodSort !== 0 && methodSort !== 2) {
    //                         methodIdSet.delete(methodId);

    //                     }
    //                 } else {
    //                     // Remove the method_id if no other checkboxes are checked
    //                     methodIdSet.delete(methodId);
    //                 }
    //             }
    //         }
    //     });

    //     selectedMethods = Array.from(methodIdSet);
    //     console.log(selectedMethods, 'selectedMethods');

    // };

    // const handleDeleteAllChange = (e) => {
    //     const isChecked = e.target.checked;
    //     const checkboxes = document.querySelectorAll('.form-check-input');

    //     const methodIdSet = new Set(selectedMethods);

    //     checkboxes.forEach((checkbox) => {
    //         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //         if (methodSort === 0 || methodSort === 2 || methodSort === 5) {
    //             checkbox.checked = isChecked;
    //             const methodId = parseInt(checkbox.getAttribute('data-method-id'));

    //             if (isChecked) {
    //                 methodIdSet.add(methodId);
    //             } else {
    //                 const selectAll = document.getElementById('selectAll');
    //                 // Check if any of the other checkboxes are still checked
    //                 const viewAllCheckbox = document.getElementById('viewAllCheckbox'); // Replace with the actual ID
    //                 const editAllCheckbox = document.getElementById('editAllCheckbox'); // Replace with the actual ID
    //                 const copyAllCheckbox = document.getElementById('copyAllCheckbox'); // Replace with the actual ID
    //                 const deleteAllCheckbox = document.getElementById('deleteAllCheckbox'); // Replace with the actual ID
    //                 const createAllCheckbox = document.getElementById('createAllCheckbox'); // Replace with the actual ID

    //                 if (selectAll.checked || viewAllCheckbox.checked || editAllCheckbox.checked || copyAllCheckbox.checked || createAllCheckbox.checked) {
    //                     // Don't remove method_sort 0 and 2 when other checkboxes are still checked
    //                     checkboxes.forEach((checkbox) => {
    //                         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //                         if (methodSort === 0 || methodSort === 2) {
    //                             checkbox.checked = true;
    //                         }
    //                     });
    //                     if (methodSort !== 0 && methodSort !== 2) {
    //                         methodIdSet.delete(methodId);

    //                     }
    //                 } else {
    //                     // Remove the method_id if no other checkboxes are checked
    //                     methodIdSet.delete(methodId);
    //                 }
    //             }
    //         }
    //     });

    //     selectedMethods = Array.from(methodIdSet);
    //     console.log(selectedMethods, 'selectedMethods');

    // };




    // console.log('Filtered Display Names delete all:', filteredDisplayNamesViewAll);



    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 2500)
    }, [])
    const [btnIconUsers, setBtnIconUsers] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user-role/btn`)
            .then(Response => Response.json())
            .then(data => setBtnIconUsers(data))


    }, [])

    const filteredControllerName = btnIconUsers.filter(btn =>
        btn.method_sort === 2
    );

    const handleSelectAllPageGroup = (e, pageGroupId) => {
        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll(
            `.form-check-input[data-page-group="${pageGroupId}"]`
        );

        const methodIdSet = new Set(selectedMethods);
        let selectedMethodsArraysUpdated = selectedMethodsArrays.split(',');

        checkboxes.forEach((checkbox) => {
            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
            const methodId = parseInt(checkbox.getAttribute('data-method-id'));

            if (isChecked) {
                checkbox.checked = true;
                methodIdSet.add(methodId);
                // Add to selectedMethodsArrays if not already present
                if (!selectedMethodsArraysUpdated.includes(methodId.toString())) {
                    selectedMethodsArraysUpdated.push(methodId.toString());
                }
            } else {
                checkbox.checked = false;
                methodIdSet.delete(methodId);
                // Remove from selectedMethodsArrays when unchecked
                selectedMethodsArraysUpdated = selectedMethodsArraysUpdated.filter(
                    (id) => id !== methodId.toString()
                );
            }
        });

        // Update the selectedMethods with the latest methodIdSet
        selectedMethods = Array.from(methodIdSet);
        // Update selectedMethodsArrays as a comma-separated string
        selectedMethodsArrays = selectedMethodsArraysUpdated.join(',');

        console.log(selectedMethods, 'selectedMethods');
        console.log(selectedMethodsArrays, 'selectedMethodsArrays');
    };




    const handleCreateAllPageGroup = (e, pageGroupId) => {
        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll(
            `.form-check-input[data-page-group="${pageGroupId}"]`
        );

        const methodIdSet = new Set(selectedMethods);

        checkboxes.forEach((checkbox) => {
            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
            const methodId = parseInt(checkbox.getAttribute('data-method-id'));

            if (methodSort === 0 || methodSort === 1 || methodSort === 2 || methodSort === 4) {
                checkbox.checked = isChecked;

                if (isChecked) {
                    // Add methodId to the methodIdSet
                    methodIdSet.add(methodId);
                } else {
                    // If checkbox is unchecked, remove methodId from the methodIdSet
                    methodIdSet.delete(methodId);

                    // Also remove the methodId from selectedMethodsArrays if checkbox is unchecked
                    selectedMethodsArrays = selectedMethodsArrays
                        .split(',')
                        .filter((id) => parseInt(id) !== methodId)
                        .join(',');
                }

                // When other specific checkboxes are still checked, ensure methods 0 and 2 are kept checked
                if (!isChecked) {
                    const viewAllCheckbox = document.getElementById('viewAllCheckboxPageGroup');
                    const editAllCheckbox = document.getElementById('editAllCheckboxPageGroup');
                    const copyAllCheckbox = document.getElementById('copyAllCheckboxPageGroup');
                    const deleteAllCheckbox = document.getElementById('deleteAllCheckboxPageGroup');

                    if (viewAllCheckbox.checked || editAllCheckbox.checked || copyAllCheckbox.checked || deleteAllCheckbox.checked) {
                        checkboxes.forEach((checkbox) => {
                            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
                            if (methodSort === 0 || methodSort === 2) {
                                checkbox.checked = true;
                            }
                        });
                    }
                }
            }
        });

        // Update selectedMethods with the final values from methodIdSet
        selectedMethods = Array.from(methodIdSet);
        console.log(selectedMethods, 'selectedMethods');
        console.log(selectedMethodsArrays, 'selectedMethodsArrays');
    };


    const handleViewAllPageGroup = (e, pageGroupId) => {
        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll(
            `.form-check-input[data-page-group="${pageGroupId}"]`
        );

        const methodIdSet = new Set(selectedMethods);
        const selectedMethodsArraysSet = new Set(selectedMethodsArrays.split(',')); // Convert selectedMethodsArrays to a Set

        checkboxes.forEach((checkbox) => {
            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
            if (methodSort === 0 || methodSort === 2) {
                checkbox.checked = isChecked;
                const methodId = parseInt(checkbox.getAttribute('data-method-id'));

                if (isChecked) {
                    methodIdSet.add(methodId);
                    selectedMethodsArraysSet.add(methodId.toString()); // Add methodId to selectedMethodsArraysSet
                } else {
                    // Check if any of the other checkboxes are still checked
                    const createAllCheckbox = document.getElementById('createAllCheckboxPageGroup');
                    const editAllCheckbox = document.getElementById('editAllCheckboxPageGroup');
                    const copyAllCheckbox = document.getElementById('copyAllCheckboxPageGroup');
                    const deleteAllCheckbox = document.getElementById('deleteAllCheckboxPageGroup');

                    if (createAllCheckbox.checked || editAllCheckbox.checked || copyAllCheckbox.checked || deleteAllCheckbox.checked) {
                        // Don't remove method_sort 0 and 2 when other checkboxes are still checked
                        checkboxes.forEach((checkbox) => {
                            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
                            if (methodSort === 0) {
                                checkbox.checked = true;
                            }
                        });
                        if (methodSort !== 0) {
                            methodIdSet.delete(methodId);
                            selectedMethodsArraysSet.delete(methodId.toString()); // Remove methodId from selectedMethodsArraysSet
                        }
                    } else {
                        // Remove the method_id if no other checkboxes are checked
                        methodIdSet.delete(methodId);
                        selectedMethodsArraysSet.delete(methodId.toString()); // Remove methodId from selectedMethodsArraysSet
                    }
                }
            }
        });

        selectedMethods = Array.from(methodIdSet);
        selectedMethodsArrays = Array.from(selectedMethodsArraysSet).join(','); // Convert Set back to string

        console.log(selectedMethods, 'selectedMethods');
        console.log(selectedMethodsArrays, 'selectedMethodsArrays');
    };



    const handleEditAllPageGroup = (e, pageGroupId) => {
        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll(
            `.form-check-input[data-page-group="${pageGroupId}"]`
        );

        const methodIdSet = new Set(selectedMethods);
        const selectedMethodsArraysSet = new Set(selectedMethodsArrays.split(',')); // Convert selectedMethodsArrays to a Set

        checkboxes.forEach((checkbox) => {
            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
            if (methodSort === 0 || methodSort === 2 || methodSort === 3) {
                checkbox.checked = isChecked;
                const methodId = parseInt(checkbox.getAttribute('data-method-id'));

                if (isChecked) {
                    methodIdSet.add(methodId);
                    selectedMethodsArraysSet.add(methodId.toString()); // Add methodId to selectedMethodsArraysSet
                } else {
                    // Check if any of the other checkboxes are still checked
                    const viewAllCheckbox = document.getElementById('viewAllCheckboxPageGroup');
                    const editAllCheckbox = document.getElementById('editAllCheckboxPageGroup');
                    const copyAllCheckbox = document.getElementById('copyAllCheckboxPageGroup');
                    const deleteAllCheckbox = document.getElementById('deleteAllCheckboxPageGroup');
                    const createAllCheckbox = document.getElementById('createAllCheckboxPageGroup');

                    if (viewAllCheckbox.checked || createAllCheckbox.checked || copyAllCheckbox.checked || deleteAllCheckbox.checked) {
                        // Don't remove method_sort 0 and 2 when other checkboxes are still checked
                        checkboxes.forEach((checkbox) => {
                            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
                            if (methodSort === 0 || methodSort === 2) {
                                checkbox.checked = true;
                            }
                        });
                        if (methodSort !== 0 && methodSort !== 2) {
                            methodIdSet.delete(methodId);
                            selectedMethodsArraysSet.delete(methodId.toString()); // Remove methodId from selectedMethodsArraysSet
                        }
                    } else {
                        // Remove the method_id if no other checkboxes are checked
                        methodIdSet.delete(methodId);
                        selectedMethodsArraysSet.delete(methodId.toString()); // Remove methodId from selectedMethodsArraysSet
                    }
                }
            }
        });

        selectedMethods = Array.from(methodIdSet);
        selectedMethodsArrays = Array.from(selectedMethodsArraysSet).join(','); // Convert Set back to string

        console.log(selectedMethods, 'selectedMethods');
        console.log(selectedMethodsArrays, 'selectedMethodsArrays');
    };


    const handleCopyAllPageGroup = (e, pageGroupId) => {
        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll(
            `.form-check-input[data-page-group="${pageGroupId}"]`
        );

        const methodIdSet = new Set(selectedMethods);
        const selectedMethodsArraysSet = new Set(selectedMethodsArrays.split(',')); // Convert selectedMethodsArrays to a Set

        checkboxes.forEach((checkbox) => {
            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
            if (methodSort === 0 || methodSort === 1 || methodSort === 2 || methodSort === 4) {
                checkbox.checked = isChecked;
                const methodId = parseInt(checkbox.getAttribute('data-method-id'));

                if (isChecked) {
                    methodIdSet.add(methodId);
                    selectedMethodsArraysSet.add(methodId.toString()); // Add methodId to selectedMethodsArraysSet
                } else {
                    // Check if any of the other checkboxes are still checked
                    const viewAllCheckbox = document.getElementById('viewAllCheckboxPageGroup');
                    const editAllCheckbox = document.getElementById('editAllCheckboxPageGroup');
                    const copyAllCheckbox = document.getElementById('copyAllCheckboxPageGroup');
                    const deleteAllCheckbox = document.getElementById('deleteAllCheckboxPageGroup');
                    const createAllCheckbox = document.getElementById('createAllCheckboxPageGroup');


                    if (viewAllCheckbox.checked || editAllCheckbox.checked || createAllCheckbox.checked || deleteAllCheckbox.checked) {
                        // Don't remove method_sort 0 and 2 when other checkboxes are still checked
                        checkboxes.forEach((checkbox) => {
                            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
                            if (methodSort === 0 || methodSort === 2) {
                                checkbox.checked = true;
                            }
                        });
                        if (methodSort !== 0 && methodSort !== 2) {
                            methodIdSet.delete(methodId);
                            selectedMethodsArraysSet.delete(methodId.toString()); // Remove methodId from selectedMethodsArraysSet
                        }
                    } else {
                        // Remove the method_id if no other checkboxes are checked
                        methodIdSet.delete(methodId);
                        selectedMethodsArraysSet.delete(methodId.toString()); // Remove methodId from selectedMethodsArraysSet
                    }
                }
            }
        });

        selectedMethods = Array.from(methodIdSet);
        selectedMethodsArrays = Array.from(selectedMethodsArraysSet).join(','); // Convert Set back to string

        console.log(selectedMethods, 'selectedMethods');
        console.log(selectedMethodsArrays, 'selectedMethodsArrays');
    };


    const handleDeleteAllPageGroup = (e, pageGroupId) => {
        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll(
            `.form-check-input[data-page-group="${pageGroupId}"]`
        );

        const methodIdSet = new Set(selectedMethods);
        const selectedMethodsArraysSet = new Set(selectedMethodsArrays.split(',')); // Convert selectedMethodsArrays to a Set

        checkboxes.forEach((checkbox) => {
            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
            if (methodSort === 0 || methodSort === 2 || methodSort === 5) {
                checkbox.checked = isChecked;
                const methodId = parseInt(checkbox.getAttribute('data-method-id'));

                if (isChecked) {
                    methodIdSet.add(methodId);
                    selectedMethodsArraysSet.add(methodId.toString()); // Add methodId to selectedMethodsArraysSet
                } else {
                    // Check if any of the other checkboxes are still checked
                    const viewAllCheckbox = document.getElementById('viewAllCheckboxPageGroup');
                    const editAllCheckbox = document.getElementById('editAllCheckboxPageGroup');
                    const copyAllCheckbox = document.getElementById('copyAllCheckboxPageGroup');
                    const deleteAllCheckbox = document.getElementById('deleteAllCheckboxPageGroup');
                    const createAllCheckbox = document.getElementById('createAllCheckboxPageGroup');

                    if (viewAllCheckbox.checked || editAllCheckbox.checked || copyAllCheckbox.checked || createAllCheckbox.checked) {
                        // Don't remove method_sort 0 and 2 when other checkboxes are still checked
                        checkboxes.forEach((checkbox) => {
                            const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
                            if (methodSort === 0 || methodSort === 2) {
                                checkbox.checked = true;
                            }
                        });
                        if (methodSort !== 0 && methodSort !== 2) {
                            methodIdSet.delete(methodId);
                            selectedMethodsArraysSet.delete(methodId.toString()); // Remove methodId from selectedMethodsArraysSet
                        }
                    } else {
                        // Remove the method_id if no other checkboxes are checked
                        methodIdSet.delete(methodId);
                        selectedMethodsArraysSet.delete(methodId.toString()); // Remove methodId from selectedMethodsArraysSet
                    }
                }
            }
        });

        selectedMethods = Array.from(methodIdSet);
        selectedMethodsArrays = Array.from(selectedMethodsArraysSet).join(','); // Convert Set back to string

        console.log(selectedMethods, 'selectedMethods');
        console.log(selectedMethodsArrays, 'selectedMethodsArrays');
    };


    // const handleSelectAllPageGroup = (e, pageGroupId) => {
    //     const isChecked = e.target.checked;
    //     const checkboxes = document.querySelectorAll(
    //         `.form-check-input[data-page-group="${pageGroupId}"]`
    //     );

    //     const methodIdSet = new Set(selectedMethods);

    //     checkboxes.forEach((checkbox) => {
    //         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //         const methodId = parseInt(checkbox.getAttribute('data-method-id'));

    //         if (isChecked) {
    //             checkbox.checked = true;
    //             methodIdSet.add(methodId);
    //         } else {
    //             checkbox.checked = false;
    //             methodIdSet.delete(methodId);
    //         }
    //     });

    //     selectedMethods = Array.from(methodIdSet);
    //     console.log(selectedMethods, 'selectedMethods');
    // };




    // const handleCreateAllPageGroup = (e, pageGroupId) => {
    //     const isChecked = e.target.checked;
    //     const checkboxes = document.querySelectorAll(
    //         `.form-check-input[data-page-group="${pageGroupId}"]`
    //     );



    //     const methodIdSet = new Set(selectedMethods);

    //     checkboxes.forEach((checkbox) => {
    //         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //         if (methodSort === 0 || methodSort === 1 || methodSort === 2 || methodSort === 4) {
    //             checkbox.checked = isChecked;
    //             const methodId = parseInt(checkbox.getAttribute('data-method-id'));

    //             if (isChecked) {
    //                 methodIdSet.add(methodId);
    //             } else {
    //                 // Check if any of the other checkboxes are still checked
    //                 const viewAllCheckbox = document.getElementById('viewAllCheckboxPageGroup');
    //                 const editAllCheckbox = document.getElementById('editAllCheckboxPageGroup');
    //                 const copyAllCheckbox = document.getElementById('copyAllCheckboxPageGroup');
    //                 const deleteAllCheckbox = document.getElementById('deleteAllCheckboxPageGroup');




    //                 if (viewAllCheckbox.checked || editAllCheckbox.checked || copyAllCheckbox.checked || deleteAllCheckbox.checked) {
    //                     // Don't remove method_sort 0 and 2 when other checkboxes are still checked
    //                     checkboxes.forEach((checkbox) => {
    //                         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //                         if (methodSort === 0 || methodSort === 2) {
    //                             checkbox.checked = true;
    //                         }
    //                     });
    //                     if (methodSort !== 0 && methodSort !== 2) {
    //                         methodIdSet.delete(methodId);

    //                     }
    //                 } else {
    //                     // Remove the method_id if no other checkboxes are checked
    //                     methodIdSet.delete(methodId);
    //                 }
    //             }
    //         }
    //     });

    //     selectedMethods = Array.from(methodIdSet);
    //     console.log(selectedMethods, 'selectedMethods');
    // };




    // const handleViewAllPageGroup = (e, pageGroupId) => {
    //     const isChecked = e.target.checked;
    //     const checkboxes = document.querySelectorAll(
    //         `.form-check-input[data-page-group="${pageGroupId}"]`
    //     );

    //     const methodIdSet = new Set(selectedMethods);

    //     checkboxes.forEach((checkbox) => {
    //         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //         if (methodSort === 0 || methodSort === 2) {
    //             checkbox.checked = isChecked;
    //             const methodId = parseInt(checkbox.getAttribute('data-method-id'));

    //             if (isChecked) {
    //                 methodIdSet.add(methodId);
    //             } else {
    //                 // Check if any of the other checkboxes are still checked
    //                 const createAllCheckbox = document.getElementById('createAllCheckboxPageGroup');
    //                 const editAllCheckbox = document.getElementById('editAllCheckboxPageGroup');
    //                 const copyAllCheckbox = document.getElementById('copyAllCheckboxPageGroup');
    //                 const deleteAllCheckbox = document.getElementById('deleteAllCheckboxPageGroup');

    //                 if (createAllCheckbox.checked || editAllCheckbox.checked || copyAllCheckbox.checked || deleteAllCheckbox.checked) {
    //                     // Don't remove method_sort 0 and 2 when other checkboxes are still checked
    //                     checkboxes.forEach((checkbox) => {
    //                         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //                         if (methodSort === 0) {
    //                             checkbox.checked = true;
    //                         }
    //                     });
    //                     if (methodSort !== 0) {
    //                         methodIdSet.delete(methodId);

    //                     }
    //                 } else {
    //                     // Remove the method_id if no other checkboxes are checked
    //                     methodIdSet.delete(methodId);
    //                 }
    //             }
    //         }
    //     });

    //     selectedMethods = Array.from(methodIdSet);
    //     console.log(selectedMethods, 'selectedMethods');
    // };




    // const handleEditAllPageGroup = (e, pageGroupId) => {
    //     const isChecked = e.target.checked;
    //     const checkboxes = document.querySelectorAll(
    //         `.form-check-input[data-page-group="${pageGroupId}"]`
    //     );


    //     const methodIdSet = new Set(selectedMethods);

    //     checkboxes.forEach((checkbox) => {
    //         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //         if (methodSort === 0 || methodSort === 2 || methodSort === 3) {
    //             checkbox.checked = isChecked;
    //             const methodId = parseInt(checkbox.getAttribute('data-method-id'));

    //             if (isChecked) {
    //                 methodIdSet.add(methodId);
    //             } else {
    //                 // Check if any of the other checkboxes are still checked
    //                 const viewAllCheckbox = document.getElementById('viewAllCheckboxPageGroup');
    //                 const editAllCheckbox = document.getElementById('editAllCheckboxPageGroup');
    //                 const copyAllCheckbox = document.getElementById('copyAllCheckboxPageGroup');
    //                 const deleteAllCheckbox = document.getElementById('deleteAllCheckboxPageGroup');
    //                 const createAllCheckbox = document.getElementById('createAllCheckboxPageGroup');

    //                 if (viewAllCheckbox.checked || createAllCheckbox.checked || copyAllCheckbox.checked || deleteAllCheckbox.checked) {
    //                     // Don't remove method_sort 0 and 2 when other checkboxes are still checked
    //                     checkboxes.forEach((checkbox) => {
    //                         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //                         if (methodSort === 0 || methodSort === 2) {
    //                             checkbox.checked = true;
    //                         }
    //                     });
    //                     if (methodSort !== 0 && methodSort !== 2) {
    //                         methodIdSet.delete(methodId);

    //                     }
    //                 } else {
    //                     // Remove the method_id if no other checkboxes are checked
    //                     methodIdSet.delete(methodId);
    //                 }
    //             }
    //         }
    //     });

    //     selectedMethods = Array.from(methodIdSet);
    //     console.log(selectedMethods, 'selectedMethods');
    // };



    // const handleCopyAllPageGroup = (e, pageGroupId) => {
    //     const isChecked = e.target.checked;
    //     const checkboxes = document.querySelectorAll(
    //         `.form-check-input[data-page-group="${pageGroupId}"]`
    //     );

    //     const methodIdSet = new Set(selectedMethods);

    //     checkboxes.forEach((checkbox) => {
    //         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //         if (methodSort === 0 || methodSort === 1 || methodSort === 2 || methodSort === 4) {
    //             checkbox.checked = isChecked;
    //             const methodId = parseInt(checkbox.getAttribute('data-method-id'));

    //             if (isChecked) {
    //                 methodIdSet.add(methodId);
    //             } else {
    //                 // Check if any of the other checkboxes are still checked
    //                 const viewAllCheckbox = document.getElementById('viewAllCheckboxPageGroup');
    //                 const editAllCheckbox = document.getElementById('editAllCheckboxPageGroup');
    //                 const copyAllCheckbox = document.getElementById('copyAllCheckboxPageGroup');
    //                 const deleteAllCheckbox = document.getElementById('deleteAllCheckboxPageGroup');
    //                 const createAllCheckbox = document.getElementById('createAllCheckboxPageGroup');

    //                 if (viewAllCheckbox.checked || editAllCheckbox.checked || createAllCheckbox.checked || deleteAllCheckbox.checked) {
    //                     // Don't remove method_sort 0 and 2 when other checkboxes are still checked
    //                     checkboxes.forEach((checkbox) => {
    //                         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //                         if (methodSort === 0 || methodSort === 2) {
    //                             checkbox.checked = true;
    //                         }
    //                     });
    //                     if (methodSort !== 0 && methodSort !== 2) {
    //                         methodIdSet.delete(methodId);

    //                     }
    //                 } else {
    //                     // Remove the method_id if no other checkboxes are checked
    //                     methodIdSet.delete(methodId);
    //                 }
    //             }
    //         }
    //     });

    //     selectedMethods = Array.from(methodIdSet);
    //     console.log(selectedMethods, 'selectedMethods');
    // };


    // const handleDeleteAllPageGroup = (e, pageGroupId) => {
    //     const isChecked = e.target.checked;
    //     const checkboxes = document.querySelectorAll(
    //         `.form-check-input[data-page-group="${pageGroupId}"]`
    //     );

    //     const methodIdSet = new Set(selectedMethods);

    //     checkboxes.forEach((checkbox) => {
    //         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //         if (methodSort === 0 || methodSort === 2 || methodSort === 5) {
    //             checkbox.checked = isChecked;
    //             const methodId = parseInt(checkbox.getAttribute('data-method-id'));

    //             if (isChecked) {
    //                 methodIdSet.add(methodId);
    //             } else {
    //                 // Check if any of the other checkboxes are still checked
    //                 const viewAllCheckbox = document.getElementById('viewAllCheckboxPageGroup');
    //                 const editAllCheckbox = document.getElementById('editAllCheckboxPageGroup');
    //                 const copyAllCheckbox = document.getElementById('copyAllCheckboxPageGroup');
    //                 const deleteAllCheckbox = document.getElementById('deleteAllCheckboxPageGroup');
    //                 const createAllCheckbox = document.getElementById('createAllCheckboxPageGroup');

    //                 if (viewAllCheckbox.checked || editAllCheckbox.checked || copyAllCheckbox.checked || createAllCheckbox.checked) {
    //                     // Don't remove method_sort 0 and 2 when other checkboxes are still checked
    //                     checkboxes.forEach((checkbox) => {
    //                         const methodSort = parseInt(checkbox.getAttribute('data-method-sort'));
    //                         if (methodSort === 0 || methodSort === 2) {
    //                             checkbox.checked = true;
    //                         }
    //                     });
    //                     if (methodSort !== 0 && methodSort !== 2) {
    //                         methodIdSet.delete(methodId);

    //                     }
    //                 } else {
    //                     // Remove the method_id if no other checkboxes are checked
    //                     methodIdSet.delete(methodId);
    //                 }
    //             }
    //         }
    //     });

    //     selectedMethods = Array.from(methodIdSet);
    //     console.log(selectedMethods, 'selectedMethods');
    // };

    const [fastCheckboxChecked, setFastCheckboxChecked] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const handleFastCheckboxChange = () => {
        setFastCheckboxChecked(!fastCheckboxChecked);
    };

    console.log(fastCheckboxChecked)

    console.log(selectedOption)


    const [pass_reset, setpass_reset] = useState("0");

    const handleResetCheckboxChange = (event) => {
        const value = event.target.checked ? "1" : "0";
        setpass_reset(value);
    };
    console.log(pass_reset)


    const [otp_expire, setotp_expire] = useState('2');

    const handleChanges = (event) => {

        const value = event.target.value;

        setotp_expire(value);
    };


    const options = [];
    for (let i = 2; i <= 30; i += 2) {
        options.push(<option key={i} value={i}>{i}</option>);
    }

    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class=" bg-light body-content ">

                            <div class=" border-primary shadow-sm border-0">
                                <div
                                    style={{ backgroundColor: '#4267b2' }}
                                    class="card-header custom-card-header  py-1  clearfix bg-gradient-primary text-white">
                                    <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Create User Role</h5>
                                    <div class="card-title card-header-color font-weight-bold mb-0  float-right"> <Link href={`/Admin/${filteredControllerName[0]?.controller_name}/${filteredControllerName[0]?.method_name}?page-group=${filteredControllerName[0]?.page_group}`} class="btn btn-sm btn-info">Back to User role List</Link></div>
                                </div>
                                <div class="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                    (<small><sup><i class="text-danger fas fa-star"></i></sup></small>) field required
                                </div>
                                <div class="card-body">
                                    <form class=""
                                        onSubmit={handleEditUserRole}
                                        autocomplete="off">
                                        <div class="form-group row">
                                            <label class="col-form-label font-weight-bold col-md-2 font-weight-bold">Role Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div class="col-md-6">
                                                <input type="text"
                                                    onChange={handleChange}
                                                    name="role_name" class="form-control form-control-sm  required " placeholder="Enter Role Name"
                                                    defaultValue={userRole?.user_role?.role_name}
                                                />
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-form-label font-weight-bold col-md-2 font-weight-bold ">Page List:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                            <br />
                                            <div class="col-md-10 "


                                            >
                                                <div class=" mb-2" >


                                                    <div className='mt-2' >
                                                        <div style={{ width: '15%', fontSize: '15px' }} className="form-check form-check-inline w-15">
                                                            <input
                                                                id='selectAll'
                                                                className="form-check-input check_all head"
                                                                type="checkbox"
                                                                onChange={handleSelectAll}
                                                            />
                                                            <label className="form-check-label font-weight-bold" htmlFor="inlineCheckbox1">
                                                                Select All
                                                            </label>
                                                        </div>

                                                        <div
                                                            style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                            <input
                                                                id='createAllCheckbox'
                                                                name='check_box'
                                                                className="form-check-input"
                                                                type="checkbox"

                                                                onChange={handleCreateAllChange}
                                                            />


                                                            <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Create All <span class="badge badge-info" data-toggle="popover" title="" data-content="Double click to any 'create page text' for activating 'Default Dashboard' after Login." data-original-title="Default Page"><i class="fas fa-info-circle"></i></span></label>
                                                        </div>
                                                        <div
                                                            style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                            <input
                                                                id='viewAllCheckbox'
                                                                class="form-check-input list_method_all head" type="checkbox"
                                                                onChange={handleViewAllChange}

                                                            />
                                                            <label class="form-check-label font-weight-bold" for="inlineCheckbox1">View All <span class="badge badge-info" data-toggle="popover" title="" data-content="Double click to any 'view/list page text' for activating 'Default Dashboard' after Login." data-original-title="Default Page"><i class="fas fa-info-circle"></i></span></label>
                                                        </div>
                                                        <div
                                                            style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                            <input
                                                                id='editAllCheckbox'
                                                                class="form-check-input edit_method_all head" type="checkbox"

                                                                onChange={handleEditAllChange}
                                                            />
                                                            <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Edit All</label>
                                                        </div>
                                                        <div
                                                            style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                            <input
                                                                id='copyAllCheckbox'
                                                                class="form-check-input copy_method_all head" type="checkbox"
                                                                onChange={handleCopyAllChange}

                                                            />
                                                            <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Copy All</label>
                                                        </div>
                                                        <div
                                                            style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                            <input
                                                                id='deleteAllCheckbox'
                                                                onClick={handleDeleteAllChange}
                                                                class="form-check-input delete_method_all head"

                                                                type="checkbox" />
                                                            <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Delete All</label>
                                                        </div>
                                                    </div>


                                                </div>



                                                <div className=''>
                                                    {loading ?


                                                        <div class=" d-flex justify-content-center">
                                                            <div class="spinner-border" role="status">
                                                                <span class="sr-only">Loading...</span>
                                                            </div>
                                                        </div>
                                                        :
                                                        usersRoleCreate.map((roleCreate =>
                                                            <div key={roleCreate.id}>

                                                                <div
                                                                    style={{ backgroundColor: '#4267b2' }}
                                                                    class=" custom-card-header rounded-top py-1  clearfix bg-gradient-primary text-white mt-3">

                                                                    <h5 class="pl-2 card-title card-header-color font-weight-bold mb-0  float-left ">
                                                                        <strong>
                                                                            {formatString(roleCreate.page_group)}
                                                                        </strong>
                                                                    </h5>
                                                                    <br />




                                                                    <div className=' mt-2 p-1' >
                                                                        <div style={{ width: '15%', fontSize: '15px' }} className="form-check form-check-inline w-15">
                                                                            <input
                                                                                id='selectAllCheckboxPageGroup'
                                                                                name='check_box'
                                                                                className="form-check-input"
                                                                                type="checkbox"

                                                                                onChange={(e) => handleSelectAllPageGroup(e, roleCreate.page_group_id)}

                                                                            />
                                                                            <label className="form-check-label font-weight-bold">
                                                                                Select All
                                                                            </label>
                                                                        </div>

                                                                        <div
                                                                            style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                                            <input
                                                                                id='createAllCheckboxPageGroup'
                                                                                name='check_box'
                                                                                // className={`form-check-input[data-page-group="${roleCreate.page_group_id}`}
                                                                                className="form-check-input"
                                                                                type="checkbox"

                                                                                onChange={(e) => handleCreateAllPageGroup(e, roleCreate.page_group_id)}

                                                                            />


                                                                            <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Create All <span class="badge badge-info" data-toggle="popover" title="" data-content="Double click to any 'create page text' for activating 'Default Dashboard' after Login." data-original-title="Default Page"><i class="fas fa-info-circle"></i></span></label>
                                                                        </div>
                                                                        <div
                                                                            style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                                            <input
                                                                                id='viewAllCheckboxPageGroup'
                                                                                name='check_box'
                                                                                // className={`form-check-input[data-page-group="${roleCreate.page_group_id}`}
                                                                                className="form-check-input"
                                                                                type="checkbox"

                                                                                onChange={(e) => handleViewAllPageGroup(e, roleCreate.page_group_id)}

                                                                            />

                                                                            <label class="form-check-label font-weight-bold" for="inlineCheckbox1">View All <span class="badge badge-info" data-toggle="popover" title="" data-content="Double click to any 'view/list page text' for activating 'Default Dashboard' after Login." data-original-title="Default Page"><i class="fas fa-info-circle"></i></span></label>
                                                                        </div>
                                                                        <div
                                                                            style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                                            <input
                                                                                id='editAllCheckboxPageGroup'
                                                                                class="form-check-input edit_method_all head" type="checkbox"

                                                                                onChange={(e) => handleEditAllPageGroup(e, roleCreate.page_group_id)}
                                                                            />
                                                                            <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Edit All</label>
                                                                        </div>
                                                                        <div
                                                                            style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                                            <input
                                                                                id='copyAllCheckboxPageGroup'
                                                                                class="form-check-input copy_method_all head" type="checkbox"
                                                                                onChange={(e) => handleCopyAllPageGroup(e, roleCreate.page_group_id)}


                                                                            />
                                                                            <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Copy All</label>
                                                                        </div>
                                                                        <div
                                                                            style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                                            <input
                                                                                id='deleteAllCheckboxPageGroup'

                                                                                class="form-check-input delete_method_all head"
                                                                                onChange={(e) => handleDeleteAllPageGroup(e, roleCreate.page_group_id)}

                                                                                type="checkbox" />
                                                                            <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Delete All</label>
                                                                        </div>
                                                                    </div>


                                                                </div>

                                                                {
                                                                    roleCreate.controllers.map((controllers =>
                                                                        <div key={controllers.id} className='border-bottom'>


                                                                            <div>

                                                                                {
                                                                                    controllers.display_names.map((display =>




                                                                                        <div key={display.id}
                                                                                            className="form-check form-check-inline  py-2 "
                                                                                            id='methodss'

                                                                                            style={{ width: '15%', fontWeight: '650', fontSize: '12px' }}                                                          >


                                                                                            {
                                                                                                display.display_name === '' &&
                                                                                                <p><br /></p>
                                                                                            }
                                                                                            {

                                                                                                display.display_name !== '' &&
                                                                                                <>

                                                                                                    {/* <input
                                                                                        name='check_box'
                                                                                        id={`yourCheckboxId_${display?.method_names[0]?.method_id}`} // Add this ID attribute
                                                                                        className="form-check-input"
                                                                                        type="checkbox"


                                                                                        checked={selectedMethodsArrays?.includes(display.method_names[0].method_id) || selectedMethods.includes(display.method_names[0].method_id)}
                                                                                        value={selectedMethodsArrayss?.includes(display.method_names[0].method_id)}

                                                                                        onChange={(e) => handleCheckboxClick(display?.method_names[0]?.method_id, e.target.checked)}


                                                                                    /> */}
                                                                                                    <input
                                                                                                        name='check_box'
                                                                                                        id={`yourCheckboxId_${display?.method_names[0]?.method_id}`} // Add this ID attribute
                                                                                                        className="form-check-input 
                                                                                        form-check-input-one 
                                                                                        create_method_all"
                                                                                                        type="checkbox"

                                                                                                        // defaultChecked={selectedMethods?.includes(display.method_names[0].method_id)}
                                                                                                        defaultChecked={selectedMethods?.includes(display.method_names[0].method_id) || selectedMethodsArrays?.includes(display.method_names[0].method_id)}
                                                                                                        // checked={ selectedMethods?.includes(display.method_names[0].method_id) || selectedMethodsArray.includes(display.method_names[0].method_id)}
                                                                                                        value={selectedMethods?.includes(display.method_names[0].method_id)}

                                                                                                        onChange={(e) => handleCheckboxClick(display?.method_names[0]?.method_id, e.target.checked)}
                                                                                                        // onChange={(e) => handleCheckboxClick((display?.method_names[0]?.method_id, e.target.checked) ||  selectedMethodsArrays.includes(display?.method_names[0]?.method_id, e.target.checked) )}
                                                                                                        data-page-group={roleCreate.page_group_id}
                                                                                                        data-method-id={display.method_names[0].method_id}
                                                                                                        data-method-sort={display.method_names[0].method_sort}
                                                                                                    />


                                                                                                    <label
                                                                                                        style={{ marginTop: '7px' }}
                                                                                                        className={` ${doubleClickedDisplayName === display.display_name ? 'bg-danger text-white rounded px-2 ' : 'text-black'} `}
                                                                                                        onDoubleClick={() => handleDoubleClick(display)}
                                                                                                    >
                                                                                                        {display.display_name}
                                                                                                    </label>
                                                                                                </>
                                                                                            }



                                                                                        </div>

                                                                                    ))
                                                                                }
                                                                            </div>

                                                                        </div>

                                                                    ))
                                                                }


                                                            </div>
                                                        ))
                                                    }
                                                </div>

                                                <div className='mt-4'>


                                                    <div>
                                                        <div className="form-check form-check-inline w-15 m-0 mr-5" style={{ width: '15%', fontWeight: '650', fontSize: '12px' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={fastCheckboxChecked}
                                                                onChange={handleFastCheckboxChange}
                                                                name="check_box_otp"
                                                                value="1"
                                                                className="form-check-input"
                                                            />
                                                            <label style={{ marginTop: '7px', fontSize: '18px' }} className="px-2">
                                                                Send OTP
                                                            </label>
                                                        </div>

                                                        {fastCheckboxChecked && (
                                                            <div className="form-group">
                                                                <label htmlFor="selectField">Select Field:</label>
                                                                <select
                                                                    id="selectField"
                                                                    className="form-control"
                                                                    value={selectedOption}
                                                                    onChange={(e) => setSelectedOption(e.target.value)}
                                                                >

                                                                    <option value="">Select</option>
                                                                    <option value="1">Phone Number</option>
                                                                    <option value="2">Email</option>

                                                                </select>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="form-check form-check-inline w-15 m-0 mr-5" style={{ fontWeight: '650', fontSize: '12px' }}>
                                                            <input
                                                                type="checkbox"
                                                                name="pass_reset"
                                                                value="1"
                                                                className="form-check-input"
                                                                checked={pass_reset === '1'}
                                                                onChange={handleResetCheckboxChange}
                                                            />
                                                            <label style={{ marginTop: '7px', fontSize: '18px' }} className="px-2">
                                                                Reset Password
                                                            </label>
                                                        </div>

                                                        {pass_reset === '1' && (
                                                            <div className="form-group m-0" style={{ fontWeight: '650', fontSize: '12px' }}>
                                                                <label style={{ marginTop: '7px', fontSize: '18px' }} htmlFor="selectField">Select Your Reset Password Validation Time:</label>

                                                                <select id="selectField" className="form-control" value={otp_expire} onChange={handleChanges}>
                                                                    {options}
                                                                </select>

                                                                <p>{otp_expire} Minutes</p>
                                                            </div>
                                                        )}
                                                    </div>


                                                    <div class="form-group row mt-2">
                                                        <div class="col-sm-6">
                                                            <input
                                                                onClick={handleEditUserRole}

                                                                type="button" disabled="" class="btn btn-sm btn-success submit" value="Submit" />
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>


                                        <input type="hidden" name="status" value='0' />
                                        <input type="hidden" name="default_page" value={userRole?.user_role?.user_role_permission[0]?.user_role_id} />

                                    </form>

                                </div>
                            </div >
                        </div >
                    </div >
                </div >
            </div >
        </div >
    );
};


export default UserRoleEdit;

