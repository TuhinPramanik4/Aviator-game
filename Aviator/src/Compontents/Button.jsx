export function Button({ onClick, children, disabled }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
      >
        {children}
      </button>
    );
  }
  