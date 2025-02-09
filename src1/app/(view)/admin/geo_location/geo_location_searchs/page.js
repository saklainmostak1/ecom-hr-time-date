// 'use client' 
 //ismile
// import React from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';

// const GoogleMaps = () => {
//     const containerStyle = {
//         width: '100%',
//         height: '100vh',
//     };

//     const center = {
//         lat: 23.7923194,
//         lng: 90.3725404
//     };

//     const locations = [
//         { lat: 23.7923194, lng: 90.3725404 },
//         { lat: 23.8028549, lng: 90.3645132 },
//         { lat: 23.7996398, lng: 90.3697852 }
//     ];

//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyC-wZD1z4x8YNcwEXbFin1JfIBsAJz32gE"
//     });

//     const [map, setMap] = React.useState(null);

//     const onLoad = React.useCallback(function callback(map) {
//         const bounds = new window.google.maps.LatLngBounds(center);
//         map.fitBounds(bounds);
//         setMap(map);
//     }, []);

//     const onUnmount = React.useCallback(function callback(map) {
//         setMap(null);
//     }, []);

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     const polylineOptions = {
//         strokeColor: "#FF0000",
//         strokeOpacity: 1.0,
//         strokeWeight: 2,
//         icons: [
//             {
//                 icon: {
//                     path: "M 0,-1 0,1",
//                     strokeOpacity: 1,
//                     scale: 4,


//                 },
//                 offset: "0",
//                 repeat: "20px",
//             },
//         ],
//     };

//     // const polylineOptions = {
//     //     strokeColor: "#FF0000",
//     //     strokeOpacity: 1.0,
//     //     strokeWeight: 2,
//     //     icons: [
//     //         {
//     //             icon: {
//     //                 path: "M 0,0 4,0", // Short horizontal line segment
//     //                 strokeOpacity: 1,
//     //                 scale: 1, // Adjust the scale if necessary
//     //             },
//     //             offset: "0",
//     //             repeat: "20px",
//     //         },
//     //     ],
//     // };


//     return isLoaded ? (
//         <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={center}
//             zoom={14}
//             onLoad={onLoad}
//             onUnmount={onUnmount}
//         >
//             <>
//                 {locations.map((location, index) => (
//                     <Marker key={index} position={location} />
//                 ))}
//                 <Polyline path={locations} options={polylineOptions} />
//             </>
//         </GoogleMap>
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GoogleMaps;



// 'use client' 
 //ismile
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';

// const GoogleMaps = ({id}) => {



//     const { data: employeeGeo = [],
//     } = useQuery({
//         queryKey: ['employeeGeo'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_geo/${id}`)

//             const data = await res.json()
//             return data
//         }
//     })

// console.log(employeeGeo)

//     const containerStyle = {
//         width: '100%',
//         height: '100vh',
//     };

//     const location = [
//         { lat: 23.7923194, lng: 90.3725404 },
//         { lat: 23.8028549, lng: 90.3645132 },
//         { lat: 23.7996398, lng: 90.3697852 }
//     ];

//     const locations = employeeGeo?.map(item => ({
//         lat: parseFloat(item.latitude),
//         lng: parseFloat(item.longitude)
//     }));

//     console.log(locations)
//     console.log(location)

//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyC-wZD1z4x8YNcwEXbFin1JfIBsAJz32gE"
//     });

//     const [map, setMap] = useState(null);
//     const [directions, setDirections] = useState(null);

//     useEffect(() => {
//         if (isLoaded && locations.length > 1) {
//             const directionsService = new window.google.maps.DirectionsService();

//             const waypoints = locations.slice(1, -1).map(location => ({
//                 location: new window.google.maps.LatLng(location.lat, location.lng),
//                 stopover: true,
//             }));

//             directionsService.route(
//                 {
//                     origin: locations[0],
//                     destination: locations[locations.length - 1],
//                     waypoints: waypoints,
//                     travelMode: window.google.maps.TravelMode.DRIVING,
//                 },
//                 (result, status) => {
//                     if (status === window.google.maps.DirectionsStatus.OK) {
//                         setDirections(result);
//                     } else {
//                         console.error(`error fetching directions ${result}`);
//                     }
//                 }
//             );
//         }
//     }, [isLoaded]);

//     const onLoad = React.useCallback(function callback(map) {
//         setMap(map);
//     }, []);

//     const onUnmount = React.useCallback(function callback(map) {
//         setMap(null);
//     }, []);

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     return isLoaded ? (
//         <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={locations[0]}
//             zoom={14}
//             onLoad={onLoad}
//             onUnmount={onUnmount}
//         >
//             <>
//                 {locations.map((location, index) => (
//                     <Marker key={index} position={location} />
//                 ))}
//                 {directions && (
//                     <DirectionsRenderer
//                         directions={directions}
//                         options={{
//                             polylineOptions: {
//                                 strokeColor: "#FF0000",
//                                 strokeOpacity: 1.0,
//                                 strokeWeight: 2,
//                                 icons: [
//                                     {
//                                         icon: {
//                                             path: "M 0,-1 0,1",
//                                             strokeOpacity: 1,
//                                             scale: 4,
//                                         },
//                                         offset: "0",
//                                         repeat: "20px",
//                                     },
//                                 ],
//                             },
//                         }}
//                     />
//                 )}
//             </>
//         </GoogleMap>
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GoogleMaps;

// 'use client' 
 //ismile
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';

// const GoogleMaps = ({ id }) => {
//     const { data: employeeGeo = [] } = useQuery({
//         queryKey: ['employeeGeo'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_geo/${id}`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     console.log(employeeGeo);

//     const containerStyle = {
//         width: '100%',
//         height: '100vh',
//     };

// const locations = employeeGeo?.map(item => ({
//     lat: parseFloat(item.latitude),
//     lng: parseFloat(item.longitude)
// }));

//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyC-wZD1z4x8YNcwEXbFin1JfIBsAJz32gE"
//     });

//     const [map, setMap] = useState(null);
//     const [directions, setDirections] = useState(null);

//     useEffect(() => {
//         if (isLoaded && locations.length > 1) {
//             const directionsService = new window.google.maps.DirectionsService();

//             const waypoints = locations.slice(1, -1).map(location => ({
//                 location: new window.google.maps.LatLng(location.lat, location.lng),
//                 stopover: true,
//             }));

//             directionsService.route(
//                 {
//                     origin: locations[0],
//                     destination: locations[locations.length - 1],
//                     waypoints: waypoints,
//                     travelMode: window.google.maps.TravelMode.DRIVING,
//                 },
//                 (result, status) => {
//                     if (status === window.google.maps.DirectionsStatus.OK) {
//                         setDirections(result);
//                     } else {
//                         console.error(`error fetching directions ${result}`);
//                     }
//                 }
//             );
//         }
//     }, [isLoaded]);

//     const onLoad = React.useCallback(function callback(map) {
//         setMap(map);
//     }, []);

//     const onUnmount = React.useCallback(function callback(map) {
//         setMap(null);
//     }, []);

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     return isLoaded ? (
//         <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={locations[0]}
//             zoom={14}
//             onLoad={onLoad}
//             onUnmount={onUnmount}
//         >
//             <>
//                 {locations.map((location, index) => (
//                     <Marker key={index} position={location} />
//                 ))}
//                 {directions && (
//                     <DirectionsRenderer
//                         directions={directions}
//                         options={{
//                             polylineOptions: {
//                                 strokeColor: "#FF0000",
//                                 strokeOpacity: 1.0,
//                                 strokeWeight: 2,
//                                 // icons: [
//                                 //     {
//                                 //         icon: {
//                                 //             path: "M 0,-1 0,1",
//                                 //             strokeOpacity: 1,
//                                 //             scale: 4,
//                                 //         },
//                                 //         offset: "0",
//                                 //         repeat: "10px",
//                                 //     },
//                                 // ],
//                             },
//                         }}
//                     />
//                 )}
//             </>
//         </GoogleMap>
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GoogleMaps;

// 'use client' 
 //ismile
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';

// const GoogleMaps = ({ id }) => {
//     const { data: employeeGeo = [] } = useQuery({
//         queryKey: ['employeeGeo'],
//         queryFn: async () => {
//             try {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_geo/${id}`);
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

//     console.log(employeeGeo.map(geo => geo.created_date));

//     const containerStyle = {
//         width: '100%',
//         height: '100vh',
//     };

//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyC-wZD1z4x8YNcwEXbFin1JfIBsAJz32gE"
//     });

//     const [map, setMap] = useState(null);
//     const [directions, setDirections] = useState(null);

//     useEffect(() => {
//         if (isLoaded && employeeGeo.length > 1) {
//             const directionsService = new window.google.maps.DirectionsService();

//             const locations = employeeGeo.map(item => ({
//                 lat: parseFloat(item.latitude),
//                 lng: parseFloat(item.longitude)
//             }));

//             const waypoints = locations.slice(1, -1).map(location => ({
//                 location: new window.google.maps.LatLng(location.lat, location.lng),
//                 stopover: true,
//             }));

//             directionsService.route(
//                 {
//                     origin: new window.google.maps.LatLng(locations[0].lat, locations[0].lng),
//                     destination: new window.google.maps.LatLng(locations[locations.length - 1].lat, locations[locations.length - 1].lng),
//                     waypoints: waypoints,
//                     travelMode: window.google.maps.TravelMode.DRIVING,
//                 },
//                 (result, status) => {
//                     if (status === window.google.maps.DirectionsStatus.OK) {
//                         setDirections(result);
//                     } else {
//                         console.error(`Error fetching directions: ${status}`);
//                     }
//                 }
//             );
//         }
//     }, [isLoaded, employeeGeo]);

//     const onLoad = React.useCallback(function callback(map) {
//         setMap(map);
//     }, []);

//     const onUnmount = React.useCallback(function callback(map) {
//         setMap(null);
//     }, []);

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     return isLoaded ? (
//         <div>
//             <div>
//                 {
//                     employeeGeo.map(geo =>

//                         <>

//                             <button>{geo.created_date}</button>
//                         </>
//                     )
//                 }
//             </div>

//             <GoogleMap
//                 mapContainerStyle={containerStyle}
//                 center={employeeGeo.length > 0 ? { lat: parseFloat(employeeGeo[0].latitude), lng: parseFloat(employeeGeo[0].longitude) } : { lat: 0, lng: 0 }}
//                 zoom={14}
//                 onLoad={onLoad}
//                 onUnmount={onUnmount}
//             >
//                 <>
//                     {employeeGeo.map((location, index) => (
//                         <Marker key={index} position={{ lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }} />
//                     ))}
//                     {directions && (
//                         <DirectionsRenderer
//                             directions={directions}
//                             options={{
//                                 polylineOptions: {
//                                     strokeColor: "#FF0000",
//                                     strokeOpacity: 1.0,
//                                     strokeWeight: 2,
//                                     // Uncomment and modify as needed
//                                     // icons: [{
//                                     //     icon: {
//                                     //         path: "M 0,-1 0,1",
//                                     //         strokeOpacity: 1,
//                                     //         scale: 4,
//                                     //     },
//                                     //     offset: "0",
//                                     //     repeat: "10px",
//                                     // }],
//                                 },
//                             }}
//                         />
//                     )}
//                 </>
//             </GoogleMap>
//         </div>
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GoogleMaps;


// 'use client' 
 //ismile
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';

// const GoogleMaps = ({ id }) => {
//     const { data: employeeGeo = [] } = useQuery({
//         queryKey: ['employeeGeo'],
//         queryFn: async () => {
//             try {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_geo/${id}`);
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

//     const [selectedDate, setSelectedDate] = useState(null); // State to track selected date

//     const containerStyle = {
//         width: '100%',
//         height: '100vh',
//     };

//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyC-wZD1z4x8YNcwEXbFin1JfIBsAJz32gE"
//     });

//     const [map, setMap] = useState(null);
//     const [markers, setMarkers] = useState([]);
//     const [polylinePath, setPolylinePath] = useState([]);

//     useEffect(() => {
//         if (isLoaded && employeeGeo.length > 1 && selectedDate) {
//             const locations = employeeGeo
//                 .filter(geo => {
//                     const datePart = geo.created_date.split('T')[0]; // Extract date part only
//                     return datePart === selectedDate;
//                 })
//                 .map(item => ({
//                     lat: parseFloat(item.latitude),
//                     lng: parseFloat(item.longitude)
//                 }));

//             if (locations.length > 1) {
//                 // Calculate polyline path
//                 const path = locations.map(location => ({ lat: location.lat, lng: location.lng }));
//                 setPolylinePath(path);
//             } else {
//                 setPolylinePath([]);
//             }

//             // Update markers
//             const newMarkers = locations.map((location, index) => (
//                 <Marker key={`${location.lat}_${location.lng}`} position={{ lat: location.lat, lng: location.lng }} label={String.fromCharCode(65 + index)} />
//             ));
//             setMarkers(newMarkers);

//             // Center map on the first marker
//             if (map && locations.length > 0) {
//                 map.panTo({ lat: locations[0].lat, lng: locations[0].lng });
//             }
//         }
//     }, [isLoaded, employeeGeo, selectedDate, map]);

//     const onLoad = React.useCallback(function callback(map) {
//         setMap(map);
//     }, []);

//     const onUnmount = React.useCallback(function callback() {
//         setMap(null);
//     }, []);

//     const handleDateButtonClick = (date) => {
//         setSelectedDate(date);
//     };

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     // Extract unique dates from employeeGeo
//     const uniqueDates = [...new Set(employeeGeo.map(geo => geo.created_date.split('T')[0]))];

//     return isLoaded ? (
//         <div>
//             <div>
//                 {uniqueDates.map((date, index) => (
//                     <button key={index} onClick={() => handleDateButtonClick(date)}>{date}</button>
//                 ))}
//             </div>

//             <GoogleMap
//                 mapContainerStyle={containerStyle}
//                 center={employeeGeo.length > 0 && selectedDate ? { lat: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate).latitude), lng: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate).longitude) } : { lat: 0, lng: 0 }}
//                 zoom={14}
//                 onLoad={onLoad}
//                 onUnmount={onUnmount}
//             >
//                 <>
//                     {markers}
//                     {polylinePath.length > 0 && (
//                         <Polyline
//                             path={polylinePath}
//                             options={{
//                                 strokeColor: "#FF0000",
//                                 strokeOpacity: 1.0,
//                                 strokeWeight: 2,
//                             }}
//                         />
//                     )}
//                 </>
//             </GoogleMap>
//         </div>
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GoogleMaps;


// 'use client' 
 //ismile
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';

// const GoogleMaps = ({ id }) => {
//     const { data: employeeGeo = [] } = useQuery({
//         queryKey: ['employeeGeo'],
//         queryFn: async () => {
//             try {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_geo/${id}`);
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

//     const [selectedDate, setSelectedDate] = useState(null); // State to track selected date

//     const containerStyle = {
//         width: '100%',
//         height: '100vh',
//     };

//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyC-wZD1z4x8YNcwEXbFin1JfIBsAJz32gE"
//     });

//     const [map, setMap] = useState(null);
//     const [markers, setMarkers] = useState([]);
//     const [polylines, setPolylines] = useState([]);

//     useEffect(() => {
//         if (isLoaded && employeeGeo.length > 1 && selectedDate) {
//             const locations = employeeGeo
//                 .filter(geo => geo.created_date.split('T')[0] === selectedDate)
//                 .map(item => ({
//                     lat: parseFloat(item.latitude),
//                     lng: parseFloat(item.longitude)
//                 }));

//             if (locations.length > 1) {
//                 const newPolylines = [];
//                 for (let i = 0; i < locations.length - 1; i++) {
//                     const directionsService = new window.google.maps.DirectionsService();

//                     directionsService.route(
//                         {
//                             origin: new window.google.maps.LatLng(locations[i].lat, locations[i].lng),
//                             destination: new window.google.maps.LatLng(locations[i + 1].lat, locations[i + 1].lng),
//                             travelMode: window.google.maps.TravelMode.DRIVING,
//                         },
//                         (result, status) => {
//                             if (status === window.google.maps.DirectionsStatus.OK) {
//                                 newPolylines.push(
//                                     <Polyline
//                                         key={`polyline_${i}`}
//                                         path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//                                         options={{
//                                             // strokeColor: "#FF0000",
//                                             strokeColor:  "", // Red if selected, white if not
//                                             strokeOpacity: 0.8,
//                                             strokeWeight:  4,
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
//             } else {
//                 setPolylines([]); // Clear polylines if there are no locations or only one location
//             }

//             // Update markers
//             const newMarkers = locations.map((location, index) => (
//                 <Marker key={`${location.lat}_${location.lng}`} position={{ lat: location.lat, lng: location.lng }} />
//             ));
//             setMarkers(newMarkers);

//             // Center map on the first marker
//             if (map && locations.length > 0) {
//                 map.panTo({ lat: locations[0].lat, lng: locations[0].lng });
//             }
//         }
//     }, [isLoaded, employeeGeo, selectedDate, map]);

//     const onLoad = React.useCallback(function callback(map) {
//         setMap(map);
//     }, []);

//     const onUnmount = React.useCallback(function callback() {
//         setMap(null);
//     }, []);

//     const handleDateButtonClick = (date) => {
//         setSelectedDate(date);
//     };

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     // Extract unique dates from employeeGeo
//     const uniqueDates = [...new Set(employeeGeo.map(geo => geo.created_date.split('T')[0]))];

//     return isLoaded ? (
//         <div>
//             <div>
//                 {uniqueDates.map((date, index) => (
//                     <button key={index} onClick={() => handleDateButtonClick(date)}>{date}</button>
//                 ))}
//             </div>

//             <GoogleMap
//                 mapContainerStyle={containerStyle}
//                 center={employeeGeo.length > 0 && selectedDate ? { lat: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate).latitude), lng: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate).longitude) } : { lat: 0, lng: 0 }}
//                 zoom={14}
//                 onLoad={onLoad}
//                 onUnmount={onUnmount}
//             >
//                 <>
//                     {markers}
//                     {polylines}
//                 </>
//             </GoogleMap>
//         </div>
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GoogleMaps;

// 'use client' 
 //ismile
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';

// const GoogleMaps = ({ id }) => {
//     const { data: employeeGeo = [] } = useQuery({
//         queryKey: ['employeeGeo'],
//         queryFn: async () => {
//             try {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_geo/${id}`);
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


//     const locations = employeeGeo?.map(item => ({
//         lat: parseFloat(item.latitude),
//         lng: parseFloat(item.longitude)
//     }));
// // console.log(locations[0])

//     const [selectedDate, setSelectedDate] = useState(null); // State to track selected date

//     const containerStyle = {
//         width: '100%',
//         height: '100vh',
//     };

//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyC-wZD1z4x8YNcwEXbFin1JfIBsAJz32gE"
//     });

//     const [map, setMap] = useState(null);
//     const [markers, setMarkers] = useState([]);
//     const [polylines, setPolylines] = useState([]);

//     useEffect(() => {
//         if (isLoaded && employeeGeo.length > 1 && selectedDate) {
//             const locations = employeeGeo
//                 .filter(geo => geo.created_date.split('T')[0] === selectedDate)
//                 .map(item => ({
//                     lat: parseFloat(item.latitude),
//                     lng: parseFloat(item.longitude)
//                 }));

//             if (locations.length > 1) {
//                 const newPolylines = [];
//                 for (let i = 0; i < locations.length - 1; i++) {
//                     const directionsService = new window.google.maps.DirectionsService();

//                     directionsService.route(
//                         {
//                             origin: new window.google.maps.LatLng(locations[i].lat, locations[i].lng),
//                             destination: new window.google.maps.LatLng(locations[i + 1].lat, locations[i + 1].lng),
//                             travelMode: window.google.maps.TravelMode.DRIVING,
//                         },
//                         (result, status) => {
//                             if (status === window.google.maps.DirectionsStatus.OK) {
//                                 newPolylines.push(
//                                     <Polyline
//                                         key={`polyline_${i}`}
//                                         path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//                                         options={{
//                                             strokeColor: "#FF0000",
//                                             strokeOpacity: 0.8,
//                                             strokeWeight: 4,
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
//             } else {
//                 setPolylines([]); // Clear polylines if there are no locations or only one location
//             }

//             // Update markers
//             const newMarkers = locations.map((location, index) => (
//                 <Marker 
//                     key={`${location.lat}_${location.lng}`} 
//                     position={{ lat: location.lat, lng: location.lng }} 
//                     label={String.fromCharCode(65 + index)} // Label as A, B, C, etc.
//                 />
//             ));
//             setMarkers(newMarkers);

//             // Center map on the first marker
//             if (map && locations.length > 0) {
//                 map.panTo({ lat: locations[0].lat, lng: locations[0].lng });
//             }
//         }
//     }, [isLoaded, employeeGeo, selectedDate, map]);

//     const onLoad = React.useCallback(function callback(map) {
//         setMap(map);
//     }, []);

//     const onUnmount = React.useCallback(function callback() {
//         setMap(null);
//     }, []);

//     const handleDateButtonClick = (date) => {
//         setSelectedDate(date);
//     };

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     // Extract unique dates from employeeGeo
//     const uniqueDates = [...new Set(employeeGeo.map(geo => geo.created_date.split('T')[0]))];

//     return isLoaded ? (
//         <div className='d-flex'>
//             <div className='d-flex flex-column col-md-3 mt-2'>
//                 {uniqueDates.map((date, index) => (
//                     <button key={index} onClick={() => handleDateButtonClick(date)}>{date}</button>
//                 ))}
//             </div>

//             <GoogleMap
//             //  center={locations[0]}
//                 mapContainerStyle={containerStyle}
//                 center={employeeGeo.length > 0 && selectedDate ? { lat: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate).latitude), lng: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate).longitude) } : { lat: parseFloat(locations[0]?.lat), lng: parseFloat(locations[0]?.lng)}}
//                 zoom={14}
//                 onLoad={onLoad}
//                 onUnmount={onUnmount}
//             >
//                 <>
//                     {markers}
//                     {polylines}
//                 </>
//             </GoogleMap>
//         </div>
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GoogleMaps;

// 'use client' 
 //ismile;
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';

// const GoogleMaps = ({ id }) => {

//     const { data: employeeGeo = [] } = useQuery({
//         queryKey: ['employeeGeo'],
//         queryFn: async () => {
//             try {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_geo/${id}`);
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


//     const { data: employeeList = [],
//     } = useQuery({
//         queryKey: ['employeeList'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_list`)

//             const data = await res.json()
//             return data
//         }
//     })




//         const locations = employeeGeo?.map(item => ({
//         lat: parseFloat(item.latitude),
//         lng: parseFloat(item.longitude)
//     }));


//     const [selectedDate, setSelectedDate] = useState(null);
//     const [map, setMap] = useState(null);
//     const [markers, setMarkers] = useState([]);
//     const [polylines, setPolylines] = useState([]);

//     const containerStyle = {
//         width: '100%',
//         height: '100vh',
//     };

//     const { isLoaded, loadError } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: "AIzaSyC-wZD1z4x8YNcwEXbFin1JfIBsAJz32gE"
//     });

//     useEffect(() => {
//         if (isLoaded && employeeGeo.length > 0 && selectedDate) {
//             const filteredLocations = employeeGeo
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
//                                             strokeColor: "#FF0000", // White color
//                                             strokeOpacity: 1,
//                                             strokeWeight: 2,
//                                             // icons: [{
//                                             //     icon: {
//                                             //         path: 'M 0,-1 0,1',
//                                             //         strokeOpacity: 1,
//                                             //         scale: 4,
//                                             //     },
//                                             //     offset: '0',
//                                             //     repeat: '20px'
//                                             // }],
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
//     }, [isLoaded, employeeGeo, selectedDate, map]);

//     const onLoad = React.useCallback(function callback(map) {
//         setMap(map);
//     }, []);

//     const onUnmount = React.useCallback(function callback() {
//         setMap(null);
//     }, []);

//     const handleDateButtonClick = (date) => {
//         setSelectedDate(date);
//     };

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     const uniqueDates = [...new Set(employeeGeo.map(geo => geo.created_date.split('T')[0]))];



//     return isLoaded ? (
//         <div className='d-flex'>
//             <div className='d-flex flex-column col-md-3 mt-2'>
//             <select name="gender" class="mb-3 form-control form-control-sm  required integer_no_zero" id="gender_name">
//                 <option value="">Select employee Name</option>
//                 {
//                     employeeList.map(employee =>
//                         <>
//                         <option value={employee.user_id}>{employee.full_name}</option>
//                         </>
//                     )
//                 }
//                 <option value="2">Female</option>
//                 </select>
//                 {uniqueDates.map((date, index) => (
//                     <button class="btn btn-sm btn-info my-1" key={index} onClick={() => handleDateButtonClick(date)}>{date}</button>
//                 ))}
//             </div>

//             <GoogleMap
//                 mapContainerStyle={containerStyle}
//                 center={employeeGeo.length > 0 && selectedDate ? { lat: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate).latitude), lng: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate).longitude) } : 
//                 { lat: locations[0]?.lat, lng: locations[0]?.lng }}
//                 // { lat: locations[0]?.lat, lng: locations[0]?.lng }}
//                 zoom={14}
//                 onLoad={onLoad}
//                 onUnmount={onUnmount}
//             >
//                 <>
//                     {markers}
//                     {polylines}
//                 </>
//             </GoogleMap>
//         </div>
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GoogleMaps;

// 'use client' 
 //ismile;
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';

// const GoogleMaps = () => {
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

//     const { data: employeeGeo = [] } = useQuery({
//         queryKey: ['employeeGeo', selectedEmployeeId],
//         queryFn: async () => {
//             try {
//                 if (!selectedEmployeeId) {
//                     return [];
//                 }
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_geo/${selectedEmployeeId}`);
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
//     console.log(employeeGeo)

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
//         if (isLoaded && employeeGeo.length > 0 && selectedDate) {
//             const filteredLocations = employeeGeo
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
//                                             strokeColor: "#FF0000", // White color
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
//     }, [isLoaded, employeeGeo, selectedDate, map]);

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

//     const uniqueDates = [...new Set(employeeGeo.map(geo => geo.created_date.split('T')[0]))];
//     const buttonStyles = {
//         color: '#fff',
//         backgroundColor: '#510bc4',
//         backgroundImage: 'none',
//         borderColor: '#4c0ab8',
//     };

//     const page_group = localStorage.getItem('pageGroup')

//     const [showFromDate, setShowFromDate] = useState('');
//     const [showToDate, setShowToDate] = useState('');


//     const handleDateChangess = (event) => {
//         const selectedDate = new Date(event.target.value);
//         const day = String(selectedDate.getDate()).padStart(2, '0');
//         const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
//         const year = String(selectedDate.getFullYear()); // Get last two digits of the year
//         const formattedDate = `${day}-${month}-${year}`;
//         setShowFromDate(formattedDate);
//         setFromDate(selectedDate);
//     };

//     // Open date picker when text input is clicked
//     const handleTextInputClick = () => {
//         document.getElementById('dateInput').showPicker();
//     };

//     const handleDateChangesss = (event) => {
//         const selectedDate = new Date(event.target.value);
//         const day = String(selectedDate.getDate()).padStart(2, '0');
//         const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
//         const year = String(selectedDate.getFullYear()); // Get last two digits of the year
//         const formattedDate = `${day}-${month}-${year}`;
//         setShowToDate(formattedDate);
//         setToDate(selectedDate);
//     };

//     // Open date picker when text input is clicked
//     const handleTextInputClicks = () => {
//         document.getElementById('dateInputTo').showPicker();
//     };

//     const period_search = () => {
//         setLoading(true);
//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/location_search`, {
//             employeeGeo,
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
//             });
//     };

//     return isLoaded ? (
//         <div>
//             <div class="container-fluid">
//                 <div class=" row ">
//                     <div className='col-12 p-4'>
//                         <div className='card mb-4'>
//                             <div class="body-content bg-light">
//                                 <div class=" border-primary shadow-sm border-0">
//                                     <div class=" card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                         <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Location Search</h5>
//                                         <div class="card-title font-weight-bold mb-0 card-header-color float-right">
//                                             <Link href={`/Admin/employee/employee_list?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Employee List</Link>
//                                         </div>
//                                     </div>
//                                     <div class="card-body">
//                                         <form class="">
//                                             <div class="col-md-10 offset-md-1">
//                                                 <div class="form-group row student">
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

//                                                 <div class="form-group row student">

//                                                     <label htmlFor="fromDate" class="col-form-label col-md-2"><strong>Start Date:</strong></label>

//                                                     <div className="col-md-4">


//                                                         <input
//                                                             type="text"
//                                                             readOnly

//                                                             value={showFromDate}
//                                                             onClick={handleTextInputClick}
//                                                             placeholder="dd-mm-yy"
//                                                             className="form-control"
//                                                             style={{ display: 'inline-block', }}
//                                                         />
//                                                         <input

//                                                             type="date"
//                                                             id="dateInput"
//                                                             onChange={handleDateChangess}
//                                                             style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
//                                                         />


//                                                     </div>

//                                                     <label htmlFor="toDate" class="col-form-label col-md-2"><strong>End Date:</strong></label>
//                                                     <div class="col-md-4">
//                                                         <input
//                                                             type="text"
//                                                             readOnly

//                                                             value={showToDate}
//                                                             onClick={handleTextInputClicks}
//                                                             placeholder="dd-mm-yy"
//                                                             className="form-control"
//                                                             style={{ display: 'inline-block', }}
//                                                         />
//                                                         <input

//                                                             type="date"
//                                                             id="dateInputTo"
//                                                             onChange={handleDateChangesss}
//                                                             style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
//                                                         />

//                                                     </div>
//                                                 </div>

//                                                 <div class="form-group row">
//                                                     <div class="offset-md-2 col-md-10 float-left">
//                                                         <input type="button" name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search" />
//                                                         <input type="button" name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />

//                                                         <input
//                                                             type="button"
//                                                             style={buttonStyles}
//                                                             name="search"
//                                                             className="btn btn-sm btn-secondary excel_btn mr-2"
//                                                             value="Download PDF"
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
//                 <div className='d-flex flex-column col-md-3 mt-2'>

//                     {uniqueDates.map((date, index) => (
//                         <button
//                             className="btn btn-sm btn-info my-1"
//                             key={index}
//                             onClick={() => handleDateButtonClick(date)}
//                         >
//                             {date}
//                         </button>
//                     ))}
//                 </div>
//                 <GoogleMap
//                     mapContainerStyle={{ width: '100%', height: '100vh' }}
//                     center={
//                         selectedDate ?
//                             { lat: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate)?.latitude), lng: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate)?.longitude) }
//                             :
//                             { lat: employeeGeo.length > 0 ? parseFloat(employeeGeo[0].latitude) : 0, lng: employeeGeo.length > 0 ? parseFloat(employeeGeo[0].longitude) : 0 }
//                     }
//                     zoom={14}
//                     onLoad={onLoad}
//                     onUnmount={onUnmount}
//                 >
//                     <>
//                         {markers}
//                         {polylines}
//                     </>
//                 </GoogleMap>
//             </div>
//         </div >
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GoogleMaps;


// 'use client' 
 //ismile;
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import axios from 'axios';

// const GoogleMaps = () => {
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [fromDate, setFromDate] = useState(null);
//     const [toDate, setToDate] = useState(null);
//     const [searchResults, setSearchResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

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

//     const handleEmployeeChange = (event) => {
//         setSelectedEmployeeId(event.target.value);
//     };

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     const uniqueDates = [...new Set(searchResults.map(geo => geo.created_date.split('T')[0]))];
//     const buttonStyles = {
//         color: '#fff',
//         backgroundColor: '#510bc4',
//         backgroundImage: 'none',
//         borderColor: '#4c0ab8',
//     };

//     const page_group = localStorage.getItem('pageGroup')

//     const [showFromDate, setShowFromDate] = useState('');
//     const [showToDate, setShowToDate] = useState('');


//     const handleDateChangess = (event) => {
//         const selectedDate = new Date(event.target.value);
//         const day = String(selectedDate.getDate()).padStart(2, '0');
//         const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
//         const year = String(selectedDate.getFullYear()); // Get last two digits of the year
//         const formattedDate = `${day}-${month}-${year}`;
//         setShowFromDate(formattedDate);
//         setFromDate(selectedDate);
//     };

//     // Open date picker when text input is clicked
//     const handleTextInputClick = () => {
//         document.getElementById('dateInput').showPicker();
//     };

//     const handleDateChangesss = (event) => {
//         const selectedDate = new Date(event.target.value);
//         const day = String(selectedDate.getDate()).padStart(2, '0');
//         const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
//         const year = String(selectedDate.getFullYear()); // Get last two digits of the year
//         const formattedDate = `${day}-${month}-${year}`;
//         setShowToDate(formattedDate);
//         setToDate(selectedDate);
//     };

//     // Open date picker when text input is clicked
//     const handleTextInputClicks = () => {
//         document.getElementById('dateInputTo').showPicker();
//     };

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



//     const formatDate = (date) => {
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = String(date.getFullYear());
//         return `${day}-${month}-${year}`;
//     };
//     useEffect(() => {
//         const currentDate = new Date();
//         // const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//         setFromDate(currentDate);
//         setToDate(currentDate);
//         setShowFromDate(formatDate(currentDate));
//         setShowToDate(formatDate(currentDate));
//     }, []);
//     return isLoaded ? (
//         <div>
//             <div class="container-fluid">
//                 <div class="row">
//                     <div className='col-12 p-4'>
//                         <div className='card mb-4'>
//                             <div class="body-content bg-light">
//                                 <div class="border-primary shadow-sm border-0">
//                                     <div class="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                         <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Location Search</h5>
//                                         <div class="card-title font-weight-bold mb-0 card-header-color float-right">
//                                             <Link href={`/Admin/employee/employee_list?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Employee List</Link>
//                                         </div>
//                                     </div>
//                                     <div class="card-body">
//                                         <form>
//                                             <div class="col-md-10 offset-md-1">
//                                                 <div class="form-group row student">
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

//                                                 <div class="form-group row student">
//                                                     <label htmlFor="fromDate" class="col-form-label col-md-2"><strong>Start Date:</strong></label>
//                                                     <div className="col-md-4">
//                                                         <input
//                                                             type="text"
//                                                             readOnly
//                                                             value={showFromDate}
//                                                             onClick={handleTextInputClick}
//                                                             placeholder="dd-mm-yy"
//                                                             className="form-control"
//                                                             style={{ display: 'inline-block' }}
//                                                         />
//                                                         <input
//                                                             type="date"
//                                                             id="dateInput"
//                                                             onChange={handleDateChangess}
//                                                             style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
//                                                         />
//                                                     </div>

//                                                     <label htmlFor="toDate" class="col-form-label col-md-2"><strong>End Date:</strong></label>
//                                                     <div class="col-md-4">
//                                                         <input
//                                                             type="text"
//                                                             readOnly
//                                                             value={showToDate}
//                                                             onClick={handleTextInputClicks}
//                                                             placeholder="dd-mm-yy"
//                                                             className="form-control"
//                                                             style={{ display: 'inline-block' }}
//                                                         />
//                                                         <input
//                                                             type="date"
//                                                             id="dateInputTo"
//                                                             onChange={handleDateChangesss}
//                                                             style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 <div class="form-group row">
//                                                     <div class="offset-md-2 col-md-10 float-left">
//                                                         <input
//                                                             type="button"
//                                                             name="search"
//                                                             class="btn btn-sm btn-info search_btn mr-2"
//                                                             value="Search"
//                                                             onClick={period_search}
//                                                         />
//                                                         <input
//                                                             type="button"
//                                                             name="search"
//                                                             class="btn btn-sm btn-success print_btn mr-2"
//                                                             value="Print"
//                                                             onClick={employee_print}
//                                                         />
//                                                         <input
//                                                             onClick={employee_PDF_download}
//                                                             type="button"
//                                                             style={buttonStyles}
//                                                             name="search"
//                                                             className="btn btn-sm btn-secondary excel_btn mr-2"
//                                                             value="Download PDF"
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
//                 <ul class="list-group d-flex flex-column col-md-3 mt-2 ml-4">
//                     {uniqueDates.map((date, index) => (


//                         <li className="btn btn-sm btn-info my-1"
//                             key={index}
//                             onClick={() => handleDateButtonClick(date)} class="list-group-item"> {date}</li>
//                     ))}


//                 </ul>
//                 {/* <div className='d-flex flex-column col-md-3 mt-2'>
//                     {uniqueDates.map((date, index) => (
//                         <button
//                             className="btn btn-sm btn-info my-1"
//                             key={index}
//                             onClick={() => handleDateButtonClick(date)}
//                         >
//                             {date}
//                         </button>
//                     ))}
//                 </div> */}


//                 {
//                     searchResults.length > 0 ?

//                         <GoogleMap
//                             mapContainerStyle={{ width: '100%', height: '100vh' }}
//                             center={
//                                 selectedDate ?
//                                     { lat: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate)?.latitude), lng: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate)?.longitude) }
//                                     :
//                                     { lat: employeeGeo.length > 0 ? parseFloat(employeeGeo[0].latitude) : 0, lng: employeeGeo.length > 0 ? parseFloat(employeeGeo[0].longitude) : 0 }
//                             }
//                             zoom={14}
//                             onLoad={onLoad}
//                             onUnmount={onUnmount}
//                         >
//                             <>
//                                 {markers}
//                                 {polylines}
//                             </>
//                         </GoogleMap>
//                         :
//                         "No data"
//                 }

//             </div>
//         </div >
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GoogleMaps;


// 'use client' 
 //ismile;
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import axios from 'axios';

// const GoogleMaps = () => {
//     const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
//     const [fromDate, setFromDate] = useState(null);
//     const [toDate, setToDate] = useState(null);
//     const [searchResults, setSearchResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

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

//     const handleEmployeeChange = (event) => {
//         setSelectedEmployeeId(event.target.value);
//     };

//     if (loadError) {
//         return <div>Error loading maps</div>;
//     }

//     const uniqueDates = [...new Set(searchResults.map(geo => geo.created_date.split('T')[0]))];
//     const buttonStyles = {
//         color: '#fff',
//         backgroundColor: '#510bc4',
//         backgroundImage: 'none',
//         borderColor: '#4c0ab8',
//     };

//     const page_group = localStorage.getItem('pageGroup');

//     const [showFromDate, setShowFromDate] = useState('');
//     const [showToDate, setShowToDate] = useState('');

//     const handleDateChangess = (event) => {
//         const selectedDate = new Date(event.target.value);
//         const day = String(selectedDate.getDate()).padStart(2, '0');
//         const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
//         const year = String(selectedDate.getFullYear()); // Get last two digits of the year
//         const formattedDate = `${day}-${month}-${year}`;
//         setShowFromDate(formattedDate);
//         setFromDate(selectedDate);
//     };

//     // Open date picker when text input is clicked
//     const handleTextInputClick = () => {
//         document.getElementById('dateInput').showPicker();
//     };

//     const handleDateChangesss = (event) => {
//         const selectedDate = new Date(event.target.value);
//         const day = String(selectedDate.getDate()).padStart(2, '0');
//         const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
//         const year = String(selectedDate.getFullYear()); // Get last two digits of the year
//         const formattedDate = `${day}-${month}-${year}`;
//         setShowToDate(formattedDate);
//         setToDate(selectedDate);
//     };

//     // Open date picker when text input is clicked
//     const handleTextInputClicks = () => {
//         document.getElementById('dateInputTo').showPicker();
//     };

//     const period_search = () => {
//         setLoading(true);
//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/location_search`, {
//             selectedEmployeeId,
//             fromDate,
//             toDate
//         })
//             .then(response => {
//                 const results = response.data.results;
//                 setSearchResults(results);
//                 setError(null);
//                 setLoading(false);
//                 if (results.length === 0) {
//                     alert('Nothing found!');
//                 } else {
//                     // Set the first date by default
//                     const firstDate = results[0].created_date.split('T')[0];
//                     setSelectedDate(firstDate);
//                 }
//             })
//             .catch(error => {
//                 setError("An error occurred during search.", error);
//                 setSearchResults([]);
//                 setLoading(false);
//             });
//     };



//     const formatDate = (date) => {
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = String(date.getFullYear());
//         return `${day}-${month}-${year}`;
//     };

//     useEffect(() => {
//         const currentDate = new Date();
//         setFromDate(currentDate);
//         setToDate(currentDate);
//         setShowFromDate(formatDate(currentDate));
//         setShowToDate(formatDate(currentDate));
//     }, []);

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

//                                                 <div className="form-group row student">
//                                                     <label htmlFor="fromDate" className="col-form-label col-md-2"><strong>Start Date:</strong></label>
//                                                     <div className="col-md-4">
//                                                         <input
//                                                             type="text"
//                                                             readOnly
//                                                             value={showFromDate}
//                                                             onClick={handleTextInputClick}
//                                                             placeholder="dd-mm-yy"
//                                                             className="form-control"
//                                                             style={{ display: 'inline-block' }}
//                                                         />
//                                                         <input
//                                                             type="date"
//                                                             id="dateInput"
//                                                             onChange={handleDateChangess}
//                                                             style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
//                                                         />
//                                                     </div>

//                                                     <label htmlFor="toDate" className="col-form-label col-md-2"><strong>End Date:</strong></label>
//                                                     <div className="col-md-4">
//                                                         <input
//                                                             type="text"
//                                                             readOnly
//                                                             value={showToDate}
//                                                             onClick={handleTextInputClicks}
//                                                             placeholder="dd-mm-yy"
//                                                             className="form-control"
//                                                             style={{ display: 'inline-block' }}
//                                                         />
//                                                         <input
//                                                             type="date"
//                                                             id="dateInputTo"
//                                                             onChange={handleDateChangesss}
//                                                             style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 <div className="form-group row">
//                                                     <div className="offset-md-2 col-md-10 float-left">
//                                                         <input
//                                                             type="button"
//                                                             name="search"
//                                                             className="btn btn-sm btn-info search_btn mr-2"
//                                                             value="Search"
//                                                             onClick={period_search}
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
//             <ul class="list-group d-flex flex-column col-md-3 mt-2 ml-4">
//                     {uniqueDates.map((date, index) => (


//                         <li className="btn btn-sm btn-info my-1"
//                             key={index}
//                             onClick={() => handleDateButtonClick(date)} class="list-group-item"> {date}</li>
//                     ))}


//                 </ul>
//                 {
//                     searchResults.length > 0 ?
//                         <GoogleMap
//                             mapContainerStyle={{ width: '100%', height: '100vh' }}
//                             center={
//                                 selectedDate ?
//                                     { lat: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate)?.latitude), lng: parseFloat(employeeGeo.find(geo => geo.created_date.split('T')[0] === selectedDate)?.longitude) }
//                                     :
//                                     { lat: employeeGeo.length > 0 ? parseFloat(employeeGeo[0].latitude) : 0, lng: employeeGeo.length > 0 ? parseFloat(employeeGeo[0].longitude) : 0 }
//                             }
//                             zoom={14}
//                             onLoad={onLoad}
//                             onUnmount={onUnmount}
//                         >
//                             <>
//                                 {markers}
//                                 {polylines}
//                             </>
//                         </GoogleMap>
//                         :
//                         "No data"
//                 }
//             </div>
//         </div>
//     ) : (
//         <div>Loading...</div>
//     );
// };

// export default GoogleMaps;

// 'use client' 
 //ismile;
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import axios from 'axios';

// const GoogleMaps = () => {
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
//                                     // <Polyline
//                                     // key={`polyline_${i}`}
//                                     // // path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//                                     // path={filteredLocations}
//                                     // options={{strokeColor: selectedDate === filteredLocations[i].created_date.split('T')[0] ? "#FF0000" : "#FFFFFF", // Red strokeColor: '#FF0000',
//                                     //     strokeOpacity: 1,
//                                     //     strokeWeight: 2,
//                                     //     icons: [{
//                                     //         icon: {
//                                     //             path: 'M 0,-1 0,1',
//                                     //             strokeOpacity: 1,
//                                     //             scale: 4
//                                     //         },
//                                     //         offset: '0',
//                                     //         repeat: '10px'
//                                     //     }]
//                                     // }}
//                                     // />
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




//     // useEffect(() => {
//     //     if (isLoaded && searchResults.length > 0 && selectedDate) {
//     //         const filteredLocations = searchResults
//     //             .filter(geo => geo.created_date.split('T')[0] === selectedDate)
//     //             .map(item => ({
//     //                 lat: parseFloat(item.latitude),
//     //                 lng: parseFloat(item.longitude),
//     //                 created_date: item.created_date
//     //             }));

//     //         if (filteredLocations.length > 0) {
//     //             // Update markers
//     //             const newMarkers = filteredLocations.map((location, index) => (
//     //                 <Marker
//     //                     key={`${location.lat}_${location.lng}`}
//     //                     position={{ lat: location.lat, lng: location.lng }}
//     //                     label={String.fromCharCode(65 + index)} // Label as A, B, C, etc.
//     //                     onClick={() => handleMarkerClick(location)} // Set selected marker
//     //                 />
//     //             ));
//     //             setMarkers(newMarkers);

//     //             // Create polylines
//     //             const newPolylines = [];
//     //             for (let i = 0; i < filteredLocations.length - 1; i++) {
//     //                 const directionsService = new window.google.maps.DirectionsService();

//     //                 directionsService.route(
//     //                     {
//     //                         origin: new window.google.maps.LatLng(filteredLocations[i].lat, filteredLocations[i].lng),
//     //                         destination: new window.google.maps.LatLng(filteredLocations[i + 1].lat, filteredLocations[i + 1].lng),
//     //                         travelMode: window.google.maps.TravelMode.DRIVING,
//     //                     },
//     //                     (result, status) => {
//     //                         if (status === window.google.maps.DirectionsStatus.OK) {
//     //                             newPolylines.push(
//     //                                 <Polyline
//     //                                     key={`polyline_${i}`}
//     //                                     path={result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }))}
//     //                                     options={{
//     //                                         strokeColor: "#FF0000", // Red color
//     //                                         strokeOpacity: 1,
//     //                                         strokeWeight: 2,
//     //                                     }}
//     //                                 />
//     //                             );
//     //                             setPolylines([...newPolylines]); // Update state with new polylines
//     //                         } else {
//     //                             console.error(`Error fetching directions: ${status}`);
//     //                         }
//     //                     }
//     //                 );
//     //             }

//     //             // Center map on the first marker
//     //             if (map) {
//     //                 map.panTo({ lat: filteredLocations[0].lat, lng: filteredLocations[0].lng });
//     //             }
//     //         } else {
//     //             setMarkers([]); // Clear markers if no locations for the selected date
//     //             setPolylines([]); // Clear polylines if no locations for the selected date
//     //         }
//     //     }
//     // }, [isLoaded, searchResults, selectedDate, map]);



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

//     const uniqueDates = [...new Set(searchResults.map(geo => geo.created_date.split('T')[0]))];
//     const buttonStyles = {
//         color: '#fff',
//         backgroundColor: '#510bc4',
//         backgroundImage: 'none',
//         borderColor: '#4c0ab8',
//     };

//     const page_group = localStorage.getItem('pageGroup');

//     const [showFromDate, setShowFromDate] = useState('');
//     const [showToDate, setShowToDate] = useState('');

//     const handleDateChangess = (event) => {
//         const selectedDate = new Date(event.target.value);
//         const day = String(selectedDate.getDate()).padStart(2, '0');
//         const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
//         const year = String(selectedDate.getFullYear()); // Get last two digits of the year
//         const formattedDate = `${day}-${month}-${year}`;
//         setShowFromDate(formattedDate);
//         setFromDate(selectedDate);
//     };

//     // Open date picker when text input is clicked
//     const handleTextInputClick = () => {
//         document.getElementById('dateInput').showPicker();
//     };

//     const handleDateChangesss = (event) => {
//         const selectedDate = new Date(event.target.value);
//         const day = String(selectedDate.getDate()).padStart(2, '0');
//         const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
//         const year = String(selectedDate.getFullYear()); // Get last two digits of the year
//         const formattedDate = `${day}-${month}-${year}`;
//         setShowToDate(formattedDate);
//         setToDate(selectedDate);
//     };

//     // Open date picker when text input is clicked
//     const handleTextInputClicks = () => {
//         document.getElementById('dateInputTo').showPicker();
//     };

//     const period_search = () => {
//         setLoading(true);
//         axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/location/location_search`, {
//             selectedEmployeeId,
//             fromDate,
//             toDate
//         })
//             .then(response => {
//                 const results = response.data.results;
//                 setSearchResults(results);
//                 setError(null);
//                 setLoading(false);
//                 if (results.length === 0) {
//                     alert('Nothing found!');
//                 } else {
//                     // Set the first date by default
//                     const firstDate = results[0].created_date.split('T')[0];
//                     setSelectedDate(firstDate);
//                 }
//             })
//             .catch(error => {
//                 setError("An error occurred during search.", error);
//                 setSearchResults([]);
//                 setLoading(false);
//             });
//     };

//     const formatDate = (date) => {
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = String(date.getFullYear());
//         return `${day}-${month}-${year}`;
//     };

//     useEffect(() => {
//         const currentDate = new Date();
//         setFromDate(currentDate);
//         setToDate(currentDate);
//         setShowFromDate(formatDate(currentDate));
//         setShowToDate(formatDate(currentDate));
//     }, []);

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

//                                                 <div className="form-group row student">
//                                                     <label htmlFor="fromDate" className="col-form-label col-md-2"><strong>Start Date:</strong></label>
//                                                     <div className="col-md-4">
//                                                         <input
//                                                             type="text"
//                                                             readOnly
//                                                             value={showFromDate}
//                                                             onClick={handleTextInputClick}
//                                                             placeholder="dd-mm-yy"
//                                                             className="form-control"
//                                                             style={{ display: 'inline-block' }}
//                                                         />
//                                                         <input
//                                                             type="date"
//                                                             id="dateInput"
//                                                             onChange={handleDateChangess}
//                                                             style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
//                                                         />
//                                                     </div>

//                                                     <label htmlFor="toDate" className="col-form-label col-md-2"><strong>End Date:</strong></label>
//                                                     <div className="col-md-4">
//                                                         <input
//                                                             type="text"
//                                                             readOnly
//                                                             value={showToDate}
//                                                             onClick={handleTextInputClicks}
//                                                             placeholder="dd-mm-yy"
//                                                             className="form-control"
//                                                             style={{ display: 'inline-block' }}
//                                                         />
//                                                         <input
//                                                             type="date"
//                                                             id="dateInputTo"
//                                                             onChange={handleDateChangesss}
//                                                             style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 <div className="form-group row">
//                                                     <div className="offset-md-2 col-md-10 float-left">
//                                                         <input
//                                                             type="button"
//                                                             name="search"
//                                                             className="btn btn-sm btn-info search_btn mr-2"
//                                                             value="Search"
//                                                             onClick={period_search}
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
//                 <ul class="list-group d-flex flex-column col-md-3 mt-2 ml-4">
//                     {uniqueDates.map((date, index) => (


//                         <li className="btn btn-sm btn-info my-1"
//                             key={index}
//                             onClick={() => handleDateButtonClick(date)} class="list-group-item"> {date}</li>
//                     ))}


//                 </ul>

//                 <div style={{ width: '100%', height: '100vh' }}>

//                     {searchResults.length > 0 ? (
//                         <>
//                             <div class="alert alert-warning mb-0 mb-2 text-danger font-weight-bold" role="alert">
//                                 <p>Search Geo Location From {showFromDate} To {showToDate}</p>
//                                 <p>Selected Date In Geo Location {selectedDate}</p>
//                                 <p>Total Distance: {totalDistance} Meter or {totalDistance / 1000} KM</p>
//                             </div>

//                             <GoogleMap
//                                 mapContainerStyle={{ width: '100%', height: '100%' }}
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

// export default GoogleMaps;
'use client' 
 //ismile;
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const GoogleMaps = () => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
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
                                                    <div className="form-group row student">
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
                                                    </div>

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


export default GoogleMaps;



















