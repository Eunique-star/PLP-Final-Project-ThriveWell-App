import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { getMedicalProfessionals as fetchMedicalProfessionals } from "../services/api";
import {
  Stethoscope,
  Calendar,
  Clock,
  User,
  Loader2,
  Search,
  Filter,
  ChevronRight,
  Award,
  MapPin,
  Star,
} from "lucide-react";

const BookProfessional = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  // Specialties for filtering
  const specialties = [
    "All",
    "General Practitioner",
    "Nutritionist",
    "Therapist",
    "Fitness Coach",
    "Pediatrician",
    "Cardiologist",
  ];

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const response = await fetchMedicalProfessionals();
      setProfessionals(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching professionals:", err);
      setError("Failed to load professionals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProfessionals = professionals.filter((prof) => {
    const matchesSearch =
      prof.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.profile?.specialty?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty =
      selectedSpecialty === "all" ||
      selectedSpecialty === "All" ||
      prof.profile?.specialty?.toLowerCase() ===
        selectedSpecialty.toLowerCase();

    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (professional) => {
    if (!isLoaded || !user) {
      navigate("/sign-in");
      return;
    }
    // Navigate to booking page with professional ID
    navigate(`/book-appointment/${professional.clerkId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading professionals...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-500 to-secondary-500 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Book a Professional
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Connect with verified healthcare professionals for consultations
              and guidance
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Specialty Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Professionals Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          {filteredProfessionals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Professionals Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || selectedSpecialty !== "all"
                  ? "Try adjusting your search or filters"
                  : "No medical professionals available yet"}
              </p>
              {(searchTerm || selectedSpecialty !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSpecialty("all");
                  }}
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProfessionals.map((professional, index) => (
                <motion.div
                  key={professional._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Header with Avatar */}
                  <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-6 text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl font-bold text-primary-500">
                        {professional.name?.charAt(0).toUpperCase() || "M"}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {professional.name || "Medical Professional"}
                    </h3>
                    <div className="flex items-center justify-center text-white/90">
                      <Award className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {professional.profile?.specialty ||
                          "Healthcare Professional"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Bio */}
                    {professional.profile?.bio && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {professional.profile.bio}
                      </p>
                    )}

                    {/* Info */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <User className="w-4 h-4 mr-2" />
                        <span>{professional.email}</span>
                      </div>

                      {/* Rating (placeholder for now) */}
                      <div className="flex items-center text-yellow-500 text-sm">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        <Star className="w-4 h-4 mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">
                          4.0 (12 reviews)
                        </span>
                      </div>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={() => handleBookAppointment(professional)}
                      className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      Book Appointment
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto text-center px-6 sm:px-8 lg:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Are You a Healthcare Professional?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join ThriveWell and help people on their health journey
          </p>
          <button
            onClick={() => navigate("/apply")}
            className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold shadow-lg inline-flex items-center gap-2"
          >
            Apply to Join
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default BookProfessional;
