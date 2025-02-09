import CopynewsCategory from "@/app/(view)/admin/news_category/news_category_copy/page";

import React from "react";

const NewsCategoryCopy = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);

  return (
    <div>
      <CopynewsCategory id={id}></CopynewsCategory>
    </div>
  );
};

export default NewsCategoryCopy;
