// "use client";
// import { useQuery } from "@tanstack/react-query";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const EditProfession = ({ id }) => {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     profession_name: "",
//     modified_by: localStorage.getItem("userId"),
//   });
//   const [errorMessage, setErrorMessage] = useState("");

//   const { data: noticeCategorySingle, isLoading } = useQuery({
//     queryKey: ["noticeCategorySingle", id],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/profession/profession_all/${id}`
//       );
//       const data = await res.json();
//       return data;
//     },
//   });

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

//   useEffect(() => {
//     if (noticeCategorySingle && noticeCategorySingle[0]) {
//       const { profession_name } = noticeCategorySingle[0];
//       setFormData({
//         profession_name,
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
//     const normalizedName = normalizeName(formData.profession_name);
//     const duplicate = religions.some(
//       (existingReligion) =>
//         normalizeName(existingReligion.profession_name) === normalizedName &&
//         existingReligion.id !== id // Ensure it's not the same religion being edited
//     );

//     if (duplicate) {
//       setErrorMessage(
//         "Profession name already exists. Please choose a different name."
//       );
//       return;
//     }
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/profession/profession_edit/${id}`,
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
//     router.push("/Admin/profession/profession_all");
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12 p-4">
//           <div className="card">
//             <div className="card-default">
//               <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
//                 <h5 className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">
//                   Edit Profession
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
//                   onSubmit={handleSubmit}
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
//                         value={formData.profession_name}
//                         className="form-control form-control-sm required"
//                         id="profession_name"
//                         placeholder="Enter Profession Name"
//                         type="text"
//                         name="profession_name"
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

// export default EditProfession;

"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EditProfession = ({ id }) => {
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
    profession_name: "",
    modified_by: userId,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState([])

  const { data: noticeCategorySingle, isLoading } = useQuery({
    queryKey: ["noticeCategorySingle", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/profession/profession_all/${id}`
      );
      const data = await res.json();
      return data;
    },
  });

  const { data: professions = [] } = useQuery({
    queryKey: ["professions"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/profession/profession_all`
      );
      const data = await res.json();
      const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
      return filteredBrands;
      // return data;
    },
  });




  useEffect(() => {
    if (noticeCategorySingle && noticeCategorySingle[0]) {
      const { profession_name } = noticeCategorySingle[0];
      setFormData({
        profession_name,
        modified_by: userId,
      });
    }
  }, [noticeCategorySingle, userId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check for duplicate professions
    // const duplicate = professions.some(
    //   (existingProfession) =>
    //     existingProfession.profession_name
    //       .trim()
    //       .replace(/\s+/g, "")
    //       .toLowerCase() ===
    //       formData.profession_name.trim().replace(/\s+/g, "").toLowerCase() &&
    //     existingProfession.id !== id // Ensure it's not the same profession being edited
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
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/profession/profession_edit/${id}`,
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
        console.error("Error updating profession:", data);
      }
    } catch (error) {
      console.error("Error updating profession:", error);
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
                  Edit Profession
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
                  onSubmit={handleSubmit}
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
                        required
                        onChange={handleChange}
                        value={formData.profession_name}
                        className="form-control form-control-sm required"
                        id="profession_name"
                        placeholder="Enter Profession Name"
                        type="text"
                        name="profession_name"
                      />
                      {errorMessage && (
                        <div className="text-danger m-0">{errorMessage}</div>
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

export default EditProfession;
