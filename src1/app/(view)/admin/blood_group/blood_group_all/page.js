"use client";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const BloodGroupList = ({ searchParams }) => {
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

  // data fetch
  const {
    data: photogalleryCategoryAll = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["photogalleryCategoryAll"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/blood_group/blood_group_all`
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

  const brandList = moduleInfo.filter(
    (moduleI) => moduleI.controller_name === "blood_group"
  );

  const filteredBtnIconEdit = brandList.filter((btn) => btn.method_sort === 3);
  const filteredBtnIconCopy = brandList.filter((btn) => btn.method_sort === 4);

  const filteredBtnIconDelete = brandList.filter(
    (btn) => btn.method_sort === 5
  );
  const filteredBtnIconCreate = brandList.filter(
    (btn) => btn.method_sort === 1
  );

  // Paigination start
  const parentUsers = photogalleryCategoryAll;

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
    const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/blood_group/blood_group_list_paigination/${currentPage}/${dataPerPage}`;
    const response = await fetch(url);
    const data = await response.json();
    setPageUsers(data);
  };
  useEffect(() => {
    caregory_list();
  }, [currentPage]);

  const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;

  // // Paigination end

  // const photogalleryCategoryAll_delete = (id) => {
  //   const procced = window.confirm(`Are you sure to delete this item.`);
  //   if (!procced) return; // If user cancels, exit the function

  //   fetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/blood_group/blood_group_delete/${id}`,
  //     {
  //       method: "POST",
  //     }
  //   )
  //     .then((response) => {
  //       console.log(response);
  //       if (response.ok) {
  //         refetch();
  //         caregory_list();
  //       } else {
  //         alert("Data already running. You can't delete this item.");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //       // alert("An error occurred while deleting the data. Please try again.");
  //     });
  // };


  const blood_group_delete = id => {


    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/blood_group/blood_group_delete/${id}`, {
      method: "POST",
    })
      .then(response => {
        console.log(response)
        response.json()
        if (response.ok === true) {
          const procced = window.confirm(`Are You Sure delete`)
          if (procced) {
            refetch();
            caregory_list()
          }
        }
        else {
          alert('Data already running. You cant Delete this item');
        }
      })
      .then(data => {
        if (data) {

          console.log(data);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting the data. Please try again.');
      });

  }

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
                    Blood Group List
                  </h5>
                  <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                    <Link
                      href={`/Admin/blood_group/blood_group_create?page_group`}
                      className="btn btn-sm btn-info"
                    >
                      Back to Create Blood Group
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
                            href={`/Admin/blood_group/blood_group_all?page=${1}`}
                          >
                            ‹ First
                          </Link>
                        )}
                        {currentPage > 1 && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/blood_group/blood_group_all?page=${activePage - 1
                              }`}
                          >
                            &lt;
                          </Link>
                        )}
                        {pageNumber.map((page) => (
                          <Link
                            key={page}
                            href={`/Admin/blood_group/blood_group_all?page=${page}`}
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
                            href={`/Admin/blood_group/blood_group_all?page=${activePage + 1
                              }`}
                          >
                            &gt;
                          </Link>
                        )}
                        {currentPage + 3 <= totalPages && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/blood_group/blood_group_all?page=${totalPages}`}
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
                          <th>Blood Group Name</th>
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
                          pageUsers.map((photogalleryCategoryAll, i) => (
                            <tr key={photogalleryCategoryAll.id}>
                              <td>
                                {photogalleryCategoryAll?.blood_group_name}
                              </td>

                              <td>{photogalleryCategoryAll?.created_by}</td>

                              <td>
                                {photogalleryCategoryAll?.created_date
                                  ? formatDateTime(
                                    photogalleryCategoryAll.created_date
                                  )
                                  : ""}
                              </td>

                              <td>
                                <div className="flex items-center ">
                                  <Link
                                    href={`/Admin/blood_group/blood_group_edit/${photogalleryCategoryAll.id}?page_group=${page_group}`}
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

                                  {filteredBtnIconDelete.map(
                                    (filteredBtnIconDelete) => (
                                      <button
                                        key={filteredBtnIconDelete.id}
                                        title="Delete"
                                        onClick={() =>
                                          blood_group_delete(
                                            photogalleryCategoryAll.id
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
                            href={`/Admin/blood_group/blood_group_all?page=${1}`}
                          >
                            ‹ First
                          </Link>
                        )}
                        {currentPage > 1 && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/blood_group/blood_group_all?page=${activePage - 1
                              }`}
                          >
                            &lt;
                          </Link>
                        )}
                        {pageNumber.map((page) => (
                          <Link
                            key={page}
                            href={`/Admin/blood_group/blood_group_all?page=${page}`}
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
                            href={`/Admin/blood_group/blood_group_all?page=${activePage + 1
                              }`}
                          >
                            &gt;
                          </Link>
                        )}
                        {currentPage + 3 <= totalPages && (
                          <Link
                            className=" text-primary px-2 border-left py-1"
                            href={`/Admin/blood_group/blood_group_all?page=${totalPages}`}
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

export default BloodGroupList;
