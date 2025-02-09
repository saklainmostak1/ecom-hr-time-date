import EducationList from "@/app/(view)/admin/education/education_all/page";

import React from "react";

const AllEducation = ({ searchParams }) => {
  return (
    <div>
      <EducationList searchParams={searchParams}></EducationList>
    </div>
  );
};

export default AllEducation;

// import BloodGroupList from "@/app/(view)/admin/blood_group/blood_group_all/page";

// import React from "react";

// const AllBloodGroup = ({ searchParams }) => {
//   return (
//     <div>
//       <BloodGroupList searchParams={searchParams}></BloodGroupList>
//     </div>
//   );
// };

// export default AllBloodGroup;
