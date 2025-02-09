// 'use client' 
 //ismile;
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader, InfoWindow, LoadScript  } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import axios from 'axios';
// import { useGeolocated } from "react-geolocated";

// const GeoLiveLOcation = () => {




//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [fromDate, setFromDate] = useState(null);
//     const [toDate, setToDate] = useState(null);
//     const [searchResults, setSearchResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [map, setMap] = useState(null);
//     const [markers, setMarkers] = useState([]);
//     const [polylines, setPolylines] = useState([]);
//     const [selectedMarker, setSelectedMarker] = useState(null);
//     const [totalDistance, setTotalDistance] = useState(0);


//     const { coords, isGeolocationAvailable, isGeolocationEnabled } =
//     useGeolocated({
//         positionOptions: {
//             enableHighAccuracy: false,
//         },
//         userDecisionTimeout: 5000,
//     });

// const [markerIcon, setMarkerIcon] = useState(null);

// useEffect(() => {
//     if (map && !markerIcon) {
//         setMarkerIcon({
//             path: window.google.maps.SymbolPath.CIRCLE,
//             scale: 10,
//             fillColor: "#FF0000",
//             fillOpacity: 1,
//             strokeWeight: 1,
//             labelOrigin: new window.google.maps.Point(0, 0),
//         });
//     }
// }, [map, markerIcon]);

// const mapStyles = {
//     height: "400px",
//     width: "100%",
// };

// const defaultCenter = {
//     lat: coords?.latitude || 0,
//     lng: coords?.longitude || 0,
// };

// const customLabel = 'A'; // Custom label for the marker

//     const { data: employeeGeo = [] } = useQuery({
//         queryKey: ['employeeGeo', selectedEmployeeId],
//         queryFn: async () => {
//             try {
//                 if (!selectedEmployeeId) {
//                     return [];
//                 }
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/geo_location_all/${selectedEmployeeId}`);
//                 if (!res.ok) {
//                     throw new Error('Failed to fetch employee data');
//                 }
//                 const data = await res.json();
//                 return data;
//             } catch (error) {
//                 console.error('Error fetching employeeGeo:', error);
//                 return [];
//             }
//         }
//     });

//     const { data: employeeList = [] } = useQuery({
//         queryKey: ['employeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`)
//             const data = await res.json()
//             return data
//         }
//     });

//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw"
//     });

//     useEffect(() => {
//         // Reset selectedDate when employee changes
//         setSelectedDate(null);
//     }, [selectedEmployeeId]);


//     useEffect(() => {
//         if (isLoaded && searchResults.length > 0 && selectedDate) {
//             const filteredLocations = searchResults
//                 .filter(geo => geo.created_date.split('T')[0] === selectedDate)
//                 .map(item => ({
//                     lat: parseFloat(item.latitude),
//                     lng: parseFloat(item.longitude),
//                     created_date: item.created_date
//                 }));

//             if (filteredLocations.length > 0) {
//                 // Update markers
//                 const newMarkers = filteredLocations.map((location, index) => (
//                     <Marker
//                         key={`${location.lat}_${location.lng}`}
//                         position={{ lat: location.lat, lng: location.lng }}
//                         label={String.fromCharCode(65 + index)} // Label as A, B, C, etc.
//                         onClick={() => handleMarkerClick(location)} // Set selected marker
//                     />
//                 ));
//                 setMarkers(newMarkers);

//                 // Create polylines and calculate total distance
//                 let totalDistance = 0;
//                 const newPolylines = [];
//                 for (let i = 0; i < filteredLocations.length - 1; i++) {
//                     const directionsService = new window.google.maps.DirectionsService();

//                     directionsService.route(
//                         {
//                             origin: new window.google.maps.LatLng(filteredLocations[i].lat, filteredLocations[i].lng),
//                             destination: new window.google.maps.LatLng(filteredLocations[i + 1].lat, filteredLocations[i + 1].lng),
//                             travelMode: window.google.maps.TravelMode.DRIVING,
//                         },
//                         (result, status) => {
//                             if (status === window.google.maps.DirectionsStatus.OK) {
//                                 const distance = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0); // Sum up distance for all legs
//                                 totalDistance += distance;

//                                 newPolylines.push(
//                                     <Polyline
//                                         key={`polyline_${i}`}
//                                         path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//                                         options={{
//                                             strokeColor: selectedDate === filteredLocations[i].created_date.split('T')[0] ? "#FF0000" : "#FFFFFF", // Red 
//                                             strokeOpacity: 1,
//                                             strokeWeight: 2,
//                                         }}
//                                     />
//                                 );
//                                 setPolylines([...newPolylines]); // Update state with new polylines
//                                 setTotalDistance(totalDistance); // Update total distance state
//                             } else {
//                                 console.error(`Error fetching directions: ${status}`);
//                             }
//                         }
//                     );
//                 }

//                 // Center map on the first marker
//                 if (map) {
//                     map.panTo({ lat: filteredLocations[0].lat, lng: filteredLocations[0].lng });
//                 }
//             } else {
//                 setMarkers([]); // Clear markers if no locations for the selected date
//                 setPolylines([]); // Clear polylines if no locations for the selected date
//                 setTotalDistance(0); // Reset total distance
//             }
//         }
//     }, [isLoaded, searchResults, selectedDate, map]);






//     const handleMarkerClick = (location) => {
//         setSelectedMarker(location);
//     };


//     const handleEmployeeChange = (event) => {
//         setSelectedEmployeeId(event.target.value);
//     };

//     // if (loadError) {
//     //     return <div>Error loading maps</div>;
//     // }



//     const page_group = localStorage.getItem('pageGroup');









//     return isLoaded ? (
//         <div>
//             <div className="container-fluid">
//                 <div className="row">
//                     <div className='col-12 p-4'>

//                         <div className='card mb-4'>
//                             <div className="body-content bg-light">
//                                 <div className="border-primary shadow-sm border-0">
//                                     <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                         <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Location Search</h5>
//                                         <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                             <Link href={`/Admin/employee/employee_list?page_group=${page_group}`} className="btn btn-sm btn-info">Back To Employee List</Link>
//                                         </div>
//                                     </div>
//                                     <div className="card-body">
//                                         <form>
//                                             <div className="col-md-10 offset-md-1">
//                                                 <div className="form-group row student">
//                                                     <label className="col-form-label col-md-2"><strong>Employee Name:</strong></label>
//                                                     <div className="col-md-10">
//                                                         <select
//                                                             className="mb-3 form-control form-control-sm required integer_no_zero"
//                                                             id="employee_name"
//                                                             value={selectedEmployeeId}
//                                                             onChange={handleEmployeeChange}
//                                                         >
//                                                             <option value="">Select employee Name</option>
//                                                             {employeeList.map(employee => (
//                                                                 <option key={employee.user_id} value={employee.user_id}>{employee.full_name}</option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className='d-flex flex-wrap'>
//                 {employeeList.map((employee, index) => (
//                     <>

//                         <div className='col-md-6 my-2' key={employee.user_id} style={{ width: '50%', height: '50vh' }}>
//                         <div>
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
//                                 <td>User Name:</td>
//                                 <td> {employee.full_name}</td>
//                             </tr>

//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <div>Getting the location data&hellip;</div>
//             )}
//         </div>

//                         </div>
//                     </>
//                 ))}
//             </div>
//         </div>
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GeoLiveLOcation;






// 'use client' 
 //ismile;
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import axios from 'axios';

// const GeoLiveLocation = () => {
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [map, setMap] = useState(null);
//     const [markers, setMarkers] = useState([]);
//     const [polylines, setPolylines] = useState([]);
//     const [selectedMarker, setSelectedMarker] = useState(null);
//     const [totalDistance, setTotalDistance] = useState(0);

//     const { data: employeeList = [] } = useQuery({
//         queryKey: ['employeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw"
//     });

//     useEffect(() => {
//         setSelectedDate(null);
//     }, [selectedEmployeeId]);

//     useEffect(() => {
//         if (isLoaded && searchResults.length > 0 && selectedDate) {
//             const filteredLocations = searchResults
//                 .filter(geo => geo.created_date.split('T')[0] === selectedDate)
//                 .map(item => ({
//                     lat: parseFloat(item.latitude),
//                     lng: parseFloat(item.longitude),
//                     created_date: item.created_date
//                 }));

//             if (filteredLocations.length > 0) {
//                 const newMarkers = filteredLocations.map((location, index) => (
//                     <Marker
//                         key={`${location.lat}_${location.lng}`}
//                         position={{ lat: location.lat, lng: location.lng }}
//                         label={String.fromCharCode(65 + index)}
//                         onClick={() => handleMarkerClick(location)}
//                     />
//                 ));
//                 setMarkers(newMarkers);

//                 let totalDistance = 0;
//                 const newPolylines = [];
//                 for (let i = 0; i < filteredLocations.length - 1; i++) {
//                     const directionsService = new window.google.maps.DirectionsService();

//                     directionsService.route(
//                         {
//                             origin: new window.google.maps.LatLng(filteredLocations[i].lat, filteredLocations[i].lng),
//                             destination: new window.google.maps.LatLng(filteredLocations[i + 1].lat, filteredLocations[i + 1].lng),
//                             travelMode: window.google.maps.TravelMode.DRIVING,
//                         },
//                         (result, status) => {
//                             if (status === window.google.maps.DirectionsStatus.OK) {
//                                 const distance = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0);
//                                 totalDistance += distance;

//                                 newPolylines.push(
//                                     <Polyline
//                                         key={`polyline_${i}`}
//                                         path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//                                         options={{
//                                             strokeColor: selectedDate === filteredLocations[i].created_date.split('T')[0] ? "#FF0000" : "#FFFFFF",
//                                             strokeOpacity: 1,
//                                             strokeWeight: 2,
//                                         }}
//                                     />
//                                 );
//                                 setPolylines([...newPolylines]);
//                                 setTotalDistance(totalDistance);
//                             } else {
//                                 console.error(`Error fetching directions: ${status}`);
//                             }
//                         }
//                     );
//                 }

//                 if (map) {
//                     map.panTo({ lat: filteredLocations[0].lat, lng: filteredLocations[0].lng });
//                 }
//             } else {
//                 setMarkers([]);
//                 setPolylines([]);
//                 setTotalDistance(0);
//             }
//         }
//     }, [isLoaded, searchResults, selectedDate, map]);

//     const handleMarkerClick = (location) => {
//         setSelectedMarker(location);
//     };

//     const onLoad = React.useCallback(function callback(map) {
//         setMap(map);
//     }, []);

//     const onUnmount = React.useCallback(function callback() {
//         setMap(null);
//     }, []);

//     const handleDateButtonClick = (date) => {
//         setSelectedDate(date);
//     };

//     const handleEmployeeChange = (event) => {
//         setSelectedEmployeeId(event.target.value);
//     };

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     const page_group = localStorage.getItem('pageGroup');

//     return isLoaded ? (
//         <div>
//             <div className="container-fluid">
//                 <div className="row">
//                     <div className='col-12 p-4'>
//                         <div className='card mb-4'>
//                             <div className="body-content bg-light">
//                                 <div className="border-primary shadow-sm border-0">
//                                     <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                         <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Location Search</h5>
//                                         <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                             <Link href={`/Admin/employee/employee_list?page_group=${page_group}`} className="btn btn-sm btn-info">Back To Employee List</Link>
//                                         </div>
//                                     </div>
//                                     <div className="card-body">
//                                         <form>
//                                             <div className="col-md-10 offset-md-1">
//                                                 <div className="form-group row student">
//                                                     <label className="col-form-label col-md-2"><strong>Employee Name:</strong></label>
//                                                     <div className="col-md-10">
//                                                         <select
//                                                             className="mb-3 form-control form-control-sm required integer_no_zero"
//                                                             id="employee_name"
//                                                             value={selectedEmployeeId}
//                                                             onChange={handleEmployeeChange}
//                                                         >
//                                                             <option value="">Select employee Name</option>
//                                                             {employeeList.map(employee => (
//                                                                 <option key={employee.user_id} value={employee.user_id}>{employee.full_name}</option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                 </div>
//                                                 <div className="form-group row">
//                                                     <div className="offset-md-2 col-md-10 float-left">
//                                                         <input
//                                                             type="button"
//                                                             name="search"
//                                                             className="btn btn-sm btn-info search_btn mr-2"
//                                                             value="Search"
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className='d-flex flex-wrap'>
//                 {employeeList.map((employee, index) => (
//                     <>

//                         <div className='col-md-6 my-2' key={employee.user_id} style={{ width: '50%', height: '50vh' }}>

//                             <GoogleMap
//                                 mapContainerStyle={{ width: '', height: '50vh' }}
//                                 zoom={14}
//                                 onLoad={onLoad}
//                                 onUnmount={onUnmount}
//                             >
//                                 <>
//                                     {markers}
//                                     {polylines}
//                                     {selectedMarker && (
//                                         <InfoWindow
//                                             position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
//                                             onCloseClick={() => setSelectedMarker(null)}
//                                         >
//                                             <div>
//                                                 <p>Created Date: {selectedMarker.created_date.split('T')[0]}</p>
//                                                 <p>Created Time: {selectedMarker.created_date.split('T')[1].split('.')[0]}</p>
//                                             </div>
//                                         </InfoWindow>
//                                     )}
//                                 </>

//                             </GoogleMap>
//                         </div>
//                     </>
//                 ))}
//             </div>
//         </div>
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GeoLiveLocation;


// 'use client' 
 //ismile
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import { useGeolocated } from "react-geolocated";
// import LiveLocationEmployee from './location';

// const GeoLiveLocation = () => {

//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');


//     const { coords, isGeolocationAvailable, isGeolocationEnabled } =
//         useGeolocated({
//             positionOptions: {
//                 enableHighAccuracy: true,
//                 maximumAge: 0,
//                 timeout: Infinity,
//             },
//             watchPosition: true,
//             userDecisionTimeout: null,
//             suppressLocationOnMount: false,
//             geolocationProvider: navigator.geolocation,
//             isOptimisticGeolocationEnabled: true,
//             watchLocationPermissionChange: false,
//             onError: (error) => console.error(error),
//             onSuccess: (position) => console.log(position),
//         });

//     const { data: employeeList = [] } = useQuery({
//         queryKey: ['employeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const [map, setMap] = useState(null);
//     const [markerIcon, setMarkerIcon] = useState(null);
//     const [isMapLoaded, setIsMapLoaded] = useState(false);

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

//     useEffect(() => {
//         if (employeeList.length > 0) {
//             setIsMapLoaded(true);
//         }
//     }, [employeeList]);

//     const handleEmployeeChange = (event) => {
//         setSelectedEmployeeId(event.target.value);
//     };

//     return (
//         <div>
//             <div className="container-fluid">
//                 <div className="row">
//                     <div className='col-12 p-4'>
//                         <div className='card mb-4'>
//                             <div className="body-content bg-light">
//                                 <div className="border-primary shadow-sm border-0">
//                                     <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                         <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Location Search</h5>
//                                         <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                             <Link href={`/Admin/employee/employee_list?page_group=${localStorage.getItem('pageGroup')}`} className="btn btn-sm btn-info">Back To Employee List</Link>
//                                         </div>
//                                     </div>
//                                     <div className="card-body">
//                                         <form>
//                                             <div className="col-md-10 offset-md-1">
//                                                 <div className="form-group row student">
//                                                     <label className="col-form-label col-md-2"><strong>Employee Name:</strong></label>
//                                                     <div className="col-md-10">
//                                                         <select
//                                                             className="mb-3 form-control form-control-sm required integer_no_zero"
//                                                             id="employee_name"
//                                                             value={selectedEmployeeId}
//                                                             onChange={handleEmployeeChange}
//                                                         >
//                                                             <option value="">Select employee Name</option>
//                                                             {employeeList.map(employee => (
//                                                                 <option key={employee.user_id} value={employee.user_id}>{employee.full_name}</option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="form-group row">
//                                                 <div className="offset-md-2 col-md-10 float-left">
//                                                     <input
//                                                         type="button"
//                                                         name="search"
//                                                         className="btn btn-sm btn-info search_btn mr-2"
//                                                         value="Search"
//                                                         data-toggle="modal" data-target=".bd-example-modal-lg"
//                                                     // onClick={() => setIsMapLoaded(true)} // Trigger map load
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <p>{coords?.longitude}</p>
//             <p>{coords?.latitude}</p>
//             <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
//                 <div class="modal-dialog modal-lg">
//                     <div class="modal-content">
//                         aaaaaaaaaaaaaa
//                         {/* <LiveLocationEmployee
//                    id={selectedEmployeeId}
//                    ></LiveLocationEmployee> */}
//                     </div>
//                 </div>
//             </div>
//             <div className='d-flex flex-wrap'>
//                 {employeeList.map((employee, index) => (
//                     <div className='col-md-6 my-5' key={employee.user_id} style={{ width: '50%', height: '50vh' }}>
//                         {isMapLoaded && (
//                             <LoadScript googleMapsApiKey="AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw">
//                                 <GoogleMap
//                                     mapContainerStyle={mapStyles}
//                                     zoom={15}
//                                     center={defaultCenter}
//                                     onLoad={map => setMap(map)}
//                                 >
//                                     {markerIcon && (
//                                         <Marker
//                                             position={defaultCenter}
//                                             icon={markerIcon}
//                                             label={{
//                                                 text: customLabel,
//                                                 color: "white",
//                                                 fontWeight: "bold",
//                                             }}
//                                         />
//                                     )}
//                                 </GoogleMap>
//                             </LoadScript>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default GeoLiveLocation;

// 'use client' 
 //ismile
// import React, { useState, useEffect, useCallback } from 'react';
// import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import { useGeolocated } from "react-geolocated";
// import LiveLocationEmployee from './location';

// const GeoLiveLocation = () => {

//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');


//     const { coords } = useGeolocated();
//     const { data: employeeList = [] } = useQuery({
//         queryKey: ['employeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const [map, setMap] = useState(null);
//     const [markerIcon, setMarkerIcon] = useState(null);
//     const [isMapLoaded, setIsMapLoaded] = useState(false);

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

//     useEffect(() => {
//         if (employeeList.length > 0) {
//             setIsMapLoaded(true);
//         }
//     }, [employeeList]);

//     const handleEmployeeChange = (event) => {
//         setSelectedEmployeeId(event.target.value);
//     };

//     // Function to update the map's center and marker position
//     const updateMapCenter = useCallback(() => {
//         if (map && coords) {
//             const newCenter = {
//                 lat: coords.latitude,
//                 lng: coords.longitude
//             };
//             map.panTo(newCenter);
//         }
//     }, [map, coords]);

//     useEffect(() => {
//         if (coords) {
//             updateMapCenter();
//         }
//     }, [coords, updateMapCenter]);

//     return (
//         <div>
//             <div className="container-fluid">
//                 <div className="row">
//                     <div className='col-12 p-4'>
//                         <div className='card mb-4'>
//                             <div className="body-content bg-light">
//                                 <div className="border-primary shadow-sm border-0">
//                                     <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                         <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Location Search</h5>
//                                         <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                             <Link href={`/Admin/employee/employee_list?page_group=${localStorage.getItem('pageGroup')}`} className="btn btn-sm btn-info">Back To Employee List</Link>
//                                         </div>
//                                     </div>
//                                     <div className="card-body">
//                                         <form>
//                                             <div className="col-md-10 offset-md-1">
//                                                 <div className="form-group row student">
//                                                     <label className="col-form-label col-md-2"><strong>Employee Name:</strong></label>
//                                                     <div className="col-md-10">
//                                                         <select
//                                                             className="mb-3 form-control form-control-sm required integer_no_zero"
//                                                             id="employee_name"
//                                                             value={selectedEmployeeId}
//                                                             onChange={handleEmployeeChange}
//                                                         >
//                                                             <option value="">Select employee Name</option>
//                                                             {employeeList.map(employee => (
//                                                                 <option key={employee.user_id} value={employee.user_id}>{employee.full_name}</option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="form-group row">
//                                                 <div className="offset-md-2 col-md-10 float-left">
//                                                     <input
//                                                         type="button"
//                                                         name="search"
//                                                         className="btn btn-sm btn-info search_btn mr-2"
//                                                         value="Search"
//                                                         data-toggle="modal" data-target=".bd-example-modal-lg"
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <p>{coords?.longitude}</p>
//             <p>{coords?.latitude}</p>
//             <div className="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
//                 <div className="modal-dialog modal-lg">
//                     <div className="modal-content">
//                         aaaaaaaaaaaaaa
//                         {/* <LiveLocationEmployee
//                             id={selectedEmployeeId}
//                         ></LiveLocationEmployee> */}
//                     </div>
//                 </div>
//             </div>
//             <div className='d-flex flex-wrap'>
//                 {employeeList.map((employee, index) => (
//                     <div className='col-md-6 my-5' key={employee.user_id} style={{ width: '50%', height: '50vh' }}>
//                         {isMapLoaded && (
//                             <LoadScript googleMapsApiKey="AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw">
//                                 <GoogleMap
//                                     mapContainerStyle={mapStyles}
//                                     zoom={15}
//                                     center={defaultCenter}
//                                     onLoad={map => setMap(map)}
//                                 >
//                                     {markerIcon && coords && (
//                                         <Marker
//                                             position={{
//                                                 lat: coords.latitude,
//                                                 lng: coords.longitude
//                                             }}
//                                             icon={markerIcon}
//                                             label={{
//                                                 text: customLabel,
//                                                 color: "white",
//                                                 fontWeight: "bold",
//                                             }}
//                                         />
//                                     )}
//                                 </GoogleMap>
//                             </LoadScript>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default GeoLiveLocation;

// 'use client' 
 //ismile;

// import React, { useState, useEffect } from 'react';
// import { useGeolocated } from 'react-geolocated';
// import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';

// const GeolocationComponent = () => {
//     const [initialPosition, setInitialPosition] = useState(null);
//     const [currentPosition, setCurrentPosition] = useState(null);
//     const [markers, setMarkers] = useState([]);
//     const [path, setPath] = useState([]);

//     const {
//         coords,
//         isGeolocationAvailable,
//         isGeolocationEnabled,
//         positionError,
//         getPosition,
//     } = useGeolocated({
//         positionOptions: {
//             enableHighAccuracy: true,
//             maximumAge: 0,
//             timeout: Infinity,
//         },
//         watchPosition: true,
//         userDecisionTimeout: 1,
//         suppressLocationOnMount: false,
//         geolocationProvider: navigator.geolocation,
//         isOptimisticGeolocationEnabled: true,
//         watchLocationPermissionChange: false,
//         onError: (error) => console.error(error),
//         onSuccess: (position) => console.log(position),
//     });

//     useEffect(() => {
//         if (coords) {
//             const newCoords = {
//                 lat: coords.latitude,
//                 lng: coords.longitude,
//             };

//             if (!initialPosition) {
//                 setInitialPosition(newCoords);
//                 setMarkers([newCoords]);
//             } else {
//                 setCurrentPosition(newCoords);
//                 setMarkers([initialPosition, newCoords]);
//             }

//             if (initialPosition && newCoords) {
//                 setPath([initialPosition, newCoords]);
//             }
//         }
//     }, [coords, initialPosition]);

//     const mapContainerStyle = {
//         height: '400px',
//         width: '100%',
//     };

//     const center = initialPosition
//         ? { lat: initialPosition.lat, lng: initialPosition.lng }
//         : { lat: 0, lng: 0 };


//         const style = {

//         }

//     return (
//         <div>
//             {!isGeolocationAvailable ? (
//                 <div>Your browser does not support Geolocation</div>
//             ) : !isGeolocationEnabled ? (
//                 <div>Geolocation is not enabled</div>
//             ) : (
//                 <>
//                     {initialPosition && (
//                         <div>
//                             <h3>Initial Position:</h3>
//                             <p>Latitude: {initialPosition.lat}</p>
//                             <p>Longitude: {initialPosition.lng}</p>
//                         </div>
//                     )}
//                     {currentPosition && (
//                         <div>
//                             <h3>Current Position:</h3>
//                             <p>Latitude: {currentPosition.lat}</p>
//                             <p>Longitude: {currentPosition.lng}</p>
//                             <p>Timestamp: {new Date().toLocaleString()}</p>
//                         </div>
//                     )}
//                     {positionError && (
//                         <div>Error: {positionError.message}</div>
//                     )}
//                     <LoadScript googleMapsApiKey="AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw">
//                         <GoogleMap
//                             mapContainerStyle={mapContainerStyle}
//                             center={center}
//                             zoom={15}
//                             onLoad={() => console.log('Map Component Loaded...')}
//                             onUnmount={() => console.log('Map Component Unmounted...')}
//                         >
//                             {markers.map((position, index) => (
//                                 <Marker
//                                     key={index}
//                                     position={position}
//                                     label={index === 0 ? 'Initial' : 'Current'}
//                                 />
//                             ))}
//                             {path.length > 1 && (
//                                 <Polyline
//                                     path={path}
//                                     options={{
//                                         strokeColor: '#FF0000',
//                                         strokeOpacity: 1.0,
//                                         strokeWeight: 2,
//                                     }}
//                                 />
//                             )}
//                         </GoogleMap>
//                     </LoadScript>
//                 </>
//             )}
//             <button onClick={getPosition}>Get Position</button>
//         </div>
//     );
// };

// export default GeolocationComponent;

// 'use client' 
 //ismile;
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import axios from 'axios';

// const GeoLiveLocation = () => {
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [map, setMap] = useState(null);
//     const [markers, setMarkers] = useState([]);
//     const [polylines, setPolylines] = useState([]);
//     const [totalDistance, setTotalDistance] = useState(0);


//     const { data: employeeGeo = [] } = useQuery({
//         queryKey: ['employeeGeo', selectedEmployeeId],
//         queryFn: async () => {
//             try {
//                 if (!selectedEmployeeId) {
//                     return [];
//                 }
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/geo_location_all/${selectedEmployeeId}`);
//                 if (!res.ok) {
//                     throw new Error('Failed to fetch employee data');
//                 }
//                 const data = await res.json();
//                 return data;
//             } catch (error) {
//                 console.error('Error fetching employeeGeo:', error);
//                 return [];
//             }
//         }
//     });

//     const { data: employeeList = [] } = useQuery({
//         queryKey: ['employeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`)
//             const data = await res.json()
//             return data
//         }
//     });

//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw"
//     });

//     useEffect(() => {
//         // Reset selectedDate when employee changes
//         setSelectedDate(null);
//     }, [selectedEmployeeId]);


//     const employe = employeeList.find(employe => employe.user_id === parseFloat(selectedEmployeeId))

//     useEffect(() => {
//         if (isLoaded && searchResults.length > 0 && selectedDate) {
//             const filteredLocations = searchResults
//                 .filter(geo => geo.created_date.split('T')[0] === selectedDate)
//                 .map(item => ({
//                     lat: parseFloat(item.latitude),
//                     lng: parseFloat(item.longitude),
//                     created_date: item.created_date
//                 }));

//             if (filteredLocations.length > 0) {
//                 // Update markers
//                 const newMarkers = filteredLocations.map((location, index) => (
//                     <Marker
//                         key={`${location.lat}_${location.lng}`}
//                         position={{ lat: location.lat, lng: location.lng }}
//                         label={String.fromCharCode(65 + index)} // Label as A, B, C, etc.
//                         title={`${location.created_date.split('T')[0]} ${location.created_date.split('T')[1].split('.')[0]}  ${employe.full_name}`}

//                     />
//                 ));
//                 setMarkers(newMarkers);

//                 // Create polylines and calculate total distance
//                 let totalDistance = 0;
//                 const newPolylines = [];
//                 for (let i = 0; i < filteredLocations.length - 1; i++) {
//                     const directionsService = new window.google.maps.DirectionsService();

//                     directionsService.route(
//                         {
//                             origin: new window.google.maps.LatLng(filteredLocations[i].lat, filteredLocations[i].lng),
//                             destination: new window.google.maps.LatLng(filteredLocations[i + 1].lat, filteredLocations[i + 1].lng),
//                             travelMode: window.google.maps.TravelMode.DRIVING,
//                         },
//                         (result, status) => {
//                             console.log(result?.routes[0]?.summary)
//                             console.log(result?.routes[0])
//                             if (status === window.google.maps.DirectionsStatus.OK) {
//                                 const distance = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0); // Sum up distance for all legs
//                                 totalDistance += distance;
//                                 console.log(result)
//                                 console.log(newPolylines)

//                                 newPolylines.push(
//                                     <Polyline
//                                         key={`polyline_${i}`}
//                                         path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//                                         options={{
//                                             strokeColor: selectedDate === filteredLocations[i].created_date.split('T')[0] ? "#FF0000" : "#FFFFFF", // Red 
//                                             strokeOpacity: 1,
//                                             strokeWeight: 2,
//                                         }}
//                                     />
//                                 );
//                                 setPolylines([...newPolylines]); // Update state with new polylines
//                                 setTotalDistance(totalDistance); // Update total distance state
//                                 console.log(newPolylines)
//                             } else {
//                                 console.error(`Error fetching directions: ${status}`);
//                             }
//                         }
//                     );
//                 }

//                 // Center map on the first marker
//                 if (map) {
//                     map.panTo({ lat: filteredLocations[0].lat, lng: filteredLocations[0].lng });
//                 }
//             } else {
//                 setMarkers([]); // Clear markers if no locations for the selected date
//                 setPolylines([]); // Clear polylines if no locations for the selected date
//                 setTotalDistance(0); // Reset total distance
//             }
//         }
//     }, [isLoaded, searchResults, selectedDate, map, employe]);



//     const onLoad = React.useCallback(function callback(map) {
//         setMap(map);
//     }, []);

//     const onUnmount = React.useCallback(function callback() {
//         setMap(null);
//     }, []);

//     const handleDateButtonClick = (date) => {

//         setSelectedDate(date);
//     };

//     const handleEmployeeChange = (event) => {
//         setSelectedEmployeeId(event.target.value);
//     };

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     const uniqueDates = [...new Set(searchResults.map(geo => geo.created_date.split('T')[0]))];

//     const page_group = localStorage.getItem('pageGroup');

//     return isLoaded ? (
//         <div>
//             <div className="container-fluid">
//                 <div className="row">
//                     <div className='col-12 p-4'>

//                         <div className='card mb-4'>
//                             <div className="body-content bg-light">
//                                 <div className="border-primary shadow-sm border-0">
//                                     <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                         <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Location Search</h5>
//                                         <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                             <Link href={`/Admin/employee/employee_list?page_group=${page_group}`} className="btn btn-sm btn-info">Back To Employee List</Link>
//                                         </div>
//                                     </div>
//                                     <div className="card-body">
//                                         <form>
//                                             <div className="col-md-10 offset-md-1">
//                                                 <div className="form-group row student">
//                                                     <label className="col-form-label col-md-2"><strong>Employee Name:</strong></label>
//                                                     <div className="col-md-10">
//                                                         <select
//                                                             className="mb-3 form-control form-control-sm required integer_no_zero"
//                                                             id="employee_name"
//                                                             value={selectedEmployeeId}
//                                                             onChange={handleEmployeeChange}
//                                                         >
//                                                             <option value="">Select employee Name</option>
//                                                             {employeeList.map(employee => (
//                                                                 <option key={employee.user_id} value={employee.user_id}>{employee.full_name}</option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                 </div>



//                                                 <div className="form-group row">
//                                                     <div className="offset-md-2 col-md-10 float-left">
//                                                         <input
//                                                             type="button"
//                                                             name="search"
//                                                             className="btn btn-sm btn-info search_btn mr-2"
//                                                             value="Search"

//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className='d-flex'>


//                 <div  style={{ width: '100%', height: '100vh' }}>

//                     {searchResults.length > 0 ? (
//                         <>


//                             <GoogleMap
//                                 mapContainerStyle={{ width: '100%', height: '80vh' }}
//                                 center={
//                                     selectedDate
//                                         ? {
//                                             lat: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate)?.latitude),
//                                             lng: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate)?.longitude),
//                                         }
//                                         : {
//                                             lat: employeeGeo.length > 0 ? parseFloat(employeeGeo[0].latitude) : 0,
//                                             lng: employeeGeo.length > 0 ? parseFloat(employeeGeo[0].longitude) : 0,
//                                         }
//                                 }
//                                 zoom={14}
//                                 onLoad={onLoad}
//                                 onUnmount={onUnmount}
//                             >
//                                 <>
//                                     {markers}
//                                     {polylines}

//                                 </>
//                             </GoogleMap>

//                         </>
//                     ) : (
//                         <p className="mt-3 ml-4">No data</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GeoLiveLocation;

// 'use client' 
 //ismile;
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';

// const GeoLiveLocation = () => {
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [map, setMap] = useState(null);
//     const [markers, setMarkers] = useState({});
//     const [polylines, setPolylines] = useState({});
//     const [totalDistance, setTotalDistance] = useState(0);
//     const [employeeData, setEmployeeData] = useState({});

//     const { data: employeeList = [] } = useQuery({
//         queryKey: ['employeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw"
//     });

//     useEffect(() => {
//         const fetchEmployeeGeo = async (employeeId) => {
//             try {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/geo_location_all/${employeeId}`);
//                 if (!res.ok) {
//                     throw new Error('Failed to fetch employee data');
//                 }
//                 const data = await res.json();
//                 setEmployeeData((prevData) => ({ ...prevData, [employeeId]: data }));
//             } catch (error) {
//                 console.error('Error fetching employeeGeo:', error);
//             }
//         };

//         if (employeeList.length > 0) {
//             employeeList.forEach(employee => {
//                 fetchEmployeeGeo(employee.user_id);
//             });
//         }
//     }, [employeeList]);

//     useEffect(() => {
//         if (isLoaded && selectedDate) {
//             employeeList.forEach(employee => {
//                 const filteredLocations = (employeeData[employee.user_id] || [])
//                     .filter(geo => geo.created_date.split('T')[0] === selectedDate)
//                     .map(item => ({
//                         lat: parseFloat(item.latitude),
//                         lng: parseFloat(item.longitude),
//                         created_date: item.created_date
//                     }));

//                 if (filteredLocations.length > 0) {
//                     // Update markers
//                     const newMarkers = filteredLocations.map((location, index) => (
//                         <Marker
//                             key={`${location.lat}_${location.lng}`}
//                             position={{ lat: location.lat, lng: location.lng }}
//                             label={String.fromCharCode(65 + index)} // Label as A, B, C, etc.
//                             title={`${location.created_date.split('T')[0]} ${location.created_date.split('T')[1].split('.')[0]}  ${employee.full_name}`}
//                         />
//                     ));

//                     // Create polylines and calculate total distance
//                     let totalDistance = 0;
//                     const newPolylines = [];
//                     for (let i = 0; i < filteredLocations.length - 1; i++) {
//                         const directionsService = new window.google.maps.DirectionsService();

//                         directionsService.route(
//                             {
//                                 origin: new window.google.maps.LatLng(filteredLocations[i].lat, filteredLocations[i].lng),
//                                 destination: new window.google.maps.LatLng(filteredLocations[i + 1].lat, filteredLocations[i + 1].lng),
//                                 travelMode: window.google.maps.TravelMode.DRIVING,
//                             },
//                             (result, status) => {
//                                 if (status === window.google.maps.DirectionsStatus.OK) {
//                                     const distance = result.routes[0].legs.reduce((acc, leg) => acc + leg.distance.value, 0); // Sum up distance for all legs
//                                     totalDistance += distance;

//                                     newPolylines.push(
//                                         <Polyline
//                                             key={`polyline_${i}`}
//                                             path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//                                             options={{
//                                                 strokeColor: "#FF0000", // Red
//                                                 strokeOpacity: 1,
//                                                 strokeWeight: 2,
//                                             }}
//                                         />
//                                     );
//                                     setPolylines((prevPolylines) => ({ ...prevPolylines, [employee.user_id]: newPolylines })); // Update state with new polylines
//                                     setTotalDistance(totalDistance); // Update total distance state
//                                 } else {
//                                     console.error(`Error fetching directions: ${status}`);
//                                 }
//                             }
//                         );
//                     }

//                     setMarkers((prevMarkers) => ({ ...prevMarkers, [employee.user_id]: newMarkers })); // Update state with new markers
//                 } else {
//                     setMarkers((prevMarkers) => ({ ...prevMarkers, [employee.user_id]: [] })); // Clear markers if no locations for the selected date
//                     setPolylines((prevPolylines) => ({ ...prevPolylines, [employee.user_id]: [] })); // Clear polylines if no locations for the selected date
//                     setTotalDistance(0); // Reset total distance
//                 }
//             });
//         }
//     }, [isLoaded, selectedDate, employeeData, employeeList]);

//     const onLoad = React.useCallback(function callback(map) {
//         setMap(map);
//     }, []);

//     const onUnmount = React.useCallback(function callback() {
//         setMap(null);
//     }, []);





//     const page_group = localStorage.getItem('pageGroup');

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     return isLoaded ? (
//         <div>
//             <div className="container-fluid">
//                 <div className="row">
//                     <div className='col-12 p-4'>
//                         <div className='card mb-4'>
//                             <div className="body-content bg-light">
//                                 <div className="border-primary shadow-sm border-0">
//                                     <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                         <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Location Search</h5>
//                                         <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                             <Link href={`/Admin/employee/employee_list?page_group=${page_group}`} className="btn btn-sm btn-info">Back To Employee List</Link>
//                                         </div>
//                                     </div>
//                                     <div className="card-body">
//                                         <form>
//                                             <div className="col-md-10 offset-md-1">

//                                                 <div className="form-group row">
//                                                     <p>Yaaa</p>
//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className='d-flex flex-wrap'>
//                 {employeeList.map(employee => (
//                     <div key={employee.user_id} className='col-md-6' style={{ width: '50%', height: '50vh' }}>
//                         <h3>{employee.full_name}</h3>

//                         {employeeData[employee.user_id] && employeeData[employee.user_id].length > 0 ? (
//                             <GoogleMap
//                                 mapContainerStyle={{ width: '100%', height: '80vh' }}
//                                 center={
//                                     selectedDate
//                                         ? {
//                                             lat: parseFloat(employeeData[employee.user_id].find(geo => geo.created_date.split('T')[0] === selectedDate)?.latitude),
//                                             lng: parseFloat(employeeData[employee.user_id].find(geo => geo.created_date.split('T')[0] === selectedDate)?.longitude),
//                                         }
//                                         : {
//                                             lat: parseFloat(employeeData[employee.user_id][0].latitude),
//                                             lng: parseFloat(employeeData[employee.user_id][0].longitude),
//                                         }
//                                 }
//                                 zoom={14}
//                                 onLoad={onLoad}
//                                 onUnmount={onUnmount}
//                             >
//                                 {markers[employee.user_id]}
//                                 {polylines[employee.user_id]}
//                             </GoogleMap>
//                         ) : (
//                             <p className="mt-3 ml-4">No data</p>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GeoLiveLocation;



// 'use client' 
 //ismile;
// import React, { useEffect, useState } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';

// const GeoLiveLocation = () => {
//     const [markers, setMarkers] = useState({});
//     const [polylines, setPolylines] = useState({});

//     const { data: employeeList = [] } = useQuery({
//         queryKey: ['employeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw"
//     });

//     const fetchEmployeeGeo = async (employeeId) => {
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/geo_location_all/${employeeId}`);
//             if (!res.ok) {
//                 throw new Error('Failed to fetch employee data');
//             }
//             const data = await res.json();
//             return data;
//         } catch (error) {
//             console.error('Error fetching employeeGeo:', error);
//             return [];
//         }
//     };

//     useEffect(() => {
//         const fetchAllEmployeeGeo = async () => {
//             const allMarkers = {};
//             const allPolylines = {};

//             for (const employee of employeeList) {
//                 const data = await fetchEmployeeGeo(employee.user_id);
// // console.log(data)
//                 const employeeMarkers = data.map((item, index) => ({
//                     position: { lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) },
//                     title: `${item?.created_date?.split('T')[0]} ${item?.created_date?.split('T')[1].split('.')[0]}`
//                 }));

//                 const employeePolylines = [];
//                 for (let i = 0; i < data.length - 1; i++) {
//                     const start = { lat: parseFloat(data[i].latitude), lng: parseFloat(data[i].longitude) };
//                     const end = { lat: parseFloat(data[i + 1].latitude), lng: parseFloat(data[i + 1].longitude) };
//                     employeePolylines.push({ start, end });
//                 }

//                 allMarkers[employee.user_id] = employeeMarkers;
//                 allPolylines[employee.user_id] = employeePolylines;
//             }

//             setMarkers(allMarkers);
//             setPolylines(allPolylines);
//         };

//         if (employeeList.length > 0) {
//             fetchAllEmployeeGeo();
//         }
//     }, [employeeList]);

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     console.log(markers)
//     console.log(polylines)


//     console.log()

//     return isLoaded ? (
//         <div className="container-fluid">
//             <div className="d-flex flex-wrap">
//                 {employeeList.map(employee => (
//                     <div key={employee.user_id} className='col-md-6'>
//                         <div className='card mb-4'>
//                             <div className="body-content bg-light">
//                                 <div className="border-primary shadow-sm border-0">
//                                     <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                         <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
//                                             {employee.full_name}s Location
//                                         </h5>

//                                     </div>
//                                     <p>Name: {employee.full_name}</p>
//                                     <p>Name: {employee.user_id}</p>
//                                     <div className="card-body">
//                                         {markers[employee.user_id] && markers[employee.user_id].length > 0 ? (
//                                             <GoogleMap
//                                                 mapContainerStyle={{ width: '100%', height: '50vh' }}
//                                                 center={markers[employee.user_id][0].position}
//                                                 zoom={14}
//                                             >
//                                                 {markers[employee.user_id].map((marker, index) => (


//                                                     <Marker
//                                                         key={index}
//                                                         position={marker.position}
//                                                         label={String.fromCharCode(65 + index)} // Label as A, B, C, etc.
//                                                         title={marker.title}
//                                                     />

//                                                 ))}
//                                                 {polylines[employee.user_id].map((polyline, index) => (
//                                                     <Polyline
//                                                         key={index}
//                                                         path={[polyline.start, polyline.end]}
//                                                         options={{
//                                                             strokeColor: "#FF0000", // Red
//                                                             strokeOpacity: 1,
//                                                             strokeWeight: 2,
//                                                         }}
//                                                     />
//                                                 ))}
//                                             </GoogleMap>
//                                         ) : (
//                                             <p>No data available for {employee.full_name}</p>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GeoLiveLocation;


// 'use client' 
 //ismile;
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';

// const GeoLiveLocation = () => {
//     const [markers, setMarkers] = useState({});
//     const [polylines, setPolylines] = useState({});

//     const { data: employeeList = [] } = useQuery({
//         queryKey: ['employeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw"
//     });

//     const fetchEmployeeGeo = async (employeeId) => {
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/geo_location_all/${employeeId}`);
//             if (!res.ok) {
//                 throw new Error('Failed to fetch employee data');
//             }
//             const data = await res.json();
//             return data;
//         } catch (error) {
//             console.error('Error fetching employeeGeo:', error);
//             return [];
//         }
//     };

//     useEffect(() => {
//         const fetchAllEmployeeGeo = async () => {
//             const allMarkers = {};
//             const allPolylines = {};

//             for (const employee of employeeList) {
//                 const data = await fetchEmployeeGeo(employee.user_id);

//                 const employeeMarkers = data.map((item, index) => (
//                     <Marker
//                         key={`${employee.user_id}_marker_${index}`}
//                         position={{ lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) }}
//                         label={String.fromCharCode(65 + index)}
//                         title={`${item?.created_date?.split('T')[0]} ${item?.created_date?.split('T')[1]?.split('.')[0]}`}
//                     />
//                 ));

//                 const employeePolylines = [];
//                 for (let i = 0; i < data.length - 1; i++) {
//                     const start = { lat: parseFloat(data[i].latitude), lng: parseFloat(data[i].longitude) };
//                     const end = { lat: parseFloat(data[i + 1].latitude), lng: parseFloat(data[i + 1].longitude) };

//                     const directionsService = new window.google.maps.DirectionsService();
//                     const result = await new Promise((resolve, reject) => {
//                         directionsService.route(
//                             {
//                                 origin: new window.google.maps.LatLng(start.lat, start.lng),
//                                 destination: new window.google.maps.LatLng(end.lat, end.lng),
//                                 travelMode: window.google.maps.TravelMode.DRIVING,
//                             },
//                             (result, status) => {
//                                 if (status === window.google.maps.DirectionsStatus.OK) {
//                                     resolve(result);
//                                 } else {
//                                     reject(status);
//                                 }
//                             }
//                         );
//                     });

//                     employeePolylines.push(
//                         <Polyline
//                             key={`${employee.user_id}_polyline_${i}`}
//                             path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//                             options={{
//                                 strokeColor: "#FF0000", // Red
//                                 strokeOpacity: 1,
//                                 strokeWeight: 2,
//                             }}
//                         />
//                     );
//                 }

//                 allMarkers[employee.user_id] = employeeMarkers;
//                 allPolylines[employee.user_id] = employeePolylines;
//             }

//             setMarkers(allMarkers);
//             setPolylines(allPolylines);
//         };

//         if (employeeList.length > 0 && isLoaded) {
//             fetchAllEmployeeGeo();
//         }
//     }, [employeeList, isLoaded]);

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     return isLoaded ? (
//         <div className="container-fluid">
//             <div className="row">
//                 {employeeList.map(employee => (
//                     <div key={employee.user_id} className='col-12 p-4'>
//                         <div className='card mb-4'>
//                             <div className="body-content bg-light">
//                                 <div className="border-primary shadow-sm border-0">
//                                     <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                         <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
//                                             {employee.full_name}s Location
//                                         </h5>
//                                     </div>
//                                     <div className="card-body">
//                                         {markers[employee.user_id] && markers[employee.user_id].length > 0 ? (
//                                             <GoogleMap
//                                                 mapContainerStyle={{ width: '100%', height: '80vh' }}
//                                                 center={markers[employee.user_id][0].props.position}
//                                                 zoom={14}
//                                             >
//                                                 {markers[employee.user_id]}
//                                                 {polylines[employee.user_id]}
//                                             </GoogleMap>
//                                         ) : (
//                                             <p>No data available for {employee.full_name}</p>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GeoLiveLocation;
// 'use client' 
 //ismile
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import axios from 'axios';

// const EmployeeGoogleMap = ({ id }) => {
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState(id);
//     const [searchResults, setSearchResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [fromDate, setFromDate] = useState(null);
//     const [toDate, setToDate] = useState(null);
//     const [showFromDate, setShowFromDate] = useState('');
//     const [showToDate, setShowToDate] = useState('');

//     const { data: employeeGeo = [] } = useQuery({
//         queryKey: ['employeeGeo', selectedEmployeeId],
//         queryFn: async () => {
//             try {
//                 if (!selectedEmployeeId) {
//                     return [];
//                 }
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/geo_location_all/${selectedEmployeeId}`);
//                 // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_geo/${selectedEmployeeId}`);
//                 if (!res.ok) {
//                     throw new Error('Failed to fetch employee data');
//                 }
//                 const data = await res.json();
//                 return data;
//             } catch (error) {
//                 console.error('Error fetching employeeGeo:', error);
//                 return [];
//             }
//         }
//     });

//     const { data: employeeList = [] } = useQuery({
//         queryKey: ['employeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`)
//             const data = await res.json()
//             return data
//         }
//     })

//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyC-wZD1z4x8YNcwEXbFin1JfIBsAJz32gE"
//     });

//     const [selectedDate, setSelectedDate] = useState(null);
//     const [map, setMap] = useState(null);
//     const [markers, setMarkers] = useState([]);
//     const [polylines, setPolylines] = useState([]);

//     useEffect(() => {
//         // Reset selectedDate when employee changes
//         setSelectedDate(null);
//     }, [selectedEmployeeId]);

//     useEffect(() => {
//         if (isLoaded && searchResults.length > 0 && selectedDate) {
//             const filteredLocations = searchResults
//                 .filter(geo => geo.created_date.split('T')[0] === selectedDate)
//                 .map(item => ({
//                     lat: parseFloat(item.latitude),
//                     lng: parseFloat(item.longitude)
//                 }));

//             if (filteredLocations.length > 0) {
//                 // Update markers
//                 const newMarkers = filteredLocations.map((location, index) => (
//                     <Marker
//                         key={`${location.lat}_${location.lng}`}
//                         position={{ lat: location.lat, lng: location.lng }}
//                         label={String.fromCharCode(65 + index)} // Label as A, B, C, etc.
//                     />
//                 ));
//                 setMarkers(newMarkers);

//                 // Create polylines
//                 const newPolylines = [];
//                 for (let i = 0; i < filteredLocations.length - 1; i++) {
//                     const directionsService = new window.google.maps.DirectionsService();

//                     directionsService.route(
//                         {
//                             origin: new window.google.maps.LatLng(filteredLocations[i].lat, filteredLocations[i].lng),
//                             destination: new window.google.maps.LatLng(filteredLocations[i + 1].lat, filteredLocations[i + 1].lng),
//                             travelMode: window.google.maps.TravelMode.DRIVING,
//                         },
//                         (result, status) => {
//                             if (status === window.google.maps.DirectionsStatus.OK) {
//                                 newPolylines.push(
//                                     <Polyline
//                                         key={`polyline_${i}`}
//                                         path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//                                         options={{
//                                             strokeColor: "#FF0000", // Red color
//                                             strokeOpacity: 1,
//                                             strokeWeight: 2,
//                                         }}
//                                     />
//                                 );
//                                 setPolylines([...newPolylines]); // Update state with new polylines
//                             } else {
//                                 console.error(`Error fetching directions: ${status}`);
//                             }
//                         }
//                     );
//                 }

//                 // Center map on the first marker
//                 if (map) {
//                     map.panTo({ lat: filteredLocations[0].lat, lng: filteredLocations[0].lng });
//                 }
//             } else {
//                 setMarkers([]); // Clear markers if no locations for the selected date
//                 setPolylines([]); // Clear polylines if no locations for the selected date
//             }
//         }
//     }, [isLoaded, searchResults, selectedDate, map]);

//     const onLoad = React.useCallback(function callback(map) {
//         setMap(map);
//     }, []);

//     const onUnmount = React.useCallback(function callback() {
//         setMap(null);
//     }, []);

//     const handleDateButtonClick = (date) => {
//         setSelectedDate(date);
//     };


//     useEffect(() => {
//         if (fromDate && toDate) {
//             fetchSearchResults();
//         }
//     }, [fromDate, toDate]);


//     const page_group = localStorage.getItem('pageGroup')









//     return (
//         isLoaded ? (
//             <div>
//                 <div class="container-fluid">
//                     <div class="row">
//                         <div className='col-12 p-4'>
//                             <div className='card mb-4'>
//                                 <div class="body-content bg-light">
//                                     <div class="border-primary shadow-sm border-0">
//                                         <div class="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                             <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Location Search</h5>
//                                             <div class="card-title font-weight-bold mb-0 card-header-color float-right">
//                                                 <Link href={`/Admin/employee/employee_list?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Employee List</Link>
//                                             </div>
//                                         </div>
//                                         <div class="card-body">

//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className='d-flex'>



//                     {
//                         searchResults.length > 0 ?
//                             <GoogleMap
//                                 mapContainerStyle={{ width: '100%', height: '100vh' }}
//                                 center={
//                                     selectedDate ?
//                                         { lat: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate)?.latitude), lng: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate)?.longitude) }
//                                         :
//                                         { lat: employeeGeo.length > 0 ? parseFloat(employeeGeo[0].latitude) : 0, lng: employeeGeo.length > 0 ? parseFloat(employeeGeo[0].longitude) : 0 }
//                                 }
//                                 zoom={14}
//                                 onLoad={onLoad}
//                                 onUnmount={onUnmount}
//                             >
//                                 <>
//                                     {markers}
//                                     {polylines}
//                                 </>
//                             </GoogleMap>
//                             :
//                             'No data'
//                     }

//                 </div>
//             </div>
//         ) : (
//             <div>Loading...</div>
//         )
//     );
// };

// export default EmployeeGoogleMap;



// "use client"
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';

// const EmployeeGoogleMap = () => {
//     const [employeeList, setEmployeeList] = useState([]);
//     const { isLoaded } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw"
//     });


//     const [employeeId, setEmployeeId] = useState([])
//     const clickSearch = (id) => {
//         setEmployeeId(id)
//     }
//     console.log(employeeId)

//     const fetchEmployeeList = async () => {
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`);
//             if (!res.ok) {
//                 throw new Error('Failed to fetch employee list');
//             }
//             const data = await res.json();
//             setEmployeeList(data);
//         } catch (error) {
//             console.error('Error fetching employee list:', error);
//         }
//     };

//     useEffect(() => {
//         fetchEmployeeList();
//     }, []);

//     const fetchEmployeeGeo = async (employeeId) => {
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/geo_location_all_live/${employeeId}`);
//             // if (!res.ok) {
//             //     throw new Error('Failed to fetch employee data');
//             // }
//             const data = await res.json();
//             return data;
//         } catch (error) {
//             // console.error('Error fetching employeeGeo:', error);
//             return [];
//         }
//     };

//     const EmployeeMap = ({ employee }) => {
//         const [map, setMap] = useState(null);
//         const [markers, setMarkers] = useState([]);
//         const [polylines, setPolylines] = useState([]);
//         const [employeeGeo, setEmployeeGeo] = useState([]);

//         useEffect(() => {
//             const getGeoData = async () => {
//                 try {
//                     const geoData = await fetchEmployeeGeo(employee.user_id);
//                     setEmployeeGeo(geoData);
//                 } catch (error) {
//                     console.error('Error fetching employeeGeo:', error);
//                 }
//             };
//             getGeoData();
//         }, [employee.user_id]);

//         useEffect(() => {
//             if (isLoaded && employeeGeo.length > 0) {
//                 const newMarkers = employeeGeo.map((location, index) => (
//                     <Marker
//                         key={`${location.latitude}_${location.longitude}`}
//                         position={{ lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }}
//                         label={String.fromCharCode(65 + index)} // Label as A, B, C, etc.
//                     />
//                 ));
//                 setMarkers(newMarkers);

//                 const newPolylines = [];
//                 for (let i = 0; i < employeeGeo.length - 1; i++) {
//                     const directionsService = new window.google.maps.DirectionsService();

//                     directionsService.route(
//                         {
//                             origin: new window.google.maps.LatLng(parseFloat(employeeGeo[i].latitude), parseFloat(employeeGeo[i].longitude)),
//                             destination: new window.google.maps.LatLng(parseFloat(employeeGeo[i + 1].latitude), parseFloat(employeeGeo[i + 1].longitude)),
//                             travelMode: window.google.maps.TravelMode.DRIVING,
//                         },
//                         (result, status) => {
//                             if (status === window.google.maps.DirectionsStatus.OK) {
//                                 newPolylines.push(
//                                     <Polyline
//                                         key={`polyline_${i}`}
//                                         path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//                                         options={{
//                                             strokeColor: "#FF0000", // Red color
//                                             strokeOpacity: 1,
//                                             strokeWeight: 2,
//                                         }}
//                                     />
//                                 );
//                                 setPolylines([...newPolylines]);
//                             } else {
//                                 console.error(`Error fetching directions: ${status}`);
//                             }
//                         }
//                     );
//                 }

//                 if (map && employeeGeo.length > 0 && !isNaN(parseFloat(employeeGeo[0].latitude)) && !isNaN(parseFloat(employeeGeo[0].longitude))) {
//                     map.panTo({ lat: parseFloat(employeeGeo[0].latitude), lng: parseFloat(employeeGeo[0].longitude) });
//                 }
//             }
//         }, [isLoaded, employeeGeo, map]);

//         const onLoad = React.useCallback(function callback(map) {
//             setMap(map);
//         }, []);

//         const onUnmount = React.useCallback(function callback() {
//             setMap(null);
//         }, []);




//         return (
//             <div key={employee.user_id} className='col-md-6'>
//                 <div className='card mb-4'>
//                     <div className="body-content bg-light">
//                         <div className="border-primary shadow-sm border-0">
//                             <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                 <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
//                                     {employee.full_name}s Location
//                                 </h5>

//                             </div>
//                             <p>Name: {employee.full_name}</p>
//                             <p>Name: {employee.user_id}</p>
//                             <div className="card-body">
//                                 {employeeGeo.length > 0 ? (
//                                     <GoogleMap
//                                         mapContainerStyle={{ width: '100%', height: '400px' }}
//                                         center={{ lat: parseFloat(employeeGeo[0].latitude), lng: parseFloat(employeeGeo[0].longitude) }}
//                                         zoom={14}
//                                         onLoad={onLoad}
//                                         onUnmount={onUnmount}
//                                     >
//                                         <>
//                                             {markers}
//                                             {polylines}
//                                         </>
//                                     </GoogleMap>
//                                 ) : (
//                                     'No data'
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>


//         );
//     };


//     return (
//         isLoaded ? (
//             <div>
//                 <div className="container-fluid">
//                     <div className="row">
//                         <div className='col-12 p-4'>
//                             <div className='card mb-4'>
//                                 <div className="body-content bg-light">
//                                     <div className="border-primary shadow-sm border-0">
//                                         <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                             <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Live Location</h5>
//                                             <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                                 <Link href={`/Admin/employee/employee_list?page_group=${localStorage.getItem('pageGroup')}`} className="btn btn-sm btn-info">Back To Employee List</Link>
//                                             </div>
//                                         </div>
//                                         <div className="card-body">
//                                             <div className="form-group row">
//                                                 <div className="col-md-10 offset-md-1">
//                                                     <div className="form-group row student">
//                                                         <label className="col-form-label col-md-2"><strong>Employee Name:</strong></label>
//                                                         <div className="col-md-10">
//                                                             <select
//                                                                 className="mb-3 form-control form-control-sm required integer_no_zero"
//                                                                 id="employee_name"

//                                                             >
//                                                                 <option value="">Select employee Name</option>
//                                                                 {employeeList.map(employee => (
//                                                                     <option key={employee.user_id} value={employee.user_id}>{employee.full_name}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="offset-md-2 col-md-10 float-left">
//                                                     <input
//                                                         type="button"
//                                                         name="search"
//                                                         className="btn btn-sm btn-info search_btn mr-2"
//                                                         value="Search"
//                                                         onClick={() => clickSearch()}
//                                                     />
//                                                 </div>


//                                                 <div>
//                                                     User id wise Search MAp
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="container-fluid">
//                     <div className="row">
//                         <div className='col-12'>
//                             <div className='card mb-4'>
//                                 <div className="body-content bg-light">
//                                     <div className="border-primary shadow-sm border-0">
//                                         <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary text-white">

//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
//                                                 <strong>Live Location</strong>
//                                             </div>

//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-right">
//                                                 <div className="input-group printable">
//                                                     <select
//                                                         name="religion" class="form-control form-control-sm  required integer_no_zero">
//                                                         <option value=''>Select Time</option>
//                                                         <option value='10'>10 Seconds</option>
//                                                         <option value='20'>20 Seconds</option>
//                                                         <option value='30'>30 Seconds</option>
//                                                         <option value='60'>1 Minutes</option>
//                                                         <option value='120'>2 Minutes</option>
//                                                         <option value='180'>3 Minutes</option>
//                                                         <option value='240'>4 Minutes</option>
//                                                         <option value='300'>5 Minutes</option>
//                                                     </select>
//                                                     <div className="input-group-append">
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-info btn-sm "

//                                                         >
//                                                             Refresh
//                                                         </button>
//                                                     </div>
//                                                 </div>

//                                             </div>
//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-right mr-2">
//                                                 <div className="input-group printable">

//                                                     <div className="input-group-append">
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-info btn-sm py-1 add_more "
//                                                         >
//                                                             Import
//                                                         </button>
//                                                     </div>
//                                                 </div>

//                                             </div>
//                                         </div>
//                                         <div className="card-body">
//                                             <div className="container-fluid">
//                                                 <div className="d-flex flex-wrap">

//                                                     {employeeList.map(employee => <EmployeeMap key={employee.id} employee={employee} clickSearch={clickSearch} employeId={employee.id} userId={employee.user_id}/>)}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         ) : (
//             <div>Loading...</div>
//         )
//     );
// };

// export default EmployeeGoogleMap;

// "use client";
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import Link from 'next/link';

// const EmployeeGoogleMap = () => {
//     const [employeeList, setEmployeeList] = useState([]);
//     const { isLoaded } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw"
//     });

//     const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

//     const fetchEmployeeList = async () => {
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`);
//             if (!res.ok) {
//                 throw new Error('Failed to fetch employee list');
//             }
//             const data = await res.json();
//             setEmployeeList(data);
//         } catch (error) {
//             console.error('Error fetching employee list:', error);
//         }
//     };

//     useEffect(() => {
//         fetchEmployeeList();
//     }, []);

//     const fetchEmployeeGeo = async (employeeId) => {
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/geo_location_all_live/${employeeId}`);
//             const data = await res.json();
//             return data;
//         } catch (error) {
//             return [];
//         }
//     };

//     const EmployeeMap = ({ employeeId }) => {
//         const [map, setMap] = useState(null);
//         const [markers, setMarkers] = useState([]);
//         const [polylines, setPolylines] = useState([]);
//         const [employeeGeo, setEmployeeGeo] = useState([]);

//         useEffect(() => {
//             const getGeoData = async () => {
//                 try {
//                     const geoData = await fetchEmployeeGeo(employeeId);
//                     setEmployeeGeo(geoData);
//                 } catch (error) {
//                     console.error('Error fetching employeeGeo:', error);
//                 }
//             };
//             if (employeeId) {
//                 getGeoData();
//             }
//         }, [employeeId]);

//         useEffect(() => {
//             if (isLoaded && employeeGeo.length > 0) {
//                 const newMarkers = employeeGeo.map((location, index) => (
//                     <Marker
//                         key={`${location.latitude}_${location.longitude}`}
//                         position={{ lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }}
//                         label={String.fromCharCode(65 + index)} // Label as A, B, C, etc.
//                     />
//                 ));
//                 setMarkers(newMarkers);

//                 const newPolylines = [];
//                 for (let i = 0; i < employeeGeo.length - 1; i++) {
//                     const directionsService = new window.google.maps.DirectionsService();

//                     directionsService.route(
//                         {
//                             origin: new window.google.maps.LatLng(parseFloat(employeeGeo[i].latitude), parseFloat(employeeGeo[i].longitude)),
//                             destination: new window.google.maps.LatLng(parseFloat(employeeGeo[i + 1].latitude), parseFloat(employeeGeo[i + 1].longitude)),
//                             travelMode: window.google.maps.TravelMode.DRIVING,
//                         },
//                         (result, status) => {
//                             if (status === window.google.maps.DirectionsStatus.OK) {
//                                 newPolylines.push(
//                                     <Polyline
//                                         key={`polyline_${i}`}
//                                         path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//                                         options={{
//                                             strokeColor: "#FF0000", // Red color
//                                             strokeOpacity: 1,
//                                             strokeWeight: 2,
//                                         }}
//                                     />
//                                 );
//                                 setPolylines([...newPolylines]);
//                             } else {
//                                 console.error(`Error fetching directions: ${status}`);
//                             }
//                         }
//                     );
//                 }

//                 if (map && employeeGeo.length > 0 && !isNaN(parseFloat(employeeGeo[0].latitude)) && !isNaN(parseFloat(employeeGeo[0].longitude))) {
//                     map.panTo({ lat: parseFloat(employeeGeo[0].latitude), lng: parseFloat(employeeGeo[0].longitude) });
//                 }
//             }
//         }, [isLoaded, employeeGeo, map]);

//         const onLoad = React.useCallback(function callback(map) {
//             setMap(map);
//         }, []);

//         const onUnmount = React.useCallback(function callback() {
//             setMap(null);
//         }, []);

//         return (
//             <div className='col-md-6'>
//                 <div className='card mb-4'>
//                     <div className="body-content bg-light">
//                         <div className="border-primary shadow-sm border-0">
//                             <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                 <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
//                                     Employee Location
//                                 </h5>
//                             </div>
//                             <div className="card-body">
//                                 {employeeGeo.length > 0 ? (
//                                     <GoogleMap
//                                         mapContainerStyle={{ width: '100%', height: '400px' }}
//                                         center={{ lat: parseFloat(employeeGeo[0].latitude), lng: parseFloat(employeeGeo[0].longitude) }}
//                                         zoom={14}
//                                         onLoad={onLoad}
//                                         onUnmount={onUnmount}
//                                     >
//                                         <>
//                                             {markers}
//                                             {polylines}
//                                         </>
//                                     </GoogleMap>
//                                 ) : (
//                                     'No data'
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         isLoaded ? (
//             <div>
//                 <div className="container-fluid">
//                     <div className="row">
//                         <div className='col-12 p-4'>
//                             <div className='card mb-4'>
//                                 <div className="body-content bg-light">
//                                     <div className="border-primary shadow-sm border-0">
//                                         <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                             <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Live Location</h5>
//                                             <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                                 <Link href={`/Admin/employee/employee_list?page_group=${localStorage.getItem('pageGroup')}`} className="btn btn-sm btn-info">Back To Employee List</Link>
//                                             </div>
//                                         </div>
//                                         <div className="card-body">
//                                             <div className="form-group row">
//                                                 <div className="col-md-10 offset-md-1">
//                                                     <div className="form-group row student">
//                                                         <label className="col-form-label col-md-2"><strong>Employee Name:</strong></label>
//                                                         <div className="col-md-10">
//                                                             <select
//                                                                 className="mb-3 form-control form-control-sm required integer_no_zero"
//                                                                 id="employee_name"
//                                                                 value={selectedEmployeeId}
//                                                                 onChange={(e) => setSelectedEmployeeId(e.target.value)}
//                                                             >
//                                                                 <option value="">Select Employee Name</option>
//                                                                 {employeeList.map(employee => (
//                                                                     <option key={employee.user_id} value={employee.user_id}>{employee.full_name}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="offset-md-2 col-md-10 float-left">
//                                                     <input
//                                                         type="button"
//                                                         name="search"
//                                                         className="btn btn-sm btn-info search_btn mr-2"
//                                                         value="Search"
//                                                         onClick={() => setSelectedEmployeeId(selectedEmployeeId)}
//                                                     />
//                                                 </div>
//                                                 <div className="card-body">
//                                             <div className="container-fluid">
//                                                 <div className="d-flex flex-wrap">
//                                                     {selectedEmployeeId && <EmployeeMap employeeId={selectedEmployeeId} />}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="container-fluid">
//                      <div className="row">
//                          <div className='col-12'>
//                              <div className='card mb-4'>
//                                  <div className="body-content bg-light">
//                                      <div className="border-primary shadow-sm border-0">
//                                          <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary text-white">

//                                              <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
//                                                  <strong>Live Location</strong>
//                                              </div>

//                                              <div className="card-title card-header-color font-weight-bold mb-0 float-right">
//                                                  <div className="input-group printable">
//                                                      <select
//                                                         name="religion" class="form-control form-control-sm  required integer_no_zero">
//                                                         <option value=''>Select Time</option>
//                                                         <option value='10'>10 Seconds</option>
//                                                         <option value='20'>20 Seconds</option>
//                                                         <option value='30'>30 Seconds</option>
//                                                         <option value='60'>1 Minutes</option>
//                                                         <option value='120'>2 Minutes</option>
//                                                         <option value='180'>3 Minutes</option>
//                                                         <option value='240'>4 Minutes</option>
//                                                         <option value='300'>5 Minutes</option>
//                                                     </select>
//                                                     <div className="input-group-append">
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-info btn-sm "

//                                                         >
//                                                             Refresh
//                                                         </button>
//                                                     </div>
//                                                 </div>

//                                             </div>
//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-right mr-2">
//                                                 <div className="input-group printable">

//                                                     <div className="input-group-append">
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-info btn-sm py-1 add_more "
//                                                         >
//                                                             Import
//                                                         </button>
//                                                     </div>
//                                                 </div>

//                                             </div>
//                                         </div>
//                                         <div className="card-body">
//                                             <div className="container-fluid">
//                                                 <div className="d-flex flex-wrap">

//                                                     {employeeList.map(employee => <EmployeeMap key={employee.id} employee={employee} />)}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//             </div>

//         ) : (
//             <div>Loading...</div>
//         )
//     );
// };

// export default EmployeeGoogleMap;

// "use client";
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import Link from 'next/link';

// const EmployeeGoogleMap = () => {
//     const [employeeList, setEmployeeList] = useState([]);
//     const { isLoaded } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
//     });

//     const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

//     const fetchEmployeeList = async () => {
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`);
//             if (!res.ok) {
//                 throw new Error('Failed to fetch employee list');
//             }
//             const data = await res.json();
//             setEmployeeList(data);
//         } catch (error) {
//             console.error('Error fetching employee list:', error);
//         }
//     };

//     useEffect(() => {
//         fetchEmployeeList();
//     }, []);

//     const fetchEmployeeGeo = async (employeeId) => {
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/geo_location_all_live/${employeeId}`);
//             const data = await res.json();
//             return data;
//         } catch (error) {
//             return [];
//         }
//     };

//     const EmployeeMap = ({ employeeId }) => {
//         const [map, setMap] = useState(null);
//         const [markers, setMarkers] = useState([]);
//         const [polylines, setPolylines] = useState([]);
//         const [employeeGeo, setEmployeeGeo] = useState([]);

//         useEffect(() => {
//             const getGeoData = async () => {
//                 try {
//                     const geoData = await fetchEmployeeGeo(employeeId);
//                     setEmployeeGeo(geoData);
//                 } catch (error) {
//                     console.error('Error fetching employeeGeo:', error);
//                 }
//             };
//             if (employeeId) {
//                 getGeoData();
//             }
//         }, [employeeId]);

//         useEffect(() => {
//             if (isLoaded && employeeGeo.length > 0) {
//                 const newMarkers = employeeGeo.map((location, index) => (
//                     <Marker
//                         title={`${location.created_date.split('T')[0]} ${location.created_date.split('T')[1].split('.')[0]}`}
//                         key={`${location.latitude}_${location.longitude}`}
//                         position={{ lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }}
//                         label={String.fromCharCode(65 + index)} // Label as A, B, C, etc.
//                     />
//                 ));
//                 setMarkers(newMarkers);

//                 const newPolylines = [];
//                 for (let i = 0; i < employeeGeo.length - 1; i++) {
//                     const directionsService = new window.google.maps.DirectionsService();

//                     directionsService.route(
//                         {
//                             origin: new window.google.maps.LatLng(parseFloat(employeeGeo[i].latitude), parseFloat(employeeGeo[i].longitude)),
//                             destination: new window.google.maps.LatLng(parseFloat(employeeGeo[i + 1].latitude), parseFloat(employeeGeo[i + 1].longitude)),
//                             travelMode: window.google.maps.TravelMode.DRIVING,
//                         },
//                         (result, status) => {
//                             if (status === window.google.maps.DirectionsStatus.OK) {
//                                 newPolylines.push(
//                                     <Polyline
//                                         key={`polyline_${i}`}
//                                         path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//                                         options={{
//                                             strokeColor: "#FF0000", // Red color
//                                             strokeOpacity: 1,
//                                             strokeWeight: 2,
//                                         }}
//                                     />
//                                 );
//                                 setPolylines([...newPolylines]);
//                             } else {
//                                 console.error(`Error fetching directions: ${status}`);
//                             }
//                         }
//                     );
//                 }

//                 if (map && employeeGeo.length > 0 && !isNaN(parseFloat(employeeGeo[0].latitude)) && !isNaN(parseFloat(employeeGeo[0].longitude))) {
//                     map.panTo({ lat: parseFloat(employeeGeo[0].latitude), lng: parseFloat(employeeGeo[0].longitude) });
//                 }
//             }
//         }, [isLoaded, employeeGeo, map]);

//         const onLoad = React.useCallback(function callback(map) {
//             setMap(map);
//         }, []);

//         const onUnmount = React.useCallback(function callback() {
//             setMap(null);
//         }, []);

//         return (
//             <div className='col-md-6'>
//                 <div className='card mb-4'>
//                     <div className="body-content bg-light">
//                         <div className="border-primary shadow-sm border-0">
//                             <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                 <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
//                                     Employee Location
//                                 </h5>
//                             </div>
//                             <div className="card-body">
//                                 {employeeGeo.length > 0 ? (
//                                     <GoogleMap
//                                         mapContainerStyle={{ width: '100%', height: '400px' }}
//                                         center={{ lat: parseFloat(employeeGeo[0].latitude), lng: parseFloat(employeeGeo[0].longitude) }}
//                                         zoom={14}
//                                         onLoad={onLoad}
//                                         onUnmount={onUnmount}
//                                     >
//                                         <>
//                                             {markers}
//                                             {polylines}
//                                         </>
//                                     </GoogleMap>
//                                 ) : (
//                                     'No data'
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         isLoaded ? (
//             <div>
//                 <div className="container-fluid">
//                     <div className="row">
//                         <div className='col-12 p-4'>
//                             <div className='card mb-4'>
//                                 <div className="body-content bg-light">
//                                     <div className="border-primary shadow-sm border-0">
//                                         <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                             <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Live Location</h5>
//                                             <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                                 <Link href={`/Admin/employee/employee_list?page_group=${localStorage.getItem('pageGroup')}`} className="btn btn-sm btn-info">Back To Employee List</Link>
//                                             </div>
//                                         </div>
//                                         <div className="card-body">
//                                             <div className="form-group row">
//                                                 <div className="col-md-10 offset-md-1">
//                                                     <div className="form-group row student">
//                                                         <label className="col-form-label col-md-2"><strong>Employee Name:</strong></label>
//                                                         <div className="col-md-10">
//                                                             <select
//                                                                 className="mb-3 form-control form-control-sm required integer_no_zero"
//                                                                 id="employee_name"
//                                                                 value={selectedEmployeeId}
//                                                                 onChange={(e) => setSelectedEmployeeId(e.target.value)}
//                                                             >
//                                                                 <option value="">Select Employee Name</option>
//                                                                 {employeeList.map(employee => (
//                                                                     <option key={employee.user_id} value={employee.user_id}>{employee.full_name}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="offset-md-2 col-md-10 float-left">
//                                                     <input
//                                                         type="button"
//                                                         name="search"
//                                                         className="btn btn-sm btn-info search_btn mr-2"
//                                                         value="Search"
//                                                         onClick={() => setSelectedEmployeeId(selectedEmployeeId)}
//                                                     />
//                                                 </div>
//                                                 <div className="card-body">
//                                                     <div className="container-fluid">
//                                                         <div className="">
//                                                             {selectedEmployeeId && <EmployeeMap employeeId={selectedEmployeeId} />}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="container-fluid">
//                     <div className="row">
//                         <div className='col-12'>
//                             <div className='card mb-4'>
//                                 <div className="body-content bg-light">
//                                     <div className="border-primary shadow-sm border-0">
//                                         <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
//                                                 <strong>Live Location</strong>
//                                             </div>

//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-right">
//                                                 <div className="input-group printable">
//                                                     <select name="time" className="form-control form-control-sm required integer_no_zero">
//                                                         <option value=''>Select Time</option>
//                                                         <option value='10'>10 Seconds</option>
//                                                         <option value='20'>20 Seconds</option>
//                                                         <option value='30'>30 Seconds</option>
//                                                         <option value='60'>1 Minute</option>
//                                                         <option value='120'>2 Minutes</option>
//                                                         <option value='180'>3 Minutes</option>
//                                                         <option value='240'>4 Minutes</option>
//                                                         <option value='300'>5 Minutes</option>
//                                                     </select>
//                                                     <div className="input-group-append">
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-info btn-sm"
//                                                         >
//                                                             Refresh
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-right mr-2">
//                                                 <div className="input-group printable">
//                                                     <div className="input-group-append">
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-info btn-sm py-1 add_more"
//                                                         >
//                                                             Import
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="card-body">
//                                             <div className="container-fluid">
//                                                 <div className="d-flex flex-wrap">
//                                                     {employeeList.map(employee => (
//                                                         <EmployeeMap key={employee.user_id} employeeId={employee.user_id} />
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         ) : (
//             <div>Loading...</div>
//         )
//     );
// };

// export default EmployeeGoogleMap;


// "use client";
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import Link from 'next/link';

// const EmployeeGoogleMap = () => {
//     const [employeeList, setEmployeeList] = useState([]);
//     const { isLoaded } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: 'AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw'
//     });

//     const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

//     const fetchEmployeeList = async () => {
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`);
//             if (!res.ok) {
//                 throw new Error('Failed to fetch employee list');
//             }
//             const data = await res.json();
//             setEmployeeList(data);
//         } catch (error) {
//             console.error('Error fetching employee list:', error);
//         }
//     };

//     useEffect(() => {
//         fetchEmployeeList();
//     }, []);

//     const fetchEmployeeGeo = async (employeeId) => {
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/geo_location_all_live/${employeeId}`);
//             const data = await res.json();
//             return data;
//         } catch (error) {
//             return [];
//         }
//     };

//     const EmployeeMap = ({ employeeId, isSingleEmployee, employee }) => {
//         const [map, setMap] = useState(null);
//         const [markers, setMarkers] = useState([]);
//         const [polylines, setPolylines] = useState([]);
//         const [employeeGeo, setEmployeeGeo] = useState([]);

//         useEffect(() => {
//             const getGeoData = async () => {
//                 try {
//                     const geoData = await fetchEmployeeGeo(employeeId);
//                     setEmployeeGeo(geoData);
//                 } catch (error) {
//                     console.error('Error fetching employeeGeo:', error);
//                 }
//             };
//             if (employeeId) {
//                 getGeoData();
//             }
//         }, [employeeId]);



//         useEffect(() => {
//             if (isLoaded && employeeGeo.length > 0) {
//                 const newMarkers = employeeGeo.map((location, index) => (
//                     <Marker
//                         key={`${location.latitude}_${location.longitude}`}
//                         position={{ lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }}
//                         label={String.fromCharCode(65 + index)} // Label as A, B, C, etc.
//                         title={`${location.created_date.split('T')[0]} ${location.created_date.split('T')[1].split('.')[0]}`}
//                     />
//                 ));
//                 setMarkers(newMarkers);

//                 const newPolylines = [];
//                 for (let i = 0; i < employeeGeo.length - 1; i++) {
//                     const directionsService = new window.google.maps.DirectionsService();

//                     directionsService.route(
//                         {
//                             origin: new window.google.maps.LatLng(parseFloat(employeeGeo[i].latitude), parseFloat(employeeGeo[i].longitude)),
//                             destination: new window.google.maps.LatLng(parseFloat(employeeGeo[i + 1].latitude), parseFloat(employeeGeo[i + 1].longitude)),
//                             travelMode: window.google.maps.TravelMode.DRIVING,
//                         },
//                         (result, status) => {
//                             if (status === window.google.maps.DirectionsStatus.OK) {
//                                 newPolylines.push(
//                                     <Polyline
//                                         key={`polyline_${i}`}
//                                         path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//                                         options={{
//                                             strokeColor: "#FF0000", // Red color
//                                             strokeOpacity: 1,
//                                             strokeWeight: 2,
//                                         }}
//                                     />
//                                 );
//                                 setPolylines([...newPolylines]);
//                             } else {
//                                 console.error(`Error fetching directions: ${status}`);
//                             }
//                         }
//                     );
//                 }

//                 if (map && employeeGeo.length > 0 && !isNaN(parseFloat(employeeGeo[0].latitude)) && !isNaN(parseFloat(employeeGeo[0].longitude))) {
//                     map.panTo({ lat: parseFloat(employeeGeo[0].latitude), lng: parseFloat(employeeGeo[0].longitude) });
//                 }
//             }
//         }, [isLoaded, employeeGeo, map]);

//         const onLoad = React.useCallback(function callback(map) {
//             setMap(map);
//         }, []);

//         const onUnmount = React.useCallback(function callback() {
//             setMap(null);
//         }, []);

//         console.log(employeeId)

//         return (
//             <div className={`col-md-${isSingleEmployee ? 12 : 6}`}>
//                 <div className='card mb-4'>
//                     <div className="body-content bg-light">
//                         <div className="border-primary shadow-sm border-0">
//                             <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                 <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
//                                     {isSingleEmployee ? "Employee Location" : `${employee?.full_name} Live Locations` }
//                                 </h5>

//                             </div>
//                             {
//                                 isSingleEmployee ? '' :
//                                     <>

//                                         <p>Name: {employee?.full_name}</p>
//                                         <p>Name: {employee?.user_id}</p>
//                                     </>
//                             }
//                             <div className="card-body">
//                                 {employeeGeo.length > 0 ? (
//                                     <GoogleMap
//                                         mapContainerStyle={{ width: '100%', height: isSingleEmployee ? '100vh' : '400px' }}
//                                         center={{ lat: parseFloat(employeeGeo[0].latitude), lng: parseFloat(employeeGeo[0].longitude) }}
//                                         zoom={14}
//                                         onLoad={onLoad}
//                                         onUnmount={onUnmount}
//                                     >
//                                         <>
//                                             {markers}
//                                             {polylines}
//                                         </>
//                                     </GoogleMap>
//                                 ) : (
//                                     'No data'
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         isLoaded ? (
//             <div>
//                 <div className="container-fluid">
//                     <div className="row">
//                         <div className='col-12 p-4'>
//                             <div className='card mb-4'>
//                                 <div className="body-content bg-light">
//                                     <div className="border-primary shadow-sm border-0">
//                                         <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                             <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employe Live Location Search</h5>
//                                             <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                                 <Link href={`/Admin/employee/employee_list?page_group=${localStorage.getItem('pageGroup')}`} className="btn btn-sm btn-info">Back To Employee List</Link>
//                                             </div>
//                                         </div>
//                                         <div className="card-body">
//                                             <div className="form-group row">
//                                                 <div className="col-md-10 offset-md-1">
//                                                     <div className="form-group row student">
//                                                         <label className="col-form-label col-md-2"><strong>Employee Name:</strong></label>
//                                                         <div className="col-md-10">
//                                                             <select
//                                                                 className="mb-3 form-control form-control-sm required integer_no_zero"
//                                                                 id="employee_name"
//                                                                 value={selectedEmployeeId}
//                                                                 onChange={(e) => setSelectedEmployeeId(e.target.value)}
//                                                             >
//                                                                 <option value="">Select Employee Name</option>
//                                                                 {employeeList.map(employee => (
//                                                                     <option key={employee.user_id} value={employee.user_id}>{employee.full_name}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div className="card-body">
//                                                     <div className="container-fluid">
//                                                         <div className="d-flex flex-wrap">
//                                                             {selectedEmployeeId && <EmployeeMap employeeId={selectedEmployeeId} isSingleEmployee={true} />}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="container-fluid">
//                     <div className="row">
//                         <div className='col-12'>
//                             <div className='card mb-4'>
//                                 <div className="body-content bg-light">
//                                     <div className="border-primary shadow-sm border-0">
//                                         <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
//                                                 <strong>Live Location</strong>
//                                             </div>

//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-right">
//                                                 <div className="input-group printable">
//                                                     <select name="time" className="form-control form-control-sm required integer_no_zero">
//                                                         <option value=''>Select Time</option>
//                                                         <option value='10'>10 Seconds</option>
//                                                         <option value='20'>20 Seconds</option>
//                                                         <option value='30'>30 Seconds</option>
//                                                         <option value='60'>1 Minute</option>
//                                                         <option value='120'>2 Minutes</option>
//                                                         <option value='180'>3 Minutes</option>
//                                                         <option value='240'>4 Minutes</option>
//                                                         <option value='300'>5 Minutes</option>
//                                                     </select>
//                                                     <div className="input-group-append">
//                                                         <button type="button" className="btn btn-info btn-sm">
//                                                             Refresh
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-right mr-2">
//                                                 <div className="input-group printable">
//                                                     <div className="input-group-append">
//                                                         <a href='/Admin/geo_location/geo_location_live?page_group=hr_management'>

//                                                         <button type="button" className="btn btn-info btn-sm py-1 add_more">
//                                                             Full Refresh
//                                                         </button>
//                                                         </a>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="card-body">
//                                             <div className="container-fluid">
//                                                 <div className="d-flex flex-wrap">
//                                                     {employeeList.map(employee => (
//                                                         <EmployeeMap key={employee.user_id}
//                                                             employee={employee}
//                                                             employeeId={employee.user_id} isSingleEmployee={false} />
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         ) : (
//             <div>Loading...</div>
//         )
//     );
// };

// export default EmployeeGoogleMap;

// "use client";
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import Link from 'next/link';

// const EmployeeGoogleMap = () => {
//     const [employeeList, setEmployeeList] = useState([]);
//     const { isLoaded } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw"
//     });

//     const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

//     const fetchEmployeeList = async () => {
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`);
//             if (!res.ok) {
//                 throw new Error('Failed to fetch employee list');
//             }
//             const data = await res.json();
//             setEmployeeList(data);
//         } catch (error) {
//             console.error('Error fetching employee list:', error);
//         }
//     };

//     useEffect(() => {
//         fetchEmployeeList();
//     }, []);

//     const fetchEmployeeGeo = async (employeeId) => {
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/geo_location_all_live/${employeeId}`);
//             const data = await res.json();
//             return data;
//         } catch (error) {
//             return [];
//         }
//     };

//     const calculateDistance = (lat1, lon1, lat2, lon2) => {
//         const R = 6371; // Radius of the Earth in kilometers
//         const dLat = (lat2 - lat1) * (Math.PI / 180);
//         const dLon = (lon2 - lon1) * (Math.PI / 180);
//         const a =
//             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         const distance = R * c; // Distance in kilometers
//         return distance;
//     };

//     const getTotalDistance = (locations) => {
//         let totalDistance = 0;
//         for (let i = 0; i < locations.length - 1; i++) {
//             const { latitude: lat1, longitude: lon1 } = locations[i];
//             const { latitude: lat2, longitude: lon2 } = locations[i + 1];
//             const distance = calculateDistance(lat1, lon1, lat2, lon2);
//             totalDistance += distance;
//         }
//         return totalDistance.toFixed(2); // Return total distance rounded to two decimal places
//     };

//     const fetchLocationName = async (latitude, longitude) => {
//         try {
//             const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch location details');
//             }
//             const data = await response.json();
//             if (data.results && data.results.length > 0) {
//                 return data.results[0].formatted_address;
//             } else {
//                 return 'Unknown Location';
//             }
//         } catch (error) {
//             console.error('Error fetching location details:', error);
//             return 'Unknown Location';
//         }
//     };

//     const EmployeeMap = ({ employeeId, isSingleEmployee, employee }) => {
//         const [map, setMap] = useState(null);
//         const [markers, setMarkers] = useState([]);
//         const [polylines, setPolylines] = useState([]);
//         const [employeeGeo, setEmployeeGeo] = useState([]);

//         useEffect(() => {
//             const getGeoData = async () => {
//                 try {
//                     const geoData = await fetchEmployeeGeo(employeeId);
//                     setEmployeeGeo(geoData);
//                 } catch (error) {
//                     console.error('Error fetching employeeGeo:', error);
//                 }
//             };
//             if (employeeId) {
//                 getGeoData();
//             }
//         }, [employeeId]);

//         useEffect(() => {
//             if (isLoaded && employeeGeo.length > 0) {
//                 const newMarkers = employeeGeo.map(async (location, index) => {
//                     const { latitude, longitude, created_date } = location;
//                     const locationName = await fetchLocationName(latitude, longitude);
//                     return (
//                         <Marker
//                             key={`${latitude}_${longitude}`}
//                             position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
//                             label={String.fromCharCode(65 + index)} // Label as A, B, C, etc.
//                             title={`${created_date.split('T')[0]} ${created_date.split('T')[1].split('.')[0]} - ${locationName}`}
//                         />
//                     );
//                 });
//                 setMarkers(newMarkers);

//                 const newPolylines = [];
//                 for (let i = 0; i < employeeGeo.length - 1; i++) {
//                     const directionsService = new window.google.maps.DirectionsService();

//                     directionsService.route(
//                         {
//                             origin: new window.google.maps.LatLng(parseFloat(employeeGeo[i].latitude), parseFloat(employeeGeo[i].longitude)),
//                             destination: new window.google.maps.LatLng(parseFloat(employeeGeo[i + 1].latitude), parseFloat(employeeGeo[i + 1].longitude)),
//                             travelMode: window.google.maps.TravelMode.DRIVING,
//                         },
//                         (result, status) => {
//                             if (status === window.google.maps.DirectionsStatus.OK) {
//                                 newPolylines.push(
//                                     <Polyline
//                                         key={`polyline_${i}`}
//                                         path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//                                         options={{
//                                             strokeColor: "#FF0000", // Red color
//                                             strokeOpacity: 1,
//                                             strokeWeight: 2,
//                                         }}
//                                     />
//                                 );
//                                 setPolylines([...newPolylines]);
//                             } else {
//                                 console.error(`Error fetching directions: ${status}`);
//                             }
//                         }
//                     );
//                 }

//                 if (map && employeeGeo.length > 0 && !isNaN(parseFloat(employeeGeo[0].latitude)) && !isNaN(parseFloat(employeeGeo[0].longitude))) {
//                     map.panTo({ lat: parseFloat(employeeGeo[0].latitude), lng: parseFloat(employeeGeo[0].longitude) });
//                 }
//             }
//         }, [isLoaded, employeeGeo, map]);

//         const onLoad = React.useCallback(function callback(map) {
//             setMap(map);
//         }, []);

//         const onUnmount = React.useCallback(function callback() {
//             setMap(null);
//         }, []);

//         return (
//             <div className={`col-md-${isSingleEmployee ? 12 : 6}`}>
//                 <div className='card mb-4'>
//                     <div className="body-content bg-light">
//                         <div className="border-primary shadow-sm border-0">
//                             <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                 <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
//                                     {isSingleEmployee ? "Employee Location" : `${employee?.full_name} Live Locations` }
//                                 </h5>
//                             </div>
//                             {
//                                 isSingleEmployee ? '' :
//                                     <>
//                                         <p>Name: {employee?.full_name}</p>
//                                         <p>User ID: {employee?.user_id}</p>
//                                     </>
//                             }
//                             <div className="card-body">
//                                 {employeeGeo.length > 0 ? (
//                                     <GoogleMap
//                                         mapContainerStyle={{ width: '100%', height: isSingleEmployee ? '100vh' : '400px' }}
//                                         center={{ lat: parseFloat(employeeGeo[0].latitude), lng: parseFloat(employeeGeo[0].longitude) }}
//                                         zoom={14}
//                                         onLoad={onLoad}
//                                         onUnmount={onUnmount}
//                                     >
//                                         <>
//                                             {markers}
//                                             {polylines}
//                                         </>
//                                     </GoogleMap>
//                                 ) : (
//                                     'No data'
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         isLoaded ? (
//             <div>
//                 <div className="container-fluid">
//                     <div className="row">
//                         <div className='col-12 p-4'>
//                             <div className='card mb-4'>
//                                 <div className="body-content bg-light">
//                                     <div className="border-primary shadow-sm border-0">
//                                         <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                             <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employee Live Location Search</h5>
//                                             <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                                 <Link href={`/Admin/employee/employee_list?page_group=${localStorage.getItem('pageGroup')}`} className="btn btn-sm btn-info">Back To Employee List</Link>
//                                             </div>
//                                         </div>
//                                         <div className="card-body">
//                                             <div className="form-group row">
//                                                 <div className="col-md-10 offset-md-1">
//                                                     <div className="form-group row student">
//                                                         <label className="col-form-label col-md-2"><strong>Employee Name:</strong></label>
//                                                         <div className="col-md-10">
//                                                             <select
//                                                                 className="mb-3 form-control form-control-sm required integer_no_zero"
//                                                                 id="employee_name"
//                                                                 value={selectedEmployeeId}
//                                                                 onChange={(e) => setSelectedEmployeeId(e.target.value)}
//                                                             >
//                                                                 <option value="">Select Employee Name</option>
//                                                                 {employeeList.map(employee => (
//                                                                     <option key={employee.user_id} value={employee.user_id}>{employee.full_name}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="card-body">
//                                                 <div className="container-fluid">
//                                                     <div className="d-flex flex-wrap">
//                                                         {selectedEmployeeId && <EmployeeMap employeeId={selectedEmployeeId} isSingleEmployee={true} />}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="container-fluid">
//                     <div className="row">
//                         <div className='col-12'>
//                             <div className='card mb-4'>
//                                 <div className="body-content bg-light">
//                                     <div className="border-primary shadow-sm border-0">
//                                         <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
//                                                 <strong>Live Location</strong>
//                                             </div>
//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-right">
//                                                 <div className="input-group printable">
//                                                     <select name="time" className="form-control form-control-sm required integer_no_zero">
//                                                         <option value=''>Select Time</option>
//                                                         <option value='10'>10 Seconds</option>
//                                                         <option value='20'>20 Seconds</option>
//                                                         <option value='30'>30 Seconds</option>
//                                                         <option value='60'>1 Minute</option>
//                                                         <option value='120'>2 Minutes</option>
//                                                         <option value='180'>3 Minutes</option>
//                                                         <option value='240'>4 Minutes</option>
//                                                         <option value='300'>5 Minutes</option>
//                                                     </select>
//                                                     <div className="input-group-append">
//                                                         <button type="button" className="btn btn-info btn-sm">
//                                                             Refresh
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-right mr-2">
//                                                 <div className="input-group printable">
//                                                     <div className="input-group-append">
//                                                         <a href='/Admin/geo_location/geo_location_live?page_group=hr_management'>
//                                                             <button type="button" className="btn btn-info btn-sm py-1 add_more">
//                                                                 Full Refresh
//                                                             </button>
//                                                         </a>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="card-body">
//                                             <div className="container-fluid">
//                                                 <div className="d-flex flex-wrap">
//                                                     {employeeList.map(employee => (
//                                                         <EmployeeMap key={employee.user_id}
//                                                             employee={employee}
//                                                             employeeId={employee.user_id} isSingleEmployee={false} />
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         ) : (
//             <div>Loading...</div>
//         )
//     );
// };

// export default EmployeeGoogleMap;


// "use client";
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import Link from 'next/link';

// const EmployeeGoogleMap = () => {
//     const [employeeList, setEmployeeList] = useState([]);
//     const { isLoaded } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: 'AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw'
//     });

//     const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

//     const fetchEmployeeList = async () => {
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`);
//             if (!res.ok) {
//                 throw new Error('Failed to fetch employee list');
//             }
//             const data = await res.json();
//             setEmployeeList(data);
//         } catch (error) {
//             console.error('Error fetching employee list:', error);
//         }
//     };

//     useEffect(() => {
//         fetchEmployeeList();
//     }, []);

//     const fetchEmployeeGeo = async (employeeId) => {
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/geo_location_all_live/${employeeId}`);
//             const data = await res.json();
//             return data;
//         } catch (error) {
//             return [];
//         }
//     };

//     const calculateDistance = (lat1, lon1, lat2, lon2) => {
//         const R = 6371; // Radius of the Earth in kilometers
//         const dLat = (lat2 - lat1) * (Math.PI / 180);
//         const dLon = (lon2 - lon1) * (Math.PI / 180);
//         const a =
//             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         const distance = R * c; // Distance in kilometers
//         return distance;
//     };

//     const getTotalDistance = (locations) => {
//         let totalDistance = 0;
//         for (let i = 0; i < locations.length - 1; i++) {
//             const { latitude: lat1, longitude: lon1 } = locations[i];
//             const { latitude: lat2, longitude: lon2 } = locations[i + 1];
//             const distance = calculateDistance(lat1, lon1, lat2, lon2);
//             totalDistance += distance;
//         }
//         return totalDistance.toFixed(2); // Return total distance rounded to two decimal places
//     };

//     const fetchLocationName = async (latitude, longitude) => {
//         try {
//             const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch location details');
//             }
//             const data = await response.json();
//             // if (data.results && data.results.length > 0) {
//             //     return data.results[0].formatted_address;
//             // } else {
//             //     return 'Unknown Location';
//             // }

//             if (data.results && data.results.length >= 5) {
//                 return data.results[5].formatted_address;
//             } else if (data.results && data.results.length > 0) {
//                 return data.results[0].formatted_address; // Fallback to the first result if there are fewer than 5 results
//             } else {
//                 return 'Unknown Location';
//             }
//         } catch (error) {
//             console.error('Error fetching location details:', error);
//             return 'Unknown Location';
//         }
//     };

//     const EmployeeMap = ({ employeeId, isSingleEmployee, employee }) => {
//         const [map, setMap] = useState(null);
//         const [markers, setMarkers] = useState([]);
//         const [polylines, setPolylines] = useState([]);
//         const [employeeGeo, setEmployeeGeo] = useState([]);
//         const [totalDistance, setTotalDistance] = useState(0);

//         useEffect(() => {
//             const getGeoData = async () => {
//                 try {
//                     const geoData = await fetchEmployeeGeo(employeeId);
//                     setEmployeeGeo(geoData);
//                     if (geoData.length > 0) {
//                         const distance = getTotalDistance(geoData);
//                         setTotalDistance(distance);
//                     }
//                 } catch (error) {
//                     console.error('Error fetching employeeGeo:', error);
//                 }
//             };
//             if (employeeId) {
//                 getGeoData();
//             }
//         }, [employeeId]);
//         useEffect(() => {
//             if (isLoaded && employeeGeo.length > 0) {
//                 const newMarkers = employeeGeo.map(async (location, index) => {
//                     const { latitude, longitude, created_date } = location;
//                     const locationName = await fetchLocationName(latitude, longitude);
//                     const markerColor = index === employeeGeo.length - 1 ? 'blue' : 'red'; // Change color for last marker to blue
//                     return (
//                         <Marker
//                             key={`${latitude}_${longitude}`}
//                             position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
//                             // label={String.fromCharCode(65 + index)} // Label as A, B, C, etc.
//                             title={`${created_date.split('T')[0]} ${created_date.split('T')[1].split('.')[0]} - ${locationName}`}
//                             options={{
//                                 icon: {
//                                     url: `http://maps.google.com/mapfiles/ms/icons/${markerColor}-dot.png` // Customize marker icon URL
//                                 }
//                             }}
//                         />
//                     );
//                 });
//                 setMarkers(newMarkers);

//                 const newPolylines = [];
//                 for (let i = 0; i < employeeGeo.length - 1; i++) {
//                     const directionsService = new window.google.maps.DirectionsService();

//                     directionsService.route(
//                         {
//                             origin: new window.google.maps.LatLng(parseFloat(employeeGeo[i].latitude), parseFloat(employeeGeo[i].longitude)),
//                             destination: new window.google.maps.LatLng(parseFloat(employeeGeo[i + 1].latitude), parseFloat(employeeGeo[i + 1].longitude)),
//                             travelMode: window.google.maps.TravelMode.DRIVING,
//                         },
//                         (result, status) => {
//                             if (status === window.google.maps.DirectionsStatus.OK) {
//                                 newPolylines.push(
//                                     <Polyline
//                                         key={`polyline_${i}`}
//                                         path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//                                         options={{
//                                             strokeColor: "#FF0000", // Red color
//                                             strokeOpacity: 1,
//                                             strokeWeight: 2,
//                                         }}
//                                     />
//                                 );
//                                 setPolylines([...newPolylines]);
//                             } else {
//                                 console.error(`Error fetching directions: ${status}`);
//                             }
//                         }
//                     );
//                 }

//                 if (map && employeeGeo.length > 0 && !isNaN(parseFloat(employeeGeo[0].latitude)) && !isNaN(parseFloat(employeeGeo[0].longitude))) {
//                     map.panTo({ lat: parseFloat(employeeGeo[0].latitude), lng: parseFloat(employeeGeo[0].longitude) });
//                 }
//             }
//         }, [isLoaded, employeeGeo, map]);
//         // useEffect(() => {
//         //     if (isLoaded && employeeGeo.length > 0) {
//         //         const newMarkers = employeeGeo.map(async (location, index) => {
//         //             const { latitude, longitude, created_date } = location;
//         //             const locationName = await fetchLocationName(latitude, longitude);
//         //             return (
//         //                 <Marker
//         //                     key={`${latitude}_${longitude}`}
//         //                     position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
//         //                     label={String.fromCharCode(65 + index)} // Label as A, B, C, etc.
//         //                     title={`${created_date.split('T')[0]} ${created_date.split('T')[1].split('.')[0]} - ${locationName}`}
//         //                 />
//         //             );
//         //         });
//         //         setMarkers(newMarkers);

//         //         const newPolylines = [];
//         //         for (let i = 0; i < employeeGeo.length - 1; i++) {
//         //             const directionsService = new window.google.maps.DirectionsService();

//         //             directionsService.route(
//         //                 {
//         //                     origin: new window.google.maps.LatLng(parseFloat(employeeGeo[i].latitude), parseFloat(employeeGeo[i].longitude)),
//         //                     destination: new window.google.maps.LatLng(parseFloat(employeeGeo[i + 1].latitude), parseFloat(employeeGeo[i + 1].longitude)),
//         //                     travelMode: window.google.maps.TravelMode.DRIVING,
//         //                 },
//         //                 (result, status) => {
//         //                     if (status === window.google.maps.DirectionsStatus.OK) {
//         //                         newPolylines.push(
//         //                             <Polyline
//         //                                 key={`polyline_${i}`}
//         //                                 path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//         //                                 options={{
//         //                                     strokeColor: "#FF0000", // Red color
//         //                                     strokeOpacity: 1,
//         //                                     strokeWeight: 2,
//         //                                 }}
//         //                             />
//         //                         );
//         //                         setPolylines([...newPolylines]);
//         //                     } else {
//         //                         console.error(`Error fetching directions: ${status}`);
//         //                     }
//         //                 }
//         //             );
//         //         }

//         //         if (map && employeeGeo.length > 0 && !isNaN(parseFloat(employeeGeo[0].latitude)) && !isNaN(parseFloat(employeeGeo[0].longitude))) {
//         //             map.panTo({ lat: parseFloat(employeeGeo[0].latitude), lng: parseFloat(employeeGeo[0].longitude) });
//         //         }
//         //     }
//         // }, [isLoaded, employeeGeo, map]);

//         const onLoad = React.useCallback(function callback(map) {
//             setMap(map);
//         }, []);

//         const onUnmount = React.useCallback(function callback() {
//             setMap(null);
//         }, []);

//         return (
//             <div className={`col-md-${isSingleEmployee ? 12 : 6}`}>
//                 <div className='card mb-4'>
//                     <div className="body-content bg-light">
//                         <div className="border-primary shadow-sm border-0">
//                             <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                 <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
//                                     {isSingleEmployee ? "Employee Location" : `${employee?.full_name} Live Locations`}
//                                 </h5>
//                             </div>
//                             {
//                                 isSingleEmployee ? '' :
//                                     <>
//                                         <p>Name: {employee?.full_name}</p>
//                                         <p>User ID: {employee?.user_id}</p>
//                                         <p>Total Distance: {totalDistance} km</p>
//                                     </>
//                             }
//                             <div className="card-body">
//                                 {employeeGeo.length > 0 ? (
//                                     <GoogleMap
//                                         mapContainerStyle={{ width: '100%', height: isSingleEmployee ? '100vh' : '400px' }}
//                                         center={{ lat: parseFloat(employeeGeo[0].latitude), lng: parseFloat(employeeGeo[0].longitude) }}
//                                         zoom={14}
//                                         onLoad={onLoad}
//                                         onUnmount={onUnmount}
//                                     >
//                                         <>
//                                             {markers}
//                                             {polylines}
//                                         </>
//                                     </GoogleMap>
//                                 ) : (
//                                     'No data'
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         isLoaded ? (
//             <div>
//                 <div className="container-fluid">
//                     <div className="row">
//                         <div className='col-12 p-4'>
//                             <div className='card mb-4'>
//                                 <div className="body-content bg-light">
//                                     <div className="border-primary shadow-sm border-0">
//                                         <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                             <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Employee Live Location Search</h5>
//                                             <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                                 <Link href={`/Admin/employee/employee_list?page_group=${localStorage.getItem('pageGroup')}`} className="btn btn-sm btn-info">Back To Employee List</Link>
//                                             </div>
//                                         </div>
//                                         <div className="card-body">
//                                             <div className="form-group row">
//                                                 <div className="col-md-10 offset-md-1">
//                                                     <div className="form-group row student">
//                                                         <label className="col-form-label col-md-2"><strong>Employee Name:</strong></label>
//                                                         <div className="col-md-10">
//                                                             <select
//                                                                 className="mb-3 form-control form-control-sm required integer_no_zero"
//                                                                 id="employee_name"
//                                                                 value={selectedEmployeeId}
//                                                                 onChange={(e) => setSelectedEmployeeId(e.target.value)}
//                                                             >
//                                                                 <option value="">Select Employee Name</option>
//                                                                 {employeeList.map(employee => (
//                                                                     <option key={employee.user_id} value={employee.user_id}>{employee.full_name}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="card-body">
//                                                 <div className="container-fluid">
//                                                     <div className="d-flex flex-wrap">
//                                                         {selectedEmployeeId && <EmployeeMap employeeId={selectedEmployeeId} isSingleEmployee={true} />}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="container-fluid">
//                     <div className="row">
//                         <div className='col-12'>
//                             <div className='card mb-4'>
//                                 <div className="body-content bg-light">
//                                     <div className="border-primary shadow-sm border-0">
//                                         <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
//                                                 <strong>Live Location</strong>
//                                             </div>
//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-right">
//                                                 <div className="input-group printable">
//                                                     <select name="time" className="form-control form-control-sm required integer_no_zero">
//                                                         <option value=''>Select Time</option>
//                                                         <option value='10'>10 Seconds</option>
//                                                         <option value='20'>20 Seconds</option>
//                                                         <option value='30'>30 Seconds</option>
//                                                         <option value='60'>1 Minute</option>
//                                                         <option value='120'>2 Minutes</option>
//                                                         <option value='180'>3 Minutes</option>
//                                                         <option value='240'>4 Minutes</option>
//                                                         <option value='300'>5 Minutes</option>
//                                                     </select>
//                                                     <div className="input-group-append">
//                                                         <button type="button" className="btn btn-info btn-sm">
//                                                             Refresh
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="card-title card-header-color font-weight-bold mb-0 float-right mr-2">
//                                                 <div className="input-group printable">
//                                                     <div className="input-group-append">
//                                                         <a href='/Admin/geo_location/geo_location_live?page_group=hr_management'>
//                                                             <button type="button" className="btn btn-info btn-sm py-1 add_more">
//                                                                 Full Refresh
//                                                             </button>
//                                                         </a>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="card-body">
//                                             <div className="container-fluid">
//                                                 <div className="d-flex flex-wrap">
//                                                     {employeeList.map(employee => (
//                                                         <EmployeeMap key={employee.user_id}
//                                                             employee={employee}
//                                                             employeeId={employee.user_id} isSingleEmployee={false} />
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         ) : (
//             <div>Loading...</div>
//         )
//     );
// };

// export default EmployeeGoogleMap;

"use client";
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

const EmployeeGoogleMap = () => {





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

    const { data: usersFireBaseToken = [],
    } = useQuery({
        queryKey: ['usersFireBaseToken'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list_role_wise`)

            const data = await res.json()
            return data
        }
    })

    console.log(usersFireBaseToken)

   
    console.log(token.accessToken)
    const handleClick = () => {
        const url = 'https://fcm.googleapis.com/v1/projects/hrapp-ef0a5/messages:send';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.accessToken}` // Replace with your access token
        };

        // Loop through the usersFireBaseToken array
        usersFireBaseToken?.forEach(user => {
            // Ensure the token exists before sending the request
            if (user.token) {
                const body = JSON.stringify({
                    "message": {
                        "token": user.token,  // User's token
                        "notification": {
                            "title": "Location Tracking",
                            "body": "Your location is being tracked by HR App right now."
                        },
                        "data": {
                            "category": "location"
                        }
                    }
                });

                // Send the request to FCM for each user
                fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: body
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(`Notification sent to user ID ${user.id}:`, data);
                    })
                    .catch((error) => {
                        console.error(`Error sending notification to user ID ${user.id}:`, error);
                    });
            } else {
                console.warn(`No token found for user ID ${user.id}`);
            }
        });
    }


     // console.log(token)
    // const handleClick = () => {
    //     const url = 'https://fcm.googleapis.com/v1/projects/hrapp-ef0a5/messages:send';
    //     const headers = {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${token.accessToken}`
    //     };

    //     const body = JSON.stringify({
    //         "message": {
    //             "token": "fy26m3i5SvO_s_WV2HtNrV:APA91bEQlPt1Q8303eaCfX4czMykDCbbE17XzBoWWko7rd2ui3-s9T9jo62k_pYqeKWtwH7Z7cnUn6ZQ9eJz7353bndm8l7dntpd7ACq9Nq6Q0ta61UBG2eVAi0SNQo87p5r31U0Cwzx",
    //             "notification": {
    //                 "title": "location",
    //                 "body": "your location is tracking by hrapp right now...."
    //             },
    //             "data": {
    //                 "category": "location"
    //             }
    //         }
    //     });

    //     fetch(url, {
    //         method: 'POST',
    //         headers: headers,
    //         body: body
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log('Success:', data);
    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);
    //         });
    // }

    const [employeeList, setEmployeeList] = useState([]);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw'
    });

    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
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
                            <div className='m-2'>

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
                            </div>
                        </div>
                        <div style={{ height: '400px', width: '100%' }}>
                            {isLoaded && employeeGeo.length > 0 ? (
                                // {isLoaded && (
                                <GoogleMap
                                    mapContainerStyle={{ height: '100%', width: '100%' }}
                                    zoom={12}
                                    onLoad={onLoad}
                                    onUnmount={onUnmount}
                                >
                                    {markers}
                                    {polylines}
                                </GoogleMap>
                                // )}
                            ) : (
                                'No data'
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



    // Generate options
    const options = [];

    // Add specific seconds options
    const secondsOptions = [20000, 30000]; // 20 seconds and 30 seconds
    for (let i = 0; i < secondsOptions.length; i++) {
        const time = secondsOptions[i];
        const seconds = time / 1000;
        options.push(
            <option key={time} value={time}>
                {seconds} Second{seconds > 1 ? 's' : ''}
            </option>
        );
    }

    // Add minute options from 1 to 30 minutes
    for (let minutes = 1; minutes <= 30; minutes++) {
        const time = minutes * 60000; // Convert minutes to milliseconds
        options.push(
            <option key={time} value={time}>
                {minutes} Minute{minutes > 1 ? 's' : ''}
            </option>
        );
    }

    const { data: module_settings = [] } = useQuery({
        queryKey: ['module_settings'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`);
            const data = await res.json();
            return data;
        },
    });

    const Category = module_settings.find(moduleI => moduleI.table_name === 'time_table') || {};
    const defaultInterval = parseFloat(Category.column_name) || null;

    useEffect(() => {
        setRefreshInterval(defaultInterval);
    }, [defaultInterval]);


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
                                                        <select
                                                            className="mb-3 form-control form-control-sm required integer_no_zero"
                                                            id="employee_name"
                                                            value={selectedEmployeeId}
                                                            onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                                        >
                                                            <option value="">Select Employee Name</option>
                                                            {employeeList.map(employee => (
                                                                <option key={employee.user_id} value={employee.user_id}>{employee.full_name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="container-fluid">
                                                <div className="d-flex flex-wrap">
                                                    {selectedEmployeeId && <EmployeeMap employeeId={selectedEmployeeId} isSingleEmployee={true} />}
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
                                                    value={refreshInterval || '300000'}
                                                    onChange={(e) => setRefreshInterval(parseInt(e.target.value) || null)}
                                                    name="time" className="form-control form-control-sm required integer_no_zero">
                                                    <option value=''>Select Time</option>
                                                    {options}
                                                </select>
                                                <div className="input-group-append">
                                                    <button
                                                        onClick={handleClick}
                                                        type="button" className="btn btn-info btn-sm">
                                                        Refresh
                                                    </button>
                                                </div>


                                                {/* <input
                                                    type="number"
                                                    id="refreshInterval"
                                                    value={refreshInterval || ''}
                                                    onChange={(e) => setRefreshInterval(parseInt(e.target.value) || null)}
                                                   className="form-control form-control-sm required integer_no_zero"
                                                    placeholder='Enter refresh interval'
                                                />
                                                <div className="input-group-append">
                                                    <button type="button" className="btn btn-info btn-sm">
                                                        Refresh
                                                    </button>
                                                </div> */}
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
                                                {employeeList.map(employee => (
                                                    <EmployeeMap key={employee.user_id}
                                                        employee={employee}
                                                        employeeId={employee.user_id} isSingleEmployee={false} />
                                                ))}
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
        // <>
        //     <section className="login-content">
        //         <div className="container h-100">
        //             <div className="row align-items-center justify-content-center h-100">
        //                 <div className="col-md-12">
        //                     <div className="card">
        //                         <div className="card-body">
        //                             <div className="row">
        //                                 <div className='col-md-12'>
        //                                     <div className="d-flex align-items-center justify-content-between mt-4 mb-2">
        //                                         <h4 className="mb-0">Employee Locations</h4>
        //                                         <Link href="/dashboard" className="btn btn-secondary btn-sm">
        //                                             <i className="fa fa-arrow-left mr-2" aria-hidden="true"></i>Back
        //                                         </Link>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                             <div className='row'>
        //                                 <div className='col-md-12'>
        //                                     <label htmlFor="refreshInterval">Refresh Interval (in milliseconds): </label>
        //                                     <input
        //                                         type="number"
        //                                         id="refreshInterval"
        //                                         value={refreshInterval || ''}
        //                                         onChange={(e) => setRefreshInterval(parseInt(e.target.value) || null)}
        //                                         className='form-control mb-4'
        //                                         placeholder='Enter refresh interval'
        //                                     />
        //                                 </div>
        //                                 <div className='col-md-6'>
        //                                     <label htmlFor="employeeSelect">Select Employee: </label>
        //                                     <select
        //                                         id="employeeSelect"
        //                                         value={selectedEmployeeId}
        //                                         onChange={(e) => setSelectedEmployeeId(e.target.value)}
        //                                         className='form-control mb-4'
        //                                     >
        //                                         <option value="">Select Employee</option>
        //                                         {employeeList.map((employee) => (
        //                                             <option key={employee.user_id} value={employee.user_id}>
        //                                                 {employee.full_name}
        //                                             </option>
        //                                         ))}
        //                                     </select>
        //                                 </div>
        //                                 {selectedEmployeeId && (
        //                                     <EmployeeMap employeeId={selectedEmployeeId} isSingleEmployee={true} />
        //                                 )}
        //                             </div>
        //                             <div className="row">
        //                                 {employeeList.map((employee) => (
        //                                     <EmployeeMap
        //                                         key={employee.user_id}
        //                                         employeeId={employee.user_id}
        //                                         isSingleEmployee={false}
        //                                         employee={employee}
        //                                     />
        //                                 ))}
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </section>
        // </>
    );
};

export default EmployeeGoogleMap;

