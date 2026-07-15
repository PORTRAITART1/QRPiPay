/**
 * Component Tests - Jest & React Testing Library
 * Unit tests for all design system components
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import { Input, TextArea, Select } from './Input';
import { Badge } from './Badge';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '../context/ThemeContext';

// ==========================================
// BUTTON TESTS
// ==========================================

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success'] as const;
    variants.forEach(variant => {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole('button', { name: new RegExp(variant) })).toHaveClass(`btn-${variant}`);
      unmount();
    });
  });

  it('renders all sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach(size => {
      const { unmount } = render(<Button size={size}>{size}</Button>);
      expect(screen.getByRole('button', { name: new RegExp(size) })).toHaveClass(`btn-${size}`);
      unmount();
    });
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading spinner when loading prop is true', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-loading');
    expect(button).toBeDisabled();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('stretches to full width with fullWidth prop', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-full-width');
  });
});

// ==========================================
// CARD TESTS
// ==========================================

describe('Card Component', () => {
  it('renders card with children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['default', 'elevated', 'outlined', 'accent'] as const;
    variants.forEach(variant => {
      const { unmount } = render(<Card variant={variant}>Content</Card>);
      expect(screen.getByText('Content')).toHaveClass(`card-${variant}`);
      unmount();
    });
  });

  it('renders all padding sizes', () => {
    const paddings = ['sm', 'md', 'lg'] as const;
    paddings.forEach(padding => {
      const { unmount } = render(<Card padding={padding}>Content</Card>);
      expect(screen.getByText('Content')).toHaveClass(`card-padding-${padding}`);
      unmount();
    });
  });

  it('renders CardHeader with border', () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
      </Card>
    );
    expect(screen.getByText('Header')).toHaveClass('card-header');
  });

  it('renders CardBody', () => {
    render(
      <Card>
        <CardBody>Body</CardBody>
      </Card>
    );
    expect(screen.getByText('Body')).toHaveClass('card-body');
  });

  it('renders CardFooter', () => {
    render(
      <Card>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText('Footer')).toHaveClass('card-footer');
  });
});

// ==========================================
// INPUT TESTS
// ==========================================

describe('Input Component', () => {
  it('renders input with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders input with error message', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('renders input with hint text', () => {
    render(<Input label="Email" hint="Enter a valid email" />);
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
  });

  it('renders required asterisk', () => {
    render(<Input label="Email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('updates value on input change', () => {
    render(<Input label="Name" />);
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'John' } });
    expect(input.value).toBe('John');
  });

  it('applies error class when error exists', () => {
    render(<Input label="Email" error="Invalid" />);
    expect(screen.getByLabelText('Email')).toHaveClass('input-error');
  });

  it('renders all sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach(size => {
      const { unmount } = render(<Input label="Test" size={size} />);
      expect(screen.getByText('Test').parentElement).toHaveClass(`input-size-${size}`);
      unmount();
    });
  });
});

// ==========================================
// TEXTAREA TESTS
// ==========================================

describe('TextArea Component', () => {
  it('renders textarea with label', () => {
    render(<TextArea label="Message" />);
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('updates value on change', () => {
    render(<TextArea label="Message" />);
    const textarea = screen.getByLabelText('Message') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    expect(textarea.value).toBe('Hello world');
  });

  it('renders error message', () => {
    render(<TextArea label="Message" error="Too short" />);
    expect(screen.getByText('Too short')).toBeInTheDocument();
  });
});

// ==========================================
// SELECT TESTS
// ==========================================

describe('Select Component', () => {
  const options = [
    { value: 'fr', label: 'France' },
    { value: 'us', label: 'United States' },
  ];

  it('renders select with label', () => {
    render(<Select label="Country" options={options} />);
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Select label="Country" options={options} />);
    expect(screen.getByDisplayValue('France')).toBeInTheDocument();
    expect(screen.getByDisplayValue('United States')).toBeInTheDocument();
  });

  it('updates value on selection', () => {
    render(<Select label="Country" options={options} />);
    const select = screen.getByLabelText('Country') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'us' } });
    expect(select.value).toBe('us');
  });

  it('renders error message', () => {
    render(<Select label="Country" options={options} error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});

// ==========================================
// BADGE TESTS
// ==========================================

describe('Badge Component', () => {
  it('renders badge with text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const variants = ['default', 'primary', 'success', 'error', 'warning', 'info'] as const;
    variants.forEach(variant => {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toHaveClass(`badge-${variant}`);
      unmount();
    });
  });

  it('renders all sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach(size => {
      const { unmount } = render(<Badge size={size}>{size}</Badge>);
      expect(screen.getByText(size)).toHaveClass(`badge-${size}`);
      unmount();
    });
  });

  it('renders dismiss button when dismissible', () => {
    render(<Badge dismissible>Dismissible</Badge>);
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
  });

  it('calls onDismiss callback when dismiss button clicked', () => {
    const handleDismiss = jest.fn();
    render(<Badge dismissible onDismiss={handleDismiss}>Dismissible</Badge>);
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders with icon', () => {
    render(<Badge icon="✨">Starred</Badge>);
    expect(screen.getByText('✨')).toBeInTheDocument();
  });
});

// ==========================================
// THEME TOGGLE TESTS
// ==========================================

describe('ThemeToggle Component', () => {
  it('renders three theme buttons', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(screen.getByRole('button', { name: /light mode/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dark mode/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /system preference/i })).toBeInTheDocument();
  });

  it('changes active state when theme button clicked', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const darkButton = screen.getByRole('button', { name: /dark mode/i });
    fireEvent.click(darkButton);
    expect(darkButton).toHaveClass('active');
  });
});

// ==========================================
// INTEGRATION TESTS
// ==========================================

describe('Component Integration', () => {
  it('renders complete form with all input types', () => {
    render(
      <Card>
        <CardHeader>Contact Form</CardHeader>
        <CardBody>
          <Input label="Email" type="email" />
          <TextArea label="Message" />
          <Select label="Subject" options={[{ value: '1', label: 'Support' }]} />
        </CardBody>
        <CardFooter>
          <Button variant="primary">Submit</Button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('renders dashboard with stats and actions', () => {
    render(
      <div>
        <Card variant="elevated">
          <CardBody>
            <p>Total: 100 Pi</p>
            <Badge variant="success">✓ Completed</Badge>
          </CardBody>
        </Card>
        <Button variant="primary">New Payment</Button>
        <Button variant="secondary">History</Button>
      </div>
    );

    expect(screen.getByText('Total: 100 Pi')).toBeInTheDocument();
    expect(screen.getByText('✓ Completed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new payment/i })).toBeInTheDocument();
  });
});
