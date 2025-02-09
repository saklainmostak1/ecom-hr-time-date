import DesignationList from "@/app/(view)/admin/designation/designation_all/page";
import React from "react";

const AllDesignation = ({ searchParams }) => {
  return (
    <div>
      <DesignationList searchParams={searchParams}></DesignationList>
    </div>
  );
};

export default AllDesignation;
