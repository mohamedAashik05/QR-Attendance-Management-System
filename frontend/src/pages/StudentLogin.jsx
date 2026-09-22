import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api";

function StdLogin() {
  const [searchParams] = useSearchParams();

  //set checkin automatically and read only
  const getLocalDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  const [data, setData] = useState({ student_ID: '', CheckIn: getLocalDateTime() });
  const [message, setMessage] = useState('');

  function handleData(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    try {
      const { data: result } = await api.post("/AttendanceEntry", {
        ...data,
        qrToken: searchParams.get("qrToken"),
      });
      setMessage(result.message);
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F0E7] px-4">
      <form onSubmit={handleSubmit} className="login flex w-full max-w-sm flex-col gap-5 rounded-2xl bg-white/60 p-8 shadow-lg shadow-[#8A0149]/10">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="student_ID" className="text-sm font-semibold text-[#8A0149]">
            Student ID
          </label>
          <input
            id="student_ID"
            name="student_ID"
            type="number"
            value={data.student_ID}
            onChange={handleData}
            required
            className="rounded-lg border border-[#8A0149]/30 bg-[#F3F0E7] px-4 py-2.5 text-gray-800
                       placeholder:text-gray-400
                       focus:border-[#8A0149] focus:outline-none focus:ring-2 focus:ring-[#8A0149]/30
                       transition-colors duration-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="CheckIn" className="text-sm font-semibold text-[#8A0149]">
            Check-in
          </label>
          <input
            id="CheckIn"
            name="CheckIn"
            type="datetime-local"
            value={data.CheckIn}
            readOnly
            className="cursor-not-allowed rounded-lg border border-[#8A0149]/20 bg-[#8A0149]/5 px-4 py-2.5 text-gray-600
                      focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-2 rounded-full bg-[#8A0149] px-14 py-3 font-semibold tracking-wide text-white
                     shadow-lg shadow-[#8A0149]/40
                     hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8A0149]/50
                     active:translate-y-0 transition-all duration-200"
        >
          Submit
        </button>
        {message && <p role="status" className="text-center text-sm text-[#8A0149]">{message}</p>}
      </form>
    </div>
  );
}
export default StdLogin