"use client";

import { TrackingEvent } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, Package, Truck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TrackingTimelineProps {
  events: TrackingEvent[];
}

const getEventIcon = (status: string) => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes("delivered")) return CheckCircle2;
  if (lowerStatus.includes("transit") || lowerStatus.includes("shipping"))
    return Truck;
  if (lowerStatus.includes("picked") || lowerStatus.includes("accepted"))
    return Package;
  return MapPin;
};

const getEventColor = (status: string) => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes("delivered"))
    return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20";
  if (lowerStatus.includes("transit"))
    return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20";
  if (lowerStatus.includes("picked") || lowerStatus.includes("accepted"))
    return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20";
  return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20";
};

export function TrackingTimeline({ events }: TrackingTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  if (events.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No tracking events available yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Tracking Timeline</h3>
      <div className="space-y-6">
        {sortedEvents.map((event, index) => {
          const Icon = getEventIcon(event.status);
          const colorClass = getEventColor(event.status);
          const isLast = index === sortedEvents.length - 1;

          return (
            <motion.div
              key={event.uid}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <div className={cn("rounded-full p-2 z-10", colorClass)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {!isLast && (
                    <div className="absolute top-10 w-0.5 h-full bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-medium">{event.status}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {formatDistanceToNow(new Date(event.createdAt), {
                        addSuffix: true,
                      })}
                    </Badge>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(event.createdAt).toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
