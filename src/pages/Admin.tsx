import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AdminMenu } from "@/components/admin/AdminMenu";
import { AdminSections } from "@/components/admin/AdminSections";
import { AdminContent } from "@/components/admin/AdminContent";
import { AdminDelivery } from "@/components/admin/AdminDelivery";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { Coffee } from "lucide-react";

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  useEffect(() => { document.title = "Admin · Café Latté"; }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-cream/50">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <NoAccess />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 md:px-10 py-5 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-30">
        <div className="flex items-center gap-3">
          <Coffee className="text-primary w-5 h-5" />
          <Link to="/" className="font-display text-xl font-black">
            Café <span className="text-primary">Latté</span> · Admin
          </Link>
        </div>
        <Button asChild variant="ghost" size="sm"><Link to="/">View site →</Link></Button>
      </header>

      <main className="px-6 md:px-10 py-8 max-w-7xl mx-auto">
        <Tabs defaultValue="menu">
          <TabsList className="bg-card border border-border mb-8 flex-wrap h-auto">
            <TabsTrigger value="menu">Menu items</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="content">Page content</TabsTrigger>
            <TabsTrigger value="delivery">Delivery links</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value="menu"><AdminMenu /></TabsContent>
          <TabsContent value="sections"><AdminSections /></TabsContent>
          <TabsContent value="content"><AdminContent /></TabsContent>
          <TabsContent value="delivery"><AdminDelivery /></TabsContent>
          <TabsContent value="orders"><AdminOrders /></TabsContent>
          <TabsContent value="users"><AdminUsers /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function NoAccess() {
  return (
    <div className="min-h-screen bg-radial-warm flex items-center justify-center p-6">
      <div className="glass rounded-3xl p-10 max-w-md text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="font-display text-3xl font-black mb-2">Admin only</h1>
        <p className="text-cream/45 text-sm mb-6">
          You're signed in but not an admin yet. Open Lovable Cloud → Database → user_roles and add a row with your user id and role <em>admin</em>.
        </p>
        <Button asChild variant="outline"><Link to="/">Back to site</Link></Button>
      </div>
    </div>
  );
}
