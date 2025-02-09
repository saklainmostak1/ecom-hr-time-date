'use client' 
 //ismile
import React, { useEffect, useState } from 'react';
import '../../../../(view)/admin_layout/modal/fa.css'
import Link from 'next/link';
import Swal from "sweetalert2";
import { FaDownload, FaTimes, FaUpload } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
const ExcelJS = require('exceljs');
import * as XLSX from "xlsx";
import { useQuery } from '@tanstack/react-query';



const ProductQuickEntry = () => {
    const [numToAdd, setNumToAdd] = useState(1);
  
    const [page_group, setPage_group] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pageGroup') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('pageGroup');
            setPage_group(storedUserId);
        }
    }, []);

    const [created, setUserId] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setUserId(storedUserId);
        }
    }, []);



    const [supplier, setSupplier] = useState('');
    const [supplier_id, setSupplier_id] = useState('');

    const [fields, setFields] = useState([{
        product_name: '', product_brand_id: '', product_category_id: '', product_status: '', file_path: '', product_description: '', product_brand: '', product_model: '', product_category: '', product_sub_category: '', product_period: '', product_unit: '', product_quantity: '', product_material: '', product_color: '', product_type: '',
        product_price: '', product_weight: '', created_by: created, supplier_id: ''
    }]);

    useEffect(() => {
        if (supplier_id) {
            setFields(prevFields => prevFields.map(field => ({ ...field, supplier_id: supplier_id })));
        }
    }, [supplier_id]);

    const update_fields = (index, event) => {

        // console.log(index);
        const newFields = [...fields];
        let product_value;

        if (event.target.name == 'product_brand') {
            let value = event.target.value.split(",");
            product_value = value[0];
            newFields[index]['product_brand_id'] = value[1];
        } else if (event.target.name == 'product_category') {
            let value = event.target.value.split(",");
            product_value = value[0];
            newFields[index]['product_category_id'] = value[1];
        } else {
            product_value = event.target.value;
        }


        if (event.target.type === 'file') {
            newFields[index][event.target.name] = event.target.files[0];
        } else {
            newFields[index][event.target.name] = product_value;
        }
        const brandName = newFields[index]['product_name'];
        if (brandName) {
            setProductName(""); // Clear the error message
        }

        const brandNames = newFields[index]['product_brand'];
        if (brandNames) {
            setBrandName(""); // Clear the error message
        }
        const modelNames = newFields[index]['product_model'];
        if (modelNames) {
            setModelName(""); // Clear the error message
        }

        const categoryNames = newFields[index]['product_category'];
        if (categoryNames) {
            setCategoryName(""); // Clear the error message
        }

        const subCategoryNames = newFields[index]['product_sub_category'];
        if (subCategoryNames) {
            setSubCategoryName(""); // Clear the error message
        }

        const colorNames = newFields[index]['product_color'];
        if (colorNames) {
            setColorName(""); // Clear the error message
        }

        const materialNames = newFields[index]['product_material'];
        if (materialNames) {
            setMaterialName(""); // Clear the error message
        }

        const periodNames = newFields[index]['product_period'];
        if (periodNames) {
            setPeriodName(""); // Clear the error message
        }
        const typeNames = newFields[index]['product_type'];
        if (typeNames) {
            setTypeName(""); // Clear the error message
        }

        const unitNames = newFields[index]['product_unit'];
        if (unitNames) {
            setUnitName(""); // Clear the error message
        }

        const warrantyNames = newFields[index]['product_quantity'];
        if (warrantyNames) {
            setWarrantyName(""); // Clear the error message
        }
        const WeightNames = newFields[index]['product_weight'];
        if (WeightNames) {
            setWeightName(""); // Clear the error message
        }

        const priceNames = newFields[index]['product_price'];
        if (priceNames) {
            setPriceName(""); // Clear the error message
        }

        const status = newFields[index]['product_status'];
        if (status) {
            setError(""); // Clear the error message
        }
        // const matchingBrand = products.find(item => item.product_name?.toLowerCase() === brandName.toLowerCase());
        // if (!matchingBrand) {
        //     setSameProductName('');
        //     // You can also set an error state to show the message in the UI instead of using alert
        // }
        setFields(newFields);
    };

    const handleAddMore = () => {

        const numToAddInt = parseInt(numToAdd);

        if (!isNaN(numToAddInt) && numToAddInt > 0) {

            const newInputValues = [...fields];
            for (let i = 0; i < numToAddInt; i++) {
                newInputValues.push({
                    product_name: '', product_brand_id: '', product_category_id: '', product_status: '', file_path: '', product_description: '', product_brand: '', product_model: '', product_category: '', product_sub_category: '', product_period: '', product_unit: '', product_quantity: '', product_material: '', product_color: '', product_type: '', product_price: '', product_weight: '',
                    created_by: created
                });
            }
            setFields(newInputValues);
            setNumToAdd(1);
        }
    };



    const handleRemoveField = (index) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };
    const router = useRouter()

    const [brandName, setBrandName] = useState([])
    const [ModelName, setModelName] = useState([])
    const [CategoryName, setCategoryName] = useState([])
    const [SubCategoryName, setSubCategoryName] = useState([])
    const [ColorName, setColorName] = useState([])
    const [MaterialName, setMaterialName] = useState([])
    const [PeriodName, setPeriodName] = useState([])
    const [TypeName, setTypeName] = useState([])
    const [UnitName, setUnitName] = useState([])
    const [WarrantyName, setWarrantyName] = useState([])
    const [WeightName, setWeightName] = useState([])
    const [PriceName, setPriceName] = useState([])
    const [Error, setError] = useState([])
    const [ProductName, setProductName] = useState([])

    const handleValidation = (field, errorMessage, setErrorState) => {
        const errors = new Array(fields.length).fill('');
        const isValid = fields.every((inputValue, index) => {
            if (!inputValue[field]) {
                errors[index] = errorMessage;
                return false;
            }
            return true;
        });

        if (!isValid) {
            setErrorState(errors);
            return false;
        }
        setErrorState(new Array(fields.length).fill(''));
        return true;
    };

    const quick_product_entry = (event) => {
        event.preventDefault();

        if (!handleValidation('product_brand', 'Please Enter A Brand Name.', setBrandName)) return;
        if (!handleValidation('product_model', 'Please Enter A Model Name.', setModelName)) return;
        if (!handleValidation('product_category', 'Please Enter A Category Name.', setCategoryName)) return;
        if (!handleValidation('product_sub_category', 'Please Enter A Sub Category Name.', setSubCategoryName)) return;
        // if (!handleValidation('product_color', 'Please Enter A Color Name.', setColorName)) return;
        // if (!handleValidation('product_material', 'Please Enter A Material Name.', setMaterialName)) return;
        // if (!handleValidation('product_period', 'Please Enter a Period.', setPeriodName)) return;
        // if (!handleValidation('product_type', 'Please Enter a Type.', setTypeName)) return;
        // if (!handleValidation('product_unit', 'Please Enter a Unit.', setUnitName)) return;
        // if (!handleValidation('product_quantity', 'Please Enter a Warranty.', setWarrantyName)) return;
        if (!handleValidation('product_status', 'This must be filled.', setError)) return;
        if (!handleValidation('product_weight', 'Product Weight must be filled.', setWeightName)) return;
        if (!handleValidation('product_name', 'Product Name must be filled.', setProductName)) return;
        if (!handleValidation('product_price', 'Product Price must be filled.', setPriceName)) return;


        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_quick_create`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(fields),
        })

            .then((Response) => Response.json())
            .then((data) => {
                console.log(data)
                router.push('/Admin/product/product_all');
                if (data == 'success') {
                    sessionStorage.setItem("message", "Data saved successfully!");
                    router.push('/Admin/product/product_all');
                }

            })
            .catch((error) => console.error(error));



    }
    // ------------------------------------------------------------------




    const [brand, setBrand] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/brand/brand_all`)
            .then(res => res.json())
            .then(data => setBrand(data))
    }, [])


    const [model, setModel] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/model/model_all`)
            .then(res => res.json())
            .then(data => setModel(data))
    }, [])


    const [category, setCategory] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_all`)
            .then(res => res.json())
            .then(data => setCategory(data))
    }, [])


    const [subCategory, setSubCategory] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sub_category/sub_category_all`)
            .then(res => res.json())
            .then(data => setSubCategory(data))
    }, [])


    const [color, setColor] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/color/color_all`)
            .then(res => res.json())
            .then(data => setColor(data))
    }, [])


    const [material, setMaterial] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/material/material_all`)
            .then(res => res.json())
            .then(data => setMaterial(data))
    }, [])



    const [period, setPeriod] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/period/period_all`)
            .then(res => res.json())
            .then(data => setPeriod(data))
    }, [])


    const [type, setType] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/type/type_all`)
            .then(res => res.json())
            .then(data => setType(data))
    }, [])


    const [unit, setUnit] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/unit/unit_all`)
            .then(res => res.json())
            .then(data => setUnit(data))
    }, [])


    const [warranty, setWarranty] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/warranty/warranty_all`)
            .then(res => res.json())
            .then(data => setWarranty(data))
    }, [])


    const [status, setStatus] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
            .then(res => res.json())
            .then(data => setStatus(data))
    }, [])


    // ========================================================================================================Miraj

    // export Excel form
    // const exportExcelFile = () => {

    //     const workbook = new ExcelJS.Workbook();
    //     const sheet = workbook.addWorksheet("Excel Sheet 1");
    //     sheet.properties.defaultRowHeight = 15;
    //     sheet.properties.defaultColWidth = 15;
    //     sheet.pageSetup.horizontalCentered = true
    //     sheet.pageSetup.verticalCentered = true
    //     sheet.getRow(1).alignment = { horizontal: 'center' };

    //     for (let i = 0; i <= 14; i++) {
    //         let columnLetter = String.fromCharCode(i + 65) + "1";

    //         sheet.getCell(columnLetter).fill = {
    //             type: 'pattern',
    //             pattern: 'solid',
    //             fgColor: { argb: '9bcbf0' },
    //         };
    //         sheet.getCell(columnLetter).border = {
    //             top: { style: "thin", color: { argb: "939090" } },
    //             left: { style: "thin", color: { argb: "939090" } },
    //             bottom: { style: "thin", color: { argb: "939090" } },
    //             right: { style: "thin", color: { argb: "939090" } },
    //         };

    //         sheet.getCell(columnLetter).font = {
    //             name: "Verdana",
    //             family: 4,
    //             size: 11,
    //             bold: true,
    //         };


    //     }


    //     // column  header
    //     let column_header = [

    //         {
    //             header: "Product Name",
    //             key: "product_name",
    //             width: 20,
    //         },
    //         {
    //             header: "Price",
    //             key: "price",
    //             width: 10,
    //         },
    //         {
    //             header: "Product Unit",
    //             key: "product_unit",
    //             width: 20,
    //         },
    //         {
    //             header: "Weight",
    //             key: "weight",
    //             width: 15,
    //         },
    //         {
    //             header: "Product Description",
    //             key: "description",
    //             width: 25,
    //         },
    //         {
    //             header: "Product Model",
    //             key: "product_model",
    //             width: 20,
    //         },
    //         {
    //             header: "Product Material",
    //             key: "product_material",
    //             width: 20,
    //         },
    //         {
    //             header: "Product Color",
    //             key: "product_color",
    //             width: 20,
    //         },
    //         {
    //             header: "Product Type",
    //             key: "product_type",
    //             width: 20,
    //         },
    //         {
    //             header: "Brand Name",
    //             key: "brand_name",
    //             width: 20,
    //         },
    //         {
    //             header: "Category",
    //             key: "category",
    //             width: 20,
    //         },
    //         {
    //             header: "Sub Category",
    //             key: "sub_category",
    //             width: 20,
    //         },

    //         {
    //             header: "Period",
    //             key: "period",
    //             width: 20,
    //         },
    //         {
    //             header: "Product Warranty",
    //             key: "product_quantity",
    //             width: 25,
    //         },
    //         {
    //             header: "Status",
    //             key: "status",
    //             width: 20,
    //         },

    //     ];

    //     sheet.columns = column_header;

    //     // Set the column format to text
    //     sheet.getColumn('category').numFmt = '@';
    //     sheet.getColumn('sub_category').numFmt = '@';
    //     sheet.getColumn('brand_name').numFmt = '@';
    //     sheet.getColumn('product_name').numFmt = '@';
    //     sheet.getColumn('status').numFmt = '@';
    //     sheet.getColumn('product_model').numFmt = '@';
    //     sheet.getColumn('product_type').numFmt = '@';
    //     sheet.getColumn('description').numFmt = '@';
    //     sheet.getColumn('period').numFmt = '@';
    //     sheet.getColumn('product_material').numFmt = '@';
    //     sheet.getColumn('product_color').numFmt = '@';

    //     sheet.getColumn('product_quantity').numFmt = '0';
    //     sheet.getColumn('product_unit').numFmt = '0';
    //     sheet.getColumn('price').numFmt = '0';
    //     sheet.getColumn('weight').numFmt = '0';



    //     function list_function(column_name, list_object, blank = true, show_error = false) {
    //         const list_string = `"${list_object.join(', ')}"`;
    //         const column_limit = `${column_name}2:${column_name}9999`;
    //         sheet.dataValidations.add(column_limit, {
    //             type: 'list',
    //             allowBlank: blank,
    //             showErrorMessage: show_error,
    //             formulae: [list_string],
    //         });

    //         console.log(list_string);
    //         console.log(show_error);
    //         console.log(blank);
    //     }



    //     const status_value_Obj = status.map(status => status.status_name);
    //     const category_Value_Obj = category.map(category => category.category_name);
    //     const sub_category_value_obj = subCategory.map(sub_category => sub_category.sub_category_name);
    //     const brand_value_Obj = brand.map(brand => brand.brand_name);
    //     const model_value_Obj = model.map(model => model.model_name);
    //     const color_value_Obj = color.map(color => color.color_name);
    //     const material_value_Obj = material.map(material => material.material_name);
    //     const period_value_Obj = period.map(period => period.period_name);
    //     const type_value_Obj = type.map(type => type.type_name);
    //     const unit_value_Obj = unit.map(unit => unit.unit_name);
    //     const warranty_value_Obj = warranty.map(warranty => warranty.warranty_name);


    //     list_function('C', unit_value_Obj);
    //     list_function('F', model_value_Obj);
    //     list_function('G', material_value_Obj);
    //     list_function('H', color_value_Obj);
    //     list_function('I', type_value_Obj);
    //     list_function('J', brand_value_Obj);

    //     list_function('K', category_Value_Obj);
    //     list_function('L', sub_category_value_obj);
    //     list_function('M', period_value_Obj);
    //     list_function('N', warranty_value_Obj);
    //     list_function('O', status_value_Obj, true, true);



    //     workbook.xlsx.writeBuffer().then(function (data) {
    //         const blob = new Blob([data], {
    //             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //         });
    //         const url = window.URL.createObjectURL(blob);
    //         const anchor = document.createElement("a");
    //         anchor.href = url;
    //         anchor.download = "Product Data Form.xlsx";
    //         anchor.click();
    //         window.URL.revokeObjectURL(url);
    //     });


    // };
    const exportExcelFile = () => {
        const escapeExcelFormula = (str) => {
            return str?.replace(/"/g, '""');
        };

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Excel Sheet 1");
        sheet.properties.defaultRowHeight = 15;
        sheet.properties.defaultColWidth = 15;
        sheet.pageSetup.horizontalCentered = true;
        sheet.pageSetup.verticalCentered = true;
        sheet.getRow(1).alignment = { horizontal: 'center' };

        for (let i = 0; i <= 14; i++) {
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

        // Column header
        let column_header = [
            { header: "Product Name", key: "product_name", width: 20 },
            { header: "Price", key: "price", width: 10 },
            { header: "Product Unit", key: "product_unit", width: 20 },
            { header: "Weight", key: "weight", width: 15 },
            { header: "Product Description", key: "description", width: 25 },
            { header: "Product Model", key: "product_model", width: 20 },
            { header: "Product Material", key: "product_material", width: 20 },
            { header: "Product Color", key: "product_color", width: 20 },
            { header: "Product Type", key: "product_type", width: 20 },
            { header: "Brand Name", key: "brand_name", width: 20 },
            { header: "Category", key: "category", width: 20 },
            { header: "Sub Category", key: "sub_category", width: 20 },
            { header: "Period", key: "period", width: 20 },
            { header: "Product Quantity", key: "product_quantity", width: 25 },
            { header: "Status", key: "status", width: 20 },
        ];

        sheet.columns = column_header;

        // Set the column format to text
        const textColumns = [
            'category', 'sub_category', 'brand_name', 'product_name', 'status',
            'product_model', 'product_type', 'description', 'period',
            'product_material', 'product_color'
        ];
        textColumns.forEach(col => {
            sheet.getColumn(col).numFmt = '@';
        });

        sheet.getColumn('product_quantity').numFmt = '0';
        sheet.getColumn('product_unit').numFmt = '0';
        sheet.getColumn('price').numFmt = '0';
        sheet.getColumn('weight').numFmt = '0';

        function list_function(column_name, list_object, blank = true, show_error = false) {
            const maxCharactersPerDropdown = Infinity; // Excel limit for dropdown characters
            const chunks = chunkArrayByLength(list_object, maxCharactersPerDropdown);

            chunks.forEach((chunk, index) => {
                const list_string = `"${chunk.join(', ')}"`;
                console.log(list_string)
                const column_limit = `${column_name}${2 + index * 1000}:${column_name}${2 + (index + 1) * 1000 - 1}`;
                sheet.dataValidations.add(column_limit, {
                    type: 'list',
                    allowBlank: blank,
                    showErrorMessage: show_error,
                    formulae: [list_string],
                });
            });
        }

        const status_value_Obj = status.map(status => escapeExcelFormula(status.status_name));
        const category_Value_Obj = category.map(category => escapeExcelFormula(category.category_name));
        const sub_category_value_obj = subCategory.map(sub_category => escapeExcelFormula(sub_category.sub_category_name));
        const brand_value_Obj = brand.map(brand => escapeExcelFormula(brand.brand_name));
        const model_value_Obj = model.map(model => escapeExcelFormula(model.model_name));
        const color_value_Obj = color.map(color => escapeExcelFormula(color.color_name));
        const material_value_Obj = material.map(material => escapeExcelFormula(material.material_name));
        const period_value_Obj = period.map(period => escapeExcelFormula(period.period_name));
        const type_value_Obj = type.map(type => escapeExcelFormula(type.type_name));
        const unit_value_Obj = unit.map(unit => escapeExcelFormula(unit.unit_name));
        const warranty_value_Obj = warranty.map(warranty => escapeExcelFormula(warranty.warranty_name));

        list_function('C', unit_value_Obj);
        list_function('F', model_value_Obj);
        list_function('G', material_value_Obj);
        list_function('H', color_value_Obj);
        list_function('I', type_value_Obj);
        list_function('J', brand_value_Obj);
        list_function('K', category_Value_Obj);
        list_function('L', sub_category_value_obj);
        list_function('M', period_value_Obj);
        list_function('N', warranty_value_Obj);
        list_function('O', status_value_Obj, true, true);

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

        // Function to chunk array into smaller arrays ensuring each chunk's string length does not exceed a limit
        function chunkArrayByLength(array, maxLength) {
            const result = [];
            let currentChunk = [];

            array.forEach(item => {
                const currentLength = currentChunk.join(', ').length;
                const itemLength = item?.length;

                if (currentLength + itemLength + 2 <= maxLength) { // +2 for ', '
                    currentChunk.push(item);
                } else {
                    result.push(currentChunk);
                    currentChunk = [item];
                }
            });

            if (currentChunk.length > 0) {
                result.push(currentChunk);
            }

            return result;
        }
    };


    //Excel data upload process
    const [data, setData] = useState([]);
    let [counter, setCounter] = useState(true);
    let excelData = [];

    // uploading multiple file
    const handleFileUpload = (e) => {
        e.preventDefault();
        const files = e.target.files;


        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (event) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                setCounter(true);
                setData((prevData) => [...prevData, sheet]);
            };
        });


    };


    // extracted value organization
    data.forEach((_data) => {
        const dataArray = [];
        const rows = {};

        const keys = Object.keys(_data).filter(key => !key.startsWith('!'));

        keys.forEach(key => {
            const col = key[0];
            const row = key.slice(1);
            const value = _data[key].v;

            if (!rows[row]) {
                rows[row] = {};
            } rows[row][col] = value;
        });

        Object.values(rows).forEach(rowObject => {
            dataArray.push(rowObject);
        });

        const userId = localStorage.getItem('userId');
        let _status_id = 0;

        for (let index = 1; index < dataArray.length; index++) {

            const element = dataArray[index];
            // element.O == 'Active' ? _status_id = 1 : element.O == 'Inactive' ? _status_id = 2 : _status_id = 3;
            const arrObj = {
                file_path: '',
                product_category: element.K || '',
                product_sub_category: element.L || '',
                product_brand: element.J || '',
                product_price: element.B || '',
                product_weight: element.D || '',
                product_status: element.O || '',
                product_period: element.M || '',
                product_description: element.E || '',
                product_name: element.A || '',
                product_model: element.F || '',
                product_color: element.H || '',
                product_quantity: element.N || '',
                product_unit: element.C || '',
                product_material: element.G || '',
                product_type: element.I || '',
                created_by: created

            }
            excelData.push(arrObj);
        }

    });


    if (excelData.length > 0 && counter == true) {

        // let array =fields.concat(excelData);

        setFields(excelData);
        setCounter(false);
    }

    const { data: supplierList = []
    } = useQuery({
        queryKey: ['supplierList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/supplier/supplier_list`)

            const data = await res.json()
            return data
        }
    })

    console.log(fields)
    // ===============================================================================================================

    return (
        <div class="container-fluid">
            <div class="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="card-default">
                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Create Product</h5>
                                <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
                                    <Link href={`/Admin/product/product_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to Product List</Link>
                                </div>
                            </div>


                            {/* Excel */}

                            <div class="form-group row ml-2">
                                <div class="col-md-6 ">
                                    <span className=" mb-2 mt-2">
                                        <label htmlFor={`fileInput`} className='mb-0 btn btn-sm btn-success '><FaUpload></FaUpload> Upload Excel File </label>
                                        <input className='mb-0' type="file" multiple accept=".xlsx, .xls" onChange={handleFileUpload} id={`fileInput`} style={{ display: "none" }} />
                                    </span>
                                    <span className=" mb-2 mt-2 ml-3">
                                        <label htmlFor={`fileInpu`} className='mb-0 btn btn-sm btn-secondary mb-2 mt-2'><FaDownload></FaDownload> Sample Excel File </label>
                                        <input onClick={exportExcelFile} type="button" name="search" class="btn btn-sm btn-secondary excel_btn ml-2" id={`fileInpu`} style={{ display: "none" }} />
                                    </span>
                                </div>
                            </div>
                            {/* Excel */}


                            <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>

                            <div className="card-body">
                                {/* card-body */}

                                {/* <div className='col-md-6'>

                                    <h5>Supplier,<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></h5>
                                    <div>
                                        <select onChange={(e) => setSupplier_id(e.target.value)} name="supplier_id" className="form-control form-control-sm mb-2" id="supplier_id">
                                            <option value=''>Select Supplier</option>
                                            {
                                                supplierList.map((supplier) => (
                                                    <>
                                                        <option value={supplier.id}>{supplier.name}</option>

                                                    </>

                                                ))
                                            }

                                        </select>
                                        {
                                            supplier && <p className='text-danger'>{supplier}</p>
                                        }
                                    </div>
                                </div> */}

                                {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

                                <form className="form-horizontal" method="post" autoComplete="off" onSubmit={quick_product_entry}>
                                    <div>
                                        {/* Add Multiple form ---------------------------------------------------- */}
                                        <div className="card-header custom-card-header py-1 clearfix  bg-gradient-primary text-white">
                                            <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
                                                <strong>Product</strong>
                                            </div>

                                            <div className="card-title card-header-color font-weight-bold mb-0 float-right">
                                                <div className="input-group">
                                                    <input
                                                        style={{ width: '80px', marginTop: '1px' }}
                                                        type="number"
                                                        min="1"
                                                        required
                                                        className="form-control-sm "
                                                        placeholder="Enter number of forms to add"
                                                        value={numToAdd}
                                                        onChange={(event) => setNumToAdd(event.target.value)}
                                                    />

                                                    <div className="input-group-append">
                                                        <button
                                                            type="button"
                                                            className="btn btn-info btn-sm py-1 add_more "
                                                            onClick={handleAddMore}
                                                        >
                                                            Add More
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>


                                        <div>
                                            <div className="form-group row">

                                                {fields.map((field, index) => (

                                                    <div key={index} className='col-lg-12  mt-2 ' >
                                                        <div className='d-lg-flex '>

                                                            <div className='col-lg-12 m-0 p-0'>
                                                                <button type="button" onClick={() => handleRemoveField(index)} className="btn btn-danger btn-sm float-lg-right float-md-right" ><FaTimes></FaTimes></button>

                                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>



                                                                    <div className='col-lg-3 border'>
                                                                        <label className='font-weight-bold'>Category Name:</label>
                                                                        <input
                                                                            type="text"

                                                                            name="product_category"
                                                                            className="form-control form-control-sm mb-2"
                                                                            placeholder="Enter Product Category"
                                                                            onChange={(e) => update_fields(index, e)}
                                                                            value={field.product_category}
                                                                        />
                                                                        {
                                                                            CategoryName[index] && <p className='text-danger'>{CategoryName}</p>
                                                                        }
                                                                    </div>


                                                                    <div className='col-lg-3 border'>
                                                                        <label className='font-weight-bold'>Sub Category Name:</label>
                                                                        <input
                                                                            type="text"

                                                                            name="product_sub_category"
                                                                            className="form-control form-control-sm mb-2"
                                                                            placeholder="Enter Product Sub-Category"
                                                                            onChange={(e) => update_fields(index, e)}
                                                                            value={field.product_sub_category}
                                                                        />
                                                                        {
                                                                            SubCategoryName[index] && <p className='text-danger'>{SubCategoryName}</p>
                                                                        }
                                                                    </div>
                                                                    <div className='col-lg-3 border'>
                                                                        <label className='font-weight-bold'>Brand Name:</label>
                                                                        <input
                                                                            type="text"

                                                                            name="product_brand"
                                                                            className="form-control form-control-sm mb-2"
                                                                            placeholder="Enter Product Brand"
                                                                            onChange={(e) => update_fields(index, e)}
                                                                            value={field.product_brand}
                                                                        />
                                                                        {
                                                                            brandName[index] && <p className='text-danger'>{brandName}</p>
                                                                        }
                                                                    </div>

                                                                    <div className='col-lg-3 border'>
                                                                        <label className='font-weight-bold'>Model Name:</label>
                                                                        <input
                                                                            type="text"

                                                                            name="product_model"
                                                                            className="form-control form-control-sm mb-2"
                                                                            placeholder="Enter Product Model"
                                                                            onChange={(e) => update_fields(index, e)}
                                                                            value={field.product_model}
                                                                        />
                                                                        {
                                                                            ModelName[index] && <p className='text-danger'>{ModelName}</p>
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>
                                                                    <div className='col-lg-3 border'>
                                                                        <label className='font-weight-bold'>Color Name:</label>
                                                                        <input
                                                                            type="text"

                                                                            name="product_color"
                                                                            className="form-control form-control-sm mb-2"
                                                                            placeholder="Enter Product Color"
                                                                            onChange={(e) => update_fields(index, e)}
                                                                            value={field.product_color}
                                                                        />
                                                                        {
                                                                            ColorName[index] && <p className='text-danger'>{ColorName}</p>
                                                                        }
                                                                    </div>

                                                                    <div className='col-lg-3 border'>
                                                                        <label className='font-weight-bold'>Material Name:</label>
                                                                        <input
                                                                            type="text"

                                                                            name="product_material"
                                                                            className="form-control form-control-sm mb-2"
                                                                            placeholder="Enter Product Material"
                                                                            onChange={(e) => update_fields(index, e)}
                                                                            value={field.product_material}
                                                                        />
                                                                        {
                                                                            MaterialName[index] && <p className='text-danger'>{MaterialName}</p>
                                                                        }
                                                                    </div>

                                                                    <div className='col-lg-3 border'>
                                                                        <label className='font-weight-bold'>Period Name:</label>

                                                                        <input
                                                                            type="text"

                                                                            name="product_period"
                                                                            className="form-control form-control-sm mb-2"
                                                                            placeholder="Enter Product Period"
                                                                            onChange={(e) => update_fields(index, e)}
                                                                            value={field.product_period}
                                                                        />
                                                                        {
                                                                            PeriodName[index] && <p className='text-danger'>{PeriodName}</p>
                                                                        }
                                                                    </div>

                                                                    <div className='col-lg-3 border'>
                                                                        <label className='font-weight-bold'>Type Name:</label>
                                                                        <input
                                                                            type="text"

                                                                            name="product_type"
                                                                            className="form-control form-control-sm mb-2"
                                                                            placeholder="Enter Product Unit"
                                                                            onChange={(e) => update_fields(index, e)}
                                                                            value={field.product_type}
                                                                        />
                                                                        {
                                                                            TypeName[index] && <p className='text-danger'>{TypeName}</p>
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>
                                                                    {/* 
                                                                    <div className='col-lg-3 border'>
                                                                        <label className='font-weight-bold'>Warranty Name:</label>
                                                                        <input
                                                                            type="text"
                                                                            
                                                                            name="product_quantity"
                                                                            className="form-control form-control-sm mb-2"
                                                                            placeholder="Enter Product Warranty"
                                                                            onChange={(e) => update_fields(index, e)}
                                                                            value={field.product_quantity}
                                                                        />
                                                                        {
                                                                            WarrantyName[index] && <p className='text-danger'>{WarrantyName}</p>
                                                                        }
                                                                    </div> */}

                                                                    {/* <div className='col-lg-3  border '>
                                                                        <label className='font-weight-bold'>weight:</label>
                                                                        <input
                                                                            type="text"
                                                                            
                                                                            name="product_weight"
                                                                            className="form-control form-control-sm mb-2"
                                                                            placeholder="Enter Unit Weight"
                                                                            value={field.product_weight}
                                                                            onChange={(e) => update_fields(index, e)}
                                                                        />
                                                                          {
                                                                           WeightName[index] && <p className='text-danger'>{WeightName}</p>
                                                                        }
                                                                    </div> */}
                                                                </div>

                                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>

                                                                </div>

                                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>

                                                                    <div className='col-lg-3  border '>
                                                                        <label className='font-weight-bold'>Product Name:</label>
                                                                        <input
                                                                            type="text"

                                                                            name="product_name"
                                                                            className="form-control form-control-sm mb-2"
                                                                            placeholder="Enter Product Name"
                                                                            onChange={(e) => update_fields(index, e)}
                                                                            value={field.product_name}
                                                                        />
                                                                        {
                                                                            ProductName[index] && <p className='text-danger'>{ProductName}</p>
                                                                        }
                                                                    </div>
                                                                    <div className='col-lg-3 border'>
                                                                        <label className='font-weight-bold'>Unit Name:</label>
                                                                        <input
                                                                            type="text"

                                                                            name="product_unit"
                                                                            className="form-control form-control-sm mb-2"
                                                                            placeholder="Enter Product Unit"
                                                                            onChange={(e) => update_fields(index, e)}
                                                                            value={field.product_unit}
                                                                        />
                                                                        {
                                                                            UnitName[index] && <p className='text-danger'>{UnitName}</p>
                                                                        }
                                                                    </div>
                                                                    <div className='col-lg-3 border'>
                                                                        <label className='font-weight-bold'>Product Quantity:</label>
                                                                        <input
                                                                            type="text"
                                                                            name="product_quantity"
                                                                            className="form-control form-control-sm mb-2"
                                                                            placeholder="Enter Product quantity"
                                                                            onChange={(e) => update_fields(index, e)}
                                                                            value={field.product_quantity}
                                                                        />
                                                                        {
                                                                            UnitName[index] && <p className='text-danger'>{UnitName}</p>
                                                                        }
                                                                    </div>
                                                                    <div className='col-lg-3  border'>
                                                                        <label className='font-weight-bold'>Price:</label>

                                                                        <input
                                                                            type="text"

                                                                            name="product_price"
                                                                            className="form-control form-control-sm mb-2"
                                                                            placeholder="Enter Unit Price"
                                                                            value={field.product_price}
                                                                            onChange={(e) => update_fields(index, e)}
                                                                        />
                                                                        {
                                                                            PriceName[index] && <p className='text-danger'>{PriceName}</p>
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>
                                                                    <div className='col-lg-12 border'>
                                                                        <label className='font-weight-bold'>Description:</label>
                                                                        <textarea
                                                                            rows={'5'}
                                                                            name="product_description"
                                                                            className="form-control form-control-sm mb-2"
                                                                            placeholder="Enter product description"
                                                                            value={field.product_description}
                                                                            onChange={(e) => update_fields(index, e)}
                                                                            maxLength={500}
                                                                        ></textarea>
                                                                        <small className="text-muted">{field.product_description.length} / 500</small>
                                                                    </div>
                                                                </div>

                                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>
                                                                    <div className='col-lg-12 border'>

                                                                        <label className='font-weight-bold'>Status:</label>

                                                                        <select

                                                                            name="product_status"
                                                                            className="form-control form-control-sm mb-2"
                                                                            value={field.product_status}
                                                                            onChange={(e) => update_fields(index, e)}
                                                                        >
                                                                            <option value={''} > Select Status</option>

                                                                            {status.map(sta =>
                                                                                <>
                                                                                    <option value={sta.status_name}>{sta.status_name}</option>
                                                                                </>
                                                                            )}

                                                                        </select>
                                                                        {
                                                                            Error[index] && <p className='text-danger'>{Error}</p>
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </div>



                                    <div className="form-group row">
                                        <div className="offset-md-3 col-sm-6">
                                            <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                        </div>
                                    </div>
                                </form>

                                {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}


                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ProductQuickEntry;