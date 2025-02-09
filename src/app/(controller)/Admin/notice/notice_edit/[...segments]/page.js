import EditNotice from "@/app/(view)/admin/notice/notice_edit/page";

import React from "react";

const NoticeEdit = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);
  return (
    <div>
      <EditNotice id={id}></EditNotice>
    </div>
  );
};

export default NoticeEdit;
