"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";



const QuotationSetups = () => {

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
    description: "",
    created_by: created_by,
    modified_by: created_by

  });
 


  const {
    data: quotation_memo = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["quotation_memo"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/quotation/quotation_setup_single/1`
      );
      const data = await res.json();
      // Filter out the brand with id
      return data;
    },
  });

  useEffect(() => {
    setFormData({
      description: quotation_memo[0]?.description,
      modified_by: created_by,
      created_by: created_by,
    });
  }, [quotation_memo, created_by ]);




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
      `${process.env.NEXT_PUBLIC_API_URL}:5002/Admin/quotation/quotation_setup_create`,
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
                  Create Quoatation Setup
                </h5>
                <div className="card-title card-header-period font-weight-bold mb-0 float-right">
                  <Link
                    href="/Admin/quoatation/quoatation_all"
                    className="btn btn-sm btn-info"
                  >
                    Back to Quoatation List
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

export default QuotationSetups;