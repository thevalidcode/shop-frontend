import { User, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/models/order";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CustomerInfoCardProps {
  order: Order;
}

export function CustomerInfoCard({ order }: CustomerInfoCardProps) {
  const initials = order.user.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="w-5 h-5 text-primary" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{order.user.username}</p>
            <p className="text-xs text-muted-foreground">
              ID: {order.user.uid.slice(0, 8)}...
            </p>
          </div>
        </div>
        <Separator />
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            Email
          </p>
          <p className="flex items-center gap-2 text-sm font-medium">
            <Mail className="w-4 h-4 text-primary" />
            {order.user.email}
          </p>
        </div>
        {order.user.phone && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Phone
              </p>
              <p className="flex items-center gap-2 text-sm font-medium">
                <Phone className="w-4 h-4 text-primary" />
                {order.user.phone}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
