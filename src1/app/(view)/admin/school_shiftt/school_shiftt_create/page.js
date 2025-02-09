// 'use client' 
 //ismile
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';

// const SchoolShiftCreate = () => {


// 	const [start_time, setstart_time] = useState('');
// 	const [late_time, setlate_time] = useState('');
// 	const [end_time, setend_time] = useState('');
// 	const [early_end_time, setearly_end_time] = useState('');
// 	const [errorMessage, setErrorMessage] = useState('');
// 	const [errorMessageStartTime, setErrorMessageStartTime] = useState('');


// 	const handleTimeChange = (event, setTime) => {
// 		const dateTimeValue = event.target.value;
// 		const timeValue = new Date(dateTimeValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// 		setTime(timeValue);
// 		if (start_time) {
// 			setErrorMessageStartTime()
// 		}

// 	};

// 	const [userId, setUserId] = useState(() => {
// 		if (typeof window !== 'undefined') {
// 			return localStorage.getItem('userId') || '';
// 		}
// 		return '';
// 	});

// 	useEffect(() => {
// 		if (typeof window !== 'undefined') {
// 			const storedUserId = localStorage.getItem('userId');
// 			setUserId(storedUserId);
// 		}
// 	}, []);

// 	console.log(start_time)
// 	const router = useRouter()
// 	const created_by = userId
// 	const user_create = (event) => {
// 		event.preventDefault();
// 		const form = event.target;
// 		const name = form.name.value;

// 		if (!name) {
// 			setErrorMessage('Name is required.');
// 			return;
// 		}
// 		if (!start_time) {
// 			setErrorMessageStartTime('This Name is required.');
// 			return;
// 		}

// 		const schoolShift = {
// 			name,
// 			start_time,
// 			late_time,
// 			end_time,
// 			early_end_time,
// 			created_by

// 		};

// 		fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_create`, {
// 			method: 'POST',
// 			headers: {
// 				'content-type': 'application/json',
// 			},
// 			body: JSON.stringify(schoolShift),
// 		})
// 			.then((Response) => {
// 				Response.json()
// 				console.log(Response)
// 				if (Response.ok === true) {
// 					if(typeof window !== 'undefined'){

// 						sessionStorage.setItem("message", "Data saved successfully!");
// 					}
// 					router.push('/Admin/school_shift/school_shift_all')
// 				}
// 			})
// 			.then((data) => {
// 				console.log(data);

// 			})
// 			.catch((error) => console.error(error));
// 	};

// 	return (
// 		<div className="container-fluid">
// 			<div className="row">
// 				<div className='col-12 p-4'>
// 					<div className='card'>
// 						<div className="body-content bg-light">
// 							<div className="border-primary shadow-sm border-0">
// 								<div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
// 									<h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create School Shift</h5>
// 									<div className="card-title font-weight-bold mb-0 card-header-color float-right">
// 										<Link href={`/Admin/school_shift/school_shift_all?page_group`} className="btn btn-sm btn-info">Back School Shift List</Link>
// 									</div>
// 								</div>
// 								<div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
// 									(<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
// 								</div>
// 								<form action="" onSubmit={user_create}>
// 									<div className="card-body">
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<input type="text" name="name" className="form-control form-control-sm  alpha_space unique_name" id="name" placeholder="Enter Name" />
// 												{
// 													errorMessage && <p className='text-danger'>{errorMessage}</p>
// 												}
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Start Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<input
// 													type="text"
// 													readOnly
// 													name='start_time'
// 													value={start_time}
// 													onClick={() => document.getElementById(`dateInput-n1`).showPicker()}

// 													placeholder="dd-mm-yyyy"
// 													className="form-control form-control-sm mb-2"
// 													style={{ display: 'inline-block', }}
// 												/>
// 												<input
// 													type="datetime-local"
// 													id={`dateInput-n1`}
// 													onChange={(e) => handleTimeChange(e, setstart_time)}
// 													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

// 												/>
// 												{
// 													errorMessageStartTime && <p className='text-danger'>{errorMessageStartTime}</p>
// 												}
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Late Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<input
// 													type="text"
// 													readOnly
// 													value={late_time}
// 													name='late_time'
// 													onClick={() => document.getElementById(`dateInput-n2`).showPicker()}

// 													placeholder="dd-mm-yyyy"
// 													className="form-control form-control-sm mb-2"
// 													style={{ display: 'inline-block', }}
// 												/>
// 												<input
// 													type="datetime-local"
// 													id={`dateInput-n2`}
// 													onChange={(e) => handleTimeChange(e, setlate_time)}
// 													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

// 												/>
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<input
// 													type="text"
// 													readOnly
// 													value={end_time}
// 													name='end_time'
// 													onClick={() => document.getElementById(`dateInput-n3`).showPicker()}

// 													placeholder="dd-mm-yyyy"
// 													className="form-control form-control-sm mb-2"
// 													style={{ display: 'inline-block', }}
// 												/>
// 												<input
// 													type="datetime-local"
// 													id={`dateInput-n3`}
// 													onChange={(e) => handleTimeChange(e, setend_time)}
// 													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

// 												/>
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Early End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<input
// 													type="text"
// 													readOnly
// 													value={early_end_time}
// 													name='early_end_time'
// 													onClick={() => document.getElementById(`dateInput-n4`).showPicker()}

// 													placeholder="dd-mm-yyyy"
// 													className="form-control form-control-sm mb-2"
// 													style={{ display: 'inline-block', }}
// 												/>
// 												<input
// 													type="datetime-local"
// 													id={`dateInput-n4`}
// 													onChange={(e) => handleTimeChange(e, setearly_end_time)}
// 													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

// 												/>
// 											</div>
// 										</div>

// 										<div className="form-group row">
// 											<div className="offset-md-3 col-sm-6">
// 												<input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
// 											</div>
// 										</div>
// 									</div>
// 								</form>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default SchoolShiftCreate;

// 'use client' 
 //ismile
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';

// const SchoolShiftCreate = () => {


// 	const [start_time, setstart_time] = useState('');
// 	const [late_time, setlate_time] = useState('');
// 	const [end_time, setend_time] = useState('');
// 	const [early_end_time, setearly_end_time] = useState('');
// 	const [errorMessage, setErrorMessage] = useState('');
// 	const [errorMessageStartTime, setErrorMessageStartTime] = useState('');


// 	const { data: companys = [], isLoading, refetch
// 	} = useQuery({
// 		queryKey: ['companys'],
// 		queryFn: async () => {
// 			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company/company_all`)

// 			const data = await res.json()
// 			return data
// 		}
// 	})

// 	const { data: branchs = [],
// 	} = useQuery({
// 		queryKey: ['branchs'],
// 		queryFn: async () => {
// 			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`)

// 			const data = await res.json()
// 			return data
// 		}
// 	})



// 	const [account_head_name, setAccount_head_name] = useState([])
// 	const [opening_balance, setOpening_balance] = useState([])
// 	const [opening_balances, setOpening_balances] = useState([])

// 	const handleTimeChange = (event, setTime) => {
// 		const dateTimeValue = event.target.value;
// 		const timeValue = dateTimeValue
// 		setTime(timeValue);


// 		if (start_time) {
// 			setErrorMessageStartTime('')
// 		}
// 		if (late_time) {
// 			setOpening_balance('')
// 		}
// 		if (end_time) {
// 			setAccount_head_name('')
// 		}
// 		if (early_end_time) {
// 			setOpening_balances('')
// 		}


// 	};

// 	const [userId, setUserId] = useState(() => {
// 		if (typeof window !== 'undefined') {
// 			return localStorage.getItem('userId') || '';
// 		}
// 		return '';
// 	});

// 	useEffect(() => {
// 		if (typeof window !== 'undefined') {
// 			const storedUserId = localStorage.getItem('userId');
// 			setUserId(storedUserId);
// 		}
// 	}, []);

// 	console.log(start_time)
// 	const router = useRouter()
// 	const created_by = userId
// 	const user_create = (event) => {
// 		event.preventDefault();
// 		const form = event.target;
// 		const name = form.name.value;

// 		if (!name) {
// 			setErrorMessage('Name is required.');
// 			return;
// 		}
// 		if (!start_time) {
// 			setErrorMessageStartTime('This Name is required.');
// 			return;
// 		}

// 		if (!late_time) {
// 			setOpening_balance('This Name is required.')
// 			return
// 		}
// 		if (!end_time) {
// 			setAccount_head_name('This Name is required.')
// 			return
// 		}
// 		if (!early_end_time) {
// 			setOpening_balances('This Name is required.')
// 			return
// 		}

// 		const schoolShift = {
// 			name,
// 			start_time,
// 			late_time,
// 			end_time,
// 			early_end_time,
// 			created_by

// 		};

// 		fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_create`, {
// 			method: 'POST',
// 			headers: {
// 				'content-type': 'application/json',
// 			},
// 			body: JSON.stringify(schoolShift),
// 		})
// 			.then((Response) => {
// 				Response.json()
// 				console.log(Response)
// 				if (Response.ok === true) {
// 					if (typeof window !== 'undefined') {

// 						sessionStorage.setItem("message", "Data saved successfully!");
// 					}
// 					router.push('/Admin/shift/shift_all')
// 				}
// 			})
// 			.then((data) => {
// 				console.log(data);

// 			})
// 			.catch((error) => console.error(error));
// 	};

// 	console.log(start_time)

// 	return (
// 		<div className="container-fluid">
// 			<div className="row">
// 				<div className='col-12 p-4'>
// 					<div className='card'>
// 						<div className="body-content bg-light">
// 							<div className="border-primary shadow-sm border-0">
// 								<div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
// 									<h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create School Shift</h5>
// 									<div className="card-title font-weight-bold mb-0 card-header-color float-right">
// 										<Link href={`/Admin/shift/shift_all?page_group`} className="btn btn-sm btn-info">Back School Shift List</Link>
// 									</div>
// 								</div>
// 								<div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
// 									(<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
// 								</div>
// 								<form action="" onSubmit={user_create}>
// 									<div className="card-body">
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Company Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<select

// 													required="" name="whose_leave" class="form-control form-control-sm  trim integer_no_zero whose_leave" id="whose_leave">
// 													<option value="">Select Company</option>
// 													{
// 														companys.map(company =>

// 															<>
// 																<option value={company.id}>{company.company_name}</option>
// 															</>
// 														)
// 													}

// 												</select>
// 												{/* {
// 													errorMessage && <p className='text-danger'>{errorMessage}</p>
// 												} */}
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Branch Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<select

// 													required="" name="whose_leave" class="form-control form-control-sm  trim integer_no_zero whose_leave" id="whose_leave">
// 													<option value="">Select Branch</option>
// 													{
// 														branchs.map(branch =>
// 															<>
// 																<option value={branch.id}>{branch.branch_name}</option>
// 															</>

// 														)
// 													}

// 												</select>
// 												{/* {
// 													errorMessage && <p className='text-danger'>{errorMessage}</p>
// 												} */}
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<input type="text" name="name" className="form-control form-control-sm  alpha_space unique_name" id="name" placeholder="Enter Name" />
// 												{
// 													errorMessage && <p className='text-danger'>{errorMessage}</p>
// 												}
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Start Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">

// 												<input
// 													type="text"
// 													readOnly
// 													name="start_time"
// 													value={start_time}
// 													onClick={() => document.getElementById('dateInput-n1').showPicker()}
// 													placeholder="HH:MM"
// 													className="form-control form-control-sm mb-2"
// 													style={{ display: 'inline-block' }}
// 												/>
// 												<input
// 													type="time"
// 													id="dateInput-n1"
// 													onChange={(e) => handleTimeChange(e, setstart_time)}
// 													// onChange={(e) => setstart_time(e.target.value)}
// 													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
// 												/>

// 												{
// 													errorMessageStartTime && <p className='text-danger'>{errorMessageStartTime}</p>
// 												}
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Late Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<input
// 													type="text"
// 													readOnly
// 													value={late_time}
// 													name='late_time'
// 													onClick={() => document.getElementById(`dateInput-n2`).showPicker()}

// 													placeholder="HH:MM"
// 													className="form-control form-control-sm mb-2"
// 													style={{ display: 'inline-block', }}
// 												/>
// 												<input
// 													type="time"
// 													id={`dateInput-n2`}
// 													onChange={(e) => handleTimeChange(e, setlate_time)}
// 													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

// 												/>
// 												{
// 													opening_balance && <p className='text-danger'>{opening_balance}</p>
// 												}
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<input
// 													type="text"
// 													readOnly
// 													value={end_time}
// 													name='end_time'
// 													onClick={() => document.getElementById(`dateInput-n3`).showPicker()}

// 													placeholder="HH:MM"
// 													className="form-control form-control-sm mb-2"
// 													style={{ display: 'inline-block', }}
// 												/>
// 												<input
// 													type="time"
// 													id={`dateInput-n3`}
// 													onChange={(e) => handleTimeChange(e, setend_time)}
// 													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

// 												/>
// 												{
// 													account_head_name && <p className='text-danger'>{account_head_name}</p>
// 												}
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Early End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<input
// 													type="text"
// 													readOnly
// 													value={early_end_time}
// 													name='early_end_time'
// 													onClick={() => document.getElementById(`dateInput-n4`).showPicker()}

// 													placeholder="HH:MM"
// 													className="form-control form-control-sm mb-2"
// 													style={{ display: 'inline-block', }}
// 												/>
// 												<input
// 													type="time"
// 													id={`dateInput-n4`}
// 													onChange={(e) => handleTimeChange(e, setearly_end_time)}
// 													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

// 												/>
// 												{
// 													opening_balances && <p className='text-danger'>{opening_balances}</p>
// 												}
// 											</div>
// 										</div>

// 										<div className="form-group row">
// 											<div className="offset-md-3 col-sm-6">
// 												<input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
// 											</div>
// 										</div>
// 									</div>
// 								</form>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default SchoolShiftCreate;
// 'use client' 
 //ismile
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';

// const SchoolShiftCreate = () => {

// 	const [start_time, setstart_time] = useState('');
// 	const [late_time, setlate_time] = useState('');
// 	const [end_time, setend_time] = useState('');
// 	const [early_end_time, setearly_end_time] = useState('');
// 	const [early_time, setearly_time] = useState('');




// 	const [start_timeError, setstart_timeError] = useState('');
// 	const [late_timeError, setlate_timeError] = useState('');
// 	const [end_timeError, setend_timeError] = useState('');
// 	const [early_end_timeError, setearly_end_timeError] = useState('');
// 	const [early_timeError, setearly_timeError] = useState('');
// 	const [company, setcompany] = useState('');
// 	const [branch_id, setbranch_id] = useState('');
// 	const [name, setName] = useState('');

// 	const [selectedCompanyId, setSelectedCompanyId] = useState(''); // New state to track selected company

// 	const { data: companys = [], isLoading, refetch } = useQuery({
// 		queryKey: ['companys'],
// 		queryFn: async () => {
// 			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company/company_all`)
// 			const data = await res.json();
// 			return data;
// 		}
// 	});

// 	const { data: branchs = [] } = useQuery({
// 		queryKey: ['branchs'],
// 		queryFn: async () => {
// 			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
// 			const data = await res.json();
// 			return data;
// 		}
// 	});



// 	const handleTimeChange = (event, setTime) => {
// 		const dateTimeValue = event.target.value;
// 		const timeValue = dateTimeValue
// 		setTime(timeValue);


// 		if (selectedCompanyId) {
// 			setcompany('')
// 		}
// 		if (start_time) {
// 			setstart_timeError('')
// 		}
// 		if (late_time) {
// 			setlate_timeError('')
// 		}
// 		if (end_time) {
// 			setend_timeError('')
// 		}
// 		if (early_end_time) {
// 			setearly_end_timeError('')
// 		}
// 		if (early_time) {
// 			setearly_timeError('')
// 		}


// 	};

// 	const [userId, setUserId] = useState(() => {
// 		if (typeof window !== 'undefined') {
// 			return localStorage.getItem('userId') || '';
// 		}
// 		return '';
// 	});

// 	useEffect(() => {
// 		if (typeof window !== 'undefined') {
// 			const storedUserId = localStorage.getItem('userId');
// 			setUserId(storedUserId);
// 		}
// 	}, []);

// 	const router = useRouter();
// 	const created_by = userId;

// 	const user_create = (event) => {
// 		event.preventDefault();
// 		const form = event.target;
// 		const name = form.name.value;
// 		const branch_id = form.branch_id.value;

// 		if (!selectedCompanyId) {
// 			setcompany('Company Must be Select')
// 			return
// 		}
// 		if (!name) {
// 			setName('Name Must be Select')
// 			return
// 		}
// 		if (!branch_id) {
// 			setbranch_id('Branch Must be Select')
// 			return
// 		}
// 		if (!start_time) {
// 			setstart_timeError('Start Time is Required')
// 			return
// 		}
// 		if (!late_time) {
// 			setlate_timeError('LAte time is Required')
// 			return
// 		}
// 		if (!end_time) {
// 			setend_timeError('End time is required')
// 			return
// 		}
// 		if (!early_end_time) {
// 			setearly_end_timeError('early end time is required')
// 			return
// 		}
// 		if (!early_time) {
// 			setearly_timeError('early time is required')
// 			return
// 		}

// 		const schoolShift = {
// 			early_time,
// 			name,
// 			start_time,
// 			late_time,
// 			end_time,
// 			early_end_time,
// 			created_by,
// 			branch_id
// 		};

// 		fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_create`, {
// 			method: 'POST',
// 			headers: {
// 				'content-type': 'application/json',
// 			},
// 			body: JSON.stringify(schoolShift),
// 		})
// 			.then((Response) => {
// 				Response.json();
// 				if (Response.ok === true) {
// 					if (typeof window !== 'undefined') {
// 						sessionStorage.setItem("message", "Data saved successfully!");
// 					}
// 					router.push('/Admin/shift/shift_all');
// 				}
// 			})
// 			.catch((error) => console.error(error));
// 	};

// 	// Filter branches based on selected company ID
// 	const filteredBranches = branchs.filter(branch => branch.company_id === parseInt(selectedCompanyId));

// 	return (
// 		<div className="container-fluid">
// 			<div className="row">
// 				<div className='col-12 p-4'>
// 					<div className='card'>
// 						<div className="body-content bg-light">
// 							<div className="border-primary shadow-sm border-0">
// 								<div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
// 									<h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create School Shift</h5>
// 									<div className="card-title font-weight-bold mb-0 card-header-color float-right">
// 										<Link href={`/Admin/shift/shift_all?page_group`} className="btn btn-sm btn-info">Back School Shift List</Link>
// 									</div>
// 								</div>
// 								<div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
// 									(<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
// 								</div>
// 								<form onSubmit={user_create}>
// 									<div className="card-body">
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Company Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<select

// 													name="company"
// 													className="form-control form-control-sm"
// 													onChange={(e) => setSelectedCompanyId(e.target.value)}
// 												>
// 													<option value="">Select Company</option>
// 													{companys.map(company => (
// 														<option key={company.id} value={company.id}>{company.company_name}</option>
// 													))}
// 												</select>
// 												{
// 													company && <p className='text-danger'>{company}</p>
// 												}
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Branch Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<select

// 													name="branch_id"
// 													className="form-control form-control-sm"
// 												>
// 													<option value="">Select Branch</option>
// 													{filteredBranches.map(branch => (
// 														<option key={branch.id} value={branch.id}>{branch.branch_name}</option>
// 													))}
// 												</select>
// 												{
// 													branch_id && <p className='text-danger'>{branch_id}</p>
// 												}
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<input type="text" name="name" className="form-control form-control-sm alpha_space unique_name" placeholder="Enter Name" />
// 												{
// 													name && <p className='text-danger'>{name}</p>
// 												}
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Start Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<input
// 													type="text"
// 													readOnly
// 													name="start_time"
// 													value={start_time}
// 													onClick={() => document.getElementById('dateInput-n1').showPicker()}
// 													placeholder="HH:MM"
// 													className="form-control form-control-sm mb-2"
// 													style={{ display: 'inline-block' }}
// 												/>
// 												<input
// 													type="time"
// 													id="dateInput-n1"
// 													onChange={(e) => handleTimeChange(e, setstart_time)}
// 													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
// 												/>
// 												{
// 													start_timeError && <p className='text-danger'>{name}</p>
// 												}

// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Late Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<input
// 													type="text"
// 													readOnly
// 													value={late_time}
// 													name='late_time'
// 													onClick={() => document.getElementById('dateInput-n2').showPicker()}
// 													placeholder="HH:MM"
// 													className="form-control form-control-sm mb-2"
// 													style={{ display: 'inline-block' }}
// 												/>
// 												<input
// 													type="time"
// 													id="dateInput-n2"
// 													onChange={(e) => handleTimeChange(e, setlate_time)}
// 													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
// 												/>
// 												{
// 													late_timeError && <p className='text-danger'>{late_timeError}</p>
// 												}

// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<input
// 													type="text"
// 													readOnly
// 													name='end_time'
// 													value={end_time}
// 													onClick={() => document.getElementById('dateInput-n3').showPicker()}
// 													placeholder="HH:MM"
// 													className="form-control form-control-sm mb-2"
// 													style={{ display: 'inline-block' }}
// 												/>
// 												<input
// 													type="time"
// 													id="dateInput-n3"
// 													onChange={(e) => handleTimeChange(e, setend_time)}
// 													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
// 												/>
// 												{
// 													end_timeError && <p className='text-danger'>{end_timeError}</p>
// 												}

// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Early  Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<input
// 													type="text"
// 													readOnly
// 													name='early_time'
// 													value={early_time}
// 													onClick={() => document.getElementById('dateInput-n5').showPicker()}
// 													placeholder="HH:MM"
// 													className="form-control form-control-sm mb-2"
// 													style={{ display: 'inline-block' }}
// 												/>
// 												<input
// 													type="time"
// 													id="dateInput-n5"
// 													onChange={(e) => handleTimeChange(e, setearly_time)}
// 													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
// 												/>
// {
// 													early_timeError && <p className='text-danger'>{early_timeError}</p>
// 												}
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Early End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<input
// 													type="text"
// 													readOnly
// 													name='early_end_time'
// 													value={early_end_time}
// 													onClick={() => document.getElementById('dateInput-n4').showPicker()}
// 													placeholder="HH:MM"
// 													className="form-control form-control-sm mb-2"
// 													style={{ display: 'inline-block' }}
// 												/>
// 												<input
// 													type="time"
// 													id="dateInput-n4"
// 													onChange={(e) => handleTimeChange(e, setearly_end_time)}
// 													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
// 												/>
// {
// 													early_end_timeError && <p className='text-danger'>{early_end_timeError}</p>
// 												}
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<div className="offset-md-3 col-sm-6">
// 												<input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
// 											</div>
// 										</div>
// 									</div>
// 								</form>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// export default SchoolShiftCreate;

'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SchoolShiftCreate = () => {
	const [start_time, setStart_time] = useState('');
	const [late_time, setLate_time] = useState('');
	const [end_time, setEnd_time] = useState('');
	const [early_end_time, setEarly_end_time] = useState('');
	const [early_time, setEarly_time] = useState('');

	const [start_timeError, setStart_timeError] = useState('');
	const [late_timeError, setLate_timeError] = useState('');
	const [end_timeError, setEnd_timeError] = useState('');
	const [early_end_timeError, setEarly_end_timeError] = useState('');
	const [early_timeError, setEarly_timeError] = useState('');
	const [companyError, setCompanyError] = useState('');
	const [branchError, setBranchError] = useState('');
	const [nameError, setNameError] = useState('');
	const [company, setCompany] = useState('');
	const [branch_id, setBranch_id] = useState('');
	const [name, setName] = useState('');

	const [selectedCompanyId, setSelectedCompanyId] = useState('');

	const { data: companys = [], isLoading, refetch } = useQuery({
		queryKey: ['companys'],
		queryFn: async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company/company_all`);
			const data = await res.json();
			return data;
		}
	});

	const { data: branchs = [] } = useQuery({
		queryKey: ['branchs'],
		queryFn: async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
			const data = await res.json();
			return data;
		}
	});

	const clearSpecificError = (field) => {
		switch (field) {
			case 'company':
				setCompanyError('');
				break;
			case 'branch':
				setBranchError('');
				break;
			case 'name':
				setNameError('');
				break;
			case 'start_time':
				setStart_timeError('');
				break;
			case 'late_time':
				setLate_timeError('');
				break;
			case 'end_time':
				setEnd_timeError('');
				break;
			case 'early_end_time':
				setEarly_end_timeError('');
				break;

			default:
				break;
		}
	};

	const handleTimeChange = (event, setTime, field) => {
		const timeValue = event.target.value;
		setTime(timeValue);
		clearSpecificError(field); // Clear only the relevant time field error
	};

	const handleCompanyChange = (event) => {
		setSelectedCompanyId(event.target.value);
		clearSpecificError('company'); // Clear company-related error
	};

	const handleBranchChange = (event) => {
		setBranch_id(event.target.value);
		clearSpecificError('branch'); // Clear branch-related error
	};

	const handleNameChange = (event) => {
		setName(event.target.value);
		clearSpecificError('name'); // Clear name-related error
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

	const router = useRouter();
	const created_by = userId;

	const user_create = (event) => {
		event.preventDefault();
		const form = event.target;
		const name = form.name.value;
		const branch_id = form.branch_id.value;

		let hasError = false;

		if (!selectedCompanyId) {
			setCompanyError('Company Must be Select');
			hasError = true;
		}
		if (!name) {
			setNameError('Name Must be Provided');
			hasError = true;
		}
		if (!branch_id) {
			setBranchError('Branch Must be Select');
			hasError = true;
		}
		if (!start_time) {
			setStart_timeError('Start Time is Required');
			hasError = true;
		}
		if (!late_time) {
			setLate_timeError('Late Time is Required');
			hasError = true;
		}
		if (!end_time) {
			setEnd_timeError('End Time is Required');
			hasError = true;
		}
		if (!early_end_time) {
			setEarly_end_timeError('Early End Time is Required');
			hasError = true;
		}


		if (hasError) return;

		const schoolShift = {

			name,
			start_time,
			late_time,
			end_time,
			early_end_time,
			created_by,
			branch_id
		};

		console.log(schoolShift)

		fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_create`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(schoolShift),
		})
			.then((Response) => {
				Response.json();
				if (Response.ok === true) {
					if (typeof window !== 'undefined') {
						sessionStorage.setItem("message", "Data saved successfully!");
					}
					// router.push('/Admin/shift/shift_all');
				}
			})
			.catch((error) => console.error(error));
	};

	const filteredBranches = branchs.filter(branch => branch.company_id === parseInt(selectedCompanyId));
	const formatTimeTo12Hour = (timeStr) => {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, seconds);
      
        // Options for formatting the time
        const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
        return date.toLocaleTimeString([], options);
      };
	return (
		<div className="container-fluid">
			<div className="row">
				<div className='col-12 p-4'>
					<div className='card'>
						<div className="body-content bg-light">
							<div className="border-primary shadow-sm border-0">
								<div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
									<h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create School Shift</h5>
									<div className="card-title font-weight-bold mb-0 card-header-color float-right">
										<Link href={`/Admin/shift/shift_all?page_group`} className="btn btn-sm btn-info">Back School Shift List</Link>
									</div>
								</div>
								<div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
									(<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
								</div>
								<form onSubmit={user_create}>
									<div className="card-body">
										<div className="form-group row">
											<label className="col-form-label font-weight-bold col-md-3">Company Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
											<div className="col-md-6">
												<select
													name="company"
													className="form-control form-control-sm"
													onChange={handleCompanyChange}
												>
													<option value="">Select Company</option>
													{companys.map(company => (
														<option key={company.id} value={company.id}>{company.company_name}</option>
													))}
												</select>
												{
													companyError && <p className='text-danger'>{companyError}</p>
												}
											</div>
										</div>
										<div className="form-group row">
											<label className="col-form-label font-weight-bold col-md-3">Branch Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
											<div className="col-md-6">
												<select
													name="branch_id"
													className="form-control form-control-sm"
													onChange={handleBranchChange}
												>
													<option value="">Select Branch</option>
													{filteredBranches.map(branch => (
														<option key={branch.id} value={branch.id}>{branch.branch_name}</option>
													))}
												</select>
												{
													branchError && <p className='text-danger'>{branchError}</p>
												}
											</div>
										</div>
										<div className="form-group row">
											<label className="col-form-label font-weight-bold col-md-3">Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
											<div className="col-md-6">
												<input type="text" placeholder='Enter Name' name="name" className="form-control form-control-sm" value={name} onChange={handleNameChange} />
												{
													nameError && <p className='text-danger'>{nameError}</p>
												}
											</div>
										</div>
										<div className="form-group row">
											<label className="col-form-label font-weight-bold col-md-3">Start Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
											<div className="col-md-6">
												<input
													type="text"
													readOnly
													value={start_time}
													name='start_time'
													onClick={() => document.getElementById('dateInput-n1').showPicker()}
													placeholder="HH:MM"
													className="form-control form-control-sm mb-2"
													style={{ display: 'inline-block' }}
												/>
												<input
													type="time"
													id="dateInput-n1"
													onChange={(e) => handleTimeChange(e, setStart_time, 'start_time')}
													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
												/>
												{
													start_timeError && <p className='text-danger'>{start_timeError}</p>
												}
											</div>
										</div>
										<div className="form-group row">
											<label className="col-form-label font-weight-bold col-md-3">Late Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
											<div className="col-md-6">
												<input
													type="text"
													readOnly
													value={late_time}
													name='late_time'
													onClick={() => document.getElementById('dateInput-n2').showPicker()}
													placeholder="HH:MM"
													className="form-control form-control-sm mb-2"
													style={{ display: 'inline-block' }}
												/>
												<input
													type="time"
													id="dateInput-n2"
													onChange={(e) => handleTimeChange(e, setLate_time, 'late_time')}
													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
												/>
												{
													late_timeError && <p className='text-danger'>{late_timeError}</p>
												}
											</div>
										</div>


										<div className="form-group row">
											<label className="col-form-label font-weight-bold col-md-3">Early End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
											<div className="col-md-6">
												<input
													type="text"
													readOnly
													name='early_end_time'
													value={early_end_time}
													onClick={() => document.getElementById('dateInput-n4').showPicker()}
													placeholder="HH:MM"
													className="form-control form-control-sm mb-2"
													style={{ display: 'inline-block' }}
												/>
												<input
													type="time"
													id="dateInput-n4"
													onChange={(e) => handleTimeChange(e, setEarly_end_time, 'early_end_time')}
													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
												/>
												{
													early_end_timeError && <p className='text-danger'>{early_end_timeError}</p>
												}
											</div>
										</div>
										<div className="form-group row">
											<label className="col-form-label font-weight-bold col-md-3">End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
											<div className="col-md-6">
												<input
													type="text"
													readOnly
													name='end_time'
													value={end_time}
													onClick={() => document.getElementById('dateInput-n3').showPicker()}
													placeholder="HH:MM"
													className="form-control form-control-sm mb-2"
													style={{ display: 'inline-block' }}
												/>
												<input
													type="time"
													id="dateInput-n3"
													onChange={(e) => handleTimeChange(e, setEnd_time, 'end_time')}
													style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
												/>
												{
													end_timeError && <p className='text-danger'>{end_timeError}</p>
												}
											</div>
										</div>
										<div className="form-group row">
											<div className="offset-md-3 col-sm-6">
												<input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
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
	);
};

export default SchoolShiftCreate;



