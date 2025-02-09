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

const AccountReportModel = {


    expense_search_account_report: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { fromDate, toDate, searchQuery, invoiceId, itemName, supplierId, multiSearch, paidBy, expenseCategory } = req.body;

            // Construct the base SQL query
            let sql = `
                    SELECT 
                expense.*, 
                expense_item.item_name AS expense_name, 
                expense_category.expense_category_name AS expense_category,
                expense_category.id AS expense_category_id, -- Add this line to include the category ID
                 account_head.account_head_name AS account_head_name
            FROM 
                expense 
                LEFT JOIN expense_category ON expense.expense_category = expense_category.id 
                LEFT JOIN expense_item ON expense.id = expense_item.expense_id 
                 LEFT JOIN account_head ON expense.paid_by = account_head.id
            WHERE 1
            `;


            if (fromDate && toDate) {
                sql += ` AND expense.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
            }

            if (searchQuery) {
                sql += ` AND expense.expense_category = ${searchQuery}`;
            }

            if (supplierId) {
                sql += ` AND expense.supplier_id LIKE '%${supplierId}%'`;
            }
            if (expenseCategory) {
                sql += ` AND expense_category.id LIKE '%${expenseCategory}%'`;
            }
            if (paidBy) {
                sql += ` AND expense.paid_by LIKE '%${paidBy}%'`;
            }
            // Add invoice ID condition
            if (invoiceId && invoiceId !== '') {
                sql += ` AND expense.voucher_id LIKE '%${invoiceId}%'`;
            }

            if (itemName) {

                sql += ` AND LOWER(expense_item.item_name) LIKE '%${itemName}%'`;
            }
            if (multiSearch && multiSearch.length > 0) {
                sql += ` ORDER BY ${multiSearch}`; // Append convertedData to the ORDER BY clause
            }

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


    expense_search_account_reports: async (req, res) => {
        try {
            const {
                fromDate, toDate, searchQuery, invoiceId, itemName,
                supplierId, multiSearch, paidBy, expenseCategory
            } = req.body;

            // Expense SQL Query
            let sql = `
                SELECT 
                    expense.id, 
                    expense.created_date AS created_date, 
                    expense.sub_total AS sub_total, 
                    expense_item.item_name AS expense_name, 
                    expense_category.expense_category_name AS expense_category,
                    expense_category.id AS expense_category_id,
                    account_head.account_head_name AS account_head_name,
                    expense.paid_by AS paid_by
                FROM 
                    expense 
                    LEFT JOIN expense_category ON expense.expense_category = expense_category.id 
                    LEFT JOIN expense_item ON expense.id = expense_item.expense_id 
                    LEFT JOIN account_head ON expense.paid_by = account_head.id
                WHERE 1 = 1
            `;

            // Salary SQL Query
            let salarySql = `
                SELECT 
                    salary.id,
                    salary.salary_date AS created_date,
                    SUM(salary.paid_amount) AS sub_total,
                    'Employee Salary' AS expense_name,
                    'salary' AS expense_category,
                    'salary' AS expense_category_id,
                    '' AS account_head_name,
                    salary.paid_by AS paid_by
                FROM 
                    salary
                LEFT JOIN users ON users.id = salary.user_id
                WHERE 1 = 1
                
            `;

            let sqlParams = [];
            let salarySqlParams = [];

            // Add date filters
            if (fromDate && toDate) {
                sql += ` AND expense.created_date BETWEEN ? AND ?`;
                salarySql += ` AND salary.salary_date BETWEEN ? AND ?`;
                sqlParams.push(fromDate, toDate);
                salarySqlParams.push(fromDate, toDate);
            }

            // Add search filters
            if (searchQuery) {
                sql += ` AND expense.expense_category = ?`;
                sqlParams.push(searchQuery);
            }

            if (supplierId) {
                sql += ` AND expense.supplier_id LIKE ?`;
                sqlParams.push(`%${supplierId}%`);
            }

            if (expenseCategory) {
                sql += ` AND expense_category.id LIKE ?`;
                sqlParams.push(`%${expenseCategory}%`);
            }

            if (paidBy) {
                sql += ` AND expense.paid_by LIKE ?`;
                sqlParams.push(`%${paidBy}%`);
            }

            if (invoiceId && invoiceId !== '') {
                sql += ` AND expense.voucher_id LIKE ?`;
                sqlParams.push(`%${invoiceId}%`);
            }

            if (itemName) {
                sql += ` AND LOWER(expense_item.item_name) LIKE ?`;
                sqlParams.push(`%${itemName.toLowerCase()}%`);
            }

            // Combine both SQL queries using UNION ALL
            let combinedSql = `
                (${sql})
                UNION ALL
                (${salarySql})
            `;

            // Execute the combined query
            connection.query(combinedSql, [...sqlParams, ...salarySqlParams], (error, results) => {
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

    salary_search_account_report: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { designation, month, paidBy, fromDate, toDate } = req.body;

            // Construct the base SQL query
            let sql = `
            SELECT 
                salary.*, 
                emp_promotion.designation_id, 
                designation.designation_name, 
                creator.full_name AS created_by_name,
                employee.full_name AS employee_name,
                account_head.account_head_name AS account_head_name
            FROM 
                salary 
            LEFT JOIN 
                employee_promotion emp_promotion ON salary.user_id = emp_promotion.user_id 
            LEFT JOIN 
                designation ON emp_promotion.designation_id = designation.id
            LEFT JOIN 
                users creator ON salary.created_by = creator.id
            LEFT JOIN 
                users employee ON salary.user_id = employee.id 
            LEFT JOIN 
                account_head ON salary.paid_by = account_head.id
            WHERE 1=1`;

            const queryParams = [];

            if (designation) {
                sql += ` AND emp_promotion.designation_id = ?`;
                queryParams.push(designation);
            }

            if (fromDate && toDate) {
                sql += ` AND salary.salary_date BETWEEN ? AND ?`;
                queryParams.push(fromDate, toDate);
            }

            if (paidBy) {
                sql += ` AND salary.paid_by = ?`;
                queryParams.push(paidBy);
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
                    res.status(200).json({ results: results.length ? results : [] });
                }
            });
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).json({ error: "An error occurred." });
        }
    },

    income_search_account_report: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { fromDate, toDate, searchQuery, invoiceId, paidBy, incomeCategory } = req.body;

            // Construct the base SQL query
            let sql = `   SELECT 
                income.*, 
                income_item.item_name AS income_name, 
                income_category.income_category_name AS income_category,
                income_category.id AS income_category_id, -- Add this line to include the category ID
                 account_head.account_head_name AS account_head_name
            FROM 
                income 
                LEFT JOIN income_category ON income.income_category = income_category.id 
                LEFT JOIN income_item ON income.id = income_item.income_id 
                 LEFT JOIN account_head ON income.paid_by = account_head.id
            WHERE 1`;
            //     let sql = `  SELECT 
            //     income.*, 
            //     income_item.item_name AS income_name, 
            //     income_category.income_category_name AS income_category,
            //             account_head.account_head_name AS account_head_name 
            // FROM 
            //     income 
            //     LEFT JOIN income_category ON income.income_category = income_category.id 
            //     LEFT JOIN income_item ON income.id = income_item.income_id 
            //           LEFT JOIN account_head ON income.paid_by = account_head.id
            // WHERE 1`;

            // Add date range condition
            if (fromDate && toDate) {
                sql += ` AND income.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
            }
            if (invoiceId) {
                sql += ` AND income.voucher_id LIKE '%${invoiceId}%'`;
            }
            if (incomeCategory) {
                sql += ` AND income_category.id LIKE '%${incomeCategory}%'`;
            }
            if (paidBy) {
                sql += ` AND income.paid_by LIKE '%${paidBy}%'`;
            }
            // Add income category ID condition
            if (searchQuery) {
                sql += ` AND income_category = ${searchQuery}`;
            }

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

    general_ledgers_print: async (req, res) => {
        try {
            // Destructure the necessary parameters from the request body
            const {
                totalExpensess,
                totalIncomes,
                expenseCategorySubTotal,
                incomeCategorys,
                incomeCategorySubTotal,
                expenseCategorys,
                totalIncome,
                totalExpense,
                orientation,
                selectedPrintSize,
                fontSize,
            } = req.body;



            // Generate the financial table rows
            let financialTableRows = '';
            // Handle expense subtotals
            Object.keys(expenseCategorySubTotal).forEach((categoryId, index) => {
                financialTableRows += '<tr>';
                financialTableRows += `<td class="text-center">${index + 1}</td>`;
                financialTableRows += `<td class="text-center">${incomeCategorys.find(incomeCategory => incomeCategory.id === parseInt(categoryId))?.income_category_name || ''}</td>`;
                financialTableRows += `<td class="text-center">${incomeCategorySubTotal[categoryId] || ''}</td>`;
                financialTableRows += `<td class="text-center">${expenseCategorys.find(expenseCategory => expenseCategory.id === parseInt(categoryId))?.expense_category_name || 'Employee Salary'}</td>`;
                financialTableRows += `<td class="text-center">${expenseCategorySubTotal[categoryId] || ''}</td>`;
                financialTableRows += '</tr>';
            });

            // Handle unmatched income categories
            Object.keys(incomeCategorySubTotal).filter(categoryId => !expenseCategorySubTotal[categoryId]).forEach((categoryId, index) => {
                financialTableRows += '<tr>';
                financialTableRows += `<td class="text-center">${Object.keys(expenseCategorySubTotal).length + index + 1}</td>`;
                financialTableRows += `<td class="text-center">${incomeCategorys.find(incomeCategory => incomeCategory.id === parseInt(categoryId))?.income_category_name || ''}</td>`;
                financialTableRows += `<td class="text-center">${incomeCategorySubTotal[categoryId] || ''}</td>`;
                financialTableRows += '<td class="text-center"></td><td class="text-center"></td>';
                financialTableRows += '</tr>';
            });

            // HTML structure for the print view
            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';
            const html = `
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Financial Report</title>
                    <style>
                        @page {
                            size: ${pageSize} ${pageOrientation};
                            margin: 20mm;
                        }
                        * {
                            font-family: 'Nikosh', sans-serif !important;
                            font-size: ${fontSize || '12px'};
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
                        <h2>Pathshala School & College Financial Overview</h2>
                        <h3>GA-75/A, Middle Badda, Dhaka-1212</h3>
                        <p>Phone: 01977379479, Mobile: 01977379479</p>
                        <p>Email: pathshala@urbanitsolution.com</p>
                      
                    </div>
                    <div class="container2">
                        <p>Receipt No: 829</p>
                        <p>Collected By:</p>
                        <p>Date: </p>
                    </div>
                   
    
                    <div class='container'>
                        <h3 style="text-decoration: underline;">Financial Overview</h3>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th class="text-center">SL</th>
                                <th class="text-center" colspan="2">Income</th>
                                <th class="text-center" colspan="3">Expense</th>
                            </tr>
                            <tr>
                                <th class="text-center">Title</th>
                                <th class="text-center">Amount</th>
                                <th class="text-center">Title</th>
                                <th class="text-center" colspan="2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${financialTableRows}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colspan="1"></th>
                                <th>Total</th>
                                <th>${totalIncome ? totalIncome : totalIncomes}</th>
                                <th>Total</th>
                                <th colspan="2">${totalExpense ? totalExpense : totalExpensess}</th>
                            </tr>
                            <tr>
                                <th colspan="4"></th>
                                <th>Total Income</th>
                                <th>${totalIncome ? totalIncome : totalIncomes}</th>
                            </tr>
                            <tr>
                                <th colspan="4"></th>
                                <th>Total Expense</th>
                                <th>${totalExpense ? totalExpense : totalExpensess}</th>
                            </tr>
                            <tr>
                                <th colspan="4"></th>
                                <th>Total Balance</th>
                                <th>${(totalIncome - totalExpense) ? totalIncome - totalExpense : (totalIncomes - totalExpensess)}</th>
                            </tr>
                        </tfoot>
                    </table>
                </body>
                <script>
                    window.print();
                </script>
                </html>`;

            res.send(html); // Send the generated HTML as response
        } catch (error) {
            console.error('Error in attendance_log_print:', error);
            res.status(500).send('Error generating print view');
        }
    },

    // general_ledgers_pdf: async (req, res) => {
    //     try {
    //         const {
    //             expenseCategorySubTotal,
    //             incomeCategorys,
    //             incomeCategorySubTotal,
    //             expenseCategorys,
    //             totalIncome,
    //             totalExpense,
    //             orientation,
    //             selectedPrintSize,
    //             fontSize
    //         } = req.body;

    //         let financialTableRows = '';
    //         // Handle expense subtotals
    //         Object.keys(expenseCategorySubTotal).forEach((categoryId, index) => {
    //             financialTableRows += '<tr>';
    //             financialTableRows += `<td class="text-center">${index + 1}</td>`;
    //             financialTableRows += `<td class="text-center">${incomeCategorys.find(incomeCategory => incomeCategory.id === parseInt(categoryId))?.income_category_name || ''}</td>`;
    //             financialTableRows += `<td class="text-center">${incomeCategorySubTotal[categoryId] || ''}</td>`;
    //             financialTableRows += `<td class="text-center">${expenseCategorys.find(expenseCategory => expenseCategory.id === parseInt(categoryId))?.expense_category_name || 'Employee Salary'}</td>`;
    //             financialTableRows += `<td class="text-center">${expenseCategorySubTotal[categoryId] || ''}</td>`;
    //             financialTableRows += '</tr>';
    //         });

    //         // Handle unmatched income categories
    //         Object.keys(incomeCategorySubTotal).filter(categoryId => !expenseCategorySubTotal[categoryId]).forEach((categoryId, index) => {
    //             financialTableRows += '<tr>';
    //             financialTableRows += `<td class="text-center">${Object.keys(expenseCategorySubTotal).length + index + 1}</td>`;
    //             financialTableRows += `<td class="text-center">${incomeCategorys.find(incomeCategory => incomeCategory.id === parseInt(categoryId))?.income_category_name || ''}</td>`;
    //             financialTableRows += `<td class="text-center">${incomeCategorySubTotal[categoryId] || ''}</td>`;
    //             financialTableRows += '<td class="text-center"></td><td class="text-center"></td>';
    //             financialTableRows += '</tr>';
    //         });

    //         // HTML structure for the print view


    //         const html = `
    //         <html lang="en">
    //         <head>
    //             <meta charset="UTF-8">
    //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //             <title>Attendance and Financial Report</title>
    //             <style>
    //                 @page {
    //                     size: ${pageSize} ${pageOrientation};
    //                     margin: 20mm;
    //                 }
    //                 * {
    //                     font-family: 'Nikosh', sans-serif !important;
    //                     font-size: ${fontSize || '12px'};
    //                 }
    //                 table {
    //                     width: 100%;
    //                     border-collapse: collapse;
    //                 }
    //                 th, td {
    //                     padding: 8px;
    //                     text-align: left;
    //                     border: 1px solid #ddd;
    //                 }
    //                 th {
    //                     background-color: #f2f2f2;
    //                 }
    //                 img {
    //                     max-width: 100px;
    //                     max-height: 100px;
    //                 }
    //                 .container {
    //                     text-align: center;
    //                 }
    //                 .container2 {
    //                     display: flex;
    //                     justify-content: space-between;
    //                 }
    //             </style>
    //         </head>
    //         <body>
    //             <div class='container'>
    //                 <h2>Pathshala School & College Attendance List</h2>
    //                 <h3>GA-75/A, Middle Badda, Dhaka-1212</h3>
    //                 <p>Phone: 01977379479, Mobile: 01977379479</p>
    //                 <p>Email: pathshala@urbanitsolution.com</p>
    //                 <h3 style="text-decoration: underline;">Attendance List</h3>
    //             </div>
    //             <div class="container2">
    //                 <p>Receipt No: 829</p>
    //                 <p>Collected By:</p>
    //                 <p>Date: </p>
    //             </div>


    //             <div class='container'>
    //                 <h3 style="text-decoration: underline;">Financial Overview</h3>
    //             </div>
    //             <table>
    //                 <thead>
    //                     <tr>
    //                         <th class="text-center">SL</th>
    //                         <th class="text-center" colspan="2">Income</th>
    //                         <th class="text-center" colspan="3">Expense</th>
    //                     </tr>
    //                     <tr>
    //                         <th class="text-center">Title</th>
    //                         <th class="text-center">Amount</th>
    //                         <th class="text-center">Title</th>
    //                         <th class="text-center" colspan="2">Amount</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     ${financialTableRows}
    //                 </tbody>
    //                 <tfoot>
    //                     <tr>
    //                         <th colspan="1"></th>
    //                         <th>Total</th>
    //                         <th>${totalIncome}</th>
    //                         <th>Total</th>
    //                         <th colspan="2">${totalExpense}</th>
    //                     </tr>
    //                     <tr>
    //                         <th colspan="4"></th>
    //                         <th>Total Income</th>
    //                         <th>${totalIncome}</th>
    //                     </tr>
    //                     <tr>
    //                         <th colspan="4"></th>
    //                         <th>Total Expense</th>
    //                         <th>${totalExpense}</th>
    //                     </tr>
    //                     <tr>
    //                         <th colspan="4"></th>
    //                         <th>Total Balance</th>
    //                         <th>${totalIncome - totalExpense}</th>
    //                     </tr>
    //                 </tfoot>
    //             </table>
    //         </body>

    //         </html>`;
    //         const pageSize = selectedPrintSize || 'A4';
    //         const pageOrientation = orientation || 'portrait';

    //         wkhtmltopdf(html, { pageSize: pageSize, orientation: pageOrientation }, (err, stream) => {
    //             if (err) {
    //                 console.error('Error generating PDF:', err);
    //                 console.error('Error details:', err.stderr); // Log additional details from stderr
    //                 res.status(500).send('Error generating PDF');
    //                 return;
    //             }
    //             stream.pipe(res);
    //         });
    //     } catch (error) {
    //         console.error('Error in attendance_pdf:', error);
    //         res.status(500).send('Error generating PDF');
    //     }
    // },

    general_ledgers_pdf: async (req, res) => {
        try {
            const {
                totalExpensess,
                totalIncomes,
                expenseCategorySubTotal,
                incomeCategorys,
                incomeCategorySubTotal,
                expenseCategorys,
                totalIncome,
                totalExpense,
                orientation,
                selectedPrintSize,
                fontSize,

            } = req.body;



            let financialTableRows = '';

            // Handle expense subtotals
            Object.keys(expenseCategorySubTotal).forEach((categoryId, index) => {
                financialTableRows += '<tr>';
                financialTableRows += `<td class="text-center">${index + 1}</td>`;
                financialTableRows += `<td class="text-center">${incomeCategorys.find(incomeCategory => incomeCategory.id === parseInt(categoryId))?.income_category_name || ''}</td>`;
                financialTableRows += `<td class="text-center">${incomeCategorySubTotal[categoryId] || ''}</td>`;
                financialTableRows += `<td class="text-center">${expenseCategorys.find(expenseCategory => expenseCategory.id === parseInt(categoryId))?.expense_category_name || 'Employee Salary'}</td>`;
                financialTableRows += `<td class="text-center">${expenseCategorySubTotal[categoryId] || ''}</td>`;
                financialTableRows += '</tr>';
            });

            // Handle unmatched income categories
            Object.keys(incomeCategorySubTotal).filter(categoryId => !expenseCategorySubTotal[categoryId]).forEach((categoryId, index) => {
                financialTableRows += '<tr>';
                financialTableRows += `<td class="text-center">${Object.keys(expenseCategorySubTotal).length + index + 1}</td>`;
                financialTableRows += `<td class="text-center">${incomeCategorys.find(incomeCategory => incomeCategory.id === parseInt(categoryId))?.income_category_name || ''}</td>`;
                financialTableRows += `<td class="text-center">${incomeCategorySubTotal[categoryId] || ''}</td>`;
                financialTableRows += '<td class="text-center"></td><td class="text-center"></td>';
                financialTableRows += '</tr>';
            });

            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';

            // HTML structure for the print view
            const html = `
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Financial Report</title>
                <style>
                    @page {
                        size: ${pageSize} ${pageOrientation};
                        margin: 20mm;
                    }
                    * {
                        font-family: 'Nikosh', sans-serif !important;
                        font-size: ${fontSize || '12px'};
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
                    <h2>Pathshala School & College Financial Overview</h2>
                    <h3>GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p>Phone: 01977379479, Mobile: 01977379479</p>
                    <p>Email: pathshala@urbanitsolution.com</p>
                  
                </div>
                <div class="container2">
                    <p>Receipt No: 829</p>
                    <p>Collected By:</p>
                    <p>Date: </p>
                </div>
                <div class='container'>
                    <h3 style="text-decoration: underline;">Financial Overview</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th class="text-center">SL</th>
                            <th class="text-center" colspan="2">Income</th>
                            <th class="text-center" colspan="3">Expense</th>
                        </tr>
                        <tr>
                            <th class="text-center">Title</th>
                            <th class="text-center">Amount</th>
                            <th class="text-center">Title</th>
                            <th class="text-center" colspan="2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${financialTableRows}
                    </tbody>
                    <tfoot>
                         <tr>
                                <th colspan="1"></th>
                                <th>Total</th>
                                <th>${totalIncome ? totalIncome : totalIncomes}</th>
                                <th>Total</th>
                                <th colspan="2">${totalExpense ? totalExpense : totalExpensess}</th>
                            </tr>
                            <tr>
                                <th colspan="4"></th>
                                <th>Total Income</th>
                                <th>${totalIncome ? totalIncome : totalIncomes}</th>
                            </tr>
                            <tr>
                                <th colspan="4"></th>
                                <th>Total Expense</th>
                                <th>${totalExpense ? totalExpense : totalExpensess}</th>
                            </tr>
                            <tr>
                                <th colspan="4"></th>
                                <th>Total Balance</th>
                                <th>${(totalIncome - totalExpense) ? totalIncome - totalExpense : (totalIncomes - totalExpensess)}</th>
                            </tr>
                    </tfoot>
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
            console.error('Error in general_ledgers_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },



    balance_sheet_print: async (req, res) => {
        try {
            const {
                orientation, selectedPrintSize, fontSize, incomeSearch, searchResults, totals, account_head
            } = req.body;

            // Generate the financial table rows
            let financialTableRows = '';

            if (Object.keys(searchResults).length > 0 || Object.keys(incomeSearch).length > 0) {
                let totalAmountSum = 0;

                // Render asset rows
                financialTableRows += `
                    <thead>
                        <tr class="report-bg w-100">
                            <th>Accounts Title</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="report-bg">
                            <th>Asset</th>
                            <th></th>
                        </tr>`;

                // Render accounts
                account_head.forEach(account => {
                    const expenseAmount = searchResults[account.id] || 0;
                    const incomeAmount = incomeSearch[account.id] || 0;
                    // const totalAmount = expenseAmount + incomeAmount;
                    const totalAmount = incomeAmount - expenseAmount;

                    totalAmountSum += totalAmount;

                    financialTableRows += `
                        <tr>
                            <th>${account.account_head_name}</th>
                            <th>${totalAmount.toLocaleString()}</th>
                        </tr>`;
                });

                financialTableRows += `
                        <tr class="report-bg">
                            <td>Subtotal</td>
                            <td>${totalAmountSum.toLocaleString()}</td>
                        </tr>
                        <tr class="report-bg">
                            <th>Liability</th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>Bank Loan</th>
                            <th>0</th>
                        </tr>
                        <tr class="report-bg">
                            <td>Subtotal</td>
                            <td>0</td>
                        </tr>
                        <tr class="report-bg">
                            <th>Owner's Equity</th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>Capital</th>
                            <th>0</th>
                        </tr>
                        <tr>
                            <th>Withdraw</th>
                            <th>0</th>
                        </tr>
                        <tr class="report-bg">
                            <td>Subtotal</td>
                            <td>0</td>
                        </tr>
                        <tr class="report-bg">
                            <td>Net Profit/Loss</td>
                            <td>${totalAmountSum.toLocaleString()}</td>
                        </tr>
                        <tr class="report-bg">
                            <td>Net Liability and Owner’s Equity</td>
                            <td>${totalAmountSum.toLocaleString()}</td>
                        </tr>
                        <tr class="report-bg">
                            <td>Net Asset</td>
                            <td>${totalAmountSum.toLocaleString()}</td>
                        </tr>
                    </tbody>`;
            } else {
                // If there are no search results or income search results, use totals
                const totalAmountSum = totals.totalAmountSum || 0;

                financialTableRows += `
                    <thead>
                        <tr class="report-bg w-100">
                            <th>Accounts Title</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="report-bg">
                            <th>Asset</th>
                            <th></th>
                        </tr>`;

                totals.accountRows.forEach(account => {
                    financialTableRows += `
                        <tr>
                            <th>${account.account_head_name}</th>
                            <th>${account.totalAmount.toLocaleString()}</th>
                        </tr>`;
                });

                financialTableRows += `
                        <tr class="report-bg">
                            <td>Subtotal</td>
                            <td>${totalAmountSum.toLocaleString()}</td>
                        </tr>
                        <tr class="report-bg">
                            <th>Liability</th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>Bank Loan</th>
                            <th>0</th>
                        </tr>
                        <tr class="report-bg">
                            <td>Subtotal</td>
                            <td>0</td>
                        </tr>
                        <tr class="report-bg">
                            <th>Owner's Equity</th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>Capital</th>
                            <th>0</th>
                        </tr>
                        <tr>
                            <th>Withdraw</th>
                            <th>0</th>
                        </tr>
                        <tr class="report-bg">
                            <td>Subtotal</td>
                            <td>0</td>
                        </tr>
                        <tr class="report-bg">
                            <td>Net Profit/Loss</td>
                            <td>${totalAmountSum.toLocaleString()}</td>
                        </tr>
                        <tr class="report-bg">
                            <td>Net Liability and Owner’s Equity</td>
                            <td>${totalAmountSum.toLocaleString()}</td>
                        </tr>
                        <tr class="report-bg">
                            <td>Net Asset</td>
                            <td>${totalAmountSum.toLocaleString()}</td>
                        </tr>
                    </tbody>`;
            }

            // HTML structure for the print view
            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';
            const html = `
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Financial Report</title>
                    <style>
                        @page {
                            size: ${pageSize} ${pageOrientation};
                            margin: 20mm;
                        }
                        * {
                            font-family: 'Nikosh', sans-serif !important;
                            font-size: ${fontSize || '12px'};
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
                        <h2>Pathshala School & College Financial Overview</h2>
                        <h3>GA-75/A, Middle Badda, Dhaka-1212</h3>
                        <p>Phone: 01977379479, Mobile: 01977379479</p>
                        <p>Email: pathshala@urbanitsolution.com</p>
                    </div>
                    <div class="container2">
                        <p>Receipt No: 829</p>
                        <p>Collected By:</p>
                        <p>Date: </p>
                    </div>
                    <div class='container'>
                        <h3 style="text-decoration: underline;">Financial Overview</h3>
                    </div>
                    <table>
                        ${financialTableRows}
                    </table>
                </body>
                <script>
                    window.print();
                </script>
                </html>`;

            res.send(html); // Send the generated HTML as response
        } catch (error) {
            console.error('Error in balance_sheet_print:', error);
            res.status(500).send('Error generating print view');
        }
    },

    balance_sheet_pdf: async (req, res) => {
        try {
            const {
                orientation, selectedPrintSize, fontSize, incomeSearch, searchResults, totals, account_head
            } = req.body;

            // Generate the financial table rows
            let financialTableRows = '';

            if (Object.keys(searchResults).length > 0 || Object.keys(incomeSearch).length > 0) {
                let totalAmountSum = 0;

                // Render asset rows
                financialTableRows += `
                          <thead>
                              <tr class="report-bg w-100">
                                  <th>Accounts Title</th>
                                  <th>Total</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr class="report-bg">
                                  <th>Asset</th>
                                  <th></th>
                              </tr>`;

                // Render accounts
                account_head.forEach(account => {
                    const expenseAmount = searchResults[account.id] || 0;
                    const incomeAmount = incomeSearch[account.id] || 0;
                    // const totalAmount = expenseAmount + incomeAmount;
                    const totalAmount = incomeAmount - expenseAmount;

                    totalAmountSum += totalAmount;

                    financialTableRows += `
                              <tr>
                                  <th>${account.account_head_name}</th>
                                  <th>${totalAmount.toLocaleString()}</th>
                              </tr>`;
                });

                financialTableRows += `
                              <tr class="report-bg">
                                  <td>Subtotal</td>
                                  <td>${totalAmountSum.toLocaleString()}</td>
                              </tr>
                              <tr class="report-bg">
                                  <th>Liability</th>
                                  <th></th>
                              </tr>
                              <tr>
                                  <th>Bank Loan</th>
                                  <th>0</th>
                              </tr>
                              <tr class="report-bg">
                                  <td>Subtotal</td>
                                  <td>0</td>
                              </tr>
                              <tr class="report-bg">
                                  <th>Owner's Equity</th>
                                  <th></th>
                              </tr>
                              <tr>
                                  <th>Capital</th>
                                  <th>0</th>
                              </tr>
                              <tr>
                                  <th>Withdraw</th>
                                  <th>0</th>
                              </tr>
                              <tr class="report-bg">
                                  <td>Subtotal</td>
                                  <td>0</td>
                              </tr>
                              <tr class="report-bg">
                                  <td>Net Profit/Loss</td>
                                  <td>${totalAmountSum.toLocaleString()}</td>
                              </tr>
                              <tr class="report-bg">
                                  <td>Net Liability and Owner’s Equity</td>
                                  <td>${totalAmountSum.toLocaleString()}</td>
                              </tr>
                              <tr class="report-bg">
                                  <td>Net Asset</td>
                                  <td>${totalAmountSum.toLocaleString()}</td>
                              </tr>
                          </tbody>`;
            } else {
                // If there are no search results or income search results, use totals
                const totalAmountSum = totals.totalAmountSum || 0;

                financialTableRows += `
                          <thead>
                              <tr class="report-bg w-100">
                                  <th>Accounts Title</th>
                                  <th>Total</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr class="report-bg">
                                  <th>Asset</th>
                                  <th></th>
                              </tr>`;

                totals.accountRows.forEach(account => {
                    financialTableRows += `
                              <tr>
                                  <th>${account.account_head_name}</th>
                                  <th>${account.totalAmount.toLocaleString()}</th>
                              </tr>`;
                });

                financialTableRows += `
                              <tr class="report-bg">
                                  <td>Subtotal</td>
                                  <td>${totalAmountSum.toLocaleString()}</td>
                              </tr>
                              <tr class="report-bg">
                                  <th>Liability</th>
                                  <th></th>
                              </tr>
                              <tr>
                                  <th>Bank Loan</th>
                                  <th>0</th>
                              </tr>
                              <tr class="report-bg">
                                  <td>Subtotal</td>
                                  <td>0</td>
                              </tr>
                              <tr class="report-bg">
                                  <th>Owner's Equity</th>
                                  <th></th>
                              </tr>
                              <tr>
                                  <th>Capital</th>
                                  <th>0</th>
                              </tr>
                              <tr>
                                  <th>Withdraw</th>
                                  <th>0</th>
                              </tr>
                              <tr class="report-bg">
                                  <td>Subtotal</td>
                                  <td>0</td>
                              </tr>
                              <tr class="report-bg">
                                  <td>Net Profit/Loss</td>
                                  <td>${totalAmountSum.toLocaleString()}</td>
                              </tr>
                              <tr class="report-bg">
                                  <td>Net Liability and Owner’s Equity</td>
                                  <td>${totalAmountSum.toLocaleString()}</td>
                              </tr>
                              <tr class="report-bg">
                                  <td>Net Asset</td>
                                  <td>${totalAmountSum.toLocaleString()}</td>
                              </tr>
                          </tbody>`;
            }

            // HTML structure for the print view
            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';
            const html = `
                      <html lang="en">
                      <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <title>Financial Report</title>
                          <style>
                              @page {
                                  size: ${pageSize} ${pageOrientation};
                                  margin: 20mm;
                              }
                              * {
                                  font-family: 'Nikosh', sans-serif !important;
                                  font-size: ${fontSize || '12px'};
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
                              <h2>Pathshala School & College Financial Overview</h2>
                              <h3>GA-75/A, Middle Badda, Dhaka-1212</h3>
                              <p>Phone: 01977379479, Mobile: 01977379479</p>
                              <p>Email: pathshala@urbanitsolution.com</p>
                          </div>
                          <div class="container2">
                              <p>Receipt No: 829</p>
                              <p>Collected By:</p>
                              <p>Date: </p>
                          </div>
                          <div class='container'>
                              <h3 style="text-decoration: underline;">Financial Overview</h3>
                          </div>
                          <table>
                              ${financialTableRows}
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
            console.error('Error in balance_sheet_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },





    // income_amount_account_report: async (req, res) => {
    //     try {
    //         console.log("Search button clicked.");

    //         // Extract necessary data from request
    //         const { yearName, type } = req.body;

    //         // Construct the base SQL query
    //         let sql = `
    //           SELECT 
    //                 income.id, 
    //                 income.income_date AS created_date, 
    //                 income.sub_total AS sub_total, 
    //                 income_item.item_name AS income_name, 
    //                 income_category.income_category_name AS income_category,
    //                 income_category.id AS income_category_id,
    //                 account_head.account_head_name AS account_head_name,
    //                 income.paid_by AS paid_by
    //             FROM 
    //                 income 
    //                 LEFT JOIN income_category ON income.income_category = income_category.id 
    //                 LEFT JOIN income_item ON income.id = income_item.income_id 
    //                 LEFT JOIN account_head ON income.paid_by = account_head.id
    //             WHERE 1
    //         `

    //         if (fromDate && toDate) {
    //             sql += ` AND income.income_date BETWEEN '${fromDate}' AND '${toDate}'`;
    //         }


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


    income_amount_account_report: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { yearName, type } = req.body;

            // Construct the base SQL query
            let sql = `
                SELECT 
                    income.id, 
                    income.income_date AS created_date, 
                    SUM(income.sub_total) AS sub_total_income, 
                    income_item.item_name AS income_name, 
                    income_category.income_category_name AS income_category,
                    income_category.id AS income_category_id,
                    account_head.account_head_name AS account_head_name,
                    income.paid_by AS paid_by
                FROM 
                    income 
                    LEFT JOIN income_category ON income.income_category = income_category.id 
                    LEFT JOIN income_item ON income.id = income_item.income_id 
                    LEFT JOIN account_head ON income.paid_by = account_head.id
                WHERE YEAR(income.income_date) = '${yearName}'
            `;



            // Modify the query based on the 'type' (daily or monthly)
            if (type === "daily") {
                sql += ` GROUP BY DATE(income.income_date)`; // Group by day for daily type
            } else if (type === "monthly") {
                sql += ` GROUP BY MONTH(income.income_date)`; // Group by month for monthly type
            }

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

    // expense_amount_account_report: async (req, res) => {
    //     try {
    //         const {
    //             yearName, type
    //         } = req.body;

    //         // Expense SQL Query
    //         let sql = `
    //             SELECT 
    //                 expense.id, 
    //                 expense.expense_date AS created_date, 
    //                 expense.sub_total AS sub_total, 
    //                 expense_item.item_name AS expense_name, 
    //                 expense_category.expense_category_name AS expense_category,
    //                 expense_category.id AS expense_category_id,
    //                 account_head.account_head_name AS account_head_name,
    //                 expense.paid_by AS paid_by
    //             FROM 
    //                 expense 
    //                 LEFT JOIN expense_category ON expense.expense_category = expense_category.id 
    //                 LEFT JOIN expense_item ON expense.id = expense_item.expense_id 
    //                 LEFT JOIN account_head ON expense.paid_by = account_head.id
    //             WHERE 1 = 1
    //         `;

    //         // Salary SQL Query
    //         let salarySql = `
    //             SELECT 
    //                 salary.id,
    //                 salary.salary_date AS created_date,
    //                 SUM(salary.paid_amount) AS sub_total,
    //                 'Employee Salary' AS expense_name,
    //                 'salary' AS expense_category,
    //                 'salary' AS expense_category_id,
    //                 '' AS account_head_name,
    //                 salary.paid_by AS paid_by
    //             FROM 
    //                 salary
    //             LEFT JOIN users ON users.id = salary.user_id
    //             WHERE 1 = 1

    //         `;

    //         let sqlParams = [];
    //         let salarySqlParams = [];



    //         // Add search filters


    //         // Combine both SQL queries using UNION ALL
    //         let combinedSql = `
    //             (${sql})
    //             UNION ALL
    //             (${salarySql})
    //         `;

    //         // Execute the combined query
    //         connection.query(combinedSql, [...sqlParams, ...salarySqlParams], (error, results) => {
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

    expense_amount_account_report: async (req, res) => {
        try {
            const { yearName, type } = req.body;

            // Expense SQL Query
            let expenseSql = `
                SELECT 
                    expense.id, 
                    expense.expense_date AS created_date, 
                    SUM(expense.sub_total) AS sub_total_expense, 
                    expense_item.item_name AS expense_name, 
                    expense_category.expense_category_name AS expense_category,
                    expense_category.id AS expense_category_id,
                    account_head.account_head_name AS account_head_name,
                    expense.paid_by AS paid_by
                FROM 
                    expense 
                    LEFT JOIN expense_category ON expense.expense_category = expense_category.id 
                    LEFT JOIN expense_item ON expense.id = expense_item.expense_id 
                    LEFT JOIN account_head ON expense.paid_by = account_head.id
                WHERE YEAR(expense.expense_date) = '${yearName}'
            `;

            // Salary SQL Query
            let salarySql = `
                SELECT 
                    salary.id,
                    salary.salary_date AS created_date,
                    SUM(salary.paid_amount) AS sub_total_salary,
                    'Employee Salary' AS expense_name,
                    'Salary' AS expense_category,
                    'Salary' AS expense_category_id,
                    '' AS account_head_name,
                    salary.paid_by AS paid_by
                FROM 
                    salary
                LEFT JOIN users ON users.id = salary.user_id
                WHERE YEAR(salary.salary_date) = '${yearName}'
            `;

            // Add date range filter if provided

            // Modify the query based on the 'type' (daily or monthly)
            if (type === "daily") {
                expenseSql += ` GROUP BY DATE(expense.expense_date)`; // Group by day for daily type
                salarySql += ` GROUP BY DATE(salary.salary_date)`;   // Group by day for daily type
            } else if (type === "monthly") {
                expenseSql += ` GROUP BY MONTH(expense.expense_date)`; // Group by month for monthly type
                salarySql += ` GROUP BY MONTH(salary.salary_date)`;   // Group by month for monthly type
            }

            // Combine both SQL queries using UNION ALL
            let combinedSql = `
                (${expenseSql})
                UNION ALL
                (${salarySql})
            `;

            console.log("Combined SQL Query:", combinedSql);

            // Execute the combined query
            connection.query(combinedSql, (error, results) => {
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



    // accounts_report_print: async (req, res) => {
    //     try {
    //         // Destructure the necessary parameters from the request body
    //         const { orientation, selectedPrintSize, fontSize, expenses, incomes, type, yearName } = req.body;

    //         // Helper function to format table rows based on type (daily/monthly)
    //         const formatTableRows = (expenses, incomes, type) => {
    //             const combinedData = {};
    //             const currentDate = new Date(); // Get today's date
    //             const currentYear = currentDate.getFullYear(); // Get the current year

    //             // Determine the year to use based on yearName matching current year
    //             const year = yearName === currentYear.toString() ? currentYear : yearName;

    //             // Initialize combinedData based on the type
    //             if (type === 'daily') {
    //                 const firstDayOfYear = new Date(year, 0, 1); // January 1st of the selected year
    //                 const timeDiff = currentDate - firstDayOfYear; // Time difference in milliseconds
    //                 const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days

    //                 // Loop through each day from January 1st to today
    //                 for (let day = 0; day <= daysDiff; day++) {
    //                     const date = new Date(firstDayOfYear);
    //                     date.setDate(day + 1); // Set to the respective day of the year
    //                     const dateKey = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${year}`; // DD-MM-YYYY
    //                     combinedData[dateKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
    //                 }
    //             } else if (type === 'monthly') {
    //                 const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    //                 // Initialize combinedData with all months of the selected year
    //                 allMonths.forEach(month => {
    //                     const monthKey = `${month}-${year}`; // Format Mon-YYYY
    //                     combinedData[monthKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
    //                 });
    //             }

    //             // Process expenses
    //             expenses.forEach(expense => {
    //                 const { created_date, sub_total_expense, expense_category } = expense;
    //                 const expenseDate = new Date(created_date);
    //                 const dateKey = type === 'daily'
    //                     ? `${expenseDate.getDate().toString().padStart(2, '0')}-${(expenseDate.getMonth() + 1).toString().padStart(2, '0')}-${expenseDate.getFullYear()}` // DD-MM-YYYY
    //                     : `${expenseDate.toLocaleString('default', { month: 'short' })}-${expenseDate.getFullYear()}`; // Mon-YYYY

    //                 if (!combinedData[dateKey]) {
    //                     combinedData[dateKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
    //                 }

    //                 if (expense_category === "Salary") {
    //                     combinedData[dateKey].salaryExpense += sub_total_expense;
    //                 } else {
    //                     combinedData[dateKey].totalExpense += sub_total_expense;
    //                 }
    //             });

    //             // Process incomes
    //             incomes.forEach(income => {
    //                 const { created_date, sub_total_income } = income;
    //                 const incomeDate = new Date(created_date);
    //                 const dateKey = type === 'daily'
    //                     ? `${incomeDate.getDate().toString().padStart(2, '0')}-${(incomeDate.getMonth() + 1).toString().padStart(2, '0')}-${incomeDate.getFullYear()}` // DD-MM-YYYY
    //                     : `${incomeDate.toLocaleString('default', { month: 'short' })}-${incomeDate.getFullYear()}`; // Mon-YYYY

    //                 if (!combinedData[dateKey]) {
    //                     combinedData[dateKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
    //                 }

    //                 combinedData[dateKey].income += sub_total_income;
    //             });

    //             // Generate table rows and calculate balances
    //             let previousBalance = 0; // Starting balance
    //             let financialTableRows = ''; // Initialize rows string

    //             Object.keys(combinedData).sort((a, b) => {
    //                 if (type === 'daily') {
    //                     const [dayA, monthA, yearA] = a.split('-').map(Number);
    //                     const [dayB, monthB, yearB] = b.split('-').map(Number);
    //                     return yearA - yearB || monthA - monthB || dayA - dayB;
    //                 } else {
    //                     const [monthA, yearA] = a.split('-');
    //                     const [monthB, yearB] = b.split('-');
    //                     const monthIndexA = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthA);
    //                     const monthIndexB = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthB);
    //                     return yearA - yearB || monthIndexA - monthIndexB;
    //                 }
    //             }).forEach((date, index) => {
    //                 const data = combinedData[date];
    //                 const total = data.income - (data.totalExpense + data.salaryExpense);
    //                 const openingBalance = previousBalance;
    //                 const closingBalance = openingBalance + total;

    //                 previousBalance = closingBalance;

    //                 // Add table row HTML
    //                 financialTableRows += `
    //                     <tr>
    //                         <td>${index + 1}</td>
    //                         <td>${date}</td>
    //                         <td>${openingBalance.toFixed(2)}</td>
    //                         <td>${data.income.toFixed(2)}</td>
    //                         <td>${data.totalExpense.toFixed(2)}</td>
    //                         <td>${data.salaryExpense.toFixed(2)}</td>
    //                         <td>${total.toFixed(2)}</td>
    //                     </tr>`;
    //             });

    //             return financialTableRows;
    //         };

    //         // Generate financial table rows
    //         const financialTableRows = formatTableRows(expenses, incomes, type);

    //         // HTML structure for the print view
    //         const pageSize = selectedPrintSize || 'A4';
    //         const pageOrientation = orientation || 'portrait';
    //         const html = `
    //             <html lang="en">
    //             <head>
    //                 <meta charset="UTF-8">
    //                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //                 <title>Financial Report</title>
    //                 <style>
    //                     @page {
    //                         size: ${pageSize} ${pageOrientation};
    //                         margin: 20mm;
    //                     }
    //                     * {
    //                         font-family: 'Nikosh', sans-serif !important;
    //                         font-size: ${fontSize || '12px'};
    //                     }
    //                     table {
    //                         width: 100%;
    //                         border-collapse: collapse;
    //                     }
    //                     th, td {
    //                         padding: 8px;
    //                         text-align: left;
    //                         border: 1px solid #ddd;
    //                     }
    //                     th {
    //                         background-color: #f2f2f2;
    //                     }
    //                 </style>
    //             </head>
    //             <body>
    //                 <div class="container">
    //                     <h2>Pathshala School & College Financial Overview</h2>
    //                     <h3>GA-75/A, Middle Badda, Dhaka-1212</h3>
    //                     <p>Phone: 01977379479, Mobile: 01977379479</p>
    //                     <p>Email: pathshala@urbanitsolution.com</p>
    //                 </div>
    //                 <div class="container2">
    //                     <p>Receipt No: 829</p>
    //                     <p>Collected By:</p>
    //                     <p>Date: </p>
    //                 </div>
    //                 <div class="container">
    //                     <h3 style="text-decoration: underline;">Financial Overview</h3>
    //                 </div>
    //                 <table>
    //                     <thead>
    //                         <tr>
    //                             <th>SL No.</th>
    //                             <th>Transaction Date</th>
    //                             <th>Opening Balance</th>
    //                             <th>Total Income</th>
    //                             <th>Total Expense</th>
    //                             <th>Salary</th>
    //                             <th>Total</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         ${financialTableRows}
    //                     </tbody>
    //                 </table>
    //             </body>
    //             <script>
    //                 window.print();
    //             </script>
    //             </html>`;

    //         res.send(html); // Send the generated HTML as response
    //     } catch (error) {
    //         console.error('Error in accounts_report_print:', error);
    //         res.status(500).send('Error generating print view');
    //     }
    // },

    // accounts_report_print: async (req, res) => {
    //     try {
    //         // Destructure the necessary parameters from the request body
    //         const { orientation, selectedPrintSize, fontSize, expenses, incomes, type, yearName } = req.body;

    //         // Helper function to format table rows based on type (daily/monthly)
    //         const formatTableRows = (expenses, incomes, type) => {
    //             const combinedData = {};
    //             // const year = yearName;

    //             // Initialize combinedData with zero values based on type
    //             // if (type === 'daily') {
    //             //     for (let day = 1; day <= 365; day++) {
    //             //         const date = new Date(year, 0);
    //             //         date.setDate(day);
    //             //         const dateKey = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${year}`; // DD-MM-YYYY
    //             //         combinedData[dateKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
    //             //     }
    //             if (type === 'daily') {
    //                 const currentDate = new Date(); // Get today's date
    //                 const year = currentDate.getFullYear(); // Get the current year
    //                 const firstDayOfYear = new Date(year, 0, 1); // January 1st of the current year

    //                 // Calculate the difference in time (in milliseconds) and then convert to days
    //                 const timeDiff = currentDate - firstDayOfYear; // Time difference in milliseconds
    //                 const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days

    //                 // Loop through each day from January 1st to today
    //                 for (let day = 0; day <= daysDiff; day++) {
    //                     const date = new Date(firstDayOfYear);
    //                     date.setDate(day + 1); // Set to the respective day of the year
    //                     const dateKey = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${year}`; // DD-MM-YYYY
    //                     combinedData[dateKey] = {
    //                         income: 0,
    //                         totalExpense: 0,
    //                         salaryExpense: 0,
    //                     };
    //                 }
    //             } 

    //             else  if (type === 'monthly') {
    //                 const currentDate = new Date(); // Get today's date
    //                 const year = currentDate.getFullYear(); // Get the current year
    //                 const currentMonth = currentDate.getMonth(); // Get the current month (0-11)

    //                 // List of all months in the year
    //                 const allMonths = [
    //                     'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    //                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    //                 ];

    //                 // Initialize combinedData with all months up to the current month
    //                 for (let monthIndex = 0; monthIndex <= currentMonth; monthIndex++) {
    //                     const monthKey = `${allMonths[monthIndex]}-${year}`; // Format Mon-YYYY
    //                     combinedData[monthKey] = {
    //                         income: 0,
    //                         totalExpense: 0,
    //                         salaryExpense: 0,
    //                     };
    //                 }
    //             }

    //             // else if (type === 'monthly') {
    //             //     const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    //             //     allMonths.forEach((month) => {
    //             //         const monthKey = `${month}-${year}`; // Format Mon-YYYY
    //             //         combinedData[monthKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
    //             //     });
    //             // }

    //             // Process expenses
    //             expenses.forEach(expense => {
    //                 const { created_date, sub_total_expense, expense_category } = expense;
    //                 const expenseDate = new Date(created_date);
    //                 const dateKey = type === 'daily'
    //                     ? `${expenseDate.getDate().toString().padStart(2, '0')}-${(expenseDate.getMonth() + 1).toString().padStart(2, '0')}-${expenseDate.getFullYear()}` // DD-MM-YYYY
    //                     : `${expenseDate.toLocaleString('default', { month: 'short' })}-${expenseDate.getFullYear()}`; // Mon-YYYY

    //                 if (!combinedData[dateKey]) {
    //                     combinedData[dateKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
    //                 }
    //                 if (expense_category === "Salary") {
    //                     combinedData[dateKey].salaryExpense += sub_total_expense;
    //                 } else {
    //                     combinedData[dateKey].totalExpense += sub_total_expense;
    //                 }
    //             });

    //             // Process incomes
    //             incomes.forEach(income => {
    //                 const { created_date, sub_total_income } = income;
    //                 const incomeDate = new Date(created_date);
    //                 const dateKey = type === 'daily'
    //                     ? `${incomeDate.getDate().toString().padStart(2, '0')}-${(incomeDate.getMonth() + 1).toString().padStart(2, '0')}-${incomeDate.getFullYear()}` // DD-MM-YYYY
    //                     : `${incomeDate.toLocaleString('default', { month: 'short' })}-${incomeDate.getFullYear()}`; // Mon-YYYY

    //                 if (!combinedData[dateKey]) {
    //                     combinedData[dateKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
    //                 }
    //                 combinedData[dateKey].income += sub_total_income;
    //             });

    //             // Generate table rows and calculate balances
    //             let previousBalance = 0; // Starting balance
    //             let financialTableRows = ''; // Initialize rows string

    //             Object.keys(combinedData).sort((a, b) => {
    //                 if (type === 'daily') {
    //                     const [dayA, monthA, yearA] = a.split('-').map(Number);
    //                     const [dayB, monthB, yearB] = b.split('-').map(Number);
    //                     return yearA - yearB || monthA - monthB || dayA - dayB;
    //                 } else {
    //                     const [monthA, yearA] = a.split('-');
    //                     const [monthB, yearB] = b.split('-');
    //                     const monthIndexA = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthA);
    //                     const monthIndexB = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthB);
    //                     return yearA - yearB || monthIndexA - monthIndexB;
    //                 }
    //             }).forEach((date, index) => {
    //                 const data = combinedData[date];
    //                 const total = data.income - (data.totalExpense + data.salaryExpense);
    //                 const openingBalance = previousBalance;
    //                 const closingBalance = openingBalance + total;

    //                 previousBalance = closingBalance;

    //                 // Add table row HTML
    //                 financialTableRows += `
    //                     <tr>
    //                         <td>${index + 1}</td>
    //                         <td>${date}</td>
    //                         <td>${openingBalance.toFixed(2)}</td>
    //                         <td>${data.income.toFixed(2)}</td>
    //                         <td>${data.totalExpense.toFixed(2)}</td>
    //                         <td>${data.salaryExpense.toFixed(2)}</td>
    //                         <td>${total.toFixed(2)}</td>
    //                     </tr>`;
    //             });

    //             return financialTableRows;
    //         };

    //         // Generate financial table rows
    //         const financialTableRows = formatTableRows(expenses, incomes, type);

    //         // HTML structure for the print view
    //         const pageSize = selectedPrintSize || 'A4';
    //         const pageOrientation = orientation || 'portrait';
    //         const html = `
    //             <html lang="en">
    //             <head>
    //                 <meta charset="UTF-8">
    //                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //                 <title>Financial Report</title>
    //                 <style>
    //                     @page {
    //                         size: ${pageSize} ${pageOrientation};
    //                         margin: 20mm;
    //                     }
    //                     * {
    //                         font-family: 'Nikosh', sans-serif !important;
    //                         font-size: ${fontSize || '12px'};
    //                     }
    //                     table {
    //                         width: 100%;
    //                         border-collapse: collapse;
    //                     }
    //                     th, td {
    //                         padding: 8px;
    //                         text-align: left;
    //                         border: 1px solid #ddd;
    //                     }
    //                     th {
    //                         background-color: #f2f2f2;
    //                     }
    //                 </style>
    //             </head>
    //             <body>
    //                 <div class="container">
    //                     <h2>Pathshala School & College Financial Overview</h2>
    //                     <h3>GA-75/A, Middle Badda, Dhaka-1212</h3>
    //                     <p>Phone: 01977379479, Mobile: 01977379479</p>
    //                     <p>Email: pathshala@urbanitsolution.com</p>
    //                 </div>
    //                 <div class="container2">
    //                     <p>Receipt No: 829</p>
    //                     <p>Collected By:</p>
    //                     <p>Date: </p>
    //                 </div>
    //                 <div class="container">
    //                     <h3 style="text-decoration: underline;">Financial Overview</h3>
    //                 </div>
    //                 <table>
    //                     <thead>
    //                         <tr>
    //                             <th>SL No.</th>
    //                             <th>Transaction Date</th>
    //                             <th>Opening Balance</th>
    //                             <th>Total Income</th>
    //                             <th>Total Expense</th>
    //                             <th>Salary</th>
    //                             <th>Total</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         ${financialTableRows}
    //                     </tbody>
    //                 </table>
    //             </body>
    //             <script>
    //                 window.print();
    //             </script>
    //             </html>`;

    //         res.send(html); // Send the generated HTML as response
    //     } catch (error) {
    //         console.error('Error in accounts_report_print:', error);
    //         res.status(500).send('Error generating print view');
    //     }
    // },




    accounts_report_print: async (req, res) => {
        try {
            const { orientation, selectedPrintSize, fontSize, expenses, incomes, type, yearName } = req.body;

            const formatTableRows = (expenses, incomes, type) => {
                // const combinedData = {};
                // const currentDate = new Date();
                // const currentYear = currentDate.getFullYear();
                // const year = yearName === currentYear.toString() ? currentYear : parseInt(yearName);

                // if (type === 'daily') {
                //     // Determine the first day of the year
                //     const firstDayOfYear = new Date(year, 0, 1);
                //     const daysDiff = Math.ceil((currentDate - firstDayOfYear) / (1000 * 60 * 60 * 24));

                //     for (let day = 0; day <= daysDiff; day++) {
                //         const date = new Date(firstDayOfYear);
                //         date.setDate(day + 1);
                //         const dateKey = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${year}`; // DD-MM-YYYY
                //         combinedData[dateKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
                //     }
                // } 


                // else if (type === 'monthly') {
                //     const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                //     const currentMonth = Math.min(currentDate.getMonth(), 11); // Ensure we don't exceed the array length

                //     for (let monthIndex = 0; monthIndex <= currentMonth; monthIndex++) {
                //         const monthKey = `${allMonths[monthIndex]}-${year}`; // Format Mon-YYYY
                //         combinedData[monthKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
                //     }
                // }
                const combinedData = {};
                const year = parseFloat(yearName); // Assuming yearName is defined somewhere in your code
                const currentYear = new Date().getFullYear(); // Get the current year
                const currentDate = new Date(); // Get the current date
                const startDate = new Date(year, 0, 1); // January 1st of the specified year
                const endDate = new Date(year, 11, 31); // December 31st of the specified year

                if (type === 'daily') {
                    // Check if the specified year is the current year
                    if (year === currentYear) {
                        // Initialize daily data from January 1st to the current date
                        for (let day = new Date(year, 0, 1); day <= currentDate; day.setDate(day.getDate() + 1)) {
                            const dateKey = `${day.getDate().toString().padStart(2, '0')}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${year}`; // DD-MM-YYYY
                            combinedData[dateKey] = {
                                income: 0,
                                totalExpense: 0,
                                salaryExpense: 0,
                            };
                        }
                    } else {
                        // If the specified year is not the current year, load all days of that year
                        for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
                            const dateKey = `${day.getDate().toString().padStart(2, '0')}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${year}`; // DD-MM-YYYY
                            combinedData[dateKey] = {
                                income: 0,
                                totalExpense: 0,
                                salaryExpense: 0,
                            };
                        }
                    }
                } else if (type === 'monthly') {
                    const allMonths = [
                        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                    ];

                    // Initialize combinedData with all months and zeros for monthly
                    allMonths.forEach((month, index) => {
                        const monthKey = `${month}-${year}`; // Format Mon-YYYY
                        if (year === currentYear && index > currentDate.getMonth()) {
                            // If the year is the current year, skip months after the current month
                            return;
                        }
                        combinedData[monthKey] = {
                            income: 0,
                            totalExpense: 0,
                            salaryExpense: 0,
                        };
                    });
                }
                // Process expenses
                expenses.forEach(expense => {
                    const { created_date, sub_total_expense, expense_category } = expense;
                    const expenseDate = new Date(created_date);
                    const dateKey = type === 'daily'
                        ? `${expenseDate.getDate().toString().padStart(2, '0')}-${(expenseDate.getMonth() + 1).toString().padStart(2, '0')}-${expenseDate.getFullYear()}` // DD-MM-YYYY
                        : `${expenseDate.toLocaleString('default', { month: 'short' })}-${expenseDate.getFullYear()}`; // Mon-YYYY

                    if (!combinedData[dateKey]) {
                        combinedData[dateKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
                    }
                    if (expense_category === "Salary") {
                        combinedData[dateKey].salaryExpense += sub_total_expense;
                    } else {
                        combinedData[dateKey].totalExpense += sub_total_expense;
                    }
                });

                // Process incomes
                incomes.forEach(income => {
                    const { created_date, sub_total_income } = income;
                    const incomeDate = new Date(created_date);
                    const dateKey = type === 'daily'
                        ? `${incomeDate.getDate().toString().padStart(2, '0')}-${(incomeDate.getMonth() + 1).toString().padStart(2, '0')}-${incomeDate.getFullYear()}` // DD-MM-YYYY
                        : `${incomeDate.toLocaleString('default', { month: 'short' })}-${incomeDate.getFullYear()}`; // Mon-YYYY

                    if (!combinedData[dateKey]) {
                        combinedData[dateKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
                    }
                    combinedData[dateKey].income += sub_total_income;
                });

                // Generate table rows and calculate balances
                let previousBalance = 0; // Starting balance
                let financialTableRows = ''; // Initialize rows string

                Object.keys(combinedData).sort((a, b) => {
                    if (type === 'daily') {
                        const [dayA, monthA, yearA] = a.split('-').map(Number);
                        const [dayB, monthB, yearB] = b.split('-').map(Number);
                        return yearA - yearB || monthA - monthB || dayA - dayB;
                    } else {
                        const [monthA, yearA] = a.split('-');
                        const [monthB, yearB] = b.split('-');
                        const monthIndexA = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthA);
                        const monthIndexB = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthB);
                        return yearA - yearB || monthIndexA - monthIndexB;
                    }
                }).forEach((date, index) => {
                    const data = combinedData[date];
                    const total = data.income - (data.totalExpense + data.salaryExpense);
                    const openingBalance = previousBalance;
                    const closingBalance = openingBalance + total;

                    previousBalance = closingBalance;

                    // Add table row HTML
                    financialTableRows += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${date}</td>
                            <td>${openingBalance.toFixed(2)}</td>
                            <td>${data.income.toFixed(2)}</td>
                            <td>${data.totalExpense.toFixed(2)}</td>
                            <td>${data.salaryExpense.toFixed(2)}</td>
                            <td>${total.toFixed(2)}</td>
                        </tr>`;
                });

                return financialTableRows;
            };

            // Generate financial table rows
            const financialTableRows = formatTableRows(expenses, incomes, type);

            // HTML structure for the print view
            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';
            const html = `
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Financial Report</title>
                    <style>
                        @page {
                            size: ${pageSize} ${pageOrientation};
                            margin: 20mm;
                        }
                        * {
                            font-family: 'Nikosh', sans-serif !important;
                            font-size: ${fontSize || '12px'};
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
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Pathshala School & College Financial Overview</h2>
                        <h3>GA-75/A, Middle Badda, Dhaka-1212</h3>
                        <p>Phone: 01977379479, Mobile: 01977379479</p>
                        <p>Email: pathshala@urbanitsolution.com</p>
                    </div>
                    <div class="container2">
                        <p>Receipt No: 829</p>
                        <p>Collected By:</p>
                        <p>Date: </p>
                    </div>
                    <div class="container">
                        <h3 style="text-decoration: underline;">Financial Overview</h3>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>SL No.</th>
                                <th>Transaction Date</th>
                                <th>Opening Balance</th>
                                <th>Total Income</th>
                                <th>Total Expense</th>
                                <th>Salary</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${financialTableRows}
                        </tbody>
                    </table>
                </body>
                <script>
                    window.print();
                </script>
                </html>`;

            res.send(html); // Send the generated HTML as response
        } catch (error) {
            console.error('Error in accounts_report_print:', error);
            res.status(500).send('Error generating print view');
        }
    },



    accounts_report_pdf: async (req, res) => {
        try {
            const { orientation, selectedPrintSize, fontSize, expenses, incomes, type, yearName } = req.body;

            // Helper function to format table rows based on type (daily/monthly)
            const formatTableRows = (expenses, incomes, type) => {
                // const combinedData = {};
                // const year = yearName;

                // // Initialize combinedData with zero values based on type
                // if (type === 'daily') {
                //     for (let day = 1; day <= 365; day++) {
                //         const date = new Date(year, 0);
                //         date.setDate(day);
                //         const dateKey = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${year}`; // DD-MM-YYYY
                //         combinedData[dateKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
                //     }
                // } else if (type === 'monthly') {
                //     const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                //     allMonths.forEach((month) => {
                //         const monthKey = `${month}-${year}`; // Format Mon-YYYY
                //         combinedData[monthKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
                //     });
                // }
                const combinedData = {};
                const year = parseFloat(yearName); // Assuming yearName is defined somewhere in your code
                const currentYear = new Date().getFullYear(); // Get the current year
                const currentDate = new Date(); // Get the current date
                const startDate = new Date(year, 0, 1); // January 1st of the specified year
                const endDate = new Date(year, 11, 31); // December 31st of the specified year

                if (type === 'daily') {
                    // Check if the specified year is the current year
                    if (year === currentYear) {
                        // Initialize daily data from January 1st to the current date
                        for (let day = new Date(year, 0, 1); day <= currentDate; day.setDate(day.getDate() + 1)) {
                            const dateKey = `${day.getDate().toString().padStart(2, '0')}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${year}`; // DD-MM-YYYY
                            combinedData[dateKey] = {
                                income: 0,
                                totalExpense: 0,
                                salaryExpense: 0,
                            };
                        }
                    } else {
                        // If the specified year is not the current year, load all days of that year
                        for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
                            const dateKey = `${day.getDate().toString().padStart(2, '0')}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${year}`; // DD-MM-YYYY
                            combinedData[dateKey] = {
                                income: 0,
                                totalExpense: 0,
                                salaryExpense: 0,
                            };
                        }
                    }
                } else if (type === 'monthly') {
                    const allMonths = [
                        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                    ];

                    // Initialize combinedData with all months and zeros for monthly
                    allMonths.forEach((month, index) => {
                        const monthKey = `${month}-${year}`; // Format Mon-YYYY
                        if (year === currentYear && index > currentDate.getMonth()) {
                            // If the year is the current year, skip months after the current month
                            return;
                        }
                        combinedData[monthKey] = {
                            income: 0,
                            totalExpense: 0,
                            salaryExpense: 0,
                        };
                    });
                }
                // Process expenses
                expenses.forEach(expense => {
                    const { created_date, sub_total_expense, expense_category } = expense;
                    const expenseDate = new Date(created_date);
                    const dateKey = type === 'daily'
                        ? `${expenseDate.getDate().toString().padStart(2, '0')}-${(expenseDate.getMonth() + 1).toString().padStart(2, '0')}-${expenseDate.getFullYear()}` // DD-MM-YYYY
                        : `${expenseDate.toLocaleString('default', { month: 'short' })}-${expenseDate.getFullYear()}`; // Mon-YYYY

                    if (!combinedData[dateKey]) {
                        combinedData[dateKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
                    }
                    if (expense_category === "Salary") {
                        combinedData[dateKey].salaryExpense += sub_total_expense;
                    } else {
                        combinedData[dateKey].totalExpense += sub_total_expense;
                    }
                });

                // Process incomes
                incomes.forEach(income => {
                    const { created_date, sub_total_income } = income;
                    const incomeDate = new Date(created_date);
                    const dateKey = type === 'daily'
                        ? `${incomeDate.getDate().toString().padStart(2, '0')}-${(incomeDate.getMonth() + 1).toString().padStart(2, '0')}-${incomeDate.getFullYear()}` // DD-MM-YYYY
                        : `${incomeDate.toLocaleString('default', { month: 'short' })}-${incomeDate.getFullYear()}`; // Mon-YYYY

                    if (!combinedData[dateKey]) {
                        combinedData[dateKey] = { income: 0, totalExpense: 0, salaryExpense: 0 };
                    }
                    combinedData[dateKey].income += sub_total_income;
                });

                // Generate table rows and calculate balances
                let previousBalance = 0; // Starting balance
                let financialTableRows = ''; // Initialize rows string

                Object.keys(combinedData).sort((a, b) => {
                    if (type === 'daily') {
                        const [dayA, monthA, yearA] = a.split('-').map(Number);
                        const [dayB, monthB, yearB] = b.split('-').map(Number);
                        return yearA - yearB || monthA - monthB || dayA - dayB;
                    } else {
                        const [monthA, yearA] = a.split('-');
                        const [monthB, yearB] = b.split('-');
                        const monthIndexA = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthA);
                        const monthIndexB = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthB);
                        return yearA - yearB || monthIndexA - monthIndexB;
                    }
                }).forEach((date, index) => {
                    const data = combinedData[date];
                    const total = data.income - (data.totalExpense + data.salaryExpense);
                    const openingBalance = previousBalance;
                    const closingBalance = openingBalance + total;

                    previousBalance = closingBalance;

                    // Add table row HTML
                    financialTableRows += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${date}</td>
                            <td>${openingBalance.toFixed(2)}</td>
                            <td>${data.income.toFixed(2)}</td>
                            <td>${data.totalExpense.toFixed(2)}</td>
                            <td>${data.salaryExpense.toFixed(2)}</td>
                            <td>${total.toFixed(2)}</td>
                        </tr>`;
                });

                return financialTableRows;
            };

            // Generate financial table rows
            const financialTableRows = formatTableRows(expenses, incomes, type);

            // HTML structure for the print view
            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';
            const html = `
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Financial Report</title>
                <style>
                    @page {
                        size: ${pageSize} ${pageOrientation};
                        margin: 20mm;
                    }
                    * {
                        font-family: 'Nikosh', sans-serif !important;
                        font-size: ${fontSize || '12px'};
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
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Pathshala School & College Financial Overview</h2>
                    <h3>GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p>Phone: 01977379479, Mobile: 01977379479</p>
                    <p>Email: pathshala@urbanitsolution.com</p>
                </div>
                <div class="container2">
                    <p>Receipt No: 829</p>
                    <p>Collected By:</p>
                    <p>Date: </p>
                </div>
                <div class="container">
                    <h3 style="text-decoration: underline;">Financial Overview</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>SL No.</th>
                            <th>Transaction Date</th>
                            <th>Opening Balance</th>
                            <th>Total Income</th>
                            <th>Total Expense</th>
                            <th>Salary</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${financialTableRows}
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
            console.error('Error in general_ledgers_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },




    trail_balance_print: async (req, res) => {
        try {
            const {
                orientation, selectedPrintSize, fontSize,
                searchResults, salarySearch, incomeSearch, subTotal, subTotalIncome, subTotalSalary
            } = req.body;

            // Generate the financial tables
            let financialTableRows = '';
            const getMonthNames = (dateString) => {
                const date = new Date(dateString);
                return date.toLocaleString('en-US', { month: 'long' });
            }

            // HTML structure for income table
            if (incomeSearch?.length > 0) {
                financialTableRows += `
                    <h3 style="text-decoration: underline;">Income Overview</h3>
                    <table>
                        <thead>
                            <tr class="report-bg w-100">
                                <th>SL</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Voucher Id</th>
                                <th>Paid By</th>
                            </tr>
                        </thead>
                        <tbody>`;
                incomeSearch.forEach((income, i) => {
                    financialTableRows += `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${income.income_name}</td>
                            <td>${income?.income_date?.slice(0, 10)}</td>
                            <td>${income.sub_total}</td>
                            <td>${income.voucher_id}</td>
                            <td>${income.account_head_name}</td>
                        </tr>`;
                });
                financialTableRows += `
                    <tr>
                        <td colspan="3"><strong>Total Income:</strong></td>
                        <td>${subTotalIncome.toLocaleString()}</td>
                        <td colspan="2"></td>
                    </tr>
                    </tbody>
                    </table>`;
            }

            // HTML structure for expense table
            if (searchResults?.length > 0) {
                financialTableRows += `
                    <h3 style="text-decoration: underline;">Expense Overview</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>SL</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Voucher Id</th>
                                <th>Paid By</th>
                            </tr>
                        </thead>
                        <tbody>`;
                searchResults.forEach((expense, i) => {
                    financialTableRows += `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${expense.expense_name}</td>
                            <td>${expense?.expense_date?.slice(0, 10)}</td>
                            <td>${expense.sub_total}</td>
                            <td>${expense.voucher_id}</td>
                            <td>${expense.account_head_name}</td>
                        </tr>`;
                });
                financialTableRows += `
                    <tr>
                        <td colspan="3"><strong>Total Expense:</strong></td>
                        <td>${subTotal.toLocaleString()}</td>
                        <td colspan="2"></td>
                    </tr>
                    </tbody>
                    </table>`;
            }

            // HTML structure for salary table
            if (salarySearch?.length > 0) {
                financialTableRows += `
                    <h3 style="text-decoration: underline;">Salary Overview</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>SL</th>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Invoice</th>
                                <th>Month</th>
                                <th>Amount</th>
                                <th>Paid By</th>
                            </tr>
                        </thead>
                        <tbody>`;
                salarySearch.forEach((salary, i) => {
                    financialTableRows += `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${salary?.salary_date?.slice(0, 10)}</td>
                            <td>${salary.employee_name}</td>
                            <td>${salary.invoice_number || ''}</td>
                            <td>${getMonthNames(salary.salary_month)}</td>
                            <td>${salary.paid_amount}</td>
                            <td>${salary.account_head_name}</td>
                        </tr>`;
                });
                financialTableRows += `
                    <tr>
                        <td colspan="5"><strong>Total Salary:</strong></td>
                        <td>${subTotalSalary.toLocaleString()}</td>
                        <td colspan="2"></td>
                    </tr>
                    </tbody>
                    </table>`;
            }

            // HTML structure for the print view
            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';
            const html = `
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Financial Report</title>
                    <style>
                        @page {
                            size: ${pageSize} ${pageOrientation};
                            margin: 20mm;
                        }
                        * {
                            font-family: 'Nikosh', sans-serif !important;
                            font-size: ${fontSize || '12px'};
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
                        <h2>Pathshala School & College Financial Overview</h2>
                        <h3>GA-75/A, Middle Badda, Dhaka-1212</h3>
                        <p>Phone: 01977379479, Mobile: 01977379479</p>
                        <p>Email: pathshala@urbanitsolution.com</p>
                    </div>
                    <div class="container2">
                        <p>Receipt No: 829</p>
                        <p>Collected By:</p>
                        <p>Date: </p>
                    </div>
                    <div class='container'>
                        <h3 style="text-decoration: underline;">Financial Overview</h3>
                    </div>
                    ${financialTableRows}
                </body>
                <script>
                    window.print();
                </script>
                </html>`;

            res.send(html); // Send the generated HTML as a response
        } catch (error) {
            console.error('Error in trail_balance_print:', error);
            res.status(500).send('Error generating print view');
        }
    },

    trail_balance_pdf: async (req, res) => {
        try {
            const { orientation, selectedPrintSize, fontSize,
                searchResults, salarySearch, incomeSearch, subTotal, subTotalIncome, subTotalSalary } = req.body;

            let financialTableRows = '';
            const getMonthNames = (dateString) => {
                const date = new Date(dateString);
                return date.toLocaleString('en-US', { month: 'long' });
            }

            // HTML structure for income table
            if (incomeSearch?.length > 0) {
                financialTableRows += `
                        <h3 style="text-decoration: underline;">Income Overview</h3>
                        <table>
                            <thead>
                                <tr class="report-bg w-100">
                                    <th>SL</th>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Voucher Id</th>
                                    <th>Paid By</th>
                                </tr>
                            </thead>
                            <tbody>`;
                incomeSearch.forEach((income, i) => {
                    financialTableRows += `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${income.income_name}</td>
                                <td>${income?.income_date?.slice(0, 10)}</td>
                                <td>${income.sub_total}</td>
                                <td>${income.voucher_id}</td>
                                <td>${income.account_head_name}</td>
                            </tr>`;
                });
                financialTableRows += `
                        <tr>
                            <td colspan="3"><strong>Total Income:</strong></td>
                            <td>${subTotalIncome.toLocaleString()}</td>
                            <td colspan="2"></td>
                        </tr>
                        </tbody>
                        </table>`;
            }

            // HTML structure for expense table
            if (searchResults?.length > 0) {
                financialTableRows += `
                        <h3 style="text-decoration: underline;">Expense Overview</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>SL</th>
                                    <th>Name</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Voucher Id</th>
                                    <th>Paid By</th>
                                </tr>
                            </thead>
                            <tbody>`;
                searchResults.forEach((expense, i) => {
                    financialTableRows += `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${expense.expense_name}</td>
                                <td>${expense?.expense_date?.slice(0, 10)}</td>
                                <td>${expense.sub_total}</td>
                                <td>${expense.voucher_id}</td>
                                <td>${expense.account_head_name}</td>
                            </tr>`;
                });
                financialTableRows += `
                        <tr>
                            <td colspan="3"><strong>Total Expense:</strong></td>
                            <td>${subTotal.toLocaleString()}</td>
                            <td colspan="2"></td>
                        </tr>
                        </tbody>
                        </table>`;
            }

            // HTML structure for salary table
            if (salarySearch?.length > 0) {
                financialTableRows += `
                        <h3 style="text-decoration: underline;">Salary Overview</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>SL</th>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Invoice</th>
                                    <th>Month</th>
                                    <th>Amount</th>
                                    <th>Paid By</th>
                                </tr>
                            </thead>
                            <tbody>`;
                salarySearch.forEach((salary, i) => {
                    financialTableRows += `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${salary?.salary_date?.slice(0, 10)}</td>
                                <td>${salary.employee_name}</td>
                                <td>${salary.invoice_number || ''}</td>
                                <td>${getMonthNames(salary.salary_month)}</td>
                                <td>${salary.paid_amount}</td>
                                <td>${salary.account_head_name}</td>
                            </tr>`;
                });
                financialTableRows += `
                        <tr>
                            <td colspan="5"><strong>Total Salary:</strong></td>
                            <td>${subTotalSalary.toLocaleString()}</td>
                            <td colspan="2"></td>
                        </tr>
                        </tbody>
                        </table>`;
            }

            // HTML structure for the print view
            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';
            const html = `
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Financial Report</title>
                        <style>
                            @page {
                                size: ${pageSize} ${pageOrientation};
                                margin: 20mm;
                            }
                            * {
                                font-family: 'Nikosh', sans-serif !important;
                                font-size: ${fontSize || '12px'};
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
                            <h2>Pathshala School & College Financial Overview</h2>
                            <h3>GA-75/A, Middle Badda, Dhaka-1212</h3>
                            <p>Phone: 01977379479, Mobile: 01977379479</p>
                            <p>Email: pathshala@urbanitsolution.com</p>
                        </div>
                        <div class="container2">
                            <p>Receipt No: 829</p>
                            <p>Collected By:</p>
                            <p>Date: </p>
                        </div>
                        <div class='container'>
                            <h3 style="text-decoration: underline;">Financial Overview</h3>
                        </div>
                        ${financialTableRows}
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
            console.error('Error in general_ledgers_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },


}
module.exports = AccountReportModel