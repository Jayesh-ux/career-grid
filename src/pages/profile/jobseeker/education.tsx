/**
 * Education Management Page
 * Add, edit, delete education records
 */

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  useMyEducation,
  useAddEducation,
  useUpdateEducation,
  useDeleteEducation,
} from '@/hooks/useProfile';
import { useMyJobseekerProfile } from '@/hooks/useProfile';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
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
import { type AddEducationRequest, type UpdateEducationRequest } from '@/api/types/openapi';
import { showToast } from '@/components/Toast';

export function EducationPage() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyJobseekerProfile();
  const { data: educations = [], isLoading: educationsLoading } = useMyEducation();
  const addEducation = useAddEducation();
  const updateEducation = useUpdateEducation();
  const deleteEducation = useDeleteEducation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<AddEducationRequest>({
    degree: '',
    fieldOfStudy: '',
    institutionName: '',
    university: '',
    startDate: '',
    endDate: '',
    percentageOrCgpa: undefined,
    description: '',
    isCurrent: false,
  });

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (profileLoading || educationsLoading) {
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
    if (!form.degree || !form.institutionName || !form.startDate) {
      showToast.error('Please fill in required fields');
      return;
    }

    try {
      if (editingId) {
        await updateEducation.mutateAsync({
          educationId: editingId,
          data: form as UpdateEducationRequest,
        });
        showToast.success('Education updated successfully');
      } else {
        await addEducation.mutateAsync(form);
        showToast.success('Education added successfully');
      }
      resetForm();
      setShowForm(false);
    } catch (error) {
      showToast.error('Failed to save education');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteEducation.mutateAsync(deleteId);
      showToast.success('Education deleted successfully');
      setDeleteId(null);
    } catch (error) {
      showToast.error('Failed to delete education');
    }
  };

  const resetForm = () => {
    setForm({
      degree: '',
      fieldOfStudy: '',
      institutionName: '',
      university: '',
      startDate: '',
      endDate: '',
      percentageOrCgpa: undefined,
      description: '',
      isCurrent: false,
    });
    setEditingId(null);
  };

  const handleEdit = (education: any) => {
    setForm({
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy || '',
      institutionName: education.institutionName,
      university: education.university || '',
      startDate: education.startDate,
      endDate: education.endDate || '',
      percentageOrCgpa: education.percentageOrCgpa,
      description: education.description || '',
      isCurrent: education.isCurrent,
    });
    setEditingId(education.educationId);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Education</h1>
        <p className="text-gray-600">Manage your educational qualifications</p>
      </div>

      {/* Add Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      )}

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Education' : 'Add Education'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Degree *</label>
                <Input
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  placeholder="e.g., Bachelor of Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Field of Study</label>
                <Input
                  value={form.fieldOfStudy || ''}
                  onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Institution Name *</label>
                <Input
                  value={form.institutionName}
                  onChange={(e) => setForm({ ...form, institutionName: e.target.value })}
                  placeholder="e.g., College Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">University</label>
                <Input
                  value={form.university || ''}
                  onChange={(e) => setForm({ ...form, university: e.target.value })}
                  placeholder="e.g., University Name"
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
                <label className="block text-sm font-medium mb-1">CGPA / Percentage</label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.percentageOrCgpa || ''}
                  onChange={(e) =>
                    setForm({ ...form, percentageOrCgpa: parseFloat(e.target.value) })
                  }
                  placeholder="e.g., 8.5"
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
                  Currently studying
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Add any additional details about your education..."
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={addEducation.isPending || updateEducation.isPending}
              >
                {editingId ? 'Update' : 'Add'} Education
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Educations List */}
      {educations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 text-center">No education added yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {educations.map((education: any) => (
            <Card key={education.educationId}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{education.degree}</h3>
                    <p className="text-gray-600">{education.institutionName}</p>
                    {education.university && (
                      <p className="text-sm text-gray-600">{education.university}</p>
                    )}
                    {education.fieldOfStudy && (
                      <p className="text-sm text-gray-600">Field: {education.fieldOfStudy}</p>
                    )}
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {education.isCurrent && <Badge>Currently Studying</Badge>}
                      {education.percentageOrCgpa && (
                        <Badge variant="secondary">
                          {education.percentageOrCgpa.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {new Date(education.startDate).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      -{' '}
                      {education.isCurrent
                        ? 'Present'
                        : new Date(education.endDate).toLocaleDateString('en-IN', {
                            month: 'short',
                            year: 'numeric',
                          })}
                    </p>
                    {education.description && (
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {education.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(education)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(education.educationId)}
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
          <AlertDialogTitle>Delete Education?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The education record will be permanently deleted.
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
