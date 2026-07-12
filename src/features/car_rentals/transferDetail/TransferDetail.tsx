import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ChevronLeft, MapPin, Users, Briefcase, CheckCircle, XCircle, Clock, Phone, Globe } from "lucide-react";
import { bookingFlowRoutes } from "../../shared/bookingFlowRoutes";
import type { CarTransferOption } from "../types/booking";
import type { CarInfo } from "../carPaymentSlice";

interface LocationState {
  car: CarTransferOption;
  departureInfo: CarInfo;
}

interface CancellationOption {
  optionId: string;
  label: string;
  amount: number;
  currency?: string;
  cancelDeadlineHoursBeforeCheckIn?: number | null;
  policyCopy?: string;
}

const currencySymbol = (code?: string) => {
  if (!code) return "₦";
  if (code === "NGN") return "₦";
  if (code === "USD") return "$";
  if (code === "GBP") return "£";
  if (code === "EUR") return "€";
  return code + " ";
};

const getRideType = (car: CarTransferOption) => car.rideType ?? car.ride_type;

const getRideTypeLabel = (rideType?: string) =>
  rideType === "shared" ? "Shared" : rideType === "private_hire" ? "Private" : null;

const getImages = (car: CarTransferOption): string[] => {
  const imgs: string[] = [];
  if (car.content?.images) {
    car.content.images.forEach((img) => {
      const src = img.secureUrl || img.url;
      if (src) imgs.push(src);
    });
  }
  return imgs.length ? imgs : [];
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export default function TransferDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | undefined;
  const car = state?.car;
  const departureInfo = state?.departureInfo;

  const options = (car?.cancellationPolicies ?? []).filter(
    (p) => p.optionId && p.amount != null
  ) as CancellationOption[];

  const defaultOption =
    options.find((o) => o.optionId === "FREE_CANCELLATION") ?? options[0];

  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    defaultOption?.optionId ?? ""
  );
  const [imageIndex, setImageIndex] = useState(0);

  if (!car || !departureInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-[#67696D]">Transfer details not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-[#023E8A] underline text-sm"
        >
          Go back
        </button>
      </div>
    );
  }

  const images = getImages(car);
  const selectedOption = options.find((o) => o.optionId === selectedOptionId);
  const displayPrice = selectedOption?.amount ?? car.base_fare ?? car.price?.totalAmount ?? 0;
  const symbol = currencySymbol(
    selectedOption?.currency ?? car.currency ?? car.price?.currencyId
  );
  const totalPassengers =
    departureInfo.passengerCounts.adults +
    departureInfo.passengerCounts.children +
    departureInfo.passengerCounts.infant;
  const rideType = getRideType(car);
  const rideTypeLabel = getRideTypeLabel(rideType);
  const duration = car.estimatedDurationMinutes ?? car.estimated_duration_minutes;
  const vehicleCount = car.vehicleCount ?? car.vehicle_count;
  const availableSeats = car.availableSeats ?? car.available_seats;
  const provider = car.provider;

  const handleBook = () => {
    navigate(bookingFlowRoutes.transferBookingReview, {
      state: {
        car,
        departureInfo,
        cancellationOptionId: selectedOptionId,
        selectedOption,
        search_id: "",
      },
    });
  };

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Image section */}
      <div className="relative w-full h-72 bg-[#0000001A]">
        {images.length > 0 ? (
          <>
            <img
              src={images[imageIndex]}
              alt={car.name ?? "Transfer"}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/carImage.png";
              }}
            />
            {images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === imageIndex ? "bg-white w-4" : "bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <img
            src="/assets/carImage.png"
            alt="Transfer"
            className="w-full h-full object-cover"
          />
        )}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow"
        >
          <ChevronLeft size={20} className="text-[#181818]" />
        </button>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-5">
        {/* Name + badges */}
        <div className="flex flex-wrap items-start gap-2 mb-2">
          <h1 className="text-[#181818] text-xl font-bold leading-tight flex-1 min-w-0">
            {car.name ?? car.vehicle?.name ?? "Transfer"}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {rideTypeLabel && (
            <span className="text-xs bg-[#023E8A] text-white px-2.5 py-1 rounded-full font-medium">
              {rideTypeLabel}
            </span>
          )}
          {car.vehicle?.code && (
            <span className="text-xs bg-[#F0F4FF] text-[#023E8A] px-2.5 py-1 rounded-full capitalize">
              {car.vehicle.code.replace(/_/g, " ")}
            </span>
          )}
          {car.transferType && (
            <span className="text-xs bg-[#F0F4FF] text-[#023E8A] px-2.5 py-1 rounded-full capitalize">
              {car.transferType.replace(/_/g, " ")}
            </span>
          )}
        </div>

        {/* Description */}
        {car.description && (
          <p className="text-sm text-[#67696D] leading-relaxed mb-4">
            {car.description}
          </p>
        )}

        <hr className="border-gray-100 mb-4" />

        {/* Route + schedule */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-[#023E8A] mt-0.5 flex-shrink-0" />
            <div className="text-sm text-[#181818]">
              <span className="font-medium">
                {car.pickupInformation?.from?.description ??
                  departureInfo.pickupLocaDescription ??
                  departureInfo.pickupLocation}
              </span>
              <span className="text-[#67696D]"> → </span>
              <span className="font-medium">
                {car.pickupInformation?.to?.description ??
                  departureInfo.dropoffLocaDescription ??
                  departureInfo.dropoffLocation}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-[#67696D] flex-wrap">
            <span>
              📅{" "}
              <span className="text-[#181818] font-medium">
                {formatDate(departureInfo.pickupDate)}
              </span>
            </span>
            <span>
              🕐{" "}
              <span className="text-[#181818] font-medium">
                {departureInfo.pickupTime}
              </span>
            </span>
            {duration != null && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                <span className="text-[#181818] font-medium">~{duration} min</span>
              </span>
            )}
          </div>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-5 mb-4 text-sm text-[#67696D] flex-wrap">
          <div className="flex items-center gap-1.5">
            <Users size={16} />
            <span>
              {car.passenger_capacity ?? car.maxPaxCapacity ?? totalPassengers} Seats
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase size={16} />
            <span>{car.luggage_capacity ?? "—"} Luggage</span>
          </div>
          {vehicleCount != null && vehicleCount > 1 && (
            <div className="flex items-center gap-1.5">
              <span>{vehicleCount} vehicles</span>
            </div>
          )}
          {rideType === "shared" && availableSeats != null && (
            <div className="flex items-center gap-1.5 text-[#FF6F1E] font-medium">
              <span>{availableSeats} seats left</span>
            </div>
          )}
        </div>

        {/* Provider */}
        {provider && (provider.name || provider.displayName) && (
          <div className="bg-[#F8FAFE] border border-[#E5EDF5] rounded-xl p-4 mb-4 text-sm">
            <p className="text-[#181818] font-semibold mb-2">
              Operated by {provider.name ?? provider.displayName}
            </p>
            <div className="flex flex-col gap-1.5 text-[#67696D]">
              {provider.contactPhone && (
                <div className="flex items-center gap-1.5">
                  <Phone size={14} />
                  <span>{provider.contactPhone}</span>
                </div>
              )}
              {provider.websiteUrl && (
                <div className="flex items-center gap-1.5">
                  <Globe size={14} />
                  <a
                    href={provider.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#023E8A] underline"
                  >
                    {provider.websiteUrl}
                  </a>
                </div>
              )}
              {provider.arrivalInstructions && (
                <p className="mt-1">{provider.arrivalInstructions}</p>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        {car.features && car.features.length > 0 && (
          <>
            <hr className="border-gray-100 mb-4" />
            <p className="text-sm font-semibold text-[#181818] mb-2">
              What's included
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {car.features.map((f, i) => (
                <span
                  key={i}
                  className="text-xs bg-[#F0F4FF] text-[#023E8A] px-2.5 py-1 rounded-full"
                >
                  {f}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Cancellation options */}
        {options.length > 0 && (
          <>
            <hr className="border-gray-100 mb-4" />
            <p className="text-sm font-semibold text-[#181818] mb-3">
              Select cancellation policy
            </p>
            <div className="flex flex-col gap-3">
              {options.map((opt) => {
                const isSelected = opt.optionId === selectedOptionId;
                const isFree = opt.optionId === "FREE_CANCELLATION";
                return (
                  <button
                    key={opt.optionId}
                    onClick={() => setSelectedOptionId(opt.optionId)}
                    className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                      isSelected
                        ? "border-[#023E8A] bg-[#EEF3FF]"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        {isFree ? (
                          <CheckCircle
                            size={18}
                            className="text-[#2D9C5E] mt-0.5 flex-shrink-0"
                          />
                        ) : (
                          <XCircle
                            size={18}
                            className="text-[#67696D] mt-0.5 flex-shrink-0"
                          />
                        )}
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              isSelected ? "text-[#023E8A]" : "text-[#181818]"
                            }`}
                          >
                            {opt.label ?? (isFree ? "Free cancellation" : "Non-refundable")}
                          </p>
                          {opt.policyCopy && (
                            <p className="text-xs text-[#67696D] mt-0.5 leading-relaxed">
                              {opt.policyCopy}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p
                          className={`text-base font-bold ${
                            isSelected ? "text-[#023E8A]" : "text-[#181818]"
                          }`}
                        >
                          {symbol}
                          {opt.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#67696D]">Total</p>
            <p className="text-xl font-bold text-[#181818]">
              {symbol}
              {displayPrice.toLocaleString()}
            </p>
            {selectedOption && (
              <p className="text-xs text-[#67696D]">{selectedOption.label}</p>
            )}
          </div>
          <button
            onClick={handleBook}
            className="bg-[#023E8A] text-white text-sm font-semibold rounded-xl px-8 py-3"
          >
            {`Book for ${symbol}${displayPrice.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
}
