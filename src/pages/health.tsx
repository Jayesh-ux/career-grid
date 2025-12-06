/**
 * Health check test page.
 * Quick test of backend connectivity.
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function getAuthHeader() {
  try {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function HealthCheckPage() {
  const { data: health, isLoading: healthLoading, refetch: refetchHealth } =
    useQuery({
      queryKey: ['health-check'],
      queryFn: async () => {
        const res = await fetch(`${API_BASE}/api/v1/health`, {
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          credentials: 'include',
        });
        return res.ok ? res.json() : Promise.reject(await res.text());
      },
      enabled: false,
    });

  const { data: readiness, isLoading: readinessLoading, refetch: refetchReadiness } =
    useQuery({
      queryKey: ['readiness-check'],
      queryFn: async () => {
        const res = await fetch(`${API_BASE}/api/v1/health/ready`, {
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          credentials: 'include',
        });
        return res.ok ? res.json() : Promise.reject(await res.text());
      },
      enabled: false,
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Backend Health Check</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Check */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Health Check</CardTitle>
            <CardDescription>/api/v1/health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {health ? (
              <div className="space-y-2">
                <Badge variant="outline" className="bg-green-50">
                  ✓ Healthy
                </Badge>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-48">
                  {JSON.stringify(health, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-500">Not checked yet</p>
            )}
            <Button
              onClick={() => refetchHealth()}
              disabled={healthLoading}
              className="w-full"
            >
              {healthLoading ? 'Checking...' : 'Check Health'}
            </Button>
          </CardContent>
        </Card>

        {/* Readiness Check */}
        <Card>
          <CardHeader>
            <CardTitle>Readiness Check</CardTitle>
            <CardDescription>/api/v1/health/ready</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {readiness ? (
              <div className="space-y-2">
                <Badge variant="outline" className="bg-green-50">
                  ✓ Ready
                </Badge>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-48">
                  {JSON.stringify(readiness, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-500">Not checked yet</p>
            )}
            <Button
              onClick={() => refetchReadiness()}
              disabled={readinessLoading}
              className="w-full"
            >
              {readinessLoading ? 'Checking...' : 'Check Readiness'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
