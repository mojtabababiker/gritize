import clsx from "clsx";
import { X } from "lucide-react";
import React from "react";
import { Toast, toast } from "react-hot-toast";
// import toast from "react-hot-toast";

type Props = {
  t: Toast;
  type?: "success" | "error" | "info" | "warning";
  message: string;
};

function CustomToast({ t, type = "success", message }: Props) {
  return (
    <div
      className={clsx(
        "max-w-md relative w-full shadow-lg rounded-lg pointer-events-auto flex overflow-hidden backdrop-blur-3xl font-semibold text-lg sm:text-xl",
        t.visible ? "animate-enter" : "animate-leave"
      )}
    >
      {/* overlay */}
      <div
        className={clsx(
          "absolute inset-0 rounded-2xl opacity-75 transition-opacity ring-1 blur-lg backdrop-blur-3xl",
          type === "success" && "toast-success ring-primary",
          type === "error" && "toast-error ring-red-900 text-fg",
          type === "info" && "toast-info ring-accent",
          type === "warning" && "toast-warning ring-accent"
        )}
      />
      <div className="relative z-20 flex-1 w-0 p-4">
        <div className="flex items-start">
          <p className="mt-1">{message}</p>
        </div>
      </div>
      <div className="absolute top-2 right-2 z-30">
        <X
          onClick={() => toast.dismiss(t.id)}
          className="w-6 h-6 text-accent hover:text-accent/65"
        />
      </div>
    </div>
  );
}

export default CustomToast;
