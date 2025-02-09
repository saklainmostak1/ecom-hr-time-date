import EditEducation from "@/app/(view)/admin/education/education_edit/page";

import React from "react";

const EducationEdit = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);
  return (
    <div>
      <EditEducation id={id}></EditEducation>
    </div>
  );
};

export default EducationEdit;
