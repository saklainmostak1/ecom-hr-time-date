import EditNews from "@/app/(view)/admin/news/news_edit/page";

import React from "react";

const NewsEdit = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);
  return (
    <div>
      <EditNews id={id}></EditNews>
    </div>
  );
};

export default NewsEdit;
