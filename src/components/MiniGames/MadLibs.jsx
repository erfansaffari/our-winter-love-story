import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';

const MadLibs = ({ template, prompts, onComplete }) => {
    const [answers, setAnswers] = useState({});
    const [showStory, setShowStory] = useState(false);

    const handleAnswerChange = (index, value) => {
        setAnswers({
            ...answers,
            [index]: value,
        });
    };

    const handleSubmit = () => {
        setShowStory(true);
    };

    const handleComplete = () => {
        let filledStory = template;
        prompts.forEach((_, index) => {
            filledStory = filledStory.replace(`{{${index}}}`, answers[index] || '___');
        });

        onComplete({
            completed: true,
            story: filledStory,
            answers: Object.values(answers),
        });
    };

    const allFilled = prompts.every((_, index) => answers[index]?.trim());

    if (showStory) {
        let filledStory = template;
        prompts.forEach((_, index) => {
            const answer = answers[index] || '___';
            filledStory = filledStory.replace(
                `{{${index}}}`,
                `<span class="text-romantic-pink font-bold">${answer}</span>`
            );
        });

        return (
            <div className="w-full max-w-md mx-auto p-6">
                <h3 className="text-2xl font-elegant text-center mb-6">
                    Your Love Story! 💕
                </h3>

                <div
                    className="bg-gradient-to-br from-pink-50 to-blue-50 p-6 rounded-xl mb-6 text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: filledStory }}
                />

                <div className="space-y-3">
                    <Button onClick={handleComplete} variant="primary" className="w-full">
                        Continue 🎉
                    </Button>
                    <Button
                        onClick={() => setShowStory(false)}
                        variant="secondary"
                        className="w-full"
                    >
                        Edit Answers
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <h3 className="text-2xl font-elegant text-center mb-4">
                Fill in the Blanks
            </h3>
            <p className="text-center text-gray-600 mb-8">
                Create a silly love story by filling in the words below!
            </p>

            <div className="space-y-4 mb-6">
                {prompts.map((prompt, index) => (
                    <div key={index}>
                        <label className="block text-sm font-medium text-dark-text mb-2">
                            {index + 1}. {prompt}
                        </label>
                        <input
                            type="text"
                            value={answers[index] || ''}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-romantic-pink"
                            placeholder={`Enter a ${prompt}...`}
                        />
                    </div>
                ))}
            </div>

            <Button
                onClick={handleSubmit}
                variant="primary"
                disabled={!allFilled}
                className="w-full"
            >
                Read My Story! 📖
            </Button>
        </div>
    );
};

MadLibs.propTypes = {
    template: PropTypes.string.isRequired,
    prompts: PropTypes.arrayOf(PropTypes.string).isRequired,
    onComplete: PropTypes.func.isRequired,
};

export default MadLibs;
