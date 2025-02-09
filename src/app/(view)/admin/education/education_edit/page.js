// "use client";
// import { useQuery } from "@tanstack/react-query";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const EditEducation = ({ id }) => {
//   const router = useRouter();
//   // const [formData, setFormData] = useState({
//   //   education_name: "",
//   //   modified_by: localStorage.getItem("userId"),
//   // });

//   const [formData, setFormData] = useState({
//     education_name: "",
//     modified_by: localStorage.getItem("userId"),
//   });

//   const [errorMessages, setErrorMessages] = useState({
//     education_name: "",
//   });
//   const [errorMessage, setErrorMessage] = useState("");

//   const {
//     data: allEducation,
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["educationAll"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/education/education_all`
//       );
//       const data = await res.json();
//       return data;
//     },
//   });

//   const { data: currentEducation, isLoading: isCurrentLoading } = useQuery({
//     queryKey: ["currentEducation", id],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/education/education_all/${id}`
//       );
//       const data = await res.json();
//       return data;
//     },
//   });

//   useEffect(() => {
//     if (currentEducation && currentEducation[0]) {
//       const { education_name } = currentEducation[0];
//       setFormData({
//         education_name,
//         modified_by: localStorage.getItem("userId"),
//       });
//     }
//   }, [currentEducation]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//     setErrorMessage(""); // Clear error message when user updates fields
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if the new education_name already exists
//     const normalizedEducationName = formData.education_name
//       .trim()
//       .toLowerCase();
//     const isDuplicate = allEducation?.some(
//       (item) =>
//         item.id !== id &&
//         item.education_name.trim().toLowerCase() === normalizedEducationName
//     );

//     if (isDuplicate) {
//       setErrorMessage(
//         "Education name already exists. Please choose a different name."
//       );
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/education/education_edit/${id}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       );
//       const data = await response.json();
//       if (response.ok) {
//         sessionStorage.setItem("message", "Data updated successfully");
//         router.push(`/Admin/education/education_all`);
//       } else {
//         setErrorMessage("Failed to save data. Please try again.");
//       }
//       console.log(data); // Handle response data or success message
//     } catch (error) {
//       console.error("Error updating education:", error);
//       setErrorMessage("An error occurred while saving data. Please try again.");
//     }
//   };

//   if (isLoading || isCurrentLoading) return <p>Loading...</p>;

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12 p-4">
//           <div className="card">
//             <div className="card-default">
//               <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
//                 <h5 className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">
//                   Edit Education
//                 </h5>
//                 <div className="card-title card-header-period font-weight-bold mb-0 float-right">
//                   <Link
//                     href="/Admin/education/education_all"
//                     className="btn btn-sm btn-info"
//                   >
//                     Back to Education List
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
//               {errorMessage && (
//                 <div className="alert alert-danger" role="alert">
//                   {errorMessage}
//                 </div>
//               )}
//               <div className="card-body">
//                 <form
//                   className="form-horizontal"
//                   method="post"
//                   autoComplete="off"
//                   onSubmit={handleSubmit}
//                 >
//                   <div className="form-group row">
//                     <label className="col-form-label font-weight-bold col-md-3">
//                       Education Name:
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
//                         value={formData.education_name}
//                         className="form-control form-control-sm required"
//                         id="education_name"
//                         placeholder="Enter Education Name"
//                         type="text"
//                         name="education_name"
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

// export default EditEducation;

"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EditEducation = ({ id }) => {
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
    education_name: "",
    modified_by: userId,
  });

  const [errors, setErrors] = useState({
    education_name: "",
  });

  const [errorMessages, setErrorMessages] = useState({
    education_name: "",
  });

  const { data: allEducation, isLoading } = useQuery({
    queryKey: ["educationAll"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/education/education_all`
      );
      const data = await res.json();
      // return data;
      // const data = await res.json();
      const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
      return filteredBrands
    },
  });

  const { data: currentEducation, isLoading: isCurrentLoading } = useQuery({
    queryKey: ["currentEducation", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/education/education_all/${id}`
      );
      const data = await res.json();
      return data;
    },
  });

  useEffect(() => {
    if (currentEducation && currentEducation[0]) {
      const { education_name } = currentEducation[0];
      setFormData({
        education_name,
        modified_by: userId,
      });
    }
  }, [currentEducation, userId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear specific error message when user updates field
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // let hasErrors = false;
    // const newErrors = {
    //   education_name: "",
    // };

    // const normalizedEducationName = formData.education_name
    //   .trim()
    //   .toLowerCase();
    // const isDuplicate = allEducation?.some(
    //   (item) =>
    //     item.id !== id &&
    //     item.education_name.trim().toLowerCase() === normalizedEducationName
    // );

    // if (isDuplicate) {
    //   newErrors.education_name =
    //     "Education name already exists. Please choose a different name.";
    //   hasErrors = true;
    // }

    // setErrorMessages(newErrors);

    // if (hasErrors) {
    //   return;
    // }

    let hasErrors = false;

    const normalizedCurrentName = formData.education_name
      .trim()
      .replace(/\s+/g, "")
      .toLowerCase();
    const duplicate = allEducation.some(
      (existingGroup) =>
        existingGroup.education_name
          .trim()
          .replace(/\s+/g, "")
          .toLowerCase() === normalizedCurrentName && existingGroup.id !== id
    );

    const newErrors = {
      education_name: duplicate
        ? "Education name already exists. Please choose a different name."
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
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/education/education_edit/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        sessionStorage.setItem("message", "Data updated successfully");
        router.push(`/Admin/education/education_all`);
      } else {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          form: "Failed to save data. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Error updating education:", error);
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        form: "An error occurred while saving data. Please try again.",
      }));
    }
  };

  if (isLoading || isCurrentLoading) return <p>Loading...</p>;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 p-4">
          <div className="card">
            <div className="card-default">
              <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                <h5 className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">
                  Edit Education
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                  <Link
                    href="/Admin/education/education_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to Education List
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
              {errorMessages.form && (
                <div className="alert alert-danger" role="alert">
                  {errorMessages.form}
                </div>
              )}
              <div className="card-body">
                <form
                  className="form-horizontal"
                  method="post"
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <div className="form-group row">
                    <label className="col-form-label font-weight-bold col-md-3">
                      Education Name:
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
                        value={formData.education_name}
                        className="form-control form-control-sm required"
                        id="education_name"
                        placeholder="Enter Education Name"
                        type="text"
                        name="education_name"
                      />
                      {errorMessages.education_name && (
                        <div className="text-danger mt-1">
                          {errorMessages.education_name}
                        </div>
                      )}
                      {errors.education_name && (
                        <div className="text-danger mt-1">
                          {errors.education_name}
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

export default EditEducation;
