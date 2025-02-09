const connection = require('../../../../connection/config/database')
var wkhtmltopdf = require('wkhtmltopdf');
const express = require('express')
const app = express()
var fs = require("fs");
const { createCanvas } = require('canvas');
const JsBarcode = require('jsbarcode');
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.json({ limit: '10000mb' }));
// app.use(bodyParser.urlencoded({ limit: '10000mb', extended: true }));

// Increase the limit to 50MB (adjust as needed)
app.use(express.json({ limit: '10000mb' }));
app.use(express.urlencoded({ limit: '10000mb', extended: true }));

// Your routes go here

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

const productModel = {

    product_copy: async (req, res) => {
        const productData = req.body;
        try {

            const { product_name,
                status_id,
                product_quantity,
                product_price,
                product_weight,
                product_description,
                created_by } = req.body

            // Start a transaction
            connection.beginTransaction(err => {
                if (err) throw err;
                const insertQuery = `INSERT INTO product ( product_name,
                product_quantity,
                status_id,
                product_price,
                product_weight,
                product_description,
                created_by) VALUES (?,?,?,?,?,?,?);`;
                // Insert data into the product table
                connection.query(insertQuery, [product_name,
                    product_quantity,
                    status_id,
                    product_price,
                    product_weight,
                    product_description,
                    created_by], (err, result) => {
                        if (err) {
                            connection.rollback(() => {
                                throw err;
                            });
                        }

                        if (!result || !result.insertId) {
                            connection.rollback(() => {
                                console.error("Failed to insert product. Result or insertId is undefined.");
                                res.status(500).send("Failed to insert product.");
                                return;
                            });
                        }

                        const productId = result.insertId;
                        console.log(productId)
                        // Insert data into other tables using the productId
                        const insertQueries = [
                            `INSERT INTO product_brand (product_id, brand_id, created_by) VALUES (${productId}, ${productData.brand_id}, '${productData.created_by}')`,
                            `INSERT INTO product_model (product_id, model_id, created_by) VALUES (${productId}, ${productData.model_id}, '${productData.created_by}')`,
                            `INSERT INTO product_category (product_id, category_id, created_by) VALUES (${productId}, ${productData.category_id}, '${productData.created_by}')`,
                            `INSERT INTO product_sub_category (product_id, sub_category_id, created_by) VALUES (${productId}, ${productData.sub_category_id}, '${productData.created_by}')`,
                            // `INSERT INTO product_period (product_id, period_id, created_by) VALUES (${productId}, ${productData.period_id}, '${productData.created_by}')`,
                            // `INSERT INTO product_warranty (product_id, warranty_id, created_by) VALUES (${productId}, ${productData.warranty_id}, '${productData.created_by}')`,
                            `INSERT INTO product_unit (product_id, unit_id, created_by) VALUES (${productId}, ${productData.unit_id ? productData.unit_id : 0}, '${productData.created_by}')`,
                            `INSERT INTO product_material (product_id, material_id, created_by) VALUES (${productId}, ${productData.material_id ? productData.material_id : 0}, '${productData.created_by}')`,
                            `INSERT INTO product_color (product_id, color_id, created_by) VALUES (${productId}, ${productData.color_id ? productData.color_id : 0}, '${productData.created_by}')`,
                            `INSERT INTO product_type (product_id, type_id, created_by) VALUES (${productId}, ${productData.type_id ? productData.type_id : 0}, '${productData.created_by}')`
                        ];

                        // Execute all insert queries
                        const executeInsertQueries = () => {
                            const queries = insertQueries.slice(); // Copy the array to avoid modifying the original
                            const executeNextQuery = () => {
                                const query = queries.shift(); // Get the next query
                                if (!query) { // No more queries left
                                    // Commit the transaction if all insertions were successful
                                    connection.commit(err => {
                                        if (err) {
                                            connection.rollback(() => {
                                                throw err;
                                            });
                                        }
                                        console.log('Transaction completed successfully.');
                                        res.json('Product inserted successfully');
                                    });
                                    return;
                                }
                                connection.query(query, (err) => {
                                    if (err) {
                                        connection.rollback(() => {
                                            throw err;
                                        });
                                    }
                                    executeNextQuery(); // Execute the next query recursively
                                });
                            };
                            executeNextQuery(); // Start executing queries
                        };

                        executeInsertQueries(); // Call the function to start executing the queries
                    });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },


    // product_create: async (req, res) => {
    //     const productDatas = req.body;



    //     try {

    //         for (const productData of productDatas) {
    //             const {
    //                 product_name,
    //                 status_id,
    //                 product_price,
    //                 product_weight,
    //                 product_description,
    //                 created_by,
    //                 file_path,
    //                 file_s,
    //                 file_m,
    //                 file_ms
    //             } = productData;

    //             // Start a transaction
    //             connection.beginTransaction(err => {
    //                 if (err) throw err;
    //                 const insertQuery = `INSERT INTO product ( product_name,
    //             status_id,
    //             product_price,
    //             product_weight,
    //             product_description,
    //             created_by) VALUES (?,?,?,?,?,?);`;
    //                 // Insert data into the product table
    //                 connection.query(insertQuery, [product_name,
    //                     status_id,
    //                     product_price,
    //                     product_weight,
    //                     product_description,
    //                     created_by
    //                 ], (err, result) => {
    //                     if (err) {
    //                         connection.rollback(() => {
    //                             throw err;
    //                         });
    //                     }

    //                     if (!result || !result.insertId) {
    //                         connection.rollback(() => {
    //                             console.error("Failed to insert product. Result or insertId is undefined.");
    //                             res.status(500).send("Failed to insert product.");
    //                             return;
    //                         });
    //                     }

    //                     const productId = result.insertId;
    //                     console.log(productId)
    //                     // Insert data into other tables using the productId
    //                     const insertQueries = [
    //                         `INSERT INTO product_brand (product_id, brand_id, created_by) VALUES (${productId}, ${productData.brand_id}, '${productData.created_by}')`,
    //                         `INSERT INTO product_model (product_id, model_id, created_by) VALUES (${productId}, ${productData.model_id}, '${productData.created_by}')`,
    //                         `INSERT INTO product_category (product_id, category_id, created_by) VALUES (${productId}, ${productData.category_id}, '${productData.created_by}')`,
    //                         `INSERT INTO product_sub_category (product_id, sub_category_id, created_by) VALUES (${productId}, ${productData.sub_category_id}, '${productData.created_by}')`,
    //                         `INSERT INTO product_period (product_id, period_id, created_by) VALUES (${productId}, ${productData.period_id}, '${productData.created_by}')`,
    //                         `INSERT INTO product_unit (product_id, unit_id, created_by) VALUES (${productId}, ${productData.unit_id}, '${productData.created_by}')`,
    //                         `INSERT INTO product_warranty (product_id, warranty_id, created_by) VALUES (${productId}, ${productData.warranty_id}, '${productData.created_by}')`,
    //                         `INSERT INTO product_material (product_id, material_id, created_by) VALUES (${productId}, ${productData.material_id}, '${productData.created_by}')`,
    //                         `INSERT INTO product_color (product_id, color_id, created_by) VALUES (${productId}, ${productData.color_id}, '${productData.created_by}')`,
    //                         `INSERT INTO product_type (product_id, type_id, created_by) VALUES (${productId}, ${productData.type_id}, '${productData.created_by}')`,
    //                         `INSERT INTO product_image (product_id, file_path, file_s, file_m, file_ms) VALUES (${productId}, '${file_path}', '${file_s}', '${file_m}', '${file_ms}')`
    //                     ];

    //                     // Execute all insert queries
    //                     const executeInsertQueries = () => {
    //                         const queries = insertQueries.slice(); // Copy the array to avoid modifying the original
    //                         const executeNextQuery = () => {
    //                             const query = queries.shift(); // Get the next query
    //                             if (!query) { // No more queries left
    //                                 // Commit the transaction if all insertions were successful
    //                                 connection.commit(err => {
    //                                     if (err) {
    //                                         connection.rollback(() => {
    //                                             throw err;
    //                                         });
    //                                     }
    //                                     console.log('Transaction completed successfully.');
    //                                     res.json('Product inserted successfully');
    //                                 });
    //                                 return;
    //                             }
    //                             connection.query(query, (err) => {
    //                                 if (err) {
    //                                     connection.rollback(() => {
    //                                         throw err;
    //                                     });
    //                                 }
    //                                 executeNextQuery(); // Execute the next query recursively
    //                             });
    //                         };
    //                         executeNextQuery(); // Start executing queries
    //                     };

    //                     executeInsertQueries(); // Call the function to start executing the queries
    //                 });
    //             });
    //         }
    //     }
    //     catch (error) {
    //         console.error(error);
    //         res.status(500).json({
    //             message: 'Internal Server Error'
    //         });
    //     }
    // },

    // product_create: async (req, res) => {
    //     let productDatas = req.body;

    //     try {
    //         for (let productData of productDatas) {
    //             let {
    //                 product_name,
    //                 status_id,
    //                 product_quantity,
    //                 product_price,
    //                 product_weight,
    //                 product_description,
    //                 created_by,
    //                 file_path,

    //             } = productData;

    //             connection.beginTransaction(err => {
    //                 if (err) throw err;


    //                 const getMaxBarcodeQuery = 'SELECT MAX(barcode) AS maxBarcode FROM product';

    //                 connection.query(getMaxBarcodeQuery, (err, result) => {
    //                     if (err) {
    //                         connection.rollback(() => {
    //                             throw err;
    //                         });
    //                     }

    //                     // const maxBarcode = result[0]?.maxBarcode || 100000;  // Handle case where there  
    //                     const maxBarcode = (result[0]?.maxBarcode != null) ? result[0].maxBarcode : 0;
    //                     // are no products yet
    //                     const newBarcode = maxBarcode + 1;  // Increment the barcode

    //                     const insertQuery = `INSERT INTO product ( product_name,
    //                     status_id,
    //                     product_quantity,
    //                     product_price,
    //                     product_weight,
    //                     product_description,
    //                     barcode,
    //                     created_by) VALUES (?,?,?,?,?,?,?,?);`;

    //                     connection.query(insertQuery, [product_name,
    //                         status_id,
    //                         product_quantity,
    //                         product_price,
    //                         product_weight,
    //                         product_description,
    //                         newBarcode,
    //                         created_by
    //                     ], (err, result) => {
    //                         if (err) {
    //                             connection.rollback(() => {
    //                                 throw err;
    //                             });
    //                         }

    //                         if (!result || !result.insertId) {
    //                             connection.rollback(() => {
    //                                 console.error("Failed to insert product. Result or insertId is undefined.");
    //                                 res.status(500).send("Failed to insert product.");
    //                                 return;
    //                             });
    //                         }

    //                         const productId = result.insertId;
    //                         console.log(productId)

    //                         const relatedInsertQueries = [
    //                             `INSERT INTO product_brand (product_id, brand_id, created_by) VALUES (${productId}, ${productData.brand_id}, '${productData.created_by}')`,
    //                             `INSERT INTO product_model (product_id, model_id, created_by) VALUES (${productId}, ${productData.model_id}, '${productData.created_by}')`,
    //                             `INSERT INTO product_category (product_id, category_id, created_by) VALUES (${productId}, ${productData.category_id}, '${productData.created_by}')`,
    //                             `INSERT INTO product_sub_category (product_id, sub_category_id, created_by) VALUES (${productId}, ${productData.sub_category_id}, '${productData.created_by}')`,
    //                             // `INSERT INTO product_period (product_id, period_id, created_by) VALUES (${productId}, ${productData.period_id}, '${productData.created_by}')`,

    //                             // `INSERT INTO product_warranty (product_id, warranty_id, created_by) VALUES (${productId}, ${productData.warranty_id}, '${productData.created_by}')`,
    //                             `INSERT INTO product_unit (product_id, unit_id, created_by) VALUES (${productId}, ${productData.unit_id ? productData.unit_id : 0}, '${productData.created_by}')`,
    //                             `INSERT INTO product_material (product_id, material_id, created_by) VALUES (${productId}, ${productData.material_id ? productData.material_id : 0}, '${productData.created_by}')`,
    //                             `INSERT INTO product_color (product_id, color_id, created_by) VALUES (${productId}, ${productData.color_id ? productData.color_id : 0}, '${productData.created_by}')`,
    //                             `INSERT INTO product_type (product_id, type_id, created_by) VALUES (${productId}, ${productData.type_id ? productData.type_id : 0}, '${productData.created_by}')`,
    //                             // `INSERT INTO product_image (product_id, file_path, file_s, file_m, file_ms) VALUES (${productId}, '${file_path}', '${file_s}', '${file_m}', '${file_ms}')`
    //                         ];

    //                         const insertImageQueries = file_path.map(file => `
    //                             INSERT INTO product_image (product_id, file_path, file_s, file_m, file_ms, is_default)
    //                             VALUES (${productId}, '${file.file_path}', '${file.file_s}', '${file.file_m}', '${file.file_ms}', ${file.radio_value});
    //                         `);

    //                         const executeAllQueries = (queries, callback) => {
    //                             if (!queries.length) {
    //                                 callback();
    //                                 return;
    //                             }

    //                             const query = queries.shift();
    //                             connection.query(query, (err) => {
    //                                 if (err) {
    //                                     connection.rollback(() => {
    //                                         throw err;
    //                                     });
    //                                 }
    //                                 executeAllQueries(queries, callback);
    //                             });
    //                         };

    //                         const allQueries = [...relatedInsertQueries, ...insertImageQueries];
    //                         executeAllQueries(allQueries, () => {
    //                             connection.commit(err => {
    //                                 if (err) {
    //                                     connection.rollback(() => {
    //                                         throw err;
    //                                     });
    //                                 }
    //                                 console.log('Transaction completed successfully.');
    //                                 res.json('Products inserted successfully');
    //                             });
    //                         });

    //                         // const executeInsertQueries = () => {
    //                         //     const queries = insertQueries.slice();
    //                         //     const executeNextQuery = () => {
    //                         //         const query = queries.shift();
    //                         //         if (!query) {
    //                         //             connection.commit(err => {
    //                         //                 if (err) {
    //                         //                     connection.rollback(() => {
    //                         //                         throw err;
    //                         //                     });
    //                         //                 }
    //                         //                 console.log('Transaction completed successfully.');
    //                         //             });
    //                         //             return;
    //                         //         }
    //                         //         connection.query(query, (err) => {
    //                         //             if (err) {
    //                         //                 connection.rollback(() => {
    //                         //                     throw err;
    //                         //                 });
    //                         //             }
    //                         //             executeNextQuery();
    //                         //         });
    //                         //     };
    //                         //     executeNextQuery();
    //                         // };

    //                         // executeInsertQueries();
    //                     });
    //                 });
    //             });
    //         }

    //         // Send response after all products are inserted
    //         res.json('Products inserted successfully');
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({
    //             message: 'Internal Server Error'
    //         });
    //     }
    // },

    product_create: async (req, res) => {
        let productDatas = req.body;

        try {
            const executeTransaction = (productData) => {
                return new Promise((resolve, reject) => {
                    let {
                        product_name,
                        status_id,
                        product_quantity,
                        product_price,
                        product_weight,
                        product_description,
                        created_by,
                        file_path,
                    } = productData;

                    connection.beginTransaction(err => {
                        if (err) return reject(err);

                        const getMaxBarcodeQuery = 'SELECT MAX(barcode) AS maxBarcode FROM product';
                        connection.query(getMaxBarcodeQuery, (err, result) => {
                            if (err) {
                                return connection.rollback(() => reject(err));
                            }

                            const maxBarcode = result[0]?.maxBarcode != null ? result[0].maxBarcode : 0;
                            const newBarcode = maxBarcode + 1;

                            const insertQuery = `INSERT INTO product (product_name, status_id, product_quantity, product_price, product_weight, product_description, barcode, created_by) VALUES (?,?,?,?,?,?,?,?)`;

                            connection.query(insertQuery, [product_name, status_id, product_quantity, product_price, product_weight, product_description, newBarcode, created_by], (err, result) => {
                                if (err) {
                                    return connection.rollback(() => reject(err));
                                }

                                if (!result || !result.insertId) {
                                    return connection.rollback(() => reject(new Error("Failed to insert product.")));
                                }

                                const productId = result.insertId;

                                const relatedInsertQueries = [
                                    `INSERT INTO product_brand (product_id, brand_id, created_by) VALUES (${productId}, ${productData.brand_id}, '${productData.created_by}')`,
                                    `INSERT INTO product_model (product_id, model_id, created_by) VALUES (${productId}, ${productData.model_id}, '${productData.created_by}')`,
                                    `INSERT INTO product_category (product_id, category_id, created_by) VALUES (${productId}, ${productData.category_id}, '${productData.created_by}')`,
                                    `INSERT INTO product_sub_category (product_id, sub_category_id, created_by) VALUES (${productId}, ${productData.sub_category_id}, '${productData.created_by}')`,
                                    `INSERT INTO product_unit (product_id, unit_id, created_by) VALUES (${productId}, ${productData.unit_id || 0}, '${productData.created_by}')`,
                                    `INSERT INTO product_material (product_id, material_id, created_by) VALUES (${productId}, ${productData.material_id || 0}, '${productData.created_by}')`,
                                    `INSERT INTO product_color (product_id, color_id, created_by) VALUES (${productId}, ${productData.color_id || 0}, '${productData.created_by}')`,
                                    `INSERT INTO product_type (product_id, type_id, created_by) VALUES (${productId}, ${productData.type_id || 0}, '${productData.created_by}')`,
                                ];

                                const insertImageQueries = file_path.map(file => `
                                    INSERT INTO product_image (product_id, file_path, file_s, file_m, file_ms, is_default)
                                    VALUES (${productId}, '${file.file_path}', '${file.file_s}', '${file.file_m}', '${file.file_ms}', ${file.radio_value});
                                `);

                                const allQueries = [...relatedInsertQueries, ...insertImageQueries];
                                const executeAllQueries = (queries, callback) => {
                                    if (!queries.length) {
                                        callback();
                                        return;
                                    }

                                    const query = queries.shift();
                                    connection.query(query, (err) => {
                                        if (err) {
                                            return connection.rollback(() => reject(err));
                                        }
                                        executeAllQueries(queries, callback);
                                    });
                                };

                                executeAllQueries(allQueries, () => {
                                    connection.commit(err => {
                                        if (err) {
                                            return connection.rollback(() => reject(err));
                                        }
                                        resolve();
                                    });
                                });
                            });
                        });
                    });
                });
            };

            for (let productData of productDatas) {
                await executeTransaction(productData);
            }

            // Send response after all products are inserted
            res.json('Products inserted successfully');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },


    create_quick_product: async (req, res) => {

        // console.log(req.body, 'req bod');

        try {

            for (const single_object of req.body) {
                const {
                    product_name,
                    product_status,
                    file_path,
                    product_price,
                    product_weight,
                    product_description,
                    created_by,
                    product_brand,
                    product_model,
                    product_category,
                    product_sub_category,
                    product_period,
                    product_unit,
                    product_warranty,
                    product_material,
                    product_color,
                    product_type, product_quantity } = single_object;

                let category_id;
                let sub_category_id;
                let product_id;
                let brand_id;
                let model_id;
                let color_id;
                let material_id;
                let period_id;
                let type_id;
                let unit_id;
                let warranty_id;
                let product_status_id;

                product_status == 'Active' ? product_status_id = 1 : product_status == 'Inactive' ? product_status_id = 2 : product_status_id = 3;

                //product create
                const insert_product = await new Promise((resolve, reject) => {
                    connection.query(`INSERT INTO product (product_name, status_id, created_by, product_price, product_description, product_weight, product_quantity) VALUES (?,?,?,?,?,?,?);`, [product_name, product_status_id, created_by, product_price, product_description, product_weight, product_quantity], (error, result) => {
                        error ? reject(error) : resolve(result);
                    });
                });
                product_id = insert_product.insertId;





                // category 
                const [exist_category] = await new Promise((resolve, reject) => { connection.query(`SELECT id FROM category WHERE category_name = ?`, [product_category], (error, result) => { error ? reject(error) : resolve(result); }); });
                if (!exist_category) {
                    const create_category = await new Promise((resolve, reject) => { connection.query(`INSERT INTO category (category_name,created_by, status_id) VALUES (?,?,?);`, [product_category, created_by, 1], (error, result) => { error ? reject(error) : resolve(result); }); });
                    category_id = create_category.insertId;
                } else {
                    category_id = exist_category.id;
                }
                await new Promise((resolve, reject) => { connection.query(`INSERT INTO product_category (product_id, category_id, created_by) VALUES (?,?,?);`, [product_id, category_id, created_by], (error, result) => { error ? reject(error) : resolve(result); }); });





                //sub category
                const [exist_sub_category] = await new Promise((resolve, reject) => { connection.query(`SELECT id FROM sub_category WHERE sub_category_name = ?`, [product_sub_category], (error, result) => { error ? reject(error) : resolve(result); }); });
                if (!exist_sub_category) {
                    const create_sub_category = await new Promise((resolve, reject) => { connection.query(`INSERT INTO sub_category (category_id, sub_category_name, created_by, status_id) VALUES (?,?,?,?);`, [category_id, product_sub_category, created_by, 1], (error, result) => { error ? reject(error) : resolve(result); }); });
                    sub_category_id = create_sub_category.insertId;
                } else {
                    sub_category_id = exist_sub_category.id;
                }
                await new Promise((resolve, reject) => { connection.query(`INSERT INTO product_sub_category (product_id, sub_category_id, created_by) VALUES (?,?,?);`, [product_id, sub_category_id, created_by], (error, result) => { error ? reject(error) : resolve(result); }); });





                //Brand
                const [exist_brand] = await new Promise((resolve, reject) => { connection.query(`SELECT id FROM brand WHERE brand_name = ?`, [product_brand], (error, result) => { error ? reject(error) : resolve(result); }); });
                if (!exist_brand) {
                    const create_brand = await new Promise((resolve, reject) => { connection.query(`INSERT INTO brand (brand_name, created_by, status_id  ) VALUES (?,?,?);`, [product_brand, created_by, 1], (error, result) => { error ? reject(error) : resolve(result); }); });
                    brand_id = create_brand.insertId;
                } else {
                    brand_id = exist_brand.id;
                }
                await new Promise((resolve, reject) => { connection.query(`INSERT INTO product_brand (product_id, brand_id, created_by) VALUES (?,?,?);`, [product_id, brand_id, created_by], (error, result) => { error ? reject(error) : resolve(result); }); });




                // Model
                const [exist_model] = await new Promise((resolve, reject) => { connection.query(`SELECT id FROM model WHERE model_name = ?`, [product_model], (error, result) => { error ? reject(error) : resolve(result); }); });
                if (!exist_model) {
                    const create_model = await new Promise((resolve, reject) => { connection.query(`INSERT INTO model (brand_id, model_name, created_by, status_id) VALUES (?,?,?,?);`, [brand_id, product_model, created_by, 1], (error, result) => { error ? reject(error) : resolve(result); }); });
                    model_id = create_model.insertId;
                } else {
                    model_id = exist_model.id;
                }
                await new Promise((resolve, reject) => { connection.query(`INSERT INTO product_model (product_id, model_id , created_by) VALUES (?,?,?);`, [product_id, model_id, created_by], (error, result) => { error ? reject(error) : resolve(result); }); });





                //Color
                const [exist_color] = await new Promise((resolve, reject) => { connection.query(`SELECT id FROM color WHERE color_name = ?`, [product_color], (error, result) => { error ? reject(error) : resolve(result); }); });
                if (!exist_color) {
                    const create_color = await new Promise((resolve, reject) => { connection.query(`INSERT INTO color (color_name, created_by, status_id  ) VALUES (?,?,?);`, [product_color, created_by, 1], (error, result) => { error ? reject(error) : resolve(result); }); });
                    color_id = create_color.insertId;
                } else {
                    color_id = exist_color.id;
                }
                await new Promise((resolve, reject) => { connection.query(`INSERT INTO product_color (product_id, color_id, created_by) VALUES (?,?,?);`, [product_id, color_id, created_by], (error, result) => { error ? reject(error) : resolve(result); }); });




                //Material
                const [exist_material] = await new Promise((resolve, reject) => { connection.query(`SELECT id FROM material WHERE material_name = ?`, [product_material], (error, result) => { error ? reject(error) : resolve(result); }); });
                if (!exist_material) {
                    const create_material = await new Promise((resolve, reject) => { connection.query(`INSERT INTO material (material_name, created_by, status_id  ) VALUES (?,?,?);`, [product_material, created_by, 1], (error, result) => { error ? reject(error) : resolve(result); }); });
                    material_id = create_material.insertId;
                } else {
                    material_id = exist_material.id;
                }
                await new Promise((resolve, reject) => { connection.query(`INSERT INTO product_material (product_id, material_id, created_by) VALUES (?,?,?);`, [product_id, material_id, created_by], (error, result) => { error ? reject(error) : resolve(result); }); });


                //period
                // const [exist_period] = await new Promise((resolve, reject) => { connection.query(`SELECT id FROM period WHERE period_name = ?`, [product_period], (error, result) => { error ? reject(error) : resolve(result); }); });
                // if (!exist_period) {
                //     const create_period = await new Promise((resolve, reject) => { connection.query(`INSERT INTO period (period_name, created_by, status_id  ) VALUES (?,?,?);`, [product_period, created_by, 1], (error, result) => { error ? reject(error) : resolve(result); }); });
                //     period_id = create_period.insertId;
                // } else {
                //     period_id = exist_period.id;
                // }
                // await new Promise((resolve, reject) => { connection.query(`INSERT INTO product_period (product_id, period_id , created_by) VALUES (?,?,?);`, [product_id, period_id, created_by], (error, result) => { error ? reject(error) : resolve(result); }); });




                //  Type
                const [exist_type] = await new Promise((resolve, reject) => { connection.query(`SELECT id FROM type WHERE type_name = ?`, [product_type], (error, result) => { error ? reject(error) : resolve(result); }); });
                if (!exist_type) {
                    const create_type = await new Promise((resolve, reject) => { connection.query(`INSERT INTO type (type_name, created_by, status_id  ) VALUES (?,?,?);`, [product_type, created_by, 1], (error, result) => { error ? reject(error) : resolve(result); }); });
                    type_id = create_type.insertId;
                } else {
                    type_id = exist_type.id;
                }
                await new Promise((resolve, reject) => { connection.query(`INSERT INTO product_type (product_id, type_id , created_by) VALUES (?,?,?);`, [product_id, type_id, created_by], (error, result) => { error ? reject(error) : resolve(result); }); });



                //  Unit
                const [exist_unit] = await new Promise((resolve, reject) => { connection.query(`SELECT id FROM unit WHERE unit_name = ?`, [product_unit], (error, result) => { error ? reject(error) : resolve(result); }); });
                if (!exist_unit) {
                    const create_unit = await new Promise((resolve, reject) => { connection.query(`INSERT INTO unit (unit_name, created_by, status_id  ) VALUES (?,?,?);`, [product_unit, created_by, 1], (error, result) => { error ? reject(error) : resolve(result); }); });
                    unit_id = create_unit.insertId;
                } else {
                    unit_id = exist_unit.id;
                }
                await new Promise((resolve, reject) => { connection.query(`INSERT INTO product_unit (product_id, unit_id , created_by) VALUES (?,?,?);`, [product_id, unit_id, created_by], (error, result) => { error ? reject(error) : resolve(result); }); });



                //  Warranty
                // const [exist_warranty] = await new Promise((resolve, reject) => { connection.query(`SELECT id FROM warranty WHERE warranty_name = ?`, [product_warranty], (error, result) => { error ? reject(error) : resolve(result); }); });
                // if (!exist_warranty) {
                //     const create_warranty = await new Promise((resolve, reject) => { connection.query(`INSERT INTO warranty (warranty_name, created_by, status_id  ) VALUES (?,?,?);`, [product_warranty, created_by, 1], (error, result) => { error ? reject(error) : resolve(result); }); });
                //     warranty_id = create_warranty.insertId;
                // } else {
                //     warranty_id = exist_warranty.id;
                // }
                // await new Promise((resolve, reject) => { connection.query(`INSERT INTO product_warranty (product_id, warranty_id , created_by) VALUES (?,?,?);`, [product_id, warranty_id, created_by], (error, result) => { error ? reject(error) : resolve(result); }); });
            }
            // res.status(200).json({ message: 'Products created successfully' });
            res.json("success");



        } catch (error) {
            console.error(error, '---------------------------------------------------');
            res.status(500).json({ message: 'Internal Server Error' });
        }


    },



    // product_update: async (req, res) => {
    //     const productId = req.params.id;
    //     const productData = req.body;


    //     try {
    //         // Start a transaction
    //         connection.beginTransaction(err => {
    //             if (err) throw err;
    //             const updateQuery = `
    //                 UPDATE product
    //                 SET 
    //                     product_name = ?,
    //                     product_quantity = ?,
    //                     status_id = ?,
    //                     product_price = ?,
    //                     product_weight = ?,
    //                     product_description = ?

    //                 WHERE id = ?`;
    //             // Execute the update query
    //             connection.query(updateQuery, [productData.product_name,
    //             productData.product_quantity,
    //             productData.status_id,
    //             productData.product_price,
    //             productData.product_weight,
    //             productData.product_description,
    //                 productId], (err, result) => {
    //                     if (err) {
    //                         connection.rollback(() => {
    //                             throw err;
    //                         });
    //                     }

    //                     if (result.affectedRows === 0) {
    //                         connection.rollback(() => {
    //                             console.error("Failed to update product. No rows were affected.");
    //                             res.status(500).send("Failed to update product.");
    //                             return;
    //                         });
    //                     }

    //                     console.log(`Product with ID ${productId} updated successfully.`);

    //                     // Update data in other tables using the productId
    //                     const updateQueries = [
    //                         `UPDATE product_brand SET brand_id = ${productData.brand_id}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
    //                         `UPDATE product_model SET model_id = ${productData.model_id}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
    //                         `UPDATE product_category SET category_id = ${productData.category_id}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
    //                         `UPDATE product_sub_category SET sub_category_id = ${productData.sub_category_id}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
    //                         // `UPDATE product_period SET period_id = ${productData.period_id}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
    //                         // `UPDATE product_warranty SET warranty_id = ${productData.warranty_id}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
    //                         `UPDATE product_unit SET unit_id = ${productData.unit_id ? productData.unit_id : 0}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
    //                         `UPDATE product_material SET material_id = ${productData.material_id ? productData.material_id : 0}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
    //                         `UPDATE product_color SET color_id = ${productData.color_id ? productData.color_id : 0}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
    //                         `UPDATE product_type SET type_id = ${productData.type_id ? productData.type_id : 0}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
    //                         `UPDATE product_image SET file_path = '${productData.file_path}', file_s = '${productData.file_s}', file_m = '${productData.file_m}', file_ms = '${productData.file_ms}' WHERE product_id = ${productId}`


    //                     ];

    //                     // Execute all update queries
    //                     const executeUpdateQueries = () => {
    //                         const queries = updateQueries.slice(); // Copy the array to avoid modifying the original
    //                         const executeNextQuery = () => {
    //                             const query = queries.shift(); // Get the next query
    //                             if (!query) { // No more queries left
    //                                 // Commit the transaction if all updates were successful
    //                                 connection.commit(err => {
    //                                     if (err) {
    //                                         connection.rollback(() => {
    //                                             throw err;
    //                                         });
    //                                     }
    //                                     console.log('Transaction completed successfully.');
    //                                     res.json('Product updated successfully');
    //                                 });
    //                                 return;
    //                             }
    //                             connection.query(query, (err) => {
    //                                 if (err) {
    //                                     connection.rollback(() => {
    //                                         throw err;
    //                                     });
    //                                 }
    //                                 executeNextQuery(); // Execute the next query recursively
    //                             });
    //                         };
    //                         executeNextQuery(); // Start executing queries
    //                     };

    //                     executeUpdateQueries(); // Call the function to start executing the queries
    //                 });
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // },



    product_update: async (req, res) => {
        const productId = req.params.id;
        const productData = req.body;

        try {
            // Start a transaction
            connection.beginTransaction(err => {
                if (err) throw err;

                const updateQuery = `
                    UPDATE product
                    SET 
                        product_name = ?,
                        product_quantity = ?,
                        status_id = ?,
                        product_price = ?,
                        product_weight = ?,
                        product_description = ?
                    WHERE id = ?`;

                // Execute the update query
                connection.query(updateQuery, [
                    productData.product_name,
                    productData.product_quantity,
                    productData.status_id,
                    productData.product_price,
                    productData.product_weight,
                    productData.product_description,
                    productId
                ], (err, result) => {
                    if (err) {
                        connection.rollback(() => {
                            throw err;
                        });
                    }

                    if (result.affectedRows === 0) {
                        connection.rollback(() => {
                            console.error("Failed to update product. No rows were affected.");
                            res.status(500).send("Failed to update product.");
                            return;
                        });
                    }

                    console.log(`Product with ID ${productId} updated successfully.`);

                    // Update related data
                    const updateQueries = [
                        `UPDATE product_brand SET brand_id = ${productData.brand_id}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
                        `UPDATE product_model SET model_id = ${productData.model_id}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
                        `UPDATE product_category SET category_id = ${productData.category_id}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
                        `UPDATE product_sub_category SET sub_category_id = ${productData.sub_category_id}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
                        `UPDATE product_unit SET unit_id = ${productData.unit_id || 0}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
                        `UPDATE product_material SET material_id = ${productData.material_id || 0}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
                        `UPDATE product_color SET color_id = ${productData.color_id || 0}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`,
                        `UPDATE product_type SET type_id = ${productData.type_id || 0}, modified_by = '${productData.modified_by}' WHERE product_id = ${productId}`
                    ];

                    const executeUpdateQueries = () => {
                        const queries = updateQueries.slice();
                        const executeNextQuery = () => {
                            const query = queries.shift();
                            if (!query) {
                                updateProductImages(); // Proceed to updating product images
                                return;
                            }
                            connection.query(query, (err) => {
                                if (err) {
                                    connection.rollback(() => {
                                        throw err;
                                    });
                                }
                                executeNextQuery();
                            });
                        };
                        executeNextQuery();
                    };

                    const updateProductImages = () => {
                        const imageQueries = productData.file_path.map(image => {
                            if (image.id) {
                                // Update existing image
                                return `
                                    UPDATE product_image
                                    SET 
                                        file_path = '${image.file_path}',
                                        file_s = '${image.file_s}',
                                        file_m = '${image.file_m}',
                                        file_ms = '${image.file_ms}',
                                        is_default = '${image.is_default}'
                                    WHERE id = ${image.id}`;
                            } else {
                                // Insert new image
                                return `
                                    INSERT INTO product_image (
                                        product_id, 
                                        file_path, 
                                        file_s, 
                                        file_m, 
                                        file_ms, 
                                        is_default
                                    ) VALUES (
                                        ${productId},
                                        '${image.file_path}',
                                        '${image.file_s}',
                                        '${image.file_m}',
                                        '${image.file_ms}',
                                        '${image.is_default}'
                                    )`;
                            }
                        });

                        const executeImageQueries = () => {
                            const queries = imageQueries.slice();
                            const executeNextQuery = () => {
                                const query = queries.shift();
                                if (!query) {
                                    connection.commit(err => {
                                        if (err) {
                                            connection.rollback(() => {
                                                throw err;
                                            });
                                        }
                                        console.log('Transaction completed successfully.');
                                        res.json('Product updated successfully');
                                    });
                                    return;
                                }
                                connection.query(query, (err) => {
                                    if (err) {
                                        connection.rollback(() => {
                                            throw err;
                                        });
                                    }
                                    executeNextQuery();
                                });
                            };
                            executeNextQuery();
                        };

                        executeImageQueries();
                    };

                    executeUpdateQueries();
                });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },


    // product_single: async (req, res) => {
    //     try {
    //         const productId = req.params.id; // Assuming productId is passed as a route parameter

    //         // Query to select product data
    //         const selectQuery = `
    //             SELECT 
    //                 p.*,
    //                 pb.brand_id,
    //                 pm.model_id,
    //                 pc1.category_id,
    //                 psc.sub_category_id,
    //                 pp.period_id,
    //                 pu.unit_id,
    //                 pw.warranty_id,
    //                 pmtrl.material_id,
    //                 pc2.color_id,
    //                 pt.type_id
    //             FROM 
    //                 product p
    //             LEFT JOIN 
    //                 product_brand pb ON p.id = pb.product_id
    //             LEFT JOIN 
    //                 product_model pm ON p.id = pm.product_id
    //             LEFT JOIN 
    //                 product_category pc1 ON p.id = pc1.product_id
    //             LEFT JOIN 
    //                 product_sub_category psc ON p.id = psc.product_id
    //             LEFT JOIN 
    //                 product_period pp ON p.id = pp.product_id
    //             LEFT JOIN 
    //                 product_unit pu ON p.id = pu.product_id
    //             LEFT JOIN 
    //                 product_warranty pw ON p.id = pw.product_id
    //             LEFT JOIN 
    //                 product_material pmtrl ON p.id = pmtrl.product_id
    //             LEFT JOIN 
    //                 product_color pc2 ON p.id = pc2.product_id
    //             LEFT JOIN 
    //                 product_type pt ON p.id = pt.product_id
    //             WHERE 
    //                 p.id = ?;
    //         `;

    //         // Execute the query to fetch product data
    //         connection.query(selectQuery, [productId], (err, results) => {
    //             if (err) {
    //                 console.error("Error fetching product data:", err);
    //                 res.status(500).json({ message: 'Internal Server Error' });
    //                 return;
    //             }

    //             // Check if product data exists
    //             if (results.length === 0) {
    //                 res.status(404).json({ message: 'Product not found' });
    //                 return;
    //             }

    //             // Fetch images for the product
    //             const imageQuery = `
    //                 SELECT *
    //                 FROM product_image
    //                 WHERE product_id = ?;
    //             `;

    //             // Execute the query to fetch product images
    //             connection.query(imageQuery, [productId], (imageErr, imageResults) => {
    //                 if (imageErr) {
    //                     console.error("Error fetching product images:", imageErr);
    //                     res.status(500).json({ message: 'Internal Server Error' });
    //                     return;
    //                 }

    //                 // If images exist, assign them directly to the product object
    //                 if (imageResults.length > 0) {
    //                     const firstImage = imageResults[0];
    //                     results[0].file_path = firstImage.file_path;
    //                     results[0].file_s = firstImage.file_s;
    //                     results[0].file_m = firstImage.file_m;
    //                     results[0].file_ms = firstImage.file_ms;
    //                 }

    //                 // Return the product data with image paths
    //                 res.status(200).json(results[0]);
    //             });
    //         });
    //     } catch (error) {
    //         console.error("Error fetching product data:", error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // },


    // product_single: async (req, res) => {
    //     try {
    //         const productId = req.params.id; // Assuming productId is passed as a route parameter

    //         // Query to select product data
    //         const selectQuery = `
    //             SELECT 
    //                 p.*,
    //                 pb.brand_id,
    //                 pm.model_id,
    //                 pc1.category_id,
    //                 psc.sub_category_id,
    //                 pp.period_id,
    //                 pu.unit_id,
    //                 pw.warranty_id,
    //                 pmtrl.material_id,
    //                 pc2.color_id,
    //                 pt.type_id
    //             FROM 
    //                 product p
    //             LEFT JOIN 
    //                 product_brand pb ON p.id = pb.product_id
    //             LEFT JOIN 
    //                 product_model pm ON p.id = pm.product_id
    //             LEFT JOIN 
    //                 product_category pc1 ON p.id = pc1.product_id
    //             LEFT JOIN 
    //                 product_sub_category psc ON p.id = psc.product_id
    //             LEFT JOIN 
    //                 product_period pp ON p.id = pp.product_id
    //             LEFT JOIN 
    //                 product_unit pu ON p.id = pu.product_id
    //             LEFT JOIN 
    //                 product_warranty pw ON p.id = pw.product_id
    //             LEFT JOIN 
    //                 product_material pmtrl ON p.id = pmtrl.product_id
    //             LEFT JOIN 
    //                 product_color pc2 ON p.id = pc2.product_id
    //             LEFT JOIN 
    //                 product_type pt ON p.id = pt.product_id
    //             WHERE 
    //                 p.id = ?;
    //         `;

    //         // Execute the query to fetch product data
    //         connection.query(selectQuery, [productId], (err, results) => {
    //             if (err) {
    //                 console.error("Error fetching product data:", err);
    //                 res.status(500).json({ message: 'Internal Server Error' });
    //                 return;
    //             }

    //             // Check if product data exists
    //             if (results.length === 0) {
    //                 res.status(404).json({ message: 'Product not found' });
    //                 return;
    //             }

    //             // Fetch images for the product
    //             const imageQuery = `
    //                 SELECT *
    //                 FROM product_image
    //                 WHERE product_id = ?;
    //             `;

    //             // Execute the query to fetch product images
    //             connection.query(imageQuery, [productId], (imageErr, imageResults) => {
    //                 if (imageErr) {
    //                     console.error("Error fetching product images:", imageErr);
    //                     res.status(500).json({ message: 'Internal Server Error' });
    //                     return;
    //                 }

    //                 // Attach the images to the product data
    //                 results[0].images = imageResults;

    //                 // Return the product data with images
    //                 res.status(200).json(results[0]);
    //             });
    //         });
    //     } catch (error) {
    //         console.error("Error fetching product data:", error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // },


    // product_single: async (req, res) => {
    //     try {
    //         const productId = req.params.id; // Assuming productId is passed as a route parameter

    //         // Query to select product data
    //         const selectQuery = `
    //         SELECT 
    //         p.*,
    //         pb.brand_id,
    //         pm.model_id,
    //         pc1.category_id,
    //         psc.sub_category_id,
    //         pp.period_id,
    //         pu.unit_id,
    //         pw.warranty_id,
    //         pmtrl.material_id,
    //         pc2.color_id,
    //         pt.type_id
    //     FROM 
    //         product p
    //     LEFT JOIN 
    //         product_brand pb ON p.id = pb.product_id
    //     LEFT JOIN 
    //         product_model pm ON p.id = pm.product_id
    //     LEFT JOIN 
    //         product_category pc1 ON p.id = pc1.product_id
    //     LEFT JOIN 
    //         product_sub_category psc ON p.id = psc.product_id
    //     LEFT JOIN 
    //         product_period pp ON p.id = pp.product_id
    //     LEFT JOIN 
    //         product_unit pu ON p.id = pu.product_id
    //     LEFT JOIN 
    //         product_warranty pw ON p.id = pw.product_id
    //     LEFT JOIN 
    //         product_material pmtrl ON p.id = pmtrl.product_id
    //     LEFT JOIN 
    //         product_color pc2 ON p.id = pc2.product_id
    //     LEFT JOIN 
    //         product_type pt ON p.id = pt.product_id
    //     WHERE 
    //         p.id = ?;
    //     `;

    //         // Execute the query
    //         connection.query(selectQuery, [productId], (err, results) => {
    //             if (err) {
    //                 console.error("Error fetching product data:", err);
    //                 res.status(500).json({ message: 'Internal Server Error' });
    //                 return;
    //             }

    //             // Check if product data exists
    //             if (results.length === 0) {
    //                 res.status(404).json({ message: 'Product not found' });
    //                 return;
    //             }

    //             // Return the product data
    //             res.status(200).json(results[0]);
    //         });
    //     } catch (error) {
    //         console.error("Error fetching product data:", error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // },

    // product_single: async (req, res) => {
    //     try {
    //       const query = 'SELECT * FROM product WHERE id = ?';
    //       connection.query(query, [req.params.id], (error, result) => {
    //         if (!error && result.length > 0) {
    //           console.log(result);
    //           return res.send(result);
    //         } else {
    //           console.log(error || 'Product not found');
    //           return res.status(404).json({ message: 'Product not found.' });
    //         }
    //       });
    //     }
    //     catch (error) {
    //       console.log(error)
    //     }
    //   },


    product_single: async (req, res) => {
        try {
            const productId = req.params.id; // Assuming productId is passed as a route parameter

            // Query to select product data
            const selectQuery = `
                SELECT 
                    p.*,
                    pb.brand_id,
                    pm.model_id,
                    pc1.category_id,
                    psc.sub_category_id,
                    pp.period_id,
                    pu.unit_id,
                    pw.warranty_id,
                    pmtrl.material_id,
                    pc2.color_id,
                    pt.type_id
                FROM 
                    product p
                LEFT JOIN 
                    product_brand pb ON p.id = pb.product_id
                LEFT JOIN 
                    product_model pm ON p.id = pm.product_id
                LEFT JOIN 
                    product_category pc1 ON p.id = pc1.product_id
                LEFT JOIN 
                    product_sub_category psc ON p.id = psc.product_id
                LEFT JOIN 
                    product_period pp ON p.id = pp.product_id
                LEFT JOIN 
                    product_unit pu ON p.id = pu.product_id
                LEFT JOIN 
                    product_warranty pw ON p.id = pw.product_id
                LEFT JOIN 
                    product_material pmtrl ON p.id = pmtrl.product_id
                LEFT JOIN 
                    product_color pc2 ON p.id = pc2.product_id
                LEFT JOIN 
                    product_type pt ON p.id = pt.product_id
                WHERE 
                    p.id = ?;
            `;

            // Execute the query to fetch product data
            connection.query(selectQuery, [productId], (err, results) => {
                if (err) {
                    console.error("Error fetching product data:", err);
                    res.status(500).json({ message: 'Internal Server Error' });
                    return;
                }

                // Check if product data exists
                if (results.length === 0) {
                    res.status(404).json({ message: 'Product not found' });
                    return;
                }

                const productData = results[0];

                // Fetch images for the product
                const imageQuery = `
                    SELECT *
                    FROM product_image
                    WHERE product_id = ?;
                `;

                // Execute the query to fetch product images
                connection.query(imageQuery, [productId], (imageErr, imageResults) => {
                    if (imageErr) {
                        console.error("Error fetching product images:", imageErr);
                        res.status(500).json({ message: 'Internal Server Error' });
                        return;
                    }

                    // Include images as an array in the product data
                    productData.file_path = imageResults.map(image => ({
                        id: image.id,
                        file_path: image.file_path,
                        file_s: image.file_s,
                        file_m: image.file_m,
                        file_ms: image.file_ms,
                        is_default: image.is_default,
                    }));

                    // Return the product data with image paths
                    res.status(200).json(productData);
                });
            });
        } catch (error) {
            console.error("Error fetching product data:", error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },


    product_list_paigination: async (req, res) => {
        const pageNo = Number(req.params.pageNo);
        const perPage = Number(req.params.perPage);
        try {
            const skipRows = (pageNo - 1) * perPage;
            const query = `
            SELECT product.*,
                   product_image.file_path,
                   brand.brand_name,
                   category.category_name,
                   color.color_name,
                   material.material_name,
                   model.model_name,
                   period.period_name,
                   sub_category.sub_category_name,
                   type.type_name,
                   unit.unit_name,
                   warranty.warranty_name,
                   users_created.full_name AS created_by,
                   users_modified.full_name AS modified_by
            FROM product
            LEFT JOIN product_image ON product.id = product_image.product_id
            LEFT JOIN product_brand ON product.id = product_brand.product_id
            LEFT JOIN product_category ON product.id = product_category.product_id
            LEFT JOIN product_color ON product.id = product_color.product_id
            LEFT JOIN product_material ON product.id = product_material.product_id
            LEFT JOIN product_model ON product.id = product_model.product_id
            LEFT JOIN product_period ON product.id = product_period.product_id
            LEFT JOIN product_sub_category ON product.id = product_sub_category.product_id
            LEFT JOIN product_type ON product.id = product_type.product_id
            LEFT JOIN product_unit ON product.id = product_unit.product_id
            LEFT JOIN product_warranty ON product.id = product_warranty.product_id
            LEFT JOIN brand ON product_brand.brand_id = brand.id
            LEFT JOIN category ON product_category.category_id = category.id
            LEFT JOIN color ON product_color.color_id = color.id
            LEFT JOIN material ON product_material.material_id = material.id
            LEFT JOIN model ON product_model.model_id = model.id
            LEFT JOIN period ON product_period.period_id = period.id
            LEFT JOIN sub_category ON product_sub_category.sub_category_id = sub_category.id
            LEFT JOIN type ON product_type.type_id = type.id
            LEFT JOIN unit ON product_unit.unit_id = unit.id
            LEFT JOIN warranty ON product_warranty.warranty_id = warranty.id
            LEFT JOIN users AS users_created ON product.created_by = users_created.id 
            LEFT JOIN users AS users_modified ON product.modified_by = users_modified.id 
            ORDER BY product.id DESC
            LIMIT ?, ?
        `;
            // let query = `
            //     SELECT product.*, 
            //            users_created.full_name AS created_by,
            //            users_modified.full_name AS modified_by,
            //            product_image.file_path
            //     FROM product 
            //     INNER JOIN users AS users_created ON product.created_by = users_created.id 
            //     LEFT JOIN users AS users_modified ON product.modified_by = users_modified.id 
            //     LEFT JOIN product_image ON product.id = product_image.product_id
            //     ORDER BY product.id DESC
            //     LIMIT ?, ?
            // `;

            connection.query(query, [skipRows, perPage], (error, result) => {
                console.log(result)
                if (!error) {
                    res.send(result)
                } else {
                    console.log(error)
                }
            })
        } catch (error) {
            console.log(error)
        }
    },

    product_search: async (req, res) => {
        try {
            console.log("Search button clicked.");

            // Extract necessary data from request
            let { searchQuery, statusFilter, selectedOrder, fromDate, toDate, multiSearch } = req.body;

            // Construct the base SQL query
            // let sql = `
            //     SELECT product.*, 
            //            users_created.full_name AS created_by,
            //            users_modified.full_name AS modified_by,
            //            product_image.file_path
            //     FROM product 
            //     INNER JOIN users AS users_created ON product.created_by = users_created.id 
            //     LEFT JOIN users AS users_modified ON product.modified_by = users_modified.id 
            //     LEFT JOIN product_image ON product.id = product_image.product_id
            //     WHERE 1 `;
            let sql = `
            SELECT product.*, 
                   users_created.full_name AS created_by,
                   users_modified.full_name AS modified_by,
                   product_image.file_path,
                   brand.brand_name,
                   category.category_name,
                   color.color_name,
                   material.material_name,
                   model.model_name,
                   period.period_name,
                   sub_category.sub_category_name,
                   type.type_name,
                   unit.unit_name,
                   warranty.warranty_name
            FROM product 
            LEFT JOIN users AS users_created ON product.created_by = users_created.id 
            LEFT JOIN users AS users_modified ON product.modified_by = users_modified.id 
            LEFT JOIN product_image ON product.id = product_image.product_id
            LEFT JOIN product_brand ON product.id = product_brand.product_id
            LEFT JOIN product_category ON product.id = product_category.product_id
            LEFT JOIN product_color ON product.id = product_color.product_id
            LEFT JOIN product_material ON product.id = product_material.product_id
            LEFT JOIN product_model ON product.id = product_model.product_id
            LEFT JOIN product_period ON product.id = product_period.product_id
            LEFT JOIN product_sub_category ON product.id = product_sub_category.product_id
            LEFT JOIN product_type ON product.id = product_type.product_id
            LEFT JOIN product_unit ON product.id = product_unit.product_id
            LEFT JOIN product_warranty ON product.id = product_warranty.product_id
            LEFT JOIN brand ON product_brand.brand_id = brand.id
            LEFT JOIN category ON product_category.category_id = category.id
            LEFT JOIN color ON product_color.color_id = color.id
            LEFT JOIN material ON product_material.material_id = material.id
            LEFT JOIN model ON product_model.model_id = model.id
            LEFT JOIN period ON product_period.period_id = period.id
            LEFT JOIN sub_category ON product_sub_category.sub_category_id = sub_category.id
            LEFT JOIN type ON product_type.type_id = type.id
            LEFT JOIN unit ON product_unit.unit_id = unit.id
            LEFT JOIN warranty ON product_warranty.warranty_id = warranty.id
            WHERE 1 `;
            //order  by variable
            //order  by product_name asc, status_id desc,created_date desc
            // Add search query condition
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                sql += ` AND LOWER(product_name) LIKE '%${query}%' `;
            }

            // Add status filter condition
            if (statusFilter !== '') {
                sql += ` AND product.status_id = ${statusFilter} `;
            }

            // Add date range condition
            if (fromDate && toDate) {
                // Reverse fromDate and toDate if fromDate is greater than toDate
                if (fromDate > toDate) {
                    const temp = fromDate;
                    fromDate = toDate;
                    toDate = temp;
                }

                sql += ` AND product.created_date BETWEEN '${fromDate}' AND '${toDate}' `;
            } else if (fromDate && !toDate) {
                sql += ` AND product.created_date >= '${fromDate}' `;
            } else if (!fromDate && toDate) {
                sql += ` AND product.created_date <= '${toDate}' `;
            }

            if (multiSearch && multiSearch.length > 0) {
                sql += ` ORDER BY ${multiSearch}`; // Append convertedData to the ORDER BY clause
            }

            console.log("SQL Query:", sql);

            // Execute the constructed SQL query
            connection.query(sql, (error, results, fields) => {
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
    // product_search: async (req, res) => {
    //     try {
    //         console.log("Search button clicked.");

    //         // Extract necessary data from request
    //         let { searchQuery, statusFilter, selectedOrder, fromDate, toDate, multiSearch } = req.body;

    //         // Construct the base SQL query
    //         let sql = `
    //         SELECT product.*, 
    //                users_created.full_name AS created_by,
    //                users_modified.full_name AS modified_by 
    //         FROM product 
    //         INNER JOIN users AS users_created ON product.created_by = users_created.id 
    //         LEFT JOIN users AS users_modified ON product.modified_by = users_modified.id 
    //         WHERE 1 `;
    //         //order  by variable
    //         //order  by product_name asc, status_id desc,created_date desc
    //         // Add search query condition
    //         if (searchQuery) {
    //             const query = searchQuery.toLowerCase();
    //             sql += ` AND LOWER(product_name) LIKE '%${query}%' `;
    //         }

    //         // Add status filter condition
    //         if (statusFilter !== '') {
    //             sql += ` AND status_id = ${statusFilter} `;
    //         }

    //         // Add date range condition
    //         if (fromDate && toDate) {
    //             // Reverse fromDate and toDate if fromDate is greater than toDate
    //             if (fromDate > toDate) {
    //                 const temp = fromDate;
    //                 fromDate = toDate;
    //                 toDate = temp;
    //             }

    //             sql += ` AND product.created_date BETWEEN '${fromDate}' AND '${toDate}' `;
    //         } else if (fromDate && !toDate) {
    //             sql += ` AND product.created_date >= '${fromDate}' `;
    //         } else if (!fromDate && toDate) {
    //             sql += ` AND product.created_date <= '${toDate}' `;
    //         }

    //         if (multiSearch && multiSearch.length > 0) {
    //             sql += ` ORDER BY ${multiSearch}`; // Append convertedData to the ORDER BY clause
    //         }

    //         console.log("SQL Query:", sql);



    //         // Execute the constructed SQL query
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

    // product_list: async (req, res) => {
    //     try {
    //         const data = "SELECT product.*, product_image.file_path FROM product LEFT JOIN product_image ON product.id = product_image.product_id";

    //         connection.query(data, function (error, result) {
    //             console.log(result)
    //             if (!error) {
    //                 res.send(result)
    //             } else {
    //                 console.log(error)
    //             }
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // },
    product_list: async (req, res) => {
        try {
            const data = `
            SELECT product.*,
                   LPAD(product.barcode, 13, '0') AS formatted_barcode,
                   product_image.file_path,
                   brand.brand_name,
                   category.category_name,
                   color.color_name,
                   material.material_name,
                   model.model_name,
                   period.period_name,
                   sub_category.sub_category_name,
                   sub_category.id As sub_category_id,
                   type.type_name,
                   unit.unit_name,
                   warranty.warranty_name
            FROM product
            LEFT JOIN product_image ON product.id = product_image.product_id
            LEFT JOIN product_brand ON product.id = product_brand.product_id
            LEFT JOIN product_category ON product.id = product_category.product_id
            LEFT JOIN product_color ON product.id = product_color.product_id
            LEFT JOIN product_material ON product.id = product_material.product_id
            LEFT JOIN product_model ON product.id = product_model.product_id
            LEFT JOIN product_period ON product.id = product_period.product_id
            LEFT JOIN product_sub_category ON product.id = product_sub_category.product_id
            LEFT JOIN product_type ON product.id = product_type.product_id
            LEFT JOIN product_unit ON product.id = product_unit.product_id
            LEFT JOIN product_warranty ON product.id = product_warranty.product_id
            LEFT JOIN brand ON product_brand.brand_id = brand.id
            LEFT JOIN category ON product_category.category_id = category.id
            LEFT JOIN color ON product_color.color_id = color.id
            LEFT JOIN material ON product_material.material_id = material.id
            LEFT JOIN model ON product_model.model_id = model.id
            LEFT JOIN period ON product_period.period_id = period.id
            LEFT JOIN sub_category ON product_sub_category.sub_category_id = sub_category.id
            LEFT JOIN type ON product_type.type_id = type.id
            LEFT JOIN unit ON product_unit.unit_id = unit.id
            LEFT JOIN warranty ON product_warranty.warranty_id = warranty.id
            `;

            connection.query(data, function (error, result) {
                if (!error) {
                    console.log(result);
                    res.send(result);
                } else {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        }
    },



    product_image_settings: async (req, res) => {
        const { small, medium, mediumSmall } = req.body; // Destructure formData object
        try {

            // Insert data into the database
            const query = `
              INSERT INTO image_size (name, ratio, height, width)
              VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)
            `;
            const values = [
                small.name, small.ratio, small.height, small.width,
                medium.name, medium.ratio, medium.height, medium.width,
                mediumSmall.name, mediumSmall.ratio, mediumSmall.height, mediumSmall.width
            ];

            connection.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error inserting data into MySQL:', err);
                    res.status(500).json({ message: 'Error inserting data into database' });
                    return;
                }
                console.log('Data inserted into MySQL');
                res.status(200).json({ message: 'Data inserted successfully' });
            });
        }
        catch (error) {
            console.log(error)
        }
    },


    quick_brand_search: async (req, res) => {

        try {

            // Extract necessary data from request
            const { selectedColumns, selected_brand_id } = req.body;


            let model_id = selectedColumns;
            let brand_id = selected_brand_id;


            let sql = `SELECT DISTINCT p.id, p.product_name, b.brand_name, m.model_name, pb.brand_id, pm.model_id
                        FROM product p
                        JOIN product_brand pb ON p.id = pb.product_id
                        JOIN product_model pm ON p.id = pm.product_id
                        JOIN brand b ON pb.brand_id = b.id
                        JOIN model m ON pm.model_id = m.id
                        WHERE pb.brand_id = ${brand_id} AND pm.model_id IN (${model_id})`;



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

    quick_category_search: async (req, res) => {

        console.log(req.body, 'req.body');

        try {
            // Extract necessary data from request
            const { selectedColumns, selected_category_id } = req.body;


            let sub_category_id = selectedColumns;
            let category_id = selected_category_id;

            let sql = `SELECT DISTINCT product.id, product.product_name, category.category_name, sub_category.sub_category_name, product_category.category_id, product_sub_category.sub_category_id
            FROM product
            JOIN product_category ON product.id = product_category.product_id
            JOIN product_sub_category ON product.id = product_sub_category.product_id
            JOIN category ON product_category.category_id = category.id
            JOIN sub_category ON product_sub_category.sub_category_id = sub_category.id
            WHERE product_category.category_id = ${category_id} AND product_sub_category.sub_category_id IN (${sub_category_id})`;


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

    quick_brand_update: async (req, res) => {


        try {

            let sql_brand = '';
            let sql_model = '';

            for (const single_object in req.body) {

                const { id, brand_id, model_id } = req.body[single_object];

                if (!brand_id == '' && brand_id) {
                    sql_brand = `UPDATE product_brand SET brand_id =${Number(brand_id)} WHERE product_id = ${Number(id)}`;
                    if (sql_brand) {
                        connection.query(sql_brand, (error, results, fields) => {
                            if (error) {
                                console.error("Error occurred during search:", error);
                            } else {
                                console.log("Search results:", results);
                            }
                        });
                    }
                }

                if (!model_id == '' && model_id) {
                    sql_model = `UPDATE product_model SET model_id =${Number(model_id)} WHERE product_id = ${Number(id)}`;
                    if (sql_model) {
                        connection.query(sql_model, (error, results, fields) => {
                            if (error) {
                                console.error("Error occurred during search:", error);
                            } else {
                                console.log("Search results:", results);
                            }
                        });
                    }
                }
            }
            res.send(true);

        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).json({ error: "An error occurred." });
        }

    },


    product_delete: async (req, res) => {

        try {
            // Define the product ID or condition to delete
            const productId = req.params.id; // Assuming product ID is passed as a URL parameter
            const deleteQuery = `
                DELETE product
                FROM product
                LEFT JOIN product_image ON product.id = product_image.product_id
                LEFT JOIN product_brand ON product.id = product_brand.product_id
                LEFT JOIN product_category ON product.id = product_category.product_id
                LEFT JOIN product_color ON product.id = product_color.product_id
                LEFT JOIN product_material ON product.id = product_material.product_id
                LEFT JOIN product_model ON product.id = product_model.product_id
                LEFT JOIN product_period ON product.id = product_period.product_id
                LEFT JOIN product_sub_category ON product.id = product_sub_category.product_id
                LEFT JOIN product_type ON product.id = product_type.product_id
                LEFT JOIN product_unit ON product.id = product_unit.product_id
                LEFT JOIN product_warranty ON product.id = product_warranty.product_id
                LEFT JOIN brand ON product_brand.brand_id = brand.id
                LEFT JOIN category ON product_category.category_id = category.id
                LEFT JOIN color ON product_color.color_id = color.id
                LEFT JOIN material ON product_material.material_id = material.id
                LEFT JOIN model ON product_model.model_id = model.id
                LEFT JOIN period ON product_period.period_id = period.id
                LEFT JOIN sub_category ON product_sub_category.sub_category_id = sub_category.id
                LEFT JOIN type ON product_type.type_id = type.id
                LEFT JOIN unit ON product_unit.unit_id = unit.id
                LEFT JOIN warranty ON product_warranty.warranty_id = warranty.id
                WHERE product.id = ?;
            `;

            // Execute the query
            connection.query(deleteQuery, [productId], function (error, result) {
                if (!error) {
                    if (result.affectedRows > 0) {
                        res.status(200).send({ success: true, message: `Product with ID ${productId} deleted successfully.` });
                    } else {
                        res.status(404).send({ success: false, message: `No product found with ID ${productId}.` });
                    }
                } else {
                    console.error(error);
                    res.status(500).send({ success: false, message: 'Error deleting product.', error });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ success: false, message: 'Server error.', error });
        }
    },


    quick_category_update: async (req, res) => {


        console.log('-----------------------------');
        console.log(req.body);
        console.log('-----------------------------');


        try {

            let sql_category = '';
            let sql_sub_category = '';

            for (const single_object in req.body) {

                const { id, category_id, sub_category_id } = req.body[single_object];

                if (!category_id == '' && category_id) {
                    sql_category = `UPDATE product_category SET category_id =${Number(category_id)} WHERE product_id = ${Number(id)}`;
                    if (sql_category) {
                        connection.query(sql_category, (error, results, fields) => {
                            if (error) {
                                console.error("Error occurred during search:", error);
                            } else {
                                console.log("Search results:", results);
                            }
                        });
                    }
                }

                if (!sub_category_id == '' && sub_category_id) {
                    sql_sub_category = `UPDATE product_sub_category SET sub_category_id =${Number(sub_category_id)} WHERE product_id = ${Number(id)}`;
                    if (sql_sub_category) {
                        connection.query(sql_sub_category, (error, results, fields) => {
                            if (error) {
                                console.error("Error occurred during search:", error);
                            } else {
                                console.log("Search results:", results);
                            }
                        });
                    }
                }
            }
            res.send(true);

        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).json({ error: "An error occurred." });
        }

    },


    product_pdf: async (req, res) => {
        try {
            const { searchResults, selectedColumns } = req.body; // Assuming selectedColumns is an array of column names

            console.log(searchResults, 'here all the searchResults');
            const statusLabels = {
                1: 'Active',
                2: 'Inactive',
                3: 'Pending'
            };

            const longTextColumns = ['product_name', 'description'];

            let tableRows = '';
            searchResults?.forEach((result, index) => {
                let row = '<tr>';
                selectedColumns.forEach(column => {
                    if (column === 'serial') {
                        row += `<td>${index + 1}</td>`; // Displaying index number starting from 1
                    } else if (column === 'action') {
                        // Skip this column
                    }
                    else if (column === 'status_id') {
                        const statusLabel = statusLabels[result[column]] || '';
                        // Get corresponding label from statusLabels object
                        row += `<td>${statusLabel}</td>`;
                    }
                    //   else if (column === 'file_path') {
                    //     // Encode the image URL
                    //     const encodedURL = encodeURIComponent(result[column]);
                    //     console.log(`${process.env.NEXT_PUBLIC_API_URL}:5003${result[column]}`, 'encodedURL welcome');
                    //     // const encodedURL = encode(result[column]);
                    //     row += `<td><img src="${process.env.NEXT_PUBLIC_API_URL}:5003${result[column]}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`;
                    //   }
                    else if (column === 'file_path') {
                        if (result[column]) {
                            // Encode the image URL
                            const encodedURL = encodeURIComponent(result[column]);
                            console.log(`http://192.168.0.194:5003${result[column]}`, 'encodedURL welcome');
                            // const encodedURL = encode(result[column]);
                            row += `<td><img src="http://192.168.0.194:5003${result[column]}" alt="image" style="max-width: 100px; max-height: 100px;"></td>`;
                        } else {
                            // No file path provided, show a placeholder message
                            row += `<td></td>`;
                        }
                    }
                    else {
                        const style = longTextColumns.includes(column) ? 'word-wrap: break-word; word-break: break-all;' : '';
                        row += `<td style="${style}">${result[column]}</td>`;
                        // row += `<td>${result[column]}</td>`; // Displaying regular columns
                    }
                });
                row += '</tr>';
                tableRows += row;
            });
            // <link href='http://sonnetdp.github.io/nikosh/css/nikosh.css' rel='stylesheet' type='text/css'>
            // <link href='./nikosh.css' rel='stylesheet' type='text/css'>
            //  ${process.env.NEXT_PUBLIC_API_URL}:5002/get-css/nikosh.css
            // @import url("nikosh.css");

            const html = `<html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
      
              <style>
            
              * { 
                sheet-size: A4;font-family: 'Nikosh', sans-serif !important;
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
         <h2 style="margin: 0; padding: 0;">Pathshala School & College Period List</h2>
         <h3 style="margin: 0; padding: 0;">GA-75/A, Middle Badda, Dhaka-1212</h3>
         <p style="margin: 0; padding: 0;">Phone: 01977379479, Mobile: 01977379479</p>
         <p style="margin: 0; padding: 0; margin-bottom: 10px">Email: pathshala@urbanitsolution.com</p>
         <h3 style="margin-bottom: 10px; padding: 0; text-decoration: underline;">Period List</h3>
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

            wkhtmltopdf(html, { pageSize: 'letter' }, (err, stream) => {
                if (err) {
                    console.error('Error generating PDF:', err);
                    res.status(500).send('Error generating PDF');
                    return;
                }
                stream.pipe(res);
            });
        } catch (error) {
            console.error('Error in period_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },

    max_barcode_product_list: async (req, res) => {
        // try {
        //     const data = `SELECT IFNULL(MAX(barcode), '000000') AS maxBarcode FROM product`;
        //     // const data = "SELECT MAX(barcode) AS maxBarcode FROM product";

        //     connection.query(data, function (error, result) {
        //         if (!error) {
        //             console.log(result);
        //             res.send(result);
        //         } else {
        //             console.log(error);
        //         }
        //     });
        // } catch (error) {
        //     console.log(error);
        // }
        try {
            const data = "SELECT MAX(barcode) AS maxBarcode FROM product";

            connection.query(data, function (error, result) {
                if (!error) {
                    // Check if maxBarcode is null or an empty string and replace it with '000000'
                    const maxBarcode = result[0].maxBarcode ? result[0].maxBarcode : '000000';
                    res.send([{ maxBarcode }]);
                } else {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        }



    },


    barcode_print: async (req, res) => {
        try {
            const { product_id, quantity, products, selectedPrintSize, orientation, fontSize } = req.body;

            // Retrieve product data by ID
            const productData = products?.find(product => product?.id == product_id);

            if (!productData || !productData.barcode) {
                return res.status(400).send('Product not found or barcode missing.');
            }

            // Generate barcode rows based on the quantity
            let barcodeRows = '';
            let rowCounter = 0;

            for (let i = 0; i < quantity; i++) {
                // Start new row every 4 items
                if (rowCounter % 5 === 0) {
                    barcodeRows += `<div class="barcode-row">`;
                }

                barcodeRows += `
                    <div class="barcode-container">
                        <p class="product-name" style="margin-bottom:-2px">${productData.product_name}</p>
                        <img class="barcode-img" style="width:80px; height:50px; margin-bottom:15px" src="https://barcode.tec-it.com/barcode.ashx?data=${productData.barcode}&code=Code39&translate-esc=true" alt="Barcode ${i + 1}" />
                    </div>
                `;

                // Close the row after 4 items or if it's the last item
                if (rowCounter % 5 === 4 || i === quantity - 1) {
                    barcodeRows += `</div>`;
                }

                rowCounter++;
            }

            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';
            const html = `
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Print Barcodes</title>
                <style>
                    @page {
                      size: ${pageSize} ${pageOrientation}; /* This sets the page size and orientation */
                        margin: 15mm;
                    }
                    * { 
                        font-size: ${fontSize || '12px'};
                        font-family: 'Nikosh', sans-serif !important;
                    }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f4f4f4;
                        flex-wrap: wrap;
                        justify-content: space-between;
                    }
                    .barcode-row {
                        display: flex;
                        width: 100%;
                        flex-wrap: wrap;
                        page-break-inside: avoid; /* Prevent row from breaking across pages */
                    }
                    .barcode-container {
                        display: inline-block;
                        border: 1px dashed #E6E6E7;
                        background-color: #f4f4f4;
                        padding: 2.3px;
                        text-align: center;
                        width: 19%;
                        page-break-inside: avoid; /* Prevent barcode container from breaking across pages */
                    }
                    .product-name {
                        margin-bottom: 8px;
                        font-weight: bold;
                        font-size: 14px;
                        color: #222;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        margin-top: 5px;
                        page-break-before: auto; /* Allow images to break onto the next page if necessary */
                    }
                </style>
            </head>
            <body>
                <div class="barcode-row">
                    ${barcodeRows}
                </div>
                <script>
                    let imagesLoaded = 0;
                    const totalImages = document.querySelectorAll('.barcode-img').length;
                    
                    function checkImagesLoaded() {
                        imagesLoaded++;
                        if (imagesLoaded === totalImages) {
                            window.print();
                        }
                    }
    
                    // Attach the onload event to each image to check when it's loaded
                    const images = document.querySelectorAll('.barcode-img');
                    images.forEach(img => {
                        img.onload = checkImagesLoaded;
                    });
                </script>
            </body>
            </html>`;

            res.send(html);
        } catch (error) {
            console.error('Error generating barcode print view:', error);
            res.status(500).send('Error generating print view');
        }
    },





    // barcode_pdf: async (req, res) => {
    //     const { htmlContent, options } = req.body;
    //     console.log(htmlContent)
    //     const { pageSize, orientation, fontSize, zoomMultiplier } = options;

    //     const pdfOptions = {
    //         pageSize: pageSize || 'A4',
    //         orientation: orientation || 'portrait',
    //         zoom: zoomMultiplier || 1,
    //         pageHeight: '29.7cm',
    //         pageWidth: '21cm',
    //         // Additional wkhtmltopdf options can be passed here
    //     };

    //     // Generate the PDF from HTML content
    //     wkhtmltopdf(htmlContent, pdfOptions)
    //         .pipe(res) // Send the PDF directly to the response
    //         .on('end', () => {
    //             console.log('PDF generated and sent.');
    //         })
    //         .on('error', (err) => {
    //             console.error('Error generating PDF:', err);
    //             res.status(500).send('Error generating PDF');
    //         });
    // },

    barcode_pdf: async (req, res) => {
        try {
            const { product_id, quantity, products, selectedPrintSize, orientation, fontSize, selectedValues, selectedValue } = req.body;

            // Retrieve product data by ID
            const productData = products?.find(product => product?.id == product_id);

            if (!productData || !productData.barcode) {
                return res.status(400).send('Product not found or barcode missing.');
            }

            // Generate barcode rows based on the quantity
            let barcodeRows = '';
            let rowCounter = 0;

            for (let i = 0; i < quantity; i++) {
                // Start new row every 4 items
                if (rowCounter % 5 === 0) {
                    barcodeRows += `<div class="barcode-row">`;
                }

                barcodeRows += `
                    <div class="barcode-container">
     
                    ${selectedValue === 'with_name' ? `<p class="product-name" style="margin-bottom:-2px; margin-top: 4px; font-size:10px">${productData.product_name}</p>` : ''}
               
                        <img  style="width:154px; height:72px; margin-bottom:5px" src="https://barcode.tec-it.com/barcode.ashx?data=${productData.formatted_barcode}&code=${selectedValues}&translate-esc=true" alt="Barcode ${i + 1}" />
                    </div>
                `;


                // Close the row after 4 items
                if (rowCounter % 5 === 4 || i === quantity - 1) {
                    barcodeRows += `</div>`;
                }

                rowCounter++;
            }
            const pageSize = selectedPrintSize || 'A4';
            const pageOrientation = orientation || 'portrait';
            const html = `
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Print Barcodes</title>
                <style>
                    @page {
                        size: ${pageSize} ${pageOrientation}; /* This sets the page size to A4 and orientation to Portrait */
                        margin: 15mm;
                    }
                         * { 
                        font-size: ${fontSize || '12px'};
                        font-family: 'Nikosh', sans-serif !important;
                    }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f4f4f4;
                        flex-wrap: wrap;
                        justify-content: space-between;
                    }
                    .barcode-row {
                      margin-left:2px;
                        display: flex;
                        width: 100%;
                        flex-wrap: wrap;
                        page-break-inside: avoid; /* Prevent row from breaking across pages */
                    }
                    .barcode-container {
                        display: inline-block;
                        border: 1px dashed #E6E6E7;
                        background-color: #f4f4f4;
                        padding: 4.5px;
                        text-align: center;
                        width: 19%;
                        margin-left:-4px;

                    }
                    .product-name {
                        margin-bottom: 8px;
                        font-weight: bold;
                        font-size: 14px;
                        color: #222;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        margin-top: 5px;
                    }
                </style>
            </head>
            <body>
                ${barcodeRows}
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
            console.error('Error in barcode_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },



    // barcode_print_single: async (req, res) => {
    //     try {
    //         const { barcodes } = req.body;

    //         if (!barcodes || barcodes.length === 0) {
    //             return res.status(400).send('No barcode data provided');
    //         }

    //         // Generate barcode rows based on the data
    //         // let barcodeRows = '';
    //         // let rowCounter = 0;

    //         // barcodes.forEach((item, index) => {
    //         //     // Start a new row every 5 items
    //         //     if (rowCounter % 5 === 0) {
    //         //         barcodeRows += `<div class="barcode-row">`;
    //         //     }

    //         //     // <p class="product-name" style="margin-bottom:-2px">${item.product_name}</p>
    //         //     barcodeRows += `
    //         //         <div class="barcode-container">
    //         //             <img class="barcode-img" style="width:80px; margin-bottom:5px;  margin-left:10px; margin-right:10px;" 
    //         //                  src="https://barcode.tec-it.com/barcode.ashx?data=${item.barcode}&code=Code39&translate-esc=true" 
    //         //                  alt="Barcode ${index + 1}" />
    //         //         </div>
    //         //     `;

    //         //     // Close the row after 5 items or if it's the last item
    //         //     if (rowCounter % 5 === 4 || index === barcodes.length - 1) {
    //         //         barcodeRows += `</div>`;
    //         //     }

    //         //     rowCounter++;
    //         // });

    //         let barcodeRows = '';

    //         barcodes.forEach((item, index) => {
    //             barcodeRows += `
    //                 <div class="barcode-container">
    //                    <img class="barcode-img" style="width:80px; margin-bottom:5px;  margin-left:10px; margin-right:10px;" 
    //                           src="https://barcode.tec-it.com/barcode.ashx?data=${item.barcode}&code=Code39&translate-esc=true" 
    //                           alt="Barcode ${index + 1}" />
    //                 </div>
    //             `;
    //         });

    //         const html = `
    //             <html lang="en">
    //             <head>
    //                 <meta charset="UTF-8">
    //                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //                 <title>Print Barcodes</title>
    //                 <style>
    //                     @page {
    //                         size: A4;
    //                         margin: 15mm;
    //                     }
    //                     * {
    //                         font-size: 12px;
    //                         font-family: 'Nikosh', sans-serif !important;
    //                     }
    //                     body {
    //                         font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    //                         background-color: #f4f4f4;
    //                         display: flex;
    //                         flex-wrap: wrap;
    //                         justify-content: space-between;
    //                     }
    //                     .barcode-row {
    //                         width: 100%;
    //                         flex-wrap: wrap;
    //                         page-break-inside: avoid;
    //                     }
    //                     .barcode-container {
    //                         display: inline-block;
    //                         border: 1px dashed #E6E6E7;
    //                         background-color: #f4f4f4;
    //                         padding: 2.3px;
    //                         text-align: center;

    //                         page-break-inside: avoid;
    //                     }
    //                     .product-name {
    //                         margin-bottom: 8px;
    //                         font-weight: bold;
    //                         font-size: 10px;
    //                         color: #222;
    //                     }
    //                     img {
    //                         max-width: 100%;
    //                         height: auto;
    //                         margin-top: 5px;
    //                         page-break-before: auto;
    //                     }
    //                 </style>
    //             </head>
    //             <body>
    //                 <div class="barcode-row">
    //                     ${barcodeRows}
    //                 </div>
    //                 <script>
    //                     let imagesLoaded = 0;
    //                     const totalImages = document.querySelectorAll('.barcode-img').length;

    //                     function checkImagesLoaded() {
    //                         imagesLoaded++;
    //                         if (imagesLoaded === totalImages) {
    //                             window.print();
    //                         }
    //                     }

    //                     const images = document.querySelectorAll('.barcode-img');
    //                     images.forEach(img => {
    //                         img.onload = checkImagesLoaded;
    //                     });
    //                 </script>
    //             </body>
    //             </html>`;

    //         res.send(html);
    //     } catch (error) {
    //         console.error('Error generating barcode print view:', error);
    //         res.status(500).send('Error generating print view');
    //     }
    // },
    // barcode_pdf_single: async (req, res) => {
    //     const { htmlContent, options } = req.body;
    //     console.log(htmlContent)
    //     const { pageSize, orientation, fontSize, zoomMultiplier } = options;

    //     const pdfOptions = {
    //         pageSize: pageSize || 'A4',
    //         orientation: orientation || 'portrait',
    //         zoom: zoomMultiplier || 1,
    //         pageHeight: '29.7cm',
    //         pageWidth: '21cm',
    //         // Additional wkhtmltopdf options can be passed here
    //     };

    //     // Generate the PDF from HTML content
    //     wkhtmltopdf(htmlContent, pdfOptions)
    //         .pipe(res) // Send the PDF directly to the response
    //         .on('end', () => {
    //             console.log('PDF generated and sent.');
    //         })
    //         .on('error', (err) => {
    //             console.error('Error generating PDF:', err);
    //             res.status(500).send('Error generating PDF');
    //         });
    // },


    barcode_print_single: async (req, res) => {
        try {
            const { barcodes, selectedValue, selectedValues } = req.body;

            if (!barcodes || barcodes.length === 0) {
                return res.status(400).send('No barcode data provided');
            }

            // Generate barcode rows based on the data
            // let barcodeRows = '';
            // let rowCounter = 0;

            // barcodes.forEach((item, index) => {
            //     // Start a new row every 5 items
            //     if (rowCounter % 5 === 0) {
            //         barcodeRows += `<div class="barcode-row">`;
            //     }

            //     // <p class="product-name" style="margin-bottom:-2px">${item.product_name}</p>
            //     barcodeRows += `
            //         <div class="barcode-container">
            //             <img class="barcode-img" style="width:80px; margin-bottom:5px;  margin-left:10px; margin-right:10px;" 
            //                  src="https://barcode.tec-it.com/barcode.ashx?data=${item.barcode}&code=Code39&translate-esc=true" 
            //                  alt="Barcode ${index + 1}" />
            //         </div>
            //     `;

            //     // Close the row after 5 items or if it's the last item
            //     if (rowCounter % 5 === 4 || index === barcodes.length - 1) {
            //         barcodeRows += `</div>`;
            //     }

            //     rowCounter++;
            // });

            let barcodeRows = '';

            barcodes.forEach((item, index) => {
                barcodeRows += `
                    <div class="barcode-container">
                 ${selectedValue === 'with_name' ? `<p class="name" style="margin-bottom: -2.5px; text-align:center;">${item.product_name}</p>` : ''}
                       <img class="barcode-img" style="width:150px; height:74px; margin-bottom:5px;  margin-left:10px; margin-right:10px;" 
                              src="https://barcode.tec-it.com/barcode.ashx?data=${item.barcode}&code=${selectedValues}&translate-esc=true" 
                              alt="Barcode ${index + 1}" />
                    </div>
                `;
            });

            const html = `
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Print Barcodes</title>
                    <style>
                        @page {
                            size: A4;
                            margin: 15mm;
                        }
                        * {
                            font-size: 10px;
                            font-family: 'Nikosh', sans-serif !important;
                        }
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f4f4f4;
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: space-between;
                        }
                        .barcode-row {
                            width: 100%;
                            flex-wrap: wrap;
                            page-break-inside: avoid;
                        }
                        .barcode-container {
                            display: inline-block;
                            border: 1px dashed #E6E6E7;
                            background-color: #f4f4f4;
                            text-align: center;
                            margin:-3px;
                            page-break-inside: avoid;
                        }
                        .product-name {
                            margin-bottom: 8px;
                            font-weight: bold;
                            font-size: 10px;
                            color: #222;
                        }
                        img {
                            max-width: 100%;
                            height: auto;
                            margin-top: 5px;
                            page-break-before: auto;
                        }
                    </style>
                </head>
                <body>
                    <div class="barcode-row" style="width:21cm; height: 29.7cm;">
                        ${barcodeRows}
                    </div>
                    <script>
                        let imagesLoaded = 0;
                        const totalImages = document.querySelectorAll('.barcode-img').length;
                        
                        function checkImagesLoaded() {
                            imagesLoaded++;
                            if (imagesLoaded === totalImages) {
                                window.print();
                            }
                        }
    
                        const images = document.querySelectorAll('.barcode-img');
                        images.forEach(img => {
                            img.onload = checkImagesLoaded;
                        });
                    </script>
                </body>
                </html>`;

            res.send(html);
        } catch (error) {
            console.error('Error generating barcode print view:', error);
            res.status(500).send('Error generating print view');
        }
    },
    // barcode_pdf_single: async (req, res) => {
    //     const { htmlContent, options } = req.body;
    //     console.log(htmlContent)
    //     const { pageSize, orientation, fontSize, zoomMultiplier } = options;

    //     const pdfOptions = {
    //         pageSize: pageSize || 'A4',
    //         orientation: orientation || 'portrait',
    //         zoom: zoomMultiplier || 1,
    //         pageHeight: '29.7cm',
    //         pageWidth: '21cm',
    //         // Additional wkhtmltopdf options can be passed here
    //     };

    //     // Generate the PDF from HTML content
    //     wkhtmltopdf(htmlContent, pdfOptions)
    //         .pipe(res) // Send the PDF directly to the response
    //         .on('end', () => {
    //             console.log('PDF generated and sent.');
    //         })
    //         .on('error', (err) => {
    //             console.error('Error generating PDF:', err);
    //             res.status(500).send('Error generating PDF');
    //         });
    // },
    // barcode_pdf_single: async (req, res) => {
    //     const { htmlContent } = req.body;

    //     // If the content size is very large, consider streaming or handling in chunks
    //     if (htmlContent.length > 1000000) {  // Example threshold, adjust as necessary
    //         console.log('Content is too large, consider optimizing.');
    //         return res.status(413).send('Request too large');
    //     }

    //     // Generate the PDF from HTML content
    //     wkhtmltopdf(htmlContent)
    //         .pipe(res) // Stream the PDF directly to the response
    //         .on('end', () => {
    //             console.log('PDF generated and sent.');
    //         })
    //         .on('error', (err) => {
    //             console.error('Error generating PDF:', err);
    //             res.status(500).send('Error generating PDF');
    //         });
    // },
    // barcode_pdf_single: async (req, res) => {
    //     const { htmlContent } = req.body;

    //     // Generate the PDF from HTML content
    //     wkhtmltopdf(htmlContent)
    //         .pipe(res) // Send the PDF directly to the response
    //         .on('end', () => {
    //             console.log('PDF generated and sent.');
    //         })
    //         .on('error', (err) => {
    //             console.error('Error generating PDF:', err);
    //             res.status(500).send('Error generating PDF');
    //         });
    // },


    barcode_pdf_single: async (req, res) => {
        try {
            const { barcodes, selectedValues, selectedValue } = req.body;

            if (!barcodes || barcodes.length === 0) {
                return res.status(400).send('No barcode data provided');
            }

            // Generate barcode rows based on the data
            let barcodeRows = '';
            let rowCounter = 0;

            barcodes.forEach((item, index) => {
                // Start a new row every 5 items
                if (rowCounter % 5 === 0) {
                    barcodeRows += `<div class="barcode-row">`;
                }

                // barcodeRows += `
                //     <div class="barcode-container">
                //       ${selectedValue === 'with_name' && (
                //        ` <p class="product-name" style="margin-bottom:-2px; margin-top: 4px; font-size:10px">${item.product_name}</p>`
                //     )}
                //         <img class="barcode-img" style="width:154px; height:72px; margin-bottom:5px" 
                //              src="https://barcode.tec-it.com/barcode.ashx?data=${item.barcode}&code=${selectedValues}&translate-esc=true" 
                //              alt="Barcode ${index + 1}" />
                //     </div>
                // `;
                barcodeRows += `
    <div class="barcode-container">
        ${selectedValue === 'with_name' ? `<p class="product-name" style="margin-bottom:-2px; margin-top: 4px; font-size:10px">${item.product_name}</p>` : ''}
        <img class="barcode-img" style="width:154px; height:72px; margin-bottom:5px" 
             src="https://barcode.tec-it.com/barcode.ashx?data=${item.barcode}&code=${selectedValues}&translate-esc=true" 
             alt="Barcode ${index + 1}" />
    </div>
`;


                // Close the row after 5 items or if it's the last item
                if (rowCounter % 5 === 4 || index === barcodes.length - 1) {
                    barcodeRows += `</div>`;
                }

                rowCounter++;
            });



            const html = `
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Print Barcodes</title>
                    <style>
                        @page {
                            size: A4;
                            margin: 15mm;
                        }
                        * {
                            font-size: 12px;
                            font-family: 'Nikosh', sans-serif !important;
                        }
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f4f4f4;
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: space-between;
                        }
                        .barcode-row {
                            margin-left:2px;
                        display: flex;
                        width: 100%;
                        flex-wrap: wrap;
                        page-break-inside: avoid; /* Prevent row from breaking across pages */
                        }
                        .barcode-container {

                             display: inline-block;
                        border: 1px dashed #E6E6E7;
                        background-color: #f4f4f4;
                        padding: 4.5px;
                        text-align: center;
                        width: 19%;
                        margin-left:-4px;


                        }
                        .product-name {
                            margin-bottom: 8px;
                            font-weight: bold;
                            font-size: 14px;
                            color: #222;
                        }
                        img {
                            max-width: 100%;
                            height: auto;
                            margin-top: 5px;
                            page-break-before: auto;
                        }
                    </style>
                </head>
                <body>
                    <div class="barcode-row">
                        ${barcodeRows}
                    </div>
                    <script>
                        let imagesLoaded = 0;
                        const totalImages = document.querySelectorAll('.barcode-img').length;

                        function checkImagesLoaded() {
                            imagesLoaded++;
                            if (imagesLoaded === totalImages) {
                                window.print();
                            }
                        }

                        const images = document.querySelectorAll('.barcode-img');
                        images.forEach(img => {
                            img.onload = checkImagesLoaded;
                        });
                    </script>
                </body>
                </html>`;



            wkhtmltopdf(html, { pageSize: 'A4' }, (err, stream) => {
                if (err) {
                    console.error('Error generating PDF:', err);
                    res.status(500).send('Error generating PDF');
                    return;
                }
                stream.pipe(res);
            });
        } catch (error) {
            console.error('Error in barcode_pdf:', error);
            res.status(500).send('Error generating PDF');
        }
    },





}

module.exports = productModel