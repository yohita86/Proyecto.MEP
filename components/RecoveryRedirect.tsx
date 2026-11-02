"use client";

import { useEffect } from "react";

export default function RecoveryRedirect() {
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace(/^#/, ""));

    if (params.get("type") === "recovery") {
      window.location.replace(
        `/admin/restablecer-contrasena${window.location.search}${hash}`
      );
    }
  }, []);

  return null;
}