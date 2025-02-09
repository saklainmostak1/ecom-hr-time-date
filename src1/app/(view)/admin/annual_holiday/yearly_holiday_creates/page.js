'use client'
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const YearlyHolidayCreates = () => {


    const { data: holiday_categorys = [], isLoading, refetch
    } = useQuery({
        queryKey: ['holiday_category'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/holiday_category/holiday_category_all`)

            const data = await res.json()
            return data
        }
    })


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

    const router = useRouter()
    const [formData, setFormData] = useState([{
        holiday_category: '', start_date: '', holiday_name: '', end_date: '', created_by: created_by

    }]);



    const handleChange = (event) => {

        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value

        const holiday_category = attribute['holiday_category']
        if (holiday_category) {
            setholiday_category('')
        }

        const holiday_name = attribute['holiday_name']
        if (holiday_name) {
            setholiday_name('')
        }

        setFormData(attribute)

    };


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
            start_date: formattedDatabaseDate // Update the dob field in the state
        }));


    };

    console.log(selectedDate);

    useEffect(() => {
        const dob = formData.start_date;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [formData]);

    const [selectedDates, setSelectedDates] = useState([]);
    const [formattedDisplayDates, setFormattedDisplayDates] = useState('');

    const handleDateSelections = (event) => {
        const inputDate = event.target.value; // Directly get the value from the input

        const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
        const month = String(inputDate.split('-')[1]).padStart(2, '0');
        const year = String(inputDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;
        setSelectedDates(formattedDate);
        setFormData(prevData => ({
            ...prevData,
            end_date: formattedDatabaseDate // Update the dob field in the state
        }));


    };

    console.log(selectedDates);

    useEffect(() => {
        const dob = formData.end_date;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDates(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [formData]);



    // const user_create = (event) => {
    //     event.preventDefault();


    //     const postData = dates.map(date => ({
    //         holiday_category: formData.holiday_category,
    //         start_date: date,
    //         holiday_name: formData.holiday_name,
    //         end_date: date,
    //         created_by: created_by
    //     }));


    //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/yearly_holiday/yearly_holiday_create`, {
    //         method: 'POST',
    //         headers: {
    //             'content-type': 'application/json',
    //         },
    //         body: JSON.stringify(postData),
    //     })
    //         .then((Response) => {
    //             Response.json();
    //             console.log(Response);
    //             if (Response.ok === true) {
    //                 if (typeof window !== 'undefined') {

    //                     sessionStorage.setItem("message", "Data saved successfully!");
    //                 }
    //                 // router.push('/Admin/company/company_all');
    //             }
    //         })
    //         .then((data) => {
    //             console.log(data);
    //         })
    //         .catch((error) => console.error(error));
    // };

    const [holiday_category, setholiday_category] = useState([])
    const [holiday_name, setholiday_name] = useState([])

    const user_create = (event) => {
        event.preventDefault();

        if (!formData.holiday_category) {
            setholiday_category('Holiday Category is Required')
            return
        }
        if (!formData.holiday_name) {
            setholiday_name('Holiday Name is Required')
            return
        }

        // Generate an array of dates between start_date and end_date
        const generateDateRange = (startDate, endDate) => {
            const dates = [];
            let currentDate = new Date(startDate);
            const end = new Date(endDate);

            while (currentDate <= end) {
                dates.push(new Date(currentDate).toISOString().split('T')[0]); // Format date as YYYY-MM-DD
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return dates;
        };

        // Only proceed if both start_date and end_date are available
        let datesToSend = [];
        if (formData.start_date && formData.end_date) {
            datesToSend = generateDateRange(formData.start_date, formData.end_date);
        } else {
            // Use all selected dates if no range is specified
            datesToSend = dates;
        }

        const postData = datesToSend.map(date => ({
            holiday_category: formData.holiday_category,
            start_date: date,
            holiday_name: formData.holiday_name,
            end_date: date,
            created_by: created_by
        }));

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/yearly_holiday/yearly_holiday_create`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
            .then((response) => {

                response.json()
                if (response.ok === true) {
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem("message", "Data saved successfully!");
                    }
                    router.push('/Admin/annual_holiday/annual_holiday_all');
                }
            })
            .then((data) => {
                console.log(data);

            })
            .catch((error) => console.error(error));
    };





    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2016; year <= currentYear; year++) {
        years.push(year);
    }


    const [selectedWeekday, setSelectedWeekday] = useState('');
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [dates, setDates] = useState([]);

    const handleWeekdayChange = (event) => {
        setSelectedWeekday(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    useEffect(() => {
        if (selectedWeekday && selectedYear) {
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayIndex = daysOfWeek.indexOf(selectedWeekday);
            const year = parseInt(selectedYear);

            const datesForWeekday = [];
            let date = new Date(year, 0, 1);

            // Find the first occurrence of the selected weekday
            while (date.getDay() !== dayIndex) {
                date.setDate(date.getDate() + 1);
            }

            // Get all occurrences of the selected weekday in the year
            while (date.getFullYear() === year) {
                const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
                datesForWeekday.push(formattedDate);
                date.setDate(date.getDate() + 7);
            }

            setDates(datesForWeekday);
        }
    }, [selectedWeekday, selectedYear]);

    console.log(dates)

    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">Annual Holiday Create</h5>
                                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                                    <Link href="/Admin/annual_holiday/annual_holiday_all" className="btn btn-sm btn-info">Back to Annual Holiday List</Link>
                                </div>
                            </div>

                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div className="card-body">
                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={user_create}>



                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Holiday Category:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <select
                                            onChange={handleChange}
                                            name="holiday_category" class="form-control form-control-sm  required integer_no_zero" id="gender_name">
                                            <option value="" >Select Holiday Category</option>
                                            {
                                                holiday_categorys.map(holiday_category =>

                                                    <>
                                                        <option value={holiday_category.id}>{holiday_category.name}</option>

                                                    </>
                                                )
                                            }
                                        </select>
                                        {
                                            holiday_category && <p className='text-danger'>{holiday_category}</p>
                                        }

                                    </div>
                                    </div>
                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Holiday Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input required=""
                                            onChange={handleChange}
                                            class="form-control form-control-sm required mb-2" id="title" placeholder="Holiday Name" type="text" name="holiday_name" />

                                        {
                                            holiday_name && <p className='text-danger'>{holiday_name}</p>
                                        }
                                    </div>
                                    </div>


                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> Start Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input
                                            type="text"
                                            readOnly0
                                            defaultValue={formattedDisplayDate}
                                            onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
                                            placeholder="dd-mm-yyyy"
                                            className="form-control form-control-sm mb-2"
                                            style={{ display: 'inline-block', }}
                                        />
                                        <input
                                            name='start_date'
                                            type="date"
                                            id={`dateInput-nt`}
                                            onChange={(e) => handleDateSelection(e)}
                                            style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                        />


                                    </div>
                                    </div>





                                    <div class="form-group row"><label class="col-form-label font-weight-bold col-md-3"> End Date:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label><div class="col-md-6">
                                        <input
                                            type="text"
                                            readOnly0
                                            defaultValue={formattedDisplayDates}
                                            onClick={() => document.getElementById(`dateInput-ntn`).showPicker()}
                                            placeholder="dd-mm-yyyy"
                                            className="form-control form-control-sm mb-2"
                                            style={{ display: 'inline-block', }}
                                        />
                                        <input
                                            name='end_date'
                                            type="date"
                                            id={`dateInput-ntn`}
                                            onChange={(e) => handleDateSelections(e)}
                                            style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                        />


                                    </div>
                                    </div>
                                    {formData.holiday_category && (
                                        <div className="form-group row show-weekday">
                                            <label className="col-form-label font-weight-bold col-md-3">Weekly Holiday:
                                                <small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small>
                                            </label>
                                            <div className="col-md-6">
                                                <div className="row">
                                                    <div className="col-md-6 float-left">
                                                        <select name="weekday" className="form-control form-control-sm trim integer_no_zero" id="weekday" onChange={handleWeekdayChange}>
                                                            <option value="">Select week day</option>
                                                            <option value="Friday">Friday</option>
                                                            <option value="Monday">Monday</option>
                                                            <option value="Saturday">Saturday</option>
                                                            <option value="Sunday">Sunday</option>
                                                            <option value="Thursday">Thursday</option>
                                                            <option value="Tuesday">Tuesday</option>
                                                            <option value="Wednesday">Wednesday</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-6 float-right">
                                                        <select name="year" className="form-control form-control-sm trim integer_no_zero" id="year" onChange={handleYearChange}>
                                                            {years.map(year => (
                                                                <option key={year} value={year}>For {year}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-group row">
                                        <div className="offset-md-3 col-sm-6">
                                            <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                        </div>

                                        <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
                                            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                                        </div>

                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YearlyHolidayCreates;