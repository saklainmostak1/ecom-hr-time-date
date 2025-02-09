'use client'
//ismile
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-dropdown-select';
import { FaTrash } from 'react-icons/fa';

const SaleUpdate = ({ id }) => {
    const [searchResults, setSearchResults] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [barcode, setBarcode] = useState('')
    const [category, setCategory] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_all`)
            .then(res => res.json())
            .then(data => setCategory(data))
    }, [])

    console.log(category)

    const [subCategory, setSubCategory] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sub_category/sub_category_all`)
            .then(res => res.json())
            .then(data => setSubCategory(data))
    }, [])

    console.log(subCategory)

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(''); // For storing the selected product ID
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);

        // Filter subcategories based on category_id
        const filteredSubs = subCategory.filter(
            subCat => subCat.category_id === parseInt(categoryId)
        );
        setFilteredSubCategories(filteredSubs);

        // Reset subcategory, products, and selected product
        setSelectedSubCategory('');
        setFilteredProducts([]);
        setSelectedProduct('');
    };

    const handleSubCategoryChange = (e) => {
        const subCategoryId = e.target.value;
        setSelectedSubCategory(subCategoryId);

        // Filter products based on sub_category_id
        const filteredProds = products.filter(
            product => product.sub_category_id === parseInt(subCategoryId)
        );
        setFilteredProducts(filteredProds);

        // Reset selected product
        setSelectedProduct('');
    };

    // const handleProductChange = (selectedOption) => {
    //     setSelectedProduct(selectedOption); // React-select returns the entire selected object
    //     setBarcode(selectedOption[0]?.value)
    //     // loan_search()
    //     console.log("Selected Product:", selectedOption);
    // };

    const handleProductChange = (selectedOption) => {
        setSelectedProduct(selectedOption); // React-select returns the entire selected object
        const selectedBarcode = selectedOption[0]?.value;  // Get the barcode value from the selected product
        const formattedBarcode = selectedBarcode?.toString().padStart(13, '0');

        if (formattedBarcode) {
            loan_search(formattedBarcode);
        }

        console.log("Selected Product:", selectedOption);
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


    const [assetInfo, setAssetInfo] = useState(


        {
            mobile: '',
            previous_due: '',
            email: '',
            full_name: '',
            total_amount: '',
            payable_amount: '',
            remarks: '',
            discount: '',
            due: '',
            paid_amount: '',
            invoice_id: '',
            sale_date: '',
            account: '',
            sale_id: '',
            modified_by: created,

        }

    );

    console.log(assetInfo)

    const { data: saleProductSingle = [] } = useQuery({
        queryKey: ['saleProductSingle'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sales_list/${id}`);
            const data = await res.json();
            return data;
        }
    });


    const { data: products = [],
    } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_list`)

            const data = await res.json()
            return data
        }
    })



    useEffect(() => {
        const purchaseData = saleProductSingle[0] || {};

        // Common fields
        const existingProducts = purchaseData.sale_product || [];

        // Filter searchResults to exclude items with matching barcodes
        const filteredSearchResults = searchResults?.filter(
            (searchItem) =>
                !existingProducts?.some(
                    (existingItem) => existingItem?.barcode == searchItem?.barcode
                )
        );

        // Combine unique items with existing sale_product
        const combinedFields = [
            ...existingProducts,
            ...filteredSearchResults
        ];

        // const combinedFields = [
        //     ...(purchaseData.sale_product || []), // Existing sale_product data
        //     ...searchResults // Add all items from searchResults
        // ];

        let updatedAssetInfo = {

            mobile: purchaseData.mobile,
            previous_due: purchaseData.previous_due,
            email: purchaseData.email,
            full_name: purchaseData.full_name,
            total_amount: purchaseData.total_amount,
            payable_amount: purchaseData.payable_amount,
            remarks: purchaseData.remarks,
            discount: purchaseData.discount,
            due: purchaseData.due,
            paid_amount: purchaseData.paid_amount,
            invoice_id: purchaseData.invoice_id,
            sale_date: purchaseData.sale_date,
            account: purchaseData.account,
            user_id: purchaseData.user_id,
            modified_by: created,
            sale_id: purchaseData?.sale_id,
            fields: combinedFields
        };

        setAssetInfo(updatedAssetInfo);
    }, [saleProductSingle, created, searchResults]);

    const { data: usersAll = [], } = useQuery({
        queryKey: ['usersAll'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/allUser`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });


    // const [supplierId, setSupplierId] = useState('')


    const supplierIds = usersAll.find(user => user.mobile == assetInfo?.mobile)
    const supplierId = supplierIds ? supplierIds.id : ''
    // console.log(supplierIds.id)
    // Dynamically generate API endpoint based on selected supplierId
    const api = supplierId ? `/Admin/loan/users_due_amount_sale/${supplierId}` : '';

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

    // const prev_due = supplierLastDue?.payable_amount - supplierLastDue?.paid_amount - supplierLastDue?.discount;
    const prev_due = 0;
    // const prev_due = (supplierLastDue?.total_amount) - (supplierLastDue?.paid_amount + supplierLastDue?.discount);



    console.log(prev_due)


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
    const [stockOut, setStockOut] = useState('')
    const loan_search = (barcodes) => {
        setLoading(true);

        const codes = barcode ? barcode : barcodes;

        if (barcodes === '') {
            alert('Enter A Product');
            setLoading(false);
            return;
        }

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sales_search`, {
            barcode: codes,
        })
            .then(response => {
                setError(null);
                setLoading(false);

                const newResults = response.data.results;

                if (newResults.length === 0) {
                    alert('Nothing found!');
                    setBarcode('');
                } else {
                    setSearchResults(prevResults => {
                        // Create a new array to store products to be added
                        const filteredNewResults = [];

                        newResults.forEach(newResult => {
                            const matchingProduct = purchase_product.find(product => product.product_id === newResult.product_id);
                            const matchingProducts = sale_product.filter(product => product.product_id === newResult.product_id);
                            const totalQuantity = matchingProducts.reduce((sum, product) => sum + product.quantity, 0);

                            // Check if the product is out of stock
                            const quantityDifference = parseFloat(matchingProduct?.quantity) - parseFloat(totalQuantity);

                            // Check if the product is not already in the previous results
                            const isAlreadyInResults = prevResults?.some(prevResult => prevResult.barcode === newResult.barcode);

                            if (quantityDifference === 0) {
                                // Set stock out message, but do not include the product in the results
                                setStockOut('Out of stock');
                                return
                            } else if (!isAlreadyInResults) {
                                // If product is in stock and not already in results, include it in filtered results
                                filteredNewResults.push({
                                    ...newResult,
                                    new_sale_price: 0,
                                    quantity: 0,
                                    new_quantity: 0,
                                    sale_price: 0,
                                });
                                setStockOut(''); // Clear stock out message
                            }
                            else {
                                setStockOut('');
                            }
                        });

                        // Add the new products to the existing search results
                        setBarcode('');
                        return [...prevResults, ...filteredNewResults];
                    });
                    // setSearchResults(prevResults => {
                    //     const filteredNewResults = newResults?.filter(newResult =>
                    //         !prevResults?.some(prevResult => prevResult.barcode === newResult.barcode)
                    //     );

                    //     // Add new_sale_price as 0 by default for new results
                    //     const resultsWithPrice = filteredNewResults.map(item => ({
                    //         ...item,
                    //         new_sale_price: 0,
                    //         quantity: 0,
                    //         new_quantity: 0,
                    //         sale_price: 0,
                    //     }));

                    //     setBarcode('');
                    //     return [...prevResults, ...resultsWithPrice];
                    // });
                }
            })
            .catch(error => {
                setError("An error occurred during search.");
                setSearchResults([]);
            });
    };

    // const loan_search = (barcodes) => {
    //     setLoading(true);

    //     const codes = barcode ? barcode : barcodes

    //     if (barcodes === '') {
    //         alert('Enter A Product');
    //         setLoading(false);
    //         return;
    //     }

    //     axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sales_search`, {
    //         barcode: codes
    //     })
    //         .then(response => {
    //             setError(null);
    //             setLoading(false);

    //             const newResults = response.data.results;

    //             if (newResults.length === 0) {
    //                 alert('Nothing found!');
    //                 setBarcode('');
    //             } else {
    //                 // Update the state by merging new and old results if they have unique barcodes
    //                 setSearchResults(prevResults => {
    //                     // Filter out any new result that already exists in previous results by barcode
    //                     const filteredNewResults = newResults?.filter(newResult =>
    //                         !prevResults?.some(prevResult => prevResult.barcode === newResult.barcode)
    //                     );
    //                     setBarcode('');
    //                     // Return combined unique results
    //                     return [...prevResults, ...filteredNewResults];
    //                 });
    //             }
    //         })
    //         .catch(error => {
    //             setError("An error occurred during search.");
    //             setSearchResults([]);
    //         });
    // };

    console.log(searchResults)

    useEffect(() => {
        // Generate a 4-digit random number
        const randomInvoiceId = Math.floor(100000 + Math.random() * 900000);

        // Set the random number as the invoice_id
        setAssetInfo(prevInfo => ({
            ...prevInfo,
            invoice_id: randomInvoiceId.toString()
        }));
    }, []);



    // // const totalSalePrice = searchResults?.reduce((sum, field) => sum + (parseFloat(field.sale_price) || 0), 0) 
    // const totalSalePrice = assetInfo?.fields?.reduce((sum, field) => sum + (parseFloat(field.sale_price) || 0), 0)

    // console.log(totalSalePrice)
    // // console.log(totalSalePrices)




    // useEffect(() => {

    //     setAssetInfo(prevState => ({
    //         ...prevState,
    //         total_amount: parseFloat(totalSalePrice)
    //         // - parseFloat(assetInfo.discount ? assetInfo.discount : 0)
    //     }));
    // }, [totalSalePrice]);

    // useEffect(() => {

    //     setAssetInfo(prevState => ({
    //         ...prevState,
    //         due: parseFloat(assetInfo.payable_amount) - parseFloat(assetInfo.discount) - parseFloat(assetInfo.paid_amount ? assetInfo.paid_amount : 0)
    //         // - parseFloat(assetInfo.discount ? assetInfo.discount : 0)
    //     }));
    // }, [assetInfo.payable_amount, assetInfo.discount, assetInfo.paid_amount]);


    // useEffect(() => {

    //     setAssetInfo(prevState => ({
    //         ...prevState,
    //         payable_amount: parseFloat(totalSalePrice) + parseFloat(prev_due ? prev_due : 0)
    //         // - parseFloat(assetInfo.discount ? assetInfo.discount : 0)
    //     }));
    // }, [totalSalePrice, prev_due]);


    // useEffect(() => {

    //     setAssetInfo(prevState => ({
    //         ...prevState,
    //         paid_amount: parseFloat(assetInfo.payable_amount) - (parseFloat(assetInfo.discount ) + parseFloat(assetInfo.due ))
    //     }));
    // }, [assetInfo.payable_amount, assetInfo.discount, assetInfo.due]);


    useEffect(() => {
        setAssetInfo(prevState => {
            // Safely retrieve values and provide default fallbacks
            const totalSalePrice = prevState.fields?.reduce((sum, field) => sum + (parseFloat(field.sale_price) || 0), 0) || 0;
            const discount = parseFloat(prevState.discount || 0);
            const prevDue = parseFloat(prevState.prev_due || 0);
            const paidAmount = parseFloat(prevState.paid_amount || 0);

            // Calculate payable_amount first
            const payableAmount = totalSalePrice + assetInfo.previous_due;

            // Calculate due
            const due = payableAmount - (discount + paidAmount);

            // Return updated state
            return {
                ...prevState,
                total_amount: totalSalePrice,
                payable_amount: payableAmount,
                due: due,
                // No adjustment to paid_amount here to avoid circular updates
            };
        });
    }, [assetInfo.fields, assetInfo.discount, assetInfo.prev_due, assetInfo.paid_amount, assetInfo.due, assetInfo.previous_due]);


    // Debugging logs (optional)
    useEffect(() => {
        console.log("Updated assetInfo:", assetInfo);
    }, [assetInfo]);




    const [formattedDisplayDate, setFormattedDisplayDate] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [date, setDate] = useState('');
    const handleDateSelection = (event) => {
        const inputDate = event.target.value; // Directly get the value from the input

        const day = String(inputDate.split('-')[2]).padStart(2, '0'); // Extract day, month, and year from the date string
        const month = String(inputDate.split('-')[1]).padStart(2, '0');
        const year = String(inputDate.split('-')[0]);
        const formattedDate = `${day}-${month}-${year}`;
        const formattedDatabaseDate = `${year}-${month}-${day}`;
        setFromDate(formattedDate);
        setAssetInfo(prevData => ({
            ...prevData,
            sale_date: formattedDatabaseDate // Update the dob field in the state
        }));
        // if (formattedDatabaseDate) {
        //     setPayment_date('')
        // }
    };

    useEffect(() => {
        const dob = assetInfo.sale_date;
        const formattedDate = dob?.split('T')[0];

        if (formattedDate?.includes('-')) {
            const [year, month, day] = formattedDate.split('-');
            setFormattedDisplayDate(`${day}-${month}-${year}`);
        } else {
            console.log("Date format is incorrect:", formattedDate);
        }
    }, [assetInfo]);


    const { data: supplierss = [], isLoading } = useQuery({
        queryKey: ['supplier'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/supplier/supplier_list`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });



    const brand_input_change = (event, index) => {
        const { name, value } = event.target;
        setAssetInfo(prevState => {
            const updatedFields = [...prevState.fields];
            updatedFields[index] = {
                ...updatedFields[index],
                [name]: value
            };
            return { ...prevState, fields: updatedFields };
        });
    };

    // const brand_input_change = (event, index) => {
    //     const { name, value } = event.target;

    //     // Create a copy of the current searchResults state
    //     const updatedResults = [...searchResults];

    //     // Update the specific field's property based on the index
    //     updatedResults[index] = {
    //         ...updatedResults[index],
    //         [name]: value
    //     };

    //     // Update the state
    //     setSearchResults(updatedResults);
    // };


    const brand_input_changes = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...assetInfo }
        attribute[name] = value
        setAssetInfo(attribute)
        // setSameBrandName('')



    };


    const router = useRouter()

    const [suppliers, setSuppliers] = useState('')
    const [product_id, setProduct_id] = useState('')
    const [quantity, setQuantity] = useState('')
    const [unit_id, setUnit_id] = useState('')
    const [purchase_price, setPurchase_price] = useState('')
    const [sale_price, setSale_price] = useState('')


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
                    <p style="margin: 0; padding: 0;">Date: ${assetInfo.sale_date}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Discount</th>
                            <th>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Collect data from form fields and construct the rows for printing


        // Initialize total amount variable
        let totalAmount = 0;

        // Iterate over each product ID using forEach without index
        searchResults.forEach((itemId) => {
            const quantity = itemId.quantity;
            const discount = itemId.new_discount;
            const salePrice = itemId.sale_price;

            // const quantity = itemId.new_quantity;
            // const discount = itemId.new_discount;
            // const salePrice = itemId.new_sale_price;

            const productName = products.find(product => product.id == itemId.product_id);

            // Add a table row with the data
            htmlContent += `
                <tr>
                    <td>${productName?.product_name}</td>
                    <td>${quantity}</td>
                    <td>${discount}</td>
                    <td>${salePrice}</td>
                </tr>
            `;

            // Accumulate total amount
            totalAmount += parseFloat(salePrice);
        });

        // Finish building HTML content
        htmlContent += `
        </tbody>
       
    </table>
   <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
<div style="text-align: right; font-size:7.5px;">
<h1>Total Amount: ${totalAmount.toFixed(2)}</h1>
<h1>Due Amount: ${assetInfo.due ? assetInfo.due : 0}</h1>
<h1>Discount Amount: ${assetInfo.discount ? assetInfo.discount : 0}</h1>
<h1><strong>Paid Amount: ${assetInfo.paid_amount}</strong></h1>
</div>
</div>
</body>
</html>
`;


        // Write HTML content to the print window and print it
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
    };


    const purchase_create = (event) => {
        event.preventDefault();


        const allData = {
            assetInfo
        }
console.log(allData)

        //${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase_create/purchase_creates

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_edit/${id}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(allData),
        })
            .then((Response) => {

                Response.json()
                if (Response) {
                    sessionStorage.setItem("message", "Data saved successfully!");
                    // router.push('/Admin/sales/sales_all')
                    // handlePrint()
                }
            })
            .then((data) => {
                console.log(data)

                if (data) {
                    sessionStorage.setItem("message", "Data saved successfully!");
                    // router.push('/Admin/sales/sales_all')
                    // handlePrint()
                }
            })
            .catch((error) => console.error(error));
        // }
    }



    console.log(searchResults);




    const [selectedData, setSelectedData] = useState({ amount: 0 }); // Example data

    useEffect(() => {
        if (assetInfo.account) {
            const item = account_head.find(item => item.id === parseInt(assetInfo.account));
            if (item) {
                const updatedItem = {
                    ...item,
                    amount: (item.amount || 0) + parseFloat(assetInfo.paid_amount) // Add 100 to amount, 
                };
                setSelectedData(updatedItem); // Set only the matching item
            } else {
                setSelectedData(null); // Clear if no match
            }
        }
    }, [account_head, assetInfo.paid_amount, assetInfo.account]); // Trigger when selectedEntryType changes

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


    // const barcodeInputRef = useRef(null);  // Create a ref for the input field

    // // Focus the input field when the component mounts or when needed
    // useEffect(() => {
    //     if (barcodeInputRef.current) {
    //         barcodeInputRef.current.focus();  // Set focus on the input field
    //     }
    // }, [barcode]);  // This will keep the input focused whenever the barcode changes

    // const handleBarcodeChange = (e) => {
    //     setBarcode(e.target.value);
    // };

    // const handleKeyDown = (e) => {
    //     // Prevent the page from reloading or submitting the form
    //     if (e.key === 'Enter') {
    //         e.preventDefault();  // Prevent default behavior (form submission or page reload)
    //         loan_search()
    //         setBarcode('')
    //         console.log('Barcode scanned:', barcode);
    //         // You can trigger any other actions, like processing the barcode or calling a function
    //     }
    // };
    const barcodeInputRef = useRef(null);  // Create a ref for the input field

    // Focus the input field when the component mounts or when needed
    useEffect(() => {
        if (barcodeInputRef.current) {
            barcodeInputRef.current.focus();  // Set focus on the input field
        }
    }, [barcode]);  // This will keep the input focused whenever the barcode changes

    // const handleBarcodeChange = (e) => {
    //     setBarcode(e.target.value);
    // };
    const handleBarcodeChange = (e) => {
        setBarcode(e.target.value);
    };
    const handleKeyDown = (e) => {
        // Prevent the page from reloading or submitting the form
        if (e.key === 'Enter') {
            e.preventDefault();  // Prevent default behavior (form submission or page reload)
            loan_search(barcode)
            setBarcode('')
            console.log('Barcode scanned:', barcode);
            // You can trigger any other actions, like processing the barcode or calling a function
        }
    };
    console.log(selectedProduct[0]?.value)
    console.log(barcode)


    const unit_delete = id => {

        console.log(id)
        const proceed = window.confirm(`Are You Sure delete${id}`)
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/loan/sale_product_delete/${id}`, {
                method: "POST",

            })
                .then(Response => Response.json())
                .then(data => {

                    if (data.affectedRows > 0) {
                        // all_unit()
                        console.log(data)
                    }
                })
        }
    }
    const { data: purchase_product = [], } = useQuery({
        queryKey: ['purchase_product'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase_product/purchase_product_list`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });
    const { data: sale_product = [], } = useQuery({
        queryKey: ['sale_product'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sales/sale_product_list`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });
    const [quantities, setQuantities] = useState({});


    // Handle quantity change
    // const handleQuantityChange = (event, index) => {
    //     const newQuantity = parseFloat(event.target.value) || 0;

    //     setQuantities(prevQuantities => ({
    //         ...prevQuantities,
    //         [index]: newQuantity
    //     }));

    //     // Update the corresponding new_sale_price in searchResults
    //     setSearchResults(prevResults =>
    //         prevResults.map((item, i) => {
    //             if (i === index) {
    //                 return {
    //                     ...item,
    //                     new_sale_price: parseFloat(item.sale_price) * newQuantity,
    //                 };
    //             }
    //             return item;
    //         })
    //     );
    // };

    const handleQuantityChange = (event, index) => {
        const newQuantity = parseFloat(event.target.value) || 0;

        // Update quantities
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [index]: newQuantity
        }));

        // Update assetInfo fields dynamically
        setAssetInfo(prevState => {
            const updatedFields = [...prevState.fields];
            const matchingProduct = purchase_product.find(product => product.product_id === updatedFields[index]?.product_id);

            if (matchingProduct) {
                updatedFields[index] = {
                    ...updatedFields[index],
                    quantity: newQuantity,
                    sale_price: (parseFloat(matchingProduct.sale_price) * newQuantity).toFixed(2),
                    new_sale_price: (parseFloat(matchingProduct.sale_price) * newQuantity).toFixed(2),
                };
            }
            return { ...prevState, fields: updatedFields };
        });
    };

    const handleDiscountChange = (event, index) => {
        const newDiscount = parseFloat(event.target.value) || 0;

        // Update `assetInfo.fields` with the discounted sale_price
        setAssetInfo(prevState => {
            const updatedFields = [...prevState.fields];
            const currentField = updatedFields[index];
            const originalSalePrice = parseFloat(currentField.original_sale_price || currentField.sale_price || 0);

            updatedFields[index] = {
                ...currentField,
                new_discount: newDiscount,
                sale_price: (originalSalePrice - newDiscount).toFixed(2), // Apply discount directly to sale_price
                new_sale_price: originalSalePrice, // Preserve the original sale_price for recalculation
            };

            return { ...prevState, fields: updatedFields };
        });
    };


    // const handleDiscountChange = (event, index) => {
    //     const newDiscount = parseFloat(event.target.value) || 0;

    //     setSearchResults(prevResults =>
    //         prevResults.map((item, i) => {
    //             if (i === index) {
    //                 // Calculate the updated final sale price after applying the discount
    //                 const totalPrice = parseFloat(item.sale_price) * (item.new_quantity || 0);
    //                 return {
    //                     ...item,
    //                     new_discount: newDiscount, // Add new_discount
    //                     new_sale_price: totalPrice - newDiscount // Update final price
    //                 };
    //             }
    //             return item;
    //         })
    //     );
    // };


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
        const updatedFields = assetInfo.fields.map((field) => ({
            ...field,
            ware_house_ids: selectedValue,
        }));

        // Update formData immutably
        setAssetInfo((prev) => ({
            ...prev,
            fields: updatedFields,
        }));
    };

    const handleQualificationChange = (index, e) => {
        const { name, value } = e.target;

        setAssetInfo((prevState) => {
            const updatedFields = [...prevState.fields];
            updatedFields[index] = {
                ...updatedFields[index],
                [name]: value
            };
            return {
                ...prevState,
                fields: updatedFields,
            };
        });
    };

    const { data: purchase_product_list_ware_house = [],
    } = useQuery({
        queryKey: ['purchase_product_list_ware_house'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase_product/purchase_product_list_ware_house`)

            const data = await res.json()
            return data
        }
    })

    return (
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>

                        <div className="card-default">


                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Update Sale</h5>
                                <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
                                    <Link href={`/Admin/sales/sales_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to Sale List</Link>
                                </div>
                            </div>
                            <>
                                <form className="form-horizontal" method="post" autoComplete="off"

                                    onSubmit={(e) => { purchase_create(e); account_head_amount_update(e); }}

                                // onSubmit={purchase_create}

                                >

                                    {/* <div class="d-lg-flex md:d-md-flex justify-content-between px-3 mt-3">

                                        <div class=" ">
                                            <div className='col-md-12'>


                                                <div >
                                                    <form >
                                                        <h5>Product</h5>
                                                        <div>


                                                            <input
                                                                ref={barcodeInputRef}  // Attach the ref to the input
                                                                placeholder="Enter Product/Barcode"
                                                                className="form-control form-control-sm"
                                                                value={barcode}
                                                                onChange={handleBarcodeChange}
                                                                onKeyDown={handleKeyDown}  // Detect Enter key press after scan
                                                                type="text"
                                                                name="purchase_invoice"
                                                                id=""
                                                            />
                                                        </div>
                                                        <input type="button" name="search" className="btn btn-sm btn-info mt-1" value="Search"
                                                            disabled={barcode === ''}
                                                            onClick={loan_search}
                                                        />
                                                    </form>
                                                </div>


                                            </div>
                                            <div className='col-md-12'>

                                                <h5>Sale Date,<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></h5>
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
                                                    {
                                                        date && <p className='text-danger'>{date}</p>
                                                    }
                                                </div>
                                            </div>


                                        </div>

                                    </div> */}

                                    <div class="d-lg-flex md:d-md-flex justify-content-between px-3 mt-3">
                                        <div className='col-md-12 d-flex'>
                                            <div class="col-md-3">
                                                <div class="input-group">
                                                    <div class="input-group-prepend" style={{ width: '100%' }}>


                                                        <input
                                                            ref={barcodeInputRef}  // Attach the ref to the input
                                                            placeholder="Enter Product/Barcode"
                                                            className="form-control form-control-sm"
                                                            value={barcode}
                                                            onChange={handleBarcodeChange}
                                                            onKeyDown={handleKeyDown}  // Detect Enter key press after scan
                                                            type="text"
                                                            name="purchase_invoice"
                                                            id=""
                                                        />
                                                        <input type="button" name="search" className="btn btn-sm btn-info" value="Search"
                                                            disabled={barcode === ''}
                                                            onClick={loan_search}
                                                        />

                                                    </div>

                                                </div>
                                                <p className='text-danger'>{stockOut}</p>
                                            </div>
                                            <div className='input-group mb-3 col-md-3'>
                                                <select
                                                    required=""
                                                    name="category_id"
                                                    className="form-control form-control-sm mb-2"
                                                    value={selectedCategory}
                                                    onChange={handleCategoryChange}
                                                >
                                                    <option value="">Select Category</option>
                                                    {category.map(cat => (
                                                        <option key={cat.id} value={cat.id}>
                                                            {cat.category_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='input-group mb-3 col-md-3'>
                                                <select
                                                    name="subCategoryFilter"
                                                    className="form-control form-control-sm"
                                                    value={selectedSubCategory}
                                                    onChange={handleSubCategoryChange}

                                                >
                                                    <option value="">Select SubCategory</option>
                                                    {filteredSubCategories.map(subCat => (
                                                        <option key={subCat.id} value={subCat.id}>
                                                            {subCat.sub_category_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className=' col-md-3'>

                                                <Select

                                                    name="productFilter"
                                                    options={filteredProducts.map(pro => ({
                                                        value: pro.barcode,
                                                        label: pro.product_name,
                                                    }))}
                                                    value={selectedProduct}
                                                    onChange={handleProductChange}
                                                    isSearchable={true}
                                                    // isDisabled={!filteredProducts.length} // Disable if no products available
                                                    placeholder="Select Product"
                                                />



                                            </div>
                                        </div>
                                    </div>

                                    <div class="d-lg-flex md:d-md-flex justify-content-between px-4">

                                        <div className='col-md-8 row'>
                                            <label htmlFor="fromDate" class="col-form-label col-md-3"><strong>Sale Date:</strong></label>
                                            <div className="col-md-5">
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
                                                {
                                                    date && <p className='text-danger'>{date}</p>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                        (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                    </div>
                                    <div class="d-lg-flex md:d-md-flex justify-content-between px-3 mt-3">

                                        <div class=" row col-md-12">
                                            <div className='col-md-4'>

                                                <h5>Full Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></h5>
                                                <div>
                                                    <input
                                                        onChange={brand_input_changes}
                                                        placeholder="Enter Full Name"
                                                        className="form-control form-control-sm"
                                                        value={assetInfo.full_name}
                                                        type="text"
                                                        name="full_name"
                                                        id=""
                                                        disabled
                                                    />
                                                </div>

                                            </div>
                                            <div className='col-md-4'>

                                                <h5>Mobile<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></h5>
                                                <div>
                                                    <input
                                                        onChange={brand_input_changes}
                                                        placeholder="Enter Mobile"
                                                        className="form-control form-control-sm"
                                                        value={assetInfo.mobile}
                                                        maxLength={11}
                                                        type="number"
                                                        name="mobile"
                                                        id=""
                                                        disabled
                                                    />

                                                </div>
                                            </div>
                                            <div className='col-md-4'>

                                                <h5>Email</h5>
                                                <div>
                                                    <input
                                                        onChange={brand_input_changes}
                                                        placeholder="Enter Email"
                                                        className="form-control form-control-sm"
                                                        value={assetInfo.email}
                                                        type="text"
                                                        name="email"
                                                        id=""
                                                        disabled
                                                    />

                                                </div>
                                            </div>


                                        </div>

                                    </div>

                                    <div className="card-body">
                                        <div>
                                            <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary text-white">

                                                <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
                                                    <strong>Product Information</strong>
                                                </div>


                                            </div>

                                            <div>
                                                <div className="table-responsive">
                                                    <table className="table table-bordered  table-hover table-striped table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    Barcode: <small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>
                                                                </th>
                                                                <th>
                                                                    Product Name: <small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>
                                                                </th>
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
                                                                <th>
                                                                    Stock:
                                                                </th>
                                                                <th>
                                                                    Unit Price:
                                                                </th>
                                                                <th>
                                                                    Quantity:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>
                                                                </th>


                                                                <th>
                                                                    Total  Price:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>
                                                                </th>
                                                                <th>
                                                                    Discount:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>
                                                                </th>
                                                                <th>
                                                                    Action
                                                                </th>



                                                            </tr>

                                                        </thead>

                                                        <tbody>

                                                            {isLoading ? <div className='text-center'>
                                                                <div className='  text-center text-dark'>

                                                                    <FontAwesomeIcon style={{
                                                                        height: '33px',
                                                                        width: '33px',
                                                                    }} icon={faSpinner} spin />

                                                                </div>
                                                            </div>

                                                                :
                                                                // <>
                                                                //     {assetInfo?.fields?.length > 0 ? (
                                                                //         assetInfo?.fields?.map((field, index) => {
                                                                //             const matchingProduct = purchase_product.find(product => product.product_id === field.product_id);
                                                                //             const matchingProducts = sale_product.filter(product => product.product_id === field.product_id);
                                                                //             const totalQuantity = matchingProducts.reduce((sum, product) => sum + product.quantity, 0);
                                                                //             return (
                                                                //                 <tr key={field.id}>
                                                                //                     <td>
                                                                //                         <p>{field.barcode}</p>
                                                                //                     </td>
                                                                //                     <td>
                                                                //                         <p>{field.product_name}</p>
                                                                //                     </td>
                                                                //                     <td>
                                                                //                         <p>

                                                                //                             {parseFloat(matchingProduct?.quantity) - parseFloat(totalQuantity)}
                                                                //                         </p>
                                                                //                     </td>
                                                                //                     <td>
                                                                //                         <input
                                                                //                             type="number"
                                                                //                             name="quantity"
                                                                //                             className="form-control form-control-sm mb-2"
                                                                //                             placeholder="Enter Quantity"
                                                                //                             value={quantities[index] ? quantities[index] : field.quantity  }
                                                                //                             onChange={(event) => {brand_input_change(event, index); handleQuantityChange(event, index)}}
                                                                //                         />

                                                                //                     </td>
                                                                //                     <td>
                                                                //                        <p>{matchingProduct?.sale_price}</p>
                                                                //                     </td>
                                                                //                     <td>
                                                                //                         <input
                                                                //                             type="number"
                                                                //                             name="sale_price"
                                                                //                             className="form-control form-control-sm mb-2"
                                                                //                             placeholder="Enter Sale price"
                                                                //                             value={field.sale_price ? field.sale_price : (parseFloat(field.sale_price) * (quantities[index] || 0)).toFixed(2)}
                                                                //                             onChange={(event) => brand_input_change(event, index)}
                                                                //                         />

                                                                //                     </td>
                                                                //                     <td>
                                                                //                         <button
                                                                //                             type="button"
                                                                //                             className="btn btn-danger btn-sm"
                                                                //                             onClick={() => unit_delete(field.id)}
                                                                //                         >
                                                                //                             <FaTrash />
                                                                //                         </button>
                                                                //                     </td>
                                                                //                 </tr>
                                                                //             );
                                                                //         })
                                                                //     ) : (
                                                                //         <p>No data Found</p>
                                                                //     )}
                                                                // </>
                                                                <>
                                                                    {assetInfo?.fields?.length > 0 ? (
                                                                        assetInfo?.fields?.map((field, index) => {
                                                                            const matchingProduct = purchase_product.find(product => product.product_id === field.product_id);
                                                                            const matchingProducts = sale_product.filter(product => product.product_id === field.product_id);
                                                                            const totalQuantity = matchingProducts.reduce((sum, product) => sum + product.quantity, 0);
                                                                            const matchingProductss = purchase_product.filter(product => product.product_id === field.product_id);
                                                                            const totalPurchaseQuantity = matchingProductss.reduce((sum, product) => sum + parseFloat(product.quantity || 0), 0);

                                                                            return (
                                                                                <tr key={field.id}>
                                                                                    <td>
                                                                                        <p>{field.barcode}</p>

                                                                                    </td>
                                                                                    <td>
                                                                                        <p>{field.product_name}</p>
                                                                                    </td>
                                                                                    <td>
                                                                                        {/* <select
                                                                                            name="ware_house_ids"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            value={field.ware_house_ids || selectedWareHouse} // সর্বজনীন ভ্যালু প্রয়োগ
                                                                                            onChange={(e) => handleQualificationChange(index, e)} // ইন্ডিভিজুয়াল হ্যান্ডলার
                                                                                        >
                                                                                            
                                                                                       
                                                                                            {ware_house_list
                                                                                                .filter((house) => field.ware_house_ids?.includes(house.id)) // Filter matching warehouses
                                                                                                .map((house) => {
                                                                                                    // Find matching products for the current product_id and warehouse_id in purchase_product
                                                                                                    const matchingPurchaseProducts = purchase_product.filter(
                                                                                                        (product) =>
                                                                                                            product.product_id === field.product_id &&
                                                                                                            product.ware_house_id === house.id
                                                                                                    );

                                                                                                    // Calculate the total purchase quantity for this warehouse
                                                                                                    const totalPurchaseQuantity = matchingPurchaseProducts.reduce(
                                                                                                        (sum, product) => sum + parseFloat(product.quantity || 0),
                                                                                                        0
                                                                                                    );

                                                                                                    // Find matching products in sale_product for the current product_id and warehouse_id
                                                                                                    const warehouseMatchingProducts = sale_product.filter(
                                                                                                        (product) =>
                                                                                                            product.product_id === field.product_id &&
                                                                                                            product.ware_house_id === house.id
                                                                                                    );

                                                                                                    // Calculate the total sale quantity for this warehouse
                                                                                                    const warehouseTotalQuantity = warehouseMatchingProducts.reduce(
                                                                                                        (sum, product) => sum + parseFloat(product.quantity || 0),
                                                                                                        0
                                                                                                    );

                                                                                                    return (
                                                                                                        <option key={house.id} value={house.id}>
                                                                                                            {house.name} -  {totalPurchaseQuantity - warehouseTotalQuantity}
                                                                                                        </option>
                                                                                                    );
                                                                                                })}
                                                                                        </select> */}
                                                                                        <select
                                                                                            name="ware_house_ids"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            value={field.ware_house_ids || selectedWareHouse} // Apply default or selected value
                                                                                            onChange={(e) => handleQualificationChange(index, e)} // Handle individual change
                                                                                        >
                                                                                             <option value="">Select Ware House</option>
                                                                                            {ware_house_list
                                                                                                .filter((house) =>
                                                                                                    purchase_product_list_ware_house.some(
                                                                                                        (item) =>
                                                                                                            item.product_id === field.product_id &&
                                                                                                            item.ware_house_ids.includes(house.id.toString()) // Match warehouses based on product_id and ware_house_ids
                                                                                                    )
                                                                                                )
                                                                                                .map((house) => {
                                                                                                    // Find purchase product list for the current product and warehouse
                                                                                                    const matchingPurchaseProducts = purchase_product.filter(
                                                                                                        (product) =>
                                                                                                            product.product_id === field.product_id &&
                                                                                                            product.ware_house_id === house.id
                                                                                                    );

                                                                                                    // Calculate total purchase quantity
                                                                                                    const totalPurchaseQuantity = matchingPurchaseProducts.reduce(
                                                                                                        (sum, product) => sum + parseFloat(product.quantity || 0),
                                                                                                        0
                                                                                                    );

                                                                                                    // Find sale product list for the current product and warehouse
                                                                                                    const warehouseMatchingProducts = sale_product.filter(
                                                                                                        (product) =>
                                                                                                            product.product_id === field.product_id &&
                                                                                                            product.ware_house_id === house.id
                                                                                                    );

                                                                                                    // Calculate total sale quantity
                                                                                                    const warehouseTotalQuantity = warehouseMatchingProducts.reduce(
                                                                                                        (sum, product) => sum + parseFloat(product.quantity || 0),
                                                                                                        0
                                                                                                    );

                                                                                                    // Display the warehouse name with available stock
                                                                                                    return (
                                                                                                        <option key={house.id} value={house.id}>
                                                                                                            {house.name} - {totalPurchaseQuantity - warehouseTotalQuantity}
                                                                                                        </option>
                                                                                                    );
                                                                                                })}
                                                                                        </select>

                                                                                    </td>
                                                                                    <td>
                                                                                        {/* <p>{parseFloat(matchingProduct?.quantity) - parseFloat(totalQuantity)}</p> */}
                                                                                        <p>{(totalPurchaseQuantity - totalQuantity)}</p>
                                                                                    </td>
                                                                                    <td>
                                                                                        <p>{matchingProduct?.sale_price}</p>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            name="quantity"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="Enter Quantity"
                                                                                            value={quantities[index] ? quantities[index] : field.quantity}
                                                                                            onChange={(event) => {
                                                                                                handleQuantityChange(event, index);
                                                                                            }}
                                                                                        />
                                                                                    </td>

                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            name="sale_price"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="Enter Sale Price"
                                                                                            disabled
                                                                                            value={field.sale_price || (quantities[index] ? (parseFloat(matchingProduct?.sale_price) * quantities[index]).toFixed(2)  : field.sale_price)}
                                                                                            onChange={(event) => brand_input_change(event, index)}
                                                                                        />
                                                                                        {/* <p>{field.sale_price || (quantities[index] ? (parseFloat(matchingProduct?.sale_price) * quantities[index]).toFixed(2) : field.sale_price)}</p> */}
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            name="discount"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="Enter Discount Amount"
                                                                                            value={field.discount ? field.discount : field.new_discount || ""} // Use the discount for this index
                                                                                            onChange={(event) => { handleDiscountChange(event, index); brand_input_change(event, index) }} // Pass index to handleDiscountChange
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn btn-danger btn-sm"
                                                                                            onClick={() => unit_delete(field.id)}
                                                                                        >
                                                                                            <FaTrash />
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <p>No data found</p>
                                                                    )}
                                                                </>


                                                                // <>

                                                                //     {
                                                                //         assetInfo?.fields?.length > 0 ?

                                                                //             assetInfo?.fields?.map((field, index) => (
                                                                //                 <>

                                                                //                     <tr >
                                                                //                         <td>

                                                                //                             <p>{field.barcode}</p>
                                                                //                         </td>
                                                                //                         <td>

                                                                //                             <p>{field.product_name}</p>
                                                                //                         </td>
                                                                //                         <td>
                                                                //                             <p>{field.quantity}</p>

                                                                //                         </td>

                                                                //                         <td>
                                                                //                             <input
                                                                //                                 type="number"
                                                                //                                 name="quantity"
                                                                //                                 className="form-control form-control-sm mb-2"
                                                                //                                 placeholder="Enter Quantity "
                                                                //                                 value={field.quantity}
                                                                //                                 onChange={(event) => brand_input_change(event, index)}
                                                                //                             />

                                                                //                         </td>

                                                                //                         <td>
                                                                //                             <input
                                                                //                                 type="number"

                                                                //                                 name="sale_price"
                                                                //                                 className="form-control form-control-sm mb-2"
                                                                //                                 placeholder="Enter Sale price "
                                                                //                                 value={field.sale_price}
                                                                //                                 onChange={(event) => brand_input_change(event, index)}
                                                                //                             />

                                                                //                         </td>
                                                                //                         <td> <button
                                                                //                             type="button"
                                                                //                             className="btn btn-danger btn-sm"
                                                                //                             onClick={() => unit_delete(field.id)}
                                                                //                         >
                                                                //                             <FaTrash />
                                                                //                         </button></td>




                                                                //                     </tr>
                                                                //                 </>
                                                                //             ))
                                                                //             :
                                                                //             <p >No data Found</p>
                                                                //     }
                                                                // </>
                                                            }
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
                                                                    <strong>{assetInfo.previous_due ? assetInfo.previous_due : 0} TK</strong>
                                                                    {/* <strong>{prev_due ? prev_due : 0} TK</strong> */}
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
                                                                        onChange={brand_input_changes}
                                                                        type="number"
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
                                                                        className="form-control form-control-sm text-right"
                                                                        onChange={brand_input_changes}
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
                                                                        placeholder='enter paid amount'
                                                                        className="form-control form-control-sm text-right"
                                                                        onChange={brand_input_changes}
                                                                        type="number"
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
                                                                        onChange={brand_input_changes}
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

export default SaleUpdate;
