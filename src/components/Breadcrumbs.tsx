import { Link } from "react-router-dom";

interface BreadcrumbItem {
  name: string;
  link?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="mt-4 ml-5 sm:ml-10 text-sm text-gray-600 max-w-[1280px] text-left">
      {items.map((crumb, index) => (
        <span key={index}>
          {index > 0 && " > "}
          {crumb.link ? (
            <Link to={crumb.link} className="text-black hover:underline">
              {crumb.name}
            </Link>
          ) : (
            <span className="text-[#023E8A] font-semibold">{crumb.name}</span>
          )}
        </span>
      ))}
    </div>
  );
}
