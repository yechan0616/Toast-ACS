'use client'

import type { AdminProfile } from '@toast-acs/shared'
import { Badge, pageFade } from '@toast-acs/ui'
import { adminLogout, fetchAdminProfile } from 'features/auth/api'
import { ProfileModal } from 'features/auth/components/ProfileModal/ProfileModal.index'
import { fetchOverview } from 'features/dashboard/api'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { AvatarContent } from 'shared/Avatar'
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
      width='18'
      height='18'
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

function EditIcon() {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M4 20h4L18 10l-4-4L4 16v4Z'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinejoin='round'
      />
      <path d='M13.5 6.5l4 4' stroke='currentColor' strokeWidth='1.8' />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='#8A93A6'
      aria-hidden='true'
    >
      <circle cx='5' cy='12' r='1.7' />
      <circle cx='12' cy='12' r='1.7' />
      <circle cx='19' cy='12' r='1.7' />
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
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const { data: overview } = usePolling(fetchOverview, OVERVIEW_POLL_MS)
  const pendingCount = overview?.pendingRequests ?? 0

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === 'collapsed')
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchAdminProfile(controller.signal)
      .then(setProfile)
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const displayName = profile?.name ?? '관리자'
  const displayId = profile?.username ?? ''

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
        <S.AdminPill>Admin</S.AdminPill>
      </S.MobileBar>
      {menuOpen && <S.Overlay onClick={() => setMenuOpen(false)} />}
      <S.Sidebar data-open={menuOpen ? 'true' : 'false'}>
        <S.SidebarHead>
          <S.BrandGroup>
            <S.BrandGlyph>
              <BrandLogo />
            </S.BrandGlyph>
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
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href)
            return (
              <S.NavItem
                key={item.href}
                href={item.href}
                data-active={active ? 'true' : 'false'}
                onClick={() => setMenuOpen(false)}
              >
                {active && (
                  <S.NavActiveBg
                    layoutId='nav-active'
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
                <S.NavIcon>{item.icon}</S.NavIcon>
                <S.NavLabel>{item.label}</S.NavLabel>
                {item.href === '/requests' && pendingCount > 0 && (
                  <S.NavBadge>
                    <Badge tone='danger'>{pendingCount}</Badge>
                  </S.NavBadge>
                )}
              </S.NavItem>
            )
          })}
        </S.Nav>
        <S.SidebarFoot>
          {userMenuOpen && (
            <>
              <S.PopoverBackdrop
                type='button'
                aria-label='메뉴 닫기'
                onClick={() => setUserMenuOpen(false)}
              />
              <S.Popover>
                <S.PopoverUser>
                  <S.UserAvatar>
                    <AvatarContent
                      src={profile?.avatar}
                      fallback={displayName.charAt(0)}
                    />
                  </S.UserAvatar>
                  <S.UserMeta>
                    <S.UserName>{displayName}</S.UserName>
                    <S.UserRole>{displayId}</S.UserRole>
                  </S.UserMeta>
                </S.PopoverUser>
                <S.PopoverDivider />
                <S.PopoverItem
                  type='button'
                  onClick={() => {
                    setUserMenuOpen(false)
                    setProfileOpen(true)
                  }}
                  disabled={!profile}
                >
                  <EditIcon />
                  프로필 수정
                </S.PopoverItem>
                <S.LogoutButton type='button' onClick={handleLogout}>
                  <LogoutIcon />
                  로그아웃
                </S.LogoutButton>
              </S.Popover>
            </>
          )}
          <S.UserButton
            type='button'
            onClick={() => setUserMenuOpen((prev) => !prev)}
          >
            <S.UserAvatar>
              <AvatarContent
                src={profile?.avatar}
                fallback={displayName.charAt(0)}
              />
            </S.UserAvatar>
            <S.UserMeta>
              <S.UserName>{displayName}</S.UserName>
              <S.UserRole>{displayId}</S.UserRole>
            </S.UserMeta>
            <S.MoreSlot>
              <MoreIcon />
            </S.MoreSlot>
          </S.UserButton>
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
      {profileOpen && profile && (
        <ProfileModal
          profile={profile}
          onClose={() => setProfileOpen(false)}
          onSaved={setProfile}
        />
      )}
    </S.Shell>
  )
}
