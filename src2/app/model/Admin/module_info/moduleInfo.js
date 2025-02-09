const connection = require('../../../../connection/config/database')
const ModuleInfo = {
    module_info_create: async (req, res) => {
        const {
            controller_name, method_name, parent_id, icon, btn, default_page, page_group, page_group_icon, header_menu_page, controller_bg, controller_color, status, method_code, controller_code, method_status
        } = req.body;

        const menu_type = 1;
        const method_sort = 0;

        // SQL query to delete previous records with the same controller_name
        const deleteQuery = 'DELETE FROM module_info WHERE controller_name = ?';

        // SQL query to insert a new record
        const insertQuery = `INSERT INTO module_info (display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // Function to convert snake_case to Title Case
        const titleCaseWord = (word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        };

        // Convert controller_name to display_name
        const display_name = controller_name?.split("_")
            .map(word => titleCaseWord(word))
            .join(" ");



        // SQL query to retrieve max controller_sort and page_group_sort values
        const maxValuesQuery = `
            SELECT 
                MAX(controller_sort) AS max_controller_sort, 
                MAX(page_group_sort) AS max_page_group_sort
            FROM module_info
            WHERE page_group = ?
        `;

        connection.query(maxValuesQuery, [page_group], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Failed to retrieve max values.' });
            }

            const maxControllerSort = result[0].max_controller_sort || 0;
            const maxPageGroupSort = result[0].max_page_group_sort || 0;

            const controller_sort = maxControllerSort + 1;
            const page_group_sort = maxPageGroupSort + 1;

            connection.query(deleteQuery, [controller_name], (deleteError, deleteResult) => {
                if (deleteError) {
                    console.log(deleteError);
                    return res.status(500).json({ message: 'Failed to delete previous records.' });
                }

                connection.query(insertQuery, [display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status], (insertError, insertResult) => {
                    if (insertError) {
                        console.log(insertError);
                        return res.status(500).json({ message: 'Failed to add product.' });
                    }

                    const parent_id = insertResult.insertId;

                    const childRecords = [
                        { display_name: display_name + ' Create', method_name: controller_name + '_create', menu_type: 1, method_sort: 1 },
                        { display_name: display_name + ' List', method_name: controller_name + '_all', menu_type: 1, method_sort: 2 },
                        { display_name: display_name + ' Edit', method_name: controller_name + '_edit', menu_type: 0, method_sort: 3 },
                        { display_name: display_name + ' Copy', method_name: controller_name + '_copy', menu_type: 0, method_sort: 4 },
                        { display_name: display_name + ' Delete', method_name: controller_name + '_delete', menu_type: 0, method_sort: 5 },
                        { display_name: display_name + ' PDF', method_name: controller_name + '_pdf', menu_type: 0, method_sort: 6 },
                        { display_name: display_name + ' Print', method_name: controller_name + '_print', menu_type: 0, method_sort: 7 },
                        { display_name: display_name + ' Word', method_name: controller_name + '_word', menu_type: 0, method_sort: 8 },
                        { display_name: display_name + ' Docx', method_name: controller_name + '_docx', menu_type: 0, method_sort: 9 },
                        { display_name: display_name + ' Search', method_name: controller_name + '_search', menu_type: 0, method_sort: 10 },
                    ];


                    // Function to insert child records
                    const insertChildRecords = (index) => {
                        if (index >= childRecords.length) {
                            // All child records inserted
                            return res.send(insertResult);
                        }

                        const childRecord = childRecords[index];


                        connection.query(insertQuery, [childRecord.display_name, controller_name, childRecord.method_name, parent_id, childRecord.menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, childRecord.method_sort, status, method_code, controller_code, method_status], (childInsertError, childInsertResult) => {
                            if (childInsertError) {
                                console.log(childInsertError);
                                return res.status(500).json({ message: 'Failed to add product.' });
                            }

                            // Insert the next child record
                            insertChildRecords(index + 1);
                        });
                    };

                    // Start inserting child records
                    insertChildRecords(0);
                });
            });
        });
    },


    getAllAdminPageList: async (req, res) => {
        try {
            const data = "select * from 	module_info  order by controller_name asc";

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

    module_info_tutorial_all_paigination: (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);

        try {
            const skipRow = (pageNo - 1) * perPage;
            const rowsQuery = `SELECT * FROM module_info  order by id desc LIMIT ${skipRow}, ${perPage} `;

            connection.query(rowsQuery, function (error, result) {
                console.log(result)
                if (!error) {
                    res.send(result)
                }
                else {
                    console.log(error)
                }

            })
        } catch (error) {
            console.log(error)
        }

    },


    module_info_tutorial_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM module_info WHERE id = ?';
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


    module_info_tutorial_all: async (req, res) => {
        try {
            const data = "select * from  module_info order by id desc";

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


    module_info_tutorial_update: async (req, res) => {
        try {
          // req.body should be an object where keys are IDs and values are the data to update
          const updates = req.body; // This should be an object like { "4075": { ... }, "4076": { ... } }
      
          // Check if req.body contains data
          if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No data to update." });
          }
      
          // Iterate over the keys (IDs) of the object
          for (const id in updates) {
            if (updates.hasOwnProperty(id)) {
              const { video_link, img } = updates[id];
      
              // Dynamically construct the query and parameters
              let query = 'UPDATE module_info SET ';
              const queryParams = [];
              
              // Add video_link update if provided
              if (video_link) {
                query += 'tutorial_video = ?, ';
                queryParams.push(video_link);
              }
      
              // Add img update if provided
              if (img) {
                query += 'tutorial_pdf = ?, ';
                queryParams.push(img);
              }
      
              // Remove the trailing comma and space from the query
              query = query.slice(0, -2);
      
              // Add the WHERE condition
              query += ' WHERE id = ?';
              queryParams.push(id);
      
              // Execute the query with the dynamic parameters
              await new Promise((resolve, reject) => {
                connection.query(
                  query,
                  queryParams,
                  (error, result) => {
                    if (error) {
                      reject(error);
                    } else if (result.affectedRows === 0) {
                      reject(`No record found for ID: ${id}`);
                    } else {
                      resolve(result);
                    }
                  }
                );
              });
            }
          }
      
          return res.status(200).json({ message: "Records updated successfully." });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Internal server error." });
        }
      },
      

    // module_info_tutorial_update: async (req, res) => {
    //     try {
    //         // req.body should be an object where keys are IDs and values are the data to update
    //         const updates = req.body; // This should be an object like { "4075": { ... }, "4076": { ... } }
        
    //         // Check if req.body contains data
    //         if (!updates || Object.keys(updates).length === 0) {
    //           return res.status(400).json({ message: "No data to update." });
    //         }
        
    //         // Iterate over the keys (IDs) of the object
    //         for (const id in updates) {
    //           if (updates.hasOwnProperty(id)) {
    //             const { video_link, img } = updates[id];
        
    //             // Ensure all required fields are provided for each entry
           
    //             // Update the record in the database for the current id
    //             const query = `UPDATE module_info SET tutorial_video = ?, tutorial_pdf = ? WHERE id = ?`;
        
    //             await new Promise((resolve, reject) => {
    //               connection.query(
    //                 query,
    //                 [video_link, img, id],
    //                 (error, result) => {
    //                   if (error) {
    //                     reject(error);
    //                   } else if (result.affectedRows === 0) {
    //                     reject(`No record found for ID: ${id}`);
    //                   } else {
    //                     resolve(result);
    //                   }
    //                 }
    //               );
    //             });
    //           }
    //         }
        
    //         return res.status(200).json({ message: "Records updated successfully." });
    //       } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ message: "Internal server error." });
    //       }
    //   },
      

    getAllAdminPageLists: async (req, res) => {
        try {
            const userId = req.params.id;


            // Fetch role_name based on userId
            const roleQuery = "SELECT role_name FROM users WHERE id = ?";
            connection.query(roleQuery, [userId], function (error, userResult) {
                if (error) {
                    console.log(error);
                    return res.status(500).send("Error fetching user role");
                }

                const role_name = userResult[0]?.role_name;



                // Fetch user_role_id based on role_name
                const userRoleQuery = "SELECT user_role_id FROM user_role_permission WHERE user_role_id = ?";
                connection.query(userRoleQuery, [role_name], function (error, roleResult) {
                    if (error) {
                        console.log(error);
                        return res.status(500).send("Error fetching user role ID");
                    }

                    const user_role_id = roleResult[0]?.user_role_id;

                    // Fetch user_page_list_id based on user_role_id
                    const pageListQuery = "SELECT user_page_list_id FROM user_role_permission WHERE user_role_id = ?";
                    connection.query(pageListQuery, [user_role_id], function (error, pageResult) {
                        if (error) {
                            console.log(error);
                            return res.status(500).send("Error fetching user page list ID");
                        }

                        // const user_page_list_ids = pageResult.map(row => row.user_page_list_id);

                        const user_page_list_id = pageResult[0]?.user_page_list_id;

                        const user_page_list_ids = user_page_list_id?.split(',').map(Number);
                        // Fetch data from module_info based on user_page_list_ids
                        let dataQuery;
                        let queryParams;

                        if (user_page_list_ids?.length > 0) {
                            // If user_page_list_ids is not empty, fetch matching data
                            dataQuery = "SELECT * FROM module_info WHERE id IN (?)";
                            queryParams = [user_page_list_ids];
                        } else {
                            // If user_page_list_ids is empty, fetch all data
                            dataQuery = "SELECT * FROM module_info";
                            queryParams = [];
                        }

                        connection.query(dataQuery, queryParams, function (error, moduleResult) {
                            if (error) {
                                console.log(error);
                                return res.status(500).send("Error fetching module information");
                            }

                            res.send(moduleResult);
                        });
                    });
                });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal server error");
        }
    },






    module_info_copy: async (req, res) => {
        const {
            display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page,
            page_group, controller_bg, page_group_icon, controller_sort, page_group_sort, method_sort,
            controller_color, status, controller_code, method_status, header_menu_page, method_code
        } = req.body;

        // SQL query to insert a new record
        const insertQuery = `
                INSERT INTO module_info (
                    display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, 
                    page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, 
                    controller_color, method_sort, status, method_code, controller_code, method_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

        // Execute the query
        connection.query(insertQuery, [
            display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page,
            page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg,
            controller_color, method_sort, status, method_code, controller_code, method_status
        ], (insertError, insertResult) => {
            if (insertError) {
                console.error(insertError);
                return res.status(500).json({ message: 'Failed to add product.' });
            }

            // Handle success if needed
            res.status(200).json({ message: 'Product added successfully.' });
        });
    },


    module_info_update: async (req, res) => {
        try {
            const {
                display_name,
                controller_name,
                method_name,
                parent_id,
                menu_type,
                icon,
                btn,
                default_page,
                page_group,
                controller_bg,
                page_group_icon,
                controller_sort,
                page_group_sort,
                method_sort,
                controller_color,
            } = req.body;

            const query = `
            UPDATE module_info 
            SET 
              display_name = ?, 
              controller_name = ?, 
              method_name = ?, 
              parent_id = ?, 
              menu_type = ?, 
              icon = ?, 
              btn = ?, 
              default_page = ?, 
              page_group = ?, 
              controller_bg = ?, 
              page_group_icon = ?, 
              controller_sort = ?, 
              page_group_sort = ?, 
              controller_color = ?, 
              method_sort = ? 
            WHERE id = ?
          `;

            connection.query(
                query,
                [
                    display_name,
                    controller_name,
                    method_name,
                    parent_id,
                    menu_type,
                    icon,
                    btn,
                    default_page,
                    page_group,
                    controller_bg,
                    page_group_icon,
                    controller_sort,
                    page_group_sort,
                    controller_color,
                    method_sort,
                    req.params.id,
                ],
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
        }
    },


    module_info_delete: async (req, res) => {
        try {
            const idToDelete = req.params.id;

            connection.beginTransaction((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Transaction error', error: err });
                }

                // First, delete the rows where the given ID is the parent_id
                const deleteChildrenQuery = 'DELETE FROM module_info WHERE parent_id = ?';
                connection.query(deleteChildrenQuery, [idToDelete], (error, result) => {
                    if (error) {
                        return connection.rollback(() => {
                            console.log(error);
                            return res.status(500).json({ message: 'Error deleting child records', error });
                        });
                    }

                    // Then, delete the row with the given ID
                    const deleteQuery = 'DELETE FROM module_info WHERE id = ?';
                    connection.query(deleteQuery, [idToDelete], (error, result) => {
                        if (error) {
                            return connection.rollback(() => {
                                console.log(error);
                                return res.status(500).json({ message: 'Error deleting main record', error });
                            });
                        }

                        if (result.affectedRows > 0) {
                            connection.commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        console.log(err);
                                        return res.status(500).json({ message: 'Transaction commit error', error: err });
                                    });
                                }
                                console.log(result);
                                return res.send(result);
                            });
                        } else {
                            return connection.rollback(() => {
                                console.log('Record not found');
                                return res.status(404).json({ message: 'Record not found' });
                            });
                        }
                    });
                });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error', error });
        }
    },


    // module_info_delete: async (req, res) => {
    //     try {
    //         const query = 'DELETE FROM module_info WHERE id = ?';
    //         connection.query(query, [req.params.id], (error, result) => {
    //             if (!error && result.affectedRows > 0) {
    //                 console.log(result);
    //                 return res.send(result);
    //             } else {
    //                 console.log(error || 'Product not found');
    //                 return res.status(404).json({ message: 'Product not found.' });
    //             }
    //         });
    //     }
    //     catch (error) {
    //         console.log(error)
    //     }
    // },



    getPageGroupAndControllerNamesId: async (req, res) => {
        const query = `
        SELECT mi.page_group, mi.controller_name, mi.display_name, mi.method_name
        FROM module_info mi
        WHERE mi.parent_id != 0
        AND mi.menu_type = 1 
        GROUP BY mi.page_group, mi.controller_name, mi.display_name, mi.method_name
        HAVING mi.page_group IS NOT NULL AND mi.page_group != '';
      `;

        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error executing MySQL query:', error);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            // Helper function to compare names case-insensitively
            const areNamesEqual = (name1, name2) => name1.toLowerCase() === name2.toLowerCase();

            // Process the data to group by page_group and create an object
            const groupedData = results.reduce((acc, row) => {
                const { page_group_id, page_group, controller_name, display_name, method_name } = row;
                const pageGroupLowerCase = page_group.toLowerCase(); // Convert to lowercase

                if (!acc[pageGroupLowerCase]) {
                    acc[pageGroupLowerCase] = {
                        page_group_id,
                        page_group: pageGroupLowerCase, // Store in lowercase
                        controllers: [],
                    };
                }

                const controller = acc[pageGroupLowerCase].controllers.find((c) => areNamesEqual(c.controller_name, controller_name)); // Compare names case-insensitively

                if (controller) {
                    const display = controller.display_names.find((display) => areNamesEqual(display.display_name, display_name)); // Compare names case-insensitively
                    if (display) {
                        display.method_names.push(method_name);
                    } else {
                        controller.display_names.push({ display_name, method_names: [method_name] });
                    }
                } else {
                    acc[pageGroupLowerCase].controllers.push({
                        controller_name,
                        display_names: [{ display_name, method_names: [method_name] }],
                    });
                }

                return acc;
            }, {});

            const responseData = Object.values(groupedData);

            if (responseData.length > 0) {
                res.json(responseData);
            } else {
                res.status(404).json({ message: 'Data not found' });
            }
        });
    },


    module_info_list_paigination: (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);

        try {
            const skipRow = (pageNo - 1) * perPage;
            const rowsQuery = `SELECT * FROM module_info  where parent_id = 0 order by controller_name asc LIMIT ${skipRow}, ${perPage} `;

            connection.query(rowsQuery, function (error, result) {
                console.log(result)
                if (!error) {
                    res.send(result)
                }
                else {
                    console.log(error)
                }

            })
        } catch (error) {
            console.log(error)
        }

    },


    // admin_panel_settings part 

    admin_panel_settings_list: async (req, res) => {
        try {
            const data = 'SELECT * FROM admin_panel_settings';
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

    admin_panel_settings_single: async (req, res) => {
        try {
            const { id } = req.params;

            const query = 'SELECT * FROM admin_template WHERE id = ?';

            connection.query(query, [id], function (error, result) {
                if (!error) {
                    res.send(result);
                } else {
                    console.log(error);
                    res.status(500).send('Internal Server Error');
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }

    },

    admin_panel_settings_delete: async (req, res) => {
        try {
            const query = 'DELETE FROM admin_template WHERE id = ?';
            connection.query(query, [req.params.id], (error, result) => {
                if (!error && result.affectedRows > 0) {
                    console.log(result);
                    return res.send(result);
                } else {
                    console.log(error || ' not found');
                    return res.status(404).json({ message: ' not found.' });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }


    },

    // user role start 
    getPageGroupAndControllerNamesss: async (req, res) => {
        try {
            const query = `
                SELECT
                  mi.page_group,
                  GROUP_CONCAT(DISTINCT mi.controller_name) AS controller_names
                FROM module_info mi
                WHERE mi.parent_id = 0
                  AND mi.page_group IS NOT NULL
                  AND mi.page_group != ''
                  AND mi.controller_name IS NOT NULL
                  AND mi.controller_name != ''
                GROUP BY mi.page_group
                HAVING COUNT(DISTINCT mi.controller_name) = COUNT(mi.controller_name)
              `;

            connection.query(query, (error, result) => {
                if (!error && result.length > 0) {
                    console.log(result);
                    return res.send(result);
                } else {
                    console.log(error || 'Data not found');
                    return res.status(404).json({ message: 'Data not found.' });
                }
            });
        } catch (error) {
            console.log(error);
        }
    },
    module_info_list_list: async (req, res) => {
        const query = `
        SELECT mi.id AS page_group_id, mi.page_group, mi.controller_name, mi.display_name, mi.method_name
        FROM module_info mi
        WHERE mi.parent_id != 0
        AND mi.menu_type = 1 
        GROUP BY mi.page_group, mi.controller_name, mi.display_name, mi.method_name
        HAVING mi.page_group IS NOT NULL AND mi.page_group != '';
      `;

        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error executing MySQL query:', error);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            // Helper function to compare names case-insensitively
            const areNamesEqual = (name1, name2) => name1.toLowerCase() === name2.toLowerCase();

            // Process the data to group by page_group and create an object
            const groupedData = results.reduce((acc, row) => {
                const { page_group_id, page_group, controller_name, display_name, method_name } = row;
                const pageGroupLowerCase = page_group.toLowerCase(); // Convert to lowercase

                if (!acc[pageGroupLowerCase]) {
                    acc[pageGroupLowerCase] = {
                        page_group_id,
                        page_group: pageGroupLowerCase, // Store in lowercase
                        controllers: [],
                    };
                }

                const controller = acc[pageGroupLowerCase].controllers.find((c) => areNamesEqual(c.controller_name, controller_name)); // Compare names case-insensitively

                if (controller) {
                    const display = controller.display_names.find((display) => areNamesEqual(display.display_name, display_name)); // Compare names case-insensitively
                    if (display) {
                        display.method_names.push(method_name);
                    } else {
                        controller.display_names.push({ display_name, method_names: [method_name] });
                    }
                } else {
                    acc[pageGroupLowerCase].controllers.push({
                        controller_name,
                        display_names: [{ display_name, method_names: [method_name] }],
                    });
                }

                return acc;
            }, {});

            const responseData = Object.values(groupedData);

            if (responseData.length > 0) {
                res.json(responseData);
            } else {
                res.status(404).json({ message: 'Data not found' });
            }
        });
    },
    getPageGroupAndDisplayNameWithId: async (req, res) => {

        //     const query = `
        //     SELECT ap.id AS page_group_id, ap.page_group, ap.controller_name, ap.display_name, ap.id AS method_id, ap.method_name, ap.parent_id, ap.menu_type, ap.method_sort
        //     FROM module_info ap
        //     GROUP BY ap.page_group, ap.controller_name, ap.display_name, ap.id
        //     HAVING ap.page_group IS NOT NULL AND ap.page_group != '';
        // `;

        // connection.query(query, (error, results) => {
        //     if (error) {
        //         console.error('Error executing MySQL query:', error);
        //         res.status(500).json({ message: 'Internal server error' });
        //         return;
        //     }

        //     // Process the data to group by page_group and create an object
        //     const groupedData = results.reduce((acc, row) => {
        //         const { page_group_id, page_group, controller_name, display_name, method_id, method_name, parent_id, menu_type, method_sort } = row;
        //         const pageGroupLowerCase = page_group.toLowerCase(); // Convert to lowercase

        //         if (!acc[pageGroupLowerCase]) {
        //             acc[pageGroupLowerCase] = {
        //                 page_group_id,
        //                 page_group: pageGroupLowerCase, // Store in lowercase
        //                 controllers: [],
        //             };
        //         }

        //         const controller = acc[pageGroupLowerCase].controllers.find((c) => c.controller_name.toLowerCase() === controller_name.toLowerCase()); // Compare in lowercase

        //         if (controller) {
        //             const display = controller.display_names.find((display) => display.display_name.toLowerCase() === display_name.toLowerCase()); // Compare in lowercase
        //             if (display) {
        //                 const method = display.method_names.find((method) => method.method_id === method_id);
        //                 if (method) {
        //                     // If method already exists, just add parent_id, menu_type, and method_sort
        //                     method.parent_id = parent_id;
        //                     method.menu_type = menu_type;
        //                     method.method_sort = method_sort;
        //                 } else {
        //                     display.method_names.push({ method_id, method_name, parent_id, menu_type, method_sort });
        //                 }
        //             } else {
        //                 controller.display_names.push({ display_name, method_names: [{ method_id, method_name, parent_id, menu_type, method_sort }] });
        //             }
        //         } else {
        //             acc[pageGroupLowerCase].controllers.push({
        //                 controller_name,
        //                 display_names: [{ display_name, method_names: [{ method_id, method_name, parent_id, menu_type, method_sort }] }],
        //             });
        //         }

        //         return acc;
        //     }, {});

        //     const responseData = Object.values(groupedData);

        //     if (responseData.length > 0) {
        //         res.json(responseData);
        //     } else {
        //         res.status(404).json({ message: 'Data not found' });
        //     }
        // });


        // const query = `
        //     SELECT ap.id AS page_group_id, ap.page_group, ap.controller_name, ap.display_name, ap.id AS method_id, ap.method_name, ap.parent_id, ap.menu_type, ap.method_sort
        //     FROM module_info ap
        //     GROUP BY ap.page_group, ap.controller_name, ap.display_name, ap.id
        //     HAVING ap.page_group IS NOT NULL AND ap.page_group != '';
        // `;

        // connection.query(query, (error, results) => {
        //     if (error) {
        //         console.error('Error executing MySQL query:', error);
        //         res.status(500).json({ message: 'Internal server error' });
        //         return;
        //     }

        //     // Process the data to group by page_group and create an object
        //     const groupedData = results.reduce((acc, row) => {
        //         const { page_group_id, page_group, controller_name, display_name, method_id, method_name, parent_id, menu_type, method_sort } = row;
        //         const pageGroupLowerCase = page_group.toLowerCase(); // Convert to lowercase

        //         if (!acc[pageGroupLowerCase]) {
        //             acc[pageGroupLowerCase] = {
        //                 page_group_id,
        //                 page_group: pageGroupLowerCase, // Store in lowercase
        //                 controllers: [],
        //             };
        //         }

        //         const controller = acc[pageGroupLowerCase].controllers.find((c) => c.controller_name.toLowerCase() === controller_name.toLowerCase()); // Compare in lowercase

        //         if (controller) {
        //             const display = controller.display_names.find((display) => display.display_name.toLowerCase() === display_name.toLowerCase()); // Compare in lowercase
        //             if (display) {
        //                 const method = display.method_names.find((method) => method.method_id === method_id);
        //                 if (method) {
        //                     // If method already exists, just add parent_id, menu_type, and method_sort
        //                     method.parent_id = parent_id;
        //                     method.menu_type = menu_type;
        //                     method.method_sort = method_sort;
        //                 } else {
        //                     display.method_names.push({ method_id, method_name, parent_id, menu_type, method_sort });
        //                 }
        //             } else {
        //                 controller.display_names.push({ display_name, method_names: [{ method_id, method_name, parent_id, menu_type, method_sort }] });
        //             }
        //         } else {
        //             acc[pageGroupLowerCase].controllers.push({
        //                 controller_name,
        //                 display_names: [{ display_name, method_names: [{ method_id, method_name, parent_id, menu_type, method_sort }] }],
        //             });
        //         }

        //         return acc;
        //     }, {});

        //     // Sort display_names based on method_sort in descending order
        //     Object.values(groupedData).forEach((group) => {
        //       group.controllers.forEach((controller) => {
        //           controller.display_names.sort((a, b) => a.method_names[0].method_sort - b.method_names[0].method_sort);
        //       });
        //   });

        //     const responseData = Object.values(groupedData);

        //     if (responseData.length > 0) {
        //         res.json(responseData);
        //     } else {
        //         res.status(404).json({ message: 'Data not found' });
        //     }
        // });
        const query = `
        SELECT mi.id AS page_group_id, mi.page_group, mi.controller_name, mi.display_name, mi.id AS method_id, mi.method_name, mi.parent_id, mi.menu_type, mi.method_sort
        FROM module_info mi
        GROUP BY mi.page_group, mi.controller_name, mi.display_name, mi.id
        HAVING mi.page_group IS NOT NULL AND mi.page_group != '';
    `;

        connection.query(query, (error, results) => {
            if (error) {
                console.error('Error executing MySQL query:', error);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            // Process the data to group by page_group and create an object
            const groupedData = results.reduce((acc, row) => {
                const { page_group_id, page_group, controller_name, display_name, method_id, method_name, parent_id, menu_type, method_sort } = row;
                const pageGroupLowerCase = page_group.toLowerCase(); // Convert to lowercase

                if (!acc[pageGroupLowerCase]) {
                    acc[pageGroupLowerCase] = {
                        page_group_id,
                        page_group: pageGroupLowerCase, // Store in lowercase
                        controllers: [],
                    };
                }

                const controller = acc[pageGroupLowerCase].controllers.find((c) => c.controller_name.toLowerCase() === controller_name.toLowerCase()); // Compare in lowercase

                if (controller) {
                    const display = controller.display_names.find((display) => display.display_name.toLowerCase() === display_name.toLowerCase()); // Compare in lowercase
                    if (display) {
                        const method = display.method_names.find((method) => method.method_id === method_id);
                        if (method) {
                            // If method already exists, just add parent_id, menu_type, and method_sort
                            method.parent_id = parent_id;
                            method.menu_type = menu_type;
                            method.method_sort = method_sort;
                        } else {
                            display.method_names.push({ method_id, method_name, parent_id, menu_type, method_sort });
                        }
                    } else {
                        controller.display_names.push({ display_name, method_names: [{ method_id, method_name, parent_id, menu_type, method_sort }] });
                    }
                } else {
                    acc[pageGroupLowerCase].controllers.push({
                        controller_name,
                        display_names: [{ display_name, method_names: [{ method_id, method_name, parent_id, menu_type, method_sort }] }],
                    });
                }

                return acc;
            }, {});

            // Add "blank" controller_name for missing method_sort values
            Object.values(groupedData).forEach((group) => {
                group.controllers.forEach((controller) => {
                    const methodSorts = controller.display_names.map((display) => display.method_names[0].method_sort);
                    for (let i = 0; i <= 5; i++) {
                        if (!methodSorts.includes(i)) {
                            controller.display_names.push({ display_name: '', method_names: [{ method_id: '', method_name: '', parent_id: '', menu_type: '', method_sort: i }] });
                        }
                    }
                });
            });

            // Sort display_names based on method_sort in ascending order (lower number to higher number)
            Object.values(groupedData).forEach((group) => {
                group.controllers.forEach((controller) => {
                    controller.display_names.sort((a, b) => a.method_names[0].method_sort - b.method_names[0].method_sort);
                });
            });

            const responseData = Object.values(groupedData);

            if (responseData.length > 0) {
                res.json(responseData);
            } else {
                res.status(404).json({ message: 'Data not found' });
            }
        });

    },
    users_role_permission_default_page: async (req, res) => {
        try {
            const query = 'SELECT * FROM user_role_permission WHERE user_role_id = ?';
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
}


module.exports = ModuleInfo