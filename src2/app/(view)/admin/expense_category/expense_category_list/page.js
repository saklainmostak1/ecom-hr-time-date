'use client' 
 //ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import '../../../admin_layout/modal/fa.css'
import Swal from 'sweetalert2';

const ExpenceAllCategory = ({searchParams}) => {


    const { data: expenseCategory = [], isLoading, refetch
    } = useQuery({
        queryKey: ['expenseCategory'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expence_category/expence_category_all`)

            const data = await res.json()
            return data
        }
    })
    const [page_group, setPage_group] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pageGroup') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('pageGroup');
            setPage_group(storedUserId);
        }
    }, []);
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

    // console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'brand'))
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'expense_category')

    //   console.log(filteredModuleInfo);


    const filteredBtnIconEdit = brandList.filter(btn =>
        btn.method_sort === 3
    );
    const filteredBtnIconCopy = brandList.filter(btn =>
        btn.method_sort === 4
    );



    const filteredBtnIconDelete = brandList.filter(btn =>
        btn.method_sort === 5
    );
    const filteredBtnIconCreate = brandList.filter(btn =>
        btn.method_sort === 1
    );


    // Paigination start
    const parentUsers = expenseCategory;

    const totalData = parentUsers?.length;
    const dataPerPage = 20;

    const totalPages = Math.ceil(totalData / dataPerPage);

    let currentPage = 1;

    if (Number(searchParams.page) >= 1) {
        currentPage = Number(searchParams.page);
    }

    let pageNumber = [];
    for (let index = currentPage - 2; index <= currentPage + 2; index++) {
        if (index < 1) {
            continue;
        }
        if (index > totalPages) {
            break;
        }
        pageNumber.push(index);
    }
    const [pageUsers, setPageUsers] = useState([]);
    const caregory_list = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expence_category/expence_category_list_paigination/${currentPage}/${dataPerPage}`;
        const response = await fetch(url);
        const data = await response.json();
        setPageUsers(data);
    };
    useEffect(() => {
        caregory_list();
    }, [currentPage]);

    const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;


    // const expense_category_delete = id => {

    //     console.log(id)
    //     const proceed = window.confirm(`Are You Sure delete${id}`)
    //     if (proceed) {
    //         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expence_category/expence_category_delete/${id}`, {
    //             method: "POST",

    //         })
    //             .then(Response => Response.json())
    //             .then(data => {

    //                 console.log(data)
    //             })
    //     }
    // }


    const expense_category_delete = async (id) => {
        console.log(id);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/expence_category/expence_category_delete/${id}`,
                {
                    method: "POST",
                }
            );

            if (response.ok) {
                const proceed = window.confirm(
                    "Are you sure you want to delete this item?"
                );
                if (proceed) {
                    refetch();
                    caregory_list();
                    console.log("Item deleted successfully.");
                } else {
                    console.log("Delete action canceled.");
                }
            } else {
                alert("Data already running. You can't delete this item.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while deleting the data. Please try again.");
        }
    };



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
                        <div class=" bg-light body-content">
                            <div class=" border-primary shadow-sm border-0" >
                                <div class="card-header custom-card-header  py-1  clearfix bg-gradient-primary text-white" style={{ backgroundColor: '#4267b2' }}>
                                    <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Expense Category List</h5>
                                    <div class="card-title card-header-color font-weight-bold mb-0  float-right"> <Link href="/Admin/expense_category/expense_category_create?page_group=account_management" class="btn btn-sm btn-info">Create Expense category</Link> </div>
                                </div>
                                <div class="card-body">
                                    <div className='table-responsive'>
                                        {/* page start */}
                                        <div className=" d-flex justify-content-between">
                                            <div>Total Data: {totalData}</div>
                                            <div class="pagination float-right pagination-sm border">
                                                {currentPage - 3 >= 1 && (
                                                    <Link
                                                        className=" text-primary px-2 border-left py-1"
                                                        href={`/Admin/expense_category/expense_category_all?page=${1}`}
                                                    >
                                                        ‹ First
                                                    </Link>
                                                )}
                                                {currentPage > 1 && (
                                                    <Link
                                                        className=" text-primary px-2 border-left py-1"
                                                        href={`/Admin/expense_category/expense_category_all?page=${activePage - 1
                                                            }`}
                                                    >
                                                        &lt;
                                                    </Link>
                                                )}
                                                {pageNumber.map((page) => (
                                                    <Link
                                                        key={page}
                                                        href={`/Admin/expense_category/expense_category_all?page=${page}`}
                                                        className={` ${page === activePage
                                                            ? "font-bold bg-primary px-2 border-left py-1 text-white"
                                                            : "text-primary px-2 border-left py-1"
                                                            }`}
                                                    >
                                                        {" "}
                                                        {page}
                                                    </Link>
                                                ))}
                                                {currentPage < totalPages && (
                                                    <Link
                                                        className=" text-primary px-2 border-left py-1"
                                                        href={`/Admin/expense_category/expense_category_all?page=${activePage + 1
                                                            }`}
                                                    >
                                                        &gt;
                                                    </Link>
                                                )}
                                                {currentPage + 3 <= totalPages && (
                                                    <Link
                                                        className=" text-primary px-2 border-left py-1"
                                                        href={`/Admin/expense_category/expense_category_all?page=${totalPages}`}
                                                    >
                                                        Last ›
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                        {/* page end */}
                                        <table className="table  table-bordered table-hover table-striped table-sm">
                                            <thead>
                                                <tr>
                                                    <th>

                                                        Serial
                                                    </th>
                                                    <th>
                                                        Name
                                                    </th>
                                                    <th>
                                                        Full Name
                                                    </th>

                                                    <th>
                                                        Created Date
                                                    </th>
                                                    <th>
                                                        Action
                                                    </th>
                                                </tr>

                                            </thead>

                                            <tbody>
                                                {isLoading ? <div className='text-center'>
                                                    <div className='  text-center text-dark'
                                                    >
                                                        <FontAwesomeIcon style={{
                                                            height: '33px',
                                                            width: '33px',
                                                        }} icon={faSpinner} spin />
                                                    </div>
                                                </div>
                                                    :
                                                    pageUsers.map((expense_category, i) => (
                                                        <tr key={expense_category.id}>
                                                            <td>    {i + 1}</td>
                                                            <td>{expense_category.expense_category_name}</td>
                                                            <td>
                                                                {expense_category.created_by}
                                                            </td>

                                                            <td>{expense_category.created_date.slice(0,10)}</td>

                                                            <td>  <div className="flex items-center ">
                                                                <Link href={`/Admin/expense_category/expense_category_edit/${expense_category.id}?page_group=${page_group}`}>
                                                                    {filteredBtnIconEdit?.map((filteredBtnIconEdit => (
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
                                                                    )))}
                                                                </Link>
                                                                <Link href={`/Admin/expense_category/expense_category_copy/${expense_category.id}?page_group=${page_group}`}>
                                                                    {filteredBtnIconCopy.map((filteredBtnIconEdit => (
                                                                        <button
                                                                            key={filteredBtnIconEdit.id}
                                                                            title='Copy'
                                                                            style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                            className={filteredBtnIconEdit?.btn}
                                                                        >
                                                                            <a
                                                                                dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                            ></a>
                                                                        </button>
                                                                    )))}
                                                                </Link>
                                                                {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                    <button
                                                                        key={filteredBtnIconDelete.id}
                                                                        title='Delete'
                                                                        onClick={() => expense_category_delete(expense_category.id)}
                                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                        className={filteredBtnIconDelete?.btn}
                                                                    >
                                                                        <a
                                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                        ></a>
                                                                    </button>
                                                                )))}
                                                            </div></td>
                                                        </tr>
                                                    )

                                                    )



                                                }
                                            </tbody>

                                        </table>


                                        {/* page start */}
                                        <div className=" d-flex justify-content-between">
                                            <div>Total Data: {totalData}</div>
                                            <div class="pagination float-right pagination-sm border">
                                                {currentPage - 3 >= 1 && (
                                                    <Link
                                                        className=" text-primary px-2 border-left py-1"
                                                        href={`/Admin/expense_category/expense_category_all?page=${1}`}
                                                    >
                                                        ‹ First
                                                    </Link>
                                                )}
                                                {currentPage > 1 && (
                                                    <Link
                                                        className=" text-primary px-2 border-left py-1"
                                                        href={`/Admin/expense_category/expense_category_all?page=${activePage - 1
                                                            }`}
                                                    >
                                                        &lt;
                                                    </Link>
                                                )}
                                                {pageNumber.map((page) => (
                                                    <Link
                                                        key={page}
                                                        href={`/Admin/expense_category/expense_category_all?page=${page}`}
                                                        className={` ${page === activePage
                                                                ? "font-bold bg-primary px-2 border-left py-1 text-white"
                                                                : "text-primary px-2 border-left py-1"
                                                            }`}
                                                    >
                                                        {" "}
                                                        {page}
                                                    </Link>
                                                ))}
                                                {currentPage < totalPages && (
                                                    <Link
                                                        className=" text-primary px-2 border-left py-1"
                                                        href={`/Admin/expense_category/expense_category_all?page=${activePage + 1
                                                            }`}
                                                    >
                                                        &gt;
                                                    </Link>
                                                )}
                                                {currentPage + 3 <= totalPages && (
                                                    <Link
                                                        className=" text-primary px-2 border-left py-1"
                                                        href={`/Admin/expense_category/expense_category_all?page=${totalPages}`}
                                                    >
                                                        Last ›
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                        {/* page end */}

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ExpenceAllCategory;