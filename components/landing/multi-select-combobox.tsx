"use client";

import * as React from "react";
import { Control, Path, FieldValues, Controller } from "react-hook-form";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

interface Option {
    label: string;
    value: string;
    category?: string;
}

interface MultiSelectFieldProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    name: Path<TFieldValues>;
    label: string;
    placeholder?: string;
    description?: string;
    options: Option[];
    loading?: boolean;
    disabled?: boolean;
}

export function MultiSelectField<TFieldValues extends FieldValues>({
    control,
    name,
    label,
    placeholder = "Select options...",
    description,
    options,
    loading = false,
    disabled = false,
}: MultiSelectFieldProps<TFieldValues>) {
    const [open, setOpen] = React.useState(false);

    const groupedOptions = React.useMemo(() => {
        const groups: Record<string, Option[]> = {};
        const unassigned: Option[] = [];

        options.forEach((opt) => {
            if (opt.category) {
                if (!groups[opt.category]) groups[opt.category] = [];
                groups[opt.category].push(opt);
            } else {
                unassigned.push(opt);
            }
        });

        return { groups, unassigned, hasGroups: Object.keys(groups).length > 0 };
    }, [options]);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => {
                const currentValues: string[] = Array.isArray(value) ? value : [];

                const renderCommandItem = (option: Option) => {
                    const isSelected = currentValues.includes(option.value);
                    return (
                        <CommandItem
                            key={option.value}
                            value={option.label}
                            onSelect={() => {
                                if (isSelected) {
                                    onChange(currentValues.filter((v) => v !== option.value));
                                } else {
                                    onChange([...currentValues, option.value]);
                                }
                            }}
                            className="text-sm py-2 px-3 data-[selected='true']:bg-slate-50 cursor-pointer flex items-center gap-2"
                        >
                            <Checkbox
                                checked={isSelected}
                                className={cn(
                                    "h-4 w-4 shrink-0 rounded border-muted data-[state=checked]:bg-primary data-[state=checked]:border-secondary cursor-pointer",
                                    isSelected ? "opacity-100" : "opacity-70",
                                )}
                            />
                            <span className="truncate text-sm text-[#334155] font-medium">
                                {option.label}
                            </span>
                        </CommandItem>
                    );
                };

                return (
                    <div className="flex flex-col w-full gap-2">
                        <Label className="text-sm font-medium text-slate-700 uppercase">
                            {label}
                        </Label>

                        <Popover open={open && !disabled} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    role="combobox"
                                    aria-expanded={open}
                                    disabled={loading}
                                    className={cn(
                                        "border border-input bg-white hover:bg-white w-full justify-between font-normal text-left h-10",
                                        !currentValues.length && "text-muted-foreground",
                                        error &&
                                        "border-destructive text-destructive focus-visible:ring-destructive",
                                    )}
                                >
                                    <div className="flex flex-wrap gap-1.5 items-center max-w-[92%]">
                                        {loading ? (
                                            <span className="text-sm text-muted-foreground animate-pulse">
                                                Loading...
                                            </span>
                                        ) : currentValues.length > 0 ? (
                                            currentValues.map((val) => {
                                                const matchedOption = options.find(
                                                    (o) => o.value === val,
                                                );
                                                return (
                                                    <Badge
                                                        key={val}
                                                        variant="secondary"
                                                        className="bg-[#f1f5f9] text-[#334155] border-none pr-1 pl-2.5 gap-1 text-xs py-0.5 rounded-md font-medium hover:bg-[#e2e8f0]"
                                                    >
                                                        <span className="truncate max-w-[150px]">
                                                            {matchedOption ? matchedOption.label : val}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onChange(
                                                                    currentValues.filter((v) => v !== val),
                                                                );
                                                            }}
                                                            className="rounded-full p-0.5 outline-none hover:bg-gray-200 transition-colors"
                                                        >
                                                            <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                                                        </button>
                                                    </Badge>
                                                );
                                            })
                                        ) : (
                                            <span className="text-sm text-gray-400 font-light">
                                                {placeholder}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronsUpDown className="h-4 w-4 shrink-0 text-gray-300 ml-auto" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent
                                className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl shadow-md border border-[#e2e8f0]"
                                align="start"
                            >
                                <Command loop>
                                    <CommandInput
                                        placeholder="Search options..."
                                        className="h-10 text-sm"
                                    />
                                    <CommandList className="max-h-[250px] overflow-y-auto">
                                        <CommandEmpty className="text-xs py-3 text-center text-muted-foreground">
                                            No matches found.
                                        </CommandEmpty>

                                        {/* Rendering Engine: Check if structural data contains groupings */}
                                        {groupedOptions.hasGroups ? (
                                            <>
                                                {Object.entries(groupedOptions.groups).map(
                                                    ([category, items]) => (
                                                        <CommandGroup
                                                            key={category}
                                                            heading={
                                                                <span className="text-[11px] font-bold text-[#1e3a8a]/70 tracking-wider uppercase">
                                                                    {category}
                                                                </span>
                                                            }
                                                            className="px-1"
                                                        >
                                                            {items.map(renderCommandItem)}
                                                        </CommandGroup>
                                                    ),
                                                )}
                                                {/* Append remaining standard ungrouped items underneath */}
                                                {groupedOptions.unassigned.length > 0 && (
                                                    <CommandGroup
                                                        heading="Other Options"
                                                        className="px-1"
                                                    >
                                                        {groupedOptions.unassigned.map(renderCommandItem)}
                                                    </CommandGroup>
                                                )}
                                            </>
                                        ) : (
                                            // Fallback execution block handling basic flat options list directly
                                            <CommandGroup className="p-1">
                                                {options.map(renderCommandItem)}
                                            </CommandGroup>
                                        )}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {error && (
                            <p className="text-xs font-medium text-destructive mt-0.5">
                                {error.message}
                            </p>
                        )}
                    </div>
                );
            }}
        />
    );
}
