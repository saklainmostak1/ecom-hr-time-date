import CopynoticeCategory from "@/app/(view)/admin/notice_category/notice_category_copy/page";
import React from "react";

const NoticeCategoryCopy = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);

  return (
    <div>
      <CopynoticeCategory id={id}></CopynoticeCategory>
    </div>
  );
};

export default NoticeCategoryCopy;
