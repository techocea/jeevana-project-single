import Image from "next/image";
import React from "react";
import { Heart } from "lucide-react";
import CTA from "@/components/landing/call-to-action";
import { Card, CardContent } from "@/components/ui/card";
import { SERVICE_PROMISES } from "@/lib/constants";

const AboutPage = () => {
  return (
    <main className="w-full">
      <section className="py-28 px-6 bg-foreground">
        <div className="md:max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 flex flex-col gap-4 md:max-w-lg w-full">
            <span className="tagline">our philosophy</span>
            <h3 className="text-black capitalize italic">
              The Editorial Curator of Life Partnerships.
            </h3>
            <p className="text-justify">
              At Jeevana, we believe finding a soulmate isn't a game of
              algorithms, but a craft of intuition. We treat every profile as a
              story, and every match as a curated masterpiece.
            </p>
          </div>

          <div className="flex-2 flex relative max-w-sm w-full min-h-100 md:min-h-120">
            <Image
              src="/images/about-img-1.png"
              alt="Pricing"
              fill
              className="object-cover object-center rounded-3xl"
            />
            <Card className="absolute bottom-4 md:-left-16 -left-8 w-64 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent>
                <p className="text-sm leading-6 italic text-primary font-semibold font-newsreader">
                  True compatibility is found in the nuances that data cannot
                  measure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-28 px-6 bg-white">
        <div className="md:max-w-5xl mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-10">
          <div className="flex-1 flex flex-col gap-4 md:max-w-lg w-full">
            <span className="tagline">our heritage</span>
            <h3 className="text-black capitalize italic">
              Born from Tradition, Refined by Discretion.
            </h3>
            <p className="text-justify">
              Jeevana was founded on the principles of traditional matchmaking,
              where trust was the currency and reputation was everything. We
              have digitized this legacy without losing the human touch that
              makes a union eternal.
            </p>
            <div className="flex items-center justify-end gap-2">
              <hr className="w-20 h-1 bg-secondary" />{" "}
              <p className="uppercase text-secondary font-semibold">
                discover our roots
              </p>
            </div>
          </div>

          <div className="flex-2 flex relative max-w-lg w-full min-h-100 md:min-h-120">
            <Image
              src="/images/about-img-2.png"
              alt="Pricing"
              fill
              className="object-cover object-center rounded-3xl"
            />
          </div>
        </div>
      </section>

      <section className="py-28 px-6 lg:px-20 bg-foreground">
        <div className="flex flex-col items-center justify-center">
          <div className="md:max-w-2xl w-full mx-auto flex flex-col text-center gap-4">
            <h3 className="text-black capitalize">
              the manual curation process
            </h3>
            <p>
              Unlike modern platforms that rely on cold code, our curators spend
              hours understanding the aspirations of every member.
            </p>
          </div>

          <div className="w-full mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICE_PROMISES.map((promise) => (
              <Card
                key={promise.id}
                className={`flex flex-col gap-4 p-6 ${
                  promise.id === 2 ? "bg-primary text-secondary" : "bg-white"
                }`}
              >
                <CardContent className="p-0 flex flex-col">
                  <promise.icon className="h-8 w-8 text-secondary" />
                  <div className="flex flex-col gap-2 my-4">
                    <h4
                      className={`text-lg font-semibold ${
                        promise.id === 2 ? "text-secondary" : "text-accent"
                      }`}
                    >
                      {promise.title}
                    </h4>
                    <p
                      className={`text-sm ${
                        promise.id === 2 ? "text-secondary" : "text-accent"
                      }`}
                    >
                      {promise.description}
                    </p>
                  </div>
                  <p
                    className={`text-4xl ${
                      promise.id === 2 ? "text-secondary" : "text-accent"
                    } opacity-30 font-semibold`}
                  >
                    0{promise.id}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 px-6 lg:px-20 bg-white">
        <div className="flex flex-col items-center justify-center">
          <div className="md:max-w-2xl w-full mx-auto flex flex-col items-center text-center gap-4">
            <span>
              <Heart size={64} className="text-secondary" fill="currentColor" />
            </span>
            <h3 className="text-black capitalize my-4">
              "We don't just find partners;we curate the first chapter of your
              legacy"
            </h3>
            <hr className="w-40 h-1 bg-secondary" />
            <p className="text-center my-4">
              The Jeevana experience is designed for those who value quality
              over quantity. For those who understand that a life partner is the
              most important decision one ever makes. We are here to ensure it
              is a decision made with clarity, grace, and absolute confidence.
            </p>
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/images/profile-1.png"
                alt="About"
                width={64}
                height={64}
                className="object-cover object-center rounded-full"
              />
              <h4 className="text-lg font-semibold text-black">
                Shazmin & Hafsa
              </h4>
              <p>Founders</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-6 lg:p-20 bg-foreground">
        <CTA orientation="vertical" />
      </section>
    </main>
  );
};

export default AboutPage;
