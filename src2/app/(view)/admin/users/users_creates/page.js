// 'use client' 
 //ismile
// import React, { useState } from 'react';
// import Link from 'next/link';
// import Swal from 'sweetalert2';
// import { useQuery } from '@tanstack/react-query';

// const UsersCreate = () => {
//   const { data: usersRoles = [], isLoading, refetch } = useQuery({
//     queryKey: ['usersRoles'],
//     queryFn: async () => {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/users/role_all`);
//       const data = await res.json();
//       return data;
//     }
//   });

//   const [selectedRole, setSelectedRole] = useState('');
//   const [selectedRoleOTP, setSelectedRoleOTP] = useState(null);
//   const [passwordError, setPasswordError] = useState('');
//   const [nameError, setNameError] = useState('');
//   const [emailError, setEmailError] = useState('');

//   const user_role_change = (event) => {
//     const selectedRoleId = event.target.value;
//     setSelectedRole(selectedRoleId);

//     const selectedRoleData = usersRoles?.find((role) => role.id === parseInt(selectedRoleId));
//     setSelectedRoleOTP(selectedRoleData ? selectedRoleData.OTP : null);
//   };

//   const validateForm = (full_name, email, password) => {
//     let isValid = true;
//     if (!full_name.trim()) {
//       setNameError('Full Name is required');
//       isValid = false;
//     } else {
//       setNameError('');
//     }
//     if (!email.trim()) {
//       setEmailError('Email is required');
//       isValid = false;
//     } else {
//       setEmailError('');
//     }
//     if (!password.trim()) {
//       setPasswordError('Password is required');
//       isValid = false;
//     } else {
//       setPasswordError('');
//     }
//     return isValid;
//   };

//   const user_create = (event) => {
//     event.preventDefault();
//     const form = event.target;
//     const full_name = form.full_name.value;
//     const email = form.email.value;
//     const password = form.password.value;
//     const confirm_password = form.confirm_password.value;
//     const mobile = form.mobile.value;
//     const role_name = form.role_name.value;

//     if (!validateForm(full_name, email, password)) {
//       return;
//     }

//     if (password !== confirm_password) {
//       setPasswordError('Password and Confirm Password do not match');
//       return;
//     }

//     setPasswordError('');

//     const users = {
//       full_name,
//       email,
//       password,
//       mobile,
//       role_name,
//       OTP: selectedRoleOTP
//     };

//     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/create-users`, {
//       method: 'POST',
//       headers: {
//         'content-type': 'application/json',
//       },
//       body: JSON.stringify(users),
//     })
//     .then((Response) => Response.json())
//     .then((data) => {
//       console.log(data);

//     })
//     .catch((error) => console.error(error));
//   };

//   return (
//     <div>
//       <div className='p-3'>
//         <div className=' mx-auto'>
//           <section className=' border  rounded mx-auto bg-light'>
//             <li className='list-group-item text-light  p-1 px-4' aria-current='true' style={{ background: '#4267b2' }}>
//               <div className='d-flex justify-content-between'>
//                 <h5>Create Users </h5>
//                 <button style={{ background: '#17a2b8' }} className='border-0 text-white shadow-sm rounded-1'>
//                   <Link href='/Admin/users/users_all'>Back To Users List</Link>
//                 </button>
//               </div>
//             </li>
//             <form className='p-3' onSubmit={user_create}>
//               <div className='form-group row'>
//                 <label className='col-form-label col-md-3'><strong>Full Name:</strong></label>
//                 <div className='col-md-6'>
//                   <input type='text' name='full_name' className='form-control mb-3' placeholder='Enter Full Name' onChange={() => setNameError('')} />
//                   {nameError && <div className='text-danger'>{nameError}</div>}
//                 </div>
//               </div>
//               <div className='form-group row'>
//                 <label className='col-form-label col-md-3'><strong>Email:</strong></label>
//                 <div className='col-md-6'>
//                   <input type='text' name='email' className='form-control mb-3' placeholder='Enter Email' onChange={() => setEmailError('')} />
//                   {emailError && <div className='text-danger'>{emailError}</div>}
//                 </div>
//               </div>
//               <div className='form-group row'>
//                 <label className='col-form-label col-md-3'><strong>Password:</strong></label>
//                 <div className='col-md-6'>
//                   <input type='password' name='password' className='form-control mb-3' placeholder='Enter Password' onChange={() => setPasswordError('')} />
//                   {passwordError && <div className='text-danger'>{passwordError}</div>}
//                 </div>
//               </div>
//               <div className='form-group row'>
//                 <label className='col-form-label col-md-3'><strong>Confirm Password:</strong></label>
//                 <div className='col-md-6'>
//                   <input type='password' name='confirm_password' className='form-control mb-3' placeholder='Enter Confirm Password' />

//                 </div>
//               </div>
//               <div className='form-group row'>
//                 <label className='col-form-label col-md-3'><strong>Mobile:</strong></label>
//                 <div className='col-md-6'>
//                   <input type='text' name='mobile' className='form-control mb-3' placeholder='Enter Mobile' />
//                 </div>
//               </div>
//               <div className='form-group row'>
//                 <label className='col-form-label col-md-3'><strong>Role Name:</strong></label>
//                 <div className='col-md-6'>
//                   <select required='' onChange={user_role_change} value={selectedRole} name='role_name' className='form-control form-control-sm  required integer_no_zero' id='role_name' placeholder='Enter Role Name'>
//                     <option>Select users Role</option>
//                     {usersRoles?.map(roleName =>
//                       <option key={roleName.id} value={roleName.id}>{roleName.role_name}</option>
//                     )}
//                   </select>
//                   <p >Role OTP: {selectedRoleOTP !== null ? selectedRoleOTP : ''}</p>
//                 </div>
//               </div>
//               <div className='form-group row mt-2'>
//                 <div className='offset-md-3 col-sm-6'>
//                   <input type='submit' className='btn btn-sm btn-success' value='Submit' />
//                 </div>
//               </div>
//             </form>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UsersCreate;
'use client' 
 //ismile
import React, { useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const UsersCreate = () => {
  const { data: usersRoles = [], isLoading, refetch } = useQuery({
    queryKey: ['usersRoles'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/users/role_all`);
      const data = await res.json();
      return data;
    }
  });

  const [selectedRole, setSelectedRole] = useState('');
  const [selectedRoleOTP, setSelectedRoleOTP] = useState(null);
  const [pass_reset, setpass_reset] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [roleError, setRoleError] = useState('');

  const user_role_change = (event) => {
    const selectedRoleId = event.target.value;
    setSelectedRole(selectedRoleId);

    const selectedRoleData = usersRoles?.find((role) => role.id === parseInt(selectedRoleId));
    setSelectedRoleOTP(selectedRoleData ? selectedRoleData.OTP : null);
    setpass_reset(selectedRoleData ? selectedRoleData.pass_reset : null);

    // Reset role error when a role is selected
    setRoleError('');
  };

  const validateForm = (full_name, email, password) => {
    let isValid = true;
    if (!full_name.trim()) {
      setNameError('Full Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      setEmailError('');
    }
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }
    if (!selectedRole) {
      setRoleError('Role Name is required');
      isValid = false;
    } else {
      setRoleError('');
    }
    return isValid;
  };
  const router = useRouter()
  const user_create = (event) => {
    event.preventDefault();
    const form = event.target;
    const full_name = form.full_name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirm_password = form.confirm_password.value;
    const mobile = form.mobile.value;
    const role_name = form.role_name.value;

    if (!validateForm(full_name, email, password)) {
      return;
    }

    if (password !== confirm_password) {
      setPasswordError('Password and Confirm Password do not match');
      return;
    }

    setPasswordError('');

    const users = {
      full_name,
      email,
      password,
      mobile,
      role_name,
      OTP: selectedRoleOTP,
      pass_reset: pass_reset
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/create-users`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(users),
    })
      .then((Response) => {
        Response.json()
        console.log(Response)
        if (Response.ok === true) {
          sessionStorage.setItem("message", "Data saved successfully!");
          router.push('/Admin/users/users_all')
        }
      })
      .then((data) => {
        console.log(data);

      })
      .catch((error) => console.error(error));
  };
  console.log(selectedRoleOTP)
  console.log(pass_reset)

  return (
    <div class="container-fluid">
      <div class=" row ">

        <div className='col-12 p-4'>

          <div className='card mb-4'>
            <div class="body-content bg-light">
              <section className=' rounded bg-light'>
                <li className='list-group-item text-light  p-1 px-4' aria-current='true' style={{ background: '#4267b2' }}>
                  <div className='d-flex justify-content-between'>
                    <h5>Create Users </h5>
                    <button style={{ background: '#17a2b8' }} className='border-0 text-white shadow-sm rounded-1'>
                      <Link href='/Admin/users/users_all'>Back To Users List</Link>
                    </button>
                  </div>
                </li>
                <form className='p-3' onSubmit={user_create}>
                  <div className='form-group row'>
                    <label className='col-form-label col-md-3'><strong>Full Name:</strong></label>
                    <div className='col-md-6'>
                      <input type='text' name='full_name' className='form-control mb-3' placeholder='Enter Full Name' onChange={() => setNameError('')} />
                      {nameError && <div className='text-danger'>{nameError}</div>}
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-form-label col-md-3'><strong>Email:</strong></label>
                    <div className='col-md-6'>
                      <input type='text' name='email' className='form-control mb-3' placeholder='Enter Email' onChange={() => setEmailError('')} />
                      {emailError && <div className='text-danger'>{emailError}</div>}
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-form-label col-md-3'><strong>Password:</strong></label>
                    <div className='col-md-6'>
                      <input type='password' name='password' className='form-control mb-3' placeholder='Enter Password' onChange={() => setPasswordError('')} />
                      {passwordError && <div className='text-danger'>{passwordError}</div>}
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-form-label col-md-3'><strong>Confirm Password:</strong></label>
                    <div className='col-md-6'>
                      <input type='password' name='confirm_password' className='form-control mb-3' placeholder='Enter Confirm Password' />

                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-form-label col-md-3'><strong>Mobile:</strong></label>
                    <div className='col-md-6'>
                      <input type='text' name='mobile' className='form-control mb-3' placeholder='Enter Mobile' />
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-form-label col-md-3'><strong>Role Name:</strong></label>
                    <div className='col-md-6'>
                      <select required='' onChange={user_role_change} value={selectedRole} name='role_name' className='form-control form-control-sm  required integer_no_zero' id='role_name' placeholder='Enter Role Name'>
                        <option>Select users Role</option>
                        {usersRoles?.map(roleName =>
                          <option key={roleName.id} value={roleName.id}>{roleName.role_name}</option>
                        )}
                      </select>
                      {/* <p >Role OTP: {selectedRoleOTP !== null ? selectedRoleOTP : ''}</p> */}
                      {roleError && <div className='text-danger'>{roleError}</div>}
                    </div>
                  </div>
                  <div className='form-group row mt-2'>
                    <div className='offset-md-3 col-sm-6'>
                      <input type='submit' className='btn btn-sm btn-success' value='Submit' />
                    </div>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersCreate;
