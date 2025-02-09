"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EditBloodGroup = ({ id }) => {
  const router = useRouter();

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
    blood_group_name: "",
    modified_by: userId,
  });
  const [errors, setErrors] = useState({
    blood_group_name: "",
  });

  const { data: newsCategorySingle } = useQuery({
    queryKey: ["newsCategorySingle", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/blood_group/blood_group_all/${id}`
      );
      const data = await res.json();
      return data;
    },
  });

  useEffect(() => {
    if (newsCategorySingle && newsCategorySingle[0]) {
      const { blood_group_name } = newsCategorySingle[0];
      setFormData({
        blood_group_name,
        modified_by: userId,
      });
    }
  }, [newsCategorySingle, userId]);

  const { data: bloodgroups = [] } = useQuery({
    queryKey: ["bloodgroups"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/blood_group/blood_group_all`
      );
      const data = await res.json();
      const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
      return filteredBrands;
    },
  });



  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear specific error message when user updates field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasErrors = false;

    const normalizedCurrentName = formData.blood_group_name
      .trim()
      .replace(/\s+/g, "")
      .toLowerCase();
    const duplicate = bloodgroups.some(
      (existingGroup) =>
        existingGroup.blood_group_name
          .trim()
          .replace(/\s+/g, "")
          .toLowerCase() === normalizedCurrentName && existingGroup.id !== id
    );

    const newErrors = {
      blood_group_name: duplicate
        ? "Blood Group name already exists. Please choose a different name."
        : "",
    };

    if (duplicate) {
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/blood_group/blood_group_edit/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem("message", "Data Updated successfully!");
      }
        router.push("/Admin/blood_group/blood_group_all");
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          form: "Error updating blood group. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Error updating blood group:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: "An error occurred while updating the blood group.",
      }));
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 p-4">
          <div className="card">
            <div className="card-default">
              <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                <h5 className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">
                  Edit Blood Group
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                  <Link
                    href="/Admin/blood_group/blood_group_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to Blood Group List
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
                {errors.form && (
                  <div className="alert alert-danger" role="alert">
                    {errors.form}
                  </div>
                )}
                <form
                  className="form-horizontal"
                  method="post"
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <div className="form-group row">
                    <label className="col-form-label font-weight-bold col-md-3">
                      Blood Group Name:
                      <small>
                        <sup>
                          <small>
                            <i className="text-danger fas fa-star"></i>
                          </small>
                        </sup>
                      </small>
                    </label>
                    <div className="col-md-6">
                      <input
                        required
                        onChange={handleChange}
                        value={formData.blood_group_name}
                        className="form-control form-control-sm required"
                        id="blood_group_name"
                        placeholder="Enter Blood Group Name"
                        type="text"
                        name="blood_group_name"
                      />
                      {errors.blood_group_name && (
                        <div className="text-danger mt-1">
                          {errors.blood_group_name}
                        </div>
                      )}
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

export default EditBloodGroup;
