

// 'use client' 
 //ismile

// import React, { useEffect, useState } from 'react';


// const AdmissionSMS = () => {

//   const [smsSettings, setSmsSettings] = useState([])


//   const [isEaJoin2, setIsEaJoin2] = useState(false)
//   const [isTeJoin2, setIsTeJoin2] = useState(false)
//   const [isEsJoin2, setIsEsJoin2] = useState(false)
//   const [isOeJoin2, setIsOeJoin2] = useState(false)

//   const [isOeJoin1, setIsOeJoin1] = useState(false)
//   const [isEaJoin1, setIsEaJoin1] = useState(false)
//   const [isTeJoin1, setIsTeJoin1] = useState(false)
//   const [isEsJoin1, setIsEsJoin1] = useState(false)

//   console.log(isEaJoin2)
//   console.log(isTeJoin2)
//   console.log(isEsJoin2)
//   console.log(isOeJoin2)

//   console.log(isOeJoin1)
//   console.log(isEaJoin1)
//   console.log(isTeJoin1)
//   console.log(isEsJoin1)


//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const form = event.target;

//     const oe_join = form?.oe_join?.value

//     const e_attendance = form?.e_attendance?.value

//     const te_absence = form?.te_absence?.value

//     const e_salary = form?.e_salary?.value


//     const auto_oe_join = form?.auto_oe_join?.value
//     const is_oe_join = form?.is_oe_join?.value
//     const auto_e_attendance = form?.auto_e_attendance?.value
//     const is_e_attendance = form?.is_e_attendance?.value
//     const auto_te_absence = form?.auto_te_absence?.value
//     const is_te_absence = form?.is_te_absence?.value
//     const auto_e_salary = form?.auto_e_salary?.value
//     const is_e_salary = form?.is_e_salary?.value



//     const updateValue = {
//       oe_join, e_attendance, te_absence, e_salary,
//       auto_oe_join, is_oe_join, auto_e_attendance, is_e_attendance, auto_te_absence, is_te_absence, auto_e_salary, is_e_salary

//     }
//     console.log(updateValue);

//     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/smsSettings`, {
//       method: 'POST',
//       headers: {
//         'content-type': 'application/json'
//       },
//       body: JSON.stringify(updateValue)
//     })
//       .then(Response => Response.json())
//       .then(data => {
//         console.log(data)


//       })
//   }




//   useEffect(() => {
//     getSmsSettings();
//   }, []);

//   const getSmsSettings = async () => {
//     const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/smsSettings`;
//     const response = await fetch(url);
//     const data = await response.json();
//     setSmsSettings(data);
//   };

// console.log(smsSettings[0])

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <div className="card bg-white m-3 shadow-sm">
//           <div className="card-header py-2 bg-light">
//             <div className="card-title mb-0 float-left font-weight-bold mt-1 text-dark ">Joining SMS</div>
//           </div>

//           <div className="card-body">

//             <div className="row no-gutters mb-3">
//               <div className="col-md-3">
//                 <label className="font-weight-bold text-right text-dark">Employee Join</label>
//               </div>
//               <div className="col-md-9">
//                 <div className="input-group">
//                   <div className="input-group-prepend input-group-text">
//                     <div>
//                       <div className="custom-control custom-switch text-left">
//                         <input
//                           type="checkbox"
//                           name="auto_oe_join"
//                           className="custom-control-input common_sms"
//                           checked={smsSettings[0]?.auto_oe_join === 1}
//                           value={isOeJoin1 ? '1' : '2'}
//                           id="auto_oe_join"

//                           onChange={() => setIsOeJoin1(prevState => !prevState)}
//                         />
//                         <label className="custom-control-label" htmlFor="auto_oe_join">Auto</label>
//                       </div>

//                       <div className="custom-control custom-switch">
//                         <input
//                           type="checkbox"
//                           name="is_oe_join"
//                           className="custom-control-input common_sms"
//                           checked={smsSettings[0]?.is_oe_join === 1}
//                           value={isOeJoin2 ? '1' : '2'}
//                           id="is_oe_join"

//                           onChange={() => setIsOeJoin2(prevState => !prevState)}
//                         />
//                         <label className="custom-control-label" htmlFor="is_oe_join">Manual</label>
//                       </div>
//                     </div>
//                   </div>
//                   <textarea className="form-control" name="oe_join" aria-label="With textarea" defaultValue={smsSettings[0]?.oe_join}>

//                   </textarea>
//                   <small id="passwordHelpBlock" className="form-text text-info">
//                     [[company_name]], [[full_name]], [[employee_id]], [[employee_designation]], [[joining_date]], [[sms_time]], [[payroll_name]], [[payroll_total]] Keywords refer by Company Name, Employee Name, Id, Designation, Joining Date, Sms time, Payroll Name &amp; Payroll Total respectively.
//                   </small>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="card bg-white m-3 shadow-sm">
//           <div className="card-header py-2 bg-light">
//             <div className="card-title mb-0 float-left font-weight-bold mt-1 text-dark ">Attendance SMS</div>
//           </div>

//           <div className="card-body">

//             <div className="row no-gutters mb-3">
//               <div className="col-md-3">
//                 <label className="font-weight-bold text-right text-dark">Employee Attendance</label>
//               </div>
//               <div className="col-md-9">
//                 <div className="input-group">
//                   <div className="input-group-prepend input-group-text">
//                     <div>
//                       <div className="custom-control custom-switch text-left">
//                         <input
//                           type="checkbox"
//                           name="auto_e_attendance"
//                           className="custom-control-input common_sms"
//                           checked={smsSettings[0]?.auto_e_attendance === 1}
//                           value={isEaJoin1 ? '1' : '2'}
//                           id="auto_e_attendance"

//                           onChange={() => setIsEaJoin1(prevState => !prevState)}
//                         />
//                         <label className="custom-control-label" htmlFor="auto_e_attendance">Auto</label>
//                       </div>

//                       <div className="custom-control custom-switch">
//                         <input
//                           type="checkbox"
//                           name="is_e_attendance"
//                           className="custom-control-input common_sms"
//                           checked={smsSettings[0]?.is_e_attendance === 1}
//                           value={isEaJoin2 ? '1' : '2'}
//                           id="is_e_attendance"
//                           // value="1"
//                           onChange={() => setIsEaJoin2(prevState => !prevState)}
//                         />
//                         <label className="custom-control-label" htmlFor="is_e_attendance">Manual</label>
//                       </div>
//                     </div>
//                   </div>
//                   <textarea className="form-control" name="e_attendance" aria-label="With textarea" defaultValue={smsSettings[0]?.e_attendance}>

//                   </textarea>
//                   <small id="passwordHelpBlock" className="form-text text-info">
//                     [[company_name]], [[full_name]], [[teacher_id]], [[teacher_designation]], [[joining_date]], [[sms_time]], [[payroll_name]], [[payroll_total]] Keywords refer by Company Name, Teacher Name, Id, Designation, Joining Date, Sms Time, Payroll Name &amp; Payroll Total respectively.
//                   </small>
//                 </div>
//               </div>
//             </div>


//           </div>
//         </div>

//         <div className="card bg-white m-3 shadow-sm">
//           <div className="card-header py-2 bg-light">
//             <div className="card-title mb-0 float-left font-weight-bold mt-1 text-dark ">Absence SMS</div>
//           </div>

//           <div className="card-body">
//             <div className="row no-gutters mb-3">
//               <div className="col-md-3">
//                 <label className="font-weight-bold text-right text-dark"> Employee Absence</label>
//               </div>
//               <div className="col-md-9">
//                 <div className="input-group">
//                   <div className="input-group-prepend input-group-text">
//                     <div >
//                       <div className="custom-control custom-switch text-left">
//                         <input
//                           type="checkbox"
//                           name="auto_te_absence"
//                           className="custom-control-input common_sms"
//                           checked={smsSettings[0]?.auto_te_absence === 1}
//                           value={isTeJoin1 ? '1' : '2'}
//                           id="auto_te_absence"

//                           onChange={() => setIsTeJoin1(prevState => !prevState)}
//                         />
//                         <label className="custom-control-label" htmlFor="auto_te_absence">Auto</label>
//                       </div>
//                       <div className="custom-control custom-switch">
//                         <input
//                           type="checkbox"
//                           name="is_te_absence"
//                           className="custom-control-input common_sms"
//                           checked={smsSettings[0]?.is_te_absence === 1}
//                           value={isTeJoin2 ? '1' : '2'}
//                           id="is_te_absence"
//                           // value="1"
//                           onChange={() => setIsTeJoin2(prevState => !prevState)}
//                         />
//                         <label className="custom-control-label" htmlFor="is_te_absence">Manual</label>
//                       </div>
//                     </div>
//                   </div>
//                   <textarea className="form-control" name="te_absence" aria-label="With textarea" defaultValue={smsSettings[0]?.te_absence}>

//                   </textarea>
//                   <small id="passwordHelpBlock" className="form-text text-info">
//                     [[company_name]], [[full_name]], [[teacher_id]], [[teacher_designation]], [[joining_date]], [[sms_time]], [[payroll_name]], [[payroll_total]] Keywords refer by Company Name, Teacher Name, Id, Designation, Joining Date, Sms Time, Payroll Name &amp; Payroll Total respectively.
//                   </small>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>



//         <div className="card bg-white m-3 shadow-sm">
//           <div className="card-header py-2 bg-light">
//             <div className="card-title mb-0 float-left font-weight-bold mt-1 text-dark ">Salary SMS</div>
//           </div>

//           <div className="card-body">

//             <div className="row no-gutters mb-3">
//               <div className="col-md-3">
//                 <label className="font-weight-bold text-right text-dark">Employee Salary</label>
//               </div>
//               <div className="col-md-9">
//                 <div className="input-group">
//                   <div className="input-group-prepend input-group-text">
//                     <div >
//                       <div className="custom-control custom-switch text-left">
//                         <input
//                           type="checkbox"
//                           name="auto_e_salary"
//                           className="custom-control-input common_sms"
//                           checked={smsSettings[0]?.auto_e_salary === 1}
//                           value={isEsJoin1 ? '1' : '2'}
//                           id="auto_e_salary"

//                           onChange={() => setIsEsJoin1(prevState => !prevState)}
//                         />
//                         <label className="custom-control-label" htmlFor="auto_e_salary">Auto</label>
//                       </div>
//                       <div className="custom-control custom-switch">
//                         <input
//                           type="checkbox"
//                           name="is_e_salary"
//                           className="custom-control-input common_sms"
//                           checked={smsSettings[0]?.is_e_salary === 1}
//                           value={isEsJoin2 ? '1' : '2'}
//                           id="is_e_salary"

//                           onChange={() => setIsEsJoin2(prevState => !prevState)}
//                         />
//                         <label className="custom-control-label" htmlFor="is_e_salary">Manual</label>
//                       </div>
//                     </div>
//                   </div>
//                   <textarea className="form-control" name="e_salary" aria-label="With textarea" defaultValue={smsSettings[0]?.e_salary}>
//                   </textarea>
//                   <small id="passwordHelpBlock" className="form-text text-info">
//                     [[company_name]], [[full_name]], [[employee_id]], [[employee_designation]], [[joining_date]], [[sms_time]], [[payroll_name]], [[payroll_total]] Keywords refer by Company Name, Employee Name, Id, Designation, Joining Date, Sms Time, Payroll Name &amp; Payroll Total respectively.
//                   </small>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="row no-gutters mb-2">
//           <div className=" offset-md-3">
//             <input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AdmissionSMS;




'use client' 
 //ismile

import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';

const AdmissionSMS = () => {


  const { data: schoolShiftList = [], isLoading, refetch
  } = useQuery({
    queryKey: ['schoolShiftList'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/school_shift/school_shift_all`)

      const data = await res.json()
      return data
    }
  })

  // const [selectedMonths, setSelectedMonths] = useState('');
  // const handleChange = (selectedOptions) => {
  //   const selectedValues = selectedOptions.map(option => option.value);
  //   setSelectedMonths(selectedValues || []);
  // };


  // console.log(selectedMonths)
  const [selectedMonths, setSelectedMonths] = useState('');

  const handleChange = (selectedOptions) => {
    // Extract values from the selected options
    const selectedValues = selectedOptions.map(option => option.value);

    // Convert array of values to a comma-separated string
    const selectedValuesString = selectedValues.join(', ');

    // Update the state with the comma-separated string
    setSelectedMonths(selectedValuesString);
  };

  // Display the selected values as an array format
  // const formattedSelectedMonths = `[${selectedMonths}]`;
  // console.log(formattedSelectedMonths)

  console.log(selectedMonths)

  const [smsSettings, setSmsSettings] = useState([]);

  const [isEaJoin2, setIsEaJoin2] = useState(false);
  const [isTeJoin2, setIsTeJoin2] = useState(false);
  const [isEsJoin2, setIsEsJoin2] = useState(false);
  const [isOeJoin2, setIsOeJoin2] = useState(false);

  const [isOeJoin1, setIsOeJoin1] = useState(false);
  const [isEaJoin1, setIsEaJoin1] = useState(false);
  const [isTeJoin1, setIsTeJoin1] = useState(false);
  const [isEsJoin1, setIsEsJoin1] = useState(false);
  const [te_absent_shift_enable, sette_absent_shift_enable] = useState(false);

  useEffect(() => {
    getSmsSettings();
  }, []);

  const getSmsSettings = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/smsSettings`;
    const response = await fetch(url);
    const data = await response.json();
    setSmsSettings(data);
    setIsOeJoin1(data[0]?.auto_oe_join === 1);
    setIsOeJoin2(data[0]?.is_oe_join === 1);
    setIsEaJoin1(data[0]?.auto_e_attendance === 1);
    setIsEaJoin2(data[0]?.is_e_attendance === 1);
    setIsTeJoin1(data[0]?.auto_te_absence === 1);
    setIsTeJoin2(data[0]?.is_te_absence === 1);
    setIsEsJoin1(data[0]?.auto_e_salary === 1);
    setIsEsJoin2(data[0]?.is_e_salary === 1);
    sette_absent_shift_enable(data[0]?.te_absent_shift_enable === 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    const oe_join = form?.oe_join?.value;
    const e_attendance = form?.e_attendance?.value;
    const te_absence = form?.te_absence?.value;
    const e_salary = form?.e_salary?.value;

    const auto_oe_join = isOeJoin1 ? 1 : 0;
    const is_oe_join = isOeJoin2 ? 1 : 0;
    const auto_e_attendance = isEaJoin1 ? 1 : 0;
    const is_e_attendance = isEaJoin2 ? 1 : 0;
    const auto_te_absence = isTeJoin1 ? 1 : 0;
    const is_te_absence = isTeJoin2 ? 1 : 0;
    const auto_e_salary = isEsJoin1 ? 1 : 0;
    const is_e_salary = isEsJoin2 ? 1 : 0;
    const te_absent_shift_enables = te_absent_shift_enable ? 1 : 0;

    const updateValue = {
      oe_join,
      e_attendance,
      te_absence,
      e_salary,
      auto_oe_join,
      is_oe_join,
      auto_e_attendance,
      is_e_attendance,
      auto_te_absence,
      is_te_absence,
      auto_e_salary,
      is_e_salary,
      selectedMonths, 
      te_absent_shift_enables
    };

    console.log(updateValue);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/smsSettings`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(updateValue),
    })
      .then((Response) => Response.json())
      .then((data) => {
        console.log(data);
      });
  };



  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="card bg-white m-3 shadow-sm">
          <div className="card-header py-2 bg-light">
            <div className="card-title mb-0 float-left font-weight-bold mt-1 text-dark">Joining SMS</div>
          </div>

          <div className="card-body">
            <div className="row no-gutters mb-3">
              <div className="col-md-3">
                <label className="font-weight-bold text-right text-dark">Employee Join</label>
              </div>
              <div className="col-md-9">
                <div className="input-group">
                  <div className="input-group-prepend input-group-text">
                    <div>
                      <div className="custom-control custom-switch text-left">
                        <input
                          type="checkbox"
                          name="auto_oe_join"
                          className="custom-control-input common_sms"
                          checked={isOeJoin1}
                          id="auto_oe_join"
                          onChange={() => setIsOeJoin1((prevState) => !prevState)}
                        />
                        <label className="custom-control-label" htmlFor="auto_oe_join">Auto</label>
                      </div>

                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          name="is_oe_join"
                          className="custom-control-input common_sms"
                          checked={isOeJoin2}
                          id="is_oe_join"
                          onChange={() => setIsOeJoin2((prevState) => !prevState)}
                        />
                        <label className="custom-control-label" htmlFor="is_oe_join">Manual</label>
                      </div>
                    </div>
                  </div>
                  <textarea
                    className="form-control"
                    name="oe_join"
                    aria-label="With textarea"
                    defaultValue={smsSettings[0]?.oe_join}
                  />
                  <small id="passwordHelpBlock" className="form-text text-info">
                    [[company_name]], [[full_name]], [[employee_id]], [[employee_designation]], [[joining_date]], [[sms_time]], [[payroll_name]], [[payroll_total]] Keywords refer by Company Name, Employee Name, Id, Designation, Joining Date, Sms time, Payroll Name &amp; Payroll Total respectively.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Repeat similar blocks for Attendance SMS */}
        <div className="card bg-white m-3 shadow-sm">
          <div className="card-header py-2 bg-light">
            <div className="card-title mb-0 float-left font-weight-bold mt-1 text-dark">Attendance SMS</div>
          </div>

          <div className="card-body">
            <div className="row no-gutters mb-3">
              <div className="col-md-3">
                <label className="font-weight-bold text-right text-dark">Employee Attendance</label>
              </div>
              <div className="col-md-9">
                <div className="input-group">
                  <div className="input-group-prepend input-group-text">
                    <div>
                      <div className="custom-control custom-switch text-left">
                        <input
                          type="checkbox"
                          name="auto_e_attendance"
                          className="custom-control-input common_sms"
                          checked={isEaJoin1}
                          id="auto_e_attendance"
                          onChange={() => setIsEaJoin1((prevState) => !prevState)}
                        />
                        <label className="custom-control-label" htmlFor="auto_e_attendance">Auto</label>
                      </div>

                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          name="is_e_attendance"
                          className="custom-control-input common_sms"
                          checked={isEaJoin2}
                          id="is_e_attendance"
                          onChange={() => setIsEaJoin2((prevState) => !prevState)}
                        />
                        <label className="custom-control-label" htmlFor="is_e_attendance">Manual</label>
                      </div>
                    </div>
                  </div>
                  <textarea
                    className="form-control"
                    name="e_attendance"
                    aria-label="With textarea"
                    defaultValue={smsSettings[0]?.e_attendance}
                  />
                  <small id="passwordHelpBlock" className="form-text text-info">
                    [[company_name]], [[full_name]], [[teacher_id]], [[teacher_designation]], [[joining_date]], [[sms_time]], [[payroll_name]], [[payroll_total]] Keywords refer by Company Name, Teacher Name, Id, Designation, Joining Date, Sms Time, Payroll Name &amp; Payroll Total respectively.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Repeat similar blocks for Absence SMS */}
        <div className="card bg-white m-3 shadow-sm">
          <div className="card-header py-2 bg-light">
            <div className="card-title mb-0 float-left font-weight-bold mt-1 text-dark">Absence SMS</div>
          </div>

          <div className="card-body">
            <div className="row no-gutters mb-3">
              <div className="col-md-3">
                <label className="font-weight-bold text-right text-dark"> Employee Absence</label>
              </div>
              <div className="col-md-9">
                <div className="input-group">
                  <div className="input-group-prepend input-group-text">
                    <div>
                      <div className="custom-control custom-switch text-left">
                        <input
                          type="checkbox"
                          name="auto_te_absence"
                          className="custom-control-input common_sms"
                          checked={isTeJoin1}
                          id="auto_te_absence"
                          onChange={() => setIsTeJoin1((prevState) => !prevState)}
                        />
                        <label className="custom-control-label" htmlFor="auto_te_absence">Auto</label>
                      </div>

                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          name="is_te_absence"
                          className="custom-control-input common_sms"
                          checked={isTeJoin2}
                          id="is_te_absence"
                          onChange={() => setIsTeJoin2((prevState) => !prevState)}
                        />
                        <label className="custom-control-label" htmlFor="is_te_absence">Manual</label>
                      </div>
                    </div>
                  </div>
                  <textarea
                    className="form-control"
                    name="te_absence"
                    aria-label="With textarea"
                    defaultValue={smsSettings[0]?.te_absence}
                  />
                  <small id="passwordHelpBlock" className="form-text text-info">
                    [[company_name]], [[full_name]], [[teacher_id]], [[teacher_designation]], [[joining_date]], [[sms_time]], [[payroll_name]], [[payroll_total]] Keywords refer by Company Name, Teacher Name, Id, Designation, Joining Date, Sms Time, Payroll Name &amp; Payroll Total respectively.
                  </small>

                </div>
              </div>
            </div>
            <div class="row no-gutters mb-3">
              <div class="col-md-3">
                <label class="font-weight-bold text-right">Employee Absent Shift</label>
              </div>
              <div class="col-md-9">
                <div class="input-group input-group-text">
                  <div class="input-group-prepend">
                    <div className="custom-control custom-switch text-left mr-5 mt-2">
                      <input
                        type="checkbox"
                        name="te_absent_shift_enable"
                        className="custom-control-input common_sms"
                        checked={te_absent_shift_enable}
                        id="te_absent_shift_enable"
                        onChange={() => sette_absent_shift_enable((prevState) => !prevState)}
                      />
                      <label className="custom-control-label" htmlFor="te_absent_shift_enable">Enable</label>
                    </div>


                    <Select
                    style={{width:'400px'}}
                      multi
                      options={[

                        ...schoolShiftList.map(column => ({
                          label: column.name,
                          value: column.id,
                        })),

                      ]}
                      onChange={handleChange}
                    />



                  </div>

                  <div class="pl-2 input-group-append">
                    {/* <div class=" px-5">
                      <input type="checkbox" name="te_one_time" class=" from-control form-control-sm custom-control-input common_sms" id="te_one_time" value="1" />
                      <label class="custom-control-label ml-2" for="te_one_time">One Time</label>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Repeat similar blocks for Salary SMS */}
        <div className="card bg-white m-3 shadow-sm">
          <div className="card-header py-2 bg-light">
            <div className="card-title mb-0 float-left font-weight-bold mt-1 text-dark">Salary SMS</div>
          </div>

          <div className="card-body">
            <div className="row no-gutters mb-3">
              <div className="col-md-3">
                <label className="font-weight-bold text-right text-dark"> Employee Salary</label>
              </div>
              <div className="col-md-9">
                <div className="input-group">
                  <div className="input-group-prepend input-group-text">
                    <div>
                      <div className="custom-control custom-switch text-left">
                        <input
                          type="checkbox"
                          name="auto_e_salary"
                          className="custom-control-input common_sms"
                          checked={isEsJoin1}
                          id="auto_e_salary"
                          onChange={() => setIsEsJoin1((prevState) => !prevState)}
                        />
                        <label className="custom-control-label" htmlFor="auto_e_salary">Auto</label>
                      </div>

                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          name="is_e_salary"
                          className="custom-control-input common_sms"
                          checked={isEsJoin2}
                          id="is_e_salary"
                          onChange={() => setIsEsJoin2((prevState) => !prevState)}
                        />
                        <label className="custom-control-label" htmlFor="is_e_salary">Manual</label>
                      </div>
                    </div>
                  </div>
                  <textarea
                    className="form-control"
                    name="e_salary"
                    aria-label="With textarea"
                    defaultValue={smsSettings[0]?.e_salary}
                  />
                  <small id="passwordHelpBlock" className="form-text text-info">
                    [[company_name]], [[full_name]], [[teacher_id]], [[teacher_designation]], [[joining_date]], [[sms_time]], [[payroll_name]], [[payroll_total]] Keywords refer by Company Name, Teacher Name, Id, Designation, Joining Date, Sms Time, Payroll Name &amp; Payroll Total respectively.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row no-gutters mb-2">
          <div className=" offset-md-3">
            <input type="submit" name="create" className="btn btn-sm btn-success" value="Submit" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdmissionSMS;


// 'use client' 
 //ismile
// import React, { useState } from 'react';
// import axios from 'axios';

// const TableData = () => {
//     const [tableName, setTableName] = useState('');
//     const [tableData, setTableData] = useState([]);
//     const [error, setError] = useState(null);

//     const fetchData = async () => {
//         try {
//             const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/api/all_table_data`, { table_name: tableName });
//             setTableData(response.data);
//             setError(null);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             setError('Error fetching data');
//         }
//     };

//     const handleTableNameChange = (event) => {
//         setTableName(event.target.value);
//     };

//     return (
//         <div>
//             <h1>Fetch Table Data</h1>
//             <input
//                 type="text"
//                 value={tableName}
//                 onChange={handleTableNameChange}
//                 placeholder="Enter table name"
//             />
//             <button onClick={fetchData}>Fetch Data</button>

//             {error && <p style={{ color: 'red' }}>{error}</p>}

//             {tableData.length > 0 && (
//                 <table>
//                     <thead>
//                         <tr>
//                             {Object.keys(tableData[0]).map((key) => (
//                                 <th key={key}>{key}</th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {tableData.map((row, index) => (
//                             <tr key={index}>
//                                 {Object.values(row).map((value, i) => (
//                                     <td key={i}>{value}</td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// };

// export default TableData;


