"use client";

import { useState } from "react";
import { authRegisterSchema, type AuthRegisterValues } from "@/lib/validation";
import { registerUser } from "@/app/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthRegisterValues>({
    resolver: zodResolver(authRegisterSchema as any),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AuthRegisterValues) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const result = await registerUser(data);
      if (result?.error) {
        setServerError(result.error);
        return;
      }
      if (result?.success) {
        if (result.emailVerificationRequired) {
          setSuccessMessage("Check your email inbox to confirm");
        } else {
          router.push("/onboarding");
          router.refresh();
        }
      }
    } catch (error) {
      setServerError("An unexpected error occurred during signup.");
    }
  };

  return (
    <div className="flex flex-col md:max-w-sm w-full">
      <div className="mb-6 flex flex-col items-start justify-center">
        <h3 className="text-2xl font-semibold text-black">Create an Account</h3>
        <p className="text-sm text-muted">
          Register with username, email and password.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="fullName"
            className="text-sm font-medium text-slate-700 uppercase"
          >
            Full Name
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-slate-700 uppercase"
          >
            Email
          </Label>
          <Input
            id="email"
            type="text"
            placeholder="john@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-slate-700 uppercase"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="********"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {serverError ? (
          <div className="p-3 text-sm bg-red-200 border-l-4 border-red-600 text-red-600">{serverError}</div>
        ) : null}
        {successMessage ? (
          <div className="p-3 text-sm bg-emerald-200 border-l-4 border-emerald-600 text-emerald-600">{successMessage}</div>
        ) : null}

        <Button
          type="submit"
          size="lg"
          variant="default"
          className="w-full uppercase rounded-xl px-6 py-3"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
