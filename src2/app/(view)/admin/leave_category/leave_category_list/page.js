"use client";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const LeaveCategoryList = ({ searchParams }) => {
  const {
    data: leaveCategoryAll = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["leaveCategoryAll"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_category/leave_category_all`
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
    (moduleI) => moduleI.controller_name === "leave_category"
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


  const parentUsers = leaveCategoryAll

  const totalData = parentUsers?.length
  const dataPerPage = 20

  const totalPages = Math.ceil(totalData / dataPerPage)

  let currentPage = 1


  if (Number(searchParams.page) >= 1) {
    currentPage = Number(searchParams.page)
  }


  let pageNumber = []
  for (let index = currentPage - 2; index <= currentPage + 2; index++) {
    if (index < 1) {
      continue
    }
    if (index > totalPages) {
      break
    }
    pageNumber.push(index)
  }
  const [pageUsers, setPageUsers] = useState([]);
  const caregory_list = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_category/leave_category_all_paigination/${currentPage}/${dataPerPage}`;
    const response = await fetch(url);
    const data = await response.json();
    setPageUsers(data);
  };
  useEffect(() => {
    caregory_list();
  }, [currentPage]);

  const activePage = searchParams?.page ? parseInt(searchParams.page) : 1;


  // const leaveCategoryAll_delete = (id) => {
  //   console.log(id);
  //   const proceed = window.confirm(`Are You Sure delete${id}`);
  //   if (proceed) {
  //     fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_category/leave_category_delete/${id}`,
  //       {
  //         method: "POST",
  //       }
  //     )
  //       .then((Response) => Response.json())
  //       .then((data) => {
  //         refetch();
  //         console.log(data);
  //       });
  //   }
  // };

  const leaveCategoryAll_delete = id => {


    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_category/leave_category_delete/${id}`, {
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
    if (sessionStorage.getItem("message")) {
      setMessage(sessionStorage.getItem("message"));
      sessionStorage.removeItem("message");
    }
  }, []);

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
                    Leave Category List
                  </h5>
                  <div className="card-title font-weight-bold mb-0 card-header-color float-right">
                    <Link
                      href={`/Admin/leave_category/leave_category_create?page_group`}
                      className="btn btn-sm btn-info"
                    >
                      Create Leave Category
                    </Link>
                  </div>
                </div>
                <div
                  className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold"
                  role="alert"
                >
                  (
                  <small>
                    <sup>
                      <i className="text-danger fas fa-star"></i>
                    </sup>
                  </small>
                  ) field required
                </div>
                <div class="card-body">
                  <div className="table-responsive">

                    <div className=" d-flex justify-content-between">
                      <div>
                        Total Data: {totalData}
                      </div>
                      <div class="pagination float-right pagination-sm border">
                        {
                          currentPage - 3 >= 1 && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_category/leave_category_all?page=${1}`}>‹ First</Link>
                          )
                        }
                        {
                          currentPage > 1 && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_category/leave_category_all?page=${activePage - 1}`}>&lt;</Link>
                          )
                        }
                        {
                          pageNumber.map((page) =>
                            <Link
                              key={page}
                              href={`/Admin/leave_category/leave_category_all?page=${page}`}
                              className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                            > {page}
                            </Link>
                          )
                        }
                        {
                          currentPage < totalPages && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_category/leave_category_all?page=${activePage + 1}`}>&gt;</Link>
                          )
                        }
                        {
                          currentPage + 3 <= totalPages && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_category/leave_category_all?page=${totalPages}`}>Last ›</Link>
                          )
                        }
                      </div>

                    </div>

                    <table className="table  table-bordered table-hover table-striped table-sm">
                      <thead>
                        <tr>
                          <th>Serial</th>
                          <th> Leave Category Name</th>
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
                          pageUsers.map((leaveCategoryAll, i) => (
                            <tr key={leaveCategoryAll.id}>
                              <td> {i + 1}</td>

                              <td>{leaveCategoryAll?.name}</td>

                              <td>
                                <div className="flex items-center ">
                                  <Link
                                    href={`/Admin/leave_category/leave_category_edit/${leaveCategoryAll.id}?page_group=${page_group}`}
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
                                  <Link
                                    href={`/Admin/leave_category/leave_category_copy/${leaveCategoryAll.id}?page_group=${page_group}`}
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
                                  </Link>
                                  {filteredBtnIconDelete.map(
                                    (filteredBtnIconDelete) => (
                                      <button
                                        key={filteredBtnIconDelete.id}
                                        title="Delete"
                                        onClick={() =>
                                          leaveCategoryAll_delete(
                                            leaveCategoryAll.id
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
                    <div className=" d-flex justify-content-between">
                      <div>
                        Total Data: {totalData}
                      </div>
                      <div class="pagination float-right pagination-sm border">
                        {
                          currentPage - 3 >= 1 && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_category/leave_category_all?page=${1}`}>‹ First</Link>
                          )
                        }
                        {
                          currentPage > 1 && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_category/leave_category_all?page=${activePage - 1}`}>&lt;</Link>
                          )
                        }
                        {
                          pageNumber.map((page) =>
                            <Link
                              key={page}
                              href={`/Admin/leave_category/leave_category_all?page=${page}`}
                              className={` ${page === activePage ? "font-bold bg-primary px-2 border-left py-1 text-white" : "text-primary px-2 border-left py-1"}`}
                            > {page}
                            </Link>
                          )
                        }
                        {
                          currentPage < totalPages && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_category/leave_category_all?page=${activePage + 1}`}>&gt;</Link>
                          )
                        }
                        {
                          currentPage + 3 <= totalPages && (
                            <Link className=" text-primary px-2 border-left py-1" href={`/Admin/leave_category/leave_category_all?page=${totalPages}`}>Last ›</Link>
                          )
                        }
                      </div>

                    </div>
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

export default LeaveCategoryList;
