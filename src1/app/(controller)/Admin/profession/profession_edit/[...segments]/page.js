import EditProfession from "@/app/(view)/admin/profession/profession_edit/page";

import React from "react";

const ProfessionEdit = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);
  return (
    <div>
      <EditProfession id={id}></EditProfession>
    </div>
  );
};

export default ProfessionEdit;
