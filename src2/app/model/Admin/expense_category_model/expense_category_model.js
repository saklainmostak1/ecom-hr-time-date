const connection = require('../../../../connection/config/database')


const expenceCategory = {


    expence_category_create: async (req, res) => {

        const { expense_category_name, created_by } = req.body;
        try {
            const insertQuery = 'INSERT INTO expense_category (expense_category_name, created_by ) VALUES (?, ?)'

            connection.query(
                insertQuery,
                [expense_category_name, created_by],
                (error, result) => {
                    if (!error && result.affectedRows > 0) {
                        console.log(result);
                        return res.send(result);
                    } else {
                        console.log(error || 'Product not found');
                        return res.status(404).json({ message: 'Product not found.' });
                    }
                }
            );
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }

    },

    expence_category_list: async (req, res) => {
        // INNER
        try {
            let data = `
            SELECT expense_category.*, 
                   users_created.full_name AS created_by,
                   users_modified.full_name AS modified_by 
            FROM expense_category 
            LEFT JOIN users AS users_created ON expense_category.created_by = users_created.id 
            LEFT JOIN users AS users_modified ON expense_category.modified_by = users_modified.id 
        
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
    // expence_category_list: async (req, res) => {
    //     try {
    //         let data = `
    //             SELECT expense_category.*, 
    //                    users_created.full_name AS created_by,
    //                    users_modified.full_name AS modified_by 
    //             FROM expense_category 
    //             LEFT JOIN users AS users_created ON expense_category.created_by = users_created.id 
    //             LEFT JOIN users AS users_modified ON expense_category.modified_by = users_modified.id 
    //         `;
    
    //         connection.query(data, function (error, result) {
    //             if (error) {
    //                 console.log(error);
    //                 return res.status(500).send({ error: 'Database query error' });
    //             }
    
    //             // Adding the additional record
    //             const additionalRecord = {
    //                 id: "salary",
    //                 expense_category_name: "salary",
    //                 created_by: null,
    //                 created_date: "2024-03-13T11:12:59.000Z",
    //                 modified_by: null,
    //                 modified_date: null
    //             };
    
    //             // Push the additional record into the result array
    //             result.push(additionalRecord);
    
    //             // Send the modified result
    //             res.send(result);
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).send({ error: 'Server error' });
    //     }
    // },
    

    expense_category_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM expense_category WHERE id = ?';
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


    expense_category_update: async (req, res) => {
        try {

            const { expense_category_name, modified_by } = req.body;

            const query = `UPDATE expense_category SET expense_category_name = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [expense_category_name, modified_by, req.params.id], (error, result) => {
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




    expense_category_delete: async (req, res) => {

        try {
            const shiftId = req.params.id;
      
            console.log(shiftId);
      
            // First, check if the shift_id is referenced in employee_joining
            const checkQuery = "SELECT COUNT(*) AS count FROM expense WHERE expense_category = ?";
            connection.query(checkQuery, [shiftId], (error, results) => {
              if (error) {
                console.log(error);
                return res.status(500).json({ message: "Database error" });
              }
      
              const isReferenced = results[0].count > 0;
      
              if (isReferenced) {
                // If referenced, prevent deletion
                return res
                  .status(400)
                  .json({ message: "Cannot delete: School shift is in use." });
              }
      
              // Proceed with deletion if not referenced
              const deleteQuery = "DELETE FROM expense_category WHERE id = ?";
              connection.query(
                deleteQuery,
                [shiftId],
                (deleteError, deleteResult) => {
                  if (!deleteError && deleteResult.affectedRows > 0) {
                    console.log(deleteResult);
                    return res.send(deleteResult);
                  } else {
                    console.log(deleteError || "School shift not found");
                    return res
                      .status(404)
                      .json({ message: "School shift not found." });
                  }
                }
              );
            });
          } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server error" });
          }
    },



    expense_category_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
          SELECT expense_category.*, 
                 users_created.full_name AS created_by,
                 users_modified.full_name AS modified_by 
          FROM expense_category 
          INNER JOIN users AS users_created ON expense_category.created_by = users_created.id 
          LEFT JOIN users AS users_modified ON expense_category.modified_by = users_modified.id 
           ORDER BY expense_category.id DESC
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
module.exports = expenceCategory