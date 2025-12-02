import PropTypes from 'prop-types';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    loading = false,
    className = '',
    ...props
}) => {
    const baseStyles = 'px-6 py-3 rounded-lg font-medium text-lg transition-all duration-300 min-h-[44px] min-w-[44px] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-romantic-pink text-white hover:bg-pink-400 hover:shadow-lg',
        secondary: 'bg-white border-2 border-romantic-pink text-romantic-pink hover:bg-pink-50',
        gold: 'bg-accent-gold text-dark-text hover:bg-yellow-400 hover:shadow-lg',
        outline: 'bg-transparent border-2 border-dark-text text-dark-text hover:bg-gray-100',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(['primary', 'secondary', 'gold', 'outline']),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    className: PropTypes.string,
};

export default Button;
