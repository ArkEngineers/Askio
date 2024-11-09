import React from "react";

function FolderCard() {
  return (
    <div className="w-40 h-40 bg-grey-6 mx-2 rounded-xl flex flex-col overflow-hidden justify-between pb-2">
      <div className="w-full h-1/3 bg-grey-2"></div>
      <h3 className="mx-4 text-sm text-base-1">Software Engineering</h3>
      <div>
        <p className="mx-4 text-xs text-grey-1 w-full text-left">9 Nov</p>
      </div>
    </div>
  );
}

export default FolderCard;
