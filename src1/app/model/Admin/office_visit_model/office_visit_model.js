

const connection = require('../../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');
var fs = require("fs");

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

const OfficeVisitModel = {

    office_visit_creates: async (req, res) => {

        try {
            const {
                office_name,
                office_address,
                office_mobile,
                office_email,
                created_by,
                add_office_date,
                user_id,
                remarks_date,
                remarks,
                person_name,
                person_mobile,
                person_email,
                add_person_date
            } = req.body;



            // Assuming you have a connection object already defined
            connection.beginTransaction();

            const userQuery = `INSERT INTO office_visit (office_name, office_address, office_mobile, office_email,	created_by,	add_office_date, user_id) 
                                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const userParams = [office_name, office_address, office_mobile, office_email, created_by, add_office_date, user_id];

            connection.query(userQuery, userParams, async (err, results) => {
                if (err) {
                    console.error(err);
                    await connection.rollback();
                    res.status(500).json({ message: 'User creation failed' });
                    return;
                }

                try {
                    const officeVisit = results.insertId;
                    const employeInfoQuery = `INSERT INTO office_visit_remarks ( office_visit_id, remarks_date,	remarks, created_by, user_id) VALUES (?, ?, ?, ?, ?)`;
                    const employeInfoParams = [officeVisit, remarks_date, remarks, created_by, user_id];

                    const eduQualificationQuery = `INSERT INTO office_visit_person ( office_visit_id, person_name,	person_mobile, person_email, created_by, add_person_date,	
                    user_id) 
                                                    VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    const eduQualificationParams = [officeVisit, person_name, person_mobile, person_email, created_by, add_person_date,
                        user_id];




                    // Insert into employe_info table
                    await connection.query(employeInfoQuery, employeInfoParams);
                    // Insert into educational_qualification table
                    await connection.query(eduQualificationQuery, eduQualificationParams);
                    // Insert into living_address table


                    // New addition: Insert into employee_promotion table


                    await connection.commit();

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

    office_visit_list_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM office_visit WHERE id = ?';
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
   
    
    office_visit_list_single_update: async (req, res) => {
        try {
            const { office_name, office_address, office_mobile, office_email, add_office_date, modified_by} = req.body;
    
            const query = `UPDATE office_visit SET office_name = ?, office_address = ?, office_mobile = ?, office_email = ?, add_office_date = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [office_name, office_address, office_mobile, office_email, add_office_date, modified_by, req.params.id], (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Database error occurred.' });
                }
                if (result.affectedRows > 0) {
                    console.log(result);
                    return res.send(result);
                } else {
                    return res.status(404).json({ message: 'Payroll record not found.' });
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred.' });
        }
    },



    // office_visit_list: async (req, res) => {
    //     try {
    //         connection.beginTransaction();

    //         const officeVisitQuery = `
    //             SELECT 
    //                 ov.id AS id,
    //                 ov.office_name,
    //                 ov.office_address,
    //                 ov.office_mobile,
    //                 ov.office_email,
    //                 ov.created_by,
    //                 ov.add_office_date,
    //                 ov.user_id,
    //                 ovr.id AS remarks_id,
    //                 ovr.remarks_date,
    //                 ovr.remarks,
    //                 ovr.created_by AS remarks_created_by,
    //                 ovr.user_id AS remarks_user_id,
    //                 ovp.id AS person_id,
    //                 ovp.person_name,
    //                 ovp.person_mobile,
    //                 ovp.person_email,
    //                 ovp.created_by AS person_created_by,
    //                 ovp.add_person_date,
    //                 ovp.user_id AS person_user_id
    //             FROM 
    //                 office_visit ov
    //             LEFT JOIN 
    //                 office_visit_remarks ovr ON ov.id = ovr.office_visit_id
    //             LEFT JOIN 
    //                 office_visit_person ovp ON ov.id = ovp.office_visit_id`;

    //         connection.query(officeVisitQuery, async (err, results) => {
    //             if (err) {
    //                 console.error(err);
    //                 await connection.rollback();
    //                 res.status(500).json({ message: 'Error retrieving office visit data' });
    //                 return;
    //             }

    //             // Process results into the desired structure
    //             const officeVisits = {};

    //             results.forEach(row => {
    //                 if (!officeVisits[row.id]) {
    //                     officeVisits[row.id] = {
    //                         id: row.id,
    //                         office_name: row.office_name,
    //                         office_address: row.office_address,
    //                         office_mobile: row.office_mobile,
    //                         office_email: row.office_email,
    //                         created_by: row.created_by,
    //                         add_office_date: row.add_office_date,
    //                         user_id: row.user_id,
    //                         remarks: [],
    //                         persons: []
    //                     };
    //                 }

    //                 if (row.remarks_id) {
    //                     officeVisits[row.id].remarks.push({
    //                         remarks_id: row.remarks_id,
    //                         remarks_date: row.remarks_date,
    //                         remarks: row.remarks,
    //                         remarks_created_by: row.remarks_created_by,
    //                         remarks_user_id: row.remarks_user_id
    //                     });
    //                 }

    //                 if (row.person_id) {
    //                     officeVisits[row.id].persons.push({
    //                         person_id: row.person_id,
    //                         person_name: row.person_name,
    //                         person_mobile: row.person_mobile,
    //                         person_email: row.person_email,
    //                         person_created_by: row.person_created_by,
    //                         add_person_date: row.add_person_date,
    //                         person_user_id: row.person_user_id
    //                     });
    //                 }
    //             });

    //             await connection.commit();

    //             res.status(200).json(Object.values(officeVisits));
    //         });
    //     } catch (error) {
    //         console.error("Error retrieving data:", error);
    //         await connection.rollback();
    //         res.status(500).json({ message: "Error retrieving data." });
    //     }
    // },

    office_visit_list: async (req, res) => {
        try {
            connection.beginTransaction();

            const officeVisitQuery = `
                SELECT DISTINCT
                    ov.id AS id,
                    ov.office_name,
                    ov.office_address,
                    ov.office_mobile,
                    ov.office_email,
                    ov.created_by,
                    ov.add_office_date,
                    ov.user_id,
                    ovr.id AS remarks_id,
                    ovr.remarks_date,
                    ovr.remarks,
                    ovr.created_by AS remarks_created_by,
                    ovr.user_id AS remarks_user_id,
                    ovp.id AS person_id,
                    ovp.person_name,
                    ovp.person_mobile,
                    ovp.person_email,
                    ovp.created_by AS person_created_by,
                    ovp.add_person_date,
                    ovp.user_id AS person_user_id
                FROM 
                    office_visit ov
                LEFT JOIN 
                    office_visit_remarks ovr ON ov.id = ovr.office_visit_id
                LEFT JOIN 
                    office_visit_person ovp ON ov.id = ovp.office_visit_id`;

            connection.query(officeVisitQuery, async (err, results) => {
                if (err) {
                    console.error(err);
                    await connection.rollback();
                    res.status(500).json({ message: 'Error retrieving office visit data' });
                    return;
                }

                // Process results into the desired structure
                const officeVisits = {};

                results.forEach(row => {
                    if (!officeVisits[row.id]) {
                        officeVisits[row.id] = {
                            id: row.id,
                            office_name: row.office_name,
                            office_address: row.office_address,
                            office_mobile: row.office_mobile,
                            office_email: row.office_email,
                            created_by: row.created_by,
                            add_office_date: row.add_office_date,
                            user_id: row.user_id,
                            remarks: [],
                            persons: []
                        };
                    }

                    // Check if remarks_id is already added
                    const existingRemark = officeVisits[row.id].remarks.find(r => r.remarks_id === row.remarks_id);
                    if (!existingRemark && row.remarks_id) {
                        officeVisits[row.id].remarks.push({
                            remarks_id: row.remarks_id,
                            remarks_date: row.remarks_date,
                            remarks: row.remarks,
                            remarks_created_by: row.remarks_created_by,
                            remarks_user_id: row.remarks_user_id
                        });
                    }

                    // Check if person_id is already added
                    const existingPerson = officeVisits[row.id].persons.find(p => p.person_id === row.person_id);
                    if (!existingPerson && row.person_id) {
                        officeVisits[row.id].persons.push({
                            person_id: row.person_id,
                            person_name: row.person_name,
                            person_mobile: row.person_mobile,
                            person_email: row.person_email,
                            person_created_by: row.person_created_by,
                            add_person_date: row.add_person_date,
                            person_user_id: row.person_user_id
                        });
                    }
                });

                await connection.commit();

                res.status(200).json(Object.values(officeVisits));
            });
        } catch (error) {
            console.error("Error retrieving data:", error);
            await connection.rollback();
            res.status(500).json({ message: "Error retrieving data." });
        }
    },


    office_visit_single: async (req, res) => {
        // const officeVisitId = req.params.id; // assuming id is passed as a URL parameter

        const { id } = req.params; // Assuming id is passed as a route parameter

        try {
            connection.beginTransaction();

            const officeVisitQuery = `
                SELECT DISTINCT
                    ov.id AS id,
                    ov.office_name,
                    ov.office_address,
                    ov.office_mobile,
                    ov.office_email,
                    ov.created_by,
                    ov.add_office_date,
                    ov.user_id,
                    ovr.id AS remarks_id,
                    ovr.remarks_date,
                    ovr.remarks,
                    ovr.created_by AS remarks_created_by,
                    ovr.user_id AS remarks_user_id,
                    ovp.id AS person_id,
                    ovp.person_name,
                    ovp.person_mobile,
                    ovp.person_email,
                    ovp.created_by AS person_created_by,
                    ovp.add_person_date,
                    ovp.user_id AS person_user_id
                FROM 
                    office_visit ov
                LEFT JOIN 
                    office_visit_remarks ovr ON ov.id = ovr.office_visit_id
                LEFT JOIN 
                    office_visit_person ovp ON ov.id = ovp.office_visit_id
                WHERE 
                    ov.id = ?`; // Add the WHERE clause to filter by id

            connection.query(officeVisitQuery, [id], async (err, results) => {
                if (err) {
                    console.error(err);
                    await connection.rollback();
                    res.status(500).json({ message: 'Error retrieving office visit data' });
                    return;
                }

                // Process results into the desired structure
                const officeVisits = {};

                results.forEach(row => {
                    if (!officeVisits[row.id]) {
                        officeVisits[row.id] = {
                            id: row.id,
                            office_name: row.office_name,
                            office_address: row.office_address,
                            office_mobile: row.office_mobile,
                            office_email: row.office_email,
                            created_by: row.created_by,
                            add_office_date: row.add_office_date,
                            user_id: row.user_id,
                            remarks: [],
                            persons: []
                        };
                    }

                    // Check if remarks_id is already added
                    const existingRemark = officeVisits[row.id].remarks.find(r => r.remarks_id === row.remarks_id);
                    if (!existingRemark && row.remarks_id) {
                        officeVisits[row.id].remarks.push({
                            remarks_id: row.remarks_id,
                            remarks_date: row.remarks_date,
                            remarks: row.remarks,
                            remarks_created_by: row.remarks_created_by,
                            remarks_user_id: row.remarks_user_id
                        });
                    }

                    // Check if person_id is already added
                    const existingPerson = officeVisits[row.id].persons.find(p => p.person_id === row.person_id);
                    if (!existingPerson && row.person_id) {
                        officeVisits[row.id].persons.push({
                            person_id: row.person_id,
                            person_name: row.person_name,
                            person_mobile: row.person_mobile,
                            person_email: row.person_email,
                            person_created_by: row.person_created_by,
                            add_person_date: row.add_person_date,
                            person_user_id: row.person_user_id
                        });
                    }
                });

                await connection.commit();

                res.status(200).json(Object.values(officeVisits));
            });
        } catch (error) {
            console.error("Error retrieving data:", error);
            await connection.rollback();
            res.status(500).json({ message: "Error retrieving data." });
        }
    },


    office_visit_update: async (req, res) => {
        try {

            const { mobile, amount, recharge_user, recharge_time, modified_by } = req.body;


            const query = `UPDATE office_visit SET   mobile = ?, amount = ?, recharge_user = ?, recharge_time= ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [mobile, amount, recharge_user, recharge_time, modified_by, req.params.id], (error, result) => {
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


    office_visit_delete: async (req, res) => {
        try {
            const { id } = req.params;

            // Assuming you have a connection object already defined
            connection.beginTransaction();

            try {
                // Delete from office_visit_person table
                const deletePersonQuery = `DELETE FROM office_visit_person WHERE office_visit_id = ?`;
                await connection.query(deletePersonQuery, [req.params.id]);

                // Delete from office_visit_remarks table
                const deleteRemarksQuery = `DELETE FROM office_visit_remarks WHERE office_visit_id = ?`;
                await connection.query(deleteRemarksQuery, [req.params.id]);

                // Delete from office_visit table
                const deleteOfficeVisitQuery = `DELETE FROM office_visit WHERE id = ?`;
                await connection.query(deleteOfficeVisitQuery, [req.params.id]);

                await connection.commit();
                res.status(200).json({ message: 'Office visit deleted successfully' });
            } catch (error) {
                console.error("Error deleting data:", error);
                await connection.rollback();
                res.status(500).json({ message: "Error deleting data." });
            }
        } catch (error) {
            console.error("Error processing request:", error);
            await connection.rollback();
            res.status(500).json({ message: "Error processing request." });
        }
    },

    office_visit_remarks_create: async (req, res) => {
        try {
            const { remarks_date, remarks, created_by, user_id, office_visit_id } = req.body;

            // Using parameterized query to prevent SQL injection
            const insertQuery = 'INSERT INTO office_visit_remarks (remarks_date, remarks, created_by, user_id, office_visit_id) VALUES (?, ?, ?, ?, ?)';
            const result = await connection.query(insertQuery, [remarks_date, remarks, created_by, user_id, office_visit_id]);

            // Sending only the necessary data from the result object
            const { insertId, affectedRows } = result;

            // Sending response with relevant data
            res.status(200).json({ insertId, affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },

    office_visit_person_create: async (req, res) => {


        try {
            const { person_name, person_mobile, person_email, add_person_date, created_by, user_id, office_visit_id } = req.body;

            // Using parameterized query to prevent SQL injection
            const insertQuery = 'INSERT INTO office_visit_person (person_name, person_mobile, person_email, add_person_date, created_by, user_id ,office_visit_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const result = await connection.query(insertQuery, [person_name, person_mobile, person_email, add_person_date, created_by, user_id, office_visit_id]);

            // Sending only the necessary data from the result object
            const { insertId, affectedRows } = result;

            // Sending response with relevant data
            res.status(200).json({ insertId, affectedRows });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },




    // office_visit_list_paigination: async (req, res) => {
    //     const pageNo = Number(req.params.pageNo);
    //     const perPage = Number(req.params.perPage);
    //     try {
    //         connection.beginTransaction();

    //         const skipRows = (pageNo - 1) * perPage;
    //         const officeVisitQuery = `
    //             SELECT DISTINCT
    //                 ov.id AS id,
    //                 ov.office_name,
    //                 ov.office_address,
    //                 ov.office_mobile,
    //                 ov.office_email,
    //                 ov.created_by,
    //                 ov.add_office_date,
    //                 ov.user_id,
    //                 ovr.id AS remarks_id,
    //                 ovr.remarks_date,
    //                 ovr.remarks,
    //                 ovr.created_by AS remarks_created_by,
    //                 ovr.user_id AS remarks_user_id,
    //                 ovp.id AS person_id,
    //                 ovp.person_name,
    //                 ovp.person_mobile,
    //                 ovp.person_email,
    //                 ovp.created_by AS person_created_by,
    //                 ovp.add_person_date,
    //                 ovp.user_id AS person_user_id
    //             FROM 
    //                 office_visit ov
    //             LEFT JOIN 
    //                 office_visit_remarks ovr ON ov.id = ovr.office_visit_id
    //             LEFT JOIN 
    //                 office_visit_person ovp ON ov.id = ovp.office_visit_id`;

    //         connection.query(officeVisitQuery, async (err, results) => {
    //             if (err) {
    //                 console.error(err);
    //                 await connection.rollback();
    //                 res.status(500).json({ message: 'Error retrieving office visit data' });
    //                 return;
    //             }

    //             // Process results into the desired structure
    //             const officeVisits = {};

    //             results.forEach(row => {
    //                 if (!officeVisits[row.id]) {
    //                     officeVisits[row.id] = {
    //                         id: row.id,
    //                         office_name: row.office_name,
    //                         office_address: row.office_address,
    //                         office_mobile: row.office_mobile,
    //                         office_email: row.office_email,
    //                         created_by: row.created_by,
    //                         add_office_date: row.add_office_date,
    //                         user_id: row.user_id,
    //                         remarks: [],
    //                         persons: []
    //                     };
    //                 }

    //                 // Check if remarks_id is already added
    //                 const existingRemark = officeVisits[row.id].remarks.find(r => r.remarks_id === row.remarks_id);
    //                 if (!existingRemark && row.remarks_id) {
    //                     officeVisits[row.id].remarks.push({
    //                         remarks_id: row.remarks_id,
    //                         remarks_date: row.remarks_date,
    //                         remarks: row.remarks,
    //                         remarks_created_by: row.remarks_created_by,
    //                         remarks_user_id: row.remarks_user_id
    //                     });
    //                 }

    //                 // Check if person_id is already added
    //                 const existingPerson = officeVisits[row.id].persons.find(p => p.person_id === row.person_id);
    //                 if (!existingPerson && row.person_id) {
    //                     officeVisits[row.id].persons.push({
    //                         person_id: row.person_id,
    //                         person_name: row.person_name,
    //                         person_mobile: row.person_mobile,
    //                         person_email: row.person_email,
    //                         person_created_by: row.person_created_by,
    //                         add_person_date: row.add_person_date,
    //                         person_user_id: row.person_user_id
    //                     });
    //                 }
    //             });

    //             await connection.commit();

    //             res.status(200).json(Object.values(officeVisits));
    //         });
    //     } catch (error) {
    //         console.error("Error retrieving data:", error);
    //         await connection.rollback();
    //         res.status(500).json({ message: "Error retrieving data." });
    //     }
    // },

    office_visit_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            connection.beginTransaction();

            const skipRows = (pageNo - 1) * perPage;
            const officeVisitQuery = `
                SELECT DISTINCT
                    ov.id AS id,
                    ov.office_name,
                    ov.office_address,
                    ov.office_mobile,
                    ov.office_email,
                    ov.created_by,
                    ov.add_office_date,
                    ov.user_id,
                    ovr.id AS remarks_id,
                    ovr.remarks_date,
                    ovr.remarks,
                    ovr.created_by AS remarks_created_by,
                    ovr.user_id AS remarks_user_id,
                    ovp.id AS person_id,
                    ovp.person_name,
                    ovp.person_mobile,
                    ovp.person_email,
                    ovp.created_by AS person_created_by,
                    ovp.add_person_date,
                    ovp.user_id AS person_user_id
                FROM 
                    office_visit ov
                LEFT JOIN 
                    office_visit_remarks ovr ON ov.id = ovr.office_visit_id
                LEFT JOIN 
                    office_visit_person ovp ON ov.id = ovp.office_visit_id
                   
                LIMIT ? OFFSET ?`;

            connection.query(officeVisitQuery, [perPage, skipRows], async (err, results) => {
                if (err) {
                    console.error(err);
                    await connection.rollback();
                    res.status(500).json({ message: 'Error retrieving office visit data' });
                    return;
                }

                // Process results into the desired structure
                const officeVisits = {};

                results.forEach(row => {
                    if (!officeVisits[row.id]) {
                        officeVisits[row.id] = {
                            id: row.id,
                            office_name: row.office_name,
                            office_address: row.office_address,
                            office_mobile: row.office_mobile,
                            office_email: row.office_email,
                            created_by: row.created_by,
                            add_office_date: row.add_office_date,
                            user_id: row.user_id,
                            remarks: [],
                            persons: []
                        };
                    }

                    // Check if remarks_id is already added
                    const existingRemark = officeVisits[row.id].remarks.find(r => r.remarks_id === row.remarks_id);
                    if (!existingRemark && row.remarks_id) {
                        officeVisits[row.id].remarks.push({
                            remarks_id: row.remarks_id,
                            remarks_date: row.remarks_date,
                            remarks: row.remarks,
                            remarks_created_by: row.remarks_created_by,
                            remarks_user_id: row.remarks_user_id
                        });
                    }

                    // Check if person_id is already added
                    const existingPerson = officeVisits[row.id].persons.find(p => p.person_id === row.person_id);
                    if (!existingPerson && row.person_id) {
                        officeVisits[row.id].persons.push({
                            person_id: row.person_id,
                            person_name: row.person_name,
                            person_mobile: row.person_mobile,
                            person_email: row.person_email,
                            person_created_by: row.person_created_by,
                            add_person_date: row.add_person_date,
                            person_user_id: row.person_user_id
                        });
                    }
                });

                await connection.commit();

                res.status(200).json(Object.values(officeVisits));
            });
        } catch (error) {
            console.error("Error retrieving data:", error);
            await connection.rollback();
            res.status(500).json({ message: "Error retrieving data." });
        }
    },

    office_visit_remarks_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM office_visit_remarks WHERE id = ?';
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

    office_visit_person_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM office_visit_person WHERE id = ?';
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


    office_visit_remarks_update: async (req, res) => {
        try {
            const { remarks, remarks_date, modified_by } = req.body;

            const query = `UPDATE office_visit_remarks SET remarks = ?, remarks_date = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [remarks, remarks_date, modified_by, req.params.id], (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Database error occurred.' });
                }
                if (result.affectedRows > 0) {
                    console.log(result);
                    return res.send(result);
                } else {
                    return res.status(404).json({ message: 'Payroll record not found.' });
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred.' });
        }
    },


    office_visit_person_update: async (req, res) => {
        try {

            const { person_name, person_mobile, person_email, add_person_date, modified_by } = req.body;

            const query = `UPDATE office_visit_person SET person_name = ?, person_mobile = ?, person_email = ?, add_person_date = ?, modified_by = ? WHERE id = ?`;
            connection.query(query, [person_name, person_mobile, person_email, add_person_date, modified_by, req.params.id], (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Database error occurred.' });
                }
                if (result.affectedRows > 0) {
                    console.log(result);
                    return res.send(result);
                } else {
                    return res.status(404).json({ message: 'Payroll record not found.' });
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred.' });
        }
    },

    office_visit_remarks_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM office_visit_remarks WHERE id = ?';
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


    office_visit_person_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM office_visit_person WHERE id = ?';
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


    // office_visit_person_list_paigination: async (req, res) => {
    //     const pageNo = Number(req.params.pageNo);
    //     const perPage = Number(req.params.perPage);
    //     try {
    //         const skipRows = (pageNo - 1) * perPage;
    //         let query = `
    //   SELECT office_visit_person.*, 
    //          users_created.full_name AS created_by,
    //          users_modified.full_name AS modified_by 
    //   FROM office_visit_person 
    //   LEFT JOIN users AS users_created ON office_visit_person.created_by = users_created.id 
    //   LEFT JOIN users AS users_modified ON office_visit_person.modified_by = users_modified.id 
    //   ORDER BY office_visit_person.id DESC
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


    office_visit_person_list_pagination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        const startId = Number(req.params.id);

        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
                SELECT office_visit_person.*, 
                       users_created.full_name AS created_by,
                       users_modified.full_name AS modified_by 
                FROM office_visit_person 
                LEFT JOIN users AS users_created ON office_visit_person.created_by = users_created.id 
                LEFT JOIN users AS users_modified ON office_visit_person.modified_by = users_modified.id 
                WHERE office_visit_person.office_visit_id = ? 
                ORDER BY office_visit_person.id DESC
                LIMIT ?, ?
            `;

            connection.query(query, [startId, skipRows, perPage], (error, result) => {
                console.log(result)
                if (!error) {
                    res.send(result)
                } else {
                    console.log(error)
                }
            });
        } catch (error) {
            console.log(error);
        }
    },

    office_visit_remarks_list_pagination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        const startId = Number(req.params.id);

        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
                SELECT office_visit_remarks.*, 
                       users_created.full_name AS created_by,
                       users_modified.full_name AS modified_by 
                FROM office_visit_remarks 
                LEFT JOIN users AS users_created ON office_visit_remarks.created_by = users_created.id 
                LEFT JOIN users AS users_modified ON office_visit_remarks.modified_by = users_modified.id 
                WHERE office_visit_remarks.office_visit_id = ? 
                ORDER BY office_visit_remarks.id DESC
                LIMIT ?, ?
            `;

            connection.query(query, [startId, skipRows, perPage], (error, result) => {
                console.log(result)
                if (!error) {
                    res.send(result)
                } else {
                    console.log(error)
                }
            });
        } catch (error) {
            console.log(error);
        }
    },


    office_visit_person_single_visit: async (req, res) => {
        try {
            const query = 'SELECT * FROM office_visit_person WHERE office_visit_id = ?';
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



    office_visit_person_pdf: async (req, res) => {
        try {
            const { searchResults } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.person_name}</td>`; // Person Name
                row += `<td>${result.person_mobile}</td>`; // Person Mobile
                row += `<td>${result.person_email}</td>`; // Person Email
                row += `<td>${result.add_person_date.slice(0, 10)}</td>`; // Add Person Date

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
                        sheet-size: A4;
                        font-family: 'Nikosh', sans-serif !important;
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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Expense List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Expense List</h3>
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
                            <th>Person Name</th>
                            <th>Person Mobile</th>
                            <th>Person Email</th>
                            <th>Add Person Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>`;

            wkhtmltopdf(html, { pageSize: 'letter', orientation: 'portrait' }, (err, stream) => {
                if (err) {
                    console.error('Error generating PDF:', err);
                    res.status(500).send('Error generating PDF');
                    return;
                }
                stream.pipe(res);
            });
        } catch (error) {
            console.error('Error in expense_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },


    office_visit_person_print: async (req, res) => {
        try {
            const { searchResults } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.person_name}</td>`; // Person Name
                row += `<td>${result.person_mobile}</td>`; // Person Mobile
                row += `<td>${result.person_email}</td>`; // Person Email
                row += `<td>${result.add_person_date.slice(0, 10)}</td>`; // Add Person Date

                row += '</tr>';
                tableRows += row;
            });

            const html = `<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                @page {
            size: letter portrait; /* This sets the page size to Letter and orientation to Portrait */
            margin: 20mm; /* Adjust the margin as needed */
        }
                    * { 
                        sheet-size: A4;
                        font-family: 'Nikosh', sans-serif !important;
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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Visit List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Visit List</h3>
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
                            <th>Person Name</th>
                            <th>Person Mobile</th>
                            <th>Person Email</th>
                            <th>Add Person Date</th>
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


    office_visit_remarks_single_visit: async (req, res) => {
        try {
            const query = 'SELECT * FROM office_visit_remarks WHERE office_visit_id = ?';
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

    office_visit_remarks_pdf: async (req, res) => {
        try {
            const { searchResults } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.remarks}</td>`; // Person Name
                row += `<td>${result.remarks_date.slice(0, 10)}</td>`; // Add Person Date

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
                        sheet-size: A4;
                        font-family: 'Nikosh', sans-serif !important;
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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Expense List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Expense List</h3>
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
                            <th>Remarks Name</th>
                            <th>Add Person Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>`;

            wkhtmltopdf(html, { pageSize: 'letter', orientation: 'portrait' }, (err, stream) => {
                if (err) {
                    console.error('Error generating PDF:', err);
                    res.status(500).send('Error generating PDF');
                    return;
                }
                stream.pipe(res);
            });
        } catch (error) {
            console.error('Error in expense_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },


    office_visit_remarks_print: async (req, res) => {
        try {
            const { searchResults } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.remarks}</td>`; // Person Name

                row += `<td>${result.remarks_date.slice(0, 10)}</td>`; // Add Person Date

                row += '</tr>';
                tableRows += row;
            });

            const html = `<html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                @page {
            size: letter portrait; /* This sets the page size to Letter and orientation to Portrait */
            margin: 20mm; /* Adjust the margin as needed */
        }
                    * { 
                        sheet-size: A4;
                        font-family: 'Nikosh', sans-serif !important;
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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Visit List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Visit List</h3>
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
                            <th>Remarks Name</th>
                            <th>Add Person Date</th>
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


    // office_visit_remarks_search: async (req, res) => {
    //     try {
    //         console.log("Search button clicked.");

    //         // Extract necessary data from request
    //         let { fromDate, toDate, itemName } = req.body;
    //         const startId = Number(req.params.id);
    //         // Construct the base SQL query
    //         let sql = `
    //         SELECT office_visit_remarks.*, 
    //                users_created.full_name AS created_by,
    //                users_modified.full_name AS modified_by 
    //         FROM office_visit_remarks 
    //         LEFT JOIN users AS users_created ON office_visit_remarks.created_by = users_created.id 
    //         LEFT JOIN users AS users_modified ON office_visit_remarks.modified_by = users_modified.id 
    //         WHERE office_visit_remarks.office_visit_id = ? `;
    //         //order  by variable
    //         //order  by brand_name asc, status_id desc,created_date desc
    //         // Add search query condition
    //         if (itemName) {

    //             sql += ` AND LOWER(office_visit_remarks.remarks) LIKE '%${itemName}%'`;
    //         }

    //         if (fromDate && toDate) {
               
    //             if (fromDate > toDate) {
    //                 const temp = fromDate;
    //                 fromDate = toDate;
    //                 toDate = temp;
    //             }

    //             sql += ` AND office_visit_remarks.remarks_date BETWEEN '${fromDate}' AND '${toDate}' `;
    //         } else if (fromDate && !toDate) {
    //             sql += ` AND office_visit_remarks.remarks_date >= '${fromDate}' `;
    //         } else if (!fromDate && toDate) {
    //             sql += ` AND office_visit_remarks.remarks_date <= '${toDate}' `;
    //         }

    //         console.log("SQL Query:", sql);


    //         connection.query(sql, (error, results, fields) => {
    //             if (error) {
    //                 console.error("Error occurred during search:", error);
    //                 res.status(500).json({ error: "An error occurred during search." });
    //             } else {
    //                 console.log("Search results:", results, sql);
    //                 res.status(200).json({ results });
    //             }
    //         });
    //     } catch (error) {
    //         console.error("An error occurred:", error);
    //         res.status(500).json({ error: "An error occurred." });
    //     }
    // },

    office_visit_remarks_search: async (req, res) => {
        try {
            console.log("Search button clicked.");
    
            // Extract necessary data from request
            let { fromDate, toDate, itemName } = req.body;
            const startId = Number(req.params.id);
    
            // Check if itemName is a string and convert to lower case if valid
            if (itemName && typeof itemName === 'string') {
                itemName = itemName.toLowerCase();
            } else {
                itemName = '';  // Default to empty string if not valid
            }
    
            // Construct the base SQL query
            let sql = `
            SELECT office_visit_remarks.*, 
                   users_created.full_name AS created_by,
                   users_modified.full_name AS modified_by 
            FROM office_visit_remarks 
            LEFT JOIN users AS users_created ON office_visit_remarks.created_by = users_created.id 
            LEFT JOIN users AS users_modified ON office_visit_remarks.modified_by = users_modified.id 
            WHERE office_visit_remarks.office_visit_id = ?`;
    
            const params = [startId];  // Array to hold query parameters
    
            // Add search query condition
            if (itemName) {
                sql += ` AND LOWER(office_visit_remarks.remarks) LIKE ?`;
                params.push(`%${itemName}%`);  // Add itemName parameter
            }
    
            if (fromDate && toDate) {
                
                if (fromDate > toDate) {
                    [fromDate, toDate] = [toDate, fromDate];  // Swap dates if needed
                }
                sql += ` AND office_visit_remarks.remarks_date BETWEEN ? AND ?`;
                params.push(fromDate, toDate);  // Add date parameters
            } else if (fromDate) {
                sql += ` AND office_visit_remarks.remarks_date >= ?`;
                params.push(fromDate);  // Add fromDate parameter
            } else if (toDate) {
                sql += ` AND office_visit_remarks.remarks_date <= ?`;
                params.push(toDate);  // Add toDate parameter
            }
    
            // Optional: Add sorting if needed
            sql += ` ORDER BY office_visit_remarks.id DESC`;  // Example sorting
    
            console.log("SQL Query:", sql);
    
            // Execute the query
            connection.query(sql, params, (error, results, fields) => {
                if (error) {
                    console.error("Error occurred during search:", error);
                    res.status(500).json({ error: "An error occurred during search." });
                } else {
                    console.log("Search results:", results, sql);
                    res.status(200).json({ results });
                }
            });
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).json({ error: "An error occurred." });
        }
    },


    // office_visit_person_search: async (req, res) => {
    //     try {
    //         console.log("Search button clicked.");
    
    //         // Extract necessary data from request
    //         let { fromDate, toDate, itemName, email, mobile } = req.body;
    //         const startId = Number(req.params.id);
    
    //         // Convert itemName to lower case if valid
    //         if (itemName && typeof itemName === 'string') {
    //             itemName = itemName.toLowerCase();
    //         } else {
    //             itemName = '';  // Default to empty string if not valid
    //         }
    
    //         // Construct the base SQL query
    //         let sql = `
    //         SELECT office_visit_person.*, 
    //                users_created.full_name AS created_by,
    //                users_modified.full_name AS modified_by 
    //         FROM office_visit_person 
    //         LEFT JOIN users AS users_created ON office_visit_person.created_by = users_created.id 
    //         LEFT JOIN users AS users_modified ON office_visit_person.modified_by = users_modified.id 
    //         WHERE office_visit_person.office_visit_id = ?`;
    
    //         const params = [startId];  // Array to hold query parameters
    
    //         // Add search query condition for itemName
    //         if (itemName) {
    //             sql += ` AND LOWER(office_visit_person.person_name) LIKE ?`;
    //             params.push(`%${itemName}%`);  // Add itemName parameter
    //         }
    
    //         // Add search query condition for email or mobile
    //         let emailMobileCondition = '';
    //         if (email && typeof email === 'string') {
    //             emailMobileCondition += ` LOWER(office_visit_person.person_email) LIKE ?`;
    //             params.push(`%${email.toLowerCase()}%`);
    //         }
    //         if (mobile && typeof mobile === 'string') {
    //             if (emailMobileCondition) {
    //                 emailMobileCondition += ` OR `;
    //             }
    //             emailMobileCondition += ` office_visit_person.person_mobile LIKE ?`;
    //             params.push(`%${mobile}%`);
    //         }
    //         if (emailMobileCondition) {
    //             sql += ` AND (${emailMobileCondition})`;
    //         }
    
    //         // Add date range conditions
    //         if (fromDate && toDate) {
    //             if (fromDate > toDate) {
    //                 [fromDate, toDate] = [toDate, fromDate];  // Swap dates if needed
    //             }
    //             sql += ` AND office_visit_person.add_person_date BETWEEN ? AND ?`;
    //             params.push(fromDate, toDate);  // Add date parameters
    //         } else if (fromDate) {
    //             sql += ` AND office_visit_person.add_person_date >= ?`;
    //             params.push(fromDate);  // Add fromDate parameter
    //         } else if (toDate) {
    //             sql += ` AND office_visit_person.add_person_date <= ?`;
    //             params.push(toDate);  // Add toDate parameter
    //         }
    
    //         // Optional: Add sorting if needed
    //         sql += ` ORDER BY office_visit_person.id DESC`;  // Example sorting
    
    //         console.log("SQL Query:", sql);
    
    //         // Execute the query
    //         connection.query(sql, params, (error, results, fields) => {
    //             if (error) {
    //                 console.error("Error occurred during search:", error);
    //                 res.status(500).json({ error: "An error occurred during search." });
    //             } else {
    //                 console.log("Search results:", results, sql);
    //                 res.status(200).json({ results });
    //             }
    //         });
    //     } catch (error) {
    //         console.error("An error occurred:", error);
    //         res.status(500).json({ error: "An error occurred." });
    //     }
    // },

    

    office_visit_person_search: async (req, res) => {
        try {
            console.log("Search button clicked.");
    
            // Extract necessary data from request
            let { fromDate, toDate, itemName, email, mobile } = req.body;
            const startId = Number(req.params.id);
    
            // Convert itemName to lower case if valid
            if (itemName && typeof itemName === 'string') {
                itemName = itemName.toLowerCase();
            } else {
                itemName = '';  // Default to empty string if not valid
            }
    
            // Construct the base SQL query
            let sql = `
            SELECT office_visit_person.*, 
                   users_created.full_name AS created_by,
                   users_modified.full_name AS modified_by 
            FROM office_visit_person 
            LEFT JOIN users AS users_created ON office_visit_person.created_by = users_created.id 
            LEFT JOIN users AS users_modified ON office_visit_person.modified_by = users_modified.id 
            WHERE office_visit_person.office_visit_id = ?`;
    
            const params = [startId];  // Array to hold query parameters
    
            // Add search query condition for itemName
            if (itemName) {
                sql += ` AND LOWER(office_visit_person.person_name) LIKE ?`;
                params.push(`%${itemName}%`);  // Add itemName parameter
            }
    
            // Add search query condition for email
            if (email && typeof email === 'string') {
                sql += ` AND LOWER(office_visit_person.person_email) LIKE ?`;
                params.push(`%${email.toLowerCase()}%`);  // Add email parameter
            }
    
            // Add search query condition for mobile
            if (mobile && typeof mobile === 'string') {
                sql += ` AND office_visit_person.person_mobile LIKE ?`;
                params.push(`%${mobile}%`);  // Add mobile parameter
            }
    
            // Add date range conditions
            if (fromDate && toDate) {
                if (fromDate > toDate) {
                    [fromDate, toDate] = [toDate, fromDate];  // Swap dates if needed
                }
                sql += ` AND office_visit_person.add_person_date BETWEEN ? AND ?`;
                params.push(fromDate, toDate);  // Add date parameters
            } else if (fromDate) {
                sql += ` AND office_visit_person.add_person_date >= ?`;
                params.push(fromDate);  // Add fromDate parameter
            } else if (toDate) {
                sql += ` AND office_visit_person.add_person_date <= ?`;
                params.push(toDate);  // Add toDate parameter
            }
    
            // Optional: Add sorting if needed
            sql += ` ORDER BY office_visit_person.id DESC`;  // Example sorting
    
            console.log("SQL Query:", sql);
    
            // Execute the query
            connection.query(sql, params, (error, results, fields) => {
                if (error) {
                    console.error("Error occurred during search:", error);
                    res.status(500).json({ error: "An error occurred during search." });
                } else {
                    console.log("Search results:", results, sql);
                    res.status(200).json({ results });
                }
            });
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).json({ error: "An error occurred." });
        }
    },
    
    

}

module.exports = OfficeVisitModel