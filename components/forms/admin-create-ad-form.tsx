"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Controller, useFormContext } from "react-hook-form";
import {
  ArrowRight,
  ShieldCogCorner,
} from "lucide-react";
import BasicInformation from "./onboarding-basic-form";
import { InitialProfileData } from "@/types";
import { Button } from "../ui/button";
import ReligionInformation from "./onboarding-religion-form";
import AchievementsForm from "./onboarding-achievements-form";
import LocationInformation from "./onboarding-location-form";
import PersonalInformation from "./onboarding-personal-form";
import HobbiesSelector from "./onboarding-hobbies-form";
import PartnerPreferences from "./partner-preferences-form";

const AdminCreateAdForm = () => {
  const {
    watch,
    control,
    formState: { isSubmitting, isDirty },
  } = useFormContext<InitialProfileData>();

  const mailRoutingTarget = watch("mailRoutingTarget");
  const showSecondaryEmail =
    mailRoutingTarget === "candidate" || mailRoutingTarget === "both";

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
      {/* SECTION 1: Basic Details */}
      <BasicInformation variant="admin" />

      {/* SECTION 2: Religion */}
      <ReligionInformation variant="admin" />

      {/* SECTION 3: Location */}
      <LocationInformation variant="admin" />

      {/* SECTION 4: Career */}
      <AchievementsForm variant="admin" />

      {/* SECTION 5: Personal Info */}
      <PersonalInformation variant="admin" />

      {/* SECTION 6: Hobbies */}
      <HobbiesSelector variant="admin" />

      {/* SECTION 7: Partner Preferences */}
      <PartnerPreferences variant="admin" />

      {/* SECTION 7: Admin Overrides */}
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
