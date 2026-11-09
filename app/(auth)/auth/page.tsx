import Link from "next/link";
import {ArrowLeft, Lock, ShieldCheck} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ONBOARDING_HIGHLIGHTS} from "@/lib/constants";
import LoginForm from "@/components/forms/login-form";
import RegisterForm from "@/components/forms/register-form";
import PhoneAuthForm from "@/components/landing/phone-auth-form";

interface AuthPageProps {
    searchParams: Promise<{ mode?: string }>;
}

const AuthPage = async ({searchParams}: AuthPageProps) => {
    const params = await searchParams;
    const mode = params.mode === "login"
        ? "login"
        : params.mode === "phone-number"
            ? "phone-number"
            : "register";

    return (
        <div className="min-h-[calc(100vh-100px)] flex items-stretch justify-center bg-[#FAF8F5] py-6 px-4 sm:px-6">
            <div
                className="w-full max-w-4xl bg-white rounded-lg border border-[#E8E2D7] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
                <div
                    className="lg:col-span-5 bg-[#241F1A] text-[#FAF8F5] p-8 sm:p-10 hidden md:flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#3D352D]">
                    {/* Subtle gold geometry background pattern */}
                    <div
                        className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:16px_16px]"/>

                    <div className="relative z-10">
                        <h2 className="font-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#FAF8F5] leading-snug mb-3">
                            Dignified Matrimony Founded on Trust & Lineage
                        </h2>
                        <p className="text-xs text-[#B8AE9D] leading-relaxed">
                            Sri Lanka&apos;s trusted matrimonial registry for discerning families. Verified credentials,
                            protected personal contacts, and courteous service.
                        </p>
                    </div>

                    <div className="relative z-10 mt-8 pt-6 border-t border-[#3D352D] space-y-3">
                        <div className="flex items-start gap-2.5 text-xs text-[#D8D0C2]">
                            <ShieldCheck className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5"/>
                            <span>Strict identity and advertisement review by our professional staff before publication.</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-xs text-[#D8D0C2]">
                            <Lock className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5"/>
                            <span>Your phone, email, and NIC documents are never visible to the public.</span>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
                    {mode === "login" ? <LoginForm/> : <RegisterForm/>}

                    {/*  {mode === 'login' && (*/}
                    {/*//       <div>*/}
                    {/*//           <div className="mb-6">*/}
                    {/*//               <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1F1B18] tracking-tight">*/}
                    {/*//                   Sign in to Jeevana*/}
                    {/*//               </h1>*/}
                    {/*//               <p className="text-xs text-[#665D52] mt-1">*/}
                    {/*//                   Access your proposal portfolio, review requests, and pending invitations.*/}
                    {/*//               </p>*/}
                    {/*//           </div>*/}
                    {/*//*/}
                    {/*//           {errorMessage && (*/}
                    {/*//               <div className="mb-4 p-3 rounded-md bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#B91C1C] flex items-center gap-2">*/}
                    {/*//                   <AlertCircle className="w-4 h-4 shrink-0" />*/}
                    {/*//                   <span>{errorMessage}</span>*/}
                    {/*//               </div>*/}
                    {/*//           )}*/}
                    {/*//*/}
                    {/*//           <form onSubmit={handleLoginSubmit} className="space-y-4">*/}
                    {/*//               <div>*/}
                    {/*//                   <label className="block text-xs font-semibold text-[#2C2621] mb-1.5">*/}
                    {/*//                       Email Address or Profile ID*/}
                    {/*//                   </label>*/}
                    {/*//                   <input*/}
                    {/*//                       type="text"*/}
                    {/*//                       required*/}
                    {/*//                       value={email}*/}
                    {/*//                       onChange={(e) => setEmail(e.target.value)}*/}
                    {/*//                       placeholder="e.g. ananya.j@example.com or JV-84291"*/}
                    {/*//                       className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D6CDBC] rounded-md focus:border-[#8E6516] focus:ring-1 focus:ring-[#8E6516] outline-hidden text-[#1F1B18]"*/}
                    {/*//                   />*/}
                    {/*//               </div>*/}
                    {/*//*/}
                    {/*//               <div>*/}
                    {/*//                   <div className="flex items-center justify-between mb-1.5">*/}
                    {/*//                       <label className="text-xs font-semibold text-[#2C2621]">*/}
                    {/*//                           Password*/}
                    {/*//                       </label>*/}
                    {/*//                       <button*/}
                    {/*//                           type="button"*/}
                    {/*//                           onClick={() => setMode('forgot')}*/}
                    {/*//                           className="text-xs text-[#8E6516] hover:underline font-medium"*/}
                    {/*//                       >*/}
                    {/*//                           Forgot password?*/}
                    {/*//                       </button>*/}
                    {/*//                   </div>*/}
                    {/*//                   <div className="relative">*/}
                    {/*//                       <input*/}
                    {/*//                           type={showPassword ? 'text' : 'password'}*/}
                    {/*//                           required*/}
                    {/*//                           value={password}*/}
                    {/*//                           onChange={(e) => setPassword(e.target.value)}*/}
                    {/*//                           placeholder="Enter your password"*/}
                    {/*//                           className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D6CDBC] rounded-md focus:border-[#8E6516] focus:ring-1 focus:ring-[#8E6516] outline-hidden text-[#1F1B18] pr-10"*/}
                    {/*//                       />*/}
                    {/*//                       <button*/}
                    {/*//                           type="button"*/}
                    {/*//                           onClick={() => setShowPassword(!showPassword)}*/}
                    {/*//                           className="absolute right-3 top-2.5 text-[#7A7065] hover:text-[#1F1B18]"*/}
                    {/*//                           aria-label="Toggle password visibility"*/}
                    {/*//                       >*/}
                    {/*//                           {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}*/}
                    {/*//                       </button>*/}
                    {/*//                   </div>*/}
                    {/*//               </div>*/}
                    {/*//*/}
                    {/*//               <button*/}
                    {/*//                   type="submit"*/}
                    {/*//                   disabled={isLoading}*/}
                    {/*//                   className="w-full py-2.5 px-4 bg-[#8E6516] hover:bg-[#775310] text-white font-medium text-sm rounded-md transition-colors shadow-xs flex items-center justify-center gap-2"*/}
                    {/*//               >*/}
                    {/*//                   {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}*/}
                    {/*//                   <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>*/}
                    {/*//               </button>*/}
                    {/*//           </form>*/}
                    {/*//*/}
                    {/*//           /!* Demo Social Logins *!/*/}
                    {/*//           <div className="mt-6">*/}
                    {/*//               <div className="relative flex items-center justify-center my-4">*/}
                    {/*//                   <div className="border-t border-[#E8E2D7] w-full" />*/}
                    {/*//                   <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-[#8C8375] absolute">*/}
                    {/*//   or connect with*/}
                    {/*// </span>*/}
                    {/*//               </div>*/}
                    {/*//*/}
                    {/*//               <div className="grid grid-cols-2 gap-3">*/}
                    {/*//                   <button*/}
                    {/*//                       type="button"*/}
                    {/*//                       onClick={() => setErrorMessage('Google SSO is disabled in demo mode. Please use email/password.')}*/}
                    {/*//                       className="flex items-center justify-center gap-2 px-3 py-2 border border-[#D6CDBC] rounded-md text-xs font-medium text-[#554D45] hover:bg-[#F9F6F0] transition-colors"*/}
                    {/*//                   >*/}
                    {/*//                       <svg className="w-4 h-4" viewBox="0 0 24 24">*/}
                    {/*//                           <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>*/}
                    {/*//                           <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>*/}
                    {/*//                           <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>*/}
                    {/*//                           <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>*/}
                    {/*//                       </svg>*/}
                    {/*//                       <span>Google <span className="text-[10px] text-[#8C8375]">(Demo)</span></span>*/}
                    {/*//                   </button>*/}
                    {/*//*/}
                    {/*//                   <button*/}
                    {/*//                       type="button"*/}
                    {/*//                       onClick={() => setErrorMessage('Facebook login is disabled in demo mode.')}*/}
                    {/*//                       className="flex items-center justify-center gap-2 px-3 py-2 border border-[#D6CDBC] rounded-md text-xs font-medium text-[#554D45] hover:bg-[#F9F6F0] transition-colors"*/}
                    {/*//                   >*/}
                    {/*//                       <svg className="w-4 h-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">*/}
                    {/*//                           <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>*/}
                    {/*//                       </svg>*/}
                    {/*//                       <span>Facebook <span className="text-[10px] text-[#8C8375]">(Demo)</span></span>*/}
                    {/*//                   </button>*/}
                    {/*//               </div>*/}
                    {/*//           </div>*/}
                    {/*//*/}
                    {/*//           <div className="mt-6 text-center text-xs text-[#665D52]">*/}
                    {/*//               New to Jeevana?{' '}*/}
                    {/*//               <button*/}
                    {/*//                   type="button"*/}
                    {/*//                   onClick={() => setMode('register')}*/}
                    {/*//                   className="text-[#8E6516] font-semibold hover:underline"*/}
                    {/*//               >*/}
                    {/*//                   Create an account*/}
                    {/*//               </button>*/}
                    {/*//           </div>*/}
                    {/*//       </div>*/}
                    {/*  )}*/}


                    {/*  {mode === 'register' && (*/}
                    {/*  //     <div>*/}
                    {/*  //         <div className="mb-6">*/}
                    {/*  //             <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1F1B18] tracking-tight">*/}
                    {/*  //                 Register for Jeevana*/}
                    {/*  //             </h1>*/}
                    {/*  //             <p className="text-xs text-[#665D52] mt-1">*/}
                    {/*  //                 Begin your matrimonial journey with a protected profile.*/}
                    {/*  //             </p>*/}
                    {/*  //         </div>*/}
                    {/*  //*/}
                    {/*  //         {errorMessage && (*/}
                    {/*  //             <div className="mb-4 p-3 rounded-md bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#B91C1C] flex items-center gap-2">*/}
                    {/*  //                 <AlertCircle className="w-4 h-4 shrink-0" />*/}
                    {/*  //                 <span>{errorMessage}</span>*/}
                    {/*  //             </div>*/}
                    {/*  //         )}*/}
                    {/*  //*/}
                    {/*  //         <form onSubmit={handleRegisterSubmit} className="space-y-3.5">*/}
                    {/*  //             <div>*/}
                    {/*  //                 <label className="block text-xs font-semibold text-[#2C2621] mb-1">*/}
                    {/*  //                     Candidate's Full Name <span className="text-xs text-[#8C8375]">(Confidential)</span>*/}
                    {/*  //                 </label>*/}
                    {/*  //                 <input*/}
                    {/*  //                     type="text"*/}
                    {/*  //                     required*/}
                    {/*  //                     value={fullName}*/}
                    {/*  //                     onChange={(e) => setFullName(e.target.value)}*/}
                    {/*  //                     placeholder="e.g. Ananya Jayawardena"*/}
                    {/*  //                     className="w-full px-3.5 py-2 text-sm bg-white border border-[#D6CDBC] rounded-md focus:border-[#8E6516] focus:ring-1 focus:ring-[#8E6516] outline-hidden text-[#1F1B18]"*/}
                    {/*  //                 />*/}
                    {/*  //             </div>*/}
                    {/*  //*/}
                    {/*  //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">*/}
                    {/*  //                 <div>*/}
                    {/*  //                     <label className="block text-xs font-semibold text-[#2C2621] mb-1">*/}
                    {/*  //                         Email Address*/}
                    {/*  //                     </label>*/}
                    {/*  //                     <input*/}
                    {/*  //                         type="email"*/}
                    {/*  //                         required*/}
                    {/*  //                         value={email}*/}
                    {/*  //                         onChange={(e) => setEmail(e.target.value)}*/}
                    {/*  //                         placeholder="name@domain.com"*/}
                    {/*  //                         className="w-full px-3.5 py-2 text-sm bg-white border border-[#D6CDBC] rounded-md focus:border-[#8E6516] focus:ring-1 focus:ring-[#8E6516] outline-hidden text-[#1F1B18]"*/}
                    {/*  //                     />*/}
                    {/*  //                 </div>*/}
                    {/*  //*/}
                    {/*  //                 <div>*/}
                    {/*  //                     <label className="block text-xs font-semibold text-[#2C2621] mb-1">*/}
                    {/*  //                         Mobile Number <span className="text-xs text-[#8C8375]">(For OTP)</span>*/}
                    {/*  //                     </label>*/}
                    {/*  //                     <input*/}
                    {/*  //                         type="tel"*/}
                    {/*  //                         required*/}
                    {/*  //                         value={phoneNumber}*/}
                    {/*  //                         onChange={(e) => setPhoneNumber(e.target.value)}*/}
                    {/*  //                         placeholder="+94 77 123 4567"*/}
                    {/*  //                         className="w-full px-3.5 py-2 text-sm bg-white border border-[#D6CDBC] rounded-md focus:border-[#8E6516] focus:ring-1 focus:ring-[#8E6516] outline-hidden text-[#1F1B18]"*/}
                    {/*  //                     />*/}
                    {/*  //                 </div>*/}
                    {/*  //             </div>*/}
                    {/*  //*/}
                    {/*  //             <div>*/}
                    {/*  //                 <label className="block text-xs font-semibold text-[#2C2621] mb-1">*/}
                    {/*  //                     Create Password*/}
                    {/*  //                 </label>*/}
                    {/*  //                 <div className="relative">*/}
                    {/*  //                     <input*/}
                    {/*  //                         type={showPassword ? 'text' : 'password'}*/}
                    {/*  //                         required*/}
                    {/*  //                         value={password}*/}
                    {/*  //                         onChange={(e) => setPassword(e.target.value)}*/}
                    {/*  //                         placeholder="Minimum 8 characters"*/}
                    {/*  //                         className="w-full px-3.5 py-2 text-sm bg-white border border-[#D6CDBC] rounded-md focus:border-[#8E6516] focus:ring-1 focus:ring-[#8E6516] outline-hidden text-[#1F1B18] pr-10"*/}
                    {/*  //                     />*/}
                    {/*  //                     <button*/}
                    {/*  //                         type="button"*/}
                    {/*  //                         onClick={() => setShowPassword(!showPassword)}*/}
                    {/*  //                         className="absolute right-3 top-2 text-[#7A7065] hover:text-[#1F1B18]"*/}
                    {/*  //                     >*/}
                    {/*  //                         {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}*/}
                    {/*  //                     </button>*/}
                    {/*  //                 </div>*/}
                    {/*  //             </div>*/}
                    {/*  //*/}
                    {/*  //             /!* Terms acknowledgement checkbox *!/*/}
                    {/*  //             <div className="pt-1">*/}
                    {/*  //                 <label className="flex items-start gap-2.5 text-xs text-[#554D45] cursor-pointer">*/}
                    {/*  //                     <input*/}
                    {/*  //                         type="checkbox"*/}
                    {/*  //                         checked={agreedTerms}*/}
                    {/*  //                         onChange={(e) => setAgreedTerms(e.target.checked)}*/}
                    {/*  //                         className="mt-0.5 rounded border-[#D6CDBC] text-[#8E6516] focus:ring-[#8E6516]"*/}
                    {/*  //                     />*/}
                    {/*  //                     <span>*/}
                    {/*  //   I certify this proposal is created with family consent and agree to the{' '}*/}
                    {/*  //                         <span className="text-[#8E6516] underline">Terms of Service</span> and{' '}*/}
                    {/*  //                         <span className="text-[#8E6516] underline">Privacy Policy</span>.*/}
                    {/*  // </span>*/}
                    {/*  //                 </label>*/}
                    {/*  //             </div>*/}
                    {/*  //*/}
                    {/*  //             <button*/}
                    {/*  //                 type="submit"*/}
                    {/*  //                 disabled={isLoading}*/}
                    {/*  //                 className="w-full py-2.5 px-4 bg-[#8E6516] hover:bg-[#775310] text-white font-medium text-sm rounded-md transition-colors shadow-xs flex items-center justify-center gap-2 mt-2"*/}
                    {/*  //             >*/}
                    {/*  //                 {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}*/}
                    {/*  //                 <span>{isLoading ? 'Creating Account...' : 'Continue to Phone Verification'}</span>*/}
                    {/*  //             </button>*/}
                    {/*  //         </form>*/}
                    {/*  //*/}
                    {/*  //         <div className="mt-5 text-center text-xs text-[#665D52]">*/}
                    {/*  //             Already have an account?{' '}*/}
                    {/*  //             <button*/}
                    {/*  //                 type="button"*/}
                    {/*  //                 onClick={() => setMode('login')}*/}
                    {/*  //                 className="text-[#8E6516] font-semibold hover:underline"*/}
                    {/*  //             >*/}
                    {/*  //                 Sign in*/}
                    {/*  //             </button>*/}
                    {/*  //         </div>*/}
                    {/*  //     </div>*/}
                    {/*  )}*/}


                    {/*  {mode === 'forgot' && (*/}
                    {/*      // <div>*/}
                    {/*      //     <button*/}
                    {/*      //         type="button"*/}
                    {/*      //         onClick={() => setMode('login')}*/}
                    {/*      //         className="inline-flex items-center gap-1.5 text-xs text-[#665D52] hover:text-[#1F1B18] mb-4"*/}
                    {/*      //     >*/}
                    {/*      //         <ArrowLeft className="w-3.5 h-3.5" />*/}
                    {/*      //         <span>Back to sign in</span>*/}
                    {/*      //     </button>*/}
                    {/*      //*/}
                    {/*      //     <div className="mb-6">*/}
                    {/*      //         <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1F1B18] tracking-tight">*/}
                    {/*      //             Reset Password*/}
                    {/*      //         </h1>*/}
                    {/*      //         <p className="text-xs text-[#665D52] mt-1">*/}
                    {/*      //             Enter your registered email address to receive password reset instructions.*/}
                    {/*      //         </p>*/}
                    {/*      //     </div>*/}
                    {/*      //*/}
                    {/*      //     {successMessage ? (*/}
                    {/*      //         <div className="p-4 rounded-md bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#15803D] flex items-start gap-2.5">*/}
                    {/*      //             <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />*/}
                    {/*      //             <div>*/}
                    {/*      //                 <div className="font-semibold mb-1">Check your inbox</div>*/}
                    {/*      //                 <div>{successMessage}</div>*/}
                    {/*      //             </div>*/}
                    {/*      //         </div>*/}
                    {/*      //     ) : (*/}
                    {/*      //         <form onSubmit={handleForgotSubmit} className="space-y-4">*/}
                    {/*      //             <div>*/}
                    {/*      //                 <label className="block text-xs font-semibold text-[#2C2621] mb-1.5">*/}
                    {/*      //                     Registered Email Address*/}
                    {/*      //                 </label>*/}
                    {/*      //                 <input*/}
                    {/*      //                     type="email"*/}
                    {/*      //                     required*/}
                    {/*      //                     value={email}*/}
                    {/*      //                     onChange={(e) => setEmail(e.target.value)}*/}
                    {/*      //                     placeholder="name@domain.com"*/}
                    {/*      //                     className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D6CDBC] rounded-md focus:border-[#8E6516] focus:ring-1 focus:ring-[#8E6516] outline-hidden text-[#1F1B18]"*/}
                    {/*      //                 />*/}
                    {/*      //             </div>*/}
                    {/*      //*/}
                    {/*      //             <button*/}
                    {/*      //                 type="submit"*/}
                    {/*      //                 disabled={isLoading}*/}
                    {/*      //                 className="w-full py-2.5 px-4 bg-[#8E6516] hover:bg-[#775310] text-white font-medium text-sm rounded-md transition-colors shadow-xs flex items-center justify-center gap-2"*/}
                    {/*      //             >*/}
                    {/*      //                 {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}*/}
                    {/*      //                 <span>{isLoading ? 'Sending...' : 'Send Reset Link'}</span>*/}
                    {/*      //             </button>*/}
                    {/*      //         </form>*/}
                    {/*      //     )}*/}
                    {/*      // </div>*/}
                    {/*  )}*/}


                    {/*  {mode === 'otp' && (*/}
                    {/*//       <div>*/}
                    {/*//           <div className="mb-6">*/}
                    {/*//               <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#F6EFE2] text-[#8E6516] mb-2">*/}
                    {/*//                   <Phone className="w-3 h-3" />*/}
                    {/*//                   <span>Security Verification Step</span>*/}
                    {/*//               </div>*/}
                    {/*//               <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1F1B18] tracking-tight">*/}
                    {/*//                   Verify Your Phone Number*/}
                    {/*//               </h1>*/}
                    {/*//               <p className="text-xs text-[#665D52] mt-1">*/}
                    {/*//                   We sent a 6-digit verification code to <strong className="text-[#1F1B18]">{phoneNumber}</strong>.*/}
                    {/*//               </p>*/}
                    {/*//               <div className="mt-1 text-[11px] text-[#8C8375]">*/}
                    {/*//                   (Prototype note: Enter <span className="font-mono font-bold text-[#8E6516]">123456</span> to test verification. Real SMS delivery is not claimed.)*/}
                    {/*//               </div>*/}
                    {/*//           </div>*/}
                    {/*//*/}
                    {/*//           {errorMessage && (*/}
                    {/*//               <div className="mb-4 p-3 rounded-md bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#B91C1C] flex items-center gap-2">*/}
                    {/*//                   <AlertCircle className="w-4 h-4 shrink-0" />*/}
                    {/*//                   <span>{errorMessage}</span>*/}
                    {/*//               </div>*/}
                    {/*//           )}*/}
                    {/*//*/}
                    {/*//           {otpStatus === 'success' && (*/}
                    {/*//               <div className="mb-4 p-3 rounded-md bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#15803D] flex items-center gap-2">*/}
                    {/*//                   <CheckCircle2 className="w-4 h-4 shrink-0" />*/}
                    {/*//                   <span>Phone verified successfully! Redirecting to Onboarding Wizard...</span>*/}
                    {/*//               </div>*/}
                    {/*//           )}*/}
                    {/*//*/}
                    {/*//           <div className="space-y-5">*/}
                    {/*//               /!* 6 Digit Inputs *!/*/}
                    {/*//               <div>*/}
                    {/*//                   <label className="block text-xs font-semibold text-[#2C2621] mb-2 text-center">*/}
                    {/*//                       Enter 6-Digit Code (Supports Paste)*/}
                    {/*//                   </label>*/}
                    {/*//                   <div className="flex items-center justify-center gap-2 sm:gap-3">*/}
                    {/*//                       {otpDigits.map((digit, idx) => (*/}
                    {/*//                           <input*/}
                    {/*//                               key={idx}*/}
                    {/*//                               id={`otp-input-${idx}`}*/}
                    {/*//                               type="text"*/}
                    {/*//                               maxLength={1}*/}
                    {/*//                               value={digit}*/}
                    {/*//                               onChange={(e) => handleOtpInput(idx, e.target.value)}*/}
                    {/*//                               onKeyDown={(e) => handleOtpKeyDown(idx, e)}*/}
                    {/*//                               className="w-10 h-12 sm:w-12 sm:h-12 text-center text-lg font-mono font-semibold bg-white border border-[#D6CDBC] rounded-md focus:border-[#8E6516] focus:ring-1 focus:ring-[#8E6516] outline-hidden text-[#1F1B18]"*/}
                    {/*//                           />*/}
                    {/*//                       ))}*/}
                    {/*//                   </div>*/}
                    {/*//               </div>*/}
                    {/*//*/}
                    {/*//               <div className="flex items-center justify-between text-xs text-[#665D52] pt-2">*/}
                    {/*//                   <button*/}
                    {/*//                       type="button"*/}
                    {/*//                       onClick={() => {*/}
                    {/*//                           setMode('register');*/}
                    {/*//                       }}*/}
                    {/*//                       className="text-[#8E6516] hover:underline"*/}
                    {/*//                   >*/}
                    {/*//                       Change phone number*/}
                    {/*//                   </button>*/}
                    {/*//*/}
                    {/*//                   <div>*/}
                    {/*//                       {resendCountdown > 0 ? (*/}
                    {/*//                           <span className="text-[#8C8375]">Resend code in {resendCountdown}s</span>*/}
                    {/*//                       ) : (*/}
                    {/*//                           <button*/}
                    {/*//                               type="button"*/}
                    {/*//                               onClick={() => {*/}
                    {/*//                                   setResendCountdown(45);*/}
                    {/*//                                   setErrorMessage('');*/}
                    {/*//                               }}*/}
                    {/*//                               className="text-[#8E6516] font-medium hover:underline"*/}
                    {/*//                           >*/}
                    {/*//                               Resend code*/}
                    {/*//                           </button>*/}
                    {/*//                       )}*/}
                    {/*//                   </div>*/}
                    {/*//               </div>*/}
                    {/*//*/}
                    {/*//               <button*/}
                    {/*//                   type="button"*/}
                    {/*//                   onClick={handleVerifyOtp}*/}
                    {/*//                   disabled={otpStatus === 'checking' || otpStatus === 'success'}*/}
                    {/*//                   className="w-full py-2.5 px-4 bg-[#8E6516] hover:bg-[#775310] text-white font-medium text-sm rounded-md transition-colors shadow-xs flex items-center justify-center gap-2"*/}
                    {/*//               >*/}
                    {/*//                   {otpStatus === 'checking' && <RefreshCw className="w-4 h-4 animate-spin" />}*/}
                    {/*//                   <span>*/}
                    {/*//   {otpStatus === 'checking'*/}
                    {/*//       ? 'Checking Code...'*/}
                    {/*//       : otpStatus === 'success'*/}
                    {/*//           ? 'Verified!'*/}
                    {/*//           : 'Confirm & Continue'}*/}
                    {/*// </span>*/}
                    {/*//               </button>*/}
                    {/*//           </div>*/}
                    {/*//       </div>*/}
                    {/*  )}*/}

                </div>
            </div>
        </div>
    );
};

export default AuthPage;
