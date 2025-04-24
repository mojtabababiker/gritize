import Link from "next/link";
import Image from "next/image";

function SigninWithGithub() {
  return (
    <div className="flex items-center justify-center">
      <span className="sr-only">Signin with Github</span>
      <Link href={"#"} className="flex items-center justify-center">
        <Image
          src="/icons/github-icon.png"
          alt="Github Logo"
          width={84}
          height={84}
          className="h-auto w-[48px] sm:w-[52px]"
        />
      </Link>
    </div>
  );
}

export default SigninWithGithub;
