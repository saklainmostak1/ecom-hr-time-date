const connection = require("../../../../connection/config/database");

const EducationModel = {
  education_create: async (req, res) => {
    try {
      const brands = req.body;
      const results = [];

      for (const brand of brands) {
        const { education_name, created_by } = brand;

        // if (!branch_name || !status_id) {
        //   return res.status(400).json({ message: 'brand name and status ID are required' });
        // }

        const processedbrandName = education_name?.replace(/\s+/g, " ").trim();

        const selectQuery =
          "SELECT * FROM education WHERE TRIM(education_name) = ?";
        const existingBrands = await new Promise((resolve, reject) => {
          connection.query(
            selectQuery,
            [processedbrandName],
            (error, results) => {
              if (error) {
                console.log(error);
                reject(error);
              }
              resolve(results);
            }
          );
        });

        if (existingBrands.length === 0) {
          const insertQuery =
            "INSERT INTO education (education_name, created_by) VALUES (?, ?)";
          const insertedBrand = await new Promise((resolve, reject) => {
            connection.query(
              insertQuery,
              [processedbrandName, created_by],
              (error, result) => {
                if (error) {
                  console.log(error);
                  reject(error);
                }
                resolve(result);
              }
            );
          });

          console.log(insertedBrand);
          results.push(insertedBrand);
        } else {
          console.log(
            `Brand '${processedbrandName}' already exists, skipping insertion.`
          );
        }
      }

      res.send(results);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  education_list: async (req, res) => {
    try {
      const data = `SELECT bg.*, u.full_name AS author_name
                   FROM education bg
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

  // education_list: async (req, res) => {
  //   try {
  //     const data = `SELECT ec.*, u.full_name AS author_name
  //     FROM education ec
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

  education_single: async (req, res) => {
    try {
      const query = "SELECT * FROM education WHERE id = ?";
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

  education_update: async (req, res) => {
    try {
      const { education_name, modified_by } = req.body;
      const query = `UPDATE education SET education_name = ?, modified_by = ? WHERE id = ?`;

      connection.query(
        query,
        [education_name, modified_by, req.params.id],
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

  // education_delete: async (req, res) => {
  //   try {
  //     const query = "DELETE FROM education WHERE id = ?";
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

  education_delete: async (req, res) => {
    try {
      const shiftId = req.params.id;

      console.log(shiftId);

      // First, check if the shift_id is referenced in employee_joining
      const checkQuery =
        "SELECT COUNT(*) AS count FROM educational_qualification WHERE education = ?";
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
        const deleteQuery = "DELETE FROM education WHERE id = ?";
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

  education_list_paigination: async (req, res) => {
    const pageNo = Number(req.params.pageNo);
    const perPage = Number(req.params.perPage);
    try {
      const skipRows = (pageNo - 1) * perPage;
      let query = `
  SELECT education.*, 
         users_created.full_name AS created_by,
         users_modified.full_name AS modified_by 
  FROM education 
  LEFT JOIN users AS users_created ON education.created_by = users_created.id 
  LEFT JOIN users AS users_modified ON education.modified_by = users_modified.id 
  ORDER BY education.id DESC
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

module.exports = EducationModel;
