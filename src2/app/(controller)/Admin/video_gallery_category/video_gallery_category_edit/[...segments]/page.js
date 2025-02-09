import EditVideoGalleryCategory from "@/app/(view)/admin/video_gallery_category/video_gallery_category_edit/page";

import React from "react";

const VideoGalleryEditCategory = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);
  return (
    <div>
      <EditVideoGalleryCategory id={id}></EditVideoGalleryCategory>
    </div>
  );
};

export default VideoGalleryEditCategory;
