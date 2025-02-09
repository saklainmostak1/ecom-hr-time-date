"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { RiDeleteBin6Line } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

import "froala-editor/js/plugins.pkgd.min.js";

import FroalaEditorComponent from "react-froala-wysiwyg";

const NoticeCreate = () => {

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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    created_by: created_by,
    notice_category: "",
    publish_date: "",
    file: "",
  });
  const handleModelChange = (content) => {
    setFormData({ ...formData, description: content });
  };

  const [errorMessage, setErrorMessage] = useState("");

  // DATA LIST FETCH FORM API
  const {
    data: notice = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notice"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_all`
      );
      const data = await res.json();
      // Filter out the brand with id
      return data;
    },
  });

  const [noticeAll, setNoticeAll] = useState([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice_category/notice_category_all`
    )
      .then((res) => res.json())
      .then((data) => setNoticeAll(data))
      .catch((error) => console.log(error.message));
  }, []);

  const [statuss, setStatuss] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/status/all_status`)
      .then((res) => res.json())
      .then((data) => setStatuss(data));
  }, []);

  // Compute whether to display 'Active' and 'Inactive' options

  // delete image or file
  const handleDelete = async () => {
    if (!uploadedFileUrl) return;

    try {
      const urlParts = uploadedFileUrl.split("/");
      const [year, month, day, hour, minute, fileName] = urlParts.slice(-6);

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}:5003/notice/${year}/${month}/${day}/${hour}/${minute}/${fileName}`
      );

      if (response.status === 200) {
        setUploadedFileUrl(null);
        window.confirm("Are you sure you want to delete this file.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file");
    }
  };

  // CURRENT TIME DISPLAY IN publish_date In input field
  useEffect(() => {
    const currentDate = new Date();

    const formattedDate = currentDate.toISOString().split("T")[0]; // Example: '2024-08-12'

    setFormattedDisplayDate(formattedDate);
    setFormData((prevData) => ({
      ...prevData,
      publish_date: formattedDate,
    }));
  }, []);

  // file or image
  const [selectedFile, setSelectedFile] = useState(
    Array(formData.length).fill(null)
  );
  const [fileNames, setFileNames] = useState([]);

  console.log(fileNames);
  console.log(selectedFile[0]?.path);
  const [currentDate, setCurrentDate] = useState([]);

  console.log(currentDate);

  const [reformattedDate, setReformattedDate] = useState("");

  useEffect(() => {
    const period_name = setFormData.publish_date;
    const formattedDate = period_name?.split("T")[0];

    if (formattedDate?.includes("-")) {
      const [year, month, day] = formattedDate.split("-");
      setReformattedDate(`${day}-${month}-${year}`);
    } else {
      console.log("Date format is incorrect:", formattedDate);
    }
  }, [formData]);

  const [fileSizeError, setFileSizeError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [formattedDisplayDate, setFormattedDisplayDate] = useState("");

  // image or file handle submit
  const brandFileChange = (e) => {
    const file = e.target.files[0];
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const fileName = file.name.split(".")[0];
    const extension = file.name.split(".").pop();
    const newName = `${fileName}.${extension}`;
    const time = `${year}/${month}/${day}/${hours}/${minutes}`;
    const path = `notice/${time}/${newName}`;

    const newSelectedFile = { ...file, path };

    if (file.size <= 2097152) {
      setFileSizeError("");
      setFileNames(newName);
      setSelectedFile(newSelectedFile);
      setUploadProgress(0); // Reset progress when a new file is selected
      upload(file, path);
    } else {
      setFileSizeError("Max file size 2 MB");
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviewUrl(previewUrl);

    if (file && file.size > 1024 * 1024 * 2) {
      // Example: max 2MB file size
      setFileSizeError("File size exceeds 2MB");
    } else {
      setFileSizeError(null);
      // Assume the file is uploaded and you get the uploadedFileUrl from the server
      const fakeUploadedUrl = "notice/2024/08/13/12/30/yourfile.png"; // Replace with actual response
      setUploadedFileUrl(fakeUploadedUrl);
    }
  };

  // image upload in directory
  const upload = (file, path) => {
    const formData = new FormData();
    const extension = file.name.split(".").pop();
    const fileName = file.name.split(".")[0];
    const newName = `${fileName}.${extension}`;
    formData.append("files", file, newName);

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}:5003/notice`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      })
      .then((res) => {
        setUploadProgress(100); // Set progress to 100% on success
        setUploadedFileUrl(path);
        setFormData((prevData) => ({
          ...prevData,
          file: path, // Set the file path in form data
        }));
      })
      .catch((err) => {
        setUploadProgress(0); // Reset the progress bar on error
        setErrorMessage("File upload failed. Please try again.");
      });
  };

  // Dateformat publish_date field

  const handleDateSelection = (event) => {
    const inputDate = event.target.value;
    const [year, month, day] = inputDate.split("-");
    const formattedDate = `${day}-${month}-${year}`;
    const formattedDatabaseDate = `${year}-${month}-${day}`;
    setFormattedDisplayDate(formattedDate);
    const selectedDate = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      publish_date: formattedDatabaseDate,
      publish_date: selectedDate,
    }));

    setFormattedDisplayDate(selectedDate);
  };

  useEffect(() => {
    const dob = formData.publish_date;
    const formattedDate = dob?.split("T")[0];
    if (formattedDate?.includes("-")) {
      const [year, month, day] = formattedDate.split("-");
      setFormattedDisplayDate(`${day}-${month}-${year}`);
    }
  }, [formData.publish_date]);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [publish, setPublish] = useState("");
  const [noticecategory, setNoticecategory] = useState("");

  // input field handleSubmit
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

    const existingBrand = notice.find(
      (brand) => brand?.title?.toLowerCase() === formData?.title?.toLowerCase()
    );
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

    if (!formData.title) {
      setTitle("Notice title  is required");
      return;
    }
    if (!formData.notice_category) {
      setNoticecategory("Notice category title  is required");
      return;
    }

    if (!formData.description) {
      setDescription("Description name  is required");
      return;
    }
    if (!formData.status) {
      setStatus("Status  is required");
      return;
    }
    if (!formData.publish_date) {
      setPublish("Publish date  is required");
      return;
    }

    const normalizebrandName = (name) => {
      return name?.trim().replace(/\s+/g, "");
    };

    const existingBrand = notice.find(
      (brand) =>
        normalizebrandName(brand.title.toLowerCase()) ===
        normalizebrandName(formData.title.toLowerCase())
    );
    if (existingBrand) {
      // Show error message
      setErrorMessage(
        "Notice Category name already exists. Please choose a different Notice Category name."
      );
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice/notice_create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

  console.log(formData);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 p-4">
          <div className="card">
            <div className="card-default">
              <div className="card-header custom-card-header py-1 clearfix bg-gradient-primary text-white">
                <h5 className="card-title card-header-period font-weight-bold mb-0 float-left mt-1">
                  Create Notice
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                  <Link
                    href="/Admin/notice/notice_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to Notice List
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
                        value={formData.title}
                        onChange={handleChange}
                        maxLength={255}
                        className="form-control form-control-sm "
                        id="title"
                        placeholder="Enter Title"
                        type="text"
                        name="title"
                      />
                      {title && <div className="text-danger">{title}</div>}
                      {errorMessage && (
                        <div className="text-danger">{errorMessage}</div>
                      )}
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
                        value={formData.notice_category}
                        name="notice_category"
                        id="notice_category"
                        className="form-control form-control-sm "
                        placeholder="Select Notice Category"
                      >
                        <option>Select Notice Category</option>
                        {noticeAll.map((item) => (
                          <>
                            <option value={item.id}>{item.name}</option>
                          </>
                        ))}
                      </select>

                      {noticecategory && (
                        <div className="text-danger">{noticecategory}</div>
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
                    <div className="col-md-6">
                      <input
                        type="text"
                        readOnly
                        value={formattedDisplayDate}
                        onClick={() =>
                          document.getElementById("dateInput-nt").showPicker()
                        }
                        placeholder="Enter Publish Date"
                        className="form-control form-control-sm mb-2"
                        style={{ display: "inline-block" }}
                      />
                      <input
                        name="publish_date"
                        type="date"
                        id="dateInput-nt"
                        value={formData.publish_date}
                        onChange={handleDateSelection}
                        style={{
                          position: "absolute",
                          bottom: "40px",
                          left: "10px",
                          visibility: "hidden",
                        }}
                      />

                      {publish && <div className="text-danger">{publish}</div>}
                    </div>
                  </div>

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
                        model={formData.description}
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

                  <div className="form-group row">
                    <label className="col-form-label font-weight-bold col-md-3">
                      File:
                      <small>
                        <sup>
                          <small>
                            <i className="text-danger fas fa-star"></i>
                          </small>
                        </sup>
                      </small>
                    </label>
                    <div className="col-md-6">
                      <div>
                        <span className="btn btn-success btn-sm">
                          <label htmlFor="fileInput" className="mb-0">
                            <span className="ml-1">Select Image</span>
                          </label>
                          <input
                            name="file"
                            type="file"
                            id="fileInput"
                            style={{ display: "none" }}
                            onChange={brandFileChange}
                          />
                        </span>
                      </div>
                      {fileSizeError && (
                        <div className="text-danger">{fileSizeError}</div>
                      )}
                      <input
                        type="text"
                        className="d-none"
                        value={uploadedFileUrl || ""}
                        name="file"
                      />
                      <div id="software_logo">
                        {uploadedFileUrl && (
                          <>
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}:5003/${uploadedFileUrl}`}
                              alt="Uploaded"
                              className="img-fluid mt-2"
                              style={{ width: "100px" }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={handleDelete}
                            >
                              <RiDeleteBin6Line />
                            </button>
                          </>
                        )}
                      </div>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div>Uploading... {uploadProgress}% completed</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label font-weight-bold col-md-3">
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
                        placeholder="Select Status"
                      >
                        <option value="">Select Status</option>
                        {statuss.map((status) => (
                          <>
                            <option value={status.id}>
                              {status.status_name}
                            </option>
                          </>
                        ))}
                      </select>
                      {status && <div className="text-danger">{status}</div>}
                    </div>
                    <div></div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                      <div className="text-left">
                        <button
                          type="submit"
                          className="btn btn-sm btn-success mr-2"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row my-2">
                  <div className="col-md-3"></div>
                  <div className="col-md-6"></div>
                </div>
              </div>

              <div className="card-footer clearfix">
                <div className="float-right"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeCreate;
