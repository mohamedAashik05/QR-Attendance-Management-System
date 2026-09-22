import { useState } from "react";
import { useNavigate } from "react-router-dom";

const inputClass =
  "rounded-lg border border-[#8A0149]/30 bg-[#F3F0E7] px-4 py-2.5 text-gray-800 " +
  "placeholder:text-gray-400 focus:border-[#8A0149] focus:outline-none " +
  "focus:ring-2 focus:ring-[#8A0149]/30 transition-colors duration-200";

const labelClass = "text-sm font-semibold text-[#8A0149]";

function TrainerRegister() {
  const [form, setForm] = useState({
    TrainerName: "",
    Email_ID: "",
    Password: "",
    phone: "",
    CourseID: "",
    JoinDate: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/register/trainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }
      setTimeout(() => {
        alert("Trainer registered successfully");
        navigate("/TrainerLogin");
      }, 2000);
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F0E7] px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-5 rounded-2xl bg-white/60 p-8 shadow-lg shadow-[#8A0149]/10"
      >
        <h1 className="text-center text-2xl font-bold text-[#8A0149]">
          Trainer Registration
        </h1>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="TrainerName" className={labelClass}>Trainer Name</label>
          <input
            id="TrainerName"
            name="TrainerName"
            type="text"
            value={form.TrainerName}
            onChange={handleChange}
            placeholder="Enter trainer name"
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="Email_ID" className={labelClass}>Email ID</label>
          <input
            id="Email_ID"
            name="Email_ID"
            type="email"
            value={form.Email_ID}
            onChange={handleChange}
            placeholder="you@example.com"
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="Password" className={labelClass}>Password</label>
          <div className="relative">
            <input
              id="Password"
              name="Password"
              type={showPassword ? "text" : "password"}
              value={form.Password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              minLength={8}
              autoComplete="new-password"
              className={`${inputClass} w-full pr-16`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8A0149] hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className={labelClass}>Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="CourseID" className={labelClass}>Course ID</label>
          <input
            id="CourseID"
            name="CourseID"
            type="number"
            value={form.CourseID}
            onChange={handleChange}
            placeholder="Enter course ID"
            className={`${inputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="JoinDate" className={labelClass}>Join Date</label>
          <input
            id="JoinDate"
            name="JoinDate"
            type="date"
            value={form.JoinDate}
            onChange={handleChange}
            className={inputClass}
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

export default TrainerRegister;