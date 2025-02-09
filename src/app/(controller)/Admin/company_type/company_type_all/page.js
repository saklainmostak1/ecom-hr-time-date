import CompanyTypeList from "@/app/(view)/admin/company_type/company_type_all/page";

import React from "react";

const AllCompanyType = ({ searchParams }) => {
  return (
    <div>
      <CompanyTypeList searchParams={searchParams}></CompanyTypeList>
    </div>
  );
};

export default AllCompanyType;
