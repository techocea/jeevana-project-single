import Link from "next/link";
import Image from "next/image";
import {
    ChevronDown,
    ArrowRight,
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import CTA from "@/components/landing/call-to-action";
import SearchMatch from "@/components/landing/search-match";
import TopProfiles from "@/components/landing/top-profiles";
import ExploreCommunities from "@/components/landing/explore-communities";
import {SIGN_UP_FEATURES, FAQS} from "@/lib/constants";
import {Badge} from "@/components/ui/badge";

export default function Home() {
    return (
        <main className="w-full">
            <section className="relative md:h-180 h-screen w-full flex flex-col items-center justify-center">
                <Image
                    src="/images/hero-bg.png"
                    alt="Elegant Sri Lankan bride dressed in traditional white Kandyan sari"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />
                {/* Dark overlay mask */}
                <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black z-10"/>

                {/* Hero Copywriting */}
                <div
                    className="relative -mt-24 lg:mt-16 z-20 w-full max-w-3xl px-6 flex flex-col items-center justify-center gap-6 text-center">
                    <Badge variant={"tagline"}>#1 THE EDITORIAL CURATOR OF UNION</Badge>
                    <h2 className="text-5xl">
                        Your Trusted Matrimony Platform for Community Matchmaking
                    </h2>
                </div>

                {/* Display community cards to click*/}
                <div className="max-w-5xl w-full mx-auto z-20">
                    <ExploreCommunities/>
                </div>

                <div className="mt-10 z-20 flex flex-col items-center justify-center">
                    <p className="uppercase text-sm text-muted-foreground font-medium tracking-widest">
                        scroll to explore
                    </p>
                    <ChevronDown
                        size={24}
                        className="animate-bounce text-muted-foreground"
                    />
                </div>
            </section>

            <section className="py-10 lg:py-20 flex items-center justify-center mx-auto w-full bg-white">
                <CTA orientation="horizontal"/>
            </section>

            <section className="py-10 px-6 lg:py-20 lg:px-0 bg-background">
                <div className="flex flex-col items-center justify-center md:max-w-5xl w-full mx-auto">
                    <div
                        className="flex items-center justify-center text-center md:text-left md:justify-between w-full">
                        <div className="flex flex-col gap-4">
                            <span className="tagline">featured selections</span>
                            <h3 className="text-black capitalize">top live profiles</h3>
                        </div>

                        <Link
                            href="/profiles"
                            className="hidden md:flex items-center gap-2 text-primary tracking-wider border-b border-primary uppercase"
                        >
                            View All Advertisements{" "}
                            <span>
                <ArrowRight/>
              </span>
                        </Link>
                    </div>

                    <TopProfiles/>

                    <Link
                        href="/profiles"
                        className="md:hidden flex items-center gap-2 text-primary tracking-wider border-b border-primary uppercase"
                    >
                        View All Advertisements{" "}
                        <span>
              <ArrowRight/>
            </span>
                    </Link>
                </div>
            </section>

            <section className="py-10 px-6 lg:py-20 lg:px-0 bg-black">
                <div className="flex flex-col items-center justify-center md:max-w-5xl w-full mx-auto">
                    <div className="flex flex-col text-center gap-4">
                        <span className="tagline">THE FABRIC OF SRI LANKA</span>
                        <h3 className="text-white capitalize">explore our communities</h3>
                    </div>

                    <ExploreCommunities/>
                </div>
            </section>

            <section className="py-10 px-6 lg:py-20 lg:px-0 bg-background">
                <div
                    className="flex flex-col md:flex-row items-center justify-center gap-10 md:max-w-5xl w-full mx-auto">
                    <div className="flex flex-col gap-2">
                        <span className="tagline">the journey</span>
                        <h3 className="text-black capitalize">
                            find your <span className="text-primary italic pr-2">special</span>{" "}
                            someone
                        </h3>
                        <p className="text-muted-foreground">
                            Our curated approach ensures that every connection is meaningful
                            and every conversation is respected.
                        </p>
                        <div className="flex flex-col gap-6 mt-6">
                            {SIGN_UP_FEATURES.map((feature) => (
                                <div key={feature.title} className="flex items-start gap-4">
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <feature.icon className="h-6 w-6"/>
                                    </div>
                                    <div>
                                        <h3 className="text-black font-medium text-lg capitalize">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative max-w-2xl w-full h-96 rounded-3xl overflow-hidden">
                        <Image
                            src="/images/pricing-img.png"
                            alt="Pricing illustration"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover object-center"
                        />
                    </div>
                </div>
            </section>

            <section className="py-10 px-6 lg:p-20 bg-white">
                <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col text-center gap-4">
                        <span className="tagline">inquiries</span>
                        <h3 className="text-black capitalize">curated questions</h3>
                    </div>

                    <div className="w-full max-w-3xl mt-10">
                        <Accordion type="single" collapsible>
                            {FAQS.map((item, idx) => (
                                <AccordionItem key={idx} value={`faq-${idx}`}>
                                    <AccordionTrigger>{item.question}</AccordionTrigger>
                                    <AccordionContent className="px-4 h-auto">
                                        <p className="text-sm">{item.answer}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>
        </main>
    );
}
