import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type SideBarItemType = {
    href: string;
    icon: React.ReactNode;
    label: string;
}

export default function SideBarItem({
    href,
    icon,
    label,
}: SideBarItemType) {

    const pathname = usePathname();

    const isActive = href === pathname;

    return (
        <Link
            href={href}
            className={clsx(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-700 hover:bg-gray-100"
      )}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}