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
import { DatePicker } from 'rsuite';


const QuotationCreate = () => {

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
            ware_house: '',
            invoice_id: '',
            quotation_date: '',
            account: '',
            created_by: created,

        }

    );
    const handleRemoveField = (index) => {
        const newFields = [...searchResults];
        newFields.splice(index, 1);
        setSearchResults(newFields);
    };



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

    // const prev_due = (supplierLastDue?.payable_amount) - (supplierLastDue?.paid_amount + supplierLastDue?.discount);
    const prev_due = 0

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






    // Sample quantities state for testing



    const [quantities, setQuantities] = useState({});


    // Handle quantity change
    const handleQuantityChange = (event, index) => {
        const newQuantity = parseFloat(event.target.value) || 0;

        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [index]: newQuantity
        }));

        // Update the corresponding new_sale_price in searchResults
        setSearchResults(prevResults =>
            prevResults.map((item, i) => {
                if (i === index) {
                    return {
                        ...item,
                        new_sale_price: parseFloat(item.sale_price) * newQuantity,
                        new_quantity: newQuantity
                    };
                }
                return item;
            })
        );
    };

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
                            console.log(quantityDifference)
                            // Check if the product is not already in the previous results
                            const isAlreadyInResults = prevResults?.some(prevResult => prevResult.barcode === newResult.barcode);
                            // const isAlreadyInResults = prevResults?.some(prevResult => prevResult.barcode === newResult.barcode);

                            if (quantityDifference == 0 || quantityDifference < 1) {
                                // Set stock out message, but do not include the product in the results
                                setStockOut('Out of stock');
                                return
                            } else if (!isAlreadyInResults) {
                                // If product is in stock and not already in results, include it in filtered results
                                filteredNewResults.push({
                                    ...newResult,
                                    new_sale_price: 0, // Initialize new sale price
                                    new_quantity: 0, // Initialize new quantity
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
                }
            })
            .catch(error => {
                setError("An error occurred during search.");
                setSearchResults([]);
            });
    };




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




    const totalSalePrice = searchResults?.reduce((sum, field) => sum + (parseFloat(field.new_sale_price) || 0), 0);

    console.log(totalSalePrice)



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
            previous_due: parseFloat(prev_due)
            // - parseFloat(assetInfo.discount ? assetInfo.discount : 0)
        }));
    }, [prev_due]);

    useEffect(() => {

        setAssetInfo(prevState => ({
            ...prevState,
            due: parseFloat(assetInfo.payable_amount) - parseFloat(assetInfo.discount ? assetInfo.discount : 0) - parseFloat(assetInfo.paid_amount)
            // - parseFloat(assetInfo.discount ? assetInfo.discount : 0)
        }));
    }, [assetInfo.payable_amount, assetInfo.discount, assetInfo.paid_amount]);


    useEffect(() => {

        setAssetInfo(prevState => ({
            ...prevState,
            payable_amount: parseFloat(totalSalePrice) + parseFloat(prev_due ? prev_due : 0)
            // - parseFloat(assetInfo.discount ? assetInfo.discount : 0)
        }));
    }, [totalSalePrice, prev_due]);


    useEffect(() => {

        setAssetInfo(prevState => ({
            ...prevState,
            paid_amount: parseFloat(assetInfo.payable_amount) - parseFloat(assetInfo.discount ? assetInfo.discount : 0)
        }));
    }, [assetInfo.payable_amount, assetInfo.discount]);




    // useEffect(() => {
    //     setFields(prevFields => prevFields.map(field => ({
    //         ...field,
    //         supplier_id: supplier_id
    //     })));
    // }, [supplier_id]);


    const [expenseDate, setExpenseDate] = useState('');

    const [date, setDate] = useState('');

    const [fromDate, setFromDate] = useState();

    const handleChangesss = (value) => {
        if (value) {
            // Format the date into MySQL format
            const mysqlFormattedDate = formatToMySQL(value);
            setFromDate(mysqlFormattedDate);
            setAssetInfo((prevAssetInfo) => ({
                ...prevAssetInfo,
                quotation_date: mysqlFormattedDate
            }));
        }
    };

    console.log(assetInfo)
    const formatToMySQL = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so add 1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // Return in MySQL format: yyyy-MM-dd HH:mm
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };


    // const formatDate = (date) => {
    //     const day = String(date.getDate()).padStart(2, '0');
    //     const month = String(date.getMonth() + 1).padStart(2, '0');
    //     const year = String(date.getFullYear());
    //     return `${day}-${month}-${year}`;
    // };
    // const handleTextInputClick = () => {
    //     document.getElementById('dateInputFrom').showPicker();
    // };

    // const handleDateChangeFrom = (event) => {
    //     const selectedDate = event.target.value ? new Date(event.target.value) : new Date(); // default to current date if no value is provided
    //     setFromDate(selectedDate);

    //     const day = String(selectedDate.getDate()).padStart(2, '0');
    //     const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    //     const year = String(selectedDate.getFullYear());
    //     const formattedDate = `${year}-${month}-${day}`;

    //     setAssetInfo((prevAssetInfo) => ({
    //         ...prevAssetInfo,
    //         quotation_date: formattedDate
    //     }));

    //     if (formattedDate) {
    //         setDate('');
    //     }
    // };



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

        // Create a copy of the current searchResults state
        const updatedResults = [...searchResults];

        // Update the specific field's property based on the index
        updatedResults[index] = {
            ...updatedResults[index],
            [name]: value
        };

        // Update the state
        setSearchResults(updatedResults);
    };

    const [searchResultError, setSearchResultError] = useState('')
    const [paid_amount, setPaid_amount] = useState('')
    const [paid_by, setPaid_by] = useState('')
    const [full_name, setFull_name] = useState('')
    const [mobile, setMobile] = useState('')

    const brand_input_changes = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...assetInfo }
        attribute[name] = value


        if (searchResults.length > 0) {
            setSearchResultError('')
        }
        const paid_amount = attribute['paid_amount'];

        if (paid_amount) {
            setPaid_amount('');
        }
        const paid_by = attribute['account'];
        if (paid_by) {
            setPaid_by('');
        }
        const full_name = attribute['full_name'];
        if (full_name) {
            setFull_name('');
        }

        const mobile = attribute['mobile'];
        if (mobile) {
            setMobile('');
        }

        setAssetInfo(attribute)
        // setSameBrandName('')



    };


    const router = useRouter()



    const { data: products = [],
    } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_list`)

            const data = await res.json()
            return data
        }
    })


    const { data: allUser = [],
    } = useQuery({
        queryKey: ['allUser'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/allUser`)

            const data = await res.json()
            return data
        }
    })

    const { data: quotation_current_date_count = [],
    } = useQuery({
        queryKey: ['quotation_current_date_count'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/quotation/quotation_current_date_count`)

            const data = await res.json()
            return data
        }
    })

    const [selectedOption, setSelectedOption] = useState('users');
    const [selectedOptionUsers, setSelectedOptionUsers] = useState('');

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        // setAssetInfo({
        //     full_name: '',
        //     mobile: '',
        //     email: '',
        // });
    };

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
                        <p style="margin: 0; padding: 0;">Date: ${assetInfo.quotation_date}</p>
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
            const quantity = itemId.new_quantity;
            const discount = itemId.new_discount;
            const salePrice = itemId.new_sale_price;
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
                     <p style="margin: 0; padding: 0;">Received By: ${userInfo ? userInfo.full_name : assetInfo.full_name}</p>
                   <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
            <div style="text-align: right; font-size:7.5px;">
                <h1>Sub Total: ${totalAmount.toFixed(2)}</h1>
                <h1>Payable Amount: ${totalAmount.toFixed(2)}</h1>
                <h1>Discount Amount: ${assetInfo.discount ? assetInfo.discount : 0}</h1>
                <h1><strong>Total Amount: ${assetInfo.paid_amount}</strong></h1>
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
    console.log(selectedOptionUsers)

    const userInfo = allUser.find(user => user.id == selectedOptionUsers)
    const {
        data: designation = [],

    } = useQuery({
        queryKey: ["designation"],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_all`
            );

            const data = await res.json();
            return data;
        },
    });


    const sortNumberOne = designation.find(desig => desig.serial_number == 1)

    console.log(sortNumberOne?.id)

    const {
        data: employee = [],


    } = useQuery({
        queryKey: ["employee"],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/employee/employee_all_list`
            );
            const data = await res.json();
            // Filter out the brand with id
            return data;
        },
    });


    const designationemployee = employee?.find(emp => emp?.designation_id == sortNumberOne?.id)
    console.log(designationemployee)

    const numberToWords = (num) => {
        const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
        const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        const levels = ["", "Thousand", "Lakh", "Crore"]; // Indian numbering system

        if (num === 0) return "Zero";

        const convertHundreds = (n) => {
            let str = "";
            if (n >= 100) {
                str += ones[Math.floor(n / 100)] + " Hundred ";
                n %= 100;
            }
            if (n >= 11 && n <= 19) {
                str += teens[n - 10] + " ";
            } else {
                if (n >= 10) {
                    str += tens[Math.floor(n / 10)] + " ";
                    n %= 10;
                }
                if (n > 0) {
                    str += ones[n] + " ";
                }
            }
            return str.trim();
        };

        let words = "";
        let parts = [];

        if (num >= 10000000) { // Crore
            parts.push([Math.floor(num / 10000000), "Crore"]);
            num %= 10000000;
        }
        if (num >= 100000) { // Lakh
            parts.push([Math.floor(num / 100000), "Lakh"]);
            num %= 100000;
        }
        if (num >= 1000) { // Thousand
            parts.push([Math.floor(num / 1000), "Thousand"]);
            num %= 1000;
        }
        if (num > 0) { // Remaining Hundreds
            parts.push([num, ""]);
        }

        parts.forEach(([value, label]) => {
            if (value > 0) {
                words += convertHundreds(value) + " " + label + " ";

            }
        });

        return words.trim();
    };

    const generateInvoiceHTML = () => {


        const numberToWord = (num) => {
            const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
            const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
            const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

            if (num < 10) return ones[num];
            if (num >= 10 && num < 20) return teens[num - 10];
            if (num >= 20) {
                const tenPart = Math.floor(num / 10);
                const onePart = num % 10;
                return `${tens[tenPart]}${onePart ? `-${ones[onePart]}` : ""}`;
            }
        };


        const userInfo = allUser.find(user => user.id == selectedOptionUsers);
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', options); // Formats to: 14 January, 2025
        };
        const formatDates = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad single digit month with zero
            const day = String(date.getDate()).padStart(2, '0'); // Pad single digit day with zero

            return `${year}${month}${day}`; // Returns in format: 20250130
        };


        let totalAmount = 0;
        let tableRows = '';

        searchResults.forEach((item, index) => {
            const quantity = parseFloat(item.new_quantity) || 0;
            const discount = parseFloat(item.new_discount) || 0;
            const salePrices = parseFloat(item.sale_price) || 0;
            const productName = products.find(product => product.id == item.product_id)?.product_name || "Unknown";

            const salePrice = salePrices * quantity;
            const totalPrice = salePrice - discount;
            totalAmount += totalPrice;

            tableRows += `
                <tr>
                    <td>${index + 1}</td>  <!-- SL (Serial Number) -->
                    <td>${productName}</td>
                    <td>${quantity} (${numberToWord(quantity)})</td>
                    <td>${salePrice.toFixed(2)}</td>
                    <td>${discount.toFixed(2)}</td>
                    <td>${totalPrice.toFixed(2)}</td>
                </tr>
            `;
        });

        const totalAmountInWords = numberToWords(Math.floor(totalAmount - assetInfo.discount));

        let htmlContent = `
        <html>
           <head>
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
        }
        .invoice-header p {
            margin: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
        }
    </style>
    </head>
            <body>
    <div class="invoice-header">
     <div>
        <img src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="Invoice Logo" width="100" height="100"> 
    </div>
    <div>
        <p><strong>Date:</strong>${formatDate(assetInfo.quotation_date)}</p>
    </div>
    <div >
        <p style="float:right; margin-top:-20px;"><strong>Invoice No.:</strong> UIS/${formatDates() + quotation_current_date_count.count_today}</p>
    </div>
</div>
<p><strong>To:</strong></p>
<p>${userInfo ? userInfo.full_name : assetInfo.full_name}<br>
Bhagyakul, Sreenagar, Munshiganj.<br>
Room-114, 1st Floor Pani Bhaban, 72 Green Road, Dhaka</p>
<br>
<br>

<p><strong>Description:</strong></p>

    <table>
        <tr>
            <th>SL</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Total Price (TK)</th>
        </tr>
        ${tableRows}
        <tr>
            <td colspan="5" class="total"><div style="float: right;">Sub Total</div></td>
            <td class="total">${totalAmount.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="5" class="total"><div style="float: right;">Total Discount</div></td>
            <td class="total">${assetInfo.discount}</td>
        </tr>
        <tr>
            <td colspan="5" class="total"><div style="float: right;">Total amount</div></td>
            <td class="total">${totalAmount - assetInfo.discount}</td>
        </tr>
    </table>
    
    <p><strong>(Taka ${totalAmountInWords} only) Including VAT & Tax</strong></p>
    
    <div class="footer">
    
        <p><strong>Best Regards,</strong></p>
          <br>
        <br>
         <p>${designationemployee.full_name}<br>
    ${designationemployee.designation_name}<br>
        Cell: ${designationemployee.mobile}</p>
    </div>
    </body>
        </html>`;

        return htmlContent;
    };
    const generateInvoiceChalan = () => {


        const numberToWord = (num) => {
            const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
            const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
            const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

            if (num < 10) return ones[num];
            if (num >= 10 && num < 20) return teens[num - 10];
            if (num >= 20) {
                const tenPart = Math.floor(num / 10);
                const onePart = num % 10;
                return `${tens[tenPart]}${onePart ? `-${ones[onePart]}` : ""}`;
            }
        };


        const userInfo = allUser.find(user => user.id == selectedOptionUsers);
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', options); // Formats to: 14 January, 2025
        };
        const formatDates = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad single digit month with zero
            const day = String(date.getDate()).padStart(2, '0'); // Pad single digit day with zero

            return `${year}${month}${day}`; // Returns in format: 20250130
        };


        let totalAmount = 0;
        let tableRows = '';

        searchResults.forEach((item, index) => {
            const quantity = parseFloat(item.new_quantity) || 0;
            const discount = parseFloat(item.new_discount) || 0;
            const salePrices = parseFloat(item.sale_price) || 0;
            const productName = products.find(product => product.id == item.product_id)?.product_name || "Unknown";

            const salePrice = salePrices * quantity;
            const totalPrice = salePrice - discount;
            totalAmount += totalPrice;

            tableRows += `
                <tr>
                    <td>${index + 1}</td>  <!-- SL (Serial Number) -->
                    <td>${productName}</td>
                    <td>${quantity} (${numberToWord(quantity)})</td>
                   
                </tr>
            `;
        });

        const totalAmountInWords = numberToWords(Math.floor(totalAmount - assetInfo.discount));

        let htmlContent = `
        <html>
           <head>
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
        }
        .invoice-header p {
            margin: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
        }
    </style>
    </head>
            <body>
    <div class="invoice-header">
     <div>
        <img src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="Invoice Logo" width="100" height="100"> 
    </div>
    <div>
        <p><strong>Date:</strong>${formatDate(assetInfo.quotation_date)}</p>
    </div>
    <div >
        <p style="float:right; margin-top:-20px;"><strong>Chalan No.:</strong> UIS/${formatDates() + quotation_current_date_count.count_today}</p>
    </div>
</div>
<p><strong>To:</strong></p>
<p>${userInfo ? userInfo.full_name : assetInfo.full_name}<br>
Bhagyakul, Sreenagar, Munshiganj.<br>
Room-114, 1st Floor Pani Bhaban, 72 Green Road, Dhaka</p>
<br>
<br>

<p><strong>Description:</strong></p>

    <table>
        <tr>
            <th>SL</th>
            <th>Description</th>
            <th>Quantity</th>
           
        </tr>
        ${tableRows}
       
        
      
    </table>
    
    
    
    <div class="footer">
    
        <p><strong>Best Regards,</strong></p>
         <br>
        <br>
        <p>${designationemployee.full_name}<br>
    ${designationemployee.designation_name}<br>
        Cell: ${designationemployee.mobile}</p>
    </div>
    </body>
        </html>`;

        return htmlContent;
    };

    const generateQuotationHTML = () => {

        const numberToWord = (num) => {
            const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
            const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
            const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

            if (num < 10) return ones[num];
            if (num >= 10 && num < 20) return teens[num - 10];
            if (num >= 20) {
                const tenPart = Math.floor(num / 10);
                const onePart = num % 10;
                return `${tens[tenPart]}${onePart ? `-${ones[onePart]}` : ""}`;
            }
        };


        const userInfo = allUser.find(user => user.id == selectedOptionUsers);
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', options); // Formats to: 14 January, 2025
        };
        const formatDates = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad single digit month with zero
            const day = String(date.getDate()).padStart(2, '0'); // Pad single digit day with zero

            return `${year}${month}${day}`; // Returns in format: 20250130
        };


        let totalAmount = 0;
        let tableRows = '';

        searchResults.forEach((item, index) => {
            const quantity = parseFloat(item.new_quantity) || 0;
            const discount = parseFloat(item.new_discount) || 0;
            const salePrices = parseFloat(item.sale_price) || 0;
            const productName = products.find(product => product.id == item.product_id)?.product_name || "Unknown";

            const salePrice = salePrices * quantity;
            const totalPrice = salePrice - discount;
            totalAmount += totalPrice;

            tableRows += `
                <tr>
                    <td>${index + 1}</td>  <!-- SL (Serial Number) -->
                    <td>${productName}</td>
                    <td>${quantity} (${numberToWord(quantity)})</td>
                    <td>${salePrice.toFixed(2)}</td>
                    <td>${discount.toFixed(2)}</td>
                    <td>${totalPrice.toFixed(2)}</td>
                </tr>
            `;
        });

        const totalAmountInWords = numberToWords(Math.floor(totalAmount - assetInfo.discount));

        let htmlContent = `
        <html>
           <head>
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
        }
        .invoice-header p {
            margin: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
        }
    </style>
    </head>
            <body>
    <div class="invoice-header">
     <div>
        <img src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="Invoice Logo" width="100" height="100"> 
    </div>
    <div>
        <p><strong>Date:</strong>${formatDate(assetInfo.quotation_date)}</p>
    </div>
    <div >
        <p style="float:right; margin-top:-20px;"><strong>Quotation No.:</strong> UIS/${formatDates() + quotation_current_date_count.count_today}</p>
    </div>
</div>
<p><strong>To:</strong></p>
<p>${userInfo ? userInfo.full_name : assetInfo.full_name}<br>
Bhagyakul, Sreenagar, Munshiganj.<br>
Room-114, 1st Floor Pani Bhaban, 72 Green Road, Dhaka</p>
<br>
<br>

<p><strong>Description:</strong></p>

    <table>
        <tr>
            <th>SL</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Total Price (TK)</th>
        </tr>
        ${tableRows}
        <tr>
            <td colspan="5" class="total"><div style="float: right;">Sub Total</div></td>
            <td class="total">${totalAmount.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="5" class="total"><div style="float: right;">Total Discount</div></td>
            <td class="total">${assetInfo.discount}</td>
        </tr>
        <tr>
            <td colspan="5" class="total"><div style="float: right;">Total amount</div></td>
            <td class="total">${totalAmount - assetInfo.discount}</td>
        </tr>
    </table>
    
    <p><strong>(Taka ${totalAmountInWords} only) Including VAT & Tax</strong></p>
    
    <div class="footer">
    
        <p><strong>Best Regards,</strong></p>
          <br>
        <br>
        <p>${designationemployee.full_name}<br>
    ${designationemployee.designation_name}<br>
        Cell: ${designationemployee.mobile}</p>
    </div>
    </body>
        </html>`;

        return htmlContent;
    };

    const {
        data: quotation_memo = [],

        refetch,
    } = useQuery({
        queryKey: ["quotation_memo"],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/quotation/quotation_memo_single/1`
            );
            const data = await res.json();
            // Filter out the brand with id
            return data;
        },
    });

    const generateMemoHTML = () => {




        const userInfo = allUser.find(user => user.id == selectedOptionUsers);
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', options); // Formats to: 14 January, 2025
        };
        const formatDates = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad single digit month with zero
            const day = String(date.getDate()).padStart(2, '0'); // Pad single digit day with zero

            return `${year}${month}${day}`; // Returns in format: 20250130
        };

        let totalAmount = 0;


        searchResults.forEach((item, index) => {
            const quantity = parseFloat(item.new_quantity) || 0;
            const discount = parseFloat(item.new_discount) || 0;
            const salePrices = parseFloat(item.sale_price) || 0;


            const salePrice = salePrices * quantity;
            const totalPrice = salePrice - discount;
            totalAmount += totalPrice;


        });

        const totalAmountInWords = numberToWords(Math.floor(totalAmount - assetInfo.discount));

        let htmlContent = `
        <html>
           <head>
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
        }
        .invoice-header p {
            margin: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
        }
    </style>
    </head>
            <body>
    <div class="invoice-header">
     <div>
        <img src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="Invoice Logo" width="100" height="100"> 
    </div>
    <div>
        <p><strong>Date:</strong>${formatDate(assetInfo.quotation_date)}</p>
    </div>
    <div >
        <p style="float:right; margin-top:-20px;"><strong>Invoice No.:</strong> UIS/${formatDates() + quotation_current_date_count.count_today}</p>
    </div>
</div>
<p><strong>To:</strong></p>
<p>${userInfo ? userInfo.full_name : assetInfo.full_name}<br>
Bhagyakul, Sreenagar, Munshiganj.<br>
Room-114, 1st Floor Pani Bhaban, 72 Green Road, Dhaka</p>
<br>
<p>Subject:<strong> ${quotation_memo[0]?.subject} </strong></p>

  <br>
    
    <p>${quotation_memo[0]?.description}, <strong> Amount is ${totalAmount - assetInfo.discount} (BDT-${totalAmountInWords} only) taka</strong></p>
    
    <div class="footer">
    
        <p><strong>Best Regards,</strong></p>
        <br>
        <br>
        <p>${designationemployee.full_name}<br>
    ${designationemployee.designation_name}<br>
        Cell: ${designationemployee.mobile}</p>
    </div>
    </body>
        </html>`;

        return htmlContent;
    };

    const {
        data: quotation_setup_single = [],

    } = useQuery({
        queryKey: ["quotation_setup_single"],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/quotation/quotation_setup_single/1`
            );
            const data = await res.json();
            // Filter out the brand with id
            return data;
        },
    });

    const generateBodyHTML = () => {



        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', options); // Formats to: 14 January, 2025
        };
        const formatDates = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad single digit month with zero
            const day = String(date.getDate()).padStart(2, '0'); // Pad single digit day with zero

            return `${year}${month}${day}`; // Returns in format: 20250130
        };


        let htmlContent = `
        <html>
           <head>
    <title>Invoice</title>
    
    </head>
            <body>
    <div class="invoice-header">
     <div>
      <p>
      ${assetInfo.full_name}
      </p>
    </div>
    
    <div>
        <p><strong>Date:</strong>${formatDate(assetInfo.quotation_date)}</p>
    </div>
    <div >
        <p ><strong>Invoice No.:</strong> UIS/${formatDates() + quotation_current_date_count.count_today}</p>
    </div>
    <div >
        <p ><strong>${quotation_setup_single[0]?.description}</strong></p>
    </div>
</div>

    
    </body>
        </html>`;

        return htmlContent;
    };

    const sendEmail = () => {
        const emailBody = generateInvoiceHTML();
        const emailBody2 = generateInvoiceChalan();
        const emailBody3 = generateQuotationHTML();
        const emailBody4 = generateMemoHTML();
        const emailBody5 = generateBodyHTML();

        const emailData = {
            email: userInfo ? userInfo.email : assetInfo.email,
            subject: "Quotation Invoice",
            msg: emailBody,
            msg2: emailBody2,
            msg3: emailBody3,
            msg4: emailBody4,
            msg5: emailBody5,
        };
        // ${process.env.NEXT_PUBLIC_API_URL}:5002/send-email/invoice

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-email/invoice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        })
            .then((res) => res.json())
            .then((data) => console.log("Email Sent:", data))
            .catch((error) => console.error("Error Sending Email:", error));
    };

    const [sendEmailChecked, setSendEmailChecked] = useState(false);
    const [userError, setUserError] = useState('');

    const purchase_create = (event) => {
        event.preventDefault();


        const allData = {
            searchResults, assetInfo, selectedOptionUsers, created
        }

        // if (!assetInfo.quotation_date) {
        //     setDate('This is required')
        //     return
        // }
        // if (selectedOption == 'new') {

        // if (!assetInfo.full_name) {
        //     setFull_name('This is required')
        //     return
        // }
        // if (!assetInfo.mobile) {
        //     setMobile('This is required')
        //     return
        // }
        // }

        if (searchResults.length === 0) {
            setSearchResultError('No data to submit')
            return
        }

        console.log(assetInfo)
        console.log(allData)

        //${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/purchase_create/purchase_creates

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/quotation/quotation_create`, {
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
                    router.push('/Admin/quotation/quotation_all')
                    // handlePrint()
                    if (sendEmailChecked === true) {

                        sendEmail()
                    }
                }
            })
            .then((data) => {
                console.log(data)

                if (data) {
                    sessionStorage.setItem("message", "Data saved successfully!");
                    router.push('/Admin/quotation/quotation_all')
                    // handlePrint()
                    if (sendEmailChecked === true) {
                        sendEmail()
                    }
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/quotation/quotation_product_list`);
            const data = await res.json();
            // Filter out the brand with id 
            // const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return data;
        }
    });


    const handleDiscountChange = (event, index) => {
        const newDiscount = parseFloat(event.target.value) || 0;

        setSearchResults(prevResults =>
            prevResults.map((item, i) => {
                if (i === index) {
                    // Calculate the updated final sale price after applying the discount
                    const totalPrice = parseFloat(item.sale_price) * (item.new_quantity || 0);
                    return {
                        ...item,
                        new_discount: newDiscount, // Add new_discount
                        new_sale_price: totalPrice - newDiscount // Update final price
                    };
                }
                return item;
            })
        );
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
        const wareHouseValue = e.target.value;
        setSelectedWareHouse(wareHouseValue);

        // Update the warehouse field in the assetInfo object
        setAssetInfo((prevState) => ({
            ...prevState,
            ware_house: wareHouseValue,
        }));
    };

    const handleChange = (index, event) => {
        const { name, value } = event.target;

        // Update the searchResults array
        const updatedResults = [...searchResults];
        updatedResults[index] = { ...updatedResults[index], [name]: value };

        setSearchResults(updatedResults);

        // Optionally, update assetInfo or other related state if needed
        setAssetInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // sms 

    const {
        data: apiData = [],

    } = useQuery({
        queryKey: ["apiData"],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sms_api/sms_api_all`
            );

            const data = await res.json();
            return data;
        },
    });


    const [apiUrl, setApiUrl] = useState('');
    const [apiResponse, setApiResponse] = useState(null);


    useEffect(() => {
        // Filter apiData for entries with status_url === '1'
        const filteredApiData = apiData.filter(item => item.status_url === '1');

        // Check if there are any valid entries after filtering
        if (filteredApiData.length === 0 || !filteredApiData[0].sms_api_params || filteredApiData[0].sms_api_params.length === 0) {
            return; // Exit if no valid data is available
        }

        // Use the first valid entry for further processing
        const apiEntry = filteredApiData[0];

        // Sort the sms_api_params based on the options field
        const sortedParams = apiEntry.sms_api_params.sort((a, b) => a.options - b.options);

        // Construct the query string from the sorted parameters
        const queryParams = sortedParams.map(param => {
            const key = param.options === 1 ? 'mobile' : (param.sms_key === 'number' ? 'mobile' : param.sms_key);
            return `${key}=${encodeURIComponent(param.sms_value)}`;
        }).join('&');

        // Final URL for API call
        const constructedUrl = `${apiEntry.main_url}${queryParams}`; // Add '?' before query params
        setApiUrl(constructedUrl); // Store the constructed URL in the state

        // Define a flag or condition to prevent automatic API call
        const shouldFetch = false; // Change this based on your logic

        if (shouldFetch) {
            // Fetching the API data
            const fetchData = async () => {
                try {
                    const response = await fetch(constructedUrl);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`); // Check if response is ok
                    }
                    const result = await response.json();
                    setApiResponse(result); // Set the API response in state
                } catch (error) {
                    console.error('Error fetching the API:', error);
                }
            };

            // Trigger API call if the condition is met
            fetchData();
        }
    }, [apiData]); // apiData as dependency

    console.log(apiUrl);



    const [formattedUrl, setFormattedUrl] = useState([])
    const [baseUrl, paramString] = apiUrl.split('?');

    // Check if paramString is defined before attempting to split
    const firstParam = paramString ? paramString.split('&')[0] : null;
    useEffect(() => {

        if (firstParam) {
            // Construct the formatted URL using the base URL and the first parameter
            const formattedUrl = `${baseUrl}?${firstParam}`;
            setFormattedUrl(formattedUrl);
        } else {
            console.log("No parameters found.");
        }
    }, [firstParam, baseUrl])

    console.log(formattedUrl)

    const { data: smsSettings = [], } = useQuery({
        queryKey: ['smsSettings'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/smsSettings`);
            const data = await res.json();
            return data;
        }
    });

    console.log(smsSettings.find(sms => sms.sms_system === 1))
    const attendanceSms = smsSettings.find(sms => sms.sms_system === 1)

    const employeeAttendanceSmsTemplate = attendanceSms?.quotation_invoice_sms
    const employeeAttendanceSmsTemplateShortCode = attendanceSms?.quotation_short_code
    const employeeSalarySmsTemplate = attendanceSms?.auto_quotation_sms


    const [sendSmsChecked, setSendSmsChecked] = useState(false);

    console.log(sendSmsChecked)
    const sendOtpToAllEmployees = (event) => {
        event.preventDefault();
        if (!sendSmsChecked) {
            console.log('SMS sending is disabled');
            return;
        }

        if (employeeSalarySmsTemplate !== 1) {
            console.log('Auto is not active');
            return;
        }
        const currentDate = new Date();

        const smsTime = currentDate.toLocaleTimeString();

        let sms = []
        searchResults.forEach((employee) => {

            // Replace placeholders with actual data
            let msgs = employeeAttendanceSmsTemplateShortCode
                .replace('[[short_code_name]]', employee.product_name)
                .replace('[[short_code_price]]', employee.new_sale_price)
                .replace('[[short_code_discount]]', employee.new_discount)
                .replace('[[short_code_quantity]]', employee.new_quantity)


            sms.push(msgs);
        }
        );

        // Replace placeholders with actual data
        let msg = employeeAttendanceSmsTemplate
            .replace('[[full_name]]', userInfo ? userInfo.full_name : assetInfo.full_name)
            .replace('[[all_short_code]]', sms)
            .replace('[[total_amount]]', assetInfo.paid_amount)
            .replace('[[invoice_id]]', assetInfo.invoice_id)
            .replace('[[discount]]', assetInfo.discount)
            .replace('[[sms_time]]', smsTime);

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
            // quick_api: quickApi,
            formattedUrl,
            mobile: userInfo ? userInfo.mobile : assetInfo.mobile,
            msg: msg,
        })
            .then(response => {
                console.log(`OTP sent to Nayan :`, response.data);
            })
            .catch(error => {
                console.error(`Failed to send OTP to Nayan :`, error);
            });



    };

    return (
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>

                        <div className="card-default">


                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Create Quotation</h5>
                                <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
                                    <Link href={`/Admin/quotation/quotation_all?page_group=${page_group}`} className="btn btn-sm btn-info">Quotation List</Link>
                                </div>
                            </div>
                            <>
                                <form className="form-horizontal" method="post" autoComplete="off"

                                    onSubmit={(e) => { purchase_create(e); sendOtpToAllEmployees(e); }}

                                // onSubmit={purchase_create}

                                >

                                    <div class="d-lg-flex md:d-md-flex justify-content-between px-3 mt-3">
                                        <div className='col-md-12 d-flex'>
                                            <div className='col-md-3' >
                                                <div class="input-group" >
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
                                                    styles={{
                                                        control: (provided) => ({
                                                            ...provided,
                                                            height: '32px !important', // Force height
                                                            minHeight: '32px !important', // Force minHeight
                                                        }),
                                                        dropdownIndicator: (provided) => ({
                                                            ...provided,
                                                            padding: '0 0px',
                                                        }),
                                                        indicatorSeparator: (provided) => ({
                                                            ...provided,
                                                            display: 'none',
                                                        }),
                                                    }}


                                                />



                                            </div>




                                        </div>
                                    </div>
                                    <div class="d-lg-flex md:d-md-flex justify-content-between px-4">

                                        <div className='col-md-8 row'>
                                            <label htmlFor="fromDate" class="col-form-label col-md-3"><strong>Quotation Date:</strong></label>
                                            <div className="col-md-5">
                                                <DatePicker
                                                    style={{ width: '700px' }}
                                                    format="dd-MM-yyyy"
                                                    showMeridiem
                                                    onChange={handleChangesss}
                                                    name='quotation_date'
                                                />
                                                {/* <input
                                                    className="form-control form-control-sm"
                                                    type="text"
                                                    id="fromDate"
                                                    name='quotation_date'
                                                    placeholder='dd--mm--yyyy'
                                                    value={fromDate ? formatDate(fromDate) : ''}
                                                    onClick={handleTextInputClick}
                                                    readOnly

                                                />
                                                <input

                                                    type="date"
                                                    id="dateInputFrom"
                                                    name='quotation_date'
                                                    value={fromDate ? fromDate.toString().split('T')[0] : ''}
                                                    onChange={handleDateChangeFrom}
                                                    style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                                                /> */}
                                                {
                                                    date && <p className='text-danger'>{date}</p>
                                                }
                                            </div>
                                        </div>

                                    </div>
                                    {/* {selectedProduct && (
                                                <p>Selected Product ID: {selectedProduct}</p>
                                            )} */}
                                    <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                        (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                    </div>
                                    {/* <div class="d-lg-flex md:d-md-flex justify-content-between px-3 mt-3">
                                        <div className=" row col-md-12 ml-2">
                                            <label>
                                                <input
                                                    type="radio"
                                                    value="users"
                                                    checked={selectedOption === 'users'}
                                                    onChange={handleOptionChange}
                                                />
                                                Users
                                            </label>
                                            <label className="ml-3">
                                                <input
                                                    type="radio"
                                                    value="new"
                                                    checked={selectedOption === 'new'}
                                                    onChange={handleOptionChange}
                                                />
                                                New
                                            </label>
                                        </div>
                                    </div> */}
                                    {/* {selectedOption === 'new' && ( */}
                                    <div class="d-lg-flex md:d-md-flex justify-content-between px-3 mt-3">

                                        <div class=" row col-md-12">
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
                                                    />
                                                    {
                                                        mobile && <p className='text-danger'>{mobile}</p>
                                                    }
                                                </div>
                                            </div>
                                            <div className='col-md-4'>

                                                <h5> Name</h5>
                                                <div>
                                                    <input
                                                        onChange={brand_input_changes}
                                                        placeholder="Enter Full Name"
                                                        className="form-control form-control-sm"
                                                        value={assetInfo.full_name}
                                                        type="text"
                                                        name="full_name"
                                                        id=""
                                                    />
                                                    {/* {
                                                            full_name && <p className='text-danger'>{full_name}</p>
                                                        } */}
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
                                                    />

                                                </div>
                                            </div>


                                        </div>

                                    </div>
                                    {/* )} */}
                                    {/* {selectedOption === 'users' && (
                                        <div class="d-lg-flex md:d-md-flex justify-content-between px-3 mt-3">

                                            <div class=" row col-md-12">
                                                <div className='col-md-4'>

                                                    <h5>User<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></h5>
                                                    <div>
                                                        <select
                                                            onChange={(e) => setSelectedOptionUsers(e.target.value)}
                                                            name="user_id"
                                                            className="form-control form-control-sm"


                                                        >
                                                            <option value="">Select User</option>
                                                            {
                                                                allUser.map(users =>

                                                                    <>
                                                                        <option value={users.id}>{users.full_name}</option>

                                                                    </>
                                                                )
                                                            }
                                                        </select>
                                                        {
                                                            userError && <p className='text-danger'>{userError}</p>
                                                        }
                                                    </div>

                                                </div>



                                            </div>

                                        </div>
                                    )} */}
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
                                                                    Total Price:<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>
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
                                                                <>
                                                                    {searchResults?.length > 0 ? (
                                                                        searchResults.map((field, index) => {
                                                                            // Find the matching product from saleAllProduct
                                                                            // const matchingProduct = purchase_product.find(product => product.product_id === field.product_id);
                                                                            const matchingProduct = purchase_product.filter(product => product.product_id === field.product_id);
                                                                            const totalPurchaseQuantity = matchingProduct.reduce((sum, product) => sum + parseFloat(product.quantity || 0), 0);
                                                                            const matchingProducts = sale_product.filter(product => product.product_id === field.product_id);
                                                                            const totalQuantity = matchingProducts.reduce((sum, product) => sum + product.quantity, 0);

                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td>
                                                                                        <p>{field.barcode}</p>
                                                                                    </td>
                                                                                    <td>
                                                                                        <p>{field.product_name}</p>
                                                                                    </td>
                                                                                    <td>


                                                                                        <select
                                                                                            name="ware_house"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            value={field.ware_house || selectedWareHouse}
                                                                                            onChange={(e) => handleChange(index, e)}
                                                                                        >
                                                                                            <option value="">Select Ware House</option>
                                                                                            {ware_house_list
                                                                                                .filter((house) => field.ware_house_ids.includes(house.id)) // Filter matching warehouses
                                                                                                .map((house) => {

                                                                                                    const matchingPurchaseProducts = purchase_product.filter(
                                                                                                        (product) =>
                                                                                                            product.product_id === field.product_id &&
                                                                                                            product.ware_house_id === house.id
                                                                                                    );


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
                                                                                        </select>

                                                                                    </td>
                                                                                    <td>
                                                                                        {/* <p>
                                                                                            {parseFloat(matchingProduct?.quantity) - parseFloat(totalQuantity)}
                                                                                        </p> */}
                                                                                        <p>{(totalPurchaseQuantity - totalQuantity)}</p>
                                                                                    </td>
                                                                                    <td>
                                                                                        <p>{field.sale_price}</p>

                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            name="quantity"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="Enter Quantity"
                                                                                            value={quantities[index] || ""} // Use the quantity for this index
                                                                                            onChange={(event) => handleQuantityChange(event, index)} // Pass index to handleQuantityChange
                                                                                        />
                                                                                    </td>



                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            name="sale_price"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="Final Sale Price"
                                                                                            value={(field.new_sale_price || 0).toFixed(2)} // Show final sale price after discount
                                                                                            disabled
                                                                                        />
                                                                                        {/* <p>{(field.new_sale_price || 0).toFixed(2)}</p> */}
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            name="discount"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="Enter Discount Amount"
                                                                                            value={field.new_discount || ""} // Use the discount for this index
                                                                                            onChange={(event) => handleDiscountChange(event, index)} // Pass index to handleDiscountChange
                                                                                        />
                                                                                    </td>

                                                                                    <td>
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn btn-danger btn-sm"
                                                                                            onClick={() => handleRemoveField(index)}
                                                                                        >
                                                                                            <FaTrash />
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <p className="text-danger">
                                                                            {searchResultError ? searchResultError : 'No data Found'}
                                                                        </p>
                                                                    )}
                                                                </>



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
                                                                        value={assetInfo.discount ? assetInfo.discount : ''}
                                                                    />
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td className="" colSpan="2">
                                                                    <strong>Total Amount:</strong>
                                                                </td>
                                                                <td className="text-right">
                                                                    <p><strong>{assetInfo.paid_amount ? assetInfo.paid_amount : '0'} TK</strong></p>
                                                                    {/* <input
                                                                        placeholder='enter paid amount'
                                                                        className="form-control form-control-sm text-right"
                                                                        onChange={brand_input_changes}
                                                                        type="number"
                                                                        disabled
                                                                        name="paid_amount"
                                                                        value={assetInfo.paid_amount ? assetInfo.paid_amount : ''}
                                                                    />
                                                                    {
                                                                        paid_amount && <p className='text-danger'>{paid_amount}</p>
                                                                    } */}
                                                                </td>
                                                            </tr>


                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="text-right">
                                                    <div className="form-check form-check-inline  mr-5" style={{ fontWeight: '650', fontSize: '12px' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={sendSmsChecked}
                                                            onChange={(e) => setSendSmsChecked(e.target.checked)}
                                                            name="check_box_otps"
                                                            value="1"
                                                            className="form-check-input"
                                                        />
                                                        <label style={{ marginTop: '7px', fontSize: '18px' }} className="px-2">
                                                            Send Sms
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline  mr-5" style={{ fontWeight: '650', fontSize: '12px' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={sendEmailChecked}
                                                            onChange={(e) => setSendEmailChecked(e.target.checked)}
                                                            name="check_box_otp"
                                                            value="1"
                                                            className="form-check-input"
                                                        />
                                                        <label style={{ marginTop: '7px', fontSize: '18px' }} className="px-2">
                                                            Send Email
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="form-group row mt-3">
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

export default QuotationCreate;










// const generateInvoiceHTML = () => {
//     const userInfo = allUser.find(user => user.id == selectedOptionUsers)
//     let htmlContent = `
//     <html>
//         <head>
//             <title>Pathshala School & College Purchase Invoice</title>
//             <style>
//                 table { width: 100%; border-collapse: collapse; }
//                 th, td { border: 1px solid black; padding: 8px; text-align: left; }
//                 thead { background-color: gray; }
//                 body { text-align: center; font-family: Arial, sans-serif; }
//             </style>
//         </head>
//         <body>
//             <h2>Pathshala School & College Purchase Invoice</h2>
//             <p>GA-75/A, Middle Badda, Dhaka-1212</p>
//             <p>Phone: 01977379479 | Email: pathshala@urbanitsolution.com</p>
//             <h3>Purchase Invoice</h3>
//             <div style="display: flex; justify-content: space-between;">
//                 <p>Receipt No: 829</p>
//                 <p>Collected By: পাঠশালা স্কুল এন্ড কলেজ</p>
//                <p>Date: ${assetInfo?.quotation_date ? assetInfo.quotation_date : new Date().toISOString().split('T')[0]}</p>

//             </div>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Product Name</th>
//                         <th>Quantity</th>
//                         <th>Discount</th>
//                         <th>Total Amount</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//     `;

//     let totalAmount = 0;

//     searchResults.forEach((item) => {
//         const quantity = item.new_quantity;
//         const discount = item.new_discount;
//         const salePrice = item.new_sale_price;
//         const productName = products.find(product => product.id == item.product_id)?.product_name || "Unknown";

//         htmlContent += `
//             <tr>
//                 <td>${productName}</td>
//                 <td>${quantity}</td>
//                 <td>${discount}</td>
//                 <td>${salePrice}</td>
//             </tr>
//         `;

//         totalAmount += parseFloat(salePrice);
//     });

//     htmlContent += `
//                 </tbody>
//             </table>
//             <p>Received By: ${userInfo ? userInfo.full_name : assetInfo.full_name}</p>
//             <div style="text-align: right; margin-top: 20px;">
//                 <h3>Sub Total: ${totalAmount.toFixed(2)}</h3>
//                 <h3>Payable Amount: ${totalAmount.toFixed(2)}</h3>
//                 <h3>Discount Amount: ${assetInfo.discount ? assetInfo.discount : 0}</h3>
//                 <h3><strong>Total Amount: ${assetInfo.paid_amount}</strong></h3>
//             </div>
//         </body>
//     </html>`;

//     return htmlContent;
// };

