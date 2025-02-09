import EditnoticeCategory from "@/app/(view)/admin/notice_category/notice_category_edit/page";
import React from "react";

const NoticeeditCategory = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);
  return (
    <div>
      <EditnoticeCategory id={id}></EditnoticeCategory>
    </div>
  );
};

export default NoticeeditCategory;
