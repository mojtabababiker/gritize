import Link from "next/link";
import Image from "next/image";

function SigninWithGoogle() {
  return (
    <div className="flex items-center justify-center">
      <span className="sr-only">Signin with Google</span>
      <Link href={"#"} className="flex items-center justify-center">
        <Image
          src="/icons/google-icon.png"
          alt="Google Logo"
          width={84}
          height={84}
          className="h-auto w-[48px] sm:w-[52px]"
        />
      </Link>
    </div>
  );
}

export default SigninWithGoogle;
