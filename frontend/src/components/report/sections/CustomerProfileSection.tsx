import { User, Mail, Phone, MapPin, Calendar, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CustomerProfile } from "@/types";

interface Props {
  profile: CustomerProfile;
}

export function CustomerProfileSection({ profile }: Props) {
  const fields = [
    { icon: User, label: "Full Name", value: profile.name },
    { icon: CreditCard, label: "NRIC", value: profile.nric },
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone },
    { icon: Calendar, label: "Date of Birth", value: profile.date_of_birth },
    { icon: MapPin, label: "Address", value: profile.address?.full_address },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-indigo-500" />
          Customer Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                <Icon className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium truncate">{value || "—"}</p>
              </div>
            </div>
          ))}
        </div>
        {profile.address?.region && (
          <div className="mt-3 flex items-center gap-2">
            <Badge label="Region" value={profile.address.region} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
      {label}: {value}
    </span>
  );
}
