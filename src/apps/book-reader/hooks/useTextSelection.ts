import { useEffect, useCallback, RefObject } from "react";
import { useSetAtom } from "jotai";
import { selectionPopupAtom } from "../atoms";

/**
 * Compute the character offset of a point within a container's text content
 * by walking text nodes with a TreeWalker.
 */
function getTextOffset(
  container: HTMLElement,
  targetNode: Node,
  targetOffset: number
): number {
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null
  );
  let accumulated = 0;
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node === targetNode) {
      return accumulated + targetOffset;
    }
    accumulated += (node.textContent?.length ?? 0);
  }
  return accumulated;
}

/**
 * Check if a node is inside a <pre> element (code block).
 */
function isInsideCodeBlock(node: Node): boolean {
  let current: Node | null = node;
  while (current) {
    if (
      current.nodeType === Node.ELEMENT_NODE &&
      (current as Element).tagName === "PRE"
    ) {
      return true;
    }
    current = current.parentNode;
  }
  return false;
}

export function useTextSelection(
  sectionRef: RefObject<HTMLElement | null>,
  wrapperRef: RefObject<HTMLElement | null>
) {
  const setPopup = useSetAtom(selectionPopupAtom);

  const handleSelectionEnd = useCallback(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;

    const selection = window.getSelection();
    if (
      !selection ||
      selection.isCollapsed ||
      selection.rangeCount === 0 ||
      !selection.toString().trim()
    ) {
      return;
    }

    const range = selection.getRangeAt(0);

    // Verify selection is within the article body section
    if (
      !section.contains(range.startContainer) ||
      !section.contains(range.endContainer)
    ) {
      return;
    }

    // Skip selections inside code blocks
    if (
      isInsideCodeBlock(range.startContainer) ||
      isInsideCodeBlock(range.endContainer)
    ) {
      return;
    }

    const startOffset = getTextOffset(
      section,
      range.startContainer,
      range.startOffset
    );
    const endOffset = getTextOffset(
      section,
      range.endContainer,
      range.endOffset
    );
    const text = selection.toString();

    // Position the popup above the selection, relative to the wrapper
    const rangeRect = range.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    let x = rangeRect.left + rangeRect.width / 2 - wrapperRect.left;
    let y = rangeRect.top - wrapperRect.top - 60; // popup height + gap

    // If popup would go above the visible area, flip below
    if (y < 0) {
      y = rangeRect.bottom - wrapperRect.top + 8;
    }

    // Clamp x to stay within wrapper bounds
    x = Math.max(60, Math.min(x, wrapperRect.width - 60));

    setPopup({ visible: true, x, y, startOffset, endOffset, text });
  }, [sectionRef, wrapperRef, setPopup]);

  const dismiss = useCallback(() => {
    setPopup((prev) => (prev.visible ? { ...prev, visible: false } : prev));
  }, [setPopup]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onMouseUp = () => {
      // Small delay to let selection finalize
      setTimeout(handleSelectionEnd, 10);
    };

    const onTouchEnd = () => {
      // Longer delay on touch for browser selection handles to stabilize
      setTimeout(handleSelectionEnd, 300);
    };

    const onMouseDown = (e: MouseEvent) => {
      // Dismiss popup when clicking outside it
      const target = e.target as HTMLElement;
      if (!target.closest("[data-selection-popup]")) {
        dismiss();
      }
    };

    const onScroll = () => dismiss();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };

    section.addEventListener("mouseup", onMouseUp);
    section.addEventListener("touchend", onTouchEnd);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    // Find scrollable parent for scroll dismissal
    let scrollable: HTMLElement | null = section.parentElement;
    while (scrollable) {
      const style = window.getComputedStyle(scrollable);
      if (style.overflowY === "auto" || style.overflowY === "scroll") break;
      scrollable = scrollable.parentElement;
    }
    if (scrollable) {
      scrollable.addEventListener("scroll", onScroll);
    }
    window.addEventListener("scroll", onScroll);

    return () => {
      section.removeEventListener("mouseup", onMouseUp);
      section.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
      if (scrollable) {
        scrollable.removeEventListener("scroll", onScroll);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, [sectionRef, handleSelectionEnd, dismiss]);
}
