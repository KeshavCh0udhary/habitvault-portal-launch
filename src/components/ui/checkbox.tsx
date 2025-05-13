
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// Create a CheckboxGroup component
interface CheckboxGroupProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  children: React.ReactNode;
  className?: string;
}

const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  CheckboxGroupProps
>(({ value, onValueChange, children, className }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-2", className)}>
      {children}
    </div>
  );
});
CheckboxGroup.displayName = "CheckboxGroup";

interface CheckboxItemProps {
  value: string;
  label: string;
  className?: string;
}

const CheckboxItem = React.forwardRef<
  HTMLDivElement,
  CheckboxItemProps
>(({ value, label, className }, ref) => {
  const context = React.useContext(CheckboxGroupContext);
  
  if (!context) {
    console.error("CheckboxItem must be used within a CheckboxGroup");
    return null;
  }
  
  const { groupValue, onChange } = context;
  const isChecked = groupValue.includes(value);
  
  const handleChange = (checked: boolean) => {
    let newValue: string[];
    
    if (checked) {
      newValue = [...groupValue, value];
    } else {
      newValue = groupValue.filter((item) => item !== value);
    }
    
    onChange(newValue);
  };
  
  return (
    <div ref={ref} className={cn("flex items-center space-x-2", className)}>
      <Checkbox
        id={`checkbox-${value}`}
        checked={isChecked}
        onCheckedChange={handleChange}
      />
      <label
        htmlFor={`checkbox-${value}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
});
CheckboxItem.displayName = "CheckboxItem";

// Create a context for the CheckboxGroup
interface CheckboxGroupContextType {
  groupValue: string[];
  onChange: (value: string[]) => void;
}

const CheckboxGroupContext = React.createContext<CheckboxGroupContextType | undefined>(undefined);

// Update the CheckboxGroup component to provide context
const CheckboxGroupWithContext = React.forwardRef<
  HTMLDivElement,
  CheckboxGroupProps
>(({ value, onValueChange, children, className }, ref) => {
  return (
    <CheckboxGroupContext.Provider value={{ groupValue: value, onChange: onValueChange }}>
      <div ref={ref} className={cn("space-y-2", className)}>
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
});
CheckboxGroupWithContext.displayName = "CheckboxGroup";

export { Checkbox, CheckboxGroupWithContext as CheckboxGroup, CheckboxItem }
