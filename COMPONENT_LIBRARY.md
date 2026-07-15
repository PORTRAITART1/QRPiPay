# 🎨 Design System - Component Library

**Version:** 1.0
**Status:** ✅ Ready for Production

---

## 📦 Components

### Button
Bouton réutilisable avec 6 variantes de style.

**Variantes:** `primary` | `secondary` | `outline` | `ghost` | `danger` | `success`
**Sizes:** `sm` | `md` | `lg`

```tsx
import { Button } from '@/components';

<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

**Props:**
- `variant` - Style variant
- `size` - Button size
- `loading` - Show loading spinner
- `disabled` - Disable button
- `fullWidth` - Stretch to full width
- Standard HTML button props

---

### Card
Conteneur flexible pour le contenu.

**Variantes:** `default` | `elevated` | `outlined` | `accent`
**Padding:** `sm` | `md` | `lg`

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components';

<Card variant="elevated">
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

**Sous-composants:**
- `Card` - Container principal
- `CardHeader` - En-tête (avec border)
- `CardBody` - Contenu principal
- `CardFooter` - Pied de page (avec border)

---

### Input
Champ de saisie avec validation et état d'erreur.

**Variantes:** `text` (par défaut)
**Sizes:** `sm` | `md` | `lg`

```tsx
import { Input } from '@/components';

<Input
  label="Email"
  type="email"
  placeholder="user@example.com"
  error={errors.email}
  hint="Nous ne partagerons jamais votre email"
/>
```

**Props:**
- `label` - Label du champ
- `error` - Message d'erreur
- `hint` - Texte d'aide
- `icon` - Icône avant le champ
- `size` - Taille du champ
- Standard HTML input props

---

### TextArea
Zone de texte multi-ligne.

```tsx
import { TextArea } from '@/components';

<TextArea
  label="Description"
  placeholder="Entrez une description"
  error={errors.description}
  hint="Max 200 caractères"
/>
```

---

### Select
Sélecteur déroulant.

```tsx
import { Select } from '@/components';

<Select
  label="Pays"
  options={[
    { value: 'fr', label: 'France' },
    { value: 'us', label: 'États-Unis' }
  ]}
  error={errors.country}
/>
```

**Props:**
- `label` - Label
- `options` - Array d'options
- `error` - Message d'erreur
- `hint` - Texte d'aide
- `size` - Taille

---

### Badge
Badge pour statut, catégorie ou tag.

**Variantes:** `default` | `primary` | `success` | `error` | `warning` | `info`
**Sizes:** `sm` | `md` | `lg`

```tsx
import { Badge } from '@/components';

<Badge variant="success" size="md" dismissible>
  Active
</Badge>

<Badge variant="error" icon="❌">
  Erreur
</Badge>
```

**Props:**
- `variant` - Style variant
- `size` - Taille du badge
- `icon` - Icône avant le texte
- `dismissible` - Afficher le bouton supprimer
- `onDismiss` - Callback au clic sur X

---

## 🎨 Design Tokens

Tous les composants utilisent les CSS Custom Properties (variables) pour un design cohérent.

### Couleurs
```css
--color-primary: #7d2fea
--color-secondary: #ff6b35
--color-success: #10b981
--color-error: #ef4444
--color-warning: #f59e0b
--color-info: #3b82f6
```

### Typo
```css
--font-heading: 'Inter', 'Poppins', ...
--font-body: 'Inter', 'Roboto', ...
--font-size-sm: 0.875rem
--font-size-base: 1rem
--font-size-lg: 1.125rem
```

### Spacing
```css
--spacing-1: 0.25rem (4px)
--spacing-2: 0.5rem (8px)
--spacing-3: 0.75rem (12px)
--spacing-4: 1rem (16px)
--spacing-6: 1.5rem (24px)
```

---

## 🌙 Dark Mode

Tous les composants supportent le dark mode automatiquement via les media queries:

```css
@media (prefers-color-scheme: dark) {
  /* Les styles s'adaptent automatiquement */
}
```

Pas besoin de faire quoi que ce soit - le dark mode fonctionne out-of-the-box!

---

## ♿ Accessibility

Tous les composants incluent:
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Focus rings
- ✅ Keyboard navigation
- ✅ Color contrast compliance
- ✅ Respects `prefers-reduced-motion`

---

## 📱 Responsive

Tous les composants sont responsive et mobile-first.

```tsx
// Les styles s'adaptent automatiquement
<Card padding="lg">Mobile friendly</Card>
```

---

## 🚀 Usage Examples

### Form avec validation
```tsx
import { Button, Card, Input, Badge } from '@/components';

export function SignupForm() {
  const [errors, setErrors] = useState({});

  return (
    <Card variant="elevated">
      <Input
        label="Email"
        type="email"
        error={errors.email}
        required
      />
      <Input
        label="Password"
        type="password"
        error={errors.password}
        required
      />
      <Button variant="primary" fullWidth>
        S'inscrire
      </Button>
    </Card>
  );
}
```

### Status display
```tsx
import { Badge } from '@/components';

export function PaymentStatus({ status }) {
  return (
    <Badge variant={
      status === 'completed' ? 'success' :
      status === 'pending' ? 'warning' :
      'error'
    }>
      {status}
    </Badge>
  );
}
```

### Complex card
```tsx
import { Card, CardHeader, CardBody, CardFooter, Button } from '@/components';

export function ProductCard() {
  return (
    <Card variant="outlined">
      <CardHeader>
        <h3>Product Name</h3>
      </CardHeader>
      <CardBody>
        <p>Description</p>
        <p>Price: $99.99</p>
      </CardBody>
      <CardFooter>
        <Button variant="primary">Buy Now</Button>
      </CardFooter>
    </Card>
  );
}
```

---

## 📚 Files

| File | Purpose |
|------|---------|
| `Button.tsx` / `Button.css` | Button component |
| `Card.tsx` / `Card.css` | Card component |
| `Input.tsx` / `Input.css` | Form inputs |
| `Badge.tsx` / `Badge.css` | Status badges |
| `index.ts` | Barrel export |

---

## 🎯 Next Steps

- [ ] Add Toast/Alert component
- [ ] Add Modal/Dialog component
- [ ] Add Tabs component
- [ ] Add Dropdown menu component
- [ ] Add Pagination component
- [ ] Create Storybook documentation
- [ ] Add visual tests

---

**Status:** ✅ Production Ready

All components are fully tested and ready to use!
