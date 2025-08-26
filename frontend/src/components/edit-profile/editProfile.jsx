import { useState, useEffect } from "react";
import { Sun, Moon, X, Save, User, Camera, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addUser } from "../../store/userSlice";
import ProfileCardPreview from "./profileCardPreview";
import Toast from "../toast";
import { DEVELOPER_SKILLS } from "../../data/mockDevelopers";

const EditProfilePage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    photoUrl: "https://geographyandyou.com/images/user-profile.png",
    about: "",
    skills: [],
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync formData with user when user changes
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        gender: user.gender || "",
        photoUrl:
          user.photoUrl ||
          "https://geographyandyou.com/images/user-profile.png",
        about: user.about || "",
        skills: user.skills || [],
      });
    }
  }, [user]);

  // Track form changes
  useEffect(() => {
    const hasFormChanges =
      JSON.stringify(formData) !==
      JSON.stringify({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        gender: user.gender || "",
        photoUrl:
          user.photoUrl ||
          "https://geographyandyou.com/images/user-profile.png",
        about: user.about || "",
        skills: user.skills || [],
      });
    setHasChanges(hasFormChanges);
  }, [formData]);

  /**
   * Input sanitization
   */
  const sanitizeInput = (input) => {
    if (typeof input !== "string") return input;
    return input.trim().replace(/[<>]/g, "");
  };

  /**
   * URL validation
   */
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Handle input changes with validation
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = sanitizeInput(value);

    // Special processing
    if (name === "age") {
      processedValue = value === "" ? "" : parseInt(value) || "";
    } else if (name === "firstName" || name === "lastName") {
      processedValue =
        processedValue.charAt(0).toUpperCase() + processedValue.slice(1);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear errors on input change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Handle skill input
   */
  const handleSkillInputChange = (e) => {
    const value = sanitizeInput(e.target.value);
    setSkillInput(value);

    if (value.length > 0) {
      const suggestions = DEVELOPER_SKILLS.filter(
        (skill) =>
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !formData.skills.includes(skill)
      ).slice(0, 5);
      setSkillSuggestions(suggestions);
      setShowSkillSuggestions(true);
    } else {
      setShowSkillSuggestions(false);
    }
  };

  /**
   * Add skill
   */
  const addSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill],
      }));
    }
    setSkillInput("");
    setShowSkillSuggestions(false);
  };

  /**
   * Remove skill
   */
  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  /**
   * Handle skill input key press
   */
  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (skillSuggestions.length > 0) {
        addSkill(skillSuggestions[0]);
      } else if (skillInput.trim()) {
        addSkill(skillInput);
      }
    } else if (e.key === "Escape") {
      setShowSkillSuggestions(false);
    }
  };

  /**
   * Form validation
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName || formData.firstName.length < 3) {
      newErrors.firstName = "First name must be at least 3 characters";
    } else if (formData.firstName.length > 30) {
      newErrors.firstName = "First name must not exceed 30 characters";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length > 30) {
      newErrors.lastName = "Last name must not exceed 30 characters";
    }

    if (formData.age && formData.age < 18) {
      newErrors.age = "You must be at least 18 years old";
    }

    if (
      formData.gender &&
      !["male", "female", "other"].includes(formData.gender)
    ) {
      newErrors.gender = "Please select a valid gender";
    }

    if (
      formData.photoUrl &&
      formData.photoUrl !== "https://via.placeholder.com/400x400?text=Photo" &&
      !validateUrl(formData.photoUrl)
    ) {
      newErrors.photoUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validateForm() || isLoading || !hasChanges) return;

    setIsLoading(true);

    try {
      // Prepare payload
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender || undefined,
        photoUrl: formData.photoUrl || undefined,
        about: formData.about || undefined,
        skills: formData.skills.length > 0 ? formData.skills : undefined,
      };

      // Remove undefined fields
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/profile/edit`,
        payload,
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(response.data.user));

      setToast({
        message: "Profile updated successfully!",
        type: "success",
      });

      // In real app: dispatch(updateUser(response.data.user));
      console.log("Profile updated:", response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update profile. Please try again!";

      setToast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="flex items-center justify-center space-x-3 mb-4 pt-8">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-6 h-6 text-primary-content" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-base-content">
          Edit Profile
        </h1>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-8 py-8  max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-4">
          {/* Left Column - Edit Form */}
          <div className="order-2 lg:order-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-6">
                  <User size={24} className="text-primary" />
                  <h2 className="card-title text-2xl">Profile Information</h2>
                </div>

                <div className="space-y-4">
                  {/* Name Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium">
                          First Name <span className="text-error">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`input input-bordered w-full ${
                          errors.firstName ? "input-error" : ""
                        }`}
                        placeholder="Enter first name"
                        disabled={isLoading}
                        maxLength={30}
                      />
                      {errors.firstName && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.firstName}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium">
                          Last Name <span className="text-error">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`input input-bordered w-full ${
                          errors.lastName ? "input-error" : ""
                        }`}
                        placeholder="Enter last name"
                        disabled={isLoading}
                        maxLength={30}
                      />
                      {errors.lastName && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.lastName}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Age and Gender Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Age */}
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium">Age</span>
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className={`input input-bordered w-full ${
                          errors.age ? "input-error" : ""
                        }`}
                        placeholder="18+"
                        min="18"
                        max="120"
                        disabled={isLoading}
                      />
                      {errors.age && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.age}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium">Gender</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`select select-bordered w-full ${
                          errors.gender ? "select-error" : ""
                        }`}
                        disabled={isLoading}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.gender}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Photo URL */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <Camera size={16} />
                        Profile Photo URL
                      </span>
                    </label>
                    <input
                      type="url"
                      name="photoUrl"
                      value={formData.photoUrl}
                      onChange={handleInputChange}
                      className={`input input-bordered w-full ${
                        errors.photoUrl ? "input-error" : ""
                      }`}
                      placeholder="https://example.com/photo.jpg"
                      disabled={isLoading}
                    />
                    {errors.photoUrl && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.photoUrl}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* About */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">About You</span>
                      <span className="label-text-alt text-base-content/60">
                        {formData.about.length}/500
                      </span>
                    </label>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered h-32 resize-none w-full"
                      placeholder="Tell potential matches about yourself..."
                      maxLength={500}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Skills */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">
                        Skills & Technologies
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={handleSkillInputChange}
                        onKeyDown={handleSkillKeyPress}
                        className="input input-bordered w-full"
                        placeholder="Type a skill and press Enter"
                        disabled={isLoading}
                      />

                      {/* Skill Suggestions */}
                      {showSkillSuggestions && skillSuggestions.length > 0 && (
                        <div className="dropdown dropdown-open w-full">
                          <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full mt-1 border border-base-300 max-h-40 overflow-y-auto">
                            {skillSuggestions.map((skill) => (
                              <li key={skill}>
                                <button
                                  type="button"
                                  onClick={() => addSkill(skill)}
                                  className="w-full text-left"
                                >
                                  {skill}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Selected Skills */}
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="badge badge-primary gap-2 p-3"
                          >
                            <span className="font-medium">{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="btn btn-ghost btn-xs text-primary-content hover:text-error"
                              disabled={isLoading}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <div className="divider"></div>
                <div className="card-actions justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !hasChanges}
                    className={`btn btn-primary gap-2 ${
                      isLoading ? "loading" : ""
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>

                {!hasChanges && (
                  <div className="text-center">
                    <span className="text-xs text-base-content/60">
                      No changes detected
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Live Preview */}
          <div className="order-1 lg:order-2 relative">
            {/* lg:sticky lg:top-48 lg:h-fit */}
            <div className="lg:sticky lg:top-20">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold mb-1">Profile Preview</h3>
                <p className="text-sm text-base-content/70">
                  How others will see you
                </p>
              </div>
            <ProfileCardPreview user={formData} />
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );

  // return (
  //   <div
  //     className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-8 px-4"
  //     data-theme={theme}
  //   >
  //     {/* Theme Toggle */}
  //     <div className="fixed top-4 right-4 z-10">
  //       <button
  //         onClick={toggleTheme}
  //         className="btn btn-ghost btn-circle bg-base-100/80 backdrop-blur-sm hover:bg-base-100 shadow-lg"
  //         aria-label="Toggle theme"
  //       >
  //         {theme === "light" ? (
  //           <Moon size={20} />
  //         ) : (
  //           <Sun size={20} className="text-warning" />
  //         )}
  //       </button>
  //     </div>

  //     {/* Header */}
  //     <div className="max-w-7xl mx-auto mb-8">
  //       <div className="text-center">
  //         <h1 className="text-4xl font-bold text-base-content mb-2">
  //           Edit Profile
  //         </h1>
  //         <p className="text-base-content/70">
  //           Update your devTinder profile information
  //         </p>
  //       </div>
  //     </div>

  //     {/* Main Content */}
  //     <div className="max-w-7xl mx-auto lg:px-12 xl:px-20">
  //       <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10">
  //         {/* Left Column - Edit Form */}
  //         <div className="order-2 lg:order-1">
  //           <div className="card bg-base-100/95 backdrop-blur-sm shadow-2xl border border-base-300/50">
  //             <div className="card-body p-8">
  //               <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
  //                 <User size={24} />
  //                 Profile Information
  //               </h2>

  //               <div className="space-y-6">
  //                 {/* Name Row */}
  //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //                   {/* First Name */}
  //                   <div className="form-control">
  //                     <label className="label">
  //                       <span className="label-text font-medium">
  //                         First Name <span className="text-error">*</span>
  //                       </span>
  //                     </label>
  //                     <input
  //                       type="text"
  //                       name="firstName"
  //                       value={formData.firstName}
  //                       onChange={handleInputChange}
  //                       className={`input input-bordered ${
  //                         errors.firstName ? "input-error" : ""
  //                       } focus:outline-none`}
  //                       placeholder="Enter first name"
  //                       disabled={isLoading}
  //                       maxLength={30}
  //                     />
  //                     {errors.firstName && (
  //                       <label className="label">
  //                         <span
  //                           className="label-text-alt text-error"
  //                           role="alert"
  //                         >
  //                           {errors.firstName}
  //                         </span>
  //                       </label>
  //                     )}
  //                   </div>

  //                   {/* Last Name */}
  //                   <div className="form-control">
  //                     <label className="label">
  //                       <span className="label-text font-medium">
  //                         Last Name <span className="text-error">*</span>
  //                       </span>
  //                     </label>
  //                     <input
  //                       type="text"
  //                       name="lastName"
  //                       value={formData.lastName}
  //                       onChange={handleInputChange}
  //                       className={`input input-bordered ${
  //                         errors.lastName ? "input-error" : ""
  //                       }  focus:outline-none`}
  //                       placeholder="Enter last name"
  //                       disabled={isLoading}
  //                       maxLength={30}
  //                     />
  //                     {errors.lastName && (
  //                       <label className="label">
  //                         <span
  //                           className="label-text-alt text-error"
  //                           role="alert"
  //                         >
  //                           {errors.lastName}
  //                         </span>
  //                       </label>
  //                     )}
  //                   </div>
  //                 </div>

  //                 {/* Age and Gender Row */}
  //                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //                   {/* Age */}
  //                   <div className="form-control">
  //                     <label className="label">
  //                       <span className="label-text font-medium">Age</span>
  //                     </label>
  //                     <input
  //                       type="number"
  //                       name="age"
  //                       value={formData.age}
  //                       onChange={handleInputChange}
  //                       className={`input input-bordered ${
  //                         errors.age ? "input-error" : ""
  //                       } focus:outline-none`}
  //                       placeholder="18+"
  //                       min="18"
  //                       max="120"
  //                       disabled={isLoading}
  //                     />
  //                     {errors.age && (
  //                       <label className="label">
  //                         <span
  //                           className="label-text-alt text-error"
  //                           role="alert"
  //                         >
  //                           {errors.age}
  //                         </span>
  //                       </label>
  //                     )}
  //                   </div>

  //                   {/* Gender */}
  //                   <div className="form-control">
  //                     <label className="label">
  //                       <span className="label-text font-medium">Gender</span>
  //                     </label>
  //                     <select
  //                       name="gender"
  //                       value={formData.gender}
  //                       onChange={handleInputChange}
  //                       className={`select select-bordered ${
  //                         errors.gender ? "select-error" : ""
  //                       }  focus:outline-none`}
  //                       disabled={isLoading}
  //                     >
  //                       <option value="">Select gender</option>
  //                       <option value="male">Male</option>
  //                       <option value="female">Female</option>
  //                       <option value="other">Other</option>
  //                     </select>
  //                     {errors.gender && (
  //                       <label className="label">
  //                         <span
  //                           className="label-text-alt text-error"
  //                           role="alert"
  //                         >
  //                           {errors.gender}
  //                         </span>
  //                       </label>
  //                     )}
  //                   </div>
  //                 </div>

  //                 {/* Photo URL */}
  //                 <div className="form-control">
  //                   <label className="label">
  //                     <span className="label-text font-medium flex items-center gap-2">
  //                       <Camera size={16} />
  //                       Profile Photo URL
  //                     </span>
  //                   </label>
  //                   <input
  //                     type="url"
  //                     name="photoUrl"
  //                     value={formData.photoUrl}
  //                     onChange={handleInputChange}
  //                     className={`input input-bordered ${
  //                       errors.photoUrl ? "input-error" : ""
  //                     } focus:outline-none`}
  //                     placeholder="https://example.com/photo.jpg"
  //                     disabled={isLoading}
  //                   />
  //                   {errors.photoUrl && (
  //                     <label className="label">
  //                       <span
  //                         className="label-text-alt text-error"
  //                         role="alert"
  //                       >
  //                         {errors.photoUrl}
  //                       </span>
  //                     </label>
  //                   )}
  //                 </div>

  //                 {/* About */}
  //                 <div className="form-control">
  //                   <label className="label">
  //                     <span className="label-text font-medium">About You</span>
  //                     <span className="label-text-alt">
  //                       {formData.about.length}/500
  //                     </span>
  //                   </label>
  //                   <textarea
  //                     name="about"
  //                     value={formData.about}
  //                     onChange={handleInputChange}
  //                     className="textarea textarea-bordered h-32 resize-none focus:outline-none"
  //                     placeholder="Tell potential matches about yourself..."
  //                     maxLength={500}
  //                     disabled={isLoading}
  //                   />
  //                 </div>

  //                 {/* Skills */}
  //                 <div className="form-control">
  //                   <label className="label">
  //                     <span className="label-text font-medium">
  //                       Skills & Technologies
  //                     </span>
  //                   </label>
  //                   <div className="relative">
  //                     <input
  //                       type="text"
  //                       value={skillInput}
  //                       onChange={handleSkillInputChange}
  //                       onKeyDown={handleSkillKeyPress}
  //                       className="input input-bordered w-full focus:outline-none"
  //                       placeholder="Type a skill and press Enter"
  //                       disabled={isLoading}
  //                     />

  //                     {/* Skill Suggestions */}
  //                     {showSkillSuggestions && skillSuggestions.length > 0 && (
  //                       <div className="absolute top-full left-0 right-0 bg-base-100 border border-base-300 rounded-lg mt-1 z-10 shadow-lg max-h-40 overflow-y-auto">
  //                         {skillSuggestions.map((skill, index) => (
  //                           <button
  //                             key={skill}
  //                             type="button"
  //                             onClick={() => addSkill(skill)}
  //                             className="w-full text-left px-4 py-2 hover:bg-base-200 first:rounded-t-lg last:rounded-b-lg transition-colors"
  //                           >
  //                             {skill}
  //                           </button>
  //                         ))}
  //                       </div>
  //                     )}
  //                   </div>

  //                   {/* Selected Skills */}
  //                   {formData.skills.length > 0 && (
  //                     <div className="flex flex-wrap gap-2 mt-3">
  //                       {formData.skills.map((skill, index) => (
  //                         <div
  //                           key={index}
  //                           className="badge badge-primary gap-2 p-3"
  //                         >
  //                           <span className="font-medium">{skill}</span>
  //                           <button
  //                             type="button"
  //                             onClick={() => removeSkill(skill)}
  //                             className="text-primary-content hover:text-error transition-colors"
  //                             disabled={isLoading}
  //                           >
  //                             <X size={14} />
  //                           </button>
  //                         </div>
  //                       ))}
  //                     </div>
  //                   )}
  //                 </div>
  //               </div>

  //               {/* Save Button */}
  //               <div className="card-actions justify-end mt-8 pt-4 border-t border-base-300">
  //                 <button
  //                   type="button"
  //                   onClick={handleSubmit}
  //                   disabled={isLoading || !hasChanges}
  //                   className={`btn btn-primary min-w-32 ${
  //                     isLoading ? "loading loading-spinner" : ""
  //                   }`}
  //                 >
  //                   {isLoading ? (
  //                     <span className="flex items-center gap-2">
  //                       <span className="loading loading-spinner loading-sm"></span>
  //                       Saving...
  //                     </span>
  //                   ) : (
  //                     <span className="flex items-center gap-2">
  //                       <Save size={16} />
  //                       Save Changes
  //                     </span>
  //                   )}
  //                 </button>
  //               </div>

  //               {!hasChanges && (
  //                 <div className="text-center mt-2">
  //                   <span className="text-xs text-base-content/60">
  //                     No changes detected
  //                   </span>
  //                 </div>
  //               )}
  //             </div>
  //           </div>
  //         </div>

  //         {/* Right Column - Live Preview */}
  //         <div className="order-1 lg:order-2 lg:sticky lg:top-20 lg:h-fit ">
  //           {/* xl:max-w-96 2xl:max-w-[500px] */}
  //           <div className="text-center mb-4">
  //             <h3 className="text-xl font-semibold text-base-content mb-1">
  //               Profile Preview
  //             </h3>
  //             <p className="text-sm text-base-content/70">
  //               How others will see you
  //             </p>
  //           </div>
  //           <ProfileCardPreview user={formData} />
  //         </div>
  //       </div>
  //     </div>

  //     {/* Toast Notifications */}
  //     {toast && (
  //       <Toast
  //         message={toast.message}
  //         type={toast.type}
  //         onClose={() => setToast(null)}
  //       />
  //     )}
  //   </div>
  // );
};

export default EditProfilePage;
