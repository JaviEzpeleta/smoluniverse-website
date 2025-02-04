"use client";

import { IS_LOCALHOST } from "@/lib/constants";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

function VisitTracker() {
  const loadedRef = useRef(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchLocation = async () => {
      const location = await fetch("https://ipapi.co/json/").then((res) =>
        res.json()
      );

      let utm_source = searchParams.get("utm_source");
      let utm_medium = searchParams.get("utm_medium");
      let utm_campaign = searchParams.get("utm_campaign");
      let utm_via = searchParams.get("via");

      const saved_utm_ref = localStorage.getItem("utm_ref");
      let utm_ref = searchParams.get("ref")
        ? searchParams.get("ref")
        : document && document.referrer;
      if (saved_utm_ref && saved_utm_ref.trim() !== "https://smoluniverse.com/")
        utm_ref = saved_utm_ref;

      if (utm_source || utm_medium || utm_campaign) {
        localStorage.setItem(
          "utm_source",
          utm_source ? utm_source.toString() : ""
        );
        localStorage.setItem(
          "utm_medium",
          utm_medium ? utm_medium.toString() : ""
        );
        localStorage.setItem(
          "utm_campaign",
          utm_campaign ? utm_campaign.toString() : ""
        );
      } else {
        const saved_utm_source = localStorage.getItem("utm_source");
        const saved_utm_medium = localStorage.getItem("utm_medium");
        const saved_utm_campaign = localStorage.getItem("utm_campaign");

        if (saved_utm_source || saved_utm_medium || saved_utm_campaign) {
          utm_source = saved_utm_source;
          utm_medium = saved_utm_medium;
          utm_campaign = saved_utm_campaign;
        }
      }

      if (utm_via) {
        localStorage.setItem("utm_via", utm_via ? utm_via.toString() : "");
      } else {
        const saved_utm_via = localStorage.getItem("utm_via");
        if (saved_utm_via) {
          utm_via = saved_utm_via;
        }
      }

      if (utm_ref && utm_ref !== "") {
        localStorage.setItem("utm_ref", utm_ref ? utm_ref.toString() : "");
      }

      const userAgent = navigator.userAgent;
      const isMobile = /Mobi/i.test(userAgent);

      await axios.post("/api/sv", {
        location,
        pathname,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_via,
        utm_ref,
        isMobile,
        ip_address: location.ip,
      });
    };

    if (IS_LOCALHOST) return;
    if (pathname) {
      if (!loadedRef.current) {
        loadedRef.current = true;
        // if (process.env.NODE_ENV === "production")
        fetchLocation();
      }
    }
  }, [pathname, searchParams]);

  if (IS_LOCALHOST) return <></>;

  return <></>;
}

export default VisitTracker;
