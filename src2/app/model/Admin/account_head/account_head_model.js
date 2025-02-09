const connection = require('../../../../connection/config/database')




const accountHeadModel = {





    account_head_create: async (req, res) => {
        try {
            const brands = req.body;
            const results = [];

            for (const brand of brands) {
                const { account_head_name, account_type_id, opening_balance, created_by } = brand;

                // if (!branch_name || !status_id) {
                //   return res.status(400).json({ message: 'brand name and status ID are required' });
                // }

                const processedbrandName = account_head_name?.replace(/\s+/g, ' ').trim();

                const selectQuery = 'SELECT * FROM account_head WHERE TRIM(account_head_name) = ?';
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
                    const insertQuery = 'INSERT INTO account_head (account_head_name, account_type_id, opening_balance, created_by) VALUES (?, ?, ?, ?)';
                    const insertedBrand = await new Promise((resolve, reject) => {
                        connection.query(insertQuery, [account_head_name, account_type_id, opening_balance, created_by], (error, result) => {
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




    account_head_list: async (req, res) => {
        try {
            const data = `
            SELECT 
                account_head.*, 
                account_head_type.account_head_type_name, 
                users.full_name 
            FROM 
                account_head 
            LEFT JOIN 
                account_head_type 
            ON 
                account_head.account_type_id = account_head_type.id 
            LEFT JOIN 
                users 
            ON 
                account_head.created_by = users.id`;


            connection.query(data, function (error, result) {
                if (!error) {
                    res.send(result);
                } else {
                    console.log(error);
                    res.status(500).send('Error retrieving branch list');
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    },

    account_head_list_show: async (req, res) => {
        try {
            const data = `
            SELECT * FROM account_head
            WHERE account_type_id = 1`;

            connection.query(data, function (error, result) {
                if (!error) {
                    res.send(result);
                } else {
                    console.log(error);
                    res.status(500).send('Error retrieving branch list');
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    },




    // account_head_delete: async (req, res) => {

    //     try {
    //         const query = 'DELETE FROM account_head WHERE id = ?';
    //         connection.query(query, [req.params.id], (error, result) => {
    //             if (!error && result.affectedRows > 0) {
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


    account_head_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM account_head WHERE id = ?';
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


    account_head_update: async (req, res) => {
        try {

            const { account_head_name, account_type_id, opening_balance, modified_by } = req.body;

            const query = `UPDATE account_head SET account_head_name = ?, account_type_id = ?, opening_balance = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [account_head_name, account_type_id, opening_balance, modified_by, req.params.id], (error, result) => {
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


    company_type_list: async (req, res) => {
        try {
            const data = "select * from  company_type";

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


    account_head_delete: async (req, res) => {
        try {
            const shiftId = req.params.id;

            console.log(shiftId)

            // First, check if the shift_id is referenced in employee_joining
            const checkQuery = 'SELECT COUNT(*) AS count FROM salary WHERE paid_by = ?';
            connection.query(checkQuery, [shiftId], (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Database error' });
                }

                const isReferenced = results[0].count > 0;

                if (isReferenced) {
                    // If referenced, prevent deletion
                    return res.status(400).json({ message: 'Cannot delete: School shift is in use.' });
                }

                // Proceed with deletion if not referenced
                const deleteQuery = 'DELETE FROM account_head WHERE id = ?';
                connection.query(deleteQuery, [shiftId], (deleteError, deleteResult) => {
                    if (!deleteError && deleteResult.affectedRows > 0) {
                        console.log(deleteResult);
                        return res.send(deleteResult);
                    } else {
                        console.log(deleteError || 'School shift not found');
                        return res.status(404).json({ message: 'School shift not found.' });
                    }
                });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },



    account_head_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
      SELECT account_head.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by 
      FROM account_head 
      LEFT JOIN users AS users_created ON account_head.created_by = users_created.id 
      LEFT JOIN users AS users_modified ON account_head.modified_by = users_modified.id 
      ORDER BY account_head.id DESC
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



}

module.exports = accountHeadModel




