'use client' 
 //ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const GeoLOcationList = () => {


    const { data: employeeList = [], isLoading, refetch
    } = useQuery({
        queryKey: ['employeeList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`)

            const data = await res.json()
            return data
        }
    })

    console.log(employeeList)



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
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'employee')

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
    const filteredBtnIconLiveLocation = brandList.filter(btn =>
        btn.method_sort === 10
    );

    const filteredBtnPromotionCreate = brandList.filter(btn =>
        btn.method_sort === 9
    );

    const employee_delete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete${id}`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_delete/${id}`, {
                method: "POST",

            })
                .then(Response => Response.json())
                .then(data => {
                    refetch()
                    console.log(data)
                })
        }
    }


    return (
        <div className="container-fluid">

            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Geo Location List</h5>

                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/geo_location/geo_location_all?page_group`} className="btn btn-sm btn-info">Back Geo Location List</Link>
                                        <Link href={`/Admin/employee/google_map`} className="btn btn-sm btn-info ml-2"><FaMapMarkerAlt></FaMapMarkerAlt> </Link>
                                    </div>
                                </div>
                                <div className="card-body">

                                    <div className='table-responsive'>

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
                                                        join date
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
                                                    employeeList?.map((employee, i) => (
                                                        <tr key={employee.id}>
                                                            <td>    {i + 1}</td>

                                                            <td>
                                                                {employee.full_name}
                                                            </td>
                                                            <td>
                                                                {employee.join_date}
                                                            </td>


                                                            <td>

                                                                <div className="flex items-center ">
                                                                    <Link title='Location' href={`/Admin/employee/employee_google_map/${employee.user_id}`} className="btn btn-sm btn-info ml-2 mt-1"><FaMapMarkerAlt></FaMapMarkerAlt> </Link>
                                                                    <Link href={`/Admin/employee/employee_live_location/${employee.user_id}?page_group=${page_group}`}>
                                                                        {filteredBtnIconLiveLocation.map((filteredBtnIconEdit => (
                                                                            <button
                                                                                key={filteredBtnIconEdit.id}
                                                                                title='Live'
                                                                                style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                className={filteredBtnIconEdit?.btn}
                                                                            >
                                                                                <a
                                                                                    dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                                ></a>
                                                                            </button>
                                                                        )))}
                                                                    </Link>
                                                                </div></td>
                                                        </tr>
                                                    )

                                                    )



                                                }
                                            </tbody>

                                        </table>
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

export default GeoLOcationList;