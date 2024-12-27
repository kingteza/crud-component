# @kingteza/crud-component

React CRUD component library built with Ant Design and TypeScript.

## Installation

```bash
npm install @kingteza/crud-component
```

## Prerequisites

This library has the following peer dependencies that need to be installed:

```bash
npm install antd@^5.22.6 react@^18.3.1 react-dom@^18.3.1 react-router-dom@^7.0.0
```

## Setup

### 1. Initialize translations

The library uses i18next for internationalization. You need to set it up before using the components:

```typescript
import { setupI18n } from '@kingteza/crud-component';

// Basic setup with default English translations
setupI18n();

// Or with custom options
setupI18n({
  language: 'en', // default language
  translations: {
    en: {
      'crud-component': {
        // your custom translations
      }
    }
  },
  i18nInstance: existingI18nInstance // optional: use your existing i18n instance
});
```

### 2. Usage

```typescript
import { CrudComponent } from '@kingteza/crud-component';
import { Button } from '@kingteza/crud-component/common';

function App() {
  return (
    <CrudComponent
      fields={[
        { type: "text", name: "name", label: "Name", required: true },
        { type: "select", name: "status", label: "Status", options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" }
        ]}
      ]}
      data={[]}
      onSave={(data) => console.log(data)}
    />
  );
}
```

### 3. Available Imports

The library provides several entry points for importing components:

```typescript
// Main CRUD component
import { CrudComponent } from '@kingteza/crud-component';

// Common components
import { Button, Select, DatePicker } from '@kingteza/crud-component/common';

// Utility functions
import { DateUtil } from '@kingteza/crud-component/util';
```

## Documentation

For detailed documentation of components and their props, please visit our [GitHub repository](https://github.com/kingteza/crud-component).

## License

MIT