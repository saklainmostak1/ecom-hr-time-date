'use client'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const SmsApiList = () => {

 
   

    const {
        data: smsApiLists = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["smsApiLists"],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sms_api/sms_api_all`
            );
    
            const data = await res.json();
            // Assuming data is an array of objects and each object has an 'id' property
            return data.sort((a, b) => b.id - a.id); // Sort in descending order by ID
        },
    });


    const [message, setMessage] = useState();
    useEffect(() => {
        if (typeof window !== 'undefined') {

            if (sessionStorage.getItem("message")) {
                setMessage(sessionStorage.getItem("message"));
                sessionStorage.removeItem("message");
            }
        }
    }, [])


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
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'sms_api')

    //   console.log(filteredModuleInfo);


    const filteredBtnIconEdit = brandList.filter(btn =>
        btn.method_sort === 3
    );
    const filteredBtnIconCopy = brandList.filter(btn =>
        btn.method_sort === 4
    );

    const filteredBtnIconView = brandList.filter(btn =>
        btn.method_sort === 6
    );
    console.log(filteredBtnIconView)


    const filteredBtnIconDelete = brandList.filter(btn =>
        btn.method_sort === 5
    );
    const filteredBtnIconCreate = brandList.filter(btn =>
        btn.method_sort === 1
    );

    console.log(brandList)


    // /Admin/sms_api/sms_api_delete/:id

    const sms_api_delete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete this Item`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sms_api/sms_api_delete/${id}`, {
                method: "POST",

            })
                .then(Response => Response.json())
                .then(data => {
                    refetch()
                    if (data.affectedRows > 0) {
                        refetch()
                        console.log(data)
                    }
                })
        }
    }

    // const [balance, setBalance] = useState(null);
    // const url = smsApiLists[0]?.balance_url;

    // useEffect(() => {
    //     const fetchBalance = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost:5002/api/balance`, {
    //                 params: { url },
    //             });
    //             console.log('Balance data:', response.data);
    //             setBalance(response.data);
    //         } catch (error) {
    //             console.error('Error:', error);
    //         }
    //     };

    //     if (url) { // Check if url is valid before fetching
    //         fetchBalance();
    //     }
    // }, [url]);

    // console.log(balance.Balance);
    // const [balanceData, setBalanceData] = useState({});

    // useEffect(() => {
    //     const fetchBalances = async () => {
    //         try {
    //             const balancePromises = smsApiLists?.map(async (sms_api) => {
    //                 const response = await axios.get(`http://localhost:5002/api/balance`, {
    //                     params: { url: sms_api?.balance_url }, // Assuming each SMS API has a balance_url
    //                 });
    //                 return { id: sms_api.id, balance: response.data.Balance };
    //             });

    //             const balances = await Promise.all(balancePromises);
    //             const balanceMap = balances.reduce((acc, curr) => {
    //                 acc[curr.id] = curr.balance;
    //                 return acc;
    //             }, {});
    //             setBalanceData(balanceMap);
    //         } catch (error) {
    //             console.error('Error fetching balances:', error);
    //         }
    //     };

    //     if (smsApiLists.length > 0) {
    //         fetchBalances();
    //     }
    // }, [smsApiLists]);

    const [balanceData, setBalanceData] = useState({});

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const balancePromises = smsApiLists?.map(async (sms_api) => {
                    try {
                        const response = await axios.get(`http://localhost:5002/api/balance`, {
                            params: { url: sms_api?.balance_url },
                        });

                        // Check if the response has a Balance property
                        // const balance = response.data.Balance !== undefined ? response.data.Balance : 'N/A';
                        const balanceParam = sms_api.balance_param; // Assuming this is the key in the response
                        const balance = response.data[balanceParam] !== undefined ? response.data[balanceParam] : 'N/A'
                        return { id: sms_api.id, balance };
                    } catch (error) {
                        // If an error occurs (like an invalid URL), return null for the balance
                        return { id: sms_api.id, balance: null };
                    }
                });

                const balances = await Promise.all(balancePromises);
                const balanceMap = balances.reduce((acc, curr) => {
                    acc[curr.id] = curr.balance;
                    return acc;
                }, {});
                setBalanceData(balanceMap);
            } catch (error) {
                // Log any errors that occur during the overall fetch
                console.error('Error fetching balances:', error.message);
            }
        };

        if (smsApiLists.length > 0) {
            fetchBalances();
        }
    }, [smsApiLists]);
    // const balance = response.data.Balance !== undefined || response.data.balance !== undefined ? response.data.Balance || response.data.balance : 'N/A';

    console.log(balanceData)
    console.log(smsApiLists)

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 p-4">
                    {message && (
                        <div className="alert alert-success font-weight-bold">
                            {message}
                        </div>
                    )}
                    <div className="card">
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
                                        Sms api List
                                    </h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link
                                            href={`/Admin/sms_api/sms_api_create?page_group`}
                                            className="btn btn-sm btn-info"
                                        >
                                            Create sms api
                                        </Link>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className="table-responsive">

                                        <table className="table  table-bordered table-hover table-striped table-sm">
                                            <thead>
                                                <tr>
                                                    <th>SL No.</th>
                                                    <th>Api Name</th>
                                                    {/* <th>Api URL</th> */}
                                                    <th>Sms Rate</th>
                                                    <th>Balance</th>
                                                    <th>Status</th>
                                                    <th>Method</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {isLoading ? <tr>
                                                    <td colSpan={6} className="text-center">
                                                        <div className='item-center text-center'>
                                                            <FontAwesomeIcon
                                                                className='item-center text-center'
                                                                style={{
                                                                    height: '33px',
                                                                    width: '33px',
                                                                }}
                                                                icon={faSpinner}
                                                                spin
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                                    :
                                                    smsApiLists.map((sms_api, i) => (
                                                        <tr key={sms_api.id}>
                                                            <td>    {i + 1}</td>

                                                            <td>
                                                                {sms_api?.api_name}
                                                            </td>
                                                            {/* <td>
                                                                {sms_api?.api_url}
                                                            </td> */}
                                                            <td>
                                                                {sms_api?.balance_rate}
                                                            </td>
                                                            <td>{balanceData[sms_api.id] || 'N/A'}</td>

                                                            <td>
                                                                {sms_api?.status}
                                                            </td>
                                                            <td>
                                                                {sms_api?.method_name}
                                                            </td>



                                                            <td>

                                                                <div className="flex items-center ">
                                                                    <Link href={`/Admin/sms_api/sms_api_view/${sms_api.id}?page_group=${page_group}`}>
                                                                        {filteredBtnIconView?.map((filteredBtnIconEdit => (
                                                                            <button
                                                                                key={filteredBtnIconEdit.id}
                                                                                title='View'
                                                                                style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                className={filteredBtnIconEdit?.btn}
                                                                            >
                                                                                <a
                                                                                    dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                                ></a>
                                                                            </button>
                                                                        )))}
                                                                    </Link>
                                                                    <Link href={`/Admin/sms_api/sms_api_edit/${sms_api.id}?page_group=${page_group}`}>
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

                                                                    {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                        <button
                                                                            key={filteredBtnIconDelete.id}
                                                                            title='Delete'
                                                                            onClick={() => sms_api_delete(sms_api.id)}
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

export default SmsApiList;