import { base_url } from "./env";

export const css = {
  padding: {
    sm: 10,
    md: 20,
    lg: 30,
  },
  border: {
    radius: {
      sm: 10,
      md: 20,
      full: 99999,
    },
  },
} as const;

export const invoiceDownloadUrl = (invoiceId: string) => {
  if (isNextJs)
    return `${process.env["NEXT_PUBLIC_API_URL"]}/api/booking/invoice/${invoiceId}`;
  else return `${base_url}/api/booking/invoice/${invoiceId}`;
};

const isNextJs = typeof window !== "undefined" && (window as any).__NEXT_DATA__;
