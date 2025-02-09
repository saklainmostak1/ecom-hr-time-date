// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";

// const ProfessionCreate = () => {
//   const created_by = localStorage.getItem("userId");
//   const router = useRouter();
//   const [formData, setFormData] = useState({ profession_name: "", created_by });
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
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/profession/profession_all`
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
//     const normalizedName = normalizeName(formData.profession_name);
//     const duplicate = religions.some(
//       (existingReligion) =>
//         normalizeName(existingReligion.profession_name) === normalizedName
//     );

//     if (duplicate) {
//       setErrorMessage(
//         "Profession name already exists. Please choose a different name."
//       );
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/profession/profession_create`,
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
//         router.push("/Admin/profession/profession_all");
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
//                   Profession Create
//                 </h5>
//                 <div className="card-title card-header-period font-weight-bold mb-0 float-right">
//                   <Link
//                     href="/Admin/profession/profession_all"
//                     className="btn btn-sm btn-info"
//                   >
//                     Back to Profession List
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
//                       Profession Name:
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
//                         id="profession_name"
//                         placeholder="Enter Religion Name"
//                         type="text"
//                         name="profession_name"
//                         value={formData.profession_name}
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

// export default ProfessionCreate;

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const ProfessionCreate = () => {
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
  const [formData, setFormData] = useState({ profession_name: "", created_by });
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState([])


    // Fetch existing professions to check for duplicates
    const { data: professions = [] } = useQuery({
      queryKey: ["professions"],
      queryFn: async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/profession/profession_all`
        );
        const data = await res.json();
        return data;
      },
    });
  
  

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'profession_name') {
      setName('')
    }

    const existingBrand = professions.find((brand) => brand?.profession_name?.toLowerCase() === formData?.profession_name?.toLowerCase());
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
    // Normalize and check for existing profession names
    // const normalizedName = normalizeName(formData.profession_name);
    // const duplicate = professions.some(
    //   (existingProfession) =>
    //     normalizeName(existingProfession.profession_name) === normalizedName
    // );

    // if (duplicate) {
    //   setErrorMessage(
    //     "Profession name already exists. Please choose a different name."
    //   );
    //   return;
    // }
    if (!formData.profession_name) {
      setName('Profession name  is required')
      return
    }

    const normalizebrandName = (name) => {
      return name?.trim().replace(/\s+/g, '');
    };


    const existingBrand = professions.find((brand) => normalizebrandName(brand.profession_name.toLowerCase()) === normalizebrandName(formData.profession_name.toLowerCase()));
    if (existingBrand) {
      // Show error message
      setErrorMessage("Profession name already exists. Please choose a different Profession name.");
      return

    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/profession/profession_create`,
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
        router.push("/Admin/profession/profession_all");
      } else {
        console.error("Error creating profession:", data);
      }
    } catch (error) {
      console.error("Error creating profession:", error);
      // setErrorMessage("An error occurred. Please try again.");
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
                  Profession Create
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                  <Link
                    href="/Admin/profession/profession_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to Profession List
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
                      Profession Name:
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
                        id="profession_name"
                        placeholder="Enter Profession Name"
                        type="text"
                        name="profession_name"
                        value={formData.profession_name}
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

export default ProfessionCreate;
