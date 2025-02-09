// 'use client' 
 //ismile
// import React, { useEffect, useState } from 'react';
// import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

// const EmployeeLiveLocation = ({ id }) => {
//     const [location, setLocation] = useState(null);
//     const apiKey = 'AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw';

//     useEffect(() => {
//         if (id) {
//             fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${id}&key=${apiKey}`)
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.results && data.results.length > 0) {
//                         const { lat, lng } = data.results[0].geometry.location;
//                         setLocation({ lat, lng });
//                     } else {
//                         setLocation(null);
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error fetching location:', error);
//                     setLocation(null);
//                 });
//         }
//     }, [id, apiKey]);

//     return (
//         <div style={{ height: '400px', width: '100%' }}>
//             <LoadScript googleMapsApiKey={apiKey}>
//                 {location ? (
//                     <GoogleMap
//                         center={{ lat: location.lat, lng: location.lng }}
//                         zoom={15}
//                         mapContainerStyle={{ height: '100%', width: '100%' }}
//                     >
//                         <Marker position={{ lat: location.lat, lng: location.lng }} />
//                     </GoogleMap>
//                 ) : (
//                     <p>No location found for {id}</p>
//                 )}
//             </LoadScript>
//         </div>
//     );
// };

// export default EmployeeLiveLocation;
'use client' 
 //ismile
// import React from "react";
// import { useGeolocated } from "react-geolocated";

// const EmployeeLiveLocation = () => {
//     const { coords, isGeolocationAvailable, isGeolocationEnabled } =
//         useGeolocated({
//             positionOptions: {
//                 enableHighAccuracy: false,
//             },
//             userDecisionTimeout: 5000,
//         });

//     return !isGeolocationAvailable ? (
//         <div>Your browser does not support Geolocation</div>
//     ) : !isGeolocationEnabled ? (
//         <div>Geolocation is not enabled</div>
//     ) : coords ? (
//         <table>
//             <tbody>
//                 <tr>
//                     <td>latitude</td>
//                     <td>{coords.latitude}</td>
//                 </tr>
//                 <tr>
//                     <td>longitude</td>
//                     <td>{coords.longitude}</td>
//                 </tr>
//                 <tr>
//                     <td>altitude</td>
//                     <td>{coords.altitude}</td>
//                 </tr>
//                 <tr>
//                     <td>heading</td>
//                     <td>{coords.heading}</td>
//                 </tr>
//                 <tr>
//                     <td>speed</td>
//                     <td>{coords.speed}</td>
//                 </tr>
//             </tbody>
//         </table>
//     ) : (
//         <div>Getting the location data&hellip; </div>
//     );
// };

// export default EmployeeLiveLocation;

// import React from "react";
// import { useGeolocated } from "react-geolocated";
// import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

// const EmployeeLiveLocation = () => {
//     const { coords, isGeolocationAvailable, isGeolocationEnabled } =
//         useGeolocated({
//             positionOptions: {
//                 enableHighAccuracy: false,
//             },
//             userDecisionTimeout: 5000,
//         });

//     const mapStyles = {
//         height: "400px",
//         width: "100%",
//     };

//     const defaultCenter = {
//         lat: coords?.latitude || 0,
//         lng: coords?.longitude || 0,
//     };

//     return (
//         <div>
//             {!isGeolocationAvailable ? (
//                 <div>Your browser does not support Geolocation</div>
//             ) : !isGeolocationEnabled ? (
//                 <div>Geolocation is not enabled</div>
//             ) : coords ? (
//                 <div>
//                     <LoadScript googleMapsApiKey="AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw">
//                         <GoogleMap
//                             mapContainerStyle={mapStyles}
//                             zoom={15}
//                             center={defaultCenter}
//                         >
//                             <Marker position={defaultCenter} />
//                         </GoogleMap>
//                     </LoadScript>
//                     <table>
//                         <tbody>
//                             <tr>
//                                 <td>latitude</td>
//                                 <td>{coords.latitude}</td>
//                             </tr>
//                             <tr>
//                                 <td>longitude</td>
//                                 <td>{coords.longitude}</td>
//                             </tr>
//                             <tr>
//                                 <td>altitude</td>
//                                 <td>{coords.altitude}</td>
//                             </tr>
//                             <tr>
//                                 <td>heading</td>
//                                 <td>{coords.heading}</td>
//                             </tr>
//                             <tr>
//                                 <td>speed</td>
//                                 <td>{coords.speed}</td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <div>Getting the location data&hellip;</div>
//             )}
//         </div>
//     );
// };

// export default EmployeeLiveLocation;

// import React from "react";
// import { useGeolocated } from "react-geolocated";

// const EmployeeLiveLocation = () => {
//     const { coords, isGeolocationAvailable, isGeolocationEnabled } =
//         useGeolocated({
//             positionOptions: {
//                 enableHighAccuracy: false,
//             },
//             userDecisionTimeout: 5000,
//         });

//     return !isGeolocationAvailable ? (
//         <div>Your browser does not support Geolocation</div>
//     ) : !isGeolocationEnabled ? (
//         <div>Geolocation is not enabled</div>
//     ) : coords ? (
//         <table>
//             <tbody>
//                 <tr>
//                     <td>latitude</td>
//                     <td>{coords.latitude}</td>
//                 </tr>
//                 <tr>
//                     <td>longitude</td>
//                     <td>{coords.longitude}</td>
//                 </tr>
//                 <tr>
//                     <td>altitude</td>
//                     <td>{coords.altitude}</td>
//                 </tr>
//                 <tr>
//                     <td>heading</td>
//                     <td>{coords.heading}</td>
//                 </tr>
//                 <tr>
//                     <td>speed</td>
//                     <td>{coords.speed}</td>
//                 </tr>
//             </tbody>
//         </table>
//     ) : (
//         <div>Getting the location data&hellip; </div>
//     );
// };

// export default EmployeeLiveLocation;

// 'use client' 
 //ismile
// import React, { useState, useEffect } from "react";
// import { useGeolocated } from "react-geolocated";
// import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

// const EmployeeLiveLocation = () => {


//         const { coords, isGeolocationAvailable, isGeolocationEnabled } =
//         useGeolocated({
//             positionOptions: {
//                 enableHighAccuracy: true,
//                 maximumAge: 0,
//                 timeout: Infinity,
//             },
//             watchPosition: true,
//             userDecisionTimeout: 1,
//             suppressLocationOnMount: false,
//             geolocationProvider: navigator.geolocation,
//             isOptimisticGeolocationEnabled: true,
//             watchLocationPermissionChange: false,
//             onError: (error) => console.error(error),
//             onSuccess: (position) => console.log(position),
//         });

//     const [map, setMap] = useState(null);
//     const [markerIcon, setMarkerIcon] = useState(null);

//     useEffect(() => {
//         if (map && !markerIcon) {
//             setMarkerIcon({
//                 path: window.google.maps.SymbolPath.CIRCLE,
//                 scale: 10,
//                 fillColor: "#FF0000",
//                 fillOpacity: 1,
//                 strokeWeight: 1,
//                 labelOrigin: new window.google.maps.Point(0, 0),
//             });
//         }
//     }, [map, markerIcon]);

//     const mapStyles = {
//         height: "400px",
//         width: "100%",
//     };

//     const defaultCenter = {
//         lat: coords?.latitude || 0,
//         lng: coords?.longitude || 0,
//     };

//     const customLabel = 'A'; // Custom label for the marker

//     return (
//         <div>
//             {!isGeolocationAvailable ? (
//                 <div>Your browser does not support Geolocation</div>
//             ) : !isGeolocationEnabled ? (
//                 <div>Geolocation is not enabled</div>
//             ) : coords ? (
//                 <div>
//                     <LoadScript googleMapsApiKey="AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw">
//                         <GoogleMap
//                             mapContainerStyle={mapStyles}
//                             zoom={15}
//                             center={defaultCenter}
//                             onLoad={map => setMap(map)}
//                         >
//                             {markerIcon && (
//                                 <Marker
//                                     position={defaultCenter}
//                                     icon={markerIcon}
//                                     label={{
//                                         text: customLabel,
//                                         color: "white",
//                                         fontWeight: "bold",
//                                     }}
//                                 />
//                             )}
//                         </GoogleMap>
//                     </LoadScript>
//                     <table>
//                         <tbody>
//                             <tr>
//                                 <td>latitude</td>
//                                 <td>{coords.latitude}</td>
//                             </tr>
//                             <tr>
//                                 <td>longitude</td>
//                                 <td>{coords.longitude}</td>
//                             </tr>
//                             <tr>
//                                 <td>altitude</td>
//                                 <td>{coords.altitude}</td>
//                             </tr>
//                             <tr>
//                                 <td>heading</td>
//                                 <td>{coords.heading}</td>
//                             </tr>
//                             <tr>
//                                 <td>speed</td>
//                                 <td>{coords.speed}</td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <div>Getting the location data&hellip;</div>
//             )}
//         </div>
//     );
// };

// export default EmployeeLiveLocation;
"use client";
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import Link from 'next/link';

const EmployeeLiveLocation = ({ id }) => {

    const [token, setToken] = useState({})

    const fetchToken = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5000/getAccessToken`);
            if (!res.ok) {
                throw new Error('Failed to fetch employee list');
            }
            const data = await res.json();
            setToken(data);
        } catch (error) {
            console.error('Error fetching employee list:', error);
        }
    };

    console.log(token)

    useEffect(() => {
        fetchToken();
    }, []);

    // console.log(token)
    const handleClick = () => {
        const url = 'https://fcm.googleapis.com/v1/projects/hrapp-ef0a5/messages:send';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.accessToken}`
        };

        const body = JSON.stringify({
            "message": {
                "token": "fy26m3i5SvO_s_WV2HtNrV:APA91bEQlPt1Q8303eaCfX4czMykDCbbE17XzBoWWko7rd2ui3-s9T9jo62k_pYqeKWtwH7Z7cnUn6ZQ9eJz7353bndm8l7dntpd7ACq9Nq6Q0ta61UBG2eVAi0SNQo87p5r31U0Cwzx",
                "notification": {
                    "title": "location",
                    "body": "your location is tracking by hrapp right now...."
                },
                "data": {
                    "category": "location"
                }
            }
        });

        fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }




    const [employeeList, setEmployeeList] = useState([]);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw'
    });

    const [selectedEmployeeId, setSelectedEmployeeId] = useState(id);
    const [refreshInterval, setRefreshInterval] = useState(null);

    const fetchEmployeeList = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`);
            if (!res.ok) {
                throw new Error('Failed to fetch employee list');
            }
            const data = await res.json();
            setEmployeeList(data);
        } catch (error) {
            console.error('Error fetching employee list:', error);
        }
    };

    useEffect(() => {
        fetchEmployeeList();
    }, []);

const employeeName = employeeList.find(employee => employee.user_id === parseFloat(id))
console.log(employeeName)
console.log(employeeList)
    const fetchEmployeeGeo = async (employeeId) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/geo_location_all_live/${employeeId}`);
            const data = await res.json();

            return data;
        } catch (error) {
            console.error('Error fetching employeeGeo:', error);
            return [];
        }
    };


    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    };

    const getTotalDistance = (locations) => {
        let totalDistance = 0;
        for (let i = 0; i < locations.length - 1; i++) {
            const { latitude: lat1, longitude: lon1 } = locations[i];
            const { latitude: lat2, longitude: lon2 } = locations[i + 1];
            const distance = calculateDistance(lat1, lon1, lat2, lon2);
            totalDistance += distance;
        }
        return totalDistance.toFixed(2);
    };

    const fetchLocationName = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw`);
            if (!response.ok) {
                throw new Error('Failed to fetch location details');
            }
            const data = await response.json();
            if (data.results && data.results.length >= 5) {
                return data.results[6].formatted_address;
            } else if (data.results && data.results.length > 0) {
                return data.results[0].formatted_address;
            } else {
                return 'Unknown Location';
            }
        } catch (error) {
            console.error('Error fetching location details:', error);
            return 'Unknown Location';
        }
    };

    const fetchLocationNames = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw`);
            if (!response.ok) {
                throw new Error('Failed to fetch location details');
            }
            const data = await response.json();
            if (data.results && data.results.length >= 5) {
                return data.results[7].formatted_address;
            } else if (data.results && data.results.length > 0) {
                return data.results[0].formatted_address;
            } else {
                return 'Unknown Location';
            }
        } catch (error) {
            console.error('Error fetching location details:', error);
            return 'Unknown Location';
        }
    };

    const EmployeeMap = ({ employeeId, isSingleEmployee, employee }) => {
        const [map, setMap] = useState(null);
        const [markers, setMarkers] = useState([]);
        const [polylines, setPolylines] = useState([]);
        const [employeeGeo, setEmployeeGeo] = useState([]);
        const [totalDistance, setTotalDistance] = useState(0);





        // const employeeName = employeeLists.find(employee => employee.user_id === parseFloat(employeeId))

        // console.log(employeeLists)

        const fetchAndSetGeoData = async () => {
            try {
                const geoData = await fetchEmployeeGeo(employeeId);
                setEmployeeGeo(geoData);
                if (geoData.length > 0) {
                    const distance = getTotalDistance(geoData);
                    setTotalDistance(distance);
                }
            } catch (error) {
                console.error('Error fetching employeeGeo:', error);
            }
        };

        useEffect(() => {
            if (employeeId) {
                fetchAndSetGeoData();
            }
        }, [employeeId]);

        useEffect(() => {
            const updateMarkersAndPolylines = async () => {
                if (isLoaded && employeeGeo.length > 0) {
                    console.log("Google Maps API loaded");
                    const newMarkers = await Promise.all(employeeGeo.map(async (location, index) => {
                        const { latitude, longitude, created_date } = location;
                        const locationName = await fetchLocationName(latitude, longitude);
                        const locationNames = await fetchLocationNames(latitude, longitude);
                        const markerColor = index === employeeGeo.length - 1 ? 'blue' : 'red';
                        return (
                            <Marker
                                key={`${latitude}_${longitude}`}
                                position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
                                title={`${created_date.split('T')[0]} ${created_date.split('T')[1].split('.')[0]} - ${locationNames} ${locationName}`}
                                options={{
                                    icon: {
                                        url: `http://maps.google.com/mapfiles/ms/icons/${markerColor}-dot.png`
                                    }
                                }}
                            />
                        );
                    }));
                    setMarkers(newMarkers);

                    const newPolylines = [];
                    for (let i = 0; i < employeeGeo.length - 1; i++) {
                        const directionsService = new window.google.maps.DirectionsService();
                        directionsService.route(
                            {
                                origin: new window.google.maps.LatLng(parseFloat(employeeGeo[i].latitude), parseFloat(employeeGeo[i].longitude)),
                                destination: new window.google.maps.LatLng(parseFloat(employeeGeo[i + 1].latitude), parseFloat(employeeGeo[i + 1].longitude)),
                                travelMode: window.google.maps.TravelMode.DRIVING,
                            },
                            (result, status) => {
                                if (status === window.google.maps.DirectionsStatus.OK) {
                                    newPolylines.push(
                                        // <Polyline
                                        //     lineDashPattern={[10, 5]}
                                        //     key={`polyline_${i}`}
                                        //     path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
                                        //     options={{
                                        //         strokeColor: "#FF0000",
                                        //         strokeOpacity: 1,
                                        //         strokeWeight: 2,
                                        //     }}
                                        // />
                                        <Polyline
                                            key={`polyline_${i}`}
                                            path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
                                            options={{
                                                strokeColor: "#FF0000",
                                                strokeOpacity: 0, // Make the main line invisible
                                                icons: [
                                                    {
                                                        icon: {
                                                            path: 'M 0,-1 0,1',
                                                            strokeOpacity: 1,
                                                            scale: 2,
                                                        },
                                                        offset: '0',
                                                        repeat: '10px', // Adjust this value to change the dash length
                                                    },
                                                ],
                                            }}
                                        />
                                    );
                                    setPolylines([...newPolylines]);
                                } else {
                                    console.error(`Error fetching directions: ${status}`);
                                }
                            }
                        );
                    }

                    if (map && employeeGeo.length > 0 && !isNaN(parseFloat(employeeGeo[0].latitude)) && !isNaN(parseFloat(employeeGeo[0].longitude))) {
                        map.panTo({ lat: parseFloat(employeeGeo[0].latitude), lng: parseFloat(employeeGeo[0].longitude) });
                    }
                } else {
                    console.log("Google Maps API not loaded or no employee geo data");
                }
            };

            updateMarkersAndPolylines();
        }, [isLoaded, employeeGeo, map]);

        useEffect(() => {
            if (refreshInterval) {
                const interval = setInterval(() => {
                    fetchAndSetGeoData();
                    handleClick()
                }, refreshInterval);

                return () => clearInterval(interval);
            }
        }, [refreshInterval]);

        const onLoad = React.useCallback(function callback(map) {
            setMap(map);
        }, []);

        const onUnmount = React.useCallback(function callback() {
            setMap(null);
        }, []);



        return (
            <div className={`col-md-${isSingleEmployee ? 12 : 6}`}>
                <div className='card mb-4'>
                    <div className="body-content bg-light">
                        <div className="border-primary shadow-sm border-0">
                            <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
                                    {isSingleEmployee ? "Employee Location" : `${employee?.full_name} Live Locations`}
                                </h5>
                            </div>
                            {/* <div className='m-2'>

                                {
                                    isSingleEmployee ? <>
                                        <p> {employeeId}</p>
                                        
                                       
                                        
                                    </> :
                                        <>
                                            <p className='m-0 ml-2'>Name: {employee?.full_name}</p>
                                            <p className='m-0 ml-2'>User ID: {employee?.user_id}</p>
                                            <p className='m-0 ml-2'>Designation Name: {employee?.designation_name}</p>
                                            <p className='m-0 ml-2'>Total Travell: {totalDistance} km</p>
                                        </>
                                }
                            </div> */}
                        </div>
                        <div style={{ height: '400px', width: '100%' }}>
                            {isLoaded && (
                                <GoogleMap
                                    mapContainerStyle={{ height: '100%', width: '100%' }}
                                    zoom={12}
                                    onLoad={onLoad}
                                    onUnmount={onUnmount}
                                >
                                    {markers}
                                    {polylines}
                                </GoogleMap>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };





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

  

    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className='col-12 p-4'>
                        <div className='card mb-4'>
                            <div className="body-content bg-light">
                                <div className="border-primary shadow-sm border-0">
                                    <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                        <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employee Live Location Search</h5>
                                        <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                            <Link href={`/Admin/employee/employee_list?page_group=${page_group}`} className="btn btn-sm btn-info">Back To Employee List</Link>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group row">
                                            <div className="col-md-10 offset-md-1">
                                                <div className="form-group row student">
                                                    <label className="col-form-label col-md-2"><strong>Employee Name:</strong></label>
                                                    <div className="col-md-10">
                                                        {employeeName?.full_name}
                                                        {/* <select
                                                        disabled
                                                            className="mb-3 form-control form-control-sm required integer_no_zero border-0"
                                                            id="employee_name"
                                                            value={selectedEmployeeId}
                                                            onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                                        >
                                                            <option value="">Select Employee Name</option>
                                                            {employeeList.map(employee => (
                                                                <option key={employee.user_id} value={employee.user_id}>{employee.full_name}</option>
                                                            ))}
                                                        </select> */}
                                                    </div>
                                                </div>
                                                <div className="form-group row student">
                                                    <label className="col-form-label col-md-2"><strong>Employee Email:</strong></label>
                                                    <div className="col-md-10">
                                                        {employeeName?.email}
                                                        
                                                    </div>
                                                </div>
                                                <div className="form-group row student">
                                                    <label className="col-form-label col-md-2"><strong>Employee Mobile:</strong></label>
                                                    <div className="col-md-10">
                                                        {employeeName?.mobile}
                                                        
                                                    </div>
                                                </div>
                                                <div className="form-group row student">
                                                    <label className="col-form-label col-md-2"><strong>Employee Designation Name:</strong></label>
                                                    <div className="col-md-10">
                                                        {employeeName?.designation_name}
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            {/* <div className="container-fluid">
                                                <div className="d-flex flex-wrap">
                                                    {selectedEmployeeId && <EmployeeMap employeeId={selectedEmployeeId} isSingleEmployee={true} />}
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row">
                    <div className='col-12'>
                        <div className='card mb-4'>
                            <div className="body-content bg-light">
                                <div className="border-primary shadow-sm border-0">
                                    <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                                        <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
                                            <strong>Live Location</strong>
                                        </div>
                                        <div className="card-title card-header-color font-weight-bold mb-0 float-right">
                                            <div className="input-group printable">
                                                <select
                                                    id="refreshInterval"
                                                    value={refreshInterval || ''}
                                                    onChange={(e) => setRefreshInterval(parseInt(e.target.value) || null)}
                                                    name="time" className="form-control form-control-sm required integer_no_zero">
                                                    <option value='36000000'>Select Time</option>
                                                    <option value='10000'>10 Seconds</option>
                                                    <option value='20000'>20 Seconds</option>
                                                    <option value='30000'>30 Seconds</option>
                                                    <option value='60000'>1 Minute</option>
                                                    <option value='120000'>2 Minutes</option>
                                                    <option value='180000'>3 Minutes</option>
                                                    <option value='240000'>4 Minutes</option>
                                                    <option value='300000'>5 Minutes</option>
                                                </select>
                                                <div className="input-group-append">
                                                    <button
                                                        onClick={handleClick}
                                                        type="button" className="btn btn-info btn-sm">
                                                        Refresh
                                                    </button>
                                                </div>



                                            </div>
                                        </div>
                                        <div className="card-title card-header-color font-weight-bold mb-0 float-right mr-2">
                                            <div className="input-group printable">
                                                <div className="input-group-append">
                                                    <a href='/Admin/geo_location/geo_location_live?page_group=hr_management'>
                                                        <button type="button" className="btn btn-info btn-sm py-1 add_more">
                                                            Full Refresh
                                                        </button>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="container-fluid">
                                            <div className="d-flex flex-wrap">
                                                {selectedEmployeeId && <EmployeeMap employeeId={selectedEmployeeId} isSingleEmployee={true} />}
                                            </div>
                                            {/* <div className="d-flex flex-wrap">
                                                {employeeList.map(employee => (
                                                    <EmployeeMap key={employee.user_id}
                                                        employee={employee}
                                                        employeeId={employee.user_id} isSingleEmployee={false} />
                                                ))}
                                            </div> */}
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

export default EmployeeLiveLocation;


