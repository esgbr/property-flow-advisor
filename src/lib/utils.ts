
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if an element is a form input element
 */
export function isInputElement(element: Element | null): boolean {
  return element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    element?.getAttribute('role') === 'textbox' ||
    element?.hasAttribute('contenteditable');
}

/**
 * Detect if user is navigating with keyboard
 * This can be used to conditionally apply focus styles
 */
export function detectKeyboardUser() {
  function handleFirstTab(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-user');
      
      window.removeEventListener('keydown', handleFirstTab);
      window.addEventListener('mousedown', handleMouseDownOnce);
    }
  }
  
  function handleMouseDownOnce() {
    document.body.classList.remove('keyboard-user');
    
    window.removeEventListener('mousedown', handleMouseDownOnce);
    window.addEventListener('keydown', handleFirstTab);
  }
  
  window.addEventListener('keydown', handleFirstTab);
}

/**
 * Handle keyboard interaction with non-button interactive elements
 * @param callback Function to call when Enter or Space is pressed
 */
export function handleKeyboardActivation(
  callback: () => void
): React.KeyboardEventHandler {
  return (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };
}

/**
 * Generate an accessible name for a chart
 */
export function generateChartDescription(
  title: string,
  data: any[],
  xKey: string,
  yKey: string
): string {
  if (!data || data.length === 0) {
    return `Chart titled "${title}" with no data.`;
  }

  const dataPoints = data.map(
    item => `${item[xKey] || 'unknown'}: ${item[yKey] || '0'}`
  ).join(', ');
  
  return `Chart titled "${title}" showing ${data.length} data points. Data: ${dataPoints}`;
}

/**
 * Create a keyboard accessible grid navigation
 */
export function createGridKeyboardNavigation(
  gridSelector: string,
  itemSelector: string
) {
  return (e: KeyboardEvent) => {
    const grid = document.querySelector(gridSelector);
    if (!grid) return;
    
    const items = Array.from(grid.querySelectorAll(itemSelector));
    const currentIndex = items.findIndex(item => item === document.activeElement);
    if (currentIndex === -1) return;
    
    const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    const rows = Math.ceil(items.length / columns);
    
    const currentRow = Math.floor(currentIndex / columns);
    const currentCol = currentIndex % columns;
    
    let nextIndex: number | null = null;
    
    switch (e.key) {
      case 'ArrowRight':
        nextIndex = currentIndex + 1 < items.length ? currentIndex + 1 : null;
        break;
      case 'ArrowLeft':
        nextIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : null;
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + columns < items.length ? currentIndex + columns : null;
        break;
      case 'ArrowUp':
        nextIndex = currentIndex - columns >= 0 ? currentIndex - columns : null;
        break;
      case 'Home':
        nextIndex = currentRow * columns;
        break;
      case 'End':
        nextIndex = Math.min((currentRow + 1) * columns - 1, items.length - 1);
        break;
    }
    
    if (nextIndex !== null) {
      e.preventDefault();
      (items[nextIndex] as HTMLElement).focus();
    }
  };
}
