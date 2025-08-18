import { DollarSign, Info } from "lucide-react";
import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface BudgetRange {
  min: number;
  max: number;
  label: string;
  description: string;
  color: string;
}

interface BudgetSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  value?: number;
  onChange: (value: number) => void;
  ranges: BudgetRange[];
  label?: string;
  description?: string;
  className?: string;
  showRecommendations?: boolean;
}

export const BudgetSlider = ({
  min = 0,
  max = 100000,
  step = 1000,
  defaultValue = 0,
  value: controlledValue,
  onChange,
  ranges,
  label = "Project Budget",
  description = "Drag the slider or enter an amount directly",
  className,
  showRecommendations = true,
}: BudgetSliderProps) => {
  const [internalValue, setInternalValue] = useState(controlledValue ?? defaultValue);
  const [inputValue, setInputValue] = useState(String(controlledValue ?? defaultValue));
  const [isFocused, setIsFocused] = useState(false);

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue ?? internalValue;

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
      setInputValue(String(controlledValue));
    }
  }, [controlledValue]);

  const getCurrentRange = (val: number): BudgetRange | undefined => {
    return ranges.find(range => val >= range.min && val <= range.max);
  };

  const currentRange = getCurrentRange(value);

  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    setInternalValue(newValue);
    setInputValue(String(newValue));
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputStr = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(inputStr);
    
    const numValue = parseInt(inputStr) || 0;
    if (numValue >= min && numValue <= max) {
      setInternalValue(numValue);
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    const numValue = parseInt(inputValue) || 0;
    const clampedValue = Math.max(min, Math.min(max, numValue));
    setInternalValue(clampedValue);
    setInputValue(String(clampedValue));
    onChange(clampedValue);
  };

  const formatCurrency = (amount: number): string => {
    if (amount === 0) return "$0";
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  // Calculate slider position percentage
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("space-y-6", className)}>
      {(label || description) && (
        <div>
          {label && (
            <Label className="text-white text-base font-medium mb-2 block">
              {label}
            </Label>
          )}
          {description && (
            <p className="text-sm text-gray-400 mb-4">{description}</p>
          )}
        </div>
      )}

      {/* Current Selection Display */}
      <div
        className={cn(
          "p-4 rounded-lg border transition-all duration-300",
          currentRange
            ? `bg-gradient-to-r ${currentRange.color} bg-opacity-10 border-opacity-50`
            : "bg-gray-800/50 border-gray-700"
        )}
        style={{
          borderColor: currentRange
            ? `rgba(${currentRange.color.includes("orange") ? "251, 146, 60" : 
                     currentRange.color.includes("blue") ? "59, 130, 246" : 
                     currentRange.color.includes("green") ? "34, 197, 94" : 
                     "156, 163, 175"}, 0.5)`
            : undefined
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-white" />
            <span className="text-lg font-semibold text-white">
              {currentRange ? currentRange.label : "Select your budget"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Amount:</span>
            <Input
              type="text"
              value={isFocused ? inputValue : formatCurrency(value)}
              onChange={handleInputChange}
              onFocus={() => {
                setIsFocused(true);
                setInputValue(String(value));
              }}
              onBlur={handleInputBlur}
              className="w-32 bg-gray-900/50 border-gray-600 text-white text-right font-mono"
              placeholder="0"
            />
          </div>
        </div>
        {currentRange && (
          <p className="text-sm text-gray-300">{currentRange.description}</p>
        )}
      </div>

      {/* Slider */}
      <div className="relative py-4">
        {/* Range indicators */}
        <div className="absolute left-0 right-0 top-8 h-2 flex">
          {ranges.map((range, index) => (
            <div
              key={index}
              className={cn(
                "h-full transition-opacity duration-300",
                `bg-gradient-to-r ${range.color}`
              )}
              style={{
                left: `${((range.min - min) / (max - min)) * 100}%`,
                width: `${((range.max - range.min) / (max - min)) * 100}%`,
                opacity: currentRange === range ? 0.3 : 0.1,
              }}
            />
          ))}
        </div>

        <Slider
          value={[value]}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          className="relative z-10"
        />

        {/* Value indicator */}
        <div
          className="absolute -top-6 transform -translate-x-1/2 pointer-events-none"
          style={{ left: `${percentage}%` }}
        >
          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
            {formatCurrency(value)}
          </div>
        </div>

        {/* Range labels */}
        <div className="flex justify-between mt-6 text-xs text-gray-500">
          <span>{formatCurrency(min)}</span>
          {ranges.map((range, index) => {
            if (index === 0) return null;
            return (
              <span
                key={index}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${((range.min - min) / (max - min)) * 100}%` }}
              >
                {formatCurrency(range.min)}
              </span>
            );
          })}
          <span>{formatCurrency(max)}</span>
        </div>
      </div>

      {/* Recommendations */}
      {showRecommendations && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Info className="w-4 h-4" />
            <span>Quick select:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ranges.map((range, index) => (
              <button
                key={index}
                onClick={() => {
                  const midpoint = Math.floor((range.min + range.max) / 2);
                  setInternalValue(midpoint);
                  setInputValue(String(midpoint));
                  onChange(midpoint);
                }}
                className={cn(
                  "px-3 py-1 rounded-full text-xs transition-all",
                  currentRange === range
                    ? "bg-white/20 text-white border border-white/30"
                    : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600"
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};