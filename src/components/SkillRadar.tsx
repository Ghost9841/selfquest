// src/components/SkillRadar.tsx

import type { Skill } from '@/types/skill.types';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface SkillRadarProps {
  skills: Skill[];
}

export function SkillRadar({ skills }: SkillRadarProps) {
  if (skills.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-purple-600/30 bg-[#1a1a2e]">
        <p className="text-sm text-gray-400">Add skills to see radar chart</p>
      </div>
    );
  }

  // Format data for radar chart
  const data = skills.map((skill) => ({
    skill: skill.name,
    value: skill.level,
    fullMark: 10,
    color: skill.color,
  }));

  return (
    <div className="rounded-lg border border-purple-600/30 bg-[#1a1a2e] p-4">
      <h3 className="mb-2 text-center text-sm font-medium text-gray-400">
        📊 Skill Radar
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <PolarGrid stroke="#4F46E5" strokeOpacity={0.3} />
          <PolarAngleAxis
            dataKey="skill"
            tick={{
              fill: '#94A3B8',
              fontSize: 10,
              fontWeight: 500,
            }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 10]}
            tick={{
              fill: '#4F46E5',
              fontSize: 8,
            }}
            stroke="#4F46E5"
            strokeOpacity={0.3}
          />
          <Radar
            name="Skill Level"
            dataKey="value"
            stroke="#4F46E5"
            fill="#4F46E5"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}