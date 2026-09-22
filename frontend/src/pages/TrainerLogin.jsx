import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { AUTH_TOKEN_KEY } from "../api/api";

const inputClass =
  "rounded-lg border border-[#8A0149]/30 bg-[#F3F0E7] px-4 py-2.5 text-gray-800 " +
  "placeholder:text-gray-400 focus:border-[#8A0149] focus:outline-none " +
  "focus:ring-2 focus:ring-[#8A0149]/30 transition-colors duration-200";

const labelClass = "text-sm font-semibold text-[#8A0149]";

const TrainerLogin = () => {
  const [form, setForm] = useState({ Email_ID: "", Password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/login/trainer", form);
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      navigate(`/TrainerQR?login=${Date.now()}`);
    } catch (requestError) {
      const responseData = requestError.response?.data;
      const message = responseData?.message || responseData;
      setError(message || "Invalid email or password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F0E7] px-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-5 rounded-2xl bg-white/60 p-8 shadow-lg shadow-[#8A0149]/10"
      >
        <h1 className="text-center text-2xl font-bold text-[#8A0149]">
          Trainer Login
        </h1>

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
              placeholder="Enter your password"
              autoComplete="current-password"
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
          Login
        </button>
      </form>
    </div>
  );
};

export default TrainerLogin;