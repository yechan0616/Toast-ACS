const SCRIPT = `(function(){try{var s=localStorage.getItem('acs-color-mode');var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;var e=document.documentElement;e.dataset.mode=d?'dark':'light';e.style.colorScheme=d?'dark':'light';}catch(e){}})()`

export function ColorModeScript() {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: 페인트 전에 모드를 적용해요
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  )
}
