'use client' 
 //ismile
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import '../../../admin_layout/modal/fa.css'
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
// import '../userStyle.css'
import Link from 'next/link';
import { getAllAdminData } from '@/api/adminPage';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";




const AdminPageListA = ({ searchParams }) => {

    const [users, setUsers] = useState([]);
    const [pageUsers, setPageUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        module_info_list()
    }, [])

    const module_info_list = () => {
        getAllAdminData().then(data => {
            setUsers(data)
            setLoading(false)
        })
    }

    // paigination
    const parentUsers = users.filter((users) => users.parent_id === 0);

    const totalData = parentUsers?.length
    const dataPerPage = 20

    const totalPages = Math.ceil(totalData / dataPerPage)

    let currentPage = 1


    if (Number(searchParams.page) >= 1) {
        currentPage = Number(searchParams.page)
    }


    let pageNumber = []
    for (let index = currentPage - 2; index <= currentPage + 2; index++) {
        if (index < 1) {
            continue
        }
        if (index > totalPages) {
            break
        }
        pageNumber.push(index)
    }


    // paigination

    const editIcon = []
    const copyIcon = []
    const deleteIcon = []

    for (let index = 0; index < pageUsers.length; index++) {
        const element = pageUsers[index];
        const allChildren = users.filter(u => u?.parent_id === element?.id)
        const editAll = allChildren.filter(edit => edit?.method_sort === 3)
        const copyAll = allChildren.filter(copy => copy?.method_sort === 4)
        const deleteAll = allChildren.filter(d => (d?.method_sort) === 5)
        editIcon.push(editAll)
        copyIcon.push(copyAll)
        deleteIcon.push(deleteAll)

    }



    const module_info_all = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Pagination/${currentPage}/${dataPerPage}`;
        const response = await fetch(url);
        const data = await response.json();
        setPageUsers(data);
    };
    useEffect(() => {
        module_info_all();
    }, [currentPage]);

    const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;
    const module_info_delete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete${id}`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/delete/${id}`, {
                method: "POST",

            })
                .then(Response => Response.json())
                .then(data => {

                    if (data.affectedRows > 0) {
                        module_info_all()
                        console.log(data)
                    }
                })
        }
    }

    // const module_info_delete = (id) => {
    //     const proceed = window.confirm('Are you sure you want to delete?');
    //     const idArr = [id]

    //     const allChildren = users.filter(u => u?.parent_id === id)
    //     for (let index = 0; index < allChildren.length; index++) {
    //         const element = allChildren[index];
    //         idArr.push(element?.id)
    //     }

    //     for (let index = 0; index < idArr.length; index++) {
    //         const id = idArr[index];
    //         const deleteId = { id }
    //         if (proceed) {
    //             fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/delete`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'content-type': 'application/json'
    //                 },
    //                 body: JSON.stringify(deleteId)
    //             })
    //                 .then((response) => response.json())
    //                 .then((data) => {
    //                     if (data.affectedRows > 0) {
    //                         Swal.fire({
    //                             title: 'Delete!',
    //                             text: 'User deleted successfully!',
    //                             icon: 'success',
    //                             confirmButtonText: 'Ok',
    //                         });
    //                     }
    //                     module_info_list()
    //                     module_info_all();
    //                 })
    //         }
    //     }

    // };
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


                        {
                            loading ? <>
                               <div>
                                <p>Loading....</p>
                               </div>
                            </> : <>

                                <div className=" bg-light rounded">
                                    <li className="list-group-item text-light  p-1 px-4" aria-current="true" style={{ background: '#4267b2' }}>
                                        <div className='d-flex justify-content-between'>
                                            <h5 className='mt-2'> Module Info List</h5>
                                            <button style={{ background: '#17a2b8' }} className='border-0 text-white shadow-sm rounded-1 rounded'><Link href='/Admin/module_info/module_info_create'>Module Info Create</Link></button>
                                        </div>
                                    </li>
                                    <Table responsive="lg">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Display Name</th>
                                                <th>Controller Name</th>
                                                <th>Page Group</th>
                                                <th>Options</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                pageUsers?.map((adminPageAll, index) =>
                                                    <tr key={adminPageAll.id} >
                                                        <td>

                                                            {((currentPage - 1) * 20) + (index + 1)}

                                                        </td>
                                                        <td>
                                                            <p className=" text-sm">
                                                                {adminPageAll.display_name}
                                                            </p>
                                                        </td>

                                                        <td>
                                                            <p className=" text-sm">
                                                                {adminPageAll.controller_name}
                                                            </p>
                                                        </td>

                                                        <td>
                                                            <p className=" text-sm">
                                                                {adminPageAll.page_group}
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div className="flex items-center">
                                                                {
                                                                    editIcon[index]?.map((e, i) =>
                                                                        <Link key={e?.id} href={`/Admin/module_info/module_info_edit/${adminPageAll.id}?page_group=${adminPageAll.page_group}`}>
                                                                            <button
                                                                                title='Edit'
                                                                                style={{ width: "35px ", height: '30px', marginLeft: '2px' }}
                                                                                className={e?.btn}
                                                                            >
                                                                                <div>
                                                                                    <span
                                                                                        dangerouslySetInnerHTML={{ __html: e?.icon }}
                                                                                    ></span>
                                                                                </div>

                                                                            </button>
                                                                        </Link>

                                                                    )
                                                                }
                                                                {
                                                                    copyIcon[index]?.map((c, i) =>
                                                                        <Link key={c?.id} href={`/Admin/module_info/module_info_copy/${adminPageAll.id}?page_group=${adminPageAll.page_group}`}>
                                                                            <button
                                                                                title='Copy' style={{ width: "35px ", height: '30px', marginLeft: '2px' }}
                                                                                className={c?.btn}
                                                                            >
                                                                                <div>
                                                                                    <span
                                                                                        dangerouslySetInnerHTML={{ __html: c?.icon }}
                                                                                    ></span>
                                                                                </div>

                                                                            </button>
                                                                        </Link>

                                                                    )
                                                                }
                                                                {
                                                                    deleteIcon[index]?.map((d, i) =>
                                                                        <button
                                                                            key={d?.id}
                                                                            title='Delete'
                                                                            onClick={() => module_info_delete(adminPageAll.id)}
                                                                            style={{ width: "35px ", height: '30px', marginLeft: '2px' }}
                                                                            className={d?.btn}
                                                                        >
                                                                            <div>
                                                                                <span
                                                                                    dangerouslySetInnerHTML={{ __html: d?.icon }}
                                                                                ></span>
                                                                            </div>

                                                                        </button>

                                                                    )
                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            }


                                            {
                                                loading && <tr className='text-center'>
                                                    <td colSpan='100%' className='my-5 py-5 border-bottom-0 '>
                                                        <div className=' my-5 py-5 text-primary'>
                                                            <FontAwesomeIcon style={{
                                                                height: '40px',
                                                                width: '40px',
                                                            }} icon={faSpinner} spin />
                                                        </div>

                                                    </td>
                                                </tr>
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </>
                        }
                        <div className=" d-flex justify-content-between">
                            <div>
                                Total Data: {totalData}
                            </div>
                            <div class="pagination float-right pagination-sm border">
                                {
                                    currentPage - 3 >= 1 && (
                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/module_info/module_info_all?page=${1}`}>‹ First</Link>
                                    )
                                }
                                {
                                    currentPage > 1 && (
                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/module_info/module_info_all?page=${activePage - 1}`}>&lt;</Link>
                                    )
                                }
                                {
                                    pageNumber.map((page) =>
                                        <Link
                                            key={page}
                                            href={`/Admin/module_info/module_info_all?page=${page}`}
                                            className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                        > {page}
                                        </Link>
                                    )
                                }
                                {
                                    currentPage < totalPages && (
                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/module_info/module_info_all?page=${activePage + 1}`}>&gt;</Link>
                                    )
                                }
                                {
                                    currentPage + 3 <= totalPages && (
                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/module_info/module_info_all?page=${totalPages}`}>Last ›</Link>
                                    )
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminPageListA;

