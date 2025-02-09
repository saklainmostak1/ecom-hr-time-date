'use client' 
 //ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const EmployeeCreate = () => {



    
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

    

    let [fields, setFields] = useState([{
        educational_qualifications: [

            {education: '', institute: '',
            result: '', passing_year: '', created_by: ''}
        ]
    }]);

    const [numToAdd, setNumToAdd] = useState(1);


    const handleAddMore = () => {
        const numToAddInt = parseInt(numToAdd);
        if (!isNaN(numToAddInt) && numToAddInt > 0) {
            const newInputValues = [...fields];
            for (let i = 0; i < numToAddInt; i++) {
                newInputValues.push({
                    educational_qualifications: [

                        {education: '', institute: '',
                        result: '', passing_year: '', created_by: ''}
                    ]
                    
                });
            }
            setFields(newInputValues);
            setNumToAdd(1);
        }
    };




    const handleRemoveField = (index) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };


    const { data: payRoll = [], isLoading, refetch
    } = useQuery({
        queryKey: ['payRoll'],
        queryFn: async () => {
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

    const { data: district = [],
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
    const { data: bloods = [],
    } = useQuery({
        queryKey: ['bloods'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/blood_group/blood_group_all`)

            const data = await res.json()
            return data
        }
    })

    



    const [selectedDivision, setSelectedDivision] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    
    const [selectedDivisions, setSelectedDivisions] = useState("");
    const [selectedDistricts, setSelectedDistricts] = useState("");
    const [filteredDistrictss, setFilteredDistrictss] = useState([]);
    const [filteredUpazilass, setFilteredUpazilass] = useState([]);
    
    const [selectedUpazila, setSelectedUpazila] = useState('');
    const [livingAddress, setLivingAddress] = useState('');
    
    const [selectedUpazilas, setSelectedUpazilas] = useState('');
    const [livingAddresss, setLivingAddresss] = useState('');
    
    const [sameAsLiving, setSameAsLiving] = useState(false); // State for checkbox

    useEffect(() => {
        if (selectedDivision) {
            const filtered = district.filter(district => district.division_id === parseInt(selectedDivision));
            setFilteredDistricts(filtered);
        } else {
            setFilteredDistricts([]);
        }
        setSelectedDistrict(""); // Reset selected district when division changes
    }, [selectedDivision, district]);

    useEffect(() => {
        if (selectedDistrict) {
            const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistrict));
            setFilteredUpazilas(filtered);
        } else {
            setFilteredUpazilas([]);
        }
    }, [selectedDistrict, upazilas]);

    useEffect(() => {
        if (selectedDivisions) {
            const filtered = district.filter(district => district.division_id === parseInt(selectedDivisions));
            setFilteredDistrictss(filtered);
        } else {
            setFilteredDistrictss([]);
        }
        setSelectedDistricts(""); // Reset selected district when division changes
    }, [selectedDivisions, district]);

    useEffect(() => {
        if (selectedDistricts) {
            const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistricts));
            setFilteredUpazilass(filtered);
        } else {
            setFilteredUpazilass([]);
        }
    }, [selectedDistricts, upazilas]);

    const handleDivisionChange = (e) => setSelectedDivision(e.target.value);
    const handleDistrictChange = (e) => setSelectedDistrict(e.target.value);
    const handleUpazilaChange = (e) => setSelectedUpazila(e.target.value);
    const handleLivingAddressChange = (e) => setLivingAddress(e.target.value);
    const handleDivisionChanges = (e) => setSelectedDivisions(e.target.value);
    const handleDistrictChanges = (e) => setSelectedDistricts(e.target.value);
    const handleUpazilaChanges = (e) => setSelectedUpazilas(e.target.value);
    const handleLivingAddressChanges = (e) => setLivingAddresss(e.target.value);

    const handleCheckboxChange = () => {
        setSameAsLiving(prevState => {
            const newState = !prevState;
            if (newState) {
                // Sync Permanent Address with Living Address
                setSelectedDivisions(selectedDivision);
                setSelectedDistricts(selectedDistrict);
                setSelectedUpazilas(selectedUpazila);
                setLivingAddresss(livingAddress);
            } else {
                // Reset Permanent Address
                setSelectedDivisions("");
                setSelectedDistricts("");
                setSelectedUpazilas("");
                setLivingAddresss("");
            }
            // return newState;
            return newState ? 1 : 0;
        });
    };

    useEffect(() => {
        if (sameAsLiving) {
            setSelectedDivisions(selectedDivision);
            setSelectedDistricts(selectedDistrict);
            setSelectedUpazilas(selectedUpazila);
            setLivingAddresss(livingAddress);
        }
    }, [sameAsLiving, selectedDivision, selectedDistrict, selectedUpazila, livingAddress]);

    const { data: schoolShiftList = [],
    } = useQuery({
        queryKey: ['schoolShiftList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all`)

            const data = await res.json()
            return data
        }
    })


    console.log(payRoll)



    const [created_by, setCreated_by] = useState(() => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('userId') || '';
        }
        return '';
      });
    
      useEffect(() => {
        if (typeof window !== 'undefined') {
          const storedUserId = localStorage.getItem('userId');
          setCreated_by(storedUserId);
        }
      }, []);

    let [fieldes, setFieldes] = useState({
        // user_id: '',
        qualification: '',
        experience: '',
        education: '',
        institute: '',
        result: '',
        passing_year: '',
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
        designation_id: '',
        employee_id: '',
        full_name: '',
        father_name: '',
        dob: '',
        gender: '',
        religion: '',
        mobile: '',
        email: '',
        password: '',
       confirm_password: '',
        signature_image: '',
        father_name: '',
        mother_name: '',
        photo: '',
        same_as: '',
        father_service: '', mother_service: '', father_mobile: '', mother_mobile: '',

    });


    const [currentDate, setCurrentDate] = useState([])
    const handleDateChange = (event) => {
        const selectedDate = event.target.value; // Directly get the value from the input

        const day = String(selectedDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
        const month = String(selectedDate.split('-')[1]).padStart(2, '0');
        const year = String(selectedDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;
        setCurrentDate(formattedDate)
        setFieldes(prevData => ({
            ...prevData,
            dob: formattedDatabaseDate // Update the period_name field in the state
        }));

        if(!formattedDatabaseDate){
            setDob('Date Of Birth Day must be filled nayan')
        }
        else{
            setDob('')
        }

    };
    console.log(currentDate)

    // const period_name = allEmployeeList.dob;
    // const formattedDate = period_name.split('T')[0];
    const [reformattedDate, setReformattedDate] = useState('');

    useEffect(() => {
        const period_name = fieldes.dob;
        const formattedDate = period_name?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setReformattedDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [fieldes]);


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
        setFieldes(prevData => ({
            ...prevData,
            join_date: formattedDatabaseDate // Update the dob field in the state
        }));
        if(!formattedDatabaseDate){
            setJoinDate('Join Date must be filled nayan')
        }
        else{
            setJoinDate('')
        }
    };

    console.log(selectedDate);

    useEffect(() => {
        const dob = fieldes.join_date;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [fieldes]);


    const [fullName, setFullName] = useState([])
    const [confirm_password, setconfirm_password] = useState([])
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


    const handleChange = (index, event) => {

        const newFields = [...fields];

        if (event.target.type === 'file') {
            newFields[index][event.target.name] = event.target.files[0];
        } else {
            newFields[index][event.target.name] = event.target.value;

        }


        const education = newFields[index]['education']; 
        if(education){
            setEducation('')
        }

        const institute = newFields[index]['institute']; 
        if(institute){
            setSchool('')
        }

        const result = newFields[index]['result']; 
        if(result){
            setResult('')
        }

        const passing_year = newFields[index]['passing_year']; 
        if(passing_year){
            setPassingYear('')
        }

      

        

        setFields(newFields);




    };

  

    const employee_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...fieldes }
        attribute[name] = value
        setFieldes(attribute)

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (name === 'email') {
            // Validate the email format
            if (!emailRegex.test(value)) {
                setEmail("Please enter a valid email in the format abcd@abcd.com");
            } else {
                setEmail(""); // Clear the error message if valid
            }
        }
      
        const fullName = attribute['full_name'];
        if (fullName) {
            setFullName(""); // Clear the error message
        }
       
        const fatherName = attribute['father_name'];
        if (fatherName) {
            setFatherName(""); // Clear the error message
        }
       
        const motherName = attribute['mother_name'];
        if (motherName) {
            setMotherName(""); // Clear the error message
        }

        const gender = attribute['gender'];
        if (gender ) {
            setGender(""); // Clear the error message
        }
       
        const religion = attribute['religion'];
        if (religion ) {
            setReligion(""); // Clear the error message
        }
       

        const dateOfBath = attribute['dob'];
        if (dateOfBath) {
            setDob(""); // Clear the error message
        }
       
        const mobile = attribute['mobile'];
        if (mobile) {
            setMobile(""); // Clear the error message
        }
       
        const email = attribute['email'];
        if (email) {
            setEmail(""); // Clear the error message
        }
       
        const experience = attribute['experience'];
        if (experience) {
            setExperience(""); // Clear the error message
        }
       
        const password = attribute['password'];
        if (password) {
            setPassword(""); // Clear the error message
        }

        const confirm_password = attribute['confirm_password'];
        if (confirm_password) {
            setConfirmPassword(""); // Clear the error message
        }
       
        const join_date = attribute['join_date'];
        if (join_date) {
            setJoinDate(""); // Clear the error message
        }
       
       
        const designation_id = attribute['designation_id'];
        if (designation_id) {
            setDesignation(""); // Clear the error message
        }

        const employee_id = attribute['employee_id'];
        if (employee_id) {
            setEmployeeId(""); // Clear the error message
        }
       
        const school_shift_id = attribute['school_shift_id'];
        if (school_shift_id) {
            setShift(""); // Clear the error message
        }
       
        const payroll_id = attribute['payroll_id'];
        if (payroll_id) {
            setPayroll(""); // Clear the error message
        }

        if(password === confirm_password){
            setconfirm_password('')
        }

      
       

    };


  



    const [selectedFile, setSelectedFile] = useState(null);
    const [fileNames, setFileNames] = useState([]);
    const [fileSizeError, setFileSizeError] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

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
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);


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

    const { data: genderList = [],
    } = useQuery({
        queryKey: ['genderList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/gender/gender_list`)

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


console.log(sameAsLiving)


const { data: smsSettings = [],  } = useQuery({
    queryKey: ['smsSettings'],
    queryFn: async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/smsSettings`);
        const data = await res.json();
        return data;
    }
});

console.log(smsSettings.find(sms => sms.sms_system === 1))
const attendanceSms = smsSettings.find(sms => sms.sms_system === 1)
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
console.log(fieldes.join_date)
const formatDate = (dateString) => {
    return dateString.split('-').join('/');
};

const [sendSmsChecked, setSendSmsChecked] = useState(false);

const designation_name = designationList.find(desig => desig.id === parseFloat(fieldes.designation_id))
const payroll_name = payRoll.find(desig => desig.id === parseFloat(fieldes.payroll_id))
console.log(designationList)
console.log(payroll_name)

const employeeAttendanceSmsTemplate = attendanceSms?.oe_join
const employeeSalarySmsTemplate = attendanceSms?.auto_oe_join

const sendOtpToEmployees = () => {
  

    if (!sendSmsChecked) {
        console.log('SMS sending is disabled');
        return;
    }
    
    if (employeeSalarySmsTemplate !== 1) {
        console.log('Auto is not active');
        return;
    }
    

            const currentDate = new Date();

            const smsTime = currentDate.toLocaleTimeString();
 
            // Replace placeholders with actual data
            let msg = employeeAttendanceSmsTemplate
                .replace('[[company_name]]', fieldes?.company_name || 'No Company')
                .replace('[[full_name]]', fieldes.full_name)
                .replace('[[employee_id]]', fieldes.employee_id)
                .replace('[[employee_designation]]', designation_name.designation_name)
                .replace('[[payroll_name]]', payroll_name.title)
                .replace('[[payroll_total]]', payroll_name.basic)
                .replace('[[joining_date]]', formatDate(formattedDisplayDate))
                .replace('[[sms_time]]', smsTime);

            axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
                // quick_api: quickApi,
                formattedUrl,
                mobile: fieldes.mobile,
                msg: msg,
            })
                .then(response => {
                    console.log(`OTP sent to ${fieldes.full_name} (${fieldes.mobile}):`, response.data);
                })
                .catch(error => {
                    console.error(`Failed to send OTP to ${fieldes.full_name} (${fieldes.mobile}):`, error);
                });
    
};

console.log(formattedDisplayDate)


const { data: attendance_sms_campaign_categorys = [] } = useQuery({
    queryKey: ['attendance_sms_campaign_categorys'],
    queryFn: async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance_sms/attendance_sms_campaign_category`)
        const data = await res.json()
        return data
    }
});

const employeeAttendance = attendance_sms_campaign_categorys.find(attendance_sms_campaign_category => attendance_sms_campaign_category.id === 11)

const employee_create = (event) => {

    event.preventDefault();
    const form = event.target;

    const full_name = form.full_name.value;
    const confirm_password = form.confirm_password.value;
    const dob = form.dob.value;
    const gender = form.gender.value;
    const religion = form.religion.value;
    const mobile = form.mobile.value;
    const email = form.email.value;
    const password = form.password.value;
    const experience = form.experience.value;
    const education = form.education.value;
    const institute = form.institute.value;
    const result = form.result.value;
    const passing_year = form.passing_year.value;
    const same_as = sameAsLiving;
    const division_id_living = selectedDivision;
    const district_id_living = selectedDistrict;
    const upazila_id_living = selectedUpazila;
    const address_id_living = livingAddress;
    const division_id_permanent = selectedDivisions;
    const district_id_permanent = selectedDistricts;
    const upazila_id_permanent = selectedUpazilas;
    const address_id_permanent = livingAddresss;
    const join_date = form.join_date.value;
    const payroll_id = form.payroll_id.value;
    const school_shift_id = form.school_shift_id.value;
    const signature_image = form.signature_image.value;
    const photo = form.photo.value;
    const designation_id = form.designation_id.value;
    const father_name = form.father_name.value;
    const mother_name = form.mother_name.value;
    const unique_id = form.employee_id.value;
    const branch_id = form.branch_id.value;
    const blood_group_id = form.blood_group_id.value;
    const NID = form.NID.value;
    const father_service = form.father_service.value;
    const mother_service = form.mother_service.value;
    const father_mobile = form.father_mobile.value;
    const mother_mobile = form.mother_mobile.value;


    if(!full_name){
        setFullName('Name Must Be filled')
        return
    }
    if(!father_name){
        setFatherName('Father Name Must Be filled')
        return
    }

    if(!mother_name){
        setMotherName('Mother Name Must Be filled')
        return
    }

    if(!gender){
        setGender('Gender Name Must Be filled')
        return
    }

    if(!dob){
        setDob('Date Of Birth Day  Must Be filled')
        return
    }
    if(!religion){
        setReligion('Religion  Must Be filled')
        return
    }
    if(!mobile){
        setMobile('Mobile Number  Must Be filled')
        return
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
        setEmail("email Is required"); // Clear the error message if valid
       
        return
    } else if ( !emailRegex.test(fieldes.email)) {
        setEmail("Please enter a valid email in the format abcd@abcd.com");
        return
    }

    if(!email){
        setEmail('Email  Must Be filled')
        return
    }

    if(!experience){
        setExperience('experience  Must Be filled')
        return
    }
    if(!password){
        setPassword('Password  Must Be filled')
        return
    }
    if(!fieldes.confirm_password){
        setConfirmPassword('Confirm Password  Must Be filled')
        return
    }

    if(!division_id_living){
        setLDivision('Division Must Be filled')
        return
    }
    if(!join_date){
        setJoinDate('Join Date Must Be filled')
        return
    }
    if(!designation_id){
        setDesignation('Designation Must Be filled')
        return
    }

    if(!unique_id){
        setEmployeeId('employee Id Must Be filled')
        return
    }

    if(!school_shift_id){
        setShift('School Shift Must Be filled')
        return
    }
    if(!payroll_id){
        setPayroll('Payroll  Must Be filled')
        return
    }
    if(password !== confirm_password ){
        setconfirm_password('Password and confrim password does not match')
        return
    }

    


    

    const newErrors = new Array(fields.length).fill('');
    const isValid = fields.every((inputValue, index) => {
        if (!inputValue.education) {
            newErrors[index] = 'Education Name must be filled.';
            return false;
        }
        return true;
    });

    if (!isValid) {
        setEducation(newErrors);
        return;
    }
    setEducation(new Array(fields.length).fill(''));

    const newError = new Array(fields.length).fill('');
    const isValids = fields.every((inputValue, index) => {
        if (!inputValue?.institute) {
            newError[index] = 'Institute Name must be filled.';
            return false;
        }
        return true;
    });

    if (!isValids) {
        setSchool(newError);
        return;
    }
    setSchool(new Array(fields.length).fill(''));


    const newErrorName = new Array(fields.length).fill('');
    const isValidsName = fields.every((inputValue, index) => {
        if (!inputValue?.result) {
            newErrorName[index] = 'Result must be filled.';
            return false;
        }
        return true;
    });

    if (!isValidsName) {
        setResult(newErrorName);
        return;
    }
    setResult(new Array(fields.length).fill(''));


    const newErrorGender = new Array(fields.length).fill('');
    const isValidsGender = fields.every((inputValue, index) => {
        if (!inputValue?.passing_year) {
            newErrorGender[index] = 'Passing Year must be filled.';
            return false;
        }
        return true;
    });

    if (!isValidsGender) {
        setPassingYear(newErrorGender);
        return;
    }
    setPassingYear(new Array(fields.length).fill(''));
  
   

    const uniqueFields = {
        NID,
        blood_group_id,
        father_name,
        mother_name,
        full_name,
        dob,
        gender,
        religion,
        mobile,
        email,
        password,
        experience,
        same_as,
        division_id_living,
        district_id_living,
        upazila_id_living,
        address_id_living,
        division_id_permanent,
        district_id_permanent,
        upazila_id_permanent,
        address_id_permanent,
        join_date,
        payroll_id,
        school_shift_id,
        signature_image,
        photo,
        created_by,
        designation_id,
        unique_id,
        branch_id,
        fields,
        father_service, 
        mother_service,
        father_mobile, 
        mother_mobile,
        name: employeeAttendance.category_name,
        sms_campaign_category_id: employeeAttendance.id,
        formattedDisplayDate,
        employeeAttendanceSmsTemplate,
        sendSmsChecked

    }
    console.log(uniqueFields)
    // 
    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_create`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(uniqueFields),
    })
        .then((Response) =>
            Response.json()
        )
        .then((data) => {
            console.log(data[0])
            if (data[0]?.affectedRows > 0) {
                if(typeof window !== 'undefined'){

                    sessionStorage.setItem("message", "Data saved successfully!");
                }
                // router.push('/Admin/brand/brand_all');
            }
            console.log(data)

        })
        .catch((error) => console.error(error));
}


    return (
        <div className="container-fluid">

            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="body-content bg-light">

                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">

                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Employee</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/employee/employee_all?page_group`} className="btn btn-sm btn-info">Back Employee List</Link>
                                        
                                    </div>
                                </div>
                                <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                    (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                </div>
                                <div class="card-body ">
                                    <form class="" method="post" autocomplete="off" onSubmit={employee_create}>
                                        <div class="card bg-white mb-3  shadow-sm ">
                                            <div class="card-header p-2 bg-gradient-primary text-white">
                                                <div class="card-title font-weight-bold mb-0   float-left mt-1 ">Employee Information</div>
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
                                                                onChange={employee_input_change}
                                                                    type="text" name="full_name" class="form-control form-control-sm  required " id="full_name" placeholder="Enter Full Name" />
                                                                    {
                                                                        fullName && <p className='text-danger m-0'>{fullName}</p>
                                                                    }
                                                                
                                                            </div>
                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3">
                                                                <label class="font-weight-bold  text-left"> NID:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                            </div>
                                                            <div class="col-md-8">
                                                                <input 
                                                                onChange={employee_input_change}
                                                                    type="number"
                                                                   name='NID'
                                                                    class="form-control form-control-sm  required "  placeholder="Enter NID Number" />
                                                                   
                                                                
                                                            </div>
                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold  text-right">Religion:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <select 
                                                                onChange={employee_input_change}
                                                                name="religion" class="form-control form-control-sm  required integer_no_zero">
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
                                                                <input
                                                                    onChange={employee_input_change}
                                                                    type="number" name="mobile" maxlength="11" class="form-control form-control-sm  required " id="mobile" placeholder="Enter Mobile" />
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
                                                                type="number" name="experience" class="form-control form-control-sm  required " id="experience" placeholder="Enter Year of Experience" />
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
                                                                    onChange={employee_input_change}
                                                                    name="gender" class="form-control form-control-sm  required integer_no_zero" id="gender_name">
                                                                    <option value="" >Select Gender</option>
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
                                                                onChange={employee_input_change}
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
                                                                onChange={employee_input_change}
                                                                type="text" name="email" class="form-control form-control-sm  required " id="email" placeholder="Enter Email ID" />
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
                                                                <input type="password" 
                                                                onChange={employee_input_change}
                                                                name="confirm_password" class="form-control form-control-sm  required matches_password" id="confirm_password" placeholder="Enter Confirm Password" />
                                                                {
                                                                    confirmPassword && <p className='text-danger m-0'>{confirmPassword}</p>
                                                                }
                                                                {
                                                                    confirm_password && <p className='text-danger m-0'>{confirm_password}</p>
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
                                                                <input 
                                                                onChange={employee_input_change}
                                                                type="text" name="father_name" class="form-control form-control-sm  required " id="father_name" placeholder="Enter Father Name" />
                                                                {
                                                                    fatherName && <p className='text-danger m-0'>{fatherName}</p>
                                                                }
                                                               
                                                            </div>
                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3">
                                                                <label class="font-weight-bold  text-right">Father Mobile:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                            </div>
                                                            <div class="col-md-8">
                                                                <input 
                                                                onChange={employee_input_change}
                                                                type="text" name="father_mobile" class="form-control form-control-sm  required "  placeholder="Enter Father Mobile Number " />
                                                              
                                                                
                                                                
                                                            </div>
                                                        </div>
                                                    

                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold ">Father Profession :<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <select
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
                                                                <input 
                                                                onChange={employee_input_change}
                                                                type="text" name="mother_name" class="form-control form-control-sm  required " id="mother_name" placeholder="Enter Mother Name" />
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
                                                                onChange={employee_input_change}
                                                                type="text" name="mother_mobile" class="form-control form-control-sm  required " placeholder="Enter Mother Mobile number" />
                                                               
                                                                
                                                            </div>
                                                        </div>
                                                        <div class="form-group row no-gutters">
                                                            <div class="col-md-3"><label class="font-weight-bold ">Mother Profession:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                            <div class="col-md-8">
                                                                <select
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
                                            <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary shadow-sm text-white">

                                                <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
                                                    <strong>Educational Qualification</strong>
                                                </div>

                                                <div className="card-title card-header-color font-weight-bold mb-0 float-right">
                                                    <div className="input-group printable">
                                                        <input
                                                            style={{ width: '80px' }}
                                                            type="number"
                                                            min="1"
                                                            className="form-control "
                                                            placeholder="Enter number of forms to add"
                                                            value={numToAdd}
                                                            onChange={(event) => setNumToAdd(event.target.value)}
                                                        />
                                                        <div className="input-group-append">
                                                            <button
                                                                type="button"
                                                                className="btn btn-info btn-sm py-1 add_more "
                                                                onClick={handleAddMore}
                                                            >
                                                                Add More
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="form-group row px-3 ">
                                                    <table className="table table-bordered  table-hover table-striped table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>Education<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>School/College/University<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Result<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Passing Year<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></th>
                                                                <th>Action</th>
                                                            </tr>

                                                        </thead>

                                                        <tbody>

                                                            {isLoading ? <div className='text-center'>
                                                                <div className='  text-center text-dark'>

                                                                    <FontAwesomeIcon style={{
                                                                        height: '33px',
                                                                        width: '33px',
                                                                    }} icon={faSpinner} spin />

                                                                </div>
                                                            </div>

                                                                :


                                                                <>

                                                                    {
                                                                        fields.map((field, index) => (
                                                                            <>

                                                                                <tr >
                                                                                    <td>
                                                                                        <select
                                                                                            value={field.educational_qualifications.education}
                                                                                            onChange={(e) => handleChange(index, e)}
                                                                                            name="education" class="form-control form-control-sm  trim integer_no_zero row_unique_education" id="education" placeholder="Enter Education">
                                                                                            <option >Select Education</option>
                                                                                            {
                                                                                                educationName.map(educations =>
                                                                                                    <>
                                                                                                        <option value={educations.id}>
                                                                                                            {educations.education_name}
                                                                                                        </option>
                                                                                                    </>

                                                                                                )
                                                                                            }

                                                                                        </select>
                                                                                        {
                                                                                            education[index] && <p className='text-danger m-0'>{education[index]}</p>
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            value={field.educational_qualifications.institute}
                                                                                            onChange={(e) => handleChange(index, e)}
                                                                                            type="text" name="institute" class="form-control form-control-sm  required row_unique_institute" id="institute" placeholder="Enter Institute" />
                                                                                     {
                                                                                            School[index] && <p className='text-danger m-0'>{School[index]}</p>
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            value={field.educational_qualifications.result}
                                                                                            onChange={(e) => handleChange(index, e)}
                                                                                            type="text" name="result" class="form-control form-control-sm  required row_unique_result" id="result" placeholder="Enter Result" />
                                                                                     {
                                                                                            result[index] && <p className='text-danger m-0'>{result[index]}</p>
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            value={field.educational_qualifications.passing_year}
                                                                                            onChange={(e) => handleChange(index, e)}
                                                                                            type="text" name="passing_year" class="form-control form-control-sm  required row_unique_passing_year" id="passing_year" placeholder="Enter Passing Year" />
                                                                                     {
                                                                                            passingYear[index] && <p className='text-danger m-0'>{passingYear[index]}</p>
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        <button
                                                                                            onClick={() => handleRemoveField(index)}
                                                                                            type="button" class="btn btn-sm btn-danger btn-sm remove delete"><i class="fas fa-trash-alt"></i></button>
                                                                                    </td>


                                                                                </tr>
                                                                            </>
                                                                        ))
                                                                    }
                                                                </>
                                                            }
                                                        </tbody>

                                                    </table>


                                                </div>
                                            </div>
                                        </div>


                        

                                    <form method="post" autoComplete="off">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card bg-white mb-3 shadow-sm">
                                                    <div className="card-header p-2 bg-gradient-primary text-white">
                                                         <div className="card-title font-weight-bold mb-0 float-left mt-1">Living Address</div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row no-gutters">
                                                            <div className="col-md-12">
                                                                <div className="form-group row no-gutters">
                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Division:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                                    <div className="col-md-8">
                                                                        <select value={selectedDivision} onChange={handleDivisionChange} name="ldivision_id" className="form-control form-control-sm required integer_no_zero ldivision">
                                                                             <option value="">Select Division</option>
                                                                            {divisions.map(division => <option key={division.id} value={division.id}>{division.division_bn}</option>)}
                                                                        </select>
                                                                        {
                                                                            lDivision && <p className='text-danger m-0'>{lDivision}</p>
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row no-gutters">
                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">District:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                                    <div className="col-md-8">
                                                                         <select value={selectedDistrict} onChange={handleDistrictChange} name="ldistrict_id" className="form-control form-control-sm required integer_no_zero ldistrict">
                                                                             <option value="">Select District</option>
                                                                             {filteredDistricts.map(districts => <option key={districts.id} value={districts.id}>{districts.district_bn}</option>)}
                                                                         </select>
                                                                     </div>
                                                                 </div>
                                                                 <div className="form-group row no-gutters">
                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Upazila:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                                    <div className="col-md-8">
                                                                        <select value={selectedUpazila} onChange={handleUpazilaChange} name="lupazila_id" className="form-control form-control-sm required integer_no_zero lupazila">
                                                                             <option value="">Select Upazila</option>
                                                                             {filteredUpazilas.map(upazila => <option key={upazila.id} value={upazila.id}>{upazila.upazila_bn}</option>)}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row no-gutters">
                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Address:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                                     <div className="col-md-8">
                                                                         <input
                                                                            type="text"
                                                                            name="laddress"
                                                                            className="form-control form-control-sm required"
                                                                            id="address"
                                                                            placeholder="Enter Address"
                                                                            value={livingAddress}
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
                                                <div className="card bg-white mb-3 shadow-sm">
                                                    <div className="card-header p-2 bg-gradient-primary text-white clearfix">
                                                        <div className="card-title font-weight-bold mb-0 float-left mt-1">Permanent Address</div>
                                                        <div className="form-check form-check-inline float-right">
                                                            <input
                                                                type="checkbox"
                                                                name="same_as"
                                                                className="same_as"
                                                                checked={sameAsLiving}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <label className="font-weight-bold form-check-label ml-2" htmlFor="inlineCheckbox1">Same as Living Address</label>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row no-gutters">
                                                            <div className="col-md-12">
                                                                <div className="form-group row no-gutters">
                                                                    <div className="col-md-3"><label className="font-weight-bold text-right">Division:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                                    <div className="col-md-8">
                                                                        <select value={selectedDivisions} onChange={handleDivisionChanges} name="pdivision_id" className="form-control form-control-sm required integer_no_zero ldivision" disabled={sameAsLiving}>
                                                                            <option value="">Select Division</option>
                                                                            {divisions.map(division => <option key={division.id} value={division.id}>{division.division_bn}</option>)}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row no-gutters">
                                                                    <div className="col-md-3"><label className="font-weight-bold text-right">District:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                                    <div className="col-md-8">
                                                                        <select value={selectedDistricts} onChange={handleDistrictChanges} name="pdistrict_id" className="form-control form-control-sm required integer_no_zero ldistrict" disabled={sameAsLiving}>
                                                                            <option value="">Select District</option>
                                                                            {filteredDistrictss.map(districts => <option key={districts.id} value={districts.id}>{districts.district_bn}</option>)}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row no-gutters">
                                                                    <div className="col-md-3"><label className="font-weight-bold text-right">Upazila:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                                    <div className="col-md-8">
                                                                        <select value={selectedUpazilas} onChange={handleUpazilaChanges} name="pupazila_id" className="form-control form-control-sm required integer_no_zero lupazila" disabled={sameAsLiving}>
                                                                            <option value="">Select Upazila</option>
                                                                            {filteredUpazilass.map(upazila => <option key={upazila.id} value={upazila.id}>{upazila.upazila_bn}</option>)}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row no-gutters">
                                                                    <div className="col-md-3"><label className="font-weight-bold text-right">Address:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
                                                                    <div className="col-md-8">
                                                                        <input
                                                                            type="text"
                                                                            name="paddress"
                                                                            className="form-control form-control-sm required"
                                                                            id="address"
                                                                            placeholder="Enter Address"
                                                                            value={livingAddresss}
                                                                            onChange={handleLivingAddressChanges}
                                                                            disabled={sameAsLiving}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                          

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
                                                                onChange={employee_input_change}
                                                                name='employee_id'
                                                                type="text"  class=" form-control form-control-sm  required " id="finger_print_id" placeholder="Enter Employee ID" />
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
                                                                onChange={employee_input_change}
                                                                name="designation_id" class=" form-control form-control-sm  required integer_no_zero " id="designation_name">
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
                                                                onChange={employee_input_change}
                                                                 name="payroll_id" class="form-control form-control-sm  required integer_no_zero " id="title">
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
onChange={employee_input_change}
                                                                    name="school_shift_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
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
                                            <div class="card-header p-2  bg-gradient-primary text-white ">
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
                                                                <input type="text" className='d-none' value={uploadedFileUrl} name='photo' />
                                                                <div id="software_logo" className="logo bg-light img-thumbnail">
                                                                    {uploadedFileUrl && <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${uploadedFileUrl}`} alt="Uploaded" className="img-fluid" />}
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
                                                                <input name='signature_image' type="text" className='d-none' value={uploadedImageUrl} />
                                                                <div id="software_logo" className="logo bg-light img-thumbnail">
                                                                    {uploadedImageUrl && <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${uploadedImageUrl}`} alt="Uploaded" className="img-fluid" />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                               <div className='mt-4'>
                                               <label className='font-weight-bold'>
                <input 
                    type="checkbox" 
                    checked={sendSmsChecked} 
                    onChange={(e) => setSendSmsChecked(e.target.checked)} 
                />
               <span> Send SMS</span>
            </label>
                                               </div>
                                                </div>
                                                <div class="row no-gutters">
                                                    <div class="col-md-6 offset-md-3">
                                                        <input
                                                        onClick={sendOtpToEmployees}
                                                        type="submit" name="create" class="btn btn-sm btn-success" value="Submit" />
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

export default EmployeeCreate;

// 'use client' 
 //ismile
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';
// import { FaMapMarkerAlt } from 'react-icons/fa';

// const EmployeeCreate = () => {

//     let [fields, setFields] = useState([{
//         educational_qualifications: [

//             {education: '', institute: '',
//             result: '', passing_year: '', created_by: ''}
//         ]
//     }]);

//     const [numToAdd, setNumToAdd] = useState(1);


//     const handleAddMore = () => {
//         const numToAddInt = parseInt(numToAdd);
//         if (!isNaN(numToAddInt) && numToAddInt > 0) {
//             const newInputValues = [...fields];
//             for (let i = 0; i < numToAddInt; i++) {
//                 newInputValues.push({
//                     educational_qualifications: [

//                         {education: '', institute: '',
//                         result: '', passing_year: '', created_by: ''}
//                     ]
                    
//                 });
//             }
//             setFields(newInputValues);
//             setNumToAdd(1);
//         }
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

//     // const [selectedDivision, setSelectedDivision] = useState("");
//     // const [selectedDistrict, setSelectedDistrict] = useState("");
//     // const [filteredDistricts, setFilteredDistricts] = useState([]);
//     // const [filteredUpazilas, setFilteredUpazilas] = useState([]);

//     // const handleDivisionChange = (e) => {
//     //     setSelectedDivision(e.target.value);
//     // };
    
//     // const handleDistrictChange = (e) => {
//     //     setSelectedDistrict(e.target.value);
//     // };
    
    

//     // useEffect(() => {
//     //     if (selectedDivision) {
//     //         const filtered = district.filter(district => district.division_id === parseInt(selectedDivision));
//     //         setFilteredDistricts(filtered);
//     //     } else {
//     //         setFilteredDistricts([]);
//     //     }
//     //     setSelectedDistrict(""); // Reset selected district when division changes
//     // }, [selectedDivision, district]);

//     // useEffect(() => {
//     //     if (selectedDistrict) {
//     //         const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistrict));
//     //         setFilteredUpazilas(filtered);
//     //     } else {
//     //         setFilteredUpazilas([]);
//     //     }
//     // }, [selectedDistrict, upazilas]);


//     // const [selectedDivisionCopy, setSelectedDivisionCopy] = useState("");
//     // const [selectedDistrictCopy, setSelectedDistrictCopy] = useState("");
//     // const [filteredDistrictsCopy, setFilteredDistrictsCopy] = useState([]);
//     // const [filteredUpazilasCopy, setFilteredUpazilasCopy] = useState([]);

//     // useEffect(() => {
//     //     if (selectedDivisionCopy) {
//     //         const filtered = district.filter(district => district.division_id === parseInt(selectedDivisionCopy));
//     //         setFilteredDistrictsCopy(filtered);
//     //     } else {
//     //         setFilteredDistrictsCopy([]);
//     //     }
//     //     setSelectedDistrictCopy(""); // Reset selected district when division changes
//     // }, [selectedDivisionCopy, district]);

//     // useEffect(() => {
//     //     if (selectedDistrictCopy) {
//     //         const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistrictCopy));
//     //         setFilteredUpazilasCopy(filtered);
//     //     } else {
//     //         setFilteredUpazilasCopy([]);
//     //     }
//     // }, [selectedDistrictCopy, upazilas]);

//     // const [livingAddress, setLivingAddress] = useState('');
//     // const [isSameAsLivingAddress, setIsSameAsLivingAddress] = useState(false);

//     // const handleLivingAddressChange = (e) => {
//     //     setLivingAddress(e.target.value);
//     // };

//     // useEffect(() => {
//     //     if (isSameAsLivingAddress) {
//     //         setSelectedDivisionCopy(selectedDivision);
//     //         setSelectedDistrictCopy(selectedDistrict);
//     //         setFilteredDistrictsCopy(filteredDistricts);
//     //         setFilteredUpazilasCopy(filteredUpazilas);
//     //     }
//     //     else {
//     //         setSelectedDivisionCopy('');

//     //     }
//     // }, [isSameAsLivingAddress, selectedDivision, selectedDistrict, filteredDistricts, filteredUpazilas]);

//     // const [selectedUpazila, setSelectedUpazila] = useState('');
//     // const handleUpazilaChange = (e) => {
//     //     setSelectedUpazila(e.target.value);
//     // };



//     const [selectedDivision, setSelectedDivision] = useState("");
//     const [selectedDistrict, setSelectedDistrict] = useState("");
//     const [filteredDistricts, setFilteredDistricts] = useState([]);
//     const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    
//     const [selectedDivisions, setSelectedDivisions] = useState("");
//     const [selectedDistricts, setSelectedDistricts] = useState("");
//     const [filteredDistrictss, setFilteredDistrictss] = useState([]);
//     const [filteredUpazilass, setFilteredUpazilass] = useState([]);
    
//     const [selectedUpazila, setSelectedUpazila] = useState('');
//     const [livingAddress, setLivingAddress] = useState('');
    
//     const [selectedUpazilas, setSelectedUpazilas] = useState('');
//     const [livingAddresss, setLivingAddresss] = useState('');
    
//     const [sameAsLiving, setSameAsLiving] = useState(false); // State for checkbox

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

//     useEffect(() => {
//         if (selectedDivisions) {
//             const filtered = district.filter(district => district.division_id === parseInt(selectedDivisions));
//             setFilteredDistrictss(filtered);
//         } else {
//             setFilteredDistrictss([]);
//         }
//         setSelectedDistricts(""); // Reset selected district when division changes
//     }, [selectedDivisions, district]);

//     useEffect(() => {
//         if (selectedDistricts) {
//             const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistricts));
//             setFilteredUpazilass(filtered);
//         } else {
//             setFilteredUpazilass([]);
//         }
//     }, [selectedDistricts, upazilas]);

//     const handleDivisionChange = (e) => setSelectedDivision(e.target.value);
//     const handleDistrictChange = (e) => setSelectedDistrict(e.target.value);
//     const handleUpazilaChange = (e) => setSelectedUpazila(e.target.value);
//     const handleLivingAddressChange = (e) => setLivingAddress(e.target.value);
//     const handleDivisionChanges = (e) => setSelectedDivisions(e.target.value);
//     const handleDistrictChanges = (e) => setSelectedDistricts(e.target.value);
//     const handleUpazilaChanges = (e) => setSelectedUpazilas(e.target.value);
//     const handleLivingAddressChanges = (e) => setLivingAddresss(e.target.value);

//     const handleCheckboxChange = () => {
//         setSameAsLiving(prevState => {
//             const newState = !prevState;
//             if (newState) {
//                 // Sync Permanent Address with Living Address
//                 setSelectedDivisions(selectedDivision);
//                 setSelectedDistricts(selectedDistrict);
//                 setSelectedUpazilas(selectedUpazila);
//                 setLivingAddresss(livingAddress);
//             } else {
//                 // Reset Permanent Address
//                 setSelectedDivisions("");
//                 setSelectedDistricts("");
//                 setSelectedUpazilas("");
//                 setLivingAddresss("");
//             }
//             return newState;
//         });
//     };

//     useEffect(() => {
//         if (sameAsLiving) {
//             setSelectedDivisions(selectedDivision);
//             setSelectedDistricts(selectedDistrict);
//             setSelectedUpazilas(selectedUpazila);
//             setLivingAddresss(livingAddress);
//         }
//     }, [sameAsLiving, selectedDivision, selectedDistrict, selectedUpazila, livingAddress]);

//     const { data: schoolShiftList = [],
//     } = useQuery({
//         queryKey: ['schoolShiftList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all`)

//             const data = await res.json()
//             return data
//         }
//     })


//     console.log(payRoll)



//     const [created_by, setCreated_by] = useState(() => {
//         if (typeof window !== 'undefined') {
//           return localStorage.getItem('userId') || '';
//         }
//         return '';
//       });
    
//       useEffect(() => {
//         if (typeof window !== 'undefined') {
//           const storedUserId = localStorage.getItem('userId');
//           setCreated_by(storedUserId);
//         }
//       }, []);

//     let [fieldes, setFieldes] = useState({
//         // user_id: '',
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
//         full_name: '',
//         father_name: '',
//         mother_name: '',
//         dob: '',
//         gender: '',
//         religion: '',
//         mobile: '',
//         email: '',
//         password: '',
//        confirm_password: '',
//         signature_image: '',
//         father_name: '',
//         mother_name: '',
//         photo: '',
//         same_as: '',

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
//         setFieldes(prevData => ({
//             ...prevData,
//             dob: formattedDatabaseDate // Update the period_name field in the state
//         }));

//         if(!formattedDatabaseDate){
//             setDob('Date Of Birth Day must be filled nayan')
//         }
//         else{
//             setDob('')
//         }

//     };
//     console.log(currentDate)

//     // const period_name = allEmployeeList.dob;
//     // const formattedDate = period_name.split('T')[0];
//     const [reformattedDate, setReformattedDate] = useState('');

//     useEffect(() => {
//         const period_name = fieldes.dob;
//         const formattedDate = period_name?.split('T')[0];

//         if (formattedDate?.includes('-')) {
//             const [year, month, day] = formattedDate.split('-');
//             setReformattedDate(`${day}-${month}-${year}`);
//         } else {
//             console.log("Date format is incorrect:", formattedDate);
//         }
//     }, [fieldes]);


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
//         if(!formattedDatabaseDate){
//             setJoinDate('Join Date must be filled nayan')
//         }
//         else{
//             setJoinDate('')
//         }
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

//         const newFields = [...fields];

//         if (event.target.type === 'file') {
//             newFields[index][event.target.name] = event.target.files[0];
//         } else {
//             newFields[index][event.target.name] = event.target.value;

//         }


//         const education = newFields[index]['education']; 
//         if(education){
//             setEducation('')
//         }

//         const institute = newFields[index]['institute']; 
//         if(institute){
//             setSchool('')
//         }

//         const result = newFields[index]['result']; 
//         if(result){
//             setResult('')
//         }

//         const passing_year = newFields[index]['passing_year']; 
//         if(passing_year){
//             setPassingYear('')
//         }

      

        

//         setFields(newFields);




//     };

//     const employee_input_change = (event) => {
//         const name = event.target.name
//         const value = event.target.value
//         const attribute = { ...fieldes }
//         attribute[name] = value
//         setFieldes(attribute)
      
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
//         if (gender ) {
//             setGender(""); // Clear the error message
//         }
       
//         const religion = attribute['religion'];
//         if (religion ) {
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
       
//         const experience = attribute['experience'];
//         if (experience) {
//             setExperience(""); // Clear the error message
//         }
       
//         const password = attribute['password'];
//         if (password) {
//             setPassword(""); // Clear the error message
//         }

//         const confirm_password = attribute['confirm_password'];
//         if (confirm_password) {
//             setConfirmPassword(""); // Clear the error message
//         }
       
//         const join_date = attribute['join_date'];
//         if (join_date) {
//             setJoinDate(""); // Clear the error message
//         }
       
       
//         const designation_id = attribute['designation_id'];
//         if (designation_id) {
//             setDesignation(""); // Clear the error message
//         }

//         const employee_id = attribute['employee_id'];
//         if (employee_id) {
//             setEmployeeId(""); // Clear the error message
//         }
       
//         const school_shift_id = attribute['school_shift_id'];
//         if (school_shift_id) {
//             setShift(""); // Clear the error message
//         }
       
//         const payroll_id = attribute['payroll_id'];
//         if (payroll_id) {
//             setPayroll(""); // Clear the error message
//         }
       
       

//     };


//     const employee_create = (event) => {

//         event.preventDefault();
//         const form = event.target;

//         const full_name = form.full_name.value;
//         const dob = form.dob.value;
//         const gender = form.gender.value;
//         const religion = form.religion.value;
//         const mobile = form.mobile.value;
//         const email = form.email.value;
//         const password = form.password.value;
//         const experience = form.experience.value;
//         const education = form.education.value;
//         const institute = form.institute.value;
//         const result = form.result.value;
//         const passing_year = form.passing_year.value;
//         const same_as = form.same_as.value;
//         const division_id_living = form.ldivision_id.value;
//         const district_id_living = form.ldistrict_id.value;
//         const upazila_id_living = form.lupazila_id.value;
//         const address_id_living = form.laddress.value;
//         const division_id_permanent = form.pdivision_id.value;
//         const district_id_permanent = form.pdistrict_id.value;
//         const upazila_id_permanent = form.pupazila_id.value;
//         const address_id_permanent = form.paddress.value;
//         const join_date = form.join_date.value;
//         const payroll_id = form.payroll_id.value;
//         const school_shift_id = form.school_shift_id.value;
//         const signature_image = form.signature_image.value;
//         const photo = form.photo.value;
//         const designation_id = form.designation_id.value;
//         const father_name = form.father_name.value;
//         const mother_name = form.mother_name.value;
//         const employee_id = form.employee_id.value;
//         const branch_id = form.branch_id.value;


//         if(!full_name){
//             setFullName('Name Must Be filled')
//             return
//         }
//         if(!father_name){
//             setFatherName('Father Name Must Be filled')
//             return
//         }

//         if(!mother_name){
//             setMotherName('Mother Name Must Be filled')
//             return
//         }

//         if(!gender){
//             setGender('Gender Name Must Be filled')
//             return
//         }

//         if(!dob){
//             setDob('Date Of Birth Day  Must Be filled')
//             return
//         }
//         if(!religion){
//             setReligion('Religion  Must Be filled')
//             return
//         }
//         if(!mobile){
//             setMobile('Mobile Number  Must Be filled')
//             return
//         }

//         if(!email){
//             setEmail('Email  Must Be filled')
//             return
//         }

//         if(!experience){
//             setExperience('experience  Must Be filled')
//             return
//         }
//         if(!password){
//             setPassword('Password  Must Be filled')
//             return
//         }
//         if(!fieldes.confirm_password){
//             setConfirmPassword('Confirm Password  Must Be filled')
//             return
//         }

//         if(!division_id_living){
//             setLDivision('Division Must Be filled')
//             return
//         }
//         if(!join_date){
//             setJoinDate('Join Date Must Be filled')
//             return
//         }
//         if(!designation_id){
//             setDesignation('Designation Must Be filled')
//             return
//         }

//         if(!employee_id){
//             setEmployeeId('employee Id Must Be filled')
//             return
//         }

//         if(!school_shift_id){
//             setShift('School Shift Must Be filled')
//             return
//         }
//         if(!payroll_id){
//             setPayroll('Payroll  Must Be filled')
//             return
//         }


        

//         const newErrors = new Array(fields.length).fill('');
//         const isValid = fields.every((inputValue, index) => {
//             if (!inputValue.education) {
//                 newErrors[index] = 'Education Name must be filled.';
//                 return false;
//             }
//             return true;
//         });

//         if (!isValid) {
//             setEducation(newErrors);
//             return;
//         }
//         setEducation(new Array(fields.length).fill(''));

//         const newError = new Array(fields.length).fill('');
//         const isValids = fields.every((inputValue, index) => {
//             if (!inputValue?.institute) {
//                 newError[index] = 'Institute Name must be filled.';
//                 return false;
//             }
//             return true;
//         });

//         if (!isValids) {
//             setSchool(newError);
//             return;
//         }
//         setSchool(new Array(fields.length).fill(''));


//         const newErrorName = new Array(fields.length).fill('');
//         const isValidsName = fields.every((inputValue, index) => {
//             if (!inputValue?.result) {
//                 newErrorName[index] = 'Result must be filled.';
//                 return false;
//             }
//             return true;
//         });

//         if (!isValidsName) {
//             setResult(newErrorName);
//             return;
//         }
//         setResult(new Array(fields.length).fill(''));


//         const newErrorGender = new Array(fields.length).fill('');
//         const isValidsGender = fields.every((inputValue, index) => {
//             if (!inputValue?.passing_year) {
//                 newErrorGender[index] = 'Passing Year must be filled.';
//                 return false;
//             }
//             return true;
//         });

//         if (!isValidsGender) {
//             setPassingYear(newErrorGender);
//             return;
//         }
//         setPassingYear(new Array(fields.length).fill(''));
      
       

       


//         const uniqueFields = {
//             father_name,
//             mother_name,
//             full_name,
//             dob,
//             gender,
//             religion,
//             mobile,
//             email,
//             password,
//             experience,
//             same_as,
//             // education,
//             // institute,
//             // result,
//             // passing_year,
//             division_id_living,
//             district_id_living,
//             upazila_id_living,
//             address_id_living,
//             division_id_permanent,
//             district_id_permanent,
//             upazila_id_permanent,
//             address_id_permanent,
//             join_date,
//             payroll_id,
//             school_shift_id,
//             signature_image,
//             photo,
//             created_by,
//             designation_id,
//             employee_id,
//             branch_id,
//              fields
//         }
//         console.log(uniqueFields)
//         // 
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_create`, {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json',
//             },
//             body: JSON.stringify(uniqueFields),
//         })
//             .then((Response) =>
//                 Response.json()
//             )
//             .then((data) => {
//                 console.log(data[0])
//                 if (data[0]?.affectedRows > 0) {
//                     if(typeof window !== 'undefined'){

//                         sessionStorage.setItem("message", "Data saved successfully!");
//                     }
//                     // router.push('/Admin/brand/brand_all');
//                 }
//                 console.log(data)

//             })
//             .catch((error) => console.error(error));
//     }



//     const [selectedFile, setSelectedFile] = useState(null);
//     const [fileNames, setFileNames] = useState([]);
//     const [fileSizeError, setFileSizeError] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

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
//     const [uploadedImageUrl, setUploadedImageUrl] = useState(null);


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




//     return (
//         <div className="container-fluid">

//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="body-content bg-light">

//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">

//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Employee</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/employee/employee_all?page_group`} className="btn btn-sm btn-info">Back Employee List</Link>
                                        
//                                     </div>
//                                 </div>
//                                 <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                 </div>
//                                 <div class="card-body ">
//                                     <form class="" method="post" autocomplete="off" onSubmit={employee_create}>
//                                         <div class="card bg-white mb-3  shadow-sm ">
//                                             <div class="card-header p-2 bg-gradient-primary text-white">
//                                                 <div class="card-title font-weight-bold mb-0   float-left mt-1 ">Employee Information</div>
//                                             </div>
//                                             <div class="card-body">
//                                                 <div class=" row no-gutters">
//                                                     <div class="col-md-6">
                                                      
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-left">Employee Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input 
//                                                                 onChange={employee_input_change}
//                                                                     type="text" name="full_name" class="form-control form-control-sm  required " id="full_name" placeholder="Enter Full Name" />
//                                                                     {
//                                                                         fullName && <p className='text-danger'>{fullName}</p>
//                                                                     }
                                                                
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-left">Employee NID:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input 
//                                                                 onChange={employee_input_change}
//                                                                     type="text" name="full_name" class="form-control form-control-sm  required " id="full_name" placeholder="Enter NID Number" />
//                                                                     {
//                                                                         fullName && <p className='text-danger'>{fullName}</p>
//                                                                     }
                                                                
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Religion:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select 
//                                                                 onChange={employee_input_change}
//                                                                 name="religion" class="form-control form-control-sm  required integer_no_zero">
//                                                                     <option value=''>Select Religion</option>
//                                                                    {
//                                                                      religionList.map(religion => 

//                                                                         <>
//                                                                         <option value={religion.id}>{religion.name}</option>
//                                                                         </>
//                                                                      )
//                                                                    }
//                                                                 </select>
//                                                                 {
//                                                                     religion && <p className='text-danger'>{religion}</p>
//                                                                 }
                                                              
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Mobile:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <input
//                                                                     onChange={employee_input_change}
//                                                                     type="text" name="mobile" maxlength="11" class="form-control form-control-sm  required " id="mobile" placeholder="Enter Mobile" />
//                                                                     {
//                                                                         mobile && <p className='text-danger'>{mobile}</p>
//                                                                     }
                                                                  

//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold">Year of Experience:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <input 
//                                                                 onChange={employee_input_change}
//                                                                 type="text" name="experience" class="form-control form-control-sm  required " id="experience" placeholder="Enter Year of Experience" />
//                                                                 {
//                                                                     experience && <p className='text-danger'>{experience}</p>
//                                                                 }
                                                               
//                                                             </div>
//                                                         </div>
                                                      
//                                                     </div>
//                                                     <div class="col-md-6">
                                                       
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-right">Date of Birth:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
                                                                
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
//                                                                 name='dob'
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
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Gender:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
//                                                                     onChange={employee_input_change}
//                                                                     name="gender" class="form-control form-control-sm  required integer_no_zero" id="gender_name">
//                                                                     <option value="" >Select Gender</option>
//                                                                     {
//                                                                         genderList.map(gender => 
                                                                            
//                                                                             <>
//                                                                             <option value={gender.id}>{gender.gender_name}</option>
                                                                            
//                                                                             </>
//                                                                         )
//                                                                     }
//                                                                 </select>
// {
//     gender && <p className='text-danger'>{gender}</p>
// }
                                                               
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Blood Group:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select 
//                                                                 onChange={employee_input_change}
//                                                                 name="blood_group" class="form-control form-control-sm  required integer_no_zero">
//                                                                     <option value=''>Select Blood Group</option>
//                                                                    {
//                                                                      religionList.map(religion => 

//                                                                         <>
//                                                                         <option value={religion.id}>{religion.name}</option>
//                                                                         </>
//                                                                      )
//                                                                    }
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
//                                                                 onChange={employee_input_change}
//                                                                 type="text" name="email" class="form-control form-control-sm  required " id="email" placeholder="Enter Email ID" />
//                                                                {
//                                                                 email && <p className='text-danger'>{email}</p>
//                                                                }
//                                                             </div>
//                                                         </div>
                                                        


//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div class="card bg-white mb-3 shadow-sm ">
//                                             <div class="card-header p-2  bg-gradient-primary text-white ">
//                                                 <div class="card-title font-weight-bold mb-0  float-left mt-1">Account Information</div>
//                                             </div>
//                                             <div class="card-body">
//                                                 <div class=" row no-gutters">
                                                    
//                                                     <div class="col-md-6">
//                                                     <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-right"> Password:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input 
//                                                                  onChange={employee_input_change}
//                                                                 type="password" name="password" class="form-control form-control-sm  required password" id="password" placeholder="Enter password" />
//                                                                 {
//                                                                     password && <p className='text-danger'>{password}</p>
//                                                                 }
                                                               
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div class="col-md-6">
//                                                     <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  ">Confirm Password:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input type="password" 
//                                                                 onChange={employee_input_change}
//                                                                 name="confirm_password" class="form-control form-control-sm  required matches_password" id="confirm_password" placeholder="Enter Confirm Password" />
//                                                                 {
//                                                                     confirmPassword && <p className='text-danger'>{confirmPassword}</p>
//                                                                 }
                                                                  
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div class="card bg-white mb-3 shadow-sm ">
//                                             <div class="card-header p-2  bg-gradient-primary text-white ">
//                                                 <div class="card-title font-weight-bold mb-0  float-left mt-1">Parent Information</div>
//                                             </div>
//                                             <div class="card-body">
//                                                 <div class=" row no-gutters">
//                                                     <div class="col-md-6">
//                                                     <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-right">Father Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input 
//                                                                 onChange={employee_input_change}
//                                                                 type="text" name="father_name" class="form-control form-control-sm  required " id="father_name" placeholder="Enter Father Name" />
//                                                                 {
//                                                                     fatherName && <p className='text-danger'>{fatherName}</p>
//                                                                 }
                                                               
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-right">Father Mobile:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input 
//                                                                 onChange={employee_input_change}
//                                                                 type="text" name="father_mobile" class="form-control form-control-sm  required " id="mother_name" placeholder="Enter Father Mobile Number " />
                                                              
                                                                
                                                                
//                                                             </div>
//                                                         </div>
                                                    

//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold ">Father Profession :<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
// onChange={employee_input_change}
//                                                                     name="father_profession" class=" form-control form-control-sm  required integer_no_zero lupazila">
//                                                                     <option value="">Select Father Profession</option>
                                                                   
//                                                                 </select>
                                                               
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div class="col-md-6">
//                                                     <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-right">Mother Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input 
//                                                                 onChange={employee_input_change}
//                                                                 type="text" name="mother_name" class="form-control form-control-sm  required " id="mother_name" placeholder="Enter Mother Name" />
//                                                                 {
//                                                                     motherName && <p className='text-danger'>{motherName}</p>
//                                                                 }
                                                                
                                                                
//                                                             </div>
//                                                         </div>
                                                     
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-right">Mother Mobile:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input 
//                                                                 onChange={employee_input_change}
//                                                                 type="text" name="mother_mobile" class="form-control form-control-sm  required " id="mother_name" placeholder="Enter Mother Mobile number" />
                                                               
                                                                
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold ">Mother Profession:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
// onChange={employee_input_change}
//                                                                     name="mother_profession" class=" form-control form-control-sm  required integer_no_zero lupazila">
//                                                                     <option value="">Select Mother Profession</option>
                                                                   
//                                                                 </select>
                                                               
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary shadow-sm text-white">

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
//                                                                                             value={field.educational_qualifications.education}
//                                                                                             onChange={(e) => handleChange(index, e)}
//                                                                                             name="education" class="form-control form-control-sm  trim integer_no_zero row_unique_education" id="education" placeholder="Enter Education">
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
//                                                                                             education[index] && <p className='text-danger'>{education[index]}</p>
//                                                                                         }
//                                                                                     </td>
//                                                                                     <td>
//                                                                                         <input
//                                                                                             value={field.educational_qualifications.institute}
//                                                                                             onChange={(e) => handleChange(index, e)}
//                                                                                             type="text" name="institute" class="form-control form-control-sm  required row_unique_institute" id="institute" placeholder="Enter Institute" />
//                                                                                      {
//                                                                                             School[index] && <p className='text-danger'>{School[index]}</p>
//                                                                                         }
//                                                                                     </td>
//                                                                                     <td>
//                                                                                         <input
//                                                                                             value={field.educational_qualifications.result}
//                                                                                             onChange={(e) => handleChange(index, e)}
//                                                                                             type="text" name="result" class="form-control form-control-sm  required row_unique_result" id="result" placeholder="Enter Result" />
//                                                                                      {
//                                                                                             result[index] && <p className='text-danger'>{result[index]}</p>
//                                                                                         }
//                                                                                     </td>
//                                                                                     <td>
//                                                                                         <input
//                                                                                             value={field.educational_qualifications.passing_year}
//                                                                                             onChange={(e) => handleChange(index, e)}
//                                                                                             type="text" name="passing_year" class="form-control form-control-sm  required row_unique_passing_year" id="passing_year" placeholder="Enter Passing Year" />
//                                                                                      {
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


//                                         {/* <div class=" row">


//                                             <div class="col-md-6">
//                                                 <div class="card bg-white mb-3 shadow-sm ">
//                                                     <div class="card-header p-2  bg-gradient-primary text-white ">
//                                                         <div class="card-title font-weight-bold mb-0  float-left mt-1">Living Address</div>
//                                                     </div>
//                                                     <div class="card-body">
//                                                         <div class=" row no-gutters">
//                                                             <div class="col-md-12">
//                                                                 <div class="form-group row no-gutters">
//                                                                     <div class="col-md-3"><label class="font-weight-bold  text-right">Division:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div class="col-md-8">
//                                                                         <select value={selectedDivision} onChange={ handleDivisionChange} name="ldivision_id" class=" form-control form-control-sm  required integer_no_zero ldivision">
//                                                                             <option value="">Select Division</option>
//                                                                             {
//                                                                                 divisions.map(division =>

//                                                                                     <>
//                                                                                         <option value={division.id}>{division.division_bn}</option>

//                                                                                     </>
//                                                                                 )
//                                                                             }

//                                                                         </select>
//                                                                         {
//                                                                             lDivision && <p className='text-danger'>{lDivision}</p>
//                                                                         }
//                                                                     </div>
//                                                                 </div>
//                                                                 <div class="form-group row no-gutters">
//                                                                     <div class="col-md-3"><label class="font-weight-bold  text-right">District:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div class="col-md-8">
//                                                                         <select value={selectedDistrict} onChange={handleDistrictChange} name="ldistrict_id" class=" form-control form-control-sm  required integer_no_zero ldistrict">
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
//                                                                             name="lupazila_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
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
//                                                     <div className="card-header p-2 bg-gradient-primary text-white clearfix">
//                                                         <div className="card-title font-weight-bold mb-0 float-left mt-1">Permanent Address</div>
//                                                         <div className="form-check form-check-inline float-right">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 name="same_as"
//                                                                 className="same_as"
//                                                                 value={isSameAsLivingAddress === true ? 1 : 0}
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


//                                         </div> */}

// <div className="card-body">
//                                     <form method="post" autoComplete="off">
//                                         <div className="row">
//                                             <div className="col-md-6">
//                                                 <div className="card bg-white mb-3 shadow-sm">
//                                                     <div className="card-header p-2 bg-gradient-primary text-white">
//                                                          <div className="card-title font-weight-bold mb-0 float-left mt-1">Living Address</div>
//                                                     </div>
//                                                     <div className="card-body">
//                                                         <div className="row no-gutters">
//                                                             <div className="col-md-12">
//                                                                 <div className="form-group row no-gutters">
//                                                                      <div className="col-md-3"><label className="font-weight-bold text-right">Division:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedDivision} onChange={handleDivisionChange} name="ldivision_id" className="form-control form-control-sm required integer_no_zero ldivision">
//                                                                              <option value="">Select Division</option>
//                                                                             {divisions.map(division => <option key={division.id} value={division.id}>{division.division_bn}</option>)}
//                                                                         </select>
//                                                                         {
//                                                                             lDivision && <p className='text-danger'>{lDivision}</p>
//                                                                         }
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                      <div className="col-md-3"><label className="font-weight-bold text-right">District:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                          <select value={selectedDistrict} onChange={handleDistrictChange} name="ldistrict_id" className="form-control form-control-sm required integer_no_zero ldistrict">
//                                                                              <option value="">Select District</option>
//                                                                              {filteredDistricts.map(districts => <option key={districts.id} value={districts.id}>{districts.district_bn}</option>)}
//                                                                          </select>
//                                                                      </div>
//                                                                  </div>
//                                                                  <div className="form-group row no-gutters">
//                                                                      <div className="col-md-3"><label className="font-weight-bold text-right">Upazila:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedUpazila} onChange={handleUpazilaChange} name="lupazila_id" className="form-control form-control-sm required integer_no_zero lupazila">
//                                                                              <option value="">Select Upazila</option>
//                                                                              {filteredUpazilas.map(upazila => <option key={upazila.id} value={upazila.id}>{upazila.upazila_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                      <div className="col-md-3"><label className="font-weight-bold text-right">Address:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                      <div className="col-md-8">
//                                                                          <input
//                                                                             type="text"
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
//                                                 <div className="card bg-white mb-3 shadow-sm">
//                                                     <div className="card-header p-2 bg-gradient-primary text-white clearfix">
//                                                         <div className="card-title font-weight-bold mb-0 float-left mt-1">Permanent Address</div>
//                                                         <div className="form-check form-check-inline float-right">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 name="same_as"
//                                                                 className="same_as"
//                                                                 checked={sameAsLiving}
//                                                                 onChange={handleCheckboxChange}
//                                                             />
//                                                             <label className="font-weight-bold form-check-label ml-2" htmlFor="inlineCheckbox1">Same as Living Address</label>
//                                                         </div>
//                                                     </div>
//                                                     <div className="card-body">
//                                                         <div className="row no-gutters">
//                                                             <div className="col-md-12">
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Division:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedDivisions} onChange={handleDivisionChanges} name="pdivision_id" className="form-control form-control-sm required integer_no_zero ldivision" disabled={sameAsLiving}>
//                                                                             <option value="">Select Division</option>
//                                                                             {divisions.map(division => <option key={division.id} value={division.id}>{division.division_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">District:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedDistricts} onChange={handleDistrictChanges} name="pdistrict_id" className="form-control form-control-sm required integer_no_zero ldistrict" disabled={sameAsLiving}>
//                                                                             <option value="">Select District</option>
//                                                                             {filteredDistrictss.map(districts => <option key={districts.id} value={districts.id}>{districts.district_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Upazila:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedUpazilas} onChange={handleUpazilaChanges} name="pupazila_id" className="form-control form-control-sm required integer_no_zero lupazila" disabled={sameAsLiving}>
//                                                                             <option value="">Select Upazila</option>
//                                                                             {filteredUpazilass.map(upazila => <option key={upazila.id} value={upazila.id}>{upazila.upazila_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Address:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <input
//                                                                             type="text"
//                                                                             name="paddress"
//                                                                             className="form-control form-control-sm required"
//                                                                             id="address"
//                                                                             placeholder="Enter Address"
//                                                                             value={livingAddresss}
//                                                                             onChange={handleLivingAddressChanges}
//                                                                             disabled={sameAsLiving}
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>

//                                         <div class="card bg-white mb-3 shadow-sm ">
//                                             <div class="card-header p-2   bg-gradient-primary text-white ">
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
//                                                                 name='join_date'
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
//                                                                 onChange={employee_input_change}
//                                                                 name='employee_id'
//                                                                 type="text"  class=" form-control form-control-sm  required " id="finger_print_id" placeholder="Enter Employee ID" />
//                                                                 {
//                                                                     employeeId && <p className='text-danger'>{employeeId}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Branch :<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
// onChange={employee_input_change}
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
//                                                                 shift && <p className='text-danger'>{shift}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div class="col-md-6">
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Designation:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select 
//                                                                 onChange={employee_input_change}
//                                                                 name="designation_id" class=" form-control form-control-sm  required integer_no_zero " id="designation_name">
//                                                                     <option value="">Select Designation</option>
//                                                                     {
//                                                                         designationList.map(designation =>
                                                                            
//                                                                             <>
                                                                            
//                                                                             <option value={designation.id}>{designation.designation_name}</option>
//                                                                             </>
//                                                                         )
//                                                                     }
//                                                                 </select>
// {
//     designation && <p className='text-danger'>{designation}</p>
// }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Payroll:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
//                                                                 onChange={employee_input_change}
//                                                                  name="payroll_id" class="form-control form-control-sm  required integer_no_zero " id="title">
//                                                                     <option value="">Select Payroll</option>
//                                                                     {payRoll.map(item => (
//                                                                         < >
//                                                                             <option value={item.id}>{`${item.title} (${item.basic}/-)`}</option>
//                                                                         </>
//                                                                     ))}
//                                                                 </select>
//                                                                 {
//                                                                 payroll && <p className='text-danger'>{payroll}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Shift:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
// onChange={employee_input_change}
//                                                                     name="school_shift_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
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
//                                                                 shift && <p className='text-danger'>{shift}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div class="card bg-white mb-3 shadow-sm ">
//                                             <div class="card-header p-2  bg-gradient-primary text-white ">
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
//                                                                 <input type="text" className='d-none' value={uploadedFileUrl} name='photo' />
//                                                                 <div id="software_logo" className="logo bg-light img-thumbnail">
//                                                                     {uploadedFileUrl && <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${uploadedFileUrl}`} alt="Uploaded" className="img-fluid" />}
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
//                                                                 <input name='signature_image' type="text" className='d-none' value={uploadedImageUrl} />
//                                                                 <div id="software_logo" className="logo bg-light img-thumbnail">
//                                                                     {uploadedImageUrl && <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${uploadedImageUrl}`} alt="Uploaded" className="img-fluid" />}
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

// export default EmployeeCreate;

// 'use client' 
 //ismile
// import React, { useEffect, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';

// const EmployeeCreate = () => {


//     const { data: divisions = [] } = useQuery({
//         queryKey: ['divisions'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/divisions/divisions_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const { data: district = [] } = useQuery({
//         queryKey: ['district'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/district/district_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const { data: upazilas = [] } = useQuery({
//         queryKey: ['upazilas'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/upazilas/upazilas_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const [selectedDivision, setSelectedDivision] = useState("");
//     const [selectedDistrict, setSelectedDistrict] = useState("");
//     const [filteredDistricts, setFilteredDistricts] = useState([]);
//     const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    
//     const [selectedDivisions, setSelectedDivisions] = useState("");
//     const [selectedDistricts, setSelectedDistricts] = useState("");
//     const [filteredDistrictss, setFilteredDistrictss] = useState([]);
//     const [filteredUpazilass, setFilteredUpazilass] = useState([]);
    
//     const [selectedUpazila, setSelectedUpazila] = useState('');
//     const [livingAddress, setLivingAddress] = useState('');
    
//     const [selectedUpazilas, setSelectedUpazilas] = useState('');
//     const [livingAddresss, setLivingAddresss] = useState('');
    
//     const [sameAsLiving, setSameAsLiving] = useState(false); // State for checkbox

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

//     useEffect(() => {
//         if (selectedDivisions) {
//             const filtered = district.filter(district => district.division_id === parseInt(selectedDivisions));
//             setFilteredDistrictss(filtered);
//         } else {
//             setFilteredDistrictss([]);
//         }
//         setSelectedDistricts(""); // Reset selected district when division changes
//     }, [selectedDivisions, district]);

//     useEffect(() => {
//         if (selectedDistricts) {
//             const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistricts));
//             setFilteredUpazilass(filtered);
//         } else {
//             setFilteredUpazilass([]);
//         }
//     }, [selectedDistricts, upazilas]);

//     const handleDivisionChange = (e) => setSelectedDivision(e.target.value);
//     const handleDistrictChange = (e) => setSelectedDistrict(e.target.value);
//     const handleUpazilaChange = (e) => setSelectedUpazila(e.target.value);
//     const handleLivingAddressChange = (e) => setLivingAddress(e.target.value);
//     const handleDivisionChanges = (e) => setSelectedDivisions(e.target.value);
//     const handleDistrictChanges = (e) => setSelectedDistricts(e.target.value);
//     const handleUpazilaChanges = (e) => setSelectedUpazilas(e.target.value);
//     const handleLivingAddressChanges = (e) => setLivingAddresss(e.target.value);

//     const handleCheckboxChange = () => {
//         setSameAsLiving(prevState => {
//             const newState = !prevState;
//             if (newState) {
//                 // Sync Permanent Address with Living Address
//                 setSelectedDivisions(selectedDivision);
//                 setSelectedDistricts(selectedDistrict);
//                 setSelectedUpazilas(selectedUpazila);
//                 setLivingAddresss(livingAddress);
//             } else {
//                 // Reset Permanent Address
//                 setSelectedDivisions("");
//                 setSelectedDistricts("");
//                 setSelectedUpazilas("");
//                 setLivingAddresss("");
//             }
//             return newState;
//         });
//     };

//     useEffect(() => {
//         if (sameAsLiving) {
//             setSelectedDivisions(selectedDivision);
//             setSelectedDistricts(selectedDistrict);
//             setSelectedUpazilas(selectedUpazila);
//             setLivingAddresss(livingAddress);
//         }
//     }, [sameAsLiving, selectedDivision, selectedDistrict, selectedUpazila, livingAddress]);

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Employee</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/employee/employee_all?page_group`} className="btn btn-sm btn-info">Back Employee List</Link>
//                                     </div>
//                                 </div>
//                                 <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                 </div>
//                                 <div className="card-body">
//                                     <form method="post" autoComplete="off">
//                                         <div className="row">
//                                             <div className="col-md-6">
//                                                 <div className="card bg-white mb-3 shadow-sm">
//                                                     <div className="card-header p-2 bg-gradient-primary text-white">
//                                                         <div className="card-title font-weight-bold mb-0 float-left mt-1">Living Address</div>
//                                                     </div>
//                                                     <div className="card-body">
//                                                         <div className="row no-gutters">
//                                                             <div className="col-md-12">
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Division:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedDivision} onChange={handleDivisionChange} name="ldivision_id" className="form-control form-control-sm required integer_no_zero ldivision">
//                                                                             <option value="">Select Division</option>
//                                                                             {divisions.map(division => <option key={division.id} value={division.id}>{division.division_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">District:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedDistrict} onChange={handleDistrictChange} name="ldistrict_id" className="form-control form-control-sm required integer_no_zero ldistrict">
//                                                                             <option value="">Select District</option>
//                                                                             {filteredDistricts.map(districts => <option key={districts.id} value={districts.id}>{districts.district_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Upazila:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedUpazila} onChange={handleUpazilaChange} name="lupazila_id" className="form-control form-control-sm required integer_no_zero lupazila">
//                                                                             <option value="">Select Upazila</option>
//                                                                             {filteredUpazilas.map(upazila => <option key={upazila.id} value={upazila.id}>{upazila.upazila_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Address:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <input
//                                                                             type="text"
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
//                                                 <div className="card bg-white mb-3 shadow-sm">
//                                                     <div className="card-header p-2 bg-gradient-primary text-white clearfix">
//                                                         <div className="card-title font-weight-bold mb-0 float-left mt-1">Permanent Address</div>
//                                                         <div className="form-check form-check-inline float-right">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 name="same_as"
//                                                                 className="same_as"
//                                                                 checked={sameAsLiving}
//                                                                 onChange={handleCheckboxChange}
//                                                             />
//                                                             <label className="font-weight-bold form-check-label ml-2" htmlFor="inlineCheckbox1">Same as Living Address</label>
//                                                         </div>
//                                                     </div>
//                                                     <div className="card-body">
//                                                         <div className="row no-gutters">
//                                                             <div className="col-md-12">
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Division:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedDivisions} onChange={handleDivisionChanges} name="pdivision_id" className="form-control form-control-sm required integer_no_zero ldivision" disabled={sameAsLiving}>
//                                                                             <option value="">Select Division</option>
//                                                                             {divisions.map(division => <option key={division.id} value={division.id}>{division.division_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">District:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedDistricts} onChange={handleDistrictChanges} name="pdistrict_id" className="form-control form-control-sm required integer_no_zero ldistrict" disabled={sameAsLiving}>
//                                                                             <option value="">Select District</option>
//                                                                             {filteredDistrictss.map(districts => <option key={districts.id} value={districts.id}>{districts.district_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Upazila:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedUpazilas} onChange={handleUpazilaChanges} name="pupazila_id" className="form-control form-control-sm required integer_no_zero lupazila" disabled={sameAsLiving}>
//                                                                             <option value="">Select Upazila</option>
//                                                                             {filteredUpazilass.map(upazila => <option key={upazila.id} value={upazila.id}>{upazila.upazila_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Address:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <input
//                                                                             type="text"
//                                                                             name="paddress"
//                                                                             className="form-control form-control-sm required"
//                                                                             id="address"
//                                                                             placeholder="Enter Address"
//                                                                             value={livingAddresss}
//                                                                             onChange={handleLivingAddressChanges}
//                                                                             disabled={sameAsLiving}
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
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

// export default EmployeeCreate;

// 'use client' 
 //ismile
// import React, { useEffect, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';

// const EmployeeCreate = () => {
//     const { data: divisions = [] } = useQuery({
//         queryKey: ['divisions'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/divisions/divisions_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const { data: district = [] } = useQuery({
//         queryKey: ['district'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/district/district_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const { data: upazilas = [] } = useQuery({
//         queryKey: ['upazilas'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/upazilas/upazilas_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const [selectedDivision, setSelectedDivision] = useState("");
//     const [selectedDistrict, setSelectedDistrict] = useState("");
//     const [filteredDistricts, setFilteredDistricts] = useState([]);
//     const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    
//     const [selectedDivisions, setSelectedDivisions] = useState("");
//     const [selectedDistricts, setSelectedDistricts] = useState("");
//     const [filteredDistrictss, setFilteredDistrictss] = useState([]);
//     const [filteredUpazilass, setFilteredUpazilass] = useState([]);
    
//     const [selectedUpazila, setSelectedUpazila] = useState('');
//     const [livingAddress, setLivingAddress] = useState('');
    
//     const [selectedUpazilas, setSelectedUpazilas] = useState('');
//     const [livingAddresss, setLivingAddresss] = useState('');
    
//     const [sameAsLiving, setSameAsLiving] = useState(false); // State for checkbox

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

//     useEffect(() => {
//         if (selectedDivisions) {
//             const filtered = district.filter(district => district.division_id === parseInt(selectedDivisions));
//             setFilteredDistrictss(filtered);
//         } else {
//             setFilteredDistrictss([]);
//         }
//         setSelectedDistricts(""); // Reset selected district when division changes
//     }, [selectedDivisions, district]);

//     useEffect(() => {
//         if (selectedDistricts) {
//             const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistricts));
//             setFilteredUpazilass(filtered);
//         } else {
//             setFilteredUpazilass([]);
//         }
//     }, [selectedDistricts, upazilas]);

//     const handleDivisionChange = (e) => setSelectedDivision(e.target.value);
//     const handleDistrictChange = (e) => setSelectedDistrict(e.target.value);
//     const handleUpazilaChange = (e) => setSelectedUpazila(e.target.value);
//     const handleLivingAddressChange = (e) => setLivingAddress(e.target.value);
//     const handleDivisionChanges = (e) => setSelectedDivisions(e.target.value);
//     const handleDistrictChanges = (e) => setSelectedDistricts(e.target.value);
//     const handleUpazilaChanges = (e) => setSelectedUpazilas(e.target.value);
//     const handleLivingAddressChanges = (e) => setLivingAddresss(e.target.value);

//     const handleCheckboxChange = () => {
//         setSameAsLiving(prevState => {
//             const newState = !prevState;
//             if (newState) {
//                 // Sync Permanent Address with Living Address
//                 setSelectedDivisions(selectedDivision);
//                 setSelectedDistricts(selectedDistrict);
//                 setSelectedUpazilas(selectedUpazila);
//                 setLivingAddresss(livingAddress);
//             } else {
//                 // Reset Permanent Address
//                 setSelectedDivisions("");
//                 setSelectedDistricts("");
//                 setSelectedUpazilas("");
//                 setLivingAddresss("");
//             }
//             return newState;
//         });
//     };

//     useEffect(() => {
//         if (sameAsLiving) {
//             setSelectedDivisions(selectedDivision);
//             setSelectedDistricts(selectedDistrict);
//             setSelectedUpazilas(selectedUpazila);
//             setLivingAddresss(livingAddress);
//         }
//     }, [sameAsLiving, selectedDivision, selectedDistrict, selectedUpazila, livingAddress]);

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Employee</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/employee/employee_all?page_group`} className="btn btn-sm btn-info">Back Employee List</Link>
//                                     </div>
//                                 </div>
//                                 <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                 </div>
//                                 <div className="card-body">
//                                     <form method="post" autoComplete="off">
//                                         <div className="row">
//                                             <div className="col-md-6">
//                                                 <div className="card bg-white mb-3 shadow-sm">
//                                                     <div className="card-header p-2 bg-gradient-primary text-white">
//                                                         <div className="card-title font-weight-bold mb-0 float-left mt-1">Living Address</div>
//                                                     </div>
//                                                     <div className="card-body">
//                                                         <div className="row no-gutters">
//                                                             <div className="col-md-12">
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Division:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedDivision} onChange={handleDivisionChange} name="ldivision_id" className="form-control form-control-sm required integer_no_zero ldivision">
//                                                                             <option value="">Select Division</option>
//                                                                             {divisions.map(division => <option key={division.id} value={division.id}>{division.division_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">District:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedDistrict} onChange={handleDistrictChange} name="ldistrict_id" className="form-control form-control-sm required integer_no_zero ldistrict">
//                                                                             <option value="">Select District</option>
//                                                                             {filteredDistricts.map(districts => <option key={districts.id} value={districts.id}>{districts.district_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Upazila:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedUpazila} onChange={handleUpazilaChange} name="lupazila_id" className="form-control form-control-sm required integer_no_zero lupazila">
//                                                                             <option value="">Select Upazila</option>
//                                                                             {filteredUpazilas.map(upazila => <option key={upazila.id} value={upazila.id}>{upazila.upazila_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Address:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <input
//                                                                             type="text"
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
//                                                 <div className="card bg-white mb-3 shadow-sm">
//                                                     <div className="card-header p-2 bg-gradient-primary text-white clearfix">
//                                                         <div className="card-title font-weight-bold mb-0 float-left mt-1">Permanent Address</div>
//                                                         <div className="form-check form-check-inline float-right">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 name="same_as"
//                                                                 className="same_as"
//                                                                 checked={sameAsLiving}
//                                                                 onChange={handleCheckboxChange}
//                                                             />
//                                                             <label className="font-weight-bold form-check-label ml-2" htmlFor="inlineCheckbox1">Same as Living Address</label>
//                                                         </div>
//                                                     </div>
//                                                     <div className="card-body">
//                                                         <div className="row no-gutters">
//                                                             <div className="col-md-12">
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Division:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedDivisions} onChange={handleDivisionChanges} name="ldivision_id" className="form-control form-control-sm required integer_no_zero ldivision">
//                                                                             <option value="">Select Division</option>
//                                                                             {divisions.map(division => <option key={division.id} value={division.id}>{division.division_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">District:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedDistricts} onChange={handleDistrictChanges} name="ldistrict_id" className="form-control form-control-sm required integer_no_zero ldistrict">
//                                                                             <option value="">Select District</option>
//                                                                             {filteredDistrictss.map(districts => <option key={districts.id} value={districts.id}>{districts.district_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Upazila:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <select value={selectedUpazilas} onChange={handleUpazilaChanges} name="lupazila_id" className="form-control form-control-sm required integer_no_zero lupazila">
//                                                                             <option value="">Select Upazila</option>
//                                                                             {filteredUpazilass.map(upazila => <option key={upazila.id} value={upazila.id}>{upazila.upazila_bn}</option>)}
//                                                                         </select>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="form-group row no-gutters">
//                                                                     <div className="col-md-3"><label className="font-weight-bold text-right">Address:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div className="col-md-8">
//                                                                         <input
//                                                                             type="text"
//                                                                             name="laddress"
//                                                                             className="form-control form-control-sm required"
//                                                                             id="address"
//                                                                             placeholder="Enter Address"
//                                                                             value={livingAddresss}
//                                                                             onChange={handleLivingAddressChanges}
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
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

// export default EmployeeCreate;



// 'use client' 
 //ismile
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';
// import { FaMapMarkerAlt } from 'react-icons/fa';

// const EmployeeCreate = () => {




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

//     const handleDivisionChange = (e) => {
//         setSelectedDivision(e.target.value);
//     };
    
//     const handleDistrictChange = (e) => {
//         setSelectedDistrict(e.target.value);
//     };
    
    

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

// const [selectedUpazila, setSelectedUpazila] = useState('');
//     const handleUpazilaChange = (e) => {
//         setSelectedUpazila(e.target.value);
//     };

//       const [livingAddress, setLivingAddress] = useState('');


//     const handleLivingAddressChange = (e) => {
//         setLivingAddress(e.target.value);
//     };

//     const [selectedDivisions, setSelectedDivisions] = useState("");
//     const [selectedDistricts, setSelectedDistricts] = useState("");
//     const [filteredDistrictss, setFilteredDistrictss] = useState([]);
//     const [filteredUpazilass, setFilteredUpazilass] = useState([]);

//     const handleDivisionChanges = (e) => {
//         setSelectedDivisions(e.target.value);
//     };
    
//     const handleDistrictChanges = (e) => {
//         setSelectedDistricts(e.target.value);
//     };
    
    

//     useEffect(() => {
//         if (selectedDivisions) {
//             const filtered = district.filter(district => district.division_id === parseInt(selectedDivisions));
//             setFilteredDistrictss(filtered);
//         } else {
//             setFilteredDistrictss([]);
//         }
//         setSelectedDistricts(""); // Reset selected district when division changes
//     }, [selectedDivisions, district]);

//     useEffect(() => {
//         if (selectedDistricts) {
//             const filtered = upazilas.filter(upazila => upazila.district_id === parseInt(selectedDistricts));
//             setFilteredUpazilass(filtered);
//         } else {
//             setFilteredUpazilass([]);
//         }
//     }, [selectedDistricts, upazilas]);

// const [selectedUpazilas, setSelectedUpazilas] = useState('');
//     const handleUpazilaChanges = (e) => {
//         setSelectedUpazilas(e.target.value);
//     };

//       const [livingAddresss, setLivingAddresss] = useState('');


//     const handleLivingAddressChanges = (e) => {
//         setLivingAddresss(e.target.value);
//     };



//     return (
//         <div className="container-fluid">

//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="body-content bg-light">

//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">

//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Employee</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/employee/employee_all?page_group`} className="btn btn-sm btn-info">Back Employee List</Link>
                                        
//                                     </div>
//                                 </div>
//                                 <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                 </div>
//                                 <div class="card-body ">
//                                     <form class="" method="post" autocomplete="off" >

//                                         <div class=" row">


//                                             <div class="col-md-6">
//                                                 <div class="card bg-white mb-3 shadow-sm ">
//                                                     <div class="card-header p-2  bg-gradient-primary text-white ">
//                                                         <div class="card-title font-weight-bold mb-0  float-left mt-1">Living Address</div>
//                                                     </div>
//                                                     <div class="card-body">
//                                                         <div class=" row no-gutters">
//                                                             <div class="col-md-12">
//                                                                 <div class="form-group row no-gutters">
//                                                                     <div class="col-md-3"><label class="font-weight-bold  text-right">Division:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div class="col-md-8">
//                                                                         <select value={selectedDivision} onChange={ handleDivisionChange} name="ldivision_id" class=" form-control form-control-sm  required integer_no_zero ldivision">
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
//                                                                         <select value={selectedDistrict} onChange={handleDistrictChange} name="ldistrict_id" class=" form-control form-control-sm  required integer_no_zero ldistrict">
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
//                                                                             name="lupazila_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
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
//                                                     <div className="card-header p-2 bg-gradient-primary text-white clearfix">
//                                                         <div className="card-title font-weight-bold mb-0 float-left mt-1">Permanent Address</div>
//                                                         <div className="form-check form-check-inline float-right">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 name="same_as"
//                                                                 className="same_as"
                                                              
//                                                             />
//                                                             <label className="font-weight-bold form-check-label ml-2" htmlFor="inlineCheckbox1">Same as Living Address</label>
//                                                         </div>
//                                                     </div>
//                                                     <div class="card-body">
//                                                         <div class=" row no-gutters">
//                                                             <div class="col-md-12">
//                                                                 <div class="form-group row no-gutters">
//                                                                     <div class="col-md-3"><label class="font-weight-bold  text-right">Division:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div class="col-md-8">
//                                                                         <select value={selectedDivisions} onChange={ handleDivisionChanges} name="ldivision_id" class=" form-control form-control-sm  required integer_no_zero ldivision">
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
//                                                                         <select value={selectedDistricts} onChange={handleDistrictChanges} name="ldistrict_id" class=" form-control form-control-sm  required integer_no_zero ldistrict">
//                                                                             <option value="">Select District</option>
//                                                                             {
//                                                                                 filteredDistrictss.map(districts =>

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
//                                                                             value={selectedUpazilas}
//                                                                             onChange={handleUpazilaChanges}
//                                                                             name="lupazila_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
//                                                                             <option value="">Select Upazila</option>
//                                                                             {
//                                                                                 filteredUpazilass.map(upazila =>

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

//                                                                             name="laddress"
//                                                                             className="form-control form-control-sm required"
//                                                                             id="address"
//                                                                             placeholder="Enter Address"
//                                                                             value={livingAddresss}
//                                                                             onChange={handleLivingAddressChanges}
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
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

// export default EmployeeCreate;


// 'use client' 
 //ismile
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';
// import { FaMapMarkerAlt } from 'react-icons/fa';

// const EmployeeCreate = () => {

//     let [fields, setFields] = useState([{
//         educational_qualifications: [

//             {education: '', institute: '',
//             result: '', passing_year: '', created_by: ''}
//         ]
//     }]);

//     const [numToAdd, setNumToAdd] = useState(1);


//     const handleAddMore = () => {
//         const numToAddInt = parseInt(numToAdd);
//         if (!isNaN(numToAddInt) && numToAddInt > 0) {
//             const newInputValues = [...fields];
//             for (let i = 0; i < numToAddInt; i++) {
//                 newInputValues.push({
//                     educational_qualifications: [

//                         {education: '', institute: '',
//                         result: '', passing_year: '', created_by: ''}
//                     ]
//                     // education: '',
//                     // institute: '',
//                     // result: '',
//                     // passing_year: '',
//                     // created_by: ''
//                 });
//             }
//             setFields(newInputValues);
//             setNumToAdd(1);
//         }
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

//     const handleDivisionChange = (e) => {
//         setSelectedDivision(e.target.value);
//     };
    
//     const handleDistrictChange = (e) => {
//         setSelectedDistrict(e.target.value);
//     };
    
    

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


//     console.log(payRoll)



//     const [created_by, setCreated_by] = useState(() => {
//         if (typeof window !== 'undefined') {
//           return localStorage.getItem('userId') || '';
//         }
//         return '';
//       });
    
//       useEffect(() => {
//         if (typeof window !== 'undefined') {
//           const storedUserId = localStorage.getItem('userId');
//           setCreated_by(storedUserId);
//         }
//       }, []);

//     let [fieldes, setFieldes] = useState({
//         // user_id: '',
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
//         full_name: '',
//         father_name: '',
//         mother_name: '',
//         dob: '',
//         gender: '',
//         religion: '',
//         mobile: '',
//         email: '',
//         password: '',
//        confirm_password: '',
//         signature_image: '',
//         father_name: '',
//         mother_name: '',
//         photo: '',

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
//         setFieldes(prevData => ({
//             ...prevData,
//             dob: formattedDatabaseDate // Update the period_name field in the state
//         }));

//         if(!formattedDatabaseDate){
//             setDob('Date Of Birth Day must be filled nayan')
//         }
//         else{
//             setDob('')
//         }

//     };
//     console.log(currentDate)

//     // const period_name = allEmployeeList.dob;
//     // const formattedDate = period_name.split('T')[0];
//     const [reformattedDate, setReformattedDate] = useState('');

//     useEffect(() => {
//         const period_name = fieldes.dob;
//         const formattedDate = period_name?.split('T')[0];

//         if (formattedDate?.includes('-')) {
//             const [year, month, day] = formattedDate.split('-');
//             setReformattedDate(`${day}-${month}-${year}`);
//         } else {
//             console.log("Date format is incorrect:", formattedDate);
//         }
//     }, [fieldes]);


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
//         if(!formattedDatabaseDate){
//             setJoinDate('Join Date must be filled nayan')
//         }
//         else{
//             setJoinDate('')
//         }
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

//         const newFields = [...fields];

//         if (event.target.type === 'file') {
//             newFields[index][event.target.name] = event.target.files[0];
//         } else {
//             newFields[index][event.target.name] = event.target.value;

//         }


//         const education = newFields[index]['education']; 
//         if(education){
//             setEducation('')
//         }

//         const institute = newFields[index]['institute']; 
//         if(institute){
//             setSchool('')
//         }

//         const result = newFields[index]['result']; 
//         if(result){
//             setResult('')
//         }

//         const passing_year = newFields[index]['passing_year']; 
//         if(passing_year){
//             setPassingYear('')
//         }

      

        

//         setFields(newFields);




//     };

//     const employee_input_change = (event) => {
//         const name = event.target.name
//         const value = event.target.value
//         const attribute = { ...fieldes }
//         attribute[name] = value
//         setFieldes(attribute)
      
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
//         if (gender ) {
//             setGender(""); // Clear the error message
//         }
       
//         const religion = attribute['religion'];
//         if (religion ) {
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
       
//         const experience = attribute['experience'];
//         if (experience) {
//             setExperience(""); // Clear the error message
//         }
       
//         const password = attribute['password'];
//         if (password) {
//             setPassword(""); // Clear the error message
//         }

//         const confirm_password = attribute['confirm_password'];
//         if (confirm_password) {
//             setConfirmPassword(""); // Clear the error message
//         }
       
//         const join_date = attribute['join_date'];
//         if (join_date) {
//             setJoinDate(""); // Clear the error message
//         }
       
       
//         const designation_id = attribute['designation_id'];
//         if (designation_id) {
//             setDesignation(""); // Clear the error message
//         }

//         const employee_id = attribute['employee_id'];
//         if (employee_id) {
//             setEmployeeId(""); // Clear the error message
//         }
       
//         const school_shift_id = attribute['school_shift_id'];
//         if (school_shift_id) {
//             setShift(""); // Clear the error message
//         }
       
//         const payroll_id = attribute['payroll_id'];
//         if (payroll_id) {
//             setPayroll(""); // Clear the error message
//         }
       
       

//     };


//     const employee_create = (event) => {

//         event.preventDefault();
//         const form = event.target;

//         const full_name = form.full_name.value;
//         const dob = form.dob.value;
//         const gender = form.gender.value;
//         const religion = form.religion.value;
//         const mobile = form.mobile.value;
//         const email = form.email.value;
//         const password = form.password.value;
//         const experience = form.experience.value;
//         const education = form.education.value;
//         const institute = form.institute.value;
//         const result = form.result.value;
//         const passing_year = form.passing_year.value;
//         const division_id_living = form.ldivision_id.value;
//         const district_id_living = form.ldistrict_id.value;
//         const upazila_id_living = form.lupazila_id.value;
//         const address_id_living = form.laddress.value;
//         const division_id_permanent = form.pdivision_id.value;
//         const district_id_permanent = form.pdistrict_id.value;
//         const upazila_id_permanent = form.pupazila_id.value;
//         const address_id_permanent = form.paddress.value;
//         const join_date = form.join_date.value;
//         const payroll_id = form.payroll_id.value;
//         const school_shift_id = form.school_shift_id.value;
//         const signature_image = form.signature_image.value;
//         const photo = form.photo.value;
//         const designation_id = form.designation_id.value;
//         const father_name = form.father_name.value;
//         const mother_name = form.mother_name.value;
//         const employee_id = form.employee_id.value;
//         const branch_id = form.branch_id.value;


//         if(!full_name){
//             setFullName('Name Must Be filled')
//         }
//         if(!father_name){
//             setFatherName('Father Name Must Be filled')
//         }

//         if(!mother_name){
//             setMotherName('Mother Name Must Be filled')
//         }

//         if(!gender){
//             setGender('Gender Name Must Be filled')
//         }

//         if(!dob){
//             setDob('Date Of Birth Day  Must Be filled')
//         }
//         if(!religion){
//             setReligion('Religion  Must Be filled')
//         }
//         if(!mobile){
//             setMobile('Mobile Number  Must Be filled')
//         }

//         if(!email){
//             setEmail('Email  Must Be filled')
//         }

//         if(!experience){
//             setExperience('experience  Must Be filled')
//         }
//         if(!password){
//             setPassword('Password  Must Be filled')
//         }
//         if(!fieldes.confirm_password){
//             setConfirmPassword('Confirm Password  Must Be filled')
//         }

//         if(!division_id_living){
//             setLDivision('Division Must Be filled')
//         }
//         if(!join_date){
//             setJoinDate('Join Date Must Be filled')
//         }
//         if(!designation_id){
//             setDesignation('Designation Must Be filled')
//         }

//         if(!employee_id){
//             setEmployeeId('employee Id Must Be filled')
//         }

//         if(!school_shift_id){
//             setShift('School Shift Must Be filled')
//         }
//         if(!payroll_id){
//             setPayroll('Payroll  Must Be filled')
//         }


        

//         const newErrors = new Array(fields.length).fill('');
//         const isValid = fields.every((inputValue, index) => {
//             if (!inputValue.education) {
//                 newErrors[index] = 'Education Name must be filled.';
//                 return false;
//             }
//             return true;
//         });

//         if (!isValid) {
//             setEducation(newErrors);
//             return;
//         }
//         setEducation(new Array(fields.length).fill(''));

//         const newError = new Array(fields.length).fill('');
//         const isValids = fields.every((inputValue, index) => {
//             if (!inputValue?.institute) {
//                 newError[index] = 'Institute Name must be filled.';
//                 return false;
//             }
//             return true;
//         });

//         if (!isValids) {
//             setSchool(newError);
//             return;
//         }
//         setSchool(new Array(fields.length).fill(''));


//         const newErrorName = new Array(fields.length).fill('');
//         const isValidsName = fields.every((inputValue, index) => {
//             if (!inputValue?.result) {
//                 newErrorName[index] = 'Result must be filled.';
//                 return false;
//             }
//             return true;
//         });

//         if (!isValidsName) {
//             setResult(newErrorName);
//             return;
//         }
//         setResult(new Array(fields.length).fill(''));


//         const newErrorGender = new Array(fields.length).fill('');
//         const isValidsGender = fields.every((inputValue, index) => {
//             if (!inputValue?.passing_year) {
//                 newErrorGender[index] = 'Passing Year must be filled.';
//                 return false;
//             }
//             return true;
//         });

//         if (!isValidsGender) {
//             setPassingYear(newErrorGender);
//             return;
//         }
//         setPassingYear(new Array(fields.length).fill(''));
      
       

       


//         const uniqueFields = {
//             father_name,
//             mother_name,
//             full_name,
//             dob,
//             gender,
//             religion,
//             mobile,
//             email,
//             password,
//             experience,
//             // education,
//             // institute,
//             // result,
//             // passing_year,
//             division_id_living,
//             district_id_living,
//             upazila_id_living,
//             address_id_living,
//             division_id_permanent,
//             district_id_permanent,
//             upazila_id_permanent,
//             address_id_permanent,
//             join_date,
//             payroll_id,
//             school_shift_id,
//             signature_image,
//             photo,
//             created_by,
//             designation_id,
//             employee_id,
//             branch_id,
//              fields
//         }
//         console.log(uniqueFields)
//         // 
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_create`, {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json',
//             },
//             body: JSON.stringify(uniqueFields),
//         })
//             .then((Response) =>
//                 Response.json()
//             )
//             .then((data) => {
//                 if (data[0]?.affectedRows > 0) {
//                     if(typeof window !== 'undefined'){

//                         sessionStorage.setItem("message", "Data saved successfully!");
//                     }
//                     // router.push('/Admin/brand/brand_all');
//                 }
//                 console.log(data)

//             })
//             .catch((error) => console.error(error));
//     }



//     const [selectedFile, setSelectedFile] = useState(null);
//     const [fileNames, setFileNames] = useState([]);
//     const [fileSizeError, setFileSizeError] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

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
//     const [uploadedImageUrl, setUploadedImageUrl] = useState(null);


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
//                                     <form class="" method="post" autocomplete="off" onSubmit={employee_create}>
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
//                                                                 <input 
//                                                                 onChange={employee_input_change}
//                                                                 type="text" name="father_name" class="form-control form-control-sm  required " id="father_name" placeholder="Enter Father Name" />
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
//                                                                 onChange={employee_input_change}
//                                                                     type="text" name="full_name" class="form-control form-control-sm  required " id="full_name" placeholder="Enter Full Name" />
//                                                                     {
//                                                                         fullName && <p className='text-danger'>{fullName}</p>
//                                                                     }
                                                                
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Gender:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
//                                                                     onChange={employee_input_change}
//                                                                     name="gender" class="form-control form-control-sm  required integer_no_zero" id="gender_name">
//                                                                     <option value="" >Select Gender</option>
//                                                                     {
//                                                                         genderList.map(gender => 
                                                                            
//                                                                             <>
//                                                                             <option value={gender.id}>{gender.gender_name}</option>
                                                                            
//                                                                             </>
//                                                                         )
//                                                                     }
//                                                                 </select>
// {
//     gender && <p className='text-danger'>{gender}</p>
// }
                                                               
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Mobile:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <input
//                                                                     onChange={employee_input_change}
//                                                                     type="text" name="mobile" maxlength="11" class="form-control form-control-sm  required " id="mobile" placeholder="Enter Mobile" />
//                                                                     {
//                                                                         mobile && <p className='text-danger'>{mobile}</p>
//                                                                     }
                                                                  

//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold">Year of Experience:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <input 
//                                                                 onChange={employee_input_change}
//                                                                 type="text" name="experience" class="form-control form-control-sm  required " id="experience" placeholder="Enter Year of Experience" />
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
//                                                                 <input type="password" 
//                                                                 onChange={employee_input_change}
//                                                                 name="confirm_password" class="form-control form-control-sm  required matches_password" id="confirm_password" placeholder="Enter Confirm Password" />
//                                                                 {
//                                                                     confirmPassword && <p className='text-danger'>{confirmPassword}</p>
//                                                                 }
                                                                  
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div class="col-md-6">
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-right">Mother Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input 
//                                                                 onChange={employee_input_change}
//                                                                 type="text" name="mother_name" class="form-control form-control-sm  required " id="mother_name" placeholder="Enter Mother Name" />
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
//                                                                 {/* <input type="date" name="dob" class="form-control form-control-sm  required urban_datepicker" id="dob" placeholder="Enter Date of Birth" /> */}
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
//                                                                 name='dob'
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
//                                                                 onChange={employee_input_change}
//                                                                 name="religion" class="form-control form-control-sm  required integer_no_zero">
//                                                                     <option value=''>Select Religion</option>
//                                                                    {
//                                                                      religionList.map(religion => 

//                                                                         <>
//                                                                         <option value={religion.id}>{religion.name}</option>
//                                                                         </>
//                                                                      )
//                                                                    }
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
//                                                                 onChange={employee_input_change}
//                                                                 type="text" name="email" class="form-control form-control-sm  required " id="email" placeholder="Enter Email ID" />
//                                                                {
//                                                                 email && <p className='text-danger'>{email}</p>
//                                                                }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-right"> Password:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input 
//                                                                  onChange={employee_input_change}
//                                                                 type="password" name="password" class="form-control form-control-sm  required password" id="password" placeholder="Enter password" />
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
//                                                                                             value={field.educational_qualifications.education}
//                                                                                             onChange={(e) => handleChange(index, e)}
//                                                                                             name="education" class="form-control form-control-sm  trim integer_no_zero row_unique_education" id="education" placeholder="Enter Education">
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
//                                                                                             education[index] && <p className='text-danger'>{education[index]}</p>
//                                                                                         }
//                                                                                     </td>
//                                                                                     <td>
//                                                                                         <input
//                                                                                             value={field.educational_qualifications.institute}
//                                                                                             onChange={(e) => handleChange(index, e)}
//                                                                                             type="text" name="institute" class="form-control form-control-sm  required row_unique_institute" id="institute" placeholder="Enter Institute" />
//                                                                                      {
//                                                                                             School[index] && <p className='text-danger'>{School[index]}</p>
//                                                                                         }
//                                                                                     </td>
//                                                                                     <td>
//                                                                                         <input
//                                                                                             value={field.educational_qualifications.result}
//                                                                                             onChange={(e) => handleChange(index, e)}
//                                                                                             type="text" name="result" class="form-control form-control-sm  required row_unique_result" id="result" placeholder="Enter Result" />
//                                                                                      {
//                                                                                             result[index] && <p className='text-danger'>{result[index]}</p>
//                                                                                         }
//                                                                                     </td>
//                                                                                     <td>
//                                                                                         <input
//                                                                                             value={field.educational_qualifications.passing_year}
//                                                                                             onChange={(e) => handleChange(index, e)}
//                                                                                             type="text" name="passing_year" class="form-control form-control-sm  required row_unique_passing_year" id="passing_year" placeholder="Enter Passing Year" />
//                                                                                      {
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
//                                                                         <select value={selectedDivision} onChange={ handleDivisionChange} name="ldivision_id" class=" form-control form-control-sm  required integer_no_zero ldivision">
//                                                                             <option value="">Select Division</option>
//                                                                             {
//                                                                                 divisions.map(division =>

//                                                                                     <>
//                                                                                         <option value={division.id}>{division.division_bn}</option>

//                                                                                     </>
//                                                                                 )
//                                                                             }

//                                                                         </select>
//                                                                         {
//                                                                             lDivision && <p className='text-danger'>{lDivision}</p>
//                                                                         }
//                                                                     </div>
//                                                                 </div>
//                                                                 <div class="form-group row no-gutters">
//                                                                     <div class="col-md-3"><label class="font-weight-bold  text-right">District:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                                     <div class="col-md-8">
//                                                                         <select value={selectedDistrict} onChange={handleDistrictChange} name="ldistrict_id" class=" form-control form-control-sm  required integer_no_zero ldistrict">
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
//                                                                             name="lupazila_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
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
//                                                                 name='join_date'
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
//                                                                 onChange={employee_input_change}
//                                                                 name='employee_id'
//                                                                 type="text"  class=" form-control form-control-sm  required " id="finger_print_id" placeholder="Enter Employee ID" />
//                                                                 {
//                                                                     employeeId && <p className='text-danger'>{employeeId}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Branch :<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
// onChange={employee_input_change}
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
//                                                                 shift && <p className='text-danger'>{shift}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div class="col-md-6">
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Designation:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select 
//                                                                 onChange={employee_input_change}
//                                                                 name="designation_id" class=" form-control form-control-sm  required integer_no_zero " id="designation_name">
//                                                                     <option value="">Select Designation</option>
//                                                                     {
//                                                                         designationList.map(designation =>
                                                                            
//                                                                             <>
                                                                            
//                                                                             <option value={designation.id}>{designation.designation_name}</option>
//                                                                             </>
//                                                                         )
//                                                                     }
//                                                                 </select>
// {
//     designation && <p className='text-danger'>{designation}</p>
// }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Payroll:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
//                                                                 onChange={employee_input_change}
//                                                                  name="payroll_id" class="form-control form-control-sm  required integer_no_zero " id="title">
//                                                                     <option value="">Select Payroll</option>
//                                                                     {payRoll.map(item => (
//                                                                         < >
//                                                                             <option value={item.id}>{`${item.title} (${item.basic}/-)`}</option>
//                                                                         </>
//                                                                     ))}
//                                                                 </select>
//                                                                 {
//                                                                 payroll && <p className='text-danger'>{payroll}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Shift:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
// onChange={employee_input_change}
//                                                                     name="school_shift_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
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
//                                                                 shift && <p className='text-danger'>{shift}</p>
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
//                                                                 <input type="text" className='d-none' value={uploadedFileUrl} name='photo' />
//                                                                 <div id="software_logo" className="logo bg-light img-thumbnail">
//                                                                     {uploadedFileUrl && <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${uploadedFileUrl}`} alt="Uploaded" className="img-fluid" />}
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
//                                                                 <input name='signature_image' type="text" className='d-none' value={uploadedImageUrl} />
//                                                                 <div id="software_logo" className="logo bg-light img-thumbnail">
//                                                                     {uploadedImageUrl && <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${uploadedImageUrl}`} alt="Uploaded" className="img-fluid" />}
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

// export default EmployeeCreate;
// 'use client' 
 //ismile
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';
// import { FaMapMarkerAlt } from 'react-icons/fa';

// const EmployeeCreate = () => {

//     let [fields, setFields] = useState([{
//         education: '', institute: '',
//         result: '', passing_year: '', created_by: ''
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
//                     created_by: ''
//                 });
//             }
//             setFields(newInputValues);
//             setNumToAdd(1);
//         }
//     };



//     const handleChange = (index, event) => {

//         const newFields = [...fields];

//         if (event.target.type === 'file') {
//             newFields[index][event.target.name] = event.target.files[0];
//         } else {
//             newFields[index][event.target.name] = event.target.value;

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


//     console.log(payRoll)

//     const created_by = localStorage.getItem('userId')
//     let [fieldes, setFieldes] = useState({
//         // user_id: '',
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
//         full_name: '',
//         father_name: '',
//         mother_name: '',
//         dob: '',
//         gender: '',
//         religion: '',
//         mobile: '',
//         email: '',
//         password: '',
//         signature_image: '',
//         father_name: '',
//         mother_name: '',
//         photo: '',

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
//         setFieldes(prevData => ({
//             ...prevData,
//             dob: formattedDatabaseDate // Update the period_name field in the state
//         }));
//     };
//     console.log(currentDate)

//     // const period_name = allEmployeeList.dob;
//     // const formattedDate = period_name.split('T')[0];
//     const [reformattedDate, setReformattedDate] = useState('');

//     useEffect(() => {
//         const period_name = fieldes.dob;
//         const formattedDate = period_name?.split('T')[0];

//         if (formattedDate?.includes('-')) {
//             const [year, month, day] = formattedDate.split('-');
//             setReformattedDate(`${day}-${month}-${year}`);
//         } else {
//             console.error("Date format is incorrect:", formattedDate);
//         }
//     }, [fieldes]);


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
//             console.error("Date format is incorrect:", formattedDate);
//         }
//     }, [fieldes]);




//     const [error, setError] = useState([])
//     const [fatherName, setFatherName] = useState([])
//     const [motherName, setMotherName] = useState([])
//     const [dob, setDob] = useState([])
//     const [gender, setGender] = useState([])
//     const [religion, setReligion] = useState([])
//     const [email, setEmail] = useState([])
//     const [mobile, setMobile] = useState([])
//     const [password, setPassword] = useState([])
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


//     console.log(lUpazila)
//     const period_change = (event) => {
//         const name = event.target.name
//         const value = event.target.value
//         const attribute = { ...fieldes }
//         attribute[name] = value
//         setFieldes(attribute)

//         const fullName = attribute['full_name'];
//         if (fullName) {
//             setError(""); // Clear the error message

//         }

//         const fatherName = attribute['father_name'];
//         if (fatherName) {
//             setFatherName(""); // Clear the error message

//         }

//         const motherName = attribute['mother_name'];
//         if (motherName) {
//             setMotherName(""); // Clear the error message
//         }

//         const dob = attribute['dob'];
//         if (dob) {
//             setDob(""); // Clear the error message
//         }

//         const gender = attribute['gender'];
//         if (gender) {
//             setGender(""); // Clear the error message
//         }

//         const religion = attribute['religion'];
//         if (religion) {
//             setReligion(""); // Clear the error message
//         }

//         const mobile = attribute['mobile'];
//         if (mobile) {
//             setMobile(""); // Clear the error message
//         }

//         const email = attribute['email'];
//         if (email) {
//             setEmail(""); // Clear the error message
//         }

//         const experience = attribute['experience'];
//         if (experience) {
//             setExperience(""); // Clear the error message
//         }

//         const password = attribute['password'];
//         if (password) {
//             setPassword(""); // Clear the error message
//         }

//         const education = attribute['education'];
//         if (education) {
//             setEducation(""); // Clear the error message
//         }

//         const school = attribute['institute'];
//         if (school) {
//             setSchool(""); // Clear the error message
//         }

//         const result = attribute['result'];
//         if (result) {
//             setResult(""); // Clear the error message
//         }

//         const passingYear = attribute['passing_year'];
//         if (passingYear) {
//             setPassingYear(""); // Clear the error message
//         }

//         const lDivision = attribute['ldivision_id'];
//         if (lDivision) {
//             setLDivision(""); // Clear the error message
//         }

//         const lDistrict = attribute['ldistrict_id'];
//         if (lDistrict) {
//             setLDistrict(""); // Clear the error message
//         }

//         const lUpazila = attribute['lUpazila_id'];
//         if (lUpazila) {
//             setLUpazila(""); // Clear the error message
//         }

//         // const fatherName = attribute['father_name'];
//         // if (fatherName) {
//         //     setFatherName(""); // Clear the error message
//         // }

//         // const fatherName = attribute['father_name'];
//         // if (fatherName) {
//         //     setFatherName(""); // Clear the error message
//         // }

//         // const fatherName = attribute['father_name'];
//         // if (fatherName) {
//         //     setFatherName(""); // Clear the error message
//         // }

//         // const fatherName = attribute['father_name'];
//         // if (fatherName) {
//         //     setFatherName(""); // Clear the error message
//         // }

//         // const fatherName = attribute['father_name'];
//         // if (fatherName) {
//         //     setFatherName(""); // Clear the error message
//         // }

//         // const fatherName = attribute['father_name'];
//         // if (fatherName) {
//         //     setFatherName(""); // Clear the error message
//         // }

//         // const fatherName = attribute['father_name'];
//         // if (fatherName) {
//         //     setFatherName(""); // Clear the error message
//         // }

//         // const fatherName = attribute['father_name'];
//         // if (fatherName) {
//         //     setFatherName(""); // Clear the error message
//         // }

//         // const fatherName = attribute['father_name'];
//         // if (fatherName) {
//         //     setFatherName(""); // Clear the error message
//         // }

//         // const fatherName = attribute['father_name'];
//         // if (fatherName) {
//         //     setFatherName(""); // Clear the error message
//         // }

//         // const fatherName = attribute['father_name'];
//         // if (fatherName) {
//         //     setFatherName(""); // Clear the error message
//         // }

//         // const fatherName = attribute['father_name'];
//         // if (fatherName) {
//         //     setFatherName(""); // Clear the error message
//         // }



//     };

//     const employee_create = (event) => {

//         event.preventDefault();
//         const form = event.target;

//         const full_name = form.full_name.value;
//         const dob = form.dob.value;
//         const gender = form.gender.value;
//         const religion = form.religion.value;
//         const mobile = form.mobile.value;
//         const email = form.email.value;
//         const password = form.password.value;
//         const experience = form.experience.value;
//         const education = form.education.value;
//         const institute = form.institute.value;
//         const result = form.result.value;
//         const passing_year = form.passing_year.value;
//         const division_id_living = form.ldivision_id.value;
//         const district_id_living = form.ldistrict_id.value;
//         const upazila_id_living = form.lupazila_id.value;
//         const address_id_living = form.laddress.value;
//         const division_id_permanent = form.pdivision_id.value;
//         const district_id_permanent = form.pdistrict_id.value;
//         const upazila_id_permanent = form.pupazila_id.value;
//         const address_id_permanent = form.paddress.value;
//         const join_date = form.join_date.value;
//         const payroll_id = form.payroll_id.value;
//         const school_shift_id = form.school_shift_id.value;
//         const signature_image = form.signature_image.value;
//         const photo = form.photo.value;
//         const designation_id = form.designation_id.value;
//         const father_name = form.father_name.value;
//         const mother_name = form.mother_name.value;

//         if (!father_name) {
//             setFatherName("Father Name is a required field.");
//             return;
//         }
//         if (!mother_name) {
//             setMotherName("Mother Name is a required field.");
//             return;
//         }
//         if (!full_name) {
//             setError("Full Name is a required field.");
//             return; // Exit function without submitting the form
//         }
//         if (!dob) {
//             setDob("Date of Birth is a required field.");
//             return;
//         }
//         if (!gender.trim() && gender === '') {
//             setGender("Gender is a required field.");
//             return;
//         }
//         if (!religion) {
//             setReligion("Religion is a required field.");
//             return;
//         }
//         if (!mobile) {
//             setMobile("Mobile is a required field.");
//             return;
//         }
//         if (!email) {
//             setEmail("Email is a required field.");
//             return;
//         }
//         if (!experience) {
//             setExperience("Experience is a required field.");
//             return;
//         }
//         if (!password) {
//             setPassword("Password is a required field.");
//             return;
//         }
//         if (!education) {
//             setEducation("Education is a required field.");
//             return;
//         }
//         if (!institute) {
//             setSchool("Institute is a required field.");
//             return;
//         }
//         if (!result) {
//             setResult("Result is a required field.");
//             return;
//         }
//         if (!passing_year) {
//             setPassingYear("Passing Year is a required field.");
//             return;
//         }

//         if (!division_id_living) {
//             setLDivision("Living Division ID is a required field.");
//             return;
//         }
//         if (!district_id_living) {
//             setLDistrict("Living District ID is a required field.");
//             return;
//         }
//         if (!upazila_id_living) {
//             setLUpazila("Living Upazila ID is a required field.");
//             return;
//         }
//         if (!address_id_living) {
//             setLAddress("Living Address ID is a required field.");
//             return;
//         }
//         if (!division_id_permanent) {
//             setPDivision("Permanent Division ID is a required field.");
//             return;
//         }
//         if (!district_id_permanent) {
//             setPDistrict("Permanent District ID is a required field.");
//             return;
//         }
//         if (!upazila_id_permanent) {
//             setPUpazila("Permanent Upazila ID is a required field.");
//             return;
//         }
//         if (!address_id_permanent) {
//             setPAddress("Permanent Address ID is a required field.");
//             return;
//         }
//         if (!join_date) {
//             setJoinDate("Join Date is a required field.");
//             return;
//         }
//         if (!designation_id) {
//             setDesignation("Designation ID is a required field.");
//             return;
//         }
//         if (!payroll_id) {
//             setPayroll("Payroll ID is a required field.");
//             return;
//         }
//         if (!school_shift_id) {
//             setShift("School Shift ID is a required field.");
//             return;
//         }

       


//         const uniqueFields = {
//             father_name,
//             mother_name,
//             full_name,
//             dob,
//             gender,
//             religion,
//             mobile,
//             email,
//             password,
//             experience,
//             education,
//             institute,
//             result,
//             passing_year,
//             division_id_living,
//             district_id_living,
//             upazila_id_living,
//             address_id_living,
//             division_id_permanent,
//             district_id_permanent,
//             upazila_id_permanent,
//             address_id_permanent,
//             join_date,
//             payroll_id,
//             school_shift_id,
//             signature_image,
//             photo,
//             created_by,
//             designation_id
//         }

//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_create`, {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json',
//             },
//             body: JSON.stringify(uniqueFields),
//         })
//             .then((Response) =>
//                 Response.json()
//             )
//             .then((data) => {
//                 if (data[0]?.affectedRows > 0) {
//                     sessionStorage.setItem("message", "Data saved successfully!");
//                     // router.push('/Admin/brand/brand_all');
//                 }
//                 console.log(data)

//             })
//             .catch((error) => console.error(error));
//     }



//     const [selectedFile, setSelectedFile] = useState(null);
//     const [fileNames, setFileNames] = useState([]);
//     const [fileSizeError, setFileSizeError] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

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
//     const [uploadedImageUrl, setUploadedImageUrl] = useState(null);


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
//                                         <Link href={`/Admin/employee/google_map/19285`} className="btn btn-sm btn-info ml-4"><FaMapMarkerAlt></FaMapMarkerAlt> </Link>
//                                     </div>
//                                 </div>
//                                 <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                 </div>
//                                 <div class="card-body ">
//                                     <form class="" method="post" autocomplete="off" onSubmit={employee_create}>
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
//                                                                 <input onChange={period_change} type="text" name="father_name" class="form-control form-control-sm  required " id="father_name" placeholder="Enter Father Name" />
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
//                                                                 <input onChange={period_change}
//                                                                     type="text" name="full_name" class="form-control form-control-sm  required " id="full_name" placeholder="Enter Full Name" />
//                                                                 {
//                                                                     error && <p className='text-danger'>{error}</p>
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Gender:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select
//                                                                     onChange={period_change}
//                                                                     name="gender" class="form-control form-control-sm  required integer_no_zero" id="gender_name">
//                                                                     <option >Select Gender</option>
//                                                                     <option value="2">Female</option>
//                                                                     <option value="1">Male</option>
//                                                                     <option value="7">Others</option>
//                                                                 </select>

//                                                                 {
//                                                                     gender && <p className='text-danger'>{gender}</p>
//                                                                 }

//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Mobile:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <input
//                                                                     onChange={period_change}
//                                                                     type="text" name="mobile" maxlength="11" class="form-control form-control-sm  required " id="mobile" placeholder="Enter Mobile" />
//                                                                     {
//                                                                         mobile && <p className='text-danger'>{mobile}</p>
//                                                                     }

//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold">Year of Experience:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <input onChange={period_change} type="text" name="experience" class="form-control form-control-sm  required " id="experience" placeholder="Enter Year of Experience" />
//                                                                 {
//                                                                         experience && <p className='text-danger'>{experience}</p>
//                                                                     }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  ">Confirm Password:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input type="password" 
//                                                                 onChange={period_change}
//                                                                 name="confirm_password" class="form-control form-control-sm  required matches_password" id="confirm_password" placeholder="Enter Confirm Password" />
//                                                                    {
//                                                                         password && <p className='text-danger'>{password}</p>
//                                                                     }
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div class="col-md-6">
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-right">Mother Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input onChange={period_change} type="text" name="mother_name" class="form-control form-control-sm  required " id="mother_name" placeholder="Enter Mother Name" />
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
//                                                                 {/* <input type="date" name="dob" class="form-control form-control-sm  required urban_datepicker" id="dob" placeholder="Enter Date of Birth" /> */}
//                                                                 <input
//                                                                     type="text"
//                                                                     readOnly
//                                                                     name='dob'
//                                                                     defaultValue={reformattedDate}
//                                                                     onClick={() => document.getElementById(`dateInput-n`).showPicker()}
//                                                                     placeholder="dd-mm-yyyy"
//                                                                     className="form-control form-control-sm mb-2"
//                                                                     style={{ display: 'inline-block', }}
//                                                                 />
//                                                                 <input
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
//                                                                 <select name="religion" class="form-control form-control-sm  required integer_no_zero">
//                                                                     <option value=''>Select Religion</option>
//                                                                     <option value="1">Islam</option>
//                                                                 </select>
//                                                                 {
//                                                                         religion && <p className='text-danger'>{religion}</p>
//                                                                     }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Email ID:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <input type="text" name="email" class="form-control form-control-sm  required " id="email" placeholder="Enter Email ID" />
//                                                                 {
//                                                                         email && <p className='text-danger'>{email}</p>
//                                                                     }
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3">
//                                                                 <label class="font-weight-bold  text-right"> Password:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
//                                                             </div>
//                                                             <div class="col-md-8">
//                                                                 <input type="password" name="password" class="form-control form-control-sm  required password" id="password" placeholder="Enter password" />
//                                                                 {
//                                                                         password && <p className='text-danger'>{password}</p>
//                                                                     }
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
//                                                                                             value={field.education}
//                                                                                             onChange={(e) => handleChange(index, e)}
//                                                                                             name="education" class="form-control form-control-sm  trim integer_no_zero row_unique_education" id="education" placeholder="Enter Education">
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
//                                                                                     </td>
//                                                                                     <td>
//                                                                                         <input
//                                                                                             value={field.institute}
//                                                                                             onChange={(e) => handleChange(index, e)}
//                                                                                             type="text" name="institute" class="form-control form-control-sm  required row_unique_institute" id="institute" placeholder="Enter Institute" />
//                                                                                     </td>
//                                                                                     <td>
//                                                                                         <input
//                                                                                             value={field.result}
//                                                                                             onChange={(e) => handleChange(index, e)}
//                                                                                             type="text" name="result" class="form-control form-control-sm  required row_unique_result" id="result" placeholder="Enter Result" />
//                                                                                     </td>
//                                                                                     <td>
//                                                                                         <input
//                                                                                             value={field.passing_year}
//                                                                                             onChange={(e) => handleChange(index, e)}
//                                                                                             type="text" name="passing_year" class="form-control form-control-sm  required row_unique_passing_year" id="passing_year" placeholder="Enter Passing Year" />
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
//                                                                         <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} name="ldivision_id" class=" form-control form-control-sm  required integer_no_zero ldivision">
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
//                                                                         <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} name="ldistrict_id" class=" form-control form-control-sm  required integer_no_zero ldistrict">
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
//                                                                             name="lupazila_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
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
//                                                                     name='join_date'
//                                                                     defaultValue={formattedDisplayDate}
//                                                                     onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
//                                                                     placeholder="dd-mm-yyyy"
//                                                                     className="form-control form-control-sm mb-2"
//                                                                     style={{ display: 'inline-block', }}
//                                                                 />
//                                                                 <input
//                                                                     type="date"
//                                                                     id={`dateInput-nt`}
//                                                                     onChange={(e) => handleDateSelection(e)}
//                                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                                                 />
//                                                             </div>
//                                                         </div>

//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Employee ID:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <input type="text" name="finger_print_id" class=" form-control form-control-sm  required " id="finger_print_id" placeholder="Enter Employee ID" />
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div class="col-md-6">
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Designation:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select name="designation_id" class=" form-control form-control-sm  required integer_no_zero " id="designation_name">
//                                                                     <option value="">Select Designation</option>
//                                                                     <option value="15">Accountant</option>
//                                                                     <option value="14">Office Boy</option>
//                                                                 </select>

//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Payroll:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select name="payroll_id" class="form-control form-control-sm  required integer_no_zero " id="title">
//                                                                     <option value="">Select Payroll</option>
//                                                                     {payRoll.map(item => (
//                                                                         < >
//                                                                             <option value={item.id}>{`${item.title} (${item.basic}/-)`}</option>
//                                                                         </>
//                                                                     ))}
//                                                                 </select>
//                                                             </div>
//                                                         </div>
//                                                         <div class="form-group row no-gutters">
//                                                             <div class="col-md-3"><label class="font-weight-bold  text-right">Shift:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label></div>
//                                                             <div class="col-md-8">
//                                                                 <select

//                                                                     name="school_shift_id" class=" form-control form-control-sm  required integer_no_zero lupazila">
//                                                                     <option value="">Select Shift</option>
//                                                                     {
//                                                                         schoolShiftList.map(upazila =>

//                                                                             <>
//                                                                                 <option value={upazila.id}>{upazila.name}</option>
//                                                                             </>
//                                                                         )
//                                                                     }
//                                                                 </select>
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
//                                                                 <input type="text" className='d-none' value={uploadedFileUrl} name='photo' />
//                                                                 <div id="software_logo" className="logo bg-light img-thumbnail">
//                                                                     {uploadedFileUrl && <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${uploadedFileUrl}`} alt="Uploaded" className="img-fluid" />}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>





//                                                     <div className="col-md-6">
//                                                         <div className="form-group row no-gutters">
//                                                             <div className="col-md-3">
//                                                                 <label className="font-weight-bold text-right">Image:</label>
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
//                                                                 <input name='signature_image' type="text" className='d-none' value={uploadedImageUrl} />
//                                                                 <div id="software_logo" className="logo bg-light img-thumbnail">
//                                                                     {uploadedImageUrl && <img src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${uploadedImageUrl}`} alt="Uploaded" className="img-fluid" />}
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

// export default EmployeeCreate;