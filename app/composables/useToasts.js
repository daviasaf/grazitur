import { useState } from "#app";

export const useToasts = () => {
  const toasts = useState("toasts", () => []);

  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 4000);
  };

  const removerToast = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return { toasts, showToast, removerToast };
};
