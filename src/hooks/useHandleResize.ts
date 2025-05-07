import { MouseEventHandler, useRef } from "react";

type useResizeProps = {
  direction: "horizontal" | "vertical";
};

/**
 * A custom React hook that provides resize functionality for a box element.
 *
 * @param options - The configuration options for the resize hook
 * @param options.direction - The direction of resize: "horizontal" or "vertical"
 *
 * @returns An object containing:
 * - boxRef: React ref to attach to the resizable element
 * - handleResize: Event handler function to initiate resize operation
 *
 * @example
 * ```tsx
 * const { boxRef, handleResize } = useResize({ direction: 'horizontal' });
 *
 * return (
 *   <div
 *     ref={boxRef}
 *     onMouseDown={handleResize}
 *   >
 *     Resizable Content
 *   </div>
 * );
 * ```
 *
 * @remarks
 * The hook manages mouse events to handle the resize operation:
 * - MouseDown initiates the resize
 * - MouseMove updates the dimensions
 * - MouseUp completes the resize operation
 *
 * During resize:
 * - Cursor style is updated to indicate resize direction
 * - Text selection is disabled
 * - Element dimensions are updated in real-time
 *
 * @see {@link useResizeProps} for configuration options
 */
export function useResize({ direction }: useResizeProps) {
  // Ref to the box that will be resized
  const boxRef = useRef<HTMLDivElement>(null);

  /**
   * Handles the resize functionality when user initiates a resize operation.
   * Sets up mouse move and mouse up event listeners for resizing the box element.
   *
   * @param event - The MouseEvent that triggered the resize operation
   *
   * @remarks
   * This function:
   * - Gets the current box dimensions and mouse position
   * - Sets up mousemove handler to:
   *   - Update cursor style
   *   - Prevent text selection
   *   - Resize box horizontally or vertically based on direction
   * - Sets up mouseup handler to:
   *   - Clean up event listeners
   *   - Reset cursor and text selection styles
   *
   * Requires:
   * - boxRef to be a valid React ref to the resizable element
   * - direction to be either "horizontal" or "vertical"
   */
  const handleResize: MouseEventHandler<HTMLDivElement> = (event) => {
    const box = boxRef.current;
    if (!box) return;

    // get the current box dimensions
    const { width: w, height: h } = window.getComputedStyle(box);
    const { clientX, clientY } = event; //current mouse position

    // set the initial position of the mouse
    const startPos = {
      x: clientX,
      y: clientY,
    };

    // handle the resize when the mouse moves
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      document.body.style.cursor =
        direction === "horizontal" ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";

      const { clientX, clientY } = e; // current mouse position
      const width = parseInt(w, 10); // current width of the box
      const height = parseInt(h, 10); // current height of the box
      const dx = clientX - startPos.x; // distance moved in x direction
      const dy = clientY - startPos.y; // distance moved in y direction
      if (direction === "horizontal") {
        box.style.width = `${width + dx}px`;
      } else if (direction === "vertical") {
        box.style.height = `${height - dy}px`;
      }
    };

    // cleanup function to remove the event listeners
    // when the mouse is released
    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return {
    boxRef,
    handleResize,
  };
}
