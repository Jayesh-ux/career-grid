/**
 * Company detail page.
 * Shows company info, reviews, and button to add review.
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompany } from '@/hooks/useCompanies';
import { useCompanyReviews } from '@/hooks/useReviews';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Globe, Users } from 'lucide-react';
import { showToast } from '@/components/Toast';

export function CompanyDetailPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const id = parseInt(companyId || '0', 10);

  const { data: company, isLoading: isLoadingCompany, error: companyError } =
    useCompany(id);
  const { data: reviews = [], isLoading: isLoadingReviews, error: reviewsError } =
    useCompanyReviews(id, true);

  if (companyError || reviewsError) {
    showToast.error('Failed to load company details');
  }

  if (isLoadingCompany) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Company not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Company Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl">{company.companyName}</CardTitle>
              {company.industry && (
                <CardDescription className="mt-2">{company.industry}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {company.description && (
            <p className="text-gray-700">{company.description}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {company.rating !== undefined && (
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">
                    {company.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
            )}

            {company.reviewCount !== undefined && (
              <div>
                <p className="font-bold text-lg">{company.reviewCount}</p>
                <p className="text-xs text-gray-500">Reviews</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {company.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {company.website}
                </a>
              </div>
            )}
          </div>

          <Button
            onClick={() => navigate(`/companies/${id}/reviews/new`)}
            className="w-full mt-4"
          >
            Write a Review
          </Button>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>

        {isLoadingReviews ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.reviewId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{review.reviewTitle || review.jobTitle}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">
                          {review.overallRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {review.jobTitle}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {review.pros && (
                    <p>
                      <strong>Pros:</strong> {review.pros}
                    </p>
                  )}
                  {review.cons && (
                    <p>
                      <strong>Cons:</strong> {review.cons}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : 'Recently'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
