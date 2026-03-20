'use client';

const difficultyColors = {
  Beginner: 'bg-[#34C759]/10 text-[#34C759]',
  Intermediate: 'bg-[#FF9F0A]/10 text-[#FF9F0A]',
  Advanced: 'bg-[#FF3B30]/10 text-[#FF3B30]',
  Expert: 'bg-[#AF52DE]/10 text-[#AF52DE]',
};

interface BadgeProps {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export default function Badge({ difficulty }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ${difficultyColors[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'completed' | 'locked' | 'available';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    completed: 'bg-[#34C759]/10 text-[#34C759]',
    locked: 'bg-[#D2D2D7]/10 text-[#6E6E73]',
    available: 'bg-[#0071E3]/10 text-[#0071E3]',
  };
  const labels = {
    completed: 'Completed',
    locked: 'Locked',
    available: 'Start',
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
