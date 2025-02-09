import NewsList from "@/app/(view)/admin/news/news_list/page";

import React from "react";

const ListNews = ({ searchParams }) => {
  return (
    <div>
      <NewsList searchParams={searchParams}></NewsList>
    </div>
  );
};

export default ListNews;
