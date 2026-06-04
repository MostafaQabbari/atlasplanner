import React from "react";
import type { PersonalityProfile } from "../../types";

interface Props {
  profile: PersonalityProfile;
}

export const ProfileBadge: React.FC<Props> = ({ profile }) => (
  <div className="flex flex-wrap gap-2 justify-center">
    <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#5bc4a0]/20 text-[#5bc4a0] border border-[#5bc4a0]/30">
      {profile.traveler_type}
    </span>
    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
      {profile.pace} pace
    </span>
    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
      {profile.social}
    </span>
    {profile.interests.slice(0, 3).map((interest) => (
      <span
        key={interest}
        className="px-3 py-1 rounded-full text-sm font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30"
      >
        {interest}
      </span>
    ))}
  </div>
);
