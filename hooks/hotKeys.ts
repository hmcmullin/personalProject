import { useEffect } from "react";

export type HotkeyConfig = {
  key: string;
  ctrlKey?: boolean;
  cmdKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
};

export function useHotkey(config: HotkeyConfig, callback: () => void) {
  const { key, ctrlKey, cmdKey, altKey, shiftKey } = config;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchKey = event.key.toLowerCase() === key.toLowerCase();
      const matchCtrl = !!ctrlKey === event.ctrlKey;
      const matchCmd = !!cmdKey === event.metaKey;
      const matchAlt = !!altKey === event.altKey;
      const matchShift = !!shiftKey === event.shiftKey;

      if (matchKey && matchCtrl && matchCmd && matchAlt && matchShift) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, ctrlKey, cmdKey, altKey, shiftKey, callback]);
}