"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { TypographyH2 } from "@/components/typography";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
} from "@/components/ui/sheet";
import { useState } from "react";

function SettingsHeader({
  navigationItems,
  activePage,
  handlePageChange,
}: {
  navigationItems: {
    icon: any;
    component: any;
    id: string;
    label: string;
    description: string;
  }[];
  activePage: string;
  handlePageChange: (id: string) => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="lg:hidden w-full">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between border-b">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetHeader>
              <TypographyH2 className="text-lg">Settings</TypographyH2>
            </SheetHeader>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="p-6">
                <TypographyH2 className="mb-6">Settings</TypographyH2>
                <div className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;

                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-3 h-auto p-4 text-left overflow-hidden",
                            isActive &&
                              "bg-secondary shadow-sm border border-border/50",
                          )}
                          onClick={() => {
                            handlePageChange(item.id);
                            setMobileMenuOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-3 w-full overflow-hidden">
                            <div
                              className={cn(
                                "p-2 rounded-lg transition-colors shrink-0",
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>

                            {/* THIS is where truncation must happen */}
                            <div className="flex flex-col min-w-0 overflow-hidden">
                              <div
                                className={cn(
                                  "font-medium text-sm truncate",
                                  isActive
                                    ? "text-foreground"
                                    : "text-muted-foreground",
                                )}
                              >
                                {item.label}
                              </div>

                              <div className="mt-0.5 text-xs text-muted-foreground truncate">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

export default SettingsHeader;
