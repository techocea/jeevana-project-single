import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight, Phone } from "lucide-react";

interface Orientation {
  orientation: "horizontal" | "vertical";
}

const CTA = ({ orientation }: Orientation) => {
  return orientation === "horizontal" ? (
    <Card className="md:max-w-5xl w-full lg:rounded-[3rem] bg-black rounded-3xl p-10 lg:p-16 flex items-center justify-center relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 top-24 h-96 w-120 -translate-y-1/2 rounded-full bg-linear-to-r from-primary/20 to-transparent blur-3xl" />
      <CardContent className="flex flex-col lg:flex-row items-center text-center lg:text-left lg:justify-between ">
        <div className="lg:flex-2 flex flex-col">
          <h3 className="text-white">
            The Finest Way to Present{" "}
            <span className="text-primary italic">Your Narrative.</span>
          </h3>
          <p className="my-4">
            Jeevana.lk is not just a portal; it is an editorial platform. We
            craft profiles into compelling stories that resonate with discerning
            families.
          </p>
        </div>
        <div className="lg:flex-1 flex items-center justify-center">
          <Button className="uppercase p-6">
            post advertisement{" "}
            <span>
              <ArrowRight size={18} />
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card className="md:max-w-5xl w-full lg:rounded-[3rem] bg-black rounded-3xl p-10 lg:p-16 flex items-center justify-center relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2  top-0 h-96 w-200 -translate-x-1/2 rounded-full bg-linear-to-r from-primary/20 to-transparent blur-3xl" />
      <CardContent className="flex flex-col items-center text-center justify-center gap-4">
        <h3 className="text-white">Begin Your Curated Journey</h3>
        <p className="md:max-w-lg w-full">
          Discover meaningful connections with families who share your values.
          Browse curated profiles and find your perfect match today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 max-w-xs sm:w-full w-full">
          <Button className="uppercase p-6 w-full md:w-fit">
            create a profile{" "}
            <span>
              <ArrowRight size={18} />
            </span>
          </Button>
          <Button className="uppercase p-6 w-full md:w-fit" variant="outline">
            talk to us
            <span>
              <Phone size={18} />
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CTA;
