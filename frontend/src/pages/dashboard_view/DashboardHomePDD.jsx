"use client";

import React, { useEffect, useState } from "react";
import { SectionCardPDD } from "@/components/dashboard_component/SectionCardPDD";
import { ChartComponentPDD } from "@/components/dashboard_component/ChartComponentPDD";

export default function DashboardHomePDD() {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsed = JSON.parse(storedUser);
      setUserId(parsed.id);
      setToken(storedToken);
    } else {
      console.log("User atau token tidak ada → redirect?");
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <SectionCardPDD userId={userId} token={token} />
      <ChartComponentPDD userId={userId} token={token} />
    </div>
  );
}
