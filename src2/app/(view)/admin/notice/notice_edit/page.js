"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import FroalaEditorComponent from "react-froala-wysiwyg";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

import "froala-editor/js/plugins.pkgd.min.js";

// Load all plugins

// Require Editor CSS files.

const EditNotice = ({ id }) => {
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

  const [noticeData, setNoticeData] = useState({
    title: "",
    description: "",
    status: "",
    notice_category: "",
    publish_date: "",
    file: "",
    modified_by: userId,
  });

  const handleModelChange = (content) => {
    setNoticeData({ ...noticeData, description: content });
  };
  const [selectedFile, setSelectedFile] = useState(
    Array(noticeData.length).fill(null)
  );

  const [fileNames, setFileNames] = useState([]);

  const brand_combined_change = (e) => {
    brand_file_change(e);
  };

  const brand_file_change = (e) => {
    // e?.preventDefault();
    let files = e.target.files[0];
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const fileName = files.name.split(".")[0];
    const extension = files.name.split(".").pop();
    const newName = `${fileName}.${extension}`;
    const time = `${year}/${month}/${day}/${hours}/${minutes}`;
    const _path = "notice/" + time + "/" + newName;

    const newSelectedFiles = [...selectedFile];
    newSelectedFiles[0] = files; // Assuming you are updating the first element
    newSelectedFiles[0].path = _path;
    setFileNames(newName);
    setSelectedFile(newSelectedFiles);
    upload(files);
  };

  const upload = (file) => {
    const formData = new FormData();
    const extension = file.name.split(".").pop();
    const fileName = file.name.split(".")[0];
    const newName = `${fileName}.${extension}`;
    formData.append("files", file, newName);
    console.log(file);
    setFileNames(newName);

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}:5003/notice`, formData)
      .then((res) => {
        console.log(res);
      })
      .catch((er) => console.log(er));
  };

  // const [filePath, setFilePath] = useState(initialFilePath || ""); // ফাইল পাথ স্টেট
  const [file, setFile] = useState(null); // ফাইল স্টেট
  const [previewUrl, setPreviewUrl] = useState(""); // প্রিভিউ URL
  const [fileSizeError, setFileSizeError] = useState(""); // ফাইল সাইজ ত্রুটি

  const handleEditorChange = (content) => {
    setNoticeData((prevData) => ({
      ...prevData,
      description: content,
    }));
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [sameName, setSameName] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [reformattedDate, setReformattedDate] = useState("");
  // const [value, setValue] = useState(RichTextEditor.createEmptyValue());
  const [currentFile, setCurrentFile] = useState(noticeData.file);

  const [oldFileUrl, setOldFileUrl] = useState(null);

  // single user data get



  const {
    data: notices = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_all`
      );
      const data = await res.json();
      // Filter out the brand with id
      const filteredBrands = data.filter((brand) => brand.id !== parseInt(id));
      return filteredBrands;
    },
  });

  console.log(notices);

  const [brandSingle, setBrandSingle] = useState([]);
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_all/${id}`
    )
      .then((Response) => Response.json())
      .then((data) => setBrandSingle(data));
  }, [id]);

  console.log(brandSingle[0]);

  useEffect(() => {
    setNoticeData({
      title: brandSingle[0]?.title,
      status: brandSingle[0]?.status,
      description: brandSingle[0]?.description,
      notice_category: brandSingle[0]?.notice_category,
      publish_date: brandSingle[0]?.publish_date,
      // file: brandSingle[0]?.file,

      file: selectedFile[0]?.path
        ? selectedFile[0]?.path
        : brandSingle[0]?.file,

      modified_by: userId,
    });
  }, [brandSingle, userId, selectedFile]);

  useEffect(() => {
    const formattedDate = noticeData.publish_date?.split("T")[0];
    if (formattedDate) {
      const [year, month, day] = formattedDate.split("-");
      setReformattedDate(`${day}-${month}-${year}`);
    }
  }, [noticeData.publish_date]);

  // publish_date value target

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    const [year, month, day] = selectedDate.split("-");
    const formattedDatabaseDate = `${year}-${month}-${day}`;
    setNoticeData((prevData) => ({
      ...prevData,
      publish_date: formattedDatabaseDate,
    }));
  };

  // const brandFileChange = async (e) => {
  //   const file = e.target.files[0];

  //   if (!file) return;

  //   // Check file size
  //   if (file.size > 2097152) {
  //     setFileSizeError("Max file size is 2 MB");
  //     return;
  //   } else {
  //     setFileSizeError("");
  //   }

  //   // If there's an existing file, delete it first
  //   if (uploadedFileUrl) {
  //     await handleDelete(false); // Pass false to avoid alert after deletion
  //   }

  //   // Create file path with date and time
  //   const now = new Date();
  //   const year = now.getFullYear();
  //   const month = String(now.getMonth() + 1).padStart(2, "0");
  //   const day = String(now.getDate()).padStart(2, "0");
  //   const hours = String(now.getHours()).padStart(2, "0");
  //   const minutes = String(now.getMinutes()).padStart(2, "0");

  //   const fileName = file.name.split(".")[0];
  //   const extension = file.name.split(".").pop();
  //   const newName = `${fileName}.${extension}`;
  //   const time = `${year}/${month}/${day}/${hours}/${minutes}`;
  //   const path = `notice/${time}/${newName}`;

  //   // Upload the new file
  //   await upload(file, path);

  //   // Set file preview
  //   const previewUrl = URL.createObjectURL(file);
  //   setPreviewUrl(previewUrl);
  //   setOldFileUrl(uploadedFileUrl); // Store the old file URL for deletion
  //   setUploadedFileUrl(path); // Update with the new file URL
  // };

  // const brand_image_remove = () => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this?"
  //   );
  //   if (confirmDelete) {
  //     const newSelectedFiles = [...selectedFile];
  //     newSelectedFiles[0] = null;
  //     setSelectedFile(newSelectedFiles);
  //     const filePathToDelete = noticeData.file;
  //     if (filePathToDelete) {
  //       axios
  //         .delete(
  //           `${process.env.NEXT_PUBLIC_API_URL}:5003/notice/${filePathToDelete}`
  //         )
  //         .then((res) => {
  //           console.log(res);

  //           console.log(`File ${filePathToDelete} deleted successfully`);
  //           // Update brandData to remove the file path
  //           setNoticeData((prevData) => ({
  //             ...prevData,
  //             file: "",
  //           }));
  //         })
  //         .catch((err) => {
  //           console.error(`Error deleting file ${filePathToDelete}:`, err);
  //         });
  //     }
  //   }
  // };

  const handleDelete = async (showAlert = true) => {
    if (!uploadedFileUrl) return;

    if (showAlert) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this file?"
      );
      if (!confirmDelete) return;
    }

    try {
      const urlParts = uploadedFileUrl.split("/");
      const [year, month, day, hour, minute, fileName] = urlParts.slice(-6);

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}:5003/notice/${year}/${month}/${day}/${hour}/${minute}/${fileName}`
      );

      if (response.status === 200) {
        setUploadedFileUrl(null);
        setPreviewUrl(null);
        if (showAlert) {
          alert("File deleted successfully");
        }
      } else {
        throw new Error("Failed to delete file: " + response.statusText);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      if (showAlert) {
        alert("Failed to delete file: " + error.message);
      }
    }
  };

  // const upload = async (file, path) => {
  //   const formData = new FormData();

  //   console.log(formData);

  //   formData.append("file", file);
  //   formData.append("path", path); // Assuming backend needs this info

  //   try {
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_API_URL}:5003/notice`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       // Assuming the response contains the URL of the uploaded file
  //       const { data } = response;
  //       setUploadedFileUrl(data.fileUrl || path); // Update with actual file URL from response if available
  //     } else {
  //       throw new Error("Failed to upload file: " + response.statusText);
  //     }
  //   } catch (error) {
  //     setFileSizeError("Error uploading file: " + error.message);
  //     console.error("Upload error:", error);
  //   }
  // };

  const [noticeAll, setNoticeAll] = useState([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice_category/notice_category_all`
    )
      .then((res) => res.json())
      .then((data) => setNoticeAll(data))
      .catch((error) => console.log(error.message));
  }, []);

  const [activeDisplayed, setActiveDisplayed] = useState(false);
  const [inactiveDisplayed, setInactiveDisplayed] = useState(false);

  // Compute whether to display 'Active' and 'Inactive' options
  noticeAll.forEach((item) => {
    if (item.status === 1 && !activeDisplayed) {
      setActiveDisplayed(true);
    }
    if (item.status === 2 && !inactiveDisplayed) {
      setInactiveDisplayed(true);
    }
  });

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [publish, setPublish] = useState("");
  const [noticecategory, setNoticecategory] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "title") {
      setTitle("");
    }
    if (name === "notice_category") {
      setNoticecategory("");
    }
    if (name === "description") {
      setDescription("");
    }
    if (name === "status") {
      setStatus("");
    }
    if (name === "publish_date") {
      setPublish("");
    }

    const existingBrand = notices.find(
      (brand) =>
        brand?.title?.toLowerCase() === noticeData?.title?.toLowerCase()
    );
    if (!existingBrand) {
      // Show error message
      setErrorMessage("");
    }
    setNoticeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // form handle submit data send in server
  const notice_update = (e) => {
    e.preventDefault();

    if (!noticeData.title) {
      setTitle("Notice title  is required");
      return;
    }
    if (!noticeData.notice_category) {
      setNoticecategory("Notice category title  is required");
      return;
    }

    if (!noticeData.description) {
      setDescription("Description name  is required");
      return;
    }
    if (!noticeData.status) {
      setStatus("Status  is required");
      return;
    }
    if (!noticeData.publish_date) {
      setPublish("Publish date  is required");
      return;
    }

    const normalizebrandName = (name) => {
      return name?.trim().replace(/\s+/g, "");
    };

    const existingBrand = notices.find(
      (brand) =>
        normalizebrandName(brand.title.toLowerCase()) ===
        normalizebrandName(noticeData.title.toLowerCase())
    );
    if (existingBrand) {
      // Show error message
      setErrorMessage(
        "Notice Category name already exists. Please choose a different Notice Category name."
      );
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_edit/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...noticeData,
          file: uploadedFileUrl || noticeData.file,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem("message", "Data saved successfully!");
          }
          router.push("/Admin/notice/notice_all");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const [statuss, setStatuss] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
      .then((res) => res.json())
      .then((data) => setStatuss(data));
  }, []);

  return (
    <div class="col-md-12 body-content bg-light p-4">
      <div class=" border-primary shadow-sm border-0">
        <div class="card-header py-1 bg-dark custom-card-header clearfix bg-gradient-primary text-white">
          <h5 class="card-title font-weight-bold mb-0 card-header-color float-left mt-1">
            Update Notice
          </h5>
          <div class="card-title font-weight-bold mb-0 card-header-color float-right">
            <Link
              href={`/Admin/notice/notice_all?page_group=${page_group}`}
              class="btn btn-sm btn-info"
            >
              Back Notece List
            </Link>
          </div>
        </div>
        <form action="" onSubmit={notice_update}>
          <div class="card-body">
            <div className="form-group row">
              <label className="col-form-label font-weight-bold col-md-3">
                Title:
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
                  value={noticeData.title}
                  onChange={handleChange}
                  className="form-control form-control-sm required w-30"
                  id="title"
                  placeholder="Enter Title"
                  type="text"
                  name="title"
                />
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                {title && <p className="text-danger">{title}</p>}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-form-label font-weight-bold col-md-3">
                Notice Category:
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
                  value={noticeData.notice_category}
                  name="notice_category"
                  id="notice_category"
                  className="form-control form-control-sm required"
                  placeholder="Select Notice Category"
                >
                  <option value="">Select Notice Category</option>
                  {noticeAll.map((item) => (
                    <>
                      <option value={item.id}>{item.name}</option>
                    </>
                  ))}
                </select>
                {noticecategory && (
                  <p className="text-danger">{noticecategory}</p>
                )}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-form-label font-weight-bold col-md-3">
                Publish Date:
                <small>
                  <sup>
                    <small>
                      <i className="text-danger fas fa-star"></i>
                    </small>
                  </sup>
                </small>
              </label>
              <div class="col-md-6">
                <input
                  type="text"
                  readOnly
                  defaultValue={reformattedDate}
                  onClick={() =>
                    document.getElementById(`dateInput-n`).showPicker()
                  }
                  placeholder="dd-mm-yyyy"
                  className="form-control form-control-sm mb-2"
                  style={{ display: "inline-block" }}
                />
                <input
                  name="publish_date"
                  type="date"
                  id={`dateInput-n`}
                  onChange={(e) => handleDateChange(e)}
                  style={{
                    position: "absolute",
                    bottom: "40px",
                    left: "10px",
                    visibility: "hidden",
                  }}
                />
              </div>
              {publish && <p className="text-danger">{publish}</p>}
            </div>

            {/* <div className="form-group row">
              <label className="col-form-label font-weight-bold col-md-3">
                Description:
                <small>
                  <sup>
                    <small>
                      <i className="text-danger fas fa-star"></i>
                    </small>
                  </sup>
                </small>
              </label>

              <div className="col-md-6">
                <FroalaEditorComponent
                  name="description"
                  tag="textarea"
                  model={noticeData.description}
                  onModelChange={handleEditorChange}
                  config={{
                    toolbarButtons: [
                      "undo",
                      "redo",
                      "bold",
                      "italic",
                      "underline",
                      "strikethrough",
                      "subscript",
                      "superscript",
                      "fontFamily",
                      "fontSize",
                      "color",
                      "emoticons",
                      "paragraphFormat",
                      "align",
                      "formatOL",
                      "formatUL",
                      "outdent",
                      "indent",
                      "quote",
                      "insertLink",
                      "insertImage",
                      "insertVideo",
                      "insertFile",
                      "insertTable",
                      "html",
                      "undo",
                      "redo",
                      "fullscreen",
                      "print",
                      "save",
                      "help",
                    ],
                    toolbarButtonsXS: [
                      "undo",
                      "redo",
                      "bold",
                      "italic",
                      "underline",
                      "strikethrough",
                      "subscript",
                      "superscript",
                      "fontFamily",
                      "fontSize",
                      "color",
                      "emoticons",
                      "paragraphFormat",
                      "align",
                      "formatOL",
                      "formatUL",
                      "outdent",
                      "indent",
                      "quote",
                      "insertLink",
                      "insertImage",
                      "insertVideo",
                      "insertFile",
                      "insertTable",
                      "html",
                      "fullscreen",
                    ],
                    toolbarButtonsMD: [
                      "undo",
                      "redo",
                      "bold",
                      "italic",
                      "underline",
                      "strikethrough",
                      "subscript",
                      "superscript",
                      "fontFamily",
                      "fontSize",
                      "color",
                      "emoticons",
                      "paragraphFormat",
                      "align",
                      "formatOL",
                      "formatUL",
                      "outdent",
                      "indent",
                      "quote",
                      "insertLink",
                      "insertImage",
                      "insertVideo",
                      "insertFile",
                      "insertTable",
                      "html",
                      "fullscreen",
                    ],
                    toolbarButtonsLG: [
                      "undo",
                      "redo",
                      "bold",
                      "italic",
                      "underline",
                      "strikethrough",
                      "subscript",
                      "superscript",
                      "fontFamily",
                      "fontSize",
                      "color",
                      "emoticons",
                      "paragraphFormat",
                      "align",
                      "formatOL",
                      "formatUL",
                      "outdent",
                      "indent",
                      "quote",
                      "insertLink",
                      "insertImage",
                      "insertVideo",
                      "insertFile",
                      "insertTable",
                      "html",
                      "fullscreen",
                    ],
                    imageUploadURL: `${process.env.NEXT_PUBLIC_API_URL}:5003/editor`,
                    imageUploadParams: { id: "editor" },
                    imageUploadMethod: "POST",
                    fileUploadURL: `${process.env.NEXT_PUBLIC_API_URL}:5003/editor`,
                    fileUploadParams: { id: "editor" },
                    fileUploadMethod: "POST",
                    fileMaxSize: 10 * 1024 * 1024, // 10MB
                    fileAllowedTypes: [
                      "image/jpeg",
                      "image/png",
                      "application/pdf",
                    ],
                    pluginsEnabled: [
                      "align",
                      "charCounter",
                      "codeBeautifier",
                      "colors",
                      "draggable",
                      "embedly",
                      "entities",
                      "file",
                      "fontFamily",
                      "fontSize",
                      "fullscreen",
                      "image",
                      "inlineStyle",
                      "link",
                      "lists",
                      "paragraphFormat",
                      "paragraphStyle",
                      "print",
                      "save",
                      "table",
                      "url",
                      "video",
                      "wordPaste",
                    ],
                  }}
                />

                {errorMessage && (
                  <div className="invalid-feedback">{errorMessage}</div>
                )}
                {description && <p className="text-danger">{description}</p>}
              </div>
            </div> */}

            <div className="form-group row">
              <label className="col-form-label font-weight-bold col-md-3">
                Description:
                <small>
                  <sup>
                    <small>
                      <i className="text-danger fas fa-star"></i>
                    </small>
                  </sup>
                </small>
              </label>

              <div className="col-md-6">
                <FroalaEditorComponent
                  tag="textarea"
                  // model={content}
                  model={noticeData.description}
                  onModelChange={handleModelChange}
                  config={{
                    placeholderText: "Type Here",
                    toolbarButtons: [
                      "undo",
                      "redo",
                      "bold",
                      "italic",
                      "underline",
                      "strikethrough",
                      "subscript",
                      "superscript",
                      "fontFamily",
                      "fontSize",
                      "color",
                      "emoticons",
                      "paragraphFormat",
                      "align",
                      "formatOL",
                      "formatUL",
                      "outdent",
                      "indent",
                      "quote",
                      "insertLink",
                      "insertImage",
                      "insertVideo",
                      "insertFile",
                      "insertTable",
                      "html",
                      "undo",
                      "redo",
                      "fullscreen",
                      "print",
                      "save",
                      "help",
                    ],
                    toolbarButtonsXS: [
                      "undo",
                      "redo",
                      "bold",
                      "italic",
                      "underline",
                      "strikethrough",
                      "subscript",
                      "superscript",
                      "fontFamily",
                      "fontSize",
                      "color",
                      "emoticons",
                      "paragraphFormat",
                      "align",
                      "formatOL",
                      "formatUL",
                      "outdent",
                      "indent",
                      "quote",
                      "insertLink",
                      "insertImage",
                      "insertVideo",
                      "insertFile",
                      "insertTable",
                      "html",
                      "fullscreen",
                    ],
                    toolbarButtonsMD: [
                      "undo",
                      "redo",
                      "bold",
                      "italic",
                      "underline",
                      "strikethrough",
                      "subscript",
                      "superscript",
                      "fontFamily",
                      "fontSize",
                      "color",
                      "emoticons",
                      "paragraphFormat",
                      "align",
                      "formatOL",
                      "formatUL",
                      "outdent",
                      "indent",
                      "quote",
                      "insertLink",
                      "insertImage",
                      "insertVideo",
                      "insertFile",
                      "insertTable",
                      "html",
                      "fullscreen",
                    ],
                    toolbarButtonsLG: [
                      "undo",
                      "redo",
                      "bold",
                      "italic",
                      "underline",
                      "strikethrough",
                      "subscript",
                      "superscript",
                      "fontFamily",
                      "fontSize",
                      "color",
                      "emoticons",
                      "paragraphFormat",
                      "align",
                      "formatOL",
                      "formatUL",
                      "outdent",
                      "indent",
                      "quote",
                      "insertLink",
                      "insertImage",
                      "insertVideo",
                      "insertFile",
                      "insertTable",
                      "html",
                      "fullscreen",
                    ],

                    videoUploadURL: `${process.env.NEXT_PUBLIC_API_URL}:5003/editor`, // Video upload URL
                    videoUploadParams: { id: "editor" },
                    videoUploadMethod: "POST",
                    videoMaxSize: 50 * 1024 * 1024, // 50MB max size for videos
                    videoAllowedTypes: ["mp4", "webm", "ogg"], // Allowed video formats
                    imageUploadURL: `${process.env.NEXT_PUBLIC_API_URL}:5003/editor`,
                    imageUploadParams: { id: "editor" },
                    imageUploadMethod: "POST",
                    fileUploadURL: `${process.env.NEXT_PUBLIC_API_URL}:5003/editor`,
                    fileUploadParams: { id: "editor" },
                    fileUploadMethod: "POST",
                    fileMaxSize: 10 * 1024 * 1024, // 10MB
                    fileAllowedTypes: [
                      "image/jpeg",
                      "image/png",
                      "application/pdf",
                    ],
                    pluginsEnabled: [
                      "align",
                      "charCounter",
                      "codeBeautifier",
                      "colors",
                      "draggable",
                      "embedly",
                      "entities",
                      "file",
                      "fontFamily",
                      "fontSize",
                      "fullscreen",
                      "image",
                      "inlineStyle",
                      "link",
                      "lists",
                      "paragraphFormat",
                      "paragraphStyle",
                      "print",
                      "save",
                      "table",
                      "url",
                      "video",
                      "wordPaste",
                    ],
                  }}
                />

                {description && (
                  <div className="text-danger">{description}</div>
                )}
              </div>
            </div>

            <div class="form-group row">
              <label class="col-form-label col-md-3">
                <strong>File:</strong>
              </label>
              <div class="col-md-6">
                <div>
                  <span class="btn btn-success btn-sm ">
                    <label for="fileInput" className="mb-0">
                      Select Image{" "}
                    </label>
                    <input
                      // multiple
                      name="file_path"
                      onChange={brand_combined_change}
                      type="file"
                      id="fileInput"
                      style={{ display: "none" }}
                    />
                  </span>
                </div>

                {selectedFile[0] ? (
                  <>
                    <img
                      style={{ height: 100 }}
                      className=" mb-2 img-thumbnail"
                      onChange={(e) => brand_file_change(e)}
                      src={URL.createObjectURL(selectedFile[0])}
                      alt="Uploaded File"
                    />

                    <input
                      type="hidden"
                      name="file"
                      value={selectedFile[0].path}
                    />
                    {/* <button
                      onClick={brand_image_remove}
                      type="button"
                      className="btn btn-danger btn-sm position-absolute float-right ml-n4"
                    ></button> */}
                  </>
                ) : (
                  <>
                    {noticeData.file ? (
                      <>
                        <img
                          style={{ height: 100 }}
                          src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${noticeData.file}`}
                          alt="Uploaded File"
                        />
                        {/* <button
                          onClick={brand_image_remove}
                          type="button"
                          className="btn btn-danger btn-sm position-absolute float-right ml-n4"
                        >
                          {" "}
                          <RiDeleteBin6Line />
                        </button> */}
                      </>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </div>
            </div>

            <div class="form-group row">
              <label class="col-form-label col-md-3">
                <strong>Status:</strong>
              </label>
              <div class="col-md-6">
                <select
                  value={noticeData.status}
                  onChange={handleChange}
                  name="status"
                  class="form-control form-control-sm "
                  placeholder="Enter Role Name"
                >
                  <option>Select Status</option>
                  {statuss.map((status) => (
                    <>
                      <option value={status.id}>{status.status_name}</option>
                    </>
                  ))}
                </select>
                {status && <p className="text-danger">{status}</p>}
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNotice;
