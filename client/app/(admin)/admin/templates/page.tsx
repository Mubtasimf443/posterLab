/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import { toast } from "@/components/shadcn/toast";
import Loader from "@/components/ui/Loader";
import { SERVER_URL } from "@/lib/config/env";

interface ITemplate {
  _id: string;
  title: string;
  occasionType: string;
  thumbnailUrl: string;
  layoutConfig: {
    photoSlots: string[];
    textSlots: string[];
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  createdAt: string; // JSON turns Date into an ISO string
}

const COLOR_KEYS = ["primary", "secondary", "accent"] as const;

export default function TemplatesPage() {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<ITemplate[]>([]);

  useEffect(() => {
    (async function () {
      try {
        const response = await fetch(`${SERVER_URL}/api/templates/`, {
          credentials: "include",
          cache: "no-cache",
        });

        if (!response.ok) {
          toast.add({ title: "Failed to Load templates" });
          return;
        }

        const { data } = await response.json();
        setTemplates(data.templates);
      } catch (error) {
        console.error(error);
        toast.add({ title: "Failed to Load templates" });
      } finally {
        setLoading(false); // runs on success, failure and early return
      }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Templates</h1>

      {templates.length === 0 ? (
        <p className="text-sm text-muted-foreground">No templates found.</p>
      ) : (
        <Accordion className="w-full">
          {templates.map((t) => (
            <AccordionItem key={t._id} value={t._id} className={'shadow border-b border-gray-200 p-4'}>
              {/* Top: title + occasionType */}
              <AccordionTrigger >
                <div className="flex w-full items-center justify-between pr-4">
                  <span className="font-medium">{t.title}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {t.occasionType}
                  </span>

                </div>
              </AccordionTrigger>

              {/* Bottom: full data */}
              <AccordionContent>
                <div className="space-y-5 px-1">
                  <div className="flex gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.thumbnailUrl}
                      alt={t.title}
                      className="h-28 w-28 rounded-md border object-cover"
                    />
                    <dl className="space-y-1 text-sm">
                      <div>
                        <dt className="inline text-muted-foreground">ID: </dt>
                        <dd className="inline">{t._id}</dd>
                      </div>
                      <div>
                        <dt className="inline text-muted-foreground">Title: </dt>
                        <dd className="inline">{t.title}</dd>
                      </div>
                      <div>
                        <dt className="inline text-muted-foreground">Occasion: </dt>
                        <dd className="inline">{t.occasionType}</dd>
                      </div>
                      <div>
                        <dt className="inline text-muted-foreground">Created: </dt>
                        <dd className="inline">
                          {new Date(t.createdAt).toLocaleString()}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <SlotList title="Photo slots" items={t.layoutConfig.photoSlots} />
                  <SlotList title="Text slots" items={t.layoutConfig.textSlots} />

                  <div>
                    <h3 className="mb-2 text-sm font-medium">Color scheme</h3>
                    <div className="flex flex-wrap gap-6">
                      {COLOR_KEYS.map((key) => (
                        <div key={key} className="flex items-center gap-2">
                          <span
                            className="h-6 w-6 rounded border"
                            style={{ backgroundColor: t.layoutConfig.colorScheme?.[key] }}
                          />
                          <span className="text-sm capitalize">
                            {key}: {t.layoutConfig.colorScheme?.[key] ?? "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </main>
  );
}

function SlotList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium">{title}</h3>
      {items?.length ? (
        <div className="flex flex-wrap gap-2">
          {items.map((slot, i) => (
            <span key={i} className="rounded border bg-muted px-2 py-1 text-xs">
              {slot}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">None</p>
      )}
    </div>
  );
}