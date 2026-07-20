// Compact header band shared by every info/legal page -- deliberately not
// a big photo hero like HomeHero.tsx (these are utility pages, not
// marketing pages). Same navy gradient tones as HomeHero for brand
// consistency, plus a subtle orange glow sampled from the real logo.
// Matches the approved design mock (accepted 2026-07-20).
export function InfoPageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className="relative overflow-hidden px-6 lg:px-10 pt-16 pb-14 lg:pt-20 lg:pb-16"
      style={{
        background:
          "radial-gradient(520px 260px at 88% -20%, rgba(253,115,38,0.22) 0%, rgba(253,115,38,0) 70%)," +
          "linear-gradient(120deg, #011A3C 0%, #022A5E 46%, #023E8A 100%)",
      }}
    >
      <div className="max-w-[720px] mx-auto lg:mx-0 lg:max-w-[1240px] relative">
        <span className="inline-block text-[12px] font-bold tracking-[1.2px] uppercase text-[#FDAE83] mb-3">
          {eyebrow}
        </span>
        <h1 className="text-[32px] lg:text-[40px] font-extrabold tracking-[-0.6px] text-white leading-[1.1] text-wrap-balance mb-3">
          {title}
        </h1>
        <p className="text-[15px] lg:text-[16px] leading-relaxed text-[#CBD8EE] max-w-[62ch]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
