'use client' 
 //ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const OfficeVisitList = ({ searchParams }) => {

    const { data: office_visits = [], isLoading, refetch
    } = useQuery({
        queryKey: ['office_visits'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_all`)

            const data = await res.json()
            return data
        }
    })

    console.log(office_visits)

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
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'office_visit')

    //   console.log(filteredModuleInfo);


    const filteredBtnIconEdit = brandList.filter(btn =>
        btn.method_sort === 3
    );
    const filteredBtnIconRemarks = brandList.filter(btn =>
        btn.method_sort === 10
    );

    const filteredBtnIconPerson = brandList.filter(btn =>
        btn.method_sort === 9
    );

    const filteredBtnIconDelete = brandList.filter(btn =>
        btn.method_sort === 5
    );
    const filteredBtnIconCreate = brandList.filter(btn =>
        btn.method_sort === 1
    );

    // Paigination start
    const parentUsers = office_visits

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
    const [pageUserss, setPageUsers] = useState([]);
    // const caregory_list = async () => {
    //     const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_list/${currentPage}/${dataPerPage}`;
    //     const response = await fetch(url);
    //     const data = await response.json();
    //     setPageUsers(data);
    // };
    const caregory_list = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_list/${currentPage}/${dataPerPage}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            let data = await response.json();
            // Sort data by id in descending order
            data = data.sort((a, b) => b.id - a.id);
            setPageUsers(data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };
    
    useEffect(() => {
        caregory_list();
    }, [currentPage]);


    const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;

    const office_visit_delete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete${id}`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_delete/${id}`, {
                method: "POST",

            })
                .then(Response => Response.json())
                .then(data => {
                    refetch()
                    caregory_list()
                    console.log(data)
                })
        }
    }

    const [message, setMessage] = useState();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (sessionStorage.getItem("message")) {
                setMessage(sessionStorage.getItem("message"));
                sessionStorage.removeItem("message");
            }
        }
    }, [])

    console.log(pageUserss)
    const pageUsers = pageUserss.sort((a, b) => b.id - a.id);


    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    {
                        message &&

                        <div className="alert alert-success font-weight-bold">
                            {message}
                        </div>
                    }
                    <div className='card'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Office Visit List</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/office_visit/office_visit_create?page_group`} className="btn btn-sm btn-info">Back Office Visit Create</Link>
                                    </div>
                                </div>
                                
                                <div class="card-body">
                                    <div className='table-responsive'>
                                        <div className=" d-flex justify-content-between">
                                            <div>
                                                Total Data: {totalData}
                                            </div>
                                            <div class="pagination float-right pagination-sm border">
                                                {
                                                    currentPage - 3 >= 1 && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_all?page=${1}`}>‹ First</Link>
                                                    )
                                                }
                                                {
                                                    currentPage > 1 && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_all?page=${activePage - 1}`}>&lt;</Link>
                                                    )
                                                }
                                                {
                                                    pageNumber.map((page) =>
                                                        <Link
                                                            key={page}
                                                            href={`/Admin/office_visit/office_visit_all?page=${page}`}
                                                            className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                        > {page}
                                                        </Link>
                                                    )
                                                }
                                                {
                                                    currentPage < totalPages && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_all?page=${activePage + 1}`}>&gt;</Link>
                                                    )
                                                }
                                                {
                                                    currentPage + 3 <= totalPages && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_all?page=${totalPages}`}>Last ›</Link>
                                                    )
                                                }
                                            </div>

                                        </div>
                                        <table className="table  table-bordered table-hover table-striped table-sm">
                                            <thead>

                                                <tr>
                                                    <th>

                                                        Serial
                                                    </th>
                                                    <th style={{
                                                        wordBreak: 'break-all',
                                                        wordWrap: 'break-word',
                                                        whiteSpace: 'normal',
                                                    }}>
                                                        Name
                                                    </th>
                                                    <th>
                                                        Address
                                                    </th>
                                                    <th style={{
                                                        wordBreak: 'break-all',
                                                        wordWrap: 'break-word',
                                                        whiteSpace: 'normal',
                                                    }}>
                                                        Email
                                                    </th>
                                                    {/* <th style={{
                                                        wordBreak: 'break-all',
                                                        wordWrap: 'break-word',
                                                        whiteSpace: 'normal',
                                                    }}>
                                                        Remarks
                                                    </th>
                                                    <th style={{
                                                        wordBreak: 'break-all',
                                                        wordWrap: 'break-word',
                                                        whiteSpace: 'normal',
                                                    }}>
                                                        Person
                                                    </th> */}


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
                                                    pageUsers.map((office_visit, i) => (
                                                        <tr key={office_visit.id}>
                                                            <td>    {i + 1}</td>

                                                            <td style={{
                                                                wordBreak: 'break-all',
                                                                wordWrap: 'break-word',
                                                                whiteSpace: 'normal',
                                                            }}>
                                                                {office_visit?.office_name}
                                                            </td>

                                                            <td>
                                                                {office_visit.office_address}
                                                            </td>
                                                            <td style={{
                                                                wordBreak: 'break-all',
                                                                wordWrap: 'break-word',
                                                                whiteSpace: 'normal',
                                                            }}>
                                                                {office_visit.office_email}
                                                            </td>

                                                            {/* <td style={{
                                                                wordBreak: 'break-all',
                                                                wordWrap: 'break-word',
                                                                whiteSpace: 'normal',
                                                            }}>
                                                                {office_visit?.remarks?.map(remark => remark.remarks)}
                                                            </td>
                                                            <td style={{
                                                                wordBreak: 'break-all',
                                                                wordWrap: 'break-word',
                                                                whiteSpace: 'normal',
                                                            }}>
                                                                {office_visit?.persons?.map(person => person.person_name)}
                                                            </td> */}

                                                            <td>

                                                                <div className="flex items-center ">
                                                                    <Link href={`/Admin/office_visit/office_visit_edit/${office_visit.id}?page_group=${page_group}`}>
                                                                        {filteredBtnIconEdit.map((filteredBtnIconEdit => (
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
                                                                    <Link href={`/Admin/office_visit/office_visit_remarks/${office_visit.id}?page_group=${page_group}`}>
                                                                        {filteredBtnIconRemarks.map((filteredBtnIconEdit => (
                                                                            <button
                                                                                key={filteredBtnIconEdit.id}
                                                                                title='Remarks'
                                                                                style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                className={filteredBtnIconEdit?.btn}
                                                                            >
                                                                                <a
                                                                                    dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                                ></a>
                                                                            </button>
                                                                        )))}
                                                                    </Link>

                                                                    <Link href={`/Admin/office_visit/office_visit_person/${office_visit.id}?page_group=${page_group}`}>
                                                                        {filteredBtnIconPerson?.map((filteredBtnIconEdit => (
                                                                            <button
                                                                                key={filteredBtnIconEdit.id}
                                                                                title='Person'
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
                                                                            onClick={() => office_visit_delete(office_visit.id)}
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
                                        <div className=" d-flex justify-content-between">
                                            <div>
                                                Total Data: {totalData}
                                            </div>
                                            <div class="pagination float-right pagination-sm border">
                                                {
                                                    currentPage - 3 >= 1 && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_all?page=${1}`}>‹ First</Link>
                                                    )
                                                }
                                                {
                                                    currentPage > 1 && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_all?page=${activePage - 1}`}>&lt;</Link>
                                                    )
                                                }
                                                {
                                                    pageNumber.map((page) =>
                                                        <Link
                                                            key={page}
                                                            href={`/Admin/office_visit/office_visit_all?page=${page}`}
                                                            className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                        > {page}
                                                        </Link>
                                                    )
                                                }
                                                {
                                                    currentPage < totalPages && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_all?page=${activePage + 1}`}>&gt;</Link>
                                                    )
                                                }
                                                {
                                                    currentPage + 3 <= totalPages && (
                                                        <Link className=" text-primary px-2 border-left py-1" href={`/Admin/office_visit/office_visit_all?page=${totalPages}`}>Last ›</Link>
                                                    )
                                                }
                                            </div>

                                        </div>
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

export default OfficeVisitList;