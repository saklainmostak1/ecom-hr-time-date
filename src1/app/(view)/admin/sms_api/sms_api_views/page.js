'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const SmsApiViews = ({ id }) => {


    const { data: allSmsApiList = [] } = useQuery({
        queryKey: ['allSmsApiList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sms_api/sms_api_all/${id}`);
            return res.json();
        }
    });

    const apiData = allSmsApiList[0]
    console.log(allSmsApiList[0])


    const [apiUrl, setApiUrl] = useState('');
    const [apiResponse, setApiResponse] = useState(null);

    // useEffect(() => {
    //     const sortedParams = apiData?.sms_api_params.sort((a, b) => a.options - b.options);

    //     // Construct the query string from the sorted parameters
    //     const queryParams = sortedParams?.map(param => `${param.sms_key}=${encodeURIComponent(param.sms_value)}`)
    //         .join('&');

    //     // Final URL for API call
    //     const constructedUrl = `${apiData?.main_url}${queryParams}`;
    //     setApiUrl(constructedUrl);  // Store the constructed URL in the state

    //     // Fetching the API data
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(constructedUrl);
    //             const result = await response.json();
    //             setApiResponse(result); // Set the API response in state
    //         } catch (error) {
    //             console.error('Error fetching the API:', error);
    //         }
    //     };

    //     // Trigger API call
    //     fetchData();
    // }, [apiData]);


    // useEffect(() => {
    //     const sortedParams = apiData?.sms_api_params?.sort((a, b) => a.options - b.options);

    //     // Construct the query string from the sorted parameters
    //     const queryParams = sortedParams?.map(param => {
    //         // If the `sms_key` is 'number', map it to 'mobile' in the final URL
    //         const key = param?.sms_key === 'number' ? 'mobile' : param?.sms_key;
    //         return `${key}=${encodeURIComponent(param?.sms_value)}`;
    //     }).join('&');

    //     // Final URL for API call
    //     const constructedUrl = `${apiData?.main_url}${queryParams}`;
    //     setApiUrl(constructedUrl);  // Store the constructed URL in the state

    //     // Fetching the API data
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(constructedUrl);
    //             const result = await response.json();
    //             setApiResponse(result); // Set the API response in state
    //         } catch (error) {
    //             console.error('Error fetching the API:', error);
    //         }
    //     };

    //     // Trigger API call
    //     fetchData();
    // }, [apiData])

    useEffect(() => {
        if (!apiData || !apiData?.sms_api_params || apiData?.sms_api_params.length === 0) {
            return; // Exit if apiData or sms_api_params is not available
        }

        const sortedParams = apiData?.sms_api_params?.sort((a, b) => a.options - b.options);

        // Construct the query string from the sorted parameters
        const queryParams = sortedParams?.map(param => {
            // If the `sms_key` is 'number', map it to 'mobile' in the final URL
            // const key = param?.sms_key === 'number' ? 'mobile' : param?.sms_key;
            const key = param?.options === 1 ? 'mobile' : (param?.sms_key === 'number' ? 'mobile' : param?.sms_key);
            return `${key}=${encodeURIComponent(param?.sms_value)}`;
        }).join('&');

        // Final URL for API call
        const constructedUrl = `${apiData?.main_url}${queryParams}`;
        setApiUrl(constructedUrl);  // Store the constructed URL in the state

        // Define a flag or condition to prevent automatic API call
        const shouldFetch = false; // Change this based on your logic, e.g., a button click or condition

        if (shouldFetch) {
            // Fetching the API data
            const fetchData = async () => {
                try {
                    const response = await fetch(constructedUrl);
                    const result = await response.json();
                    setApiResponse(result); // Set the API response in state
                } catch (error) {
                    console.error('Error fetching the API:', error);
                }
            };

            // Trigger API call if the condition is met
            fetchData();
        }
    }, [apiData]);


    const [balanceData, setBalanceData] = useState({});

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const balancePromises = allSmsApiList?.map(async (sms_api) => {
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

        if (allSmsApiList.length > 0) {
            fetchBalances();
        }
    }, [allSmsApiList]);
    // const balance = response.data.Balance !== undefined || response.data.balance !== undefined ? response.data.Balance || response.data.balance : 'N/A';

    console.log(balanceData)


    console.log(apiUrl)
    console.log(apiResponse)
    const [balanceUrl, setBalanceUrl] = useState('');

    useEffect(() => {
        if (!apiData || !apiData?.sms_api_params || apiData?.sms_api_params.length === 0) {
            return; // Exit if apiData or sms_api_params is not available
        }
    
        // Filter out parameters where options are not 0 or empty
        const filteredParams = apiData?.sms_api_params?.filter(param => 
            param?.options === 0 || param?.options === '' || param?.options === null || param?.options === undefined
        );
    
        // Construct the query string from the filtered parameters
        const queryParams = filteredParams?.map(param => {     
            return `${param?.sms_key}=${encodeURIComponent(param?.sms_value)}`;
        }).filter(Boolean) // Remove empty strings
          .join('&');
    
        // Final URL for API call based on filtered parameters
        const constructedUrl = `${apiData?.main_url}${queryParams ? `${queryParams}` : ''}`;
        setBalanceUrl(constructedUrl);  // Store the constructed URL in the state
    
        // Further logic for triggering API calls or other actions if needed
    }, [apiData]);
    
    


    return (
        <div className="container-fluid">
            <div className="row">
                <div class="col-md-12 body-content  bg-light p-4">
                    <div class="card border-primary shadow-sm border-0">
                        <div class="card border-primary shadow-sm border-0">
                            <div class="card-header custom-card-header  py-1 clearfix bg-gradient-primary text-white">
                                <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">SMS Api Details </h5>
                                <div class="card-title card-header-color font-weight-bold mb-0  float-right">
                                    <Link href="/Admin/sms_api/sms_api_all" class="btn btn-sm btn-info">Back to Sms api List</Link>				</div>
                            </div>
                            <div class="card-body">
                                <div class="form-group row m-0">
                                    <label class="col-form-label col-md-3 font-weight-bold">Api Name:</label>
                                    <div className="col-md-9">
                                        <p>{allSmsApiList[0]?.api_name}</p>
                                    </div>
                                </div>
                                <div class="form-group row m-0">
                                    <label class="col-form-label col-md-3 font-weight-bold">URL:</label>
                                    <div className="col-md-9 m-0">
                                        <p>{allSmsApiList[0]?.main_url}</p>
                                    </div>
                                </div>
                                <div class="form-group row m-0">
                                    <label class="col-form-label col-md-3 font-weight-bold">Api URL:</label>
                                    <div className="col-md-9 m-0">
                                        <a style={{ color: 'black' }} href={apiUrl} target="_blank" rel="noopener noreferrer">{apiUrl}</a>
                                    </div>
                                </div>
                                <div class="form-group row m-0">
                                    <label class="col-form-label col-md-3 font-weight-bold mt-2">Balance URL:</label>
                                    <div className="col-md-9 mt-3">
                                        <a style={{ color: 'black' }} href={allSmsApiList[0]?.balance_url} target="_blank" rel="noopener noreferrer">{allSmsApiList[0]?.balance_url}</a>
                                    </div>
                                    {/* <div className="col-md-9 mt-3">
                                        <a style={{ color: 'black' }} href={balanceUrl} target="_blank" rel="noopener noreferrer">{balanceUrl}</a>
                                    </div> */}
                                </div>


                            </div>

                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-sm table-bordered table-hover table-striped">
                                        <thead>
                                            <tr>
                                                <th>SMS Rate</th>
                                                <th>Api Status</th>
                                                <th>Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{allSmsApiList[0]?.balance_rate}</td>
                                                <td>{allSmsApiList[0]?.status}</td>
                                                <td>{balanceData[id]}</td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-sm table-bordered table-hover table-striped">
                                        <thead>
                                            <tr>
                                                <th>Api Param Key</th>
                                                <th>Api Param Value</th>
                                                <th>Options</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allSmsApiList[0]?.sms_api_params?.map(param => (
                                                <tr key={param.id}>
                                                    <td>{param.sms_key}</td>
                                                    <td>{param.sms_value}</td>
                                                    <td>  {param.options === 1 ? 'Number' : param.options === 2 ? 'Message' : ''}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    );
};

export default SmsApiViews;