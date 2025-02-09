

const connection = require('../../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');
var fs = require("fs");

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

const formatString = (str) => {
    const words = str?.split('_');
  
    const formattedWords = words?.map((word) => {
      const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      return capitalizedWord;
    });
  
    return formattedWords?.join(' ');
  };

const LeaveApplicationModel = {



    // leave_application_create: async (req, res) => {


    //     try {
    //         const { leave_category, start_date, receiver, whose_leave, end_date, created_by } = req.body;

    //         // Using parameterized query to prevent SQL injection
    //         const insertQuery = 'INSERT INTO leave_application (leave_category, start_date, receiver, whose_leave, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?)';
    //         const [result] = await connection.query(insertQuery, [leave_category, start_date, receiver, whose_leave, end_date, created_by]);

    //         // Sending only the necessary data from the result object
    //         const { insertId, affectedRows } = result;

    //         // Sending response with relevant data
    //         res.status(200).json({ insertId, affectedRows });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Error processing the request' });
    //     }
    // },


    // leave_application_create: async (req, res) => {
    //     try {
    //         const { leave_category, start_date, receiver, whose_leave, end_date, created_by, leave_date } = req.body;

    //         // Using parameterized query to prevent SQL injection
    //         const insertQuery = 'INSERT INTO leave_application (leave_category, start_date, receiver, whose_leave, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?)';
    //         const [result] = await connection.query(insertQuery, [leave_category, start_date, receiver, whose_leave, end_date, created_by]);

    //         // Extracting the insertId from the result
    //         const { insertId, affectedRows } = result;

    //         // Inserting each date in leave_date into the leave_date table
    //         if (Array.isArray(leave_date) && leave_date.length > 0) {
    //             const leaveDateInsertQuery = 'INSERT INTO leave_application_date (leave_application_id, leave_date) VALUES (?, ?)';

    //             for (const leaveDate of leave_date) {
    //                 await connection.query(leaveDateInsertQuery, [insertId, leaveDate]);
    //             }
    //         }

    //         // Sending response with relevant data
    //         res.status(200).json({ insertId, affectedRows });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Error processing the request' });
    //     }
    // },




    leave_category_list: async (req, res) => {
        try {
            const data = "select * from  leave_category";

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

    leave_application_create: async (req, res) => {
        try {
            const { leave_category, start_date, receiver, whose_leave, end_date, created_by, leave_date } = req.body;

            // Start a transaction
            connection.beginTransaction(async (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Failed to start transaction' });
                    return;
                }

                // Using parameterized query to prevent SQL injection
                const insertQuery = 'INSERT INTO leave_application (leave_category, start_date, receiver, whose_leave, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?)';
                const result = [leave_category, start_date, receiver, whose_leave, end_date, created_by];

                connection.query(insertQuery, result, async (err, results) => {
                    if (err) {
                        console.error(err);
                        await connection.rollback(() => {
                            res.status(500).json({ message: 'Leave application creation failed' });
                        });
                        return;
                    }

                    const leaveApplicationId = results.insertId;

                    // Inserting each date in leave_date into the leave_date table
                    if (Array.isArray(leave_date) && leave_date.length > 0) {
                        const leaveDateInsertQuery = 'INSERT INTO leave_application_date (leave_application_id, leave_date) VALUES (?, ?)';

                        for (const leaveDate of leave_date) {
                            connection.query(leaveDateInsertQuery, [leaveApplicationId, leaveDate], (err) => {
                                if (err) {
                                    console.error(err);
                                    connection.rollback(() => {
                                        res.status(500).json({ message: 'Failed to insert leave dates' });
                                    });
                                    return;
                                }
                            });
                        }
                    }

                    // Commit the transaction
                    connection.commit((err) => {
                        if (err) {
                            console.error(err);
                            connection.rollback(() => {
                                res.status(500).json({ message: 'Transaction commit failed' });
                            });
                            return;
                        }

                        // Sending response with relevant data
                        res.status(200).json({ insertId: leaveApplicationId, message: 'Leave application created successfully' });
                    });
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },
    leave_application_approved: async (req, res) => {
        try {
            const leaveApplications = req.body; // Ensure req.body is an array

            // Validate that req.body is an array
            if (!Array.isArray(leaveApplications)) {
                return res.status(400).json({ message: 'Request body must be an array of leave applications' });
            }

            // Using a parameterized query to prevent SQL injection
            const insertQuery = 'INSERT INTO leave_approved (leave_application_id, approved_by, approved_date) VALUES (?, ?, ?)';

            // Array to store the results of each insertion
            const results = [];

            // Using a for loop to iterate over each leave application
            for (let application of leaveApplications) {
                const { leave_application_id, approved_by, approved_date } = application;

                try {
                    const [result] = await connection.query(insertQuery, [leave_application_id, approved_by, approved_date]);

                    // Store the result of each insertion
                    const { insertId, affectedRows } = result;
                    results.push({ insertId, affectedRows });
                } catch (error) {
                    console.error(`Error inserting leave application ID ${leave_application_id}:`, error);
                    results.push({ leave_application_id, error: error.message });
                }
            }

            // Sending response with the array of results
            res.status(200).json(results);
        } catch (error) {
            console.error('Error processing the request:', error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },

    // leave_application_approved: async (req, res) => {
    //     try {
    //         const leaveApplications = req.body; // Ensure req.body is an array

    //         // Validate that req.body is an array
    //         if (!Array.isArray(leaveApplications)) {
    //             return res.status(400).json({ message: 'Request body must be an array of leave applications' });
    //         }

    //         // Using a parameterized query to prevent SQL injection
    //         const insertQuery = 'INSERT INTO leave_approved (leave_application_id, approved_by, approved_date) VALUES (?, ?, ?)';

    //         // Array to store the results of each insertion
    //         const results = [];

    //         // Using a for loop to iterate over each leave application
    //         for (let application of leaveApplications) {
    //             const { leave_application_id, approved_by, approved_date } = application;

    //             const [result] = await connection.query(insertQuery, [leave_application_id, approved_by, approved_date]);

    //             // Store the result of each insertion
    //             const { insertId, affectedRows } = result;
    //             results.push({ insertId, affectedRows });
    //         }

    //         // Sending response with the array of results
    //         res.status(200).json(results);
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Error processing the request' });
    //     }
    // },



    leave_application_list: async (req, res) => {
        try {
            const query = `
                SELECT 
                    leave_application.*,
                    leave_category.name AS leave_category_name,
                    created_by_user.full_name AS created_by_name,
                    receiver_user.full_name AS receiver_name
                FROM 
                    leave_application
                LEFT JOIN 
                    leave_category ON leave_application.leave_category = leave_category.id
                LEFT JOIN 
                    users AS created_by_user ON leave_application.created_by = created_by_user.id
                LEFT JOIN 
                    users AS receiver_user ON leave_application.receiver = receiver_user.id
            `;

            connection.query(query, function (error, result) {
                if (!error) {
                    res.send(result);
                } else {
                    console.log(error);
                    res.status(500).send('Database query error');
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server error');
        }
    },
    
    leave_application_single: async (req, res) => {
        try {
            const query = `
                SELECT la.*, ep.branch_id 
                FROM leave_application la
                JOIN employee_promotion ep ON la.whose_leave = ep.user_id
                WHERE la.id = ?`;
            
            connection.query(query, [req.params.id], (error, result) => {
                if (!error && result.length > 0) {
                    console.log(result);
                    return res.send(result);
                } else {
                    console.log(error || 'Record not found');
                    return res.status(404).json({ message: 'Record not found.' });
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Server error.' });
        }
    },
    

    // leave_application_single: async (req, res) => {
    //     try {
    //         const query = 'SELECT * FROM leave_application WHERE id = ?';
    //         connection.query(query, [req.params.id], (error, result) => {
    //             if (!error && result.length > 0) {
    //                 console.log(result);
    //                 return res.send(result);
    //             } else {
    //                 console.log(error || 'Product not found');
    //                 return res.status(404).json({ message: 'Product not found.' });
    //             }
    //         });
    //     }
    //     catch (error) {
    //         console.log(error)
    //     }
    // },


    leave_application_update: async (req, res) => {
        try {

            const { leave_category, start_date, receiver, whose_leave, end_date, modified_by } = req.body;

            const query = `UPDATE leave_application SET   leave_category = ?, start_date = ?, receiver = ?, whose_leave = ?, end_date = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [leave_category, start_date, receiver, whose_leave, end_date, modified_by, req.params.id], (error, result) => {
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


    leave_application_update_status: async (req, res) => {
        try {

            const { application_status } = req.body;

            const query = `UPDATE leave_application SET  application_status = ? WHERE id = ?`;
            connection.query(query, [application_status, req.params.id], (error, result) => {
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


    leave_application_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM leave_application WHERE id = ?';
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


    leave_application_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            const query = `
            SELECT 
                leave_application.*,
                leave_category.name AS leave_category_name,
                created_by_user.full_name AS created_by_name,
                receiver_user.full_name AS receiver_name,
                whose_leave_user.full_name AS whose_leave_name,
                CASE 
                    WHEN leave_application.application_status = 0 THEN 'pending'
                    WHEN leave_application.application_status = 2 THEN 'approved'
                    WHEN leave_application.application_status = 1 THEN 'rejected'
                    ELSE 'unknown'
                END AS application_status_name
            FROM 
                leave_application
            LEFT JOIN 
                leave_category ON leave_application.leave_category = leave_category.id
            LEFT JOIN 
                users AS created_by_user ON leave_application.created_by = created_by_user.id
            LEFT JOIN 
                users AS receiver_user ON leave_application.receiver = receiver_user.id
            LEFT JOIN 
                users AS whose_leave_user ON leave_application.whose_leave = whose_leave_user.id
            ORDER BY 
                leave_application.id DESC
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


    // leave_application_list_search: async (req, res) => {
    //     try {
    //         console.log("Search button clicked.");

    //         // Extract necessary data from request
    //         const { fromDate, toDate, searchQuery, status } = req.body;

    //         // Construct the base SQL query
    //         let sql = `
    //        SELECT 
    //             leave_application.*,
    //             leave_category.name AS leave_category_name,
    //             created_by_user.full_name AS created_by_name,
    //             receiver_user.full_name AS receiver_name,
    //             whose_leave_user.full_name AS whose_leave_name,
    //             CASE 
    //                 WHEN leave_application.application_status = 0 THEN 'pending'
    //                 WHEN leave_application.application_status = 2 THEN 'approved'
    //                 WHEN leave_application.application_status = 1 THEN 'rejected'
    //                 ELSE 'unknown'
    //             END AS application_status_name
    //         FROM 
    //             leave_application
    //         LEFT JOIN 
    //             leave_category ON leave_application.leave_category = leave_category.id
    //         LEFT JOIN 
    //             users AS created_by_user ON leave_application.created_by = created_by_user.id
    //         LEFT JOIN 
    //             users AS receiver_user ON leave_application.receiver = receiver_user.id
    //         LEFT JOIN 
    //             users AS whose_leave_user ON leave_application.whose_leave = whose_leave_user.id
    //         ORDER BY 
    //             leave_application.id DESC

    //         WHERE 1`;


    //         if (fromDate && toDate) {
    //             sql += ` AND leave_application.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
    //         }

    //         if (searchQuery) {
    //             sql += ` AND leave_application.leave_category = ${searchQuery}`;
    //         }

    //         if (status) {
    //             sql += ` AND leave_application.application_status LIKE '%${status}%'`;
    //         }
    //         // Add invoice ID condition
    //         // if (invoiceId && invoiceId !== '') {
    //         //     sql += ` AND expense.voucher_id LIKE '%${invoiceId}%'`;
    //         // }

    //         // if (itemName) {

    //         //     sql += ` AND LOWER(expense_item.item_name) LIKE '%${itemName}%'`;
    //         // }

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

    // leave_application_list_search: async (req, res) => {
    //     try {
    //         console.log("Search button clicked.");

    //         // Extract necessary data from request
    //         const { fromDate, toDate, searchQuery, status, userGroup } = req.body;

    //         // Construct the base SQL query with placeholders for parameters
    //         let sql = `
    //         SELECT 
    //             leave_application.*,
    //             leave_category.name AS leave_category_name,
    //             created_by_user.full_name AS created_by_name,
    //             receiver_user.full_name AS receiver_name,
    //             whose_leave_user.full_name AS whose_leave_name,
    //             CASE 
    //                 WHEN leave_application.application_status = 0 THEN 'pending'
    //                 WHEN leave_application.application_status = 2 THEN 'approved'
    //                 WHEN leave_application.application_status = 1 THEN 'rejected'
    //                 ELSE 'unknown'
    //             END AS application_status_name
    //         FROM 
    //             leave_application
    //         LEFT JOIN 
    //             leave_category ON leave_application.leave_category = leave_category.id
    //         LEFT JOIN 
    //             users AS created_by_user ON leave_application.created_by = created_by_user.id
    //         LEFT JOIN 
    //             users AS receiver_user ON leave_application.receiver = receiver_user.id
    //         LEFT JOIN 
    //             users AS whose_leave_user ON leave_application.whose_leave = whose_leave_user.id
    //         WHERE 1=1`;

    //         const queryParams = [];

    //         // Add conditions to the SQL query
    //         if (fromDate && toDate) {
    //             sql += ` AND leave_application.created_date BETWEEN ? AND ?`;
    //             queryParams.push(fromDate, toDate);
    //         }

    //         if (searchQuery) {
    //             sql += ` AND leave_application.leave_category = ?`;
    //             queryParams.push(searchQuery);
    //         }

    //         if (status) {
    //             sql += ` AND leave_application.application_status = ?`;
    //             queryParams.push(status);
    //         }

    //         // Append ORDER BY clause at the end
    //         sql += ` ORDER BY leave_application.id DESC`;

    //         console.log("SQL Query:", sql);
    //         console.log("Query Params:", queryParams);

    //         // Execute the constructed SQL query with parameters
    //         connection.query(sql, queryParams, (error, results) => {
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

    leave_application_list_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { fromDate, toDate, searchQuery, status, userGroup, multiSearch } = req.body;

            console.log(userGroup)
            // Construct the base SQL query with placeholders for parameters
            let sql = `
            SELECT 
                leave_application.*,
                leave_category.name AS leave_category_name,
                created_by_user.full_name AS created_by_name,
                receiver_user.full_name AS receiver_name,
                whose_leave_user.full_name AS whose_leave_name,
                designation.designation_name AS designation_name,
                CASE 
                    WHEN leave_application.application_status = 0 THEN 'pending'
                    WHEN leave_application.application_status = 2 THEN 'approved'
                    WHEN leave_application.application_status = 1 THEN 'rejected'
                    ELSE 'unknown'
                END AS application_status_name
            FROM 
                leave_application
            LEFT JOIN 
                leave_category ON leave_application.leave_category = leave_category.id
            LEFT JOIN 
                users AS created_by_user ON leave_application.created_by = created_by_user.id
            LEFT JOIN 
                users AS receiver_user ON leave_application.receiver = receiver_user.id
            LEFT JOIN 
                users AS whose_leave_user ON leave_application.whose_leave = whose_leave_user.id
            LEFT JOIN 
                employee_promotion ON leave_application.whose_leave = employee_promotion.user_id
            LEFT JOIN 
                designation ON employee_promotion.designation_id = designation.id
            WHERE 1=1`;

            const queryParams = [];

            // Add conditions to the SQL query
            if (fromDate && toDate) {
                sql += ` AND leave_application.created_date BETWEEN ? AND ?`;
                queryParams.push(fromDate, toDate);
            }

            if (searchQuery) {
                sql += ` AND leave_application.leave_category = ?`;
                queryParams.push(searchQuery);
            }

            if (status) {
                sql += ` AND leave_application.application_status = ?`;
                queryParams.push(status);
            }

            if (userGroup) {
                sql += ` AND designation.designation_name = ?`;
                queryParams.push(userGroup);
            }
            if (multiSearch && multiSearch.length > 0) {
                sql += ` ORDER BY ${multiSearch}`; // Append convertedData to the ORDER BY clause
            }
            // Append ORDER BY clause at the end
            // sql += ` ORDER BY leave_application.id DESC`;

            console.log("SQL Query:", sql);
            console.log("Query Params:", queryParams);

            // Execute the constructed SQL query with parameters
            connection.query(sql, queryParams, (error, results) => {
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

    leave_application_pdf: async (req, res) => {
        try {
            const { searchResults, selectedColumns, orientation, selectedPrintSize } = req.body; // Assuming selectedColumns is an array of column names

            console.log(searchResults, 'here all the searchResults');
            const statusLabels = {
                1: 'Rejected',
                2: 'Approved',
                0: 'Pending'
            };
            const longTextColumns = ['category_name', 'description'];
            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';
                selectedColumns.forEach(column => {
                    if (column === 'serial') {
                        row += `<td>${index + 1}</td>`; // Displaying index number starting from 1
                    } else if (column === 'action') {
                        // Skip this column
                    }
                    else if (column === 'application_status') {
                        const statusLabel = statusLabels[result[column]] || '';
                        // Get corresponding label from statusLabels object
                        row += `<td>${statusLabel}</td>`;
                    }

                    else if (column === 'receiver') {
                        // Rendering serial number if the column is 'serial'
                    
                        row += `<td>${result.receiver_name}</td>`;

                    }
                    else if (column === 'whose_leave') {
                    
                        row += `<td>${result.whose_leave_name}</td>`;

                    }

                    else if (column === 'created_by') {
                        // Rendering serial number if the column is 'serial'
                        row += `<td>${result.created_by_name}</td>`;
                      
                    }

                    else if (column === 'leave_category') {
                        // Rendering serial number if the column is 'serial'
             
                        row += `<td>${result.leave_category_name}</td>`;
                    }




                    else if (column === 'application_status') {
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
         <h2 style="margin: 0; padding: 0;">Pathshala School & College category List</h2>
         <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
         <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
         <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
         <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">category List</h3>
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
                      ${tableRows}
                  </tbody>
              </table>
          </body>
          </html>`;
          const pdfPageSize = selectedPrintSize === '' ? 'A4' : selectedPrintSize;
          const pdfOrientation = orientation === '' ? 'landscape' : orientation;
            wkhtmltopdf(html, {  pageSize: pdfPageSize, orientation: pdfOrientation  }, (err, stream) => {
                if (err) {
                    console.error('Error generating PDF:', err);
                    res.status(500).send('Error generating PDF');
                    return;
                }
                stream.pipe(res);
            });
        } catch (error) {
            console.error('Error in category_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    }

}

module.exports = LeaveApplicationModel