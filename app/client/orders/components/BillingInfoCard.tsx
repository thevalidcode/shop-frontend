import { User, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/models/order";

interface BillingInfoCardProps {
  order: Order;
}

export function BillingInfoCard({ order }: BillingInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="w-5 h-5 text-primary" />
          Billing Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            Full Name
          </p>
          <p className="font-semibold">{order.billingInfo.fullName}</p>
        </div>
        <Separator />
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            Email
          </p>
          <p className="flex items-center gap-2 text-sm font-medium">
            <Mail className="w-4 h-4 text-primary" />
            {order.billingInfo.email}
          </p>
        </div>
        {order.billingInfo.phone && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Phone
              </p>
              <p className="flex items-center gap-2 text-sm font-medium">
                <Phone className="w-4 h-4 text-primary" />
                {order.billingInfo.phone}
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
              {order.billingInfo.address}
              <br />
              {order.billingInfo.city}, {order.billingInfo.state}{" "}
              {order.billingInfo.postalCode}
              <br />
              {order.billingInfo.country}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
