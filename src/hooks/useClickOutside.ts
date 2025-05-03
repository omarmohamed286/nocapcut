import { RefObject, useEffect } from "react";

export const useClickOutside = (
  callback: () => void,
  addEventListener = true,
  node?: HTMLElement | null | undefined,
  ref?: RefObject<HTMLElement | null>
) => {
  const handleClick = (event: MouseEvent) => {
    console.log(node);
    if (node && !node.contains(event.target as HTMLElement)) {
      return callback();
    }
    if (
      ref &&
      ref.current &&
      !ref.current.contains(event.target as HTMLElement)
    ) {
      callback();
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (addEventListener) {
      // timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClick);
      // }, 0);
    }

    return () => {
      // clearTimeout(timeoutId);
      document.removeEventListener("click", handleClick);
    };
  });
};
