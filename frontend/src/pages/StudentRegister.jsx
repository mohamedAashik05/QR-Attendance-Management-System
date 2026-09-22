import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const inputClass =
  "rounded-lg border border-[#8A0149]/30 bg-[#F3F0E7] px-4 py-2.5 text-gray-800 " +
  "placeholder:text-gray-400 focus:border-[#8A0149] focus:outline-none " +
  "focus:ring-2 focus:ring-[#8A0149]/30 transition-colors duration-200";

const labelClass = "text-sm font-semibold text-[#8A0149]";

function StdRegister() {
  const [form, setForm] = useState({
    students_name: "",
    email_ID: "",
    phone_no: "",
    course_ID: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/StudentRegister", {
        ...form,
        phone_no: Number(form.phone_no),
        course_ID: Number(form.course_ID),
      });

      setTimeout(() => {
        alert("Student registered successfully");
        navigate('/')
      }, 2000);
    } catch (requestError) {
      const responseData = requestError.response?.data;
      setError(
        responseData?.error || responseData?.message || "Student registration failed",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F0E7] px-4 py-10">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-5 rounded-2xl bg-white/60 p-8 shadow-lg shadow-[#8A0149]/10">
        <h1 className="text-center text-2xl font-bold text-[#8A0149]">
          Student Registration
        </h1>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="students_name" className={labelClass}>Student Name</label>
          <input
            id="students_name"
            name="students_name"
            type="text"
            value={form.students_name}
            onChange={handleChange}
            placeholder="Enter your name"
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email_ID" className={labelClass}>Email</label>
          <input
            id="email_ID"
            name="email_ID"
            type="email"
            value={form.email_ID}
            onChange={handleChange}
            placeholder="you@example.com"
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone_no" className={labelClass}>Mobile No</label>
          <input
            id="phone_no"
            name="phone_no"
            type="tel"
            value={form.phone_no}
            onChange={handleChange}
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            placeholder="10-digit mobile number"
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="course_ID" className={labelClass}>Course ID</label>
          <input
            id="course_ID"
            name="course_ID"
            type="number"
            value={form.course_ID}
            onChange={handleChange}
            placeholder="Enter course ID"
            className={`${inputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            required
          />
        </div>

        {error && (
          <p className="text-center text-sm font-medium text-red-700">{error}</p>
        )}

        <button
          type="submit"
          className="mt-2 rounded-full bg-[#8A0149] px-14 py-3 font-semibold tracking-wide text-white
                     shadow-lg shadow-[#8A0149]/40
                     hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8A0149]/50
                     active:translate-y-0 transition-all duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default StdRegister;