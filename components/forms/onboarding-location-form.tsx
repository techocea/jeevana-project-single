import { z } from "zod";
import {
  Select,
  SelectContent,
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
import { Controller, useForm } from "react-hook-form";
import { LocationNode, StepFourInitialData } from "@/types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Map } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { OnboardingFormValues, stepFourLocationSchema } from "@/lib/validation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LK_DATA } from "@/lib/constants";
import Image from "next/image";

type StepFourValues = z.infer<typeof stepFourLocationSchema>;

interface StepFourProps {
  onPrev?: () => void;
  onNext?: (data: StepFourValues) => void;
  initialData: StepFourInitialData["initialData"];
  variant?: "onboarding" | "editing" | "admin";
}

const LocationInformation = ({
  onNext,
  onPrev,
  initialData,
  variant = "onboarding",
}: StepFourProps) => {
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(stepFourLocationSchema as any),
    defaultValues: {
      country: initialData?.country || "",
      state: initialData?.state || "",
      city: initialData?.city || "",
      residencyStatus: initialData?.residencyStatus || undefined,
    },
  });

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
      const localTowns = LK_DATA[selectedState] || [];
      setCities(localTowns.map((town) => ({ value: town })));
      return;
    }

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

  return (
    <div
      className={
        variant === "editing" || variant === "admin"
          ? "w-full"
          : "flex flex-col md:flex-row gap-10"
      }
    >
      {variant === "onboarding" ? (
        <div className="flex items-center justify-center w-full">
          <div className="overflow-hidden rounded-md flex flex-col items-center justify-center max-w-full w-full min-h-96 h-full relative">
            <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black z-10" />
            <Image
              src="/images/step-3-img.png"
              alt=""
              fill
              priority
              className="object-cover"
            />

            <p className="absolute bottom-10 left-4 z-20 right-4 text-lg italic text-white font-newsreader">
              "Success is most meaningful when shared with someone who
              understands your journey."
            </p>
          </div>
        </div>
      ) : null}

      <div className="w-full">
        {variant === "onboarding" || variant === "editing" ? (
          <div
            className={`grid grid-cols-1 gap-6 ${variant === "editing" ? "md:grid-cols-2" : ""
              }`}
          >
            <div className="md:col-span-1 col-span-2 space-y-3">
              <Label
                htmlFor="country"
                className="text-sm font-medium text-slate-700 uppercase"
              >
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
                      setValue("state", "");
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
              {errors.country && (
                <p className="text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>

            <div className="md:col-span-1 col-span-2 space-y-3">
              <Label
                htmlFor="state"
                className="text-sm font-medium text-slate-700 uppercase"
              >
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
              {errors.state && (
                <p className="text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>

            <div className="md:col-span-1 col-span-2 space-y-3">
              <Label
                htmlFor="city"
                className="text-sm font-medium text-slate-700 uppercase"
              >
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
                          loadingCities
                            ? "Mapping town layout..."
                            : "Select City"
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
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div className="md:col-span-1 col-span-2 space-y-3">
              <Label
                htmlFor="residencyStatus"
                className="text-sm font-medium text-slate-700 uppercase"
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
              {errors.residencyStatus && (
                <p className="text-sm text-red-600">
                  {errors.residencyStatus.message}
                </p>
              )}
            </div>
          </div>
        ) : (
          <section className="bg-white border border-muted-foreground/50 rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-muted-foreground  pb-2">
              <Map size={26} className="text-secondary" />
              <h4 className="text-black font-newsreader text-xl">Location</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1 col-span-2 space-y-1">
                <Label
                  htmlFor="country"
                  className="text-sm font-medium text-muted"
                >
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
                <Label
                  htmlFor="state"
                  className="text-sm font-medium text-muted"
                >
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
                <Label
                  htmlFor="city"
                  className="text-sm font-medium text-muted"
                >
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
                            loadingCities
                              ? "Mapping town layout..."
                              : "Select City"
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
        )}

        <div className="justify-end flex w-full col-span-2 mt-4">
          {variant === "onboarding" && onNext ? (
            <>
              {onPrev && (
                <Button
                  type="button"
                  size="lg"
                  variant="link"
                  className="w-fit uppercase rounded-xl py-3 pr-5 -ml-3"
                  onClick={onPrev}
                >
                  Back
                </Button>
              )}

              <Button
                size="lg"
                type="button"
                variant="secondary"
                onClick={handleSubmit(onNext)}
                disabled={isSubmitting}
              >
                Next Step <ArrowRight />
              </Button>
            </>
          ) : (
            variant === "editing" &&
            onNext && (
              <Button
                size="lg"
                type="button"
                variant="default"
                onClick={handleSubmit(onNext)}
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationInformation;
