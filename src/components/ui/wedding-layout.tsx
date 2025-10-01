'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface WeddingLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const WeddingLayout = ({ children, className }: WeddingLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent toggleSidebar={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 bg-muted p-4 h-full">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className={cn('flex-1 overflow-auto p-4 md:p-8', className)}>
        {children}
      </main>
    </div>
  );
};

const SidebarContent = ({ toggleSidebar }: { toggleSidebar?: () => void }) => {
  const handleClick = () => {
    if (toggleSidebar) {
      toggleSidebar();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Wedding Planner</h1>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard/organizer" onClick={handleClick} className="block">
              <Button variant="ghost" className="w-full justify-start">
                Dashboard
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/crm" onClick={handleClick} className="block">
              <Button variant="ghost" className="w-full justify-start">
                Clients
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/tasks" onClick={handleClick} className="block">
              <Button variant="ghost" className="w-full justify-start">
                Tasks
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/budget" onClick={handleClick} className="block">
              <Button variant="ghost" className="w-full justify-start">
                Budget
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/guests" onClick={handleClick} className="block">
              <Button variant="ghost" className="w-full justify-start">
                Guests
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/vendors" onClick={handleClick} className="block">
              <Button variant="ghost" className="w-full justify-start">
                Vendors
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/calendar" onClick={handleClick} className="block">
              <Button variant="ghost" className="w-full justify-start">
                Calendar
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/moodboard" onClick={handleClick} className="block">
              <Button variant="ghost" className="w-full justify-start">
                Mood Board
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/documents" onClick={handleClick} className="block">
              <Button variant="ghost" className="w-full justify-start">
                Documents
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t">
        <Link href="/profile" onClick={handleClick} className="block">
          <Button variant="ghost" className="w-full justify-start">
            Profile
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default WeddingLayout;