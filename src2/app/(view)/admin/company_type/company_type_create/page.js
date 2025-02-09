// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";

// const CompanyTypeCreate = () => {
//   const created_by = localStorage.getItem("userId");
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     company_type_name: "",
//     created_by,
//   });
//   const [errorMessage, setErrorMessage] = useState("");

//   const { data: companyTypes = [] } = useQuery({
//     queryKey: ["companyTypes"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company_type/company_type_all`
//       );
//       const data = await res.json();
//       return data;
//     },
//   });
//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const user_create = async (e) => {
//     e.preventDefault();

//     const duplicate = companyTypes.some(
//       (existingCompanyType) =>
//         existingCompanyType.company_type_name
//           ?.trim()
//           .replace(/\s+/g, "")
//           .toLowerCase() ===
//         formData.company_type_name.trim().replace(/\s+/g, "").toLowerCase()
//     );

//     if (duplicate) {
//       setErrorMessage(
//         "Company type name already exists. Please choose a different name."
//       );
//       return;
//     }

//     try {
//       // const response = await fetch(
//       //   `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company_type/company_type_create`,
//       //   {
//       //     method: "POST",
//       //     headers: {
//       //       "Content-Type": "application/json",
//       //     },
//       //     body: JSON.stringify(formData),
//       //   }
//       // );
//       // const data = await response.json();
//       // if (data) {
//       //   sessionStorage.setItem("message", "Data saved successfully!");
//       //   router.push("/Admin/company_type/company_type_all");
//       // } else {
//       //   console.error("Error creating company type:", data);
//       // }

//       fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company_type/company_type_create`,
//         {
//           method: "POST",
//           headers: {
//             "content-type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       )
//         .then((Response) => Response.json())
//         .then((data) => {
//           console.log(data);

//           sessionStorage.setItem("message", "Data saved successfully!");
//           router.push("/Admin/company_type/company_type_all");
//         });
//     } catch (error) {
//       console.error("Error creating company type:", error);
//       setErrorMessage("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12 p-4">
//           <div className="card">
//             <div className="card-default">
//               <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
//                 <h5 className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">
//                   Company Type Create
//                 </h5>
//                 <div className="card-title card-header-period font-weight-bold mb-0 float-right">
//                   <Link
//                     href="/Admin/company_type/company_type_all"
//                     className="btn btn-sm btn-info"
//                   >
//                     Back to Company Type List
//                   </Link>
//                 </div>
//               </div>

//               <div
//                 className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold"
//                 role="alert"
//               >
//                 (
//                 <small>
//                   <sup>
//                     <i className="text-danger fas fa-star"></i>
//                   </sup>
//                 </small>
//                 ) field required
//               </div>
//               <div className="card-body">
//                 <form
//                   className="form-horizontal"
//                   method="post"
//                   autoComplete="off"
//                   onSubmit={user_create}
//                 >
//                   <div className="form-group row">
//                     <label className="col-form-label font-weight-bold col-md-3">
//                       Company Type Name:
//                       <small>
//                         <sup>
//                           <small>
//                             <i className="text-danger fas fa-star"></i>
//                           </small>
//                         </sup>
//                       </small>
//                     </label>
//                     <div className="col-md-6">
//                       <input
//                         required
//                         onChange={handleChange}
//                         className={`form-control form-control-sm required ${
//                           errorMessage ? "is-invalid" : ""
//                         }`}
//                         id="company_type_name"
//                         placeholder="Enter Company Type Name"
//                         type="text"
//                         name="company_type_name"
//                         value={formData.company_type_name}
//                       />
//                       {errorMessage && (
//                         <div className="invalid-feedback">{errorMessage}</div>
//                       )}
//                     </div>
//                   </div>

//                   <div className="form-group row">
//                     <div className="offset-md-3 col-sm-6">
//                       <input
//                         type="submit"
//                         name="create"
//                         className="btn btn-success btn-sm"
//                         value="Submit"
//                       />
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompanyTypeCreate;

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const CompanyTypeCreate = () => {
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


  const router = useRouter();
  const [formData, setFormData] = useState({
    company_type_name: "",
    created_by,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const { data: companyTypes = [] } = useQuery({
    queryKey: ["companyTypes"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company_type/company_type_all`
      );
      const data = await res.json();
      return data;
    },
  });
const [name, setName] = useState([])

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'company_type_name') {
      setName('')
    }

    const existingBrand = companyTypes.find((brand) => brand?.company_type_name?.toLowerCase() === formData?.company_type_name?.toLowerCase());
    if (!existingBrand) {
      // Show error message
      setErrorMessage("");
    }


    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const user_create = async (e) => {
    e.preventDefault();

    // const duplicate = companyTypes.some(
    //   (existingCompanyType) =>
    //     existingCompanyType?.company_type_name?.toLowerCase() === formData?.company_type_name?.toLowerCase()
    // );

    // if (duplicate) {
    //   setErrorMessage(
    //     "Company type name already exists. Please choose a different name."
    //   );
    //   return;
    // }

    if (!formData.company_type_name) {
      setName('company type name  is required')
      return
    }

    const normalizebrandName = (name) => {
      return name?.trim().replace(/\s+/g, '');
    };


    const existingBrand = companyTypes.find((brand) => normalizebrandName(brand.company_type_name.toLowerCase()) === normalizebrandName(formData.company_type_name.toLowerCase()));
    if (existingBrand) {
      // Show error message
      setErrorMessage("company type name already exists. Please choose a different company type name.");
      return

    }

    try {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company_type/company_type_create`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )
        .then((Response) => Response.json())
        .then((data) => {
          console.log(data);

          if (typeof window !== 'undefined') {
            sessionStorage.setItem("message", "Data saved successfully!");
        }
          router.push("/Admin/company_type/company_type_all");
        });
    } catch (error) {
      console.error("Error creating company type:", error);
      setErrorMessage("An error occurred. Please try again.");
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
                  Company Type Create
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                  <Link
                    href="/Admin/company_type/company_type_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to Company Type List
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
                  onSubmit={user_create}
                >
                  <div className="form-group row">
                    <label className="col-form-label font-weight-bold col-md-3">
                      Company Type Name:
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
                        className='form-control form-control-sm required'
                        id="company_type_name"
                        placeholder="Enter Company Type Name"
                        type="text"
                        name="company_type_name"
                        value={formData.company_type_name}
                      />
                      {
                        errorMessage && <p className="text-danger m-0">{errorMessage}</p>
                      }
                      
                      {
                        name && <p className="text-danger m-0">{name}</p>
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

export default CompanyTypeCreate;
