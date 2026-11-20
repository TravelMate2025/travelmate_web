import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../../store";
import { flightStepPath } from "../../shared/bookingFlowRoutes";
import { selectFlightOffer } from "../slice";
import type { FlightOffer } from "../types";

/** "See fares" / "Select": remember the offer and go to the Fare step. */
export const useSelectOffer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  return useCallback(
    (offer: FlightOffer) => {
      dispatch(selectFlightOffer(offer.offerToken));
      navigate(flightStepPath("flightFare", offer.offerToken));
    },
    [dispatch, navigate]
  );
};
