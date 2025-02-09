"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CopynewsCategory = ({ id }) => {


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

  const [formData, setFormData] = useState({
    name: "",
    status: "",
    created_by: userId,
  });

  const [status, setStatus] = useState([])


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
      .then(res => res.json())
      .then(data => setStatus(data))
  }, [])


  const [name, setName] = useState([])
  const [statuss, setstatus] = useState([])
  const [errorMessage, setErrorMessage] = useState([])

  const { data: noticeCategoryAll = [] } = useQuery({
    queryKey: ["noticeCategoryAll"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/news_category/news_category_all`
      );
      const data = await res.json();
      return data;
    },
  });

  const {
    data: newsSingle,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["newsSingle", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/news_category/news_category_all/${id}`
      );
      const data = await res.json();
      return data;
    },
  });

  useEffect(() => {
    if (newsSingle && newsSingle[0]) {
      const { name, status } = newsSingle[0];
      setFormData({
        name,
        status,
        created_by: userId,
      });
    }
  }, [newsSingle, userId]);

  console.log(newsSingle);

  const handleChange = (event) => {
    const { name, value } = event.target;


    if (name === 'name') {
      setName('')
    }
    if (name === 'status') {
      setstatus('')
    }

    const existingBrand = noticeCategoryAll.find((brand) => brand?.name?.toLowerCase() === formData?.company_type_name?.toLowerCase());
    if (!existingBrand) {
      // Show error message
      setErrorMessage("");
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!formData.name) {
      setName('News Category name  is required')
      return
    }
    if (!formData.status) {
      setstatus('Status  is required')
      return
    }

    const normalizebrandName = (name) => {
      return name?.trim().replace(/\s+/g, '');
    };


    const existingBrand = noticeCategoryAll.find((brand) => normalizebrandName(brand.name.toLowerCase()) === normalizebrandName(formData.name.toLowerCase()));
    if (existingBrand) {
      // Show error message
      setErrorMessage("News Category name already exists. Please choose a different News Category name.");
      return

    }


    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/news_category/news_category_create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem("message", "Data saved successfully!");
        }
        router.push("/Admin/news_category/news_category_all");
      }  // Handle response data or success message
    } catch (error) {
      console.error("Error updating school shift:", error);
      // Handle error or show an error message to the user
    }
  };
  console.log(newsSingle);
  return (
    <div class="container-fluid">
      <div class=" row ">
        <div className="col-12 p-4">
          <div className="card">
            <div className="card-default">
              <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">
                  Edit News Category
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                  <Link
                    href="/Admin/news_category/news_category_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to News Category List
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
              <div className="card-body">
                <form
                  className="form-horizontal"
                  method="post"
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <div class="form-group row">
                    <label class="col-form-label font-weight-bold col-md-3">
                      Name:
                      <small>
                        <sup>
                          <small>
                            <i class="text-danger fas fa-star"></i>
                          </small>
                        </sup>
                      </small>
                    </label>
                    <div class="col-md-6">
                      <input
                        required=""
                        onChange={handleChange}
                        value={formData.name}
                        class="form-control form-control-sm required"
                        id="title"
                        placeholder="Enter Name"
                        type="text"
                        name="name"
                      />
                      {
                        name && <p className="text-danger m-0">{name}</p>
                      }
                      {
                        errorMessage && <p className="text-danger m-0">{errorMessage}</p>
                      }
                    </div>
                  </div>

                  <div class="form-group row">
                    <label class="col-form-label font-weight-bold col-md-3">
                      Status:
                      <small>
                        <sup>
                          <small>
                            <i class="text-danger fas fa-star"></i>
                          </small>
                        </sup>
                      </small>
                    </label>
                    <div class="col-md-6">
                      <select
                        onChange={handleChange}
                        value={formData.status}
                        name="status"
                        id="status"
                        class="form-control form-control-sm required"
                        placeholder="Enter Status"
                      >
                        <option>Select Status</option>
                        {
                          status.map(sta =>
                            <>
                              <option value={sta.id}>{sta.status_name}</option>
                            </>
                          )
                        }
                      </select>
                      {
                        statuss && <p className="text-danger m-0">{statuss}</p>
                      }
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="offset-md-3 col-sm-6">
                      <input
                        type="submit"
                        name="create"
                        className="btn btn-success btn-sm"
                        value="Submit"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopynewsCategory;
