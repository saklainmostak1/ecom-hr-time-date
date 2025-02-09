import EditBloodGroup from "@/app/(view)/admin/blood_group/blood_group_edit/page";

import React from "react";

const BloodGroupEdit = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);
  return (
    <div>
      <EditBloodGroup id={id}></EditBloodGroup>
    </div>
  );
};

export default BloodGroupEdit;
