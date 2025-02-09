// "use client";
// import { useQuery } from "@tanstack/react-query";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const EditReligion = ({ id }) => {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     name: "",
//     modified_by: localStorage.getItem("userId"),
//   });
//   const [errorMessage, setErrorMessage] = useState("");

//   const { data: noticeCategorySingle, isLoading } = useQuery({
//     queryKey: ["noticeCategorySingle", id],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_all/${id}`
//       );
//       const data = await res.json();
//       return data;
//     },
//   });

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

//   useEffect(() => {
//     if (noticeCategorySingle && noticeCategorySingle[0]) {
//       const { name } = noticeCategorySingle[0];
//       setFormData({
//         name,
//         modified_by: localStorage.getItem("userId"),
//       });
//     }
//   }, [noticeCategorySingle]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const normalizedName = normalizeName(formData.name);
//     const duplicate = religions.some(
//       (existingReligion) =>
//         normalizeName(existingReligion.name) === normalizedName &&
//         existingReligion.id !== id // Ensure it's not the same religion being edited
//     );

//     if (duplicate) {
//       setErrorMessage(
//         "Religion name already exists. Please choose a different name."
//       );
//       return;
//     }
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_edit/${id}`,
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
//         sessionStorage.setItem("message", "Data updated successfully!");
//         // Navigate to the religion list
//       } else {
//         console.error("Error updating religion:", data);
//       }
//     } catch (error) {
//       console.error("Error updating religion:", error);
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
//                   Edit Religion
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
//                   onSubmit={handleSubmit}
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
//                         value={formData.name}
//                         className="form-control form-control-sm required"
//                         id="name"
//                         placeholder="Enter Name"
//                         type="text"
//                         name="name"
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

// export default EditReligion;

"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EditReligion = ({ id }) => {
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
    name: "",
    modified_by: userId,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");

  const { data: noticeCategorySingle, isLoading } = useQuery({
    queryKey: ["noticeCategorySingle", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_all/${id}`
      );
      const data = await res.json();
      return data;
    },
  });

  const { data: religions = [] } = useQuery({
    queryKey: ["religions"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_all`
      );
      const data = await res.json();
      const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
      return filteredBrands;
      // return data;
    },
  });

  useEffect(() => {
    if (noticeCategorySingle && noticeCategorySingle[0]) {
      const { name } = noticeCategorySingle[0];
      setFormData({
        name,
        modified_by: userId,
      });
    }
  }, [noticeCategorySingle, userId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // সরাসরি নাম চেক করুন, কোনো নরমালাইজেশন ছাড়াই
    // const duplicate = religions.some(
    //   (existingReligion) =>
    //     existingReligion.name.trim().replace(/\s+/g, "").toLowerCase() ===
    //       formData.name.trim().replace(/\s+/g, "").toLowerCase() &&
    //     existingReligion.id !== id
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
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/religion/religion_edit/${id}`,
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
        console.error("Error updating religion:", data);
      }
    } catch (error) {
      console.error("Error updating religion:", error);
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
                  Edit Religion
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
                  onSubmit={handleSubmit}
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
                        value={formData.name}
                        className="form-control form-control-sm required"
                        id="name"
                        placeholder="Enter Name"
                        type="text"
                        name="name"
                      />
                      {errorMessage && (
                        <div className="text-danger mt-1">{errorMessage}</div>
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

export default EditReligion;
