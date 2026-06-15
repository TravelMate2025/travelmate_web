import { Button, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { bookingFlowRoutes, legacyBookingFlowRoutes } from "../bookingFlowRoutes";
import {
  staySearchLabel,
  stayDetailsLabel,
  bookingReviewLabel,
} from "./bookingFlowLabels";

type PartnerFlowPreviewProps = {
  legacyLabel?: string;
};

const PartnerFlowPreview = ({ legacyLabel = "Legacy flow" }: PartnerFlowPreviewProps) => {
  const navigate = useNavigate();

  return (
    <div className="mx-4 sm:mx-10 my-5 rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">New partner-aligned stay flow</h2>
            <Chip size="small" label="unit_level / room_level" color="primary" variant="outlined" />
          </div>
          <p className="mt-2 text-sm text-gray-700">
            This path uses the updated stay search, detail, pricing, and booking labels.
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {staySearchLabel()} → {stayDetailsLabel()} → {bookingReviewLabel()}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:min-w-[220px]">
          <Button
            variant="contained"
            onClick={() => navigate(`${bookingFlowRoutes.staySearch}?flow=partner`)}
            sx={{ textTransform: "none" }}
          >
            Open new stay flow
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(legacyBookingFlowRoutes.staySearch)}
            sx={{ textTransform: "none" }}
          >
            {legacyLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PartnerFlowPreview;
