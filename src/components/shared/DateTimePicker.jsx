import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function daysInMonth(m, y) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOfMonth(m, y) { return new Date(y, m, 1).getDay(); }

function classNames(...args) { return args.filter(Boolean).join(" "); }

export default function DateTimePicker({ value, onChange, placeholder = "Pick date & time" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Derive current view from value or default to today
  const parsed = value ? new Date(value) : new Date();
  const initMonth = parsed.getMonth();
  const initYear = parsed.getFullYear();
  const initDate = value ? parsed.getDate() : null;
  const initHours = value ? parsed.getHours() : null;
  const initMinutes = value ? parsed.getMinutes() : null;

  const [viewMonth, setViewMonth] = useState(initMonth);
  const [viewYear, setViewYear] = useState(initYear);
  const [selDate, setSelDate] = useState(initDate);
  const [selHours, setSelHours] = useState(initHours != null ? initHours : 0);
  const [selMinutes, setSelMinutes] = useState(initMinutes != null ? initMinutes : 0);

  // sync view when value changes externally
  useEffect(() => {
    const d = value ? new Date(value) : new Date();
    setViewMonth(d.getMonth());
    setViewYear(d.getFullYear());
    setSelDate(value ? d.getDate() : null);
    if (value) { setSelHours(d.getHours()); setSelMinutes(d.getMinutes()); }
  }, [value]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const totalDays = daysInMonth(viewMonth, viewYear);
  const startDay = firstDayOfMonth(viewMonth, viewYear);
  const today = new Date();

  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < startDay; i++) result.push(null);
    for (let d = 1; d <= totalDays; d++) result.push(d);
    return result;
  }, [viewMonth, viewYear]);

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); } else { setViewMonth((m) => m - 1); } };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); } else { setViewMonth((m) => m + 1); } };

  const selectDate = (d) => {
    setSelDate(d);
    const dt = new Date(viewYear, viewMonth, d, selHours, selMinutes);
    const iso = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    onChange(iso);
    setOpen(false);
  };

  const formatDisplay = () => {
    if (!value) return "";
    const d = new Date(value);
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} · ${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const handleTimeChange = (type, val) => {
    let h = selHours, m = selMinutes;
    if (type === "hours") h = Math.min(23, Math.max(0, val));
    if (type === "minutes") m = Math.min(59, Math.max(0, val));
    setSelHours(h);
    setSelMinutes(m);
    if (selDate != null) {
      const dt = new Date(viewYear, viewMonth, selDate, h, m);
      const iso = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      onChange(iso);
    }
  };

  const isSelected = (d) => selDate === d && viewMonth === parsed.getMonth() && viewYear === parsed.getFullYear();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full rounded-2xl px-4 py-2.5 text-sm bg-gray-50/50 shadow-sm shadow-black/5 transition-all flex items-center gap-2.5 hover:bg-gray-100 text-left"
      >
        <FiCalendar size={15} className="text-gray-400 flex-shrink-0" />
        <span className={value ? "text-gray-900" : "text-gray-400"}>{value ? formatDisplay() : placeholder}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-1.5 left-0 z-50 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 p-4 w-[280px]"
          >
            {/* Month/Year header */}
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <FiChevronLeft size={16} />
              </button>
              <span className="text-sm font-semibold text-gray-800">{MONTHS[viewMonth]} {viewYear}</span>
              <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <FiChevronRight size={16} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0.5 mb-3">
              {days.map((d, i) => (
                <div key={i} className="aspect-square">
                  {d != null ? (
                    <button
                      type="button"
                      onClick={() => selectDate(d)}
                      disabled={d == null}
                      className={classNames(
                        "w-full h-full rounded-xl text-xs font-medium transition-all flex items-center justify-center",
                        isSelected(d)
                          ? "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-sm shadow-red-600/20"
                          : d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {d}
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              ))}
            </div>

            {/* Time selector */}
            <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
              <FiClock size={14} className="text-gray-400 flex-shrink-0" />
              <input
                type="number"
                min={0}
                max={23}
                value={selHours}
                onChange={(e) => handleTimeChange("hours", parseInt(e.target.value) || 0)}
                className="w-14 rounded-xl px-2.5 py-1.5 text-xs bg-gray-50 text-center shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="HH"
              />
              <span className="text-gray-400 text-xs font-medium">:</span>
              <input
                type="number"
                min={0}
                max={59}
                value={selMinutes}
                onChange={(e) => handleTimeChange("minutes", parseInt(e.target.value) || 0)}
                className="w-14 rounded-xl px-2.5 py-1.5 text-xs bg-gray-50 text-center shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="MM"
              />
              <span className="text-xs text-gray-400 ml-auto">{selHours >= 12 ? "PM" : "AM"}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
