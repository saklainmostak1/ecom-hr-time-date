const connection = require('../../../../connection/config/database')

const yearlyHolidayModel = {


    //   yearly_holiday_create: async (req, res) => {
    //     try {
    //       const models = req.body;
    //       const results = [];

    //       for (const model of models) {
    //         const { holiday_category, start_date, holiday_name, end_date, created_by } = model;

    //           const insertQuery = 'INSERT INTO yearly_holiday (holiday_category, start_date, holiday_name, end_date, created_by) VALUES (?, ?, ?, ?, ?)';
    //           const insertedmodel = await new Promise((resolve, reject) => {
    //             connection.query(insertQuery, [holiday_category, start_date, holiday_name, end_date, created_by], (error, result) => {
    //               if (error) {
    //                 console.log(error);
    //                 reject(error);
    //               }
    //               resolve(result);
    //             });
    //           });

    //           console.log(insertedmodel);
    //           results.push(insertedmodel);

    //       }

    //       res.json(results);
    //     } catch (error) {
    //       console.log(error);
    //       res.status(500).json({ message: 'Internal Server Error' });
    //     }
    //   },
    yearly_holiday_create: async (req, res) => {
        try {
            const models = req.body;

            // Check if models is an array
            if (!Array.isArray(models)) {
                return res.status(400).json({ message: 'Invalid input data. Expected an array of objects.' });
            }

            const results = [];

            for (const model of models) {
                const { holiday_category, start_date, holiday_name, end_date, created_by } = model;

                // Check if all required fields are present
                if (!holiday_category || !start_date || !holiday_name || !end_date || !created_by) {
                    return res.status(400).json({ message: 'Missing required fields in one of the holiday objects.' });
                }

                const insertQuery = 'INSERT INTO yearly_holiday (holiday_category, start_date, holiday_name, end_date, created_by) VALUES (?, ?, ?, ?, ?)';
                const insertedModel = await new Promise((resolve, reject) => {
                    connection.query(insertQuery, [holiday_category, start_date, holiday_name, end_date, created_by], (error, result) => {
                        if (error) {
                            console.log(error);
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                });

                console.log(insertedModel);
                results.push(insertedModel);
            }

            res.json(results);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },



    yearly_holiday_list: async (req, res) => {
        try {
            const data = `
            SELECT 
              yearly_holiday.*,
              holiday_category.name AS holiday_category_name,
              users.full_name AS created_by_name
            FROM yearly_holiday
            LEFT JOIN holiday_category ON yearly_holiday.holiday_category = holiday_category.id
            LEFT JOIN users ON yearly_holiday.created_by = users.id
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

    yearly_holiday_list_all: async (req, res) => {
        try {
            const data = `
            SELECT 
                yearly_holiday.*,
                holiday_category.name AS holiday_category_name,
                users.full_name AS created_by_name
            FROM yearly_holiday
            LEFT JOIN holiday_category ON yearly_holiday.holiday_category = holiday_category.id
            LEFT JOIN users ON yearly_holiday.created_by = users.id
            GROUP BY yearly_holiday.start_date
            `;
    
            connection.query(data, function (error, result) {
                console.log(result)
                if (!error) {
                    res.send(result)
                } else {
                    console.log(error)
                }
            })
        } catch (error) {
            console.log(error)
        }
    },
    

    yearly_holiday_update: async (req, res) => {
        try {

            const { holiday_category, start_date, holiday_name, end_date, modified_by } = req.body;

            const query = `UPDATE yearly_holiday SET holiday_category = ?, start_date = ?, holiday_name = ?, end_date = ?,  modified_by = ? WHERE id = ?`;
            connection.query(query, [holiday_category, start_date, holiday_name, end_date, modified_by, req.params.id], (error, result) => {
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


    yearly_holiday_list_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM yearly_holiday WHERE id = ?';
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

    yearly_holiday_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM yearly_holiday WHERE id = ?';
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

    yearly_holiday_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
           SELECT 
              yearly_holiday.*,
              holiday_category.name AS holiday_category_name,
              users.full_name AS created_by_name
            FROM yearly_holiday
            LEFT JOIN holiday_category ON yearly_holiday.holiday_category = holiday_category.id
            LEFT JOIN users ON yearly_holiday.created_by = users.id
          ORDER BY yearly_holiday.id DESC
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



    yearly_holiday_list_id_table: async (req, res) => {
        try {
            const data = `
            SELECT 
                id, 
                'yearly_holiday' AS table_name
            FROM 
                yearly_holiday
            `;
    
            connection.query(data, function (error, result) {
                console.log(result);
                if (!error) {
                    res.send(result);
                } else {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        }
    },
    
    



}
module.exports = yearlyHolidayModel