// 'use client' 
//ismile
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';



// const PurchaseUpdate = ({ id }) => {

//     const [page_group, setPageGroup] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('pageGroup') || '';
//         }
//         return '';
//     });

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedUserId = localStorage.getItem('pageGroup');
//             setPageGroup(storedUserId);
//         }
//     }, []);


//     const [created, setCreated] = useState(() => {
//         if (typeof window !== 'undefined') {
//             return localStorage.getItem('userId') || '';
//         }
//         return '';
//     });

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const storedUserId = localStorage.getItem('userId');
//             setCreated(storedUserId);
//         }
//     }, []);

//     const [fromDate, setFromDate] = useState('');



//     const { data: products = [],
//     } = useQuery({
//         queryKey: ['products'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_list`)

//             const data = await res.json()
//             return data
//         }
//     })


//     const [assetInfo, setAssetInfo] = useState({
//         supplier_id: '', product_id: '', quantity: '', unit_id: '', purchase_price: '', sale_price: '', total_amount: '', discount: '', due: '', paid_amount: '', purchase_invoice: '', purchase_date: '', invoice_id: '', purchase_type: '', modified_by: created, item_name: '',
//         purchase_product_id: '',purchase_item_id: ''
//     });




//     const { data: purchaseProductSingle = [],
//     } = useQuery({
//         queryKey: ['purchaseProductSingle'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_list/${id}`)

//             const data = await res.json()
//             return data
//         }
//     })
//     console.log(purchaseProductSingle)

//     useEffect(() => {
//         const purchaseData = purchaseProductSingle[0] || {};

//         // Common fields
//         let updatedAssetInfo = {
//             supplier_id: purchaseData.supplier_id || '',
//             total_amount: purchaseData.total_amount || '',
//             discount: purchaseData.discount || '',
//             due: purchaseData.due || '',
//             paid_amount: purchaseData.paid_amount || '',
//             purchase_invoice: purchaseData.purchase_invoice || '',
//             purchase_date: purchaseData.purchase_date || '',
//             invoice_id: purchaseData.invoice_id || '',
//             purchase_type: purchaseData.purchase_type || '',
//             modified_by: created,
//         };

//         // Conditionally set fields based on purchase_type
//         if (purchaseData.purchase_type == 1) {
//             updatedAssetInfo = {
//                 ...updatedAssetInfo,
//                 purchase_product_id: purchaseData?.purchase_product[0]?.id || '',
//                 product_id: purchaseData?.purchase_product[0]?.product_id || '',
//                 quantity: purchaseData?.purchase_product[0]?.quantity || '',
//                 unit_id: purchaseData?.purchase_product[0]?.unit_id || '',
//                 purchase_price: purchaseData?.purchase_product[0]?.purchase_price || '',
//                 sale_price: purchaseData?.purchase_product[0]?.sale_price || ''
//             };
//         } else if (purchaseData.purchase_type == 2) {
//             updatedAssetInfo = {
//                 ...updatedAssetInfo,
//                 purchase_item_id: purchaseData?.purchase_item[0]?.id || '',
//                 item_name: purchaseData?.purchase_item[0]?.item_name || '',
//                 quantity: purchaseData?.purchase_item[0]?.quantity || '',
//                 unit_id: purchaseData?.purchase_item[0]?.unit_id || '',
//                 purchase_price: purchaseData?.purchase_item[0]?.purchase_price || '',
//                 sale_price: purchaseData?.purchase_item[0]?.sale_price || ''
//             };
//         }

//         setAssetInfo(updatedAssetInfo);
//     }, [purchaseProductSingle, created]);

//     console.log(assetInfo)

//     // const productPrice = products.find(product => product.id == assetInfo.product_id)

//     // console.log(productPrice.product_price)


//     // useEffect(() => {

//     //     setAssetInfo(prevState => ({
//     //         ...prevState,
//     //         purchase_price: parseFloat(productPrice?.product_price) * parseFloat(assetInfo?.quantity)
//     //     }));
//     // }, [productPrice?.product_price, assetInfo.quantity]);


//     // useEffect(() => {

//     //     setAssetInfo(prevState => ({
//     //         ...prevState,
//     //         total_amount: parseFloat(assetInfo.sale_price) - parseFloat(assetInfo.discount)
//     //     }));
//     // }, [assetInfo.sale_price, assetInfo.discount]);


//     useEffect(() => {

//         setAssetInfo(prevState => ({
//             ...prevState,
//             total_amount: parseFloat(assetInfo.sale_price) - parseFloat(assetInfo.discount)
//         }));
//     }, [assetInfo.sale_price, assetInfo.discount]);


//     useEffect(() => {

//         setAssetInfo(prevState => ({
//             ...prevState,
//             paid_amount: parseFloat(assetInfo.total_amount) - parseFloat(assetInfo.due)
//         }));
//     }, [assetInfo.total_amount, assetInfo.due]);




//     const [formattedDisplayDate, setFormattedDisplayDate] = useState('');


//     const handleDateSelection = (event) => {
//         const inputDate = event.target.value; // Directly get the value from the input

//         const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
//         const month = String(inputDate.split('-')[1]).padStart(2, '0');
//         const year = String(inputDate.split('-')[0]);
//         const formattedDate = `${day}-${month}-${year}`;
//         const formattedDatabaseDate = `${year}-${month}-${day}`;
//         setFromDate(formattedDate);
//         setAssetInfo(prevData => ({
//             ...prevData,
//             purchase_date: formattedDatabaseDate // Update the dob field in the state
//         }));
//         // if (formattedDatabaseDate) {
//         //     setPayment_date('')
//         // }
//     };

//     useEffect(() => {
//         const dob = assetInfo.purchase_date;
//         const formattedDate = dob?.split('T')[0];

//         if (formattedDate?.includes('-')) {
//             const [year, month, day] = formattedDate.split('-');
//             setFormattedDisplayDate(`${day}-${month}-${year}`);
//         } else {
//             console.log("Date format is incorrect:", formattedDate);
//         }
//     }, [assetInfo]);

//     const { data: supplier = [], } = useQuery({
//         queryKey: ['supplier'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/supplier/supplier_list`);
//             const data = await res.json();
//             // Filter out the brand with id 
//             // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
//             return data;
//         }
//     });




//     const { data: unit = [],
//     } = useQuery({
//         queryKey: ['unit'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/unit/unit_all`)

//             const data = await res.json()
//             return data
//         }
//     })



//     const [brandName, setBrandName] = useState('')
//     const [error, setError] = useState([]);
//     const [asset_type_id, setAsset_type_id] = useState('');
//     const [asset_cost, setAsset_cost] = useState('');
//     const [depreciation, setDepreciation] = useState('');
//     const [date, setDate] = useState('');

//     const brand_input_change = (event) => {
//         const name = event.target.name
//         const value = event.target.value
//         const attribute = { ...assetInfo }
//         attribute[name] = value
//         setAssetInfo(attribute)


//         const depreciation = attribute['depreciation'];
//         if (depreciation) {
//             setDepreciation(""); // Clear the error message
//         }



//     };

//     const router = useRouter()

//     const brand_update = (e) => {
//         e.preventDefault();

//         // if (!assetInfo.date) {
//         //     setDate('Please Select  a Date.');
//         //     return; // Prevent further execution
//         // }

//         // Retrieve the form's image value


//         // Make the fetch request ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_edit/:id

//         console.log(assetInfo)

//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_edit/${id}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(assetInfo)
//         })
//             .then(response => response.json())
//             .then(data => {
//                 console.log(data);
//                 if (data) {
//                     sessionStorage.setItem("message", "Data Update successfully!");
//                     router.push(`/Admin/purchase/purchase_all?page_group=${page_group}`);
//                 }
//             })
//             .catch(error => {
//                 console.error('Error updating brand:', error);
//             });
//     };




//     return (
//         // col-md-12
//         // <div class=" body-content bg-light">
//         <div class="container-fluid">
//             <div class=" row ">

//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div class=" border-primary shadow-sm border-0">
//                             <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
//                                 <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Update Purchase</h5>
//                                 <div class="card-title font-weight-bold mb-0 card-header-color float-right">
//                                     <Link href={`/Admin/purchase/purchase_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back to Purchase List</Link></div>
//                             </div>
//                             <form action="" onSubmit={brand_update}>
//                                 <div class="card-body">
//                                     <div class=" row no-gutters">
//                                         <div class="col-md-6">

//                                             <div class="form-group row">
//                                                 <label class="col-form-label col-md-3"><strong>Supplier Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                 <div class="col-md-8">
//                                                     <select
//                                                         value={assetInfo.supplier_id} onChange={brand_input_change}
//                                                         name='supplier_id'

//                                                         class="form-control form-control-sm " placeholder="Enter Role Name">
//                                                         <option value=''>Select Supplier Name</option>
//                                                         {
//                                                             supplier.map(sta =>
//                                                                 <>

//                                                                     <option value={sta.id}>{sta.name}</option>
//                                                                 </>

//                                                             )
//                                                         }
//                                                     </select>
//                                                     {
//                                                         asset_type_id && <p className='text-danger'>{asset_type_id}</p>
//                                                     }
//                                                 </div>
//                                             </div>


//                                             {
//                                                 assetInfo.purchase_type == 1 ?
//                                                     <>
//                                                         <div class="form-group row">
//                                                             <label class="col-form-label col-md-3"><strong>Product Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                             <div class="col-md-8">
//                                                                 <select
//                                                                     value={assetInfo.product_id} onChange={brand_input_change}
//                                                                     name='product_id'

//                                                                     class="form-control form-control-sm " placeholder="Enter Role Name">
//                                                                     <option value=''>Select A Product Name</option>
//                                                                     {
//                                                                         products.map(sta =>
//                                                                             <>

//                                                                                 <option value={sta.id}>{sta.product_name}</option>
//                                                                             </>

//                                                                         )
//                                                                     }
//                                                                 </select>

//                                                             </div>
//                                                         </div>


//                                                         <div class="form-group row">

//                                                             <label class="col-form-label col-md-3"><strong>Quantity<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                             <div class="col-md-8">

//                                                                 <input type="number" name="quantity" value={assetInfo.quantity} onChange={brand_input_change}
//                                                                     class="form-control form-control-sm  required "
//                                                                     placeholder='Enter Quantity'
//                                                                     maxLength={256}
//                                                                 />

//                                                             </div>
//                                                         </div>


//                                                         <div class="form-group row">
//                                                             <label class="col-form-label col-md-3"><strong>Unit<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                             <div class="col-md-8">


//                                                                 <select
//                                                                     value={assetInfo.unit_id} onChange={brand_input_change}
//                                                                     name='unit_id'

//                                                                     class="form-control form-control-sm " placeholder="Enter Role Name">
//                                                                     <option value=''>Select A Unit Name</option>
//                                                                     {
//                                                                         unit.map(sta =>
//                                                                             <>

//                                                                                 <option value={sta.id}>{sta.unit_name}</option>
//                                                                             </>

//                                                                         )
//                                                                     }
//                                                                 </select>
//                                                             </div>
//                                                         </div>

//                                                         <div class="form-group row">

//                                                             <label class="col-form-label col-md-3"><strong>Purchase Price<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                             <div class="col-md-8">

//                                                                 <input type="number" name="purchase_price" value={assetInfo.purchase_price} onChange={brand_input_change}
//                                                                     class="form-control form-control-sm  required "
//                                                                     placeholder='Enter Purchase Price'
//                                                                     maxLength={256}

//                                                                 />

//                                                             </div>
//                                                         </div>


//                                                         <div class="form-group row">

//                                                             <label class="col-form-label col-md-3"><strong>Sale Price<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                             <div class="col-md-8">

//                                                                 <input type="number" name="sale_price" value={assetInfo.sale_price} onChange={brand_input_change}
//                                                                     class="form-control form-control-sm  required "
//                                                                     placeholder='Enter Sale Price'
//                                                                     maxLength={256}
//                                                                 />

//                                                             </div>
//                                                         </div>
//                                                     </>
//                                                     :
//                                                     <>
//                                                         <div class="form-group row">
//                                                             <label class="col-form-label col-md-3"><strong>Item Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                             <div class="col-md-8">
//                                                                 <input type="text" name="item_name" value={assetInfo.item_name} onChange={brand_input_change}
//                                                                     class="form-control form-control-sm  required "
//                                                                     placeholder='Enter Purchase Price'
//                                                                     maxLength={256}

//                                                                 />

//                                                             </div>
//                                                         </div>


//                                                         <div class="form-group row">

//                                                             <label class="col-form-label col-md-3"><strong>Quantity<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                             <div class="col-md-8">

//                                                                 <input type="number" name="quantity" value={assetInfo.quantity} onChange={brand_input_change}
//                                                                     class="form-control form-control-sm  required "
//                                                                     placeholder='Enter Quantity'
//                                                                     maxLength={256}
//                                                                 />

//                                                             </div>
//                                                         </div>


//                                                         <div class="form-group row">
//                                                             <label class="col-form-label col-md-3"><strong>Unit<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                             <div class="col-md-8">


//                                                                 <select
//                                                                     value={assetInfo.unit_id} onChange={brand_input_change}
//                                                                     name='unit_id'

//                                                                     class="form-control form-control-sm " placeholder="Enter Role Name">
//                                                                     <option value=''>Select A Unit Name</option>
//                                                                     {
//                                                                         unit.map(sta =>
//                                                                             <>

//                                                                                 <option value={sta.id}>{sta.unit_name}</option>
//                                                                             </>

//                                                                         )
//                                                                     }
//                                                                 </select>
//                                                             </div>
//                                                         </div>

//                                                         <div class="form-group row">

//                                                             <label class="col-form-label col-md-3"><strong>Purchase Price<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                             <div class="col-md-8">

//                                                                 <input type="number" name="purchase_price" value={assetInfo.purchase_price} onChange={brand_input_change}
//                                                                     class="form-control form-control-sm  required "
//                                                                     placeholder='Enter Purchase Price'
//                                                                     maxLength={256}

//                                                                 />

//                                                             </div>
//                                                         </div>


//                                                         <div class="form-group row">

//                                                             <label class="col-form-label col-md-3"><strong>Sale Price<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                             <div class="col-md-8">

//                                                                 <input type="number" name="sale_price" value={assetInfo.sale_price} onChange={brand_input_change}
//                                                                     class="form-control form-control-sm  required "
//                                                                     placeholder='Enter Sale Price'
//                                                                     maxLength={256}
//                                                                 />

//                                                             </div>
//                                                         </div>

//                                                     </>

//                                             }





//                                             <div class="form-group row">

//                                                 <label class="col-form-label col-md-3"><strong>Total Amount<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                 <div class="col-md-8">

//                                                     <input type="number" name="total_amount" value={assetInfo.total_amount} onChange={brand_input_change}
//                                                         class="form-control form-control-sm  required "
//                                                         placeholder='Enter Total Amount'
//                                                         maxLength={256}
//                                                         readOnly
//                                                     />

//                                                 </div>
//                                             </div>




//                                         </div>
//                                         <div class="col-md-6">

//                                             <div class="form-group row">

//                                                 <label class="col-form-label col-md-3"><strong>Discount<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                 <div class="col-md-8">

//                                                     <input type="number" name="discount" value={assetInfo.discount} onChange={brand_input_change}
//                                                         class="form-control form-control-sm  required "
//                                                         placeholder='Enter Discount'
//                                                         maxLength={256}
//                                                     />

//                                                 </div>
//                                             </div>
//                                             <div class="form-group row">

//                                                 <label class="col-form-label col-md-3"><strong>Due<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                 <div class="col-md-8">

//                                                     <input type="number" name="due" value={assetInfo.due} onChange={brand_input_change}
//                                                         class="form-control form-control-sm  required "
//                                                         placeholder='Enter Due'
//                                                         maxLength={256}
//                                                     />

//                                                 </div>
//                                             </div>


//                                             <div class="form-group row">

//                                                 <label class="col-form-label col-md-3"><strong>Paid Amount<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                 <div class="col-md-8">

//                                                     <input type="number" name="paid_amount" value={assetInfo.paid_amount} onChange={brand_input_change}
//                                                         class="form-control form-control-sm  required "
//                                                         placeholder='Enter Paid Amount'
//                                                         maxLength={256}
//                                                         readOnly
//                                                     />

//                                                 </div>
//                                             </div>

//                                             <div class="form-group row">

//                                                 <label class="col-form-label col-md-3"><strong>Purchase Invoice<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                 <div class="col-md-8">

//                                                     <input type="number" name="purchase_invoice" value={assetInfo.purchase_invoice} onChange={brand_input_change}
//                                                         class="form-control form-control-sm  required "
//                                                         placeholder='Enter Purchase Invoice'
//                                                         maxLength={256}
//                                                     />

//                                                 </div>
//                                             </div>

//                                             <div className="form-group row student">
//                                                 <label className="col-form-label col-md-3 font-weight-bold">Payment Date:</label>
//                                                 <div className="col-md-8">

//                                                     <input
//                                                         type="text"
//                                                         readOnly

//                                                         defaultValue={formattedDisplayDate}
//                                                         onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
//                                                         placeholder="dd-mm-yyyy"
//                                                         className="form-control form-control-sm mb-2"
//                                                         style={{ display: 'inline-block', }}
//                                                     />
//                                                     <input
//                                                         name='payment_date'
//                                                         type="date"
//                                                         id={`dateInput-nt`}
//                                                         onChange={(e) => handleDateSelection(e)}
//                                                         style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

//                                                     />
//                                                     {/* {
//                                                         payment_date && <p className='text-danger'>{payment_date}</p>
//                                                     } */}

//                                                 </div>


//                                             </div>
//                                             <div class="form-group row">

//                                                 <label class="col-form-label col-md-3"><strong>Invoice Id<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                 <div class="col-md-8">

//                                                     <input type="number" name="invoice_id" value={assetInfo.invoice_id} onChange={brand_input_change}
//                                                         class="form-control form-control-sm  required "
//                                                         placeholder='Enter Invoice Id'
//                                                         maxLength={256}
//                                                     />

//                                                 </div>
//                                             </div>

//                                         </div>


//                                         <div className="form-group row">
//                                             <div className="offset-md-3 col-sm-6">

//                                                 <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PurchaseUpdate;

'use client'
//ismile
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const PurchaseUpdate = ({ id }) => {

    const { data: purchaseProductSingle = [] } = useQuery({
        queryKey: ['purchaseProductSingle'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_list/${id}`);
            const data = await res.json();
            return data;
        }
    });


    const [supplierId, setSupplierId] = useState('');
    const [supplier, setSupplier] = useState('');


    useEffect(() => {
        setSupplierId(purchaseProductSingle[0]?.supplier_id)
    }, [purchaseProductSingle])

    const supplier_id = (id) => {
        setSupplierId(id);
        if (!id) {
            setSupplier('Supplier be filled')
        }
        else {
            setSupplier('')
        }
        console.log("Selected supplier id:", id);
    };



    // Dynamically generate API endpoint based on selected supplierId
    const api = supplierId ? `/Admin/purchase/purchase_supplier_due/${supplierId}` : '';

    const { data: supplierLastDue } = useQuery({
        queryKey: ['supplierLastDue', api], // Include api in queryKey to trigger refetch when api changes
        queryFn: async () => {
            if (api) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002${api}`);
                const data = await res.json();
                return data;
            }
        },
        enabled: !!api, // Enable the query only if api is truthy (supplierId is selected)
    });


    console.log(supplierLastDue?.payable_amount)

    const prev_due = supplierLastDue?.total_amount - (supplierLastDue?.paid_amount + supplierLastDue?.discount);

    console.log(prev_due)

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



    const [created, setCreated] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setCreated(storedUserId);
        }
    }, []);


    const { data: account_head = [], } = useQuery({
        queryKey: ['account_head'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/account_head/account_head_list`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });


    const [formattedDisplayDate, setFormattedDisplayDate] = useState('');
    const [fromDate, setFromDate] = useState('');


    const { data: supplierss = [], } = useQuery({
        queryKey: ['supplier'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/supplier/supplier_list`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });

    const { data: unit = [],
    } = useQuery({
        queryKey: ['unit'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/unit/unit_all`)

            const data = await res.json()
            return data
        }
    })



    const { data: products = [], isLoading
    } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_list`)

            const data = await res.json()
            return data
        }
    })





    const [formData, setFormData] = useState({
        supplier_id: '',
        payable_amount: '',
        remarks: '',
        account: '',
        total_amount: '',
        discount: '',
        due: '',
        paid_amount: '',
        purchase_invoice: '',
        purchase_date: '',
        invoice_id: '',
        previous_due: '',
        purchase_type: '',
        fields: [],
        modified_by: created
    });




    const handleDateSelection = (event) => {
        const inputDate = event.target.value; // Directly get the value from the input

        const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
        const month = String(inputDate.split('-')[1]).padStart(2, '0');
        const year = String(inputDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;
        setFromDate(formattedDate);
        setFormData(prevData => ({
            ...prevData,
            purchase_date: formattedDatabaseDate // Update the dob field in the state
        }));
        // if (formattedDatabaseDate) {
        //     setPayment_date('')
        // }
    };

    useEffect(() => {
        const dob = formData.purchase_date;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [formData]);

    const brand_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...formData }
        attribute[name] = value
        setFormData(attribute)

    };

    const handleQualificationChange = (index, e) => {
        const { name, value } = e.target;
        const newQualifications = [...formData.fields];
        newQualifications[index][name] = value;
        setFormData({ ...formData, fields: newQualifications });
    };

    const addQualification = () => {
        const newField = formData.purchase_type === 1
            ? { product_id: '', quantity: '', ware_house_id: '', unit_id: '', purchase_price: '', sale_price: '', modified_by: created }
            : { item_name: '', quantity: '', ware_house_id: '', unit_id: '', purchase_price: '', sale_price: '', modified_by: created };
        setFormData({
            ...formData,
            fields: [...formData.fields, newField]
        });
    };
    const totalPurchasePrice = formData?.fields?.reduce((sum, field) => sum + (parseFloat(field.purchase_price) || 0), 0);
    const totalSalePrice = formData?.fields?.reduce((sum, field) => sum + (parseFloat(field.sale_price * field.quantity) || 0), 0);

    console.log(totalSalePrice)
    console.log(totalPurchasePrice)

    useEffect(() => {
        const purchaseData = purchaseProductSingle[0] || {};

        // Common fields
        let updatedAssetInfo = {
            supplier_id: purchaseData.supplier_id || '',
            total_amount: purchaseData.total_amount || '',
            discount: purchaseData.discount || '',
            due: purchaseData.due || '',
            payable_amount: purchaseData.payable_amount || '',
            remarks: purchaseData.remarks || '',
            account: purchaseData.account || '',
            paid_amount: purchaseData.paid_amount || '',
            purchase_invoice: purchaseData.purchase_invoice || '',
            purchase_date: purchaseData.purchase_date || '',
            invoice_id: purchaseData.invoice_id || '',
            purchase_type: purchaseData.purchase_type || '',
            previous_due: purchaseData.previous_due || '',
            modified_by: created,
            fields: purchaseData.purchase_type === 1
                ? purchaseData.purchase_product || []
                : purchaseData.purchase_item || []
        };

        setFormData(updatedAssetInfo);
    }, [purchaseProductSingle, created, prev_due]);
    // useEffect(() => {

    //     setFormData(prevState => ({
    //         ...prevState,
    //         total_amount: parseFloat(totalSalePrice)
    //     }));
    // }, [totalSalePrice, formData.discount]);


    // useEffect(() => {

    //     setFormData(prevState => ({
    //         ...prevState,
    //         paid_amount: parseFloat(formData.total_amount) - parseFloat(formData.discount ? formData.discount : 0) - parseFloat(formData.due ? formData.due : 0)
    //     }));
    // }, [formData.total_amount, formData.due, formData.discount]);

    useEffect(() => {

        setFormData(prevState => ({
            ...prevState,
            total_amount: parseFloat(totalSalePrice)
            // - parseFloat(assetInfo.discount ? assetInfo.discount : 0)
        }));
    }, [totalSalePrice]);

    useEffect(() => {

        setFormData(prevState => ({
            ...prevState,
            due: formData.payable_amount - formData.discount - formData.paid_amount
            // - parseFloat(formData.discount ? formData.discount : 0)
        }));
    }, [formData.payable_amount, formData.discount, formData.paid_amount]);

console.log(formData.payable_amount - (formData.discount + formData.paid_amount))
console.log(parseFloat(formData.payable_amount) - (parseFloat(formData.discount) + parseFloat(formData.paid_amount)))
    useEffect(() => {

        setFormData(prevState => ({
            ...prevState,
            payable_amount: parseFloat(totalSalePrice) + parseFloat(formData.previous_due ? formData.previous_due : prev_due)
            // - parseFloat(assetInfo.discount ? assetInfo.discount : 0)
        }));
    }, [totalSalePrice, prev_due, formData.previous_due]);


    // useEffect(() => {

    //     setFormData(prevState => ({
    //         ...prevState,
    //         paid_amount: parseFloat(formData.payable_amount) - parseFloat(formData.discount ? formData.discount : 0) - parseFloat(purchaseProductSingle[0]?.due)
    //     }));
    // }, [formData.payable_amount, formData.discount, purchaseProductSingle]);

    useEffect(() => {

        setFormData(prevState => ({
            ...prevState,
            paid_amount: parseFloat(formData.payable_amount) - parseFloat(formData.discount ? formData.discount : 0)
        }));
    }, [formData.payable_amount, formData.discount]);

    const handleRemoveField = (index) => {
        const newQualifications = formData.fields.filter((_, i) => i !== index);
        setFormData({ ...formData, fields: newQualifications });
    };




    console.log(formData);


    const router = useRouter()


    const purchase_create = (event) => {
        event.preventDefault();


        // const form = event.target;

        // const supplier_id = form.supplier_id.value
        // const purchase_date = expenseDate

        // const allData = {
        //     fields, supplier_id, purchase_date, assetInfo
        // }
        // console.log(allData)
        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_edit/${id}
        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase_create/purchase_create

        console.log(formData)

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase/purchase_edit/${id}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((Response) => {

                Response.json()
                if (Response.ok === true) {
                    sessionStorage.setItem("message", "Data Update successfully!");
                    router.push('/Admin/purchase/purchase_all')

                }
            })
            .then((data) => {
                console.log(data)

                // if (data.affectedRows > 0) {
                //     sessionStorage.setItem("message", "Data saved successfully!");
                //     router.push('/Admin/product/product_all')

                // }
            })
            .catch((error) => console.error(error));
        // }
    }

    console.log(formData)

    const [selectedData, setSelectedData] = useState({ amount: 0 }); // Example data

    useEffect(() => {
        if (formData.account) {
            const item = account_head.find(item => item.id === parseInt(formData.account));
            if (item) {
                const updatedItem = {
                    ...item,
                    amount: (item.amount || 0) - parseFloat(formData.payable_amount) // Add 100 to amount, 
                };
                setSelectedData(updatedItem); // Set only the matching item
            } else {
                setSelectedData(null); // Clear if no match
            }
        }
    }, [account_head, formData.payable_amount, formData.account]); // Trigger when selectedEntryType changes

    console.log(selectedData)
    console.log(formData.account)




    const account_head_amount_update = (e) => {
        e.preventDefault();

        const payload = {
            selectedData: selectedData,
            selectedEntryType: formData.account
        };

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/income/update_income_amount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload) // Send both selectedData and selectedEntryType
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Update successful:', data);
            })
            .catch(error => {
                console.error('Error updating income amount:', error);
            });
    };

   const { data: ware_house_list = [],
    } = useQuery({
        queryKey: ['ware_house_list'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/ware_house/ware_house_all`)

            const data = await res.json()
            return data
        }
    })

    const [selectedWareHouse, setSelectedWareHouse] = useState(""); // সর্বজনীন Ware House স্টেট

    // Handle Ware House সিলেক্ট চেঞ্জ
    const handleWareHouseChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedWareHouse(selectedValue);

        // Update all fields with the selected warehouse
        const updatedFields = formData.fields.map((field) => ({
            ...field,
            ware_house_id: selectedValue,
        }));

        // Update formData immutably
        setFormData((prev) => ({
            ...prev,
            fields: updatedFields,
        }));
    };

    return (
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>

                        <div className="card-default">


                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">
                                    {
                                        formData.purchase_type == 1 ?
                                            'Update Purchase'
                                            :
                                            'Update Non Stock Purchase'
                                    }
                                </h5>
                                <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
                                    <Link href={`/Admin/purchase/purchase_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to Purchase List</Link>
                                </div>
                            </div>
                            <>
                                <form className="form-horizontal" method="post" autoComplete="off"

                                    // onSubmit={purchase_create}
                                    onSubmit={(e) => { purchase_create(e); account_head_amount_update(e); }}


                                >

                                    <div class="d-lg-flex md:d-md-flex justify-content-between px-3 mt-3">

                                        <div class=" ">
                                            <div className='col-md-12'>

                                                <h5>Supplier,<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></h5>
                                                <div>
                                                    <select value={formData.supplier_id}
                                                        onChange={(e) => {
                                                            supplier_id(e.target.value)
                                                            brand_input_change(e)
                                                        }}
                                                        name="supplier_id" className="form-control form-control-sm mb-2" id="supplier_id">
                                                        <option value=''>Select Supplier</option>
                                                        {
                                                            supplierss.map((supplier) => (
                                                                <>
                                                                    <option value={supplier.id}>{supplier.name}</option>

                                                                </>

                                                            ))
                                                        }

                                                    </select>

                                                </div>
                                            </div>
                                            <div className='col-md-12'>

                                                <h5>Purchase Date,<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></h5>
                                                <div>

                                                    <input
                                                        type="text"
                                                        readOnly

                                                        defaultValue={formattedDisplayDate}
                                                        onClick={() => document.getElementById(`dateInput-nt`).showPicker()}
                                                        placeholder="dd-mm-yyyy"
                                                        className="form-control form-control-sm mb-2"
                                                        style={{ display: 'inline-block', }}
                                                    />
                                                    <input
                                                        name='payment_date'
                                                        type="date"
                                                        id={`dateInput-nt`}
                                                        onChange={(e) => handleDateSelection(e)}
                                                        style={{ position: 'absolute', bottom: '40px', left: '10px', visibility: 'hidden' }}

                                                    />
                                                </div>
                                            </div>


                                        </div>

                                    </div>



                                    <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                        (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                    </div>

                                    <div className="card-body">
                                        <div>
                                            <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                                                <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
                                                    <strong>{
                                                        formData.purchase_type == 1 ?
                                                            'Purchase'
                                                            :
                                                            'Non Stock Purchase'
                                                    }</strong>
                                                </div>
                                                <div className="card-title card-header-color font-weight-bold mb-0 float-right">
                                                    <div className="input-group printable">
                                                        <input
                                                            style={{ width: '80px' }}
                                                            type="number"
                                                            min="1"
                                                            className="form-control form-control-sm"
                                                            placeholder="Enter number of forms to add"
                                                        // value={numToAdd}
                                                        // onChange={(event) => setNumToAdd(event.target.value)}
                                                        />
                                                        <div className="input-group-append">
                                                            <button
                                                                type="button"
                                                                className="btn btn-info btn-sm py-1 add_more"
                                                                onClick={addQualification}
                                                            >
                                                                Add More
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                {
                                                    purchaseProductSingle[0]?.purchase_type == 1 ?
                                                        <>
                                                            <div className="table-responsive">
                                                                <table className="table table-bordered table-hover table-striped table-sm">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Product Name<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></th>
                                                                            <th style={{ width: '200px' }}>
                                                                                Ware House: <small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>
                                                                                <select
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    value={selectedWareHouse}
                                                                                    onChange={handleWareHouseChange}
                                                                                >
                                                                                    <option value="">Select Ware House</option>
                                                                                    {ware_house_list.map((house) => (
                                                                                        <option key={house.id} value={house.id}>
                                                                                            {house.name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </th>
                                                                            <th>Quantity<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></th>
                                                                            <th>Unit Name<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></th>
                                                                            <th>Purchase Price<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></th>
                                                                            <th>Sale Price<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></th>
                                                                            <th>Total Amount<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></th>
                                                                            <th>Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {formData?.fields?.length === 0 ? (
                                                                            <tr>
                                                                                <td colSpan="5" className="text-center">No data available</td>
                                                                            </tr>
                                                                        ) : (
                                                                            formData?.fields?.map((qualification, index) => (
                                                                                <tr key={index}>
                                                                                    <td>
                                                                                        <select

                                                                                            value={qualification.product_id}
                                                                                            name="product_id"
                                                                                            className="form-control form-control-sm trim integer_no_zero row_unique_education"
                                                                                            onChange={(e) => handleQualificationChange(index, e)}
                                                                                            required
                                                                                        >
                                                                                            <option value=''>Select Product </option>
                                                                                            {products.map((educations, idx) => (
                                                                                                <option key={idx} value={educations.id}>
                                                                                                    {educations.product_name}
                                                                                                </option>
                                                                                            ))}
                                                                                        </select>
                                                                                    </td>
                                                                                    <td>
                                                                                        <select
                                                                                            name="ware_house_id"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            value={qualification.ware_house_id || selectedWareHouse} // সর্বজনীন ভ্যালু প্রয়োগ
                                                                                            onChange={(e) => handleQualificationChange(index, e)} // ইন্ডিভিজুয়াল হ্যান্ডলার
                                                                                        >
                                                                                            <option value="">Select Ware House</option>
                                                                                            {ware_house_list.map((house) => (
                                                                                                <option key={house.id} value={house.id}>
                                                                                                    {house.name}
                                                                                                </option>
                                                                                            ))}
                                                                                        </select>
                                                                                    </td>

                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            name="quantity"
                                                                                            className="form-control form-control-sm required row_unique_quantity"
                                                                                            placeholder="Enter quantity"
                                                                                            value={qualification.quantity}
                                                                                            onChange={(e) => handleQualificationChange(index, e)}
                                                                                            required
                                                                                        />

                                                                                    </td>
                                                                                    <td>
                                                                                        <select

                                                                                            value={qualification.unit_id}
                                                                                            name="unit_id"
                                                                                            className="form-control form-control-sm trim integer_no_zero row_unique_education"
                                                                                            onChange={(e) => handleQualificationChange(index, e)}
                                                                                            required
                                                                                        >
                                                                                            <option value=''>Select Unit</option>
                                                                                            {unit.map((educations, idx) => (
                                                                                                <option key={idx} value={educations.id}>
                                                                                                    {educations.unit_name}
                                                                                                </option>
                                                                                            ))}
                                                                                        </select>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            name="purchase_price"
                                                                                            className="form-control form-control-sm required row_unique_purchase_price"
                                                                                            placeholder="Enter Purchase Price"
                                                                                            value={qualification.purchase_price}
                                                                                            onChange={(e) => handleQualificationChange(index, e)}
                                                                                            required
                                                                                        />

                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            name="sale_price"
                                                                                            className="form-control form-control-sm required row_unique_purchase_price"
                                                                                            placeholder="Enter Sale Price"
                                                                                            value={qualification.sale_price}
                                                                                            onChange={(e) => handleQualificationChange(index, e)}
                                                                                            required
                                                                                        />

                                                                                    </td>
                                                                                    <td>
                                                                                        <p>{qualification.quantity * qualification.sale_price}</p>
                                                                                    </td>
                                                                                    <td>
                                                                                        <button
                                                                                            onClick={() => handleRemoveField(index)}
                                                                                            type="button"
                                                                                            className="btn btn-sm btn-danger remove delete"
                                                                                        >
                                                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                        </>
                                                        :
                                                        <>

                                                            <div className="table-responsive">
                                                                <table className="table table-bordered table-hover table-striped table-sm">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Item Name<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></th>
                                                                            <th>Quantity<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></th>
                                                                            <th>Unit Name<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></th>
                                                                            <th>Purchase Price<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></th>
                                                                            <th>Sale Price<small><sup><small><i className="text-danger fas fa-star"></i></small></sup></small></th>
                                                                            <th>Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {formData?.fields?.length === 0 ? (
                                                                            <tr>
                                                                                <td colSpan="5" className="text-center">No data available</td>
                                                                            </tr>
                                                                        ) : (
                                                                            formData?.fields?.map((qualification, index) => (
                                                                                <tr key={index}>
                                                                                    <td>
                                                                                        <input
                                                                                            type="text"
                                                                                            name="item_name"
                                                                                            className="form-control form-control-sm required row_unique_item_name"
                                                                                            placeholder="Enter item name"
                                                                                            value={qualification.item_name}
                                                                                            onChange={(e) => handleQualificationChange(index, e)}
                                                                                            required
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            name="quantity"
                                                                                            className="form-control form-control-sm required row_unique_quantity"
                                                                                            placeholder="Enter quantity"
                                                                                            value={qualification.quantity}
                                                                                            onChange={(e) => handleQualificationChange(index, e)}
                                                                                            required
                                                                                        />

                                                                                    </td>
                                                                                    <td>
                                                                                        <select

                                                                                            value={qualification.unit_id}
                                                                                            name="unit_id"
                                                                                            className="form-control form-control-sm trim integer_no_zero row_unique_education"
                                                                                            onChange={(e) => handleQualificationChange(index, e)}
                                                                                            required
                                                                                        >
                                                                                            <option value=''>Select Unit</option>
                                                                                            {unit.map((educations, idx) => (
                                                                                                <option key={idx} value={educations.id}>
                                                                                                    {educations.unit_name}
                                                                                                </option>
                                                                                            ))}
                                                                                        </select>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            name="purchase_price"
                                                                                            className="form-control form-control-sm required row_unique_purchase_price"
                                                                                            placeholder="Enter Purchase Price"
                                                                                            value={qualification.purchase_price}
                                                                                            onChange={(e) => handleQualificationChange(index, e)}
                                                                                            required
                                                                                        />

                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            name="sale_price"
                                                                                            className="form-control form-control-sm required row_unique_purchase_price"
                                                                                            placeholder="Enter Sale Price"
                                                                                            value={qualification.sale_price}
                                                                                            onChange={(e) => handleQualificationChange(index, e)}
                                                                                            required
                                                                                        />

                                                                                    </td>
                                                                                    <td>
                                                                                        <button
                                                                                            onClick={() => handleRemoveField(index)}
                                                                                            type="button"
                                                                                            className="btn btn-sm btn-danger remove delete"
                                                                                        >
                                                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </>
                                                }
                                            </div>

                                        </div>




                                        <div className="col-md-4 d-flex justify-content-end ml-auto">
                                            <table className="table table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <td className="" colSpan="2">
                                                            <strong>Sub Total:</strong>
                                                        </td>
                                                        <td className="text-right">
                                                            {/* <strong>{totalSalePrice} TK</strong> */}
                                                            <strong>{formData?.total_amount ? formData?.total_amount : 0} TK</strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="" colSpan="2">
                                                            <strong>Previous Due:</strong>
                                                        </td>
                                                        <td className="text-right">
                                                            <strong>{formData.previous_due ? formData.previous_due : prev_due} TK</strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="" colSpan="2">
                                                            <strong>Payable Amount:</strong>
                                                        </td>
                                                        <td className="text-right">
                                                            <strong>{formData?.payable_amount ? formData?.payable_amount : 0} TK</strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="" colSpan="2">
                                                            <strong>Discount:</strong>
                                                        </td>
                                                        <td>
                                                            <input
                                                                placeholder="Enter Discount"
                                                                className="form-control form-control-sm text-right"
                                                                onChange={brand_input_change}
                                                                type="text"
                                                                name="discount"
                                                                value={formData.discount ? formData.discount : 0}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="" colSpan="2">
                                                            <strong>Remarks:</strong>
                                                        </td>
                                                        <td>
                                                            <input
                                                                placeholder="Enter Remarks"
                                                                className="form-control form-control-sm"
                                                                onChange={brand_input_change}
                                                                type="text"
                                                                name="remarks"
                                                                id="remarks"
                                                                value={formData.remarks}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="" colSpan="2">
                                                            <strong>Paid Amount:</strong>
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="form-control form-control-sm text-right"
                                                                onChange={brand_input_change}
                                                                type="text"
                                                                name="paid_amount"
                                                                value={formData.paid_amount ? formData.paid_amount : 0}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="" colSpan="2">
                                                            <strong>Paid By:</strong>
                                                        </td>
                                                        <td>
                                                            <select
                                                                value={formData.account}
                                                                onChange={brand_input_change}
                                                                name="account"
                                                                className="form-control form-control-sm"
                                                            >
                                                                <option value="">Select Account</option>
                                                                {account_head.map((sta) => (
                                                                    <option key={sta.id} value={sta.id}>{sta.account_head_name}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="" colSpan="2">
                                                            <strong>Total Due:</strong>
                                                        </td>
                                                        <td>
                                                            <p className='text-right'>{formData.due ? formData.due : 0}</p>
                                                            {/* <input
                                                                readOnly
                                                                placeholder="Enter Due"
                                                                className="form-control form-control-sm text-right"
                                                                type="text"
                                                                name="due"
                                                                value={formData.due ? formData.due : 0}
                                                            /> */}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>




                                    </div>
                                    <div className="form-group row">
                                        <div className="offset-md-3 col-sm-6">

                                            <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                        </div>
                                    </div>
                                </form>
                            </>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseUpdate;