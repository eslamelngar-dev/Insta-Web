"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface Option {
  value: string | number;
  label: string;
  icon?: ReactNode;
}

interface DropdownColors {
  focusBorder: string;
  focusRing: string;
  selected: string;
  selectedBg: string;
}

interface Props {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  onOpen?: () => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  searchable?: boolean;
  colors: DropdownColors;
  icon?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  emptyLabel?: string;
  remoteSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  alwaysShowSearch?: boolean;
}

export default function FormDropdown({
  options,
  value,
  onChange,
  onOpen,
  placeholder = "اختر...",
  label,
  required = false,
  searchable = true,
  colors,
  icon,
  loading = false,
  loadingLabel = "جاري التحميل...",
  emptyLabel = "لا توجد نتائج",
  remoteSearch = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "بحث...",
  alwaysShowSearch = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uniqueOptions = useMemo(() => {
    const seen = new Set<string>();

    return options.filter((option) => {
      const key = String(option.value);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [options]);

  const currentSearch = remoteSearch ? searchValue : internalSearch;
  const showSearchInput =
    searchable &&
    (alwaysShowSearch || remoteSearch || uniqueOptions.length > 5);
  const effectiveLoading = loading && uniqueOptions.length === 0;

  const selectedOption = useMemo(
    () => uniqueOptions.find((o) => o.value === value),
    [uniqueOptions, value],
  );

  const filtered = useMemo(() => {
    if (remoteSearch) return uniqueOptions;
    if (!currentSearch.trim()) return uniqueOptions;

    const q = currentSearch.toLowerCase().trim();
    return uniqueOptions.filter((o) => o.label.toLowerCase().includes(q));
  }, [uniqueOptions, currentSearch, remoteSearch]);

  const updatePosition = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  const resetSearch = useCallback(() => {
    if (remoteSearch) {
      onSearchChange?.("");
    } else {
      setInternalSearch("");
    }
  }, [remoteSearch, onSearchChange]);

  const handleSearchChange = useCallback(
    (nextValue: string) => {
      if (remoteSearch) {
        onSearchChange?.(nextValue);
      } else {
        setInternalSearch(nextValue);
      }
    },
    [remoteSearch, onSearchChange],
  );

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    const isEventInside = (e: Event) => {
      const btn = buttonRef.current;
      const dd = dropdownRef.current;

      const path = (
        e as unknown as { composedPath?: () => EventTarget[] }
      ).composedPath?.();

      if (path) {
        if (btn && path.includes(btn)) return true;
        if (dd && path.includes(dd)) return true;
      }

      const target = e.target as Node | null;
      if (!target) return false;

      if (btn && btn.contains(target)) return true;
      if (dd && dd.contains(target)) return true;

      return false;
    };

    const handleOutside = (e: PointerEvent) => {
      if (!isOpen) return;
      if (isEventInside(e)) return;
      setIsOpen(false);
      resetSearch();
    };

    document.addEventListener("pointerdown", handleOutside, true);
    return () =>
      document.removeEventListener("pointerdown", handleOutside, true);
  }, [isOpen, resetSearch]);

  useEffect(() => {
    if (isOpen && inputRef.current && showSearchInput && !effectiveLoading) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen, showSearchInput, effectiveLoading]);

  const toggleOpen = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
      resetSearch();
      return;
    }

    onOpen?.();
    updatePosition();
    setIsOpen(true);
  }, [isOpen, onOpen, resetSearch, updatePosition]);

  const handleSelect = useCallback(
    (val: string | number) => {
      onChange(val);
      setIsOpen(false);
      resetSearch();
    },
    [onChange, resetSearch],
  );

  const dropdownContent = isOpen ? (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="fixed bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden"
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 9999,
        maxHeight: "min(400px, calc(100vh - 100px))",
      }}
      dir="ltr"
      role="listbox"
      aria-label={label || placeholder}
    >
      {showSearchInput && !effectiveLoading && (
        <div className="p-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 sticky top-0 z-10">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={currentSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 rounded-lg pr-9 pl-3 py-2 text-sm outline-none border border-gray-200 dark:border-gray-700"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.focusBorder;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.focusRing}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "";
              }}
            />
            <Search
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      )}

      {loading && uniqueOptions.length > 0 && (
        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40">
          {loadingLabel}
        </div>
      )}

      <div
        className="overflow-y-auto custom-scrollbar"
        style={{
          maxHeight: showSearchInput
            ? "calc(min(400px, calc(100vh - 100px)) - 60px)"
            : "min(400px, calc(100vh - 100px))",
        }}
      >
        {effectiveLoading ? (
          <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-600">
            {loadingLabel}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-600">
            {emptyLabel}
          </div>
        ) : (
          filtered.map((option) => {
            const selected = value === option.value;

            return (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => handleSelect(option.value)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm transition-all duration-150 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                style={
                  selected
                    ? {
                        backgroundColor: colors.selectedBg,
                        color: colors.selected,
                      }
                    : undefined
                }
                role="option"
                aria-selected={selected}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {option.icon}
                  <span className="truncate">{option.label}</span>
                </div>
                {selected && <Check size={14} className="shrink-0" />}
              </button>
            );
          })
        )}
      </div>
    </motion.div>
  ) : null;

  return (
    <div className="relative w-full" dir="ltr">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleOpen();
            }
            if (e.key === "Escape") {
              e.preventDefault();
              setIsOpen(false);
              resetSearch();
            }
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = colors.focusBorder;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.focusRing}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "";
            e.currentTarget.style.boxShadow = "";
          }}
          className={`w-full flex items-center justify-between gap-2 border bg-white dark:bg-gray-800 rounded-xl ${
            icon ? "pr-10" : "pr-4"
          } pl-4 py-3 text-sm outline-none transition-all duration-200 cursor-pointer border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 touch-manipulation`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedOption?.icon}
            <span
              className={`truncate ${
                !selectedOption
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {selectedOption?.label || placeholder}
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`shrink-0 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-600">
            {icon}
          </div>
        )}
      </div>

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>{dropdownContent}</AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
