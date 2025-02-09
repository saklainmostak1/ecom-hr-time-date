
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
//         googleMapsApiKey: "AIzaSyBl2KMc9LbMRujisdxzC4mgcRR10P7mvHw"
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

//     const handleEmployeeChange = (event) => {
//         setSelectedEmployeeId(event.target.value);
//     };

//     useEffect(() => {
//         if (fromDate && toDate) {
//             fetchSearchResults();
//         }
//     }, [fromDate, toDate]);

//     const fetchSearchResults = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_geo/search`, {
//                 params: {
//                     from_date: fromDate.toISOString(),
//                     to_date: toDate.toISOString(),
//                 }
//             });
//             setSearchResults(res.data);
//             setLoading(false);
//         } catch (error) {
//             setError(error.message);
//             setLoading(false);
//         }
//     };

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     // Initialize fromDate and toDate when component mounts
//     useEffect(() => {
//         const currentDate = new Date();
//         // const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//         setFromDate(currentDate);
//         setToDate(currentDate);
//         setShowFromDate(formatDate(currentDate));
//         setShowToDate(formatDate(currentDate));
//     }, []);
//     // useEffect(() => {
//     //     const currentDate = new Date();
//     //     const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//     //     setFromDate(firstDayOfMonth);
//     //     setToDate(currentDate);
//     //     setShowFromDate(formatDate(firstDayOfMonth));
//     //     setShowToDate(formatDate(currentDate));
//     // }, []);

//     const handleDateChangess = (event) => {
//         const selectedDate = new Date(event.target.value);
//         const formattedDate = formatDate(selectedDate);
//         setShowFromDate(formattedDate);
//         setFromDate(selectedDate);
//     };

//     const handleDateChangesss = (event) => {
//         const selectedDate = new Date(event.target.value);
//         const formattedDate = formatDate(selectedDate);
//         setShowToDate(formattedDate);
//         setToDate(selectedDate);
//     };

//     // Function to format date as "dd-mm-yyyy"
//     const formatDate = (date) => {
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = String(date.getFullYear());
//         return `${day}-${month}-${year}`;
//     };

//     // Open date picker when text input is clicked
//     const handleTextInputClick = () => {
//         document.getElementById('dateInput').showPicker();
//     };

//     // Open date picker when text input is clicked
//     const handleTextInputClicks = () => {
//         document.getElementById('dateInputTo').showPicker();
//     };

//     const uniqueDates = [...new Set(searchResults.map(geo => geo.created_date.split('T')[0]))];
//     const buttonStyles = {
//         color: '#fff',
//         backgroundColor: '#510bc4',
//         backgroundImage: 'none',
//         borderColor: '#4c0ab8',
//     };

//     const page_group = localStorage.getItem('pageGroup')

//     const period_search = () => {
//         setLoading(true);
//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/location_search`, {
//             selectedEmployeeId,
//             fromDate,
//             toDate
//         })
//             .then(response => {
//                 setSearchResults(response.data.results);
//                 setError(null);
//                 setLoading(false);
//                 if (response.data.results == '') {
//                     alert('Nothing found!');
//                 }
//             })
//             .catch(error => {
//                 setError("An error occurred during search.", error);
//                 setSearchResults([]);
//                 setLoading(false);
//             });
//     };

//     console.log(searchResults)

//     const [errorr, setErrorr] = useState([])

//     const employee_PDF_download = async () => {
//         setLoading(true);
//         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/location_search`, {
//             selectedEmployeeId,
//             fromDate,
//             toDate
//         });

//         const searchResults = response.data.results;

//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/location_pdf`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     searchResults
//                     // Other parameters if needed
//                 }),

//                 // If you need to send any data with the request, you can include it here
//                 // body: JSON.stringify({ /* your data */ }),
//             });

//             if (!response.ok) {
//                 throw new Error('Error generating PDF In Period');
//             }


//             // If you want to download the PDF automatically
//             const blob = await response.blob();
//             const url = window.URL.createObjectURL(new Blob([blob]));
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = 'period_pdf.pdf';
//             document.body.appendChild(a);
//             a.click();
//             a.remove();
//         } catch (error) {
//             setErrorr(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };


//     const employee_print = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/location_search`, {
//                 selectedEmployeeId,
//                 fromDate,
//                 toDate
//             });

//             const searchResults = response.data.results;

//             // Create a new window for printing
//             const editWindow = window.open('', '_blank');
//             editWindow.document.write('<html><head><title>Employee Location History</title><style> @page { size: landscape; } @media print { @page { size: landscape; } } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; } thead { background-color: #f2f2f2; } body { text-align: center; } </style></head><body>');
//             editWindow.document.write('<h2 style="margin: 0; padding: 0;">Employee Location History</h2>');

//             // Render the filtered data in a table for editing
//             editWindow.document.write('<table>');

//             // Table header
//             editWindow.document.write('<thead>');
//             editWindow.document.write('<tr>');
//             editWindow.document.write('<th>ID</th>');
//             editWindow.document.write('<th>User ID</th>');
//             editWindow.document.write('<th>Latitude</th>');
//             editWindow.document.write('<th>Longitude</th>');
//             editWindow.document.write('<th>Name</th>');
//             editWindow.document.write('<th>Mobile</th>');
//             editWindow.document.write('<th>Designation</th>');
//             editWindow.document.write('<th>Branch</th>');
//             editWindow.document.write('<th>Created Date</th>');
//             editWindow.document.write('</tr>');
//             editWindow.document.write('</thead>');

//             // Table body
//             editWindow.document.write('<tbody>');
//             // Render rows of data
//             searchResults.forEach((item, i) => {
//                 editWindow.document.write('<tr>');
//                 editWindow.document.write(`<td>${i + 1}</td>`);
//                 editWindow.document.write(`<td>${item.user_id}</td>`);
//                 editWindow.document.write(`<td>${item.latitude}</td>`);
//                 editWindow.document.write(`<td>${item.longitude}</td>`);
//                 editWindow.document.write(`<td>${item.full_name}</td>`);
//                 editWindow.document.write(`<td>${item.mobile}</td>`);
//                 editWindow.document.write(`<td>${item.designation_id}</td>`);
//                 editWindow.document.write(`<td>${item.branch_id}</td>`);
//                 editWindow.document.write(`<td>${new Date(item.created_date).toLocaleString()}</td>`); // Format date as needed
//                 editWindow.document.write('</tr>');
//             });
//             editWindow.document.write('</tbody>');

//             editWindow.document.write('</table>');
//             editWindow.document.write('</body></html>');
//             editWindow.document.close();

//             // Print function for the new window
//             const printWindow = () => {
//                 editWindow.focus();
//                 editWindow.print();
//                 editWindow.close();
//             };

//             // Automatically trigger print after a short delay to ensure content is fully loaded
//             setTimeout(() => {
//                 printWindow();
//             }, 1000); // Adjust delay if necessary

//         } catch (error) {
//             console.error('Error:', error);
//             // Handle error appropriately
//         } finally {
//             setLoading(false);
//         }
//     };



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
//                                             <form>
//                                                 <div class="col-md-10 offset-md-1">
//                                                     {/* <div class="form-group row student">
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
//                                                 </div> */}

//                                                     <div class="form-group row student">
//                                                         <label htmlFor="fromDate" class="col-form-label col-md-2"><strong>Start Date:</strong></label>
//                                                         <div className="col-md-4">
//                                                             <input
//                                                                 type="text"
//                                                                 readOnly
//                                                                 value={showFromDate}
//                                                                 onClick={handleTextInputClick}
//                                                                 placeholder="dd-mm-yy"
//                                                                 className="form-control"
//                                                                 style={{ display: 'inline-block' }}
//                                                             />
//                                                             <input
//                                                                 type="date"
//                                                                 id="dateInput"
//                                                                 onChange={handleDateChangess}
//                                                                 style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
//                                                             />
//                                                         </div>

//                                                         <label htmlFor="toDate" class="col-form-label col-md-2"><strong>End Date:</strong></label>
//                                                         <div class="col-md-4">
//                                                             <input
//                                                                 type="text"
//                                                                 readOnly
//                                                                 value={showToDate}
//                                                                 onClick={handleTextInputClicks}
//                                                                 placeholder="dd-mm-yy"
//                                                                 className="form-control"
//                                                                 style={{ display: 'inline-block' }}
//                                                             />
//                                                             <input
//                                                                 type="date"
//                                                                 id="dateInputTo"
//                                                                 onChange={handleDateChangesss}
//                                                                 style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
//                                                             />
//                                                         </div>
//                                                     </div>

//                                                     <div class="form-group row">
//                                                         <div class="offset-md-2 col-md-10 float-left">
//                                                             <input
//                                                                 type="button"
//                                                                 name="search"
//                                                                 class="btn btn-sm btn-info search_btn mr-2"
//                                                                 value="Search"
//                                                                 onClick={period_search}
//                                                             />
//                                                             <input
//                                                                 type="button"
//                                                                 name="search"
//                                                                 class="btn btn-sm btn-success print_btn mr-2"
//                                                                 value="Print"
//                                                                 onClick={employee_print}
//                                                             />
//                                                             <input
//                                                                 onClick={employee_PDF_download}
//                                                                 type="button"
//                                                                 style={buttonStyles}
//                                                                 name="search"
//                                                                 className="btn btn-sm btn-secondary excel_btn mr-2"
//                                                                 value="Download PDF"
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </form>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className='d-flex'>
//                     <ul class="list-group d-flex flex-column col-md-3 mt-2 ml-4">
//                         {uniqueDates.map((date, index) => (


//                             <li className="btn btn-sm btn-info my-1"
//                                 key={index}
//                                 onClick={() => handleDateButtonClick(date)} class="list-group-item"> {date}</li>
//                         ))}


//                     </ul>
//                     {/* <div className='d-flex flex-column col-md-3 mt-2'>
//                         {uniqueDates.map((date, index) => (
//                             <button
//                                 className="btn btn-sm btn-info my-1"
//                                 key={index}
//                                 onClick={() => handleDateButtonClick(date)}
//                             >
//                                 {date}
//                             </button>
//                         ))}
//                     </div> */}

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


'use client' 
 //ismile
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import axios from 'axios';

const EmployeeGoogleMap = ({ id }) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(id);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [polylines, setPolylines] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0);
    const [uniqueDates, setUniqueDates] = useState([]);
    const [geoLatLong, setGeoLatLong] = useState([]);

    const { data: employeeGeo = [] } = useQuery({
        queryKey: ['employeeGeo', selectedEmployeeId],
        queryFn: async () => {
            try {
                if (!selectedEmployeeId) {
                    return [];
                }
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/geo_location_all/${selectedEmployeeId}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch employee data');
                }
                const data = await res.json();
                setGeoLatLong(data);
                return data;
            } catch (error) {
                console.error('Error fetching employeeGeo:', error);
                return [];
            }
        }
    });

    const { data: employeeList = [] } = useQuery({
        queryKey: ['employeeList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`);
            const data = await res.json();
            return data;
        }
    });

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    });

    const handleEmployeeChange = (event) => {
        setSelectedEmployeeId(event.target.value);
    };

    const handleDateChange = (setter) => (event) => {
        setter(event.target.value);
    };

    const handleDateChangeFrom = (event) => {
        const selectedDate = new Date(event.target.value);
        const formattedDate = formatDate(selectedDate);
        setFromDate(selectedDate);
    };

    const handleDateChangeTo = (event) => {
        const selectedDate = new Date(event.target.value);
        const formattedDate = formatDate(selectedDate);
        setToDate(selectedDate);
    };

    const handleTextInputClick = () => {
        document.getElementById('dateInputFrom').showPicker();
    };

    const handleTextInputClicks = () => {
        document.getElementById('dateInputTo').showPicker();
    };

    const period_search = () => {
        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/location_search`, {
            selectedEmployeeId,
            fromDate,
            toDate
        })
            .then(response => {
                const results = response.data.results;
                setSearchResults(results);
                setError(null);
                setLoading(false);
                if (results.length === 0) {
                    alert('Nothing found!');
                } else {
                    const dates = [...new Set(results.map(result => result.created_date.split('T')[0]))];
                    setUniqueDates(dates);
                    setSelectedDate(dates); // Set the first date as selected by default
                }
            })
            .catch(error => {
                setError("An error occurred during search.", error);
                setSearchResults([]);
                setLoading(false);
            });
    };

    const employe = employeeList.find(employe => employe.user_id === parseFloat(selectedEmployeeId));

    const fetchLocationName = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
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
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
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

    useEffect(() => {
        const currentDate = new Date();
        setFromDate(currentDate);
        setToDate(currentDate);
    }, []);
    useEffect(() => {
        if (selectedDate && employeeGeo.length > 0) {
            const filteredGeo = employeeGeo.filter(geo => geo.created_date.split('T')[0] === selectedDate);
            const fetchLocationNamesAsync = async () => {
                const markersData = await Promise.all(filteredGeo.map(async (geo, index) => {
                    const locationName = await fetchLocationName(geo.latitude, geo.longitude);
                    const locationNames = await fetchLocationNames(geo.latitude, geo.longitude);
                    // Determine if this is the last marker
                    const isLastMarker = index === filteredGeo.length - 1;

                    return (
                        <Marker
                            key={index}
                            position={{ lat: parseFloat(geo.latitude), lng: parseFloat(geo.longitude) }}
                            title={`${geo.created_date.split('T')[0]} ${geo.created_date.split('T')[1].split('.')[0]}  ${geo.full_name} ${locationName} ${locationNames} ${employe?.full_name}`}
                            icon={{
                                url: isLastMarker ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                            }}
                        />
                    );
                }));
                setMarkers(markersData);
            };

            fetchLocationNamesAsync();

            setPolylines([
                <Polyline
                    key={1}
                    path={filteredGeo.map(geo => ({ lat: parseFloat(geo.latitude), lng: parseFloat(geo.longitude) }))}
                    options={{ strokeColor: selectedDate ? '#FF0000' : '#FFFFFF' }}
                />
            ]);

            const totalDist = filteredGeo.reduce((acc, curr, index, arr) => {
                if (index === 0) return acc;
                const prev = arr[index - 1];
                const dist = calculateDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
                return acc + dist;
            }, 0);
            setTotalDistance(totalDist);
        }
    }, [selectedDate, employeeGeo, employe]);


    // useEffect(() => {
    //     if (selectedDate && employeeGeo.length > 0) {
    //         const filteredGeo = employeeGeo.filter(geo => geo.created_date.split('T')[0] === selectedDate);
    //         const fetchLocationNamesAsync = async () => {
    //             const markersData = await Promise.all(filteredGeo.map(async (geo, index) => {
    //                 const locationName = await fetchLocationName(geo.latitude, geo.longitude);
    //                 const locationNames = await fetchLocationNames(geo.latitude, geo.longitude);
    //                 const markerColor = index === employeeGeo.length - 1 ? 'blue' : 'red';
    //                 return (
    //                     <Marker
    //                         key={index}
    //                         position={{ lat: parseFloat(geo.latitude), lng: parseFloat(geo.longitude) }}
    //                         title={`${geo.created_date.split('T')[0]} ${geo.created_date.split('T')[1].split('.')[0]}  ${geo.full_name} ${locationName} ${locationNames} ${employe?.full_name}`}
    //                         options={{
    //                             icon: {
    //                                 url: `http://maps.google.com/mapfiles/ms/icons/${markerColor}-dot.png`
    //                             }
    //                         }}
    //                     />
    //                 );
    //             }));
    //             setMarkers(markersData);
    //         };

    //         fetchLocationNamesAsync();

    //         setPolylines([
    //             <Polyline
    //                 key={1}
    //                 path={filteredGeo.map(geo => ({ lat: parseFloat(geo.latitude), lng: parseFloat(geo.longitude) }))}
    //                 options={{ strokeColor: selectedDate ? '#FF0000' : '#FFFFFF' }}
    //             />
    //         ]);

    //         const totalDist = filteredGeo.reduce((acc, curr, index, arr) => {
    //             if (index === 0) return acc;
    //             const prev = arr[index - 1];
    //             const dist = calculateDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
    //             return acc + dist;
    //         }, 0);
    //         setTotalDistance(totalDist);
    //     }
    // }, [selectedDate, employeeGeo, employe]);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    };

    const isSearchDisabled = !selectedEmployeeId || !fromDate || !toDate || loading;

    if (!isLoaded) return <div>Loading...</div>;



    const employee_PDF_download = async () => {
        setLoading(true);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/location_search`, {
            selectedEmployeeId,
            fromDate,
            toDate
        });

        const searchResults = response.data.results;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/location_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults
                    // Other parameters if needed
                }),

                // If you need to send any data with the request, you can include it here
                // body: JSON.stringify({ /* your data */ }),
            });

            if (!response.ok) {
                throw new Error('Error generating PDF In Period');
            }


            // If you want to download the PDF automatically
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'period_pdf.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            setErrorr(error.message);
        } finally {
            setLoading(false);
        }
    };


    const employee_print = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/location_search`, {
                selectedEmployeeId,
                fromDate,
                toDate
            });

            const searchResults = response.data.results;

            // Create a new window for printing
            const editWindow = window.open('', '_blank');
            editWindow.document.write('<html><head><title>Employee Location History</title><style> @page { size: landscape; } @media print { @page { size: landscape; } } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; } thead { background-color: #f2f2f2; } body { text-align: center; } </style></head><body>');
            editWindow.document.write('<h2 style="margin: 0; padding: 0;">Employee Location History</h2>');

            // Render the filtered data in a table for editing
            editWindow.document.write('<table>');

            // Table header
            editWindow.document.write('<thead>');
            editWindow.document.write('<tr>');
            editWindow.document.write('<th>ID</th>');
            editWindow.document.write('<th>User ID</th>');
            editWindow.document.write('<th>Latitude</th>');
            editWindow.document.write('<th>Longitude</th>');
            editWindow.document.write('<th>Name</th>');
            editWindow.document.write('<th>Mobile</th>');
            editWindow.document.write('<th>Designation</th>');
            editWindow.document.write('<th>Branch</th>');
            editWindow.document.write('<th>Created Date</th>');
            editWindow.document.write('</tr>');
            editWindow.document.write('</thead>');

            // Table body
            editWindow.document.write('<tbody>');
            // Render rows of data
            searchResults.forEach((item, i) => {
                editWindow.document.write('<tr>');
                editWindow.document.write(`<td>${i + 1}</td>`);
                editWindow.document.write(`<td>${item.user_id}</td>`);
                editWindow.document.write(`<td>${item.latitude}</td>`);
                editWindow.document.write(`<td>${item.longitude}</td>`);
                editWindow.document.write(`<td>${item.full_name}</td>`);
                editWindow.document.write(`<td>${item.mobile}</td>`);
                editWindow.document.write(`<td>${item.designation_id}</td>`);
                editWindow.document.write(`<td>${item.branch_id}</td>`);
                editWindow.document.write(`<td>${new Date(item.created_date).toLocaleString()}</td>`); // Format date as needed
                editWindow.document.write('</tr>');
            });
            editWindow.document.write('</tbody>');

            editWindow.document.write('</table>');
            editWindow.document.write('</body></html>');
            editWindow.document.close();

            // Print function for the new window
            const printWindow = () => {
                editWindow.focus();
                editWindow.print();
                editWindow.close();
            };

            // Automatically trigger print after a short delay to ensure content is fully loaded
            setTimeout(() => {
                printWindow();
            }, 1000); // Adjust delay if necessary

        } catch (error) {
            console.error('Error:', error);
            // Handle error appropriately
        } finally {
            setLoading(false);
        }
    };


console.log(selectedDate)


    return (
        <>
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <div className='col-12 p-4'>
                            <div className='card mb-4'>
                                <div className="body-content bg-light">
                                    <div className="border-primary shadow-sm border-0">
                                        <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                            <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Location Search</h5>
                                        </div>
                                        <div className="card-body">
                                            <form>
                                                <div className="col-md-10 offset-md-1">
                                                    {/* <div className="form-group row student">
                                                        <label className="col-form-label col-md-2"><strong>Employee Name:</strong></label>
                                                        <div className="col-md-10">

                                                            <select className="mb-3 form-control form-control-sm required integer_no_zero" id="employee" value={selectedEmployeeId} onChange={handleEmployeeChange}>
                                                                <option value="">Select an employee</option>
                                                                {employeeList.map(employee => (
                                                                    <option key={employee.user_id} value={employee.user_id}>
                                                                        {employee.full_name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div> */}

                                                    <div className="form-group row student">
                                                        <label htmlFor="fromDate" className="col-form-label col-md-2"><strong>Start Date:</strong></label>
                                                        <div className="col-md-4">
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                id="fromDate"
                                                                value={fromDate ? formatDate(fromDate) : ''}
                                                                onClick={handleTextInputClick}
                                                                readOnly
                                                            />
                                                            <input
                                                                type="date"
                                                                id="dateInputFrom"
                                                                value={fromDate ? fromDate.toString().split('T')[0] : ''}
                                                                onChange={handleDateChangeFrom}
                                                                style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                            />
                                                        </div>

                                                        <label htmlFor="toDate" className="col-form-label col-md-2"><strong>End Date:</strong></label>
                                                        <div className="col-md-4">

                                                            <input
                                                                type="text"
                                                                id="toDate"
                                                                className="form-control"
                                                                value={toDate ? formatDate(toDate) : ''}
                                                                onClick={handleTextInputClicks}
                                                                readOnly
                                                            />
                                                            <input
                                                                type="date"
                                                                id="dateInputTo"
                                                                value={toDate ? toDate.toString().split('T')[0] : ''}
                                                                onChange={handleDateChangeTo}
                                                                style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <div className="offset-md-2 col-md-10 float-left">
                                                            <input
                                                                type="button"
                                                                name="search"
                                                                className="btn btn-sm btn-info search_btn mr-2"
                                                                value="Search"
                                                                onClick={period_search} disabled={isSearchDisabled}
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


                {error && <div>Error: {error}</div>}
                {searchResults.length === 0 && !loading && <div>No data found.</div>}

                {uniqueDates.length > 0 && (
                    <>
                        <div className="alert alert-warning mb-0 mb-2 text-danger font-weight-bold" role="alert">
                            <p>Search Geo Location From {fromDate ? formatDate(fromDate) : ''} To {toDate ? formatDate(toDate) : ''}</p>
                            <p>Selected Date In Geo Location { (selectedDate[0])}</p>
                            <p>Total Distance: {totalDistance} Meter or {totalDistance / 1000} KM</p>
                        </div>
                        <div className='d-flex'>



                            <ul class="list-group col-md-3 mt-2 ml-4">
                                {uniqueDates.map((date, index) => (


                                    <li
                                        className='list-group-item'
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        style={{
                                            backgroundColor: selectedDate === date ? 'blue' : 'white',
                                            color: selectedDate === date ? 'white' : 'black'
                                        }}
                                    > {date}</li>
                                ))}

                            </ul>
                            {/* ))} */}
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '600px' }}
                                center={{ lat: 23.8103, lng: 90.4125 }}
                                zoom={12}
                            >
                                {markers}
                                {polylines}
                            </GoogleMap>


                        </div>
                    </>
                )}

            </div>
        </>



    );
};

export default EmployeeGoogleMap;