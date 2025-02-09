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


const brandModel = {





  branch_create: async (req, res) => {
    try {
      const brands = req.body;
      const results = [];

      for (const brand of brands) {
        const { company_id, company_type_id, branch_name, status_id, office_address, mobile, email, phone, created_by } = brand;

        // if (!branch_name || !status_id) {
        //   return res.status(400).json({ message: 'brand name and status ID are required' });
        // }

        const processedbrandName = branch_name?.replace(/\s+/g, ' ').trim();

        const selectQuery = 'SELECT * FROM branch_info WHERE TRIM(branch_name) = ?';
        const existingBrands = await new Promise((resolve, reject) => {
          connection.query(selectQuery, [processedbrandName], (error, results) => {
            if (error) {
              console.log(error);
              reject(error);
            }
            resolve(results);
          });
        });

        if (existingBrands.length === 0) {
          const insertQuery = 'INSERT INTO branch_info (company_id, company_type_id, branch_name, status_id, office_address, mobile, email, phone , created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
          const insertedBrand = await new Promise((resolve, reject) => {
            connection.query(insertQuery, [company_id, company_type_id, processedbrandName, status_id, office_address, mobile, email, phone, created_by], (error, result) => {
              if (error) {
                console.log(error);
                reject(error);
              }
              resolve(result);
            });
          });

          console.log(insertedBrand);
          results.push(insertedBrand);
        } else {
          console.log(`Brand '${processedbrandName}' already exists, skipping insertion.`);
        }
      }

      res.send(results);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },


  //   brand_copy: async (req, res) => {
  //     try {

  //       const { brand_name, status_id, file_path, description, created_by } = req.body;

  //       if (!brand_name || !status_id) {
  //         return res.status(400).json({ message: 'brand name is required' });
  //       }

  //       // Remove extra spaces from brand_name
  //       const processedbrandName = brand_name.replace(/\s+/g, ' ').trim();

  //       // Check if the brand already exists
  //       const selectQuery = 'SELECT * FROM brand WHERE TRIM(brand_name) = ?';
  //       connection.query(selectQuery, [processedbrandName], (error, results) => {
  //         if (error) {
  //           console.log(error, 'Internal Server Error');
  //           return res.status(500).json({ message: 'Internal Server Error' });
  //         }

  //         if (results.length > 0) {
  //           // brand with a similar name already exists
  //           console.log('brand already exists');
  //           return res.status(400).json({ message: 'brand already exists' });
  //         }

  //         // If brand doesn't exist, insert it
  //         const insertQuery = 'INSERT INTO brand (brand_name, status_id, file_path, description, created_by) VALUES (?, ?, ?, ?, ?)';
  //         connection.query(
  //           insertQuery,
  //           [processedbrandName, status_id, file_path, description, created_by],
  //           (error, result) => {
  //             if (error) {
  //               console.log(error);
  //               return res.status(500).json({ message: 'Internal Server Error' });
  //             }
  //             console.log(result);
  //             return res.send(result);
  //           }
  //         );
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       res.status(500).json({ message: 'Internal Server Error' });
  //     }
  //   },

  brance_list: async (req, res) => {
    try {
      const data = `
        SELECT 
          branch_info.*, 
          company.company_name, 
          company_type.company_type_name 
        FROM 
          branch_info 
        LEFT JOIN 
          company ON branch_info.company_id = company.id 
        LEFT JOIN 
          company_type ON branch_info.company_type_id = company_type.id
      `;

      connection.query(data, function (error, result) {
        if (!error) {
          res.send(result);
        } else {
          console.log(error);
          res.status(500).send('Error retrieving branch list');
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
  },





  branch_delete: async (req, res) => {
    
    try {
      const shiftId = req.params.id;

      console.log(shiftId)

      // First, check if the shift_id is referenced in employee_joining
      const checkQuery = 'SELECT COUNT(*) AS count FROM employe_joining WHERE branch_id = ?';
      connection.query(checkQuery, [shiftId], (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: 'Database error' });
        }

        const isReferenced = results[0].count > 0;

        if (isReferenced) {
          // If referenced, prevent deletion
          return res.status(400).json({ message: 'Cannot delete: School shift is in use.' });
        }

        // Proceed with deletion if not referenced
        const deleteQuery = 'DELETE FROM branch_info WHERE id = ?';
        connection.query(deleteQuery, [shiftId], (deleteError, deleteResult) => {
          if (!deleteError && deleteResult.affectedRows > 0) {
            console.log(deleteResult);
            return res.send(deleteResult);
          } else {
            console.log(deleteError || 'School shift not found');
            return res.status(404).json({ message: 'School shift not found.' });
          }
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // branch_delete: async (req, res) => {

  //   try {
  //     const query = 'DELETE FROM branch_info WHERE id = ?';
  //     connection.query(query, [req.params.id], (error, result) => {
  //       if (!error && result.affectedRows > 0) {
  //         console.log(result);
  //         return res.send(result);
  //       } else {
  //         console.log(error || 'Product not found');
  //         return res.status(404).json({ message: 'Product not found.' });
  //       }
  //     });
  //   }
  //   catch (error) {
  //     console.log(error)
  //   }
  // },


  branch_single: async (req, res) => {
    try {
      const query = 'SELECT * FROM branch_info WHERE id = ?';
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


  branch_update: async (req, res) => {
    try {

      const { company_id, company_type_id, branch_name, status_id, office_address, mobile, email, phone, modified_by } = req.body;

      const query = `UPDATE branch_info SET company_id = ?, company_type_id = ?, branch_name = ?, status_id = ?, office_address = ?, mobile = ?, email = ? , phone = ? , modified_by = ? WHERE id = ?`;
      connection.query(query, [company_id, company_type_id, branch_name, status_id, office_address, mobile, email, phone, modified_by, req.params.id], (error, result) => {
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


  company_type_list: async (req, res) => {
    try {
      const data = "select * from  company_type";

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

  branch_list_paigination: async (req, res) => {
    const pageNo = Number(req.params.pageNo);
    const perPage = Number(req.params.perPage);
    try {
      const skipRows = (pageNo - 1) * perPage;
      //       let query = `
      //   SELECT branch_info.*, 
      //          users_created.full_name AS created_by,
      //          users_modified.full_name AS modified_by 
      //   FROM branch_info 
      //   LEFT JOIN users AS users_created ON branch_info.created_by = users_created.id 
      //   LEFT JOIN users AS users_modified ON branch_info.modified_by = users_modified.id 
      //   ORDER BY branch_info.id DESC
      //   LIMIT ?, ?
      // `;
      let query = `
SELECT branch_info.*, 
       users_created.full_name AS created_by,
       users_modified.full_name AS modified_by,
       company.company_name AS company_name,
       company_type.company_type_name AS company_type_name
FROM branch_info 
LEFT JOIN users AS users_created ON branch_info.created_by = users_created.id 
LEFT JOIN users AS users_modified ON branch_info.modified_by = users_modified.id
LEFT JOIN company ON branch_info.company_id = company.id
LEFT JOIN company_type ON branch_info.company_type_id = company_type.id
ORDER BY branch_info.id DESC
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


}

module.exports = brandModel




