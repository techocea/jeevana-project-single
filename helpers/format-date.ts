export const formatDate = (dateVal: any) => {
  if (!dateVal) return undefined;

  const date = dateVal instanceof Date ? dateVal : new Date(dateVal);

  if (isNaN(date.getTime())) return "";

  // Extracts only the 'YYYY-MM-DD' segment safely regardless of local timezones
  return date.toISOString().split("T")[0];
};
