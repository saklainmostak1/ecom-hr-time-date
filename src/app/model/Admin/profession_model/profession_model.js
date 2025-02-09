const connection = require("../../../../connection/config/database");

const ProfessionModel = {
  profession_create: async (req, res) => {
    try {
      const { profession_name, created_by } = req.body;

      // Using parameterized query to prevent SQL injection
      const insertQuery =
        "INSERT INTO profession (profession_name,created_by) VALUES (?,?)";
      const result = await connection.query(insertQuery, [
        profession_name,
        created_by,
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

  profession_list: async (req, res) => {
    try {
      const data = `SELECT bg.*, u.full_name AS author_name
                   FROM profession bg
               LEFT    JOIN users u ON bg.created_by = u.id
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

  // profession_list: async (req, res) => {
  //   try {
  //     // const data = "select * from  notice_category";

  //     const data = `SELECT ec.*, u.full_name AS author_name
  //     FROM profession ec
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

  profession_single: async (req, res) => {
    try {
      const query = "SELECT * FROM profession WHERE id = ?";
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

  profession_update: async (req, res) => {
    try {
      const { profession_name, modified_by } = req.body;
      const query = `UPDATE profession SET profession_name = ?, modified_by = ? WHERE id = ?`;

      connection.query(
        query,
        [profession_name, modified_by, req.params.id],
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

  

  profession_delete: async (req, res) => {
    try {
      const query = "DELETE FROM profession WHERE id = ?";
      connection.query(query, [req.params.id], (error, result) => {
        if (!error && result.affectedRows > 0) {
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

  profession_list_paigination: async (req, res) => {
    const pageNo = Number(req.params.pageNo);
    const perPage = Number(req.params.perPage);
    try {
      const skipRows = (pageNo - 1) * perPage;
      let query = `
  SELECT profession.*, 
         users_created.full_name AS created_by,
         users_modified.full_name AS modified_by 
  FROM profession 
  LEFT JOIN users AS users_created ON profession.created_by = users_created.id 
  LEFT JOIN users AS users_modified ON profession.modified_by = users_modified.id 
  ORDER BY profession.id DESC
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

module.exports = ProfessionModel;
