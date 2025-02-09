import VideoGalleryCategoryList from "@/app/(view)/admin/video_gallery_category/video_gallery_category_list/page";

import React from "react";

const VideoGalleryCategoryAll = ({ searchParams }) => {
  return (
    <div>
      <VideoGalleryCategoryList
        searchParams={searchParams}
      ></VideoGalleryCategoryList>
    </div>
  );
};

export default VideoGalleryCategoryAll;
