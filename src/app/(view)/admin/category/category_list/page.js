'use client' 
 //ismile
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import '../../../admin_layout/modal/fa.css'
import Select from 'react-dropdown-select';
import './style.css'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import * as XLSX from "xlsx";
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType } from 'docx';

const CategoryList = ({searchParams}) => {

    const [loading, setLoading] = useState(false);
    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');

    
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

    const [userId, setUserId] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setUserId(storedUserId);
        }
    }, []);


    const [pageUsers, setPageUsers] = useState([]);
    const { data: categorys = [], isLoading, refetch
    } = useQuery({
        queryKey: ['categorys'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_all`)

            const data = await res.json()
            return data
        }
    })




    const { data: moduleInfo = []
    } = useQuery({
        queryKey: ['moduleInfo'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${userId}`)

            const data = await res.json()
            return data
        }
    })
    console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'category'))
    const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'category')

    //   console.log(filteredModuleInfo);


    const filteredBtnIconEdit = brandList.filter(btn =>
        btn.method_sort === 3
    );
    const filteredBtnIconCopy = brandList.filter(btn =>
        btn.method_sort === 4
    );



    const filteredBtnIconDelete = brandList.filter(btn =>
        btn.method_sort === 5
    );
    const filteredBtnIconCreate = brandList.filter(btn =>
        btn.method_sort === 1
    );

    // http://192.168.0.119:5002/admin/brand/brand_delete/3
    





//  searching Start

    const { data: module_settings = []
    } = useQuery({
        queryKey: ['module_settings'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`)

            const data = await res.json()
            return data
        }
    })

    console.log(module_settings)
    const Category = module_settings.filter(moduleI => moduleI.table_name === 'category')
    const columnListSelected = Category[0]?.column_name
    const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());
    const columnListSelectedSearch = Category[0]?.search
    const columnListSelectedSerachArray = columnListSelectedSearch?.split(',').map(item => item.trim());
    
    console.log(Category[0]?.column_name)
  
console.log(columnListSelectedArray)

    const formatString = (str) => {
        const words = str?.split('_');

        const formattedWords = words?.map((word) => {
            const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return capitalizedWord;
        });

        return formattedWords?.join(' ');
    };

    const columnNames = categorys && categorys.length > 0 ? Object.keys(categorys[0]) : [];


    console.log('Column Names:', columnNames);


    const [selectedColumnsSearch, setSelectedColumnsSerach] = useState([]);


    const [selectedColumns, setSelectedColumns] = React.useState([]);

    useEffect(() => {
        setSelectedColumns(columnListSelectedArray)
    }, [])

    useEffect(() => {
        setSelectedColumnsSerach(columnListSelectedSerachArray)
    }, [])

    function convertSortString(inputString) {
        const match = inputString.match(/(.*)_\((ASC|DESC)\)/);
      
        if (match) {
          const fieldName = match[1];
          const sortOrder = match[2];
          return `${fieldName} ${sortOrder}`;
        } else {
          return "Invalid input format.";
        }
      }
    
      const multiSearch = selectedColumnsSearch?.map(convertSortString);


 
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);

    const category_search = () => {
        setLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_search`, {
            multiSearch,
            selectedColumns,
            searchQuery,
            statusFilter,
            selectedOrder,
            fromDate,
            toDate
        })
            .then(response => {
                setSearchResults(response.data.results);
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

 

    const buttonStyles = {
        color: '#fff',
        backgroundColor: '#510bc4',
        backgroundImage: 'none',
        borderColor: '#4c0ab8',
    };
    const category_column_change = (selectedItems) => {
        setSelectedColumns(selectedItems.map((item) => item.value));
        // category_search(); 
    };
    console.log(selectedColumns)
    const filteredColumns = columnNames.filter(column => column !== 'id');
    const brand_column_changes = (selectedItems) => {
        setSelectedColumnsSerach(selectedItems.map((item) => item.value));
        // brand_search(); 
    };

   
console.log(searchResults)


    const matched = columnListSelectedArray?.filter(option => columnNames.includes(option));


    console.log(matched);
    console.log(filteredColumns);


  const [status, setStatus] = useState([]);

        
  useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
          .then(res => res.json())
          .then(data => setStatus(data))
  }, [])



// Paigination start
const parentUsers = categorys

const totalData = parentUsers?.length
const dataPerPage = 20

const totalPages = Math.ceil(totalData / dataPerPage)

let currentPage = 1


if (Number(searchParams.page) >= 1) {
    currentPage = Number(searchParams.page)
}


let pageNumber = []
for (let index = currentPage - 2; index <= currentPage + 2; index++) {
    if (index < 1) {
        continue
    }
    if (index > totalPages) {
        break
    }
    pageNumber.push(index)
}

const caregory_list = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_all/${currentPage}/${dataPerPage}`;
    const response = await fetch(url);
    const data = await response.json();
    setPageUsers(data);
};
useEffect(() => {
    caregory_list();
}, [currentPage]);



const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;


const category_delete = id => {

    console.log(id)
    const proceed = window.confirm(`Are You Sure delete${id}`)
    if (proceed) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_delete/${id}`, {
            method: "POST",

        })
            .then(Response => Response.json())
            .then(data => {

                if (data.affectedRows > 0) {
                    // refetch()
                    caregory_list()
                
               
                    
                   
                }
            })
    }
}



const category_print = async () => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_search`, {
            selectedColumns,
            searchQuery,
            statusFilter,
            selectedOrder,
            fromDate,
            toDate
        });
        const searchResults = response.data.results;

        // Get the selected zoom size value
        const selectedZoom = document.querySelector('.zoom_size').value;

        // Convert zoom value to a numeric multiplier
        let zoomMultiplier = 100; // Default zoom multiplier
        if (selectedZoom !== '') {
            zoomMultiplier = parseFloat(selectedZoom) / 100;
        }

        // Get the selected font size value
        const selectedFontSize = document.querySelector('.font_size').value;

        // Get the numeric part of the selected font size value
        const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

        // Get the value of the extra column input field
        const extraColumnValue = parseInt(document.getElementById('extra_column').value);

        // Get the selected print layout (Landscape or Portrait)
        const selectedLayout = document.getElementById('print_layout').value;

        // Determine orientation based on the selected layout
        const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

        // Get the selected print size (A4, A3, Legal)
        const selectedPrintSize = document.getElementById('print_size').value;

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

        if (isNaN(pageWidth) || isNaN(pageHeight) || pageWidth <= 0 || pageHeight <= 0) {
            console.error("Invalid page dimensions. Please check calculations.");
            return;
        }

        // Create a new window for editing
        const editWindow = window.open('', '_blank');

        editWindow.document.write('<html><head><title>Pathshala School & College Expense Form</title><style> @page { size: ' + selectedPrintSize + ' ' + orientation + '; } @media print { @page { size: ' + selectedPrintSize + ' ' + orientation + '; } } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; } thead { background-color: gray; } body { text-align: center; } </style></head><body>');
        editWindow.document.write('<html style="font-size: ' + fontSize + 'px;"><head><title>Pathshala School & College Expense Form</title><style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; } thead { background-color: gray; } body { text-align: center; } </style></head><body>');

        editWindow.document.write('<h2 style="margin: 0; padding: 0;">Pathshala School & College Expense Form</h2>');
        editWindow.document.write('<h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>');
        editWindow.document.write('<p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>');
        editWindow.document.write('<p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>');

        editWindow.document.write('<h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Expense Copy</h3>');
        editWindow.document.write('<div style="display: flex; justify-content: space-between;">');
        editWindow.document.write('<p style="margin: 0; padding: 0;">Receipt No: 829</p>');
        editWindow.document.write('<p style="margin: 0; padding: 0;">Collected By: পাঠশালা স্কুল এন্ড কলেজ</p>');
        editWindow.document.write('<p style="margin: 0; padding: 0;">Date: </p>');
        editWindow.document.write('</div>');

        // Render the filtered data in a table for editing
        editWindow.document.write('<table style="font-size: ' + fontSize + 'px;">');
        editWindow.document.write('<thead>');
        editWindow.document.write('<tr>');

        // Render headers for selected columns
        const editableHeaders = []; // Array to store headers for editable columns
        selectedColumns.forEach(column => {
            if (column !== 'action') {
                // Display 'Status' if the column name is 'status_id'
                const columnHeader = column === 'status_id' ? 'Status' : formatString(column);
                editWindow.document.write('<th style="font-size:' + fontSize + 'px;"><h2>' + columnHeader + '</h2></th>');

                // Push header to editableHeaders if it's an extra column
                if (column.startsWith('extra')) {
                    editableHeaders.push('<th style="font-size:' + fontSize + 'px;" contenteditable="true"><h2>' + columnHeader + '</h2></th>');
                }
            }
        });

        // Add Extra Column headers with editable input fields
        for (let i = 1; i <= extraColumnValue; i++) {
            editWindow.document.write(editableHeaders[i - 1] || '<th style="font-size:' + fontSize + 'px;" contenteditable="true">Column ' + i + '</th>');
        }

        editWindow.document.write('</tr></thead>');
        editWindow.document.write('<tbody>');

        // Render rows of data
        const longTextColumns = ['category_name', 'description'];
        searchResults.forEach((category, index) => {
            editWindow.document.write('<tr>');

            // Render cells for selected columns
            selectedColumns.forEach(column => {
                if (column !== 'action') {
                
                    const style = longTextColumns.includes(column) ? 'word-wrap: break-word; word-break: break-all;' : '';
                    editWindow.document.write('<td' + (column.startsWith('extra') ? ' contenteditable="true"' : '') + ' style="font-size:' + fontSize + 'px;' + style + '">');

                    if (column === 'file_path') {
                        // Special handling for the 'File Path' column to display images
                        editWindow.document.write(`<img src="${process.env.NEXT_PUBLIC_API_URL}:5003/${category.file_path}" style="max-width: 100px;" alt="Image"/>`);

                    } else if (column === 'serial') {
                        // Rendering serial number if the column is 'serial'
                        editWindow.document.write(index + 1);
                    } else if (column === 'status_id') {
                        // Display status based on status_id value
                        let statusText = '';
                        switch (category[column]) {
                            case 1:
                                statusText = 'Active';
                                break;
                            case 2:
                                statusText = 'Inactive';
                                break;
                            case 3:
                                statusText = 'Pending';
                                break;
                            default:
                                statusText = 'Unknown';
                        }
                        editWindow.document.write(statusText);
                    } else {
                        // Default rendering for other columns
                        editWindow.document.write(category[column]);
                    }
                    editWindow.document.write('</td>');
                }
            });

            // Render cells for extra columns
            for (let i = 0; i < extraColumnValue; i++) {
                editWindow.document.write('<td style="font-size:' + fontSize + 'px;" contenteditable="true"></td>');
            }

            editWindow.document.write('</tr>');
        });

        editWindow.document.write('</tbody></table>');
        editWindow.document.write('</body></html>');
        editWindow.document.close();

        // Print the editing window
        editWindow.print();
    } catch (error) {
        setError("An error occurred during printing.", error);
    }
};




const category_excel_download = async() => {
    

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_search`, {
            selectedColumns,
            searchQuery,
            statusFilter,
            selectedOrder,
            fromDate,
            toDate
        });
        const searchResults = response.data.results;

    const totalColumns = selectedColumns.length;

    // Filter the columns to export and add serial column
    const filteredColumns = searchResults.map((category, index) => {
        const filteredData = {
            'Serial': index + 1 // Serial column
        };
        const getStatusFromId = (statusId) => {
            switch (statusId) {
                case 1:
                    return 'Active';
                case 2:
                    return 'Inactive';
                case 3:
                    return 'Pending';
                default:
                    return '';
            }
        };
    
        selectedColumns.forEach(column => {
            if (column !== 'file_path' && category.hasOwnProperty(column)) {
                if (column === 'status_id') {
                    filteredData['Status'] = getStatusFromId(category[column]);
                } else {
                    filteredData[formatString(column)] = category[column];
                }
            }
        });
        return filteredData;
    });

    // Function to get status based on status_id
 
    // Create worksheet with filtered data
    const worksheet = XLSX.utils.json_to_sheet(filteredColumns);

    // Calculate width for each column
    const columnWidth = 100 / totalColumns;

    // Set width for each column
    const columnWidths = [];
    for (let i = 0; i < totalColumns; i++) {
        if (selectedColumns[i] !== 'file_path') {
            columnWidths.push({ wpx: columnWidth * totalColumns }); // Setting width in characters
        }
    }
    worksheet['!cols'] = columnWidths;
    console.log(columnWidths);

    // Create workbook and write to file
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'category_results.xlsx');
}catch (error) {
    console.error("An error occurred during printing.", error);
    setError("An error occurred during printing.", error);
};
};






const category_word_download = async () => {

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_search`, {
            selectedColumns,
            searchQuery,
            statusFilter,
            selectedOrder,
            fromDate,
            toDate
        });
        const searchResults = response.data.results;
    if (!selectedColumns || !selectedColumns.length || !searchResults || !searchResults.length) {
        console.error('Selected columns or filtered categories are not available.');
        return;
    }

    // Determine if serial column should be included
    const includeSerial = selectedColumns.includes('serial');

    // Create header row
    const headerRow = new TableRow({
        children: selectedColumns
            .filter(column => column !== 'action' && column !== 'file_path') // Exclude action column
            .map(column => new TableCell({
                children: [new Paragraph({ text: formatString(column), bold: true })],
                borders: {},
            })),
    });

    // Create data rows
    const dataRows = searchResults.map((color, index) => new TableRow({
        children: selectedColumns
            .filter(column => column !== 'action' && column !== 'file_path') // Exclude action column
            .map(column => {
                let cellData = '';
                
                if (column === 'serial' && includeSerial) {
                    // Handle serial column
                    cellData =   index + 1;

                } else if (column === 'status_id') {
                    // Handle status column
                    cellData = color.status_id === 1 ? 'Active' :
                        color.status_id === 2 ? 'Inactive' :
                        color.status_id === 3 ? 'Pending' : '';
                } else {
                    // Default rendering for other columns
                    cellData = color[column] || ''; // Handle undefined or null values
                }
                

                return new TableCell({
                    children: [new Paragraph({ text: cellData.toString()})],
                    borders: {},
                });
            }),
    }));
    const table = new Table({
        rows: [headerRow, ...dataRows],
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        columnWidths: selectedColumns
            .filter(column => column !== 'action' && column !== 'file_path') // Exclude action column
            .map(() => 100 / selectedColumns.length),
    });

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun("category List")
                    ],
                    alignment: 'center',
                }),
                table, // Add the table to the document
            ],
        }],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'category_list.docx';
    link.click();
}catch (error) {
    console.error("An error occurred during printing.", error);
    setError("An error occurred during printing.", error);

}
};


const category_pdf_download = () => {


    
    category_search()
    var doc = new jsPDF();


    doc.autoTable({
        html: '#mytable',
        bodyStyles: { minCellHeight: 10 },
        didDrawCell: function (data) {

            let flag = selectedColumns.indexOf("file_path");

            if (data.column.index === flag && data.cell.section === 'body') {
                var td = data.cell.raw;
                var img = td.getElementsByTagName('img')[0];
                var dim = data.cell.height - data.cell.padding('vertical');
                let image = img.src;  // Some path has no images so the the dynamic image shows error
                // let image = '${process.env.NEXT_PUBLIC_API_URL}:5003/images/2024/02/08/11/49/Screenshot%20(5).png';  
                if (image.endsWith(".png") || image.endsWith(".PNG") || image.endsWith(".JPEG") || image.endsWith(".jpeg") || image.endsWith(".JPG") || image.endsWith(".jpg")) {
                    doc?.addImage(image, data.cell.x+2, data.cell.y, dim+7, dim+2);                
                }
            }
        }
    });
    doc.save("Category List.pdf");
}

// const category_PDF_download = async () => {
//     const doc = new jsPDF();
    
//     // Filter out the 'action' column from selectedColumns
//     const columnsToDisplay = selectedColumns.filter(column => column !== 'action');
    
//     // Prepare head and body data for autoTable
//     const headData = columnsToDisplay.map(column => formatString(column));

//     const bodyData = await Promise.all(searchResults.map(async (category, i) => {
//         const rowData = await Promise.all(columnsToDisplay.map(async column => {
//             if (column === 'serial') {
//                 return i + 1; // Rendering serial number
//             } else if (column === 'file_path') {
//                 // Load the image
//                 const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}:5003/${category.file_path}`;

//                 try {
//                     const img = await loadImage(imageUrl);
//                     console.log(img)
                   
//                     return img;
//                 } catch (error) {
                   
//                     return 'Image Not Found'; // Placeholder for error
//                 }
//             } else if (column === 'status_id') {
//                 // Handle status ID
//                 const statusId = category.status_id;
//                 if (statusId === 1) {
//                     return 'Active';
//                 } else if (statusId === 2) {
//                     return 'Inactive';
//                 } else if (statusId === 3) {
//                     return 'Pending';
//                 } else {
//                     return 'Unknown';
//                 }
//             } else {
//                 return category[column];
//             }
//         }));

//         return rowData;
//     }));

//     // Generate autoTable
//     doc.autoTable({
//         head: [headData],
//         body: bodyData,
//     });

//     // Download PDF
//     doc.save('filtered_category_list.pdf');
// }


// const loadImage = (url) => {

//     return new Promise((resolve, reject) => {
//         const img = new Image();

//         img.onload = () => resolve(img);

//         img.onerror = error => reject(error);

//         img.src = url;

//     });
// };

const handleDateChange = date => {
    setFromDate(date);
};
const handleDateChanges = date => {
    setToDate(date);
};


console.log(multiSearch)
const [message, setMessage] = useState();
useEffect(() => {
    if (sessionStorage.getItem("message")) {
        setMessage(sessionStorage.getItem("message"));
        sessionStorage.removeItem("message");
    }
}, [])

const category_delete_searching = id => {
    const proceed = window.confirm(`Are you sure you want to delete ID ${id}?`);
    if (proceed) {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_delete/${id}`)
            .then(response => {
                console.log(response)
                // Handle success, such as displaying a success message or updating the UI
                alert('category deleted successfully');
                // Update the searchResults array by removing the deleted category
                setSearchResults(prevResults => prevResults.filter(category => category.id !== id));
            })
            .catch(error => {
                // Handle error, such as displaying an error message
                console.error('Error deleting warranty:', error);
                alert('Cannot Delete Because Data is Running');
            });
    }
};


const [errorr, setErrorr] = useState(null);


    const category_PDF_download = async () => {
        // setLoading(true);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_search`, {
            selectedColumns,
            searchQuery,
            statusFilter,
            selectedOrder,
            multiSearch,
            fromDate,
            toDate
        });

        const searchResults = response.data.results;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchResults, selectedColumns
                    // Other parameters if needed
                }),

                // If you need to send any data with the request, you can include it here
                // body: JSON.stringify({ /* your data */ }),
            });

            if (!response.ok) {
                throw new Error('Error generating PDF In category');
            }


            // If you want to download the PDF automatically
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'category_pdf.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            setErrorr(error.message);
        } finally {
            // setLoading(false);
        }
    };

    const longTextStyle = {
        wordBreak: 'break-all',
        wordWrap: 'break-word',
        whiteSpace: 'normal',
      };

      const [showFromDate, setShowFromDate] = useState('');
      const [showToDate, setShowToDate] = useState('');
  
  
      const handleDateChangess = (event) => {
          const selectedDate = new Date(event.target.value);
          const day = String(selectedDate.getDate()).padStart(2, '0');
          const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
          const year = String(selectedDate.getFullYear()); // Get last two digits of the year
          const formattedDate = `${day}-${month}-${year}`;
          setShowFromDate(formattedDate);
          setFromDate(selectedDate);
      };
  
      // Open date picker when text input is clicked
      const handleTextInputClick = () => {
          document.getElementById('dateInput').showPicker();
      };
  
      const handleDateChangesss = (event) => {
          const selectedDate = new Date(event.target.value);
          const day = String(selectedDate.getDate()).padStart(2, '0');
          const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
          const year = String(selectedDate.getFullYear()); // Get last two digits of the year
          const formattedDate = `${day}-${month}-${year}`;
          setShowToDate(formattedDate);
          setToDate(selectedDate);
      };
  
      // Open date picker when text input is clicked
      const handleTextInputClicks = () => {
          document.getElementById('dateInputTo').showPicker();
      };

    return (
        <div class="container-fluid">
        <div class=" row ">

            <div className='col-12 p-4'>
          {
                message &&

                <div className="alert alert-success font-weight-bold">
                    {message}
                </div>
            }
                <div className='card mb-4'>
     
            <div class=" body-content bg-light ">

                <div class=" border-primary shadow-sm border-0">
                    <div class=" card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                        <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Category Search</h5>
                        <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                            <Link href={`/Admin/category/category_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create Category</Link>
                        </div>
                    </div>

               
                    <div class="card-body">
                <form class="">
                    <div class="col-md-10 offset-md-1">
                        <div class="form-group row student">
                    <label class="col-form-label col-md-3"><strong>Search Properties:</strong></label>

<div className="col-md-9">


<Select
                                        name='select'
                                        labelField='label'
                                        valueField='value'
                                        options={
                                            columnListSelectedSerachArray?.map(column => {
                                                let label = formatString(column);
                                                let value = column;
                                                if (column.startsWith("status_id_")) {
                                                    // Check if it ends with (ASC) or (DESC)
                                                    if (column.endsWith("(ASC)")) {
                                                        label = "Status (asc)";
                                                        value = "status_id_(ASC)";
                                                    } else if (column.endsWith("(DESC)")) {
                                                        label = "Status (desc)";
                                                        value = "status_id_(DESC)";
                                                    }
                                                }
                                                return {
                                                    label: label,
                                                    value: value,
                                                };
                                            })
                                        }
                                        // values={

                                        //     columnListSelectedSerachArray?.map(column => ({
                                        //         label: formatString(column),
                                        //         value: column,
                                        //     }))

                                        // }
                                        onChange={brand_column_changes}

                                        multi
                                       
                                    />






</div>
                           
                        </div>
                        <div className='form-group row student'>
                        <label class="col-form-label col-md-3"><strong>Category Name:</strong></label>
                            <div class="col-md-3">
                                <input
                                    value={searchQuery} 
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    type="text" name="student_id" class="form-control form-control-sm  alpha_space student_id" id="student_id" placeholder="Category Name" />
                            </div>
                            <label class="col-form-label col-md-3"><strong>Status:</strong></label>
                            <div className="col-md-3">
                         
                                <select
                                value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                                    name="statusFilter"
                                    className="form-control form-control-sm integer_no_zero lshift"

                                >
                                  <option value="">Select Status</option>
                                                    {
                                                        status.map(sta =>
                                                            <>

                                                                <option value={sta.id}>{sta.status_name}</option>
                                                            </>

                                                        )
                                                    }


                                </select>
                            </div>
                        </div>

                        {/* <div class="form-group row student">

                           
                             <label className="col-form-label col-md-2"><strong>Extra Column:</strong></label>
        <div className="col-md-4">
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
                        </div> */}


                        {/* <div class="form-group row student">

                                    <label class="col-form-label col-md-3"><strong>From Date:</strong></label>
                                    <div className="col-md-3">
                                        
                                        <DatePicker
                                            selected={fromDate}
                                            dateFormat="dd-MM-yyyy" // Set the date format
                                            placeholderText="dd-mm-yyyy"
                                            class="form-control form-control-sm  alpha_space student_id" onChange={
                                                handleDateChange
                                            } />
                                    </div>

                                    <label class="col-form-label col-md-3"><strong>To Date:</strong></label>
                                    <div class="col-md-3">
                                        <DatePicker
                                            selected={toDate}
                                            dateFormat="dd-MM-yyyy" // Set the date format
                                            placeholderText="dd-mm-yyyy"
                                            class="form-control form-control-sm  alpha_space student_id" onChange={
                                                handleDateChanges
                                            } />
                                    </div>
                                </div> */}

<div class="form-group row student">

<label htmlFor="fromDate" class="col-form-label col-md-3"><strong>From Date:</strong></label>

<div className="col-md-3">
  

    <input
        type="text"
        readOnly
       
        value={showFromDate}
        onClick={handleTextInputClick}
        placeholder="dd-mm-yy"
        className="form-control"
        style={{ display: 'inline-block', }}
    />
    <input
    
        type="date"
        id="dateInput"
        onChange={handleDateChangess}
        style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
    />

    {/* <DatePicker
        className="red-border"
        id="dateInput"
        selected={fromDate}
        dateFormat="dd-MM-yyyy" // Set the date format
        placeholderText="dd-mm-yyyy"
        class="form-control form-control-sm  alpha_space student_id w-full"
        isClearable
        onChange={
            handleDateChange
        } /> */}
</div>

<label htmlFor="toDate" class="col-form-label col-md-3"><strong>To Date:</strong></label>
<div class="col-md-3">
<input
        type="text"
        readOnly
       
        value={showToDate}
        onClick={handleTextInputClicks}
        placeholder="dd-mm-yy"
        className="form-control"
        style={{ display: 'inline-block', }}
    />
    <input
    
        type="date"
        id="dateInputTo"
        onChange={handleDateChangesss}
        style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
    />
    {/* <DatePicker
        id="toDate"
        isClearable
        selected={toDate}
        dateFormat="dd-MM-yyyy" // Set the date format
        placeholderText="dd-mm-yyyy"
        class="form-control form-control-sm  alpha_space student_id" onChange={
            handleDateChanges
        } /> */}
</div>
</div>

                   
                             
                        <div class="form-group row student">

<label class="col-form-label col-md-3"><strong>Design:</strong></label>

<div className="col-md-9">


    <Select
        multi
        options={[
            { label: 'Serial', value: 'serial' }, // Serial option
            ...filteredColumns.map(column => ({
                label: formatString(column),
                value: column,
            })),
            { label: 'Action', value: 'action' }, // Action option
        ]}
        values={

            columnListSelectedArray?.map(column => ({
                label: formatString(column),
                value: column,
            }))

        }

        onChange={category_column_change}
    />






</div>


</div>
<div class="form-group row student">


<label className="col-form-label col-md-3"><strong>Extra Column:</strong></label>
<div className="col-md-9">
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

                        <label class="col-form-label font-weight-bold col-md-3">Print Properties:</label>
<div class="col-md-9">
    <div class="input-group ">
        <select name="print_size" class="form-control form-control-sm  trim integer_no_zero print_size" id="print_size">
            <option value="legal">legal </option>
            <option value="A4">A4 </option>
            <option value="A3">A3 </option>
            <option value="">Browser </option>
        </select>
        <select name="print_layout" class="form-control form-control-sm  trim integer_no_zero print_layout" id="print_layout">

            <option value="landscape">Landscape</option>
            <option value="portrait">Portrait</option>
            <option value="">Browser </option>
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
                    </div>
                    {error && <div>Error: {error}</div>}
                    <div class="form-group row">
                        <div class="offset-md-2 col-md-12 float-left">
                            <input type="button" onClick={category_search} name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search" />
                            <input type="button" onClick={category_print} name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />
                            <input style={buttonStyles} type="button" name="search" class="btn btn-sm btn-indigo pdf_btn mr-2" value="Generate PDF" onClick={category_PDF_download} />
{errorr && <div className="alert alert-danger">{errorr}</div>}
                          
                            <input
    type="button"
    onClick={category_excel_download}
    name="search"
    className="btn btn-sm btn-secondary excel_btn mr-2"
    value="Download Excel"
/>
                          
                            <input
    type="button"
    onClick={category_word_download}
    name="search"
    className="btn btn-sm btn-secondary excel_btn mr-2"
    value="Download Docx"
/>
                            {/* <input type="button" name="search" class="btn btn-sm btn-secondary excel_btn mr-2" value="Download Excel " /> */}
                        </div>
                    </div>
                </form>
                <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
                    <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                </div>

            </div>

                </div>
            </div>
</div>
            
<div className='card'>
            <div class=" border-primary  shadow-sm border-0">
                <div class="card-header  custom-card-header py-1  clearfix bg-gradient-primary text-white">
                    <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Category List</h5>
                    <div class="card-title card-header-color font-weight-bold mb-0  float-right">
                        <Link href={`/Admin/category/category_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create Category</Link>
                    </div>
                </div>


                <div class="card-body" >
                { loading ?  <div className='text-center'>
        <div  className='  text-center text-dark'
        >
          <FontAwesomeIcon style={{
            height: '33px',
            width: '33px',
          }} icon={faSpinner} spin />
        </div>
      </div> : searchResults.length > 0 ? (
                    <div  class="table-responsive">
                        <table id='mytable'  className="table table-bordered table-hover table-striped table-sm">
                            <thead>
                                <tr>
                                    {selectedColumns.map((column, i) => (
                                        <th key={i}>{formatString(column)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                { searchResults.map((brand, i) => (
                                    <tr key={i}>
                                        {selectedColumns.map((column, j) => (
                                            <td key={j} style={['category_name', 'description'].includes(column) ? longTextStyle : {}}>
                                                {column === 'serial' ? (
                                                    // Rendering serial number if the column is 'serial'
                                                    i + 1
                                                ) : column === 'file_path' ? (
                                                    // Special handling for the 'status' column
                                                    <>
                                                        <img
                                                            className=" img-thumbnail"
                                                            style={{ width: '100px' }}
                                                            src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${brand.file_path}`}
                                                            alt="No Image"
                                                        />
                                                    </>
                                                )
                                                    :
                                                    column === 'status_id' ? (
                                                        // Special handling for the 'status' column
                                                        <>
                                                            {brand.status_id === 1 && <p>Active</p>}
                                                            {brand.status_id === 2 && <p>Inactive</p>}
                                                            {brand.status_id === 3 && <p>Pending</p>}
                                                        </>
                                                    )

                                                        : column === 'action' ? (
                                                            // Special handling for the 'status' column
                                                            <div className="flex items-center ">
                                                                <Link href={`/Admin/brand/brand_edit/${brand.id}?page_group=${page_group}`}>
                                                                    {filteredBtnIconEdit?.map((filteredBtnIconEdit => (
                                                                        <button
                                                                            key={filteredBtnIconEdit.id}
                                                                            title='Edit'
                                                                            style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                            className={filteredBtnIconEdit?.btn}
                                                                        >
                                                                            <a
                                                                                dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                            ></a>
                                                                        </button>
                                                                    )))}
                                                                </Link>
                                                                <Link href={`/Admin/brand/brand_copy/${brand.id}?page_group=${page_group}`}>
                                                                    {filteredBtnIconCopy.map((filteredBtnIconEdit => (
                                                                        <button
                                                                            key={filteredBtnIconEdit.id}
                                                                            title='Copy'
                                                                            style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                            className={filteredBtnIconEdit?.btn}
                                                                        >
                                                                            <a
                                                                                dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                            ></a>
                                                                        </button>
                                                                    )))}
                                                                </Link>
                                                                {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                    <button
                                                                        key={filteredBtnIconDelete.id}
                                                                        title='Delete'
                                                                        onClick={() => category_delete_searching(brand.id)}
                                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                        className={filteredBtnIconDelete?.btn}
                                                                    >
                                                                        <a
                                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                        ></a>
                                                                    </button>
                                                                )))}
                                                            </div>
                                                        ) : (
                                                            // Default rendering for other columns
                                                            brand[column]
                                                        )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            
                        
                            
                            }
                            </tbody>
                        </table>
                    </div>
                ) : 
                <>
                 <div className=" d-flex justify-content-between mb-2">
                <div>
                    Total Data: {totalData}
                </div>
                <div class="pagination float-right pagination-sm border">
                    {
                        currentPage - 3 >= 1 && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/category/category_all?page=${1}`}>‹ First</Link>
                        )
                    }
                    {
                        currentPage > 1 && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/category/category_all?page=${activePage - 1}`}>&lt;</Link>
                        )
                    }
                    {
                        pageNumber.map((page) =>
                            <Link
                                key={page}
                                href={`/Admin/category/category_all?page=${page}`}
                                className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                            > {page}
                            </Link>
                        )
                    }
                    {
                        currentPage < totalPages && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/category/category_all?page=${activePage + 1}`}>&gt;</Link>
                        )
                    }
                    {
                        currentPage + 3 <= totalPages && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/category/category_all?page=${totalPages}`}>Last ›</Link>
                        )
                    }
                </div>

            </div>
                 <div className='table-responsive'>


                 <table className="table table-bordered">
                                        <thead className="bg-light">
                                            <tr>
                                                {selectedColumns?.map(column => (
                                                    <th key={column}>{formatString(column)}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pageUsers.length === 0 ? (
                                                <tr><td colSpan={selectedColumns?.length}>No data available</td></tr>
                                            ) : (
                                                pageUsers?.map((category, index) => (
                                                    <tr key={category.id}>
                                                        {selectedColumns?.map(column => (
                                                            <td key={column} style={['category_name', 'description'].includes(column) ? longTextStyle : {}}>
                                                                {column === 'serial' ? (
                                                                    ((currentPage - 1) * dataPerPage) + (index + 1)
                                                                ) :

                                                                    column === 'file_path' ? (
                                                                        // Special handling for the 'status' column
                                                                        <>
                                                                            <img
                                                                                className=" img-thumbnail"
                                                                                style={{ width: '100px' }}
                                                                                src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${category.file_path}`}
                                                                                alt="No Image"
                                                                            />
                                                                        </>
                                                                    ) :
                                                                    column === 'status_id' ? (
                                                                        category[column] === 1 ? 'Active' : category[column] === 2 ? 'Inactive' : category[column] === 3 ? 'Pending' : 'Unknown'
                                                                    )
                                                                    :
                                                                        column === 'action' ? (
                                                                            <div className="flex items-center ">
                                                                                <Link href={`/Admin/category/category_edit/${category.id}?page_group=${page_group}`}>
                                                                                    {filteredBtnIconEdit?.map((filteredBtnIconEdit => (
                                                                                        <button
                                                                                            key={filteredBtnIconEdit.id}
                                                                                            title='Edit'
                                                                                            style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                            className={filteredBtnIconEdit?.btn}
                                                                                        >
                                                                                            <a
                                                                                                dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                                            ></a>
                                                                                        </button>
                                                                                    )))}
                                                                                </Link>
                                                                                <Link href={`/Admin/category/category_copy/${category.id}?page_group=${page_group}`}>
                                                                                    {filteredBtnIconCopy.map((filteredBtnIconEdit => (
                                                                                        <button
                                                                                            key={filteredBtnIconEdit.id}
                                                                                            title='Copy'
                                                                                            style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                            className={filteredBtnIconEdit?.btn}
                                                                                        >
                                                                                            <a
                                                                                                dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
                                                                                            ></a>
                                                                                        </button>
                                                                                    )))}
                                                                                </Link>
                                                                                {filteredBtnIconDelete.map((filteredBtnIconDelete => (
                                                                                    <button
                                                                                        key={filteredBtnIconDelete.id}
                                                                                        title='Delete'
                                                                                        onClick={() => category_delete(category.id)}
                                                                                        style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
                                                                                        className={filteredBtnIconDelete?.btn}
                                                                                    >
                                                                                        <a
                                                                                            dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
                                                                                        ></a>
                                                                                    </button>
                                                                                )))}
                                                                            </div>
                                                                        ) :
                                                                            (
                                                                                category[column]
                                                                            )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
            </div>
            <div className=" d-flex justify-content-between">
                <div>
                    Total Data: {totalData}
                </div>
                <div class="pagination float-right pagination-sm border">
                    {
                        currentPage - 3 >= 1 && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/category/category_all?page=${1}`}>‹ First</Link>
                        )
                    }
                    {
                        currentPage > 1 && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/category/category_all?page=${activePage - 1}`}>&lt;</Link>
                        )
                    }
                    {
                        pageNumber.map((page) =>
                            <Link
                                key={page}
                                href={`/Admin/category/category_all?page=${page}`}
                                className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                            > {page}
                            </Link>
                        )
                    }
                    {
                        currentPage < totalPages && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/category/category_all?page=${activePage + 1}`}>&gt;</Link>
                        )
                    }
                    {
                        currentPage + 3 <= totalPages && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/category/category_all?page=${totalPages}`}>Last ›</Link>
                        )
                    }
                </div>

            </div>
                </>
            

                }
            </div>


               
    
        </div>
        </div>
        </div>
        </div>
        </div>
      
    );
};

export default CategoryList;

// 'use client' 
 //ismile
// import React, { useState } from 'react';
// import Select from 'react-dropdown-select';



// const ExternalClear = ({  title }) => {
//     const options = [
//         { label: 'Option 1', value: 'option1' },
//         { label: 'Option 2', value: 'option2' },
//         { label: 'Option 3', value: 'option3' },
//         { label: 'Option 4', value: 'option4' }
//       ];
//   const [values, setValues] = useState([options[1]]);

//   const onChange = (newValues) => {
//     setValues(newValues);
//   };



//   return (
//     <>
      

      
//       <Select
//         multi
//         options={options}
//         values={[...values]}
//         onChange={(newValue) => {
//           onChange(newValue);
//           console.log(`%c > onChange ${title} `, 'background: #555; color: tomato', newValue);
//         }}
//       />
//     </>
//   );
// };



// export default ExternalClear;




// 'use client' 
 //ismile
// import { useQuery } from '@tanstack/react-query';
// import Link from 'next/link';
// import React, { useState } from 'react';
// import '../../../admin_layout/modal/fa.css'
// import Select from 'react-dropdown-select';
// import './style.css'


// const CategoryList = () => {


//     const { data: categorys = [], isLoading, refetch
//     } = useQuery({
//         queryKey: ['categorys'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_all`)

//             const data = await res.json()
//             return data
//         }
//     })


//     const { data: module_settings = []
//     } = useQuery({
//         queryKey: ['module_settings'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`)

//             const data = await res.json()
//             return data
//         }
//     })

//     console.log(module_settings, 'module_settings')
//     const Category = module_settings.filter(moduleI => moduleI.table_name === 'category')
//     const columnListSelected = Category[0]?.column_name
//     const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());

  


//     const formatString = (str) => {
//         const words = str?.split('_');

//         const formattedWords = words?.map((word) => {
//             const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//             return capitalizedWord;
//         });

//         return formattedWords?.join(' ');
//     };

//     const columnNames = categorys && categorys.length > 0 ? Object.keys(categorys[0]) : [];


//     console.log('Column Names:', columnNames);



//     const { data: moduleInfo = []
//     } = useQuery({
//         queryKey: ['moduleInfo'],
//         queryFn: async () => {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all`)

//             const data = await res.json()
//             return data
//         }
//     })
//     console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'category'))
//     const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'category')

//     //   console.log(filteredModuleInfo);


//     const filteredBtnIconEdit = brandList.filter(btn =>
//         btn.method_sort === 3
//     );
//     const filteredBtnIconCopy = brandList.filter(btn =>
//         btn.method_sort === 4
//     );



//     const filteredBtnIconDelete = brandList.filter(btn =>
//         btn.method_sort === 5
//     );
//     const filteredBtnIconCreate = brandList.filter(btn =>
//         btn.method_sort === 1
//     );

//     // http://192.168.0.119:5002/admin/brand/brand_delete/3
//     const category_delete = id => {

//         console.log(id)
//         const proceed = window.confirm(`Are You Sure delete${id}`)
//         if (proceed) {
//             fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_delete/${id}`, {
//                 method: "DELETE",

//             })
//                 .then(Response => Response.json())
//                 .then(data => {

//                     if (data.affectedRows > 0) {
//                         refetch()
//                         Swal.fire({
//                             title: 'delete!',
//                             text: 'user delete Successful !!',
//                             icon: 'success',
//                             confirmButtonText: 'Ok'
//                         })
//                         console.log(data)
//                     }
//                 })
//         }
//     }

//     const page_group = localStorage.getItem('pageGroup')


//     const [searchQuery, setSearchQuery] = React.useState('');
//     const [statusFilter, setStatusFilter] = React.useState('');

//     const [filteredCategorys, setFilteredCategorys] = React.useState([]);

//     const [selectedColumns, setSelectedColumns] = React.useState([]);

//     const [selectedOrder, setSelectedOrder] = React.useState('');

//     const handleOrderChange = (e) => {
//         // Update the selected order when the user makes a selection
//         setSelectedOrder(e.target.value);
//     };

//     const category_search = () => {
//         // Check if options are selected before updating the table
//         if (selectedColumns.length > 0 || searchQuery !== '' || statusFilter !== '' || selectedOrder !== '') {
//             const query = String(searchQuery).toLowerCase();
//             const filteredCategories = categorys.filter(
//                 (category) =>
//                     String(category.category_name).toLowerCase().includes(query) &&
//                     (statusFilter === '' || category.status_id.toString() === statusFilter) &&
//                     (selectedColumns.length === 0 ||
//                         selectedColumns.some((column) =>
//                             String(category[column]).toLowerCase().includes(query)
//                         ))
//             );

//             // Apply sorting based on the selected order
//             const sortedCategories = [...filteredCategories];
//             if (selectedOrder === '1') {
//                 sortedCategories.sort((a, b) => (a.id > b.id ? 1 : -1)); // Ascending order
//             } else if (selectedOrder === '2') {
//                 sortedCategories.sort((a, b) => (a.id < b.id ? 1 : -1)); // Descending order
//             }

//             setFilteredCategorys(sortedCategories);
//         } else {
//             // Handle the case when no options are selected
//             // You can show an alert or handle it based on your requirement
//             console.log('Please select options before searching.');
//         }
//     };


//     const buttonStyles = {
//         color: '#fff',
//         backgroundColor: '#510bc4',
//         backgroundImage: 'none',
//         borderColor: '#4c0ab8',
//     };
//     const category_column_change = (selectedItems) => {
//         setSelectedColumns(selectedItems.map((item) => item.value));
//         // category_search(); 
//     };
//     console.log(selectedColumns)
//     const filteredColumns = columnNames.filter(column => column !== 'id');
//     const [isChecked, setIsChecked] = useState(false);

//     // Function to handle checkbox change
//     const handleCheckboxChange = (e) => {
//         setIsChecked(e.target.checked);
//     };


//     // const matchedOptions = ['serial', 'action', 'category_name'];
//     // const allOptions = ['id', 'category_name', 'description', 'created_by', 'created_date', 'modified_by', 'modified_date', 'file_path', 'status_id'];

//     // const options = allOptions.map(option => {
//     //     return {
//     //         label: option,
//     //         value: option,
//     //         className: matchedOptions.includes(option) ? 'matched-option' : ''
//     //     };
//     // });



//     const matched = columnListSelectedArray?.filter(option => columnNames.includes(option));


//     console.log(matched);

// const [value, setValue] = useState()


//     return (
//         <div class="col-md-12 body-content p-4">
//             <div>
//                 <div class="parent">
//                     {/* <button class="round-6">a</button> */}


//                 </div>
//                 {/* <form >


//                     <input
//                         type="text"
//                         placeholder="Input Text"

//                     />
//                     <br />
//                     <label>
//                         <input
//                             type="checkbox"
//                             checked={isChecked}
//                             onChange={handleCheckboxChange}
//                         />
//                         Checkbox
//                     </label>
//                     <br />
//                     <button type="submit" disabled={!isChecked}>Submit</button>
//                 </form> */}
//             </div>
//             <div class="col-md-12 body-content bg-light p-4">

//                 <div class=" border-primary shadow-sm border-0">
//                     <div class="bg-dark card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                         <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Category Search</h5>
//                         <div class="card-title font-weight-bold mb-0 card-header-color float-right">

//                             <Link href={`/Admin/category/category_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create Category</Link>
//                         </div>
//                     </div>
//                     <div class="card-body">
//                         <form class="" method="post" autocomplete="off">
//                             <div class="col-md-9 offset-md-1">
//                                 <div class="form-group row student">
//                                     <label class="col-form-label col-md-2"><strong>Brand:</strong></label>
//                                     <div class="col-md-4">
//                                         <input
//                                             value={searchQuery}
//                                             onChange={(e) => setSearchQuery(e.target.value)}
//                                             type="text" name="student_id" class="form-control form-control-sm  alpha_space student_id" id="student_id" placeholder="Student ID" />
//                                     </div>
//                                     <label class="col-form-label col-md-2"><strong>Status:</strong></label>
//                                     <div className="col-md-4">
//                                         <select
//                                             name="statusFilter"
//                                             className="form-control form-control-sm integer_no_zero lshift"
//                                             value={statusFilter}
//                                             onChange={(e) => setStatusFilter(e.target.value)}
//                                         >
//                                             <option value="">Select Status</option>
//                                             <option value="1">Active</option>
//                                             <option value="2">Inactive</option>
//                                             <option value="3">Pending</option>
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <div class="form-group row student">

//                                     <label class="col-form-label col-md-2"><strong>Order By:</strong></label>
//                                     <div className="col-md-4">
//                                         <select
//                                             name="statusFilter"
//                                             className="form-control form-control-sm integer_no_zero lshift"
//                                             value={selectedOrder}
//                                             onChange={handleOrderChange}
//                                         >
//                                             <option value="">Select Order</option>
//                                             <option value="1">Ascending </option>
//                                             <option value="2">Descending </option>

//                                         </select>
//                                     </div>
//                                     <label class="col-form-label col-md-2"><strong>Extra Column:</strong></label>
//                                     <div class="col-md-4">
//                                         <input type="text" name="student_id" class="form-control form-control-sm  alpha_space student_id" id="student_id" placeholder="Student ID" />
//                                     </div>
//                                 </div>


//                                 <div class="form-group row student">

//                                     <label class="col-form-label col-md-2"><strong>Design:</strong></label>

//                                     <div className="col-md-4">
//                                         {/* <Select
//                                             name='select'
//                                             labelField='label'
//                                             valueField='value'
//                                             options={[
//                                                 { label: 'Serial', value: 'serial' }, // Serial option

//                                                 ...filteredColumns.map(column => ({ label: formatString(column), value: column })),
//                                                 { label: 'Action', value: 'action' }, // Serial option
//                                             ]}

//                                             multi
//                                             onChange={category_column_change}
//                                         /> */}

//                                         {/* <Select
//                                             name='select'
//                                             labelField='label'
//                                             valueField='value'
//                                             options={[
//                                                 { label: 'Serial', value: 'serial' }, // Serial option

//                                                 ...filteredColumns.map(column => ({

//                                                     label: formatString(matched.includes(column) ? `${column}` : ``),

//                                                     value: column,

//                                                 })),
//                                                 { label: 'Action', value: 'action' }, // Serial option
//                                             ]}

//                                             multi
//                                             onChange={category_column_change}
//                                             styles={{ color: 'red' }}
//                                         /> */}
//                                         <Select
                                 
//                                             name='select'
//                                             labelField='label'
//                                             valueField='value'
                                            
//                                             options={[
//                                                 { label: 'Serial', value: 'serial' }, // Serial option

//                                                 ...filteredColumns.map(column => ({
//                                                     label: formatString(matched?.includes(column) ? `${column}` : ``),
//                                                     value: column,
                                                    
//                                                 })),
//                                                 { label: 'Action', value: 'action' }, // Serial option
//                                             ]}
                                           
//                                             multi
//                                             onChange={category_column_change}

//                                         />

//                                         <Select
//                                          name='select'
//                                          labelField='label'
//                                          valueField='value'
                                         
//                                          options={[
//                                              { label: 'Serial', value: 'serial' }, // Serial option

//                                              ...filteredColumns.map(column => ({
//                                                  label: formatString(matched?.includes(column) ? `${column}` : ``),
//                                                  value: column,
                                                 
//                                              })),
//                                              { label: 'Action', value: 'action' }, // Serial option
//                                          ]}
                                        
//                                          multi
//                                          onChange={matched => setValue(matched)}
                                        
//                                         >
//                                         </Select>
// <p>{value?.map(v => v.label)}</p>
                                   

//                                         {/* <Select
//     name='select'
//     labelField='label'
//     valueField='value'
//     options={[
//         { label: 'Serial', value: 'serial', className: matched.includes('Serial') ? 'red-text' : '' },
//         ...filteredColumns.map(column => ({ 
//             label: formatString(matched.includes(column) ? 'matched-option' : '' ), 
//             value: column,
//             className: matched.includes(column) ? 'bg-dark' : '' // Apply class based on match
//         })),
//         { label: 'Action', value: 'action', className: matched.includes('action') ? 'red-text' : '' },
//     ]}
//     multi
//     onChange={category_column_change}
// /> */}


//                                     </div>

//                                 </div>
//                             </div>
//                             <div class="form-group row">
//                                 <div class="offset-md-2 col-md-6 float-left">
//                                     <input type="button" onClick={category_search} name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search" />
//                                     <input type="button" name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />
//                                     <input type="button" style={buttonStyles} name="search" class="btn btn-sm btn-indigo pdf_btn mr-2" value="Download PDF" />

//                                     <input type="button" name="search" class="btn btn-sm btn-secondary excel_btn mr-2" value="Download Excel " />
//                                 </div>
//                             </div>
//                         </form>
//                         <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
//                             <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//             <div class=" border-primary  shadow-sm border-0">
//                 <div class="card-header  bg-dark custom-card-header py-1  clearfix bg-gradient-primary text-white">
//                     <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Category List</h5>
//                     <div class="card-title card-header-color font-weight-bold mb-0  float-right">
//                         <Link href={`/Admin/category/category_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create Category</Link>
//                     </div>
//                 </div>
//                 <div class="card-body">
//                     {filteredCategorys.length > 0 ? (
//                         <div class="table-responsive">
//                             <table className="table table-bordered table-hover table-striped table-sm">
//                                 <thead>
//                                     <tr>
//                                         {selectedColumns.map((column, i) => (
//                                             <th key={i}>{formatString(column)}</th>
//                                         ))}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filteredCategorys.map((category, i) => (
//                                         <tr key={i}>
//                                             {selectedColumns.map((column, j) => (
//                                                 <td key={j}>
//                                                     {column === 'serial' ? (
//                                                         // Rendering serial number if the column is 'serial'
//                                                         i + 1
//                                                     ) : column === 'status_id' ? (
//                                                         // Special handling for the 'status' column
//                                                         <>
//                                                             {category.status_id === 1 && <p>Active</p>}
//                                                             {category.status_id === 2 && <p>Inactive</p>}
//                                                             {category.status_id === 3 && <p>Pending</p>}
//                                                         </>
//                                                     ) : column === 'action' ? (
//                                                         // Special handling for the 'status' column
//                                                         <div className="flex items-center ">
//                                                             <Link href={`/Admin/category/category_edit/${category.id}?page_group=${page_group}`}>
//                                                                 {filteredBtnIconEdit?.map((filteredBtnIconEdit => (
//                                                                     <button
//                                                                         key={filteredBtnIconEdit.id}
//                                                                         title='Edit'
//                                                                         style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
//                                                                         className={filteredBtnIconEdit?.btn}
//                                                                     >
//                                                                         <a
//                                                                             dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
//                                                                         ></a>
//                                                                     </button>
//                                                                 )))}
//                                                             </Link>
//                                                             <Link href={`/Admin/category/category_copy/${category.id}?page_group=${page_group}`}>
//                                                                 {filteredBtnIconCopy.map((filteredBtnIconEdit => (
//                                                                     <button
//                                                                         key={filteredBtnIconEdit.id}
//                                                                         title='Copy'
//                                                                         style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
//                                                                         className={filteredBtnIconEdit?.btn}
//                                                                     >
//                                                                         <a
//                                                                             dangerouslySetInnerHTML={{ __html: filteredBtnIconEdit?.icon }}
//                                                                         ></a>
//                                                                     </button>
//                                                                 )))}
//                                                             </Link>
//                                                             {filteredBtnIconDelete.map((filteredBtnIconDelete => (
//                                                                 <button
//                                                                     key={filteredBtnIconDelete.id}
//                                                                     title='Delete'
//                                                                     onClick={() => category_delete(category.id)}
//                                                                     style={{ width: "35px ", height: '30px', marginLeft: '5px', marginTop: '5px' }}
//                                                                     className={filteredBtnIconDelete?.btn}
//                                                                 >
//                                                                     <a
//                                                                         dangerouslySetInnerHTML={{ __html: filteredBtnIconDelete?.icon }}
//                                                                     ></a>
//                                                                 </button>
//                                                             )))}
//                                                         </div>
//                                                     ) : (
//                                                         // Default rendering for other columns
//                                                         category[column]
//                                                     )}
//                                                 </td>
//                                             ))}
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <p></p>

//                     )}
//                 </div>



//             </div>
//         </div>
//     );
// };

// export default CategoryList;



