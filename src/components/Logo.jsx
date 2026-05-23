export default function Logo({ size = 24, className = '' }) {
  return (
    <img
      src={chrome.runtime.getURL('icons/icon-48.png')}
      alt="linkdrop"
      width={size}
      height={size}
      className={`rounded-[22%] ${className}`}
    />
  )
}
