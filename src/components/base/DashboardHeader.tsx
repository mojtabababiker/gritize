import Image from "next/image";
import Link from "next/link";
import Bounded from "../common/Bounded";
import Heading from "../common/Heading";

function DashboardHeader() {
  const user = {
    firstName: "Mazin",
    profileImage: "/images/users/user3.png",
  };
  return (
    <Bounded
      as="header"
      className="sticky top-0 py-4 z-40 bg-bg/60 backdrop-blur-md drop-shadow-sm shadow-bg/50 shadow-xl"
    >
      {/* header */}
      <div className="flex items-center justify-between">
        {/* logo */}
        <Link href="/">
          <Image
            src="/images/main-logo.png"
            alt="Gritize Logo"
            width={200}
            height={200}
            className="w-full max-w-[190px] h-auto"
          />
        </Link>
        <div className="flex items-center justify-end gap-2">
          {/* name */}
          <Heading as="span" size="sm" className="text-fg">
            {user.firstName}
          </Heading>
          {/* user image */}
          <div className="flex-items-center justify-center rounded-full w-14 h-14 p-0 bg-surface">
            <Image
              src={user.profileImage}
              width={64}
              height={64}
              className="object-cover w-full h-full"
              alt={user.firstName}
            />
          </div>
        </div>
      </div>
    </Bounded>
  );
}

export default DashboardHeader;
