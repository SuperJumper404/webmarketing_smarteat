function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizeMegaMenu(menu) {
  if (!menu || typeof menu !== "object" || Array.isArray(menu)) return null;
  if (!isNonEmptyString(menu.label) || !isNonEmptyString(menu.fallbackHref)) return null;
  if (!Array.isArray(menu.groups)) return null;

  const groups = menu.groups.filter(
    (group) =>
      group &&
      typeof group === "object" &&
      isNonEmptyString(group.title) &&
      Array.isArray(group.items) &&
      group.items.length > 0,
  );

  if (groups.length === 0) return null;
  return { ...menu, groups };
}
