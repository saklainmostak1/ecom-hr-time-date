const connection = require('../../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');
const crypto = require('crypto');

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

const QuotationModel = {


    quotation_current_date_count: async (req, res) => {
        // try {
        //     const data = "SELECT COUNT(*) AS count FROM quotation WHERE DATE(created_date) = CURDATE()";

        //     connection.query(data, function (error, result) {
        //         if (error) {
        //             console.log(error);
        //             res.status(500).send({ message: 'An error occurred' });
        //         } else {
        //             console.log(result);
        //             res.send(result);
        //         }
        //     });
        // } catch (error) {
        //     console.log(error);
        //     res.status(500).send({ message: 'An unexpected error occurred' });
        // }
        // try {
        //     const data = `
        //     SELECT 
        //         (COUNT(CASE WHEN DATE(created_date) = CURDATE() THEN 1 END) + 1) AS count_today,
        //         (COUNT(CASE WHEN DATE(created_date) = CURDATE() + INTERVAL 1 DAY THEN 1 END) + 1) AS count_tomorrow
        //     FROM quotation
        // `;

        //     connection.query(data, function (error, result) {
        //         if (error) {
        //             console.log(error);
        //             res.status(500).send({ message: 'An error occurred' });
        //         } else {
        //             console.log(result);
        //             res.send(result);
        //         }
        //     });
        // } catch (error) {
        //     console.log(error);
        //     res.status(500).send({ message: 'An unexpected error occurred' });
        // }
        try {
            const data = `
                SELECT 
                    (COUNT(CASE WHEN DATE(created_date) = CURDATE() THEN 1 END) + 1) AS count_today,
                    (COUNT(CASE WHEN DATE(created_date) = CURDATE() + INTERVAL 1 DAY THEN 1 END) + 1) AS count_tomorrow
                FROM quotation
            `;

            connection.query(data, function (error, result) {
                if (error) {
                    console.log(error);
                    res.status(500).send({ message: 'An error occurred' });
                } else {
                    // Format counts as two-digit numbers
                    const formattedResult = {
                        count_today: result[0].count_today.toString().padStart(2, '0'),
                        count_tomorrow: result[0].count_tomorrow.toString().padStart(2, '0')
                    };

                    console.log(formattedResult);
                    res.send(formattedResult);
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'An unexpected error occurred' });
        }
    },

    purchase_product_list: async (req, res) => {
        try {
            const data = "select * from  purchase_product";

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
    purchase_product_list_ware_house: async (req, res) => {
        try {
            const query = `
                SELECT 
                    id, 
                    product_id, 
                    SUM(quantity) AS total_quantity,
                    GROUP_CONCAT(DISTINCT ware_house_id) AS ware_house_ids
                FROM 
                    purchase_product
                GROUP BY 
                    product_id
            `;

            connection.query(query, function (error, result) {
                if (!error) {
                    // Format the result if needed
                    const formattedResult = result.map(item => ({
                        id: item.id,
                        product_id: item.product_id,
                        total_quantity: item.total_quantity,
                        ware_house_ids: item.ware_house_ids ? item.ware_house_ids.split(',') : []
                    }));

                    res.send(formattedResult);
                } else {
                    console.error("Database Error:", error);
                    res.status(500).send({ error: "Database query failed" });
                }
            });
        } catch (error) {
            console.error("Server Error:", error);
            res.status(500).send({ error: "Internal server error" });
        }
    },

    quotation_product_list: async (req, res) => {
        try {
            const data = "select * from  quotation_product";

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

    quotation_create: async (req, res) => {
        try {
            let {
                searchResults,
                assetInfo,
                selectedOptionUsers,
                created
            } = req.body;

            console.log(searchResults);
            const hashedPassword = crypto.createHash('sha1').update(assetInfo.mobile).digest('hex');
            const saleDate = assetInfo.quotation_date || new Date().toISOString().slice(0, 19).replace('T', ' '); // Format as 'YYYY-MM-DD HH:mm:ss'
            // Begin the transaction
            await new Promise((resolve, reject) => connection.beginTransaction(err => (err ? reject(err) : resolve())));
            let userId;
            if (selectedOptionUsers === '') {
                const checkUserQuery = `SELECT id FROM users WHERE mobile = ?`;
                const [existingUser] = await new Promise((resolve, reject) => {
                    connection.query(checkUserQuery, [assetInfo.mobile], (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                });


                if (existingUser) {
                    // Use the existing user's ID if found
                    userId = existingUser.id;
                } else {
                    // Insert a new user if not found
                    const insertUserQuery = `
            INSERT INTO users (
                full_name, email, mobile, password, created_by
            ) VALUES (?, ?, ?, ?, ?)
        `;
                    const userParam = [
                        assetInfo.full_name ? assetInfo.full_name : assetInfo.mobile, assetInfo.email, assetInfo.mobile, hashedPassword, assetInfo.created_by
                    ];

                    const [usersResult] = await new Promise((resolve, reject) => {
                        connection.query(insertUserQuery, userParam, (err, results) => {
                            if (err) return reject(err);
                            resolve([results]);
                        });
                    });

                    userId = usersResult.insertId;
                }
            }
            // Check if the mobile number already exists in the users table

            const insertPurchaseQuery = `
                INSERT INTO quotation (
                    total_amount, discount, due, paid_amount, 
                    quotation_date, invoice_id, sale_type, payable_amount, remarks, account, user_id, created_by, previous_due
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const userParams = [
                assetInfo.total_amount, assetInfo.discount, assetInfo.due, assetInfo.paid_amount, saleDate, assetInfo.invoice_id, 1, assetInfo.payable_amount, assetInfo.remarks, assetInfo.account, userId ? userId : selectedOptionUsers, created, assetInfo.previous_due
            ];

            // Insert into the sale table
            const [purchaseResult] = await new Promise((resolve, reject) => {
                connection.query(insertPurchaseQuery, userParams, (err, results) => {
                    if (err) return reject(err);
                    resolve([results]);
                });
            });

            const purchaseId = purchaseResult.insertId;

            // Insert each product in searchResults into the sale_product table
            const insertProductQuery = `
                INSERT INTO quotation_product (
                    product_id, ware_house_id, quantity, sale_price, created_by, sale_id, discount
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            // Loop through each field in searchResults array and insert it
            for (let field of searchResults) {
                const { product_id, ware_house_id, new_quantity, new_sale_price, new_discount } = field;
                const productParams = [product_id, ware_house_id, new_quantity, new_sale_price, created, purchaseId, new_discount];

                await new Promise((resolve, reject) => {
                    connection.query(insertProductQuery, productParams, (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                });
            }

            // Commit the transaction
            await new Promise((resolve, reject) => connection.commit(err => (err ? reject(err) : resolve())));

            res.status(200).json({ message: 'Purchase created successfully' });
        } catch (error) {
            console.error("Error inserting data:", error);

            // Rollback the transaction on error
            await new Promise((resolve, reject) => connection.rollback(err => (err ? reject(err) : resolve())));

            res.status(500).json({ message: "Error inserting data." });
        }
    },

    quotation_edit: async (req, res) => {
        try {
            const { assetInfo } = req.body;

            console.log(assetInfo);

            // Hash the password
            const hashedPassword = crypto.createHash('sha1').update(assetInfo.mobile).digest('hex');

            // Begin the transaction
            await new Promise((resolve, reject) =>
                connection.beginTransaction(err => (err ? reject(err) : resolve()))
            );

            // Check if the mobile number already exists in the users table
            const checkUserQuery = `SELECT id FROM users WHERE mobile = ?`;
            const existingUser = await new Promise((resolve, reject) => {
                connection.query(checkUserQuery, [assetInfo.mobile], (err, results) => {
                    if (err) return reject(err);
                    resolve(results); // Return the full result set (array)
                });
            });

            let userId;

            if (existingUser.length > 0) {
                // Update user if exists
                const updateUserQuery = `
                    UPDATE users SET 
                        full_name = ?, email = ?, mobile = ?, password = ?, created_by = ? 
                    WHERE id = ?
                `;
                const userParams = [
                    assetInfo.full_name, assetInfo.email, assetInfo.mobile, hashedPassword, assetInfo.modified_by, assetInfo.user_id
                ];

                await new Promise((resolve, reject) => {
                    connection.query(updateUserQuery, userParams, (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                });

                userId = existingUser[0].id; // Use the existing user ID
            } else {
                // Insert a new user if not found
                const insertUserQuery = `
                    INSERT INTO users (
                        full_name, email, mobile, password, created_by
                    ) VALUES (?, ?, ?, ?, ?)
                `;
                const userParams = [
                    assetInfo.full_name, assetInfo.email, assetInfo.mobile, hashedPassword, assetInfo.modified_by
                ];

                const usersResult = await new Promise((resolve, reject) => {
                    connection.query(insertUserQuery, userParams, (err, results) => {
                        if (err) return reject(err);
                        resolve(results); // Return the results of the insert query
                    });
                });

                userId = usersResult.insertId; // Get the inserted ID
            }

            // Update the sale information
            const updateSaleQuery = `
                UPDATE quotation SET 
                    total_amount = ?, discount = ?, due = ?, paid_amount = ?, 
                    quotation_date = ?, invoice_id = ?, sale_type = ?, payable_amount = ?, 
                    remarks = ?, account = ?, user_id = ?, modified_by = ?
                WHERE id = ?
            `;
            const saleParams = [
                assetInfo.total_amount, assetInfo.discount, assetInfo.due, assetInfo.paid_amount,
                assetInfo.quotation_date, assetInfo.invoice_id, 1, assetInfo.payable_amount,
                assetInfo.remarks, assetInfo.account, userId, assetInfo.modified_by, req.params.id
            ];

            await new Promise((resolve, reject) => {
                connection.query(updateSaleQuery, saleParams, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });

            // Delete existing products from sale_product
            const deleteProductQuery = `DELETE FROM quotation_product WHERE sale_id = ?`;
            await new Promise((resolve, reject) => {
                connection.query(deleteProductQuery, [req.params.id], (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });

            // Insert new products into sale_product
            const insertProductQuery = `
                INSERT INTO quotation_product (
                    product_id, ware_house_id, quantity, sale_price, created_by, discount, sale_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            for (let field of assetInfo.fields) {
                const { product_id, ware_house_ids, quantity, sale_price, discount, new_discount } = field;
                const productParams = [product_id, ware_house_ids, quantity, sale_price, assetInfo.modified_by, discount ? discount : new_discount, req.params.id];

                await new Promise((resolve, reject) => {
                    connection.query(insertProductQuery, productParams, (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                });
            }

            // Commit the transaction
            await new Promise((resolve, reject) =>
                connection.commit(err => (err ? reject(err) : resolve()))
            );

            res.status(200).json({ message: 'Sale updated successfully' });
        } catch (error) {
            console.error('Error updating data:', error);

            // Rollback the transaction on error
            await new Promise((resolve, reject) =>
                connection.rollback(err => (err ? reject(err) : resolve()))
            );

            res.status(500).json({ message: 'Error updating data.' });
        }
    },



    quotation_single: async (req, res) => {
        const purchaseId = req.params.id; // Assuming the purchase ID is passed as a route parameter

        try {
            const query = `
               SELECT s.*, 
                        sp.id AS product_sale_id, 
                        sp.product_id AS product_id, 
                        sp.discount AS sp_discount, 
                        sp.ware_house_id AS ware_house_id, 
                        sp.quantity AS product_quantity, 
                        sp.sale_price AS product_sale_price, 
                        sp.created_by AS product_created_by, 
                        sp.created_date AS product_created_date, 
                        sp.modified_by AS product_modified_by, 
                        sp.modified_date AS product_modified_date,
                        pr.product_name AS product_name,
                        LPAD(pr.barcode, 13, '0') AS barcode,
                        sa.name AS supplier_name,
                        pt.name AS purchase_type_name,
                        u.full_name AS full_name,
                        u.email AS email,
                        u.mobile AS mobile
                    FROM quotation s
                    LEFT JOIN quotation_product sp ON s.id = sp.sale_id
                    LEFT JOIN product pr ON sp.product_id = pr.id
                    LEFT JOIN supplier_address sa ON s.supplier_id = sa.id
                    LEFT JOIN purchase_type pt ON s.sale_type = pt.id
                    LEFT JOIN users u ON s.user_id = u.id
                WHERE s.id = ? 
            `;

            connection.query(query, [purchaseId], function (error, results) {
                if (error) {
                    console.log(error);
                    return res.status(500).send({ error: 'Database query failed.' });
                }

                const purchases = results.reduce((acc, row) => {
                    let purchase = acc.find(p => p.id === row.id);
                    if (!purchase) {
                        purchase = {
                            id: row.id,
                            supplier_id: row.supplier_id,
                            account: row.account,
                            remarks: row.remarks,
                            previous_due: row.previous_due,
                            user_id: row.user_id,
                            full_name: row.full_name,
                            email: row.email,
                            mobile: row.mobile,
                            payable_amount: row.payable_amount,
                            supplier_name: row.supplier_name,
                            product_id: row.product_id,
                            product_name: row.product_name,
                            quantity: row.quantity,
                            sale_price: row.sale_price,
                            total_amount: row.total_amount,
                            discount: row.discount,
                            due: row.due,
                            paid_amount: row.paid_amount,
                            quotation_date: row.quotation_date,
                            invoice_id: row.invoice_id,
                            purchase_type: row.purchase_type,
                            purchase_type_name: row.purchase_type_name,
                            created_by: row.created_by,
                            modified_by: row.modified_by,
                            created_date: row.created_date,
                            modified_date: row.modified_date,
                            sale_product: [],
                        };
                        acc.push(purchase);
                    }

                    // Find if this product already exists in sale_product array
                    let saleProduct = purchase.sale_product.find(sp => sp.id === row.product_sale_id);

                    if (!saleProduct) {
                        saleProduct = {
                            id: row.product_sale_id,
                            product_id: row.product_id,
                            discount: row.sp_discount,
                            ware_house_ids: [], // Initialize as an array
                            barcode: row.barcode,
                            product_name: row.product_name,
                            quantity: row.product_quantity,
                            unit_id: row.product_unit_id,
                            unit_name: row.unit_name,
                            purchase_price: row.product_purchase_price,
                            sale_price: row.product_sale_price,
                            created_by: row.product_created_by,
                            created_date: row.product_created_date,
                            modified_by: row.product_modified_by,
                            modified_date: row.product_modified_date
                        };
                        purchase.sale_product.push(saleProduct);
                    }

                    // Add the ware_house_id to the array if it doesn't already exist
                    if (!saleProduct.ware_house_ids.includes(row.ware_house_id)) {
                        saleProduct.ware_house_ids.push(row.ware_house_id);
                    }

                    return acc;
                }, []);

                res.send(purchases);
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'An error occurred while fetching purchase data.' });
        }
    },


    quotation_list: async (req, res) => {
        try {
            // Query to join purchase with purchase_product, purchase_item, product, supplier_address, unit, and purchase_type
            const query = `
                                    SELECT s.*, 
                        sp.id AS product_sale_id, 
                        sp.product_id AS product_id, 
                        sp.quantity AS product_quantity, 
                        sp.discount AS sp_discount, 
                        sp.sale_price AS product_sale_price, 
                        sp.created_by AS product_created_by, 
                        sp.created_date AS product_created_date, 
                        sp.modified_by AS product_modified_by, 
                        sp.modified_date AS product_modified_date,
                        pr.product_name AS product_name,
                        sa.name AS supplier_name,
                        pt.name AS purchase_type_name,
                        u.full_name AS full_name,
                        u.email AS email,
                        u.mobile AS mobile,
                        uc.full_name AS created_by -- User who created the sale/quotation
                    FROM quotation s
                    LEFT JOIN quotation_product sp ON s.id = sp.sale_id
                    LEFT JOIN product pr ON sp.product_id = pr.id
                    LEFT JOIN supplier_address sa ON s.supplier_id = sa.id
                    LEFT JOIN purchase_type pt ON s.sale_type = pt.id
                    LEFT JOIN 
                    users uc ON s.created_by = uc.id -- For the user who created the sale
                    LEFT JOIN users u ON s.user_id = u.id;

            `;

            connection.query(query, function (error, results) {
                if (error) {
                    console.log(error);
                    return res.status(500).send({ error: 'Database query failed.' });
                }

                // Format the result into a structured object
                const purchases = results.reduce((acc, row) => {
                    let purchase = acc.find(p => p.id === row.id);
                    if (!purchase) {
                        purchase = {
                            id: row.id,
                            supplier_id: row.supplier_id,
                            user_id: row.user_id,
                            full_name: row.full_name,
                            previous_due: row.previous_due,
                            email: row.email,
                            mobile: row.mobile,
                            account: row.account,
                            remarks: row.remarks,
                            payable_amount: row.payable_amount,
                            supplier_name: row.supplier_name,
                            product_id: row.product_id,
                            product_name: row.product_name,
                            quantity: row.quantity,
                            sale_price: row.sale_price,
                            total_amount: row.total_amount,
                            discount: row.discount,
                            due: row.due,
                            paid_amount: row.paid_amount,
                            quotation_date: row.quotation_date,
                            invoice_id: row.invoice_id,
                            purchase_type: row.purchase_type,
                            purchase_type_name: row.purchase_type_name,
                            created_by: row.created_by,
                            modified_by: row.modified_by,
                            created_date: row.created_date,
                            modified_date: row.modified_date,
                            sale_product: [],
                        };
                        acc.push(purchase);
                    }


                    purchase.sale_product.push({
                        id: row.product_sale_id,
                        product_id: row.product_id,
                        discount: row.sp_discount,
                        product_name: row.product_name,
                        quantity: row.product_quantity,
                        unit_id: row.product_unit_id,
                        unit_name: row.unit_name,
                        purchase_price: row.product_purchase_price,
                        sale_price: row.product_sale_price,
                        created_by: row.product_created_by,
                        created_date: row.product_created_date,
                        modified_by: row.product_modified_by,
                        modified_date: row.product_modified_date
                    });



                    return acc;
                }, []);

                res.send(purchases);
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'An error occurred while fetching purchase data.' });
        }
    },

    quotation_delete: async (req, res) => {
        try {
            // Delete related sale products
            const deleteSaleProductQuery = 'DELETE FROM quotation_product WHERE sale_id = ?';
            connection.query(deleteSaleProductQuery, [req.params.id], (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Error deleting related products.' });
                }

                // Now delete the sale itself
                const query = 'DELETE FROM quotation WHERE id = ?';
                connection.query(query, [req.params.id], (error, result) => {
                    if (!error && result.affectedRows > 0) {
                        console.log(result);
                        return res.send({ message: 'Sale and related products deleted successfully.' });
                    } else {
                        console.log(error || 'Sale not found');
                        return res.status(404).json({ message: 'Sale not found.' });
                    }
                });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while deleting the sale and related products.' });
        }
    },


    quotation_product_delete: async (req, res) => {

        try {
            const query = 'DELETE FROM quotation_product WHERE id = ?';
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



    quotation_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            let query = `
                    SELECT quotation.*, 
                    users_created.full_name AS created_by,
                    users_modified.full_name AS modified_by,
                    users.full_name AS full_name,
                    users.mobile AS mobile,
                    users.email AS email
                FROM quotation
                LEFT JOIN users AS users_created ON quotation.created_by = users_created.id
                LEFT JOIN users AS users_modified ON quotation.modified_by = users_modified.id
                LEFT JOIN users ON quotation.user_id = users.id
                ORDER BY quotation.id DESC
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






    sales_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            let { barcode } = req.body;

            // Construct the base SQL query
            let sql = `
                SELECT 
                 purchase_product.*, 
                    purchase_product.product_id,
                    GROUP_CONCAT(DISTINCT purchase_product.ware_house_id) AS ware_house_ids,
                    product.product_name, 
                    LPAD(product.barcode, 13, '0') AS barcode, 
                    users_created.full_name AS created_by,
                    users_modified.full_name AS modified_by 
                FROM purchase_product 
                JOIN product ON purchase_product.product_id = product.id
                LEFT JOIN users AS users_created ON purchase_product.created_by = users_created.id 
                LEFT JOIN users AS users_modified ON purchase_product.modified_by = users_modified.id 
                WHERE 1`;

            // Add filters if provided
            if (barcode) {
                sql += ` AND LPAD(product.barcode, 13, '0') LIKE '%${barcode}%'`;
            }

            // Group by product ID to avoid duplicates and order results
            sql += ` GROUP BY purchase_product.product_id
                     ORDER BY purchase_product.id DESC`;

            console.log("SQL Query:", sql);

            // Execute the constructed SQL query
            connection.query(sql, (error, results, fields) => {
                if (error) {
                    console.error("Error occurred during search:", error);
                    res.status(500).json({ error: "An error occurred during search." });
                } else {
                    // Process results to format ware_house_ids as an array
                    const formattedResults = results.map(row => ({
                        ...row,
                        ware_house_ids: row.ware_house_ids.split(',').map(Number) // Convert to array of numbers
                    }));

                    console.log("Search results:", formattedResults);
                    res.status(200).json({ results: formattedResults });
                }
            });
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).json({ error: "An error occurred." });
        }
    },

    quotation_list_search: async (req, res) => {
        try {
            const { toDate, fromDate, product_id, name, mobile, invoice } = req.body;

            // Construct the base SQL query with parameterized placeholders
            let sql = `
                 SELECT s.*, 
                        sp.id AS product_sale_id, 
                        sp.product_id AS product_id, 
                        sp.quantity AS product_quantity, 
                        sp.discount AS sp_discount, 
                        sp.sale_price AS product_sale_price, 
                        sp.created_by AS product_created_by, 
                        sp.created_date AS product_created_date, 
                        sp.modified_by AS product_modified_by, 
                        sp.modified_date AS product_modified_date,
                        pr.product_name AS product_name,
                        LPAD(pr.barcode, 13, '0') AS barcode, 
                        sa.name AS supplier_name,
                        pt.name AS purchase_type_name,
                        u.full_name AS full_name,
                        u.email AS email,
                        u.mobile AS mobile,
                         uc.full_name AS created_by -- User who created the sale/quotation
                    FROM quotation s
                    LEFT JOIN quotation_product sp ON s.id = sp.sale_id
                    LEFT JOIN product pr ON sp.product_id = pr.id
                    LEFT JOIN supplier_address sa ON s.supplier_id = sa.id
                    LEFT JOIN purchase_type pt ON s.sale_type = pt.id
                    LEFT JOIN users u ON s.user_id = u.id
                    LEFT JOIN 
    users uc ON s.created_by = uc.id -- For the user who created the sale
                WHERE 1=1
            `;

            // Parameters array for safe binding
            const params = [];

            // Add filtering conditions if provided
            if (product_id) {
                sql += ` AND pr.product_name LIKE ?`;
                params.push(`%${product_id}%`);
            }
            if (invoice) {
                sql += ` AND s.invoice_id LIKE ?`;
                params.push(`%${invoice}%`);
            }


            if (name) {
                sql += ` AND u.full_name LIKE ?`;
                params.push(`%${name}%`);
            }
            if (mobile) {
                sql += ` AND u.mobile LIKE ?`;
                params.push(`%${mobile}%`);
            }


            if (fromDate && toDate) {
                sql += ` AND s.created_date BETWEEN ? AND ?`;
                params.push(fromDate, toDate);
            }

            sql += ` ORDER BY s.id DESC`;

            console.log("SQL Query:", sql);

            // Execute the constructed SQL query with parameters
            connection.query(sql, params, function (error, results) {
                if (error) {
                    console.error("Error occurred during search:", error);
                    return res.status(500).json({ error: "An error occurred during search." });
                }

                // Format the result into a more structured object
                const purchases = results.reduce((acc, row) => {
                    // Find or create a purchase entry in the accumulator
                    let purchase = acc.find(p => p.id === row.id);
                    if (!purchase) {
                        purchase = {
                            id: row.id,
                            supplier_id: row.supplier_id,
                            user_id: row.user_id,
                            full_name: row.full_name,
                            previous_due: row.previous_due,
                            email: row.email,
                            barcode: row.barcode,
                            mobile: row.mobile,
                            account: row.account,
                            remarks: row.remarks,
                            payable_amount: row.payable_amount,
                            supplier_name: row.supplier_name,
                            product_id: row.product_id,
                            product_name: row.product_name,
                            quantity: row.quantity,
                            sale_price: row.sale_price,
                            total_amount: row.total_amount,
                            discount: row.discount,
                            due: row.due,
                            paid_amount: row.paid_amount,
                            quotation_date: row.quotation_date,
                            invoice_id: row.invoice_id,
                            purchase_type: row.purchase_type,
                            purchase_type_name: row.purchase_type_name,
                            created_by: row.created_by,
                            modified_by: row.modified_by,
                            created_date: row.created_date,
                            modified_date: row.modified_date,
                            sale_product: [],
                        };
                        acc.push(purchase);
                    }

                    // Add product data if it exists
                    purchase.sale_product.push({
                        id: row.product_sale_id,
                        product_id: row.product_id,
                        product_name: row.product_name,
                        discount: row.sp_discount,
                        quantity: row.product_quantity,
                        unit_id: row.product_unit_id,
                        unit_name: row.unit_name,
                        purchase_price: row.product_purchase_price,
                        sale_price: row.product_sale_price,
                        created_by: row.product_created_by,
                        created_date: row.product_created_date,
                        modified_by: row.product_modified_by,
                        modified_date: row.product_modified_date
                    });

                    return acc;
                }, []);

                console.log("Search results:", purchases);
                res.status(200).json({ results: purchases });
            });
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).json({ error: "An error occurred." });
        }
    },







    quotation_list_pdf: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize } = req.body;



            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';



                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.full_name}</td>`; // Person Name
                row += `<td>${result.invoice_id}</td>`; // Person Name
                row += `<td>${result.paid_amount}</td>`; // Person Name
                row += `<td>${result.discount}</td>`; // Person Name
                row += `<td>${result.quotation_date.slice(0, 10)}</td>`; // Person Name
                row += `<td>${result.created_date.slice(0, 10)} ${result.created_by}</td>`; // Person Name

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
                    }
                    table {
                    font-size: ${fontSize || '12px'};
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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Quotation List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Quotation List</h3>
                </div>
                <div class="container2">
                    <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                    <p style="margin: 0; padding: 0;">Collected By:</p>
                    <p style="margin: 0; padding: 0;">Date: </p>
                </div>
                <table>
                    <thead>
                         <tr>
                                                                 <th>

                                                                        SL No.
                                                                    </th>
                                                                    <th>
                                                                        Name
                                                                    </th>
                                                                    <th>
                                                                        Invoice
                                                                    </th>
                                                                   
                                                                    <th>
                                                                        Total Amount
                                                                    </th>
                                                                    <th>
                                                                        Discount
                                                                    </th>
                                                                   
                                                                    
                                                                    <th>
                                                                        Quotation Date
                                                                    </th>
                                                                    <th>
                                                                    Created By / Date
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



    quotation_list_print: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize, extraColumnValue } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';



                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.full_name}</td>`; // Person Name
                row += `<td>${result.invoice_id}</td>`; // Person Name
                row += `<td>${result.paid_amount}</td>`; // Person Name
                row += `<td>${result.discount}</td>`; // Person Name
                row += `<td>${result.quotation_date.slice(0, 10)}</td>`; // Person Name
                row += `<td>${result.created_date.slice(0, 10)} ${result.created_by}</td>`; // Person Name


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
                        
                        font-family: 'Nikosh', sans-serif !important;
                    }
                    table {
                    font-size: ${fontSize || '12px'};
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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Quotation List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Quotation List</h3>
                </div>
                <div class="container2">
                    <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                    <p style="margin: 0; padding: 0;">Collected By:</p>
                    <p style="margin: 0; padding: 0;">Date: </p>
                </div>
                <table>
                    <thead>
                    
                            <tr>
                          <th>

                                                                        SL No.
                                                                    </th>
                                                                    <th>
                                                                        Name
                                                                    </th>
                                                                    <th>
                                                                        Invoice
                                                                    </th>
                                                                   
                                                                    <th>
                                                                        Total Amount
                                                                    </th>
                                                                    <th>
                                                                        Discount
                                                                    </th>
                                                                   
                                                                   
                                                                    <th>
                                                                        Quotation Date
                                                                    </th>
                                                                    <th>
                                                                        Created By / Date
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

    quotation_list_pdf_single: async (req, res) => {
        try {
            const { searchResults, quotation_current_date_count, designationemployee } = req.body;

            if (!searchResults || !searchResults.sale_product) {
                return res.status(400).send('Invalid request data');
            }
            const numberToWords = (num) => {
                const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
                const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
                const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
                const levels = ["", "Thousand", "Lakh", "Crore"]; // Indian numbering system

                if (num === 0) return "Zero";

                const convertHundreds = (n) => {
                    let str = "";
                    if (n >= 100) {
                        str += ones[Math.floor(n / 100)] + " Hundred ";
                        n %= 100;
                    }
                    if (n >= 11 && n <= 19) {
                        str += teens[n - 10] + " ";
                    } else {
                        if (n >= 10) {
                            str += tens[Math.floor(n / 10)] + " ";
                            n %= 10;
                        }
                        if (n > 0) {
                            str += ones[n] + " ";
                        }
                    }
                    return str.trim();
                };

                let words = "";
                let parts = [];

                if (num >= 10000000) { // Crore
                    parts.push([Math.floor(num / 10000000), "Crore"]);
                    num %= 10000000;
                }
                if (num >= 100000) { // Lakh
                    parts.push([Math.floor(num / 100000), "Lakh"]);
                    num %= 100000;
                }
                if (num >= 1000) { // Thousand
                    parts.push([Math.floor(num / 1000), "Thousand"]);
                    num %= 1000;
                }
                if (num > 0) { // Remaining Hundreds
                    parts.push([num, ""]);
                }

                parts.forEach(([value, label]) => {
                    if (value > 0) {
                        words += convertHundreds(value) + " " + label + " ";

                    }
                });

                return words.trim();
            };
            const numberToWord = (num) => {
                const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
                const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
                const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    
                if (num < 10) return ones[num];
                if (num >= 10 && num < 20) return teens[num - 10];
                if (num >= 20) {
                    const tenPart = Math.floor(num / 10);
                    const onePart = num % 10;
                    return `${tens[tenPart]}${onePart ? `-${ones[onePart]}` : ""}`;
                }
            };

            const formatDate = (dateString) => {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', options); // Formats to: 14 January, 2025
            };
            const formatDates = () => {
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad single digit month with zero
                const day = String(date.getDate()).padStart(2, '0'); // Pad single digit day with zero

                return `${year}${month}${day}`; // Returns in format: 20250130
            };

            const saleProducts = searchResults.sale_product; // Array of products
            const pageSize = 'A4';
            const pageOrientation = 'portrait';
            let tableRows = '';
            // Start building HTML content
     

            // Calculate total amount and generate rows
            let totalAmount = 0;

            saleProducts?.forEach((item, index) => {
                const productName = item.product_name || 'Unknown Product';
                const quantity = item.quantity || 0;
                const discount = item.discount || 0;
                const salePrice = parseFloat(item.sale_price || 0).toFixed(2);

                tableRows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${productName}</td>
                          <td>${quantity} (${numberToWord(quantity)})</td>
                          <td>${discount}</td>
                          <td>${salePrice}</td>
                    </tr>
                `;

                totalAmount += parseFloat(salePrice);
            });
            const totalAmountInWords = numberToWords(Math.floor(totalAmount - searchResults.discount));

            htmlContent = `
            <html>
               <head>
        <title>Invoice</title>
        <style>
        @page {
                            size: ${pageSize} ${pageOrientation};
                            // margin: 20mm;
                        }
            body {
                font-family: Arial, sans-serif;
                // margin: 40px;
            }
            .invoice-header {
                display: flex;
                justify-content: space-between;
            }
            .invoice-header p {
                margin: 0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }
            th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
            .total {
                font-weight: bold;
            }
            .footer {
                margin-top: 20px;
            }
        </style>
        </head>
                <body>
                
                 <div class="invoice-header">
     <div>
        <img src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="Invoice Logo" width="100" height="100"> 
    </div>
    <div>
        <p><strong>Date:</strong>${formatDate(searchResults.quotation_date)}</p>
    </div>
    <div >
        <p style="float:right; margin-top:-20px;"><strong>Quotation No.:</strong> UIS/${formatDates() + quotation_current_date_count.count_today}</p>
    </div>
</div>
    <p><strong>To:</strong></p>
<p style="margin-top: -15px;">${searchResults.full_name}<br>
    Bhagyakul, Sreenagar, Munshiganj.<br>
    Room-114, 1st Floor Pani Bhaban, 72 Green Road, Dhaka</p>
    <br>

    <p><strong>Description:</strong></p>
    
        <table>
            <tr>
                <th>SL</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Discount</th>
                <th>Total Price (TK)</th>
            </tr>
        ${tableRows}
            <tr>
                <td colspan="4" class="total"><div style="float:right;">Sub Total</div></td>
                <td class="total">${totalAmount.toFixed(2)}</td>
            </tr>
            <tr>
                <td colspan="4" class="total"><div style="float:right;">Total Discount</div></td>
                <td class="total">${searchResults.discount}</td>
            </tr>
            <tr>
                <td colspan="4" class="total"><div style="float:right;">Total amount</div></td>
                <td class="total">${totalAmount - searchResults.discount}/-</td>
            </tr>
        </table>
        
        <p><strong>(Taka ${totalAmountInWords} only) Including VAT & Tax</strong></p>
        
        <div class="footer">
        
            <p><strong>Best Regards,</strong></p>
             <br>
             <br>
            <p>${designationemployee.full_name}<br>
    ${designationemployee.designation_name}<br>
        Cell: ${designationemployee.mobile}</p>
        </div>
        </body>
       
            </html>`;

            wkhtmltopdf(htmlContent, { pageSize: pageSize, orientation: pageOrientation }, (err, stream) => {
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


    sale_print_all_invoice: async (req, res) => {
        try {
            const { searchResults, selectedFontSize, selectedPrintSize } = req.body;

            // Loop through each result to print them one by one
            const htmlContent = searchResults.map((result) => {
                const saleProducts = result.sale_product;
                const currentDate = new Date();
                const billDate = currentDate
                    .toLocaleDateString('en-GB')
                    .split('/')
                    .reverse()
                    .join('-');
                const vat = 21.05;
                const netPayable = 537.05;
                const cashPaid = 1000.00;
                const change = cashPaid - netPayable;
                const cashier = "Saklain";
                const currentTime = new Date().toLocaleTimeString(); // Replace this with the actual time if needed.

                return `
                <div class="receipt">
                    <div class="receipt-header">
                        <h1>Urban It Solution</h1>
                        <p>114, Senpara Parbata, Mirpur-10, Dhaka</p>
                        <p>Phone: 01044060785</p>
                        <p>BIN: 0014050652-0201</p>
                        <p>Mushak-6.3</p>
                    </div>
                    <div class="receipt-body">
                        <p style="text-align: center;font-size: ${selectedPrintSize === '57mm' ? '12px' : '16px'}; margin-bottom: 0px;"><strong>----- Urban It Solution -----</strong></p>
                        <div class="invoice-info">
                            <div class="invoice-info-left">
                                <p>Invoice#: ${result.invoice_id}</p>
                                <p>Bill Date: ${billDate}</p>
                                <p>Customer ID: ${result.user_id}</p>
                                <p>Name: ${result.full_name}</p>
                            </div>
                            <div class="invoice-info-right">
                                <p>Cashier: ${cashier}</p>
                                <p>Time: ${currentTime}</p>
                                <p>Total Points: TBD</p>
                                <p>Earned Points: TBD</p>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>SL.</th>
                                    <th class="centered">Article</th>
                                    <th class="centered"></th>
                                    <th class="centered">Description</th>
                                    <th class="centered">UM</th>
                                </tr>
                                <tr>
                                    <th class="centered">Qty</th>
                                    <th class="centered">Unit Price</th>
                                    <th class="centered">VAT</th>
                                    <th class="centered">Discount</th>
                                    <th class="centered">Total(TK)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${saleProducts
                        .map((item, index) => `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td class="centered">${item.article || 'N/A'}</td>
                                            <td class="centered"></td>
                                            <td class="centered">${item.product_name}</td>
                                            <td class="centered">${item.um || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td class="centered">${item.quantity}</td>
                                            <td class="centered">${(item.sale_price + item.discount)?.toFixed(2)}</td>
                                            <td class="centered">${item.vat || '0.00'}</td>
                                            <td class="centered">${item.discount || '0.00'}</td>
                                            <td class="centered">${item.sale_price?.toFixed(2)}</td>
                                        </tr>
                                    `)
                        .join('')}
                            </tbody>
                        </table>
                        <div class="line"></div>
                        <div class="receipt-summary">
                            <p>Subtotal: ${result.total_amount?.toFixed(2)} Tk</p>
                            <p>VAT: ${vat?.toFixed(2)} Tk</p>
                            <p>Discount: ${result.discount?.toFixed(2)} Tk</p>
                            <p>Previous Due: ${result.previous_due?.toFixed(2)} Tk</p>
                            <p>Due: ${result.due?.toFixed(2)} Tk</p>
                            <div class="dash"></div>
                            <p><strong>Net Payable: ${result.paid_amount?.toFixed(2)} Tk</strong></p>
                            <div class="dash"></div>
                            <p>Cash Paid: ${cashPaid?.toFixed(2)} Tk</p>
                            <p>Change: ${change?.toFixed(2)} Tk</p>
                        </div>
                    </div>
                    <div class="footer-text">
                        <p class="delivery-footer">Call for Home Delivery: 01774412135</p>
                        <p>Recycle Offer: Recycle your shopping bag & get cash back for each bag.</p>
                        <p>Return Policy: Please bring your receipt for returns within 3 days. No perishable returns.</p>
                        <p>Thank You For Shopping With Us!</p>
                    </div>
                </div>
                <div class="page-break"></div> <!-- Page break to separate invoices -->
                `;
            }).join('');
            // Join the HTML contents for all the searchResults
            const fullHtmlContent = `
        <html>
            <head>
                <style>
                        body { font-family: "Courier New", monospace; margin: 0; padding: 0; font-size: ${selectedFontSize ? selectedFontSize : '12px'}; }
                        .receipt {
                            width: ${selectedPrintSize === '57mm' ? selectedPrintSize : '80mm'};
                            margin: 0 auto;
                            page-break-inside: avoid; 
                        }   
                        .receipt-header, .receipt-footer { text-align: center; }
                        .receipt-header h1 { font-size: 18px; margin: 0; }
                        .receipt-header p { font-size: ${selectedFontSize ? selectedFontSize : '12px'}; margin: 2px 0; }
                        .receipt-body { margin: 0px 0; }
                        .receipt-body table { width: 100%; border-collapse: collapse; font-size: ${selectedFontSize ? selectedFontSize : '12px'}; }
                        .receipt-body table th, .receipt-body table td {
                            padding: 4px; text-align: left;
                        }
                        .receipt-body table .centered {
                            text-align: center; 
                        }
                        .receipt-summary { margin-top: 10px; text-align: right; font-size: ${selectedFontSize ? selectedFontSize : '12px'}; }
                        .receipt-footer p { margin: 5px 0; font-size: 10px; }
                        .footer-text { font-size: 10px; text-align: center; margin-top: 10px; }
                        .line { border-bottom: 1px solid #000; margin: 5px 0; }
                        .dash { border-top: 1px dashed #000; }
                        .invoice-info { display: flex; justify-content: space-between; font-size: ${selectedFontSize ? selectedFontSize : '12px'}; }
                        .delivery-footer {
                        background-color: black;
                        color: white;
                        padding: 5px;
                        font-size:  ${selectedFontSize ? selectedFontSize : '12px'};
                        text-align: center;
                    }
                    </style>
            </head>
            <body>
                ${htmlContent}
                <script>
                    window.print();
                </script>
            </body>
        </html>
    `;
            // Send the generated HTML for printing
            res.send(fullHtmlContent);
        } catch (error) {
            console.error('Error in sale_invoice_print_single:', error);
            res.status(500).send('Error generating print view');
        }
    },


    sale_invoice_print_single: async (req, res) => {
        try {
            const { searchResults, selectedFontSize, selectedPrintSize, } = req.body;


            const saleProducts = searchResults.sale_product

            // Example dynamic data (replace these with your actual data)
            // const saleProducts = [
            //     { description: "Arong Liquid Milk 1Ltr", quantity: 1, unitPrice: 95.00, total: 95.00 },
            //     { description: "Savoy Crunch Choco Chips", quantity: 1, unitPrice: 95.00, total: 95.00 },
            //     { description: "Pusti Plus Full Cream Milk", quantity: 1, unitPrice: 115.00, total: 115.00 }
            // ];
            const invoiceNumber = "INV1362";
            const currentDate = new Date();
            const billDate = currentDate
                .toLocaleDateString('en-GB')
                .split('/')
                .reverse()
                .join('-');
            const customerId = "12322";
            const customerName = "Saklain";
            const subtotal = 595.00;
            const vat = 21.05;
            const discount = 79.00;
            const netPayable = 537.05;
            const cashPaid = 1000.00;
            const change = cashPaid - netPayable;
            const cashier = "Saklain";
            const currentTime = new Date().toLocaleTimeString(); // Replace this with the actual time if needed.

            // Generate receipt HTML content border-bottom: 1px dotted #000;
            const htmlContent = `
            <html>
            <head>
                <style>
                    body { font-family: "Courier New", monospace; margin: 0; padding: 0; font-size: ${selectedFontSize ? selectedFontSize : '12px'}; }
                    .receipt {
                                width: ${selectedPrintSize ? selectedPrintSize : '80mm'};
                                margin: 0 auto;
                            }   
                    .receipt-header, .receipt-footer { text-align: center; }
                    .receipt-header h1 { font-size: 16px; margin: 0; }
                    .receipt-header p { font-size: ${selectedFontSize ? selectedFontSize : '12px'}; margin: 2px 0; }
                    .receipt-body { margin: 0px 0; }
                    .receipt-body table { width: 100%; border-collapse: collapse; font-size: ${selectedFontSize ? selectedFontSize : '12px'}; }
                    .receipt-body table th, .receipt-body table td {
                        padding: 4px; text-align: left; /* Default alignment */
                    }
                    .receipt-body table th {
                        
                    }
                    .receipt-body table td {
                        
                    }
                    .receipt-body table .centered {
                        text-align: center; /* Center specific columns */
                    }
                    .receipt-body table .compact {
                        padding: 2px; /* Reduce padding for compact layout */
                    }
                    .receipt-summary { margin-top: 10px; text-align: right; font-size:  ${selectedFontSize ? selectedFontSize : '12px'}; }
                    .receipt-footer p { margin: 5px 0; font-size: 10px; }
                    .footer-text { font-size: 10px; text-align: center; margin-top: 10px; }
                    .line { border-bottom: 1px solid #000; margin: 5px 0; }
                    .dash { border-top: 1px dashed #000; }
                    .invoice-info { display: flex; justify-content: space-between; font-size:  ${selectedFontSize ? selectedFontSize : '12px'}; }
                    .invoice-info-left, .invoice-info-right { width: ; }
                    .receipt-header h1 { font-size: 18px; }
                    .delivery-footer {
                        background-color: black;
                        color: white;
                        padding: 5px;
                        font-size:  ${selectedFontSize ? selectedFontSize : '12px'};
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="receipt">
                    <div class="receipt-header">
                        <h1>Urban It Solution</h1>
                        <p>114, Senpara Parbata, Mirpur-10, Dhaka</p>
                        <p>Phone: 01044060785</p>
                        <p>BIN: 0014050652-0201</p>
                        <p>Mushak-6.3</p>
                    </div>
                    <div class="receipt-body">
                        <p style="text-align: center;font-size: ${selectedPrintSize === '57mm' ? '12px' : '16px'}; margin-bottom: 0px;"><strong>----- Urban It Solution -----</strong></p>
                        <div class="invoice-info">
                            <div class="invoice-info-left">
                                <p>Invoice#: ${searchResults.invoice_id}</p>
                                <p>Bill Date: ${billDate}</p>
                                <p>Customer ID: ${searchResults.user_id}</p>
                                <p>Name: ${searchResults.full_name}</p>
                            </div>
                            <div class="invoice-info-right">
                                <p>Cashier: ${cashier}</p>
                                <p>Time: ${currentTime}</p>
                                <p>Total Points: TBD</p>
                                <p>Earned Points: TBD</p>
                            </div>
                        </div>
                        <div class=""></div>
                        <table>
                            <thead>
                                <tr >
                                    <th>SL.</th>
                                    <th class="centered">Article</th>
                                    <th class="centered"></th>
                                    <th class="centered">Description</th>
                                    <th class="centered">UM</th>
                                </tr>
                                <tr>
                                    <th class="centered">Qty</th>
                                    <th class="centered">Unit Price</th>
                                    <th class="centered">VAT</th>
                                    <th class="centered">Discount</th>
                                    <th class="centered">Total(TK)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${saleProducts
                    .map((item, index) => `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td class="centered">${item.article || 'N/A'}</td>
                                            <td class="centered"></td>
                                            <td class="centered">${item.product_name}</td>
                                            <td class="centered">${item.um || 'N/A'}</td>
                                        </tr>
                                        
                                        <tr>
                                            <td class="centered">${item.quantity}</td>
                                            <td class="centered">${(item.sale_price + item.discount)?.toFixed(2)}</td>
                                            <td class="centered">${item.vat || '0.00'}</td>
                                            <td class="centered">${item.discount || '0.00'}</td>
                                            <td class="centered">${item.sale_price?.toFixed(2)}</td>
                                            
                                        </tr>
                                        
                                    `)
                    .join('')}
                            </tbody>
                        </table>
                        <div class="line"></div>
                        <div class="receipt-summary">
                            <p>Subtotal: ${searchResults.total_amount?.toFixed(2)} Tk</p>
                            <p>VAT: ${vat?.toFixed(2)} Tk</p>
                            <p>Discount: ${searchResults.discount?.toFixed(2)} Tk</p>
                            <p>Previous Due: ${searchResults.previous_due?.toFixed(2)} Tk</p>
                            <p>Due: ${searchResults.due?.toFixed(2)} Tk</p>
                            <div class="dash"></div>
                            <p><strong>Net Payable: ${searchResults.paid_amount?.toFixed(2)} Tk</strong></p>
                            <div class="dash"></div>
                            <p>Cash Paid: ${cashPaid?.toFixed(2)} Tk</p>
                            <p>Change: ${change?.toFixed(2)} Tk</p>
                        </div>
                    </div>
                    <div class="footer-text">
                        <p class="delivery-footer">Call for Home Delivery: 01774412135</p>
                        <p>Recycle Offer: Recycle your shopping bag & get cash back for each bag.</p>
                        <p>Return Policy: Please bring your receipt for returns within 3 days. No perishable returns.</p>
                        <p>Thank You For Shopping With Us!</p>
                    </div>
                </div>
            </body>
            <script>
                window.print();
            </script>
            </html>
            `;

            // Send the generated HTML for printing
            res.send(htmlContent);
        } catch (error) {
            console.error('Error in sale_invoice_print_single:', error);
            res.status(500).send('Error generating print view');
        }
    },



    sale_invoice_pdf_download_single: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, selectedFontSize } = req.body;

            const saleProducts = searchResults.sale_product



            const invoiceNumber = "INV1362";
            const currentDate = new Date();
            const billDate = currentDate
                .toLocaleDateString('en-GB')
                .split('/')
                .reverse()
                .join('-');
            const customerId = "12322";
            const customerName = "Saklain";
            const subtotal = 595.00;
            const vat = 21.05;
            const discount = 79.00;
            const netPayable = 537.05;
            const cashPaid = 1000.00;
            const change = cashPaid - netPayable;
            const cashier = "Saklain";
            const currentTime = new Date().toLocaleTimeString(); // Replace this with the actual time if needed.

            // Generate receipt HTML content
            const htmlContent = `
                <html>
                <head>
                    <style>
                        body { font-family: "Courier New", monospace; margin: 0; padding: 0; font-size: ${selectedFontSize ? selectedFontSize : '12px'}; }
                        .receipt {  width: ${selectedPrintSize ? selectedPrintSize : '80mm'}; margin: 0 auto; }
                        .receipt-header, .receipt-footer { text-align: center; }
                        .receipt-header h1 { font-size: 16px; margin: 0; }
                        .receipt-header p { font-size: ${selectedFontSize ? selectedFontSize : '12px'}; margin: 2px 0; }
                        .receipt-body { margin: 20px 0; }
                        .receipt-body table { width: 100%; border-collapse: collapse; font-size: ${selectedFontSize ? selectedFontSize : '12px'}; }
                        .receipt-body table th, .receipt-body table td {
                            padding: 5px; text-align: left;
                        }
                        .receipt-body table th {
                            
                        }
                        .receipt-body table td {
                           
                        }
                             .receipt-body table .centered {
                        text-align: center; /* Center specific columns */
                    }
                        .receipt-summary { margin-top: 10px; text-align: right; font-size: ${selectedFontSize ? selectedFontSize : '12px'}; }
                        .receipt-footer p { margin: 5px 0; font-size: 10px; }
                        .footer-text { font-size: 10px; text-align: center; margin-top: 10px; }
                        .line { border-bottom: 1px solid #000; margin: 5px 0; }
                        .dash { border-top: 1px dashed #000; }
                        .invoice-info { display: flex; justify-content: space-between; font-size: ${selectedFontSize ? selectedFontSize : '12px'}; }
                        .invoice-info-left, .invoice-info-right { width: 50%; }
                        .receipt-header h1 { font-size: 18px; }
                        .delivery-footer {
                                background-color: black;
                                color: white;
                                padding: 5px;
                                font-size: ${selectedFontSize ? selectedFontSize : '12px'};
                                text-align: center;
                                }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                        <div class="receipt-header">
                            <h1>Urban It Solution</h1>
                            <p>114, Senpara Parbata, Mirpur-10, Dhaka</p>
                            <p>Phone: 01044060785</p>
                            <p>BIN: 0014050652-0201</p>
                        </div>
                        <div class="receipt-body">
                           <p style="text-align: center;font-size: ${selectedPrintSize === '57mm' ? '12px' : '16px'}; margin-bottom: 0px;"><strong>----- Urban It Solution -----</strong></p>
                          
                                   <div class="invoice-info">
                                    <table style="width: 100%; font-size: ${selectedFontSize ? selectedFontSize : '12px'};">
                                            <tr>
                                                <td style="vertical-align: top; width: 50%;">
                                                    <p>Invoice#: ${searchResults.invoice_id}</p>
                                                    <p>Bill Date: ${billDate}</p>
                                                    <p>Customer ID: ${searchResults.user_id}</p>
                                                    <p>Name: ${searchResults.full_name}</p>
                                                </td>
                                                <td style="vertical-align: top; text-align: right; width: 50%;">
                                                    <p>Cashier: ${cashier}</p>
                                                    <p>Time: ${currentTime}</p>
                                                    <p>Total Points: TBD</p> <!-- Replace with actual points if applicable -->
                                                    <p>Earned Points: TBD</p> <!-- Replace with actual earned points -->
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                            
                            <table>
                            <thead>
                                <tr >
                                    <th>SL.</th>
                                    <th class="centered">Article</th>
                                    <th class="centered"></th>
                                    <th class="centered">Description</th>
                                    <th class="centered">UM</th>
                                </tr>
                                <tr>
                                    <th class="centered">Qty</th>
                                    <th class="centered">Unit Price</th>
                                    <th class="centered">VAT</th>
                                    <th class="centered">Discount</th>
                                    <th class="centered">Total(TK)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${saleProducts
                    .map((item, index) => `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td class="centered">${item.article || 'N/A'}</td>
                                            <td class="centered"></td>
                                            <td class="centered">${item.product_name}</td>
                                            <td class="centered">${item.um || 'N/A'}</td>
                                        </tr>
                                        
                                        <tr>
                                            <td class="centered">${item.quantity}</td>
                                            <td class="centered">${(item.sale_price + item.discount)?.toFixed(2)}</td>
                                            <td class="centered">${item.vat || '0.00'}</td>
                                            <td class="centered">${item.discount || '0.00'}</td>
                                            <td class="centered">${item.sale_price?.toFixed(2)}</td>
                                            
                                        </tr>
                                        
                                    `)
                    .join('')}
                            </tbody>
                        </table>
                            <div class="line" style="margin-top:-1.8px;"></div>
                            <div class="receipt-summary">
                                <p>Subtotal: ${searchResults.total_amount?.toFixed(2)} Tk</p>
                                <p>VAT: ${vat?.toFixed(2)} Tk</p>
                                <p>Discount: ${searchResults.discount?.toFixed(2)} Tk</p>
                                <p>Previous Due: ${searchResults.previous_due?.toFixed(2)} Tk</p>
                                <p>Due: ${searchResults.due?.toFixed(2)} Tk</p>
                                <div class="dash"></div>
                                <p><strong>Net Payable: ${searchResults.paid_amount?.toFixed(2)} Tk</strong></p>
                                <div class="dash"></div>
                                <p>Cash Paid: ${cashPaid?.toFixed(2)} Tk</p>
                                <p>Change: ${change?.toFixed(2)} Tk</p>
                            </div>
                        </div>
                        <div class="footer-text">
                        <p class="delivery-footer">Call for Home Delivery: 01774412135</p>
                            <p>Recycle Offer: Recycle your shopping bag & get cash back for each bag.</p>
                            <p>Return Policy: Please bring your receipt for returns within 3 days. No perishable returns.</p>
                            <p>Thank You For Shopping With Us!</p>
                        </div>
                    </div>
                </body>
                 
                </html>
            `;


            wkhtmltopdf(htmlContent, (err, stream) => {
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




    quotation_list_print_single: async (req, res) => {
        try {
            const { searchResults, quotation_current_date_count, designationemployee } = req.body;

            if (!searchResults || !searchResults.sale_product) {
                return res.status(400).send('Invalid request data');
            }
            const numberToWords = (num) => {
                const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
                const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
                const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
                const levels = ["", "Thousand", "Lakh", "Crore"]; // Indian numbering system

                if (num === 0) return "Zero";

                const convertHundreds = (n) => {
                    let str = "";
                    if (n >= 100) {
                        str += ones[Math.floor(n / 100)] + " Hundred ";
                        n %= 100;
                    }
                    if (n >= 11 && n <= 19) {
                        str += teens[n - 10] + " ";
                    } else {
                        if (n >= 10) {
                            str += tens[Math.floor(n / 10)] + " ";
                            n %= 10;
                        }
                        if (n > 0) {
                            str += ones[n] + " ";
                        }
                    }
                    return str.trim();
                };

                let words = "";
                let parts = [];

                if (num >= 10000000) { // Crore
                    parts.push([Math.floor(num / 10000000), "Crore"]);
                    num %= 10000000;
                }
                if (num >= 100000) { // Lakh
                    parts.push([Math.floor(num / 100000), "Lakh"]);
                    num %= 100000;
                }
                if (num >= 1000) { // Thousand
                    parts.push([Math.floor(num / 1000), "Thousand"]);
                    num %= 1000;
                }
                if (num > 0) { // Remaining Hundreds
                    parts.push([num, ""]);
                }

                parts.forEach(([value, label]) => {
                    if (value > 0) {
                        words += convertHundreds(value) + " " + label + " ";

                    }
                });

                return words.trim();
            };
            const numberToWord = (num) => {
                const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
                const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
                const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    
                if (num < 10) return ones[num];
                if (num >= 10 && num < 20) return teens[num - 10];
                if (num >= 20) {
                    const tenPart = Math.floor(num / 10);
                    const onePart = num % 10;
                    return `${tens[tenPart]}${onePart ? `-${ones[onePart]}` : ""}`;
                }
            };

            const formatDate = (dateString) => {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', options); // Formats to: 14 January, 2025
            };
            const formatDates = () => {
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad single digit month with zero
                const day = String(date.getDate()).padStart(2, '0'); // Pad single digit day with zero

                return `${year}${month}${day}`; // Returns in format: 20250130
            };

            const saleProducts = searchResults.sale_product; // Array of products
            const pageSize = 'A4';
            const pageOrientation = 'portrait';
            let tableRows = '';
            // Start building HTML content
     

            // Calculate total amount and generate rows
            let totalAmount = 0;

            saleProducts?.forEach((item, index) => {
                const productName = item.product_name || 'Unknown Product';
                const quantity = item.quantity || 0;
                const discount = item.discount || 0;
                const salePrice = parseFloat(item.sale_price || 0).toFixed(2);

                tableRows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${productName}</td>
                          <td>${quantity} (${numberToWord(quantity)})</td>
                          <td>${discount}</td>
                          <td>${salePrice}</td>
                    </tr>
                `;

                totalAmount += parseFloat(salePrice);
            });
            const totalAmountInWords = numberToWords(Math.floor(totalAmount - searchResults.discount));
            htmlContent = `
            <html>
               <head>
        <title>Invoice</title>
        <style>
        @page {
                            size: ${pageSize} ${pageOrientation};
                            // margin: 20mm;
                        }
            body {
                font-family: Arial, sans-serif;
                // margin: 40px;
            }
            .invoice-header {
                display: flex;
                justify-content: space-between;
            }
            .invoice-header p {
                margin: 0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }
            th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
            .total {
                font-weight: bold;
            }
            .footer {
                margin-top: 20px;
            }
        </style>
        </head>
                <body>
                <div>
                <img src="http://192.168.0.114:3000/_next/static/media/pathshala.ed8fa91a.jpg" alt="Invoice Logo" width="100" height="100"> 
                </div>
                <div class="invoice-header">
        <div>
            <p><strong>Date:</strong>${formatDate(searchResults.quotation_date)}</p>
        </div>
        <div >
            <p ><strong>Quotation No.:</strong> UIS/${formatDates() + quotation_current_date_count.count_today}</p>
        </div>
    </div>
    <p><strong>To:</strong></p>
<p style="margin-top: -15px;">${searchResults.full_name}<br>
    Bhagyakul, Sreenagar, Munshiganj.<br>
    Room-114, 1st Floor Pani Bhaban, 72 Green Road, Dhaka</p>
    <br>

    <p><strong>Description:</strong></p>
    
        <table>
            <tr>
                <th>SL</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Discount</th>
                <th>Total Price (TK)</th>
            </tr>
        ${tableRows}
            <tr>
                <td colspan="4" class="total"><div style="float:right">Sub Total</div></td>
                <td class="total">${totalAmount.toFixed(2)}</td>
            </tr>
            <tr>
                <td colspan="4" class="total"><div style="float:right;">Total Discount</div></td>
                <td class="total">${searchResults.discount}</td>
            </tr>
            <tr>
                <td colspan="4" class="total"><div style="float:right;">Total amount</div></td>
                <td class="total">${totalAmount - searchResults.discount}</td>
            </tr>
        </table>
        
        <p><strong>(Taka ${totalAmountInWords} only) Including VAT & Tax</strong></p>
        
        <div class="footer">
        
            <p><strong>Best Regards,</strong></p>
            <br>
            <br>
             <p>${designationemployee.full_name}<br>
    ${designationemployee.designation_name}<br>
        Cell: ${designationemployee.mobile}</p>
        </div>
        </body>
        <script>
                        window.print();
                    </script>
            </html>`;

            // Send the HTML for printing
            res.send(htmlContent);
        } catch (error) {
            console.error('Error in sale_list_print_single:', error);
            res.status(500).send('Error generating print view');
        }
    },



    quotation_list_print_all: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize } = req.body;

            // Ensure searchResults is an array
            if (!Array.isArray(searchResults) || searchResults.length === 0) {
                return res.status(400).send("No search results provided.");
            }

            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';

            // Start building HTML content
            let htmlContent = `
            <html>
                <head>
                    <title>Pathshala School & College Quotation Invoice</title>
                    <style>
                        @page {
                            size: ${pageSize} ${pageOrientation};
                            margin: 20mm;
                        }
                        * { 
                            
                            font-family: 'Nikosh', sans-serif !important;
                        }
                        table {
                        font-size: ${fontSize || '12px'};
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                        }
                        th, td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: left;
                        }
                        thead {
                            background-color: gray;
                            color: white;
                        }
                        body {
                            text-align: center;
                            
                            page-break-inside: avoid;
                        }
                            
                    </style>
                </head>
                <body>
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Quotation Invoice</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px;">Quotations Summary</h3>
            `;

            // Loop through each result and generate a table
            searchResults.forEach((result, index) => {
                let totalAmount = result.total_amount || 0;
                let totalDiscount = result.discount || 0;
                let totalDue = result.due || 0;
                let previousDue = result.previous_due || 0;
                let paidAmount = result.paid_amount || 0;

                htmlContent += `
                    <div style="page-break-inside: avoid;">
                        <h4>Quotation Record ${result.full_name}</h4>
                        <table >
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Discount</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                if (Array.isArray(result.sale_product)) {
                    result.sale_product.forEach(product => {
                        htmlContent += `
                            <tr>
                                <td>${product.product_name}</td>
                                <td>${product.quantity}</td>
                                <td>${product.discount ? product.discount : 0}</td>
                                <td>${product.sale_price}</td>
                            </tr>
                        `;
                    });
                }

                htmlContent += `
                            </tbody>
                           
                        </table>
                         <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
        <div style="text-align: right;">
            <h4>Total Amount: ${totalAmount.toFixed(2)}</h4>
            <h4>Due Amount: ${totalDue || 0}</h4>
            <h4>Previous Due Amount: ${previousDue || 0}</h4>
            <h4>Discount Amount: ${totalDiscount || 0}</h4>
            <h4><strong>Paid Amount: ${paidAmount || 0}</strong></h4>
        </div>
    </div>
                    </div>
                `;
            });


            htmlContent += `
                    <script>
                        window.print();
                    </script>
                </body>
            </html>
            `;

            res.setHeader('Content-Type', 'text/html');
            res.send(htmlContent);
        } catch (error) {
            console.error("Error generating sale invoice:", error);
            res.status(500).send("Internal Server Error");
        }
    },





    users_due_amount_all_sale: async (req, res) => {
        try {
            // Query to retrieve aggregated data and match user_id with users table to get full_name
            const sql = `
                SELECT 
                    s.user_id, 
                    u.full_name, 
                    SUM(s.payable_amount) AS payable_amount, 
                    SUM(s.total_amount) AS total_amount, 
                    SUM(s.due) AS due, 
                    SUM(s.discount) AS discount,  
                    SUM(s.paid_amount) AS paid_amount,
                    (SUM(s.total_amount) - (SUM(s.paid_amount) + SUM(s.discount))) AS total_due 
                FROM 
                    sale s
                JOIN 
                    users u 
                ON 
                    s.user_id = u.id
                GROUP BY 
                    s.user_id, u.full_name
                     HAVING total_due > 0;
            `;

            connection.query(sql, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // Check if any records were found
                if (result.length === 0) {
                    return res.status(200).json([]);
                }

                // Send the result as JSON response
                res.json(result);
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    users_due_amount_all_sales: async (req, res) => {
        try {
            // Query to retrieve aggregated data and match user_id with users table to get full_name
            const sql = `
                SELECT 
                    s.user_id, 
                    u.full_name, 
                    SUM(s.payable_amount) AS payable_amount, 
                    SUM(s.total_amount) AS total_amount, 
                    SUM(s.due) AS due, 
                    SUM(s.discount) AS discount,  
                    SUM(s.paid_amount) AS paid_amount
                    
                FROM 
                    sale s
                JOIN 
                    users u 
                ON 
                    s.user_id = u.id
                GROUP BY 
                    s.user_id, u.full_name
                   
            `;

            connection.query(sql, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // Check if any records were found
                if (result.length === 0) {
                    return res.status(200).json({});
                }

                // Send the result as JSON response
                res.json(result);
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    users_due_amount_all_sale_search: async (req, res) => {
        try {
            const { toDate, fromDate, supplier_id } = req.body;

            // Construct the base SQL query with parameterized placeholders
            let sql = `
                 SELECT s.*, 
                        sp.id AS product_sale_id, 
                        sp.product_id AS product_id, 
                        sp.quantity AS product_quantity, 
                        sp.discount AS sp_discount, 
                        sp.sale_price AS product_sale_price, 
                        sp.created_by AS product_created_by, 
                        sp.created_date AS product_created_date, 
                        sp.modified_by AS product_modified_by, 
                        sp.modified_date AS product_modified_date,
                        pr.product_name AS product_name,
                        LPAD(pr.barcode, 13, '0') AS barcode, 
                        sa.name AS supplier_name,
                        pt.name AS purchase_type_name,
                        u.full_name AS full_name,
                        u.email AS email,
                        u.mobile AS mobile
                    FROM sale s
                    LEFT JOIN sale_product sp ON s.id = sp.sale_id
                    LEFT JOIN product pr ON sp.product_id = pr.id
                    LEFT JOIN supplier_address sa ON s.supplier_id = sa.id
                    LEFT JOIN purchase_type pt ON s.sale_type = pt.id
                    LEFT JOIN users u ON s.user_id = u.id
                WHERE 1=1
            `;

            // Parameters array for safe binding
            const params = [];

            // Add filtering conditions if provided
            if (supplier_id) {
                sql += ` AND u.id LIKE ?`;
                params.push(`%${supplier_id}%`);
            }

            if (fromDate && toDate) {
                sql += ` AND s.created_date BETWEEN ? AND ?`;
                params.push(fromDate, toDate);
            }

            sql += ` ORDER BY s.id DESC`;

            console.log("SQL Query:", sql);

            // Execute the constructed SQL query with parameters
            connection.query(sql, params, function (error, results) {
                if (error) {
                    console.error("Error occurred during search:", error);
                    return res.status(500).json({ error: "An error occurred during search." });
                }

                // Format the result into a more structured object
                const purchases = results.reduce((acc, row) => {
                    // Find or create a purchase entry in the accumulator
                    let purchase = acc.find(p => p.id === row.id);
                    if (!purchase) {
                        purchase = {
                            id: row.id,
                            supplier_id: row.supplier_id,
                            user_id: row.user_id,
                            full_name: row.full_name,
                            previous_due: row.previous_due,
                            email: row.email,
                            barcode: row.barcode,
                            mobile: row.mobile,
                            account: row.account,
                            remarks: row.remarks,
                            payable_amount: row.payable_amount,
                            supplier_name: row.supplier_name,
                            product_id: row.product_id,
                            product_name: row.product_name,
                            quantity: row.quantity,
                            sale_price: row.sale_price,
                            total_amount: row.total_amount,
                            discount: row.discount,
                            due: row.due,
                            paid_amount: row.paid_amount,
                            sale_date: row.sale_date,
                            invoice_id: row.invoice_id,
                            purchase_type: row.purchase_type,
                            purchase_type_name: row.purchase_type_name,
                            created_by: row.created_by,
                            modified_by: row.modified_by,
                            created_date: row.created_date,
                            modified_date: row.modified_date,
                            sale_product: [],
                        };
                        acc.push(purchase);
                    }

                    // Add product data if it exists
                    purchase.sale_product.push({
                        id: row.product_sale_id,
                        product_id: row.product_id,
                        product_name: row.product_name,
                        discount: row.sp_discount,
                        quantity: row.product_quantity,
                        unit_id: row.product_unit_id,
                        unit_name: row.unit_name,
                        purchase_price: row.product_purchase_price,
                        sale_price: row.product_sale_price,
                        created_by: row.product_created_by,
                        created_date: row.product_created_date,
                        modified_by: row.product_modified_by,
                        modified_date: row.product_modified_date
                    });

                    return acc;
                }, []);

                console.log("Search results:", purchases);
                res.status(200).json({ results: purchases });
            });
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).json({ error: "An error occurred." });
        }
    },


    users_due_amount_sale: async (req, res) => {
        try {
            const user_id = req.params.user_id;

            // Query to retrieve the sum of due and paid amounts for the provided user_id
            const sql = "SELECT user_id, SUM(payable_amount) AS payable_amount, SUM(total_amount) AS total_amount, SUM(due) AS due, SUM(discount) AS discount,  SUM(paid_amount) AS paid_amount FROM sale WHERE user_id = ?";

            connection.query(sql, [user_id], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // Check if any record was found
                if (result.length === 0) {
                    return res.status(404).json({ message: 'No data found for the provided user_id' });
                }

                // Send the result as JSON response
                res.json(result[0]);
            });
        } catch (error) {
            console.log(error);
        }
    },


    saler_due_pdf: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize } = req.body;



            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.full_name}</td>`; // Person Name
                row += `<td>${result.total_amount}</td>`; // Person Name
                row += `<td>${result.paid_amount}</td>`; // Person Name
                row += `<td>${result.discount}</td>`; // Person Name
                row += `<td>${result?.total_amount - (result?.paid_amount + result?.discount)}</td>`; // Person Name

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
                        <h2 style="margin: 0; padding: 0;">Pathshala School & College Users Due List</h2>
                        <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                        <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                        <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                        <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Users Due List</h3>
                    </div>
                    <div class="container2">
                        <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                        <p style="margin: 0; padding: 0;">Collected By:</p>
                        <p style="margin: 0; padding: 0;">Date: </p>
                    </div>
                    <table>
                        <thead>
                     
       <tr>
                                                                        <th>
    
                                                                            SL No.
                                                                        </th>
                                                                        <th>
    
                                                                            Full Name
                                                                        </th>
                                                                        <th>
                                                                            Total Amount
                                                                        </th>
                                                                        <th>
                                                                            Paid Amount
                                                                        </th>
                                                                        <th>
                                                                            Discount
                                                                        </th>
                                                                        <th>
                                                                            Total Due
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

    saler_due_print: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize, extraColumnValue } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.full_name}</td>`; // Person Name
                row += `<td>${result.total_amount}</td>`; // Person Name
                row += `<td>${result.paid_amount}</td>`; // Person Name
                row += `<td>${result.discount}</td>`; // Person Name
                row += `<td>${result?.total_amount - (result?.paid_amount + result?.discount)}</td>`; // Person Name


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
                        <h2 style="margin: 0; padding: 0;">Pathshala School & College Users Due List</h2>
                        <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                        <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                        <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                        <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Users Due List</h3>
                    </div>
                    <div class="container2">
                        <p style="margin: 0; padding: 0;">Receipt No: 829</p>
                        <p style="margin: 0; padding: 0;">Collected By:</p>
                        <p style="margin: 0; padding: 0;">Date: </p>
                    </div>
                    <table>
                        <thead>
                        
                      
                                                                     <tr>
                                                                        <th>
    
                                                                            SL No.
                                                                        </th>
                                                                        <th>
    
                                                                            Full Name
                                                                        </th>
                                                                        <th>
                                                                            Total Amount
                                                                        </th>
                                                                        <th>
                                                                            Paid Amount
                                                                        </th>
                                                                        <th>
                                                                            Discount
                                                                        </th>
                                                                        <th>
                                                                            Total Due
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

    sale_due_list_pdf_single: async (req, res) => {
        try {
            const { searchResults } = req.body;

            if (!searchResults || !searchResults.sale_product) {
                return res.status(400).send('Invalid request data');
            }

            const saleProducts = searchResults.sale_product; // Array of products
            const pageSize = 'A4';
            const pageOrientation = 'portrait';

            // Start building HTML content
            let htmlContent = `
            <html>
                <head>
                    <title>Pathshala School & College Due Report Form</title>
                    <style>
                        @page {
                            size: ${pageSize} ${pageOrientation};
                            margin: 20mm;
                        }
                        * { 
                           
                            font-family: 'Nikosh', sans-serif !important;
                        }
                        table {
                            font-size: 14px;
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: left;
                        }
                        thead {
                            background-color: gray;
                        }
                        body {
                            text-align: center;
                            
                        }
                    </style>
                </head>
                <body>
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Due Report Form</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
        
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Due Report</h3>
                    <div style="display: flex; justify-content: space-between; font-size: 14px;">
                        <p style="margin: 0; padding: 0;">Receipt No: ${searchResults.invoice_id || 'N/A'}</p>
                        <p style="margin: 0; padding: 0;">Collected By: ${searchResults.full_name || 'Unknown'}</p>
                        <p style="margin: 0; padding: 0;">Date: ${searchResults.sale_date.slice(0, 10) || 'N/A'}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Discount</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            // Calculate total amount and generate rows
            let totalAmount = 0;
            saleProducts.forEach((item) => {
                const productName = item.product_name || 'Unknown Product';
                const quantity = item.quantity || 0;
                const discount = item.discount || 0;
                const salePrice = parseFloat(item.sale_price || 0).toFixed(2);

                htmlContent += `
                    <tr>
                        <td>${productName}</td>
                        <td>${quantity}</td>
                        <td>${discount}</td>
                        <td>${salePrice * quantity}</td>
                    </tr>
                `;

                totalAmount += parseFloat(salePrice * quantity);
            });

            // Add footer details from searchResults
            htmlContent += `
                        </tbody>
                        <tfoot>
                       
                    </table>
                   <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
        <div style="text-align: right;">
            <h5>Total Amount: ${totalAmount.toFixed(2)}</h5>
            <h5>Due Amount: ${searchResults.due || 0}</h5>
             <h5>Previous Due Amount: ${searchResults.previous_due || 0}</h5>
            <h5>Discount Amount: ${searchResults.discount || 0}</h5>
            <h5><strong>Paid Amount: ${searchResults.paid_amount || 0}</strong></h5>
        </div>
    </div>
                </body>
                
            </html>
            `;

            wkhtmltopdf(htmlContent, { pageSize: pageSize, orientation: pageOrientation }, (err, stream) => {
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

    sale_due_list_print_single: async (req, res) => {
        try {
            const { searchResults } = req.body;

            if (!searchResults || !searchResults.sale_product) {
                return res.status(400).send('Invalid request data');
            }

            const saleProducts = searchResults.sale_product; // Array of products
            const pageSize = 'A4';
            const pageOrientation = 'portrait';

            // Start building HTML content
            let htmlContent = `
            <html>
                <head>
                    <title>Pathshala School & College Due Report Form</title>
                    <style>
                        @page {
                            size: ${pageSize} ${pageOrientation};
                            margin: 20mm;
                        }
                        * { 
                            
                            font-family: 'Nikosh', sans-serif !important;
                        }
                        table {
                            font-size: 14px;
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: left;
                        }
                        thead {
                            background-color: gray;
                        }
                        body {
                            text-align: center;
                            
                        }
                    </style>
                </head>
                <body>
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Due Report Form</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>

                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Due Report</h3>
                    <div style="display: flex; justify-content: space-between; font-size: 14px;">
                        <p style="margin: 0; padding: 0;">Receipt No: ${searchResults.invoice_id || 'N/A'}</p>
                        <p style="margin: 0; padding: 0;">Collected By: ${searchResults.full_name || 'Unknown'}</p>
                        <p style="margin: 0; padding: 0;">Date: ${searchResults.sale_date.slice(0, 10) || 'N/A'}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Discount</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            // Calculate total amount and generate rows
            let totalAmount = 0;

            saleProducts.forEach((item) => {
                const productName = item.product_name || 'Unknown Product';
                const quantity = item.quantity || 0;
                const discount = item.discount || 0;
                const salePrice = parseFloat(item.sale_price || 0).toFixed(2);

                htmlContent += `
                    <tr>
                        <td>${productName}</td>
                        <td>${quantity}</td>
                        <td>${discount}</td>
                        <td>${salePrice * quantity}</td>
                    </tr>
                `;

                totalAmount += parseFloat(salePrice * quantity);
            });

            htmlContent += `
                        </tbody>

                    </table>
                   <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
        <div style="text-align: right;">
            <h5>Total Amount: ${totalAmount.toFixed(2)}</h5>
            <h5>Due Amount: ${searchResults.due || 0}</h5>
            <h5>Previous Due Amount: ${searchResults.previous_due || 0}</h5>
            <h5>Discount Amount: ${searchResults.discount || 0}</h5>
            <h5><strong>Paid Amount: ${searchResults.paid_amount || 0}</strong></h5>
        </div>
    </div>
                </body>
                 <script>
                window.print();
            </script>
            </html>
            `;

            // Send the HTML for printing
            res.send(htmlContent);
        } catch (error) {
            console.error('Error in sale_list_print_single:', error);
            res.status(500).send('Error generating print view');
        }
    },


    quotation_memo_create: async (req, res) => {
        try {
            const { title, description, created_by } = req.body;

            // Checking if ID 1 exists
            connection.query('SELECT id FROM quotation_memo WHERE id = 1', (err, rows) => {
                if (err) {
                    console.error('Error checking ID:', err);
                    return res.status(500).json({ message: 'Database query error', error: err });
                }

                let query, values;

                if (rows.length > 0) {
                    // If ID 1 exists, update it
                    query = 'UPDATE quotation_memo SET subject = ?, description = ?, created_by = ? WHERE id = 1';
                    values = [title, description, created_by];
                } else {
                    // If ID 1 does not exist, insert new record
                    query = 'INSERT INTO quotation_memo (subject, description, created_by) VALUES (?, ?, ?)';
                    values = [title, description, created_by];
                }

                connection.query(query, values, (err, result) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        return res.status(500).json({ message: 'Error processing the request', error: err });
                    }

                    res.status(200).json({
                        message: rows.length > 0 ? 'Updated successfully' : 'Inserted successfully',
                        result
                    });
                });
            });
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'Unexpected server error', error });
        }
    },
    quotation_memo_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM quotation_memo WHERE id = ?';
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


    quotation_setup_create: async (req, res) => {
        try {
            const {  description, created_by } = req.body;

            // Checking if ID 1 exists
            connection.query('SELECT id FROM quotation_setup WHERE id = 1', (err, rows) => {
                if (err) {
                    console.error('Error checking ID:', err);
                    return res.status(500).json({ message: 'Database query error', error: err });
                }

                let query, values;

                if (rows.length > 0) {
                    // If ID 1 exists, update it
                    query = 'UPDATE quotation_setup SET  description = ?, modified_by = ? WHERE id = 1';
                    values = [ description, created_by];
                } else {
                    // If ID 1 does not exist, insert new record
                    query = 'INSERT INTO quotation_setup ( description, created_by) VALUES (?, ?)';
                    values = [ description, created_by];
                }

                connection.query(query, values, (err, result) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        return res.status(500).json({ message: 'Error processing the request', error: err });
                    }

                    res.status(200).json({
                        message: rows.length > 0 ? 'Updated successfully' : 'Inserted successfully',
                        result
                    });
                });
            });
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'Unexpected server error', error });
        }
    },
    quotation_setup_single: async (req, res) => {
        try {
            const query = 'SELECT * FROM quotation_setup WHERE id = ?';
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

module.exports = QuotationModel