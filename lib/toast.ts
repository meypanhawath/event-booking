import { toast } from "sonner";

const baseClassName =
  "border shadow-lg text-sm [&_[data-title]]:font-semibold [&_[data-description]]:text-sm";

export function notifySuccess(message: string, description?: string) {
  toast.success(message, {
    description,
    className: `${baseClassName} border-emerald-200 bg-emerald-50 text-emerald-950`,
  });
}

export function notifyError(message: string, description?: string) {
  toast.error(message, {
    description,
    className: `${baseClassName} border-red-200 bg-red-50 text-red-950`,
  });
}

export function notifyWarning(message: string, description?: string) {
  toast.warning(message, {
    description,
    className: `${baseClassName} border-amber-200 bg-amber-50 text-amber-950`,
  });
}
