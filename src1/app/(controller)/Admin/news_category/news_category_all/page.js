import NewsCategoryList from "@/app/(view)/admin/news_category/news_category_list/page";

import React from "react";

const NewsCategoryAll = ({ searchParams }) => {
  return (
    <div>
      <NewsCategoryList searchParams={searchParams}></NewsCategoryList>
    </div>
  );
};

export default NewsCategoryAll;
