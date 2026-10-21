import { lazy, Suspense } from "react";

const CarBookingFirstScreen = lazy(() => import("./Page"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
  </div>
);

const CarBookingFirstScreenWrapper = () => (
  <Suspense fallback={<LoadingFallback />}>
    <CarBookingFirstScreen />
  </Suspense>
);

export default CarBookingFirstScreenWrapper;
