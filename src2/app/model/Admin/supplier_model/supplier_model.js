const connection = require('../../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";
const crypto = require('crypto');

const supplierModel = {


    supplier_address_list: async (req, res) => {
        try {
            const data = "select * from  supplier_address";

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

    supplier_address_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM supplier_address WHERE id = ?';
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


    expense_category_update: async (req, res) => {
        try {

            const { expense_category_name, modified_by } = req.body;

            const query = `UPDATE expense_category SET expense_category_name = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [expense_category_name, modified_by, req.params.id], (error, result) => {
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




    supplier_address_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM supplier_address WHERE id = ?';
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


    supplier_due_amount: async (req, res) => {
        try {
            const supplier_id = req.params.supplier_id;

            // Query to retrieve the sum of due and paid amounts for the provided supplier_id
            const sql = "SELECT supplier_id, SUM(payable_amount) AS payable_amount,  SUM(paid_amount) AS paid_amount FROM expense WHERE supplier_id = ?";

            connection.query(sql, [supplier_id], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // Check if any record was found
                if (result.length === 0) {
                    return res.status(404).json({ message: 'No data found for the provided supplier_id' });
                }

                // Send the result as JSON response
                res.json(result[0]);
            });
        } catch (error) {
            console.log(error);
        }
    },




    // supplier_address_create: async (req, res) => {
    //     try {
    //         const { name, email, mobile, address, trade_license, vat, tin, status_id, description, created_by } = req.body;
    //         if (!name || !status_id) {
    //             return res.status(400).json({ message: 'brand name and status ID are required' });
    //         }


    //         const insertQuery = 'INSERT INTO supplier_address (name, email, mobile, address, trade_license, vat, tin, status_id, description, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    //         const result = await connection.query(insertQuery, [name, email, mobile, address, trade_license, vat, tin, status_id, description, created_by]);

    //         // Sending only the necessary data from the result object
    //         const { insertId, affectedRows } = result;

    //         // Sending response with relevant data
    //         res.status(200).json({ insertId, affectedRows });

    //         // Using parameterized query to prevent SQL injection

    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Error processing the request' });
    //     }
    // },

    supplier_address_create: async (req, res) => {
        const { name, email, mobile, address, trade_license, vat, tin, status_id, description, created_by, img } = req.body;

        // Check required fields
        if (!name || !status_id) {
            return res.status(400).json({ message: 'Name and status ID are required' });
        }

        const hashedPassword = crypto.createHash('sha1').update(mobile).digest('hex');

        try {
            // Start a transaction
            await connection.beginTransaction();

            // Insert data into the users table
            const userQuery = `
                INSERT INTO users (full_name, email, mobile, password)
                VALUES (?, ?, ?, ?)`;

            const userResult = await new Promise((resolve, reject) => {
                connection.query(userQuery, [name, email, mobile, hashedPassword], (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                });
            });

            const userId = userResult.insertId; // Extract the inserted user ID
            const userRows = userResult.affectedRows; // Get affected rows

            if (!userId || userRows === 0) {
                throw new Error('Failed to insert user');
            }

            // Insert data into the supplier_address table
            const supplierQuery = `
                INSERT INTO supplier_address (name, email, mobile, address, trade_license, vat, tin, status_id, description, created_by, user_id, img)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const supplierResult = await new Promise((resolve, reject) => {
                connection.query(supplierQuery, [name, email, mobile, address, trade_license, vat, tin, status_id, description, created_by, userId, img], (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                });
            });

            const supplierId = supplierResult.insertId; // Extract the inserted supplier ID
            const supplierRows = supplierResult.affectedRows; // Get affected rows

            if (!supplierId || supplierRows === 0) {
                throw new Error('Failed to insert supplier');
            }

            // Commit the transaction
            await connection.commit();

            // Return the results of both inserts
            res.status(200).json({
                supplier: { insertId: supplierId, affectedRows: supplierRows },
                user: { insertId: userId, affectedRows: userRows },
            });
        } catch (error) {
            // Rollback transaction in case of error
            await connection.rollback();
            console.error(error);
            res.status(500).json({ message: 'Error processing the request', error: error.message });
        }
    },




    supplier_address_update: async (req, res) => {
        try {

            const { name, email, mobile, address, trade_license, vat, tin, status_id, description, modified_by, img } = req.body;


            const query = `UPDATE supplier_address SET   name = ?, email = ?, mobile = ?, address = ?, trade_license = ?, vat = ?, tin = ?,  status_id = ?, description = ?, img = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [name, email, mobile, address, trade_license, vat, tin, status_id, description, img, modified_by, req.params.id], (error, result) => {
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




    supplier_address_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
      SELECT supplier_address.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by 
      FROM supplier_address 
      LEFT JOIN users AS users_created ON supplier_address.created_by = users_created.id 
      LEFT JOIN users AS users_modified ON supplier_address.modified_by = users_modified.id 
      ORDER BY supplier_address.id DESC
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


    supplier_address_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            let { status, name, email, mobile } = req.body;

            // Construct the base SQL query
            let sql = `
             SELECT supplier_address.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by 
            FROM supplier_address 
            LEFT JOIN users AS users_created ON supplier_address.created_by = users_created.id 
            LEFT JOIN users AS users_modified ON supplier_address.modified_by = users_modified.id 
            WHERE 1`;



            if (name) {
                sql += ` AND LOWER(supplier_address.name) LIKE '%${name}%'`;
            }
            if (email) {
                sql += ` AND LOWER(supplier_address.email) LIKE '%${email}%'`;
            }

            if (mobile) {
                sql += ` AND LOWER(supplier_address.mobile) LIKE '%${mobile}%'`;
            }

            if (status) {

                sql += ` AND supplier_address.status_id LIKE '%${status}%'`;
            }



            sql += ` ORDER BY supplier_address.id DESC`
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

    supplier_address_pdf: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize } = req.body;



            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.name}</td>`; // Person Name
                row += `<td>${result.email}</td>`; // Person Name
                row += `<td>${result.mobile}</td>`; // Person Name
                row += `<td>${result.address}</td>`; // Person Name
                row += `<td>${result.status_id === 1 ? "Active"
                    : result.status_id === 2 ? "Inactive"
                        : result.status_id === 3 ? "Pending"
                            : "Unknown"}</td>`; // Person Mobile



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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Supplier List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Supplier List</h3>
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
                                                                    Name
                                                                </th>
                                                                <th>
                                                                    Email
                                                                </th>
                                                                <th>
                                                                    Mobile
                                                                </th>
                                                                <th>
                                                                    Address
                                                                </th>
                                                                <th>
                                                                    Status
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



    supplier_address_print: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize, extraColumnValue } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.name}</td>`; // Asset Type Name
                row += `<td>${result.email}</td>`; // Asset Type Name
                row += `<td>${result.mobile}</td>`; // Asset Type Name
                row += `<td>${result.address}</td>`; // Asset Type Name
                row += `<td>${result.status_id === 1 ? "Active"
                    : result.status_id === 2 ? "Inactive"
                        : result.status_id === 3 ? "Pending"
                            : "Unknown"}</td>`; // Status


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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Supplier List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Supplier List</h3>
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
                                                                    Name
                                                                </th>
                                                                <th>
                                                                    Email
                                                                </th>
                                                                <th>
                                                                    Mobile
                                                                </th>
                                                                <th>
                                                                    Address
                                                                </th>
                                                                <th>
                                                                    Status
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
module.exports = supplierModel