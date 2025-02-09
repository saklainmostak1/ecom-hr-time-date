import GenderList from "@/app/(view)/admin/gender/gender_list/page";
import React from "react";

const GenderAll = ({ searchParams }) => {
  return (
    <div>
      <GenderList searchParams={searchParams}></GenderList>
    </div>
  );
};

export default GenderAll;
