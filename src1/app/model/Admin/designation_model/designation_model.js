const connection = require("../../../../connection/config/database");

const DesignationModel = {
  designation_create: async (req, res) => {
    try {
      const { designation_name, serial_number, created_by } = req.body;

      // Using parameterized query to prevent SQL injection
      const insertQuery =
        "INSERT INTO designation (designation_name,created_by,serial_number) VALUES (?,?,?)";
      const result = await connection.query(insertQuery, [
        designation_name,
        created_by,
        serial_number,
      ]);

      // Sending only the necessary data from the result object
      const { insertId, affectedRows } = result;

      // Sending response with relevant data
      res.status(200).json({ insertId, affectedRows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error processing the request" });
    }
  },

  designation_list: async (req, res) => {
    try {
      const data = `SELECT bg.*, u.full_name AS author_name
                   FROM designation bg
                   JOIN users u ON bg.created_by = u.id
                   ORDER BY bg.serial_number DESC;`;

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

  // designation_list: async (req, res) => {
  //   try {
  //     // const data = "select * from  notice_category";

  //     const data = `SELECT ec.*, u.full_name AS author_name
  //     FROM designation ec
  //     JOIN users u ON ec.created_by = u.id;`;

  //     connection.query(data, function (error, result) {
  //       console.log(result);
  //       if (!error) {
  //         res.send(result);
  //       } else {
  //         console.log(error);
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  designation_single: async (req, res) => {
    try {
      const query = "SELECT * FROM designation WHERE id = ?";
      connection.query(query, [req.params.id], (error, result) => {
        if (!error && result.length > 0) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error || "Notice category not found");
          return res
            .status(404)
            .json({ message: "Notice category not found." });
        }
      });
    } catch (error) {
      console.log(error);
    }
  },

  // notice_category_update: async (req, res) => {
  //   try {
  //     const { name, status, modified_by } = req.body;

  //     const query = `UPDATE notice_category SET name = ?, status= ?, modified_by = ?, WHERE id = ?`;
  //     connection.query(
  //       query,
  //       [name, status, modified_by, req.params.id],
  //       (error, result) => {
  //         if (!error && result.affectedRows > 0) {
  //           console.log(result);
  //           return res.send(result);
  //         } else {
  //           console.log(error || "Notice category not found");
  //           return res
  //             .status(404)
  //             .json({ message: "Notice category not found." });
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  designation_update: async (req, res) => {
    try {
      const { designation_name, serial_number, modified_by } = req.body;
      const query = `UPDATE designation SET designation_name = ?, serial_number = ?, modified_by = ? WHERE id = ?`;

      connection.query(
        query,
        [designation_name, serial_number, modified_by, req.params.id],
        (error, result) => {
          if (!error && result.affectedRows > 0) {
            console.log(result);
            return res.send(result);
          } else {
            console.log(error || "Notice category not found");
            return res
              .status(404)
              .json({ message: "Notice category not found." });
          }
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error." });
    }
  },

  // designation_delete: async (req, res) => {
  //   try {
  //     const query = "DELETE FROM designation WHERE id = ?";
  //     connection.query(query, [req.params.id], (error, result) => {
  //       if (!error && result.affectedRows > 0) {
  //         console.log(result);
  //         return res.send(result);
  //       } else {
  //         console.log(error || "Notice category not found");
  //         return res
  //           .status(404)
  //           .json({ message: "Notice category not found." });
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  designation_delete: async (req, res) => {
    try {
      const shiftId = req.params.id;

      console.log(shiftId);

      // First, check if the shift_id is referenced in employee_joining
      const checkQuery =
        "SELECT COUNT(*) AS count FROM employee_promotion WHERE designation_id = ?";
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
        const deleteQuery = "DELETE FROM designation WHERE id = ?";
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

  designation_list_paigination: async (req, res) => {
    const pageNo = Number(req.params.pageNo);
    const perPage = Number(req.params.perPage);
    try {
      const skipRows = (pageNo - 1) * perPage;
      let query = `
  SELECT designation.*, 
         users_created.full_name AS created_by,
         users_modified.full_name AS modified_by 
  FROM designation 
  LEFT JOIN users AS users_created ON designation.created_by = users_created.id 
  LEFT JOIN users AS users_modified ON designation.modified_by = users_modified.id 
  ORDER BY designation.serial_number ASC
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
};

module.exports = DesignationModel;
