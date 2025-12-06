/**
 * Skills Management Page
 * Add, remove, and manage skills with proficiency levels
 */

import React, { useState, useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  useMySkills,
  useAddSkill,
  useRemoveSkill,
  useSkillsCatalog,
} from '@/hooks/useSkills';
import { useMyJobseekerProfile } from '@/hooks/useProfile';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Search } from 'lucide-react';
import { ProficiencyLevel, type AddSkillRequest } from '@/api/types/openapi';
import { showToast } from '@/components/Toast';

export function SkillsPage() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyJobseekerProfile();
  const { data: mySkills = [], isLoading: skillsLoading } = useMySkills();
  const { data: skillsCatalog = [], isLoading: catalogLoading } = useSkillsCatalog();
  const addSkill = useAddSkill();
  const removeSkill = useRemoveSkill();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
  const [proficiencyLevel, setProficiencyLevel] = useState<ProficiencyLevel>(
    ProficiencyLevel.BEGINNER
  );
  const [yearsOfExperience, setYearsOfExperience] = useState(0);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (profileLoading || skillsLoading || catalogLoading) {
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

  // Get available skills not yet added
  const mySkillIds = new Set(mySkills.map((s: any) => s.skillId));
  const availableSkills = skillsCatalog.filter((s: any) => !mySkillIds.has(s.skillId));

  // Filter skills based on search
  const filteredSkills = useMemo(() => {
    return availableSkills.filter((skill: any) =>
      skill.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableSkills, searchTerm]);

  const handleAddSkill = async () => {
    if (!selectedSkillId) {
      showToast.error('Please select a skill');
      return;
    }

    try {
      await addSkill.mutateAsync({
        skillId: selectedSkillId,
        proficiencyLevel,
        yearsOfExperience: yearsOfExperience || undefined,
      } as AddSkillRequest);
      showToast.success('Skill added successfully');
      setSelectedSkillId(null);
      setProficiencyLevel(ProficiencyLevel.BEGINNER);
      setYearsOfExperience(0);
    } catch (error) {
      showToast.error('Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillId: number) => {
    try {
      await removeSkill.mutateAsync(skillId);
      showToast.success('Skill removed successfully');
    } catch (error) {
      showToast.error('Failed to remove skill');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Skills</h1>
        <p className="text-gray-600">
          Add and manage your professional skills. Total: {mySkills.length} skills
        </p>
      </div>

      {/* Add Skill Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Skill</CardTitle>
          <CardDescription>Search and add skills to your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search skills by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Skill Selection */}
          {filteredSkills.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Select Skill</label>
              <Select
                value={selectedSkillId?.toString() || ''}
                onValueChange={(value) => setSelectedSkillId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a skill..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredSkills.map((skill: any) => (
                    <SelectItem key={skill.skillId} value={skill.skillId.toString()}>
                      <div>
                        <span>{skill.skillName}</span>
                        {skill.category && (
                          <span className="text-xs text-gray-500 ml-2">({skill.category})</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Proficiency Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Proficiency Level</label>
              <Select
                value={proficiencyLevel}
                onValueChange={(value) => setProficiencyLevel(value as ProficiencyLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ProficiencyLevel).map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0) + level.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-medium mb-2">Years of Experience</label>
              <Input
                type="number"
                min="0"
                max="70"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          <Button
            onClick={handleAddSkill}
            disabled={!selectedSkillId || addSkill.isPending}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>

          {filteredSkills.length === 0 && searchTerm && (
            <p className="text-center text-gray-600 py-4">
              No skills found. Try a different search term.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Current Skills */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Skills ({mySkills.length})</h2>

        {mySkills.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600 text-center">No skills added yet. Start by adding one!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mySkills.map((skill: any) => (
              <Card key={skill.id} className="relative">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{skill.skill?.skillName}</h3>
                      {skill.skill?.category && (
                        <p className="text-sm text-gray-600">{skill.skill.category}</p>
                      )}
                      <div className="mt-3 space-y-2">
                        <div>
                          <p className="text-xs text-gray-600">Proficiency</p>
                          <Badge variant="secondary" className="mt-1">
                            {skill.proficiencyLevel.charAt(0) +
                              skill.proficiencyLevel.slice(1).toLowerCase()}
                          </Badge>
                        </div>
                        {skill.yearsOfExperience !== undefined && (
                          <div>
                            <p className="text-xs text-gray-600">
                              {skill.yearsOfExperience} year{skill.yearsOfExperience !== 1 ? 's' : ''}{' '}
                              experience
                            </p>
                          </div>
                        )}
                        {skill.endorsements !== undefined && (
                          <div>
                            <p className="text-xs text-gray-600">{skill.endorsements} endorsements</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSkill(skill.skillId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Skill Categories Info */}
      {skillsCatalog.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Skills Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(
                new Set(skillsCatalog.map((s: any) => s.category))
              ).map((category) => (
                <div key={category}>
                  <Badge variant="outline">{category || 'Other'}</Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    {skillsCatalog.filter((s: any) => s.category === category).length} skills
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
