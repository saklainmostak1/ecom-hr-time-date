// // "use client";
// // import Link from "next/link";
// // import { useRouter } from "next/navigation";
// // import React, { useState } from "react";
// // import { useQuery } from "@tanstack/react-query";

// // const GenderCreate = () => {
// //   const created_by = localStorage.getItem("userId");
// //   const [errorMessage, setErrorMessage] = useState("");

// //   const router = useRouter();
// //   const [formData, setFormData] = useState({
// //     gender_name: "",

// //     created_by: created_by,
// //   });

// //   const handleChange = (event) => {
// //     const { name, value } = event.target;
// //     setFormData((prevData) => ({
// //       ...prevData,
// //       [name]: value,
// //     }));
// //   };

// //   const gender_create = async (e) => {
// //     e.preventDefault();

// //     try {
// //       const response = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/gender/gender_create`,
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //           body: JSON.stringify(formData),
// //         }
// //       );
// //       const data = await response.json();
// //       if (data) {
// //         sessionStorage.setItem("message", "Data saved successfully!");
// //         // Navigate to the blood group list
// //       } else {
// //         console.error("Error updating blood group:", data);
// //       }
// //     } catch (error) {
// //       console.error("Error updating blood group:", error);
// //     }
// //     router.push("/Admin/gender/gender_all");
// //   };

// //   return (
// //     <div class="container-fluid">
// //       <div class=" row ">
// //         <div className="col-12 p-4">
// //           <div className="card">
// //             <div className="card-default">
// //               <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
// //                 <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">
// //                   Gender Create{" "}
// //                 </h5>
// //                 <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
// //                   <Link
// //                     href="/Admin/gender/gender_all"
// //                     className="btn btn-sm btn-info"
// //                   >
// //                     Back to Gender List
// //                   </Link>
// //                 </div>
// //               </div>

// //               <div
// //                 className="alert alert-warning mb-0 mx-4 mt-4 text-danger font-weight-bold"
// //                 role="alert"
// //               >
// //                 (
// //                 <small>
// //                   <sup>
// //                     <i className="text-danger fas fa-star"></i>
// //                   </sup>
// //                 </small>
// //                 ) field required
// //               </div>
// //               <div className="card-body">
// //                 <form
// //                   className="form-horizontal"
// //                   method="post"
// //                   autoComplete="off"
// //                   onSubmit={gender_create}
// //                 >
// //                   <div class="form-group row">
// //                     <label class="col-form-label font-weight-bold col-md-3">
// //                       Gender Name:
// //                       <small>
// //                         <sup>
// //                           <small>
// //                             <i class="text-danger fas fa-star"></i>
// //                           </small>
// //                         </sup>
// //                       </small>
// //                     </label>
// //                     <div class="col-md-6">
// //                       <input
// //                         required=""
// //                         onChange={handleChange}
// //                         class="form-control form-control-sm required"
// //                         id="gender_name"
// //                         placeholder="Enter Gender Name"
// //                         type="text"
// //                         name="gender_name"
// //                         value={formData.gender_name}
// //                       />
// //                     </div>
// //                   </div>

// //                   <div className="form-group row">
// //                     <div className="offset-md-3 col-sm-6">
// //                       <input
// //                         type="submit"
// //                         name="create"
// //                         className="btn btn-success btn-sm"
// //                         value="Submit"
// //                       />
// //                     </div>
// //                   </div>
// //                 </form>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default GenderCreate;

// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";

// const GenderCreate = () => {
//   const created_by = localStorage.getItem("userId");
//   const router = useRouter();
//   const [formData, setFormData] = useState({ gender_name: "", created_by });
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Fetch existing religions to check for duplicates
//   const { data: religions = [] } = useQuery({
//     queryKey: ["religions"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/gender/gender_all`
//       );
//       const data = await res.json();
//       return data;
//     },
//   });

//   const normalizeName = (name) => {
//     return name?.trim().replace(/\s+/g, "").toLowerCase();
//   };

//   const user_create = async (e) => {
//     e.preventDefault();
//     // Normalize and check for existing religion names
//     const normalizedName = normalizeName(formData.gender_name);
//     const duplicate = religions.some(
//       (existingReligion) =>
//         normalizeName(existingReligion.gender_name) === normalizedName
//     );

//     if (duplicate) {
//       setErrorMessage(
//         "Gender name already exists. Please choose a different name."
//       );
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/gender/gender_create`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       );
//       const data = await response.json();
//       if (data) {
//         sessionStorage.setItem("message", "Data saved successfully!");
//         router.push("/Admin/gender/gender_all");
//       } else {
//         console.error("Error creating religion:", data);
//       }
//     } catch (error) {
//       console.error("Error creating religion:", error);
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
//                   Gender Create
//                 </h5>
//                 <div className="card-title card-header-period font-weight-bold mb-0 float-right">
//                   <Link
//                     href="/Admin/gender/gender_all"
//                     className="btn btn-sm btn-info"
//                   >
//                     Back to Gender List
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
//                       Gender Name:
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
//                         id="gender_name"
//                         placeholder="Enter Gender Name"
//                         type="text"
//                         name="gender_name"
//                         value={formData.gender_name}
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

// export default GenderCreate;

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const GenderCreate = () => {
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

  const [created_by, setUserId] = useState(() => {
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
  const router = useRouter();
  const [formData, setFormData] = useState({ gender_name: "", created_by });
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState([])

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'gender_name') {
      setName('')
    }


    const existingBrand = genders.find((brand) => brand?.gender_name?.toLowerCase() === formData?.gender_name?.toLowerCase());
    if (!existingBrand) {
      // Show error message
      setErrorMessage("");
    }


    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fetch existing genders to check for duplicates
  const { data: genders = [] } = useQuery({
    queryKey: ["genders"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/gender/gender_all`
      );
      const data = await res.json();
      return data;
    },
  });

  const user_create = async (e) => {
    e.preventDefault();

    // Check for exact duplicate gender names
    // const duplicate = genders.some(
    //   (existingGender) =>
    //     existingGender.gender_name.trim().replace(/\s+/g, "").toLowerCase() ===
    //     formData.gender_name.trim().replace(/\s+/g, "").toLowerCase()
    // );

    // if (duplicate) {
    //   setErrorMessage(
    //     "Gender name already exists. Please choose a different name."
    //   );
    //   return;
    // }
    if (!formData.gender_name) {
      setName('Gender name  is required')
      return
    }


    const normalizebrandName = (name) => {
      return name?.trim().replace(/\s+/g, '');
    };


    const existingBrand = genders.find((brand) => normalizebrandName(brand.gender_name.toLowerCase()) === normalizebrandName(formData.gender_name.toLowerCase()));
    if (existingBrand) {
      // Show error message
      setErrorMessage("Gender name already exists. Please choose a different Gender name.");
      return

    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/gender/gender_create`,
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
        router.push("/Admin/gender/gender_all");
      } else {
        console.error("Error creating gender:", data);
      }
    } catch (error) {
      console.error("Error creating gender:", error);
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
                  Gender Create
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                  <Link
                    href="/Admin/gender/gender_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to Gender List
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
                      Gender Name:
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
                        className={`form-control form-control-sm required ${errorMessage ? "is-invalid" : ""
                          }`}
                        id="gender_name"
                        placeholder="Enter Gender Name"
                        type="text"
                        name="gender_name"
                        value={formData.gender_name}
                      />
                      {errorMessage && (
                        <div className="invalid-feedback">{errorMessage}</div>
                      )}
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

export default GenderCreate;
