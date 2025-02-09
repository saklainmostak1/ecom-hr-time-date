"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// import { RiDeleteBin6Line } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";

// import "froala-editor/css/froala_style.min.css";
// import "froala-editor/css/froala_editor.pkgd.min.css";

// import "froala-editor/js/plugins.pkgd.min.js";

// import FroalaEditorComponent from "react-froala-wysiwyg";

const MemosQuotation = () => {

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
    created_by: created_by,

  });
  const handleModelChange = (content) => {
    setFormData({ ...formData, description: content });
  };

  const [errorMessage, setErrorMessage] = useState("");

  // DATA LIST FETCH FORM API
  const {
    data: quotation_memo = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["quotation_memo"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/quotation/quotation_memo_single/1`
      );
      const data = await res.json();
      // Filter out the brand with id
      return data;
    },
  });

  useEffect(() => {
    setFormData({
      title: quotation_memo[0]?.subject,
      description: quotation_memo[0]?.description,
      modified_by: created_by
    });
  }, [quotation_memo, created_by ]);


  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  // input field handleSubmit
  const handleChange = (event) => {
    const { name, value } = event.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const user_create = async (e) => {
    e.preventDefault();

   console.log(formData)

    // ${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/quotation/quotation_memo_create
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/quotation/quotation_memo_create`,
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
          router.push("/Admin/quotation/quotation_all");
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
                  Create quoatation Memo
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                  <Link
                    href="/Admin/quoatation/quoatation_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to quoatation List
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
                    Subject:
                      <small>
                        <sup>
                          <small>
                            <i className="text-danger fas fa-star"></i>
                          </small>
                        </sup>
                      </small>
                    </label>
                    <div className="col-md-6">
                    <textarea value={formData.title}
                        onChange={handleChange}
                        maxLength={255}
                        className="form-control form-control-sm "
                        id="title"
                        placeholder="Enter Title"
                        type="text"
                        name="title" class="form-control form-control-sm" rows="2" />
                    
                      {title && <div className="text-danger">{title}</div>}
                      {errorMessage && (
                        <div className="text-danger">{errorMessage}</div>
                      )}
                    </div>
                  </div>

             
              

                  <div className="form-group row">
                    <label className="col-form-label font-weight-bold col-md-3">
                    
                      Short Note:
                      <small>
                        <sup>
                          <small>
                            <i className="text-danger fas fa-star"></i>
                          </small>
                        </sup>
                      </small>
                    </label>

                    <div className="col-md-6">
                    <textarea value={formData.description}
                        onChange={handleChange}
                        maxLength={255}
                        className="form-control form-control-sm "
                        id="description"
                        placeholder="Enter description"
                        type="text"
                        name="description" class="form-control form-control-sm" rows="4" />
                      {/* <FroalaEditorComponent
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
                      /> */}

                      {description && (
                        <div className="text-danger">{description}</div>
                      )}
                    </div>
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

export default MemosQuotation;