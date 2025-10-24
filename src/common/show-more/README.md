# Custom ShowMore Component

A simple, working implementation of a "show more/less" text component that replaces the `react-show-more-text` library.

## Features

- **Line-based truncation**: Truncate text after a specified number of lines
- **Responsive**: Automatically detects when content overflows
- **Simple & Clean**: No unnecessary complexity or extra hooks
- **Customizable**: Support for custom "show more/less" text and styling
- **Accessibility**: Proper ARIA labels and keyboard support
- **Flexible**: Support for custom width, CSS classes, and truncated ending components

## Props

```typescript
interface ShowMoreProps {
  anchorClass?: string;           // CSS class for the toggle button
  children?: React.ReactNode;     // Content to display
  className?: string;             // CSS class for the container
  expanded?: boolean;            // Initial expanded state
  keepNewLines?: boolean;        // Preserve line breaks in text
  less?: React.ReactNode;        // Text for "show less" button
  lines?: number;                // Number of lines to show (default: 3)
  more?: React.ReactNode;        // Text for "show more" button
  onClick?: (expanded: boolean) => void; // Callback when toggled
  width?: number;                // Fixed width in pixels
  truncatedEndingComponent?: React.ReactNode; // Custom component to show when truncated
}
```

## Usage Examples

### Basic Usage
```tsx
import { ShowMore } from './common/show-more';

<ShowMore lines={3}>
  This is a long text that will be truncated after 3 lines...
</ShowMore>
```

### Custom Text and Lines
```tsx
<ShowMore 
  lines={2} 
  more="Read more" 
  less="Read less"
>
  Your long content here...
</ShowMore>
```

### With Custom Styling
```tsx
<ShowMore 
  lines={3}
  className="my-custom-class"
  anchorClass="my-button-class"
  width={400}
>
  Content with custom styling...
</ShowMore>
```

### With Truncated Ending Component
```tsx
<ShowMore 
  lines={2}
  truncatedEndingComponent={<span style={{ color: 'red' }}>...</span>}
>
  Content with custom ending...
</ShowMore>
```

### Preserve Line Breaks
```tsx
<ShowMore 
  lines={3}
  keepNewLines={true}
>
  Content with
  line breaks
  preserved...
</ShowMore>
```

### With Callback
```tsx
<ShowMore 
  lines={3}
  onClick={(expanded) => console.log('Expanded:', expanded)}
>
  Content with callback...
</ShowMore>
```

## CSS Classes

The component uses the following CSS classes:

- `.show-more-container`: Main container
- `.show-more-less-clickable`: Toggle button (default class)

## Implementation Details

- Uses CSS `-webkit-line-clamp` for line-based truncation
- Automatically detects content overflow
- Responsive to window resize events
- Uses proper semantic HTML with `<button>` element
- Includes accessibility features (ARIA labels, keyboard support)

## How It Works

- **Simple overflow detection**: Uses `scrollHeight` vs calculated max height
- **CSS line-clamp**: Uses `-webkit-line-clamp` for clean truncation
- **Window resize handling**: Rechecks overflow on window resize
- **Clean state management**: Simple useState for expanded/toggle states

## Browser Support

- Modern browsers with CSS `-webkit-line-clamp` support
- ResizeObserver support (IE11+ with polyfill)
- Fallback behavior for older browsers (shows full content)
