
const connection = require('../../../connection/config/database')
// const path = require("path");
const sha1 = require('sha1');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
// function sha1(password) {
//     return crypto.createHash('sha1').update(password).digest('hex');
//   }



const usersListModel = {

  users_list: async (req, res) => {
    try {

      const data = "select * from users order by id desc";

      connection.query(data, function (error, result) {
        console.log(result, 'Saklain Mostak nayan')
        if (!error) {
          //   return  res.send(result,'nayan')

          res.status(200).send(result)
          // res.sendFile(path.join(__dirname + "../../App.js"));
        }

        else {
          console.log(error, 'nayan')
        }

      })
    }
    catch (error) {
      console.log(error)
    }
  },



  font_family_list: async (req, res) => {
    try {

      const data = "select * from font_family";

      connection.query(data, function (error, result) {
        console.log(result, 'Saklain Mostak nayan')
        if (!error) {
          //   return  res.send(result,'nayan')

          res.status(200).send(result)
          // res.sendFile(path.join(__dirname + "../../App.js"));
        }

        else {
          console.log(error, 'nayan')
        }

      })
    }
    catch (error) {
      console.log(error)
    }
  },

  // users_create: async (req, res) => {
  //     try {
  //         const { full_name, email, password, mobile, role_name } = req.body;

  //         if (!full_name || !password || !email || !mobile || !role_name) {
  //           return res.status(400).json({ error: 'All fields are required' });
  //         }

  //         // Encrypt the password using SHA-1 (not recommended for security)
  //         const hashedPassword = sha1(password);

  //         const newUser = {
  //           full_name,
  //           email,
  //           password: hashedPassword,
  //           mobile,
  //           role_name,
  //         };

  //         connection.query('INSERT INTO users SET ?', newUser, (err, results) => {
  //           if (err) {
  //             console.error('Error inserting user:', err);
  //             return res.status(500).json({ error: 'Internal server error' });
  //           }

  //           console.log('User inserted successfully');
  //           res.status(201).json({ message: 'User created successfully' });
  //         });
  //       } catch (error) {
  //         console.log(error);
  //         res.status(500).json({ error: 'Internal server error' });
  //       }
  // },
  users_create: async (req, res) => {
    try {
      const { full_name, email, password, mobile, role_name, OTP, pass_reset, img } = req.body;

      // Hash the password using SHA-1
      const hashedPassword = sha1(password);

      // Insert the user into the database
      const sql = 'INSERT INTO users (full_name, email, password, mobile, role_name, OTP, pass_reset, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [full_name, email, hashedPassword, mobile, role_name, OTP, pass_reset, img];

      connection.query(sql, values, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'User creation failed' });
        } else {
          res.status(200).json({ message: 'User created successfully' });
        }
      });
    }
    catch (error) {
      console.log(error)
    }
  },


  role_list: async (req, res) => {
    try {

      const data = "select * from user_role";

      connection.query(data, function (error, result) {
        console.log(result, 'Saklain Mostak nayan')
        if (!error) {
          //   return  res.send(result,'nayan')

          res.status(200).send(result)
          // res.sendFile(path.join(__dirname + "../../App.js"));
        }

        else {
          console.log(error, 'nayan')
        }

      })
    }
    catch (error) {
      console.log(error)
    }
  },

  // users_create: async (req, res) => {
  //     try {
  //         const { full_name, email, password, mobile, role_name, status, created_date, modified_date, pass_session, pass_time, pass_duration, created_by, dob, gender, age, religion, photo2, finger_print_id, unique_id, blood_group_id, signature_image, pass_code, is_online, photo } = req.body;
  //         const query = 'INSERT INTO users (full_name , email, password , mobile, role_name, status , created_date, modified_date, pass_session, pass_time, pass_duration, created_by, dob, gender, age, religion, photo2, finger_print_id, unique_id, blood_group_id, signature_image, pass_code, is_online, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  //         connection.query(query, [full_name, email, password, mobile, role_name, status, created_date, modified_date, pass_session, pass_time, pass_duration, created_by, dob, gender, age, religion, photo2, finger_print_id, unique_id, blood_group_id, signature_image, pass_code, is_online, photo], (error, result) => {
  //             if (!error) {
  //                 console.log(result);
  //                 return res.send(result);
  //             } else {
  //                 console.log(error);
  //                 return res.status(500).json({ message: 'Failed to add product.' });
  //             }
  //         });
  //     }
  //     catch (error) {
  //         console.log(error)
  //     }
  // },

  users_single: async (req, res) => {
    try {
      const query = 'SELECT * FROM users WHERE id = ?';
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

  users_delete: async (req, res) => {
    try {
      const query = 'DELETE FROM users WHERE id = ?';
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
  // email/email?=admin@gmail.com

  users_list_email_wise: async (req, res) => {
    try {
      // const {email} = req.query
      const query = 'SELECT * FROM users WHERE email = ?';
      connection.query(query, [req.query.email], (error, result) => {
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

  // password_reset: async (req, res) => {
  //   try {
  //     const { email, currentPassword, newPassword } = req.body;

  //     // Hash the current and new passwords using SHA-1
  //     const hashedCurrentPassword = sha1(currentPassword);
  //     const hashedNewPassword = sha1(newPassword);

  //     // Check if the current password matches the stored password in the database
  //     const checkPasswordSql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  //     const checkPasswordValues = [email, hashedCurrentPassword];

  //     connection.query(checkPasswordSql, checkPasswordValues, (checkPasswordErr, checkPasswordResult) => {
  //       if (checkPasswordErr) {
  //         console.error(checkPasswordErr);
  //         res.status(500).json({ message: 'Password update failed' });
  //       } else if (checkPasswordResult.length === 0) {
  //         res.status(401).json({ message: 'Current password is incorrect' });
  //       } else {
  //         // Update the password in the database
  //         const updatePasswordSql = 'UPDATE users SET password = ? WHERE email = ?';
  //         const updatePasswordValues = [hashedNewPassword, email];

  //         connection.query(updatePasswordSql, updatePasswordValues, (updatePasswordErr, updatePasswordResult) => {
  //           if (updatePasswordErr) {
  //             console.error(updatePasswordErr);
  //             res.status(500).json({ message: 'Password update failed' });
  //           } else {
  //             res.status(200).json({ message: 'Password updated successfully' });
  //           }
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },


  password_reset: async (req, res) => {
    try {
      const { email, currentPassword, newPassword } = req.body;

      // Hash the current and new passwords using SHA-1
      const hashedCurrentPassword = sha1(currentPassword);
      const hashedNewPassword = sha1(newPassword);

      // Check if the current password matches the stored password in the database
      const checkPasswordSql = 'SELECT * FROM users WHERE email = ?';
      const checkPasswordValues = [email];

      connection.query(checkPasswordSql, checkPasswordValues, (checkPasswordErr, checkPasswordResult) => {
        if (checkPasswordErr) {
          console.error(checkPasswordErr);
          res.status(500).json({ message: 'Password update failed' });
        } else {
          console.log('Check Password Result:', checkPasswordResult);

          if (checkPasswordResult.length === 0) {
            console.log('User not found:', email);
            res.status(401).json({ message: 'User not found' });
          } else {
            const storedPassword = checkPasswordResult[0].password;

            console.log('Stored Password:', storedPassword);
            console.log('Input Password:', hashedCurrentPassword);

            // Check if the hashed current password matches the stored password
            if (storedPassword === hashedCurrentPassword) {
              // Update the password in the database
              const updatePasswordSql = 'UPDATE users SET password = ? WHERE email = ?';
              const updatePasswordValues = [hashedNewPassword, email];

              connection.query(updatePasswordSql, updatePasswordValues, (updatePasswordErr, updatePasswordResult) => {
                if (updatePasswordErr) {
                  console.error(updatePasswordErr);
                  res.status(500).json({ message: 'Password update failed' });
                } else {
                  res.status(200).json({ message: 'Password updated successfully' });
                }
              });
            } else {
              console.log('Current password is incorrect. Input:', hashedCurrentPassword, 'Database:', storedPassword);
              res.status(401).json({ message: 'Current password is incorrect' });
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },




  // options_color_sub_header color_sub_header bg_sub_header
  addColumn: async (req, res) => {
    try {
      // SQL query to add the new column if it doesn't exist
      // const alterTableQuery = 'ALTER TABLE users ADD  COLUMN email_verifiy_code VARCHAR(255)';
      // const alterTableQuery = 'DROP TABLE IF EXISTS admin_template_menu';
      // const alterTableQuery = 'ALTER TABLE admin_template DROP  COLUMN sub_header_pg_text_color VARCHAR(255)';
      // const alterTableQuery = 'ALTER TABLE admin_template ADD COLUMN options_color_sub_header VARCHAR(255), ADD COLUMN color_sub_header VARCHAR(255), ADD COLUMN bg_sub_header VARCHAR(255), ADD COLUMN color_card_body VARCHAR(255);';

      // Execute the query to add the column
      connection.query(alterTableQuery, (error, result) => {
        if (error) {
          console.log('Error adding column:', error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        console.log('Column added successfully');

        // You can choose to include additional logic or send a response here if needed

        // Close the MySQL connection
        connection.end();
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },




  // side_menu_create: async (req, res) => {
  //   const file = req.body;
  //   console.log(file)

  //   const cssContent = req.body.css;

  //   // Generate a folder structure based on the current date and time
  //   const currentDate = new Date();
  //   const year = String(currentDate.getFullYear());
  //   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  //   const day = String(currentDate.getDate()).padStart(2, '0');
  //   const hours = String(currentDate.getHours()).padStart(2, '0');
  //   const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  //   const seconds = String(currentDate.getSeconds()).padStart(2, '0');

  //   const cssFolderPath = path.join(__dirname, 'css', year, month, day, hours, minutes, seconds);

  //   // Create the folder structure if it doesn't exist
  //   if (!fs.existsSync(cssFolderPath)) {
  //     fs.mkdirSync(cssFolderPath, { recursive: true });
  //   }

  //   // Create the CSS file path
  //   const cssFilePath = path.join(cssFolderPath, 'style.css');

  //   // Write the CSS content to the file


  //         fs.writeFileSync(cssFilePath, cssContent);

  //         res.json({ message: 'CSS file generated successfully', cssFilePath });

  //   try {
  //     const {
  //       created_by,
  //       left_menu,
  //       created_date,
  //       modified_date,
  //       modified_by,
  //       login_template_name,
  //       student_fee_invoice,
  //       admin_panel_name,
  //       status,
  //       version_code,
  //       css,
  //       project_name_color,
  //       bg_header,
  //       color_header,
  //       bg_sidebar,
  //       bg_body,
  //       bg_body_status,
  //       color_body,
  //       bg_body_content,
  //       bg_body_content_status,
  //       color_body_content,
  //       bg_left_menu_three,
  //       color_left_menu_three,
  //       bg_left_menu_one,
  //       color_left_menu_one,
  //       bg_left_menu_two,
  //       color_left_menu_two,
  //       bg_card_header,
  //       bg_card_header_status,
  //       color_card_header,
  //       border_left_menu_one,
  //       border_left_menu_two,
  //       border_left_menu_three,
  //       side_menu_position,
  //       bg_card_body,
  //       options_color_sub_header ,
  //       color_sub_header, 
  //       bg_sub_header, 
  //       color_card_body
  //     } = req.body;

  //     const insertQuery = `
  //       INSERT INTO admin_template (
  //         created_by,
  //         left_menu,
  //         created_date,
  //         modified_date,
  //         modified_by,
  //         login_template_name,
  //         student_fee_invoice,
  //         admin_panel_name,
  //         status,
  //         version_code,
  //         css,
  //         project_name_color,
  //         bg_header,
  //         color_header,
  //         bg_sidebar,
  //         bg_body,
  //         bg_body_status,
  //         color_body,
  //         bg_body_content,
  //         bg_body_content_status,
  //         color_body_content,
  //         bg_left_menu_three,
  //         color_left_menu_three,
  //         bg_left_menu_one,
  //         color_left_menu_one,
  //         bg_left_menu_two,
  //         color_left_menu_two,
  //         bg_card_header,
  //         bg_card_header_status,
  //         color_card_header,
  //         border_left_menu_one,
  //         border_left_menu_two,
  //         border_left_menu_three,
  //         side_menu_position,
  //         bg_card_body,
  //         options_color_sub_header ,
  //         color_sub_header, 
  //         bg_sub_header, 
  //         color_card_body
  //       ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  //     `;

  //     connection.query(
  //       insertQuery,
  //       [
  //         created_by,
  //         left_menu,
  //         created_date,
  //         modified_date,
  //         modified_by,
  //         login_template_name,
  //         student_fee_invoice,
  //         admin_panel_name,
  //         status,
  //         version_code,
  //         css,
  //         project_name_color,
  //         bg_header,
  //         color_header,
  //         bg_sidebar,
  //         bg_body,
  //         bg_body_status,
  //         color_body,
  //         bg_body_content,
  //         bg_body_content_status,
  //         color_body_content,
  //         bg_left_menu_three,
  //         color_left_menu_three,
  //         bg_left_menu_one,
  //         color_left_menu_one,
  //         bg_left_menu_two,
  //         color_left_menu_two,
  //         bg_card_header,
  //         bg_card_header_status,
  //         color_card_header,
  //         border_left_menu_one,
  //         border_left_menu_two,
  //         border_left_menu_three,
  //         side_menu_position,
  //         bg_card_body,
  //         options_color_sub_header ,
  //         color_sub_header, 
  //         bg_sub_header, 
  //         color_card_body
  //       ],
  //       (error, results) => {
  //         if (error) {
  //           console.error(error);
  //           return res.status(500).json({ message: 'Internal Server Error' });
  //         }

  //         console.log('Data inserted successfully');
  //         return res.status(200).json({ message: 'Data inserted successfully' });
  //       }
  //     );
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // },

  // original 20

  // side_menu_create: async (req, res) => {
  //   const file = req.body;
  //   console.log(file);

  //   const cssContent = req.body.css;

  //   // Generate a folder structure based on the current date and time


  //   // const cssFolderPath = path.join(__dirname, '../../../connection/css');
  //   const cssFolderPath = path.join(__dirname, '../../../../../files/admin_template');

  //   // Create the folder structure if it doesn't exist
  //   if (!fs.existsSync(cssFolderPath)) {
  //     fs.mkdirSync(cssFolderPath, { recursive: true });
  //   }


  //   try {
  //     // Write the CSS content to the file

  //     // res.status(200).json({ message: 'CSS file generated successfully', cssFilePath });

  //     const {
  //       created_by,
  //       left_menu,
  //       created_date,
  //       modified_date,
  //       modified_by,
  //       login_template_name,
  //       student_fee_invoice,
  //       admin_panel_name,
  //       status,
  //       version_code,
  //       css,
  //       project_name_color,
  //       bg_header,
  //       color_header,
  //       bg_sidebar,
  //       bg_body,
  //       bg_body_status,
  //       color_body,
  //       bg_body_content,
  //       bg_body_content_status,
  //       color_body_content,
  //       bg_left_menu_three,
  //       color_left_menu_three,
  //       bg_left_menu_one,
  //       color_left_menu_one,
  //       bg_left_menu_two,
  //       color_left_menu_two,
  //       bg_card_header,
  //       bg_card_header_status,
  //       color_card_header,
  //       border_left_menu_one,
  //       border_left_menu_two,
  //       border_left_menu_three,
  //       side_menu_position,
  //       bg_card_body,
  //       options_color_sub_header,
  //       color_sub_header,
  //       bg_sub_header,
  //       color_card_body,
  //       sub_header_pg_text_color
  //     } = req.body;

  //     if (!admin_panel_name ) {
  //       return res.status(400).json({ message: 'admin panel name and status ID are required' });
  //     }

  //     const insertQuery = `
  //       INSERT INTO admin_template (
  //         created_by,
  //         left_menu,
  //         created_date,
  //         modified_date,
  //         modified_by,
  //         login_template_name,
  //         student_fee_invoice,
  //         admin_panel_name,
  //         status,
  //         version_code,
  //         css,
  //         project_name_color,
  //         bg_header,
  //         color_header,
  //         bg_sidebar,
  //         bg_body,
  //         bg_body_status,
  //         color_body,
  //         bg_body_content,
  //         bg_body_content_status,
  //         color_body_content,
  //         bg_left_menu_three,
  //         color_left_menu_three,
  //         bg_left_menu_one,
  //         color_left_menu_one,
  //         bg_left_menu_two,
  //         color_left_menu_two,
  //         bg_card_header,
  //         bg_card_header_status,
  //         color_card_header,
  //         border_left_menu_one,
  //         border_left_menu_two,
  //         border_left_menu_three,
  //         side_menu_position,
  //         bg_card_body,
  //         options_color_sub_header,
  //         color_sub_header,
  //         bg_sub_header,
  //         color_card_body,
  //         sub_header_pg_text_color

  //       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  //     `;

  //     connection.query(
  //       insertQuery,
  //       [
  //         created_by,
  //         left_menu,
  //         created_date,
  //         modified_date,
  //         modified_by,
  //         login_template_name,
  //         student_fee_invoice,
  //         admin_panel_name,
  //         status,
  //         version_code,
  //         css,
  //         project_name_color,
  //         bg_header,
  //         color_header,
  //         bg_sidebar,
  //         bg_body,
  //         bg_body_status,
  //         color_body,
  //         bg_body_content,
  //         bg_body_content_status,
  //         color_body_content,
  //         bg_left_menu_three,
  //         color_left_menu_three,
  //         bg_left_menu_one,
  //         color_left_menu_one,
  //         bg_left_menu_two,
  //         color_left_menu_two,
  //         bg_card_header,
  //         bg_card_header_status,
  //         color_card_header,
  //         border_left_menu_one,
  //         border_left_menu_two,
  //         border_left_menu_three,
  //         side_menu_position,
  //         bg_card_body,
  //         options_color_sub_header,
  //         color_sub_header,
  //         bg_sub_header,
  //         color_card_body,
  //         sub_header_pg_text_color
  //       ],
  //       (error, results) => {
  //         if (error) {
  //           console.error(error);
  //           return res.status(500).json({ message: 'Internal Server Error' });
  //         }
  //         const insertedId = results.insertId;
  //         const cssFilePath = path.join(cssFolderPath, `admin_template_${insertedId}.css`);
  //         const paths = (`admin_template_${insertedId}.css`)
  //         fs.writeFileSync(cssFilePath, cssContent);

  //         connection.query(
  //           `UPDATE admin_template SET admin_template = ? WHERE id = ?`,
  //           [paths, insertedId],
  //           (updateError) => {
  //             if (updateError) {
  //               console.error(updateError);
  //               return res.status(500).json({ message: 'Internal Server Error' });
  //             }

  //             console.log('Data inserted successfully');
  //             // res.status(200).json({ message: 'Data inserted successfully', cssPath: cssFilePath });
  //           }
  //         );

  //         console.log('Data inserted successfully');
  //         // Send the response here, outside of the query callback
  //         res.status(200).json({ message: 'Data inserted successfully', cssPath: cssFilePath, insertedId });

  //       }
  //     );
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // },
  side_menu_create: async (req, res) => {
    // const file = req.body;
    // console.log(file);

    // const cssContent = req.body.css;

    // const cssFolderPath = path.join(__dirname, '../../../../../files/admin_template');

    // if (!fs.existsSync(cssFolderPath)) {
    //   fs.mkdirSync(cssFolderPath, { recursive: true });
    // }

    // try {
    //   const {
    //     created_by,
    //     left_menu,
    //     created_date,
    //     modified_date,
    //     modified_by,
    //     login_template_name,
    //     student_fee_invoice,
    //     admin_panel_name,
    //     status,
    //     version_code,
    //     css,
    //     project_name_color,
    //     bg_header,
    //     color_header,
    //     bg_sidebar,
    //     bg_body,
    //     bg_body_status,
    //     color_body,
    //     bg_body_content,
    //     bg_body_content_status,
    //     color_body_content,
    //     bg_left_menu_three,
    //     color_left_menu_three,
    //     bg_left_menu_one,
    //     color_left_menu_one,
    //     bg_left_menu_two,
    //     color_left_menu_two,
    //     bg_card_header,
    //     bg_card_header_status,
    //     color_card_header,
    //     border_left_menu_one,
    //     border_left_menu_two,
    //     border_left_menu_three,
    //     side_menu_position,
    //     bg_card_body,
    //     options_color_sub_header,
    //     color_sub_header,
    //     bg_sub_header,
    //     color_card_body,
    //     sub_header_pg_text_color
    //   } = req.body;

    //   if (!admin_panel_name) {
    //     return res.status(400).json({ message: 'admin panel name and status ID are required' });
    //   }

    //   // Start a transaction
    //   connection.beginTransaction((transactionError) => {
    //     if (transactionError) {
    //       console.error(transactionError);
    //       return res.status(500).json({ message: 'Internal Server Error' });
    //     }

    //     // Update all records' status to 2
    //     const updateStatusQuery = 'UPDATE admin_template SET status = 2 WHERE status = 1';

    //     connection.query(updateStatusQuery, (updateError) => {
    //       if (updateError) {
    //         console.error(updateError);
    //         return connection.rollback(() => {
    //           res.status(500).json({ message: 'Internal Server Error' });
    //         });
    //       }

    //       const insertQuery = `
    //         INSERT INTO admin_template (
    //           created_by,
    //           left_menu,
    //           created_date,
    //           modified_date,
    //           modified_by,
    //           login_template_name,
    //           student_fee_invoice,
    //           admin_panel_name,
    //           status,
    //           version_code,
    //           css,
    //           project_name_color,
    //           bg_header,
    //           color_header,
    //           bg_sidebar,
    //           bg_body,
    //           bg_body_status,
    //           color_body,
    //           bg_body_content,
    //           bg_body_content_status,
    //           color_body_content,
    //           bg_left_menu_three,
    //           color_left_menu_three,
    //           bg_left_menu_one,
    //           color_left_menu_one,
    //           bg_left_menu_two,
    //           color_left_menu_two,
    //           bg_card_header,
    //           bg_card_header_status,
    //           color_card_header,
    //           border_left_menu_one,
    //           border_left_menu_two,
    //           border_left_menu_three,
    //           side_menu_position,
    //           bg_card_body,
    //           options_color_sub_header,
    //           color_sub_header,
    //           bg_sub_header,
    //           color_card_body,
    //           sub_header_pg_text_color
    //         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    //       `;

    //       connection.query(
    //         insertQuery,
    //         [
    //           created_by,
    //           left_menu,
    //           created_date,
    //           modified_date,
    //           modified_by,
    //           login_template_name,
    //           student_fee_invoice,
    //           admin_panel_name,
    //           status,
    //           version_code,
    //           css,
    //           project_name_color,
    //           bg_header,
    //           color_header,
    //           bg_sidebar,
    //           bg_body,
    //           bg_body_status,
    //           color_body,
    //           bg_body_content,
    //           bg_body_content_status,
    //           color_body_content,
    //           bg_left_menu_three,
    //           color_left_menu_three,
    //           bg_left_menu_one,
    //           color_left_menu_one,
    //           bg_left_menu_two,
    //           color_left_menu_two,
    //           bg_card_header,
    //           bg_card_header_status,
    //           color_card_header,
    //           border_left_menu_one,
    //           border_left_menu_two,
    //           border_left_menu_three,
    //           side_menu_position,
    //           bg_card_body,
    //           options_color_sub_header,
    //           color_sub_header,
    //           bg_sub_header,
    //           color_card_body,
    //           sub_header_pg_text_color
    //         ],
    //         (insertError, results) => {
    //           if (insertError) {
    //             console.error(insertError);
    //             return connection.rollback(() => {
    //               res.status(500).json({ message: 'Internal Server Error' });
    //             });
    //           }

    //           const insertedId = results.insertId;
    //           const cssFilePath = path.join(cssFolderPath, `admin_template_${insertedId}.css`);
    //           const paths = (`admin_template_${insertedId}.css`);
    //           fs.writeFileSync(cssFilePath, cssContent);

    //           connection.query(
    //             `UPDATE admin_template SET css = ? WHERE id = ?`,
    //             [paths, insertedId],
    //             (updateError) => {
    //               if (updateError) {
    //                 console.error(updateError);
    //                 return connection.rollback(() => {
    //                   res.status(500).json({ message: 'Internal Server Error' });
    //                 });
    //               }

    //               connection.commit((commitError) => {
    //                 if (commitError) {
    //                   console.error(commitError);
    //                   return connection.rollback(() => {
    //                     res.status(500).json({ message: 'Internal Server Error' });
    //                   });
    //                 }

    //                 console.log('Data inserted successfully');
    //                 res.status(200).json({ message: 'Data inserted successfully', cssPath: cssFilePath, insertedId });
    //               });
    //             }
    //           );
    //         }
    //       );
    //     });
    //   });
    // } catch (error) {
    //   console.error(error);
    //   return res.status(500).json({ message: 'Internal Server Error' });
    // }
    const file = req.body;
    console.log(file);

    const cssContent = req.body.css;

    const cssFolderPath = path.join(__dirname, '../../../../../files/admin_template');

    if (!fs.existsSync(cssFolderPath)) {
      fs.mkdirSync(cssFolderPath, { recursive: true });
    }

    try {
      const {
        created_by,
        left_menu,
        created_date,
        modified_date,
        modified_by,
        login_template_name,
        student_fee_invoice,
        admin_panel_name,
        status,
        version_code,
        css,
        project_name_color,
        bg_header,
        color_header,
        bg_sidebar,
        bg_body,
        bg_body_status,
        color_body,
        bg_body_content,
        bg_body_content_status,
        color_body_content,
        bg_left_menu_three,
        color_left_menu_three,
        bg_left_menu_one,
        color_left_menu_one,
        bg_left_menu_two,
        color_left_menu_two,
        bg_card_header,
        bg_card_header_status,
        color_card_header,
        border_left_menu_one,
        border_left_menu_two,
        border_left_menu_three,
        side_menu_position,
        bg_card_body,
        options_color_sub_header,
        color_sub_header,
        bg_sub_header,
        color_card_body,
        sub_header_pg_text_color,
        header_text_font
      } = req.body;

      if (!admin_panel_name) {
        return res.status(400).json({ message: 'admin panel name and status ID are required' });
      }

      // Check if any record has status 1
      const checkStatusQuery = 'SELECT COUNT(*) AS count FROM admin_template WHERE status = 1';

      connection.query(checkStatusQuery, (checkError, results) => {
        if (checkError) {
          console.error(checkError);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        const count = results[0].count;

        const startTransaction = () => {
          connection.beginTransaction((transactionError) => {
            if (transactionError) {
              console.error(transactionError);
              return res.status(500).json({ message: 'Internal Server Error' });
            }

            const updateStatusQuery = 'UPDATE admin_template SET status = 2 WHERE status = 1';

            const proceedWithInsertion = () => {
              const insertQuery = `
              INSERT INTO admin_template (
                created_by,
                left_menu,
                created_date,
                modified_date,
                modified_by,
                login_template_name,
                student_fee_invoice,
                admin_panel_name,
                status,
                version_code,
                css,
                project_name_color,
                bg_header,
                color_header,
                bg_sidebar,
                bg_body,
                bg_body_status,
                color_body,
                bg_body_content,
                bg_body_content_status,
                color_body_content,
                bg_left_menu_three,
                color_left_menu_three,
                bg_left_menu_one,
                color_left_menu_one,
                bg_left_menu_two,
                color_left_menu_two,
                bg_card_header,
                bg_card_header_status,
                color_card_header,
                border_left_menu_one,
                border_left_menu_two,
                border_left_menu_three,
                side_menu_position,
                bg_card_body,
                options_color_sub_header,
                color_sub_header,
                bg_sub_header,
                color_card_body,
                sub_header_pg_text_color,
                header_text_font
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

              connection.query(
                insertQuery,
                [
                  created_by,
                  left_menu,
                  created_date,
                  modified_date,
                  modified_by,
                  login_template_name,
                  student_fee_invoice,
                  admin_panel_name,
                  status,
                  version_code,
                  css,
                  project_name_color,
                  bg_header,
                  color_header,
                  bg_sidebar,
                  bg_body,
                  bg_body_status,
                  color_body,
                  bg_body_content,
                  bg_body_content_status,
                  color_body_content,
                  bg_left_menu_three,
                  color_left_menu_three,
                  bg_left_menu_one,
                  color_left_menu_one,
                  bg_left_menu_two,
                  color_left_menu_two,
                  bg_card_header,
                  bg_card_header_status,
                  color_card_header,
                  border_left_menu_one,
                  border_left_menu_two,
                  border_left_menu_three,
                  side_menu_position,
                  bg_card_body,
                  options_color_sub_header,
                  color_sub_header,
                  bg_sub_header,
                  color_card_body,
                  sub_header_pg_text_color,
                  header_text_font
                ],
                (insertError, results) => {
                  if (insertError) {
                    console.error(insertError);
                    return connection.rollback(() => {
                      res.status(500).json({ message: 'Internal Server Error' });
                    });
                  }

                  const insertedId = results.insertId;
                  const cssFilePath = path.join(cssFolderPath, `admin_template_${insertedId}.css`);
                  const paths = `admin_template_${insertedId}.css`;
                  fs.writeFileSync(cssFilePath, cssContent);

                  connection.query(
                    `UPDATE admin_template SET css = ? WHERE id = ?`,
                    [paths, insertedId],
                    (updateError) => {
                      if (updateError) {
                        console.error(updateError);
                        return connection.rollback(() => {
                          res.status(500).json({ message: 'Internal Server Error' });
                        });
                      }

                      connection.commit((commitError) => {
                        if (commitError) {
                          console.error(commitError);
                          return connection.rollback(() => {
                            res.status(500).json({ message: 'Internal Server Error' });
                          });
                        }

                        console.log('Data inserted successfully');
                        res.status(200).json({ message: 'Data inserted successfully', cssPath: cssFilePath, insertedId });
                      });
                    }
                  );
                }
              );
            };

            if (count > 0) {
              connection.query(updateStatusQuery, (updateError) => {
                if (updateError) {
                  console.error(updateError);
                  return connection.rollback(() => {
                    res.status(500).json({ message: 'Internal Server Error' });
                  });
                }

                proceedWithInsertion();
              });
            } else {
              proceedWithInsertion();
            }
          });
        };

        startTransaction();
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },



  // side_menu_update: async (req, res) => {
  //   const file = req.body;
  //   console.log(file);

  //   const cssContent = req.body.css;

  //   // Generate a folder structure based on the current date and time
  //   const cssFolderPath = path.join(__dirname, '../../../../../files/admin_template');

  //   // Create the folder structure if it doesn't exist
  //   if (!fs.existsSync(cssFolderPath)) {
  //     fs.mkdirSync(cssFolderPath, { recursive: true });
  //   }

  //   try {
  //     const {
  //       created_by,
  //       left_menu,
  //       created_date,
  //       modified_date,
  //       modified_by,
  //       login_template_name,
  //       student_fee_invoice,
  //       admin_panel_name,
  //       status,
  //       version_code,
  //       css,
  //       project_name_color,
  //       bg_header,
  //       color_header,
  //       bg_sidebar,
  //       bg_body,
  //       bg_body_status,
  //       color_body,
  //       bg_body_content,
  //       bg_body_content_status,
  //       color_body_content,
  //       bg_left_menu_three,
  //       color_left_menu_three,
  //       bg_left_menu_one,
  //       color_left_menu_one,
  //       bg_left_menu_two,
  //       color_left_menu_two,
  //       bg_card_header,
  //       bg_card_header_status,
  //       color_card_header,
  //       border_left_menu_one,
  //       border_left_menu_two,
  //       border_left_menu_three,
  //       side_menu_position,
  //       bg_card_body,
  //       options_color_sub_header,
  //       color_sub_header,
  //       bg_sub_header,
  //       color_card_body,
  //       sub_header_pg_text_color,
  //       recordId
  //     } = req.body;

  //     const updateQuery = `
  //       UPDATE admin_template
  //       SET 
  //         created_by = ?,
  //         left_menu = ?,
  //         created_date = ?,
  //         modified_date = ?,
  //         modified_by = ?,
  //         login_template_name = ?,
  //         student_fee_invoice = ?,
  //         admin_panel_name = ?,
  //         status = ?,
  //         version_code = ?,
  //         css = ?,
  //         project_name_color = ?,
  //         bg_header = ?,
  //         color_header = ?,
  //         bg_sidebar = ?,
  //         bg_body = ?,
  //         bg_body_status = ?,
  //         color_body = ?,
  //         bg_body_content = ?,
  //         bg_body_content_status = ?,
  //         color_body_content = ?,
  //         bg_left_menu_three = ?,
  //         color_left_menu_three = ?,
  //         bg_left_menu_one = ?,
  //         color_left_menu_one = ?,
  //         bg_left_menu_two = ?,
  //         color_left_menu_two = ?,
  //         bg_card_header = ?,
  //         bg_card_header_status = ?,
  //         color_card_header = ?,
  //         border_left_menu_one = ?,
  //         border_left_menu_two = ?,
  //         border_left_menu_three = ?,
  //         side_menu_position = ?,
  //         bg_card_body = ?,
  //         options_color_sub_header = ?,
  //         color_sub_header = ?,
  //         bg_sub_header = ?,
  //         color_card_body = ?,
  //         sub_header_pg_text_color = ?
  //       WHERE id = ?
  //     `;

  //     connection.query(
  //       updateQuery,
  //       [
  //         created_by,
  //         left_menu,
  //         created_date,
  //         modified_date,
  //         modified_by,
  //         login_template_name,
  //         student_fee_invoice,
  //         admin_panel_name,
  //         status,
  //         version_code,
  //         css,
  //         project_name_color,
  //         bg_header,
  //         color_header,
  //         bg_sidebar,
  //         bg_body,
  //         bg_body_status,
  //         color_body,
  //         bg_body_content,
  //         bg_body_content_status,
  //         color_body_content,
  //         bg_left_menu_three,
  //         color_left_menu_three,
  //         bg_left_menu_one,
  //         color_left_menu_one,
  //         bg_left_menu_two,
  //         color_left_menu_two,
  //         bg_card_header,
  //         bg_card_header_status,
  //         color_card_header,
  //         border_left_menu_one,
  //         border_left_menu_two,
  //         border_left_menu_three,
  //         side_menu_position,
  //         bg_card_body,
  //         options_color_sub_header,
  //         color_sub_header,
  //         bg_sub_header,
  //         color_card_body,
  //         sub_header_pg_text_color,
  //         recordId
  //       ],
  //       (error, results) => {
  //         if (error) {
  //           console.error(error);
  //           return res.status(500).json({ message: 'Internal Server Error' });
  //         }

  //         const cssFilePath = path.join(cssFolderPath, `admin_template_${recordId}.css`);
  //         fs.writeFileSync(cssFilePath, cssContent);
  //         const paths = (`admin_template_${recordId}.css`);

  //         connection.query(
  //           `UPDATE admin_template SET admin_template = ? WHERE id = ?`,
  //           [paths, recordId],
  //           (updateError) => {
  //             if (updateError) {
  //               console.error(updateError);
  //               return res.status(500).json({ message: 'Internal Server Error' });
  //             }

  //             console.log('Data updated successfully');

  //             // Check if status is 1, then update other records' status to 2
  //             if (status === 1) {
  //               const updateOtherRecordsQuery = `
  //                 UPDATE admin_template
  //                 SET status = 2
  //                 WHERE id != ?;
  //               `;

  //               connection.query(updateOtherRecordsQuery, [recordId], (updateOtherRecordsError) => {
  //                 if (updateOtherRecordsError) {
  //                   console.error(updateOtherRecordsError);
  //                   return res.status(500).json({ message: 'Internal Server Error' });
  //                 }

  //                 console.log('Other records updated successfully');
  //                 res.status(200).json({ message: 'Data updated successfully', cssPath: cssFilePath, updatedId: recordId });
  //               });
  //             } else {
  //               // If status is not 1, no need to update other records
  //               res.status(200).json({ message: 'Data updated successfully', cssPath: cssFilePath, updatedId: recordId });
  //             }
  //           }
  //         );
  //       }
  //     );
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // },
  // Orginal 20
  // side_menu_update: async (req, res) => {
  //   const file = req.body;
  //   console.log(file);

  //   const cssContent = req.body.css;

  //   // Generate a folder structure based on the current date and time
  //   // const cssFolderPath = path.join(__dirname, '../../../connection/css');
  //   const cssFolderPath = path.join(__dirname, '../../../../../files/admin_template');

  //   // Create the folder structure if it doesn't exist
  //   if (!fs.existsSync(cssFolderPath)) {
  //     fs.mkdirSync(cssFolderPath, { recursive: true });
  //   }

  //   try {
  //     // Write the CSS content to the file

  //     const {
  //       created_by,
  //       left_menu,
  //       created_date,
  //       modified_date,
  //       modified_by,
  //       login_template_name,
  //       student_fee_invoice,
  //       admin_panel_name,
  //       status,
  //       version_code,
  //       css,
  //       project_name_color,
  //       bg_header,
  //       color_header,
  //       bg_sidebar,
  //       bg_body,
  //       bg_body_status,
  //       color_body,
  //       bg_body_content,
  //       bg_body_content_status,
  //       color_body_content,
  //       bg_left_menu_three,
  //       color_left_menu_three,
  //       bg_left_menu_one,
  //       color_left_menu_one,
  //       bg_left_menu_two,
  //       color_left_menu_two,
  //       bg_card_header,
  //       bg_card_header_status,
  //       color_card_header,
  //       border_left_menu_one,
  //       border_left_menu_two,
  //       border_left_menu_three,
  //       side_menu_position,
  //       bg_card_body,
  //       options_color_sub_header,
  //       color_sub_header,
  //       bg_sub_header,
  //       color_card_body,
  //       sub_header_pg_text_color
  //     } = req.body;

  //     // Check if the ID of the record to be updated is available in the request
  //     const recordId = req.params.id;

  //     // if (!recordId) {
  //     //   return res.status(400).json({ message: 'Record ID is required for update' });
  //     // }

  //     const updateQuery = `
  //           UPDATE admin_template
  //           SET 
  //             created_by = ?,
  //             left_menu = ?,
  //             created_date = ?,
  //             modified_date = ?,
  //             modified_by = ?,
  //             login_template_name = ?,
  //             student_fee_invoice = ?,
  //             admin_panel_name = ?,
  //             status = ?,
  //             version_code = ?,
  //             css = ?,
  //             project_name_color = ?,
  //             bg_header = ?,
  //             color_header = ?,
  //             bg_sidebar = ?,
  //             bg_body = ?,
  //             bg_body_status = ?,
  //             color_body = ?,
  //             bg_body_content = ?,
  //             bg_body_content_status = ?,
  //             color_body_content = ?,
  //             bg_left_menu_three = ?,
  //             color_left_menu_three = ?,
  //             bg_left_menu_one = ?,
  //             color_left_menu_one = ?,
  //             bg_left_menu_two = ?,
  //             color_left_menu_two = ?,
  //             bg_card_header = ?,
  //             bg_card_header_status = ?,
  //             color_card_header = ?,
  //             border_left_menu_one = ?,
  //             border_left_menu_two = ?,
  //             border_left_menu_three = ?,
  //             side_menu_position = ?,
  //             bg_card_body = ?,
  //             options_color_sub_header = ?,
  //             color_sub_header = ?,
  //             bg_sub_header = ?,
  //             color_card_body = ?,
  //             sub_header_pg_text_color = ?
  //           WHERE id = ?
  //       `;

  //     connection.query(
  //       updateQuery,
  //       [
  //         created_by,
  //         left_menu,
  //         created_date,
  //         modified_date,
  //         modified_by,
  //         login_template_name,
  //         student_fee_invoice,
  //         admin_panel_name,
  //         status,
  //         version_code,
  //         css,
  //         project_name_color,
  //         bg_header,
  //         color_header,
  //         bg_sidebar,
  //         bg_body,
  //         bg_body_status,
  //         color_body,
  //         bg_body_content,
  //         bg_body_content_status,
  //         color_body_content,
  //         bg_left_menu_three,
  //         color_left_menu_three,
  //         bg_left_menu_one,
  //         color_left_menu_one,
  //         bg_left_menu_two,
  //         color_left_menu_two,
  //         bg_card_header,
  //         bg_card_header_status,
  //         color_card_header,
  //         border_left_menu_one,
  //         border_left_menu_two,
  //         border_left_menu_three,
  //         side_menu_position,
  //         bg_card_body,
  //         options_color_sub_header,
  //         color_sub_header,
  //         bg_sub_header,
  //         color_card_body,
  //         sub_header_pg_text_color,
  //         recordId
  //       ],
  //       (error, results) => {
  //         if (error) {
  //           console.error(error);
  //           return res.status(500).json({ message: 'Internal Server Error' });
  //         }

  //         const cssFilePath = path.join(cssFolderPath, `admin_template_${recordId}.css`);
  //         fs.writeFileSync(cssFilePath, cssContent);
  //         const paths = (`admin_template_${recordId}.css`)

  //         connection.query(
  //           `UPDATE admin_template SET admin_template = ? WHERE id = ?`,
  //           [paths, recordId],  // Change insertedId to recordId
  //           (updateError) => {
  //             if (updateError) {
  //               console.error(updateError);
  //               return res.status(500).json({ message: 'Internal Server Error' });
  //             }

  //             console.log('Data updated successfully');
  //             // res.status(200).json({ message: 'Data updated successfully', cssPath: cssFilePath, updatedId: recordId });
  //           }
  //         );

  //         console.log('Data updated successfully');
  //         res.status(200).json({ message: 'Data updated successfully', cssPath: cssFilePath, updatedId: recordId });
  //       }
  //     );
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // },

  side_menu_update: async (req, res) => {


    // const file = req.body;
    // console.log(file);

    // const cssContent = req.body.css;

    // // Generate a folder structure based on the current date and time
    // const cssFolderPath = path.join(__dirname, '../../../../../files/admin_template');

    // // Create the folder structure if it doesn't exist
    // if (!fs.existsSync(cssFolderPath)) {
    //   fs.mkdirSync(cssFolderPath, { recursive: true });
    // }

    // try {
    //   // Destructure the request body
    //   const {
    //     created_by,
    //     left_menu,
    //     created_date,
    //     modified_date,
    //     modified_by,
    //     login_template_name,
    //     student_fee_invoice,
    //     admin_panel_name,
    //     version_code,
    //     css,
    //     project_name_color,
    //     bg_header,
    //     color_header,
    //     bg_sidebar,
    //     bg_body,
    //     bg_body_status,
    //     color_body,
    //     bg_body_content,
    //     bg_body_content_status,
    //     color_body_content,
    //     bg_left_menu_three,
    //     color_left_menu_three,
    //     bg_left_menu_one,
    //     color_left_menu_one,
    //     bg_left_menu_two,
    //     color_left_menu_two,
    //     bg_card_header,
    //     bg_card_header_status,
    //     color_card_header,
    //     border_left_menu_one,
    //     border_left_menu_two,
    //     border_left_menu_three,
    //     side_menu_position,
    //     bg_card_body,
    //     options_color_sub_header,
    //     color_sub_header,
    //     bg_sub_header,
    //     color_card_body,
    //     sub_header_pg_text_color
    //   } = req.body;

    //   // Check if the ID of the record to be updated is available in the request
    //   const recordId = req.params.id;

    //   if (!recordId) {
    //     return res.status(400).json({ message: 'Record ID is required for update' });
    //   }

    //   // Query to check if any record has status 1
    //   const checkStatusQuery = `
    //     SELECT COUNT(*) AS count FROM admin_template WHERE status = 1
    //   `;

    //   connection.query(checkStatusQuery, (error, results) => {
    //     if (error) {
    //       console.error(error);
    //       return res.status(500).json({ message: 'Internal Server Error' });
    //     }

    //     const { count } = results[0];
    //     const newStatus = count > 0 ? 2 : 1;

    //     // Query to update the specific record
    //     const updateQuery = `
    //       UPDATE admin_template
    //       SET 
    //         created_by = ?,
    //         left_menu = ?,
    //         created_date = ?,
    //         modified_date = ?,
    //         modified_by = ?,
    //         login_template_name = ?,
    //         student_fee_invoice = ?,
    //         admin_panel_name = ?,
    //         status = ?,
    //         version_code = ?,
    //         css = ?,
    //         project_name_color = ?,
    //         bg_header = ?,
    //         color_header = ?,
    //         bg_sidebar = ?,
    //         bg_body = ?,
    //         bg_body_status = ?,
    //         color_body = ?,
    //         bg_body_content = ?,
    //         bg_body_content_status = ?,
    //         color_body_content = ?,
    //         bg_left_menu_three = ?,
    //         color_left_menu_three = ?,
    //         bg_left_menu_one = ?,
    //         color_left_menu_one = ?,
    //         bg_left_menu_two = ?,
    //         color_left_menu_two = ?,
    //         bg_card_header = ?,
    //         bg_card_header_status = ?,
    //         color_card_header = ?,
    //         border_left_menu_one = ?,
    //         border_left_menu_two = ?,
    //         border_left_menu_three = ?,
    //         side_menu_position = ?,
    //         bg_card_body = ?,
    //         options_color_sub_header = ?,
    //         color_sub_header = ?,
    //         bg_sub_header = ?,
    //         color_card_body = ?,
    //         sub_header_pg_text_color = ?
    //       WHERE id = ?
    //     `;

    //     connection.query(
    //       updateQuery,
    //       [
    //         created_by,
    //         left_menu,
    //         created_date,
    //         modified_date,
    //         modified_by,
    //         login_template_name,
    //         student_fee_invoice,
    //         admin_panel_name,
    //         newStatus,
    //         version_code,
    //         css,
    //         project_name_color,
    //         bg_header,
    //         color_header,
    //         bg_sidebar,
    //         bg_body,
    //         bg_body_status,
    //         color_body,
    //         bg_body_content,
    //         bg_body_content_status,
    //         color_body_content,
    //         bg_left_menu_three,
    //         color_left_menu_three,
    //         bg_left_menu_one,
    //         color_left_menu_one,
    //         bg_left_menu_two,
    //         color_left_menu_two,
    //         bg_card_header,
    //         bg_card_header_status,
    //         color_card_header,
    //         border_left_menu_one,
    //         border_left_menu_two,
    //         border_left_menu_three,
    //         side_menu_position,
    //         bg_card_body,
    //         options_color_sub_header,
    //         color_sub_header,
    //         bg_sub_header,
    //         color_card_body,
    //         sub_header_pg_text_color,
    //         recordId
    //       ],
    //       (error, results) => {
    //         if (error) {
    //           console.error(error);
    //           return res.status(500).json({ message: 'Internal Server Error' });
    //         }

    //         const cssFilePath = path.join(cssFolderPath, `admin_template_${recordId}.css`);
    //         fs.writeFileSync(cssFilePath, cssContent);
    //         const paths = (`admin_template_${recordId}.css`);

    //         connection.query(
    //           `UPDATE admin_template SET admin_template = ? WHERE id = ?`,
    //           [paths, recordId],
    //           (updateError) => {
    //             if (updateError) {
    //               console.error(updateError);
    //               return res.status(500).json({ message: 'Internal Server Error' });
    //             }

    //             console.log('Data updated successfully');
    //             res.status(200).json({ message: 'Data updated successfully', cssPath: cssFilePath, updatedId: recordId });
    //           }
    //         );
    //       }
    //     );
    //   });
    // } catch (error) {
    //   console.error(error);
    //   return res.status(500).json({ message: 'Internal Server Error' });
    // }




    const file = req.body;
    console.log(file);

    const cssContent = req.body.css;

    // Generate a folder structure based on the current date and time
    const cssFolderPath = path.join(__dirname, '../../../../../files/admin_template');

    // Create the folder structure if it doesn't exist
    if (!fs.existsSync(cssFolderPath)) {
      fs.mkdirSync(cssFolderPath, { recursive: true });
    }

    try {
      // Destructure the request body
      const {
        created_by,
        left_menu,
        created_date,
        modified_date,
        modified_by,
        login_template_name,
        student_fee_invoice,
        admin_panel_name,
        status,
        version_code,
        css,
        project_name_color,
        bg_header,
        color_header,
        bg_sidebar,
        bg_body,
        bg_body_status,
        color_body,
        bg_body_content,
        bg_body_content_status,
        color_body_content,
        bg_left_menu_three,
        color_left_menu_three,
        bg_left_menu_one,
        color_left_menu_one,
        bg_left_menu_two,
        color_left_menu_two,
        bg_card_header,
        bg_card_header_status,
        color_card_header,
        border_left_menu_one,
        border_left_menu_two,
        border_left_menu_three,
        side_menu_position,
        bg_card_body,
        options_color_sub_header,
        color_sub_header,
        bg_sub_header,
        color_card_body,
        sub_header_pg_text_color,
        header_text_font
      } = req.body;

      // Check if the ID of the record to be updated is available in the request
      const recordId = req.params.id;

      if (!recordId) {
        return res.status(400).json({ message: 'Record ID is required for update' });
      }

      // Query to update all statuses to 2
      const updateAllStatusesQuery = `
        UPDATE admin_template
        SET status = 2
      `;

      connection.query(updateAllStatusesQuery, (error) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        // Query to update the specific record
        const updateQuery = `
          UPDATE admin_template
          SET 
            created_by = ?,
            left_menu = ?,
            created_date = ?,
            modified_date = ?,
            modified_by = ?,
            login_template_name = ?,
            student_fee_invoice = ?,
            admin_panel_name = ?,
            status = ?,
            version_code = ?,
            css = ?,
            project_name_color = ?,
            bg_header = ?,
            color_header = ?,
            bg_sidebar = ?,
            bg_body = ?,
            bg_body_status = ?,
            color_body = ?,
            bg_body_content = ?,
            bg_body_content_status = ?,
            color_body_content = ?,
            bg_left_menu_three = ?,
            color_left_menu_three = ?,
            bg_left_menu_one = ?,
            color_left_menu_one = ?,
            bg_left_menu_two = ?,
            color_left_menu_two = ?,
            bg_card_header = ?,
            bg_card_header_status = ?,
            color_card_header = ?,
            border_left_menu_one = ?,
            border_left_menu_two = ?,
            border_left_menu_three = ?,
            side_menu_position = ?,
            bg_card_body = ?,
            options_color_sub_header = ?,
            color_sub_header = ?,
            bg_sub_header = ?,
            color_card_body = ?,
            sub_header_pg_text_color = ?,
            header_text_font = ?
          WHERE id = ?
        `;

        connection.query(
          updateQuery,
          [
            created_by,
            left_menu,
            created_date,
            modified_date,
            modified_by,
            login_template_name,
            student_fee_invoice,
            admin_panel_name,
            1,  // Set the status of the updated record to 1
            version_code,
            css,
            project_name_color,
            bg_header,
            color_header,
            bg_sidebar,
            bg_body,
            bg_body_status,
            color_body,
            bg_body_content,
            bg_body_content_status,
            color_body_content,
            bg_left_menu_three,
            color_left_menu_three,
            bg_left_menu_one,
            color_left_menu_one,
            bg_left_menu_two,
            color_left_menu_two,
            bg_card_header,
            bg_card_header_status,
            color_card_header,
            border_left_menu_one,
            border_left_menu_two,
            border_left_menu_three,
            side_menu_position,
            bg_card_body,
            options_color_sub_header,
            color_sub_header,
            bg_sub_header,
            color_card_body,
            sub_header_pg_text_color,
            header_text_font,
            recordId
          ],
          (error, results) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ message: 'Internal Server Error' });
            }

            const cssFilePath = path.join(cssFolderPath, `admin_template_${recordId}.css`);
            fs.writeFileSync(cssFilePath, cssContent);
            const paths = (`admin_template_${recordId}.css`);

            connection.query(
              `UPDATE admin_template SET admin_template = ? WHERE id = ?`,
              [paths, recordId],
              (updateError) => {
                if (updateError) {
                  console.error(updateError);
                  return res.status(500).json({ message: 'Internal Server Error' });
                }

                console.log('Data updated successfully');
                res.status(200).json({ message: 'Data updated successfully', cssPath: cssFilePath, updatedId: recordId });
              }
            );
          }
        );
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },


  //   side_menu_update: async (req, res) => {
  //     const file = req.body;
  //     console.log(file);

  //     const cssContent = req.body.css;

  //     // Generate a folder structure based on the current date and time
  //     // const cssFolderPath = path.join(__dirname, '../../../connection/css');
  //     const cssFolderPath = path.join(__dirname, '../../../../../files/admin_template');

  //     // Create the folder structure if it doesn't exist
  //     if (!fs.existsSync(cssFolderPath)) {
  //         fs.mkdirSync(cssFolderPath, { recursive: true });
  //     }

  //     try {
  //         // Write the CSS content to the file

  //         const {
  //             created_by,
  //             left_menu,
  //             created_date,
  //             modified_date,
  //             modified_by,
  //             login_template_name,
  //             student_fee_invoice,
  //             admin_panel_name,
  //             status,
  //             version_code,
  //             css,
  //             project_name_color,
  //             bg_header,
  //             color_header,
  //             bg_sidebar,
  //             bg_body,
  //             bg_body_status,
  //             color_body,
  //             bg_body_content,
  //             bg_body_content_status,
  //             color_body_content,
  //             bg_left_menu_three,
  //             color_left_menu_three,
  //             bg_left_menu_one,
  //             color_left_menu_one,
  //             bg_left_menu_two,
  //             color_left_menu_two,
  //             bg_card_header,
  //             bg_card_header_status,
  //             color_card_header,
  //             border_left_menu_one,
  //             border_left_menu_two,
  //             border_left_menu_three,
  //             side_menu_position,
  //             bg_card_body,
  //             options_color_sub_header,
  //             color_sub_header,
  //             bg_sub_header,
  //             color_card_body,
  //             sub_header_pg_text_color
  //         } = req.body;

  //         // Check if the ID of the record to be updated is available in the request
  //         const recordId = req.params.id;

  //         // if (!recordId) {
  //         //   return res.status(400).json({ message: 'Record ID is required for update' });
  //         // }

  //         const updateQuery = `
  //             UPDATE admin_template
  //             SET 
  //                 created_by = ?,
  //                 left_menu = ?,
  //                 created_date = ?,
  //                 modified_date = ?,
  //                 modified_by = ?,
  //                 login_template_name = ?,
  //                 student_fee_invoice = ?,
  //                 admin_panel_name = ?,
  //                 status = ?,
  //                 version_code = ?,
  //                 css = ?,
  //                 project_name_color = ?,
  //                 bg_header = ?,
  //                 color_header = ?,
  //                 bg_sidebar = ?,
  //                 bg_body = ?,
  //                 bg_body_status = ?,
  //                 color_body = ?,
  //                 bg_body_content = ?,
  //                 bg_body_content_status = ?,
  //                 color_body_content = ?,
  //                 bg_left_menu_three = ?,
  //                 color_left_menu_three = ?,
  //                 bg_left_menu_one = ?,
  //                 color_left_menu_one = ?,
  //                 bg_left_menu_two = ?,
  //                 color_left_menu_two = ?,
  //                 bg_card_header = ?,
  //                 bg_card_header_status = ?,
  //                 color_card_header = ?,
  //                 border_left_menu_one = ?,
  //                 border_left_menu_two = ?,
  //                 border_left_menu_three = ?,
  //                 side_menu_position = ?,
  //                 bg_card_body = ?,
  //                 options_color_sub_header = ?,
  //                 color_sub_header = ?,
  //                 bg_sub_header = ?,
  //                 color_card_body = ?,
  //                 sub_header_pg_text_color = ?
  //             WHERE id = ?
  //         `;

  //         const updateStatusQuery = `
  //             UPDATE admin_template
  //             SET status = CASE
  //                 WHEN id = ? THEN 1
  //                 ELSE 2
  //             END
  //             WHERE id != ?
  //         `;

  //         connection.query(
  //             updateQuery,
  //             [
  //                 created_by,
  //                 left_menu,
  //                 created_date,
  //                 modified_date,
  //                 modified_by,
  //                 login_template_name,
  //                 student_fee_invoice,
  //                 admin_panel_name,
  //                 status,
  //                 version_code,
  //                 css,
  //                 project_name_color,
  //                 bg_header,
  //                 color_header,
  //                 bg_sidebar,
  //                 bg_body,
  //                 bg_body_status,
  //                 color_body,
  //                 bg_body_content,
  //                 bg_body_content_status,
  //                 color_body_content,
  //                 bg_left_menu_three,
  //                 color_left_menu_three,
  //                 bg_left_menu_one,
  //                 color_left_menu_one,
  //                 bg_left_menu_two,
  //                 color_left_menu_two,
  //                 bg_card_header,
  //                 bg_card_header_status,
  //                 color_card_header,
  //                 border_left_menu_one,
  //                 border_left_menu_two,
  //                 border_left_menu_three,
  //                 side_menu_position,
  //                 bg_card_body,
  //                 options_color_sub_header,
  //                 color_sub_header,
  //                 bg_sub_header,
  //                 color_card_body,
  //                 sub_header_pg_text_color,
  //                 recordId
  //             ],
  //             (error, results) => {
  //                 if (error) {
  //                     console.error(error);
  //                     return res.status(500).json({ message: 'Internal Server Error' });
  //                 }

  //                 const cssFilePath = path.join(cssFolderPath, `admin_template_${recordId}.css`);
  //                 fs.writeFileSync(cssFilePath, cssContent);
  //                 const paths = (`admin_template_${recordId}.css`);

  //                 connection.query(
  //                     updateStatusQuery,
  //                     [recordId, recordId],
  //                     (statusUpdateError) => {
  //                         if (statusUpdateError) {
  //                             console.error(statusUpdateError);
  //                             return res.status(500).json({ message: 'Internal Server Error' });
  //                         }

  //                         console.log('Status updated successfully');
  //                         console.log('Data updated successfully');
  //                         res.status(200).json({ message: 'Data updated successfully', cssPath: cssFilePath, updatedId: recordId });
  //                     }
  //                 );
  //             }
  //         );
  //     } catch (error) {
  //         console.error(error);
  //         return res.status(500).json({ message: 'Internal Server Error' });
  //     }
  // },



  // Import the sha1 library

  // ...

  menu_Item_list: async (req, res) => {
    try {

      const data = "select * from admin_template_menu";

      connection.query(data, function (error, result) {
        console.log(result, 'Saklain Mostak nayan')
        if (!error) {
          //   return  res.send(result,'nayan')

          res.status(200).send(result)
          // res.sendFile(path.join(__dirname + "../../App.js"));
        }

        else {
          console.log(error, 'nayan')
        }

      })
    }
    catch (error) {
      console.log(error)
    }
  },


  menu_Item_create: async (req, res) => {
    try {

      const { title_en, title_bn, link_path, link_path_type, active, parent_id, admin_template_menu_id, menu_icon, icon_align, content_en } = req.body;
      const query = 'INSERT INTO admin_template_menu (title_en, title_bn, link_path, link_path_type, active, parent_id, admin_template_menu_id	, menu_icon, icon_align, content_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      connection.query(query, [title_en, title_bn, link_path, link_path_type, active, parent_id, admin_template_menu_id, menu_icon, icon_align, content_en], (error, result) => {
        if (!error) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error);
          return res.status(500).json({ message: 'Failed to add product.' });
        }
      });
    }
    catch (error) {
      console.log(error)
    }
  },


  menu_item_create_bulk: async (req, res) => {
    try {
      const menuItems = [req.body];

      const valuesPlaceholder = menuItems.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');

      // Create the SQL query
      const query = `INSERT INTO admin_template_menu (title_en, title_bn, link_path, link_path_type, active, parent_id, admin_template_menu_id, menu_icon, icon_align, content_en) VALUES ${valuesPlaceholder}`;

      // Flatten the array of menu items into an array of values for the query
      const queryValues = menuItems.reduce((acc, item) => {
        acc.push(
          item.title_en,
          item.title_bn,
          item.link_path,
          item.link_path_type,
          item.active,
          item.parent_id,
          item.admin_template_menu_id,
          item.menu_icon,
          item.icon_align,
          item.content_en
        );
        return acc;
      }, []);

      // Execute the query
      connection.query(query, queryValues, (error, result) => {
        if (!error) {
          console.log(result);
          console.log(queryValues);
          return res.send(result);
        } else {
          console.log(error);
          return res.status(500).json({ message: 'Failed to add menu items.', queryValues, result, valuesPlaceholder, menuItems });
        }
      });
    } catch (error) {
      console.log(error);
    }
  },

  menu_item_delete_all: async (req, res) => {
    try {
      const query = 'DELETE FROM admin_template_menu';

      connection.query(query, (error, result) => {
        if (!error) {
          console.log(result);
          return res.send(result);
        } else {
          console.log(error);
          return res.status(500).json({ message: 'Failed to delete data.' });
        }
      });
    } catch (error) {
      console.log(error);
    }
  },



  admin_template_menu_update: async (req, res) => {
    try {
      const { title_en, title_bn, link_path, link_path_type, active, parent_id, admin_template_menu_id, menu_icon, icon_align, content_en } = req.body;
      const query = 'UPDATE admin_template_menu SET title_en = ?, title_bn = ?, link_path = ?, link_path_type = ?, active = ?, parent_id = ?, admin_template_menu_id = ?, menu_icon = ?, icon_align = ?, content_en = ? WHERE id = ?';
      connection.query(query, [title_en, title_bn, link_path, link_path_type, active, parent_id, admin_template_menu_id, menu_icon, icon_align, content_en, req.params.id], (error, result) => {
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



  admin_template_menu_delete: async (req, res) => {
    try {
      const query = 'DELETE FROM admin_template_menu WHERE id = ?';
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



  admin_template_menu_table_create: async (req, res) => {
    try {
      // ... (your existing code)

      // Add the table creation query
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS admin_template_menu (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title_en VARCHAR(255),
          title_bn VARCHAR(255),
          link_path VARCHAR(255),
          link_path_type VARCHAR(255),
          active VARCHAR(255),
          parent_id INT,
          admin_template_menu_id INT,
          menu_icon VARCHAR(255),
          icon_align VARCHAR(255),
          content_en VARCHAR(255)
        );
      `;

      connection.query(createTableQuery, (createTableError, createTableResult) => {
        if (createTableError) {
          console.log(createTableError);
          return res.status(500).json({ message: 'Failed to create admin_template_menu table.' });
        }

        console.log('admin_template_menu table created successfully');

        // Continue with your existing code to insert menu items
        const { title_en, title_bn, link_path, link_path_type, active, parent_id, menu_id, menu_icon, icon_align, content_en } = req.body;
        const insertQuery = 'INSERT INTO menu_item (title_en, title_bn, link_path, link_path_type, active, parent_id, menu_id, menu_icon, icon_align, content_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        connection.query(insertQuery, [title_en, title_bn, link_path, link_path_type, active, parent_id, menu_id, menu_icon, icon_align, content_en], (insertError, insertResult) => {
          if (!insertError) {
            console.log(insertResult);
            return res.send(insertResult);
          } else {
            console.log(insertError);
            return res.status(500).json({ message: 'Failed to add menu item.' });
          }
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },




  users_login: async (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    connection.query(sql, [email], async (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed' });
      } else if (result.length === 0) {
        res.status(401).json({ message: 'User not found' });
      } else {
        const user = result[0];
        const hashedPassword = sha1(password); // Hash the password using SHA-1

        if (hashedPassword === user.password) { // Compare with the stored hash
          res.status(200).json({ message: 'Login successful' });
          // res.redirect('http://192.168.0.107:3000')
        } else {
          res.status(401).json({ message: 'Invalid password' });
        }
      }
    });
  },


  users_edit: async (req, res) => {
    try {
      const { full_name, email, mobile, role_name, img } = req.body;
      const query = 'UPDATE users SET full_name = ?, email = ?, mobile = ?, photo = ?, role_name = ? WHERE id = ? ';
      connection.query(query, [full_name, email, mobile, img, role_name, req.params.id], (error, result) => {
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

  // UpdateSingleUserMobileVerificationCode: async (req, res) => {
  //   try {
  //     const { OTP, verifiy_codes } = req.body;
  //     const query = 'UPDATE users SET OTP = ? , verifiy_codes = ?  WHERE id = ? ';
  //     connection.query(query, [OTP, verifiy_codes, req.params.id], (error, result) => {
  //       if (!error && result.affectedRows > 0) {
  //         console.log(result);
  //         return res.send(result);
  //       } else {
  //         console.log(error || 'Product not found');
  //         return res.status(404).json({ message: 'Product not found.' });
  //       }
  //     });
  //   }
  //   catch (error) {
  //     console.log(error)
  //   }
  // },

  UpdateSingleUserMobileVerificationCode: async (req, res) => {
    try {
      const { OTP, verifiy_codes, emailCodeTimeOut } = req.body;
      const query = 'UPDATE users SET OTP = ?, verifiy_codes = ? WHERE id = ?';
      connection.query(query, [OTP, verifiy_codes, req.params.id], (error, result) => {
        if (!error && result.affectedRows > 0) {
          console.log(result);

          // Set a timeout to update verifiy_codes to null after 2 minutes
          setTimeout(() => {
            const nullifyQuery = 'UPDATE users SET verifiy_codes = NULL WHERE id = ?';
            connection.query(nullifyQuery, [req.params.id], (nullifyError, nullifyResult) => {
              if (!nullifyError) {
                console.log("verifiy_codes set to null after 2 minutes");
              } else {
                console.log(nullifyError);
              }
            });
          }, emailCodeTimeOut * 60 * 1000); // 2 minutes in milliseconds

          return res.send(result);
        } else {
          console.log(error || 'Product not found');
          return res.status(404).json({ message: 'Product not found.' });
        }
      });
    } catch (error) {
      console.log(error)
    }
  },

  UpdateSingleUserEmailVerificationCode: async (req, res) => {
    try {
      const { OTP, email_verifiy_code, emailCodeTimeOut } = req.body;

      console.log(emailCodeTimeOut)

      const query = 'UPDATE users SET OTP = ?, email_verifiy_code = ? WHERE id = ?';
      connection.query(query, [OTP, email_verifiy_code, req.params.id], (error, result) => {
        if (!error && result.affectedRows > 0) {
          console.log(result);

          // Set a timeout to update email_verifiy_code to null after 2 minutes
          setTimeout(() => {
            const nullifyQuery = 'UPDATE users SET email_verifiy_code = NULL WHERE id = ?';
            connection.query(nullifyQuery, [req.params.id], (nullifyError, nullifyResult) => {
              if (!nullifyError) {
                console.log("email_verifiy_code set to null after 2 minutes");
              } else {
                console.log(nullifyError);
              }
            });
          }, emailCodeTimeOut * 60 * 1000); // 2 minutes in milliseconds

          return res.send(result);
        } else {
          console.log(error || 'Product not found');
          return res.status(404).json({ message: 'Product not found.' });
        }
      });
    } catch (error) {
      console.log(error)
    }
  },

  // UpdateSingleUserEmailVerificationCode: async (req, res) => {
  //   try {
  //     const { OTP, email_verifiy_code } = req.body;
  //     const query = 'UPDATE users SET OTP = ? , email_verifiy_code = ?  WHERE id = ? ';
  //     connection.query(query, [OTP, email_verifiy_code, req.params.id], (error, result) => {
  //       if (!error && result.affectedRows > 0) {
  //         console.log(result);
  //         return res.send(result);
  //       } else {
  //         console.log(error || 'Product not found');
  //         return res.status(404).json({ message: 'Product not found.' });
  //       }
  //     });
  //   }
  //   catch (error) {
  //     console.log(error)
  //   }
  // },

  users_controller: async (req, res) => {
    try {
      const controllerName = 'users';
      const query = 'SELECT * FROM module_info WHERE controller_name = ?';

      connection.query(query, [controllerName], (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        res.json(results);
      });
    }
    catch (error) {
      console.log(error)
    }
  },


  send_users_number_otp: async (req, res) => {
    try {
      const { quick_api, mobile, msg } = req.body;

      // Validate that required parameters are present
      if (!quick_api || !mobile || !msg) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      const response = await axios.get(
        'https://quicksmsapp.com/Api/sms/campaign_api',
        {
          params: {
            quick_api,
            mobile,
            msg,
            // msg: `Your OTP is ${otp}`,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  emailOtpSend: async (req, res) => {
    try {
      const { quick_api, email, msg } = req.body;

      // Validate that required parameters are present
      if (!quick_api || !email || !msg) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      const response = await axios.get(
        'https://quicksmsapp.com/Api/sms/campaign_api',
        {
          params: {
            quick_api,
            email,
            msg,
            // msg: `Your OTP is ${otp}`,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const query = 'UPDATE users SET email = ?, password = ?  WHERE email = ? ';
      connection.query(query, [email, password, req.params.email], (error, result) => {
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


  users_role_permission_list: async (req, res) => {
    connection.query('SELECT * FROM user_role', (err, userRoleResult) => {
      if (err) {
        console.error('Error retrieving users: ' + err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      // Organize the results into an array of users with their permissions
      const users = [];

      userRoleResult.forEach((userRole) => {
        const userRoleId = userRole.id;
        const user = { ...userRole };
        user.user_role_permission = [];

        // Retrieve user role permission data
        connection.query('SELECT * FROM user_role_permission WHERE user_role_id = ?', [userRoleId], (err, permissionResult) => {
          if (err) {
            console.error('Error retrieving user role permission: ' + err);
            res.status(500).json({ message: 'Internal server error' });
            return;
          }

          user.user_role_permission = permissionResult;
          users.push(user);

          // Check if this is the last user role entry to respond to the client
          if (users.length === userRoleResult.length) {
            res.json({ users });
          }
        });
      });
    });
  },





  usersRoleBtn: async (req, res) => {
    try {
      const controllerName = 'user_role';
      const query = 'SELECT * FROM module_info WHERE controller_name = ?';

      connection.query(query, [controllerName], (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        res.json(results);
      });
    }
    catch (error) {
      console.log(error)
    }
  },

  page_group_display_name_list: async (req, res) => {
    const query = `
          SELECT ap.id AS page_group_id, ap.page_group, ap.controller_name, GROUP_CONCAT(DISTINCT ap.display_name) AS display_names,
          GROUP_CONCAT(DISTINCT ap.method_name) AS method_names
          FROM admin_page_list ap
          
          GROUP BY ap.page_group, ap.controller_name
          HAVING ap.page_group IS NOT NULL AND ap.page_group != '';
        `;

    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      // Process the data to group by page_group and create an object
      const groupedData = results.reduce((acc, row) => {
        const { page_group_id, page_group, controller_name, display_names, method_names } = row;
        if (!acc[page_group]) {
          acc[page_group] = {
            page_group_id,
            page_group,
            controllers: [],
          };
        }

        acc[page_group].controllers.push({
          controller_name,
          display_names: display_names.split(','),
          method_names: method_names.split(','),
        });

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

  users_role_access_create: async (req, res) => {
    const { role_name, status, user_page_list_id, user_default_page, OTP, pass_reset, otp_expire } = req.body;

    // Validate required fields
    if (!role_name || !user_page_list_id) {
      res.status(400).json({ message: 'role_name and user_page_list_id are required and should not be null' });
      return;
    }

    // Convert user_page_list_id to an array of integers and validate
    const pageListIds = user_page_list_id
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id)); // Filter out invalid values

    if (pageListIds.length === 0) {
      res.status(400).json({ message: 'user_page_list_id must contain valid numeric IDs' });
      return;
    }

    // Start a database transaction
    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error starting database transaction: ' + err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      // Insert data into the 'user_role' table
      connection.query(
        'INSERT INTO user_role (role_name, status, OTP, pass_reset, otp_expire) VALUES (?, ?, ?, ?, ?)',
        [role_name, status, OTP, pass_reset, otp_expire],
        (err, result) => {
          if (err) {
            connection.rollback(() => {
              console.error('Error inserting into user_role table: ' + err);
              res.status(500).json({ message: 'Internal server error' });
            });
            return;
          }

          const userRoleId = result.insertId;

          // Insert data into the 'user_role_permission' table
          connection.query(
            'INSERT INTO user_role_permission (user_page_list_id, user_default_page, user_role_id) VALUES (?, ?, ?)',
            [user_page_list_id, user_default_page, userRoleId],
            (err, permissionResult) => {
              if (err) {
                connection.rollback(() => {
                  console.error('Error inserting into user_role_permission table: ' + err);
                  res.status(500).json({ message: 'Internal server error' });
                });
                return;
              }

              // Update the 'module_info' table based on user_page_list_id
              const updateQuery = `
                UPDATE module_info
                SET user_role_access = CASE 
                  WHEN id IN (?) THEN 1
                  ELSE 0
                END
              `;

              connection.query(updateQuery, [pageListIds], (err, updateResult) => {
                if (err) {
                  connection.rollback(() => {
                    console.error('Error updating module_info table: ' + err);
                    res.status(500).json({ message: 'Internal server error' });
                  });
                  return;
                }

                // Commit the transaction when all queries are successful
                connection.commit((err) => {
                  if (err) {
                    console.error('Error committing the transaction: ' + err);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                  }

                  res.status(201).json({
                    user_role_id: userRoleId,
                    role_name,
                    status,
                    user_page_list_id,
                    user_default_page,
                    OTP,
                    pass_reset,
                    otp_expire,
                    updated_module_count: updateResult.affectedRows,
                  });
                });
              });
            }
          );
        }
      );
    });
  },

  users_role_access_update: async (req, res) => {
    const { role_name, status, user_page_list_id, user_default_page, OTP, pass_reset, otp_expire } = req.body;
    const user_role_id = req.params.id
    // Validate required fields
    if (!role_name || !user_page_list_id) {
      res.status(400).json({ message: 'role_name, user_page_list_id, and user_role_id are required and should not be null' });
      return;
    }

    // Convert user_page_list_id to an array of integers and validate
    const pageListIds = user_page_list_id
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id)); // Filter out invalid values

    if (pageListIds.length === 0) {
      res.status(400).json({ message: 'user_page_list_id must contain valid numeric IDs' });
      return;
    }

    // Start a database transaction
    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error starting database transaction: ' + err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      // Update data in the 'user_role' table
      connection.query(
        'UPDATE user_role SET role_name = ?, status = ?, OTP = ?, pass_reset = ?, otp_expire = ? WHERE id = ?',
        [role_name, status, OTP, pass_reset, otp_expire, user_role_id],
        (err, result) => {
          if (err) {
            connection.rollback(() => {
              console.error('Error updating user_role table: ' + err);
              res.status(500).json({ message: 'Internal server error' });
            });
            return;
          }

          // Update data in the 'user_role_permission' table
          connection.query(
            'UPDATE user_role_permission SET user_page_list_id = ?, user_default_page = ? WHERE user_role_id = ?',
            [user_page_list_id, user_default_page, user_role_id],
            (err, permissionResult) => {
              if (err) {
                connection.rollback(() => {
                  console.error('Error updating user_role_permission table: ' + err);
                  res.status(500).json({ message: 'Internal server error' });
                });
                return;
              }

              // Update the 'module_info' table based on user_page_list_id
              const updateQuery = `
                UPDATE module_info
                SET user_role_access = CASE 
                  WHEN id IN (?) THEN 1
                  ELSE 0
                END
              `;
              console.log(pageListIds, 'pageListIds')
              connection.query(updateQuery, [pageListIds], (err, updateResult) => {
                if (err) {
                  connection.rollback(() => {
                    console.error('Error updating module_info table: ' + err);
                    res.status(500).json({ message: 'Internal server error' });
                  });
                  return;
                }

                // Commit the transaction when all queries are successful
                connection.commit((err) => {
                  if (err) {
                    console.error('Error committing the transaction: ' + err);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                  }

                  res.status(200).json({
                    user_role_id,
                    role_name,
                    status,
                    user_page_list_id,
                    user_default_page,
                    OTP,
                    pass_reset,
                    otp_expire,
                    updated_module_count: updateResult.affectedRows,
                  });
                });
              });
            }
          );
        }
      );
    });
  },

  users_role_create: async (req, res) => {
    const { role_name, status, user_page_list_id, user_default_page, OTP, pass_reset, otp_expire } = req.body;

    // Check if role_name, status, user_page_list_id, and user_default_page are provided and not null
    if (!role_name || !user_page_list_id) {
      res.status(400).json({ message: 'role_name, user_page_list_id are required and should not be null' });
      return;
    }
    // if (!role_name || !status || !user_page_list_id || !user_default_page || !OTP) {
    //   res.status(400).json({ message: 'role_name, status, user_page_list_id, and user_default_page are required and should not be null' });
    //   return;
    // }

    // Start a database transaction
    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error starting database transaction: ' + err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      // Insert data into the 'user_role' table
      connection.query(
        'INSERT INTO user_role (role_name, status, OTP, pass_reset, otp_expire) VALUES (?, ?, ?, ?, ?)',
        [role_name, status, OTP, pass_reset, otp_expire],
        (err, result) => {
          if (err) {
            // Rollback the transaction on error
            connection.rollback(() => {
              console.error('Error inserting into user_role table: ' + err);
              res.status(500).json({ message: 'Internal server error' });
            });
            return;
          }
          const userRoleId = result.insertId;

          // Insert data into the 'user_role_permission' table
          connection.query(
            'INSERT INTO user_role_permission (user_page_list_id, user_default_page, user_role_id) VALUES (?, ?, ?)',
            [user_page_list_id, user_default_page, userRoleId],
            (err, permissionResult) => {
              if (err) {
                // Rollback the transaction on error
                connection.rollback(() => {
                  console.error('Error inserting into user_role_permission table: ' + err);
                  res.status(500).json({ message: 'Internal server error' });
                });
                return;
              }

              // Commit the transaction when both inserts are successful
              connection.commit((err) => {
                if (err) {
                  console.error('Error committing the transaction: ' + err);
                  res.status(500).json({ message: 'Internal server error' });
                  return;
                }

                res.status(201).json({
                  user_role_id: userRoleId,
                  role_name,
                  status,
                  user_page_list_id,
                  user_default_page,
                  OTP,
                  pass_reset,
                  otp_expire
                });
              });
            }
          );
        }
      );
    });
  },


  users_role_update: async (req, res) => {
    const { user_role_id, role_name, status, user_page_list_id, user_default_page, OTP, pass_reset, otp_expire } = req.body;

    // Check if required fields are provided
    if (!user_role_id || !role_name || !user_page_list_id) {
      return res.status(400).json({ message: 'user_role_id, role_name, status, user_page_list_id, and user_default_page are required and should not be null' });
    }

    try {
      // Start a database transaction
      await new Promise((resolve, reject) => {
        connection.beginTransaction(err => {
          if (err) reject(err);
          resolve();
        });
      });

      // Update data in the 'user_role' table
      await new Promise((resolve, reject) => {
        connection.query(
          'UPDATE user_role SET role_name = ?, status = ?, OTP = ?, pass_reset = ?, otp_expire = ? WHERE id = ?',
          [role_name, status, OTP, pass_reset, otp_expire, user_role_id],
          (err, result) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      // Update data in the 'user_role_permission' table
      await new Promise((resolve, reject) => {
        connection.query(
          'UPDATE user_role_permission SET user_page_list_id = ?, user_default_page = ? WHERE user_role_id = ?',
          [user_page_list_id, user_default_page, user_role_id],
          (err, permissionResult) => {
            if (err) reject(err);
            resolve();
          }
        );
      });




      // Commit the transaction
      await new Promise((resolve, reject) => {
        connection.commit(err => {
          if (err) reject(err);
          resolve();
        });
      });

      res.status(200).json({
        user_role_id,
        role_name,
        status,
        user_page_list_id,
        user_default_page,
        OTP,
        pass_reset,
        otp_expire
      });
    } catch (error) {
      // Rollback the transaction on error
      await new Promise((resolve, reject) => {
        connection.rollback(() => {
          reject(error);
        });
      });
      console.error('Error: ', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // users_role_update: async (req, res) => {

  //   const { user_role_id, role_name, status, user_page_list_id, user_default_page, OTP, pass_reset } = req.body;

  //   // Check if required fields are provided
  //   if (!user_role_id || !role_name || !user_page_list_id) {
  //     return res.status(400).json({ message: 'user_role_id, role_name, status, user_page_list_id, and user_default_page are required and should not be null' });
  //   }

  //   try {
  //     // Start a database transaction
  //     await new Promise((resolve, reject) => {
  //       connection.beginTransaction(err => {
  //         if (err) reject(err);
  //         resolve();
  //       });
  //     });

  //     // Update data in the 'user_role' table
  //     await new Promise((resolve, reject) => {
  //       connection.query(
  //         'UPDATE user_role SET role_name = ?, status = ?, OTP = ?, pass_reset = ? WHERE id = ?',
  //         [role_name, status, OTP, pass_reset, user_role_id],
  //         (err, result) => {
  //           if (err) reject(err);
  //           resolve();
  //         }
  //       );
  //     });

  //     // Update data in the 'user_role_permission' table
  //     await new Promise((resolve, reject) => {
  //       connection.query(
  //         'UPDATE user_role_permission SET user_page_list_id = ?, user_default_page = ? WHERE user_role_id = ?',
  //         [user_page_list_id, user_default_page, user_role_id],
  //         (err, permissionResult) => {
  //           if (err) reject(err);
  //           resolve();
  //         }
  //       );
  //     });

  //     // Commit the transaction
  //     await new Promise((resolve, reject) => {
  //       connection.commit(err => {
  //         if (err) reject(err);
  //         resolve();
  //       });
  //     });

  //     res.status(200).json({
  //       user_role_id,
  //       role_name,
  //       status,
  //       user_page_list_id,
  //       user_default_page,
  //       OTP,
  //       pass_reset
  //     });
  //   } catch (error) {
  //     // Rollback the transaction on error
  //     await new Promise((resolve, reject) => {
  //       connection.rollback(() => {
  //         reject(error);
  //       });
  //     });
  //     console.error('Error: ', error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // },


  // users_role_update: async (req, res) => {

  //   const { user_role_id, role_name, status, user_page_list_id, user_default_page, OTP, pass_reset } = req.body;

  //   // Check if user_role_id, role_name, status, user_page_list_id, and user_default_page are provided and not null
  //   if (!user_role_id || !role_name  || !user_page_list_id ) {
  //     res.status(400).json({ message: 'user_role_id, role_name, status, user_page_list_id, and user_default_page are required and should not be null' });
  //     return;
  //   }

  //   // Start a database transaction
  //   connection.beginTransaction((err) => {
  //     if (err) {
  //       console.error('Error starting database transaction: ' + err);
  //       res.status(500).json({ message: 'Internal server error' });
  //       return;
  //     }

  //     // Update data in the 'user_role' table
  //     connection.query(
  //       'UPDATE user_role SET role_name = ?, status = ?, OTP = ?, pass_reset = ? WHERE id = ?',
  //       [role_name, status, user_role_id, OTP, pass_reset],
  //       (err, result) => {
  //         if (err) {
  //           // Rollback the transaction on error
  //           connection.rollback(() => {
  //             console.error('Error updating user_role table: ' + err);
  //             res.status(500).json({ message: 'Internal server error' });
  //           });
  //           return;
  //         }

  //         // Update data in the 'user_role_permission' table
  //         connection.query(
  //           'UPDATE user_role_permission SET user_page_list_id = ?, user_default_page = ? WHERE user_role_id = ?',
  //           [user_page_list_id, user_default_page, user_role_id],
  //           (err, permissionResult) => {
  //             if (err) {
  //               // Rollback the transaction on error
  //               connection.rollback(() => {
  //                 console.error('Error updating user_role_permission table: ' + err);
  //                 res.status(500).json({ message: 'Internal server error' });
  //               });
  //               return;
  //             }

  //             // Commit the transaction when both updates are successful
  //             connection.commit((err) => {
  //               if (err) {
  //                 console.error('Error committing the transaction: ' + err);
  //                 res.status(500).json({ message: 'Internal server error' });
  //                 return;
  //               }

  //               res.status(200).json({
  //                 user_role_id,
  //                 role_name,
  //                 status,
  //                 user_page_list_id,
  //                 user_default_page,
  //                 OTP, pass_reset
  //               });
  //             });
  //           }
  //         );
  //       }
  //     );
  //   });
  // },








  users_role_single: async (req, res) => {
    const userRoleId = req.params.id;

    // Retrieve user role data and its related permissions
    connection.query('SELECT * FROM user_role WHERE id = ?', [userRoleId], (err, userRoleResult) => {
      if (err) {
        console.error('Error retrieving user role: ' + err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      if (userRoleResult.length === 0) {
        res.status(404).json({ message: 'User role not found' });
        return;
      }

      // Retrieve user role permission data
      connection.query('SELECT * FROM user_role_permission WHERE user_role_id = ?', [userRoleId], (err, permissionResult) => {
        if (err) {
          console.error('Error retrieving user role permission: ' + err);
          res.status(500).json({ message: 'Internal server error' });
          return;
        }

        // Combine user role and permission data
        const user_role = userRoleResult[0]; // Assuming there's only one user role with the given ID
        user_role.user_role_permission = permissionResult;

        res.json({ user_role });
      });
    });
  },

  users_role_delete: async (req, res) => {
    // try {
    //   const query = 'DELETE FROM user_role WHERE id = ?';
    //   connection.query(query, [req.params.id], (error, result) => {
    //     if (!error && result.affectedRows > 0) {
    //       console.log(result);
    //       return res.send(result);
    //     } else {
    //       console.log(error || 'User role not found');
    //       return res.status(404).json({ message: 'User role not found.' });
    //     }
    //   });
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ message: 'Internal server error' });
    // }

    // Transaction to delete user_role with related permissions
    const userRoleId = req.params.id;

    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction: ' + err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      connection.query('DELETE FROM user_role WHERE id = ?', [userRoleId], (err, result) => {
        if (err) {
          console.error('Error deleting user role: ' + err);
          connection.rollback(() => {
            res.status(500).json({ message: 'Internal server error' });
          });
          return;
        }
        connection.query('DELETE FROM user_role_permission WHERE user_role_id = ?', [userRoleId], (err, permissionResult) => {
          if (err) {
            console.error('Error deleting user role permissions: ' + err);
            connection.rollback(() => {
              res.status(500).json({ message: 'Internal server error' });
            });
            return;
          }

          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction: ' + err);
              connection.rollback(() => {
                res.status(500).json({ message: 'Internal server error' });
              });
              return;
            }
            if (!err && result.affectedRows > 0) {

              res.json({ message: 'User role and related permissions deleted successfully' });
            }
          });
        });
      });
    });

    // try {
    //   const query = 'DELETE FROM user_role WHERE id = ?';
    //   connection.query(query, [req.params.id], (error, result) => {
    //     if (!error && result.affectedRows > 0) {
    //       console.log(result);
    //       return res.send(result);
    //     } else {
    //       console.log(error || 'Product not found');
    //       return res.status(404).json({ message: 'Product not found.' });
    //     }
    //   });
    // }
    // catch (error) {
    //   console.log(error)
    // }
    // const userRoleId = req.params.id;

    // connection.beginTransaction((err) => {
    //   if (err) {
    //     console.error('Error starting transaction: ' + err);
    //     res.status(500).json({ message: 'Internal server error' });
    //     return;
    //   }


    //     connection.query('DELETE FROM user_role WHERE id = ?', [userRoleId], (err, result) => {
    //       if (err) {
    //         console.error('Error deleting user role: ' + err);
    //         connection.rollback(() => {
    //           res.status(500).json({ message: 'Internal server error' });
    //         });
    //         return;
    //       }
    //       connection.query('DELETE FROM user_role_permission WHERE user_role_id = ?', [userRoleId], (err, permissionResult) => {
    //         if (err) {
    //           console.error('Error deleting user role permissions: ' + err);
    //           connection.rollback(() => {
    //             res.status(500).json({ message: 'Internal server error' });
    //           });
    //           return;
    //         }

    //       connection.commit((err) => {
    //         if (err) {
    //           console.error('Error committing transaction: ' + err);
    //           connection.rollback(() => {
    //             res.status(500).json({ message: 'Internal server error' });
    //           });
    //           return;
    //         }

    //         res.json({ message: 'User role and related permissions deleted successfully' });
    //       });
    //     });
    //   });
    // });
  }




}

module.exports = usersListModel
