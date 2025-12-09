'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2Icon, CheckIcon, MailIcon, MessageSquareIcon } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // For now, just simulate a submission
    // In production, this would send to an API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSuccess(true);
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-8 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-0">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--status-recommended)]/10 sm:mb-6 sm:h-16 sm:w-16">
            <CheckIcon className="h-7 w-7 text-[var(--status-recommended)] sm:h-8 sm:w-8" />
          </div>
          <h1 className="text-xl text-foreground sm:text-2xl">Message sent!</h1>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
            Thanks for reaching out. We&apos;ll get back to you as soon as possible.
          </p>
          <Button
            onClick={() => {
              setSuccess(false);
              setName('');
              setEmail('');
              setMessage('');
            }}
            variant="outline"
            size="lg"
            className="mt-6 w-full sm:mt-8 sm:w-auto"
          >
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-57px)] px-4 py-12 sm:min-h-[calc(100vh-73px)] sm:px-6 sm:py-24">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl tracking-tight text-foreground sm:text-3xl">
            Contact Us
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
            Have a question or feedback? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Options */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card className="border-0 bg-secondary/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MailIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <a
                  href="mailto:hello@ratemybalibuilder.com"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  hello@ratemybalibuilder.com
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-secondary/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MessageSquareIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Response time</p>
                <p className="text-sm text-muted-foreground">Within 24 hours</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardContent className="p-5 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11 sm:h-12"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 sm:h-12"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full sm:h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
