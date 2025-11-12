"use client";

import { SidebarProvider } from "@/context/SidebarContext";
import { ModalProvider } from "@/context/ModalContext";
import { AuthProvider } from "@/context/AuthContext";
import { BannerProvider } from "@/context/BannerContext";
import { MaintenanceProvider, useMaintenance } from "@/context/MaintenanceContext";
import dynamic from "next/dynamic";
import AddMoneyModal from "@/components/AddMoneyModal";
import MaintenancePage from "@/components/MaintenancePage";

const Sidemenu = dynamic(() => import("@/components/Sidemenu"), { ssr: false });
const HeaderBar = dynamic(() => import("@/components/HeaderBar"), { ssr: false });

export default function Providers({ children }) {
  return (
    <MaintenanceProvider>
      <AuthProvider>
        <BannerProvider>
          <ModalProvider>
            <SidebarProvider>
              <MaintenanceWrapper>
                <div className="relative">
                  <Sidemenu />
                  <HeaderBar />
                  <div className="min-h-screen">
                    {children}
                    <AddMoneyModal />
                  </div>
                </div>
              </MaintenanceWrapper>
            </SidebarProvider>
          </ModalProvider>
        </BannerProvider>
      </AuthProvider>
    </MaintenanceProvider>
  );
}

function MaintenanceWrapper({ children }) {
  const { isMaintenance, maintenanceMessage, isLoading, checkMaintenanceStatus } = useMaintenance();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking system status...</p>
        </div>
      </div>
    );
  }

  if (isMaintenance) {
    return <MaintenancePage message={maintenanceMessage} onRetry={checkMaintenanceStatus} isLoading={isLoading} />;
  }

  return children;
}
