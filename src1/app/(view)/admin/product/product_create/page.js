'use client'
//ismile
import React, { useEffect, useState } from 'react';
import '../../../../(view)/admin_layout/modal/fa.css'
import Link from 'next/link';
import Swal from "sweetalert2";
import { FaTimes, FaUpload } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Nestable from 'react-nestable';



const CreateProduct = () => {
    const handleNestableChange = (newState) => {
        setFilePathArray(newState);
    };

    const [supplier, setSupplier] = useState('');
    const [supplier_id, setSupplier_id] = useState('');
  
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


    const { data: products = [], isLoading, refetch
    } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_list`)

            const data = await res.json()
            return data
        }
    })

    const { data: productsMaxBarCode = [],
    } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/max_barcode_product_list`)

            const data = await res.json()
            return data
        }
    })

    console.log(productsMaxBarCode[0]?.maxBarcode)


    const [numToAdd, setNumToAdd] = useState(1);

    // const [fields, setFields] = useState([{ product_name: '', status_id: '', file_path: '', product_description: '', brand_id: '', model_id: '', category_id: '', sub_category_id: '', period_id: '', unit_id: '', warranty_id: '', material_id: '', color_id: '', type_id: '', product_price: '', product_weight: '', product_quantity: '', barcode: '', created_by: created, supplier_id: supplier_id }]);



    // console.log(fields)


    // useEffect(() => {
    //     if (supplier_id) {
    //         setFields(prevFields => prevFields.map(field => ({ ...field, supplier_id: supplier_id })));
    //     }
    // }, [supplier_id]);

    // const [selectedFile, setSelectedFile] = useState(Array(fields.length).fill(null));

    // // const brand_file_change = (index, e) => {
    // //     let files = e.target.files[0];
    // //     const newSelectedFiles = [...selectedFile];
    // //     newSelectedFiles[index] = files;
    // //     setSelectedFile(newSelectedFiles);
    // //     upload(files, index);

    // // };

    const [fileNames, setFileNames] = useState([])
    const [error, setError] = useState([]);
    const [rowError, setRowErrors] = useState([]);
    const [sameProductName, setSameProductName] = useState([]);
    const [filePathError, setFilePathError] = useState([])


    // const brand_file_change = (index, e) => {

    //     e.preventDefault();
    //     let files = e.target.files[0];
    //     const now = new Date();
    //     const year = now.getFullYear();
    //     const month = String(now.getMonth() + 1).padStart(2, '0');
    //     const day = String(now.getDate()).padStart(2, '0');
    //     const hours = String(now.getHours()).padStart(2, '0');
    //     const minutes = String(now.getMinutes()).padStart(2, '0');

    //     const fileName = files.name.split('.')[0]
    //     const extension = files.name.split('.').pop();
    //     const newName = `${fileName}(${index}).${extension}`;
    //     const time = `${year}/${month}/${day}/${hours}/${minutes}`;
    //     // const _path = 'images/' + time + '/' + newName;
    //     const _path = time + '/' + newName;
    //     console.log(files.name.split('.')[0])
    //     const newSelectedFiles = [...selectedFile];
    //     newSelectedFiles[index] = files;
    //     newSelectedFiles[index].path = _path;
    //     setFileNames(newName)
    //     setSelectedFile(newSelectedFiles);
    //     upload(files, index);

    // };

    // console.log(fileNames)

    // const upload = (file, index) => {
    //     const formData = new FormData();
    //     // Create a new name for the file
    //     const extension = file.name.split('.').pop();
    //     console.log(file.name.split('.')[0])
    //     const fileName = file.name.split('.')[0]

    //     // Get file extension
    //     const newName = `${fileName}(${index}).${extension}`;
    //     // Append the file with the new name
    //     formData.append('files', file, newName);
    //     console.log(file);
    //     setFileNames(newName)

    //     axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/product_upload`, formData)
    //         .then(res => {
    //             console.log(res);
    //         })
    //         .catch(er => console.log(er));
    // };
    const [fields, setFields] = useState([
        {
            product_name: '',
            status_id: '',
            file_path: [],
            product_description: '',
            brand_id: '',
            model_id: '',
            category_id: '',
            sub_category_id: '',
            period_id: '',
            unit_id: '',
            warranty_id: '',
            material_id: '',
            color_id: '',
            type_id: '',
            product_price: '',
            product_weight: '',
            product_quantity: '',
            barcode: '',
            created_by: created,
            supplier_id: supplier_id,
        },
    ]);

    useEffect(() => {
        if (supplier_id) {
            setFields((prevFields) =>
                prevFields.map((field) => ({ ...field, supplier_id: supplier_id }))
            );
        }
    }, [supplier_id]);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filePathArray, setFilePathArray] = useState([]);

   


    const brand_file_change = (index, e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const extension = file.name.split('.').pop();
        const fileName = file.name.split('.')[0];
        const newName = `${fileName}(${index}).${extension}`;
        const time = `${year}/${month}/${day}/${hours}/${minutes}`;
        const _path = `${time}/${newName}`;

        const newFile = { file_path: `/images/products/original/${_path}`, file_s: `/images/products/small/${_path}`, file_m: `/images/products/medium/${_path}`, file_ms: `/images/products/medium_small/${_path}`, radio_value: 0 };
        setFilePathArray((prev) => [...prev, newFile]);

        const newSelectedFiles = [...selectedFiles, file];
        setSelectedFiles(newSelectedFiles);

        upload(file, index, newName);
    };

    const upload = (file, index, newName) => {
        const formData = new FormData();
        formData.append('files', file, newName);

        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}:5003/product_upload`, formData)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    };
    console.log(filePathArray)
    const handleRadioChange = (index) => {
        setFilePathArray((prev) =>
            prev.map((item, idx) => ({
                ...item,
                radio_value: idx === index ? 1 : 0,
            }))
        );
    };
    useEffect(() => {
        // Update the file_path field in the fields array based on filePathArray
        setFields(prevFields =>
            prevFields.map((field) => ({
                ...field,
                file_path: filePathArray || '', // Assign corresponding filePathArray value or an empty string
            }))
        );
    }, [filePathArray]);
    const brand_remove_image = (index) => {
        setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
        setFilePathArray((prev) => prev.filter((_, idx) => idx !== index));
    };


    const handleChange = (index, event) => {
        const newFields = [...fields];
        if (event.target.type === 'file') {
            newFields[index][event.target.name] = event.target.files[0];
        } else {
            newFields[index][event.target.name] = event.target.value;
        }

        const brandName = newFields[index]['product_name'];
        if (brandName) {
            setRowErrors(""); // Clear the error message

        }
        const product_price = newFields[index]['product_price'];
        if (product_price) {
            setPriceName(""); // Clear the error message

        }
        const brandNames = newFields[index]['brand_id'];
        if (brandNames) {
            setBrandName(""); // Clear the error message
        }
        const modelNames = newFields[index]['model_id'];
        if (modelNames) {
            setModelName(""); // Clear the error message
        }

        const categoryNames = newFields[index]['category_id'];
        if (categoryNames) {
            setCategoryName(""); // Clear the error message
        }

        const subCategoryNames = newFields[index]['sub_category_id'];
        if (subCategoryNames) {
            setSubCategoryName(""); // Clear the error message
        }

        const subQuantityNames = newFields[index]['product_quantity'];
        if (subQuantityNames) {
            setQuantity(""); // Clear the error message
        }

        const colorNames = newFields[index]['color_id'];
        if (colorNames) {
            setColorName(""); // Clear the error message
        }

        const materialNames = newFields[index]['material_id'];
        if (materialNames) {
            setMaterialName(""); // Clear the error message
        }

        const periodNames = newFields[index]['period_id'];
        if (periodNames) {
            setPeriodName(""); // Clear the error message
        }
        const typeNames = newFields[index]['type_id'];
        if (typeNames) {
            setTypeName(""); // Clear the error message
        }

        const unitNames = newFields[index]['unit_id'];
        if (unitNames) {
            setUnitName(""); // Clear the error message
        }

        const warrantyNames = newFields[index]['warranty_id'];
        if (warrantyNames) {
            setWarrantyName(""); // Clear the error message
        }
        // const WeightNames = newFields[index]['product_weight'];
        // if (WeightNames) {
        //     setWeightName(""); // Clear the error message
        // }

        const priceNames = newFields[index]['product_price'];
        if (priceNames) {
            setPriceName(""); // Clear the error message
        }

        const status = newFields[index]['status_id'];
        if (status) {
            setError(""); // Clear the error message
        }
        const matchingBrand = products.find(item => item.product_name?.toLowerCase() === brandName.toLowerCase());
        if (!matchingBrand) {
            setSameProductName('');
            // You can also set an error state to show the message in the UI instead of using alert
        }
        // else {
        //     setSameProductName("")
        // }
        // const hasEmptyFilePath = fields.some(field => !field.file_path.trim() || !field.file_s.trim() || !field.file_m.trim() || !field.file_ms.trim());
        // if (hasEmptyFilePath) {
        //     // Show error message
        //     setFilePathError("File Path are required fields. not");
        //     return; // Exit function without submitting the form
        // } else {
        //     setFilePathError('');
        // }

        setFields(newFields);
    };

    const handleAddMore = () => {
        const numToAddInt = parseInt(numToAdd);
        if (!isNaN(numToAddInt) && numToAddInt > 0) {
            const newInputValues = [...fields];
            for (let i = 0; i < numToAddInt; i++) {
                newInputValues.push({
                    product_name: '', status_id: '', file_path: '', product_description: '', brand_id: '', model_id: '', category_id: '', sub_category_id: '', period_id: '', unit_id: '', warranty_id: '', material_id: '', color_id: '', type_id: '', product_price: '', product_weight: '', product_quantity: '', created_by: created,
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
    const [Quantity, setQuantity] = useState([])

    const handleValidation = (field, errorMessage, setErrorState) => {
        const errors = new Array(fields.length).fill('');
        const isValid = fields.every((inputValue, index) => {
            if (!inputValue[field].trim()) {
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

    const handleSubmit = (event) => {
        event.preventDefault();

        // if (!handleValidation('brand_id', 'Please Select A Brand Name.', setBrandName)) return;
        // if (!handleValidation('model_id', 'Please Select A Model Name.', setModelName)) return;
        // if (!handleValidation('category_id', 'Please Select A Category Name.', setCategoryName)) return;
        // if (!handleValidation('sub_category_id', 'Please Select A Sub Category Name.', setSubCategoryName)) return;
        // // if (!handleValidation('color_id', 'Please Select A Color Name.', setColorName)) return;
        // // if (!handleValidation('material_id', 'Please Select A Material Name.', setMaterialName)) return;
        // // if (!handleValidation('period_id', 'Please Select a Period.', setPeriodName)) return;
        // // if (!handleValidation('type_id', 'Please Select a Type.', setTypeName)) return;
        // // if (!handleValidation('unit_id', 'Please Select a Unit.', setUnitName)) return;
        // // if (!handleValidation('warranty_id', 'Please Select a Warranty.', setWarrantyName)) return;
        // if (!handleValidation('status_id', 'This must be filled.', setError)) return;
        // if (!handleValidation('product_weight', 'Product Weight must be filled.', setWeightName)) return;
        // if (!handleValidation('product_name', 'Product Name must be filled.', setRowErrors)) return;
        // if (!handleValidation('product_price', 'Product Price must be filled.', setPriceName)) return;

        const brandErrors = new Array(fields.length).fill('');
        const isValidBrand = fields.every((inputValue, index) => {
            if (!inputValue.brand_id.trim()) {
                brandErrors[index] = 'Please Select A Brand Name.';
                return false;
            }
            return true;
        });

        if (!isValidBrand) {
            setBrandName(brandErrors);
            return;
        }
        setBrandName(new Array(fields.length).fill(''));

        const modelErrors = new Array(fields.length).fill('');
        const isValidModel = fields.every((inputValue, index) => {
            if (!inputValue.model_id.trim()) {
                modelErrors[index] = 'Please Select A Model Name.';
                return false;
            }
            return true;
        });

        if (!isValidModel) {
            setModelName(modelErrors);
            return;
        }
        setModelName(new Array(fields.length).fill(''));


        const categoryErrors = new Array(fields.length).fill('');
        const isValidCategory = fields.every((inputValue, index) => {
            if (!inputValue.category_id.trim()) {
                categoryErrors[index] = 'Please Select A Category Name.';
                return false;
            }
            return true;
        });

        if (!isValidCategory) {
            setCategoryName(categoryErrors);
            return;
        }
        setCategoryName(new Array(fields.length).fill(''));


        const subCategoryErrors = new Array(fields.length).fill('');
        const isValidSubCategory = fields.every((inputValue, index) => {
            if (!inputValue.sub_category_id.trim()) {
                subCategoryErrors[index] = 'Please Select A Sub Category Name.';
                return false;
            }
            return true;
        });

        if (!isValidSubCategory) {
            setSubCategoryName(subCategoryErrors);
            return;
        }
        setSubCategoryName(new Array(fields.length).fill(''));

        // const colorErrors = new Array(fields.length).fill('');
        // const isValidColor = fields.every((inputValue, index) => {
        //     if (!inputValue.color_id.trim()) {
        //         colorErrors[index] = 'Please Select A Color Name.';
        //         return false;
        //     }
        //     return true;
        // });

        // if (!isValidColor) {
        //     setColorName(colorErrors);
        //     return;
        // }
        // setColorName(new Array(fields.length).fill(''));


        // const materialErrors = new Array(fields.length).fill('');
        // const isValidMaterial = fields.every((inputValue, index) => {
        //     if (!inputValue.material_id.trim()) {
        //         materialErrors[index] = 'Please Select A Material Name.';
        //         return false;
        //     }
        //     return true;
        // });

        // if (!isValidMaterial) {
        //     setMaterialName(materialErrors);
        //     return;
        // }
        // setMaterialName(new Array(fields.length).fill(''));


        // const periodErrors = new Array(fields.length).fill('');
        // const isValidPeriod = fields.every((inputValue, index) => {
        //     if (!inputValue.period_id.trim()) {
        //         periodErrors[index] = 'Please Select a Period.';
        //         return false;
        //     }
        //     return true;
        // });

        // if (!isValidPeriod) {
        //     setPeriodName(periodErrors);
        //     return;
        // }
        // setPeriodName(new Array(fields.length).fill(''));

        // const typeErrors = new Array(fields.length).fill('');
        // const isValidType = fields.every((inputValue, index) => {
        //     if (!inputValue.type_id.trim()) {
        //         typeErrors[index] = 'Please Select a Type.';
        //         return false;
        //     }
        //     return true;
        // });

        // if (!isValidType) {
        //     setTypeName(typeErrors);
        //     return;
        // }
        // setTypeName(new Array(fields.length).fill(''));

        // const unitErrors = new Array(fields.length).fill('');
        // const isValidUnit = fields.every((inputValue, index) => {
        //     if (!inputValue.unit_id.trim()) {
        //         unitErrors[index] = 'Please Select a Unit.';
        //         return false;
        //     }
        //     return true;
        // });

        // if (!isValidUnit) {
        //     setUnitName(unitErrors);
        //     return;
        // }
        // setUnitName(new Array(fields.length).fill(''));

        // const warrantyErrors = new Array(fields.length).fill('');
        // const isValidWarranty = fields.every((inputValue, index) => {
        //     if (!inputValue.warranty_id.trim()) {
        //         warrantyErrors[index] = 'Please Select a Warranty.';
        //         return false;
        //     }
        //     return true;
        // });

        // if (!isValidWarranty) {
        //     setWarrantyName(warrantyErrors);
        //     return;
        // }
        // setWarrantyName(new Array(fields.length).fill(''));



        const newError = new Array(fields.length).fill('');
        const isValids = fields.every((inputValue, index) => {
            if (!inputValue.status_id.trim()) {
                newError[index] = 'This must be filled.';
                return false;
            }
            return true;
        });

        if (!isValids) {
            setError(newError);
            return;
        }
        setError(new Array(fields.length).fill(''));


        const newErrorQuantity = new Array(fields.length).fill('');
        const isValidsQuantity = fields.every((inputValue, index) => {
            if (!inputValue.product_quantity.trim()) {
                newErrorQuantity[index] = 'This must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidsQuantity) {
            setQuantity(newErrorQuantity);
            return;
        }
        setQuantity(new Array(fields.length).fill(''));

        const newErrorPrice = new Array(fields.length).fill('');
        const isValidsPrice = fields.every((inputValue, index) => {
            if (!inputValue.product_price.trim()) {
                newErrorPrice[index] = 'This must be filled.';
                return false;
            }
            return true;
        });

        if (!isValidsPrice) {
            setPriceName(newErrorPrice);
            return;
        }
        setPriceName(new Array(fields.length).fill(''));



        const newErrors = new Array(fields.length).fill('');
        const isValid = fields.every((inputValue, index) => {
            if (!inputValue.product_name.trim()) {
                newErrors[index] = 'Product Name must be filled.';
                return false;
            }
            return true;
        });

        if (!isValid) {
            setRowErrors(newErrors);
            return;
        }
        setRowErrors(new Array(fields.length).fill(''));







        // const newErrorFile = new Array(fields.length).fill('');
        // const isValidfile = fields.every((inputValue, index) => {
        //     if (!inputValue.file_path.trim() || !inputValue.file_s.trim() || !inputValue.file_m.trim() || !inputValue.file_ms.trim()) {
        //         newErrorFile[index] = 'This must be filled.';
        //         return false;
        //     }
        //     return true;
        // });

        // if (!isValidfile) {
        //     setFilePathError(newErrorFile);
        //     return;
        // }


        // setFilePathError(new Array(fields.length).fill(''));



        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_create`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(fields),
        })
            .then((Response) => {

                Response.json()
                if (Response.ok === true) {
                    sessionStorage.setItem("message", "Data saved successfully!");
                    router.push('/Admin/product/product_all')

                }
            })
            .then((data) => {
                console.log(data)

                // if (data.affectedRows > 0) {
                //     sessionStorage.setItem("message", "Data saved successfully!");
                //     router.push('/Admin/product/product_all')

                // }
            })
            .catch((error) => console.error(error));
        // }
    }



    const [brand, setBrand] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/brand/brand_all`)
            .then(res => res.json())
            .then(data => setBrand(data))
    }, [])

    console.log(brand)

    const [model, setModel] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/model/model_all`)
            .then(res => res.json())
            .then(data => setModel(data))
    }, [])

    console.log(model)

    const [category, setCategory] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_all`)
            .then(res => res.json())
            .then(data => setCategory(data))
    }, [])

    console.log(category)

    const [subCategory, setSubCategory] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sub_category/sub_category_all`)
            .then(res => res.json())
            .then(data => setSubCategory(data))
    }, [])

    console.log(subCategory)

    const [color, setColor] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/color/color_all`)
            .then(res => res.json())
            .then(data => setColor(data))
    }, [])

    console.log(color)

    const [material, setMaterial] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/material/material_all`)
            .then(res => res.json())
            .then(data => setMaterial(data))
    }, [])

    console.log(material)
    const [period, setPeriod] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/period/period_all`)
            .then(res => res.json())
            .then(data => setPeriod(data))
    }, [])

    console.log(period)

    const [type, setType] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/type/type_all`)
            .then(res => res.json())
            .then(data => setType(data))
    }, [])

    console.log(type)

    const [unit, setUnit] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/unit/unit_all`)
            .then(res => res.json())
            .then(data => setUnit(data))
    }, [])

    console.log(unit)

    const [warranty, setWarranty] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/warranty/warranty_all`)
            .then(res => res.json())
            .then(data => setWarranty(data))
    }, [])

    console.log(warranty)


    const [status, setStatus] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
            .then(res => res.json())
            .then(data => setStatus(data))
    }, [])

    console.log(status)


    const filteredModels = (brandId) => {
        console.log(typeof (brandId))
        console.log((brandId))
        console.log(model.filter(model => model.brand_id === Number(brandId)))
        return model.filter(model => model.brand_id === Number(brandId));
    };

    const SubCategory = (subCateId) => {
        console.log(typeof (subCateId))
        console.log((subCateId))
        console.log(subCategory.filter(subCate => subCate.brand_id === Number(subCateId)))
        return subCategory.filter(subCate => subCate.category_id === Number(subCateId))
    };
    const [selectedEntryType, setSelectedEntryType] = useState('1');

    const handleEntryTypeChange = (event) => {
        setSelectedEntryType(event.target.value);
    };

    // const brand_remove_image = (index) => {
    //     const confirmDelete = window.confirm('Are you sure you want to delete this?');
    //     if (confirmDelete) {
    //         const newSelectedFiles = [...selectedFile];
    //         newSelectedFiles[index] = null;
    //         setSelectedFile(newSelectedFiles);
    //         const filePathToDelete = fields.file_path;
    //         if (filePathToDelete) {
    //             axios.delete(`http://localhost:5003/${filePathToDelete}`)
    //                 .then(res => {
    //                     console.log(`File ${filePathToDelete} deleted successfully`);
    //                     setFields(prevData => ({
    //                         ...prevData,
    //                         file_path: '',
    //                     }));
    //                 })
    //                 .catch(err => {
    //                     console.error(`Error deleting file ${filePathToDelete}:`, err);
    //                 });
    //         }
    //     }
    // };
    console.log(supplier_id)
    console.log(fields)

    const { data: supplierList = []
    } = useQuery({
        queryKey: ['supplierList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/supplier/supplier_list`)

            const data = await res.json()
            return data
        }
    })


    console.log(filePathArray)
    console.log(fields)


    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("index", index);
    };

    const handleDrop = (e) => {
        const draggedIndex = e.dataTransfer.getData("index");
        const targetIndex = e.target.getAttribute("data-index");

        if (draggedIndex === targetIndex) return;

        const newFiles = [...selectedFiles];
        const draggedFile = newFiles[draggedIndex];
        newFiles.splice(draggedIndex, 1);
        newFiles.splice(targetIndex, 0, draggedFile);

        setSelectedFiles(newFiles);

        const newFilePaths = [...filePathArray];
        const draggedPath = newFilePaths[draggedIndex];
        newFilePaths.splice(draggedIndex, 1);
        newFilePaths.splice(targetIndex, 0, draggedPath);

        setFilePathArray(newFilePaths);
    };

    return (
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="body-content bg-light">
                            <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white shadow-sm">
                                <h5 className="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Create Product</h5>
                                <div className="card-title card-header-color font-weight-bold mb-0  float-right ">
                                    <Link href={`/Admin/product/product_all?page_group=${page_group}`} className="btn btn-sm btn-info">Back to Product List</Link>
                                </div>
                            </div>
                            {/* <div className="form-group row student mt-4 p-3">
                <label className="col-form-label col-md-2"><strong>Product Entry Type</strong></label>
                <div className="col-md-4">
                    <select
                        name="statusFilter"
                        className="form-control form-control-sm integer_no_zero lshift"
                        value={selectedEntryType}
                        onChange={handleEntryTypeChange}
                    >
                        <option value="">Select Product Entry Type</option>
                        <option value="1">Normal Product Entry</option>
                        <option value="2">Quick Product Entry</option>
                    </select>
                </div>
            </div> */}
                            <div className="mt-3">
                                {selectedEntryType === '1' &&

                                    <>
                                        <div class="form-group row px-3">
                                            {/* <div class="col-md-6 ">

                                <span className="btn btn-success btn-sm mb-2 mt-2 ">
                                    <label htmlFor={`fileInput`} className='mb-0'><FaUpload></FaUpload> Upload Excel File </label>
                                    <input className='mb-0' type="file" multiple accept=".xlsx, .xls" id={`fileInput`} style={{ display: "none" }} />
                                </span>


                                <input type="button" name="search" class="btn btn-sm btn-secondary excel_btn ml-2" value="Download Excel " />
                            </div> */}
                                        </div>

                                        {/* <div className='col-md-6'>

                                            <h5>Supplier,<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></h5>
                                            <div>
                                                <select  onChange={(e) => setSupplier_id(e.target.value)} name="supplier_id" className="form-control form-control-sm mb-2" id="supplier_id">
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

                                        <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                            (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                        </div>

                                        <div className=" card-body">
                                            {/* card-body */}
                                            {/* form ----------------------------------------------------------------------------------------------------------------*/}
                                            <form className="form-horizontal" method="post" autoComplete="off" onSubmit={handleSubmit}>
                                                <div>

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
                                                                        {/* style={{marginBottom:'-20px'}} */}
                                                                        <div className='col-lg-12 m-0 p-0'>
                                                                            <button type="button" onClick={() => handleRemoveField(index)} className="btn btn-danger btn-sm float-lg-right float-md-right" ><FaTimes></FaTimes></button>

                                                                            <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>


                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Category Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                                                    <select
                                                                                        required=""
                                                                                        name="category_id"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        value={field.category_id}
                                                                                        onChange={(e) => handleChange(index, e)}
                                                                                    >
                                                                                        <option value="">Select Category</option>
                                                                                        {category.map(categorys => (
                                                                                            <option key={categorys.id} value={categorys.id}>{categorys.category_name}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                    {
                                                                                        CategoryName[index] && <p className='text-danger'>{CategoryName}</p>
                                                                                    }
                                                                                </div>
                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Sub Category Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                                                    <select
                                                                                        required=""
                                                                                        name="sub_category_id"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        value={field.sub_category_id}
                                                                                        onChange={(e) => handleChange(index, e)}
                                                                                    >
                                                                                        <option value="">Select Sub Category</option>
                                                                                        {SubCategory(field.category_id).map(sub_category => (
                                                                                            <option key={sub_category.id} value={sub_category.id}>{sub_category.sub_category_name}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                    {
                                                                                        SubCategoryName[index] && <p className='text-danger'>{SubCategoryName}</p>
                                                                                    }
                                                                                </div>

                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Brand Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                                                    <select
                                                                                        required=""
                                                                                        name="brand_id"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        value={field.brand_id}
                                                                                        onChange={(e) => handleChange(index, e)}
                                                                                    >
                                                                                        <option value="">Select Brand</option>
                                                                                        {brand.map(brand => (
                                                                                            <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                    {
                                                                                        brandName[index] && <p className='text-danger'>{brandName}</p>
                                                                                    }
                                                                                </div>
                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Model Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                                                    <select
                                                                                        required=""
                                                                                        name="model_id"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        value={field.model_id}
                                                                                        onChange={(e) => handleChange(index, e)}
                                                                                    >
                                                                                        <option value="">Select Model</option>
                                                                                        {filteredModels(field.brand_id).map(model => (
                                                                                            <option key={model.id} value={model.id}>{model.model_name}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                    {
                                                                                        ModelName[index] && <p className='text-danger'>{ModelName}</p>
                                                                                    }
                                                                                </div>



                                                                            </div>

                                                                            <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>

                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Color Name</label>
                                                                                    <select
                                                                                        required=""
                                                                                        name="color_id"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        value={field.color_id}
                                                                                        onChange={(e) => handleChange(index, e)}
                                                                                    >
                                                                                        <option value="">Select Color</option>
                                                                                        {
                                                                                            color.map(colors =>
                                                                                                <>

                                                                                                    <option value={colors.id}>{colors.color_name}</option>
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                    </select>
                                                                                    {
                                                                                        ColorName[index] && <p className='text-danger'>{ColorName}</p>
                                                                                    }
                                                                                </div>
                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Material Name</label>
                                                                                    <select
                                                                                        required=""
                                                                                        name="material_id"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        value={field.material_id}
                                                                                        onChange={(e) => handleChange(index, e)}
                                                                                    >
                                                                                        <option value="">Select Material</option>
                                                                                        {
                                                                                            material.map(materials =>
                                                                                                <>

                                                                                                    <option value={materials.id}>{materials.material_name}</option>
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                    </select>
                                                                                    {
                                                                                        MaterialName[index] && <p className='text-danger'>{MaterialName}</p>
                                                                                    }
                                                                                </div>

                                                                                {/* <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Period Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                                                    <select
                                                                                        required=""
                                                                                        name="period_id"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        value={field.period_id}
                                                                                        onChange={(e) => handleChange(index, e)}
                                                                                    >
                                                                                        <option value="">Select Period</option>
                                                                                        {
                                                                                            period.map(periods =>
                                                                                                <>

                                                                                                    <option value={periods.id}>{periods.period_name}</option>
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                    </select>
                                                                                    {
                                                                                        PeriodName[index] && <p className='text-danger'>{PeriodName}</p>
                                                                                    }
                                                                                </div> */}

                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Type Name</label>
                                                                                    <select
                                                                                        required=""
                                                                                        name="type_id"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        value={field.type_id}
                                                                                        onChange={(e) => handleChange(index, e)}
                                                                                    >
                                                                                        <option value="">Select Type</option>
                                                                                        {
                                                                                            type.map(types =>
                                                                                                <>

                                                                                                    <option value={types.id}>{types.type_name}</option>
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                    </select>
                                                                                    {
                                                                                        TypeName[index] && <p className='text-danger'>{TypeName}</p>
                                                                                    }
                                                                                </div>
                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Unit Name</label>
                                                                                    <select
                                                                                        required=""
                                                                                        name="unit_id"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        value={field.unit_id}
                                                                                        onChange={(e) => handleChange(index, e)}
                                                                                    >
                                                                                        <option value="">Select Name</option>
                                                                                        {
                                                                                            unit.map(units =>
                                                                                                <>

                                                                                                    <option value={units.id}>{units.unit_name}</option>
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                    </select>
                                                                                    {
                                                                                        UnitName[index] && <p className='text-danger'>{UnitName}</p>
                                                                                    }
                                                                                </div>
                                                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>



                                                                                    {/* <div className='col-lg-3 border'>
    <label className='font-weight-bold'>Warranty Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
    <select
        required=""
        name="warranty_id"
        className="form-control form-control-sm mb-2"
        value={field.warranty_id}
        onChange={(e) => handleChange(index, e)}
    >
        <option value="">Select Warranty</option>
        {
            warranty.map(warrantys =>
                <>

                    <option value={warrantys.id}>{warrantys.warranty_name}</option>
                </>
            )
        }
    </select>
    {
        WarrantyName[index] && <p className='text-danger'>{WarrantyName}</p>
    }
</div> */}

                                                                                    {/* <div className='col-lg-3  border '>
                                                                                        <label className='font-weight-bold'>weight<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                                                        <input
                                                                                            type="text"
                                                                                            required=""
                                                                                            name="product_weight"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="Enter  Weight"
                                                                                            value={field.product_weight}
                                                                                            onChange={(e) => handleChange(index, e)}
                                                                                        />
                                                                                        {
                                                                                            WeightName[index] && <p className='text-danger'>{WeightName}</p>
                                                                                        }
                                                                                    </div> */}
                                                                                </div>
                                                                            </div>



                                                                            <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>


                                                                            </div>

                                                                            <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>

                                                                                <div className='col-lg-3  border '>
                                                                                    <label className='font-weight-bold'>Product Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                                                    <input
                                                                                        type="text"
                                                                                        name="product_name"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter Product Name"
                                                                                        value={field.product_name}
                                                                                        onChange={(e) => handleChange(index, e)}
                                                                                        maxLength={256}
                                                                                    />
                                                                                    {field.product_name.length > 255 && (
                                                                                        <p className='text-danger'>Category name cannot more than 255 characters.</p>
                                                                                    )}
                                                                                    {/* {
                                                                                        rowError[index] && <p className='text-danger'>{rowError[index]}</p>
                                                                                    } */}

                                                                                </div>


                                                                                <div className='col-lg-3  border'>
                                                                                    <label className='font-weight-bold'>Price<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                                                    <input
                                                                                        type="text"
                                                                                        required=""
                                                                                        name="product_price"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter  Price"
                                                                                        value={field.product_price}
                                                                                        onChange={(e) => handleChange(index, e)}
                                                                                    />
                                                                                    {
                                                                                        PriceName[index] && <p className='text-danger'>{PriceName}</p>
                                                                                    }
                                                                                </div>
                                                                                <div className='col-lg-3  border'>
                                                                                    <label className='font-weight-bold'>Quantity<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                                                    <input
                                                                                        type="text"
                                                                                        required=""
                                                                                        name="product_quantity"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter  Price"
                                                                                        value={field.product_quantity}
                                                                                        onChange={(e) => handleChange(index, e)}
                                                                                    />
                                                                                    {
                                                                                        Quantity[index] && <p className='text-danger'>{Quantity}</p>
                                                                                    }

                                                                                </div>
                                                                                {/* <div className="col-lg-3 border">
                                                                                    <label className="font-weight-bold">Product Image</label>
                                                                                    <div>
                                                                                        <span className="btn btn-success btn-sm mb-2">
                                                                                            <label htmlFor="fileInput" className="mb-0">
                                                                                                <FaUpload /> Select Image
                                                                                            </label>
                                                                                            <input
                                                                                                className="mb-0"
                                                                                                onChange={(e) => brand_file_change(selectedFiles.length, e)}
                                                                                                type="file"
                                                                                                id="fileInput"
                                                                                                style={{ display: 'none' }}
                                                                                            />
                                                                                        </span>
                                                                                    </div>

                                                                                  
                                                                                    <Nestable
                                                                                        items={filePathArray}
                                                                                        renderItem={(item, index) => {
                                                                                            console.log(item.item.file_path);  // Log the item to the console
                                                                                            console.log(selectedFiles[index]);  // Log the item to the console

                                                                                            return (
                                                                                                <div key={index} className="position-relative mb-2">
                                                                                                    <img
                                                                                                        className="w-100 img-thumbnail"
                                                                                                        src={`${process.env.NEXT_PUBLIC_API_URL}:5003${item.item.file_path}`}
                                                                                                        alt={`Uploaded File ${index + 1}`}
                                                                                                    />

                                                                                                    <input type="hidden" name="file_s" value={`${item.item.file_path}`} />
                                                                                                    <input type="hidden" name="file_m" value={`${item.item.file_m}`} />
                                                                                                    <input type="hidden" name="file_ms" value={`${item.item.file_ms}`} />
                                                                                                    <input type="hidden" name="file_path" value={`${item.item.file_path}`} />

                                                                                                    <button
                                                                                                        onClick={() => brand_remove_image(index)}
                                                                                                        type="button"
                                                                                                        className="btn btn-danger btn-sm position-absolute"
                                                                                                        style={{ top: '5px', right: '5px' }}
                                                                                                    >
                                                                                                        <FaTimes />
                                                                                                    </button>

                                                                                                    <div>
                                                                                                        <label>
                                                                                                            <input
                                                                                                                type="radio"
                                                                                                                name="selectedImage"
                                                                                                                checked={item.radio_value === 1}
                                                                                                                onChange={() => handleRadioChange(index)}
                                                                                                            />
                                                                                                            Select as Default
                                                                                                        </label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        }}
                                                                                        onChange={handleNestableChange}
                                                                                    />


                                                                                    {filePathArray.some((item) => item.radio_value === 0) && (
                                                                                        <p className="text-danger">Please select a default image.</p>
                                                                                    )}
                                                                                </div> */}
                                                                                {/* <div className="col-lg-3 border">
                                                                                    <label className="font-weight-bold">Product Image</label>
                                                                                    <div>
                                                                                        <span className="btn btn-success btn-sm mb-2">
                                                                                            <label htmlFor="fileInput" className="mb-0">
                                                                                                <FaUpload /> Select Image
                                                                                            </label>
                                                                                            <input
                                                                                                className="mb-0"
                                                                                                onChange={(e) => brand_file_change(selectedFiles.length, e)}
                                                                                                type="file"
                                                                                                id="fileInput"
                                                                                                style={{ display: 'none' }}
                                                                                            />
                                                                                        </span>
                                                                                    </div>

                                                                                    {selectedFiles.map((file, index) => (
                                                                                        <div key={index} className="position-relative mb-2">
                                                                                            <img
                                                                                                className="w-100 img-thumbnail"
                                                                                                src={URL.createObjectURL(file)}
                                                                                                alt={`Uploaded File ${index + 1}`}
                                                                                            />

                                                                                            <input type="hidden" name="file_s" value={`/images/products/small/${filePathArray[index]?.file_path}`} />

                                                                                            <input type="hidden" name="file_m" value={`/images/products/medium/${filePathArray[index]?.file_path}`} />

                                                                                            <input type="hidden" name="file_ms" value={`/images/products/medium_small/${filePathArray[index]?.file_path}`} />
                                                                                            <input type="hidden" name="file_path" value={`/images/products/original/${filePathArray[index]?.file_path}`} />
                                                                                            <button
                                                                                                onClick={() => brand_remove_image(index)}
                                                                                                type="button"
                                                                                                className="btn btn-danger btn-sm position-absolute"
                                                                                                style={{ top: '5px', right: '5px' }}
                                                                                            >
                                                                                                <FaTimes />
                                                                                            </button>
                                                                                            <div>
                                                                                                <label>
                                                                                                    <input
                                                                                                        type="radio"
                                                                                                        name="selectedImage"
                                                                                                        checked={filePathArray[index]?.radio_value === 1}
                                                                                                        onChange={() => handleRadioChange(index)}
                                                                                                    />
                                                                                                    Select as Default
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}

                                                                                    {filePathArray.some((item) => item.radio_value === 0) && (
                                                                                        <p className="text-danger">Please select a default image.</p>
                                                                                    )}
                                                                                </div> */}
                                                                                <div className="col-lg-3 border">
                                                                                    <label className="font-weight-bold">Product Image</label>
                                                                                    <div>
                                                                                        <span className="btn btn-success btn-sm mb-2">
                                                                                            <label htmlFor="fileInput" className="mb-0">
                                                                                                <FaUpload /> Select Image
                                                                                            </label>
                                                                                            <input
                                                                                                className="mb-0"
                                                                                                onChange={(e) => brand_file_change(selectedFiles.length, e)}
                                                                                                type="file"
                                                                                                id="fileInput"
                                                                                                style={{ display: 'none' }}
                                                                                            />
                                                                                        </span>
                                                                                    </div>

                                                                                    {selectedFiles.map((file, index) => (
                                                                                        <div
                                                                                            key={index}
                                                                                            className="position-relative mb-2"
                                                                                            draggable
                                                                                            onDragStart={(e) => handleDragStart(e, index)}
                                                                                            onDrop={(e) => handleDrop(e)}
                                                                                            onDragOver={(e) => e.preventDefault()}
                                                                                            data-index={index}
                                                                                        >
                                                                                            <img
                                                                                                className="w-100 img-thumbnail"
                                                                                                src={URL.createObjectURL(file)}
                                                                                                alt={`Uploaded File ${index + 1}`}
                                                                                            />

                                                                                            <input type="hidden" name="file_s" value={`/images/products/small/${filePathArray[index]?.file_path}`} />
                                                                                            <input type="hidden" name="file_m" value={`/images/products/medium/${filePathArray[index]?.file_path}`} />
                                                                                            <input type="hidden" name="file_ms" value={`/images/products/medium_small/${filePathArray[index]?.file_path}`} />
                                                                                            <input type="hidden" name="file_path" value={`/images/products/original/${filePathArray[index]?.file_path}`} />

                                                                                            <button
                                                                                                onClick={() => brand_remove_image(index)}
                                                                                                type="button"
                                                                                                className="btn btn-danger btn-sm position-absolute"
                                                                                                style={{ top: '5px', right: '5px' }}
                                                                                            >
                                                                                                <FaTimes />
                                                                                            </button>
                                                                                            <div>
                                                                                                <label>
                                                                                                    <input
                                                                                                        type="radio"
                                                                                                        name="selectedImage"
                                                                                                        checked={filePathArray[index]?.radio_value === 1}
                                                                                                        onChange={() => handleRadioChange(index)}
                                                                                                    />
                                                                                                    Select as Default
                                                                                                </label>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}

                                                                                    {filePathArray.some((item) => item.radio_value === 0) && (
                                                                                        <p className="text-danger">Please select a default image.</p>
                                                                                    )}
                                                                                </div>
                                                                                {/* <div className=' col-lg-3 border'>

                                                                                    <label className='font-weight-bold'>Product Image</label>
                                                                                    <div>
                                                                                        <span className="btn btn-success btn-sm mb-2">
                                                                                            <label htmlFor={`fileInput${index}`} className='mb-0'><FaUpload></FaUpload> Select Image </label>
                                                                                            <input className='mb-0' onChange={(e) => brand_file_change(index, e)} type="file" id={`fileInput${index}`} style={{ display: "none" }} />
                                                                                        </span>
                                                                                    </div>

                                                                                    {selectedFile[index] ?
                                                                                        <>
                                                                                            <img className="w-100 mb-2 img-thumbnail" onChange={(e) => brand_file_change(index, e)} src={URL.createObjectURL(selectedFile[index])} alt="Uploaded File" />

                                                                                            <input type="hidden" name="file_path" value={`/images/products/original/${selectedFile[index].path}`} />


                                                                                            <input type="hidden" name="file_s" value={`/images/products/small/${selectedFile[index].path}`} />

                                                                                            <input type="hidden" name="file_m" value={`/images/products/medium/${selectedFile[index].path}`} />

                                                                                            <input type="hidden" name="file_ms" value={`/images/products/medium_small/${selectedFile[index].path}`} />


                                                                                            <button onClick={() => brand_remove_image(index)} type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                                                                        </>
                                                                                        :
                                                                                        ''
                                                                                    }
                                                                                    {
                                                                                        filePathError[index] && (
                                                                                            <p className='text-danger'>{filePathError[index]}</p>
                                                                                        )
                                                                                    }
                                                                                </div> */}
                                                                            </div>

                                                                            <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>
                                                                                <div className='col-lg-12 border'>

                                                                                    <label className='font-weight-bold'>Description</label>
                                                                                    <div>
                                                                                        <textarea
                                                                                            rows={'5'}
                                                                                            name="product_description"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            placeholder="Enter product description"
                                                                                            value={field.product_description}
                                                                                            onChange={(e) => handleChange(index, e)}

                                                                                            // style={{ width: '550px', height: '100px' }}
                                                                                            maxLength={500}
                                                                                        ></textarea>
                                                                                        <small className="text-muted">{field.product_description.length} / 500</small>

                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                            <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>
                                                                                <div className='col-lg-12 border'>

                                                                                    <label className='font-weight-bold'>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                                                    <div>
                                                                                        <select
                                                                                            required=""
                                                                                            name="status_id"
                                                                                            className="form-control form-control-sm mb-2"
                                                                                            value={field.status_id}
                                                                                            onChange={(e) => handleChange(index, e)}
                                                                                        >
                                                                                            <option value="">Select Status</option>
                                                                                            {
                                                                                                status.map(sta =>
                                                                                                    <>

                                                                                                        <option value={sta.id}>{sta.status_name}</option>
                                                                                                    </>

                                                                                                )
                                                                                            }



                                                                                        </select>
                                                                                        {/* {
                                                                                            error[index] && <p className='text-danger'>{error[index]}</p>
                                                                                        } */}

                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                            {/* <div className='col-lg-3 border'>

                                                                                <label className='font-weight-bold'>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>

                                                                                <select
                                                                                    required=""
                                                                                    name="status_id"
                                                                                    className="form-control form-control-sm mb-2"
                                                                                    value={field.status_id}
                                                                                    onChange={(e) => handleChange(index, e)}
                                                                                >
                                                                                    <option value="">Select Status</option>
                                                                                    {
                                                                                        status.map(sta =>
                                                                                            <>

                                                                                                <option value={sta.id}>{sta.status_name}</option>
                                                                                            </>

                                                                                        )
                                                                                    }


                                                                                 
                                                                                </select>
                                                                                {
                                                                                    error[index] && <p className='text-danger'>{error[index]}</p>
                                                                                }
                                                                            </div> */}

                                                                            <div>
                                                                            </div>

                                                                        </div>
                                                                        {/* <div className='col-lg-2 '>
                                                        <label className='font-weight-bold'>Action</label>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm form-control form-control-sm mb-2"
                                                            onClick={() => handleRemoveField(index)}
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
        
                                                    </div> */}
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
                                        </div>

                                    </>

                                }


                                {/* Quick Product Entry */}


                                {selectedEntryType === '2' &&

                                    <>
                                        <div class="form-group row px-3">
                                            <div class="col-md-6 ">

                                                <span className="btn btn-success btn-sm mb-2 mt-2 ">
                                                    <label htmlFor={`fileInput`} className='mb-0'><FaUpload></FaUpload>Upload Excel File</label>
                                                    <input className='mb-0' type="file" multiple accept=".xlsx, .xls" id={`fileInput`} style={{ display: "none" }} />
                                                </span>


                                                <input type="button" name="search" class="btn btn-sm btn-secondary excel_btn ml-2" value="Download Excel " />
                                            </div>
                                        </div>
                                        <div className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold" role="alert">
                                            (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                                        </div>

                                        <div className="card-body">
                                            {/* form ----------------------------------------------------------------------------------------------------------------*/}
                                            <form className="form-horizontal" method="post" autoComplete="off" onSubmit={handleSubmit}>
                                                <div>

                                                    <div className="card-header custom-card-header py-1 clearfix bg-dark text-light">
                                                        <div className="card-title card-header-color font-weight-bold mb-0 float-left mt-1">
                                                            <strong>Product</strong>
                                                        </div>

                                                        <div className="card-title card-header-color font-weight-bold mb-0 float-right">
                                                            <div className="input-group">
                                                                <input
                                                                    style={{ width: '80px' }}
                                                                    type="number"
                                                                    min="1"
                                                                    className="form-control "
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
                                                                        {/* style={{marginBottom:'-20px'}} */}
                                                                        <div className='col-lg-12 m-0 p-0'>
                                                                            <button type="button" onClick={() => handleRemoveField(index)} className="btn btn-danger btn-sm float-lg-right float-md-right" ><FaTimes></FaTimes></button>

                                                                            <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>
                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Brand Name:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        required=""
                                                                                        name="brand_name"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter  Brand Name"
                                                                                    // value={field.brand_id}
                                                                                    // onChange={(e) => handleChange(index, e)}
                                                                                    />
                                                                                </div>
                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Model Name:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        required=""
                                                                                        name="model_name"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter  Model Name"
                                                                                    // value={field.brand_id}
                                                                                    // onChange={(e) => handleChange(index, e)}
                                                                                    />
                                                                                </div>


                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Category Name:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        required=""
                                                                                        name="category_name"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter  Category Name"
                                                                                    // value={field.brand_id}
                                                                                    // onChange={(e) => handleChange(index, e)}
                                                                                    />
                                                                                </div>
                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Sub Category Name:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        required=""
                                                                                        name="sub_category_name"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter  Sub Category Name"
                                                                                    // value={field.brand_id}
                                                                                    // onChange={(e) => handleChange(index, e)}
                                                                                    />
                                                                                </div>


                                                                            </div>

                                                                            <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>

                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Color Name:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        required=""
                                                                                        name="color_name"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter  Color Name"
                                                                                    // value={field.brand_id}
                                                                                    // onChange={(e) => handleChange(index, e)}
                                                                                    />
                                                                                </div>
                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Material Name:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        required=""
                                                                                        name="material_name"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter  Material Name"
                                                                                    // value={field.brand_id}
                                                                                    // onChange={(e) => handleChange(index, e)}
                                                                                    />
                                                                                </div>

                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Period Name:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        required=""
                                                                                        name="period_name"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter  Period Name"
                                                                                    // value={field.brand_id}
                                                                                    // onChange={(e) => handleChange(index, e)}
                                                                                    />
                                                                                </div>

                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Type Name:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        required=""
                                                                                        name="type_name"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter  Type Name"
                                                                                    // value={field.brand_id}
                                                                                    // onChange={(e) => handleChange(index, e)}
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>


                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Unit Name:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        required=""
                                                                                        name="unit_name"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter  Unit Name"
                                                                                    // value={field.brand_id}
                                                                                    // onChange={(e) => handleChange(index, e)}
                                                                                    />
                                                                                </div>
                                                                                <div className='col-lg-3 border'>
                                                                                    <label className='font-weight-bold'>Warranty Name:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        required=""
                                                                                        name="warranty_name"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter  Warranty Name"
                                                                                    // value={field.brand_id}
                                                                                    // onChange={(e) => handleChange(index, e)}
                                                                                    />
                                                                                </div>
                                                                                <div className='col-lg-3 border'>

                                                                                    <label className='font-weight-bold'>Status:</label>

                                                                                    <select
                                                                                        required=""
                                                                                        name="status_id"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        value={field.status_id}
                                                                                        onChange={(e) => handleChange(index, e)}
                                                                                    >
                                                                                        <option value="">Select Status</option>
                                                                                        {
                                                                                            status.map(sta =>
                                                                                                <>

                                                                                                    <option value={sta.id}>{sta.status_name}</option>
                                                                                                </>

                                                                                            )
                                                                                        }


                                                                                        {/* <option value="2">Inactive</option> */}
                                                                                    </select>
                                                                                </div>
                                                                                <div className='col-lg-3  border '>
                                                                                    <label className='font-weight-bold'>Weight:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        required=""
                                                                                        name="product_weight"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter  Weight"
                                                                                    // onChange={(e) => handleChange(index, e)}
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>


                                                                            </div>

                                                                            <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>

                                                                                <div className='col-lg-6  border '>
                                                                                    <label className='font-weight-bold'>Product Name:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        required=""
                                                                                        name="product_name"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter Product Name"
                                                                                    // onChange={(e) => handleChange(index, e)}
                                                                                    />
                                                                                </div>


                                                                                <div className='col-lg-6  border'>
                                                                                    <label className='font-weight-bold'>Price:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        required=""
                                                                                        name="product_price"
                                                                                        className="form-control form-control-sm mb-2"
                                                                                        placeholder="Enter product Price"

                                                                                    // onChange={(e) => handleChange(index, e)}
                                                                                    />
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
                                                                                    // onChange={(e) => handleChange(index, e)}
                                                                                    ></textarea>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                            </div>

                                                                        </div>
                                                                        {/* <div className='col-lg-2 '>
                                                <label className='font-weight-bold'>Action</label>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm form-control form-control-sm mb-2"
                                                    onClick={() => handleRemoveField(index)}
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>

                                            </div> */}
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
                                        </div>
                                    </>


                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CreateProduct;