'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import '../../../admin_layout/modal/fa.css'
import Swal from 'sweetalert2';

const ListUsersRoleAccess = () => {

    const { data: users_role_permission_list = [], isLoading, refetch
    } = useQuery({
        queryKey: ['users_role_permission_list'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/role`)

            const data = await res.json()
            return data
        }
    })
    console.log(users_role_permission_list)

    
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

    const { data: moduleInfo = []
    } = useQuery({
        queryKey: ['moduleInfo'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${userId}`)

            const data = await res.json()
            return data
        }
    })


    console.log(moduleInfo)

    // console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'brand'))
    const btnIconUsers = moduleInfo.filter(moduleI => moduleI.controller_name === 'user_role_access')

    const filteredBtnIconEdit = btnIconUsers.filter(btn =>
        btn.method_sort === 3
    );
    console.log(filteredBtnIconEdit)
    const filteredBtnIconDelete = btnIconUsers.filter(btn =>
        btn.method_sort === 5
    );
    const filteredBtnIcon = btnIconUsers.filter(btn =>
        btn.method_sort === 3
    );
    const filteredBtnCreate = btnIconUsers.filter(btn =>
        btn.method_sort === 1
    );
    console.log(filteredBtnCreate[0], 'create')

    // console.log(users_role_permission_list?.users[0]?.id)

    const user_role_delete = (id) => {
        console.log(id)

        const proceed = window.confirm('Are You Sure delete')
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/user-role/delete/${id}`, {
                method: "DELETE",

            })
                .then(Response => Response.json())
                .then(data => {
                    console.log(data)

                    refetch()

                })
        }
    }



    const [message, setMessage] = useState();
    useEffect(() => {
        if (sessionStorage.getItem("message")) {
            setMessage(sessionStorage.getItem("message"));
            sessionStorage.removeItem("message");
        }
    }, [])


    return (

        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    {
                        message &&

                        <div className="alert alert-success font-weight-bold">
                            {message}
                        </div>
                    }
                    <div className='card'>
                        <div className="bg-light body-content ">
                            <div className=" border-primary shadow-sm border-0">
                                <div
                                    style={{ backgroundColor: '#4267b2' }}
                                    className="card-header custom-card-header  py-1 clearfix  text-white ">
                                    <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">User Role Access List</h5>
                                    <div className="card-title card-header-color font-weight-bold mb-0  float-right">
                                        <Link href={`/Admin/${filteredBtnCreate[0]?.controller_name}/${filteredBtnCreate[0]?.method_name}?page-group=${filteredBtnCreate[0]?.page_group}`} className="btn btn-sm btn-info">Create User role Access</Link></div>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-hover table-striped table-sm ">
                                            <tbody><tr>
                                                <th>Role Name</th>
                                                <th>Action</th>
                                            </tr>
                                                {
                                                    users_role_permission_list?.users?.map(userRle =>


                                                        <tr key={userRle.id}>
                                                            <td>{userRle.role_name}</td>

                                                            <td>
                                                                <Link href={`/Admin/${filteredBtnIcon.map(btn => btn.controller_name)}/${filteredBtnIcon.map(btn => btn.method_name)}/${userRle.id}?page_group=${filteredBtnIcon.map(btn => btn.page_group)}`}>
                                                                    {
                                                                        filteredBtnIconEdit.map((filteredBtnIconEdit =>

                                                                            <button
                                                                                key={filteredBtnIconEdit.id}
                                                                                title='Edit'
                                                                                style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                className={filteredBtnIconEdit?.btn}
                                                                            >

                                                                                <a
                                                                                    dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                                ></a>
                                                                            </button>

                                                                        ))
                                                                    }

                                                                </Link>

                                                                {
                                                                    filteredBtnIconDelete.map((filteredBtnIconDelete =>
                                                                        <button
                                                                            key={filteredBtnIconDelete.id}
                                                                            title='Delete'
                                                                            onClick={() => user_role_delete(userRle.id)}
                                                                            style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                            className={filteredBtnIconDelete?.btn}
                                                                        >
                                                                            <a
                                                                                dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                            ></a>
                                                                        </button>

                                                                    ))
                                                                }

                                                            </td>
                                                        </tr>
                                                    )
                                                }


                                            </tbody></table>
                                    </div>
                                    <div className="w-100 justify-content-around font-weight-bold">
                                        <p className="float-left mb-0 my-2">Showing 1 to 9 of 9 results.</p>
                                    </div>
                                </div >
                            </div >
                        </div >
                    </div >
                </div >
            </div >
        </div >
    );
};

export default ListUsersRoleAccess;