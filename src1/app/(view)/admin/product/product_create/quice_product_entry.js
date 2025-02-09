"use client";
const ExcelJS = require('exceljs');
import { useEffect, useState } from "react";
import React from 'react';

import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import toast from 'react-hot-toast';


const QuickProductEntry = () => {

    const [status, setStatus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const notifyS = (text) => toast.success(text);


    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/getStatus`)
            .then(res => res.json())
            .then(data => setStatus(data))
    }, [])
    const statusValueObj = status.map(status => status.status_name);
    const statusValue = statusValueObj.join(', ');


    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/getCategories`)
            .then(res => res.json())
            .then(data => setCategories(data))
    }, [])
    const categoryValueObj = categories.map(category => category.category_name);
    const categoryValue = categoryValueObj.join(', ');


    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/getSubCategories`)
            .then(res => res.json())
            .then(data => setSubCategories(data))
    }, [])
    const subCategoryValueObj = subCategories.map(sub_category => sub_category.sub_category_name);
    const subCategoryValue = subCategoryValueObj.join(', ');

    // export Excel form
    const exportExcelFile = () => {

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Excel Sheet 1");
        sheet.properties.defaultRowHeight = 15;
        sheet.properties.defaultColWidth = 15;
        sheet.pageSetup.horizontalCentered = true
        sheet.pageSetup.verticalCentered = true
        sheet.getRow(1).alignment = { horizontal: 'center' };
        // sheet.pageSetup.printArea = 'A1:G20';


        sheet.views = [
            { state: 'frozen', xSplit: 7, ySplit: 1 }
        ];



        for (let i = 0; i <= 6; i++) {
            let columnLetter = String.fromCharCode(i + 65) + "1";

            sheet.getCell(columnLetter).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '9bcbf0' },
            };
            sheet.getCell(columnLetter).border = {
                top: { style: "thin", color: { argb: "939090" } },
                left: { style: "thin", color: { argb: "939090" } },
                bottom: { style: "thin", color: { argb: "939090" } },
                right: { style: "thin", color: { argb: "939090" } },
            };

            sheet.getCell(columnLetter).font = {
                name: "Verdana",
                family: 4,
                size: 11,
                bold: true,
            };


        }

        // sheet.getCell('C1').protection = {
        //     locked: true,
        //     hidden: true,
        // };

        let column_header = [
            {
                header: "Category",
                key: "category",
                width: 20,
            },
            {
                header: "Sub Category",
                key: "sub_category",
                width: 20,
            }, {
                header: "Product Name",
                key: "product_name",
                width: 20,
            },
            {
                header: "Status",
                key: "status",
                width: 20,
            },
            {
                header: "Description",
                key: "description",
                width: 20,
            },
            {
                header: "Weight",
                key: "weight",
                width: 20,
            },
            {
                header: "Price",
                key: "price",
                width: 20,
                // style: {fill: {type: 'pattern', pattern: 'solid', bgColor: {argb: 'FF00FF00'}}},
            },

        ];
        sheet.columns = column_header;


        // Set the column format to text
        sheet.getColumn('A').numFmt = '@';
        sheet.getColumn('B').numFmt = '@';
        sheet.getColumn('C').numFmt = '@';
        sheet.getColumn('D').numFmt = '@';
        sheet.getColumn('E').numFmt = '@';
        sheet.getColumn('F').numFmt = '0';
        sheet.getColumn('G').numFmt = '0';



        const categoryList = `"${categoryValue}"`;
        sheet.dataValidations.add("A2:A9999", {
            type: 'list',
            allowBlank: true,
            formulae: [categoryList],
        });


        const subCategoryList = `"${subCategoryValue}"`;
        sheet.dataValidations.add("B2:B9999", {
            type: 'list',
            allowBlank: true,
            formulae: [subCategoryList],
        });


        const statusList = `"${statusValue}"`;
        sheet.dataValidations.add("D2:D9999", {
            type: 'list',
            allowBlank: true,
            showErrorMessage: true,
            formulae: [statusList],
        });


        workbook.xlsx.writeBuffer().then(function (data) {
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "Product Data Form.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        });


    };

    // upload Excel form
    const [data, setData] = useState([]);
    const dataArray = [];
    const newArray = [];
    const rows = {};


    // reading excel file and storing value into data
    const handleFileUpload = (e) => {
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            setData(sheet);
        };
    }

    const keys = Object.keys(data).filter(key => !key.startsWith('!'));

    keys.forEach(key => {
        const col = key[0];
        const row = key.slice(1);
        const value = data[key].v;

        if (!rows[row]) {
            rows[row] = {};
        }
        rows[row][col] = value;
    });

    Object.values(rows).forEach(rowObject => {
        dataArray.push(rowObject);
    });


    const userId = localStorage.getItem('userId')
    let status_id = 0;

    for (let index = 1; index < dataArray.length; index++) {
        const element = dataArray[index];
        element.D == 'Active' ? status_id = 1 : element.D == 'Inactive' ? status_id = 2 : status_id = 3;

        const arrObj = {
            category_name: element.A,
            sub_category_name: element.B,
            product_name: element.C,
            status_id: status_id,
            description: element.E,
            weight: element.F,
            price: element.G,
            created_by: userId
        }
        newArray.push(arrObj);
    }

    const dataPost = () => {
        for (let index = 0; index < newArray.length; index++) {
            const updateValue = newArray[index];

            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/excelInsertProductData`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                }, body: JSON.stringify(updateValue)
            })
                .then(Response => Response.json())
                .then(data => {
                    if (data?.affectedRows) {
                        Swal.fire({
                            title: 'Success!',
                            text: 'admin page list edit Successful !!',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        })
                    }
                })
        }

    }



    return (
        <div className="mt-6 ml-5 mr-5 ">
            <button className="btn btn-info float-end mt-2 mb-5" onClick={exportExcelFile}>
                Product info form
            </button>


            <div>
                <div className=" mb-5">
                    <input type="file" className="light mr-2" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    <button className="btn btn-info" onClick={() => dataPost()}>Save Data</button>
                </div>


                {newArray.length > 0 && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Sub Category</th>
                                <th>Product Name</th>
                                <th>Status</th>
                                <th>Description</th>
                                <th>Weight</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newArray.map((value, index) => (
                                <tr key={index}>
                                    <td>{value.category_name}</td>
                                    <td>{value.sub_category_name}</td>
                                    <td>{value.product_name}</td>
                                    <td>{value.status_id}</td>
                                    <td>{value.description}</td>
                                    <td>{value.weight}</td>
                                    <td>{value.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>



        </div>
    );

};

export default QuickProductEntry;



// 'use client' 
 //ismile
// import React, { useEffect, useState } from 'react';
// import '../../../../(view)/admin_layout/modal/fa.css'
// import Link from 'next/link';
// import Swal from "sweetalert2";




// const CreateProduct = () => {

//     const [numToAdd, setNumToAdd] = useState(1);
//     const [fields, setFields] = useState([{ product_name: '', status_id: '', file_path: '', description: '', brand_id: '', model_id: '', category_id: '', sub_category_id: '', period_id: '', unit_id: '', warranty_id: '', material_id: '', color_id: '', type_id: '' }]);


//     const handleChange = (index, event) => {
//         const newFields = [...fields];
//         if (event.target.type === 'file') {
//             newFields[index][event.target.name] = event.target.files[0];
//         } else {
//             newFields[index][event.target.name] = event.target.value;
//         }
//         setFields(newFields);
//     };

//     const handleAddMore = () => {
//         const numToAddInt = parseInt(numToAdd);
//         if (!isNaN(numToAddInt) && numToAddInt > 0) {
//             const newInputValues = [...fields];
//             for (let i = 0; i < numToAddInt; i++) {
//                 newInputValues.push({
//                     product_name: '', status_id: '', file_path: '', description: '', brand_id: '', model_id: '', category_id: '', sub_category_id: '', period_id: '', unit_id: '', warranty_id: '', material_id: '', color_id: '', type_id: ''
//                 });
//             }
//             setFields(newInputValues);
//             setNumToAdd(1);
//         }
//     };

//     const handleRemoveField = (index) => {
//         const newFields = [...fields];
//         newFields.splice(index, 1);
//         setFields(newFields);
//     };

//     const created = localStorage.getItem('userId')


//     const handleSubmit = (event) => {
//         event.preventDefault();

//         const form = event.target

//         for (let index = 0; index < fields.length; index++) {



//             const product_name = form.product_name.value || form?.product_name[index]?.value
//             const status_id = form.status_id.value || form?.status_id[index]?.value
//             const product_price = form.product_price.value || form?.product_price[index]?.value
//             const product_weight = form.product_weight.value || form?.product_weight[index]?.value
//             const product_description = form.product_description.value || form?.product_description[index]?.value
//             const brand_id = form.brand_id.value || form?.brand_id[index]?.value
//             const model_id = form.model_id.value || form?.model_id[index]?.value
//             const category_id = form.category_id.value || form?.category_id[index]?.value
//             const sub_category_id = form.sub_category_id.value || form?.sub_category_id[index]?.value
//             const period_id = form.period_id.value || form?.period_id[index]?.value
//             const unit_id = form.unit_id.value || form?.unit_id[index]?.value
//             const warranty_id = form.warranty_id.value || form?.warranty_id[index]?.value
//             const material_id = form.material_id.value || form?.material_id[index]?.value
//             const color_id = form.color_id.value || form?.color_id[index]?.value
//             const type_id = form.type_id.value || form?.type_id[index]?.value

//             // Add your form submission logic here using the 'fields' state.

//             const productData = {
//                 product_name,
//                 status_id,
//                 product_price,
//                 product_weight,
//                 product_description,
//                 created_by: created,
//                 brand_id,
//                 model_id,
//                 category_id,
//                 sub_category_id,
//                 period_id,
//                 unit_id,
//                 warranty_id,
//                 material_id,
//                 color_id,
//                 type_id

//             }
//             console.log(productData)
//             // `${process.env.NEXT_PUBLIC_API_URL}:5002/insertProductData`

//             fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/insertProduct`, {
//                 method: 'POST',
//                 headers: {
//                     'content-type': 'application/json',
//                 },
//                 body: JSON.stringify(productData),
//             })
//                 .then((Response) => Response.json())
//                 .then((data) => {
//                     if (data?.affectedRows) {
//                         Swal.fire({
//                             title: 'Success!',
//                             text: 'admin page list edit Successful !!',
//                             icon: 'success',
//                             confirmButtonText: 'Ok'
//                         })
//                     }
//                 })
//                 .catch((error) => console.error(error));
//         }
//     }

//     const page_group = localStorage.getItem('pageGroup')

//     const [brand, setBrand] = useState([])

//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/brand/brand_all`)
//             .then(res => res.json())
//             .then(data => setBrand(data))
//     }, [])

//     console.log(brand)

//     const [model, setModel] = useState([])

//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/model/model_all`)
//             .then(res => res.json())
//             .then(data => setModel(data))
//     }, [])

//     console.log(model)

//     const [category, setCategory] = useState([])

//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_all`)
//             .then(res => res.json())
//             .then(data => setCategory(data))
//     }, [])

//     console.log(category)

//     const [subCategory, setSubCategory] = useState([])

//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sub_category/sub_category_all`)
//             .then(res => res.json())
//             .then(data => setSubCategory(data))
//     }, [])

//     console.log(subCategory)

//     const [color, setColor] = useState([])
//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/color/color_all`)
//             .then(res => res.json())
//             .then(data => setColor(data))
//     }, [])

//     console.log(color)

//     const [material, setMaterial] = useState([])
//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/material/material_all`)
//             .then(res => res.json())
//             .then(data => setMaterial(data))
//     }, [])

//     console.log(material)
//     const [period, setPeriod] = useState([])
//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/period/period_all`)
//             .then(res => res.json())
//             .then(data => setPeriod(data))
//     }, [])

//     console.log(period)

//     const [type, setType] = useState([])
//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/type/type_all`)
//             .then(res => res.json())
//             .then(data => setType(data))
//     }, [])

//     console.log(type)

//     const [unit, setUnit] = useState([])
//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/unit/unit_all`)
//             .then(res => res.json())
//             .then(data => setUnit(data))
//     }, [])

//     console.log(unit)

//     const [warranty, setWarranty] = useState([])
//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/warranty/warranty_all`)
//             .then(res => res.json())
//             .then(data => setWarranty(data))
//     }, [])

//     console.log(warranty)


//     const [status, setStatus] = useState([])
//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
//             .then(res => res.json())
//             .then(data => setStatus(data))
//     }, [])

//     console.log(status)


//     const filteredModels = (brandId) => {
//         console.log(typeof (brandId))
//         console.log((brandId))
//         console.log(model.filter(model => model.brand_id === Number(brandId)))
//         return model.filter(model => model.brand_id === Number(brandId));
//     };

//     const SubCategory = (subCateId) => {
//         console.log(typeof (subCateId))
//         console.log((subCateId))
//         console.log(subCategory.filter(subCate => subCate.brand_id === Number(subCateId)))
//         return subCategory.filter(subCate => subCate.category_id === Number(subCateId))
//     };


//     return (
//         <div className="card-default">
//             <div className="card-header custom-card-header py-1 bg-dark clearfix bg-gradient-primary text-white">
//                 <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Create Product</h5>
//                 <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
//                     <Link href={`/Admin/brand/brand_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to Product List</Link>
//                 </div>
//             </div>

//             <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
//                 (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//             </div>

//             <div className="card-body">
//                 {/* form ----------------------------------------------------------------------------------------------------------------*/}
//                 <form className="form-horizontal" method="post" autoComplete="off" onSubmit={handleSubmit}>
//                     <div>
//                         {/* Add Multiple form ---------------------------------------------------- */}
//                         <div className="card-header custom-card-header py-1 clearfix bg-dark text-light">
//                             <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
//                                 <strong>Product</strong>
//                             </div>

//                             <div className="card-title card-header-color font-weight-bold mb-0 float-right">
//                                 <div className="input-group">
//                                     <input
//                                         style={{ width: '80px' }}
//                                         type="number"
//                                         min="1"
//                                         className="form-control "
//                                         placeholder="Enter number of forms to add"
//                                         value={numToAdd}
//                                         onChange={(event) => setNumToAdd(event.target.value)}
//                                     />
//                                     <div className="input-group-append">
//                                         <button
//                                             type="button"
//                                             className="btn btn-info btn-sm py-1 add_more "
//                                             onClick={handleAddMore}
//                                         >
//                                             Add More
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>


//                         <div>


//                             <div className="form-group row">

//                                 {fields.map((field, index) => (

//                                     <div key={index} className='col-lg-12  mt-5 ' >
//                                         <div className='d-lg-flex border'>
//                                             <div className='col-lg-10 m-0 p-0'>

//                                                 <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>
//                                                     <div className='col-lg-4 border'>
//                                                         <label className='font-weight-bold'>Brand Name:</label>
//                                                         <select
//                                                             required=""
//                                                             name="brand_id"
//                                                             className="form-control form-control-sm mb-2"
//                                                             value={field.brand_id}
//                                                             onChange={(e) => handleChange(index, e)}
//                                                         >
//                                                             <option value="">Select Brand</option>
//                                                             {brand.map(brand => (
//                                                                 <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                     <div className='col-lg-4 border'>
//                                                         <label className='font-weight-bold'>Model Name:</label>
//                                                         <select
//                                                             required=""
//                                                             name="model_id"
//                                                             className="form-control form-control-sm mb-2"
//                                                             value={field.model_id}
//                                                             onChange={(e) => handleChange(index, e)}
//                                                         >
//                                                             <option value="">Select Model</option>
//                                                             {filteredModels(field.brand_id).map(model => (
//                                                                 <option key={model.id} value={model.id}>{model.model_name}</option>
//                                                             ))}
//                                                         </select>
//                                                     </div>


//                                                     <div className='col-lg-4 border'>
//                                                         <label className='font-weight-bold'>Category Name:</label>
//                                                         <select
//                                                             required=""
//                                                             name="category_id"
//                                                             className="form-control form-control-sm mb-2"
//                                                             value={field.category_id}
//                                                             onChange={(e) => handleChange(index, e)}
//                                                         >
//                                                             <option value="">Select Brand</option>
//                                                             {category.map(categorys => (
//                                                                 <option key={categorys.id} value={categorys.id}>{categorys.category_name}</option>
//                                                             ))}
//                                                         </select>
//                                                     </div>


//                                                 </div>
//                                                 <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>
//                                                     <div className='col-lg-4 border'>
//                                                         <label className='font-weight-bold'>Sub Category Name:</label>
//                                                         <select
//                                                             required=""
//                                                             name="sub_category_id"
//                                                             className="form-control form-control-sm mb-2"
//                                                             value={field.sub_category_id}
//                                                             onChange={(e) => handleChange(index, e)}
//                                                         >
//                                                             <option value="">Select Model</option>
//                                                             {SubCategory(field.category_id).map(sub_category => (
//                                                                 <option key={sub_category.id} value={sub_category.id}>{sub_category.sub_category_name}</option>
//                                                             ))}
//                                                         </select>
//                                                     </div>
//                                                     <div className='col-lg-4 border'>
//                                                         <label className='font-weight-bold'>Color Name:</label>
//                                                         <select
//                                                             required=""
//                                                             name="color_id"
//                                                             className="form-control form-control-sm mb-2"
//                                                             value={field.color_id}
//                                                             onChange={(e) => handleChange(index, e)}
//                                                         >
//                                                             <option value="">Select Status</option>
//                                                             {
//                                                                 color.map(colors =>
//                                                                     <>

//                                                                         <option value={colors.id}>{colors.color_name}</option>
//                                                                     </>
//                                                                 )
//                                                             }
//                                                         </select>
//                                                     </div>
//                                                     <div className='col-lg-4 border'>
//                                                         <label className='font-weight-bold'>Material Name:</label>
//                                                         <select
//                                                             required=""
//                                                             name="material_id"
//                                                             className="form-control form-control-sm mb-2"
//                                                             value={field.material_id}
//                                                             onChange={(e) => handleChange(index, e)}
//                                                         >
//                                                             <option value="">Select Status</option>
//                                                             {
//                                                                 material.map(materials =>
//                                                                     <>

//                                                                         <option value={materials.id}>{materials.material_name}</option>
//                                                                     </>
//                                                                 )
//                                                             }
//                                                         </select>
//                                                     </div>
//                                                 </div>

//                                                 <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>
//                                                     <div className='col-lg-4 border'>
//                                                         <label className='font-weight-bold'>Period Name:</label>
//                                                         <select
//                                                             required=""
//                                                             name="period_id"
//                                                             className="form-control form-control-sm mb-2"
//                                                             value={field.period_id}
//                                                             onChange={(e) => handleChange(index, e)}
//                                                         >
//                                                             <option value="">Select Status</option>
//                                                             {
//                                                                 period.map(periods =>
//                                                                     <>

//                                                                         <option value={periods.id}>{periods.period_name}</option>
//                                                                     </>
//                                                                 )
//                                                             }
//                                                         </select>
//                                                     </div>

//                                                     <div className='col-lg-4 border'>
//                                                         <label className='font-weight-bold'>Type Name:</label>
//                                                         <select
//                                                             required=""
//                                                             name="type_id"
//                                                             className="form-control form-control-sm mb-2"
//                                                             value={field.type_id}
//                                                             onChange={(e) => handleChange(index, e)}
//                                                         >
//                                                             <option value="">Select Status</option>
//                                                             {
//                                                                 type.map(types =>
//                                                                     <>

//                                                                         <option value={types.id}>{types.type_name}</option>
//                                                                     </>
//                                                                 )
//                                                             }
//                                                         </select>
//                                                     </div>

//                                                     <div className='col-lg-4 border'>
//                                                         <label className='font-weight-bold'>Unit Name:</label>
//                                                         <select
//                                                             required=""
//                                                             name="unit_id"
//                                                             className="form-control form-control-sm mb-2"
//                                                             value={field.unit_id}
//                                                             onChange={(e) => handleChange(index, e)}
//                                                         >
//                                                             <option value="">Select Status</option>
//                                                             {
//                                                                 unit.map(units =>
//                                                                     <>

//                                                                         <option value={units.id}>{units.unit_name}</option>
//                                                                     </>
//                                                                 )
//                                                             }
//                                                         </select>
//                                                     </div>
//                                                 </div>

//                                                 <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>


//                                                     <div className='col-lg-4 border'>
//                                                         <label className='font-weight-bold'>Warranty Name:</label>
//                                                         <select
//                                                             required=""
//                                                             name="warranty_id"
//                                                             className="form-control form-control-sm mb-2"
//                                                             value={field.warranty_id}
//                                                             onChange={(e) => handleChange(index, e)}
//                                                         >
//                                                             <option value="">Select Status</option>
//                                                             {
//                                                                 warranty.map(warrantys =>
//                                                                     <>

//                                                                         <option value={warrantys.id}>{warrantys.warranty_name}</option>
//                                                                     </>
//                                                                 )
//                                                             }
//                                                         </select>
//                                                     </div>
//                                                     <div className='col-lg-4 border'>

//                                                         <label className='font-weight-bold'>Status:</label>

//                                                         <select
//                                                             required=""
//                                                             name="status_id"
//                                                             className="form-control form-control-sm mb-2"
//                                                             value={field.status_id}
//                                                             onChange={(e) => handleChange(index, e)}
//                                                         >
//                                                             <option value="">Select Status</option>
//                                                             {
//                                                                 status.map(sta =>
//                                                                     <>

//                                                                         <option value={sta.id}>{sta.status_name}</option>
//                                                                     </>

//                                                                 )
//                                                             }


//                                                             {/* <option value="2">Inactive</option> */}
//                                                         </select>
//                                                     </div>
//                                                     <div className='col-lg-4  border '>
//                                                         <label className='font-weight-bold'>weight:</label>
//                                                         <input
//                                                             type="text"
//                                                             required=""
//                                                             name="product_weight"
//                                                             className="form-control form-control-sm mb-2"
//                                                             placeholder="Enter Unit Weight"
//                                                             onChange={(e) => handleChange(index, e)}
//                                                         />
//                                                     </div>




//                                                 </div>

//                                                 <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>

//                                                     <div className='col-lg-6  border '>
//                                                         <label className='font-weight-bold'>Product Name:</label>
//                                                         <input
//                                                             type="text"
//                                                             required=""
//                                                             name="product_name"
//                                                             className="form-control form-control-sm mb-2"
//                                                             placeholder="Enter Product Name"
//                                                             onChange={(e) => handleChange(index, e)}
//                                                         />
//                                                     </div>


//                                                     <div className='col-lg-6  border'>
//                                                         <label className='font-weight-bold'>Price:</label>
//                                                         <input
//                                                             type="text"
//                                                             required=""
//                                                             name="product_price"
//                                                             className="form-control form-control-sm mb-2"
//                                                             placeholder="Enter Unit Price"

//                                                             onChange={(e) => handleChange(index, e)}
//                                                         />
//                                                     </div>

//                                                 </div>
//                                                 <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>
//                                                     <div className='col-lg-12 border'>

//                                                         <label className='font-weight-bold'>Description:</label>
//                                                         <textarea
//                                                             rows={'5'}
//                                                             name="product_description"
//                                                             className="form-control form-control-sm mb-2"
//                                                             placeholder="Enter product description"
//                                                             onChange={(e) => handleChange(index, e)}
//                                                         ></textarea>
//                                                     </div>
//                                                 </div>
//                                                 <div>
//                                                 </div>
//                                             </div>
//                                             <div className='col-lg-2 '>
//                                                 <label className='font-weight-bold'>Action</label>
//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-danger btn-sm form-control form-control-sm mb-2"
//                                                     onClick={() => handleRemoveField(index)}
//                                                 >
//                                                     <i className="fas fa-trash-alt"></i>
//                                                 </button>

//                                             </div>
//                                         </div>
//                                     </div>

//                                 ))}
//                             </div>



//                         </div>
//                     </div>



//                     <div className="form-group row">
//                         <div className="offset-md-3 col-sm-6">
//                             <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
//                         </div>
//                     </div>


//                 </form>
//             </div>


//         </div>

//     );
// };

// export default CreateProduct;