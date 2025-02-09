'use client' 
 //ismile

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const SalaryUpdate = ({ id }) => {


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

    const [brandData, setBrandData] = useState({
        salary_month: '', salary_date: '',
        due: '', paid_amount: '', paid_by: '',
        modified_by: created
    });

    const { data: account_head = []
    } = useQuery({
        queryKey: ['account_head'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head/account_head_list`)

            const data = await res.json()
            return data
        }
    })



    const [fromDate, setFromDate] = useState('');
    const [bonus, setBonus] = useState(0);


    const [months, setMonths] = useState([]);
    const [designation, setDesignation] = useState('');
    const [month, setMonth] = useState('');
    const [loading, setLoading] = useState(false);


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




    const { data: attendance = [] } = useQuery({
        queryKey: ['attendance'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance_all/attendance_all`)
            const data = await res.json()
            return data
        }
    });



    const { data: salaries = [] } = useQuery({
        queryKey: ['salaries'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_list/${id}`)
            const data = await res.json()
            return data
        }
    });


    console.log(salaries)

    const user_id = salaries[0]?.user_id

    const salaryMonths = salaries[0]?.salary_month

    const { data: searchResults = [] } = useQuery({
        queryKey: ['searchResults'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_details/${user_id}`)
            const data = await res.json()
            return data
        }
    });




    const totalDay = salaries[0]?.totalDays







    const salariesMonths = salaryMonths?.slice(0, 7)
    console.log(salariesMonths)



    console.log(month)



    const matchLengths = salaries.map(emp => {
        const matchCount = attendance.filter(att => att.user_id === emp.user_id).length;
        return { user_id: emp.user_id, match_length: matchCount };
    });

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
        return checktimeMonthYear === brandData?.salary_month?.slice(0, 7);
    });

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
        const month = emp.start_date.slice(0, 7); // Get the month in 'YYYY-MM' format
        const matchCount = leavesDaysApproved.filter(att => {
            const attMonth = brandData?.salary_month?.slice(0, 7); // Get the month in 'YYYY-MM' format
            return att.leave_application_id === emp.id && attMonth === month;
        }).length;
    
        return { user_id: emp.whose_leave, month, match_length: matchCount };
    });
    
console.log(leavesDaysApproved)
console.log(matchLength)
console.log(leaveApproveCount)



    const formatDates = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    console.log(formatDates(fromDate))





    useEffect(() => {

        setBrandData({

            salary_month: salaries[0]?.salary_month,
            salary_date: formatDates(fromDate),
            due: salaries[0]?.due,
            paid_amount: salaries[0]?.paid_amount,
            paid_by: salaries[0]?.paid_by,
            modified_by: created,


        });

    }, [salaries, created, fromDate]);

    console.log(brandData)
    const salariesMonth = brandData?.salary_month?.slice(0, 7)
    console.log(salariesMonth)

    const brand_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...brandData }
        attribute[name] = value



        setBrandData(attribute)

    };



    const handleSubmit = (event) => {
        event.preventDefault();



        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/salary/salary_edit/${id}`, brandData)
            .then(response => {
                alert('Data submitted successfully!');
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
    if (absentMonth === brandData?.salary_month?.slice(0, 7)) {
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
                    <div className='card mb-4 d-none'>
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
                                                        value={brandData?.salary_month?.slice(0, 7)}
                                                        onChange={(e) => setMonth(e.target.value)}
                                                        // value={salariesMonths}
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
                                                // onClick={salary_search}
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
                                        <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employee Salary Edit</h5>
                                        <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                            <div className="offset-md-3 col-sm-6">
                                                <input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
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
                                                                        <input type="checkbox" name="salaryCheckbox" id="" />
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
                                                                            ((salary.salary) - ((salary.salary / totalDay) * parseFloat(absencesPerUser[salary.user_id] || 0) ))
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            value={bonus} onChange={(e) => setBonus(e.target.value)}
                                                                            type="number" name="bonus" class="form-control form-control-sm text-right bonus" id="bonus" />
                                                                    </td>
                                                                    <td>
                                                                        <input type="number"
                                                                            onChange={brand_input_change}
                                                                            name="paid_amount" class="form-control form-control-sm text-right paid_amount" id="paid_amount"
                                                                            value={parseFloat(brandData.paid_amount) + parseFloat(bonus)}

                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        {(salary.salary) - parseFloat(brandData.paid_amount) + parseFloat(bonus)}
                                                                        <input type="number"
                                                                            onChange={brand_input_change}
                                                                            name="due" class="form-control form-control-sm text-right due d-none" id="due"
                                                                            value={parseFloat(brandData.paid_amount) + parseFloat(bonus) - (salary.salary)}
                                                                        />
                                                                    </td>
                                                                    <td>{totalDay}</td>
                                                                    <td>

                                                                        {
                                                                            Math.abs(
                                                                                (filteredAttendances.length +
                                                                                    (matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0) -
                                                                                    totalDay)
                                                                            )
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        Absent:

                                                                        {
                                                                            absencesPerUser[salary.user_id] || 0
                                                                        }
                                                                         {/* {(Math.abs(
                                                                            (filteredAttendances.length +
                                                                                (matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0) -
                                                                                totalDay)
                                                                        ))



                                                                            - (matchLengths.find(item => item.user_id === salary.user_id)?.match_length || 0)
                                                                        } */}

                                                                        <br />
                                                                        Present:                                {matchLengths.find(item => item.user_id === salary.user_id)?.match_length || 0}
                                                                    </td>
                                                                    <td>
                                                                        Holiday: {filteredAttendances.length}
                                                                        <br />
                                                                        {/* Leave: {matchLength.find(item => item.user_id === salary.user_id)?.match_length || 0} */}
                                                                        Leave: {matchLength.find(item =>
                                                                            item.user_id === salary.user_id && item.month === brandData?.salary_month?.slice(0, 7)
                                                                        )?.match_length || 0}
                                                                    </td>
                                                                    <td>
                                                                        <select name="paid_by" id=""
                                                                            value={brandData.paid_by}
                                                                            onChange={brand_input_change}
                                                                            class="form-control form-control-sm" required="">
                                                                            {
                                                                                account_head.map(account =>

                                                                                    <>
                                                                                        <option value={account.id}>{account.account_head_name}</option>
                                                                                    </>
                                                                                )
                                                                            }
                                                                            {/* <option value="2">Cash</option>
                                                                        <option value="5">Bank (Primary)</option>
                                                                        <option value="6">Bank (High School)</option> */}
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

export default SalaryUpdate;