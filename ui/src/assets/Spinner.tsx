import React from 'react';

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  speed?: number; // скорость в секундах
  center?: boolean | 'screen'; // центрирование в родителе (true) или на весь экран ('screen')
  wrapperStyle?: React.CSSProperties;
  wrapperClassName?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 3,
  speed = 0.8,
  center = false,
  className = '',
  style,
  wrapperStyle,
  wrapperClassName = '',
  ...props
}) => {
  const svgElement = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label="Загрузка"
      className={className}
      style={{
        animation: `react-svg-spin ${speed}s linear infinite`,
        transformOrigin: 'center',
        ...style,
      }}
      {...props}
    >
      <style>{`
        @keyframes react-svg-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Фоновая подложка (полупрозрачная дорожка) */}
      <circle
        cx="12"
        cy="12"
        r={12 - strokeWidth / 2}
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={0.2}
      />

      {/* Крутящаяся дуга со скруглённым краем */}
      <path
        d={`M 12 ${strokeWidth / 2} A ${12 - strokeWidth / 2} ${12 - strokeWidth / 2} 0 0 1 ${24 - strokeWidth / 2} 12`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );

  // Если центрирование не нужно — рендерим только SVG без лишней обертки (например, внутри кнопок)
  if (!center) {
    return svgElement;
  }

  // Если задан проп center
  return (
    <div
      className={wrapperClassName}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: center === 'screen' ? '100vh' : '100%',
        minHeight: center === 'screen' ? '100vh' : undefined,
        ...wrapperStyle,
      }}
    >
      {svgElement}
    </div>
  );
};
