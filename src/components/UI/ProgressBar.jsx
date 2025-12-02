import PropTypes from 'prop-types';

const ProgressBar = ({ current, total, className = '' }) => {
    const percentage = (current / total) * 100;

    return (
        <div className={`w-full ${className}`}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-dark-text">
                    {current} of {total} levels completed
                </span>
                <span className="text-sm font-medium text-romantic-pink">
                    {Math.round(percentage)}% Complete
                </span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-romantic-pink to-accent-gold transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Level indicators */}
            <div className="flex justify-between mt-2">
                {Array.from({ length: total }, (_, i) => i + 1).map((level) => (
                    <div
                        key={level}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${level <= current
                            ? 'bg-romantic-pink text-white'
                            : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        {level}
                    </div>
                ))}
            </div>
        </div>
    );
};

ProgressBar.propTypes = {
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    className: PropTypes.string,
};

export default ProgressBar;
