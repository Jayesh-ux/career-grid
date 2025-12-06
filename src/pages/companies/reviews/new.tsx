/**
 * Submit review page.
 * Form to submit a review for a company using react-hook-form + zod.
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSubmitReview } from '@/hooks/useReviews';
import { CreateCompanyReviewSchema, type CreateCompanyReviewFormData } from '@/lib/validation';
import { CreateCompanyReviewRequest } from '@/api/types/openapi';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { showToast } from '@/components/Toast';

export function SubmitReviewPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const id = parseInt(companyId || '0', 10);

  const { mutate: submitReview, isPending } = useSubmitReview(id);

  const form = useForm<CreateCompanyReviewFormData>({
    resolver: zodResolver(CreateCompanyReviewSchema),
    defaultValues: {
      overallRating: 3,
      workLifeBalanceRating: 3,
      managementRating: 3,
      benefitsRating: 3,
      jobSecurityRating: 3,
      pros: '',
      cons: '',
      jobTitle: '',
      employmentStatus: 'CURRENT',
      anonymous: false,
    },
  });

  const onSubmit = (data: CreateCompanyReviewFormData) => {
    submitReview(data as CreateCompanyReviewRequest, {
      onSuccess: () => {
        showToast.success('Review submitted successfully! Pending approval.');
        navigate(`/companies/${id}`);
      },
      onError: (error: any) => {
        showToast.error(
          error?.response?.data?.message || 'Failed to submit review'
        );
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
          <CardDescription>
            Share your experience working at this company
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Overall Rating */}
              <FormField
                control={form.control}
                name="overallRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall Rating *</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Slider
                          min={1}
                          max={5}
                          step={0.5}
                          value={[field.value || 3]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full"
                        />
                        <span className="text-lg font-bold w-12 text-center">
                          {field.value?.toFixed(1)}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category Ratings */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="workLifeBalanceRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Work-Life Balance</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                          }
                          placeholder="1-5"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="benefitsRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Benefits</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                          }
                          placeholder="1-5"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="managementRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Management</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                          }
                          placeholder="1-5"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobSecurityRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Job Security</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                          }
                          placeholder="1-5"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pros"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pros</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What did you like?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cons</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What could improve?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Job Title */}
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Employment Status */}
              <FormField
                control={form.control}
                name="employmentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Status *</FormLabel>
                    <FormControl>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="CURRENT"
                            checked={field.value === 'CURRENT'}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          Current Employee
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="FORMER"
                            checked={field.value === 'FORMER'}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          Former Employee
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Anonymous Toggle */}
              <FormField
                control={form.control}
                name="anonymous"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="mb-0">Submit anonymously</FormLabel>
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/companies/${id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
