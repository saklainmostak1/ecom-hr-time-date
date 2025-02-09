// "use client";
// import { faSpinner } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useQuery } from "@tanstack/react-query";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";

// const formatDateTime = (dateTime) => {
//   const date = new Date(dateTime);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   let hours = date.getHours();
//   const minutes = String(date.getMinutes()).padStart(2, "0");
//   const seconds = String(date.getSeconds()).padStart(2, "0");
//   const ampm = hours >= 12 ? "PM" : "AM";

//   // Convert 24-hour format to 12-hour format
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'

//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
// };

// const VideoGalleryList = () => {
//   const {
//     data: videoCategoryAll = [],
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["videoCategoryAll"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery/video_gallery_all`
//       );

//       const data = await res.json();
//       return data;
//     },
//   });

//   const getYouTubeVideoId = (url) => {
//     const regExp =
//       /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|watch\?.*v=)([^#\&\?]*).*/;
//     const match = url.match(regExp);
//     return match && match[2].length === 11 ? match[2] : null;
//   };

//   const page_group = localStorage.getItem("pageGroup");
//   const userId = localStorage.getItem("userId");
//   const { data: moduleInfo = [] } = useQuery({
//     queryKey: ["moduleInfo"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${userId}`
//       );

//       const data = await res.json();
//       return data;
//     },
//   });

//   const brandList = moduleInfo.filter(
//     (moduleI) => moduleI.controller_name === "video_gallery"
//   );

//   const filteredBtnIconEdit = brandList.filter((btn) => btn.method_sort === 3);
//   const filteredBtnIconCopy = brandList.filter((btn) => btn.method_sort === 4);
//   const filteredBtnIconDelete = brandList.filter(
//     (btn) => btn.method_sort === 5
//   );
//   const filteredBtnIconCreate = brandList.filter(
//     (btn) => btn.method_sort === 1
//   );

//   const videoCategoryAlldelete = (id) => {
//     const proceed = window.confirm(`Are You Sure delete ${id}`);
//     if (proceed) {
//       fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery/video_gallery_delete/${id}`,
//         {
//           method: "POST",
//         }
//       )
//         .then((Response) => Response.json())
//         .then((data) => {
//           refetch();
//         });
//     }
//   };

//   const [message, setMessage] = useState();
//   useEffect(() => {
//     if (sessionStorage.getItem("message")) {
//       setMessage(sessionStorage.getItem("message"));
//       sessionStorage.removeItem("message");
//     }
//   }, []);

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12 p-4">
//           {message && (
//             <div className="alert alert-success font-weight-bold">
//               {message}
//             </div>
//           )}
//           <div className="card">
//             <div className="body-content bg-light">
//               <div className="border-primary shadow-sm border-0">
//                 <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
//                   <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
//                     Video Gallery List
//                   </h5>
//                   <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                     <Link
//                       href={`/Admin/video_gallery/video_gallery_create?page_group`}
//                       className="btn btn-sm btn-info"
//                     >
//                       Create Video Gallery List
//                     </Link>
//                   </div>
//                 </div>
//                 <div
//                   className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold"
//                   role="alert"
//                 >
//                   (
//                   <small>
//                     <sup>
//                       <i className="text-danger fas fa-star"></i>
//                     </sup>
//                   </small>
//                   ) field required
//                 </div>
//                 <div className="card-body">
//                   <div className="table-responsive">
//                     <table className="table table-bordered table-hover table-striped table-sm">
//                       <thead>
//                         <tr>
//                           <th>Title</th>
//                           <th>Video Category</th>
//                           <th>Video</th>
//                           <th>Status Name</th>
//                           <th>Created By/Created Date</th>

//                           <th>Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {isLoading ? (
//                           <div className="text-center">
//                             <div className="text-center text-dark">
//                               <FontAwesomeIcon
//                                 style={{
//                                   height: "33px",
//                                   width: "33px",
//                                 }}
//                                 icon={faSpinner}
//                                 spin
//                               />
//                             </div>
//                           </div>
//                         ) : (
//                           videoCategoryAll.map((video) => {
//                             const videoId = getYouTubeVideoId(video?.link);
//                             return (
//                               <tr key={video.id}>
//                                 <td>{video?.title}</td>
//                                 <td>
//                                   {video?.video_category === 1
//                                     ? "Activities"
//                                     : "" || video?.video_category === 2
//                                     ? "Collective Action Plan2"
//                                     : "" || video?.video_category === 3
//                                     ? "Collective Action Plan12"
//                                     : "" || video?.video_category === 4
//                                     ? "Field Farmer School"
//                                     : "" || video?.video_category === 5
//                                     ? "Gender Action Plane"
//                                     : "" || video?.video_category === 6
//                                     ? "Staff Training"
//                                     : "" || video?.video_category === 7
//                                     ? "Success Story"
//                                     : "" || video?.video_category === 8
//                                     ? "Union Level Consultation Workshop"
//                                     : "" || video?.video_category === 9
//                                     ? "WMO Training"
//                                     : ""}
//                                 </td>
//                                 <td>
//                                   {videoId ? (
//                                     <iframe
//                                       width="200"
//                                       height="113"
//                                       src={`https://www.youtube.com/embed/${videoId}`}
//                                       frameBorder="0"
//                                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                       allowFullScreen
//                                     ></iframe>
//                                   ) : (
//                                     <p>Invalid video link</p>
//                                   )}
//                                 </td>
//                                 <td>
//                                   {video?.status === 1 ? "Active" : "Inactive"}
//                                 </td>
//                                 <td>
//                                   {video?.author_name}
//                                   <div>
//                                     {" "}
//                                     {video?.created_date
//                                       ? formatDateTime(video.created_date)
//                                       : ""}
//                                   </div>
//                                 </td>

//                                 <td>
//                                   <div className="flex items-center">
//                                     <Link
//                                       href={`/Admin/video_gallery/video_gallery_edit/${video.id}?page_group=${page_group}`}
//                                     >
//                                       {filteredBtnIconEdit.map((btn) => (
//                                         <button
//                                           key={btn.id}
//                                           title="Edit"
//                                           style={{
//                                             width: "35px",
//                                             height: "30px",
//                                             marginLeft: "5px",
//                                             marginTop: "5px",
//                                           }}
//                                           className={btn?.btn}
//                                         >
//                                           <a
//                                             dangerouslySetInnerHTML={{
//                                               __html: btn?.icon,
//                                             }}
//                                           ></a>
//                                         </button>
//                                       ))}
//                                     </Link>
//                                     <Link
//                                       href={`/Admin/video_gallery/video_gallery_copy/${video.id}?page_group=${page_group}`}
//                                     >
//                                       {filteredBtnIconCopy.map((btn) => (
//                                         <button
//                                           key={btn.id}
//                                           title="Copy"
//                                           style={{
//                                             width: "35px",
//                                             height: "30px",
//                                             marginLeft: "5px",
//                                             marginTop: "5px",
//                                           }}
//                                           className={btn?.btn}
//                                         >
//                                           <a
//                                             dangerouslySetInnerHTML={{
//                                               __html: btn?.icon,
//                                             }}
//                                           ></a>
//                                         </button>
//                                       ))}
//                                     </Link>
//                                     {filteredBtnIconDelete.map((btn) => (
//                                       <button
//                                         key={btn.id}
//                                         title="Delete"
//                                         onClick={() =>
//                                           videoCategoryAlldelete(video.id)
//                                         }
//                                         style={{
//                                           width: "35px",
//                                           height: "30px",
//                                           marginLeft: "5px",
//                                           marginTop: "5px",
//                                         }}
//                                         className={btn?.btn}
//                                       >
//                                         <a
//                                           dangerouslySetInnerHTML={{
//                                             __html: btn?.icon,
//                                           }}
//                                         ></a>
//                                       </button>
//                                     ))}
//                                   </div>
//                                 </td>
//                               </tr>
//                             );
//                           })
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoGalleryList;

"use client";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Select from "react-dropdown-select";

const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
};

const formatDateTimePublishDate = (dateTime) => {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}/${month}/${year}`;
};

const downloadFile = async (fileUrl) => {
  try {
    // Extract the original file name from the URL
    const fileName = fileUrl.split("/").pop();

    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // Use the original file name
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Failed to download file:", error);
  }
};

const VideoGalleryList = ({ searchParams }) => {
  const getYouTubeVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|watch\?.*v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
  const {
    data: video = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["video"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery/video_gallery_all`
      );

      const data = await res.json();
      return data;
    },
  });

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

  const { data: moduleInfo = [] } = useQuery({
    queryKey: ["moduleInfo"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/admin/module_info/module_info_all/${userId}`
      );

      const data = await res.json();
      return data;
    },
  });

  // console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'brand'))
  const brandList = moduleInfo.filter(
    (moduleI) => moduleI.controller_name === "video_gallery"
  );

  //   console.log(filteredModuleInfo);

  const filteredBtnIconEdit = brandList.filter((btn) => btn.method_sort === 3);
  const filteredBtnIconCopy = brandList.filter((btn) => btn.method_sort === 4);

  const filteredBtnIconDelete = brandList.filter(
    (btn) => btn.method_sort === 5
  );
  const filteredBtnIconCreate = brandList.filter(
    (btn) => btn.method_sort === 1
  );

  const noticeCategoryAll_delete = (id) => {
    console.log(id);
    const proceed = window.confirm("Are you delete this item.");
    if (proceed) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery/video_gallery_delete/${id}`,
        {
          method: "POST",
        }
      )
        .then((Response) => Response.json())
        .then((data) => {
          refetch();
          caregory_list();
          console.log(data);
        });
    }
  };

  // Paigination start
  const parentUsers = video;

  const totalData = parentUsers?.length;
  const dataPerPage = 20;

  const totalPages = Math.ceil(totalData / dataPerPage);

  let currentPage = 1;

  if (Number(searchParams.page) >= 1) {
    currentPage = Number(searchParams.page);
  }

  let pageNumber = [];
  for (let index = currentPage - 2; index <= currentPage + 2; index++) {
    if (index < 1) {
      continue;
    }
    if (index > totalPages) {
      break;
    }
    pageNumber.push(index);
  }
  const [pageUsers, setPageUsers] = useState([]);
  const caregory_list = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery/video_gallery_list_paigination/${currentPage}/${dataPerPage}`;
    const response = await fetch(url);
    const data = await response.json();
    setPageUsers(data);
  };

  useEffect(() => {
    caregory_list();
  }, [currentPage]);

  const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;

  // Paigination end

  const [message, setMessage] = useState();
  useEffect(() => {
    if (typeof window !== 'undefined') {

      if (sessionStorage.getItem("message")) {
        setMessage(sessionStorage.getItem("message"));
        sessionStorage.removeItem("message");
      }
    }
  }, [])


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 p-4">
          {message && (
            <div className="alert alert-success font-weight-bold">
              {message}
            </div>
          )}
          <div className='card mb-4'>
            <div class=" body-content bg-light">

              <div class=" border-primary shadow-sm border-0">
                <div class=" card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                  <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">News Search</h5>
                  <div class="card-title font-weight-bold mb-0 card-header-color float-right">

                    <Link href={`/Admin/news/news_create?page_group=${page_group}`} class="btn btn-sm btn-info">Back To Create News</Link>
                  </div>
                </div>


                <div class="card-body">
                  <form class="">
                    <div class="col-md-10 offset-md-1">

                      <div class="form-group row student">

                        <label htmlFor="fromDate" class="col-form-label col-md-3"><strong>From Date:</strong></label>

                        <div className="col-md-3">


                          <input
                            type="text"
                            readOnly

                            // value={showFromDate}
                            // onClick={handleTextInputClick}
                            placeholder="dd-mm-yy"
                            className="form-control"
                            style={{ display: 'inline-block', }}
                          />
                          <input

                            type="date"
                            id="dateInput"
                            // onChange={handleDateChangess}
                            style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                          />


                        </div>

                        <label htmlFor="toDate" class="col-form-label col-md-3"><strong>To Date:</strong></label>
                        <div class="col-md-3">
                          <input
                            type="text"
                            readOnly

                            // value={showToDate}
                            // onClick={handleTextInputClicks}
                            placeholder="dd-mm-yy"
                            className="form-control"
                            style={{ display: 'inline-block', }}
                          />
                          <input

                            type="date"
                            id="dateInputTo"
                            // onChange={handleDateChangesss}
                            style={{ position: 'absolute', bottom: '-20px', left: '0', visibility: 'hidden' }}
                          />

                        </div>
                      </div>

                      <div class="form-group row student">

                        <label class="col-form-label col-md-3"><strong>News Name:</strong></label>
                        <div className="col-md-3">
                          <input class="form-control form-control-sm  alpha_space item_name" type="text"

                          // value={itemName}
                          //   onChange={(e) => setItemName(e.target.value)} 

                          />
                        </div>
                        <label class="col-form-label col-md-3"><strong>News Category Name:</strong></label>
                        <div className="col-md-3">

                          {/* <select required="" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} name="supplier_id" className="form-control form-control-sm mb-2" id="supplier_id">
                            <option value=''>Select Category</option>
                            {
                              noticeCategoryAlls.map((supplier) => (
                                <>
                                  <option value={supplier.id}>{supplier.name}</option>

                                </>

                              ))
                            }

                          </select> */}
                        </div>


                      </div>
                      <div class="form-group row student">

                        <label class="col-form-label font-weight-bold col-md-3">Print Properties:</label>
                        <div class="col-md-9">
                          <div class="input-group ">
                            <select name="print_size" class="form-control form-control-sm  trim integer_no_zero print_size" id="print_size">
                              <option value="legal">legal </option>
                              <option value="A4">A4 </option>
                              <option value="A3">A3 </option>
                              <option value="">Browser </option>
                            </select>
                            <select name="print_layout" class="form-control form-control-sm  trim integer_no_zero print_layout" id="print_layout">

                              <option value="landscape">Landscape</option>
                              <option value="portrait">Portrait</option>
                              <option value="">Browser </option>
                            </select>
                            <select class=" form-control form-control-sm   integer_no_zero student_type font_size">
                              <option value="font-12">Font Standard</option>
                              <option value="font-10">Font Small</option>

                            </select>
                            <select name="zoom_size" class="form-control form-control-sm  trim integer_no_zero zoom_size" id="zoom_size">
                              <option value="120%">Browser Zoom</option>
                              <option value="5%">5% Zoom</option>
                              <option value="10%">10% Zoom</option>
                              <option value="15%">15% Zoom</option>
                              <option value="20%">20% Zoom</option>
                              <option value="25%">25% Zoom</option>
                              <option value="30%">30% Zoom</option>
                              <option value="35%">35% Zoom</option>
                              <option value="40%">40% Zoom</option>
                              <option value="45%">45% Zoom</option>
                              <option value="50%">50% Zoom</option>
                              <option value="55%">55% Zoom</option>
                              <option value="60%">60% Zoom</option>
                              <option value="65%">65% Zoom</option>
                              <option value="70%">70% Zoom</option>
                              <option value="75%">75% Zoom</option>
                              <option value="80%">80% Zoom</option>
                              <option value="85%">85% Zoom</option>
                              <option value="90%">90% Zoom</option>
                              <option value="95%">95% Zoom</option>
                              <option value="100%" selected="">100% Zoom</option>

                            </select>
                          </div>

                        </div>


                      </div>
                      <div class="form-group row student">


                        <label class="col-form-label col-md-3"><strong>Design:</strong></label>

                        <div className="col-md-9">


                          <Select
                          // multi
                          // options={[
                          //   { label: 'Serial', value: 'serial' }, // Serial option
                          //   ...filteredColumns.map(column => ({
                          //     label: formatString(column),
                          //     value: column,
                          //   })),
                          //   { label: 'Action', value: 'action' }, // Action option
                          // ]}
                          // values={

                          //   columnListSelectedArray?.map(column => ({
                          //     label: formatString(column),
                          //     value: column,
                          //   }))

                          // }


                          // onChange={category_column_change}
                          />
                        </div>
                      </div>
                    </div>
                    <div class="form-group row">
                      <div class="offset-md-2 col-md-6 float-left">
                        <input
                          // onClick={news_search}
                          type="button" name="search" class="btn btn-sm btn-info search_btn mr-2" value="Search" />
                        <input
                          // onClick={news_Print_download}
                          type="button" name="search" class="btn btn-sm btn-success print_btn mr-2" value="Print" />
                        <input
                          type="button"
                          // onClick={news_excel_download}
                          name="search"
                          className="btn btn-sm btn-secondary excel_btn mr-2"
                          value="Download Excel"
                        />

                        <input
                          type="button"
                          // onClick={news_word_download}
                          className="btn btn-sm btn-secondary excel_btn mr-2"
                          value="Download Docx"
                        />
                        <input
                          // onClick={news_pdf}
                          // style={buttonStyles}
                          type="button" name="search" class="btn btn-sm btn-indigo pdf_btn mr-2" value="Download PDF" />
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

          <div className="card">
            <div className="body-content bg-light">
              <div className="border-primary shadow-sm border-0">
                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                  <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
                    Video Gallery List
                  </h5>
                  <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                    <Link
                      href={`/Admin/video_gallery/video_gallery_create?page_group`}
                      className="btn btn-sm btn-info"
                    >
                      Create Video Gallery
                    </Link>
                  </div>
                </div>

                <div className="card-body">
                  {/* searchpagination start*/}
                  <div class="form-horizontal">
                    <div class="col-md-10 offset-md-1">
                      <div class="form-group row">
                        <label class="control-label col-md-2"> Title:</label>
                        <div class="col-md-3">
                          <input
                            type="text"
                            name="title"
                            class="form-control form-control-sm title"
                            id="title_name"
                            placeholder="Enter title"
                          />
                        </div>

                        <label class="control-label col-md-2">Category:</label>
                        <div class="col-md-3">
                          <select
                            required=""
                            name="news_category"
                            class="form-control form-control-sm trim integer_no_zero category"
                            id="news_category"
                            placeholder="Enter News Category"
                          >
                            <option value="">Select News Category</option>
                            <option value="2">jewel ranal</option>
                            <option value="1">News of School</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-10 offset-md-1">
                      <div class="form-group row">
                        <label class="control-label col-md-2">From Date:</label>
                        <div class="col-md-3">
                          <input
                            type="text"
                            name="from_date"
                            className="form-control form-control-sm urban_datepicker from_date"
                            id="from_date"
                            placeholder="Enter From Date"
                            value=""
                          />
                        </div>

                        <label class="control-label col-md-2">To Date:</label>
                        <div class="col-md-3">
                          <input
                            type="text"
                            name="to_date"
                            className="form-control form-control-sm urban_datepicker to_date"
                            id="to_date"
                            placeholder="Enter To Date"
                            value=""
                          />
                        </div>
                      </div>
                    </div>
                    <div class="form-group row">
                      <div class="offset-md-3 col-md-3 pull-left">
                        <input
                          type="button"
                          name="search"
                          className="btn btn-info btn-sm search_btn"
                          value="Search"
                        />
                      </div>
                    </div>
                    <br />
                  </div>

                  {/* searchpagination end*/}

                  <div className="table-responsive">
                    {/* page start */}
                    <div className=" d-flex justify-content-between">
                      <div className="font-weight-bold">
                        Total Data: {totalData}
                      </div>
                      <div class="pagination float-right pagination-sm border">
                        {currentPage - 3 >= 1 && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/video_gallery/video_gallery_all?page=${1}`}
                          >
                            ‹ First
                          </Link>
                        )}
                        {currentPage > 1 && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/video_gallery/video_gallery_all?page=${activePage - 1
                              }`}
                          >
                            &lt;
                          </Link>
                        )}
                        {pageNumber.map((page) => (
                          <Link
                            key={page}
                            href={`/Admin/video_gallery/video_gallery_all?page=${page}`}
                            className={` ${page === activePage
                              ? "font-bold bg-primary px-2 border-left py-1 text-white"
                              : "text-primary px-2 border-left py-1"
                              }`}
                          >
                            {" "}
                            {page}
                          </Link>
                        ))}
                        {currentPage < totalPages && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/video_gallery/video_gallery_all?page=${activePage + 1
                              }`}
                          >
                            &gt;
                          </Link>
                        )}
                        {currentPage + 3 <= totalPages && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/video_gallery/video_gallery_all?page=${totalPages}`}
                          >
                            Last ›
                          </Link>
                        )}
                      </div>
                    </div>
                    {/* page end */}
                    <table className="table table-bordered table-hover table-striped table-sm mt-2">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Video Category</th>
                          <th>Video</th>
                          <th>Status Name</th>
                          <th>Created By/Created Date</th>

                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <div
                            className="text-center"
                            style={{
                              width: "74vw",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <div className="text-center text-dark">
                              <FontAwesomeIcon
                                style={{
                                  height: "33px",
                                  width: "33px",
                                }}
                                icon={faSpinner}
                                spin
                              />
                            </div>
                          </div>
                        ) : (
                          pageUsers.map((video) => {
                            // const videoId = getYouTubeVideoId(video?.link);

                            const videoLink = video?.link; // ভিডিও লিঙ্ক নেওয়া হচ্ছে
                            const videoId = getYouTubeVideoId(videoLink);
                            return (
                              <tr key={video.id}>
                                <td style={{ width: "400px" }}>
                                  <p
                                    style={{
                                      width: "400px",

                                      margin: 0,
                                    }}
                                  >
                                    {" "}
                                    {video?.title}
                                  </p>
                                </td>
                                <td>{video?.video_category}</td>

                                <td>
                                  {videoLink ? ( // যদি ভিডিও লিঙ্ক থাকে
                                    videoId ? ( // এবং এটি ইউটিউব ভিডিও হলে
                                      <iframe
                                        width="200"
                                        height="113"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      ></iframe>
                                    ) : videoLink.includes("vimeo.com") ? ( // যদি লিঙ্কটি ভিমিওর হয়
                                      <iframe
                                        width="200"
                                        height="113"
                                        src={`https://player.vimeo.com/video/${videoLink.split("vimeo.com/")[1]
                                          }`}
                                        frameBorder="0"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                      ></iframe>
                                    ) : (
                                      // যদি এটি সাধারণ একটি ভিডিও লিঙ্ক হয়
                                      <video width="200" height="113" controls>
                                        <source
                                          src={videoLink}
                                          type="video/mp4"
                                        />
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    )
                                  ) : (
                                    <p>Invalid video link</p> // যদি ভিডিও লিঙ্কটি সঠিক না হয়, তাহলে মেসেজ দেখানো হবে
                                  )}
                                </td>

                                <td>
                                  {video?.status === 1 ? "Active" : "Inactive"}
                                </td>
                                <td>
                                  {video?.created_by}
                                  <div>
                                    {" "}
                                    {video?.created_date
                                      ? formatDateTime(video.created_date)
                                      : ""}
                                  </div>
                                </td>

                                <td>
                                  <div className="flex items-center">
                                    <Link
                                      href={`/Admin/video_gallery/video_gallery_edit/${video.id}?page_group=${page_group}`}
                                    >
                                      {filteredBtnIconEdit.map((btn) => (
                                        <button
                                          key={btn.id}
                                          title="Edit"
                                          style={{
                                            width: "35px",
                                            height: "30px",
                                            marginLeft: "5px",
                                            marginTop: "5px",
                                          }}
                                          className={btn?.btn}
                                        >
                                          <a
                                            dangerouslySetInnerHTML={{
                                              __html: btn?.icon,
                                            }}
                                          ></a>
                                        </button>
                                      ))}
                                    </Link>
                                    {/* <Link
                                      href={`/Admin/video_gallery/video_gallery_copy/${video.id}?page_group=${page_group}`}
                                    >
                                      {filteredBtnIconCopy.map((btn) => (
                                        <button
                                          key={btn.id}
                                          title="Copy"
                                          style={{
                                            width: "35px",
                                            height: "30px",
                                            marginLeft: "5px",
                                            marginTop: "5px",
                                          }}
                                          className={btn?.btn}
                                        >
                                          <a
                                            dangerouslySetInnerHTML={{
                                              __html: btn?.icon,
                                            }}
                                          ></a>
                                        </button>
                                      ))}
                                    </Link> */}
                                    {filteredBtnIconDelete.map((btn) => (
                                      <button
                                        key={btn.id}
                                        title="Delete"
                                        onClick={() =>
                                          noticeCategoryAll_delete(video.id)
                                        }
                                        style={{
                                          width: "35px",
                                          height: "30px",
                                          marginLeft: "5px",
                                          marginTop: "5px",
                                        }}
                                        className={btn?.btn}
                                      >
                                        <a
                                          dangerouslySetInnerHTML={{
                                            __html: btn?.icon,
                                          }}
                                        ></a>
                                      </button>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>

                    {/* page start */}
                    <div className=" d-flex justify-content-between">
                      <div className="font-weight-bold">
                        Total Data: {totalData}
                      </div>
                      <div class="pagination float-right pagination-sm border">
                        {currentPage - 3 >= 1 && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/video_gallery/video_gallery_all?page=${1}`}
                          >
                            ‹ First
                          </Link>
                        )}
                        {currentPage > 1 && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/video_gallery/video_gallery_all?page=${activePage - 1
                              }`}
                          >
                            &lt;
                          </Link>
                        )}
                        {pageNumber.map((page) => (
                          <Link
                            key={page}
                            href={`/Admin/video_gallery/video_gallery_all?page=${page}`}
                            className={` ${page === activePage
                              ? "font-bold bg-primary px-2 border-left py-1 text-white"
                              : "text-primary px-2 border-left py-1"
                              }`}
                          >
                            {" "}
                            {page}
                          </Link>
                        ))}
                        {currentPage < totalPages && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/video_gallery/video_gallery_all?page=${activePage + 1
                              }`}
                          >
                            &gt;
                          </Link>
                        )}
                        {currentPage + 3 <= totalPages && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/video_gallery/video_gallery_all?page=${totalPages}`}
                          >
                            Last ›
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* page end */}
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

export default VideoGalleryList;
