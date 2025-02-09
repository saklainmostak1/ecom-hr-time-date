import EditReligion from "@/app/(view)/admin/religion/religion_edit/page";

import React from "react";

const ReligionEdit = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);
  return (
    <div>
      <EditReligion id={id}></EditReligion>
    </div>
  );
};

export default ReligionEdit;
