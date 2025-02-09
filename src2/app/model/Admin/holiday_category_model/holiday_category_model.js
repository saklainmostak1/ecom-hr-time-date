

const connection = require('../../../../connection/config/database')


const HolidayCategoryModel = {

    holiday_category_create: async (req, res) => {
        try {
            const { name, created_by, is_weekly_holiday } = req.body;

            // Using parameterized query to prevent SQL injection
            const insertQuery = 'INSERT INTO holiday_category (name, created_by, is_weekly_holiday) VALUES (?, ?, ?)';
            const result = await connection.query(insertQuery, [name, created_by, is_weekly_holiday]);

            // Sending only the necessary data from the result object
            const { insertId, affectedRows } = result;

            // Sending response with relevant data
            res.status(200).json({ insertId, affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },


    holiday_category_list: async (req, res) => {
        try {
            const data = `
            SELECT 
                hc.*, 
                CASE 
                    WHEN hc.is_weekly_holiday = 1 THEN 'Yes' 
                    ELSE 'No' 
                END as is_weekly_holiday,
                u.full_name as created_by
            FROM 
                holiday_category hc
            LEFT JOIN 
                users u 
            ON 
                hc.created_by = u.id;
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

    holiday_category_single: async (req, res) => {
        try {
            const query = `SELECT * FROM holiday_category WHERE id = ?`;
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


    holiday_category_update: async (req, res) => {
        try {

            const { name, is_weekly_holiday, modified_by } = req.body;


            const query = `UPDATE holiday_category SET   name = ?, is_weekly_holiday = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [name, is_weekly_holiday, modified_by, req.params.id], (error, result) => {
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


    holiday_category_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM holiday_category WHERE id = ?';
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

    holiday_category_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
      SELECT holiday_category.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by 
      FROM holiday_category 
      LEFT JOIN users AS users_created ON holiday_category.created_by = users_created.id 
      LEFT JOIN users AS users_modified ON holiday_category.modified_by = users_modified.id 
      ORDER BY holiday_category.id DESC
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

module.exports = HolidayCategoryModel