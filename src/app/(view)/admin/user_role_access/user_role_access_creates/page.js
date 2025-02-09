'use client' 
 //ismile
import React from 'react';
import '../../../admin_layout/modal/fa.css'
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const UserRoleAccessCreates = () => {
    const router = useRouter()

    const { data: usersRoleCreate = [], isLoading, refetch
    } = useQuery({
        queryKey: ['usersRoleCreate'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/user_role_access/module_info_all_access`)

            const data = await res.json()
            return data
        }
    })

    const formatString = (str) => {
        const words = str.split('_');

        const formattedWords = words.map((word) => {
            const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return capitalizedWord;
        });

        return formattedWords.join(' ');
    };



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
    
        const { data: moduleInfo = []
        } = useQuery({
            queryKey: ['moduleInfo'],
            queryFn: async () => {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${userId}`)
    
                const data = await res.json()
                return data
            }
        })
    
    
        console.log(moduleInfo)
    
        // console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'brand'))
        const btnIconUsers = moduleInfo.filter(moduleI => moduleI.controller_name === 'user_role_access')


    const filteredControllerName = btnIconUsers.filter(btn =>
        btn.method_sort === 2
    );
    console.log(filteredControllerName[0], 'btndhghg')


    // const userRolesss = usersRoleCreate?.map(userRole => userRole?.controllers?.filter(nayan => nayan?.controller_name === 'user_role'))
    // console.log(userRolesss[14], 'get user role name')


    const convertToCamelCase = (input) => {
        return input.toLowerCase().replace(/ /g, '_');
    };


    const [selectedMethods, setSelectedMethods] = useState([]);

    const allMethodSorts = [];

    // original
    console.log(selectedMethods)
    const user_role_checkbox_click = (methodId, checked) => {

        setCheckBoxError('')
        const updatedSelectedMethods = new Set(selectedMethods);
        const checkedMethodSorts = []; // Array to store checked method_sort values

        if (checked) {
            updatedSelectedMethods.add(methodId);
        }

        else if (!checked) {
            updatedSelectedMethods.delete(methodId);
        }

        const controller = usersRoleCreate
            .flatMap((roleCreate) => roleCreate.controllers)
            .find((controller) =>
                controller.display_names.some((display) =>
                    display.method_names.some((m) => m.method_id === methodId)
                )
            );

        if (controller) {
            // Find the checked display_names
            const checkedDisplayNames = controller.display_names.filter((display) =>
                display.method_names.some((m) => updatedSelectedMethods.has(m.method_id))
            );

            // Push the method_sort values for the checked display_names
            checkedDisplayNames.forEach((display) => {
                display.method_names.forEach((m) => {
                    checkedMethodSorts.push(m.method_sort);
                });
            });
        }




        const method_sort = usersRoleCreate
            .flatMap((roleCreate) => roleCreate.controllers)
            .flatMap((controllers) => controllers.display_names)
            .flatMap((display) => display.method_names)
            .filter((m) => m.method_id === methodId)
            .map((m) => m.method_sort);

        console.log(method_sort);



        const parentMethodId = usersRoleCreate
            .flatMap((roleCreate) => roleCreate.controllers)
            .flatMap((controllers) => controllers.display_names)
            .flatMap((display) => display.method_names)
            .find((method) => method.method_id === methodId)?.parent_id || 0;

        if (checked) {
            updatedSelectedMethods.add(methodId);

            if (parentMethodId === 0) {
                // Uncheck all checkboxes with method_id equal to their parent_id
                const childMethodIds = usersRoleCreate
                    .flatMap((roleCreate) => roleCreate.controllers)
                    .flatMap((controllers) => controllers.display_names)
                    .flatMap((display) => display.method_names)
                    .filter((method) => method.parent_id === methodId)
                    .map((method) => method.method_id);

                childMethodIds.forEach((childMethodId) => updatedSelectedMethods.add(childMethodId));
            }
        } else {
            updatedSelectedMethods.delete(methodId);

            if (parentMethodId === 0) {
                // Uncheck all checkboxes with method_id equal to their parent_id
                const childMethodIds = usersRoleCreate
                    .flatMap((roleCreate) => roleCreate.controllers)
                    .flatMap((controllers) => controllers.display_names)
                    .flatMap((display) => display.method_names)
                    .filter((method) => method.parent_id === methodId)
                    .map((method) => method.method_id);

                childMethodIds.forEach((childMethodId) => updatedSelectedMethods.delete(childMethodId));
            }

            else {
                // If the checkbox being unchecked is for an item with menu_type = 1 and parent_id != 0,
                // remove the background
                const display = usersRoleCreate
                    .flatMap((roleCreate) => roleCreate.controllers)
                    .flatMap((controllers) => controllers.display_names)
                    .flatMap((display) => display.method_names)
                    .find((method) => method.method_id === methodId);


                if (display && display.menu_type === 1 && display.parent_id !== 0) {
                    setDoubleClickedDisplayName(null); // Remove background
                }


            }
        }

        // Find the controller containing the method with the specified methodId
        const controllerWithMethodId = usersRoleCreate
            .flatMap((roleCreate) => roleCreate.controllers)
            .find((controllers) =>
                controllers.display_names.some((display) =>
                    display.method_names.some((m) => m.method_id === methodId)
                )
            );

        if (controllerWithMethodId) {
            // Access the method_sort from controllerWithMethodId
            const method = controllerWithMethodId.display_names
                .flatMap((display) => display.method_names)
                .find((m) => m.method_id === methodId);

            if (method) {
                const method_sort = method.method_sort;

                if (method_sort === 0) {
                    // Check or uncheck all display_names in the same controller
                    controllerWithMethodId.display_names.forEach((display) => {
                        display.method_names.forEach((m) => {
                            const displayMethodId = m.method_id;
                            if (checked) {
                                updatedSelectedMethods.add(displayMethodId);
                            } else {
                                updatedSelectedMethods.delete(displayMethodId);
                            }

                            // You can also update the checkbox state here
                            const checkbox = document.getElementById(`yourCheckboxId_${displayMethodId}`);
                            if (checkbox) {
                                checkbox.checked = checked;
                            }
                        });
                    });


                }



                else if (method_sort === 1) {
                    let checkedMethodSortCount1 = 0; // Initialize the count of checked method_sort values
                    console.log("Checked Method Sorts length:", checkedMethodSorts);
                    let shouldUncheck0And3 = false; // Initialize a flag

                    // Check if any of the checkboxes for method_sort 3 are currently checked
                    const methodSort3Checkboxes = []; // Store the checkboxes for method_sort 3
                    controllerWithMethodId.display_names.forEach((display) => {
                        display.method_names.forEach((m) => {
                            if (m.method_sort === 3 || m.method_sort === 5 || m.method_sort === 6 || m.method_sort === 7 || m.method_sort === 8 || m.method_sort === 9 || m.method_sort === 10) {
                                const displayMethodId = m.method_id;
                                const checkbox = document.getElementById(`yourCheckboxId_${displayMethodId}`);
                                if (checkbox) {
                                    methodSort3Checkboxes.push(checkbox);
                                    if (checkbox.checked) {
                                        shouldUncheck0And3 = true;
                                    }

                                }

                            }
                        });
                    });

                    if (checked) {
                        shouldUncheck0And3 = false;
                    }

                    // Process the checkboxes for method_sort 0 and 2
                    controllerWithMethodId.display_names.forEach((display) => {
                        display.method_names.forEach((m) => {
                            if (m.method_sort === 0 || m.method_sort === 2 || m.method_sort === 4) {
                                const displayMethodId = m.method_id;
                                if (checked || shouldUncheck0And3) {
                                    updatedSelectedMethods.add(displayMethodId);
                                } else {
                                    updatedSelectedMethods.delete(displayMethodId);
                                }

                                // Update the checkbox state
                                const checkbox = document.getElementById(`yourCheckboxId_${displayMethodId}`);
                                if (checkbox) {
                                    checkbox.checked = checked || !shouldUncheck0And3;
                                }
                            }
                        });
                    });
                }
                else if (method_sort === 2) {
                    let checkedMethodSortCount1 = 0; // Initialize the count of checked method_sort values
                    console.log("Checked Method Sorts length:", checkedMethodSorts);
                    let shouldUncheck0And3 = false; // Initialize a flag

                    // Check if any of the checkboxes for method_sort 3 are currently checked
                    const methodSort3Checkboxes = []; // Store the checkboxes for method_sort 3
                    controllerWithMethodId.display_names.forEach((display) => {
                        display.method_names.forEach((m) => {
                            if (m.method_sort === 1 || m.method_sort === 3 || m.method_sort === 5 || m.method_sort === 4 || m.method_sort > 5) {
                                const displayMethodId = m.method_id;
                                const checkbox = document.getElementById(`yourCheckboxId_${displayMethodId}`);
                                if (checkbox) {
                                    methodSort3Checkboxes.push(checkbox);
                                    if (checkbox.checked) {
                                        shouldUncheck0And3 = true;
                                    }
                                }
                            }
                        });
                    });

                    if (checked) {
                        shouldUncheck0And3 = false;
                    }

                    // Process the checkboxes for method_sort 0 and 2
                    controllerWithMethodId.display_names.forEach((display) => {
                        display.method_names.forEach((m) => {
                            if (m.method_sort === 0) {
                                const displayMethodId = m.method_id;
                                if (checked || shouldUncheck0And3) {
                                    updatedSelectedMethods.add(displayMethodId);
                                } else {
                                    updatedSelectedMethods.delete(displayMethodId);
                                }

                                // Update the checkbox state
                                const checkbox = document.getElementById(`yourCheckboxId_${displayMethodId}`);
                                if (checkbox) {
                                    checkbox.checked = checked || !shouldUncheck0And3;
                                }
                            }
                        });
                    });
                }
                else if (method_sort === 3) {
                    let checkedMethodSortCount1 = 0; // Initialize the count of checked method_sort values
                    console.log("Checked Method Sorts length:", checkedMethodSorts);
                    let shouldUncheck0And3 = false; // Initialize a flag

                    // Check if any of the checkboxes for method_sort 3 are currently checked
                    const methodSort3Checkboxes = []; // Store the checkboxes for method_sort 3
                    controllerWithMethodId.display_names.forEach((display) => {
                        display.method_names.forEach((m) => {
                            if (m.method_sort === 1 || m.method_sort === 5 || m.method_sort === 4 || m.method_sort > 5) {
                                const displayMethodId = m.method_id;
                                const checkbox = document.getElementById(`yourCheckboxId_${displayMethodId}`);
                                if (checkbox) {
                                    methodSort3Checkboxes.push(checkbox);
                                    if (checkbox.checked) {
                                        shouldUncheck0And3 = true;
                                    }
                                }
                            }
                        });
                    });

                    if (checked) {
                        shouldUncheck0And3 = false;
                    }

                    // Process the checkboxes for method_sort 0 and 2
                    controllerWithMethodId.display_names.forEach((display) => {
                        display.method_names.forEach((m) => {
                            if (m.method_sort === 0 || m.method_sort === 2) {
                                const displayMethodId = m.method_id;
                                if (checked || shouldUncheck0And3) {
                                    updatedSelectedMethods.add(displayMethodId);
                                } else {
                                    updatedSelectedMethods.delete(displayMethodId);
                                }

                                // Update the checkbox state
                                const checkbox = document.getElementById(`yourCheckboxId_${displayMethodId}`);
                                if (checkbox) {
                                    checkbox.checked = checked || !shouldUncheck0And3;
                                }
                            }
                        });
                    });
                }
                else if (method_sort === 4) {
                    let checkedMethodSortCount1 = 0; // Initialize the count of checked method_sort values
                    console.log("Checked Method Sorts length:", checkedMethodSorts);
                    let shouldUncheck0And3 = false; // Initialize a flag

                    // Check if any of the checkboxes for method_sort 3 are currently checked
                    const methodSort3Checkboxes = []; // Store the checkboxes for method_sort 3
                    controllerWithMethodId.display_names.forEach((display) => {
                        display.method_names.forEach((m) => {
                            if (m.method_sort === 3 || m.method_sort === 5 || m.method_sort > 5) {
                                const displayMethodId = m.method_id;
                                const checkbox = document.getElementById(`yourCheckboxId_${displayMethodId}`);
                                if (checkbox) {
                                    methodSort3Checkboxes.push(checkbox);
                                    if (checkbox.checked) {
                                        shouldUncheck0And3 = true;
                                    }
                                }
                            }
                        });
                    });

                    if (checked) {
                        shouldUncheck0And3 = false;
                    }

                    // Process the checkboxes for method_sort 0 and 2
                    controllerWithMethodId.display_names.forEach((display) => {
                        display.method_names.forEach((m) => {
                            if (m.method_sort === 0 || m.method_sort === 1 || m.method_sort === 2) {
                                const displayMethodId = m.method_id;
                                if (checked || shouldUncheck0And3) {
                                    updatedSelectedMethods.add(displayMethodId);
                                } else {
                                    updatedSelectedMethods.delete(displayMethodId);
                                }

                                // Update the checkbox state
                                const checkbox = document.getElementById(`yourCheckboxId_${displayMethodId}`);
                                if (checkbox) {
                                    checkbox.checked = checked || !shouldUncheck0And3;
                                }
                            }
                        });
                    });
                }
                else if (method_sort === 5) {
                    let checkedMethodSortCount1 = 0; // Initialize the count of checked method_sort values
                    console.log("Checked Method Sorts length:", checkedMethodSorts);
                    let shouldUncheck0And3 = false; // Initialize a flag

                    // Check if any of the checkboxes for method_sort 3 are currently checked
                    const methodSort3Checkboxes = []; // Store the checkboxes for method_sort 3
                    controllerWithMethodId.display_names.forEach((display) => {
                        display.method_names.forEach((m) => {
                            if (m.method_sort === 1 || m.method_sort === 3 || m.method_sort === 4 || m.method_sort > 5) {
                                const displayMethodId = m.method_id;
                                const checkbox = document.getElementById(`yourCheckboxId_${displayMethodId}`);
                                if (checkbox) {
                                    methodSort3Checkboxes.push(checkbox);
                                    if (checkbox.checked) {
                                        shouldUncheck0And3 = true;
                                    }
                                }
                            }
                        });
                    });

                    if (checked) {
                        shouldUncheck0And3 = false;
                    }

                    // Process the checkboxes for method_sort 0 and 2
                    controllerWithMethodId.display_names.forEach((display) => {
                        display.method_names.forEach((m) => {
                            if (m.method_sort === 0 || m.method_sort === 2) {
                                const displayMethodId = m.method_id;
                                if (checked || shouldUncheck0And3) {
                                    updatedSelectedMethods.add(displayMethodId);
                                } else {
                                    updatedSelectedMethods.delete(displayMethodId);
                                }

                                // Update the checkbox state
                                const checkbox = document.getElementById(`yourCheckboxId_${displayMethodId}`);
                                if (checkbox) {
                                    checkbox.checked = checked || !shouldUncheck0And3;
                                }
                            }
                        });
                    });
                }
                else if (method_sort > 5) {
                    let checkedMethodSortCount1 = 0; // Initialize the count of checked method_sort values
                    console.log("Checked Method Sorts length:", checkedMethodSorts);
                    let shouldUncheck0And3 = false; // Initialize a flag

                    // Check if any of the checkboxes for method_sort 3 are currently checked
                    const methodSort3Checkboxes = []; // Store the checkboxes for method_sort 3
                    controllerWithMethodId.display_names.forEach((display) => {
                        display.method_names.forEach((m) => {
                            if (m.method_sort === 1 || m.method_sort === 2 || m.method_sort === 3 || m.method_sort === 4 || m.method_sort === 5 || m.method_sort > 5) {
                                const displayMethodId = m.method_id;
                                const checkbox = document.getElementById(`yourCheckboxId_${displayMethodId}`);
                                if (checkbox) {
                                    methodSort3Checkboxes.push(checkbox);
                                    if (checkbox.checked) {
                                        shouldUncheck0And3 = true;
                                    }
                                }
                            }
                        });
                    });

                    if (checked) {
                        shouldUncheck0And3 = false;
                    }

                    // Process the checkboxes for method_sort 0 and 2
                    controllerWithMethodId.display_names.forEach((display) => {
                        display.method_names.forEach((m) => {
                            if (m.method_sort === 0) {
                                const displayMethodId = m.method_id;
                                if (checked || shouldUncheck0And3) {
                                    updatedSelectedMethods.add(displayMethodId);
                                } else {
                                    updatedSelectedMethods.delete(displayMethodId);
                                }

                                // Update the checkbox state
                                const checkbox = document.getElementById(`yourCheckboxId_${displayMethodId}`);
                                if (checkbox) {
                                    checkbox.checked = checked || !shouldUncheck0And3;
                                }
                            }
                        });
                    });
                }

            }
        }

        const uniqueSelectedMethods = Array.from(updatedSelectedMethods);
        setSelectedMethods(uniqueSelectedMethods);

        if (uniqueSelectedMethods.length === 0) {
            document.querySelector('input[name="default_page"]').value = '0';
        }

    };





    const [doubleClickedDisplayName, setDoubleClickedDisplayName] = useState(0);



    const user_role_default_page = (display) => {

        const page = display.method_names[0].method_id;
        const page1 = display.method_names[0].parent_id;
        console.log(page, page1);
        const checkbox = document.querySelector(`#yourCheckboxId_${display.method_names[0].method_id}`);
        if (display.method_names[0].menu_type === 1 && display.method_names[0].parent_id !== 0 && checkbox && checkbox.checked) {

            if (doubleClickedDisplayName === display.display_name) {
                setDoubleClickedDisplayName(null); // Remove 
                const statusInput = document.querySelector('input[name="default_page"]');
                if (statusInput) {
                    statusInput.value = '0';
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



    const [selectAllChecked, setSelectAllChecked] = useState(false);


    const user_role_select_all_change = (isChecked) => {
        setSelectAllChecked(isChecked);
        if (isChecked) {
            // If "Select All" is checked, select all checkboxes
            const allMethodIds = usersRoleCreate
                .flatMap((roleCreate) => roleCreate.controllers)
                .flatMap((controllers) => controllers.display_names)
                .flatMap((display) => display.method_names)
                .map((method) => method.method_id);
            setSelectedMethods(allMethodIds);
        } else {
            // If "Select All" is unchecked, clear selected checkboxes
            setSelectedMethods([]);
        }
    };



    const [checkBoxError, setCheckBoxError] = useState([])
    const user_role_create = (event) => {

        // Get the role_name input value
        const roleName = document.querySelector('input[name="role_name"]').value;
        const check_box_email = document.querySelector('input[name="check_box"]').value;



        // Create an object to store the data you want to submit
        const formData = {
            otp_expire: otp_expire,
            OTP: selectedOption,
            user_default_page: document.querySelector('input[name="default_page"]').value,
            role_name: roleName,
            user_page_list_id: selectedMethods.toString(),
            status: document.querySelector('input[name="status"]').value,
            pass_reset: pass_reset
        };
        if (inputValue === '') {
            setShowError(true);
        }
        if (formData.user_page_list_id === '') {
            setCheckBoxError('Check Some Page list ')
            return
        }
        else {
            setCheckBoxError('')
        }


        console.log('Form Data:', formData);
        // http://localhost/:5002/user/user-role-create
        // ${process.env.NEXT_PUBLIC_API_URL}:5002/user/user-role-create
        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/user/users_role_access_create
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/user/users_role_access_create`, {
            method: 'POST',
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
                    sessionStorage.setItem("message", "Data saved successfully!");
                    router.push('/Admin/user_role_access/user_role_access_all')
                    // window.location.href = '/Admin/user_role_access/user_role_access_all';
                }
            })
            .then(data => {
                console.log('Server response:', data);
                // window.location.href = `/Admin/user_role/user_role_all?page-group=${filteredControllerName[0]?.page_group}`;
                // router.push(`/Admin/${filteredControllerName[0]?.controller_name}/${filteredControllerName[0]?.method_name}?page-group=${filteredControllerName[0]?.page_group}`)yw

            })
            .catch(error => {
                console.error('Error submitting the form:', error);

            });

        console.log('Selected Method IDs:', selectedMethods);
    };


    const [inputValue, setInputValue] = useState('');
    const [showError, setShowError] = useState(false);

    const user_role_input_change = (event) => {
        setInputValue(event.target.value);
        setShowError(false); // Hide the error message when the user starts typing
    };





    const [createAllChecked, setCreateAllChecked] = useState(false);


    const user_role_create_all_change = (isChecked) => {
        setCreateAllChecked(isChecked);

        if (isChecked) {
            // If "Create All" is checked, get the method IDs to check
            const methodIdsToCheck = filteredDisplayNames.map((method) => method.method_id);

            // Check the method IDs for "Create All"
            setSelectedMethods((prevSelectedMethods) => [...prevSelectedMethods, ...methodIdsToCheck]);
        } else {
            // If "Create All" is unchecked, clear selected checkboxes for "Create All" methods
            setSelectedMethods((prevSelectedMethods) => {
                // Keep the method_ids with method_sort === 0 when "Create All" is unchecked
                return prevSelectedMethods.filter((methodId) => {
                    const method = filteredDisplayNames.find((item) => item.method_id === methodId);
                    let keepMethod = !method;

                    // If "Edit All" is also checked, don't uncheck methods with method_sort === 3
                    if ((editAllChecked || deleteAllChecked || copyAllChecked || viewAllChecked || selectAllChecked) && method && (method.method_sort === 0 || method.method_sort === 2)) {
                        keepMethod = true;
                    }

                    return keepMethod;
                });
            });
        }
    };


    const filteredDisplayNames = usersRoleCreate
        .flatMap((roleCreate) => roleCreate.controllers)
        .flatMap((controllers) => controllers.display_names)
        .flatMap((display) => display.method_names)
        .filter((method) => [0, 1, 2, 4].includes(method.method_sort));

    console.log('Filtered Display Names create all:', filteredDisplayNames);




    const [viewAllChecked, setViewAllChecked] = useState(false);


    const user_role_view_all_change = (isChecked) => {
        setViewAllChecked(isChecked);

        if (isChecked) {
            // If "Create All" is checked, get the method IDs to check
            const methodIdsToCheck = filteredDisplayNamesViewAll.map((method) => method.method_id);

            // Check the method IDs for "Create All"
            setSelectedMethods((prevSelectedMethods) => [...prevSelectedMethods, ...methodIdsToCheck]);
        } else {
            // If "Create All" is unchecked, clear selected checkboxes for "Create All" methods
            setSelectedMethods((prevSelectedMethods) => {
                // Keep the method_ids with method_sort === 0 when "Create All" is unchecked
                return prevSelectedMethods.filter((methodId) => {
                    const method = filteredDisplayNamesViewAll.find((item) => item.method_id === methodId);
                    let keepMethod = !method;

                    // If "Edit All" is also checked, don't uncheck methods with method_sort === 3
                    if ((editAllChecked || deleteAllChecked || copyAllChecked || createAllChecked || selectAllChecked) && method && (method.method_sort === 0)) {
                        keepMethod = true;
                    }

                    return keepMethod;
                });
            });
        }
    };



    const filteredDisplayNamesViewAll = usersRoleCreate
        .flatMap((roleCreate) => roleCreate.controllers)
        .flatMap((controllers) => controllers.display_names)
        .flatMap((display) => display.method_names)
        .filter((method) => [0, 2].includes(method.method_sort));



    const [editAllChecked, setEditAllChecked] = useState(false);
    const user_role_edit_all_change = (isChecked) => {
        setEditAllChecked(isChecked);

        if (isChecked) {
            // If "Create All" is checked, get the method IDs to check
            const methodIdsToCheck = filteredDisplayNamesEditAll.map((method) => method.method_id);

            // Check the method IDs for "Create All"
            setSelectedMethods((prevSelectedMethods) => [...prevSelectedMethods, ...methodIdsToCheck]);
        } else {
            // If "Create All" is unchecked, clear selected checkboxes for "Create All" methods
            setSelectedMethods((prevSelectedMethods) => {
                // Keep the method_ids with method_sort === 0 when "Create All" is unchecked
                return prevSelectedMethods.filter((methodId) => {
                    const method = filteredDisplayNamesEditAll.find((item) => item.method_id === methodId);
                    let keepMethod = !method;

                    // If "Edit All" is also checked, don't uncheck methods with method_sort === 3
                    if ((viewAllChecked || deleteAllChecked || copyAllChecked || createAllChecked || selectAllChecked) && method && (method.method_sort === 0 || method.method_sort === 2)) {
                        keepMethod = true;
                    }

                    return keepMethod;
                });
            });
        }
    };
    const filteredDisplayNamesEditAll = usersRoleCreate
        .flatMap((roleCreate) => roleCreate.controllers)
        .flatMap((controllers) => controllers.display_names)
        .flatMap((display) => display.method_names)
        .filter((method) => [0, 3, 2].includes(method.method_sort));

    console.log('Filtered Display Names edit all:', filteredDisplayNamesViewAll);



    const [copyAllChecked, setCopyAllChecked] = useState(false);
    const user_role_copy_all_change = (isChecked) => {
        setCopyAllChecked(isChecked);

        if (isChecked) {
            // If "Create All" is checked, get the method IDs to check
            const methodIdsToCheck = filteredDisplayNamesCopyAll.map((method) => method.method_id);

            // Check the method IDs for "Create All"
            setSelectedMethods((prevSelectedMethods) => [...prevSelectedMethods, ...methodIdsToCheck]);
        } else {
            // If "Create All" is unchecked, clear selected checkboxes for "Create All" methods
            setSelectedMethods((prevSelectedMethods) => {
                // Keep the method_ids with method_sort === 0 when "Create All" is unchecked
                return prevSelectedMethods.filter((methodId) => {
                    const method = filteredDisplayNamesCopyAll.find((item) => item.method_id === methodId);
                    let keepMethod = !method;

                    // If "Edit All" is also checked, don't uncheck methods with method_sort === 3
                    if ((viewAllChecked || deleteAllChecked || editAllChecked || createAllChecked || selectAllChecked) && method && (method.method_sort === 0 || method.method_sort === 2)) {
                        keepMethod = true;
                    }

                    return keepMethod;
                });
            });
        }
    };
    const filteredDisplayNamesCopyAll = usersRoleCreate
        .flatMap((roleCreate) => roleCreate.controllers)
        .flatMap((controllers) => controllers.display_names)
        .flatMap((display) => display.method_names)
        .filter((method) => [0, 1, 2, 4].includes(method.method_sort));

    console.log('Filtered Display Names copy all:', filteredDisplayNamesViewAll);




    const [deleteAllChecked, setDeleteAllChecked] = useState(false);
    const user_role_delete_all_change = (isChecked) => {
        setDeleteAllChecked(isChecked);

        if (isChecked) {
            // If "Create All" is checked, get the method IDs to check
            const methodIdsToCheck = filteredDisplayNamesDeleteAll.map((method) => method.method_id);

            // Check the method IDs for "Create All"
            setSelectedMethods((prevSelectedMethods) => [...prevSelectedMethods, ...methodIdsToCheck]);
        } else {
            // If "Create All" is unchecked, clear selected checkboxes for "Create All" methods
            setSelectedMethods((prevSelectedMethods) => {
                // Keep the method_ids with method_sort === 0 when "Create All" is unchecked
                return prevSelectedMethods.filter((methodId) => {
                    const method = filteredDisplayNamesDeleteAll.find((item) => item.method_id === methodId);
                    let keepMethod = !method;

                    // If "Edit All" is also checked, don't uncheck methods with method_sort === 3
                    if ((viewAllChecked || copyAllChecked || editAllChecked || createAllChecked || selectAllChecked) && method && (method.method_sort === 0 || method.method_sort === 2)) {
                        keepMethod = true;
                    }

                    return keepMethod;
                });
            });
        }
    };
    const filteredDisplayNamesDeleteAll = usersRoleCreate
        .flatMap((roleCreate) => roleCreate.controllers)
        .flatMap((controllers) => controllers.display_names)
        .flatMap((display) => display.method_names)
        .filter((method) => [0, 2, 5].includes(method.method_sort));

    console.log('Filtered Display Names delete all:', filteredDisplayNamesViewAll);


    if (isLoading) {
        <div class=" d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    }




    const [selectAllPageGroup, setSelectAllPageGroup] = useState({});

    const user_role_select_all_page_group = (isChecked, pageGroupId) => {
        // Clone the existing selected methods
        const updatedSelectedMethods = [...selectedMethods];

        const allMethodIds = [];

        // Find the specific page_group
        const pageGroup = usersRoleCreate.find((group) => group.page_group_id === pageGroupId);

        if (isChecked) {
            // If "Select All" is checked, select all method_ids for the page_group
            pageGroup.controllers.forEach((controller) => {
                controller.display_names.forEach((display) => {
                    display.method_names.forEach((method) => {
                        const methodId = method.method_id;

                        if (!updatedSelectedMethods.includes(methodId)) {
                            updatedSelectedMethods.push(methodId);
                        }

                        allMethodIds.push(methodId);
                    });
                });
            });
        } else {
            // If "Select All" is unchecked, remove all method_ids for the page_group
            pageGroup.controllers.forEach((controller) => {
                controller.display_names.forEach((display) => {
                    display.method_names.forEach((method) => {
                        const methodId = method.method_id;

                        const methodIndex = updatedSelectedMethods.indexOf(methodId);
                        if (methodIndex !== -1) {
                            updatedSelectedMethods.splice(methodIndex, 1);
                        }
                    });
                });
            });
        }

        // Update the state for selected methods and page group selections
        setSelectedMethods(updatedSelectedMethods);
        setSelectAllPageGroup((prev) => ({
            ...prev,
            [pageGroupId]: isChecked,
        }));

        console.log(updatedSelectedMethods);
        console.log(selectAllPageGroup);
    };




    const [createAllPageGroup, setCreateAllPageGroup] = useState({});

    const user_role_create_all_page_group = (isChecked, pageGroupId) => {
        console.log(pageGroupId)
        const updatedSelectedMethods = [...selectedMethods];

        const allMethodIds = [];

        // Find the specific page_group
        const pageGroup = usersRoleCreate.find((group) => group.page_group_id === pageGroupId);

        if (isChecked) {
            // If "Create All" is checked, select all method_ids for the page_group with method_sort values 0, 1, 2, 4
            pageGroup.controllers.forEach((controller) => {
                controller.display_names.forEach((display) => {
                    display.method_names.forEach((method) => {
                        const methodId = method.method_id;
                        const methodSort = method.method_sort;

                        if ([0, 1, 2, 4].includes(methodSort) && !updatedSelectedMethods.includes(methodId)) {
                            updatedSelectedMethods.push(methodId);
                        }

                        allMethodIds.push(methodId);
                    });
                });
            });
        } else {
            // If "Create All" is unchecked, remove method_ids with method_sort values 0, 1, 2, and 4 for the page_group
            pageGroup.controllers.forEach((controller) => {
                controller.display_names.forEach((display) => {
                    display.method_names.forEach((method) => {
                        const methodId = method.method_id;
                        const methodSort = method.method_sort;

                        if ([0, 1, 2, 4].includes(methodSort)) {
                            const methodIndex = updatedSelectedMethods.indexOf(methodId);
                            if (methodIndex !== -1) {
                                updatedSelectedMethods.splice(methodIndex, 1);
                            }
                        }
                    });
                });
            });

            // Check if "Edit All" is checked for the same page group, and if so, add back methods with method_sort 0 and 2
            if (editAllPageGroup[pageGroupId] || viewAllPageGroup[pageGroupId] || deleteAllPageGroup[pageGroupId] || copyAllPageGroup[pageGroupId] || selectAllPageGroup[pageGroupId]) {
                pageGroup.controllers.forEach((controller) => {
                    controller.display_names.forEach((display) => {
                        display.method_names.forEach((method) => {
                            const methodId = method.method_id;
                            const methodSort = method.method_sort;

                            if ([0, 2].includes(methodSort) && !updatedSelectedMethods.includes(methodId)) {
                                updatedSelectedMethods.push(methodId);
                            }
                        });
                    });
                });
            }
        }

        // Update the state for selected methods and page group selections
        setSelectedMethods(updatedSelectedMethods);
        setCreateAllPageGroup((prev) => ({
            ...prev,
            [pageGroupId]: isChecked,
        }));

        console.log(updatedSelectedMethods);
        console.log(createAllPageGroup);
    };


    const [viewAllPageGroup, setViewAllPageGroup] = useState({});
    const user_role_view_all_page_group = (isChecked, pageGroupId) => {
        // Clone the existing selected methods
        const updatedSelectedMethods = [...selectedMethods];

        const allMethodIds = [];

        // Find the specific page_group
        const pageGroup = usersRoleCreate.find((group) => group.page_group_id === pageGroupId);

        if (isChecked) {
            // If "Create All" is checked, select all method_ids for the page_group with method_sort values 0, 1, 2, 4
            pageGroup.controllers.forEach((controller) => {
                controller.display_names.forEach((display) => {
                    display.method_names.forEach((method) => {
                        const methodId = method.method_id;
                        const methodSort = method.method_sort;

                        if ([0, 2].includes(methodSort) && !updatedSelectedMethods.includes(methodId)) {
                            updatedSelectedMethods.push(methodId);
                        }

                        allMethodIds.push(methodId);
                    });
                });
            });
        } else {
            // If "Create All" is unchecked, remove method_ids with method_sort values 0, 1, 2, and 4 for the page_group
            pageGroup.controllers.forEach((controller) => {
                controller.display_names.forEach((display) => {
                    display.method_names.forEach((method) => {
                        const methodId = method.method_id;
                        const methodSort = method.method_sort;

                        if ([0, 2].includes(methodSort)) {
                            const methodIndex = updatedSelectedMethods.indexOf(methodId);
                            if (methodIndex !== -1) {
                                updatedSelectedMethods.splice(methodIndex, 1);
                            }
                        }
                    });
                });
            });

            // Check if "Edit All" is checked for the same page group, and if so, add back methods with method_sort 0 and 2
            if (editAllPageGroup[pageGroupId] || createAllPageGroup[pageGroupId] || deleteAllPageGroup[pageGroupId] || copyAllPageGroup[pageGroupId] || selectAllPageGroup[pageGroupId]) {
                pageGroup.controllers.forEach((controller) => {
                    controller.display_names.forEach((display) => {
                        display.method_names.forEach((method) => {
                            const methodId = method.method_id;
                            const methodSort = method.method_sort;

                            if ([0].includes(methodSort) && !updatedSelectedMethods.includes(methodId)) {
                                updatedSelectedMethods.push(methodId);
                            }
                        });
                    });
                });
            }
        }

        // Update the state for selected methods and page group selections
        setSelectedMethods(updatedSelectedMethods);
        setViewAllPageGroup((prev) => ({
            ...prev,
            [pageGroupId]: isChecked,
        }));

        console.log(updatedSelectedMethods);
        console.log(createAllPageGroup);
    };


    const [editAllPageGroup, setEditAllPageGroup] = useState({});
    const user_role_edit_all_page_group = (isChecked, pageGroupId) => {
        // Clone the existing selected methods
        const updatedSelectedMethods = [...selectedMethods];

        const allMethodIds = [];

        // Find the specific page_group
        const pageGroup = usersRoleCreate.find((group) => group.page_group_id === pageGroupId);

        if (isChecked) {
            // If "Create All" is checked, select all method_ids for the page_group with method_sort values 0, 1, 2, 4
            pageGroup.controllers.forEach((controller) => {
                controller.display_names.forEach((display) => {
                    display.method_names.forEach((method) => {
                        const methodId = method.method_id;
                        const methodSort = method.method_sort;

                        if ([0, 2, 3].includes(methodSort) && !updatedSelectedMethods.includes(methodId)) {
                            updatedSelectedMethods.push(methodId);
                        }

                        allMethodIds.push(methodId);
                    });
                });
            });
        } else {
            // If "Create All" is unchecked, remove method_ids with method_sort values 0, 1, 2, and 4 for the page_group
            pageGroup.controllers.forEach((controller) => {
                controller.display_names.forEach((display) => {
                    display.method_names.forEach((method) => {
                        const methodId = method.method_id;
                        const methodSort = method.method_sort;

                        if ([0, 2, 3].includes(methodSort)) {
                            const methodIndex = updatedSelectedMethods.indexOf(methodId);
                            if (methodIndex !== -1) {
                                updatedSelectedMethods.splice(methodIndex, 1);
                            }
                        }
                    });
                });
            });

            // Check if "Edit All" is checked for the same page group, and if so, add back methods with method_sort 0 and 2
            if (createAllPageGroup[pageGroupId] || viewAllPageGroup[pageGroupId] || deleteAllPageGroup[pageGroupId] || copyAllPageGroup[pageGroupId] || selectAllPageGroup[pageGroupId]) {
                pageGroup.controllers.forEach((controller) => {
                    controller.display_names.forEach((display) => {
                        display.method_names.forEach((method) => {
                            const methodId = method.method_id;
                            const methodSort = method.method_sort;

                            if ([0, 2].includes(methodSort) && !updatedSelectedMethods.includes(methodId)) {
                                updatedSelectedMethods.push(methodId);
                            }
                        });
                    });
                });
            }
        }

        // Update the state for selected methods and page group selections
        setSelectedMethods(updatedSelectedMethods);
        setEditAllPageGroup((prev) => ({
            ...prev,
            [pageGroupId]: isChecked,
        }));

        console.log(updatedSelectedMethods);
        console.log(createAllPageGroup);
    };


    const [copyAllPageGroup, setCopyAllPageGroup] = useState({});
    const user_role_copy_all_page_group = (isChecked, pageGroupId) => {
        // Clone the existing selected methods
        const updatedSelectedMethods = [...selectedMethods];

        const allMethodIds = [];

        // Find the specific page_group
        const pageGroup = usersRoleCreate.find((group) => group.page_group_id === pageGroupId);

        if (isChecked) {
            // If "Create All" is checked, select all method_ids for the page_group with method_sort values 0, 1, 2, 4
            pageGroup.controllers.forEach((controller) => {
                controller.display_names.forEach((display) => {
                    display.method_names.forEach((method) => {
                        const methodId = method.method_id;
                        const methodSort = method.method_sort;

                        if ([0, 1, 2, 4].includes(methodSort) && !updatedSelectedMethods.includes(methodId)) {
                            updatedSelectedMethods.push(methodId);
                        }

                        allMethodIds.push(methodId);
                    });
                });
            });
        } else {
            // If "Create All" is unchecked, remove method_ids with method_sort values 0, 1, 2, and 4 for the page_group
            pageGroup.controllers.forEach((controller) => {
                controller.display_names.forEach((display) => {
                    display.method_names.forEach((method) => {
                        const methodId = method.method_id;
                        const methodSort = method.method_sort;

                        if ([0, 1, 2, 4].includes(methodSort)) {
                            const methodIndex = updatedSelectedMethods.indexOf(methodId);
                            if (methodIndex !== -1) {
                                updatedSelectedMethods.splice(methodIndex, 1);
                            }
                        }
                    });
                });
            });

            // Check if "Edit All" is checked for the same page group, and if so, add back methods with method_sort 0 and 2
            if (editAllPageGroup[pageGroupId] || viewAllPageGroup[pageGroupId] || deleteAllPageGroup[pageGroupId] || createAllPageGroup[pageGroupId] || selectAllPageGroup[pageGroupId]) {
                pageGroup.controllers.forEach((controller) => {
                    controller.display_names.forEach((display) => {
                        display.method_names.forEach((method) => {
                            const methodId = method.method_id;
                            const methodSort = method.method_sort;

                            if ([0, 2].includes(methodSort) && !updatedSelectedMethods.includes(methodId)) {
                                updatedSelectedMethods.push(methodId);
                            }
                        });
                    });
                });
            }
        }

        // Update the state for selected methods and page group selections
        setSelectedMethods(updatedSelectedMethods);
        setCopyAllPageGroup((prev) => ({
            ...prev,
            [pageGroupId]: isChecked,
        }));

        console.log(updatedSelectedMethods);
        console.log(createAllPageGroup);
    };



    const [deleteAllPageGroup, setDeleteAllPageGroup] = useState({});
    const user_role_delete_all_page_group = (isChecked, pageGroupId) => {
        // Clone the existing selected methods
        const updatedSelectedMethods = [...selectedMethods];

        const allMethodIds = [];

        // Find the specific page_group
        const pageGroup = usersRoleCreate.find((group) => group.page_group_id === pageGroupId);

        if (isChecked) {
            // If "Create All" is checked, select all method_ids for the page_group with method_sort values 0, 1, 2, 4
            pageGroup.controllers.forEach((controller) => {
                controller.display_names.forEach((display) => {
                    display.method_names.forEach((method) => {
                        const methodId = method.method_id;
                        const methodSort = method.method_sort;

                        if ([0, 2, 5].includes(methodSort) && !updatedSelectedMethods.includes(methodId)) {
                            updatedSelectedMethods.push(methodId);
                        }

                        allMethodIds.push(methodId);
                    });
                });
            });
        } else {
            // If "Create All" is unchecked, remove method_ids with method_sort values 0, 1, 2, and 4 for the page_group
            pageGroup.controllers.forEach((controller) => {
                controller.display_names.forEach((display) => {
                    display.method_names.forEach((method) => {
                        const methodId = method.method_id;
                        const methodSort = method.method_sort;

                        if ([0, 2, 5].includes(methodSort)) {
                            const methodIndex = updatedSelectedMethods.indexOf(methodId);
                            if (methodIndex !== -1) {
                                updatedSelectedMethods.splice(methodIndex, 1);
                            }
                        }
                    });
                });
            });

            // Check if "Edit All" is checked for the same page group, and if so, add back methods with method_sort 0 and 2
            if (createAllPageGroup[pageGroupId] || viewAllPageGroup[pageGroupId] || editAllPageGroup[pageGroupId] || copyAllPageGroup[pageGroupId] || selectAllPageGroup[pageGroupId]) {
                pageGroup.controllers.forEach((controller) => {
                    controller.display_names.forEach((display) => {
                        display.method_names.forEach((method) => {
                            const methodId = method.method_id;
                            const methodSort = method.method_sort;

                            if ([0, 2].includes(methodSort) && !updatedSelectedMethods.includes(methodId)) {
                                updatedSelectedMethods.push(methodId);
                            }
                        });
                    });
                });
            }
        }

        // Update the state for selected methods and page group selections
        setSelectedMethods(updatedSelectedMethods);
        setDeleteAllPageGroup((prev) => ({
            ...prev,
            [pageGroupId]: isChecked,
        }));

        console.log(updatedSelectedMethods);
        console.log(createAllPageGroup);
    };



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

    const handleChange = (event) => {

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
                                    <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Create User Role Access</h5>
                                    <div class="card-title card-header-color font-weight-bold mb-0  float-right"> <Link href={`/Admin/${filteredControllerName[0]?.controller_name}/${filteredControllerName[0]?.method_name}?page-group=${filteredControllerName[0]?.page_group}`} class="btn btn-sm btn-info">User role Access List</Link></div>
                                </div>
                                <div class="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                    (<small><sup><i class="text-danger fas fa-star"></i></sup></small>) field required
                                </div>			<div class="card-body">
                                    <form class=""
                                        onSubmit={user_role_create}
                                        autocomplete="off">
                                        <div class="form-group row">
                                            <label class="col-form-label font-weight-bold col-md-2 font-weight-bold">Role Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div class="col-md-6">
                                                <input type="text" name="role_name" class="form-control form-control-sm   " onChange={user_role_input_change} placeholder="Enter Role Name" />
                                                {showError && (
                                                    <div style={{ color: 'red' }}>Please Add a role name</div>
                                                )}
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-form-label font-weight-bold col-md-2 font-weight-bold ">Page List:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><br />
                                            <div class="col-md-10">
                                                <div class="w-100 mb-2">

                                                    <div className='mt-2'>
                                                        <div
                                                            style={{ width: '15%', fontSize: '15px' }} className="form-check form-check-inline w-15">
                                                            <input
                                                                className="form-check-input check_all head"
                                                                type="checkbox"
                                                                checked={selectAllChecked}
                                                                onChange={(e) => user_role_select_all_change(e.target.checked)}
                                                            />
                                                            <label className="form-check-label font-weight-bold" htmlFor="inlineCheckbox1">
                                                                Select All
                                                            </label>
                                                        </div>

                                                        <div
                                                            style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                            <input class="form-check-input create_method_all head" type="checkbox"
                                                                checked={createAllChecked}
                                                                onChange={(e) => user_role_create_all_change(e.target.checked)}

                                                            />


                                                            <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Create All <span class="badge badge-info" data-toggle="popover" title="" data-content="Double click to any 'create page text' for activating 'Default Dashboard' after Login." data-original-title="Default Page"><i class="fas fa-info-circle"></i></span></label>
                                                        </div>
                                                        <div
                                                            style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                            <input class="form-check-input list_method_all head" type="checkbox"
                                                                checked={viewAllChecked}
                                                                onChange={(e) => user_role_view_all_change(e.target.checked)}
                                                            />
                                                            <label class="form-check-label font-weight-bold" for="inlineCheckbox1">View All <span class="badge badge-info" data-toggle="popover" title="" data-content="Double click to any 'view/list page text' for activating 'Default Dashboard' after Login." data-original-title="Default Page"><i class="fas fa-info-circle"></i></span></label>
                                                        </div>
                                                        <div
                                                            style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                            <input class="form-check-input edit_method_all head" type="checkbox"

                                                                checked={editAllChecked}
                                                                onChange={(e) => user_role_edit_all_change(e.target.checked)}
                                                            />
                                                            <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Edit All</label>
                                                        </div>
                                                        <div
                                                            style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                            <input class="form-check-input copy_method_all head" type="checkbox"
                                                                checked={copyAllChecked}
                                                                onChange={(e) => user_role_copy_all_change(e.target.checked)}

                                                            />
                                                            <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Copy All</label>
                                                        </div>
                                                        <div
                                                            style={{ width: '16%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                            <input class="form-check-input delete_method_all head"
                                                                checked={deleteAllChecked}
                                                                onChange={(e) => user_role_delete_all_change(e.target.checked)}
                                                                type="checkbox" />
                                                            <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Delete All</label>
                                                        </div>
                                                    </div>


                                                </div>






                                                {

                                                    usersRoleCreate.map((roleCreate =>
                                                        <div key={roleCreate.id}>

                                                            <div
                                                                style={{ backgroundColor: '#4267b2' }}
                                                                class=" custom-card-header  rounded-top py-1  clearfix bg-gradient-primary text-white mt-3">
                                                                <h5 class="pl-2 card-title card-header-color font-weight-bold mb-0  float-left ">
                                                                    <strong>
                                                                        {formatString(roleCreate.page_group)}
                                                                    </strong>
                                                                </h5>
                                                                <br />

                                                                <div className='mt-2 p-1' >
                                                                    <div style={{ width: '15%', fontSize: '15px' }} className="form-check form-check-inline w-15">
                                                                        <input
                                                                            // id={`selectAll-${roleCreate.page_group_id}`}
                                                                            className="form-check-input check_all head"
                                                                            type="checkbox"
                                                                            checked={selectAllPageGroup[roleCreate.page_group_id] || false}
                                                                            onChange={(e) => user_role_select_all_page_group(e.target.checked, roleCreate.page_group_id)}
                                                                        />
                                                                        <label className="form-check-label font-weight-bold"
                                                                        //  htmlFor={`selectAll-${roleCreate.page_group_id}`}
                                                                        >
                                                                            Select All
                                                                        </label>
                                                                    </div>

                                                                    <div
                                                                        style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                                        <input
                                                                            id={`selectAll-${roleCreate.page_group_id}`}
                                                                            className="form-check-input check_all head"
                                                                            type="checkbox"
                                                                            checked={createAllPageGroup[roleCreate.page_group_id] || false}
                                                                            onChange={(e) => user_role_create_all_page_group(e.target.checked, roleCreate.page_group_id)}

                                                                        />


                                                                        <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Create All <span class="badge badge-info" data-toggle="popover" title="" data-content="Double click to any 'create page text' for activating 'Default Dashboard' after Login." data-original-title="Default Page"><i class="fas fa-info-circle"></i></span></label>
                                                                    </div>
                                                                    <div
                                                                        style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                                        <input
                                                                            id={`viewAll-${roleCreate.page_group_id}`}
                                                                            className="form-check-input check_all head"
                                                                            type="checkbox"
                                                                            checked={viewAllPageGroup[roleCreate.page_group_id] || false}
                                                                            onChange={(e) => user_role_view_all_page_group(e.target.checked, roleCreate.page_group_id)}



                                                                        />
                                                                        <label class="form-check-label font-weight-bold" for="inlineCheckbox1">View All <span class="badge badge-info" data-toggle="popover" title="" data-content="Double click to any 'view/list page text' for activating 'Default Dashboard' after Login." data-original-title="Default Page"><i class="fas fa-info-circle"></i></span></label>
                                                                    </div>
                                                                    <div
                                                                        style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                                        <input
                                                                            id={`editAll-${roleCreate.page_group_id}`}
                                                                            className="form-check-input check_all head"
                                                                            type="checkbox"
                                                                            checked={editAllPageGroup[roleCreate.page_group_id] || false}
                                                                            onChange={(e) => user_role_edit_all_page_group(e.target.checked, roleCreate.page_group_id)}

                                                                        />
                                                                        <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Edit All</label>
                                                                    </div>
                                                                    <div
                                                                        style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                                        <input
                                                                            id={`copyAll-${roleCreate.page_group_id}`}
                                                                            className="form-check-input check_all head"
                                                                            type="checkbox"
                                                                            checked={copyAllPageGroup[roleCreate.page_group_id] || false}
                                                                            onChange={(e) => user_role_copy_all_page_group(e.target.checked, roleCreate.page_group_id)}



                                                                        />
                                                                        <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Copy All</label>
                                                                    </div>
                                                                    <div
                                                                        style={{ width: '15%', fontSize: '15px' }} class="form-check form-check-inline w-15">
                                                                        <input
                                                                            id={`deleteAll-${roleCreate.page_group_id}`}
                                                                            className="form-check-input check_all head"
                                                                            type="checkbox"
                                                                            checked={deleteAllPageGroup[roleCreate.page_group_id] || false}
                                                                            onChange={(e) => user_role_delete_all_page_group(e.target.checked, roleCreate.page_group_id)}


                                                                        />
                                                                        <label class="form-check-label font-weight-bold" for="inlineCheckbox1">Delete All</label>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            {
                                                                roleCreate.controllers.map((controllers =>
                                                                    <div key={controllers.id} className=' ' style={{ borderBottom: '1px solid silver' }} >


                                                                        <div>

                                                                            {
                                                                                controllers.display_names.map((display =>


                                                                                    <div key={display.id} className="form-check form-check-inline w-15 py-2 "

                                                                                        style={{ width: '15%', fontWeight: '650', fontSize: '12px' }}                                                                                        >

                                                                                        {
                                                                                            display.display_name === '' &&
                                                                                            <p></p>
                                                                                        }

                                                                                        {
                                                                                            display.display_name !== '' &&
                                                                                            <>
                                                                                                <input

                                                                                                    name='check_box'
                                                                                                    id={`yourCheckboxId_${display.method_names[0].method_id}`} // Add this ID attribute
                                                                                                    className="form-check-input"
                                                                                                    type="checkbox"
                                                                                                    checked={selectedMethods.includes(display.method_names[0].method_id)}
                                                                                                    //  value={selectedMethods.includes(display.method_names[0].method_id)}
                                                                                                    onChange={(e) => user_role_checkbox_click(display.method_names[0].method_id, e.target.checked)}
                                                                                                />
                                                                                                <label
                                                                                                    style={{ marginTop: '7px' }}
                                                                                                    className={` ${doubleClickedDisplayName === display.display_name ? 'bg-danger text-white rounded px-2 ' : 'text-black'} `}
                                                                                                    onDoubleClick={() => user_role_default_page(display)}
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

                                                {
                                                    checkBoxError && <p className='text-danger'>{checkBoxError}</p>
                                                }
                                                <div className='mt-4'>

                                                    <div className='mb-0'>
                                                        <div className="form-check form-check-inline w-15 mr-5" style={{ width: '15%', fontWeight: '650', fontSize: '12px' }}>
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
                                                            <div className="form-group m-0">
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
                                                    <div className='m-0'>
                                                        <div className="form-check form-check-inline w-15 mr-5 m-0" style={{ fontWeight: '650', fontSize: '12px' }}>
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

                                                                <select id="selectField" className="form-control" value={otp_expire} onChange={handleChange}>
                                                                    {options}
                                                                </select>

                                                                <p>{otp_expire} Minutes</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                </div>
                                                <div class="form-group row mt-2">
                                                    <div class="col-sm-6">
                                                        <input
                                                            onClick={user_role_create}

                                                            type="button" disabled="" class="btn btn-sm btn-success submit" value="Submit" />
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        <input type="hidden" name="status" value='0' />
                                        <input type="hidden" name="default_page" value='0' />

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

export default UserRoleAccessCreates;