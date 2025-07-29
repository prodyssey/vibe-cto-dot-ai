import { Calculator, Plus, Trash2, Info } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Initiative {
  id: string;
  name: string;
  monthlyValue: number;
  currentTimeMonths: number;
}

interface CostOfDelayCalculatorProps {
  initialInitiatives?: Initiative[];
  defaultTimeReduction?: number;
  className?: string;
  showByDefault?: boolean;
}

export const CostOfDelayCalculator = ({
  initialInitiatives = [
    {
      id: "1",
      name: "New AI-First Customer Portal",
      monthlyValue: 500000,
      currentTimeMonths: 9,
    },
    {
      id: "2",
      name: "Adjacent Market Feature Set",
      monthlyValue: 300000,
      currentTimeMonths: 6,
    },
  ],
  defaultTimeReduction = 30,
  className,
  showByDefault = false,
}: CostOfDelayCalculatorProps) => {
  const [showCalculator, setShowCalculator] = useState(showByDefault);
  const [showMathBreakdown, setShowMathBreakdown] = useState(false);
  const [timeReduction, setTimeReduction] = useState(defaultTimeReduction);
  const [newInitiativeName, setNewInitiativeName] = useState("");
  const [newInitiativeValue, setNewInitiativeValue] = useState("");
  const [newInitiativeTime, setNewInitiativeTime] = useState("");
  const [initiatives, setInitiatives] =
    useState<Initiative[]>(initialInitiatives);

  const addInitiative = () => {
    if (newInitiativeName && newInitiativeValue && newInitiativeTime) {
      const newInitiative: Initiative = {
        id: Date.now().toString(),
        name: newInitiativeName,
        monthlyValue: Number(newInitiativeValue),
        currentTimeMonths: Number(newInitiativeTime),
      };
      setInitiatives([...initiatives, newInitiative]);
      // Reset form
      setNewInitiativeName("");
      setNewInitiativeValue("");
      setNewInitiativeTime("");
    }
  };

  const updateInitiative = (
    id: string,
    field: keyof Initiative,
    value: string | number
  ) => {
    setInitiatives(
      initiatives.map((init) =>
        init.id === id ? { ...init, [field]: value } : init
      )
    );
  };

  const removeInitiative = (id: string) => {
    setInitiatives(initiatives.filter((init) => init.id !== id));
  };

  const calculateCostOfDelay = () => {
    return initiatives.reduce((total, init) => {
      const timeSaved = init.currentTimeMonths * (timeReduction / 100);
      const delayCost = init.monthlyValue * timeSaved;
      return total + delayCost;
    }, 0);
  };

  const totalCostOfDelay = calculateCostOfDelay();

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 sm:p-6",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
          <Calculator className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-400" />
          <span className="hidden sm:inline">
            Cost of Delay Impact Calculator
          </span>
          <span className="sm:hidden">Impact Calculator</span>
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCalculator(!showCalculator)}
          className="text-purple-300 hover:text-purple-200"
        >
          {showCalculator ? "Hide" : "Show"} Calculator
        </Button>
      </div>

      {!showCalculator ? (
        <p className="text-gray-300">
          Calculate the financial impact of accelerating your development
          timeline with AI transformation.
        </p>
      ) : (
        <div className="space-y-4">
          {/* Time Reduction Slider */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Time Reduction with AI Transformation:{" "}
              <span className="text-purple-300 font-bold">
                {timeReduction}%
              </span>
            </label>
            <input
              type="range"
              min="10"
              max="60"
              value={timeReduction}
              onChange={(e) => setTimeReduction(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
              style={{
                background: `linear-gradient(to right, #9333ea 0%, #9333ea ${
                  ((timeReduction - 10) / 50) * 100
                }%, #374151 ${
                  ((timeReduction - 10) / 50) * 100
                }%, #374151 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%+</span>
              <span>Moderate</span>
              <span>Aggressive</span>
              <span>60%+</span>
            </div>
          </div>

          {/* Initiatives List */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300">
              Your Initiatives
            </h4>
            {initiatives.map((init) => (
              <div
                key={init.id}
                className="bg-gray-800/50 p-3 rounded-lg space-y-3"
              >
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-2 sm:items-center">
                  <Input
                    type="text"
                    placeholder="Initiative name"
                    value={init.name}
                    onChange={(e) =>
                      updateInitiative(init.id, "name", e.target.value)
                    }
                    className="sm:col-span-5 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                  />
                  <div className="sm:col-span-3">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Monthly value"
                        value={init.monthlyValue || ""}
                        onChange={(e) =>
                          updateInitiative(
                            init.id,
                            "monthlyValue",
                            Number(e.target.value)
                          )
                        }
                        className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                      />
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        $/mo
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Time"
                        value={init.currentTimeMonths || ""}
                        onChange={(e) =>
                          updateInitiative(
                            init.id,
                            "currentTimeMonths",
                            Number(e.target.value)
                          )
                        }
                        className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                      />
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        months
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInitiative(init.id)}
                    className="sm:col-span-1 self-end sm:self-auto text-gray-400 hover:text-red-400 w-full sm:w-auto"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </Button>
                </div>
                {init.monthlyValue > 0 &&
                  init.currentTimeMonths > 0 &&
                  init.name && (
                    <div className="text-xs text-gray-400 pl-2 break-words">
                      <span className="block sm:inline">
                        Time saved:{" "}
                        {(
                          (init.currentTimeMonths * timeReduction) /
                          100
                        ).toFixed(1)}{" "}
                        months
                      </span>
                      <span className="hidden sm:inline"> • </span>
                      <span className="block sm:inline">
                        Value: $
                        {Math.round(
                          (init.monthlyValue *
                            init.currentTimeMonths *
                            timeReduction) /
                            100
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
              </div>
            ))}
            {/* Add Initiative Form */}
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-2 sm:items-center">
                <Input
                  type="text"
                  placeholder="New initiative name"
                  value={newInitiativeName}
                  onChange={(e) => setNewInitiativeName(e.target.value)}
                  className="sm:col-span-5 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
                <div className="sm:col-span-3">
                  <Input
                    type="number"
                    placeholder="Monthly value ($)"
                    value={newInitiativeValue}
                    onChange={(e) => setNewInitiativeValue(e.target.value)}
                    className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    type="number"
                    placeholder="Time (months)"
                    value={newInitiativeTime}
                    onChange={(e) => setNewInitiativeTime(e.target.value)}
                    className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addInitiative}
                  className="sm:col-span-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/20 w-full sm:w-auto"
                  disabled={
                    !newInitiativeName ||
                    !newInitiativeValue ||
                    !newInitiativeTime
                  }
                >
                  <Plus className="w-4 h-4 mx-auto" />
                  <span className="sm:hidden ml-2">Add Initiative</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Total Impact */}
          {totalCostOfDelay > 0 && (
            <div className="space-y-3">
              <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 text-center relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMathBreakdown(!showMathBreakdown)}
                  className="absolute top-2 right-2 text-purple-300 hover:text-purple-200 p-1"
                  title="Show calculation details"
                >
                  <Info className="w-4 h-4" />
                </Button>
                <p className="text-sm text-gray-300 mb-2 pr-8">
                  Projected Total Value of Faster Delivery
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  ${Math.round(totalCostOfDelay).toLocaleString()}
                </p>
                <p className="text-xs text-purple-300 mt-2 px-4">
                  By delivering {timeReduction}% faster across all initiatives
                </p>
              </div>

              {/* Math Breakdown */}
              {showMathBreakdown && (
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 sm:p-4 text-sm">
                  <h4 className="font-semibold text-purple-300 mb-3">
                    Calculation Breakdown:
                  </h4>
                  <div className="space-y-3 text-gray-300">
                    <p className="text-xs text-gray-400 mb-2">
                      Formula: Monthly Value × Time × Reduction %
                    </p>
                    {initiatives
                      .filter(
                        (init) =>
                          init.monthlyValue > 0 &&
                          init.currentTimeMonths > 0 &&
                          init.name
                      )
                      .map((init) => {
                        const timeSaved =
                          init.currentTimeMonths * (timeReduction / 100);
                        const value = init.monthlyValue * timeSaved;
                        return (
                          <div
                            key={init.id}
                            className="border-l-2 border-purple-500/30 pl-2 sm:pl-3"
                          >
                            <p className="font-medium text-white text-sm break-words">
                              {init.name}:
                            </p>
                            <p className="text-xs mt-1">
                              ${init.monthlyValue.toLocaleString()}
                              /mo × {init.currentTimeMonths}mo × {timeReduction}
                              %
                            </p>
                            <p className="text-xs">
                              = ${init.monthlyValue.toLocaleString()} ×{" "}
                              {timeSaved.toFixed(1)}mo saved
                            </p>
                            <p className="text-xs font-semibold text-purple-300">
                              = ${Math.round(value).toLocaleString()} captured
                            </p>
                          </div>
                        );
                      })}
                    <div className="border-t border-gray-700 pt-2 mt-3">
                      <p className="font-semibold text-white">
                        Total: ${Math.round(totalCostOfDelay).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
