'use client' 
 //ismile
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import axios from 'axios';

const LiveLocationEmployee = ({ id }) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(id);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromDate, setShowFromDate] = useState('');
    const [showToDate, setShowToDate] = useState('');

    const { data: employeeGeo = [] } = useQuery({
        queryKey: ['employeeGeo', selectedEmployeeId],
        queryFn: async () => {
            try {
                if (!selectedEmployeeId) {
                    return [];
                }
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/geo_location_all/${selectedEmployeeId}`);
                // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_geo/${selectedEmployeeId}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch employee data');
                }
                const data = await res.json();
                return data;
            } catch (error) {
                console.error('Error fetching employeeGeo:', error);
                return [];
            }
        }
    });

    

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw"
    });

    const [selectedDate, setSelectedDate] = useState(null);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [polylines, setPolylines] = useState([]);

    useEffect(() => {
        // Reset selectedDate when employee changes
        setSelectedDate(null);
    }, [selectedEmployeeId]);


    const onLoad = React.useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback() {
        setMap(null);
    }, []);

    const handleDateButtonClick = (date) => {
        setSelectedDate(date);
    };

    const handleEmployeeChange = (event) => {
        setSelectedEmployeeId(event.target.value);
    };





    const page_group = localStorage.getItem('pageGroup')










    return (
        isLoaded ? (
            <div>
                <div class="container-fluid">
                    <div class="row">
                        <div className='col-12 p-4'>
                            <div className='card mb-4'>
                                <div class="body-content bg-light">
                                    <div class="border-primary shadow-sm border-0">
                                        <div class="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                            <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Location Search</h5>
                                            <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                                <Link href={`/Admin/employee/employee_list?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Employee List</Link>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <form>
                                                <div class="col-md-10 offset-md-1">
                                                    {/* <div class="form-group row student">
                                                    <label className="col-form-label col-md-2"><strong>Employee Name:</strong></label>
                                                    <div className="col-md-10">
                                                        <select
                                                            className="mb-3 form-control form-control-sm required integer_no_zero"
                                                            id="employee_name"
                                                            value={selectedEmployeeId}
                                                            onChange={handleEmployeeChange}
                                                        >
                                                            <option value="">Select employee Name</option>
                                                            {employeeList.map(employee => (
                                                                <option key={employee.user_id} value={employee.user_id}>{employee.full_name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div> */}

                                                    <div class="form-group row student">
                                                        <label htmlFor="fromDate" class="col-form-label col-md-2"><strong>Start Date:</strong></label>
                                                        <div className="col-md-4">
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                value={showFromDate}
                                                                onClick={handleTextInputClick}
                                                                placeholder="dd-mm-yy"
                                                                className="form-control"
                                                                style={{ display: 'inline-block' }}
                                                            />
                                                            <input
                                                                type="date"
                                                                id="dateInput"
                                                                onChange={handleDateChangess}
                                                                style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                            />
                                                        </div>

                                                        <label htmlFor="toDate" class="col-form-label col-md-2"><strong>End Date:</strong></label>
                                                        <div class="col-md-4">
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                value={showToDate}
                                                                onClick={handleTextInputClicks}
                                                                placeholder="dd-mm-yy"
                                                                className="form-control"
                                                                style={{ display: 'inline-block' }}
                                                            />
                                                            <input
                                                                type="date"
                                                                id="dateInputTo"
                                                                onChange={handleDateChangesss}
                                                                style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div class="form-group row">
                                                        <div class="offset-md-2 col-md-10 float-left">
                                                            <input
                                                                type="button"
                                                                name="search"
                                                                class="btn btn-sm btn-info search_btn mr-2"
                                                                value="Search"
                                                                onClick={period_search}
                                                            />
                                                            <input
                                                                type="button"
                                                                name="search"
                                                                class="btn btn-sm btn-success print_btn mr-2"
                                                                value="Print"
                                                                onClick={employee_print}
                                                            />
                                                            <input
                                                                onClick={employee_PDF_download}
                                                                type="button"
                                                                style={buttonStyles}
                                                                name="search"
                                                                className="btn btn-sm btn-secondary excel_btn mr-2"
                                                                value="Download PDF"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='d-flex'>
                    <ul class="list-group d-flex flex-column col-md-3 mt-2 ml-4">
                        {uniqueDates.map((date, index) => (


                            <li className="btn btn-sm btn-info my-1"
                                key={index}
                                onClick={() => handleDateButtonClick(date)} class="list-group-item"> {date}</li>
                        ))}


                    </ul>
                    {/* <div className='d-flex flex-column col-md-3 mt-2'>
                        {uniqueDates.map((date, index) => (
                            <button
                                className="btn btn-sm btn-info my-1"
                                key={index}
                                onClick={() => handleDateButtonClick(date)}
                            >
                                {date}
                            </button>
                        ))}
                    </div> */}

                    {
                        searchResults.length > 0 ?
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100vh' }}
                                center={
                                    selectedDate ?
                                        { lat: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate)?.latitude), lng: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate)?.longitude) }
                                        :
                                        { lat: employeeGeo.length > 0 ? parseFloat(employeeGeo[0].latitude) : 0, lng: employeeGeo.length > 0 ? parseFloat(employeeGeo[0].longitude) : 0 }
                                }
                                zoom={14}
                                onLoad={onLoad}
                                onUnmount={onUnmount}
                            >
                                <>
                                    {markers}
                                    {polylines}
                                </>
                            </GoogleMap>
                            :
                            'No data'
                    }

                </div>
            </div>
        ) : (
            <div>Loading...</div>
        )
    );
};

export default LiveLocationEmployee;