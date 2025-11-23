import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVendorProfile,
  updateVendorProfile,
  deleteVendorAccount,
} from "../lib/vendor";
import amenitiesList from "../constants/amenitiesList";
import { toast } from "react-hot-toast";
import DeleteAccountModal from "../components/DeleteAccountModal";
import { useNavigate } from "react-router-dom";

const VendorProfilePage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [password, setPassword] = useState("");

  //  Fetch vendor profile from backend using JWT cookie
  const {
    data: vendorData,
    isLoading: isProfileLoading,
    error,
  } = useQuery({
    queryKey: ["vendorProfile"],
    queryFn: getVendorProfile,
  });

  //  React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
  console.log("Vendor API Response:", vendorData);
}, [vendorData]);

  // useEffect(() => {
  //   if (vendorData) reset(vendorData);
  // }, [vendorData, reset]);
useEffect(() => {
 if (vendorData) {
  reset(vendorData);
}

}, [vendorData, reset]);

  const { mutate: updateProfileMutation, isLoading: isUpdateLoading } = useMutation({
    mutationFn: updateVendorProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["vendorProfile"]);
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Update failed!");
    },
  });

  // Mutation for deleting account
  const { mutate: deleteMutation, isLoading: isDeleting } = useMutation({
    mutationFn: deleteVendorAccount,
    onSuccess: () => {
      toast.success("Account deleted");
      localStorage.removeItem("vendor");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Could not delete account");
    },
  });

  const onSubmit = (data) => {
    if (!Array.isArray(data.amenities))
      data.amenities = [data.amenities].filter(Boolean);
    updateProfileMutation(data);
  };

  const handleDeleteAccount = () => {
    if (!password) {
      toast.error("Enter your password");
      return;
    }
    deleteMutation(password);
  };

  // Loading / error state
  if (isProfileLoading) return <p className="text-center mt-10">Loading vendor profile...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load profile.</p>;

 const vendor = vendorData || {};

 

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Vendor Profile Settings</h1>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-base-100 p-6 rounded-lg shadow"
      >
        <div>
          <label>Hotel Name</label>
          <input
            type="text"
            {...register("hotelName", { required: "Hotel name is required" })}
            className="input input-bordered w-full"
          />
          {errors.hotelName && (
            <span className="text-error text-sm">{errors.hotelName.message}</span>
          )}
        </div>

        <div>
          <label>Owner Email</label>
          <input
            type="email"
            value={vendor.ownerEmail}
            disabled
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            type="text"
            {...register("phone")}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label>GST No.</label>
          <input
            type="text"
            {...register("gstNo")}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label>Business Type</label>
          <select
            {...register("businessType", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Choose type</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Hotel">Hotel</option>
            <option value="Café">Café</option>
            <option value="Club">Club</option>
          </select>
        </div>

        <div>
          <label>Location</label>
          <input
            type="text"
            {...register("location")}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label>Price (INR)</label>
          <input
            type="number"
            {...register("price", { min: 0 })}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label>Opening Time</label>
          <input
            type="text"
            {...register("openingTime")}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label>Closing Time</label>
          <input
            type="text"
            {...register("closingTime")}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label>Photos (comma-separated URLs)</label>
          <input
            type="text"
            {...register("photos")}
            onChange={(e) =>
              setValue(
                "photos",
                e.target.value.split(",").map((x) => x.trim())
              )
            }
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label>Amenities</label>
          <div className="grid grid-cols-2 gap-2">
            {amenitiesList.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  value={item}
                  {...register("amenities")}
                  defaultChecked={vendor.amenities?.includes(item)}
                />{" "}
                {item}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>Description</label>
          <textarea
            {...register("description")}
            className="textarea textarea-bordered w-full"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isUpdateLoading}>
          {isUpdateLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Delete Account */}
      <div className="mt-8 border-t border-error/20 pt-6">
        <h2 className="text-xl font-semibold text-error mb-4">Danger Zone</h2>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="btn btn-error w-full md:w-auto"
        >
          Delete Account
        </button>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPassword("");
        }}
        onConfirm={handleDeleteAccount}
        isLoading={isDeleting}
        password={password}
        setPassword={setPassword}
      />
    </div>
  );
};

export default VendorProfilePage;
