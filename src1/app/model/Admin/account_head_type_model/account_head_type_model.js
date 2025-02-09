

const connection = require('../../../../connection/config/database')


const AccountHeadTypeModel = {

    account_head_type_create: async (req, res) => {
        try {
            const { account_head_type_name, created_by } = req.body;

            // Using parameterized query to prevent SQL injection
            const insertQuery = 'INSERT INTO account_head_type (account_head_type_name, created_by) VALUES (?, ?)';
            const result = await connection.query(insertQuery, [account_head_type_name, created_by]);

            // Sending only the necessary data from the result object
            const { insertId, affectedRows } = result;

            // Sending response with relevant data
            res.status(200).json({ insertId, affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },


    account_head_type_list: async (req, res) => {
        try {
            const data = "select * from  account_head_type";

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

    account_head_type_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM account_head_type WHERE id = ?';
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


    account_head_type_update: async (req, res) => {
        try {

            const { account_head_type_name, modified_by } = req.body;


            const query = `UPDATE account_head_type SET   account_head_type_name = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [account_head_type_name, modified_by, req.params.id], (error, result) => {
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


    // account_head_type_delete: async (req, res) => {

    //     try {
    //         const query = 'DELETE FROM account_head_type WHERE id = ?';
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

    account_head_type_delete: async (req, res) => {
        try {
            const shiftId = req.params.id;

            console.log(shiftId)

            // First, check if the shift_id is referenced in employee_joining
            const checkQuery = 'SELECT COUNT(*) AS count FROM account_head WHERE account_type_id = ?';
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
                const deleteQuery = 'DELETE FROM account_head_type WHERE id = ?';
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



    account_head_type_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
      SELECT account_head_type.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by 
      FROM account_head_type 
      LEFT JOIN users AS users_created ON account_head_type.created_by = users_created.id 
      LEFT JOIN users AS users_modified ON account_head_type.modified_by = users_modified.id 
      ORDER BY account_head_type.id DESC
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



}

module.exports = AccountHeadTypeModel