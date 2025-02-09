'use client' 
 //ismile
import React, { useEffect, useState } from 'react';
import { getAllAdminData } from '@/api/adminPage';
import '../../../admin_layout/modal/fa.css'
import IconModal from '../../../admin_layout/modal/iconModal/page';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';


const AdminPageEditAll = ({ Id, controllerName, pageGroup, controllerSort, pageGroupSort, controllerBg, controllerColor, props }) => {
    const [users, setUsers] = useState([]);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        all_module_info_data();
    }, []);

    const all_module_info_data = () => {
        getAllAdminData().then(data => {
            setUsers(data)
            setLoading(false)
        })
    };

    const selectAllData = [];
    const parentUser = users?.filter(user => user?.id === +Id);
    const childUser = users?.filter(user => user?.parent_id === +Id);
    selectAllData.push(...parentUser, ...childUser);


    const menuType = [
        [
            { mt: 'Non Menu' },
            { mt: 'Menu' },
            { mt: 'Setup' }
        ],
        [
            { mt: 'Menu' },
            { mt: 'Non Menu' },
            { mt: 'Setup' }
        ],
        [
            { mt: 'Setup' },
            { mt: 'Menu' },
            { mt: 'Non Menu' }
        ]
    ]

    const DefaultPage = [
        [
            { dp: 'Non Default' },
            { dp: 'Default' }
        ],
        [
            { dp: 'Default' },
            { dp: 'Non Default' }
        ]

    ]

    const sortArr = [];
    for (let index = 1; index <= 300; index++) {
        sortArr.push(index)
    }

    const module_info_edit = (event) => {
        event.preventDefault();
        const form = event.target;

        for (let index = 0; index < selectAllData.length; index++) {
            const display_name = form.display_name.value || form?.display_name[index]?.value
            const controller_name = form.controller_name.value || form?.controller_name[index]?.value
            const method_name = form.method_name.value || form?.method_name[index]?.value
            const parent_id = form.parent_id?.value || form?.parent_id[index]?.value
            const menu_type = form?.menu_type?.value || form?.menu_type[index]?.value
            const icon = form?.icon?.value || form?.icon[index]?.value
            const btn = form?.btn?.value || form?.btn[index]?.value
            const default_page = form?.default_page?.value || form?.default_page[index]?.value
            const page_group = form?.page_group?.value || form?.page_group[index]?.value
            const controller_bg = form?.controller_bg?.value || form?.controller_bg[index]?.value
            const page_group_icon = form?.page_group_icon?.value || form?.page_group_icon[index]?.value
            const controller_sort = form?.controller_sort?.value || form?.controller_sort[index]?.value
            const page_group_sort = form?.page_group_sort?.value || form?.page_group_sort[index]?.value
            const method_sort = form?.method_sort?.value || form?.method_sort[index]?.value
            const controller_color = form?.controller_color?.value || form?.controller_color[index]?.value
            const id = selectAllData[index].id
            const EditValue = {
                display_name, controller_name, method_name, parent_id, menu_type, icon, btn, default_page, page_group, controller_bg, page_group_icon, controller_sort, page_group_sort, method_sort, controller_color, id
            }
            console.log(EditValue);

            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/updateAdminList/${selectAllData[index].id}`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(EditValue)
            })
                .then((Response) => {
                    Response.json()
                    console.log(Response)
                    if (Response.ok === true) {
                        sessionStorage.setItem("message", "Data Update successfully!");
                        router.push('/Admin/module_info/module_info_all')
                    }
                }
                )
                .then(data => {
                    console.log(data)


                    // router.push('/Admin/module_info/module_info_all');
                })

        }
    }


    // controllerName
    const [controllerNameV, setControllerNameV] = useState({
        inputCNV: `${controllerName}`,
    });

    const module_info_CNV_input_change = (cnvId, cnvValue) => {
        setControllerNameV((cnvPrevValues) => ({
            ...cnvPrevValues,
            [cnvId]: cnvValue,
        }));
    };


    // pageGroup
    const [pageGroupV, setPageGroupV] = useState({
        inputPGV: `${pageGroup}`,
    });

    const module_info_PGV_input_change = (pgvId, pgvValue) => {
        setPageGroupV((pgvPrevValues) => ({
            ...pgvPrevValues,
            [pgvId]: pgvValue,
        }));
    };


    // ControllerSort
    const [controllerSortV, setControllerSortV] = useState({
        inputCS: `${controllerSort}`,
    });

    const module_info_CS_input_change = (csId, csValue) => {
        setControllerSortV((csPrevValues) => ({
            ...csPrevValues,
            [csId]: csValue,
        }));
    };


    // PageGroupSort
    const [pageGroupSortV, setPageGroupSortV] = useState({
        inputPGS: `${pageGroupSort}`,
    });

    const module_info_PGS_input_change = (pgsId, pgsValue) => {
        setPageGroupSortV((pgsPrevValues) => ({
            ...pgsPrevValues,
            [pgsId]: pgsValue,
        }));
    };

    // controllerBg
    const [controllerBgV, setControllerBgV] = useState({
        inputCBV: `${controllerBg}`,
    });

    const module_info_CBV_input_change = (cbvId, cbvValue) => {
        setControllerBgV((cbvPrevValues) => ({
            ...cbvPrevValues,
            [cbvId]: cbvValue,
        }));
    };

    // controllerColor
    const [controllerColorV, setControllerColorV] = useState({
        inputCCV: `${controllerColor}`,
    });

    const module_info_CCV_input_change = (ccvId, ccvValue) => {
        setControllerColorV((ccvPrevValues) => ({
            ...ccvPrevValues,
            [ccvId]: ccvValue,
        }));
    };


    // delete parts start
    const module_info_delete = (id) => {
        const proceed = window.confirm('Are you sure you want to delete?');
        if (proceed) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/allAdmin/${id}`, {
                method: 'DELETE',
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.affectedRows > 0) {
                        Swal.fire({
                            title: 'Delete!',
                            text: 'User deleted successfully!',
                            icon: 'success',
                            confirmButtonText: 'Ok',
                        });
                    }
                    all_module_info_data()
                })
        }
    }


    return (
        <div class="container-fluid">
            <div class=" row ">
                <div className='col-12 p-4'>
                    <div className='card'>

                        {
                            loading ? <>
                                <div>
                                    <p>Loading...</p>
                                </div>
                            </> : <>

                                <div className=" text-light rounded" aria-current="true" style={{ background: '#4267b2' }}>
                                    <div className='d-flex justify-content-between py-1 px-2'>
                                        <h5 className=' pt-2'> Module Info Edit
                                        </h5>
                                        <button style={{ background: '#17a2b8' }} className='border-0 text-white shadow-sm rounded-1 rounded'><Link href='/Admin/module_info/module_info_all'>Back To Module Info List</Link></button>
                                    </div>
                                </div>

                                <div className=' px-4 mx-2'>
                                    <p style={{ backgroundColor: '#ffeeba', fontWeight: 'bold' }} className=' text-danger rounded p-3 mt-4'>(*) field required</p>
                                </div>
                                <form onSubmit={module_info_edit}>
                                    {
                                        selectAllData.map((data, index) => (
                                            <div key={data.id}>
                                                <div >
                                                    <div className="w-100 px-4 pb-2 pt-3">
                                                        <Link href={`/Admin/module_info/module_info_copy/${data?.id}?page_group=${data.page_group}`} title="Copy" className="text-white btn btn-primary btn-sm" data-toggle="tooltip" data-placement="top">
                                                            <i className="fas fa-copy"></i>
                                                        </Link>
                                                        <a

                                                            id="delete_module_info"
                                                            title="Delete"
                                                            className="text-white btn btn-danger btn-sm ml-1"
                                                            data-toggle="tooltip"
                                                            data-placement="top"
                                                            onClick={() => module_info_delete(data?.id)}
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </a>
                                                    </div>
                                                    <div className="row col-md-12 border-bottom pb-3  mx-1">
                                                        <div className="col-md-4">
                                                            <div className="form-group row">
                                                                <label className="col-form-label col-md-6">Display Name:</label>
                                                                <div className="col-md-6">
                                                                    <input type="text" required="" name="display_name" className="form-control form-control-sm required" id="display_name" placeholder="Enter Display Name" defaultValue={data.display_name} />
                                                                </div>
                                                                <label className="col-form-label col-md-6">Controller Name:</label>
                                                                <div className="col-md-6">
                                                                    <input
                                                                        type="text"
                                                                        id="controller_name"
                                                                        className="form-control form-control-sm required controller_name"
                                                                        name="controller_name"
                                                                        value={controllerNameV.inputCNV}
                                                                        onChange={(cnv) => module_info_CNV_input_change('inputCNV', cnv.target.value)}
                                                                    />

                                                                </div>
                                                                <label className="col-form-label col-md-6">Method Name:</label>
                                                                <div className="col-md-6">
                                                                    <input type="text" name="method_name" className="form-control form-control-sm " id="method_name" placeholder="Enter Method Name" defaultValue={data.method_name} />
                                                                </div>
                                                                <label className="col-form-label col-md-6">Parent Id:</label>
                                                                <div className="col-md-6">
                                                                    <input type="number" step="1" name="parent_id" className="form-control form-control-sm " id="parent_id" placeholder="Enter Parent Id" defaultValue={data.parent_id} />
                                                                </div>
                                                                <label className="col-form-label col-md-6">Menu Type:</label>
                                                                <div className="col-md-6">
                                                                    <select required="" name="menu_type" className="form-control form-control-sm  trim" id="menu_type">
                                                                        {
                                                                            (data?.menu_type === 0) ? <>
                                                                                {menuType[0].map((md, index) =>
                                                                                    <option key={index} value='0'>{md.mt}</option>
                                                                                )}
                                                                            </> :
                                                                                (data?.menu_type === 1) ? <>
                                                                                    {menuType[1].map((md, index) =>
                                                                                        <option key={index} value='1'>{md.mt}</option>
                                                                                    )}
                                                                                </> :
                                                                                    <>
                                                                                        {menuType[2].map((md, index) =>
                                                                                            <option key={index} value='2'>{md.mt}</option>
                                                                                        )}
                                                                                    </>
                                                                        }

                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group row">
                                                                <label className="col-form-label col-md-5">Icon:</label>
                                                                <div className="col-md-7">
                                                                    <div className="input-group d-flex">
                                                                        <div className="input-group-append">
                                                                            <IconModal
                                                                                names="icon"
                                                                                index={index}
                                                                                Icon={data?.icon}
                                                                            ></IconModal>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <label className="col-form-label col-md-5">Btn:</label>
                                                                <div className="col-md-7">
                                                                    <input type="text" name="btn" className="form-control form-control-sm " id="btn" placeholder="Enter Btn" defaultValue={data.btn} />
                                                                </div>
                                                                <label className="col-form-label col-md-5">Default Page:</label>
                                                                <div className="col-md-7">
                                                                    <select name="default_page" className="form-control form-control-sm trim" id="default_page">
                                                                        {
                                                                            ((data?.default_page === 0)) ? <>
                                                                                {DefaultPage[0].map((dd, index) =>
                                                                                    <option key={index} defaultValue={index}>{dd.dp}</option>
                                                                                )}
                                                                            </> : <>
                                                                                {DefaultPage[1].map((dd, index) =>
                                                                                    <option key={index} defaultValue={index}>{dd.dp}</option>
                                                                                )}
                                                                            </>
                                                                        }

                                                                    </select>
                                                                </div>
                                                                <label className="col-form-label col-md-5">Page Group:</label>
                                                                <div className="col-md-7">
                                                                    <input
                                                                        type="text"
                                                                        id="page_group"
                                                                        className="form-control form-control-sm page_group"
                                                                        name="page_group"
                                                                        value={pageGroupV.inputPGV}
                                                                        onChange={(pgv) => module_info_PGV_input_change('inputPGV', pgv.target.value)}
                                                                    />
                                                                </div>
                                                                <label className="col-form-label col-md-5">Controller Background:</label>
                                                                <div className="col-md-7">
                                                                    <div className=' d-flex'>
                                                                        <input
                                                                            type="color"
                                                                            name="controller_bg"
                                                                            className="form-control form-control-sm "
                                                                            placeholder="Enter Controller bg"
                                                                            value={controllerBgV.inputCBV}
                                                                            onChange={(cbv) => module_info_CBV_input_change('inputCBV', cbv.target.value)}
                                                                        />
                                                                        <div className="sp-replacer sp-light"><div className="sp-preview"><div className="sp-preview-inner"></div></div><div className="sp-dd mt-1">▼</div></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group row">
                                                                <label className="col-form-label col-md-6">Page Group Icon:</label>
                                                                <div className="col-md-6">
                                                                    <div className="input-group d-flex">
                                                                        <div className="input-group-append">
                                                                            <IconModal
                                                                                names="page_group_icon"
                                                                                index={index}
                                                                                pageGroupIcons={data?.page_group_icon}
                                                                            ></IconModal>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <label className="col-form-label col-md-6">Controller Sort:</label>
                                                                <div className="col-md-6">
                                                                    <select required="" name="controller_sort" className="form-control form-control-sm controller_sort trim" id="controller_sort" value={controllerSortV.inputCS} onChange={(cs) => module_info_CS_input_change('inputCS', cs.target.value)}>

                                                                        {
                                                                            sortArr.map((d, ind) => <option key={ind} value={d}>{d}</option>)
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <label className="col-form-label col-md-6">Page Group Sort:</label>
                                                                <div className="col-md-6">
                                                                    <select
                                                                        required=""
                                                                        name="page_group_sort"
                                                                        className="form-control form-control-sm page_group_sort trim"
                                                                        id="page_group_sort"
                                                                        value={pageGroupSortV.inputPGS}
                                                                        onChange={(pgs) => module_info_PGS_input_change('inputPGS', pgs.target.value)}
                                                                    >
                                                                        {sortArr.map((d, ind) => (
                                                                            <option key={ind} value={d}>
                                                                                {d}
                                                                            </option>
                                                                        ))}
                                                                    </select>

                                                                </div>
                                                                <label className="col-form-label col-md-6">Method Sort:</label>
                                                                <div className="col-md-6">
                                                                    <select required="" name="method_sort" className="form-control form-control-sm method_sort trim" id="method_sort" defaultValue={data?.method_sort}>
                                                                        {
                                                                            sortArr.map((d, ind) => <option key={ind} value={ind}>{ind}</option>)
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <label className="col-form-label col-md-6">Controller Color:</label>
                                                                <div className="col-md-6">
                                                                    <div className=' d-flex'>
                                                                        <input
                                                                            type="color"
                                                                            name="controller_color"
                                                                            className="form-control form-control-sm "
                                                                            placeholder="Enter controller color"
                                                                            value={controllerColorV.inputCCV}
                                                                            onChange={(ccv) => module_info_CCV_input_change('inputCCV', ccv.target.value)}
                                                                        />
                                                                        <div className="sp-replacer sp-light"><div className="sp-preview"><div className="sp-preview-inner"></div></div><div className="sp-dd mt-1">▼</div></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }


                                    <div className="offset-md-3 col-sm-6 my-3 pb-5">
                                        <input type="submit" name="create" className="btn btn-success btn-sm" value="Submit" />
                                    </div>

                                </form>
                            </>
                        }

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPageEditAll;







