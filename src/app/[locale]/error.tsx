"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations("errorPages");
  const pathname = usePathname();

  // Extract locale from pathname
  const locale = pathname?.split("/")?.[1] || "en";

  useEffect(() => {
    // Log the error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by error boundary:", error);
    }
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error icon - Kindle-style warning symbol */}
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 border-4 border-[var(--eink-ink)] rounded-full flex items-center justify-center relative">
            <span className="text-4xl font-serif text-[var(--eink-ink)] leading-none">
              ⚠
            </span>
          </div>
        </div>

        {/* Error title */}
        <h1 className="text-4xl font-serif font-bold text-[var(--eink-ink)] mb-4">
          {t("error.title")}
        </h1>

        {/* Error description */}
        <p className="text-base text-[var(--eink-ink-secondary)] mb-2 leading-relaxed">
          {t("error.description")}
        </p>

        {/* Error details in development */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="my-6 p-4 bg-[var(--eink-paper-warm)] border border-[var(--eink-border)] text-left">
            <p className="text-xs font-mono text-[var(--eink-ink-tertiary)] break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-[var(--eink-ink-muted)] mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Production error message */}
        {process.env.NODE_ENV === "production" && (
          <p className="text-sm text-[var(--eink-ink-tertiary)] mb-8">
            {t("error.productionMessage")}
          </p>
        )}

        {/* Action buttons - Kindle style */}
        <div className="space-y-3 mt-8">
          <button
            onClick={reset}
            className="block w-full py-3 px-6 bg-[var(--eink-ink)] text-[var(--eink-paper)] font-sans text-sm font-medium border-2 border-[var(--eink-ink)] hover:bg-[var(--eink-ink-secondary)] hover:border-[var(--eink-ink-secondary)] transition-colors"
          >
            {t("error.tryAgain")}
          </button>

          <Link
            href={`/${locale}`}
            className="block w-full py-3 px-6 bg-transparent text-[var(--eink-ink)] font-sans text-sm font-medium border-2 border-[var(--eink-border)] hover:border-[var(--eink-ink)] transition-colors"
          >
            {t("error.backHome")}
          </Link>
        </div>

        {/* Helpful information - Kindle style */}
        <div className="mt-12 pt-8 border-t border-[var(--eink-divider)]">
          <p className="text-sm text-[var(--eink-ink-muted)] mb-4">
            {t("error.whatToDo")}
          </p>
          <ul className="text-sm text-[var(--eink-ink-tertiary)] space-y-2 text-left">
            <li>• {t("error.action1")}</li>
            <li>• {t("error.action2")}</li>
            <li>• {t("error.action3")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
