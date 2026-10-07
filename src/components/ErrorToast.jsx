import './ErrorToast.css'

function ErrorToast({ message, isVisible }) {
  if (!isVisible || !message) return null

  return (
    <div className="error-toast">
      {message}
    </div>
  )
}

export default ErrorToast

