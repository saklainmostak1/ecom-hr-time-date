import NoticeList from "@/app/(view)/admin/notice/notice_list/page";

import React from "react";

const NoticeAll = ({ searchParams }) => {
  return (
    <div>
      <NoticeList searchParams={searchParams}></NoticeList>
    </div>
  );
};

export default NoticeAll;
