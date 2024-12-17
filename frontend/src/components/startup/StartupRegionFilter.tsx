"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RegionT } from "@/types/strapi/User";

type Props = {
  regions: RegionT[];
  filter: string;
  _all: string;
  updateSelectedRegion: (region: string) => string;
};

export function StartupRegionFilter({
  regions,
  filter,
  _all,
  updateSelectedRegion,
}: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {filter === _all ? "All Regions" : filter}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search region..." />
          <CommandList>
            <CommandEmpty>No region found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value={_all}
                onSelect={() => updateSelectedRegion(_all)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    filter === _all ? "opacity-100" : "opacity-0"
                  )}
                />
                All Regions
              </CommandItem>
              {regions.map((region) => (
                <CommandItem
                  key={region.id}
                  value={region.title}
                  onSelect={() =>
                    updateSelectedRegion(region.title ? region.title : _all)
                  }
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      filter === region.title ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {region.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
