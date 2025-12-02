import PropTypes from 'prop-types';

const Card = ({
    children,
    locked = false,
    unlocked = false,
    className = '',
    onClick,
    ...props
}) => {
    const baseStyles = 'bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300';
    const interactiveStyles = onClick ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : '';
    const lockedStyles = locked ? 'opacity-60 grayscale' : '';
    const unlockedStyles = unlocked ? 'pulse-glow' : '';

    return (
        <div
            onClick={locked ? undefined : onClick}
            className={`${baseStyles} ${interactiveStyles} ${lockedStyles} ${unlockedStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    locked: PropTypes.bool,
    unlocked: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default Card;
