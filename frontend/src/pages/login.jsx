import Button from "../components/button";

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F0E7] px-4">
      <div className="flex w-full max-w-3xl flex-col items-stretch gap-8 rounded-2xl bg-white/40 p-8 shadow-lg shadow-[#8A0149]/10 sm:flex-row sm:items-center sm:gap-0">
        <div className="flex flex-1 flex-col items-center gap-5">
          <h1 className="text-xl font-bold text-[#8A0149]">Student</h1>
          <Button user={"Student"} to="/StdCamera" />
          <Button user={"New Student"} to="/StudentRegister" />
        </div>

        <div className="h-px w-full bg-[#8A0149]/30 sm:mx-8 sm:h-56 sm:w-px" aria-hidden="true" />

        <div className="flex flex-1 flex-col items-center gap-5">
          <h1 className="text-xl font-bold text-[#8A0149]">Trainer</h1>
          <Button user={"Trainer"} to="/TrainerLogin" />
          <Button user={"New Trainer"} to="/TrainerRegister" />
        </div>
      </div>
    </div>
  );
};

export default Login;