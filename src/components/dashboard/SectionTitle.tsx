
import React from "react";

interface SectionTitleProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ id, children, className }) => (
  <h2
    id={id}
    tabIndex={-1}
    className={`text-xl md:text-2xl font-semibold mb-2 outline-none focus:ring-2 focus:ring-primary transition rounded ${className || ""}`}
  >
    {children}
  </h2>
);

export default SectionTitle;
