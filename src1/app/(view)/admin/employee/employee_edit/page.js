// 'use client' 
 //ismile
// // import { employee_update } from '@/app/model/Admin/employee_model/employee_model';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';

// const EmployeeEdit = ({ id }) => {




//     // const datas = employee_update

//     const modified_by = localStorage.getItem('userId')


//     let [fields, setFields] = useState([{
//         education: '', institute: '',
//         result: '', passing_year: '', modified_by: modified_by
//     }]);

//     const [numToAdd, setNumToAdd] = useState(1);


//     const handleAddMore = () => {
//         const numToAddInt = parseInt(numToAdd);
//         if (!isNaN(numToAddInt) && numToAddInt > 0) {
//             const newInputValues = [...fields];
//             for (let i = 0; i < numToAddInt; i++) {
//                 newInputValues.push({
//                     education: '',
//                     institute: '',
//                     result: '',
//                     passing_year: '',
//                     modified_by: modified_by
//                 });
//             }
//             setFields(newInputValues);
//             setNumToAdd(1);
//         }
//     };

//     const [fullName, setFullName] = useState([])
//     const [fatherName, setFatherName] = useState([])
//     const [motherName, setMotherName] = useState([])
//     const [dob, setDob] = useState([])
//     const [gender, setGender] = useState([])
//     const [religion, setReligion] = useState([])
//     const [email, setEmail] = useState([])
//     const [mobile, setMobile] = useState([])
//     const [password, setPassword] = useState([])
//     const [confirmPassword, setConfirmPassword] = useState([])
//     const [experience, setExperience] = useState([])
//     const [education, setEducation] = useState([])
//     const [School, setSchool] = useState([])
//     const [result, setResult] = useState([])
//     const [passingYear, setPassingYear] = useState([])
//     const [lDivision, setLDivision] = useState([])
//     const [lDistrict, setLDistrict] = useState([])
//     const [lUpazila, setLUpazila] = useState([])
//     const [lAddress, setLAddress] = useState([])
//     const [pDivision, setPDivision] = useState([])
//     const [pDistrict, setPDistrict] = useState([])
//     const [pUpazila, setPUpazila] = useState([])
//     const [pAddress, setPAddress] = useState([])
//     const [joinDate, setJoinDate] = useState([])
//     const [designation, setDesignation] = useState([])
//     const [employeeId, setEmployeeId] = useState([])
//     const [payroll, setPayroll] = useState([])
//     const [shift, setShift] = useState([])


//     const handleChange = (index, event) => {

//         const { name, value } = event.target;
//         const newFields = [...fields];
//         newFields[index].educational_qualifications[name] = value;



//         const education = newFields[index]['education'];
//         if (education) {
//             setEducation('')
//         }

//         const institute = newFields[index]['institute'];
//         if (institute) {
//             setSchool('')
//         }

//         const result = newFields[index]['result'];
//         if (result) {
//             setResult('')
//         }

//         const passing_year = newFields[index]['passing_year'];
//         if (passing_year) {
//             setPassingYear('')
//         }

//         setFields(newFields);
//     };

//     const handleRemoveField = (index) => {
//         const newFields = [...fields];
//         newFields.splice(index, 1);
//         setFields(newFields);
//     };


//     const { data: payRoll = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['payRoll'],
//         queryFn: async () => {
//             // const res = await fetch(datas)
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pay_roll/pay_roll_all`)


//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: educationName = [],
//     } = useQuery({
//         queryKey: ['educationName'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/education/education_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: divisions = [],
//     } = useQuery({
//         queryKey: ['divisions'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/divisions/divisions_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: district = [],
//     } = useQuery({
//         queryKey: ['district'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/district/district_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: upazilas = [],
//     } = useQuery({
//         queryKey: ['upazilas'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/upazilas/upazilas_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const [selectedDivision, setSelectedDivision] = useState("");
//     const [selectedDistrict, setSelectedDistrict] = useState("");
//     const [filteredDistricts, setFilteredDistricts] = useState([]);
//     const [filteredUpazilas, setFilteredUpazilas] = useState([]);

//     useEffect(() => {
//         if (selectedDivision) {
//             const filtered = district.filter(district => district.division_id === parseInt(selectedDivision));
//             setFilteredDistricts(filtered);
//         } else {
//             setFilteredDistricts([]);
//         }
//         setSelectedDistrict(""); // Reset selected district when division changes
//     }, [selectedDivision, district]);

//     useEffect(() => {
//         if (selectedDistrict) {
//             const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistrict));
//             setFilteredUpazilas(filtered);
//         } else {
//             setFilteredUpazilas([]);
//         }
//     }, [selectedDistrict, upazilas]);


//     const [selectedDivisionCopy, setSelectedDivisionCopy] = useState("");
//     const [selectedDistrictCopy, setSelectedDistrictCopy] = useState("");
//     const [filteredDistrictsCopy, setFilteredDistrictsCopy] = useState([]);
//     const [filteredUpazilasCopy, setFilteredUpazilasCopy] = useState([]);

//     useEffect(() => {
//         if (selectedDivisionCopy) {
//             const filtered = district.filter(district => district.division_id === parseInt(selectedDivisionCopy));
//             setFilteredDistrictsCopy(filtered);
//         } else {
//             setFilteredDistrictsCopy([]);
//         }
//         setSelectedDistrictCopy(""); // Reset selected district when division changes
//     }, [selectedDivisionCopy, district]);

//     useEffect(() => {
//         if (selectedDistrictCopy) {
//             const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistrictCopy));
//             setFilteredUpazilasCopy(filtered);
//         } else {
//             setFilteredUpazilasCopy([]);
//         }
//     }, [selectedDistrictCopy, upazilas]);

//     const [livingAddress, setLivingAddress] = useState('');
//     const [isSameAsLivingAddress, setIsSameAsLivingAddress] = useState(false);

//     const handleLivingAddressChange = (e) => {
//         setLivingAddress(e.target.value);
//     };

//     useEffect(() => {
//         if (isSameAsLivingAddress) {
//             setSelectedDivisionCopy(selectedDivision);
//             setSelectedDistrictCopy(selectedDistrict);
//             setFilteredDistrictsCopy(filteredDistricts);
//             setFilteredUpazilasCopy(filteredUpazilas);
//         }
//         else {
//             setSelectedDivisionCopy('');

//         }
//     }, [isSameAsLivingAddress, selectedDivision, selectedDistrict, filteredDistricts, filteredUpazilas]);

//     const [selectedUpazila, setSelectedUpazila] = useState('');
//     const handleUpazilaChange = (e) => {
//         setSelectedUpazila(e.target.value);
//     };

//     const { data: schoolShiftList = [],
//     } = useQuery({
//         queryKey: ['schoolShiftList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all`)

//             const data = await res.json()
//             return data
//         }
//     })

//     // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pay_roll/pay_roll_all`)

//     const { data: allEmployeeList = [],
//     } = useQuery({
//         queryKey: ['allEmployeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list/${id}`)

//             const data = await res.json()
//             return data
//         }
//     })



//     useEffect(() => {
//         if (allEmployeeList && allEmployeeList.educational_qualifications) {
//             setFields(allEmployeeList.educational_qualifications.map(edu => ({
//                 educational_qualifications: {
//                     education: edu.education,
//                     institute: edu.institute,
//                     result: edu.result,
//                     passing_year: edu.passing_year,
//                     modified_by: modified_by
//                 }
//             })));
//         }
//     }, [allEmployeeList, modified_by]);


//     console.log(fields[0].educational_qualifications)
// console.log(allEmployeeList)


//     const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
//     const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

//     const [fieldes, setFieldes] = useState({
//         // user_id: '',
//         educational_qualifications:fields,
//         qualification: '',
//         experience: '',
//         education: '',
//         institute: '',
//         result: '',
//         passing_year: '',
//         living_division_id: '',
//         living_district_id: '',
//         living_upazila_id: '',
//         living_address: '',
//         permanent_division_id: '',
//         permanent_district_id: '',
//         permanent_upazila_id: '',
//         permanent_address: '',
//         join_date: '',
//         payroll_id: '',
//         school_shift_id: '',
//         designation_id: '',
//         employee_id: '',
//         branch_id: '',
//         // full_name: '',
//         // father_name:'',
//         // mother_name: '',
//         // dob: '',
//         // gender: '',
//         // religion: '',
//         // mobile: '',
//         // email: '',
//         // password: '',
//         // signature_image: '',
//         // photo: '',
//         modified_by: modified_by
//     });

//     const [user, setUser] = useState({
//         father_name: '',
//         mother_name: '',
//         full_name: '',
//         dob: '',
//         gender: '',
//         religion: '',
//         mobile: '',
//         email: '',
//         password: '',
//         signature_image: '',
//         photo: '',
//         modified_by: modified_by
//     });

//     const [currentDate, setCurrentDate] = useState([])
//     const handleDateChange = (event) => {
//         const selectedDate = event.target.value; // Directly get the value from the input

//         const day = String(selectedDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
//         const month = String(selectedDate.split('-')[1]).padStart(2, '0');
//         const year = String(selectedDate.split('-')[0]);
//         const formattedDate = `${day}-${month}-${year}`;
//         const formattedDatabaseDate = `${year}-${month}-${day}`;
//         setCurrentDate(formattedDate)
//         setUser(prevData => ({
//             ...prevData,
//             dob: formattedDatabaseDate // Update the period_name field in the state
//         }));
//     };
//     console.log(currentDate)

//     // const period_name = allEmployeeList.dob;
//     // const formattedDate = period_name.split('T')[0];
//     const [reformattedDate, setReformattedDate] = useState('');

//     useEffect(() => {
//         const period_name = user.dob;
//         const formattedDate = period_name?.split('T')[0];

//         if (formattedDate?.includes('-')) {
//             const [year, month, day] = formattedDate.split('-');
//             setReformattedDate(`${day}-${month}-${year}`);
//         } else {
//             console.log("Date format is incorrect:", formattedDate);
//         }
//     }, [user]);



//     const [selectedDate, setSelectedDate] = useState([]);
//     const [formattedDisplayDate, setFormattedDisplayDate] = useState('');

//     const handleDateSelection = (event) => {
//         const inputDate = event.target.value; // Directly get the value from the input

//         const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
//         const month = String(inputDate.split('-')[1]).padStart(2, '0');
//         const year = String(inputDate.split('-')[0]);
//         const formattedDate = `${day}-${month}-${year}`;
//         const formattedDatabaseDate = `${year}-${month}-${day}`;
//         setSelectedDate(formattedDate);
//         setFieldes(prevData => ({
//             ...prevData,
//             join_date: formattedDatabaseDate // Update the dob field in the state
//         }));
//     };

//     console.log(selectedDate);

//     useEffect(() => {
//         const dob = fieldes.join_date;
//         const formattedDate = dob?.split('T')[0];

//         if (formattedDate?.includes('-')) {
//             const [year, month, day] = formattedDate.split('-');
//             setFormattedDisplayDate(`${day}-${month}-${year}`);
//         } else {
//             console.log("Date format is incorrect:", formattedDate);
//         }
//     }, [fieldes]);


//     console.log(reformattedDate)
//     console.log(currentDate)


//     console.log(allEmployeeList)

//     useEffect(() => {
//         setUser({
//             father_name: allEmployeeList.father_name,
//             mother_name: allEmployeeList.mother_name,
//             full_name: allEmployeeList.full_name,
//             dob: allEmployeeList.dob,
//             gender: allEmployeeList.gender,
//             religion: allEmployeeList.religion, // Corrected
//             mobile: allEmployeeList.mobile, // Corrected
//             email: allEmployeeList.email,
//             password: allEmployeeList.password,
//             signature_image: uploadedImageUrl ? uploadedImageUrl : allEmployeeList.signature_image,
//             photo: uploadedFileUrl ? uploadedFileUrl : allEmployeeList.photo,
//             modified_by: modified_by
//         });
//     }, [allEmployeeList, modified_by, uploadedImageUrl, uploadedFileUrl])

// // console.log(fieldes.educational_qualifications[0])

//     useEffect(() => {

//         setFieldes({
//             // user_id: allEmployeeList.user_id,
//             educational_qualifications: allEmployeeList.educational_qualifications,
//             // qualification: allEmployeeList.qualification,
//             experience: allEmployeeList.experience,
//             education: allEmployeeList.education,
//             institute: allEmployeeList.institute,
//             result: allEmployeeList.result,
//             passing_year: allEmployeeList.passing_year,
//             living_division_id: allEmployeeList.living_division_id,
//             living_district_id: allEmployeeList.living_district_id,
//             living_upazila_id: allEmployeeList.living_upazila_id,
//             living_address: allEmployeeList.living_address,
//             permanent_division_id: allEmployeeList.permanent_division_id,
//             permanent_district_id: allEmployeeList.permanent_district_id,
//             permanent_upazila_id: allEmployeeList.permanent_upazila_id,
//             permanent_address: allEmployeeList.permanent_address,
//             join_date: allEmployeeList.join_date,
//             payroll_id: allEmployeeList.payroll_id,
//             school_shift_id: allEmployeeList.school_shift_id,
//             designation_id: allEmployeeList.designation_id,
//             branch_id: allEmployeeList.branch_id,
//             modified_by: modified_by
//         });

//     }, [allEmployeeList, modified_by]);

//     console.log(allEmployeeList.result)
//     console.log(fieldes.experience)


//     console.log(id)

//     const employee_input_change = (event) => {
//         const name = event.target.name
//         const value = event.target.value
//         const attribute = { ...fieldes }
//         attribute[name] = value
//         setFieldes(attribute)
//         // setSameBrandName('')

//     };

//     const users_input_change = (event) => {
//         const name = event.target.name
//         const value = event.target.value
//         const attribute = { ...user }
//         attribute[name] = value

//         const fullName = attribute['full_name'];
//         if (fullName) {
//             setFullName(""); // Clear the error message
//         }

//         const fatherName = attribute['father_name'];
//         if (fatherName) {
//             setFatherName(""); // Clear the error message
//         }

//         const motherName = attribute['mother_name'];
//         if (motherName) {
//             setMotherName(""); // Clear the error message
//         }

//         const gender = attribute['gender'];
//         if (gender) {
//             setGender(""); // Clear the error message
//         }

//         const religion = attribute['religion'];
//         if (religion) {
//             setReligion(""); // Clear the error message
//         }


//         const dateOfBath = attribute['dob'];
//         if (dateOfBath) {
//             setDob(""); // Clear the error message
//         }

//         const mobile = attribute['mobile'];
//         if (mobile) {
//             setMobile(""); // Clear the error message
//         }

//         const email = attribute['email'];
//         if (email) {
//             setEmail(""); // Clear the error message
//         }

//         const password = attribute['password'];
//         if (password) {
//             setPassword(""); // Clear the error message
//         }



//         setUser(attribute)


//     };




//     const router = useRouter()
//     const employee_edit = (e) => {
//         e.preventDefault();



//         // if (!user.full_name) {
//         //     setFullName('Name Must Be filled')
//         // }
//         // if (!user.father_name) {
//         //     setFatherName('Father Name Must Be filled')
//         // }

//         // if (!user.mother_name) {
//         //     setMotherName('Mother Name Must Be filled')
//         // }

//         // if (!user.gender) {
//         //     setGender('Gender Name Must Be filled')
//         // }

//         // if (!user.dob) {
//         //     setDob('Date Of Birth Day  Must Be filled')
//         // }
//         // if (!user.religion) {
//         //     setReligion('Religion  Must Be filled')
//         // }
//         // if (!user.mobile) {
//         //     setMobile('Mobile Number  Must Be filled')
//         // }

//         // if (!user.email) {
//         //     setEmail('Email  Must Be filled')
//         // }

//         // if (!experience) {
//         //     setExperience('experience  Must Be filled')
//         // }
//         // if (!user.password) {
//         //     setPassword('Password  Must Be filled')
//         // }



//         // if (!fieldes.join_date) {
//         //     setJoinDate('Join Date Must Be filled')
//         // }
//         // if (!fieldes.designation_id) {
//         //     setDesignation('Designation Must Be filled')
//         // }

//         // if (!fieldes.employee_id) {
//         //     setEmployeeId('employee Id Must Be filled')
//         // }

//         // if (!fieldes.school_shift_id) {
//         //     setShift('School Shift Must Be filled')
//         // }
//         // if (!fieldes.payroll_id) {
//         //     setPayroll('Payroll  Must Be filled')
//         // }



//         // const newErrors = new Array(fields.length).fill('');
//         // const isValid = fields.every((inputValue, index) => {
//         //     if (!inputValue.education) {
//         //         newErrors[index] = 'Education Name must be filled.';
//         //         return false;
//         //     }
//         //     return true;
//         // });

//         // if (!isValid) {
//         //     setEducation(newErrors);
//         //     return;
//         // }
//         // setEducation(new Array(fields.length).fill(''));

//         // const newError = new Array(fields.length).fill('');
//         // const isValids = fields.every((inputValue, index) => {
//         //     if (!inputValue?.institute) {
//         //         newError[index] = 'Institute Name must be filled.';
//         //         return false;
//         //     }
//         //     return true;
//         // });

//         // if (!isValids) {
//         //     setSchool(newError);
//         //     return;
//         // }
//         // setSchool(new Array(fields.length).fill(''));


//         // const newErrorName = new Array(fields.length).fill('');
//         // const isValidsName = fields.every((inputValue, index) => {
//         //     if (!inputValue?.result) {
//         //         newErrorName[index] = 'Result must be filled.';
//         //         return false;
//         //     }
//         //     return true;
//         // });

//         // if (!isValidsName) {
//         //     setResult(newErrorName);
//         //     return;
//         // }
//         // setResult(new Array(fields.length).fill(''));


//         // const newErrorGender = new Array(fields.length).fill('');
//         // const isValidsGender = fields.every((inputValue, index) => {
//         //     if (!inputValue?.passing_year) {
//         //         newErrorGender[index] = 'Passing Year must be filled.';
//         //         return false;
//         //     }
//         //     return true;
//         // });

//         // if (!isValidsGender) {
//         //     setPassingYear(newErrorGender);
//         //     return;
//         // }
//         // setPassingYear(new Array(fields.length).fill(''));


//         const apiUrl1 = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_edit/${id}`;
//         const apiUrl2 = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee_user/employee_user_update/${id}`;



//         const requestOptions1 = {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//                 // You may need to include additional headers here depending on your API requirements
//             },
//             body: JSON.stringify(fieldes)
//         };

//         const requestOptions2 = {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//                 // You may need to include additional headers here depending on your API requirements
//             },
//             body: JSON.stringify(user)
//         };

//         Promise.all([
//             fetch(apiUrl1, requestOptions1),
//             fetch(apiUrl2, requestOptions2)
//         ])
//             .then(responses => {
//                 return Promise.all(responses.map(response => response.json()));
//             })
//             .then(data => {
//                 // data[0] contains response from apiUrl1
//                 // data[1] contains response from apiUrl2
//                 console.log("Response from API 1:", data[0]);
//                 console.log("Response from API 2:", data[1]);
//                 // Handle the data here
//             })
//             .catch(error => {
//                 console.error("Error fetching data:", error);
//                 // Handle errors here
//             });
//     };



//     // const employee_edit = (e) => {
//     //     e.preventDefault()

//     //     // First API endpoint
//     //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee_user/employee_user_update/${id}`, {
//     //         method: 'POST',
//     //         headers: {
//     //             'Content-Type': 'application/json'
//     //         },
//     //         body: JSON.stringify(fields)
//     //     })
//     //         .then(response => {

//     //             response.json()
//     //             if (response.ok === true) {
//     //                 sessionStorage.setItem("message", "Data Update successfully!");
//     //                 // Call the second API endpoint here
//     //                 fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_edit/${id}`, {
//     //                     method: 'POST',
//     //                     headers: {
//     //                         'Content-Type': 'application/json'
//     //                     },
//     //                     body: JSON.stringify(user) // Assuming fields is the data you want to send to the second endpoint
//     //                 })
//     //                     .then(response => response.json())
//     //                     .then(data => {
//     //                         console.log(data);
//     //                         // Handle success or show a success message to the user
//     //                     })
//     //                     .catch(error => {
//     //                         console.error('Error updating employee user:', error);
//     //                         // Handle error or show an error message to the user
//     //                     });
//     //             }

//     //         })
//     //         .then(data => {
//     //             console.log(data);
//     //         //    andle success or show a success message to the user
//     //         })
//     //         .catch(error => {
//     //             console.error('Error updating employee:', error);
//     //             // Handle error or show an error message to the user
//     //         });
//     // };


//     // const employee_edit = (e) => {
//     //     e.preventDefault()


//     //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_edit/${id}`, {
//     //         method: 'POST',
//     //         headers: {
//     //             'Content-Type': 'application/json'
//     //         },
//     //         body: JSON.stringify(fieldes)
//     //     })
//     //         .then(response => response.json())
//     //         .then(data => {
//     //             console.log(data);
//     //             if (data.affectedRows > 0) {
//     //                 sessionStorage.setItem("message", "Data Update successfully!");
//     //                 // router.push('/Admin/brand/brand_all')

//     //             }
//     //             // Handle success or show a success message to the user
//     //         })
//     //         .catch(error => {
//     //             console.error('Error updating brand:', error);
//     //             // Handle error or show an error message to the user
//     //         });


//     // };







//     const [selectedFile, setSelectedFile] = useState(null);
//     const [fileNames, setFileNames] = useState([]);
//     const [fileSizeError, setFileSizeError] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [uploadProgress, setUploadProgress] = useState(0);


//     const brandFileChange = (e) => {
//         const file = e.target.files[0];
//         const now = new Date();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const day = String(now.getDate()).padStart(2, '0');
//         const hours = String(now.getHours()).padStart(2, '0');
//         const minutes = String(now.getMinutes()).padStart(2, '0');

//         const fileName = file.name.split('.')[0];
//         const extension = file.name.split('.').pop();
//         const newName = `${fileName}.${extension}`;
//         const time = `${year}/${month}/${day}/${hours}/${minutes}`;
//         const path = `brand/${time}/${newName}`;

//         const newSelectedFile = { ...file, path };

//         if (file.size <= 2097152) {
//             setFileSizeError("");
//             setFileNames(newName);
//             setSelectedFile(newSelectedFile);
//             setUploadProgress(0); // Reset progress when a new file is selected
//             upload(file, path);
//         } else {
//             setFileSizeError("Max file size 2 MB");
//         }

//         const previewUrl = URL.createObjectURL(file);
//         setPreviewUrl(previewUrl);
//     };

//     const upload = (file, path) => {
//         const formData = new FormData();
//         const extension = file.name.split('.').pop();
//         const fileName = file.name.split('.')[0];
//         const newName = `${fileName}.${extension}`;
//         formData.append('files', file, newName);

//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/brand/brand_image`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             },
//             onUploadProgress: (progressEvent) => {
//                 const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                 setUploadProgress(percentCompleted);
//             }
//         })
//             .then(res => {
//                 console.log(res);
//                 setUploadProgress(100); // Set progress to 100% on success
//                 setUploadedFileUrl(path); // Set the uploaded file URL to show the image
//             })
//             .catch(err => {
//                 console.log(err);
//                 setUploadProgress(0); // Reset the progress bar on error
//             });
//     };


//     const [currentFile, setCurrentFile] = useState(null);
//     const [fileList, setFileList] = useState([]);
//     const [errorMessage, setErrorMessage] = useState(null);
//     const [previewImage, setPreviewImage] = useState(null);
//     const [progressPercentage, setProgressPercentage] = useState(0);



//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         const now = new Date();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const day = String(now.getDate()).padStart(2, '0');
//         const hours = String(now.getHours()).padStart(2, '0');
//         const minutes = String(now.getMinutes()).padStart(2, '0');

//         const fileName = file.name.split('.')[0];
//         const extension = file.name.split('.').pop();
//         const newName = `${fileName}.${extension}`;
//         const time = `${year}/${month}/${day}/${hours}/${minutes}`;
//         const path = `brand/${time}/${newName}`;

//         const newFile = { ...file, path };

//         if (file.size <= 2097152) {
//             setErrorMessage("");
//             setFileList(newName);
//             setCurrentFile(newFile);
//             setProgressPercentage(0); // Reset progress when a new file is selected
//             uploadFile(file, path);
//         } else {
//             setErrorMessage("Max file size 2 MB");
//         }

//         const previewImage = URL.createObjectURL(file);
//         setPreviewImage(previewImage);
//     };

//     const uploadFile = (file, path) => {
//         const formData = new FormData();
//         const extension = file.name.split('.').pop();
//         const fileName = file.name.split('.')[0];
//         const newName = `${fileName}.${extension}`;
//         formData.append('files', file, newName);

//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/brand/brand_image`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             },
//             onUploadProgress: (progressEvent) => {
//                 const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                 setProgressPercentage(percentCompleted);
//             }
//         })
//             .then(res => {
//                 console.log(res);
//                 setProgressPercentage(100); // Set progress to 100% on success
//                 setUploadedImageUrl(path); // Set the uploaded file URL to show the image
//             })
//             .catch(err => {
//                 console.log(err);
//                 setProgressPercentage(0); // Reset the progress bar on error
//             });
//     };

//     console.log(uploadedImageUrl)

//     const { data: genderList = [],
//     } = useQuery({
//         queryKey: ['genderList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/gender/gender_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: religionList = [],
//     } = useQuery({
//         queryKey: ['religionList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: designationList = [],
//     } = useQuery({
//         queryKey: ['designationList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: branchAll = [],
//     } = useQuery({
//         queryKey: ['branchAll'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`)

//             const data = await res.json()
//             return data
//         }
//     })


//     console.log(uploadedImageUrl)

//     return (
//         <div className="container-fluid">

//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create School Shift</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/school_shift/school_shift_all?page_group`} className="btn btn-sm btn-info">Back School Shift List</Link>
//                                     </div>
//                                 </div>
//                                 <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                 </div>
//                                 <div class="card-body ">
//                                     <form class="" method="post" autocomplete="off" onSubmit={employee_edit}>
//                                         <div class="card bg-white mb-3 shadow-sm ">
//                                             <div class="card-header p-2   bg-light ">
//                                                 <div class="card-title font-weight-bold mb-0  float-left mt-1">Employee Information</div>
//                                             </div>
//                                             <div class="card-body">
//                                                 <div class=" row no-gutters">
//                                                     <div class="col-md-6">
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-right">Father Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input type="text" required=""
//                                                                     value={user.father_name}
//                                                                     onChange={users_input_change}
//                                                                     name="father_name" class="form-control form-control-sm  required " id="father_name" placeholder="Enter Father Name" />
//                                                                 {
//                                                                     fatherName && <p className='text-danger'>{fatherName}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-right">Full Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input
//                                                                     onChange={users_input_change}
//                                                                     value={user.full_name}
//                                                                     type="text" required="" name="full_name" class="form-control form-control-sm  required " id="full_name" placeholder="Enter Full Name" />
//                                                                 {
//                                                                     fullName && <p className='text-danger'>{fullName}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Gender:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
//                                                                     onChange={users_input_change}
//                                                                     value={user.gender}
//                                                                     required="" name="gender" class="form-control form-control-sm  required integer_no_zero" id="gender_name">
//                                                                     <option value=''>Select Gender</option>
//                                                                     {
//                                                                         genderList.map(gender =>

//                                                                             <>
//                                                                                 <option value={gender.id}>{gender.gender_name}</option>

//                                                                             </>
//                                                                         )
//                                                                     }
//                                                                 </select>
//                                                                 {
//                                                                     gender && <p className='text-danger'>{gender}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Mobile:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <input type="text"
//                                                                     onChange={users_input_change}
//                                                                     value={user.mobile}
//                                                                     required="" name="mobile" maxlength="11" class="form-control form-control-sm  required " id="mobile" placeholder="Enter Mobile" />
//                                                                 {
//                                                                     mobile && <p className='text-danger'>{mobile}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold">Year of Experience:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <input
//                                                                     onChange={employee_input_change}
//                                                                     value={fieldes.experience}
//                                                                     type="text" required="" name="experience" class="form-control form-control-sm  required " id="experience" placeholder="Enter Year of Experience" />
//                                                                 {
//                                                                     experience && <p className='text-danger'>{experience}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  ">Confirm Password:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input

//                                                                     type="password" required="" name="confirm_password" class="form-control form-control-sm  required matches_password" id="confirm_password" placeholder="Enter Confirm Password" />
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div class="col-md-6">
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-right">Mother Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input type="text"
//                                                                     onChange={users_input_change}
//                                                                     value={user.mother_name}
//                                                                     required="" name="mother_name" class="form-control form-control-sm  required " id="mother_name" placeholder="Enter Mother Name" />
//                                                                 {
//                                                                     motherName && <p className='text-danger'>{motherName}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-right">Date of Birth:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>

//                                                             <div class="col-md-8">
//                                                                 {/* <input type="date"
//                                                                     onChange={users_input_change}
//                                                                     value={user.dob}
//                                                                     name="dob" class="form-control form-control-sm  required urban_datepicker" id="dob" placeholder="Enter Date of Birth" /> */}
//                                                                 <input
//                                                                     type="text"
//                                                                     readOnly

//                                                                     defaultValue={reformattedDate}
//                                                                     onClick={() => document.getElementById(`dateInput-n`).showPicker()}
//                                                                     placeholder="dd-mm-yyyy"
//                                                                     className="form-control form-control-sm mb-2"
//                                                                     style={{ display: 'inline-block', }}
//                                                                 />
//                                                                 <input
//                                                                     name='dob'
//                                                                     type="date"
//                                                                     id={`dateInput-n`}
//                                                                     onChange={(e) => handleDateChange(e)}
//                                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                                                 />
//                                                                 {
//                                                                     dob && <p className='text-danger'>{dob}</p>
//                                                                 }

//                                                             </div>

//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Religion:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
//                                                                     onChange={users_input_change}
//                                                                     value={user.religion}
//                                                                     required="" name="religion" class="form-control form-control-sm  required integer_no_zero">
//                                                                     <option value=''>Select Religion</option>
//                                                                     {
//                                                                         religionList.map(religion =>

//                                                                             <>
//                                                                                 <option value={religion.id}>{religion.name}</option>

//                                                                             </>
//                                                                         )
//                                                                     }
//                                                                 </select>
//                                                                 {
//                                                                     religion && <p className='text-danger'>{religion}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Email ID:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <input
//                                                                     onChange={users_input_change}
//                                                                     value={user.email}
//                                                                     type="text" required="" name="email" class="form-control form-control-sm  required " id="email" placeholder="Enter Email ID" />
//                                                                 {
//                                                                     email && <p className='text-danger'>{email}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-right"> Password:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input
//                                                                     onChange={users_input_change}
//                                                                     type="password" required="" name="password" class="form-control form-control-sm  required password" id="password" placeholder="Enter password" />
//                                                                 {
//                                                                     password && <p className='text-danger'>{password}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>


//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>


//                                         <div>
//                                             <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary text-white">

//                                                 <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
//                                                     <strong>Educational Qualification</strong>
//                                                 </div>

//                                                 <div className="card-title card-header-color font-weight-bold mb-0 float-right">
//                                                     <div className="input-group printable">
//                                                         <input
//                                                             style={{ width: '80px' }}
//                                                             type="number"
//                                                             min="1"
//                                                             className="form-control "
//                                                             placeholder="Enter number of forms to add"
//                                                             value={numToAdd}
//                                                             onChange={(event) => setNumToAdd(event.target.value)}
//                                                         />
//                                                         <div className="input-group-append">
//                                                             <button
//                                                                 type="button"
//                                                                 className="btn btn-info btn-sm py-1 add_more "
//                                                                 onClick={handleAddMore}
//                                                             >
//                                                                 Add More
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <div className="form-group row px-3 ">
//                                                     <table className="table table-bordered  table-hover table-striped table-sm">
//                                                         <thead>
//                                                             <tr>
//                                                                 <th>Education<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
//                                                                 <th>School/College/University<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
//                                                                 <th>Result<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
//                                                                 <th>Passing Year<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
//                                                                 <th>Action</th>
//                                                             </tr>

//                                                         </thead>

//                                                         <tbody>

//                                                             {isLoading ? <div className='text-center'>
//                                                                 <div className='  text-center text-dark'>

//                                                                     <FontAwesomeIcon style={{
//                                                                         height: '33px',
//                                                                         width: '33px',
//                                                                     }} icon={faSpinner} spin />

//                                                                 </div>
//                                                             </div>

//                                                                 :


//                                                                 <>

//                                                                     {
//                                                                         fields.map((field, index) => (
//                                                                             <>

//                                                                                 <tr >
//                                                                                     <td>
//                                                                                         <select
//                                                                                         value={field?.educational_qualifications?.education}
//                                                                                             // value={fieldes.education ? fieldes.education : field.education}
//                                                                                             onChange={(e) => { handleChange(index, e); employee_input_change(e) }}
//                                                                                             required="" name="education" class="form-control form-control-sm  trim integer_no_zero row_unique_education" id="education" placeholder="Enter Education">
//                                                                                             <option >Select Education</option>
//                                                                                             {
//                                                                                                 educationName.map(educations =>
//                                                                                                     <>
//                                                                                                         <option value={educations.id}>
//                                                                                                             {educations.education_name}
//                                                                                                         </option>
//                                                                                                     </>

//                                                                                                 )
//                                                                                             }

//                                                                                         </select>
//                                                                                         {
//                                                                                             education[index] &&
//                                                                                             <p className='text-danger'>{education[index]}</p>
//                                                                                         }
//                                                                                     </td>
//                                                                                     <td>
//                                                                                         <input
//                                                                                             value={field?.educational_qualifications?.institute}
//                                                                                             // value={fieldes.institute ? fieldes.institute : field.institute}
//                                                                                             onChange={(e) => { handleChange(index, e); employee_input_change(e) }}
//                                                                                             type="text" required="" name="institute" class="form-control form-control-sm  required row_unique_institute" id="institute" placeholder="Enter Institute" />
//                                                                                         {
//                                                                                             School[index] &&
//                                                                                             <p className='text-danger'>{School[index]}</p>
//                                                                                         }
//                                                                                     </td>
//                                                                                     <td>
//                                                                                         <input
//                                                                                             value={field?.educational_qualifications?.result}
//                                                                                             // value={fieldes.result ? fieldes.result : field.result}
//                                                                                             onChange={(e) => { handleChange(index, e); employee_input_change(e) }}
//                                                                                             type="text" required="" name="result" class="form-control form-control-sm  required row_unique_result" id="result" placeholder="Enter Result" />
//                                                                                         {
//                                                                                             result[index] &&
//                                                                                             <p className='text-danger'>{result[index]}</p>
//                                                                                         }
//                                                                                     </td>
//                                                                                     <td>
//                                                                                         <input
//                                                                                             value={field?.educational_qualifications?.passing_year }
//                                                                                             // value={fieldes.passing_year ? fieldes.passing_year : field.passing_year}
//                                                                                             onChange={(e) => { handleChange(index, e); employee_input_change(e) }}
//                                                                                             type="text" required="" name="passing_year" class="form-control form-control-sm  required row_unique_passing_year" id="passing_year" placeholder="Enter Passing Year" />
//                                                                                         {
//                                                                                             passingYear[index] && <p className='text-danger'>{passingYear[index]}</p>
//                                                                                         }
//                                                                                     </td>
//                                                                                     <td>
//                                                                                         <button
//                                                                                             onClick={() => handleRemoveField(index)}
//                                                                                             type="button" class="btn btn-sm btn-danger btn-sm remove delete"><i class="fas fa-trash-alt"></i></button>
//                                                                                     </td>


//                                                                                 </tr>
//                                                                             </>
//                                                                         ))
//                                                                     }
//                                                                 </>
//                                                             }
//                                                         </tbody>

//                                                     </table>


//                                                 </div>
//                                             </div>
//                                         </div>


//                                         <div class=" row">


//                                             <div class="col-md-6">
//                                                 <div class="card bg-white mb-3 shadow-sm ">
//                                                     <div class="card-header p-2   bg-light ">
//                                                         <div class="card-title font-weight-bold mb-0  float-left mt-1">Living Address</div>
//                                                     </div>
//                                                     <div class="card-body">
//                                                         <div class=" row no-gutters">
//                                                             <div class="col-md-12">
//                                                                 <div class="form-group row no-gutters">
//                                                                     <div class="col-md-3"><label class="font-weight-bold  text-right">Division:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div class="col-md-8">

//                                                                         <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} required="" name="ldivision_id" class=" form-control form-control-sm  required integer_no_zero ldivision">
//                                                                             <option value="">Select Division</option>
//                                                                             {
//                                                                                 divisions.map(division =>

//                                                                                     <>
//                                                                                         <option value={division.id}>{division.division_bn}</option>

//                                                                                     </>
//                                                                                 )
//                                                                             }

//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div class="form-group row no-gutters">
//                                                                     <div class="col-md-3"><label class="font-weight-bold  text-right">District:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div class="col-md-8">
//                                                                         <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} required="" name="ldistrict_id" class=" form-control form-control-sm  required integer_no_zero ldistrict">
//                                                                             <option value="">Select District</option>
//                                                                             {
//                                                                                 filteredDistricts.map(districts =>

//                                                                                     <>

//                                                                                         <option value={districts.id}>{districts.district_bn}</option>
//                                                                                     </>
//                                                                                 )
//                                                                             }
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div class="form-group row no-gutters">
//                                                                     <div class="col-md-3"><label class="font-weight-bold  text-right">Upazila:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div class="col-md-8">
//                                                                         <select
//                                                                             value={selectedUpazila}
//                                                                             onChange={handleUpazilaChange}
//                                                                             required="" name="lupazila_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
//                                                                             <option value="">Select Upazila</option>
//                                                                             {
//                                                                                 filteredUpazilas.map(upazila =>

//                                                                                     <>
//                                                                                         <option value={upazila.id}>{upazila.upazila_bn}</option>
//                                                                                     </>
//                                                                                 )
//                                                                             }
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div class="form-group row no-gutters">
//                                                                     <div class="col-md-3"><label class="font-weight-bold  text-right">Address:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div class="col-md-8">
//                                                                         <input
//                                                                             type="text"
//                                                                             required=""
//                                                                             name="laddress"
//                                                                             className="form-control form-control-sm required"
//                                                                             id="address"
//                                                                             placeholder="Enter Address"
//                                                                             value={livingAddress}
//                                                                             onChange={handleLivingAddressChange}
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>



//                                             <div className="col-md-6">
//                                                 <div className="card bg-white mb-3 shadow-sm ">
//                                                     <div className="card-header p-2 bg-light clearfix">
//                                                         <div className="card-title font-weight-bold mb-0 float-left mt-1">Permanent Address</div>
//                                                         <div className="form-check form-check-inline float-right">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 name="same_as"
//                                                                 className="same_as"
//                                                                 value="1"
//                                                                 id="sameAsCheckbox"
//                                                                 checked={isSameAsLivingAddress}
//                                                                 onChange={() => setIsSameAsLivingAddress(!isSameAsLivingAddress)}
//                                                             />
//                                                             <label className="font-weight-bold form-check-label ml-2" htmlFor="inlineCheckbox1">Same as Living Address</label>
//                                                         </div>
//                                                     </div>
//                                                     <div className="card-body">
//                                                         <div className="row no-gutters">
//                                                             <div className="col-md-12">
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3">
//                                                                         <label className="font-weight-bold text-right">Division:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                                                     </div>
//                                                                     <div className="col-md-8">
//                                                                         <select
//                                                                             value={isSameAsLivingAddress ? selectedDivision : selectedDivisionCopy}
//                                                                             onChange={(e) => setSelectedDivisionCopy(e.target.value)}
//                                                                             required=""
//                                                                             name="pdivision_id"
//                                                                             className="form-control form-control-sm required integer_no_zero pdivision"
//                                                                             disabled={isSameAsLivingAddress}
//                                                                         >
//                                                                             <option value="">Select Division</option>
//                                                                             {divisions.map(division => (
//                                                                                 <option key={division.id} value={division.id}>{division.division_bn}</option>
//                                                                             ))}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3">
//                                                                         <label className="font-weight-bold text-right">District:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                                                     </div>
//                                                                     <div className="col-md-8">
//                                                                         <select
//                                                                             value={isSameAsLivingAddress ? selectedDistrict : selectedDistrictCopy}
//                                                                             onChange={(e) => setSelectedDistrictCopy(e.target.value)}
//                                                                             required=""
//                                                                             name="pdistrict_id"
//                                                                             className="form-control form-control-sm required integer_no_zero pdistrict"
//                                                                             disabled={isSameAsLivingAddress}
//                                                                         >
//                                                                             <option value="">Select District</option>
//                                                                             {(isSameAsLivingAddress ? filteredDistricts : filteredDistrictsCopy).map(districts => (
//                                                                                 <option key={districts.id} value={districts.id}>{districts.district_bn}</option>
//                                                                             ))}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3">
//                                                                         <label className="font-weight-bold text-right">Upazila:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                                                     </div>
//                                                                     <div className="col-md-8">
//                                                                         <select
//                                                                             required=""
//                                                                             name="pupazila_id"
//                                                                             className="form-control form-control-sm required integer_no_zero pupazila"
//                                                                             value={isSameAsLivingAddress ? selectedUpazila : ""}
//                                                                             onChange={handleUpazilaChange}
//                                                                             disabled={isSameAsLivingAddress}
//                                                                         >
//                                                                             <option value="">Select Upazila</option>
//                                                                             {(isSameAsLivingAddress ? filteredUpazilas : filteredUpazilasCopy).map(upazila => (
//                                                                                 <option key={upazila.id} value={upazila.id}>{upazila.upazila_bn}</option>
//                                                                             ))}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3">
//                                                                         <label className="font-weight-bold text-right">Address:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                                                     </div>
//                                                                     <div className="col-md-8">
//                                                                         <input
//                                                                             type="text"
//                                                                             required=""
//                                                                             name="paddress"
//                                                                             className="form-control form-control-sm required"
//                                                                             id="paddress"
//                                                                             placeholder="Enter Address"
//                                                                             value={isSameAsLivingAddress ? livingAddress : ""}
//                                                                             disabled={isSameAsLivingAddress}
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>


//                                         </div>

//                                         <div class="card bg-white mb-3 shadow-sm ">
//                                             <div class="card-header p-2   bg-light ">
//                                                 <div class="card-title font-weight-bold mb-0  float-left mt-1">Joining Information</div>
//                                             </div>
//                                             <div class="card-body">
//                                                 <div class=" row no-gutters">
//                                                     <div class="col-md-6">
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Join Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 {/* <input type="date" name="join_date" class="form-control form-control-sm  required urban_datepicker" id="join_date" placeholder="Enter Join Date" /> */}
//                                                                 <input
//                                                                     type="text"
//                                                                     readOnly

//                                                                     defaultValue={formattedDisplayDate}
//                                                                     onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
//                                                                     placeholder="dd-mm-yyyy"
//                                                                     className="form-control form-control-sm mb-2"
//                                                                     style={{ display: 'inline-block', }}
//                                                                 />
//                                                                 <input
//                                                                     name='join_date'
//                                                                     type="date"
//                                                                     id={`dateInput-nt`}
//                                                                     onChange={(e) => handleDateSelection(e)}
//                                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                                                 />
//                                                                 {
//                                                                     joinDate && <p className='text-danger'>{joinDate}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>

//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Employee ID:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <input
//                                                                     onChange={employee_input_change}
//                                                                     type="text" required="" name="finger_print_id" class=" form-control form-control-sm  required " id="finger_print_id" placeholder="Enter Employee ID" />
//                                                                 {
//                                                                     employeeId && <p className='text-danger'>{employeeId}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Branch :<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
//                                                                     onChange={employee_input_change}
//                                                                     value={fieldes.branch_id}
//                                                                     name="branch_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
//                                                                     <option value="">Select Branch</option>
//                                                                     {
//                                                                         branchAll.map(branch =>

//                                                                             <>
//                                                                                 <option value={branch.id}>{branch.branch_name}</option>
//                                                                             </>
//                                                                         )
//                                                                     }
//                                                                 </select>
//                                                                 {
//                                                                     shift && <p className='text-danger'>{shift}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div class="col-md-6">
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Designation:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
//                                                                     value={fieldes.designation_id}
//                                                                     onChange={employee_input_change}
//                                                                     required="" name="designation_id" class=" form-control form-control-sm  required integer_no_zero " id="designation_name">
//                                                                     <option value="">Select Designation</option>
//                                                                     {
//                                                                         designationList.map(designation =>
//                                                                             <>
//                                                                                 <option value={designation.id}>{designation.designation_name}</option>

//                                                                             </>
//                                                                         )
//                                                                     }
//                                                                 </select>
//                                                                 {
//                                                                     designation && <p className='text-danger'>{designation}</p>
//                                                                 }

//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Payroll:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
//                                                                     value={fieldes.payroll_id}
//                                                                     onChange={employee_input_change}
//                                                                     required="" name="payroll_id" class="form-control form-control-sm  required integer_no_zero " id="title">

//                                                                     <option value="">Select Payroll</option>
//                                                                     {payRoll.map(item => (
//                                                                         < >
//                                                                             <option value={item.id}>{`${item.title} (${item.basic}/-)`}</option>
//                                                                         </>
//                                                                     ))}
//                                                                 </select>
//                                                                 {
//                                                                     payroll && <p className='text-danger'>{payroll}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Shift:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
//                                                                     value={fieldes.school_shift_id}
//                                                                     onChange={employee_input_change}
//                                                                     required="" name="school_shift_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
//                                                                     <option value="">Select Shift</option>
//                                                                     {
//                                                                         schoolShiftList.map(upazila =>

//                                                                             <>
//                                                                                 <option value={upazila.id}>{upazila.name}</option>
//                                                                             </>
//                                                                         )
//                                                                     }
//                                                                 </select>
//                                                                 {
//                                                                     shift && <p className='text-danger'>{shift}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div class="card bg-white mb-3 shadow-sm ">
//                                             <div class="card-header p-2   bg-light ">
//                                                 <div class="card-title font-weight-bold mb-0  float-left mt-1">Attach Image</div>
//                                             </div>
//                                             <div class="card-body">
//                                                 <div class=" row no-gutters">
//                                                     <div className="col-md-6">
//                                                         <div className="form-group row no-gutters">
//                                                             <div className="col-md-3">
//                                                                 <label className="font-weight-bold text-right">Image:</label>
//                                                             </div>
//                                                             <div className="col-md-8">
//                                                                 <div>
//                                                                     <span className="btn btn-success btn-sm">
//                                                                         <label htmlFor="fileInput" className="mb-0">
//                                                                             <span className="ml-1">Select Image</span>
//                                                                         </label>
//                                                                         <input
//                                                                             name="file_path"
//                                                                             type="file"
//                                                                             id="fileInput"
//                                                                             style={{ display: 'none' }}
//                                                                             onChange={brandFileChange}
//                                                                         />
//                                                                     </span>
//                                                                 </div>

//                                                                 {fileSizeError && <div className="text-danger">{fileSizeError}</div>}
//                                                                 <div id="progress_client" className="progress">
//                                                                     <div
//                                                                         className="progress-bar progress_client1 progress-bar-success"
//                                                                         style={{ width: `${uploadProgress}%` }}
//                                                                     ></div>
//                                                                 </div>

//                                                                 <input type="text" className='d-none' value={uploadedFileUrl ? uploadedFileUrl : user.photo} name='photo' />

//                                                                 <div id="software_logo" className="logo bg-light img-thumbnail">
//                                                                     {uploadedFileUrl ? <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${uploadedFileUrl}`} alt="Uploaded" className="img-fluid" />
//                                                                         :
//                                                                         <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${user.photo}`} alt="Uploaded" className="img-fluid" />

//                                                                     }
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>





//                                                     <div className="col-md-6">
//                                                         <div className="form-group row no-gutters">
//                                                             <div className="col-md-3">
//                                                                 <label className="font-weight-bold text-right">Signature Image:</label>
//                                                             </div>
//                                                             <div className="col-md-8">
//                                                                 <div>
//                                                                     <span className="btn btn-success btn-sm">
//                                                                         <label htmlFor="fileInput1" className="mb-0">
//                                                                             <span className="ml-1">Select Image</span>
//                                                                         </label>
//                                                                         <input
//                                                                             name="file_path"
//                                                                             type="file"
//                                                                             id="fileInput1"
//                                                                             style={{ display: 'none' }}
//                                                                             onChange={handleFileChange}
//                                                                         />
//                                                                     </span>
//                                                                 </div>
//                                                                 {errorMessage && <div className="text-danger">{errorMessage}</div>}
//                                                                 <div id="progress_client" className="progress">
//                                                                     <div
//                                                                         className="progress-bar progress_client1 progress-bar-success"
//                                                                         style={{ width: `${progressPercentage}%` }}
//                                                                     ></div>
//                                                                 </div>

//                                                                 <input name='signature_image' type="text" className='d-none' value={uploadedImageUrl ? uploadedImageUrl : user.signature_image} />
//                                                                 <div id="software_logo" className="logo bg-light img-thumbnail">
//                                                                     {uploadedImageUrl ? <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${uploadedImageUrl}`} alt="Uploaded" className="img-fluid" />
//                                                                         :
//                                                                         <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${user.signature_image}`} alt="Uploaded" className="img-fluid" />
//                                                                     }
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>



//                                                 </div>
//                                                 <div class="row no-gutters">
//                                                     <div class="col-md-12 offset-md-3">
//                                                         <input type="submit" name="create" class="btn btn-sm btn-success" value="Submit" />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EmployeeEdit;


// // 'use client' 
 //ismile
// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';

// // const UpdateEmployee = ({ employeeData }) => {


// //     const data = {
// //         "id": 468,
// //         "user_id": 13895,
// //         "qualification": null,
// //         "experience": 0,
// //         "living_division_id": 0,
// //         "living_district_id": 0,
// //         "living_upazila_id": 0,
// //         "living_address": null,
// //         "permanent_division_id": 0,
// //         "permanent_district_id": 0,
// //         "permanent_upazila_id": 0,
// //         "permanent_address": null,
// //         "join_date": "2024-07-07T00:00:00.000Z",
// //         "payroll_id": 22,
// //         "school_shift_id": "13",
// //         "branch_id": 2,
// //         "designation_id": 1,
// //         "designation_name": "Principal",
// //         "full_name": "nayan hasan",
// //         "father_name": "aaa",
// //         "mother_name": "aaaa",
// //         "dob": "2024-06-11T00:00:00.000Z",
// //         "gender": 2,
// //         "religion": 1,
// //         "mobile": "01774412135",
// //         "email": "saklainmostak2135@gmail.com",
// //         "password": "aaaa",
// //         "signature_image": "brand/2024/06/22/16/43/Screenshot (5).png",
// //         "photo": "brand/2024/06/12/09/40/Screenshot (3).png",
// //         "educational_qualifications": [
// //             {
// //                 "education": 0,
// //                 "institute": "",
// //                 "result": "",
// //                 "passing_year": ""
// //             }
// //         ]
// //     }

// //     const [formData, setFormData] = useState({
// //         id: 0,
// //         user_id: '',
// //         full_name: '',
// //         dob: '',
// //         gender: '',
// //         religion: '',
// //         mobile: '',
// //         email: '',
// //         password: '',
// //         experience: '',
// //         living_division_id: '',
// //         living_district_id: '',
// //         living_upazila_id: '',
// //         living_address: '',
// //         permanent_division_id: '',
// //         permanent_district_id: '',
// //         permanent_upazila_id: '',
// //         permanent_address: '',
// //         join_date: '',
// //         payroll_id: '',
// //         school_shift_id: '',
// //         signature_image: '',
// //         photo: '',
// //         updated_by: '',
// //         designation_id: '',
// //         promotion_month: '',
// //         fields: [{ education: '', institute: '', result: '', passing_year: '' }] // Initializing with one qualification
// //     });

// //     useEffect(() => {
// //         if (employeeData) {
// //             setFormData({
// //                 ...employeeData,
// //                 dob: employeeData.dob.split('T')[0],
// //                 join_date: employeeData.join_date.split('T')[0],
// //                 fields: employeeData.educational_qualifications || [{ education: '', institute: '', result: '', passing_year: '' }]
// //             });
// //         }
// //     }, [employeeData]);

// //     const handleChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData({
// //             ...formData,
// //             [name]: value
// //         });
// //     };

// //     const handleQualificationChange = (index, e) => {
// //         const { name, value } = e.target;
// //         const newQualifications = [...formData.fields];
// //         newQualifications[index][name] = value;
// //         setFormData({ ...formData, fields: newQualifications });
// //     };

// //     const addQualification = () => {
// //         setFormData({
// //             ...formData,
// //             fields: [...formData.fields, { education: '', institute: '', result: '', passing_year: '' }]
// //         });
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         try {
// //             const response = await axios.post('/update_employee', formData);
// //             console.log('User updated and promotion data inserted successfully', response.data);
// //         } catch (error) {
// //             console.error('Error updating employee:', error);
// //         }
// //     };

// //     return (
// //         <form onSubmit={handleSubmit}>
// //             <input type="text" name="user_id" placeholder="User ID" value={formData.user_id} onChange={handleChange} required />
// //             <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} required />
// //             <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} required />
// //             <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} required />
// //             <input type="text" name="religion" placeholder="Religion" value={formData.religion} onChange={handleChange} required />
// //             <input type="tel" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} required />
// //             <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
// //             <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
// //             <input type="text" name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} required />
// //             <input type="text" name="living_division_id" placeholder="Division ID Living" value={formData.living_division_id} onChange={handleChange} required />
// //             <input type="text" name="living_district_id" placeholder="District ID Living" value={formData.living_district_id} onChange={handleChange} required />
// //             <input type="text" name="living_upazila_id" placeholder="Upazila ID Living" value={formData.living_upazila_id} onChange={handleChange} required />
// //             <input type="text" name="living_address" placeholder="Address ID Living" value={formData.living_address} onChange={handleChange} required />
// //             <input type="text" name="permanent_division_id" placeholder="Division ID Permanent" value={formData.permanent_division_id} onChange={handleChange} required />
// //             <input type="text" name="permanent_district_id" placeholder="District ID Permanent" value={formData.permanent_district_id} onChange={handleChange} required />
// //             <input type="text" name="permanent_upazila_id" placeholder="Upazila ID Permanent" value={formData.permanent_upazila_id} onChange={handleChange} required />
// //             <input type="text" name="permanent_address" placeholder="Address ID Permanent" value={formData.permanent_address} onChange={handleChange} required />
// //             <input type="date" name="join_date" placeholder="Join Date" value={formData.join_date} onChange={handleChange} required />
// //             <input type="text" name="payroll_id" placeholder="Payroll ID" value={formData.payroll_id} onChange={handleChange} required />
// //             <input type="text" name="school_shift_id" placeholder="School Shift ID" value={formData.school_shift_id} onChange={handleChange} required />
// //             <input type="text" name="signature_image" placeholder="Signature Image" value={formData.signature_image} onChange={handleChange} required />
// //             <input type="text" name="photo" placeholder="Photo" value={formData.photo} onChange={handleChange} required />
// //             <input type="text" name="updated_by" placeholder="Updated By" value={formData.updated_by} onChange={handleChange} required />
// //             <input type="text" name="designation_id" placeholder="Designation ID" value={formData.designation_id} onChange={handleChange} required />
// //             <input type="text" name="promotion_month" placeholder="Promotion Month" value={formData.promotion_month} onChange={handleChange} required />

// //             <div>
// //                 <h3>Educational Qualifications</h3>
// //                 {formData.fields.map((qualification, index) => (
// //                     <div key={index}>
// //                         <input type="text" name="education" placeholder="Education" value={qualification.education} onChange={(e) => handleQualificationChange(index, e)} required />
// //                         <input type="text" name="institute" placeholder="Institute" value={qualification.institute} onChange={(e) => handleQualificationChange(index, e)} required />
// //                         <input type="text" name="result" placeholder="Result" value={qualification.result} onChange={(e) => handleQualificationChange(index, e)} required />
// //                         <input type="text" name="passing_year" placeholder="Passing Year" value={qualification.passing_year} onChange={(e) => handleQualificationChange(index, e)} required />
// //                     </div>
// //                 ))}
// //                 <button type="button" onClick={addQualification}>Add More</button>
// //             </div>

// //             <button type="submit">Update Employee</button>
// //         </form>
// //     );
// // };

// // export default UpdateEmployee;
// // 'use client' 
 //ismile
// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';

// // const UpdateEmployee = ({ employeeData }) => {

// //     const data = {
// //         "id": 468,
// //         "user_id": 13895,
// //         "qualification": null,
// //         "experience": 0,
// //         "living_division_id": 0,
// //         "living_district_id": 0,
// //         "living_upazila_id": 0,
// //         "living_address": null,
// //         "permanent_division_id": 0,
// //         "permanent_district_id": 0,
// //         "permanent_upazila_id": 0,
// //         "permanent_address": null,
// //         "join_date": "2024-07-07T00:00:00.000Z",
// //         "payroll_id": 22,
// //         "school_shift_id": "13",
// //         "branch_id": 2,
// //         "designation_id": 1,
// //         "designation_name": "Principal",
// //         "full_name": "nayan hasan",
// //         "father_name": "aaa",
// //         "mother_name": "aaaa",
// //         "dob": "2024-06-11T00:00:00.000Z",
// //         "gender": 2,
// //         "religion": 1,
// //         "mobile": "01774412135",
// //         "email": "saklainmostak2135@gmail.com",
// //         "password": "aaaa",
// //         "signature_image": "brand/2024/06/22/16/43/Screenshot (5).png",
// //         "photo": "brand/2024/06/12/09/40/Screenshot (3).png",
// //         "educational_qualifications": [
// //             {
// //                 "education": 7,
// //                 "institute": "a",
// //                 "result": "a",
// //                 "passing_year": "a"
// //             },
// //             {
// //                 "education": 7,
// //                 "institute": "a",
// //                 "result": "a",
// //                 "passing_year": "a"
// //             }
// //         ]
// //     };

// //     const [formData, setFormData] = useState({
// //         id: data.id,
// //         user_id: data.user_id,
// //         full_name: data.full_name,
// //         dob: data.dob.split('T')[0],
// //         gender: data.gender,
// //         religion: data.religion,
// //         mobile: data.mobile,
// //         email: data.email,
// //         password: data.password,
// //         experience: data.experience,
// //         living_division_id: data.living_division_id,
// //         living_district_id: data.living_district_id,
// //         living_upazila_id: data.living_upazila_id,
// //         living_address: data.living_address,
// //         permanent_division_id: data.permanent_division_id,
// //         permanent_district_id: data.permanent_district_id,
// //         permanent_upazila_id: data.permanent_upazila_id,
// //         permanent_address: data.permanent_address,
// //         join_date: data.join_date.split('T')[0],
// //         payroll_id: data.payroll_id,
// //         school_shift_id: data.school_shift_id,
// //         signature_image: data.signature_image,
// //         photo: data.photo,
// //         updated_by: '',
// //         designation_id: data.designation_id,
// //         promotion_month: '',
// //         fields: data.educational_qualifications
// //     });

// //     useEffect(() => {
// //         if (employeeData) {
// //             setFormData({
// //                 ...employeeData,
// //                 dob: employeeData.dob.split('T')[0],
// //                 join_date: employeeData.join_date.split('T')[0],
// //                 fields: employeeData.educational_qualifications || [{ education: '', institute: '', result: '', passing_year: '' }]
// //             });
// //         }
// //     }, [employeeData]);

// //     const handleChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData({
// //             ...formData,
// //             [name]: value
// //         });
// //     };

// //     const handleQualificationChange = (index, e) => {
// //         const { name, value } = e.target;
// //         const newQualifications = [...formData.fields];
// //         newQualifications[index][name] = value;
// //         setFormData({ ...formData, fields: newQualifications });
// //     };

// //     const addQualification = () => {
// //         setFormData({
// //             ...formData,
// //             fields: [...formData.fields, { education: '', institute: '', result: '', passing_year: '' }]
// //         });
// //     };

// //     console.log(employeeData)

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         try {
// //             const response = await axios.post(`/Admin/employee_user/employee_user_update/${formData.user_id}`, formData);
// //             console.log('User updated and promotion data inserted successfully', response.data);
// //         } catch (error) {
// //             console.error('Error updating employee:', error);
// //         }
// //     };

// //     return (
// //         <form onSubmit={handleSubmit}>

// //             <input type="text" name="user_id" placeholder="User ID" value={formData.user_id} onChange={handleChange} required />
// //             <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} required />
// //             <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} required />
// //             <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} required />
// //             <input type="text" name="religion" placeholder="Religion" value={formData.religion} onChange={handleChange} required />
// //             <input type="tel" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} required />
// //             <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
// //             <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
// //             <input type="text" name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} required />
// //             <input type="text" name="living_division_id" placeholder="Division ID Living" value={formData.living_division_id} onChange={handleChange} required />
// //             <input type="text" name="living_district_id" placeholder="District ID Living" value={formData.living_district_id} onChange={handleChange} required />
// //             <input type="text" name="living_upazila_id" placeholder="Upazila ID Living" value={formData.living_upazila_id} onChange={handleChange} required />
// //             <input type="text" name="living_address" placeholder="Address ID Living" value={formData.living_address} onChange={handleChange} required />
// //             <input type="text" name="permanent_division_id" placeholder="Division ID Permanent" value={formData.permanent_division_id} onChange={handleChange} required />
// //             <input type="text" name="permanent_district_id" placeholder="District ID Permanent" value={formData.permanent_district_id} onChange={handleChange} required />
// //             <input type="text" name="permanent_upazila_id" placeholder="Upazila ID Permanent" value={formData.permanent_upazila_id} onChange={handleChange} required />
// //             <input type="text" name="permanent_address" placeholder="Address ID Permanent" value={formData.permanent_address} onChange={handleChange} required />
// //             <input type="date" name="join_date" placeholder="Join Date" value={formData.join_date} onChange={handleChange} required />
// //             <input type="text" name="payroll_id" placeholder="Payroll ID" value={formData.payroll_id} onChange={handleChange} required />
// //             <input type="text" name="school_shift_id" placeholder="School Shift ID" value={formData.school_shift_id} onChange={handleChange} required />
// //             <input type="text" name="signature_image" placeholder="Signature Image" value={formData.signature_image} onChange={handleChange} required />
// //             <input type="text" name="photo" placeholder="Photo" value={formData.photo} onChange={handleChange} required />
// //             <input type="text" name="updated_by" placeholder="Updated By" value={formData.updated_by} onChange={handleChange} required />
// //             <input type="text" name="designation_id" placeholder="Designation ID" value={formData.designation_id} onChange={handleChange} required />
// //             <input type="text" name="promotion_month" placeholder="Promotion Month" value={formData.promotion_month} onChange={handleChange} required />

// //             <div>
// //                 <h3>Educational Qualifications</h3>
// //                 {formData.fields.map((qualification, index) => (
// //                     <div key={index}>
// //                         <input type="text" name="education" placeholder="Education" value={qualification.education} onChange={(e) => handleQualificationChange(index, e)} required />
// //                         <input type="text" name="institute" placeholder="Institute" value={qualification.institute} onChange={(e) => handleQualificationChange(index, e)} required />
// //                         <input type="text" name="result" placeholder="Result" value={qualification.result} onChange={(e) => handleQualificationChange(index, e)} required />
// //                         <input type="text" name="passing_year" placeholder="Passing Year" value={qualification.passing_year} onChange={(e) => handleQualificationChange(index, e)} required />
// //                     </div>
// //                 ))}
// //                 <button type="button" onClick={addQualification}>Add More</button>
// //             </div>

// //             <button type="submit">Update Employee</button>
// //         </form>
// //     );
// // };

// // export default UpdateEmployee;

// 'use client' 
 //ismile
// import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';

// const EmployeeEdit = ({ id }) => {
//     const modified_by = localStorage.getItem('userId')

//     const { data: allEmployeeList = [] } = useQuery({
//         queryKey: ['allEmployeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list/${id}`)
//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: divisions = [] } = useQuery({
//         queryKey: ['divisions'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/divisions/divisions_list`)
//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: districts = [] } = useQuery({
//         queryKey: ['districts'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/district/district_list`)
//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: upazilas = [] } = useQuery({
//         queryKey: ['upazilas'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/upazilas/upazilas_list`)
//             const data = await res.json()
//             return data
//         }
//     })

//     const [formData, setFormData] = useState({
//         id: '',
//         user_id: '',
//         experience: '',
//         living_division_id: '',
//         living_district_id: '',
//         living_upazila_id: '',
//         living_address: '',
//         permanent_division_id: '',
//         permanent_district_id: '',
//         permanent_upazila_id: '',
//         permanent_address: '',
//         join_date: '',
//         payroll_id: '',
//         school_shift_id: '',
//         modified_by: modified_by,
//         designation_id: '',
//         branch_id: '',
//         promotion_month: '',
//         fields: ''
//     });

//     const [isAddressSame, setIsAddressSame] = useState(false);
//     const [selectedDivision, setSelectedDivision] = useState('');
//     const [selectedDistrict, setSelectedDistrict] = useState('');
//     const [filteredDistricts, setFilteredDistricts] = useState([]);
//     const [filteredUpazilas, setFilteredUpazilas] = useState([]);
//     console.log(filteredUpazilas)



//     const handleDivisionChange = (e) => {
//         setSelectedDivision(e.target.value);
//         setFormData({
//             ...formData,
//             living_division_id: e.target.value,
//             living_district_id: '',
//             living_upazila_id: ''
//         });
//     };

//     const handleDistrictChange = (e) => {
//         setSelectedDistrict(e.target.value);
//         setFormData({
//             ...formData,
//             living_district_id: e.target.value,
//             living_upazila_id: ''
//         });
//     };

//     const handleUpazilaChange = (e) => {
//         setFormData({
//             ...formData,
//             living_upazila_id: e.target.value
//         });
//     };

//     const handleLivingAddressChange = (e) => {
//         setFormData({
//             ...formData,
//             living_address: e.target.value
//         });
//     };

//     const handlePermanentDivisionChange = (e) => {
//         setFormData({
//             ...formData,
//             permanent_division_id: e.target.value
//         });
//     };

//     const handlePermanentDistrictChange = (e) => {
//         setFormData({
//             ...formData,
//             permanent_district_id: e.target.value
//         });
//     };

//     const handlePermanentUpazilaChange = (e) => {
//         setFormData({
//             ...formData,
//             permanent_upazila_id: e.target.value
//         });
//     };

//     const handlePermanentAddressChange = (e) => {
//         setFormData({
//             ...formData,
//             permanent_address: e.target.value
//         });
//     };

//     const handleCheckboxChange = (e) => {
//         const isChecked = e.target.checked;
//         setIsAddressSame(isChecked);
//         if (isChecked) {
//             setFormData({
//                 ...formData,
//                 permanent_division_id: formData.living_division_id,
//                 permanent_district_id: formData.living_district_id,
//                 permanent_upazila_id: formData.living_upazila_id,
//                 permanent_address: formData.living_address
//             });
//         } else {
//             setFormData({
//                 ...formData,
//                 permanent_division_id: '',
//                 permanent_district_id: '',
//                 permanent_upazila_id: '',
//                 permanent_address: ''
//             });
//         }
//     };
//     useEffect(() => {
//         if (allEmployeeList) {
//             setSelectedDivision(allEmployeeList.living_division_id); // Set the selected division
//             setSelectedDistrict(allEmployeeList.living_district_id); // Set the selected district
//             setFormData({
//                 id: allEmployeeList.id,
//                 user_id: allEmployeeList.user_id,
//                 experience: allEmployeeList.experience,
//                 living_division_id: allEmployeeList.living_division_id,
//                 living_district_id: allEmployeeList.living_district_id,
//                 living_upazila_id: allEmployeeList.living_upazila_id,
//                 living_address: allEmployeeList.living_address,
//                 permanent_division_id: allEmployeeList.permanent_division_id,
//                 permanent_district_id: allEmployeeList.permanent_district_id,
//                 permanent_upazila_id: allEmployeeList.permanent_upazila_id,
//                 permanent_address: allEmployeeList.permanent_address,
//                 join_date: allEmployeeList.join_date,
//                 payroll_id: allEmployeeList.payroll_id,
//                 school_shift_id: allEmployeeList.school_shift_id,
//                 modified_by: modified_by,
//                 designation_id: allEmployeeList.designation_id,
//                 promotion_month: allEmployeeList.promotion_month,
//                 fields: allEmployeeList.educational_qualifications,
//                 branch_id: allEmployeeList.branch_id
//             });
//         }
//     }, [allEmployeeList, modified_by]);

//     useEffect(() => {
//         if (selectedDivision) {
//             const filtered = districts.filter(district => district.division_id === parseInt(selectedDivision));
//             setFilteredDistricts(filtered);
//         } else {
//             setFilteredDistricts([]);
//         }
//     }, [selectedDivision, districts]);

//     useEffect(() => {
//         if (selectedDistrict) {
//             const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistrict));
//             setFilteredUpazilas(filtered);
//         } else {
//             setFilteredUpazilas([]);
//         }
//     }, [selectedDistrict, upazilas]);

//     const employee_edit = (e) => {
//         e.preventDefault();

//         const apiUrl1 = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_edit/${id}`;

//         const requestOptions1 = {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(formData)
//         };



//         Promise.all([
//             fetch(apiUrl1, requestOptions1),

//         ])
//             .then(([response1]) => {
//                 if (!response1.ok) {
//                     throw new Error('One or both requests failed');
//                 }
//                 return Promise.all([response1.json()]);
//             })
//             .then(([data1]) => {
//                 console.log('Data1:', data1);

//                 if (data1.error || data2.error) {
//                     alert('Error occurred during employee update');
//                 } else {
//                     alert('Employee updated successfully');

//                 }
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//                 alert('An error occurred during employee update');
//             });
//     };

//     return (
//         <div className='bg-[#f7f7f8]'>
//             <div className="container mx-auto py-5">
//                 <h1 className="text-2xl font-bold mb-5">Edit Employee Information</h1>
//                 <div className="bg-white shadow-md rounded p-5">
//                     <form onSubmit={employee_edit}>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Living Division</label>
//                                 <select
//                                     value={formData.living_division_id}
//                                     onChange={handleDivisionChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select Division</option>
//                                     {divisions.map(division => (
//                                         <option key={division.id} value={division.id}>{division.division_bn}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Living District</label>
//                                 <select
//                                     value={formData.living_district_id}
//                                     onChange={handleDistrictChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select District</option>
//                                     {filteredDistricts.map(district => (
//                                         <option key={district.id} value={district.id}>{district.district_bn}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Living Upazila</label>
//                                 <select
//                                     value={formData.living_upazila_id}
//                                     onChange={handleUpazilaChange}
//                                     className=""
//                                 >
//                                     <option value="">Select Upazila</option>
//                                     {filteredUpazilas.map(upazila => (
//                                         <option key={upazila.id} value={upazila.id}>{upazila.upazila_bn}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Living Address</label>
//                                 <input
//                                     type="text"
//                                     value={formData.living_address}
//                                     onChange={handleLivingAddressChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Permanent Division</label>
//                                 <select
//                                     value={formData.permanent_division_id}
//                                     onChange={handlePermanentDivisionChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select Division</option>
//                                     {divisions.map(division => (
//                                         <option key={division.id} value={division.id}>{division.division_bn}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Permanent District</label>
//                                 <select
//                                     value={formData.permanent_district_id}
//                                     onChange={handlePermanentDistrictChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select District</option>
//                                     {districts.filter(district => district.division_id === parseInt(formData.permanent_division_id)).map(district => (
//                                         <option key={district.id} value={district.id}>{district.district_bn}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Permanent Upazila</label>
//                                 <select
//                                     value={formData.permanent_upazila_id}
//                                     onChange={handlePermanentUpazilaChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select Upazila</option>
//                                     {upazilas.filter(upazila => upazila.district_id === parseInt(formData.permanent_district_id)).map(upazila => (
//                                         <option key={upazila.id} value={upazila.id}>{upazila.upazila_bn}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
//                                 <input
//                                     type="text"
//                                     value={formData.permanent_address}
//                                     onChange={handlePermanentAddressChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 />
//                             </div>
//                             <div className="col-span-2">
//                                 <label className="inline-flex items-center mt-3">
//                                     <input
//                                         type="checkbox"
//                                         className="form-checkbox h-5 w-5 text-gray-600"
//                                         checked={isAddressSame}
//                                         onChange={handleCheckboxChange}
//                                     />
//                                     <span className="ml-2 text-gray-700">Permanent address same as living address</span>
//                                 </label>
//                             </div>
//                         </div>
//                         <div className="row no-gutters">
//                             <div className="col-md-12 offset-md-3">
//                                 <input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EmployeeEdit;

'use client' 
 //ismile
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
// import { employee_update } from '@/app/model/Admin/employee_model/employee_model';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const EmployeeEdit = ({ id }) => {


    // const [isAddressSame, setIsAddressSame] = useState(false);

    const [modified_by, setModified_by] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setModified_by(storedUserId);
        }
    }, []);


    const { data: allEmployeeList = [],
    } = useQuery({
        queryKey: ['allEmployeeList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list/${id}`)

            const data = await res.json()
            return data
        }
    })
    const { data: payRoll = [], isLoading, refetch
    } = useQuery({
        queryKey: ['payRoll'],
        queryFn: async () => {
            // const res = await fetch(datas)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pay_roll/pay_roll_all`)


            const data = await res.json()
            return data
        }
    })

    const { data: professions = [],
    } = useQuery({
        queryKey: ['professions'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/profession/profession_all`)

            const data = await res.json()
            return data
        }
    })
    const { data: educationName = [],
    } = useQuery({
        queryKey: ['educationName'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/education/education_list`)

            const data = await res.json()
            return data
        }
    })

    const { data: divisions = [],
    } = useQuery({
        queryKey: ['divisions'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/divisions/divisions_list`)

            const data = await res.json()
            return data
        }
    })

    const { data: districts = [],
    } = useQuery({
        queryKey: ['district'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/district/district_list`)

            const data = await res.json()
            return data
        }
    })

    const { data: upazilas = [],
    } = useQuery({
        queryKey: ['upazilas'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/upazilas/upazilas_list`)

            const data = await res.json()
            return data
        }
    })

    // const datas = employee_update





    const [numToAdd, setNumToAdd] = useState(1);



    const [fullName, setFullName] = useState([])
    const [fatherName, setFatherName] = useState([])
    const [motherName, setMotherName] = useState([])
    const [dob, setDob] = useState([])
    const [gender, setGender] = useState([])
    const [religion, setReligion] = useState([])
    const [email, setEmail] = useState([])
    const [mobile, setMobile] = useState([])
    const [password, setPassword] = useState([])
    const [confirmPassword, setConfirmPassword] = useState([])
    const [experience, setExperience] = useState([])
    const [education, setEducation] = useState([])
    const [School, setSchool] = useState([])
    const [result, setResult] = useState([])
    const [passingYear, setPassingYear] = useState([])
    const [lDivision, setLDivision] = useState([])
    const [lDistrict, setLDistrict] = useState([])
    const [lUpazila, setLUpazila] = useState([])
    const [lAddress, setLAddress] = useState([])
    const [pDivision, setPDivision] = useState([])
    const [pDistrict, setPDistrict] = useState([])
    const [pUpazila, setPUpazila] = useState([])
    const [pAddress, setPAddress] = useState([])
    const [joinDate, setJoinDate] = useState([])
    const [designation, setDesignation] = useState([])
    const [employeeId, setEmployeeId] = useState([])
    const [payroll, setPayroll] = useState([])
    const [shift, setShift] = useState([])



    const [formData, setFormData] = useState({
        id: '',
        user_id: '',
        experience: '',
        living_division_id: '',
        living_district_id: '',
        living_upazila_id: '',
        living_address: '',
        permanent_division_id: '',
        permanent_district_id: '',
        permanent_upazila_id: '',
        permanent_address: '',
        join_date: '',
        payroll_id: '',
        school_shift_id: '',
        modified_by: modified_by,
        designation_id: '',
        branch_id: '',
        promotion_month: '',
        fields: '',
        mother_phone: '',
        mother_name: '',
        father_phone: '',
        father_name: '',
        mother_service: '',
        father_service: '',
        same_as: ''

    });

    // useEffect(() => {
    //     setFormData({
    //         id: allEmployeeList.id,

    //         user_id: allEmployeeList.user_id,
    //         experience: allEmployeeList.experience,
    //         living_division_id: allEmployeeList.living_division_id,
    //         living_district_id: allEmployeeList.living_district_id,
    //         living_upazila_id: allEmployeeList.living_upazila_id,
    //         living_address: allEmployeeList.living_address,
    //         permanent_division_id: allEmployeeList.permanent_division_id,
    //         permanent_district_id: allEmployeeList.permanent_district_id,
    //         permanent_upazila_id: allEmployeeList.permanent_upazila_id,
    //         permanent_address: allEmployeeList.permanent_address,
    //         join_date: allEmployeeList.join_date,
    //         payroll_id: allEmployeeList.payroll_id,
    //         school_shift_id: allEmployeeList.school_shift_id,
    //         modified_by: modified_by,
    //         designation_id: allEmployeeList.designation_id,
    //         promotion_month: allEmployeeList.promotion_month,
    //         fields: allEmployeeList.educational_qualifications,
    //         branch_id: allEmployeeList.branch_id
    //     })
    // }, [allEmployeeList, modified_by])

    console.log(formData)
    console.log(allEmployeeList)


    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value
    //     });
    // };

    const handleChange = (index, event) => {

        const { name, value } = event.target;
        const newFields = [...fields];
        newFields[index].educational_qualifications[name] = value;

        const education = newFields[index]['education'];
        if (education) {
            setEducation('')
        }

        const institute = newFields[index]['institute'];
        if (institute) {
            setSchool('')
        }

        const result = newFields[index]['result'];
        if (result) {
            setResult('')
        }

        const passing_year = newFields[index]['passing_year'];
        if (passing_year) {
            setPassingYear('')
        }

        setFields(newFields);
    };

    const handleQualificationChange = (index, e) => {
        const { name, value } = e.target;
        const newQualifications = [...formData.fields];
        newQualifications[index][name] = value;
        setFormData({ ...formData, fields: newQualifications });
    };

    const addQualification = () => {
        setFormData({
            ...formData,
            fields: [...formData.fields, { education: '', institute: '', result: '', passing_year: '' }]
        });
    };

    const handleRemoveField = (index) => {
        const newQualifications = formData.fields.filter((_, i) => i !== index);
        setFormData({ ...formData, fields: newQualifications });
    };



    // const handleRemoveField = (index) => {
    //     const newFields = [...fields];
    //     newFields.splice(index, 1);
    //     setFields(newFields);
    // };


    // const [selectedDivision, setSelectedDivision] = useState("");
    // const [selectedDistrict, setSelectedDistrict] = useState("");
    // const [filteredDistricts, setFilteredDistricts] = useState([]);
    // const [filteredUpazilas, setFilteredUpazilas] = useState([]);

    // useEffect(() => {
    //     if (selectedDivision) {
    //         const filtered = district.filter(district => district.division_id === parseInt(selectedDivision));
    //         setFilteredDistricts(filtered);
    //     } else {
    //         setFilteredDistricts([]);
    //     }
    //     setSelectedDistrict(""); // Reset selected district when division changes
    // }, [selectedDivision, district]);

    // useEffect(() => {
    //     if (selectedDistrict) {
    //         const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistrict));
    //         setFilteredUpazilas(filtered);
    //     } else {
    //         setFilteredUpazilas([]);
    //     }
    // }, [selectedDistrict, upazilas]);


    // const [selectedDivisionCopy, setSelectedDivisionCopy] = useState("");
    // const [selectedDistrictCopy, setSelectedDistrictCopy] = useState("");
    // const [filteredDistrictsCopy, setFilteredDistrictsCopy] = useState([]);
    // const [filteredUpazilasCopy, setFilteredUpazilasCopy] = useState([]);

    // useEffect(() => {
    //     if (selectedDivisionCopy) {
    //         const filtered = district.filter(district => district.division_id === parseInt(selectedDivisionCopy));
    //         setFilteredDistrictsCopy(filtered);
    //     } else {
    //         setFilteredDistrictsCopy([]);
    //     }
    //     setSelectedDistrictCopy(""); // Reset selected district when division changes
    // }, [selectedDivisionCopy, district]);

    // useEffect(() => {
    //     if (selectedDistrictCopy) {
    //         const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistrictCopy));
    //         setFilteredUpazilasCopy(filtered);
    //     } else {
    //         setFilteredUpazilasCopy([]);
    //     }
    // }, [selectedDistrictCopy, upazilas]);

    // const [livingAddress, setLivingAddress] = useState('');
    // const [isSameAsLivingAddress, setIsSameAsLivingAddress] = useState(false);

    // const handleLivingAddressChange = (e) => {
    //     setLivingAddress(e.target.value);
    // };

    // useEffect(() => {
    //     if (isSameAsLivingAddress) {
    //         setSelectedDivisionCopy(selectedDivision);
    //         setSelectedDistrictCopy(selectedDistrict);
    //         setFilteredDistrictsCopy(filteredDistricts);
    //         setFilteredUpazilasCopy(filteredUpazilas);
    //     }
    //     else {
    //         setSelectedDivisionCopy('');

    //     }
    // }, [isSameAsLivingAddress, selectedDivision, selectedDistrict, filteredDistricts, filteredUpazilas]);

    // const [selectedUpazila, setSelectedUpazila] = useState('');
    // const handleUpazilaChange = (e) => {
    //     setSelectedUpazila(e.target.value);
    // };


    // const [selectedDivision, setSelectedDivision] = useState('');
    // const [selectedDistrict, setSelectedDistrict] = useState('');
    // const [filteredDistricts, setFilteredDistricts] = useState([]);
    // const [filteredUpazilas, setFilteredUpazilas] = useState([]);

    // useEffect(() => {
    //     if (selectedDivision) {
    //         const filtered = districts.filter(district => district.division_id === parseInt(selectedDivision));
    //         setFilteredDistricts(filtered);
    //     } else {
    //         setFilteredDistricts([]);
    //     }
    //     setSelectedDistrict(""); // Reset selected district when division changes
    // }, [selectedDivision, districts]);

    // useEffect(() => {
    //     if (selectedDistrict) {
    //         const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistrict));
    //         setFilteredUpazilas(filtered);
    //     } else {
    //         setFilteredUpazilas([]);
    //     }
    // }, [selectedDistrict, upazilas]);

    // const handleDivisionChange = (e) => {
    //     setSelectedDivision(e.target.value);
    //     setFormData({
    //         ...formData,
    //         living_division_id: e.target.value,
    //         living_district_id: '',
    //         living_upazila_id: ''
    //     });
    // };

    // const handleDistrictChange = (e) => {
    //     setSelectedDistrict(e.target.value);
    //     setFormData({
    //         ...formData,
    //         living_district_id: e.target.value,
    //         living_upazila_id: ''
    //     });
    // };

    // const handleUpazilaChange = (e) => {
    //     setFormData({
    //         ...formData,
    //         living_upazila_id: e.target.value
    //     });
    // };

    // const handleLivingAddressChange = (e) => {
    //     setFormData({
    //         ...formData,
    //         living_address: e.target.value
    //     });
    // };

    // const handlePermanentDivisionChange = (e) => {
    //     setFormData({
    //         ...formData,
    //         permanent_division_id: e.target.value
    //     });
    // };

    // const handlePermanentDistrictChange = (e) => {
    //     setFormData({
    //         ...formData,
    //         permanent_district_id: e.target.value
    //     });
    // };

    // const handlePermanentUpazilaChange = (e) => {
    //     setFormData({
    //         ...formData,
    //         permanent_upazila_id: e.target.value
    //     });
    // };

    // const handlePermanentAddressChange = (e) => {
    //     setFormData({
    //         ...formData,
    //         permanent_address: e.target.value
    //     });
    // };

    // const handleCheckboxChange = (e) => {
    //     const isChecked = e.target.checked;
    //     setIsAddressSame(isChecked);
    //     if (isChecked) {
    //         setFormData({
    //             ...formData,
    //             permanent_division_id: formData.living_division_id,
    //             permanent_district_id: formData.living_district_id,
    //             permanent_upazila_id: formData.living_upazila_id,
    //             permanent_address: formData.living_address
    //         });
    //     } else {
    //         setFormData({
    //             ...formData,
    //             permanent_division_id: '',
    //             permanent_district_id: '',
    //             permanent_upazila_id: '',
    //             permanent_address: ''
    //         });
    //     }
    // };
    const [isAddressSame, setIsAddressSame] = useState(formData.same_as === 1);
    const [selectedDivision, setSelectedDivision] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);

    console.log(isAddressSame)



    const handleDivisionChange = (e) => {
        setSelectedDivision(e.target.value);
        setFormData({
            ...formData,
            living_division_id: e.target.value,
            living_district_id: '',
            living_upazila_id: ''
        });
    };

    const handleDistrictChange = (e) => {
        setSelectedDistrict(e.target.value);
        setFormData({
            ...formData,
            living_district_id: e.target.value,
            living_upazila_id: ''
        });
    };

    const handleUpazilaChange = (e) => {
        setFormData({
            ...formData,
            living_upazila_id: e.target.value
        });
    };

    const handleLivingAddressChange = (e) => {
        setFormData({
            ...formData,
            living_address: e.target.value
        });
    };

    const handlePermanentDivisionChange = (e) => {
        setFormData({
            ...formData,
            permanent_division_id: e.target.value
        });
    };

    const handlePermanentDistrictChange = (e) => {
        setFormData({
            ...formData,
            permanent_district_id: e.target.value
        });
    };

    const handlePermanentUpazilaChange = (e) => {
        setFormData({
            ...formData,
            permanent_upazila_id: e.target.value
        });
    };

    const handlePermanentAddressChange = (e) => {
        setFormData({
            ...formData,
            permanent_address: e.target.value
        });
    };
    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setIsAddressSame(isChecked);

        setFormData({
            ...formData,
            same_as: isChecked ? 1 : 0,
            permanent_division_id: isChecked ? formData.living_division_id : '',
            permanent_district_id: isChecked ? formData.living_district_id : '',
            permanent_upazila_id: isChecked ? formData.living_upazila_id : '',
            permanent_address: isChecked ? formData.living_address : ''
        });
    };
    // const handleCheckboxChange = (e) => {
    //     const isChecked = e.target.checked;
    //     setIsAddressSame(isChecked);

    //     if (isChecked) {
    //         setFormData({
    //             ...formData,
    //             permanent_division_id: formData.living_division_id,
    //             permanent_district_id: formData.living_district_id,
    //             permanent_upazila_id: formData.living_upazila_id,
    //             permanent_address: formData.living_address

    //         });
    //     } else {
    //         setFormData({
    //             ...formData,
    //             permanent_division_id: '',
    //             permanent_district_id: '',
    //             permanent_upazila_id: '',
    //             permanent_address: ''
    //         });
    //     }
    // };


    useEffect(() => {
        if (allEmployeeList) {
            setSelectedDivision(allEmployeeList.living_division_id); // Set the selected division
            setSelectedDistrict(allEmployeeList.living_district_id); // Set the selected district
            setFormData({
                id: allEmployeeList.id,
                user_id: allEmployeeList.user_id,
                experience: allEmployeeList.experience,
                living_division_id: allEmployeeList.living_division_id,
                living_district_id: allEmployeeList.living_district_id,
                living_upazila_id: allEmployeeList.living_upazila_id,
                living_address: allEmployeeList.living_address,
                permanent_division_id: allEmployeeList.permanent_division_id,
                permanent_district_id: allEmployeeList.permanent_district_id,
                permanent_upazila_id: allEmployeeList.permanent_upazila_id,
                permanent_address: allEmployeeList.permanent_address,
                join_date: allEmployeeList.join_date,
                payroll_id: allEmployeeList.payroll_id,
                school_shift_id: allEmployeeList.school_shift_id,
                modified_by: modified_by,
                designation_id: allEmployeeList.designation_id,
                promotion_month: allEmployeeList.promotion_month,
                fields: allEmployeeList.educational_qualifications,
                branch_id: allEmployeeList.branch_id,
                same_as: allEmployeeList.same_as,
                father_service: allEmployeeList.father_service,
                mother_service: allEmployeeList.mother_service,
                father_name: allEmployeeList.e_father_name,
                mother_name: allEmployeeList.e_mother_name,
                father_phone: allEmployeeList.father_phone,
                mother_phone: allEmployeeList.mother_phone,
            });
        }
    }, [allEmployeeList, modified_by]);

    console.log(allEmployeeList)
    console.log(formData)

    useEffect(() => {
        if (selectedDivision) {
            const filtered = districts.filter(district => district.division_id === parseInt(selectedDivision));
            setFilteredDistricts(filtered);
        } else {
            setFilteredDistricts([]);
        }
    }, [selectedDivision, districts]);

    useEffect(() => {
        if (selectedDistrict) {
            const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistrict));
            setFilteredUpazilas(filtered);
        } else {
            setFilteredUpazilas([]);
        }
    }, [selectedDistrict, upazilas]);
    
    const { data: schoolShiftList = [],
    } = useQuery({
        queryKey: ['schoolShiftList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all`)

            const data = await res.json()
            return data
        }
    })

    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/pay_roll/pay_roll_all`)





    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState(null);



    const [user, setUser] = useState({
        father_name: '',
        mother_name: '',
        full_name: '',
        dob: '',
        gender: '',
        religion: '',
        mobile: '',
        email: '',
        password: '',
        signature_image: '',
        photo: '',
        modified_by: modified_by,
        unique_id: '',
        blood_group_id: '',
        NID: '',

    });

    useEffect(() => {
        setUser({
            blood_group_id: allEmployeeList.blood_group_id,
            NID: allEmployeeList.NID,
            unique_id: allEmployeeList.unique_id,
          
            full_name: allEmployeeList.full_name,
            dob: allEmployeeList.dob,
            gender: allEmployeeList.gender,
            religion: allEmployeeList.religion,
            mobile: allEmployeeList.mobile,
            email: allEmployeeList.email,
            password: allEmployeeList.password,
            signature_image: uploadedImageUrl ? uploadedImageUrl : allEmployeeList.signature_image,
            photo: uploadedFileUrl ? uploadedFileUrl : allEmployeeList.photo,
            modified_by: modified_by
        })
    }, [allEmployeeList, modified_by, uploadedImageUrl, uploadedFileUrl])

    const [currentDate, setCurrentDate] = useState([])
    const handleDateChange = (event) => {
        const selectedDate = event.target.value; // Directly get the value from the input

        const day = String(selectedDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
        const month = String(selectedDate.split('-')[1]).padStart(2, '0');
        const year = String(selectedDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;
        setCurrentDate(formattedDate)
        setUser(prevData => ({
            ...prevData,
            dob: formattedDatabaseDate // Update the period_name field in the state
        }));
    };
    // console.log(currentDate)

    // const period_name = allEmployeeList.dob;
    // const formattedDate = period_name.split('T')[0];
    const [reformattedDate, setReformattedDate] = useState('');

    useEffect(() => {
        const period_name = user.dob;
        const formattedDate = period_name?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setReformattedDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [user]);



    const [selectedDate, setSelectedDate] = useState([]);
    const [formattedDisplayDate, setFormattedDisplayDate] = useState('');

    const handleDateSelection = (event) => {
        const inputDate = event.target.value; // Directly get the value from the input

        const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
        const month = String(inputDate.split('-')[1]).padStart(2, '0');
        const year = String(inputDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;
        setSelectedDate(formattedDate);
        setFormData(prevData => ({
            ...prevData,
            join_date: formattedDatabaseDate // Update the dob field in the state
        }));
    };

    console.log(formData.join_date);
    console.log(formData.join_date);

    useEffect(() => {
        const dob = formData.join_date;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [formData]);






    // console.log(fieldes.educational_qualifications[0])



    const employee_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value
        setFormData(attribute)
        // setSameBrandName('')

    };


    const [passwordError, setPasswordError] = useState('');


    const users_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...user }
        attribute[name] = value


        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (name === 'email') {
            // Validate the email format
            if (!emailRegex.test(value)) {
                setEmail("Please enter a valid email in the format abcd@abcd.com");
            } else {
                setEmail(""); // Clear the error message if valid
            }
        }

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match.');
        } else {
            setPasswordError('');
        }

        setUser(attribute)


    };



    console.log(passwordError)
    const router = useRouter()
    const employee_edit = (e) => {
        e.preventDefault();
        const form = e.target;
        const password = form.password.value
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return
        } else {
            setPasswordError('');
        }


        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!user.email) {
            setEmail("email Is required"); // Clear the error message if valid

            return
        } else if (!emailRegex.test(user.email)) {
            setEmail("Please enter a valid email in the format abcd@abcd.com");
            return
        }


        const apiUrl1 = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_edit/${id}`;
        const apiUrl2 = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee_user/employee_user_update/${id}`;



        const requestOptions1 = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // You may need to include additional headers here depending on your API requirements
            },
            body: JSON.stringify(formData)
        };

        const requestOptions2 = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // You may need to include additional headers here depending on your API requirements
            },
            body: JSON.stringify(user)
        };

        Promise.all([
            fetch(apiUrl1, requestOptions1),
            fetch(apiUrl2, requestOptions2)
        ])
            .then(responses => {
                return Promise.all(responses.map(response => response.json()));
            })
            .then(data => {
                // data[0] contains response from apiUrl1
                // data[1] contains response from apiUrl2
                console.log("Response from API 1:", data[0]);
                console.log("Response from API 2:", data[1]);
                // Handle the data here
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                // Handle errors here
            });
    };



    console.log(formData)
    console.log(user)




    const [selectedFile, setSelectedFile] = useState(null);
    const [fileNames, setFileNames] = useState([]);
    const [fileSizeError, setFileSizeError] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);


    const brandFileChange = (e) => {
        const file = e.target.files[0];
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const fileName = file.name.split('.')[0];
        const extension = file.name.split('.').pop();
        const newName = `${fileName}.${extension}`;
        const time = `${year}/${month}/${day}/${hours}/${minutes}`;
        const path = `employe/${time}/${newName}`;

        const newSelectedFile = { ...file, path };

        if (file.size <= 2097152) {
            setFileSizeError("");
            setFileNames(newName);
            setSelectedFile(newSelectedFile);
            setUploadProgress(0); // Reset progress when a new file is selected
            upload(file, path);
        } else {
            setFileSizeError("Max file size 2 MB");
        }

        const previewUrl = URL.createObjectURL(file);
        setPreviewUrl(previewUrl);
    };

    const upload = (file, path) => {
        const formData = new FormData();
        const extension = file.name.split('.').pop();
        const fileName = file.name.split('.')[0];
        const newName = `${fileName}.${extension}`;
        formData.append('files', file, newName);

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/employe/employe_image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            }
        })
            .then(res => {
                console.log(res);
                setUploadProgress(100); // Set progress to 100% on success
                setUploadedFileUrl(path); // Set the uploaded file URL to show the image
            })
            .catch(err => {
                console.log(err);
                setUploadProgress(0); // Reset the progress bar on error
            });
    };


    const [currentFile, setCurrentFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [progressPercentage, setProgressPercentage] = useState(0);



    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const fileName = file.name.split('.')[0];
        const extension = file.name.split('.').pop();
        const newName = `${fileName}.${extension}`;
        const time = `${year}/${month}/${day}/${hours}/${minutes}`;
        const path = `employe/${time}/${newName}`;

        const newFile = { ...file, path };

        if (file.size <= 2097152) {
            setErrorMessage("");
            setFileList(newName);
            setCurrentFile(newFile);
            setProgressPercentage(0); // Reset progress when a new file is selected
            uploadFile(file, path);
        } else {
            setErrorMessage("Max file size 2 MB");
        }

        const previewImage = URL.createObjectURL(file);
        setPreviewImage(previewImage);
    };

    const uploadFile = (file, path) => {
        const formData = new FormData();
        const extension = file.name.split('.').pop();
        const fileName = file.name.split('.')[0];
        const newName = `${fileName}.${extension}`;
        formData.append('files', file, newName);

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/employe/employe_image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgressPercentage(percentCompleted);
            }
        })
            .then(res => {
                console.log(res);
                setProgressPercentage(100); // Set progress to 100% on success
                setUploadedImageUrl(path); // Set the uploaded file URL to show the image
            })
            .catch(err => {
                console.log(err);
                setProgressPercentage(0); // Reset the progress bar on error
            });
    };

    console.log(uploadedImageUrl)

    const { data: genderList = [],
    } = useQuery({
        queryKey: ['genderList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/gender/gender_list`)

            const data = await res.json()
            return data
        }
    })

    const { data: bloods = [],
    } = useQuery({
        queryKey: ['bloods'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/blood_group/blood_group_all`)

            const data = await res.json()
            return data
        }
    })

    const { data: religionList = [],
    } = useQuery({
        queryKey: ['religionList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_list`)

            const data = await res.json()
            return data
        }
    })

    const { data: designationList = [],
    } = useQuery({
        queryKey: ['designationList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_list`)

            const data = await res.json()
            return data
        }
    })

    const { data: branchAll = [],
    } = useQuery({
        queryKey: ['branchAll'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`)

            const data = await res.json()
            return data
        }
    })


    console.log(formData)
    console.log(user)

    return (
        <div className="container-fluid">

            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employee Edit</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/employee/employee_all?page_group`} className="btn btn-sm btn-info">Back Employee List</Link>
                                    </div>
                                </div>



                                <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                    (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                </div>
                                <div class="card-body ">
                                    <form class="" method="post" autocomplete="off" onSubmit={employee_edit}>
                                        <div class="card bg-white mb-3 shadow-sm ">
                                            <div class="card-header p-2   bg-gradient-primary text-white ">
                                                <div class="card-title font-weight-bold mb-0  float-left mt-1">Employee Information</div>
                                            </div>
                                            <div class="card-body">
                                                <div class=" row no-gutters">
                                                    <div class="col-md-6">

                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3">
                                                                <label class="font-weight-bold  text-left">Employee Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                            </div>
                                                            <div class="col-md-8">
                                                                <input
                                                                    onChange={users_input_change}
                                                                    value={user.full_name}
                                                                    type="text" required="" name="full_name" class="form-control form-control-sm  required " id="full_name" placeholder="Enter Full Name" />
                                                                {
                                                                    fullName && <p className='text-danger m-0'>{fullName}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3">
                                                                <label class="font-weight-bold  text-left">NID:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                            </div>
                                                            <div class="col-md-8">
                                                                <input
                                                                    onChange={users_input_change}
                                                                    type="number"
                                                                    value={user.NID}
                                                                    name='NID'
                                                                    class="form-control form-control-sm  required " placeholder="Enter NID Number" />


                                                            </div>
                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold  text-right">Religion:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <select
                                                                    onChange={users_input_change}
                                                                    value={user.religion}
                                                                    required="" name="religion" class="form-control form-control-sm  required integer_no_zero">
                                                                    <option value=''>Select Religion</option>
                                                                    {
                                                                        religionList.map(religion =>

                                                                            <>
                                                                                <option value={religion.id}>{religion.name}</option>

                                                                            </>
                                                                        )
                                                                    }
                                                                </select>
                                                                {
                                                                    religion && <p className='text-danger m-0'>{religion}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold  text-right">Mobile:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <input type="number"
                                                                    onChange={users_input_change}
                                                                    value={user.mobile}
                                                                    required="" name="mobile" maxlength="11" class="form-control form-control-sm  required " id="mobile" placeholder="Enter Mobile" />
                                                                {
                                                                    mobile && <p className='text-danger m-0'>{mobile}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold">Year of Experience:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <input
                                                                    onChange={employee_input_change}
                                                                    value={formData.experience}
                                                                    type="text" required="" name="experience" class="form-control form-control-sm  required " id="experience" placeholder="Enter Year of Experience" />
                                                                {
                                                                    experience && <p className='text-danger m-0'>{experience}</p>
                                                                }
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div class="col-md-6">

                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3">
                                                                <label class="font-weight-bold  text-right">Date of Birth:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                            </div>

                                                            <div class="col-md-8">

                                                                <input
                                                                    type="text"
                                                                    readOnly

                                                                    defaultValue={reformattedDate}
                                                                    onClick={() => document.getElementById(`dateInput-n`).showPicker()}
                                                                    placeholder="dd-mm-yyyy"
                                                                    className="form-control form-control-sm mb-2"
                                                                    style={{ display: 'inline-block', }}
                                                                />
                                                                <input
                                                                    name='dob'
                                                                    type="date"
                                                                    id={`dateInput-n`}
                                                                    onChange={(e) => handleDateChange(e)}
                                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                                />
                                                                {
                                                                    dob && <p className='text-danger m-0'>{dob}</p>
                                                                }

                                                            </div>

                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold  text-right">Gender:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <select
                                                                    onChange={users_input_change}
                                                                    value={user.gender}
                                                                    required="" name="gender" class="form-control form-control-sm  required integer_no_zero" id="gender_name">
                                                                    <option value=''>Select Gender</option>
                                                                    {
                                                                        genderList.map(gender =>

                                                                            <>
                                                                                <option value={gender.id}>{gender.gender_name}</option>

                                                                            </>
                                                                        )
                                                                    }
                                                                </select>
                                                                {
                                                                    gender && <p className='text-danger m-0'>{gender}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold  text-right">Blood Group:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <select
                                                                    onChange={users_input_change}
                                                                    value={user.blood_group_id}
                                                                    name="blood_group_id" class="form-control form-control-sm  required integer_no_zero">
                                                                    <option value=''>Select Blood Group</option>
                                                                    {
                                                                        bloods.map(blood =>

                                                                            <>
                                                                                <option value={blood.id}>{blood.blood_group_name}</option>
                                                                            </>
                                                                        )
                                                                    }
                                                                </select>

                                                            </div>
                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold  text-right">Email ID:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <input
                                                                    onChange={users_input_change}
                                                                    value={user.email}
                                                                    type="text" required="" name="email" class="form-control form-control-sm  required " id="email" placeholder="Enter Email ID" />
                                                                {
                                                                    email && <p className='text-danger m-0'>{email}</p>
                                                                }
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="card bg-white mb-3 shadow-sm ">
                                            <div class="card-header p-2  bg-gradient-primary text-white ">
                                                <div class="card-title font-weight-bold mb-0  float-left mt-1">Account Information</div>
                                            </div>
                                            <div class="card-body">
                                                <div class=" row no-gutters">

                                                    <div class="col-md-6">
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3">
                                                                <label class="font-weight-bold  text-right"> Password:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                            </div>
                                                            <div class="col-md-8">
                                                                <input
                                                                    onChange={employee_input_change}
                                                                    type="password" name="password" class="form-control form-control-sm  required password" id="password" placeholder="Enter password" />
                                                                {
                                                                    password && <p className='text-danger m-0'>{password}</p>
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3">
                                                                <label class="font-weight-bold  ">Confirm Password:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                            </div>
                                                            <div class="col-md-8">
                                                                <input
                                                                    // value={confirm_password}
                                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                                    type="password" required="" name="confirm_password" class="form-control form-control-sm  required matches_password" id="confirm_password" placeholder="Enter Confirm Password" />
                                                                {
                                                                    passwordError && <p className='text-danger m-0'>{passwordError}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="card bg-white mb-3 shadow-sm ">
                                            <div class="card-header p-2  bg-gradient-primary text-white ">
                                                <div class="card-title font-weight-bold mb-0  float-left mt-1">Parent Information</div>
                                            </div>
                                            <div class="card-body">
                                                <div class=" row no-gutters">
                                                    <div class="col-md-6">
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3">
                                                                <label class="font-weight-bold  text-right">Father Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                            </div>
                                                            <div class="col-md-8">
                                                                <input type="text" required=""
                                                                    value={formData.father_name}
                                                                    onChange={employee_input_change}
                                                                    name="father_name" class="form-control form-control-sm  required " id="father_name" placeholder="Enter Father Name" />
                                                                {
                                                                    fatherName && <p className='text-danger m-0'>{fatherName}</p>
                                                                }
                                                                {/* {
                                                                    fatherName && <p className='text-danger m-0'>{fatherName}</p>
                                                                } */}

                                                            </div>
                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3">
                                                                <label class="font-weight-bold  text-right">Father Mobile:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                            </div>
                                                            <div class="col-md-8">
                                                                <input
                                                                value={formData.father_phone}
                                                                    onChange={employee_input_change}
                                                                    type="text" name="father_phone" class="form-control form-control-sm  required " placeholder="Enter Father Mobile Number " />

                                                            </div>
                                                        </div>


                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold ">Father Profession :<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <select
                                                                    value={formData.father_service}
                                                                    onChange={employee_input_change}
                                                                    name="father_service" class=" form-control form-control-sm  required integer_no_zero lupazila">
                                                                    <option value="">Select Father Profession</option>
                                                                    {
                                                                        professions.map(profession =>
                                                                            <>
                                                                                <option value={profession.id}>{profession.profession_name}</option>
                                                                            </>
                                                                        )
                                                                    }
                                                                </select>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3">
                                                                <label class="font-weight-bold  text-right">Mother Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                            </div>
                                                            <div class="col-md-8">
                                                                <input type="text"
                                                                    onChange={employee_input_change}
                                                                    value={formData.mother_name}
                                                                    required="" name="mother_name" class="form-control form-control-sm  required " id="mother_name" placeholder="Enter Mother Name" />
                                                                {
                                                                    motherName && <p className='text-danger m-0'>{motherName}</p>
                                                                }


                                                            </div>
                                                        </div>

                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3">
                                                                <label class="font-weight-bold  text-right">Mother Mobile:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                            </div>
                                                            <div class="col-md-8">
                                                                <input
                                                                value={formData.mother_phone}
                                                                    onChange={employee_input_change}
                                                                    type="text" name="mother_phone" class="form-control form-control-sm  required " placeholder="Enter Mother Mobile number"/>


                                                            </div>
                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold ">Mother Profession:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <select
                                                                    value={formData.mother_service}
                                                                    onChange={employee_input_change}
                                                                    name="mother_service" class=" form-control form-control-sm  required integer_no_zero lupazila">
                                                                    <option value="">Select Mother Profession</option>
                                                                    {
                                                                        professions.map(profession =>
                                                                            <>
                                                                                <option value={profession.id}>{profession.profession_name}</option>
                                                                            </>
                                                                        )
                                                                    }
                                                                </select>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                                                <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
                                                    <strong>Educational Qualification</strong>
                                                </div>
                                                <div className="card-title card-header-color font-weight-bold mb-0 float-right">
                                                    <div className="input-group printable">
                                                        <input
                                                            style={{ width: '80px' }}
                                                            type="number"
                                                            min="1"
                                                            className="form-control"
                                                            placeholder="Enter number of forms to add"
                                                        // value={numToAdd}
                                                        // onChange={(event) => setNumToAdd(event.target.value)}
                                                        />
                                                        <div className="input-group-append">
                                                            <button
                                                                type="button"
                                                                className="btn btn-info btn-sm py-1 add_more"
                                                                onClick={addQualification}
                                                            >
                                                                Add More
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="form-group row px-3">
                                                    <table className="table table-bordered table-hover table-striped table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>Education<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>School/College/University<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Result<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Passing Year<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {formData?.fields?.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan="5" className="text-center">No data available</td>
                                                                </tr>
                                                            ) : (
                                                                formData?.fields?.map((qualification, index) => (
                                                                    <tr key={index}>
                                                                        <td>
                                                                            <select

                                                                                value={qualification.education}
                                                                                name="education"
                                                                                className="form-control form-control-sm trim integer_no_zero row_unique_education"
                                                                                onChange={(e) => handleQualificationChange(index, e)}
                                                                                required
                                                                            >
                                                                                <option>Select Education</option>
                                                                                {educationName.map((educations, idx) => (
                                                                                    <option key={idx} value={educations.id}>
                                                                                        {educations.education_name}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            {/* Display validation error if exists */}
                                                                            {/* {educationErrors[index] && <p className='text-danger'>{educationErrors[index]}</p>} */}
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="text"
                                                                                name="institute"
                                                                                className="form-control form-control-sm required row_unique_institute"
                                                                                placeholder="Enter Institute"
                                                                                value={qualification.institute}
                                                                                onChange={(e) => handleQualificationChange(index, e)}
                                                                                required
                                                                            />
                                                                            {/* Display validation error if exists */}
                                                                            {/* {instituteErrors[index] && <p className='text-danger'>{instituteErrors[index]}</p>} */}
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="text"
                                                                                name="result"
                                                                                className="form-control form-control-sm required row_unique_result"
                                                                                placeholder="Enter Result"
                                                                                value={qualification.result}
                                                                                onChange={(e) => handleQualificationChange(index, e)}
                                                                                required
                                                                            />
                                                                            {/* Display validation error if exists */}
                                                                            {/* {resultErrors[index] && <p className='text-danger'>{resultErrors[index]}</p>} */}
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                type="text"
                                                                                name="passing_year"
                                                                                className="form-control form-control-sm required row_unique_passing_year"
                                                                                placeholder="Enter Passing Year"
                                                                                value={qualification.passing_year}
                                                                                onChange={(e) => handleQualificationChange(index, e)}
                                                                                required
                                                                            />
                                                                            {/* Display validation error if exists */}
                                                                            {/* {passingYearErrors[index] && <p className='text-danger'>{passingYearErrors[index]}</p>} */}
                                                                        </td>
                                                                        <td>
                                                                            <button
                                                                                onClick={() => handleRemoveField(index)}
                                                                                type="button"
                                                                                className="btn btn-sm btn-danger remove delete"
                                                                            >
                                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>


                                        <div class=" row">


                                            <div class="col-md-6">
                                                <div class="card bg-white mb-3 shadow-sm ">
                                                    <div class="card-header p-2  bg-gradient-primary text-white">
                                                        <div class="card-title font-weight-bold mb-0  float-left mt-1">Living Address</div>
                                                    </div>
                                                    <div class="card-body">
                                                        <div class=" row no-gutters">
                                                            <div class="col-md-12">
                                                                <div class="form-group row no-gutters">
                                                                    <div class="col-md-3"><label class="font-weight-bold  text-right">Division:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                                    <div class="col-md-8">

                                                                        <select
                                                                            value={formData.living_division_id}
                                                                            onChange={handleDivisionChange} required="" name="ldivision_id" class=" form-control form-control-sm  required integer_no_zero ldivision">
                                                                            <option value="">Select Division</option>
                                                                            {
                                                                                divisions.map(division =>

                                                                                    <>
                                                                                        <option value={division.id}>{division.division_bn}</option>

                                                                                    </>
                                                                                )
                                                                            }

                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row no-gutters">
                                                                    <div class="col-md-3"><label class="font-weight-bold  text-right">District:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                                    <div class="col-md-8">
                                                                        <select
                                                                            value={formData.living_district_id}
                                                                            onChange={handleDistrictChange}
                                                                            required="" name="ldistrict_id" class=" form-control form-control-sm  required integer_no_zero ldistrict">
                                                                            <option value="">Select District</option>
                                                                            {
                                                                                filteredDistricts.map(districts =>

                                                                                    <>

                                                                                        <option value={districts.id}>{districts.district_bn}</option>
                                                                                    </>
                                                                                )
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row no-gutters">
                                                                    <div class="col-md-3"><label class="font-weight-bold  text-right">Upazila:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                                    <div class="col-md-8">
                                                                        <select
                                                                            value={formData.living_upazila_id}
                                                                            onChange={handleUpazilaChange}
                                                                            required="" name="lupazila_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
                                                                            <option value="">Select Upazila</option>
                                                                            {
                                                                                filteredUpazilas.map(upazila =>

                                                                                    <>
                                                                                        <option value={upazila.id}>{upazila.upazila_bn}</option>
                                                                                    </>
                                                                                )
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div class="form-group row no-gutters">
                                                                    <div class="col-md-3"><label class="font-weight-bold  text-right">Address:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                                    <div class="col-md-8">
                                                                        <input
                                                                            type="text"
                                                                            required=""
                                                                            name="laddress"
                                                                            className="form-control form-control-sm required"
                                                                            id="address"
                                                                            placeholder="Enter Address"
                                                                            value={formData.living_address}
                                                                            onChange={handleLivingAddressChange}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>



                                            <div className="col-md-6">
                                                <div className="card bg-white mb-3 shadow-sm ">
                                                    <div className="card-header p-2 bg-gradient-primary text-white clearfix">
                                                        <div className="card-title font-weight-bold mb-0 float-left mt-1">Permanent Address</div>
                                                        <div className="form-check form-check-inline float-right">
                                                            <input
                                                                type="checkbox"
                                                                name="same_as"
                                                                className="same_as"
                                                                value={isAddressSame ? 1 : 0}
                                                                id="sameAsCheckbox"
                                           
                                                                checked={formData.same_as === 1}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="font-weight-bold form-check-label ml-2" htmlFor="inlineCheckbox1">Same as Living Address</label>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row no-gutters">
                                                            <div className="col-md-12">
                                                                <div className="form-group row no-gutters">
                                                                    <div className="col-md-3">
                                                                        <label className="font-weight-bold text-right">Division:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                                                    </div>
                                                                    <div className="col-md-8">
                                                                        <select
                                                                            value={formData.permanent_division_id}
                                                                            onChange={handlePermanentDivisionChange}
                                                                            required=""
                                                                            name="pdivision_id"
                                                                            className="form-control form-control-sm required integer_no_zero pdivision"
                                                                        // disabled={isSameAsLivingAddress}
                                                                        >
                                                                            <option value="">Select Division</option>
                                                                            {divisions.map(division => (
                                                                                <option key={division.id} value={division.id}>{division.division_bn}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row no-gutters">
                                                                    <div className="col-md-3">
                                                                        <label className="font-weight-bold text-right">District:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                                                    </div>
                                                                    <div className="col-md-8">
                                                                        <select
                                                                            value={formData.permanent_district_id}
                                                                            onChange={handlePermanentDistrictChange}
                                                                            required=""
                                                                            name="pdistrict_id"
                                                                            className="form-control form-control-sm required integer_no_zero pdistrict"
                                                                        // disabled={isSameAsLivingAddress}
                                                                        >
                                                                            <option value="">Select District</option>
                                                                            {districts.filter(district => district.division_id === parseInt(formData.permanent_division_id)).map(district => (
                                                                                <option key={district.id} value={district.id}>{district.district_bn}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row no-gutters">
                                                                    <div className="col-md-3">
                                                                        <label className="font-weight-bold text-right">Upazila:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                                                    </div>
                                                                    <div className="col-md-8">
                                                                        <select
                                                                            required=""
                                                                            name="pupazila_id"
                                                                            className="form-control form-control-sm required integer_no_zero pupazila"
                                                                            value={formData.permanent_upazila_id}
                                                                            onChange={handlePermanentUpazilaChange}
                                                                        >
                                                                            <option value="">Select Upazila</option>
                                                                            {upazilas.filter(upazila => upazila.district_id === parseInt(formData.permanent_district_id)).map(upazila => (
                                                                                <option key={upazila.id} value={upazila.id}>{upazila.upazila_bn}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row no-gutters">
                                                                    <div className="col-md-3">
                                                                        <label className="font-weight-bold text-right">Address:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                                                    </div>
                                                                    <div className="col-md-8">
                                                                        <input
                                                                            type="text"
                                                                            required=""
                                                                            name="paddress"
                                                                            className="form-control form-control-sm required"
                                                                            id="paddress"
                                                                            placeholder="Enter Address"
                                                                            value={formData.permanent_address}
                                                                            onChange={handlePermanentAddressChange}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>

                                        <div class="card bg-white mb-3 shadow-sm ">
                                            <div class="card-header p-2   bg-gradient-primary text-white ">
                                                <div class="card-title font-weight-bold mb-0  float-left mt-1">Joining Information</div>
                                            </div>
                                            <div class="card-body">
                                                <div class=" row no-gutters">
                                                    <div class="col-md-6">
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold  text-right">Join Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                {/* <input type="date" name="join_date" class="form-control form-control-sm  required urban_datepicker" id="join_date" placeholder="Enter Join Date" /> */}
                                                                <input
                                                                    type="text"
                                                                    readOnly

                                                                    defaultValue={formattedDisplayDate}
                                                                    onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
                                                                    placeholder="dd-mm-yyyy"
                                                                    className="form-control form-control-sm mb-2"
                                                                    style={{ display: 'inline-block', }}
                                                                />
                                                                <input
                                                                    name='join_date'
                                                                    type="date"
                                                                    id={`dateInput-nt`}
                                                                    onChange={(e) => handleDateSelection(e)}
                                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                                />
                                                                {
                                                                    joinDate && <p className='text-danger m-0'>{joinDate}</p>
                                                                }
                                                            </div>
                                                        </div>

                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold  text-right">Employee ID:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <input
                                                                    value={user.unique_id}
                                                                    onChange={users_input_change}
                                                                    type="text" required="" name="unique_id" class=" form-control form-control-sm  required " id="finger_print_id" placeholder="Enter Employee ID" />
                                                                {
                                                                    employeeId && <p className='text-danger m-0'>{employeeId}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold  text-right">Branch :<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <select
                                                                    onChange={employee_input_change}
                                                                    value={formData.branch_id}
                                                                    name="branch_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
                                                                    <option value="">Select Branch</option>
                                                                    {
                                                                        branchAll.map(branch =>

                                                                            <>
                                                                                <option value={branch.id}>{branch.branch_name}</option>
                                                                            </>
                                                                        )
                                                                    }
                                                                </select>
                                                                {
                                                                    shift && <p className='text-danger m-0'>{shift}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold  text-right">Designation:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <select
                                                                    value={formData.designation_id}
                                                                    onChange={employee_input_change}
                                                                    required="" name="designation_id" class=" form-control form-control-sm  required integer_no_zero " id="designation_name">
                                                                    <option value="">Select Designation</option>
                                                                    {
                                                                        designationList.map(designation =>
                                                                            <>
                                                                                <option value={designation.id}>{designation.designation_name}</option>

                                                                            </>
                                                                        )
                                                                    }
                                                                </select>
                                                                {
                                                                    designation && <p className='text-danger m-0'>{designation}</p>
                                                                }

                                                            </div>
                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold  text-right">Payroll:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <select
                                                                    value={formData.payroll_id}
                                                                    onChange={employee_input_change}
                                                                    required="" name="payroll_id" class="form-control form-control-sm  required integer_no_zero " id="title">

                                                                    <option value="">Select Payroll</option>
                                                                    {payRoll.map(item => (
                                                                        < >
                                                                            <option value={item.id}>{`${item.title} (${item.basic}/-)`}</option>
                                                                        </>
                                                                    ))}
                                                                </select>
                                                                {
                                                                    payroll && <p className='text-danger m-0'>{payroll}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold  text-right">Shift:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <select
                                                                    value={formData.school_shift_id}
                                                                    onChange={employee_input_change}
                                                                    required="" name="school_shift_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
                                                                    <option value="">Select Shift</option>
                                                                    {
                                                                        schoolShiftList.map(upazila =>

                                                                            <>
                                                                                <option value={upazila.id}>{upazila.name}</option>
                                                                            </>
                                                                        )
                                                                    }
                                                                </select>
                                                                {
                                                                    shift && <p className='text-danger m-0'>{shift}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card bg-white mb-3 shadow-sm ">
                                            <div class="card-header p-2   bg-gradient-primary text-white ">
                                                <div class="card-title font-weight-bold mb-0  float-left mt-1">Attach Image</div>
                                            </div>
                                            <div class="card-body">
                                                <div class=" row no-gutters">
                                                    <div className="col-md-6">
                                                        <div className="form-group row no-gutters">
                                                            <div className="col-md-3">
                                                                <label className="font-weight-bold text-right">Image:</label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <div>
                                                                    <span className="btn btn-success btn-sm">
                                                                        <label htmlFor="fileInput" className="mb-0">
                                                                            <span className="ml-1">Select Image</span>
                                                                        </label>
                                                                        <input
                                                                            name="file_path"
                                                                            type="file"
                                                                            id="fileInput"
                                                                            style={{ display: 'none' }}
                                                                            onChange={brandFileChange}
                                                                        />
                                                                    </span>
                                                                </div>

                                                                {fileSizeError && <div className="text-danger m-0">{fileSizeError}</div>}
                                                                <div id="progress_client" className="progress">
                                                                    <div
                                                                        className="progress-bar progress_client1 progress-bar-success"
                                                                        style={{ width: `${uploadProgress}%` }}
                                                                    ></div>
                                                                </div>

                                                                <input type="text" className='d-none' value={uploadedFileUrl ? uploadedFileUrl : user.photo} name='photo' />

                                                                <div id="software_logo" className="logo bg-light img-thumbnail">
                                                                    {uploadedFileUrl ? <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${uploadedFileUrl}`} alt="Uploaded" className="img-fluid" />
                                                                        :
                                                                        <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${user.photo}`} alt="Uploaded" className="img-fluid" />

                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>





                                                    <div className="col-md-6">
                                                        <div className="form-group row no-gutters">
                                                            <div className="col-md-3">
                                                                <label className="font-weight-bold text-right">Signature Image:</label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <div>
                                                                    <span className="btn btn-success btn-sm">
                                                                        <label htmlFor="fileInput1" className="mb-0">
                                                                            <span className="ml-1">Select Image</span>
                                                                        </label>
                                                                        <input
                                                                            name="file_path"
                                                                            type="file"
                                                                            id="fileInput1"
                                                                            style={{ display: 'none' }}
                                                                            onChange={handleFileChange}
                                                                        />
                                                                    </span>
                                                                </div>
                                                                {errorMessage && <div className="text-danger m-0">{errorMessage}</div>}
                                                                <div id="progress_client" className="progress">
                                                                    <div
                                                                        className="progress-bar progress_client1 progress-bar-success"
                                                                        style={{ width: `${progressPercentage}%` }}
                                                                    ></div>
                                                                </div>

                                                                <input name='signature_image' type="text" className='d-none' value={uploadedImageUrl ? uploadedImageUrl : user.signature_image} />
                                                                <div id="software_logo" className="logo bg-light img-thumbnail">
                                                                    {uploadedImageUrl ? <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${uploadedImageUrl}`} alt="Uploaded" className="img-fluid" />
                                                                        :
                                                                        <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${user.signature_image}`} alt="Uploaded" className="img-fluid" />
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>



                                                </div>
                                                <div class="row no-gutters">
                                                    <div class="col-md-12 offset-md-3">
                                                        <input type="submit" name="create" class="btn btn-sm btn-success" value="Submit" />
                                                    </div>
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
        </div>
    );
};

export default EmployeeEdit;


// 'use client' 
 //ismile
// import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
// // import { employee_update } from '@/app/model/Admin/employee_model/employee_model';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';

// const EmployeeEdit = ({ id }) => {

//     const modified_by = localStorage.getItem('userId')

//     const { data: allEmployeeList = [],
//     } = useQuery({
//         queryKey: ['allEmployeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list/${id}`)

//             const data = await res.json()
//             return data
//         }
//     })


//     const { data: divisions = [],
//     } = useQuery({
//         queryKey: ['divisions'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/divisions/divisions_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: district = [],
//     } = useQuery({
//         queryKey: ['district'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/district/district_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: upazilas = [],
//     } = useQuery({
//         queryKey: ['upazilas'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/upazilas/upazilas_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const [formData, setFormData] = useState({

//         living_division_id: '',
//         living_district_id: '',
//         living_upazila_id: '',
//         living_address: '',
//         permanent_division_id: '',
//         permanent_district_id: '',
//         permanent_upazila_id: '',
//         permanent_address: '',

//     });

//     useEffect(() => {
//         setFormData({

//             living_division_id: allEmployeeList.living_division_id,
//             living_district_id: allEmployeeList.living_district_id,
//             living_upazila_id: allEmployeeList.living_upazila_id,
//             living_address: allEmployeeList.living_address,
//             permanent_division_id: allEmployeeList.permanent_division_id,
//             permanent_district_id: allEmployeeList.permanent_district_id,
//             permanent_upazila_id: allEmployeeList.permanent_upazila_id,
//             permanent_address: allEmployeeList.permanent_address,

//         })
//     }, [allEmployeeList, modified_by])

//     console.log(formData)
//     console.log(allEmployeeList)





//     const [selectedDivision, setSelectedDivision] = useState(formData.living_division_id);
//     const [selectedDistrict, setSelectedDistrict] = useState(formData.living_district_id);
//     const [filteredDistricts, setFilteredDistricts] = useState([]);
//     const [filteredUpazilas, setFilteredUpazilas] = useState([]);

//     useEffect(() => {
//         if (selectedDivision) {
//             const filtered = district.filter(district => district.division_id === parseInt(selectedDivision));
//             setFilteredDistricts(filtered);
//         } else {
//             setFilteredDistricts([]);
//         }
//         setSelectedDistrict(""); // Reset selected district when division changes
//     }, [selectedDivision, district]);

//     useEffect(() => {
//         if (selectedDistrict) {
//             const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistrict));
//             setFilteredUpazilas(filtered);
//         } else {
//             setFilteredUpazilas([]);
//         }
//     }, [selectedDistrict, upazilas]);


//     const [selectedDivisionCopy, setSelectedDivisionCopy] = useState("");
//     const [selectedDistrictCopy, setSelectedDistrictCopy] = useState("");
//     const [filteredDistrictsCopy, setFilteredDistrictsCopy] = useState([]);
//     const [filteredUpazilasCopy, setFilteredUpazilasCopy] = useState([]);

//     useEffect(() => {
//         if (selectedDivisionCopy) {
//             const filtered = district.filter(district => district.division_id === parseInt(selectedDivisionCopy));
//             setFilteredDistrictsCopy(filtered);
//         } else {
//             setFilteredDistrictsCopy([]);
//         }
//         setSelectedDistrictCopy(""); // Reset selected district when division changes
//     }, [selectedDivisionCopy, district]);

//     useEffect(() => {
//         if (selectedDistrictCopy) {
//             const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistrictCopy));
//             setFilteredUpazilasCopy(filtered);
//         } else {
//             setFilteredUpazilasCopy([]);
//         }
//     }, [selectedDistrictCopy, upazilas]);

//     const [livingAddress, setLivingAddress] = useState('');
//     const [isSameAsLivingAddress, setIsSameAsLivingAddress] = useState(false);

//     const handleLivingAddressChange = (e) => {
//         setLivingAddress(e.target.value);
//     };

//     useEffect(() => {
//         if (isSameAsLivingAddress) {
//             setSelectedDivisionCopy(selectedDivision);
//             setSelectedDistrictCopy(selectedDistrict);
//             setFilteredDistrictsCopy(filteredDistricts);
//             setFilteredUpazilasCopy(filteredUpazilas);
//         }
//         else {
//             setSelectedDivisionCopy('');

//         }
//     }, [isSameAsLivingAddress, selectedDivision, selectedDistrict, filteredDistricts, filteredUpazilas]);

//     const [selectedUpazila, setSelectedUpazila] = useState('');
//     const handleUpazilaChange = (e) => {
//         setSelectedUpazila(e.target.value);
//     };











//     const employee_edit = (e) => {
//         e.preventDefault();



//         const apiUrl1 = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_edit/${id}`;




//         const requestOptions1 = {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//                 // You may need to include additional headers here depending on your API requirements
//             },
//             body: JSON.stringify(formData)
//         };



//         Promise.all([
//             fetch(apiUrl1, requestOptions1),

//         ])
//             .then(responses => {
//                 return Promise.all(responses.map(response => response.json()));
//             })
//             .then(data => {
//                 // data[0] contains response from apiUrl1
//                 // data[1] contains response from apiUrl2
//                 console.log("Response from API 1:", data[0]);

//                 // Handle the data here
//             })
//             .catch(error => {
//                 console.error("Error fetching data:", error);
//                 // Handle errors here
//             });
//     };


//     return (
//         <div className="container-fluid">

//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create School Shift</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/school_shift/school_shift_all?page_group`} className="btn btn-sm btn-info">Back School Shift List</Link>
//                                     </div>
//                                 </div>



//                                 <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                 </div>
//                                 <div class="card-body ">
//                                     <form class="" method="post" autocomplete="off" onSubmit={employee_edit}>





//                                         <div class=" row">


//                                             <div class="col-md-6">
//                                                 <div class="card bg-white mb-3 shadow-sm ">
//                                                     <div class="card-header p-2   bg-light ">
//                                                         <div class="card-title font-weight-bold mb-0  float-left mt-1">Living Address</div>
//                                                     </div>
//                                                     <div class="card-body">
//                                                         <div class=" row no-gutters">
//                                                             <div class="col-md-12">
//                                                                 <div class="form-group row no-gutters">
//                                                                     <div class="col-md-3"><label class="font-weight-bold  text-right">Division:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div class="col-md-8">

//                                                                         <select value={ selectedDivision  } onChange={(e) => setSelectedDivision(e.target.value)} required="" name="ldivision_id" class=" form-control form-control-sm  required integer_no_zero ldivision">
//                                                                             <option value="">Select Division</option>
//                                                                             {
//                                                                                 divisions.map(division =>

//                                                                                     <>
//                                                                                         <option value={division.id}>{division.division_bn}</option>

//                                                                                     </>
//                                                                                 )
//                                                                             }

//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div class="form-group row no-gutters">
//                                                                     <div class="col-md-3"><label class="font-weight-bold  text-right">District:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div class="col-md-8">
//                                                                         <select value={ selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} required="" name="ldistrict_id" class=" form-control form-control-sm  required integer_no_zero ldistrict">
//                                                                             <option value="">Select District</option>
//                                                                             {
//                                                                                 filteredDistricts.map(districts =>

//                                                                                     <>

//                                                                                         <option value={districts.id}>{districts.district_bn}</option>
//                                                                                     </>
//                                                                                 )
//                                                                             }
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div class="form-group row no-gutters">
//                                                                     <div class="col-md-3"><label class="font-weight-bold  text-right">Upazila:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div class="col-md-8">
//                                                                         <select
//                                                                             value={selectedUpazila}
//                                                                             onChange={handleUpazilaChange}
//                                                                             required="" name="lupazila_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
//                                                                             <option value="">Select Upazila</option>
//                                                                             {
//                                                                                 filteredUpazilas.map(upazila =>

//                                                                                     <>
//                                                                                         <option value={upazila.id}>{upazila.upazila_bn}</option>
//                                                                                     </>
//                                                                                 )
//                                                                             }
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div class="form-group row no-gutters">
//                                                                     <div class="col-md-3"><label class="font-weight-bold  text-right">Address:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div class="col-md-8">
//                                                                         <input
//                                                                             type="text"
//                                                                             required=""
//                                                                             name="laddress"
//                                                                             className="form-control form-control-sm required"
//                                                                             id="address"
//                                                                             placeholder="Enter Address"
//                                                                             value={livingAddress}
//                                                                             onChange={handleLivingAddressChange}
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>



//                                             <div className="col-md-6">
//                                                 <div className="card bg-white mb-3 shadow-sm ">
//                                                     <div className="card-header p-2 bg-light clearfix">
//                                                         <div className="card-title font-weight-bold mb-0 float-left mt-1">Permanent Address</div>
//                                                         <div className="form-check form-check-inline float-right">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 name="same_as"
//                                                                 className="same_as"
//                                                                 value="1"
//                                                                 id="sameAsCheckbox"
//                                                                 checked={isSameAsLivingAddress}
//                                                                 onChange={() => setIsSameAsLivingAddress(!isSameAsLivingAddress)}
//                                                             />
//                                                             <label className="font-weight-bold form-check-label ml-2" htmlFor="inlineCheckbox1">Same as Living Address</label>
//                                                         </div>
//                                                     </div>
//                                                     <div className="card-body">
//                                                         <div className="row no-gutters">
//                                                             <div className="col-md-12">
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3">
//                                                                         <label className="font-weight-bold text-right">Division:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                                                     </div>
//                                                                     <div className="col-md-8">
//                                                                         <select
//                                                                             value={isSameAsLivingAddress ? selectedDivision : selectedDivisionCopy}
//                                                                             onChange={(e) => setSelectedDivisionCopy(e.target.value)}
//                                                                             required=""
//                                                                             name="pdivision_id"
//                                                                             className="form-control form-control-sm required integer_no_zero pdivision"
//                                                                             disabled={isSameAsLivingAddress}
//                                                                         >
//                                                                             <option value="">Select Division</option>
//                                                                             {divisions.map(division => (
//                                                                                 <option key={division.id} value={division.id}>{division.division_bn}</option>
//                                                                             ))}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3">
//                                                                         <label className="font-weight-bold text-right">District:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                                                     </div>
//                                                                     <div className="col-md-8">
//                                                                         <select
//                                                                             value={isSameAsLivingAddress ? selectedDistrict : selectedDistrictCopy}
//                                                                             onChange={(e) => setSelectedDistrictCopy(e.target.value)}
//                                                                             required=""
//                                                                             name="pdistrict_id"
//                                                                             className="form-control form-control-sm required integer_no_zero pdistrict"
//                                                                             disabled={isSameAsLivingAddress}
//                                                                         >
//                                                                             <option value="">Select District</option>
//                                                                             {(isSameAsLivingAddress ? filteredDistricts : filteredDistrictsCopy).map(districts => (
//                                                                                 <option key={districts.id} value={districts.id}>{districts.district_bn}</option>
//                                                                             ))}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3">
//                                                                         <label className="font-weight-bold text-right">Upazila:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                                                     </div>
//                                                                     <div className="col-md-8">
//                                                                         <select
//                                                                             required=""
//                                                                             name="pupazila_id"
//                                                                             className="form-control form-control-sm required integer_no_zero pupazila"
//                                                                             value={isSameAsLivingAddress ? selectedUpazila : ""}
//                                                                             onChange={handleUpazilaChange}
//                                                                             disabled={isSameAsLivingAddress}
//                                                                         >
//                                                                             <option value="">Select Upazila</option>
//                                                                             {(isSameAsLivingAddress ? filteredUpazilas : filteredUpazilasCopy).map(upazila => (
//                                                                                 <option key={upazila.id} value={upazila.id}>{upazila.upazila_bn}</option>
//                                                                             ))}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3">
//                                                                         <label className="font-weight-bold text-right">Address:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                                                     </div>
//                                                                     <div className="col-md-8">
//                                                                         <input
//                                                                             type="text"
//                                                                             required=""
//                                                                             name="paddress"
//                                                                             className="form-control form-control-sm required"
//                                                                             id="paddress"
//                                                                             placeholder="Enter Address"
//                                                                             value={isSameAsLivingAddress ? livingAddress : ""}
//                                                                             disabled={isSameAsLivingAddress}
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
// <div class="row no-gutters">
//                                                     <div class="col-md-12 offset-md-3">                                                         <input type="submit" name="create" class="btn btn-sm btn-success" value="Submit" />
//                                                     </div>
//                                                  </div>

//                                         </div>



//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EmployeeEdit;

// 'use client' 
 //ismile
// import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';

// const EmployeeEdit = ({ id }) => {
//     const modified_by = localStorage.getItem('userId')

//     const { data: allEmployeeList = [] } = useQuery({
//         queryKey: ['allEmployeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list/${id}`)
//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: divisions = [] } = useQuery({
//         queryKey: ['divisions'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/divisions/divisions_list`)
//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: districts = [] } = useQuery({
//         queryKey: ['districts'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/district/district_list`)
//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: upazilas = [] } = useQuery({
//         queryKey: ['upazilas'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/upazilas/upazilas_list`)
//             const data = await res.json()
//             return data
//         }
//     })

//     const [formData, setFormData] = useState({
//         id: '',
//         user_id: '',
//         experience: '',
//         living_division_id: '',
//         living_district_id: '',
//         living_upazila_id: '',
//         living_address: '',
//         permanent_division_id: '',
//         permanent_district_id: '',
//         permanent_upazila_id: '',
//         permanent_address: '',
//         join_date: '',
//         payroll_id: '',
//         school_shift_id: '',
//         modified_by: modified_by,
//         designation_id: '',
//         branch_id: '',
//         promotion_month: '',
//         fields: ''
//     });

//     useEffect(() => {
//         if (allEmployeeList) {
//             setFormData({
//                 id: allEmployeeList.id,
//                 user_id: allEmployeeList.user_id,
//                 experience: allEmployeeList.experience,
//                 living_division_id: allEmployeeList.living_division_id,
//                 living_district_id: allEmployeeList.living_district_id,
//                 living_upazila_id: allEmployeeList.living_upazila_id,
//                 living_address: allEmployeeList.living_address,
//                 permanent_division_id: allEmployeeList.permanent_division_id,
//                 permanent_district_id: allEmployeeList.permanent_district_id,
//                 permanent_upazila_id: allEmployeeList.permanent_upazila_id,
//                 permanent_address: allEmployeeList.permanent_address,
//                 join_date: allEmployeeList.join_date,
//                 payroll_id: allEmployeeList.payroll_id,
//                 school_shift_id: allEmployeeList.school_shift_id,
//                 modified_by: modified_by,
//                 designation_id: allEmployeeList.designation_id,
//                 promotion_month: allEmployeeList.promotion_month,
//                 fields: allEmployeeList.educational_qualifications,
//                 branch_id: allEmployeeList.branch_id
//             });
//         }
//     }, [allEmployeeList, modified_by]);

//     const [selectedDivision, setSelectedDivision] = useState('');
//     const [selectedDistrict, setSelectedDistrict] = useState('');
//     const [filteredDistricts, setFilteredDistricts] = useState([]);
//     const [filteredUpazilas, setFilteredUpazilas] = useState([]);

//     useEffect(() => {
//         if (selectedDivision) {
//             const filtered = districts.filter(district => district.division_id === parseInt(selectedDivision));
//             setFilteredDistricts(filtered);
//         } else {
//             setFilteredDistricts([]);
//         }
//         setSelectedDistrict(""); // Reset selected district when division changes
//     }, [selectedDivision, districts]);

//     useEffect(() => {
//         if (selectedDistrict) {
//             const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistrict));
//             setFilteredUpazilas(filtered);
//         } else {
//             setFilteredUpazilas([]);
//         }
//     }, [selectedDistrict, upazilas]);

//     const handleDivisionChange = (e) => {
//         setSelectedDivision(e.target.value);
//         setFormData({
//             ...formData,
//             living_division_id: e.target.value,
//             living_district_id: '',
//             living_upazila_id: ''
//         });
//     };

//     const handleDistrictChange = (e) => {
//         setSelectedDistrict(e.target.value);
//         setFormData({
//             ...formData,
//             living_district_id: e.target.value,
//             living_upazila_id: ''
//         });
//     };

//     const handleUpazilaChange = (e) => {
//         setFormData({
//             ...formData,
//             living_upazila_id: e.target.value
//         });
//     };

//     const handleLivingAddressChange = (e) => {
//         setFormData({
//             ...formData,
//             living_address: e.target.value
//         });
//     };

//     const handlePermanentDivisionChange = (e) => {
//         setFormData({
//             ...formData,
//             permanent_division_id: e.target.value
//         });
//     };

//     const handlePermanentDistrictChange = (e) => {
//         setFormData({
//             ...formData,
//             permanent_district_id: e.target.value
//         });
//     };

//     const handlePermanentUpazilaChange = (e) => {
//         setFormData({
//             ...formData,
//             permanent_upazila_id: e.target.value
//         });
//     };

//     const handlePermanentAddressChange = (e) => {
//         setFormData({
//             ...formData,
//             permanent_address: e.target.value
//         });
//     };



//     const employee_edit = (e) => {
//         e.preventDefault();

//         const apiUrl1 = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_edit/${id}`;

//         const requestOptions1 = {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(formData)
//         };



//         Promise.all([
//             fetch(apiUrl1, requestOptions1),

//         ])
//             .then(([response1]) => {
//                 if (!response1.ok ) {
//                     throw new Error('One or both requests failed');
//                 }
//                 return Promise.all([response1.json()]);
//             })
//             .then(([data1]) => {
//                 console.log('Data1:', data1);

//                 if (data1.error ) {
//                     alert('Error occurred during employee update');
//                 } else {
//                     alert('Employee updated successfully');

//                 }
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//                 alert('An error occurred during employee update');
//             });
//     };

//     return (
//         <div className='bg-[#f7f7f8]'>
//             <div className="container mx-auto py-5">
//                 <h1 className="text-2xl font-bold mb-5">Edit Employee Information</h1>
//                 <div className="bg-white shadow-md rounded p-5">
//                     <form onSubmit={employee_edit}>
//                         <div className="grid grid-cols-2 gap-4">

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Living Division</label>
//                                 <select
//                                     value={formData.living_division_id}
//                                     onChange={handleDivisionChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select Division</option>
//                                     {divisions.map(division => (
//                                         <option key={division.id} value={division.id}>{division.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Living District</label>
//                                 <select
//                                     value={formData.living_district_id}
//                                     onChange={handleDistrictChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select District</option>
//                                     {filteredDistricts.map(district => (
//                                         <option key={district.id} value={district.id}>{district.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Living Upazila</label>
//                                 <select
//                                     value={formData.living_upazila_id}
//                                     onChange={handleUpazilaChange}
//                                     className=""
//                                 >
//                                     <option value="">Select Upazila</option>
//                                     {filteredUpazilas.map(upazila => (
//                                         <option key={upazila.id} value={upazila.id}>{upazila.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Living Address</label>
//                                 <input
//                                     type="text"
//                                     value={formData.living_address}
//                                     onChange={handleLivingAddressChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Permanent Division</label>
//                                 <select
//                                     value={formData.permanent_division_id}
//                                     onChange={handlePermanentDivisionChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select Division</option>
//                                     {divisions.map(division => (
//                                         <option key={division.id} value={division.id}>{division.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Permanent District</label>
//                                 <select
//                                     value={formData.permanent_district_id}
//                                     onChange={handlePermanentDistrictChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select District</option>
//                                     {districts.filter(district => district.division_id === parseInt(formData.permanent_division_id)).map(district => (
//                                         <option key={district.id} value={district.id}>{district.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Permanent Upazila</label>
//                                 <select
//                                     value={formData.permanent_id}
//                                     onChange={handlePermanentUpazilaChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select Upazila</option>
//                                     {upazilas.filter(upazila => upazila.district_id === parseInt(formData.permanent_district_id)).map(upazila => (
//                                         <option key={upazila.id} value={upazila.id}>{upazila.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
//                                 <input
//                                     type="text"
//                                     value={formData.permanent_address}
//                                     onChange={handlePermanentAddressChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 />
//                             </div>
//                         </div>
//                         <div class="row no-gutters">
//                             <div class="col-md-12 offset-md-3">                                                         <input type="submit" name="create" class="btn btn-sm btn-success" value="Submit" />
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>


//     );
// };

// export default EmployeeEdit;

// 'use client' 
 //ismile
// import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';

// const EmployeeEdit = ({ id }) => {
//     const modified_by = localStorage.getItem('userId')

//     const { data: allEmployeeList = [] } = useQuery({
//         queryKey: ['allEmployeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list/${id}`)
//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: divisions = [] } = useQuery({
//         queryKey: ['divisions'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/divisions/divisions_list`)
//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: districts = [] } = useQuery({
//         queryKey: ['districts'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/district/district_list`)
//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: upazilas = [] } = useQuery({
//         queryKey: ['upazilas'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/upazilas/upazilas_list`)
//             const data = await res.json()
//             return data
//         }
//     })

//     const [formData, setFormData] = useState({
//         id: '',
//         user_id: '',
//         experience: '',
//         living_division_id: '',
//         living_district_id: '',
//         living_upazila_id: '',
//         living_address: '',
//         permanent_division_id: '',
//         permanent_district_id: '',
//         permanent_upazila_id: '',
//         permanent_address: '',
//         join_date: '',
//         payroll_id: '',
//         school_shift_id: '',
//         modified_by: modified_by,
//         designation_id: '',
//         branch_id: '',
//         promotion_month: '',
//         fields: ''
//     });

//     const [isAddressSame, setIsAddressSame] = useState(false);

//     useEffect(() => {
//         if (allEmployeeList) {
//             setFormData({
//                 id: allEmployeeList.id,
//                 user_id: allEmployeeList.user_id,
//                 experience: allEmployeeList.experience,
//                 living_division_id: allEmployeeList.living_division_id,
//                 living_district_id: allEmployeeList.living_district_id,
//                 living_upazila_id: allEmployeeList.living_upazila_id,
//                 living_address: allEmployeeList.living_address,
//                 permanent_division_id: allEmployeeList.permanent_division_id,
//                 permanent_district_id: allEmployeeList.permanent_district_id,
//                 permanent_upazila_id: allEmployeeList.permanent_upazila_id,
//                 permanent_address: allEmployeeList.permanent_address,
//                 join_date: allEmployeeList.join_date,
//                 payroll_id: allEmployeeList.payroll_id,
//                 school_shift_id: allEmployeeList.school_shift_id,
//                 modified_by: modified_by,
//                 designation_id: allEmployeeList.designation_id,
//                 promotion_month: allEmployeeList.promotion_month,
//                 fields: allEmployeeList.educational_qualifications,
//                 branch_id: allEmployeeList.branch_id
//             });
//         }
//     }, [allEmployeeList, modified_by]);

//     const [selectedDivision, setSelectedDivision] = useState('');
//     const [selectedDistrict, setSelectedDistrict] = useState('');
//     const [filteredDistricts, setFilteredDistricts] = useState([]);
//     const [filteredUpazilas, setFilteredUpazilas] = useState([]);

//     useEffect(() => {
//         if (selectedDivision) {
//             const filtered = districts.filter(district => district.division_id === parseInt(selectedDivision));
//             setFilteredDistricts(filtered);
//         } else {
//             setFilteredDistricts([]);
//         }
//         setSelectedDistrict(""); // Reset selected district when division changes
//     }, [selectedDivision, districts]);

//     useEffect(() => {
//         if (selectedDistrict) {
//             const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistrict));
//             setFilteredUpazilas(filtered);
//         } else {
//             setFilteredUpazilas([]);
//         }
//     }, [selectedDistrict, upazilas]);

//     const handleDivisionChange = (e) => {
//         setSelectedDivision(e.target.value);
//         setFormData({
//             ...formData,
//             living_division_id: e.target.value,
//             living_district_id: '',
//             living_upazila_id: ''
//         });
//     };

//     const handleDistrictChange = (e) => {
//         setSelectedDistrict(e.target.value);
//         setFormData({
//             ...formData,
//             living_district_id: e.target.value,
//             living_upazila_id: ''
//         });
//     };

//     const handleUpazilaChange = (e) => {
//         setFormData({
//             ...formData,
//             living_upazila_id: e.target.value
//         });
//     };

//     const handleLivingAddressChange = (e) => {
//         setFormData({
//             ...formData,
//             living_address: e.target.value
//         });
//     };

//     const handlePermanentDivisionChange = (e) => {
//         setFormData({
//             ...formData,
//             permanent_division_id: e.target.value
//         });
//     };

//     const handlePermanentDistrictChange = (e) => {
//         setFormData({
//             ...formData,
//             permanent_district_id: e.target.value
//         });
//     };

//     const handlePermanentUpazilaChange = (e) => {
//         setFormData({
//             ...formData,
//             permanent_upazila_id: e.target.value
//         });
//     };

//     const handlePermanentAddressChange = (e) => {
//         setFormData({
//             ...formData,
//             permanent_address: e.target.value
//         });
//     };

//     const handleCheckboxChange = (e) => {
//         const isChecked = e.target.checked;
//         setIsAddressSame(isChecked);
//         if (isChecked) {
//             setFormData({
//                 ...formData,
//                 permanent_division_id: formData.living_division_id,
//                 permanent_district_id: formData.living_district_id,
//                 permanent_upazila_id: formData.living_upazila_id,
//                 permanent_address: formData.living_address
//             });
//         } else {
//             setFormData({
//                 ...formData,
//                 permanent_division_id: '',
//                 permanent_district_id: '',
//                 permanent_upazila_id: '',
//                 permanent_address: ''
//             });
//         }
//     };

//     const employee_edit = (e) => {
//         e.preventDefault();

//         const apiUrl1 = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_edit/${id}`;

//         const requestOptions1 = {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(formData)
//         };



//         Promise.all([
//             fetch(apiUrl1, requestOptions1),

//         ])
//             .then(([response1]) => {
//                 if (!response1.ok) {
//                     throw new Error('One or both requests failed');
//                 }
//                 return Promise.all([response1.json()]);
//             })
//             .then(([data1]) => {
//                 console.log('Data1:', data1);

//                 if (data1.error || data2.error) {
//                     alert('Error occurred during employee update');
//                 } else {
//                     alert('Employee updated successfully');

//                 }
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//                 alert('An error occurred during employee update');
//             });
//     };

//     return (
//         <div className='bg-[#f7f7f8]'>
//             <div className="container mx-auto py-5">
//                 <h1 className="text-2xl font-bold mb-5">Edit Employee Information</h1>
//                 <div className="bg-white shadow-md rounded p-5">
//                     <form onSubmit={employee_edit}>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Living Division</label>
//                                 <select
//                                     value={formData.living_division_id}
//                                     onChange={handleDivisionChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select Division</option>
//                                     {divisions.map(division => (
//                                         <option key={division.id} value={division.id}>{division.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Living District</label>
//                                 <select
//                                     value={formData.living_district_id}
//                                     onChange={handleDistrictChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select District</option>
//                                     {filteredDistricts.map(district => (
//                                         <option key={district.id} value={district.id}>{district.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Living Upazila</label>
//                                 <select
//                                     value={formData.living_upazila_id}
//                                     onChange={handleUpazilaChange}
//                                     className=""
//                                 >
//                                     <option value="">Select Upazila</option>
//                                     {filteredUpazilas.map(upazila => (
//                                         <option key={upazila.id} value={upazila.id}>{upazila.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Living Address</label>
//                                 <input
//                                     type="text"
//                                     value={formData.living_address}
//                                     onChange={handleLivingAddressChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Permanent Division</label>
//                                 <select
//                                     value={formData.permanent_division_id}
//                                     onChange={handlePermanentDivisionChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select Division</option>
//                                     {divisions.map(division => (
//                                         <option key={division.id} value={division.id}>{division.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Permanent District</label>
//                                 <select
//                                     value={formData.permanent_district_id}
//                                     onChange={handlePermanentDistrictChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select District</option>
//                                     {districts.filter(district => district.division_id === parseInt(formData.permanent_division_id)).map(district => (
//                                         <option key={district.id} value={district.id}>{district.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Permanent Upazila</label>
//                                 <select
//                                     value={formData.permanent_upazila_id}
//                                     onChange={handlePermanentUpazilaChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select Upazila</option>
//                                     {upazilas.filter(upazila => upazila.district_id === parseInt(formData.permanent_district_id)).map(upazila => (
//                                         <option key={upazila.id} value={upazila.id}>{upazila.name}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
//                                 <input
//                                     type="text"
//                                     value={formData.permanent_address}
//                                     onChange={handlePermanentAddressChange}
//                                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                                 />
//                             </div>
//                             <div className="col-span-2">
//                                 <label className="inline-flex items-center mt-3">
//                                     <input
//                                         type="checkbox"
//                                         className="form-checkbox h-5 w-5 text-gray-600"
//                                         checked={isAddressSame}
//                                         onChange={handleCheckboxChange}
//                                     />
//                                     <span className="ml-2 text-gray-700">Permanent address same as living address</span>
//                                 </label>
//                             </div>
//                         </div>
//                         <div className="row no-gutters">
//                             <div className="col-md-12 offset-md-3">
//                                 <input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EmployeeEdit;
