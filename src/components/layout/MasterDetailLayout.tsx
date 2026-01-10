import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MasterDetailProps {
  list: ReactNode;
  details: ReactNode;
  showDetails: boolean; 
}

export function MasterDetailLayout({ list, details, showDetails }: MasterDetailProps) {
  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 overflow-hidden relative">
      {/* List Pane */}
      <div className={cn(
        "flex-[2.5] bg-white rounded-xl border border-gray-200 overflow-y-auto shadow-sm transition-all duration-300",
        showDetails ? "hidden md:block" : "block w-full"
      )}>
        {list}
      </div>

      {/* Details Pane */}
      <div className={cn(
        "flex-[6] bg-white rounded-xl border border-gray-200 overflow-y-auto shadow-sm transition-all duration-300",
        showDetails ? "block w-full p-6" : "hidden md:block p-8"
      )}>
        {details}
      </div>
    </div>
  );
}