'use client'
//ismile
import React, { useEffect, useState } from 'react';
import '../stock_category_sub_categorys/stockStyle.css'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const StockWareHouses = () => {

    const [supplier_id, setSupplier_id] = useState('')
    const [product_id, setProduct_id] = useState('')
    const [errorr, setErrorr] = useState(null)
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatDate = (date) => {
        const day = String(date?.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
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

    useEffect(() => {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        setFromDate(firstDayOfMonth);
        setToDate(lastDayOfMonth);
    }, []);

    const { data: purchase_product_stock_list = [], isLoading, refetch
    } = useQuery({
        queryKey: ['purchase_product_stock_list'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/report/purchase_product_stock_list_current_month_ware_house`)
            const data = await res.json()
            const updatedSearchResults = data.map(product => ({
                ...product,
                total_amount: product.sale_price * product.available_quantity
            }));
            return updatedSearchResults
        }
    })

    console.log(purchase_product_stock_list)

    const purchase_product_stock_list_search = () => {

        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/report/purchase_product_stock_list_current_month_ware_house_search`, {
            toDate, fromDate, supplier_id, product_id

        })
            .then(response => {
                const searchResults = response.data.results
                const updatedSearchResults = searchResults.map(product => ({
                    ...product,
                    total_amount: product.sale_price * product.available_quantity
                }));
                setSearchResults(updatedSearchResults);
                setError(null);
                setLoading(false);
                if (response.data.results == '') {
                    alert('Nothing found!');
                }
            })
            .catch(error => {
                setError("An error occurred during search.", error);
                setSearchResults([]);
            });
    };

    console.log(searchResults)
    // console.log(Array.isArray(searchResults)); // Should return true if `searchResults` is an array

    const totalAmountSum = searchResults ? searchResults?.reduce((sum, product) => sum + product.total_amount, 0) : 0;
    const totalQuantitySum = searchResults ? searchResults?.reduce((sum, product) => sum + product.available_quantity, 0) : 0;

    const totalAmountSumList = purchase_product_stock_list ? purchase_product_stock_list?.reduce((sum, product) => sum + product.total_amount, 0) : 0;
    const totalQuantitySumList = purchase_product_stock_list ? purchase_product_stock_list?.reduce((sum, product) => sum + product.available_quantity, 0) : 0;

    // console.log("Total Amount Sum:", totalAmountSum);

    const { data: subCategories = [],
    } = useQuery({
        queryKey: ['subCategories'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sub_category/sub_category_all`)

            const data = await res.json()
            return data
        }
    })

    const { data: categorys = [],
    } = useQuery({
        queryKey: ['categorys'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_all`)

            const data = await res.json()
            return data
        }
    })

    // const groupedData = searchResults.reduce((acc, item) => {
    //     // Check if the ware_house_id already exists in the accumulator
    //     if (!acc[item.ware_house_id]) {
    //         acc[item.ware_house_id] = {
    //             ware_house_name: item.ware_house_name,
    //             categories: {},
    //         };
    //     }

    //     // Check if the category_id exists for the current ware_house_id
    //     if (!acc[item.ware_house_id].categories[item.category_id]) {
    //         acc[item.ware_house_id].categories[item.category_id] = {
    //             category_name: item.category_name,
    //             subcategories: [],
    //             totalQuantity: 0,
    //             totalAmount: 0,
    //         };
    //     }

    //     // Add subcategory details
    //     acc[item.ware_house_id].categories[item.category_id].subcategories.push({
    //         sub_category_name: item.sub_category_name,
    //         available_quantity: item.available_quantity,
    //         total_amount: item.sale_price * item.available_quantity,
    //     });

    //     // Update the total quantities and total amounts for the category
    //     acc[item.ware_house_id].categories[item.category_id].totalQuantity += item.available_quantity;
    //     acc[item.ware_house_id].categories[item.category_id].totalAmount += item.sale_price * item.available_quantity;

    //     return acc;
    // }, {});

    // // Convert the grouped data to an array of warehouse data
    // const warehouseData = Object.keys(groupedData).map(wareHouseId => {
    //     const categories = Object.keys(groupedData[wareHouseId].categories).map(categoryId => {
    //         const category = groupedData[wareHouseId].categories[categoryId];
    //         return {
    //             category_name: category.category_name,
    //             subcategories: category.subcategories,
    //             totalQuantity: category.totalQuantity,
    //             totalAmount: category.totalAmount,
    //         };
    //     });

    //     return {
    //         ware_house_id: wareHouseId,
    //         ware_house_name: groupedData[wareHouseId].ware_house_name,
    //         categories: categories,
    //     };
    // });

    // console.log(warehouseData);


    const groupedData = searchResults.reduce((acc, item) => {
        // Check if the ware_house_id already exists in the accumulator
        if (!acc[item.ware_house_id]) {
            acc[item.ware_house_id] = {
                ware_house_name: item.ware_house_name,
                categories: {},
            };
        }
    
        // Check if the category_id exists for the current ware_house_id
        if (!acc[item.ware_house_id].categories[item.category_id]) {
            acc[item.ware_house_id].categories[item.category_id] = {
                category_name: item.category_name,
                subcategories: [],
                totalQuantity: 0,
                totalAmount: 0,
            };
        }
    
        // Check if sub_category_name already exists in the subcategories array
        const category = acc[item.ware_house_id].categories[item.category_id];
        const existingSubcategory = category.subcategories.find(
            (sub) => sub.sub_category_name === item.sub_category_name
        );
    
        if (existingSubcategory) {
            // Update the existing subcategory's quantity and total amount
            existingSubcategory.available_quantity += item.available_quantity;
            existingSubcategory.total_amount += item.sale_price * item.available_quantity;
        } else {
            // Add a new subcategory if it doesn't already exist
            category.subcategories.push({
                sub_category_name: item.sub_category_name,
                available_quantity: item.available_quantity,
                total_amount: item.sale_price * item.available_quantity,
            });
        }
    
        // Update the total quantities and total amounts for the category
        category.totalQuantity += item.available_quantity;
        category.totalAmount += item.sale_price * item.available_quantity;
    
        return acc;
    }, {});
    
    // Convert the grouped data to an array of warehouse data
    const warehouseData = Object.keys(groupedData).map((wareHouseId) => {
        const categories = Object.keys(groupedData[wareHouseId].categories).map((categoryId) => {
            const category = groupedData[wareHouseId].categories[categoryId];
            return {
                category_name: category.category_name,
                subcategories: category.subcategories,
                totalQuantity: category.totalQuantity,
                totalAmount: category.totalAmount,
            };
        });
    
        return {
            ware_house_id: wareHouseId,
            ware_house_name: groupedData[wareHouseId].ware_house_name,
            categories: categories,
        };
    });
    
    console.log(warehouseData);
    


    // const groupedDatas = purchase_product_stock_list.reduce((acc, item) => {
    //     // Check if the ware_house_id already exists in the accumulator
    //     if (!acc[item.ware_house_id]) {
    //         acc[item.ware_house_id] = {
    //             ware_house_name: item.ware_house_name,
    //             categories: {},
    //         };
    //     }

    //     // Check if the category_id exists for the current ware_house_id
    //     if (!acc[item.ware_house_id].categories[item.category_id]) {
    //         acc[item.ware_house_id].categories[item.category_id] = {
    //             category_name: item.category_name,
    //             subcategories: [],
    //             totalQuantity: 0,
    //             totalAmount: 0,
    //         };
    //     }

    //     // Add subcategory details
    //     acc[item.ware_house_id].categories[item.category_id].subcategories.push({
    //         sub_category_name: item.sub_category_name,
    //         available_quantity: item.available_quantity,
    //         total_amount: item.sale_price * item.available_quantity,
    //     });

    //     // Update the total quantities and total amounts for the category
    //     acc[item.ware_house_id].categories[item.category_id].totalQuantity += item.available_quantity;
    //     acc[item.ware_house_id].categories[item.category_id].totalAmount += item.sale_price * item.available_quantity;

    //     return acc;
    // }, {});

    // // Convert the grouped data to an array of warehouse data
    // const warehouseDatas = Object.keys(groupedDatas).map(wareHouseId => {
    //     const categories = Object.keys(groupedDatas[wareHouseId].categories).map(categoryId => {
    //         const category = groupedDatas[wareHouseId].categories[categoryId];
    //         return {
    //             category_name: category.category_name,
    //             subcategories: category.subcategories,
    //             totalQuantity: category.totalQuantity,
    //             totalAmount: category.totalAmount,
    //         };
    //     });

    //     return {
    //         ware_house_id: wareHouseId,
    //         ware_house_name: groupedDatas[wareHouseId].ware_house_name,
    //         categories: categories,
    //     };
    // });

    const groupedDatas = purchase_product_stock_list.reduce((acc, item) => {
        // Check if the ware_house_id already exists in the accumulator
        if (!acc[item.ware_house_id]) {
            acc[item.ware_house_id] = {
                ware_house_name: item.ware_house_name,
                categories: {},
            };
        }
    
        // Check if the category_id exists for the current ware_house_id
        if (!acc[item.ware_house_id].categories[item.category_id]) {
            acc[item.ware_house_id].categories[item.category_id] = {
                category_name: item.category_name,
                subcategories: [],
                totalQuantity: 0,
                totalAmount: 0,
            };
        }
    
        // Check if sub_category_name already exists in the subcategories array
        const category = acc[item.ware_house_id].categories[item.category_id];
        const existingSubcategory = category.subcategories.find(
            (sub) => sub.sub_category_name === item.sub_category_name
        );
    
        if (existingSubcategory) {
            // Update the existing subcategory's quantity and total amount
            existingSubcategory.available_quantity += item.available_quantity;
            existingSubcategory.total_amount += item.sale_price * item.available_quantity;
        } else {
            // Add a new subcategory if it doesn't already exist
            category.subcategories.push({
                sub_category_name: item.sub_category_name,
                available_quantity: item.available_quantity,
                total_amount: item.sale_price * item.available_quantity,
            });
        }
    
        // Update the total quantities and total amounts for the category
        category.totalQuantity += item.available_quantity;
        category.totalAmount += item.sale_price * item.available_quantity;
    
        return acc;
    }, {});
    
    // Convert the grouped data to an array of warehouse data
    const warehouseDatas = Object.keys(groupedDatas).map((wareHouseId) => {
        const categories = Object.keys(groupedDatas[wareHouseId].categories).map((categoryId) => {
            const category = groupedDatas[wareHouseId].categories[categoryId];
            return {
                category_name: category.category_name,
                subcategories: category.subcategories,
                totalQuantity: category.totalQuantity,
                totalAmount: category.totalAmount,
            };
        });
    
        return {
            ware_house_id: wareHouseId,
            ware_house_name: groupedDatas[wareHouseId].ware_house_name,
            categories: categories,
        };
    });
    
    console.log(warehouseDatas);
    

    const stock_pdf_download = async () => {

        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/report/purchase_product_stock_list_current_month_ware_house_search`, {
            toDate, fromDate, supplier_id, product_id
        });

        const searchResults = response.data.results
        const updatedSearchResults = searchResults.map(product => ({
            ...product,
            total_amount: product.sale_price * product.available_quantity
        }));
        const totalAmountSum = updatedSearchResults ? updatedSearchResults?.reduce((sum, product) => sum + product.total_amount, 0) : 0;
        const totalQuantitySum = updatedSearchResults ? updatedSearchResults?.reduce((sum, product) => sum + product.available_quantity, 0) : 0;

        const groupedData = searchResults.reduce((acc, item) => {
            // Check if the ware_house_id already exists in the accumulator
            if (!acc[item.ware_house_id]) {
                acc[item.ware_house_id] = {
                    ware_house_name: item.ware_house_name,
                    categories: {},
                };
            }

            // Check if the category_id exists for the current ware_house_id
            if (!acc[item.ware_house_id].categories[item.category_id]) {
                acc[item.ware_house_id].categories[item.category_id] = {
                    category_name: item.category_name,
                    subcategories: [],
                    totalQuantity: 0,
                    totalAmount: 0,
                };
            }

            // Add subcategory details
            acc[item.ware_house_id].categories[item.category_id].subcategories.push({
                sub_category_name: item.sub_category_name,
                available_quantity: item.available_quantity,
                total_amount: item.sale_price * item.available_quantity,
            });

            // Update the total quantities and total amounts for the category
            acc[item.ware_house_id].categories[item.category_id].totalQuantity += item.available_quantity;
            acc[item.ware_house_id].categories[item.category_id].totalAmount += item.sale_price * item.available_quantity;

            return acc;
        }, {});

        // Convert the grouped data to an array of warehouse data
        const warehouseData = Object.keys(groupedData).map(wareHouseId => {
            const categories = Object.keys(groupedData[wareHouseId].categories).map(categoryId => {
                const category = groupedData[wareHouseId].categories[categoryId];
                return {
                    category_name: category.category_name,
                    subcategories: category.subcategories,
                    totalQuantity: category.totalQuantity,
                    totalAmount: category.totalAmount,
                };
            });

            return {
                ware_house_id: wareHouseId,
                ware_house_name: groupedData[wareHouseId].ware_house_name,
                categories: categories,
            };
        });

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
                // Default to A4 size
                pageWidth = 210 * zoomMultiplier;
                pageHeight = 297 * zoomMultiplier;
                break;
        }



        // Get the selected font size value
        const selectedFontSize = document.querySelector('.font_size').value;

        // Get the numeric part of the selected font size value
        const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;


        console.log(searchResults)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/report/stock_category_sub_category_pdf_ware_house`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults: updatedSearchResults, orientation, fontSize, selectedPrintSize, totalAmountSum, totalQuantitySum, warehouseData
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
            a.download = 'stock_ware_house.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            setErrorr(error.message);
        } finally {
            // setLoading(false);
        }
    };


    const stock_print = async () => {
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/report/purchase_product_stock_list_current_month_ware_house_search`, {
                toDate, fromDate, supplier_id, product_id
            });

            const searchResults = response.data.results
            const updatedSearchResults = searchResults.map(product => ({
                ...product,
                total_amount: product.sale_price * product.available_quantity
            }));
            const totalAmountSum = updatedSearchResults ? updatedSearchResults?.reduce((sum, product) => sum + product.total_amount, 0) : 0;
            const totalQuantitySum = updatedSearchResults ? updatedSearchResults?.reduce((sum, product) => sum + product.available_quantity, 0) : 0;;

            console.log(searchResults);
            const groupedData = searchResults.reduce((acc, item) => {
                // Check if the ware_house_id already exists in the accumulator
                if (!acc[item.ware_house_id]) {
                    acc[item.ware_house_id] = {
                        ware_house_name: item.ware_house_name,
                        categories: {},
                    };
                }

                // Check if the category_id exists for the current ware_house_id
                if (!acc[item.ware_house_id].categories[item.category_id]) {
                    acc[item.ware_house_id].categories[item.category_id] = {
                        category_name: item.category_name,
                        subcategories: [],
                        totalQuantity: 0,
                        totalAmount: 0,
                    };
                }

                // Add subcategory details
                acc[item.ware_house_id].categories[item.category_id].subcategories.push({
                    sub_category_name: item.sub_category_name,
                    available_quantity: item.available_quantity,
                    total_amount: item.sale_price * item.available_quantity,
                });

                // Update the total quantities and total amounts for the category
                acc[item.ware_house_id].categories[item.category_id].totalQuantity += item.available_quantity;
                acc[item.ware_house_id].categories[item.category_id].totalAmount += item.sale_price * item.available_quantity;

                return acc;
            }, {});

            // Convert the grouped data to an array of warehouse data
            const warehouseData = Object.keys(groupedData).map(wareHouseId => {
                const categories = Object.keys(groupedData[wareHouseId].categories).map(categoryId => {
                    const category = groupedData[wareHouseId].categories[categoryId];
                    return {
                        category_name: category.category_name,
                        subcategories: category.subcategories,
                        totalQuantity: category.totalQuantity,
                        totalAmount: category.totalAmount,
                    };
                });

                return {
                    ware_house_id: wareHouseId,
                    ware_house_name: groupedData[wareHouseId].ware_house_name,
                    categories: categories,
                };
            });

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
                    // Default to A4 size
                    pageWidth = 210 * zoomMultiplier;
                    pageHeight = 297 * zoomMultiplier;
                    break;
            }

            console.log(zoomMultiplier)

            // Get the selected font size value
            const selectedFontSize = document.querySelector('.font_size').value;

            // Get the numeric part of the selected font size value
            const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;
            const extraColumnValue = parseInt(document.getElementById('extra_column').value);

            const printWindow = window.open('', '_blank');
            printWindow.document.open();

            const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/report/stock_category_sub_category_print_ware_house`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults: updatedSearchResults, selectedPrintSize, orientation, fontSize, totalAmountSum, totalQuantitySum, warehouseData
                }),
            });

            const htmlText = await html.text();

            printWindow.document.write(htmlText);
            printWindow.document.close(); // Ensure the document is completely loaded before printing
            printWindow.focus();
        } catch (error) {
            console.error('Error generating print view:', error.message);
        }
    };




    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card mb-4'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Search Stock Category / Sub Category Ware House</h5>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="col-md-10 offset-md-1">
                                            <div className="form-group row student">
                                                <label htmlFor="fromDate" className="col-form-label col-md-2"><strong>Start Date:</strong></label>
                                                <div className="col-md-4">
                                                    <input
                                                        className="form-control form-control-sm"
                                                        type="text"
                                                        placeholder='dd-mm-yyyy'
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
                                                        placeholder='dd-mm-yyyy'
                                                        id="toDate"
                                                        className="form-control form-control-sm"
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
                                                <label className="col-form-label col-md-2"><strong>Product Category:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={supplier_id} onChange={(e) => setSupplier_id(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Catgeory Name</option>
                                                        {
                                                            categorys.map(subCat =>
                                                                <>
                                                                    <option value={subCat.id}>{subCat.category_name}</option>
                                                                </>
                                                            )
                                                        }
                                                    </select>


                                                </div>
                                                <label className="col-form-label col-md-2"><strong>Product Sub Category:</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        value={product_id} onChange={(e) => setProduct_id(e.target.value)}
                                                        name="statusFilter"
                                                        className="form-control form-control-sm integer_no_zero"
                                                    >
                                                        <option value="">Select Sub Category Name</option>
                                                        {
                                                            subCategories.map(subCat =>
                                                                <>
                                                                    <option value={subCat.id}>{subCat.sub_category_name}</option>
                                                                </>
                                                            )
                                                        }
                                                    </select>

                                                </div>
                                            </div>


                                            <div class="form-group row student d-none">
                                                <label class="col-form-label col-md-2"><strong>Extra Column:</strong></label>
                                                <div className="col-md-10">
                                                    <select name="extra_column" className="form-control form-control-sm alpha_space extra_column" id="extra_column" placeholder="Extra Column">
                                                        {(() => {
                                                            const options = [];
                                                            for (let i = 0; i <= 100; i++) {
                                                                options.push(<option key={i} value={i}>{i}</option>);
                                                            }
                                                            return options;
                                                        })()}
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
                                                            <option value="font-12">Font Standard</option>
                                                            <option value="font-10">Font Small</option>

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
                                            <div className="form-group row">
                                                <div className="offset-md-2 col-md-10 float-left">
                                                    <input
                                                        type="button"
                                                        name="search"
                                                        className="btn btn-sm btn-info search_btn mr-2"
                                                        value="Search"
                                                        onClick={purchase_product_stock_list_search}

                                                    />
                                                    <input
                                                        type="button"
                                                        name="search"
                                                        class="btn btn-sm btn-success print_btn mr-2"
                                                        value="Print"
                                                        onClick={stock_print}
                                                    />
                                                    <input

                                                        type="button"
                                                        onClick={stock_pdf_download}
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

                    <div class="col-md-12">
                        <div class="table-responsive">
                            <table class="table table-bordered ">

                                {loading ? (
                                    <div className='text-center'>
                                        <FontAwesomeIcon style={{ height: '33px', width: '33px' }} icon={faSpinner} spin />
                                    </div>
                                ) : (
                                    searchResults.length > 0 ? (
                                        <>
                                            <thead>
                                                <tr className="report-bg w-100">
                                                    <th>Ware House / Category / Sub Catgeory</th>

                                                    <th>Total Quantity</th>
                                                    <th>Total Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {warehouseData.map((ware_house, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr className="report-bg">
                                                            <th>{ware_house.ware_house_name}</th>
                                                            <th></th>
                                                            <th></th>
                                                        </tr>
                                                        {ware_house.categories.map((subcategory, subIndex) => (
                                                            <React.Fragment key={subIndex}>
                                                                <tr className="report-bg">
                                                                    <th>{subcategory.category_name}</th>
                                                                    <th></th>
                                                                    <th></th>
                                                                </tr>
                                                                {subcategory.subcategories.map((sub, subCatIndex) => (
                                                                    <tr key={subCatIndex}>
                                                                        <td>{sub.sub_category_name}</td>
                                                                        <td>{sub.available_quantity}</td>
                                                                        <td>{sub.total_amount}</td>
                                                                    </tr>
                                                                ))}
                                                            </React.Fragment>
                                                        ))}
                                                        <tr className="report-bg">
                                                            <td style={{ borderBottom: "2px solid #000" }}>Sub Total</td>
                                                            <td style={{ borderBottom: "2px solid #000" }}>
                                                                {ware_house.categories.reduce(
                                                                    (sum, category) => sum + category.subcategories.reduce(
                                                                        (subSum, sub) => subSum + sub.available_quantity, 0
                                                                    ), 0
                                                                )}
                                                            </td>
                                                            <td style={{ borderBottom: "2px solid #000" }}>
                                                                {ware_house.categories.reduce(
                                                                    (sum, category) => sum + category.subcategories.reduce(
                                                                        (subSum, sub) => subSum + sub.total_amount, 0
                                                                    ), 0
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                ))}

                                                <tr className="report-bg">
                                                    <th>Total</th>
                                                    <th>
                                                        {warehouseData.reduce((sum, wareHouse) => sum + wareHouse.categories.reduce(
                                                            (catSum, category) => catSum + category.subcategories.reduce(
                                                                (subSum, sub) => subSum + sub.available_quantity, 0
                                                            ), 0
                                                        ), 0)}
                                                    </th>
                                                    <th>
                                                        {warehouseData.reduce((sum, wareHouse) => sum + wareHouse.categories.reduce(
                                                            (catSum, category) => catSum + category.subcategories.reduce(
                                                                (subSum, sub) => subSum + sub.total_amount, 0
                                                            ), 0
                                                        ), 0)}
                                                    </th>
                                                </tr>
                                            </tbody>

                                        </>

                                    )


                                        : (

                                            <>
                                                <thead>
                                                    <tr className="report-bg w-100">
                                                        <th>Ware House / Category / Sub Catgeory</th>

                                                        <th>Total Quantity</th>
                                                        <th>Total Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {warehouseDatas.map((ware_house, index) => (
                                                        <React.Fragment key={index}>
                                                            <tr className="report-bg">
                                                                <th>{ware_house.ware_house_name}</th>
                                                                <th></th>
                                                                <th></th>
                                                            </tr>
                                                            {ware_house.categories.map((subcategory, subIndex) => (
                                                                <React.Fragment key={subIndex}>
                                                                    <tr className="report-bg">
                                                                        <th>{subcategory.category_name}</th>
                                                                        <th></th>
                                                                        <th></th>
                                                                    </tr>
                                                                    {subcategory.subcategories.map((sub, subCatIndex) => (
                                                                        <tr key={subCatIndex}>
                                                                            <td>{sub.sub_category_name}</td>
                                                                            <td>{sub.available_quantity}</td>
                                                                            <td>{sub.total_amount}</td>
                                                                        </tr>
                                                                    ))}
                                                                </React.Fragment>
                                                            ))}
                                                            <tr className="report-bg">
                                                                <td style={{ borderBottom: "2px solid #000" }}>Sub Total</td>
                                                                <td style={{ borderBottom: "2px solid #000" }}>
                                                                    {ware_house.categories.reduce(
                                                                        (sum, category) => sum + category.subcategories.reduce(
                                                                            (subSum, sub) => subSum + sub.available_quantity, 0
                                                                        ), 0
                                                                    )}
                                                                </td>
                                                                <td style={{ borderBottom: "2px solid #000" }}>
                                                                    {ware_house.categories.reduce(
                                                                        (sum, category) => sum + category.subcategories.reduce(
                                                                            (subSum, sub) => subSum + sub.total_amount, 0
                                                                        ), 0
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </React.Fragment>
                                                    ))}

                                                    <tr className="report-bg">
                                                        <th>Total</th>
                                                        <th>
                                                            {warehouseDatas.reduce((sum, wareHouse) => sum + wareHouse.categories.reduce(
                                                                (catSum, category) => catSum + category.subcategories.reduce(
                                                                    (subSum, sub) => subSum + sub.available_quantity, 0
                                                                ), 0
                                                            ), 0)}
                                                        </th>
                                                        <th>
                                                            {warehouseDatas.reduce((sum, wareHouse) => sum + wareHouse.categories.reduce(
                                                                (catSum, category) => catSum + category.subcategories.reduce(
                                                                    (subSum, sub) => subSum + sub.total_amount, 0
                                                                ), 0
                                                            ), 0)}
                                                        </th>
                                                    </tr>
                                                </tbody>

                                            </>
                                        )
                                )}




                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockWareHouses;

