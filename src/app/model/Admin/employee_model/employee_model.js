const { default: axios } = require('axios');
const connection = require('../../../../connection/config/database')
const crypto = require('crypto');
var wkhtmltopdf = require('wkhtmltopdf');
var fs = require("fs");

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";
const formatString = (str) => {
    const words = str?.split('_');

    const formattedWords = words?.map((word) => {
        const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        return capitalizedWord;
    });

    return formattedWords?.join(' ');
};
const EmployeeModel = {

    school_shiftt_create: async (req, res) => {
        try {
            const { name, start_time, late_time, end_time, early_end_time, created_by } = req.body;

            // Using parameterized query to prevent SQL injection
            const insertQuery = 'INSERT INTO school_shift (name, start_time, late_time, end_time, early_end_time, created_by) VALUES (?, ?, ?, ?, ?, ?)';
            const result = await connection.query(insertQuery, [name, start_time, late_time, end_time, early_end_time, created_by]);

            // Sending only the necessary data from the result object
            const { insertId, affectedRows } = result;

            // Sending response with relevant data
            res.status(200).json({ insertId, affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },


    education_name_list: async (req, res) => {
        try {
            const data = "SELECT * FROM education";

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
    divisions_list: async (req, res) => {
        try {
            const data = "select * from  divisions";

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

    districts_list: async (req, res) => {
        try {
            const data = "select * from  districts";

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

    upazilas_list: async (req, res) => {
        try {
            const data = "select * from  upazilas";

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

    school_shift_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM school_shift WHERE id = ?';
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


    school_shift_update: async (req, res) => {
        try {

            const { name, start_time, late_time, end_time, early_end_time, modified_by } = req.body;


            const query = `UPDATE school_shift SET   name = ?, start_time = ?, late_time = ?, end_time = ?, early_end_time = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [name, start_time, late_time, end_time, early_end_time, modified_by, req.params.id], (error, result) => {
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


    school_shift_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM school_shift WHERE id = ?';
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

    employee_delete: async (req, res) => {

        try {
            const query = `
            DELETE emp_joining
            FROM employe_joining AS emp_joining
            LEFT JOIN living_address AS living ON emp_joining.user_id = living.user_id
            LEFT JOIN parmanent_address AS permanent ON emp_joining.user_id = permanent.user_id
            LEFT JOIN employe_info AS emp_info ON emp_joining.user_id = emp_info.user_id
            WHERE emp_joining.user_id = ?
            
          `;
        //   AND (living.user_id IS NULL OR permanent.user_id IS NULL OR emp_info.user_id IS NULL)
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
    // create_employee

    // employee_list: async (req, res) => {

    //     try {
    //         const data = "select * from  employe_joining";

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

    // employee_list: async (req, res) => {
    //     try {
    //         const data = "SELECT e.*, u.full_name, p.title, s.name AS school_shift_name FROM employe_joining e LEFT JOIN users u ON e.user_id = u.id  LEFT JOIN payroll p ON e.payroll_id = p.id LEFT JOIN school_shift s ON e.school_shift_id = s.id";

    //         connection.query(data, function (error, result) {
    //             if (!error) {
    //                 res.send(result);
    //             } else {
    //                 console.log(error);
    //                 res.status(500).send('Internal Server Error');
    //             }
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).send('Internal Server Error');
    //     }
    // },

    employee_all: async (req, res) => {
        try {
            const employeeDataQuery = `
            SELECT 
                ei.*, 
                ei.experience, 
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
                u.signature_image,
                u.photo
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
            WHERE
                ei.user_id = u.id
                `;
            connection.query(employeeDataQuery, async (err, results) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Failed to fetch employee data' });
                    return;
                }
                res.status(200).json(results);
            });
        } catch (error) {
            console.error("Error fetching employee data:", error);
            res.status(500).json({ message: "Error fetching employee data" });
        }
    },


    employee_all_list: async (req, res) => {
        try {
            const employeeDataQuery = `
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
           
            `;

            connection.query(employeeDataQuery, async (err, results) => {
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
            console.error("Error fetching employee data:", error);
            res.status(500).json({ message: "Error fetching employee data" });
        }
    },



    employee_all_list_settings: async (req, res) => {
        try {
            const employeeDataQuery = `
                 SELECT 
                ej.join_date AS join_date,
                d.designation_name,
                u.full_name,
                u.gender,
                u.religion,
                u.mobile,
                u.unique_id,
                u.email,
                u.photo,
                b.branch_name AS branch_name,              -- Get branch name
                p.title AS payroll_name,                   -- Get payroll name
                ss.name AS school_shift_name                -- Get school shift name
            FROM 
                employe_joining ej 
           LEFT JOIN 
                employee_promotion ep ON ej.user_id = ep.user_id
            LEFT JOIN 
                users u ON ej.user_id = u.id
            LEFT JOIN 
                designation d ON ep.designation_id = d.id
           LEFT JOIN 
                branch_info b ON ep.branch_id = b.id         -- Join branch_info to get branch_name
           LEFT JOIN 
                payroll p ON ej.payroll_id = p.id            -- Join payroll to get payroll_name
           LEFT JOIN 
                school_shift ss ON ej.school_shift_id = ss.id -- Join school_shift to get school_shift_name
            WHERE
                ej.user_id IN (SELECT DISTINCT user_id FROM employe_joining)
            `;
            connection.query(employeeDataQuery, async (err, results) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Failed to fetch employee data' });
                    return;
                }
                res.status(200).json(results);
            });
        } catch (error) {
            console.error("Error fetching employee data:", error);
            res.status(500).json({ message: "Error fetching employee data" });
        }
    },




    employee_all_list_single: async (req, res) => {

        const { id } = req.params; // Destructure id from req.params

        try {
            const employeeDataQuery = `
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
                u.signature_image,
                u.photo
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
            WHERE
                ei.user_id = ?
            `;

            connection.query(employeeDataQuery, [id], async (err, results) => {
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
            console.error("Error fetching employee data:", error);
            res.status(500).json({ message: "Error fetching employee data" });
        }
    },




    // employee_all_single: async (req, res) => {
    //     try {
    //         const employeeId = req.params.id; // Assuming the ID is passed as a parameter

    //         const employeeDataQuery = `
    //         SELECT 
    //             ei.*, 
    //             ei.experience, 
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
    //             ej.branch_id AS branch_id,
    //             ep.designation_id AS designation_id,
    //               d.designation_name,
    //             u.full_name,
    //              u.father_name,
    //             u.mother_name,
    //             u.dob,
    //             u.gender,
    //             u.religion,
    //             u.mobile,
    //             u.email,
    //             u.password,
    //             u.signature_image,
    //             u.photo
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
    //                 LEFT JOIN 
    //             designation d ON ep.designation_id = d.id
    //         WHERE
    //             ei.user_id = ?`;

    //         connection.query(employeeDataQuery, [employeeId], async (err, results) => {
    //             if (err) {
    //                 console.error(err);
    //                 res.status(500).json({ message: 'Failed to fetch employee data' });
    //                 return;
    //             }
    //             if (results.length === 0) {
    //                 res.status(404).json({ message: 'Employee not found' });
    //                 return;
    //             }
    //             res.status(200).json(results[0]); // Assuming you only expect one result for a given ID
    //         });
    //     } catch (error) {
    //         console.error("Error fetching employee data:", error);
    //         res.status(500).json({ message: "Error fetching employee data" });
    //     }
    // },

    // employee_all_single: async (req, res) => {
    //     try {
    //         const employeeId = req.params.id; // Assuming the ID is passed as a parameter

    //         const employeeDataQuery = `
    //             SELECT 
    //                 ei.*, 
    //                 la.division_id AS living_division_id,
    //                 la.same_as AS same_as,
    //                 la.district_id AS living_district_id,
    //                 la.upazila_id AS living_upazila_id,
    //                 la.address AS living_address,
    //                 pa.division_id AS permanent_division_id,
    //                 pa.district_id AS permanent_district_id,
    //                 pa.upazila_id AS permanent_upazila_id,
    //                 pa.address AS permanent_address,
    //                 ej.join_date AS join_date,
    //                 ej.payroll_id AS payroll_id,
    //                 ej.school_shift_id AS school_shift_id,
    //                 ej.branch_id AS branch_id,
    //                 ep.designation_id AS designation_id,
    //                 d.designation_name,
    //                 u.full_name,
    //                 u.unique_id,
    //                 u.father_name,
    //                 u.mother_name,
    //                 u.blood_group_id,
    //                 u.dob,
    //                 u.gender,
    //                 u.religion,
    //                 u.mobile,
    //                 u.email,
    //                 u.password,
    //                 u.signature_image,
    //                 u.photo,
    //                 up.father_name as e_father_name,
    //                 up.mother_name as e_mother_name,
    //                 up.father_service as father_service,
    //                 up.mother_service as mother_service,
    //             FROM 
    //                 employe_info ei
    //             LEFT JOIN 
    //                 living_address la ON ei.user_id = la.user_id
    //             LEFT JOIN 
    //                 parmanent_address pa ON ei.user_id = pa.user_id
    //             LEFT JOIN 
    //                 employe_joining ej ON ei.user_id = ej.user_id
    //             LEFT JOIN 
    //                 employee_promotion ep ON ei.user_id = ep.user_id
    //             LEFT JOIN 
    //                 users u ON ei.user_id = u.id
    //             LEFT JOIN 
    //                 designation d ON ep.designation_id = d.id
    //             LEFT JOIN 
    //                 user_parent up ON ej.user_id =  up.user_id
    //             WHERE
    //                 ei.user_id = ?`;

    //         const educationalQualificationQuery = `
    //             SELECT 
    //                 eq.education, 
    //                 eq.institute, 
    //                 eq.result, 
    //                 eq.passing_year
    //             FROM 
    //                 educational_qualification eq 
    //             WHERE 
    //                 eq.user_id = ?`;

    //         connection.query(employeeDataQuery, [employeeId], (err, employeeResults) => {
    //             if (err) {
    //                 console.error(err);
    //                 res.status(500).json({ message: 'Failed to fetch employee data' });
    //                 return;
    //             }
    //             if (employeeResults.length === 0) {
    //                 res.status(404).json({ message: 'Employee not found' });
    //                 return;
    //             }

    //             connection.query(educationalQualificationQuery, [employeeId], (err, educationResults) => {
    //                 if (err) {
    //                     console.error(err);
    //                     res.status(500).json({ message: 'Failed to fetch educational qualifications' });
    //                     return;
    //                 }

    //                 const employeeData = {
    //                     ...employeeResults[0],
    //                     educational_qualifications: educationResults
    //                 };

    //                 res.status(200).json(employeeData);
    //             });
    //         });
    //     } catch (error) {
    //         console.error("Error fetching employee data:", error);
    //         res.status(500).json({ message: "Error fetching employee data" });
    //     }
    // },

    employee_all_single: async (req, res) => {
        try {
            const employeeId = req.params.id; // Assuming the ID is passed as a parameter

            const employeeDataQuery = `
                SELECT 
                    ei.*, 
                    la.division_id AS living_division_id,
                    la.same_as AS same_as,
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
                    ej.branch_id AS branch_id,
                    ep.designation_id AS designation_id,
                    d.designation_name,
                    u.full_name,
                    u.unique_id,
                    u.blood_group_id,
                    u.dob,
                    u.gender,
                    u.religion,
                    u.mobile,
                    u.email,
                    u.password,
                    u.signature_image,
                    u.photo,
                    u.NID,
                    up.father_name AS e_father_name,
                    up.mother_name AS e_mother_name,
                    up.father_service AS father_service,
                    up.mother_service AS mother_service,
                    pc.father_phone AS father_phone,
                    pc.mother_phone AS mother_phone
                FROM 
                    employe_info ei
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
                    ei.user_id = ?`;

            const educationalQualificationQuery = `
                SELECT 
                    eq.education, 
                    eq.institute, 
                    eq.result, 
                    eq.passing_year
                FROM 
                    educational_qualification eq 
                WHERE 
                    eq.user_id = ?`;

            // Execute the main employee data query
            connection.query(employeeDataQuery, [employeeId], (err, employeeResults) => {
                if (err) {
                    console.error("Error fetching employee data:", err);
                    res.status(500).json({ message: 'Failed to fetch employee data' });
                    return;
                }
                if (employeeResults.length === 0) {
                    res.status(404).json({ message: 'Employee not found' });
                    return;
                }

                // Execute the educational qualifications query
                connection.query(educationalQualificationQuery, [employeeId], (err, educationResults) => {
                    if (err) {
                        console.error("Error fetching educational qualifications:", err);
                        res.status(500).json({ message: 'Failed to fetch educational qualifications' });
                        return;
                    }

                    // Combine the results
                    const employeeData = {
                        ...employeeResults[0],
                        educational_qualifications: educationResults
                    };

                    res.status(200).json(employeeData);
                });
            });
        } catch (error) {
            console.error("Error fetching employee data:", error);
            res.status(500).json({ message: "Error fetching employee data" });
        }
    },

    employee_all_single_for_id: async (req, res) => {
        try {
            const employeeId = req.params.id; // Assuming the ID is passed as a parameter

            const employeeDataQuery = `
                SELECT 
                    ei.*, 
                    la.division_id AS living_division_id,
                    la.same_as AS same_as,
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
                    ej.branch_id AS branch_id,
                    ep.designation_id AS designation_id,
                    d.designation_name,
                    u.full_name,
                    u.unique_id,
                    u.blood_group_id,
                    bg.blood_group_name AS blood_group_name,  -- Fetch blood group name
                    u.dob,
                    u.gender,
                    u.religion,
                    u.mobile,
                    u.email,
                    u.password,
                    u.signature_image,
                    u.photo,
                    u.NID,
                    up.father_name AS e_father_name,
                    up.mother_name AS e_mother_name,
                    up.father_service AS father_service,
                    up.mother_service AS mother_service,
                    pc.father_phone AS father_phone,
                    pc.mother_phone AS mother_phone
                FROM 
                    employe_info ei
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
                LEFT JOIN 
                    blood_group bg ON u.blood_group_id = bg.id -- Join with blood_group table
                WHERE
                    ei.user_id = ?`;

            const educationalQualificationQuery = `
                SELECT 
                    eq.education, 
                    eq.institute, 
                    eq.result, 
                    eq.passing_year
                FROM 
                    educational_qualification eq 
                WHERE 
                    eq.user_id = ?`;

            // Execute the main employee data query
            connection.query(employeeDataQuery, [employeeId], (err, employeeResults) => {
                if (err) {
                    console.error("Error fetching employee data:", err);
                    res.status(500).json({ message: 'Failed to fetch employee data' });
                    return;
                }
                if (employeeResults.length === 0) {
                    res.status(404).json({ message: 'Employee not found' });
                    return;
                }

                // Execute the educational qualifications query
                connection.query(educationalQualificationQuery, [employeeId], (err, educationResults) => {
                    if (err) {
                        console.error("Error fetching educational qualifications:", err);
                        res.status(500).json({ message: 'Failed to fetch educational qualifications' });
                        return;
                    }

                    // Combine the results
                    const employeeData = {
                        ...employeeResults[0],
                        educational_qualifications: educationResults
                    };

                    res.status(200).json(employeeData);
                });
            });
        } catch (error) {
            console.error("Error fetching employee data:", error);
            res.status(500).json({ message: "Error fetching employee data" });
        }
    },


    employee_all_for_attendance: async (req, res) => {
        try {
            const employeeDataQuery = `
                SELECT 
                    ei.*, 
                    la.division_id AS living_division_id,
                    la.same_as AS same_as,
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
                    ej.branch_id AS branch_id,
                    ep.designation_id AS designation_id,
                    d.designation_name,
                    u.full_name,
                    u.unique_id,
                    u.blood_group_id,
                    u.dob,
                    u.gender,
                    u.religion,
                    u.mobile,
                    u.email,
                    u.password,
                    u.signature_image,
                    u.photo,
                    u.NID,
                    up.father_name AS e_father_name,
                    up.mother_name AS e_mother_name,
                    up.father_service AS father_service,
                    up.mother_service AS mother_service,
                    pc.father_phone AS father_phone,
                    pc.mother_phone AS mother_phone
                FROM 
                    employe_info ei
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
                    parent_contact pc ON ej.user_id = pc.user_id`;

            const educationalQualificationQuery = `
                SELECT 
                    eq.user_id,
                    eq.education, 
                    eq.institute, 
                    eq.result, 
                    eq.passing_year
                FROM 
                    educational_qualification eq`;

            // Execute the main employee data query
            connection.query(employeeDataQuery, (err, employeeResults) => {
                if (err) {
                    console.error("Error fetching employee data:", err);
                    res.status(500).json({ message: 'Failed to fetch employee data' });
                    return;
                }
                if (employeeResults.length === 0) {
                    res.status(404).json({ message: 'No employees found' });
                    return;
                }

                // Execute the educational qualifications query
                connection.query(educationalQualificationQuery, (err, educationResults) => {
                    if (err) {
                        console.error("Error fetching educational qualifications:", err);
                        res.status(500).json({ message: 'Failed to fetch educational qualifications' });
                        return;
                    }

                    // Map educational qualifications to the respective employees
                    const employeeData = employeeResults.map(employee => {
                        return {
                            ...employee,
                            educational_qualifications: educationResults.filter(eq => eq.user_id === employee.user_id)
                        };
                    });

                    res.status(200).json(employeeData);
                });
            });
        } catch (error) {
            console.error("Error fetching employee data:", error);
            res.status(500).json({ message: "Error fetching employee data" });
        }
    },



    // create_employee: async (req, res) => {
    //     try {
    //         const {
    //             full_name,
    //             dob,
    //             gender,
    //             religion,
    //             mobile,
    //             email,
    //             password,
    //             experience,
    //             education,
    //             institute,
    //             result,
    //             passing_year,
    //             division_id_living,
    //             district_id_living,
    //             upazila_id_living,
    //             address_id_living,
    //             division_id_permanent,
    //             district_id_permanent,
    //             upazila_id_permanent,
    //             address_id_permanent,
    //             join_date,
    //             payroll_id,
    //             school_shift_id,
    //             signature_image,
    //             photo,
    //             created_by
    //         } = req.body;

    //         const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    //         // Assuming you have a connection object already defined
    //         connection.beginTransaction();

    //         const userQuery = `INSERT INTO users (full_name, dob, gender, religion, mobile, email, password, signature_image, photo, created_by) 
    //                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    //         const userParams = [full_name, dob, gender, religion, mobile, email, hashedPassword, signature_image, photo, created_by];

    //         connection.query(userQuery, userParams, async (err, results) => {
    //             if (err) {
    //                 console.error(err);
    //                 await connection.rollback();
    //                 res.status(500).json({ message: 'User creation failed' });
    //                 return;
    //             }

    //             try {
    //                 const user_id = results.insertId;
    //                 const employeInfoQuery = `INSERT INTO employe_info (experience, user_id) VALUES (?, ?)`;
    //                 const employeInfoParams = [experience, user_id];

    //                 const eduQualificationQuery = `INSERT INTO educational_qualification (education, institute, result, passing_year, user_id) 
    //                                                 VALUES (?, ?, ?, ?, ?)`;
    //                 const eduQualificationParams = [education, institute, result, passing_year, user_id];

    //                 const livingAddressQuery = `INSERT INTO living_address (division_id, district_id, upazila_id, address, user_id, created_by) 
    //                                             VALUES (?, ?, ?, ?, ?, ?)`;
    //                 const livingAddressParams = [division_id_living, district_id_living, upazila_id_living, address_id_living, user_id, created_by];

    //                 const permanentAddressQuery = `INSERT INTO parmanent_address (division_id, district_id, upazila_id, address, user_id, created_by) 
    //                                                 VALUES (?, ?, ?, ?, ?, ?)`;
    //                 const permanentAddressParams = [division_id_permanent, district_id_permanent, upazila_id_permanent, address_id_permanent, user_id, created_by];

    //                 const employeJoiningQuery = `INSERT INTO employe_joining (user_id, join_date, payroll_id, school_shift_id, created_by) 
    //                                             VALUES (?, ?, ?, ?, ?)`;
    //                 const employeJoiningParams = [user_id, join_date, payroll_id, school_shift_id, created_by];

    //                 await connection.query(employeInfoQuery, employeInfoParams);
    //                 await connection.query(eduQualificationQuery, eduQualificationParams);
    //                 await connection.query(livingAddressQuery, livingAddressParams);
    //                 await connection.query(permanentAddressQuery, permanentAddressParams);
    //                 await connection.query(employeJoiningQuery, employeJoiningParams);

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
    // }



    //     quick_create_employee: async (req, res) => {
    //     let employees = req.body;

    //     for (let employe of employees) {
    //         const {
    //             mother_name,
    //             father_name,
    //             full_name,
    //             dob,
    //             gender,
    //             religion,
    //             mobile,
    //             email,
    //             password,
    //             experience,
    //             education,
    //             institute,
    //             result,
    //             passing_year,
    //             division_id_living,
    //             district_id_living,
    //             upazila_id_living,
    //             address_id_living,
    //             division_id_permanent,
    //             district_id_permanent,
    //             upazila_id_permanent,
    //             address_id_permanent,
    //             join_date,
    //             payroll_id,
    //             school_shift_id,
    //             signature_image,
    //             photo,
    //             created_by,
    //             designation_id
    //         } = employe;

    //         if (!password) {
    //             res.status(400).json({ message: 'Password is required' });
    //             return;
    //         }

    //         const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    //         connection.beginTransaction((transactionErr) => {
    //             if (transactionErr) {
    //                 console.error(transactionErr);
    //                 res.status(500).json({ message: 'Transaction initiation failed' });
    //                 return;
    //             }

    //             const userQuery = `INSERT INTO users (full_name, dob, gender, religion, mobile, email, password, signature_image, photo, mother_name, father_name, created_by) 
    //                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    //             const userParams = [full_name, dob, gender, religion, mobile, email, hashedPassword, signature_image, photo, mother_name, father_name, created_by];

    //             connection.query(userQuery, userParams, async (userErr, userResults) => {
    //                 if (userErr) {
    //                     console.error(userErr);
    //                     await connection.rollback();
    //                     res.status(500).json({ message: 'User creation failed' });
    //                     return;
    //                 }

    //                 try {
    //                     const user_id = userResults.insertId;

    //                     const employeInfoQuery = `INSERT INTO employe_info (experience, user_id) VALUES (?, ?)`;
    //                     const employeInfoParams = [experience, user_id];

    //                     const eduQualificationQuery = `INSERT INTO educational_qualification (education, institute, result, passing_year, user_id) 
    //                                                     VALUES (?, ?, ?, ?, ?)`;
    //                     const eduQualificationParams = [education, institute, result, passing_year, user_id];

    //                     const livingAddressQuery = `INSERT INTO living_address (division_id, district_id, upazila_id, address, user_id, created_by) 
    //                                                 VALUES (?, ?, ?, ?, ?, ?)`;
    //                     const livingAddressParams = [division_id_living, district_id_living, upazila_id_living, address_id_living, user_id, created_by];

    //                     const permanentAddressQuery = `INSERT INTO parmanent_address (division_id, district_id, upazila_id, address, user_id, created_by) 
    //                                                     VALUES (?, ?, ?, ?, ?, ?)`;
    //                     const permanentAddressParams = [division_id_permanent, district_id_permanent, upazila_id_permanent, address_id_permanent, user_id, created_by];

    //                     const employeJoiningQuery = `INSERT INTO employe_joining (user_id, join_date, payroll_id, school_shift_id, created_by) 
    //                                                 VALUES (?, ?, ?, ?, ?)`;
    //                     const employeJoiningParams = [user_id, join_date, payroll_id, school_shift_id,      created_by];

    //                     const promotionQuery = `INSERT INTO employee_promotion (user_id, join_date, payroll_id, created_by, designation_id, school_shift_id, promotion_id, promotion_month) 
    //                                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    //                     const promotionParams = [user_id, join_date, payroll_id, created_by, designation_id, school_shift_id, designation_id, join_date];

    //                     connection.query(employeInfoQuery, employeInfoParams, (employeInfoErr) => {
    //                         if (employeInfoErr) {
    //                             console.error(employeInfoErr);
    //                             connection.rollback();
    //                             res.status(500).json({ message: 'Error inserting employee info' });
    //                             return;
    //                         }

    //                         connection.query(eduQualificationQuery, eduQualificationParams, (eduQualificationErr) => {
    //                             if (eduQualificationErr) {
    //                                 console.error(eduQualificationErr);
    //                                 connection.rollback();
    //                                 res.status(500).json({ message: 'Error inserting educational qualification' });
    //                                 return;
    //                             }

    //                             connection.query(livingAddressQuery, livingAddressParams, (livingAddressErr) => {
    //                                 if (livingAddressErr) {
    //                                     console.error(livingAddressErr);
    //                                     connection.rollback();
    //                                     res.status(500).json({ message: 'Error inserting living address' });
    //                                     return;
    //                                 }

    //                                 connection.query(permanentAddressQuery, permanentAddressParams, (permanentAddressErr) => {
    //                                     if (permanentAddressErr) {
    //                                         console.error(permanentAddressErr);
    //                                         connection.rollback();
    //                                         res.status(500).json({ message: 'Error inserting permanent address' });
    //                                         return;
    //                                     }

    //                                     connection.query(employeJoiningQuery, employeJoiningParams, (employeJoiningErr) => {
    //                                         if (employeJoiningErr) {
    //                                             console.error(employeJoiningErr);
    //                                             connection.rollback();
    //                                             res.status(500).json({ message: 'Error inserting employee joining' });
    //                                             return;
    //                                         }

    //                                         connection.query(promotionQuery, promotionParams, (promotionErr) => {
    //                                             if (promotionErr) {
    //                                                 console.error(promotionErr);
    //                                                 connection.rollback();
    //                                                 res.status(500).json({ message: 'Error inserting promotion data' });
    //                                                 return;
    //                                             }

    //                                             connection.commit((commitErr) => {
    //                                                 if (commitErr) {
    //                                                     console.error(commitErr);
    //                                                     connection.rollback();
    //                                                     res.status(500).json({ message: 'Commit failed' });
    //                                                     return;
    //                                                 }

    //                                                 res.status(200).json({ message: 'User created successfully' });
    //                                             });
    //                                         });
    //                                     });
    //                                 });
    //                             });
    //                         });
    //                     });
    //                 } catch (error) {
    //                     console.error("Error inserting additional data:", error);
    //                     await connection.rollback();
    //                     res.status(500).json({ message: "Error inserting additional data." });
    //                 }
    //             });
    //         });
    //     }
    // },

    // quick_create_employee: async (req, res) => {
    //     let employees = req.body;

    //     // Debugging: Log req.body to see its structure
    //     console.log("Request Body:", req.body);

    //     // Check if employees is an array
    //     if (!Array.isArray(employees)) {
    //         res.status(400).json({ message: 'Invalid input: employees should be an array' });
    //         return;
    //     }

    //     for (let employe of employees) {
    //         const {
    //             mother_name,
    //             father_name,
    //             full_name,
    //             dob,
    //             gender,
    //             religion,
    //             mobile,
    //             email,
    //             password,
    //             experience,
    //             education,
    //             institute,
    //             result,
    //             passing_year,
    //             division_id_living,
    //             district_id_living,
    //             upazila_id_living,
    //             address_id_living,
    //             division_id_permanent,
    //             district_id_permanent,
    //             upazila_id_permanent,
    //             address_id_permanent,
    //             join_date,
    //             payroll_id,
    //             school_shift_id,
    //             signature_image,
    //             photo,
    //             created_by,
    //             designation_id
    //         } = employe;

    //         if (!password) {
    //             res.status(400).json({ message: 'Password is required' });
    //             return;
    //         }

    //         const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    //         connection.beginTransaction((transactionErr) => {
    //             if (transactionErr) {
    //                 console.error(transactionErr);
    //                 res.status(500).json({ message: 'Transaction initiation failed' });
    //                 return;
    //             }

    //             const userQuery = `INSERT INTO users (full_name, dob, gender, religion, mobile, email, password, signature_image, photo, mother_name, father_name, created_by) 
    //                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    //             const userParams = [full_name, dob, gender, religion, mobile, email, hashedPassword, signature_image, photo, mother_name, father_name, created_by];

    //             connection.query(userQuery, userParams, async (userErr, userResults) => {
    //                 if (userErr) {
    //                     console.error(userErr);
    //                     await connection.rollback();
    //                     res.status(500).json({ message: 'User creation failed' });
    //                     return;
    //                 }

    //                 try {
    //                     const user_id = userResults.insertId;

    //                     const employeInfoQuery = `INSERT INTO employe_info (experience, user_id) VALUES (?, ?)`;
    //                     const employeInfoParams = [experience, user_id];

    //                     const eduQualificationQuery = `INSERT INTO educational_qualification (education, institute, result, passing_year, user_id) 
    //                                                     VALUES (?, ?, ?, ?, ?)`;
    //                     const eduQualificationParams = [education, institute, result, passing_year, user_id];

    //                     const livingAddressQuery = `INSERT INTO living_address (division_id, district_id, upazila_id, address, user_id, created_by) 
    //                                                 VALUES (?, ?, ?, ?, ?, ?)`;
    //                     const livingAddressParams = [division_id_living, district_id_living, upazila_id_living, address_id_living, user_id, created_by];

    //                     const permanentAddressQuery = `INSERT INTO parmanent_address (division_id, district_id, upazila_id, address, user_id, created_by) 
    //                                                     VALUES (?, ?, ?, ?, ?, ?)`;
    //                     const permanentAddressParams = [division_id_permanent, district_id_permanent, upazila_id_permanent, address_id_permanent, user_id, created_by];

    //                     const employeJoiningQuery = `INSERT INTO employe_joining (user_id, join_date, payroll_id, school_shift_id, created_by) 
    //                                                 VALUES (?, ?, ?, ?, ?)`;
    //                     const employeJoiningParams = [user_id, join_date, payroll_id, school_shift_id, created_by];

    //                     const promotionQuery = `INSERT INTO employee_promotion (user_id, join_date, payroll_id, created_by, designation_id, school_shift_id, promotion_id, promotion_month) 
    //                                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    //                     const promotionParams = [user_id, join_date, payroll_id, created_by, designation_id, school_shift_id, designation_id, join_date];

    //                     connection.query(employeInfoQuery, employeInfoParams, (employeInfoErr) => {
    //                         if (employeInfoErr) {
    //                             console.error(employeInfoErr);
    //                             connection.rollback();
    //                             res.status(500).json({ message: 'Error inserting employee info' });
    //                             return;
    //                         }

    //                         connection.query(eduQualificationQuery, eduQualificationParams, (eduQualificationErr) => {
    //                             if (eduQualificationErr) {
    //                                 console.error(eduQualificationErr);
    //                                 connection.rollback();
    //                                 res.status(500).json({ message: 'Error inserting educational qualification' });
    //                                 return;
    //                             }

    //                             connection.query(livingAddressQuery, livingAddressParams, (livingAddressErr) => {
    //                                 if (livingAddressErr) {
    //                                     console.error(livingAddressErr);
    //                                     connection.rollback();
    //                                     res.status(500).json({ message: 'Error inserting living address' });
    //                                     return;
    //                                 }

    //                                 connection.query(permanentAddressQuery, permanentAddressParams, (permanentAddressErr) => {
    //                                     if (permanentAddressErr) {
    //                                         console.error(permanentAddressErr);
    //                                         connection.rollback();
    //                                         res.status(500).json({ message: 'Error inserting permanent address' });
    //                                         return;
    //                                     }

    //                                     connection.query(employeJoiningQuery, employeJoiningParams, (employeJoiningErr) => {
    //                                         if (employeJoiningErr) {
    //                                             console.error(employeJoiningErr);
    //                                             connection.rollback();
    //                                             res.status(500).json({ message: 'Error inserting employee joining' });
    //                                             return;
    //                                         }

    //                                         connection.query(promotionQuery, promotionParams, (promotionErr) => {
    //                                             if (promotionErr) {
    //                                                 console.error(promotionErr);
    //                                                 connection.rollback();
    //                                                 res.status(500).json({ message: 'Error inserting promotion data' });
    //                                                 return;
    //                                             }

    //                                             connection.commit((commitErr) => {
    //                                                 if (commitErr) {
    //                                                     console.error(commitErr);
    //                                                     connection.rollback();
    //                                                     res.status(500).json({ message: 'Commit failed' });
    //                                                     return;
    //                                                 }

    //                                                 res.status(200).json({ message: 'User created successfully' });
    //                                             });
    //                                         });
    //                                     });
    //                                 });
    //                             });
    //                         });
    //                     });
    //                 } catch (error) {
    //                     console.error("Error inserting additional data:", error);
    //                     await connection.rollback();
    //                     res.status(500).json({ message: "Error inserting additional data." });
    //                 }
    //             });
    //         });
    //     }
    // },

    quick_create_employee: async (req, res) => {
        let employees = req.body;

        // Debugging: Log req.body to see its structure
        console.log("Request Body:", req.body);

        // Check if employees is an array
        if (!Array.isArray(employees)) {
            res.status(400).json({ message: 'Invalid input: employees should be an array' });
            return;
        }

        let responseSent = false;

        for (let employe of employees) {
            const {
                mother_name,
                father_name,
                full_name,
                dob,
                gender,
                religion,
                mobile,
                email,
                signature_image,
                photo,
                created_by,
                unique_id,
                // Defaulting the following values to 0
                experience = 0,
                education = 0,
                institute = 0,
                result = 0,
                passing_year = 0,
                division_id_living = 0,
                district_id_living = 0,
                upazila_id_living = 0,
                address_id_living = 0,
                division_id_permanent = 0,
                district_id_permanent = 0,
                upazila_id_permanent = 0,
                address_id_permanent = 0,
                join_date = 0,
                payroll_id = 0,
                school_shift_id = 0,
                designation_id = 0
            } = employe;

            // Ensure mobile is present
            if (!mobile) {
                if (!responseSent) {
                    res.status(400).json({ message: 'Mobile number is required' });
                    responseSent = true;
                }
                return;
            }

            // Use mobile as the password
            const hashedPassword = crypto.createHash('sha1').update(mobile).digest('hex');

            connection.beginTransaction((transactionErr) => {
                if (transactionErr) {
                    console.error(transactionErr);
                    if (!responseSent) {
                        res.status(500).json({ message: 'Transaction initiation failed' });
                        responseSent = true;
                    }
                    return;
                }

                const userQuery = `INSERT INTO users (full_name,unique_id, dob, gender, religion, mobile, email, password, signature_image, photo, mother_name, father_name, created_by) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const userParams = [full_name, unique_id, dob, gender, religion, mobile, email, hashedPassword, signature_image, photo, mother_name, father_name, created_by];

                connection.query(userQuery, userParams, async (userErr, userResults) => {
                    if (userErr) {
                        console.error(userErr);
                        await connection.rollback();
                        if (!responseSent) {
                            res.status(500).json({ message: 'User creation failed' });
                            responseSent = true;
                        }
                        return;
                    }

                    try {
                        const user_id = userResults.insertId;

                        const employeInfoQuery = `INSERT INTO employe_info (experience, user_id) VALUES (?, ?)`;
                        const employeInfoParams = [experience, user_id];

                        const eduQualificationQuery = `INSERT INTO educational_qualification (education, institute, result, passing_year, user_id) 
                                                    VALUES (?, ?, ?, ?, ?)`;
                        const eduQualificationParams = [education, institute, result, passing_year, user_id];

                        const livingAddressQuery = `INSERT INTO living_address (division_id, district_id, upazila_id, address, user_id, created_by) 
                                                VALUES (?, ?, ?, ?, ?, ?)`;
                        const livingAddressParams = [division_id_living, district_id_living, upazila_id_living, address_id_living, user_id, created_by];

                        const permanentAddressQuery = `INSERT INTO parmanent_address (division_id, district_id, upazila_id, address, user_id, created_by) 
                                                    VALUES (?, ?, ?, ?, ?, ?)`;
                        const permanentAddressParams = [division_id_permanent, district_id_permanent, upazila_id_permanent, address_id_permanent, user_id, created_by];

                        const employeJoiningQuery = `INSERT INTO employe_joining (user_id, join_date, payroll_id, school_shift_id, created_by) 
                                                VALUES (?, ?, ?, ?, ?)`;
                        const employeJoiningParams = [user_id, join_date, payroll_id, school_shift_id, created_by];

                        const promotionQuery = `INSERT INTO employee_promotion (user_id, join_date, payroll_id, created_by, designation_id, school_shift_id, promotion_id, promotion_month) 
                                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                        const promotionParams = [user_id, join_date, payroll_id, created_by, designation_id, school_shift_id, designation_id, join_date];

                        connection.query(employeInfoQuery, employeInfoParams, (employeInfoErr) => {
                            if (employeInfoErr) {
                                console.error(employeInfoErr);
                                connection.rollback();
                                if (!responseSent) {
                                    res.status(500).json({ message: 'Error inserting employee info' });
                                    responseSent = true;
                                }
                                return;
                            }

                            connection.query(eduQualificationQuery, eduQualificationParams, (eduQualificationErr) => {
                                if (eduQualificationErr) {
                                    console.error(eduQualificationErr);
                                    connection.rollback();
                                    if (!responseSent) {
                                        res.status(500).json({ message: 'Error inserting educational qualification' });
                                        responseSent = true;
                                    }
                                    return;
                                }

                                connection.query(livingAddressQuery, livingAddressParams, (livingAddressErr) => {
                                    if (livingAddressErr) {
                                        console.error(livingAddressErr);
                                        connection.rollback();
                                        if (!responseSent) {
                                            res.status(500).json({ message: 'Error inserting living address' });
                                            responseSent = true;
                                        }
                                        return;
                                    }

                                    connection.query(permanentAddressQuery, permanentAddressParams, (permanentAddressErr) => {
                                        if (permanentAddressErr) {
                                            console.error(permanentAddressErr);
                                            connection.rollback();
                                            if (!responseSent) {
                                                res.status(500).json({ message: 'Error inserting permanent address' });
                                                responseSent = true;
                                            }
                                            return;
                                        }

                                        connection.query(employeJoiningQuery, employeJoiningParams, (employeJoiningErr) => {
                                            if (employeJoiningErr) {
                                                console.error(employeJoiningErr);
                                                connection.rollback();
                                                if (!responseSent) {
                                                    res.status(500).json({ message: 'Error inserting employee joining' });
                                                    responseSent = true;
                                                }
                                                return;
                                            }

                                            connection.query(promotionQuery, promotionParams, (promotionErr) => {
                                                if (promotionErr) {
                                                    console.error(promotionErr);
                                                    connection.rollback();
                                                    if (!responseSent) {
                                                        res.status(500).json({ message: 'Error inserting promotion data' });
                                                        responseSent = true;
                                                    }
                                                    return;
                                                }

                                                connection.commit((commitErr) => {
                                                    if (commitErr) {
                                                        console.error(commitErr);
                                                        connection.rollback();
                                                        if (!responseSent) {
                                                            res.status(500).json({ message: 'Commit failed' });
                                                            responseSent = true;
                                                        }
                                                        return;
                                                    }

                                                    if (!responseSent) {
                                                        res.status(200).json({ message: 'User created successfully' });
                                                        responseSent = true;
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    } catch (error) {
                        console.error("Error inserting additional data:", error);
                        await connection.rollback();
                        if (!responseSent) {
                            res.status(500).json({ message: "Error inserting additional data." });
                            responseSent = true;
                        }
                    }
                });
            });
        }
    },
    // original
    // create_employee: async (req, res) => {
    //     try {
    //         const {
    //             father_service, mother_service,
    //             blood_group_id,
    //             NID,
    //             mother_name,
    //             father_name,
    //             full_name,
    //             dob,
    //             gender,
    //             religion,
    //             mobile,
    //             email,
    //             password,
    //             experience,
    //             education,
    //             institute,
    //             result,
    //             unique_id,
    //             same_as,
    //             passing_year,
    //             division_id_living,
    //             district_id_living,
    //             upazila_id_living,
    //             address_id_living,
    //             division_id_permanent,
    //             district_id_permanent,
    //             upazila_id_permanent,
    //             address_id_permanent,
    //             join_date,
    //             payroll_id,
    //             school_shift_id,
    //             signature_image,
    //             photo,
    //             created_by,
    //             designation_id,
    //             branch_id,
    //             father_mobile, mother_mobile
    //         } = req.body;

    //         const educationalQualifications = req.body.fields; // Assuming this is an array of qualifications

    //         const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    //         // Assuming you have a connection object already defined
    //         connection.beginTransaction();

    //         const userQuery = `INSERT INTO users (full_name,NID, blood_group_id, unique_id, dob, gender, religion, mobile, email, password, signature_image, photo, mother_name, father_name, created_by) 
    //                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    //         const userParams = [full_name, NID, blood_group_id, unique_id, dob, gender, religion, mobile, email, hashedPassword, signature_image, photo, mother_name, father_name, created_by];

    //         connection.query(userQuery, userParams, async (err, results) => {
    //             if (err) {
    //                 console.error(err);
    //                 await connection.rollback();
    //                 res.status(500).json({ message: 'User creation failed' });
    //                 return;
    //             }

    //             try {
    //                 const user_id = results.insertId;
    //                 const employeInfoQuery = `INSERT INTO employe_info (experience, user_id) VALUES (?, ?)`;
    //                 const employeInfoParams = [experience, user_id];

    //                 const livingAddressQuery = `INSERT INTO living_address (division_id, same_as, district_id, upazila_id, address, user_id, created_by) 
    //                                             VALUES (?, ?, ?, ?, ?, ?, ?)`;
    //                 const livingAddressParams = [division_id_living, same_as, district_id_living, upazila_id_living, address_id_living, user_id, created_by];

    //                 const permanentAddressQuery = `INSERT INTO parmanent_address (division_id, district_id, upazila_id, address, user_id, created_by) 
    //                                                 VALUES (?, ?, ?, ?, ?, ?)`;
    //                 const permanentAddressParams = [division_id_permanent, district_id_permanent, upazila_id_permanent, address_id_permanent, user_id, created_by];

    //                 const employeJoiningQuery = `INSERT INTO employe_joining (user_id, join_date, payroll_id, school_shift_id, branch_id, created_by, designation_id) 
    //                                             VALUES (?, ?, ?, ?, ?, ?, ?)`;
    //                 const employeJoiningParams = [user_id, join_date, payroll_id, school_shift_id, branch_id, created_by, designation_id];

    //                 const employEuserParentQuery = `INSERT INTO user_parent (user_id, father_name, mother_name, father_service, mother_service) 
    //                                             VALUES (?, ?, ?, ?, ?)`;
    //                 const employeParentParams = [user_id, father_name, mother_name, father_service, mother_service];

    //                 const employEuserParentContactQueryF = `INSERT INTO parent_contact (user_id, father_phone, mother_phone) 
    //                                             VALUES (?, ?, ?)`;
    //                 const employeParentContactParamsF = [user_id, father_mobile, mother_mobile];


    //                 // Insert into employe_info table
    //                 await connection.query(employeInfoQuery, employeInfoParams);
    //                 // Insert into living_address table
    //                 await connection.query(livingAddressQuery, livingAddressParams);
    //                 // Insert into parmanent_address table
    //                 await connection.query(permanentAddressQuery, permanentAddressParams);
    //                 // Insert into employe_joining table
    //                 await connection.query(employeJoiningQuery, employeJoiningParams);

    //                 await connection.query(employEuserParentQuery, employeParentParams);

    //                 await connection.query(employEuserParentContactQueryF, employeParentContactParamsF);


    //                 // Insert into educational_qualification table
    //                 for (const qualification of educationalQualifications) {
    //                     const { education, institute, result, passing_year } = qualification;
    //                     const eduQualificationQuery = `INSERT INTO educational_qualification (education, institute, result, passing_year, user_id) 
    //                                                     VALUES (?, ?, ?, ?, ?)`;
    //                     const eduQualificationParams = [education, institute, result, passing_year, user_id];
    //                     await connection.query(eduQualificationQuery, eduQualificationParams);
    //                 }

    //                 // New addition: Insert into employee_promotion table
    //                 const promotionQuery = `INSERT INTO employee_promotion (user_id, join_date, payroll_id, created_by, designation_id, school_shift_id, promotion_id, promotion_month, branch_id) 
    //                                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    //                 const promotionParams = [user_id, join_date, payroll_id, created_by, designation_id, school_shift_id, designation_id, join_date, branch_id];

    //                 await connection.query(promotionQuery, promotionParams);

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

    //  original end

    create_employee: async (req, res) => {
        try {
            const {
                father_service, mother_service,
                blood_group_id,
                NID,
                mother_name,
                father_name,
                full_name,
                dob,
                gender,
                religion,
                mobile,
                email,
                password,
                experience,
                education,
                institute,
                result,
                unique_id,
                same_as,
                passing_year,
                division_id_living,
                district_id_living,
                upazila_id_living,
                address_id_living,
                division_id_permanent,
                district_id_permanent,
                upazila_id_permanent,
                address_id_permanent,
                join_date,
                payroll_id,
                school_shift_id,
                signature_image,
                photo,
                created_by,
                designation_id,
                branch_id,
                father_mobile,
                mother_mobile,
                name,
                sms_campaign_category_id,
                formattedDisplayDate,
                employeeAttendanceSmsTemplate,
                sendSmsChecked

            } = req.body;

            const formatDate = (dateString) => {
                return dateString.split('-').join('/');
            };
            let campaignResult; // Initialize campaignResult here
            let eduQualificationResult; // Initialize eduQualificationResult here
            const educationalQualifications = req.body.fields; // Assuming this is an array of qualifications

            const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

            // Assuming you have a connection object already defined
            connection.beginTransaction();

            const userQuery = `INSERT INTO users (full_name,NID, blood_group_id, unique_id, dob, gender, religion, mobile, email, password, signature_image, photo, mother_name, father_name, created_by) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const userParams = [full_name, NID, blood_group_id, unique_id, dob, gender, religion, mobile, email, hashedPassword, signature_image, photo, mother_name, father_name, created_by];

            connection.query(userQuery, userParams, async (err, results) => {
                if (err) {
                    console.error(err);
                    await connection.rollback();
                    res.status(500).json({ message: 'User creation failed' });
                    return;
                }

                try {
                    const user_id = results.insertId;
                    const employeInfoQuery = `INSERT INTO employe_info (experience, user_id) VALUES (?, ?)`;
                    const employeInfoParams = [experience, user_id];

                    const livingAddressQuery = `INSERT INTO living_address (division_id, same_as, district_id, upazila_id, address, user_id, created_by) 
                                            VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    const livingAddressParams = [division_id_living, same_as, district_id_living, upazila_id_living, address_id_living, user_id, created_by];

                    const permanentAddressQuery = `INSERT INTO parmanent_address (division_id, district_id, upazila_id, address, user_id, created_by) 
                                                VALUES (?, ?, ?, ?, ?, ?)`;
                    const permanentAddressParams = [division_id_permanent, district_id_permanent, upazila_id_permanent, address_id_permanent, user_id, created_by];

                    const employeJoiningQuery = `INSERT INTO employe_joining (user_id, join_date, payroll_id, school_shift_id, branch_id, created_by, designation_id) 
                                            VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    const employeJoiningParams = [user_id, join_date, payroll_id, school_shift_id, branch_id, created_by, designation_id];

                    const employEuserParentQuery = `INSERT INTO user_parent (user_id, father_name, mother_name, father_service, mother_service) 
                                            VALUES (?, ?, ?, ?, ?)`;
                    const employeParentParams = [user_id, father_name, mother_name, father_service, mother_service];

                    const employEuserParentContactQueryF = `INSERT INTO parent_contact (user_id, father_phone, mother_phone) 
                                            VALUES (?, ?, ?)`;
                    const employeParentContactParamsF = [user_id, father_mobile, mother_mobile];


                    // Insert into employe_info table
                    await connection.query(employeInfoQuery, employeInfoParams);
                    // Insert into living_address table
                    await connection.query(livingAddressQuery, livingAddressParams);
                    // Insert into parmanent_address table
                    await connection.query(permanentAddressQuery, permanentAddressParams);
                    // Insert into employe_joining table
                    await connection.query(employeJoiningQuery, employeJoiningParams);

                    await connection.query(employEuserParentQuery, employeParentParams);

                    await connection.query(employEuserParentContactQueryF, employeParentContactParamsF);


                    // Insert into educational_qualification table
                    for (const qualification of educationalQualifications) {
                        const { education, institute, result, passing_year } = qualification;
                        const eduQualificationQuery = `INSERT INTO educational_qualification (education, institute, result, passing_year, user_id) 
                                                    VALUES (?, ?, ?, ?, ?)`;
                        const eduQualificationParams = [education, institute, result, passing_year, user_id];
                        await connection.query(eduQualificationQuery, eduQualificationParams);
                    }

                    // New addition: Insert into employee_promotion table
                    const promotionQuery = `INSERT INTO employee_promotion (user_id, join_date, payroll_id, created_by, designation_id, school_shift_id, promotion_id, promotion_month, branch_id) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    const promotionParams = [user_id, join_date, payroll_id, created_by, designation_id, school_shift_id, designation_id, join_date, branch_id];

                    await connection.query(promotionQuery, promotionParams);

                    await connection.commit();

                    if (sendSmsChecked === true) {

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


                        const currentDate = new Date();
                        const date = currentDate.toLocaleDateString();
                        const smsTime = currentDate.toLocaleTimeString();

                        // Replace placeholders with actual data
                        let msg = employeeAttendanceSmsTemplate

                            .replace('[[company_name]]', 'No Company')
                            .replace('[[full_name]]', full_name)
                            .replace('[[employee_id]]', unique_id)
                            .replace('[[employee_designation]]', designation_id)
                            .replace('[[payroll_name]]', payroll_id)
                            .replace('[[payroll_total]]', '')
                            .replace('[[joining_date]]', formatDate(formattedDisplayDate))
                            .replace('[[sms_time]]', smsTime);

                        // Insert into sms_campaign_log table
                        const eduQualificationQuery = `INSERT INTO sms_campaign_log (campaign_id, sender_id, number, message, message_id, user_id, campaign_category) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                        const eduQualificationParams = [campaign_id, created_by, mobile, msg, "message_id", user_id, sms_campaign_category_id];

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
                        const attendanceSmsQuery = `INSERT INTO admission_sms (user_id, sms_campaign_log_id) VALUES (?, ?)`;
                        const attendanceSmsParams = [user_id, edu_qualification_id];
                        await new Promise((resolve, reject) => {
                            connection.query(attendanceSmsQuery, attendanceSmsParams, (error) => {
                                if (error) {
                                    return reject(error);
                                }
                                resolve();
                            });
                        });
                    }


                    res.status(200).json({ message: 'User created successfully' });
                } catch (error) {
                    console.error("Error inserting additional data:", error);
                    await connection.rollback();
                    res.status(500).json({ message: "Error inserting additional data." });
                }
            });

        } catch (error) {
            console.error("Error inserting data:", error);
            await connection.rollback();
            res.status(500).json({ message: "Error inserting data." });
        }
    },



    // create_employee: async (req, res) => {

    //     try {
    //         const {
    //             mother_name,
    //             father_name,
    //             full_name,
    //             dob,
    //             gender,
    //             religion,
    //             mobile,
    //             email,
    //             password,
    //             experience,
    //             education,
    //             institute,
    //             result,
    //             passing_year,
    //             division_id_living,
    //             district_id_living,
    //             upazila_id_living,
    //             address_id_living,
    //             division_id_permanent,
    //             district_id_permanent,
    //             upazila_id_permanent,
    //             address_id_permanent,
    //             join_date,
    //             payroll_id,
    //             school_shift_id,
    //             signature_image,
    //             photo,
    //             created_by,
    //             designation_id,
    //             branch_id
    //         } = req.body;

    //         const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    //         // Assuming you have a connection object already defined
    //         connection.beginTransaction();

    //         const userQuery = `INSERT INTO users (full_name, dob, gender, religion, mobile, email, password, signature_image, photo, mother_name, father_name, created_by) 
    //                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    //         const userParams = [full_name, dob, gender, religion, mobile, email, hashedPassword, signature_image, photo, mother_name, father_name, created_by];

    //         connection.query(userQuery, userParams, async (err, results) => {
    //             if (err) {
    //                 console.error(err);
    //                 await connection.rollback();
    //                 res.status(500).json({ message: 'User creation failed' });
    //                 return;
    //             }

    //             try {
    //                 const user_id = results.insertId;
    //                 const employeInfoQuery = `INSERT INTO employe_info (experience, user_id) VALUES (?, ?)`;
    //                 const employeInfoParams = [experience, user_id];

    //                 const eduQualificationQuery = `INSERT INTO educational_qualification (education, institute, result, passing_year, user_id) 
    //                                                 VALUES (?, ?, ?, ?, ?)`;
    //                 const eduQualificationParams = [education, institute, result, passing_year, user_id];

    //                 const livingAddressQuery = `INSERT INTO living_address (division_id, district_id, upazila_id, address, user_id, created_by) 
    //                                             VALUES (?, ?, ?, ?, ?, ?)`;
    //                 const livingAddressParams = [division_id_living, district_id_living, upazila_id_living, address_id_living, user_id, created_by];

    //                 const permanentAddressQuery = `INSERT INTO parmanent_address (division_id, district_id, upazila_id, address, user_id, created_by) 
    //                                                 VALUES (?, ?, ?, ?, ?, ?)`;
    //                 const permanentAddressParams = [division_id_permanent, district_id_permanent, upazila_id_permanent, address_id_permanent, user_id, created_by];

    //                 const employeJoiningQuery = `INSERT INTO employe_joining (user_id, join_date, payroll_id, school_shift_id, branch_id, created_by) 
    //                                             VALUES (?, ?, ?, ?, ?, ?)`;
    //                 const employeJoiningParams = [user_id, join_date, payroll_id, school_shift_id, branch_id, created_by];

    //                 // Insert into employe_info table
    //                 await connection.query(employeInfoQuery, employeInfoParams);
    //                 // Insert into educational_qualification table
    //                 await connection.query(eduQualificationQuery, eduQualificationParams);
    //                 // Insert into living_address table
    //                 await connection.query(livingAddressQuery, livingAddressParams);
    //                 // Insert into parmanent_address table
    //                 await connection.query(permanentAddressQuery, permanentAddressParams);
    //                 // Insert into employe_joining table
    //                 await connection.query(employeJoiningQuery, employeJoiningParams);

    //                 // New addition: Insert into employee_promotion table
    //                 const promotionQuery = `INSERT INTO employee_promotion (user_id, join_date, payroll_id, created_by, designation_id, school_shift_id, promotion_id, promotion_month) 
    //                                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    //                 const promotionParams = [user_id, join_date, payroll_id, created_by, designation_id, school_shift_id, designation_id, join_date];

    //                 await connection.query(promotionQuery, promotionParams);

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




    // update_employee: async (req, res) => {
    //     const {
    //         user_id,
    //         full_name,
    //         dob,
    //         gender,
    //         religion,
    //         mobile,
    //         email,
    //         password,
    //         experience,
    //         education,
    //         institute,
    //         result,
    //         passing_year,
    //         division_id_living,
    //         district_id_living,
    //         upazila_id_living,
    //         address_id_living,
    //         division_id_permanent,
    //         district_id_permanent,
    //         upazila_id_permanent,
    //         address_id_permanent,
    //         join_date,
    //         payroll_id,
    //         school_shift_id,
    //         signature_image,
    //         photo,
    //         updated_by,
    //         designation_id,
    //         promotion_month,
    //         fields
    //     } = req.body;

    //     try {
    //         const connection = await getConnection(); // Replace with your database connection method

    //         await connection.beginTransaction();

    //         // Update basic user info


    //         // Update employe_info
    //         const employeInfoUpdateQuery = `
    //             UPDATE employe_info
    //             SET experience = ?, updated_by = ?
    //             WHERE user_id = ?`;
    //         const employeInfoParams = [experience, updated_by, user_id];
    //         await connection.query(employeInfoUpdateQuery, employeInfoParams);

    //         // Update educational qualifications
    //         for (const qualification of fields) {
    //             const { education, institute, result, passing_year } = qualification;
    //             const eduQualificationUpdateQuery = `
    //                 UPDATE educational_qualification
    //                 SET education = ?, institute = ?, result = ?, passing_year = ?, updated_by = ?
    //                 WHERE user_id = ?`;
    //             const eduQualificationParams = [education, institute, result, passing_year, updated_by, user_id];
    //             await connection.query(eduQualificationUpdateQuery, eduQualificationParams);
    //         }

    //         // Update living address
    //         const livingAddressUpdateQuery = `
    //             UPDATE living_address
    //             SET division_id = ?, district_id = ?, upazila_id = ?, address = ?, updated_by = ?
    //             WHERE user_id = ?`;
    //         const livingAddressParams = [division_id_living, district_id_living, upazila_id_living, address_id_living, updated_by, user_id];
    //         await connection.query(livingAddressUpdateQuery, livingAddressParams);

    //         // Update permanent address
    //         const permanentAddressUpdateQuery = `
    //             UPDATE permanent_address
    //             SET division_id = ?, district_id = ?, upazila_id = ?, address = ?, updated_by = ?
    //             WHERE user_id = ?`;
    //         const permanentAddressParams = [division_id_permanent, district_id_permanent, upazila_id_permanent, address_id_permanent, updated_by, user_id];
    //         await connection.query(permanentAddressUpdateQuery, permanentAddressParams);

    //         // Update employee joining details
    //         const employeJoiningUpdateQuery = `
    //             UPDATE employe_joining
    //             SET join_date = ?, payroll_id = ?, school_shift_id = ?, updated_by = ?
    //             WHERE user_id = ?`;
    //         const employeJoiningParams = [join_date, payroll_id, school_shift_id, updated_by, user_id];
    //         await connection.query(employeJoiningUpdateQuery, employeJoiningParams);

    //         // Insert employee promotion data
    //         const employeePromotionInsertQuery = `
    //             INSERT INTO employee_promotion (user_id, join_date, payroll_id, created_by, designation_id, school_shift_id, promotion_id, promotion_month)
    //             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    //         const employeePromotionParams = [user_id, join_date, payroll_id, updated_by, designation_id, school_shift_id, designation_id, promotion_month];
    //         await connection.query(employeePromotionInsertQuery, employeePromotionParams);

    //         await connection.commit();
    //         res.status(200).json({ message: 'User updated and promotion data inserted successfully' });
    //     } catch (error) {
    //         console.error('Error updating employee:', error);
    //         await connection.rollback();
    //         res.status(500).json({ message: 'Error updating employee data' });
    //     } finally {
    //         connection.release(); // Release the connection back to the pool
    //     }
    // },



    // update_employee: async (req, res) => {
    //     try {
    //         const {
    //             user_id,
    //             full_name,
    //             dob,
    //             gender,
    //             religion,
    //             mobile,
    //             email,
    //             password,
    //             experience,
    //             education,
    //             institute,
    //             result,
    //             passing_year,
    //             division_id_living,
    //             district_id_living,
    //             upazila_id_living,
    //             address_id_living,
    //             division_id_permanent,
    //             district_id_permanent,
    //             upazila_id_permanent,
    //             address_id_permanent,
    //             join_date,
    //             payroll_id,
    //             school_shift_id,
    //             signature_image,
    //             photo,
    //             updated_by,
    //             designation_id,
    //             promotion_month
    //         } = req.body;

    //         const educationalQualifications = req.body.fields;

    //         let hashedPassword = null;
    //         if (password) {
    //             hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
    //         }

    //         // Assuming you have a connection object already defined
    //         connection.beginTransaction();

    //         const userUpdateQuery = `
    //         UPDATE users
    //         SET full_name = ?, dob = ?, gender = ?, religion = ?, mobile = ?, email = ?, 
    //             ${password ? 'password = ?, ' : ''} signature_image = ?, photo = ?, updated_by = ?
    //         WHERE id = ?`;

    //         const userUpdateParams = password
    //             ? [full_name, dob, gender, religion, mobile, email, hashedPassword, signature_image, photo, updated_by, req.params.id]
    //             : [full_name, dob, gender, religion, mobile, email, signature_image, photo, updated_by, req.params.id];

    //         connection.query(userUpdateQuery, userUpdateParams, async (err, results) => {
    //             if (err) {
    //                 console.error(err);
    //                 await connection.rollback();
    //                 res.status(500).json({ message: 'User update failed' });
    //                 return;
    //             }
    //             try {
    //                 const employeInfoUpdateQuery = `
    //             UPDATE employe_info
    //             SET experience = ?, updated_by = ?
    //             WHERE user_id = ?`;

    //                 const employeInfoParams = [experience, updated_by, user_id];

    //                 //     const eduQualificationUpdateQuery = `
    //                 // UPDATE educational_qualification
    //                 // SET education = ?, institute = ?, result = ?, passing_year = ?, updated_by = ?
    //                 // WHERE user_id = ?`;

    //                 //     const eduQualificationParams = [education, institute, result, passing_year, updated_by, user_id];

    //                 for (const qualification of educationalQualifications) {
    //                     const { education, institute, result, passing_year } = qualification;

    //                     const eduQualificationUpdateQuery = `
    //           UPDATE educational_qualification
    //           SET education = ?, institute = ?, result = ?, passing_year = ?, updated_by = ?
    //           WHERE user_id = ?`;

    //                     const eduQualificationParams = [education, institute, result, passing_year, updated_by, user_id];
    //                     await connection.query(eduQualificationUpdateQuery, eduQualificationParams);
    //                 }

    //                 const livingAddressUpdateQuery = `
    //             UPDATE living_address
    //             SET division_id = ?, district_id = ?, upazila_id = ?, address = ?, updated_by = ?
    //             WHERE user_id = ?`;

    //                 const livingAddressParams = [division_id_living, district_id_living, upazila_id_living, address_id_living, updated_by, user_id];

    //                 const permanentAddressUpdateQuery = `
    //             UPDATE parmanent_address
    //             SET division_id = ?, district_id = ?, upazila_id = ?, address = ?, updated_by = ?
    //             WHERE user_id = ?`;

    //                 const permanentAddressParams = [division_id_permanent, district_id_permanent, upazila_id_permanent, address_id_permanent, updated_by, user_id];

    //                 const employeJoiningUpdateQuery = `
    //             UPDATE employe_joining
    //             SET join_date = ?, payroll_id = ?, school_shift_id = ?, updated_by = ?
    //             WHERE user_id = ?`;

    //                 const employeJoiningParams = [join_date, payroll_id, school_shift_id, updated_by, user_id];

    //                 await connection.query(employeInfoUpdateQuery, employeInfoParams);
    //                 // await connection.query(eduQualificationUpdateQuery, eduQualificationParams);
    //                 await connection.query(livingAddressUpdateQuery, livingAddressParams);
    //                 await connection.query(permanentAddressUpdateQuery, permanentAddressParams);
    //                 await connection.query(employeJoiningUpdateQuery, employeJoiningParams);

    //                 const employeePromotionInsertQuery = `
    //             INSERT INTO employee_promotion (user_id, join_date, payroll_id, created_by, designation_id, school_shift_id, promotion_id, promotion_month)
    //             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    //                 const employeePromotionParams = [user_id, join_date, payroll_id, updated_by, designation_id, school_shift_id, designation_id, promotion_month];

    //                 await connection.query(employeePromotionInsertQuery, employeePromotionParams);

    //                 await connection.commit();
    //                 res.status(200).json({ message: 'User updated and promotion data inserted successfully' });
    //             } catch (error) {
    //                 console.error("Error updating additional data:", error);
    //                 await connection.rollback();
    //                 res.status(500).json({ message: "Error updating additional data." });
    //             }
    //         });
    //     } catch (error) {
    //         console.error("Error updating data:", error);
    //         await connection.rollback();
    //         res.status(500).json({ message: "Error updating data." });
    //     }
    // },


    // update_employee: async (req, res) => {
    //     try {
    //         const {
    //             user_id,
    //             full_name,
    //             dob,
    //             gender,
    //             religion,
    //             mobile,
    //             email,
    //             password,
    //             experience,
    //             education,
    //             institute,
    //             result,
    //             passing_year,
    //             division_id_living,
    //             district_id_living,
    //             upazila_id_living,
    //             address_id_living,
    //             division_id_permanent,
    //             district_id_permanent,
    //             upazila_id_permanent,
    //             address_id_permanent,
    //             join_date,
    //             payroll_id,
    //             school_shift_id,
    //             signature_image,
    //             photo,
    //             updated_by,
    //             designation_id,
    //             promotion_month
    //         } = req.body;



    //         let hashedPassword = null;
    //         if (password) {
    //             hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
    //         }

    //         // Assuming you have a connection object already defined
    //         connection.beginTransaction();

    //         const userUpdateQuery = `
    //         UPDATE users
    //         SET full_name = ?, dob = ?, gender = ?, religion = ?, mobile = ?, email = ?, 
    //             ${password ? 'password = ?, ' : ''} signature_image = ?, photo = ?, updated_by = ?
    //         WHERE id = ?`;

    //         const userUpdateParams = password
    //             ? [full_name, dob, gender, religion, mobile, email, hashedPassword, signature_image, photo, updated_by, req.params.id]
    //             : [full_name, dob, gender, religion, mobile, email, signature_image, photo, updated_by, req.params.id];

    //         connection.query(userUpdateQuery, userUpdateParams, async (err, results) => {
    //             if (err) {
    //                 console.error(err);
    //                 await connection.rollback();
    //                 res.status(500).json({ message: 'User update failed' });
    //                 return;
    //             }
    //             try {
    //                 const employeInfoUpdateQuery = `
    //             UPDATE employe_info
    //             SET experience = ?, updated_by = ?
    //             WHERE user_id = ?`;

    //                 const employeInfoParams = [experience, updated_by, user_id];

    //                     const eduQualificationUpdateQuery = `
    //                 UPDATE educational_qualification
    //                 SET education = ?, institute = ?, result = ?, passing_year = ?, updated_by = ?
    //                 WHERE user_id = ?`;

    //                     const eduQualificationParams = [education, institute, result, passing_year, updated_by, user_id];



    //                 const livingAddressUpdateQuery = `
    //             UPDATE living_address
    //             SET division_id = ?, district_id = ?, upazila_id = ?, address = ?, updated_by = ?
    //             WHERE user_id = ?`;

    //                 const livingAddressParams = [division_id_living, district_id_living, upazila_id_living, address_id_living, updated_by, user_id];

    //                 const permanentAddressUpdateQuery = `
    //             UPDATE parmanent_address
    //             SET division_id = ?, district_id = ?, upazila_id = ?, address = ?, updated_by = ?
    //             WHERE user_id = ?`;

    //                 const permanentAddressParams = [division_id_permanent, district_id_permanent, upazila_id_permanent, address_id_permanent, updated_by, user_id];

    //                 const employeJoiningUpdateQuery = `
    //             UPDATE employe_joining
    //             SET join_date = ?, payroll_id = ?, school_shift_id = ?, updated_by = ?
    //             WHERE user_id = ?`;

    //                 const employeJoiningParams = [join_date, payroll_id, school_shift_id, updated_by, user_id];

    //                 await connection.query(employeInfoUpdateQuery, employeInfoParams);
    //                 await connection.query(eduQualificationUpdateQuery, eduQualificationParams);
    //                 await connection.query(livingAddressUpdateQuery, livingAddressParams);
    //                 await connection.query(permanentAddressUpdateQuery, permanentAddressParams);
    //                 await connection.query(employeJoiningUpdateQuery, employeJoiningParams);

    //                 const employeePromotionInsertQuery = `
    //             INSERT INTO employee_promotion (user_id, join_date, payroll_id, created_by, designation_id, school_shift_id, promotion_id, promotion_month)
    //             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    //                 const employeePromotionParams = [user_id, join_date, payroll_id, updated_by, designation_id, school_shift_id, designation_id, promotion_month];

    //                 await connection.query(employeePromotionInsertQuery, employeePromotionParams);

    //                 await connection.commit();
    //                 res.status(200).json({ message: 'User updated and promotion data inserted successfully' });
    //             } catch (error) {
    //                 console.error("Error updating additional data:", error);
    //                 await connection.rollback();
    //                 res.status(500).json({ message: "Error updating additional data." });
    //             }
    //         });
    //     } catch (error) {
    //         console.error("Error updating data:", error);
    //         await connection.rollback();
    //         res.status(500).json({ message: "Error updating data." });
    //     }
    // },


    // employee_update: async (req, res) => {
    //     try {
    //         const employeeId = req.params.id; // Assuming the ID is passed as a parameter
    //         const {
    //             experience,
    //             education,
    //             institute,
    //             result,
    //             passing_year,
    //             living_division_id,
    //             living_district_id,
    //             living_upazila_id,
    //             living_address,
    //             permanent_division_id,
    //             permanent_district_id,
    //             permanent_upazila_id,
    //             permanent_address,
    //             join_date,
    //             payroll_id,
    //             school_shift_id,
    //             designation_id,
    //             full_name,
    //             dob,
    //             gender,
    //             religion,
    //             mobile,
    //             email,
    //             password,
    //             signature_image,
    //             photo,
    //             fields
    //         } = req.body;

    //         // Query to update employee info
    //         const updateEmployeeInfoQuery = `
    //             UPDATE employe_info 
    //             SET experience = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update educational qualification
    //         const updateEducationQuery = `
    //             UPDATE educational_qualification 
    //             SET education = ?, institute = ?, result = ?, passing_year = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update living address
    //         const updateLivingAddressQuery = `
    //             UPDATE living_address 
    //             SET division_id = ?, district_id = ?, upazila_id = ?, address = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update permanent address
    //         const updatePermanentAddressQuery = `
    //             UPDATE parmanent_address 
    //             SET division_id = ?, district_id = ?, upazila_id = ?, address = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update employee joining details
    //         const updateEmployeeJoiningQuery = `
    //             UPDATE employe_joining 
    //             SET join_date = ?, payroll_id = ?, school_shift_id = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update employee promotion details
    //         const updateEmployeePromotionQuery = `
    //             UPDATE employee_promotion 
    //             SET designation_id = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update user details


    //         // Execute all update queries
    //         connection.beginTransaction(err => {
    //             if (err) {
    //                 console.error(err);
    //                 res.status(500).json({ message: 'Failed to start transaction' });
    //                 return;
    //             }

    //             connection.query(updateEmployeeInfoQuery, [experience, employeeId], (err) => {
    //                 if (err) return connection.rollback(() => {
    //                     console.error(err);
    //                     res.status(500).json({ message: 'Failed to update employee info' });
    //                 });

    //                 connection.query(updateEducationQuery, [education, institute, result, passing_year, employeeId], (err) => {
    //                     if (err) return connection.rollback(() => {
    //                         console.error(err);
    //                         res.status(500).json({ message: 'Failed to update education' });
    //                     });

    //                     connection.query(updateLivingAddressQuery, [living_division_id, living_district_id, living_upazila_id, living_address, employeeId], (err) => {
    //                         if (err) return connection.rollback(() => {
    //                             console.error(err);
    //                             res.status(500).json({ message: 'Failed to update living address' });
    //                         });

    //                         connection.query(updatePermanentAddressQuery, [permanent_division_id, permanent_district_id, permanent_upazila_id, permanent_address, employeeId], (err) => {
    //                             if (err) return connection.rollback(() => {
    //                                 console.error(err);
    //                                 res.status(500).json({ message: 'Failed to update permanent address' });
    //                             });

    //                             connection.query(updateEmployeeJoiningQuery, [join_date, payroll_id, school_shift_id, employeeId], (err) => {
    //                                 if (err) return connection.rollback(() => {
    //                                     console.error(err);
    //                                     res.status(500).json({ message: 'Failed to update employee joining' });
    //                                 });

    //                                 connection.query(updateEmployeePromotionQuery, [designation_id, employeeId], (err) => {
    //                                     if (err) return connection.rollback(() => {
    //                                         console.error(err);
    //                                         res.status(500).json({ message: 'Failed to update employee promotion' });
    //                                     });


    //                                     res.status(200).json({ message: 'Employee data updated successfully' });

    //                                 });
    //                             });
    //                         });
    //                     });
    //                 });
    //             });
    //         });

    //     } catch (error) {
    //         console.error("Error updating employee data:", error);
    //         res.status(500).json({ message: "Error updating employee data" });
    //     }
    // },


    // employee_update: async (req, res) => {
    //     try {
    //         const employeeId = req.params.id; // Assuming the ID is passed as a parameter
    //         const {
    //             experience,
    //             education,
    //             institute,
    //             result,
    //             passing_year,
    //             living_division_id,
    //             living_district_id,
    //             living_upazila_id,
    //             living_address,
    //             permanent_division_id,
    //             permanent_district_id,
    //             permanent_upazila_id,
    //             permanent_address,
    //             join_date,
    //             payroll_id,
    //             school_shift_id,
    //             designation_id,
    //             branch_id,

    //         } = req.body;

    //         // Query to update employee info
    //         const updateEmployeeInfoQuery = `
    //             UPDATE employe_info 
    //             SET experience = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update educational qualification
    //         const updateEducationQuery = `
    //             UPDATE educational_qualification 
    //             SET education = ?, institute = ?, result = ?, passing_year = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update living address
    //         const updateLivingAddressQuery = `
    //             UPDATE living_address 
    //             SET division_id = ?, district_id = ?, upazila_id = ?, address = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update permanent address
    //         const updatePermanentAddressQuery = `
    //             UPDATE parmanent_address 
    //             SET division_id = ?, district_id = ?, upazila_id = ?, address = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update employee joining details
    //         const updateEmployeeJoiningQuery = `
    //             UPDATE employe_joining 
    //             SET branch_id = ?, join_date = ?, payroll_id = ?, school_shift_id = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update employee promotion details
    //         const updateEmployeePromotionQuery = `
    //             UPDATE employee_promotion 
    //             SET designation_id = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update user details
    //         // Query to update user details



    //         // Execute all update queries
    //         connection.beginTransaction(err => {
    //             if (err) {
    //                 console.error(err);
    //                 res.status(500).json({ message: 'Failed to start transaction' });
    //                 return;
    //             }

    //             connection.query(updateEmployeeInfoQuery, [experience, employeeId], (err) => {
    //                 if (err) return connection.rollback(() => {
    //                     console.error(err);
    //                     res.status(500).json({ message: 'Failed to update employee info' });
    //                 });

    //                 connection.query(updateEducationQuery, [education, institute, result, passing_year, employeeId], (err) => {
    //                     if (err) return connection.rollback(() => {
    //                         console.error(err);
    //                         res.status(500).json({ message: 'Failed to update education' });
    //                     });

    //                     connection.query(updateLivingAddressQuery, [living_division_id, living_district_id, living_upazila_id, living_address, employeeId], (err) => {
    //                         if (err) return connection.rollback(() => {
    //                             console.error(err);
    //                             res.status(500).json({ message: 'Failed to update living address' });
    //                         });

    //                         connection.query(updatePermanentAddressQuery, [permanent_division_id, permanent_district_id, permanent_upazila_id, permanent_address, employeeId], (err) => {
    //                             if (err) return connection.rollback(() => {
    //                                 console.error(err);
    //                                 res.status(500).json({ message: 'Failed to update permanent address' });
    //                             });

    //                             connection.query(updateEmployeeJoiningQuery, [branch_id, join_date, payroll_id, school_shift_id, employeeId], (err) => {
    //                                 if (err) return connection.rollback(() => {
    //                                     console.error(err);
    //                                     res.status(500).json({ message: 'Failed to update employee joining' });
    //                                 });

    //                                 connection.query(updateEmployeePromotionQuery, [designation_id, employeeId], (err) => {
    //                                     if (err) return connection.rollback(() => {
    //                                         console.error(err);
    //                                         res.status(500).json({ message: 'Failed to update employee promotion' });
    //                                     });

    //                                     // Update user details

    //                                     res.status(200).json({ message: 'Employee data updated successfully' });
    //                                 });
    //                             });
    //                         });
    //                     });
    //                 });
    //             });
    //         });

    //     } catch (error) {
    //         console.error("Error updating employee data:", error);
    //         res.status(500).json({ message: "Error updating employee data" });
    //     }
    // },

    // employee_update: async (req, res) => {
    //     try {
    //         const employeeId = req.params.id; // Assuming the ID is passed as a parameter
    //         const {
    //             experience,
    //             fields, // This should contain an array of educational qualifications
    //             living_division_id,
    //             living_district_id,
    //             living_upazila_id,
    //             living_address,
    //             permanent_division_id,
    //             permanent_district_id,
    //             permanent_upazila_id,
    //             permanent_address,
    //             join_date,
    //             payroll_id,
    //             school_shift_id,
    //             designation_id,
    //             branch_id,
    //         } = req.body;

    //         // Query to update employee info
    //         const updateEmployeeInfoQuery = `
    //             UPDATE employe_info 
    //             SET experience = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update educational qualification
    //         const updateEducationQuery = `
    //             UPDATE educational_qualification 
    //             SET education = ?, institute = ?, result = ?, passing_year = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update living address
    //         const updateLivingAddressQuery = `
    //             UPDATE living_address 
    //             SET division_id = ?, district_id = ?, upazila_id = ?, address = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update permanent address
    //         const updatePermanentAddressQuery = `
    //             UPDATE parmanent_address 
    //             SET division_id = ?, district_id = ?, upazila_id = ?, address = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update employee joining details
    //         const updateEmployeeJoiningQuery = `
    //             UPDATE employe_joining 
    //             SET branch_id = ?, join_date = ?, payroll_id = ?, school_shift_id = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Query to update employee promotion details
    //         const updateEmployeePromotionQuery = `
    //             UPDATE employee_promotion 
    //             SET designation_id = ?
    //             WHERE user_id = ?;
    //         `;

    //         // Begin transaction
    //         connection.beginTransaction(async (err) => {
    //             if (err) {
    //                 console.error(err);
    //                 res.status(500).json({ message: 'Failed to start transaction' });
    //                 return;
    //             }

    //             try {
    //                 // Update employee info
    //                 await connection.query(updateEmployeeInfoQuery, [experience, employeeId]);

    //                 // Update educational qualifications
    //                 for (const qualification of fields) {
    //                     const { education, institute, result, passing_year } = qualification;
    //                     const updateEducationParams = [education, institute, result, passing_year, employeeId];
    //                     await connection.query(updateEducationQuery, updateEducationParams);
    //                 }

    //                 // Update living address
    //                 await connection.query(updateLivingAddressQuery, [living_division_id, living_district_id, living_upazila_id, living_address, employeeId]);

    //                 // Update permanent address
    //                 await connection.query(updatePermanentAddressQuery, [permanent_division_id, permanent_district_id, permanent_upazila_id, permanent_address, employeeId]);

    //                 // Update employee joining details
    //                 await connection.query(updateEmployeeJoiningQuery, [branch_id, join_date, payroll_id, school_shift_id, employeeId]);

    //                 // Update employee promotion details
    //                 await connection.query(updateEmployeePromotionQuery, [designation_id, employeeId]);

    //                 // Commit the transaction
    //                 connection.commit((err) => {
    //                     if (err) {
    //                         console.error(err);
    //                         return connection.rollback(() => {
    //                             res.status(500).json({ message: 'Transaction failed. Rollback performed.' });
    //                         });
    //                     }
    //                     res.status(200).json({ message: 'Employee data updated successfully', result:req.body });
    //                 });
    //             } catch (error) {
    //                 console.error('Error during transaction:', error);
    //                 connection.rollback(() => {
    //                     res.status(500).json({ message: 'Transaction failed. Rollback performed.' });
    //                 });
    //             }
    //         });
    //     } catch (error) {
    //         console.error('Error updating employee data:', error);
    //         res.status(500).json({ message: 'Error updating employee data' });
    //     }
    // },

    employee_update: async (req, res) => {
        try {


            const employeeId = req.params.id; // Assuming the ID is passed as a parameter
            const {
                experience,
                fields, // This should contain an array of educational qualifications
                living_division_id,
                living_district_id,
                living_upazila_id,
                living_address,
                permanent_division_id,
                permanent_district_id,
                permanent_upazila_id,
                permanent_address,
                join_date,
                payroll_id,
                school_shift_id,
                designation_id,
                branch_id,
                mother_phone,
                mother_name,
                father_phone,
                father_name,
                mother_service,
                father_service,
                same_as,

            } = req.body;




            // Begin transaction
            connection.beginTransaction(async (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Failed to start transaction' });
                    return;
                }

                try {
                    // Query to delete existing educational qualifications
                    const deleteEducationQuery = `
                        DELETE FROM educational_qualification 
                        WHERE user_id = ?
                    `;
                    await connection.query(deleteEducationQuery, [employeeId]);

                    // Query to insert new educational qualifications
                    const insertEducationQuery = `
                        INSERT INTO educational_qualification (user_id, education, institute, result, passing_year)
                        VALUES (?, ?, ?, ?, ?)
                    `;

                    // Insert new qualifications
                    for (const qualification of fields) {
                        const { education, institute, result, passing_year } = qualification;
                        const insertEducationParams = [employeeId, education, institute, result, passing_year];
                        await connection.query(insertEducationQuery, insertEducationParams);
                    }

                    // Update other employee information (experience, addresses, joining details, promotion)
                    const updateEmployeeInfoQuery = `
                        UPDATE employe_info 
                        SET experience = ?
                        WHERE user_id = ?;
                    `;
                    await connection.query(updateEmployeeInfoQuery, [experience, employeeId]);

                    const updateLivingAddressQuery = `
                        UPDATE living_address 
                        SET division_id = ?, district_id = ?, upazila_id = ?, address = ?, same_as = ?
                        WHERE user_id = ?;
                    `;
                    await connection.query(updateLivingAddressQuery, [living_division_id, living_district_id, living_upazila_id, living_address, same_as, employeeId]);

                    const updatePermanentAddressQuery = `
                        UPDATE parmanent_address 
                        SET division_id = ?, district_id = ?, upazila_id = ?, address = ?
                        WHERE user_id = ?;
                    `;
                    await connection.query(updatePermanentAddressQuery, [permanent_division_id, permanent_district_id, permanent_upazila_id, permanent_address, employeeId]);

                    const updateEmployeeJoiningQuery = `
                        UPDATE employe_joining 
                        SET branch_id = ?, join_date = ?, payroll_id = ?, school_shift_id = ?
                        WHERE user_id = ?;
                    `;
                    await connection.query(updateEmployeeJoiningQuery, [branch_id, join_date, payroll_id, school_shift_id, employeeId]);

                    const updateEmployeePromotionQuery = `
                        UPDATE employee_promotion 
                        SET designation_id = ?
                        WHERE user_id = ?;
                    `;
                    await connection.query(updateEmployeePromotionQuery, [designation_id, employeeId]);

                    const updatePCQuery = `
                        UPDATE parent_contact 
                        SET father_phone = ?, mother_phone = ? 
                        WHERE user_id = ?;
                    `;
                    await connection.query(updatePCQuery, [father_phone, mother_phone, employeeId]);

                    const updateUPQuery = `
                        UPDATE user_parent 
                        SET father_name = ?, mother_name = ?, father_service = ?, mother_service = ?
                        WHERE user_id = ?;
                    `;
                    await connection.query(updateUPQuery, [father_name, mother_name, father_service, mother_service, employeeId]);

                    // Commit the transaction
                    connection.commit((err) => {
                        if (err) {
                            console.error(err);
                            return connection.rollback(() => {
                                res.status(500).json({ message: 'Transaction failed. Rollback performed.' });
                            });
                        }
                        res.status(200).json({ message: 'Employee data updated successfully' });
                    });
                } catch (error) {
                    console.error('Error during transaction:', error);
                    connection.rollback(() => {
                        res.status(500).json({ message: 'Transaction failed. Rollback performed.' });
                    });
                }
            });
        } catch (error) {
            console.error('Error updating employee data:', error);
            res.status(500).json({ message: 'Error updating employee data' });
        }
    },



    user_update: async (req, res) => {

        try {
            const {
                full_name,
                mother_name,
                father_name,
                dob,
                gender,
                religion,
                mobile,
                email,
                password,
                signature_image,
                photo,
                modified_by,
                unique_id,
                blood_group_id,
                NID,
            } = req.body;

            const query = `UPDATE users 
              SET full_name = ?,
               unique_id = ?,
                blood_group_id = ?,
                NID = ?,
                  mother_name = ?,
                  father_name = ?,
                  dob = ?,
                  gender = ?,
                  religion = ?,
                  mobile = ?,
                  email = ?,
                  password = ?,
                  signature_image = ?,
                  photo = ?
              WHERE id = ?`;

            connection.query(query, [
                full_name,
                unique_id,
                blood_group_id,
                NID,
                mother_name,
                father_name,
                dob,
                gender,
                religion,
                mobile,
                email,
                password,
                signature_image,
                photo,
                req.params.id,
                modified_by
            ], (error, result) => {
                if (error) {
                    console.error('Error updating user:', error);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }
                if (result.affectedRows === 0) {
                    console.log('User not found');
                    return res.status(404).json({ message: 'User not found.' });
                }
                console.log('User updated successfully:', result);
                return res.json({ message: 'User updated successfully.' });
            });
        } catch (error) {
            console.error('Caught error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    designation_list: async (req, res) => {
        try {
            const data = "select * from  designation";

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

    gender_list: async (req, res) => {
        try {
            const data = "select * from  gender";

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

    religion_list: async (req, res) => {
        try {
            const data = "select * from  religion";

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

    employee_list: async (req, res) => {
        try {
            const data = "select * from  employe_info";

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

    promotion_create: async (req, res) => {
        try {

            const { payroll_id, modified_by, designation_id } = req.body;


            const query = `UPDATE employee_promotion SET   name = ?, start_time = ?, late_time = ?, end_time = ?, early_end_time = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [name, start_time, late_time, end_time, early_end_time, modified_by, req.params.id], (error, result) => {
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

    // employee_promotion_create: async (req, res) => {
    //     try {

    //         const { designation_id, payroll_id, promotion_month, modified_by } = req.body;


    //         const query = `UPDATE employee_promotion SET   designation_id = ?, payroll_id = ?, promotion_month = ? modified_by = ? WHERE user_id = ?`;
    //         connection.query(query, [designation_id, payroll_id, promotion_month, modified_by, req.params.id], (error, result) => {
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

    employee_promotion_create: async (req, res) => {
        try {
            const { designation_id, payroll_id, promotion_month, modified_by, branch_id } = req.body;

            const query = `UPDATE employee_promotion SET designation_id = ?, payroll_id = ?, promotion_month = ?, modified_by = ?, branch_id = ? WHERE user_id = ?`;
            connection.query(query, [designation_id, payroll_id, promotion_month, modified_by, branch_id, req.params.id], (error, result) => {
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
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error.' });
        }
    },

    employee_list_role_wise: async (req, res) => {
        try {
            const data = `
               SELECT users.id, users.token
            FROM users
            INNER JOIN employe_joining 
            ON users.id = employe_joining.user_id;
            `;

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


    employee_geo: async (req, res) => {
        try {
            const userId = req.params.id; // Assuming user_id is passed as a route parameter

            if (!userId) {
                return res.status(400).send({ error: "user_id is required" });
            }

            const query = "SELECT * FROM geo_location WHERE user_id = ?";

            connection.query(query, [userId], function (error, result) {
                if (error) {
                    console.error(error);
                    return res.status(500).send({ error: "An error occurred while querying the database" });
                }

                res.send(result);
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "An internal server error occurred" });
        }
    },

    employee_location_search: async (req, res) => {
        const { selectedEmployeeId, fromDate, toDate } = req.body;

        try {
            // Parse fromDate and toDate as Date objects
            const parsedFromDate = new Date(fromDate);
            const parsedToDate = new Date(toDate);

            // Make sure fromDate and toDate are valid Date objects
            if (isNaN(parsedFromDate.getTime()) || isNaN(parsedToDate.getTime())) {
                throw new Error('Invalid date format');
            }

            // Set the time to the end of the day for the parsedToDate to ensure inclusivity
            parsedToDate.setHours(23, 59, 59, 999);

            // Convert fromDate and toDate to ISO format
            const isoFromDate = parsedFromDate.toISOString();
            const isoToDate = parsedToDate.toISOString();

            // Make API request to fetch data based on selectedEmployeeId, fromDate, toDate
            const response = await axios.get(`http://localhost:5002/Admin/location/geo_location_all/${selectedEmployeeId}`, {
                params: {
                    fromDate: isoFromDate,
                    toDate: isoToDate
                }
            });

            // Extract data from response
            const data = response.data;
            console.log(data);

            // Filter data based on date range
            const filteredData = data.filter(item => {
                const itemDate = new Date(item.created_date);
                return itemDate >= parsedFromDate && itemDate <= parsedToDate;
            });
            console.log(filteredData);

            // Return filtered data as JSON response
            res.json({ results: filteredData });
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'An error occurred during search.' });
        }
    },
    // employee_location_search: async (req, res) => {

    //     const { selectedEmployeeId, fromDate, toDate } = req.body;

    //     try {
    //         // Parse fromDate and toDate as Date objects
    //         const parsedFromDate = new Date(fromDate);
    //         const parsedToDate = new Date(toDate);

    //         // Make sure fromDate and toDate are valid Date objects
    //         if (isNaN(parsedFromDate.getTime()) || isNaN(parsedToDate.getTime())) {
    //             throw new Error('Invalid date format');
    //         }

    //         // Convert fromDate and toDate to ISO format
    //         const isoFromDate = parsedFromDate.toISOString();
    //         const isoToDate = parsedToDate.toISOString();

    //         // Make API request to fetch data based on selectedEmployeeId, fromDate, toDate
    //         const response = await axios.get(`http://192.168.0.188:5002/Admin/location/geo_location_all/${selectedEmployeeId}`, {
    //             params: {
    //                 fromDate: isoFromDate,
    //                 toDate: isoToDate
    //             }
    //         });

    //         // Extract data from response
    //         const data = response.data;
    //         console.log(data)
    //         // Filter data based on date range
    //         const filteredData = data.filter(item => {
    //             const itemDate = new Date(item.created_date);
    //             return itemDate >= parsedFromDate && itemDate <= parsedToDate;
    //         });
    //         console.log(filteredData)
    //         // Return filtered data as JSON response
    //         res.json({ results: filteredData });
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //         res.status(500).json({ error: 'An error occurred during search.' });
    //     }
    // },

    employee_location_pdf: async (req, res) => {
        try {
            const { searchResults } = req.body;

            const selectedColumns = ['Serial', 'User', 'Latitude', 'Longitude', 'Time', 'Name', 'Mobile', 'Designation', 'Branch']; // Specify columns to include

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';
                selectedColumns.forEach(column => {
                    if (column === 'Serial') {
                        row += `<td>${index + 1}</td>`;
                    } else if (column === 'User') {
                        row += `<td>${result.user_id}</td>`;
                    } else if (column === 'Latitude') {
                        row += `<td>${result.latitude}</td>`;
                    } else if (column === 'Longitude') {
                        row += `<td>${result.longitude}</td>`;
                    }
                    else if (column === 'Time') {
                        row += `<td>${result.created_date}</td>`;
                    }
                    else if (column === 'Name') {
                        row += `<td>${result.full_name}</td>`;
                    }
                    else if (column === 'Mobile') {
                        row += `<td>${result.mobile}</td>`;
                    }
                    else if (column === 'Designation') {
                        row += `<td>${result.designation_id}</td>`;
                    }
                    else if (column === 'Branch') {
                        row += `<td>${result.branch_id}</td>`;
                    }
                });
                row += '</tr>';
                tableRows += row;
            });

            const html = `<html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Employee Location PDF</title>
                <style>
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
                </style>
              </head>
              <body>
                <h2>Employee Location Data</h2>
                <table>
                  <thead>
                    <tr>
                      ${selectedColumns.map(column => `<th>${column}</th>`).join('')}
                    </tr>
                  </thead>
                  <tbody>
                    ${tableRows}
                  </tbody>
                </table>
              </body>
            </html>`;

            wkhtmltopdf(html, { pageSize: 'letter' }, (err, stream) => {
                if (err) {
                    console.error('Error generating PDF:', err);
                    res.status(500).send('Error generating PDF');
                    return;
                }
                res.setHeader('Content-Type', 'application/pdf');
                stream.pipe(res);
            });

        } catch (error) {
            console.error('Error in employee_location_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },

    //   employee_geo_location_all: async (req, res) => {
    //     try {
    //         const employeeDataQuery = `
    //         SELECT 
    //             ei.*, 
    //             ei.experience, 
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
    //             eg.latitude,
    //             eg.longitude,
    //              eg.created_date
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
    //             employee_geo eg ON ei.user_id = eg.user_id
    //         WHERE
    //             ei.user_id = u.id
    //         `;
    //         connection.query(employeeDataQuery, async (err, results) => {
    //             if (err) {
    //                 console.error(err);
    //                 res.status(500).json({ message: 'Failed to fetch employee data' });
    //                 return;
    //             }
    //             res.status(200).json(results);
    //         });
    //     } catch (error) {
    //         console.error("Error fetching employee data:", error);
    //         res.status(500).json({ message: "Error fetching employee data" });
    //     }
    // },

    // employee_geo_location_all: async (req, res) => {
    //     try {
    //         const employeeId = req.params.id; // Assuming the ID is passed as a parameter

    //         const employeeDataQuery = `
    //         SELECT 
    //             ei.*, 
    //             ei.experience, 
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
    //             eg.latitude,
    //             eg.longitude,
    //             eg.created_date
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
    //             employee_geo eg ON ei.user_id = eg.user_id
    //         WHERE
    //             ei.user_id = ?`;

    //         connection.query(employeeDataQuery, [employeeId], async (err, results) => {
    //             if (err) {
    //                 console.error(err);
    //                 res.status(500).json({ message: 'Failed to fetch employee data' });
    //                 return;
    //             }
    //             if (results.length === 0) {
    //                 res.status(404).json({ message: 'Employee not found' });
    //                 return;
    //             }
    //             res.status(200).json(results[0]); // Assuming you only expect one result for a given ID
    //         });
    //     } catch (error) {
    //         console.error("Error fetching employee data:", error);
    //         res.status(500).json({ message: "Error fetching employee data" });
    //     }
    // },

    employee_geo_location_all: async (req, res) => {
        try {
            const employeeId = req.params.id; // Assuming the ID is passed as a parameter

            const employeeDataQuery = `
            SELECT 
                ei.*, 
                ei.experience, 
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
                ej.branch_id AS branch_id,
                ej.school_shift_id AS school_shift_id,
                ep.designation_id AS designation_id,
                u.full_name,
                u.father_name,
                u.mother_name,
                u.dob,
                u.gender,
                u.religion,
                u.mobile,
                u.email,
                u.password,
                u.signature_image,
                u.photo,
                gl.latitude,
                gl.longitude,
                gl.created_date
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
                geo_location gl ON ei.user_id = gl.user_id
            WHERE
                ei.user_id = ?`;

            connection.query(employeeDataQuery, [employeeId], async (err, results) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Failed to fetch employee data' });
                    return;
                }
                if (results.length === 0) {
                    res.status(404).json({ message: 'Employee not found' });
                    return;
                }
                res.status(200).json(results); // Return all matching rows
            });
        } catch (error) {
            console.error("Error fetching employee data:", error);
            res.status(500).json({ message: "Error fetching employee data" });
        }
    },

    employee_geo_location_all_current_date: async (req, res) => {
        try {
            const currentDate = new Date().toISOString().split('T')[0]; // Get current date in yyyy-mm-dd format

            const employeeId = req.params.id; // Assuming the ID is passed as a parameter

            const employeeDataQuery = `
            SELECT 
                ei.*, 
                ei.experience, 
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
                ej.branch_id AS branch_id,
                ej.school_shift_id AS school_shift_id,
                ep.designation_id AS designation_id,
                u.full_name,
                u.father_name,
                u.mother_name,
                u.dob,
                u.gender,
                u.religion,
                u.mobile,
                u.email,
                u.password,
                u.signature_image,
                u.photo,
                gl.latitude,
                gl.longitude,
                gl.created_date
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
                geo_location gl ON ei.user_id = gl.user_id
            WHERE
                ei.user_id = ? AND
                DATE(gl.created_date) = ?`; // Filter by created_date matching current date

            connection.query(employeeDataQuery, [employeeId, currentDate], async (err, results) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Failed to fetch employee data' });
                    return;
                }
                if (results.length === 0) {
                    res.status(404).json({ message: 'Employee not found' });
                    return;
                }
                res.status(200).json(results); // Return all matching rows with current date
            });
        } catch (error) {
            console.error("Error fetching employee data:", error);
            res.status(500).json({ message: "Error fetching employee data" });
        }
    },


    employee_search: async (req, res) => {

        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { searchQuery, itemName, employee, shift, payroll, employee_id, fromDate, toDate, multiSearch } = req.body;
            console.log(multiSearch, "Search button clicked.");
            // Construct the base SQL query
            // school_shift_id
            let sql = `
               SELECT 
            ej.join_date AS join_date,
            ep.payroll_id AS payroll_id,
            ep.school_shift_id AS shift_id,
            ep.designation_id AS designation_id,
            ep.branch_id AS branch_id,
            d.designation_name,
            u.full_name,
            u.father_name,
            u.mother_name,
            u.dob,
            u.id As user_id,
            u.gender,
            u.religion,
            u.mobile,
            u.unique_id,
            u.email,
            u.photo,
            up.father_name AS e_father_name,
            up.mother_name AS e_mother_name,
            b.branch_name AS branch_name,              -- Get branch name
            p.title AS payroll_name,            -- Get payroll name
            ss.name AS school_shift_name               -- Get school shift name
        FROM 
            employe_joining ej
         JOIN 
            employee_promotion ep ON ej.user_id = ep.user_id
         JOIN 
            users u ON ej.user_id = u.id
         JOIN 
            designation d ON ep.designation_id = d.id
         JOIN 
            user_parent up ON ep.user_id = up.user_id
         JOIN 
            branch_info b ON ep.branch_id = b.id         -- Join branch_info to get branch_name
         JOIN 
            payroll p ON ep.payroll_id = p.id            -- Join payroll to get payroll_name
         JOIN 
            school_shift ss ON ep.school_shift_id = ss.id -- Join school_shift to get school_shift_name
        WHERE
            ej.user_id IN (SELECT DISTINCT user_id FROM employe_joining)
              AND 1=1
            `;

            // Add search conditions based on the provided parameters
            if (employee) {

                sql += ` AND LOWER(u.full_name) LIKE '%${employee}%'`;
            }

            if (fromDate && toDate) {
                sql += ` AND ej.join_date BETWEEN '${fromDate}' AND '${toDate}'`;
            }
            if (searchQuery) {
                sql += ` AND ep.designation_id LIKE '%${searchQuery}%'`;
            }

            if (itemName) {
                sql += ` AND ep.branch_id LIKE '%${itemName}%'`;
            }

            if (shift) {
                sql += ` AND ep.school_shift_id LIKE '%${shift}%'`;
            }
            if (payroll) {
                sql += ` AND ep.payroll_id LIKE '%${payroll}%'`;
            }
            if (employee_id) {
                sql += ` AND  u.unique_id LIKE '%${employee_id}%'`;
            }

            if (multiSearch && multiSearch.length > 0) {
                sql += ` ORDER BY ${multiSearch}`; // Append convertedData to the ORDER BY clause
            }
            // sql += ` GROUP BY attendance.user_id, check_date`;


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

    employee_search_id_card: async (req, res) => {

        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { designation } = req.body;

            // Construct the base SQL query
            // school_shift_id
            let sql = `
                SELECT 
                    ei.*, 
                    la.division_id AS living_division_id,
                    la.same_as AS same_as,
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
                    ej.branch_id AS branch_id,
                    ep.designation_id AS designation_id,
                    d.designation_name,
                    u.full_name,
                    u.unique_id,
                    u.blood_group_id,
                    bg.blood_group_name AS blood_group_name,  -- Fetch blood group name
                    u.dob,
                    u.gender,
                    u.religion,
                    u.mobile,
                    u.email,
                    u.password,
                    u.signature_image,
                    u.photo,
                    u.NID,
                    up.father_name AS e_father_name,
                    up.mother_name AS e_mother_name,
                    up.father_service AS father_service,
                    up.mother_service AS mother_service,
                    pc.father_phone AS father_phone,
                    pc.mother_phone AS mother_phone
                FROM 
                    employe_info ei
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
                LEFT JOIN 
                    blood_group bg ON u.blood_group_id = bg.id
        WHERE
            ej.user_id IN (SELECT DISTINCT user_id FROM employe_joining)
              AND 1=1
            `;

            // Add search conditions based on the provided parameters

            if (designation) {
                sql += ` AND  ei.user_id LIKE '%${designation}%'`;
            }


            sql += ` ORDER BY ei.user_id`; // Append convertedData to the ORDER BY clause

            // sql += ` GROUP BY attendance.user_id, check_date`;


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
    employee_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
     SELECT 
                ei.*,
                ej.join_date AS join_date,
                ep.payroll_id AS payroll_id,
                ep.school_shift_id AS school_shift_id,
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
                u.photo,
                up.father_name AS e_father_name,
                up.mother_name AS e_mother_name,
                b.branch_name AS branch_name,              -- Get branch name
                p.title AS payroll_name,            -- Get payroll name
                ss.name AS school_shift_name               -- Get school shift name
            FROM 
                employe_info ei
           LEFT  JOIN 
                employe_joining ej ON ei.user_id = ej.user_id
            LEFT JOIN 
                employee_promotion ep ON ei.user_id = ep.user_id
           LEFT  JOIN 
                users u ON ei.user_id = u.id
           LEFT  JOIN 
                designation d ON ep.designation_id = d.id
           LEFT  JOIN 
                user_parent up ON ep.user_id = up.user_id
            LEFT JOIN 
                branch_info b ON ep.branch_id = b.id         -- Join branch_info to get branch_name
           LEFT  JOIN 
                payroll p ON ep.payroll_id = p.id            -- Join payroll to get payroll_name
            LEFT JOIN 
                school_shift ss ON ep.school_shift_id = ss.id -- Join school_shift to get school_shift_name
            WHERE
                ei.user_id IN (SELECT DISTINCT user_id FROM employe_joining)
      ORDER BY u.id DESC
      LIMIT ?, ?
    `;

            connection.query(query, [skipRows, perPage], (error, result) => {
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


    employee_pdf: async (req, res) => {
        try {
            const { searchResults, selectedColumns, fontSize, orientation, selectedPrintSize } = req.body; // Assuming selectedColumns is an array of column names

            console.log(searchResults, 'here all the searchResults');

            const longTextColumns = ['full_name', 'description'];
            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';
                selectedColumns.forEach(column => {
                    if (column === 'serial') {
                        row += `<td>${index + 1}</td>`; // Displaying index number starting from 1
                    } else if (column === 'action') {
                        // Skip this column
                    }
                    else if (column === 'join_date') {
                        row += `<td>${result.join_date.slice(0, 10)}</td>`; // Displaying index number starting from 1
                    }


                    else if (column === 'photo') {
                        if (result[column]) {
                            // Encode the image URL
                            const encodedURL = encodeURIComponent(result[column]);
                            console.log(`http://localhost/:5003/${result[column]}`, 'encodedURL welcome');
                            // const encodedURL = encode(result[column]);
                            row += `<td><img src="http://localhost/:5003/${result[column]}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`;
                        } else {
                            // No file path provided, show a placeholder message
                            row += `<td></td>`;
                        }
                    }
                    else {
                        const style = longTextColumns.includes(column) ? 'word-wrap: break-word; word-break: break-all;' : '';
                        row += `<td style="${style}">${result[column]}</td>`;

                    }
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
         <h2 style="margin: 0; padding: 0;">Pathshala School & College category List</h2>
         <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
         <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
         <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
         <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">category List</h3>
         </div>
         <div class="container2" style:"display: flex;
         justify-content: space-between;">
         <p style="margin: 0; padding: 0;">Receipt No: 829</p>
         <p style="margin: 0; padding: 0;">Collected By:</p>
         <p style="margin: 0; padding: 0;">Date: </p>
        </div>
              <table>
                  <thead>
                      <tr>
                          ${selectedColumns.filter(column => column !== 'action').map(column => {
                if (column === 'status_id') {
                    return `<th>Status</th>`;
                }
                else if (column === 'file_path') {
                    return `<th>File</th>`;
                }
                else {
                    return `<th>${formatString(column)}</th>`;
                }
            }).join('')}
                      </tr>
                  </thead>
                  <tbody >
                      ${tableRows}
                  </tbody>
              </table>
          </body>
          </html>`;

            wkhtmltopdf(html, { pageSize: pageSize, orientation: pageOrientation }, (err, stream) => {
                if (err) {
                    console.error('Error generating PDF:', err);
                    res.status(500).send('Error generating PDF');
                    return;
                }
                stream.pipe(res);
            });
        } catch (error) {
            console.error('Error in category_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },


    employee_list_print: async (req, res) => {
        try {
            const { searchResults, selectedColumns, fontSize, orientation, selectedPrintSize, extraColumnValue } = req.body;

            // Debugging logs
            console.log('searchResults:', searchResults);
            console.log('selectedColumns:', selectedColumns);

            let tableRows = '';
            let extraColumnHeaders = '';
            let extraColumnData = '';
            let header = '<tr>';

            // Create table headers based on selectedColumns
            if (selectedColumns && selectedColumns.length > 0) {
                selectedColumns.forEach(column => {
                    header += `<th>${column}</th>`;
                });
            }

            // Create editable extra columns based on extraColumnValue
            if (extraColumnValue && extraColumnValue > 0) {
                for (let i = 1; i <= extraColumnValue; i++) {
                    extraColumnHeaders += `<th><input type="text" name="extraColumnHeader_${i}" value="Column ${i}" /></th>`;
                }
            }

            header += extraColumnHeaders;
            header += '</tr>';

            // Create table rows based on searchResults and selectedColumns
            searchResults.forEach((result, i) => {
                let row = '<tr>';
                selectedColumns.forEach(column => {
                    if (column === 'photo') {
                        // Display image for the 'photo' column
                        row += `<td><img src="http://localhost/:5003/${result[column]}" alt="Photo" /></td>`;
                    } else if (column === 'join_date') {
                        // Format the 'join_date' column
                        row += `<td>${result[column]?.slice(0, 10) || ''}</td>`;

                    } else if (column === 'serial') {
                        // Format the 'join_date' column
                        row += `<td>${i + 1}</td>`;
                    }

                    else {
                        row += `<td>${result[column] || ''}</td>`;
                    }
                });

                // If extra columns are defined, add editable cells for them
                if (extraColumnValue && extraColumnValue > 0) {
                    for (let i = 1; i <= extraColumnValue; i++) {
                        row += `<td><input type="text" name="extraColumnData_${result.id}_${i}" value="" /></td>`;
                    }
                }

                row += '</tr>';
                tableRows += row;
            });

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
                        ${formatString(header)}
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
            console.error('Error in employee_list_print:', error);
            res.status(500).send('Error generating print view');
        }
    },


    employee_id_card_setting_list: async (req, res) => {
        try {
            const data = "SELECT * FROM employee_id_card_setting";

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

    employee_id_card_setting_back_list: async (req, res) => {
        try {
            const data = "SELECT * FROM employee_id_card_setting_back";

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


    employee_id_card_all_create: async (req, res) => {
        try {
            const { formData, rows } = req.body;

            // Update `employee_id_card_setting_back` table with formData
            const updateFormDataQuery = `
                UPDATE employee_id_card_setting_back
                SET upper_text_1 = ?, upper_text_2 = ?, move_to_left = ?
                WHERE id = 1;  -- Assuming the update is based on a fixed ID, you can modify this as needed
            `;

            const formDataValues = [
                formData["1"].upper_text_1,
                formData["1"].upper_text_2,
                formData["1"].move_to_left
            ];

            // Update formData in the `employee_id_card_setting_back` table
            connection.query(updateFormDataQuery, formDataValues, (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Failed to update form data.' });
                }

                // Process `rows` data for insertion or update in `employee_id_card_setting` table
                rows.forEach((row) => {
                    const { id, display_name, column_name, sorting, role_name, status } = row;

                    // First, check if this row already exists in the `employee_id_card_setting` table
                    const checkIfExistsQuery = `
                        SELECT COUNT(*) AS count FROM employee_id_card_setting WHERE id = ?;
                    `;

                    connection.query(checkIfExistsQuery, [id], (checkError, checkResult) => {
                        if (checkError) {
                            console.log(checkError);
                            return res.status(500).json({ message: 'Failed to check existing row.' });
                        }

                        if (checkResult[0].count > 0) {
                            // If the row exists, update it
                            const updateRowQuery = `
                                UPDATE employee_id_card_setting
                                SET display_name = ?, column_name = ?, sorting = ?, role_name = ?, status = ?
                                WHERE id = ?;
                            `;
                            const updateValues = [display_name, column_name, sorting, 4, status, id];

                            connection.query(updateRowQuery, updateValues, (updateError, updateResult) => {
                                if (updateError) {
                                    console.log(updateError);
                                    return res.status(500).json({ message: 'Failed to update row.' });
                                }

                                console.log('Row updated:', updateResult);
                            });
                        } else {
                            // If the row does not exist, insert it
                            const insertRowQuery = `
                                INSERT INTO employee_id_card_setting (id, display_name, column_name, sorting, role_name, status)
                                VALUES (?, ?, ?, ?, ?, ?);
                            `;
                            const insertValues = [id, display_name, column_name, sorting, 4, status];

                            connection.query(insertRowQuery, insertValues, (insertError, insertResult) => {
                                if (insertError) {
                                    console.log(insertError);
                                    return res.status(500).json({ message: 'Failed to insert row.' });
                                }

                                console.log('Row inserted:', insertResult);
                            });
                        }
                    });
                });

                return res.send({ message: 'Data processed successfully.' });
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error.' });
        }
    },


    employee_id_card_setting_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM employee_id_card_setting WHERE id = ?';
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



    employee__id_card_list_print: async (req, res) => {
        try {
            const { selectedPrintSize, orientation, searchResults, filteredSettings, filteredSettingss, filteredSetting, template, templateSide, employee_id_card_setting_back_list, formData , toDates, fromDates} = req.body;
            const formatDate = (date) => {
                const day = String(date?.getDate()).padStart(2, '0');
                const month = String(date?.getMonth() + 1).padStart(2, '0');
                const year = String(date?.getFullYear());
                return `${day}-${month}-${year}`;
            };
            let tableRows = '';

            // Iterate through the search results and construct rows for each employee
            searchResults.forEach((searchResult, i) => {
                // Template 1 logic (First template)
                const photoSrc = searchResult?.photo && searchResult?.photo.trim() !== ""
                    ? `http://192.168.0.114:5003/${searchResult?.photo}`
                    : 'https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg';

                if (template == 1) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                           
                            <div style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                                <div class="id-card-containerss" >
                                    <div class="header">
                                        <div>
                                            <img style="height: 25px; width: 25px; border-radius: 50%; object-fit: cover;" class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                        </div>
                                        <div>
                                            <p style="font-weight: bold;">Abdul Malek Master Kindergarten<br />and High School</p>
                                            
                                            <h6 style="text-align: left; margin-left: 14px; font-size: 10px; margin-top: 5px;">IDENTITY CARD</h6>
                                        </div>
                                    </div>
                                    <div class="rotate-img imgs">
                                        <img style=" 
                                        height: 80px;
                                        width: 85px;
                                        margin-left: -15px;
                                        margin-top: -16px;
                                        clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
                                        " src=${photoSrc} />
                                    </div>
                                    <div class="text">
                                        <p class="rotate-text-left"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                        <p class="rotate-text-right"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                    </div>
                                    <div class="details">
                                        <table class="details">
                                            <tbody>
                                                ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                        <tr key="${setting.id}">
                                                            <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                            <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                        </tr>
                                                    `;
                        }).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="id-card-container">
                                    <div class="id-card-content">
                                        <p class="id-card-issue-date">Issue Date: ${(fromDates)}</p>
                                        <p class="id-card-expire-date">Expire Date: ${(toDates)}</p>
                                        <p class="id-card-instructions">
                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                        </p>
                                        <div class="id-card-qr-code">
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                        </div>
                                        <p class="id-card-school-info">
                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                Phone: 01735879633</small>
                                        </p>
                                    </div>
                             
                                </div>
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                           <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;' >
                           <div class="id-card-containerss" >
                                    <div class="header">
                                        <div>
                                            <img style="height: 25px; width: 25px; border-radius: 50%; object-fit: cover;" class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                        </div>
                                        <div>
                                            <p style="font-weight: bold;">Abdul Malek Master Kindergarten<br />and High School</p>
                                            
                                            <h6 style="text-align: left; margin-left: 14px; font-size: 10px; margin-top: 5px;">IDENTITY CARD</h6>
                                        </div>
                                    </div>
                                    <div class="rotate-img imgs">
                                        <img style=" 
                                        height: 80px;
                                        width: 85px;
                                        margin-left: -15px;
                                        margin-top: -16px;
                                        clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
                                        " src=${photoSrc} />
                                    </div>
                                    <div class="text">
                                        <p class="rotate-text-left"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                        <p class="rotate-text-right"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                    </div>
                                    <div class="details">
                                        <table class="details">
                                            <tbody>
                                                ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                        <tr key="${setting.id}">
                                                            <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                            <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                        </tr>
                                                    `;
                        }).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                        <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;' >
                            <div class="id-card-container">
                                    <div class="id-card-content">
                                        <p class="id-card-issue-date">Issue Date: ${(fromDates)}</p>
                                        <p class="id-card-expire-date">Expire Date: ${(toDates)}</p>
                                        <p class="id-card-instructions">
                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                        </p>
                                        <div class="id-card-qr-code">
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                        </div>
                                        <p class="id-card-school-info">
                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                Phone: 01735879633</small>
                                        </p>
                                    </div>
                             
                                </div>
                                </div>
                         `
                    }
                }

                if (template == 2) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div  style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               

                                                                    <div class="id-card-containers2">
                                                                        <div class="headers">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; 
                                                                                    object-fit: cover;   
                                                                               " class="logos" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style="font-Weight: bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; margin-left: 14px; font-size: 10px; margin-top: 5px;">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>


                                                                        <div class="photos" >
                                                                            <img src=${photoSrc} />
                                                                        </div>




                                                                        <div class="detailss">
                                                                            <table class="detailss">
                                                                            <tbody>
 ${filteredSetting.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                        <tr key="${setting.id}">
                                                            <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                            <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                        </tr>
                                                    `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>


                                                                        <div class="footers">
                                                                            <div class="signatures">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                               
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-containers">
                                                                        <div class="id-card-contents">
                                                                            <p class="id-card-issue-dates">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-dates">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructionss">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-codes">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-infos">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                          
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                          <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               

                                                                    <div class="id-card-containers2">
                                                                        <div class="headers">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; 
                                                                                    object-fit: cover;   
                                                                               " class="logos" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style="font-Weight: bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; margin-left: 14px; font-size: 10px; margin-top: 5px;">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>


                                                                        <div class="photos" >
                                                                            <img src=${photoSrc} />
                                                                        </div>




                                                                        <div class="detailss">
                                                                            <table class="detailss">
                                                                            <tbody>
 ${filteredSetting.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                        <tr key="${setting.id}">
                                                            <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                            <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                        </tr>
                                                    `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>


                                                                        <div class="footers">
                                                                            <div class="signatures">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                               
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>

                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                         <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                             <div class="id-card-containers">
                                                                        <div class="id-card-contents">
                                                                            <p class="id-card-issue-dates">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-dates">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructionss">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-codes">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-infos">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                                    </div>
                         `
                    }
                }
                if (template == 3) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               

                                                                 

                                                                    <div class="id-card-containersa1">
                                                                        <div class="header1">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%;
                                                                                    object-fit: cover; " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style="font-weight: bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left: margin-left: 14px; font-size: 10px; margin-top: 5px;">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div class="imgs">
                                                                                    <img style="height: 90px;
    width: 90px;
    border-radius: 50px;
    margin-top: -18px;
    margin-left: -20px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p style="     transform: rotate(270deg);
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 115px;
    left: -15px;
    font-size: 12px;
    font-weight: bold;
    width: 55px;
    text-align: center;" className='rotate-text-lefts1'><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="transform: rotate(270deg);
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 115px;
    right: -16px;
    font-size: 12px;
    font-weight: bold;
    width: 55px;
    text-align: center;" className='rotate-text-rights1'><small>${searchResult?.unique_id || 'ID: No. N/A'}</small></p>
                                                                                </div>
                                                                       
                                                                        <div class="details1">
                                                                            <table class="details1">
                                                                            <tbody>
                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer1">
                                                                            <div class="signature1">
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container1">
                                                                        <div class="id-card-content1">
                                                                            <p class="id-card-issue-date1">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date1">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions1">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code1">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info1">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                             
                                                          
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                            <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               

                                                            
                                                                    <div class="id-card-containersa1">
                                                                        <div class="header1">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    borderRadius: 50%;
                                                                                    object-fit: cover; " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style="font-weight: bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left: margin-left: 14px; font-size: 10px; margin-top: 5px;">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div class="imgs">
                                                                                    <img style="height: 90px;
    width: 90px;
    border-radius: 50px;
    margin-top: -18px;
    margin-left: -20px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p style="     transform: rotate(270deg);
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 115px;
    left: -15px;
    font-size: 12px;
    font-weight: bold;
    width: 55px;
    text-align: center;" className='rotate-text-lefts1'><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="transform: rotate(270deg);
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 115px;
    right: -16px;
    font-size: 12px;
    font-weight: bold;
    width: 55px;
    text-align: center;" className='rotate-text-rights1'><small>${searchResult?.unique_id || 'ID: No. N/A'}</small></p>
                                                                                </div>
                                                                       
                                                                        <div class="details1">
                                                                            <table class="details1">
                                                                            <tbody>
                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer1">
                                                                            <div class="signature1">
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                         <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               <div class="id-card-container1">
                                                                        <div class="id-card-content1">
                                                                            <p class="id-card-issue-date1">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date1">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions1">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code1">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info1">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                                    </div>
                         `
                    }
                }
                if (template == 4) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
                                                                    <div class="id-card-container122">
                                                                        <div class="header12">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style="fontWeight:bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="textAlign: left; margin-left: 14px; font-size:10px; margin-top:5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        

<div class="imgs">
                                                                                    <img style="    height: 89px;
    width: 89px;
    border-radius: 50px;
    margin-top: -24px;
    margin-left: -19px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="    width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 35px;
    left: -16px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 35px;
    right: 24px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details12">
                                                                            <table class="details12">
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer12">
                                                                            <div class="signature12">
                                                                             
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container12">
                                                                        <div class="id-card-content12">
                                                                            <p class="id-card-issue-date12">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date12">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions12">
                                                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code12">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info12">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                
                                                             
                                                          
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                                <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
                                                                    <div class="id-card-container122">
                                                                        <div class="header12">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style="fontWeight:bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="textAlign: left; margin-left: 14px; font-size:10px; margin-top:5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        

<div class="imgs">
                                                                                    <img style="    height: 89px;
    width: 89px;
    border-radius: 50px;
    margin-top: -24px;
    margin-left: -19px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="    width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 35px;
    left: -16px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 35px;
    right: 24px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details12">
                                                                            <table class="details12">
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer12">
                                                                            <div class="signature12">
                                                                             
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                         <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                                 <div class="id-card-container12">
                                                                        <div class="id-card-content12">
                                                                            <p class="id-card-issue-date12">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date12">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions12">
                                                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code12">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info12">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                                    </div>
                         `
                    }
                }
                if (template == 5) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
                                                                 <div class="id-card-container55">
                                                                        <div class="header5">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style=" font-weight: bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style=" text-align: left; margin-left: 14px; font-size: 10px; margin-top: 5px ">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                       
<div class="imgs2">
                                                                                    <img style="    height: 95px;
    width: 95px;
    border-radius: 50%;
    margin-top: -16px;
    margin-left: 35px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 57px;
    left: -16px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;""><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 57px;
    right: 24px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details5">
                                                                            <table class="details5">
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer5">
                                                                            <div class="signature5">
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container5">
                                                                        <div class="id-card-content5">
                                                                            <p class="id-card-issue-date5">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date5">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions5">
                                                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code5">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info5">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                             
                                                          
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                                <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
                                                                 <div class="id-card-container55">
                                                                        <div class="header5">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style=" font-weight: bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style=" text-align: left; margin-left: 14px; font-size: 10px; margin-top: 5px ">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                       
<div class="imgs2">
                                                                                    <img style="    height: 95px;
    width: 95px;
    border-radius: 50%;
    margin-top: -16px;
    margin-left: 35px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 57px;
    left: -16px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;""><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 57px;
    right: 24px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details5">
                                                                            <table class="details5">
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer5">
                                                                            <div class="signature5">
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                             
                         `
                    }
                    if (templateSide == 2) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                                <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
                                                             <div class="id-card-container5">
                                                                        <div class="id-card-content5">
                                                                            <p class="id-card-issue-date5">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date5">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions5">
                                                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code5">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info5">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>   
                                                                    </div>
                                                             
                         `
                    }
                }
                if (template == 6) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
 <div class="id-card-container66">
                                                                        <div class="header6">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; margin-left: 14px; font-size: 10px; margin-top: 5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div class="imgs">
                                                                                    <img style="    height: 91px;
    width: 91px;
    border-radius: 50px;
    margin-top: -18px;
    margin-left: -18.5px;
" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="transform: rotate(270deg);
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 40px;
    left: -36px;
    font-size: 12px;
    font-weight: bold;
    width: 50px;
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="    transform: rotate(270deg);
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 40px;
    right: 4px;
    font-size: 12px;
    font-weight: bold;
    width: 50px;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details6">
                                                                            <table class="details6">
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer6">
                                                                            <div class="signature6">
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container6">
                                                                        <div class="id-card-content6">
                                                                            <p class="id-card-issue-date6">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date6">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions6">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code6">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info6">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                          
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                             <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
 <div class="id-card-container66">
                                                                        <div class="header6">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; margin-left: 14px; font-size: 10px; margin-top: 5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div class="imgs">
                                                                                    <img style="    height: 91px;
    width: 91px;
    border-radius: 50px;
    margin-top: -18px;
    margin-left: -18.5px;
" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="transform: rotate(270deg);
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 40px;
    left: -36px;
    font-size: 12px;
    font-weight: bold;
    width: 50px;
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="    transform: rotate(270deg);
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 40px;
    right: 4px;
    font-size: 12px;
    font-weight: bold;
    width: 50px;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details6">
                                                                            <table class="details6">
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer6">
                                                                            <div class="signature6">
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                         <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                              <div class="id-card-container6">
                                                                        <div class="id-card-content6">
                                                                            <p class="id-card-issue-date6">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date6">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions6">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code6">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info6">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                          
                         `
                    }
                }
                if (template == 7) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
   <div class="id-card-container77">
                                                                        <div class="header7">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style="font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style=" text-align: left; margin-left: 14px; font-size: 10px; margin-top: 5px ">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                       
   <div class="imgs">
                                                                                    <img style="height: 90px;
    width: 90px;
    border-radius: 50px;
    margin-top: -8px;
    margin-left: -16px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="    width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="transform: rotate(270deg);
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 40px;
    left: -36px;
    font-size: 12px;
    font-weight: bold;
    width: 45px;
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="transform: rotate(270deg);
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 40px;
    right: 4px;
    font-size: 12px;
    font-weight: bold;
    width: 45px;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details7">
                                                                            <table class="details7">
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer7">
                                                                            <div class="signature7">
                                                                               
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container7">
                                                                        <div class="id-card-content7">
                                                                            <p class="id-card-issue-date7">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date7">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions7">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code7">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info7">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                          
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                             <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
   <div class="id-card-container77">
                                                                        <div class="header7">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style="font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style=" text-align: left; margin-left: 14px; font-size: 10px; margin-top: 5px ">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                       
   <div class="imgs">
                                                                                    <img style="height: 90px;
    width: 90px;
    border-radius: 50px;
    margin-top: -8px;
    margin-left: -16px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="    width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="transform: rotate(270deg);
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 40px;
    left: -36px;
    font-size: 12px;
    font-weight: bold;
    width: 45px;
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="transform: rotate(270deg);
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 40px;
    right: 4px;
    font-size: 12px;
    font-weight: bold;
    width: 45px;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details7">
                                                                            <table class="details7">
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer7">
                                                                            <div class="signature7">
                                                                               
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                         <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                             <div class="id-card-container7">
                                                                        <div class="id-card-content7">
                                                                            <p class="id-card-issue-date7">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date7">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions7">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code7">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info7">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                                    </div>
                         `
                    }
                }
                if (template == 8) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                                   <div class="id-card-container88">
                                                                        <div class="header8">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style=" text-align: left; margin-left: 14px; font-size: 10px; margin-top: 5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                       
 <div  class="imgs">
                                                                                    <img style="height: 80px;
    width: 80px;
    margin-top: -3px;
    margin-left: -14px;
    clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="    width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: -22px;
    left: -16px;
    font-size: 12px;
    font-weight: bold;
     width: 34px; 
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style=" 
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: -22px;
    right: 26px;
    font-size: 12px;
    font-weight: bold;
     width: 34px; 
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details8">
                                                                            <table class="details8">
                                                                            <tbody>
                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer8">
                                                                            <div class="signature8">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                              
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container8">
                                                                        <div class="id-card-content8">
                                                                            <p class="id-card-issue-date8">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date8">Expire Date: 2024-8-31</p>
                                                                            <p class="id-card-instructions8">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code8">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info8">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                             <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                                   <div class="id-card-container88">
                                                                        <div class="header8">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style=" text-align: left; margin-left: 14px; font-size: 10px; margin-top: 5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                       
 <div  class="imgs">
                                                                                    <img style="height: 80px;
    width: 80px;
    margin-top: -3px;
    margin-left: -14px;
    clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="    width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: -22px;
    left: -16px;
    font-size: 12px;
    font-weight: bold;
     width: 34px; 
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style=" 
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: -22px;
    right: 26px;
    font-size: 12px;
    font-weight: bold;
     width: 34px; 
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details8">
                                                                            <table class="details8">
                                                                            <tbody>
                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer8">
                                                                            <div class="signature8">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                              
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                         <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                             <div class="id-card-container8">
                                                                        <div class="id-card-content8">
                                                                            <p class="id-card-issue-date8">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date8">Expire Date: 2024-8-31</p>
                                                                            <p class="id-card-instructions8">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code8">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info8">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                                    </div>
                         `
                    }
                }
                if (template == 9) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div class="id-card-row" >
                                 <div class="id-card-container99">

                                                                    <div class="header9">
                                                                        <div>
                                                                            <h6 style="text-align: left;
    margin-left: 5px;
    font-size: 12px;
    margin-top: 6px;
">IDENTITY CARD</h6>

                                                                        </div>
                                                                        <div className='header_text' style="display: flex;margin-right: 17px;margin-top: 8px;">
                                                                            <img style="
                                                                                height: 35px;
                                                                                width: 35px;
                                                                                border-radius: 50%; // Makes the image round
                                                                                object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                            " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            <div>
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                    <div class="profile-section9">
                                                                        <div class="profile-image9">
                                                                            <img  src=${photoSrc} />
                                                                        </div>
                                                                        <div class="details9">
                                                                            <div className='teacher_information'>
                                                                                <h3>${searchResult?.full_name || 'N/A'}</h3>
                                                                                <p>${searchResult?.designation_name || 'N/A'}</p>
                                                                            </div>
                                                                            <div class="info9">
                                                                                <table class="info9">
                                                                                   

<tbody>
                                                                                             ${filteredSettingss.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>

                                                                                </table>

                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                </div>


                                                                <div class="id-card-container9">
                                                                    <div class="id-card-content9">
                                                                        <p class="id-card-issue-date9">Issue Date: ${(fromDates)}</p>
                                                                        <p class="id-card-expire-date9">Expire Date: ${(toDates)}</p>
                                                                        <p class="id-card-instructions9">
                                                                       ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                        </p>
                                                                        <div class="id-card-qr-code9">
                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                        </div>
                                                                        <p class="id-card-school-info9">
                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                Phone: 01735879633</small>
                                                                        </p>
                                                                      
                                                                    </div>
                                                                </div>
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                           <div class="d-flex">
                              <div class="id-card-container99">

                                                                    <div class="header9">
                                                                        <div>
                                                                            <h6 style="text-align: left;
    margin-left: 5px;
    font-size: 12px;
    margin-top: 6px;
">IDENTITY CARD</h6>

                                                                        </div>
                                                                        <div className='header_text' style="display: flex;margin-right: 17px;margin-top: 8px;">
                                                                            <img style="
                                                                                height: 35px;
                                                                                width: 35px;
                                                                                border-radius: 50%; // Makes the image round
                                                                                object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                            " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            <div>
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                    <div class="profile-section9">
                                                                        <div class="profile-image9">
                                                                            <img  src=${searchResult?.photo ? `http://192.168.0.114:5003/${searchResult?.photo}` : "https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg"} />
                                                                        </div>
                                                                        <div class="details9">
                                                                            <div className='teacher_information'>
                                                                                <h3>${searchResult?.full_name || 'N/A'}</h3>
                                                                                <p>${searchResult?.designation_name || 'N/A'}</p>
                                                                            </div>
                                                                            <div class="info9">
                                                                                <table class="info9">
                                                                                   

<tbody>
                                                                                             ${filteredSettingss.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>

                                                                                </table>

                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                </div>
                                </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                            <div class="d-flex">
                          <div class="id-card-container9">
                                                                    <div class="id-card-content9">
                                                                        <p class="id-card-issue-date9">Issue Date: ${(fromDates)}</p>
                                                                        <p class="id-card-expire-date9">Expire Date: ${(toDates)}</p>
                                                                        <p class="id-card-instructions9">
                                                                       ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                        </p>
                                                                        <div class="id-card-qr-code9">
                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                        </div>
                                                                        <p class="id-card-school-info9">
                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                Phone: 01735879633</small>
                                                                        </p>
                                                                      
                                                                    </div>
                                                                </div>
                            </div>
                         `
                    }
                }
                if (template == 10) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
   <div class="id-card-container100">
                                                                        <div class="header10">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; margin-left: 14px; font-size: 10px; margin-top: 5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                  

<div class="imgs">
                                                                                    <img style="    height: 73px;
    width: 73px;
    border-radius: 50%;
    margin-top: -9px;
    margin-left: -8px;" src=${photoSrc} />
                                                                                </div>
                                                                        <div class="details10">
                                                                            <table class="details10">
                                                                            <tbody>
                                                                            ${filteredSetting.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer10">
                                                                            <div class="signature10">
                                                                              
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container10">
                                                                        <div class="id-card-content10">
                                                                            <p class="id-card-issue-date10">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date10">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions10">
                                                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code10">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info10">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                           <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
   <div class="id-card-container100">
                                                                        <div class="header10">
                                                                            <div>
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div>
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; margin-left: 14px; font-size: 10px; margin-top: 5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                  

<div class="imgs">
                                                                                    <img style="    height: 73px;
    width: 73px;
    border-radius: 50%;
    margin-top: -9px;
    margin-left: -8px;" src=${photoSrc} />
                                                                                </div>
                                                                        <div class="details10">
                                                                            <table class="details10">
                                                                            <tbody>
                                                                            ${filteredSetting.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer10">
                                                                            <div class="signature10">
                                                                              
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                         <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               <div class="id-card-container10">
                                                                        <div class="id-card-content10">
                                                                            <p class="id-card-issue-date10">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date10">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions10">
                                                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code10">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info10">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                                    </div>
                         `
                    }
                }
                if (template == 11) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div class="id-card-row" >
                                 <div class="id-card-container111">

                                                                    <div class="header11">
                                                                        <div>
                                                                            <h6 style="text-align: left;
    margin-left: 0px;
    font-size: 12px;
    margin-top: 5px;">IDENTITY CARD</h6>

                                                                        </div>
                                                                        <div className='header_text11' style="    display: flex
;
    margin-top: 6px;
    margin-right: 6px;">
                                                                            <img style="
                                                                                height: 35px;
                                                                                width: 35px;
                                                                                border-radius: 50%; // Makes the image round
                                                                                object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                            " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            <div>
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                    <div class="profile-section11">
                                                                        <div class="profile-image11">
                                                                            <img  src=${photoSrc} alt="Profile Picture" />
                                                                        </div>
                                                                        <div class="details111">
                                                                            <div className='teacher_information11'>
                                                                                <h3>${searchResult?.full_name || 'N/A'}</h3>
                                                                                <p>${searchResult?.designation_name || 'N/A'}</p>
                                                                            </div>
                                                                            <div class="info11">
                                                                                <table>
                                                                                   
                                                                                     <tbody>
                                                                                                ${filteredSettingss.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>

                                                                                </table>

                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                </div>
                                                                <div class="id-card-container11">
                                                                    <div class="id-card-content11">
                                                                        <p class="id-card-issue-date11">Issue Date: ${(fromDates)}</p>
                                                                        <p class="id-card-expire-date11">Expire Date: ${(toDates)}</p>
                                                                        <p class="id-card-instructions11">
                                                                       ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                        </p>
                                                                        <div class="id-card-qr-code11">
                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                        </div>
                                                                        <p class="id-card-school-info11">
                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                Phone: 01735879633</small>
                                                                        </p>
                                                                        
                                                                    </div>
                                                                </div>
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                            <div class="id-card-row" >
                                 <div class="id-card-container111">

                                                                    <div class="header11">
                                                                        <div>
                                                                            <h6 style="text-align: left;
    margin-left: 0px;
    font-size: 12px;
    margin-top: 5px;">IDENTITY CARD</h6>

                                                                        </div>
                                                                        <div className='header_text11' style="    display: flex
;
    margin-top: 6px;
    margin-right: 6px;">
                                                                            <img style="
                                                                                height: 35px;
                                                                                width: 35px;
                                                                                border-radius: 50%; // Makes the image round
                                                                                object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                            " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            <div>
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                    <div class="profile-section11">
                                                                        <div class="profile-image11">
                                                                            <img  src=${photoSrc} alt="Profile Picture" />
                                                                        </div>
                                                                        <div class="details111">
                                                                            <div className='teacher_information11'>
                                                                                <h3>${searchResult?.full_name || 'N/A'}</h3>
                                                                                <p>${searchResult?.designation_name || 'N/A'}</p>
                                                                            </div>
                                                                            <div class="info11">
                                                                                <table>
                                                                                   
                                                                                     <tbody>
                                                                                                ${filteredSettingss.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>

                                                                                </table>

                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                </div>
                                                                </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                           <div class="id-card-row" >
                            <div class="id-card-container11">
                                                                    <div class="id-card-content11">
                                                                        <p class="id-card-issue-date11">Issue Date: ${(fromDates)}</p>
                                                                        <p class="id-card-expire-date11">Expire Date: ${(toDates)}</p>
                                                                        <p class="id-card-instructions11">
                                                                       ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                        </p>
                                                                        <div class="id-card-qr-code11">
                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                        </div>
                                                                        <p class="id-card-school-info11">
                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                Phone: 01735879633</small>
                                                                        </p>
                                                                        
                                                                    </div>
                                                                </div>
                                                                </div>
                         `
                    }
                }


            });
            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';
            // Prepare final HTML document
            const html = `
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Employee ID Cards</title>
                        <style>
                    @page {
                        size: ${pageSize} ${pageOrientation}; /* This sets the page size to A4 and orientation to Portrait */
                        margin: 0mm; /* Adjust the margin as needed */
                    }
                            body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                       
                            margin: 0;
                            }
                            @media (max-width: 1200px) {
                                .id-card-row {
                                    grid-template-columns: repeat(2, 1fr); /* 4 columns on medium screens */
                                }
                            }

                            @media (max-width: 992px) {
                                .id-card-row {
                                    grid-template-columns: repeat(1, 1fr); /* 3 columns on smaller screens */
                                }
                            }

                            @media (max-width: 768px) {
                                .id-card-row {
                                    grid-template-columns: repeat(1, 1fr); /* 2 columns on mobile screens */
                                }
                            }

                            @media (max-width: 480px) {
                                .id-card-row {
                                    grid-template-columns: 1fr; /* 1 column on very small screens */
                                }
                            }

                            .id-card-row{
                                display: grid;
                                grid-template-columns: repeat(2, 1fr); /* Creates 5 equal columns */
                                width: 100%;
                                
                                margin-top: 15px;
                                box-sizing: border-box;
                                page-break-inside: avoid;
                                 page-break-before: auto;
                             }
                                 .id-card-rows{
                                  page-break-inside: avoid;
                                 page-break-before: auto;
                                 }
                               .id-card-containerss {
                            width: 205px;
                            height: 326px;
                            background: url('http://192.168.0.114:5003/asset_info/2025/01/16/15/12/id-3-f.png') no-repeat center center / cover;
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            position: relative;
                            padding: 20px;
                            box-sizing: border-box;
                                page-break-inside: avoid;
                                 page-break-before: auto;
                            }

                            .id-card {
                            width: 205px;
                            height: 326px;
                            background-image: url('http://192.168.0.114:5003/asset_info/2025/01/16/15/12/id-3-f.png');
                  
                            background-size: cover;
                            background-position: center;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            color: #000;
                            }

                            .header {
                            text-align: center;
                            margin-bottom: 15px;
                            display: flex;
                            color: white;
                            margin-left: 10px;
                            }

                            .header .logo {
                            width: 70px;
                            height: 70px;
                            margin-bottom: 10px;
                            }

                            .header h1 {
                            font-size: 16px;
                            margin: 0;
                            font-weight: bold;
                            }

                            .header p {
                            font-size: 8px;
                            margin: 0;
                            }

                            .photo-section {

                            margin-bottom: 15px;
                            }

                            .rotate-text-left {
                             transform: rotate(270deg);
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 40px;
    left: -36px;
    font-size: 12px;
    font-weight: bold;
    width: 55px;
    text-align: center;
                            }

                            .text {
                            width: 205px;
                            height: 326px;
                            position: absolute;
                         
                            }

                            .rotate-text-right {
                               transform: rotate(270deg);
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 40px;
    right: 4px;
    font-size: 12px;
    font-weight: bold;
    width: 55px;
    text-align: center;
}
                            }

                            .rotate-img {
                            transform: rotate(45deg);
                    
                            position: fixed;

                            }
                            .imgs {
                            position: absolute;
                            left: 77px;
                            width: 77px;
                            height: 100px;
                            margin-top: 2px;
                            background-repeat: no-repeat;
                            background-position: center;
                            background-size: 90px 90px;
                            border-radius: 0px 30px 0px 30px;
                            }
                            .imgs2{
                                position: absolute;
                                /* left: 97px; */
                                width: 77px;
                                height: 100px;
                                background-repeat: no-repeat;
                                background-position: center;
                                background-size: 90px 90px;
                                border-radius: 0px 30px 0px 30px;
                            }
                            .img {
                            position: absolute;
                            left: 77px;
                            width: 75px;
                            height: 93px;
                            background-repeat: no-repeat;
                            background-position: center;
                            background-size: 90px 90px;
                            border-radius: 0px 30px 0px 30px;
                            }

                            .photo {
                            width: 100px;
                            height: 100px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-radius: 8px;

                            }

                            .photo img {
                            max-width: 90%;
                            max-height: 90%;
                            border-radius: 8px;
                            }



                            .info {
                            font-size: 12px;
                            text-align: left;
                            }

                            .details {
                            font-size: 9px;
                            line-height: 1.6;
                            margin-bottom: 15px;
                            margin-top: 130px;
                                margin-left: 0px;
    width: 165px;
                            }

                            .details1 {
                            font-size: 9px;
                            line-height: 1.6;
                            margin-bottom: 15px;
                   
                            margin-left: 15px;
                            }
                            .details13 {
                            font-size: 9px;
                            line-height: 1.6;
                            margin-bottom: 15px;
                        
                            margin-left: 15px;
                            }

                            .footer {
                            text-align: center;
                            font-size: 12px;
                            }

                            .signature {
                            margin-top: 15px;
                            }

                            .signature p {
                            margin: 0;
                            font-style: italic;
                            }

                            .signature hr {
                            width: 80px;
                            border: 1px solid #000;
                            }

                            /* back */
                            .id-card-container {
                            width: 205px;
                            height: 326px;
                            background: url('http://192.168.0.114:5003/asset_info/2025/01/16/15/17/Id-3-back.png') no-repeat center center / cover;
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            position: relative;
                            padding: 20px;
                            box-sizing: border-box;
                            }

                            .id-card-content {
                            color: #000;
                            text-align: center;
                            position: relative;
                            top: 30px;
                            }

                            .id-card-issue-date,
                            .id-card-expire-date {
                            font-size: 9px;
                            margin: 0;
                            }

                            .id-card-instructions {
                            font-size: 9px;
                            line-height: 1.5;
                            margin: 15px 0;
                            }

                            .id-card-qr-code img {
                            margin-top: -10px;
                            width: 70px;
                            height: 70px;
                            }

                            .id-card-school-info {
                            font-size: 9px;
                            line-height: 1.4;
                            margin: 5px 0;
                            }

                            .id-card-principal-signature {
                            font-size: 14px;
                            font-weight: bold;
                            margin-top: 20px;
                            }



                            // id 2
                            .id-cards {
                            width: 205px;
                            height: 326px;
                            background-image: url('id-4-f.png');
                            /* Use your second uploaded image */
                            background-size: cover;
                            background-position: center;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            color: #000;
                            }
 .id-card-containers2 {
                            width: 205px;
                            height: 326px;
                            background: url('http://192.168.0.114:5003/asset_info/2025/01/16/17/49/Id-4-f.png') no-repeat center center / cover;
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            position: relative;
                            padding: 20px;
                            box-sizing: border-box;
                            }
                            .headers {
                            text-align: center;
                            margin-bottom: 15px;
                            display: flex;
                            color: black;
                            margin-left: 10px;
                            }

                            .headers .logos {
                            width: 70px;
                            height: 70px;
                            margin-bottom: 10px;
                            }

                            .headers h1 {
                            font-size: 16px;
                            margin: 0;
                            font-weight: bold;
                            }

                            .headers p {
                            font-size: 8px;
                            margin: 0;
                            }

                            .photo-sections {
                            /* display: flex;
                            align-items: center;
                            justify-content: space-between; */
                            margin-bottom: 15px;
                            }

                            .rotate-texts {
                            transform: rotate(270deg);
                            /* Rotate 45 degrees */
                            }

                            .rotate-imgs {
                            transform: rotate(45deg);
                            /* Rotate 45 degrees */
                            }

                            .photos {
                            width: 100px;
                            height: 92px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-radius: 8px;
                            margin-top: 17px; 
                            }

                         

                            .photos img {
                           max-width: 80%;
    max-height: 89%;
    /* border-radius: 8px; */
    margin-left: 65px;
    margin-top: -39.5px;
                            }

                            .infos {
                            font-size: 12px;
                            text-align: left;
                            }

                            .detailss {
                            font-size: 9px;
                            line-height: 1.6;
                            margin-bottom: 15px;
                            margin-top: -10px;
                                margin-left: 0px;
    width: 165px;
                            }

                            .footers {
                            text-align: center;
                            font-size: 12px;
                            }

                            .signatures {
                            margin-top: 15px;
                            }

                            .signatures p {
                            margin: 0;
                            font-style: italic;
                            }

                            .signatures hr {
                            width: 80px;
                            border: 1px solid #000;
                            }

                            /* back */
                            .id-card-containers {
                            width: 205px;
                            height: 326px;
                            background: url('http://192.168.0.114:5003/asset_info/2025/01/19/09/39/id-4-back.png') no-repeat center center / cover;
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            position: relative;
                            padding: 20px;
                            box-sizing: border-box;
                            }

                            .id-card-contents {
                            color: #000;
                            text-align: center;
                            position: relative;
                            top: 30px;
                            }

                            .id-card-issue-dates,
                            .id-card-expire-dates {
                            font-size: 9px;
                            margin: 0;
                            }

                            .id-card-instructionss {
                            font-size: 9px;
                            line-height: 1.5;
                            margin: 15px 0;
                            }

                            .id-card-qr-codes img {
                            margin-top: -10px;
                            width: 70px;
                            height: 70px;
                            }

                            .id-card-school-infos {
                            font-size: 9px;
                            line-height: 1.4;
                            margin: 5px 0;
                            }

                            .id-card-principal-signatures {
                            font-size: 14px;
                            font-weight: bold;
                            margin-top: 20px;
                            }
                   
                        //   id 3
                            .id-card1 {
                                width: 205px;
                                height: 326px;
                                background-image: url('id-1-f.png');
                                /* Use your second uploaded image */
                                background-size: cover;
                                background-position: center;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                color: #000;
                                }
                                 .id-card-containersa1 {
                                width: 205px;
                                height: 326px;
                                background: url('http://192.168.0.114:5003/asset_info/2025/01/16/18/18/id-1-f.png') no-repeat center center / cover;
                                border-radius: 10px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                position: relative;
                                padding: 20px;
                                box-sizing: border-box;
                                }

                                .header1 {
                                text-align: center;
                                margin-bottom: 15px;
                                display: flex;
                                color: white;
                                margin-left: 10px;
                                }

                                .header1 .logo1 {
                                width: 70px;
                                height: 70px;
                                margin-bottom: 10px;
                                }

                                .header1 h1 {
                                font-size: 16px;
                                margin: 0;
                                font-weight: bold;
                                }
  
                                .header1 p {
                                font-size: 8px;
                                margin: 0;
                                }

                                .photo-section1 {
                                /* display: flex;
                                align-items: center;
                                justify-content: space-between; */
                                margin-bottom: 15px;
                                }

                                .rotate-text1 {
                                transform: rotate(270deg);
                                /* Rotate 45 degrees */
                                }

                                .rotate-img1 {
                                transform: rotate(45deg);
                                /* Rotate 45 degrees */
                                }

                                .photo1 {
                                width: 150px;
                                height: 150px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                border-radius: 8px;
                                /* margin-left: 90px;*/
                                margin-top: -45px;
                                }

                                .photo1 img {
                                max-width: 127%;
                                max-height: 100%;
                                border-radius: 50%;
                                }



                                .info1 {
                                font-size: 12px;
                                text-align: left;
                                }

                                .details1 {
                                font-size: 9px;
                                line-height: 1.6;
                                margin-bottom: 15px;
                                margin-top: 125px;
                                   margin-left: 0px;
    width: 165px;
                                }
                                .details11 {
                                font-size: 9px;
                                line-height: 1.6;
                                margin-bottom: 15px;
                                /* margin-top: 125px; */
                                margin-left: 15px;
                                }

                                .footer1 {
                                text-align: center;
                                font-size: 12px;
                                }

                                .signature1 {
                                margin-top: 15px;
                                }

                                .signature1 p {
                                margin: 0;
                                font-style: italic;
                                }

                                .signature1 hr {
                                width: 80px;
                                border: 1px solid #000;
                                }

                                /* back */
                                .id-card-container1 {
                                width: 205px;
                                height: 326px;
                                background: url('http://192.168.0.114:5003/asset_info/2025/01/16/18/19/id-b-1.png') no-repeat center center / cover;
                                border-radius: 10px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                position: relative;
                                padding: 20px;
                                box-sizing: border-box;
                                }

                                .id-card-content1 {
                                color: #000;
                                text-align: center;
                                position: relative;
                                /* top: 10px; */
                                }

                                .id-card-issue-date1,
                                .id-card-expire-date1 {
                                font-size: 9px;
                                color: white;
                                margin: 0;
                                }

                                .id-card-instructions1 {
                                font-size: 9px;
                                line-height: 1.5;
                                margin: 30px 0;
                                }

                                .id-card-qr-code1 img {
                                margin-top: -10px;
                                width: 70px;
                                height: 70px;
                                }

                                .id-card-school-info1 {
                                font-size: 9px;
                                line-height: 1.4;
                                margin: 5px 0;
                                }

                                .id-card-principal-signature1 {
                                font-size: 14px;
                                font-weight: bold;
                                margin-top: 20px;
                                }

                                /* id 4 */


                                .id-card12 {
                                width: 205px;
                                height: 326px;
                                background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/09/45/id-2-f.png');
                                /* Use your second uploaded image */
                                background-size: cover;
                                background-position: center;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                color: #000;
                                }
                                   .id-card-container122 {
                                width: 205px;
                                height: 326px;
                                background: url('http://192.168.0.114:5003/asset_info/2025/01/19/09/45/id-2-f.png') no-repeat center center / cover;
                                border-radius: 10px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                position: relative;
                                padding: 20px;
                                box-sizing: border-box;
                                }

                                .header12 {
                                text-align: center;
                                margin-bottom: 15px;
                                display: flex;
                                color: black;
                                margin-left: 10px;
                                }

                                .header12 .logo12 {
                                width: 70px;
                                height: 70px;
                                margin-bottom: 10px;
                                }

                                .header12 h1 {
                                font-size: 16px;
                                margin: 0;
                                font-weight: bold;
                                }

                                .header12 p {
                                font-size: 8px;
                                margin: 0;
                                }

                                .photo-section12 {
                                /* display: flex;
                                align-items: center;
                                justify-content: space-between; */
                                margin-bottom: 15px;
                                }

                                .rotate-text12 {
                                transform: rotate(270deg);
                                /* Rotate 45 degrees */
                                }

                                .rotate-img12 {
                                transform: rotate(45deg);
                                /* Rotate 45 degrees */
                                }

                                .photo12 {
                                width: 110px;
                                height: 100px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                border-radius: 8px;
                                margin-left: 4px;
                                margin-top: -36.5px;
                                }

                                .photo12 img {
                                max-width: 95%;
                                max-height: 90%;
                                border-radius: 50%;
                                }



                                .info12 {
                                font-size: 12px;
                                text-align: left;
                                }

                                .details12 {
                                font-size: 9px;
                                line-height: 1.6;
                                margin-bottom: 15px;
                                margin-top: 110px;
                                    margin-left: 0px;
    width: 165px;
                                }
                                .details124 {
                                font-size: 9px;
                                line-height: 1.6;
                                margin-bottom: 15px;
                                /* margin-top: 125px; */
                                margin-left: 15px;
                                }
                                .rotate-text-right1 {
                                
                                /* Rotate 45 degrees */
                                color: #fff;
                                padding: 3px 10px;
                                background: #323990;
                                border-radius: 6px;
                                position: absolute;
                                top: 46px;
                                right: 35px;
                                font-size: 12px;
                                font-weight: bold;

                                text-align: center;
                                }
                                .rotate-text-left1 {
                                
                                /* Rotate 45 degrees */
                                color: #fff;
                                padding: 3px 10px;
                                background: #323990;
                                border-radius: 6px;
                                position: absolute;
                                top: 46px;
                                left: -4px;
                                font-size: 12px;
                                font-weight: bold;

                                text-align: center;
                                }

                                .footer12 {
                                text-align: center;
                                font-size: 12px;
                                }

                                .signature12 {
                                margin-top: 15px;
                                }

                                .signature12 p {
                                margin: 0;
                                font-style: italic;
                                }

                                .signature12 hr {
                                width: 80px;
                                border: 1px solid #000;
                                }

                                /* back */
                                .id-card-container12 {
                                width: 205px;
                                height: 326px;
                                background: url('http://192.168.0.114:5003/asset_info/2025/01/19/09/45/Id-2-back.png') no-repeat center center / cover;
                                border-radius: 10px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                position: relative;
                                padding: 20px;
                                box-sizing: border-box;
                                }

                                .id-card-content12 {
                                color: #000;
                                text-align: center;
                                position: relative;
                                top: 30px;
                                }

                                .id-card-issue-date12,
                                .id-card-expire-date12 {
                                font-size: 9px;
                                margin: 0;
                                }

                                .id-card-instructions12 {
                                font-size: 9px;
                                line-height: 1.5;
                                margin: 15px 0;
                                }

                                .id-card-qr-code12 img {
                                margin-top: -10px;
                                width: 70px;
                                height: 70px;
                                }

                                .id-card-school-info12 {
                                font-size: 9px;
                                line-height: 1.4;
                                margin: 5px 0;
                                }

                                .id-card-principal-signature12 {
                                font-size: 14px;
                                font-weight: bold;
                                margin-top: 20px;
                                }


                                    /* id 5 */

                                    .id-card5 {
                                    width: 205px;
                                    height: 326px;
                                    background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/17/id-5-f.png');
                                    /* Use your second uploaded image */
                                    background-size: cover;
                                    background-position: center;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    color: #000;
                                    }
                                     .id-card-container55 {
                                    width: 205px;
                                    height: 326px;
                                    background: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/17/id-5-f.png') no-repeat center center / cover;
                                    border-radius: 10px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    position: relative;
                                    padding: 20px;
                                    box-sizing: border-box;
                                    }

                                    .header5 {
                                    text-align: center;
                                    margin-bottom: 15px;
                                    display: flex;
                                    color: black;
                                    margin-left: 10px;
                                    margin-top: -15px;
                                    }

                                    .header5 .logo5 {
                                    width: 70px;
                                    height: 70px;
                                    margin-bottom: 10px;
                                    }

                                    .header5 h1 {
                                    font-size: 16px;
                                    margin: 0;
                                    font-weight: bold;
                                    }

                                    .header5 p {
                                    font-size: 8px;
                                    margin: 0;
                                    }

                                    .photo-section5 {
                                    /* display: flex;
                                        align-items: center;
                                        justify-content: space-between; */
                                    margin-bottom: 15px;
                                    }

                                    .rotate-text5 {
                                    transform: rotate(270deg);
                                    /* Rotate 45 degrees */
                                    }

                                    .rotate-img5 {
                                    transform: rotate(45deg);
                                    /* Rotate 45 degrees */
                                    }
                                    .rotate-text-right2 {
                                    
                                    color: #fff;
                                        padding: 3px 10px;
                                        background: #323990;
                                        border-radius: 6px;
                                        position: absolute;
                                        top: 65px;
                                        right: 35px;
                                        font-size: 12px;
                                        font-weight: bold;
                                        text-align: center;

                                    text-align: center;
                                    }
                                    .rotate-text-left2 {

                                    color: #fff;
                                    padding: 3px 10px;
                                    background: #323990;
                                    border-radius: 6px;
                                    position: absolute;
                                    top: 65px;
                                    left: -4px;
                                    font-size: 12px;
                                    font-weight: bold;
                                    text-align: center;
                                    }

                                    .photo5 {
                                    width: 115px;
                                    height: 100px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    border-radius: 8px;
                                    margin-left: 4px;
                                    margin-top: -48px !important;
                                    }

                                    .photo5 img {
                                    max-width: 105%;
                                    max-height: 100%;
                                    border-radius: 50%;
                                    }



                                    .info5 {
                                    font-size: 12px;
                                    text-align: left;
                                    }

                                    .details5 {
                                    font-size: 9px;
                                    line-height: 1.6;
                                    margin-bottom: 15px;
                                    margin-top: 125px;
                                    margin-left: 0px;
                                    width: 165px;
                                    }
                                    .details55 {
                                    font-size: 9px;
                                    line-height: 1.6;
                                    margin-bottom: 15px;
                                    /* margin-top: 125px; */
                                    margin-left: 15px;
                                    }

                                    .footer5 {
                                    text-align: center;
                                    font-size: 12px;
                                    }

                                    .signature5 {
                                    margin-top: 15px;
                                    }

                                    .signature5 p {
                                    margin: 0;
                                    font-style: italic;
                                    }

                                    .signature5 hr {
                                    width: 80px;
                                    border: 1px solid #000;
                                    }

                                    /* back */
                                    .id-card-container5 {
                                    width: 205px;
                                    height: 326px;
                                    background: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/16/id-5-back.png') no-repeat center center / cover;
                                    border-radius: 10px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    position: relative;
                                    padding: 20px;
                                    box-sizing: border-box;
                                    }

                                    .id-card-content5 {
                                    color: #000;
                                    text-align: center;
                                    position: relative;
                                    top: 40px;
                                    }

                                    .id-card-issue-date5,
                                    .id-card-expire-date5 {
                                    font-size: 9px;
                                    margin: 0;
                                    }

                                    .id-card-instructions5 {
                                    font-size: 9px;
                                    line-height: 1.5;
                                    margin: 10px 0;
                                    }

                                    .id-card-qr-code5 img {
                                    margin-top: -10px;
                                    width: 70px;
                                    height: 70px;
                                    }

                                    .id-card-school-info5 {
                                    font-size: 9px;
                                    line-height: 1.4;
                                    margin: 5px 0;
                                    }

                                    .id-card-principal-signature5 {
                                    font-size: 14px;
                                    font-weight: bold;
                                    margin-top: 20px;
                                    }


                                    /* id 6 */

                                    .id-card6 {
                                    width: 205px;
                                    height: 326px;
                                    background-image: url('id-f-6.png');
                                    /* Use your second uploaded image */
                                    background-size: cover;
                                    background-position: center;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    color: #000;
                                    }
                                      .id-card-container66 {
                                    width: 205px;
                                    height: 326px;
                                    background: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/55/id-f-6.png') no-repeat center center / cover;
                                    border-radius: 10px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    position: relative;
                                    padding: 20px;
                                    box-sizing: border-box;
                                    }

                                    .header6 {
                                    text-align: center;
                                    margin-bottom: 15px;
                                    display: flex;
                                    color: black;
                                    margin-left: 10px;
                                    margin-top: -10px;
                                    }

                                    .header6 .logo6 {
                                    width: 70px;
                                    height: 70px;
                                    margin-bottom: 10px;
                                    }

                                    .header6 h1 {
                                    font-size: 16px;
                                    margin: 0;
                                    font-weight: bold;
                                    }

                                    .header6 p {
                                    font-size: 8px;
                                    margin: 0;
                                    }

                                    .photo-section6 {
                                    /* display: flex;
                                    align-items: center;
                                    justify-content: space-between; */
                                    margin-bottom: 15px;
                                    }

                                    .rotate-text6 {
                                    transform: rotate(270deg);
                                    /* Rotate 45 degrees */
                                    }

                                    .rotate-img6 {
                                    transform: rotate(45deg);
                                    /* Rotate 45 degrees */
                                    }

                                    .photo6 {
                                    width: 115px;
                                    height: 100px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    border-radius: 8px;
                                    margin-left: 5px;
                                    margin-top: -20px !important;
                                    }

                                    .photo6 img {
                                    max-width: 98%;
                                    max-height: 100%;
                                    border-radius: 50%;
                                    }



                                    .info6 {
                                    font-size: 12px;
                                    text-align: left;
                                    }

                                    .details6 {
                                    font-size: 9px;
                                    line-height: 1.6;
                                    margin-bottom: 15px;
                                    margin-top: 125px;
                                    margin-left: 0px;
                                    width: 165px;
                                    }
                                    .details66 {
                                    font-size: 9px;
                                    line-height: 1.6;
                                    margin-bottom: 15px;
                                    margin-top: 15px;
                                    margin-left: 15px;
                                    }

                                    .footer6 {
                                    text-align: center;
                                    font-size: 12px;
                                    }

                                    .signature6 {
                                    margin-top: 15px;
                                    }

                                    .signature6 p {
                                    margin: 0;
                                    font-style: italic;
                                    }

                                    .signature6 hr {
                                    width: 80px;
                                    border: 1px solid #000;
                                    }

                                    /* back */
                                    .id-card-container6 {
                                    width: 205px;
                                    height: 326px;
                                    background: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/55/id-b-6.png') no-repeat center center / cover;
                                    border-radius: 10px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    position: relative;
                                    padding: 20px;
                                    box-sizing: border-box;
                                    }

                                    .id-card-content6 {
                                    color: #000;
                                    text-align: center;
                                    position: relative;
                                    top: 32px;
                                    }

                                    .id-card-issue-date6,
                                    .id-card-expire-date6 {
                                    font-size: 9px;
                                    margin: 0;
                                    }

                                    .id-card-instructions6 {
                                    font-size: 9px;
                                    line-height: 1.5;
                                    margin: 10px 0;
                                    }

                                    .id-card-qr-code6 img {
                                    margin-top: -10px;
                                    width: 70px;
                                    height: 70px;
                                    }

                                    .id-card-school-info6 {
                                    font-size: 9px;
                                    line-height: 1.4;
                                    margin: 5px 0;
                                    }

                                    .id-card-principal-signature6 {
                                    font-size: 14px;
                                    font-weight: bold;
                                    margin-top: 20px;
                                    }
                                  /* id 7 */

                                    .id-card7 {
                                    width: 205px;
                                    height: 326px;
                                    background-image: url('id-7-f.png');
                                    /* Use your second uploaded image */
                                    background-size: cover;
                                    background-position: center;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    color: #000;
                                    }
                                 .id-card-container77 {
                                    width: 205px;
                                    height: 326px;
                                    background: url('http://192.168.0.114:5003/asset_info/2025/01/19/11/46/id-7-f.png') no-repeat center center / cover;
                                    border-radius: 10px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    position: relative;
                                    padding: 20px;
                                    box-sizing: border-box;
                                    }
                                    .header7 {
                                    text-align: center;
                                    margin-bottom: 15px;
                                    display: flex;
                                    color: black;
                                    margin-left: 10px;
                                    margin-top: -10px;
                                    }

                                    .header7 .logo7 {
                                    width: 70px;
                                    height: 70px;
                                    margin-bottom: 10px;
                                    }

                                    .header7 h1 {
                                    font-size: 16px;
                                    margin: 0;
                                    font-weight: bold;
                                    }

                                    .header7 p {
                                    font-size: 8px;
                                    margin: 0;
                                    }

                                    .photo-section7 {
                                    /* display: flex;
                                    align-items: center;
                                    justify-content: space-between; */
                                    margin-bottom: 15px;
                                    }

                                    .rotate-text7 {
                                    transform: rotate(270deg);
                                    /* Rotate 45 degrees */
                                    }

                                    .rotate-img7 {
                                    transform: rotate(45deg);
                                    /* Rotate 45 degrees */
                                    }

                                    .photo7 {
                                    width: 115px;
                                    height: 100px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    border-radius: 8px;
                                    margin-left: 9px;
                                    margin-top: -11px !important;
                                    }

                                    .photo7 img {
                                    max-width: 98%;
                                    max-height: 100%;
                                    border-radius: 50%;
                                    }



                                    .info7 {
                                    font-size: 12px;
                                    text-align: left;
                                    }

                                    .details7 {
                                    font-size: 9px;
                                    line-height: 1.6;
                                    margin-bottom: 15px;
                                    margin-top: 125px;
                                    margin-left: 0px;
                                    width: 165px ;
                                    }
                                    .details77 {
                                    font-size: 9px;
                                    line-height: 1.6;
                                    margin-bottom: 15px;
                                    margin-top: 15px;
                                    margin-left: 15px;
                                    }

                                    .footer7 {
                                    text-align: center;
                                    font-size: 12px;
                                    }

                                    .signature7 {
                                    margin-top: 15px;
                                    }

                                    .signature7 p {
                                    margin: 0;
                                    font-style: italic;
                                    }

                                    .signature7 hr {
                                    width: 80px;
                                    border: 1px solid #000;
                                    }

                                    /* back */
                                    .id-card-container7 {
                                    width: 205px;
                                    height: 326px;
                                    background: url('http://192.168.0.114:5003/asset_info/2025/01/19/11/47/id-7-back.png') no-repeat center center / cover;
                                    border-radius: 10px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    position: relative;
                                    padding: 20px;
                                    box-sizing: border-box;
                                    }

                                    .id-card-content7 {
                                    color: #000;
                                    text-align: center;
                                    position: relative;
                                    top: 32px;
                                    }

                                    .id-card-issue-date7,
                                    .id-card-expire-date7 {
                                    font-size: 9px;
                                    margin: 0;
                                    }

                                    .id-card-instructions7 {
                                    font-size: 9px;
                                    line-height: 1.5;
                                    margin: 10px 0;
                                    }

                                    .id-card-qr-code7 img {
                                    margin-top: -10px;
                                    width: 70px;
                                    height: 70px;
                                    }

                                    .id-card-school-info7 {
                                    font-size: 9px;
                                    line-height: 1.4;
                                    margin: 5px 0;
                                    }

                                    .id-card-principal-signature7 {
                                    font-size: 14px;
                                    font-weight: bold;
                                    margin-top: 20px;
                                    }
                                        /* id 8 */


                                        .id-card8 {
                                        width: 205px;
                                        height: 326px;
                                        background-image: url('id-8.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        padding: 20px;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }
                                           .id-card-container88 {
                                        width: 205px;
                                        height: 326px;
                                        background: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/05/id-8.png') no-repeat center center / cover;
                                        border-radius: 10px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        position: relative;
                                        padding: 20px;
                                        box-sizing: border-box;
                                        }

                                        .header8 {
                                        text-align: center;
                                        margin-bottom: 15px;
                                        display: flex;
                                        color: black;
                                        margin-left: 10px;
                                        }

                                        .header8 .logo8 {
                                        width: 70px;
                                        height: 70px;
                                        margin-bottom: 10px;
                                        }

                                        .header8 h1 {
                                        font-size: 16px;
                                        margin: 0;
                                        font-weight: bold;
                                        }

                                        .header8 p {
                                        font-size: 8px;
                                        margin: 0;
                                        }

                                        .photo-section8 {
                                        /* display: flex;
                                        align-items: center;
                                        justify-content: space-between; */
                                        margin-bottom: 15px;
                                        }

                                        .rotate-text8 {
                                        transform: rotate(270deg);
                                        /* Rotate 45 degrees */
                                        }

                                        .rotate-img8 {
                                        transform: rotate(45deg);
                                        /* Rotate 45 degrees */
                                        }

                                        .photo8 {
                                        width: 70px;
                                        height: 100px;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        border-radius: 8px;
                                        margin-left: 4px;
                                        margin-top: -12px;
                                        }
                                        .rotate-text-left8{

                                        
                                            /* transform: rotate(270deg); */
                                            color: #fff;
                                            padding: 3px 10px;
                                            background: #323990;
                                            border-radius: 6px;
                                            position: absolute;
                                            top: 2px;
                                            left: -13px;
                                            font-size: 12px;
                                            font-weight: bold;
                                            /* width: 90px; */
                                            text-align: center;
                                        }
                                        .rotate-text-right8{

                                            /* transform: rotate(270deg); */
                                            color: #fff;
                                            padding: 3px 10px;
                                            background: #323990;
                                            border-radius: 6px;
                                            position: absolute;
                                            top: 2px;
                                            right: 26px;
                                            font-size: 12px;
                                            font-weight: bold;
                                            /* width: 90px; */
                                            text-align: center;
                                        }

                                        .photo8 img {
                                        max-width: 90%;
                                        max-height: 90%;
                                        border-radius: 8px;
                                        }



                                        .info8 {
                                        font-size: 12px;
                                        text-align: left;
                                        }

                                        .details8 {
                                        font-size: 9px;
                                        line-height: 1.6;
                                        margin-bottom: 15px;
                                        margin-top: 120px;
                                        margin-left: 0px;
                                        width: 165px;
                                        }

                                        .details88 {
                                        font-size: 9px;
                                        line-height: 1.6;
                                        margin-bottom: 15px;
                                        margin-top: 10px;
                                        margin-left: 15px;
                                        }

                                        .footer8 {
                                        text-align: center;
                                        font-size: 12px;
                                        }

                                        .signature8 {
                                        margin-top: 15px;
                                        }

                                        .signature8 p {
                                        margin: 0;
                                        font-style: italic;
                                        }

                                        .signature8 hr {
                                        width: 80px;
                                        border: 1px solid #000;
                                        }

                                        /* back */
                                        .id-card-container8 {
                                        width: 205px;
                                        height: 326px;
                                        background: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/05/id-8-b.png') no-repeat center center / cover;
                                        border-radius: 10px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        position: relative;
                                        padding: 20px;
                                        box-sizing: border-box;
                                        }

                                        .id-card-content8 {
                                        color: #000;
                                        text-align: center;
                                        position: relative;
                                        /* top: 30px; */
                                        }

                                        .id-card-issue-date8,
                                        .id-card-expire-date8 {
                                        font-size: 9px;
                                        margin: 0;
                                        text-align: left;
                                        color: white;
                                        }

                                        .id-card-instructions8 {
                                        font-size: 9px;
                                        line-height: 1.5;
                                        margin: 50px 0;
                                        }

                                        .id-card-qr-code8 img {
                                        margin-top: -30px;
                                        width: 70px;
                                        height: 70px;
                                        }

                                        .id-card-school-info8 {
                                        font-size: 9px;
                                        line-height: 1.4;
                                        margin: 5px 0;
                                        }

                                        .id-card-principal-signature8 {
                                        font-size: 14px;
                                        font-weight: bold;
                                        margin-top: 20px;
                                        }

                                        /* id 10 */

                                        .id-card10 {
                                        width: 205px;
                                        height: 326px;
                                        background-image: url('id-10.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        padding: 20px;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }
                                        .id-card-container100 {
                                        width: 205px;
                                        height: 326px;
                                        background: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/26/id-10.png') no-repeat center center / cover;
                                        border-radius: 10px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        position: relative;
                                        padding: 20px;
                                        box-sizing: border-box;
                                        }

                                        .header10 {
                                        text-align: center;
                                        margin-bottom: 15px;
                                        display: flex;
                                        color: white;
                                        margin-left: 10px;
                                        margin-top: -10px;
                                        }

                                        .header10 .logo10 {
                                        width: 70px;
                                        height: 70px;
                                        margin-bottom: 10px;
                                        }

                                        .header10 h1 {
                                        font-size: 16px;
                                        margin: 0;
                                        font-weight: bold;
                                        }

                                        .header10 p {
                                        font-size: 8px;
                                        margin: 0;
                                        }

                                        .photo-section10 {
                                        /* display: flex;
                                        align-items: center;
                                        justify-content: space-between; */
                                        margin-bottom: 15px;
                                        }

                                        .rotate-text10 {
                                        transform: rotate(270deg);
                                        /* Rotate 45 degrees */
                                        }

                                        .rotate-img10 {
                                        transform: rotate(45deg);
                                        /* Rotate 45 degrees */
                                        }

                                        .photo10 {
                                        width: 73px;
                                        height: 100px;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        border-radius: 8px;
                                        margin-left: 49px;
                                        margin-top: -20px !important;
                                        }

                                        .photo10 img {
                                        max-width: 100%;
                                        max-height: 100%;
                                        border-radius: 50%;
                                        }



                                        .info10 {
                                        font-size: 12px;
                                        text-align: left;
                                        }

                                        .details10 {
                                        font-size: 9px;
                                        line-height: 1.6;
                                        margin-bottom: 15px;
                                        margin-top: 135px;
                                        margin-left: 0px;
                                        width: 165px;
                                        }
                                        .details101 {
                                        font-size: 9px;
                                        line-height: 1.6;
                                        margin-bottom: 15px;
                                        margin-top: 35px;
                                        margin-left: 15px;
                                        }

                                        .footer10 {
                                        text-align: center;
                                        font-size: 12px;
                                        }

                                        .signature10 {
                                        margin-top: 15px;
                                        }

                                        .signature10 p {
                                        margin: 0;
                                        font-style: italic;
                                        }

                                        .signature10 hr {
                                        width: 80px;
                                        border: 1px solid #000;
                                        }

                                        /* back */
                                        .id-card-container10 {
                                        width: 205px;
                                        height: 326px;
                                        background: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/27/id-10-b.png') no-repeat center center / cover;
                                        border-radius: 10px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        position: relative;
                                        padding: 20px;
                                        box-sizing: border-box;
                                        }

                                        .id-card-content10 {
                                        color: #000;
                                        text-align: center;
                                        position: relative;
                                        top: 32px;
                                        }

                                        .id-card-issue-date10,
                                        .id-card-expire-date10 {
                                        font-size: 9px;
                                        margin: 0;
                                        }

                                        .id-card-instructions10 {
                                        font-size: 9px;
                                        line-height: 1.5;
                                        margin: 10px 0;
                                        }

                                        .id-card-qr-code10 img {
                                        margin-top: -10px;
                                        width: 70px;
                                        height: 70px;
                                        }

                                        .id-card-school-info10 {
                                        font-size: 9px;
                                        line-height: 1.4;
                                        margin: 5px 0;
                                        }

                                        .id-card-principal-signature10 {
                                        font-size: 14px;
                                        font-weight: bold;
                                        margin-top: 20px;
                                        }

                                        // id 9

                                        .id-card9 {
                                        width: 340px;
                                        height: 205px;
                                        background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/15/15/id-9.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        padding: 20px;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }
                                            .id-card-container99 {
                                        width: 340px;
                                        height: 205px;
                                        background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/15/15/id-9.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }

                                        .header9 {
                                        text-align: center;
                                        margin-bottom: 15px;
                                        display: flex;
                                        justify-content: space-between;
                                        color: white;
                                        margin-left: 10px;
                                        }

                                        /* .header9 {
                                        text-align: center;
                                        margin-bottom: 15px;
                                        display: flex;
                                        color: black;
                                        margin-left: 10px;
                                        } */
                                        .header_text {
                                        margin-top: -10px;
                                        margin-left: -20px;
                                        }

                                        .header9 .logo9 {
                                        width: 70px;
                                        height: 70px;
                                        margin-bottom: 10px;
                                        }

                                        .header9 h1 {
                                        font-size: 16px;
                                        margin: 0;
                                        font-weight: bold;
                                        }

                                        .header9 p {
                                        font-size: 9px;
                                        margin: 0;
                                        }

                                        /* .header9 h1 {
                                        margin: 0;
                                        font-size: 18px;
                                        }

                                        .header9 h2 {
                                        margin: 5px 0;
                                        font-size: 14px;
                                        }

                                        .header9 p {
                                        font-size: 12px;
                                        margin: 0;
                                        } */

                                        .profile-section9 {
                                        display: flex;
                                        padding: 15px;
                                        align-items: center;
                                        }

                                        .profile-image9 {
                                 
                                            height: 100px;
                                            width: 86px;
                                            border: 2px solid #ddd;
                                            border-radius: 45%;
                                            overflow: hidden;
                                            margin-right: 19px;
                                            margin-left: 3px;
                                            margin-top: -52px;
                                        }

                                        .teacher_information {
                                        margin-left: 20px;
                                        }

                                        .profile-image9 img {
                                        width: 100%;
                                        height: 100%;
                                        object-fit: cover;

                                        }

                                        .details9 {
                                        flex-grow: 1;
                                        }

                                        .details9 h3 {
                                        margin: 0;
                                        font-size: 27px;
                                        color: #333;
                                        }

                                        .details9 p {
                                        font-size: 12px;
                                        color: #666;
                                        margin-left: 20px;
                                        }

                                        .info9 td {
                                        margin: 2px 0;
                                        font-size: 12px;
                                        color: #333;
                                        }

                                        .info9 {
                                        margin-top: -10px;
                                        }

                                        .signature9 {
                                        text-align: center;
                                        padding: 10px 15px;
                                        }

                                        .signature9 hr {
                                        border: 0.5px solid #333;
                                        margin: 5px auto;
                                        width: 80px;
                                        }

                                        .signature9 p {
                                        margin: 5px 0 0;
                                        font-size: 12px;
                                        color: #666;
                                        }

                                        /* back */
                                        /* back */
                                        .id-card-container9 {
                                        width: 340px;
                                        height: 205px;
                                        background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/15/14/id-9-b.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }

                                        .id-card-content9 {
                                        color: #000;
                                        text-align: center;
                                        position: relative;
                                        top: 15px;
                                        }

                                        .id-card-issue-date9,
                                        .id-card-expire-date9 {
                                        font-size: 9px;
                                        margin: 0;
                                        }

                                        .id-card-instructions9 {
                                        font-size: 9px;
                                        line-height: 1.5;
                                        margin: 10px 0;
                                        }

                                        .id-card-qr-code9 img {
                                        margin-top: -10px;
                                        width: 50px;
                                        height: 50px;
                                        }

                                        .id-card-school-info9 {
                                        font-size: 9px;
                                        line-height: 1.4;
                                        margin: 5px 0;
                                        }

                                        .id-card-principal-signature9 {
                                        font-size: 14px;
                                        font-weight: bold;
                                        margin-top: 20px;
                                        }

                                        /* id 11 */



                                        .id-card11 {
                                        width: 340px;
                                        height: 205px;
                                        background-image: url('id-11.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        padding: 20px;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }
                                    .id-card-container111 {
                                        width: 340px;
                                        height: 205px;
                                        background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/15/35/id-11.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }

                                        .header11 {
                                        text-align: center;
                                        margin-bottom: 15px;
                                        display: flex;
                                        justify-content: space-between;
                                        color: white;
                                        margin-left: 10px;
                                        }

                                        /* .header11 {
                                        text-align: center;
                                        margin-bottom: 15px;
                                        display: flex;
                                        color: black;
                                        margin-left: 10px;
                                        } */
                                        .header_text11 {
                                        margin-top: -10px;
                                        margin-left: -20px;
                                        }

                                        .header11 .logo11 {
                                        width: 70px;
                                        height: 70px;
                                        margin-bottom: 10px;
                                        }

                                        .header11 h1 {
                                        font-size: 16px;
                                        margin: 0;
                                        font-weight: bold;
                                        }

                                        .header11 p {
                                        font-size: 9px;
                                        margin: 0;
                                        }

                                        /* .header11 h1 {
                                        margin: 0;
                                        font-size: 18px;
                                        }

                                        .header11 h2 {
                                        margin: 5px 0;
                                        font-size: 14px;
                                        }

                                        .header11 p {
                                        font-size: 12px;
                                        margin: 0;
                                        } */

                                        .profile-section11 {
                                        display: flex;
                                        padding: 15px;
                                        align-items: center;
                                        }

                                        .profile-image11 {

                                          height: 118px;
                                            width: 88px;
                                            border: 2px solid #ddd;
                                            overflow: hidden;
                                            margin-left: 18px;
                                            margin-top: -67px;
                                        }

                                        /* .teacher_information11 {
                                        margin-left: 20px;
                                        } */

                                        .profile-image11 img {
                                        width: 105%;
                                        height: 100%;
                                        object-fit: cover;

                                        }

                                        .details111 {
                                        flex-grow: 1;
                                        margin-left: 25px;
                                        color: white !important;
                                        }

                                        .details111 h3 {
                                        margin: 0;
                                        font-size: 27px;

                                        }

                                        .details111 p {
                                        font-size: 12px;

                                        margin-left: 20px;
                                        }

                                        .info11 td {
                                        margin: 2px 0;
                                        font-size: 12px;

                                        }

                                        .info11 {
                                        margin-top: -10px;
                                        margin-left: -10px;
                                        }

                                        .signature11 {
                                        text-align: center;
                                        padding: 10px 15px;
                                        }

                                        .signature11 hr {
                                        border: 0.5px solid #333;
                                        margin: 5px auto;
                                        width: 80px;
                                        }

                                        .signature11 p {
                                        margin: 5px 0 0;
                                        font-size: 12px;
                                        color: #666;
                                        }

                                        /* back */
                                        /* back */
                                        .id-card-container11 {
                                        width: 340px;
                                        height: 205px;
                                        background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/15/36/id-11-b.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }

                                        .id-card-content11 {
                                        color: #000;
                                        text-align: center;
                                        position: relative;
                                        top: 20px;
                                        }

                                        .id-card-issue-date11,
                                        .id-card-expire-date11 {
                                        font-size: 9px;
                                        margin: 0;
                                        }

                                        .id-card-instructions11 {
                                        font-size: 9px;
                                        line-height: 1.5;
                                        margin: 10px 0;
                                        }

                                        .id-card-qr-code11 img {
                                        margin-top: -10px;
                                        width: 50px;
                                        height: 50px;
                                        }

                                        .id-card-school-info11 {
                                        font-size: 9px;
                                        line-height: 1.4;
                                        margin: 5px 0;
                                        }

                                        .id-card-principal-signature11 {
                                        font-size: 14px;
                                        font-weight: bold;
                                        margin-top: 20px;
                                        }


                        </style>
                    </head>
                    <body >
                    <div  style=" height:177mm !important; width:210mm !important;	">
                    
                    ${tableRows}
                    </div>
                    </body>
                      <script>
                window.print();
            </script>
                </html>
            `;

            res.send(html);
        } catch (error) {
            console.error('Error generating ID card print view:', error);
            res.status(500).send('Error generating print view');
        }
    },



    employee_id_card_list_pdf: async (req, res) => {
        try {
            const { selectedPrintSize, orientation, searchResults, filteredSettings, filteredSettingss, filteredSetting, template, templateSide, employee_id_card_setting_back_list, formData, toDates, fromDates } = req.body;
            const formatDate = (date) => {
                const day = String(date?.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = String(date.getFullYear());
                return `${day}-${month}-${year}`;
            };
            let tableRows = '';

            searchResults.forEach((searchResult, i) => {
                // Template 1 logic (First template)
                const photoSrc = searchResult?.photo && searchResult?.photo.trim() !== ""
                    ? `http://192.168.0.114:5003/${searchResult?.photo}`
                    : 'https://as1.ftcdn.net/v2/jpg/02/09/95/42/500_F_209954204_mHCvAQBIXP7C2zRl5Fbs6MEWOEkaX3cA.jpg';

                if (template == 1) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                            <div  class="id-card-rows" style="float: left; height: 178mm; width: 56.88mm; overflow: hidden;">
                                <div class="id-card-containerss" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/16/15/12/id-3-f.png'); background-size: cover; background-position: center;">
                                    <div class="header">
                                        <div style="float: left;">
                                            <img style="height: 25px; width: 25px; border-radius: 50%; object-fit: cover;" class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                        </div>
                                        <div style="float: right;">
                                            <p style="font-weight: bold;">Abdul Malek Master Kindergarten<br />and High School</p>
                                            <h6 style="text-align: left; margin-left: 4px; font-size: 10px; margin-top: 5px;">IDENTITY CARD</h6>
                                        </div>
                                    </div>
                                    <div class="imgs" style="position: relative; display: inline-block; width: 90px; height: 90px;">
    <!-- First Image -->
    <img
        style="height: 65px;
               width: 65px;
               border-radius: 50%;
               position: absolute;
               top: 4px;
               left: -26px;"
        src="${photoSrc}" />

    <!-- Second Image -->
    <img
        style="position: absolute;
               top: -25px;
               left: -50px;
               width: 115px;
               height: 115px;"
        src="http://192.168.0.114:5003/asset_info/2025/01/21/16/06/Shape-5.png" />
</div>

                                    <div class="text">
                                        <p class="rotate-text-left"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                        <p class="rotate-text-right"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                    </div>
                                    <div class="details">
                                        <table class="details">
                                            <tbody>
                                                ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                    <tr key="${setting.id}">
                                                        <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                        <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                    </tr>
                                                `;
                        }).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="id-card-container" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/16/15/17/Id-3-back.png'); background-size: cover; background-position: center;">
                                    <div class="id-card-content">
                                        <p class="id-card-issue-date">Issue Date: ${(fromDates)}</p>
                                        <p class="id-card-expire-date">Expire Date: ${(toDates)}</p>
                                        <p class="id-card-instructions">
                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                            `;
                        }).join('')}
                                        </p>
                                        <div class="id-card-qr-code">
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                        </div>
                                        <p class="id-card-school-info">
                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                            <small>Address: Beraider Chala, Sreepur, Gazipur<br />
                                            Phone: 01735879633</small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                           <div  class="id-card-rows" style="float: left; height: 178mm; width: 56.88mm; overflow: hidden;">
                                <div class="id-card-containerss" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/16/15/12/id-3-f.png'); background-size: cover; background-position: center;">
                                    <div class="header">
                                        <div style="float: left;">
                                            <img style="height: 25px; width: 25px; border-radius: 50%; object-fit: cover;" class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                        </div>
                                        <div style="float: right;">
                                            <p style="font-weight: bold;">Abdul Malek Master Kindergarten<br />and High School</p>
                                            <h6 style="text-align: left; margin-left: 4px; font-size: 10px; margin-top: 5px;">IDENTITY CARD</h6>
                                        </div>
                                    </div>
                                    <div class="imgs" style="position: relative; display: inline-block; width: 90px; height: 90px;">
    <!-- First Image -->
    <img
        style="height: 65px;
               width: 65px;
               border-radius: 50%;
               position: absolute;
               top: 4px;
               left: -26px;"
        src="${photoSrc}" />

    <!-- Second Image -->
    <img
        style="position: absolute;
               top: -25px;
               left: -50px;
               width: 115px;
               height: 115px;"
        src="http://192.168.0.114:5003/asset_info/2025/01/21/16/06/Shape-5.png" />
</div>

                                    <div class="text">
                                        <p class="rotate-text-left"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                        <p class="rotate-text-right"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                    </div>
                                    <div class="details">
                                        <table class="details">
                                            <tbody>
                                                ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                    <tr key="${setting.id}">
                                                        <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                        <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                    </tr>
                                                `;
                        }).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                        <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;' >
                            <div class="id-card-container" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/16/15/17/Id-3-back.png'); background-size: cover; background-position: center;">
                                    <div class="id-card-content">
                                        <p class="id-card-issue-date">Issue Date: ${(fromDates)}</p>
                                        <p class="id-card-expire-date">Expire Date: ${(toDates)}</p>
                                        <p class="id-card-instructions">
                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                            `;
                        }).join('')}
                                        </p>
                                        <div class="id-card-qr-code">
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                        </div>
                                        <p class="id-card-school-info">
                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                            <small>Address: Beraider Chala, Sreepur, Gazipur<br />
                                            Phone: 01735879633</small>
                                        </p>
                                    </div>
                                </div>
                                </div>
                         `
                    }
                }

                if (template == 2) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               

                                                                    <div class="id-card-containers2" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/16/17/49/Id-4-f.png'); background-size: cover; background-position: center;">
                                                                        <div class="headers">
                                                                            <div style="float: left">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; 
                                                                                    object-fit: cover;   
                                                                               " class="logos" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div  style="float: right">
                                                                                <p style="font-Weight: bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; font-size: 10px; margin-top: 5px;">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>


                                                                        <div class="photos" >
                                                                            <img src=${photoSrc} style="margin-top:1px" />
                                                                        </div>




                                                                        <div class="detailss" >
                                                                            <table class="detailss" style="margin-top:40px;">
                                                                            <tbody>
 ${filteredSetting.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                        <tr key="${setting.id}">
                                                            <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                            <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                        </tr>
                                                    `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>


                                                                        <div class="footers">
                                                                            <div class="signatures">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                               
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-containers" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/09/39/id-4-back.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-contents">
                                                                            <p class="id-card-issue-dates">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-dates">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructionss">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-codes">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-infos">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                          
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                          <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               

                                                                    <div class="id-card-containers2" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/16/17/49/Id-4-f.png'); background-size: cover; background-position: center;">
                                                                        <div class="headers">
                                                                            <div style="float: left">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; 
                                                                                    object-fit: cover;   
                                                                               " class="logos" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div  style="float: right">
                                                                                <p style="font-Weight: bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; font-size: 10px; margin-top: 5px;">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>


                                                                        <div class="photos" >
                                                                            <img src=${photoSrc} style="margin-top:1px" />
                                                                        </div>




                                                                        <div class="detailss" >
                                                                            <table class="detailss" style="margin-top:40px;">
                                                                            <tbody>
 ${filteredSetting.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                        <tr key="${setting.id}">
                                                            <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                            <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                        </tr>
                                                    `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>


                                                                        <div class="footers">
                                                                            <div class="signatures">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                               
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>

                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                         <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                             <div class="id-card-containers" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/09/39/id-4-back.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-contents">
                                                                            <p class="id-card-issue-dates">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-dates">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructionss">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-codes">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-infos">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                                    </div>
                         `
                    }
                }
                if (template == 3) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               

                                                                 

                                                                    <div class="id-card-containersa1" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/16/18/18/id-1-f.png'); background-size: cover; background-position: center;">
                                                                        <div class="header1">
                                                                            <div style="float:left;">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%;
                                                                                    object-fit: cover; " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div style="float:right;">
                                                                                <p style="font-weight: bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; margin-left: 4px; font-size: 10px; margin-top: 5px;">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div class="imgs">
                                                                                    <img style="height: 90px;
    width: 90px;
    border-radius: 50px;
    margin-top: 40px;
    margin-left: -20px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p style="
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 115px;
    left: -15px;
    font-size: 12px;
    font-weight: bold;
    width: 55px;
    text-align: center;
     -webkit-transform: rotate(270deg) !important;

                -ms-transform: rotate(270deg) !important;

                transform: rotate(270deg) !important;
    " className='rotate-text-lefts1'><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 115px;
    right: -16px;
    font-size: 12px;
    font-weight: bold;
    width: 55px;
    text-align: center;
     -webkit-transform: rotate(270deg) !important;

                -ms-transform: rotate(270deg) !important;

                transform: rotate(270deg) !important;
    " className='rotate-text-rights1'><small>${searchResult?.unique_id || 'ID: No. N/A'}</small></p>
                                                                                </div>
                                                                       
                                                                        <div class="details1">
                                                                            <table class="details1">
                                                                            <tbody>
                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer1">
                                                                            <div class="signature1">
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container1" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/16/18/19/id-b-1.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-content1">
                                                                            <p class="id-card-issue-date1">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date1">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions1">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code1">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info1">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                             
                                                          
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                          <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               

                                                                 

                                                                    <div class="id-card-containersa1" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/16/18/18/id-1-f.png'); background-size: cover; background-position: center;">
                                                                        <div class="header1">
                                                                            <div style="float:left;">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%;
                                                                                    object-fit: cover; " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div style="float:right;">
                                                                                <p style="font-weight: bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; margin-left: 4px; font-size: 10px; margin-top: 5px;">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div class="imgs">
                                                                                    <img style="height: 90px;
    width: 90px;
    border-radius: 50px;
    margin-top: 40px;
    margin-left: -20px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div className='text'>
                                                                                    <p style="
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 115px;
    left: -15px;
    font-size: 12px;
    font-weight: bold;
    width: 55px;
    text-align: center;
     -webkit-transform: rotate(270deg) !important;

                -ms-transform: rotate(270deg) !important;

                transform: rotate(270deg) !important;
    " className='rotate-text-lefts1'><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 115px;
    right: -16px;
    font-size: 12px;
    font-weight: bold;
    width: 55px;
    text-align: center;
     -webkit-transform: rotate(270deg) !important;

                -ms-transform: rotate(270deg) !important;

                transform: rotate(270deg) !important;
    " className='rotate-text-rights1'><small>${searchResult?.unique_id || 'ID: No. N/A'}</small></p>
                                                                                </div>
                                                                       
                                                                        <div class="details1">
                                                                            <table class="details1">
                                                                            <tbody>
                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer1">
                                                                            <div class="signature1">
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                         <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                                <div class="id-card-container1" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/16/18/19/id-b-1.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-content1">
                                                                            <p class="id-card-issue-date1">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date1">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions1">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code1">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info1">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                                    </div>
                         `
                    }
                }
                if (template == 4) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
                                                                    <div class="id-card-container122" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/09/45/id-2-f.png'); background-size: cover; background-position: center;">
                                                                        <div class="header12">
                                                                            <div style="float:left">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div style="float:right">
                                                                                <p style="font-weight:bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; font-size:8px; margin-top:5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        

<div class="imgs">
                                                                                    <img style="    height: 89px;
    width: 89px;
    border-radius: 50px;
    margin-top: 35px;
    margin-left: -19px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="    width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 90px;
    left: -16px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 90px;
    right: 24px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details12">
                                                                            <table class="details12" style="margin-top:30px;" >
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer12">
                                                                            <div class="signature12">
                                                                             
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container12" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/09/45/Id-2-back.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-content12">
                                                                            <p class="id-card-issue-date12">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date12">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions12">
                                                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code12">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info12">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                
                                                             
                                                          
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                                <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
                                                                    <div class="id-card-container122" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/09/45/id-2-f.png'); background-size: cover; background-position: center;">
                                                                        <div class="header12">
                                                                            <div style="float:left">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div style="float:right">
                                                                                <p style="font-weight:bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; font-size:8px; margin-top:5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        

<div class="imgs">
                                                                                    <img style="    height: 89px;
    width: 89px;
    border-radius: 50px;
    margin-top: 35px;
    margin-left: -19px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="    width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 90px;
    left: -16px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 90px;
    right: 24px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details12">
                                                                            <table class="details12" style="margin-top:30px;" >
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer12">
                                                                            <div class="signature12">
                                                                             
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                         <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                                   <div class="id-card-container12" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/09/45/Id-2-back.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-content12">
                                                                            <p class="id-card-issue-date12">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date12">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions12">
                                                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code12">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info12">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                
                                                                    </div>
                         `
                    }
                }
                if (template == 5) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
                                                                 <div class="id-card-container55" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/17/id-5-f.png'); background-size: cover; background-position: center;">
                                                                        <div class="header5">
                                                                            <div style="float:left;">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div style="float:right">
                                                                                <p style=" font-weight: bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style=" text-align: left; margin-left: 2px; font-size: 10px; margin-top: 15px ">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                       
<div class="imgs2">
                                                                                    <img style="    height: 95px;
    width: 95px;
    border-radius: 50%;
    margin-top: 36px;
    margin-left: 36px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 112px;
    left: -16px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;""><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 112px;
    right: 24px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details5">
                                                                            <table class="details5">
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer5">
                                                                            <div class="signature5">
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container5" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/16/id-5-back.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-content5">
                                                                            <p class="id-card-issue-date5">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date5">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions5">
                                                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code5">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info5">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                             
                                                          
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                                <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
                                                                     <div class="id-card-container55" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/17/id-5-f.png'); background-size: cover; background-position: center;">
                                                                        <div class="header5">
                                                                            <div style="float:left;">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div style="float:right">
                                                                                <p style=" font-weight: bold">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style=" text-align: left; margin-left: 2px; font-size: 10px; margin-top: 15px ">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                       
<div class="imgs2">
                                                                                    <img style="    height: 95px;
    width: 95px;
    border-radius: 50%;
    margin-top: 36px;
    margin-left: 36px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 112px;
    left: -16px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;""><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 112px;
    right: 24px;
    width:40px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details5">
                                                                            <table class="details5">
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer5">
                                                                            <div class="signature5">
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                             
                         `
                    }
                    if (templateSide == 2) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                                <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
                                                             <div class="id-card-container5" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/16/id-5-back.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-content5">
                                                                            <p class="id-card-issue-date5">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date5">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions5">
                                                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code5">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info5">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>  
                                                                    </div>
                                                             
                         `
                    }
                }
                if (template == 6) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
 <div class="id-card-container66" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/55/id-f-6.png'); background-size: cover; background-position: center;">
                                                                        <div class="header6">
                                                                            <div style="float: left;">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div style="float:right">
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; margin-left: 4px; font-size: 10px; margin-top: 5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div class="imgs">
                                                                                    <img style="    height: 91px;
    width: 91px;
    border-radius: 50px;
    margin-top: 41px;
    margin-left: -19.5px;
" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="
                                                                                     -webkit-transform: rotate(270deg) !important;

                -ms-transform: rotate(270deg) !important;

                transform: rotate(270deg) !important;
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 80px;
    left: -36px;
    font-size: 12px;
    font-weight: bold;
    width: 50px;
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="     -webkit-transform: rotate(270deg) !important;

                -ms-transform: rotate(270deg) !important;

                transform: rotate(270deg) !important;
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 80px;
    right: 4px;
    font-size: 12px;
    font-weight: bold;
    width: 50px;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details6">
                                                                            <table class="details6">
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer6">
                                                                            <div class="signature6">
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container6" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/55/id-b-6.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-content6">
                                                                            <p class="id-card-issue-date6">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date6">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions6">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code6">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info6">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                          
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                             <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
<div class="id-card-container66" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/55/id-f-6.png'); background-size: cover; background-position: center;">
                                                                        <div class="header6">
                                                                            <div style="float: left;">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div style="float:right">
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; margin-left: 4px; font-size: 10px; margin-top: 5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div class="imgs">
                                                                                    <img style="    height: 91px;
    width: 91px;
    border-radius: 50px;
    margin-top: 41px;
    margin-left: -19.5px;
" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="
                                                                                     -webkit-transform: rotate(270deg) !important;

                -ms-transform: rotate(270deg) !important;

                transform: rotate(270deg) !important;
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 80px;
    left: -36px;
    font-size: 12px;
    font-weight: bold;
    width: 50px;
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style="     -webkit-transform: rotate(270deg) !important;

                -ms-transform: rotate(270deg) !important;

                transform: rotate(270deg) !important;
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 80px;
    right: 4px;
    font-size: 12px;
    font-weight: bold;
    width: 50px;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details6">
                                                                            <table class="details6">
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer6">
                                                                            <div class="signature6">
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                         <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                              <div class="id-card-container6" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/55/id-b-6.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-content6">
                                                                            <p class="id-card-issue-date6">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date6">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions6">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code6">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info6">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                          
                         `
                    }
                }
                if (template == 7) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
   <div class="id-card-container77" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/11/46/id-7-f.png'); background-size: cover; background-position: center;">
                                                                        <div class="header7">
                                                                            <div style="float:left">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div style="float:right;">
                                                                                <p style="font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style=" text-align: left; margin-left: 4px; font-size: 10px; margin-top: 5px ">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                       
   <div class="imgs">
                                                                                    <img style="height: 90px;
    width: 90px;
    border-radius: 50px;
    margin-top: 51px;
    margin-left: -16px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="    width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style=" -webkit-transform: rotate(270deg) !important;

                -ms-transform: rotate(270deg) !important;

                transform: rotate(270deg) !important;
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 80px;
    left: -36px;
    font-size: 12px;
    font-weight: bold;
    width: 45px;
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style=" -webkit-transform: rotate(270deg) !important;

                -ms-transform: rotate(270deg) !important;

                transform: rotate(270deg) !important;
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 80px;
    right: 4px;
    font-size: 12px;
    font-weight: bold;
    width: 45px;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details7">
                                                                            <table class="details7">
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer7">
                                                                            <div class="signature7">
                                                                               
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container7" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/11/47/id-7-back.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-content7">
                                                                            <p class="id-card-issue-date7">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date7">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions7">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code7">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info7">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                          
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                             <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
   <div class="id-card-container77" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/11/46/id-7-f.png'); background-size: cover; background-position: center;">
                                                                        <div class="header7">
                                                                            <div style="float:left">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div style="float:right;">
                                                                                <p style="font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style=" text-align: left; margin-left: 4px; font-size: 10px; margin-top: 5px ">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                       
   <div class="imgs">
                                                                                    <img style="height: 90px;
    width: 90px;
    border-radius: 50px;
    margin-top: 51px;
    margin-left: -16px;" src=${photoSrc} />
                                                                                </div>
                                                                                <div style="    width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style=" -webkit-transform: rotate(270deg) !important;

                -ms-transform: rotate(270deg) !important;

                transform: rotate(270deg) !important;
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 80px;
    left: -36px;
    font-size: 12px;
    font-weight: bold;
    width: 45px;
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style=" -webkit-transform: rotate(270deg) !important;

                -ms-transform: rotate(270deg) !important;

                transform: rotate(270deg) !important;
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 80px;
    right: 4px;
    font-size: 12px;
    font-weight: bold;
    width: 45px;
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details7">
                                                                            <table class="details7">
                                                                            <tbody>
                                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                            <tr key="${setting.id}">
                                                                                                                <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                            </tr>
                                                                                                        `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer7">
                                                                            <div class="signature7">
                                                                               
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                         <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                             <div class="id-card-container7" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/11/47/id-7-back.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-content7">
                                                                            <p class="id-card-issue-date7">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date7">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions7">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code7">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info7">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                                    </div>
                         `
                    }
                }
                if (template == 8) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                                   <div class="id-card-container88"  style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/05/id-8.png'); background-size: cover; background-position: center;">
                                                                        <div class="header8">
                                                                            <div style="float:left">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div style="float:right">
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style=" text-align: left; margin-left: 4px; font-size: 10px; margin-top: 5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>

                                                                                 <div  class="imgs">
                                                                                    <img
        style="height: 66px;
               width: 66px;
               border-radius: 50%;
               position: absolute;
               top: 63px;
               left: -8px;"
        src="${photoSrc}" />

    <!-- Second Image -->
    <img
        style="position: absolute;
               top: 32px;
               left: -33px;
               width: 112px;
               height: 112px;"
        src="http://192.168.0.114:5003/asset_info/2025/01/21/15/00/Shape-2%20(1).png" />
</div>
                                                                                <div style="    width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 45px;
    left: -16px;
    font-size: 12px;
    font-weight: bold;
     width: 34px; 
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style=" 
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 45px;
    right: 26px;
    font-size: 12px;
    font-weight: bold;
     width: 34px; 
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details8">
                                                                            <table class="details8">
                                                                            <tbody>
                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer8">
                                                                            <div class="signature8">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                              
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container8"  style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/05/id-8-b.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-content8">
                                                                            <p class="id-card-issue-date8">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date8">Expire Date: 2024-8-31</p>
                                                                            <p class="id-card-instructions8">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code8">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info8">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                             <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                                   <div class="id-card-container88"  style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/05/id-8.png'); background-size: cover; background-position: center;">
                                                                        <div class="header8">
                                                                            <div style="float:left">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div style="float:right">
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style=" text-align: left; margin-left: 4px; font-size: 10px; margin-top: 5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>

                                                                                 <div  class="imgs">
                                                                                    <img
        style="height: 66px;
               width: 66px;
               border-radius: 50%;
               position: absolute;
               top: 63px;
               left: -8px;"
        src="${photoSrc}" />

    <!-- Second Image -->
    <img
        style="position: absolute;
               top: 32px;
               left: -33px;
               width: 112px;
               height: 112px;"
        src="http://192.168.0.114:5003/asset_info/2025/01/21/15/00/Shape-2%20(1).png" />
</div>
                                                                                <div style="    width: 205px;
    height: 326px;
    position: absolute;">
                                                                                    <p style="
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 45px;
    left: -16px;
    font-size: 12px;
    font-weight: bold;
     width: 34px; 
    text-align: center;"><small>${searchResult?.designation_name || 'N/A'}</small></p>
                                                                                    <p style=" 
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: 45px;
    right: 26px;
    font-size: 12px;
    font-weight: bold;
     width: 34px; 
    text-align: center;"><small>${searchResult?.unique_id || 'N/A'}</small></p>
                                                                                </div>

                                                                        <div class="details8">
                                                                            <table class="details8">
                                                                            <tbody>
                                                                            ${filteredSettings.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer8">
                                                                            <div class="signature8">
                                                                                <p style={{ marginBottom: '80px' }}></p>
                                                                              
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                         <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                            
                                                                    <div class="id-card-container8"  style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/05/id-8-b.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-content8">
                                                                            <p class="id-card-issue-date8">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date8">Expire Date: 2024-8-31</p>
                                                                            <p class="id-card-instructions8">
                                                                             ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code8">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info8">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                                    </div>
                         `
                    }
                }
                if (template == 9) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div class="id-card-row" >
                                 <div class="id-card-container99">

                                                                    <div class="header9">
                                                                        <div>
                                                                            <h6 style="text-align: left;
    margin-left: 5px;
    font-size: 12px;
    margin-top: 10px;
">IDENTITY CARD</h6>

                                                                        </div>
                                                                        <div className='header_text' style="display: flex;margin-right: 17px;margin-top: -35px;">
                                                                            
                                                                            <div style="float:right">
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                            </div>
                                                                            <img style=" float:right;
                                                                                height: 35px;
                                                                                width: 35px;
                                                                                border-radius: 50%; // Makes the image round
                                                                                object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                            " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />

                                                                        </div>
                                                                    </div>

                                                                    <div class="profile-section9">
                                                                        <div class="profile-image9" style="float:left;">
                                                                            <img  src=${photoSrc} />
                                                                        </div>
                                                                        <div class="details9" style="float:left;">
                                                                            <div className='teacher_information'>
                                                                                <h3>${searchResult?.full_name || 'N/A'}</h3>
                                                                                <p>${searchResult?.designation_name || 'N/A'}</p>
                                                                            </div>
                                                                            <div class="info9">
                                                                                <table class="info9">
                                                                                   

<tbody>
                                                                                             ${filteredSettingss.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>

                                                                                </table>

                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                </div>


                                                                <div class="id-card-container9">
                                                                    <div class="id-card-content9">
                                                                        <p class="id-card-issue-date9">Issue Date: ${(fromDates)}</p>
                                                                        <p class="id-card-expire-date9">Expire Date: ${(toDates)}</p>
                                                                        <p class="id-card-instructions9">
                                                                       ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                        </p>
                                                                        <div class="id-card-qr-code9">
                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                        </div>
                                                                        <p class="id-card-school-info9">
                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                Phone: 01735879633</small>
                                                                        </p>
                                                                      
                                                                    </div>
                                                                </div>
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                           <div class="id-card-row" >
                                 <div class="id-card-container99">

                                                                    <div class="header9">
                                                                        <div>
                                                                            <h6 style="text-align: left;
    margin-left: 5px;
    font-size: 12px;
    margin-top: 10px;
">IDENTITY CARD</h6>

                                                                        </div>
                                                                        <div className='header_text' style="display: flex;margin-right: 17px;margin-top: -35px;">
                                                                            
                                                                            <div style="float:right">
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                            </div>
                                                                            <img style=" float:right;
                                                                                height: 35px;
                                                                                width: 35px;
                                                                                border-radius: 50%; // Makes the image round
                                                                                object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                            " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />

                                                                        </div>
                                                                    </div>

                                                                    <div class="profile-section9">
                                                                        <div class="profile-image9" style="float:left;">
                                                                            <img  src=${photoSrc} />
                                                                        </div>
                                                                        <div class="details9" style="float:left;">
                                                                            <div className='teacher_information'>
                                                                                <h3>${searchResult?.full_name || 'N/A'}</h3>
                                                                                <p>${searchResult?.designation_name || 'N/A'}</p>
                                                                            </div>
                                                                            <div class="info9">
                                                                                <table class="info9">
                                                                                   

<tbody>
                                                                                             ${filteredSettingss.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>

                                                                                </table>

                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                </div>
                                </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                              <div class="id-card-container9">
                                                                    <div class="id-card-content9">
                                                                        <p class="id-card-issue-date9">Issue Date: ${(fromDates)}</p>
                                                                        <p class="id-card-expire-date9">Expire Date: ${(toDates)}</p>
                                                                        <p class="id-card-instructions9">
                                                                       ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                        </p>
                                                                        <div class="id-card-qr-code9">
                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                        </div>
                                                                        <p class="id-card-school-info9">
                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                Phone: 01735879633</small>
                                                                        </p>
                                                                      
                                                                    </div>
                                                                </div>
                         `
                    }
                }
                if (template == 10) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
   <div class="id-card-container100" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/26/id-10.png'); background-size: cover; background-position: center;">
                                                                        <div class="header10">
                                                                            <div style="float:left;">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div style="float:right;">
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; margin-left: 4px; font-size: 10px; margin-top: 5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                  

<div class="imgs">
                                                                                    <img style="    height: 73px;
    width: 73px;
    border-radius: 50%;
    margin-top: 50px;
    margin-left: -8px;" src=${photoSrc} />
                                                                                </div>
                                                                        <div class="details10">
                                                                            <table class="details10">
                                                                            <tbody>
                                                                            ${filteredSetting.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer10">
                                                                            <div class="signature10">
                                                                              
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="id-card-container10" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/27/id-10-b.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-content10">
                                                                            <p class="id-card-issue-date10">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date10">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions10">
                                                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code10">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info10">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                           <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               
   <div class="id-card-container100" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/26/id-10.png'); background-size: cover; background-position: center;">
                                                                        <div class="header10">
                                                                            <div style="float:left;">
                                                                                <img style="
                                                                                    height: 25px;
                                                                                    width: 25px;
                                                                                    border-radius: 50%; // Makes the image round
                                                                                    object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                                " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />
                                                                            </div>
                                                                            <div style="float:right;">
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                                <h6 style="text-align: left; margin-left: 4px; font-size: 10px; margin-top: 5px">IDENTITY CARD</h6>
                                                                            </div>
                                                                        </div>
                                                                  

<div class="imgs">
                                                                                    <img style="    height: 73px;
    width: 73px;
    border-radius: 50%;
    margin-top: 50px;
    margin-left: -8px;" src=${photoSrc} />
                                                                                </div>
                                                                        <div class="details10">
                                                                            <table class="details10">
                                                                            <tbody>
                                                                            ${filteredSetting.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>
                                                                            </table>
                                                                        </div>

                                                                        <div class="footer10">
                                                                            <div class="signature10">
                                                                              
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                         <div class="id-card-rows" style='float:left;height:178mm; width:56.88mm;overflow:hidden;'  >
                               <div class="id-card-container10" style="background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/27/id-10-b.png'); background-size: cover; background-position: center;">
                                                                        <div class="id-card-content10">
                                                                            <p class="id-card-issue-date10">Issue Date: ${(fromDates)}</p>
                                                                            <p class="id-card-expire-date10">Expire Date: ${(toDates)}</p>
                                                                            <p class="id-card-instructions10">
                                                                            ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                            </p>
                                                                            <div class="id-card-qr-code10">
                                                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                            </div>
                                                                            <p class="id-card-school-info10">
                                                                                <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                                <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                    Phone: 01735879633</small>
                                                                            </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                                    </div>
                         `
                    }
                }
                if (template == 11) {
                    if (templateSide == 0) {
                        // ID Card Front Side (templateSide 0)
                        tableRows += `
                           
                            <div class="id-card-row" >
                                 <div class="id-card-container111">

                                                                    <div class="header11">
                                                                    
                                                                            <h6 style="text-align: left; ">IDENTITY CARD</h6>

                                                                 
                                                                        <div className='header_text11' style=" margin-top:-30px;
    margin-right: 6px;">
                                                                           
                                                                            <div style="float: right;">
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                            </div>
                                                                             <img  style="
                                                                             float: right;
                                                                                height: 35px;
                                                                                width: 35px;
                                                                                border-radius: 50%; // Makes the image round
                                                                                object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                            " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />

                                                                        </div>
                                                                    </div>

                                                                    <div class="profile-section11">
                                                                        <div class="profile-image11" style="float: left; margin-top:16px;">
                                                                            <img  src=${photoSrc} alt="Profile Picture" />
                                                                        </div>
                                                                        <div class="details111" style="float: left; margin-top:20px;">
                                                                            <div className='teacher_information11' >
                                                                                <h3>${searchResult?.full_name || 'N/A'}</h3>
                                                                                <p>${searchResult?.designation_name || 'N/A'}</p>
                                                                            </div>
                                                                            <div class="info11">
                                                                                <table>
                                                                                   
                                                                                     <tbody>
                                                                                                ${filteredSettingss.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>

                                                                                </table>

                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                </div>
                                                                <div class="id-card-container11">
                                                                    <div class="id-card-content11">
                                                                        <p class="id-card-issue-date11">Issue Date: ${(fromDates)}</p>
                                                                        <p class="id-card-expire-date11">Expire Date: ${(toDates)}</p>
                                                                        <p class="id-card-instructions11">
                                                                       ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                        </p>
                                                                        <div class="id-card-qr-code11">
                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                        </div>
                                                                        <p class="id-card-school-info11">
                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                Phone: 01735879633</small>
                                                                        </p>
                                                                        
                                                                    </div>
                                                                </div>
                            </div>
                        
                        `;
                    }

                    // Template 2 logic (Second template)
                    if (templateSide == 1) {
                        // ID Card Front Side (templateSide 1)
                        tableRows += `
                       <div class="id-card-row" >
                                 <div class="id-card-container111">

                                                                    <div class="header11">
                                                                    
                                                                            <h6 style="text-align: left; ">IDENTITY CARD</h6>

                                                                 
                                                                        <div className='header_text11' style=" margin-top:-30px;
    margin-right: 6px;">
                                                                           
                                                                            <div style="float: right;">
                                                                                <p style=" font-weight: bold ">Abdul Malek Master Kindergarten<br />and High School</p>
                                                                                
                                                                            </div>
                                                                             <img  style="
                                                                             float: right;
                                                                                height: 35px;
                                                                                width: 35px;
                                                                                border-radius: 50%; // Makes the image round
                                                                                object-fit: cover;   // Ensures the image fits perfectly inside the circle
                                                                            " class="logo" src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="School Logo" />

                                                                        </div>
                                                                    </div>

                                                                    <div class="profile-section11">
                                                                        <div class="profile-image11" style="float: left; margin-top:16px;">
                                                                            <img  src=${photoSrc} alt="Profile Picture" />
                                                                        </div>
                                                                        <div class="details111" style="float: left; margin-top:20px;">
                                                                            <div className='teacher_information11' >
                                                                                <h3>${searchResult?.full_name || 'N/A'}</h3>
                                                                                <p>${searchResult?.designation_name || 'N/A'}</p>
                                                                            </div>
                                                                            <div class="info11">
                                                                                <table>
                                                                                   
                                                                                     <tbody>
                                                                                                ${filteredSettingss.map(setting => {
                            let value = searchResult?.[setting.column_name] ?? "N/A";
                            if (setting.column_name === "join_date" && value !== "N/A") {
                                value = value.slice(0, 10);
                            }
                            return `
                                                                                                                                                                <tr key="${setting.id}">
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">${setting.display_name || ""}</td>
                                                                                                                                                                    <td style="width: 50%; margin: 3px;">: ${value}</td>
                                                                                                                                                                </tr>
                                                                                                                                                            `;
                        }).join('')}
                                                                                        </tbody>

                                                                                </table>

                                                                            </div>
                                                                        </div>
                                                                    </div>



                                                                </div>
                                                                </div>
                        `;
                    }

                    // Template 3 logic (Third template)
                    if (templateSide == 2) {
                        tableRows += ` 
                              <div class="id-card-container11">
                                                                    <div class="id-card-content11">
                                                                        <p class="id-card-issue-date11">Issue Date: ${(fromDates)}</p>
                                                                        <p class="id-card-expire-date11">Expire Date: ${(toDates)}</p>
                                                                        <p class="id-card-instructions11">
                                                                       ${employee_id_card_setting_back_list.map((employeeSettings) => {
                            return `
                                                    <strong>${formData[employeeSettings.id]?.upper_text_1 || ''}</strong><br />
                                                    <small>${formData[employeeSettings.id]?.upper_text_2 || ''}</small>
                                                `;
                        }).join('')}
                                                                        </p>
                                                                        <div class="id-card-qr-code11">
                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1AQl1VwPGJDPYgzr5f9WquF5A1bMId_CAYxnC-658B1ZpjZNQoeO6DVCKtPeSA-I0p8&usqp=CAU" alt="QR Code" />
                                                                        </div>
                                                                        <p class="id-card-school-info11">
                                                                            <strong>Abdul Malek Master Kindergarten and High School</strong><br />
                                                                            <small> Address: Beraider Chala, Sreepur, Gazipur<br />
                                                                                Phone: 01735879633</small>
                                                                        </p>
                                                                        
                                                                    </div>
                                                                </div>
                         `
                    }
                }


            });
            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';
            // Prepare final HTML document
            const html = `
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Employee ID Cards</title>
                        <style>
                    @page {
                        size: ${pageSize} ${pageOrientation}; /* This sets the page size to A4 and orientation to Portrait */
                        margin: 0mm; /* Adjust the margin as needed */
                    }
                            body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                       
                            margin: 0;
                            }
                            @media (max-width: 1200px) {
                                .id-card-row {
                                    grid-template-columns: repeat(2, 1fr); /* 4 columns on medium screens */
                                }
                            }

                            @media (max-width: 992px) {
                                .id-card-row {
                                    grid-template-columns: repeat(1, 1fr); /* 3 columns on smaller screens */
                                }
                            }

                            @media (max-width: 768px) {
                                .id-card-row {
                                    grid-template-columns: repeat(1, 1fr); /* 2 columns on mobile screens */
                                }
                            }

                            @media (max-width: 480px) {
                                .id-card-row {
                                    grid-template-columns: 1fr; /* 1 column on very small screens */
                                }
                            }
 .id-card-rows{
                                  page-break-inside: avoid;
                                 page-break-before: auto;
                                 }
                            .id-card-row{
                                display: grid;
                                grid-template-columns: repeat(2, 1fr); /* Creates 5 equal columns */
                                width: 100%;
                                
                                margin-top: 15px;
                                box-sizing: border-box;
                                page-break-inside: avoid;
                                 page-break-before: auto;
                             }
                                 .id-card-rows{
                                  page-break-inside: avoid;
                                 page-break-before: auto;
                                 }
                               .id-card-containerss {
                            width: 205px;
                            height: 326px;
                            background: url('http://192.168.0.114:5003/asset_info/2025/01/16/15/12/id-3-f.png') no-repeat center center / cover;
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            position: relative;
                            padding: 20px;
                            box-sizing: border-box;
                                page-break-inside: avoid;
                                 page-break-before: auto;
                            }

                            .id-card {
                            width: 205px;
                            height: 326px;
                            background-image: url('http://192.168.0.114:5003/asset_info/2025/01/16/15/12/id-3-f.png');
                  
                            background-size: cover;
                            background-position: center;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            color: #000;
                            }

                            .header {
                            text-align: center;
                            margin-bottom: 15px;
                            display: flex;
                            color: white;
                            margin-left: 10px;
                            }

                            .header .logo {
                            width: 70px;
                            height: 70px;
                            margin-bottom: 10px;
                            }

                            .header h1 {
                            font-size: 16px;
                            margin: 0;
                            font-weight: bold;
                            }

                            .header p {
                            font-size: 8px;
                            margin: 0;
                            }

                            .photo-section {

                            margin-bottom: 15px;
                            }

                            .rotate-text-left {
                               -webkit-transform: rotate(270deg) !important;

                -ms-transform: rotate(270deg) !important;

                transform: rotate(270deg) !important;
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: -50px;
    left: -36px;
    font-size: 12px;
    font-weight: bold;
    width: 55px;
    text-align: center;
                            }

                            .text {
                            width: 205px;
                            height: 326px;
                            position: absolute;
                         
                            }

                            .rotate-text-right {
                              -webkit-transform: rotate(270deg) !important;

                -ms-transform: rotate(270deg) !important;

                transform: rotate(270deg) !important;
    color: #fff;
    padding: 3px 10px;
    background: #323990;
    border-radius: 6px;
    position: absolute;
    top: -50px;
    right: 4px;
    font-size: 12px;
    font-weight: bold;
    width: 55px;
    text-align: center;
}
                            }

                            .rotate-img {
                            transform: rotate(45deg);
                    
                            position: fixed;

                            }
                            .imgs {
                            position: absolute;
                            left: 77px;
                            width: 77px;
                            height: 100px;
                            margin-top: 2px;
                            background-repeat: no-repeat;
                            background-position: center;
                            background-size: 90px 90px;
                            border-radius: 0px 30px 0px 30px;
                            }
                            .imgs2{
                                position: absolute;
                                /* left: 97px; */
                                width: 77px;
                                height: 100px;
                                background-repeat: no-repeat;
                                background-position: center;
                                background-size: 90px 90px;
                                border-radius: 0px 30px 0px 30px;
                            }
                            .img {
                            position: absolute;
                            left: 77px;
                            width: 75px;
                            height: 93px;
                            background-repeat: no-repeat;
                            background-position: center;
                            background-size: 90px 90px;
                            border-radius: 0px 30px 0px 30px;
                            }

                            .photo {
                            width: 100px;
                            height: 100px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-radius: 8px;

                            }

                            .photo img {
                            max-width: 90%;
                            max-height: 90%;
                            border-radius: 8px;
                            }



                            .info {
                            font-size: 12px;
                            text-align: left;
                            }

                            .details {
                            font-size: 9px;
                            line-height: 1.6;
                            margin-bottom: 15px;
                            margin-top: 20px;
                                margin-left: 0px;
    width: 165px;
                            }

                            .details1 {
                            font-size: 9px;
                            line-height: 1.6;
                            margin-bottom: 15px;
                   
                            margin-left: 15px;
                            }
                            .details13 {
                            font-size: 9px;
                            line-height: 1.6;
                            margin-bottom: 15px;
                        
                            margin-left: 15px;
                            }

                            .footer {
                            text-align: center;
                            font-size: 12px;
                            }

                            .signature {
                            margin-top: 15px;
                            }

                            .signature p {
                            margin: 0;
                            font-style: italic;
                            }

                            .signature hr {
                            width: 80px;
                            border: 1px solid #000;
                            }

                            /* back */
                            .id-card-container {
                            width: 205px;
                            height: 326px;
                            background: url('http://192.168.0.114:5003/asset_info/2025/01/16/15/17/Id-3-back.png') no-repeat center center / cover;
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            position: relative;
                            padding: 20px;
                            box-sizing: border-box;
                            }

                            .id-card-content {
                            color: #000;
                            text-align: center;
                            position: relative;
                            top: 30px;
                            }

                            .id-card-issue-date,
                            .id-card-expire-date {
                            font-size: 9px;
                            margin: 0;
                            }

                            .id-card-instructions {
                            font-size: 9px;
                            line-height: 1.5;
                            margin: 15px 0;
                            }

                            .id-card-qr-code img {
                            margin-top: -10px;
                            width: 70px;
                            height: 70px;
                            }

                            .id-card-school-info {
                            font-size: 9px;
                            line-height: 1.4;
                            margin: 5px 0;
                            }

                            .id-card-principal-signature {
                            font-size: 14px;
                            font-weight: bold;
                            margin-top: 20px;
                            }



                            // id 2
                            .id-cards {
                            width: 205px;
                            height: 326px;
                            background-image: url('id-4-f.png');
                            /* Use your second uploaded image */
                            background-size: cover;
                            background-position: center;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            color: #000;
                            }
 .id-card-containers2 {
                            width: 205px;
                            height: 326px;
                            background: url('http://192.168.0.114:5003/asset_info/2025/01/16/17/49/Id-4-f.png') no-repeat center center / cover;
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            position: relative;
                            padding: 20px;
                            box-sizing: border-box;
                            }
                            .headers {
                            text-align: center;
                            margin-bottom: 15px;
                            display: flex;
                            color: black;
                            margin-left: 10px;
                            }

                            .headers .logos {
                            width: 70px;
                            height: 70px;
                            margin-bottom: 10px;
                            }

                            .headers h1 {
                            font-size: 16px;
                            margin: 0;
                            font-weight: bold;
                            }

                            .headers p {
                            font-size: 8px;
                            margin: 0;
                            }

                            .photo-sections {
                            /* display: flex;
                            align-items: center;
                            justify-content: space-between; */
                            margin-bottom: 15px;
                            }

                            .rotate-texts {
                            transform: rotate(270deg);
                            /* Rotate 45 degrees */
                            }

                            .rotate-imgs {
                            transform: rotate(45deg);
                            /* Rotate 45 degrees */
                            }

                            .photos {
                            width: 100px;
                            height: 92px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-radius: 8px;
                            margin-top: 37px;
                            margin-left: -23px; 
                            }

                         

                            .photos img {
                           max-width: 80%;
    max-height: 89%;
    /* border-radius: 8px; */
    margin-left: 65px;
    margin-top: -39.5px;
                            }

                            .infos {
                            font-size: 12px;
                            text-align: left;
                            }

                            .detailss {
                            font-size: 9px;
                            line-height: 1.6;
                            margin-bottom: 15px;
                            margin-top: -10px;
                                margin-left: 0px;
    width: 165px;
                            }

                            .footers {
                            text-align: center;
                            font-size: 12px;
                            }

                            .signatures {
                            margin-top: 15px;
                            }

                            .signatures p {
                            margin: 0;
                            font-style: italic;
                            }

                            .signatures hr {
                            width: 80px;
                            border: 1px solid #000;
                            }

                            /* back */
                            .id-card-containers {
                            width: 205px;
                            height: 326px;
                            background: url('http://192.168.0.114:5003/asset_info/2025/01/19/09/39/id-4-back.png') no-repeat center center / cover;
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            position: relative;
                            padding: 20px;
                            box-sizing: border-box;
                            }

                            .id-card-contents {
                            color: #000;
                            text-align: center;
                            position: relative;
                            top: 30px;
                            }

                            .id-card-issue-dates,
                            .id-card-expire-dates {
                            font-size: 9px;
                            margin: 0;
                            }

                            .id-card-instructionss {
                            font-size: 9px;
                            line-height: 1.5;
                            margin: 15px 0;
                            }

                            .id-card-qr-codes img {
                            margin-top: -10px;
                            width: 70px;
                            height: 70px;
                            }

                            .id-card-school-infos {
                            font-size: 9px;
                            line-height: 1.4;
                            margin: 5px 0;
                            }

                            .id-card-principal-signatures {
                            font-size: 14px;
                            font-weight: bold;
                            margin-top: 20px;
                            }
                   
                        //   id 3
                            .id-card1 {
                                width: 205px;
                                height: 326px;
                                background-image: url('id-1-f.png');
                                /* Use your second uploaded image */
                                background-size: cover;
                                background-position: center;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                color: #000;
                                }
                                 .id-card-containersa1 {
                                width: 205px;
                                height: 326px;
                                background: url('http://192.168.0.114:5003/asset_info/2025/01/16/18/18/id-1-f.png') no-repeat center center / cover;
                                border-radius: 10px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                position: relative;
                                padding: 20px;
                                box-sizing: border-box;
                                }

                                .header1 {
                                text-align: center;
                                margin-bottom: 15px;
                                display: flex;
                                color: white;
                                margin-left: 4px;
                                }

                                .header1 .logo1 {
                                width: 70px;
                                height: 70px;
                                margin-bottom: 10px;
                                }

                                .header1 h1 {
                                font-size: 16px;
                                margin: 0;
                                font-weight: bold;
                                }
  
                                .header1 p {
                                font-size: 8px;
                                margin: 0;
                                }

                                .photo-section1 {
                                /* display: flex;
                                align-items: center;
                                justify-content: space-between; */
                                margin-bottom: 15px;
                                }

                                .rotate-text1 {
                                transform: rotate(270deg);
                                /* Rotate 45 degrees */
                                }

                                .rotate-img1 {
                                transform: rotate(45deg);
                                /* Rotate 45 degrees */
                                }

                                .photo1 {
                                width: 150px;
                                height: 150px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                border-radius: 8px;
                                /* margin-left: 90px;*/
                                margin-top: -45px;
                                }

                                .photo1 img {
                                max-width: 127%;
                                max-height: 100%;
                                border-radius: 50%;
                                }



                                .info1 {
                                font-size: 12px;
                                text-align: left;
                                }

                                .details1 {
                                font-size: 9px;
                                line-height: 1.6;
                                margin-bottom: 15px;
                                margin-top: 170px;
                                   margin-left: 0px;
    width: 165px;
                                }
                                .details11 {
                                font-size: 9px;
                                line-height: 1.6;
                                margin-bottom: 15px;
                                /* margin-top: 125px; */
                                margin-left: 15px;
                                }

                                .footer1 {
                                text-align: center;
                                font-size: 12px;
                                }

                                .signature1 {
                                margin-top: 15px;
                                }

                                .signature1 p {
                                margin: 0;
                                font-style: italic;
                                }

                                .signature1 hr {
                                width: 80px;
                                border: 1px solid #000;
                                }

                                /* back */
                                .id-card-container1 {
                                width: 205px;
                                height: 326px;
                                background: url('http://192.168.0.114:5003/asset_info/2025/01/16/18/19/id-b-1.png') no-repeat center center / cover;
                                border-radius: 10px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                position: relative;
                                padding: 20px;
                                box-sizing: border-box;
                                }

                                .id-card-content1 {
                                color: #000;
                                text-align: center;
                                position: relative;
                                /* top: 10px; */
                                }

                                .id-card-issue-date1,
                                .id-card-expire-date1 {
                                font-size: 9px;
                                color: white;
                                margin: 0;
                                }

                                .id-card-instructions1 {
                                font-size: 9px;
                                line-height: 1.5;
                                margin: 30px 0;
                                }

                                .id-card-qr-code1 img {
                                margin-top: -10px;
                                width: 70px;
                                height: 70px;
                                }

                                .id-card-school-info1 {
                                font-size: 9px;
                                line-height: 1.4;
                                margin: 5px 0;
                                }

                                .id-card-principal-signature1 {
                                font-size: 14px;
                                font-weight: bold;
                                margin-top: 20px;
                                }

                                /* id 4 */


                                .id-card12 {
                                width: 205px;
                                height: 326px;
                                background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/09/45/id-2-f.png');
                                /* Use your second uploaded image */
                                background-size: cover;
                                background-position: center;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                color: #000;
                                }
                                   .id-card-container122 {
                                width: 205px;
                                height: 326px;
                                background: url('http://192.168.0.114:5003/asset_info/2025/01/19/09/45/id-2-f.png') no-repeat center center / cover;
                                border-radius: 10px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                position: relative;
                                padding: 20px;
                                box-sizing: border-box;
                                }

                                .header12 {
                                text-align: center;
                                margin-bottom: 15px;
                                display: flex;
                                color: black;
                               
                                }

                                .header12 .logo12 {
                                width: 70px;
                                height: 70px;
                      
                                }

                                .header12 h1 {
                                font-size: 16px;
                                margin: 0;
                                font-weight: bold;
                                }

                                .header12 p {
                                font-size: 8px;
                                margin-left: -10px;
                                margin-top: 0 px;
                                }

                                .photo-section12 {
                                /* display: flex;
                                align-items: center;
                                justify-content: space-between; */
                                margin-bottom: 15px;
                                }

                                .rotate-text12 {
                                transform: rotate(270deg);
                                /* Rotate 45 degrees */
                                }

                                .rotate-img12 {
                                transform: rotate(45deg);
                                /* Rotate 45 degrees */
                                }

                                .photo12 {
                                width: 110px;
                                height: 100px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                border-radius: 8px;
                                margin-left: 4px;
                                margin-top: -36.5px;
                                }

                                .photo12 img {
                                max-width: 95%;
                                max-height: 90%;
                                border-radius: 50%;
                                }



                                .info12 {
                                font-size: 12px;
                                text-align: left;
                                }

                                .details12 {
                                font-size: 9px;
                                line-height: 1.6;
                                margin-bottom: 15px;
                                margin-top: 165px;
                                    margin-left: 0px;
    width: 165px;
                                }
                                .details124 {
                                font-size: 9px;
                                line-height: 1.6;
                                margin-bottom: 15px;
                                /* margin-top: 125px; */
                                margin-left: 15px;
                                }
                                .rotate-text-right1 {
                                
                                /* Rotate 45 degrees */
                                color: #fff;
                                padding: 3px 10px;
                                background: #323990;
                                border-radius: 6px;
                                position: absolute;
                                top: 46px;
                                right: 35px;
                                font-size: 12px;
                                font-weight: bold;

                                text-align: center;
                                }
                                .rotate-text-left1 {
                                
                                /* Rotate 45 degrees */
                                color: #fff;
                                padding: 3px 10px;
                                background: #323990;
                                border-radius: 6px;
                                position: absolute;
                                top: 46px;
                                left: -4px;
                                font-size: 12px;
                                font-weight: bold;

                                text-align: center;
                                }

                                .footer12 {
                                text-align: center;
                                font-size: 12px;
                                }

                                .signature12 {
                                margin-top: 15px;
                                }

                                .signature12 p {
                                margin: 0;
                                font-style: italic;
                                }

                                .signature12 hr {
                                width: 80px;
                                border: 1px solid #000;
                                }

                                /* back */
                                .id-card-container12 {
                                width: 205px;
                                height: 326px;
                                background: url('http://192.168.0.114:5003/asset_info/2025/01/19/09/45/Id-2-back.png') no-repeat center center / cover;
                                border-radius: 10px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                position: relative;
                                padding: 20px;
                                box-sizing: border-box;
                                }

                                .id-card-content12 {
                                color: #000;
                                text-align: center;
                                position: relative;
                                top: 30px;
                                }

                                .id-card-issue-date12,
                                .id-card-expire-date12 {
                                font-size: 9px;
                                margin: 0;
                                }

                                .id-card-instructions12 {
                                font-size: 9px;
                                line-height: 1.5;
                                margin: 15px 0;
                                }

                                .id-card-qr-code12 img {
                                margin-top: -10px;
                                width: 70px;
                                height: 70px;
                                }

                                .id-card-school-info12 {
                                font-size: 9px;
                                line-height: 1.4;
                                margin: 5px 0;
                                }

                                .id-card-principal-signature12 {
                                font-size: 14px;
                                font-weight: bold;
                                margin-top: 20px;
                                }


                                    /* id 5 */

                                    .id-card5 {
                                    width: 205px;
                                    height: 326px;
                                    background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/17/id-5-f.png');
                                    /* Use your second uploaded image */
                                    background-size: cover;
                                    background-position: center;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    color: #000;
                                    }
                                     .id-card-container55 {
                                    width: 205px;
                                    height: 326px;
                                    background: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/17/id-5-f.png') no-repeat center center / cover;
                                    border-radius: 10px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    position: relative;
                                    padding: 20px;
                                    box-sizing: border-box;
                                    }

                                    .header5 {
                                    text-align: center;
                                    margin-bottom: 15px;
                                    display: flex;
                                    color: black;
                                    margin-left: 8px;
                                    margin-top: -10px;
                                    }

                                    .header5 .logo5 {
                                    width: 70px;
                                    height: 70px;
                                    margin-bottom: 10px;
                                    }

                                    .header5 h1 {
                                    font-size: 16px;
                                    font-weight: bold;
                                    }

                                    .header5 p {
                                    font-size: 8px;
                                    margin: 0;
                                    }

                                    .photo-section5 {
                                    /* display: flex;
                                        align-items: center;
                                        justify-content: space-between; */
                                    margin-bottom: 15px;
                                    }

                                    .rotate-text5 {
                                    transform: rotate(270deg);
                                    /* Rotate 45 degrees */
                                    }

                                    .rotate-img5 {
                                    transform: rotate(45deg);
                                    /* Rotate 45 degrees */
                                    }
                                    .rotate-text-right2 {
                                    
                                    color: #fff;
                                        padding: 3px 10px;
                                        background: #323990;
                                        border-radius: 6px;
                                        position: absolute;
                                        top: 65px;
                                        right: 35px;
                                        font-size: 12px;
                                        font-weight: bold;
                                        text-align: center;

                                    text-align: center;
                                    }
                                    .rotate-text-left2 {

                                    color: #fff;
                                    padding: 3px 10px;
                                    background: #323990;
                                    border-radius: 6px;
                                    position: absolute;
                                    top: 65px;
                                    left: -4px;
                                    font-size: 12px;
                                    font-weight: bold;
                                    text-align: center;
                                    }

                                    .photo5 {
                                    width: 115px;
                                    height: 100px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    border-radius: 8px;
                                    margin-left: 4px;
                                    margin-top: -48px !important;
                                    }

                                    .photo5 img {
                                    max-width: 105%;
                                    max-height: 100%;
                                    border-radius: 50%;
                                    }



                                    .info5 {
                                    font-size: 12px;
                                    text-align: left;
                                    }

                                    .details5 {
                                    font-size: 9px;
                                    line-height: 1.6;
                                    margin-bottom: 15px;
                                    margin-top: 170px;
                                    margin-left: 0px;
                                    width: 165px;
                                    }
                                    .details55 {
                                    font-size: 9px;
                                    line-height: 1.6;
                                    margin-bottom: 15px;
                                    /* margin-top: 125px; */
                                    margin-left: 15px;
                                    }

                                    .footer5 {
                                    text-align: center;
                                    font-size: 12px;
                                    }

                                    .signature5 {
                                    margin-top: 15px;
                                    }

                                    .signature5 p {
                                    margin: 0;
                                    font-style: italic;
                                    }

                                    .signature5 hr {
                                    width: 80px;
                                    border: 1px solid #000;
                                    }

                                    /* back */
                                    .id-card-container5 {
                                    width: 205px;
                                    height: 326px;
                                    background: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/16/id-5-back.png') no-repeat center center / cover;
                                    border-radius: 10px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    position: relative;
                                    padding: 20px;
                                    box-sizing: border-box;
                                    }

                                    .id-card-content5 {
                                    color: #000;
                                    text-align: center;
                                    position: relative;
                                    top: 40px;
                                    }

                                    .id-card-issue-date5,
                                    .id-card-expire-date5 {
                                    font-size: 9px;
                                    margin: 0;
                                    }

                                    .id-card-instructions5 {
                                    font-size: 9px;
                                    line-height: 1.5;
                                    margin: 10px 0;
                                    }

                                    .id-card-qr-code5 img {
                                    margin-top: -10px;
                                    width: 70px;
                                    height: 70px;
                                    }

                                    .id-card-school-info5 {
                                    font-size: 9px;
                                    line-height: 1.4;
                                    margin: 5px 0;
                                    }

                                    .id-card-principal-signature5 {
                                    font-size: 14px;
                                    font-weight: bold;
                                    margin-top: 20px;
                                    }


                                    /* id 6 */

                                    .id-card6 {
                                    width: 205px;
                                    height: 326px;
                                    background-image: url('id-f-6.png');
                                    /* Use your second uploaded image */
                                    background-size: cover;
                                    background-position: center;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    color: #000;
                                    }
                                      .id-card-container66 {
                                    width: 205px;
                                    height: 326px;
                                    background: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/55/id-f-6.png') no-repeat center center / cover;
                                    border-radius: 10px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    position: relative;
                                    padding: 20px;
                                    box-sizing: border-box;
                                    }

                                    .header6 {
                                    text-align: center;
                                    margin-bottom: 15px;
                                    display: flex;
                                    color: black;
                                    margin-left: 10px;
                                    margin-top: -10px;
                                    }

                                    .header6 .logo6 {
                                    width: 70px;
                                    height: 70px;
                                    margin-bottom: 10px;
                                    }

                                    .header6 h1 {
                                    font-size: 16px;
                                    margin: 0;
                                    font-weight: bold;
                                    }

                                    .header6 p {
                                    font-size: 8px;
                                    margin: 0;
                                    }

                                    .photo-section6 {
                                    /* display: flex;
                                    align-items: center;
                                    justify-content: space-between; */
                                    margin-bottom: 15px;
                                    }

                                    .rotate-text6 {
                                    transform: rotate(270deg);
                                    /* Rotate 45 degrees */
                                    }

                                    .rotate-img6 {
                                    transform: rotate(45deg);
                                    /* Rotate 45 degrees */
                                    }

                                    .photo6 {
                                    width: 115px;
                                    height: 100px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    border-radius: 8px;
                                    margin-left: 5px;
                                    margin-top: -20px !important;
                                    }

                                    .photo6 img {
                                    max-width: 98%;
                                    max-height: 100%;
                                    border-radius: 50%;
                                    }



                                    .info6 {
                                    font-size: 12px;
                                    text-align: left;
                                    }

                                    .details6 {
                                    font-size: 9px;
                                    line-height: 1.6;
                                    margin-bottom: 15px;
                                    margin-top: 175px;
                                    margin-left: 0px;
                                    width: 165px;
                                    }
                                    .details66 {
                                    font-size: 9px;
                                    line-height: 1.6;
                                    margin-bottom: 15px;
                                    margin-top: 15px;
                                    margin-left: 15px;
                                    }

                                    .footer6 {
                                    text-align: center;
                                    font-size: 12px;
                                    }

                                    .signature6 {
                                    margin-top: 15px;
                                    }

                                    .signature6 p {
                                    margin: 0;
                                    font-style: italic;
                                    }

                                    .signature6 hr {
                                    width: 80px;
                                    border: 1px solid #000;
                                    }

                                    /* back */
                                    .id-card-container6 {
                                    width: 205px;
                                    height: 326px;
                                    background: url('http://192.168.0.114:5003/asset_info/2025/01/19/10/55/id-b-6.png') no-repeat center center / cover;
                                    border-radius: 10px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    position: relative;
                                    padding: 20px;
                                    box-sizing: border-box;
                                    }

                                    .id-card-content6 {
                                    color: #000;
                                    text-align: center;
                                    position: relative;
                                    top: 32px;
                                    }

                                    .id-card-issue-date6,
                                    .id-card-expire-date6 {
                                    font-size: 9px;
                                    margin: 0;
                                    }

                                    .id-card-instructions6 {
                                    font-size: 9px;
                                    line-height: 1.5;
                                    margin: 10px 0;
                                    }

                                    .id-card-qr-code6 img {
                                    margin-top: -10px;
                                    width: 70px;
                                    height: 70px;
                                    }

                                    .id-card-school-info6 {
                                    font-size: 9px;
                                    line-height: 1.4;
                                    margin: 5px 0;
                                    }

                                    .id-card-principal-signature6 {
                                    font-size: 14px;
                                    font-weight: bold;
                                    margin-top: 20px;
                                    }
                                  /* id 7 */

                                    .id-card7 {
                                    width: 205px;
                                    height: 326px;
                                    background-image: url('id-7-f.png');
                                    /* Use your second uploaded image */
                                    background-size: cover;
                                    background-position: center;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    color: #000;
                                    }
                                 .id-card-container77 {
                                    width: 205px;
                                    height: 326px;
                                    background: url('http://192.168.0.114:5003/asset_info/2025/01/19/11/46/id-7-f.png') no-repeat center center / cover;
                                    border-radius: 10px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    position: relative;
                                    padding: 20px;
                                    box-sizing: border-box;
                                    }
                                    .header7 {
                                    text-align: center;
                                    margin-bottom: 15px;
                                    display: flex;
                                    color: black;
                                    margin-left: 10px;
                                    margin-top: -10px;
                                    }

                                    .header7 .logo7 {
                                    width: 70px;
                                    height: 70px;
                                    margin-bottom: 10px;
                                    }

                                    .header7 h1 {
                                    font-size: 16px;
                                    margin: 0;
                                    font-weight: bold;
                                    }

                                    .header7 p {
                                    font-size: 8px;
                                    margin: 0;
                                    }

                                    .photo-section7 {
                                    /* display: flex;
                                    align-items: center;
                                    justify-content: space-between; */
                                    margin-bottom: 15px;
                                    }

                                    .rotate-text7 {
                                    transform: rotate(270deg);
                                    /* Rotate 45 degrees */
                                    }

                                    .rotate-img7 {
                                    transform: rotate(45deg);
                                    /* Rotate 45 degrees */
                                    }

                                    .photo7 {
                                    width: 115px;
                                    height: 100px;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    border-radius: 8px;
                                    margin-left: 9px;
                                    margin-top: -11px !important;
                                    }

                                    .photo7 img {
                                    max-width: 98%;
                                    max-height: 100%;
                                    border-radius: 50%;
                                    }



                                    .info7 {
                                    font-size: 12px;
                                    text-align: left;
                                    }

                                    .details7 {
                                    font-size: 9px;
                                    line-height: 1.6;
                                    margin-bottom: 15px;
                                    margin-top: 170px;
                                    margin-left: 0px;
                                    width: 165px ;
                                    }
                                    .details77 {
                                    font-size: 9px;
                                    line-height: 1.6;
                                    margin-bottom: 15px;
                                    margin-top: 15px;
                                    margin-left: 15px;
                                    }

                                    .footer7 {
                                    text-align: center;
                                    font-size: 12px;
                                    }

                                    .signature7 {
                                    margin-top: 15px;
                                    }

                                    .signature7 p {
                                    margin: 0;
                                    font-style: italic;
                                    }

                                    .signature7 hr {
                                    width: 80px;
                                    border: 1px solid #000;
                                    }

                                    /* back */
                                    .id-card-container7 {
                                    width: 205px;
                                    height: 326px;
                                    background: url('http://192.168.0.114:5003/asset_info/2025/01/19/11/47/id-7-back.png') no-repeat center center / cover;
                                    border-radius: 10px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    position: relative;
                                    padding: 20px;
                                    box-sizing: border-box;
                                    }

                                    .id-card-content7 {
                                    color: #000;
                                    text-align: center;
                                    position: relative;
                                    top: 32px;
                                    }

                                    .id-card-issue-date7,
                                    .id-card-expire-date7 {
                                    font-size: 9px;
                                    margin: 0;
                                    }

                                    .id-card-instructions7 {
                                    font-size: 9px;
                                    line-height: 1.5;
                                    margin: 10px 0;
                                    }

                                    .id-card-qr-code7 img {
                                    margin-top: -10px;
                                    width: 70px;
                                    height: 70px;
                                    }

                                    .id-card-school-info7 {
                                    font-size: 9px;
                                    line-height: 1.4;
                                    margin: 5px 0;
                                    }

                                    .id-card-principal-signature7 {
                                    font-size: 14px;
                                    font-weight: bold;
                                    margin-top: 20px;
                                    }
                                        /* id 8 */


                                        .id-card8 {
                                        width: 205px;
                                        height: 326px;
                                        background-image: url('id-8.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        padding: 20px;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }
                                           .id-card-container88 {
                                        width: 205px;
                                        height: 326px;
                                        background: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/05/id-8.png') no-repeat center center / cover;
                                        border-radius: 10px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        position: relative;
                                        padding: 20px;
                                        box-sizing: border-box;
                                        }

                                        .header8 {
                                        text-align: center;
                                        margin-bottom: 15px;
                                        display: flex;
                                        color: black;
                                        margin-left: 10px;
                                        }

                                        .header8 .logo8 {
                                        width: 70px;
                                        height: 70px;
                                        margin-bottom: 10px;
                                        }

                                        .header8 h1 {
                                        font-size: 16px;
                                        margin: 0;
                                        font-weight: bold;
                                        }

                                        .header8 p {
                                        font-size: 8px;
                                        margin: 0;
                                        }

                                        .photo-section8 {
                                        /* display: flex;
                                        align-items: center;
                                        justify-content: space-between; */
                                        margin-bottom: 15px;
                                        }

                                        .rotate-text8 {
                                        transform: rotate(270deg);
                                        /* Rotate 45 degrees */
                                        }

                                        .rotate-img8 {
                                        transform: rotate(45deg);
                                        /* Rotate 45 degrees */
                                        }

                                        .photo8 {
                                        width: 70px;
                                        height: 100px;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        border-radius: 8px;
                                        margin-left: 4px;
                                        margin-top: -12px;
                                        }
                                        .rotate-text-left8{

                                        
                                            /* transform: rotate(270deg); */
                                            color: #fff;
                                            padding: 3px 10px;
                                            background: #323990;
                                            border-radius: 6px;
                                            position: absolute;
                                            top: 2px;
                                            left: -13px;
                                            font-size: 12px;
                                            font-weight: bold;
                                            /* width: 90px; */
                                            text-align: center;
                                        }
                                        .rotate-text-right8{

                                            /* transform: rotate(270deg); */
                                            color: #fff;
                                            padding: 3px 10px;
                                            background: #323990;
                                            border-radius: 6px;
                                            position: absolute;
                                            top: 2px;
                                            right: 26px;
                                            font-size: 12px;
                                            font-weight: bold;
                                            /* width: 90px; */
                                            text-align: center;
                                        }

                                        .photo8 img {
                                        max-width: 90%;
                                        max-height: 90%;
                                        border-radius: 8px;
                                        }



                                        .info8 {
                                        font-size: 12px;
                                        text-align: left;
                                        }

                                        .details8 {
                                        font-size: 9px;
                                        line-height: 1.6;
                                        margin-bottom: 15px;
                                        margin-top: 175px;
                                        margin-left: 0px;
                                        width: 165px;
                                        }

                                        .details88 {
                                        font-size: 9px;
                                        line-height: 1.6;
                                        margin-bottom: 15px;
                                        margin-top: 10px;
                                        margin-left: 15px;
                                        }

                                        .footer8 {
                                        text-align: center;
                                        font-size: 12px;
                                        }

                                        .signature8 {
                                        margin-top: 15px;
                                        }

                                        .signature8 p {
                                        margin: 0;
                                        font-style: italic;
                                        }

                                        .signature8 hr {
                                        width: 80px;
                                        border: 1px solid #000;
                                        }

                                        /* back */
                                        .id-card-container8 {
                                        width: 205px;
                                        height: 326px;
                                        background: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/05/id-8-b.png') no-repeat center center / cover;
                                        border-radius: 10px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        position: relative;
                                        padding: 20px;
                                        box-sizing: border-box;
                                        }

                                        .id-card-content8 {
                                        color: #000;
                                        text-align: center;
                                        position: relative;
                                        /* top: 30px; */
                                        }

                                        .id-card-issue-date8,
                                        .id-card-expire-date8 {
                                        font-size: 9px;
                                        margin: 0;
                                        text-align: left;
                                        color: white;
                                        }

                                        .id-card-instructions8 {
                                        font-size: 9px;
                                        line-height: 1.5;
                                        margin: 50px 0;
                                        }

                                        .id-card-qr-code8 img {
                                        margin-top: -30px;
                                        width: 70px;
                                        height: 70px;
                                        }

                                        .id-card-school-info8 {
                                        font-size: 9px;
                                        line-height: 1.4;
                                        margin: 5px 0;
                                        }

                                        .id-card-principal-signature8 {
                                        font-size: 14px;
                                        font-weight: bold;
                                        margin-top: 20px;
                                        }

                                        /* id 10 */

                                        .id-card10 {
                                        width: 205px;
                                        height: 326px;
                                        background-image: url('id-10.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        padding: 20px;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }
                                        .id-card-container100 {
                                        width: 205px;
                                        height: 326px;
                                        background: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/26/id-10.png') no-repeat center center / cover;
                                        border-radius: 10px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        position: relative;
                                        padding: 20px;
                                        box-sizing: border-box;
                                        }

                                        .header10 {
                                        text-align: center;
                                        margin-bottom: 15px;
                                        display: flex;
                                        color: white;
                                        margin-left: 2px;
                                        margin-top: -10px;
                                        }

                                        .header10 .logo10 {
                                        width: 70px;
                                        height: 70px;
                                        margin-bottom: 10px;
                                        }

                                        .header10 h1 {
                                        font-size: 16px;
                                        margin: 0;
                                        font-weight: bold;
                                        }

                                        .header10 p {
                                        font-size: 8px;
                                        margin: 0;
                                        }

                                        .photo-section10 {
                                        /* display: flex;
                                        align-items: center;
                                        justify-content: space-between; */
                                        margin-bottom: 15px;
                                        }

                                        .rotate-text10 {
                                        transform: rotate(270deg);
                                        /* Rotate 45 degrees */
                                        }

                                        .rotate-img10 {
                                        transform: rotate(45deg);
                                        /* Rotate 45 degrees */
                                        }

                                        .photo10 {
                                        width: 73px;
                                        height: 100px;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        border-radius: 8px;
                                        margin-left: 49px;
                                        margin-top: -20px !important;
                                        }

                                        .photo10 img {
                                        max-width: 100%;
                                        max-height: 100%;
                                        border-radius: 50%;
                                        }



                                        .info10 {
                                        font-size: 12px;
                                        text-align: left;
                                        }

                                        .details10 {
                                        font-size: 9px;
                                        line-height: 1.6;
                                        margin-bottom: 15px;
                                        margin-top: 185px;
                                        margin-left: 0px;
                                        width: 165px;
                                        }
                                        .details101 {
                                        font-size: 9px;
                                        line-height: 1.6;
                                        margin-bottom: 15px;
                                        margin-top: 35px;
                                        margin-left: 15px;
                                        }

                                        .footer10 {
                                        text-align: center;
                                        font-size: 12px;
                                        }

                                        .signature10 {
                                        margin-top: 15px;
                                        }

                                        .signature10 p {
                                        margin: 0;
                                        font-style: italic;
                                        }

                                        .signature10 hr {
                                        width: 80px;
                                        border: 1px solid #000;
                                        }

                                        /* back */
                                        .id-card-container10 {
                                        width: 205px;
                                        height: 326px;
                                        background: url('http://192.168.0.114:5003/asset_info/2025/01/19/12/27/id-10-b.png') no-repeat center center / cover;
                                        border-radius: 10px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        position: relative;
                                        padding: 20px;
                                        box-sizing: border-box;
                                        }

                                        .id-card-content10 {
                                        color: #000;
                                        text-align: center;
                                        position: relative;
                                        top: 32px;
                                        }

                                        .id-card-issue-date10,
                                        .id-card-expire-date10 {
                                        font-size: 9px;
                                        margin: 0;
                                        }

                                        .id-card-instructions10 {
                                        font-size: 9px;
                                        line-height: 1.5;
                                        margin: 10px 0;
                                        }

                                        .id-card-qr-code10 img {
                                        margin-top: -10px;
                                        width: 70px;
                                        height: 70px;
                                        }

                                        .id-card-school-info10 {
                                        font-size: 9px;
                                        line-height: 1.4;
                                        margin: 5px 0;
                                        }

                                        .id-card-principal-signature10 {
                                        font-size: 14px;
                                        font-weight: bold;
                                        margin-top: 20px;
                                        }

                                        // id 9

                                        .id-card9 {
                                        width: 340px;
                                        height: 205px;
                                        background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/15/15/id-9.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        padding: 20px;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }
                                            .id-card-container99 {
                                        width: 340px;
                                        height: 205px;
                                        background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/15/15/id-9.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }

                                        .header9 {
                                        text-align: center;
                                        margin-bottom: 15px;
                                        display: flex;
                                        justify-content: space-between;
                                        color: white;
                                        margin-left: 10px;
                                        }

                                        /* .header9 {
                                        text-align: center;
                                        margin-bottom: 15px;
                                        display: flex;
                                        color: black;
                                        margin-left: 10px;
                                        } */
                                        .header_text {
                                        margin-top: -30px;
                                        margin-left: -20px;
                                        }

                                        .header9 .logo9 {
                                        width: 70px;
                                        height: 70px;
                                        margin-bottom: 10px;
                                        }

                                        .header9 h1 {
                                        font-size: 16px;
                                        margin: 0;
                                        font-weight: bold;
                                        }

                                        .header9 p {
                                        font-size: 9px;
                                        margin: 0;
                                        }

                                        /* .header9 h1 {
                                        margin: 0;
                                        font-size: 18px;
                                        }

                                        .header9 h2 {
                                        margin: 5px 0;
                                        font-size: 14px;
                                        }

                                        .header9 p {
                                        font-size: 12px;
                                        margin: 0;
                                        } */

                                        .profile-section9 {
                                        display: flex;
                                        padding: 15px;
                                        align-items: center;
                                        }

                                        .profile-image9 {
                                 float:left;
                                            height: 105px;
                                            width: 90px;
                                            border: 2px solid #ddd;
                                            border-radius: 45%;
                                            overflow: hidden;
                                            margin-right: 19px;
                                            margin-left: 2px;
                                            margin-top: 31px;
                                        }


                                        .profile-image9 img {
                                        width: 100%;
                                        height: 100%;
                                        object-fit: cover;

                                        }

                                        .details9 {
                                        flex-grow: 1;
                                        margin-top:30px;
                                
                                        }

                                        .details9 h3 {
                                        margin: 0;
                                        font-size: 27px;
                                        color: #333;
                                        }

                                        .details9 p {
                                        font-size: 12px;
                                        color: #666;
                                        margin-left: 20px;
                                        }

                                        .info9 td {
                                        margin: 2px 0;
                                        font-size: 12px;
                                        color: #333;
                                        }

                                        .info9 {
                                        margin-top: -10px;
                                        }

                                        .signature9 {
                                        text-align: center;
                                        padding: 10px 15px;
                                        }

                                        .signature9 hr {
                                        border: 0.5px solid #333;
                                        margin: 5px auto;
                                        width: 80px;
                                        }

                                        .signature9 p {
                                        margin: 5px 0 0;
                                        font-size: 12px;
                                        color: #666;
                                        }

                                        /* back */
                                        /* back */
                                        .id-card-container9 {
                                        width: 340px;
                                        height: 205px;
                                        background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/15/14/id-9-b.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }

                                        .id-card-content9 {
                                        color: #000;
                                        text-align: center;
                                        position: relative;
                                        top: 15px;
                                        }

                                        .id-card-issue-date9,
                                        .id-card-expire-date9 {
                                        font-size: 9px;
                                        margin: 0;
                                        }

                                        .id-card-instructions9 {
                                        font-size: 9px;
                                        line-height: 1.5;
                                        margin: 10px 0;
                                        }

                                        .id-card-qr-code9 img {
                                        margin-top: -10px;
                                        width: 50px;
                                        height: 50px;
                                        }

                                        .id-card-school-info9 {
                                        font-size: 9px;
                                        line-height: 1.4;
                                        margin: 5px 0;
                                        }

                                        .id-card-principal-signature9 {
                                        font-size: 14px;
                                        font-weight: bold;
                                        margin-top: 20px;
                                        }

                                        /* id 11 */



                                        .id-card11 {
                                        width: 340px;
                                        height: 205px;
                                        background-image: url('id-11.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        padding: 20px;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }
                                    .id-card-container111 {
                                        width: 340px;
                                        height: 205px;
                                        background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/15/35/id-11.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }

                                        .header11 {
                                        text-align: center;
                                        margin-bottom: 15px;
                                        display: flex;
                                        justify-content: space-between;
                                        color: white;
                                        margin-left: 10px;
                                        }

                                        /* .header11 {
                                        text-align: center;
                                        margin-bottom: 15px;
                                        display: flex;
                                        color: black;
                                        margin-left: 10px;
                                        } */
                                        .header_text11 {
                                        margin-top: -10px;
                                        margin-left: -20px;
                                        }

                                        .header11 .logo11 {
                                        width: 70px;
                                        height: 70px;
                                        margin-bottom: 10px;
                                        }

                                        .header11 h1 {
                                        font-size: 16px;
                                        margin: 0;
                                        font-weight: bold;
                                        }

                                        .header11 p {
                                        font-size: 9px;
                                        margin: 0;
                                        }

                                        /* .header11 h1 {
                                        margin: 0;
                                        font-size: 18px;
                                        }

                                        .header11 h2 {
                                        margin: 5px 0;
                                        font-size: 14px;
                                        }

                                        .header11 p {
                                        font-size: 12px;
                                        margin: 0;
                                        } */

                                        .profile-section11 {
                                        display: flex;
                                        padding: 15px;
                                        align-items: center;
                                        }

                                        .profile-image11 {

                                          height: 118px;
                                            width: 88px;
                                            border: 2px solid #ddd;
                                            overflow: hidden;
                                            margin-left: 18px;
                                            margin-top: -67px;
                                        }

                                        /* .teacher_information11 {
                                        margin-left: 20px;
                                        } */

                                        .profile-image11 img {
                                        width: 105%;
                                        height: 100%;
                                        object-fit: cover;

                                        }

                                        .details111 {
                                        flex-grow: 1;
                                        margin-left: 25px;
                                        color: white !important;
                                        }

                                        .details111 h3 {
                                        margin: 0;
                                        font-size: 27px;

                                        }

                                        .details111 p {
                                        font-size: 12px;

                                        margin-left: 20px;
                                        }

                                        .info11 td {
                                        margin: 2px 0;
                                        font-size: 12px;

                                        }

                                        .info11 {
                                        margin-top: -10px;
                                        margin-left: -10px;
                                        }

                                        .signature11 {
                                        text-align: center;
                                        padding: 10px 15px;
                                        }

                                        .signature11 hr {
                                        border: 0.5px solid #333;
                                        margin: 5px auto;
                                        width: 80px;
                                        }

                                        .signature11 p {
                                        margin: 5px 0 0;
                                        font-size: 12px;
                                        color: #666;
                                        }

                                        /* back */
                                        /* back */
                                        .id-card-container11 {
                                        width: 340px;
                                        height: 205px;
                                        background-image: url('http://192.168.0.114:5003/asset_info/2025/01/19/15/36/id-11-b.png');
                                        /* Use your second uploaded image */
                                        background-size: cover;
                                        background-position: center;
                                        border-radius: 8px;
                                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                        color: #000;
                                        }

                                        .id-card-content11 {
                                        color: #000;
                                        text-align: center;
                                        position: relative;
                                        top: 20px;
                                        }

                                        .id-card-issue-date11,
                                        .id-card-expire-date11 {
                                        font-size: 9px;
                                        margin: 0;
                                        }

                                        .id-card-instructions11 {
                                        font-size: 9px;
                                        line-height: 1.5;
                                        margin: 10px 0;
                                        }

                                        .id-card-qr-code11 img {
                                        margin-top: -10px;
                                        width: 50px;
                                        height: 50px;
                                        }

                                        .id-card-school-info11 {
                                        font-size: 9px;
                                        line-height: 1.4;
                                        margin: 5px 0;
                                        }

                                        .id-card-principal-signature11 {
                                        font-size: 14px;
                                        font-weight: bold;
                                        margin-top: 20px;
                                        }


                        </style>
                    </head>
                    <body >
                    <div  style=" height:177mm !important; width:210mm !important;	">
                    
                    ${tableRows}
                    </div>
                    </body>
                      <script>
                window.print();
            </script>
                </html>
            `;

            wkhtmltopdf(html, { pageSize: pageSize, orientation: pageOrientation }, (err, stream) => {
                if (err) {
                    console.error('Error generating PDF:', err);
                    res.status(500).send('Error generating PDF');
                    return;
                }
                stream.pipe(res);
            });
        } catch (error) {
            console.error('Error in category_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },


}

module.exports = EmployeeModel