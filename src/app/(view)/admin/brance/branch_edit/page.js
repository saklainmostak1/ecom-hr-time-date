'use client'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import '../../../admin_layout/modal/fa.css'


const BranchUpdate = ({ id }) => {



      const [modified, setModified] = useState(() => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('userId') || '';
        }
        return '';
      });
    
      useEffect(() => {
        if (typeof window !== 'undefined') {
          const storedUserId = localStorage.getItem('userId');
          setModified(storedUserId);
        }
      }, []);

    const { data: brands = [], isLoading, refetch } = useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all`);
            const data = await res.json();
            // Filter out the brand with id 
            const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
            return filteredBrands;
        }
    });

    console.log(brands);

    const [brandSingle, setBrandSingle] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_all/${id}`)
            .then(Response => Response.json())
            .then(data => setBrandSingle(data))
    }, [id])

    console.log(brandSingle[0])


    const { data: companys = [],
    } = useQuery({
        queryKey: ['companys'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company/company_all`)

            const data = await res.json()
            return data
        }
    })

    const { data: companysType = []
    } = useQuery({
        queryKey: ['companysType'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company_type/company_type_all`)

            const data = await res.json()
            return data
        }
    })

    console.log(companys)


    const [brandData, setBrandData] = useState({
        company_id: '', company_type_id: '',
        branch_name: '', status_id: '', office_address: '', mobile: '', email: '', phone: '',
        modified_by: modified
    });

    useEffect(() => {

        setBrandData({

            company_id: brandSingle[0]?.company_id, 
            company_type_id: brandSingle[0]?.company_type_id,
            branch_name: brandSingle[0]?.branch_name, 
            status_id: brandSingle[0]?.status_id, 
            office_address: brandSingle[0]?.office_address, 
            mobile: brandSingle[0]?.mobile, 
            email: brandSingle[0]?.email, 
            phone: brandSingle[0]?.phone,
            modified_by: modified,

           
        });

    }, [brandSingle, modified]);

  

    const [sameBranchName, setSameBranchName] = useState([])
    const [branchName, setBranchName] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [status_id, setStatus_id] = useState([]);
    const [company_type_id, setCompany_type_id] = useState([]);
    const [office_address, setOffice_address] = useState([]);
    const [mobile, setMobile] = useState([]);
    const [email, setEmail] = useState([]);
    const [phone, setPhone] = useState([]);


    const brand_input_change = (event) => {
        const name = event.target.name
        const value = event.target.value
        const attribute = { ...brandData }
        attribute[name] = value

        const branch_name = attribute['branch_name']
        if (!branch_name) {
            setBranchName('Please  enter Branch name.');
        } else {
            setBranchName("");
        }
        const existingBrand = brands.find((brand) => brand?.branch_name?.toLowerCase() === brandData?.branch_name?.toLowerCase());
        if (!existingBrand) {
            // Show error message
            setSameBranchName("");
        }
       
        const company_name = attribute['company_id']
        if (!company_name || company_name === '') {
            setCompanyName('Please Select a Company name.');
        } else {
            setCompanyName("");
        }

        const company_type_id = attribute['company_type_id']
        if (!company_type_id || company_type_id === '') {
            setCompany_type_id('Please  enter Company Type name.');
        } else {
            setCompany_type_id("");
        }

        const status_id = attribute['status_id']
        if (!status_id || status_id === '') {
            setStatus_id('Please  enter Status name.');
        } else {
            setStatus_id("");
        }
        
       
        
        const office_address = attribute['office_address']
        if (!office_address || office_address === '') {
            setOffice_address('Please  enter Office Address name.');
        } else {
            setOffice_address("");
        }

        const mobile = attribute['mobile']
        if (!mobile || mobile === '') {
            setMobile('Please  enter Your Mobile Number.');
        } else {
            setMobile("");
        }
        
        const email = attribute['email']
        if (!email || email === '') {
            setEmail('Please  enter Your Email.');
        } else {
            setEmail("");
        }
        

        const phone = attribute['phone']
        if (!phone || phone === '') {
            setPhone('Please  enter Phone Number.');
        } else {
            setPhone("");
        }

        setBrandData(attribute)

    };

    const router = useRouter()
    const brand_update = async (e) => {
        e.preventDefault();
    
        if (!brandData.branch_name) {
            setBranchName('Please enter a Branch name.');
            return; // Prevent further execution
        }
        if (!brandData.company_id) {
            setCompanyName('Please select a Company Name.');
            return; // Prevent further execution
        }
        if (!brandData.company_type_id) {
            setCompany_type_id('Please enter a Company Type name.');
            return; // Prevent further execution
        }
        if (!brandData.status_id) {
            setStatus_id('Please enter a Status name.');
            return; // Prevent further execution
        }
        if (!brandData.office_address) {
            setOffice_address('Please enter an Office Address.');
            return; // Prevent further execution
        }
        if (!brandData.mobile) {
            setMobile('Please enter a Mobile Number.');
            return; // Prevent further execution
        }
        if (!brandData.email) {
            setEmail('Please enter an Email Address.');
            return; // Prevent further execution
        }
        if (!brandData.phone) {
            setPhone('Please enter a Phone Number.');
            return; // Prevent further execution
        }
    
        const existingBrand = brands.find((brand) => brand?.branch_name?.toLowerCase() === brandData?.branch_name?.toLowerCase());
        if (existingBrand) {
            setSameBranchName("Branch name already exists. Please choose a different Branch name.");
            return; // Prevent further execution
        }
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(brandData)
            });
    
            if (response.ok == true) {
                const data = await response.json();
                console.log(data);
    
                sessionStorage.setItem("message", "Data updated successfully!");
                router.push('/Admin/branch/branch_all');
            } else {
                console.error('Error updating brand:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating brand:', error);
        }
    };
    
    // const brand_update = (e) => {
    //     e.preventDefault()
    //     if (!brandData.branch_name) {
    //         setBranchName('Please enter a Branch name.');
    //         return; // Prevent further execution
    //     }
    //     if (!brandData.company_id) {
    //         setCompanyName('Please select a Company Name.');
    //         return; // Prevent further execution
    //     }

    //     if (!brandData.company_type_id) {
    //         setCompany_type_id('Please enter a Company Type name.');
    //         return; // Prevent further execution
    //     }

    //     if (!brandData.status_id) {
    //         setStatus_id('Please enter a Status name.');
    //         return; // Prevent further execution
    //     }

    //     if (!brandData.office_address) {
    //         setOffice_address('Please enter a Office Address name.');
    //         return; // Prevent further execution
    //     }

    //     if (!brandData.mobile) {
    //         setMobile('Please enter a Mobile Number.');
    //         return; // Prevent further execution
    //     }

    //     if (!brandData.email) {
    //         setEmail('Please enter a Email Address.');
    //         return; // Prevent further execution
    //     }

    //     if (!brandData.phone) {
    //         setPhone('Please enter a Phone Number.');
    //         return; // Prevent further execution
    //     }

    //     const existingBrand = brands.find((brand) => brand?.branch_name?.toLowerCase() === brandData?.branch_name?.toLowerCase());
    //     if (existingBrand) {
    //         // Show error message
    //         setSameBranchName("Branch name already exists. Please choose a different Branch name.");

    //     }

    //     // else {

    //         fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/branch/branch_edit/${id}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(brandData)
    //         })
    //             .then(response => {
    //                 response.json()
    //                 console.log(response)
    //             if(response.ok === true){
    //                 sessionStorage.setItem("message", "Data Update successfully!");
    //                 router.push('/Admin/branch/branch_all')

    //             }
    //             })
    //             .then(data => 
    //                 console.log(data)
    //                 // if (data.affectedRows > 0) {
    //                 //     sessionStorage.setItem("message", "Data Update successfully!");
    //                 //     // router.push('/Admin/branch/branch_all')

    //                 // }
    //                 // Handle success or show a success message to the user
    //             )
    //             .catch(error => {
    //                 console.error('Error updating brand:', error);
    //                 // Handle error or show an error message to the user
    //             });
    //     // }

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


    const [status, setStatus] = useState([]);
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
            .then(res => res.json())
            .then(data => setStatus(data))
    }, [])




    return (
        // col-md-12
        // <div class=" body-content bg-light">
        <div class="container-fluid">
            <div class=" row ">

                <div className='col-12 p-4'>
                    <div className='card'>
                        <div class=" border-primary shadow-sm border-0">
                            <div class="card-header py-1  custom-card-header clearfix bg-gradient-primary text-white">
                                <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">Update Branch</h5>
                                <div class="card-title font-weight-bold mb-0 card-header-color float-right">
                                    <Link href={`/Admin/branch/branch_all?page_group=${page_group}`} class="btn btn-sm btn-info">Back Branch List</Link></div>
                            </div>
                            <form action="" onSubmit={brand_update}>

                                <div class="card-body">
                                   

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Branch Name <small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="branch_name" defaultValue={brandData.branch_name} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Branch Name'
                                                maxLength={256}
                                            />

                                            {
                                                sameBranchName && <p className='text-danger'>{sameBranchName}</p>
                                            }
                                            {
                                                branchName && <p className='text-danger'>{branchName}</p>
                                            }
                                           

                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Company<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <select
                                                value={brandData.company_id} onChange={brand_input_change}
                                                name='company_id'

                                                class="form-control form-control-sm " placeholder="Enter Role Name">
                                                <option value=''>Select Company</option>
                                                {
                                                    companys.map(company =>
                                                        <>

                                                            <option value={company.id}>{company.company_name}</option>
                                                        </>

                                                    )
                                                }
                                            </select>
                                            {
                                                companyName && <p className='text-danger'>{companyName}</p>
                                            }
                                            
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Company Type<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <select
                                                value={brandData.company_type_id} onChange={brand_input_change}
                                                name='company_type_id'

                                                class="form-control form-control-sm " placeholder="Enter Role Name">
                                                <option value=''>Select Company Type</option>
                                                {
                                                    companysType.map(type =>
                                                        <>

                                                            <option value={type.id}>{type.company_type_name}</option>
                                                        </>

                                                    )
                                                }
                                            </select>

                                            {
                                                company_type_id && <p className='text-danger'>{company_type_id}</p>
                                            }
                                            
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Status<small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <select
                                                value={brandData.status_id} onChange={brand_input_change}
                                                name='status_id'

                                                class="form-control form-control-sm " placeholder="Enter Role Name">
                                                <option value=''>Select Status</option>
                                                {
                                                    status.map(sta =>
                                                        <>

                                                            <option value={sta.id}>{sta.status_name}</option>
                                                        </>

                                                    )
                                                }
                                            </select>

                                            {
                                                status_id && <p className='text-danger'>{status_id}</p>
                                            }
                                           
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Office Address <small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="office_address" defaultValue={brandData.office_address} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Office Address'
                                                maxLength={256}
                                            />
                                            {
                                                office_address && <p className='text-danger'>{office_address}</p>
                                            }

                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Mobile <small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="mobile" defaultValue={brandData.mobile} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter Mobile Number'
                                                maxLength={256}
                                            />
                                            {
                                                mobile && <p className='text-danger'>{mobile}</p>
                                            }

                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Email Address <small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="email" defaultValue={brandData.email} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter Email Address'
                                                maxLength={256}
                                            />
                                             {
                                                email && <p className='text-danger'>{email}</p>
                                            }
                                           

                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-form-label col-md-3"><strong>Phone <small><sup><small><i class="text-danger fas fa-star"></i></small></sup></small>:</strong></label>
                                        <div class="col-md-6">
                                            <input type="text" name="phone" defaultValue={brandData.phone} onChange={brand_input_change}
                                                class="form-control form-control-sm  required "
                                                placeholder='Enter Phone Number'
                                                maxLength={256}
                                            />
                                            {
                                                phone && <p className='text-danger'>{phone}</p>
                                            }

                                        </div>
                                    </div>


                                    <div className="form-group row">
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
    );
};

export default BranchUpdate;
