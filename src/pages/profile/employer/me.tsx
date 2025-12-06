/**
 * Employer profile page (/profile/employer/me).
 * Shows employer profile info and allows updates.
 */

import React from 'react';
import { useMyEmployerProfile } from '@/hooks/useEmployerProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function EmployerProfilePage() {
  const { data: profile, isLoading } = useMyEmployerProfile();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Employer profile not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Employer Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>{profile.companyName}</CardTitle>
          <CardDescription>Company ID: {profile.companyId}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          {profile.companyDescription && (
            <p>
              <strong>Description:</strong> {profile.companyDescription}
            </p>
          )}
          {profile.companyWebsite && (
            <p>
              <strong>Website:</strong> {profile.companyWebsite}
            </p>
          )}
          {profile.contactPersonName && (
            <p>
              <strong>Contact Person:</strong> {profile.contactPersonName}
            </p>
          )}
          {profile.contactPersonDesignation && (
            <p>
              <strong>Designation:</strong> {profile.contactPersonDesignation}
            </p>
          )}
          {profile.rating && (
            <p>
              <strong>Rating:</strong> {profile.rating.toFixed(1)} stars
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
