import type {
  CmsSection,
  StatItem,
  IndustryItem,
  WhyChooseItem,
  ProcessStep,
} from "./types";

export function findSection(
  sections: CmsSection[],
  type: string,
  cmsKey?: string
): CmsSection | undefined {
  return sections.find((s) => {
    if (s.sectionType !== type) return false;
    if (cmsKey && type === "CUSTOM") {
      try {
        const extra = s.extraData ? JSON.parse(s.extraData) : {};
        return extra.cmsKey === cmsKey;
      } catch {
        return false;
      }
    }
    return true;
  });
}

export function parseExtraData(section?: CmsSection): Record<string, unknown> {
  if (!section?.extraData) return {};
  try {
    return JSON.parse(section.extraData) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function parseStats(section?: CmsSection): StatItem[] {
  if (!section) return [];
  const extra = parseExtraData(section);
  const map: Record<string, string> = {
    workforce: "Workforce Deployed",
    clients: "Business Clients",
    projects: "Service Requests",
    satisfaction: "Customer Satisfaction",
  };
  return Object.entries(map)
    .map(([key, label]) => ({
      value: (extra[key] as string) ?? "",
      label,
    }))
    .filter((s) => s.value);
}

export function getListItems<T>(
  sections: CmsSection[],
  cmsKey: string
): T[] {
  const section = findSection(sections, "CUSTOM", cmsKey);
  if (!section) return [];
  const extra = parseExtraData(section);
  return ((extra.items as T[]) ?? []) as T[];
}

export function getIndustries(sections: CmsSection[]): IndustryItem[] {
  return getListItems<IndustryItem>(sections, "industries");
}

export function getWhyChoose(sections: CmsSection[]): WhyChooseItem[] {
  return getListItems<WhyChooseItem>(sections, "why-choose");
}

export function getProcess(sections: CmsSection[]): ProcessStep[] {
  return getListItems<ProcessStep>(sections, "process");
}
