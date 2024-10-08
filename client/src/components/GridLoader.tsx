// https://github.com/mhnpd/react-loader-spinner

type Props = {
  height?: string | number;
  width?: string | number;
  radius?: string | number;
};

export default function GridLoader({
  height = 80,
  width = 80,
  radius = 12.5,
}: Props) {
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary"
      aria-label="grid-loading"
      aria-busy={true}
      role="progressbar"
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 105 105"
        fill="currentColor"
        data-testid="grid-svg"
      >
        <circle
          cx="12.5"
          cy="12.5"
          r={`${radius}`}
        >
          <animate
            attributeName="fill-opacity"
            begin="0s"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="12.5"
          cy="52.5"
          r={`${radius}`}
        >
          <animate
            attributeName="fill-opacity"
            begin="100ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="52.5"
          cy="12.5"
          r={`${radius}`}
        >
          <animate
            attributeName="fill-opacity"
            begin="300ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="52.5"
          cy="52.5"
          r={`${radius}`}
        >
          <animate
            attributeName="fill-opacity"
            begin="600ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="92.5"
          cy="12.5"
          r={`${radius}`}
        >
          <animate
            attributeName="fill-opacity"
            begin="800ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="92.5"
          cy="52.5"
          r={`${radius}`}
        >
          <animate
            attributeName="fill-opacity"
            begin="400ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="12.5"
          cy="92.5"
          r={`${radius}`}
        >
          <animate
            attributeName="fill-opacity"
            begin="700ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="52.5"
          cy="92.5"
          r={`${radius}`}
        >
          <animate
            attributeName="fill-opacity"
            begin="500ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="92.5"
          cy="92.5"
          r={`${radius}`}
        >
          <animate
            attributeName="fill-opacity"
            begin="200ms"
            dur="1s"
            values="1;.2;1"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
