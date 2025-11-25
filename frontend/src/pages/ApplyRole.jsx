import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { submitApplication, getMyApplicationStatus } from "../services/api";
import {
  PenTool,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useEffect } from "react";

const ApplyRole = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    specialization: "",
    credentials: "",
    experience: "",
    motivation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      checkApplicationStatus();
    }
  }, [isLoaded, user]);

  const checkApplicationStatus = async () => {
    try {
      setCheckingStatus(true);
      const response = await getMyApplicationStatus();
      if (response.data) {
        setExistingApplication(response.data);
      }
    } catch (err) {
      // No existing application, user can apply
      console.log("No existing application");
    } finally {
      setCheckingStatus(false);
    }
  };

  const roles = [
    {
      id: "writer",
      name: "Writer",
      icon: PenTool,
      description:
        "Create and publish health articles to educate our community",
      color: "from-purple-500 to-pink-500",
      requirements: [
        "Strong writing and communication skills",
        "Knowledge in health, nutrition, or wellness topics",
        "Ability to research and fact-check information",
        "Commitment to producing quality content",
      ],
    },
    {
      id: "medical",
      name: "Medical Professional",
      icon: Stethoscope,
      description: "Provide professional consultations and health guidance",
      color: "from-primary-500 to-secondary-500",
      requirements: [
        "Valid medical license or certification",
        "Proven experience in healthcare field",
        "Excellent patient communication skills",
        "Available for scheduled consultations",
      ],
    },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Map frontend fields to backend expected fields
      const applicationData = {
        roleAppliedFor: selectedRole,
        bio: `${formData.motivation}\n\nCredentials: ${formData.credentials}\n\nExperience: ${formData.experience}`,
        specialty:
          selectedRole === "medical" ? formData.specialization : undefined,
      };

      console.log("📋 Application data being sent:", applicationData);

      const response = await submitApplication(applicationData);

      console.log("✅ Success response:", response);
      setSuccess(true);
    } catch (err) {
      console.error("❌ Error submitting application:", err);
      console.error("Error response:", err.response);

      setError(
        err.response?.data?.message ||
          "Failed to submit application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not signed in
  if (isLoaded && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sign In Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to sign in to apply for a role.
          </p>
          <button
            onClick={() => navigate("/sign-in")}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Checking application status...
          </p>
        </div>
      </div>
    );
  }

  // Show existing application status
  if (existingApplication) {
    const statusColors = {
      pending:
        "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300",
      approved:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
      rejected: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    };

    const statusIcons = {
      pending: Loader2,
      approved: CheckCircle,
      rejected: AlertCircle,
    };

    const StatusIcon = statusIcons[existingApplication.status];

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-center mb-8">
              <StatusIcon
                className={`w-16 h-16 mx-auto mb-4 ${
                  existingApplication.status === "pending"
                    ? "animate-spin text-amber-500"
                    : ""
                } ${
                  existingApplication.status === "approved"
                    ? "text-green-500"
                    : ""
                } ${
                  existingApplication.status === "rejected"
                    ? "text-red-500"
                    : ""
                }`}
              />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Application Status
              </h2>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  statusColors[existingApplication.status]
                }`}
              >
                {existingApplication.status.charAt(0).toUpperCase() +
                  existingApplication.status.slice(1)}
              </span>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Role
                </h3>
                <p className="text-lg text-gray-900 dark:text-white capitalize">
                  {existingApplication.role}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Specialization
                </h3>
                <p className="text-lg text-gray-900 dark:text-white">
                  {existingApplication.specialization}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Submitted
                </h3>
                <p className="text-lg text-gray-900 dark:text-white">
                  {new Date(existingApplication.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>

            {existingApplication.status === "pending" && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-amber-800 dark:text-amber-300">
                  Your application is being reviewed by our team. We'll notify
                  you once a decision is made.
                </p>
              </div>
            )}

            {existingApplication.status === "approved" && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-300 mb-4">
                  Congratulations! Your application has been approved. You can
                  now access your dashboard.
                </p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {existingApplication.status === "rejected" && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-300">
                  Unfortunately, your application was not approved at this time.
                  You may reapply after 30 days.
                </p>
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate("/")}
                className="text-primary-500 hover:text-primary-600 font-semibold"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Application Submitted!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Thank you for applying! We'll review your application and get back
            to you soon.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Help us make health information accessible to everyone. Apply to
            become a writer or medical professional.
          </p>
        </motion.div>

        {/* Role Selection */}
        {!selectedRole && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedRole(role.id)}
                className="cursor-pointer"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-primary-500 overflow-hidden h-full">
                  <div
                    className={`bg-gradient-to-br ${role.color} p-8 text-center`}
                  >
                    <role.icon className="w-16 h-16 text-white mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {role.name}
                    </h2>
                  </div>

                  <div className="p-8">
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {role.description}
                    </p>

                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                      Requirements:
                    </h3>
                    <ul className="space-y-2">
                      {role.requirements.map((req, i) => (
                        <li
                          key={i}
                          className="flex items-start text-gray-600 dark:text-gray-400"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>

                    <button className="w-full mt-6 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors">
                      Apply as {role.name}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Application Form */}
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Apply as{" "}
                  {selectedRole === "writer"
                    ? "Writer"
                    : "Medical Professional"}
                </h2>
                <button
                  onClick={() => setSelectedRole("")}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Change Role
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 dark:text-red-300">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Specialization / Area of Expertise *
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                    placeholder={
                      selectedRole === "writer"
                        ? "e.g., Nutrition, Mental Health"
                        : "e.g., General Practitioner, Nutritionist"
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Credentials / Qualifications *
                  </label>
                  <textarea
                    name="credentials"
                    value={formData.credentials}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder={
                      selectedRole === "writer"
                        ? "Describe your writing experience, education, or certifications"
                        : "List your medical licenses, certifications, and qualifications"
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Experience *
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="Describe your relevant experience in detail"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Why do you want to join ThriveWell? *
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="Tell us what motivates you to contribute to our platform"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ApplyRole;
