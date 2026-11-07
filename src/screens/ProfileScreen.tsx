import React, { useState } from 'react';
import {
  User,
  Award,
  Mail,
  GraduationCap,
  Edit2,
  Plus,
  Trash2,
  Check,
  Building,
  Users,
  Sparkles,
  Trophy,
  BookOpen,
  Target,
  Flame,
} from 'lucide-react';
import { UserProfile, TeamMember } from '../types/quiz';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onPlaySound?: () => void;
}

const AVAILABLE_AVATARS = ['👨‍🎓', '👩‍🎓', '👨‍💻', '👩‍💻', '👨‍🔬', '👩‍🔬', '🚀', '🧠'];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onPlaySound,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Profile Edit State
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  const [editCollege, setEditCollege] = useState(profile.college || 'Kallam Haranadhareddy Institute of Technology (KHIT)');
  const [editDept, setEditDept] = useState(profile.department || 'Computer Science & Engineering');

  // Add Member State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRoll, setNewMemberRoll] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberContribution, setNewMemberContribution] = useState('');
  const [newMemberAvatar, setNewMemberAvatar] = useState('👨‍💻');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaySound?.();
    onUpdateProfile({
      ...profile,
      name: editName.trim() || profile.name,
      email: editEmail.trim() || profile.email,
      avatar: editAvatar,
      college: editCollege.trim(),
      department: editDept.trim(),
    });
    setShowEditModal(false);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberRoll.trim()) return;

    onPlaySound?.();
    const newMember: TeamMember = {
      id: `khit-member-${Date.now()}`,
      name: newMemberName.trim(),
      rollNo: newMemberRoll.trim().toUpperCase(),
      role: newMemberRole.trim() || 'Core Developer',
      avatar: newMemberAvatar,
      contribution: newMemberContribution.trim() || 'Flutter Module Development & Testing',
    };

    onUpdateProfile({
      ...profile,
      teamMembers: [...(profile.teamMembers || []), newMember],
    });

    setNewMemberName('');
    setNewMemberRoll('');
    setNewMemberRole('');
    setNewMemberContribution('');
    setShowAddMemberModal(false);
  };

  const handleDeleteMember = (memberId: string) => {
    onPlaySound?.();
    const updated = (profile.teamMembers || []).filter((m) => m.id !== memberId);
    onUpdateProfile({
      ...profile,
      teamMembers: updated,
    });
  };

  return (
    <div className="space-y-6 pb-20 px-4 pt-3 max-w-2xl mx-auto animate-fadeIn select-none">
      {/* 1. Profile Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 text-white p-6 shadow-xl shadow-indigo-600/20">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
          {/* Avatar with edit badge */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-4xl shadow-md">
              {profile.avatar}
            </div>
            <button
              onClick={() => {
                onPlaySound?.();
                setShowEditModal(true);
              }}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-400 text-slate-950 shadow-md hover:scale-110 transition-transform"
              title="Edit Profile"
            >
              <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          <div className="flex-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-xs font-semibold text-indigo-200 mb-1 border border-white/20">
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>{profile.college || 'KHIT Guntur'}</span>
            </div>

            <h2 className="text-xl font-extrabold text-white leading-tight">
              {profile.name}
            </h2>
            <p className="text-xs text-indigo-100 font-medium mt-0.5">
              {profile.department || 'Computer Science & Engineering'}
            </p>
            <p className="text-[11px] text-indigo-200/90 font-mono mt-1 flex items-center justify-center sm:justify-start space-x-1">
              <Mail className="w-3 h-3" />
              <span>{profile.email}</span>
            </p>
          </div>

          <button
            onClick={() => {
              onPlaySound?.();
              setShowEditModal(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-xs font-bold text-white border border-white/20 transition-all flex items-center space-x-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* 2. User Stats Grid */}
      <div>
        <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5">
          Knowledge & Performance Stats
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">Total Quizzes</span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              {profile.totalQuizzes}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">Correct Answers</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {profile.totalCorrect}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">Highest Score</span>
            <span className="text-lg font-black text-amber-500">
              {profile.highestScore}%
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">Average Accuracy</span>
            <span className="text-lg font-black text-purple-600 dark:text-purple-400">
              {profile.averagePercentage}%
            </span>
          </div>
        </div>

        {/* Favourite Category pill */}
        <div className="mt-2.5 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Favourite Category:
            </span>
          </div>
          <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
            {profile.favouriteCategory}
          </span>
        </div>
      </div>

      {/* 3. KHIT QUIZ MASTER TEAM MEMBERS LIST (EXPLICIT USER REQUIREMENT) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>KHIT QuizMaster Team Members</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Official Group
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Project Development Team • Kallam Haranadhareddy Institute of Technology
            </p>
          </div>

          <button
            onClick={() => {
              onPlaySound?.();
              setShowAddMemberModal(true);
            }}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>

        {/* Team Members List */}
        <div className="space-y-2.5">
          {(profile.teamMembers || []).map((member, idx) => (
            <div
              key={member.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-start justify-between group hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-slate-750 flex items-center justify-center text-2xl shadow-inner shrink-0 border border-slate-200 dark:border-slate-700">
                  {member.avatar}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {member.name}
                    </h4>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-600">
                      {member.rollNo}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    {member.role}
                  </p>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      Contribution:
                    </span>{' '}
                    {member.contribution}
                  </p>
                </div>
              </div>

              {/* Delete button (if more than 1 member) */}
              {(profile.teamMembers || []).length > 1 && (
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-all"
                  title="Remove Member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Edit User Profile
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Profile Avatar
                </label>
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {AVAILABLE_AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setEditAvatar(av)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                        editAvatar === av
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 scale-105'
                          : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  College / Institution
                </label>
                <input
                  type="text"
                  value={editCollege}
                  onChange={(e) => setEditCollege(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add KHIT Team Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Add KHIT Team Member
              </h3>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Member Avatar
                </label>
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {AVAILABLE_AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setNewMemberAvatar(av)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                        newMemberAvatar === av
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                          : 'bg-slate-100 dark:bg-slate-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Member Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. K. Ravi Teja"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Roll / Registration No <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newMemberRoll}
                  onChange={(e) => setNewMemberRoll(e.target.value)}
                  placeholder="e.g. 248X1A45A4"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project Role
                </label>
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="e.g. UI/UX Specialist or API Developer"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Key Contribution / Tasks
                </label>
                <textarea
                  value={newMemberContribution}
                  onChange={(e) => setNewMemberContribution(e.target.value)}
                  placeholder="e.g. Designed Material 3 widgets and implemented local SQLite persistence"
                  rows={2}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md"
                >
                  Add to Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
