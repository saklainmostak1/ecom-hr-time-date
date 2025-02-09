'use client' 
 //ismile;
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';

const GeoLOcationSetting = () => {
    const [pageGroup, setPageGroup] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pageGroup') || '';
        }
        return '';
    });

    const [userId, setUserId] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userId') || '';
        }
        return '';
    });

    const [refreshInterval, setRefreshInterval] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPageGroup(localStorage.getItem('pageGroup') || '');
            setUserId(localStorage.getItem('userId') || '');
        }
    }, []);

    const options = [];

    // Add specific seconds options
    const secondsOptions = [20000, 30000]; // 20 seconds and 30 seconds
    for (let i = 0; i < secondsOptions.length; i++) {
        const time = secondsOptions[i];
        const seconds = time / 1000;
        options.push(
            <option key={time} value={time}>
                {seconds} Second{seconds > 1 ? 's' : ''}
            </option>
        );
    }

    // Add minute options from 1 to 30 minutes
    for (let minutes = 1; minutes <= 30; minutes++) {
        const time = minutes * 60000; // Convert minutes to milliseconds
        options.push(
            <option key={time} value={time}>
                {minutes} Minute{minutes > 1 ? 's' : ''}
            </option>
        );
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const time_table = form.time_table.value;
        const time = form.time.value;

        const addValue = {
            created_by: userId,
            table_name: time_table.toLowerCase(),
            column_name: time,
        };

        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_create`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(addValue),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                console.log(addValue);
            })
            .catch((error) => console.error(error));
    };

    const { data: module_settings = [] } = useQuery({
        queryKey: ['module_settings'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/module_settings/module_settings_all`);
            const data = await res.json();
            return data;
        },
    });

    const Category = module_settings.find(moduleI => moduleI.table_name === 'time_table') || {};
    const defaultInterval = parseFloat(Category.column_name) || null;

    useEffect(() => {
        setRefreshInterval(defaultInterval);
    }, [defaultInterval]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-12 p-4'>
                    <div className='card'>
                        <div className="body-content bg-light">
                            <div className="border-primary shadow-sm border-0">
                                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                                    <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Income Settings</h5>
                                    <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                                        <Link href={`/Admin/income/income_create?page_group=${pageGroup}`} className="btn btn-sm btn-info">Back To Create Income</Link>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="col-md-9 offset-md-1">
                                            <div className="form-group row student">
                                                <label className="col-form-label col-md-2"><strong>Design:</strong></label>
                                                <div>
                                                    <input className='d-none' type="text" name='time_table' value='time_table' />
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="input-group printable">
                                                        <select
                                                            id="refreshInterval"
                                                            value={refreshInterval || ''}
                                                            onChange={(e) => setRefreshInterval(parseInt(e.target.value) || null)}
                                                            name="time"
                                                            className="form-control form-control-sm required integer_no_zero"
                                                        >
                                                            <option value=''>Select Time</option>
                                                            {options}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="offset-md-3 col-sm-6">
                                                <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                            </div>
                                        </div>
                                    </form>
                                    <div className="col-md-12 clearfix loading_div text-center" style={{ overflow: 'hidden', display: 'none' }}>
                                        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
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

export default GeoLOcationSetting;
