"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const t = useTranslations("errorPages");
  const pathname = usePathname();

  // Extract locale from pathname
  const locale = pathname?.split("/")?.[1] || "en";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error icon - Kindle-style exclamation mark */}
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 border-4 border-[var(--eink-ink)] rounded-full flex items-center justify-center">
            <span className="text-4xl font-serif text-[var(--eink-ink)]">!</span>
          </div>
        </div>

        {/* Error code */}
        <h1 className="text-6xl font-serif font-bold text-[var(--eink-ink)] mb-4">
          404
        </h1>

        {/* Error title */}
        <h2 className="text-2xl font-serif font-semibold text-[var(--eink-ink-secondary)] mb-4">
          {t("notFound.title")}
        </h2>

        {/* Error description */}
        <p className="text-base text-[var(--eink-ink-tertiary)] mb-8 leading-relaxed">
          {t("notFound.description")}
        </p>

        {/* Action buttons - Kindle style */}
        <div className="space-y-3">
          <Link
            href={`/${locale}`}
            className="block w-full py-3 px-6 bg-[var(--eink-ink)] text-[var(--eink-paper)] font-sans text-sm font-medium border-2 border-[var(--eink-ink)] hover:bg-[var(--eink-ink-secondary)] hover:border-[var(--eink-ink-secondary)] transition-colors"
          >
            {t("notFound.backHome")}
          </Link>

          <button
            onClick={() => window.history.back()}
            className="block w-full py-3 px-6 bg-transparent text-[var(--eink-ink)] font-sans text-sm font-medium border-2 border-[var(--eink-border)] hover:border-[var(--eink-ink)] transition-colors"
          >
            {t("notFound.goBack")}
          </button>
        </div>

        {/* Helpful suggestions - Kindle style */}
        <div className="mt-12 pt-8 border-t border-[var(--eink-divider)]">
          <p className="text-sm text-[var(--eink-ink-muted)] mb-4">
            {t("notFound.suggestions")}
          </p>
          <ul className="text-sm text-[var(--eink-ink-tertiary)] space-y-2">
            <li>{t("notFound.suggestion1")}</li>
            <li>{t("notFound.suggestion2")}</li>
            <li>{t("notFound.suggestion3")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
