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

const VidoGalleryCreate = () => {
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
    link: "",
    status: "",
    video_category: "",
    description: "",
    created_by: created_by,
  });

  const handleModelChange = (content) => {
    setFormData({ ...formData, description: content });
  };

  const [errorMessage, setErrorMessage] = useState("");

  // DATA LIST FETCH FORM API
  const {
    data: video = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["video"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery/video_gallery_all`
      );
      const data = await res.json();
      // Filter out the brand with id
      return data;
    },
  });

  const [noticeAll, setNoticeAll] = useState([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery_category/video_gallery_category_all`
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

  // CURRENT TIME DISPLAY IN publish_date In input field

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

  const [fileSizeError, setFileSizeError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [formattedDisplayDate, setFormattedDisplayDate] = useState("");

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [videocategory, setVideocategory] = useState("");

  // input field handleSubmit
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "title") {
      setTitle("");
    }
    if (name === "video_category") {
      setVideocategory("");
    }
    if (name === "description") {
      setDescription("");
    }
    if (name === "status") {
      setStatus("");
    }
    if (name === "link") {
      setLink("");
    }

    const existingBrand = video.find(
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
      setTitle("video title  is required");
      return;
    }
    if (!formData.video_category) {
      setVideocategory("Video category title  is required");
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
    if (!formData.link) {
      setLink("Link  is required");
      return;
    }

    const normalizebrandName = (name) => {
      return name?.trim().replace(/\s+/g, "");
    };

    const existingBrand = video.find(
      (brand) =>
        normalizebrandName(brand.title.toLowerCase()) ===
        normalizebrandName(formData.title.toLowerCase())
    );
    if (existingBrand) {
      // Show error message
      setErrorMessage(
        "Video Category name already exists. Please choose a different Video Category name."
      );
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery/video_gallery_create`,
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
        if (data) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem("message", "Data saved successfully!");
          }
          router.push("/Admin/video_gallery/video_gallery_all");
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
                  Create Video Gallery
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                  <Link
                    href="/Admin/video_gallery/video_gallery_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to Video Gallery List
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
                        maxLength={255}
                        value={formData.title}
                        onChange={handleChange}
                        className="form-control form-control-sm"
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
                      Video Category:
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
                        value={formData.video_category}
                        name="video_category"
                        id="video_category"
                        className="form-control form-control-sm "
                        placeholder="Select Vidoe Category"
                      >
                        <option>Select Video Category</option>
                        {noticeAll.map((item) => (
                          <>
                            <option value={item.id}>{item.name}</option>
                          </>
                        ))}
                      </select>

                      {videocategory && (
                        <div className="text-danger">{videocategory}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label font-weight-bold col-md-3">
                      Link:
                      <small>
                        <sup>
                          <small>
                            <i className="text-danger fas fa-star"></i>{" "}
                          </small>
                        </sup>{" "}
                      </small>
                    </label>
                    <div className="col-md-6">
                      {" "}
                      <input
                        required
                        value={formData.link}
                        onChange={handleChange}
                        className="form-control form-control-sm required"
                        id="link"
                        placeholder="Enter Link"
                        type="text"
                        name="link"
                      />
                      {errorMessage && (
                        <p className="text-danger">{errorMessage}</p>
                      )}
                      {link && <div className="text-danger">{link}</div>}
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

export default VidoGalleryCreate;
