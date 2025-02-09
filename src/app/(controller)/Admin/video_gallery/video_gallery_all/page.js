import VideoGalleryList from "@/app/(view)/admin/video_gallery/video_gallery_list/page";

import React from "react";

const VideoGalleryAll = ({ searchParams }) => {
  return (
    <div>
      <VideoGalleryList searchParams={searchParams}></VideoGalleryList>
    </div>
  );
};

export default VideoGalleryAll;
