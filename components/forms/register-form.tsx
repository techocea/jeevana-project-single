"use client";

import { useState } from "react";
import { authRegisterSchema, type AuthRegisterValues } from "@/lib/validation";
import { registerUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
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
      } else {
        setSuccessMessage("Account created successfully. Please log in.");
        reset();
      }
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Unable to register. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col md:max-w-sm w-full">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-black">
            Create an Account
          </h3>
          <p className="mt-2 text-sm text-muted">
            Register with username, email and password.
          </p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label
            htmlFor="email"
            className="text-sm font-medium text-slate-700 uppercase mb-2"
          >
            Email
          </Label>
          <Input
            id="email"
            type="text"
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="password"
            className="text-sm font-medium text-slate-700 uppercase mb-2"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {serverError ? (
          <p className="text-sm text-red-600">{serverError}</p>
        ) : null}
        {successMessage ? (
          <p className="text-sm text-emerald-600">{successMessage}</p>
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
