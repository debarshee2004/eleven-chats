import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ToggleButtonProps {
  onToggle?: () => void;
  className?: string;
}

const ToggleButton = ({ onToggle }: ToggleButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (onToggle) onToggle();
  };

  return (
    <Button
      onClick={handleToggle}
      className="fixed bottom-4 right-4 z-50"
      variant={"secondary"}
    >
      Chat App
    </Button>
  );
};

export default ToggleButton;
