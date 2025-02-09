

const connection = require('../../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

const LoanModel = {

    loan_create: async (req, res) => {
        try {
            const { loan_authority, account, loan_reason, reference, loan_type, amount, interest, payment_type, duration, per_month, payable_amount, loan_date, note, status, img, created_by
            } = req.body;

            const insertQuery = 'INSERT INTO loan (loan_authority, account, loan_reason, reference, loan_type, amount, interest, payment_type, duration, per_month, payable_amount , loan_date, note, status, img, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const result = await connection.query(insertQuery, [loan_authority, account, loan_reason, reference, loan_type, amount, interest, payment_type, duration, per_month, payable_amount, loan_date, note, status, img, created_by]);

            // Sending only the necessary data from the result object
            const { insertId, affectedRows } = result;

            // Sending response with relevant data
            res.status(200).json({ insertId, affectedRows });

            // Using parameterized query to prevent SQL injection

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error processing the request' });
        }
    },


    loan_list: async (req, res) => {
        try {
            const data = `
            SELECT loan.*, loan_authority.name AS loan_authority_name
            FROM loan
            JOIN loan_authority ON loan.loan_authority = loan_authority.id
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

    loan_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM loan WHERE id = ?';
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


    loan_update: async (req, res) => {
        try {

            const { loan_authority, account, loan_reason, reference, loan_type, amount, interest, payment_type, duration, per_month, payable_amount, loan_date, note, status, img, modified_by
            } = req.body;

            const query = `UPDATE loan SET   loan_authority = ?, account = ?, loan_reason = ?, reference = ?, loan_type = ?, amount = ?, interest = ?, payment_type = ?, duration = ?, per_month = ?, payable_amount = ?, loan_date = ?, note = ?, status = ?, img = ?,  modified_by = ? WHERE id = ?`;
            connection.query(query, [loan_authority, account, loan_reason, reference, loan_type, amount, interest, payment_type, duration, per_month, payable_amount, loan_date, note, status, img, modified_by, req.params.id], (error, result) => {
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


    loan_delete: async (req, res) => {
        try {
            const shiftId = req.params.id;

            console.log(shiftId);

            // First, check if the shift_id is referenced in employee_joining
            const checkQuery =
                "SELECT COUNT(*) AS count FROM loan_payment WHERE loan_id = ?";
            connection.query(checkQuery, [shiftId], (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Database error" });
                }

                const isReferenced = results[0].count > 0;

                if (isReferenced) {
                    // If referenced, prevent deletion
                    return res
                        .status(400)
                        .json({ message: "Cannot delete: blood group in  use." });
                }

                // Proceed with deletion if not referenced
                const deleteQuery = "DELETE FROM loan WHERE id = ?";
                connection.query(
                    deleteQuery,
                    [shiftId],
                    (deleteError, deleteResult) => {
                        if (!deleteError && deleteResult.affectedRows > 0) {
                            console.log(deleteResult);
                            return res.send(deleteResult);
                        } else {
                            console.log(deleteError || "School shift not found");
                            return res
                                .status(404)
                                .json({ message: "School shift not found." });
                        }
                    }
                );
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server error" });
        }
    },



    loan_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
      SELECT loan.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by,
             loan_authority.name AS loan_authority_name 
      FROM loan 
      LEFT JOIN users AS users_created ON loan.created_by = users_created.id 
      LEFT JOIN users AS users_modified ON loan.modified_by = users_modified.id 
      LEFT JOIN loan_authority ON loan.loan_authority = loan_authority.id

      ORDER BY loan.id DESC
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


    loan_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            let { toDate, fromDate, account_heads, loanAuthority, loan_type, status } = req.body;

            // Construct the base SQL query
            let sql = `
              SELECT loan.*, 
             users_created.full_name AS created_by,
             users_modified.full_name AS modified_by,
             loan_authority.name AS loan_authority_name 
            FROM loan 
            LEFT JOIN users AS users_created ON loan.created_by = users_created.id 
            LEFT JOIN users AS users_modified ON loan.modified_by = users_modified.id 
            LEFT JOIN loan_authority ON loan.loan_authority = loan_authority.id
            WHERE 1`;


            if (account_heads) {

                sql += ` AND loan.account LIKE '%${account_heads}%'`;
            }

            if (loanAuthority) {

                sql += ` AND loan.loan_authority LIKE '%${loanAuthority}%'`;
            }

            if (loan_type) {
                sql += ` AND LOWER(loan.loan_type) LIKE '%${loan_type}%'`;
            }

            if (status) {

                sql += ` AND loan.status LIKE '%${status}%'`;
            }


            if (fromDate && toDate) {
                sql += ` AND loan.loan_date BETWEEN '${fromDate}' AND '${toDate}'`;
            }


            sql += ` ORDER BY loan.id DESC`
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

    loan_pdf: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize } = req.body;



            console.log(searchResults, 'here all the searchResults');


            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.loan_authority_name}</td>`; // Person Name
                row += `<td>${result.loan_type}</td>`; // Person Name
                row += `<td>${result.amount}</td>`; // Person Name
                row += `<td>${result.loan_date.slice(0,10)}</td>`; // Person Name
                row += `<td><img src="http://localhost/:5003/${result.img}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`; // Person Name
                row += `<td>${result.status === 1 ? "Active"
                    : result.status === 2 ? "Inactive"
                        : result.status === 3 ? "Pending"
                            : "Unknown"}</td>`; // Person Mobile
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
                        font-size: ${fontSize || '12px'};
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
                            <th>
                                                                        Loan Authority Name
                                                                    </th>
                                                                    <th>
                                                                        Loan Type
                                                                    </th>

                                                                    <th>
                                                                        Amount
                                                                    </th>
                                                                    <th>
                                                                        Loan Date
                                                                    </th>
                                                                    <th>
                                                                        Image
                                                                    </th>
                                                                    <th>
                                                                        Status
                                                                    </th>
                            
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



    loan_print: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize, extraColumnValue } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.loan_authority_name}</td>`; // Person Name
                row += `<td>${result.loan_type}</td>`; // Person Name
                row += `<td>${result.amount}</td>`; // Person Name
                row += `<td>${result.loan_date.slice(0,10)}</td>`; // Person Name
                row += `<td><img src="http://localhost/:5003/${result.img}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`; // Person Email
                row += `<td>${result.status === 1 ? "Active"
                    : result.status === 2 ? "Inactive"
                        : result.status === 3 ? "Pending"
                            : "Unknown"}</td>`; // Person Mobile

                // Add extra columns based on extraColumnValue
                for (let i = 1; i <= extraColumnValue; i++) {
                    row += `<td contenteditable="true">Extra Column ${i}</td>`; // Editable extra column
                }

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
                        size: ${pageSize} ${pageOrientation}; /* This sets the page size and orientation */
                        margin: 20mm; /* Adjust the margin as needed */
                    }
                    * { 
                        font-size: ${fontSize || '12px'};
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
                            <th>
                                                                        Loan Authority Name
                                                                    </th>
                                                                    <th>
                                                                        Loan Type
                                                                    </th>

                                                                    <th>
                                                                        Amount
                                                                    </th>
                                                                    <th>
                                                                        Loan Date
                                                                    </th>
                                                                    <th>
                                                                        Image
                                                                    </th>
                                                                    <th>
                                                                        Status
                                                                    </th>
                            
                 ${[...Array(extraColumnValue)].map((_, i) => `<th contenteditable="true">Extra Column ${i + 1}</th>`).join('')} <!-- Dynamically add headers -->
                           
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


}

module.exports = LoanModel