"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChurchInfoTab } from "./_components/ChurchInfoTab";
import { ServiceDaysTab } from "./_components/ServiceDaysTab";
import { SpecialProgramsTab } from "./_components/SpecialProgramsTab";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">
          Church info, service-day templates, and special programs.
        </p>
      </div>

      <Tabs defaultValue="church-info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="church-info">Church Info</TabsTrigger>
          <TabsTrigger value="service-days">Service Days</TabsTrigger>
          <TabsTrigger value="special-programs">Special Programs</TabsTrigger>
        </TabsList>

        <TabsContent value="church-info">
          <ChurchInfoTab />
        </TabsContent>

        <TabsContent value="service-days">
          <ServiceDaysTab />
        </TabsContent>

        <TabsContent value="special-programs">
          <SpecialProgramsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
