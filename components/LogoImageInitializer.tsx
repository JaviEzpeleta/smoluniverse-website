"use client";

import { useEffect } from "react";
import useStore from "@/lib/zustandStore";

export default function LogoImageInitializer() {
  const setLogoImageIndex = useStore((state) => state.setLogoImageIndex);

  useEffect(() => {
    setLogoImageIndex(Math.floor(Math.random() * 2) + 1);
  }, [setLogoImageIndex]);

  return null;
}
