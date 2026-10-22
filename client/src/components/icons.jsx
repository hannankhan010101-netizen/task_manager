export function MarkIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="6" />
      <path d="M8 12.5l2.5 2.5L16 9" />
    </svg>
  );
}

export function TrashIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export function EmptyIcon(props) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="10" y="7" width="28" height="36" rx="4" />
      <path d="M18 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      <path d="M17 21h14" />
      <path d="M17 28h14" />
      <path d="M17 35h8" />
    </svg>
  );
}

export function WeatherIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 11.2 3.5 3.5 0 0 0 7 18Z" />
      <circle cx="17.5" cy="6.5" r="2.3" />
      <path d="M17.5 2.5v1.2M17.5 9.3v1.2M21.5 6.5h-1.2M14.7 6.5h-1.2" />
    </svg>
  );
}

export function SpinnerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function WarningIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3.5 21.5 20h-19L12 3.5Z" />
      <path d="M12 9.5v4.25" />
      <circle cx="12" cy="16.9" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
