

const connection = require('../../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

const FontServiceBoxModel = {




    page_list_list: async (req, res) => {
        try {
            const data = "select * from  page_list";

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

    front_service_box_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM front_service_box WHERE id = ?';
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

    front_service_box_list: async (req, res) => {
        try {
            const query = `
            SELECT 
                fsb.*, 
                u.full_name AS full_name, 
                CASE 
                    WHEN fsb.status = 1 THEN 'active'
                    WHEN fsb.status = 2 THEN 'inactive'
                    WHEN fsb.status = 3 THEN 'pending'
                    ELSE 'unknown'
                END AS status_text
            FROM front_service_box fsb
            LEFT JOIN users u ON fsb.created_by = u.id
            ORDER BY fsb.sort ASC;
        `;

            connection.query(query, (error, result) => {
                if (!error) {
                    res.send(result);
                } else {
                    console.error("Database query error:", error);
                    res.status(500).send("An error occurred while fetching data.");
                }
            });
        } catch (error) {
            console.error("Server error:", error);
            res.status(500).send("An unexpected error occurred.");
        }
    },



    page_list_list_one: async (req, res) => {
        try {
            const data = "select * from  page_list where page_status = 1";

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

    all_table_data: async (req, res) => {
        const { pageListTable } = req.body
        try {
            const data = `select * from  ${pageListTable ? pageListTable : 'page_list'}`;

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


    front_service_box_create: async (req, res) => {
        try {
            // Destructuring the allData object received from frontend
            const { linkData, photo, formData } = req.body;

            // Extracting individual values from linkData and formData
            const link1_url = linkData.link1.value;
            const link2_url = linkData.link2.value;
            const link3_url = linkData.link3.value;
            const link4_url = linkData.link4.value;
            const link5_url = linkData.link5.value;

            const link1 = linkData.link1.name;
            const link2 = linkData.link2.name;
            const link3 = linkData.link3.name;
            const link4 = linkData.link4.name;
            const link5 = linkData.link5.name;

            const { title, sort, status, created_by } = formData;

            // Using parameterized query to prevent SQL injection
            const insertQuery = `
                INSERT INTO front_service_box 
                (title, sort, status, photo, link1_url, link2_url, link3_url, link4_url, link5_url, link1, link2, link3, link4, link5, created_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            // Executing the query with the extracted values
            const result = await connection.query(insertQuery, [
                title, sort, status, photo,
                link1_url, link2_url, link3_url,
                link4_url, link5_url, link1, link2, link3, link4, link5, created_by
            ]);

            // Extracting the relevant data from the query result
            const { insertId, affectedRows } = result;

            // Sending the response with the insertId and affectedRows
            res.status(200).json({ insertId, affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },

    front_service_box_update: async (req, res) => {
        try {
            // Destructuring the allData object received from frontend
            const { linkData, photo, formData } = req.body;

            // Extracting individual values from linkData and formData
            const link1_url = linkData.link1.value;
            const link2_url = linkData.link2.value;
            const link3_url = linkData.link3.value;
            const link4_url = linkData.link4.value;
            const link5_url = linkData.link5.value;

            const link1 = linkData.link1.name;
            const link2 = linkData.link2.name;
            const link3 = linkData.link3.name;
            const link4 = linkData.link4.name;
            const link5 = linkData.link5.name
            const { title, sort, status, modified_by } = formData;

            // Assuming you have an `id` field to identify the record to update


            // Using parameterized query to prevent SQL injection
            const updateQuery = `
                UPDATE front_service_box
                SET 
                    title = ?, 
                    sort = ?, 
                    status = ?, 
                    photo = ?, 
                    link1_url = ?, 
                    link2_url = ?, 
                    link3_url = ?, 
                    link4_url = ?, 
                    link5_url = ?, 
                    link1 = ?,
                    link2 = ?,
                    link3 = ?,
                    link4 = ?,
                    link5 = ?,
                    modified_by = ?
                WHERE id = ?
            `;

            // Executing the query with the extracted values
            const result = await connection.query(updateQuery, [
                title, sort, status, photo,
                link1_url, link2_url, link3_url,
                link4_url, link5_url, link1, link2, link3, link4, link5, modified_by,
                req.params.id
            ]);

            // Extracting the relevant data from the query result
            const { affectedRows } = result;


            res.status(200).json({ message: 'Record updated successfully', affectedRows });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },


    front_service_box_single: async (req, res) => {
        try {
            const query = "SELECT * FROM front_service_box WHERE id = ?";
            connection.query(query, [req.params.id], (error, result) => {
                if (!error && result.length > 0) {
                    console.log(result);
                    return res.send(result);
                } else {
                    console.log(error || "Product not found");
                    return res.status(404).json({ message: "Product not found." });
                }
            });
        } catch (error) {
            console.log(error);
        }
    },

    front_service_box_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);

        try {
            if (isNaN(pageNo) || isNaN(perPage) || pageNo < 1 || perPage < 1) {
                return res.status(400).json({ error: "Invalid pagination parameters" });
            }

            const skipRows = (pageNo - 1) * perPage;

            let query = `
                SELECT fsb.*, 
                       users_created.full_name AS created_by,
                       users_modified.full_name AS modified_by,
                       CASE 
                           WHEN fsb.status = 1 THEN 'active'
                           WHEN fsb.status = 2 THEN 'inactive'
                           WHEN fsb.status = 3 THEN 'pending'
                           ELSE 'unknown'
                       END AS status_text 
                FROM front_service_box fsb
                LEFT JOIN users AS users_created ON fsb.created_by = users_created.id 
                LEFT JOIN users AS users_modified ON fsb.modified_by = users_modified.id 
                ORDER BY fsb.sort ASC
                LIMIT ?, ?
            `;

            connection.query(query, [skipRows, perPage], (error, result) => {
                if (error) {
                    console.error("Database query error:", error);
                    return res.status(500).json({ error: "Database error occurred" });
                }

                res.json(result);
            });
        } catch (error) {
            console.error("Unexpected error:", error);
            res.status(500).json({ error: "Unexpected error occurred" });
        }
    },

    front_service_box_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { fromDate, toDate, title, status, sort } = req.body;

            // Construct the base SQL query
            let sql = `
                       SELECT fsb.*, 
                       users_created.full_name AS created_by,
                       users_modified.full_name AS modified_by,
                       CASE 
                           WHEN fsb.status = 1 THEN 'active'
                           WHEN fsb.status = 2 THEN 'inactive'
                           WHEN fsb.status = 3 THEN 'pending'
                           ELSE 'unknown'
                       END AS status_text 
                FROM front_service_box fsb
                LEFT JOIN users AS users_created ON fsb.created_by = users_created.id 
                LEFT JOIN users AS users_modified ON fsb.modified_by = users_modified.id 
            WHERE 1
            `;


            if (fromDate && toDate) {
                sql += ` AND fsb.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
            }


            if (sort) {
                sql += ` AND fsb.sort LIKE '%${sort}%'`;
            }
            if (status) {
                sql += ` AND fsb.status LIKE '%${status}%'`;
            }
            // Add invoice ID condition

            if (title) {

                sql += ` AND LOWER(fsb.title) LIKE '%${title}%'`;
            }

            sql += ` ORDER BY fsb.sort ASC`

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

    
    front_service_box_list_pdf: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize } = req.body;



            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';


                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.title}</td>`; // Person Name
                row += `<td>${result.sort}</td>`; // Person Name
                row += `<td>${result.status_text}</td>`; // Person Name
                row += `<td><img src="http://localhost/:5003/${result.photo}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`; // Person Email
                row += `<td>${result.created_by}</td>`; // Person Name
                row += `<td>${result.created_date.slice(0,10)}</td>`; // Person Name


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
                        
                        font-family: 'Nikosh', sans-serif !important;
                    }
                    table {
                    font-size: ${fontSize || '12px'};
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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Front Service Box List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Front Service Box List</h3>
                </div>
                <div class="container2">
                    <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                    <p style="margin: 0; padding: 0;">Collected By:</p>
                    <p style="margin: 0; padding: 0;">Date: </p>
                </div>
                <table>
                    <thead>
                        <tr>
                                                            <th>SL.</th>
                                                            <th>Title</th>
                                                            <th>Sort</th>
                                                            <th>Status</th>
                                                            <th>Photo</th>
                                                            <th>Created By</th>
                                                            <th>Created Date</th>
                                                           
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



    front_service_box_list_print: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize, extraColumnValue } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';


                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.title}</td>`; // Person Name
                row += `<td>${result.sort}</td>`; // Person Name
                row += `<td>${result.status_text}</td>`; // Person Name
                row += `<td><img src="http://localhost/:5003/${result.photo}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`; // Person Email
                row += `<td>${result.created_by}</td>`; // Person Name
                row += `<td>${result.created_date.slice(0,10)}</td>`; // Person Name

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
                        
                        font-family: 'Nikosh', sans-serif !important;
                    }
                    table {
                    font-size: ${fontSize || '12px'};
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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Front Service Box List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Front Service Box List</h3>
                </div>
                <div class="container2">
                    <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                    <p style="margin: 0; padding: 0;">Collected By:</p>
                    <p style="margin: 0; padding: 0;">Date: </p>
                </div>
                <table>
                    <thead>
                    
                            <tr>
                           <th>SL.</th>
                                                            <th>Title</th>
                                                            <th>Sort</th>
                                                            <th>Status</th>
                                                            <th>Photo</th>
                                                            <th>Created By</th>
                                                            <th>Created Date</th>

                            
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

module.exports = FontServiceBoxModel