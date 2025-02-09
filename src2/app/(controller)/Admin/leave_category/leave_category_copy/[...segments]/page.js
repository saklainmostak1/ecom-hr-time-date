import CopyleaveCategory from "@/app/(view)/admin/leave_category/leave_category_copy/page";
import React from "react";

const LeaveCategoryCopy = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);

  return (
    <div>
      <CopyleaveCategory id={id}></CopyleaveCategory>
    </div>
  );
};

export default LeaveCategoryCopy;
