import { categoryOf } from '../data/categories';

export default function CategoryChip({ category, className = '' }) {
  const { label, Icon, tint, ink } = categoryOf(category);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold sm:text-sm ${className}`}
      style={{ background: tint, color: ink }}
    >
      <Icon className="size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
      {label}
    </span>
  );
}
