import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";

// Mock (Pay): full-width orange bar under the header with the time left to pay.
const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export const HoldTimerBar = ({ secondsLeft }: { secondsLeft: number }) => (
  <div role="timer" aria-label="Time left to pay" className="border-0 border-b border-b-[#FFD2B8] bg-[#FFF1E8]">
    <div className="mx-auto flex max-w-[77.5rem] flex-wrap items-center gap-x-5 gap-y-2.5 px-6 py-3">
      <TimerOutlinedIcon aria-hidden className="text-[#9A3412]" />
      <strong className="text-[#7C2D12]">
        Your seats are held. Pay within <span className="tabular-nums">{clock(secondsLeft)}</span> to keep this price.
      </strong>
      <span className="text-sm text-[#7C2D12]">After that the reservation is released and the price may change.</span>
    </div>
  </div>
);
