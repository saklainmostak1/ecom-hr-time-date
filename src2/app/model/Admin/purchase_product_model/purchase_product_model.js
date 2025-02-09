

const connection = require('../../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

const PurchaseModelProduct = {

    purchase_product_create: async (req, res) => {

        try {
            const { product_id, quantity, unit_id, purchase_price, sale_price, created_by
            } = req.body;

            const insertQuery = 'INSERT INTO purchase_product (product_id, quantity, unit_id, purchase_price, sale_price, created_by) VALUES (?, ?, ?, ?, ?, ?)';
            const result = await connection.query(insertQuery, [product_id, quantity, unit_id, purchase_price, sale_price, created_by]);

            // Sending only the necessary data from the result object
            const { insertId, affectedRows } = result;

            // Sending response with relevant data
            res.status(200).json({ insertId, affectedRows });

            // Using parameterized query to prevent SQL injection

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },

    purchase_product_list: async (req, res) => {
        try {
            const data = "select * from  purchase_product";

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

    purchase_product_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM purchase_product WHERE id = ?';
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


    purchase_product_update: async (req, res) => {
        try {

            const { product_id, quantity, unit_id, purchase_price, sale_price, modified_by } = req.body;

            const query = `UPDATE purchase_product SET   product_id = ?, quantity = ?, unit_id = ?, purchase_price = ?, sale_price = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [product_id, quantity, unit_id, purchase_price, sale_price, modified_by, req.params.id], (error, result) => {
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


    purchase_product_delete: async (req, res) => {
        try {
            const query = 'DELETE FROM purchase_product WHERE id = ?';
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


    purchase_product_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
      SELECT purchase_product.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by, 
             product.product_name AS product_name,
             unit.unit_name AS unit_name
      FROM purchase_product 
      LEFT JOIN users AS users_created ON purchase_product.created_by = users_created.id 
      LEFT JOIN users AS users_modified ON purchase_product.modified_by = users_modified.id
      LEFT JOIN 
    product ON purchase_product.product_id = product.id
    LEFT JOIN 
    unit ON purchase_product.unit_id = unit.id 
      ORDER BY purchase_product.id DESC
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

    purchase_product_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            let { productName, unit, toDate, fromDate } = req.body;

            // Construct the base SQL query
            let sql = `
              SELECT purchase_product.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by,
                product.product_name AS product_name,
             unit.unit_name AS unit_name 
            FROM purchase_product 
            LEFT JOIN users AS users_created ON purchase_product.created_by = users_created.id 
            LEFT JOIN users AS users_modified ON purchase_product.modified_by = users_modified.id
             LEFT JOIN 
            product ON purchase_product.product_id = product.id
            LEFT JOIN 
            unit ON purchase_product.unit_id = unit.id   
            WHERE 1`;





            if (productName) {
                sql += ` AND purchase_product.product_id LIKE '%${productName}%'`;
            }
            if (unit) {
                sql += ` AND purchase_product.unit_id LIKE '%${unit}%'`;
            }

            if (fromDate && toDate) {
                sql += ` AND purchase_product.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
            }


            sql += ` ORDER BY purchase_product.id DESC`
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



    purchase_product_pdf: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize } = req.body;



            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';


                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.product_name}</td>`; // Person Name
                row += `<td>${result.unit_name}</td>`; // Person Name
                row += `<td>${result.purchase_price}</td>`; // Person Name
                row += `<td>${result.sale_price}</td>`; // Person Name
                row += `<td>${result.created_by}</td>`; // Person Name
                row += '</tr>';
                tableRows += row;
            });

            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';

            const html = `<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                     @page {
                        size: ${pageSize} ${pageOrientation}; /* This sets the page size to A4 and orientation to Portrait */
                        margin: 20mm; /* Adjust the margin as needed */
                    }
                    * { 
                        font-size: ${fontSize || '12px'};
                        font-family: 'Nikosh', sans-serif !important;
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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Expense List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Expense List</h3>
                </div>
                <div class="container2">
                    <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                    <p style="margin: 0; padding: 0;">Collected By:</p>
                    <p style="margin: 0; padding: 0;">Date: </p>
                </div>
                <table>
                    <thead>
                        <tr>
 <th>

                                                                    SL No.
                                                                </th>
                                                                <th>
                                                                    Product Name
                                                                </th>
                                                                <th>
                                                                    Unit Name
                                                                </th>
                                                                <th>
                                                                    Purchase Price
                                                                </th>
                                                                <th>
                                                                    Sale Price
                                                                </th>
                                                                <th>
                                                                    Created By 
                                                                </th>

                                                               
                            
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>`;

            wkhtmltopdf(html, { pageSize: pageSize, orientation: pageOrientation }, (err, stream) => {
                if (err) {
                    console.error('Error generating PDF:', err);
                    res.status(500).send('Error generating PDF');
                    return;
                }
                stream.pipe(res);
            });
        } catch (error) {
            console.error('Error in expense_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },



    purchase_product_print: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize, extraColumnValue } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.product_name}</td>`; // Person Name
                row += `<td>${result.unit_name}</td>`; // Person Name
                row += `<td>${result.purchase_price}</td>`; // Person Name
                row += `<td>${result.sale_price}</td>`; // Person Name
                row += `<td>${result.created_by}</td>`; // Person Name

                // Add extra columns based on extraColumnValue
                for (let i = 1; i <= extraColumnValue; i++) {
                    row += `<td contenteditable="true">Extra Column ${i}</td>`; // Editable extra column
                }

                row += '</tr>';
                tableRows += row;
            });

            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';

            const html = `<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    @page {
                        size: ${pageSize} ${pageOrientation}; /* This sets the page size and orientation */
                        margin: 20mm; /* Adjust the margin as needed */
                    }
                    * { 
                        font-size: ${fontSize || '12px'};
                        font-family: 'Nikosh', sans-serif !important;
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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Visit List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Visit List</h3>
                </div>
                <div class="container2">
                    <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                    <p style="margin: 0; padding: 0;">Collected By:</p>
                    <p style="margin: 0; padding: 0;">Date: </p>
                </div>
                <table>
                    <thead>
                    
                            <tr>
                             <th>

                SL No.
            </th>
            <th>
                Product Name
            </th>
            <th>
                Unit Name
            </th>
            <th>
                Purchase Price
            </th>
            <th>
                Sale Price
            </th>
            <th>
                Created By 
            </th>

                            
                 ${[...Array(extraColumnValue)].map((_, i) => `<th contenteditable="true">Extra Column ${i + 1}</th>`).join('')} <!-- Dynamically add headers -->
                           
                        </tr>
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
            console.error('Error in office_visit_person_print:', error);
            res.status(500).send('Error generating print view');
        }
    },



}

module.exports = PurchaseModelProduct