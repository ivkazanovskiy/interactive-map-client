import React from "react";
import { Link } from "react-router-dom";

type TProps = { to?: string; text: string };

export default function Button({ to, text }: TProps) {
  const className = "border-2";

  if (to)
    return (
      <button className={className}>
        <Link to={to}>{text}</Link>
      </button>
    );

  return <button className={className}>{text}</button>;
}
