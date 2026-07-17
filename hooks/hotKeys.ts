import { useEffect } from "react";

// key checks if matching key is pressed, rest check for multiple key combinations (ctrl, cmd, alt, shift)
// also put this under data or whatever page has types
type HotkeyConfig = {
  key: string;
  ctrlKey?: boolean;
  cmdKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
};

//
export function useHotkey(config: HotkeyConfig, callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchKey = event.key.toLowerCase() === config.key.toLowerCase();
      const matchCtrl = !!config.ctrlKey === event.ctrlKey;
      const matchCmd = !!config.cmdKey === event.metaKey;
      const matchAlt = !!config.altKey === event.altKey;
      const matchShift = !!config.shiftKey === event.shiftKey;

      if (matchKey && matchCtrl && matchCmd && matchAlt && matchShift) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [config, callback]);
}

// "use client";

// import { useHotkey } from "@/hooks/useHotkey";
// import { useRouter } from "next/navigation";

// export default function Dashboard() {
//   const router = useRouter();

//   // Redirect to login when user presses Meta (Cmd/Win) + L
//   useHotkey({ key: "l", metaKey: true }, () => {
//     router.push("/login");
//   });

//   return <main>Welcome to the Dashboard. Press Cmd + L to Log Out.</main>;
// }
