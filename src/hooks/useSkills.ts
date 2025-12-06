/**
 * React Query hooks for skills management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SkillResponse, JobseekerSkillResponse, AddSkillRequest } from '@/api/types/openapi';
import { SkillsApi } from '@/lib/api';

/**
 * Hook: Get all available skills (master catalog).
 */
export function useSkillsCatalog() {
  return useQuery({
    queryKey: ['skills-catalog'],
    queryFn: () => SkillsApi.getCatalog(),
  });
}

/**
 * Hook: Get skill by ID.
 */
export function useSkill(skillId: number) {
  return useQuery({
    queryKey: ['skill', skillId],
    queryFn: () => SkillsApi.getSkillById(skillId),
    enabled: !!skillId,
  });
}

/**
 * Hook: Get my skills.
 */
export function useMySkills() {
  return useQuery({
    queryKey: ['my-skills'],
    queryFn: () => SkillsApi.getMySkills(),
  });
}

/**
 * Hook: Add skill to profile.
 */
export function useAddSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddSkillRequest) => SkillsApi.addSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-skills'] });
      queryClient.invalidateQueries({
        queryKey: ['profile-completion'],
      });
    },
  });
}

/**
 * Hook: Remove skill from profile.
 */
export function useRemoveSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skillId: number) => SkillsApi.removeSkill(skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-skills'] });
      queryClient.invalidateQueries({
        queryKey: ['profile-completion'],
      });
    },
  });
}
