"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const DesignationCreate = () => {


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


  const [errorMessage, setErrorMessage] = useState([])

  const router = useRouter();


  const {
    data: designations = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["designations"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_all`
      );

      const data = await res.json();
      return data;
    },
  });

  const [formData, setFormData] = useState({
    designation_name: "",
    serial_number: "",
    created_by: created_by,
  });

  const [errorMessages, setErrorMessages] = useState({
    designation_name: "",
    serial_number: "",
  });

  // Simulate fetching existing designations
  const [existingDesignations, setExistingDesignations] = useState([]);

  useEffect(() => {
    // Fetch existing designations here
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_all`
    )
      .then((response) => response.json())
      .then((data) => setExistingDesignations(data))
      .catch((error) =>
        console.error("Error fetching existing designations:", error)
      );
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;


    const existingBrand = designations.find((brand) => brand?.designation_name?.toLowerCase() === formData?.designation_name?.toLowerCase());
    if (!existingBrand) {
      // Show error message
      setErrorMessage("");
    }


    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error message when user updates fields
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let hasErrors = false;
    const newErrors = {
      designation_name: "",
      serial_number: "",
    };

    if (!formData.designation_name.trim().replace(/\s+/g, "").toLowerCase()) {
      newErrors.designation_name = "Designation name is required.";
      hasErrors = true;
    }

    if (!formData.serial_number.trim().replace(/\s+/g, "").toLowerCase()) {
      newErrors.serial_number = "Sorting number is required.";
      hasErrors = true;
    }

    if (parseInt(formData.serial_number) > 200) {
      newErrors.serial_number = "Sorting number cannot exceed 200.";
      hasErrors = true;
    }

    const normalizedDesignationName = String(formData.designation_name)
      .trim()
      .replace(/\s+/g, "")
      .toLowerCase(); // Convert to string and trim

    const isDuplicateDesigNationName = existingDesignations.some(
      (item) =>
        String(item.designation_name)
          .trim()
          .replace(/\s+/g, "")
          .toLowerCase() === normalizedDesignationName // Convert to string and trim
    );

    if (isDuplicateDesigNationName) {
      newErrors.designation_name = "Designation Name already exists.";
      hasErrors = true;
    }

    const normalizedSerialNumber = String(formData.serial_number)
      .trim()
      .replace(/\s+/g, "")
      .toLowerCase(); // Convert to string and trim

    const isDuplicateSerialNumber = existingDesignations.some(
      (item) =>
        String(item.serial_number).trim().replace(/\s+/g, "").toLowerCase() ===
        normalizedSerialNumber // Convert to string and trim
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


    const existingBrand = designations.find((brand) => normalizebrandName(brand.designation_name.toLowerCase()) === normalizebrandName(formData.designation_name.toLowerCase()));
    if (existingBrand) {
      // Show error message
      setErrorMessage("company type name already exists. Please choose a different company type name.");
      return

    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/designation/designation_create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem("message", "Data saved successfully!");
        }
        router.push("/Admin/designation/designation_all");
      } else {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          general: "Failed to save data. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Error creating designation:", error);
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        general: "An error occurred while saving data. Please try again.",
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
                  Create Designation
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
                <form
                  className="form-horizontal"
                  method="post"
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <div className="form-group row">
                    <label className="col-form-label font-weight-bold col-md-3">
                      Designation:
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

                        onChange={handleChange}
                        value={formData.designation_name}
                        className="form-control form-control-sm required"
                        id="designation_name"
                        placeholder="Enter Designation Name"
                        type="text"
                        name="designation_name"
                      />
                      {errorMessages.designation_name && (
                        <div className="text-danger mt-2">
                          {errorMessages.designation_name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label font-weight-bold col-md-3">
                      Sorting:
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

export default DesignationCreate;
