"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CopyleaveCategory = ({ id }) => {


  const [created_by, setCreated_by] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId') || '';
    }
    return '';
  });

  // Effect to initialize created_by state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      setCreated_by(storedUserId);
    }
  }, []);

  const [name, setName] = useState([])
  const [sameBrandName, setSameBrandName] = useState([])


  const { data: brands = []
  } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_category/leave_category_all`)

      const data = await res.json()
      return data
    }
  })



  const [formData, setFormData] = useState({
    name: "",
    created_by: created_by,
  });

  const {
    data: leaveCategorySingle,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["leaveCategorySingle", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_category/leave_category_all/${id}`
      );
      const data = await res.json();
      return data;
    },
  });
  console.log(leaveCategorySingle)
  useEffect(() => {
    if (leaveCategorySingle && leaveCategorySingle[0]) {
      const { name } = leaveCategorySingle[0];
      setFormData({
        name,
        created_by: localStorage.getItem("userId"),
      });
    }
  }, [leaveCategorySingle]);
  console.log(formData)
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      total: parseFloat(prevData.basic),
    }));
  }, [formData.basic]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'name') {
      setName('')
    }

    const existingBrand = brands.find((brand) => brand?.name?.toLowerCase() === formData?.name?.toLowerCase());
    if (!existingBrand) {
      // Show error message
      setSameBrandName("");
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
      setName('Leave Category name is required')
      return
    }

    const normalizebrandName = (name) => {
      return name?.trim().replace(/\s+/g, '');
    };


    const existingBrand = brands.find((brand) => normalizebrandName(brand.name.toLowerCase()) === normalizebrandName(formData.name.toLowerCase()));
    if (existingBrand) {
      // Show error message
      setSameBrandName("Leave Category name already exists. Please choose a different Leave Category name.");
      return

    }


    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/leave_category/leave_category_create`,
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
        sessionStorage.setItem("message", "Data Copy successfully!");
        router.push(`/Admin/leave_category/leave_category_all`)
      }
      // Handle response data or success message
    } catch (error) {
      console.error("Error updating school shift:", error);
      // Handle error or show an error message to the user
    }
  };
  console.log(leaveCategorySingle);
  return (
    <div class="container-fluid">
      <div class=" row ">
        <div className="col-12 p-4">
          <div className="card">
            <div className="card-default">
              <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
                <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">
                  Copy{" "}
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
                  <Link
                    href="/Admin/leave_category/leave_category_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to Leave Category List
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
                      Leave Category Name:
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
                        placeholder="Enter  Leave Category Name"
                        type="text"
                        name="name"
                      />

                      {
                        name && <p className="text-danger m-0">{name}</p>
                      }
                      {
                        sameBrandName && <p className="text-danger m-0">{sameBrandName}</p>
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

export default CopyleaveCategory;
