"use client";
import { useState } from "react";

interface ProductTabsProps {
  id: number; // or maybe the component expects just a number, not an object
}
export default function WriteReviewForm({ id }: ProductTabsProps) {
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(0);
  console.log(id);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
    rating: 0,
    product_id: id,
  });

  console.log(formData);
  const handleChnage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/tetimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        comment: "",
        rating: 0,
        product_id: id,
      });

      alert("Review submitted ✅");
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Leave a Review ⭐</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          name="name"
          onChange={handleChnage}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Your Email"
          value={formData.email}
          name="email"
          onChange={handleChnage}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Star Rating */}
        <div>
          <p className="mb-2 font-medium">Your Rating:</p>
          <div className="flex space-x-1 text-2xl cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setFormData({ ...formData, rating: star })}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className={`${
                  (hover || formData.rating) >= star
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Comment */}
        <textarea
          placeholder="Write your review..."
          value={formData.comment}
          onChange={handleChnage}
          name="comment"
          required
          rows={4}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
