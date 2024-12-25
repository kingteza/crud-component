# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## Internationalization

This library uses react-i18next for translations. There are several ways to customize translations:

### 1. Override during setup

```typescript
import { setupI18n } from 'crud-component';

// Override translations during initialization
setupI18n({
  translations: {
    en: {
      'crud-component': {
        button: {
          delete: 'Remove',
          clone: 'Duplicate',
          // ... other button translations
        }
      }
    },
    es: {
      'crud-component': {
        button: {
          delete: 'Eliminar',
          clone: 'Duplicar',
        }
      }
    }
  },
  language: 'en' // or 'es' for Spanish
});
```

### 2. Override at runtime

```typescript
import { updateTranslations } from 'crud-component';

// Add or update translations for a specific language
updateTranslations('en', {
  button: {
    delete: 'Remove Item',
    clone: 'Make Copy'
  }
});

// Add a new language
updateTranslations('fr', {
  button: {
    delete: 'Supprimer',
    clone: 'Dupliquer'
  }
});
```

### 3. Use with existing i18next setup

If you already have i18next in your application:

```typescript
import i18next from 'i18next';
import { TRANSLATION_NAMESPACE } from 'crud-component';

// Add translations to your existing i18next instance
i18next.addResourceBundle('en', TRANSLATION_NAMESPACE, {
  button: {
    delete: 'Custom Delete',
    clone: 'Custom Clone'
  }
}, true, true);
```

### Available Translation Keys

The default translation keys are:

```typescript
{
  button: {
    delete: string;
    clone: string;
    // ... other button types
  }
  // ... other namespaces
}
```

You can override any of these keys or add new ones as needed.