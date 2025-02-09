// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";

// const EducationCreate = () => {
//   const [errorMessages, setErrorMessages] = useState([]);
//   const [numToAdd, setNumToAdd] = useState(1);
//   const created = localStorage.getItem("userId");
//   const router = useRouter();
//   const [educationGroups, setEducationGroups] = useState([
//     { education_name: "", created_by: created },
//   ]);

//   const barnd_change = (index, event) => {
//     const newFields = [...educationGroups];
//     newFields[index][event.target.name] = event.target.value;
//     setEducationGroups(newFields);
//     setErrorMessages(""); // Clear error message when user updates fields
//   };

//   const brand_add_more = () => {
//     const numToAddInt = parseInt(numToAdd);
//     if (!isNaN(numToAddInt) && numToAddInt > 0) {
//       const newInputValues = [...educationGroups];
//       for (let i = 0; i < numToAddInt; i++) {
//         newInputValues.push({
//           education_name: "",
//           created_by: created,
//         });
//       }
//       setEducationGroups(newInputValues);
//       setNumToAdd(1);
//     }
//   };

//   const brand_remove_field = (index) => {
//     const confirmDelete = window.confirm("Sure you want to delete this?");
//     if (confirmDelete) {
//       const newFields = [...educationGroups];
//       newFields.splice(index, 1);
//       setEducationGroups(newFields);
//     }
//   };

//   // const { data: education = [] } = useQuery({
//   //   queryKey: ["education"],
//   //   queryFn: async () => {
//   //     const res = await fetch(
//   //       `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/education/education_all`
//   //     );
//   //     const data = await res.json();
//   //     return data;
//   //   },
//   // });

//   // const normalizeName = (name) => {
//   //   return name?.trim().replace(/\s+/g, "").toLowerCase();
//   // };

//   const { data: bloodgroups = [] } = useQuery({
//     queryKey: ["bloodgroups"],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/Admin/education/education_all`
//       );
//       const data = await res.json();
//       return data;
//     },
//   });

//   const normalizebrandName = (name) => {
//     return name?.trim().replace(/\s+/g, "").toLowerCase();
//   };

//   const user_create = async (event) => {
//     event.preventDefault();

//     const normalizedBloodGroups = educationGroups.map((group) =>
//       normalizebrandName(group.education_name)
//     );

//     const newErrorMessages = normalizedBloodGroups.map((name) =>
//       bloodgroups.some(
//         (existingGroup) =>
//           normalizebrandName(existingGroup.education_name) === name
//       )
//         ? "Education name already exists. Please choose a different name."
//         : ""
//     );

//     setErrorMessages(newErrorMessages);

//     if (newErrorMessages.some((msg) => msg !== "")) {
//       return;
//     }

//     fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}:5002//Admin/education/education_create`,
//       {
//         method: "POST",
//         headers: {
//           "content-type": "application/json",
//         },
//         body: JSON.stringify(educationGroups),
//       }
//     )
//       .then((Response) => Response.json())
//       .then((data) => {
//         console.log(data);

//         sessionStorage.setItem("message", "Data saved successfully!");
//       })
//       .catch((error) => console.error(error));
//     router.push(`/Admin/education/education_all`);
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-12 p-4">
//           <div className="card">
//             <div className="card-default">
//               <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
//                 <h5 className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">
//                   Create Education
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

//               <div className="card-body">
//                 {errorMessages && (
//                   <div className="alert alert-danger" role="alert">
//                     {errorMessages}
//                   </div>
//                 )}
//                 <form
//                   className="form-horizontal"
//                   method="post"
//                   autoComplete="off"
//                   onSubmit={user_create}
//                 >
//                   <div className="form-group row">
//                     <div className="col-md-6 offset-md-3">
//                       <div className="card border-primary">
//                         <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
//                           <div className="card-title card-header card-header-color float-left mt-1">
//                             Education
//                           </div>
//                           <div className="card-title card-header card-header-color font-weight-bold mb-0 float-right">
//                             <div className="input-group">
//                               <input
//                                 type="text"
//                                 style={{ width: "40px" }}
//                                 required
//                                 className="form-control form-control-sm add_text"
//                                 value={educationGroups.length}
//                                 id="education_name"
//                                 name="education_name"
//                                 readOnly
//                               />
//                               <span className="input-group-btn">
//                                 <button
//                                   className="btn btn-sm btn-info btn-sm add_more"
//                                   type="button"
//                                   onClick={brand_add_more}
//                                 >
//                                   Add
//                                 </button>
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="card">
//                           <div className="card-header custom-card-header py-1 clearfix">
//                             <div className="card-body pt-0">
//                               <div className="form-group-row">
//                                 <div className="table-responsive">
//                                   <table
//                                     role="presentation"
//                                     className="table table-striped table-sm table-bordered"
//                                   >
//                                     <thead>
//                                       <tr>
//                                         <th>
//                                           Education Name
//                                           <small>
//                                             <sup>
//                                               <small>
//                                                 <i className="text-danger fas fa-star"></i>
//                                               </small>
//                                             </sup>
//                                           </small>
//                                         </th>
//                                         <th>Action</th>
//                                       </tr>
//                                     </thead>
//                                     <tbody className="files">
//                                       {educationGroups.map((group, index) => (
//                                         <tr key={index}>
//                                           <td>
//                                             <input
//                                               type="text"
//                                               required
//                                               name="education_name"
//                                               className="form-control form-control-sm required row_unique_education_name"
//                                               placeholder="Enter Education Name"
//                                               value={group.education_name}
//                                               onChange={(event) =>
//                                                 barnd_change(index, event)
//                                               }
//                                             />

//                                             {errorMessages[index] && (
//                                               <div className="text-danger">
//                                                 {errorMessages[index]}
//                                               </div>
//                                             )}
//                                           </td>

//                                           <td>
//                                             <button
//                                               type="button"
//                                               className="btn btn-sm btn-danger btn-sm remove delete"
//                                               onClick={() =>
//                                                 brand_remove_field(index)
//                                               }
//                                             >
//                                               <i className="fas fa-trash-alt"></i>
//                                             </button>
//                                           </td>
//                                         </tr>
//                                       ))}
//                                     </tbody>
//                                   </table>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
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

// export default EducationCreate;

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const EducationCreate = () => {
  const [numToAdd, setNumToAdd] = useState(1);

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


  const router = useRouter();
  const [bloodGroups, setBloodGroups] = useState([
    { education_name: "", created_by: userId },
  ]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [error, setError] = useState([]);

  const barnd_change = (index, event) => {
    const newFields = [...bloodGroups];
    newFields[index][event.target.name] = event.target.value;

    const brandName = newFields[index]['education_name'];
    if (brandName) {
      setError(""); // Clear the error message

    }


    setBloodGroups(newFields);
  };

  const brand_add_more = () => {
    const numToAddInt = parseInt(numToAdd);
    if (!isNaN(numToAddInt) && numToAddInt > 0) {
      const newInputValues = [...bloodGroups];
      for (let i = 0; i < numToAddInt; i++) {
        newInputValues.push({
          education_name: "",
          created_by: userId,
        });
      }
      setBloodGroups(newInputValues);
      setNumToAdd(1);
    }
  };

  const brand_remove_field = (index) => {
    // const confirmDelete = window.confirm("Sure you want to delete this?");
    // if (confirmDelete) {

    // }

    const newFields = [...bloodGroups];
    newFields.splice(index, 1);
    setBloodGroups(newFields);
  };

  const { data: bloodgroups = [] } = useQuery({
    queryKey: ["bloodgroups"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/education/education_all`
      );
      const data = await res.json();
      return data;
    },
  });

  const normalizebrandName = (name) => {
    return name?.trim().replace(/\s+/g, "").toLowerCase();
  };

  const user_create = (event) => {
    event.preventDefault();

    const normalizedBloodGroups = bloodGroups.map((group) =>
      normalizebrandName(group.education_name)
    );

    // const newErrorMessages = normalizedBloodGroups.map((name) =>
    //   bloodgroups.some(
    //     (existingGroup) =>
    //       normalizebrandName(existingGroup.education_name) === name
    //   )
    //     ? "Education name already exists. Please choose a different name."
    //     : ""
    // );

    const newErrorMessages = bloodGroups.map((group) =>
      bloodgroups.some(
        (existingGroup) =>
          existingGroup.education_name
            .trim()
            .replace(/\s+/g, "")
            .toLowerCase() ===
          group.education_name.trim().replace(/\s+/g, "").toLowerCase()
      )
        ? "Education name already exists. Please choose a different name."
        : ""
    );

    setErrorMessages(newErrorMessages);

    if (newErrorMessages.some((msg) => msg !== "")) {
      return;
    }


    const newError = new Array(bloodGroups.length).fill('');
    const isValids = bloodGroups.every((inputValue, index) => {
      if (!inputValue.education_name.trim()) {
        newError[index] = 'This must be filled.';
        return false;
      }
      return true;
    });

    if (!isValids) {
      setError(newError);
      return;
    }
    setError(new Array(bloodGroups.length).fill(''));

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/education/education_create`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(bloodGroups),
      }
    )
      .then((Response) => Response.json())
      .then((data) => {
        console.log(data);

        if (typeof window !== 'undefined') {
          sessionStorage.setItem("message", "Data saved successfully!");
        }
      })
      .catch((error) => console.error(error));
    router.push(`/Admin/education/education_all`);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 p-4">
          <div className="card">
            <div className="card-default">
              <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                <h5 className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">
                  Create Education
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

              <div className="card-body">
                <form
                  className="form-horizontal"
                  method="post"
                  autoComplete="off"
                  onSubmit={user_create}
                >
                  <div className="form-group row">
                    <div className="col-md-6 offset-md-3">
                      <div className="card border-primary">
                        <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                          <div className="card-title  float-left mt-1">
                            Education
                          </div>
                          <div className="card-title  font-weight-bold mb-0 float-right">
                            <div className="input-group">
                              <input
                                type="text"
                                style={{ width: "40px" }}
                                required
                                className="form-control form-control-sm add_text"
                                value={bloodGroups.length}
                                id="education_name"
                                name="education_name"
                                readOnly
                              />
                              <span className="input-group-btn">
                                <button
                                  className="btn btn-sm btn-info btn-sm add_more"
                                  type="button"
                                  onClick={brand_add_more}
                                  value={numToAdd}
                                  onChange={(event) =>
                                    setNumToAdd(event.target.value)
                                  }
                                >
                                  Add
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="card">
                          <div className="card-title py-1 clearfix">
                            <div className="card-body pt-0">
                              <div className="form-group-row">
                                <div className="table-responsive">
                                  <table className="table  table-sm table-bordered">
                                    <thead>
                                      <tr>
                                        <th>
                                          Education Name
                                          <small>
                                            <sup>
                                              <small>
                                                <i className="text-danger fas fa-star"></i>
                                              </small>
                                            </sup>
                                          </small>
                                        </th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody className="files">
                                      {bloodGroups.map((group, index) => (
                                        <tr key={index}>
                                          <td>
                                            <input
                                              type="text"

                                              name="education_name"
                                              className="form-control form-control-sm required row_unique_education_name"
                                              placeholder="Enter Education Name"
                                              value={group.education_name}
                                              onChange={(event) =>
                                                barnd_change(index, event)
                                              }
                                            />
                                            {errorMessages[index] && (
                                              <div className="text-danger">
                                                {errorMessages[index]}
                                              </div>
                                            )}

                                            {
                                              error[index] && <p className="text-danger">{error}</p>
                                            }
                                          </td>

                                          <td>
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-danger btn-sm remove delete"
                                              onClick={() =>
                                                brand_remove_field(index)
                                              }
                                            >
                                              <i className="fas fa-trash-alt"></i>
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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

export default EducationCreate;
