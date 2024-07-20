import { animated, useSpring } from "@react-spring/web";
import { AnswerIcon } from "./AnswerIcon";

export const AnswerLoading = () => {
    const animatedStyles = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 }
    });

    return (
        <animated.div style={{ ...animatedStyles }}>
            <div className="flex flex-col items-center justify-between p-4 border rounded-lg bg-white shadow-md">
                <AnswerIcon />
                <div className="flex-grow mt-2">
                    <p className="text-lg font-semibold text-gray-800">
                        Generating answer
                        <span className="loading-dots ml-2" />
                    </p>
                </div>
            </div>
        </animated.div>
    );
};
