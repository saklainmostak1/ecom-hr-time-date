const connection = require('../../../../connection/config/database')

const smsApiModel = {

    // create_sms_api: async (req, res) => {
    //     try {
    //         const {
    //             balance_url,
    //             balance_param,
    //             balance_rate,
    //             branch_name,
    //             sms_api_params,
    //             main_url,
    //             api_url,
    //             created_by,
    //             status_url,
    //             api_name,
    //             method_name,
    //             api_type

    //         } = req.body;

    //         // Assuming you have a connection object already defined
    //         connection.beginTransaction();

    //         const userQuery = `INSERT INTO sms_api (user_id, main_url, balance_url, balance_param, status_url, sms_msg_check, balance_rate, api_url, branch_name, api_name, method_name , api_type, created_by) 
    //                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    //         const userParams = [created_by, main_url, balance_url, balance_param, status_url, 1, balance_rate, api_url, branch_name, api_name, method_name, api_type, created_by];

    //         connection.query(userQuery, userParams, async (err, results) => {
    //             if (err) {
    //                 console.error(err);
    //                 await connection.rollback();
    //                 res.status(500).json({ message: 'User creation failed' });
    //                 return;
    //             }

    //             try {

    //                 const user_id = results.insertId;

    //                 // Insert into educational_qualification table
    //                 for (const qualification of sms_api_params) {
    //                     const { api_key, api_value, options } = qualification;
    //                     const eduQualificationQuery = `INSERT INTO sms_api_param (sms_api_id, sms_key, sms_value, options) 
    //                                                 VALUES (?, ?, ?, ?)`;
    //                     const eduQualificationParams = [user_id, api_key, api_value, options];
    //                     await connection.query(eduQualificationQuery, eduQualificationParams);
    //                 }

    //                 // New addition: Insert into employee_promotion table


    //                 res.status(200).json({ message: 'User created successfully' });
    //             } catch (error) {
    //                 console.error("Error inserting additional data:", error);
    //                 await connection.rollback();
    //                 res.status(500).json({ message: "Error inserting additional data." });
    //             }
    //         });

    //     } catch (error) {
    //         console.error("Error inserting data:", error);
    //         await connection.rollback();
    //         res.status(500).json({ message: "Error inserting data." });
    //     }
    // },

    create_sms_api: async (req, res) => {
        try {
            const {
                balance_url,
                balance_param,
                balance_rate,
                branch_name,
                sms_api_params,
                main_url,
                api_url,
                created_by,
                status_url,
                api_name,
                method_name,
                api_type
            } = req.body;

            // Begin transaction
            connection.beginTransaction(async (err) => {
                if (err) {
                    console.error('Failed to start transaction:', err);
                    res.status(500).json({ message: 'Failed to start transaction' });
                    return;
                }

                try {
                    // If the status_url is 1, update all previous rows with status_url = 1 to 2
                    if (status_url === '1') {
                        const updateStatusUrlQuery = `UPDATE sms_api SET status_url = 2 WHERE status_url = 1`;
                        await connection.query(updateStatusUrlQuery); // Update all previous rows with 1 to 2
                    }

                    // Insert the new sms_api row
                    const userQuery = `
                        INSERT INTO sms_api (
                            user_id, main_url, balance_url, balance_param, status_url, 
                            sms_msg_check, balance_rate, api_url, branch_name, api_name, 
                            method_name, api_type, created_by
                        ) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    const userParams = [
                        created_by, main_url, balance_url, balance_param, status_url,
                        1, balance_rate, api_url, branch_name, api_name, method_name,
                        api_type, created_by
                    ];

                    connection.query(userQuery, userParams, async (err, results) => {
                        if (err) {
                            console.error(err);
                            await connection.rollback();
                            res.status(500).json({ message: 'Failed to insert sms_api' });
                            return;
                        }

                        const user_id = results.insertId;

                        // Insert the sms_api_param data
                        for (const param of sms_api_params) {
                            const { api_key, api_value, options } = param;
                            const paramQuery = `
                                INSERT INTO sms_api_param (sms_api_id, sms_key, sms_value, options) 
                                VALUES (?, ?, ?, ?)
                            `;
                            const paramParams = [user_id, api_key, api_value, options];
                            await connection.query(paramQuery, paramParams);
                        }

                        // Commit the transaction
                        connection.commit((err) => {
                            if (err) {
                                console.error('Commit failed:', err);
                                return connection.rollback(() => {
                                    res.status(500).json({ message: 'Transaction failed. Rollback performed.' });
                                });
                            }
                            res.status(200).json({ message: 'SMS API created successfully' });
                        });
                    });
                } catch (error) {
                    console.error('Error during transaction:', error);
                    await connection.rollback();
                    res.status(500).json({ message: 'Transaction failed. Rollback performed.' });
                }
            });
        } catch (error) {
            console.error('Error creating SMS API:', error);
            res.status(500).json({ message: 'Error creating SMS API' });
        }
    },



    sms_api_list: async (req, res) => {
        try {
            // SQL query to join sms_api and sms_api_param based on matching ids
            const data = `
                SELECT 
                    sms_api.*, 
                    sms_api_param.id AS param_id, 
                    sms_api_param.sms_key, 
                    sms_api_param.sms_value, 
                    sms_api_param.options 
                FROM 
                    sms_api 
                LEFT JOIN 
                    sms_api_param 
                ON 
                    sms_api.id = sms_api_param.sms_api_id
                ORDER BY 
                    sms_api.id DESC
            `;

            connection.query(data, function (error, result) {
                if (!error) {
                    // Create a map to store sms_api entries with their corresponding sms_api_params
                    const apiMap = {};

                    // Iterate over the results and organize data
                    result.forEach(row => {
                        // Check if the sms_api already exists in the map
                        if (!apiMap[row.id]) {
                            // If it doesn't exist, initialize it with sms_api data
                            apiMap[row.id] = {
                                id: row.id,
                                user_id: row.user_id,
                                api_name: row.api_name,
                                method_name: row.method_name,
                                main_url: row.main_url,
                                balance_url: row.balance_url,
                                balance_param: row.balance_param,
                                status_url: row.status_url,
                                status: row.status_url === '1' ? 'active' : (row.status_url === '2' ? 'inactive' : row.status_url === '3' ? 'Pending' : row.status_url),
                                sms_msg_check: row.sms_msg_check,
                                balance_rate: row.balance_rate,
                                created_by: row.created_by,
                                created_date: row.created_date,
                                modified_by: row.modified_by,
                                modified_date: row.modified_date,
                                api_url: row.api_url,
                                sms_api_params: [] // Initialize an empty array for params
                            };
                        }

                        // If the current row has a corresponding sms_api_param, add it to the sms_api_params array
                        if (row.param_id) {
                            apiMap[row.id].sms_api_params.push({
                                id: row.param_id,
                                sms_api_id: row.id,
                                sms_key: row.sms_key,
                                sms_value: row.sms_value,
                                options: row.options
                            });
                        }
                    });

                    // Convert the map to an array of sms_api objects
                    const apiList = Object.values(apiMap);

                    // Send the structured data as a response
                    res.send(apiList);
                } else {
                    console.log(error);
                    res.status(500).send('Error occurred while fetching data');
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    },

    sms_api_list_single: async (req, res) => {
        try {
            // Get the sms_api.id from the request parameters or query
            const apiId = req.params.id || req.query.id;

            if (!apiId) {
                return res.status(400).send('API ID is required');
            }

            // SQL query to join sms_api and sms_api_param based on matching ids and filter by specific sms_api.id
            const data = `
                SELECT 
                    sms_api.*, 
                    sms_api_param.id AS param_id, 
                    sms_api_param.sms_key, 
                    sms_api_param.sms_value, 
                    sms_api_param.options 
                FROM 
                    sms_api 
                LEFT JOIN 
                    sms_api_param 
                ON 
                    sms_api.id = sms_api_param.sms_api_id
                WHERE 
                    sms_api.id = ?
            `;

            connection.query(data, [apiId], function (error, result) {
                if (!error) {
                    // Create a map to store the single sms_api entry with its corresponding sms_api_params
                    const apiMap = {};

                    // Iterate over the results and organize data
                    result.forEach(row => {
                        // Initialize entry if not already present in the map
                        if (!apiMap[row.id]) {
                            apiMap[row.id] = {
                                id: row.id,
                                user_id: row.user_id,
                                main_url: row.main_url,
                                balance_url: row.balance_url,
                                balance_param: row.balance_param,
                                status_url: row.status_url,
                                status: row.status_url === '1' ? 'active' : (row.status_url === '2' ? 'inactive' : (row.status_url === '3' ? 'Pending' : row.status_url)),
                                sms_msg_check: row.sms_msg_check,
                                balance_rate: row.balance_rate,
                                created_by: row.created_by,
                                created_date: row.created_date,
                                modified_by: row.modified_by,
                                modified_date: row.modified_date,
                                api_name: row.api_name,
                                method_name: row.method_name,
                                api_url: row.api_url,
                                branch_name: row.branch_name,
                                api_type: row.api_type,
                                sms_api_params: [] // Initialize an empty array for params
                            };
                        }

                        // If the current row has a corresponding sms_api_param, add it to the sms_api_params array
                        if (row.param_id) {
                            apiMap[row.id].sms_api_params.push({
                                id: row.param_id,
                                sms_api_id: row.id,
                                sms_key: row.sms_key,
                                sms_value: row.sms_value,
                                options: row.options
                            });
                        }
                    });

                    // Convert the map to an array (will have only one item) and send the response
                    const apiList = Object.values(apiMap);
                    res.send(apiList);
                } else {
                    console.log(error);
                    res.status(500).send('Error occurred while fetching data');
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    },


    sms_api_delete: async (req, res) => {
        try {
            // Get the sms_api.id from the request parameters or query
            const apiId = req.params.id || req.query.id;

            if (!apiId) {
                return res.status(400).send('API ID is required');
            }

            // Start a transaction
            connection.beginTransaction(function (err) {
                if (err) {
                    return res.status(500).send('Error starting transaction');
                }

                // First, delete from sms_api_param
                const deleteParamsQuery = 'DELETE FROM sms_api_param WHERE sms_api_id = ?';
                connection.query(deleteParamsQuery, [apiId], function (error) {
                    if (error) {
                        return connection.rollback(function () {
                            console.log(error);
                            res.status(500).send('Error occurred while deleting SMS API parameters');
                        });
                    }

                    // Then, delete from sms_api
                    const deleteApiQuery = 'DELETE FROM sms_api WHERE id = ?';
                    connection.query(deleteApiQuery, [apiId], function (error) {
                        if (error) {
                            return connection.rollback(function () {
                                console.log(error);
                                res.status(500).send('Error occurred while deleting SMS API');
                            });
                        }

                        // Commit the transaction
                        connection.commit(function (err) {
                            if (err) {
                                return connection.rollback(function () {
                                    console.log(err);
                                    res.status(500).send('Error committing transaction');
                                });
                            }
                            res.json('SMS API and its parameters deleted successfully');
                        });
                    });
                });
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    },


    // sms_api_update: async (req, res) => {
    //     try {

    //         const employeeId = req.params.id; // Assuming the ID is passed as a parameter
    //         const {
    //             modified_by,
    //             balance_url,
    //             balance_param,
    //             balance_rate,
    //             api_name,
    //             main_url,
    //             api_url,
    //             method_name,
    //             api_type,
    //             status_url,
    //             sms_api_params,
    //             branch_name,

    //         } = req.body;



    //         // Begin transaction
    //         connection.beginTransaction(async (err) => {
    //             if (err) {
    //                 console.error(err);
    //                 res.status(500).json({ message: 'Failed to start transaction' });
    //                 return;
    //             }

    //             try {
    //                 // Query to delete existing educational qualifications
    //                 const deleteEducationQuery = `
    //                     DELETE FROM sms_api_param 
    //                     WHERE sms_api_id = ?
    //                 `;
    //                 await connection.query(deleteEducationQuery, [employeeId]);

    //                 // Query to insert new educational qualifications
    //                 const insertEducationQuery = `
    //                     INSERT INTO sms_api_param (sms_api_id, sms_key, sms_value, options)
    //                     VALUES (?, ?, ?, ?)
    //                 `;

    //                 // Insert new qualifications
    //                 for (const qualification of sms_api_params) {
    //                     const { sms_key, sms_value, options } = qualification;
    //                     const insertEducationParams = [employeeId, sms_key, sms_value, options];
    //                     await connection.query(insertEducationQuery, insertEducationParams);
    //                 }

    //                 // Update other employee information (experience, addresses, joining details, promotion)


    //                 const updateLivingAddressQuery = `
    //                     UPDATE sms_api 
    //                     SET balance_url = ?, balance_param = ?, balance_rate = ?, main_url = ?, api_url = ?, status_url = ?, api_name = ?, method_name = ?, api_type = ?, branch_name = ?, modified_by = ?
    //                     WHERE id = ?;
    //                 `;
    //                 await connection.query(updateLivingAddressQuery, [
    //                     balance_url,
    //                     balance_param,
    //                     balance_rate,
    //                     main_url,
    //                     api_url,
    //                     status_url, api_name, method_name, api_type, branch_name, modified_by, employeeId]);

    //                 // Commit the transaction
    //                 connection.commit((err) => {
    //                     if (err) {
    //                         console.error(err);
    //                         return connection.rollback(() => {
    //                             res.status(500).json({ message: 'Transaction failed. Rollback performed.' });
    //                         });
    //                     }
    //                     res.status(200).json({ message: 'Employee data updated successfully' });
    //                 });
    //             } catch (error) {
    //                 console.error('Error during transaction:', error);
    //                 connection.rollback(() => {
    //                     res.status(500).json({ message: 'Transaction failed. Rollback performed.' });
    //                 });
    //             }
    //         });
    //     } catch (error) {
    //         console.error('Error updating employee data:', error);
    //         res.status(500).json({ message: 'Error updating employee data' });
    //     }
    // },


    sms_api_update: async (req, res) => {
        try {
            const employeeId = req.params.id; // Assuming the ID is passed as a parameter
            const {
                modified_by,
                balance_url,
                balance_param,
                balance_rate,
                api_name,
                main_url,
                api_url,
                method_name,
                api_type,
                status_url,  // Assume this will be passed and it will either be 1 or 2
                sms_api_params,
                branch_name,
            } = req.body;

            // Begin transaction
            connection.beginTransaction(async (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Failed to start transaction' });
                    return;
                }

                try {
                    // First, update all records to set status_url = 2 if status_url = 1 is being set for this row
                    if (status_url === '1') {
                        const updateStatusUrlQuery = `UPDATE sms_api SET status_url = 2 WHERE status_url = 1`;
                        await connection.query(updateStatusUrlQuery); // Update all previous records with 1 to 2
                    }

                    // Delete existing sms_api_param for the employee
                    const deleteParamsQuery = `
                        DELETE FROM sms_api_param 
                        WHERE sms_api_id = ?
                    `;
                    await connection.query(deleteParamsQuery, [employeeId]);

                    // Insert new sms_api_param records
                    const insertParamsQuery = `
                        INSERT INTO sms_api_param (sms_api_id, sms_key, sms_value, options)
                        VALUES (?, ?, ?, ?)
                    `;

                    for (const param of sms_api_params) {
                        const { sms_key, sms_value, options } = param;
                        const insertParams = [employeeId, sms_key, sms_value, options];
                        await connection.query(insertParamsQuery, insertParams);
                    }

                    // Update other information in the sms_api table
                    const updateSmsApiQuery = `
                        UPDATE sms_api 
                        SET balance_url = ?, balance_param = ?, balance_rate = ?, main_url = ?, api_url = ?, status_url = ?, api_name = ?, method_name = ?, api_type = ?, branch_name = ?, modified_by = ?
                        WHERE id = ?
                    `;

                    await connection.query(updateSmsApiQuery, [
                        balance_url,
                        balance_param,
                        balance_rate,
                        main_url,
                        api_url,
                        status_url,  // The value passed in the body
                        api_name,
                        method_name,
                        api_type,
                        branch_name,
                        modified_by,
                        employeeId,
                    ]);

                    // Commit the transaction
                    connection.commit((err) => {
                        if (err) {
                            console.error(err);
                            return connection.rollback(() => {
                                res.status(500).json({ message: 'Transaction failed. Rollback performed.' });
                            });
                        }
                        res.status(200).json({ message: 'Employee data updated successfully' });
                    });
                } catch (error) {
                    console.error('Error during transaction:', error);
                    connection.rollback(() => {
                        res.status(500).json({ message: 'Transaction failed. Rollback performed.' });
                    });
                }
            });
        } catch (error) {
            console.error('Error updating employee data:', error);
            res.status(500).json({ message: 'Error updating employee data' });
        }
    },

    getSmsSettings: async (req, res) => {
        try {
            const data = "select * from  sms_settings";

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


    // all_table_data: async (req, res) => {
    //     const {table_name} = req.body
    //     try {
    //         const data = `select * from  ${table_name}`;

    //         connection.query(data, function (error, result) {
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
    // all_table_list: async (req, res) => {
    //     try {
    //         // First, get all table names
    //         const getTablesQuery = `SHOW TABLES FROM hr_allowance;`;

    //         connection.query(getTablesQuery, (error, tables) => {
    //             if (error) {
    //                 console.log(error);
    //                 return res.status(500).send('Error retrieving table names');
    //             }

    //             const tableNames = tables.map(table => Object.values(table)[0]); // Extract table names
    //             const columnPromises = tableNames.map(tableName => {
    //                 return new Promise((resolve, reject) => {
    //                     const getColumnsQuery = `SHOW COLUMNS FROM hr_allowance.${tableName};`;

    //                     connection.query(getColumnsQuery, (error, columns) => {
    //                         if (error) {
    //                             return reject(error);
    //                         }
    //                         const columnNames = columns.map(column => column.Field); // Extract column names
    //                         resolve({ table_name: tableName, all_column_name: columnNames });
    //                     });
    //                 });
    //             });

    //             Promise.all(columnPromises)
    //                 .then(results => {
    //                     res.send(results); // Send array of tables with their columns
    //                 })
    //                 .catch(err => {
    //                     console.log(err);
    //                     res.status(500).send('Error retrieving column names');
    //                 });
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).send('Internal server error');
    //     }
    // },

    // all_table_list: async (req, res) => {
    //     try {
    //       // First, get all table names
    //       const getTablesQuery = `SHOW TABLES FROM hr_allowance;`;

    //       connection.query(getTablesQuery, (error, tables) => {
    //         if (error) {
    //           console.log(error);
    //           return res.status(500).send('Error retrieving table names');
    //         }

    //         const tableNames = tables.map(table => Object.values(table)[0]); // Extract table names
    //         const columnPromises = tableNames.map(tableName => {
    //           return new Promise((resolve, reject) => {
    //             const getColumnsQuery = `SHOW COLUMNS FROM hr_allowance.${tableName};`;

    //             connection.query(getColumnsQuery, (error, columns) => {
    //               if (error) {
    //                 return reject(error);
    //               }
    //               const columnNames = columns.map(column => column.Field); // Extract column names
    //               resolve({ table_name: tableName, all_column_name: columnNames.join(', ') }); // Join column names
    //             });
    //           });
    //         });

    //         Promise.all(columnPromises)
    //           .then(results => {
    //             const insertPromises = results.map(({ table_name, all_column_name }) => {
    //               return new Promise((resolve, reject) => {
    //                 // Check if the table already exists in module_settings
    //                 const checkQuery = `SELECT * FROM module_settings WHERE table_name = ?;`;

    //                 connection.query(checkQuery, [table_name], (error, existing) => {
    //                   if (error) {
    //                     return reject(error);
    //                   }

    //                   // If the table doesn't exist, insert it
    //                   if (existing.length === 0) {
    //                     const insertQuery = `INSERT INTO module_settings (table_name, all_column_name) VALUES (?, ?);`;

    //                     connection.query(insertQuery, [table_name, all_column_name], (error) => {
    //                       if (error) {
    //                         return reject(error);
    //                       }
    //                       resolve();
    //                     });
    //                   } else {
    //                     // If it exists, resolve without inserting
    //                     resolve();
    //                   }
    //                 });
    //               });
    //             });

    //             // Wait for all insertions to finish
    //             Promise.all(insertPromises)
    //               .then(() => res.send('All tables processed successfully.'))
    //               .catch(err => {
    //                 console.log(err);
    //                 res.status(500).send('Error inserting data into module_settings');
    //               });
    //           })
    //           .catch(err => {
    //             console.log(err);
    //             res.status(500).send('Error retrieving column names');
    //           });
    //       });
    //     } catch (error) {
    //       console.log(error);
    //       res.status(500).send('Internal server error');
    //     }
    //   },

    all_table_list: async (req, res) => {
        try {
            // First, get all table names
            const getTablesQuery = `SHOW TABLES FROM hr_allowance;`;

            connection.query(getTablesQuery, (error, tables) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send('Error retrieving table names');
                }

                const tableNames = tables.map(table => Object.values(table)[0]); // Extract table names
                const columnPromises = tableNames.map(tableName => {
                    return new Promise((resolve, reject) => {
                        const getColumnsQuery = `SHOW COLUMNS FROM hr_allowance.${tableName};`;

                        connection.query(getColumnsQuery, (error, columns) => {
                            if (error) {
                                return reject(error);
                            }
                            const columnNames = columns.map(column => column.Field); // Extract column names
                            resolve({ table_name: tableName, all_column_name: columnNames.join(', ') }); // Join column names
                        });
                    });
                });

                Promise.all(columnPromises)
                    .then(results => {
                        const updateInsertPromises = results.map(({ table_name, all_column_name }) => {
                            return new Promise((resolve, reject) => {
                                // Check if the table already exists in module_settings
                                const checkQuery = `SELECT * FROM module_settings WHERE table_name = ?;`;

                                connection.query(checkQuery, [table_name], (error, existing) => {
                                    if (error) {
                                        return reject(error);
                                    }

                                    if (existing.length === 0) {
                                        // If the table doesn't exist, insert it
                                        const insertQuery = `INSERT INTO module_settings (table_name, all_column_name) VALUES (?, ?);`;

                                        connection.query(insertQuery, [table_name, all_column_name], (error) => {
                                            if (error) {
                                                return reject(error);
                                            }
                                            resolve();
                                        });
                                    } else {
                                        // If it exists, update the all_column_name
                                        const updateQuery = `UPDATE module_settings SET all_column_name = ? WHERE table_name = ?;`;

                                        connection.query(updateQuery, [all_column_name, table_name], (error) => {
                                            if (error) {
                                                return reject(error);
                                            }
                                            resolve();
                                        });
                                    }
                                });
                            });
                        });

                        // Wait for all insertions and updates to finish
                        Promise.all(updateInsertPromises)
                            .then(() => res.send('All tables processed successfully.'))
                            .catch(err => {
                                console.log(err);
                                res.status(500).send('Error inserting or updating data in module_settings');
                            });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send('Error retrieving column names');
                    });
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    },

}

module.exports = smsApiModel