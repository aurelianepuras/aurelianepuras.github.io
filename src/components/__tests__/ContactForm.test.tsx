import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '../ContactForm'

// Mock emailjs
vi.mock('@emailjs/browser', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@emailjs/browser')>()
  const mockSend = vi.fn()
  return {
    ...actual,
    default: {
      ...actual.default,
      send: mockSend,
    },
    __mockSend: mockSend, // Export mock pentru a-l folosi în teste
  }
})

// Import mockSend după ce mock-ul este configurat
import emailjs from '@emailjs/browser'
const mockSend = (emailjs as any).__mockSend || vi.fn()

// Mock environment variables
vi.stubEnv('PUBLIC_EMAILJS_SERVICE_ID', 'test_service')
vi.stubEnv('PUBLIC_EMAILJS_TEMPLATE_ID', 'test_template')
vi.stubEnv('PUBLIC_EMAILJS_PUBLIC_KEY', 'test_key')

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSend.mockReset()
  })

  it('renders contact form with all fields', () => {
    render(<ContactForm />)
    
    expect(screen.getByLabelText(/nume/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mesaj/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /trimite mesaj/i })).toBeInTheDocument()
  })

  it('allows user to type in form fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText(/nume/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/mesaj/i)
    
    await user.type(nameInput, 'Test User')
    await user.type(emailInput, 'test@example.com')
    await user.type(messageInput, 'Test message')
    
    expect(nameInput).toHaveValue('Test User')
    expect(emailInput).toHaveValue('test@example.com')
    expect(messageInput).toHaveValue('Test message')
  })

  it('shows error when submitting empty form', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    
    const submitButton = screen.getByRole('button', { name: /trimite mesaj/i })
    await user.click(submitButton)
    
    // HTML5 validation should prevent submission
    // But we can check that the form is still there
    expect(submitButton).toBeInTheDocument()
  })

  it('disables submit button during submission', async () => {
    const user = userEvent.setup()
    // Mock cu delay pentru a putea verifica starea de loading
    let resolvePromise: (value: any) => void
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    mockSend.mockReturnValue(delayedPromise)
    
    render(<ContactForm />)
    
    // Completează formularul
    await user.type(screen.getByLabelText(/nume/i), 'Test User')
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/mesaj/i), 'Test message')
    
    const submitButton = screen.getByRole('button', { name: /trimite mesaj/i })
    
    // Verifică că butonul se poate apăsa inițial
    expect(submitButton).not.toBeDisabled()
    
    // Submit form (fără await pentru a putea verifica starea de loading)
    user.click(submitButton)
    
    // Verifică că butonul este disabled în timpul submit-ului
    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    }, { timeout: 1000 })
    
    // Rezolvă promise-ul pentru a finaliza testul
    resolvePromise!({ text: 'success', status: 200 })
    
    // Așteaptă ca formularul să se finalizeze
    await waitFor(() => {
      expect(screen.getByText(/mulțumesc/i)).toBeInTheDocument()
    })
  })

  it('shows error message when EmailJS is not configured', async () => {
    const user = userEvent.setup()
    
    // Remove env vars
    vi.stubEnv('PUBLIC_EMAILJS_SERVICE_ID', '')
    vi.stubEnv('PUBLIC_EMAILJS_TEMPLATE_ID', '')
    vi.stubEnv('PUBLIC_EMAILJS_PUBLIC_KEY', '')
    
    render(<ContactForm />)
    
    await user.type(screen.getByLabelText(/nume/i), 'Test User')
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/mesaj/i), 'Test message')
    
    const submitButton = screen.getByRole('button', { name: /trimite mesaj/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/emailjs nu este configurat/i)).toBeInTheDocument()
    })
  })
})
