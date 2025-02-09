import EditPhotoGalleryCategory from "@/app/(view)/admin/events_category/events_category_edit/page";

import React from "react";

const PhotoGalleryEditCategory = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);
  return (
    <div>
      <EditPhotoGalleryCategory id={id}></EditPhotoGalleryCategory>
    </div>
  );
};

export default PhotoGalleryEditCategory;
