// noinspection CssUnusedSymbol

interface IconProps {
    size?: number;
}

function IconCirkl({ size = 24 }: IconProps) {
    return (
        <>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="icon-circle"
            >
                <defs>
                    <linearGradient
                        id="grayWave45"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                        gradientUnits="objectBoundingBox"
                    >
                        <stop offset="0%" stopColor="#fff">
                            <animate
                                attributeName="offset"
                                values="-1; 1"
                                dur="3s"
                                repeatCount="indefinite"
                            />
                        </stop>

                        <stop offset="50%" stopColor="#888">
                            <animate
                                attributeName="offset"
                                values="-0.5; 1.5"
                                dur="3s"
                                repeatCount="indefinite"
                            />
                        </stop>

                        <stop offset="100%" stopColor="#fff">
                            <animate
                                attributeName="offset"
                                values="0; 2"
                                dur="3s"
                                repeatCount="indefinite"
                            />
                        </stop>
                    </linearGradient>
                </defs>

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={size / 2}
                    fill="white"
                    className="circle-fill"
                />
            </svg>

            <style jsx>{`
        .icon-circle {
          cursor: pointer;
        }

        .icon-circle .circle-fill {
          transition: fill 0.3s ease;
        }

        .icon-circle:hover .circle-fill {
          fill: url(#grayWave45);
        }
      `}</style>
        </>
    );
}

export {
    IconCirkl
};
