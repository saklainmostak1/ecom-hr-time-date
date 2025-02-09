import EditCompanyType from "@/app/(view)/admin/company_type/company_type_edit/page";

import React from "react";

const CompanyTypeEdit = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);
  return (
    <div>
      <EditCompanyType id={id}></EditCompanyType>
    </div>
  );
};

export default CompanyTypeEdit;
