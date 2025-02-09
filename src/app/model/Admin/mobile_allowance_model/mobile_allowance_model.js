

const connection = require('../../../../connection/config/database')


const MobileAllowanceModel = {

    mobile_allowance_create: async (req, res) => {
        try {

            const { mobile, amount, recharge_user, recharge_time, created_by } = req.body;

            // Using parameterized query to prevent SQL injection
            const insertQuery = 'INSERT INTO mobile_allowance (mobile, amount, recharge_user, recharge_time, created_by) VALUES (?, ?, ?, ?, ?)';
            const result = await connection.query(insertQuery, [mobile, amount, recharge_user, recharge_time, created_by]);

            // Sending only the necessary data from the result object
            const { insertId, affectedRows } = result;

            // Sending response with relevant data
            res.status(200).json({ insertId, affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },


    mobile_allowance_list: async (req, res) => {
        try {
            const data = "select * from  mobile_allowance";

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

    mobile_allowance_single: async (req, res) => {
        try {
            const query = `
                SELECT ma.*, ep.branch_id 
                FROM mobile_allowance ma
                LEFT JOIN employee_promotion ep ON ma.recharge_user = ep.user_id
                WHERE ma.id = ?`;
            
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
    


    mobile_allowance_update: async (req, res) => {
        try {

            const { mobile, amount, recharge_user, recharge_time, modified_by } = req.body;


            const query = `UPDATE mobile_allowance SET   mobile = ?, amount = ?, recharge_user = ?, recharge_time= ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [mobile, amount, recharge_user, recharge_time, modified_by, req.params.id], (error, result) => {
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


    mobile_allowance_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM mobile_allowance WHERE id = ?';
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

    mobile_allowance_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
      SELECT mobile_allowance.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by 
      FROM mobile_allowance 
      LEFT JOIN users AS users_created ON mobile_allowance.created_by = users_created.id 
      LEFT JOIN users AS users_modified ON mobile_allowance.modified_by = users_modified.id 
      ORDER BY mobile_allowance.id DESC
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

module.exports = MobileAllowanceModel