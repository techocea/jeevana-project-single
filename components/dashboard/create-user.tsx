"use client";

import { useState } from "react";
import {
    createUserByAdminSchema,
    type CreateUserByAdminValues,
} from "@/lib/validation";
import { createUserByAdmin } from "@/app/actions/auth-actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Eye, EyeClosed, Plus} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const CreateUser = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateUserByAdminValues>({
        resolver: zodResolver(createUserByAdminSchema as any),
        defaultValues: {
            fullName: "",
            email: "",
            role: "user",
            password: "",
        },
    });

    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
    }

        const onSubmit = async (data: CreateUserByAdminValues) => {
            setServerError(null);
            setSuccessMessage(null);

            try {
                const result = await createUserByAdmin(data);
                if (result?.error) {
                    setServerError(result.error);
                    return;
                }
                if (result?.success) {
                    reset();
                    router.refresh();
                }
            } catch (error) {
                setServerError("An unexpected error occurred during signup.");
                console.log("ERROR:", error);
            }
        };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"lg"} variant="secondary">
                    <Plus /> Create User
                </Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="sm:max-w-sm">
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Create an User</DialogTitle>
                        <DialogDescription>
                            Register a new user account with their name, email, and initial
                            password.
                        </DialogDescription>
                    </DialogHeader>

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
                        <div className="relative w-full">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                className="pr-10"
                                placeholder="********"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleTogglePassword}
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-fit w-fit p-1 bg-transparent hover:bg-transparent"
                            >
                                {!showPassword ? <EyeClosed className="text-muted-foreground"/> :
                                    <Eye className="text-muted-foreground"/>}
                            </Button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    {serverError ? (
                        <div className="p-3 text-sm bg-red-200 border-l-4 border-red-600 text-red-600">
                            {serverError}
                        </div>
                    ) : null}
                    {successMessage ? (
                        <div className="p-3 text-sm bg-emerald-200 border-l-4 border-emerald-600 text-emerald-600">
                            {successMessage}
                        </div>
                    ) : null}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" variant="secondary" disabled={isSubmitting}>
                            {isSubmitting ? "Registering..." : "Register"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateUser;
