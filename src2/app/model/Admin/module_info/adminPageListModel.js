// const connection = require('../../../connection/config/database')
// const AdminPageListModel = {
//   getAllAdminPageList: async (req, res) => {
//     try {
//       const data = "select * from 	admin_page_list";
//       connection.query(data, function (error, result) {
//         console.log(result)
//         if (!error) {
//           res.send(result)
//         }

//         else {
//           console.log(error)
//         }

//       })
//     }
//     catch (error) {
//       console.log(error)
//     }
//   },

//   admin_panel_settings_list: async (req, res) => {
//     try {
//       const data = 'SELECT * FROM admin_panel_settings';
//       connection.query(data, function (error, result) {
//         console.log(result)
//         if (!error) {
//           res.send(result)
//         }

//         else {
//           console.log(error)
//         }

//       })
//     }
//     catch (error) {
//       console.log(error)
//     }
//   },


//   admin_panel_settings_single: async (req, res) => {
//     try {
//       const { id } = req.params; 

//       const query = 'SELECT * FROM admin_panel_settings WHERE id = ?';

//       connection.query(query, [id], function (error, result) {
//         if (!error) {
//           res.send(result);
//         } else {
//           console.log(error);
//           res.status(500).send('Internal Server Error'); 
//         }
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).send('Internal Server Error'); 
//     }

//   },

//   getSingleAdminPanelSettingsDownload: async (req, res) => {
//     try {
//       const { columnName } = req.params;
//       const query = `SELECT ${columnName} FROM admin_panel_settings`; // Replace "your_table" with your actual table name

//       connection.query(query, (error, result) => {
//         if (error) {
//           console.error('Error fetching data:', error);
//           res.status(500).send('Internal Server Error');
//         } else {
//           // Extract the column data from the result
//           const columnData = result.map((row) => row[columnName]);

//           // Convert the column data to a string
//           const csvData = columnData.join('\n');

//           // Set headers for the download
//           res.setHeader('Content-disposition', `attachment; filename=${columnName}.css`);
//           res.setHeader('Content-type', 'text/css');

//           // Send the data to the client
//           res.status(200).send(csvData);
//         }
//       });
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   },


//   admin_panel_settings_delete: async (req, res) => {
//     try {
//       const query = 'DELETE FROM admin_panel_settings WHERE id = ?';
//       connection.query(query, [req.params.id], (error, result) => {
//         if (!error && result.affectedRows > 0) {
//           console.log(result);
//           return res.send(result);
//         } else {
//           console.log(error || ' not found');
//           return res.status(404).json({ message: ' not found.' });
//         }
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }


//   },



//   getAllAdminPageListGroupWisessss: async (req, res) => {
//     try {


//       const id = req.params.id; // Get the ID parameter from the URL
//       const sqlQuery = 'SELECT * FROM admin_page_list WHERE id = ? OR parent_id = ?';
//       connection.query(sqlQuery, [id, id], (err, results) => {
//         if (err) {
//           console.error('Error executing the query: ' + err);
//           res.status(500).json({ error: 'Internal Server Error' });
//           return;
//         }
//         res.json(results);
//       });



//     }
//     catch (error) {
//       console.log(error)
//     }
//   },


//   module_info_create: async (req, res) => {
//     const {
//       controller_name,
//       method_name,
//       parent_id,
//       menu_type,
//       icon,
//       btn,
//       default_page,
//       page_group,
//       page_group_icon,
//       header_menu_page,
//       controller_bg,
//       controller_color,
//       method_sort,
//       status,
//       method_code,
//       controller_code,
//       method_status,
//     } = req.body;

//     // SQL query to delete previous records with the same controller_name
//     const deleteQuery = 'DELETE FROM admin_page_list WHERE controller_name = ?';

//     // SQL query to insert a new record for the parent
//     const insertParentQuery = `INSERT INTO admin_page_list (display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//     // SQL query to insert a new record for the child
//     const insertChildQuery = `INSERT INTO admin_page_list (display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//     // Function to convert snake_case to Title Case
//     const titleCaseWord = (word) => {
//       return word.charAt(0).toUpperCase() + word.slice(1);
//     };

//     // Convert controller_name to display_name
//     const display_name = controller_name
//       ?.split('_')
//       .map((word) => titleCaseWord(word))
//       .join(' ');

//     // Determine menu_type based on method_name
//     let calculatedMenuType = 0; // Default to 0
//     if (method_name === `${controller_name}_create` || method_name === `${controller_name}_all`) {
//       calculatedMenuType = 1; // Set to 1 if method_name matches conditions
//     }

//     // Determine method_sort based on method_name
//     let calculatedMethodSort = 0; // Default to 0
//     switch (method_name) {
//       case `${controller_name}_create`:
//         calculatedMethodSort = 1;
//         break;
//       case `${controller_name}_all`:
//         calculatedMethodSort = 2;
//         break;
//       case `${controller_name}_copy`:
//         calculatedMethodSort = 3;
//         break;
//       case `${controller_name}_edit`:
//         calculatedMethodSort = 4;
//         break;
//       case `${controller_name}_delete`:
//         calculatedMethodSort = 5;
//         break;
//       default:
//         calculatedMethodSort = 0;
//     }

//     // SQL query to retrieve max controller_sort and page_group_sort values
//     const maxValuesQuery = `
//           SELECT 
//               MAX(controller_sort) AS max_controller_sort, 
//               MAX(page_group_sort) AS max_page_group_sort
//           FROM admin_page_list
//           WHERE page_group = ?
//         `;

//     connection.query(maxValuesQuery, [page_group], (error, result) => {
//       if (error) {
//         console.log(error);
//         return res.status(500).json({ message: 'Failed to retrieve max values.' });
//       }

//       const maxControllerSort = result[0].max_controller_sort || 0;
//       const maxPageGroupSort = result[0].max_page_group_sort || 0;

//       const controller_sort = maxControllerSort + 1;
//       const page_group_sort = maxPageGroupSort + 1;

//       connection.query(deleteQuery, [controller_name], (deleteError, deleteResult) => {
//         if (deleteError) {
//           console.log(deleteError);
//           return res.status(500).json({ message: 'Failed to delete previous records.' });
//         }

//         connection.query(
//           insertParentQuery,
//           [
//             display_name,
//             controller_name,
//             method_name,
//             parent_id,
//             1, // Set menu_type to 1 for the parent
//             icon,
//             btn,
//             default_page,
//             page_group,
//             page_group_icon,
//             controller_sort,
//             page_group_sort,
//             header_menu_page,
//             controller_bg,
//             controller_color,
//             calculatedMethodSort, // Set method_sort for the parent
//             status,
//             method_code,
//             controller_code,
//             method_status,
//           ],
//           (insertError, insertResult) => {
//             if (insertError) {
//               console.log(insertError);
//               return res.status(500).json({ message: 'Failed to add product.' });
//             }

//             const parent_id = insertResult.insertId;

//             const childRecords = [
//               { display_name: `${display_name} Create`, method_name: `${controller_name}_create`, menu_type: 1, method_sort: 1 },
//               { display_name: `${display_name} List`, method_name: `${controller_name}_all`, menu_type: 1, method_sort: 2 },
//               { display_name: `${display_name} Copy`, method_name: `${controller_name}_copy`, method_sort: 4 },
//               { display_name: `${display_name} Edit`, method_name: `${controller_name}_edit`, method_sort: 3 },
//               { display_name: `${display_name} Delete`, method_name: `${controller_name}_delete`, method_sort: 5 },
//             ];

//             // Function to insert child records
//             const insertChildRecords = (index) => {
//               if (index >= childRecords.length) {
//                 // All child records inserted
//                 return res.send(insertResult);
//               }

//               const childRecord = childRecords[index];

//               connection.query(
//                 insertChildQuery,
//                 [
//                   childRecord.display_name,
//                   controller_name,
//                   childRecord.method_name,
//                   parent_id,
//                   childRecord.menu_type || calculatedMenuType, // Use menu_type if specified, otherwise calculatedMenuType
//                   icon,
//                   btn,
//                   default_page,
//                   page_group,
//                   page_group_icon,
//                   controller_sort,
//                   page_group_sort,
//                   header_menu_page,
//                   controller_bg,
//                   controller_color,
//                   childRecord.method_sort || calculatedMethodSort, // Use method_sort if specified, otherwise calculatedMethodSort
//                   status,
//                   method_code,
//                   controller_code,
//                   method_status,
//                 ],
//                 (childInsertError, childInsertResult) => {
//                   if (childInsertError) {
//                     console.log(childInsertError);
//                     return res.status(500).json({ message: 'Failed to add product.' });
//                   }

//                   // Insert the next child record
//                   insertChildRecords(index + 1);
//                 }
//               );
//             };

//             // Start inserting child records
//             insertChildRecords(0);
//           }
//         );
//       });
//     });
//   },




//   // module_info_create: async (req, res) => {
//   //     const {
//   //       controller_name,
//   //       method_name,
//   //       parent_id,
//   //       menu_type,
//   //       icon,
//   //       btn,
//   //       default_page,
//   //       page_group,
//   //       page_group_icon,
//   //       header_menu_page,
//   //       controller_bg,
//   //       controller_color,
//   //       method_sort,
//   //       status,
//   //       method_code,
//   //       controller_code,
//   //       method_status,
//   //     } = req.body;

//   //     // SQL query to delete previous records with the same controller_name
//   //     const deleteQuery = 'DELETE FROM admin_page_list WHERE controller_name = ?';

//   //     // SQL query to insert a new record for the parent
//   //     const insertParentQuery = `INSERT INTO admin_page_list (display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//   //     // SQL query to insert a new record for the child
//   //     const insertChildQuery = `INSERT INTO admin_page_list (display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//   //     // Function to convert snake_case to Title Case
//   //     const titleCaseWord = (word) => {
//   //       return word.charAt(0).toUpperCase() + word.slice(1);
//   //     };

//   //     // Convert controller_name to display_name
//   //     const display_name = controller_name
//   //       ?.split('_')
//   //       .map((word) => titleCaseWord(word))
//   //       .join(' ');

//   //     // Determine menu_type based on method_name
//   //     let calculatedMenuType = 0; // Default to 0
//   //     if (method_name === `${controller_name}_create` || method_name === `${controller_name}_all`) {
//   //       calculatedMenuType = 1; // Set to 1 if method_name matches conditions
//   //     }

//   //     // SQL query to retrieve max controller_sort and page_group_sort values
//   //     const maxValuesQuery = `
//   //       SELECT 
//   //           MAX(controller_sort) AS max_controller_sort, 
//   //           MAX(page_group_sort) AS max_page_group_sort
//   //       FROM admin_page_list
//   //       WHERE page_group = ?
//   //     `;

//   //     connection.query(maxValuesQuery, [page_group], (error, result) => {
//   //       if (error) {
//   //         console.log(error);
//   //         return res.status(500).json({ message: 'Failed to retrieve max values.' });
//   //       }

//   //       const maxControllerSort = result[0].max_controller_sort || 0;
//   //       const maxPageGroupSort = result[0].max_page_group_sort || 0;

//   //       const controller_sort = maxControllerSort + 1;
//   //       const page_group_sort = maxPageGroupSort + 1;

//   //       connection.query(deleteQuery, [controller_name], (deleteError, deleteResult) => {
//   //         if (deleteError) {
//   //           console.log(deleteError);
//   //           return res.status(500).json({ message: 'Failed to delete previous records.' });
//   //         }

//   //         connection.query(
//   //           insertParentQuery,
//   //           [
//   //             display_name,
//   //             controller_name,
//   //             method_name,
//   //             parent_id,
//   //             1, // Set menu_type to 1 for the parent
//   //             icon,
//   //             btn,
//   //             default_page,
//   //             page_group,
//   //             page_group_icon,
//   //             controller_sort,
//   //             page_group_sort,
//   //             header_menu_page,
//   //             controller_bg,
//   //             controller_color,
//   //             method_sort,
//   //             status,
//   //             method_code,
//   //             controller_code,
//   //             method_status,
//   //           ],
//   //           (insertError, insertResult) => {
//   //             if (insertError) {
//   //               console.log(insertError);
//   //               return res.status(500).json({ message: 'Failed to add product.' });
//   //             }

//   //             const parent_id = insertResult.insertId;

//   //             const childRecords = [
//   //               { display_name: `${display_name} Create`, method_name: `${controller_name}_create`, menu_type: 1, method_sort: 1 },
//   //               { display_name: `${display_name} List`, method_name: `${controller_name}_all`, menu_type: 1 , method_sort: 2},
//   //               { display_name: `${display_name} Copy`, method_name: `${controller_name}_copy`, method_sort: 4 },
//   //               { display_name: `${display_name} Edit`, method_name: `${controller_name}_edit`, method_sort: 3},
//   //               { display_name: `${display_name} Delete`, method_name: `${controller_name}_delete`, method_sort: 5 },
//   //             ];

//   //             // Function to insert child records
//   //             const insertChildRecords = (index) => {
//   //               if (index >= childRecords.length) {
//   //                 // All child records inserted
//   //                 return res.send(insertResult);
//   //               }

//   //               const childRecord = childRecords[index];

//   //               connection.query(
//   //                 insertChildQuery,
//   //                 [
//   //                   childRecord.display_name,
//   //                   controller_name,
//   //                   childRecord.method_name,
//   //                   parent_id,
//   //                   childRecord.menu_type || calculatedMenuType, // Use menu_type if specified, otherwise calculatedMenuType
//   //                   icon,
//   //                   btn,
//   //                   default_page,
//   //                   page_group,
//   //                   page_group_icon,
//   //                   controller_sort,
//   //                   page_group_sort,
//   //                   header_menu_page,
//   //                   controller_bg,
//   //                   controller_color,
//   //                   childRecords.method_sort,
//   //                   status,
//   //                   method_code,
//   //                   controller_code,
//   //                   method_status,
//   //                 ],
//   //                 (childInsertError, childInsertResult) => {
//   //                   if (childInsertError) {
//   //                     console.log(childInsertError);
//   //                     return res.status(500).json({ message: 'Failed to add product.' });
//   //                   }

//   //                   // Insert the next child record
//   //                   insertChildRecords(index + 1);
//   //                 }
//   //               );
//   //             };

//   //             // Start inserting child records
//   //             insertChildRecords(0);
//   //           }
//   //         );
//   //       });
//   //     });
//   //   },








//   // module_info_create: async (req, res) => {
//   //     const {
//   //         controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status,
//   //     } = req.body;

//   //     // SQL query to delete previous records with the same controller_name
//   //     const deleteQuery = 'DELETE FROM admin_page_list WHERE controller_name = ?';

//   //     // SQL query to insert a new record
//   //     const insertQuery = `INSERT INTO admin_page_list (display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//   //     // Function to convert snake_case to Title Case
//   //     const titleCaseWord = (word) => {
//   //         return word.charAt(0).toUpperCase() + word.slice(1);
//   //     };

//   //     // Convert controller_name to display_name
//   //     const display_name = controller_name?.split("_")
//   //         .map(word => titleCaseWord(word))
//   //         .join(" ");

//   //     // SQL query to retrieve max controller_sort and page_group_sort values
//   //     const maxValuesQuery = `
//   //         SELECT 
//   //             MAX(controller_sort) AS max_controller_sort, 
//   //             MAX(page_group_sort) AS max_page_group_sort
//   //         FROM admin_page_list
//   //         WHERE page_group = ?
//   //     `;

//   //     connection.query(maxValuesQuery, [page_group], (error, result) => {
//   //         if (error) {
//   //             console.log(error);
//   //             return res.status(500).json({ message: 'Failed to retrieve max values.' });
//   //         }

//   //         const maxControllerSort = result[0].max_controller_sort || 0;
//   //         const maxPageGroupSort = result[0].max_page_group_sort || 0;

//   //         const controller_sort = maxControllerSort + 1;
//   //         const page_group_sort = maxPageGroupSort + 1;

//   //         connection.query(deleteQuery, [controller_name], (deleteError, deleteResult) => {
//   //             if (deleteError) {
//   //                 console.log(deleteError);
//   //                 return res.status(500).json({ message: 'Failed to delete previous records.' });
//   //             }

//   //             connection.query(insertQuery, [display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status], (insertError, insertResult) => {
//   //                 if (insertError) {
//   //                     console.log(insertError);
//   //                     return res.status(500).json({ message: 'Failed to add product.' });
//   //                 }

//   //                 const parent_id = insertResult.insertId;

//   //                 const childRecords = [
//   //                     { display_name: display_name + ' Create', method_name: controller_name + '_create'},
//   //                     { display_name: display_name + ' Copy', method_name: controller_name + '_copy' },
//   //                     { display_name: display_name + ' Edit', method_name: controller_name + '_edit' },
//   //                     { display_name: display_name + ' Delete', method_name: controller_name + '_delete' },
//   //                     { display_name: display_name + ' List', method_name: controller_name + '_all' },
//   //                 ];

//   //                 // Function to insert child records
//   //                 const insertChildRecords = (index) => {
//   //                     if (index >= childRecords.length) {
//   //                         // All child records inserted
//   //                         return res.send(insertResult);
//   //                     }

//   //                     const childRecord = childRecords[index];

//   //                     connection.query(insertQuery, [childRecord.display_name, controller_name, childRecord.method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status], (childInsertError, childInsertResult) => {
//   //                         if (childInsertError) {
//   //                             console.log(childInsertError);
//   //                             return res.status(500).json({ message: 'Failed to add product.' });
//   //                         }

//   //                         // Insert the next child record
//   //                         insertChildRecords(index + 1);
//   //                     });
//   //                 };

//   //                 // Start inserting child records
//   //                 insertChildRecords(0);
//   //             });
//   //         });
//   //     });
//   // },



//   // original

//   //     module_info_create: async (req, res) => {

//   //         const { controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status, } = req.body;

//   //         // SQL query to delete previous records with the same controller_name
//   //         const deleteQuery = 'DELETE FROM admin_page_list WHERE controller_name = ?';

//   //         // SQL query to insert a new record
//   //         const insertQuery = `INSERT INTO admin_page_list (display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;


//   //         function titleCaseWord(word) {
//   //             return word.charAt(0).toUpperCase() + word.slice(1);
//   //         }
//   //         const display_name = controller_name
//   //             .split("_")
//   //             .map(word => titleCaseWord(word))
//   //             .join(" ");


//   //         const maxValuesQuery = `
//   //   SELECT 
//   //     MAX(controller_sort) AS max_controller_sort, 
//   //     MAX(page_group_sort) AS max_page_group_sort
//   //   FROM admin_page_list
//   //   WHERE page_group = ?
//   // `;

//   //         connection.query(maxValuesQuery, [page_group], (error, result) => {
//   //             if (error) {
//   //                 console.log(error);
//   //                 return res.status(500).json({ message: 'Failed to retrieve max values.' });
//   //             }

//   //             // `result` will contain the maximum values for controller_sort and page_group_sort
//   //             const maxControllerSort = result[0].max_controller_sort;
//   //             const maxPageGroupSort = result[0].max_page_group_sort;

//   //             const controller_sort = maxControllerSort + 1;
//   //             const page_group_sort = maxPageGroupSort + 1;

//   //             connection.query(deleteQuery, [controller_name], (deleteError, deleteResult) => {
//   //                 if (deleteError) {
//   //                     console.log(deleteError);
//   //                     return res.status(500).json({ message: 'Failed to delete previous records.' });
//   //                 }
//   //                 connection.query(insertQuery, [display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status],
//   //                     (error, result) => {
//   //                         if (error) {
//   //                             console.log(error);
//   //                             return res.status(500).json({ message: 'Failed to add product.' });
//   //                         }

//   //                         const parent_id = result.insertId;
//   //                         const display_name_cr = display_name + ' Create';
//   //                         const method_name_cr = controller_name + '_create';
//   //                         const display_name_c = display_name + ' Copy';
//   //                         const method_name_c = controller_name + '_copy';
//   //                         const display_name_e = display_name + ' Edit';
//   //                         const method_name_e = controller_name + '_edit';
//   //                         const display_name_d = display_name + ' Delete';
//   //                         const method_name_d = controller_name + '_delete';
//   //                         const display_name_a = display_name + '  List';
//   //                         const method_name_a = controller_name + '_all';

//   //                         // Children create part start
//   //                         connection.query(insertQuery, [display_name_cr, controller_name, method_name_cr, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status,],
//   //                             (error, result) => {
//   //                                 if (error) {
//   //                                     console.log(error);
//   //                                     return res.status(500).json({ message: 'Failed to add product.' });
//   //                                 }
//   //                                 // console.log(result);
//   //                                 // Continue with other queries if needed
//   //                             }
//   //                         );
//   //                         // Children create part end

//   //                         // Children Copy part start
//   //                         connection.query(insertQuery, [display_name_c, controller_name, method_name_c, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status,],
//   //                             (error, result) => {
//   //                                 if (error) {
//   //                                     console.log(error);
//   //                                     return res.status(500).json({ message: 'Failed to add product.' });
//   //                                 }
//   //                                 // console.log(result);
//   //                                 // Continue with other queries if needed
//   //                             }
//   //                         );
//   //                         // Children Copy part end

//   //                         // Children Edit part start
//   //                         connection.query(insertQuery, [display_name_e, controller_name, method_name_e, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status,],
//   //                             (error, result) => {
//   //                                 if (error) {
//   //                                     console.log(error);
//   //                                     return res.status(500).json({ message: 'Failed to add product.' });
//   //                                 }
//   //                                 // console.log(result);
//   //                                 // Continue with other queries if needed
//   //                             }
//   //                         );
//   //                         // Children Edit part end

//   //                         // Children Delete part start
//   //                         connection.query(insertQuery, [display_name_d, controller_name, method_name_d, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status,],
//   //                             (error, result) => {
//   //                                 if (error) {
//   //                                     console.log(error);
//   //                                     return res.status(500).json({ message: 'Failed to add product.' });
//   //                                 }
//   //                                 // console.log(result);
//   //                                 // Continue with other queries if needed
//   //                             }
//   //                         );
//   //                         // Children Delete part end

//   //                         // Children All part start
//   //                         connection.query(insertQuery, [display_name_a, controller_name, method_name_a, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status,],
//   //                             (error, result) => {
//   //                                 if (error) {
//   //                                     console.log(error);
//   //                                     return res.status(500).json({ message: 'Failed to add product.' });
//   //                                 }
//   //                                 // console.log(result);
//   //                                 // Continue with other queries if needed
//   //                             }
//   //                         );
//   //                         // Children All part end


//   //                         // Continue with other queries if needed

//   //                         return res.send(result);
//   //                     }
//   //                 );
//   //             })
//   //         });
//   //     },






//   // module_info_create: async (req, res) => {
//   //     try {

//   //         const { display_name, controller_name, method_name,  menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status } = req.body;

//   //         const query = 'INSERT INTO admin_page_list (display_name, controller_name, method_name,  menu_type, icon, btn, default_page,  page_group, page_group_icon, controller_sort,  page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

//   //         connection.query(query, [display_name, controller_name, method_name,  menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status], (error, result) => {
//   //             if (!error) {
//   //                 console.log(result, 'get data');
//   //                 return res.send(result);
//   //             } else {
//   //                 console.log(error);
//   //                 return res.status(500).json({ message: 'Failed to add product.' });
//   //             }
//   //         });



//   //     }
//   //     catch (error) {
//   //         console.log(error)
//   //     }

//   // },

//   module_info_single: async (req, res) => {
//     try {
//       const query = 'SELECT * FROM admin_page_list WHERE id = ?';
//       connection.query(query, [req.params.id], (error, result) => {
//         if (!error && result.length > 0) {
//           console.log(result);
//           return res.send(result);
//         } else {
//           console.log(error || 'Product not found');
//           return res.status(404).json({ message: 'Product not found.' });
//         }
//       });
//     }
//     catch (error) {
//       console.log(error)
//     }
//   },

//   getPageGroupIconName: async (req, res) => {
//     try {

//       const query = 'SELECT DISTINCT  page_group FROM admin_page_list WHERE parent_id = 0 and page_group != NULL or page_group !="" ';
//       connection.query(query, [req.query.parent_id], (error, result) => {
//         if (!error && result.length > 0) {
//           console.log(result);
//           return res.send(result);
//         } else {
//           console.log(error || 'Product not found');
//           return res.status(404).json({ message: 'Product not found.' });
//         }
//       });
//     }
//     catch (error) {
//       console.log(error)
//     }
//   },


//   getPageGroupControllerName: async (req, res) => {
//     try {
//       // const { parent_id } = req.query
//       // const query = 'SELECT * FROM admin_page_list WHERE parent_id = 0';   
//       const query = 'SELECT DISTINCT  controller_name FROM admin_page_list WHERE page_group = "academic_setup"';
//       connection.query(query, [req.query.parent_id], (error, result) => {
//         if (!error && result.length > 0) {
//           console.log(result);
//           return res.send(result);
//         } else {
//           console.log(error || 'Product not found');
//           return res.status(404).json({ message: 'Product not found.' });
//         }
//       });
//     }
//     catch (error) {
//       console.log(error)
//     }
//   },


//   // module_info_list_list: async (req, res) => {
//   //     const query = `
//   //     SELECT
//   //       MIN(ap.id) AS page_group_id,
//   //       ap.page_group,
//   //       GROUP_CONCAT(DISTINCT ap.controller_name) AS controller_names
//   //     FROM admin_page_list ap
//   //     WHERE ap.parent_id = 0
//   //       AND ap.page_group IS NOT NULL
//   //       AND ap.page_group != ''
//   //       AND ap.controller_name IS NOT NULL
//   //       AND ap.controller_name != ''
//   //     GROUP BY ap.page_group
//   //   `;

//   //   connection.query(query, (error, results) => {
//   //     if (error) {
//   //       console.error('Error fetching data: ' + error.stack);
//   //       res.status(500).json({ message: 'Internal server error.' });
//   //       return;
//   //     }

//   //     if (results.length > 0) {
//   //       console.log(results);
//   //       res.send(results);
//   //     } else {
//   //       console.log('Data not found');
//   //       res.status(404).json({ message: 'Data not found.' });
//   //     }
//   //   });
//   //   },

//   // module_info_list_list: async (req, res) => {
//   //     const query = `
//   //     SELECT ap.id AS page_group_id, ap.page_group, ap.controller_name, GROUP_CONCAT(DISTINCT ap.display_name) AS display_names

//   //     FROM admin_page_list ap
//   //     WHERE ap.parent_id != 0
//   //     AND ap.menu_type = 1 
//   //     GROUP BY ap.page_group, ap.controller_name
//   //     HAVING ap.page_group IS NOT NULL AND ap.page_group != '';
//   //   `;

//   //   connection.query(query, (error, results) => {
//   //     if (error) {
//   //       console.error('Error executing MySQL query:', error);
//   //       res.status(500).json({ message: 'Internal server error' });
//   //       return;
//   //     }

//   //     // Process the data to group by page_group and create an object
//   //     const groupedData = results.reduce((acc, row) => {
//   //       const { page_group_id, page_group, controller_name, display_names } = row;
//   //       if (!acc[page_group]) {
//   //         acc[page_group] = {
//   //           page_group_id,
//   //           page_group,
//   //           controllers: [],
//   //         };
//   //       }

//   //       acc[page_group].controllers.push({
//   //         controller_name,
//   //         display_names: display_names.split(','),
//   //       });

//   //       return acc;
//   //     }, {});

//   //     const responseData = Object.values(groupedData);

//   //     if (responseData.length > 0) {
//   //       res.json(responseData);
//   //     } else {
//   //       res.status(404).json({ message: 'Data not found' });
//   //     }
//   //   });
//   // },

//   // getPageGroupAndDisplayNameWithId: async (req, res) => {

//   //     const query = `
//   //     SELECT ap.id AS page_group_id, ap.page_group, ap.controller_name, ap.display_name, ap.id AS method_id
//   //     FROM admin_page_list ap
//   //     GROUP BY ap.page_group, ap.controller_name, ap.display_name, ap.id
//   //     HAVING ap.page_group IS NOT NULL AND ap.page_group != '';
//   // `;

//   //     connection.query(query, (error, results) => {
//   //       if (error) {
//   //         console.error('Error executing MySQL query:', error);
//   //         res.status(500).json({ message: 'Internal server error' });
//   //         return;
//   //       }

//   //       // Process the data to group by page_group and create an object
//   //       const groupedData = results.reduce((acc, row) => {
//   //         const { page_group_id, page_group, controller_name, display_name, method_id } = row; // Change method_name to method_id
//   //         if (!acc[page_group]) {
//   //           acc[page_group] = {
//   //             page_group_id,
//   //             page_group,
//   //             controllers: [],
//   //           };
//   //         }

//   //         const controller = acc[page_group].controllers.find((c) => c.controller_name === controller_name);

//   //         if (controller) {
//   //           const display = controller.display_names.find((display) => display.display_name === display_name);
//   //           if (display) {
//   //             display.method_ids.push(method_id); // Change method_names to method_ids
//   //           } else {
//   //             controller.display_names.push({ display_name, method_ids: [method_id] }); // Change method_names to method_ids
//   //           }
//   //         } else {
//   //           acc[page_group].controllers.push({
//   //             controller_name,
//   //             display_names: [{ display_name, method_ids: [method_id] }], // Change method_names to method_ids
//   //           });
//   //         }

//   //         return acc;
//   //       }, {});

//   //       const responseData = Object.values(groupedData);

//   //       if (responseData.length > 0) {
//   //         res.json(responseData);
//   //       } else {
//   //         res.status(404).json({ message: 'Data not found' });
//   //       }
//   //     });


//   // const query = `
//   //     SELECT ap.id AS page_group_id, ap.page_group, ap.controller_name, ap.display_name, ap.id AS method_id, ap.method_name
//   //     FROM admin_page_list ap
//   //     GROUP BY ap.page_group, ap.controller_name, ap.display_name, ap.id
//   //     HAVING ap.page_group IS NOT NULL AND ap.page_group != '';
//   // `;

//   // connection.query(query, (error, results) => {
//   //     if (error) {
//   //         console.error('Error executing MySQL query:', error);
//   //         res.status(500).json({ message: 'Internal server error' });
//   //         return;
//   //     }

//   //     // Process the data to group by page_group and create an object
//   //     const groupedData = results.reduce((acc, row) => {
//   //         const { page_group_id, page_group, controller_name, display_name, method_id, method_name } = row;
//   //         if (!acc[page_group]) {
//   //             acc[page_group] = {
//   //                 page_group_id,
//   //                 page_group,
//   //                 controllers: [],
//   //             };
//   //         }

//   //         const controller = acc[page_group].controllers.find((c) => c.controller_name === controller_name);

//   //         if (controller) {
//   //             const display = controller.display_names.find((display) => display.display_name === display_name);
//   //             if (display) {
//   //                 display.method_names.push({ method_id, method_name });
//   //             } else {
//   //                 controller.display_names.push({ display_name, method_names: [{ method_id, method_name }] });
//   //             }
//   //         } else {
//   //             acc[page_group].controllers.push({
//   //                 controller_name,
//   //                 display_names: [{ display_name, method_names: [{ method_id, method_name }] }],
//   //             });
//   //         }

//   //         return acc;
//   //     }, {});

//   //     const responseData = Object.values(groupedData);

//   //     if (responseData.length > 0) {
//   //         res.json(responseData);
//   //     } else {
//   //         res.status(404).json({ message: 'Data not found' });
//   //     }
//   // });
//   //     const query = `
//   //         SELECT ap.id AS page_group_id, ap.page_group, ap.controller_name, ap.display_name, ap.id AS method_id, ap.method_name, ap.parent_id, ap.menu_type
//   //         FROM admin_page_list ap
//   //         GROUP BY ap.page_group, ap.controller_name, ap.display_name, ap.id
//   //         HAVING ap.page_group IS NOT NULL AND ap.page_group != '';
//   //     `;

//   // connection.query(query, (error, results) => {
//   //     if (error) {
//   //         console.error('Error executing MySQL query:', error);
//   //         res.status(500).json({ message: 'Internal server error' });
//   //         return;
//   //     }

//   //     // Process the data to group by page_group and create an object
//   //     const groupedData = results.reduce((acc, row) => {
//   //         const { page_group_id, page_group, controller_name, display_name, method_id, method_name, parent_id, menu_type } = row;
//   //         if (!acc[page_group]) {
//   //             acc[page_group] = {
//   //                 page_group_id,
//   //                 page_group,
//   //                 controllers: [],
//   //             };
//   //         }

//   //         const controller = acc[page_group].controllers.find((c) => c.controller_name === controller_name);

//   //         if (controller) {
//   //             const display = controller.display_names.find((display) => display.display_name === display_name);
//   //             if (display) {
//   //                 const method = display.method_names.find((method) => method.method_id === method_id);
//   //                 if (method) {
//   //                     // If method already exists, just add parent_id and menu_type
//   //                     method.parent_id = parent_id;
//   //                     method.menu_type = menu_type;
//   //                 } else {
//   //                     display.method_names.push({ method_id, method_name, parent_id, menu_type });
//   //                 }
//   //             } else {
//   //                 controller.display_names.push({ display_name, method_names: [{ method_id, method_name, parent_id, menu_type }] });
//   //             }
//   //         } else {
//   //             acc[page_group].controllers.push({
//   //                 controller_name,
//   //                 display_names: [{ display_name, method_names: [{ method_id, method_name, parent_id, menu_type }] }],
//   //             });
//   //         }

//   //         return acc;
//   //     }, {});

//   //     const responseData = Object.values(groupedData);

//   //     if (responseData.length > 0) {
//   //         res.json(responseData);
//   //     } else {
//   //         res.status(404).json({ message: 'Data not found' });
//   //     }
//   // });


//   // const query = `
//   //     SELECT ap.id AS page_group_id, ap.page_group, ap.controller_name, ap.display_name, ap.id AS method_id, ap.method_name, ap.parent_id, ap.menu_type
//   //     FROM admin_page_list ap
//   //     GROUP BY ap.page_group, ap.controller_name, ap.display_name, ap.id
//   //     HAVING ap.page_group IS NOT NULL AND ap.page_group != '';
//   // `;

//   // connection.query(query, (error, results) => {
//   //     if (error) {
//   //         console.error('Error executing MySQL query:', error);
//   //         res.status(500).json({ message: 'Internal server error' });
//   //         return;
//   //     }

//   //     // Process the data to group by page_group and create an object
//   //     const groupedData = results.reduce((acc, row) => {
//   //         const { page_group_id, page_group, controller_name, display_name, method_id, method_name, parent_id, menu_type } = row;
//   //         const pageGroupLowerCase = page_group.toLowerCase(); // Convert to lowercase

//   //         if (!acc[pageGroupLowerCase]) {
//   //             acc[pageGroupLowerCase] = {
//   //                 page_group_id,
//   //                 page_group: pageGroupLowerCase, // Store in lowercase
//   //                 controllers: [],
//   //             };
//   //         }

//   //         const controller = acc[pageGroupLowerCase].controllers.find((c) => c.controller_name.toLowerCase() === controller_name.toLowerCase()); // Compare in lowercase

//   //         if (controller) {
//   //             const display = controller.display_names.find((display) => display.display_name.toLowerCase() === display_name.toLowerCase()); // Compare in lowercase
//   //             if (display) {
//   //                 const method = display.method_names.find((method) => method.method_id === method_id);
//   //                 if (method) {
//   //                     // If method already exists, just add parent_id and menu_type
//   //                     method.parent_id = parent_id;
//   //                     method.menu_type = menu_type;
//   //                 } else {
//   //                     display.method_names.push({ method_id, method_name, parent_id, menu_type });
//   //                 }
//   //             } else {
//   //                 controller.display_names.push({ display_name, method_names: [{ method_id, method_name, parent_id, menu_type }] });
//   //             }
//   //         } else {
//   //             acc[pageGroupLowerCase].controllers.push({
//   //                 controller_name,
//   //                 display_names: [{ display_name, method_names: [{ method_id, method_name, parent_id, menu_type }] }],
//   //             });
//   //         }

//   //         return acc;
//   //     }, {});

//   //     const responseData = Object.values(groupedData);

//   //     if (responseData.length > 0) {
//   //         res.json(responseData);
//   //     } else {
//   //         res.status(404).json({ message: 'Data not found' });
//   //     }
//   // });

//   //     },


//   getPageGroupAndDisplayNameWithId: async (req, res) => {

//     //     const query = `
//     //     SELECT ap.id AS page_group_id, ap.page_group, ap.controller_name, ap.display_name, ap.id AS method_id, ap.method_name, ap.parent_id, ap.menu_type, ap.method_sort
//     //     FROM admin_page_list ap
//     //     GROUP BY ap.page_group, ap.controller_name, ap.display_name, ap.id
//     //     HAVING ap.page_group IS NOT NULL AND ap.page_group != '';
//     // `;

//     // connection.query(query, (error, results) => {
//     //     if (error) {
//     //         console.error('Error executing MySQL query:', error);
//     //         res.status(500).json({ message: 'Internal server error' });
//     //         return;
//     //     }

//     //     // Process the data to group by page_group and create an object
//     //     const groupedData = results.reduce((acc, row) => {
//     //         const { page_group_id, page_group, controller_name, display_name, method_id, method_name, parent_id, menu_type, method_sort } = row;
//     //         const pageGroupLowerCase = page_group.toLowerCase(); // Convert to lowercase

//     //         if (!acc[pageGroupLowerCase]) {
//     //             acc[pageGroupLowerCase] = {
//     //                 page_group_id,
//     //                 page_group: pageGroupLowerCase, // Store in lowercase
//     //                 controllers: [],
//     //             };
//     //         }

//     //         const controller = acc[pageGroupLowerCase].controllers.find((c) => c.controller_name.toLowerCase() === controller_name.toLowerCase()); // Compare in lowercase

//     //         if (controller) {
//     //             const display = controller.display_names.find((display) => display.display_name.toLowerCase() === display_name.toLowerCase()); // Compare in lowercase
//     //             if (display) {
//     //                 const method = display.method_names.find((method) => method.method_id === method_id);
//     //                 if (method) {
//     //                     // If method already exists, just add parent_id, menu_type, and method_sort
//     //                     method.parent_id = parent_id;
//     //                     method.menu_type = menu_type;
//     //                     method.method_sort = method_sort;
//     //                 } else {
//     //                     display.method_names.push({ method_id, method_name, parent_id, menu_type, method_sort });
//     //                 }
//     //             } else {
//     //                 controller.display_names.push({ display_name, method_names: [{ method_id, method_name, parent_id, menu_type, method_sort }] });
//     //             }
//     //         } else {
//     //             acc[pageGroupLowerCase].controllers.push({
//     //                 controller_name,
//     //                 display_names: [{ display_name, method_names: [{ method_id, method_name, parent_id, menu_type, method_sort }] }],
//     //             });
//     //         }

//     //         return acc;
//     //     }, {});

//     //     const responseData = Object.values(groupedData);

//     //     if (responseData.length > 0) {
//     //         res.json(responseData);
//     //     } else {
//     //         res.status(404).json({ message: 'Data not found' });
//     //     }
//     // });


//     // const query = `
//     //     SELECT ap.id AS page_group_id, ap.page_group, ap.controller_name, ap.display_name, ap.id AS method_id, ap.method_name, ap.parent_id, ap.menu_type, ap.method_sort
//     //     FROM admin_page_list ap
//     //     GROUP BY ap.page_group, ap.controller_name, ap.display_name, ap.id
//     //     HAVING ap.page_group IS NOT NULL AND ap.page_group != '';
//     // `;

//     // connection.query(query, (error, results) => {
//     //     if (error) {
//     //         console.error('Error executing MySQL query:', error);
//     //         res.status(500).json({ message: 'Internal server error' });
//     //         return;
//     //     }

//     //     // Process the data to group by page_group and create an object
//     //     const groupedData = results.reduce((acc, row) => {
//     //         const { page_group_id, page_group, controller_name, display_name, method_id, method_name, parent_id, menu_type, method_sort } = row;
//     //         const pageGroupLowerCase = page_group.toLowerCase(); // Convert to lowercase

//     //         if (!acc[pageGroupLowerCase]) {
//     //             acc[pageGroupLowerCase] = {
//     //                 page_group_id,
//     //                 page_group: pageGroupLowerCase, // Store in lowercase
//     //                 controllers: [],
//     //             };
//     //         }

//     //         const controller = acc[pageGroupLowerCase].controllers.find((c) => c.controller_name.toLowerCase() === controller_name.toLowerCase()); // Compare in lowercase

//     //         if (controller) {
//     //             const display = controller.display_names.find((display) => display.display_name.toLowerCase() === display_name.toLowerCase()); // Compare in lowercase
//     //             if (display) {
//     //                 const method = display.method_names.find((method) => method.method_id === method_id);
//     //                 if (method) {
//     //                     // If method already exists, just add parent_id, menu_type, and method_sort
//     //                     method.parent_id = parent_id;
//     //                     method.menu_type = menu_type;
//     //                     method.method_sort = method_sort;
//     //                 } else {
//     //                     display.method_names.push({ method_id, method_name, parent_id, menu_type, method_sort });
//     //                 }
//     //             } else {
//     //                 controller.display_names.push({ display_name, method_names: [{ method_id, method_name, parent_id, menu_type, method_sort }] });
//     //             }
//     //         } else {
//     //             acc[pageGroupLowerCase].controllers.push({
//     //                 controller_name,
//     //                 display_names: [{ display_name, method_names: [{ method_id, method_name, parent_id, menu_type, method_sort }] }],
//     //             });
//     //         }

//     //         return acc;
//     //     }, {});

//     //     // Sort display_names based on method_sort in descending order
//     //     Object.values(groupedData).forEach((group) => {
//     //       group.controllers.forEach((controller) => {
//     //           controller.display_names.sort((a, b) => a.method_names[0].method_sort - b.method_names[0].method_sort);
//     //       });
//     //   });

//     //     const responseData = Object.values(groupedData);

//     //     if (responseData.length > 0) {
//     //         res.json(responseData);
//     //     } else {
//     //         res.status(404).json({ message: 'Data not found' });
//     //     }
//     // });
//     const query = `
//     SELECT ap.id AS page_group_id, ap.page_group, ap.controller_name, ap.display_name, ap.id AS method_id, ap.method_name, ap.parent_id, ap.menu_type, ap.method_sort
//     FROM admin_page_list ap
//     GROUP BY ap.page_group, ap.controller_name, ap.display_name, ap.id
//     HAVING ap.page_group IS NOT NULL AND ap.page_group != '';
// `;

//     connection.query(query, (error, results) => {
//       if (error) {
//         console.error('Error executing MySQL query:', error);
//         res.status(500).json({ message: 'Internal server error' });
//         return;
//       }

//       // Process the data to group by page_group and create an object
//       const groupedData = results.reduce((acc, row) => {
//         const { page_group_id, page_group, controller_name, display_name, method_id, method_name, parent_id, menu_type, method_sort } = row;
//         const pageGroupLowerCase = page_group.toLowerCase(); // Convert to lowercase

//         if (!acc[pageGroupLowerCase]) {
//           acc[pageGroupLowerCase] = {
//             page_group_id,
//             page_group: pageGroupLowerCase, // Store in lowercase
//             controllers: [],
//           };
//         }

//         const controller = acc[pageGroupLowerCase].controllers.find((c) => c.controller_name.toLowerCase() === controller_name.toLowerCase()); // Compare in lowercase

//         if (controller) {
//           const display = controller.display_names.find((display) => display.display_name.toLowerCase() === display_name.toLowerCase()); // Compare in lowercase
//           if (display) {
//             const method = display.method_names.find((method) => method.method_id === method_id);
//             if (method) {
//               // If method already exists, just add parent_id, menu_type, and method_sort
//               method.parent_id = parent_id;
//               method.menu_type = menu_type;
//               method.method_sort = method_sort;
//             } else {
//               display.method_names.push({ method_id, method_name, parent_id, menu_type, method_sort });
//             }
//           } else {
//             controller.display_names.push({ display_name, method_names: [{ method_id, method_name, parent_id, menu_type, method_sort }] });
//           }
//         } else {
//           acc[pageGroupLowerCase].controllers.push({
//             controller_name,
//             display_names: [{ display_name, method_names: [{ method_id, method_name, parent_id, menu_type, method_sort }] }],
//           });
//         }

//         return acc;
//       }, {});

//       // Add "blank" controller_name for missing method_sort values
//       Object.values(groupedData).forEach((group) => {
//         group.controllers.forEach((controller) => {
//           const methodSorts = controller.display_names.map((display) => display.method_names[0].method_sort);
//           for (let i = 0; i <= 5; i++) {
//             if (!methodSorts.includes(i)) {
//               controller.display_names.push({ display_name: '', method_names: [{ method_id: '', method_name: '', parent_id: '', menu_type: '', method_sort: i }] });
//             }
//           }
//         });
//       });

//       // Sort display_names based on method_sort in ascending order (lower number to higher number)
//       Object.values(groupedData).forEach((group) => {
//         group.controllers.forEach((controller) => {
//           controller.display_names.sort((a, b) => a.method_names[0].method_sort - b.method_names[0].method_sort);
//         });
//       });

//       const responseData = Object.values(groupedData);

//       if (responseData.length > 0) {
//         res.json(responseData);
//       } else {
//         res.status(404).json({ message: 'Data not found' });
//       }
//     });

//   },





//   module_info_list_list: async (req, res) => {
//     const query = `
//     SELECT ap.id AS page_group_id, ap.page_group, ap.controller_name, ap.display_name, ap.method_name
//     FROM admin_page_list ap
//     WHERE ap.parent_id != 0
//     AND ap.menu_type = 1 
//     GROUP BY ap.page_group, ap.controller_name, ap.display_name, ap.method_name
//     HAVING ap.page_group IS NOT NULL AND ap.page_group != '';
//   `;

//     connection.query(query, (error, results) => {
//       if (error) {
//         console.error('Error executing MySQL query:', error);
//         res.status(500).json({ message: 'Internal server error' });
//         return;
//       }

//       // Helper function to compare names case-insensitively
//       const areNamesEqual = (name1, name2) => name1.toLowerCase() === name2.toLowerCase();

//       // Process the data to group by page_group and create an object
//       const groupedData = results.reduce((acc, row) => {
//         const { page_group_id, page_group, controller_name, display_name, method_name } = row;
//         const pageGroupLowerCase = page_group.toLowerCase(); // Convert to lowercase

//         if (!acc[pageGroupLowerCase]) {
//           acc[pageGroupLowerCase] = {
//             page_group_id,
//             page_group: pageGroupLowerCase, // Store in lowercase
//             controllers: [],
//           };
//         }

//         const controller = acc[pageGroupLowerCase].controllers.find((c) => areNamesEqual(c.controller_name, controller_name)); // Compare names case-insensitively

//         if (controller) {
//           const display = controller.display_names.find((display) => areNamesEqual(display.display_name, display_name)); // Compare names case-insensitively
//           if (display) {
//             display.method_names.push(method_name);
//           } else {
//             controller.display_names.push({ display_name, method_names: [method_name] });
//           }
//         } else {
//           acc[pageGroupLowerCase].controllers.push({
//             controller_name,
//             display_names: [{ display_name, method_names: [method_name] }],
//           });
//         }

//         return acc;
//       }, {});

//       const responseData = Object.values(groupedData);

//       if (responseData.length > 0) {
//         res.json(responseData);
//       } else {
//         res.status(404).json({ message: 'Data not found' });
//       }
//     });
//   },







//   // module_info_list_list: async (req, res) => {
//   //   const query = `
//   //     SELECT ap.id AS page_group_id, ap.page_group, ap.controller_name, GROUP_CONCAT(DISTINCT ap.display_name) AS display_names,
//   //     GROUP_CONCAT(DISTINCT ap.method_name) AS method_names
//   //     FROM admin_page_list ap
//   //     WHERE ap.parent_id != 0
//   //     AND ap.menu_type = 1 
//   //     GROUP BY ap.page_group, ap.controller_name
//   //     HAVING ap.page_group IS NOT NULL AND ap.page_group != '';
//   //   `;

//   //   connection.query(query, (error, results) => {
//   //     if (error) {
//   //       console.error('Error executing MySQL query:', error);
//   //       res.status(500).json({ message: 'Internal server error' });
//   //       return;
//   //     }

//   //     // Process the data to group by page_group and create an object
//   //     const groupedData = results.reduce((acc, row) => {
//   //       const { page_group_id, page_group, controller_name, display_names, method_names } = row;
//   //       if (!acc[page_group]) {
//   //         acc[page_group] = {
//   //           page_group_id,
//   //           page_group,
//   //           controllers: [],
//   //         };
//   //       }

//   //       acc[page_group].controllers.push({
//   //         controller_name,
//   //         display_names: display_names.split(','),
//   //         method_names: method_names.split(','),
//   //       });

//   //       return acc;
//   //     }, {});

//   //     const responseData = Object.values(groupedData);

//   //     if (responseData.length > 0) {
//   //       res.json(responseData);
//   //     } else {
//   //       res.status(404).json({ message: 'Data not found' });
//   //     }
//   //   });
//   // },











//   // module_info_list_list: async (req, res) => {
//   //   const query = `
//   //     SELECT ap.id AS page_group_id, ap.page_group, ap.controller_name, GROUP_CONCAT(DISTINCT ap.method_name) AS method_names
//   //     FROM admin_page_list ap
//   //     WHERE ap.parent_id != 0
//   //     AND ap.menu_type = 1 
//   //     GROUP BY ap.page_group, ap.controller_name
//   //     HAVING ap.page_group IS NOT NULL AND ap.page_group != '';
//   //   `;

//   //   connection.query(query, (error, results) => {
//   //     if (error) {
//   //       console.error('Error executing MySQL query:', error);
//   //       res.status(500).json({ message: 'Internal server error' });
//   //       return;
//   //     }

//   //     // Process the data to group by page_group and create an object
//   //     const groupedData = results.reduce((acc, row) => {
//   //       const { page_group_id, page_group, controller_name, method_names } = row;
//   //       if (!acc[page_group]) {
//   //         acc[page_group] = {
//   //           page_group_id,
//   //           page_group,
//   //           controllers: [],
//   //         };
//   //       }

//   //       acc[page_group].controllers.push({
//   //         controller_name,
//   //         method_names: method_names.split(','),
//   //       });

//   //       return acc;
//   //     }, {});

//   //     const responseData = Object.values(groupedData);

//   //     if (responseData.length > 0) {
//   //       res.json(responseData);
//   //     } else {
//   //       res.status(404).json({ message: 'Data not found' });
//   //     }
//   //   });
//   // },
//   //   original
//   getPageGroupAndControllerNamesss: async (req, res) => {
//     try {
//       const query = `
//             SELECT
//               ap.page_group,
//               GROUP_CONCAT(DISTINCT ap.controller_name) AS controller_names
//             FROM admin_page_list ap
//             WHERE ap.parent_id = 0
//               AND ap.page_group IS NOT NULL
//               AND ap.page_group != ''
//               AND ap.controller_name IS NOT NULL
//               AND ap.controller_name != ''
//             GROUP BY ap.page_group
//             HAVING COUNT(DISTINCT ap.controller_name) = COUNT(ap.controller_name)
//           `;

//       connection.query(query, (error, result) => {
//         if (!error && result.length > 0) {
//           console.log(result);
//           return res.send(result);
//         } else {
//           console.log(error || 'Data not found');
//           return res.status(404).json({ message: 'Data not found.' });
//         }
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   },



//   // email/email?=admin@gmail.com
//   getSingleAdminPageListEmail: async (req, res) => {
//     try {
//       const { email } = req.query
//       const query = 'SELECT * FROM users WHERE email = ?';
//       connection.query(query, [email], (error, result) => {
//         if (!error && result.length > 0) {
//           console.log(result);
//           return res.send(result);
//         } else {
//           console.log(error || 'Product not found');
//           return res.status(404).json({ message: 'Product not found.' });
//         }
//       });
//     }
//     catch (error) {
//       console.log(error)
//     }
//   },

//   // module_info_delete: async (req, res) => {
//   //     try {
//   //         const idToDelete = req.params.id;

//   //         // Check if the ID exists in admin_page_list
//   //         const checkQuery = `SELECT COUNT(*) AS count FROM admin_page_list WHERE id = ?`;

//   //         connection.query(checkQuery, [idToDelete], (checkError, checkResults) => {
//   //           if (checkError) {
//   //             console.error('Error checking if the ID exists:', checkError);
//   //             connection.end();
//   //             return;
//   //           }

//   //           const rowCount = checkResults[0].count;

//   //           if (rowCount === 0) {
//   //             console.log('ID does not exist in admin_page_list.');
//   //             connection.end();
//   //           } else {
//   //             // If the ID exists in admin_page_list, proceed to delete it
//   //             const deleteQuery = `DELETE FROM admin_page_list WHERE id = ?`;

//   //             connection.query(deleteQuery, [idToDelete], (deleteError, deleteResults) => {
//   //               if (deleteError) {
//   //                 console.error('Error deleting the ID:', deleteError);
//   //               } else {
//   //                 console.log('ID deleted from admin_page_list.');
//   //               }

//   //               connection.end();
//   //             });
//   //           }
//   //         });
//   //     }
//   //     catch (error) {
//   //         console.log(error)
//   //     }
//   // },
//   module_info_delete: async (req, res) => {
//     try {
//       const query = 'DELETE FROM admin_page_list WHERE id = ?';
//       connection.query(query, [req.params.id], (error, result) => {
//         if (!error && result.affectedRows > 0) {
//           console.log(result);
//           return res.send(result);
//         } else {
//           console.log(error || 'Product not found');
//           return res.status(404).json({ message: 'Product not found.' });
//         }
//       });
//     }
//     catch (error) {
//       console.log(error)
//     }
//   },


// }


// module.exports = AdminPageListModel



// previous code end

const connection = require('../../../../connection/config/database')
const AdminPageListModel = {
  getAllAdminPageList: async (req, res) => {
    try {
      const data = "select * from 	module_info";
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

  admin_panel_settings_list: async (req, res) => {
    try {
      const data = 'SELECT * FROM admin_template';
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

  getSingleAdminPanelSettingsDownload: async (req, res) => {
    try {
      const { columnName } = req.params;
      const query = `SELECT ${columnName} FROM admin_template`; // Replace "your_table" with your actual table name

      connection.query(query, (error, result) => {
        if (error) {
          console.error('Error fetching data:', error);
          res.status(500).send('Internal Server Error');
        } else {
          // Extract the column data from the result
          const columnData = result.map((row) => row[columnName]);

          // Convert the column data to a string
          const csvData = columnData.join('\n');

          // Set headers for the download
          res.setHeader('Content-disposition', `attachment; filename=${columnName}.css`);
          res.setHeader('Content-type', 'text/css');

          // Send the data to the client
          res.status(200).send(csvData);
        }
      });
    } catch (error) {
      console.error('Error:', error);
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





  module_info_create: async (req, res) => {
    const {
      controller_name,
      method_name,
      parent_id,
      menu_type,
      icon,
      btn,
      default_page,
      page_group,
      page_group_icon,
      header_menu_page,
      controller_bg,
      controller_color,
      method_sort,
      status,
      method_code,
      controller_code,
      method_status,
    } = req.body;

    // SQL query to delete previous records with the same controller_name
    const deleteQuery = 'DELETE FROM module_info WHERE controller_name = ?';

    // SQL query to insert a new record for the parent
    const insertParentQuery = `INSERT INTO module_info (display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // SQL query to insert a new record for the child
    const insertChildQuery = `INSERT INTO module_info (display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, page_group_icon, controller_sort, page_group_sort, header_menu_page, controller_bg, controller_color, method_sort, status, method_code, controller_code, method_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Function to convert snake_case to Title Case
    const titleCaseWord = (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    };

    // Convert controller_name to display_name
    const display_name = controller_name
      ?.split('_')
      .map((word) => titleCaseWord(word))
      .join(' ');

    // Determine menu_type based on method_name
    let calculatedMenuType = 0; // Default to 0
    if (method_name === `${controller_name}_create` || method_name === `${controller_name}_all`) {
      calculatedMenuType = 1; // Set to 1 if method_name matches conditions
    }

    // Determine method_sort based on method_name
    let calculatedMethodSort = 0; // Default to 0
    switch (method_name) {
      case `${controller_name}_create`:
        calculatedMethodSort = 1;
        break;
      case `${controller_name}_all`:
        calculatedMethodSort = 2;
        break;
      case `${controller_name}_copy`:
        calculatedMethodSort = 3;
        break;
      case `${controller_name}_edit`:
        calculatedMethodSort = 4;
        break;
      case `${controller_name}_delete`:
        calculatedMethodSort = 5;
        break;
      default:
        calculatedMethodSort = 0;
    }

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

        connection.query(
          insertParentQuery,
          [
            display_name,
            controller_name,
            method_name,
            parent_id,
            1, // Set menu_type to 1 for the parent
            icon,
            btn,
            default_page,
            page_group,
            page_group_icon,
            controller_sort,
            page_group_sort,
            header_menu_page,
            controller_bg,
            controller_color,
            calculatedMethodSort, // Set method_sort for the parent
            status,
            method_code,
            controller_code,
            method_status,
          ],
          (insertError, insertResult) => {
            if (insertError) {
              console.log(insertError);
              return res.status(500).json({ message: 'Failed to add product.' });
            }

            const parent_id = insertResult.insertId;

            const childRecords = [
              { display_name: `${display_name} Create`, method_name: `${controller_name}_create`, menu_type: 1, method_sort: 1 },
              { display_name: `${display_name} List`, method_name: `${controller_name}_all`, menu_type: 1, method_sort: 2 },
              { display_name: `${display_name} Copy`, method_name: `${controller_name}_copy`, method_sort: 4 },
              { display_name: `${display_name} Edit`, method_name: `${controller_name}_edit`, method_sort: 3 },
              { display_name: `${display_name} Delete`, method_name: `${controller_name}_delete`, method_sort: 5 },
            ];

            // Function to insert child records
            const insertChildRecords = (index) => {
              if (index >= childRecords.length) {
                // All child records inserted
                return res.send(insertResult);
              }

              const childRecord = childRecords[index];

              connection.query(
                insertChildQuery,
                [
                  childRecord.display_name,
                  controller_name,
                  childRecord.method_name,
                  parent_id,
                  childRecord.menu_type || calculatedMenuType, // Use menu_type if specified, otherwise calculatedMenuType
                  icon,
                  btn,
                  default_page,
                  page_group,
                  page_group_icon,
                  controller_sort,
                  page_group_sort,
                  header_menu_page,
                  controller_bg,
                  controller_color,
                  childRecord.method_sort || calculatedMethodSort, // Use method_sort if specified, otherwise calculatedMethodSort
                  status,
                  method_code,
                  controller_code,
                  method_status,
                ],
                (childInsertError, childInsertResult) => {
                  if (childInsertError) {
                    console.log(childInsertError);
                    return res.status(500).json({ message: 'Failed to add product.' });
                  }

                  // Insert the next child record
                  insertChildRecords(index + 1);
                }
              );
            };

            // Start inserting child records
            insertChildRecords(0);
          }
        );
      });
    });
  },


  module_info_single: async (req, res) => {
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







  getPageGroupAndDisplayNameWithId: async (req, res) => {
    const query = `
    SELECT
    mi.id AS page_group_id,
    mi.page_group,
    mi.controller_name,
    mi.display_name,
    mi.id AS method_id,
    mi.method_name,
    mi.parent_id,
    mi.menu_type,
    mi.method_sort
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






  //   module_info_list_list: async (req, res) => {
  //     const query = `
  //     SELECT mi.id AS page_group_id, mi.page_group, mi.controller_name, mi.display_name, mi.method_name
  // FROM module_info mi
  // WHERE mi.parent_id != 0
  //   AND mi.menu_type = 1 
  // GROUP BY mi.page_group, mi.controller_name, mi.display_name, mi.method_name
  // HAVING mi.page_group IS NOT NULL AND mi.page_group != '';

  //   `;

  //     connection.query(query, (error, results) => {
  //       if (error) {
  //         console.error('Error executing MySQL query:', error);
  //         res.status(500).json({ message: 'Internal server error' });
  //         return;
  //       }

  //       // Helper function to compare names case-insensitively
  //       const areNamesEqual = (name1, name2) => name1.toLowerCase() === name2.toLowerCase();

  //       // Process the data to group by page_group and create an object
  //       const groupedData = results.reduce((acc, row) => {
  //         const { page_group_id, page_group, controller_name, display_name, method_name } = row;
  //         const pageGroupLowerCase = page_group.toLowerCase(); // Convert to lowercase

  //         if (!acc[pageGroupLowerCase]) {
  //           acc[pageGroupLowerCase] = {
  //             page_group_id,
  //             page_group: pageGroupLowerCase, // Store in lowercase
  //             controllers: [],
  //           };
  //         }

  //         const controller = acc[pageGroupLowerCase].controllers.find((c) => areNamesEqual(c.controller_name, controller_name)); // Compare names case-insensitively

  //         if (controller) {
  //           const display = controller.display_names.find((display) => areNamesEqual(display.display_name, display_name)); // Compare names case-insensitively
  //           if (display) {
  //             display.method_names.push(method_name);
  //           } else {
  //             controller.display_names.push({ display_name, method_names: [method_name] });
  //           }
  //         } else {
  //           acc[pageGroupLowerCase].controllers.push({
  //             controller_name,
  //             display_names: [{ display_name, method_names: [method_name] }],
  //           });
  //         }

  //         return acc;
  //       }, {});

  //       const responseData = Object.values(groupedData);

  //       if (responseData.length > 0) {
  //         res.json(responseData);
  //       } else {
  //         res.status(404).json({ message: 'Data not found' });
  //       }
  //     });
  //   },
// Pervious original Start
  // module_info_list_list: async (req, res) => {
  //   const userId = req.params.id;
  //   const query = `SELECT role_name FROM users WHERE id = ?`;

  //   // Execute the query
  //   connection.query(query, [userId], (error, results, fields) => {
  //     if (error) {
  //       console.error('Error executing query:', error);
  //       res.status(500).send('Internal Server Error');
  //       return;
  //     }

  //     // Check if the user with the given id exists
  //     if (results.length === 0) {
  //       console.log('User not found');
  //       res.status(404).send('User not found');
  //       return;
  //     }

  //     // Extract the role_name from the result
  //     const roleName = results[0].role_name;
  //     console.log('Role name:', roleName);

  //     // Now, let's match the role with user_role_id in user_role_permission table
  //     const permissionQuery = `SELECT user_page_list_id FROM user_role_permission WHERE user_role_id = ?`;

  //     connection.query(permissionQuery, [roleName], (permissionError, permissionResults, permissionFields) => {
  //       if (permissionError) {
  //         console.error('Error executing permission query:', permissionError);
  //         res.status(500).send('Internal Server Error');
  //         return;
  //       }

  //       // Check if any permissions are found
  //       if (permissionResults.length === 0) {
  //         console.log('No permissions found for the role:', roleName);
  //         res.status(404).send('No permissions found for the role');
  //         return;
  //       }


  //       // Extract the user_page_list_id from the result
  //       const userPageListId = permissionResults[0].user_page_list_id;

  //       const userPageListIds = userPageListId.split(',').map(Number);

  //       console.log('User page list id:', userPageListIds);

  //       // Now, let's fetch the data from the second query and filter based on userPageListIds
  //       const getPageGroupAndControllerNamesQuery = `
  //       SELECT mi.id AS page_group_id, mi.page_group, mi.controller_name, mi.display_name, mi.method_name, mi.id
  //       FROM module_info mi
  //       WHERE mi.parent_id != 0
       
  //         AND mi.id IN (?)
  //       GROUP BY mi.page_group, mi.controller_name, mi.display_name, mi.method_name, mi.id
  //       HAVING mi.page_group IS NOT NULL AND mi.page_group != '';
  //     `;
  //     // AND mi.menu_type = 1 
  //       connection.query(getPageGroupAndControllerNamesQuery, [userPageListIds], (getPageGroupError, getPageGroupResults) => {
  //         if (getPageGroupError) {
  //           console.error('Error executing MySQL query:', getPageGroupError);
  //           res.status(500).json({ message: 'Internal server error' });
  //           return;
  //         }

  //         // Helper function to compare names case-insensitively
  //         const areNamesEqual = (name1, name2) => name1.toLowerCase() === name2.toLowerCase();

  //         // Process the data to group by page_group and create an object
  //         const groupedData = getPageGroupResults.reduce((acc, row) => {
  //           const { page_group_id, page_group, controller_name, display_name, method_name, id } = row;
  //           const pageGroupLowerCase = page_group.toLowerCase(); // Convert to lowercase

  //           if (!acc[pageGroupLowerCase]) {
  //             acc[pageGroupLowerCase] = {
  //               page_group_id: '',
  //               page_group: pageGroupLowerCase, // Store in lowercase
  //               controllers: [],
  //             };
  //           }

  //           const controller = acc[pageGroupLowerCase].controllers.find((c) => areNamesEqual(c.controller_name, controller_name)); // Compare names case-insensitively

  //           if (controller) {
  //             const display = controller.display_names.find((display) => areNamesEqual(display.display_name, display_name)); // Compare names case-insensitively
  //             if (display) {
  //               display.method_id = id; // Assign method_id directly under display_names
  //             } else {
  //               controller.display_names.push({ display_name, method_id: id, method_names: [method_name] });
  //             }
  //           } else {
  //             acc[pageGroupLowerCase].controllers.push({
  //               controller_name,
  //               display_names: [{ display_name, method_id: id, method_names: [method_name] }],
  //             });
  //           }

  //           return acc;
  //         }, {});

  //         const responseData = Object.values(groupedData);

  //         if (responseData.length > 0) {
  //           res.json(responseData);
  //         } else {
  //           res.status(404).json({ message: 'Data not found' });
  //         }
  //       });
  //     });
  //   });
  // },
  // Pervious original end
  module_info_list_list: async (req, res) => {
    const userId = req.params.id;
    const query = `SELECT role_name FROM users WHERE id = ?`;

    // Execute the query
    connection.query(query, [userId], (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Check if the user with the given id exists
        if (results.length === 0) {
            console.log('User not found');
            res.status(404).send('User not found');
            return;
        }

        // Extract the role_name from the result
        const roleName = results[0].role_name;
        console.log('Role name:', roleName);

        // Now, let's match the role with user_role_id in user_role_permission table
        const permissionQuery = `SELECT user_page_list_id FROM user_role_permission WHERE user_role_id = ?`;

        connection.query(permissionQuery, [roleName], (permissionError, permissionResults, permissionFields) => {
            if (permissionError) {
                console.error('Error executing permission query:', permissionError);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Check if any permissions are found
            if (permissionResults.length === 0) {
                console.log('No permissions found for the role:', roleName);
                res.status(404).send('No permissions found for the role');
                return;
            }

            // Extract the user_page_list_id from the result
            const userPageListId = permissionResults[0].user_page_list_id;

            const userPageListIds = userPageListId.split(',').map(Number);

            console.log('User page list id:', userPageListIds);

            // Now, let's fetch the data from the second query and filter based on userPageListIds
            const getPageGroupAndControllerNamesQuery = `
            SELECT mi.id AS page_group_id, mi.page_group, mi.controller_name, mi.display_name, mi.method_name, mi.method_sort, mi.menu_type, mi.id
            FROM module_info mi
            WHERE mi.parent_id != 0
                AND mi.id IN (?)
            GROUP BY mi.page_group, mi.controller_name, mi.display_name, mi.method_name, mi.method_sort, mi.menu_type, mi.id
            HAVING mi.page_group IS NOT NULL AND mi.page_group != '' ORDER BY mi.controller_sort ASC , mi.method_sort ASC;
        `;

            connection.query(getPageGroupAndControllerNamesQuery, [userPageListIds], (getPageGroupError, getPageGroupResults) => {
                if (getPageGroupError) {
                    console.error('Error executing MySQL query:', getPageGroupError);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }

                
                // Helper function to compare names case-insensitively
                const areNamesEqual = (name1, name2) => name1.toLowerCase() === name2.toLowerCase();

                // Process the data to group by page_group and create an object
                const groupedData = getPageGroupResults.reduce((acc, row) => {
                    const { page_group_id, page_group, controller_name, display_name, method_name, method_sort, menu_type, id } = row;
                    const pageGroupLowerCase = page_group.toLowerCase(); // Convert to lowercase

                    if (!acc[pageGroupLowerCase]) {
                        acc[pageGroupLowerCase] = {
                            page_group_id: '',
                            page_group: pageGroupLowerCase, // Store in lowercase
                            controllers: [],
                        };
                    }

                    const controller = acc[pageGroupLowerCase].controllers.find((c) => areNamesEqual(c.controller_name, controller_name)); // Compare names case-insensitively

                    if (controller) {
                        const display = controller.display_names.find((display) => areNamesEqual(display.display_name, display_name)); // Compare names case-insensitively
                        if (display) {
                            display.method_id = id; // Assign method_id directly under display_names
                            display.method_sort = method_sort; // Assign method_sort directly under display_names
                            display.menu_type = menu_type; // Assign menu_type directly under display_names
                        } else {
                            controller.display_names.push({ display_name, method_id: id, method_sort, menu_type, method_names: [method_name] });
                        }
                    } else {
                        acc[pageGroupLowerCase].controllers.push({
                            controller_name,
                            display_names: [{ display_name, method_id: id, method_sort, menu_type, method_names: [method_name] }],
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
        });
    });
},


  // module_info_list_list: async (req, res) => {
  //   const query = `
  // SELECT mi.id AS page_group_id, mi.page_group, mi.controller_name, mi.display_name, mi.method_name, mi.id
  // FROM module_info mi
  // WHERE mi.parent_id != 0
  //   AND mi.menu_type = 1 
  // GROUP BY mi.page_group, mi.controller_name, mi.display_name, mi.method_name, mi.id
  // HAVING mi.page_group IS NOT NULL AND mi.page_group != '';
  // `;

  //   connection.query(query, (error, results) => {
  //     if (error) {
  //       console.error('Error executing MySQL query:', error);
  //       res.status(500).json({ message: 'Internal server error' });
  //       return;
  //     }

  //     // Helper function to compare names case-insensitively
  //     const areNamesEqual = (name1, name2) => name1.toLowerCase() === name2.toLowerCase();

  //     // Process the data to group by page_group and create an object
  //     const groupedData = results.reduce((acc, row) => {
  //       const { page_group_id, page_group, controller_name, display_name, method_name, id } = row;
  //       const pageGroupLowerCase = page_group.toLowerCase(); // Convert to lowercase

  //       if (!acc[pageGroupLowerCase]) {
  //         acc[pageGroupLowerCase] = {
  //           page_group_id: '',
  //           page_group: pageGroupLowerCase, // Store in lowercase
  //           controllers: [],
  //         };
  //       }

  //       const controller = acc[pageGroupLowerCase].controllers.find((c) => areNamesEqual(c.controller_name, controller_name)); // Compare names case-insensitively

  //       if (controller) {
  //         const display = controller.display_names.find((display) => areNamesEqual(display.display_name, display_name)); // Compare names case-insensitively
  //         if (display) {
  //           display.method_id = id; // Assign method_id directly under display_names
  //         } else {
  //           controller.display_names.push({ display_name, method_id: id, method_names: [method_name] });
  //         }
  //       } else {
  //         acc[pageGroupLowerCase].controllers.push({
  //           controller_name,
  //           display_names: [{ display_name, method_id: id, method_names: [method_name] }],
  //         });
  //       }

  //       return acc;
  //     }, {});

  //     const responseData = Object.values(groupedData);

  //     if (responseData.length > 0) {
  //       res.json(responseData);
  //     } else {
  //       res.status(404).json({ message: 'Data not found' });
  //     }
  //   });
  // },



  //   original



  // email/email?=admin@gmail.com
  getSingleAdminPageListEmail: async (req, res) => {
    try {
      const { email } = req.query
      const query = 'SELECT * FROM users WHERE email = ?';
      connection.query(query, [email], (error, result) => {
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


  module_info_delete: async (req, res) => {
    try {
      const query = 'DELETE FROM module_info WHERE id = ?';
      connection.query(query, [req.params.id], (error, result) => {
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



}


module.exports = AdminPageListModel