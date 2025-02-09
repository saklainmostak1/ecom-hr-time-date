

const connection = require('../../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

const PopUpModel = {




    pop_up_size_list: async (req, res) => {
        try {
            const data = "select * from  pop_up_size";

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

    pop_up_animation_list: async (req, res) => {
        try {
            const data = "select * from  pop_up_animation";

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

    pop_up_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM pop_up WHERE id = ?';
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

    pop_up_list: async (req, res) => {
        try {
            const query = `
            SELECT 
                pu.*, 
                u.full_name AS full_name, 
                CASE 
                    WHEN pu.active = 1 THEN 'active'
                    WHEN pu.active = 2 THEN 'inactive'
                    WHEN pu.active = 3 THEN 'pending'
                    ELSE 'unknown'
                END AS status_text
            FROM pop_up pu
            LEFT JOIN users u ON pu.created_by = u.id
            ORDER BY pu.id DESC;
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


    pop_up_create: async (req, res) => {
        try {
            // Destructuring the linkData and formData object received from frontend
            const { linkData, formData } = req.body;

            // Extracting individual values from formData
            const {
                title_en,
                pop_up_type,
                img,
                status,
                description1,
                description,
                pop_up_end_date,
                pop_up_start_date,
                pop_up_size,
                pop_up_animation,
                pop_up_delay,
                pop_up_schedule,
                pop_up_scrollable,
                pop_up_design_id,
                pop_up_align,
                created_by
            } = formData;

            // Preparing values for the INSERT query
            let insertQuery;
            let queryValues = [];

            // Check the pop_up_type value
            if (pop_up_type == "1") {
                // Extracting values from linkData (excluding type and disabled)
                const link1 = linkData.link1 || {};
                const { name, align, value } = link1;

                // If pop_up_type is 1, include linkData values in the insert
                insertQuery = `
                    INSERT INTO pop_up 
                    (title_en, pop_up_schedule, pop_up_type, img, active, body_en, pop_up_end_date, 
                    pop_up_start_date, pop_up_size, pop_up_animation, pop_up_delay, 
                     pop_up_scrollable, pop_up_design_id, pop_up_align, created_by, 
                    btn_name, btn_align, pop_up_link)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                queryValues = [
                    title_en,
                    pop_up_schedule,
                    pop_up_type,
                    img,
                    status,
                    description1,
                    pop_up_end_date,
                    pop_up_start_date,
                    pop_up_size,
                    pop_up_animation,
                    pop_up_delay,
                    pop_up_scrollable,
                    pop_up_design_id,
                    pop_up_align,
                    created_by,
                    name,       // btn_name
                    align,      // btn_align
                    value       // pop_up_link
                ];
            } else if (pop_up_type == "2") {
                // If pop_up_type is 2, skip linkData, img, and description1
                insertQuery = `
                    INSERT INTO pop_up 
                    (title_en, pop_up_schedule, body_en, pop_up_type, active, pop_up_end_date, 
                    pop_up_start_date, pop_up_size, pop_up_animation, pop_up_delay, 
                     pop_up_scrollable, pop_up_design_id, pop_up_align, created_by)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                queryValues = [
                    title_en,
                    pop_up_schedule,
                    description,
                    pop_up_type,
                    status,
                    pop_up_end_date,
                    pop_up_start_date,
                    pop_up_size,
                    pop_up_animation,
                    pop_up_delay,
                    pop_up_scrollable,
                    pop_up_design_id,
                    pop_up_align,
                    created_by
                ];
            }

            // Executing the query with the extracted values
            const result = await connection.query(insertQuery, queryValues);

            // Extracting the relevant data from the query result
            const { insertId, affectedRows } = result;

            // Sending the response with the insertId and affectedRows
            res.status(200).json({ insertId, affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },

    pop_up_update: async (req, res) => {
        try {
            // Destructuring the linkData and formData object received from frontend
            const { linkData, formData } = req.body;


            // Extracting individual values from formData
            const {
                title_en,
                pop_up_type,
                img,
                status,
                description1,
                description,
                pop_up_end_date,
                pop_up_start_date,
                pop_up_size,
                pop_up_animation,
                pop_up_delay,
                pop_up_schedule,
                pop_up_scrollable,
                pop_up_design_id,
                pop_up_align,
                created_by
            } = formData;

            // Preparing values for the UPDATE query
            let updateQuery;
            let queryValues = [];

            // Check the pop_up_type value
            if (pop_up_type == "1") {
                // Extracting values from linkData (excluding type and disabled)
                const link1 = linkData.link1 || {};
                const { name, align, value } = link1;

                // If pop_up_type is 1, include linkData values in the update
                updateQuery = `
                    UPDATE pop_up 
                    SET 
                        title_en = ?, 
                        pop_up_schedule = ?, 
                        pop_up_type = ?, 
                        img = ?, 
                        active = ?, 
                        body_en = ?, 
                        pop_up_end_date = ?, 
                        pop_up_start_date = ?, 
                        pop_up_size = ?, 
                        pop_up_animation = ?, 
                        pop_up_delay = ?, 
                        pop_up_scrollable = ?, 
                        pop_up_design_id = ?, 
                        pop_up_align = ?, 
                        created_by = ?, 
                        btn_name = ?, 
                        btn_align = ?, 
                        pop_up_link = ?
                    WHERE id = ?
                `;
                queryValues = [
                    title_en,
                    pop_up_schedule,
                    pop_up_type,
                    img,
                    status,
                    description1,
                    pop_up_end_date,
                    pop_up_start_date,
                    pop_up_size,
                    pop_up_animation,
                    pop_up_delay,
                    pop_up_scrollable,
                    pop_up_design_id,
                    pop_up_align,
                    created_by,
                    name,       // btn_name
                    align,      // btn_align
                    value,      // pop_up_link
                    req.params.id          // WHERE clause ID
                ];
            } else if (pop_up_type == "2") {
                // If pop_up_type is 2, skip linkData, img, and description1
                updateQuery = `
                    UPDATE pop_up 
                    SET 
                        title_en = ?, 
                        pop_up_schedule = ?, 
                        body_en = ?, 
                        pop_up_type = ?, 
                        active = ?, 
                        pop_up_end_date = ?, 
                        pop_up_start_date = ?, 
                        pop_up_size = ?, 
                        pop_up_animation = ?, 
                        pop_up_delay = ?, 
                        pop_up_scrollable = ?, 
                        pop_up_design_id = ?, 
                        pop_up_align = ?, 
                        created_by = ?
                    WHERE id = ?
                `;
                queryValues = [
                    title_en,
                    pop_up_schedule,
                    description,
                    pop_up_type,
                    status,
                    pop_up_end_date,
                    pop_up_start_date,
                    pop_up_size,
                    pop_up_animation,
                    pop_up_delay,
                    pop_up_scrollable,
                    pop_up_design_id,
                    pop_up_align,
                    created_by,
                    req.params.id              // WHERE clause ID
                ];
            }

            // Executing the query with the extracted values
            const result = await connection.query(updateQuery, queryValues);

            // Extracting the relevant data from the query result
            const { affectedRows } = result;

            // Sending the response with the affectedRows
            res.status(200).json({ affectedRows });
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


    pop_up_single: async (req, res) => {
        try {
            const query = "SELECT * FROM pop_up WHERE id = ?";
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

    pop_up_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);

        try {
            if (isNaN(pageNo) || isNaN(perPage) || pageNo < 1 || perPage < 1) {
                return res.status(400).json({ error: "Invalid pagination parameters" });
            }

            const skipRows = (pageNo - 1) * perPage;

            let query = `
                SELECT pu.*, 
                       users_created.full_name AS created_by,
                       users_modified.full_name AS modified_by,
                       CASE 
                           WHEN pu.active = 1 THEN 'active'
                           WHEN pu.active = 2 THEN 'inactive'
                           WHEN pu.active = 3 THEN 'pending'
                           ELSE 'unknown'
                       END AS status_text 
                FROM pop_up pu
                LEFT JOIN users AS users_created ON pu.created_by = users_created.id 
                LEFT JOIN users AS users_modified ON pu.modified_by = users_modified.id 
                ORDER BY pu.id DESC
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

    pop_up_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { fromDate, toDate, title, status, sort } = req.body;

            // Construct the base SQL query
            let sql = `
                       SELECT pu.*, 
                       users_created.full_name AS created_by,
                       users_modified.full_name AS modified_by,
                       CASE 
                           WHEN pu.active = 1 THEN 'active'
                           WHEN pu.active = 2 THEN 'inactive'
                           WHEN pu.active = 3 THEN 'pending'
                           ELSE 'unknown'
                       END AS status_text 
                FROM pop_up pu
                LEFT JOIN users AS users_created ON pu.created_by = users_created.id 
                LEFT JOIN users AS users_modified ON pu.modified_by = users_modified.id 
            WHERE 1
            `;


            if (fromDate && toDate) {
                sql += ` AND pu.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
            }


            if (sort) {
                sql += ` AND pu.pop_up_delay LIKE '%${sort}%'`;
            }
            if (status) {
                sql += ` AND pu.active LIKE '%${status}%'`;
            }
            // Add invoice ID condition

            if (title) {

                sql += ` AND LOWER(pu.title_en) LIKE '%${title}%'`;
            }

            sql += ` ORDER BY pu.id DESC`

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

    pop_up_list_pdf: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize } = req.body;



            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';
                const imgUrl = result.img
                ? `http://localhost/:5003/${result.img}`
                : 'https://via.placeholder.com/100'; // Fallback for missing images

                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.title_en}</td>`; // Person Name
                row += `<td>${result.pop_up_delay}</td>`; // Person Name
                row += `<td>${result.pop_up_start_date?.slice(0, 10)} ${result.pop_up_end_date?.slice(0, 10)}</td>`; // Person Name
                row += `<td>${result.status_text}</td>`; // Person Name
                row += `<td><img src="${imgUrl}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`; // Person Email
                row += `<td>${result.created_by} ${result.created_date?.slice(0, 10)}</td>`; // Person Name


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
                                                            <th>Pop Up Name</th>
                                                            <th>Pop Up Delay</th>
                                                            <th>Pop Up Start-End</th>
                                                            <th>Status</th>
                                                            <th>Image</th>
                                                            <th>Created  By/Date</th>
                                                           
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



    pop_up_list_print: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize, extraColumnValue } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.title_en}</td>`; // Serial column
                row += `<td>${result.pop_up_delay}</td>`; // Person Name
                row += `<td>${result.pop_up_start_date.slice(0, 10)} ${result.pop_up_end_date.slice(0, 10)}</td>`; // Person Name
                row += `<td>${result.status_text}</td>`; // Person Name
                row += `<td><img src="http://localhost/:5003/${result.img}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`; // Person Email
                row += `<td>${result.created_by} ${result.created_date.slice(0, 10)}</td>`; // Person Name


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
                                                            <th>Pop Up Name</th>
                                                            <th>Pop Up Delay</th>
                                                            <th>Pop Up Start-End</th>
                                                            <th>Status</th>
                                                            <th>Image</th>
                                                            <th>Created  By/Date</th>

                            
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

module.exports = PopUpModel