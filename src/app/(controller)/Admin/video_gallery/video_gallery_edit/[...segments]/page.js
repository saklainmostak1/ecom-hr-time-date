import EditVideoGallery from "@/app/(view)/admin/video_gallery/video_gallery_edit/page";

import React from "react";

const VideoEdit = ({ params }) => {
  const [id] = params.segments || [];
  console.log(id);
  return (
    <div>
      <EditVideoGallery id={id}></EditVideoGallery>
    </div>
  );
};

export default VideoEdit;
