
'use client'
//ismile
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';

const EditProduct = ({ id }) => {

    const [filePathArray, setFilePathArray] = useState([]);
    const [supplier, setSupplier] = useState('');
    const [supplier_id, setSupplier_id] = useState('');

    const [products, setproducts] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_list/${id}`)
            .then(Response => Response.json())
            .then(data => setproducts(data))
    }, [id])

    console.log(products)




     const [productData, setproductData] = useState({
        product_name: '',
        product_quantity: '',
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
        modified_by: '',
        supplier_id: ''
    });

    const [selectedFile, setSelectedFile] = useState(Array(productData.length).fill(null));



    const [fileNames, setFileNames] = useState([]);
    let [file_size_error, set_file_size_error] = useState(null);

    // const product_file_change = (e) => {
    //     // e?.preventDefault();
    //     let files = e.target.files[0];
    //     const now = new Date();
    //     const year = now.getFullYear();
    //     const month = String(now.getMonth() + 1).padStart(2, '0');
    //     const day = String(now.getDate()).padStart(2, '0');
    //     const hours = String(now.getHours()).padStart(2, '0');
    //     const minutes = String(now.getMinutes()).padStart(2, '0');

    //     const fileName = files.name.split('.')[0]
    //     const extension = files.name.split('.').pop();
    //     const newName = `${fileName}.${extension}`;
    //     const time = `${year}/${month}/${day}/${hours}/${minutes}`;
    //     const _path = time + '/' + newName;

    //     const newSelectedFiles = [...selectedFile];
    //     newSelectedFiles[0] = files; // Assuming you are updating the first element
    //     newSelectedFiles[0].path = _path;
    //     // setFileNames(newName);
    //     // setSelectedFile(newSelectedFiles);
    //     // upload(files);
    //     if (Number(files.size) <= 2097152) {
    //         console.log('checking the file size is okay');
    //         set_file_size_error("");
    //         setFileNames(newName);
    //         setSelectedFile(newSelectedFiles);
    //         upload(files);
    //     } else {
    //         console.log('checking the file size is High');
    //         set_file_size_error("Max file size 2 MB");
    //         // newSelectedFiles[index] = null;
    //         // setSelectedFile(newSelectedFiles);
    //         // setFileNames(null);
    //     }

    // };

    // console.log(fileNames);
    // console.log(selectedFile[0]);

    // const upload = (file) => {
    //     const formData = new FormData();
    //     const extension = file.name.split('.').pop();
    //     const fileName = file.name.split('.')[0];
    //     const newName = `${fileName}.${extension}`;
    //     formData.append('files', file, newName);
    //     console.log(file);
    //     setFileNames(newName);

    //     axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5003/product_upload`, formData)
    //         .then(res => {
    //             console.log(res);
    //         })
    //         .catch(er => console.log(er));
    // };
    // const product_file_change = (e) => {
    //     const files = Array.from(e.target.files);
    //     const now = new Date();
    //     const year = now.getFullYear();
    //     const month = String(now.getMonth() + 1).padStart(2, '0');
    //     const day = String(now.getDate()).padStart(2, '0');
    //     const hours = String(now.getHours()).padStart(2, '0');
    //     const minutes = String(now.getMinutes()).padStart(2, '0');

    //     const updatedFiles = files.map((file) => {
    //         const extension = file.name.split('.').pop();
    //         const fileName = file.name.split('.')[0];
    //         const newName = `${fileName}.${extension}`;
    //         const time = `${year}/${month}/${day}/${hours}/${minutes}`;
    //         const _path = `${time}/${newName}`;
    //         return { ...file, path: _path };
    //     });

    //     set_file_size_error(null); // Clear any existing errors
    //     setSelectedFile((prev) => [...prev, ...updatedFiles]);
    //     updatedFiles.forEach(upload); // Upload all selected files
    // };

    // const upload = (file) => {
    //     const formData = new FormData();
    //     const extension = file.name.split('.').pop();
    //     const fileName = file.name.split('.')[0];
    //     const newName = `${fileName}.${extension}`;
    //     formData.append("files", file, newName);

    //     axios
    //         .post(`${process.env.NEXT_PUBLIC_API_URL}:5003/product_upload`, formData)
    //         .then((res) => {
    //             console.log(res);
    //         })
    //         .catch((err) => console.error(err));
    // };

    // const removeFile = (index) => {
    //     setSelectedFile((prev) => prev.filter((_, i) => i !== index));
    // };

    // const [selectedFiles, setSelectedFiles] = useState([]);
    // const [filePathArray, setFilePathArray] = useState([]);

    // const brand_file_change = (e) => {
    //     e.preventDefault();
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     const now = new Date();
    //     const uniqueId = Date.now(); // Generate a unique identifier
    //     const year = now.getFullYear();
    //     const month = String(now.getMonth() + 1).padStart(2, '0');
    //     const day = String(now.getDate()).padStart(2, '0');
    //     const hours = String(now.getHours()).padStart(2, '0');
    //     const minutes = String(now.getMinutes()).padStart(2, '0');
    //     const extension = file.name.split('.').pop();
    //     const fileName = file.name.split('.')[0];
    //     const newName = `${fileName}(${uniqueId}).${extension}`;
    //     const time = `${year}/${month}/${day}/${hours}/${minutes}`;
    //     const _path = `${time}/${newName}`;

    //     const newFile = {
    //         file_path: `/images/products/original/${_path}`,
    //         file_s: `/images/products/small/${_path}`,
    //         file_m: `/images/products/medium/${_path}`,
    //         file_ms: `/images/products/medium_small/${_path}`,
    //         radio_value: 0,

    //     };
    //     setFilePathArray((prev) => [...prev, newFile]);

    //     const newSelectedFiles = [...selectedFiles, { file, id: uniqueId }];
    //     setSelectedFiles(newSelectedFiles);

    //     upload(file, newName);
    // };

    // const upload = (file, newName) => {
    //     const formData = new FormData();
    //     formData.append('files', file, newName);

    //     axios
    //         .post(`${process.env.NEXT_PUBLIC_API_URL}:5003/product_upload`, formData)
    //         .then((res) => console.log(res))
    //         .catch((err) => console.log(err));
    // };
    const [selectedFiles, setSelectedFiles] = useState([]);
    const brand_file_change = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;

        const now = new Date();
        const uniqueId = Date.now();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const extension = file.name.split('.').pop();
        const fileName = file.name.split('.')[0];
        const newName = `${fileName}(${uniqueId}).${extension}`;
        const time = `${year}/${month}/${day}/${hours}/${minutes}`;
        const _path = `${time}/${newName}`;

        const newFile = {
            file_path: `/images/products/original/${_path}`,
            file_s: `/images/products/small/${_path}`,
            file_m: `/images/products/medium/${_path}`,
            file_ms: `/images/products/medium_small/${_path}`,
            is_default: 0,
       
        };
        setproductData((prevData) => ({
            ...prevData,
            file_path: [...prevData.file_path, newFile], // Add the new file to the array
        }));
        setSelectedFiles((prev) => [...prev, { file, id: uniqueId }]);
        upload(file, newName);
    };

    const upload = (file, newName) => {
        const formData = new FormData();
        formData.append('files', file, newName);

        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}:5003/product_upload`, formData)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("draggedIndex", index);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        const draggedIndex = e.dataTransfer.getData("draggedIndex");
        const updatedFiles = [...productData.file_path];

        const draggedFile = updatedFiles.splice(draggedIndex, 1)[0];
        updatedFiles.splice(dropIndex, 0, draggedFile); // Insert at drop index

        setproductData((prevData) => ({
            ...prevData,
            file_path: updatedFiles
        }));
    };

    // const handleRadioChange = (id) => {
    //     setproductData((prevData) => {
    //         const updatedFilePath = prevData.file_path.map((file, index) => ({
    //             ...file,
    //             radio_value: file.id === id ? 1 : 0, // Update radio_value directly
    //         }));
    
    //         return {
    //             ...prevData,
    //             file_path: updatedFilePath,
    //         };
    //     });
    // };
    const handleRadioChange = (indexToUpdate) => {
        setproductData((prevData) => {
            const updatedFilePath = prevData.file_path.map((file, index) => ({
                ...file,
                is_default: index == indexToUpdate ? 1 : 0, // Update radio_value index-wise
            }));
    
            return {
                ...prevData,
                file_path: updatedFilePath,
            };
        });
    };
    

    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const brand_remove_image = (id) => {
        setSelectedFiles((prev) => prev.filter((file) => file.id !== id));
        setFilePathArray((prev) => prev.filter((file) => file.id !== id));
    };

    // const handleRadioChange = (id) => {
    //     setFilePathArray((prev) =>
    //         prev.map((file) =>
    //             file.id === id
    //                 ? { ...file, radio_value: 1 }
    //                 : { ...file, radio_value: 0 }
    //         )
    //     );
    // };
    // const modified_by = localStorage.getItem('userId')

    // const handleDragStart = (e, id) => {
    //     e.dataTransfer.setData("id", id);
    // };

    // const handleDrop = (e) => {
    //     e.preventDefault();
    //     const draggedId = parseInt(e.dataTransfer.getData("id"), 10);
    //     const targetId = parseInt(e.target.closest("[data-id]").getAttribute("data-id"), 10);

    //     if (draggedId === targetId) return;

    //     const draggedIndex = selectedFiles.findIndex((file) => file.id === draggedId);
    //     const targetIndex = selectedFiles.findIndex((file) => file.id === targetId);

    //     const newFiles = [...selectedFiles];
    //     const [draggedFile] = newFiles.splice(draggedIndex, 1);
    //     newFiles.splice(targetIndex, 0, draggedFile);

    //     setSelectedFiles(newFiles);

    //     const newFilePaths = [...filePathArray];
    //     const [draggedPath] = newFilePaths.splice(draggedIndex, 1);
    //     newFilePaths.splice(targetIndex, 0, draggedPath);

    //     setFilePathArray(newFilePaths);
    // };

    
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

    const [modified_by, setUserId] = useState(() => {
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


    // useEffect(() => {

    //     setproductData({
    //         product_name: products?.product_name || '',
    //         product_quantity: products?.product_quantity || '',
    //         supplier_id: products?.supplier_id || '',

    //         status_id: products?.status_id || '',
    //         product_description: products?.product_description || '',
    //         brand_id: products?.brand_id || '',
    //         model_id: products?.model_id || '',
    //         category_id: products?.category_id || '',
    //         sub_category_id: products?.sub_category_id || '',
    //         period_id: products?.period_id || '',
    //         unit_id: products?.unit_id || '',
    //         warranty_id: products?.warranty_id || '',
    //         material_id: products?.material_id || '',
    //         color_id: products?.color_id || '',
    //         type_id: products?.type_id || '',
    //         product_price: products?.product_price || '',
    //         product_weight: products?.product_weight || '',
    //         modified_by: modified_by,
    //         file_path: products?.file_path || '',
    //         // file_path: selectedFile[0]?.path ? `/images/products/original/${selectedFile[0]?.path}` : products?.file_path,
    //         // file_s: selectedFile[0]?.path ? `/images/products/small/${selectedFile[0]?.path}` : products?.file_s,
    //         // file_m: selectedFile[0]?.path ? `/images/products/medium/${selectedFile[0]?.path}` : products?.file_m,
    //         // file_ms: selectedFile[0]?.path ? `/images/products/medium_small/${selectedFile[0]?.path}` : products?.file_ms

    //     });
    // }, [products, modified_by, selectedFile]);

    useEffect(() => {
        setproductData((prevData) => ({
            ...prevData,
            product_name: products?.product_name || '',
            product_quantity: products?.product_quantity || '',
            status_id: products?.status_id || '',
            file_path: products?.file_path || [],
            product_description: products?.product_description || '',
            brand_id: products?.brand_id || '',
            model_id: products?.model_id || '',
            category_id: products?.category_id || '',
            sub_category_id: products?.sub_category_id || '',
            period_id: products?.period_id || '',
            unit_id: products?.unit_id || '',
            warranty_id: products?.warranty_id || '',
            material_id: products?.material_id || '',
            color_id: products?.color_id || '',
            type_id: products?.type_id || '',
            product_price: products?.product_price || '',
            product_weight: products?.product_weight || '',
            modified_by: modified_by,
        }));
    }, [products, modified_by]);
    console.log(products.file_path)

    console.log(productData)

    const product_input_change = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        const attribute = { ...productData };
        attribute[name] = value;

        const productName = attribute['product_name'];

        if (!productName) {
            setProductName('Please enter a Product name.');
        } else {
            setProductName('');
        }


        const brandName = attribute['brand_id'];

        if (!brandName) {
            setBrandName('Please enter a Brand name.');
        } else {
            setBrandName('');
        }


        const modelName = attribute['model_id'];

        if (!modelName) {
            setModelName('Please enter a Model name.');
        } else {
            setModelName('');
        }


        const categoryName = attribute['category_id'];

        if (!categoryName) {
            setCategoryName('Please enter a Category name.');
        } else {
            setCategoryName('');
        }


        const subCategoryName = attribute['sub_category_id'];

        if (!subCategoryName) {
            setSubCategoryName('Please enter a Sub Category name.');
        } else {
            setSubCategoryName('');
        }


        // const colorName = attribute['color_id'];

        // if (!colorName) {
        //     setColorName('Please enter a Color name.');
        // } else {
        //     setColorName('');
        // }


        // const materialName = attribute['material_id'];

        // if (!materialName) {
        //     setMaterialName('Please enter a Material name.');
        // } else {
        //     setMaterialName('');
        // }


        const periodName = attribute['period_id'];

        if (!periodName) {
            setPeriodName('Please enter a Period name.');
        } else {
            setPeriodName('');
        }


        // const typeName = attribute['type_id'];

        // if (!typeName) {
        //     setTypeName('Please enter a Type name.');
        // } else {
        //     setTypeName('');
        // }


        // const unitName = attribute['unit_id'];

        // if (!unitName) {
        //     setUnitName('Please enter a Unit name.');
        // } else {
        //     setUnitName('');
        // }


        const warrantyName = attribute['warranty_id'];

        if (!warrantyName) {
            setWarrantyName('Please enter a Warranty name.');
        } else {
            setWarrantyName('');
        }


        const statusName = attribute['status_id'];

        if (!statusName) {
            setStatusName('Please enter a Status name.');
        } else {
            setStatusName('');
        }


        const weightName = attribute['product_weight'];

        if (!weightName) {
            setWeightName('Please enter a Weight name.');
        } else {
            setWeightName('');
        }


        const priceName = attribute['product_price'];

        if (!priceName) {
            setPriceName('Please enter a Price .');
        } else {
            setPriceName('');
        }
        setproductData(attribute);


    };




    const router = useRouter()
    console.log(productData, 'productData')


    const [productName, setProductName] = useState([]);
    const [brandName, setBrandName] = useState([]);
    const [modelName, setModelName] = useState([]);
    const [categoryName, setCategoryName] = useState([]);
    const [subCategoryName, setSubCategoryName] = useState([]);
    const [colorName, setColorName] = useState([]);
    const [materialName, setMaterialName] = useState([]);
    const [periodName, setPeriodName] = useState([]);
    const [typeName, setTypeName] = useState([]);
    const [unitName, setUnitName] = useState([]);
    const [warrantyName, setWarrantyName] = useState([]);
    const [statusName, setStatusName] = useState([]);
    const [weightName, setWeightName] = useState([]);
    const [priceName, setPriceName] = useState([]);

    const product_update = (e) => {
        e.preventDefault()
        if (!productData.product_name) {
            setProductName('Please enter a Product name.');
            return; // Prevent further execution
        }
        if (!productData.brand_id) {
            setBrandName('Please enter a Brand name.');
            return;
        }

        if (!productData.model_id) {
            setModelName('Please enter a Model name.');
            return;
        }
        if (!productData.category_id) {
            setCategoryName('Please enter a Category name.');
            return;
        }
        if (!productData.sub_category_id) {
            setSubCategoryName('Please enter a Sub Category name.');
            return;
        }
        // if (!productData.color_id) {
        //     setColorName('Please enter a Color name.');
        //     return;
        // }
        // if (!productData.material_id) {
        //     setMaterialName('Please enter a Material name.');
        //     return;
        // }
        // if (!productData.period_id) {
        //     setPeriodName('Please enter a Period name.');
        //     return;
        // }
        // if (!productData.type_id) {
        //     setTypeName('Please enter a Type name.');
        //     return;
        // }
        // if (!productData.unit_id) {
        //     setUnitName('Please enter a Unit name.');
        //     return;
        // }
        // if (!productData.warranty_id) {
        //     setWarrantyName('Please enter a Warranty name.');
        //     return;
        // }
        if (!productData.status_id) {
            setStatusName('Please enter a Status name.');
            return;
        }
        // if (!productData.product_weight) {
        //     setWeightName('Please enter a Weight name.');
        //     return;
        // }
        if (!productData.product_name) {
            setProductName('Please enter a Product name.');
            return; // Prevent further execution
        }

        if (!productData.product_price) {
            setPriceName('Please enter a Price name.');
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_edit/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(productData)
        })
            .then((Response) => {

                Response.json()
                if (Response.ok === true) {
                    sessionStorage.setItem("message", "Data Update successfully!");
                    router.push('/Admin/product/product_all')

                }
            })
            .then(data => {
                console.log(data);
                console.log(productData)
                // Handle success or show a success message to the user
            })
            .catch(error => {
                console.error('Error updating brand:', error);
                // Handle error or show an error message to the user
            });
    };





    const handleRemoveImageFile = () => {
        const confirmRemove = window.confirm('Are you sure you want to remove the image?');
        if (confirmRemove) {
            if (selectedFile[0]) {
                console.log('object')
                // If there's a newly uploaded file, remove it
                setSelectedFile(null);
            } else if (productData.file_path) {
                // If the image is from the database, set the database value to an empty string
                setproductData(prevData => ({
                    ...prevData,
                    file_path: '',
                }));
            }
        }
    };

    console.log(productData.file_path)





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

 
    const { data: supplierList = []
    } = useQuery({
        queryKey: ['supplierList'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/supplier/supplier_list`)

            const data = await res.json()
            return data
        }
    })

    console.log(productData)

    // const [selectedFiles, setSelectedFiles] = useState([]);


    // useEffect(() => {
    //     // Update the file_path field in the productData object
    //     setproductData((prevData) => ({
    //         ...prevData,
    //         file_path: filePathArray || '', // Update the file_path field
    //     }));
    // }, [filePathArray]);



    console.log(filePathArray)

    return (
        <div class="container-fluid">
            <div class="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class="body-content bg-light">
                            <div className="alert alert-warning mb-0 mb-3 mt-4 text-danger font-weight-bold" role="alert">
                                (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
                            </div>
                            <div class=" border-primary shadow-sm border-0">
                                <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Update Product</h5>
                                    <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/product/product_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back Product List</Link></div>
                                </div>
                                <form action="" onSubmit={product_update}>

                                    <div className='col-lg-12  mt-2 ' >
                                        <div className='d-lg-flex '>
                                            {/* style={{marginBottom:'-20px'}} */}
                                            <div className='col-lg-12 m-0 p-0'>

                                                {/* <div className='col-md-12'>

                                                    <h5>Supplier,<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></h5>
                                                    <div>
                                                        <select value={productData.supplier_id}
                                                            onChange={product_input_change} name="supplier_id" className="form-control form-control-sm mb-2" id="supplier_id">
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

                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>



                                                    <div className='col-lg-3 border'>
                                                        <label className='font-weight-bold'>Category Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <select
                                                            required=""
                                                            name="category_id"
                                                            className="form-control form-control-sm mb-2"
                                                            value={productData.category_id}
                                                            onChange={product_input_change}

                                                        >
                                                            <option value="">Select Category</option>
                                                            {category.map(categorys => (
                                                                <option key={categorys.id} value={categorys.id}>{categorys.category_name}</option>
                                                            ))}
                                                        </select>
                                                        {
                                                            categoryName && <p className='text-danger'>{categoryName}</p>
                                                        }
                                                    </div>
                                                    <div className='col-lg-3 border'>
                                                        <label className='font-weight-bold'>Sub Category Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <select
                                                            required=""
                                                            name="sub_category_id"
                                                            className="form-control form-control-sm mb-2"
                                                            value={productData.sub_category_id}
                                                            onChange={product_input_change}

                                                        >
                                                            <option value="">Select Sub Category</option>
                                                            {SubCategory(productData.category_id).map(sub_category => (
                                                                <option key={sub_category.id} value={sub_category.id}>{sub_category.sub_category_name}</option>
                                                            ))}
                                                        </select>
                                                        {
                                                            subCategoryName && <p className='text-danger'>{subCategoryName}</p>
                                                        }
                                                    </div>
                                                    <div className='col-lg-3 border'>
                                                        <label className='font-weight-bold'>Brand Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <select
                                                            required=""
                                                            name="brand_id"
                                                            className="form-control form-control-sm mb-2"
                                                            value={productData.brand_id}
                                                            onChange={product_input_change}

                                                        >
                                                            <option value="">Select Brand</option>
                                                            {brand.map(brand => (
                                                                <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
                                                            ))}
                                                        </select>
                                                        {
                                                            brandName && <p className='text-danger'>{brandName}</p>
                                                        }
                                                    </div>
                                                    <div className='col-lg-3 border'>
                                                        <label className='font-weight-bold'>Model Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <select
                                                            required=""
                                                            name="model_id"
                                                            className="form-control form-control-sm mb-2"
                                                            value={productData.model_id}
                                                            onChange={product_input_change}

                                                        >
                                                            <option value="">Select Model</option>
                                                            {filteredModels(productData.brand_id).map(model => (
                                                                <option key={model.id} value={model.id}>{model.model_name}</option>
                                                            ))}
                                                        </select>
                                                        {
                                                            modelName && <p className='text-danger'>{modelName}</p>
                                                        }
                                                    </div>


                                                </div>

                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>

                                                    <div className='col-lg-3 border'>
                                                        <label className='font-weight-bold'>Color Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <select
                                                            required=""
                                                            name="color_id"
                                                            className="form-control form-control-sm mb-2"
                                                            value={productData.color_id}
                                                            onChange={product_input_change}

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
                                                            colorName && <p className='text-danger'>{colorName}</p>
                                                        }
                                                    </div>
                                                    <div className='col-lg-3 border'>
                                                        <label className='font-weight-bold'>Material Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <select
                                                            required=""
                                                            name="material_id"
                                                            className="form-control form-control-sm mb-2"
                                                            value={productData.material_id}
                                                            onChange={product_input_change}

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
                                                            materialName && <p className='text-danger'>{materialName}</p>
                                                        }
                                                    </div>

                                                    {/* <div className='col-lg-3 border'>
                                                        <label className='font-weight-bold'>Period Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <select
                                                            required=""
                                                            name="period_id"
                                                            className="form-control form-control-sm mb-2"
                                                            value={productData.period_id}
                                                            onChange={product_input_change}

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
                                                            periodName && <p className='text-danger'>{periodName}</p>
                                                        }
                                                    </div> */}

                                                    <div className='col-lg-3 border'>
                                                        <label className='font-weight-bold'>Type Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <select
                                                            required=""
                                                            name="type_id"
                                                            className="form-control form-control-sm mb-2"
                                                            value={productData.type_id}
                                                            onChange={product_input_change}

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
                                                            typeName && <p className='text-danger'>{typeName}</p>
                                                        }
                                                    </div>
                                                    <div className='col-lg-3 border'>
                                                        <label className='font-weight-bold'>Unit Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <select
                                                            required=""
                                                            name="unit_id"
                                                            className="form-control form-control-sm mb-2"
                                                            value={productData.unit_id}
                                                            onChange={product_input_change}

                                                        >
                                                            <option value="">Select Unit</option>
                                                            {
                                                                unit.map(units =>
                                                                    <>

                                                                        <option value={units.id}>{units.unit_name}</option>
                                                                    </>
                                                                )
                                                            }
                                                        </select>
                                                        {
                                                            unitName && <p className='text-danger'>{unitName}</p>
                                                        }
                                                    </div>
                                                </div>

                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12  justify-content-between`}>



                                                    {/* <div className='col-lg-3 border'>
                                                        <label className='font-weight-bold'>Warranty Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <select
                                                            required=""
                                                            name="warranty_id"
                                                            className="form-control form-control-sm mb-2"
                                                            value={productData.warranty_id}
                                                            onChange={product_input_change}

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
                                                            warrantyName && <p className='text-danger'>{warrantyName}</p>
                                                        }
                                                    </div> */}

                                                    {/* <div className='col-lg-3  border '>
                                                        <label className='font-weight-bold'>weight<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <input
                                                            onChange={product_input_change}
                                                            value={productData.product_weight}
                                                            type="text"
                                                            required=""
                                                            name="product_weight"
                                                            className="form-control form-control-sm mb-2"
                                                            placeholder="Enter Weight"

                                                        />
                                                        {
                                                            weightName && <p className='text-danger'>{weightName}</p>
                                                        }
                                                    </div> */}
                                                </div>

                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>


                                                </div>

                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>

                                                    <div className='col-lg-3  border '>
                                                        <label className='font-weight-bold'>Product Name<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <input
                                                            value={productData.product_name}
                                                            onChange={product_input_change}
                                                            type="text"
                                                            required=""
                                                            name="product_name"
                                                            className="form-control form-control-sm mb-2"
                                                            placeholder="Enter Product Name"

                                                        />
                                                        {
                                                            productName && <p className='text-red'>{productName}</p>
                                                        }
                                                    </div>
                                                    <div className='col-lg-3  border '>
                                                        <label className='font-weight-bold'>Product Quantity <small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <input
                                                            value={productData.product_quantity}
                                                            onChange={product_input_change}
                                                            type="number"
                                                            required=""
                                                            name="product_quantity"
                                                            className="form-control form-control-sm mb-2"
                                                            placeholder="Enter Product Name"

                                                        />

                                                    </div>


                                                    <div className='col-lg-3  border'>
                                                        <label className='font-weight-bold'>Price<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>
                                                        <input
                                                            value={productData.product_price}
                                                            onChange={product_input_change}
                                                            type="number"
                                                            required=""
                                                            name="product_price"
                                                            className="form-control form-control-sm mb-2"
                                                            placeholder="Enter  Price"

                                                        />
                                                        {
                                                            priceName && <p className='text-danger'>{priceName}</p>
                                                        }
                                                    </div>

                                                    <div className="col-lg-3 border">
                                    <label className="font-weight-bold">Product Image</label>
                                    <div>
                                        <span className="btn btn-success btn-sm mb-2">
                                            <label htmlFor="fileInput" className="mb-0">
                                                <FaUpload /> Select Image
                                            </label>
                                            <input
                                                className="mb-0"
                                                onChange={brand_file_change}
                                                type="file"
                                                id="fileInput"
                                                style={{ display: 'none' }}
                                            />
                                        </span>
                                    </div>
                                    {productData?.file_path?.map((path, index) => (
                                        <div
                                            key={path.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, index)}
                                            className="mb-2"
                                        >
                                            <img
                                                className="w-100 mb-2 img-thumbnail"
                                                src={`${process.env.NEXT_PUBLIC_API_URL}:5003${path.file_path}`}
                                                alt="Uploaded File"
                                            />
                                            <div>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="selectedImage"
                                                        checked={ path.is_default == 1}
                                                        onChange={() => handleRadioChange(index)}
                                                    />
                                                    Select as Default
                                                </label>
                                            </div>
                                        </div>
                                    ))}
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
                                                                    onChange={brand_file_change}
                                                                    type="file"
                                                                    id="fileInput"
                                                                    style={{ display: 'none' }}
                                                                />
                                                            </span>
                                                        </div>

                                                        {

                                                            selectedFiles.map(({ file, id }) => (
                                                                <div
                                                                    key={id}
                                                                    className="position-relative mb-2"
                                                                    draggable
                                                                    onDragStart={(e) => handleDragStart(e, id)}
                                                                    onDrop={(e) => handleDrop(e)}
                                                                    onDragOver={(e) => e.preventDefault()}
                                                                    data-id={id}
                                                                >
                                                                    <img
                                                                        className="w-100 img-thumbnail"
                                                                        src={URL.createObjectURL(file)}
                                                                        alt="Uploaded File"
                                                                    />

                                                                    <input type="hidden" name="file_s" value={`/images/products/small/${filePathArray.find(item => item.id === id)?.file_path}`} />
                                                                    <input type="hidden" name="file_m" value={`/images/products/medium/${filePathArray.find(item => item.id === id)?.file_path}`} />
                                                                    <input type="hidden" name="file_ms" value={`/images/products/medium_small/${filePathArray.find(item => item.id === id)?.file_path}`} />
                                                                    <input type="hidden" name="file_path" value={`/images/products/original/${filePathArray.find(item => item.id === id)?.file_path}`} />


                                                                    <div>
                                                                        <label>
                                                                            <input
                                                                                type="radio"
                                                                                name="selectedImage"
                                                                                checked={filePathArray.find(item => item.id === id)?.radio_value === 1}
                                                                                onChange={() => handleRadioChange(id)}
                                                                            />
                                                                            Select as Default
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        {
                                                            productData?.file_path ?
                                                                productData?.file_path?.map(path =>


                                                                    <>
                                                                        <input type="hidden" name="file_path" value={`/images/products/original/${path.file_path}`} />

                                                                        <input type="hidden" name="file_m" value={`/images/products/original/${path.file_m}`} />

                                                                        <input type="hidden" name="file_ms" value={`/images/products/original/${path.file_ms}`} />

                                                                        <input type="hidden" name="file_s" value={`/images/products/original/${path.file_s}`} />


                                                                        <img
                                                                            className="w-100 mb-2 img-thumbnail"
                                                                            src={`${process.env.NEXT_PUBLIC_API_URL}:5003${path.file_path}`}
                                                                            alt="Uploaded File"
                                                                        />
                                                                        <div>
                                                                            <label>
                                                                                <input
                                                                                    type="radio"
                                                                                    name="selectedImage"
                                                                                // checked={filePathArray.find(item => item.id === id)?.radio_value === 1}
                                                                                // onChange={() => handleRadioChange(id)}
                                                                                />
                                                                                Select as Default
                                                                            </label>
                                                                        </div>

                                                                    </>
                                                                )
                                                                :
                                                                ''
                                                        }


                                                        {filePathArray.some((item) => item.radio_value === 0) && (
                                                            <p className="text-danger">Please select a default image.</p>
                                                        )}
                                                    </div> */}



                                                    {/* <div class="col-md-3 border" >

                                                        <label className='font-weight-bold'>Product Image</label>
                                                        <div>
                                                            <span class="btn btn-success btn-sm " >
                                                                <label for="fileInput" className='mb-0' ><FaUpload></FaUpload> Select Image </label>
                                                                <input
                                                                    // multiple
                                                                    // name="file_path"
                                                                    onChange={product_combined_change}
                                                                    type="file" id="fileInput" style={{ display: "none" }} />
                                                            </span>
                                                        </div>

                                                        {selectedFile[0] ?
                                                            <>

                                                                <img className="w-100 mb-2 img-thumbnail" onChange={(e) => warranty_file_change(e)} src={URL.createObjectURL(selectedFile[0])} alt="Uploaded File" />

                                                                <input type="hidden" name="file_path" value={`/images/products/original/${selectedFile[0].path}`} />

                                                                <input type="hidden" name="file_m" value={`/images/products/medium/${selectedFile[0].path}`} />

                                                                <input type="hidden" name="file_ms" value={`/images/products/medium_small/${selectedFile[0].path}`} />

                                                                <input type="hidden" name="file_s" value={`/images/products/small/${selectedFile[0].path}`} />

                                                                <button
                                                                    // onClick={warranty_image_remove} 
                                                                    type="button" className="btn btn-danger btn-sm position-absolute float-right ml-n4" ><FaTimes></FaTimes></button>
                                                            </>
                                                            :

                                                            <>

                                                                {
                                                                    productData?.file_path ?
                                                                        productData?.file_path?.map(path =>


                                                                            <>
                                                                                <input type="hidden" name="file_path" value={`/images/products/original/${path.file_path}`} />

                                                                                <input type="hidden" name="file_m" value={`/images/products/original/${path.file_m}`} />

                                                                                <input type="hidden" name="file_ms" value={`/images/products/original/${path.file_ms}`} />

                                                                                <input type="hidden" name="file_s" value={`/images/products/original/${path.file_s}`} />


                                                                                <img
                                                                                    className="w-100 mb-2 img-thumbnail"
                                                                                    src={`${process.env.NEXT_PUBLIC_API_URL}:5003${path.file_path}`}
                                                                                    alt="Uploaded File"
                                                                                />

                                                                                <button

                                                                                    type="button"
                                                                                    className="btn btn-danger btn-sm position-absolute float-right ml-n4"
                                                                                >
                                                                                    <FaTimes />
                                                                                </button>
                                                                            </>
                                                                        )
                                                                        :
                                                                        ''
                                                                }
                                                            </>
                                                        }
                                                        {
                                                            file_size_error && (
                                                                <p className='text-danger'>{file_size_error}</p>
                                                            )
                                                        }



                                                    </div>  */}

                                                </div>
                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>
                                                    <div className='col-lg-12 border'>

                                                        <label className='font-weight-bold'>Description</label>
                                                        <textarea
                                                            value={productData.product_description}
                                                            onChange={product_input_change}
                                                            rows={'5'}
                                                            name="product_description"
                                                            className="form-control form-control-sm mb-2"
                                                            placeholder="Enter product description"

                                                            // style={{ width: '550px', height: '100px' }}
                                                            maxLength={500}
                                                        ></textarea>
                                                        <small className="text-muted">{productData.product_description.length} / 500</small>
                                                    </div>
                                                </div>
                                                <div className={`brand-item d-lg-flex d-md-flex col-lg-12 justify-content-between`}>
                                                    <div className='col-lg-12 border'>

                                                        <label className='font-weight-bold'>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small></label>

                                                        <select
                                                            required=""
                                                            name="status_id"
                                                            className="form-control form-control-sm mb-2"
                                                            value={productData.status_id}
                                                            onChange={product_input_change}

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
                                                        {
                                                            statusName && <p className='text-danger'>{statusName}</p>
                                                        }
                                                    </div>
                                                </div>
                                                <div>
                                                </div>

                                            </div>

                                        </div>

                                        <div className="form-group row mt-5">
                                            <div className="offset-md-3 col-sm-6">
                                                <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                            </div>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;




// 'use client'
// //ismile
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import { FaTimes, FaUpload } from 'react-icons/fa';

// const EditProduct = ({ id }) => {



//     const [products, setproducts] = useState([])
//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_list/${id}`)
//             .then(Response => Response.json())
//             .then(data => setproducts(data))
//     }, [id])

//     console.log(products)




//     const [productData, setproductData] = useState({

//         product_name: '', product_quantity: '', status_id: '', file_path: [], product_description: '', brand_id: '', model_id: '', category_id: '', sub_category_id: '', period_id: '', unit_id: '', warranty_id: '', material_id: '', color_id: '', type_id: '', product_price: '', product_weight: '', file_s: '', file_m: '', file_ms: '', modified_by: '', supplier_id: ''
//     });



//     const [selectedFile, setSelectedFile] = useState(Array(productData.length).fill(null));





//     const brand_file_change = (e) => {
//         e.preventDefault();
//         const file = e.target.files[0];
//         if (!file) return;

//         const now = new Date();
//         const uniqueId = Date.now(); // Generate a unique identifier
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const day = String(now.getDate()).padStart(2, '0');
//         const hours = String(now.getHours()).padStart(2, '0');
//         const minutes = String(now.getMinutes()).padStart(2, '0');
//         const extension = file.name.split('.').pop();
//         const fileName = file.name.split('.')[0];
//         const newName = `${fileName}(${uniqueId}).${extension}`;
//         const time = `${year}/${month}/${day}/${hours}/${minutes}`;
//         const _path = `${time}/${newName}`;

//         const newFile = {
//             file_path: `/images/products/original/${_path}`,
//             file_s: `/images/products/small/${_path}`,
//             file_m: `/images/products/medium/${_path}`,
//             file_ms: `/images/products/medium_small/${_path}`,
//             radio_value: 0,

//         };
//         setproductData((prevData) => ({
//             ...prevData,
//             file_path: [...prevData.file_path, newFile], // Add the new file to the array
//         }));
    
//         setFilePathArray((prev) => [...prev, newFile]);

//         const newSelectedFiles = [...selectedFiles, { file, id: uniqueId }];
//         setSelectedFiles(newSelectedFiles);

//         upload(file, newName);
//     };

//     const upload = (file, newName) => {
//         const formData = new FormData();
//         formData.append('files', file, newName);

//         axios
//             .post(`${process.env.NEXT_PUBLIC_API_URL}:5003/product_upload`, formData)
//             .then((res) => console.log(res))
//             .catch((err) => console.log(err));
//     };


//     const handleRadioChange = (id) => {
//         setFilePathArray((prev) =>
//             prev.map((file) =>
//                 file.id === id
//                     ? { ...file, radio_value: 1 }
//                     : { ...file, radio_value: 0 }
//             )
//         );
//     };
//     const modified_by = localStorage.getItem('userId')

//     const handleDragStart = (e, id) => {
//         e.dataTransfer.setData("id", id);
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         const draggedId = parseInt(e.dataTransfer.getData("id"), 10);
//         const targetId = parseInt(e.target.closest("[data-id]").getAttribute("data-id"), 10);

//         if (draggedId === targetId) return;

//         const draggedIndex = selectedFiles.findIndex((file) => file.id === draggedId);
//         const targetIndex = selectedFiles.findIndex((file) => file.id === targetId);

//         const newFiles = [...selectedFiles];
//         const [draggedFile] = newFiles.splice(draggedIndex, 1);
//         newFiles.splice(targetIndex, 0, draggedFile);

//         setSelectedFiles(newFiles);

//         const newFilePaths = [...filePathArray];
//         const [draggedPath] = newFilePaths.splice(draggedIndex, 1);
//         newFilePaths.splice(targetIndex, 0, draggedPath);

//         setFilePathArray(newFilePaths);
//     };


//     useEffect(() => {

//         setproductData({
//             product_name: products?.product_name || '',
//             product_quantity: products?.product_quantity || '',
//             supplier_id: products?.supplier_id || '',

//             status_id: products?.status_id || '',
//             product_description: products?.product_description || '',
//             brand_id: products?.brand_id || '',
//             model_id: products?.model_id || '',
//             category_id: products?.category_id || '',
//             sub_category_id: products?.sub_category_id || '',
//             period_id: products?.period_id || '',
//             unit_id: products?.unit_id || '',
//             warranty_id: products?.warranty_id || '',
//             material_id: products?.material_id || '',
//             color_id: products?.color_id || '',
//             type_id: products?.type_id || '',
//             product_price: products?.product_price || '',
//             product_weight: products?.product_weight || '',
//             modified_by: modified_by,
//             file_path: products?.file_path || '',
//             // file_path: selectedFile[0]?.path ? `/images/products/original/${selectedFile[0]?.path}` : products?.file_path,
//             // file_s: selectedFile[0]?.path ? `/images/products/small/${selectedFile[0]?.path}` : products?.file_s,
//             // file_m: selectedFile[0]?.path ? `/images/products/medium/${selectedFile[0]?.path}` : products?.file_m,
//             // file_ms: selectedFile[0]?.path ? `/images/products/medium_small/${selectedFile[0]?.path}` : products?.file_ms

//         });
//     }, [products, modified_by, selectedFile]);

//     console.log(products.file_path)

//     console.log(productData, selectedFile?.name)






    
//     const page_group = localStorage.getItem('pageGroup')

 



//     const [selectedFiles, setSelectedFiles] = useState([]);
//     const [filePathArray, setFilePathArray] = useState([]);

//     // useEffect(() => {
//     //     // Update the file_path field in the productData object
//     //     setproductData((prevData) => ({
//     //         ...prevData,
//     //         file_path: filePathArray || '', // Update the file_path field
//     //     }));
//     // }, [filePathArray]);



//     console.log(filePathArray)

//     return (
//         <div class="container-fluid">
//             <div class="row">
//                 <div className='col-12 p-4'>
//                     <div className='card'>
//                         <div class="body-content bg-light">
//                             <div className="alert alert-warning mb-0 mb-3 mt-4 text-danger font-weight-bold" role="alert">
//                                 (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                             </div>
//                             <div class=" border-primary shadow-sm border-0">
//                                 <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Update Product</h5>
//                                     <div class="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/product/product_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back Product List</Link></div>
//                                 </div>
//                                 <div className="col-lg-3 border">
//                                     <label className="font-weight-bold">Product Image</label>
//                                     <div>
//                                         <span className="btn btn-success btn-sm mb-2">
//                                             <label htmlFor="fileInput" className="mb-0">
//                                                 <FaUpload /> Select Image
//                                             </label>
//                                             <input
//                                                 className="mb-0"
//                                                 onChange={brand_file_change}
//                                                 type="file"
//                                                 id="fileInput"
//                                                 style={{ display: 'none' }}
//                                             />
//                                         </span>
//                                     </div>

//                                     {

//                                         selectedFiles.map(({ file, id }) => (
//                                             <div
//                                                 key={id}
//                                                 className="position-relative mb-2"
//                                                 draggable
//                                                 onDragStart={(e) => handleDragStart(e, id)}
//                                                 onDrop={(e) => handleDrop(e)}
//                                                 onDragOver={(e) => e.preventDefault()}
//                                                 data-id={id}
//                                             >
//                                                 <img
//                                                     className="w-100 img-thumbnail"
//                                                     src={URL.createObjectURL(file)}
//                                                     alt="Uploaded File"
//                                                 />

//                                                 <input type="hidden" name="file_s" value={`/images/products/small/${filePathArray.find(item => item.id === id)?.file_path}`} />
//                                                 <input type="hidden" name="file_m" value={`/images/products/medium/${filePathArray.find(item => item.id === id)?.file_path}`} />
//                                                 <input type="hidden" name="file_ms" value={`/images/products/medium_small/${filePathArray.find(item => item.id === id)?.file_path}`} />
//                                                 <input type="hidden" name="file_path" value={`/images/products/original/${filePathArray.find(item => item.id === id)?.file_path}`} />


//                                                 <div>
//                                                     <label>
//                                                         <input
//                                                             type="radio"
//                                                             name="selectedImage"
//                                                             checked={filePathArray.find(item => item.id === id)?.radio_value === 1}
//                                                             onChange={() => handleRadioChange(id)}
//                                                         />
//                                                         Select as Default
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     {
//                                         productData?.file_path ?
//                                             productData?.file_path?.map(path =>


//                                                 <>
//                                                     <input type="hidden" name="file_path" value={`/images/products/original/${path.file_path}`} />

//                                                     <input type="hidden" name="file_m" value={`/images/products/original/${path.file_m}`} />

//                                                     <input type="hidden" name="file_ms" value={`/images/products/original/${path.file_ms}`} />

//                                                     <input type="hidden" name="file_s" value={`/images/products/original/${path.file_s}`} />


//                                                     <img
//                                                         className="w-100 mb-2 img-thumbnail"
//                                                         src={`${process.env.NEXT_PUBLIC_API_URL}:5003${path.file_path}`}
//                                                         alt="Uploaded File"
//                                                     />
//                                                     <div>
//                                                         <label>
//                                                             <input
//                                                                 type="radio"
//                                                                 name="selectedImage"
//                                                             // checked={filePathArray.find(item => item.id === id)?.radio_value === 1}
//                                                             // onChange={() => handleRadioChange(id)}
//                                                             />
//                                                             Select as Default
//                                                         </label>
//                                                     </div>

//                                                 </>
//                                             )
//                                             :
//                                             ''
//                                     }


//                                     {filePathArray.some((item) => item.radio_value === 0) && (
//                                         <p className="text-danger">Please select a default image.</p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditProduct;
// 'use client'
// import React, { useEffect, useState } from 'react';
// import { FaUpload } from 'react-icons/fa';
// import axios from 'axios';
// import Link from 'next/link';

// const EditProduct = ({ id }) => {
//     const [products, setproducts] = useState([]);
//     const [productData, setproductData] = useState({
//         product_name: '',
//         product_quantity: '',
//         status_id: '',
//         file_path: [],
//         product_description: '',
//         brand_id: '',
//         model_id: '',
//         category_id: '',
//         sub_category_id: '',
//         period_id: '',
//         unit_id: '',
//         warranty_id: '',
//         material_id: '',
//         color_id: '',
//         type_id: '',
//         product_price: '',
//         product_weight: '',
//         modified_by: '',
//         supplier_id: ''
//     });

//     const [selectedFiles, setSelectedFiles] = useState([]);
//     const [filePathArray, setFilePathArray] = useState([]);

//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_list/${id}`)
//             .then(Response => Response.json())
//             .then(data => setproducts(data));
//     }, [id]);

//     const brand_file_change = (e) => {
//         e.preventDefault();
//         const file = e.target.files[0];
//         if (!file) return;

//         const now = new Date();
//         const uniqueId = Date.now();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const day = String(now.getDate()).padStart(2, '0');
//         const hours = String(now.getHours()).padStart(2, '0');
//         const minutes = String(now.getMinutes()).padStart(2, '0');
//         const extension = file.name.split('.').pop();
//         const fileName = file.name.split('.')[0];
//         const newName = `${fileName}(${uniqueId}).${extension}`;
//         const time = `${year}/${month}/${day}/${hours}/${minutes}`;
//         const _path = `${time}/${newName}`;

//         const newFile = {
//             file_path: `/images/products/original/${_path}`,
//             file_s: `/images/products/small/${_path}`,
//             file_m: `/images/products/medium/${_path}`,
//             file_ms: `/images/products/medium_small/${_path}`,
//             radio_value: 0,
//             id: uniqueId
//         };
//         setproductData((prevData) => ({
//             ...prevData,
//             file_path: [...prevData.file_path, newFile], // Add the new file to the array
//         }));
//         setFilePathArray((prev) => [...prev, newFile]);
//         setSelectedFiles((prev) => [...prev, { file, id: uniqueId }]);
//         upload(file, newName);
//     };

//     const upload = (file, newName) => {
//         const formData = new FormData();
//         formData.append('files', file, newName);

//         axios
//             .post(`${process.env.NEXT_PUBLIC_API_URL}:5003/product_upload`, formData)
//             .then((res) => console.log(res))
//             .catch((err) => console.log(err));
//     };

//     const handleRadioChange = (id) => {
//         setFilePathArray((prev) =>
//             prev.map((file) =>
//                 file.id === id
//                     ? { ...file, radio_value: 1 }
//                     : { ...file, radio_value: 0 }
//             )
//         );
//     };

//     const handleDragStart = (e, id) => {
//         e.dataTransfer.setData("id", id);
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         const draggedId = parseInt(e.dataTransfer.getData("id"), 10);
//         const targetId = parseInt(e.target.closest("[data-id]").getAttribute("data-id"), 10);

//         if (draggedId === targetId) return;

//         const draggedIndex = filePathArray.findIndex((file) => file.id === draggedId);
//         const targetIndex = filePathArray.findIndex((file) => file.id === targetId);

//         const newFiles = [...filePathArray];
//         const [draggedFile] = newFiles.splice(draggedIndex, 1);
//         newFiles.splice(targetIndex, 0, draggedFile);

//         setFilePathArray(newFiles);
//     };

//     useEffect(() => {
//         setproductData((prevData) => ({
//             ...prevData,
//             product_name: products?.product_name || '',
//             product_quantity: products?.product_quantity || '',
//             status_id: products?.status_id || '',
//             file_path: products?.file_path || [],
//             product_description: products?.product_description || '',
//             brand_id: products?.brand_id || '',
//             model_id: products?.model_id || '',
//             category_id: products?.category_id || '',
//             sub_category_id: products?.sub_category_id || '',
//             period_id: products?.period_id || '',
//             unit_id: products?.unit_id || '',
//             warranty_id: products?.warranty_id || '',
//             material_id: products?.material_id || '',
//             color_id: products?.color_id || '',
//             type_id: products?.type_id || '',
//             product_price: products?.product_price || '',
//             product_weight: products?.product_weight || '',
//             modified_by: localStorage.getItem('userId'),
//         }));
//     }, [products]);

//     console.log(filePathArray)
//     console.log(productData)

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className="col-12 p-4">
//                     <div className="card">
//                         <div className="body-content bg-light">
//                             <div className="alert alert-warning mb-0 mb-3 mt-4 text-danger font-weight-bold" role="alert">
//                                 (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                             </div>
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Update Product</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/product/product_all?page_group=somegroup`} className="btn btn-sm btn-info">Back Product List</Link>
//                                     </div>
//                                 </div>
//                                 <div className="col-lg-3 border">
//                                     <label className="font-weight-bold">Product Image</label>
//                                     <div>
//                                         <span className="btn btn-success btn-sm mb-2">
//                                             <label htmlFor="fileInput" className="mb-0">
//                                                 <FaUpload /> Select Image
//                                             </label>
//                                             <input
//                                                 className="mb-0"
//                                                 onChange={brand_file_change}
//                                                 type="file"
//                                                 id="fileInput"
//                                                 style={{ display: 'none' }}
//                                             />
//                                         </span>
//                                     </div>
//                                     {
//                                         productData?.file_path ?
//                                             productData?.file_path?.map(path =>


//                                                 <>
//                                                     <input type="hidden" name="file_path" value={`/images/products/original/${path.file_path}`} />

//                                                     <input type="hidden" name="file_m" value={`/images/products/original/${path.file_m}`} />

//                                                     <input type="hidden" name="file_ms" value={`/images/products/original/${path.file_ms}`} />

//                                                     <input type="hidden" name="file_s" value={`/images/products/original/${path.file_s}`} />


//                                                     <img
//                                                         className="w-100 mb-2 img-thumbnail"
//                                                         src={`${process.env.NEXT_PUBLIC_API_URL}:5003${path.file_path}`}
//                                                         alt="Uploaded File"
//                                                     />
//                                                     <div>
//                                                         <label>
//                                                             <input
//                                                                 type="radio"
//                                                                 name="selectedImage"
//                                                             // checked={filePathArray.find(item => item.id === id)?.radio_value === 1}
//                                                             onChange={() => handleRadioChange(id)}
//                                                             />
//                                                             Select as Default
//                                                         </label>
//                                                     </div>

//                                                 </>
//                                             )
//                                             :
//                                             ''
//                                     }
//                                     {filePathArray.some((item) => item.radio_value === 0) && (
//                                         <p className="text-danger">Please select a default image.</p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditProduct;
// 'use client'
// import React, { useEffect, useState } from 'react';
// import { FaUpload } from 'react-icons/fa';
// import axios from 'axios';
// import Link from 'next/link';

// const EditProduct = ({ id }) => {
//     const [products, setProducts] = useState([]);
//     const [productData, setProductData] = useState({
//         product_name: '',
//         product_quantity: '',
//         status_id: '',
//         file_path: [],
//         product_description: '',
//         brand_id: '',
//         model_id: '',
//         category_id: '',
//         sub_category_id: '',
//         period_id: '',
//         unit_id: '',
//         warranty_id: '',
//         material_id: '',
//         color_id: '',
//         type_id: '',
//         product_price: '',
//         product_weight: '',
//         modified_by: '',
//         supplier_id: ''
//     });

    
//     useEffect(() => {
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/product_list/${id}`)
//         .then(Response => Response.json())
//         .then(data => setProducts(data));
//     }, [id]);
    
//     const [selectedFiles, setSelectedFiles] = useState([]);
//     const brand_file_change = (e) => {
//         e.preventDefault();
//         const file = e.target.files[0];
//         if (!file) return;

//         const now = new Date();
//         const uniqueId = Date.now();
//         const year = now.getFullYear();
//         const month = String(now.getMonth() + 1).padStart(2, '0');
//         const day = String(now.getDate()).padStart(2, '0');
//         const hours = String(now.getHours()).padStart(2, '0');
//         const minutes = String(now.getMinutes()).padStart(2, '0');
//         const extension = file.name.split('.').pop();
//         const fileName = file.name.split('.')[0];
//         const newName = `${fileName}(${uniqueId}).${extension}`;
//         const time = `${year}/${month}/${day}/${hours}/${minutes}`;
//         const _path = `${time}/${newName}`;

//         const newFile = {
//             file_path: `/images/products/original/${_path}`,
//             file_s: `/images/products/small/${_path}`,
//             file_m: `/images/products/medium/${_path}`,
//             file_ms: `/images/products/medium_small/${_path}`,
//             radio_value: 0,
//             id: uniqueId
//         };
//         setProductData((prevData) => ({
//             ...prevData,
//             file_path: [...prevData.file_path, newFile], // Add the new file to the array
//         }));
//         setSelectedFiles((prev) => [...prev, { file, id: uniqueId }]);
//         upload(file, newName);
//     };

//     const upload = (file, newName) => {
//         const formData = new FormData();
//         formData.append('files', file, newName);

//         axios
//             .post(`${process.env.NEXT_PUBLIC_API_URL}:5003/product_upload`, formData)
//             .then((res) => console.log(res))
//             .catch((err) => console.log(err));
//     };

//     const handleDragStart = (e, index) => {
//         e.dataTransfer.setData("draggedIndex", index);
//     };

//     const handleDrop = (e, dropIndex) => {
//         e.preventDefault();
//         const draggedIndex = e.dataTransfer.getData("draggedIndex");
//         const updatedFiles = [...productData.file_path];

//         const draggedFile = updatedFiles.splice(draggedIndex, 1)[0];
//         updatedFiles.splice(dropIndex, 0, draggedFile); // Insert at drop index

//         setProductData((prevData) => ({
//             ...prevData,
//             file_path: updatedFiles
//         }));
//     };

//     const handleRadioChange = (id) => {
//         setProductData((prevData) => {
//             const updatedFilePath = prevData.file_path.map((file) => ({
//                 ...file,
//                 radio_value: file.id === id ? 1 : 0, // Update radio_value directly
//             }));
    
//             return {
//                 ...prevData,
//                 file_path: updatedFilePath,
//             };
//         });
//     };
    

//     const handleDragOver = (e) => {
//         e.preventDefault();
//     };

//     useEffect(() => {
//         setProductData((prevData) => ({
//             ...prevData,
//             product_name: products?.product_name || '',
//             product_quantity: products?.product_quantity || '',
//             status_id: products?.status_id || '',
//             file_path: products?.file_path || [],
//             product_description: products?.product_description || '',
//             brand_id: products?.brand_id || '',
//             model_id: products?.model_id || '',
//             category_id: products?.category_id || '',
//             sub_category_id: products?.sub_category_id || '',
//             period_id: products?.period_id || '',
//             unit_id: products?.unit_id || '',
//             warranty_id: products?.warranty_id || '',
//             material_id: products?.material_id || '',
//             color_id: products?.color_id || '',
//             type_id: products?.type_id || '',
//             product_price: products?.product_price || '',
//             product_weight: products?.product_weight || '',
//             modified_by: localStorage.getItem('userId'),
//         }));
//     }, [products]);

//     console.log(productData)

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className="col-12 p-4">
//                     <div className="card">
//                         <div className="body-content bg-light">
//                             <div className="alert alert-warning mb-0 mb-3 mt-4 text-danger font-weight-bold" role="alert">
//                                 (<small><sup><i className="text-danger fas fa-star"></i></sup></small>) field required
//                             </div>
//                             <div className="border-primary shadow-sm border-0">
//                                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                                     <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Update Product</h5>
//                                     <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                                         <Link href={`/Admin/product/product_all?page_group=somegroup`} className="btn btn-sm btn-info">Back Product List</Link>
//                                     </div>
//                                 </div>
//                                 <div className="col-lg-3 border">
//                                     <label className="font-weight-bold">Product Image</label>
//                                     <div>
//                                         <span className="btn btn-success btn-sm mb-2">
//                                             <label htmlFor="fileInput" className="mb-0">
//                                                 <FaUpload /> Select Image
//                                             </label>
//                                             <input
//                                                 className="mb-0"
//                                                 onChange={brand_file_change}
//                                                 type="file"
//                                                 id="fileInput"
//                                                 style={{ display: 'none' }}
//                                             />
//                                         </span>
//                                     </div>
//                                     {productData?.file_path?.map((path, index) => (
//                                         <div
//                                             key={path.id}
//                                             draggable
//                                             onDragStart={(e) => handleDragStart(e, index)}
//                                             onDragOver={handleDragOver}
//                                             onDrop={(e) => handleDrop(e, index)}
//                                             className="mb-2"
//                                         >
//                                             <img
//                                                 className="w-100 mb-2 img-thumbnail"
//                                                 src={`${process.env.NEXT_PUBLIC_API_URL}:5003${path.file_path}`}
//                                                 alt="Uploaded File"
//                                             />
//                                             <div>
//                                                 <label>
//                                                     <input
//                                                         type="radio"
//                                                         name="selectedImage"
//                                                         checked={path.is_default === "1"}
//                                                         onChange={() => handleRadioChange(path.id)}
//                                                     />
//                                                     Select as Default
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditProduct;

