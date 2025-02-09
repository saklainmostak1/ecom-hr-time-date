"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CopyPhotoGalleryCategory = ({ id }) => {


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

  const {
    data: photogallerycategorySingle,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["photogallerycategorySingle", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/events_category/events_category_all/${id}`
      );
      const data = await res.json();
      return data;
    },
  });

  useEffect(() => {
    if (photogallerycategorySingle && photogallerycategorySingle[0]) {
      const { name, status } = photogallerycategorySingle[0];
      setFormData({
        name,
        status,
        created_by: userId,
      });
    }
  }, [photogallerycategorySingle, userId]);

  console.log(photogallerycategorySingle);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/events_category/events_category_create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      console.log(data); // Handle response data or success message
    } catch (error) {
      console.error("Error updating school shift:", error);
      // Handle error or show an error message to the user
    }
  };
  console.log(photogallerycategorySingle);
  return (
    <div class="container-fluid">
      <div class=" row ">
        <div className="col-12 p-4">
          <div className="card">
            <div className="card-default">
              <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">
                  Edit Photo Gallery Category
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                  <Link
                    href="/Admin/events_category/events_category_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to Photo Gallery Category
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

export default CopyPhotoGalleryCategory;
