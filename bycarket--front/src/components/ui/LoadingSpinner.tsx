import { ClipLoader } from "react-spinners";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner = ({
  size = 20,
  color = "#103663",
}: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center">
      <ClipLoader size={size} color={color} />
    </div>
  );
};

export default LoadingSpinner;
