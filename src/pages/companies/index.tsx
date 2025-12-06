/**
 * Companies list page.
 * Shows paginated list of companies with search and filtering.
 *
 * Modified to tolerate different paginated response shapes:
 * - { companies: CompanyResponse[] }
 * - { content: CompanyResponse[] }
 * - { items: CompanyResponse[] }
 * - [] (array returned directly)
 *
 * It also logs the raw response (remove the console.log when confirmed).
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanies } from '@/hooks/useCompanies';
import { CompanyCard } from '@/components/CompanyCard';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { showToast } from '@/components/Toast';

export function CompaniesListPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
  const { data, isLoading, error } = useCompanies(currentPage, pageSize);

  // Debug: log raw response so you can see the exact shape (remove later)
  useEffect(() => {
    if (data) {
      // eslint-disable-next-line no-console
      console.log('useCompanies response:', data);
    }
  }, [data]);

  // Normalize companies from various possible paginated shapes
  const companies: any[] =
    (data && Array.isArray((data as any)?.companies) && (data as any).companies) ||
    (data && Array.isArray((data as any)?.content) && (data as any).content) ||
    (data && Array.isArray((data as any)?.items) && (data as any).items) ||
    (Array.isArray(data) && data) ||
    [];

  // Update filtered companies when search term or companies change
  useEffect(() => {
    if (!companies) {
      setFilteredCompanies([]);
      return;
    }

    if (!searchTerm.trim()) {
      setFilteredCompanies(companies);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = companies.filter((company: any) =>
      (company?.companyName ?? '')
        .toString()
        .toLowerCase()
        .includes(term) ||
      (company?.description ?? '')
        .toString()
        .toLowerCase()
        .includes(term) ||
      (company?.industry ?? '')
        .toString()
        .toLowerCase()
        .includes(term) ||
      (company?.location ?? '')
        .toString()
        .toLowerCase()
        .includes(term)
    );
    setFilteredCompanies(filtered);
  }, [searchTerm, companies]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0); // Reset to first page on search
  };

  if (error) {
    // show toast once (optional)
    showToast.error('Failed to load companies');
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Error loading companies. Please try again.</p>
      </div>
    );
  }

  // If your API returns page info under a different key, adapt this accordingly.
  const pageInfo = (data as any)?.page ?? (data as any)?.pagination ?? null;
  const totalPages = pageInfo?.totalPages ?? pageInfo?.totalPagesCount ?? 1;
  const displayCompanies = searchTerm.trim() ? filteredCompanies : companies;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Companies</h1>
        <Button onClick={() => navigate('/companies/new')}>
          Add Company
        </Button>
      </div>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search companies by name, industry, or location..."
          className="max-w-md"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchTerm && (
          <p className="text-sm text-muted-foreground mt-2">
            Found {displayCompanies.length} company(ies) matching "{searchTerm}"
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : displayCompanies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm ? "No companies found matching your search." : "No companies found."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {displayCompanies.map((company: any) => (
              <CompanyCard
                key={company?.companyId ?? company?.id ?? JSON.stringify(company)}
                company={company}
                onViewDetails={(id: number | string) => navigate(`/companies/${id}`)}
              />
            ))}
          </div>

          {!searchTerm && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
