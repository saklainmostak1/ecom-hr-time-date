
'use client' 
 //ismile
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-dropdown-select';
import Link from 'next/link';
import '../../../admin_layout/modal/fa.css'
import Swal from 'sweetalert2';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import jsPDF from 'jspdf';
import * as XLSX from "xlsx";
import 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType } from 'docx';




const QuickBrandEdit = ({ searchParams }) => {

    const [selected_brand_id, setSelected_brand_id] = useState();
    const [selectedBrand, setSelectedBrand] = useState();
    const [selectedModel, setSelectedModel] = useState();
    const [fieldEmpty, setFieldEmpty] = useState({});

    const [apply_all_brand_error, set_apply_all_brand_error] = useState(null);
    const [apply_all_model_error, set_apply_all_model_error] = useState(null);
    const [brand_error, set_brand_error] = useState(null);
    const [model_error, set_model_error] = useState(null);


    const [pageUsers, setPageUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    let [brand_data, setBrand_data] = useState({});
 
    const [category, setCategory] = useState([])

 
    
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

    const [userId, setUserId] = useState(() => {
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

    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [brand, setBrand] = useState([]);
    const [model, setModel] = useState([]);

    // ---------------------------------------------------------


    // useEffect(() => {
    //     setSelectedColumns(columnListSelectedArray)
    // }, [])

    // useEffect(() => {
    //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_all`)
    //         .then(res => res.json())
    //         .then(data => setCategory(data))
    // }, []);

    // const [subCategory, setSubCategory] = useState([])
    // useEffect(() => {
    //     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sub_category/sub_category_all`)
    //         .then(res => res.json())
    //         .then(data => setSubCategory(data))
    // }, []);


    // const filter_sub_category = (subCateId) => {
    //     return subCategory.filter(subCate => subCate.category_id === Number(subCateId))
    // };

    // const { data: module_settings = [],
    // } = useQuery({
    //     queryKey: ['module_settings'],
    //     queryFn: async () => {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`)

    //         const data = await res.json()
    //         return data
    //     }
    // })

    // const { data: brands = [], isLoading, refetch
    // } = useQuery({
    //     queryKey: ['brands'],
    //     queryFn: async () => {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/brand/brand_all`)

    //         const data = await res.json()
    //         return data
    //     }
    // })

    // const { data: moduleInfo = []
    // } = useQuery({
    //     queryKey: ['moduleInfo'],
    //     queryFn: async () => {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${userId}`)
    //         const data = await res.json()
    //         return data
    //     }
    // })

    // console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'brand'))
    // const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'brand')

    //   console.log(filteredModuleInfo);

    // const filteredBtnIconEdit = brandList.filter(btn =>
    //     btn.method_sort === 3
    // );
    // const filteredBtnIconCopy = brandList.filter(btn =>
    //     btn.method_sort === 4
    // );

    // const filteredBtnIconDelete = brandList.filter(btn =>
    //     btn.method_sort === 5
    // );
    // const filteredBtnIconCreate = brandList.filter(btn =>
    //     btn.method_sort === 1
    // );

    // const Category = module_settings.filter(moduleI => moduleI.table_name === 'brand')
    // const columnListSelected = Category[0]?.column_name
    // const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());

    // const columnNames = brands && brands.length > 0 ? Object.keys(brands[0]) : [];

    // const parentUsers = brands
    // const totalData = parentUsers?.length
    // const dataPerPage = 20
    // const totalPages = Math.ceil(totalData / dataPerPage)
    // let currentPage = 1

    // if (Number(searchParams.page) >= 1) {
    //     currentPage = Number(searchParams.page)
    // }

    // let pageNumber = []
    // for (let index = currentPage - 2; index <= currentPage + 2; index++) {
    //     if (index < 1) {
    //         continue
    //     }
    //     if (index > totalPages) {
    //         break
    //     }
    //     pageNumber.push(index)
    // }

    // const getUsers = async () => {
    //     const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/brand/brand_all/${currentPage}/${dataPerPage}`;
    //     const response = await fetch(url);
    //     const data = await response.json();
    //     setPageUsers(data);
    // };

    // useEffect(() => {
    //     getUsers();
    // }, [currentPage]);

    // const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;


    // -------------------------------------------------------




    const formatString = (str) => {
        const words = str?.split('_');
        const formattedWords = words?.map((word) => {
            const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return capitalizedWord;
        });
        return formattedWords?.join(' ');
    };



    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/brand/brand_all`)
            .then(res => res.json())
            .then(data => setBrand(data))
    }, []);


    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/model/model_all`)
            .then(res => res.json())
            .then(data => setModel(data))
    }, []);



    const update_fields = (event) => {
        setSelected_brand_id(event);
        setSelectedColumns([]);
    };


    const brand_quick_edit = (selectedItems) => {
        setSelectedColumns(selectedItems.map((item) => item.value));

    };

    const brand_search = () => {

        const brand_name = brand.find(item => item.id == selected_brand_id)?.brand_name;
        setSelectedBrand(`${brand_name},${selected_brand_id}`);
        setSelectedModel(null);

        if (selected_brand_id && selectedColumns.length > 0) {

            set_model_error(null);
            setLoading(true);
            setBrand_data({});

            set_apply_all_brand_error(null);
            set_apply_all_model_error(null);

            axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/quick_brand_search`, {
                selectedColumns,
                selected_brand_id
            })
                .then(response => {

                    setSearchResults(response.data.results);
                    setError(null);
                    setLoading(false);
                    if (response.data.results == '') {
                        setLoading(false);
                    }
                })
                .catch(error => {
                    setLoading(false);
                    // setError("An error occurred during search.", error);
                    setSearchResults([]);
                });

        } else {

            setLoading(false);
            if (!selected_brand_id) {
                set_apply_all_model_error(null);
                set_apply_all_brand_error("You should select Brand!");
            } else if (selectedColumns.length <= 0) {
                set_apply_all_brand_error(null);
                set_apply_all_model_error("You should select Model !");
            } else {
                set_apply_all_brand_error("You should select Brand!");
                set_apply_all_model_error("You should select Model!");
            }

        }


        setFieldEmpty({});

    };

    function update_brand_name(index, event) {

        let values = event.target.value.split(",");
        const temp_object = Object.assign({}, brand_data);

        if (!temp_object.hasOwnProperty(index)) {
            temp_object[index] = {};
        }

        temp_object[index].id = values[0];
        temp_object[index].brand_name = values[1];
        temp_object[index].brand_id = values[2];
        temp_object[index].model_name = '';
        temp_object[index].model_id = '';



        searchResults[index].brand_name = values[1];
        searchResults[index].brand_id = values[2];
        searchResults[index].model_name = '';
        searchResults[index].model_id = '';

        setBrand_data(temp_object);

    }

    function update_model_name(index, event) {

        let values = event.target.value.split(",");
        const temp_object = Object.assign({}, brand_data);

        if (!temp_object.hasOwnProperty(index)) {
            temp_object[index] = {};
        }

        searchResults[index].model_name = values[1];
        searchResults[index].model_id = values[2];

        temp_object[index].id = values[0];
        temp_object[index].brand_name = searchResults[index].brand_name;
        temp_object[index].brand_id = searchResults[index].brand_id;
        temp_object[index].model_name = values[1];
        temp_object[index].model_id = values[2];


        setBrand_data(temp_object);

    }

    const filtered_models = (brandId) => {
        return model.filter(model => model.brand_id === Number(brandId));
    };

    const single_filtered_models = (index, brand_id) => {

        if (brand_data[index]) {
            return model.filter(model => model.brand_id === Number(brand_data[index]['brand_id']));
        } else {
            return model.filter(model => model.brand_id === Number(brand_id));
        }
    }

    const all_filtered_models = () => {

        if (selectedBrand) {
            let values = selectedBrand.split(",");
            return model.filter(model => model.brand_id === Number(values[1]));
        } else {
            return model.filter(model => model.brand_id === Number(selected_brand_id));
        }
    }

    function update_all_brand_name(event) {
        setSelectedBrand(event.target.value);
    }

    function update_all_model_name(event) {
        setSelectedModel(event.target.value);
    }

    function apply_all_brand() {

        // console.log(selectedBrand.split(',')[0], 'selectedBrand'); 

        if (selectedBrand) {
            const search_result = [...searchResults];
            const temp_object = {}
            let values = selectedBrand.split(",");
            let index = 0;
            for (const element of search_result) {
                if (!temp_object.hasOwnProperty(index)) {
                    temp_object[index] = {};
                }
                temp_object[index].id = element.id;
                temp_object[index].product_name = element.product_name;
                temp_object[index].brand_name = values[0];
                temp_object[index].brand_id = values[1];
                temp_object[index].model_name = '';
                temp_object[index].model_id = '';
                index++;
            }

            setBrand_data(temp_object);
            const arrayFromObject = Object.values(temp_object);
            setSearchResults(arrayFromObject);

        } else { console.log(selectedBrand, 'selectedBrand') }

    }


    function apply_all_model() {

        // console.log(selectedModel,'selectedModel');


        if (selectedModel && selectedModel != 'Select Model') {

            set_model_error(null);
            const search_result = [...searchResults];
            const temp_object = {};
            let values = selectedModel.split(",");
            let index = 0;

            const brand_name = brand.find(item => item.id == values[0])?.brand_name;

            for (const element of search_result) {

                element.model_name = values[0];
                element.model_id = values[1];

                if (!temp_object.hasOwnProperty(index)) {
                    temp_object[index] = {};
                }

                temp_object[index].id = element.id;
                temp_object[index].product_name = element.product_name;
                temp_object[index].brand_name = brand_name;
                temp_object[index].brand_id = values[0];
                temp_object[index].model_id = values[1];
                temp_object[index].model_name = values[2];
                index++;
            }

            setBrand_data(temp_object);
            const arrayFromObject = Object.values(temp_object);
            setSearchResults(arrayFromObject);
        } else {
            set_model_error('You should select model!');

        }

    }



    function update_product() {


        console.log(brand_data);

        const temp = {};
        for (const key in brand_data) {
            if (brand_data[key].brand_id == '') {
                if (!temp.hasOwnProperty(key)) {
                    temp[key] = {};
                }
                temp[key].brand_id = 'Please Fill Up'
            }
            if (brand_data[key].model_id == '') {
                if (!temp.hasOwnProperty(key)) {
                    temp[key] = {};
                }
                temp[key].model_id = 'Please Fill Up'
            }
        }

        const length = Object.keys(temp).length;

        if (!length) {
            setFieldEmpty({});

            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/quick_brand_update`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(brand_data),
            }).then((Response) => Response.json())
                .then((data) => {
                    if (data) {
                        // setSearchResults('');
                        Swal.fire({
                            title: 'Success!',
                            text: 'Edit Successful !!',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        })
                        brand_search();
                    }
                }).catch((error) => console.error(error));
        } else {
            setFieldEmpty(temp);
        }
    }


    return (

        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    
                    <div className='card mb-4'>



                        <div class=" body-content bg-light p-0">
                            <div class=" border-primary shadow-sm border-0">
                                <div class=" card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Brand Search</h5>
                                </div>
                                <div class="card-body">
                                    <form class="">
                                        <div class="">
                                            <div class="form-group row student">


                                                <label class="col-form-label col-md-2"><strong>Brand Name</strong></label>

                                                <div className="col-md-4">

                                                    <select
                                                        onChange={(e) => update_fields(e.target.value)}
                                                        name="brand_name"
                                                        className="form-control form-control-sm integer_no_zero lshift">
                                                        <option value=''>Select Brand Name</option>
                                                        {brand.map(brand => (
                                                            <option key={brand.id} value={brand.id}>
                                                                {brand.brand_name}</option>
                                                        ))}
                                                    </select>
                                                    {apply_all_brand_error && <div className='text-danger'>{apply_all_brand_error}</div>}
                                                </div>


                                                {/* -------------------------------------------------------------------------------- */}
                                                <label class="col-form-label col-md-2"><strong> Model Name </strong></label>

                                                <div className="col-md-4">
                                                    <Select
                                                        key={selected_brand_id}
                                                        multi clearable searchable options={[
                                                            ...filtered_models(selected_brand_id)?.map(column => ({
                                                                label: formatString(column.model_name),
                                                                value: column.id,
                                                            })),
                                                        ]}
                                                        onChange={brand_quick_edit}
                                                    />
                                                    {apply_all_model_error && <div className='text-danger'>{apply_all_model_error}</div>}

                                                </div>
                                                {/* -------------------------------------------------------------------------------- */}


                                            </div>
                                        </div>


                                        {error && <div>Error: {error}</div>}

                                        <div class="form-group row">
                                            <div class="offset-md-2 col-md-6 float-left">
                                                <input type="button" onClick={brand_search} name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search" />
                                            </div>
                                        </div>
                                    </form>

                                    <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
                                        <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                                    </div>
                                </div>

                            </div>
                        </div >
                    </div >




                    <div className='card mb-4'>
                        <div class=" border-primary  shadow-sm border-0">
                            <div class="card-header   custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Product List</h5>
                                <div class="card-title card-header-color font-weight-bold mb-0  float-right">
                                    <input type="button" onClick={update_product} name="submit" class="btn btn-sm btn-info search_btn mr-2" value="Update product" /> </div>
                            </div>

                            {error && <div>Error: {error}</div>}

                            <div class="card-body" >

                                {loading ?

                                    <div className='text-center'>

                                        <div className='  text-center text-dark'>
                                            <FontAwesomeIcon style={{
                                                height: '33px',
                                                width: '33px',
                                            }} icon={faSpinner} spin />
                                        </div>

                                    </div>

                                    :

                                    // ----------------------------------------------------------------------------------- Product list


                                    searchResults.length > 0 ? (

                                        <form action="">
                                            <div class="table-responsive">
                                                <table className="table table-bordered table-hover table-striped table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Serial</th>
                                                            <th>Product Name</th>
                                                            <th >
                                                                <div className='d-flex'>

                                                                    <p className='col-5'>Brand Name</p>

                                                                    <form className='d-flex'>
                                                                        <select
                                                                            required
                                                                            value={selectedBrand}
                                                                            key={selectedBrand}
                                                                            onChange={(e) => update_all_brand_name(e)}
                                                                            name="all_brand_name"
                                                                            className="form-control form-control-sm integer_no_zero lshift">

                                                                            {/* <option value="">{selectedBrand.split(',')[0]}</option> */}
                                                                            {brand.map(brand => (
                                                                                <option key={brand.id} value={[brand.brand_name, brand.id]}>
                                                                                    {brand.brand_name}
                                                                                </option>
                                                                            ))}

                                                                        </select>

                                                                        <div class="form-group row">
                                                                            <div class="col-md-5 float-right">
                                                                                <input type="button" onClick={apply_all_brand} name="submit" class="btn btn-sm btn-info search_btn " value="Apply" />
                                                                            </div>
                                                                        </div>
                                                                    </form>
                                                                </div>

                                                            </th>

                                                            <th >
                                                                <div className='d-flex'>
                                                                    <p className='col-4'>Model Name</p>
                                                                    <form className='d-flex'>
                                                                        <select
                                                                            value={selectedModel}
                                                                            required
                                                                            onChange={(e) => update_all_model_name(e)}
                                                                            name="all_model_name"
                                                                            className="form-control form-control-sm integer_no_zero lshift">
                                                                            <option value={undefined} >Select Model</option>

                                                                            {all_filtered_models().map(model => (
                                                                                <option key={model.id} value={[model.brand_id, model.id, model.model_name]}>
                                                                                    {model.model_name}
                                                                                </option>
                                                                            ))}
                                                                        </select>

                                                                        <div class="form-group row">
                                                                            <div class="col-md-2 float-right">
                                                                                <input type="button" onClick={apply_all_model} name="submit" class="btn btn-sm btn-info search_btn " value="Apply" />
                                                                            </div>
                                                                        </div>
                                                                    </form>
                                                                </div>

                                                                {model_error && <p className='text-danger m-0 p-0 text-sm-left'>{model_error}</p>}

                                                            </th>




                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {searchResults.map((value, i) => (
                                                            <tr key={i}>
                                                                <td>{i + 1}</td>
                                                                <td>{value.product_name}</td>
                                                                <td>
                                                                    <select
                                                                        required
                                                                        onChange={(e) => update_brand_name(i, e)}
                                                                        value={[value.id, value.brand_name, value.brand_id]}
                                                                        name="brand_name"
                                                                        className="form-control form-control-sm integer_no_zero lshift">
                                                                        {/* <option value={[value.id, value.brand_name, value.brand_id]}>{value.brand_name}</option> */}
                                                                        {brand.map(brand => (
                                                                            <option key={brand.id} value={[value.id, brand.brand_name, brand.id]}>
                                                                                {brand.brand_name}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    {fieldEmpty[i]?.brand_id ? <p className='text-danger pt-1 mb-0 '>Need to fill Up</p> : ''}
                                                                </td>



                                                                <td>
                                                                    <select value={[value.id, value.model_name, value.model_id]}
                                                                        required
                                                                        onChange={(e) => update_model_name(i, e)}
                                                                        name="model_name"
                                                                        className="form-control form-control-sm integer_no_zero lshift">
                                                                        {value.model_id == '' ? <option value={''} > Select Model</option> : ''}
                                                                        {single_filtered_models(i, value.brand_id).map(model => (
                                                                            <option key={model.id} value={[value.id, model.model_name, model.id]}>{model.model_name}</option>
                                                                        ))}
                                                                    </select>

                                                                    {fieldEmpty[i]?.model_id ? <p className='text-danger pt-1 mb-0 '>Need to fill Up</p> : ''}
                                                                </td>


                                                            </tr>

                                                        ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>



                                            <div class="form-group row">
                                                <div class="offset-md-2 col-md-6 float-left">
                                                    <input type="button" onClick={update_product} name="submit" class="btn btn-sm btn-info search_btn mr-2" value="Update product" />
                                                </div>
                                            </div>

                                        </form>
                                    )
                                        :


                                        <>
                                            <div>No data found !</div>

                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
};

export default QuickBrandEdit;
