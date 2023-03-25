import { Link } from "react-router-dom";

type TProps = { to?: string; text: string; title?: string };

export default function Button({ to, text, title }: TProps) {
  const className = "border-2 w-20 h-20";

  if (to)
    return (
      <button className={className}>
        {title}
        {title ? <br /> : ""}
        <b>
          <Link to={to}>{text}</Link>
        </b>
      </button>
    );

  return (
    <button className={className}>
      {title}
      {title ? <br /> : ""}
      <b>{text}</b>
    </button>
  );
}
