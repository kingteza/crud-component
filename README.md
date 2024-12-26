# @kingteza/crud-component

React CRUD component library built with Ant Design and TypeScript.

## Installation

```bash
npm install @kingteza/crud-component
```

## Usage

```typescript
import { CrudComponent } from '@kingteza/crud-component';
import { Button } from '@kingteza/crud-component/common';

// Initialize translations
import { setupI18n } from '@kingteza/crud-component';
setupI18n();

function App() {
  return (
    <CrudComponent
      fields={[
        { type: "text", name: "name", label: "Name" }
      ]}
      data={[]}
    />
  );
}