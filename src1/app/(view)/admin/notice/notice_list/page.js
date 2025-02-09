"use client";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Select from "react-dropdown-select";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType } from 'docx';
import axios from "axios";

// const formatDateTime = (dateTime) => {
//   const date = new Date(dateTime);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   let hours = date.getHours();
//   const minutes = String(date.getMinutes()).padStart(2, "0");
//   const seconds = String(date.getSeconds()).padStart(2, "0");
//   const ampm = hours >= 12 ? "PM" : "AM";

//   // Convert 24-hour format to 12-hour format
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'

//   return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
// };

const formatDateTimePublishDate = (dateTime) => {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}/${month}/${year}`;
};

const downloadFile = async (fileUrl) => {
  try {
    // Extract the original file name from the URL
    const fileName = fileUrl.split("/").pop();

    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // Use the original file name
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Failed to download file:", error);
  }
};

// const formatDateTime = (dateTime) => {
//   const now = new Date();
//   const year = now.getFullYear(dateTime);
//   const month = String(now.getMonth() + 1).padStart(2, "0");
//   const day = String(now.getDate()).padStart(2, "0");
//   let hours = String(now.getHours()).padStart(2, "0");
//   const minutes = String(now.getMinutes()).padStart(2, "0");
//   const seconds = String(now.getSeconds()).padStart(2, "0");
//   const ampm = hours >= 12 ? "PM" : "AM";

//   // Convert 24-hour format to 12-hour format
//   hours = hours % 12;
//   hours = hours ? String(hours).padStart(2, "0") : "12"; // the hour '0' should be '12'

//   return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
// };

const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
};

const NoticeList = ({ searchParams }) => {
  const {
    data: noticeCategoryAll = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["noticeCategoryAll"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_all`
      );

      const data = await res.json();
      console.log(data);
      return data;
    },
  });

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

  const { data: moduleInfo = [] } = useQuery({
    queryKey: ["moduleInfo"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${userId}`
      );

      const data = await res.json();
      return data;
    },
  });



  const {
    data: noticeCategoryAlls = [],

  } = useQuery({
    queryKey: ["noticeCategoryAlls"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice_category/notice_category_all`
      );

      const data = await res.json();
      return data;
    },
  });

  // console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'brand'))
  const brandList = moduleInfo.filter(
    (moduleI) => moduleI.controller_name === "notice"
  );

  //   console.log(filteredModuleInfo);

  const filteredBtnIconEdit = brandList.filter((btn) => btn.method_sort === 3);
  const filteredBtnIconCopy = brandList.filter((btn) => btn.method_sort === 4);

  const filteredBtnIconDelete = brandList.filter(
    (btn) => btn.method_sort === 5
  );
  const filteredBtnIconCreate = brandList.filter(
    (btn) => btn.method_sort === 1
  );

  const noticeCategoryAll_delete = (id) => {
    console.log(id);
    const proceed = window.confirm("Are you sure delete this item.");
    if (proceed) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_delete/${id}`,
        {
          method: "POST",
        }
      )
        .then((Response) => Response.json())
        .then((data) => {
          refetch();
          caregory_list();
          console.log(data);
        });
    }
  };

  // Paigination start
  const parentUsers = noticeCategoryAll;

  const totalData = parentUsers?.length;
  const dataPerPage = 20;

  const totalPages = Math.ceil(totalData / dataPerPage);

  let currentPage = 1;

  if (Number(searchParams.page) >= 1) {
    currentPage = Number(searchParams.page);
  }

  let pageNumber = [];
  for (let index = currentPage - 2; index <= currentPage + 2; index++) {
    if (index < 1) {
      continue;
    }
    if (index > totalPages) {
      break;
    }
    pageNumber.push(index);
  }
  const [pageUsers, setPageUsers] = useState([]);
  const caregory_list = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_list_paigination/${currentPage}/${dataPerPage}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data, "fjslfjlzxdfj");
    setPageUsers(data);
  };

  useEffect(() => {
    caregory_list();
  }, [currentPage]);

  const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;

  // Paigination end

  const [message, setMessage] = useState();
  useEffect(() => {
      if (typeof window !== 'undefined') {

          if (sessionStorage.getItem("message")) {
              setMessage(sessionStorage.getItem("message"));
              sessionStorage.removeItem("message");
          }
      }
  }, [])




  const longTextStyle = {
    wordBreak: "break-all",
    wordWrap: "break-word",
    whiteSpace: "normal",
  };


  const [itemName, setItemName] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
  useEffect(() => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = String(currentDate.getFullYear());
    const formattedDate = `${day}-${month}-${year}`;
    setShowToDate(formattedDate);
    setShowFromDate(formattedDate);
  }, []);
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
  const Category = module_settings.filter(moduleI => moduleI.table_name === 'notice')
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

  const columnNames = noticeCategoryAll && noticeCategoryAll.length > 0 ? Object.keys(noticeCategoryAll[0]) : [];


  console.log('Column Names:', columnNames);


  const [selectedColumnsSearch, setSelectedColumnsSerach] = useState([]);


  const [selectedColumns, setSelectedColumns] = React.useState([]);

  useEffect(() => {
    setSelectedColumns(columnListSelectedArray)
  }, [])

  useEffect(() => {
    setSelectedColumnsSerach(columnListSelectedSerachArray)
  }, [])

  const category_column_change = (selectedItems) => {
    setSelectedColumns(selectedItems.map((item) => item.value));
    // expense_search(); 
  }
  useEffect(() => {
    setSelectedColumns(columnListSelectedArray)
  }, [])


  console.log(selectedColumns)

  const filteredColumns = columnNames.filter(column => column !== 'id');




  const [searchResults, setSearchResults] = useState([]);
  const [fromDate, setFromDate] = useState([]);
  const [toDate, setToDate] = useState([]);
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState([]);




  const news_search = () => {
    // setLoading(true);
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_search`, {
      fromDate, toDate, searchQuery, itemName
    })
      .then(response => {
        setSearchResults(response.data.results);
        setError(null);
        // setLoading(false);
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







  const news_excel_download = async () => {


    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_search`, {
        fromDate, toDate, searchQuery, itemName
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
              return 'Rejected';
            case 2:
              return 'Approved';
            case 0:
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
    } catch (error) {
      console.error("An error occurred during printing.", error);
      setError("An error occurred during printing.", error);
    };
  };






  const news_word_download = async () => {

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_search`, {
        fromDate, toDate, searchQuery, itemName
      });
      const searchResults = response.data.results;
      if (!selectedColumns || !searchResults || !searchResults.length) {
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
              cellData = index + 1;

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
              children: [new Paragraph({ text: cellData.toString() })],
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
                new TextRun("News List")
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
    } catch (error) {
      console.error("An error occurred during printing.", error);
      setError("An error occurred during printing.", error);

    }
  };

  // const news_pdf = async () => {

  //   // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
  //   const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_search`, {
  //     fromDate, toDate, searchQuery, itemName
  //   });

  //   const searchResults = response.data.results

  //   console.log(searchResults)

  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_pdf`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         searchResults, selectedColumns
  //         // Other parameters if needed
  //       }),

  //       // If you need to send any data with the request, you can include it here
  //       // body: JSON.stringify({ /* your data */ }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Error generating PDF In Period');
  //     }


  //     // If you want to download the PDF automatically
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(new Blob([blob]));
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'period_pdf.pdf';
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //   } catch (error) {
  //     // setErrorr(error.message);
  //   } finally {
  //     // setLoading(false);
  //   }
  // };

  // const news_Print_download = async () => {
  //   try {
  //     // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
  //     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_search`, {
  //       fromDate, toDate, searchQuery, itemName
  //     });

  //     const searchResults = response.data.results;
  //     const selectedLayout = document.getElementById('print_layout').value;
  //     const orientation = selectedLayout === 'landscape' ? 'landscape' : 'portrait';

  //     const selectedPrintSize = document.getElementById('print_size').value;
  //     const selectedZoom = document.querySelector('.zoom_size').value;

  //     // Convert zoom value to a numeric multiplier
  //     let zoomMultiplier = 100; // Default zoom multiplier
  //     if (selectedZoom !== '') {
  //       zoomMultiplier = parseFloat(selectedZoom) / 100;
  //     }
  //     // Set the page dimensions based on the selected print size
  //     let pageWidth, pageHeight;
  //     switch (selectedPrintSize) {
  //       case 'A4':
  //         pageWidth = 210 * zoomMultiplier;
  //         pageHeight = 297 * zoomMultiplier;
  //         break;
  //       case 'A3':
  //         pageWidth = 297 * zoomMultiplier;
  //         pageHeight = 420 * zoomMultiplier;
  //         break;
  //       case 'legal':
  //         pageWidth = 216 * zoomMultiplier; // Width for Legal size
  //         pageHeight = 356 * zoomMultiplier; // Height for Legal size
  //         break;
  //       default:
  //         // Default to A4 size
  //         pageWidth = 210 * zoomMultiplier;
  //         pageHeight = 297 * zoomMultiplier;
  //         break;
  //     }



  //     // Get the selected font size value
  //     const selectedFontSize = document.querySelector('.font_size').value;

  //     // Get the numeric part of the selected font size value
  //     const fontSize = parseInt(selectedFontSize.split('-')[1]) * zoomMultiplier;

  //     // Get the value of the extra column input field
  //     const extraColumnValue = parseInt(document.getElementById('extra_column').value);


  //     console.log(searchResults);

  //     const printWindow = window.open('', '_blank');
  //     printWindow.document.open();

  //     const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_print`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         searchResults, selectedColumns, orientation, selectedPrintSize, fontSize, extraColumnValue
  //       }),
  //     });

  //     const htmlText = await html.text();

  //     printWindow.document.write(htmlText);
  //     printWindow.document.close(); // Ensure the document is completely loaded before printing
  //     printWindow.focus();
  //   } catch (error) {
  //     console.error('Error generating print view:', error.message);
  //   }
  // };


  const news_pdf = async () => {

    // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_search`, {
      fromDate, toDate, searchQuery, itemName
    });

    const searchResults = response.data.results
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


    console.log(searchResults)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchResults, selectedColumns, orientation, selectedPrintSize
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
      // setErrorr(error.message);
    } finally {
      // setLoading(false);
    }
  };


  const news_Print_download = async () => {
    try {
      // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/office_visit/office_visit_person_list_visit/${id}`);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_search`, {
        fromDate, toDate, searchQuery, itemName
      });

      const searchResults = response.data.results;
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

      // Get the value of the extra column input field
      const extraColumnValue = parseInt(document.getElementById('extra_column').value);


      console.log(searchResults);

      const printWindow = window.open('', '_blank');
      printWindow.document.open();

      const html = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_print`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchResults, selectedColumns, orientation, selectedPrintSize, fontSize, extraColumnValue
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


  const buttonStyles = {
    color: '#fff',
    backgroundColor: '#510bc4',
    backgroundImage: 'none',
    borderColor: '#4c0ab8',
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 p-4">
          {message && (
            <div className="alert alert-success font-weight-bold">
              {message}
            </div>
          )}

          <div className='card mb-4'>
            <div class=" body-content bg-light">

              <div class=" border-primary shadow-sm border-0">
                <div class=" card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                  <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">News Search</h5>
                  <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                    <Link href={`/Admin/news/news_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create News</Link>
                  </div>
                </div>

                <div class="card-body">
                  <form class="">
                    <div class="col-md-10 offset-md-1">

                      <div class="form-group row student">

                        <label htmlFor="fromDate" class="col-form-label col-md-3 font-weight-bold">From Date:</label>

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


                        </div>

                        <label htmlFor="toDate" class="col-form-label col-md-3 font-weight-bold">To Date:</label>
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

                        </div>
                      </div>

                      <div class="form-group row student">

                        <label class="col-form-label col-md-3 font-weight-bold">Notice Name:</label>
                        <div className="col-md-3">
                          <input class="form-control form-control-sm  alpha_space item_name" type="text"
                            placeholder="Notice Name"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)} />
                        </div>
                        <label class="col-form-label col-md-3 font-weight-bold">Notice Category Name:</label>
                        <div className="col-md-3">

                          <select required="" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} name="supplier_id" className="form-control form-control-sm mb-2" id="supplier_id">
                            <option value=''>Select Category</option>
                            {
                              noticeCategoryAlls.map((supplier) => (
                                <>
                                  <option value={supplier.id}>{supplier.name}</option>

                                </>

                              ))
                            }

                          </select>
                        </div>


                      </div>
                      <div class="form-group row student">

                        <label class="col-form-label col-md-3"><strong>Extra Column:</strong></label>
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
                    </div>
                    <div class="form-group row">
                      <div class="offset-md-2 col-md-6 float-left">
                        <input
                          onClick={news_search}
                          type="button" name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search" />
                        <input
                          onClick={news_Print_download}
                          type="button" name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />
                        <input
                          type="button"
                          onClick={news_excel_download}
                          name="search"
                          className="btn btn-sm btn-secondary excel_btn mr-2"
                          value="Download Excel"
                        />

                        <input
                          type="button"
                          onClick={news_word_download}
                          className="btn btn-sm btn-secondary excel_btn mr-2"
                          value="Download Docx"
                        />
                        <input
                          onClick={news_pdf}
                          style={buttonStyles}
                          type="button" name="search" class="btn btn-sm btn-indigo pdf_btn mr-2" value="Download PDF" />
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
            <div className="body-content bg-light">
              <div className="border-primary shadow-sm border-0">
                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                  <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">List News</h5>
                  <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                    <Link href={`/Admin/news/news_create?page_group`} className="btn btn-sm btn-info">Back to News Create</Link>
                  </div>
                </div>

                <div class="card-body" >



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

                    searchResults.length > 0 ? (
                      <div class="table-responsive">


                        <table id='mytable' className="table table-bordered table-hover table-striped table-sm">
                          <thead>
                            <tr>
                              {selectedColumns.map((column, i) => (
                                <th key={i}>{formatString(column)}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {searchResults.map((leave_application, i) => (
                              <tr key={i}>
                                {selectedColumns.map((column, j) => (
                                  <td key={j} style={['brand_name', 'description'].includes(column) ? longTextStyle : {}}>
                                    {column === 'serial' ? (
                                      // Rendering serial number if the column is 'serial'
                                      i + 1
                                    )

                                      :

                                      column === 'action' ? (
                                        // Special handling for the 'status' column

                                        <div className="flex items-center ">
                                          <Link
                                            href={`/Admin/notice/notice_edit/${noticeCategoryAll.id}?page_group=${page_group}`}
                                          >
                                            {filteredBtnIconEdit?.map(
                                              (filteredBtnIconEdit) => (
                                                <button
                                                  key={filteredBtnIconEdit.id}
                                                  title="Edit"
                                                  style={{
                                                    width: "35px ",
                                                    height: "30px",
                                                    marginLeft: "5px",
                                                    marginTop: "5px",
                                                  }}
                                                  className={filteredBtnIconEdit?.btn}
                                                >
                                                  <a
                                                    dangerouslySetInnerHTML={{
                                                      __html: filteredBtnIconEdit?.icon,
                                                    }}
                                                  ></a>
                                                </button>
                                              )
                                            )}
                                          </Link>
                                          <Link
                                            href={`/Admin/notice/notice_copy/${noticeCategoryAll.id}?page_group=${page_group}`}
                                          >
                                            {filteredBtnIconCopy.map(
                                              (filteredBtnIconEdit) => (
                                                <button
                                                  key={filteredBtnIconEdit.id}
                                                  title="Copy"
                                                  style={{
                                                    width: "35px ",
                                                    height: "30px",
                                                    marginLeft: "5px",
                                                    marginTop: "5px",
                                                  }}
                                                  className={filteredBtnIconEdit?.btn}
                                                >
                                                  <a
                                                    dangerouslySetInnerHTML={{
                                                      __html: filteredBtnIconEdit?.icon,
                                                    }}
                                                  ></a>
                                                </button>
                                              )
                                            )}
                                          </Link>
                                          {filteredBtnIconDelete.map(
                                            (filteredBtnIconDelete) => (
                                              <button
                                                key={filteredBtnIconDelete.id}
                                                title="Delete"
                                                onClick={() =>
                                                  noticeCategoryAll_delete(
                                                    noticeCategoryAll.id
                                                  )
                                                }
                                                style={{
                                                  width: "35px ",
                                                  height: "30px",
                                                  marginLeft: "5px",
                                                  marginTop: "5px",
                                                }}
                                                className={filteredBtnIconDelete?.btn}
                                              >
                                                <a
                                                  dangerouslySetInnerHTML={{
                                                    __html: filteredBtnIconDelete?.icon,
                                                  }}
                                                ></a>
                                              </button>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        // Default rendering for other columns
                                        leave_application[column]
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


                        <div className="table-responsive">
                          {/* page start */}
                          <div className=" d-flex justify-content-between">
                            <div className="font-weight-bold">
                              Total Data: {totalData}
                            </div>
                            <div class="pagination float-right pagination-sm border">
                              {currentPage - 3 >= 1 && (
                                <Link
                                  className=" text-primary px-2 border-left py-1"
                                  href={`/Admin/notice/notice_all?page=${1}`}
                                >
                                  ‹ First
                                </Link>
                              )}
                              {currentPage > 1 && (
                                <Link
                                  className=" text-primary px-2 border-left py-1"
                                  href={`/Admin/notice/notice_all?page=${activePage - 1
                                    }`}
                                >
                                  &lt;
                                </Link>
                              )}
                              {pageNumber.map((page) => (
                                <Link
                                  key={page}
                                  href={`/Admin/notice/notice_all?page=${page}`}
                                  className={` ${page === activePage
                                    ? "font-bold bg-primary px-2 border-left py-1 text-white"
                                    : "text-primary px-2 border-left py-1"
                                    }`}
                                >
                                  {" "}
                                  {page}
                                </Link>
                              ))}
                              {currentPage < totalPages && (
                                <Link
                                  className=" text-primary px-2 border-left py-1"
                                  href={`/Admin/notice/notice_all?page=${activePage + 1
                                    }`}
                                >
                                  &gt;
                                </Link>
                              )}
                              {currentPage + 3 <= totalPages && (
                                <Link
                                  className=" text-primary px-2 border-left py-1"
                                  href={`/Admin/notice/notice_all?page=${totalPages}`}
                                >
                                  Last ›
                                </Link>
                              )}
                            </div>
                          </div>
                          {/* page end */}

                          <table className="table  table-bordered table-hover table-striped table-sm mt-2">
                            <thead>
                              <tr>
                                <th>Title</th>
                                <th>NoticeCategory</th>
                                <th>Publish Date</th>
                                <th>Status</th>
                                <th>File</th>
                                <th>Created By</th>
                                <th>Created Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>

                            <tbody>
                              {isLoading ? (
                                <div
                                  style={{
                                    width: "74vw",
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <FontAwesomeIcon
                                    style={{
                                      height: "33px",
                                      width: "33px",
                                    }}
                                    icon={faSpinner}
                                    spin
                                  />
                                </div>
                              ) : (
                                pageUsers.map((noticeCategoryAll, i) => (
                                  <tr key={noticeCategoryAll.id}>
                                    <td style={{ width: "400px" }}>
                                      <p
                                        style={{
                                          width: "400px",

                                          margin: 0,
                                        }}
                                      >
                                        {" "}
                                        {noticeCategoryAll?.title}
                                      </p>
                                    </td>

                                    <td>{noticeCategoryAll?.notice_category}</td>
                                    <td>
                                      {noticeCategoryAll?.publish_date
                                        ? formatDateTimePublishDate(
                                          noticeCategoryAll.publish_date
                                        )
                                        : ""}
                                    </td>

                                    <td>
                                      {noticeCategoryAll?.status === 1
                                        ? "Active"
                                        : "Inactive"}
                                    </td>

                                    <td>
                                      {" "}
                                      {/* <img
                                  className="img-thumbnail"
                                  style={{ width: "100px" }}
                                  src={`http://192.168.0.192:5003/${noticeCategoryAll?.file}`}
                                  alt="No Image"
                                /> */}
                                      <button
                                        onClick={() =>
                                          downloadFile(
                                            `http://192.168.0.192:5003/${noticeCategoryAll?.file}`
                                          )
                                        }
                                        className="badge badge-info border-0"
                                      >
                                        Download
                                      </button>
                                    </td>
                                    <td>{noticeCategoryAll?.created_by}</td>

                                    <td>
                                      {noticeCategoryAll?.created_date
                                        ? formatDateTime(
                                          noticeCategoryAll.created_date
                                        )
                                        : ""}
                                    </td>

                                    <td>
                                      <div className="flex items-center ">
                                        <Link
                                          href={`/Admin/notice/notice_edit/${noticeCategoryAll.id}?page_group=${page_group}`}
                                        >
                                          {filteredBtnIconEdit?.map(
                                            (filteredBtnIconEdit) => (
                                              <button
                                                key={filteredBtnIconEdit.id}
                                                title="Edit"
                                                style={{
                                                  width: "35px ",
                                                  height: "30px",
                                                  marginLeft: "5px",
                                                  marginTop: "5px",
                                                }}
                                                className={filteredBtnIconEdit?.btn}
                                              >
                                                <a
                                                  dangerouslySetInnerHTML={{
                                                    __html: filteredBtnIconEdit?.icon,
                                                  }}
                                                ></a>
                                              </button>
                                            )
                                          )}
                                        </Link>
                                        <Link
                                          href={`/Admin/notice/notice_copy/${noticeCategoryAll.id}?page_group=${page_group}`}
                                        >
                                          {filteredBtnIconCopy.map(
                                            (filteredBtnIconEdit) => (
                                              <button
                                                key={filteredBtnIconEdit.id}
                                                title="Copy"
                                                style={{
                                                  width: "35px ",
                                                  height: "30px",
                                                  marginLeft: "5px",
                                                  marginTop: "5px",
                                                }}
                                                className={filteredBtnIconEdit?.btn}
                                              >
                                                <a
                                                  dangerouslySetInnerHTML={{
                                                    __html: filteredBtnIconEdit?.icon,
                                                  }}
                                                ></a>
                                              </button>
                                            )
                                          )}
                                        </Link>
                                        {filteredBtnIconDelete.map(
                                          (filteredBtnIconDelete) => (
                                            <button
                                              key={filteredBtnIconDelete.id}
                                              title="Delete"
                                              onClick={() =>
                                                noticeCategoryAll_delete(
                                                  noticeCategoryAll.id
                                                )
                                              }
                                              style={{
                                                width: "35px ",
                                                height: "30px",
                                                marginLeft: "5px",
                                                marginTop: "5px",
                                              }}
                                              className={filteredBtnIconDelete?.btn}
                                            >
                                              <a
                                                dangerouslySetInnerHTML={{
                                                  __html: filteredBtnIconDelete?.icon,
                                                }}
                                              ></a>
                                            </button>
                                          )
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>

                          {/* page start */}
                          <div className=" d-flex justify-content-between">
                            <div className="font-weight-bold">
                              Total Data: {totalData}
                            </div>
                            <div class="pagination float-right pagination-sm border">
                              {currentPage - 3 >= 1 && (
                                <Link
                                  className=" text-primary px-2 border-left py-1"
                                  href={`/Admin/notice/notice_all?page=${1}`}
                                >
                                  ‹ First
                                </Link>
                              )}
                              {currentPage > 1 && (
                                <Link
                                  className=" text-primary px-2 border-left py-1"
                                  href={`/Admin/notice/notice_all?page=${activePage - 1
                                    }`}
                                >
                                  &lt;
                                </Link>
                              )}
                              {pageNumber.map((page) => (
                                <Link
                                  key={page}
                                  href={`/Admin/notice/notice_all?page=${page}`}
                                  className={` ${page === activePage
                                    ? "font-bold bg-primary px-2 border-left py-1 text-white"
                                    : "text-primary px-2 border-left py-1"
                                    }`}
                                >
                                  {" "}
                                  {page}
                                </Link>
                              ))}
                              {currentPage < totalPages && (
                                <Link
                                  className=" text-primary px-2 border-left py-1"
                                  href={`/Admin/notice/notice_all?page=${activePage + 1
                                    }`}
                                >
                                  &gt;
                                </Link>
                              )}
                              {currentPage + 3 <= totalPages && (
                                <Link
                                  className=" text-primary px-2 border-left py-1"
                                  href={`/Admin/notice/notice_all?page=${totalPages}`}
                                >
                                  Last ›
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* page end */}
                        </div>

                      </>


                  }
                </div>


              </div>
            </div>
          </div>




        </div>
      </div>
    </div>
  );
};

export default NoticeList;
