import NoticeCategoryList from "@/app/(view)/admin/notice_category/notice_category_list/page";
import React from "react";

const NoticeCategoryAll = ({ searchParams }) => {
  return (
    <div>
      <NoticeCategoryList searchParams={searchParams}></NoticeCategoryList>
    </div>
  );
};

export default NoticeCategoryAll;
