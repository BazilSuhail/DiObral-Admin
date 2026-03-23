import { motion } from "motion/react";
import { FiChevronRight, FiHome } from "react-icons/fi";

function BannerArt() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      viewBox="0 0 600 95"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <polygon points="560,0 600,0 600,30" fill="#DC2626" opacity="0.1" />
      <polygon points="510,0 600,0 600,56" fill="#F43F5E" opacity="0.07" />
      <polygon points="600,60 600,95 500,95" fill="#DC2626" opacity="0.08" />
      <polygon points="600,77 600,95 440,95" fill="#F43F5E" opacity="0.06" />
      <polygon points="440,0 520,0 480,39" fill="#DC2626" opacity="0.09" />
      <polygon points="390,0 450,0 415,30" fill="#F43F5E" opacity="0.08" />
      <polygon points="0,95 60,69 90,95" fill="#DC2626" opacity="0.06" />
      <polygon points="0,77 0,95 70,95" fill="#F43F5E" opacity="0.07" />
      <polygon points="120,95 190,64 220,95" fill="#DC2626" opacity="0.05" />
    </svg>
  );
}

export default function PageBanner({ title, subtitle, routes = [], icon: Icon }) {
  const trail = [...routes, { label: title }];

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl bg-white border-2  border-red-200/30 shadow-sm shadow-rose-200/80 px-5 sm:px-6 py-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <BannerArt />

      <div className="relative flex items-center gap-4 min-w-0">
        {Icon && (
          <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/10">
            <Icon size={24} />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-ink leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-sm lg:text-base text-gray-500 mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>

      <nav className="relative flex items-center gap-1.5 text-xs font-medium text-gray-400 flex-wrap">
        <FiHome size={14} className="text-gray-400" />
        {trail.map((r, i) => {
          const isLast = i === trail.length - 1;
          return (
            <span key={`${r.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <FiChevronRight size={13} className="text-gray-300" />}
              {!isLast && r.to ? (
                <a href={r.to} className="hover:text-primary transition-colors">
                  {r.label}
                </a>
              ) : (
                <span className={isLast ? "text-primary font-semibold" : "text-gray-400"}>{r.label}</span>
              )}
            </span>
          );
        })}
      </nav>
    </motion.div>
  );
}
