// 'use client'
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useCallback, useEffect, useState } from 'react';

// const AttendanceCreates = () => {
//     const [searchQuery, setSearchQuery] = useState([]);
//     const [itemName, setItemName] = useState('');
//     const [employee, setEmployee] = useState([]);
//     const [filteredDesignations, setFilteredDesignations] = useState([]);
//     const [filteredEmployees, setFilteredEmployees] = useState([]);
//     const [fromDate, setFromDate] = useState('');

//     const { data: branchAll = [], isLoading, refetch } = useQuery({
//         queryKey: ['branchAll'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const { data: smsSettings = [],  } = useQuery({
//         queryKey: ['smsSettings'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/smsSettings`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     console.log(smsSettings.find(sms => sms.sms_system === 1))
//     const attendanceSms = smsSettings.find(sms => sms.sms_system === 1)
//     // console.log(attendanceSms.e_attendance)

//     const { data: designations = [] } = useQuery({
//         queryKey: ['designations'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_all`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const { data: employees = [] } = useQuery({
//         queryKey: ['employees'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_all_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const handleBranchChange = (branchId) => {
//         setItemName(branchId);
//         setSearchQuery('');
//         const filteredDesignations = designations.filter(designation =>
//             employees.some(employee =>
//                 employee.branch_id === parseFloat(branchId) && employee.designation_id === designation.id
//             )
//         );
//         setFilteredDesignations(filteredDesignations);

//         const filteredEmployees = employees.filter(employee => employee.branch_id === parseFloat(branchId));
//         setFilteredEmployees(filteredEmployees);
//     };

//     const handleDesignationChange = (designationId) => {
//         setSearchQuery(designationId);

//         const filteredEmployees = employees.filter(employee =>
//             employee.branch_id === parseFloat(itemName) && employee.designation_id === parseFloat(designationId)
//         );
//         setFilteredEmployees(filteredEmployees);
//     };


//     console.log(filteredDesignations)
//     console.log(filteredEmployees)



//     const [searchResults, setSearchResults] = useState([])
//     const [error, setError] = useState([])
//     const [loading, setLoading] = useState(false)


//     const news_search = () => {
//         setLoading(true);
//         if (itemName === '') {
//             // setLoading(true);
//             alert('select a branch')
//             setLoading(false);
//             return
//         }
//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_search`, {
//             searchQuery, itemName, employee
//         })
//             .then(response => {
//                 setSearchResults(response.data);
//                 setCheckedItems('')
//                 setIsCheckedAll('')
//                 setLateDatetime('')
//                 setStartDatetime('')
//                 setWithAbsent('')
//                 setWithPresent('')
//                 setFromDate('')
//                 setError(null);
//                 setLoading(false);
//                 if (response.data.results == '') {
//                     alert('Nothing found!');
//                 }

//             })
//             .catch(error => {
//                 setError("An error occurred during search.", error);
//                 setSearchResults([]);
//             });
//     };




//     console.log('Search Results:', searchResults);



//     const [startDatetime, setStartDatetime] = useState('');
//     const [lateDatetime, setLateDatetime] = useState('');

//     const handleTimeChange = (event, setDatetime) => {
//         const timeValue = event.target.value;

//         // Get the current date
//         const currentDate = new Date();
//         const [hours, minutes] = timeValue.split(':');
//         const formattedDateTime = new Date(
//             currentDate.getFullYear(),
//             currentDate.getMonth(),
//             currentDate.getDate(),
//             hours,
//             minutes
//         );

//         // Convert to 12-hour time with AM/PM for display
//         const displayHours = formattedDateTime.getHours() % 12 || 12;
//         const displayMinutes = formattedDateTime.getMinutes().toString().padStart(2, '0');
//         const ampm = formattedDateTime.getHours() >= 12 ? 'PM' : 'AM';
//         const formattedTime = `${displayHours}:${displayMinutes} ${ampm}`;

//         setDatetime({ datetime: formattedDateTime.toISOString(), displayTime: formattedTime });
//     };

//     console.log(startDatetime)
//     console.log(lateDatetime)


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


//     const [formData, setFormData] = useState([
//         {
//             user_id: '',
//             created_by: userId,
//             attendance_date: '',
//             device_id: 'Online',
//             checktime: '',
//             unique_id: ''

//         }
//     ])


//     const [checkedItems, setCheckedItems] = useState({});
//     const [isCheckedAll, setIsCheckedAll] = useState(false);
//     const [checkedItemsData, setCheckedItemsData] = useState([]);
//     const [unCheckedItemsData, setUnCheckedItemsData] = useState([]);

//     const handleCheckChange = (uniqueId) => {
//         const updatedCheckedItems = {
//             ...checkedItems,
//             [uniqueId]: !checkedItems[uniqueId]
//         };

//         setCheckedItems(updatedCheckedItems);

//         // Update the selected and unselected data arrays
//         const selectedData = searchResults.filter(item => updatedCheckedItems[item.user_id]);
//         const unselectedData = searchResults.filter(item => !updatedCheckedItems[item.user_id]);

//         setCheckedItemsData(selectedData);
//         setUnCheckedItemsData(unselectedData);
//     };

//     const handleCheckAllChange = () => {
//         const newCheckedStatus = !isCheckedAll;
//         const newCheckedItems = {};
//         const newCheckedItemsData = [];
//         const newUnCheckedItemsData = [];

//         if (newCheckedStatus) {
//             searchResults.forEach((attendance) => {
//                 newCheckedItems[attendance.user_id] = true;
//                 newCheckedItemsData.push(attendance);
//             });
//         } else {
//             searchResults.forEach((attendance) => {
//                 newUnCheckedItemsData.push(attendance);
//             });
//         }

//         setCheckedItems(newCheckedItems);
//         setCheckedItemsData(newCheckedItemsData);
//         setUnCheckedItemsData(newUnCheckedItemsData);
//         setIsCheckedAll(newCheckedStatus);
//     };

//     console.log('checkedItems', checkedItems);
//     console.log('checkedItemsData', checkedItemsData);
//     console.log('unCheckedItemsData', unCheckedItemsData);



//     const { data: yearlyHolidays = [] } = useQuery({
//         queryKey: ['yearlyHolidays'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/yearly_holiday/yearly_holiday_all`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const formatDates = (date) => {
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = String(date.getFullYear());
//         return `${year}-${month}-${day}`;
//     };

//     const data = fromDate ? formatDates(fromDate) : '';
//     // const datas = startDatetime ? formatDates(startDatetime.datetime) : '';
//     // console.log(startDatetime.datetime.slice(0,10))
//     // console.log(fromDate ? formatDates(fromDate) : 'no data')

//     const foundHoliday = yearlyHolidays.filter(yearlyHoliday => 
//         yearlyHoliday.start_date.slice(0, 10) === data
//     );

//     if (foundHoliday) {
//         console.log('Holiday found:', foundHoliday);
//     } else {
//         console.log('Holiday not found.');
//     }

//     console.log(foundHoliday[0]?.holiday_category_name)

//     const { data: leaveAllApproved = [] } = useQuery({
//         queryKey: ['leaveAllApproved'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_details_list`)
//             const data = await res.json()
//             return data
//         }
//     });

// console.log(leaveAllApproved)



// const matchedLeave = leaveAllApproved.filter(leave => 
//     leave.leave_application_ids.some(application => 
//       application.leave_date.slice(0, 10) === data
//     )
//   );


// console.log(matchedLeave?.whose_leave); // true or false
// console.log(matchedLeave); // true or false

// const { data: absentList = [] } = useQuery({
//     queryKey: ['absentList'],
//     queryFn: async () => {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/absent/absent_all`)
//         const data = await res.json()
//         return data
//     }
// });

//     const router = useRouter()



//       const user_create = (event) => {
//         event.preventDefault();

//         if (foundHoliday.length > 0) {
//             console.log('This is holiday No Attendance')
//           return;
//         }

//         // Prepare data for checked items
//         const dataToSend = checkedItemsData.flatMap((item) => {
//           const entries = [];

//           // Add entry time record only if startDatetime.datetime is not empty
//           if (startDatetime.datetime !== undefined) {
//             entries.push({
//               user_id: item.user_id,
//               created_by: userId,
//               attendance_date: fromDate,
//               device_id: 'Online',
//               checktime: startDatetime.datetime,  // Entry Time
//               unique_id: item.unique_id
//             });
//           }

//           // Add exit time record only if lateDatetime.datetime is not empty
//           if (lateDatetime.datetime !== undefined) {
//             entries.push({
//               user_id: item.user_id,
//               created_by: userId,
//               attendance_date: fromDate,
//               device_id: 'Online',
//               checktime: lateDatetime.datetime,  // Exit Time
//               unique_id: item.unique_id
//             });
//           }

//           return entries;
//         });

//         console.log(dataToSend);

//         // Send dataToSend to the attendance API
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_create`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(dataToSend),
//         })
//           .then((response) => {
//             if (!response.ok) {
//               throw new Error('Failed to save attendance data');
//             }
//             return response.json();
//           })
//           .then((data) => {
//             console.log(data);
//             if (data && data.ok === true) {
//               if (typeof window !== 'undefined') {
//                 sessionStorage.setItem("message", "Data saved successfully!");
//               }
//               router.push('/Admin/attendance/attendance_all');
//             }
//             refetch();
//           })
//           .catch((error) => console.error(error));

//         // Extract `whose_leave` IDs
//         const leaveUserIds = matchedLeave.map((leave) => leave.whose_leave);

//         // Prepare and send data for unchecked items
//         const absentDataToSend = unCheckedItemsData
//           .filter((item) => {
//             const isOnLeave = leaveUserIds.includes(item.user_id);
//             const isAlreadyAbsent = absentList.some(absent => 
//               absent.user_id === item.user_id && absent.absent_date.slice(0, 10) === data
//             );
//             return !isOnLeave && !isAlreadyAbsent; // Exclude users on leave and already marked as absent
//           })
//           .map((item) => ({
//             user_id: item.user_id,
//             created_by: userId,
//             attendance_date: fromDate,
//             device_id: 'Online',
//             checktime: null,  // Assuming no specific checktime for absents
//             unique_id: item.unique_id,
//           }));

//         console.log(absentDataToSend);

//         if (absentDataToSend.length > 0) {
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/absent/absent_create`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(absentDataToSend),
//           })
//             .then((response) => {
//               if (!response.ok) {
//                 throw new Error('Failed to save absent data');
//               }
//               return response.json();
//             })
//             .then((data) => {
//               console.log(data);
//               if (data && data.ok === true) {
//                 // Handle success if needed
//               }
//               refetch(); // Refetch data if needed
//             })
//             .catch((error) => console.error(error));
//         }
//       };




//     // const user_create = (event) => {
//     //     event.preventDefault();

//     //     if (foundHoliday.length > 0) {
//     //         return;
//     //     }

//     //     // Prepare data for checked items
//     //     const dataToSend = checkedItemsData.flatMap((item) => {
//     //         const entries = [];

//     //         // Add entry time record only if startDatetime.datetime is not empty
//     //         if (startDatetime.datetime !== undefined) {
//     //             entries.push({
//     //                 user_id: item.user_id,
//     //                 created_by: userId,
//     //                 attendance_date: fromDate,
//     //                 device_id: 'Online',
//     //                 checktime: startDatetime.datetime,  // Entry Time
//     //                 unique_id: item.unique_id
//     //             });
//     //         }

//     //         // Add exit time record only if lateDatetime.datetime is not empty
//     //         if (lateDatetime.datetime !== undefined) {
//     //             entries.push({
//     //                 user_id: item.user_id,
//     //                 created_by: userId,
//     //                 attendance_date: fromDate,
//     //                 device_id: 'Online',
//     //                 checktime: lateDatetime.datetime,  // Exit Time
//     //                 unique_id: item.unique_id
//     //             });
//     //         }

//     //         return entries;
//     //     });

//     //     console.log(dataToSend);

//     //     // Send dataToSend to the attendance API
//     //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_create`, {
//     //         method: 'POST',
//     //         headers: {
//     //             'Content-Type': 'application/json',
//     //         },
//     //         body: JSON.stringify(dataToSend),
//     //     })
//     //     .then((response) => {
//     //         if (!response.ok) {
//     //             throw new Error('Failed to save attendance data');
//     //         }
//     //         return response.json();  // Ensure you return the parsed JSON
//     //     })
//     //     .then((data) => {
//     //         console.log(data);
//     //         if (data && data.ok === true) {
//     //             if (typeof window !== 'undefined') {
//     //                 sessionStorage.setItem("message", "Data saved successfully!");
//     //             }
//     //             // router.push('/Admin/attendance/attendance_all');
//     //         }
//     //         refetch(); // Refetch data if needed
//     //     })
//     //     .catch((error) => console.error(error));

//     //     // Extract `whose_leave` IDs
//     //     const leaveUserIds = matchedLeave.map((leave) => leave.whose_leave);

//     //     // Prepare and send data for unchecked items
//     //     const absentDataToSend = unCheckedItemsData
//     //         .filter((item) => !leaveUserIds.includes(item.user_id)) // Exclude users on leave
//     //         .map((item) => ({
//     //             user_id: item.user_id,
//     //             created_by: userId,
//     //             attendance_date: fromDate,
//     //             device_id: 'Online',
//     //             checktime: null,  // Assuming no specific checktime for absents
//     //             unique_id: item.unique_id,
//     //         }));

//     //     console.log(absentDataToSend);

//     //     if (absentDataToSend.length > 0) {
//     //         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/absent/absent_create`, {
//     //             method: 'POST',
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //             },
//     //             body: JSON.stringify(absentDataToSend),
//     //         })
//     //         .then((response) => {
//     //             if (!response.ok) {
//     //                 throw new Error('Failed to save absent data');
//     //             }
//     //             return response.json();  // Ensure you return the parsed JSON
//     //         })
//     //         .then((data) => {
//     //             console.log(data);
//     //             if (data && data.ok === true) {
//     //                 // Handle success if needed
//     //             }
//     //             refetch(); // Refetch data if needed
//     //         })
//     //         .catch((error) => console.error(error));
//     //     }
//     // };

//     // const user_create = (event) => {
//     //     event.preventDefault();

//     //     if (foundHoliday.length > 0) {
//     //         return;
//     //     }

//     //     // Prepare data for checked items
//     //     const dataToSend = checkedItemsData.flatMap((item) => {
//     //         const entries = [];

//     //         // Add entry time record only if startDatetime.datetime is not empty
//     //         if (startDatetime.datetime !== undefined) {
//     //             entries.push({
//     //                 user_id: item.user_id,
//     //                 created_by: userId,
//     //                 attendance_date: fromDate,
//     //                 device_id: 'Online',
//     //                 checktime: startDatetime.datetime,  // Entry Time
//     //                 unique_id: item.unique_id
//     //             });
//     //         }

//     //         // Add exit time record only if lateDatetime.datetime is not empty
//     //         if (lateDatetime.datetime !== undefined) {
//     //             entries.push({
//     //                 user_id: item.user_id,
//     //                 created_by: userId,
//     //                 attendance_date: fromDate,
//     //                 device_id: 'Online',
//     //                 checktime: lateDatetime.datetime,  // Exit Time
//     //                 unique_id: item.unique_id
//     //             });
//     //         }

//     //         return entries;
//     //     });

//     //     console.log(dataToSend);

//     //     // Send dataToSend to the attendance API
//     //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_create`, {
//     //         method: 'POST',
//     //         headers: {
//     //             'Content-Type': 'application/json',
//     //         },
//     //         body: JSON.stringify(dataToSend),
//     //     })
//     //     .then((response) => {
//     //         if (!response.ok) {
//     //             throw new Error('Failed to save attendance data');
//     //         }
//     //         return response.json();  // Ensure you return the parsed JSON
//     //     })
//     //     .then((data) => {
//     //         console.log(data);
//     //         if (data && data.ok === true) {
//     //             if (typeof window !== 'undefined') {
//     //                 sessionStorage.setItem("message", "Data saved successfully!");
//     //             }
//     //             // router.push('/Admin/attendance/attendance_all');
//     //         }
//     //         refetch(); // Refetch data if needed
//     //     })
//     //     .catch((error) => console.error(error));

//     //     // Prepare and send data for unchecked items
//     //     const absentDataToSend = unCheckedItemsData.map((item) => ({
//     //         user_id: item.user_id,
//     //         created_by: userId,
//     //         attendance_date: fromDate,
//     //         device_id: 'Online',
//     //         checktime: null,  // Assuming no specific checktime for absents
//     //         unique_id: item.unique_id,

//     //     }));

//     //     console.log(absentDataToSend);

//     //     if (unCheckedItemsData.length > 0) {
//     //         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/absent/absent_create`, {
//     //             method: 'POST',
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //             },
//     //             body: JSON.stringify(absentDataToSend),
//     //         })
//     //         .then((response) => {
//     //             if (!response.ok) {
//     //                 throw new Error('Failed to save absent data');
//     //             }
//     //             return response.json();  // Ensure you return the parsed JSON
//     //         })
//     //         .then((data) => {
//     //             console.log(data);
//     //             if (data && data.ok === true) {
//     //                 // Handle success if needed
//     //             }
//     //             refetch(); // Refetch data if needed
//     //         })
//     //         .catch((error) => console.error(error));
//     //     }
//     // };

//     // const user_create = (event) => {
//     //     event.preventDefault();

//     //     if( foundHoliday.length > 0){

//     //         return
//     //     }

//     //     const uncehckData = unCheckedItemsData



//     //     const dataToSend = checkedItemsData.flatMap((item) => {
//     //         const entries = [];

//     //         // Add entry time record only if startDatetime.datetime is not empty
//     //         if (startDatetime.datetime !== undefined) {
//     //             entries.push({
//     //                 user_id: item.user_id,
//     //                 created_by: userId,
//     //                 attendance_date: fromDate,
//     //                 device_id: 'Online',
//     //                 checktime: startDatetime.datetime,  // Entry Time
//     //                 unique_id: item.unique_id
//     //             });
//     //         }

//     //         // Add exit time record only if lateDatetime.datetime is not empty
//     //         if (lateDatetime.datetime !== undefined) {
//     //             entries.push({
//     //                 user_id: item.user_id,
//     //                 created_by: userId,
//     //                 attendance_date: fromDate,
//     //                 device_id: 'Online',
//     //                 checktime: lateDatetime.datetime,  // Exit Time
//     //                 unique_id: item.unique_id
//     //             });
//     //         }
//     // console.log(entries)
//     //         return entries;
//     //     });

//     //     console.log(dataToSend);
//     //     // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_create

//     //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_create`, {
//     //         method: 'POST',
//     //         headers: {
//     //             'content-type': 'application/json',
//     //         },
//     //         body: JSON.stringify(dataToSend),
//     //     })
//     //     .then((response) => {
//     //         refetch();
//     //         return response.json();  // Ensure you return the parsed JSON
//     //     })
//     //     .then((data) => {
//     //         console.log(data);
//     //         if (data && data.ok === true) {
//     //             if (typeof window !== 'undefined') {
//     //                 sessionStorage.setItem("message", "Data saved successfully!");
//     //             }
//     //             router.push('/Admin/attendance/attendance_all');
//     //         }
//     //         refetch(); // Refetch data if needed
//     //     })
//     //     .catch((error) => console.error(error));
//     // };


//     const formatDate = (date) => {
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = String(date.getFullYear());
//         return `${day}-${month}-${year}`;
//     };
//     const handleTextInputClick = () => {
//         document.getElementById('dateInputFrom').showPicker();
//     };

//     const handleDateChangeFrom = (event) => {
//         const selectedDate = new Date(event.target.value);
//         setFromDate(selectedDate);
//     };


//     // useEffect(() => {
//     //     const currentDate = new Date();
//     //     setFromDate(currentDate);

//     // }, []);

//     const generateOTP = () => {
//         const otp = Math.floor(100000 + Math.random() * 900000);
//         return otp.toString();
//     };
// console.log(checkedItemsData)


// const formatDateAmPm = (inputDate) => {
//     const date = new Date(inputDate);

//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');

//     let hours = date.getUTCHours();
//     const minutes = String(date.getUTCMinutes()).padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';

//     hours = hours % 12;
//     hours = hours ? String(hours).padStart(2, '0') : '12'; // the hour '0' should be '12'

//     return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
// };

//     const quickApi = '7ae89887eac6055a2b9adc494ca3b902';

//     const [withPresent, setWithPresent] = useState(false);
//     const [withAbsent, setWithAbsent] = useState(false);



//     const sendOtpToAllEmployees = () => {
//         if (!withPresent && !withAbsent) {
//             console.log('No SMS will be sent.');
//             return;
//         }
//         if (foundHoliday.length > 0) {
//             return;
//         }

//         const employeeAttendanceSmsTemplate = attendanceSms.e_attendance
//         const employeeAbsentSmsTemplate = attendanceSms.te_absence

//         checkedItemsData.forEach((employee) => {
//             if (withPresent && checkedItems[employee.user_id]) {
//                 const otp = generateOTP();
//                 const currentDate = new Date();
//                 const date = currentDate.toLocaleDateString();
//                 const smsTime = currentDate.toLocaleTimeString();

//                 // Replace placeholders with actual data
//                 let msg = employeeAttendanceSmsTemplate
//                     .replace('[[company_name]]', employee.company_name || 'No Company')
//                     .replace('[[full_name]]', employee.full_name)
//                     .replace('[[employee_id]]', employee.unique_id)
//                     .replace('[[designation]]', employee.designation_name)
//                     .replace('[[date]]', date)
//                     .replace('[[in_time]]', formatDateAmPm(startDatetime.datetime))
//                     .replace('[[sms_time]]', smsTime);

//                 axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
//                     quick_api: quickApi,
//                     mobile: employee.mobile,
//                     msg: msg,
//                 })
//                     .then(response => {
//                         console.log(`OTP sent to ${employee.full_name} (${employee.mobile}):`, response.data);
//                     })
//                     .catch(error => {
//                         console.error(`Failed to send OTP to ${employee.full_name} (${employee.mobile}):`, error);
//                     });
//             }
//         });

//         const leaveUserIds = matchedLeave.map((leave) => leave.whose_leave);

//         // Prepare and send data for unchecked items
//         const absentDataToSend = unCheckedItemsData
//           .filter((item) => {
//             const isOnLeave = leaveUserIds.includes(item.user_id);
//             const isAlreadyAbsent = absentList.some(absent => 
//               absent.user_id === item.user_id && absent.absent_date.slice(0, 10) === data
//             );
//             return !isOnLeave && !isAlreadyAbsent; // Exclude users on leave and already marked as absent
//           })

// console.log(absentDataToSend)

// absentDataToSend.forEach((employee) => {
//             if (withAbsent && !checkedItems[employee.user_id]) {
//                 const otp = generateOTP();
//                 const currentDate = new Date();
//                 const date = currentDate.toLocaleDateString();
//                 const smsTime = currentDate.toLocaleTimeString();

//                 // Replace placeholders with actual data for absent employees
//                 let msg = employeeAbsentSmsTemplate
//                     .replace('[[company_name]]', employee.company_name || 'No Company')
//                     .replace('[[full_name]]', employee.full_name)
//                     .replace('[[employee_id]]', employee.unique_id)
//                     .replace('[[employee_designation]]', employee.designation_name)
//                     .replace('[[absent_date]]', date)               
//                     .replace('[[sms_time]]', smsTime);

//                 axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
//                     quick_api: quickApi,
//                     mobile: employee.mobile,
//                     msg: msg,
//                 })
//                     .then(response => {
//                         console.log(`OTP sent to ${employee.full_name} (${employee.mobile}):`, response.data);
//                     })
//                     .catch(error => {
//                         console.error(`Failed to send OTP to ${employee.full_name} (${employee.mobile}):`, error);
//                     });
//             }
//         });
//     };
// //     const sendOtpToAllEmployees = () => {
// //         if (!withPresent && !withAbsent) {
// //             console.log('No SMS will be sent.');
// //             return;
// //         }
// //         if (foundHoliday.length > 0) {
// //             return;
// //         }

// //         const employeeAttendanceSmsTemplate = attendanceSms.e_attendance

// //         checkedItemsData.forEach((employee) => {
// //             if (withPresent && checkedItems[employee.user_id]) {
// //                 const otp = generateOTP();
// //                 const currentDate = new Date();
// //                 const date = currentDate.toLocaleDateString();
// //                 const smsTime = currentDate.toLocaleTimeString();

// //                 // Replace placeholders with actual data
// //                 let msg = employeeAttendanceSmsTemplate
// //                     .replace('[[company_name]]', employee.company_name || 'No Company')
// //                     .replace('[[full_name]]', employee.full_name)
// //                     .replace('[[employee_id]]', employee.unique_id)
// //                     .replace('[[designation]]', employee.designation_name)
// //                     .replace('[[date]]', date)
// //                     .replace('[[in_time]]', formatDateAmPm(startDatetime.datetime))
// //                     .replace('[[sms_time]]', smsTime);

// //                 axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
// //                     quick_api: quickApi,
// //                     mobile: employee.mobile,
// //                     msg: msg,
// //                 })
// //                     .then(response => {
// //                         console.log(`OTP sent to ${employee.full_name} (${employee.mobile}):`, response.data);
// //                     })
// //                     .catch(error => {
// //                         console.error(`Failed to send OTP to ${employee.full_name} (${employee.mobile}):`, error);
// //                     });
// //             }
// //         });

// //         const leaveUserIds = matchedLeave.map((leave) => leave.whose_leave);

// //         // Prepare and send data for unchecked items
// //         const absentDataToSend = unCheckedItemsData
// //           .filter((item) => {
// //             const isOnLeave = leaveUserIds.includes(item.user_id);
// //             const isAlreadyAbsent = absentList.some(absent => 
// //               absent.user_id === item.user_id && absent.absent_date.slice(0, 10) === data
// //             );
// //             return !isOnLeave && !isAlreadyAbsent; // Exclude users on leave and already marked as absent
// //           })

// // console.log(absentDataToSend)
// // absentDataToSend.forEach((employee) => {
// //             if (withAbsent && !checkedItems[employee.user_id]) {
// //                 const otp = generateOTP();
// //                 const currentDate = new Date();
// //                 const date = currentDate.toLocaleDateString();
// //                 const smsTime = currentDate.toLocaleTimeString();

// //                 // Replace placeholders with actual data for absent employees
// //                 let msg = employeeAttendanceSmsTemplate
// //                     .replace('[[company_name]]', employee.company_name || 'No Company')
// //                     .replace('[[full_name]]', employee.full_name)
// //                     .replace('[[employee_id]]', employee.unique_id)
// //                     .replace('[[designation]]', employee.designation_name)
// //                     .replace('[[date]]', date)
// //                     .replace('[[in_time]]', 'N/A') // Assuming there's no in-time for absent employees
// //                     .replace('[[sms_time]]', smsTime);

// //                 axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
// //                     quick_api: quickApi,
// //                     mobile: employee.mobile,
// //                     msg: msg,
// //                 })
// //                     .then(response => {
// //                         console.log(`OTP sent to ${employee.full_name} (${employee.mobile}):`, response.data);
// //                     })
// //                     .catch(error => {
// //                         console.error(`Failed to send OTP to ${employee.full_name} (${employee.mobile}):`, error);
// //                     });
// //             }
// //         });
// //     };


//     // const sendOtpToAllEmployees = () => {
//     //     if (!withPresent && !withAbsent) {
//     //         console.log('No SMS will be sent.');
//     //         return;
//     //     }
//     //     if( foundHoliday.length > 0){

//     //         return
//     //     }

//     //     const employeeAttendanceSms = attendanceSms.e_attendance


//     //     checkedItemsData.forEach((employee) => {
//     //         if (withPresent && checkedItems[employee.user_id]) {
//     //             // Send OTP to checked employees if 'With Present' is checked
//     //             const otp = generateOTP();
//     //             axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
//     //                 quick_api: quickApi,
//     //                 mobile: employee.mobile,
//     //                 msg: `You Are Present`,
//     //             })
//     //                 .then(response => {
//     //                     console.log(`OTP sent to ${employee.full_name} (${employee.mobile}):`, response.data);
//     //                 })
//     //                 .catch(error => {
//     //                     console.error(`Failed to send OTP to ${employee.full_name} (${employee.mobile}):`, error);
//     //                 });
//     //         }


//     //     });

//     //     unCheckedItemsData.forEach((employee) => {
//     //         if (withAbsent && !checkedItems[employee.user_id]) {
//     //             // Send OTP to checked employees if 'With Present' is checked
//     //             const otp = generateOTP();
//     //             axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
//     //                 quick_api: quickApi,
//     //                 mobile: employee.mobile,
//     //                 msg: `You Are Absent`,
//     //             })
//     //                 .then(response => {
//     //                     console.log(`OTP sent to ${employee.full_name} (${employee.mobile}):`, response.data);
//     //                 })
//     //                 .catch(error => {
//     //                     console.error(`Failed to send OTP to ${employee.full_name} (${employee.mobile}):`, error);
//     //                 });
//     //         }

//     //     });
//     // };






//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className="col-12 p-4">
//                     <div className='card mb-4'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Online Attendance</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/attendance/attendance_all?page_group=`} className="btn btn-sm btn-info">Back To Attendance List</Link>
//                                     </div>
//                                 </div>
//                                 <div className="card-body">
//                                     <form>
//                                         <div className="col-md-10 offset-md-1">
//                                             <div className="form-group row student">
//                                                 <label className="col-form-label col-md-2 font-weight-bold">Branch Name:</label>
//                                                 <div className="col-md-4">
//                                                     <select required="" value={itemName} onChange={(e) => handleBranchChange(e.target.value)} name="branch_id" className="form-control form-control-sm mb-2" id="branch_id">
//                                                         <option value=''>Select Branch</option>
//                                                         {branchAll.map((branch) => (
//                                                             <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                                 <label className="col-form-label col-md-2 font-weight-bold">Designation Name:</label>
//                                                 <div className="col-md-4">
//                                                     <select required="" value={searchQuery} onChange={(e) => handleDesignationChange(e.target.value)} name="designation_id" className="form-control form-control-sm mb-2" id="designation_id">
//                                                         <option value=''>Select Designation</option>
//                                                         {filteredDesignations.map((designation) => (
//                                                             <option key={designation.id} value={designation.id}>{designation.designation_name}</option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                             </div>
//                                             <div className="form-group row student">
//                                                 <label className="col-form-label col-md-2 font-weight-bold">Employee:</label>
//                                                 <div className="col-md-4">
//                                                     <select required="" value={employee} onChange={(e) => setEmployee(e.target.value)} name="employee_id" className="form-control form-control-sm mb-2" id="employee_id">
//                                                         <option value=''>Select Employee</option>
//                                                         {filteredEmployees.map((employee) => (
//                                                             <option key={employee.id} value={employee.user_id}>{employee.full_name}</option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                             </div>
//                                             <div className="form-group row">
//                                                 <div className="offset-md-2 col-md-6 float-left">
//                                                     <input
//                                                         onClick={news_search}
//                                                         type="button" name="search" className="btn btn-sm btn-info search_btn mr-2" value="Search" />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </form>
//                                     <div className="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
//                                         <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>



//                     {loading ? <div className='text-center'>
//                         <div className='  text-center text-dark'
//                         >
//                             <FontAwesomeIcon style={{
//                                 height: '33px',
//                                 width: '33px',
//                             }} icon={faSpinner} spin />
//                         </div>
//                     </div>


//                         :

//                         searchResults?.length > 0 ? (
//                             <div className='card'>
//                                 <div className="body-content bg-light">
//                                     <div className="border-primary shadow-sm border-0">
//                                         <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                             <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Online Employee Attendance</h5>

//                                         </div>
// <div className='px-4'>

//                                         {
//                         foundHoliday.length > 0 ?

//                         <div className="alert alert-danger  mt-2">
//                             Today {data}, {foundHoliday[0]?.holiday_category_name} . You Can't Take Attendance Today

//                         </div>
//                         :
//                         ''
//                     }
// </div>

//                                         <div class="card-body" >

//                                             <form onSubmit={user_create}>
//                                                 <div className="col-md-10 offset-md-1">
//                                                     <div className="form-group row student">
//                                                         <label className="col-form-label col-md-2 font-weight-bold">Present Date:</label>
//                                                         <div className="col-md-4">

//                                                             <input
//                                                                 className="form-control form-control-sm"
//                                                                 type="text"
//                                                                 id="fromDate"
//                                                                  placeholder='dd--mm--yyyy'
//                                                                 value={fromDate ? formatDate(fromDate) : ''}
//                                                                 onClick={handleTextInputClick}
//                                                                 readOnly
//                                                             />
//                                                             <input
//                                                                 type="date"
//                                                                 id="dateInputFrom"

//                                                                 value={fromDate ? fromDate.toString().split('T')[0] : ''}
//                                                                 onChange={handleDateChangeFrom}
//                                                                 style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
//                                                             />


//                                                         </div>


//                                                         <label className="col-form-label col-md-2 font-weight-bold">Entry Time:</label>
//                                                         <div className="col-md-4">
//                                                             <input
//                                                                 type="text"
//                                                                 readOnly
//                                                                 value={startDatetime.displayTime}
//                                                                 name='start_time'
//                                                                 onClick={() => document.getElementById('dateInput-n1').showPicker()}
//                                                                 placeholder="HH:MM"
//                                                                 className="form-control form-control-sm mb-2"
//                                                                 style={{ display: 'inline-block' }}
//                                                             />
//                                                             <input
//                                                                 type="time"
//                                                                 id="dateInput-n1"
//                                                                 onChange={(e) => handleTimeChange(e, (datetime) => setStartDatetime(datetime))}
//                                                                 style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                     <div className="form-group row student">
//                                                         <label className="col-form-label col-md-2 font-weight-bold">Exit Time:</label>
//                                                         <div className="col-md-4">
//                                                             <input
//                                                                 type="text"
//                                                                 readOnly
//                                                                 value={lateDatetime.displayTime}
//                                                                 name='late_time'
//                                                                 onClick={() => document.getElementById('dateInput-n2').showPicker()}
//                                                                 placeholder="HH:MM"
//                                                                 className="form-control form-control-sm mb-2"
//                                                                 style={{ display: 'inline-block' }}
//                                                             />
//                                                             <input
//                                                                 type="time"
//                                                                 id="dateInput-n2"
//                                                                 onChange={(e) => handleTimeChange(e, (datetime) => setLateDatetime(datetime))}
//                                                                 style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                             />
//                                                         </div>


//                                                         <div className="form-group grid">
//                                                             <div className='d-flex'>
//                                                                 <label className="col-form-label font-weight-bold col-md-9">With Present Sms:</label>
//                                                                 <div className="col-md-4 mt-2">
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         name="withPresentYes"
//                                                                         id="withPresentYes"
//                                                                         checked={withPresent}
//                                                                         onChange={(e) => setWithPresent(e.target.checked)}
//                                                                     />
//                                                                     <span>Yes</span>
//                                                                 </div>
//                                                             </div>
//                                                             <div className='d-flex m-0'>
//                                                                 <label className="col-form-label font-weight-bold col-md-9">With Absent Sms:</label>
//                                                                 <div className="col-md-4 mt-2">
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         name="withFutureYes"
//                                                                         id="withFutureYes"
//                                                                         checked={withAbsent}
//                                                                         onChange={(e) => setWithAbsent(e.target.checked)}
//                                                                     />
//                                                                     <span>Yes</span>
//                                                                 </div>
//                                                             </div>
//                                                         </div>

//                                                     </div>
//                                                     <div className="form-group row">

//                                                         <div className="offset-md-2 col-md-6 float-left">

//                                                             <button onClick={sendOtpToAllEmployees} className="btn btn-sm btn-success">
//                                                                 Submit
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div class="table-responsive">
//                                                     <table id='mytable' className="table table-bordered table-hover table-striped table-sm">
//                                                         <thead>
//                                                             <tr>
//                                                                 <th>
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         checked={isCheckedAll}
//                                                                         onChange={handleCheckAllChange}
//                                                                     />
//                                                                 </th>
//                                                                 <th >Employee ID</th>
//                                                                 <th > ID</th>
//                                                                 <th >Name</th>
//                                                                 <th >Designation</th>
//                                                             </tr>
//                                                         </thead>
//                                                         <tbody>
//                                                             {searchResults.map((attendances, i) => (
//                                                                 <tr key={i}>
//                                                                     <td>
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             checked={checkedItems[attendances.user_id] || false}
//                                                                             onChange={() => handleCheckChange(attendances.user_id)}
//                                                                         />
//                                                                     </td>
//                                                                     <td>{attendances.unique_id}</td>
//                                                                     <td>{attendances.user_id}</td>
//                                                                     <td>{attendances.full_name}</td>
//                                                                     <td>{attendances.designation_name}</td>
//                                                                 </tr>
//                                                             ))
//                                                             }
//                                                         </tbody>
//                                                     </table>
//                                                 </div>
//                                             </form>
//                                         </div>

//                                     </div>
//                                 </div>
//                             </div>
//                         ) :
//                             <>
//                             </>
//                     }
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AttendanceCreates;





//     // const [checkedItems, setCheckedItems] = useState({});
//     // const [isCheckedAll, setIsCheckedAll] = useState(false);
//     // const [checkedItemsData, setCheckedItemsData] = useState([]);


//     // const handleCheckChange = (uniqueId) => {
//     //     const updatedCheckedItems = {
//     //         ...checkedItems,
//     //         [uniqueId]: !checkedItems[uniqueId]
//     //     };

//     //     setCheckedItems(updatedCheckedItems);

//     //     // Update the selected data array
//     //     const selectedData = searchResults.filter(item => updatedCheckedItems[item.user_id]);
//     //     setCheckedItemsData(selectedData);
//     // };
//     // const handleCheckAllChange = () => {
//     //     const newCheckedStatus = !isCheckedAll;
//     //     const newCheckedItems = {};
//     //     const newCheckedItemsData = [];

//     //     if (newCheckedStatus) {
//     //         searchResults.forEach((attendance) => {
//     //             newCheckedItems[attendance.user_id] = true;
//     //             newCheckedItemsData.push(attendance);
//     //         });
//     //     }

//     //     setCheckedItems(newCheckedItems);
//     //     setCheckedItemsData(newCheckedItemsData);
//     //     setIsCheckedAll(newCheckedStatus);
//     // };



//     // console.log('checkedItems', checkedItems)
//     // console.log('checkedItemsData', checkedItemsData)


//     // const user_create = (event) => {
//     //     event.preventDefault();
//     //     const dataToSend = checkedItemsData.flatMap((item) => {
//     //         return [
//     //             {
//     //                 user_id: item.user_id,
//     //                 created_by: userId,
//     //                 attendance_date: fromDate,
//     //                 device_id: 'Online',
//     //                 checktime: startDatetime.datetime,  // Entry Time
//     //                 unique_id: item.unique_id
//     //             },
//     //             {
//     //                 user_id: item.user_id,
//     //                 created_by: userId,
//     //                 attendance_date: fromDate,
//     //                 device_id: 'Online',
//     //                 checktime: lateDatetime.datetime,  // Exit Time
//     //                 unique_id: item.unique_id
//     //             }
//     //         ];
//     //     });

//     //     console.log(dataToSend)

//     //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_create`, {
//     //         method: 'POST',
//     //         headers: {
//     //             'content-type': 'application/json',
//     //         },
//     //         body: JSON.stringify(dataToSend),
//     //     })
//     //         .then((Response) => {
//     //             refetch()
//     //             Response.json();
//     //             console.log(Response);
//     //             if (Response.ok === true) {
//     //                 // caregory_list()
//     //                 if (typeof window !== '') {

//     //                     sessionStorage.setItem("message", "Data saved successfully!");
//     //                 }
//     //                 router.push('/Admin/attendance/attendance_all');
//     //             }
//     //         })
//     //         .then((data) => {
//     //             console.log(data);
//     //             refetch()
//     //         })
//     //         .catch((error) => console.error(error));
//     // };


// //     import React, { useState } from 'react';

// // const TimePicker = () => {
// //     const [startDatetime, setStartDatetime] = useState({ datetime: '', displayTime: '' });
// //     const [lateDatetime, setLateDatetime] = useState({ datetime: '', displayTime: '' });

// //     const handleTimeChange = (event, setDatetime) => {
// //         const timeValue = event.target.value;
// //         const [date, time] = timeValue.split('T');
// //         const [hours, minutes] = time.split(':');

// //         // Create a Date object using the selected date and time
// //         const selectedDateTime = new Date(date);
// //         selectedDateTime.setHours(hours, minutes);

// //         // Format the datetime for display
// //         const displayHours = selectedDateTime.getHours() % 12 || 12;
// //         const displayMinutes = selectedDateTime.getMinutes().toString().padStart(2, '0');
// //         const ampm = selectedDateTime.getHours() >= 12 ? 'PM' : 'AM';
// //         const formattedTime = `${displayHours}:${displayMinutes} ${ampm}`;

// //         setDatetime({ datetime: timeValue, displayTime: formattedTime });
// //     };

// //     return (
// //         <div>
// //             <input
// //                 type="text"
// //                 readOnly
// //                 value={startDatetime.displayTime}
// //                 name='start_time'
// //                 onClick={() => document.getElementById('dateInput-n1').showPicker()}
// //                 placeholder="HH:MM"
// //                 className="form-control form-control-sm mb-2"
// //                 style={{ display: 'inline-block' }}
// //             />
// //             <input
// //                 type="datetime-local"
// //                 id="dateInput-n1"
// //                 value={startDatetime.datetime}
// //                 onChange={(e) => handleTimeChange(e, (datetime) => setStartDatetime(datetime))}
// //                 style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
// //             />
// //         </div>
// //     );
// // };

// // export default TimePicker;
'use client'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

const AttendanceCreates = () => {
    const [searchQuery, setSearchQuery] = useState([]);
    const [itemName, setItemName] = useState('');
    const [employee, setEmployee] = useState([]);
    const [filteredDesignations, setFilteredDesignations] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [withPresent, setWithPresent] = useState(false);
    const [withAbsent, setWithAbsent] = useState(false);



    
    
    const {
        data: apiData = [],
        
    } = useQuery({
        queryKey: ["apiData"],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sms_api/sms_api_all`
            );

            const data = await res.json();
            return data;
        },
    });


    const [apiUrl, setApiUrl] = useState('');
    const [apiResponse, setApiResponse] = useState(null);


    useEffect(() => {
        // Filter apiData for entries with status_url === '1'
        const filteredApiData = apiData.filter(item => item.status_url === '1');

        // Check if there are any valid entries after filtering
        if (filteredApiData.length === 0 || !filteredApiData[0].sms_api_params || filteredApiData[0].sms_api_params.length === 0) {
            return; // Exit if no valid data is available
        }

        // Use the first valid entry for further processing
        const apiEntry = filteredApiData[0];

        // Sort the sms_api_params based on the options field
        const sortedParams = apiEntry.sms_api_params.sort((a, b) => a.options - b.options);

        // Construct the query string from the sorted parameters
        const queryParams = sortedParams.map(param => {
            const key = param.options === 1 ? 'mobile' : (param.sms_key === 'number' ? 'mobile' : param.sms_key);
            return `${key}=${encodeURIComponent(param.sms_value)}`;
        }).join('&');

        // Final URL for API call
        const constructedUrl = `${apiEntry.main_url}${queryParams}`; // Add '?' before query params
        setApiUrl(constructedUrl); // Store the constructed URL in the state

        // Define a flag or condition to prevent automatic API call
        const shouldFetch = false; // Change this based on your logic

        if (shouldFetch) {
            // Fetching the API data
            const fetchData = async () => {
                try {
                    const response = await fetch(constructedUrl);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`); // Check if response is ok
                    }
                    const result = await response.json();
                    setApiResponse(result); // Set the API response in state
                } catch (error) {
                    console.error('Error fetching the API:', error);
                }
            };

            // Trigger API call if the condition is met
            fetchData();
        }
    }, [apiData]); // apiData as dependency

    console.log(apiUrl);




    // // Split the original URL at the first occurrence of "?"
    // const [baseUrl, paramString] = apiUrl?.split('?');

    // // Now extract the first parameter
    // const [firstParam] = paramString?.split('&');

    // // Construct the formatted URL using the base URL and the first parameter
    // const formattedUrl = `${baseUrl}?${firstParam}`;

    // console.log(formattedUrl);


    const [formattedUrl, setFormattedUrl] = useState([])
    const [baseUrl, paramString] = apiUrl.split('?');

    // Check if paramString is defined before attempting to split
    const firstParam = paramString ? paramString.split('&')[0] : null;
    useEffect(() => {

        if (firstParam) {
            // Construct the formatted URL using the base URL and the first parameter
            const formattedUrl = `${baseUrl}?${firstParam}`;
            setFormattedUrl(formattedUrl);
        } else {
            console.log("No parameters found.");
        }
    }, [firstParam, baseUrl])

    console.log(formattedUrl)

    const { data: branchAll = [], isLoading, refetch } = useQuery({
        queryKey: ['branchAll'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
            const data = await res.json();
            return data;
        }
    });

    const { data: smsSettings = [], } = useQuery({
        queryKey: ['smsSettings'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/smsSettings`);
            const data = await res.json();
            return data;
        }
    });

    console.log(smsSettings.find(sms => sms.sms_system === 1))
    const attendanceSms = smsSettings?.find(sms => sms.sms_system === 1)
    // console.log(attendanceSms.e_attendance)

    const { data: designations = [] } = useQuery({
        queryKey: ['designations'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_all`);
            const data = await res.json();
            return data;
        }
    });

    const { data: employees = [] } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_all_list`);
            const data = await res.json();
            return data;
        }
    });

    const handleBranchChange = (branchId) => {
        setItemName(branchId);
        setSearchQuery('');
        const filteredDesignations = designations.filter(designation =>
            employees.some(employee =>
                employee.branch_id === parseFloat(branchId) && employee.designation_id === designation.id
            )
        );
        setFilteredDesignations(filteredDesignations);

        const filteredEmployees = employees.filter(employee => employee.branch_id === parseFloat(branchId));
        setFilteredEmployees(filteredEmployees);
    };

    const handleDesignationChange = (designationId) => {
        setSearchQuery(designationId);

        const filteredEmployees = employees.filter(employee =>
            employee.branch_id === parseFloat(itemName) && employee.designation_id === parseFloat(designationId)
        );
        setFilteredEmployees(filteredEmployees);
    };


    console.log(filteredDesignations)
    console.log(filteredEmployees)



    const [searchResults, setSearchResults] = useState([])
    const [error, setError] = useState([])
    const [loading, setLoading] = useState(false)


    const news_search = () => {
        setLoading(true);
        if (itemName === '') {
            // setLoading(true);
            alert('select a branch')
            setLoading(false);
            return
        }
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_search`, {
            searchQuery, itemName, employee
        })
            .then(response => {
                setSearchResults(response.data);
                setCheckedItems('')
                setIsCheckedAll('')
                setLateDatetime('')
                setStartDatetime('')
                setWithAbsent('')
                setWithPresent('')
                setFromDate('')
                setError(null);
                setLoading(false);
                if (response.data.results == '') {
                    alert('Nothing found!');
                }

            })
            .catch(error => {
                setError("An error occurred during search.", error);
                setSearchResults([]);
            });
    };




    console.log('Search Results:', searchResults);



    const [startDatetime, setStartDatetime] = useState('');
    const [lateDatetime, setLateDatetime] = useState('');

    const handleTimeChange = (event, setDatetime) => {
        const timeValue = event.target.value;

        // Get the current date
        const currentDate = new Date();
        const [hours, minutes] = timeValue.split(':');
        const formattedDateTime = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            hours,
            minutes
        );

        // Convert to 12-hour time with AM/PM for display
        const displayHours = formattedDateTime.getHours() % 12 || 12;
        const displayMinutes = formattedDateTime.getMinutes().toString().padStart(2, '0');
        const ampm = formattedDateTime.getHours() >= 12 ? 'PM' : 'AM';
        const formattedTime = `${displayHours}:${displayMinutes} ${ampm}`;

        setDatetime({ datetime: formattedDateTime.toISOString(), displayTime: formattedTime });
    };

    console.log(startDatetime)
    console.log(lateDatetime)


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


    const [formData, setFormData] = useState([
        {
            user_id: '',
            created_by: userId,
            attendance_date: '',
            device_id: 'Online',
            checktime: '',
            unique_id: ''

        }
    ])


    const [checkedItems, setCheckedItems] = useState({});
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [checkedItemsData, setCheckedItemsData] = useState([]);
    const [unCheckedItemsData, setUnCheckedItemsData] = useState([]);

    const handleCheckChange = (uniqueId) => {
        const updatedCheckedItems = {
            ...checkedItems,
            [uniqueId]: !checkedItems[uniqueId]
        };

        setCheckedItems(updatedCheckedItems);

        // Update the selected and unselected data arrays
        const selectedData = searchResults.filter(item => updatedCheckedItems[item.user_id]);
        const unselectedData = searchResults.filter(item => !updatedCheckedItems[item.user_id]);

        setCheckedItemsData(selectedData);
        setUnCheckedItemsData(unselectedData);
    };

    const handleCheckAllChange = () => {
        const newCheckedStatus = !isCheckedAll;
        const newCheckedItems = {};
        const newCheckedItemsData = [];
        const newUnCheckedItemsData = [];

        if (newCheckedStatus) {
            searchResults.forEach((attendance) => {
                newCheckedItems[attendance.user_id] = true;
                newCheckedItemsData.push(attendance);
            });
        } else {
            searchResults.forEach((attendance) => {
                newUnCheckedItemsData.push(attendance);
            });
        }

        setCheckedItems(newCheckedItems);
        setCheckedItemsData(newCheckedItemsData);
        setUnCheckedItemsData(newUnCheckedItemsData);
        setIsCheckedAll(newCheckedStatus);
    };

    console.log('checkedItems', checkedItems);
    console.log('checkedItemsData', checkedItemsData);
    console.log('unCheckedItemsData', unCheckedItemsData);



    const { data: yearlyHolidays = [] } = useQuery({
        queryKey: ['yearlyHolidays'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/yearly_holiday/yearly_holiday_all`);
            const data = await res.json();
            return data;
        }
    });

    const formatDates = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${year}-${month}-${day}`;
    };

    const data = fromDate ? formatDates(fromDate) : '';
    // const datas = startDatetime ? formatDates(startDatetime.datetime) : '';
    // console.log(startDatetime.datetime.slice(0,10))
    // console.log(fromDate ? formatDates(fromDate) : 'no data')

    const foundHoliday = yearlyHolidays.filter(yearlyHoliday =>
        yearlyHoliday.start_date.slice(0, 10) === data
    );

    if (foundHoliday) {
        console.log('Holiday found:', foundHoliday);
    } else {
        console.log('Holiday not found.');
    }

    console.log(foundHoliday[0]?.holiday_category_name)

    const { data: leaveAllApproved = [] } = useQuery({
        queryKey: ['leaveAllApproved'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_details_list`)
            const data = await res.json()
            return data
        }
    });

    console.log(leaveAllApproved)



    const matchedLeave = leaveAllApproved.filter(leave =>
        leave.leave_application_ids.some(application =>
            application.leave_date.slice(0, 10) === data
        )
    );


    console.log(matchedLeave?.whose_leave); // true or false
    console.log(matchedLeave); // true or false

    const { data: absentList = [] } = useQuery({
        queryKey: ['absentList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/absent/absent_all`)
            const data = await res.json()
            return data
        }
    });

    const { data: attendance_sms_campaign_categorys = [] } = useQuery({
        queryKey: ['attendance_sms_campaign_categorys'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance_sms/attendance_sms_campaign_category`)
            const data = await res.json()
            return data
        }
    });

    const employeeAttendance = attendance_sms_campaign_categorys.find(attendance_sms_campaign_category => attendance_sms_campaign_category.id === 9)
    const employeeAbsent = attendance_sms_campaign_categorys.find(attendance_sms_campaign_category => attendance_sms_campaign_category.id === 14)

    console.log(employeeAttendance)


    const [present_sms, setPresent_sms] = useState([])
    console.log(present_sms)

    const employeeAttendanceSmsTemplate = attendanceSms?.e_attendance
    const employeeAbsentSmsTemplate = attendanceSms?.te_absence

    const employeePresentSmsTemplate = attendanceSms?.auto_e_attendance
    const employeeAbsentSmsTemplateSend = attendanceSms?.auto_te_absence

    const sendOtpToAllEmployees = () => {
        if (!withPresent && !withAbsent) {
            console.log('No SMS will be sent.');
            return;
        }
        if (employeePresentSmsTemplate !== 1) {
            console.log('Auto is not active');
            return;
        }

        if (foundHoliday.length > 0) {
            return;
        }



        checkedItemsData.forEach((employee) => {
            if (withPresent && checkedItems[employee.user_id]) {
                const otp = generateOTP();
                const currentDate = new Date();
                const date = currentDate.toLocaleDateString();
                const smsTime = currentDate.toLocaleTimeString();

                // Replace placeholders with actual data
                let msg = employeeAttendanceSmsTemplate
                    .replace('[[company_name]]', employee.company_name || 'No Company')
                    .replace('[[full_name]]', employee.full_name)
                    .replace('[[employee_id]]', employee.unique_id)
                    .replace('[[designation]]', employee.designation_name)
                    .replace('[[date]]', date)
                    .replace('[[in_time]]', formatDateAmPm(startDatetime.datetime))
                    .replace('[[sms_time]]', smsTime);

                setPresent_sms(msg)

                axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
                    // quick_api: quickApi,
                    formattedUrl,
                    mobile: employee.mobile,
                    msg: msg,
                })
                    .then(response => {
                        console.log(`OTP sent to ${employee.full_name} (${employee.mobile}):`, response.data);
                    })
                    .catch(error => {
                        console.error(`Failed to send OTP to ${employee.full_name} (${employee.mobile}):`, error);
                    });
            }
        });

        const leaveUserIds = matchedLeave.map((leave) => leave.whose_leave);

        // Prepare and send data for unchecked items
        const absentDataToSend = unCheckedItemsData
            .filter((item) => {
                const isOnLeave = leaveUserIds.includes(item.user_id);
                const isAlreadyAbsent = absentList.some(absent =>
                    absent.user_id === item.user_id && absent.absent_date.slice(0, 10) === data
                );
                return !isOnLeave && !isAlreadyAbsent; // Exclude users on leave and already marked as absent
            })

        console.log(absentDataToSend)


        if (employeeAbsentSmsTemplateSend !== 1) {
            console.log('Auto is not active');
            return;
        }

        absentDataToSend.forEach((employee) => {
            if (withAbsent && !checkedItems[employee.user_id]) {
                const otp = generateOTP();
                const currentDate = new Date();
                const date = currentDate.toLocaleDateString();
                const smsTime = currentDate.toLocaleTimeString();

                // Replace placeholders with actual data for absent employees
                let msg = employeeAbsentSmsTemplate
                    .replace('[[company_name]]', employee.company_name || 'No Company')
                    .replace('[[full_name]]', employee.full_name)
                    .replace('[[employee_id]]', employee.unique_id)
                    .replace('[[employee_designation]]', employee.designation_name)
                    .replace('[[absent_date]]', date)
                    .replace('[[sms_time]]', smsTime);

                axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
                    // quick_api: quickApi,
                    formattedUrl,
                    mobile: employee.mobile,
                    msg: msg,
                })
                    .then(response => {
                        console.log(`OTP sent to ${employee.full_name} (${employee.mobile}):`, response.data);
                    })
                    .catch(error => {
                        console.error(`Failed to send OTP to ${employee.full_name} (${employee.mobile}):`, error);
                    });
            }
        });
    };

    const router = useRouter()



    const user_create = (event) => {
        event.preventDefault();

        if (foundHoliday.length > 0) {
            console.log('This is holiday No Attendance')
            return;
        }

        // Prepare data for checked items
        const dataToSend = checkedItemsData.flatMap((item, i) => {
            const entries = [];
            const matchingCheckedItem = checkedItemsData.find(checkedItem => checkedItem.user_id === item.user_id);
            // Add entry time record only if startDatetime.datetime is not empty
            if (startDatetime.datetime !== undefined) {
                entries.push({
                    user_id: item.user_id,
                    created_by: userId,
                    attendance_date: fromDate,
                    device_id: 'Online',
                    checktime: startDatetime.datetime,  // Entry Time
                    unique_id: item.unique_id,
                    number: item.mobile,
                    name: employeeAttendance.category_name,
                    sms_campaign_category_id: employeeAttendance.id,
                    employeeAttendanceSmsTemplate: employeeAttendanceSmsTemplate,
                    checkedItemsData: matchingCheckedItem,
                    startDatetime: startDatetime,
                    withPresent: withPresent,

                });
            }

            // Add exit time record only if lateDatetime.datetime is not empty
            if (lateDatetime.datetime !== undefined) {
                entries.push({
                    user_id: item.user_id,
                    created_by: userId,
                    attendance_date: fromDate,
                    device_id: 'Online',
                    checktime: lateDatetime.datetime,  // Exit Time
                    unique_id: item.unique_id,
                    number: item.mobile,
                    name: employeeAttendance.category_name,
                    sms_campaign_category_id: employeeAttendance.id,
                    employeeAttendanceSmsTemplate: employeeAttendanceSmsTemplate,
                    checkedItemsData: matchingCheckedItem,
                    startDatetime: startDatetime,
                    withPresent: withPresent,

                });
            }

            return entries;
        });

        console.log(dataToSend);



        // Send dataToSend to the attendance API
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to save attendance data');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data && data.ok === true) {
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem("message", "Data saved successfully!");
                    }
                    router.push('/Admin/attendance/attendance_all');
                }
                refetch();
            })
            .catch((error) => console.error(error));

        // Extract `whose_leave` IDs
        const leaveUserIds = matchedLeave.map((leave) => leave.whose_leave);

        // Prepare and send data for unchecked items
        // const absentDataToSend = unCheckedItemsData
        //   .filter((item) => {

        //     const isOnLeave = leaveUserIds.includes(item.user_id);
        //     const isAlreadyAbsent = absentList.some(absent => 
        //       absent.user_id === item.user_id && absent.absent_date.slice(0, 10) === data
        //     );
        //     return !isOnLeave && !isAlreadyAbsent; // Exclude users on leave and already marked as absent
        //   })
        //   .map((item, i) => ({
        //     user_id: item.user_id,
        //     created_by: userId,
        //     attendance_date: fromDate,
        //     device_id: 'Online',
        //     checktime: null,  // Assuming no specific checktime for absents
        //     unique_id: item.unique_id,
        //     number: item.mobile,
        //     name: employeeAbsent.category_name,
        //     sms_campaign_category_id: employeeAbsent.id,
        //     employeeAttendanceSmsTemplate: employeeAttendanceSmsTemplate,
        //     checkedItemsData: matchingUncehckItem,
        //   }));
        const absentDataToSend = unCheckedItemsData
            .filter((item) => {

                const isOnLeave = leaveUserIds.includes(item.user_id);
                const isAlreadyAbsent = absentList.some(absent =>
                    absent.user_id === item.user_id && absent.absent_date.slice(0, 10) === data
                );
                return !isOnLeave && !isAlreadyAbsent; // Exclude users on leave and already marked as absent
            })
            .map((item, i) => {
                const matchingUncheckItem = unCheckedItemsData.find(checkedItem => checkedItem.user_id === item.user_id); // Moved inside map
                return {
                    user_id: item.user_id,
                    created_by: userId,
                    attendance_date: fromDate,
                    device_id: 'Online',
                    checktime: null,  // Assuming no specific checktime for absents
                    unique_id: item.unique_id,
                    number: item.mobile,
                    name: employeeAbsent.category_name,
                    sms_campaign_category_id: employeeAbsent.id,
                    employeeAttendanceSmsTemplate: employeeAbsentSmsTemplate,
                    checkedItemsData: matchingUncheckItem,
                    withAbsent: withAbsent,
                };
            });

        console.log(absentDataToSend);

        if (absentDataToSend.length > 0) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/absent/absent_create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(absentDataToSend),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to save absent data');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    if (data && data.ok === true) {
                        // Handle success if needed
                    }
                    refetch(); // Refetch data if needed
                })
                .catch((error) => console.error(error));
        }
    };




    // const user_create = (event) => {
    //     event.preventDefault();

    //     if (foundHoliday.length > 0) {
    //         return;
    //     }

    //     // Prepare data for checked items
    //     const dataToSend = checkedItemsData.flatMap((item) => {
    //         const entries = [];

    //         // Add entry time record only if startDatetime.datetime is not empty
    //         if (startDatetime.datetime !== undefined) {
    //             entries.push({
    //                 user_id: item.user_id,
    //                 created_by: userId,
    //                 attendance_date: fromDate,
    //                 device_id: 'Online',
    //                 checktime: startDatetime.datetime,  // Entry Time
    //                 unique_id: item.unique_id
    //             });
    //         }

    //         // Add exit time record only if lateDatetime.datetime is not empty
    //         if (lateDatetime.datetime !== undefined) {
    //             entries.push({
    //                 user_id: item.user_id,
    //                 created_by: userId,
    //                 attendance_date: fromDate,
    //                 device_id: 'Online',
    //                 checktime: lateDatetime.datetime,  // Exit Time
    //                 unique_id: item.unique_id
    //             });
    //         }

    //         return entries;
    //     });

    //     console.log(dataToSend);

    //     // Send dataToSend to the attendance API
    //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_create`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(dataToSend),
    //     })
    //     .then((response) => {
    //         if (!response.ok) {
    //             throw new Error('Failed to save attendance data');
    //         }
    //         return response.json();  // Ensure you return the parsed JSON
    //     })
    //     .then((data) => {
    //         console.log(data);
    //         if (data && data.ok === true) {
    //             if (typeof window !== 'undefined') {
    //                 sessionStorage.setItem("message", "Data saved successfully!");
    //             }
    //             // router.push('/Admin/attendance/attendance_all');
    //         }
    //         refetch(); // Refetch data if needed
    //     })
    //     .catch((error) => console.error(error));

    //     // Extract `whose_leave` IDs
    //     const leaveUserIds = matchedLeave.map((leave) => leave.whose_leave);

    //     // Prepare and send data for unchecked items
    //     const absentDataToSend = unCheckedItemsData
    //         .filter((item) => !leaveUserIds.includes(item.user_id)) // Exclude users on leave
    //         .map((item) => ({
    //             user_id: item.user_id,
    //             created_by: userId,
    //             attendance_date: fromDate,
    //             device_id: 'Online',
    //             checktime: null,  // Assuming no specific checktime for absents
    //             unique_id: item.unique_id,
    //         }));

    //     console.log(absentDataToSend);

    //     if (absentDataToSend.length > 0) {
    //         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/absent/absent_create`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(absentDataToSend),
    //         })
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error('Failed to save absent data');
    //             }
    //             return response.json();  // Ensure you return the parsed JSON
    //         })
    //         .then((data) => {
    //             console.log(data);
    //             if (data && data.ok === true) {
    //                 // Handle success if needed
    //             }
    //             refetch(); // Refetch data if needed
    //         })
    //         .catch((error) => console.error(error));
    //     }
    // };

    // const user_create = (event) => {
    //     event.preventDefault();

    //     if (foundHoliday.length > 0) {
    //         return;
    //     }

    //     // Prepare data for checked items
    //     const dataToSend = checkedItemsData.flatMap((item) => {
    //         const entries = [];

    //         // Add entry time record only if startDatetime.datetime is not empty
    //         if (startDatetime.datetime !== undefined) {
    //             entries.push({
    //                 user_id: item.user_id,
    //                 created_by: userId,
    //                 attendance_date: fromDate,
    //                 device_id: 'Online',
    //                 checktime: startDatetime.datetime,  // Entry Time
    //                 unique_id: item.unique_id
    //             });
    //         }

    //         // Add exit time record only if lateDatetime.datetime is not empty
    //         if (lateDatetime.datetime !== undefined) {
    //             entries.push({
    //                 user_id: item.user_id,
    //                 created_by: userId,
    //                 attendance_date: fromDate,
    //                 device_id: 'Online',
    //                 checktime: lateDatetime.datetime,  // Exit Time
    //                 unique_id: item.unique_id
    //             });
    //         }

    //         return entries;
    //     });

    //     console.log(dataToSend);

    //     // Send dataToSend to the attendance API
    //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_create`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(dataToSend),
    //     })
    //     .then((response) => {
    //         if (!response.ok) {
    //             throw new Error('Failed to save attendance data');
    //         }
    //         return response.json();  // Ensure you return the parsed JSON
    //     })
    //     .then((data) => {
    //         console.log(data);
    //         if (data && data.ok === true) {
    //             if (typeof window !== 'undefined') {
    //                 sessionStorage.setItem("message", "Data saved successfully!");
    //             }
    //             // router.push('/Admin/attendance/attendance_all');
    //         }
    //         refetch(); // Refetch data if needed
    //     })
    //     .catch((error) => console.error(error));

    //     // Prepare and send data for unchecked items
    //     const absentDataToSend = unCheckedItemsData.map((item) => ({
    //         user_id: item.user_id,
    //         created_by: userId,
    //         attendance_date: fromDate,
    //         device_id: 'Online',
    //         checktime: null,  // Assuming no specific checktime for absents
    //         unique_id: item.unique_id,

    //     }));

    //     console.log(absentDataToSend);

    //     if (unCheckedItemsData.length > 0) {
    //         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/absent/absent_create`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(absentDataToSend),
    //         })
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error('Failed to save absent data');
    //             }
    //             return response.json();  // Ensure you return the parsed JSON
    //         })
    //         .then((data) => {
    //             console.log(data);
    //             if (data && data.ok === true) {
    //                 // Handle success if needed
    //             }
    //             refetch(); // Refetch data if needed
    //         })
    //         .catch((error) => console.error(error));
    //     }
    // };

    // const user_create = (event) => {
    //     event.preventDefault();

    //     if( foundHoliday.length > 0){

    //         return
    //     }

    //     const uncehckData = unCheckedItemsData



    //     const dataToSend = checkedItemsData.flatMap((item) => {
    //         const entries = [];

    //         // Add entry time record only if startDatetime.datetime is not empty
    //         if (startDatetime.datetime !== undefined) {
    //             entries.push({
    //                 user_id: item.user_id,
    //                 created_by: userId,
    //                 attendance_date: fromDate,
    //                 device_id: 'Online',
    //                 checktime: startDatetime.datetime,  // Entry Time
    //                 unique_id: item.unique_id
    //             });
    //         }

    //         // Add exit time record only if lateDatetime.datetime is not empty
    //         if (lateDatetime.datetime !== undefined) {
    //             entries.push({
    //                 user_id: item.user_id,
    //                 created_by: userId,
    //                 attendance_date: fromDate,
    //                 device_id: 'Online',
    //                 checktime: lateDatetime.datetime,  // Exit Time
    //                 unique_id: item.unique_id
    //             });
    //         }
    // console.log(entries)
    //         return entries;
    //     });

    //     console.log(dataToSend);
    //     // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_create

    //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_create`, {
    //         method: 'POST',
    //         headers: {
    //             'content-type': 'application/json',
    //         },
    //         body: JSON.stringify(dataToSend),
    //     })
    //     .then((response) => {
    //         refetch();
    //         return response.json();  // Ensure you return the parsed JSON
    //     })
    //     .then((data) => {
    //         console.log(data);
    //         if (data && data.ok === true) {
    //             if (typeof window !== 'undefined') {
    //                 sessionStorage.setItem("message", "Data saved successfully!");
    //             }
    //             router.push('/Admin/attendance/attendance_all');
    //         }
    //         refetch(); // Refetch data if needed
    //     })
    //     .catch((error) => console.error(error));
    // };


    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    };
    const handleTextInputClick = () => {
        document.getElementById('dateInputFrom').showPicker();
    };

    const handleDateChangeFrom = (event) => {
        const selectedDate = new Date(event.target.value);
        setFromDate(selectedDate);
    };


    // useEffect(() => {
    //     const currentDate = new Date();
    //     setFromDate(currentDate);

    // }, []);

    const generateOTP = () => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        return otp.toString();
    };
    console.log(checkedItemsData)


    const formatDateAmPm = (inputDate) => {
        const date = new Date(inputDate);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        let hours = date.getUTCHours();
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? String(hours).padStart(2, '0') : '12'; // the hour '0' should be '12'

        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
    };

    const quickApi = '7ae89887eac6055a2b9adc494ca3b902';





    //     const sendOtpToAllEmployees = () => {
    //         if (!withPresent && !withAbsent) {
    //             console.log('No SMS will be sent.');
    //             return;
    //         }
    //         if (foundHoliday.length > 0) {
    //             return;
    //         }

    //         const employeeAttendanceSmsTemplate = attendanceSms.e_attendance
    //         const employeeAbsentSmsTemplate = attendanceSms.te_absence

    //         checkedItemsData.forEach((employee) => {
    //             if (withPresent && checkedItems[employee.user_id]) {
    //                 const otp = generateOTP();
    //                 const currentDate = new Date();
    //                 const date = currentDate.toLocaleDateString();
    //                 const smsTime = currentDate.toLocaleTimeString();

    //                 // Replace placeholders with actual data
    //                 let msg = employeeAttendanceSmsTemplate
    //                     .replace('[[company_name]]', employee.company_name || 'No Company')
    //                     .replace('[[full_name]]', employee.full_name)
    //                     .replace('[[employee_id]]', employee.unique_id)
    //                     .replace('[[designation]]', employee.designation_name)
    //                     .replace('[[date]]', date)
    //                     .replace('[[in_time]]', formatDateAmPm(startDatetime.datetime))
    //                     .replace('[[sms_time]]', smsTime);

    //                 axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
    //                     quick_api: quickApi,
    //                     mobile: employee.mobile,
    //                     msg: msg,
    //                 })
    //                     .then(response => {
    //                         console.log(`OTP sent to ${employee.full_name} (${employee.mobile}):`, response.data);
    //                     })
    //                     .catch(error => {
    //                         console.error(`Failed to send OTP to ${employee.full_name} (${employee.mobile}):`, error);
    //                     });
    //             }
    //         });

    //         const leaveUserIds = matchedLeave.map((leave) => leave.whose_leave);

    //         // Prepare and send data for unchecked items
    //         const absentDataToSend = unCheckedItemsData
    //           .filter((item) => {
    //             const isOnLeave = leaveUserIds.includes(item.user_id);
    //             const isAlreadyAbsent = absentList.some(absent => 
    //               absent.user_id === item.user_id && absent.absent_date.slice(0, 10) === data
    //             );
    //             return !isOnLeave && !isAlreadyAbsent; // Exclude users on leave and already marked as absent
    //           })

    // console.log(absentDataToSend)

    // absentDataToSend.forEach((employee) => {
    //             if (withAbsent && !checkedItems[employee.user_id]) {
    //                 const otp = generateOTP();
    //                 const currentDate = new Date();
    //                 const date = currentDate.toLocaleDateString();
    //                 const smsTime = currentDate.toLocaleTimeString();

    //                 // Replace placeholders with actual data for absent employees
    //                 let msg = employeeAbsentSmsTemplate
    //                     .replace('[[company_name]]', employee.company_name || 'No Company')
    //                     .replace('[[full_name]]', employee.full_name)
    //                     .replace('[[employee_id]]', employee.unique_id)
    //                     .replace('[[employee_designation]]', employee.designation_name)
    //                     .replace('[[absent_date]]', date)               
    //                     .replace('[[sms_time]]', smsTime);

    //                 axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
    //                     quick_api: quickApi,
    //                     mobile: employee.mobile,
    //                     msg: msg,
    //                 })
    //                     .then(response => {
    //                         console.log(`OTP sent to ${employee.full_name} (${employee.mobile}):`, response.data);
    //                     })
    //                     .catch(error => {
    //                         console.error(`Failed to send OTP to ${employee.full_name} (${employee.mobile}):`, error);
    //                     });
    //             }
    //         });
    //     };
    //     const sendOtpToAllEmployees = () => {
    //         if (!withPresent && !withAbsent) {
    //             console.log('No SMS will be sent.');
    //             return;
    //         }
    //         if (foundHoliday.length > 0) {
    //             return;
    //         }

    //         const employeeAttendanceSmsTemplate = attendanceSms.e_attendance

    //         checkedItemsData.forEach((employee) => {
    //             if (withPresent && checkedItems[employee.user_id]) {
    //                 const otp = generateOTP();
    //                 const currentDate = new Date();
    //                 const date = currentDate.toLocaleDateString();
    //                 const smsTime = currentDate.toLocaleTimeString();

    //                 // Replace placeholders with actual data
    //                 let msg = employeeAttendanceSmsTemplate
    //                     .replace('[[company_name]]', employee.company_name || 'No Company')
    //                     .replace('[[full_name]]', employee.full_name)
    //                     .replace('[[employee_id]]', employee.unique_id)
    //                     .replace('[[designation]]', employee.designation_name)
    //                     .replace('[[date]]', date)
    //                     .replace('[[in_time]]', formatDateAmPm(startDatetime.datetime))
    //                     .replace('[[sms_time]]', smsTime);

    //                 axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
    //                     quick_api: quickApi,
    //                     mobile: employee.mobile,
    //                     msg: msg,
    //                 })
    //                     .then(response => {
    //                         console.log(`OTP sent to ${employee.full_name} (${employee.mobile}):`, response.data);
    //                     })
    //                     .catch(error => {
    //                         console.error(`Failed to send OTP to ${employee.full_name} (${employee.mobile}):`, error);
    //                     });
    //             }
    //         });

    //         const leaveUserIds = matchedLeave.map((leave) => leave.whose_leave);

    //         // Prepare and send data for unchecked items
    //         const absentDataToSend = unCheckedItemsData
    //           .filter((item) => {
    //             const isOnLeave = leaveUserIds.includes(item.user_id);
    //             const isAlreadyAbsent = absentList.some(absent => 
    //               absent.user_id === item.user_id && absent.absent_date.slice(0, 10) === data
    //             );
    //             return !isOnLeave && !isAlreadyAbsent; // Exclude users on leave and already marked as absent
    //           })

    // console.log(absentDataToSend)
    // absentDataToSend.forEach((employee) => {
    //             if (withAbsent && !checkedItems[employee.user_id]) {
    //                 const otp = generateOTP();
    //                 const currentDate = new Date();
    //                 const date = currentDate.toLocaleDateString();
    //                 const smsTime = currentDate.toLocaleTimeString();

    //                 // Replace placeholders with actual data for absent employees
    //                 let msg = employeeAttendanceSmsTemplate
    //                     .replace('[[company_name]]', employee.company_name || 'No Company')
    //                     .replace('[[full_name]]', employee.full_name)
    //                     .replace('[[employee_id]]', employee.unique_id)
    //                     .replace('[[designation]]', employee.designation_name)
    //                     .replace('[[date]]', date)
    //                     .replace('[[in_time]]', 'N/A') // Assuming there's no in-time for absent employees
    //                     .replace('[[sms_time]]', smsTime);

    //                 axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
    //                     quick_api: quickApi,
    //                     mobile: employee.mobile,
    //                     msg: msg,
    //                 })
    //                     .then(response => {
    //                         console.log(`OTP sent to ${employee.full_name} (${employee.mobile}):`, response.data);
    //                     })
    //                     .catch(error => {
    //                         console.error(`Failed to send OTP to ${employee.full_name} (${employee.mobile}):`, error);
    //                     });
    //             }
    //         });
    //     };


    // const sendOtpToAllEmployees = () => {
    //     if (!withPresent && !withAbsent) {
    //         console.log('No SMS will be sent.');
    //         return;
    //     }
    //     if( foundHoliday.length > 0){

    //         return
    //     }

    //     const employeeAttendanceSms = attendanceSms.e_attendance


    //     checkedItemsData.forEach((employee) => {
    //         if (withPresent && checkedItems[employee.user_id]) {
    //             // Send OTP to checked employees if 'With Present' is checked
    //             const otp = generateOTP();
    //             axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
    //                 quick_api: quickApi,
    //                 mobile: employee.mobile,
    //                 msg: `You Are Present`,
    //             })
    //                 .then(response => {
    //                     console.log(`OTP sent to ${employee.full_name} (${employee.mobile}):`, response.data);
    //                 })
    //                 .catch(error => {
    //                     console.error(`Failed to send OTP to ${employee.full_name} (${employee.mobile}):`, error);
    //                 });
    //         }


    //     });

    //     unCheckedItemsData.forEach((employee) => {
    //         if (withAbsent && !checkedItems[employee.user_id]) {
    //             // Send OTP to checked employees if 'With Present' is checked
    //             const otp = generateOTP();
    //             axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
    //                 quick_api: quickApi,
    //                 mobile: employee.mobile,
    //                 msg: `You Are Absent`,
    //             })
    //                 .then(response => {
    //                     console.log(`OTP sent to ${employee.full_name} (${employee.mobile}):`, response.data);
    //                 })
    //                 .catch(error => {
    //                     console.error(`Failed to send OTP to ${employee.full_name} (${employee.mobile}):`, error);
    //                 });
    //         }

    //     });
    // };






    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 p-4">
                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Online Attendance</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/attendance/attendance_all?page_group=`} className="btn btn-sm btn-info">Back To Attendance List</Link>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="col-md-10 offset-md-1">
                                            <div className="form-group row student">
                                                <label className="col-form-label col-md-2 font-weight-bold">Branch Name:</label>
                                                <div className="col-md-4">
                                                    <select required="" value={itemName} onChange={(e) => handleBranchChange(e.target.value)} name="branch_id" className="form-control form-control-sm mb-2" id="branch_id">
                                                        <option value=''>Select Branch</option>
                                                        {branchAll.map((branch) => (
                                                            <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <label className="col-form-label col-md-2 font-weight-bold">Designation Name:</label>
                                                <div className="col-md-4">
                                                    <select required="" value={searchQuery} onChange={(e) => handleDesignationChange(e.target.value)} name="designation_id" className="form-control form-control-sm mb-2" id="designation_id">
                                                        <option value=''>Select Designation</option>
                                                        {filteredDesignations.map((designation) => (
                                                            <option key={designation.id} value={designation.id}>{designation.designation_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row student">
                                                <label className="col-form-label col-md-2 font-weight-bold">Employee:</label>
                                                <div className="col-md-4">
                                                    <select required="" value={employee} onChange={(e) => setEmployee(e.target.value)} name="employee_id" className="form-control form-control-sm mb-2" id="employee_id">
                                                        <option value=''>Select Employee</option>
                                                        {filteredEmployees.map((employee) => (
                                                            <option key={employee.id} value={employee.user_id}>{employee.full_name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="offset-md-2 col-md-6 float-left">
                                                    <input
                                                        onClick={news_search}
                                                        type="button" name="search" className="btn btn-sm btn-info search_btn mr-2" value="Search" />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
                                        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {loading ? <div className='text-center'>
                        <div className='  text-center text-dark'
                        >
                            <FontAwesomeIcon style={{
                                height: '33px',
                                width: '33px',
                            }} icon={faSpinner} spin />
                        </div>
                    </div>


                        :

                        searchResults?.length > 0 ? (
                            <div className='card'>
                                <div className="body-content bg-light">
                                    <div className="border-primary shadow-sm border-0">
                                        <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                            <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Online Employee Attendance</h5>

                                        </div>
                                        <div className='px-4'>

                                            {
                                                foundHoliday.length > 0 ?

                                                    <div className="alert alert-danger  mt-2">
                                                        Today {data}, {foundHoliday[0]?.holiday_category_name} . You Can't Take Attendance Today

                                                    </div>
                                                    :
                                                    ''
                                            }
                                        </div>

                                        <div class="card-body" >

                                            <form onSubmit={user_create}>
                                                <div className="col-md-10 offset-md-1">
                                                    <div className="form-group row student">
                                                        <label className="col-form-label col-md-2 font-weight-bold">Present Date:</label>
                                                        <div className="col-md-4">

                                                            <input
                                                                className="form-control form-control-sm"
                                                                type="text"
                                                                id="fromDate"
                                                                placeholder='dd--mm--yyyy'
                                                                value={fromDate ? formatDate(fromDate) : ''}
                                                                onClick={handleTextInputClick}
                                                                readOnly
                                                            />
                                                            <input
                                                                type="date"
                                                                id="dateInputFrom"

                                                                value={fromDate ? fromDate.toString().split('T')[0] : ''}
                                                                onChange={handleDateChangeFrom}
                                                                style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                            />


                                                        </div>


                                                        <label className="col-form-label col-md-2 font-weight-bold">Entry Time:</label>
                                                        <div className="col-md-4">
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                value={startDatetime.displayTime}
                                                                name='start_time'
                                                                onClick={() => document.getElementById('dateInput-n1').showPicker()}
                                                                placeholder="HH:MM"
                                                                className="form-control form-control-sm mb-2"
                                                                style={{ display: 'inline-block' }}
                                                            />
                                                            <input
                                                                type="time"
                                                                id="dateInput-n1"
                                                                onChange={(e) => handleTimeChange(e, (datetime) => setStartDatetime(datetime))}
                                                                style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row student">
                                                        <label className="col-form-label col-md-2 font-weight-bold">Exit Time:</label>
                                                        <div className="col-md-4">
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                value={lateDatetime.displayTime}
                                                                name='late_time'
                                                                onClick={() => document.getElementById('dateInput-n2').showPicker()}
                                                                placeholder="HH:MM"
                                                                className="form-control form-control-sm mb-2"
                                                                style={{ display: 'inline-block' }}
                                                            />
                                                            <input
                                                                type="time"
                                                                id="dateInput-n2"
                                                                onChange={(e) => handleTimeChange(e, (datetime) => setLateDatetime(datetime))}
                                                                style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
                                                            />
                                                        </div>


                                                        <div className="form-group grid">
                                                            <div className='d-flex'>
                                                                <label className="col-form-label font-weight-bold col-md-9">With Present Sms:</label>
                                                                <div className="col-md-4 mt-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        name="withPresentYes"
                                                                        id="withPresentYes"
                                                                        checked={withPresent}
                                                                        onChange={(e) => setWithPresent(e.target.checked)}
                                                                    />

                                                                      <span className='ml-2'>Yes</span>
                                                                </div>
                                                            </div>
                                                            <div className='d-flex m-0'>
                                                                <label className="col-form-label font-weight-bold col-md-9">With Absent Sms:</label>
                                                                <div className="col-md-4 mt-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        name="withFutureYes"
                                                                        id="withFutureYes"
                                                                        checked={withAbsent}
                                                                        onChange={(e) => setWithAbsent(e.target.checked)}
                                                                    />
                                                                    <span className='ml-2'>Yes</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="form-group row">

                                                        <div className="offset-md-2 col-md-6 float-left">

                                                            <button
                                                                onClick={sendOtpToAllEmployees}
                                                                className="btn btn-sm btn-success">
                                                                Submit
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="table-responsive">
                                                    <table id='mytable' className="table table-bordered table-hover table-striped table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isCheckedAll}
                                                                        onChange={handleCheckAllChange}
                                                                    />
                                                                </th>
                                                                <th >Employee ID</th>
                                                                <th > ID</th>
                                                                <th >Name</th>
                                                                <th >Designation</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {searchResults.map((attendances, i) => (
                                                                <tr key={i}>
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={checkedItems[attendances.user_id] || false}
                                                                            onChange={() => handleCheckChange(attendances.user_id)}
                                                                        />
                                                                    </td>
                                                                    <td>{attendances.unique_id}</td>
                                                                    <td>{attendances.user_id}</td>
                                                                    <td>{attendances.full_name}</td>
                                                                    <td>{attendances.designation_name}</td>
                                                                </tr>
                                                            ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </form>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ) :
                            <>
                            </>
                    }
                </div>
            </div>
        </div>
    );
};

export default AttendanceCreates;