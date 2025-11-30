import Link from 'next/link';

import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';

export default function NotFoundPage() {
  return (
    <>
      <title>404: Page Not Found | Apsara Digital</title>
      <div className="bg-background flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-primary text-6xl font-bold">
              404
            </CardTitle>
            <CardDescription className="text-xl font-semibold">
              Page Not Found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Sorry, the page you are looking for could not be found.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button asChild className="w-full">
              <Link href="/">Go Home</Link>
            </Button>
            <Separator />
            <p className="text-muted-foreground text-sm">
              If this problem persists, please contact support.
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
