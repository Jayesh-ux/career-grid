/**
 * Jobseeker profile page (/profile/jobseeker/me).
 * Shows profile info, skills, work experience, and education.
 */

import React, { useState } from 'react';
import { useMyJobseekerProfile } from '@/hooks/useProfile';
import { useMySkills, useAddSkill, useSkillsCatalog } from '@/hooks/useSkills';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddSkillSchema, type AddSkillFormData } from '@/lib/validation';
import { AddSkillRequest } from '@/api/types/openapi';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { showToast } from '@/components/Toast';

export function JobseekerProfilePage() {
  const { data: profile, isLoading: isLoadingProfile } =
    useMyJobseekerProfile();
  const { data: mySkills = [], isLoading: isLoadingSkills } = useMySkills();
  const { data: skillsCatalog = [] } = useSkillsCatalog();
  const { mutate: addSkill, isPending: isAddingSkill } = useAddSkill();

  const form = useForm<AddSkillFormData>({
    resolver: zodResolver(AddSkillSchema),
    defaultValues: {
      skillId: 0,
      proficiencyLevel: 'INTERMEDIATE',
      yearsOfExperience: 0,
    },
  });

  const onAddSkill = (data: AddSkillFormData) => {
    addSkill(data as AddSkillRequest, {
      onSuccess: () => {
        showToast.success('Skill added successfully!');
        form.reset();
      },
      onError: (error: any) => {
        showToast.error(
          error?.response?.data?.message || 'Failed to add skill'
        );
      },
    });
  };

  // Get already-added skill IDs
  const addedSkillIds = new Set(mySkills.map((s) => s.skillId));
  const availableSkills = skillsCatalog.filter(
    (s) => !addedSkillIds.has(s.skillId)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {/* Profile Card */}
      {isLoadingProfile ? (
        <Skeleton className="h-64 mb-8" />
      ) : profile ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Name:</strong> {profile.firstName} {profile.lastName}
            </p>
            <p>
              <strong>Current Location:</strong> {profile.currentLocation || 'N/A'}
            </p>
            <p>
              <strong>Preferred Location:</strong> {profile.preferredLocation || 'N/A'}
            </p>
            <p>
              <strong>Bio:</strong> {profile.bio || 'N/A'}
            </p>
            {profile.totalExperienceMonths !== undefined && (
              <p>
                <strong>Total Experience:</strong> {profile.totalExperienceMonths} months
              </p>
            )}
            <p>
              <strong>Current Salary:</strong> ₹
              {profile.currentSalary?.toLocaleString() || 'N/A'}
            </p>
            <p>
              <strong>Expected Salary:</strong> ₹
              {profile.expectedSalary?.toLocaleString() || 'N/A'}
            </p>
            {profile.bio && (
              <p>
                <strong>Bio:</strong> {profile.bio}
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="text-red-600">Profile not found.</p>
      )}

      {/* Skills Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            Manage your professional skills and expertise
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Current Skills */}
          {isLoadingSkills ? (
            <Skeleton className="h-24" />
          ) : mySkills.length === 0 ? (
            <p className="text-gray-500">No skills added yet.</p>
          ) : (
            <div className="space-y-2">
              {mySkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{skill.skill.skillName}</p>
                    <p className="text-sm text-gray-500">
                      {skill.proficiencyLevel} •{' '}
                      {skill.yearsOfExperience} years
                    </p>
                  </div>
                  <Badge>{skill.proficiencyLevel}</Badge>
                </div>
              ))}
            </div>
          )}

          {/* Add Skill Form */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">Add a Skill</h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onAddSkill)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="skillId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill *</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(value) =>
                            field.onChange(parseInt(value, 10))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a skill" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSkills.map((skill) => (
                              <SelectItem
                                key={skill.skillId}
                                value={String(skill.skillId)}
                              >
                                {skill.skillName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="proficiencyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proficiency Level *</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BEGINNER">Beginner</SelectItem>
                            <SelectItem value="INTERMEDIATE">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="ADVANCED">Advanced</SelectItem>
                            <SelectItem value="EXPERT">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseInt(e.target.value, 10) : 0
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isAddingSkill} className="w-full">
                  {isAddingSkill ? 'Adding...' : 'Add Skill'}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
