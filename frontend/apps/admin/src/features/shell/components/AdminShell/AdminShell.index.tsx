'use client'

import { Badge, pageFade } from '@toast-acs/ui'
import { adminLogout } from 'features/auth/api'
import { fetchOverview } from 'features/dashboard/api'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { usePolling } from 'shared/usePolling'
import * as S from './AdminShell.styled'

const STORAGE_KEY = 'acs-admin-sidebar'
const OVERVIEW_POLL_MS = 10000

function BrandLogo() {
  return <Image src='/brand/gf_color.png' alt='' width={28} height={28} />
}

function DashboardIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <rect
        x='3'
        y='3'
        width='7'
        height='7'
        rx='1.5'
        stroke='currentColor'
        strokeWidth='2'
      />
      <rect
        x='14'
        y='3'
        width='7'
        height='7'
        rx='1.5'
        stroke='currentColor'
        strokeWidth='2'
      />
      <rect
        x='3'
        y='14'
        width='7'
        height='7'
        rx='1.5'
        stroke='currentColor'
        strokeWidth='2'
      />
      <rect
        x='14'
        y='14'
        width='7'
        height='7'
        rx='1.5'
        stroke='currentColor'
        strokeWidth='2'
      />
    </svg>
  )
}

function LogsIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M4 6h16M4 12h16M4 18h10'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  )
}

function RequestsIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <rect x='4' y='3' width='16' height='18' rx='2' />
      <path d='M8 8h8M8 12h8M8 16h4' />
    </svg>
  )
}

function DevicesIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <rect x='2' y='4' width='14' height='11' rx='2' />
      <path d='M2 19h13' />
      <rect x='17' y='9' width='5' height='11' rx='1.5' />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M15 5l-7 7 7 7'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M4 7h16M4 12h16M4 17h16'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M9 4H5v16h4M14 8l4 4-4 4M18 12H9'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

const NAV_ITEMS = [
  { href: '/', label: '대시보드', icon: <DashboardIcon /> },
  { href: '/requests', label: '이용권 신청', icon: <RequestsIcon /> },
  { href: '/devices', label: '활성 기기', icon: <DevicesIcon /> },
  { href: '/logs', label: '로그', icon: <LogsIcon /> },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: overview } = usePolling(fetchOverview, OVERVIEW_POLL_MS)
  const pendingCount = overview?.pendingRequests ?? 0

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === 'collapsed')
  }, [])

  const handleToggle = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, next ? 'collapsed' : 'open')
      return next
    })
  }

  const handleLogout = async () => {
    try {
      await adminLogout()
    } finally {
      router.replace('/login')
    }
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <S.Shell data-collapsed={collapsed ? 'true' : 'false'}>
      <S.MobileBar>
        <S.MenuButton
          type='button'
          aria-label='메뉴 열기'
          onClick={() => setMenuOpen(true)}
        >
          <MenuIcon />
        </S.MenuButton>
        <S.BrandGlyph>
          <BrandLogo />
        </S.BrandGlyph>
        <S.Brand>Toast ACS</S.Brand>
        <S.AdminPill>Admin</S.AdminPill>
      </S.MobileBar>
      {menuOpen && <S.Overlay onClick={() => setMenuOpen(false)} />}
      <S.Sidebar data-open={menuOpen ? 'true' : 'false'}>
        <S.SidebarHead>
          <S.BrandGroup>
            <S.BrandGlyph>
              <BrandLogo />
            </S.BrandGlyph>
            <S.Brand>Toast ACS</S.Brand>
            <S.AdminPill>Admin</S.AdminPill>
          </S.BrandGroup>
          <S.CollapseButton
            type='button'
            aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
            onClick={handleToggle}
          >
            <ChevronIcon />
          </S.CollapseButton>
        </S.SidebarHead>
        <S.MenuLabel>메뉴</S.MenuLabel>
        <S.Nav>
          {NAV_ITEMS.map((item) => (
            <S.NavItem
              key={item.href}
              href={item.href}
              data-active={isActive(item.href) ? 'true' : 'false'}
              onClick={() => setMenuOpen(false)}
            >
              <S.NavIcon>{item.icon}</S.NavIcon>
              <S.NavLabel>{item.label}</S.NavLabel>
              {item.href === '/requests' && pendingCount > 0 && (
                <S.NavBadge>
                  <Badge tone='danger'>{pendingCount}</Badge>
                </S.NavBadge>
              )}
            </S.NavItem>
          ))}
        </S.Nav>
        <S.SidebarFoot>
          <S.LogoutButton type='button' onClick={handleLogout}>
            <S.NavIcon>
              <LogoutIcon />
            </S.NavIcon>
            <S.NavLabel>로그아웃</S.NavLabel>
          </S.LogoutButton>
        </S.SidebarFoot>
      </S.Sidebar>
      <S.Main>
        <S.Content>
          <motion.div
            key={pathname}
            variants={pageFade}
            initial='hidden'
            animate='visible'
          >
            {children}
          </motion.div>
        </S.Content>
      </S.Main>
    </S.Shell>
  )
}
