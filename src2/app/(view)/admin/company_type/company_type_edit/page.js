// "use client";
// import { useQuery } from "@tanstack/react-query";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const EditCompanyType = ({ id }) => {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     company_type_name: "",
//     modified_by: localStorage.getItem("userId"),
//   });
//   const [errorMessage, setErrorMessage] = useState("");

//   const { data: companyTypeSingle, isLoading } = useQuery({
//     queryKey: ["companyTypeSingle", id],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company_type/company_type_all/${id}`
//       );
//       const data = await res.json();
//       return data;
//     },
//   });

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

//   useEffect(() => {
//     if (companyTypeSingle && companyTypeSingle[0]) {
//       const { company_type_name } = companyTypeSingle[0];
//       setFormData({
//         company_type_name,
//         modified_by: localStorage.getItem("userId"),
//       });
//     }
//   }, [companyTypeSingle]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const duplicate = companyTypes.some(
//       (existingCompanyType) =>
//         existingCompanyType.company_type_name
//           ?.trim()
//           .replace(/\s+/g, "")
//           .toLowerCase() ===
//           formData.company_type_name.trim().replace(/\s+/g, "").toLowerCase() &&
//         existingCompanyType.id !== id
//     );

//     if (duplicate) {
//       setErrorMessage(
//         "Company Type name already exists. Please choose a different name."
//       );
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/Admin/company_type/company_type_edit/${id}`,
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
//         console.log(data, "hello world");
//         sessionStorage.setItem("message", "Data updated successfully!");
//       } else {
//         console.error("Error updating company type:", data);
//       }
//     } catch (error) {
//       console.error("Error updating company type:", error);
//     }
//     router.push("/Admin/company_type/company_type_all");
//   };
//   console.log(formData, "hello world");

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12 p-4">
//           <div className="card">
//             <div className="card-default">
//               <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
//                 <h5 className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">
//                   Edit Company Type
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
//                   onSubmit={handleSubmit}
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
//                         value={formData.company_type_name}
//                         className="form-control form-control-sm required"
//                         id="company_type_name"
//                         placeholder="Enter Company Type Name"
//                         type="text"
//                         name="company_type_name"
//                       />
//                       {errorMessage && (
//                         <div className="text-danger mt-1">{errorMessage}</div>
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

// export default EditCompanyType;

"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EditCompanyType = ({ id }) => {
  const router = useRouter();
  const [name, setName] = useState([])
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
    company_type_name: "",
    modified_by: userId,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const { data: companyTypeSingle, isLoading } = useQuery({
    queryKey: ["companyTypeSingle", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company_type/company_type_all/${id}`
      );
      const data = await res.json();
      return data;
    },
  });

  const { data: companyTypes = [] } = useQuery({
    queryKey: ["companyTypes"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company_type/company_type_all`
      );
      const data = await res.json();
      const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
      return filteredBrands;
      // return data;
    },
  });

  useEffect(() => {
    if (companyTypeSingle && companyTypeSingle[0]) {
      const { company_type_name } = companyTypeSingle[0];
      setFormData((prevData) => ({
        ...prevData,
        company_type_name,
      }));
    }
  }, [companyTypeSingle]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'company_type_name') {
      setName('')
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company_type_name) {
      setName('Company Type name is required')
      return
    }

    const duplicate = companyTypes.some(
      (existingCompanyType) =>
        existingCompanyType.company_type_name
          ?.trim()
          .replace(/\s+/g, "")
          .toLowerCase() ===
        formData.company_type_name.trim().replace(/\s+/g, "").toLowerCase() &&
        existingCompanyType.id !== id
    );

    if (duplicate) {
      setErrorMessage(
        "Company Type name already exists. Please choose a different name."
      );
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/company_type/company_type_edit/${id}`,
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
        console.log(data, "hello world");
        sessionStorage.setItem("message", "Data updated successfully!");
        router.push("/Admin/company_type/company_type_all"); //
      } else {
        console.error("Error updating company type:", data);
      }
    } catch (error) {
      console.error("Error updating company type:", error);
    }
  };
  console.log(formData, "hello world");

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 p-4">
          <div className="card">
            <div className="card-default">
              <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                <h5 className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">
                  Edit Company Type
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
                  onSubmit={handleSubmit}
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
                        value={formData.company_type_name}
                        className="form-control form-control-sm required"
                        id="company_type_name"
                        placeholder="Enter Company Type Name"
                        type="text"
                        name="company_type_name"
                      />
                      {errorMessage && (
                        <div className="text-danger mt-1">{errorMessage}</div>
                      )}

                      {
                        name && <p className="text-danger">{name}</p>
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

export default EditCompanyType;
