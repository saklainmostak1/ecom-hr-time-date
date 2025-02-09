

const connection = require('../../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

const CustomPageModel = {




    custom_page_delete: async (req, res) => {

        try {
            // Start a transaction to ensure both deletions happen atomically
            await connection.beginTransaction();
    
            // First, delete from content_block_custom_list where custom_page.id matches content_block_custom_list.content_block
            const deleteContentBlockQuery = 'DELETE FROM content_block_custom_list WHERE content_block_id = ?';
            connection.query(deleteContentBlockQuery, [req.params.id], (error, result) => {
                if (error) {
                    // Rollback transaction in case of error
                    return connection.rollback(() => {
                        console.log(error);
                        return res.status(500).json({ message: 'Error deleting content block.' });
                    });
                }
    
                // Now, delete the custom_page record
                const deleteCustomPageQuery = 'DELETE FROM custom_page WHERE id = ?';
                connection.query(deleteCustomPageQuery, [req.params.id], (error, result) => {
                    if (error || result.affectedRows === 0) {
                        // Rollback transaction in case of error
                        return connection.rollback(() => {
                            console.log(error || 'Custom page not found');
                            return res.status(404).json({ message: 'Custom page not found.' });
                        });
                    }
    
                    // Commit transaction if both deletions were successful
                    connection.commit((commitError) => {
                        if (commitError) {
                            // Rollback transaction in case of commit failure
                            return connection.rollback(() => {
                                console.log(commitError);
                                return res.status(500).json({ message: 'Error committing transaction.' });
                            });
                        }
    
                        // Send the success response
                        console.log('Deletion successful');
                        return res.send({ message: 'Custom page and related content blocks deleted successfully.' });
                    });
                });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    },
    

    custom_page_list: async (req, res) => {
        try {
            const query = `
            SELECT 
                cp.*, 
                u.full_name AS full_name, 
                CASE 
                    WHEN cp.status = 1 THEN 'active'
                    WHEN cp.status = 2 THEN 'inactive'
                    WHEN cp.status = 3 THEN 'pending'
                    ELSE 'unknown'
                END AS status_text
            FROM custom_page cp
            LEFT JOIN users u ON cp.created_by = u.id
            ORDER BY cp.id DESC;
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



    custom_page_one: async (req, res) => {
        try {
            const data = "select * from  custom_page";

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



    // custom_page_create: (req, res) => {
    //     // Destructuring the data received from frontend
    //     const { formData, linkData, linkData1, linkData2, linkData3 } = req.body;
    //     const { value, name, align } = linkData.link1;

    //     // Extracting values from formData
    //     const { title, pop_up_type, summary, description, img, created_by, pop_up_schedule } = formData;

    //     // Using parameterized query to prevent SQL injection for custom_page table
    //     const insertQueryCustomPage = `
    //         INSERT INTO custom_page (title, content_type, summary, description, img, created_by, btn_hide, btn_name, btn_align, title_url)
    //         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    //     `;

    //     // Executing the query for inserting into custom_page using callback
    //     connection.query(insertQueryCustomPage, [
    //         title, pop_up_type, summary, description, img, created_by, pop_up_schedule, name, align, value
    //     ], (err, resultCustomPage) => {
    //         if (err) {
    //             console.error(err);
    //             return res.status(500).json({ message: 'Error processing the request' });
    //         }

    //         // Extracting the inserted custom page ID
    //         const { insertId: contentBlockId, affectedRows } = resultCustomPage;

    //         // Insert multiple rows for linkData1 (multiple links)
    //         if (linkData1) {
    //             const insertQueryLinkData1 = `
    //                 INSERT INTO content_block_custom_list (content_block_id, links_name, links_url)
    //                 VALUES (?, ?, ?)
    //             `;
    //             for (let linkKey in linkData1) {
    //                 const link = linkData1[linkKey];
    //                 const { name, value } = link;
    //                 connection.query(insertQueryLinkData1, [
    //                     contentBlockId, name, value
    //                 ], (err) => {
    //                     if (err) {
    //                         console.error(err);
    //                     }
    //                 });
    //             }
    //         }

    //         // Insert multiple rows for linkData2 (multiple links)
    //         if (linkData2) {
    //             const insertQueryLinkData2 = `
    //                 INSERT INTO content_block_custom_list (content_block_id, links_name, links_url, image)
    //                 VALUES (?, ?, ?, ?)
    //             `;
    //             for (let linkKey in linkData2) {
    //                 const link = linkData2[linkKey];
    //                 const { name, value, file_path } = link;
    //                 connection.query(insertQueryLinkData2, [
    //                     contentBlockId, name, value, file_path
    //                 ], (err) => {
    //                     if (err) {
    //                         console.error(err);
    //                     }
    //                 });
    //             }
    //         }

    //         // Insert multiple rows for linkData3 (multiple links)
    //         if (linkData3) {
    //             const insertQueryLinkData3 = `
    //                 INSERT INTO content_block_custom_list (content_block_id, links_name, links_url, image)
    //                 VALUES (?, ?, ?, ?)
    //             `;
    //             for (let linkKey in linkData3) {
    //                 const link = linkData3[linkKey];
    //                 const { name, value, page_group_icon } = link;
    //                 connection.query(insertQueryLinkData3, [
    //                     contentBlockId, name, value, page_group_icon
    //                 ], (err) => {
    //                     if (err) {
    //                         console.error(err);
    //                     }
    //                 });
    //             }
    //         }

    //         // Send the response with the insertId and affectedRows for custom page
    //         res.status(200).json({ insertId: contentBlockId, affectedRows });
    //     });
    // },

    custom_page_list_all: async (req, res) => {
        try {
            const query = `
                SELECT 
                    cp.id AS custom_page_id,
                    cp.title, 
                    cp.summary, 
                    cp.description, 
                    cp.title_url, 
                    cp.turn_off, 
                    cp.status, 
                    cp.created_by, 
                    cp.modified_by, 
                    cp.created_date, 
                    cp.modified_date, 
                    cp.btn_name, 
                    cp.btn_align, 
                    cp.btn_hide, 
                    cp.content_type, 
                    cp.img,
                    cbcl.id AS content_block_id,
                    cbcl.image AS content_block_image,
                    cbcl.content_block_id AS content_block_custom_id,
                    cbcl.links_url,
                    cbcl.links_name
                FROM 
                    custom_page cp
                LEFT JOIN 
                    content_block_custom_list cbcl 
                ON 
                    cp.id = cbcl.content_block_id
            `;

            connection.query(query, function (error, result) {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Error processing the request', error });
                }

                // Process result to group content_block_custom_list by custom_page
                const groupedResult = result.reduce((acc, row) => {
                    const {
                        custom_page_id,
                        title,
                        summary,
                        description,
                        title_url,
                        turn_off,
                        status,
                        created_by,
                        modified_by,
                        created_date,
                        modified_date,
                        btn_name,
                        btn_align,
                        btn_hide,
                        content_type,
                        img,
                        content_block_id,
                        content_block_image,
                        content_block_custom_id,
                        links_url,
                        links_name
                    } = row;

                    // Check if the custom_page already exists in the accumulator
                    if (!acc[custom_page_id]) {
                        acc[custom_page_id] = {
                            id: custom_page_id,
                            title,
                            summary,
                            description,
                            title_url,
                            turn_off,
                            status,
                            created_by,
                            modified_by,
                            created_date,
                            modified_date,
                            btn_name,
                            btn_align,
                            btn_hide,
                            content_type,
                            img,
                            content_block_list: []
                        };
                    }

                    // Add content_block_custom_list entry if it exists
                    if (content_block_id) {
                        acc[custom_page_id].content_block_list.push({
                            id: content_block_id,
                            image: content_block_image,
                            content_block_id: content_block_custom_id,
                            links_url,
                            links_name
                        });
                    }

                    return acc;
                }, {});

                // Convert grouped result object to an array
                const response = Object.values(groupedResult);
                res.status(200).json(response);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error', error });
        }
    },

    custom_page_list_single: async (req, res) => {
        try {
            const { id } = req.params; // Extract `id` from request parameters
    
            const query = `
                SELECT 
                    cp.id AS custom_page_id,
                    cp.title, 
                    cp.summary, 
                    cp.description, 
                    cp.title_url, 
                    cp.turn_off, 
                    cp.status, 
                    cp.created_by, 
                    cp.modified_by, 
                    cp.created_date, 
                    cp.modified_date, 
                    cp.btn_name, 
                    cp.btn_align, 
                    cp.btn_hide, 
                    cp.content_type, 
                    cp.img,
                    cbcl.id AS content_block_id,
                    cbcl.image AS content_block_image,
                    cbcl.content_block_id AS content_block_custom_id,
                    cbcl.links_url,
                    cbcl.links_name
                FROM 
                    custom_page cp
                LEFT JOIN 
                    content_block_custom_list cbcl 
                ON 
                    cp.id = cbcl.content_block_id
                WHERE 
                    cp.id = ?
            `;
    
            connection.query(query, [id], function (error, result) {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Error processing the request', error });
                }
    
                if (result.length === 0) {
                    return res.status(404).json({ message: 'No record found for the given ID' });
                }
    
                // Process result to group content_block_custom_list by custom_page
                const groupedResult = result.reduce((acc, row) => {
                    const {
                        custom_page_id,
                        title,
                        summary,
                        description,
                        title_url,
                        turn_off,
                        status,
                        created_by,
                        modified_by,
                        created_date,
                        modified_date,
                        btn_name,
                        btn_align,
                        btn_hide,
                        content_type,
                        img,
                        content_block_id,
                        content_block_image,
                        content_block_custom_id,
                        links_url,
                        links_name
                    } = row;
    
                    // Check if the custom_page already exists in the accumulator
                    if (!acc[custom_page_id]) {
                        acc[custom_page_id] = {
                            id: custom_page_id,
                            title,
                            summary,
                            description,
                            title_url,
                            turn_off,
                            status,
                            created_by,
                            modified_by,
                            created_date,
                            modified_date,
                            btn_name,
                            btn_align,
                            btn_hide,
                            content_type,
                            img,
                            content_block_list: []
                        };
                    }
    
                    // Add content_block_custom_list entry if it exists
                    if (content_block_id) {
                        acc[custom_page_id].content_block_list.push({
                            id: content_block_id,
                            image: content_block_image,
                            content_block_id: content_block_custom_id,
                            links_url,
                            links_name
                        });
                    }
    
                    return acc;
                }, {});
    
                // Convert grouped result object to an array
                const response = Object.values(groupedResult)[0]; // Only one record since we're filtering by ID
                res.status(200).json(response);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error', error });
        }
    },
    

    custom_page_create: (req, res) => {
        const { formData, linkData, linkData1, linkData2, linkData3 } = req.body;
        const { title, pop_up_type, summary, description, img, created_by, pop_up_schedule } = formData;

        let insertQueryCustomPage = '';
        let queryParams = [];

        // Define query and parameters based on pop_up_type
        if (pop_up_type == 1) {
            insertQueryCustomPage = `
                INSERT INTO custom_page (title, content_type, summary, description, img, created_by, btn_hide, btn_name, btn_align, title_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const { name, value, align } = linkData?.link1 || {};
            queryParams = [title, pop_up_type, summary, description, img, created_by, pop_up_schedule, name, align, value];
        } else if (['2', '3', '4'].includes(pop_up_type)) {
            insertQueryCustomPage = `
                INSERT INTO custom_page (title, content_type)
                VALUES (?, ?)
            `;
            queryParams = [title, pop_up_type];
        } else {
            return res.status(400).json({ message: 'Invalid pop_up_type' });
        }

        // Execute the custom_page query
        connection.query(insertQueryCustomPage, queryParams, (err, resultCustomPage) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error processing the request' });
            }

            const { insertId: contentBlockId, affectedRows } = resultCustomPage;

            // Define a reusable function for link data insertion
            const insertLinkData = (data, query) => {
                for (let key in data) {
                    const { name, value, file_path, page_group_icon } = data[key];
                    const params = [contentBlockId, name, value, file_path || page_group_icon || null];
                    connection.query(query, params, (err) => {
                        if (err) console.error(err);
                    });
                }
            };

            // Insert linkData based on pop_up_type
            if (pop_up_type == 2 && linkData1) {
                const query = `
                    INSERT INTO content_block_custom_list (content_block_id, links_name, links_url)
                    VALUES (?, ?, ?)
                `;
                insertLinkData(linkData1, query);
            }

            if (pop_up_type == 3 && linkData2) {
                const query = `
                    INSERT INTO content_block_custom_list (content_block_id, links_name, links_url, image)
                    VALUES (?, ?, ?, ?)
                `;
                insertLinkData(linkData2, query);
            }

            if (pop_up_type == 4 && linkData3) {
                const query = `
                    INSERT INTO content_block_custom_list (content_block_id, links_name, links_url, image)
                    VALUES (?, ?, ?, ?)
                `;
                insertLinkData(linkData3, query);
            }

            // Send the response
            res.status(200).json({ insertId: contentBlockId, affectedRows });
        });
    },


    custom_page_update: (req, res) => {
        const { formData, linkData, linkData1, linkData2, linkData3 } = req.body;
        const { title, pop_up_type, summary, description, img, created_by, pop_up_schedule } = formData;
        const pageId = req.params.id;  // Get the id from the URL params
    
        // Ensure the ID is provided
        if (!pageId) {
            return res.status(400).json({ message: 'ID is required for updating the page' });
        }
    
        let queryParams = [];
        let updateQueryCustomPage = '';
    
        // Define the update query and parameters based on pop_up_type
        if (pop_up_type == 1) {
            updateQueryCustomPage = `
                UPDATE custom_page
                SET title = ?, content_type = ?, summary = ?, description = ?, img = ?, created_by = ?, btn_hide = ?, btn_name = ?, btn_align = ?, title_url = ?
                WHERE id = ?
            `;
            const { name, value, align } = linkData?.link1 || {};
            queryParams = [title, pop_up_type, summary, description, img, created_by, pop_up_schedule, name, align, value, pageId];
        } else if ([2, 3, 4].includes(pop_up_type)) {
            updateQueryCustomPage = `
                UPDATE custom_page
                SET title = ?, content_type = ?
                WHERE id = ?
            `;
            queryParams = [title, pop_up_type, pageId];
        } else {
            return res.status(400).json({ message: 'Invalid pop_up_type' });
        }
    
        // Execute the update query
        connection.query(updateQueryCustomPage, queryParams, (err, resultCustomPage) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error processing the request' });
            }
    
            const { affectedRows } = resultCustomPage;
    
            // Define a reusable function for link data insertion
            const insertLinkData = (data, query) => {
                for (let key in data) {
                    const { name, value, file_path, page_group_icon } = data[key];
                    const params = [pageId, name, value, file_path || page_group_icon || null];
                    connection.query(query, params, (err) => {
                        if (err) console.error(err);
                    });
                }
            };
    
            // Delete existing links in content_block_custom_list for this content_block_id
            const deleteLinksQuery = `DELETE FROM content_block_custom_list WHERE content_block_id = ?`;
            connection.query(deleteLinksQuery, [pageId], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error deleting existing link data' });
                }
    
                // Insert linkData based on pop_up_type
                if (pop_up_type == 2 && linkData1) {
                    const query = `
                        INSERT INTO content_block_custom_list (content_block_id, links_name, links_url)
                        VALUES (?, ?, ?)
                    `;
                    insertLinkData(linkData1, query);
                }
    
                if (pop_up_type == 3 && linkData2) {
                    const query = `
                        INSERT INTO content_block_custom_list (content_block_id, links_name, links_url, image)
                        VALUES (?, ?, ?, ?)
                    `;
                    insertLinkData(linkData2, query);
                }
    
                if (pop_up_type == 4 && linkData3) {
                    const query = `
                        INSERT INTO content_block_custom_list (content_block_id, links_name, links_url, image)
                        VALUES (?, ?, ?, ?)
                    `;
                    insertLinkData(linkData3, query);
                }
    
                // Send the response
                res.status(200).json({ affectedRows });
            });
        });
    },
    



    custom_page_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);

        try {
            if (isNaN(pageNo) || isNaN(perPage) || pageNo < 1 || perPage < 1) {
                return res.status(400).json({ error: "Invalid pagination parameters" });
            }

            const skipRows = (pageNo - 1) * perPage;

            let query = `
                SELECT cp.*, 
                       users_created.full_name AS created_by,
                       users_modified.full_name AS modified_by,
                       CASE 
                           WHEN cp.status = 1 THEN 'active'
                           WHEN cp.status = 2 THEN 'inactive'
                           WHEN cp.status = 3 THEN 'pending'
                           ELSE 'unknown'
                       END AS status_text 
                FROM custom_page cp
                LEFT JOIN users AS users_created ON cp.created_by = users_created.id 
                LEFT JOIN users AS users_modified ON cp.modified_by = users_modified.id 
                ORDER BY cp.id Desc
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

    custom_page_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { fromDate, toDate, title, sort } = req.body;

            // Construct the base SQL query
            let sql = `
                       SELECT cp.*, 
                       users_created.full_name AS created_by,
                       users_modified.full_name AS modified_by,
                       CASE 
                           WHEN cp.status = 1 THEN 'active'
                           WHEN cp.status = 2 THEN 'inactive'
                           WHEN cp.status = 3 THEN 'pending'
                           ELSE 'unknown'
                       END AS status_text 
                FROM custom_page cp
                LEFT JOIN users AS users_created ON cp.created_by = users_created.id 
                LEFT JOIN users AS users_modified ON cp.modified_by = users_modified.id 
            WHERE 1
            `;


            if (fromDate && toDate) {
                sql += ` AND cp.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
            }


            if (sort) {
                sql += ` AND cp.content_type LIKE '%${sort}%'`;
            }
          
            // Add invoice ID condition

            if (title) {

                sql += ` AND LOWER(cp.title) LIKE '%${title}%'`;
            }

            sql += ` ORDER BY cp.id DESC`

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


    custome_page_list_pdf: async (req, res) => {
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
                row += `<td>${result.title}</td>`; // Person Name
                row += `<td>${result.content_type == 1 ? 'Block & Custom Page' :
                    result.content_type == 2 ? 'Only Block Link List' :
                    result.content_type == 3 ? 'Image Block List' :
                    result.content_type == 4 ? 'Icon Block List' : ''}</td>`; // Person Name
                row += `<td><img src="${imgUrl}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`; // Person Email
                row += `<td>${result.created_by}</td>`; // Person Name
                row += `<td>${result.created_date.slice(0, 10)}</td>`; // Person Name


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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Custom Page List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Custom Page List</h3>
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
                                                            <th>Content Type</th>
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



    custom_page_list_print: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize, extraColumnValue } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';


                const imgUrl = result.img
                ? `http://localhost/:5003/${result.img}`
                : 'https://via.placeholder.com/100'; // Fallback for missing images

                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.title}</td>`; // Person Name
                row += `<td>${result.content_type == 1 ? 'Block & Custom Page' :
                    result.content_type == 2 ? 'Only Block Link List' :
                    result.content_type == 3 ? 'Image Block List' :
                    result.content_type == 4 ? 'Icon Block List' : ''}</td>`; // Person Name
                row += `<td><img src="${imgUrl}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`; // Person Email
                row += `<td>${result.created_by}</td>`; // Person Name
                row += `<td>${result.created_date.slice(0, 10)}</td>`; // Person Name

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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Custom Page List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Custom Page List</h3>
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
                                                            <th>Content Type</th>
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

module.exports = CustomPageModel









