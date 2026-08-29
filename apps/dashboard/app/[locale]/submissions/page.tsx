"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import {
  DISABILITIES,
  ageInYears,
  disabilityLabel,
  type DisabilityCode,
} from "@talent/domain";
import type { SubmissionListItem, SubmissionListPage } from "@talent/db";
import { createClient } from "@talent/db/browser";
import SubmissionDetail from "@/components/SubmissionDetail";

const PAGE_SIZE = 25;

/**
 * Individual submissions, searchable and filterable.
 *
 * The legacy backend exposed four endpoints and none of them returned a single record --
 * only aggregates -- so a specialist could see that ADHD was the most common category
 * and never see which children that referred to. It also stored only the computed
 * percentages, so even a new endpoint could not have shown the answers. Persisting the
 * `answers` array is what makes the per-child drill-down possible at all.
 *
 * Paging, filtering and search happen in Postgres (list_submissions), not by fetching
 * every row and filtering in the browser.
 */
export default function SubmissionsPage() {
  const t = useTranslations("Submissions");
  const locale = useLocale();

  const [page, setPage] = useState<SubmissionListPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [surveyType, setSurveyType] = useState<"" | "Parents" | "Teachers">("");
  const [disability, setDisability] = useState<"" | DisabilityCode>("");
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<SubmissionListItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("list_submissions", {
        search: appliedSearch || undefined,
        survey_type_filter: surveyType || undefined,
        disability_filter: disability || undefined,
        page_size: PAGE_SIZE,
        page_offset: offset,
      });
      if (rpcError) throw rpcError;
      setPage(data as unknown as SubmissionListPage);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : t("loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [appliedSearch, surveyType, disability, offset, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const total = page?.total ?? 0;
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + PAGE_SIZE, total);

  function resetToFirstPage() {
    setOffset(0);
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{t("subtitle")}</p>
        </header>

        {/* Filters */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 mb-6">
          <form
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setAppliedSearch(search.trim());
              resetToFirstPage();
            }}
          >
            <div className="md:col-span-2">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t("search")}
              </label>
              <div className="relative">
                <Search
                  className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="w-full ps-9 pe-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="surveyType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t("surveyType")}
              </label>
              <select
                id="surveyType"
                value={surveyType}
                onChange={(e) => {
                  setSurveyType(e.target.value as typeof surveyType);
                  resetToFirstPage();
                }}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{t("all")}</option>
                <option value="Parents">{t("parents")}</option>
                <option value="Teachers">{t("teachers")}</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="disability"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t("category")}
              </label>
              <select
                id="disability"
                value={disability}
                onChange={(e) => {
                  setDisability(e.target.value as typeof disability);
                  resetToFirstPage();
                }}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{t("all")}</option>
                {DISABILITIES.map((d) => (
                  <option key={d.code} value={d.code}>
                    {disabilityLabel(d.code, locale)}
                  </option>
                ))}
              </select>
            </div>
          </form>

          {(appliedSearch || surveyType || disability) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setAppliedSearch("");
                setSurveyType("");
                setDisability("");
                resetToFirstPage();
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              {t("clearFilters")}
            </button>
          )}
        </div>

        {/* Results */}
        {error ? (
          <div className="rounded-2xl p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
            {error}
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-600 dark:text-gray-300">
                  <tr>
                    <Th>{t("child")}</Th>
                    <Th>{t("school")}</Th>
                    <Th>{t("age")}</Th>
                    <Th>{t("surveyType")}</Th>
                    <Th>{t("category")}</Th>
                    <Th>{t("talent")}</Th>
                    <Th>{t("outcome")}</Th>
                    <Th>{t("date")}</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loading &&
                    Array.from({ length: 6 }, (_, i) => (
                      <tr key={`skeleton-${i}`}>
                        <td colSpan={8} className="px-4 py-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </td>
                      </tr>
                    ))}

                  {!loading && page?.items.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
                      >
                        {t("noResults")}
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    page?.items.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelected(item)}
                        className="cursor-pointer hover:bg-blue-50/60 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <Td className="font-medium text-gray-900 dark:text-white">
                          {item.childName}
                        </Td>
                        <Td>{item.schoolName}</Td>
                        <Td>{ageInYears(item.birthDate, item.checkupDate)}</Td>
                        <Td>{t(item.surveyType === "Parents" ? "parents" : "teachers")}</Td>
                        <Td>
                          {item.disability
                            ? disabilityLabel(item.disability, locale)
                            : "—"}
                        </Td>
                        <Td>{item.talentPercent.toFixed(1)}%</Td>
                        <Td>
                          <Outcome item={item} t={t} />
                        </Td>
                        <Td className="whitespace-nowrap">{item.checkupDate}</Td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("showing", { from, to, total })}
              </p>
              <div className="flex items-center gap-2">
                <PagerButton
                  onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                  disabled={offset === 0 || loading}
                  label={t("previous")}
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
                </PagerButton>
                <PagerButton
                  onClick={() => setOffset(offset + PAGE_SIZE)}
                  disabled={to >= total || loading}
                  label={t("next")}
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
                </PagerButton>
              </div>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <SubmissionDetail
          submission={selected}
          locale={locale}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" className="px-4 py-3 text-start font-semibold whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-gray-700 dark:text-gray-300 ${className}`}>{children}</td>;
}

function Outcome({
  item,
  t,
}: {
  item: SubmissionListItem;
  t: ReturnType<typeof useTranslations>;
}) {
  if (item.isTalented && item.isDisabled) {
    return <Badge tone="green">{t("dualExceptional")}</Badge>;
  }
  if (item.isDisabled) return <Badge tone="amber">{t("disabledOnly")}</Badge>;
  if (item.isTalented) return <Badge tone="blue">{t("talentedOnly")}</Badge>;
  return <Badge tone="gray">{t("neither")}</Badge>;
}

function Badge({
  tone,
  children,
}: {
  tone: "green" | "amber" | "blue" | "gray";
  children: React.ReactNode;
}) {
  const tones = {
    green: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  } as const;
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${tones[tone]}`}>
      {children}
    </span>
  );
}

function PagerButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}
