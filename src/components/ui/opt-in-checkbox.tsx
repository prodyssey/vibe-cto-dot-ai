import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface OptInCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const OptInCheckbox = ({
  id,
  checked,
  onCheckedChange,
  label = "I'd like to receive updates and marketing communications",
  className,
  disabled = false,
}: OptInCheckboxProps) => {
  return (
    <div className={cn("flex items-start space-x-3", className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="mt-0.5 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
      />
      <Label
        htmlFor={id}
        className="text-sm text-gray-300 leading-normal cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
};