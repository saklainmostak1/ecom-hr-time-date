import ReligionList from "@/app/(view)/admin/religion/religion_all/page";

import React from "react";

const ReligionAll = ({ searchParams }) => {
  return (
    <div>
      <ReligionList searchParams={searchParams}></ReligionList>
    </div>
  );
};

export default ReligionAll;
