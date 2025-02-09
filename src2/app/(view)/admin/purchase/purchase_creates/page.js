// 'use client' 
//ismile
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';



// const CreatePurchase = () => {

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
//         supplier_id: '', product_id: '', quantity: '', unit_id: '', purchase_price: '', sale_price: '', total_amount: '', discount: '', due: '', paid_amount: '', purchase_invoice: '', purchase_date: '', invoice_id: '', purchase_type: '', created_by: created
//     });

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




//     const formatDate = (date) => {
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = String(date.getFullYear());
//         return `${day}-${month}-${year}`;
//     };
//     const handleTextInputClick = () => {
//         document.getElementById('dateInputFrom').showPicker();
//     };
//     const handleDateChangeFrom = (event) => {
//         const selectedDate = new Date(event.target.value);
//         setFromDate(selectedDate);
//         const day = String(selectedDate.getDate()).padStart(2, '0');
//         const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
//         const year = String(selectedDate.getFullYear());
//         const formattedDate = `${year}-${month}-${day}`;
//         setAssetInfo((prevAssetInfo) => ({
//             ...prevAssetInfo,
//             purchase_date: formattedDate
//         }));
//         if (formattedDate) {
//             setDate('')
//         }
//     };



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


//     const [supplier_id, setSupplier_id] = useState('');
//     const [item_name, setItem_name] = useState('');
//     const [quantity, setQuantity] = useState('');
//     const [unit_id, setUnit_id] = useState('');
//     const [purchase_price, setPurchase_price] = useState('');
//     const [sale_price, setSale_price] = useState('');
//     const [discount, setDiscount] = useState('');
//     const [due, setDue] = useState('');
//     const [purchase_invoice, setPurchase_invoice] = useState('');
//     const [invoice_id, setInvoice_id] = useState('');
//     const [date, setDate] = useState('');

//     const brand_input_change = (event) => {
//         const name = event.target.name
//         const value = event.target.value
//         const attribute = { ...assetInfo }
//         attribute[name] = value
//         setAssetInfo(attribute)

//         const supplier_id = attribute['supplier_id'];
//         if (supplier_id) {
//             setSupplier_id(""); // Clear the error message
//         }
//         const item_name = attribute['product_id'];
//         if (item_name) {
//             setItem_name(""); // Clear the error message
//         }
//         const quantity = attribute['quantity'];
//         if (quantity) {
//             setQuantity(""); // Clear the error message
//         }
//         const unit_id = attribute['unit_id'];
//         if (unit_id) {
//             setUnit_id(""); // Clear the error message
//         }
//         const purchase_price = attribute['purchase_price'];
//         if (purchase_price) {
//             setPurchase_price(""); // Clear the error message
//         }
//         const sale_price = attribute['sale_price'];
//         if (sale_price) {
//             setSale_price(""); // Clear the error message
//         }
//         const discount = attribute['discount'];
//         if (discount) {
//             setDiscount(""); // Clear the error message
//         }
//         const due = attribute['due'];
//         if (due) {
//             setDue(""); // Clear the error message
//         }
//         const purchase_invoice = attribute['purchase_invoice'];
//         if (purchase_invoice) {
//             setPurchase_invoice(""); // Clear the error message
//         }

//         const invoice_id = attribute['invoice_id'];
//         if (invoice_id) {
//             setInvoice_id(""); // Clear the error message
//         }




//     };

//     const router = useRouter()

//     const brand_update = (e) => {
//         e.preventDefault();

//         // if (!assetInfo.date) {
//         //     setDate('Please Select  a Date.');
//         //     return; // Prevent further execution
//         // }


//         if (!assetInfo.supplier_id) {
//             setSupplier_id('This field is required');
//             return; // Prevent further execution
//         }
//         if (!assetInfo.product_id) {
//             setItem_name('This field is required');
//             return; // Prevent further execution
//         }
//         if (!assetInfo.quantity) {
//             setQuantity('This field is required');
//             return; // Prevent further execution
//         }
//         if (!assetInfo.unit_id) {
//             setUnit_id('This field is required');
//             return; // Prevent further execution
//         }
//         if (!assetInfo.purchase_price) {
//             setPurchase_price('This field is required');
//             return; // Prevent further execution
//         }
//         if (!assetInfo.sale_price) {
//             setSale_price('This field is required');
//             return; // Prevent further execution
//         }

//         if (!assetInfo.discount) {
//             setDiscount('This field is required');
//             return; // Prevent further execution
//         }
//         if (!assetInfo.due) {
//             setDue('This field is required');
//             return; // Prevent further execution
//         }

//         if (!assetInfo.purchase_invoice) {
//             setPurchase_invoice('This field is required');
//             return; // Prevent further execution
//         }
//         if (!assetInfo.purchase_date) {
//             setDate('This field is required');
//             return; // Prevent further execution
//         }
//         if (!assetInfo.invoice_id) {
//             setInvoice_id('This field is required');
//             return; // Prevent further execution
//         }

//         // Retrieve the form's image value


//         // Make the fetch request
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase_create/purchase_create`, {
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
//                                 <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Create Purchase</h5>
//                                 <div class="card-title font-weight-bold mb-0 card-header-color float-right">
//                                     <Link href={`/Admin/purchase/purchase_all?page_group=${page_group}`} class="btn btn-sm btn-info">Purchase List</Link></div>
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
//                                                         supplier_id && <p className='text-danger'>{supplier_id}</p>
//                                                     }

//                                                 </div>
//                                             </div>

//                                             <div class="form-group row">
//                                                 <label class="col-form-label col-md-3"><strong>Product Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                 <div class="col-md-8">
//                                                     <select
//                                                         value={assetInfo.product_id} onChange={brand_input_change}
//                                                         name='product_id'

//                                                         class="form-control form-control-sm " placeholder="Enter Role Name">
//                                                         <option value=''>Select A Product Name</option>
//                                                         {
//                                                             products.map(sta =>
//                                                                 <>

//                                                                     <option value={sta.id}>{sta.product_name}</option>
//                                                                 </>

//                                                             )
//                                                         }
//                                                     </select>
//                                                     {
//                                                         item_name && <p className='text-danger'>{item_name}</p>
//                                                     }
//                                                 </div>
//                                             </div>


//                                             <div class="form-group row">

//                                                 <label class="col-form-label col-md-3"><strong>Quantity<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                 <div class="col-md-8">

//                                                     <input type="number" name="quantity" value={assetInfo.quantity} onChange={brand_input_change}
//                                                         class="form-control form-control-sm  required "
//                                                         placeholder='Enter Quantity'
//                                                         maxLength={256}
//                                                     />
//                                                     {
//                                                         quantity && <p className='text-danger'>{quantity}</p>
//                                                     }


//                                                 </div>
//                                             </div>


//                                             <div class="form-group row">
//                                                 <label class="col-form-label col-md-3"><strong>Unit<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                 <div class="col-md-8">


//                                                     <select
//                                                         value={assetInfo.unit_id} onChange={brand_input_change}
//                                                         name='unit_id'

//                                                         class="form-control form-control-sm " placeholder="Enter Role Name">
//                                                         <option value=''>Select A Unit Name</option>
//                                                         {
//                                                             unit.map(sta =>
//                                                                 <>

//                                                                     <option value={sta.id}>{sta.unit_name}</option>
//                                                                 </>

//                                                             )
//                                                         }
//                                                     </select>
//                                                     {
//                                                         unit_id && <p className='text-danger'>{unit_id}</p>
//                                                     }
//                                                 </div>
//                                             </div>

//                                             <div class="form-group row">

//                                                 <label class="col-form-label col-md-3"><strong>Purchase Price<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                 <div class="col-md-8">

//                                                     <input type="number" name="purchase_price" value={assetInfo.purchase_price} onChange={brand_input_change}
//                                                         class="form-control form-control-sm  required "
//                                                         placeholder='Enter Purchase Price'
//                                                         maxLength={256}

//                                                     />
//                                                     {
//                                                         purchase_price && <p className='text-danger'>{purchase_price}</p>
//                                                     }
//                                                 </div>
//                                             </div>


//                                             <div class="form-group row">

//                                                 <label class="col-form-label col-md-3"><strong>Sale Price<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
//                                                 <div class="col-md-8">

//                                                     <input type="number" name="sale_price" value={assetInfo.sale_price} onChange={brand_input_change}
//                                                         class="form-control form-control-sm  required "
//                                                         placeholder='Enter Sale Price'
//                                                         maxLength={256}
//                                                     />
//                                                     {
//                                                         sale_price && <p className='text-danger'>{sale_price}</p>
//                                                     }
//                                                 </div>
//                                             </div>
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
//                                                     {
//                                                         discount && <p className='text-danger'>{discount}</p>
//                                                     }
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
//                                                     {
//                                                         due && <p className='text-danger'>{due}</p>
//                                                     }
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
//                                                     {
//                                                         purchase_invoice && <p className='text-danger'>{purchase_invoice}</p>
//                                                     }
//                                                 </div>
//                                             </div>

//                                             <div className="form-group row student">
//                                                 <label className="col-form-label col-md-3 font-weight-bold">Purchase Date:</label>
//                                                 <div className="col-md-8">

//                                                     <input
//                                                         className="form-control form-control-sm"
//                                                         type="text"
//                                                         id="fromDate"
//                                                         name='purchase_date'
//                                                         placeholder='dd--mm--yyyy'
//                                                         value={fromDate ? formatDate(fromDate) : ''}
//                                                         onClick={handleTextInputClick}
//                                                         readOnly
//                                                     />
//                                                     <input
//                                                         type="date"
//                                                         id="dateInputFrom"
//                                                         name='purchase_date'
//                                                         value={fromDate ? fromDate.toString().split('T')[0] : ''}
//                                                         onChange={handleDateChangeFrom}
//                                                         style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
//                                                     />
//                                                     {
//                                                         date && <p className='text-danger'>{date}</p>
//                                                     }

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
//                                                     {
//                                                         invoice_id && <p className='text-danger'>{invoice_id}</p>
//                                                     }
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

// export default CreatePurchase;

'use client'
//ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const CreatePurchase = () => {
    const [supplierId, setSupplierId] = useState('');
    const [supplier, setSupplier] = useState('');

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

    const [numToAdd, setNumToAdd] = useState(1);
    const [fields, setFields] = useState(
        [

            {
                product_id: '',
                ware_house: '',
                quantity: '',
                unit_id: '',
                purchase_price: '',
                sale_price: '',
                created_by: created,

            }

        ]);


    const [assetInfo, setAssetInfo] = useState(


        {
            total_amount: '',
            payable_amount: '',
            remarks: '',
            supplier_id: '',
            discount: '',
            due: '',
            paid_amount: '',
            purchase_invoice: '',
            invoice_id: '',
            purchase_date: '',
            previous_due: '',
            account: '',
            created_by: created,

        }

    );

    useEffect(() => {
        // Generate a 4-digit random number
        const randomInvoiceId = Math.floor(100000 + Math.random() * 900000);

        // Set the random number as the invoice_id
        setAssetInfo(prevInfo => ({
            ...prevInfo,
            invoice_id: randomInvoiceId.toString()
        }));
    }, []);
    useEffect(() => {
        // Generate a 4-digit random number
       
        // Set the random number as the invoice_id
        setAssetInfo(prevInfo => ({
            ...prevInfo,
            previous_due: prev_due
        }));
    }, [prev_due]);

    const handleAddMore = () => {
        const numToAddInt = parseInt(numToAdd);
        if (!isNaN(numToAddInt) && numToAddInt > 0) {
            const newInputValues = [...fields];
            for (let i = 0; i < numToAddInt; i++) {
                newInputValues.push({
                    product_id: '', ware_house: '', quantity: '', unit_id: '', purchase_price: '', sale_price: '', created_by: created
                });
            }
            setFields(newInputValues);
            setNumToAdd(1);
        }
    };

    const totalPurchasePrice = fields.reduce((sum, field) => sum + (parseFloat(field.purchase_price) || 0), 0);
    const totalSalePrice = fields.reduce((sum, field) => sum + (parseFloat(field.sale_price * field.quantity) || 0), 0);

    console.log(totalSalePrice)
    console.log(totalPurchasePrice)


    useEffect(() => {

        setAssetInfo(prevState => ({
            ...prevState,
            total_amount: parseFloat(totalSalePrice)
            // - parseFloat(assetInfo.discount ? assetInfo.discount : 0)
        }));
    }, [totalSalePrice, assetInfo.discount]);

    useEffect(() => {

        setAssetInfo(prevState => ({
            ...prevState,
            due: assetInfo.payable_amount - assetInfo.discount - assetInfo.paid_amount
            // parseFloat(assetInfo.payable_amount) - parseFloat(assetInfo.discount) - parseFloat(assetInfo.paid_amount)
            // - parseFloat(assetInfo.discount ? assetInfo.discount : 0)
        }));
    }, [assetInfo.payable_amount, assetInfo.discount, assetInfo.paid_amount]);


    useEffect(() => {

        setAssetInfo(prevState => ({
            ...prevState,
            payable_amount: parseFloat(totalSalePrice) + prev_due
            // - parseFloat(assetInfo.discount ? assetInfo.discount : 0)
        }));
    }, [totalSalePrice, prev_due]);


    useEffect(() => {

        setAssetInfo(prevState => ({
            ...prevState,
            paid_amount: parseFloat(assetInfo.payable_amount) - parseFloat(assetInfo.discount ? assetInfo.discount : 0)
        }));
    }, [assetInfo.payable_amount, assetInfo.discount]);


    const handleRemoveField = (index) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };

    // useEffect(() => {
    //     setFields(prevFields => prevFields.map(field => ({
    //         ...field,
    //         supplier_id: supplier_id
    //     })));
    // }, [supplier_id]);


    const [expenseDate, setExpenseDate] = useState('');

    const [date, setDate] = useState('');


    const [fromDate, setFromDate] = useState('');

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    };
    const handleTextInputClick = () => {
        document.getElementById('dateInputFrom').showPicker();
    };
    const handleDateChangeFrom = (event) => {
        const selectedDate = new Date(event.target.value);
        setFromDate(selectedDate);
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const year = String(selectedDate.getFullYear());
        const formattedDate = `${year}-${month}-${day}`;
        setAssetInfo((prevAssetInfo) => ({
            ...prevAssetInfo,
            purchase_date: formattedDate
        }));
        if (formattedDate) {
            setDate('')
        }
    };


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

    const brand_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...assetInfo }
        attribute[name] = value


        const supplier_id = attribute['supplier_id'];
        if (supplier_id) {
            setSuppliers(""); // Clear the error message

        }
        setAssetInfo(attribute)

    };

    const handleChange = (index, event) => {
        const newFields = [...fields];
        if (event.target.type === 'file') {
            newFields[index][event.target.name] = event.target.files[0];
        } else {
            newFields[index][event.target.name] = event.target.value;
        }

        const product_id = newFields[index]['product_id'];
        if (product_id) {
            setProduct_id(""); // Clear the error message

        }
        const quantity = newFields[index]['quantity'];
        if (quantity) {
            setQuantity(""); // Clear the error message

        }

        const unit_id = newFields[index]['unit_id'];
        if (unit_id) {
            setUnit_id(""); // Clear the error message

        }
        const purchase_price = newFields[index]['purchase_price'];
        if (purchase_price) {
            setPurchase_price(""); // Clear the error message

        }

        const sale_price = newFields[index]['sale_price'];
        if (sale_price) {
            setSale_price(""); // Clear the error message

        }

        setFields(newFields);
    };

    const router = useRouter()

    const [suppliers, setSuppliers] = useState('')
    const [product_id, setProduct_id] = useState('')
    const [quantity, setQuantity] = useState('')
    const [unit_id, setUnit_id] = useState('')
    const [purchase_price, setPurchase_price] = useState('')
    const [sale_price, setSale_price] = useState('')

    const purchase_create = (event) => {
        event.preventDefault();



        const brandErrors = new Array(fields.length).fill('');
        const isValidBrand = fields.every((inputValue, index) => {
            if (!inputValue.product_id.trim()) {
                brandErrors[index] = 'This field is required';
                return false;
            }
            return true;
        });

        if (!isValidBrand) {
            setProduct_id(brandErrors);
            return;
        }
        setProduct_id(new Array(fields.length).fill(''));

        const errorsQuantity = new Array(fields.length).fill('');
        const isValidQuantity = fields.every((inputValue, index) => {
            if (!inputValue.quantity.trim()) {
                errorsQuantity[index] = 'This field is required';
                return false;
            }
            return true;
        });

        if (!isValidQuantity) {
            setQuantity(errorsQuantity);
            return;
        }
        setQuantity(new Array(fields.length).fill(''));

        const errorsUnit = new Array(fields.length).fill('');
        const isValidUnit = fields.every((inputValue, index) => {
            if (!inputValue.unit_id.trim()) {
                errorsUnit[index] = 'This field is required';
                return false;
            }
            return true;
        });

        if (!isValidUnit) {
            setUnit_id(errorsUnit);
            return;
        }
        setUnit_id(new Array(fields.length).fill(''));


        const errorsPurchasePrice = new Array(fields.length).fill('');
        const isValidPurchasePrice = fields.every((inputValue, index) => {
            if (!inputValue.purchase_price.trim()) {
                errorsPurchasePrice[index] = 'This field is required';
                return false;
            }
            return true;
        });

        if (!isValidPurchasePrice) {
            setPurchase_price(errorsPurchasePrice);
            return;
        }
        setPurchase_price(new Array(fields.length).fill(''));



        const errorsSalePrice = new Array(fields.length).fill('');
        const isValidSalePrice = fields.every((inputValue, index) => {
            if (!inputValue.sale_price.trim()) {
                errorsSalePrice[index] = 'This field is required';
                return false;
            }
            return true;
        });

        if (!isValidSalePrice) {
            setSale_price(errorsSalePrice);
            return;
        }
        setSale_price(new Array(fields.length).fill(''));




        const form = event.target;

        const supplier_id = form.supplier_id.value
        const purchase_date = expenseDate



        const allData = {
            fields, supplier_id, purchase_date, assetInfo
        }
        console.log(allData)

        if (!allData.supplier_id) {
            setSuppliers('This field is required')
            return
        }

        if (!assetInfo.purchase_date) {
            setDate('This field is required')
            return
        }


        //${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase_create/purchase_creates

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase_create/purchase_creates`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(allData),
        })
            .then((Response) => {

                Response.json()
                if (Response.ok === true) {
                    sessionStorage.setItem("message", "Data saved successfully!");
                    router.push('/Admin/purchase/purchase_all')
                    handlePrint()
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

    console.log(product_id)

    const handlePrint = () => {

        // Open a new window for printing
        const printWindow = window.open('', '_blank');

        // Start building the HTML content for printing
        let htmlContent = `
        <html>
            <head>
                <title>Pathshala School & College Purchase Invoice Form</title>
                <style>
                   
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                    thead {
                        background-color: gray; /* Set background color for table header */
                    }
                 
                    body {
                        text-align: center; /* Center align text within the body */
                    }
                </style>
            </head>
            <body>
            <h2 style="margin: 0; padding: 0;">Pathshala School & College Purchase Invoice Form</h2>
            <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
            <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
            <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>


            <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Purchase Invoice</h3>
            <div style="display: flex; justify-content: space-between;">
            <p style="margin: 0; padding: 0;">Receipt No: 829</p>
            <p style="margin: 0; padding: 0;">Collected By: পাঠশালা স্কুল এন্ড কলেজ</p>
            <p style="margin: 0; padding: 0;">Date: ${assetInfo.purchase_date}</p>
        </div>
                <table>
                    <thead>
                        <tr>
                           
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Total Amount</th>
        
                        </tr>
                    </thead>
                    <tbody>
    `;


        // Collect data from form fields and construct the rows for printing
        const form = document.querySelector('.form-horizontal');
        const formData = new FormData(form);

        // Initialize total amount variable
        let totalAmount = 0;

        // Get the number of rows (assuming item names determine the number of rows)
        const rowCount = formData.getAll('product_id').length;

        // Iterate over each row and print the corresponding data
        for (let i = 0; i < rowCount; i++) {
            // Get the data for the current row
            const itemName = formData.getAll('product_id')[i];
            const quantity = formData.getAll('quantity')[i];
            const units = formData.getAll('unit_id')[i];
            const salePrice = formData.getAll('sale_price')[i];
            const productName = products.find(product => product.id == itemName)
            const unitName = unit.find(product => product.id == units)

            // Add a table row with the data
            htmlContent += `
                <tr>
                    <td>${productName?.product_name}</td>
                    <td>${quantity}</td>
                    <td>${unitName.unit_name}</td>
                    <td>${salePrice}</td>
                   
                </tr>
            `;

            // Accumulate total amount
            totalAmount += parseFloat(salePrice);
        }

        // Finish building HTML content
        htmlContent += `
                        </tbody>
                        <tfoot>
                           
                            <tr>
                                <td colspan="3">Due Amount:</td>
                                <td>${assetInfo.due}</td>
                              
                            </tr>
                            <tr>
                                <td colspan="3">Discount Amount:</td>
                                <td>${assetInfo.discount}</td>
                                
                            </tr>
                             <tr>
                                <td colspan="3">Paid Amount:</td>
                                <td>${assetInfo.paid_amount}</td>
                          
                            </tr>
                            
                            </tfoot>
                            </table>
                            <footer>
                          
                            
                            </footer>
                </body>
            </html>
        `;

        // Write HTML content to the print window and print it
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
    };




    const [selectedData, setSelectedData] = useState({ amount: 0 }); // Example data

    useEffect(() => {
        if (assetInfo.account) {
            const item = account_head.find(item => item.id === parseInt(assetInfo.account));
            if (item) {
                const updatedItem = {
                    ...item,
                    amount: (item.amount || 0) - parseFloat(assetInfo.payable_amount) // Add 100 to amount, 
                };
                setSelectedData(updatedItem); // Set only the matching item
            } else {
                setSelectedData(null); // Clear if no match
            }
        }
    }, [account_head, assetInfo.payable_amount, assetInfo.account]); // Trigger when selectedEntryType changes

    console.log(selectedData)
    console.log(assetInfo.account)




    const account_head_amount_update = (e) => {
        e.preventDefault();

        const payload = {
            selectedData: selectedData,
            selectedEntryType: assetInfo.account
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
        setSelectedWareHouse(e.target.value);
        // সকল fields আপডেট করতে হলে:
        const updatedFields = fields.map((field) => ({
            ...field,
            ware_house: e.target.value,
        }));
        setFields(updatedFields);
    };

    return (
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>

                        <div className="card-default">


                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Create Purchase</h5>
                                <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
                                    <Link href={`/Admin/purchase/purchase_all?page_group=${page_group}`} className="btn btn-sm btn-info">Purchase List</Link>
                                </div>
                            </div>
                            <>
                                <form className="form-horizontal" method="post" autoComplete="off"

                                    onSubmit={(e) => { purchase_create(e); account_head_amount_update(e); }}

                                // onSubmit={purchase_create}

                                >

                                    <div class="d-lg-flex md:d-md-flex justify-content-between px-3 mt-3">

                                        <div class=" ">
                                            <div className='col-md-12'>

                                                <h5>Supplier,<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></h5>
                                                <div>
                                                    <select onChange={(e) => supplier_id(e.target.value)} name="supplier_id" className="form-control form-control-sm mb-2" id="supplier_id">
                                                        <option value=''>Select Supplier</option>
                                                        {
                                                            supplierss.map((supplier) => (
                                                                <>
                                                                    <option value={supplier.id}>{supplier.name}</option>

                                                                </>

                                                            ))
                                                        }

                                                    </select>
                                                    {
                                                        suppliers && <p className='text-danger'>{suppliers}</p>
                                                    }

                                                </div>
                                            </div>
                                            <div className='col-md-12'>

                                                <h5>Purchase Date,<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></h5>
                                                <div>

                                                    <input
                                                        className="form-control form-control-sm"
                                                        type="text"
                                                        id="fromDate"
                                                        name='purchase_date'
                                                        placeholder='dd--mm--yyyy'
                                                        value={fromDate ? formatDate(fromDate) : ''}
                                                        onClick={handleTextInputClick}
                                                        readOnly
                                                    />
                                                    <input
                                                        type="date"
                                                        id="dateInputFrom"
                                                        name='purchase_date'
                                                        value={fromDate ? fromDate.toString().split('T')[0] : ''}
                                                        onChange={handleDateChangeFrom}
                                                        style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                    />
                                                    {
                                                        date && <p className='text-danger'>{date}</p>
                                                    }
                                                </div>
                                            </div>


                                        </div>
                                        <div class=" ">

                                            <div className='col-md-12'>

                                                <h5>Purchase Invoice</h5>
                                                <div>

                                                    <input
                                                        placeholder='Enter Purchase Invoice'
                                                        className="form-control form-control-sm"
                                                        onChange={brand_input_change}
                                                        type="text" name="purchase_invoice" id="" value={assetInfo.purchase_invoice} />
                                                </div>
                                            </div>


                                        </div>


                                    </div>



                                    <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                        (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                    </div>



                                    <div className="card-body">
                                        <div>
                                            <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary text-white">

                                                <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
                                                    <strong>Product Information</strong>
                                                </div>

                                                <div className="card-title card-header-color font-weight-bold mb-0 float-right">
                                                    <div className="input-group printable">
                                                        <input
                                                            style={{ width: '80px' }}
                                                            type="number"
                                                            min="1"
                                                            className="form-control form-control-sm"
                                                            placeholder="Enter number of forms to add"
                                                            value={numToAdd}
                                                            onChange={(event) => setNumToAdd(event.target.value)}
                                                        />
                                                        <div className="input-group-append">
                                                            <button
                                                                type="button"
                                                                className="btn btn-info btn-sm py-1 add_more "
                                                                onClick={handleAddMore}
                                                            >
                                                                Add More
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="table-responsive">
                                                    <table className="table table-bordered  table-hover table-striped table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    Product Name: <small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>
                                                                </th>
                                                                
                                                                <th style={{width:'200px'}}>
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
                                                                    


                                                           
                                                                <th>
                                                                    Quantity:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>
                                                                </th>
                                                                <th>
                                                                    Unit Name:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>
                                                                </th>
                                                                <th>
                                                                    Purchase Price:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>
                                                                </th>
                                                                <th>
                                                                    Sale Price:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>
                                                                </th>
                                                                <th>
                                                                    Total Price:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>
                                                                </th>


                                                                <th>
                                                                    Action
                                                                </th>
                                                            </tr>

                                                        </thead>

                                                        <tbody>

                                                            {/* {isLoading ? <div className='text-center'>
                                                                <div className='  text-center text-dark'>

                                                                    <FontAwesomeIcon style={{
                                                                        height: '33px',
                                                                        width: '33px',
                                                                    }} icon={faSpinner} spin />

                                                                </div>
                                                            </div>

                                                                : */}


                                                                <>

                                                                    {
                                                                        fields.map((field, index) => (
                                                                            <>

                                                                                <tr >
                                                                                    <td>
                                                                                        <select

                                                                                            name="product_id"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            value={field.product_id}
                                                                                            onChange={(e) => handleChange(index, e)}>

                                                                                            <option value="">Select Product</option>
                                                                                            {
                                                                                                products.map((expense) => (
                                                                                                    <>
                                                                                                        <option value={expense.id}>{expense.product_name}</option>
                                                                                                    </>
                                                                                                ))
                                                                                            }

                                                                                        </select>
                                                                                        {
                                                                                            product_id[index] && <p className='text-danger'>{product_id}</p>
                                                                                        }

                                                                                    </td>

                                                                                    <td>
                                                                                        <select
                                                                                            name="ware_house"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            value={field.ware_house || selectedWareHouse} // সর্বজনীন ভ্যালু প্রয়োগ
                                                                                            onChange={(e) => handleChange(index, e)} // ইন্ডিভিজুয়াল হ্যান্ডলার
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
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="Enter Quantity "
                                                                                            value={field.quantity}
                                                                                            onChange={(e) => handleChange(index, e)}
                                                                                        />

                                                                                        {
                                                                                            quantity[index] && <p className='text-danger'>{quantity}</p>
                                                                                        }
                                                                                    </td>

                                                                                    <td>
                                                                                        <select

                                                                                            name="unit_id"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            value={field.unit_id}
                                                                                            onChange={(e) => handleChange(index, e)}>

                                                                                            <option value="">Select Unit</option>
                                                                                            {
                                                                                                unit.map((expense) => (
                                                                                                    <>
                                                                                                        <option value={expense.id}>{expense.unit_name}</option>
                                                                                                    </>
                                                                                                ))
                                                                                            }

                                                                                        </select>
                                                                                        {
                                                                                            unit_id[index] && <p className='text-danger'>{unit_id}</p>
                                                                                        }

                                                                                    </td>

                                                                                    <td>
                                                                                        <input
                                                                                            type="number"

                                                                                            name="purchase_price"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="Enter purchase price "
                                                                                            value={field.purchase_price}
                                                                                            onChange={(e) => handleChange(index, e)}
                                                                                        />
                                                                                        {
                                                                                            purchase_price[index] && <p className='text-danger'>{purchase_price}</p>
                                                                                        }
                                                                                    </td>

                                                                                    <td>
                                                                                        <input
                                                                                            type="number"

                                                                                            name="sale_price"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="Enter Sale price "
                                                                                            value={field.sale_price}
                                                                                            onChange={(e) => handleChange(index, e)}
                                                                                        />
                                                                                        {
                                                                                            sale_price[index] && <p className='text-danger'>{sale_price}</p>
                                                                                        }
                                                                                    </td>

                                                                                    <td>
                                                                                        <p>
                                                                                            {
                                                                                                parseFloat(field.quantity || 0) * parseFloat(field.sale_price || 0) || 0
                                                                                            }
                                                                                        </p>
                                                                                    </td>



                                                                                    <td> <button type="button" onClick={() => handleRemoveField(index)} className="btn btn-danger btn-sm float-lg-right float-md-right" ><FaTrash></FaTrash></button></td>

                                                                                </tr>
                                                                            </>
                                                                        ))
                                                                    }
                                                                </>
                                                            {/* // } */}
                                                        </tbody>

                                                    </table>




                                                </div>
                                                <div className="col-md-4 d-flex justify-content-end ml-auto">
                                                    <table className="table table-borderless">
                                                        <tbody>
                                                            <tr>
                                                                <td className="" colSpan="2">
                                                                    <strong>Sub Total:</strong>
                                                                </td>
                                                                <td className="text-right">
                                                                    <strong>{assetInfo?.total_amount ? assetInfo?.total_amount : 0} TK</strong>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="" colSpan="2">
                                                                    <strong>Previous Due:</strong>
                                                                </td>
                                                                <td className="text-right">
                                                                    <strong>{prev_due ? prev_due : 0} TK</strong>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="" colSpan="2">
                                                                    <strong>Payable Amount:</strong>
                                                                </td>
                                                                <td className="text-right">
                                                                    <strong>{assetInfo?.payable_amount ? assetInfo?.payable_amount : 0} TK</strong>
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
                                                                        value={assetInfo.discount ? assetInfo.discount : 0}
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
                                                                        value={assetInfo.remarks}
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
                                                                        value={assetInfo.paid_amount ? assetInfo.paid_amount : 0}
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="" colSpan="2">
                                                                    <strong>Paid By:</strong>
                                                                </td>
                                                                <td>
                                                                    <select
                                                                        value={assetInfo.account}
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
                                                                    <p className='text-right'>{assetInfo.due ? assetInfo.due : 0}</p>
                                                                    {/* <input
                                                                        readOnly
                                                                        placeholder="Enter Due"
                                                                        className="form-control form-control-sm text-right"
                                                                        type="text"
                                                                        name="due"
                                                                        value={assetInfo.due ? assetInfo.due : 0}
                                                                    /> */}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {/* <div className="">
                                                    <div class="form-group row student d-flex justify-content-end m-0">
                                                        <label class="col-form-label col-md-2">
                                                            <strong>Sub Total:</strong>
                                                        </label>
                                                        <div class="col-md-3">

                                                            <p className='text-right'>
                                                                <strong>
                                                                    {assetInfo?.total_amount ? assetInfo?.total_amount : 0}
                                                                    <span className=''> TK</span>
                                                                </strong>
                                                            </p>


                                                        </div>
                                                    </div>
                                                    <div class="form-group row student d-flex justify-content-end m-0">
                                                        <label class="col-form-label col-md-2">
                                                            <strong>Previous Due:</strong>
                                                        </label>
                                                        <div class="col-md-3">

                                                            <p className='text-right'>
                                                                <strong>
                                                                    {prev_due ? prev_due : 0}
                                                                    <span className=''> TK</span>
                                                                </strong>
                                                            </p>


                                                        </div>
                                                    </div>
                                                    <div class="form-group row student d-flex justify-content-end m-0">
                                                        <label class="col-form-label col-md-2">
                                                            <strong>Payable Amount:</strong>
                                                        </label>
                                                        <div class="col-md-3">

                                                            <p className='text-right'>
                                                                <strong>
                                                                    {assetInfo?.payable_amount ? assetInfo?.payable_amount : 0}
                                                                    <span className=''> TK</span>
                                                                </strong>
                                                            </p>


                                                        </div>
                                                    </div>
                                                    <div class="form-group row student d-flex justify-content-end m-0">
                                                        <label class="col-form-label col-md-2">
                                                            <strong>Discount:</strong>
                                                        </label>
                                                        <div class="col-md-3">

                                                            <input
                                                                placeholder='Enter Discount'
                                                                className="form-control form-control-sm text-right"
                                                                onChange={brand_input_change}
                                                                type="text" name="discount" id="" value={assetInfo.discount ? assetInfo.discount : 0} />

                                                        </div>
                                                    </div>
                                                    <div class="form-group row student d-flex justify-content-end m-0">
                                                        <label class="col-form-label col-md-2">
                                                            <strong>Remarks:</strong>
                                                        </label>
                                                        <div class="col-md-3">

                                                            <input
                                                                placeholder='Enter Reamrks'
                                                                className="form-control form-control-sm "
                                                                onChange={brand_input_change}
                                                                type="text" name="remarks" id="" value={assetInfo.remarks} />

                                                        </div>
                                                    </div>
                                                    <div class="form-group row student d-flex justify-content-end m-0">
                                                        <label class="col-form-label col-md-2">
                                                            <strong>Paid Amount:</strong>
                                                        </label>
                                                        <div class="col-md-3">
                                                            
                                                            <input

                                                                className="form-control form-control-sm text-right"
                                                                onChange={brand_input_change}
                                                                type="text" name="paid_amount" id="" value={assetInfo.paid_amount ? assetInfo.paid_amount : 0} />

                                                        </div>
                                                    </div>
                                                    <div class="form-group row student d-flex justify-content-end m-0">
                                                        <label class="col-form-label col-md-2">
                                                            <strong>Paid By:</strong>
                                                        </label>
                                                        <div class="col-md-3">

                                                            <select
                                                                value={assetInfo.account} onChange={brand_input_change}
                                                                name='account'

                                                                class="form-control form-control-sm " placeholder="Enter Role Name">
                                                                <option value=''>Select Account</option>
                                                                {
                                                                    account_head.map(sta =>
                                                                        <>

                                                                            <option value={sta.id}>{sta.account_head_name}</option>
                                                                        </>

                                                                    )
                                                                }
                                                            </select>

                                                        </div>
                                                    </div>
                                                    <div class="form-group row student d-flex justify-content-end m-0">
                                                        <label class="col-form-label col-md-2">
                                                            <strong>Total Due:</strong>
                                                        </label>
                                                        <div class="col-md-3">

                                                            <input
                                                                readOnly
                                                                placeholder='Enter Due'
                                                                className="form-control form-control-sm text-right"
                                                                onChange={brand_input_change}
                                                                type="text" name="due" id="" value={assetInfo.due ? assetInfo.due : 0} />

                                                        </div>
                                                    </div>




                                                </div> */}

                                                <div className="form-group row">
                                                    <div className="offset-md-3 col-sm-6">

                                                    </div>
                                                    <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                                </div>
                                            </div>
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

export default CreatePurchase;
