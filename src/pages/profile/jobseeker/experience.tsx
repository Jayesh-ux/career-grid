/**
 * Work Experience Management Page
 * Add, edit, delete work experiences
 */

import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  useMyWorkExperience,
  useAddWorkExperience,
  useUpdateWorkExperience,
  useDeleteWorkExperience,
} from '@/hooks/useProfile';
import { useMyJobseekerProfile } from '@/hooks/useProfile';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Edit, Plus } from 'lucide-react';
import { EmploymentType, type AddWorkExperienceRequest, type UpdateWorkExperienceRequest } from '@/lib/api';
import { showToast } from '@/components/Toast';

export function WorkExperiencePage() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyJobseekerProfile();
  const { data: experiences = [], isLoading: experiencesLoading } = useMyWorkExperience();
  const addExperience = useAddWorkExperience();
  const deleteExperienceMutation = useDeleteWorkExperience();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<AddWorkExperienceRequest>({
    companyName: '',
    jobTitle: '',
    employmentType: EmploymentType.FULL_TIME,
    startDate: '',
    endDate: '',
    isCurrent: false,
    jobDescription: '',
    location: '',
    salary: undefined,
  });

  // Create update mutation for editing
  const updateExperienceMutation = useUpdateWorkExperience(editingId || 0);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (profileLoading || experiencesLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-yellow-800">Please create a jobseeker profile first.</p>
            <Button className="mt-4" onClick={() => window.location.href = '/profile/jobseeker/me'}>
              Go to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!form.companyName || !form.jobTitle || !form.startDate) {
      showToast.error('Please fill in required fields');
      return;
    }

    try {
      if (editingId) {
        await updateExperienceMutation.mutateAsync(form as UpdateWorkExperienceRequest);
        showToast.success('Experience updated successfully');
      } else {
        await addExperience.mutateAsync(form);
        showToast.success('Experience added successfully');
      }
      resetForm();
      setShowForm(false);
    } catch (error) {
      showToast.error('Failed to save experience');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteExperienceMutation.mutateAsync(deleteId);
      showToast.success('Experience deleted successfully');
      setDeleteId(null);
    } catch (error) {
      showToast.error('Failed to delete experience');
    }
  };

  const resetForm = () => {
    setForm({
      companyName: '',
      jobTitle: '',
      employmentType: EmploymentType.FULL_TIME,
      startDate: '',
      endDate: '',
      isCurrent: false,
      jobDescription: '',
      location: '',
      salary: undefined,
    });
    setEditingId(null);
  };

  const handleEdit = (experience: any) => {
    setForm({
      companyName: experience.companyName,
      jobTitle: experience.jobTitle,
      employmentType: experience.employmentType,
      startDate: experience.startDate,
      endDate: experience.endDate,
      isCurrent: experience.isCurrent,
      jobDescription: experience.jobDescription,
      location: experience.location,
      salary: experience.salary,
    });
    setEditingId(experience.experienceId);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Work Experience</h1>
        <p className="text-gray-600">Manage your professional work history</p>
      </div>

      {/* Add Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      )}

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Experience' : 'Add Work Experience'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name *</label>
                <Input
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="e.g., Tech Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Job Title *</label>
                <Input
                  value={form.jobTitle}
                  onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Employment Type</label>
                <Select
                  value={form.employmentType}
                  onValueChange={(value) =>
                    setForm({ ...form, employmentType: value as EmploymentType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EmploymentType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input
                  value={form.location || ''}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g., Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date *</label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <Input
                  type="date"
                  value={form.endDate || ''}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  disabled={form.isCurrent}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salary</label>
                <Input
                  type="number"
                  value={form.salary || ''}
                  onChange={(e) => setForm({ ...form, salary: parseFloat(e.target.value) })}
                  placeholder="Annual salary"
                />
              </div>
              <div className="flex items-center pt-8">
                <Checkbox
                  id="isCurrent"
                  checked={form.isCurrent}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, isCurrent: !!checked, endDate: '' })
                  }
                />
                <label htmlFor="isCurrent" className="ml-2 text-sm font-medium cursor-pointer">
                  Currently working here
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Description</label>
              <Textarea
                value={form.jobDescription || ''}
                onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
                placeholder="Describe your responsibilities and achievements..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={addExperience.isPending || updateExperienceMutation.isPending}
              >
                {editingId ? 'Update' : 'Add'} Experience
              </Button>
              <Button variant="outline" onClick={() => { resetForm(); setShowForm(false); }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experiences List */}
      {experiences.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-center">No work experience added yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {experiences.map((experience: any) => (
            <Card key={experience.experienceId}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{experience.jobTitle}</h3>
                    <p className="text-gray-600">{experience.companyName}</p>
                    {experience.location && (
                      <p className="text-sm text-gray-500">{experience.location}</p>
                    )}
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <Badge variant="secondary">{experience.employmentType}</Badge>
                      {experience.isCurrent && <Badge>Current</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {new Date(experience.startDate).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      -{' '}
                      {experience.isCurrent
                        ? 'Present'
                        : new Date(experience.endDate).toLocaleDateString('en-IN', {
                            month: 'short',
                            year: 'numeric',
                          })}
                    </p>
                    {experience.salary && (
                      <p className="text-sm text-gray-600">
                        Salary: ₹{experience.salary.toLocaleString()}/year
                      </p>
                    )}
                    {experience.jobDescription && (
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {experience.jobDescription}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(experience)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(experience.experienceId)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Experience?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The work experience record will be permanently deleted.
          </AlertDialogDescription>
          <div className="flex gap-2">
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
