import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Award,
  CalendarDays,
} from "lucide-react";
import axios from "axios";
import {
  getProfessionalAvailability,
  getProfessionalBookings,
  createBooking,
} from "../services/api";

const BookAppointment = () => {
  const { clerkId } = useParams();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const [professional, setProfessional] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!isLoaded || !user) {
      navigate("/sign-in");
      return;
    }
    fetchData();
  }, [clerkId, isLoaded, user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch professional details
      const profResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/medical-professionals`
      );
      const prof = profResponse.data.find((p) => p.clerkId === clerkId);

      if (!prof) {
        setError("Professional not found");
        setLoading(false);
        return;
      }
      setProfessional(prof);

      // Fetch availability
      try {
        const availResponse = await getProfessionalAvailability(clerkId);
        setAvailability(availResponse.data || []);
      } catch (err) {
        console.log("No availability set yet");
        setAvailability([]);
      }

      // Fetch existing bookings
      try {
        const bookingsResponse = await getProfessionalBookings(clerkId);
        setBookings(bookingsResponse.data || []);
      } catch (err) {
        console.log("No bookings yet");
        setBookings([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load booking information");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !reason.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const bookingData = {
        professionalClerkId: clerkId,
        date: selectedDate,
        time: selectedTime,
        reason: reason.trim(),
      };

      await createBooking(bookingData);
      setSuccess(true);
    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Generate available dates (next 14 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip Sundays (day 0)
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split("T")[0]);
      }
    }

    return dates;
  };

  // Generate time slots
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }
    return slots;
  };

  // Check if a time slot is booked
  const isSlotBooked = (date, time) => {
    return bookings.some(
      (booking) =>
        booking.date === date &&
        booking.time === time &&
        booking.status === "confirmed"
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading booking information...
          </p>
        </div>
      </div>
    );
  }

  if (error && !professional) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || "Something went wrong"}
          </h2>
          <Link to="/book-professional">
            <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors">
              Back to Professionals
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Appointment Booked!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Your appointment with <strong>{professional?.name}</strong> has been
            confirmed.
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 my-6">
            <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">{formatDate(selectedDate)}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">{selectedTime}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            You will receive a confirmation email shortly.
          </p>
          <div className="flex gap-4">
            <Link to="/bookings/my-bookings" className="flex-1">
              <button className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors">
                View My Bookings
              </button>
            </Link>
            <Link to="/book-professional" className="flex-1">
              <button className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors">
                Book Another
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Back Button */}
        <Link
          to="/book-professional"
          className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Professionals
        </Link>

        {/* Professional Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-white">
                {professional?.name?.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {professional?.name}
              </h1>
              <div className="flex items-center text-primary-600 dark:text-primary-400 mb-3">
                <Award className="w-5 h-5 mr-2" />
                <span className="font-semibold">
                  {professional?.profile?.specialty}
                </span>
              </div>
              {professional?.profile?.bio && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {professional.profile.bio}
                </p>
              )}
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <Mail className="w-4 h-4 mr-2" />
                <span>{professional?.email}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <CalendarDays className="w-6 h-6 mr-2 text-primary-500" />
            Book an Appointment
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          {availability.length === 0 && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-amber-800 dark:text-amber-300">
                This professional hasn't set their availability yet. You can
                still request an appointment and they will contact you.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Date *
              </label>
              <select
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime(""); // Reset time when date changes
                }}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Choose a date</option>
                {getAvailableDates().map((date) => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Time *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {getTimeSlots().map((time) => {
                    const isBooked = isSlotBooked(selectedDate, time);
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => !isBooked && setSelectedTime(time)}
                        disabled={isBooked}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                          selectedTime === time
                            ? "bg-primary-500 text-white ring-2 ring-primary-500"
                            : isBooked
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {time}
                        {isBooked && (
                          <span className="block text-xs mt-1">Booked</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Reason for Appointment *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows="4"
                placeholder="Please describe the reason for your appointment..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                submitting || !selectedDate || !selectedTime || !reason.trim()
              }
              className="w-full px-6 py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirm Booking
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default BookAppointment;
