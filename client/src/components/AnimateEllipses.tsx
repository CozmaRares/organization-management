type Props = {
  text: string;
};

export default function AnimateEllipses({ text }: Props) {
  return (
    <div className="flex flex-row gap-0.5">
      {text}
      <span className="animate-bounce">.</span>
      <span className="animate-bounce delay-75">.</span>
      <span className="animate-bounce delay-150">.</span>
    </div>
  );
}
