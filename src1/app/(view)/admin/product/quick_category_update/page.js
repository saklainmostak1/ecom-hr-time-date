'use client' 
 //ismile
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState, useRef, use } from 'react';
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




const QuickCategoryEdit = ({ searchParams }) => {

    const [selected_category_id, setSelected_category_id] = useState();
    const [selectedCategory, setSelectedCategory] = useState();
    const [selected_sub_category, setSelected_sub_category] = useState();
    const [fieldEmpty, setFieldEmpty] = useState({});

    const [category, setCategory] = useState([]);
    const [sub_category, setSubCategory] = useState([]);

    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);

    const [apply_all_categoryError, set_apply_all_categoryError] = useState(null);
    const [apply_all_sub_categoryError, set_apply_all_sub_categoryError] = useState(null);
    const [categoryError, setCategoryError] = useState(null);
    const [subCategoryError, setSubCategoryError] = useState(null);

    const [selectedColumns, setSelectedColumns] = useState([]);

    const [pageUsers, setPageUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    let [category_data, setCategory_data] = useState({});



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


    // ------------------------------------------------------------------


    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/category/category_all`)
            .then(res => res.json())
            .then(data => setCategory(data))
    }, []);


    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/sub_category/sub_category_all`)
            .then(res => res.json())
            .then(data => setSubCategory(data))
    }, []);


    // const { data: module_settings = [],
    // } = useQuery({
    //     queryKey: ['module_settings'],
    //     queryFn: async () => {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`)
    //         const data = await res.json()
    //         return data
    //     }
    // })

    // const { data: brands = [], isLoading, refetch } = useQuery({
    //     queryKey: ['brands'],
    //     queryFn: async () => {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/brand/brand_all`)
    //         return data
    //     }
    // })

    // const { data: moduleInfo = []
    // } = useQuery({
    //     queryKey: ['moduleInfo'],
    //     queryFn: async () => {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${userId}`)
    //         return data
    //     }
    // })

    // const Category = module_settings.filter(moduleI => moduleI.table_name === 'brand');

    // const columnListSelected = Category[0]?.column_name
    // const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());

    // const columnNames = brands && brands.length > 0 ? Object.keys(brands[0]) : [];

    // useEffect(() => {
    //     setSelectedColumns(columnListSelectedArray)
    // }, [])

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




    // -------------------------------------------------

    const formatString = (str) => {
        const words = str?.split('_');
        const formattedWords = words?.map((word) => {
            const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return capitalizedWord;
        });

        return formattedWords?.join('');
    };


    const category_search = () => {
        const category_name = category.find(item => item.id == selected_category_id)?.category_name;
        setSelectedCategory(`${category_name},${selected_category_id}`);
        setSelected_sub_category(null);
        if (selected_category_id && selectedColumns.length > 0) {
            setCategoryError(null);
            setSubCategoryError(null);
            setLoading(true);
            setCategory_data({});
            axios.post(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/quick_category_search`, {
                selectedColumns,
                selected_category_id
            }).then(response => {
                setSearchResults(response.data.results);
                setError(null);
                setLoading(false);
                if (response.data.results == '') {

                }
            }).catch(error => {
                setError("An error occurred during search.", error);
                setSearchResults([]);
            });
        } else {
            setLoading(false);
            if (!selected_category_id) {
                setSubCategoryError(null);
                setCategoryError("You should select Category!");
            } else if (selectedColumns.length <= 0) {
                setCategoryError(null);
                setSubCategoryError("You should select Sub Category !");
            } else {
                setCategoryError("You should select Category!");
                setSubCategoryError("You should select Sub Category!");
            }

        }
        setFieldEmpty({});
    };

    const update_fields = (event) => {
        setSelected_category_id(event);
        setSelectedColumns([]);
    };


    function update_category_name(index, event) {

        let values = event.target.value.split(",");
        const temp_object = Object.assign({}, category_data);

        if (!temp_object.hasOwnProperty(index)) {
            temp_object[index] = {};
        }

        temp_object[index].id = values[0];
        temp_object[index].category_name = values[1];
        temp_object[index].category_id = values[2];
        temp_object[index].sub_category_name = '';
        temp_object[index].sub_category_id = '';



        searchResults[index].category_name = values[1];
        searchResults[index].category_id = values[2];
        searchResults[index].sub_category_name = '';
        searchResults[index].sub_category_id = '';

        setCategory_data(temp_object);
    }

    const brand_quick_edit = (selectedItems) => {
        setSelectedColumns(selectedItems.map((item) => item.value));

    };


    function update_sub_category_name(index, event) {

        let values = event.target.value.split(",");
        const temp_object = Object.assign({}, category_data);

        if (!temp_object.hasOwnProperty(index)) {
            temp_object[index] = {};
        }

        searchResults[index].sub_category_name = values[1];
        searchResults[index].sub_category_id = values[2];

        temp_object[index].id = values[0];
        temp_object[index].category_name = searchResults[index].category_name;
        temp_object[index].category_id = searchResults[index].category_id;
        temp_object[index].sub_category_name = values[1];
        temp_object[index].sub_category_id = values[2];


        setCategory_data(temp_object);

    }


    const filtered_sub_category = (category_id) => {
        return sub_category.filter(sub_category => sub_category.category_id === Number(category_id));
    };


    const single_filtered_sub_category = (index, category_id) => {

        if (category_data[index]) {
            return sub_category.filter(sub_category => sub_category.category_id === Number(category_data[index]['category_id']));
        } else {
            return sub_category.filter(sub_category => sub_category.category_id === Number(category_id));
        }
    }

    const all_filtered_sub_category = () => {

        if (selectedCategory) {
            let values = selectedCategory.split(",");
            return sub_category.filter(sub_category => sub_category.category_id === Number(values[1]));
        } else {
            return sub_category.filter(sub_category => sub_category.category_id === Number(selected_category_id));
        }
    }


    function update_all_category_name(event) {
        setSelectedCategory(event.target.value);
    }

    function update_all_model_name(event) {
        setSelected_sub_category(event.target.value);
    }


    function apply_all_category() {

        if (selectedCategory) {
            set_apply_all_categoryError(null);
            const search_result = [...searchResults];
            const temp_object = {}
            let values = selectedCategory.split(",");
            let index = 0;
            for (const element of search_result) {
                if (!temp_object.hasOwnProperty(index)) {
                    temp_object[index] = {};
                }

                temp_object[index].id = element.id;
                temp_object[index].product_name = element.product_name;
                temp_object[index].category_name = values[0];
                temp_object[index].category_id = values[1];
                temp_object[index].sub_category_name = '';
                temp_object[index].sub_category_id = '';
                index++;
            }

            setCategory_data(temp_object);
            const arrayFromObject = Object.values(temp_object);
            setSearchResults(arrayFromObject);

        } else {
            set_apply_all_categoryError('You should select category!');
        }

    }


    function apply_all_sub_category() {

        if (selected_sub_category && selected_sub_category != 'Select sub Category') {
            set_apply_all_sub_categoryError(null);
            const search_result = [...searchResults];
            const temp_object = {};
            let values = selected_sub_category.split(",");
            let index = 0;
            const category_name = category.find(item => item.id == values[0])?.category_name;
            for (const element of search_result) {
                element.sub_category_name = values[0];
                element.sub_category_id = values[1];
                if (!temp_object.hasOwnProperty(index)) {
                    temp_object[index] = {};
                }

                temp_object[index].id = element.id;
                temp_object[index].product_name = element.product_name;
                temp_object[index].category_name = category_name;
                temp_object[index].category_id = values[0];
                temp_object[index].sub_category_id = values[1];
                temp_object[index].sub_category_name = values[2];
                index++;
            }

            setCategory_data(temp_object);
            const arrayFromObject = Object.values(temp_object);
            setSearchResults(arrayFromObject);
        } else {
            set_apply_all_sub_categoryError('You should select Sub category!');
        }


    }



    function update_product() {

        const temp = {};
        for (const key in category_data) {
            if (category_data[key].category_id == '') {
                if (!temp.hasOwnProperty(key)) {
                    temp[key] = {};
                }
                temp[key].category_id = 'Please fill up this field'
            }
            if (category_data[key].sub_category_id == '') {
                if (!temp.hasOwnProperty(key)) {
                    temp[key] = {};
                }
                temp[key].sub_category_id = 'Please fill up this field'
            }
        }

        const length = Object.keys(temp).length;

        if (!length) {

            setFieldEmpty({});
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/product/quick_category_update`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(category_data),
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
                        category_search();
                    }
                }).catch((error) => console.error(error));
        } else {
            setFieldEmpty(temp);
            // alert("All filed should be filled up")
        }
    }


    return (
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>

                    <div className='card mb-4'>

                        <div class="body-content bg-light p-0">
                            <div class=" border-primary shadow-sm border-0">
                                <div class=" card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Category Search</h5>
                                </div>
                                <div class="card-body">
                                    <form class="">
                                        <div class="">
                                            <div class="form-group row student">
                                                <label class="col-form-label col-md-2"><strong>Category Name</strong></label>
                                                <div className="col-md-4">
                                                    <select
                                                        onChange={(e) => update_fields(e.target.value)}
                                                        name="category_name"
                                                        className="form-control form-control-sm integer_no_zero lshift">
                                                        <option value=''>Select category Name</option>
                                                        {category.map(category => (
                                                            <option key={category.id} value={category.id}>
                                                                {category.category_name}</option>
                                                        ))}
                                                    </select>

                                                    {categoryError && <div className='text-danger'>{categoryError}</div>}
                                                </div>


                                                {/* -------------------------------------------------------------------------------- */}
                                                <label class="col-form-label col-md-2"><strong> Sub Category Name </strong></label>
                                                <div className="col-md-4">

                                                    <Select
                                                        key={selected_category_id}
                                                        multi clearable searchable options={[
                                                            ...filtered_sub_category(selected_category_id)?.map(column => ({
                                                                label: formatString(column.sub_category_name),
                                                                value: column.id,
                                                            })),
                                                        ]}
                                                        onChange={brand_quick_edit}
                                                    />

                                                    {subCategoryError && <div className='text-danger'>{subCategoryError}</div>}

                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <div class="offset-md-2 col-md-6 float-left">
                                                <input type="button" onClick={category_search} name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search" />
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






                    {/* _________________________________product List______________________________ */}
                    <div className='card mb-4'>
                        <div class=" border-primary  shadow-sm border-0">
                            <div class="card-header   custom-card-header py-1  clearfix bg-gradient-primary text-white">
                                <h5 class="card-title card-header-color font-weight-bold mb-0  float-left mt-1">Product List</h5>
                                <div class="card-title card-header-color font-weight-bold mb-0  float-right">
                                    <input type="button" onClick={update_product} name="submit" class="btn btn-sm btn-info search_btn mr-2" value="Update product" /> </div>
                            </div>

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

                                                                    <p className='col-5'>Category Name</p>

                                                                    <form className='d-flex'>
                                                                        <select
                                                                            key={selectedCategory}
                                                                            value={selectedCategory}
                                                                            required
                                                                            onChange={(e) => update_all_category_name(e)}
                                                                            name="all_category_name"
                                                                            className="form-control form-control-sm integer_no_zero lshift">

                                                                            {/* <option value="">Select Category Name</option> */}
                                                                            {category.map(category => (
                                                                                <option key={category.id} value={[category.category_name, category.id]}>
                                                                                    {category.category_name}
                                                                                </option>
                                                                            ))}

                                                                        </select>

                                                                        <div class="form-group row">
                                                                            <div class="col-md-5 float-right">
                                                                                <input type="button" onClick={apply_all_category} name="submit" class="btn btn-sm btn-info search_btn " value="Apply" />
                                                                                {apply_all_categoryError && <div className='text-danger'>{apply_all_categoryError}</div>}
                                                                            </div>
                                                                        </div>
                                                                    </form>
                                                                </div>

                                                            </th>

                                                            <th >
                                                                <div className='d-flex'>
                                                                    <p className='col-4'>Sub Category </p>
                                                                    <form className='d-flex'>
                                                                        <select
                                                                            value={selected_sub_category}
                                                                            required
                                                                            onChange={(e) => update_all_model_name(e)}
                                                                            name="all_sub_category_name"
                                                                            className="form-control form-control-sm integer_no_zero lshift">

                                                                            <option >Select sub Category</option>

                                                                            {all_filtered_sub_category().map(sub_category => (
                                                                                <option key={sub_category.id} value={[sub_category.category_id, sub_category.id, sub_category.sub_category_name]}>
                                                                                    {sub_category.sub_category_name}
                                                                                </option>
                                                                            ))}
                                                                        </select>


                                                                        <div class="form-group row">
                                                                            <div class="col-md-2 float-right">
                                                                                <input type="button" onClick={apply_all_sub_category} name="submit" class="btn btn-sm btn-info search_btn " value="Apply" />
                                                                            </div >
                                                                        </div>
                                                                    </form>
                                                                </div>

                                                                {apply_all_sub_categoryError && <p className='text-danger m-0 p-0 text-sm-left'>{apply_all_sub_categoryError}</p>}

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
                                                                        onChange={(e) => update_category_name(i, e)}

                                                                        value={[value.id, value.category_name, value.category_id]}

                                                                        name="category_name"
                                                                        className="form-control form-control-sm integer_no_zero lshift">
                                                                        {category.map(category => (
                                                                            <option key={category.id} value={[value.id, category.category_name, category.id]}>
                                                                                {category.category_name}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    {fieldEmpty[i]?.category_id ? <p className='text-danger pt-1 mb-0 '>please fill up this filed</p> : ''}
                                                                </td>

                                                                <td>
                                                                    <select
                                                                        required
                                                                        onChange={(e) => update_sub_category_name(i, e)}

                                                                        value={[value.id, value.sub_category_name, value.sub_category_id]}
                                                                        name="sub_category_name"
                                                                        className="form-control form-control-sm integer_no_zero lshift">

                                                                        {value.sub_category_id == '' ? <option value={''} > Select Sub category</option> : ''}

                                                                        {single_filtered_sub_category(i, value.category_id).map(sub_category => (
                                                                            <option key={sub_category.id} value={[value.id, sub_category.sub_category_name, sub_category.id]}>{sub_category.sub_category_name}</option>
                                                                        ))}
                                                                    </select>

                                                                    {fieldEmpty[i]?.sub_category_id ? <p className='text-danger pt-1 mb-0 '>Please to fill up this field</p> : ''}
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

                                        <div>No data found !</div>


                                }
                            </div>
                        </div>
                    </div>
                    {/* _____________________________________product list_________________________ */}



                </div >
            </div >
        </div >
    );
};

export default QuickCategoryEdit;
