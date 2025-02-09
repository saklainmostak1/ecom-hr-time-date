"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

import "froala-editor/js/plugins.pkgd.min.js";

import FroalaEditorComponent from "react-froala-wysiwyg";

const EditVideoGallery = ({ id }) => {
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
    link: "",
    description: "",
    status: "", // Ensure this is initialized
    video_category: "",

    modified_by:userId,
  });

  const handleModelChange = (content) => {
    setNoticeData({ ...noticeData, description: content });
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [sameName, setSameName] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSizeError, setFileSizeError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [reformattedDate, setReformattedDate] = useState("");
  // const [value, setValue] = useState(RichTextEditor.createEmptyValue());
  const [currentFile, setCurrentFile] = useState(noticeData.file);
  const [fileNames, setFileNames] = useState([]);

  const [oldFileUrl, setOldFileUrl] = useState(null);

  // single user data get

 

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
      const filteredBrands = data.filter((brand) => brand.id !== parseInt(id));
      return filteredBrands;
    },
  });

  const [brandSingle, setBrandSingle] = useState([]);
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery/video_gallery_all/${id}`
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
      video_category: brandSingle[0]?.video_category,
      link: brandSingle[0]?.link,

      modified_by: userId,
    });
  }, [brandSingle, userId]);

  const [noticeAll, setNoticeAll] = useState([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery_category/video_gallery_category_all`
    )
      .then((res) => res.json())
      .then((data) => setNoticeAll(data))
      .catch((error) => console.log(error.message));
  }, []);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [videocategory, setVideocategory] = useState("");

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
    if (!noticeData.video_category) {
      setVideocategory("Video category title  is required");
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
    if (!noticeData.link) {
      setLink("Link  is required");
      return;
    }

    const normalizebrandName = (name) => {
      return name?.trim().replace(/\s+/g, "");
    };

    const existingBrand = video.find(
      (brand) =>
        normalizebrandName(brand.title.toLowerCase()) ===
        normalizebrandName(noticeData.title.toLowerCase())
    );
    if (existingBrand) {
      // Show error message
      setErrorMessage(
        "Video Category name already exists. Please choose a different Video Category name."
      );
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/video_gallery/video_gallery_edit/${id}`,
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
          router.push("/Admin/video_gallery/video_gallery_all");
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
            Update Video Gallery
          </h5>
          <div class="card-title font-weight-bold mb-0 card-header-color float-right">
            <Link
              href={`/Admin/video_gallery/video_gallery_all?page_group=${page_group}`}
              class="btn btn-sm btn-info"
            >
              Back Video Gallery List
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
                  className="form-control form-control-sm required"
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
                {videocategory && (
                  <p className="text-danger">{videocategory}</p>
                )}
              </div>
            </div>

            <div className="form-group row">
              <label className="col-form-label font-weight-bold col-md-3">
                Link:
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
                  value={noticeData.link}
                  onChange={handleChange}
                  className="form-control form-control-sm required"
                  id="link"
                  placeholder="Enter Link"
                  type="text"
                  name="link"
                />
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                {link && <p className="text-danger">{link}</p>}
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

export default EditVideoGallery;
