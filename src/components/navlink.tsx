"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = React.PropsWithChildren<{ href: string }>

const NavLink = ({ children, href }: NavLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname.endsWith(href) // || (href.includes(pathname) && pathname !== "/")
  const newClassName = `${isActive ? "active" : ""} item`

  return (
    <Link href={href} className={newClassName}>
      {children}
    </Link>
  )
}

export default NavLink