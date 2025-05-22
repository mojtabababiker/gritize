import { useState } from "react";
import clsx from "clsx";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Languages } from "@/models/types/indext";

const languages: Array<{ label: string; value: Languages }> = [
  { label: "Javascript", value: "javascript" },
  { label: "Typescript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "C++", value: "c++" },
];

type Props = {
  onValueChange: (value: Languages) => void;
  defaultValue?: string;
  className?: string;
};

function LanguageSelector({ onValueChange, defaultValue, className }: Props) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.find((lang) => lang.value === defaultValue) || languages[0]
  );
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={clsx(
            "w-full text-left border rounded-lg p-2 flex items-center justify-between",
            className
          )}
        >
          {selectedLanguage.label}
          <ChevronsUpDown className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-primary p-0 ring-0 border-0">
        <Command className="w-full">
          <CommandList className="w-full bg-bg/95">
            <CommandEmpty>No languages found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.value}
                  onSelect={() => {
                    setSelectedLanguage(language);
                    onValueChange(language.value);
                  }}
                  className="text-surface text-md group"
                >
                  <Check
                    className={clsx(
                      "mr-2 h-4 w-4 text-accent group-hover:text-bg",
                      selectedLanguage.value === language.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {language.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default LanguageSelector;
