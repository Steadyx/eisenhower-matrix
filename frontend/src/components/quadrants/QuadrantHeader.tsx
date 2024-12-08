import { FC } from "react";

interface QuadrantHeaderProps {
  title: string;
}

const QuadrantHeader: FC<QuadrantHeaderProps> = ({ title }) => (
  <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
);

export default QuadrantHeader;
