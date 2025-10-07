# 🚀 React Hook Form - Ultimate Cheatsheet

## 📋 Quick Setup

```javascript
import { useForm } from 'react-hook-form';

const {
  register,        // Connect inputs
  handleSubmit,    // Handle form submission
  watch,           // Watch field values (reactive)
  getValues,       // Get values (non-reactive)
  setValue,        // Set field value
  reset,           // Reset form
  formState,       // Form state (errors, isDirty, etc.)
  control          // For Controller/useFieldArray
} = useForm({
  defaultValues: { email: '', age: 0 },
  mode: 'onBlur'   // When to validate
});
```

---

## 🎯 The 3 Core Patterns

### Pattern 1: Native Inputs (90% of cases)
```javascript
<input {...register('email', {
  required: 'Required',
  pattern: { value: /^\S+@\S+$/i, message: 'Invalid' }
})} />

{errors.email && <span>{errors.email.message}</span>}
```

### Pattern 2: UI Libraries / Custom Components
```javascript
<Controller
  name="country"
  control={control}
  rules={{ required: true }}
  render={({ field }) => (
    <MUISelect {...field} />
  )}
/>
```

### Pattern 3: Dynamic Lists
```javascript
const { fields, append, remove } = useFieldArray({ control, name: 'items' });

fields.map((field, index) => (
  <div key={field.id}>
    <input {...register(`items.${index}.name`)} />
    <button onClick={() => remove(index)}>Delete</button>
  </div>
))
```

---

## 🧠 Memory Tricks & Mnemonics

### "CREW" - Core Methods You'll Use Daily
- **C**ontrol - for Controller/useFieldArray
- **R**egister - connect native inputs
- **E**rrors - from formState.errors
- **W**atch - observe field changes

### "WARS" - When to Re-render?
- **W**atch() - YES (reactive)
- **A**ll formState properties - YES
- **R**egister - NO
- **S**etValue/getValues - NO (unless options set)

### "SRW" - State Management Trio
- **S**etValue - write to form
- **R**eset - clear/initialize form
- **W**atch/getValues - read from form

---

## ⚡ Critical Hacks & Gotchas

### Hack #1: Prevent Re-renders
```javascript
// ❌ BAD: Causes re-render on EVERY field change
const allValues = watch();

// ✅ GOOD: Only re-render when specific field changes
const email = watch('email');

// 🚀 BEST: Isolate in child component
const Email = () => {
  const email = useWatch({ control, name: 'email' });
  return <div>{email}</div>;
};
```

### Hack #2: Transform Values Before Submit
```javascript
// Transform during registration
<input {...register('price', {
  setValueAs: v => parseFloat(v)  // string → number
})} />

// Or in Controller
<Controller
  render={({ field }) => (
    <input
      {...field}
      onChange={e => field.onChange(e.target.value.toUpperCase())}
    />
  )}
/>
```

### Hack #3: Reset to API Data
```javascript
useEffect(() => {
  fetch('/api/user/123')
    .then(res => res.json())
    .then(data => {
      reset(data); // Replaces defaultValues
    });
}, [reset]);
```

### Hack #4: Conditional Validation
```javascript
const country = watch('country');

<input {...register('zipCode', {
  required: country === 'US' ? 'Required for US' : false,
  pattern: country === 'US' ? /^\d{5}$/ : /.*/
})} />
```

### Hack #5: Cross-Field Validation
```javascript
<input {...register('confirmPassword', {
  validate: value => {
    const { password } = getValues();
    return value === password || 'Must match';
  }
})} />
```

### Hack #6: Async Validation with Debounce
```javascript
<input {...register('username', {
  validate: async (value) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // debounce
    const response = await fetch(`/api/check/${value}`);
    const available = await response.json();
    return available || 'Username taken';
  }
})} />
```

---

## 🎨 Validation Rules Cheatsheet

```javascript
register('fieldName', {
  required: 'Error message',
  required: true,  // Generic error

  minLength: { value: 3, message: 'Min 3 chars' },
  maxLength: { value: 20, message: 'Max 20 chars' },

  min: { value: 18, message: 'Must be 18+' },
  max: { value: 100, message: 'Max 100' },

  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email'
  },

  validate: value => value !== 'admin' || 'Reserved',
  validate: {
    positive: v => v > 0 || 'Must be positive',
    lessThan100: v => v < 100 || 'Too high',
    checkAsync: async v => (await api.check(v)) || 'Invalid'
  },

  deps: ['password'], // Re-validate when password changes

  valueAsNumber: true,  // Convert to number
  valueAsDate: true,    // Convert to Date
  setValueAs: v => v.trim()  // Custom transform
})
```

---

## 🔥 Mode Cheatsheet (Validation Timing)

| Mode | When Validates | Best For |
|------|---------------|----------|
| `onSubmit` | Only on submit | Simple forms (default) |
| `onBlur` | On blur + submit | **Best UX** ⭐ |
| `onChange` | Every keystroke | Real-time feedback |
| `onTouched` | After blur, then onChange | Balance performance/UX |
| `all` | Blur + Change | Strict validation |

```javascript
useForm({ mode: 'onBlur' }) // Recommended!
```

---

## 🎭 FormState Properties

```javascript
const { formState } = useForm();

formState.errors          // All validation errors
formState.isDirty         // Any field changed?
formState.dirtyFields     // Which fields changed
formState.touchedFields   // Which fields user touched
formState.isSubmitted     // Form submitted?
formState.isSubmitting    // Currently submitting?
formState.isSubmitSuccessful  // Last submit succeeded?
formState.submitCount     // How many times submitted
formState.isValid         // No validation errors?
formState.isValidating    // Currently validating?
```

---

## 🛠️ useFieldArray Methods

```javascript
const { fields, append, prepend, remove, insert, swap, move, update, replace }
  = useFieldArray({ control, name: 'items' });

append({ name: '' })           // Add to end
prepend({ name: '' })          // Add to start
insert(2, { name: '' })        // Insert at index
remove(1)                      // Remove at index
swap(0, 2)                     // Swap positions
move(0, 2)                     // Move item
update(1, { name: 'New' })     // Update specific item
replace([{ name: 'A' }])       // Replace all
```

---

## 🎯 Decision Tree

```
┌─────────────────────────────────┐
│   Need to connect an input?     │
└────────────┬────────────────────┘
             │
      ┌──────┴──────┐
      │  Is it a    │
      │ native HTML │
      │   input?    │
      └──────┬──────┘
             │
       ┌─────┴─────┐
       │           │
      YES         NO
       │           │
   register()   Controller
                   +
                 control


┌─────────────────────────────────┐
│  Need to read field values?     │
└────────────┬────────────────────┘
             │
      ┌──────┴──────┐
      │   Need UI   │
      │  to update? │
      └──────┬──────┘
             │
       ┌─────┴─────┐
       │           │
      YES         NO
       │           │
    watch()    getValues()


┌─────────────────────────────────┐
│   Need dynamic add/remove?      │
└────────────┬────────────────────┘
             │
        useFieldArray()
```

---

## 💡 Pro Tips & Best Practices

### Tip #1: Always Set defaultValues
```javascript
// ✅ GOOD
useForm({
  defaultValues: { email: '', age: 0 }
})

// ❌ BAD: May cause uncontrolled→controlled warnings
useForm()
```

### Tip #2: Use DevTools
```javascript
import { DevTool } from '@hookform/devtools';

function MyForm() {
  const { control } = useForm();
  return (
    <>
      {/* Your form */}
      <DevTool control={control} />
    </>
  );
}
```

### Tip #3: Type-Safe Forms (TypeScript)
```typescript
interface FormData {
  email: string;
  age: number;
}

const { register } = useForm<FormData>();
// Now register knows valid field names!
```

### Tip #4: Handle Submit Errors
```javascript
const onSubmit = async (data) => {
  try {
    await api.save(data);
  } catch (error) {
    setError('root.serverError', {
      type: 'manual',
      message: error.message
    });
  }
};

{errors.root?.serverError && (
  <div>{errors.root.serverError.message}</div>
)}
```

### Tip #5: Debounce Expensive Validations
```javascript
import { debounce } from 'lodash';

const checkUsername = debounce(async (value) => {
  const res = await fetch(`/api/check/${value}`);
  return await res.json();
}, 500);

register('username', {
  validate: async (value) => {
    const available = await checkUsername(value);
    return available || 'Taken';
  }
});
```

---

## 🐛 Common Mistakes to Avoid

### ❌ Mistake #1: Using watch() everywhere
```javascript
// ❌ BAD: Re-renders on every field change
const formValues = watch();

// ✅ GOOD: Only watch what you need
const email = watch('email');
```

### ❌ Mistake #2: Forgetting field.id in useFieldArray
```javascript
// ❌ BAD: React will warn about keys
fields.map((field, index) => <div key={index}>...</div>)

// ✅ GOOD: Use stable id
fields.map((field) => <div key={field.id}>...</div>)
```

### ❌ Mistake #3: Mutating field arrays directly
```javascript
// ❌ BAD: Don't mutate directly
fields[0].name = 'New';

// ✅ GOOD: Use update method
update(0, { ...fields[0], name: 'New' });
```

### ❌ Mistake #4: Not handling nested objects
```javascript
// ✅ For nested objects, use dot notation
<input {...register('address.street')} />
<input {...register('address.city')} />

// Access nested errors
{errors.address?.street && <span>{errors.address.street.message}</span>}
```

---

## 🚀 Performance Optimization

### 1. Isolate re-renders with useWatch
```javascript
// Instead of this in parent
const price = watch('price');

// Do this in child component
function PriceDisplay() {
  const price = useWatch({ control, name: 'price' });
  return <div>{price}</div>;
}
```

### 2. Use mode: 'onBlur' or 'onSubmit'
```javascript
// Avoid onChange mode for large forms
useForm({ mode: 'onBlur' })
```

### 3. Memoize validation functions
```javascript
const validateEmail = React.useMemo(
  () => async (value) => {
    // expensive validation
  },
  []
);
```

### 4. Use shouldUnregister strategically
```javascript
useForm({
  shouldUnregister: true  // Remove fields from form state when unmounted
})
```

---

## 📚 Quick Reference

### Import Map
```javascript
import {
  useForm,           // Main hook
  Controller,        // For custom components
  useFieldArray,     // Dynamic lists
  useWatch,          // Optimized watch
  useFormContext,    // Access form in nested components
  FormProvider,      // Provide form context
  useController      // Lower-level Controller
} from 'react-hook-form';
```

### Common Patterns
```javascript
// Pattern: Controlled native input
<input {...register('name')} />

// Pattern: Controlled custom component
<Controller name="select" control={control} render={({ field }) => <CustomSelect {...field} />} />

// Pattern: Dynamic array
const { fields, append, remove } = useFieldArray({ control, name: 'todos' });

// Pattern: Conditional fields
{showAddress && <input {...register('address')} />}

// Pattern: Submit with validation
<button onClick={handleSubmit(onSubmit, onError)}>Submit</button>
```

---

## 🎓 Final Memorization Strategy

**Remember "CROW" for daily usage:**
- **C**ontroller → custom components
- **R**egister → native inputs
- **O**bserve with watch() → reactive reads
- **W**rite with setValue() → programmatic updates

**Remember "FAR" for form state:**
- **F**ormState.errors → validation errors
- **A**rray with useFieldArray → dynamic lists
- **R**eset() → clear or reload form

**The Golden Rule:**
> If it's a native HTML input, use `register`.
> If it's anything else, use `Controller` + `control`.

---

## 🔗 Essential Resources

- Docs: https://react-hook-form.com
- DevTools: `npm i -D @hookform/devtools`
- Examples: https://github.com/react-hook-form/react-hook-form/tree/master/examples
- Playground: https://codesandbox.io/s/react-hook-form-v7-ts-basic-8s1kf

---

**Pro Tip:** Print this cheatsheet or save it as a browser bookmark. Review it once a week for a month, and you'll have React Hook Form mastered! 🎯
