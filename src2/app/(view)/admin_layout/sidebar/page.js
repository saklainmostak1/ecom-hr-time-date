'use client' 
 //ismile
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import './pageStyle.css'
import { useQuery } from '@tanstack/react-query';
import { FaAngleDown, FaAngleRight, FaBars, FaKey, FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
import AdminHeader from '../header/page';
import { FaCaretDown } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import ContentLoader from 'react-content-loader';
import { useEffect } from 'react';
import AdminHome from '../../admin/admin_home/page';






const AdminSidebar = ({ isSidebarActive, child, toggleSidebar, props }) => {

  const router = useRouter()



  const [usersId, setUsersId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId') || '';
    }
    return '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      setUsersId(storedUserId);
    }
  }, []);



  const { data: allSideNavDatas = [], isLoading, refetch } = useQuery({
    queryKey: ['allSideNavData'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${usersId}/role`);
      const data = await res.json();

      return data;
    },
  });
  // ${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${usersId}/role

  // const [intervalId, setIntervalId] = useState(null);

  // // Fetching the data using react-query
  // const { data: allSideNavDatas = [], isLoading, refetch } = useQuery({
  //   queryKey: ['allSideNavData'],
  //   queryFn: async () => {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${usersId}/role`);
  //     const data = await res.json();
  //     return data;
  //   },
  // });

  // useEffect(() => {
  //   // Set up the interval to refetch data every 1 second
  //   const id = setInterval(() => {
  //     refetch();  // Refetch data every second
  //   }, 1000);

  //   // Store interval ID to clear it later
  //   setIntervalId(id);

  //   // Clear the interval on component unmount
  //   return () => {
  //     clearInterval(id);
  //   };
  // }, [refetch]);


  const allSideNavData = allSideNavDatas?.map(group => ({
    ...group,
    controllers: group.controllers.map(controller => ({
      ...controller,
      display_names: controller.display_names.filter(display => display.menu_type === 1)
    }))
  }));

  // console.log(allSideNavData);



  const filteredData = allSideNavData?.map(navData => navData?.controllers.map(controller => controller.display_names.map(displayName => displayName.method_id === 3222)))

  // console.log(filteredData);

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/allUser`);
      const data = await res.json();

      return data;
    },
  });

  const filteredUsers = users.filter(user => user.id === 1);

  // console.log(filteredUsers);


  const [clickedButtons, setClickedButtons] = useState(new Array(allSideNavData.length).fill(false));



  const handleClick = (index) => {
    const updatedClickedButtons = [...clickedButtons];
    updatedClickedButtons[index] = !updatedClickedButtons[index];
    setClickedButtons(updatedClickedButtons);
  };



  const formatString = (str) => {
    const words = str?.split('_');

    const formattedWords = words?.map((word) => {
      const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      return capitalizedWord;
    });

    return formattedWords?.join(' ');
  };

  const convertToCamelCase = (input) => {
    return input.toLowerCase().replace(/ /g, '_');
  };


  const [pageGroup, setPageGroup] = useState('')
  // console.log(pageGroup)

  const [controllerName, setControllerName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('controllerName') || '';
    }
    return '';
  });


  const handleLinkClick = (selectedPageGroup, controllerName) => {

    
    // Save the selected pageGroup to local storage.
    if (typeof window !== 'undefined') {

      sessionStorage.setItem('controllerName', controllerName)
      localStorage.setItem('pageGroup', selectedPageGroup);
    }
    setControllerName(controllerName)
    setPageGroup(selectedPageGroup);


  };





  const [displayNames, setDisplayNames] =  useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('displayName') || '';
    }
    return '';
  });


  const handleDisplayName = (displayNames, controllerName) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('controllerName', controllerName)
      sessionStorage.setItem('displayName', displayNames)
    }
    setDisplayNames(displayNames)
    setControllerName(controllerName)
  }

  // console.log(displayNames, 'displayNames')


  const [page_group, setPage_group] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pageGroup') || '';
    }
    return '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const interval = setInterval(() => {
        const storedPageGroup = localStorage.getItem('pageGroup');
        setPage_group(storedPageGroup || '');
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);


  const [controllerNames, setControllerNames] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('controllerName') || '';
    }
    return '';
  });


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const interval = setInterval(() => {
      const controllerNames = sessionStorage.getItem('controllerName')

      setControllerNames(controllerNames);
    }, 100);

    return () => clearInterval(interval);
    }
  }, []);

  // console.log(controllerNames)




  const filterUser = allSideNavData?.filter(u => u.page_group === page_group)

  // console.log(filterUser[0]?.controllers, 'filterUser[0]?.controllers')

  const pageGroupNav = filterUser[0]?.controllers
  // const displayNames = (pageGroupNav?.map(paegGroups => paegGroups.display_names.map(displayName => displayName.display_name)))
  // console.log(pageGroupNav?.map(paegGroups => paegGroups.display_names.map(displayName => displayName.display_name)))



  const handleLogout = () => {
    if (typeof window !== 'undefined') {

      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRoleName');
      localStorage.removeItem('pageGroup');
      localStorage.removeItem('countdown');
      sessionStorage.removeItem('controllerName')

    }
    router.push(`/`);

  };



  const [userRoleName, setUserRoleName] = useState('')


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRoleName = localStorage.getItem('userRoleName');

      setUserRoleName(userRoleName)
    }
  }, []);

  const [userName, setUserName] = useState('')


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userName = localStorage.getItem('userName');

      setUserName(userName)
    }
  }, []);


  const [userEmail, setUserEmail] = useState('')


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userEmail = localStorage.getItem('userEmail');
      setUserEmail(userEmail)
    }
  }, []);


  // console.log(pageGroupNav, 'pageGroupNav')


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const toggleMenu = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom,
      left: rect.right,
    });
    setIsMenuOpen(!isMenuOpen);
  };


  const handleDashboardClick = () => {

    // if (typeof window !== 'undefined') {
      sessionStorage.removeItem('pageGroup');
      localStorage.removeItem('pageGroup');
      sessionStorage.removeItem('controllerName');
    // }
    handleLinkClick('')
    // localStorage.clear();
  };

  useEffect(() => {

    if (typeof window !== 'undefined') {
      if (window?.location?.pathname === "/Admin/dashboard") {
        localStorage.removeItem('pageGroup');
        // localStorage.clear();
        sessionStorage.removeItem('pageGroup');
        sessionStorage.removeItem('controllerName')
      }
    }
  }, []);




  // console.log(controllerName, 'controllerName')




  const [userId, setuserId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId') || '';
    }
    return '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      setuserId(storedUserId);
    }
  }, []);

  // const [loading, setLoading] = useState(false)
  // useEffect(() => {
  //   setLoading(true)
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 2000)
  // }, [])

  const [sideNav, setSideNav] = useState([])


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/admin_panel_settings`)
      .then(Response => Response.json())
      .then(data => setSideNav(data))
  }, [])
  // console.log(sideNav)

  const filteredCategories = sideNav.filter(category => category.status === 1);
  // console.log(filteredCategories[0]?.admin_template, 'filteredCategories[0]?.admin_template')

  // const wrapperStyle = {
  //   flexDirection: filteredCategories[0]?.side_menu_position === 'right' ? 'row-reverse' : 'row'
  // };
  const wrapperStyle = {
    display: 'flex',
    flexDirection: (() => {
      const position = filteredCategories[0]?.side_menu_position;
      if (position === 'top') return 'column';
      if (position === 'bottom') return 'column-reverse';
      if (position === 'right') return 'row-reverse';
      return 'row'; // Default to 'row' for 'left' or undefined
    })()
  };

  console.log(filteredCategories[0]?.side_menu_position)
  
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    // if (window.pageYOffset > 300) {
    //   setIsVisible(true);
    // } else {
    //   setIsVisible(false);
    // }
  };

  // Scroll the window to the top
  const scrollToTop = () => {
    // window.scrollTo({
    //   top: 0,
    //   behavior: 'smooth'
    // });
  };

  useEffect(() => {
    // window.addEventListener('scroll', toggleVisibility);

    // return () => {
    //   window.removeEventListener('scroll', toggleVisibility);
    // };
  }, []);


  return (
    <div class="wrapper w-100" style={wrapperStyle}>

      {filteredCategories[0]?.side_menu_position === 'top' ? (
        <div className='sticky-top'>
          {allSideNavData && (
            <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light sub_header_background_color">
              <div className="container-fluid">
                {/* <Link className="navbar-brand " style={{ color: '#4267b2' }} href="">{formatString(page_group)}</Link> */}
                <button
                  className="btn btn-dark d-inline-block d-lg-none ml-auto"
                  type="button"
                  data-toggle="collapse"
                  data-target="#customNavbarCollapse1"
                  aria-controls="customNavbarCollapse1"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <FaBars />
                </button>
                <div className="collapse navbar-collapse" id="customNavbarCollapse1">
                  {/* ml-auto */}
                  <ul className="nav navbar-nav">
                    {allSideNavData?.map((page, index) => (
                      <div key={index} className="ml-0 dropdown">
                        <li className="nav-item active">
                          <Link className="nav-link" href="">
                            {formatString(page?.page_group)}
                            <FaCaretDown />
                          </Link>
                        </li>
                        <ul className="dropdown-menu nav-item active ml-0">
                          {page.controllers.map((displayNames, subIndex) => (
                            <li key={subIndex} className="dropdown-submenu">
                              <Link href="" className="dropdown-item">
                                {formatString(displayNames.controller_name)}
                              </Link>
                              <ul className="dropdown-menu" >
                                {displayNames.display_names.map((displayName, nestedIndex) => (
                                  <li key={nestedIndex}>
                                    <Link href={`/Admin/${displayNames?.controller_name}/${displayName.method_names}?page_group=${page_group}`} className="dropdown-item">
                                      {formatString(displayName.display_name)}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            </nav>
          )}
        </div>


      

      ) : (
        <>
          {
            filteredCategories[0]?.left_menu === 1 ?
              // style={sidebarStyle}
              <nav id="sidebar" className={`sidebar ${isSidebarActive ? 'active' : ''} side_menu_bg`} >
                <div className="sidebar-header mt-2 side_menu_bg" >
                  <div></div>
                  <div className="media d-flex " style={{ marginLeft: '6px' }}>
                    <img
                      className="rounded-circle mt-2"
                      src="https://atik.urbanitsolution.com/web_content/img/user.png"
                      alt=""
                      width="50"
                      height="50"
                    />
                    <div className="position-relative">
                      <div className='sideLine  ' style={{ marginTop: '14px', marginLeft: '5px' }} onClick={(e) => toggleMenu(e)}>
                        <h6 className='mt-1'>
                          <span className='admin-text'>{userName}</span>
                          <p className='admin-subtext'>{userRoleName}
                            <FaCaretDown></FaCaretDown>
                          </p>
                        </h6>
                      </div>
                      {isMenuOpen && (
                        <div className='position-absolute bg-light text-dark' style={{ top: menuPosition.top, right: menuPosition.right }}>

                          <div class="dropdown-menu show btn" aria-labelledby="dropdownMenuButton" x-placement="bottom-start">
                            <a class="dropdown-item" href={`/Admin/users/edit_users/${userId}`}>
                              <FaUserEdit></FaUserEdit> Edit Profile
                            </a>

                            <a class="dropdown-item " >

                              <FaKey></FaKey>

                              Change Password
                            </a>

                            {
                              userEmail &&
                              <a onClick={handleLogout} class="dropdown-item" >
                                <FaSignOutAlt></FaSignOutAlt> Log Out
                              </a>
                            }
                          </div>
                        </div>

                      )}
                    </div>


                  </div>

                </div>


                <ul className="text-white" style={{ marginTop: '-5px' }}>
                  <button className='dashboard p-2 side_menu_bg'>
                    <Link onClick={handleDashboardClick} className='' href='/Admin/dashboard'>
                      Dashboard
                    </Link>
                  </button>
                  {

                    allSideNavData?.map((group, index) => (
                      <li key={group?.page_group_id} className=''>
                        <button
                          className={`dashboard-dropdown ${clickedButtons[index] ? 'clicked' : ''} side_menu_l1_bg`}
                          onClick={() => handleClick(index)}
                        >
                          <Link
                            onClick={() => handleLinkClick((group?.page_group))}
                            // onClick={() => handleLinkClicks((group?.page_group))}
                            href={`/Admin/Admin_page_group/Admin_page_group_all?page_group=${group?.page_group}`}

                          >
                            <div className="d-flex justify-content-between ">
                              {formatString(group?.page_group)}

                            </div>
                          </Link>
                          <ul style={{ background: '#314B81' }} >

                          </ul>

                        </button>
                      </li>
                    ))}
                </ul>


              </nav>

              :
              <>

                {
                  isLoading ?
                  <div style={{width:'320px', }} className='overflow-hidden'>
                    
                  <ContentLoader
                  className='mt-2 ml-2'
                  style={{marginBottom:"-80px"}}
   speed={2}
   backgroundColor="#f5f5f5"
   foregroundColor="#ebebeb"
   {...props}
>
 
 <rect x="0" y="0" rx="35" ry="35" width="70" height="70" /> 
  <rect x="80" y="17" rx="4" ry="4" width="100" height="13" />
  <rect x="80" y="40" rx="3" ry="3" width="100" height="10" />
 
</ContentLoader>

<ContentLoader
speed={2}
viewBox="0 0 300 900"
backgroundColor="#f5f5f5"
foregroundColor="#ebebeb"
{...props}
>
<rect x="22" y="20" rx="0" ry="0" width="129" height="23" />
<rect x="35" y="76" rx="4" ry="4" width="81" height="9" />
<rect x="271" y="22" rx="4" ry="4" width="18" height="18" />
<rect x="186" y="76" rx="4" ry="4" width="81" height="9" />
<rect x="150" y="63" rx="0" ry="0" width="2" height="44" />
<rect x="6" y="104" rx="0" ry="0" width="144" height="3" />
<rect x="152" y="106" rx="0" ry="0" width="145" height="1" />

<rect x="28" y="127" rx="4" ry="4" width="243" height="31" />
<rect x="62" y="188" rx="4" ry="4" width="148" height="19" />

<circle cx="39" cy="197" r="10" />
<circle cx="39" cy="247" r="10" />
<circle cx="39" cy="297" r="10" />
<circle cx="39" cy="347" r="10" />

<rect x="64" y="237" rx="4" ry="4" width="148" height="19" />
<rect x="65" y="287" rx="4" ry="4" width="148" height="19" />
<rect x="64" y="337" rx="4" ry="4" width="148" height="19" />


<circle cx="39" cy="397" r="10" />
<circle cx="39" cy="447" r="10" />
<circle cx="39" cy="497" r="10" />
<circle cx="39" cy="547" r="10" />

<rect x="64" y="387" rx="4" ry="4" width="148" height="19" />
<rect x="64" y="437" rx="4" ry="4" width="148" height="19" />
<rect x="64" y="487" rx="4" ry="4" width="148" height="19" />
<rect x="64" y="537" rx="4" ry="4" width="148" height="19" />


<circle cx="39" cy="597" r="10" />
<circle cx="39" cy="647" r="10" />
<circle cx="39" cy="697" r="10" />
<circle cx="39" cy="747" r="10" />
<circle cx="39" cy="797" r="10" />
<circle cx="39" cy="847" r="10" />
<circle cx="39" cy="897" r="10" />
<circle cx="39" cy="947" r="10" />
<circle cx="39" cy="997" r="10" />
<circle cx="39" cy="1047" r="10" />

<rect x="64" y="587" rx="4" ry="4" width="148" height="19" />
<rect x="64" y="637" rx="4" ry="4" width="148" height="19" />
<rect x="64" y="687" rx="4" ry="4" width="148" height="19" />
<rect x="64" y="737" rx="4" ry="4" width="148" height="19" />
<rect x="64" y="787" rx="4" ry="4" width="148" height="19" />
<rect x="64" y="837" rx="4" ry="4" width="148" height="19" />
<rect x="64" y="887" rx="4" ry="4" width="148" height="19" />
<rect x="64" y="937" rx="4" ry="4" width="148" height="19" />
<rect x="64" y="987" rx="4" ry="4" width="148" height="19" />
<rect x="64" y="1037" rx="4" ry="4" width="148" height="19" />
</ContentLoader>


                  </div>
                    :
                    <>
                      <nav id="sidebar" className={`sidebar ${isSidebarActive ? 'active' : ''} side_menu_bg custom-sidebar`}>
                        <div className="sidebar-header mt-2 side_menu_bg" >
                          <div></div>
                          <div className="media d-flex " style={{ marginLeft: '6px' }}>
                            <img
                              className="rounded-circle mt-2"
                              src="https://atik.urbanitsolution.com/web_content/img/user.png"
                              alt=""
                              width="50"
                              height="50"
                            />
                            <div className="position-relative">
                              <div className='sideLine  ' style={{ marginTop: '14px', marginLeft: '5px' }} onClick={(e) => toggleMenu(e)}>
                                <h6 className='mt-1'>
                                  <span className='admin-text'>{userName}</span>
                                  <p className='admin-subtext'>{userRoleName}
                                    <FaCaretDown></FaCaretDown>
                                  </p>
                                </h6>
                              </div>
                              {isMenuOpen && (
                                <div className='position-absolute bg-light text-dark' style={{ top: menuPosition.top, right: menuPosition.right }}>

                                  <div class="dropdown-menu show btn" aria-labelledby="dropdownMenuButton" x-placement="bottom-start">
                                    <Link class="dropdown-item" href={`/Admin/users/edit_users/${userId}`}>
                                      <FaUserEdit></FaUserEdit> Edit Profile
                                    </Link>

                                    <Link class="dropdown-item " href={`/Admin/users/change_password/${userId}`}>

                                      <FaKey></FaKey>

                                      Change Password
                                    </Link>

                                    {
                                      userEmail &&
                                      <a onClick={handleLogout} class="dropdown-item" >
                                        <FaSignOutAlt></FaSignOutAlt> Log Out
                                      </a>
                                    }
                                  </div>
                                </div>

                              )}
                            </div>


                          </div>

                        </div>


                        <ul className="text-white" style={{ marginTop: '-5px' }}>
                          {/* side_menu_bg */}
                          <button className='dashboard p-2 ' >
                            <Link onClick={handleDashboardClick} className='' href='/Admin/dashboard'>

                              Dashboard
                            </Link>
                          </button>
                          {

                            allSideNavData?.map((group, index) => (
                              <li key={group?.page_group_id} className=''>
                                <button

                                  className={`dashboard-dropdown ${clickedButtons[index] ? 'clicked' : ''} side_menu_l1_bg px-0`}
                                  onClick={() => handleClick(index)}
                                >
                                  <a
                                    href={`#${group?.page_group}`}
                                    data-toggle="collapse"
                                    aria-expanded="false"
                                    className='ml-1'
                                  >
                                    <div className="d-flex justify-content-between ">
                                      {formatString(group?.page_group)}
                                      <div>
                                        {clickedButtons[index] ? <FaAngleDown /> : <FaAngleRight />}
                                      </div>
                                    </div>
                                  </a>
                                  <ul className={`collapse list-unstyled ${page_group === group?.page_group ? 'show' : ''} `} style={{ background: '#3b5998' }} id={group?.page_group}>

                                    <li className=''>

                                      {group?.controllers?.map((d, index) => (
                                        <div key={d.controller_name}>
                                          <a href={`#${group.page_group}-${d.controller_name}`} data-toggle="collapse" aria-expanded="false" className="side_menu_l2_bg borderBottom"


                                          >
                                            <div className='d-flex justify-content-between ml-3'>
                                              {formatString(d.controller_name)}
                                              <div>
                                                {clickedButtons[index] ? <FaAngleDown /> : <FaAngleRight />}
                                              </div>
                                            </div>
                                          </a>
                                          <ul className={`collapse list-unstyled ${controllerNames === d?.controller_name ? 'show' : ''} `} style={{ background: '#314B81' }} id={`${group.page_group}-${d.controller_name}`}>

                                            <li


                                              onClick={() => handleLinkClick((group?.page_group), (d?.controller_name))}>

                                              {d.display_names.map((displayName, di) => (

                                                <Link

                                                  onClick={() => handleDisplayName(displayName.display_name)}
                                                  className='border-bottom1 side_menu_l3_bg '
                                                  key={di}

                                                  href={`/Admin/${d?.controller_name}/${displayName.method_names}?page_group=${group?.page_group}`}
                                                >
                                                  <div className='ml-4'>
                                                    {displayName.display_name}

                                                  </div>

                                                </Link>
                                              ))}
                                            </li>
                                          </ul>
                                        </div>
                                      ))}
                                    </li>
                                  </ul>
                                </button>
                              </li>
                            ))}
                        </ul>


                      </nav>

                    </>
                    
  //                   <div style={{width:'320px' }} className='overflow-hidden'>
                    
  //                   <ContentLoader
  //                   className='mt-2 ml-2'
  //                   style={{marginBottom:"-80px"}}
  //    speed={2}
  //    backgroundColor="#f5f5f5"
  //    foregroundColor="#ebebeb"
  //    {...props}
  // >
   
  //  <rect x="0" y="0" rx="35" ry="35" width="70" height="70" /> 
  //   <rect x="80" y="17" rx="4" ry="4" width="80" height="13" />
  //   <rect x="80" y="40" rx="3" ry="3" width="140" height="10" />
   
  // </ContentLoader>
  
  // <ContentLoader
  // speed={2}
  // viewBox="0 0 300 700"
  // backgroundColor="#f5f5f5"
  // foregroundColor="#ebebeb"
  // {...props}
  // >
  // <rect x="22" y="20" rx="0" ry="0" width="129" height="23" />
  // <rect x="35" y="76" rx="4" ry="4" width="81" height="9" />
  // <rect x="271" y="22" rx="4" ry="4" width="18" height="18" />
  // <rect x="186" y="76" rx="4" ry="4" width="81" height="9" />
  // <rect x="150" y="63" rx="0" ry="0" width="2" height="44" />
  // <rect x="6" y="104" rx="0" ry="0" width="144" height="3" />
  // <rect x="152" y="106" rx="0" ry="0" width="145" height="1" />
  
  // <rect x="28" y="127" rx="4" ry="4" width="243" height="31" />
  // <rect x="62" y="188" rx="4" ry="4" width="148" height="19" />
  
  // <circle cx="39" cy="197" r="10" />
  // <circle cx="39" cy="247" r="10" />
  // <circle cx="39" cy="297" r="10" />
  // <circle cx="39" cy="347" r="10" />
  
  // <rect x="64" y="237" rx="4" ry="4" width="148" height="19" />
  // <rect x="65" y="287" rx="4" ry="4" width="148" height="19" />
  // <rect x="64" y="337" rx="4" ry="4" width="148" height="19" />
  
  
  // <circle cx="39" cy="397" r="10" />
  // <circle cx="39" cy="447" r="10" />
  // <circle cx="39" cy="497" r="10" />
  // <circle cx="39" cy="547" r="10" />
  
  // <rect x="64" y="387" rx="4" ry="4" width="148" height="19" />
  // <rect x="64" y="437" rx="4" ry="4" width="148" height="19" />
  // <rect x="64" y="487" rx="4" ry="4" width="148" height="19" />
  // <rect x="64" y="537" rx="4" ry="4" width="148" height="19" />
  
  
  // <circle cx="39" cy="597" r="10" />
  // <circle cx="39" cy="647" r="10" />
  // <circle cx="39" cy="697" r="10" />
  // <circle cx="39" cy="747" r="10" />
  // <circle cx="39" cy="797" r="10" />
  // <circle cx="39" cy="847" r="10" />
  // <circle cx="39" cy="897" r="10" />
  // <circle cx="39" cy="947" r="10" />
  // <circle cx="39" cy="997" r="10" />
  // <circle cx="39" cy="1047" r="10" />
  
  // <rect x="64" y="587" rx="4" ry="4" width="148" height="19" />
  // <rect x="64" y="637" rx="4" ry="4" width="148" height="19" />
  // <rect x="64" y="687" rx="4" ry="4" width="148" height="19" />
  // <rect x="64" y="737" rx="4" ry="4" width="148" height="19" />
  // <rect x="64" y="787" rx="4" ry="4" width="148" height="19" />
  // <rect x="64" y="837" rx="4" ry="4" width="148" height="19" />
  // <rect x="64" y="887" rx="4" ry="4" width="148" height="19" />
  // <rect x="64" y="937" rx="4" ry="4" width="148" height="19" />
  // <rect x="64" y="987" rx="4" ry="4" width="148" height="19" />
  // <rect x="64" y="1037" rx="4" ry="4" width="148" height="19" />
  // </ContentLoader>
  
  
  //                   </div>



                }
              </>

          }
        </>

      )
      }




      <div id="content " className='w-100 body_bg'>
        <AdminHeader toggleSidebar={toggleSidebar}></AdminHeader>

        {/* className='sticky-top'  */}
        {/* <div className=''> */}
          {
            pageGroupNav &&
            // sticky-top
            <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light sub_header_background_color">
              <div className="container-fluid" >
                <Link className="navbar-brand sub_header_pg_text_color" style={{ color: '#4267b2' }} href="">{formatString(page_group)}</Link>
                <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#customNavbarCollapse" aria-controls="customNavbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                  <FaBars></FaBars>
                </button>
                <div className="collapse navbar-collapse " id="customNavbarCollapse">
                  {/* ml-auto */}
                  <ul class=" nav navbar-nav  ">
                    {
                      pageGroupNav?.map(page =>
                        <>
                          <div class=" ml-0 dropdown sub_header_controller_text_color" >

                            <li className="nav-item active
                            "

                            >
                              <Link className="nav-link" href=""


                                style={{
                                  color: controllerNames === page?.controller_name ? '#28a745' : 'inherit',
                                  fontWeight: controllerNames === page?.controller_name ? '600' : 'normal',
                                }}
                              >{formatString(page?.controller_name)}

                                <FaCaretDown></FaCaretDown>
                              </Link>
                            </li>
                            <ul class="dropdown-menu nav-item active ml-0 " aria-labelledby="dropdownMenuButton">
                              {
                                page.display_names.map(displayNames =>

                                  <>

                                    <li

                                    ><Link

                                      onClick={() => handleDisplayName((displayNames.display_name), (page?.controller_name))}
                                      class="dropdown-item" href={`/Admin/${page?.controller_name}/${displayNames.method_names}?page_group=${page_group}`}>{displayNames.display_name}

                                      </Link></li>
                                  </>
                                )
                              }

                            </ul>
                          </div>
                        </>
                      )}

                  </ul>

                </div>
              </div>
            </nav>
          }

          {/* px-md-4 py-md-5 px-lg-4 py-lg-5 px-2 py-2 */}
          {/* body_bg */}
          {/* <div className=''> */}
            {
              isLoading  ?

                <ContentLoader

                  viewBox="0 0 1000 550"
                  backgroundColor="#eaeced"
                  foregroundColor="#ffffff"
                  {...props}
                >
                  <rect x="51" y="45" rx="3" ry="3" width="906" height="17" />
                  <circle cx="879" cy="123" r="11" />
                  <circle cx="914" cy="123" r="11" />
                  <rect x="104" y="115" rx="3" ry="3" width="141" height="15" />
                  <rect x="305" y="114" rx="3" ry="3" width="299" height="15" />
                  <rect x="661" y="114" rx="3" ry="3" width="141" height="15" />
                  <rect x="55" y="155" rx="3" ry="3" width="897" height="2" />
                  <circle cx="880" cy="184" r="11" />
                  <circle cx="915" cy="184" r="11" />
                  <rect x="105" y="176" rx="3" ry="3" width="141" height="15" />
                  <rect x="306" y="175" rx="3" ry="3" width="299" height="15" />
                  <rect x="662" y="175" rx="3" ry="3" width="141" height="15" />
                  <rect x="56" y="216" rx="3" ry="3" width="897" height="2" />
                  <circle cx="881" cy="242" r="11" />
                  <circle cx="916" cy="242" r="11" />
                  <rect x="106" y="234" rx="3" ry="3" width="141" height="15" />
                  <rect x="307" y="233" rx="3" ry="3" width="299" height="15" />
                  <rect x="663" y="233" rx="3" ry="3" width="141" height="15" />
                  <rect x="57" y="274" rx="3" ry="3" width="897" height="2" />
                  <circle cx="882" cy="303" r="11" />
                  <circle cx="917" cy="303" r="11" />
                  <rect x="107" y="295" rx="3" ry="3" width="141" height="15" />
                  <rect x="308" y="294" rx="3" ry="3" width="299" height="15" />
                  <rect x="664" y="294" rx="3" ry="3" width="141" height="15" />
                  <rect x="58" y="335" rx="3" ry="3" width="897" height="2" />
                  <circle cx="881" cy="363" r="11" />
                  <circle cx="916" cy="363" r="11" />
                  <rect x="106" y="355" rx="3" ry="3" width="141" height="15" />
                  <rect x="307" y="354" rx="3" ry="3" width="299" height="15" />
                  <rect x="663" y="354" rx="3" ry="3" width="141" height="15" />
                  <rect x="57" y="395" rx="3" ry="3" width="897" height="2" />
                  <circle cx="882" cy="424" r="11" />
                  <circle cx="917" cy="424" r="11" />
                  <rect x="107" y="416" rx="3" ry="3" width="141" height="15" />
                  <rect x="308" y="415" rx="3" ry="3" width="299" height="15" />
                  <rect x="664" y="415" rx="3" ry="3" width="141" height="15" />
                  <rect x="55" y="453" rx="3" ry="3" width="897" height="2" />
                  <rect x="51" y="49" rx="3" ry="3" width="2" height="465" />
                  <rect x="955" y="49" rx="3" ry="3" width="2" height="465" />
                  <circle cx="882" cy="484" r="11" />
                  <circle cx="917" cy="484" r="11" />
                  <rect x="107" y="476" rx="3" ry="3" width="141" height="15" />
                  <rect x="308" y="475" rx="3" ry="3" width="299" height="15" />
                  <rect x="664" y="475" rx="3" ry="3" width="141" height="15" />
                  <rect x="55" y="513" rx="3" ry="3" width="897" height="2" />
                  <rect x="52" y="80" rx="3" ry="3" width="906" height="17" />
                  <rect x="53" y="57" rx="3" ry="3" width="68" height="33" />
                  <rect x="222" y="54" rx="3" ry="3" width="149" height="33" />
                  <rect x="544" y="55" rx="3" ry="3" width="137" height="33" />
                  <rect x="782" y="56" rx="3" ry="3" width="72" height="33" />
                  <rect x="933" y="54" rx="3" ry="3" width="24" height="33" />
                </ContentLoader>

                :

                <>

                

                  {child}
                  <div>
      {isVisible && (
        <button 
          className="btn btn-primary rounded-circle"
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '30px',
            zIndex: 1000,
          }}
        >
          <i className="fa fa-arrow-up"></i>
        </button>
      )}
    </div>
                
                  <div className='d-flex justify-content-between px-4 mt-5 '>
                    <div>
                      <ul class="navbar-nav mr-auto">
                        <li class="nav-item active float-left text-center">
                          <a class="nav-link text-success" href="https://atik.urbanitsolution.com/" target="_blank"> All Rights Reserved <br /><strong>Pathshala School & College</strong> </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <ul class="navbar-nav">
                        <li class="nav-item active float-left text-center">
                          <a class="nav-link text-danger" href="http://urbanitsolution.com" target="_blank">Developed & Maintenance by <br /><strong>Urban IT Solution</strong>  </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
                

            }

          {/* </div> */}

        {/* </div> */}


      </div>

    </div>

  );
}

export default AdminSidebar;



// 'use client' 
 //ismile
// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Link from 'next/link';
// import './pageStyle.css'
// import { useQuery } from '@tanstack/react-query';
// import { FaAngleDown, FaAngleRight, FaBars, FaKey, FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
// import AdminHeader from '../header/page';
// import { FaCaretDown } from "react-icons/fa";
// import { useRouter } from 'next/navigation';
// import ContentLoader from 'react-content-loader';
// import { useEffect } from 'react';






// const AdminSidebar = ({ isSidebarActive, child, toggleSidebar, props }) => {

//   const router = useRouter()


//   // const usersId = localStorage.getItem('userId')
//   // console.log(usersId)

//   const [usersId, setUsersId] = useState(() => {
//     if (typeof window !== 'undefined') {
//       return localStorage.getItem('userId') || '';
//     }
//     return '';
//   });

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const storedUserId = localStorage.getItem('userId');
//       setUsersId(storedUserId);
//     }
//   }, []);

//   const { data: allSideNavDatas = [], isLoading, refetch } = useQuery({
//     queryKey: ['allSideNavData'],
//     queryFn: async () => {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${usersId}/role`);
//       const data = await res.json();

//       return data;
//     },
//   });

//   const allSideNavData = allSideNavDatas?.map(group => ({
//     ...group,
//     controllers: group.controllers.map(controller => ({
//       ...controller,
//       display_names: controller.display_names.filter(display => display.menu_type === 1)
//     }))
//   }));

//   console.log(allSideNavData);



//   const filteredData = allSideNavData?.map(navData => navData?.controllers.map(controller => controller.display_names.map(displayName => displayName.method_id === 3222)))

//   console.log(filteredData);

//   const { data: users = [] } = useQuery({
//     queryKey: ['users'],
//     queryFn: async () => {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/user/allUser`);
//       const data = await res.json();

//       return data;
//     },
//   });

//   const filteredUsers = users.filter(user => user.id === 1);

//   console.log(filteredUsers);


//   const [clickedButtons, setClickedButtons] = useState(new Array(allSideNavData.length).fill(false));



//   const handleClick = (index) => {
//     const updatedClickedButtons = [...clickedButtons];
//     updatedClickedButtons[index] = !updatedClickedButtons[index];
//     setClickedButtons(updatedClickedButtons);
//   };



//   const formatString = (str) => {
//     const words = str?.split('_');

//     const formattedWords = words?.map((word) => {
//       const capitalizedWord = word?.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//       return capitalizedWord;
//     });

//     return formattedWords?.join(' ');
//   };

//   const convertToCamelCase = (input) => {
//     return input.toLowerCase().replace(/ /g, '_');
//   };


//   const [pageGroup, setPageGroup] = useState('')
//   console.log(pageGroup)

//   const [controllerName, setControllerName] = useState('')


//   const handleLinkClick = (selectedPageGroup, controllerName) => {

//     setControllerName(controllerName)
//     setPageGroup(selectedPageGroup);

//     // Save the selected pageGroup to local storage.
//     sessionStorage.setItem('controllerName', controllerName)
//     localStorage.setItem('pageGroup', selectedPageGroup);


//   };


//   const [displayNames, setDisplayNames] = useState('')
//   const handleDisplayName = (displayNames, controllerName) => {
//     setDisplayNames(displayNames)
//     setControllerName(controllerName)
//     sessionStorage.setItem('controllerName', controllerName)
//     sessionStorage.setItem('displayName', displayNames)
//   }

//   console.log(displayNames, 'displayNames')




//   const controllerNames = sessionStorage.getItem('controllerName')

//   const [page_group, setPage_group] = useState(() => {
//     if (typeof window !== 'undefined') {
//       return localStorage.getItem('pageGroup') || '';
//     }
//     return '';
//   });

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const interval = setInterval(() => {
//         const storedPageGroup = localStorage.getItem('pageGroup');
//         setPage_group(storedPageGroup || '');
//       }, 100);

//       return () => clearInterval(interval);
//     }
//   }, []);

//   const filterUser = allSideNavData?.filter(u => u.page_group === page_group)

//   console.log(filterUser[0]?.controllers, 'filterUser[0]?.controllers')

//   const pageGroupNav = filterUser[0]?.controllers
//   // const displayNames = (pageGroupNav?.map(paegGroups => paegGroups.display_names.map(displayName => displayName.display_name)))
//   console.log(pageGroupNav?.map(paegGroups => paegGroups.display_names.map(displayName => displayName.display_name)))


//   const adminLogin = localStorage.getItem('login')
//   const handleLogout = () => {

//     localStorage.removeItem('userEmail');
//     localStorage.removeItem('userId');
//     localStorage.removeItem('userName');
//     localStorage.removeItem('userRoleName');
//     localStorage.removeItem('pageGroup');
//     localStorage.removeItem('countdown');
//     sessionStorage.removeItem('controllerName')
//     router.push(`/`);

//   };

//   const userEmail = localStorage.getItem('userEmail');
//   const userRoleName = localStorage.getItem('userRoleName');
//   const userName = localStorage.getItem('userName');



//   console.log(pageGroupNav, 'pageGroupNav')


//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

//   const toggleMenu = (e) => {
//     e.preventDefault();
//     const rect = e.currentTarget.getBoundingClientRect();
//     setMenuPosition({
//       top: rect.bottom,
//       left: rect.right,
//     });
//     setIsMenuOpen(!isMenuOpen);
//   };


//   const handleDashboardClick = () => {
//     sessionStorage.removeItem('pageGroup');
//     localStorage.removeItem('pageGroup');
//     sessionStorage.removeItem('controllerName');
//     handleLinkClick('')
//     // localStorage.clear();
//   };

//   useEffect(() => {

//     if (window.location.pathname === "/Admin/dashboard") {
//       localStorage.removeItem('pageGroup');
//       // localStorage.clear();
//       sessionStorage.removeItem('pageGroup');
//       sessionStorage.removeItem('controllerName')
//     }
//   }, []);




//   console.log(controllerName, 'controllerName')

//   const colour = sessionStorage.getItem('cardBodyBg')
//   const userId = localStorage.getItem('userId')



//   // const [loading, setLoading] = useState(false)
//   // useEffect(() => {
//   //   setLoading(true)
//   //   setTimeout(() => {
//   //     setLoading(false)
//   //   }, 2000)
//   // }, [])

//   const [sideNav, setSideNav] = useState([])


//   useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/admin/admin_panel_settings`)
//       .then(Response => Response.json())
//       .then(data => setSideNav(data))
//   }, [])
//   console.log(sideNav)

//   const filteredCategories = sideNav.filter(category => category.status === 1);
//   console.log(filteredCategories[0]?.admin_template, 'filteredCategories[0]?.admin_template')

//   // const wrapperStyle = {
//   //   flexDirection: filteredCategories[0]?.side_menu_position === 'right' ? 'row-reverse' : 'row'
//   // };
//   const wrapperStyle = {
//     display: 'flex',
//     flexDirection: (() => {
//       const position = filteredCategories[0]?.side_menu_position;
//       if (position === 'top') return 'column';
//       if (position === 'bottom') return 'column-reverse';
//       if (position === 'right') return 'row-reverse';
//       return 'row'; // Default to 'row' for 'left' or undefined
//     })()
//   };

//   console.log(filteredCategories[0]?.side_menu_position)

//   return (
//     <div class="wrapper w-100" style={wrapperStyle}>

//       {filteredCategories[0]?.side_menu_position === 'top' ? (
//   <div className='sticky-top'>
//   {allSideNavData && (
//     <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light sub_header_background_color">
//       <div className="container-fluid">
//         {/* <Link className="navbar-brand " style={{ color: '#4267b2' }} href="">{formatString(page_group)}</Link> */}
//         <button
//           className="btn btn-dark d-inline-block d-lg-none ml-auto"
//           type="button"
//           data-toggle="collapse"
//           data-target="#customNavbarCollapse1"
//           aria-controls="customNavbarCollapse1"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <FaBars />
//         </button>
//         <div className="collapse navbar-collapse" id="customNavbarCollapse1">
//           {/* ml-auto */}
//           <ul className="nav navbar-nav">
//             {allSideNavData?.map((page, index) => (
//               <div key={index} className="ml-0 dropdown">
//                 <li className="nav-item active">
//                   <Link className="nav-link" href="">
//                     {formatString(page?.page_group)}
//                     <FaCaretDown />
//                   </Link>
//                 </li>
//                 <ul className="dropdown-menu nav-item active ml-0">
//                   {page.controllers.map((displayNames, subIndex) => (
//                     <li key={subIndex} className="dropdown-submenu">
//                       <Link href="" className="dropdown-item">
//                         {formatString(displayNames.controller_name)}
//                       </Link>
//                       <ul className="dropdown-menu" >
//                         {displayNames.display_names.map((displayName, nestedIndex) => (
//                           <li key={nestedIndex}>
//                             <Link href={`/Admin/${displayNames?.controller_name}/${displayName.method_names}?page_group=${page_group}`} className="dropdown-item">
//                               {formatString(displayName.display_name)}
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   )}
// </div>


//         // <div className='sticky-top'>
//         //   {allSideNavData && (
//         //     <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light sub_header_background_color">
//         //       <div className="container-fluid">
//         //         {/* <Link className="navbar-brand " style={{ color: '#4267b2' }} href="">{formatString(page_group)}</Link> */}
//         //         <button
//         //           className="btn btn-dark d-inline-block d-lg-none ml-auto"
//         //           type="button"
//         //           data-toggle="collapse"
//         //           data-target="#customNavbarCollapse1"
//         //           aria-controls="customNavbarCollapse1"
//         //           aria-expanded="false"
//         //           aria-label="Toggle navigation"
//         //         >
//         //           <FaBars />
//         //         </button>
//         //         <div className="collapse navbar-collapse" id="customNavbarCollapse1">
//         //           {/* ml-auto */}
//         //           <ul className="nav navbar-nav">
//         //             {allSideNavData?.map((page, index) => (
//         //               <div key={index} className="ml-0 dropdown">
//         //                 <li className="nav-item active">
//         //                   <Link className="nav-link" href="">
//         //                     {formatString(page?.page_group)}
//         //                     <FaCaretDown />
//         //                   </Link>
//         //                 </li>
//         //                 <ul className="dropdown-menu nav-item active ml-0">
//         //                   {page.controllers.map((displayNames, subIndex) => (
//         //                     <li key={subIndex} className="dropdown-submenu">
//         //                       <Link href="" className="dropdown-item">
//         //                         {formatString(displayNames.controller_name)}
//         //                       </Link>
//         //                       <ul className="dropdown-menu">
//         //                         {displayNames.display_names.map((displayName, nestedIndex) => (
//         //                           <li key={nestedIndex}>
//         //                             <Link href={`/Admin/${displayNames?.controller_name}/${displayName.method_names}?page_group=${page_group}`} className="dropdown-item">
//         //                               {formatString(displayName.display_name)}
//         //                             </Link>
//         //                           </li>
//         //                         ))}
//         //                       </ul>
//         //                     </li>
//         //                   ))}
//         //                 </ul>
//         //               </div>
//         //             ))}
//         //           </ul>
//         //         </div>
//         //       </div>
//         //     </nav>
//         //   )}
//         // </div>


//       ) : (
//         <>
//           {
//             filteredCategories[0]?.left_menu === 1 ?
//               // style={sidebarStyle}
//               <nav id="sidebar" className={`sidebar ${isSidebarActive ? 'active' : ''} side_menu_bg`} >
//                 <div className="sidebar-header mt-2 side_menu_bg" >
//                   <div></div>
//                   <div className="media d-flex " style={{ marginLeft: '6px' }}>
//                     <img
//                       className="rounded-circle mt-2"
//                       src="https://atik.urbanitsolution.com/web_content/img/user.png"
//                       alt=""
//                       width="50"
//                       height="50"
//                     />
//                     <div className="position-relative">
//                       <div className='sideLine  ' style={{ marginTop: '14px', marginLeft: '5px' }} onClick={(e) => toggleMenu(e)}>
//                         <h6 className='mt-1'>
//                           <span className='admin-text'>{userName}</span>
//                           <p className='admin-subtext'>{userRoleName}
//                             <FaCaretDown></FaCaretDown>
//                           </p>
//                         </h6>
//                       </div>
//                       {isMenuOpen && (
//                         <div className='position-absolute bg-light text-dark' style={{ top: menuPosition.top, right: menuPosition.right }}>

//                           <div class="dropdown-menu show btn" aria-labelledby="dropdownMenuButton" x-placement="bottom-start">
//                             <a class="dropdown-item" href={`/Admin/users/edit_users/${userId}`}>
//                               <FaUserEdit></FaUserEdit> Edit Profile
//                             </a>

//                             <a class="dropdown-item " >

//                               <FaKey></FaKey>

//                               Change Password
//                             </a>

//                             {
//                               userEmail &&
//                               <a onClick={handleLogout} class="dropdown-item" >
//                                 <FaSignOutAlt></FaSignOutAlt> Log Out
//                               </a>
//                             }
//                           </div>
//                         </div>

//                       )}
//                     </div>


//                   </div>

//                 </div>


//                 <ul className="text-white" style={{ marginTop: '-5px' }}>
//                   <button className='dashboard p-2 side_menu_bg'>
//                     <Link onClick={handleDashboardClick} className='' href='/Admin/dashboard'>
//                       Dashboard
//                     </Link>
//                   </button>
//                   {

//                     allSideNavData?.map((group, index) => (
//                       <li key={group?.page_group_id} className=''>
//                         <button
//                           className={`dashboard-dropdown ${clickedButtons[index] ? 'clicked' : ''} side_menu_l1_bg`}
//                           onClick={() => handleClick(index)}
//                         >
//                           <Link
//                             onClick={() => handleLinkClick((group?.page_group))}
//                             // onClick={() => handleLinkClicks((group?.page_group))}
//                             href={`/Admin/Admin_page_group/Admin_page_group_all?page_group=${group?.page_group}`}

//                           >
//                             <div className="d-flex justify-content-between ">
//                               {formatString(group?.page_group)}

//                             </div>
//                           </Link>
//                           <ul style={{ background: '#314B81' }} >

//                           </ul>

//                         </button>
//                       </li>
//                     ))}
//                 </ul>


//               </nav>

//               :
//               <>

//                 {
//                   isLoading ?
//                     <>

//                       <ContentLoader

//                         speed={2}
//                         width={300}
//                         height={615}
//                         viewBox="0 0 300 615"
//                         backgroundColor="#f5f5f5"
//                         foregroundColor="#ebebeb"
//                         {...props}
//                       >
//                         <rect x="79" y="20" rx="0" ry="0" width="0" height="1" />
//                         <rect x="4" y="1" rx="0" ry="0" width="3" height="600" />
//                         <rect x="4" y="598" rx="0" ry="0" width="294" height="3" />
//                         <rect x="158" y="596" rx="0" ry="0" width="5" height="3" />
//                         <rect x="5" y="1" rx="0" ry="0" width="294" height="3" />
//                         <rect x="296" y="1" rx="0" ry="0" width="3" height="600" />
//                         <rect x="5" y="60" rx="0" ry="0" width="294" height="3" />
//                         <rect x="22" y="20" rx="0" ry="0" width="129" height="23" />
//                         <rect x="35" y="76" rx="4" ry="4" width="81" height="9" />
//                         <rect x="271" y="22" rx="4" ry="4" width="18" height="18" />
//                         <rect x="186" y="76" rx="4" ry="4" width="81" height="9" />
//                         <rect x="150" y="63" rx="0" ry="0" width="2" height="44" />
//                         <rect x="6" y="104" rx="0" ry="0" width="144" height="3" />
//                         <rect x="152" y="106" rx="0" ry="0" width="145" height="1" />
//                         <rect x="28" y="127" rx="4" ry="4" width="243" height="31" />
//                         <rect x="62" y="188" rx="4" ry="4" width="148" height="19" />
//                         <circle cx="39" cy="197" r="10" />
//                         <circle cx="39" cy="247" r="10" />
//                         <circle cx="39" cy="297" r="10" />
//                         <circle cx="39" cy="347" r="10" />
//                         <rect x="64" y="237" rx="4" ry="4" width="148" height="19" />
//                         <rect x="65" y="287" rx="4" ry="4" width="148" height="19" />
//                         <rect x="64" y="337" rx="4" ry="4" width="148" height="19" />
//                         <circle cx="39" cy="547" r="10" />
//                       </ContentLoader>

//                     </>
//                     :
//                     <>
//                       <nav id="sidebar" className={`sidebar ${isSidebarActive ? 'active' : ''} side_menu_bg custom-sidebar`}>
//                         <div className="sidebar-header mt-2 side_menu_bg" >
//                           <div></div>
//                           <div className="media d-flex " style={{ marginLeft: '6px' }}>
//                             <img
//                               className="rounded-circle mt-2"
//                               src="https://atik.urbanitsolution.com/web_content/img/user.png"
//                               alt=""
//                               width="50"
//                               height="50"
//                             />
//                             <div className="position-relative">
//                               <div className='sideLine  ' style={{ marginTop: '14px', marginLeft: '5px' }} onClick={(e) => toggleMenu(e)}>
//                                 <h6 className='mt-1'>
//                                   <span className='admin-text'>{userName}</span>
//                                   <p className='admin-subtext'>{userRoleName}
//                                     <FaCaretDown></FaCaretDown>
//                                   </p>
//                                 </h6>
//                               </div>
//                               {isMenuOpen && (
//                                 <div className='position-absolute bg-light text-dark' style={{ top: menuPosition.top, right: menuPosition.right }}>

//                                   <div class="dropdown-menu show btn" aria-labelledby="dropdownMenuButton" x-placement="bottom-start">
//                                     <Link class="dropdown-item" href={`/Admin/users/edit_users/${userId}`}>
//                                       <FaUserEdit></FaUserEdit> Edit Profile
//                                     </Link>

//                                     <Link class="dropdown-item " href={`/Admin/users/change_password/${userId}`}>

//                                       <FaKey></FaKey>

//                                       Change Password
//                                     </Link>

//                                     {
//                                       userEmail &&
//                                       <a onClick={handleLogout} class="dropdown-item" >
//                                         <FaSignOutAlt></FaSignOutAlt> Log Out
//                                       </a>
//                                     }
//                                   </div>
//                                 </div>

//                               )}
//                             </div>


//                           </div>

//                         </div>


//                         <ul className="text-white" style={{ marginTop: '-5px' }}>
//                           {/* side_menu_bg */}
//                           <button className='dashboard p-2 ' >
//                             <Link onClick={handleDashboardClick} className='' href='/Admin/dashboard'>

//                               Dashboard
//                             </Link>
//                           </button>
//                           {

//                             allSideNavData?.map((group, index) => (
//                               <li key={group?.page_group_id} className=''>
//                                 <button

//                                   className={`dashboard-dropdown ${clickedButtons[index] ? 'clicked' : ''} side_menu_l1_bg px-0`}
//                                   onClick={() => handleClick(index)}
//                                 >
//                                   <a
//                                     href={`#${group?.page_group}`}
//                                     data-toggle="collapse"
//                                     aria-expanded="false"
//                                     className='ml-1'
//                                   >
//                                     <div className="d-flex justify-content-between ">
//                                       {formatString(group?.page_group)}
//                                       <div>
//                                         {clickedButtons[index] ? <FaAngleDown /> : <FaAngleRight />}
//                                       </div>
//                                     </div>
//                                   </a>
//                                   <ul className={`collapse list-unstyled ${page_group === group?.page_group ? 'show' : ''} `} style={{ background: '#3b5998' }} id={group?.page_group}>

//                                     <li className=''>

//                                       {group?.controllers?.map((d, index) => (
//                                         <div key={d.controller_name}>
//                                           <a href={`#${group.page_group}-${d.controller_name}`} data-toggle="collapse" aria-expanded="false" className="side_menu_l2_bg borderBottom"


//                                           >
//                                             <div className='d-flex justify-content-between ml-3'>
//                                               {formatString(d.controller_name)}
//                                               <div>
//                                                 {clickedButtons[index] ? <FaAngleDown /> : <FaAngleRight />}
//                                               </div>
//                                             </div>
//                                           </a>
//                                           <ul className={`collapse list-unstyled ${controllerNames === d?.controller_name ? 'show' : ''} `} style={{ background: '#314B81' }} id={`${group.page_group}-${d.controller_name}`}>

//                                             <li


//                                               onClick={() => handleLinkClick((group?.page_group), (d?.controller_name))}>

//                                               {d.display_names.map((displayName, di) => (

//                                                 <Link

//                                                   onClick={() => handleDisplayName(displayName.display_name)}
//                                                   className='border-bottom1 side_menu_l3_bg '
//                                                   key={di}

//                                                   href={`/Admin/${d?.controller_name}/${displayName.method_names}?page_group=${group?.page_group}`}
//                                                 >
//                                                   <div className='ml-4'>
//                                                     {displayName.display_name}

//                                                   </div>

//                                                 </Link>
//                                               ))}
//                                             </li>
//                                           </ul>
//                                         </div>
//                                       ))}
//                                     </li>
//                                   </ul>
//                                 </button>
//                               </li>
//                             ))}
//                         </ul>


//                       </nav>

//                     </>


//                 }
//               </>

//           }
//         </>

//       )
//       }




//       <div id="content " className='w-100 body_bg'>
//         <AdminHeader toggleSidebar={toggleSidebar}></AdminHeader>

//         {/* className='sticky-top'  */}
//         <div className=''>
//           {
//             pageGroupNav &&
//             // sticky-top
//             <nav className="navbar  navbar-expand-lg navbar-light bg-light sub_header_background_color">
//               <div className="container-fluid" >
//                 <Link className="navbar-brand sub_header_pg_text_color" style={{ color: '#4267b2' }} href="">{formatString(page_group)}</Link>
//                 <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#customNavbarCollapse" aria-controls="customNavbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
//                   <FaBars></FaBars>
//                 </button>
//                 <div className="collapse navbar-collapse " id="customNavbarCollapse">
//                   {/* ml-auto */}
//                   <ul class=" nav navbar-nav  ">
//                     {
//                       pageGroupNav?.map(page =>
//                         <>
//                           <div class=" ml-0 dropdown sub_header_controller_text_color" >

//                             <li className="nav-item active
//                             "

//                             >
//                               <Link className="nav-link" href=""


//                                 style={{
//                                   color: controllerNames === page?.controller_name ? '#28a745' : 'inherit',
//                                   fontWeight: controllerNames === page?.controller_name ? '600' : 'normal',
//                                 }}
//                               >{formatString(page?.controller_name)}

//                                 <FaCaretDown></FaCaretDown>
//                               </Link>
//                             </li>
//                             <ul class="dropdown-menu nav-item active ml-0 " aria-labelledby="dropdownMenuButton">
//                               {
//                                 page.display_names.map(displayNames =>

//                                   <>

//                                     <li
                                      
//                                     ><Link

//                                       onClick={() => handleDisplayName((displayNames.display_name), (page?.controller_name))}
//                                       class="dropdown-item" href={`/Admin/${page?.controller_name}/${displayNames.method_names}?page_group=${page_group}`}>{displayNames.display_name}

//                                       </Link></li>
//                                   </>
//                                 )
//                               }

//                             </ul>
//                           </div>
//                         </>
//                       )}

//                   </ul>

//                 </div>
//               </div>
//             </nav>
//           }

//           {/* px-md-4 py-md-5 px-lg-4 py-lg-5 px-2 py-2 */}
//           {/* body_bg */}
//           <div className=''>
//             {
//               isLoading ?

//                 <ContentLoader

//                   viewBox="0 0 1000 550"
//                   backgroundColor="#eaeced"
//                   foregroundColor="#ffffff"
//                   {...props}
//                 >
//                   <rect x="51" y="45" rx="3" ry="3" width="906" height="17" />
//                   <circle cx="879" cy="123" r="11" />
//                   <circle cx="914" cy="123" r="11" />
//                   <rect x="104" y="115" rx="3" ry="3" width="141" height="15" />
//                   <rect x="305" y="114" rx="3" ry="3" width="299" height="15" />
//                   <rect x="661" y="114" rx="3" ry="3" width="141" height="15" />
//                   <rect x="55" y="155" rx="3" ry="3" width="897" height="2" />
//                   <circle cx="880" cy="184" r="11" />
//                   <circle cx="915" cy="184" r="11" />
//                   <rect x="105" y="176" rx="3" ry="3" width="141" height="15" />
//                   <rect x="306" y="175" rx="3" ry="3" width="299" height="15" />
//                   <rect x="662" y="175" rx="3" ry="3" width="141" height="15" />
//                   <rect x="56" y="216" rx="3" ry="3" width="897" height="2" />
//                   <circle cx="881" cy="242" r="11" />
//                   <circle cx="916" cy="242" r="11" />
//                   <rect x="106" y="234" rx="3" ry="3" width="141" height="15" />
//                   <rect x="307" y="233" rx="3" ry="3" width="299" height="15" />
//                   <rect x="663" y="233" rx="3" ry="3" width="141" height="15" />
//                   <rect x="57" y="274" rx="3" ry="3" width="897" height="2" />
//                   <circle cx="882" cy="303" r="11" />
//                   <circle cx="917" cy="303" r="11" />
//                   <rect x="107" y="295" rx="3" ry="3" width="141" height="15" />
//                   <rect x="308" y="294" rx="3" ry="3" width="299" height="15" />
//                   <rect x="664" y="294" rx="3" ry="3" width="141" height="15" />
//                   <rect x="58" y="335" rx="3" ry="3" width="897" height="2" />
//                   <circle cx="881" cy="363" r="11" />
//                   <circle cx="916" cy="363" r="11" />
//                   <rect x="106" y="355" rx="3" ry="3" width="141" height="15" />
//                   <rect x="307" y="354" rx="3" ry="3" width="299" height="15" />
//                   <rect x="663" y="354" rx="3" ry="3" width="141" height="15" />
//                   <rect x="57" y="395" rx="3" ry="3" width="897" height="2" />
//                   <circle cx="882" cy="424" r="11" />
//                   <circle cx="917" cy="424" r="11" />
//                   <rect x="107" y="416" rx="3" ry="3" width="141" height="15" />
//                   <rect x="308" y="415" rx="3" ry="3" width="299" height="15" />
//                   <rect x="664" y="415" rx="3" ry="3" width="141" height="15" />
//                   <rect x="55" y="453" rx="3" ry="3" width="897" height="2" />
//                   <rect x="51" y="49" rx="3" ry="3" width="2" height="465" />
//                   <rect x="955" y="49" rx="3" ry="3" width="2" height="465" />
//                   <circle cx="882" cy="484" r="11" />
//                   <circle cx="917" cy="484" r="11" />
//                   <rect x="107" y="476" rx="3" ry="3" width="141" height="15" />
//                   <rect x="308" y="475" rx="3" ry="3" width="299" height="15" />
//                   <rect x="664" y="475" rx="3" ry="3" width="141" height="15" />
//                   <rect x="55" y="513" rx="3" ry="3" width="897" height="2" />
//                   <rect x="52" y="80" rx="3" ry="3" width="906" height="17" />
//                   <rect x="53" y="57" rx="3" ry="3" width="68" height="33" />
//                   <rect x="222" y="54" rx="3" ry="3" width="149" height="33" />
//                   <rect x="544" y="55" rx="3" ry="3" width="137" height="33" />
//                   <rect x="782" y="56" rx="3" ry="3" width="72" height="33" />
//                   <rect x="933" y="54" rx="3" ry="3" width="24" height="33" />
//                 </ContentLoader>

//                 :

//                 <>

//                   {child}


//                   <div className='d-flex justify-content-between px-4 mt-5 '>
//                     <div>
//                       <ul class="navbar-nav mr-auto">
//                         <li class="nav-item active float-left text-center">
//                           <a class="nav-link text-success" href="https://atik.urbanitsolution.com/" target="_blank"> All Rights Reserved <br /><strong>Pathshala School & College</strong> </a>
//                         </li>
//                       </ul>
//                     </div>
//                     <div>
//                       <ul class="navbar-nav">
//                         <li class="nav-item active float-left text-center">
//                           <a class="nav-link text-danger" href="http://urbanitsolution.com" target="_blank">Developed & Maintenance by <br /><strong>Urban IT Solution</strong>  </a>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 </>

//             }

//           </div>

//         </div>


//       </div>

//     </div>

//   );
// }

// export default AdminSidebar;