import EditDesignation from "@/app/(view)/admin/designation/designation_edit/page";
import React from "react";

const DesignationEdit = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);
  return (
    <div>
      <EditDesignation id={id}></EditDesignation>
    </div>
  );
};

export default DesignationEdit;
