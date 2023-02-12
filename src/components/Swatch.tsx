export function Swatch({
  twColor,
  onClick,
}: {
  twColor: string;
  onClick: () => void;
}) {
  return (
    <div
      className={`w-8 h-8 rounded-lg border border-gray-500 hover:border-gray-100 hover:cursor-pointer transition-colors ${twColor}`}
      onClick={onClick}
    />
  );
}
