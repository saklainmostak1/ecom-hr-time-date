import EditLeaveCategory from "@/app/(view)/admin/leave_category/leave_category_edit/page";
import React from "react";

const EditleaveCategory = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);
  return (
    <div>
      <EditLeaveCategory id={id}></EditLeaveCategory>
    </div>
  );
};

export default EditleaveCategory;
