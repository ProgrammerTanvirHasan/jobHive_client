import { Navbar1 } from "@/components/navbar1";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar1 />
      <main>{children}</main>
    </>
  );
}
