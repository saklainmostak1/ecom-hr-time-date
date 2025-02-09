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

// const VideoGalleryCategoryList = () => {
//   const {
//     data: videogalleryCategoryAll = [],
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["videogalleryCategoryAll"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery_category/video_gallery_category_all`
//       );

//       const data = await res.json();
//       return data;
//     },
//   });

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

//   // console.log(moduleInfo.filter(moduleI => moduleI.controller_name === 'brand'))
//   const brandList = moduleInfo.filter(
//     (moduleI) => moduleI.controller_name === "video_gallery_category"
//   );

//   //   console.log(filteredModuleInfo);

//   const filteredBtnIconEdit = brandList.filter((btn) => btn.method_sort === 3);
//   const filteredBtnIconCopy = brandList.filter((btn) => btn.method_sort === 4);

//   const filteredBtnIconDelete = brandList.filter(
//     (btn) => btn.method_sort === 5
//   );
//   const filteredBtnIconCreate = brandList.filter(
//     (btn) => btn.method_sort === 1
//   );

//   const videogalleryCategoryAll_delete = (id) => {
//     console.log(id);
//     const proceed = window.confirm(`Are You Sure delete${id}`);
//     if (proceed) {
//       fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery_category/video_gallery_category_delete/${id}`,
//         {
//           method: "POST",
//         }
//       )
//         .then((Response) => Response.json())
//         .then((data) => {
//           refetch();
//           console.log(data);
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
//                     Video Gallery Category List
//                   </h5>
//                   <div className="card-title font-weight-bold mb-0 card-header-color float-right">
//                     <Link
//                       href={`/Admin/video_gallery_category/video_gallery_category_create?page_group`}
//                       className="btn btn-sm btn-info"
//                     >
//                       Create Video Gallery Category List
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
//                 <div class="card-body">
//                   <div className="table-responsive">
//                     <table className="table  table-bordered table-hover table-striped table-sm">
//                       <thead>
//                         <tr>
//                           <th>Name</th>
//                           <th>Status</th>
//                           <th>Created By</th>
//                           <th>Created Date</th>
//                           <th>Action</th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {isLoading ? (
//                           <div className="text-center">
//                             <div className="  text-center text-dark">
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
//                           videogalleryCategoryAll.map(
//                             (videogalleryCategoryAll, i) => (
//                               <tr key={videogalleryCategoryAll.id}>
//                                 <td>{videogalleryCategoryAll?.name}</td>
//                                 <td>
//                                   {videogalleryCategoryAll?.status === 1
//                                     ? "Active"
//                                     : "Inactive"}
//                                 </td>
//                                 <td>{videogalleryCategoryAll?.author_name}</td>

//                                 <td>
//                                   {videogalleryCategoryAll?.created_date
//                                     ? formatDateTime(
//                                         videogalleryCategoryAll.created_date
//                                       )
//                                     : ""}
//                                 </td>

//                                 <td>
//                                   <div className="flex items-center ">
//                                     <Link
//                                       href={`/Admin/video_gallery_category/video_gallery_category_edit/${videogalleryCategoryAll.id}?page_group=${page_group}`}
//                                     >
//                                       {filteredBtnIconEdit?.map(
//                                         (filteredBtnIconEdit) => (
//                                           <button
//                                             key={filteredBtnIconEdit.id}
//                                             title="Edit"
//                                             style={{
//                                               width: "35px ",
//                                               height: "30px",
//                                               marginLeft: "5px",
//                                               marginTop: "5px",
//                                             }}
//                                             className={filteredBtnIconEdit?.btn}
//                                           >
//                                             <a
//                                               dangerouslySetInnerHTML={{
//                                                 __html:
//                                                   filteredBtnIconEdit?.icon,
//                                               }}
//                                             ></a>
//                                           </button>
//                                         )
//                                       )}
//                                     </Link>
//                                     <Link
//                                       href={`/Admin/video_gallery_category/video_gallery_category_copy/${videogalleryCategoryAll.id}?page_group=${page_group}`}
//                                     >
//                                       {filteredBtnIconCopy.map(
//                                         (filteredBtnIconEdit) => (
//                                           <button
//                                             key={filteredBtnIconEdit.id}
//                                             title="Copy"
//                                             style={{
//                                               width: "35px ",
//                                               height: "30px",
//                                               marginLeft: "5px",
//                                               marginTop: "5px",
//                                             }}
//                                             className={filteredBtnIconEdit?.btn}
//                                           >
//                                             <a
//                                               dangerouslySetInnerHTML={{
//                                                 __html:
//                                                   filteredBtnIconEdit?.icon,
//                                               }}
//                                             ></a>
//                                           </button>
//                                         )
//                                       )}
//                                     </Link>
//                                     {filteredBtnIconDelete.map(
//                                       (filteredBtnIconDelete) => (
//                                         <button
//                                           key={filteredBtnIconDelete.id}
//                                           title="Delete"
//                                           onClick={() =>
//                                             videogalleryCategoryAll_delete(
//                                               videogalleryCategoryAll.id
//                                             )
//                                           }
//                                           style={{
//                                             width: "35px ",
//                                             height: "30px",
//                                             marginLeft: "5px",
//                                             marginTop: "5px",
//                                           }}
//                                           className={filteredBtnIconDelete?.btn}
//                                         >
//                                           <a
//                                             dangerouslySetInnerHTML={{
//                                               __html:
//                                                 filteredBtnIconDelete?.icon,
//                                             }}
//                                           ></a>
//                                         </button>
//                                       )
//                                     )}
//                                   </div>
//                                 </td>
//                               </tr>
//                             )
//                           )
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

// export default VideoGalleryCategoryList;

"use client";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
};

const VideoGalleryCategoryList = ({ searchParams }) => {
  const {
    data: noticeCategoryAll = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["noticeCategoryAll"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery_category/video_gallery_category_all`
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
    (moduleI) => moduleI.controller_name === "video_gallery_category"
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

  // Paigination start
  const parentUsers = noticeCategoryAll;

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
    const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery_category/video_category_list_paigination/${currentPage}/${dataPerPage}`;
    const response = await fetch(url);
    const data = await response.json();
    setPageUsers(data);
  };
  useEffect(() => {
    caregory_list();
  }, [currentPage]);

  const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;

  // Paigination end

  // const noticeCategoryAll_delete = (id) => {
  //   console.log(id);
  //   const procced = window.confirm(`Are you sure to delete this item.`);
  //   if (!procced) return;
  //   // const proceed = window.confirm(`Are You Sure delete${id}`)
  //   fetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice_category/notice_category_delete/${id}`,
  //     {
  //       method: "POST",
  //     }
  //   )
  //     .then((response) => {
  //       console.log(response);
  //       response.json();
  //       if (response.ok === true) {
  //         refetch();
  //         caregory_list();
  //       } else {
  //         alert("Data already running. You cant Delete this item.");
  //       }
  //     })
  //     .then((data) => {
  //       if (data) {
  //         refetch();
  //         console.log(data);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //       // alert("An error occurred while deleting the data. Please try again.");
  //     });
  // };

  // const noticeCategoryAll_delete = (id) => {
  //   console.log(id);

  //   // const proceed = window.confirm(`Are You Sure delete${id}`)
  //   fetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery_category/video_gallery_category_delete/${id}`,
  //     {
  //       method: "POST",
  //     }
  //   )
  //     .then((response) => {
  //       console.log(response);
  //       response.json();
  //       if (response.ok === true) {
  //         const procced = window.confirm(`Are you sure delete this item.`);
  //         if (procced) refetch();
  //         caregory_list();
  //       } else {
  //         alert("Data already running. You cant Delete this item.");
  //       }
  //     })
  //     .then((data) => {
  //       if (data) {
  //         console.log(data);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //       alert("An error occurred while deleting the data. Please try again.");
  //     });
  // };

  const noticeCategoryAll_delete = async (id) => {
    console.log(id);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery_category/video_gallery_category_delete/${id}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const proceed = window.confirm(
          "Are you sure you want to delete this item?"
        );
        if (proceed) {
          refetch();
          caregory_list();
          console.log("Item deleted successfully.");
        } else {
          console.log("Delete action canceled.");
        }
      } else {
        alert("Data already running. You can't delete this item.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the data. Please try again.");
    }
  };

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
          <div className="card">
            <div className="body-content bg-light">
              <div className="border-primary shadow-sm border-0">
                <div className="card-header py-1 custom-card-header clearfix bg-gradient-primary text-white">
                  <h5 className="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
                    Video Gallery Category List
                  </h5>
                  <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                    <Link
                      href={`/Admin/video_gallery_category/video_gallery_category_create?page_group`}
                      className="btn btn-sm btn-info"
                    >
                      Back to  Create Video Gallery Category
                    </Link>
                  </div>
                </div>

                <div class="card-body">
                  <div className="table-responsive">
                    {/* page start */}
                    <div className=" d-flex justify-content-between">
                      <div>Total Data: {totalData}</div>
                      <div class="pagination float-right pagination-sm border">
                        {currentPage - 3 >= 1 && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/video_gallery_category/video_gallery_category_all?page=${1}`}
                          >
                            ‹ First
                          </Link>
                        )}
                        {currentPage > 1 && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/video_gallery_category/video_gallery_category_all?page=${activePage - 1
                              }`}
                          >
                            &lt;
                          </Link>
                        )}
                        {pageNumber.map((page) => (
                          <Link
                            key={page}
                            href={`/Admin/video_gallery_category/video_gallery_category_all?page=${page}`}
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
                            href={`/Admin/video_gallery_category/video_gallery_category_all?page=${activePage + 1
                              }`}
                          >
                            &gt;
                          </Link>
                        )}
                        {currentPage + 3 <= totalPages && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/video_gallery_category/video_gallery_category_all?page=${totalPages}`}
                          >
                            Last ›
                          </Link>
                        )}
                      </div>
                    </div>
                    {/* page end */}
                    <table className="table  table-bordered table-hover table-striped table-sm">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Created By</th>
                          <th>Created Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {isLoading ? (
                          <div className="text-center">
                            <div className="  text-center text-dark">
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
                          pageUsers.map((noticeCategoryAll, i) => (
                            <tr key={noticeCategoryAll.id}>
                              <td>{noticeCategoryAll?.name}</td>
                              <td>
                                {noticeCategoryAll?.status === 1
                                  ? "Active"
                                  : "Inactive"}
                              </td>
                              <td>{noticeCategoryAll?.created_by}</td>

                              <td>
                                {noticeCategoryAll?.created_date
                                  ? formatDateTime(
                                    noticeCategoryAll.created_date
                                  )
                                  : ""}
                              </td>

                              <td>
                                <div className="flex items-center ">
                                  <Link
                                    href={`/Admin/video_gallery_category/video_gallery_category_edit/${noticeCategoryAll.id}?page_group=${page_group}`}
                                  >
                                    {filteredBtnIconEdit?.map(
                                      (filteredBtnIconEdit) => (
                                        <button
                                          key={filteredBtnIconEdit.id}
                                          title="Edit"
                                          style={{
                                            width: "35px ",
                                            height: "30px",
                                            marginLeft: "5px",
                                            marginTop: "5px",
                                          }}
                                          className={filteredBtnIconEdit?.btn}
                                        >
                                          <a
                                            dangerouslySetInnerHTML={{
                                              __html: filteredBtnIconEdit?.icon,
                                            }}
                                          ></a>
                                        </button>
                                      )
                                    )}
                                  </Link>
                                  {/* <Link
                                    href={`/Admin/notice_category/notice_category_copy/${noticeCategoryAll.id}?page_group=${page_group}`}
                                  >
                                    {filteredBtnIconCopy.map(
                                      (filteredBtnIconEdit) => (
                                        <button
                                          key={filteredBtnIconEdit.id}
                                          title="Copy"
                                          style={{
                                            width: "35px ",
                                            height: "30px",
                                            marginLeft: "5px",
                                            marginTop: "5px",
                                          }}
                                          className={filteredBtnIconEdit?.btn}
                                        >
                                          <a
                                            dangerouslySetInnerHTML={{
                                              __html: filteredBtnIconEdit?.icon,
                                            }}
                                          ></a>
                                        </button>
                                      )
                                    )}
                                  </Link> */}
                                  {filteredBtnIconDelete.map(
                                    (filteredBtnIconDelete) => (
                                      <button
                                        key={filteredBtnIconDelete.id}
                                        title="Delete"
                                        onClick={() =>
                                          noticeCategoryAll_delete(
                                            noticeCategoryAll.id
                                          )
                                        }
                                        style={{
                                          width: "35px ",
                                          height: "30px",
                                          marginLeft: "5px",
                                          marginTop: "5px",
                                        }}
                                        className={filteredBtnIconDelete?.btn}
                                      >
                                        <a
                                          dangerouslySetInnerHTML={{
                                            __html: filteredBtnIconDelete?.icon,
                                          }}
                                        ></a>
                                      </button>
                                    )
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {/* page start */}
                    <div className=" d-flex justify-content-between">
                      <div>Total Data: {totalData}</div>
                      <div class="pagination float-right pagination-sm border">
                        {currentPage - 3 >= 1 && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/video_gallery_category/video_gallery_category_all?page=${1}`}
                          >
                            ‹ First
                          </Link>
                        )}
                        {currentPage > 1 && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/video_gallery_category/video_gallery_category_all?page=${activePage - 1
                              }`}
                          >
                            &lt;
                          </Link>
                        )}
                        {pageNumber.map((page) => (
                          <Link
                            key={page}
                            href={`/Admin/video_gallery_category/video_gallery_category_all?page=${page}`}
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
                            href={`/Admin/video_gallery_category/video_gallery_category_all?page=${activePage + 1
                              }`}
                          >
                            &gt;
                          </Link>
                        )}
                        {currentPage + 3 <= totalPages && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/video_gallery_category/video_gallery_category_all?page=${totalPages}`}
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

export default VideoGalleryCategoryList;
