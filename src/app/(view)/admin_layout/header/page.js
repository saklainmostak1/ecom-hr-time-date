'use client' 
 //ismile

import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FaBars, FaTasks } from 'react-icons/fa';
import Link from 'next/link';
import './header.css'
import '../modal/fa.css'
import img2 from '../img/pathshala.jpg'

const AdminHeader = ({ toggleSidebar }) => {

    // useEffect(() => {
    //     const jQueryScript = document.createElement('script');
    //     jQueryScript.src = 'https://code.jquery.com/jquery-3.3.1.slim.min.js';
    //     jQueryScript.integrity = 'sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo';
    //     jQueryScript.crossOrigin = 'anonymous';
    //     jQueryScript.async = true;
    //     document.body.appendChild(jQueryScript);

    //     const bootstrapScript = document.createElement('script');

    //     bootstrapScript.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js';
    //     bootstrapScript.integrity = 'sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm';
    //     bootstrapScript.crossOrigin = 'anonymous';
    //     bootstrapScript.async = true;
    //     document.body.appendChild(bootstrapScript);

    //     return () => {

    //         document.body.removeChild(jQueryScript);
    //         document.body.removeChild(bootstrapScript);
    //     };
    // }, []);
    useEffect(() => {
        const loadScript = (src, integrity, crossOrigin) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.integrity = integrity;
                script.crossOrigin = crossOrigin;
                script.defer = true;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        };

        const loadScripts = async () => {
            try {
                await loadScript(
                    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
                    'sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo',
                    'anonymous'
                );

                await loadScript(
                    'https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js',
                    'sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm',
                    'anonymous'
                );
            } catch (error) {
                console.error('Error loading scripts:', error);
            }
        };

        loadScripts();
    }, []);

    // const [isHeaderActive, setIsHeaderActive] = useState(false);

    // const toggleHeader = () => {
    //     setIsHeaderActive(!isHeaderActive);
    // };

    //  id="navbar" className={`navbar ${isSidebarActive ? 'navbar-active' : ''} `}

    // toggleHeader={toggleHeader}


    // console.log(toggleHeader)

    const [templateSettings, setTemplateSettings] = useState([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/admin_panel_settings`)
            .then(Response => Response.json())
            .then(data => setTemplateSettings(data))
    }, [])

    console.log(templateSettings)
    const filteredCategories = templateSettings.filter(category => category.status === 1);
    console.log(filteredCategories[0]?.header_text_font)

    return (

        <nav className="navbar navbar-expand-lg header_background_color">
            <div className="container-fluid ">
                <button type="button" onClick={toggleSidebar} id="sidebarCollapse" className="btn btn-info d-lg-none mr-lg-5">
                    {/* <FaBars></FaBars> */}

                    <FaTasks></FaTasks>
                </button>
                {/* <div className='d-flex gap-3 mt-3'>
                    <div >
                        <img src="https://atik.urbanitsolution.com/files/logo/thumbnail/7632b474c6d5b78e3f6233a87461bf623f453c67.jpeg" className="img-fluid ${3|rounded-top,rounded-right,rounded-bottom,rounded-left,rounded-circle,|}" alt=""
                            width='40'
                        />
                    </div>
                    <div className='header_color' style={{ marginTop: '-8px', marginLeft: '10px' }}>
                        <h4 className='header-tag header_color'>Pathshala School & College
                        </h4>
                        <p style={{ marginTop: '-5px' }} className='project_name_color'><strong>College Management System</strong></p>
                    </div>
                </div> */}
                <div class="media">
                    <img onClick={toggleSidebar} class="align-self-center mr-3" src={img2.src} alt="Generic placeholder image" width={40} />
                    <div class="media-body">
                        <h4 className='mt-0 header-tag header_color header_text_font' style={{fontFamily: `${filteredCategories[0]?.header_text_font}`}}>Pathshala School & College
                        </h4>
                        <p className='mb-0'><strong>College Management System</strong></p>

                    </div>
                </div>
                <div>

                    <button

                        className="btn btn-dark d-inline-block d-lg-none ml-auto " type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <FaBars></FaBars>
                    </button>
                </div>


                <div className="collapse navbar-collapse  navbar-upper" id="navbarSupportedContent">


                    <div className=' mb-lg-0  w-100 '>
                        <ul className="nav float-md-right">
                            <li className="nav-item py-1 bg-light border rounded-circle mr-2"></li>
                            <li className="nav-item py-1 bg-light border rounded-circle mr-2 mx-2"></li>
                            <li className="nav-item py-1 bg-light border rounded-circle mr-2 ">
                                <Link href={`/Admin/admin_template/admin_template_edit/${filteredCategories[0]?.id}`} className="nav-link text-success">
                                    <FontAwesomeIcon icon={faCog} className="zt-1" />
                                </Link>
                            </li>
                            {/* <li className="nav-item py-1 bg-light border rounded-circle mr-2 mx-3">
                                <a className="nav-link text-danger" href="#">
                                    <FontAwesomeIcon icon={faCommentDots}
                                        className="zt-1 blink_me" />

                                    <span className=" iconBotton badge badge-danger badge-pill position-absolute bg-danger">0</span>
                                </a>
                            </li> */}
                            <li className="nav-item py-1 bg-light border rounded-circle mr-2 mx-3">
                                <a className="nav-link text-danger" href="#">
                                    <FontAwesomeIcon icon={faCommentDots} className="zt-1 blink_me" />
                                    <span className="iconBotton badge badge-danger badge-pill position-absolute bg-danger">0</span>
                                </a>
                            </li>

                            {/* <li className="nav-item py-1 bg-light border rounded-circle">
                                <a className="nav-link text-secondary" href="#">
                                <i class="far fa-bell zt-1 swingimage"></i>
                                    <span className="iconBotton badge badge-danger badge-pill  position-absolute bg-danger mb-5">0</span>
                                </a>
                            </li> */}
                            <li className="nav-item py-1 bg-light border rounded-circle">
                                <a className="nav-link text-secondary" href="#">
                                    <i className="far fa-bell zt-1 swingimage"></i>
                                    <span className="iconBotton badge badge-danger badge-pill position-absolute bg-danger mb-5">0</span>
                                </a>
                            </li>

                        </ul>
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default AdminHeader