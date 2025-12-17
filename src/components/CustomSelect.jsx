import { useState, useRef, useEffect } from 'react'
import './CustomSelect.css'

function CustomSelect({ 
  options = [], 
  value = '', 
  onChange, 
  placeholder = '선택하세요', 
  disabled = false,
  icon = null
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const selectedOption = options.find(opt => opt.value === value)

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className="custom-select-wrapper" ref={selectRef}>
      <div 
        className={`custom-select ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {icon && (
          <div className="custom-select-icon">
            {icon}
          </div>
        )}
        <div className="custom-select-value">
          {selectedOption ? selectedOption.label : placeholder}
        </div>
        <div className="custom-select-arrow">
          <span className="material-symbols-outlined">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </div>
      </div>
      
      {isOpen && (
        <div className="custom-select-dropdown">
          {options.length === 0 ? (
            <div className="custom-select-option disabled">
              옵션이 없습니다
            </div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                className={`custom-select-option ${value === option.value ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default CustomSelect

