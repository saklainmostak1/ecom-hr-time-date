

const connection = require('../../../../connection/config/database')


const TransportAllowanceModel = {



    transport_allowance_create: async (req, res) => {
        try {

            const { travel_from, travel_from_time, travel_to, travel_to_time, vehicle_name, km_travel, amount, user_id, created_by } = req.body;

            // Using parameterized query to prevent SQL injection
            const insertQuery = 'INSERT INTO transport_allowance (travel_from, travel_from_time, travel_to, travel_to_time, vehicle_name,km_travel, amount, user_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const result = await connection.query(insertQuery, [travel_from, travel_from_time, travel_to, travel_to_time, vehicle_name, km_travel, amount, user_id, created_by]);

            // Sending only the necessary data from the result object
            const { insertId, affectedRows } = result;

            // Sending response with relevant data
            res.status(200).json({ insertId, affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },


    transport_allowance_list: async (req, res) => {
        try {
            const data = "select * from  transport_allowance";

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

    transport_allowance_single: async (req, res) => {
        try {
            // const query = 'SELECT * FROM transport_allowance WHERE id = ?';
            const query = `SELECT ta.*, ep.branch_id 
            FROM transport_allowance ta
          LEFT JOIN employee_promotion ep ON ta.user_id = ep.user_id
            WHERE ta.id = ?`;
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


    transport_allowance_update: async (req, res) => {
        try {

            const { travel_from, travel_from_time, travel_to, travel_to_time, vehicle_name, km_travel, amount, user_id, modified_by_by } = req.body;


            const query = `UPDATE transport_allowance SET   travel_from = ?, travel_from_time = ?, travel_to = ?, travel_to_time= ?, vehicle_name = ?, km_travel = ?, amount = ?, user_id = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [travel_from, travel_from_time, travel_to, travel_to_time, vehicle_name, km_travel, amount, user_id, modified_by_by, req.params.id], (error, result) => {
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
            const query = 'DELETE FROM transport_allowance WHERE id = ?';
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


    transport_allowance_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
      SELECT transport_allowance.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by 
      FROM transport_allowance 
      LEFT JOIN users AS users_created ON transport_allowance.created_by = users_created.id 
      LEFT JOIN users AS users_modified ON transport_allowance.modified_by = users_modified.id 
      ORDER BY transport_allowance.id DESC
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

module.exports = TransportAllowanceModel