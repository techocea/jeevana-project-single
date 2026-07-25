"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "@/components/ui/combobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Controller, useFormContext } from "react-hook-form";
import {
  ArrowRight,
  Briefcase,
  Drum,
  Info,
  Loader2,
  Map,
  ShieldCogCorner,
  User,
} from "lucide-react";
import { ageOptions } from "./onboarding-basic-form";
import { useEffect, useMemo, useState } from "react";
import { AdminCreateAdFormValues, LocationNode } from "@/types";
import {
  GROUPS_PROFESSIONS,
  LK_DATA,
  MOTHER_TONGUES,
  PERSONAL_DROPDOWNS,
  RELIGIONS_AND_CASTES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { MdTempleBuddhist } from "react-icons/md";
import {
  generateHeightOptions,
  generateWeightOptions,
} from "@/helpers/measurement-utils";

const AdminCreateAdForm = () => {
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useFormContext<AdminCreateAdFormValues>();

  const { education_levels, annual_income_ranges, hobbies } =
    PERSONAL_DROPDOWNS;

  const [countries, setCountries] = useState<LocationNode[]>([]);
  const [states, setStates] = useState<LocationNode[]>([]);
  const [cities, setCities] = useState<LocationNode[]>([]);

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const selectedReligion = watch("religion");
  const availableCastes = selectedReligion
    ? RELIGIONS_AND_CASTES[selectedReligion] || []
    : [];

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  const targetCountryNode = countries.find((c) => c.value === selectedCountry);
  const isSriLanka =
    targetCountryNode?.isoCode === "LK" || selectedCountry === "Sri Lanka";

  useEffect(() => {
    fetch("/api/location?type=countries")
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error("Initial load failure:", err));
  }, []);

  useEffect(() => {
    if (isSriLanka) {
      // Load Sri Lanka's districts from local data without hitting the API
      const lkDistricts = Object.keys(LK_DATA).map((district) => ({
        value: district,
        isoCode: district,
      }));
      setStates(lkDistricts);
      setCities([]);
      return;
    }
    if (targetCountryNode?.isoCode) {
      setLoadingStates(true);
      fetch(
        `/api/location?type=states&countryCode=${targetCountryNode.isoCode}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setStates(data);
          setCities([]);
          setLoadingStates(false);
        })
        .catch(() => setLoadingStates(false));
    }
  }, [selectedCountry, countries, isSriLanka]);

  useEffect(() => {
    if (!selectedState || !selectedCountry) return;

    if (isSriLanka) {
      // Load local towns for the selected Sri Lankan district
      const localTowns = LK_DATA[selectedState] || [];
      setCities(localTowns.map((town) => ({ value: town })));
      return;
    }

    // Fallback: Query the API proxy for other international locations
    if (targetCountryNode?.isoCode) {
      const targetStateNode = states.find((s) => s.value === selectedState);
      if (!targetStateNode?.isoCode) return;

      setLoadingCities(true);
      fetch(
        `/api/location?type=cities&countryCode=${targetCountryNode.isoCode}&stateCode=${targetStateNode.isoCode}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setCities(data);
          setLoadingCities(false);
        })
        .catch(() => setLoadingCities(false));
    }
  }, [selectedState, selectedCountry, isSriLanka, states]);

  const countryItemsList = countries.map((c) => c.value);
  const stateItemsList = states.map((s) => s.value);
  const cityItemsList = cities.map((c) => c.value);

  const heightDataObjects = useMemo(() => generateHeightOptions(), []);
  const weightDataObjects = useMemo(() => generateWeightOptions(), []);

  const heightValuesList = heightDataObjects.map((h) => h.value);
  const weightValuesList = weightDataObjects.map((w) => w.value);

  const currentSelectedHobbies = watch("hobbies");

  const toggleHobbySelection = (hobbyLabel: string) => {
    const isAlreadySelected = currentSelectedHobbies.includes(hobbyLabel);
    const updatedHobbiesArray = isAlreadySelected
      ? currentSelectedHobbies.filter((item: string) => item !== hobbyLabel)
      : [...currentSelectedHobbies, hobbyLabel];

    setValue("hobbies", updatedHobbiesArray, { shouldValidate: true });
  };

  const mailRoutingTarget = watch("mailRoutingTarget");
  const showSecondaryEmail =
    mailRoutingTarget === "candidate" || mailRoutingTarget === "both";

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
      {/* SECTION 2: Identity & Personal */}
      <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
          <User size={26} className="text-secondary" />
          <h4 className="text-black font-newsreader text-xl">
            Identity & Personal
          </h4>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-muted text-sm font-semibold">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Smith"
                {...register("fullName")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted text-sm font-semibold">
                Contact
              </Label>
              <Input
                id="contact"
                type="text"
                placeholder="07X XXX XXXX"
                {...register("contact")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-muted text-sm font-semibold">
                Date of Birth
              </Label>
              <Input id="dob" type="date" {...register("dob")} />
            </div>
            <div className="space-y-1">
              <Label className="text-muted text-sm font-semibold">Gender</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted text-sm font-semibold">Age</Label>
              <Controller
                control={control}
                name="age"
                render={({ field }) => (
                  <Select
                    value={field.value ? field.value.toString() : ""}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {ageOptions.map((age) => (
                          <SelectItem value={age.toString()} key={age}>
                            {age}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Religion */}
      <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
          <MdTempleBuddhist size={26} className="text-secondary" />
          <h4 className="text-black font-newsreader text-xl">Religion</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="religion"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Religion
            </Label>
            <Controller
              control={control}
              name="religion"
              render={({ field }) => (
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    setValue("caste", ""); // 🚀 Clear dependent caste selection when religion switches
                  }}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Religion" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(RELIGIONS_AND_CASTES).map((rel) => (
                      <SelectItem key={rel} value={rel}>
                        {rel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.religion && (
              <p className="text-sm text-red-600">{errors.religion.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="caste"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Caste
            </Label>
            <Controller
              control={control}
              name="caste"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  disabled={!selectedReligion}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      !selectedReligion &&
                      "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed",
                    )}
                  >
                    <SelectValue
                      placeholder={
                        selectedReligion
                          ? "Select Caste"
                          : "Choose a religion first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCastes.map((caste) => (
                      <SelectItem key={caste} value={caste}>
                        {caste}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.caste && (
              <p className="text-sm text-red-600">{errors.caste.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="motherTongue"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Mother Tongue
            </Label>
            <Controller
              control={control}
              name="motherTongue"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Mother Tongue" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOTHER_TONGUES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.motherTongue && (
              <p className="text-sm text-red-600">
                {errors.motherTongue.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4: Location */}
      <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
          <Map size={26} className="text-secondary" />
          <h4 className="text-black font-newsreader text-xl">Location</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1 col-span-2 space-y-1">
            <Label htmlFor="country" className="text-sm font-medium text-muted">
              Country
            </Label>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <Combobox
                  items={countryItemsList}
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    setValue("state", ""); // Reset dependent selections instantly
                    setValue("city", "");
                  }}
                >
                  <ComboboxInput placeholder="Select Country" />
                  <ComboboxContent>
                    <ComboboxEmpty>No country found.</ComboboxEmpty>
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
            {/* {errors.country && (
              <p className="text-sm text-red-600">{errors.country.message}</p>
            )} */}
          </div>

          <div className="md:col-span-1 col-span-2 space-y-1">
            <Label htmlFor="state" className="text-sm font-medium text-muted">
              State
            </Label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <Combobox
                    items={stateItemsList}
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setValue("city", "");
                    }}
                  >
                    <ComboboxInput
                      placeholder={
                        loadingStates
                          ? "Syncing regional data..."
                          : isSriLanka
                            ? "Select District"
                            : "Select State"
                      }
                      disabled={!selectedCountry || loadingStates}
                      className={cn(
                        (!selectedCountry || loadingStates) &&
                        "bg-slate-50 text-slate-400 cursor-not-allowed",
                      )}
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
                  {loadingStates && (
                    <div className="absolute right-3 top-3.5 z-50">
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    </div>
                  )}
                </div>
              )}
            />
            {/* {errors.state && (
              <p className="text-sm text-red-600">{errors.state.message}</p>
            )} */}
          </div>

          <div className="md:col-span-1 col-span-2 space-y-1">
            <Label htmlFor="city" className="text-sm font-medium text-muted">
              City
            </Label>
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <div className="relative">
                  <Combobox
                    items={cityItemsList}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <ComboboxInput
                      placeholder={
                        loadingCities ? "Mapping town layout..." : "Select City"
                      }
                      disabled={!selectedState || loadingCities}
                      className={cn(
                        (!selectedState || loadingCities) &&
                        "bg-slate-50 text-slate-400 cursor-not-allowed",
                      )}
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No locations found.</ComboboxEmpty>
                      <ComboboxList>
                        {(group, index) => (
                          <ComboboxGroup key={index} items={group.items}>
                            <ComboboxLabel>{group.value}</ComboboxLabel>
                            <ComboboxCollection>
                              {(item) => (
                                <ComboboxItem key={item} value={item}>
                                  {item}
                                </ComboboxItem>
                              )}
                            </ComboboxCollection>
                            {index < cityItemsList.length - 1 && (
                              <ComboboxSeparator />
                            )}
                          </ComboboxGroup>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {loadingCities && (
                    <div className="absolute right-3 top-3.5">
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    </div>
                  )}
                </div>
              )}
            />
            {/* {errors.city && (
              <p className="text-sm text-red-600">{errors.city.message}</p>
            )} */}
          </div>

          <div className="md:col-span-1 col-span-2 space-y-1">
            <Label
              htmlFor="residencyStatus"
              className="text-sm font-medium text-muted"
            >
              Residency Status
            </Label>
            <Controller
              control={control}
              name="residencyStatus"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your residency status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CITIZEN">Citizen</SelectItem>
                    <SelectItem value="PR">Permanent Resident</SelectItem>
                    <SelectItem value="WORK">Work Visa</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {/* {errors.residencyStatus && (
              <p className="text-sm text-red-600">
                {errors.residencyStatus.message}
              </p>
            )} */}
          </div>
        </div>
      </section>

      {/* SECTION 5: Career */}
      <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
          <Briefcase size={26} className="text-secondary" />
          <h4 className="text-black font-newsreader text-xl">
            Career & Profession
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1 col-span-2 space-y-1">
            <Label htmlFor="country" className="text-sm font-medium text-muted">
              Highest Education Level
            </Label>
            <Controller
              control={control}
              name="educationLevel"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {education_levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {/* {errors.country && (
              <p className="text-sm text-red-600">{errors.country.message}</p>
            )} */}
          </div>

          <div className="md:col-span-1 col-span-2 space-y-1">
            <Label htmlFor="city" className="text-sm font-medium text-muted">
              Current Profession
            </Label>
            <Controller
              control={control}
              name="profession"
              render={({ field }) => (
                <Combobox
                  items={GROUPS_PROFESSIONS}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <ComboboxInput placeholder="Select Profession" />

                  <ComboboxContent alignOffset={-28} className="w-60">
                    <ComboboxEmpty>No match found.</ComboboxEmpty>
                    <ComboboxList>
                      {(group) => (
                        <ComboboxGroup key={group.category} items={group.roles}>
                          <ComboboxLabel className="uppercase font-bold text-black">
                            {group.category}
                          </ComboboxLabel>
                          <ComboboxCollection>
                            {(item) => (
                              <ComboboxItem key={item} value={item}>
                                {item}
                              </ComboboxItem>
                            )}
                          </ComboboxCollection>
                        </ComboboxGroup>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            />
            {/* {errors.city && (
              <p className="text-sm text-red-600">{errors.city.message}</p>
            )} */}
          </div>

          <div className="md:col-span-1 col-span-2 space-y-1">
            <Label
              htmlFor="residencyStatus"
              className="text-sm font-medium text-muted"
            >
              Annual Income Range
            </Label>
            <Controller
              control={control}
              name="annualIncomeRange"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select annual income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {annual_income_ranges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {/* {errors.residencyStatus && (
              <p className="text-sm text-red-600">
                {errors.residencyStatus.message}
              </p>
            )} */}
          </div>
        </div>
      </section>

      {/* SECTION 6: Other Info */}
      <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
          <Info size={26} className="text-secondary" />
          <h4 className="text-black font-newsreader text-xl">
            Additional Details
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label
              htmlFor="height"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Height
            </Label>
            <Controller
              control={control}
              name="height"
              render={({ field }) => (
                <Combobox
                  items={heightValuesList}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <ComboboxInput
                    placeholder="Select Height"
                    // Intercept presentation display text so it renders "5' 11\"" instead of "71"
                    value={
                      heightDataObjects.find((h) => h.value === field.value)
                        ?.label || ""
                    }
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No match found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => {
                        const displayLabel =
                          heightDataObjects.find((h) => h.value === item)
                            ?.label || item;
                        return (
                          <ComboboxItem key={item} value={item}>
                            {displayLabel}
                          </ComboboxItem>
                        );
                      }}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            />
            {errors.height && (
              <p className="text-sm text-red-600">{errors.height.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="weight"
              className="text-sm font-medium text-slate-700 uppercase"
            >
              Weight
            </Label>
            <Controller
              control={control}
              name="weight"
              render={({ field }) => (
                <Combobox
                  items={weightValuesList}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <ComboboxInput
                    placeholder="Select Weight"
                    // Intercept presentation display text so it renders "165 lbs" instead of "165"
                    value={
                      weightDataObjects.find((w) => w.value === field.value)
                        ?.label || ""
                    }
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No match found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => {
                        const displayLabel =
                          weightDataObjects.find((w) => w.value === item)
                            ?.label || item;
                        return (
                          <ComboboxItem key={item} value={item}>
                            {displayLabel}
                          </ComboboxItem>
                        );
                      }}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            />
            {errors.weight && (
              <p className="text-sm text-red-600">{errors.weight.message}</p>
            )}
          </div>

          {/* 2. Habits (Smoking & Drinking) */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 uppercase">
              Smoking Habits
            </Label>
            <Controller
              control={control}
              name="smoking"
              defaultValue="never"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value ?? "never"}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="s1" />
                    <Label
                      htmlFor="s1"
                      className="font-normal text-accent-foreground"
                    >
                      Never
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="occasionally" id="s2" />
                    <Label
                      htmlFor="s2"
                      className="font-normal text-accent-foreground"
                    >
                      Occasionally
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regularly" id="s3" />
                    <Label
                      htmlFor="s3"
                      className="font-normal text-accent-foreground"
                    >
                      Regularly
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.smoking && (
              <p className="text-sm text-red-600">{errors.smoking.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 uppercase">
              Drinking Habits
            </Label>
            <Controller
              control={control}
              name="drinking"
              defaultValue="never"
              render={({ field }) => (
                <RadioGroup
                  value={field.value ?? "never"}
                  onValueChange={field.onChange}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="d1" />
                    <Label
                      htmlFor="d1"
                      className="font-normal text-accent-foreground"
                    >
                      Non-drinker
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="socially" id="d2" />
                    <Label
                      htmlFor="d2"
                      className="font-normal text-accent-foreground"
                    >
                      Socially
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regularly" id="d3" />
                    <Label
                      htmlFor="d3"
                      className="font-normal text-accent-foreground"
                    >
                      Regularly
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.drinking && (
              <p className="text-sm text-red-600">{errors.drinking.message}</p>
            )}
          </div>

          {/* 3. Food Preferences */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 uppercase">
              Food Preferences
            </Label>
            <Controller
              control={control}
              name="foodPreferences"
              defaultValue="vegetarian"
              render={({ field }) => (
                <RadioGroup
                  value={field.value ?? "vegetarian"}
                  onValueChange={field.onChange}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegetarian" id="f1" />
                    <Label
                      htmlFor="f1"
                      className="font-normal text-accent-foreground"
                    >
                      Vegetarian
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non-vegetarian" id="f2" />
                    <Label
                      htmlFor="f2"
                      className="font-normal text-accent-foreground"
                    >
                      Non-Vegetarian
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegan" id="f3" />
                    <Label
                      htmlFor="f3"
                      className="font-normal text-accent-foreground"
                    >
                      Vegan
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.foodPreferences && (
              <p className="text-sm text-red-600">
                {errors.foodPreferences.message}
              </p>
            )}
          </div>

          {/* 4. Differently Abled */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 uppercase">
              Differently Abled?
            </Label>
            <Controller
              control={control}
              name="isDifferentlyAbled"
              render={({ field }) => (
                <RadioGroup
                  value={field.value === true ? "yes" : "no"}
                  onValueChange={(val) => field.onChange(val === "yes")}
                  className="flex flex-row gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="differently-abled-yes" />
                    <Label
                      htmlFor="differently-abled-yes"
                      className="font-normal text-accent-foreground"
                    >
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="differently-abled-no" />
                    <Label
                      htmlFor="differently-abled-no"
                      className="font-normal text-accent-foreground"
                    >
                      No
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />

            {/* Conditional Input field if 'Yes' is picked */}
            {watch("isDifferentlyAbled") === true && (
              <div className="pt-2 animate-in fade-in duration-200">
                <Input placeholder="Please specify any assistance or details needed" />
              </div>
            )}

            {errors.isDifferentlyAbled && (
              <p className="text-sm text-red-600">
                {errors.isDifferentlyAbled.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 7: Hobbies */}
      <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
          <Drum size={26} className="text-secondary" />
          <h4 className="text-black font-newsreader text-xl">Hobbies</h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {hobbies.map((hobby) => {
            const isSelected = currentSelectedHobbies.includes(hobby.label);
            return (
              <Button
                type="button"
                key={hobby.label}
                onClick={() => toggleHobbySelection(hobby.label)}
                variant={isSelected ? "default" : "outline"}
                className="flex flex-col items-center gap-4 h-full py-4"
              >
                <span
                  className="text-3xl leading-none"
                  role="img"
                  aria-label={hobby.label}
                >
                  {hobby.icon}
                </span>
                <span className="text-sm font-medium tracking-tight text-secondary">
                  {hobby.label}
                </span>
              </Button>
            );
          })}
        </div>
      </section>

      <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
          <ShieldCogCorner size={26} className="text-secondary" />
          <h4 className="text-black font-newsreader text-xl">
            Admin Overrides
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-3">
          {/* Input 1: Created By */}
          <div className="space-y-1.5">
            <Label
              htmlFor="createdBy"
              className="text-sm font-medium text-muted"
            >
              Profile Created By
            </Label>
            <Controller
              name="createdBy"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    id="createdBy"
                    className="w-full bg-white shadow-sm border-slate-200"
                  >
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self">Myself</SelectItem>
                    <SelectItem value="parent">Parent / Guardian</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Input 2: Profile Status */}
          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-sm font-medium text-muted">
              Matchmaking Status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    id="status"
                    className="w-full bg-white shadow-sm border-slate-200"
                  >
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Hold in Pending</SelectItem>
                    <SelectItem value="approved">Instantly Approved</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* BOTTOM LAYER: Card Selections & Dynamic Form Field */}
        <div className="space-y-1.5">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-muted">
              System Notification Routing
            </Label>
          </div>

          <Controller
            control={control}
            name="mailRoutingTarget"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-1 gap-2"
              >
                {/* Option 1 */}
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                  <RadioGroupItem
                    value="owner"
                    id="routing-owner"
                    className="border-slate-300 text-pink-600 focus:ring-pink-500"
                  />
                  <Label
                    htmlFor="routing-owner"
                    className="text-sm font-medium text-slate-700 cursor-pointer w-full"
                  >
                    Account Owner Only
                  </Label>
                </div>

                {/* Option 2 */}
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                  <RadioGroupItem
                    value="candidate"
                    id="routing-candidate"
                    className="border-slate-300 text-pink-600 focus:ring-pink-500"
                  />
                  <Label
                    htmlFor="routing-candidate"
                    className="text-sm font-medium text-slate-700 cursor-pointer w-full"
                  >
                    Candidate Only
                  </Label>
                </div>

                {/* Option 3 */}
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                  <RadioGroupItem
                    value="both"
                    id="routing-both"
                    className="border-slate-300 text-pink-600 focus:ring-pink-500"
                  />
                  <Label
                    htmlFor="routing-both"
                    className="text-sm font-medium text-slate-700 cursor-pointer w-full"
                  >
                    Both Addresses
                  </Label>
                </div>
              </RadioGroup>
            )}
          />

          {/* DYNAMIC FIELD: Captures the second optional target email address */}
          {showSecondaryEmail && (
            <div className="pt-3 border-t border-slate-100 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <Label
                htmlFor="secondaryEmail"
                className="text-xs font-semibold text-slate-600"
              >
                Candidate Email Address{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </Label>
              <Controller
                name="secondaryEmail"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="secondaryEmail"
                    type="email"
                    placeholder="Enter candidate's secondary contact email..."
                    className="w-full border-slate-200"
                  />
                )}
              />
            </div>
          )}
        </div>
      </section>

      {/* Button Row Action Strip Bar */}
      <div className="justify-end flex">
        <Button
          size="lg"
          type="submit"
          disabled={!isDirty || isSubmitting}
          variant="secondary"
          className="w-fit uppercase py-3 px-5"
        >
          Publish Ad
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default AdminCreateAdForm;
