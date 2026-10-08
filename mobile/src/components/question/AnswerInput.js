import { forwardRef, useState } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import Icon from '../Icon'

// 정답 입력칸 (웹 .activity-answer-input + 왼쪽 연필 아이콘)
const AnswerInput = forwardRef(function AnswerInput({ theme, value, onChangeText, placeholder, label, onFocus, onBlur, ...rest }, ref) {
  const [focused, setFocused] = useState(false)
  return (
    <View style={styles.wrap}>
      <View pointerEvents="none" style={styles.icon}>
        <Icon name="edit_note" size={24} color={focused ? theme.focus : theme.inputIcon} />
      </View>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        accessibilityLabel={label || placeholder}
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        selectionColor={theme.focus}
        keyboardAppearance="dark"
        onFocus={(e) => {
          setFocused(true)
          onFocus && onFocus(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          onBlur && onBlur(e)
        }}
        style={[
          styles.input,
          { backgroundColor: theme.inputBg, borderColor: focused ? theme.focus : theme.inputBorder, color: theme.text },
          focused && { boxShadow: `0 0 0 1px ${theme.focus}` },
        ]}
        {...rest}
      />
    </View>
  )
})

export default AnswerInput

const styles = StyleSheet.create({
  wrap: { position: 'relative', justifyContent: 'center' },
  icon: { position: 'absolute', left: 14, zIndex: 1 },
  input: {
    height: 56,
    paddingLeft: 46,
    paddingRight: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    outlineStyle: 'none',
  },
})
