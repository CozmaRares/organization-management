type Props = {
  message: string;
};

export default function Error({ message }: Props) {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-4xl font-bold text-primary">Hopa! E bai!</h1>
      <p className="">{message}</p>
    </div>
  );
}
