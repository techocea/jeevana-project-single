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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import {
  Drum,
  Loader2,
  Map,
  ShieldCogCorner,
  Trophy,
  User,
} from "lucide-react";
import { ageOptions } from "./onboarding-basic-form";
import { useEffect, useState } from "react";
import { LocationNode } from "@/types";
import {
  GROUPS_PROFESSIONS,
  LK_DATA,
  PERSONAL_DROPDOWNS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const AdminCreateAdForm = () => {
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const { education_levels, annual_income_ranges, hobbies } =
    PERSONAL_DROPDOWNS;

  const [countries, setCountries] = useState<LocationNode[]>([]);
  const [states, setStates] = useState<LocationNode[]>([]);
  const [cities, setCities] = useState<LocationNode[]>([]);

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

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

  const currentSelectedHobbies = watch("hobbies");

  const toggleHobbySelection = (hobbyLabel: string) => {
    const isAlreadySelected = currentSelectedHobbies.includes(hobbyLabel);
    const updatedHobbiesArray = isAlreadySelected
      ? currentSelectedHobbies.filter((item:string) => item !== hobbyLabel)
      : [...currentSelectedHobbies, hobbyLabel];

    setValue("hobbies", updatedHobbiesArray, { shouldValidate: true });
  };
  
  return (
    <form className="space-y-6">
      <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
          <ShieldCogCorner size={26} className="text-secondary" />
          <h4 className="text-black font-newsreader text-xl">
            Admin Overrides
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className="text-muted text-sm font-semibold">
              Select User
            </Label>
            <Input placeholder="search user" />
          </div>
          <div className="space-y-1">
            <Label className="text-muted text-sm font-semibold">
              Profile Ownership
            </Label>
            <Controller
              control={control}
              name="createdBy"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ownership" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="STAFF">Staff</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {/* {errors.educationLevel && (
              <p className="text-sm text-red-600">
                {errors.educationLevel.message}
              </p>
            )} */}
          </div>
          <div className="space-y-1">
            <Label className="text-muted text-sm font-semibold">
              Account Membership Tier
            </Label>
            <Controller
              control={control}
              name="membership"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select membership" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="free_tier">Free Tier</SelectItem>
                      <SelectItem value="classical">Classical</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </section>

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
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
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

      {/* SECTION 3: Career & Location */}
      <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
          <Map size={26} className="text-secondary" />
          <h4 className="text-black font-newsreader text-xl">
            Career & Location
          </h4>
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

      {/* SECTION 4: Achievements */}
      <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
          <Trophy size={26} className="text-secondary" />
          <h4 className="text-black font-newsreader text-xl">Achievements</h4>
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

      {/* SECTION 5: Hobbies */}
      <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
          <Drum size={26} className="text-secondary" />
          <h4 className="text-black font-newsreader text-xl">Hobbies</h4>
        </div>
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {hobbies.map((hobby) => {
            const isSelected = currentSelectedHobbies.includes(hobby.label);
            return (
              <Button
                type="button"
                key={hobby.label}
                // onClick={() => toggleHobbySelection(hobby.label)}
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
        </div> */}
      </section>
    </form>
  );
};

export default AdminCreateAdForm;
