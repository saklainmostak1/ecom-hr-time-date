'use client' 
 //ismile


import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const SalaryCreate = () => {


    const {
        data: apiData = [],
        isLoading,
        refetch,
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



    const { data: account_head = []
    } = useQuery({
        queryKey: ['account_head'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head/account_head_list`)

            const data = await res.json()
            return data
        }
    })


    const [created, setCreated] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setCreated(storedUserId);
        }
    }, []);

    const [fromDate, setFromDate] = useState('');
    const [bonus, setBonus] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);

    const [months, setMonths] = useState([]);
    const [designation, setDesignation] = useState('');
    const [month, setMonth] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        const currentDate = new Date();
        setFromDate(currentDate);
    }, []);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth(); // 0-based index
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const monthOptions = [];
        for (let i = 0; i <= currentMonth; i++) {
            monthOptions.push({
                value: `${currentYear}-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
                label: `${monthNames[i]} ${currentYear}`
            });
        }

        setMonths(monthOptions);
    }, []);

    const { data: designations = [], isLoading: isDesignationsLoading } = useQuery({
        queryKey: ['designations'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_list`)
            const data = await res.json()
            return data
        }
    });

    const { data: salaries = [] } = useQuery({
        queryKey: ['salaries'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_all`)
            const data = await res.json()
            return data
        }
    });

    const getTotalDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    const salary_search = () => {
        setLoading(true);

        if (month === '') {
            alert('select a month')
            return
        }

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_search`, {
            designation
        })
            .then(response => {
                const results = response.data.results;
                const monthYear = month.split('-');
                const totalDays = getTotalDaysInMonth(Number(monthYear[0]), Number(monthYear[1]));

                const updatedResults = results.map(result => ({
                    ...result,
                    totalDays
                }));

                setSearchResults(updatedResults);
                setError(null);
                setLoading(false);
                if (results.length === 0) {
                    alert('Nothing found!');
                }
            })
            .catch(error => {
                setError("An error occurred during search.");
                setSearchResults([]);
                setLoading(false);
            });
    };

    const { data: attendance = [] } = useQuery({
        queryKey: ['attendance'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance_all/attendance_all`)
            const data = await res.json()
            return data
        }
    });


    const matchLengths = salaries.map(emp => {
        const matchCount = attendance.filter(att => att.user_id === emp.user_id).length;
        return { user_id: emp.user_id, match_length: matchCount };
    });

    console.log(matchLengths)

    const { data: holidays = [] } = useQuery({
        queryKey: ['holidays'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/yearly_holiday/yearly_holiday_all`)
            const data = await res.json()
            return data
        }
    });

    const filteredAttendances = holidays.filter(att => {
        const checktimeMonthYear = att.start_date.substring(0, 7);
        return checktimeMonthYear === month;
    });

    console.log(filteredAttendances)
    console.log(month)
    const { data: leavesDays = [] } = useQuery({
        queryKey: ['leavesDays'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_all`)
            const data = await res.json()
            return data
        }
    });

    const leaveApproveCount = leavesDays.filter(leave => leave.application_status === 2);

    const { data: leavesDaysApproved = [] } = useQuery({
        queryKey: ['leavesDaysApproved'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_approved/leave_approved_all`)
            const data = await res.json()
            return data
        }
    });

    // const matchLength = leaveApproveCount.map(emp => {
    //     const matchCount = leavesDaysApproved.filter(att => att.leave_application_id === emp.id).length;
    //     return { user_id: emp.whose_leave, match_length: matchCount };
    // });
    const matchLength = leaveApproveCount.map(emp => {
        const months = emp.start_date.slice(0, 7); // Get the month in 'YYYY-MM' format
        const attMonth = month?.slice(0, 7); // Get the month in 'YYYY-MM' format
        const matchCount = leavesDaysApproved.filter(att => {
            return att.leave_application_id === emp.id && months === attMonth;
        }).length;

        return { user_id: emp.whose_leave, attMonth, match_length: matchCount };
    });

    console.log(matchLength)

    const { data: salaryList = [], } = useQuery({
        queryKey: ['salaryList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_list`)
            const data = await res.json()
            return data
        }
    });


    // console.log(salaryList.find())

    //     const handleSubmit = (event) => {
    //         event.preventDefault();

    //         const formatDate = (date) => {
    //             const d = new Date(date);
    //             const year = d.getFullYear();
    //             const month = ('0' + (d.getMonth() + 1)).slice(-2);
    //             const day = ('0' + d.getDate()).slice(-2);
    //             return `${year}-${month}-${day}`;
    //         };

    //         const formToSubmit = Array.from(document.querySelectorAll('input[name="salaryCheckbox"]:checked')).map(checkbox => {
    //             const row = checkbox.closest('tr');
    //             const userId = row.querySelector('input[name="user_id"]').value;
    //             const due = row.querySelector('input[name="due"]').value;
    //             const salary = parseFloat(row.querySelector('.paid_amount').value) - parseFloat(bonus);
    //             return {
    //                 user_id: userId,
    //                 salary_month: `${month}-10`,
    //                 salary_date: fromDate ? formatDate(fromDate) : '',
    //                 created_by: created,
    //                 due: due,
    //                 paid_amount: parseFloat(salary + parseFloat(bonus)),
    //                 paid_by: row.querySelector('select[name="paid_by"]').value
    //             };
    //         });
    // console.log(formToSubmit)
    // // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_create
    //         axios.post(``, formToSubmit)
    //             .then(response => {
    //                 alert('Data submitted successfully!');
    //             })
    //             .catch(error => {
    //                 alert('An error occurred while submitting data.');
    //                 console.error('Error:', error);
    //             });
    //     };


    const handleBonusChange = (userId, value) => {
        setBonus(prevBonuses => ({
            ...prevBonuses,
            [userId]: value
        }));
    };
    const [paidAmounts, setPaidAmounts] = useState({});
    const handlePaidAmountChange = (userId, newPaidAmount) => {
        setPaidAmounts(prevPaidAmounts => ({
            ...prevPaidAmounts,
            [userId]: newPaidAmount
        }));
    };
    console.log(paidAmounts)




    const { data: smsSettings = [], } = useQuery({
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

    const formatDates = (dateString) => {
        return dateString.split('-').join('/');
    };

    const [sendSmsChecked, setSendSmsChecked] = useState(false);

    // const designation_name = designationList.find(desig => desig.id === parseFloat(fieldes.designation_id))
    // const payroll_name = payRoll.find(desig => desig.id === parseFloat(fieldes.payroll_id))
    // console.log(designationList)
    // console.log(payroll_name)
    const [checkData, setCheckData] = useState([]);
    const handleCheckboxChange = (userId, isChecked) => {
        setCheckData(prevCheckData => {
            if (isChecked) {
                return [...prevCheckData, userId];
            } else {
                return prevCheckData.filter(id => id !== userId);
            }
        });
    };

    console.log(checkData)

    const employeeAttendanceSmsTemplate = attendanceSms?.e_salary
    const employeeSalarySmsTemplate = attendanceSms?.auto_e_salary

    console.log(employeeSalarySmsTemplate)


    const sendOtpToAllEmployees = () => {

        if (!sendSmsChecked) {
            console.log('SMS sending is disabled');
            return;
        }

        if (employeeSalarySmsTemplate !== 1) {
            console.log('Auto is not active');
            return;
        }



        checkData.forEach((employee) => {


            const currentDate = new Date();

            const smsTime = currentDate.toLocaleTimeString();

            // Replace placeholders with actual data
            let msg = employeeAttendanceSmsTemplate
                .replace('[[company_name]]', employee.company_name || 'No Company')
                .replace('[[full_name]]', employee.employee_name)
                .replace('[[employee_id]]', employee.unique_id)
                .replace('[[employee_designation]]', employee.designation_name_promotion)
                .replace('[[joining_date]]', formatDateAmPm(employee.join_date))
                .replace('[[payroll_name]]', employee.Payroll)
                .replace('[[payroll_total]]', employee.salary)
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
        );


    };


    const { data: attendance_sms_campaign_categorys = [] } = useQuery({
        queryKey: ['attendance_sms_campaign_categorys'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance_sms/attendance_sms_campaign_category`)
            const data = await res.json()
            return data
        }
    });

    const employeeAttendance = attendance_sms_campaign_categorys.find(attendance_sms_campaign_category => attendance_sms_campaign_category.id === 10)




    const handleSubmit = (event) => {
        event.preventDefault();

        const formatDate = (date) => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = ('0' + (d.getMonth() + 1)).slice(-2);
            const day = ('0' + d.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
        };

        const formToSubmit = Array.from(document.querySelectorAll('input[name="salaryCheckbox"]:checked')).map(checkbox => {
            const row = checkbox.closest('tr');
            const userId = row.querySelector('input[name="user_id"]').value;
            const due = parseFloat(row.querySelector('input[name="due"]').value) || 0;
            const paidAmount = parseFloat(row.querySelector('.paid_amount').value) || 0;
            const bonus = parseFloat(row.querySelector('input[name="bonus"]').value) || 0;
            const salary = paidAmount - bonus;
            const matchingUncheckItem = checkData.find(checkedItem => checkedItem.user_id === parseFloat(userId));
            const phoneNumber = matchingUncheckItem.mobile;

            return {
                user_id: userId,
                salary_month: `${month}-10`,
                salary_date: fromDate ? formatDate(fromDate) : '',
                created_by: created,
                due: due,
                paid_amount: paidAmount, // No need to recalculate here, just use paidAmount
                paid_by: row.querySelector('select[name="paid_by"]').value,
                name: employeeAttendance.category_name,
                sms_campaign_category_id: employeeAttendance.id,
                employeeAttendanceSmsTemplate: employeeAttendanceSmsTemplate,
                checkedItemsData: matchingUncheckItem,
                number: phoneNumber,
                employeeSalarySmsTemplate: employeeSalarySmsTemplate,
                sendSmsChecked: sendSmsChecked,

            };
        });

        console.log(formToSubmit);

        console.log(formToSubmit)


        // const paidByWiseAmounts = formToSubmit.reduce((acc, { paid_by, paid_amount }) => {
        //     acc[paid_by] = (acc[paid_by] || 0) + paid_amount;
        //     return acc;
        // }, {});

        // console.log(paidByWiseAmounts);


        const result = formToSubmit.reduce((acc, item) => {
            const { paid_by, paid_amount } = item;
            if (!acc[paid_by]) {
                acc[paid_by] = { paid_by, amount: 0 };
            }
            acc[paid_by].amount += paid_amount;
            return acc;
        }, {});

        // Convert the result object into an array of objects
        const finalResult = Object.values(result);

        console.log(finalResult);

        const paidAmountMap = finalResult.reduce((acc, { paid_by, amount }) => {
            acc[paid_by] = amount;
            return acc;
        }, {});

        // Update the data array with remaining amounts
        const updatedData = account_head.map(item => {
            const paid = paidAmountMap[item.id.toString()] || 0; // Get the paid amount or 0 if not found
            const remainingAmount = item.amount - paid; // Calculate remaining amount
            return {
                id: item.id,
                amount: remainingAmount // Add remaining amount to the item
            };
        });

        console.log(updatedData);

        // Replace the empty string with your API URL ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_create
        axios.post(``, formToSubmit)
            .then(response => {
                // alert('Data submitted successfully!');
            })
            .catch(error => {
                alert('An error occurred while submitting data.');
                console.error('Error:', error);
            });
    };


    const { data: absents = [] } = useQuery({
        queryKey: ['absents'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/absent/absent_all`)
            const data = await res.json()
            return data
        }
    });
    console.log(absents)
    console.log(month)



    const absencesPerUser = absents.reduce((acc, absent) => {
        // Extract the year-month from the absent_date
        const absentMonth = absent.absent_date.slice(0, 7);

        // Check if the absentMonth matches the specified month
        if (absentMonth === month) {
            // If user_id is already in the accumulator, increment the count
            if (acc[absent.user_id]) {
                acc[absent.user_id]++;
            } else {
                // Otherwise, initialize the count for this user_id
                acc[absent.user_id] = 1;
            }
        }

        return acc;
    }, {});

    console.log(absencesPerUser);


    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Salary Create</h5>
                                </div>
                                <div className="card-body">
                                    <form >
                                        <div className="col-md-10 offset-md-1">
                                            <div className="form-group row">
                                                <label className="col-form-label col-md-2"><strong>Designation:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={designation} onChange={(e) => setDesignation(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Designation</option>
                                                        {
                                                            designations.map(designation =>
                                                                <option key={designation.id} value={designation.id}>
                                                                    {designation.designation_name}
                                                                </option>
                                                            )
                                                        }
                                                    </select>
                                                </div>

                                                <label className="col-form-label col-md-2"><strong>Month:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={month} onChange={(e) => setMonth(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Month</option>
                                                        {months.map((month, index) => (
                                                            <option key={index} value={month.value}>
                                                                {month.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-2 col-md-8 float-left">
                                                <input type="button" name="search" className="btn btn-sm btn-info" value="Search"
                                                    onClick={salary_search}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='card'>
                        <form action="" onSubmit={handleSubmit}>
                            <div className="body-content bg-light">
                                <div className="border-primary shadow-sm border-0">
                                    <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                        <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employee Salary Generate</h5>
                                        <div className="card-title font-weight-bold mb-0 card-header-color float-right d-flex">
                                            <div className='m-0'>
                                                <label className='font-weight-bold'>
                                                    <input
                                                        type="checkbox"
                                                        checked={sendSmsChecked}
                                                        onChange={(e) => setSendSmsChecked(e.target.checked)}
                                                    />
                                                    <span> Send SMS</span>
                                                </label>
                                            </div>
                                            <div className="ml-2 m-0">
                                                <input
                                                    onClick={sendOtpToAllEmployees}
                                                    type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">


                                        <div className='table-responsive'>
                                            {
                                                searchResults.length > 0 &&
                                                <table className="table table-bordered table-hover table-striped table-sm">
                                                    <thead>
                                                        <tr>

                                                            <th>
                                                                {/* <input type="checkbox" name="" id="" /> */}
                                                            </th>
                                                            <th>Serial</th>
                                                            <th>Name</th>
                                                            <th>Designation</th>
                                                            <th>Payroll</th>
                                                            <th>Previous Due</th>
                                                            <th>Present Salary</th>
                                                            <th>Total Payable Amount</th>
                                                            <th>Bonus</th>
                                                            <th>Paid Amount</th>
                                                            <th>Due Amount</th>
                                                            <th>Total Day</th>
                                                            <th>Working Day</th>
                                                            <th>Absent & Present</th>
                                                            <th>Holiday & Leave</th>
                                                            <th>Paid By:</th>
                                                            <th>Salary Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {loading ?
                                                            <tr>
                                                                <td colSpan="16" className="text-center">
                                                                    <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
                                                                </td>
                                                            </tr>
                                                            :
                                                            searchResults.map((salary, i) => (
                                                                <tr key={salary.id}>
                                                                    <th>
                                                                        <input
                                                                            checked={checkData.includes(salary)}
                                                                            onChange={(e) => handleCheckboxChange(salary, e.target.checked)}
                                                                            type="checkbox" name="salaryCheckbox" id="" />
                                                                    </th>
                                                                    <td>{i + 1}</td>
                                                                    <td>{salary.employee_name}

                                                                        <input type="text" className='d-none' name='user_id'
                                                                            value={salary.user_id}
                                                                        />
                                                                    </td>
                                                                    <td>{salary.designation_name_promotion}</td>
                                                                    <td>{`${salary.Payroll} (${salary.salary})`}</td>
                                                                    <td>0</td>
                                                                    <td>{salary.salary}


                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            (salary.salary - ((salary.salary / salary.totalDays) * (parseFloat(absencesPerUser[salary.user_id]) || 0)))
                                                                        }
                                                                        {/* {
                                                                            ((salary.salary / salary.totalDays) * ((filteredAttendances.length) + (matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0) + (matchLengths.find(item => item.user_id === salary.user_id)?.match_length || 0))).toFixed(2)
                                                                        } */}
                                                                    </td>
                                                                    <td>
                                                                        {/* <input
                                                                            value={bonus} onChange={(e) => setBonus(e.target.value)}
                                                                            type="number" name="bonus" class="form-control form-control-sm text-right bonus" id="bonus" /> */}
                                                                        <input
                                                                            value={parseFloat(bonus[salary.user_id]) || 0}
                                                                            onChange={(e) => handleBonusChange(salary.user_id, e.target.value)}
                                                                            type="number"
                                                                            name="bonus"
                                                                            className="form-control form-control-sm text-right bonus"
                                                                            id={`bonus-${salary.user_id}`}
                                                                        />
                                                                    </td>
                                                                    <td>

                                                                        <input
                                                                            type="number"
                                                                            name="paid_amount"
                                                                            className="form-control form-control-sm text-right paid_amount"
                                                                            value={parseFloat(paidAmounts[salary.user_id]) || (parseFloat(salary.salary) + parseFloat(bonus[salary.user_id] || 0))}
                                                                            onChange={(e) => handlePaidAmountChange(salary.user_id, parseFloat(e.target.value) || (parseFloat(salary.salary) + parseFloat(bonus[salary.user_id] || 0)))}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        {paidAmounts[salary.user_id] ? (salary.salary - parseFloat(paidAmounts[salary.user_id] || 0)) : 0}
                                                                        <input type="number"
                                                                            name="due" class="form-control form-control-sm text-right due d-none" id="due"
                                                                            // value={(salary.salary + parseFloat(bonus[salary.user_id] || 0)) - (salary.salary)}
                                                                            value={paidAmounts[salary.user_id] ? (salary.salary - parseFloat(paidAmounts[salary.user_id] || 0)) : 0}
                                                                        />
                                                                    </td>


                                                                    <td>{salary.totalDays}</td>
                                                                    <td>

                                                                        {
                                                                            Math.abs(
                                                                                (filteredAttendances.length +
                                                                                    (matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0) -
                                                                                    salary.totalDays)
                                                                            )
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        Absent:
                                                                        <span className='ml-1'>{
                                                                            absencesPerUser[salary.user_id] || 0
                                                                        }</span>
                                                                        {/* {(Math.abs(
                                                                            (filteredAttendances.length +
                                                                                (matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0) -
                                                                                salary.totalDays)
                                                                        ))



                                                                            - (matchLengths.find(item => item.user_id === salary.user_id)?.match_length || 0)
                                                                        } */}


                                                                        <br />
                                                                        Present:                                {matchLengths.find(item => item.user_id === salary.user_id)?.match_length || 0}
                                                                    </td>
                                                                    <td>
                                                                        Holiday: {filteredAttendances.length}
                                                                        <br />
                                                                        {/* Leave: 
                                                                        {matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0} */}
                                                                        Leave: {matchLength.find(item =>
                                                                            item.user_id === salary.user_id && item.attMonth === month?.slice(0, 7)
                                                                        )?.match_length || 0}
                                                                    </td>
                                                                    <td>
                                                                        <select name="paid_by" id="" class="form-control form-control-sm" required="">
                                                                            {
                                                                                account_head.map(account =>

                                                                                    <>
                                                                                        <option value={account.id}>{account.account_head_name}</option>
                                                                                    </>
                                                                                )
                                                                            }

                                                                        </select>
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            id="fromDate"
                                                                            value={fromDate ? formatDate(fromDate) : ''}
                                                                            onClick={handleTextInputClick}
                                                                            readOnly
                                                                        />
                                                                        <input
                                                                            name='salary_date'
                                                                            type="date"
                                                                            id="dateInputFrom"
                                                                            value={fromDate ? fromDate.toString().split('T')[0] : ''}
                                                                            onChange={handleDateChangeFrom}
                                                                            style={{ position: 'absolute', bottom: '20px', right: '0', visibility: 'hidden' }}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            }
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryCreate;

// 'use client' 
 //ismile

// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';

// const SalaryCreate = () => {


//     const [months, setMonths] = useState([]);

//     useEffect(() => {
//         const currentYear = new Date().getFullYear();
//         const currentMonth = new Date().getMonth(); // 0-based index
//         const monthNames = [
//             "January", "February", "March", "April", "May", "June",
//             "July", "August", "September", "October", "November", "December"
//         ];

//         // Create an array of months up to the current month
//         const monthOptions = [];
//         for (let i = 0; i <= currentMonth; i++) {
//             monthOptions.push({
//                 value: `${currentYear}-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
//                 label: `${monthNames[i]} ${currentYear}`
//             });
//         }

//         setMonths(monthOptions);
//     }, []);


//     const { data: designations = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['designations'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_list`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const { data: salarys = [],
//     } = useQuery({
//         queryKey: ['salarys'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_all`)

//             const data = await res.json()
//             return data
//         }
//     })

//     const [designation, setDesignation] = useState('');
//     const [month, setMonth] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [searchResults, setSearchResults] = useState([]);
//     const [error, setError] = useState(null);


//     const salary_search = () => {
//         setLoading(true);
//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_search`, {
//             designation
//         })
//             .then(response => {
//                 setSearchResults(response.data.results);
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

//     console.log(searchResults)



//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     {/* {
//                         message &&

//                         <div className="alert alert-success font-weight-bold">
//                             {message}
//                         </div>
//                     } */}
//                     <div className='card mb-4'>
//                         <div class=" body-content bg-light">

//                             <div class=" border-primary shadow-sm border-0">
//                                 <div class=" card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Salary Create</h5>
//                                     <div class="card-title font-weight-bold mb-0 card-header-color float-right">


//                                     </div>
//                                 </div>
//                                 <div class="card-body">
//                                     <form class="">
//                                         <div class="col-md-10 offset-md-1">


//                                             <div class="form-group row student">

//                                                 <label class="col-form-label col-md-2"><strong>Designation:</strong></label>
//                                                 <div className="col-md-4">
//                                                     <select
//                                                         value={designation} onChange={(e) => setDesignation(e.target.value)}
//                                                         name="statusFilter"
//                                                         className="form-control form-control-sm integer_no_zero lshift"

//                                                     >
//                                                         <option value="">Select Designation</option>
//                                                         {
//                                                             designations.map(designation =>
//                                                                 <>
//                                                                     <option value={designation.id}>{designation.designation_name}</option>
//                                                                 </>

//                                                             )
//                                                         }



//                                                     </select>
//                                                 </div>

//                                                 <label class="col-form-label col-md-2"><strong>Month:</strong></label>
//                                                 <div className="col-md-4">
//                                                     <select
//                                                         value={month} onChange={(e) => setMonth(e.target.value)}
//                                                         name="statusFilter"
//                                                         className="form-control form-control-sm integer_no_zero lshift"

//                                                     >
//                                                         <option value="">Select Month</option>
//                                                         {months.map((month, index) => (
//                                                             <option key={index} value={month.value}>
//                                                                 {month.label}
//                                                             </option>
//                                                         ))}



//                                                     </select>
//                                                 </div>

//                                             </div>




//                                         </div>
//                                         <div class="form-group row">
//                                             <div class="offset-md-2 col-md-8 float-left">
//                                                 <input type="button" name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search"
//                                                     onClick={salary_search}
//                                                 />

//                                             </div>
//                                         </div>
//                                     </form>
//                                     <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
//                                         <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>
//                     </div>



//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employee Salary Genarate</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">

//                                         <div class="offset-md-3 col-sm-6">
//                                             <input type="submit" name="create" class="btn btn-sm btn-success" value="Submit" />
//                                         </div>

//                                     </div>
//                                 </div>



//                                 <div class="card-body">



//                                     <div className='table-responsive'>
//                                         {
//                                             searchResults.length > 0 &&


//                                             <table className="table table-bordered table-hover table-striped table-sm">
//                                                 <thead>

//                                                     <tr>
//                                                         <th>

//                                                             Serial
//                                                         </th>
//                                                         <th>

//                                                             Name
//                                                         </th>
//                                                         <th>
//                                                             Designation
//                                                         </th>
//                                                         <th>
//                                                             Payroll
//                                                         </th>
//                                                         <th>
//                                                             Previous Due
//                                                         </th>
//                                                         <th>
//                                                             Present Salary
//                                                         </th>
//                                                         <th>
//                                                             Total Payable Amount
//                                                         </th>
//                                                         <th>
//                                                             Bonus
//                                                         </th>
//                                                         <th>
//                                                             Paid Amount
//                                                         </th>
//                                                         <th>
//                                                             Due Amount
//                                                         </th>
//                                                         <th>
//                                                             Total Day
//                                                         </th>
//                                                         <th>
//                                                             Working Day
//                                                         </th>
//                                                         <th>
//                                                             Absent & Present
//                                                         </th>
//                                                         <th>
//                                                             Holiday & Leave
//                                                         </th>
//                                                         <th>
//                                                             Paid By:
//                                                         </th>
//                                                         <th>
//                                                             Salary Date
//                                                         </th>
//                                                     </tr>

//                                                 </thead>

//                                                 <tbody>
//                                                     {isLoading ? <div className='text-center'>
//                                                         <div className='  text-center text-dark'
//                                                         >
//                                                             <FontAwesomeIcon style={{
//                                                                 height: '33px',
//                                                                 width: '33px',
//                                                             }} icon={faSpinner} spin />
//                                                         </div>
//                                                     </div>
//                                                         :
//                                                         searchResults.map((salaries, i) => (
//                                                             <tr key={salaries.id}>
//                                                                 <td>    {i + 1}</td>

//                                                                 <td>
//                                                                     {salaries.employee_name}
//                                                                 </td>
//                                                                 <td>
//                                                                     {salaries.designation_name_promotion}
//                                                                 </td>
//                                                                 <td>
//                                                                     {`${salaries.Payroll} (${salaries.salary})`}
//                                                                 </td>
//                                                                 <td>
//                                                                     0
//                                                                 </td>
//                                                                 <td>
//                                                                     {salaries.salary}
//                                                                 </td>
//                                                                 <td>

//                                                                 </td>
//                                                                 <td>

//                                                                 </td>

//                                                                 <td>

//                                                                 </td>

//                                                                 <td>

//                                                                 </td>
//                                                                 <td>

//                                                                 </td>
//                                                                 <td>

//                                                                 </td>
//                                                                 <td>

//                                                                 </td>
//                                                                 <td>

//                                                                 </td>
//                                                                 <td>

//                                                                 </td>
//                                                                 <td>

//                                                                 </td>




//                                                             </tr>
//                                                         )

//                                                         )



//                                                     }
//                                                 </tbody>

//                                             </table>
//                                         }
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SalaryCreate;

// 'use client' 
 //ismile

// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';

// const SalaryCreate = () => {


//     const [created, setCreated] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('userId') || '';
//         }
//         return '';
//     });

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedUserId = localStorage.getItem('userId');
//             setCreated(storedUserId);
//         }
//     }, []);

//     const [fromDate, setFromDate] = useState('');
//     const [bonus, setBonus] = useState(0);
//     const [paidAmount, setPaidAmount] = useState(0);

//     const [months, setMonths] = useState([]);
//     const [designation, setDesignation] = useState('');
//     const [month, setMonth] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [searchResults, setSearchResults] = useState([]);
//     const [error, setError] = useState(null);


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
//         // const formattedDate = formatDate(selectedDate);
//         setFromDate(selectedDate);
//     };

//     useEffect(() => {
//         const currentDate = new Date();
//         setFromDate(currentDate);

//     }, []);

//     useEffect(() => {
//         const currentYear = new Date().getFullYear();
//         const currentMonth = new Date().getMonth(); // 0-based index
//         const monthNames = [
//             "January", "February", "March", "April", "May", "June",
//             "July", "August", "September", "October", "November", "December"
//         ];

//         // Create an array of months up to the current month
//         const monthOptions = [];
//         for (let i = 0; i <= currentMonth; i++) {
//             monthOptions.push({
//                 value: `${currentYear}-${i + 1 < 10 ? `0${i + 1}` : i + 1}`,
//                 label: `${monthNames[i]} ${currentYear}`
//             });
//         }

//         setMonths(monthOptions);
//     }, []);

//     const { data: designations = [], isLoading: isDesignationsLoading } = useQuery({
//         queryKey: ['designations'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_list`)
//             const data = await res.json()
//             return data
//         }
//     });

//     const { data: salaries = [] } = useQuery({
//         queryKey: ['salaries'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_all`)
//             const data = await res.json()
//             return data
//         }
//     });

//     const getTotalDaysInMonth = (year, month) => {
//         return new Date(year, month, 0).getDate();
//     };

//     const salary_search = () => {
//         setLoading(true);

//         if (month === '') {
//             alert('select a month')
//             return
//         }

//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_search`, {
//             designation
//         })
//             .then(response => {
//                 const results = response.data.results;
//                 const monthYear = month.split('-');
//                 const totalDays = getTotalDaysInMonth(Number(monthYear[0]), Number(monthYear[1]));

//                 const updatedResults = results.map(result => ({
//                     ...result,
//                     totalDays
//                 }));

//                 setSearchResults(updatedResults);
//                 setError(null);
//                 setLoading(false);
//                 if (results.length === 0) {
//                     alert('Nothing found!');
//                 }
//             })
//             .catch(error => {
//                 setError("An error occurred during search.");
//                 setSearchResults([]);
//                 setLoading(false);
//             });
//     };

//     console.log(typeof (bonus))


//     const { data: attendance = [] } = useQuery({
//         queryKey: ['attendance'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance_all/attendance_all`)
//             const data = await res.json()
//             return data
//         }
//     });

//     const filteredAttendance = attendance.filter(att => {
//         const checktimeMonthYear = att.checktime.substring(0, 7);
//         return checktimeMonthYear === month;
//     });

//     console.log(filteredAttendance)




//     const matchLengths = salaries.map(emp => {
//         const matchCount = attendance.filter(att => att.user_id === emp.user_id).length;
//         return { user_id: emp.user_id, match_length: matchCount };
//     });

//     console.log(matchLengths);

//     const { data: holidays = [] } = useQuery({
//         queryKey: ['holidays'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/yearly_holiday/yearly_holiday_all`)
//             const data = await res.json()
//             return data
//         }
//     });


//     const filteredAttendances = holidays.filter(att => {
//         const checktimeMonthYear = att.start_date.substring(0, 7);
//         return checktimeMonthYear === month;
//     });

//     console.log(filteredAttendances)
//     console.log(filteredAttendances.length)

//     const { data: leavesDays = [] } = useQuery({
//         queryKey: ['leavesDays'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_application/leave_application_all`)
//             const data = await res.json()
//             return data
//         }
//     });
//     console.log(leavesDays.filter(leave => leave.application_status === 2))

//     const leaveApproveCount = leavesDays.filter(leave => leave.application_status === 2)

//     console.log(leaveApproveCount)

//     const { data: leavesDaysApproved = [] } = useQuery({
//         queryKey: ['leavesDaysApproved'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_approved/leave_approved_all`)
//             const data = await res.json()
//             return data
//         }
//     });

//     const matchLength = leaveApproveCount.map(emp => {
//         const matchCount = leavesDaysApproved.filter(att => att.leave_application_id === emp.id).length;
//         return { user_id: emp.whose_leave, match_length: matchCount };
//     });

//     console.log(matchLength)


//     // Function to handle form submission
//     const handleSubmit = (event) => {
//         // Collect the form data


//         event.preventDefault();


//         const formatDate = (date) => {
//             const d = new Date(date);
//             const year = d.getFullYear();
//             const month = ('0' + (d.getMonth() + 1)).slice(-2);
//             const day = ('0' + d.getDate()).slice(-2);
//             return `${year}-${month}-${day}`;
//         };
//         const formToSubmit = searchResults.map(salary => ({
//             user_id: salary.user_id,
//             salary_month: `${month}-10`,
//             salary_date: fromDate ? formatDate(fromDate) : '',
//             created_by: created,
//             due: salary.salary,
//             paid_amount: salary.salary + parseFloat(bonus),
//             paid_by: document.querySelector('select[name="paid_by"]').value
//         }));

//         console.log(formToSubmit)

//         axios.post('http://192.168.0.107:5002/Admin/salary/salary_create', formToSubmit)
//             .then(response => {
//                 alert('Data submitted successfully!');
//                 // Optionally handle success (e.g., reset the form, show a message, etc.)
//             })
//             .catch(error => {
//                 alert('An error occurred while submitting data.');
//                 console.error('Error:', error);
//                 // Optionally handle error (e.g., show an error message, etc.)
//             });
//     };


//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card mb-4'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Salary Create</h5>
//                                 </div>
//                                 <div className="card-body">
//                                     <form >
//                                         <div className="col-md-10 offset-md-1">
//                                             <div className="form-group row">
//                                                 <label className="col-form-label col-md-2"><strong>Designation:</strong></label>
//                                                 <div className="col-md-4">
//                                                     <select
//                                                         value={designation} onChange={(e) => setDesignation(e.target.value)}
//                                                         name="statusFilter"
//                                                         className="form-control form-control-sm integer_no_zero"
//                                                     >
//                                                         <option value="">Select Designation</option>
//                                                         {
//                                                             designations.map(designation =>
//                                                                 <option key={designation.id} value={designation.id}>
//                                                                     {designation.designation_name}
//                                                                 </option>
//                                                             )
//                                                         }
//                                                     </select>
//                                                 </div>

//                                                 <label className="col-form-label col-md-2"><strong>Month:</strong></label>
//                                                 <div className="col-md-4">
//                                                     <select
//                                                         value={month} onChange={(e) => setMonth(e.target.value)}
//                                                         name="statusFilter"
//                                                         className="form-control form-control-sm integer_no_zero"
//                                                     >
//                                                         <option value="">Select Month</option>
//                                                         {months.map((month, index) => (
//                                                             <option key={index} value={month.value}>
//                                                                 {month.label}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <div className="offset-md-2 col-md-8 float-left">
//                                                 <input type="button" name="search" className="btn btn-sm btn-info" value="Search"
//                                                     onClick={salary_search}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className='card'>
//                     <form action="" onSubmit={handleSubmit}>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employee Salary Generate</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <div className="offset-md-3 col-sm-6">
//                                             <input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="card-body">


//                                     <div className='table-responsive'>
//                                         {
//                                             searchResults.length > 0 &&
//                                             <table className="table table-bordered table-hover table-striped table-sm">
//                                                 <thead>
//                                                     <tr>
//                                                         <th>
//                                                             <input type="checkbox" name="" id="" />
//                                                         </th>
//                                                         <th>Serial</th>
//                                                         <th>Name</th>
//                                                         <th>Designation</th>
//                                                         <th>Payroll</th>
//                                                         <th>Previous Due</th>
//                                                         <th>Present Salary</th>
//                                                         <th>Total Payable Amount</th>
//                                                         <th>Bonus</th>
//                                                         <th>Paid Amount</th>
//                                                         <th>Due Amount</th>
//                                                         <th>Total Day</th>
//                                                         <th>Working Day</th>
//                                                         <th>Absent & Present</th>
//                                                         <th>Holiday & Leave</th>
//                                                         <th>Paid By:</th>
//                                                         <th>Salary Date</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {loading ?
//                                                         <tr>
//                                                             <td colSpan="16" className="text-center">
//                                                                 <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
//                                                             </td>
//                                                         </tr>
//                                                         :
//                                                         searchResults.map((salary, i) => (
//                                                             <tr key={salary.id}>
//                                                                 <th>
//                                                                     <input type="checkbox" name="" id="" />
//                                                                 </th>
//                                                                 <td>{i + 1}</td>
//                                                                 <td>{salary.employee_name}

//                                                                     <input type="text" className='d-none' name='user_id'
//                                                                     value={salary.user_id}
//                                                                     />
//                                                                 </td>
//                                                                 <td>{salary.designation_name_promotion}</td>
//                                                                 <td>{`${salary.Payroll} (${salary.salary})`}</td>
//                                                                 <td>0</td>
//                                                                 <td>{salary.salary}</td>
//                                                                 <td>
//                                                                     {
//                                                                         ((salary.salary / salary.totalDays) * ((filteredAttendances.length) + (matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0) + (matchLengths.find(item => item.user_id === salary.user_id)?.match_length || 0))).toFixed(2)
//                                                                     }
//                                                                 </td>
//                                                                 <td>
//                                                                     <input
//                                                                         value={bonus} onChange={(e) => setBonus(e.target.value)}
//                                                                         type="number" name="bonus" class="form-control form-control-sm text-right bonus" id="bonus" />
//                                                                 </td>
//                                                                 <td>
//                                                                     <input type="number"


//                                                                         name="paid_amount" class="form-control form-control-sm text-right paid_amount" id="paid_amount"
//                                                                         value={salary.salary + parseFloat(bonus)}

//                                                                     />
//                                                                 </td>

//                                                                 <td>
//                                                                     0
//                                                                 <input type="number"
//                                                                     name="due" class="form-control form-control-sm text-right due d-none" id="due"
//                                                                     value={0}
//                                                                 />
//                                                                 </td>
//                                                                 <td>{salary.totalDays}</td>
//                                                                 <td>

//                                                                     {
//                                                                         Math.abs(
//                                                                             (filteredAttendances.length +
//                                                                                 (matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0) -
//                                                                                 salary.totalDays)
//                                                                         )
//                                                                     }
//                                                                 </td>
//                                                                 <td>
//                                                                     Absent: {(Math.abs(
//                                                                         (filteredAttendances.length +
//                                                                             (matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0) -
//                                                                             salary.totalDays)
//                                                                     ))



//                                                                         - (matchLengths.find(item => item.user_id === salary.user_id)?.match_length || 0)
//                                                                     }

//                                                                     <br />
//                                                                     Present:                                {matchLengths.find(item => item.user_id === salary.user_id)?.match_length || 0}
//                                                                 </td>
//                                                                 <td>
//                                                                     Holiday: {filteredAttendances.length}
//                                                                     <br />
//                                                                     Leave: {matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0}
//                                                                 </td>
//                                                                 <td>
//                                                                     <select name="paid_by" id="" class="form-control form-control-sm" required="">
//                                                                         <option value="2">Cash</option>
//                                                                         <option value="5">Bank (Primary)</option>
//                                                                         <option value="6">Bank (High School)</option>
//                                                                     </select>
//                                                                 </td>
//                                                                 <td>
//                                                                     <input
//                                                                         className="form-control"
//                                                                         type="text"
//                                                                         id="fromDate"
//                                                                         value={fromDate ? formatDate(fromDate) : ''}
//                                                                         onClick={handleTextInputClick}
//                                                                         readOnly
//                                                                     />
//                                                                     <input
//                                                                         name='salary_date'
//                                                                         type="date"
//                                                                         id="dateInputFrom"
//                                                                         value={fromDate ? fromDate.toString().split('T')[0] : ''}
//                                                                         onChange={handleDateChangeFrom}
//                                                                         style={{ position: 'absolute', bottom: '20px', right: '0', visibility: 'hidden' }}
//                                                                     />
//                                                                 </td>
//                                                             </tr>
//                                                         ))}
//                                                 </tbody>
//                                             </table>
//                                         }
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SalaryCreate;



