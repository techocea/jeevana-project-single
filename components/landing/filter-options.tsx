"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { LocationNode } from "@/types";
import {
  RELIGIONS_AND_CASTES,
  MOTHER_TONGUES,
  PERSONAL_DROPDOWNS,
  LK_DATA,
  GROUPS_PROFESSIONS,
} from "@/lib/constants";
import { SlidersHorizontal } from "lucide-react";

type FilterFormValues = {
  lookingFor: string;
  minAge: string;
  maxAge: string;
  religion: string;
  caste: string;
  motherTongue: string;
  educationLevel: string;
  profession: string;
  annualIncomeRange: string;
  country: string;
  state: string;
  hobbies: string[];
};

type FilterOptionsProps = {
  mode?: "search" | "dashboard";
};

const FilterOptions = ({ mode = "search" }: FilterOptionsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isDashboard = mode === "dashboard";

  const [countries, setCountries] = useState<LocationNode[]>([]);
  const [states, setStates] = useState<LocationNode[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const initialFormValues = useMemo(() => {
    if (!searchParams) return null;
    return {
      lookingFor: searchParams.get("lookingFor") || "",
      minAge: searchParams.get("minAge") || "",
      maxAge: searchParams.get("maxAge") || "",
      religion: searchParams.get("religion") || "",
      caste: searchParams.get("caste") || "",
      motherTongue: searchParams.get("motherTongue") || "",
      educationLevel: searchParams.get("educationLevel") || "",
      profession: searchParams.get("profession") || "",
      annualIncomeRange: searchParams.get("annualIncomeRange") || "",
      country: searchParams.get("country") || "",
      state: searchParams.get("state") || "",
      hobbies: (searchParams.get("hobbies") || "").split(",").filter(Boolean),
    };
  }, [searchParams]);

  const { register, control, handleSubmit, reset, watch, setValue } =
    useForm<FilterFormValues>({
      defaultValues: initialFormValues || {
        lookingFor: "",
        minAge: "",
        maxAge: "",
        religion: "",
        caste: "",
        motherTongue: "",
        educationLevel: "",
        profession: "",
        annualIncomeRange: "",
        country: "",
        state: "",
        hobbies: [],
      },
    });

  const religionValue = watch("religion");
  const countryValue = watch("country");
  const selectedCountry = countries.find((item) => item.value === countryValue);

  useEffect(() => {
    const loadCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await fetch("/api/location?type=countries");
        const data = await response.json();
        const normalized = Array.isArray(data)
          ? data.map((item: any) => ({
            value: item.value,
            isoCode: item.isoCode,
          }))
          : [];
        const complete = normalized.some((item) => item.isoCode === "LK")
          ? normalized
          : [{ value: "Sri Lanka", isoCode: "LK" }, ...normalized];
        setCountries(complete);
      } catch (error) {
        setCountries([{ value: "Sri Lanka", isoCode: "LK" }]);
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    const loadStates = async () => {
      if (!countryValue) {
        setStates([]);
        return;
      }

      if (selectedCountry?.isoCode === "LK") {
        setStates(
          Object.keys(LK_DATA).map((district) => ({
            value: district,
            isoCode: district,
          })),
        );
        return;
      }

      if (!selectedCountry?.isoCode) {
        setStates([]);
        return;
      }

      setLoadingStates(true);
      try {
        const response = await fetch(
          `/api/location?type=states&countryCode=${selectedCountry.isoCode}`,
        );
        const data = await response.json();
        const normalized = Array.isArray(data)
          ? data.map((item: any) => ({
            value: item.value,
            isoCode: item.isoCode,
          }))
          : [];
        setStates(normalized);
      } catch (error) {
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, [countryValue, selectedCountry]);

  useEffect(() => {
    if (initialFormValues) {
      reset(initialFormValues, { keepDefaultValues: true });
    }
  }, [initialFormValues, reset]);

  useEffect(() => {
    if (!searchParams) return;
    reset({
      lookingFor: searchParams.get("lookingFor") || "",
      minAge: searchParams.get("minAge") || "",
      maxAge: searchParams.get("maxAge") || "",
      religion: searchParams.get("religion") || "",
      caste: searchParams.get("caste") || "",
      motherTongue: searchParams.get("motherTongue") || "",
      educationLevel: searchParams.get("educationLevel") || "",
      profession: searchParams.get("profession") || "",
      annualIncomeRange: searchParams.get("annualIncomeRange") || "",
      country: searchParams.get("country") || "",
      state: searchParams.get("state") || "",
      hobbies: (searchParams.get("hobbies") || "").split(",").filter(Boolean),
    });
  }, [reset, searchParams]);

  useEffect(() => {
    if (!religionValue) {
      setValue("caste", "");
    }
  }, [religionValue, setValue]);

  useEffect(() => {
    setValue("state", "");
  }, [countryValue, setValue]);

  const onSubmit = (values: FilterFormValues) => {
    const params = new URLSearchParams();

    searchParams.forEach((value, key) => {
      params.set(key, value);
    });

    if (values.lookingFor) params.set("lookingFor", values.lookingFor);
    else params.delete("lookingFor");

    if (values.religion) params.set("religion", values.religion);
    else params.delete("religion");

    if (values.caste) params.set("caste", values.caste);
    else params.delete("caste");

    if (values.motherTongue) params.set("motherTongue", values.motherTongue);
    else params.delete("motherTongue");

    if (values.educationLevel)
      params.set("educationLevel", values.educationLevel);
    else params.delete("educationLevel");

    if (values.profession) params.set("profession", values.profession);
    else params.delete("profession");

    if (values.annualIncomeRange)
      params.set("annualIncomeRange", values.annualIncomeRange);
    else params.delete("annualIncomeRange");

    if (values.country) params.set("country", values.country);
    else params.delete("country");

    if (values.state) params.set("state", values.state);
    else params.delete("state");

    if (values.hobbies.length) params.set("hobbies", values.hobbies.join(","));
    else params.delete("hobbies");

    if (values.minAge) params.set("minAge", values.minAge);
    else params.delete("minAge");

    if (values.maxAge) params.set("maxAge", values.maxAge);
    else params.delete("maxAge");

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url);
    setDrawerOpen(false);
  };

  const resetFilters = () => {
    reset({
      lookingFor: "",
      minAge: "",
      maxAge: "",
      religion: "",
      caste: "",
      motherTongue: "",
      educationLevel: "",
      profession: "",
      annualIncomeRange: "",
      country: "",
      state: "",
      hobbies: [],
    });
    router.replace(pathname);
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div
        className={`${mode == "search" ? "md:hidden" : "mb-2 justify-end flex"}`}
      >
        <Button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="w-fit  rounded-full"
          variant="outline"
        >
          <SlidersHorizontal size={20} className="mr-1" />
          FILTERS
        </Button>
      </div>

      {/* Desktop Filter Card */}
      <Card
        className={
          isDashboard
            ? "hidden"
            : "hidden md:block rounded-none border-r border-primary p-2 w-full ml-0"
        }
      >
        <CardHeader className="justify-start">
          <div className="flex items-center justify-center gap-2 mb-4">
            <SlidersHorizontal size={24} className="text-primary" />
            <h4 className="text-2xl font-medium font-newsreader">Filters</h4>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FilterForm />
          </form>
        </CardContent>
      </Card>

      {/* Mobile Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent
          className={
            isDashboard
              ? "rounded-t-3xl border border-slate-200 bg-white p-4 max-w-3xl mx-auto"
              : "md:hidden rounded-t-3xl border border-slate-200 bg-white p-4"
          }
        >
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2 justify-start text-2xl font-medium font-newsreader text-black">
              <SlidersHorizontal size={24} className="text-primary" />
              Filters
            </DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto max-h-[70vh] px-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FilterForm />
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );

  function FilterForm() {
    return (
      <>
        <div className="border-b pb-4 text-muted">
          <Label className="mb-2 block text-sm font-medium">Looking for</Label>
          <Controller
            name="lookingFor"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select preference">
                    {field.value}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bride">Bride</SelectItem>
                  <SelectItem value="groom">Groom</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="border-b pb-4 text-muted">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="mb-2 block text-sm font-medium">Min Age</Label>
              <Input
                {...register("minAge")}
                placeholder="18"
                type="number"
                min={18}
              />
            </div>
            <div>
              <Label className="mb-2 block text-sm font-medium">Max Age</Label>
              <Input
                {...register("maxAge")}
                placeholder="50"
                type="number"
                min={18}
              />
            </div>
          </div>
        </div>

        <div className="border-b pb-4 text-muted">
          <Label className="mb-2 block text-sm font-medium">Religion</Label>
          <Controller
            name="religion"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  setValue("caste", "");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select religion">
                    {field.value}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(RELIGIONS_AND_CASTES).map((religion) => (
                    <SelectItem key={religion} value={religion}>
                      {religion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {religionValue && (
            <div className="mt-3">
              <Label className="mb-2 block text-sm font-medium">Caste</Label>
              <Controller
                name="caste"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select caste">
                        {field.value}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {RELIGIONS_AND_CASTES[religionValue].map((caste) => (
                        <SelectItem key={caste} value={caste}>
                          {caste}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}
        </div>

        <div className="border-b pb-4 text-muted">
          <Label className="mb-2 block text-sm font-medium">
            Mother Tongue
          </Label>
          <Controller
            name="motherTongue"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language">
                    {field.value}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {MOTHER_TONGUES.map((tongue) => (
                    <SelectItem key={tongue} value={tongue}>
                      {tongue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="border-b pb-4 text-muted">
          <Label className="mb-2 block text-sm font-medium">
            Education Level
          </Label>
          <Controller
            name="educationLevel"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select education">
                    {field.value}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PERSONAL_DROPDOWNS.education_levels.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="border-b pb-4 text-muted">
          <Label className="mb-2 block text-sm font-medium">Profession</Label>
          <Controller
            name="profession"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select profession">
                    {field.value}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {GROUPS_PROFESSIONS.map((group) => (
                    <div key={group.category} className="p-1">
                      <div className="px-2 py-1 text-xs font-medium text-muted">
                        {group.category}
                      </div>
                      {group.roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="border-b pb-4 text-muted">
          <Label className="mb-2 block text-sm font-medium">
            Annual Income
          </Label>
          <Controller
            name="annualIncomeRange"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select income range">
                    {field.value}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PERSONAL_DROPDOWNS.annual_income_ranges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="border-b pb-4 text-muted">
          <div className="flex flex-col gap-3">
            <div>
              <Label className="mb-2 block text-sm font-medium">Country</Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Combobox
                    items={countries.map((item) => item.value)}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("state", "");
                    }}
                  >
                    <ComboboxInput
                      placeholder={
                        loadingCountries
                          ? "Loading countries..."
                          : "Select country"
                      }
                      disabled={loadingCountries}
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No countries found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item, idx) => (
                          <ComboboxItem key={idx} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                )}
              />
            </div>
            <div>
              <Label className="mb-2 block text-sm font-medium">
                State / Region
              </Label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Combobox
                    items={states.map((item) => item.value)}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <ComboboxInput
                      placeholder={
                        countryValue
                          ? loadingStates
                            ? "Loading regions..."
                            : "Select state"
                          : "Select country first"
                      }
                      disabled={!countryValue || loadingStates}
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No regions found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item, idx) => (
                          <ComboboxItem key={idx} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                )}
              />
            </div>
          </div>
        </div>

        <div className="border-b pb-4 text-muted">
          <Label className="mb-2 block text-sm font-medium">Hobbies</Label>
          <Controller
            name="hobbies"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {PERSONAL_DROPDOWNS.hobbies.map((hobby) => {
                  const selected = field.value?.includes(hobby.label) || false;
                  return (
                    <label
                      key={hobby.label}
                      className="inline-flex items-center gap-2 rounded-md border border-input px-2 py-1 text-sm"
                    >
                      <Checkbox
                        checked={selected}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          const next = checked
                            ? [...current, hobby.label]
                            : current.filter((value) => value !== hobby.label);
                          field.onChange(next);
                        }}
                      />
                      <span>{hobby.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          />
        </div>

        <div className="flex items-center gap-2 pb-2 w-full">
          <Button type="submit" className="w-1/2">
            APPLY
          </Button>
          <Button
            variant="outline"
            type="button"
            className="w-1/2"
            onClick={resetFilters}
          >
            RESET
          </Button>
        </div>
      </>
    );
  }
};

export default FilterOptions;
