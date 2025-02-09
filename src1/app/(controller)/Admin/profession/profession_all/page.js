import ProfessionList from "@/app/(view)/admin/profession/profession_all/page";

import React from "react";

const ProfessionAll = ({ searchParams }) => {
  return (
    <div>
      <ProfessionList searchParams={searchParams}></ProfessionList>
    </div>
  );
};

export default ProfessionAll;
