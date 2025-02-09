

const connection = require('../../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');

wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

const PurchaseModel = {

    // purchase_create: async (req, res) => {

    //     try {
    //         const {    supplier_id, product_id, quantity, unit_id, purchase_price, sale_price, total_amount, discount, due, paid_amount, purchase_invoice, purchase_date, invoice_id, purchase_type, created_by
    //         } = req.body;

    //         const insertQuery = 'INSERT INTO purchase ( supplier_id, product_id, quantity, unit_id, purchase_price, sale_price, total_amount, discount, due, paid_amount, purchase_invoice, purchase_date, invoice_id, purchase_type, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    //         const result = await connection.query(insertQuery, [ supplier_id, product_id, quantity, unit_id, purchase_price, sale_price, total_amount, discount, due, paid_amount, purchase_invoice, purchase_date, invoice_id, purchase_type, created_by]);



    //         const { insertId, affectedRows } = result;

    //         // Sending response with relevant data
    //         res.status(200).json({ insertId, affectedRows });

    //         // Using parameterized query to prevent SQL injection

    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Error processing the request' });
    //     }
    // },


    // purchase_create: async (req, res) => {
    //     try {
    //         const {
    //             supplier_id,
    //             product_id,
    //             quantity,
    //             unit_id,
    //             purchase_price,
    //             sale_price,
    //             total_amount,
    //             discount,
    //             due,
    //             paid_amount,
    //             purchase_invoice,
    //             purchase_date,
    //             invoice_id,
    //             created_by

    //         } = req.body;



    //         // Assuming you have a connection object already defined
    //         connection.beginTransaction();

    //         const insertPurchaseQuery = `
    //             INSERT INTO purchase (
    //                 supplier_id, product_id, quantity, unit_id, purchase_price, 
    //                 sale_price, total_amount, discount, due, paid_amount, 
    //                 purchase_invoice, purchase_date, invoice_id, purchase_type, created_by
    //             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    //         `;
    //         const userParams = [supplier_id, product_id, quantity, unit_id, purchase_price,
    //             sale_price, total_amount, discount, due, paid_amount,
    //             purchase_invoice, purchase_date, invoice_id, purchase_type, created_by];

    //         connection.query(insertPurchaseQuery, userParams, async (err, results) => {
    //             if (err) {
    //                 console.error(err);
    //                 await connection.rollback();
    //                 res.status(500).json({ message: 'User creation failed' });
    //                 return;
    //             }

    //             try {
    //                 const purchaseId = results.insertId;
    //                 const employeInfoQuery = `
    //             INSERT INTO purchase_product (
    //                 product_id, quantity, unit_id, purchase_price, sale_price, created_by, purchase_id
    //             ) VALUES (?, ?, ?, ?, ?, ?, ?)
    //         `;
    //                 const employeInfoParams = [product_id, quantity, unit_id, purchase_price, sale_price, created_by, purchaseId];


    //                 // Insert into employe_info table
    //                 await connection.query(employeInfoQuery, employeInfoParams);
    //                 // Insert into living_address table

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

    purchase_create: async (req, res) => {


        try {
            let {
                supplier_id,
                fields,
                assetInfo,

            } = req.body;

            console.log(fields, supplier_id);

            // Begin the transaction
            await new Promise((resolve, reject) => connection.beginTransaction(err => (err ? reject(err) : resolve())));

            const insertPurchaseQuery = `
                INSERT INTO purchase (
                    supplier_id, previous_due, total_amount, discount, due, paid_amount, 
                    purchase_invoice, purchase_date, invoice_id, purchase_type, payable_amount, remarks, account, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const userParams = [
                supplier_id, assetInfo.previous_due, assetInfo.total_amount, assetInfo.discount, assetInfo.due, assetInfo.paid_amount, assetInfo.purchase_invoice, assetInfo.purchase_date, assetInfo.invoice_id, 1, assetInfo.payable_amount, assetInfo.remarks, assetInfo.account, assetInfo.created_by
            ];

            // Insert into the purchase table
            const [purchaseResult] = await new Promise((resolve, reject) => {
                connection.query(insertPurchaseQuery, userParams, (err, results) => {
                    if (err) return reject(err);
                    resolve([results]);
                });
            });

            const purchaseId = purchaseResult.insertId;

            // Insert each product in fields into the purchase_product table
            const insertProductQuery = `
                INSERT INTO purchase_product (
                    product_id, ware_house_id, quantity, unit_id, purchase_price, sale_price, created_by, purchase_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            // Loop through each field in fields array and insert it
            for (let field of fields) {
                const { product_id, ware_house, quantity, unit_id, purchase_price, sale_price, created_by } = field;
                const productParams = [product_id, ware_house, quantity, unit_id, purchase_price, sale_price, created_by, purchaseId];

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

    purchase_update: async (req, res) => {
        try {


            const employeeId = req.params.id; // Assuming the ID is passed as a parameter
            const {
                supplier_id,
                total_amount,
                discount,
                due,
                paid_amount,
                purchase_invoice,
                purchase_date,
                invoice_id,
                purchase_type,
                fields,
                account,
                remarks,
                payable_amount,
                modified_by

            } = req.body;


            console.log(fields)

            // Begin transaction
            connection.beginTransaction(async (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Failed to start transaction' });
                    return;
                }



                try {

                    if (purchase_type == 1) {
                        // Query to delete existing educational qualifications
                        const deletePurchaseProduct = `
                        DELETE FROM purchase_product 
                        WHERE purchase_id = ?
                    `;
                        await connection.query(deletePurchaseProduct, [employeeId]);

                        // Query to insert new educational qualifications
                        const insertPurchaseProduct = `
                        INSERT INTO purchase_product (purchase_id, ware_house_id, product_id, quantity, unit_id, purchase_price, sale_price, modified_by)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                        // Insert new qualifications
                        for (const qualification of fields) {
                            const { product_id, quantity, ware_house_id, unit_id, purchase_price, sale_price, modified_by } = qualification;
                            const insertEducationParams = [employeeId, ware_house_id, product_id, quantity, unit_id, purchase_price, sale_price, modified_by];
                            await connection.query(insertPurchaseProduct, insertEducationParams);
                        }
                    } else if (purchase_type == 2) {
                        const deletePurchaseItem = `
                        DELETE FROM purchase_item 
                        WHERE purchase_id = ?
                    `;
                        await connection.query(deletePurchaseItem, [employeeId]);

                        // Query to insert new educational qualifications
                        const insertPurchaseItem = `
                        INSERT INTO purchase_item (purchase_id, item_name, quantity, unit_id, purchase_price, sale_price, modified_by)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `;

                        // Insert new qualifications
                        for (const qualification of fields) {
                            const { item_name, quantity, unit_id, purchase_price, sale_price, modified_by } = qualification;
                            const insertEducationParams = [employeeId, item_name, quantity, unit_id, purchase_price, sale_price, modified_by];
                            await connection.query(insertPurchaseItem, insertEducationParams);
                        }
                    }

                    // Update other employee information (experience, addresses, joining details, promotion)


                    const updateLivingAddressQuery = `
                        UPDATE purchase 
                        SET account = ?, remarks = ?, payable_amount = ?, supplier_id = ?, total_amount = ?, discount = ?, due = ?, paid_amount = ?, purchase_invoice = ?, purchase_date = ?, invoice_id = ?, modified_by = ?
                        WHERE id = ?;
                    `;
                    await connection.query(updateLivingAddressQuery, [account, remarks, payable_amount, supplier_id, total_amount, discount, due, paid_amount, purchase_invoice, purchase_date, invoice_id, modified_by, employeeId]);


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



    purchase_type_list: async (req, res) => {
        try {
            const data = "select * from  purchase_type";

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



    // non_stock_purchase_create: async (req, res) => {


    //     try {
    //         const {
    //             supplier_id,
    //             item_name,
    //             quantity,
    //             unit_id,
    //             purchase_price,
    //             sale_price,
    //             total_amount,
    //             discount,
    //             due,
    //             paid_amount,
    //             purchase_invoice,
    //             purchase_date,
    //             invoice_id,
    //             created_by
    //         } = req.body;

    //         // Begin the transaction
    //         await new Promise((resolve, reject) => connection.beginTransaction(err => err ? reject(err) : resolve()));

    //         const insertPurchaseQuery = `
    //             INSERT INTO purchase (
    //                 supplier_id,  quantity, unit_id, purchase_price, 
    //                 sale_price, total_amount, discount, due, paid_amount, 
    //                 purchase_invoice, purchase_date, invoice_id, purchase_type, created_by
    //             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    //         `;
    //         const userParams = [
    //             supplier_id, quantity, unit_id, purchase_price,
    //             sale_price, total_amount, discount, due, paid_amount,
    //             purchase_invoice, purchase_date, invoice_id, 2, created_by
    //         ];

    //         // Insert into the purchase table
    //         const [purchaseResult] = await new Promise((resolve, reject) => {
    //             connection.query(insertPurchaseQuery, userParams, (err, results) => {
    //                 if (err) return reject(err);
    //                 resolve([results]);
    //             });
    //         });

    //         const purchaseId = purchaseResult.insertId;

    //         const insertProductQuery = `
    //             INSERT INTO purchase_item (
    //                 item_name, quantity, unit_id, purchase_price, sale_price, created_by, purchase_id
    //             ) VALUES (?, ?, ?, ?, ?, ?, ?)
    //         `;
    //         const productParams = [item_name, quantity, unit_id, purchase_price, sale_price, created_by, purchaseId];

    //         // Insert into the purchase_product table
    //         await new Promise((resolve, reject) => {
    //             connection.query(insertProductQuery, productParams, (err, results) => {
    //                 if (err) return reject(err);
    //                 resolve(results);
    //             });
    //         });

    //         // Commit the transaction
    //         await new Promise((resolve, reject) => connection.commit(err => err ? reject(err) : resolve()));

    //         res.status(200).json({ message: 'Purchase created successfully' });
    //     } catch (error) {
    //         console.error("Error inserting data:", error);

    //         // Rollback the transaction on error
    //         await new Promise((resolve, reject) => connection.rollback(err => err ? reject(err) : resolve()));

    //         res.status(500).json({ message: "Error inserting data." });
    //     }
    // },
    non_stock_purchase_create: async (req, res) => {


        try {
            let {
                supplier_id,
                fields,
                assetInfo,

            } = req.body;

            console.log(fields, supplier_id);

            // Begin the transaction
            await new Promise((resolve, reject) => connection.beginTransaction(err => (err ? reject(err) : resolve())));

            const insertPurchaseQuery = `
                INSERT INTO purchase (
                    supplier_id, total_amount, discount, due, paid_amount, 
                    purchase_invoice, purchase_date, invoice_id, purchase_type, remarks, payable_amount, account, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const userParams = [
                supplier_id, assetInfo.total_amount, assetInfo.discount, assetInfo.due, assetInfo.paid_amount, assetInfo.purchase_invoice, assetInfo.purchase_date, assetInfo.invoice_id, 2, assetInfo.remarks, assetInfo.payable_amount, assetInfo.account, assetInfo.created_by
            ];

            // Insert into the purchase table
            const [purchaseResult] = await new Promise((resolve, reject) => {
                connection.query(insertPurchaseQuery, userParams, (err, results) => {
                    if (err) return reject(err);
                    resolve([results]);
                });
            });

            const purchaseId = purchaseResult.insertId;

            // Insert each product in fields into the purchase_product table
            const insertProductQuery = `
                INSERT INTO purchase_item (
                    item_name, quantity, unit_id, purchase_price, sale_price, created_by, purchase_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            // Loop through each field in fields array and insert it
            for (let field of fields) {
                const { item_name, quantity, unit_id, purchase_price, sale_price, created_by } = field;
                const productParams = [item_name, quantity, unit_id, purchase_price, sale_price, created_by, purchaseId];

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

    // purchase_list: async (req, res) => {
    //     try {
    //         // Query to join purchase with purchase_product and purchase_item
    //         const query = `
    //             SELECT p.*, 
    //                    pp.id AS product_purchase_id, 
    //                    pp.product_id AS product_id, 
    //                    pp.quantity AS product_quantity, 
    //                    pp.unit_id AS product_unit_id, 
    //                    pp.purchase_price AS product_purchase_price, 
    //                    pp.sale_price AS product_sale_price, 
    //                    pp.created_by AS product_created_by, 
    //                    pp.created_date AS product_created_date, 
    //                    pp.modified_by AS product_modified_by, 
    //                    pp.modified_date AS product_modified_date,
    //                    pi.id AS item_id, 
    //                    pi.item_name, 
    //                    pi.quantity AS item_quantity, 
    //                    pi.unit_id AS item_unit_id, 
    //                    pi.purchase_price AS item_purchase_price, 
    //                    pi.sale_price AS item_sale_price, 
    //                    pi.created_by AS item_created_by, 
    //                    pi.created_date AS item_created_date, 
    //                    pi.modified_by AS item_modified_by, 
    //                    pi.modified_date AS item_modified_date
    //             FROM purchase p
    //             LEFT JOIN purchase_product pp ON p.id = pp.purchase_id
    //             LEFT JOIN purchase_item pi ON p.id = pi.purchase_id
    //         `;

    //         connection.query(query, function (error, results) {
    //             if (error) {
    //                 console.log(error);
    //                 return res.status(500).send({ error: 'Database query failed.' });
    //             }

    //             // Format the result into a more structured object
    //             const purchases = results.reduce((acc, row) => {
    //                 // Find or create a purchase entry in the accumulator
    //                 let purchase = acc.find(p => p.id === row.id);
    //                 if (!purchase) {
    //                     purchase = {
    //                         id: row.id,
    //                         supplier_id: row.supplier_id,
    //                         product_id: row.product_id,
    //                         quantity: row.quantity,
    //                         unit_id: row.unit_id,
    //                         purchase_price: row.purchase_price,
    //                         sale_price: row.sale_price,
    //                         total_amount: row.total_amount,
    //                         discount: row.discount,
    //                         due: row.due,
    //                         paid_amount: row.paid_amount,
    //                         purchase_invoice: row.purchase_invoice,
    //                         purchase_date: row.purchase_date,
    //                         invoice_id: row.invoice_id,
    //                         purchase_type: row.purchase_type,
    //                         created_by: row.created_by,
    //                         modified_by: row.modified_by,
    //                         created_date: row.created_date,
    //                         modified_date: row.modified_date,
    //                         purchase_product: [],
    //                         purchase_item: []
    //                     };
    //                     acc.push(purchase);
    //                 }

    //                 // Add product data if it exists
    //                 if (row.product_purchase_id) {
    //                     purchase.purchase_product.push({
    //                         id: row.product_purchase_id,
    //                         quantity: row.product_quantity,
    //                         unit_id: row.product_unit_id,
    //                         purchase_price: row.product_purchase_price,
    //                         sale_price: row.product_sale_price,
    //                         created_by: row.product_created_by,
    //                         created_date: row.product_created_date,
    //                         modified_by: row.product_modified_by,
    //                         modified_date: row.product_modified_date
    //                     });
    //                 }

    //                 // Add item data if it exists
    //                 if (row.item_id) {
    //                     purchase.purchase_item.push({
    //                         id: row.item_id,
    //                         item_name: row.item_name,
    //                         quantity: row.item_quantity,
    //                         unit_id: row.item_unit_id,
    //                         purchase_price: row.item_purchase_price,
    //                         sale_price: row.item_sale_price,
    //                         created_by: row.item_created_by,
    //                         created_date: row.item_created_date,
    //                         modified_by: row.item_modified_by,
    //                         modified_date: row.item_modified_date
    //                     });
    //                 }

    //                 return acc;
    //             }, []);

    //             res.send(purchases);
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).send({ error: 'An error occurred while fetching purchase data.' });
    //     }
    // },

    // purchase_single: async (req, res) => {
    //     const purchaseId = req.params.id; // Assuming the purchase ID is passed as a route parameter

    //     try {
    //         // Parameterized query to join purchase with purchase_product and purchase_item where purchase.id matches the provided ID
    //         const query = `
    //             SELECT p.*, 
    //                    pp.id AS product_id, 
    //                    pp.quantity AS product_quantity, 
    //                    pp.unit_id AS product_unit_id, 
    //                    pp.purchase_price AS product_purchase_price, 
    //                    pp.sale_price AS product_sale_price, 
    //                    pp.created_by AS product_created_by, 
    //                    pp.created_date AS product_created_date, 
    //                    pp.modified_by AS product_modified_by, 
    //                    pp.modified_date AS product_modified_date,
    //                    pi.id AS item_id, 
    //                    pi.item_name, 
    //                    pi.quantity AS item_quantity, 
    //                    pi.unit_id AS item_unit_id, 
    //                    pi.purchase_price AS item_purchase_price, 
    //                    pi.sale_price AS item_sale_price, 
    //                    pi.created_by AS item_created_by, 
    //                    pi.created_date AS item_created_date, 
    //                    pi.modified_by AS item_modified_by, 
    //                    pi.modified_date AS item_modified_date
    //             FROM purchase p
    //             LEFT JOIN purchase_product pp ON p.id = pp.purchase_id
    //             LEFT JOIN purchase_item pi ON p.id = pi.purchase_id
    //             WHERE p.id = ? 
    //         `;

    //         connection.query(query, [purchaseId], function (error, results) {
    //             if (error) {
    //                 console.log(error);
    //                 return res.status(500).send({ error: 'Database query failed.' });
    //             }

    //             // Format the result into a more structured object
    //             const purchases = results.reduce((acc, row) => {
    //                 // Find or create a purchase entry in the accumulator
    //                 let purchase = acc.find(p => p.id === row.id);
    //                 if (!purchase) {
    //                     purchase = {
    //                         id: row.id,
    //                         supplier_id: row.supplier_id,
    //                         product_id: row.product_id,
    //                         quantity: row.quantity,
    //                         unit_id: row.unit_id,
    //                         purchase_price: row.purchase_price,
    //                         sale_price: row.sale_price,
    //                         total_amount: row.total_amount,
    //                         discount: row.discount,
    //                         due: row.due,
    //                         paid_amount: row.paid_amount,
    //                         purchase_invoice: row.purchase_invoice,
    //                         purchase_date: row.purchase_date,
    //                         invoice_id: row.invoice_id,
    //                         purchase_type: row.purchase_type,
    //                         created_by: row.created_by,
    //                         modified_by: row.modified_by,
    //                         created_date: row.created_date,
    //                         modified_date: row.modified_date,
    //                         purchase_product: [],
    //                         purchase_item: []
    //                     };
    //                     acc.push(purchase);
    //                 }

    //                 // Add product data if it exists
    //                 if (row.product_id) {
    //                     purchase.purchase_product.push({
    //                         id: row.product_id,
    //                         quantity: row.product_quantity,
    //                         unit_id: row.product_unit_id,
    //                         purchase_price: row.product_purchase_price,
    //                         sale_price: row.product_sale_price,
    //                         created_by: row.product_created_by,
    //                         created_date: row.product_created_date,
    //                         modified_by: row.product_modified_by,
    //                         modified_date: row.product_modified_date
    //                     });
    //                 }

    //                 // Add item data if it exists
    //                 if (row.item_id) {
    //                     purchase.purchase_item.push({
    //                         id: row.item_id,
    //                         item_name: row.item_name,
    //                         quantity: row.item_quantity,
    //                         unit_id: row.item_unit_id,
    //                         purchase_price: row.item_purchase_price,
    //                         sale_price: row.item_sale_price,
    //                         created_by: row.item_created_by,
    //                         created_date: row.item_created_date,
    //                         modified_by: row.item_modified_by,
    //                         modified_date: row.item_modified_date
    //                     });
    //                 }

    //                 return acc;
    //             }, []);

    //             res.send(purchases);
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).send({ error: 'An error occurred while fetching purchase data.' });
    //     }
    // },

    purchase_list: async (req, res) => {
        try {
            // Query to join purchase with purchase_product, purchase_item, product, supplier_address, unit, and purchase_type
            const query = `
                SELECT p.*, 
                       pp.id AS product_purchase_id, 
                       pp.product_id AS product_id, 
                       pp.quantity AS product_quantity, 
                       pp.unit_id AS product_unit_id, 
                       pp.purchase_price AS product_purchase_price, 
                       pp.sale_price AS product_sale_price, 
                       pp.created_by AS product_created_by, 
                       pp.created_date AS product_created_date, 
                       pp.modified_by AS product_modified_by, 
                       pp.modified_date AS product_modified_date,
                       pi.id AS item_id, 
                       pi.item_name, 
                       pi.quantity AS item_quantity, 
                       pi.unit_id AS item_unit_id, 
                       pi.purchase_price AS item_purchase_price, 
                       pi.sale_price AS item_sale_price, 
                       pi.created_by AS item_created_by, 
                       pi.created_date AS item_created_date, 
                       pi.modified_by AS item_modified_by, 
                       pi.modified_date AS item_modified_date,
                       pr.product_name AS product_name,
                       sa.name AS supplier_name,
                       u.unit_name AS unit_name,
                       pt.name AS purchase_type_name
                FROM purchase p
                LEFT JOIN purchase_product pp ON p.id = pp.purchase_id
                LEFT JOIN purchase_item pi ON p.id = pi.purchase_id
                LEFT JOIN product pr ON pp.product_id = pr.id
                LEFT JOIN supplier_address sa ON p.supplier_id = sa.id
                LEFT JOIN unit u ON pp.unit_id = u.id
                LEFT JOIN purchase_type pt ON p.purchase_type = pt.id
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
                            account: row.account,
                            remarks: row.remarks,
                            payable_amount: row.payable_amount,
                            supplier_name: row.supplier_name,
                            product_id: row.product_id,
                            product_name: row.product_name,
                            quantity: row.quantity,
                            unit_id: row.unit_id,
                            unit_name: row.unit_name,
                            purchase_price: row.purchase_price,
                            sale_price: row.sale_price,
                            total_amount: row.total_amount,
                            discount: row.discount,
                            due: row.due,
                            paid_amount: row.paid_amount,
                            purchase_invoice: row.purchase_invoice,
                            purchase_date: row.purchase_date,
                            invoice_id: row.invoice_id,
                            purchase_type: row.purchase_type,
                            purchase_type_name: row.purchase_type_name,
                            created_by: row.created_by,
                            modified_by: row.modified_by,
                            created_date: row.created_date,
                            modified_date: row.modified_date,
                            purchase_product: [],
                            purchase_item: []
                        };
                        acc.push(purchase);
                    }

                    if (row.product_purchase_id) {
                        purchase.purchase_product.push({
                            id: row.product_purchase_id,
                            product_id: row.product_id,
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
                    }

                    if (row.item_id) {
                        purchase.purchase_item.push({
                            id: row.item_id,
                            item_name: row.item_name,
                            quantity: row.item_quantity,
                            unit_id: row.item_unit_id,
                            unit_name: row.unit_name,
                            purchase_price: row.item_purchase_price,
                            sale_price: row.item_sale_price,
                            created_by: row.item_created_by,
                            created_date: row.item_created_date,
                            modified_by: row.item_modified_by,
                            modified_date: row.item_modified_date
                        });
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


    purchase_single: async (req, res) => {
        const purchaseId = req.params.id; // Assuming the purchase ID is passed as a route parameter

        try {
            const query = `
                SELECT p.*, 
                       pp.product_id AS product_id,
                       pp.id AS product_purchase_id,  
                       pp.quantity AS product_quantity, 
                       pp.ware_house_id AS ware_house_id, 
                       pp.unit_id AS product_unit_id, 
                       pp.purchase_price AS product_purchase_price, 
                       pp.sale_price AS product_sale_price, 
                       pp.created_by AS product_created_by, 
                       pp.created_date AS product_created_date, 
                       pp.modified_by AS product_modified_by, 
                       pp.modified_date AS product_modified_date,
                       pi.id AS item_id, 
                       pi.item_name, 
                       pi.quantity AS item_quantity, 
                       pi.unit_id AS item_unit_id, 
                       pi.purchase_price AS item_purchase_price, 
                       pi.sale_price AS item_sale_price, 
                       pi.created_by AS item_created_by, 
                       pi.created_date AS item_created_date, 
                       pi.modified_by AS item_modified_by, 
                       pi.modified_date AS item_modified_date
                FROM purchase p
                LEFT JOIN purchase_product pp ON p.id = pp.purchase_id
                LEFT JOIN purchase_item pi ON p.id = pi.purchase_id
                WHERE p.id = ? 
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
                            product_id: row.product_id,
                            previous_due: row.previous_due,
                            supplier_id: row.supplier_id,
                            quantity: row.quantity,

                            unit_id: row.unit_id,
                            account: row.account,
                            remarks: row.remarks,
                            payable_amount: row.payable_amount,
                            purchase_price: row.purchase_price,
                            sale_price: row.sale_price,
                            total_amount: row.total_amount,
                            discount: row.discount,
                            due: row.due,
                            paid_amount: row.paid_amount,
                            purchase_invoice: row.purchase_invoice,
                            purchase_date: row.purchase_date,
                            invoice_id: row.invoice_id,
                            purchase_type: row.purchase_type,
                            created_by: row.created_by,
                            modified_by: row.modified_by,
                            created_date: row.created_date,
                            modified_date: row.modified_date,
                            purchase_product: row.purchase_type == 1 ? [] : undefined,
                            purchase_item: row.purchase_type == 2 ? [] : undefined
                        };
                        acc.push(purchase);
                    }

                    if (row.product_purchase_id && row.purchase_type == 1) {
                        purchase.purchase_product.push({
                            id: row.product_purchase_id,
                            quantity: row.product_quantity,
                            product_id: row.product_id,
                            ware_house_id: row.ware_house_id,
                            unit_id: row.product_unit_id,
                            purchase_price: row.product_purchase_price,
                            sale_price: row.product_sale_price,
                            created_by: row.product_created_by,
                            created_date: row.product_created_date,
                            modified_by: row.product_modified_by,
                            modified_date: row.product_modified_date
                        });
                    }

                    if (row.item_id && row.purchase_type == 2) {
                        purchase.purchase_item.push({
                            id: row.item_id,
                            item_name: row.item_name,
                            quantity: row.item_quantity,
                            unit_id: row.item_unit_id,
                            purchase_price: row.item_purchase_price,
                            sale_price: row.item_sale_price,
                            created_by: row.item_created_by,
                            created_date: row.item_created_date,
                            modified_by: row.item_modified_by,
                            modified_date: row.item_modified_date
                        });
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




    // purchase_update: async (req, res) => {

    //     try {
    //         const {
    //             supplier_id,
    //             product_id,
    //             quantity,
    //             unit_id,
    //             purchase_price,
    //             sale_price,
    //             total_amount,
    //             discount,
    //             due,
    //             paid_amount,
    //             purchase_invoice,
    //             purchase_date,
    //             invoice_id,
    //             purchase_type,
    //             modified_by,
    //             item_name,
    //             purchase_product_id, // assume `purchase_product_id` is passed to identify the product record
    //             purchase_item_id // assume `purchase_item_id` is passed to identify the item record
    //         } = req.body;

    //         const purchase_id = req.params.id; // Get purchase_id from req.params
    //         // Begin the transaction
    //         await new Promise((resolve, reject) => connection.beginTransaction(err => err ? reject(err) : resolve()));

    //         // Update the purchase table
    //         const updatePurchaseQuery = `
    //             UPDATE purchase
    //             SET 
    //                 supplier_id = ?, product_id = ?, quantity = ?, unit_id = ?, 
    //                 purchase_price = ?, sale_price = ?, total_amount = ?, discount = ?, 
    //                 due = ?, paid_amount = ?, purchase_invoice = ?, purchase_date = ?, 
    //                 invoice_id = ?, purchase_type = ?, modified_by = ?
    //             WHERE id = ?
    //         `;
    //         const purchaseParams = [
    //             supplier_id, product_id, quantity, unit_id, purchase_price, 
    //             sale_price, total_amount, discount, due, paid_amount, 
    //             purchase_invoice, purchase_date, invoice_id, purchase_type, modified_by, purchase_id
    //         ];

    //         await new Promise((resolve, reject) => {
    //             connection.query(updatePurchaseQuery, purchaseParams, (err, results) => {
    //                 if (err) return reject(err);
    //                 resolve(results);
    //             });
    //         });

    //         // Update the purchase_product table
    //         const updateProductQuery = `
    //             UPDATE purchase_product
    //             SET 
    //                 product_id = ?, quantity = ?, unit_id = ?, 
    //                 purchase_price = ?, sale_price = ?, modified_by = ?
    //             WHERE id = ?
    //         `;
    //         const productParams = [
    //             product_id, quantity, unit_id, purchase_price, 
    //             sale_price, modified_by, purchase_product_id
    //         ];

    //         await new Promise((resolve, reject) => {
    //             connection.query(updateProductQuery, productParams, (err, results) => {
    //                 if (err) return reject(err);
    //                 resolve(results);
    //             });
    //         });

    //         // Update the purchase_item table
    //         const updateItemQuery = `
    //             UPDATE purchase_item
    //             SET 
    //                 item_name = ?, quantity = ?, unit_id = ?, 
    //                 purchase_price = ?, sale_price = ?, modified_by = ?
    //             WHERE id = ?
    //         `;
    //         const itemParams = [
    //             item_name, quantity, unit_id, purchase_price, 
    //             sale_price, modified_by, purchase_item_id
    //         ];

    //         await new Promise((resolve, reject) => {
    //             connection.query(updateItemQuery, itemParams, (err, results) => {
    //                 if (err) return reject(err);
    //                 resolve(results);
    //             });
    //         });

    //         // Commit the transaction
    //         await new Promise((resolve, reject) => connection.commit(err => err ? reject(err) : resolve()));

    //         res.status(200).json({ message: 'Purchase updated successfully' });
    //     } catch (error) {
    //         console.error("Error updating data:", error);

    //         // Rollback the transaction on error
    //         await new Promise((resolve, reject) => connection.rollback(err => err ? reject(err) : resolve()));

    //         res.status(500).json({ message: "Error updating data." });
    //     }
    // },





    // purchase_delete: async (req, res) => {
    //     try {
    //         const query = 'DELETE FROM purchase WHERE id = ?';
    //         connection.query(query, [req.params.id], (error, result) => {
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

    purchase_delete: async (req, res) => {
        try {
            const purchaseId = req.params.id;
            const getTypeQuery = 'SELECT purchase_type FROM purchase WHERE id = ?';

            // Step 1: Get the purchase type
            connection.query(getTypeQuery, [purchaseId], (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Error fetching purchase type' });
                }

                if (result.length === 0) {
                    return res.status(404).json({ message: 'Product not found.' });
                }

                const purchaseType = result[0].purchase_type;

                // Step 2: Based on purchase_type, delete from the related table
                let deleteRelatedQuery = '';
                if (purchaseType === 1) {
                    deleteRelatedQuery = 'DELETE FROM purchase_product WHERE purchase_id = ?';
                } else if (purchaseType === 2) {
                    deleteRelatedQuery = 'DELETE FROM purchase_item WHERE purchase_id = ?';
                }

                if (deleteRelatedQuery) {
                    connection.query(deleteRelatedQuery, [purchaseId], (error, result) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: 'Error deleting related records' });
                        }

                        // Step 3: Delete from purchase table
                        const deletePurchaseQuery = 'DELETE FROM purchase WHERE id = ?';
                        connection.query(deletePurchaseQuery, [purchaseId], (error, result) => {
                            if (!error && result.affectedRows > 0) {
                                console.log(result);
                                return res.send(result);
                            } else {
                                console.log(error || 'Product not found');
                                return res.status(404).json({ message: 'Product not found.' });
                            }
                        });
                    });
                } else {
                    return res.status(400).json({ message: 'Invalid purchase type.' });
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },



    purchase_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);

        try {
            const skipRows = (pageNo - 1) * perPage;

            // Parameterized query to join purchase with purchase_product and purchase_item
            const query = `
                   SELECT 
                    p.*, 
                    pp.id AS product_purchase_id, 
                    pp.product_id AS product_id, 
                    pp.quantity AS product_quantity, 
                    pp.unit_id AS product_unit_id, 
                    pp.purchase_price AS product_purchase_price, 
                    pp.sale_price AS product_sale_price, 
                    pp.created_by AS product_created_by, 
                    pp.created_date AS product_created_date, 
                    pp.modified_by AS product_modified_by, 
                    pp.modified_date AS product_modified_date,
                    pi.id AS item_id, 
                    pi.item_name, 
                    pi.quantity AS item_quantity, 
                    pi.unit_id AS item_unit_id, 
                    pi.purchase_price AS item_purchase_price, 
                    pi.sale_price AS item_sale_price, 
                    pi.created_by AS item_created_by, 
                    pi.created_date AS item_created_date, 
                    pi.modified_by AS item_modified_by, 
                    pi.modified_date AS item_modified_date,
                    pr.product_name AS product_name,
                    sa.name AS supplier_name,
                    u.unit_name AS product_unit_name,
                    u2.unit_name AS item_unit_name,
                    pt.name AS purchase_type_name,
                    u_full.full_name AS created_by_name
                        FROM purchase p
                        LEFT JOIN purchase_product pp ON p.id = pp.purchase_id
                        LEFT JOIN purchase_item pi ON p.id = pi.purchase_id
                        LEFT JOIN product pr ON pp.product_id = pr.id
                        LEFT JOIN supplier_address sa ON p.supplier_id = sa.id
                        LEFT JOIN unit u ON pp.unit_id = u.id
                        LEFT JOIN unit u2 ON pi.unit_id = u2.id
                        LEFT JOIN purchase_type pt ON p.purchase_type = pt.id
                        LEFT JOIN users u_full ON p.created_by = u_full.id
                        ORDER BY p.id DESC
                        LIMIT ?, ?;

            `;

            connection.query(query, [skipRows, perPage], function (error, results) {
                if (error) {
                    console.log(error);
                    return res.status(500).send({ error: 'Database query failed.' });
                }

                // Format the result into a more structured object
                const purchases = results.reduce((acc, row) => {
                    // Find or create a purchase entry in the accumulator
                    let purchase = acc.find(p => p.id === row.id);
                    if (!purchase) {
                        purchase = {
                            id: row.id,
                            supplier_id: row.supplier_id,
                            supplier_name: row.supplier_name,
                            product_id: row.product_id,
                            product_name: row.product_name,
                            created_by_name: row.created_by_name,
                            quantity: row.quantity,
                            payable_amount: row.payable_amount,
                            remarks: row.remarks,
                            previous_due: row.previous_due,
                            unit_id: row.unit_id,
                            unit_name: row.unit_name,
                            purchase_price: row.purchase_price,
                            sale_price: row.sale_price,
                            total_amount: row.total_amount,
                            discount: row.discount,
                            due: row.due,
                            paid_amount: row.paid_amount,
                            purchase_invoice: row.purchase_invoice,
                            purchase_date: row.purchase_date,
                            invoice_id: row.invoice_id,
                            purchase_type: row.purchase_type,
                            purchase_type_name: row.purchase_type_name,
                            created_by: row.created_by,
                            modified_by: row.modified_by,
                            created_date: row.created_date,
                            modified_date: row.modified_date,
                            purchase_product: [],
                            purchase_item: []
                        };
                        acc.push(purchase);
                    }

                    // Add product data if it exists
                    if (row.product_id) {
                        purchase.purchase_product.push({
                            id: row.product_id,
                            quantity: row.product_quantity,
                            product_unit_name: row.product_unit_name,
                            unit_id: row.product_unit_id,
                            purchase_price: row.product_purchase_price,
                            sale_price: row.product_sale_price,
                            created_by: row.product_created_by,
                            created_date: row.product_created_date,
                            modified_by: row.product_modified_by,
                            modified_date: row.product_modified_date
                        });
                    }

                    // Add item data if it exists
                    if (row.item_id) {
                        purchase.purchase_item.push({
                            id: row.item_id,
                            item_name: row.item_name,
                            item_unit_name: row.item_unit_name,
                            quantity: row.item_quantity,
                            unit_id: row.item_unit_id,
                            purchase_price: row.item_purchase_price,
                            sale_price: row.item_sale_price,
                            created_by: row.item_created_by,
                            created_date: row.item_created_date,
                            modified_by: row.item_modified_by,
                            modified_date: row.item_modified_date
                        });
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


    // purchase_search: async (req, res) => {
    //     try {
    //         const { toDate, fromDate, supplier_id, product_id, unit_id, item_name, invoice, purchase_types } = req.body; // Assuming you're sending these in the request body

    //         // Construct the base SQL query
    //         let sql = `
    //             SELECT p.*, 
    //                pp.id AS product_purchase_id, 
    //                pp.product_id AS product_id, 
    //                pp.quantity AS product_quantity, 
    //                pp.unit_id AS product_unit_id, 
    //                pp.purchase_price AS product_purchase_price, 
    //                pp.sale_price AS product_sale_price, 
    //                pp.created_by AS product_created_by, 
    //                pp.created_date AS product_created_date, 
    //                pp.modified_by AS product_modified_by, 
    //                pp.modified_date AS product_modified_date,
    //                pi.id AS item_id, 
    //                pi.item_name, 
    //                pi.quantity AS item_quantity, 
    //                pi.unit_id AS item_unit_id, 
    //                pi.purchase_price AS item_purchase_price, 
    //                pi.sale_price AS item_sale_price, 
    //                pi.created_by AS item_created_by, 
    //                pi.created_date AS item_created_date, 
    //                pi.modified_by AS item_modified_by, 
    //                pi.modified_date AS item_modified_date,
    //                pr.product_name AS product_name,
    //                sa.name AS supplier_name,
    //                u.unit_name AS unit_name,
    //                pt.name AS purchase_type_name
    //         FROM purchase p
    //         LEFT JOIN purchase_product pp ON p.id = pp.purchase_id
    //         LEFT JOIN purchase_item pi ON p.id = pi.purchase_id
    //         LEFT JOIN product pr ON pp.product_id = pr.id
    //         LEFT JOIN supplier_address sa ON p.supplier_id = sa.id
    //         LEFT JOIN unit u ON pp.unit_id = u.id
    //         LEFT JOIN purchase_type pt ON p.purchase_type = pt.id
    //             WHERE 1=1
    //         `;

    //         // Add filtering conditions if provided
    //         if (product_id) {
    //             sql += ` AND p.product_id LIKE '%${product_id}%'`; // Assuming you want to search by product ID
    //         }
    //         if (unit_id) {
    //             sql += ` AND p.unit_id LIKE '%${unit_id}%'`; // Assuming you want to search by product unit
    //         }
    //         if (supplier_id) {
    //             sql += ` AND p.supplier_id LIKE '%${supplier_id}%'`; // Assuming you want to search by product unit
    //         }
    //         if (item_name) {
    //             sql += ` AND pi.item_name LIKE '%${item_name}%'`; // Assuming you want to search by product unit
    //         }
    //         if (invoice) {
    //             sql += ` AND p.invoice_id LIKE '%${invoice}%'`; // Assuming you want to search by product unit
    //         }
    //         if (purchase_types) {
    //             sql += ` AND p.purchase_type LIKE '%${purchase_types}%'`; // Assuming you want to search by product unit
    //         }
    //         if (fromDate && toDate) {
    //             sql += ` AND p.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
    //         }

    //         sql += ` ORDER BY p.id DESC`;

    //         console.log("SQL Query:", sql);

    //         // Execute the constructed SQL query
    //         connection.query(sql, function (error, results) {
    //             if (error) {
    //                 console.error("Error occurred during search:", error);
    //                 return res.status(500).json({ error: "An error occurred during search." });
    //             }

    //             // Format the result into a more structured object
    //             const purchases = results.reduce((acc, row) => {
    //                 // Find or create a purchase entry in the accumulator
    //                 let purchase = acc.find(p => p.id === row.id);
    //                 if (!purchase) {
    //                     purchase = {
    //                         id: row.id,
    //                         supplier_id: row.supplier_id,
    //                         supplier_name: row.supplier_name,
    //                         product_id: row.product_id,
    //                         product_name: row.product_name,
    //                         quantity: row.quantity,
    //                         unit_id: row.unit_id,
    //                         unit_name: row.unit_name,
    //                         purchase_price: row.purchase_price,
    //                         sale_price: row.sale_price,
    //                         total_amount: row.total_amount,
    //                         discount: row.discount,
    //                         due: row.due,
    //                         paid_amount: row.paid_amount,
    //                         purchase_invoice: row.purchase_invoice,
    //                         purchase_date: row.purchase_date,
    //                         invoice_id: row.invoice_id,
    //                         purchase_type: row.purchase_type,
    //                         purchase_type_name: row.purchase_type_name,
    //                         created_by: row.created_by,
    //                         modified_by: row.modified_by,
    //                         created_date: row.created_date,
    //                         modified_date: row.modified_date,
    //                         purchase_product: [],
    //                         purchase_item: []
    //                     };
    //                     acc.push(purchase);
    //                 }

    //                 // Add product data if it exists
    //                 if (row.product_id) {
    //                     purchase.purchase_product.push({
    //                         id: row.product_id,
    //                         quantity: row.product_quantity,
    //                         unit_id: row.product_unit_id,
    //                         purchase_price: row.product_purchase_price,
    //                         sale_price: row.product_sale_price,
    //                         created_by: row.product_created_by,
    //                         created_date: row.product_created_date,
    //                         modified_by: row.product_modified_by,
    //                         modified_date: row.product_modified_date
    //                     });
    //                 }

    //                 // Add item data if it exists
    //                 if (row.item_id) {
    //                     purchase.purchase_item.push({
    //                         id: row.item_id,
    //                         item_name: row.item_name,
    //                         quantity: row.item_quantity,
    //                         unit_id: row.item_unit_id,
    //                         purchase_price: row.item_purchase_price,
    //                         sale_price: row.item_sale_price,
    //                         created_by: row.item_created_by,
    //                         created_date: row.item_created_date,
    //                         modified_by: row.item_modified_by,
    //                         modified_date: row.item_modified_date
    //                     });
    //                 }

    //                 return acc;
    //             }, []);

    //             console.log("Search results:", purchases);
    //             res.status(200).json({ results: purchases });
    //         });
    //     } catch (error) {
    //         console.error("An error occurred:", error);
    //         res.status(500).json({ error: "An error occurred." });
    //     }
    // },
    purchase_product_stock_list: async (req, res) => {
        try {
            const query = `
               SELECT 
                p.id AS product_id,
                p.product_name,
                c.id AS category_id,
                c.category_name,
                sc.id AS sub_category_id,
                sc.sub_category_name,
                IFNULL(SUM(sp.quantity), 0) AS sale_product_quantity,
                IFNULL(SUM(pp.quantity), 0) AS purchase_product_quantity,
                 IFNULL(SUM(pp.quantity), 0) - IFNULL(SUM(sp.quantity), 0) AS available_quantity, -- Calculating quantity
                IFNULL(MAX(pp.sale_price), 0) AS sale_price, -- Taking maximum sale_price as an example
                IFNULL(MAX(pp.purchase_price), 0) AS purchase_price -- Taking maximum purchase_price as an example
            FROM product AS p
            LEFT JOIN product_category AS pc ON p.id = pc.product_id
            LEFT JOIN category AS c ON pc.category_id = c.id
            LEFT JOIN product_sub_category AS psc ON p.id = psc.product_id
            LEFT JOIN sub_category AS sc ON psc.sub_category_id = sc.id
            LEFT JOIN sale_product AS sp ON p.id = sp.product_id
            INNER JOIN purchase_product AS pp ON p.id = pp.product_id -- Changed to LEFT JOIN to avoid missing products
            GROUP BY p.id ORDER BY p.id DESC;
            `;

            connection.query(query, function (error, result) {
                if (error) {
                    console.error("Database query error:", error);
                    res.status(500).send({ error: "Database query error" });
                    return;
                }

                res.send(result);
            });
        } catch (error) {
            console.error("Unexpected error:", error);
            res.status(500).send({ error: "Unexpected server error" });
        }
    },

    purchase_product_stock_list_current_month: async (req, res) => {
        try {
            const query = `
                SELECT 
                    p.id AS product_id,
                    p.product_name,
                    c.id AS category_id,
                    c.category_name,
                    sc.id AS sub_category_id,
                    sc.sub_category_name,
                    IFNULL(SUM(sp.quantity), 0) AS sale_product_quantity,
                    IFNULL(SUM(pp.quantity), 0) AS purchase_product_quantity,
                    IFNULL(SUM(pp.quantity), 0) - IFNULL(SUM(sp.quantity), 0) AS available_quantity, -- Calculating quantity
                    IFNULL(MAX(pp.sale_price), 0) AS sale_price, -- Taking maximum sale_price as an example
                    IFNULL(MAX(pp.purchase_price), 0) AS purchase_price -- Taking maximum purchase_price as an example
                FROM product AS p
                LEFT JOIN product_category AS pc ON p.id = pc.product_id
                LEFT JOIN category AS c ON pc.category_id = c.id
                LEFT JOIN product_sub_category AS psc ON p.id = psc.product_id
                LEFT JOIN sub_category AS sc ON psc.sub_category_id = sc.id
                LEFT JOIN sale_product AS sp ON p.id = sp.product_id
                INNER JOIN purchase_product AS pp ON p.id = pp.product_id -- Changed to LEFT JOIN to avoid missing products
                WHERE pp.created_date BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND LAST_DAY(CURDATE())
                GROUP BY p.id
                ORDER BY p.id DESC;
            `;

            connection.query(query, function (error, result) {
                if (error) {
                    console.error("Database query error:", error);
                    res.status(500).send({ error: "Database query error" });
                    return;
                }

                res.send(result);
            });
        } catch (error) {
            console.error("Unexpected error:", error);
            res.status(500).send({ error: "Unexpected server error" });
        }
    },

    purchase_product_stock_list_current_month_ware_house: async (req, res) => {
        try {
            const query = `
                SELECT 
                    p.id AS product_id,
                    p.product_name,
                    c.id AS category_id,
                    c.category_name,
                    sc.id AS sub_category_id,
                    sc.sub_category_name,
                    IFNULL(SUM(sp.quantity), 0) AS sale_product_quantity,
                    IFNULL(SUM(pp.quantity), 0) AS purchase_product_quantity,
                    IFNULL(SUM(pp.quantity), 0) - IFNULL(SUM(sp.quantity), 0) AS available_quantity, -- Calculating quantity
                    IFNULL(MAX(pp.sale_price), 0) AS sale_price, -- Taking maximum sale_price as an example
                    IFNULL(MAX(pp.purchase_price), 0) AS purchase_price, -- Taking maximum purchase_price as an example
                    pp.ware_house_id,
                    wh.name as ware_house_name
                FROM product AS p
                LEFT JOIN product_category AS pc ON p.id = pc.product_id
                LEFT JOIN category AS c ON pc.category_id = c.id
                LEFT JOIN product_sub_category AS psc ON p.id = psc.product_id
                LEFT JOIN sub_category AS sc ON psc.sub_category_id = sc.id
                LEFT JOIN sale_product AS sp ON p.id = sp.product_id
                INNER JOIN purchase_product AS pp ON p.id = pp.product_id
                LEFT JOIN ware_house AS wh ON pp.ware_house_id = wh.id -- Joining with ware_house table
                WHERE pp.created_date BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND LAST_DAY(CURDATE())
                GROUP BY p.id, pp.ware_house_id -- Grouping by product_id and ware_house_id
                ORDER BY p.id DESC;
            `;

            connection.query(query, function (error, result) {
                if (error) {
                    console.error("Database query error:", error);
                    res.status(500).send({ error: "Database query error" });
                    return;
                }

                res.send(result);
            });
        } catch (error) {
            console.error("Unexpected error:", error);
            res.status(500).send({ error: "Unexpected server error" });
        }
    },


    purchase_product_stock_list_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { fromDate, toDate, product_id, supplier_id } = req.body;

            // Construct the base SQL query
            let sql = `
                SELECT 
                    p.id AS product_id,
                    p.product_name,
                    c.id AS category_id,
                    c.category_name,
                    sc.id AS sub_category_id,
                    sc.sub_category_name,
                    IFNULL(SUM(sp.quantity), NULL) AS sale_product_quantity,
                    IFNULL(SUM(pp.quantity), NULL) AS purchase_product_quantity,
                    IFNULL(SUM(pp.quantity), 0) - IFNULL(SUM(sp.quantity), 0) AS available_quantity, -- Calculating quantity
                    IFNULL(MAX(pp.sale_price), NULL) AS sale_price, 
                    IFNULL(MAX(pp.purchase_price), NULL) AS purchase_price 
                FROM product AS p
                LEFT JOIN product_category AS pc ON p.id = pc.product_id
                LEFT JOIN category AS c ON pc.category_id = c.id
                LEFT JOIN product_sub_category AS psc ON p.id = psc.product_id
                LEFT JOIN sub_category AS sc ON psc.sub_category_id = sc.id
                LEFT JOIN sale_product AS sp ON p.id = sp.product_id
                INNER JOIN purchase_product AS pp ON p.id = pp.product_id
                WHERE 1 = 1
            `;

            // Add filters dynamically
            if (fromDate && toDate) {
                sql += ` AND pp.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
            }
            if (supplier_id) {
                sql += ` AND c.id LIKE '${supplier_id}'`;
            }
            if (product_id) {
                sql += ` AND sc.id LIKE '${product_id}'`;
            }

            // Finalize query with ordering
            sql += ` GROUP BY p.id ORDER BY p.id DESC`;

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


    purchase_product_stock_list_current_month_ware_house_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            const { fromDate, toDate, product_id, supplier_id } = req.body;

            // Construct the base SQL query
            let sql = `
                SELECT 
                    p.id AS product_id,
                    p.product_name,
                    c.id AS category_id,
                    c.category_name,
                    sc.id AS sub_category_id,
                    sc.sub_category_name,
                    IFNULL(SUM(sp.quantity), 0) AS sale_product_quantity,
                    IFNULL(SUM(pp.quantity), 0) AS purchase_product_quantity,
                    IFNULL(SUM(pp.quantity), 0) - IFNULL(SUM(sp.quantity), 0) AS available_quantity, -- Calculating quantity
                    IFNULL(MAX(pp.sale_price), 0) AS sale_price, -- Taking maximum sale_price as an example
                    IFNULL(MAX(pp.purchase_price), 0) AS purchase_price, -- Taking maximum purchase_price as an example
                    pp.ware_house_id,
                    wh.name AS ware_house_name
                FROM product AS p
                LEFT JOIN product_category AS pc ON p.id = pc.product_id
                LEFT JOIN category AS c ON pc.category_id = c.id
                LEFT JOIN product_sub_category AS psc ON p.id = psc.product_id
                LEFT JOIN sub_category AS sc ON psc.sub_category_id = sc.id
                LEFT JOIN sale_product AS sp ON p.id = sp.product_id
                INNER JOIN purchase_product AS pp ON p.id = pp.product_id
                LEFT JOIN ware_house AS wh ON pp.ware_house_id = wh.id -- Joining with ware_house table
                WHERE pp.created_date BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND LAST_DAY(CURDATE())`;

            // Add filters dynamically
            if (fromDate && toDate) {
                sql += ` AND pp.created_date BETWEEN '${fromDate}' AND '${toDate}'`;
            }
            if (supplier_id) {
                sql += ` AND c.id LIKE '${supplier_id}'`;
            }
            if (product_id) {
                sql += ` AND sc.id LIKE '${product_id}'`;
            }

            // Finalize query with grouping and ordering
            sql += `
                GROUP BY p.id, pp.ware_house_id -- Grouping by product_id and ware_house_id
                ORDER BY p.id DESC`;

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



    supplier_due_amount_purchase_list_search: async (req, res) => {
        try {
            const { toDate, fromDate, supplier_id } = req.body;

            // Construct the base SQL query with parameterized placeholders
            let sql = `
                 SELECT p.*, 
                   pp.id AS product_purchase_id, 
                   pp.product_id AS product_id, 
                   pp.quantity AS product_quantity, 
                   pp.unit_id AS product_unit_id, 
                   pp.purchase_price AS product_purchase_price, 
                   pp.sale_price AS product_sale_price, 
                   pp.created_by AS product_created_by, 
                   pp.created_date AS product_created_date, 
                   pp.modified_by AS product_modified_by, 
                   pp.modified_date AS product_modified_date,
                   pr.product_name AS product_name,
                   sa.name AS supplier_name,
                   u.unit_name AS product_unit_name,
                   pt.name AS purchase_type_name,
                   u_full.full_name AS full_name -- Adding the full_name from users table
            FROM purchase p
            LEFT JOIN purchase_product pp ON p.id = pp.purchase_id
            LEFT JOIN product pr ON pp.product_id = pr.id
            LEFT JOIN supplier_address sa ON p.supplier_id = sa.id
            LEFT JOIN unit u ON pp.unit_id = u.id
            LEFT JOIN purchase_type pt ON p.purchase_type = pt.id
            LEFT JOIN users u_full ON p.created_by = u_full.id -- Join to match created_by with users.id
            WHERE 1=1
            `;

            // Parameters array for safe binding
            const params = [];

            // Add filtering conditions if provided
            if (supplier_id) {
                sql += ` AND p.supplier_id = ?`;
                params.push(supplier_id);
            }

            if (fromDate && toDate) {
                sql += ` AND p.purchase_date BETWEEN ? AND ?`;
                params.push(fromDate, toDate);
            }

            sql += ` ORDER BY p.id DESC`;

            console.log("SQL Query:", sql);

            // Execute the constructed SQL query with parameters
            connection.query(sql, params, (error, results) => {
                if (error) {
                    console.error("Error during search:", error);
                    return res.status(500).json({ error: "An error occurred during search." });
                }

                // Format the result into a more structured object
                const purchases = [];
                const purchaseMap = new Map();

                results.forEach(row => {
                    let purchase = purchaseMap.get(row.id);
                    if (!purchase) {
                        purchase = {
                            id: row.id,
                            supplier_id: row.supplier_id,
                            supplier_name: row.supplier_name,
                            product_id: row.product_id,

                            quantity: row.product_quantity,
                            unit_id: row.unit_id,
                            unit_name: row.unit_name,
                            remarks: row.remarks,
                            full_name: row.full_name,
                            purchase_price: row.product_purchase_price,
                            sale_price: row.product_sale_price,
                            total_amount: row.total_amount,
                            discount: row.discount,
                            due: row.due,
                            payable_amount: row.payable_amount,
                            paid_amount: row.paid_amount,
                            previous_due: row.previous_due,
                            purchase_invoice: row.purchase_invoice,
                            purchase_date: row.purchase_date,
                            invoice_id: row.invoice_id,
                            purchase_type: row.purchase_type,
                            purchase_type_name: row.purchase_type_name,
                            created_by: row.created_by,
                            modified_by: row.modified_by,
                            created_date: row.created_date,
                            modified_date: row.modified_date,
                            purchase_product: [],
                        };
                        purchaseMap.set(row.id, purchase);
                    }

                    // Add product data if it exists
                    if (row.product_purchase_id) {
                        purchase.purchase_product.push({
                            id: row.product_purchase_id,
                            purchase_id: row.purchase_id,
                            product_name: row.product_name,
                            product_unit_name: row.product_unit_name,
                            quantity: row.product_quantity,
                            unit_id: row.product_unit_id,
                            purchase_price: row.product_purchase_price,
                            sale_price: row.product_sale_price,
                            created_by: row.product_created_by,
                            created_date: row.product_created_date,
                            modified_by: row.product_modified_by,
                            modified_date: row.product_modified_date,
                        });
                    }
                });

                // Filter purchases to include only those with non-empty purchase_product
                const filteredPurchases = Array.from(purchaseMap.values()).filter(
                    purchase => purchase.purchase_product.length > 0
                );

                console.log("Filtered results:", filteredPurchases);
                res.status(200).json({ results: filteredPurchases });
            });
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).json({ error: "An error occurred." });
        }
    },




    purchase_search: async (req, res) => {
        try {
            const { toDate, fromDate, supplier_id, product_id, unit_id, item_name, invoice, purchase_types } = req.body;

            // Construct the base SQL query with parameterized placeholders
            let sql = `
                SELECT p.*, 
                       pp.id AS product_purchase_id, 
                       pp.product_id AS product_id, 
                       pp.quantity AS product_quantity, 
                       pp.unit_id AS product_unit_id, 
                       pp.purchase_price AS product_purchase_price, 
                       pp.sale_price AS product_sale_price, 
                       pp.created_by AS product_created_by, 
                       pp.created_date AS product_created_date, 
                       pp.modified_by AS product_modified_by, 
                       pp.modified_date AS product_modified_date,
                       pi.id AS item_id, 
                       pi.item_name, 
                       pi.quantity AS item_quantity, 
                       pi.unit_id AS item_unit_id, 
                       pi.purchase_price AS item_purchase_price, 
                       pi.sale_price AS item_sale_price, 
                       pi.created_by AS item_created_by, 
                       pi.created_date AS item_created_date, 
                       pi.modified_by AS item_modified_by, 
                       pi.modified_date AS item_modified_date,
                       pr.product_name AS product_name,
                       sa.name AS supplier_name,
                       u.unit_name AS product_unit_name,
                       u2.unit_name AS item_unit_name,
                       pt.name AS purchase_type_name
                FROM purchase p
                LEFT JOIN purchase_product pp ON p.id = pp.purchase_id
                LEFT JOIN purchase_item pi ON p.id = pi.purchase_id
                LEFT JOIN product pr ON pp.product_id = pr.id
                LEFT JOIN supplier_address sa ON p.supplier_id = sa.id
                LEFT JOIN unit u ON pp.unit_id = u.id
                LEFT JOIN unit u2 ON pi.unit_id = u2.id
                LEFT JOIN purchase_type pt ON p.purchase_type = pt.id
                 LEFT JOIN users u_full ON p.created_by = u_full.id
                WHERE 1=1
            `;

            // Parameters array for safe binding
            const params = [];

            // Add filtering conditions if provided
            if (product_id) {
                sql += ` AND pp.product_id LIKE ?`;
                params.push(`%${product_id}%`);
            }
            if (supplier_id) {
                sql += ` AND p.supplier_id LIKE ?`;
                params.push(`%${supplier_id}%`);
            }
            if (unit_id) {
                sql += ` AND p.unit_id LIKE ?`;
                params.push(`%${unit_id}%`);
            }
            if (item_name) {
                sql += ` AND pi.item_name LIKE ?`;
                params.push(`%${item_name}%`);
            }
            if (invoice) {
                sql += ` AND p.invoice_id LIKE ?`;
                params.push(`%${invoice}%`);
            }
            if (purchase_types) {
                sql += ` AND p.purchase_type LIKE ?`;
                params.push(`%${purchase_types}%`);
            }
            if (fromDate && toDate) {
                sql += ` AND p.created_date BETWEEN ? AND ?`;
                params.push(fromDate, toDate);
            }

            sql += ` ORDER BY p.id DESC`;

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
                            supplier_name: row.supplier_name,
                            product_id: row.product_id,
                            product_name: row.product_name,
                            quantity: row.quantity,
                            unit_id: row.unit_id,
                            unit_name: row.unit_name,
                            remarks: row.remarks,
                            purchase_price: row.purchase_price,
                            sale_price: row.sale_price,
                            total_amount: row.total_amount,
                            discount: row.discount,
                            due: row.due,
                            created_by_name: row.created_by_name,
                            payable_amount: row.payable_amount,
                            paid_amount: row.paid_amount,
                            previous_due: row.previous_due,
                            purchase_invoice: row.purchase_invoice,
                            purchase_date: row.purchase_date,
                            invoice_id: row.invoice_id,
                            purchase_type: row.purchase_type,
                            purchase_type_name: row.purchase_type_name,
                            created_by: row.created_by,
                            modified_by: row.modified_by,
                            created_date: row.created_date,
                            modified_date: row.modified_date,
                            purchase_product: [],
                            purchase_item: []
                        };
                        acc.push(purchase);
                    }

                    // Add product data if it exists
                    if (row.product_purchase_id) {
                        purchase.purchase_product.push({
                            id: row.product_purchase_id,
                            product_unit_name: row.product_unit_name,
                            quantity: row.product_quantity,
                            unit_id: row.product_unit_id,
                            purchase_price: row.product_purchase_price,
                            sale_price: row.product_sale_price,
                            created_by: row.product_created_by,
                            created_date: row.product_created_date,
                            modified_by: row.product_modified_by,
                            modified_date: row.product_modified_date
                        });
                    }

                    // Add item data if it exists
                    if (row.item_id) {
                        purchase.purchase_item.push({
                            id: row.item_id,
                            item_name: row.item_name,
                            item_unit_name: row.item_unit_name,
                            quantity: row.item_quantity,
                            unit_id: row.item_unit_id,
                            purchase_price: row.item_purchase_price,
                            sale_price: row.item_sale_price,
                            created_by: row.item_created_by,
                            created_date: row.item_created_date,
                            modified_by: row.item_modified_by,
                            modified_date: row.item_modified_date
                        });
                    }

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


    purchase_pdf: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize } = req.body;



            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

        
                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.supplier_name}</td>`; // Person Name
                row += `<td>${result.invoice_id}</td>`; // Person Name
                row += `<td>${result.total_amount}</td>`; // Person Name
                row += `<td>${result.previous_due}</td>`; // Person Name
                row += `<td>${result.payable_amount}</td>`; // Person Name
                row += `<td>${result.discount}</td>`; // Person Name
                row += `<td>${result.paid_amount}</td>`; // Person Name
                row += `<td>${result.due}</td>`; // Person Name
                row += `<td>${result.remarks}</td>`; // Person Name
                row += `<td>${result.purchase_date.slice(0, 10)}</td>`; // Person Name
                row += `<td>${result.created_date.slice(0, 10)}</td>`; // Person Name
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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Purchase List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Purchase List</h3>
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
                                                                        Supplier Name
                                                                    </th>
                                                                    <th>
                                                                        Invoice
                                                                    </th>
                                                                    <th>
                                                                        Bill Amount
                                                                    </th>

                                                                    <th>
                                                                        Previous Due
                                                                    </th>
                                                                    <th>
                                                                        Total Amount
                                                                    </th>
                                                                    <th>
                                                                        Discount
                                                                    </th>
                                                                    <th>
                                                                        Paid Amount
                                                                    </th>
                                                                    <th>
                                                                        Due
                                                                    </th>
                                                                    <th>
                                                                        Remarks
                                                                    </th>
                                                                    <th>
                                                                        Purchase Date
                                                                    </th>
                                                                    <th>
                                                                        Created Date
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



    purchase_print: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize, extraColumnValue } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';



                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.supplier_name}</td>`; // Person Name
                row += `<td>${result.invoice_id}</td>`; // Person Name
                row += `<td>${result.total_amount}</td>`; // Person Name
                row += `<td>${result.previous_due}</td>`; // Person Name
                row += `<td>${result.payable_amount}</td>`; // Person Name
                row += `<td>${result.discount}</td>`; // Person Name
                row += `<td>${result.paid_amount}</td>`; // Person Name
                row += `<td>${result.due}</td>`; // Person Name
                row += `<td>${result.remarks}</td>`; // Person Name
                row += `<td>${result.purchase_date.slice(0, 10)}</td>`; // Person Name
                row += `<td>${result.created_date.slice(0, 10)}</td>`; // Person Name

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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Purchase List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Purchase List</h3>
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
                                                                        Supplier Name
                                                                    </th>
                                                                    <th>
                                                                        Invoice
                                                                    </th>
                                                                    <th>
                                                                        Bill Amount
                                                                    </th>

                                                                    <th>
                                                                        Previous Due
                                                                    </th>
                                                                    <th>
                                                                        Total Amount
                                                                    </th>
                                                                    <th>
                                                                        Discount
                                                                    </th>
                                                                    <th>
                                                                        Paid Amount
                                                                    </th>
                                                                    <th>
                                                                        Due
                                                                    </th>
                                                                    <th>
                                                                        Remarks
                                                                    </th>
                                                                    <th>
                                                                        Purchase Date
                                                                    </th>
                                                                    <th>
                                                                        Created Date
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

    supplier_due_amount_purchase: async (req, res) => {
        try {
            const supplier_id = req.params.supplier_id;

            // Query to retrieve the sum of due and paid amounts for the provided supplier_id
            const sql = "SELECT supplier_id, SUM(payable_amount) AS payable_amount,SUM(total_amount) AS total_amount, SUM(due) AS due,SUM(discount) AS discount,  SUM(paid_amount) AS paid_amount FROM purchase WHERE supplier_id = ?";

            connection.query(sql, [supplier_id], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // Check if any record was found
                if (result.length === 0) {
                    return res.status(404).json({ message: 'No data found for the provided supplier_id' });
                }

                // Send the result as JSON response
                res.json(result[0]);
            });
        } catch (error) {
            console.log(error);
        }
    },

    // supplier_due_amount_purchase_list: async (req, res) => {
    //     try {
    //         // Query to retrieve the sum of due and paid amounts for all suppliers, including supplier_name
    //         const sql = `
    //             SELECT 
    //                 p.supplier_id, 
    //                 sa.name AS supplier_name, 
    //                 SUM(p.payable_amount) AS payable_amount,
    //                 SUM(p.total_amount) AS total_amount, 
    //                 SUM(p.due) AS due,
    //                 SUM(p.discount) AS discount,  
    //                 SUM(p.paid_amount) AS paid_amount,
    //                 (SUM(p.total_amount) - (SUM(p.paid_amount) + SUM(p.discount))) AS total_due
    //                 FROM purchase p
    //                 JOIN supplier_address sa ON p.supplier_id = sa.id
    //                 GROUP BY p.supplier_id, sa.name;

    //         `;

    //         connection.query(sql, (err, result) => {
    //             if (err) {
    //                 console.error(err);
    //                 return res.status(500).json({ error: 'Internal server error' });
    //             }

    //             // Check if any record was found
    //             if (result.length === 0) {
    //                 return res.status(404).json({ message: 'No data found for suppliers' });
    //             }

    //             // Send the result as JSON response
    //             res.json(result);
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ error: 'Unexpected server error' });
    //     }
    // },
    supplier_due_amount_purchase_list: async (req, res) => {
        try {
            // Query to retrieve the sum of due and paid amounts for all suppliers, including supplier_name
            const sql = `
                SELECT 
                    p.supplier_id, 
                    sa.name AS supplier_name, 
                    SUM(p.payable_amount) AS payable_amount,
                    SUM(p.total_amount) AS total_amount, 
                    SUM(p.due) AS due,
                    SUM(p.discount) AS discount,  
                    SUM(p.paid_amount) AS paid_amount,
                    (SUM(p.total_amount) - (SUM(p.paid_amount) + SUM(p.discount))) AS total_due
                FROM purchase p
                JOIN supplier_address sa ON p.supplier_id = sa.id
                GROUP BY p.supplier_id, sa.name
                HAVING total_due > 0;
            `;

            connection.query(sql, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // Check if any record was found
                if (result.length === 0) {
                    return res.status(200).json([]);
                }

                // Send the result as JSON response
                res.json(result);
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Unexpected server error' });
        }
    },


    purchase_supplier_due_list: async (req, res) => {
        try {
            // Query to get aggregated supplier-wise data
            const supplierQuery = `
                SELECT 
                    p.supplier_id, 
                    sa.name AS supplier_name, 
                    SUM(p.payable_amount) AS payable_amount,
                    SUM(p.total_amount) AS total_amount, 
                    SUM(p.due) AS due,
                    SUM(p.discount) AS discount,  
                    SUM(p.paid_amount) AS paid_amount,
                    (SUM(p.total_amount) - (SUM(p.paid_amount) + SUM(p.discount))) AS total_due
                FROM purchase p
                JOIN supplier_address sa ON p.supplier_id = sa.id
                GROUP BY p.supplier_id, sa.name
            `;
    
            // Execute the supplier query
            connection.query(supplierQuery, async (error, suppliers) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send({ error: "Failed to fetch supplier data" });
                }
    
                // Fetch purchase product data for each supplier
                const result = await Promise.all(
                    suppliers.map((supplier) => {
                        return new Promise((resolve, reject) => {
                            const productQuery = `
                                SELECT * FROM purchase_product
                                WHERE purchase_id IN (
                                    SELECT id FROM purchase WHERE supplier_id = ?
                                )
                            `;
                            connection.query(productQuery, [supplier.supplier_id], (err, products) => {
                                if (err) return reject(err);
                                resolve({
                                    supplier_id: supplier.supplier_id,
                                    supplier_name: supplier.supplier_name,
                                    payable_amount: supplier.payable_amount,
                                    total_amount: supplier.total_amount,
                                    due: supplier.due,
                                    discount: supplier.discount,
                                    paid_amount: supplier.paid_amount,
                                    total_due: supplier.total_due,
                                    purchase_product: products,
                                });
                            });
                        });
                    })
                );
    
                res.send(result);
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Server error" });
        }
    },
    


    stock_pdf: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize } = req.body;



            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.product_name}</td>`; // Person Name
                row += `<td>${result.category_name}</td>`; // Person Name
                row += `<td>${result.sub_category_name}</td>`; // Person Name
                row += `<td>${result.purchase_product_quantity - result.sale_product_quantity}</td>`; // Person Name

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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Stock List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Stock List</h3>
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
                                                                        Product Name
                                                                    </th>
                                                                    <th>
                                                                        Category
                                                                    </th>
                                                                    <th>
                                                                        Sub Category
                                                                    </th>
                                                                    <th>
                                                                        Quantity
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



    stock_print: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize, extraColumnValue } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.product_name}</td>`; // Person Name
                row += `<td>${result.category_name}</td>`; // Person Name
                row += `<td>${result.sub_category_name}</td>`; // Person Name
                row += `<td>${result.purchase_product_quantity - result.sale_product_quantity}</td>`; // Person Name


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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Stock List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Stock List</h3>
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
                                                                        Product Name
                                                                    </th>
                                                                    <th>
                                                                        Category
                                                                    </th>
                                                                    <th>
                                                                        Sub Category
                                                                    </th>
                                                                    <th>
                                                                        Quantity
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


    stock_details_pdf: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize } = req.body;



            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.product_name}</td>`; // Person Name
                row += `<td>${result.category_name}</td>`; // Person Name
                row += `<td>${result.sub_category_name}</td>`; // Person Name
                row += `<td>${result.purchase_price}</td>`; // Person Name
                row += `<td>${result.sale_price}</td>`; // Person Name
                row += `<td>${result.purchase_product_quantity - result.sale_product_quantity}</td>`; // Person Name

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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Stock List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Stock List</h3>
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
                                                                        Product Name
                                                                    </th>
                                                                    <th>
                                                                        Category
                                                                    </th>
                                                                    <th>
                                                                        Sub Category
                                                                    </th>
                                                                    <th>
                                                                        Purchase Price
                                                                    </th>
                                                                    <th>
                                                                        Sale Price
                                                                    </th>
                                                                    <th>
                                                                        Quantity
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

    stock_details_print: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize, extraColumnValue } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.product_name}</td>`; // Person Name
                row += `<td>${result.category_name}</td>`; // Person Name
                row += `<td>${result.sub_category_name}</td>`; // Person Name
                row += `<td>${result.purchase_price}</td>`; // Person Name
                row += `<td>${result.sale_price}</td>`; // Person Name
                row += `<td>${result.purchase_product_quantity - result.sale_product_quantity}</td>`; // Person Name


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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Stock List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Stock List</h3>
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
                                                                        Product Name
                                                                    </th>
                                                                    <th>
                                                                        Category
                                                                    </th>
                                                                    <th>
                                                                        Sub Category
                                                                    </th>
                                                                    <th>
                                                                        Purchase Price
                                                                    </th>
                                                                    <th>
                                                                        Sale Price
                                                                    </th>
                                                                    <th>
                                                                        Quantity
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



    stock_product_price_pdf: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize, totalAmountSum, totalQuantitySum } = req.body;



            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.product_name}</td>`; // Person Name
                row += `<td>${result.sale_price}</td>`; // Person Name
                row += `<td>${result.purchase_product_quantity - result.sale_product_quantity}</td>`; // Person Name

                row += `<td>${result.sale_price * (result.purchase_product_quantity - result.sale_product_quantity)}</td>`; // Person Name

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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Stock List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Stock List</h3>
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
                                                                        Product Name
                                                                    </th>


                                                                    <th>
                                                                        Unit Price
                                                                    </th>
                                                                    <th>
                                                                        Quantity
                                                                    </th>
                                                                    <th>
                                                                        Total Price
                                                                    </th>


                                                                </tr>

                                                               
           
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                    <tr>
                                                                <td colSpan="3"></td>
                                                                <th>${totalQuantitySum}</th>
                                                                <th>${totalAmountSum}</th>
                                                            </tr>
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

    stock_product_price_print: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize, extraColumnValue, totalAmountSum, totalQuantitySum } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.product_name}</td>`; // Person Name
                row += `<td>${result.sale_price}</td>`; // Person Name
                row += `<td>${result.purchase_product_quantity - result.sale_product_quantity}</td>`; // Person Name

                row += `<td>${result.sale_price * (result.purchase_product_quantity - result.sale_product_quantity)}</td>`; // Person Name


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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Stock List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Stock List</h3>
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
                                                                        Product Name
                                                                    </th>


                                                                    <th>
                                                                        Unit Price
                                                                    </th>
                                                                    <th>
                                                                        Quantity
                                                                    </th>
                                                                    <th>
                                                                        Total Price
                                                                    </th>
              
                 ${[...Array(extraColumnValue)].map((_, i) => `<th contenteditable="true">Extra Column ${i + 1}</th>`).join('')} <!-- Dynamically add headers -->
                           
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                     <tr>
                                                                <td colSpan="3"></td>
                                                                <th>${totalQuantitySum}</th>
                                                                <th>${totalAmountSum}</th>
                                                            </tr>
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



    stock_category_sub_category_print: async (req, res) => {
        try {
            const {
                orientation, selectedPrintSize, fontSize, categories
            } = req.body;

            let financialTableRows = '';

            if (categories.length > 0) {
                financialTableRows += `
                    <thead>
                        <tr class="report-bg w-100">
                            <th>Category / Sub Category</th>
                           
                              <th>Total Quantity</th>
                                 <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${categories.map((category, index) => `
                            <tr class="report-bg">
                                 <th>${category.category_name}</th>
                                <th></th>
                            <th></th>
                            </tr>
                            ${category.subcategories.map((subcategory, subIndex) => `
                                <tr>
                                    <td>${subcategory.sub_category_name}</td>
                                    <td>${subcategory.available_quantity}</td>
                                    <td>${subcategory.total_amount}</td>
                                </tr>
                            `).join('')}
                            <tr class="report-bg">
                                <td>Total</td>
                                <td>${category.totalQuantity}</td>
                                <td>${category.totalAmount}</td>
                            </tr>
                        `).join('')}
    
                       
                        
                        <tr class="report-bg">
                            <th>Sub Total</th>
                            <th>${categories.reduce((sum, cat) => sum + cat.totalQuantity, 0)}</th>
                            <th>${categories.reduce((sum, cat) => sum + cat.totalAmount, 0)}</th>
                        </tr>
                    </tbody>`;
            } else {
                console.log('No data found');
            }

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
                          .report-bg{
                            color:balck;
                            background-color: #ced5e0;
                        }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <h2>Pathshala School & College Stock Category Sub Category</h2>
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
                        <h3 style="text-decoration: underline;">Stock Category Sub Category</h3>
                    </div>
                    <table>
                        ${financialTableRows}
                    </table>
                </body>
                <script>
                    window.print();
                </script>
                </html>`;

            res.send(html);
        } catch (error) {
            console.error('Error in stock_category_sub_category_print:', error);
            res.status(500).send('Error generating print view');
        }
    },

    stock_category_sub_category_pdf: async (req, res) => {
        try {
            const {
                orientation, selectedPrintSize, fontSize, categories
            } = req.body;

            if (!categories || categories.length === 0) {
                console.log('No data found');
                res.status(404).send('No data available');
                return;
            }

            // Generate the financial table rows
            const financialTableRows = `
                <thead>
                     <tr class="report-bg w-100">
                            <th>Category / Sub Category</th>
                          
                             <th>Total Quantity</th>
                            <th>Total</th>
                        </tr>
                </thead>
                <tbody>
                    ${categories.map((category, index) => `
                        <tr class="report-bg">
                            <th>${category.category_name}</th>
                             <th></th>
                            <th></th>
                        </tr>
                        ${category.subcategories.map(subcategory => `
                            <tr>
                                <td>${subcategory.sub_category_name}</td>
                                <td>${subcategory.available_quantity}</td>
                                <td>${subcategory.total_amount}</td>
                            </tr>
                        `).join('')}
                        <tr class="report-bg">
                            <td>Total</td>
                            <td>${category.totalQuantity}</td>
                            <td>${category.totalAmount}</td>
                        </tr>
                    `).join('')}
    
                  
                    <tr class="report-bg">
                        <th>Sub Total</th>
                        <th>${categories.reduce((sum, cat) => sum + cat.totalQuantity, 0)}</th>
                        <th>${categories.reduce((sum, cat) => sum + cat.totalAmount, 0)}</th>
                    </tr>
                </tbody>`;

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
                            .report-bg{
                            color:balck;
                            background-color: #ced5e0;
                        }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <h2>Pathshala School & College Stock Category Sub Category</h2>
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
                        <h3 style="text-decoration: underline;">Stock Category Sub Category</h3>
                    </div>
                    <table>
                        ${financialTableRows}
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
            console.error('Error in stock_category_sub_category_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },



    stock_category_sub_category_print_ware_house: async (req, res) => {
        try {
            const {
                orientation, selectedPrintSize, fontSize, warehouseData
            } = req.body;

            let financialTableRows = '';

            if (warehouseData.length > 0) {
                financialTableRows += `
                    <thead>
                        <tr class="report-bg w-100">
                            <th>Ware House / Category / Sub Category</th>
                          
                             <th>Total Quantity</th>
                                    <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${warehouseData.map((ware_house, index) => `
                            <tr class="report-bg">
                                <th>${ware_house.ware_house_name}</th>
                                <th></th>
                                <th></th>
                            </tr>
                            ${ware_house.categories.map((subcategory, subIndex) => `
                                <tr class="report-bg">
                                    <th>${subcategory.category_name}</th>
                                     <th></th>
                            <th></th>
                                </tr>
                                ${subcategory.subcategories.map((sub, subCatIndex) => `
                                    <tr>
                                        <td>${sub.sub_category_name}</td>
                                        <td>${sub.available_quantity}</td>
                                        <td>${sub.total_amount}</td>
                                    </tr>
                                `).join('')}
                            `).join('')}
                            <tr class="report-bg">
                                <td>Total</td>
                                <td>
                                    ${ware_house.categories.reduce(
                    (sum, category) => sum + category.subcategories.reduce(
                        (subSum, sub) => subSum + sub.available_quantity, 0
                    ), 0
                )}
                                </td>
                                <td>
                                    ${ware_house.categories.reduce(
                    (sum, category) => sum + category.subcategories.reduce(
                        (subSum, sub) => subSum + sub.total_amount, 0
                    ), 0
                )}
                                </td>
                            </tr>
                        `).join('')}
                        <tr class="report-bg">
                            <th>Sub Total</th>
                            <th>
                                ${warehouseData.reduce((sum, wareHouse) => sum + wareHouse.categories.reduce(
                    (catSum, category) => catSum + category.subcategories.reduce(
                        (subSum, sub) => subSum + sub.available_quantity, 0
                    ), 0
                ), 0)}
                            </th>
                            <th>
                                ${warehouseData.reduce((sum, wareHouse) => sum + wareHouse.categories.reduce(
                    (catSum, category) => catSum + category.subcategories.reduce(
                        (subSum, sub) => subSum + sub.total_amount, 0
                    ), 0
                ), 0)}
                            </th>
                        </tr>
                    </tbody>`;
            } else {
                console.log('No data found');
            }

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
                        .report-bg {
                            color: black;
                            background-color: #ced5e0;
                        }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <h2>Pathshala School & College Ware House Report</h2>
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
                        <h3 style="text-decoration: underline;">Ware House Report</h3>
                    </div>
                    <table>
                        ${financialTableRows}
                    </table>
                </body>
                <script>
                    window.print();
                </script>
                </html>`;

            res.send(html);
        } catch (error) {
            console.error('Error in stock_category_sub_category_print:', error);
            res.status(500).send('Error generating print view');
        }
    },


    stock_category_sub_category_pdf_ware_house: async (req, res) => {
        try {
            const {
                orientation, selectedPrintSize, fontSize, warehouseData
            } = req.body;

            if (!warehouseData || warehouseData.length === 0) {
                console.log('No data found');
                res.status(404).send('No data available');
                return;
            }

            // Generate the financial table rows
            const financialTableRows = `
                <thead>
                    <tr class="report-bg w-100">
                        <th>Ware House / Category / Sub Category</th>
                     
                         <th>Total Quantity</th>
                                <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${warehouseData.map((ware_house, index) => `
                        <tr class="report-bg">
                            <th>${ware_house.ware_house_name}</th>
                            <th></th>
                            <th></th>
                        </tr>
                        ${ware_house.categories.map((category, subIndex) => `
                            <tr class="report-bg">
                                <th>${category.category_name}</th>
                                  <th></th>
                        <th></th>
                            </tr>
                            ${category.subcategories.map((subcategory, subCatIndex) => `
                                <tr>
                                    <td>${subcategory.sub_category_name}</td>
                                    <td>${subcategory.available_quantity}</td>
                                    <td>${subcategory.total_amount}</td>
                                </tr>
                            `).join('')}
                        `).join('')}
                        <tr class="report-bg">
                            <td>Total</td>
                            <td>${ware_house.categories.reduce(
                (sum, category) => sum + category.subcategories.reduce(
                    (subSum, sub) => subSum + sub.available_quantity, 0
                ), 0
            )}</td>
                            <td>${ware_house.categories.reduce(
                (sum, category) => sum + category.subcategories.reduce(
                    (subSum, sub) => subSum + sub.total_amount, 0
                ), 0
            )}</td>
                        </tr>
                    `).join('')}
    
                    <tr class="report-bg">
                        <th>Sub Total</th>
                        <th>${warehouseData.reduce(
                (sum, wareHouse) => sum + wareHouse.categories.reduce(
                    (catSum, category) => catSum + category.subcategories.reduce(
                        (subSum, sub) => subSum + sub.available_quantity, 0
                    ), 0
                ), 0
            )}</th>
                        <th>${warehouseData.reduce(
                (sum, wareHouse) => sum + wareHouse.categories.reduce(
                    (catSum, category) => catSum + category.subcategories.reduce(
                        (subSum, sub) => subSum + sub.total_amount, 0
                    ), 0
                ), 0
            )}</th>
                    </tr>
                </tbody>`;

            // HTML structure for the print view
            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';
            const html = `
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Ware House Report</title>
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
                        .report-bg {
                            background-color: #ced5e0;
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
                        <h3 style="text-decoration: underline;">Ware House Report</h3>
                    </div>
                    <table>
                        ${financialTableRows}
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
            console.error('Error in stock_category_sub_category_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },


    supplier_due_pdf: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize } = req.body;



            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                // Static column setup
                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.supplier_name}</td>`; // Person Name
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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Supplier Due List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Supplier Due List</h3>
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

                                                                        Supplier Name
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

    supplier_due_print: async (req, res) => {
        try {
            const { searchResults, selectedPrintSize, orientation, fontSize, extraColumnValue } = req.body;

            console.log(searchResults, 'here all the searchResults');

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';

                row += `<td>${index + 1}</td>`; // Serial column
                row += `<td>${result.supplier_name}</td>`; // Person Name
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
                    <h2 style="margin: 0; padding: 0;">Pathshala School & College Supplier Due List</h2>
                    <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
                    <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
                    <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
                    <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Supplier Due List</h3>
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

                                                                        Supplier Name
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


    purchase_due_list_pdf_single: async (req, res) => {
        try {
            const { searchResults } = req.body;

            if (!searchResults || !searchResults.purchase_product) {
                return res.status(400).send('Invalid request data');
            }

            const saleProducts = searchResults.purchase_product; // Array of products
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
                        <p style="margin: 0; padding: 0;">Date: ${searchResults.purchase_date.slice(0, 10) || 'N/A'}</p>
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

    purchase_due_list_print_single: async (req, res) => {
        try {
            const { searchResults } = req.body;

            if (!searchResults || !searchResults.purchase_product) {
                return res.status(400).send('Invalid request data');
            }

            const saleProducts = searchResults.purchase_product; // Array of products
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
                        <p style="margin: 0; padding: 0;">Date: ${searchResults.purchase_date.slice(0, 10) || 'N/A'}</p>
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

}

module.exports = PurchaseModel