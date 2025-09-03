"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import ProfileContent from "./components/ProfileContent";
import VehiclesContent from "./components/VehiclesContent";
import PublicationsContent from "./components/PostContent";
import PremiumContent from "./components/PremiumContent";
import VehicleForm from "./components/VehicleForm";
import UserListContent from "./components/UserListContent";
import UserPostsContent from "./components/UserPostsContent";
import { useOptimizedUserData } from "@/hooks/queries/useUserQueries";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import DatabaseScrapperContent from "./components/DatabaseScrapperContent";
import PremiumHistoryContent from "./components/PremiumHistoryContent";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState("profile");
  const { userData, loading } = useOptimizedUserData();
  const { isAdmin, isPremium } = useRolePermissions();

  useEffect(() => {
    if (tabParam) {
      const validTabs = [
        "profile",
        "vehicles",
        "publications",
        "register-vehicle",
        "publish-vehicle",
        "premium",
      ];

      if (isPremium) {
        validTabs.push("premium-history");
      }

      if (isAdmin) {
        validTabs.push("users", "user-posts", "database-scrapper");
      }

      if (validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      } else {
        setActiveTab("profile");
      }
    }
  }, [tabParam, isAdmin, isPremium]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard?tab=${tab}`);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "profile":
        return <ProfileContent />;
      case "vehicles":
        return <VehiclesContent />;
      case "publications":
        return <PublicationsContent />;
      case "register-vehicle":
        return <VehicleForm />;
      case "premium":
        return <PremiumContent />;
      case "premium-history":
        return <PremiumHistoryContent />;
      case "users":
        return isAdmin ? <UserListContent /> : <ProfileContent />;
      case "user-posts":
        return isAdmin ? <UserPostsContent /> : <ProfileContent />;
      case "database-scrapper":
        return isAdmin ? <DatabaseScrapperContent /> : <ProfileContent />;
      default:
        return <ProfileContent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <main className="flex-1 p-2">{renderContent()}</main>
    </div>
  );
}
