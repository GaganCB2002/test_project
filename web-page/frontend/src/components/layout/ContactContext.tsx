import React, { createContext, useContext, useState } from 'react'
import { ContactModal } from './ContactModal'

interface ContactContextType {
  openContact: () => void
}

const ContactContext = createContext<ContactContextType | undefined>(undefined)

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openContact = () => setIsOpen(true)
  const closeContact = () => setIsOpen(false)

  return (
    <ContactContext.Provider value={{ openContact }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={closeContact} />
    </ContactContext.Provider>
  )
}

export function useContact() {
  const context = useContext(ContactContext)
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider')
  }
  return context
}
