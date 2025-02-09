

const connection = require('../../../../connection/config/database')


const SalaryModel = {




    employe_joining_list_salary: async (req, res) => {
        try {
            const data = `
            SELECT ej.*, 
                   p.basic AS salary, 
                   d.designation_name,
                   u.full_name AS employee_name,
                   ep.designation_id_promotion,
                   dp.designation_name AS designation_name_promotion,
                   pp.title AS Payroll
            FROM employe_joining ej
            LEFT JOIN payroll p ON ej.payroll_id = p.id
            LEFT JOIN designation d ON ej.designation_id = d.id
            LEFT JOIN users u ON ej.user_id = u.id
            LEFT JOIN (
                SELECT user_id, MAX(designation_id) AS designation_id_promotion
                FROM employee_promotion
                GROUP BY user_id
            ) ep ON ej.user_id = ep.user_id
            LEFT JOIN designation dp ON ep.designation_id_promotion = dp.id
            LEFT JOIN (
                SELECT ep2.user_id, p2.title
                FROM employee_promotion ep2
                JOIN payroll p2 ON ep2.payroll_id = p2.id
                JOIN (
                    SELECT user_id, MAX(designation_id) AS max_designation_id
                    FROM employee_promotion
                    GROUP BY user_id
                ) ep_max ON ep2.user_id = ep_max.user_id AND ep2.designation_id = ep_max.max_designation_id
            ) pp ON ej.user_id = pp.user_id
            `;

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



    employee_salary_update: async (req, res) => {
        try {

            const { salary_month, salary_date, due, paid_amount, paid_by, modified_by } = req.body;


            const query = `UPDATE salary SET   salary_month = ?, salary_date = ?, due = ?, paid_amount = ?, paid_by = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [salary_month, salary_date, due, paid_amount, paid_by, modified_by, req.params.id], (error, result) => {
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

    employe_attendance_list: async (req, res) => {
        try {
            const data = `SELECT a.*
            FROM attendance a
            INNER JOIN (
                SELECT user_id, DATE(checktime) as date, MIN(checktime) as checktime
                FROM attendance
                GROUP BY user_id, DATE(checktime)
            ) b
            ON a.user_id = b.user_id AND DATE(a.checktime) = b.date AND a.checktime = b.checktime`;

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


    salary_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM salary WHERE id = ?';
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

    employe_leave_approved_list: async (req, res) => {
        try {
            const data = `SELECT * from leave_approved`;

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

    employe_joining_list_salary_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { designation } = req.body;

            // Construct the base SQL query
            let sql = `
            SELECT ej.*, 
                   p.basic AS salary, 
                   d.designation_name,
                   u.full_name AS employee_name,
                   u.unique_id AS unique_id,
                   u.mobile AS mobile,
                   ep.designation_id_promotion,
                   dp.designation_name AS designation_name_promotion,
                   pp.title AS Payroll
            FROM employe_joining ej
            LEFT JOIN payroll p ON ej.payroll_id = p.id
            LEFT JOIN designation d ON ej.designation_id = d.id
            LEFT JOIN users u ON ej.user_id = u.id
            LEFT JOIN (
                SELECT user_id, MAX(designation_id) AS designation_id_promotion
                FROM employee_promotion
                GROUP BY user_id
            ) ep ON ej.user_id = ep.user_id
            LEFT JOIN designation dp ON ep.designation_id_promotion = dp.id
            LEFT JOIN (
                SELECT ep2.user_id, p2.title
                FROM employee_promotion ep2
                JOIN payroll p2 ON ep2.payroll_id = p2.id
                JOIN (
                    SELECT user_id, MAX(designation_id) AS max_designation_id
                    FROM employee_promotion
                    GROUP BY user_id
                ) ep_max ON ep2.user_id = ep_max.user_id AND ep2.designation_id = ep_max.max_designation_id
            ) pp ON ej.user_id = pp.user_id 
            WHERE 1=1`;

            const queryParams = [];

            if (designation) {
                sql += ` AND ep.designation_id_promotion = ?`;
                queryParams.push(designation);
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

    // original start
    // salary_create: async (req, res) => {
    //     try {
    //         const periods = req.body;
    //         const results = [];

    //         for (const period of periods) {
    //             const { user_id, salary_month, salary_date, created_by, due, paid_amount, paid_by } = period;

    //             const insertQuery = 'INSERT INTO salary (user_id, salary_month, salary_date, created_by, due, paid_amount, paid_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
    //             const insertedperiod = await new Promise((resolve, reject) => {
    //                 connection.query(insertQuery, [user_id, salary_month, salary_date, created_by, due, paid_amount, paid_by], (error, result) => {
    //                     if (error) {
    //                         console.log(error);
    //                         reject(error);
    //                     }
    //                     resolve(result);
    //                 });
    //             });

    //             console.log(insertedperiod);
    //             results.push(insertedperiod);

    //         }

    //         res.send(results);
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // },


    salary_create: async (req, res) => {

        try {
            const periods = req.body;
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

            for (const period of periods) {

                // const { user_id, checktime, created_by, attendance_date, device_id, unique_id, number, name, sms_campaign_category_id, employeeAttendanceSmsTemplate, checkedItemsData, startDatetime, withPresent } = model;


                const { user_id, salary_month, salary_date, created_by, due, paid_amount, paid_by, sms_campaign_category_id, name, employeeAttendanceSmsTemplate, checkedItemsData, number, employeeSalarySmsTemplate, sendSmsChecked } = period;

                const insertQuery = 'INSERT INTO salary (user_id, salary_month, salary_date, created_by, due, paid_amount, paid_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
                const insertedperiod = await new Promise((resolve, reject) => {
                    connection.query(insertQuery, [user_id, salary_month, salary_date, created_by, due, paid_amount, paid_by], (error, result) => {
                        if (error) {
                            console.log(error);
                            reject(error);
                        }
                        resolve(result);
                    });
                });


                const attendance_id = insertedperiod.insertId;
                results.push(insertedperiod);


                if (sendSmsChecked === true) {

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
                            .replace('[[full_name]]', employee.employee_name)
                            .replace('[[employee_id]]', employee.unique_id)
                            .replace('[[employee_designation]]', employee.designation_name_promotion)
                            .replace('[[joining_date]]', formatDateAmPm(employee.join_date))
                            .replace('[[payroll_name]]', employee.Payroll)
                            .replace('[[payroll_total]]', employee.salary)
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
                        const attendanceSmsQuery = `INSERT INTO salary_sms (user_id, salary_id, sms_campaign_log_id) VALUES (?, ?, ?)`;
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

    // original end

    // salary_create: async (req, res) => {

    //     try {
    //         const { user_id, salary_month, salary_date, created_by, due, paid_amount, paid_by } = req.body;


    //         // If material name doesn't exist, insert it
    //         const insertQuery = 'INSERT INTO salary (user_id, salary_month, salary_date, created_by, due,paid_amount,paid_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
    //         connection.query(
    //             insertQuery,
    //             [user_id, salary_month, salary_date, created_by, due, paid_amount, paid_by],
    //             (error, result) => {
    //                 if (error) {
    //                     console.log(error);
    //                     return res.status(500).json({ message: 'Internal Server Error' });
    //                 }
    //                 console.log(result);
    //                 return res.send(result);
    //             }
    //         );

    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }

    // },


    employe_list_salary: async (req, res) => {
        try {
            const data = `
            SELECT 
                salary.*, 
                emp_promotion.designation_id, 
                designation.designation_name, 
                creator.full_name AS created_by_name,
                employee.full_name AS employee_name
            FROM 
                salary 
            LEFT JOIN 
                employee_promotion emp_promotion
            ON 
                salary.user_id = emp_promotion.user_id 
            LEFT JOIN 
                designation 
            ON 
                emp_promotion.designation_id = designation.id
            LEFT JOIN 
                users creator
            ON 
                salary.created_by = creator.id
            LEFT JOIN 
                users employee
            ON 
                salary.user_id = employee.id
        `;

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

    employe_list_salary_single: async (req, res) => {
        try {
            const userId = req.params.id;  // Assuming the id is passed as a URL parameter
            const data = `
             SELECT 
            salary.*, 
            emp_promotion.designation_id, 
            designation.designation_name, 
            creator.full_name AS created_by_name,
            employee.full_name AS employee_name,
            DAY(LAST_DAY(salary.salary_month)) AS totalDays
        FROM 
            salary 
        LEFT JOIN 
            employee_promotion emp_promotion
        ON 
            salary.user_id = emp_promotion.user_id 
        LEFT JOIN 
            designation 
        ON 
            emp_promotion.designation_id = designation.id
        LEFT JOIN 
            users creator
        ON 
            salary.created_by = creator.id
        LEFT JOIN 
            users employee
        ON 
            salary.user_id = employee.id
        WHERE 
            salary.id = ?
            `;

            connection.query(data, [userId], function (error, result) {
                console.log(result);
                if (!error) {
                    res.send(result);
                } else {
                    console.log(error);
                    res.status(500).send('Error occurred while fetching salary details');
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Server error');
        }
    },

    employe_list_salary_single_search: async (req, res) => {
        try {
            const userId = req.params.id; // Assuming the id is passed as a URL parameter
            const data = `
                SELECT ej.*, 
                       p.basic AS salary, 
                       d.designation_name,
                       u.full_name AS employee_name,
                       ep.designation_id_promotion,
                       dp.designation_name AS designation_name_promotion,
                       pp.title AS Payroll
                       
                FROM employe_joining ej
                LEFT JOIN payroll p ON ej.payroll_id = p.id
                LEFT JOIN designation d ON ej.designation_id = d.id
                LEFT JOIN users u ON ej.user_id = u.id
                LEFT JOIN (
                    SELECT user_id, MAX(designation_id) AS designation_id_promotion
                    FROM employee_promotion
                    GROUP BY user_id
                ) ep ON ej.user_id = ep.user_id
                LEFT JOIN designation dp ON ep.designation_id_promotion = dp.id
                LEFT JOIN (
                    SELECT ep2.user_id, p2.title
                    FROM employee_promotion ep2
                    JOIN payroll p2 ON ep2.payroll_id = p2.id
                    JOIN (
                        SELECT user_id, MAX(designation_id) AS max_designation_id
                        FROM employee_promotion
                        GROUP BY user_id
                    ) ep_max ON ep2.user_id = ep_max.user_id AND ep2.designation_id = ep_max.max_designation_id
                ) pp ON ej.user_id = pp.user_id
                WHERE ej.user_id = ?
            `;

            connection.query(data, [userId], function (error, result) {
                if (error) {
                    console.error('Database query error:', error);
                    res.status(500).send('Error occurred while fetching salary details');
                    return;
                }
                res.send(result);
            });
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).send('Server error');
        }
    },




    // employe_list_salary_search: async (req, res) => {
    //     try {
    //         const data = `
    //         SELECT 
    //             salary.*, 
    //             emp_promotion.designation_id, 
    //             designation.designation_name, 
    //             creator.full_name AS created_by_name,
    //             employee.full_name AS employee_name
    //         FROM 
    //             salary 
    //         LEFT JOIN 
    //             employee_promotion emp_promotion
    //         ON 
    //             salary.user_id = emp_promotion.user_id 
    //         LEFT JOIN 
    //             designation 
    //         ON 
    //             emp_promotion.designation_id = designation.id
    //         LEFT JOIN 
    //             users creator
    //         ON 
    //             salary.created_by = creator.id
    //         LEFT JOIN 
    //             users employee
    //         ON 
    //             salary.user_id = employee.id
    //     `;

    //         connection.query(data, function (error, result) {
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

    employe_list_salary_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { designation, month } = req.body;

            // Construct the base SQL query
            let sql = `
            SELECT 
                salary.*, 
                emp_promotion.designation_id, 
                designation.designation_name, 
                creator.full_name AS created_by_name,
                employee.full_name AS employee_name
            FROM 
                salary 
            LEFT JOIN 
                employee_promotion emp_promotion
            ON 
                salary.user_id = emp_promotion.user_id 
            LEFT JOIN 
                designation 
            ON 
                emp_promotion.designation_id = designation.id
            LEFT JOIN 
                users creator
            ON 
                salary.created_by = creator.id
            LEFT JOIN 
                users employee
            ON 
                salary.user_id = employee.id 
            WHERE 1=1`;

            const queryParams = [];

            if (designation) {
                sql += ` AND emp_promotion.designation_id = ?`;
                queryParams.push(designation);
            }
            if (month) {
                sql += ` AND DATE_FORMAT(salary.salary_month, '%Y-%m') = ?`;
                queryParams.push(month);
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


}

module.exports = SalaryModel