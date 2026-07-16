# 🔧 PHASE 11: CORRIGER LES ANOMALIES

**Date:** $(date)
**Status:** À FAIRE
**Anomalies à corriger:** 4 mineures

---

## 📋 ANOMALIES À CORRIGER

### 1. Button Ghost Variant - Dark Mode Contraste
**Sévérité:** 🟡 MOYEN
**Fichier:** `frontend/src/components/Button.css`

**Problème:**
```css
.btn-ghost {
  color: var(--color-primary);  /* Purple #7d2fea */
}

@media (prefers-color-scheme: dark) {
  /* NO override = low contrast on dark bg */
}
```

**Solution:**
Ajouter override en dark mode pour lighter color

**À faire:**
```css
@media (prefers-color-scheme: dark) {
  .btn-ghost {
    color: var(--color-primary-light);  /* Lighter purple */
  }
  
  .btn-ghost:hover:not(:disabled) {
    color: var(--color-white);
  }
}
```

**Priorité:** HIGH - À corriger avant test utilisateur

---

### 2. Header Navigation - Focus Ring
**Sévérité:** 🟡 MOYEN
**Fichier:** `frontend/src/components/Header.css`

**Problème:**
- Focus ring peut ne pas être visible sur tous les navigateurs
- Links sur gradient peuvent avoir contraste insuffisant

**À vérifier:**
```
[ ] Navigation links visibles en light mode
[ ] Navigation links visibles en dark mode
[ ] Focus ring visible partout
[ ] Hover states clear
[ ] Active state clear
```

**Priorité:** MEDIUM - À vérifier

---

### 3. Input Component - Focus Ring Dark Mode
**Sévérité:** 🟡 LOW
**Fichier:** `frontend/src/components/Input.css`

**À vérifier:**
```css
.input:focus,
.textarea:focus,
.select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(125, 47, 234, 0.1);
}

@media (prefers-color-scheme: dark) {
  /* Verify shadow visibility */
}
```

**Priorité:** LOW - À vérifier

---

### 4. Badge Component - Dark Mode Colors
**Sévérité:** 🟢 TRÈS LOW
**Fichier:** `frontend/src/components/Badge.css`

**À vérifier:**
- Badge colors visible en dark mode
- Contraste suffisant

**Priorité:** TRÈS LOW - À vérifier

---

## 🔧 ÉTAPES DE CORRECTION

### Étape 1: Corriger Button Ghost Dark Mode

**Fichier:** `frontend/src/components/Button.css`

**Localiser:**
```css
/* ==========================================
   VARIANT: GHOST
   ========================================== */

.btn-ghost {
  background: transparent;
  border: none;
  color: var(--color-primary);
}

/* ... */

/* ==========================================
   DARK MODE
   ========================================== */

@media (prefers-color-scheme: dark) {
  /* ... other rules ... */
}
```

**À ajouter dans dark mode section:**
```css
.btn-ghost {
  color: var(--color-primary-light);  /* Lighter purple for contrast */
}

.btn-ghost:hover:not(:disabled) {
  background: rgba(195, 132, 252, 0.1);  /* Light purple tint */
  color: var(--color-white);
}
```

**Vérification:**
- [x] Purple text visible on dark background
- [x] Hover state clear
- [x] Focus state visible

---

### Étape 2: Vérifier Header Navigation

**Fichier:** `frontend/src/components/Header.css`

**À tester:**
1. Ouvrir Header en light mode
   - [ ] Links lisibles
   - [ ] Hover visible
   - [ ] Focus ring visible

2. Ouvrir Header en dark mode
   - [ ] Links lisibles
   - [ ] Hover visible
   - [ ] Focus ring visible

3. Tester clavier
   - [ ] Tab navigue tous les links
   - [ ] Focus ring toujours visible
   - [ ] Escape key works (if applicable)

---

### Étape 3: Vérifier Input Focus Dark Mode

**Fichier:** `frontend/src/components/Input.css`

**À tester:**
1. Ouvrir formulaire
2. Focus sur input
3. Vérifier:
   - [ ] Focus ring visible en light mode
   - [ ] Focus ring visible en dark mode
   - [ ] Shadow visible et contrastant
   - [ ] Border color change

---

### Étape 4: Vérifier Badge Dark Mode

**Fichier:** `frontend/src/components/Badge.css`

**À tester:**
1. Afficher badges en light mode - OK? ✅
2. Afficher badges en dark mode
   - [ ] Text visible
   - [ ] Contraste bon
   - [ ] Colors appropriate

---

## 📝 GUIDE DE TEST

### Test 1: Light Mode
```
1. Ouvrir https://qrpipay-frontend.onrender.com
2. Vérifier tous les éléments visibles
3. Vérifier contraste suffisant
4. Vérifier hover states
5. Vérifier focus rings
```

### Test 2: Dark Mode
```
1. Cliquer sur thème toggle (🌙)
2. Vérifier tous les éléments visibles
3. Vérifier contraste suffisant
4. Vérifier hover states
5. Vérifier focus rings
6. Rafraîchir page - theme persiste?
```

### Test 3: Keyboard Navigation
```
1. Appuyer Tab - navigate tous les éléments
2. Appuyer Shift+Tab - navigate backwards
3. Appuyer Enter - activate buttons
4. Appuyer Escape - close modals
5. Vérifier focus ring toujours visible
```

### Test 4: Responsive
```
1. Desktop (1920px) - tout OK?
2. Tablet (768px) - tout OK?
3. Mobile (375px) - tout OK?
```

---

## ✅ CHECKLIST DE CORRECTION

### Before Corrections
```
[ ] Button ghost - tested in light
[x] Button ghost - tested in dark (FAILS)
[ ] Header nav - tested in light
[ ] Header nav - tested in dark
[ ] Input focus - tested in dark
[ ] Badge colors - tested in dark
```

### After Corrections
```
[ ] Button ghost - tested in light (should pass)
[ ] Button ghost - tested in dark (should pass)
[ ] Header nav - tested in light (should pass)
[ ] Header nav - tested in dark (should pass)
[ ] Input focus - tested in dark (should pass)
[ ] Badge colors - tested in dark (should pass)
```

---

## 🎯 PROCESSUS

1. **Corriger** les anomalies (fichiers CSS)
2. **Tester** en light & dark mode
3. **Vérifier** contraste & focus rings
4. **Commit** les changements
5. **Push** à GitHub
6. **Vérifier** Render auto-deploy
7. **Confirmer** tout fonctionne live

---

## 📊 STATUT

**Avant corrections:**
```
Anomalies: 4 à corriger
Status: 🟡 À faire
```

**Après corrections:**
```
Anomalies: 0 restantes
Status: 🟢 Complet
```

---

**PROCHAINE ÉTAPE:** 
Corriger ces anomalies une par une

