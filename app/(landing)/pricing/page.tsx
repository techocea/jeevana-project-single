"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {CircleCheck, CircleX, Loader2} from "lucide-react";
import { PRICING_FEATURES} from "@/lib/constants";
import toast from "react-hot-toast";
import {PRICING_PACKAGES} from "@/lib/pricing-packages";

const PricingPage = () => {
    const router = useRouter();
    const [loadingPackageId, setLoadingPackageId] = useState<number | null>(null);

    const handleSelectPackage = async (packageId: number) => {
        setLoadingPackageId(packageId);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({packageId}),
            });

            if (res.status === 401) {
                toast.error("Please log in to purchase a plan.");
                router.push(`/auth?mode=login&redirect=/pricing`);
                return;
            }

            const data = await res.json();

            if (!res.ok || !data.url) {
                toast.error(data.error || "Couldn't start checkout. Please try again.");
                return;
            }

            // eslint-disable-next-line react-hooks/immutability
            window.location.href = data.url;
        } catch (error) {
            toast.error("Something went wrong starting checkout.");
            console.error("[CHECKOUT_SUBMIT_ERROR]:", error);
            setLoadingPackageId(null);
        }
    };

    return (
        <main className="w-full bg-white">
            <section className="mt-12 py-10 px-6 lg:py-20 lg:px-0">
                <div className="md:max-w-5xl w-full mx-auto flex flex-col items-center justify-center">
                    <div className="md:max-w-2xl w-full mx-auto flex flex-col text-center gap-2">
                        <h3 className="text-black capitalize">find your soulmate</h3>
                        <p className="text-muted-foreground">
                            Curated connections and heritage-first matchmaking, tailored to
                            the legacy you wish to build together.
                        </p>
                    </div>

                    <div className="w-full mt-12 grid grid-cols-1 sm:grid-cols-2 gap-12">
                        {PRICING_PACKAGES.map((pkg) => (
                            <Card
                                key={pkg.id}
                                className={`relative overflow-visible shadow-lg flex flex-col p-6 ${pkg.id === 2
                                    ? "bg-primary text-black md:scale-105"
                                    : "bg-background"
                                }`}
                            >
                                {pkg.id === 2 ? (
                                    <div
                                        className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-white shadow-sm uppercase">
                                        Most Popular
                                    </div>
                                ) : null}
                                <CardHeader className="flex flex-col gap-3 p-0">
                                    <div className="flex flex-col gap-2">
                                        <CardTitle className="text-lg font-regular font-newsreader">
                                            {pkg.name}
                                        </CardTitle>
                                        <CardDescription
                                            className={`${pkg.id === 2 ? "text-black" : "text-muted"}`}
                                        >
                                            {pkg.description}
                                        </CardDescription>
                                    </div>
                                    <h3 className="text-4xl font-bold mt-2">
                                        {pkg.price}
                                        <span className="text-sm font-normal">/month</span>
                                    </h3>
                                </CardHeader>

                                <CardContent className="flex-1 flex flex-col px-0">
                                    <ul className="space-y-2 mb-6">
                                        {pkg.inclusions.map((inc, idx) => {
                                            const isFirstCardLastItem =
                                                pkg.id === 1 && idx === pkg.inclusions.length - 1;

                                            return (
                                                <li
                                                    key={idx}
                                                    className={`text-sm flex items-center gap-2 ${isFirstCardLastItem
                                                        ? "text-muted-foreground/70"
                                                        : ""
                                                    }`}
                                                >
                          <span>
                            {isFirstCardLastItem ? (
                                <CircleX
                                    size={18}
                                    className="text-muted-foreground"
                                />
                            ) : (
                                <CircleCheck
                                    size={18}
                                    className="text-secondary"
                                />
                            )}
                          </span>
                                                    {inc}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </CardContent>

                                <CardFooter className="flex flex-col px-0">
                                    <Button
                                        size="lg"
                                        variant={pkg.id === 2 ? "secondary" : "ghost"}
                                        className="w-full"
                                        disabled={loadingPackageId !== null}
                                        onClick={() => handleSelectPackage(pkg.id)}
                                    >
                                        {loadingPackageId === pkg.id ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Redirecting...
                                            </>
                                        ) : (
                                            `Select ${pkg.name}`
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-10 px-6 lg:py-20 lg:px-0">
                <div
                    className="md:max-w-5xl mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-10">
                    <div className="flex-1 flex flex-col gap-4 md:max-w-lg w-full">
                        <span className="tagline">invest in forever</span>
                        <h3 className="text-black capitalize italic">
                            Every union begins with an intentional step.
                        </h3>
                        <p className="text-justify text-base text-muted-foreground">
                            At Jeevana, we believe that premium matchmaking is about more than
                            just data. It’s about understanding the nuances of lifestyle,
                            values, and vision. Our plans are designed to give you the degree
                            of control and curation you deserve.
                        </p>
                        <div className="w-full mt-4 grid grid-cols-1 gap-4">
                            {PRICING_FEATURES.map((feature) => (
                                <div
                                    key={feature.id}
                                    className="flex items-start gap-4 "
                                >
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <feature.icon className="h-6 w-6"/>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-black font-medium text-lg capitalize">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm md:text-base text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-2 flex relative max-w-lg w-full min-h-100 md:min-h-120">
                        <div
                            className="absolute inset-0 bg-linear-to-t from-black to-black/20 rounded-3xl opacity-50"></div>
                        <Image
                            src="/images/pricing-img.png"
                            alt="Jeevana pricing and membership illustration"
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover object-center rounded-3xl"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PricingPage;
