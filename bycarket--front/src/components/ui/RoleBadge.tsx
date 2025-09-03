import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useOptimizedUserData } from "@/hooks/queries/useUserQueries";
import { ShieldCheck, Star } from "lucide-react";

const RoleBadge = () => {
  const { isAdmin, isPremium } = useRolePermissions();
  const { userData, loading } = useOptimizedUserData();

  if (loading || !userData?.role) return null;

  if (userData.role === "admin") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800 font-medium">
        <ShieldCheck className="w-4 h-4" />
        Admin
      </span>
    );
  }

  if (userData.role === "premium") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium">
        <Star className="w-4 h-4" />
        Premium
      </span>
    );
  }

  return null;
};

export { RoleBadge };
