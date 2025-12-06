/**
 * React Query hooks for company reviews.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CompanyReviewResponse, CreateCompanyReviewRequest, UpdateCompanyReviewRequest } from '@/api/types/openapi';
import { CompanyReviewApi } from '@/lib/api';

/**
 * Hook: Get approved reviews for a company.
 */
export function useCompanyReviews(companyId: number, onlyApproved: boolean = true) {
  return useQuery({
    queryKey: ['company-reviews', companyId, onlyApproved],
    queryFn: () => CompanyReviewApi.getCompanyReviews(companyId, onlyApproved),
    enabled: !!companyId,
  });
}

/**
 * Hook: Get my reviews (all reviews submitted by authenticated user).
 */
export function useMyReviews() {
  return useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => CompanyReviewApi.getMyReviews(),
  });
}

/**
 * Hook: Submit review for a company.
 */
export function useSubmitReview(companyId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCompanyReviewRequest) =>
      CompanyReviewApi.submitReview(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-reviews', companyId],
      });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
    },
  });
}

/**
 * Hook: Update review.
 */
export function useUpdateReview(reviewId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCompanyReviewRequest) =>
      CompanyReviewApi.update(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['company-reviews'] });
    },
  });
}

/**
 * Hook: Delete review.
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: number) => CompanyReviewApi.delete(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['company-reviews'] });
    },
  });
}

/**
 * Hook: Approve review (admin only).
 */
export function useApproveReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: number) => CompanyReviewApi.approve(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-reviews'] });
    },
  });
}

/**
 * Hook: Reject review (admin only).
 */
export function useRejectReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: number) => CompanyReviewApi.reject(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-reviews'] });
    },
  });
}
