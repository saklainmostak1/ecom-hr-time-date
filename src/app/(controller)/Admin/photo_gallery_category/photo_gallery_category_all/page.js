import PhotoGelleryCategoryList from "@/app/(view)/admin/events_category/events_category_list/page";

import React from "react";

const PhotoGalleryCategoryAll = ({ searchParams }) => {
  return (
    <div>
      <PhotoGelleryCategoryList
        searchParams={searchParams}
      ></PhotoGelleryCategoryList>
    </div>
  );
};

export default PhotoGalleryCategoryAll;
