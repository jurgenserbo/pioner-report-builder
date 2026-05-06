import { Skeleton } from "@marlindtako/pioneer-design-system";

export function AccountManagementSkeleton() {
  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="mx-auto w-full flex flex-col gap-4" style={{ maxWidth: 1440, padding: "16px 24px 24px 24px" }}>
        {/* Header card */}
        <div className="rounded-lg bg-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-20 ml-auto" />
          </div>
          <div className="flex gap-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 rounded-lg border p-6 flex items-center gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-9 w-16 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Account group cards */}
        {[1, 2].map((g) => (
          <div key={g} className="rounded-lg bg-card overflow-hidden">
            <div className="flex items-center px-3 pr-6 border-b" style={{ height: 64 }}>
              <Skeleton className="h-5 w-52" />
              <Skeleton className="h-9 w-28 ml-auto" />
            </div>
            <div className="p-4 flex flex-col gap-3">
              {[1, 2, 3].map((r) => (
                <div key={r} className="flex items-center gap-4">
                  <Skeleton className="size-8 rounded flex-shrink-0" />
                  <div className="flex flex-col gap-1 w-40">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  {[1, 2, 3, 4, 5, 6, 7].map((c) => (
                    <Skeleton key={c} className="h-4 w-10 mx-auto" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TemplatesGallerySkeleton() {
  return (
    <div className="flex-1 overflow-hidden bg-background" style={{ padding: "16px 48px 48px 48px" }}>
      <div className="bg-card rounded-lg overflow-hidden flex flex-col h-full">
        {/* Sticky header */}
        <div className="flex flex-col gap-6 flex-shrink-0" style={{ paddingTop: 24, paddingLeft: 112, paddingRight: 112, paddingBottom: 24 }}>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-9 w-52 mt-1" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto" style={{ paddingLeft: 112, paddingRight: 112, paddingBottom: 96 }}>
          <div className="flex flex-col gap-12">
            {[1, 2].map((row) => (
              <div key={row} className="flex gap-6">
                {[1, 2, 3, 4].map((col) => (
                  <div key={col} className="flex-1 flex flex-col gap-4">
                    <Skeleton className="w-full h-[176px] rounded-[14px]" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16 rounded-md" />
                      <Skeleton className="h-8 w-20 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplateDetailSkeleton() {
  return (
    <div className="flex-1 overflow-hidden bg-background" style={{ padding: "16px 48px 48px 48px" }}>
      <div className="bg-card rounded-lg overflow-hidden flex flex-col h-full">
        <div className="flex flex-col gap-6 items-center w-full overflow-auto" style={{ paddingTop: 24, paddingBottom: 96, paddingLeft: 112, paddingRight: 112 }}>

          {/* Header — matches actual: left (back + title+badges + desc) | right (switcher + button) */}
          <div className="flex gap-12 items-center w-full" style={{ maxWidth: 1200 }}>
            <div className="flex flex-1 flex-col gap-2 items-start min-w-0">
              <Skeleton className="h-8 w-16" /> {/* Back button */}
              <div className="flex gap-2 items-center">
                <Skeleton className="h-9 w-56" /> {/* Title */}
                <Skeleton className="h-8 w-10 rounded-md" /> {/* Badge 1 */}
                <Skeleton className="h-8 w-20 rounded-md" /> {/* Badge 2 */}
              </div>
              <Skeleton className="h-4 w-2/3" /> {/* Description */}
            </div>
            <div className="flex gap-2 items-center flex-shrink-0">
              <Skeleton className="h-10 w-48" /> {/* Account switcher */}
              <Skeleton className="h-10 w-32" /> {/* Use template */}
            </div>
          </div>

          {/* Main content card — matches actual: side panel (300px) + table panel */}
          <div className="flex items-start w-full overflow-hidden rounded-lg border" style={{ maxWidth: 1200, height: 920 }}>

            {/* Side panel — 4 section cards */}
            <div className="flex flex-col gap-2 p-2 flex-shrink-0 self-stretch overflow-y-auto" style={{ width: 300, background: "#f4f2f6" }}>
              {[5, 3, 4, 4].map((itemCount, s) => (
                <div key={s} className="rounded-lg border bg-card overflow-hidden flex-shrink-0">
                  <div className="px-4 py-3 border-b flex flex-col gap-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  {Array.from({ length: itemCount }).map((_, i) => (
                    <div key={i} className="px-4 border-b last:border-b-0 flex items-center" style={{ height: 40 }}>
                      <Skeleton className="h-3 w-32" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Table panel */}
            <div className="flex flex-1 flex-col self-stretch min-w-0">
              {/* Table header */}
              <div className="px-6 py-6 border-b flex flex-col gap-1 flex-shrink-0">
                <Skeleton className="h-6 w-44" />
                <Skeleton className="h-3 w-96" />
              </div>

              {/* Table — 7 columns, 3 rows matching actual data */}
              <div className="overflow-auto w-full">
                <div className="flex items-center bg-muted border-b px-4 gap-6 h-10 flex-shrink-0">
                  {[160, 100, 120, 120, 100, 110, 140].map((w, i) => (
                    <Skeleton key={i} style={{ width: w, minWidth: w }} className="h-3" />
                  ))}
                </div>
                {[1, 2, 3].map((r) => (
                  <div key={r} className="flex items-center border-b px-4 gap-6" style={{ height: 56 }}>
                    {[160, 100, 120, 120, 100, 110, 140].map((w, i) => (
                      <Skeleton key={i} style={{ width: w, minWidth: w }} className="h-3" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
