// import React , { useState } from "react";
// import useAuthUser from "../hooks/useAuthUser";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import {toast } from "react-hot-toast";
// import { completeOnboarding } from "../lib/api";
// import {
//   CameraIcon,
//   LoaderIcon,
//   MapPinIcon,
//   ShipWheelIcon,    
//   ShuffleIcon,
// } from "lucide-react";
// import { LANGUAGES } from "../constants";
// import LocationField from "../components/LocationField";


// const OnboardingPage = () => {
//   const { authUser } = useAuthUser();
//   const queryClient = useQueryClient();
  

//   const [formState, setFormState] = useState({
//     fullName: authUser?.fullName || "",
//     bio: authUser?.bio || "",
//     nativeLanguage: authUser?.nativeLanguage || "",
//     learningLanguage: authUser?.learningLanguage || "",
//     location: authUser?.location || "",
//     profilePic: authUser?.profilePic || "",
//   });

//   const { mutate: onboardingMutation, isPending } = useMutation({
//     mutationFn: completeOnboarding,
//     onSuccess: () => {
//       toast.success("Profile onboarded successfully");
//       queryClient.invalidateQueries({ queryKey: ["authUser"] });
//     },
    

//     onError: (error) => {
//       toast.error(error.response.data.message);
//     },
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     onboardingMutation(formState);
//   }; 

//   const handleRandomAvatar = () => {
//     const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
//     const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

//     setFormState({ ...formState, profilePic: randomAvatar });
//     toast.success("Random profile picture generated!");
//   };




  
  


//   return (
//     <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
//       <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
//         <div className="card-body p-6 sm:p-8">
//           <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
//             Complete Your Profile
//           </h1>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* PROFILE PIC CONTAINER */}
//             <div className="flex flex-col items-center justify-center space-y-4">
//               {/* IMAGE PREVIEW */}
//               <div className="size-32 rounded-full bg-base-300 overflow-hidden">
//                 {formState.profilePic ? (
//                   <img
//                     src={formState.profilePic}
//                     alt="Profile Preview"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex items-center justify-center h-full">
//                     <CameraIcon className="size-12 text-base-content opacity-40" />
//                   </div>
//                 )}
//               </div>

//               {/* Generate Random Avatar BTN */}
//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={handleRandomAvatar}
//                   className="btn btn-accent"
//                 >
//                   <ShuffleIcon className="size-4 mr-2" />
//                   Generate Random Avatar
//                 </button>
//               </div>
//             </div>

//             {/* FULL NAME */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Full Name</span>
//               </label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={formState.fullName}
//                 onChange={(e) =>
//                   setFormState({ ...formState, fullName: e.target.value })
//                 }
//                 className="input input-bordered w-full"
//                 placeholder="Your full name"
//               />
//             </div>

//             {/* BIO */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text">Bio</span>
//               </label>
//               <textarea
//                 name="bio"
//                 value={formState.bio}
//                 onChange={(e) =>
//                   setFormState({ ...formState, bio: e.target.value })
//                 }
//                 className="textarea textarea-bordered h-24"
//                 placeholder="Tell others about yourself and your language learning goals"
//               />
//             </div>

//             {/* LANGUAGES */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* NATIVE LANGUAGE */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text">Native Language</span>
//                 </label>
//                 <select
//                   name="nativeLanguage"
//                   value={formState.nativeLanguage}
//                   onChange={(e) =>
//                     setFormState({
//                       ...formState,
//                       nativeLanguage: e.target.value,
//                     })
//                   }
//                   className="select select-bordered w-full"
//                 >
//                   <option value="">Select your native language</option>
//                   {LANGUAGES.map((lang) => (
//                     <option key={`native-${lang}`} value={lang.toLowerCase()}>
//                       {lang}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* LEARNING LANGUAGE */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text">Learning Language</span>
//                 </label>
//                 <select
//                   name="learningLanguage"
//                   value={formState.learningLanguage}
//                   onChange={(e) =>
//                     setFormState({
//                       ...formState,
//                       learningLanguage: e.target.value,
//                     })
//                   }
//                   className="select select-bordered w-full"
//                 >
//                   <option value="">Select language you're learning</option>
//                   {LANGUAGES.map((lang) => (
//                     <option key={`learning-${lang}`} value={lang.toLowerCase()}>
//                       {lang}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

           


//          <LocationField formState={formState} setFormState={setFormState} />




//             {/* SUBMIT BUTTON */}

//             <button
//               className="btn btn-primary w-full"
//               disabled={isPending}
//               type="submit"
//             >
//               {!isPending ? (
//                 <>
//                   <ShipWheelIcon className="size-5 mr-2" />
//                   Complete Onboarding
//                 </>
//               ) : (
//                 <>
//                   <LoaderIcon className="animate-spin size-5 mr-2" />
//                   Onboarding...
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default OnboardingPage;






import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  CameraIcon,
  LoaderIcon,
  ShipWheelIcon,
  ShuffleIcon,
  XIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";
import LocationField from "../components/LocationField";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    knowingLanguages: authUser?.knowingLanguages || [],
    age: authUser?.age || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  // Add new language
  const handleAddLanguage = (lang) => {
    if (!formState.knowingLanguages.includes(lang)) {
      setFormState({
        ...formState,
        knowingLanguages: [...formState.knowingLanguages, lang],
      });
    }
  };

  // Remove a language
  const handleRemoveLanguage = (lang) => {
    setFormState({
      ...formState,
      knowingLanguages: formState.knowingLanguages.filter((l) => l !== lang),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="card bg-white w-full max-w-3xl shadow-2xl rounded-2xl border border-gray-200">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
            🚀 Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-gray-200 overflow-hidden shadow-md">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-gray-500 opacity-50" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-accent btn-sm"
              >
                <ShuffleIcon className="size-4 mr-1" />
                Random Avatar
              </button>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label font-semibold">Full Name</label>
              <input
                type="text"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label font-semibold">Bio</label>
              <textarea
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself"
              />
            </div>

            {/* KNOWING LANGUAGES */}
            <div className="form-control">
              <label className="label font-semibold">Knowing Languages</label>

              {/* Selected Languages Chips */}
              {formState.knowingLanguages.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formState.knowingLanguages.map((lang) => (
                    <div
                      key={lang}
                      className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm shadow-sm"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(lang)}
                        className="ml-1 hover:text-red-500"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Dropdown to add languages */}
              <select
                onChange={(e) => {
                  if (e.target.value) handleAddLanguage(e.target.value);
                  e.target.value = ""; // reset select
                }}
                className="select select-bordered w-full"
              >
                <option value="">+ Add a language</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* AGE */}
            <div className="form-control">
              <label className="label font-semibold">Age</label>
              <input
                type="number"
                value={formState.age}
                onChange={(e) =>
                  setFormState({ ...formState, age: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Enter your age"
                min="5"
                max="120"
              />
            </div>

            {/* LOCATION */}
            <LocationField formState={formState} setFormState={setFormState} />

            {/* SUBMIT */}
            <button
              className="btn btn-primary w-full mt-4"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
