import { useState, type ReactNode, type ComponentType } from 'react';
import { useForm, useFieldArray, useWatch, type SubmitHandler, type Control } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import './Form3.css';

// Types
type TabProps = { active: boolean; onClick: () => void; children: ReactNode };

type BasicFormData = { username: string; email: string };

type WatchFormData = { password: string; confirmPassword: string };

type RoleFormData = { role: string; permissions: string };

type Item = { name: string; quantity: number };

type FieldArrayFormData = { items: Item[] };

type PricingFormData = { price: number; quantity: number; taxRate: number };

type ExampleConfig = { title: string; component: ComponentType };

// Components
const Tab = ({ active, onClick, children }: TabProps) => (
  <button type="button" onClick={onClick} className={`tab ${active ? 'active' : ''}`}>
    {children}
  </button>
);

// Example 1: Basic Form with register
function BasicFormExample() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, control } = useForm<BasicFormData>({ mode: 'onBlur' });

  const onSubmit: SubmitHandler<BasicFormData> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(JSON.stringify(data, null, 2));
  };

  const usernameMsg = errors.username?.message;
  const emailMsg = errors.email?.message;

  return (
    <div>
      <h3>1. Register &amp; FormState</h3>
      <p className="text-muted mb-4">
        <strong>register:</strong> Connects native inputs to RHF<br/>
        <strong>formState:</strong> Tracks validation errors, submission state, dirty fields
      </p>

      <input
        {...register('username', {
          required: 'Username required',
          minLength: { value: 3, message: 'Min 3 chars' },
          pattern: { value: /^\w+$/, message: 'Alphanumeric only' }
        })}
        placeholder="Username"
        className={`input mb-1 ${errors.username ? 'input-error' : ''}`}
      />
      {typeof usernameMsg === 'string' && (
        <p className="text-error">{usernameMsg}</p>
      )}

      <input
        {...register('email', {
          required: 'Email required',
          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
        })}
        placeholder="Email"
        className={`input mb-1 ${errors.email ? 'input-error' : ''}`}
      />
      {typeof emailMsg === 'string' && (
        <p className="text-error">{emailMsg}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className={`btn ${isSubmitting ? 'btn-disabled' : 'btn-primary'}`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      <DevTool control={control} />
    </div>
  );
}

// Example 2: Watch & GetValues
function WatchExample() {
  const { register, watch, getValues, formState: { errors }, control } = useForm<WatchFormData>({
    defaultValues: { password: '', confirmPassword: '' }
  });

  const password = watch('password');
  const allValues = watch();
  const confirmMsg = errors.confirmPassword?.message;

  return (
    <div>
      <h3>2. Watch vs GetValues</h3>
      <p className="text-muted mb-4">
        <strong>watch:</strong> Re-renders on change (reactive)<br/>
        <strong>getValues:</strong> Gets current value without re-render
      </p>

      <input
        {...register('password')}
        type="password"
        placeholder="Password"
        className="input mb-4"
      />

      <input
        {...register('confirmPassword', {
          validate: (value) => {
            const { password } = getValues();
            return value === password || 'Passwords must match';
          }
        })}
        type="password"
        placeholder="Confirm Password"
        className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
      />
      {typeof confirmMsg === 'string' && (
        <p className="text-error">{confirmMsg}</p>
      )}

      <div className="panel">
        <strong>Live Values:</strong>
        <pre className="pre">{JSON.stringify(allValues, null, 2)}</pre>
        <p className="p-sm mt-2">Match: {password === allValues.confirmPassword ? '✅' : '❌'}</p>
      </div>
      <DevTool control={control} />
    </div>
  );
}

// Example 3: SetValue & Reset
function SetValueExample() {
  const { register, setValue, reset, watch, control } = useForm<RoleFormData>({
    defaultValues: { role: '', permissions: '' }
  });

  const values = watch();

  return (
    <div>
      <h3>3. SetValue &amp; Reset</h3>
      <p className="text-muted mb-4">
        <strong>setValue:</strong> Programmatically update field values<br/>
        <strong>reset:</strong> Reset entire form or specific fields
      </p>

      <input {...register('role')} placeholder="Role" className="input mb-4" />

      <input {...register('permissions')} placeholder="Permissions" className="input mb-4" />

      <div className="row mb-4">
        <button type="button" onClick={() => { setValue('role', 'Admin'); setValue('permissions', 'read,write,delete'); }} className="btn btn-success btn-sm flex-1">Set Admin</button>
        <button type="button" onClick={() => reset()} className="btn btn-danger btn-sm flex-1">Reset Form</button>
      </div>

      <div className="panel">
        <strong>Current:</strong> {JSON.stringify(values)}
      </div>
      <DevTool control={control} />
    </div>
  );
}

// Example 4: useFieldArray - Dynamic Fields
function FieldArrayExample() {
  const { register, control, handleSubmit } = useForm<FieldArrayFormData>({
    defaultValues: { items: [{ name: '', quantity: 1 }] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const onSubmit: SubmitHandler<FieldArrayFormData> = (data) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <h3>4. useFieldArray (Dynamic Lists)</h3>
      <p className="text-muted mb-4">Add/remove fields dynamically. Perfect for TODO lists, shopping carts, etc.</p>

      {fields.map((field, index) => (
        <div key={field.id} className="row mb-2">
          <input
            {...register(`items.${index}.name` as const, { required: true })}
            placeholder="Item name"
            className="input flex-2"
          />
          <input
            {...register(`items.${index}.quantity` as const, { required: true, valueAsNumber: true })}
            type="number"
            placeholder="Qty"
            className="input flex-1"
          />
          <button type="button" onClick={() => remove(index)} className="btn btn-danger btn-sm">✕</button>
        </div>
      ))}

      <button type="button" onClick={() => append({ name: '', quantity: 1 })} className="btn btn-success mb-4">+ Add Item</button>

      <button type="button" onClick={handleSubmit(onSubmit)} className="btn btn-primary">Submit Order</button>
      <DevTool control={control} />
    </div>
  );
}

// Moved out for performance/linting
function WatchedCalculation({ control }: Readonly<{ control: Control<PricingFormData> }>) {
  const watched = useWatch<PricingFormData>({ control, name: ['price', 'quantity', 'taxRate'] as const });
  const price = Number(watched?.[0] ?? 0);
  const quantity = Number(watched?.[1] ?? 0);
  const taxRate = Number(watched?.[2] ?? 0);
  const subtotal = price * quantity;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="panel panel-blue">
      <p className="mb-1">Subtotal: ${subtotal.toFixed(2)}</p>
      <p className="mb-1">Tax: ${tax.toFixed(2)}</p>
      <p className="mb-1 bold text-lg">Total: ${total.toFixed(2)}</p>
    </div>
  );
}

// Example 5: useWatch (Performance optimized)
function UseWatchExample() {
  const { register, control } = useForm<PricingFormData>({
    defaultValues: { price: 100, quantity: 1, taxRate: 0.1 }
  });

  return (
    <div>
      <h3>5. useWatch (Optimized Watch)</h3>
      <p className="text-muted mb-4">Like watch() but isolated - only re-renders specific components</p>

      <input {...register('price', { valueAsNumber: true })} type="number" placeholder="Price" className="input mb-2" />
      <input {...register('quantity', { valueAsNumber: true })} type="number" placeholder="Quantity" className="input mb-2" />
      <input {...register('taxRate', { valueAsNumber: true })} type="number" step="0.01" placeholder="Tax Rate (0.1 = 10%)" className="input mb-4" />

      <WatchedCalculation control={control} />
      <DevTool control={control} />
    </div>
  );
}

// Main Component
export default function RHFCompleteGuide() {
  const [activeTab, setActiveTab] = useState(0);

  const examples: ExampleConfig[] = [
    { title: 'Register & FormState', component: BasicFormExample },
    { title: 'Watch & GetValues', component: WatchExample },
    { title: 'SetValue & Reset', component: SetValueExample },
    { title: 'useFieldArray', component: FieldArrayExample },
    { title: 'useWatch', component: UseWatchExample }
  ];

  const ActiveExample = examples[activeTab].component;

  return (
    <div className="container">
      <h1 className="h1">React Hook Form - Complete Guide</h1>
      <p className="text-muted mb-8">Essential concepts every developer should know</p>

      <div className="tabs">
        {examples.map((example, index) => (
          <Tab key={example.title} active={activeTab === index} onClick={() => setActiveTab(index)}>
            {example.title}
          </Tab>
        ))}
      </div>

      <div className="card">
        <ActiveExample />
      </div>
    </div>
  );
}
