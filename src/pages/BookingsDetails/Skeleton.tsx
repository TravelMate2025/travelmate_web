import Navbar from "../homePage/Navbar";
import { Skeleton } from "@mui/material";
const SkeletonDetails = () => {
  return (
    <div className="">
      <Navbar />
      <div className="p-6 lg:px-8 pt-24">
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={80}
          sx={{ my: 2 }}
        />
        <Skeleton variant="text" width={150} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ my: 2 }}
        />
        <Skeleton variant="text" width={120} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={150}
          sx={{ my: 2 }}
        />
        <Skeleton variant="rounded" width="100%" height={56} sx={{ my: 4 }} />
      </div>
    </div>
  );
};

export default SkeletonDetails;
