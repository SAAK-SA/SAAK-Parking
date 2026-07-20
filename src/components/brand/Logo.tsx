interface LogoProps {
  tone?: 'color' | 'white';
  className?: string;
  size?: number;
}

export default function Logo({
  tone = 'color',
  className = '',
  size = 34,
}: LogoProps) {
  return (
    <img
      src={tone === 'white' ? '/logo-white.svg' : '/logo-color.svg'}
      alt="SAAK"
      style={{ height: size }}
      className={`w-auto object-contain ${className}`}
    />
  );
}
