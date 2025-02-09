const connection = require('../../../../connection/config/database')

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


const brandModel = {


  // brand_create: async (req, res) => {
  //   try {
  //     const brands = req.body;
  //     const results = [];
  
  //     // Create an array of promises for each database query
  //     const promises = brands.map(brand => {
  //       return new Promise((resolve, reject) => {
  //         const { brand_name, status_id, file_path, description, created_by } = brand;
  
  //         if (!brand_name || !status_id) {
  //           reject({ message: 'brand name and status ID are required' });
  //         }
  
  //         const processedbrandName = brand_name.replace(/\s+/g, ' ').trim();
  
  //         const selectQuery = 'SELECT * FROM brand WHERE TRIM(brand_name) = ?';
  //         connection.query(selectQuery, [processedbrandName], (error, queryResults) => {
  //           if (error) {
  //             reject({ message: 'Internal Server Error' });
  //           }
  
  //           if (queryResults.length > 0) {
  //             reject({ message: 'brand already exists' });
  //           }
  
  //           const insertQuery = 'INSERT INTO brand (brand_name, status_id, file_path, description, created_by) VALUES (?, ?, ?, ?, ?)';
  //           connection.query(insertQuery, [processedbrandName, status_id, file_path, description, created_by], (error, result) => {
  //             if (error) {
  //               reject({ message: 'Internal Server Error' });
  //             }
  //             results.push(result);
  //             resolve();
  //           });
  //         });
  //       });
  //     });
  
  //     // Wait for all promises to resolve
  //     await Promise.all(promises);
  
  //     // Once all queries are done, send the response
  //     res.send(results);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // },
  

  // brand_create: async (req, res) => {


  //   try {

  //     const brands = req.body;
  //     const results = [];

  //     // Iterate through each brand
  //     for (const brand of brands) {
  //       const { brand_name, status_id, file_path, description, created_by } = brand;

  //       if (!brand_name || !status_id) {
  //         return res.status(400).json({ message: 'brand name and status ID are required' });
  //       }

  //       // Remove extra spaces from brand_name
  //       const processedbrandName = brand_name.replace(/\s+/g, ' ').trim();

  //       // Check if the brand already exists
  //       const selectQuery = 'SELECT * FROM brand WHERE TRIM(brand_name) = ?';
  //       connection.query(selectQuery, [processedbrandName], (error, results) => {
  //         if (error) {
  //           console.log(error);
  //           return res.status(500).json({ message: 'Internal Server Error' });
  //         }

  //         if (results.length > 0) {
  //           // brand with a similar name already exists
  //           console.log('brand already exists');
  //           return res.status(400).json({ message: 'brand already exists' });
  //         }

  //         // If brand doesn't exist, insert it
  //         const insertQuery = 'INSERT INTO brand (brand_name, status_id, file_path, description, created_by) VALUES (?, ?, ?, ?, ?)';
  //         connection.query(
  //           insertQuery,
  //           [processedbrandName, status_id, file_path, description, created_by],
  //           (error, result) => {
  //             if (error) {
  //               console.log(error);
  //               return res.status(500).json({ message: 'Internal Server Error' });
  //             }
  //             console.log(result);
  //             results.push(result);
  //           }
  //         );
  //       });
  //     }

  //     res.send(results);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // },


  // brand_create: async (req, res) => {
  //   try {
  //     const brands = req.body;
  //     const results = [];
  
  //     for (const brand of brands) {
  //       const { brand_name, status_id, file_path, description, created_by } = brand;
  
  //       if (!brand_name || !status_id) {
  //         return res.status(400).json({ message: 'brand name and status ID are required' });
  //       }
  
  //       const processedbrandName = brand_name.replace(/\s+/g, ' ').trim();
  
  //       const selectQuery = 'SELECT * FROM brand WHERE TRIM(brand_name) = ?';
  //       const existingBrands = await new Promise((resolve, reject) => {
  //         connection.query(selectQuery, [processedbrandName], (error, results) => {
  //           if (error) {
  //             console.log(error);
  //             reject(error);
  //           }
  //           resolve(results);
  //         });
  //       });
  
  //       if (existingBrands.length > 0) {
  //         console.log('brand already exists');
  //         return res.status(400).json({ message: 'brand already exists' });
  //       }
  
  //       const insertQuery = 'INSERT INTO brand (brand_name, status_id, file_path, description, created_by) VALUES (?, ?, ?, ?, ?)';
  //       const insertedBrand = await new Promise((resolve, reject) => {
  //         connection.query(insertQuery, [processedbrandName, status_id, file_path, description, created_by], (error, result) => {
  //           if (error) {
  //             console.log(error);
  //             reject(error);
  //           }
  //           resolve(result);
  //         });
  //       });
  
  //       console.log(insertedBrand);
  //       results.push(insertedBrand);
  //     }
  
  //     res.send(results);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // },
  
  
  
  brand_create: async (req, res) => {
    try {
      const brands = req.body;
      const results = [];
  
      for (const brand of brands) {
        const { brand_name, status_id, file_path, description, created_by } = brand;
  
        if (!brand_name || !status_id) {
          return res.status(400).json({ message: 'brand name and status ID are required' });
        }
  
        const processedbrandName = brand_name.replace(/\s+/g, ' ').trim();
  
        const selectQuery = 'SELECT * FROM brand WHERE TRIM(brand_name) = ?';
        const existingBrands = await new Promise((resolve, reject) => {
          connection.query(selectQuery, [processedbrandName], (error, results) => {
            if (error) {
              console.log(error);
              reject(error);
            }
            resolve(results);
          });
        });
  
        if (existingBrands.length === 0) {
          const insertQuery = 'INSERT INTO brand (brand_name, status_id, file_path, description, created_by) VALUES (?, ?, ?, ?, ?)';
          const insertedBrand = await new Promise((resolve, reject) => {
            connection.query(insertQuery, [processedbrandName, status_id, file_path, description, created_by], (error, result) => {
              if (error) {
                console.log(error);
                reject(error);
              }
              resolve(result);
            });
          });
  
          console.log(insertedBrand);
          results.push(insertedBrand);
        } else {
          console.log(`Brand '${processedbrandName}' already exists, skipping insertion.`);
        }
      }
  
      res.send(results);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  
  brand_copy: async (req, res) => {
    try {
      
      const { brand_name, status_id, file_path, description, created_by } = req.body;

      if (!brand_name || !status_id) {
        return res.status(400).json({ message: 'brand name is required' });
      }
      
      // Remove extra spaces from brand_name
      const processedbrandName = brand_name.replace(/\s+/g, ' ').trim();

      // Check if the brand already exists
      const selectQuery = 'SELECT * FROM brand WHERE TRIM(brand_name) = ?';
      connection.query(selectQuery, [processedbrandName], (error, results) => {
        if (error) {
          console.log(error, 'Internal Server Error');
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length > 0) {
          // brand with a similar name already exists
          console.log('brand already exists');
          return res.status(400).json({ message: 'brand already exists' });
        }

        // If brand doesn't exist, insert it
        const insertQuery = 'INSERT INTO brand (brand_name, status_id, file_path, description, created_by) VALUES (?, ?, ?, ?, ?)';
        connection.query(
          insertQuery,
          [processedbrandName, status_id, file_path, description, created_by],
          (error, result) => {
            if (error) {
              console.log(error);
              return res.status(500).json({ message: 'Internal Server Error' });
            }
            console.log(result);
            return res.send(result);
          }
        );
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },


  brand_list: async (req, res) => {
    try {
      const data = "select * from  brand";

      connection.query(data, function (error, result) {
        console.log(result)
        if (!error) {
          res.send(result)
        }

        else {
          console.log(error)
        }

      })
    }
    catch (error) {
      console.log(error)
    }
  },

  brand_list_paigination: async (req, res) => {
    const pageNo = Number(req.params.pageNo);
    const perPage = Number(req.params.perPage);
    try {
      const skipRows = (pageNo - 1) * perPage;
      // const query = "select * from  brand LIMIT ?, ?";
      // const query = "SELECT brand.*, users.full_name AS created_by FROM brand INNER JOIN users ON brand.created_by = users.id LIMIT ?, ?";
      let query = `
      SELECT brand.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by 
      FROM brand 
      LEFT JOIN users AS users_created ON brand.created_by = users_created.id 
      LEFT JOIN users AS users_modified ON brand.modified_by = users_modified.id 
      ORDER BY brand.id DESC
      LIMIT ?, ?
    `;
      connection.query(query, [skipRows, perPage], (error, result) => {
        console.log(result)
        if (!error) {
          res.send(result)
        }

        else {
          console.log(error)
        }

      })
    }
    catch (error) {
      console.log(error)
    }
  },





  brand_delete: async (req, res) => {

    try {
      const query = 'DELETE FROM brand WHERE id = ?';
      connection.query(query, [req.params.id], (error, result) => {
        if (!error && result.affectedRows > 0) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error || 'Product not found');
          return res.status(404).json({ message: 'Product not found.' });
        }
      });
    }
    catch (error) {
      console.log(error)
    }
  },


  brand_single: async (req, res) => {
    try {
      const query = 'SELECT * FROM brand WHERE id = ?';
      connection.query(query, [req.params.id], (error, result) => {
        if (!error && result.length > 0) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error || 'Product not found');
          return res.status(404).json({ message: 'Product not found.' });
        }
      });
    }
    catch (error) {
      console.log(error)
    }
  },


  brand_update: async (req, res) => {
    try {

      const { brand_name, status_id, file_path, description, modified_by } = req.body;

      const query = `UPDATE brand SET brand_name = ?, status_id = ?, file_path = ?, description = ?, modified_by = ? WHERE id = ?`;
      connection.query(query, [brand_name, status_id, file_path, description, modified_by, req.params.id], (error, result) => {
        if (!error && result.affectedRows > 0) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error || 'Product not found');
          return res.status(404).json({ message: 'Product not found.' });
        }
      });
    }
    catch (error) {
      console.log(error)
    }
  },

  brand_search: async (req, res) => {
    try {
      console.log("Search button clicked.");

      // Extract necessary data from request
      let { searchQuery, statusFilter, selectedOrder, fromDate, toDate, multiSearch } = req.body;

      // Construct the base SQL query
      let sql = `
      SELECT brand.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by 
      FROM brand 
      LEFT JOIN users AS users_created ON brand.created_by = users_created.id 
      LEFT JOIN users AS users_modified ON brand.modified_by = users_modified.id 
      WHERE 1 `;
      //order  by variable
      //order  by brand_name asc, status_id desc,created_date desc
      // Add search query condition
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        sql += ` AND LOWER(brand_name) LIKE '%${query}%' `;
      }

      // Add status filter condition
      if (statusFilter !== '') {
        sql += ` AND status_id = ${statusFilter} `;
      }

      // Add date range condition
      if (fromDate && toDate) {
        // Reverse fromDate and toDate if fromDate is greater than toDate
        if (fromDate > toDate) {
          const temp = fromDate;
          fromDate = toDate;
          toDate = temp;
        }

        sql += ` AND brand.created_date BETWEEN '${fromDate}' AND '${toDate}' `;
      } else if (fromDate && !toDate) {
        sql += ` AND brand.created_date >= '${fromDate}' `;
      } else if (!fromDate && toDate) {
        sql += ` AND brand.created_date <= '${toDate}' `;
      }
      // Add multiSearch condition
      if (multiSearch && multiSearch.length > 0) {
        sql += ` ORDER BY ${multiSearch}`; // Append convertedData to the ORDER BY clause
      }

      // if (multiSearch && multiSearch !== '') {
      //   sql += ` ORDER BY ${multiSearch}`; // Append convertedData to the ORDER BY clause
      // }
      // Add multiSearch condition
      // if (Array.isArray(multiSearch) && multiSearch.length > 0) {
      //   sql += ` ORDER BY ${multiSearch.join(', ')}`; // Append convertedData to the ORDER BY clause
      // }


      console.log("SQL Query:", sql);



      // Execute the constructed SQL query
      connection.query(sql, (error, results, fields) => {
        if (error) {
          console.error("Error occurred during search:", error);
          res.status(500).json({ error: "An error occurred during search." });
        } else {
          console.log("Search results:", results, sql);
          res.status(200).json({ results });
        }
      });
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({ error: "An error occurred." });
    }
  },

  

  brand_pdf: async (req, res) => {
    try {
      const { searchResults, selectedColumns } = req.body; // Assuming selectedColumns is an array of column names

      console.log(searchResults, 'here all the searchResults');
      const statusLabels = {
        1: 'Active',
        2: 'Inactive',
        3: 'Pending'
      };

      const longTextColumns = ['brand_name', 'description'];
      let tableRows = '';
      searchResults?.forEach((result, index) => {
        let row = '<tr>';
        selectedColumns.forEach(column => {
          if (column === 'serial') {
            row += `<td>${index + 1}</td>`; // Displaying index number starting from 1
          } else if (column === 'action') {
            // Skip this column
          }
          else if (column === 'status_id') {
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
          else if (column === 'file_path') {
            if (result[column]) {
                // Encode the image URL
                const encodedURL = encodeURIComponent(result[column]);
                console.log(`http://192.168.0.194:5003/${result[column]}`, 'encodedURL welcome');
                // const encodedURL = encode(result[column]);
                row += `<td><img src="http://192.168.0.194:5003/${result[column]}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`;
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
      // @import url("../css/nikosh.css");

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
          .longTextStyle {
            word-wrap: break-word;
            word-break: break-all;
        }
          </style>
      </head>
      <body>
     <div class='container'>
     <h2 style="margin: 0; padding: 0;">Pathshala School & College brand List</h2>
     <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
     <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
     <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
     <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">brand List</h3>
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
        if (column === 'status_id') {
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
              <td style={['brand_name', 'description'].includes(column) ? longTextStyle : {}}>
              ${tableRows}
              </td>
              </tbody>
          </table>
      </body>
      </html>`;

      wkhtmltopdf(html, { pageSize: 'letter' }, (err, stream) => {
        if (err) {
          console.error('Error generating PDF:', err);
          res.status(500).send('Error generating PDF');
          return;
        }
        stream.pipe(res);
      });
    } catch (error) {
      console.error('Error in brand_pdf:', error);
      res.status(500).send('Error generating PDF');
    }
  },










  ListStatus: async (req, res) => {
    try {
      const data = "select * from  status";

      connection.query(data, function (error, result) {
        console.log(result)
        if (!error) {
          res.send(result)
        }

        else {
          console.log(error)
        }

      })
    }
    catch (error) {
      console.log(error)
    }
  },

}

module.exports = brandModel




/*
  
      // Add date range condition
      // if (fromDate && toDate) {
      //   sql += ` AND brand.created_date BETWEEN '${fromDate}' AND '${toDate}' `;
      // } else if (fromDate && !toDate) {
      //   sql += ` AND brand.created_date >= '${fromDate}' `;
      // } else if (!fromDate && toDate) {
      //   sql += ` AND brand.created_date <= '${toDate}' `;
      // }
        $from_date = $_POST["from_date"];
        $to_date = $_POST["to_date"];
        $income_category = $_POST["income_category"];
  
        if(	$income_category){
            $income_category = "income.income_category='$income_category' and ";
        }else{
            $income_category ="";
        }
  
        if($from_date && $to_date == ''){
          $from_date1  = date_convert($from_date);
          $report_date = " date(income.income_date) ='$from_date1' and ";
  
        }else if($from_date == '' && $to_date){
          $to_date1  = date_convert($to_date);
          $report_date = " date(income.income_date) ='$to_date1' and ";
        }elseif($from_date && $to_date){
          $from_date1  = date_convert($from_date);
          $to_date1  = date_convert($to_date);
          if(strtotime($from_date) < strtotime($to_date)){
            $report_date = " date(income.income_date) BETWEEN '$from_date1' and '$to_date1' and ";
          }else{
            $report_date = " date(income.income_date) BETWEEN '$to_date1' and '$from_date1' and";
          }
        }else{
          $report_date = "";
        }
        $last_word_remove =$income_category.$report_date;
        if(!empty($last_word_remove)){
          $archive = preg_replace('/\w\w+\s*(\w*)$/', '$1', $last_word_remove);
        }else{
          $archive = 1;
        }
      	
        */

  
  // orginal
  // brand_search: async (req, res) => {
  //   try {
  //     console.log("Search button clicked.");

  //     // Extract necessary data from request
  //     const { selectedColumns, searchQuery, statusFilter, selectedOrder, fromDate, toDate } = req.body;

  //     // Construct the base SQL query
  //     let sql = `SELECT * FROM brand WHERE 1`;

  //     // Add search query condition
  //     if (searchQuery) {
  //       const query = searchQuery.toLowerCase();
  //       sql += ` AND LOWER(brand_name) LIKE '%${query}%'`;
  //     }

  //     // Add status filter condition
  //     if (statusFilter !== '') {
  //       sql += ` AND status_id = ${statusFilter}`;
  //     }

  //     // Add date range condition
  //     if (fromDate && toDate) {
  //       sql += ` AND created_date BETWEEN '${fromDate}' AND '${toDate}'`;
  //     }

  //     // Add column sorting
  //     if (selectedOrder === '1') {
  //       sql += ' ORDER BY id ASC'; // Ascending order
  //     } else if (selectedOrder === '2') {
  //       sql += ' ORDER BY id DESC'; // Descending order
  //     }

  //     console.log("SQL Query:", sql);

  //     // Execute the constructed SQL query
  //     connection.query(sql, (error, results, fields) => {
  //       if (error) {
  //         console.error("Error occurred during search:", error);
  //         res.status(500).json({ error: "An error occurred during search." });
  //       } else {
  //         console.log("Search results:", results);
  //         res.status(200).json({ results });
  //       }
  //     });
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //     res.status(500).json({ error: "An error occurred." });
  //   }
  // },
  // orginal

// brand_create: async (req, res) => {
  //   try {
  //     let brands = req.body; 

  //     const results = [];

  //     // Iterate through each brand
  //     for (const brand of brands) {
  //       const { brand_name, status_id, file_path, description, created_by } = brand;

  //       if (!brand_name || !status_id) {
  //         return res.status(400).json({ message: 'Brand name and status ID are required' });
  //       }

  //       // Check if the brand name already exists
  //       const selectQuery = 'SELECT * FROM brand WHERE brand_name = ?';
  //       const existingBrand = await new Promise((resolve, reject) => {
  //         connection.query(selectQuery, [brand_name], (error, results) => {
  //           if (error) {
  //             console.log(error);
  //             reject(error);
  //           } else {
  //             resolve(results);
  //           }
  //         });
  //       });

  //       if (existingBrand.length > 0) {
  //         // Brand name already exists
  //         console.log('Brand already exists');
  //         return res.status(400).json({ message: 'Brand already exists' });
  //       }

  //       // If brand name doesn't exist, insert it
  //       const insertQuery = 'INSERT INTO brand (brand_name, status_id, file_path, description, created_by) VALUES (?, ?, ?, ?, ?)';
  //       const newBrand = await new Promise((resolve, reject) => {
  //         connection.query(
  //           insertQuery,
  //           [brand_name, status_id, file_path, description, created_by],
  //           (error, result) => {
  //             if (error) {
  //               console.log(error);
  //               reject(error);
  //             } else {
  //               resolve(result);
  //             }
  //           }
  //         );
  //       });

  //       console.log(newBrand);
  //       results.push(newBrand);
  //     }

  //     res.send(results);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // },

  // brand_create: async (req, res) => {
  //   try {
  //     let brands = req.body; // Assuming req.body is an array of brand objects
  //     for (const brand of brands) {
  //       const { brand_name, status_id, file_path, description, created_by } = brand;

  //       if (!brand_name || !status_id) {
  //         return res.status(400).json({ message: 'Brand name is required' });
  //       }

  //       // Check if the brand name already exists
  //       const selectQuery = 'SELECT * FROM brand WHERE brand_name = ?';
  //       connection.query(selectQuery, [brand_name], (error, results) => {
  //         if (error) {
  //           console.log(error);
  //           return res.status(500).json({ message: 'Internal Server Error' });
  //         }

  //         if (results.length > 0) {
  //           // Brand name already exists
  //           console.log('Brand already exists');
  //           return res.status(400).json({ message: 'Brand already exists' });
  //         }

  //         // If brand name doesn't exist, insert it
  //         const insertQuery = 'INSERT INTO brand (brand_name, status_id, file_path, description, created_by) VALUES (?, ?, ?, ?, ?)';
  //         connection.query(
  //           insertQuery,
  //           [brand_name, status_id, file_path, description, created_by],
  //           (error, result) => {
  //             if (error) {
  //               console.log(error);
  //               return res.status(500).json({ message: 'Internal Server Error' });
  //             }
  //             console.log(result);
  //             return res.send(result);
  //           }
  //         );
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // },

  // brand_create: async (req, res) => {
  //   try {

  //     const { brand_name, status_id, file_path, description, created_by } = req.body;

  //     if (!brand_name || !status_id) {
  //       return res.status(400).json({ message: 'Brand name is required' });
  //     }
  //     // Check if the brand name already exists
  //     const selectQuery = 'SELECT * FROM brand WHERE brand_name = ?';
  //     connection.query(selectQuery, [brand_name], (error, results) => {
  //       if (error) {
  //         console.log(error);
  //         return res.status(500).json({ message: 'Internal Server Error' });
  //       }

  //       if (results.length > 0) {
  //         // Brand name already exists
  //         console.log('Brand already exists');
  //         return res.status(400).json({ message: 'Brand already exists' });
  //       }

  //       // If brand name doesn't exist, insert it
  //       const insertQuery = 'INSERT INTO brand (brand_name, status_id, file_path, description, created_by) VALUES (?, ?, ?, ?, ?)';
  //       connection.query(
  //         insertQuery,
  //         [brand_name, status_id, file_path, description, created_by],
  //         (error, result) => {
  //           if (error) {
  //             console.log(error);
  //             return res.status(500).json({ message: 'Internal Server Error' });
  //           }
  //           console.log(result);
  //           return res.send(result);
  //         }
  //       );
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // },


  // type






