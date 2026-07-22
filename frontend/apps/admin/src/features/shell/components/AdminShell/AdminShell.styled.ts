import styled from '@emotion/styled'
import Link from 'next/link'

export const Shell = styled.div`
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  min-height: 100dvh;
  transition: grid-template-columns 460ms cubic-bezier(0.16, 1, 0.3, 1);

  &[data-collapsed='true'] {
    grid-template-columns: 80px minmax(0, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    &,
    &[data-collapsed='true'] {
      grid-template-columns: minmax(0, 1fr);
    }
  }
`

export const Sidebar = styled.aside`
  position: sticky;
  top: 0;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(180deg, #ffffff 0%, #fcfcfd 100%);
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: fixed;
    inset: 0 auto 0 0;
    width: 280px;
    z-index: 30;
    transform: translateX(-100%);
    transition: transform 0.3s ease;

    &[data-open='true'] {
      transform: none;
    }
  }
`

export const SidebarHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 8px;
`

export const BrandGlyph = styled.span`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;

  & img {
    display: block;
  }
`

export const BrandGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  ${Shell}[data-collapsed='true'] & {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    ${Shell}[data-collapsed='true'] & {
      display: flex;
    }
  }
`

export const Brand = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: ${({ theme }) => theme.letterSpacings.kr};
  white-space: nowrap;
`

export const AdminPill = styled.span`
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.badgeInfoBg};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  white-space: nowrap;
`

export const CollapseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.card};
  background: none;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    transform 0.3s ease;

  ${Shell}[data-collapsed='true'] & {
    transform: rotate(180deg);
  }

  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.controlGray};
      color: ${({ theme }) => theme.colors.text};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`

export const MenuLabel = styled.span`
  margin: 20px 12px 8px;
  color: ${({ theme }) => theme.colors.faint};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: 0.06em;
  white-space: nowrap;

  ${Shell}[data-collapsed='true'] & {
    visibility: hidden;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    ${Shell}[data-collapsed='true'] & {
      visibility: visible;
    }
  }
`

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radii.card};
  color: ${({ theme }) => theme.colors.body};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: ${({ theme }) => theme.letterSpacings.kr};
  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    transform 0.18s ease;

  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.controlGray};
      color: ${({ theme }) => theme.colors.text};
    }
  }

  &:active {
    transform: scale(0.98);
    background: ${({ theme }) => theme.colors.controlGrayPress};
  }

  &[data-active='true'] {
    background: ${({ theme }) => theme.colors.badgeInfoBg};
    color: ${({ theme }) => theme.colors.accent};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
  }
`

export const NavIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
`

export const NavLabel = styled.span`
  white-space: nowrap;

  ${Shell}[data-collapsed='true'] & {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    ${Shell}[data-collapsed='true'] & {
      display: inline;
    }
  }
`

export const NavBadge = styled.span`
  display: inline-flex;
  margin-left: auto;

  ${Shell}[data-collapsed='true'] & {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    ${Shell}[data-collapsed='true'] & {
      display: inline-flex;
    }
  }
`

export const SidebarFoot = styled.div`
  margin-top: auto;
  padding-top: 14px;
  position: relative;
`

export const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 8px 10px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 140ms ease,
    border-color 140ms ease;

  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.controlGray};
    }
  }
`

export const UserAvatar = styled.span`
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(1, 60, 255, 0.12);
  color: ${({ theme }) => theme.colors.accent};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`

export const UserMeta = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

export const UserName = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const UserRole = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, #000 78%, transparent 100%);
  mask-image: linear-gradient(to right, #000 78%, transparent 100%);
`

export const MoreSlot = styled.span`
  display: inline-flex;
  margin-left: auto;
  flex-shrink: 0;

  ${Shell}[data-collapsed='true'] & {
    display: none;
  }
`

export const PopoverBackdrop = styled.button`
  position: fixed;
  inset: 0;
  z-index: 25;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: default;
`

export const Popover = styled.div`
  position: absolute;
  bottom: calc(100% + 10px);
  left: 0;
  right: 0;
  z-index: 30;
  padding: 7px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.card};
  box-shadow:
    0 16px 40px -12px rgba(15, 23, 42, 0.22),
    0 4px 12px -6px rgba(15, 23, 42, 0.16);
`

export const PopoverUser = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 8px 9px;
`

export const PopoverDivider = styled.div`
  height: 1px;
  margin: 6px 4px;
  background: ${({ theme }) => theme.colors.border};
`

export const PopoverItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: ${({ theme }) => theme.colors.body};
  text-align: left;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: background-color 120ms ease;

  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.controlGray};
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: ${({ theme }) => theme.colors.danger};
  text-align: left;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: background-color 120ms ease;

  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.badgeDangerBg};
    }
  }
`

export const MobileBar = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    gap: 10px;
    position: sticky;
    top: 0;
    height: 56px;
    padding: 0 16px;
    background: ${({ theme }) => theme.colors.card};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    z-index: 20;
  }
`

export const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.card};
  background: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`

export const Overlay = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 25;
    background: rgba(15, 23, 42, 0.4);
  }
`

export const Main = styled.main`
  min-width: 0;
  background: linear-gradient(180deg, #fbfbfc 0%, #f5f6f8 100%);
`

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 44px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 24px ${({ theme }) => theme.layout.grid.mobileMargin};
  }
`
