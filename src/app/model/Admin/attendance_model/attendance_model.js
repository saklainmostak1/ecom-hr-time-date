const { default: axios } = require('axios');
const connection = require('../../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');
var fs = require("fs");
var mysql = require('mysql');

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

// wkhtmltopdf.command = "C:\\Users\\user\\Desktop\\Ecommerce\\node_modules\\wkhtmltopdf\\index.js";
const formatString = (str) => {
    const words = str?.split('_');

    const formattedWords = words?.map((word) => {
        const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        return capitalizedWord;
    });

    return formattedWords?.join(' ');
};




const AttendanceModel = {


    // send_attendance_otp: async (req, res) => {
    //     try {
    //         const { quick_api, mobile, msg } = req.body;

    //         // Validate that required parameters are present
    //         if (!quick_api || !mobile || !msg) {
    //             return res.status(400).json({ error: 'Missing required parameters' });
    //         }

    //         console.log('Sending SMS with Params:', { quick_api, mobile, msg });

    //         const response = await axios.get(
    //             'https://quicksmsapp.com/Api/sms/campaign_api',
    //             {
    //                 params: {
    //                     quick_api,
    //                     mobile,
    //                     msg,
    //                 },
    //             }
    //         );

    //         console.log('SMS API Response:', response.data);
    //         res.json(response.data);
    //     } catch (error) {
    //         if (error.response) {
    //             console.error('Error Response:', error.response.data);
    //             res.status(error.response.status).json({ error: error.response.data });
    //         } else {
    //             console.error('Request Error:', error.message);
    //             res.status(500).json({ error: 'Internal Server Error' });
    //         }
    //     }
    // },


    send_attendance_otp: async (req, res) => {
        try {
            const { formattedUrl, mobile, msg } = req.body;

            // Validate that required parameters are present
            if (!formattedUrl || !mobile || !msg) {
                return res.status(400).json({ error: 'Missing required parameters' });
            }

            console.log('Sending SMS with Params:', { mobile, msg });

            const response = await axios.get(
                `${formattedUrl}`,
                {
                    params: {
                        
                        mobile,
                        msg,
                    },
                }
            );

            console.log('SMS API Response:', response.data);
            res.json(response.data);
        } catch (error) {
            if (error.response) {
                console.error('Error Response:', error.response.data);
                res.status(error.response.status).json({ error: error.response.data });
            } else {
                console.error('Request Error:', error.message);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    },


    // send_attendance_otp: async (req, res) => {
    //     try {
    //       const { quick_api, mobile, msg } = req.body;

    //       // Validate that required parameters are present
    //       if (!quick_api || !mobile || !msg) {
    //         return res.status(400).json({ error: 'Missing required parameters' });
    //       }

    //       const response = await axios.get(
    //         'https://quicksmsapp.com/Api/sms/campaign_api',
    //         {
    //           params: {
    //             quick_api,
    //             mobile,
    //             msg,
    //             // msg: `Your OTP is ${otp}`,
    //           },
    //         }
    //       );
    //       res.json(response.data);
    //     } catch (error) {
    //       console.error('Error:', error.message);
    //       res.status(500).json({ error: 'Internal Server Error' });
    //     }
    //   },


    // original attendance and absent

    // attendance_create: async (req, res) => {
    //     try {
    //         const models = req.body;


    //         const results = [];

    //         console.log(models)

    //         for (const model of models) {
    //             const { user_id, checktime, created_by, attendance_date, device_id, unique_id } = model;

    //             // Check if all required fields are present
    //             const insertQuery = 'INSERT INTO attendance (user_id, checktime, created_by, attendance_date, device_id, unique_id) VALUES (?, ?, ?, ?, ?, ?)';
    //             const insertedModel = await new Promise((resolve, reject) => {
    //                 connection.query(insertQuery, [user_id, checktime, created_by, attendance_date, device_id, unique_id], (error, result) => {
    //                     if (error) {
    //                         console.log(error);
    //                         reject(error);
    //                     } else {
    //                         resolve(result);
    //                     }
    //                 });
    //             });

    //             console.log(insertedModel);
    //             results.push(insertedModel);
    //         }

    //         res.json(results);
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // },


    // absent_create: async (req, res) => {
    //     try {
    //         const models = req.body;


    //         const results = [];

    //         console.log(models)

    //         for (const model of models) {
    //             const { user_id, checktime, created_by, attendance_date, device_id, unique_id } = model;

    //             // Check if all required fields are present
    //             const insertQuery = 'INSERT INTO absent (user_id, checktime, created_by, absent_date, device_id, unique_id) VALUES (?, ?, ?, ?, ?, ?)';
    //             const insertedModel = await new Promise((resolve, reject) => {
    //                 connection.query(insertQuery, [user_id, checktime, created_by, attendance_date, device_id, unique_id], (error, result) => {
    //                     if (error) {
    //                         console.log(error);
    //                         reject(error);
    //                     } else {
    //                         resolve(result);
    //                     }
    //                 });
    //             });

    //             console.log(insertedModel);
    //             results.push(insertedModel);
    //         }

    //         res.json(results);
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // },

    // original attendance and absent


    // attendance_search: async (req, res) => {
    //     try {
    //         console.log("Search button clicked.");

    //         // Extract necessary data from request
    //         const { employee, itemName, searchQuery } = req.body;

    //         // Construct the base SQL query
    //         let sql = `
    //          SELECT 
    //             ei.*,
    //             eq.education,
    //             eq.institute,
    //             eq.result,
    //             eq.passing_year,
    //             la.division_id AS living_division_id,
    //             la.district_id AS living_district_id,
    //             la.upazila_id AS living_upazila_id,
    //             la.address AS living_address,
    //             pa.division_id AS permanent_division_id,
    //             pa.district_id AS permanent_district_id,
    //             pa.upazila_id AS permanent_upazila_id,
    //             pa.address AS permanent_address,
    //             ej.join_date AS join_date,
    //             ej.payroll_id AS payroll_id,
    //             ej.school_shift_id AS school_shift_id,
    //             ep.designation_id AS designation_id,
    //             ep.branch_id AS branch_id,
    //             d.designation_name,
    //             u.full_name,
    //             u.father_name,
    //             u.mother_name,
    //             u.dob,
    //             u.gender,
    //             u.religion,
    //             u.mobile,
    //             u.email,
    //             u.password,
    //             u.signature_image,
    //             u.photo,
    //             up.father_name AS e_father_name,
    //             up.mother_name AS e_mother_name,
    //             up.father_service AS father_service,
    //             up.mother_service AS mother_service,
    //             pc.father_phone AS father_phone,
    //             pc.mother_phone AS mother_phone
    //         FROM 
    //             employe_info ei
    //         LEFT JOIN 
    //             educational_qualification eq ON ei.user_id = eq.user_id
    //         LEFT JOIN 
    //             living_address la ON ei.user_id = la.user_id
    //         LEFT JOIN 
    //             parmanent_address pa ON ei.user_id = pa.user_id
    //         LEFT JOIN 
    //             employe_joining ej ON ei.user_id = ej.user_id
    //         LEFT JOIN 
    //             employee_promotion ep ON ei.user_id = ep.user_id
    //         LEFT JOIN 
    //             users u ON ei.user_id = u.id
    //         LEFT JOIN 
    //             designation d ON ep.designation_id = d.id
    //         LEFT JOIN 
    //             user_parent up ON ej.user_id = up.user_id
    //         LEFT JOIN 
    //             parent_contact pc ON ej.user_id = pc.user_id
    //         WHERE
    //             ei.user_id IN (SELECT DISTINCT user_id FROM employe_joining)
    //             WHERE 1
    //         `
    //             ;

    //         if (searchQuery) {
    //             sql += ` AND expense.expense_category = ${searchQuery}`;
    //         }

    //         if (supplierId) {
    //             sql += ` AND expense.supplier_id LIKE '%${supplierId}%'`;
    //         }

    //         if (itemName) {

    //             sql += ` AND LOWER(expense_item.item_name) LIKE '%${itemName}%'`;
    //         }

    //         // Add expense name (item_name) search condition



    //         console.log("SQL Query:", sql);

    //         // Execute the constructed SQL query
    //         connection.query(sql, (error, results, fields) => {
    //             if (error) {
    //                 console.error("Error occurred during search:", error);
    //                 res.status(500).json({ error: "An error occurred during search." });
    //             } else {
    //                 console.log("Search results:", results);
    //                 res.status(200).json({ results });
    //             }
    //         });
    //     } catch (error) {
    //         console.error("An error occurred:", error);
    //         res.status(500).json({ error: "An error occurred." });
    //     }
    // },




    attendance_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { employee, itemName, searchQuery } = req.body;

            // Construct the base SQL query
            let sql = `
                SELECT 
                    ei.*,
                    eq.education,
                    eq.institute,
                    eq.result,
                    eq.passing_year,
                    la.division_id AS living_division_id,
                    la.district_id AS living_district_id,
                    la.upazila_id AS living_upazila_id,
                    la.address AS living_address,
                    pa.division_id AS permanent_division_id,
                    pa.district_id AS permanent_district_id,
                    pa.upazila_id AS permanent_upazila_id,
                    pa.address AS permanent_address,
                    ej.join_date AS join_date,
                    ej.payroll_id AS payroll_id,
                    ej.school_shift_id AS school_shift_id,
                    ep.designation_id AS designation_id,
                    ep.branch_id AS branch_id,
                    d.designation_name,
                    u.full_name,
                    u.father_name,
                    u.mother_name,
                    u.dob,
                    u.gender,
                    u.religion,
                    u.mobile,
                    u.email,
                    u.password,
                    u.unique_id,
                    u.signature_image,
                    u.photo,
                    up.father_name AS e_father_name,
                    up.mother_name AS e_mother_name,
                    up.father_service AS father_service,
                    up.mother_service AS mother_service,
                    pc.father_phone AS father_phone,
                    pc.mother_phone AS mother_phone
                FROM 
                    employe_info ei
                LEFT JOIN 
                    educational_qualification eq ON ei.user_id = eq.user_id
                LEFT JOIN 
                    living_address la ON ei.user_id = la.user_id
                LEFT JOIN 
                    parmanent_address pa ON ei.user_id = pa.user_id
                LEFT JOIN 
                    employe_joining ej ON ei.user_id = ej.user_id
                LEFT JOIN 
                    employee_promotion ep ON ei.user_id = ep.user_id
                LEFT JOIN 
                    users u ON ei.user_id = u.id
                LEFT JOIN 
                    designation d ON ep.designation_id = d.id
                LEFT JOIN 
                    user_parent up ON ej.user_id = up.user_id
                LEFT JOIN 
                    parent_contact pc ON ej.user_id = pc.user_id
                WHERE
                    1=1
            `;

            // Add search conditions based on the provided parameters
            if (employee) {
                sql += ` AND ei.user_id LIKE '%${employee}%'`;
            }

            if (searchQuery) {
                sql += ` AND ep.designation_id LIKE '%${searchQuery}%'`;
            }

            if (itemName) {
                sql += ` AND ep.branch_id LIKE '%${itemName}%'`;
            }




            console.log("SQL Query:", sql);

            // Execute the constructed SQL query
            connection.query(sql, async (err, results) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Failed to fetch employee data' });
                    return;
                }

                // Process results to aggregate educational qualifications
                const employees = {};
                results.forEach(row => {
                    const userId = row.user_id;
                    if (!employees[userId]) {
                        employees[userId] = {
                            ...row,
                            educational_qualifications: []
                        };
                    }
                    if (row.education) {
                        employees[userId].educational_qualifications.push({
                            education: row.education,
                            institute: row.institute,
                            result: row.result,
                            passing_year: row.passing_year
                        });
                    }
                });

                const processedResults = Object.values(employees);
                res.status(200).json(processedResults);
            });
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).json({ error: "An error occurred." });
        }
    },

    // attendance_list: async (req, res) => {
    //     try {

    //         const query = `
    //             SELECT 
    //                 attendance.*, 
    //                 users.full_name, 
    //                 users.unique_id, 
    //                 users.photo, 
    //                 employee_promotion.designation_id,
    //                 employee_promotion.branch_id,
    //                 designation.designation_name
    //             FROM 
    //                 attendance
    //             JOIN 
    //                 users ON attendance.user_id = users.id
    //             LEFT JOIN 
    //                 employee_promotion ON attendance.user_id = employee_promotion.user_id
    //             LEFT JOIN 
    //                 designation ON employee_promotion.designation_id = designation.id

    //         `;

    //         connection.query(query, function (error, result) {
    //             if (!error) {
    //                 res.send(result);
    //             } else {
    //                 console.log(error);
    //                 res.status(500).send('Database query error');
    //             }
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).send('Internal server error');
    //     }
    // },

    attendance_list: async (req, res) => {
        try {
            const query = `
                SELECT 
                attendance.*,
                    attendance.user_id,
                    users.full_name, 
                    users.unique_id, 
                    users.photo, 
                    employee_promotion.designation_id,
                    employee_promotion.branch_id,
                    designation.designation_name,
                    DATE(attendance.checktime) AS check_date,
                    MIN(attendance.checktime) AS entry_checktime,
                    MAX(attendance.checktime) AS exit_checktime
                FROM 
                    attendance
                JOIN 
                    users ON attendance.user_id = users.id
                LEFT JOIN 
                    employee_promotion ON attendance.user_id = employee_promotion.user_id
                LEFT JOIN 
                    designation ON employee_promotion.designation_id = designation.id
                GROUP BY 
                    attendance.user_id, check_date
            `;

            connection.query(query, function (error, result) {
                if (!error) {
                    res.send(result);
                } else {
                    console.log(error);
                    res.status(500).send('Database query error');
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    },


    attendance_list_all_data: async (req, res) => {
        try {
            const query = `
             SELECT 
                a.id,
                a.user_id,
                a.attendance_date,
                a.device_id,
                a.unique_id,
                a.created_date,
                MIN(a.checktime) as first_checkin,
                MAX(b.checktime) as last_checkout
            FROM 
                attendance a
            JOIN 
                attendance b 
            ON 
                a.user_id = b.user_id AND DATE(a.checktime) = DATE(b.checktime)
            WHERE 
                a.checktime = (
                    SELECT MIN(checktime)
                    FROM attendance
                    WHERE user_id = a.user_id AND DATE(checktime) = DATE(a.checktime)
                )
            AND 
                b.checktime = (
                    SELECT MAX(checktime)
                    FROM attendance
                    WHERE user_id = b.user_id AND DATE(checktime) = DATE(b.checktime)
                )
            GROUP BY 
                a.user_id, DATE(a.checktime)`;

            connection.query(query, function (error, result) {
                if (!error) {
                    res.send(result);
                } else {
                    console.log(error);
                    res.status(500).send('Database query error');
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    },


    absent_list: async (req, res) => {
        try {



            // Main query to join the subquery with other tables
            const query = `
                SELECT * from absent`;

            connection.query(query, function (error, result) {
                if (!error) {
                    res.send(result);
                } else {
                    console.error('Database query error:', error);
                    res.status(500).send('Database query error');
                }
            });
        } catch (error) {
            console.error('Internal server error:', error);
            res.status(500).send('Internal server error');
        }
    },


    // attendance_list: async (req, res) => {
    //     try {
    //         // Subquery to get the min and max checktime for each user_id
    //         const subquery = `
    //             SELECT 
    //                 user_id,
    //                 MIN(checktime) AS min_checktime,
    //                 MAX(checktime) AS max_checktime
    //             FROM 
    //                 attendance
    //             GROUP BY 
    //                 user_id
    //         `;

    //         // Main query to join the subquery with other tables and select one record per user_id
    //         const query = `
    //             SELECT 
    //                 fa.user_id,
    //                 fa.min_checktime,
    //                 fa.max_checktime,
    //                 MIN(att.id) AS attendance_id,
    //                 att.created_by,
    //                 att.created_date,
    //                 att.modified_by,
    //                 att.modified_date,
    //                 att.attendance_date,
    //                 att.device_id,
    //                 att.checktime,
    //                 users.unique_id,
    //                 users.full_name,
    //                 users.photo,
    //                 employee_promotion.designation_id,
    //                 employee_promotion.branch_id,
    //                 designation.designation_name
    //             FROM 
    //                 (${subquery}) AS fa
    //             JOIN 
    //                 attendance AS att ON fa.user_id = att.user_id AND (att.checktime = fa.min_checktime OR att.checktime = fa.max_checktime)
    //             JOIN 
    //                 users ON fa.user_id = users.id
    //             LEFT JOIN 
    //                 employee_promotion ON fa.user_id = employee_promotion.user_id
    //             LEFT JOIN 
    //                 designation ON employee_promotion.designation_id = designation.id
    //             GROUP BY 
    //                 fa.user_id, fa.min_checktime, fa.max_checktime, users.unique_id, users.full_name, users.photo, employee_promotion.designation_id, employee_promotion.branch_id, designation.designation_name
    //         `;

    //         connection.query(query, function (error, result) {
    //             if (!error) {
    //                 res.send(result);
    //             } else {
    //                 console.error('Database query error:', error);
    //                 res.status(500).send('Database query error');
    //             }
    //         });
    //     } catch (error) {
    //         console.error('Internal server error:', error);
    //         res.status(500).send('Internal server error');
    //     }
    // },




    // attendance_list_search: async (req, res) => {
    //     try {
    //         console.log("Search button clicked.");

    //         // Extract necessary data from request
    //         const {  searchQuery, itemName, employee, month, fromDate, toDate } = req.body;

    //         // Construct the base SQL query
    //         let sql = `
    //         SELECT 
    //             attendance.*,
    //                 attendance.user_id,
    //                 users.full_name, 
    //                 users.unique_id, 
    //                 users.photo, 
    //                 employee_promotion.designation_id,
    //                 employee_promotion.branch_id,
    //                 designation.designation_name,
    //                 DATE(attendance.checktime) AS check_date,
    //                 MIN(attendance.checktime) AS entry_checktime,
    //                 MAX(attendance.checktime) AS exit_checktime
    //             FROM 
    //                 attendance
    //             JOIN 
    //                 users ON attendance.user_id = users.id
    //             LEFT JOIN 
    //                 employee_promotion ON attendance.user_id = employee_promotion.user_id
    //             LEFT JOIN 
    //                 designation ON employee_promotion.designation_id = designation.id
    //             GROUP BY 
    //                 attendance.user_id, check_date 
    //         WHERE 1=1`;

    //         const queryParams = [];

    //         if (searchQuery) {
    //             sql += ` AND employee_promotion.designation_id = ?`;
    //             queryParams.push(searchQuery);
    //         }
    //         if (employee) {
    //             sql += ` AND attendance.user_id = ?`;
    //             queryParams.push(employee);
    //         }
    //         if (itemName) {
    //             sql += ` AND employee_promotion.branch_id = ?`;
    //             queryParams.push(itemName);
    //         }
    //         if (month) {
    //             sql += ` AND DATE_FORMAT(attendance.attendance_date, '%Y-%m') = ?`;
    //             queryParams.push(month);
    //         }
    //         if (fromDate && toDate) {
    //             sql += ` AND attendance.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
    //         }

    //         console.log("Constructed SQL Query:", sql);
    //         console.log("Query Parameters:", queryParams);

    //         // Execute the constructed SQL query
    //         connection.query(sql, queryParams, (error, results, fields) => {
    //             if (error) {
    //                 console.error("Error occurred during search:", error);
    //                 res.status(500).json({ error: "An error occurred during search." });
    //             } else {
    //                 console.log("Search results:", results);
    //                 res.status(200).json({ results });
    //             }
    //         });
    //     } catch (error) {
    //         console.error("An error occurred:", error);
    //         res.status(500).json({ error: "An error occurred." });
    //     }
    // },

    attendance_list_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { searchQuery, itemName, employee, month, fromDate, toDate } = req.body;

            // Construct the base SQL query
            let sql = `
            SELECT 
                attendance.*,
                users.full_name, 
                users.unique_id, 
                users.photo, 
                employee_promotion.designation_id,
                employee_promotion.branch_id,
                designation.designation_name,
                DATE(attendance.checktime) AS check_date,
                MIN(attendance.checktime) AS entry_checktime,
                MAX(attendance.checktime) AS exit_checktime
            FROM 
                attendance
            JOIN 
                users ON attendance.user_id = users.id
            LEFT JOIN 
                employee_promotion ON attendance.user_id = employee_promotion.user_id
            LEFT JOIN 
                designation ON employee_promotion.designation_id = designation.id

            WHERE 1=1`;



            const queryParams = [];

            if (searchQuery) {
                sql += ` AND employee_promotion.designation_id = ?`;
                queryParams.push(searchQuery);
            }
            if (employee) {
                sql += ` AND attendance.user_id = ?`;
                queryParams.push(employee);
            }
            if (itemName) {
                sql += ` AND employee_promotion.branch_id = ?`;
                queryParams.push(itemName);
            }
            if (month) {
                sql += ` AND DATE_FORMAT(attendance.created_date, '%Y-%m') = ?`;
                queryParams.push(month);
            }
            if (fromDate && toDate) {
                sql += ` AND attendance.created_date BETWEEN ? AND ?`;
                queryParams.push(fromDate, toDate);
            }

            sql += ` GROUP BY attendance.user_id, check_date`;

            console.log("Constructed SQL Query:", sql);
            console.log("Query Parameters:", queryParams);

            // Execute the constructed SQL query
            connection.query(sql, queryParams, (error, results, fields) => {
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





    attendance_list_pdf: async (req, res) => {
        try {
            const { searchResults, monthName, orientation, selectedPrintSize, fontSize } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                console.log(`http://localhost/:5003/${result.photo}`)
                let row = '<tr>';

                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.unique_id}</td>`; // Person Name
                row += ` <td>${result.full_name}</td>`; // Person Name
                row += `<td></td>`; // Person Name
                //  row += `<td><img src="http://localhost/:5003/${ result.photo ? result.photo : ''}" style="max-width: 100px;" alt="Image"/></td>`; // Person Name
                row += `  <td>${result.designation_name}</td>`; // Person Name
                row += ` <td>${monthName}</td>`; // Person Name
                row += ` <td></td>`; // Person Name
                row += `<td></td>`; // Person Name
                row += ` <td>${result.entry_checktime}</td>`; // Person Name
                row += `<td>${result.exit_checktime}</td>`; // Person Name


                row += '</tr>';
                tableRows += row;
            });
            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';
            const html = `<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    * { 
                        sheet-size: A4;
                        font-family: 'Nikosh', sans-serif !important;
                       
                        font-size: ${fontSize || '12px'}; /* Apply dynamic font size */
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                        border: 1px solid #ddd;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    img {
                        max-width: 100px;
                        max-height: 100px;
                    }
                    .container {
                        text-align: center;
                    }
                    .container2 {
                        display: flex;
                        justify-content: space-between;
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Attendance List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Attendance List</h3>
                </div>
                <div class="container2">
                    <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                    <p style="margin: 0; padding: 0;">Collected By:</p>
                    <p style="margin: 0; padding: 0;">Date: </p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>SL No.</th>
                             <th>Employee ID</th>
                                                            <th>Name</th>
                                                            <th>Photo</th>
                                                            <th>Designation</th>
                                                            <th>Month</th>
                                                            <th>Date</th>
                                                            <th>Day</th>
                                                            <th>Entry Time</th>
                                                            <th>Exit Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>`;

            wkhtmltopdf(html, { pageSize: pageSize, orientation: pageOrientation }, (err, stream) => {
                if (err) {
                    console.error('Error generating PDF:', err);
                    console.error('Error details:', err.stderr); // Log additional details from stderr
                    res.status(500).send('Error generating PDF');
                    return;
                }
                stream.pipe(res);
            });
        } catch (error) {
            console.error('Error in attendance_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },


    attendance_list_print: async (req, res) => {
        try {
            const { searchResults, monthName, orientation, selectedPrintSize, fontSize } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.unique_id}</td>`; // Person Name
                row += ` <td>${result.full_name}</td>`; // Person Name
                row += `<td><img src="http://localhost/:5003/${result.photo}" style="max-width: 100px;" alt="Image"/></td>`; // Person Name
                row += `  <td>${result.designation_name}</td>`; // Person Name
                row += ` <td>${monthName}</td>`; // Person Name
                row += ` <td></td>`; // Person Name
                row += `<td></td>`; // Person Name
                row += ` <td>${result.entry_checktime}</td>`; // Person Name
                row += `<td>${result.exit_checktime}</td>`; // Person Name



                row += '</tr>';
                tableRows += row;
            });

            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';

            const html = `<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
               @page {
                        size: ${pageSize} ${pageOrientation}; /* This sets the page size to A4 and orientation to Portrait */
                        margin: 20mm; /* Adjust the margin as needed */
                    }
                    * { 
                        font-family: 'Nikosh', sans-serif !important;
                        font-size: ${fontSize || '12px'}; /* Apply dynamic font size */
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                        border: 1px solid #ddd;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    img {
                        max-width: 100px;
                        max-height: 100px;
                    }
                    .container {
                        text-align: center;
                    }
                    .container2 {
                        display: flex;
                        justify-content: space-between;
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Attendance List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Attendance List</h3>
                </div>
                <div class="container2">
                    <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                    <p style="margin: 0; padding: 0;">Collected By:</p>
                    <p style="margin: 0; padding: 0;">Date: </p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>SL No.</th>
                             <th>Employee ID</th>
                                                            <th>Name</th>
                                                            <th>Photo</th>
                                                            <th>Designation</th>
                                                            <th>Month</th>
                                                            <th>Date</th>
                                                            <th>Day</th>
                                                            <th>Entry Time</th>
                                                            <th>Exit Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            <script>
                window.print();
            </script>
            </html>`;

            res.send(html); // Send the HTML directly to the client
        } catch (error) {
            console.error('Error in office_visit_person_print:', error);
            res.status(500).send('Error generating print view');
        }
    },



    attendance_log_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { itemName, searchQuery, employee, deviceName, fromDate } = req.body;

            // Construct the base SQL query
            let sql = `
            SELECT 
                     attendance.*, 
                     users.full_name, 
                     users.unique_id, 
                     users.photo, 
                     employee_promotion.designation_id,
                     employee_promotion.branch_id,
                     designation.designation_name
                 FROM 
                     attendance
                LEFT JOIN 
                     users ON attendance.user_id = users.id
                 LEFT JOIN 
                     employee_promotion ON attendance.user_id = employee_promotion.user_id
                 LEFT JOIN 
                     designation ON employee_promotion.designation_id = designation.id
            WHERE 1=1`;

            const queryParams = [];

            if (searchQuery) {
                sql += ` AND employee_promotion.designation_id = ?`;
                queryParams.push(searchQuery);
            }
            if (employee) {
                sql += ` AND attendance.user_id = ?`;
                queryParams.push(employee);
            }
            if (itemName) {
                sql += ` AND employee_promotion.branch_id = ?`;
                queryParams.push(itemName);
            }


            if (deviceName) {
                sql += ` AND LOWER(attendance.device_id) LIKE ?`;
                queryParams.push(`%${deviceName.toLowerCase()}%`);
            }

            if (fromDate && fromDate) {
                sql += ` AND attendance.attendance_date BETWEEN ? AND ?`;
                queryParams.push(fromDate, fromDate);
            }

            // sql += ` GROUP BY attendance.user_id`;

            console.log("Constructed SQL Query:", sql);
            console.log("Query Parameters:", queryParams);

            // Execute the constructed SQL query
            connection.query(sql, queryParams, (error, results, fields) => {
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

    attendance_log_print: async (req, res) => {
        try {
            const { searchResults, orientation, selectedPrintSize, fontSize } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.unique_id}</td>`; // Person Name
                row += ` <td>${result.full_name}</td>`; // Person Name
                row += `<td><img src="http://localhost/:5003/${result.photo}" style="max-width: 100px;" alt="Image"/></td>`; // Person Name
                row += `  <td>${result.designation_name}</td>`; // Person Name

                row += ` <td>${result.attendance_date}</td>`; // Person Name

                row += ` <td>${result.checktime}</td>`; // Person Name




                row += '</tr>';
                tableRows += row;
            });

            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';

            const html = `<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                @page {
                        size: ${pageSize} ${pageOrientation}; /* This sets the page size to A4 and orientation to Portrait */
                        margin: 20mm; /* Adjust the margin as needed */
                    }
                    * { 
                        font-family: 'Nikosh', sans-serif !important;
                        font-size: ${fontSize || '12px'}; /* Apply dynamic font size */
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                        border: 1px solid #ddd;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    img {
                        max-width: 100px;
                        max-height: 100px;
                    }
                    .container {
                        text-align: center;
                    }
                    .container2 {
                        display: flex;
                        justify-content: space-between;
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Attendance List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Attendance List</h3>
                </div>
                <div class="container2">
                    <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                    <p style="margin: 0; padding: 0;">Collected By:</p>
                    <p style="margin: 0; padding: 0;">Date: </p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>SL No.</th>
                             <th>Employee ID</th>
                                                            <th>Name</th>
                                                            <th>Photo</th>
                                                            <th>Designation</th>
                                                           
                                                            <th>Date</th>
                                                            
                                                            <th>Time</th>
                                                           
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            <script>
                window.print();
            </script>
            </html>`;

            res.send(html); // Send the HTML directly to the client
        } catch (error) {
            console.error('Error in office_visit_person_print:', error);
            res.status(500).send('Error generating print view');
        }
    },

    attendance_log_pdf: async (req, res) => {
        try {
            const { searchResults, orientation, selectedPrintSize, fontSize } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                console.log(`http://localhost/:5003/${result.photo}`)
                let row = '<tr>';

                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.unique_id}</td>`; // Person Name
                row += ` <td>${result.full_name}</td>`; // Person Name
                row += `<td></td>`; // Person Name
                //  row += `<td><img src="http://localhost/:5003/${ result.photo ? result.photo : ''}" style="max-width: 100px;" alt="Image"/></td>`; // Person Name
                row += `  <td>${result.designation_name}</td>`; // Person Name
                row += ` <td>${result.attendance_date}</td>`; // Person Name

                row += ` <td>${result.checktime}</td>`; // Person Name



                row += '</tr>';
                tableRows += row;
            });

            const html = `<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    * { 
                font-family: 'Nikosh', sans-serif !important;
                font-size: ${fontSize || '12px'}; /* Apply dynamic font size */
            }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                        border: 1px solid #ddd;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    img {
                        max-width: 100px;
                        max-height: 100px;
                    }
                    .container {
                        text-align: center;
                    }
                    .container2 {
                        display: flex;
                        justify-content: space-between;
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Attendance List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Attendance List</h3>
                </div>
                <div class="container2">
                    <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                    <p style="margin: 0; padding: 0;">Collected By:</p>
                    <p style="margin: 0; padding: 0;">Date: </p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>SL No.</th>
                             <th>Employee ID</th>
                                                            <th>Name</th>
                                                            <th>Photo</th>
                                                            <th>Designation</th>
                                                            
                                                            <th>Date</th>
                                                          
                                                            <th> Time</th>
                                                           
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>`;
            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';

            wkhtmltopdf(html, { pageSize: pageSize, orientation: pageOrientation }, (err, stream) => {
                if (err) {
                    console.error('Error generating PDF:', err);
                    console.error('Error details:', err.stderr); // Log additional details from stderr
                    res.status(500).send('Error generating PDF');
                    return;
                }
                stream.pipe(res);
            });
        } catch (error) {
            console.error('Error in attendance_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },


    attendance_summary_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { itemName } = req.body;

            // Construct the base SQL query
            let sql = `
            SELECT 
                ei.*,
                eq.education,
                eq.institute,
                eq.result,
                eq.passing_year,
                la.division_id AS living_division_id,
                la.district_id AS living_district_id,
                la.upazila_id AS living_upazila_id,
                la.address AS living_address,
                pa.division_id AS permanent_division_id,
                pa.district_id AS permanent_district_id,
                pa.upazila_id AS permanent_upazila_id,
                pa.address AS permanent_address,
                ej.join_date AS join_date,
                ej.payroll_id AS payroll_id,
                ej.school_shift_id AS school_shift_id,
                ep.designation_id AS designation_id,
                ep.branch_id AS branch_id,
                d.designation_name,
                u.full_name,
                u.father_name,
                u.mother_name,
                u.dob,
                u.gender,
                u.religion,
                u.mobile,
                u.unique_id,
                u.email,
                u.password,
                u.signature_image,
                u.photo,
                up.father_name AS e_father_name,
                up.mother_name AS e_mother_name,
                up.father_service AS father_service,
                up.mother_service AS mother_service,
                pc.father_phone AS father_phone,
                pc.mother_phone AS mother_phone
            FROM 
                employe_info ei
            LEFT JOIN 
                educational_qualification eq ON ei.user_id = eq.user_id
            LEFT JOIN 
                living_address la ON ei.user_id = la.user_id
            LEFT JOIN 
                parmanent_address pa ON ei.user_id = pa.user_id
            LEFT JOIN 
                employe_joining ej ON ei.user_id = ej.user_id
            LEFT JOIN 
                employee_promotion ep ON ei.user_id = ep.user_id
            LEFT JOIN 
                users u ON ei.user_id = u.id
            LEFT JOIN 
                designation d ON ep.designation_id = d.id
            LEFT JOIN 
                user_parent up ON ej.user_id = up.user_id
            LEFT JOIN 
                parent_contact pc ON ej.user_id = pc.user_id
            WHERE
                ei.user_id IN (SELECT DISTINCT user_id FROM employe_joining)
            `;

            const queryParams = [];


            if (itemName) {
                sql += ` AND ep.branch_id = ?`;
                queryParams.push(itemName);
            }



            // if (transformedData && Array.isArray(transformedData) && transformedData.length > 0) {
            //     const values = transformedData.map(item => item.value);
            //     sql += ` AND DATE_FORMAT(attendance.attendance_date, '%Y-%m') IN (${values.map(() => '?').join(', ')})`;
            //     queryParams.push(...values);
            // }

            // sql += ` GROUP BY attendance.user_id`;

            console.log("Constructed SQL Query:", sql);
            console.log("Query Parameters:", queryParams);

            // Execute the constructed SQL query
            // connection.query(sql, queryParams, (error, results, fields) => {
            //     if (error) {
            //         console.error("Error occurred during search:", error);
            //         res.status(500).json({ error: "An error occurred during search." });
            //     } else {
            //         console.log("Search results:", results);
            //         res.status(200).json({ results });
            //     }
            // });
            connection.query(sql, queryParams, async (err, results) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Failed to fetch employee data' });
                    return;
                }

                // Process results to aggregate educational qualifications
                const employees = {};
                results.forEach(row => {
                    const userId = row.user_id;
                    if (!employees[userId]) {
                        employees[userId] = {
                            ...row,
                            educational_qualifications: []
                        };
                    }
                    if (row.education) {
                        employees[userId].educational_qualifications.push({
                            education: row.education,
                            institute: row.institute,
                            result: row.result,
                            passing_year: row.passing_year
                        });
                    }
                });

                const processedResults = Object.values(employees);
                res.status(200).json(processedResults);
            });
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).json({ error: "An error occurred." });
        }
    },




    attendance_summary_print: async (req, res) => {
        try {
            const { searchResults, transformedDatas, sumOfTotalDays, filteredAttendances, matchLength, result, orientation, selectedPrintSize, fontSize, extraColumnValue, data } = req.body;

            // Debugging logs
            // console.log('searchResults:', searchResults);
            console.log('transformedDatas:', transformedDatas);
            // console.log('sumOfTotalDays:', sumOfTotalDays);
            // console.log('filteredAttendances:', filteredAttendances);
            // console.log('matchLength:', matchLength);
            console.log('result:', result);

            let tableRows = '';
            let extraColumnHeaders = '';
            let extraColumnData = '';

            // Create table headers
            let header = '<tr>';
            header += `<th>Employee ID</th>`;
            header += `<th>Name</th>`;
            header += `<th>Designation</th>`;
            header += `<th>Total Working Day</th>`;
            header += `<th>Total Present</th>`;
            header += `<th>Total Absent</th>`;

            if (transformedDatas && transformedDatas.length > 0) {
                header += transformedDatas.map(month => `<th>${month.label}</th>`).join('');
            }

            // Create editable extra columns based on extraColumnValue
            if (extraColumnValue && extraColumnValue > 0) {
                for (let i = 1; i <= extraColumnValue; i++) {
                    extraColumnHeaders += `<th><input type="text" name="extraColumnHeader_${i}" value=" Column ${i}" /></th>`;
                }
            }

            header += extraColumnHeaders;
            header += '</tr>';

            // Create table rows
            if (searchResults && searchResults.length > 0) {
                tableRows = searchResults.map((attendances, i) => {
                    let row = '<tr>';
                    row += `<td>${attendances.unique_id}</td>`;
                    row += `<td>${attendances.full_name}</td>`;
                    row += `<td>${attendances.designation_name}</td>`;

                    const totalWorkingDay = parseFloat(sumOfTotalDays) - (parseFloat(filteredAttendances.length) + parseFloat(matchLength.find(item => item.user_id === attendances.user_id)?.match_length || 0));
                    const totalPresent = result.find(item => item.user_id === attendances.user_id)?.match_length_total || 0;
                    const totalAbsent = totalWorkingDay - totalPresent;

                    row += `<td>${totalWorkingDay}</td>`;
                    row += `<td>${totalPresent}</td>`;
                    row += `<td>${totalAbsent}</td>`;

                    if (transformedDatas && transformedDatas.length > 0) {
                        row += transformedDatas.map(month => {
                            const match = data.find(d =>
                                d.user_id === attendances.user_id &&
                                d.month === month.value
                            );
                            return `<td>${match ? match.count : 0}</td>`;
                        }).join('');
                    }

                    // Add editable cells for extra columns
                    if (extraColumnValue && extraColumnValue > 0) {
                        for (let i = 1; i <= extraColumnValue; i++) {
                            row += `<td><input type="text" name="extraColumnValue_${attendances.user_id}_${i}" value="Value" /></td>`;
                        }
                    }

                    row += '</tr>';
                    return row;
                }).join('');
            }

            // Determine the page size and orientation based on selectedPrintSize and orientation
            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';

            // Generate HTML
            const html = `<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    @page {
                        size: ${pageSize} ${pageOrientation}; /* This sets the page size to A4 and orientation to Portrait */
                        margin: 20mm; /* Adjust the margin as needed */
                    }
                    * { 
                        font-family: 'Nikosh', sans-serif !important;
                        font-size: ${fontSize || '12px'}; /* Apply dynamic font size */
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                        border: 1px solid #ddd;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    img {
                        max-width: 100px;
                        max-height: 100px;
                    }
                    .container {
                        text-align: center;
                    }
                    .container2 {
                        display: flex;
                        justify-content: space-between;
                    }
                    input[type="text"] {
                        border: none;
                        background-color: transparent;
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Attendance List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Attendance List</h3>
                </div>
                <div class="container2">
                    <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                    <p style="margin: 0; padding: 0;">Collected By:</p>
                    <p style="margin: 0; padding: 0;">Date: </p>
                </div>
                <table>
                    <thead>
                        ${header}
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            <script>
                window.print();
            </script>
            </html>`;

            res.send(html); // Send the HTML directly to the client
        } catch (error) {
            console.error('Error in attendance_summary_print:', error);
            res.status(500).send('Error generating print view');
        }
    },




    attendance_summary_pdf: async (req, res) => {
        try {
            const { searchResults, transformedDatas, sumOfTotalDays, filteredAttendances, matchLength, result, orientation, selectedPrintSize, fontSize, data } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((attendances, i) => {

                let row = '<tr>';

                row += `<td>${attendances.unique_id}</td>`; // Employee ID
                row += `<td>${attendances.full_name}</td>`; // Name
                row += `<td>${attendances.designation_name}</td>`; // Designation

                const totalWorkingDays = parseFloat(sumOfTotalDays);
                const totalPresent = parseFloat(result.find(item => item.user_id === attendances.user_id)?.match_length_total || 0);
                const totalAbsent = totalWorkingDays - (parseFloat(filteredAttendances.length) + parseFloat(matchLength.find(item => item.user_id === attendances.user_id)?.match_length || 0)) - totalPresent;

                row += `<td>${totalWorkingDays - (parseFloat(filteredAttendances.length) + parseFloat(matchLength.find(item => item.user_id === attendances.user_id)?.match_length || 0))}</td>`; // Total Working Day
                row += `<td>${totalPresent}</td>`; // Total Present
                row += `<td>${totalAbsent}</td>`; // Total Absent

                transformedDatas.forEach(month => {
                    const match = data.find(d =>
                        d.user_id === attendances.user_id &&
                        d.month === month.value
                    );
                    row += `<td>${match ? match.count : 0}</td>`;
                });

                row += '</tr>';
                tableRows += row;
            });

            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';

            const html = `<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Attendance Summary</title>
                <style>
                     @page {
                        size: ${pageSize} ${pageOrientation}; /* This sets the page size to A4 and orientation to Portrait */
                        margin: 20mm; /* Adjust the margin as needed */
                    }
                    * { 
                        font-family: 'Nikosh', sans-serif !important;
                        font-size: ${fontSize || '12px'}; /* Apply dynamic font size */
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                        border: 1px solid #ddd;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    img {
                        max-width: 100px;
                        max-height: 100px;
                    }
                    .container {
                        text-align: center;
                    }
                    .container2 {
                        display: flex;
                        justify-content: space-between;
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Attendance List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Attendance List</h3>
                </div>
                <div class="container2">
                    <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                    <p style="margin: 0; padding: 0;">Collected By:</p>
                    <p style="margin: 0; padding: 0;">Date: </p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Designation</th>
                            <th>Total Working Day</th>
                            <th>Total Present</th>
                            <th>Total Absent</th>
                            ${transformedDatas?.map(month => `<th>${month.label}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>`;

            wkhtmltopdf(html, { pageSize: pageSize, orientation: pageOrientation }, (err, stream) => {
                if (err) {
                    console.error('Error generating PDF:', err);
                    console.error('Error details:', err.stderr); // Log additional details from stderr
                    res.status(500).send('Error generating PDF');
                    return;
                }
                stream.pipe(res);
            });
        } catch (error) {
            console.error('Error in attendance_summary_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },








    attendance_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM attendance WHERE id = ?';
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






    //  attendance Details

    attendance_details_list: async (req, res) => {
        try {
            // First query: get leave applications
            const leaveApplicationsQuery = `
                SELECT la.*
                FROM leave_application la
                WHERE la.application_status = 2
            `;

            // Query 1: Get leave applications
            connection.query(leaveApplicationsQuery, function (error, leaveApplications) {
                if (error) {
                    console.log(error);
                    return res.status(500).send('Database query error');
                }

                // Second query: get leave application dates
                const leaveApplicationDatesQuery = `
                    SELECT lad.id, lad.leave_application_id, lad.leave_date
                    FROM leave_application_date lad
                `;

                // Query 2: Get leave application dates
                connection.query(leaveApplicationDatesQuery, function (error, leaveApplicationDates) {
                    if (error) {
                        console.log(error);
                        return res.status(500).send('Database query error');
                    }

                    // Create a map to group leave application dates by leave_application_id
                    const leaveDatesMap = leaveApplicationDates.reduce((acc, date) => {
                        if (!acc[date.leave_application_id]) {
                            acc[date.leave_application_id] = [];
                        }
                        acc[date.leave_application_id].push({
                            id: date.id,
                            leave_application_id: date.leave_application_id,
                            leave_date: date.leave_date
                        });
                        return acc;
                    }, {});

                    // Combine leave application details with their corresponding dates
                    const result = leaveApplications.map(application => ({
                        ...application,
                        leave_application_ids: leaveDatesMap[application.id] || []
                    }));

                    res.send(result);
                });
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    },



    attendance_details_print: async (req, res) => {
        try {
            const {
                daysInMonth,
                searchResults,
                filteredAttendances,
                orientation,
                selectedPrintSize,
                fontSize,
                extraColumnValue,
                leaveAllApproved,
                absentLookup,
                attendanceLookup
            } = req.body;
            const leaveMap = leaveAllApproved.reduce((acc, leave) => {
                if (!acc[leave.whose_leave]) {
                    acc[leave.whose_leave] = new Set();
                }
                leave.leave_application_ids.forEach(leaveDate => {
                    const dateKey = leaveDate.leave_date.slice(0, 10); // Extract date in YYYY-MM-DD format
                    acc[leave.whose_leave].add(dateKey);
                });
                return acc;
            }, {});
            console.log(leaveMap)
            // Create table headers
            let header = '<tr>';
            header += `<th>Employee ID</th>`;
            header += `<th>Name</th>`;
            header += `<th>Designation</th>`;

            // Add headers for each day in the month
            if (daysInMonth && daysInMonth.length > 0) {
                header += daysInMonth.map(date => `<th>${date.slice(8, 10)}</th>`).join('');
            }

            // Add headers for totals
            header += `<th>Present</th>`;
            header += `<th>Absent</th>`;
            header += `<th>Holiday</th>`;
            header += `<th>Leave</th>`;

            // Add headers for extra columns
            if (extraColumnValue && extraColumnValue > 0) {
                for (let i = 1; i <= extraColumnValue; i++) {
                    header += `<th><input type="text" name="extraColumnName_${i}" value="Extra Column ${i}" style="border: none;" /></th>`;
                }
            }

            header += '</tr>';

            // Create table rows
            let tableRows = '';
            if (searchResults && searchResults.length > 0) {
                tableRows = searchResults.map(attendances => {
                    let presentCount = 0;
                    let absentCount = 0;
                    let holidayCount = 0;
                    let leaveCount = 0;

                    let row = '<tr>';
                    row += `<td>${attendances.unique_id}</td>`;
                    row += `<td>${attendances.full_name}</td>`;
                    row += `<td>${attendances.designation_name}</td>`;

                    // Add data for each day in the month
                    if (daysInMonth && daysInMonth.length > 0) {
                        row += daysInMonth.map(date => {
                            const day = date.slice(0, 10); // Extract date in YYYY-MM-DD format
                            const isHoliday = filteredAttendances.some(holiday => {
                                const holidayDate = new Date(holiday.start_date);
                                return holidayDate.getDate() === parseInt(date.slice(8, 10), 10);
                            });
                            const leaveSet = leaveMap[attendances.user_id];
                            const hasLeave = leaveSet && leaveSet instanceof Set ? leaveSet.has(day) : false;

                            const presentKey = `${attendances.user_id}-${day}`;
                            const isPresent = attendanceLookup[presentKey];

                            const absentKey = `${attendances.user_id}-${day}`;
                            const isAbsent = absentLookup[absentKey];

                            let cellContent = '';
                            let cellClass = '';

                            if (isPresent) {
                                cellContent = 'P';
                                cellClass = ''; // Blue color for Present
                                presentCount++;
                            } else if (isAbsent) {
                                cellContent = 'A';
                                cellClass = 'text-danger'; // Red color for Absent
                                absentCount++;
                            } else if (hasLeave) {
                                cellContent = 'L';
                                cellClass = 'text-success'; // Green color for Leave
                                leaveCount++;
                            } else if (isHoliday) {
                                cellContent = 'H';
                                cellClass = 'text-primary'; // Blue color for Holiday
                                holidayCount++;
                            }

                            return `<td class="${cellClass}">${cellContent}</td>`;
                        }).join('');
                    }

                    // Add totals
                    row += `<td>${presentCount}</td>`;
                    row += `<td>${absentCount}</td>`;
                    row += `<td>${holidayCount}</td>`;
                    row += `<td>${leaveCount}</td>`;

                    // Add data for extra columns
                    if (extraColumnValue && extraColumnValue > 0) {
                        for (let i = 1; i <= extraColumnValue; i++) {
                            row += `<td><input type="text" name="extraColumnValue_${attendances.user_id}_${i}" value="" style="border: none;" /></td>`;
                        }
                    }

                    row += '</tr>';
                    return row;
                }).join('');
            }

            // Determine the page size and orientation based on selectedPrintSize and orientation
            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';

            // Generate HTML
            const html = `<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    @page {
                        size: ${pageSize} ${pageOrientation}; /* This sets the page size to A4 and orientation to Portrait */
                        margin: 20mm; /* Adjust the margin as needed */
                    }
                    * { 
                        font-family: 'Nikosh', sans-serif !important;
                        font-size: ${fontSize || '12px'}; /* Apply dynamic font size */
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                        border: 1px solid #ddd;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .text-primary {
                        color: blue;
                    }
                    .text-success {
                        color: green;
                    }
                    .text-danger {
                        color: red;
                    }
                    .container {
                        text-align: center;
                    }
                    .container2 {
                        display: flex;
                        justify-content: space-between;
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Attendance List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Attendance List</h3>
                </div>
                <div class="container2">
                    <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                    <p style="margin: 0; padding: 0;">Collected By:</p>
                    <p style="margin: 0; padding: 0;">Date: </p>
                </div>
                <div class="table-responsive">
                    <table id='mytable' class="table table-bordered table-hover table-striped table-sm">
                        <thead>
                            ${header}
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            </body>
            <script>
                window.print();
            </script>
            </html>`;

            res.send(html); // Send the HTML directly to the client
        } catch (error) {
            console.error('Error in attendance_details_print:', error);
            res.status(500).send('Error generating print view');
        }
    },




    attendance_details_pdf: async (req, res) => {
        try {
            const { daysInMonth, searchResults, filteredAttendances, orientation, selectedPrintSize, fontSize, leaveAllApproved, absentLookup, attendanceLookup } = req.body;

            console.log('Request Body:', req.body);

            const leaveMap = leaveAllApproved.reduce((acc, leave) => {
                if (!acc[leave.whose_leave]) {
                    acc[leave.whose_leave] = new Set();
                }
                leave.leave_application_ids.forEach(leaveDate => {
                    const dateKey = leaveDate.leave_date.slice(0, 10); // Extract date in YYYY-MM-DD format
                    acc[leave.whose_leave].add(dateKey);
                });
                return acc;
            }, {});

            console.log('Leave Map:', leaveMap);

            let tableRows = '';
            searchResults?.forEach((attendances) => {
                let presentCount = 0;
                let absentCount = 0;
                let holidayCount = 0;
                let leaveCount = 0;

                let row = '<tr>';
                row += `<td>${attendances.unique_id}</td>`; // Employee ID
                row += `<td>${attendances.full_name}</td>`; // Name
                row += `<td>${attendances.designation_name}</td>`; // Designation

                daysInMonth.forEach(date => {
                    const day = date.slice(0, 10); // Extract date in YYYY-MM-DD format
                    const isHoliday = filteredAttendances.some(holiday => {
                        const holidayDate = new Date(holiday.start_date);
                        return holidayDate.getDate() === parseInt(date.slice(8, 10), 10);
                    });
                    const leaveSet = leaveMap[attendances.user_id];
                    const hasLeave = leaveSet && leaveSet instanceof Set ? leaveSet.has(day) : false;

                    const presentKey = `${attendances.user_id}-${day}`;
                    const isPresent = attendanceLookup[presentKey];

                    const absentKey = `${attendances.user_id}-${day}`;
                    const isAbsent = absentLookup[absentKey];

                    let cellContent = '';
                    if (isPresent) {
                        cellContent = 'P';
                        presentCount++;
                    } else if (isAbsent) {
                        cellContent = 'A';
                        absentCount++;
                    } else if (hasLeave) {
                        cellContent = 'L';
                        leaveCount++;
                    } else if (isHoliday) {
                        cellContent = 'H';
                        holidayCount++;
                    }

                    row += `<td>${cellContent}</td>`;
                });

                row += `<td>${presentCount}</td>`; // Total Present
                row += `<td>${absentCount}</td>`; // Total Absent
                row += `<td>${holidayCount}</td>`; // Total Holiday
                row += `<td>${leaveCount}</td>`; // Total Leave
                row += '</tr>';

                tableRows += row;
            });

            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';

            const html = `<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Attendance Summary</title>
                <style>
                    @page {
                        size: ${pageSize} ${pageOrientation}; /* This sets the page size to A4 and orientation to Portrait */
                        margin: 20mm; /* Adjust the margin as needed */
                    }
                    * { 
                        font-family: 'Nikosh', sans-serif !important;
                        font-size: ${fontSize || '12px'}; /* Apply dynamic font size */
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                        border: 1px solid #ddd;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    img {
                        max-width: 100px;
                        max-height: 100px;
                    }
                    .container {
                        text-align: center;
                    }
                    .container2 {
                        display: flex;
                        justify-content: space-between;
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Attendance List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Attendance List</h3>
                </div>
                <div class="container2">
                    <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                    <p style="margin: 0; padding: 0;">Collected By:</p>
                    <p style="margin: 0; padding: 0;">Date: </p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Designation</th>
                            ${daysInMonth.map(date => `<th>${date.slice(8, 10)}</th>`).join('')}
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Holiday</th>
                            <th>Leave</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>`;

            console.log('Generated HTML:', html);

            wkhtmltopdf(html, { pageSize: pageSize, orientation: pageOrientation }, (err, stream) => {
                if (err) {
                    console.error('Error generating PDF:', err);
                    console.error('Error details:', err.stderr); // Log additional details from stderr
                    res.status(500).send('Error generating PDF');
                    return;
                }
                stream.pipe(res);
            });
        } catch (error) {
            console.error('Error in attendance_details_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },






    //  absent 
    absent_list_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { searchQuery, itemName, employee, month, fromDate, toDate } = req.body;

            // Construct the base SQL query
            let sql = `
           SELECT 
                     absent.*, 
                     users.full_name, 
                     users.unique_id, 
                     users.photo, 
                     employee_promotion.designation_id,
                     employee_promotion.branch_id,
                     designation.designation_name
                 FROM 
                     absent
                LEFT JOIN 
                     users ON absent.user_id = users.id
                 LEFT JOIN 
                     employee_promotion ON absent.user_id = employee_promotion.user_id
                 LEFT JOIN 
                     designation ON employee_promotion.designation_id = designation.id
            WHERE 1=1`;



            const queryParams = [];

            if (searchQuery) {
                sql += ` AND employee_promotion.designation_id = ?`;
                queryParams.push(searchQuery);
            }
            if (employee) {
                sql += ` AND absent.user_id = ?`;
                queryParams.push(employee);
            }
            if (itemName) {
                sql += ` AND employee_promotion.branch_id = ?`;
                queryParams.push(itemName);
            }
            if (month) {
                sql += ` AND DATE_FORMAT(absent.created_date, '%Y-%m') = ?`;
                queryParams.push(month);
            }
            if (fromDate && toDate) {
                sql += ` AND absent.created_date BETWEEN ? AND ?`;
                queryParams.push(fromDate, toDate);
            }



            console.log("Constructed SQL Query:", sql);
            console.log("Query Parameters:", queryParams);

            // Execute the constructed SQL query
            connection.query(sql, queryParams, (error, results, fields) => {
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


    absent_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM absent WHERE id = ?';
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

    // create_sms_campion: async (req, res) => {

    //     try {
    //         const {
    //             name,category,created_by,total_number,one_time,status, isSms

    //         } = req.body;

    //         // campaign_id, sender_id, number, message, message_id,user_id, campaign_category, attendance_id, sms_campaign_log_id


    //         const educationalQualifications = req.body.fields; // Assuming this is an array of qualifications
    //         const educationalQualification = req.body.field; // Assuming this is an array of qualifications



    //         // Assuming you have a connection object already defined
    //         connection.beginTransaction();

    //         const userQuery = `INSERT INTO sms_campaign ( name,category,created_by,total_number,one_time,status) VALUES (?, ?, ?, ?, ?, ?)`;
    //         const userParams = [name,category,created_by,total_number,one_time,status];

    //         connection.query(userQuery, userParams, async (err, results) => {
    //             if (err) {
    //                 console.error(err);
    //                 await connection.rollback();
    //                 res.status(500).json({ message: 'User creation failed' });
    //                 return;
    //             }

    //             try {
    //                 const campaign_id = results.insertId;


    //                 // Insert into educational_qualification table
    //                 for (const qualification of educationalQualifications) {
    //                     const { sender_id, number, message, message_id,user_id, campaign_category } = qualification;
    //                     const eduQualificationQuery = `INSERT INTO educational_qualification (  campaign_id, sender_id, number, message, message_id,user_id, campaign_category) 
    //                                                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
    //                     const eduQualificationParams = [campaign_id, sender_id, number, message, message_id, user_id, campaign_category];
    //                     await connection.query(eduQualificationQuery, eduQualificationParams);
    //                 }

    //                 for (const qualificatio of educationalQualification) {
    //                     const {attendance_id, sms_campaign_log_id } = qualificatio;
    //                     const eduQualificationQuery = `INSERT INTO attendance_sms (  attendance_id, sms_campaign_log_id) 
    //                                                     VALUES (?, ?)`;
    //                     const eduQualificationParams = [attendance_id, sms_campaign_log_id ];
    //                     await connection.query(eduQualificationQuery, eduQualificationParams);
    //                 }

    //                 // New addition: Insert into employee_promotion table


    //                 await connection.commit();

    //                 res.status(200).json({ message: 'User created successfully' });
    //             } catch (error) {
    //                 console.error("Error inserting additional data:", error);
    //                 await connection.rollback();
    //                 res.status(500).json({ message: "Error inserting additional data." });
    //             }
    //         });

    //     } catch (error) {
    //         console.error("Error inserting data:", error);
    //         await connection.rollback();
    //         res.status(500).json({ message: "Error inserting data." });
    //     }
    // },

    // create_sms_campion_and_attendance: async (req, res) => {
    //     try {
    //         const { name, category, isSms, created_by, total_number, one_time, status, fields, field } = req.body;
    //         const models = req.body.models; // Assuming `models` contains attendance data

    //         // Start transaction
    //         connection.beginTransaction();

    //         try {
    //             // Insert into attendance table first
    //             const attendanceResults = [];
    //             for (const model of models) {
    //                 const { user_id, checktime, created_by, attendance_date, device_id, unique_id } = model;
    //                 const attendanceQuery = `INSERT INTO attendance 
    //                                          (user_id, checktime, created_by, attendance_date, device_id, unique_id) 
    //                                          VALUES (?, ?, ?, ?, ?, ?)`;
    //                 const attendanceParams = [user_id, checktime, created_by, attendance_date, device_id, unique_id];
    //                 const insertedModel = await new Promise((resolve, reject) => {
    //                     connection.query(attendanceQuery, attendanceParams, (error, result) => {
    //                         if (error) {
    //                             reject(error);
    //                         } else {
    //                             resolve(result);
    //                         }
    //                     });
    //                 });
    //                 attendanceResults.push(insertedModel);
    //             }

    //             // Commit the transaction after attendance insertion
    //             await connection.commit();

    //             // Start a new transaction for the rest of the inserts
    //             connection.beginTransaction();

    //             const campaignQuery = `INSERT INTO sms_campaign (name, category, created_by, total_number, one_time, status) 
    //                                     VALUES (?, ?, ?, ?, ?, ?)`;
    //             const campaignParams = [name, category, created_by, total_number, one_time, status];

    //             connection.query(campaignQuery, campaignParams, async (err, campaignResults) => {
    //                 if (err) {
    //                     console.error(err);
    //                     await connection.rollback();
    //                     res.status(500).json({ message: 'Campaign creation failed' });
    //                     return;
    //                 }

    //                 try {
    //                     const campaign_id = campaignResults.insertId;

    //                     // Insert into educational_qualification table
    //                     for (const qualification of fields) {
    //                         const { sender_id, number, message, message_id, user_id, campaign_category } = qualification;
    //                         const eduQualificationQuery = `INSERT INTO educational_qualification 
    //                                                         (campaign_id, sender_id, number, message, message_id, user_id, campaign_category) 
    //                                                         VALUES (?, ?, ?, ?, ?, ?, ?)`;
    //                         const eduQualificationParams = [campaign_id, sender_id, number, message, message_id, user_id, campaign_category];
    //                         await connection.query(eduQualificationQuery, eduQualificationParams);
    //                     }

    //                     // Insert into attendance_sms table
    //                     for (const qualificatio of field) {
    //                         const { attendance_id, sms_campaign_log_id } = qualificatio;
    //                         const attendanceSmsQuery = `INSERT INTO attendance_sms 
    //                                                     (attendance_id, sms_campaign_log_id) 
    //                                                     VALUES (?, ?)`;
    //                         const attendanceSmsParams = [attendance_id, sms_campaign_log_id];
    //                         await connection.query(attendanceSmsQuery, attendanceSmsParams);
    //                     }

    //                     await connection.commit();

    //                     res.status(200).json({ message: 'Campaign and attendance data created successfully', attendanceResults });
    //                 } catch (error) {
    //                     console.error("Error inserting data:", error);
    //                     await connection.rollback();
    //                     res.status(500).json({ message: "Error inserting data." });
    //                 }
    //             });
    //         } catch (error) {
    //             console.error("Error inserting attendance data:", error);
    //             await connection.rollback();
    //             res.status(500).json({ message: "Error inserting attendance data." });
    //         }
    //     } catch (error) {
    //         console.error("Error inserting data:", error);
    //         await connection.rollback();
    //         res.status(500).json({ message: "Error inserting data." });
    //     }
    // }
    // attendance_create: async (req, res) => {
    //     try {
    //         const { name, category, withPresent, created_by, total_number, one_time, status, fields, field, dataToSend } = req.body;
    //         console.log(name, category, withPresent, created_by, total_number, one_time, status, fields, field, dataToSend);

    //         // Start transaction
    //         connection.beginTransaction();

    //         try {
    //             // Insert into attendance table first
    //             const attendanceResults = await Promise.all(dataToSend.map(async (model) => {
    //                 const { user_id, checktime, created_by, attendance_date, device_id, unique_id } = model;
    //                 const attendanceQuery = `INSERT INTO attendance 
    //                                          (user_id, checktime, created_by, attendance_date, device_id, unique_id) 
    //                                          VALUES (?, ?, ?, ?, ?, ?)`;
    //                 const attendanceParams = [user_id, checktime, created_by, attendance_date, device_id, unique_id];

    //                 return new Promise((resolve, reject) => {
    //                     connection.query(attendanceQuery, attendanceParams, (error, result) => {
    //                         if (error) {
    //                             reject(error);
    //                         } else {
    //                             resolve({ ...result, attendance_id: result.insertId });
    //                         }
    //                     });
    //                 });
    //             }));

    //             // Commit the transaction after attendance insertion
    //             await connection.commit();

    //             // Start a new transaction for SMS campaign insertion
    //             connection.beginTransaction();

    //             if (withPresent === true) {
    //                 const campaignQuery = `INSERT INTO sms_campaign (name, category, created_by, total_number, one_time, status) 
    //                                        VALUES (?, ?, ?, ?, ?, ?)`;
    //                 const campaignParams = [name, category, created_by, total_number, one_time, status];

    //                 const campaignResult = await new Promise((resolve, reject) => {
    //                     connection.query(campaignQuery, campaignParams, (error, result) => {
    //                         if (error) {
    //                             return reject(error);
    //                         }
    //                         resolve(result);
    //                     });
    //                 });

    //                 const campaign_id = campaignResult.insertId;

    //                 // Insert into educational_qualification table
    //                 await Promise.all(fields.map(async (qualification) => {
    //                     const { sender_id, number, message, message_id, user_id, campaign_category } = qualification;
    //                     const eduQualificationQuery = `INSERT INTO educational_qualification 
    //                                                     (campaign_id, sender_id, number, message, message_id, user_id, campaign_category) 
    //                                                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
    //                     const eduQualificationParams = [campaign_id, sender_id, number, message, message_id, user_id, campaign_category];
    //                     return new Promise((resolve, reject) => {
    //                         connection.query(eduQualificationQuery, eduQualificationParams, (error) => {
    //                             if (error) reject(error);
    //                             else resolve();
    //                         });
    //                     });
    //                 }));

    //                 // Insert into attendance_sms table
    //                 await Promise.all(field.map(async (qualification) => {
    //                     const { sms_campaign_log_id } = qualification;
    //                     const attendanceSmsQuery = `INSERT INTO attendance_sms 
    //                                                 (attendance_id, sms_campaign_log_id) 
    //                                                 VALUES (?, ?)`;
    //                     const attendanceSmsParams = [attendanceResults[0].attendance_id, sms_campaign_log_id];
    //                     return new Promise((resolve, reject) => {
    //                         connection.query(attendanceSmsQuery, attendanceSmsParams, (error) => {
    //                             if (error) reject(error);
    //                             else resolve();
    //                         });
    //                     });
    //                 }));

    //                 await connection.commit();

    //                 res.status(200).json({ message: 'Campaign and attendance data created successfully', attendanceResults });
    //             } else {
    //                 // Commit the attendance data only if no SMS campaign is needed
    //                 await connection.commit();
    //                 res.status(200).json({ message: 'Attendance data created successfully', attendanceResults });
    //             }
    //         } catch (error) {
    //             console.error("Error inserting data:", error);
    //             await connection.rollback();
    //             res.status(500).json({ message: "Error inserting data." });
    //         }
    //     } catch (error) {
    //         console.error("Error processing request:", error);
    //         await connection.rollback();
    //         res.status(500).json({ message: "Error processing request." });
    //     }
    // }

    // attendance_create: async (req, res) => {
    //     try {
    //         const models = req.body;
    //         const results = [];

    //         for (const model of models) {
    //             const { user_id, checktime, created_by, attendance_date, device_id, unique_id } = model;

    //             // Insert into the attendance table
    //             const insertQuery = 'INSERT INTO attendance (user_id, checktime, created_by, attendance_date, device_id, unique_id) VALUES (?, ?, ?, ?, ?, ?)';
    //             const insertedModel = await new Promise((resolve, reject) => {
    //                 connection.query(insertQuery, [user_id, checktime, created_by, attendance_date, device_id, unique_id], (error, result) => {
    //                     if (error) {
    //                         console.log(error);
    //                         reject(error);
    //                     } else {
    //                         resolve(result);
    //                     }
    //                 });
    //             });
    //             const attendance_ids = insertedModel.insertId;
    //             console.log(insertedModel);
    //             results.push(insertedModel);
    //             const name = 'attendance_sms';
    //             const category = 'Enter Number';
    //             const total_number = 1;
    //             const one_time = 1;
    //             const status = 1; // Set status to 'pending'
    //             const created_bys = 181;

    //             const campaignQuery = `INSERT INTO sms_campaign (name, category, created_by, total_number, one_time, status) 
    //             VALUES (?, ?, ?, ?, ?, ?)`;
    //             const campaignParams = [name, category, created_bys, total_number, one_time, status];

    //             const campaignResult = await new Promise((resolve, reject) => {
    //                 connection.query(campaignQuery, campaignParams, (error, result) => {
    //                     if (error) {
    //                         return reject(error);
    //                     }
    //                     resolve(result);
    //                 });
    //             });

    //             const campaign_id = campaignResult.insertId;

    //             // Insert into educational_qualification table
    //                     for (const model of models) {
    //                         const {  number, user_id } = model;
    //                         const eduQualificationQuery = `INSERT INTO educational_qualification 
    //                                                         (campaign_id, sender_id, number, message, message_id, user_id, campaign_category) 
    //                                                         VALUES (?, ?, ?, ?, ?, ?, ?)`;
    //                         const eduQualificationParams = [campaign_id, created_by, number, 'message', "message_id", user_id, 'campaign_category'];
    //                         await connection.query(eduQualificationQuery, eduQualificationParams);
    //                     }

    //                     // Insert into attendance_sms table

    //                     for (const model of models) {
    //                         const attendanceSmsQuery = `INSERT INTO attendance_sms 
    //                                                     (attendance_id, sms_campaign_log_id) 
    //                                                     VALUES (?, ?)`;
    //                         const attendanceSmsParams = [attendance_ids, 1];
    //                         await connection.query(attendanceSmsQuery, attendanceSmsParams);
    //                     }

    //         }

    //         // Prepare SMS campaign with a status of 'pending'




    //         res.json({ attendanceResults: results, campaignResult: campaignResult });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // },

    // attendance_create: async (req, res) => {
    //     try {
    //         const models = req.body;
    //         const results = [];

    //         for (const model of models) {
    //             const { user_id, checktime, created_by, attendance_date, device_id, unique_id, number } = model;

    //             // Insert into the attendance table
    //             const insertQuery = 'INSERT INTO attendance (user_id, checktime, created_by, attendance_date, device_id, unique_id) VALUES (?, ?, ?, ?, ?, ?)';
    //             const insertedModel = await new Promise((resolve, reject) => {
    //                 connection.query(insertQuery, [user_id, checktime, created_by, attendance_date, device_id, unique_id], (error, result) => {
    //                     if (error) {
    //                         console.log(error);
    //                         reject(error);
    //                     } else {
    //                         resolve(result);
    //                     }
    //                 });
    //             });

    //             const attendance_id = insertedModel.insertId;
    //             results.push(insertedModel);

    //             // Insert into sms_campaign table
    //             const name = 'attendance_sms';
    //             const category = 'Enter Number';
    //             const total_number = 1;
    //             const one_time = 1;
    //             const status = 1; // Set status to 'pending'
    //             const created_bys = 181;

    //             const campaignQuery = `INSERT INTO sms_campaign (name, category, created_by, total_number, one_time, status) VALUES (?, ?, ?, ?, ?, ?)`;
    //             const campaignParams = [name, category, created_bys, total_number, one_time, status];

    //             const campaignResult = await new Promise((resolve, reject) => {
    //                 connection.query(campaignQuery, campaignParams, (error, result) => {
    //                     if (error) {
    //                         return reject(error);
    //                     }
    //                     resolve(result);
    //                 });
    //             });

    //             const campaign_id = campaignResult.insertId;

    //             // Insert into educational_qualification table
    //             const eduQualificationQuery = `INSERT INTO sms_campaign_log (campaign_id, sender_id, number, message, message_id, user_id, campaign_category) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    //             const eduQualificationParams = [campaign_id, created_by, number, 'message', "message_id", user_id, 'campaign_category'];
    //             await new Promise((resolve, reject) => {
    //                 connection.query(eduQualificationQuery, eduQualificationParams, (error) => {
    //                     if (error) {
    //                         return reject(error);
    //                     }
    //                     resolve();
    //                 });
    //             });

    //             // Insert into attendance_sms table
    //             const attendanceSmsQuery = `INSERT INTO attendance_sms (attendance_id, sms_campaign_log_id) VALUES (?, ?)`;
    //             const attendanceSmsParams = [attendance_id, campaign_id];
    //             await new Promise((resolve, reject) => {
    //                 connection.query(attendanceSmsQuery, attendanceSmsParams, (error) => {
    //                     if (error) {
    //                         return reject(error);
    //                     }
    //                     resolve();
    //                 });
    //             });
    //         }

    //         // Send response
    //         res.json({ attendanceResults: results, campaignResult: campaignResult });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // },
    // attendance_create: async (req, res) => {
    //     try {
    //         const models = req.body;
    //         const results = [];
    //         let campaignResult; // Initialize campaignResult here

    //         for (const model of models) {
    //             const { user_id, checktime, created_by, attendance_date, device_id, unique_id, number } = model;

    //             // Insert into the attendance table
    //             const insertQuery = 'INSERT INTO attendance (user_id, checktime, created_by, attendance_date, device_id, unique_id) VALUES (?, ?, ?, ?, ?, ?)';
    //             const insertedModel = await new Promise((resolve, reject) => {
    //                 connection.query(insertQuery, [user_id, checktime, created_by, attendance_date, device_id, unique_id], (error, result) => {
    //                     if (error) {
    //                         console.log(error);
    //                         reject(error);
    //                     } else {
    //                         resolve(result);
    //                     }
    //                 });
    //             });

    //             const attendance_id = insertedModel.insertId;
    //             results.push(insertedModel);

    //             // Insert into sms_campaign table
    //             const name = 'attendance_sms';
    //             const category = 'Enter Number';
    //             const total_number = 1;
    //             const one_time = 1;
    //             const status = 1; // Set status to 'pending'
    //             const created_bys = 181;

    //             const campaignQuery = `INSERT INTO sms_campaign (name, category, created_by, total_number, one_time, status) VALUES (?, ?, ?, ?, ?, ?)`;
    //             const campaignParams = [name, category, created_bys, total_number, one_time, status];

    //             campaignResult = await new Promise((resolve, reject) => {
    //                 connection.query(campaignQuery, campaignParams, (error, result) => {
    //                     if (error) {
    //                         return reject(error);
    //                     }
    //                     resolve(result);
    //                 });
    //             });

    //             const campaign_id = campaignResult.insertId;

    //             // Insert into educational_qualification table
    //             const eduQualificationQuery = `INSERT INTO sms_campaign_log (campaign_id, sender_id, number, message, message_id, user_id, campaign_category) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    //             const eduQualificationParams = [campaign_id, created_by, number, 'message', "message_id", user_id, 'campaign_category'];
    //             await new Promise((resolve, reject) => {
    //                 connection.query(eduQualificationQuery, eduQualificationParams, (error) => {
    //                     if (error) {
    //                         return reject(error);
    //                     }
    //                     resolve();
    //                 });
    //             });

    //             // Insert into attendance_sms table
    //             const attendanceSmsQuery = `INSERT INTO attendance_sms (attendance_id, sms_campaign_log_id) VALUES (?, ?)`;
    //             const attendanceSmsParams = [attendance_id, campaign_id];
    //             await new Promise((resolve, reject) => {
    //                 connection.query(attendanceSmsQuery, attendanceSmsParams, (error) => {
    //                     if (error) {
    //                         return reject(error);
    //                     }
    //                     resolve();
    //                 });
    //             });
    //         }

    //         // Send response
    //         res.json({ attendanceResults: results, campaignResult: campaignResult });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // },


    // attendance_create: async (req, res) => {
    //     try {
    //         const models = req.body;
    //         const results = [];
    //         let campaignResult; // Initialize campaignResult here
    //         let eduQualificationResult; // Initialize eduQualificationResult here

    //         for (const model of models) {
    //             const { user_id, checktime, created_by, attendance_date, device_id, unique_id, number, name, sms_campaign_category_id, employeeAttendanceSmsTemplate, checkedItemsData } = model;


    //             checkedItemsData.forEach((employee) => {


    //                 const currentDate = new Date();
    //                 const date = currentDate.toLocaleDateString();
    //                 const smsTime = currentDate.toLocaleTimeString();

    //                 // Replace placeholders with actual data
    //                 let msg = employeeAttendanceSmsTemplate
    //                     .replace('[[company_name]]', employee.company_name || 'No Company')
    //                     .replace('[[full_name]]', employee.full_name)
    //                     .replace('[[employee_id]]', employee.unique_id)
    //                     .replace('[[designation]]', employee.designation_name)
    //                     .replace('[[date]]', date)
    //                     .replace('[[in_time]]', formatDateAmPm(startDatetime.datetime))
    //                     .replace('[[sms_time]]', smsTime);
    //             });


    //             // Insert into the attendance table
    //             const insertQuery = 'INSERT INTO attendance (user_id, checktime, created_by, attendance_date, device_id, unique_id) VALUES (?, ?, ?, ?, ?, ?)';
    //             const insertedModel = await new Promise((resolve, reject) => {
    //                 connection.query(insertQuery, [user_id, checktime, created_by, attendance_date, device_id, unique_id], (error, result) => {
    //                     if (error) {
    //                         console.log(error);
    //                         reject(error);
    //                     } else {
    //                         resolve(result);
    //                     }
    //                 });
    //             });

    //             const attendance_id = insertedModel.insertId;
    //             results.push(insertedModel);

    //             // Insert into sms_campaign table
    //             // const name = 'attendance_sms';
    //             const category = 'Enter Number';
    //             const total_number = 1;
    //             const one_time = 1;
    //             const status = 1; // Set status to 'pending'


    //             const campaignQuery = `INSERT INTO sms_campaign (name, category, created_by, total_number, one_time, status) VALUES (?, ?, ?, ?, ?, ?)`;
    //             const campaignParams = [name, category, created_by, total_number, one_time, status];

    //             campaignResult = await new Promise((resolve, reject) => {
    //                 connection.query(campaignQuery, campaignParams, (error, result) => {
    //                     if (error) {
    //                         return reject(error);
    //                     }
    //                     resolve(result);
    //                 });
    //             });

    //             const campaign_id = campaignResult.insertId;

    //             // Insert into educational_qualification table
    //             const eduQualificationQuery = `INSERT INTO sms_campaign_log (campaign_id, sender_id, number, message, message_id, user_id, campaign_category) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    //             const eduQualificationParams = [campaign_id, created_by, number, 'message', "message_id", user_id, sms_campaign_category_id];

    //             eduQualificationResult = await new Promise((resolve, reject) => {
    //                 connection.query(eduQualificationQuery, eduQualificationParams, (error, result) => {
    //                     if (error) {
    //                         return reject(error);
    //                     }
    //                     resolve(result);
    //                 });
    //             });

    //             const edu_qualification_id = eduQualificationResult.insertId;

    //             // Insert into attendance_sms table
    //             const attendanceSmsQuery = `INSERT INTO attendance_sms (attendance_id, sms_campaign_log_id) VALUES (?, ?)`;
    //             const attendanceSmsParams = [attendance_id, edu_qualification_id];
    //             await new Promise((resolve, reject) => {
    //                 connection.query(attendanceSmsQuery, attendanceSmsParams, (error) => {
    //                     if (error) {
    //                         return reject(error);
    //                     }
    //                     resolve();
    //                 });
    //             });
    //         }

    //         // Send response
    //         res.json({
    //             attendanceResults: results,
    //             campaignResult: campaignResult,
    //             sms_campaign_log: eduQualificationResult
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // },


    // attendance_create: async (req, res) => {
    //     try {


    //         const formatDateAmPm = (inputDate) => {
    //             const date = new Date(inputDate);

    //             const year = date.getFullYear();
    //             const month = String(date.getMonth() + 1).padStart(2, '0');
    //             const day = String(date.getDate()).padStart(2, '0');

    //             let hours = date.getUTCHours();
    //             const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    //             const ampm = hours >= 12 ? 'PM' : 'AM';

    //             hours = hours % 12;
    //             hours = hours ? String(hours).padStart(2, '0') : '12'; // the hour '0' should be '12'

    //             return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
    //         };


    //         const models = req.body;
    //         const results = [];
    //         let campaignResult; // Initialize campaignResult here
    //         let eduQualificationResult; // Initialize eduQualificationResult here

    //         for (const model of models) {
    //             const { user_id, checktime, created_by, attendance_date, device_id, unique_id, number, name, sms_campaign_category_id, employeeAttendanceSmsTemplate, checkedItemsData, startDatetime } = model;

    //             // Insert into the attendance table
    //             const insertQuery = 'INSERT INTO attendance (user_id, checktime, created_by, attendance_date, device_id, unique_id) VALUES (?, ?, ?, ?, ?, ?)';
    //             const insertedModel = await new Promise((resolve, reject) => {
    //                 connection.query(insertQuery, [user_id, checktime, created_by, attendance_date, device_id, unique_id], (error, result) => {
    //                     if (error) {
    //                         console.log(error);
    //                         reject(error);
    //                     } else {
    //                         resolve(result);
    //                     }
    //                 });
    //             });

    //             const attendance_id = insertedModel.insertId;
    //             results.push(insertedModel);

    //             // Insert into sms_campaign table
    //             const category = 'Enter Number';
    //             const total_number = 1;
    //             const one_time = 1;
    //             const status = 1; // Set status to 'pending'

    //             const campaignQuery = `INSERT INTO sms_campaign (name, category, created_by, total_number, one_time, status) VALUES (?, ?, ?, ?, ?, ?)`;
    //             const campaignParams = [name, category, created_by, total_number, one_time, status];

    //             campaignResult = await new Promise((resolve, reject) => {
    //                 connection.query(campaignQuery, campaignParams, (error, result) => {
    //                     if (error) {
    //                         return reject(error);
    //                     }
    //                     resolve(result);
    //                 });
    //             });

    //             const campaign_id = campaignResult.insertId;

    //             // Process each checked item
    //             // Iterate over the values of checkedItemsData object
    //             // Filter checkedItemsData to get unique user_id entries
    //             // const uniqueCheckedItemsData = Array.from(new Map(checkedItemsData.map(employee => [employee.user_id, employee])).values());
    //             for (const employee of checkedItemsData) {
    //                 const currentDate = new Date();
    //                 const date = currentDate.toLocaleDateString();
    //                 const smsTime = currentDate.toLocaleTimeString();

    //                 // Replace placeholders with actual data
    //                 let msg = employeeAttendanceSmsTemplate
    //                     .replace('[[company_name]]', checkedItemsData.company_name || 'No Company')
    //                     .replace('[[full_name]]', checkedItemsData.full_name)
    //                     .replace('[[employee_id]]', checkedItemsData.unique_id)
    //                     .replace('[[designation]]', checkedItemsData.designation_name)
    //                     .replace('[[date]]', date)
    //                     .replace('[[in_time]]', formatDateAmPm(startDatetime.datetime))
    //                     .replace('[[sms_time]]', smsTime);

    //                 // Insert into sms_campaign_log table
    //                 const eduQualificationQuery = `INSERT INTO sms_campaign_log (campaign_id, sender_id, number, message, message_id, user_id, campaign_category) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    //                 const eduQualificationParams = [campaign_id, created_by, number, msg, "message_id", checkedItemsData.user_id, sms_campaign_category_id];

    //                 eduQualificationResult = await new Promise((resolve, reject) => {
    //                     connection.query(eduQualificationQuery, eduQualificationParams, (error, result) => {
    //                         if (error) {
    //                             return reject(error);
    //                         }
    //                         resolve(result);
    //                     });
    //                 });

    //                 const edu_qualification_id = eduQualificationResult.insertId;

    //                 // Insert into attendance_sms table
    //                 const attendanceSmsQuery = `INSERT INTO attendance_sms (attendance_id, sms_campaign_log_id) VALUES (?, ?)`;
    //                 const attendanceSmsParams = [attendance_id, edu_qualification_id];
    //                 await new Promise((resolve, reject) => {
    //                     connection.query(attendanceSmsQuery, attendanceSmsParams, (error) => {
    //                         if (error) {
    //                             return reject(error);
    //                         }
    //                         resolve();
    //                     });
    //                 });
    //             }

    //         }

    //         // Send response
    //         res.json({
    //             attendanceResults: results,
    //             campaignResult: campaignResult,
    //             sms_campaign_log: eduQualificationResult
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // },
    attendance_create: async (req, res) => {

        try {
            const models = req.body;
            const results = [];
            let campaignResult; // Initialize campaignResult here
            let eduQualificationResult; // Initialize eduQualificationResult here

            const formatDateAmPm = (inputDate) => {
                const date = new Date(inputDate);

                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');

                let hours = date.getUTCHours();
                const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';

                hours = hours % 12;
                hours = hours ? String(hours).padStart(2, '0') : '12'; // the hour '0' should be '12'

                return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
            };

            for (const model of models) {
                const { user_id, checktime, created_by, attendance_date, device_id, unique_id, number, name, sms_campaign_category_id, employeeAttendanceSmsTemplate, checkedItemsData, startDatetime, withPresent } = model;

                // Insert into the attendance table
                const insertQuery = 'INSERT INTO attendance (user_id, checktime, created_by, attendance_date, device_id, unique_id) VALUES (?, ?, ?, ?, ?, ?)';
                const insertedModel = await new Promise((resolve, reject) => {
                    connection.query(insertQuery, [user_id, checktime, created_by, attendance_date, device_id, unique_id], (error, result) => {
                        if (error) {
                            console.log(error);
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                });

                const attendance_id = insertedModel.insertId;
                results.push(insertedModel);


                if (withPresent === true) {


                    // Insert into sms_campaign table
                    const category = 'Enter Number';
                    const total_number = 1;
                    const one_time = 1;
                    const status = 1; // Set status to 'pending'

                    const campaignQuery = `INSERT INTO sms_campaign (name, category, created_by, total_number, one_time, status) VALUES (?, ?, ?, ?, ?, ?)`;
                    const campaignParams = [name, category, created_by, total_number, one_time, status];

                    campaignResult = await new Promise((resolve, reject) => {
                        connection.query(campaignQuery, campaignParams, (error, result) => {
                            if (error) {
                                return reject(error);
                            }
                            resolve(result);
                        });
                    });

                    const campaign_id = campaignResult.insertId;
                    const checkedItemsArray = Array.isArray(checkedItemsData) ? checkedItemsData : [checkedItemsData];
                    // Process each checked item
                    for (const employee of checkedItemsArray) {
                        const currentDate = new Date();
                        const date = currentDate.toLocaleDateString();
                        const smsTime = currentDate.toLocaleTimeString();

                        // Replace placeholders with actual data
                        let msg = employeeAttendanceSmsTemplate
                            .replace('[[company_name]]', employee.company_name || 'No Company')
                            .replace('[[full_name]]', employee.full_name)
                            .replace('[[employee_id]]', employee.unique_id)
                            .replace('[[designation]]', employee.designation_name)
                            .replace('[[date]]', date)
                            .replace('[[in_time]]', formatDateAmPm(startDatetime.datetime))
                            .replace('[[sms_time]]', smsTime);

                        // Insert into sms_campaign_log table
                        const eduQualificationQuery = `INSERT INTO sms_campaign_log (campaign_id, sender_id, number, message, message_id, user_id, campaign_category) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                        const eduQualificationParams = [campaign_id, created_by, number, msg, "message_id", employee.user_id, sms_campaign_category_id];

                        eduQualificationResult = await new Promise((resolve, reject) => {
                            connection.query(eduQualificationQuery, eduQualificationParams, (error, result) => {
                                if (error) {
                                    return reject(error);
                                }
                                resolve(result);
                            });
                        });

                        const edu_qualification_id = eduQualificationResult.insertId;

                        // Insert into attendance_sms table
                        const attendanceSmsQuery = `INSERT INTO attendance_sms (attendance_id, sms_campaign_log_id) VALUES (?, ?)`;
                        const attendanceSmsParams = [attendance_id, edu_qualification_id];
                        await new Promise((resolve, reject) => {
                            connection.query(attendanceSmsQuery, attendanceSmsParams, (error) => {
                                if (error) {
                                    return reject(error);
                                }
                                resolve();
                            });
                        });
                    }
                }

            }

            // Send response
            res.json({
                attendanceResults: results,
                campaignResult: campaignResult,
                sms_campaign_log: eduQualificationResult
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },



    absent_create: async (req, res) => {


        try {
            const models = req.body;
            const results = [];
            let campaignResult; // Initialize campaignResult here
            let eduQualificationResult; // Initialize eduQualificationResult here


            for (const model of models) {
                const { user_id, checktime, created_by, attendance_date, device_id, unique_id, number, name, sms_campaign_category_id, employeeAttendanceSmsTemplate, checkedItemsData, withAbsent } = model;

                // Insert into the attendance table
                const insertQuery = 'INSERT INTO absent (user_id, checktime, created_by, absent_date, device_id, unique_id) VALUES (?, ?, ?, ?, ?, ?)';
                const insertedModel = await new Promise((resolve, reject) => {
                    connection.query(insertQuery, [user_id, checktime, created_by, attendance_date, device_id, unique_id], (error, result) => {
                        if (error) {
                            console.log(error);
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                });

                const attendance_id = insertedModel.insertId;
                results.push(insertedModel);
                if (withAbsent === true) {


                    // Insert into sms_campaign table
                    const category = 'Enter Number';
                    const total_number = 1;
                    const one_time = 1;
                    const status = 1; // Set status to 'pending'

                    const campaignQuery = `INSERT INTO sms_campaign (name, category, created_by, total_number, one_time, status) VALUES (?, ?, ?, ?, ?, ?)`;
                    const campaignParams = [name, category, created_by, total_number, one_time, status];

                    campaignResult = await new Promise((resolve, reject) => {
                        connection.query(campaignQuery, campaignParams, (error, result) => {
                            if (error) {
                                return reject(error);
                            }
                            resolve(result);
                        });
                    });

                    const campaign_id = campaignResult.insertId;
                    const checkedItemsArray = Array.isArray(checkedItemsData) ? checkedItemsData : [checkedItemsData];
                    // Process each checked item
                    for (const employee of checkedItemsArray) {
                        const currentDate = new Date();
                        const date = currentDate.toLocaleDateString();
                        const smsTime = currentDate.toLocaleTimeString();

                        // Replace placeholders with actual data
                        let msg = employeeAttendanceSmsTemplate
                            .replace('[[company_name]]', employee.company_name || 'No Company')
                            .replace('[[full_name]]', employee.full_name)
                            .replace('[[employee_id]]', employee.unique_id)
                            .replace('[[designation]]', employee.designation_name)
                            .replace('[[date]]', date)
                            .replace('[[sms_time]]', smsTime);


                        // Insert into sms_campaign_log table
                        const eduQualificationQuery = `INSERT INTO sms_campaign_log (campaign_id, sender_id, number, message, message_id, user_id, campaign_category) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                        const eduQualificationParams = [campaign_id, created_by, number, msg, "message_id", employee.user_id, sms_campaign_category_id];

                        eduQualificationResult = await new Promise((resolve, reject) => {
                            connection.query(eduQualificationQuery, eduQualificationParams, (error, result) => {
                                if (error) {
                                    return reject(error);
                                }
                                resolve(result);
                            });
                        });

                        const edu_qualification_id = eduQualificationResult.insertId;

                        // Insert into attendance_sms table
                        const attendanceSmsQuery = `INSERT INTO absent_sms (user_id, absent_id, sms_campaign_log_id) VALUES (?, ?, ?)`;
                        const attendanceSmsParams = [employee.user_id, attendance_id, edu_qualification_id];
                        await new Promise((resolve, reject) => {
                            connection.query(attendanceSmsQuery, attendanceSmsParams, (error) => {
                                if (error) {
                                    return reject(error);
                                }
                                resolve();
                            });
                        });
                    }
                }

            }

            // Send response
            res.json({
                attendanceResults: results,
                campaignResult: campaignResult,
                sms_campaign_log: eduQualificationResult
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }




    },


    sms_campaign_category_list: async (req, res) => {
        try {
            const data = "select * from  sms_campaign_category";

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




    //     absent_create_manual_attendance: async (req, res) => {
    //     try {

    //         const start = new Date();
    //         const dataError = [];

    //         if (req.method === 'GET') {
    //             // Increase memory limit if necessary (handled in server configs generally)

    //             // Fetch SMS settings
    //             const [smsSettingsRows] = await connection.query('SELECT * FROM sms_settings WHERE id = 1');
    //             const smsSettings = smsSettingsRows[0];

    //             // Check for holiday
    //             const attendanceDate = new Date().toISOString().split('T')[0];
    //             const [holidayRows] = await connection.query('SELECT * FROM holidays WHERE holiday_date = ?', [attendanceDate]);
    //             const holidayCount = holidayRows.length;

    //             if (holidayCount > 0) {
    //                 const holidayData = holidayRows[0];
    //                 const msg = `Today ${attendanceDate}, ${holidayData.holiday_name} is a holiday. You can't take attendance today.`;
    //                 dataError.push({ holiday_msg: msg });
    //             } else if (smsSettings.te_absent_shift && smsSettings.te_absent_shift_enable === 1) {
    //                 // Fetch leave-approved users
    //                 const [lvApplicationRows] = await connection.query(`
    //                     SELECT GROUP_CONCAT(whose_leave) as user_id
    //                     FROM leave_application
    //                     LEFT JOIN leave_application_date ON leave_application.id = leave_application_date.leave_application_id
    //                     WHERE leave_application.application_status = 2
    //                     AND leave_application_date.leave_date = ?`, [attendanceDate]);
    //                 const lvUsersId = lvApplicationRows[0].user_id || '';

    //                 // Fetch attendance users
    //                 const [attendanceRows] = await connection.query(`
    //                     SELECT GROUP_CONCAT(DISTINCT user_id) as att_user_id
    //                     FROM attendance
    //                     WHERE attendance_date = ?`, [attendanceDate]);
    //                 const attUsersId = attendanceRows[0].att_user_id || '';

    //                 // Combine leave and attendance users
    //                 const notInUsers = [lvUsersId, attUsersId].filter(Boolean).join(',');

    //                 // Fetch absent users
    //                 const whereClause = notInUsers
    //                     ? `users.status = 1 AND users.role_name IN (4, 10) AND users.id NOT IN (${notInUsers})`
    //                     : `users.status = 1 AND users.role_name IN (4, 10)`;

    //                 const [absentRows] = await connection.query(`
    //                     SELECT GROUP_CONCAT(id) as user_id FROM users WHERE ${whereClause}`);
    //                 const absentUsersId = absentRows[0].user_id || '';
    //                 const absentIdArr = absentUsersId.split(',');

    //                 if (absentIdArr.length > 0) {
    //                     const currentTime = new Date().toLocaleTimeString();
    //                     const data4 = [];

    //                     for (let userId of absentIdArr) {
    //                         // Check if the user is already marked as absent
    //                         const [absentExistsRows] = await connection.query(`
    //                             SELECT user_id FROM absent WHERE absent_date = ? AND user_id = ?`, [attendanceDate, userId]);
    //                         const absentExistsCount = absentExistsRows.length;

    //                         if (absentExistsCount === 0) {
    //                             // Fetch user shift
    //                             const [shiftRows] = await connection.query(`
    //                                 SELECT school_shift_id FROM teacher_admission WHERE user_id = ?`, [userId]);
    //                             const userShift = shiftRows[0].school_shift_id;
    //                             const userShiftArr = userShift.split(',');

    //                             if (smsSettings.te_one_time === 1) {
    //                                 // Fetch max late time and end time for the shift
    //                                 const [lateTimeRows] = await connection.query(`
    //                                     SELECT MAX(late_time) as max_late_time, MAX(end_time) as max_end_time
    //                                     FROM school_shift WHERE id IN (${userShift})`);
    //                                 const maxLateTime = lateTimeRows[0].max_late_time;
    //                                 const maxEndTime = lateTimeRows[0].max_end_time;

    //                                 if (currentTime > maxLateTime && currentTime < maxEndTime) {
    //                                     data4.push({
    //                                         user_id: userId,
    //                                         created_by: null,
    //                                         absent_date: attendanceDate,
    //                                         device_id: 'Online'
    //                                     });
    //                                 } else {
    //                                     dataError.push({ late_time_condition: 'Max late time and end time not matched.' });
    //                                 }
    //                             } else {
    //                                 for (let shiftId of userShiftArr) {
    //                                     const [lateTimeRows] = await connection.query(`
    //                                         SELECT MAX(late_time) as max_late_time, MAX(end_time) as max_end_time
    //                                         FROM school_shift WHERE id = ?`, [shiftId]);
    //                                     const maxLateTime = lateTimeRows[0].max_late_time;
    //                                     const maxEndTime = lateTimeRows[0].max_end_time;

    //                                     if (currentTime > maxLateTime && currentTime < maxEndTime) {
    //                                         data4.push({
    //                                             user_id: userId,
    //                                             created_by: null,
    //                                             absent_date: attendanceDate,
    //                                             device_id: 'Online',
    //                                             shift_id: shiftId
    //                                         });
    //                                     }
    //                                 }
    //                             }
    //                         } else {
    //                             dataError.push({ absent_exists: `Absence already exists for user_id ${userId}` });
    //                         }
    //                     }

    //                     if (data4.length > 0) {
    //                         await connection.query('INSERT INTO absent (user_id, created_by, absent_date, device_id, shift_id) VALUES ?', [data4.map(item => [item.user_id, item.created_by, item.absent_date, item.device_id, item.shift_id])]);

    //                         // Send SMS (similar logic as in PHP function)
    //                         // Example: await sendAbsenceSms(absentUsersId, attendanceDate);
    //                     } else {
    //                         dataError.push({ absent_msg: 'Absent data array is empty' });
    //                     }
    //                 } else {
    //                     dataError.push({ absent_count_msg: 'Absent count is 0' });
    //                 }
    //             } else {
    //                 dataError.push({ sms_setting_msg: 'SMS settings teacher employee absent shift not selected.' });
    //             }
    //         } else {
    //             dataError.push({ request_msg: 'Not a GET request' });
    //         }

    //         const end = new Date();
    //         const diffSeconds = Math.abs(end - start) / 1000;
    //         dataError.push({ api_exec_time: `${diffSeconds} seconds` });

    //         return res.json(dataError);
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // },




    absent_create_manual_attendance: async (req, res) => {
        try {

            const start = new Date();
            const dataError = [];


            // Increase memory limit if necessary (handled in server configs generally)

            // Fetch SMS settings
            connection.query('SELECT * FROM sms_settings WHERE id = 1', (err, smsSettingsRows) => {
                if (err) throw err;
                const smsSettings = smsSettingsRows;

                // Check for holiday
                const attendanceDate = new Date().toISOString().split('T')[0];
                connection.query(`SELECT * FROM yearly_holiday WHERE start_date = ${attendanceDate}`, (err, holidayRows) => {
                    if (err) throw err;
                    const holidayCount = holidayRows.length;

                    if (holidayRows.start_date == attendanceDate) {
                        const holidayData = holidayRows;
                        const msg = `Today ${attendanceDate}, ${holidayData.holiday_name} is a holiday. You can't take attendance today.`;
                        return dataError.push({ holiday_msg: msg });
                    } else if (smsSettings.te_absent_shift && smsSettings.te_absent_shift_enable === 1) {
                        // Fetch leave-approved users
                        connection.query(`
                            SELECT GROUP_CONCAT(whose_leave) as user_id
                            FROM leave_application
                            LEFT JOIN leave_application_date ON leave_application.id = leave_application_date.leave_application_id
                            WHERE leave_application.application_status = 2
                            AND leave_application_date.leave_date = ?`, attendanceDate, (err, lvApplicationRows) => {
                            if (err) throw err;
                            const lvUsersId = lvApplicationRows.user_id || '';

                            // Fetch attendance users
                            connection.query(`
                                SELECT GROUP_CONCAT(DISTINCT user_id) as att_user_id
                                FROM attendance
                                WHERE attendance_date = ?`, attendanceDate, (err, attendanceRows) => {
                                if (err) throw err;
                                const attUsersId = attendanceRows.att_user_id || '';

                                // Combine leave and attendance users
                                const notInUsers = [lvUsersId, attUsersId].filter(Boolean).join(',');

                                // Fetch absent users
                                const whereClause = notInUsers
                                    ? `users.status = 1 AND users.role_name IN ( 10) AND users.id NOT IN (${notInUsers})`
                                    : `users.status = 1 AND users.role_name IN ( 10)`;

                                connection.query(`
                                    SELECT GROUP_CONCAT(id) as user_id FROM users WHERE ${whereClause}`, (err, absentRows) => {
                                    if (err) throw err;
                                    const absentUsersId = absentRows.user_id || '';
                                    const absentIdArr = absentUsersId.split(',');

                                    if (absentIdArr.length > 0) {
                                        const currentTime = new Date().toLocaleTimeString();
                                        const data4 = [];

                                        absentIdArr.forEach(userId => {
                                            // Check if the user is already marked as absent
                                            connection.query(`
                                                SELECT user_id FROM absent WHERE absent_date = ? AND user_id = ?`, [attendanceDate, userId], (err, absentExistsRows) => {
                                                if (err) throw err;
                                                const absentExistsCount = absentExistsRows.length;

                                                if (absentExistsCount === 0) {
                                                    // Fetch user shift
                                                    connection.query(`
                                                        SELECT school_shift_id FROM employee_promotion WHERE user_id = ?`, [userId], (err, shiftRows) => {
                                                        if (err) throw err;
                                                        const userShift = shiftRows.school_shift_id;
                                                        const userShiftArr = userShift;

                                                        if (smsSettings.te_one_time === 1) {
                                                            // Fetch max late time and end time for the shift
                                                            connection.query(`
                                                                SELECT MAX(late_time) as max_late_time, MAX(end_time) as max_end_time
                                                                FROM school_shift WHERE id IN (${userShift})`, (err, lateTimeRows) => {
                                                                if (err) throw err;
                                                                const maxLateTime = lateTimeRows.max_late_time;
                                                                const maxEndTime = lateTimeRows.max_end_time;

                                                                if (currentTime > maxLateTime && currentTime < maxEndTime) {
                                                                    data4.push({
                                                                        user_id: userId,
                                                                        created_by: null,
                                                                        absent_date: attendanceDate,
                                                                        device_id: 'Online'
                                                                    });
                                                                } else {
                                                                    return dataError.push({ late_time_condition: 'Max late time and end time not matched.' });
                                                                }
                                                            });
                                                        } else {
                                                            userShiftArr.forEach(shiftId => {
                                                                connection.query(`
                                                                    SELECT MAX(late_time) as max_late_time, MAX(end_time) as max_end_time
                                                                    FROM school_shift WHERE id = ?`, [shiftId], (err, lateTimeRows) => {
                                                                    if (err) throw err;
                                                                    const maxLateTime = lateTimeRows[0].max_late_time;
                                                                    const maxEndTime = lateTimeRows[0].max_end_time;

                                                                    if (currentTime > maxLateTime && currentTime < maxEndTime) {
                                                                        data4.push({
                                                                            user_id: userId,
                                                                            created_by: null,
                                                                            absent_date: attendanceDate,
                                                                            device_id: 'Online',
                                                                            shift_id: shiftId
                                                                        });
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    });
                                                } else {
                                                    return dataError.push({ absent_exists: `Absence already exists for user_id ${userId}` });
                                                }
                                            });
                                        });

                                        if (data4.length > 0) {
                                            connection.query('INSERT INTO absent (user_id, created_by, absent_date, device_id, shift_id) VALUES ?', [data4.map(item => [item.user_id, item.created_by, item.absent_date, item.device_id, item.shift_id])], (err) => {
                                                if (err) throw err;
                                                sendAbsenceSms(absentUsersId, attendanceDate);
                                                // Send SMS (similar logic as in PHP function)
                                                // Example: sendAbsenceSms(absentUsersId, attendanceDate);
                                            });
                                        } else {
                                            return dataError.push({ absent_msg: 'Absent data array is empty' });
                                        }
                                    } else {
                                        return dataError.push({ absent_count_msg: 'Absent count is 0' });
                                    }
                                });
                            });
                        });
                    }
                    else {
                        return dataError.push({ not_found: 'not found' });
                    }
                });
            });


            const end = new Date();
            const diffSeconds = Math.abs(end - start) / 1000;
            dataError.push({ api_exec_time: `${diffSeconds} seconds` });

            return res.json(dataError);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    
    sendAbsenceSms: async (userIds, date) => {
        try {

            // Replace with your SMS API endpoint and API key
            const smsApiUrl = 'https://quicksmsapp.com/Api/sms/campaign_api';
            const apiKey = '7ae89887eac6055a2b9adc494ca3b902';

            // Format your message
            const message = `Dear User, you were marked absent on ${date}. Please contact HR for more details.`;

            // Prepare request payload
            const payload = {
                api_key: apiKey,
                recipients: userIds.split(','),
                message: message
            };

            // Send SMS request
            const response = await axios.post(smsApiUrl, payload);

            // Check response
            if (response.data.status === 'success') {
                console.log('SMS sent successfully');
            } else {
                console.error('SMS sending failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error sending SMS:', error.message);
        }
    },







}

module.exports = AttendanceModel




