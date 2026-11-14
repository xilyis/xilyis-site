import React, { useEffect, useId, useRef, useState } from 'react';
import gsap from 'gsap';
import { MOTION, prefersReducedMotion } from '../motion';

export const FILTER_ALL = 'all';

export interface FilterOption {
  /** Unique across all groups, e.g. "category:generative". */
  id: string;
  label: string;
  count: number;
}

export interface FilterGroup {
  label: string;
  options: FilterOption[];
}

interface FilterDropdownProps {
  isDarkMode: boolean;
  /** Small word before the current value. */
  label?: string;
  value: string;
  totalCount: number;
  groups: FilterGroup[];
  onChange: (id: string) => void;
  /** Which edge of the trigger the menu lines up with. */
  align?: 'left' | 'right';
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * Minimal dropdown for filtering a list by category / subcategory.
 * Options come from the `groups` prop, so editing the data changes the menu.
 */
const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isDarkMode,
  label = 'FILTER',
  value,
  totalCount,
  groups,
  onChange,
  align = 'left',
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const hairline = isDarkMode ? 'border-zinc-800' : 'border-zinc-300';
  const softLine = isDarkMode ? 'border-zinc-900' : 'border-zinc-200';
  const panelBg = isDarkMode ? 'bg-black' : 'bg-white';

  const allOption: FilterOption = { id: FILTER_ALL, label: 'ALL', count: totalCount };
  const current =
    value === FILTER_ALL
      ? allOption
      : groups.flatMap((group) => group.options).find((option) => option.id === value) ??
        allOption;

  // Close when clicking elsewhere
  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open]);

  // Fade the menu in and move focus to the current option
  useEffect(() => {
    if (!open || !panelRef.current) return;

    if (!prefersReducedMotion()) {
      gsap.from(panelRef.current, {
        opacity: 0,
        y: -6,
        duration: MOTION.fast,
        ease: MOTION.ease,
        clearProps: 'opacity,transform',
      });
    }

    const target =
      panelRef.current.querySelector<HTMLButtonElement>('[aria-selected="true"]') ??
      panelRef.current.querySelector<HTMLButtonElement>('button');
    target?.focus();
  }, [open]);

  const choose = (id: string) => {
    onChange(id);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handlePanelKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();

    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []
    );
    if (!items.length) return;

    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      event.key === 'ArrowDown'
        ? (index + 1) % items.length
        : (index - 1 + items.length) % items.length;
    items[next].focus();
  };

  const renderOption = (option: FilterOption) => {
    const isSelected = option.id === value;

    return (
      <button
        key={option.id}
        type="button"
        role="option"
        aria-selected={isSelected}
        onClick={() => choose(option.id)}
        className={`flex w-full items-center justify-between gap-6 px-3 py-2 text-left text-[7px] uppercase tracking-[0.25em] transition-opacity duration-300 hover:opacity-100 focus:opacity-100 focus:outline-none motion-reduce:transition-none md:text-[8px] ${
          isSelected ? 'opacity-100' : option.count === 0 ? 'opacity-25' : 'opacity-50'
        }`}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="w-2 text-[6px]">
            {isSelected ? '◉' : ''}
          </span>
          {option.label}
        </span>
        <span className="font-mono tracking-[0.2em] opacity-60">{pad2(option.count)}</span>
      </button>
    );
  };

  return (
    <div ref={rootRef} className="relative inline-block text-left">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((previous) => !previous)}
        className="flex items-center gap-2 text-[7px] uppercase tracking-[0.25em] opacity-70 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 motion-reduce:transition-none md:text-[8px]"
      >
        <span className="opacity-50">{label}</span>
        <span aria-hidden="true" className="opacity-30">
          /
        </span>
        <span>{current.label}</span>
        <span
          aria-hidden="true"
          className={`text-[6px] transition-transform duration-300 motion-reduce:transition-none ${
            open ? 'rotate-180' : ''
          }`}
        >
          ↓
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id={listId}
          role="listbox"
          onKeyDown={handlePanelKeyDown}
          className={`scrollbar-thin absolute z-30 mt-3 max-h-[60vh] min-w-[13rem] overflow-y-auto border py-1 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${hairline} ${panelBg}`}
        >
          {renderOption(allOption)}

          {groups
            .filter((group) => group.options.length > 0)
            .map((group) => (
              <div key={group.label} className={`mt-1 border-t pt-1 ${softLine}`}>
                <div className="px-3 pb-1 pt-2 text-[6px] font-bold uppercase tracking-[0.4em] opacity-30">
                  {group.label}
                </div>
                {group.options.map(renderOption)}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;