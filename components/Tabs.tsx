"use client"

import type React from "react"

import { useState } from "react"

interface TabsProps {
  defaultTab?: string
  children: React.ReactNode
}

interface TabListProps {
  children: React.ReactNode
}

interface TabTriggerProps {
  value: string
  children: React.ReactNode
}

interface TabContentProps {
  value: string
  children: React.ReactNode
}

export function Tabs({ defaultTab = "", children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <div className="w-full" data-active-tab={activeTab}>
      {typeof children === "function"
        ? children
        : children &&
          Array.isArray(children) &&
          children.map((child) => {
            if (child.type === TabList) {
              return { ...child, props: { ...child.props, activeTab, setActiveTab } }
            }
            if (child.type === TabContent) {
              return { ...child, props: { ...child.props, activeTab } }
            }
            return child
          })}
    </div>
  )
}

export function TabList({
  children,
  activeTab,
  setActiveTab,
}: TabListProps & { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <div className="flex gap-2 mb-8 bg-slate-100 p-2 rounded-2xl border border-slate-200">
      {children &&
        Array.isArray(children) &&
        children.map((child) => {
          if (child.type === TabTrigger) {
            return { ...child, props: { ...child.props, activeTab, setActiveTab } }
          }
          return child
        })}
    </div>
  )
}

export function TabTrigger({
  value,
  children,
  activeTab,
  setActiveTab,
}: TabTriggerProps & { activeTab: string; setActiveTab: (tab: string) => void }) {
  const isActive = activeTab === value

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
        isActive ? "bg-white text-blue-600 shadow-md" : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  )
}

export function TabContent({ value, children, activeTab }: TabContentProps & { activeTab: string }) {
  if (activeTab !== value) return null

  return <div className="w-full">{children}</div>
}
