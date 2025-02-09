const connection = require("../../../../connection/config/database");

const BloodGroupModel = {
  blood_group_create: async (req, res) => {
    try {
      const brands = req.body;
      const results = [];

      for (const brand of brands) {
        const { blood_group_name, created_by } = brand;

        // if (!branch_name || !status_id) {
        //   return res.status(400).json({ message: 'brand name and status ID are required' });
        // }

        const processedbrandName = blood_group_name
          ?.replace(/\s+/g, " ")
          .trim();

        const selectQuery =
          "SELECT * FROM blood_group WHERE TRIM(blood_group_name) = ?";
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
            "INSERT INTO blood_group (blood_group_name, created_by) VALUES (?, ?)";
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

  blood_group_list: async (req, res) => {
    try {
      const data = `SELECT bg.*, u.full_name AS author_name
                   FROM blood_group bg
                 LEFT  JOIN users u ON bg.created_by = u.id
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

  // blood_group_list: async (req, res) => {
  //   try {
  //     const data = `SELECT ec.*, u.full_name AS author_name
  //     FROM blood_group ec

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

  // blood_list_paigination: async (req, res) => {
  //   const pageNo = Number(req.params.pageNo);
  //   const perPage = Number(req.params.perPage);
  //   try {
  //     const skipRows = (pageNo - 1) * perPage;
  //     // const query = "select * from  brand LIMIT ?, ?";
  //     // const query = "SELECT brand.*, users.full_name AS created_by FROM brand INNER JOIN users ON brand.created_by = users.id LIMIT ?, ?";
  //     let query = `
  //     SELECT blood_group.*,
  //            users_created.full_name AS created_by,
  //            users_modified.full_name AS modified_by
  //     FROM blood_group
  //     LEFT JOIN users AS users_created ON blood_group.created_by = users_created.id
  //     LEFT JOIN users AS users_modified ON blood_group.modified_by = users_modified.id
  //     ORDER BY blood_group.id DESC
  //     LIMIT ?, ?
  //   `;
  //     connection.query(query, [skipRows, perPage], (error, result) => {
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

  blood_group_single: async (req, res) => {
    try {
      const query = "SELECT * FROM blood_group WHERE id = ?";
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

  blood_group_update: async (req, res) => {
    try {
      const { blood_group_name, modified_by } = req.body;
      const query = `UPDATE blood_group SET blood_group_name = ?, modified_by = ? WHERE id = ?`;

      connection.query(
        query,
        [blood_group_name, modified_by, req.params.id],
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

  blood_group_delete: async (req, res) => {
    try {
      const shiftId = req.params.id;

      console.log(shiftId);

      // First, check if the shift_id is referenced in employee_joining
      const checkQuery =
        "SELECT COUNT(*) AS count FROM users WHERE blood_group_id = ?";
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
            .json({ message: "Cannot delete: blood group in  use." });
        }

        // Proceed with deletion if not referenced
        const deleteQuery = "DELETE FROM blood_group WHERE id = ?";
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

  blood_group_list_paigination: async (req, res) => {
    const pageNo = Number(req.params.pageNo);
    const perPage = Number(req.params.perPage);
    try {
      const skipRows = (pageNo - 1) * perPage;
      let query = `
  SELECT blood_group.*, 
         users_created.full_name AS created_by,
         users_modified.full_name AS modified_by 
  FROM blood_group 
  LEFT JOIN users AS users_created ON blood_group.created_by = users_created.id 
  LEFT JOIN users AS users_modified ON blood_group.modified_by = users_modified.id 
  ORDER BY blood_group.id DESC
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

module.exports = BloodGroupModel;
