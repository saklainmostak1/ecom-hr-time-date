import LeaveCategoryList from "@/app/(view)/admin/leave_category/leave_category_list/page";
import React from "react";

const LeaveCategoryAll = ({searchParams}) => {
  return (
    <div>
      <LeaveCategoryList
      searchParams={searchParams}
      ></LeaveCategoryList>
    </div>
  );
};

export default LeaveCategoryAll;
