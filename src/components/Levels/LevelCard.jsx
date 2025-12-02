import PropTypes from 'prop-types';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { isLevelUnlocked } from '../../utils/storage';

const LevelCard = ({ level, currentLevel, completedLevels, onStart }) => {
    const isUnlocked = isLevelUnlocked(level.id);
    const isCompleted = completedLevels.includes(level.id);
    const isCurrent = currentLevel === level.id;

    return (
        <Card
            locked={!isUnlocked}
            unlocked={isCurrent && !isCompleted}
            className="p-6"
            onClick={isUnlocked ? () => onStart(level) : undefined}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">
                            {isCompleted ? '✅' : !isUnlocked ? '🔒' : '🎯'}
                        </span>
                        <h3 className="text-xl font-elegant text-dark-text">
                            {level.title}
                        </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        {isCompleted ? 'Completed!' : isUnlocked ? 'Ready to play' : 'Complete previous level first'}
                    </p>
                </div>
                <div className="text-romantic-pink font-bold text-lg">
                    {level.id}
                </div>
            </div>

            {isUnlocked && (
                <Button
                    variant={isCompleted ? 'secondary' : 'primary'}
                    className="w-full text-sm"
                >
                    {isCompleted ? 'Review Level' : 'Start Level'}
                </Button>
            )}
        </Card>
    );
};

LevelCard.propTypes = {
    level: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired,
    currentLevel: PropTypes.number.isRequired,
    completedLevels: PropTypes.arrayOf(PropTypes.number).isRequired,
    onStart: PropTypes.func.isRequired,
};

export default LevelCard;
