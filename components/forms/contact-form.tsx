"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createContactInquiry } from "@/app/actions/contact";
import { contactFormSchema, ContactFormValues } from "@/lib/validation";

const ContactForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      interest: "",
      message: "",
    },
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: ContactFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await createContactInquiry(data);
      setSuccessMessage("Your inquiry was sent successfully.");
      reset();
    } catch (error) {
      if (error instanceof Error && (error as any).validation) {
        const validation = (error as any).validation as Record<
          string,
          string[]
        >;
        const firstMessage = Object.values(validation)
          .flat()
          .filter(Boolean)[0];
        setServerError(firstMessage ?? error.message);
      } else if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Unable to send your inquiry. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white px-6 p-8 shadow-md"
    >
      <div className="space-y-6">
        <h3 className="text-3xl font-regular text-black">Send an Inquiry</h3>
        <div className="-mt-4">
          {serverError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          ) : null}
          {successMessage ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium text-slate-700"
              >
                Full name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                {...register("fullName")}
              />
              {errors.fullName && (
                <span className="text-sm text-red-600">
                  {errors.fullName.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-sm text-red-600">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="interest"
              className="text-sm font-medium text-slate-700"
            >
              Interest
            </Label>
            <Controller
              control={control}
              name="interest"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select interest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="membership">Membership</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.interest && (
              <span className="text-sm text-red-600">
                {errors.interest.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="message"
              className="text-sm font-medium text-slate-700"
            >
              Message
            </Label>
            <Textarea
              id="message"
              rows={5}
              placeholder="Write your message here"
              className="min-h-35 w-full"
              {...register("message")}
            />
            {errors.message && (
              <span className="text-sm text-red-600">
                {errors.message.message}
              </span>
            )}
          </div>
        </div>

        <Button
          size="lg"
          type="submit"
          className="w-full rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
