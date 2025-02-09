"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EditDesignation = ({ id }) => {
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
    designation_name: "",
    serial_number: "",
    modified_by: userId,
  });

  const [errorMessages, setErrorMessages] = useState({
    designation_name: "",
    serial_number: "",
  });

  const [existingDesignations, setExistingDesignations] = useState([]);
  const [designations, setDesignations] = useState([]);

  const {
    data: noticeCategorySingle,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["noticeCategorySingle", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_all/${id}`
      );
      const data = await res.json();

      return data;
    },
  });

  useEffect(() => {
    if (noticeCategorySingle && noticeCategorySingle[0]) {
      const { designation_name, serial_number } = noticeCategorySingle[0];
      setFormData({
        designation_name,
        serial_number: serial_number.toString(), // Ensure serial_number is a string
        modified_by: userId,
      });
    }
  }, [noticeCategorySingle, userId]);

  // useEffect(() => {
  //   const fetchDesignations = async () => {
  //     try {
  //       const res = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_all`
  //       );
  //       const data = await res.json();
  //       setDesignations(data);
  //     } catch (error) {
  //       console.error("Error fetching designations:", error);
  //     }
  //   };

  //   fetchDesignations();
  // }, []);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_all`
        );
        const data = await res.json();
        const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
        // return filteredBrands;
        setDesignations(data);
        setExistingDesignations(filteredBrands); // existingDesignations স্টেট আপডেট করা হচ্ছে
      } catch (error) {
        console.error("Error fetching designations:", error);
      }
    };

    fetchDesignations();
  }, [id]);

  const {
    data: noticeCategoryAll = [],

  } = useQuery({
    queryKey: ["noticeCategoryAll"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_all`
      );

      const data = await res.json();
      const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
      return filteredBrands;
      // return data;
    },
  });
  const [sameBrandName, setSameBrandName] = useState([])
  const handleChange = (event) => {
    const { name, value } = event.target;


    const existingBrand = existingDesignations.find((brand) => brand?.designation_name?.toLowerCase() === formData?.designation_name?.toLowerCase());
    if (!existingBrand) {
      // Show error message
      setSameBrandName("");
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));


    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear specific error message when the user starts typing
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = {
      designation_name: "",
      serial_number: "",
    };

    if (!formData.designation_name.trim()) {
      newErrors.designation_name = "Designation name is required.";
      hasErrors = true;
    }

    if (!formData.serial_number.trim()) {
      newErrors.serial_number = "Sorting number is required.";
      hasErrors = true;
    }

    if (parseInt(formData.serial_number) > 200) {
      newErrors.serial_number = "Sorting number cannot exceed 200.";
      hasErrors = true;
    }

    const normalizedSerialNumber = String(formData.serial_number).trim(); // Convert to string and trim

    const isDuplicateSerialNumber = existingDesignations.some(
      (item) => String(item.serial_number).trim() === normalizedSerialNumber
    );

    if (isDuplicateSerialNumber) {
      newErrors.serial_number = "Sorting number already exists.";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrorMessages(newErrors);
      return;
    }

    const normalizebrandName = (name) => {
      return name?.trim().replace(/\s+/g, '');
    };


    const existingBrand = existingDesignations.find((brand) => normalizebrandName(brand.designation_name.toLowerCase()) === normalizebrandName(formData.designation_name.toLowerCase()));
    if (existingBrand) {
      // Show error message
      setSameBrandName("Designation name already exists. Please choose a different Designation name.");
      return

    }


    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_edit/${id}`,
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
          sessionStorage.setItem("message", "Data saved successfully!");
        }
        router.push("/Admin/designation/designation_all");
      }
    } catch (error) {
      console.error("Error updating designation:", error);
      setErrorMessages({
        ...errorMessages,
        general: "An error occurred. Please try again.",
      });
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
                  Edit Designation
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                  <Link
                    href="/Admin/designation/designation_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to Designation List
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
                {errorMessages.general && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessages.general}
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
                      Designation Name:
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
                        value={formData.designation_name}
                        className="form-control form-control-sm required"
                        id="designation_name"
                        placeholder="Enter Designation"
                        type="text"
                        name="designation_name"
                      />
                      {errorMessages.designation_name && (
                        <div className="text-danger mt-2">
                          {errorMessages.designation_name}
                        </div>
                      )}

                      {
                        sameBrandName && <p className="text-danger">{sameBrandName}</p>
                      }
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label font-weight-bold col-md-3">
                      Serial Number:
                      <small>
                        <sup>
                          <small>
                            <i className="text-danger fas fa-star"></i>
                          </small>
                        </sup>
                      </small>
                    </label>
                    <div className="col-md-6">
                      <select
                        name="serial_number"
                        className="form-control form-control-sm trim integer_no_zero serial_number"
                        id="serial_number"
                        value={formData.serial_number}
                        onChange={handleChange}
                      >
                        {Array.from({ length: 200 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}

                      </select>
                      {/* <input
                        required
                        value={formData.serial_number}
                        onChange={handleChange}
                        className="form-control form-control-sm required"
                        id="serial_number"
                        placeholder="Enter Serial Number"
                        type="number"
                        name="serial_number"
                      /> */}
                      {errorMessages.serial_number && (
                        <div className="text-danger mt-2">
                          {errorMessages.serial_number}
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

export default EditDesignation;
