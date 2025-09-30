interface NavigationProps {
  onProjectClick: () => void;
  onProfileClick: () => void;
}

export default function Navigation({
  onProjectClick,
  onProfileClick,
}: NavigationProps) {
  return (
    <nav className="absolute top-6 left-1/2 transform -translate-x-1/2 flex space-x-12 text-2xl font-semibold z-50">
      <button
        onClick={onProjectClick}
        className="hover:text-blue-400 transition-colors"
      >
        PROJECT
      </button>
      <button
        onClick={onProfileClick}
        className="hover:text-blue-400 transition-colors"
      >
        PROFILE
      </button>
    </nav>
  );
}
