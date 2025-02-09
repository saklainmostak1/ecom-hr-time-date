// 'use client' 
 //ismile
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';

// const SchoolShiftEdit = ({ id }) => {


//     const [start_time, setstart_time] = useState('');
//     const [late_time, setlate_time] = useState('');
//     const [end_time, setend_time] = useState('');
//     const [early_end_time, setearly_end_time] = useState('');



//     const handleTimeChange = (event, setTime) => {
//         const dateTimeValue = event.target.value;
//         const timeValue = new Date(dateTimeValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         setTime(timeValue);


//     };


//     const { data: schoolShiftListSingle = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['schoolShiftListSingle'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all/${id}`)

//             const data = await res.json()
//             return data
//         }
//     })

//     console.log(schoolShiftListSingle)
//     const modified_by = localStorage.getItem('userId')
//     const [formData, setFormData] = useState({
//         name: '',
//         start_time: '',
//         late_time: '',
//         end_time: '',
//         early_end_time: '',
//         modified_by: ''
//     });

//     useEffect(() => {

//         setFormData({
//             name: schoolShiftListSingle[0]?.name,
//             start_time: schoolShiftListSingle[0]?.start_time,
//             late_time: schoolShiftListSingle[0]?.late_time,
//             end_time: schoolShiftListSingle[0]?.end_time,
//             early_end_time: schoolShiftListSingle[0]?.early_end_time,
//             modified_by: modified_by
//         });
//     }, [schoolShiftListSingle, modified_by]);

//     console.log(formData)

//     const school_shift_update = (e) => {
//         e.preventDefault()

//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_edit/${id}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(formData)
//         })
//             .then(response => {

//                 response.json()
//             console.log(response)
//             })
//             .then(data => {
//                 console.log(data);
//                 // if (data.affectedRows > 0) {
//                 //     sessionStorage.setItem("message", "Data Update successfully!");
//                 //     // router.push('/Admin/period/period_all')

//                 // }
//                 // Handle success or show a success message to the user
//             })
//             .catch(error => {
//                 console.error('Error updating brand:', error);
//                 // Handle error or show an error message to the user
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
//                                 <form action="" onSubmit={school_shift_update}>
//                                     <div className="card-body">
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     defaultValue={formData.name}
//                                                     type="text" name="name" className="form-control form-control-sm  alpha_space unique_name" id="name" placeholder="Enter Name" />

//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Start Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     name='start_time'
//                                                     value={start_time ? start_time : formData?.start_time}
//                                                     onClick={() => document.getElementById(`dateInput-n1`).showPicker()}

//                                                     placeholder="dd-mm-yyyy"
//                                                     className="form-control form-control-sm mb-2"
//                                                     style={{ display: 'inline-block', }}
//                                                 />
//                                                 <input
//                                                     type="datetime-local"
//                                                     id={`dateInput-n1`}
//                                                     onChange={(e) => handleTimeChange(e, setstart_time)}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                                 />

//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Late Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={late_time ? late_time : formData?.late_time}
//                                                     name='late_time'
//                                                     onClick={() => document.getElementById(`dateInput-n2`).showPicker()}

//                                                     placeholder="dd-mm-yyyy"
//                                                     className="form-control form-control-sm mb-2"
//                                                     style={{ display: 'inline-block', }}
//                                                 />
//                                                 <input
//                                                     type="datetime-local"
//                                                     id={`dateInput-n2`}
//                                                     onChange={(e) => handleTimeChange(e, setlate_time)}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={end_time ? end_time : formData?.end_time}
//                                                     name='end_time'
//                                                     onClick={() => document.getElementById(`dateInput-n3`).showPicker()}

//                                                     placeholder="dd-mm-yyyy"
//                                                     className="form-control form-control-sm mb-2"
//                                                     style={{ display: 'inline-block', }}
//                                                 />
//                                                 <input
//                                                     type="datetime-local"
//                                                     id={`dateInput-n3`}
//                                                     onChange={(e) => handleTimeChange(e, setend_time)}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Early End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={early_end_time ? early_end_time : formData?.early_end_time}
//                                                     name='early_end_time'
//                                                     onClick={() => document.getElementById(`dateInput-n4`).showPicker()}

//                                                     placeholder="dd-mm-yyyy"
//                                                     className="form-control form-control-sm mb-2"
//                                                     style={{ display: 'inline-block', }}
//                                                 />
//                                                 <input
//                                                     type="datetime-local"
//                                                     id={`dateInput-n4`}
//                                                     onChange={(e) => handleTimeChange(e, setearly_end_time)}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className="form-group row">
//                                             <div className="offset-md-3 col-sm-6">
//                                                 <input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SchoolShiftEdit;
// 'use client' 
 //ismile
// import { useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { useRouter } from 'next/navigation';

// const SchoolShiftEdit = ({ id }) => {





//     const { data: companys = [] } = useQuery({
//         queryKey: ['companys'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company/company_all`)
//             const data = await res.json();
//             return data;
//         }
//     });

//     const { data: branchs = [] } = useQuery({
//         queryKey: ['branchs'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
//             const data = await res.json();
//             return data;
//         }
//     });


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

//     const [formData, setFormData] = useState({
//         name: '',
//         start_time: '',
//         late_time: '',
//         end_time: '',
//         early_end_time: '',
//         modified_by: userId,
//         early_time: '',
//         branch_id: ''
//     });

//     const { data: schoolShiftData, isLoading, refetch } = useQuery({
//         queryKey: ['schoolShiftListSingle', id],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all/${id}`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     useEffect(() => {
//         if (schoolShiftData && schoolShiftData[0]) {
//             const { name, start_time, late_time, end_time, early_end_time, early_time, branch_id } = schoolShiftData[0];
//             setFormData({
//                 name,
//                 start_time,
//                 late_time,
//                 end_time,
//                 early_end_time,
//                 early_time,
//                 modified_by: userId,
//                 branch_id
//             });
//         }
//     }, [schoolShiftData, userId]);

//     const handleTimeChange = (event, field) => {
//         const dateTimeValue = event.target.value;
//         const timeValue = dateTimeValue
//         setFormData({ ...formData, [field]: timeValue });
//     };

//     const router = useRouter()

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_edit/${id}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//             });
//             const data = await response.json();
//             console.log(data);
//             if (data.affectedRows > 0) {

//                 sessionStorage.setItem("message", "Data Update successfully!");
//                 router.push('/Admin/shift/shift_all')
//             }
//             // Handle response data or success message
//         } catch (error) {
//             console.error('Error updating school shift:', error);
//             // Handle error or show an error message to the user
//         }
//     };

//     if (isLoading) return <div className='  text-center text-dark'
//     >
//         <FontAwesomeIcon style={{
//             height: '33px',
//             width: '33px',
//         }} icon={faSpinner} spin />
//     </div>;


// const companyName = companys.find(company => company.id === parseFloat(formData.branch_id))

// console.log(companyName?.id)
//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Edit School Shift</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/school_shift/school_shift_all?page_group`} className="btn btn-sm btn-info">Back to School Shift List</Link>
//                                     </div>
//                                 </div>
//                                 <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                 </div>
//                                 <form onSubmit={handleSubmit}>
//                                     <div className="card-body">
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Company Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <select
//                                                     required
//                                                     name="company"
//                                                     className="form-control form-control-sm"
//                                                     value={companyName?.id}
//                                                     onChange={handleTimeChange}
//                                                 >
//                                                     <option value="">Select Company</option>
//                                                     {companys.map(company => (
//                                                         <option key={company.id} value={company.id}>{company.company_name}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Branch Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <select
//                                                     onChange={handleTimeChange}
//                                                     value={formData.branch_id}
//                                                     required
//                                                     name="branch_id"
//                                                     className="form-control form-control-sm"
//                                                 >
//                                                     <option value="">Select Branch</option>
//                                                     {branchs.map(branch => (
//                                                         <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     name="name"
//                                                     className="form-control form-control-sm"
//                                                     value={formData.name}
//                                                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Start Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.start_time}
//                                                     name="start_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n1`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n1`}
//                                                     onChange={(e) => handleTimeChange(e, "start_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Late Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.late_time}
//                                                     name="late_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n2`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n2`}
//                                                     onChange={(e) => handleTimeChange(e, "late_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.end_time}
//                                                     name="end_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n3`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n3`}
//                                                     onChange={(e) => handleTimeChange(e, "end_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Early  Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.early_time}
//                                                     name="early_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n4`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n4`}
//                                                     onChange={(e) => handleTimeChange(e, "early_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Early End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.early_end_time}
//                                                     name="early_end_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n5`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n5`}
//                                                     onChange={(e) => handleTimeChange(e, "early_end_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <div className="offset-md-3 col-sm-6">
//                                                 <input type="submit" className="btn btn-sm btn-success" value="Submit" />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SchoolShiftEdit;

// 'use client' 
 //ismile
// import { useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { useRouter } from 'next/navigation';

// const SchoolShiftEdit = ({ id }) => {
//     const { data: companys = [] } = useQuery({
//         queryKey: ['companys'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company/company_all`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const { data: branchs = [] } = useQuery({
//         queryKey: ['branchs'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
//             const data = await res.json();
//             return data;
//         }
//     });

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

//     const [formData, setFormData] = useState({
//         name: '',
//         start_time: '',
//         late_time: '',
//         end_time: '',
//         early_end_time: '',
//         modified_by: userId,
//         early_time: '',
//         branch_id: ''
//     });

//     const { data: schoolShiftData, isLoading, refetch } = useQuery({
//         queryKey: ['schoolShiftListSingle', id],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all/${id}`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     useEffect(() => {
//         if (schoolShiftData && schoolShiftData[0]) {
//             const { name, start_time, late_time, end_time, early_end_time, early_time, branch_id } = schoolShiftData[0];
//             setFormData({
//                 name,
//                 start_time,
//                 late_time,
//                 end_time,
//                 early_end_time,
//                 early_time,
//                 modified_by: userId,
//                 branch_id
//             });
//         }
//     }, [schoolShiftData, userId]);

//     const handleTimeChange = (event, field) => {
//         const timeValue = event.target.value;
//         setFormData({ ...formData, [field]: timeValue });
//     };

//     const handleSelectChange = (event) => {
//         const { name, value } = event.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const router = useRouter();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_edit/${id}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//             });
//             const data = await response.json();
//             console.log(data);
//             if (data.affectedRows > 0) {
//                 sessionStorage.setItem("message", "Data Update successfully!");
//                 router.push('/Admin/shift/shift_all');
//             }
//         } catch (error) {
//             console.error('Error updating school shift:', error);
//         }
//     };

//     if (isLoading) return <div className='text-center text-dark'>
//         <FontAwesomeIcon style={{
//             height: '33px',
//             width: '33px',
//         }} icon={faSpinner} spin />
//     </div>;

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Edit School Shift</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/school_shift/school_shift_all?page_group`} className="btn btn-sm btn-info">Back to School Shift List</Link>
//                                     </div>
//                                 </div>
//                                 <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                 </div>
//                                 <form onSubmit={handleSubmit}>
//                                     <div className="card-body">
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Company Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <select
//                                                     required
//                                                     name="branch_id"
//                                                     className="form-control form-control-sm"
//                                                     value={formData.branch_id}
//                                                     onChange={handleSelectChange}
//                                                 >
//                                                     <option value="">Select Company</option>
//                                                     {companys.map(company => (
//                                                         <option key={company.id} value={company.id}>{company.company_name}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Branch Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <select
//                                                     onChange={handleSelectChange}
//                                                     value={formData.branch_id}
//                                                     required
//                                                     name="branch_id"
//                                                     className="form-control form-control-sm"
//                                                 >
//                                                     <option value="">Select Branch</option>
//                                                     {branchs.map(branch => (
//                                                         <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     name="name"
//                                                     className="form-control form-control-sm"
//                                                     value={formData.name}
//                                                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Start Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.start_time}
//                                                     name="start_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n1`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n1`}
//                                                     onChange={(e) => handleTimeChange(e, "start_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Late Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.late_time}
//                                                     name="late_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n2`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n2`}
//                                                     onChange={(e) => handleTimeChange(e, "late_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.end_time}
//                                                     name="end_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n3`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n3`}
//                                                     onChange={(e) => handleTimeChange(e, "end_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Early End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.early_end_time}
//                                                     name="early_end_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n4`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n4`}
//                                                     onChange={(e) => handleTimeChange(e, "early_end_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Early Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.early_time}
//                                                     name="early_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n5`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n5`}
//                                                     onChange={(e) => handleTimeChange(e, "early_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="card-footer">
//                                         <button type="submit" className="btn btn-sm btn-info">Update</button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default SchoolShiftEdit;
// 'use client' 
 //ismile
// import { useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { useRouter } from 'next/navigation';

// const SchoolShiftEdit = ({ id }) => {
//     const [selectedCompanyId, setSelectedCompanyId] = useState(''); // New state to track selected company

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

//     const filteredBranches = branchs.filter(branch => branch.company_id === parseInt(selectedCompanyId));


//     const [userId, setUserId] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('userId') || '';
//         }
//         return '';
//     });

   

//     const [formData, setFormData] = useState({
//         name: '',
//         start_time: '',
//         late_time: '',
//         end_time: '',
//         early_end_time: '',
//         modified_by: userId,
//         early_time: '',
//         branch_id: ''
//     });

//     const { data: schoolShiftData } = useQuery({
//         queryKey: ['schoolShiftListSingle', id],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all/${id}`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     useEffect(() => {
//         if (schoolShiftData && schoolShiftData[0]) {
//             const { name, start_time, late_time, end_time, early_end_time, early_time, branch_id } = schoolShiftData[0];
//             setFormData({
//                 name,
//                 start_time,
//                 late_time,
//                 end_time,
//                 early_end_time,
//                 early_time,
//                 modified_by: userId,
//                 branch_id
//             });
//             // Set the selected company based on existing branch_id if available
//             const branch = branchs.find(branch => branch.id === parseFloat(branch_id));
//             if (branch) {
//                 setSelectedCompanyId(branch.company_id);
//             }
//         }
//     }, [schoolShiftData, userId, branchs]);

//     const handleCompanyChange = (event) => {
//         const companyId = event.target.value;
//         setSelectedCompanyId(companyId);
//         // Optionally clear the selected branch if the company changes
//         setFormData(prevFormData => ({
//             ...prevFormData,
//             branch_id: ''
//         }));
//     };

//     const handleBranchChange = (event) => {
//         const branchId = event.target.value;
//         setFormData(prevFormData => ({
//             ...prevFormData,
//             branch_id: branchId
//         }));
//     };

//     const handleTimeChange = (event, field) => {
//         const timeValue = event.target.value;
//         setFormData(prevFormData => ({
//             ...prevFormData,
//             [field]: timeValue
//         }));
//     };

//     const router = useRouter();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_edit/${id}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//             });
//             const data = await response.json();
//             if (data.affectedRows > 0) {
//                 sessionStorage.setItem("message", "Data updated successfully!");
//                 router.push('/Admin/shift/shift_all');
//             }
//         } catch (error) {
//             console.error('Error updating school shift:', error);
//         }
//     };

//     if (isLoading) return (
//         <div className='text-center text-dark'>
//             <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
//         </div>
//     );

//     // Filter branches by selected company ID

//     const companyId = branchs.filter(branch => branch.id === formData.branch_id) 
//     console.log(companyId[0]?.company_id)
    
//     const companyName = companys.filter(company => company.id === companyId[0]?.company_id) 

//     console.log(companyName[0]?.id)
  

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Edit School Shift</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/school_shift/school_shift_all?page_group`} className="btn btn-sm btn-info">Back to School Shift List</Link>
//                                     </div>
//                                 </div>
//                                 <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                 </div>
//                                 <form onSubmit={handleSubmit}>
//                                     <div className="card-body">
//                                     <div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Company Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<select
//                                                 value={companyName[0]?.id}
// 													required
// 													name="company"
// 													className="form-control form-control-sm"
// 													onChange={(e) => setSelectedCompanyId(e.target.value)}
// 												>
// 													<option value="">Select Company</option>
// 													{companys.map(company => (
// 														<option key={company.id} value={company.id}>{company.company_name}</option>
// 													))}
// 												</select>
// 											</div>
// 										</div>
// 										<div className="form-group row">
// 											<label className="col-form-label font-weight-bold col-md-3">Branch Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
// 											<div className="col-md-6">
// 												<select
//                                                 value={formData.branch_id}
// 													required
// 													name="branch_id"
// 													className="form-control form-control-sm"
// 												>
// 													<option value="">Select Branch</option>
// 													{filteredBranches.map(branch => (
// 														<option key={branch.id} value={branch.id}>{branch.branch_name}</option>
// 													))}
// 												</select>
// 											</div>
// 										</div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     name="name"
//                                                     className="form-control form-control-sm"
//                                                     value={formData.name}
//                                                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Start Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.start_time}
//                                                     name="start_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n1`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n1`}
//                                                     onChange={(e) => handleTimeChange(e, "start_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Late Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.late_time}
//                                                     name="late_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n2`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n2`}
//                                                     onChange={(e) => handleTimeChange(e, "late_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.end_time}
//                                                     name="end_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n3`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n3`}
//                                                     onChange={(e) => handleTimeChange(e, "end_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Early Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.early_time}
//                                                     name="early_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n4`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n4`}
//                                                     onChange={(e) => handleTimeChange(e, "early_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Early End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.early_end_time}
//                                                     name="early_end_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n5`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n5`}
//                                                     onChange={(e) => handleTimeChange(e, "early_end_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <div className="offset-md-3 col-sm-6">
//                                                 <input type="submit" className="btn btn-sm btn-success" value="Submit" />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SchoolShiftEdit;
// 'use client' 
 //ismile
// import { useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { useRouter } from 'next/navigation';

// const SchoolShiftEdit = ({ id }) => {
//     const [selectedCompanyId, setSelectedCompanyId] = useState(''); // New state to track selected company
//     const [filteredBranches, setFilteredBranches] = useState([]);

//     const { data: companys = [], isLoading, refetch } = useQuery({
//         queryKey: ['companys'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company/company_all`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const { data: branchs = [] } = useQuery({
//         queryKey: ['branchs'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const [userId, setUserId] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('userId') || '';
//         }
//         return '';
//     });

//     const [formData, setFormData] = useState({
//         name: '',
//         start_time: '',
//         late_time: '',
//         end_time: '',
//         early_end_time: '',
//         modified_by: userId,
//         early_time: '',
//         branch_id: ''
//     });

//     const { data: schoolShiftData } = useQuery({
//         queryKey: ['schoolShiftListSingle', id],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all/${id}`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     useEffect(() => {
//         if (schoolShiftData && schoolShiftData[0]) {
//             const { name, start_time, late_time, end_time, early_end_time, early_time, branch_id } = schoolShiftData[0];
//             setFormData({
//                 name,
//                 start_time,
//                 late_time,
//                 end_time,
//                 early_end_time,
//                 early_time,
//                 modified_by: userId,
//                 branch_id
//             });
//             // Set the selected company based on existing branch_id if available
//             const branch = branchs.find(branch => branch.id === parseFloat(branch_id));
//             if (branch) {
//                 setSelectedCompanyId(branch.company_id);
//                 setFilteredBranches(branchs.filter(branch => branch.company_id === branch.company_id));
//             }
//         }
//     }, [schoolShiftData, userId, branchs]);

//     const handleCompanyChange = (event) => {
//         const companyId = event.target.value;
//         setSelectedCompanyId(companyId);
//         // Filter branches based on selected company
//         setFilteredBranches(branchs.filter(branch => branch.company_id === parseInt(companyId)));
//         // Optionally clear the selected branch if the company changes
//         setFormData(prevFormData => ({
//             ...prevFormData,
//             branch_id: ''
//         }));
//     };

//     const handleBranchChange = (event) => {
//         const branchId = event.target.value;
//         setFormData(prevFormData => ({
//             ...prevFormData,
//             branch_id: branchId
//         }));
//     };

//     const handleTimeChange = (event, field) => {
//         const timeValue = event.target.value;
//         setFormData(prevFormData => ({
//             ...prevFormData,
//             [field]: timeValue
//         }));
//     };

//     const router = useRouter();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_edit/${id}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//             });
//             const data = await response.json();
//             if (data.affectedRows > 0) {
//                 sessionStorage.setItem("message", "Data updated successfully!");
//                 router.push('/Admin/shift/shift_all');
//             }
//         } catch (error) {
//             console.error('Error updating school shift:', error);
//         }
//     };

//     if (isLoading) return (
//         <div className='text-center text-dark'>
//             <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
//         </div>
//     );

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Edit School Shift</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/shift/shift_all?page_group`} className="btn btn-sm btn-info">Back to School Shift List</Link>
//                                     </div>
//                                 </div>
//                                 <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                                     (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                                 </div>
//                                 <form onSubmit={handleSubmit}>
//                                     <div className="card-body">
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Company Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <select
//                                                     value={selectedCompanyId}
//                                                     required
//                                                     name="company"
//                                                     className="form-control form-control-sm"
//                                                     onChange={handleCompanyChange}
//                                                 >
//                                                     <option value="">Select Company</option>
//                                                     {companys.map(company => (
//                                                         <option key={company.id} value={company.id}>{company.company_name}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Branch Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <select
//                                                     value={formData.branch_id}
//                                                     required
//                                                     name="branch_id"
//                                                     className="form-control form-control-sm"
//                                                     onChange={handleBranchChange}
//                                                 >
//                                                     <option value="">Select Branch</option>
//                                                     {filteredBranches.map(branch => (
//                                                         <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     name="name"
//                                                     className="form-control form-control-sm"
//                                                     value={formData.name}
//                                                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Start Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.start_time}
//                                                     name="start_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n1`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n1`}
//                                                     onChange={(e) => handleTimeChange(e, "start_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Late Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.late_time}
//                                                     name="late_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n2`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n2`}
//                                                     onChange={(e) => handleTimeChange(e, "late_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.end_time}
//                                                     name="end_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n3`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n3`}
//                                                     onChange={(e) => handleTimeChange(e, "end_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Early Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.early_time}
//                                                     name="early_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n4`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n4`}
//                                                     onChange={(e) => handleTimeChange(e, "early_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <label className="col-form-label font-weight-bold col-md-3">Early End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
//                                             <div className="col-md-6">
//                                                 <input
//                                                     type="text"
//                                                     readOnly
//                                                     value={formData.early_end_time}
//                                                     name="early_end_time"
//                                                     className="form-control form-control-sm mb-2"
//                                                     onClick={() => document.getElementById(`dateInput-n5`).showPicker()}
//                                                     style={{ display: 'inline-block' }}
//                                                 />
//                                                 <input
//                                                     type="time"
//                                                     id={`dateInput-n5`}
//                                                     onChange={(e) => handleTimeChange(e, "early_end_time")}
//                                                     style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <div className="offset-md-3 col-sm-6">
//                                                 <input type="submit" className="btn btn-sm btn-success" value="Submit" />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SchoolShiftEdit;


'use client' 
 //ismile
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

const SchoolShiftEdit = ({ id }) => {
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [filteredBranches, setFilteredBranches] = useState([]);
    const [errorMessages, setErrorMessages] = useState({});
    
    const { data: companys = [], isLoading } = useQuery({
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

    const [userId, setUserId] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    const [formData, setFormData] = useState({
        name: '',
        start_time: '',
        late_time: '',
        end_time: '',
        early_end_time: '',
        modified_by: userId,
     
        branch_id: ''
    });

    const { data: schoolShiftData } = useQuery({
        queryKey: ['schoolShiftListSingle', id],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all/${id}`);
            const data = await res.json();
            return data;
        }
    });

    useEffect(() => {
        if (schoolShiftData && schoolShiftData[0]) {
            const { name, start_time, late_time, end_time, early_end_time, early_time, branch_id } = schoolShiftData[0];
            setFormData({
                name,
                start_time,
                late_time,
                end_time,
                early_end_time,
              
                modified_by: userId,
                branch_id
            });
            const branch = branchs.find(branch => branch.id === parseFloat(branch_id));
            if (branch) {
                setSelectedCompanyId(branch.company_id);
                setFilteredBranches(branchs.filter(branch => branch.company_id === branch.company_id));
            }
        }
    }, [schoolShiftData, userId, branchs]);

    const handleCompanyChange = (event) => {
        const companyId = event.target.value;
        setSelectedCompanyId(companyId);
        setFilteredBranches(branchs.filter(branch => branch.company_id === parseInt(companyId)));
        setFormData(prevFormData => ({
            ...prevFormData,
            branch_id: ''
        }));
        setErrorMessages(prevErrors => ({
            ...prevErrors,
            company: '' // Clear company error message
        }));
    };

    const handleBranchChange = (event) => {
        const branchId = event.target.value;
        setFormData(prevFormData => ({
            ...prevFormData,
            branch_id: branchId
        }));
        setErrorMessages(prevErrors => ({
            ...prevErrors,
            branch_id: '' // Clear branch_id error message
        }));
    };

    const handleTimeChange = (event, field) => {
        const timeValue = event.target.value;
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: timeValue
        }));
        setErrorMessages(prevErrors => ({
            ...prevErrors,
            [field]: '' // Clear the specific time field error message
        }));
    };

    const handleInputChange = (event, field) => {
        const value = event.target.value;
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: value
        }));
        setErrorMessages(prevErrors => ({
            ...prevErrors,
            [field]: '' // Clear the specific field error message
        }));
    };

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const errors = {};
        if (!formData.name) errors.name = "Name is required";
        if (!formData.start_time) errors.start_time = "Start Time is required";
        if (!formData.late_time) errors.late_time = "Late Time is required";
        if (!formData.end_time) errors.end_time = "End Time is required";
       
        if (!formData.early_end_time) errors.early_end_time = "Early End Time is required";
        if (!formData.branch_id) errors.branch_id = "Branch is required";
        if (!selectedCompanyId) errors.company = "Company is required";

        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.affectedRows > 0) {
                sessionStorage.setItem("message", "Data updated successfully!");
                router.push('/Admin/shift/shift_all');
            }
        } catch (error) {
            console.error('Error updating school shift:', error);
        }
    };

    if (isLoading) return (
        <div className='text-center text-dark'>
            <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
        </div>
    );

    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Edit School Shift</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/shift/shift_all?page_group`} className="btn btn-sm btn-info">Back to School Shift List</Link>
                                    </div>
                                </div>
                                <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                    (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="card-body">
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Company Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <select
                                                    value={selectedCompanyId}
                                                    
                                                    name="company"
                                                    className="form-control form-control-sm"
                                                    onChange={handleCompanyChange}
                                                >
                                                    <option value="">Select Company</option>
                                                    {companys.map(company => (
                                                        <option key={company.id} value={company.id}>{company.company_name}</option>
                                                    ))}
                                                </select>
                                                {errorMessages.company && <div className="text-danger">{errorMessages.company}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Branch Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <select
                                                    value={formData.branch_id}
                                                    
                                                    name="branch_id"
                                                    className="form-control form-control-sm"
                                                    onChange={handleBranchChange}
                                                >
                                                    <option value="">Select Branch</option>
                                                    {filteredBranches.map(branch => (
                                                        <option key={branch.id} value={branch.id}>{branch.branch_name}</option>
                                                    ))}
                                                </select>
                                                {errorMessages.branch_id && <div className="text-danger">{errorMessages.branch_id}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Name:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    name="name"
                                                    className="form-control form-control-sm"
                                                    onChange={(e) => handleInputChange(e, 'name')}
                                                />
                                                {errorMessages.name && <div className="text-danger">{errorMessages.name}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Start Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={formData.start_time}
                                                    name="start_time"
                                                    className="form-control form-control-sm mb-2"
                                                    onClick={() => document.getElementById(`dateInput-n1`).showPicker()}
                                                    style={{ display: 'inline-block' }}
                                                />
                                                <input
                                                    type="time"
                                                    id={`dateInput-n1`}
                                                    onChange={(e) => handleTimeChange(e, "start_time")}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
                                                />
                                                {errorMessages.start_time && <div className="text-danger">{errorMessages.start_time}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Late Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={formData.late_time}
                                                    name="late_time"
                                                    className="form-control form-control-sm mb-2"
                                                    onClick={() => document.getElementById(`dateInput-n2`).showPicker()}
                                                    style={{ display: 'inline-block' }}
                                                />
                                                <input
                                                    type="time"
                                                    id={`dateInput-n2`}
                                                    onChange={(e) => handleTimeChange(e, "late_time")}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
                                                />
                                                {errorMessages.late_time && <div className="text-danger">{errorMessages.late_time}</div>}
                                            </div>
                                        </div>
                                    
                                      
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">Early End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={formData.early_end_time}
                                                    name="early_end_time"
                                                    className="form-control form-control-sm mb-2"
                                                    onClick={() => document.getElementById(`dateInput-n5`).showPicker()}
                                                    style={{ display: 'inline-block' }}
                                                />
                                                <input
                                                    type="time"
                                                    id={`dateInput-n5`}
                                                    onChange={(e) => handleTimeChange(e, "early_end_time")}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
                                                />
                                                {errorMessages.early_end_time && <div className="text-danger">{errorMessages.early_end_time}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label font-weight-bold col-md-3">End Time:<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={formData.end_time}
                                                    name="end_time"
                                                    className="form-control form-control-sm mb-2"
                                                    onClick={() => document.getElementById(`dateInput-n3`).showPicker()}
                                                    style={{ display: 'inline-block' }}
                                                />
                                                <input
                                                    type="time"
                                                    id={`dateInput-n3`}
                                                    onChange={(e) => handleTimeChange(e, "end_time")}
                                                    style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}
                                                />
                                                {errorMessages.end_time && <div className="text-danger">{errorMessages.end_time}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-3 col-sm-6">
                                                <input type="submit" className="btn btn-sm btn-success" value="Submit" />
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

export default SchoolShiftEdit;

