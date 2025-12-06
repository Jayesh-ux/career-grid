/**
 * React Query hooks for employer profile.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  EmployerProfileResponse,
  CreateEmployerProfileRequest,
  UpdateEmployerProfileRequest,
} from '@/api/types/openapi';
import { EmployerProfileApi } from '@/lib/api';

/**
 * Hook: Get my employer profile.
 */
export function useMyEmployerProfile() {
  return useQuery({
    queryKey: ['my-employer-profile'],
    queryFn: () => EmployerProfileApi.getMe(),
  });
}

/**
 * Hook: Get employer profile by ID (public).
 */
export function useEmployerProfile(employerId: number) {
  return useQuery({
    queryKey: ['employer-profile', employerId],
    queryFn: () => EmployerProfileApi.getById(employerId),
    enabled: !!employerId,
  });
}

/**
 * Hook: Create employer profile.
 */
export function useCreateEmployerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEmployerProfileRequest) =>
      EmployerProfileApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-employer-profile'] });
      queryClient.invalidateQueries({
        queryKey: ['employer-profile-exists'],
      });
    },
  });
}

/**
 * Hook: Update my employer profile.
 */
export function useUpdateEmployerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateEmployerProfileRequest) =>
      EmployerProfileApi.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-employer-profile'] });
    },
  });
}

/**
 * Hook: Delete my employer profile.
 */
export function useDeleteEmployerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => EmployerProfileApi.deleteMe(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-employer-profile'] });
      queryClient.invalidateQueries({
        queryKey: ['employer-profile-exists'],
      });
    },
  });
}

/**
 * Hook: Check if user has employer profile.
 */
export function useHasEmployerProfile() {
  return useQuery({
    queryKey: ['employer-profile-exists'],
    queryFn: () => EmployerProfileApi.exists(),
  });
}
