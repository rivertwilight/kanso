import { useEffect, RefObject, useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { articleHighlightsAtom, highlightPopupAtom } from "../atoms";
import type { Highlight } from "../types";

/**
 * Remove all <mark data-highlight-id> elements by unwrapping them,
 * then normalize the container to merge adjacent text nodes.
 */
function clearMarks(container: HTMLElement) {
  const marks = container.querySelectorAll("mark[data-highlight-id]");
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) {
      parent.insertBefore(mark.firstChild, mark);
    }
    parent.removeChild(mark);
  });
  container.normalize();
}

/**
 * For a given highlight, find the text node ranges and wrap them in <mark> elements.
 * Wraps per text node to avoid breaking nested DOM structure.
 */
function applyHighlight(container: HTMLElement, highlight: Highlight) {
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null
  );

  let accumulated = 0;
  let node: Text | null;
  const nodesToWrap: { node: Text; localStart: number; localEnd: number }[] = [];

  while ((node = walker.nextNode() as Text | null)) {
    const nodeLen = node.textContent?.length ?? 0;
    const nodeStart = accumulated;
    const nodeEnd = accumulated + nodeLen;

    // Check if this text node overlaps with the highlight range
    if (nodeEnd > highlight.startOffset && nodeStart < highlight.endOffset) {
      const localStart = Math.max(0, highlight.startOffset - nodeStart);
      const localEnd = Math.min(nodeLen, highlight.endOffset - nodeStart);
      nodesToWrap.push({ node, localStart, localEnd });
    }

    accumulated += nodeLen;
    if (accumulated >= highlight.endOffset) break;
  }

  // Validate: extract the actual text from the ranges and compare
  const actualText = nodesToWrap
    .map(({ node, localStart, localEnd }) =>
      node.textContent?.slice(localStart, localEnd) ?? ""
    )
    .join("");

  if (actualText !== highlight.text) {
    // Content has changed since this highlight was saved — skip it
    return;
  }

  // Wrap each segment in a <mark> element
  for (const { node, localStart, localEnd } of nodesToWrap) {
    const textLen = node.textContent?.length ?? 0;

    // Split the text node to isolate the highlighted portion
    let targetNode = node;

    // If highlight doesn't start at the beginning, split off the prefix
    if (localStart > 0) {
      targetNode = targetNode.splitText(localStart);
    }

    // If highlight doesn't end at the end, split off the suffix
    const highlightLen = localEnd - localStart;
    if (highlightLen < (targetNode.textContent?.length ?? 0)) {
      targetNode.splitText(highlightLen);
    }

    // Create the mark element and wrap the target text node
    const mark = document.createElement("mark");
    mark.className = "reader-highlight";
    mark.dataset.highlightId = highlight.id;
    if (highlight.note) {
      mark.dataset.hasNote = "true";
    }
    targetNode.parentNode!.insertBefore(mark, targetNode);
    mark.appendChild(targetNode);
  }
}

export function useHighlightRenderer(
  sectionRef: RefObject<HTMLElement | null>,
  wrapperRef: RefObject<HTMLElement | null>
) {
  const highlights = useAtomValue(articleHighlightsAtom);
  const setHighlightPopup = useSetAtom(highlightPopupAtom);

  // Apply highlights to the DOM
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    clearMarks(section);

    // Sort by startOffset so we apply in order
    const sorted = [...highlights].sort(
      (a, b) => a.startOffset - b.startOffset
    );

    for (const hl of sorted) {
      applyHighlight(section, hl);
    }

    return () => {
      // Cleanup on unmount or before re-apply
      if (sectionRef.current) {
        clearMarks(sectionRef.current);
      }
    };
  }, [highlights, sectionRef]);

  // Click delegation for existing highlights
  const handleHighlightClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const mark = target.closest("mark[data-highlight-id]") as HTMLElement | null;
      const wrapper = wrapperRef.current;

      if (!mark || !wrapper) return;

      const highlightId = mark.dataset.highlightId;
      if (!highlightId) return;

      const markRect = mark.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      let x = markRect.left + markRect.width / 2 - wrapperRect.left;
      let y = markRect.top - wrapperRect.top - 44;

      if (y < 0) {
        y = markRect.bottom - wrapperRect.top + 8;
      }

      x = Math.max(60, Math.min(x, wrapperRect.width - 60));

      setHighlightPopup({ visible: true, x, y, highlightId });
    },
    [wrapperRef, setHighlightPopup]
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    section.addEventListener("click", handleHighlightClick);
    return () => section.removeEventListener("click", handleHighlightClick);
  }, [sectionRef, handleHighlightClick]);
}
