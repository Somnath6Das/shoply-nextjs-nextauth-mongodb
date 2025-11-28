"use client";
import { Range, getTrackBackground } from "react-range";

interface PriceFilterProps {
  minPriceSlider: number | null | undefined;
  maxPriceSlider: number | null | undefined;
  setMinPriceSlider: React.Dispatch<React.SetStateAction<number>>;
  setMaxPriceSlider: React.Dispatch<React.SetStateAction<number>>;
  absoluteMin: number;
  absoluteMax: number;
  applyFilters: () => void;
}

export default function PriceFilter({
  minPriceSlider,
  maxPriceSlider,
  setMinPriceSlider,
  setMaxPriceSlider,
  absoluteMin,
  absoluteMax,
  applyFilters,
}: PriceFilterProps) {
  // Provide guaranteed numeric fallbacks
  const safeMin = Number(minPriceSlider ?? absoluteMin ?? 0);
  const safeMax = Number(maxPriceSlider ?? absoluteMax ?? 0);

  // Format safely → these CANNOT crash
  const formattedMin = safeMin.toLocaleString("en-IN");
  const formattedMax = safeMax.toLocaleString("en-IN");

  const values = [safeMin, safeMax];

  // Guard when backend price range is invalid
  if (absoluteMax <= absoluteMin) {
    return (
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Price</h3>
        <p className="text-sm text-gray-500">No price range available</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-4">Price</h3>

      <div className="space-y-4">
        {/* SAFE — cannot crash */}
        <div className="text-sm font-medium">
          ₹{formattedMin} – ₹{formattedMax}+
        </div>

        <div className="flex items-center gap-3">
          <Range
            values={values}
            step={100}
            min={absoluteMin}
            max={absoluteMax}
            onChange={(values) => {
              setMinPriceSlider(values[0]);
              setMaxPriceSlider(values[1]);
            }}
            renderTrack={({ props, children }) => (
              <div
                ref={props.ref}
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                className="w-full h-2 rounded-full"
                style={{
                  background: getTrackBackground({
                    values,
                    colors: ["#E5E7EB", "#2563EB", "#E5E7EB"],
                    min: absoluteMin,
                    max: absoluteMax,
                  }),
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ index, props }) => {
              const { key, ...rest } = props;
              return (
                <div
                  key={index}
                  {...rest}
                  className="h-5 w-5 rounded-full bg-blue-600 shadow-md border-2 border-white focus:outline-none"
                />
              );
            }}
          />

          <button
            onClick={applyFilters}
            className="border border-gray-300 rounded-md px-4 py-1 text-sm hover:bg-gray-50"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}
