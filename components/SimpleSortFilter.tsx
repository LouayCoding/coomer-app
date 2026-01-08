'use client';

interface SimpleSortFilterProps {
  onSortChange: (sortBy: string) => void;
  currentSort: string;
}

export default function SimpleSortFilter({ onSortChange, currentSort }: SimpleSortFilterProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-gray-400 text-sm font-medium">Sort:</label>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#ff9000] transition-colors cursor-pointer"
      >
        <option value="date-desc">Newest First</option>
        <option value="date-asc">Oldest First</option>
        <option value="video">Videos Only</option>
        <option value="image">Images Only</option>
      </select>
    </div>
  );
}
