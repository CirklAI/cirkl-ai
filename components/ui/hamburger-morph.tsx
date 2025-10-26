"use client";

interface HamburgerMorphProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function HamburgerMorph({
  isOpen,
  onClick,
}: HamburgerMorphProps) {
  return (
    <button
      onClick={onClick}
      className="hamburger-button"
      aria-label="Toggle menu"
    >
      <div
        className={`hamburger-line hamburger-line-top ${
          isOpen ? "open" : ""
        }`}
      />
      <div
        className={`hamburger-line hamburger-line-middle ${
          isOpen ? "open" : ""
        }`}
      />
      <div
        className={`hamburger-line hamburger-line-bottom ${
          isOpen ? "open" : ""
        }`}
      />
    </button>
  );
}
