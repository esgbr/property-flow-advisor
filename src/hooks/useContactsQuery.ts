
import { useQuery } from "@tanstack/react-query";
export function useContactsQuery() {
  // Placeholder for potential real Supabase/api integration
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => [],
  });
}
