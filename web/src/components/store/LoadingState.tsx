import { LoaderCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="mx-auto grid min-h-[42dvh] place-items-center px-4"
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className="size-7 animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function InlineLoader({ label = "Updating" }: { label?: string }) {
  return (
    <span className="inline-flex items-center" role="status" aria-live="polite">
      <LoaderCircle className="size-4 animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24" role="status" aria-live="polite">
      <span className="sr-only">Loading storefront</span>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="mt-6 h-12 w-full max-w-xl lg:h-16" />
          <Skeleton className="mt-3 h-12 w-4/5 max-w-lg lg:h-16" />
          <Skeleton className="mt-6 h-5 w-full max-w-xl" />
          <Skeleton className="mt-3 h-5 w-3/4 max-w-lg" />
          <div className="mt-8 flex gap-3">
            <Skeleton className="h-13 w-36 rounded-lg" />
            <Skeleton className="h-13 w-40 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[4/3] rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
