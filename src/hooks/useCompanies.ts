/**
 * React Query hooks for company endpoints.
 * Handles: list, detail, reviews, create, update, delete, search.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CompanyResponse,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from '@/api/types/openapi';
import { CompanyApi } from '@/lib/api';

/**
 * Hook: Get paginated list of companies.
 */
export function useCompanies(page: number = 0, size: number = 10) {
  return useQuery({
    queryKey: ['companies', page, size],
    queryFn: () => CompanyApi.getAll({ page, size }),
  });
}

/**
 * Hook: Get company by ID.
 */
export function useCompany(companyId: number) {
  return useQuery({
    queryKey: ['company', companyId],
    queryFn: () => CompanyApi.getById(companyId),
    enabled: !!companyId,
  });
}

/**
 * Hook: Search companies by name.
 */
export function useSearchCompanies(name: string) {
  return useQuery({
    queryKey: ['companies-search', name],
    queryFn: () => CompanyApi.search(name),
    enabled: !!name && name.length > 0,
  });
}

/**
 * Hook: Get my companies.
 */
export function useMyCompanies() {
  return useQuery({
    queryKey: ['my-companies'],
    queryFn: () => CompanyApi.getMyCompanies(),
  });
}

/**
 * Hook: Create company.
 */
export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCompanyRequest) => CompanyApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['my-companies'] });
    },
  });
}

/**
 * Hook: Update company.
 */
export function useUpdateCompany(companyId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCompanyRequest) =>
      CompanyApi.update(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

/**
 * Hook: Delete company.
 */
export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (companyId: number) => CompanyApi.delete(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['my-companies'] });
    },
  });
}
