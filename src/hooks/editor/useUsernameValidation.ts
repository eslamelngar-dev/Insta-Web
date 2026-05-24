import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { UsernameStatus } from "@/types/editor";

export function useUsernameValidation(username: string, siteId: string) {
  const [status, setStatus] = useState<UsernameStatus>("idle");

  const effectiveStatus = !username || username.trim() === "" ? "idle" : status;

  useEffect(() => {
    if (!username || username.trim() === "") return;

    const timer = setTimeout(async () => {
      setStatus("checking");
      const cleanUsername = username.toLowerCase().trim();

      let query = supabase
        .from("sites")
        .select("id")
        .eq("username", cleanUsername);

      if (siteId !== "new") {
        query = query.neq("id", siteId);
      }

      const { data: existingSite } = await query.maybeSingle();
      setStatus(existingSite ? "taken" : "available");
    }, 500);

    return () => clearTimeout(timer);
  }, [username, siteId]);

  return { status: effectiveStatus };
}
