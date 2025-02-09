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

// import "froala-editor/js/plugins.pkgd.min.js";

// Load all plugins

// Require Editor CSS files.

// import RichTextEditor from "react-rte";

const EditNews = ({ id }) => {
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
  const [noticeData, setNoticeData] = useState({
    title: "",
    news_category: "",
    summary: "",
    description: "",

    status: "",

    modified_by: userId,
  });
  const handleModelChange = (content) => {
    setNoticeData({ ...noticeData, description: content });
  };

  // state management

  const [errorMessage, setErrorMessage] = useState("");

  // single user data get



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
      const filteredBrands = data.filter((brand) => brand.id !== parseInt(id));
      return filteredBrands;
    },
  });

  const [brandSingle, setBrandSingle] = useState([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/news/news_all/${id}`)
      .then((Response) => Response.json())
      .then((data) => setBrandSingle(data));
  }, [id]);

  console.log(brandSingle[0]);

  useEffect(() => {
    setNoticeData({
      title: brandSingle[0]?.title,
      status: brandSingle[0]?.status,
      description: brandSingle[0]?.description,
      news_category: brandSingle[0]?.news_category,
      summary: brandSingle[0]?.summary,
      publish_date: brandSingle[0]?.publish_date,

      modified_by: userId,
    });
  }, [brandSingle, userId]);

  // textEditor

  // const onChange = (value) => {
  //   setValue(value);
  //   setNoticeData((prevData) => ({
  //     ...prevData,
  //     description: value.toString("html"),
  //   }));
  // };

  // publish_date formattedDate

  // publish_date value target

  // // input field target

  // const notice_input_change = (event) => {
  //   const { name, value } = event.target;
  //   setNoticeData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  // file'value target & create file path with file's date and time

  // IMAGE DELETE SUBMIT FORM SERVER

  // const activeDisplayed = false;
  // const inactiveDisplayed = false;

  // const [noticeAll, setNoticeAll] = useState([]);

  // useEffect(() => {
  //   fetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/notice_category/notice_category_all`
  //   )
  //     .then((res) => res.json())
  //     .then((data) => setNoticeAll(data))
  //     .catch((error) => console.log(error.message));
  // }, []);

  const [noticeAll, setNoticeAll] = useState([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/news_category/news_category_all`
    )
      .then((res) => res.json())
      .then((data) => setNoticeAll(data))
      .catch((error) => console.log(error.message));
  }, []);

  // const [activeDisplayed, setActiveDisplayed] = useState(false);
  // // const [inactiveDisplayed, setInactiveDisplayed] = useState(false);

  // // // Compute whether to display 'Active' and 'Inactive' options
  // // noticeAll.forEach((item) => {
  // //   if (item.status === 1 && !activeDisplayed) {
  // //     setActiveDisplayed(true);
  // //   }
  // //   if (item.status === 2 && !inactiveDisplayed) {
  // //     setInactiveDisplayed(true);
  // //   }
  // // });

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [newscategory, setNewscategory] = useState("");

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
      setTitle("News title  is required");
      return;
    }
    if (!noticeData.news_category) {
      setNewscategory("News category title  is required");
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
    if (!noticeData.summary) {
      setSummary("Summary  is required");
      return;
    }

    const normalizebrandName = (name) => {
      return name?.trim().replace(/\s+/g, "");
    };

    const existingBrand = news.find(
      (brand) =>
        normalizebrandName(brand.title.toLowerCase()) ===
        normalizebrandName(noticeData.title.toLowerCase())
    );
    if (existingBrand) {
      // Show error message
      setErrorMessage(
        "News name already exists. Please choose a different Notice Category name."
      );
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/news/news_edit/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noticeData),
      }
    )
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
            Update News
          </h5>
          <div class="card-title font-weight-bold mb-0 card-header-color float-right">
            <Link
              href={`/Admin/news/news_all?page_group=${page_group}`}
              class="btn btn-sm btn-info"
            >
              Back News List
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
                  value={noticeData.news_category}
                  name="news_category"
                  id="news_category"
                  className="form-control form-control-sm required"
                  placeholder="Select News Category"
                >
                  <option value="">Select Notice Category</option>
                  {noticeAll.map((item) => (
                    <>
                      <option value={item.id}>{item.name}</option>
                    </>
                  ))}
                </select>
                {newscategory && <p className="text-danger">{newscategory}</p>}
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
                  value={noticeData.summary}
                  className="form-control form-control-sm required"
                  placeholder="Enter Summary"
                ></textarea>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
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

export default EditNews;
