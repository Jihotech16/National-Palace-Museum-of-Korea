import './ErrorToast.css'

function ErrorToast({ message, isVisible }) {
  if (!isVisible || !message) return null

  return (
    <div className="error-toast" role="alert">
      <span className="material-symbols-outlined error-toast-icon">info</span>
      <span className="error-toast-message">{message}</span>
    </div>
  )
}

export default ErrorToast

