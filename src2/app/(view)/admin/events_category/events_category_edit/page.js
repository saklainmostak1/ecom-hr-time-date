// "use client";
// import { useQuery } from "@tanstack/react-query";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const EditPhotoGalleryCategory = ({ id }) => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: "",
//     status: "",
//     modified_by: localStorage.getItem("userId"),
//   });

//   const {
//     data: photogalleryCategorySingle,
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["photogalleryCategorySingle", id],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/events_category/events_category_all/${id}`
//       );
//       const data = await res.json();
//       return data;
//     },
//   });

//   useEffect(() => {
//     if (photogalleryCategorySingle && photogalleryCategorySingle[0]) {
//       const { name, status } = photogalleryCategorySingle[0];
//       setFormData({
//         name,
//         status,
//         modified_by: localStorage.getItem("userId"),
//       });
//     }
//   }, [photogalleryCategorySingle]);

//   useEffect(() => {
//     setFormData((prevData) => ({
//       ...prevData,
//       total: parseFloat(prevData.basic),
//     }));
//   }, [formData.basic]);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/events_category/events_category_edit/${id}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       );
//       const data = await response.json();
//       console.log(data);
//       if (data.ok) {
//         sessionStorage.setItem("message", "Data saved successfully!");
//       } else {
//         router.push("/Admin/events_category/events_category_all");
//       } // Handle response data or success message
//     } catch (error) {
//       console.error("Error updating school shift:", error);
//       // Handle error or show an error message to the user
//     }
//   };
//   console.log(photogalleryCategorySingle);
//   return (
//     <div class="container-fluid">
//       <div class=" row ">
//         <div className="col-12 p-4">
//           <div className="card">
//             <div className="card-default">
//               <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
//                 <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">
//                   Edit Events Category
//                 </h5>
//                 <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
//                   <Link
//                     href="/Admin/events_category/events_category_all"
//                     className="btn btn-sm btn-info"
//                   >
//                     Back Events Category List
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
//                   <div class="form-group row">
//                     <label class="col-form-label font-weight-bold col-md-3">
//                       Name:
//                       <small>
//                         <sup>
//                           <small>
//                             <i class="text-danger fas fa-star"></i>
//                           </small>
//                         </sup>
//                       </small>
//                     </label>
//                     <div class="col-md-6">
//                       <input
//                         required=""
//                         onChange={handleChange}
//                         value={formData.name}
//                         class="form-control form-control-sm required"
//                         id="title"
//                         placeholder="Enter Name"
//                         type="text"
//                         name="name"
//                       />
//                     </div>
//                   </div>

//                   <div class="form-group row">
//                     <label class="col-form-label font-weight-bold col-md-3">
//                       Status:
//                       <small>
//                         <sup>
//                           <small>
//                             <i class="text-danger fas fa-star"></i>
//                           </small>
//                         </sup>
//                       </small>
//                     </label>
//                     <div class="col-md-6">
//                       <select
//                         value={formData.status}
//                         onChange={handleChange}
//                         name="status"
//                         id="status"
//                         class="form-control form-control-sm required"
//                         placeholder="Enter Status"
//                       >
//                         <option>Select Status</option>
//                         <option value="1">Active</option>
//                         <option value="2">Inactive</option>
//                       </select>
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

// export default EditPhotoGalleryCategory;

"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EditPhotoGalleryCategory = ({ id }) => {


  const [status, setStatus] = useState([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
      .then(res => res.json())
      .then(data => setStatus(data))
  }, [])


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
    name: "", status: '',
    modified_by: userId,
  });


  const { data: noticeCategorySingle, isLoading } = useQuery({
    queryKey: ["noticeCategorySingle", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/events_category/events_category_all/${id}`
      );
      const data = await res.json();
      return data;
    },
  });

  const [errorMessage, setErrorMessage] = useState("");
  const { data: noticeCategoryAll = [] } = useQuery({
    queryKey: ["noticeCategoryAll"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/events_category/events_category_all`
      );
      const data = await res.json();

      const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
      return filteredBrands;
      // return data;
    },
  });


  const [name, setName] = useState([])
  const [statuss, setstatus] = useState([])

  useEffect(() => {
    if (noticeCategorySingle && noticeCategorySingle[0]) {
      const { name, status } = noticeCategorySingle[0];
      setFormData({
        status,
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
    if (name === 'status') {
      setstatus('')
    }

    const existingBrand = noticeCategoryAll.find((brand) => brand?.name?.toLowerCase() === formData?.company_type_name?.toLowerCase());
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

    if (!formData.name) {
      setName('Event Category name  is required')
      return
    }
    if (!formData.status) {
      setstatus('Status  is required')
      return
    }

    const normalizebrandName = (name) => {
      return name?.trim().replace(/\s+/g, '');
    };


    const existingBrand = noticeCategoryAll.find((brand) => normalizebrandName(brand.name.toLowerCase()) === normalizebrandName(formData.name.toLowerCase()));
    if (existingBrand) {
      // Show error message
      setErrorMessage("Event Category name already exists. Please choose a different Event Category name.");
      return

    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/events_category/events_category_edit/${id}`,
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
      } else {
        console.error("Error updating religion:", data);
      }
    } catch (error) {
      console.error("Error updating religion:", error);
    }
    router.push("/Admin/events_category/events_category_all");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 p-4">
          <div className="card">
            <div className="card-default">
              <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                <h5 className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">
                  Edit Events Cetegory
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                  <Link
                    href="/Admin/events_category/events_category_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to Events Cetegory List
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
                      Name:
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
                        placeholder="Enter News Category Name"
                        type="text"
                        name="name"
                      />
                      {
                        name && <p className="text-danger m-0">{name}</p>
                      }
                      {
                        errorMessage && <p className="text-danger m-0">{errorMessage}</p>
                      }

                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-form-label font-weight-bold col-md-3">
                      {" "}
                      Status:
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
                        onChange={handleChange}
                        value={formData.status}
                        name="status"
                        id="status"
                        className="form-control form-control-sm required"
                        placeholder="Enter Status"
                      >
                        <option>Select Status</option>
                        {
                          status.map(sta =>

                            <>
                              <option value={sta.id}>{sta.status_name}</option>
                            </>
                          )
                        }
                      </select>
                      {
                        statuss && <p className="text-danger m-0">{statuss}</p>
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

export default EditPhotoGalleryCategory;
