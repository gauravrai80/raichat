const FilePreview = ({ file }) => {
    const { url, type, filename } = file;

    if (type === 'image') {
        return (
            <div className="my-2">
                <img
                    src={url}
                    alt={filename}
                    className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(url, '_blank')}
                />
            </div>
        );
    }

    // Document preview
    return (
        <div className="my-2">
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 bg-gray-100 hover:bg-gray-200 rounded-lg p-3 transition-colors max-w-xs"
            >
                <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                </svg>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{filename}</p>
                    <p className="text-xs text-gray-500">Click to download</p>
                </div>
            </a>
        </div>
    );
};

export default FilePreview;
