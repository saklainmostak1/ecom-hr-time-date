const connection = require("../../../../connection/config/database");

const GenderModel = {
  // gender_create: async (req, res) => {
  //   try {
  //     const { gender_name, gender_code, created_by } = req.body;

  //     // Using parameterized query to prevent SQL injection
  //     const insertQuery =
  //       "INSERT INTO gender (gender_name, gender_code, created_by) VALUES (?, ?, ?)";
  //     const result = await connection.query(insertQuery, [
  //       gender_name,
  //       gender_code,
  //       created_by,
  //     ]);

  //     // Sending only the necessary data from the result object
  //     const { insertId, affectedRows } = result;

  //     // Sending response with relevant data

  //     res
  //       .status(200)
  //       .json({ insertId, affectedRows }, "Gender create successfully");
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Error processing the request" });
  //   }
  // },

  gender_create: async (req, res) => {
    try {
      const { gender_name, gender_code, created_by } = req.body;
  
      // Using parameterized query to prevent SQL injection
      const insertQuery = "INSERT INTO gender (gender_name, gender_code, created_by) VALUES (?, ?, ?)";
      const result = await connection.query(insertQuery, [gender_name, gender_code, created_by]);
  
      // Check if result has the necessary properties
      const insertId = result.insertId; // This may vary depending on your SQL library
      const affectedRows = result.affectedRows;
  
      // Sending response with relevant data
      res.status(200).json({
        message: "Religion created successfully",
        insertId,
        affectedRows
      });
    } catch (error) {
      console.error("Error creating religion:", error);
      res.status(500).json({ message: "Error processing the request" });
    }
  },


  // gender_list: async (req, res) => {
  //     try {
  //         const data = "select * from  gender";

  //         connection.query(data, function (error, result) {
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

  gender_list: async (req, res) => {
    try {
      const data = `SELECT bg.*, u.full_name AS author_name
                   FROM gender bg
                   JOIN users u ON bg.created_by = u.id
                   ORDER BY bg.id DESC;`;

      connection.query(data, function (error, result) {
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

  gender_single: async (req, res) => {
    try {
      const query = "SELECT * FROM gender WHERE id = ?";
      connection.query(query, [req.params.id], (error, result) => {
        if (!error && result.length > 0) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error || "Product not found");
          return res.status(404).json({ message: "Product not found." });
        }
      });
    } catch (error) {
      console.log(error);
    }
  },

  gender_update: async (req, res) => {
    try {
      const { gender_name, gender_code, modified_by } = req.body;

      const query = `UPDATE gender SET   gender_name = ?, gender_code = ?, modified_by = ? WHERE id = ?`;
      connection.query(
        query,
        [gender_name, gender_code, modified_by, req.params.id],
        (error, result) => {
          if (!error && result.affectedRows > 0) {
            console.log(result);
            return res.send(result);
          } else {
            console.log(error || "Product not found");
            return res.status(404).json({ message: "Product not found." });
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  },

  // gender_delete: async (req, res) => {
  //   try {
  //     const query = "DELETE FROM gender WHERE id = ?";
  //     connection.query(query, [req.params.id], (error, result) => {
  //       if (!error && result.affectedRows > 0) {
  //         console.log(result);
  //         return res.send(result);
  //       } else {
  //         console.log(error || "Product not found");
  //         return res.status(404).json({ message: "Product not found." });
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  gender_delete: async (req, res) => {
    try {
      const shiftId = req.params.id;

      console.log(shiftId);

      // First, check if the shift_id is referenced in employee_joining
      const checkQuery = "SELECT COUNT(*) AS count FROM users WHERE gender = ?";
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
        const deleteQuery = "DELETE FROM gender WHERE id = ?";
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

  gender_list_paigination: async (req, res) => {
    const pageNo = Number(req.params.pageNo);
    const perPage = Number(req.params.perPage);
    try {
      const skipRows = (pageNo - 1) * perPage;
      let query = `
  SELECT gender.*, 
         users_created.full_name AS created_by,
         users_modified.full_name AS modified_by 
  FROM gender 
  LEFT JOIN users AS users_created ON gender.created_by = users_created.id 
  LEFT JOIN users AS users_modified ON gender.modified_by = users_modified.id 
  ORDER BY gender.id DESC
  LIMIT ?, ?
`;

      connection.query(query, [skipRows, perPage], (error, result) => {
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
};

module.exports = GenderModel;
