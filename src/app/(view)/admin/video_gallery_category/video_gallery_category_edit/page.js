// "use client";
// import { useQuery } from "@tanstack/react-query";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const EditVideoGalleryCategory = ({ id }) => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: "",
//     status: "",
//     modified_by: localStorage.getItem("userId"),
//   });

//   const {
//     data: videogalleryCategorySingle,
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["videogalleryCategorySingle", id],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery_category/video_gallery_category_all/${id}`
//       );
//       const data = await res.json();
//       return data;
//     },
//   });

//   useEffect(() => {
//     if (videogalleryCategorySingle && videogalleryCategorySingle[0]) {
//       const { name, status } = videogalleryCategorySingle[0];
//       setFormData({
//         name,
//         status,
//         modified_by: localStorage.getItem("userId"),
//       });
//     }
//   }, [videogalleryCategorySingle]);

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
//         `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery_category/video_gallery_category_edit/${id}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       );
//       const data = await response.json();
//       if (data.ok) {
//         sessionStorage.setItem("message", "Datasave Successfully");
//       } else {
//         router.push("/Admin/video_gallery_category/video_gallery_category_all");
//       }
//       console.log(data); // Handle response data or success message
//     } catch (error) {
//       console.error("Error updating school shift:", error);
//       // Handle error or show an error message to the user
//     }
//   };
//   console.log(videogalleryCategorySingle);
//   return (
//     <div class="container-fluid">
//       <div class=" row ">
//         <div className="col-12 p-4">
//           <div className="card">
//             <div className="card-default">
//               <div className="card-header custom-card-header py-1  clearfix bg-gradient-primary text-white">
//                 <h5 className="card-title card-header-period font-weight-bold mb-0  float-left mt-1">
//                   Edit Video Gallery Category
//                 </h5>
//                 <div className="card-title card-header-period font-weight-bold mb-0  float-right ">
//                   <Link
//                     href="/Admin/video_gallery_category/video_gallery_category_all"
//                     className="btn btn-sm btn-info"
//                   >
//                     Back Video Gallery Category List
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

// export default EditVideoGalleryCategory;

"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EditVideoGalleryCategory = ({ id }) => {
  const router = useRouter();

  const [status, setStatus] = useState([])

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

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
      .then(res => res.json())
      .then(data => setStatus(data))
  }, [])
  const [formData, setFormData] = useState({
    name: "", status: '',
    modified_by: userId,
  });

  const [name, setName] = useState([])
  const [statuss, setstatus] = useState([])
  const [errorMessage, setErrorMessage] = useState("");

  const { data: noticeCategorySingle, isLoading } = useQuery({
    queryKey: ["noticeCategorySingle", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery_category/video_gallery_category_all/${id}`
      );
      const data = await res.json();
      return data;
    },
  });

  const { data: noticeCategory = [] } = useQuery({
    queryKey: ["noticeCategory"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery_category/video_gallery_category_all`
      );
      const data = await res.json();
      const filteredBrands = data.filter(brand => brand.id !== parseInt(id));
      return filteredBrands;
      // return data;
    },
  });

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

    const existingBrand = noticeCategory.find((brand) => brand?.name?.toLowerCase() === formData?.name?.toLowerCase());
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

    // const duplicate = noticeCategory.some(
    //   (existingReligion) =>
    //     existingReligion.name.trim().replace(/\s+/g, "").toLowerCase() ===
    //       formData.name.trim().replace(/\s+/g, "").toLowerCase() &&
    //     existingReligion.id !== id // Ensure it's not the same religion being edited
    // );

    // if (duplicate) {
    //   setErrorMessage(
    //     "Events category name already exists. Please choose a different name."
    //   );
    //   return;
    // }


    if (!formData.name) {
      setName('Video gallery Category name  is required')
      return
    }
    if (!formData.status) {
      setstatus('Status  is required')
      return
    }

    const normalizebrandName = (name) => {
      return name?.trim().replace(/\s+/g, '');
    };


    const existingBrand = noticeCategory.find((brand) => normalizebrandName(brand.name.toLowerCase()) === normalizebrandName(formData.name.toLowerCase()));
    if (existingBrand) {
      // Show error message
      setErrorMessage("Video gallery Category name already exists. Please choose a different Video gallery Category name.");
      return

    }


    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery_category/video_gallery_category_edit/${id}`,
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
    router.push("/Admin/video_gallery_category/video_gallery_category_all");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 p-4">
          <div className="card">
            <div className="card-default">
              <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                <h5 className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">
                  Edit Video Gallery Cetegory
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                  <Link
                    href="/Admin/video_gallery_category/video_gallery_category_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to Video Gallery Category List
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
                      {errorMessage && (
                        <div className="text-danger mt-1">{errorMessage}</div>
                      )}
                      {
                        name && <p className="text-danger">{name}</p>
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
                        statuss && <p className="text-danger">{statuss}</p>
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

export default EditVideoGalleryCategory;
