const connection = require("../../../../connection/config/database");
var wkhtmltopdf = require('wkhtmltopdf');
var fs = require("fs");

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

// wkhtmltopdf.command = "C:\\Users\\user\\Desktop\\Ecommerce\\node_modules\\wkhtmltopdf\\index.js";
const formatString = (str) => {
  const words = str?.split('_');

  const formattedWords = words?.map((word) => {
    const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return capitalizedWord;
  });

  return formattedWords?.join(' ');
};


const NewsModel = {
  news_create: async (req, res) => {
    try {
      const { title, news_category, summary, description, status, created_by } =
        req.body;

      // Using parameterized query to prevent SQL injection
      const insertQuery =
        "INSERT INTO news (title,news_category,summary,description,status,created_by) VALUES (?,?,?,?,?,?)";

      const result = await connection.query(insertQuery, [
        title,
        news_category,
        summary,
        description,
        status,
        created_by,
      ]);

      // Sending only the necessary data from the result object
      const { insertId, affectedRows } = result;

      // Sending response with relevant data
      res.status(200).json({ insertId, affectedRows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error processing the request" });
    }
  },

  news_single: async (req, res) => {
    try {
      const query = "SELECT * FROM news WHERE id = ?";
      connection.query(query, [req.params.id], (error, result) => {
        if (!error && result.length > 0) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error || " News not found");
          return res.status(404).json({ message: "News not found." });
        }
      });
    } catch (error) {
      console.log(error);
    }
  },

  // news_list: async (req, res) => {
  //   try {
  //     const data = `SELECT ec.*, u.full_name AS author_name
  //     FROM news ec
  //     JOIN users u ON ec.created_by = u.id;`;

  //     connection.query(data, function (error, result) {
  //       console.log(result);
  //       if (!error) {
  //         res.send(result);
  //       } else {
  //         console.log(error);
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  // news_list: async (req, res) => {
  //   try {
  //     const data = `SELECT n.*, u.full_name AS author_name
  //                  FROM news n
  //                  LEFT JOIN users u ON n.created_by = u.id
  //                  ORDER BY n.id DESC;`;

  //     connection.query(data, function (error, result) {
  //       if (!error) {
  //         res.send(result);
  //       } else {
  //         console.log(error);
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  news_list: async (req, res) => {
    try {
      const data = `SELECT n.*, u.full_name AS author_name, nc.name
                   FROM news n
                   LEFT JOIN users u ON n.created_by = u.id
                   LEFT JOIN news_category nc ON n.news_category = nc.id
                   ORDER BY n.id DESC;`;

      connection.query(data, function (error, result) {
        if (!error) {
          res.send(result);
        } else {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  },

  // notice_list: async (req, res) => {
  //   try {
  //     const data = `
  //     SELECT n.*, u.full_name AS author_name, nc.name
  //     FROM notice n
  //     LEFT JOIN users u ON n.created_by = u.id
  //     LEFT JOIN notice_category nc ON n.notice_category = nc.id
  //     ORDER BY n.id DESC;
  //   `;

  //     connection.query(data, function (error, result) {
  //       if (!error) {
  //         res.send(result);
  //       } else {
  //         console.log(error);
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  news_update: async (req, res) => {
    try {
      const {
        title,
        news_category,
        summary,
        description,
        status,
        modified_by,
      } = req.body;
      const query = `UPDATE news SET title = ?, news_category = ?, summary = ?, description = ?, status = ?, modified_by = ? WHERE id = ?`;

      connection.query(
        query,
        [
          title,
          news_category,
          summary,
          description,
          status,

          modified_by,
          [req.params.id],
        ],
        (error, result) => {
          if (!error && result.affectedRows > 0) {
            console.log(result);
            return res.send(result);
          } else {
            console.log(error || "News not found");
            return res.status(404).json({ message: "News not found." });
          }
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error." });
    }
  },

  news_delete: async (req, res) => {
    try {
      const query = "DELETE FROM news WHERE id = ?";
      connection.query(query, [req.params.id], (error, result) => {
        if (!error && result.affectedRows > 0) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error || "News category not found");
          return res.status(404).json({ message: "News not found." });
        }
      });
    } catch (error) {
      console.log(error);
    }
  },

  // sub_category_list_paigination: async (req, res) => {
  //     const pageNo = Number(req.params.pageNo);
  //     const perPage = Number(req.params.perPage);
  //     try {
  //         const skipRows = (pageNo - 1) * perPage;
  //         let query = `
  //   SELECT sub_category.*,
  //          users_created.full_name AS created_by,
  //          users_modified.full_name AS modified_by
  //   FROM sub_category
  //   LEFT JOIN users AS users_created ON sub_category.created_by = users_created.id
  //   LEFT JOIN users AS users_modified ON sub_category.modified_by = users_modified.id
  //   ORDER BY sub_category.id DESC
  //   LIMIT ?, ?
  // `;

  //         connection.query(query, [skipRows, perPage], (error, result) => {
  //             console.log(result)
  //             if (!error) {
  //                 res.send(result)
  //             }

  //             else {
  //                 console.log(error)
  //             }

  //         })
  //     }
  //     catch (error) {
  //         console.log(error)
  //     }
  // },

  // news_list_paigination: async (req, res) => {
  //   const pageNo = Number(req.params.pageNo);
  //   const perPage = Number(req.params.perPage);
  //   try {
  //     const skipRows = (pageNo - 1) * perPage;
  //     // const query = "select * from  brand LIMIT ?, ?";
  //     // const query = "SELECT brand.*, users.full_name AS created_by FROM brand INNER JOIN users ON brand.created_by = users.id LIMIT ?, ?";
  //     let query = `
  //     SELECT news.*,
  //            users_created.full_name AS created_by,
  //            users_modified.full_name AS modified_by
  //     FROM news
  //     INNER JOIN users AS users_created ON news.created_by = users_created.id
  //     LEFT JOIN users AS users_modified ON news.modified_by = users_modified.id
  //     LIMIT ?, ?
  //   `;
  //     connection.query(query, [skipRows, perPage], (error, result) => {
  //       console.log(result);
  //       if (!error) {
  //         res.send(result);
  //       } else {
  //         console.log(error);
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  news_list_paigination: async (req, res) => {
    const pageNo = Number(req.params.pageNo);
    const perPage = Number(req.params.perPage);
    try {
      const skipRows = (pageNo - 1) * perPage;
      let query = `
  SELECT news.*, 
         users_created.full_name AS created_by,
         users_modified.full_name AS modified_by,
         news_category.name AS news_category  
  FROM news 
  LEFT JOIN users AS users_created ON news.created_by = users_created.id 
  LEFT JOIN users AS users_modified ON news.modified_by = users_modified.id
    LEFT JOIN news_category ON news.news_category = news_category.id 
  ORDER BY news.id DESC
  LIMIT ?, ?
`;

      connection.query(query, [skipRows, perPage], (error, result) => {
        console.log(result);
        if (!error) {
          res.send(result);
        } else {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  },

  //   notice_list_paigination: async (req, res) => {
  //     const pageNo = Number(req.params.pageNo);
  //     const perPage = Number(req.params.perPage);
  //     try {
  //       const skipRows = (pageNo - 1) * perPage;
  //       let query = `
  //       SELECT notice.*,
  //              users_created.full_name AS created_by,
  //              users_modified.full_name AS modified_by,
  //              notice_category.name AS notice_category
  //       FROM notice
  //       LEFT JOIN users AS users_created ON notice.created_by = users_created.id
  //       LEFT JOIN users AS users_modified ON notice.modified_by = users_modified.id
  //       LEFT JOIN notice_category ON notice.notice_category = notice_category.id
  //       ORDER BY notice.id DESC
  //       LIMIT ?, ?
  //     `;

  //       connection.query(query, [skipRows, perPage], (error, result) => {
  //         console.log(result);
  //         if (!error) {
  //           res.send(result);
  //         } else {
  //           console.log(error);
  //         }
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  // };
  //   news_list_search: async (req, res) => {
  //     try {
  //         console.log("Search button clicked.");

  //         // Extract necessary data from request
  //         const {  fromDate, toDate, searchQuery, itemName } = req.body;

  //         // Construct the base SQL query

  //         let sql = `
  //            SELECT news.*, 
  //                    users_created.full_name AS created_by,
  //                    users_modified.full_name AS modified_by,
  //                    news_category.name AS news_category  
  //             FROM news 
  //             LEFT JOIN users AS users_created ON news.created_by = users_created.id 
  //             LEFT JOIN users AS users_modified ON news.modified_by = users_modified.id
  //             LEFT JOIN news_category ON news.news_category = news_category.id 
  //             WHERE 1`;


  //         if (fromDate && toDate) {
  //             sql += ` AND news.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
  //         }

  //         if (searchQuery) {
  //             sql += ` AND news.news_category = ${searchQuery}`;
  //         }



  //         if (itemName) {

  //             sql += ` AND LOWER(news.title) LIKE '%${itemName}%'`;
  //         }

  //         // Add expense name (item_name) search condition



  //         console.log("SQL Query:", sql);

  //         // Execute the constructed SQL query
  //         connection.query(sql, (error, results, fields) => {
  //             if (error) {
  //                 console.error("Error occurred during search:", error);
  //                 res.status(500).json({ error: "An error occurred during search." });
  //             } else {
  //                 console.log("Search results:", results);
  //                 res.status(200).json({ results });
  //             }
  //         });
  //     } catch (error) {
  //         console.error("An error occurred:", error);
  //         res.status(500).json({ error: "An error occurred." });
  //     }
  // },

  news_list_search: async (req, res) => {
    try {
      console.log("Search button clicked.");

      // Extract necessary data from request
      let { fromDate, toDate, searchQuery, itemName } = req.body;

      // Construct the base SQL query
      let sql = `
       SELECT news.*, 
               users_created.full_name AS created_by,
               users_modified.full_name AS modified_by,
               news_category.name AS news_category  
        FROM news 
        LEFT JOIN users AS users_created ON news.created_by = users_created.id 
        LEFT JOIN users AS users_modified ON news.modified_by = users_modified.id
        LEFT JOIN news_category ON news.news_category = news_category.id 
        WHERE 1`;



      if (itemName) {

        sql += ` AND LOWER(news.title) LIKE '%${itemName}%'`;
      }

      if (searchQuery) {
        sql += ` AND news.news_category = ${searchQuery}`;
      }

      // if (fromDate && toDate) {
      //   // Reverse fromDate and toDate if fromDate is greater than toDate
      //   if (fromDate > toDate) {
      //     const temp = fromDate;
      //     fromDate = toDate;
      //     toDate = temp;
      //   }

      //   sql += ` AND news.created_date BETWEEN '${fromDate}' AND '${toDate}' `;
      // } else if (fromDate && !toDate) {
      //   sql += ` AND news.created_date >= '${fromDate}' `;
      // } else if (!fromDate && toDate) {
      //   sql += ` AND news.created_date <= '${toDate}' `;
      // }

      if (fromDate && toDate) {
        sql += ` AND news.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
    }



      // Add expense name (item_name) search condition



      console.log("SQL Query:", sql);

      // Execute the constructed SQL query
      connection.query(sql, (error, results, fields) => {
        if (error) {
          console.error("Error occurred during search:", error);
          res.status(500).json({ error: "An error occurred during search." });
        } else {
          console.log("Search results:", results);
          res.status(200).json({ results });
        }
      });
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({ error: "An error occurred." });
    }
  },

 

//   news_list_print: async (req, res) => {
//     try {
//         const { searchResults, selectedColumns, orientation, selectedPrintSize } = req.body;

//         console.log(searchResults, 'here all the searchResults');

//         // Create table headers based on selectedColumns
//         let tableHeaders = '<tr>';
//         selectedColumns.forEach(column => {
//             if (column !== 'action') {
//                 tableHeaders += `<th>${column === 'serial' ? 'Serial No' : column}</th>`;
//             }
//         });
//         tableHeaders += '</tr>';

//         // Create table rows based on searchResults
//         let tableRows = '';
//         if (searchResults?.length > 0) {
//             searchResults.forEach((result, index) => {
//                 let row = '<tr>';
//                 selectedColumns.forEach(column => {
//                     if (column !== 'action') {
//                         row += `<td>${column === 'serial' ? (index + 1) : result[column] || ''}</td>`;
//                     }
//                 });
//                 row += '</tr>';
//                 tableRows += row;
//             });
//         } else {
//             tableRows = '<tr><td colspan="' + selectedColumns.filter(col => col !== 'action').length + '">No data available</td></tr>';
//         }

//         const html = `<html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Document</title>
//             <style>
//             @page {
//                 size: letter portrait; /* This sets the page size to Letter and orientation to Portrait */
//                 margin: 20mm; /* Adjust the margin as needed */
//             }
//             * { 
//                 sheet-size: A4;
//                 font-family: 'Nikosh', sans-serif !important;
//             }
//             table {
//                 width: 100%;
//                 border-collapse: collapse;
//             }
//             th, td {
//                 padding: 8px;
//                 text-align: left;
//                 border: 1px solid #ddd;
//             }
//             th {
//                 background-color: #f2f2f2;
//             }
//             img {
//                 max-width: 100px;
//                 max-height: 100px;
//             }
//             .container {
//                 text-align: center;
//             }
//             .container2 {
//                 display: flex;
//                 justify-content: space-between;
//             }
//             </style>
//         </head>
//         <body>
//             <div class='container'>
//                 <h2 style="margin: 0; padding: 0;">Pathshala School & College News List</h2>
//                 <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
//                 <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
//                 <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
//                 <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">News List</h3>
//             </div>
//             <div class="container2">
//                 <p style="margin: 0; padding: 0;">Receipt No: 829</p>
//                 <p style="margin: 0; padding: 0;">Collected By:</p>
//                 <p style="margin: 0; padding: 0;">Date: </p>
//             </div>
//             <table>
//                 <thead>
//                     ${formatString(tableHeaders)}
//                 </thead>
//                 <tbody>
//                     ${tableRows}
//                 </tbody>
//             </table>
//         </body>
//         <script>
//             window.print();
//         </script>
//         </html>`;

//         res.send(html); // Send the HTML directly to the client
//     } catch (error) {
//         console.error('Error in office_visit_person_print:', error);
//         res.status(500).send('Error generating print view');
//     }
// }

// news_list_print: async (req, res) => {
//   try {
//       const { searchResults, selectedColumns, orientation, selectedPrintSize, fontSize, extraColumnValue } = req.body;

//       console.log(searchResults, 'here all the searchResults');

//       // Create table headers based on selectedColumns
//       let tableHeaders = '<tr>';
//       selectedColumns.forEach(column => {
//           if (column !== 'action') {
//               tableHeaders += `<th>${column === 'serial' ? 'Serial No' : column}</th>`;
//           }
//       });
//       tableHeaders += '</tr>';

//       // Create table rows based on searchResults
//       let tableRows = '';
//       if (searchResults?.length > 0) {
//           searchResults.forEach((result, index) => {
//               let row = '<tr>';
//               selectedColumns.forEach(column => {
//                   if (column !== 'action') {
//                       row += `<td>${column === 'serial' ? (index + 1) : result[column] || ''}</td>`;
//                   }
//               });
//               row += '</tr>';
//               tableRows += row;
//           });
//       } else {
//           tableRows = '<tr><td colspan="' + selectedColumns.filter(col => col !== 'action').length + '">No data available</td></tr>';
//       }

//       // Determine the page size and orientation based on selectedPrintSize and orientation
//       const pageSize = selectedPrintSize || 'A4';
//       const pageOrientation = orientation || 'portrait';

//       const html = `<html lang="en">
//       <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Document</title>
//           <style>
//           @page {
//               size: ${pageSize} ${pageOrientation}; /* Set page size and orientation */
//               margin: 20mm; /* Adjust the margin as needed */
//           }
//           * { 
//               font-family: 'Nikosh', sans-serif !important;
//           }
//           table {
//               width: 100%;
//               border-collapse: collapse;
//           }
//           th, td {
//               padding: 8px;
//               text-align: left;
//               border: 1px solid #ddd;
//           }
//           th {
//               background-color: #f2f2f2;
//           }
//           img {
//               max-width: 100px;
//               max-height: 100px;
//           }
//           .container {
//               text-align: center;
//           }
//           .container2 {
//               display: flex;
//               justify-content: space-between;
//           }
//           </style>
//       </head>
//       <body>
//           <div class='container'>
//               <h2 style="margin: 0; padding: 0;">Pathshala School & College News List</h2>
//               <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
//               <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
//               <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
//               <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">News List</h3>
//           </div>
//           <div class="container2">
//               <p style="margin: 0; padding: 0;">Receipt No: 829</p>
//               <p style="margin: 0; padding: 0;">Collected By:</p>
//               <p style="margin: 0; padding: 0;">Date: </p>
//           </div>
//           <table>
//               <thead>
//                   ${tableHeaders}
//               </thead>
//               <tbody>
//                   ${tableRows}
//               </tbody>
//           </table>
//       </body>
//       <script>
//           window.print();
//       </script>
//       </html>`;

//       res.send(html); // Send the HTML directly to the client
//   } catch (error) {
//       console.error('Error in news_list_print:', error);
//       res.status(500).send('Error generating print view');
//   }
// }


news_list_pdf: async (req, res) => {
  try {
    const { searchResults, selectedColumns, orientation, selectedPrintSize } = req.body; // Assuming selectedColumns is an array of column names

    console.log(searchResults, 'here all the searchResults');
    const statusLabels = {
      1: 'Active',
      2: 'Inactive',
      3: 'Pending'
    };

    const longTextColumns = ['title', 'description'];
    let tableRows = '';
    searchResults?.forEach((result, index) => {
      let row = '<tr>';
      selectedColumns.forEach(column => {
        if (column === 'serial') {
          row += `<td>${index + 1}</td>`; // Displaying index number starting from 1
        } else if (column === 'action') {
          // Skip this column
        }
        else if (column === 'status') {
          const statusLabel = statusLabels[result[column]] || '';
          // Get corresponding label from statusLabels object
          row += `<td>${statusLabel}</td>`;
        }
        // else if (column === 'file_path') {
        //   // Encode the image URL
        //   const encodedURL = encodeURIComponent(result[column]);
        //   console.log(`${process.env.NEXT_PUBLIC_API_URL}:5003/${result[column]}`, 'encodedURL welcome');
        //   // const encodedURL = encode(result[column]);
        //   row += `<td><img src="${process.env.NEXT_PUBLIC_API_URL}:5003/${result[column]}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`;
        // }
        else if (column === 'file') {
          if (result[column]) {
            // Encode the image URL
            const encodedURL = encodeURIComponent(result[column]);
            console.log(`http://localhost/:5003/${result[column]}`, 'encodedURL welcome');
            // const encodedURL = encode(result[column]);
            row += `<td><img src="http://localhost/:5003/${result[column]}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`;
          } else {
            // No file path provided, show a placeholder message
            row += `<td></td>`;
          }
        }
        else {
          const style = longTextColumns.includes(column) ? 'word-wrap: break-word; word-break: break-all;' : '';
          row += `<td style="${style}">${result[column]}</td>`;
          // row += `<td>${result[column]}</td>`; // Displaying regular columns
        }
      });
      row += '</tr>';
      tableRows += row;
    });
    // <link href='http://sonnetdp.github.io/nikosh/css/nikosh.css' rel='stylesheet' type='text/css'>
    // <link href='./nikosh.css' rel='stylesheet' type='text/css'>
    //  ${process.env.NEXT_PUBLIC_API_URL}:5002/get-css/nikosh.css
    // @import url("nikosh.css");

    const html = `<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>

        <style>
      
        * { 
          sheet-size: A4;font-family: 'Nikosh', sans-serif !important;
        }

            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                padding: 8px;
                text-align: left;
                border: 1px solid #ddd;
            }
            th {
                background-color: #f2f2f2;
            }
            img {
                max-width: 100px;
                max-height: 100px;
            }
            .container {
              text-align: center;
          }
          .container2 {
            display: flex;
            justify-content: space-between;
        }
        </style>
    </head>
    <body>
   <div class='container'>
   <h2 style="margin: 0; padding: 0;">Pathshala School & College News List</h2>
   <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
   <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
   <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
   <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">News List</h3>
   </div>
   <div class="container2" style:"display: flex;
   justify-content: space-between;">
   <p style="margin: 0; padding: 0;">Receipt No: 829</p>
   <p style="margin: 0; padding: 0;">Collected By:</p>
   <p style="margin: 0; padding: 0;">Date: </p>
  </div>
        <table>
            <thead>
                <tr>
                    ${selectedColumns.filter(column => column !== 'action').map(column => {
      if (column === 'status') {
        return `<th>Status</th>`;
      }
      else if (column === 'file_path') {
        return `<th>File</th>`;
      }
      else {
        return `<th>${formatString(column)}</th>`;
      }
    }).join('')}
                </tr>
            </thead>
            <tbody >
                ${tableRows}
            </tbody>
        </table>
    </body>
    </html>`;
    const pdfPageSize = selectedPrintSize === '' ? 'A4' : selectedPrintSize;
    const pdfOrientation = orientation === '' ? 'landscape' : orientation;
    wkhtmltopdf(html, { pageSize: pdfPageSize, orientation: pdfOrientation}, (err, stream) => {
      if (err) {
        console.error('Error generating PDF:', err);
        res.status(500).send('Error generating PDF');
        return;
      }
      stream.pipe(res);
    });
  } catch (error) {
    console.error('Error in period_pdf:', error);
    res.status(500).send('Error generating PDF');
  }
},


news_list_print: async (req, res) => {
  try {
      const { searchResults, selectedColumns, orientation, selectedPrintSize, fontSize, extraColumnValue } = req.body;

      console.log(searchResults, 'here all the searchResults');

      // Create table headers based on selectedColumns
      let tableHeaders = '<tr>';
      selectedColumns.forEach(column => {
          if (column !== 'action') {
              tableHeaders += `<th>${column === 'serial' ? 'SL No' : column}</th>`;
          }
      });

      // Add extra editable columns headers based on extraColumnValue
      for (let i = 1; i <= extraColumnValue; i++) {
          tableHeaders += `<th contenteditable="true">Column ${i}</th>`;
      }

      tableHeaders += '</tr>';

      // Create table rows based on searchResults
      let tableRows = '';
      if (searchResults?.length > 0) {
          searchResults.forEach((result, index) => {
              let row = '<tr>';
              selectedColumns.forEach(column => {
                  if (column !== 'action') {
                      row += `<td>${column === 'serial' ? (index + 1) : result[column] || ''}</td>`;
                  }
              });

              // Add editable cells for extra columns
              for (let i = 1; i <= extraColumnValue; i++) {
                  row += `<td contenteditable="true">Value ${i}</td>`;
              }

              row += '</tr>';
              tableRows += row;
          });
      } else {
          tableRows = '<tr><td colspan="' + (selectedColumns.filter(col => col !== 'action').length + extraColumnValue) + '"></td></tr>';
      }

      // Determine the page size and orientation based on selectedPrintSize and orientation
      const pageSize = selectedPrintSize || 'A4';
      const pageOrientation = orientation || 'portrait';

      const html = `<html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
          @page {
              size: ${pageSize} ${pageOrientation}; /* Set page size and orientation */
              margin: 20mm; /* Adjust the margin as needed */
          }
          * { 
              font-family: 'Nikosh', sans-serif !important;
              font-size: ${fontSize || '12px'}; /* Apply dynamic font size */
          }
          table {
              width: 100%;
              border-collapse: collapse;
          }
          th, td {
              padding: 8px;
              text-align: left;
              border: 1px solid #ddd;
          }
          th {
              background-color: #f2f2f2;
          }
          img {
              max-width: 100px;
              max-height: 100px;
          }
          .container {
              text-align: center;
          }
          .container2 {
              display: flex;
              justify-content: space-between;
          }
          </style>
      </head>
      <body>
          <div class='container'>
              <h2 style="margin: 0; padding: 0;">Pathshala School & College News List</h2>
              <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
              <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
              <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
              <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">News List</h3>
          </div>
          <div class="container2">
              <p style="margin: 0; padding: 0;">Receipt No: 829</p>
              <p style="margin: 0; padding: 0;">Collected By:</p>
              <p style="margin: 0; padding: 0;">Date: </p>
          </div>
          <table>
              <thead>
                  ${formatString(tableHeaders)}
              </thead>
              <tbody>
                  ${tableRows}
              </tbody>
          </table>
      </body>
      <script>
          window.print();
      </script>
      </html>`;

      res.send(html); // Send the HTML directly to the client
  } catch (error) {
      console.error('Error in news_list_print:', error);
      res.status(500).send('Error generating print view');
  }
}



};

module.exports = NewsModel;
