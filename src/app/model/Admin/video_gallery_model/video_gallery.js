const connection = require("../../../../connection/config/database");

const VideoGalleryModel = {
  video_gallery_create: async (req, res) => {
    try {
      const { title, link, status, created_by, video_category, description } =
        req.body;

      // Using parameterized query to prevent SQL injection
      const insertQuery =
        "INSERT INTO video_gallery (title,link,status,created_by, video_category,description) VALUES (?,?,?,?,?,?)";

      const result = await connection.query(insertQuery, [
        title,
        link,
        status,
        created_by,
        video_category,
        description,
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

  video_gallery_single: async (req, res) => {
    try {
      const query = "SELECT * FROM video_gallery WHERE id = ?";
      connection.query(query, [req.params.id], (error, result) => {
        if (!error && result.length > 0) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error || "Video category not found");
          return res.status(404).json({ message: "Video category not found." });
        }
      });
    } catch (error) {
      console.log(error);
    }
  },

  // video_gallery_list: async (req, res) => {
  //   try {
  //     // const data = "select * from  video_gallery";
  //     const data = `SELECT ec.*, u.full_name AS author_name
  //     FROM video_gallery ec
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

  video_gallery_list: async (req, res) => {
    try {
      const data = `SELECT n.*, u.full_name AS author_name, nc.name
                   FROM video_gallery n
                   LEFT JOIN users u ON n.created_by = u.id
                    LEFT JOIN video_category nc ON n.video_category = nc.id
                   ORDER BY n.id DESC;`;

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

  // news_list: async (req, res) => {
  //   try {
  //     const data = `SELECT n.*, u.full_name AS author_name, nc.name
  //                  FROM news n
  //                  LEFT JOIN users u ON n.created_by = u.id
  //                  LEFT JOIN news_category nc ON n.news_category = nc.id
  //                  ORDER BY n.id DESC;`;

  //     connection.query(data, function (error, result) {
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

  video_gallery_update: async (req, res) => {
    try {
      const { title, link, status, video_category, description, modified_by } =
        req.body;
      const query = `UPDATE video_gallery SET title = ?, link = ?, status = ?, video_category = ?, description = ?, modified_by = ? WHERE id = ?`;

      connection.query(
        query,
        [
          title,
          link,
          status,
          video_category,
          description,
          modified_by,
          [req.params.id],
        ],
        (error, result) => {
          if (!error && result.affectedRows > 0) {
            console.log(result);
            return res.send(result);
          } else {
            console.log(error || "News category not found");
            return res
              .status(404)
              .json({ message: "News category not found." });
          }
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error." });
    }
  },

  video_gallery_delete: async (req, res) => {
    try {
      const query = "DELETE FROM video_gallery WHERE id = ?";
      connection.query(query, [req.params.id], (error, result) => {
        if (!error && result.affectedRows > 0) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error || "News category not found");
          return res.status(404).json({ message: "News category not found." });
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

  video_gallery_list_paigination: async (req, res) => {
    const pageNo = Number(req.params.pageNo);
    const perPage = Number(req.params.perPage);
    try {
      const skipRows = (pageNo - 1) * perPage;
      let query = `
  SELECT video_gallery.*, 
         users_created.full_name AS created_by,
         users_modified.full_name AS modified_by,
         video_category.name AS video_category 
  FROM video_gallery 
  LEFT JOIN users AS users_created ON video_gallery.created_by = users_created.id 
  LEFT JOIN users AS users_modified ON video_gallery.modified_by = users_modified.id
  LEFT JOIN video_category ON video_gallery.video_category = video_category.id  
  ORDER BY video_gallery.id DESC
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

  //   news_list_paigination: async (req, res) => {
  //     const pageNo = Number(req.params.pageNo);
  //     const perPage = Number(req.params.perPage);
  //     try {
  //       const skipRows = (pageNo - 1) * perPage;
  //       let query = `
  //   SELECT news.*,
  //          users_created.full_name AS created_by,
  //          users_modified.full_name AS modified_by,
  //          news_category.name AS news_category
  //   FROM news
  //   LEFT JOIN users AS users_created ON news.created_by = users_created.id
  //   LEFT JOIN users AS users_modified ON news.modified_by = users_modified.id
  //     LEFT JOIN news_category ON news.news_category = news_category.id
  //   ORDER BY news.id DESC
  //   LIMIT ?, ?
  // `;

  //       connection.query(query, [skipRows, perPage], (error, result) => {
  //         console.log(result);
  //         if (!error) {
  //           res.send(result);
  //         } else {
  //           console.log(error);
  //         }
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
};

module.exports = VideoGalleryModel;
