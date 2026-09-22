import { NavLink } from "react-router-dom";

const Button = (props) => {
    return (
      <NavLink
        to={props.to}
        className="inline-flex h-12 w-64 items-center justify-center rounded-full bg-[#8A0149] text-white font-semibold tracking-wide
                   shadow-lg shadow-[#8A0149]/40
                   hover:shadow-xl hover:shadow-[#8A0149]/50 hover:-translate-y-0.5
                   active:translate-y-0 transition-all duration-200"
      >
        {props.user}
      </NavLink>
    );
  };

export default Button;