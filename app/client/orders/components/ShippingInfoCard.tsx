import { User, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/models/order";

interface ShippingInfoCardProps {
  order: Order;
}

export function ShippingInfoCard({ order }: ShippingInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="w-5 h-5 text-primary" />
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            Full Name
          </p>
          <p className="font-semibold">{order.shippingInfo.fullName}</p>
        </div>
        <Separator />
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            Email
          </p>
          <p className="flex items-center gap-2 text-sm font-medium">
            <Mail className="w-4 h-4 text-primary" />
            {order.shippingInfo.email}
          </p>
        </div>
        {order.shippingInfo.phone && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Phone
              </p>
              <p className="flex items-center gap-2 text-sm font-medium">
                <Phone className="w-4 h-4 text-primary" />
                {order.shippingInfo.phone}
              </p>
            </div>
          </>
        )}
        <Separator />
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            Shipping Address
          </p>
          <p className="flex items-start gap-2 text-sm font-medium leading-relaxed">
            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>
              {order.shippingInfo.address}
              <br />
              {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
              {order.shippingInfo.postalCode}
              <br />
              {order.shippingInfo.country}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
