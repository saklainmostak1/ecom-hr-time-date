'use client' 
 //ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import * as XLSX from "xlsx";
import { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun, ImageRun, WidthType } from 'docx';


const WareHouseLists = ({ searchParams }) => {


    const [name, setName] = useState('')
    const [mobile, setMobile] = useState('')
    const [status, setStatus] = useState('')
    const [searchResults, setSearchResults] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errorr, setErrorr] = useState(null)

    const { data: asset_typeAll = [], isLoading, refetch
    } = useQuery({
        queryKey: ['asset_typeAll'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/ware_house/ware_house_all`)

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
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'ware_house')

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
    const parentUsers = asset_typeAll

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
    const [pageUsers, setPageUsers] = useState([]);
    const caregory_list = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/ware_house/ware_house_all_paigination/${currentPage}/${dataPerPage}`;
        const response = await fetch(url);
        const data = await response.json();
        setPageUsers(data);
    };
    useEffect(() => {
        caregory_list();
    }, [currentPage]);

    const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;


    const asset_type_delete = id => {


        console.log(id);


        // const proceed = window.confirm(`Are You Sure delete${id}`)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/ware_house/ware_house_delete/${id}`, {
            method: "POST",
        })
            .then(response => {
                console.log(response)
                response.json()
                if (response.ok === true) {
                    const procced = window.confirm(`Are You Sure delete`)
                    if (procced)
                        refetch();
                    caregory_list()


                }
                else {
                    alert('Data already running. You cant Delete this item.');
                }
            })
            .then(data => {
                if (data) {

                    console.log(data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the data. Please try again.');
            });
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



    const asset_search = () => {
        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/ware_house/ware_house_search`, {
          name, mobile

        })
            .then(response => {
                setSearchResults(response.data.results);
                setError(null);
                setLoading(false);
                if (response.data.results == '') {
                    alert('Nothing found!');
                }
            })
            .catch(error => {
                setError("An error occurred during search.", error);
                setSearchResults([]);
            });
    };



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
                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Ware House Search</h5>
                                </div>
                                <div className="card-body">
                                    <form >
                                        <div className="col-md-10 offset-md-1">
                                            <div className="form-group row">
                                                <label className="col-form-label col-md-2"><strong>Name:</strong></label>

                                                <div className="col-md-4">
                                                    <input class="form-control form-control-sm  alpha_space item_name" type="text"
                                                        placeholder='Enter Name'
                                                        value={name} onChange={(e) => setName(e.target.value)}

                                                    />

                                                </div>

                                                <label className="col-form-label col-md-2"><strong>Mobile:</strong></label>

                                                <div className="col-md-4">
                                                    <input class="form-control form-control-sm  alpha_space item_name" type="text"
                                                        placeholder='Enter Mobile'
                                                        value={mobile} onChange={(e) => setMobile(e.target.value)}

                                                    />

                                                </div>

                                               
                                            </div>
                                         
                                        

                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-2 col-md-8 float-left">
                                                <input type="button" name="search" className="btn btn-sm btn-info" value="Search"
                                                    onClick={asset_search}
                                                />
                                               
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='card'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">List Ware House</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/ware_house/ware_house_create?page_group`} className="btn btn-sm btn-info">Ware House Create</Link>
                                    </div>
                                </div>
                                {loading ? (
                                    <div className='text-center'>
                                        <div className='text-center text-dark'>
                                            <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
                                        </div>
                                    </div>
                                ) : (


                                    searchResults?.length > 0 ? (

                                        <div class="card-body">
                                            <div className='table-responsive'>
                                                <div className=" d-flex justify-content-between">
                                                    <table className="table  table-bordered table-hover table-striped table-sm">
                                                        <thead>

                                                            <tr>
                                                                <th>

                                                                    SL No.
                                                                </th>
                                                                <th>
                                                                    Name
                                                                </th>
                                                                <th>
                                                                    Mobile
                                                                </th>
                                                                <th>
                                                                    Email
                                                                </th>
                                                                <th>
                                                                    Address
                                                                </th>

                                                                <th>
                                                                    Action
                                                                </th>
                                                            </tr>

                                                        </thead>


                                                        <tbody>
                                                            {searchResults.map((asset_type, i) => (
                                                                <tr key={asset_type.id}>
                                                                    <td>    {i + 1}</td>

                                                                    <td>
                                                                        {asset_type?.name}
                                                                    </td>

                                                                   
                                                                    <td>
                                                                        {asset_type.mobile}
                                                                    </td>

                                                                    <td>
                                                                        {asset_type.email}
                                                                    </td>

                                                                    <td>
                                                                        {asset_type.address}
                                                                    </td>



                                                                    <td>

                                                                        <div className="flex items-center ">
                                                                            <Link href={`/Admin/ware_house/ware_house_edit/${asset_type.id}?page_group=${page_group}`}>
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
                                                                            {/* <Link href={`/Admin/asset_type/asset_type_copy/${asset_type.id}?page_group=${page_group}`}>
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
                          </Link> */}
                                                                            {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                                <button
                                                                                    key={filteredBtnIconDelete.id}
                                                                                    title='Delete'
                                                                                    onClick={() => asset_type_delete(asset_type.id)}
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
                                                            ))}
                                                        </tbody>


                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                    ) : (
                                        <div class="card-body">
                                            <div className='table-responsive'>
                                                <div className=" d-flex justify-content-between">
                                                    <div>
                                                        Total Data: {totalData}
                                                    </div>
                                                    <div class="pagination float-right pagination-sm border">
                                                        {
                                                            currentPage - 3 >= 1 && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/ware_house/ware_house_all?page=${1}`}>‹ First</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage > 1 && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/ware_house/ware_house_all?page=${activePage - 1}`}>&lt;</Link>
                                                            )
                                                        }
                                                        {
                                                            pageNumber.map((page) =>
                                                                <Link
                                                                    key={page}
                                                                    href={`/Admin/ware_house/ware_house_all?page=${page}`}
                                                                    className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                                > {page}
                                                                </Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage < totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/ware_house/ware_house_all?page=${activePage + 1}`}>&gt;</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage + 3 <= totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/ware_house/ware_house_all?page=${totalPages}`}>Last ›</Link>
                                                            )
                                                        }
                                                    </div>

                                                </div>
                                                <table className="table  table-bordered table-hover table-striped table-sm">
                                                    <thead>

                                                        <tr>
                                                            <th>

                                                                SL No.
                                                            </th>
                                                            <th>
                                                             Name
                                                            </th>
                                                            <th>
                                                                Mobile
                                                            </th>
                                                            <th>
                                                                Email
                                                            </th>
                                                            <th>
                                                                Address
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
                                                            pageUsers.map((asset_type, i) => (
                                                                <tr key={asset_type.id}>
                                                                    <td>    {i + 1}</td>

                                                                    <td>
                                                                        {asset_type?.name}
                                                                    </td>

                                                                   
                                                                    <td>
                                                                        {asset_type.mobile}
                                                                    </td>

                                                                    <td>
                                                                        {asset_type.email}
                                                                    </td>

                                                                    <td>
                                                                        {asset_type.address}
                                                                    </td>




                                                                    <td>

                                                                        <div className="flex items-center ">
                                                                            <Link href={`/Admin/ware_house/ware_house_edit/${asset_type.id}?page_group=${page_group}`}>
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
                                                                            {/* <Link href={`/Admin/asset_type/asset_type_copy/${asset_type.id}?page_group=${page_group}`}>
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
                                    </Link> */}
                                                                            {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                                <button
                                                                                    key={filteredBtnIconDelete.id}
                                                                                    title='Delete'
                                                                                    onClick={() => asset_type_delete(asset_type.id)}
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
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/ware_house/ware_house_all?page=${1}`}>‹ First</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage > 1 && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/ware_house/ware_house_all?page=${activePage - 1}`}>&lt;</Link>
                                                            )
                                                        }
                                                        {
                                                            pageNumber.map((page) =>
                                                                <Link
                                                                    key={page}
                                                                    href={`/Admin/ware_house/ware_house_all?page=${page}`}
                                                                    className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                                                                > {page}
                                                                </Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage < totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/ware_house/ware_house_all?page=${activePage + 1}`}>&gt;</Link>
                                                            )
                                                        }
                                                        {
                                                            currentPage + 3 <= totalPages && (
                                                                <Link className=" text-primary px-2 border-left py-1" href={`/Admin/ware_house/ware_house_all?page=${totalPages}`}>Last ›</Link>
                                                            )
                                                        }
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WareHouseLists;