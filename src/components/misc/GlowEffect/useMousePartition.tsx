import { useState, useEffect } from "react";

const useMousePosition = (ref) => {
  const [position, setPosition] = useState({ x: null, y: null });

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (ref.current) {
        const { left, top } = ref.current.getBoundingClientRect();
        setPosition({
          x: event.clientX - left,
          y: event.clientY - top,
        });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: null, y: null });
    };

    if (ref.current) {
      ref.current.addEventListener("mousemove", handleMouseMove);
      ref.current.addEventListener("mouseout", handleMouseLeave);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("mousemove", handleMouseMove);
        ref.current.removeEventListener("mouseout", handleMouseLeave);
      }
    };
  }, [ref]);

  return position;
};

export default useMousePosition;
