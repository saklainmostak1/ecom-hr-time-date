const connection = require('../../../../connection/config/database')


const moduleSettings = {

    // module_setting_create: async (req, res) => {

    //   try {

    //     const { name, table_name, column_name, created_by } = req.body;
    //     const insertQuery = 'INSERT INTO module_settings (name, table_name, column_name, created_by) VALUES (?, ?, ?, ?)'

    //     connection.query(
    //       insertQuery,
    //       [name, table_name, column_name, created_by],
    //       (error, result) => {
    //         if (!error && result.affectedRows > 0) {
    //           console.log(result);
    //           return res.send(result);
    //         } else {
    //           console.log(error || 'Product not found');
    //           return res.status(404).json({ message: 'Product not found.' });
    //         }
    //       }
    //     );
    //   } catch (error) {
    //     console.log(error);
    //     res.status(500).json({ message: 'Internal Server Error' });
    //   }

    // },

    module_setting_create: async (req, res) => {
        try {
            const { name, table_name, column_name, created_by, columnListSelectedSerachArrays , selectedColumnsSearchs, quantity, search} = req.body;

            // Check if the table_name already exists
            connection.query(
                'SELECT * FROM module_settings WHERE table_name = ?',
                [table_name],
                (error, results) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: 'Internal Server Error' });
                    }

                    if (results.length > 0) {
                        // If table_name already exists, update column_name
                        connection.query(
                            'UPDATE module_settings SET column_name = ?, created_by = ?, quantity = ?,search = ?, search_value = ? WHERE table_name = ?',
                            [column_name, created_by,  quantity, columnListSelectedSerachArrays, selectedColumnsSearchs, table_name],
                            (updateError, updateResult) => {
                                if (updateError) {
                                    console.log(updateError);
                                    return res.status(500).json({ message: 'Internal Server Error' });
                                }
                                console.log(updateResult);
                                return res.send(updateResult);
                            }
                        );
                    } else {
                        // If table_name doesn't exist, perform insert
                        connection.query(
                            'INSERT INTO module_settings (name, table_name, quantity, column_name, search, created_by) VALUES (?, ?, ?, ?, ?, ?)',
                            [name, table_name, quantity, column_name, search ,created_by],
                            (insertError, insertResult) => {
                                if (insertError) {
                                    console.log(insertError);
                                    return res.status(500).json({ message: 'Internal Server Error' });
                                }
                                console.log(insertResult);
                                return res.send(insertResult);
                            }
                        );
                    }
                }
            );
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    module_setting_list: async (req, res) => {
        try {
            const data = "select * from  module_settings";

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
}
module.exports = moduleSettings