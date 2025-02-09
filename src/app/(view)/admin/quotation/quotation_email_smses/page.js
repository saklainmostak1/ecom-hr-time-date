'use client'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const SmsEmailQuotation = ({ id }) => {

    const { data: saleProductSingle = [] } = useQuery({
        queryKey: ['saleProductSingle'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/quotation/quotation_single/${id}`);
            const data = await res.json();
            return data;
        }
    });

    console.log(saleProductSingle)

    const { data: allUser = [],
    } = useQuery({
        queryKey: ['allUser'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/allUser`)

            const data = await res.json()
            return data
        }
    })

    const [assetInfo, setAssetInfo] = useState(

        {
            mobile: '',
            full_name: '',
            email: '',
            discount: '',
            quotation_date: '',
            paid_amount: '',
            invoice_id: '',
        }

    );


    useEffect(() => {

        setAssetInfo({
            mobile: saleProductSingle[0]?.mobile || '',
            email: saleProductSingle[0]?.email || '',
            discount: saleProductSingle[0]?.discount,
            quotation_date: saleProductSingle[0]?.quotation_date,
            full_name: saleProductSingle[0]?.full_name,
            paid_amount: saleProductSingle[0]?.paid_amount,
            invoice_id: saleProductSingle[0]?.invoice_id,

        });
    }, [saleProductSingle]);



    const [sendEmailChecked, setSendEmailChecked] = useState(true);
    const [sendSmsChecked, setSendSmsChecked] = useState(true);

    const brand_input_changes = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...assetInfo }
        attribute[name] = value
        if (assetInfo.email) {
            setEmailError('')
        }
        if (assetInfo.mobile) {
            setMobileError('')
        }
        setAssetInfo(attribute)



    };


    const { data: quotation_current_date_count = [],
    } = useQuery({
        queryKey: ['quotation_current_date_count'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/quotation/quotation_current_date_count`)

            const data = await res.json()
            return data
        }
    })


    const productSingle = saleProductSingle[0]


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

        refetch,
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


    const designationemployee = employee.find(emp => emp.designation_id == sortNumberOne.id)
    console.log(designationemployee)
    // const employeeInfo = employee.find(emp => emp.user_id == saleProductSingle[0]?.user_id)
    // console.log(employeeInfo)

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

        const product = productSingle?.sale_product

        product?.forEach((item, index) => {
            const quantity = parseFloat(item.quantity) || 0;
            const discount = parseFloat(item.discount) || 0;
            const salePrices = parseFloat(item.sale_price) || 0;
            const productName = item.product_name || "Unknown"

            const salePrice = salePrices + discount;
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
<p>${assetInfo.full_name}<br>
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
            <td colspan="5" class="total" style="float:right;"><div style="float: right;">Sub Total</div></td>
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

    const generateMemoHTML = () => {



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


    const [emailError, setEmailError] = useState('')
    const [mobileError, setMobileError] = useState('')

    const sendEmail = (event) => {
        event.preventDefault()
        if (!sendEmailChecked) {
            console.log('Email sending is disabled');
            return;
        }
        if (!assetInfo.email) {
            setEmailError("Enter A Email To Send Invoice")
            return
        }

        const emailBody3 = generateQuotationHTML();
        const emailBody4 = generateMemoHTML();

        const emailData = {
            email: assetInfo.email,
            subject: "Quotation Invoice",
            msg: emailBody3,
            msg2: emailBody4,

        };
        // ${process.env.NEXT_PUBLIC_API_URL}:5002/send-email/invoice

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/send-email/invoice/single`, {
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



    console.log(sendSmsChecked)
    const sendOtpToAllEmployees = (event) => {
        event.preventDefault();
        if (!sendSmsChecked) {
            console.log('SMS sending is disabled');
            return;
        }
        if (!assetInfo.mobile) {
            setMobileError("Enter A Mobile To Send Invoice")
            return
        }

        if (employeeSalarySmsTemplate !== 1) {
            console.log('Auto is not active');
            return;
        }
        const formatDates = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad single digit month with zero
            const day = String(date.getDate()).padStart(2, '0'); // Pad single digit day with zero

            return `${year}${month}${day}`; // Returns in format: 20250130
        };
        const currentDate = new Date();

        const smsTime = currentDate.toLocaleTimeString();

        let sms = []
        const product = productSingle?.sale_product
        product?.forEach((employee) => {

            // Replace placeholders with actual data
            let msgs = employeeAttendanceSmsTemplateShortCode
                .replace('[[short_code_name]]', employee.product_name)
                .replace('[[short_code_price]]', employee.sale_price)
                .replace('[[short_code_discount]]', employee.discount)
                .replace('[[short_code_quantity]]', employee.quantity)


            sms.push(msgs);
        }
        );

        // Replace placeholders with actual data
        let msg = employeeAttendanceSmsTemplate
            .replace('[[full_name]]', assetInfo.full_name)
            .replace('[[all_short_code]]', sms)
            .replace('[[total_amount]]', assetInfo.paid_amount)
            .replace('[[invoice_id]]', `UIS/${formatDates() + quotation_current_date_count.count_today}`)
            .replace('[[discount]]', assetInfo.discount)
            .replace('[[sms_time]]', smsTime);



        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/attendance/attendance_otp`, {
            // quick_api: quickApi,
            formattedUrl,
            mobile: assetInfo.mobile,
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
                {/* <DatePicker  format="MM-dd-yyyy hh:mm aa" showMeridiem /> */}
                <div className='col-12 p-4'>
                    <div className='card'>

                        <div className="card-default">


                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Send Quotation Email Sms</h5>
                                <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
                                    <Link href={`/Admin/quotation/quotation_all`} className="btn btn-sm btn-info">Quotation List</Link>
                                </div>
                            </div>
                            <>
                                <form className="form-horizontal" method="post" autoComplete="off"
                                    // onSubmit={sendEmail}
                                    onSubmit={(e) => { sendEmail(e); sendOtpToAllEmployees(e); }}
                                >

                                    <div className="card-body">
                                        <div class="d-lg-flex md:d-md-flex justify-content-between px-4">
                                            <div className='col-md-10 row'>
                                                <label htmlFor="fromDate" class="col-form-label col-md-3"><strong>Send Email:</strong></label>
                                                <div className="col-md-7">
                                                    <div class="input-group">
                                                        <div class="input-group-prepend">
                                                            <span class="input-group-text" id="basic-addon1"> <input
                                                                type="checkbox"
                                                                checked={sendEmailChecked}
                                                                onChange={(e) => setSendEmailChecked(e.target.checked)}
                                                                name="check_box_otp"
                                                                value="1"
                                                            /></span>
                                                        </div>
                                                        <input
                                                            onChange={brand_input_changes}
                                                            value={assetInfo.email} type="text" class="form-control" name='email' placeholder="Enter Your Email" aria-label="Input group example" aria-describedby="btnGroupAddon2" />
                                                    </div>
                                                    {
                                                        emailError && <p className='text-danger'>{emailError}</p>
                                                    }
                                                </div>
                                            </div>

                                        </div>
                                        <div class="d-lg-flex md:d-md-flex justify-content-between px-4 mt-4">

                                            <div className='col-md-10 row'>
                                                <label htmlFor="fromDate" class="col-form-label col-md-3"><strong>Send Sms:</strong></label>
                                                <div className="col-md-7">
                                                    <div class="input-group mb-3">
                                                        <div class="input-group-prepend">
                                                            <span class="input-group-text" id="basic-addon1"><input
                                                                type="checkbox"
                                                                checked={sendSmsChecked}
                                                                onChange={(e) => setSendSmsChecked(e.target.checked)}
                                                                name="check_box_otps"
                                                                value="1"

                                                            /></span>
                                                        </div>
                                                        <input
                                                            onChange={brand_input_changes}
                                                            value={assetInfo.mobile} name="mobile" type="text" class="form-control" placeholder="Enter Your Mobile" aria-label="Input group example" aria-describedby="btnGroupAddon2" />
                                                    </div>
                                                    {
                                                        mobileError && <p className='text-danger'>{mobileError}</p>
                                                    }
                                                </div>
                                            </div>

                                        </div>
                                        <div className="form-group row mt-3 mt-5 ml-5">

                                            <input type="submit" name="create" className="btn btn-success btn-sm" value="Send" />
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

export default SmsEmailQuotation;


// 'use client'
// import React, { useState } from "react";
// import { DatePicker } from "rsuite";
// import "rsuite/dist/rsuite.min.css";
// const MyComponent = () => {
 
//   const [selectedDate, setSelectedDate] = useState(null);

//   const handleDateChange = (value) => {
//     setSelectedDate(value);
//     console.log("Selected Date:", value);
//   };

//   return (
//     <div>
//         <div  >
//       <DatePicker 
      
//         format="MM-dd-yyyy hh:mm aa" 
//         showMeridiem 
//         onChange={handleDateChange} 
//       />
//       <p>Selected Date: {selectedDate ? selectedDate.toString() : "None"}</p>
//     </div>
      
     
//     </div>
//   );
// };

// export default MyComponent;







// import React, { useState } from "react";
// import { DatePicker } from "rsuite";
// import "rsuite/dist/rsuite.min.css";

// const MyComponent = () => {
//   const [selectedDate, setSelectedDate] = useState(null);

//   const handleDateChange = (value) => {
//     setSelectedDate(value);
//     console.log("Selected Date:", value);
//   };

//   return (
//     <div>
//       <DatePicker 
//         format="MM-dd-yyyy hh:mm aa" 
//         showMeridiem 
//         onChange={handleDateChange} 
//       />
//       <p>Selected Date: {selectedDate ? selectedDate.toString() : "None"}</p>
//     </div>
//   );
// };

// export default MyComponent;
