const { query } = require('express');
const connection = require('../../../../connection/config/database')


const incomeModel = {



    update_income_amount: async (req, res) => {
        try {
            const { selectedData, selectedEntryType } = req.body;
            console.log(selectedData.amount, selectedEntryType)
            // Check if selectedData and selectedEntryType are provided
            // if (!selectedData || selectedData.amount == null || !selectedEntryType) {
            //     return res.status(400).json({ message: 'Invalid request data.' });
            // }

            const query = `UPDATE account_head SET amount = ? WHERE id = ?`;
            connection.query(query, [selectedData.amount, selectedEntryType], (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Database query error.' });
                }

                if (result.affectedRows > 0) {
                    console.log(result);
                    return res.json({ message: 'Update successful', result });
                } else {
                    console.log('Entry not found');
                    return res.status(404).json({ message: 'Entry not found.' });
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error.' });
        }
    },


    update_income_amount_array: async (req, res) => {
        try {
            const { selectedData } = req.body; // Assuming selectedData is your data array
    
            // Check if selectedData is provided
            if (!selectedData || !Array.isArray(selectedData) || selectedData.length === 0) {
                return res.status(400).json({ message: 'Invalid request data.' });
            }
    
            // Using a Promise.all to handle multiple updates
            const updatePromises = selectedData.map(data => {
                const query = `UPDATE account_head SET amount = ? WHERE id = ?`;
                return new Promise((resolve, reject) => {
                    connection.query(query, [data.amount, data.id], (error, result) => {
                        if (error) {
                            console.error(error);
                            return reject(new Error('Database query error.'));
                        }
                        if (result.affectedRows > 0) {
                            console.log(`Updated ID: ${data.id}, New Amount: ${data.amount}`);
                            resolve({ id: data.id, message: 'Update successful' });
                        } else {
                            console.log(`Entry not found for ID: ${data.id}`);
                            resolve({ id: data.id, message: 'Entry not found.' });
                        }
                    });
                });
            });
    
            // Await all update promises
            const results = await Promise.all(updatePromises);
    
            // Respond with the results
            return res.json({ message: 'Updates processed', results });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error.' });
        }
    },
    

    income_create: async (req, res) => {

        console.log('--------------------');
        console.log(req.body);
        console.log('--------------------');


        try {
            const getMaxVoucherIdQuery = 'SELECT MAX(voucher_id) AS max_voucher_id FROM income';
            connection.query(getMaxVoucherIdQuery, (err, result) => {

                if (err) {
                    console.error('Error getting maximum voucher_id: ' + err.stack);
                    return res.status(500).send('Error getting maximum voucher_id');
                }


                let maxVoucherId = result[0].max_voucher_id || 0;
                const nextVoucherId = maxVoucherId + 1;

                const {
                    income_category,
                    amount,
                    payment_type,
                    income_date,
                    discount,
                    short_note,
                    created_by,
                    bank_check_no,
                    sub_total,
                    previous_due,
                    payable_amount,
                    due_amount,
                    paid_amount,
                    quantity,
                    item_name
                } = req.body;

                const incomeQuery = 'INSERT INTO income ( voucher_id,  income_category, amount, payment_type, income_date, quantity,  discount, short_note, created_by,  previous_due, sub_total,payable_amount, due_amount, paid_amount) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                const incomeValues = [nextVoucherId, income_category, amount, payment_type, income_date, quantity, discount, short_note, created_by, previous_due, sub_total, payable_amount, due_amount, paid_amount];

                connection.query(incomeQuery, incomeValues, (err, result) => {
                    if (err) {
                        console.error('Error inserting into income table: ' + err.stack);
                        return res.status(500).send('Error inserting into income table');
                    }


                    const incomeId = result.insertId;
                    const incomeCheckQuery = 'INSERT INTO income_check (income_id, bank_check_no) VALUES (?, ?)';
                    const incomeCheckValues = [incomeId, bank_check_no];
                    connection.query(incomeCheckQuery, incomeCheckValues, (err, result) => {

                        if (err) {
                            return res.status(500).send('Error inserting into income_check table');
                        }


                        // Insert into income_item table
                        const incomeItemQuery = 'INSERT INTO income_item (income_id, item_name, amount, discount, due) VALUES (?, ?, ?, ?, ?)';
                        const incomeItemValues = [incomeId, item_name, amount, discount, due_amount];
                        connection.query(incomeItemQuery, incomeItemValues, (err, result) => {
                            if (err) {
                                console.error('Error inserting into income_item table: ' + err.stack);
                                return res.status(500).send('Error inserting into income_item table');
                            }
                            res.status(200).json('Data inserted successfully');
                        });
                    });
                });





            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },


    income_get: async (req, res) => {
        try {
            // Query to fetch incomes along with their details
            const getincomesQuery = `
    SELECT 
        i.*,
        ic.bank_check_no,
        ii.item_name,
        ii.amount AS item_amount,
        ii.discount AS item_discount,
        ii.due AS item_due
    FROM 
        income i
    LEFT JOIN 
        income_check ic ON i.id = ic.income_id
    LEFT JOIN 
        income_item ii ON i.id = ii.income_id
`;


            connection.query(getincomesQuery, (err, results) => {
                if (err) {
                    console.error('Error fetching incomes: ' + err.stack);
                    return res.status(500).send('Error fetching incomes');
                }

                // Organize fetched results
                const incomes = results.reduce((acc, row) => {
                    const existingincome = acc.find(income => income.id === row.id);
                    if (existingincome) {
                        // Add check details if they exist
                        if (row.bank_check_no) {
                            existingincome.bank_check_no = row.bank_check_no;
                        }
                        // Add item details if they exist
                        if (row.item_name) {
                            existingincome.items.push({
                                item_name: row.item_name,
                                amount: row.item_amount,
                                discount: row.item_discount,
                                due: row.item_due
                            });
                        }
                    } else {
                        // Initialize income object
                        const income = {
                            id: row.id,
                            supplier_id: row.supplier_id,
                            voucher_id: row.voucher_id,
                            income_category: row.income_category,
                            amount: row.amount,
                            payment_type: row.payment_type,
                            income_date: row.income_date,
                            discount: row.discount,
                            short_note: row.short_note,
                            created_by: row.created_by,
                            previous_due: row.previous_due,
                            sub_total: row.sub_total,
                            payable_amount: row.payable_amount,
                            due_amount: row.due_amount,
                            paid_amount: row.paid_amount,
                            bank_check_no: row.bank_check_no ? row.bank_check_no : null,
                            items: [],
                            quantity: row.quantity,
                            item_name: row.item_name,
                            amount: row.item_amount,
                            discount: row.item_discount,
                            due: row.item_due
                        };
                        // Add item details if they exist
                        if (row.item_name) {
                            income.items.push({
                                item_name: row.item_name,
                                amount: row.item_amount,
                                discount: row.item_discount,
                                due: row.item_due
                            });
                        }
                        acc.push(income);
                    }
                    return acc;
                }, []);

                res.status(200).json(incomes);
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    income_update: async (req, res) => {
        try {
            const incomeId = req.params.id;

            const {
                item_name,

                income_category,
                amount,
                quantity,
                payment_type,
                income_date,
                discount,
                short_note,

                bank_check_no,
                previous_due,
                sub_total,
                payable_amount,
                due_amount,
                paid_amount
            } = req.body;

            // Update income table
            const updateincomeQuery = `
            UPDATE income 
            SET 
                
                income_category = ?,
                amount = ?,
                quantity = ?,
                payment_type = ?,
                income_date = ?,
                discount = ?,
                short_note = ?,
             
                previous_due = ?,
                sub_total = ?,
                payable_amount = ?,
                due_amount = ?,
                paid_amount = ?
            WHERE 
                id = ?
        `;
            const updateincomeValues = [

                income_category,
                amount,
                quantity,
                payment_type,
                income_date,
                discount,
                short_note,

                previous_due,
                sub_total,
                payable_amount,
                due_amount,
                paid_amount,
                incomeId
            ];

            connection.query(updateincomeQuery, updateincomeValues, (err, result) => {
                if (err) {
                    console.error('Error updating income: ' + err.stack);
                    return res.status(500).send('Error updating income');
                }

                // Update income_check table
                const updateincomeCheckQuery = `
                UPDATE income_check 
                SET 
                    bank_check_no = ?
                WHERE 
                    income_id = ?
            `;
                const updateincomeCheckValues = [bank_check_no, incomeId];

                connection.query(updateincomeCheckQuery, updateincomeCheckValues, (err, result) => {
                    if (err) {
                        console.error('Error updating income_check: ' + err.stack);
                        return res.status(500).send('Error updating income_check');
                    }

                    // Update income_item table
                    const updateincomeItemQuery = `
                    UPDATE income_item 
                    SET 
                        item_name = ?,
                        amount = ?,
                        discount = ?,
                        due = ?
                    WHERE 
                        income_id = ?
                `;
                    const updateincomeItemValues = [item_name, amount, discount, due_amount, incomeId];

                    connection.query(updateincomeItemQuery, updateincomeItemValues, (err, result) => {
                        if (err) {
                            console.error('Error updating income_item: ' + err.stack);
                            return res.status(500).send('Error updating income_item');
                        }

                        res.status(200).send('income updated successfully');
                    });
                });
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },


    income_getById: async (req, res) => {
        try {
            const incomeId = req.params.id;

            // Query to fetch a single income along with its details
            const getincomeQuery = `
            SELECT 
                i.*,
                ic.bank_check_no,
                ii.item_name,
                ii.amount AS item_amount,
                ii.discount AS item_discount,
                ii.due AS item_due
            FROM 
                income i
            LEFT JOIN 
                income_check ic ON i.id = ic.income_id
            LEFT JOIN 
                income_item ii ON i.id = ii.income_id
            WHERE 
                i.id = ?
        `;

            connection.query(getincomeQuery, [incomeId], (err, results) => {
                if (err) {
                    console.error('Error fetching income: ' + err.stack);
                    return res.status(500).send('Error fetching income');
                }

                if (results.length === 0) {
                    return res.status(404).send('income not found');
                }

                // Organize fetched results
                const income = results.reduce((acc, row) => {
                    acc.id = row.id;
                    acc.supplier_id = row.supplier_id;
                    acc.voucher_id = row.voucher_id;
                    acc.income_category = row.income_category;
                    acc.amount = row.amount;
                    acc.payment_type = row.payment_type;
                    acc.income_date = row.income_date;
                    acc.discount = row.discount;
                    acc.short_note = row.short_note;
                    acc.created_by = row.created_by;
                    acc.previous_due = row.previous_due;
                    acc.sub_total = row.sub_total;
                    acc.payable_amount = row.payable_amount;
                    acc.due_amount = row.due_amount;
                    acc.paid_amount = row.paid_amount;
                    acc.quantity = row.quantity;
                    acc.item_name = row.item_name,
                        acc.amount = row.item_amount,
                        acc.discount = row.item_discount,
                        acc.due = row.item_due
                    // Add check details if they exist
                    if (row.bank_check_no) {
                        acc.bank_check_no = row.bank_check_no;
                    }
                    // Add item details if they exist
                    if (row.item_name) {
                        acc.items.push({
                            item_name: row.item_name,
                            amount: row.item_amount,
                            discount: row.item_discount,
                            due: row.item_due
                        });
                    }
                    return acc;
                }, {
                    id: null,
                    supplier_id: null,
                    voucher_id: null,
                    income_category: null,
                    amount: null,
                    payment_type: null,
                    income_date: null,
                    discount: null,
                    short_note: null,
                    created_by: null,
                    previous_due: null,
                    sub_total: null,
                    payable_amount: null,
                    due_amount: null,
                    paid_amount: null,
                    quantity: null,
                    bank_check_no: null,
                    items: [],
                    item_name: null,
                    amount: null,
                    discount: null,
                    due: null,
                });

                res.status(200).json(income);
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },



    income_category_list: async (req, res) => {
        try {
            let data = `
            SELECT 
                    income.*, 
                    income_item.item_name AS income_name,
                    users_created.full_name AS created_by,
                    users_modified.full_name AS modified_by,
                    income_category.income_category_name AS income_category
                FROM 
                    income 
                    LEFT JOIN users AS users_created ON income.created_by = users_created.id 
                    LEFT JOIN users AS users_modified ON income.modified_by = users_modified.id 
                    LEFT JOIN income_category ON income.income_category = income_category.id
                    LEFT JOIN income_item ON income.id = income_item.income_id;
            `;

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


    income_category_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM income_category WHERE id = ?';
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





    income_delete: async (req, res) => {

        try {
            const selectincomeQuery = 'SELECT * FROM income WHERE id = ?';
            const selectincomeItemQuery = 'SELECT * FROM income_item WHERE income_id = ?';
            const deleteincomeQuery = 'DELETE FROM income WHERE id = ?';
            const deleteincomeItemQuery = 'DELETE FROM income_item WHERE income_id = ?';
            const insertincomeLogQuery = 'INSERT INTO income_log (id, supplier_id, voucher_id, income_category, amount, payment_type, income_date, discount, short_note, created_by, previous_due, sub_total, payable_amount, due_amount, paid_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const insertincomeItemLogQuery = 'INSERT INTO income_item_log (id ,income_id, item_name, amount, discount, due) VALUES (?, ?, ?, ?, ?, ?)';


            connection.beginTransaction((err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: 'Failed to begin transaction.' });
                }

                // Select income data
                connection.query(selectincomeQuery, [req.params.id], (error, incomeResult) => {
                    if (error) {
                        console.log(error);
                        return connection.rollback(() => {
                            res.status(500).json({ message: 'Failed to retrieve income data.' });
                        });
                    }

                    if (incomeResult.length === 0) {
                        console.log('income not found');
                        return connection.rollback(() => {
                            res.status(404).json({ message: 'income not found.' });
                        });
                    }

                    const incomeData = incomeResult[0];

                    // Insert income data into income_log
                    connection.query(insertincomeLogQuery, [incomeData.id, incomeData.supplier_id, incomeData.voucher_id, incomeData.income_category, incomeData.amount, incomeData.payment_type, incomeData.income_date, incomeData.discount, incomeData.short_note, incomeData.created_by, incomeData.previous_due, incomeData.sub_total, incomeData.payable_amount, incomeData.due_amount, incomeData.paid_amount], (error) => {
                        if (error) {
                            console.log(error);
                            return connection.rollback(() => {
                                res.status(500).json({ message: 'Failed to insert income data into log.' });
                            });
                        }

                        // Select income items data
                        connection.query(selectincomeItemQuery, [req.params.id], (error, incomeItemResult) => {
                            if (error) {
                                console.log(error);
                                return connection.rollback(() => {
                                    res.status(500).json({ message: 'Failed to retrieve income item data.' });
                                });
                            }

                            // Insert income items data into income_item_log
                            const promises = incomeItemResult.map(item => {
                                return new Promise((resolve, reject) => {
                                    connection.query(insertincomeItemLogQuery, [item.id, item.income_id, item.item_name, item.amount, item.discount, item.due], (error) => {
                                        if (error) {
                                            console.log(error);
                                            reject(error);
                                        } else {
                                            resolve();
                                        }
                                    });
                                });
                            });

                            // Execute all insert queries for income_item_log
                            Promise.all(promises)
                                .then(() => {
                                    // After successful insertion into log tables, proceed to delete
                                    connection.query(deleteincomeItemQuery, [req.params.id], (error) => {
                                        if (error) {
                                            console.log(error);
                                            return connection.rollback(() => {
                                                res.status(500).json({ message: 'Failed to delete related income items.' });
                                            });
                                        }

                                        connection.query(deleteincomeQuery, [req.params.id], (error) => {
                                            if (error) {
                                                console.log(error);
                                                return connection.rollback(() => {
                                                    res.status(500).json({ message: 'Failed to delete income.' });
                                                });
                                            }

                                            connection.commit((err) => {
                                                if (err) {
                                                    console.log(err);
                                                    return connection.rollback(() => {
                                                        res.status(500).json({ message: 'Failed to commit transaction.' });
                                                    });
                                                }

                                                console.log('income and related items deleted successfully');
                                                res.send({ message: 'income and related items deleted successfully' });
                                            });
                                        });
                                    });
                                })
                                .catch(error => {
                                    console.log(error);
                                    return connection.rollback(() => {
                                        res.status(500).json({ message: 'Failed to insert income item data into log.' });
                                    });
                                });
                        });
                    });
                });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'An unexpected error occurred.' });
        }
    },





    income_category_update: async (req, res) => {
        try {

            const { income_category_name, modified_by } = req.body;

            const query = `UPDATE income_category SET income_category_name = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [income_category_name, modified_by, req.params.id], (error, result) => {
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




    income_category_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM income_category WHERE id = ?';
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



    income_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
            SELECT 
            income.*, 
            income_item.item_name AS income_name,
            users_created.full_name AS created_by,
            users_modified.full_name AS modified_by,
            income_category.income_category_name AS income_category
        FROM 
            income 
            LEFT JOIN users AS users_created ON income.created_by = users_created.id 
            LEFT JOIN users AS users_modified ON income.modified_by = users_modified.id 
            LEFT JOIN income_category ON income.income_category = income_category.id
            LEFT JOIN income_item ON income.id = income_item.income_id
        ORDER BY income.id DESC  
        LIMIT ?, ?`;

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

    income_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { fromDate, toDate, searchQuery } = req.body;

            // Construct the base SQL query
            let sql = `  SELECT 
            income.*, 
            income_item.item_name AS income_name, 
            income_category.income_category_name AS income_category 
        FROM 
            income 
            LEFT JOIN income_category ON income.income_category = income_category.id 
            LEFT JOIN income_item ON income.id = income_item.income_id 
        WHERE 1`;

            // Add date range condition
            if (fromDate && toDate) {
                sql += ` AND income.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
            }

            // Add income category ID condition
            if (searchQuery) {
                sql += ` AND income_category = ${searchQuery}`;
            }

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



}
module.exports = incomeModel