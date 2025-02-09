// // "use client";
// // import Link from "next/link";
// // import { useRouter } from "next/navigation";
// // import React, { useState } from "react";
// // import { useQuery } from "@tanstack/react-query";

// // const ReligionCreate = () => {
// //   const created_by = localStorage.getItem("userId");

// //   const router = useRouter();

// //   const [formData, setFormData] = useState([
// //     { name: "", created_by: created_by },
// //   ]);

// //   const handleChange = (event) => {
// //     const { name, value } = event.target;
// //     setFormData((prevData) => ({
// //       ...prevData,
// //       [name]: value,
// //     }));
// //   };
// //   // user existing
// //   const { data: religions = [] } = useQuery({
// //     queryKey: ["religions"],
// //     queryFn: async () => {
// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_all`
// //       );
// //       const data = await res.json();
// //       return data;
// //     },
// //   });

// //   const normalizebrandName = (name) => {
// //     return name?.trim().replace(/\s+/g, "").toLowerCase();
// //   };

// //   const user_create = (event) => {
// //     event.preventDefault();

// //     // Normalize and check for existing blood group names
// //     const normalizedBloodGroups = formData.map((group) =>
// //       normalizebrandName(group.name)
// //     );

// //     const duplicate = normalizedBloodGroups.some((name) =>
// //       religions.some(
// //         (existingGroup) => normalizebrandName(existingGroup.name) === name
// //       )
// //     );

// //     if (duplicate) {
// //       setErrorMessage(
// //         "Blood Group name already exists. Please choose a different name."
// //       );
// //       return;
// //     }

// //     const schoolShift = {
// //       ...formData,
// //       created_by,
// //     };

// //     fetch(
// //       `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_create`,
// //       {
// //         method: "POST",
// //         headers: {
// //           "content-type": "application/json",
// //         },
// //         body: JSON.stringify(schoolShift),
// //       }
// //     )
// //       .then((Response) => {
// //         Response.json();
// //         console.log(Response);
// //         if (Response.ok === true) {
// //           sessionStorage.setItem("message", "Data saved successfully!");
// //         }
// //       })
// //       .then((data) => {
// //         console.log(data);
// //       })
// //       .catch((error) => console.error(error));
// //     router.push("/Admin/religion/religion_all");
// //   };

// //   return (
// //     <div class="container-fluid">
// //       <div class=" row ">
// //         <div className="col-12 p-4">
// //           <div className="card">
// //             <div className="card-default">
// //               <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
// //                 <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">
// //                   Religion Create{" "}
// //                 </h5>
// //                 <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
// //                   <Link
// //                     href="/Admin/religion/religion_all"
// //                     className="btn btn-sm btn-info"
// //                   >
// //                     Back to Religion List
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
// //                   onSubmit={user_create}
// //                 >
// //                   <div class="form-group row">
// //                     <label class="col-form-label font-weight-bold col-md-3">
// //                       Religion Name:
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
// //                         id="name"
// //                         placeholder="Enter Religion Name"
// //                         type="text"
// //                         name="name"
// //                         value={formData.name}
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

// // export default ReligionCreate;

// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";

// const ReligionCreate = () => {
//   const created_by = localStorage.getItem("userId");
//   const router = useRouter();
//   const [formData, setFormData] = useState({ name: "", created_by });
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
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_all`
//       );
//       const data = await res.json();
//       return data;
//     },
//   });

//   const normalizeName = (name) => {
//     return name?.trim().replace(/\s+/g, "").toLowerCase();
//   };

//   // const user_create = async (event) => {
//   //   event.preventDefault();

//   //   // Normalize and check for existing religion names
//   //   const normalizedName = normalizeName(formData.name);
//   //   const duplicate = religions.some(
//   //     (existingReligion) =>
//   //       normalizeName(existingReligion.name) === normalizedName
//   //   );

//   //   if (duplicate) {
//   //     setErrorMessage(
//   //       "Religion name already exists. Please choose a different name."
//   //     );
//   //     return;
//   //   }

//   //   try {
//   //     const response = await fetch(
//   //       `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_create`,
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify(formData),
//   //       }
//   //     );

//   //     if (response.ok === true) {
//   //       sessionStorage.setItem("message", "Data saved successfully!");
//   //       // Navigate to the religion list
//   //     } else {
//   //       router.push("/Admin/religion/religion_all");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error creating religion:", error);
//   //     setErrorMessage("An error occurred. Please try again.");
//   //   }
//   // };

//   const user_create = async (e) => {
//     e.preventDefault();
//     // Normalize and check for existing religion names
//     const normalizedName = normalizeName(formData.name);
//     const duplicate = religions.some(
//       (existingReligion) =>
//         normalizeName(existingReligion.name) === normalizedName
//     );

//     if (duplicate) {
//       setErrorMessage(
//         "Religion name already exists. Please choose a different name."
//       );
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_create`,
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
//         // Navigate to the blood group list
//       } else {
//         console.error("Error updating blood group:", data);
//       }
//     } catch (error) {
//       console.error("Error updating blood group:", error);
//     }
//     router.push("/Admin/religion/religion_all");
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12 p-4">
//           <div className="card">
//             <div className="card-default">
//               <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
//                 <h5 className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">
//                   Religion Create{" "}
//                 </h5>
//                 <div className="card-title card-header-period font-weight-bold mb-0 float-right">
//                   <Link
//                     href="/Admin/religion/religion_all"
//                     className="btn btn-sm btn-info"
//                   >
//                     Back to Religion List
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
//                 {errorMessage && (
//                   <div className="alert alert-danger" role="alert">
//                     {errorMessage}
//                   </div>
//                 )}
//                 <form
//                   className="form-horizontal"
//                   method="post"
//                   autoComplete="off"
//                   onSubmit={user_create}
//                 >
//                   <div className="form-group row">
//                     <label className="col-form-label font-weight-bold col-md-3">
//                       Religion Name:
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
//                         className="form-control form-control-sm required"
//                         id="name"
//                         placeholder="Enter Religion Name"
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                       />
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

// export default ReligionCreate;

// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";

// const ReligionCreate = () => {
//   const created_by = localStorage.getItem("userId");
//   const router = useRouter();
//   const [formData, setFormData] = useState({ name: "", created_by });
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
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_all`
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
//     const normalizedName = normalizeName(formData.name);
//     const duplicate = religions.some(
//       (existingReligion) =>
//         normalizeName(existingReligion.name) === normalizedName
//     );

//     if (duplicate) {
//       setErrorMessage(
//         "Religion name already exists. Please choose a different name."
//       );
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_create`,
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
//         router.push("/Admin/religion/religion_all");
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
//                   Religion Create
//                 </h5>
//                 <div className="card-title card-header-period font-weight-bold mb-0 float-right">
//                   <Link
//                     href="/Admin/religion/religion_all"
//                     className="btn btn-sm btn-info"
//                   >
//                     Back to Religion List
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
//                       Religion Name:
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
//                         id="name"
//                         placeholder="Enter Religion Name"
//                         type="text"
//                         name="name"
//                         value={formData.name}
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

// export default ReligionCreate;

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const ReligionCreate = () => {
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

const [created, setUserId] = useState(() => {
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
  const [formData, setFormData] = useState({ name: "", created_by: created });
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState([])


  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'name') {
      setName('')
    }

    const existingBrand = religions.find((brand) => brand?.name?.toLowerCase() === formData?.name?.toLowerCase());
    if (!existingBrand) {
      // Show error message
      setErrorMessage("");
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fetch existing religions to check for duplicates
  const { data: religions = [] } = useQuery({
    queryKey: ["religions"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_all`
      );
      const data = await res.json();
      return data;
    },
  });

  const user_create = async (e) => {
    e.preventDefault();

    // const duplicate = religions.some(
    //   (existingReligion) =>
    //     existingReligion.name.trim().replace(/\s+/g, "").toLowerCase() ===
    //     formData.name.trim().replace(/\s+/g, "").toLowerCase()
    // );

    // if (duplicate) {
    //   setErrorMessage(
    //     "Religion name already exists. Please choose a different name."
    //   );
    //   return;
    // }

    if (!formData.name) {
      setName('Religion name  is required')
      return
    }

    const normalizebrandName = (name) => {
      return name?.trim().replace(/\s+/g, '');
    };


    const existingBrand = religions.find((brand) => normalizebrandName(brand.name.toLowerCase()) === normalizebrandName(formData.name.toLowerCase()));
    if (existingBrand) {
      // Show error message
      setErrorMessage("Religion name already exists. Please choose a different Religion name.");
      return

    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_create`,
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
        router.push("/Admin/religion/religion_all");
      } else {
        console.error("Error creating religion:", data);
      }
    } catch (error) {
      console.error("Error creating religion:", error);
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
                  Religion Create
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                  <Link
                    href="/Admin/religion/religion_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to Religion List
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
                      Religion Name:
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
                        className={`form-control form-control-sm required ${
                          errorMessage ? "is-invalid" : ""
                        }`}
                        id="name"
                        placeholder="Enter Religion Name"
                        type="text"
                        name="name"
                        value={formData.name}
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

export default ReligionCreate;
