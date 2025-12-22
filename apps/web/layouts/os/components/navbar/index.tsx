'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Lightbulb, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import NotificationBell from '@/components/NotificationBell';
import { ThemeToggle } from '@/components/dark-mode/theme-toggle';
import ClockDisplay from '@/layouts/os/components/clock-display';
import UserDropdown from '@/layouts/os/UserDropdown';
import { useOSStrings } from '@/i18n/os';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Textarea } from '@workspace/ui/components/textarea';

interface NavbarProps {
  activeWindowTitle?: string;
}

const FEATURE_REQUEST_EMAIL = 'arhamymr@gmail.com';

function TitleLabel({ title }: { title: string | undefined }) {
  const s = useOSStrings();
  return (
    <p className="text-muted-foreground text-sm font-medium">
      {title || s.topbar.fallbackTitle}
    </p>
  );
}

function FeatureRequestDialog() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(FEATURE_REQUEST_EMAIL);
    setCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMail = () => {
    const subject = encodeURIComponent('Feature Request');
    const body = encodeURIComponent(message || 'Hi, I would like to request a new feature:\n\n');
    window.open(`mailto:${FEATURE_REQUEST_EMAIL}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-xs">
          <Lightbulb className="h-3.5 w-3.5" />
          Request Feature
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request a New Feature</DialogTitle>
          <DialogDescription>
            Have an idea? Send us your feature request!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Describe the feature you'd like to see..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">
              Don&apos;t have a mail app? Copy the email manually:
            </p>
            <div className="flex items-center gap-2 rounded-md border p-2 text-sm">
              <span className="text-muted-foreground flex-1 truncate">
                {FEATURE_REQUEST_EMAIL}
              </span>
              <Button variant="ghost" size="sm" onClick={handleCopyEmail}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleOpenMail}>Open Mail App</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Navbar({ activeWindowTitle }: NavbarProps) {
  return (
    <div className="fixed inset-x-0 top-0 z-[222] flex items-center justify-between border-b bg-black/20 p-2 text-xs text-white backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Image
          src="https://assets.apsaradigital.com/logo.png"
          alt="logo"
          width={80}
          height={24}
          className="mr-1 ml-2 block dark:hidden"
        />
        <Image
          src="https://assets.apsaradigital.com/logo-white.png"
          alt="logo"
          width={80}
          height={24}
          className="mr-1 ml-2 hidden dark:block"
        />
        ✦
        <TitleLabel title={activeWindowTitle} />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <FeatureRequestDialog />
        <NotificationBell />
        <ClockDisplay simple />
        <ThemeToggle />
        <UserDropdown />
      </div>
    </div>
  );
}
