import EditnewsCategory from "@/app/(view)/admin/news_category/news_category_edit/page";

import React from "react";

const NewsEditCategory = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);
  return (
    <div>
      <EditnewsCategory id={id}></EditnewsCategory>
    </div>
  );
};

export default NewsEditCategory;
