import { Divider } from "@mui/material";
import { ChevronRight, CheckCircle, XCircle, Dot } from "lucide-react";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import carImage from "../../../../assets/carImage.png";
import type { CarTransferOption } from "../../types/booking";

type CancellationOption = {
  optionId: string;
  label?: string;
  amount: number;
  currency?: string;
  cancelDeadlineHoursBeforeCheckIn?: number | null;
  policyCopy?: string;
};

type props = {
  car: CarTransferOption;
  departureInfo: {
    pickupLocaDescription: string;
    pickupDate: string;
    pickupTime: string;
    dropoffLocation: string;
    dropoffLocaDescription?: string;
  };
  setShowAllModal: (data: boolean) => void;
};

const getCurrencySymbol = (code?: string) => {
  if (code === "NGN") return "₦";
  if (code === "USD") return "$";
  if (code === "GBP") return "£";
  if (code === "EUR") return "€";
  return code ? `${code} ` : "₦";
};

const FirstStep = ({ car, departureInfo, setShowAllModal }: props) => {
  const location = useLocation();
  const selectedOption = location.state?.selectedOption as CancellationOption | undefined;

  const content = car.content ?? {};
  const transferDetails = content.transferDetailInfo ?? [];

  const isFree = selectedOption?.optionId === "FREE_CANCELLATION";
  const symbol = getCurrencySymbol(
    selectedOption?.currency ?? car.currency ?? car.price?.currencyId
  );
  const displayPrice = selectedOption?.amount ?? car.price?.totalAmount ?? car.base_fare ?? 0;

  const addDurationToTime = (pickupTime: string, durationStr: string) => {
    const [h, m] = pickupTime.split(":").map(Number);
    let totalMin = h * 60 + m;
    const hourMatch = durationStr?.match(/(\d+)\s*hour(s)?/i);
    const minMatch = durationStr?.match(/(\d+)\s*min/i);
    if (hourMatch) totalMin += parseInt(hourMatch[1]) * 60;
    if (minMatch) totalMin += parseInt(minMatch[1]);
    if (!hourMatch && !minMatch && !isNaN(Number(durationStr))) {
      totalMin += Number(durationStr);
    }
    const newH = Math.floor(totalMin / 60) % 24;
    const newM = totalMin % 60;
    return `${newH.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")}`;
  };

  const dropoff =
    departureInfo.dropoffLocaDescription || departureInfo.dropoffLocation;

  return (
    <div>
      {/* Vehicle */}
      <div className="flex items-center gap-4 p-6">
        <img
          src={car?.content?.images?.[0]?.secureUrl || car?.content?.images?.[0]?.url || carImage}
          alt=""
          className="w-28 h-28 p-2 object-contain bg-[#0000001A] rounded-lg"
          onError={(e) => { (e.target as HTMLImageElement).src = carImage; }}
        />
        <div>
          <p className="text-[#181818] text-[15px] font-semibold">
            {car?.name ?? car?.vehicle?.name}
          </p>
          <p className="text-[#67696D] text-[13px] mt-0.5">
            {car?.vehicle?.code?.replace(/_/g, " ")}
            {car?.transferType ? ` · ${car.transferType.replace(/_/g, " ")}` : ""}
          </p>
        </div>
      </div>

      <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />

      {/* Transfer details */}
      <div className="mx-6 my-4">
        <p className="text-[16px] font-medium text-[#181818] mb-3">
          Transfer details
        </p>
        <div className="lg:border rounded-lg lg:p-5 flex flex-col gap-4 border-[#CDCED1]">
          <div className="flex gap-4 items-center">
            <div className="size-5 bg-[#023E8A] rounded-full flex-shrink-0" />
            <div>
              <p className="text-[#181818] text-sm font-medium">
                {departureInfo.pickupLocaDescription}
              </p>
              <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                <FaRegCalendarAlt />
                <p>{departureInfo.pickupDate}</p>
                <Dot fill="#4E4F52" size={12} />
                <FaRegClock />
                <p>{departureInfo.pickupTime}</p>
              </div>
            </div>
          </div>

          {transferDetails[0]?.value && (
            <div className="flex gap-5 items-center ml-2">
              <div className="border-l-2 border-l-[#4E4F52] h-12" />
              <p className="text-[#4E4F52] text-sm">
                {transferDetails[0].value} {transferDetails[0].description}
              </p>
            </div>
          )}

          <div className="flex gap-4 items-center">
            <div className="size-5 bg-[#D72638] rounded-full flex-shrink-0" />
            <div>
              <p className="text-[#181818] text-sm font-medium">{dropoff}</p>
              <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                <FaRegCalendarAlt />
                <p>{departureInfo.pickupDate}</p>
                <Dot fill="#4E4F52" size={12} />
                <FaRegClock />
                <p>
                  {addDurationToTime(
                    departureInfo.pickupTime,
                    String(transferDetails[0]?.value ?? "")
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />

      {/* Vehicle details */}
      <div className="lg:px-6 px-3">
        <p className="text-[16px] font-medium text-[#181818] pl-3 lg:pl-0 mb-3">
          Vehicle details
        </p>
        <div className="flex flex-col gap-2 lg:border rounded-lg p-5 border-[#CDCED1]">
          {car?.category?.name && (
            <div className="flex justify-between items-center w-full">
              <p className="text-sm text-[#4E4F52]">Type</p>
              <p className="text-[#181818] text-sm">{car.category.name}</p>
            </div>
          )}
          {(car?.maxPaxCapacity || car?.passenger_capacity) && (
            <div className="flex justify-between w-full items-center">
              <p className="text-sm text-[#4E4F52]">Seats</p>
              <p className="text-sm text-[#181818]">
                {car?.passenger_capacity ?? car?.maxPaxCapacity} Seats
              </p>
            </div>
          )}
          {car?.luggage_capacity && (
            <div className="flex justify-between items-center w-full">
              <p className="text-sm text-[#4E4F52]">Luggage</p>
              <p className="text-[#181818] text-sm">{car.luggage_capacity}</p>
            </div>
          )}
          {car?.supplier && (
            <div className="flex justify-between items-center w-full">
              <p className="text-sm text-[#4E4F52]">Provider</p>
              <p className="text-[#181818] text-sm">
                {typeof car.supplier === "string"
                  ? car.supplier
                  : (car.supplier as { name?: string })?.name}
              </p>
            </div>
          )}
        </div>
      </div>

      <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />

      {/* Price summary */}
      <div className="lg:px-6 px-3">
        <p className="text-[16px] font-medium text-[#181818] pt-4 pl-3 lg:pl-0 mb-3">
          Price summary
        </p>
        <div className="flex justify-between w-full items-center lg:border rounded-lg p-5 border-[#CDCED1]">
          <p className="text-sm text-[#4E4F52]">Total</p>
          <p className="text-[#181818] text-[15px] font-bold">
            {symbol}{displayPrice.toLocaleString()}
          </p>
        </div>
      </div>

      <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />

      {/* Transfer information */}
      <div className="lg:px-6 px-3">
        <div className="flex w-full justify-between items-center p-4 pl-3 lg:pl-0">
          <p className="text-[16px] font-bold text-[#181818]">
            Transfer information
          </p>
          <div
            className="flex gap-1 items-center text-[#023E8A] cursor-pointer"
            onClick={() => setShowAllModal(true)}
          >
            <p>View all</p>
            <ChevronRight size={16} />
          </div>
        </div>
        <div className="lg:border rounded-lg lg:p-5 p-3 border-[#CDCED1]">
          <ul className="list-disc pl-4 flex flex-col gap-2 text-sm text-[#4E4F52]">
            <li>Your driver will wait up to 60 minutes after your taxi arrives.</li>
            <li>You'll get pickup instructions in your confirmation email.</li>
          </ul>
        </div>
      </div>

      <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />

      {/* Cancellation policy — selected option */}
      <div className="lg:px-6 px-3 pb-4">
        <p className="text-[16px] font-bold text-[#181818] p-3 lg:pl-0">
          Cancellation policy
        </p>
        {selectedOption ? (
          <div className="lg:border rounded-xl border p-4 border-[#023E8A] bg-[#EEF3FF]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                {isFree ? (
                  <CheckCircle size={18} className="text-[#2D9C5E] mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle size={18} className="text-[#67696D] mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-semibold text-[#023E8A]">
                    {selectedOption.label ??
                      (isFree ? "Free cancellation" : "Partial cancellation")}
                  </p>
                  {selectedOption.policyCopy && (
                    <p className="text-xs text-[#67696D] mt-1 leading-relaxed">
                      {selectedOption.policyCopy}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-sm font-bold text-[#023E8A] flex-shrink-0">
                {symbol}{selectedOption.amount.toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="lg:border rounded-lg lg:p-5 p-3 border-[#CDCED1]">
            <ul className="list-disc pl-4 flex flex-col gap-2 text-sm text-[#4E4F52]">
              <li>Please review the cancellation terms before confirming.</li>
            </ul>
          </div>
        )}
      </div>

      <Divider sx={{ marginTop: "20px", marginBottom: "20px" }} />
    </div>
  );
};

export default FirstStep;
