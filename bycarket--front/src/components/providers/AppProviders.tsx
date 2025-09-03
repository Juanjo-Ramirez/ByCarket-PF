"use client";

import { AuthProvider } from "@/context/AuthProvider";
import { SessionProvider } from "next-auth/react";
import React from "react";
import ChatBot from "@/components/ui/ChatBot";
import { NotificationsContainer } from "@/app/utils/Notifications";
import { SpinnerProvider } from "@/context/SpinnerContext";
import AuthInitializer from "./AuthInitializer";
import { ReactQueryProvider } from "./ReactQueryProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReactQueryProvider>
      <SessionProvider>
        <AuthProvider>
          <AuthInitializer />
          <SpinnerProvider>
            <ChatBot />
            {children}
          </SpinnerProvider>
          <NotificationsContainer />
        </AuthProvider>
      </SessionProvider>
    </ReactQueryProvider>
  );
}
