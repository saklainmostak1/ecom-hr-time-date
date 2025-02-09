

const connection = require('../../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

const SliderModel = {

    transition_list: async (req, res) => {
        try {
            const data = "select * from  transition";

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

    slider_list: async (req, res) => {
        try {
            const data = "select * from  slider";

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

    slider_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);

        try {
            if (isNaN(pageNo) || isNaN(perPage) || pageNo < 1 || perPage < 1) {
                return res.status(400).json({ error: "Invalid pagination parameters" });
            }

            const skipRows = (pageNo - 1) * perPage;

            let query = `
                SELECT s.*, 
                       users_created.full_name AS created_by,
                       users_modified.full_name AS modified_by
                      
                FROM slider s
                LEFT JOIN users AS users_created ON s.created_by = users_created.id 
                LEFT JOIN users AS users_modified ON s.modified_by = users_modified.id 
                ORDER BY s.id DESC
                LIMIT ?, ?
            `;

            connection.query(query, [skipRows, perPage], (error, result) => {
                if (error) {
                    console.error("Database query error:", error);
                    return res.status(500).json({ error: "Database error occurred" });
                }

                res.json(result);
            });
        } catch (error) {
            console.error("Unexpected error:", error);
            res.status(500).json({ error: "Unexpected error occurred" });
        }
    },
    slider_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { fromDate, toDate, title } = req.body;

            // Construct the base SQL query
            let sql = `
                      SELECT s.*, 
                       users_created.full_name AS created_by,
                       users_modified.full_name AS modified_by
                      
                FROM slider s
                LEFT JOIN users AS users_created ON s.created_by = users_created.id 
                LEFT JOIN users AS users_modified ON s.modified_by = users_modified.id  
            WHERE 1
            `;


            if (fromDate && toDate) {
                sql += ` AND s.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
            }




            if (title) {

                sql += ` AND LOWER(s.slider_name) LIKE '%${title}%'`;
            }

            sql += ` ORDER BY s.id DESC`

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


    slider_img_link_delete: async (req, res) => {
        try {
          const { id } = req.params;
          connection.beginTransaction(async (err) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ message: 'Transaction initialization failed.' });
            }
      
            try {
              // Delete from slider_link where slider_img_id matches
              const deleteSliderLinkQuery = 'DELETE FROM slider_link WHERE slider_img_id = ?';
              connection.query(deleteSliderLinkQuery, [id], (error, result) => {
                if (error) {
                  return connection.rollback(() => {
                    console.log(error);
                    return res.status(500).json({ message: 'Error deleting from slider_link.' });
                  });
                }
      
                console.log(`Deleted from slider_link: ${result.affectedRows} rows`);
      
                // Delete from slider_img
                const deleteSliderImgQuery = 'DELETE FROM slider_img WHERE id = ?';
                connection.query(deleteSliderImgQuery, [id], (error, result) => {
                  if (error) {
                    return connection.rollback(() => {
                      console.log(error);
                      return res.status(500).json({ message: 'Error deleting from slider_img.' });
                    });
                  }
      
                  if (result.affectedRows > 0) {
                    connection.commit((err) => {
                      if (err) {
                        return connection.rollback(() => {
                          console.log(err);
                          return res.status(500).json({ message: 'Transaction commit failed.' });
                        });
                      }
      
                      console.log(`Deleted from slider_img: ${result.affectedRows} rows`);
                      return res.json({ message: 'Successfully deleted records.' });
                    });
                  } else {
                    return connection.rollback(() => {
                      console.log('Slider_img not found');
                      return res.status(404).json({ message: 'Slider_img not found.' });
                    });
                  }
                });
              });
            } catch (error) {
              connection.rollback(() => {
                console.log(error);
                return res.status(500).json({ message: 'Error occurred during deletion.' });
              });
            }
          });
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: 'Server error.' });
        }
      },
      

    slider_delete: async (req, res) => {
        try {
            // First, delete from slider_link where slider_img_id matches
            const deleteSliderLinkQuery = 'DELETE FROM slider_link WHERE slider_img_id IN (SELECT id FROM slider_img WHERE slider_id = ?)';
            connection.query(deleteSliderLinkQuery, [req.params.id], (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Error deleting from slider_link.' });
                }

                // Then, delete from slider_img where slider_id matches
                const deleteSliderImgQuery = 'DELETE FROM slider_img WHERE slider_id = ?';
                connection.query(deleteSliderImgQuery, [req.params.id], (error, result) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: 'Error deleting from slider_img.' });
                    }

                    // Finally, delete from the slider table
                    const deleteSliderQuery = 'DELETE FROM slider WHERE id = ?';
                    connection.query(deleteSliderQuery, [req.params.id], (error, result) => {
                        if (!error && result.affectedRows > 0) {
                            console.log(result);
                            return res.send(result);
                        } else {
                            console.log(error || 'Slider not found');
                            return res.status(404).json({ message: 'Slider not found.' });
                        }
                    });
                });
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred.' });
        }
    },

    slider_list_all: async (req, res) => {
        try {
            // SQL Query to join slider, slider_img, and slider_link tables
            const query = `
                SELECT 
                    s.id AS slider_id,
                    s.slider_name,
                    s.created_by AS slider_created_by,
                    s.modified_by AS slider_modified_by,
                    s.created_date AS slider_created_date,
                    s.modified_date AS slider_modified_date,
                    s.transition,
                    s.slider_type,
                    s.slider_design_id,
                    
                    si.id AS slider_img_id,
                    si.title AS img_title,
                    si.summary AS img_summary,
                    si.slider_image AS img_slider_image,
                    si.link AS img_link,
                    si.status AS img_status,
                    si.created_by AS img_created_by,
                    si.modified_by AS img_modified_by,
                    si.created_date AS img_created_date,
                    si.modified_date AS img_modified_date,
                    
                    sl.id AS link_id,
                    sl.sub_title AS link_sub_title,
                    sl.sub_link AS link_sub_link,
                    sl.created_by AS link_created_by,
                    sl.created_date AS link_created_date,
                    sl.modified_by AS link_modified_by,
                    sl.modified_date AS link_modified_date,
                    sl.slider_img_id
                FROM slider s
                LEFT JOIN slider_img si ON s.id = si.slider_id
                LEFT JOIN slider_link sl ON si.id = sl.slider_img_id
            `;

            // Execute query
            connection.query(query, function (error, results) {
                if (error) {
                    console.error(error);
                    return res.status(500).send({ error: 'Database query failed.' });
                }

                // Format the results into a structured response
                const purchases = results.reduce((acc, row) => {
                    // Find or create the slider object
                    let slider = acc.find(s => s.id === row.slider_id);
                    if (!slider) {
                        slider = {
                            id: row.slider_id,
                            slider_name: row.slider_name,
                            created_by: row.slider_created_by,
                            modified_by: row.slider_modified_by,
                            created_date: row.slider_created_date,
                            modified_date: row.slider_modified_date,
                            transition: row.transition,
                            slider_type: row.slider_type,
                            slider_design_id: row.slider_design_id,
                            slider_img: []
                        };
                        acc.push(slider);
                    }

                    // Find or create the slider_img object
                    if (row.slider_img_id) {
                        let sliderImg = slider.slider_img.find(si => si.id === row.slider_img_id);
                        if (!sliderImg) {
                            sliderImg = {
                                id: row.slider_img_id,
                                title: row.img_title,
                                summary: row.img_summary,
                                slider_image: row.img_slider_image,
                                link: row.img_link,
                                status: row.img_status,
                                created_by: row.img_created_by,
                                modified_by: row.img_modified_by,
                                created_date: row.img_created_date,
                                modified_date: row.img_modified_date,
                                slider_link: []
                            };
                            slider.slider_img.push(sliderImg);
                        }

                        // Add slider_link to slider_img
                        if (row.link_id) {
                            sliderImg.slider_link.push({
                                id: row.link_id,
                                sub_title: row.link_sub_title,
                                sub_link: row.link_sub_link,
                                created_by: row.link_created_by,
                                created_date: row.link_created_date,
                                modified_by: row.link_modified_by,
                                modified_date: row.link_modified_date
                            });
                        }
                    }

                    return acc;
                }, []);

                // Send the structured response
                res.send(purchases);
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'An error occurred while fetching purchase data.' });
        }
    },
    // sales_list_single: async (req, res) => {
    //     try {
    //         const sliderId = req.params.id; // Get the slider ID from request parameters

    //         // SQL Query to join slider, slider_img, and slider_link tables with a WHERE clause
    //         const query = `
    //             SELECT 
    //                 s.id AS slider_id,
    //                 s.slider_name,
    //                 s.created_by AS slider_created_by,
    //                 s.modified_by AS slider_modified_by,
    //                 s.created_date AS slider_created_date,
    //                 s.modified_date AS slider_modified_date,
    //                 s.transition,
    //                 s.slider_type,
    //                 s.slider_design_id,

    //                 si.id AS slider_img_id,
    //                 si.title AS img_title,
    //                 si.summary AS img_summary,
    //                 si.type AS type,
    //                 si.slider_image AS img_slider_image,
    //                 si.link AS img_link,
    //                 si.status AS img_status,
    //                 si.created_by AS img_created_by,
    //                 si.modified_by AS img_modified_by,
    //                 si.created_date AS img_created_date,
    //                 si.modified_date AS img_modified_date,

    //                 sl.id AS link_id,
    //                 sl.type AS type,
    //                 sl.sub_title AS link_sub_title,
    //                 sl.sub_link AS link_sub_link,
    //                 sl.created_by AS link_created_by,
    //                 sl.created_date AS link_created_date,
    //                 sl.modified_by AS link_modified_by,
    //                 sl.modified_date AS link_modified_date,
    //                 sl.slider_img_id
    //             FROM slider s
    //             LEFT JOIN slider_img si ON s.id = si.slider_id
    //             LEFT JOIN slider_link sl ON si.id = sl.slider_img_id
    //             WHERE s.id = ?
    //         `;

    //         // Execute query
    //         connection.query(query, [sliderId], function (error, results) {
    //             if (error) {
    //                 console.error(error);
    //                 return res.status(500).send({ error: 'Database query failed.' });
    //             }

    //             // Format the results into a structured response
    //             const purchases = results.reduce((acc, row) => {
    //                 // Find or create the slider object
    //                 let slider = acc.find(s => s.id === row.slider_id);
    //                 if (!slider) {
    //                     slider = {
    //                         id: row.slider_id,
    //                         slider_name: row.slider_name,
    //                         created_by: row.slider_created_by,
    //                         modified_by: row.slider_modified_by,
    //                         created_date: row.slider_created_date,
    //                         modified_date: row.slider_modified_date,
    //                         transition: row.transition,
    //                         slider_type: row.slider_type,
    //                         slider_design_id: row.slider_design_id,
    //                         linkDataValue1: []
    //                     };
    //                     acc.push(slider);
    //                 }

    //                 // Find or create the slider_img object
    //                 if (row.slider_img_id) {
    //                     let sliderImg = slider.linkDataValue1.find(si => si.id === row.slider_img_id);
    //                     if (!sliderImg) {
    //                         sliderImg = {
    //                             id: row.slider_img_id,
    //                             name: row.img_title,
    //                             summary: row.img_summary,
    //                             file_path: row.img_slider_image,
    //                             value: row.img_link,
    //                             type: row.type,
    //                             status: row.img_status,
    //                             created_by: row.img_created_by,
    //                             modified_by: row.img_modified_by,
    //                             created_date: row.img_created_date,
    //                             modified_date: row.img_modified_date,
    //                             linkDataValue2: []
    //                         };
    //                         slider.linkDataValue1.push(sliderImg);
    //                     }

    //                     // Add slider_link to slider_img
    //                     if (row.link_id) {
    //                         sliderImg.linkDataValue2.push({
    //                             id: row.link_id,
    //                             name: row.link_sub_title,
    //                             type: row.type,
    //                             value: row.link_sub_link,
    //                             created_by: row.link_created_by,
    //                             created_date: row.link_created_date,
    //                             modified_by: row.link_modified_by,
    //                             modified_date: row.link_modified_date
    //                         });
    //                     }
    //                 }

    //                 return acc;
    //             }, []);

    //             // Send the structured response
    //             res.send(purchases);
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send({ error: 'An error occurred while fetching purchase data.' });
    //     }
    // },


    // sales_list_single: async (req, res) => {
    //     try {
    //         const sliderId = req.params.id; // Get the slider ID from request parameters

    //         // SQL Query to join slider, slider_img, and slider_link tables with a WHERE clause
    //         const query = `
    //             SELECT 
    //                 s.id AS slider_id,
    //                 s.slider_name,
    //                 s.created_by AS slider_created_by,
    //                 s.modified_by AS slider_modified_by,
    //                 s.created_date AS slider_created_date,
    //                 s.modified_date AS slider_modified_date,
    //                 s.transition,
    //                 s.slider_type,
    //                 s.slider_design_id,

    //                 si.id AS slider_img_id,
    //                 si.title AS img_title,
    //                 si.summary AS img_summary,
    //                 si.type AS type,
    //                 si.slider_image AS img_slider_image,
    //                 si.link AS img_link,
    //                 si.status AS img_status,
    //                 si.created_by AS img_created_by,
    //                 si.modified_by AS img_modified_by,
    //                 si.created_date AS img_created_date,
    //                 si.modified_date AS img_modified_date,

    //                 sl.id AS link_id,
    //                 sl.type AS type,
    //                 sl.sub_title AS link_sub_title,
    //                 sl.sub_link AS link_sub_link,
    //                 sl.created_by AS link_created_by,
    //                 sl.created_date AS link_created_date,
    //                 sl.modified_by AS link_modified_by,
    //                 sl.modified_date AS link_modified_date,
    //                 sl.slider_img_id
    //             FROM slider s
    //             LEFT JOIN slider_img si ON s.id = si.slider_id
    //             LEFT JOIN slider_link sl ON si.id = sl.slider_img_id
    //             WHERE s.id = ?
    //         `;

    //         // Execute query
    //         connection.query(query, [sliderId], function (error, results) {
    //             if (error) {
    //                 console.error(error);
    //                 return res.status(500).send({ error: 'Database query failed.' });
    //             }

    //             // Format the results into a structured response
    //             const purchases = results.reduce((acc, row) => {
    //                 // Find or create the slider object
    //                 let slider = acc.find(s => s.id === row.slider_id);
    //                 if (!slider) {
    //                     slider = {
    //                         id: row.slider_id,
    //                         slider_name: row.slider_name,
    //                         created_by: row.slider_created_by,
    //                         modified_by: row.slider_modified_by,
    //                         created_date: row.slider_created_date,
    //                         modified_date: row.slider_modified_date,
    //                         transition: row.transition,
    //                         slider_type: row.slider_type,
    //                         slider_design_id: row.slider_design_id,
    //                         linkDataValue2: {} // Initialize as an object
    //                     };
    //                     acc.push(slider);
    //                 }

    //                 // Add or update the slider_img in linkDataValue2
    //                 if (row.slider_img_id) {
    //                     if (!slider.linkDataValue2[row.slider_img_id]) {
    //                         slider.linkDataValue2[row.slider_img_id] = {
    //                             id: row.slider_img_id,
    //                             name: row.img_title,
    //                             summary: row.img_summary,
    //                             file_path: row.img_slider_image,
    //                             value: row.img_link,
    //                             type: row.type,
    //                             status: row.img_status,
    //                             created_by: row.img_created_by,
    //                             modified_by: row.img_modified_by,
    //                             created_date: row.img_created_date,
    //                             modified_date: row.img_modified_date,
    //                             linkDataValue1: {} // Initialize as an object
    //                         };
    //                     }

    //                     // Add or update the slider_link in linkDataValue1
    //                     if (row.link_id) {
    //                         const sliderImg = slider.linkDataValue2[row.slider_img_id];
    //                         sliderImg.linkDataValue1[row.link_id] = {
    //                             id: row.link_id,
    //                             name: row.link_sub_title,
    //                             type: row.type,
    //                             value: row.link_sub_link,
    //                             created_by: row.link_created_by,
    //                             created_date: row.link_created_date,
    //                             modified_by: row.link_modified_by,
    //                             modified_date: row.link_modified_date
    //                         };
    //                     }
    //                 }

    //                 return acc;
    //             }, []);

    //             // Send the structured response
    //             res.send(purchases);
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send({ error: 'An error occurred while fetching purchase data.' });
    //     }
    // },
  
    
    
    sales_list_single: async (req, res) => {
        try {
            const sliderId = req.params.id; // Get the slider ID from request parameters

            // SQL Query to join slider, slider_img, and slider_link tables with a WHERE clause
            const query = `
                SELECT 
                    s.id AS slider_id,
                    s.slider_name,
                    s.created_by AS slider_created_by,
                    s.modified_by AS slider_modified_by,
                    s.created_date AS slider_created_date,
                    s.modified_date AS slider_modified_date,
                    s.transition,
                    s.slider_type,
                    s.slider_design_id,

                    si.id AS slider_img_id,
                    si.title AS img_title,
                    si.sub_title AS sub_title,
                    si.summary AS img_summary,
                    si.type AS type,
                    si.slider_image AS img_slider_image,
                    si.link AS img_link,
                    si.status AS img_status,
                    si.created_by AS img_created_by,
                    si.modified_by AS img_modified_by,
                    si.created_date AS img_created_date,
                    si.modified_date AS img_modified_date,

                    sl.id AS link_id,
                    sl.type AS type,
                    sl.btn_align AS btn_align,
                    sl.btn_show AS btn_show,
                    sl.sub_title AS link_sub_title,
                    sl.sub_link AS link_sub_link,
                    sl.created_by AS link_created_by,
                    sl.created_date AS link_created_date,
                    sl.modified_by AS link_modified_by,
                    sl.modified_date AS link_modified_date,
                    sl.slider_img_id
                FROM slider s
                LEFT JOIN slider_img si ON s.id = si.slider_id
                LEFT JOIN slider_link sl ON si.id = sl.slider_img_id
                WHERE s.id = ?
            `;

            // Execute query
            connection.query(query, [sliderId], function (error, results) {
                if (error) {
                    console.error(error);
                    return res.status(500).send({ error: 'Database query failed.' });
                }

                // Format the results into a structured response
                const purchases = results.reduce((acc, row) => {
                    // Find or create the slider object
                    let slider = acc.find(s => s.id === row.slider_id);
                    if (!slider) {
                        slider = {
                            id: row.slider_id,
                            slider_name: row.slider_name,
                            created_by: row.slider_created_by,
                            modified_by: row.slider_modified_by,
                            created_date: row.slider_created_date,
                            modified_date: row.slider_modified_date,
                            transition: row.transition,
                            slider_type: row.slider_type,
                            slider_design_id: row.slider_design_id,
                            linkDataValue2: []
                        };
                        acc.push(slider);
                    }

                    // Find or create the slider_img object
                    if (row.slider_img_id) {
                        let sliderImg = slider.linkDataValue2.find(si => si.id === row.slider_img_id);
                        if (!sliderImg) {
                            sliderImg = {
                                id: row.slider_img_id,
                                name: row.img_title,
                                summary: row.img_summary,
                                file_path: row.img_slider_image,
                                sub_title: row.sub_title,
                                value: row.img_link,
                                type: row.type,
                                status: row.img_status,
                                created_by: row.img_created_by,
                                modified_by: row.img_modified_by,
                                created_date: row.img_created_date,
                                modified_date: row.img_modified_date,
                                linkDataValue1: []
                            };
                            slider.linkDataValue2.push(sliderImg);
                        }

                        // Add slider_link to slider_img
                        if (row.link_id) {
                            sliderImg.linkDataValue1.push({
                                id: row.link_id,
                                name: row.link_sub_title,
                                align: row.btn_align,
                                show: row.btn_show,
                                type: row.type,
                                value: row.link_sub_link,
                                created_by: row.link_created_by,
                                created_date: row.link_created_date,
                                modified_by: row.link_modified_by,
                                modified_date: row.link_modified_date
                            });
                        }
                    }

                    return acc;
                }, []);

                // Send the structured response
                res.send(purchases);
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'An error occurred while fetching purchase data.' });
        }
    },

    all_table_data: async (req, res) => {
        const { pageListTable } = req.body
        try {
            const data = `select * from  ${pageListTable ? pageListTable : 'page_list'}`;

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

    slider_create: async (req, res) => {
        try {
            const { formData, selectedMonths, slider_name, created_by } = req.body;

            // Insert into slider_create table
            const insertSliderQuery = `INSERT INTO slider (slider_name, transition, created_by) VALUES (?, ?, ?)`;
            const sliderResult = await new Promise((resolve, reject) => {
                connection.query(
                    insertSliderQuery,
                    [
                        slider_name,
                        selectedMonths.map((month) => month.value).join(", "),
                        created_by
                    ],
                    (err, result) => {
                        if (err) {
                            console.error("Error inserting into slider:", err);
                            return reject(err);
                        }
                        resolve(result);
                    }
                );
            });

            const sliderId = sliderResult.insertId;

            // Prepare queries for slider_image and slider_link
            const sliderImageInsertQuery = `INSERT INTO slider_img (type, slider_id, title, summary, slider_image, status, link, created_by) VALUES ?`;
            const sliderLinkInsertQuery = `INSERT INTO slider_link (type, slider_id, slider_img_id, sub_title, sub_link, created_by, btn_align, btn_show) VALUES ?`;

            const sliderImageValues = [];
            const sliderLinkValues = [];

            // Loop through formData to prepare data for multiple inserts
            for (const item of formData) {
                const {
                    file_path,
                    linkDataValue1: { type, title, summary, title_sub, status, link1, link2 },
                    linkDataValue2: { link1: linkDataValue2Link1, }
                } = item;

                // Push data for slider_image
                sliderImageValues.push([
                    type,
                    sliderId,
                    title,
                    summary,
                    file_path,
                    status,
                    linkDataValue2Link1.value,
                    created_by
                ]);
            }

            // Insert into slider_image and fetch the generated IDs
            const sliderImageResult = await new Promise((resolve, reject) => {
                connection.query(sliderImageInsertQuery, [sliderImageValues], (err, result) => {
                    if (err) {
                        console.error("Error inserting into slider_image:", err);
                        return reject(err);
                    }
                    resolve(result);
                });
            });

            const imageInsertIds = Array.from(
                { length: sliderImageResult.affectedRows },
                (_, i) => sliderImageResult.insertId + i
            );

            // Prepare slider_link entries for both `link1` and `link2`
            for (let i = 0; i < formData.length; i++) {
                const {
                    linkDataValue1: { type, title_sub, link1, link2 }
                } = formData[i];

                // Insert a record for `link1`
                sliderLinkValues.push([
                    type,
                    sliderId,
                    imageInsertIds[i],
                    title_sub,
                    link1.value,
                    created_by,
                    link1.align,
                    link1.show,
                ]);

                // Insert a record for `link2`
                sliderLinkValues.push([
                    type,
                    sliderId,
                    imageInsertIds[i],
                    title_sub,
                    link2.value,
                    created_by,
                    link2.align,
                    link2.show
                ]);
            }

            // Insert into slider_link
            await new Promise((resolve, reject) => {
                connection.query(sliderLinkInsertQuery, [sliderLinkValues], (err, result) => {
                    if (err) {
                        console.error("Error inserting into slider_link:", err);
                        return reject(err);
                    }
                    resolve(result);
                });
            });

            // Respond with success
            res.status(200).json({ sliderId, message: "Slider created successfully" });
        } catch (error) {
            console.error("Error processing the request:", error);
            res.status(500).json({ message: "Error processing the request" });
        }
    },

//     slider_update: async (req, res) => {
//         try {
//             const { formData, selectedMonths, slider_name, created_by } = req.body;
    
//             // Update slider table
//             const updateSliderQuery = `UPDATE slider SET slider_name = ?, transition = ?, modified_by = ?, modified_date = NOW() WHERE id = ?`;
//             const sliderId = req.body.slider_id; // Assuming slider_id is passed in the request
    
//             await new Promise((resolve, reject) => {
//                 connection.query(
//                     updateSliderQuery,
//                     [
//                         slider_name,
//                         selectedMonths.map((month) => month.value).join(", "),
//                         created_by,
//                         sliderId
//                     ],
//                     (err, result) => {
//                         if (err) {
//                             console.error("Error updating slider:", err);
//                             return reject(err);
//                         }
//                         resolve(result);
//                     }
//                 );
//             });
    
//             // Delete existing slider_img and slider_link entries for the slider
//             const deleteSliderImgQuery = `DELETE FROM slider_img WHERE slider_id = ?`;
//             const deleteSliderLinkQuery = `DELETE FROM slider_link WHERE slider_id = ?`;
    
//             await new Promise((resolve, reject) => {
//                 connection.query(deleteSliderImgQuery, [sliderId], (err, result) => {
//                     if (err) {
//                         console.error("Error deleting slider_img:", err);
//                         return reject(err);
//                     }
//                     resolve(result);
//                 });
//             });
    
//             await new Promise((resolve, reject) => {
//                 connection.query(deleteSliderLinkQuery, [sliderId], (err, result) => {
//                     if (err) {
//                         console.error("Error deleting slider_link:", err);
//                         return reject(err);
//                     }
//                     resolve(result);
//                 });
//             });
    
//             // Insert updated slider_img and slider_link entries
//             const sliderImageInsertQuery = `INSERT INTO slider_img (type, slider_id, title, summary, slider_image, status, link, created_by) VALUES ?`;
//             const sliderLinkInsertQuery = `INSERT INTO slider_link (type, slider_id, slider_img_id, sub_title, sub_link, created_by, btn_align, btn_show) VALUES ?`;
    
//             const sliderImageValues = [];
//             const sliderLinkValues = [];
    
//             for (const key in formData.linkDataValue2) {
//                 const item = formData.linkDataValue2[key];
//                 const {
//                     file_path,
//                     name,
//                     summary,
//                     sub_title,
//                     value,
//                     type,
//                     status,
//                     linkDataValue1
//                 } = item;
    
//                 // Push data for slider_img
//                 sliderImageValues.push([
//                     type,
//                     sliderId,
//                     name,
//                     summary,
//                     file_path,
//                     status,
//                     value,
//                     created_by
//                 ]);
    
//                 // Prepare slider_link entries for linkDataValue1
//                 linkDataValue1.forEach((link) => {
//                     sliderLinkValues.push([
//                         link.type,
//                         sliderId,
//                         null, // Image ID will be linked after inserting slider_img
//                         sub_title,
//                         link.value,
//                         created_by,
//                         null, // btn_align placeholder
//                         null  // btn_show placeholder
//                     ]);
//                 });
//             }
    
//             // Insert into slider_img
//             const sliderImageResult = await new Promise((resolve, reject) => {
//                 connection.query(sliderImageInsertQuery, [sliderImageValues], (err, result) => {
//                     if (err) {
//                         console.error("Error inserting into slider_img:", err);
//                         return reject(err);
//                     }
//                     resolve(result);
//                 });
//             });
    
//             // Map generated slider_img IDs to link entries
//             const imageInsertIds = Array.from(
//                 { length: sliderImageResult.affectedRows },
//                 (_, i) => sliderImageResult.insertId + i
//             );
    
//             sliderLinkValues.forEach((link, index) => {
//                 link[2] = imageInsertIds[index]; // Assign the correct slider_img_id
//             });
    
//             // Insert into slider_link
//             await new Promise((resolve, reject) => {
//                 connection.query(sliderLinkInsertQuery, [sliderLinkValues], (err, result) => {
//                     if (err) {
//                         console.error("Error inserting into slider_link:", err);
//                         return reject(err);
//                     }
//                     resolve(result);
//                 });
//             });
    
//             // Respond with success
//             res.status(200).json({ sliderId, message: "Slider updated successfully" });
//         } catch (error) {
//             console.error("Error processing the update request:", error);
//             res.status(500).json({ message: "Error processing the update request" });
//         }
//     },
//   slider_update: async (req, res) => {
//         try {
//             const { formData, selectedMonths, slider_name, created_by } = req.body;
    
//             // Insert into the slider table
//             const insertSliderQuery = `INSERT INTO slider (slider_name, transition, created_by) VALUES (?, ?, ?)`;
//             const sliderResult = await new Promise((resolve, reject) => {
//                 connection.query(
//                     insertSliderQuery,
//                     [
//                         slider_name,
//                         selectedMonths.map((month) => month.value).join(", "),
//                         created_by,
//                     ],
//                     (err, result) => {
//                         if (err) {
//                             console.error("Error inserting into slider:", err);
//                             return reject(err);
//                         }
//                         resolve(result);
//                     }
//                 );
//             });
    
//             const sliderId = sliderResult.insertId;
    
//             // Prepare for slider_img insert
//             const sliderImageInsertQuery = `
//                 INSERT INTO slider_img (type, slider_id, title, summary, slider_image, status, link, created_by) 
//                 VALUES ?
//             `;
//             const sliderImageValues = [];
    
//             // Prepare slider_img data
//             for (const key in formData.linkDataValue2) {
//                 const item = formData.linkDataValue2[key];
//                 sliderImageValues.push([
//                     item.type,
//                     sliderId,
//                     item.name,
//                     item.summary,
//                     item.file_path,
//                     item.status,
//                     item.value,
//                     created_by,
//                 ]);
//             }
    
//             // Insert into slider_img and retrieve IDs
//             const sliderImageResult = await new Promise((resolve, reject) => {
//                 connection.query(sliderImageInsertQuery, [sliderImageValues], (err, result) => {
//                     if (err) {
//                         console.error("Error inserting into slider_img:", err);
//                         return reject(err);
//                     }
//                     resolve(result);
//                 });
//             });
    
//             // Collect inserted IDs
//             const imageInsertIds = Array.from(
//                 { length: sliderImageResult.affectedRows },
//                 (_, i) => sliderImageResult.insertId + i
//             );
    
//             // Prepare slider_link insert
//             const sliderLinkInsertQuery = `
//                 INSERT INTO slider_link (type, slider_id, slider_img_id, sub_title, sub_link, created_by, btn_align, btn_show) 
//                 VALUES ?
//             `;
//             const sliderLinkValues = [];
    
//             let imageIndex = 0; // To track slider_img IDs dynamically
//             for (const key in formData.linkDataValue2) {
//                 const item = formData.linkDataValue2[key];
//                 const links = item.linkDataValue1;
    
//                 // Create entries for `link1` and `link2`
//                 for (const link of links) {
//                     sliderLinkValues.push([
//                         link.type,
//                         sliderId,
//                         imageInsertIds[imageIndex], // Use correct slider_img ID
//                         item.sub_title,
//                         link.value,
//                         created_by,
//                         link.align || null,
//                         link.show || null,
//                     ]);
//                 }
//                 imageIndex++;
//             }
    
//             // Insert into slider_link
//             await new Promise((resolve, reject) => {
//                 connection.query(sliderLinkInsertQuery, [sliderLinkValues], (err, result) => {
//                     if (err) {
//                         console.error("Error inserting into slider_link:", err);
//                         return reject(err);
//                     }
//                     resolve(result);
//                 });
//             });
    
//             res.status(200).json({ sliderId, message: "Slider updated successfully" });
//         } catch (error) {
//             console.error("Error processing the request:", error);
//             res.status(500).json({ message: "Error processing the request" });
//         }
//     },
    
// slider_update: async (req, res) => {
//     try {
//         const { formData, selectedMonths, slider_name, created_by } = req.body;

//         // Extract the slider ID (assumed to be passed in the request for update purposes)
//         const sliderId = req.params.id;
//         if (!sliderId) {
//             return res.status(400).json({ message: "Slider ID is required for updating." });
//         }

//         // Update the main slider record
//         const updateSliderQuery = `UPDATE slider 
//                                    SET slider_name = ?, transition = ?, modified_by = ?, modified_date = NOW() 
//                                    WHERE id = ?`;
//         await new Promise((resolve, reject) => {
//             connection.query(
//                 updateSliderQuery,
//                 [
//                     slider_name,
//                     selectedMonths.map((month) => month.value).join(", "),
//                     created_by,
//                     sliderId
//                 ],
//                 (err, result) => {
//                     if (err) {
//                         console.error("Error updating slider:", err);
//                         return reject(err);
//                     }
//                     resolve(result);
//                 }
//             );
//         });

//         // Update or insert into slider_img
//         const sliderImageValues = [];
//         const sliderImageInsertQuery = `INSERT INTO slider_img (id, type, slider_id, title, summary,sub_title, slider_image, status, link, created_by, modified_by, modified_date) 
//                                         VALUES ? 
//                                         ON DUPLICATE KEY UPDATE 
//                                             type = VALUES(type),
//                                             title = VALUES(title),
//                                             summary = VALUES(summary),
//                                             sub_title = VALUES(sub_title),
//                                             slider_image = VALUES(slider_image),
//                                             status = VALUES(status),
//                                             link = VALUES(link),
//                                             modified_by = VALUES(modified_by),
//                                             modified_date = VALUES(modified_date)`;

//         formData.linkDataValue2 && Object.values(formData.linkDataValue2).forEach((imageData) => {
//             sliderImageValues.push([
//                 imageData.id || null, // Use the provided ID or insert as a new row
//                 imageData.type,
//                 sliderId,
//                 imageData.name,
//                 imageData.summary,
//                 imageData.title_sub,
//                 imageData.file_path,
//                 imageData.status,
//                 imageData.value,
//                 created_by,
//                 created_by,
//                 new Date()
//             ]);
//         });

//         await new Promise((resolve, reject) => {
//             connection.query(sliderImageInsertQuery, [sliderImageValues], (err, result) => {
//                 if (err) {
//                     console.error("Error inserting/updating slider_img:", err);
//                     return reject(err);
//                 }
//                 resolve(result);
//             });
//         });

//         // Update or insert into slider_link
//         const sliderLinkValues = [];
//         const sliderLinkInsertQuery = `INSERT INTO slider_link (id, type, slider_id, slider_img_id, sub_title, sub_link, created_by, btn_align, btn_show, modified_by, modified_date) 
//                                        VALUES ? 
//                                        ON DUPLICATE KEY UPDATE 
//                                            type = VALUES(type),
//                                            sub_title = VALUES(sub_title),
//                                            sub_link = VALUES(sub_link),
//                                            btn_align = VALUES(btn_align),
//                                            btn_show = VALUES(btn_show),
//                                            modified_by = VALUES(modified_by),
//                                            modified_date = VALUES(modified_date)`;

//         formData.linkDataValue2 && Object.values(formData.linkDataValue2).forEach((imageData) => {
//             imageData.linkDataValue1.forEach((linkData) => {
//                 sliderLinkValues.push([
//                     linkData.id || null, // Use the provided ID or insert as a new row
//                     linkData.type,
//                     sliderId,
//                     imageData.id,
//                     linkData.name,
//                     linkData.value,
//                     created_by,
//                     linkData.align || null,
//                     linkData.show || null,
//                     created_by,
//                     new Date()
//                 ]);
//             });
//         });

//         await new Promise((resolve, reject) => {
//             connection.query(sliderLinkInsertQuery, [sliderLinkValues], (err, result) => {
//                 if (err) {
//                     console.error("Error inserting/updating slider_link:", err);
//                     return reject(err);
//                 }
//                 resolve(result);
//             });
//         });

//         // Respond with success
//         res.status(200).json({ sliderId, message: "Slider updated successfully" });
//     } catch (error) {
//         console.error("Error processing the request:", error);
//         res.status(500).json({ message: "Error processing the request" });
//     }
// },

slider_update: async (req, res) => {
    try {
        const { formData, selectedMonths, slider_name, created_by } = req.body;

        // Extract the slider ID (assumed to be passed in the request for update purposes)
        const sliderId = req.params.id;
        if (!sliderId) {
            return res.status(400).json({ message: "Slider ID is required for updating." });
        }

        // Step 1: Update the main slider record
        const updateSliderQuery = `UPDATE slider 
                                   SET slider_name = ?, transition = ?, modified_by = ?, modified_date = NOW() 
                                   WHERE id = ?`;

        await new Promise((resolve, reject) => {
            connection.query(
                updateSliderQuery,
                [
                    slider_name,
                    selectedMonths.map((month) => month.value).join(", "),
                    created_by,
                    sliderId
                ],
                (err, result) => {
                    if (err) {
                        console.error("Error updating slider:", err);
                        return reject(err);
                    }
                    resolve(result);
                }
            );
        });

        // Step 2: Update or insert into slider_img and capture inserted IDs
        const insertedImageData = [];
        for (const imageData of Object.values(formData.linkDataValue2 || {})) {
            const sliderImageQuery = `INSERT INTO slider_img 
                (id, type, slider_id, title, summary, sub_title, slider_image, status, link, created_by, modified_by, modified_date) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE 
                    type = VALUES(type),
                    title = VALUES(title),
                    summary = VALUES(summary),
                    sub_title = VALUES(sub_title),
                    slider_image = VALUES(slider_image),
                    status = VALUES(status),
                    link = VALUES(link),
                    modified_by = VALUES(modified_by),
                    modified_date = NOW()`;

            const result = await new Promise((resolve, reject) => {
                connection.query(
                    sliderImageQuery,
                    [
                        imageData.id || null,
                        imageData.type,
                        sliderId,
                        imageData.name,
                        imageData.summary,
                        imageData.title_sub,
                        imageData.file_path,
                        imageData.status,
                        imageData.value,
                        created_by,
                        created_by
                    ],
                    (err, result) => {
                        if (err) {
                            console.error("Error inserting/updating slider_img:", err);
                            return reject(err);
                        }
                        resolve(result);
                    }
                );
            });

            // Save the inserted/updated record with its inserted ID
            insertedImageData.push({
                ...imageData,
                id: result.insertId || imageData.id // Use the new ID or existing ID
            });
        }

        // Step 3: Prepare sliderLinkValues using inserted IDs
        const sliderLinkValues = [];
        for (const imageData of insertedImageData) {
            imageData.linkDataValue1.forEach((linkData) => {
                sliderLinkValues.push([
                    linkData.id || null, // Use the provided ID or insert as a new row
                    linkData.type,
                    sliderId,
                    imageData.id, // Use the correct inserted/updated ID here
                    linkData.name,
                    linkData.value,
                    created_by,
                    linkData.align || null,
                    linkData.show || null,
                    created_by,
                    new Date()
                ]);
            });
        }

        // Step 4: Insert/Update slider_link
        await new Promise((resolve, reject) => {
            connection.query(
                `INSERT INTO slider_link 
                    (id, type, slider_id, slider_img_id, sub_title, sub_link, created_by, btn_align, btn_show, modified_by, modified_date) 
                VALUES ? 
                ON DUPLICATE KEY UPDATE 
                    type = VALUES(type),
                    sub_title = VALUES(sub_title),
                    sub_link = VALUES(sub_link),
                    btn_align = VALUES(btn_align),
                    btn_show = VALUES(btn_show),
                    modified_by = VALUES(modified_by),
                    modified_date = VALUES(modified_date)`,
                [sliderLinkValues],
                (err, result) => {
                    if (err) {
                        console.error("Error inserting/updating slider_link:", err);
                        return reject(err);
                    }
                    resolve(result);
                }
            );
        });

        // Step 5: Respond with success
        res.status(200).json({ sliderId, message: "Slider updated successfully" });
    } catch (error) {
        console.error("Error processing the request:", error);
        res.status(500).json({ message: "Error processing the request" });
    }
},


}

module.exports = SliderModel









