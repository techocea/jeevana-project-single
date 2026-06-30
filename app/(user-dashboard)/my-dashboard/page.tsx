import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getCurrentUserProfile } from "@/app/actions/profile-actions";
import {
  Accessibility,
  BookOpen,
  Briefcase,
  CalendarDays,
  CheckCircle,
  Coffee,
  DollarSign,
  Flame,
  Flag,
  Globe2,
  Venus,
  Mars,
  Home,
  Layers,
  Mail,
  Phone,
  Ruler,
  Scale,
  Sparkles,
  Shuffle,
  ShieldCheck,
  User,
  MapPin,
} from "lucide-react";
import { JSX } from "react";

const profileAttribute = (icon: JSX.Element, label: string, value: string) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase text-muted">{label}</p>
        <p className="mt-0 text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  </div>
);

export default async function Page() {
  const result = await getCurrentUserProfile();

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-lg rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">
            Profile unavailable
          </h2>
          <p className="mt-4 text-slate-600">
            We could not locate your profile. Please complete your onboarding or
            try again later.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/onboarding">
              <Button className="w-full sm:w-auto">Complete profile</Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" className="w-full sm:w-auto">
                Browse matches
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const profile = result.data;
  const profileImage = profile.profilePic || "/images/demo-profile-pic.png";
  const profileLocation = [profile.city, profile.state, profile.country]
    .filter(Boolean)
    .join(", ");
  const hobbies = Array.isArray(profile.hobbies)
    ? profile.hobbies.join(", ")
    : profile.hobbies || "Not specified";
  const genderIcon =
    profile.gender === "female" ? <Venus size={18} /> : <Mars size={18} />;

  return (
    <main className="min-h-screen bg-linear-to-br from-transparent to-primary/45 px-4 lg:px-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <section className="relative overflow-hidden rounded-bl-xl rounded-br-xl bg-slate-950/70 p-6 text-white shadow-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl"
            style={{ backgroundImage: `url(${profileImage})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/20 to-transparent" />

          <div className="relative flex flex-col items-center gap-4 text-center">
            <div className="relative rounded-full border-4 border-white/90 bg-white/20 p-1 shadow-2xl">
              <div className="overflow-hidden rounded-full bg-slate-100">
                <Image
                  src={profileImage}
                  alt={profile.fullName || "Profile image"}
                  width={180}
                  height={180}
                  className="h-44 w-44 object-cover"
                  priority
                />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-white">
                {profile.fullName}
              </h1>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
                {profile.profession || "Profession not specified"}
              </p>
            </div>
            <div className="grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {profileAttribute(
                <CalendarDays size={16} />,
                "Age",
                profile.age != null ? String(profile.age) : "-",
              )}
              {profileAttribute(
                <Ruler size={16} />,
                "Height",
                profile.height ? `${profile.height} cm` : "-",
              )}
              {profileAttribute(
                <Briefcase size={16} />,
                "Profession",
                profile.profession || "-",
              )}
              {profileAttribute(
                <MapPin size={16} />,
                "Location",
                profile.city || "Not set",
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 text-slate-950">
            <User size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Basic Info</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {profileAttribute(
              <User size={16} />,
              "Created by",
              profile.createdBy || "Not specified",
            )}
            {profileAttribute(
              <Mail size={16} />,
              "Email",
              profile.secondaryEmail || "Not provided",
            )}
            {profileAttribute(
              <Phone size={16} />,
              "Contact",
              profile.contact || "Not provided",
            )}
            {profileAttribute(
              genderIcon,
              "Gender",
              profile.gender || "Not specified",
            )}
            {profileAttribute(
              <CalendarDays size={16} />,
              "DOB",
              profile.dob
                ? new Date(profile.dob).toLocaleDateString()
                : "Not specified",
            )}
            {profileAttribute(
              <CheckCircle size={16} />,
              "Status",
              profile.status || "pending",
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 text-slate-950">
            <Sparkles size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Religion</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {profileAttribute(
              <Sparkles size={16} />,
              "Religion",
              profile.religion || "Not specified",
            )}
            {profileAttribute(
              <Layers size={16} />,
              "Caste",
              profile.caste || "Not specified",
            )}
            {profileAttribute(
              <BookOpen size={16} />,
              "Mother tongue",
              profile.motherTongue || "Not specified",
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 text-slate-950">
            <Briefcase size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Career</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {profileAttribute(
              <BookOpen size={16} />,
              "Education",
              profile.educationLevel || "Not specified",
            )}
            {profileAttribute(
              <Briefcase size={16} />,
              "Profession",
              profile.profession || "Not specified",
            )}
            {profileAttribute(
              <DollarSign size={16} />,
              "Income range",
              profile.annualIncomeRange || "Not specified",
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 text-slate-950">
            <Globe2 size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Location</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {profileAttribute(
              <Globe2 size={16} />,
              "Country",
              profile.country || "Not specified",
            )}
            {profileAttribute(
              <Flag size={16} />,
              "State",
              profile.state || "Not specified",
            )}
            {profileAttribute(
              <Home size={16} />,
              "City",
              profile.city || "Not specified",
            )}
            {profileAttribute(
              <ShieldCheck size={16} />,
              "Residency",
              profile.residencyStatus || "Not specified",
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 text-slate-950">
            <Accessibility size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Personal</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {profileAttribute(
              <Ruler size={16} />,
              "Height",
              profile.height ? `${profile.height} cm` : "Not specified",
            )}
            {profileAttribute(
              <Scale size={16} />,
              "Weight",
              profile.weight ? `${profile.weight} kg` : "Not specified",
            )}
            {profileAttribute(
              <CalendarDays size={16} />,
              "Age",
              profile.age != null ? String(profile.age) : "Not specified",
            )}
            {profileAttribute(
              <Flame size={16} />,
              "Smoking",
              profile.smoking || "Not specified",
            )}
            {profileAttribute(
              <Coffee size={16} />,
              "Drinking",
              profile.drinking || "Not specified",
            )}
            {profileAttribute(
              <BookOpen size={16} />,
              "Diet",
              profile.foodPreferences || "Not specified",
            )}
            {profileAttribute(
              <Accessibility size={16} />,
              "Differently abled",
              profile.isDifferentlyAbled ? "Yes" : "No",
            )}
          </div>
          {profile.isDifferentlyAbled && (
            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">
                Accessibility details
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {profile.differentlyAbledDetails ||
                  "No additional details provided."}
              </p>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 text-slate-950">
            <Shuffle size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Final details</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {profileAttribute(<Sparkles size={16} />, "Hobbies", hobbies)}
            {profileAttribute(
              <Mail size={16} />,
              "Secondary email",
              profile.secondaryEmail || "Not provided",
            )}
            {profileAttribute(
              <Shuffle size={16} />,
              "Mail routing",
              profile.mailRoutingTarget || "Not specified",
            )}
            {profileAttribute(
              <CheckCircle size={16} />,
              "Status",
              profile.status || "pending",
            )}
          </div>
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">
              Narrative
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {profile.narrative || "No additional narrative provided yet."}
            </p>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-background/95 px-4 py-4 backdrop-blur-xl shadow-xl sm:px-10">
        <div className="w-full flex items-center justify-center gap-3 md:ml-24">
          <Link href="/onboarding" className="w-fit">
            <Button className="w-full">Edit profile</Button>
          </Link>
          <Link href="/search" className="w-fit">
            <Button variant="outline" className="w-full">
              View matched profiles
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-24" />
    </main>
  );
}
