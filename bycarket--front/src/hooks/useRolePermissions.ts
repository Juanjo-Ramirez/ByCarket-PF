import { useUserData } from "@/hooks/useUserData";
import { useMyPostsQuery } from "@/hooks/queries/usePostQueries";
import { useMemo } from "react";

export const useRolePermissions = () => {
  const { userData, loading: userDataLoading } = useUserData();

  // Solo hacer query de posts si es usuario free
  const role = userData?.role;
  const isAdmin = useMemo(() => role === "admin", [role]);
  const isPremium = useMemo(
    () => role === "premium" || isAdmin,
    [role, isAdmin]
  );
  const isUser = useMemo(() => role === "user", [role]);

  // Solo hacer fetch de posts para usuarios free
  const myPostsQuery = useMyPostsQuery();
  const shouldFetchPosts = !isAdmin && !isPremium && isUser;

  const postCount = useMemo(() => {
    if (!shouldFetchPosts) return 0;
    const posts = Array.isArray(myPostsQuery.data)
      ? myPostsQuery.data
      : (myPostsQuery.data as any)?.data || [];
    return posts.length;
  }, [myPostsQuery.data, shouldFetchPosts]);

  const maxFreePosts = 3;

  const permissions = useMemo(() => {
    const canCreatePost =
      isAdmin || isPremium || (isUser && postCount < maxFreePosts);
    const remainingPosts =
      isAdmin || isPremium
        ? Infinity
        : isUser
        ? Math.max(maxFreePosts - postCount, 0)
        : 0;

    return {
      canCreatePost,
      remainingPosts,
      canAccessAdminPanel: isAdmin,
      canAccessAIGenerator: isPremium,
      canModerateUsers: isAdmin,
      canModeratePosts: isAdmin,
    };
  }, [isAdmin, isPremium, isUser, postCount, maxFreePosts]);

  const checkCanCreatePost = async () => {
    if (isAdmin || isPremium) return true;
    if (!isUser) return false;
    return postCount < maxFreePosts;
  };

  return {
    loading: userDataLoading || (shouldFetchPosts && myPostsQuery.isLoading),
    isAdmin,
    isPremium,
    isUser,
    isLoggedIn: !!userData,
    postCount,
    checkCanCreatePost,
    ...permissions,
  };
};
