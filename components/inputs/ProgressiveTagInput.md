# ProgressiveTagInput Component

## Overview
A dynamic tag input component that progressively generates new input slots as users add tags.

## Features
- **Progressive Slots**: Starts with 1 empty slot, auto-creates next slot on blur/Enter
- **Validation**: 
  - Character restriction (letters, numbers, `-`, `_`)
  - Length limit (1-20 chars)
  - Uniqueness check (case-insensitive)
  - Max tags configurable
- **Keyboard Controls**:
  - `Enter`: Commit tag and stay focused for next
  - `Backspace` on empty: Delete previous tag
- **Visual Feedback**: Shows existing tags as chips with remove buttons

## Usage Example

```tsx
import { ProgressiveTagInput } from "@/components/inputs/ProgressiveTagInput";
import { useState } from "react";

function MyForm() {
  const [tags, setTags] = useState<string[]>([]);

  return (
    <ProgressiveTagInput
      value={tags}
      onChange={setTags}
      label="Tags (Optional)"
      maxTags={10}
      disabled={false}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string[]` | - | Current tags (controlled) |
| `onChange` | `(tags: string[]) => void` | - | Callback when tags change |
| `maxTags` | `number` | `10` | Maximum number of tags |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `label` | `string` | `"Tags"` | Label for input field |

## Key Implementation Details

1. **Progressive Generation**: Input field only shows when `value.length < maxTags`
2. **Smart Commit**: Tags are committed on blur or Enter, empty values are ignored
3. **Live Validation**: Character restrictions are checked during typing
4. **Uniqueness**: Case-insensitive check prevents duplicates
5. **Accessibility**: Uses MUI TextField with proper labels and error states
