

const connection = require('../../../../connection/config/database')


const WareHouseModel = {

    ware_house_create: async (req, res) => {
        try {
            const { name, email, mobile, address, created_by } = req.body;
            if (!name || !mobile) {
                return res.status(400).json({ message: ' name and mobile ID are required' });
            }

                const insertQuery = 'INSERT INTO ware_house (name, email, mobile, address, created_by) VALUES (?, ?, ?, ?, ?)';
                const result = await connection.query(insertQuery, [name, email, mobile, address, created_by]);

                // Sending only the necessary data from the result object
                const { insertId, affectedRows } = result;

                // Sending response with relevant data
                res.status(200).json({ insertId, affectedRows });
            
            // Using parameterized query to prevent SQL injection

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },


    ware_house_list: async (req, res) => {
        try {
            const data = "select * from  ware_house";

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

    ware_house_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM ware_house WHERE id = ?';
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


    ware_house_update: async (req, res) => {
        try {

            const { name, email, mobile, address, modified_by } = req.body;


            const query = `UPDATE ware_house SET   name = ?, email = ?, mobile = ?, address = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [name, email, mobile, address, modified_by, req.params.id], (error, result) => {
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


    ware_house_delete: async (req, res) => {
           try {
            const query = 'DELETE FROM ware_house WHERE id = ?';
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


   
    ware_house_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
      SELECT ware_house.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by 
      FROM ware_house 
      LEFT JOIN users AS users_created ON ware_house.created_by = users_created.id 
      LEFT JOIN users AS users_modified ON ware_house.modified_by = users_modified.id 
      ORDER BY ware_house.id DESC
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


    ware_house_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            let { name, moible } = req.body;

            // Construct the base SQL query
            let sql = `
             SELECT ware_house.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by 
            FROM ware_house 
            LEFT JOIN users AS users_created ON ware_house.created_by = users_created.id 
            LEFT JOIN users AS users_modified ON ware_house.modified_by = users_modified.id 
            WHERE 1`;



            if (name) {
                sql += ` AND LOWER(ware_house.name) LIKE '%${name}%'`;
            }
            if (moible) {
                sql += ` AND ware_house.mobile LIKE '%${moible}%'`;
            }



            sql += ` ORDER BY ware_house.id DESC`
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




}

module.exports = WareHouseModel