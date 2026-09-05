import React from 'react';
import { UserRole, TargetExam, UserProfile } from '../types';
import { X, Check, Shield, GraduationCap, Award, ArrowRight } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectProfile: (profile: UserProfile) => void;
}

const DEMO_PROFILES: UserProfile[] = [
  {
    id: 'std-101',
    name: 'Rahul Sharma',
    email: 'rahul.upsc@aspirant.prepwise.ai',
    role: 'student',
    targetExam: 'UPSC CSE',
    streakDays: 14,
    totalStudyHours: 182,
    quizzesTaken: 28,
    overallAccuracy: 66,
    mentorName: 'Dr. S. Nambiar'
  },
  {
    id: 'std-102',
    name: 'Ananya Nair',
    email: 'ananya.kpsc@aspirant.prepwise.ai',
    role: 'student',
    targetExam: 'Kerala PSC',
    streakDays: 21,
    totalStudyHours: 235,
    quizzesTaken: 42,
    overallAccuracy: 88,
    mentorName: 'Dr. S. Nambiar'
  },
  {
    id: 'std-103',
    name: 'Vikram Rao',
    email: 'vikram.ssc@aspirant.prepwise.ai',
    role: 'student',
    targetExam: 'SSC CGL / CHSL',
    streakDays: 8,
    totalStudyHours: 94,
    quizzesTaken: 19,
    overallAccuracy: 58,
    mentorName: 'Dr. S. Nambiar'
  },
  {
    id: 'mentor-201',
    name: 'Dr. S. Nambiar',
    email: 's.nambiar@faculty.prepwise.ai',
    role: 'mentor',
    targetExam: 'Kerala PSC',
    streakDays: 90,
    totalStudyHours: 640,
    quizzesTaken: 0,
    overallAccuracy: 95
  },
  {
    id: 'admin-301',
    name: 'Officer V. Varma',
    email: 'admin.varma@prepwise.ai',
    role: 'admin',
    targetExam: 'UPSC CSE',
    streakDays: 120,
    totalStudyHours: 900,
    quizzesTaken: 0,
    overallAccuracy: 99
  }
];

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectProfile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full border border-neutral-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Multi-Role Authentication & Personas</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Switch instantly between Student, Mentor, and Administrator environments.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-200/60 text-neutral-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Personas List */}
        <div className="p-6 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Verified Profiles (JWT & Role Simulated)
          </div>

          {DEMO_PROFILES.map((profile) => {
            const isSelected = profile.id === currentUser.id;
            return (
              <div
                key={profile.id}
                onClick={() => {
                  onSelectProfile(profile);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected 
                    ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20' 
                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/80'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm ${
                    profile.role === 'admin' 
                      ? 'bg-neutral-900 text-white' 
                      : (profile.role === 'mentor' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-orange-100 text-orange-900 border border-orange-300')
                  }`}>
                    {profile.role === 'admin' ? <Shield className="w-5 h-5" /> : (profile.role === 'mentor' ? <Award className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-900">{profile.name}</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        profile.role === 'admin'
                          ? 'bg-neutral-900 text-white border-neutral-950'
                          : (profile.role === 'mentor' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-orange-100 text-orange-900 border-orange-300')
                      }`}>
                        {profile.role}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-2">
                      <span>{profile.email}</span>
                      {profile.role === 'student' && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-neutral-700">{profile.targetExam}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-500 flex items-center justify-between">
          <span>Role security: Role-Based Access Control (RBAC) active.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
