import CopyVideoGalleryCategory from "@/app/(view)/admin/video_gallery_category/video_gallery_category_copy/page";

import React from "react";

const VideoGalleryCategoryCopy = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);

  return (
    <div>
      <CopyVideoGalleryCategory id={id}></CopyVideoGalleryCategory>
    </div>
  );
};

export default VideoGalleryCategoryCopy;
