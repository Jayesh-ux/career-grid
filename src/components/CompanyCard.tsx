/**
 * Company card component for list pages.
 * Shows company name, rating, review count, and links.
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Users } from 'lucide-react';
import type { CompanyResponse } from '@/api/types/openapi';

interface CompanyCardProps {
  company: CompanyResponse;
  onViewDetails?: (companyId: number) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onViewDetails,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{company.companyName}</CardTitle>
            {company.industry && (
              <CardDescription>{company.industry}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {company.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {company.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm">
          {company.rating !== undefined && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{company.rating.toFixed(1)}</span>
            </div>
          )}
          {company.reviewCount !== undefined && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-gray-400" />
              <span>{company.reviewCount} reviews</span>
            </div>
          )}
        </div>

        {company.website && (
          <p className="text-xs text-blue-600 truncate">
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              {company.website}
            </a>
          </p>
        )}

        {onViewDetails && (
          <Button
            variant="default"
            size="sm"
            className="w-full mt-4"
            onClick={() => onViewDetails(company.companyId!)}
          >
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
