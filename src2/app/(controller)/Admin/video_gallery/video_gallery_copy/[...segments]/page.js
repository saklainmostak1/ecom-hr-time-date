import CopynewsCategory from "@/app/(view)/admin/news_category/news_category_copy/page";
import CopyVideoGallery from "@/app/(view)/admin/video_gallery/video_gallery_copy/page";

import React from "react";

const VideoGalleryCopy = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);

  return (
    <div>
      <CopyVideoGallery id={id}></CopyVideoGallery>
    </div>
  );
};

export default VideoGalleryCopy;
