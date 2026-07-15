# 🎨 FEUILLE DE ROUTE DESIGN - QRPiPay

**Date:** $(date)
**Status:** À Implémenter
**Priority:** Design System Foundation

---

## 📊 AUDIT ACTUEL

### ✅ Points Positifs
- Gradient vibrant et attrayant (Purple → Orange → Yellow)
- Logo Pi visible et reconnaissable
- Card blanche bien centrée (bonne lisibilité du contenu)
- Bouton CTA violet (contraste visible)
- Layout équilibré verticalement
- Stats cards présentes et informatives

### ⚠️ Points à Améliorer
- Gradient trop chaotique - pas cohérent d'une page à l'autre
- Polices non clairement définies
- Boutons manquent de cohérence (forme, taille, ombres)
- Pas de design system visible
- Couleurs secondaires mal définies
- Accessibilité (contraste) à vérifier

---

## 🎯 PHASE 1: DÉFINITION DE LA PALETTE

### Couleurs Primaires
```
Primary Brand: #7D2FEA (Violet Pi - Logo)
Secondary: #FF6B35 (Orange Warm)
Tertiary: #FFD600 (Yellow Accent)
```

### Couleurs de Base
```
Background Light: #F8F9FA (Gris très clair)
Background Dark: #1A1A2E (Très foncé - night mode)
Surface: #FFFFFF (Blanc pur)
Surface Secondary: #F5F5F5 (Gris léger)
```

### Couleurs Sémantiques
```
Success: #10B981 (Vert)
Error: #EF4444 (Rouge)
Warning: #F59E0B (Orange)
Info: #3B82F6 (Bleu)
```

### Dégradés
```
Hero Gradient: linear-gradient(135deg, #7D2FEA 0%, #FF6B35 50%, #FFD600 100%)
Subtle Gradient: linear-gradient(135deg, #F8F9FA 0%, #F5F5F5 100%)
Dark Gradient: linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)
```

---

## 🔤 PHASE 2: SYSTÈME TYPOGRAPHIQUE

### Polices
```
Heading Font: "Inter Bold" ou "Poppins Bold"
  - Usage: Titres (H1, H2, H3)
  - Weight: 700 (Bold)
  - Line Height: 1.2

Body Font: "Inter Regular" ou "Roboto Regular"
  - Usage: Contenu principal, texte
  - Weight: 400 (Regular)
  - Line Height: 1.6

Accent Font: "Inter SemiBold"
  - Usage: Labels, badges, CTA text
  - Weight: 600
  - Line Height: 1.4
```

### Hiérarchie des Tailles
```
H1: 48px (Titres page) - Bold
H2: 36px (Sous-titres) - Bold
H3: 28px (Section headers) - SemiBold
H4: 24px (Card titles) - SemiBold

Body Large: 18px - Regular
Body Regular: 16px - Regular
Body Small: 14px - Regular
Caption: 12px - Regular

Button Text: 16px - SemiBold
Label: 14px - SemiBold
```

---

## 🎨 PHASE 3: COMPOSANTS & FORMES

### Boutons
```
PRIMARY BUTTON
- Background: #7D2FEA (Violet)
- Text: FFFFFF (Blanc)
- Padding: 12px 24px
- Border Radius: 8px
- Font: 16px Bold
- Shadow: 0 4px 12px rgba(125, 47, 234, 0.3)
- Hover: #6B24D9 (Darker) + Scale 1.02
- Active: #5B1FB8 (Even darker)
- Disabled: #CCCCCC (Gris)

SECONDARY BUTTON
- Background: Transparent
- Border: 2px #7D2FEA
- Text: #7D2FEA
- Padding: 12px 24px
- Border Radius: 8px
- Hover: Background #F8F9FA
- Active: Background #E8E8FF

OUTLINE BUTTON
- Background: Transparent
- Border: 1px #E5E7EB (Gris clair)
- Text: #374151 (Gris foncé)
- Padding: 12px 24px
- Border Radius: 8px
- Hover: Background #F3F4F6

SUCCESS BUTTON
- Background: #10B981 (Vert)
- Text: FFFFFF
- Padding: 12px 24px
- Border Radius: 8px
- Shadow: 0 4px 12px rgba(16, 185, 129, 0.3)
```

### Cards
```
STANDARD CARD
- Background: #FFFFFF
- Border Radius: 12px
- Shadow: 0 2px 8px rgba(0, 0, 0, 0.08)
- Padding: 24px
- Border: 1px #E5E7EB (optionnel)
- Hover: Shadow 0 4px 16px rgba(0, 0, 0, 0.12)

HIGHLIGHTED CARD
- Background: linear-gradient(135deg, #F8F9FA 0%, #F5F5F5 100%)
- Border: 2px #7D2FEA
- Border Radius: 12px
- Padding: 24px

DARK CARD (Night Mode)
- Background: #1F2937
- Text: #FFFFFF
- Border: 1px #374151
- Border Radius: 12px
- Padding: 24px
```

### Input Fields
```
INPUT STANDARD
- Background: #F9FAFB
- Border: 1px #D1D5DB
- Border Radius: 8px
- Padding: 12px 16px
- Font: 16px Regular
- Placeholder: #9CA3AF (Gris)
- Focus: Border #7D2FEA + Shadow 0 0 0 3px rgba(125, 47, 234, 0.1)
- Error: Border #EF4444

LABEL
- Font: 14px SemiBold
- Color: #374151
- Margin Bottom: 8px
- Required: Ajouter astérisque rouge *
```

---

## 🌈 PHASE 4: ARRIÈRE-PLANS & FONDS

### Hero Section
```
Background: linear-gradient(135deg, #7D2FEA 0%, #FF6B35 50%, #FFD600 100%)
Height: 300px - 400px
Content Color: FFFFFF (Blanc)
Overlay: Optional semi-transparent dark (rgba(0,0,0,0.2))
```

### Page Background (Light Mode)
```
Primary: #F8F9FA (Gris très clair)
Pattern: Subtle grid ou dots (opacity 5%)
```

### Page Background (Dark Mode)
```
Primary: #0F172A (Bleu très foncé)
Pattern: Subtle grid ou dots (opacity 5%)
```

### Card Backgrounds
```
White Cards: #FFFFFF
Gray Cards: #F5F5F5
Purple Accent: #F3E8FF (Très léger violet)
```

---

## ✨ PHASE 5: OMBRES & EFFETS

### Shadow System
```
Shadow XS: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
Shadow SM: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
Shadow MD: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
Shadow LG: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
Shadow XL: 0 20px 25px -5px rgba(0, 0, 0, 0.1)

Usage:
- XS/SM: Input fields, small components
- MD: Cards, standard components
- LG: Modals, prominent cards
- XL: Hero sections, large modals
```

### Effects
```
Hover Scale: transform scale(1.02)
Hover Elevation: Increase shadow by 1 level
Focus: Outline #7D2FEA 2px offset 2px
Active: Scale 0.98 (press effect)
Transition: all 0.2s ease-in-out
```

---

## 📐 PHASE 6: SPACING SYSTEM

```
4px: XS (padding badges, icons)
8px: SM (padding small buttons)
12px: MD (padding standard buttons)
16px: LG (padding cards)
24px: XL (padding sections)
32px: 2XL (margin between sections)
48px: 3XL (margin between major sections)
```

---

## 🎭 PHASE 7: HARMONIE GLOBALE

### Palette Recommandée par Page

**Login Page**
- Hero: Gradient violet → orange
- Card: Blanc
- Button: Violet primary
- Background: Gris clair

**Dashboard Page**
- Header: Gradient
- Cards: Blanc avec border violet subtile
- Stats: Vert success, Rouge error, Orange warning
- Background: Gris très clair

**QR Generator Page**
- Hero: Gradient
- Input: Gris clair border
- Preview Card: Blanc avec shadow
- Button: Violet primary
- Background: Gris très clair

**Payment History Page**
- Header: Gradient
- Table: Blanc rows, gris alternantes
- Status Badges: Vert/Orange/Rouge
- Buttons: Violet primary
- Background: Gris très clair

**Dark Mode (All Pages)**
- Background: Bleu très foncé
- Cards: Gris foncé (#1F2937)
- Text: Blanc
- Accents: Violet + Orange (unchanged)

---

## 🎯 PHASE 8: CONSISTENCY RULES

### Do's ✅
- ✅ Toujours utiliser la palette définie
- ✅ Maintenir le spacing system (multiples de 4px)
- ✅ Border radius cohérent: 8px (inputs), 12px (cards)
- ✅ Ombres de la shadow system
- ✅ Polices définies
- ✅ Contraste minimum AA (WCAG)

### Don'ts ❌
- ❌ Pas de couleurs aléatoires
- ❌ Pas de bordures inconsistantes
- ❌ Pas de typo mélangées
- ❌ Pas d'ombres custom
- ❌ Pas de spacing aléatoire
- ❌ Pas de dégradés différents

---

## 📋 IMPLÉMENTATION CHECKLIST

### Step 1: Setup Design Tokens
- [ ] Créer variables CSS pour couleurs
- [ ] Créer variables CSS pour typo
- [ ] Créer variables CSS pour spacing
- [ ] Créer variables CSS pour shadows

### Step 2: Component Library
- [ ] Refactoriser Button component
- [ ] Refactoriser Card component
- [ ] Refactoriser Input component
- [ ] Refactoriser Badge component

### Step 3: Page Updates
- [ ] Update Login page
- [ ] Update Dashboard page
- [ ] Update QR Generator page
- [ ] Update Payment History page

### Step 4: Testing
- [ ] Test dark mode
- [ ] Test accessibility
- [ ] Test responsive design
- [ ] Test all browsers

### Step 5: Documentation
- [ ] Créer Storybook
- [ ] Documenter components
- [ ] Documenter colors
- [ ] Documenter typography

---

## 🚀 PRIORITÉ

1. **HIGH**: Palette de couleurs + typo (Foundation)
2. **HIGH**: Button & Card refactoring
3. **MEDIUM**: Page updates
4. **MEDIUM**: Dark mode
5. **LOW**: Storybook & documentation

---

## 📊 TIMELINE

- **Week 1**: Design tokens + components
- **Week 2**: Page updates
- **Week 3**: Testing & refinement
- **Week 4**: Documentation

---

**Status:** 🟢 Prêt à implémenter

Prochaine étape: Commencer par les Design Tokens (CSS variables)
