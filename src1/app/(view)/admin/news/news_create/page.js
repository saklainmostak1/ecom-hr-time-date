"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

import "froala-editor/js/plugins.pkgd.min.js";

import FroalaEditorComponent from "react-froala-wysiwyg";

const NewsCreate = () => {


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
    news_category: "",
    summary: "",
    description: "",

    status: "",

    created_by: created_by,
  });

  const handleModelChange = (content) => {
    setFormData({ ...formData, description: content });
  };

  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: news = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/news/news_all`
      );
      const data = await res.json();
      // Filter out the brand with id
      return data;
    },
  });

  const [noticeAll, setNoticeAll] = useState([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/news_category/news_category_all`
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

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [newscategory, setNewscategory] = useState("");

  // input field handleSubmit
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "title") {
      setTitle("");
    }
    if (name === "news_category") {
      setNewscategory("");
    }
    if (name === "description") {
      setDescription("");
    }
    if (name === "status") {
      setStatus("");
    }
    if (name === "summary") {
      setSummary("");
    }

    const existingBrand = news.find(
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
      setTitle("News title  is required");
      return;
    }
    if (!formData.news_category) {
      setNewscategory("News category title  is required");
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
    if (!formData.summary) {
      setSummary("summary  is required");
      return;
    }

    const normalizebrandName = (name) => {
      return name?.trim().replace(/\s+/g, "");
    };

    const existingBrand = news.find(
      (brand) =>
        normalizebrandName(brand.title.toLowerCase()) ===
        normalizebrandName(formData.title.toLowerCase())
    );
    if (existingBrand) {
      // Show error message
      setErrorMessage(
        "News  name already exists. Please choose a different Notice Category name."
      );
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/news/news_create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem("message", "Data saved successfully!");
        }
          router.push("/Admin/news/news_all");
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
                  Create News
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                  <Link
                    href="/Admin/notice/notice_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to News List
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
                      News Category:
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
                        value={formData.news_category}
                        name="news_category"
                        id="news_category"
                        className="form-control form-control-sm "
                        placeholder="Select News Category"
                      >
                        <option>Select News Category</option>
                        {noticeAll.map((item) => (
                          <>
                            <option value={item.id}>{item.name}</option>
                          </>
                        ))}
                      </select>

                      {newscategory && (
                        <div className="text-danger">{newscategory}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-form-label font-weight-bold col-md-3">
                      Summary:
                      <small>
                        <sup>
                          <small>
                            <i className="text-danger fas fa-star"></i>
                          </small>
                        </sup>
                      </small>{" "}
                    </label>
                    <div className="col-md-6">
                      <textarea
                        type="text"
                        name="summary"
                        id="summary"
                        rows="5"
                        onChange={handleChange}
                        value={formData.summary}
                        className="form-control form-control-sm required"
                        placeholder="Enter Summary"
                      ></textarea>
                      {errorMessage && (
                        <p className="text-danger">{errorMessage}</p>
                      )}
                      {summary && <div className="text-danger">{summary}</div>}
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

export default NewsCreate;
