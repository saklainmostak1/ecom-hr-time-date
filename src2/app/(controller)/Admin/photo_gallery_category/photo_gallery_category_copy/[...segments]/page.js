import CopyPhotoGalleryCategory from "@/app/(view)/admin/events_category/events_category_copy/page";

import React from "react";

const PhotoGalleryCategoryCopy = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);

  return (
    <div>
      <CopyPhotoGalleryCategory id={id}></CopyPhotoGalleryCategory>
    </div>
  );
};

export default PhotoGalleryCategoryCopy;
