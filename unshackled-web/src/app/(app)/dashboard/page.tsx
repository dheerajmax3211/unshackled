import React from "react";
import { getDashboardSummary } from "@/lib/api/dashboard";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Unshackled",
  description: "Your progress towards freedom.",
};

export default async function DashboardPage() {
  // Fetch initial dashboard data on the server
  let initialData = null;
  try {
    initialData = await getDashboardSummary();
  } catch (error) {
    console.error("Dashboard fetch failed:", error);
    // Handle redirect to login if unauthorized in middleware or here
  }

  return (
    <DashboardContent initialData={initialData} />
  );
}
