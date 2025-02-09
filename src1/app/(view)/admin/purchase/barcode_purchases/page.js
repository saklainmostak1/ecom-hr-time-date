// 'use client' 
 //ismile
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import React, { useState, useRef } from 'react';
// import Barcode from 'react-barcode';
// import { ReactBarcode } from 'react-jsbarcode';
// import { useReactToPrint } from 'react-to-print';
// import './barcode.css'


// const BarCodePurchases = () => {

//     const [product_id, setProduct_id] = useState('');
//     const [quantity, setQuantity] = useState(''); // Default to 1 to avoid zero

//     const { data: products = [], isLoading } = useQuery({
//         queryKey: ['products'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const productData = products?.find(product => product?.id == product_id);
//     const printRef = useRef();



//     const handlePrint = () => {
//         if (!product_id || product_id === '') {
//             alert('Select a product');
//             return;
//         }
//         if (!quantity || quantity === '') {
//             alert('Enter Quantity');
//             return;
//         }

//         const selectedLayout = document.getElementById('print_layout').value;
//         const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

//         const selectedPrintSize = document.getElementById('print_size').value;
//         const selectedZoom = document.querySelector('.zoom_size').value;

//         // Convert zoom value to a numeric multiplier
//         let zoomMultiplier = 100; // Default zoom multiplier
//         if (selectedZoom !== '') {
//             zoomMultiplier = parseFloat(selectedZoom) / 100;
//         }
//         // Log to debug the zoom multiplier
//         console.log('Zoom Multiplier:', zoomMultiplier);

//         // Set the page dimensions based on the selected print size
//         let pageWidth, pageHeight;
//         switch (selectedPrintSize) {
//             case 'A4':
//                 pageWidth = 210 * zoomMultiplier;
//                 pageHeight = 297 * zoomMultiplier;
//                 break;
//             case 'A3':
//                 pageWidth = 297 * zoomMultiplier;
//                 pageHeight = 420 * zoomMultiplier;
//                 break;
//             case 'legal':
//                 pageWidth = 216 * zoomMultiplier; // Width for Legal size
//                 pageHeight = 356 * zoomMultiplier; // Height for Legal size
//                 break;
//             default:
//                 // Default to A4 size
//                 pageWidth = 210 * zoomMultiplier;
//                 pageHeight = 297 * zoomMultiplier;
//                 break;
//         }

//         // Get the selected font size value
//         const selectedFontSize = document.querySelector('.font_size').value;

//         // Get the numeric part of the selected font size value
//         const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

//         const pageSize = selectedPrintSize || 'A4';
//         const pageOrientation = orientation || 'portrait';

//         // Open a new tab
//         const printWindow = window.open('', '_blank');

//         // Set the document content to the print view
//         const printContent = printRef.current.innerHTML;

//         printWindow.document.open();
//         printWindow.document.write(`
//             <html>
//                 <head>
//                     <title>Print Barcode</title>
//                     <style>
//                     @page{
//                             size: ${pageSize} ${pageOrientation}; /* This sets the page size to A4 and orientation to Portrait */
//                         }
//                         * { 

//                             font-family: 'Nikosh', sans-serif !important;
//                         }
//                         body {
//                             font-family: Arial, sans-serif;
//                         }

//                         .barcode-container {
//                             font-size: ${`${fontSize}px !important` || '10px'};
//                             display: inline-block;
//                             width:150px;
//                             border: 1px dashed  #E6E6E7; /* Dashed border */     
//                         }
//                     </style>
//                 </head>
//                 <body style='width: 21cm; height: 29.7cm'>
//                     ${printContent}
//                 </body>
//             </html>
//         `);

//         printWindow.document.close();
//         printWindow.onload = () => {
//             printWindow.print();
//         };
//     };



//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card mb-4'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Barcode</h5>
//                                 </div>
//                                 <div className="card-body">
//                                     {/* <form > */}
//                                     <div className="col-md-10 offset-md-1">

//                                         <div className="form-group row">

//                                             <label className="col-form-label col-md-2"><strong>Product:</strong></label>
//                                             <div className="col-md-4">
//                                                 <select
//                                                     value={product_id} onChange={(e) => setProduct_id(e.target.value)}
//                                                     name="product_id"
//                                                     className="form-control form-control-sm integer_no_zero"
//                                                 >
//                                                     <option value="">Select Product</option>
//                                                     {
//                                                         products.map(sta =>
//                                                             <>

//                                                                 <option value={sta.id}>{sta.product_name}</option>
//                                                             </>

//                                                         )
//                                                     }
//                                                 </select>
//                                             </div>
//                                             <label className="col-form-label col-md-2"><strong>Quantity:</strong></label>
//                                             <div className="col-md-4">
//                                                 <input type="number" name="quantity"
//                                                     value={quantity}

//                                                     onChange={(e) => setQuantity(Number(e.target.value))}

//                                                     class="form-control form-control-sm  required "
//                                                     placeholder='Enter  Quantity'
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div class="form-group row student">

//                                             <label class="col-form-label font-weight-bold col-md-2">Print/PDF Properties:</label>
//                                             <div class="col-md-10">
//                                                 <div class="input-group ">
//                                                     <select name="print_size" class="form-control form-control-sm  trim integer_no_zero print_size" id="print_size">
//                                                         <option value="legal">legal </option>
//                                                         <option value="A4">A4 </option>
//                                                         <option value="A3">A3 </option>
//                                                         <option value="">Browser/Portrait(PDF) </option>
//                                                     </select>
//                                                     <select name="print_layout" class="form-control form-control-sm  trim integer_no_zero print_layout" id="print_layout">

//                                                         <option value="landscape">Landscape</option>
//                                                         <option value="portrait">Portrait</option>
//                                                         <option value="">Browser/Portrait(PDF) </option>
//                                                     </select>
//                                                     <select class=" form-control form-control-sm   integer_no_zero student_type font_size">
//                                                         <option value="font-10">Font Standard</option>
//                                                         <option value="font-8">Font Small</option>

//                                                     </select>
//                                                     <select name="zoom_size" class="form-control form-control-sm  trim integer_no_zero zoom_size" id="zoom_size">
//                                                         <option value="120%">Browser Zoom</option>
//                                                         <option value="5%">5% Zoom</option>
//                                                         <option value="10%">10% Zoom</option>
//                                                         <option value="15%">15% Zoom</option>
//                                                         <option value="20%">20% Zoom</option>
//                                                         <option value="25%">25% Zoom</option>
//                                                         <option value="30%">30% Zoom</option>
//                                                         <option value="35%">35% Zoom</option>
//                                                         <option value="40%">40% Zoom</option>
//                                                         <option value="45%">45% Zoom</option>
//                                                         <option value="50%">50% Zoom</option>
//                                                         <option value="55%">55% Zoom</option>
//                                                         <option value="60%">60% Zoom</option>
//                                                         <option value="65%">65% Zoom</option>
//                                                         <option value="70%">70% Zoom</option>
//                                                         <option value="75%">75% Zoom</option>
//                                                         <option value="80%">80% Zoom</option>
//                                                         <option value="85%">85% Zoom</option>
//                                                         <option value="90%">90% Zoom</option>
//                                                         <option value="95%">95% Zoom</option>
//                                                         <option value="100%" selected="">100% Zoom</option>

//                                                     </select>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                     </div>
//                                     <div className="form-group row">
//                                         <div className="offset-md-2 col-md-8 float-left">
//                                             <input type="button" name="Print" className="btn btn-sm btn-info" value="Print"
//                                                 onClick={handlePrint}
//                                             />
//                                             <input

//                                                 type="button" name="summary" class="btn btn-sm btn-secondary print_summary ml-2" value="Download PDF" />

//                                         </div>
//                                     </div>
//                                     {/* </form> */}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {productData && (
//                         <div className="card d-none" >
//                             <div className="card-body">
//                                 <div className="your-print-content d-flex flex-wrap" ref={printRef}>
//                                     {[...Array(quantity)].map((_, index) => (
//                                         <div key={index} className="barcode-container">
//                                              <ReactBarcode   value={productData.formatted_barcode} options={{ format: `code39`,
//                     lineColor: "#000",
//                     width: 0.6,
//                     height: 50,
//                     displayValue: true,
//                     fontSize: 12, }} renderer="svg" /> 

//                                             {/* <Barcode
//                                                 value={productData.formatted_barcode}
//                                                 format="CODE39"
//                                                 width={0.6}
//                                                 height={50}
//                                                 fontSize={15}
//                                                 displayValue={true}
//                                             /> */}

//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>

//                     )}
//                     <div className='card'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">List Product Barcode</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/purchase/purchase_create?page_group`} className="btn btn-sm btn-info">Purchase Create</Link>
//                                     </div>
//                                 </div>

//                                 {isLoading ? (
//                                     <div className='text-center'>
//                                         <div className='text-center text-dark'>
//                                             <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
//                                         </div>
//                                     </div>
//                                 ) : (



//                                     <div class="card-body">
//                                         <div className='table-responsive'>

//                                             <table className="table  table-bordered table-hover table-striped table-sm">
//                                                 <thead>

//                                                     <tr>
//                                                         <th>

//                                                             SL No.
//                                                         </th>

//                                                         <th>
//                                                             Product Name
//                                                         </th>

//                                                         <th>
//                                                             Barcode
//                                                         </th>
//                                                         <th>
//                                                             Quantity
//                                                         </th>

//                                                         <th>
//                                                             Action
//                                                         </th>
//                                                     </tr>

//                                                 </thead>

//                                                 <tbody>
//                                                     {isLoading ? <div className='text-center'>
//                                                         <div className='  text-center text-dark'
//                                                         >
//                                                             <FontAwesomeIcon style={{
//                                                                 height: '33px',
//                                                                 width: '33px',
//                                                             }} icon={faSpinner} spin />
//                                                         </div>
//                                                     </div>
//                                                         :
//                                                         products.map((product, i) => (
//                                                             <tr key={product.id}>
//                                                                 <td>    {i + 1}</td>
//                                                                 <td>    {product.product_name}</td>
//                                                                 <td>     <div class="barcode-container">

//                                                                     {/* <ReactBarcode

//                                                                     value={product.formatted_barcode} options={{ format: 'code39' }} renderer="svg" /> */}

//                                                                     <Barcode
//                                                                         value={product.formatted_barcode}
//                                                                         format="CODE39"
//                                                                         width={0.6}
//                                                                         height={50}
//                                                                         displayValue={true}
//                                                                     />
//                                                                     {/* src="data:image/jpeg;base64," */}
//                                                                     {/* <img src={`https://barcode.tec-it.com/barcode.ashx?data=${product.barcode}&code=Code128&translate-esc=true`} alt={`Barcode ${i + 1}`} onload="checkImagesLoaded()" /> */}
//                                                                 </div></td>

//                                                                 <td>    {product.product_quantity}</td>
//                                                                 <td> </td>



//                                                             </tr>
//                                                         )

//                                                         )



//                                                     }
//                                                 </tbody>

//                                             </table>

//                                         </div>
//                                     </div>

//                                 )}

//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BarCodePurchases;







// const barcode_print = async () => {
//     try {

//         if (!product_id && product_id === '') {
//             alert('Select a product')
//             return
//         }
//         if (!quantity && quantity === '') {
//             alert('Enter Quantity')
//             return
//         }



//         const selectedLayout = document.getElementById('print_layout').value;
//         const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

//         const selectedPrintSize = document.getElementById('print_size').value;
//         const selectedZoom = document.querySelector('.zoom_size').value;

//         // Convert zoom value to a numeric multiplier
//         let zoomMultiplier = 100; // Default zoom multiplier
//         if (selectedZoom !== '') {
//             zoomMultiplier = parseFloat(selectedZoom) / 100;
//         }
//         // Set the page dimensions based on the selected print size
//         let pageWidth, pageHeight;
//         switch (selectedPrintSize) {
//             case 'A4':
//                 pageWidth = 210 * zoomMultiplier;
//                 pageHeight = 297 * zoomMultiplier;
//                 break;
//             case 'A3':
//                 pageWidth = 297 * zoomMultiplier;
//                 pageHeight = 420 * zoomMultiplier;
//                 break;
//             case 'legal':
//                 pageWidth = 216 * zoomMultiplier; // Width for Legal size
//                 pageHeight = 356 * zoomMultiplier; // Height for Legal size
//                 break;
//             default:
//                 // Default to A4 size
//                 pageWidth = 210 * zoomMultiplier;
//                 pageHeight = 297 * zoomMultiplier;
//                 break;
//         }



//         // Get the selected font size value
//         const selectedFontSize = document.querySelector('.font_size').value;

//         // Get the numeric part of the selected font size value
//         const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;



//         const printWindow = window.open('', '_blank');
//         printWindow.document.open();

//         const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/barcode_print`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 productData, product_id, quantity, products, orientation, fontSize, selectedPrintSize,
//             }),
//         });

//         const htmlText = await html.text();

//         printWindow.document.write(htmlText);
//         printWindow.document.close(); // Ensure the document is completely loaded before printing
//         printWindow.focus();
//     } catch (error) {
//         console.error('Error generating print view:', error.message);
//     }
// };

// // console.log(productData)

// const barcode_pdf_download = async () => {

//     if (!product_id && product_id === '') {
//         alert('Select a product')
//         return
//     }
//     if (!quantity && quantity === '') {
//         alert('Enter Quantity')
//         return
//     }
//     const selectedLayout = document.getElementById('print_layout').value;
//     const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

//     const selectedPrintSize = document.getElementById('print_size').value;
//     const selectedZoom = document.querySelector('.zoom_size').value;

//     // Convert zoom value to a numeric multiplier
//     let zoomMultiplier = 100; // Default zoom multiplier
//     if (selectedZoom !== '') {
//         zoomMultiplier = parseFloat(selectedZoom) / 100;
//     }
//     // Set the page dimensions based on the selected print size
//     let pageWidth, pageHeight;
//     switch (selectedPrintSize) {
//         case 'A4':
//             pageWidth = 210 * zoomMultiplier;
//             pageHeight = 297 * zoomMultiplier;
//             break;
//         case 'A3':
//             pageWidth = 297 * zoomMultiplier;
//             pageHeight = 420 * zoomMultiplier;
//             break;
//         case 'legal':
//             pageWidth = 216 * zoomMultiplier; // Width for Legal size
//             pageHeight = 356 * zoomMultiplier; // Height for Legal size
//             break;
//         default:
//             // Default to A4 size
//             pageWidth = 210 * zoomMultiplier;
//             pageHeight = 297 * zoomMultiplier;
//             break;
//     }



//     // Get the selected font size value
//     const selectedFontSize = document.querySelector('.font_size').value;

//     // Get the numeric part of the selected font size value
//     const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

//     try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/barcode_pdf`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 productData, product_id, quantity, products, orientation, fontSize, selectedPrintSize,
//             }),

//             // If you need to send any data with the request, you can include it here
//             // body: JSON.stringify({ /* your data */ }),
//         });

//         if (!response.ok) {
//             throw new Error('Error generating PDF In Period');
//         }


//         // If you want to download the PDF automatically
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(new Blob([blob]));
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'purchase_pdf.pdf';
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//     } catch (error) {
//         setErrorr(error.message);
//     } finally {
//         // setLoading(false);
//     }
// };

'use client' 
 //ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import Barcode from 'react-barcode';
import { ReactBarcode } from 'react-jsbarcode';
import './barcode.css'


const BarCodePurchases = () => {

    const [product_id, setProduct_id] = useState('');
    const [quantity, setQuantity] = useState(''); // Default to 1 to avoid zero
    const [name, setName] = useState(''); // Default to 1 to avoid zero

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_list`);
            const data = await res.json();
            return data;
        }
    });

    const productData = products?.find(product => product?.id == product_id);
    const printRef = useRef();



    const handlePrint = () => {
        if (!product_id || product_id === '') {
            alert('Select a product');
            return;
        }
        if (!quantity || quantity === '') {
            alert('Enter Quantity');
            return;
        }

        const selectedLayout = document.getElementById('print_layout').value;
        const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

        const selectedPrintSize = document.getElementById('print_size').value;
        const selectedZoom = document.querySelector('.zoom_size').value;

        // Convert zoom value to a numeric multiplier
        let zoomMultiplier = 100; // Default zoom multiplier
        if (selectedZoom !== '') {
            zoomMultiplier = parseFloat(selectedZoom) / 100;
        }
        // Log to debug the zoom multiplier
        console.log('Zoom Multiplier:', zoomMultiplier);

        // Set the page dimensions based on the selected print size
        let pageWidth, pageHeight;
        switch (selectedPrintSize) {
            case 'A4':
                pageWidth = 210 * zoomMultiplier;
                pageHeight = 297 * zoomMultiplier;
                break;
            case 'A3':
                pageWidth = 297 * zoomMultiplier;
                pageHeight = 420 * zoomMultiplier;
                break;
            case 'legal':
                pageWidth = 216 * zoomMultiplier; // Width for Legal size
                pageHeight = 356 * zoomMultiplier; // Height for Legal size
                break;
            default:
                // Default to A4 size
                pageWidth = 210 * zoomMultiplier;
                pageHeight = 297 * zoomMultiplier;
                break;
        }

        // Get the selected font size value
        const selectedFontSize = document.querySelector('.font_size').value;

        // Get the numeric part of the selected font size value
        const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

        const pageSize = selectedPrintSize || 'A4';
        const pageOrientation = orientation || 'portrait';

        // Open a new tab
        const printWindow = window.open('', '_blank');

        // Set the document content to the print view
        const printContent = printRef.current.innerHTML;

        printWindow.document.open();
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Barcode</title>
                    <style>
                    @page{
                            size: ${pageSize} ${pageOrientation}; /* This sets the page size to A4 and orientation to Portrait */
                        }
                        * { 
                            
                            font-family: 'Nikosh', sans-serif !important;
                        }
                        body {
                            font-family: Arial, sans-serif;
                        }
                        
                        .barcode-container {
                          font-size: ${`${fontSize}px !important` || '10px'};
                             display: inline-block;
                             border: 1px dashed  #E6E6E7; /* Dashed border */       
                                
                        }
                    </style>
                </head>
                <body style='width: 21cm; height: 29.7cm'>
                    ${printContent}
                </body>
            </html>
        `);



        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.print();
        };
    };


    const [selectedValues, setSelectedValues] = useState('code39');

    const handleChanges = (event) => {
        setSelectedValues(event.target.value);
    };
    console.log(selectedValues)
    const [selectedValue, setSelectedValue] = useState('with_name');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };


    const handleDownloadPDF = async () => {
        if (!product_id || product_id === '') {
            alert('Select a product');
            return;
        }
        if (!quantity || quantity === '') {
            alert('Enter Quantity');
            return;
        }

        const selectedLayout = document.getElementById('print_layout').value;
        const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

        const selectedPrintSize = document.getElementById('print_size').value;
        const selectedZoom = document.querySelector('.zoom_size').value;

        // Convert zoom value to a numeric multiplier
        let zoomMultiplier = 100; // Default zoom multiplier
        if (selectedZoom !== '') {
            zoomMultiplier = parseFloat(selectedZoom) / 100;
        }

        // Set the page dimensions based on the selected print size
        let pageWidth, pageHeight;
        switch (selectedPrintSize) {
            case 'A4':
                pageWidth = 210 * zoomMultiplier;
                pageHeight = 297 * zoomMultiplier;
                break;
            case 'A3':
                pageWidth = 297 * zoomMultiplier;
                pageHeight = 420 * zoomMultiplier;
                break;
            case 'legal':
                pageWidth = 216 * zoomMultiplier; // Width for Legal size
                pageHeight = 356 * zoomMultiplier; // Height for Legal size
                break;
            default:
                pageWidth = 210 * zoomMultiplier;
                pageHeight = 297 * zoomMultiplier;
                break;
        }

        // Get the selected font size value
        const selectedFontSize = document.querySelector('.font_size').value;

        // Get the numeric part of the selected font size value
        const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

        // Get the content to print (from ref or directly)
        const printContent = printRef.current.innerHTML;

        // Prepare HTML content dynamically
        const htmlContent = `
            <html>
                <head>
                    <title>Print Barcode</title>
                    <style>
                        @page {
                            size: ${selectedPrintSize} ${orientation}; /* This sets the page size and orientation */
                        }
                        * { 
                            font-family: 'Nikosh', sans-serif !important;
                        }
                        body {
                            font-family: Arial, sans-serif;
                        }
                        .barcode-container {
                            font-size: ${`${fontSize}px !important` || '10px'};
                            display: inline-block;
                            border: 1px dashed #E6E6E7; /* Dashed border */
                        }
                    </style>
                </head>
                <body style="width:21cm; height: 29.7cm;">
                    ${printContent}
                </body>
            </html>
        `;

        // Send the content to the server to generate the PDF
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/barcode_pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id, quantity, products, selectedPrintSize, orientation, fontSize, selectedValues, selectedValue
                // htmlContent,
                // options: {
                //     pageSize: selectedPrintSize,
                //     orientation,
                //     fontSize,
                //     zoomMultiplier,
                // }
            }),
        });

        // Trigger download of PDF once the response is received
        if (response.ok) {
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'barcode.pdf';
            link.click();
        } else {
            alert('Error generating PDF');
        }
    };

    // let truncatedBarcode = originalBarcode.length > 13 ? originalBarcode.slice(0, 13) : originalBarcode;
    // let truncatedBarcodes = productData.formatted_barcode.length > 13 ? productData.formatted_barcode.slice(0, 13) : originalBarcode;




    useEffect(() => {
        if (productData && printRef.current) {
            const barcodeElements = printRef.current.querySelectorAll('.barcode-svg');
            
            let formattedBarcode = productData.formatted_barcode.length > 13
                ? productData.formatted_barcode.slice(0, 13)
                : productData.formatted_barcode;

            barcodeElements.forEach((element) => {

                JsBarcode(element, productData.formatted_barcode, {
                    // text: formattedBarcode,
                    format: `${selectedValues}`,
                    lineColor: "#000",
                    width: 0.6,
                    height: 50,
                    displayValue: true,
                    fontSize: 12,
                    margin: 5,

                });
            });
        }
    }, [productData, quantity, selectedValues]);


    console.log(productData)

    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Barcode</h5>
                                </div>
                                <div className="card-body">
                                    {/* <form > */}
                                    <div className="col-md-10 offset-md-1">

                                        <div className="form-group row">

                                            <label className="col-form-label col-md-2"><strong>Product:</strong></label>
                                            <div className="col-md-4">
                                                <select
                                                    value={product_id} onChange={(e) => setProduct_id(e.target.value)}
                                                    name="product_id"
                                                    className="form-control form-control-sm integer_no_zero"
                                                >
                                                    <option value="">Select Product</option>
                                                    {
                                                        products.map(sta =>
                                                            <>

                                                                <option value={sta.id}>{sta.product_name}</option>
                                                            </>

                                                        )
                                                    }
                                                </select>
                                            </div>
                                            <label className="col-form-label col-md-2"><strong>Quantity:</strong></label>
                                            <div className="col-md-4">
                                                <input type="number" name="quantity"
                                                    value={quantity}

                                                    onChange={(e) => setQuantity(Number(e.target.value))}

                                                    class="form-control form-control-sm  required "
                                                    placeholder='Enter  Quantity'
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">

                                            <label className="col-form-label col-md-2"><strong>Name:</strong></label>
                                            <div className="col-md-4">
                                                <select
                                                    onChange={handleChange} value={selectedValue}
                                                    name="name"
                                                    className="form-control form-control-sm integer_no_zero"
                                                >

                                                    <option value="with_name">With Name</option>
                                                    <option value="with_out_name">With Out Name</option>

                                                </select>
                                            </div>
                                            <label className="col-form-label col-md-2"><strong>Barcdoe:</strong></label>
                                            <div className="col-md-4">
                                                <select
                                                    onChange={handleChanges} value={selectedValues}
                                                    name="name"
                                                    className="form-control form-control-sm integer_no_zero"
                                                >

                                                    <option value="code39">CODE39</option>
                                                    <option value="code128">CODE128</option>
                                                    {/* <option value="itf14">ITF</option> */}
                                                    <option value="msi">MSI</option>
                                                    <option value="codabar">Codabar</option>

                                                </select>
                                            </div>

                                        </div>
                                        <div class="form-group row student">

                                            <label class="col-form-label font-weight-bold col-md-2">Print/PDF Properties:</label>
                                            <div class="col-md-10">
                                                <div class="input-group ">
                                                    <select name="print_size" class="form-control form-control-sm  trim integer_no_zero print_size" id="print_size">
                                                        <option value="legal">legal </option>
                                                        <option value="A4">A4 </option>
                                                        <option value="A3">A3 </option>
                                                        <option value="">Browser/Portrait(PDF) </option>
                                                    </select>
                                                    <select name="print_layout" class="form-control form-control-sm  trim integer_no_zero print_layout" id="print_layout">

                                                        <option value="landscape">Landscape</option>
                                                        <option value="portrait">Portrait</option>
                                                        <option value="">Browser/Portrait(PDF) </option>
                                                    </select>
                                                    <select class=" form-control form-control-sm   integer_no_zero student_type font_size">
                                                        <option value="font-9">Font Standard</option>
                                                        <option value="font-8">Font Small</option>

                                                    </select>
                                                    <select name="zoom_size" class="form-control form-control-sm  trim integer_no_zero zoom_size" id="zoom_size">
                                                        <option value="120%">Browser Zoom</option>
                                                        <option value="5%">5% Zoom</option>
                                                        <option value="10%">10% Zoom</option>
                                                        <option value="15%">15% Zoom</option>
                                                        <option value="20%">20% Zoom</option>
                                                        <option value="25%">25% Zoom</option>
                                                        <option value="30%">30% Zoom</option>
                                                        <option value="35%">35% Zoom</option>
                                                        <option value="40%">40% Zoom</option>
                                                        <option value="45%">45% Zoom</option>
                                                        <option value="50%">50% Zoom</option>
                                                        <option value="55%">55% Zoom</option>
                                                        <option value="60%">60% Zoom</option>
                                                        <option value="65%">65% Zoom</option>
                                                        <option value="70%">70% Zoom</option>
                                                        <option value="75%">75% Zoom</option>
                                                        <option value="80%">80% Zoom</option>
                                                        <option value="85%">85% Zoom</option>
                                                        <option value="90%">90% Zoom</option>
                                                        <option value="95%">95% Zoom</option>
                                                        <option value="100%" selected="">100% Zoom</option>

                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="form-group row">
                                        <div className="offset-md-2 col-md-8 float-left">
                                            <input type="button" name="Print" className="btn btn-sm btn-info" value="Print"
                                                onClick={handlePrint}
                                            />
                                            <input
                                                onClick={handleDownloadPDF}
                                                type="button" name="summary" class="btn btn-sm btn-secondary print_summary ml-2" value="Download PDF" />

                                        </div>
                                    </div>
                                    {/* </form> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    {productData && (
                        <div className="card d-none" >
                            <div className="card-body">
                                <div className="your-print-content d-flex flex-wrap" ref={printRef}>
                                    {[...Array(quantity)].map((_, index) => (

                                        <div key={index} className="barcode-container text-center" style={{

                                            textAlign: 'center',
                                        }}>

                                            {selectedValue === 'with_name' && (
                                                <p className='name' style={{ marginBottom: '-2px', textAlign: 'center', width: '150px' }}>
                                                    {productData.product_name}
                                                </p>
                                            )}
                                            <svg className="barcode-svg" />

                                            {/* <ReactBarcode value={productData.formatted_barcode} options={{
                                                format: `code39`,
                                                lineColor: "#000",
                                                width: 0.5,
                                                height: 50,
                                                displayValue: true,
                                                fontSize: 12,
                                            }} renderer="svg" /> */}


                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* <div className='card'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">List Product Barcode</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/purchase/purchase_create?page_group`} className="btn btn-sm btn-info">Purchase Create</Link>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className='text-center'>
                                        <div className='text-center text-dark'>
                                            <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
                                        </div>
                                    </div>
                                ) : (

                                    <div class="card-body">
                                        <div className='table-responsive'>

                                            <table className="table  table-bordered table-hover table-striped table-sm">
                                                <thead>

                                                    <tr>
                                                        <th>

                                                            SL No.
                                                        </th>

                                                        <th>
                                                            Product Name
                                                        </th>

                                                        <th>
                                                            Barcode
                                                        </th>
                                                        <th>
                                                            Quantity
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
                                                        products.map((product, i) => (
                                                            <tr key={product.id}>
                                                                <td>    {i + 1}</td>
                                                                <td>    {product.product_name}</td>
                                                                <td>     <div class="barcode-container">

                                                                    <ReactBarcode value={product.formatted_barcode} options={{
                                                                        format: 'code39',
                                                                        width: 0.7,
                                                                        height: 50
                                                                    }} renderer="svg" />

                                                                </div></td>

                                                                <td>    {product.product_quantity}</td>
                                                                <td> </td>
                                                            </tr>
                                                        )

                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default BarCodePurchases;



// 'use client' 
 //ismile;
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import React, { useState, useRef } from 'react';
// import Barcode from 'react-barcode';

// const BarCodePurchases = () => {
//     const [product_id, setProduct_id] = useState('');
//     const [quantity, setQuantity] = useState(''); // Default to 1 to avoid zero

//     const { data: products = [], isLoading } = useQuery({
//         queryKey: ['products'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_list`);
//             const data = await res.json();
//             return data;
//         }
//     });

//     const productData = products?.find(product => product?.id == product_id);
//     const printRef = useRef();

//     const handlePrint = () => {
//         if (quantity > 0 && productData) {
//             window.print();
//         } else {
//             alert("Please select a valid product and quantity.");
//         }
//     };


//     const barcode_print = async () => {
//         try {

//             const printWindow = window.open('', '_blank');
//             printWindow.document.open();

//             const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/barcode_print`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     productData, product_id, quantity, products
//                 }),
//             });

//             const htmlText = await html.text();

//             printWindow.document.write(htmlText);
//             printWindow.document.close(); // Ensure the document is completely loaded before printing
//             printWindow.focus();
//         } catch (error) {
//             console.error('Error generating print view:', error.message);
//         }
//     };

//     console.log(productData)

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className='col-12 p-4'>
//                     <div className='card mb-4'>
//                         <div className="body-content bg-light">
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Purchase Search</h5>
//                                 </div>
//                                 <div className="card-body">
//                                     <form>
//                                         <div className="col-md-10 offset-md-1">
//                                             <div className="form-group row">
//                                                 <label className="col-form-label col-md-2"><strong>Product:</strong></label>
//                                                 <div className="col-md-4">
//                                                     <select
//                                                         value={product_id} onChange={(e) => setProduct_id(e.target.value)}
//                                                         name="product_id"
//                                                         className="form-control form-control-sm integer_no_zero"
//                                                     >
//                                                         <option value="">Select Product</option>
//                                                         {
//                                                             products.map(sta => (
//                                                                 <option key={sta.id} value={sta.id}>{sta.product_name}</option>
//                                                             ))
//                                                         }
//                                                     </select>
//                                                 </div>
//                                                 <label className="col-form-label col-md-2"><strong>Quantity:</strong></label>
//                                                 <div className="col-md-4">
//                                                     <input
//                                                         type="number"
//                                                         name="quantity"
//                                                         value={quantity}
//                                                         min="1"
//                                                         onChange={(e) => setQuantity(Number(e.target.value))}
//                                                         className="form-control form-control-sm required"
//                                                         placeholder="Enter Quantity"
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="form-group row">
//                                             <div className="offset-md-2 col-md-8 float-left">
//                                                 <button type="button" onClick={barcode_print} className="btn btn-sm btn-info">Print</button>
//                                                 <button type="button" className="btn btn-sm btn-secondary ml-2">Download PDF</button>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     {productData && (
//                         <div className="card" ref={printRef}>
//                             <div className="card-body">
//                                 <div className="d-flex flex-wrap">
//                                     {[...Array(quantity)].map((_, index) => (
//                                         <div key={index} className="barcode-container mb-2 mr-2">
//                                             <Barcode value={productData.barcode} />
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>

//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BarCodePurchases;
