const connection = require('../../../../connection/config/database')


const SchoolShift = {

    school_shiftt_create: async (req, res) => {
        try {
            const { name, start_time, late_time, end_time, early_end_time, created_by, branch_id } = req.body;

            // Using parameterized query to prevent SQL injection
            const insertQuery = 'INSERT INTO school_shift (name, start_time, late_time, end_time, early_end_time, created_by, branch_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const result = await connection.query(insertQuery, [name, start_time, late_time, end_time, early_end_time, created_by, branch_id]);

            // Sending only the necessary data from the result object
            const { insertId, affectedRows } = result;

            // Sending response with relevant data
            res.status(200).json({ insertId, affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },


    school_shift_list: async (req, res) => {
        try {
            const data = "select * from  school_shift";

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

    school_shift_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM school_shift WHERE id = ?';
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


    school_shift_update: async (req, res) => {
        try {

            const { name, start_time, late_time, end_time, early_end_time, modified_by, branch_id } = req.body;


            const query = `UPDATE school_shift SET   name = ?, start_time = ?, late_time = ?, end_time = ?, early_end_time = ?, modified_by = ?, branch_id = ? WHERE id = ?`;
            connection.query(query, [name, start_time, late_time, end_time, early_end_time, modified_by, branch_id, req.params.id], (error, result) => {
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


    school_shift_delete: async (req, res) => {
        try {
            const shiftId = req.params.id;

            console.log(shiftId)

            // First, check if the shift_id is referenced in employee_joining
            const checkQuery = 'SELECT COUNT(*) AS count FROM employe_joining WHERE school_shift_id = ?';
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
                const deleteQuery = 'DELETE FROM school_shift WHERE id = ?';
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



    school_shift_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
      SELECT school_shift.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by 
      FROM school_shift 
      LEFT JOIN users AS users_created ON school_shift.created_by = users_created.id 
      LEFT JOIN users AS users_modified ON school_shift.modified_by = users_modified.id 
      ORDER BY school_shift.id DESC
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

module.exports = SchoolShift