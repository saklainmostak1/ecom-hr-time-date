const connection = require('../../../../connection/config/database')
const smsSettings = {



    // updateSmsSettings: async (req, res) => {
    //     try {
    //         const {
    //             os_admission, ot_join, oe_join, ss_admission, st_join, se_join, s_attendance, s_out_attendance, t_attendance, t_out_attendance, e_attendance, e_out_attendance, s_absence, te_absence, f_collection, df_collection, df_time, s_result, t_salary, e_salary,
    //         } = req.body;
    // const id = 1
    //         const query = `
    //             UPDATE sms_settings
    //             SET 
    //                 os_admission = ?, 
    //                 ot_join = ?, 
    //                 oe_join = ?, 
    //                 ss_admission = ?, 
    //                 st_join = ?, 
    //                 se_join = ?,
    //                 s_attendance = ?,
    //                 s_out_attendance = ?,
    //                 t_attendance = ?,
    //                 t_out_attendance = ?,
    //                 e_attendance = ?,
    //                 e_out_attendance = ?,
    //                 s_absence = ?,
    //                 te_absence = ?,
    //                 f_collection = ?,
    //                 df_collection = ?,
    //                 df_time = ?,
    //                 s_result = ?,
    //                 t_salary = ?,
    //                 e_salary = ?
    //             WHERE id = ?;
    //         `;

    //         connection.query(
    //             query,
    //             [
    //                 os_admission, ot_join, oe_join, ss_admission, st_join, se_join, s_attendance, s_out_attendance, t_attendance, t_out_attendance, e_attendance, e_out_attendance, s_absence, te_absence, f_collection, df_collection, df_time, s_result, t_salary, e_salary, id,
    //             ],
    //             (error, result) => {
    //                 if (!error && result.affectedRows > 0) {
    //                     console.log(result);
    //                     return res.send(result);
    //                 } else {
    //                     console.log(error || 'Product not found');
    //                     return res.status(404).json({ message: 'Product not found.' });
    //                 }
    //             }
    //         );
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // },
    // auto_oe_join: isOeJoin1 ? '1' : '2',
    // is_oe_join: isOeJoin2 ? '1' : '2',
    // auto_e_attendance: isEaJoin1 ? '1' : '2',
    // is_e_attendance: isEaJoin2 ? '1' : '2',
    // auto_te_absence: isTeJoin1 ? '1' : '2',
    // is_te_absence: isTeJoin2 ? '1' : '2',
    // auto_e_salary: isEsJoin1 ? '1' : '2',
    // is_e_salary: isEsJoin2 ? '1' : '2',
    updateSmsSettings: async (req, res) => {
        try {
            const {
                auto_oe_join, is_oe_join, auto_e_attendance, is_e_attendance, auto_te_absence, is_te_absence, auto_e_salary, is_e_salary, oe_join, e_attendance, te_absence, e_salary, selectedMonths, te_absent_shift_enables
            } = req.body;
            const id = 1
            console.log(selectedMonths)
            const query = `
                UPDATE sms_settings
                SET 
                    auto_oe_join = ?,
                    is_oe_join = ?,
                    auto_e_attendance = ?,
                    is_e_attendance = ?,
                    auto_te_absence = ?,
                    is_te_absence = ?,
                    auto_e_salary = ?,
                    is_e_salary = ?,
                    oe_join = ?,   
                    e_attendance = ?,
                    te_absence = ?,
                    e_salary = ?,
                    te_absent_shift = ?,
                    te_absent_shift_enable = ?
                WHERE id = ?;
            `;

            connection.query(
                query,
                [
                    auto_oe_join, is_oe_join, auto_e_attendance, is_e_attendance, auto_te_absence, is_te_absence, auto_e_salary, is_e_salary, oe_join, e_attendance, te_absence, e_salary, selectedMonths, te_absent_shift_enables, id,
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
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },


    getSmsSettings: async (req, res) => {
        try {
            const data = "select * from  sms_settings";

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


    // all_table_data: async (req, res) => {
    //     const {table_name} = req.body
    //     try {
    //         const data = `select * from  ${table_name}`;

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
}

module.exports = smsSettings