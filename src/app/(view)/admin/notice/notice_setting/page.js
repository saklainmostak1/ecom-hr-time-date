'use client'
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';

const NoticeSettings = () => {

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

    const { data: categorys = [], isLoading, refetch
    } = useQuery({
        queryKey: ['categorys'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_all`)

            const data = await res.json()
            return data
        }
    })



    const { data: module_settings = []
    } = useQuery({
        queryKey: ['module_settings'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`)

            const data = await res.json()
            return data
        }
    })

    const category = module_settings.filter(moduleI => moduleI.table_name === 'notice')
    const columnListSelected = category[0]?.column_name
    const columnListSelectedArray = columnListSelected?.split(',').map(item => item.trim());


    const formatString = (str) => {
        const words = str?.split('_');

        const formattedWords = words?.map((word) => {
            const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return capitalizedWord;
        });

        return formattedWords?.join(' ');
    };

    const columnNames = categorys && categorys.length > 0 ? Object.keys(categorys[0]) : [];


    console.log('Column Names:', columnNames);



    // const { data: moduleInfo = []
    // } = useQuery({
    //     queryKey: ['moduleInfo'],
    //     queryFn: async () => {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all`)

    //         const data = await res.json()
    //         return data
    //     }
    // })
    // console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'category'))
    // const brandList = moduleInfo.filter(moduleI => moduleI.controller_name === 'category')

    //   console.log(filteredModuleInfo);






    const [selectedColumns, setSelectedColumns] = React.useState([]);



    const columnString = selectedColumns.join(', ');




    const handleColumnChange = (selectedItems) => {
        setSelectedColumns(selectedItems.map((item) => item.value));
        // handleSearch(); 
    };
    console.log(selectedColumns)
    const filteredColumns = columnNames.filter(column => column !== 'id');



    // Function to handle checkbox change
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target
        const name = form.name.value
        const table_name = form.table_name.value


        // Add your form submission logic here using the 'fields' state.

        const addValue = {
            name, table_name: table_name.toLowerCase(), column_name: columnString, created_by: userId
        }

        console.log(addValue)

        // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_create
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_create`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(addValue),
        })
            .then((Response) => Response.json())
            .then((data) => {

                console.log(data);
                console.log(addValue);
            })
            .catch((error) => console.error(error));

    }




    return (
        <div class="container-fluid">
            <div class="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class="body-content bg-light">

                            <div class=" border-primary shadow-sm border-0">
                                <div class=" card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Notice Settings</h5>
                                    <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                                        <Link href={`/Admin/notice/notice_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create Notice</Link>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div class="col-md-9 offset-md-1">
                                            <div class="form-group row student d-none">
                                                <label class="col-form-label col-md-2"><strong>Name:</strong></label>
                                                <div class="col-md-4">
                                                    <input
                                                        defaultValue={category[0]?.name}
                                                        name="name"
                                                        type="text" class="form-control form-control-sm  alpha_space student_id" id="student_id" placeholder="Name" />
                                                </div>

                                                <label class="col-form-label col-md-2"><strong>Table Name:</strong></label>
                                                <div class="col-md-4">
                                                    <input
                                                        defaultValue={category[0]?.table_name}
                                                        type="text" name="table_name" class="form-control form-control-sm  alpha_space student_id" id="student_id" placeholder="Table Name" />
                                                </div>
                                            </div>
                                            <div class="form-group row student">

                                                <label class="col-form-label col-md-2"><strong>Design:</strong></label>

                                                <div className="col-md-10">
                                                    <Select
                                                        name='select'
                                                        labelField='label'
                                                        valueField='value'
                                                        options={[
                                                            { label: 'Serial', value: 'serial' }, // Serial option
                                                            // Serial option
                                                            ...filteredColumns.map(column => ({ label: formatString(column), value: column })),
                                                            { label: 'Action', value: 'action' }
                                                        ]}
                                                        values={

                                                            columnListSelectedArray?.map(column => ({
                                                                label: formatString(column),
                                                                value: column,
                                                            }))

                                                        }
                                                        multi
                                                        onChange={handleColumnChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-3 col-sm-6">
                                                <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                            </div>
                                        </div>
                                    </form>
                                    <div class="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
                                        <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeSettings;