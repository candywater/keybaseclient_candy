import * as C from '@/constants'
import * as React from 'react'
import * as Kb from '@/common-adapters'
import * as T from '@/constants/types'
import logger from '@/logger'
import {
  chatCJKFontOptions,
  chatNonCJKFontOptions,
  getChatFontFamily,
  useConfigState,
} from '@/constants/config'
import * as DarkMode from '@/constants/darkmode'

const Display = () => {
  const allowAnimatedEmojis = useConfigState(s => s.allowAnimatedEmojis)
  const forceSmallNav = useConfigState(s => s.forceSmallNav)
  const chatCJKFontID = useConfigState(s => s.chatCJKFontID)
  const chatNonCJKFontID = useConfigState(s => s.chatNonCJKFontID)
  const setForceSmallNav = useConfigState(s => s.dispatch.setForceSmallNav)
  const setChatCJKFontID = useConfigState(s => s.dispatch.setChatCJKFontID)
  const setChatNonCJKFontID = useConfigState(s => s.dispatch.setChatNonCJKFontID)
  const toggleForceSmallNav = React.useCallback(() => {
    setForceSmallNav(!forceSmallNav)
  }, [forceSmallNav, setForceSmallNav])
  const previewFontFamily = React.useMemo(
    () => getChatFontFamily(chatNonCJKFontID, chatCJKFontID),
    [chatNonCJKFontID, chatCJKFontID]
  )

  const darkModePreference = DarkMode.useDarkModeState(s => s.darkModePreference)
  const toggleAnimatedEmoji = C.useRPC(T.RPCChat.localToggleEmojiAnimationsRpcPromise)
  const supported = DarkMode.useDarkModeState(s => s.supported)
  const onSetDarkModePreference = DarkMode.useDarkModeState(s => s.dispatch.setDarkModePreference)
  const doToggleAnimatedEmoji = (enabled: boolean) => {
    toggleAnimatedEmoji(
      [{enabled}],
      () => {},
      error => {
        logger.info('Settings::Display: error toggling emoji animation: ' + error.message)
      }
    )
  }
  return (
    <Kb.ScrollView style={styles.scrollview}>
      <Kb.Box style={styles.container}>
        <Kb.Box2 direction="vertical" fullWidth={true} gap="medium">
          <Kb.Box2 direction="vertical" fullWidth={true} gap="tiny">
            <Kb.Text type="Header">Appearance</Kb.Text>
            {supported && (
              <Kb.RadioButton
                label="Respect system settings"
                selected={darkModePreference === 'system'}
                onSelect={() => onSetDarkModePreference('system')}
              />
            )}
            <Kb.RadioButton
              label="Dark"
              selected={darkModePreference === 'alwaysDark'}
              onSelect={() => onSetDarkModePreference('alwaysDark')}
            />
            <Kb.RadioButton
              label={<Kb.Text type="Body">Light</Kb.Text>}
              selected={darkModePreference === 'alwaysLight'}
              onSelect={() => onSetDarkModePreference('alwaysLight')}
            />
            <Kb.Divider style={styles.fontDivider} />
            <Kb.Text type="BodySmallSemibold">Chat font - non-CJK</Kb.Text>
            {chatNonCJKFontOptions.map(option => (
              <Kb.RadioButton
                key={option.id}
                label={option.label}
                selected={chatNonCJKFontID === option.id}
                onSelect={() => setChatNonCJKFontID(option.id)}
              />
            ))}
            <Kb.Text type="BodySmallSemibold">Chat font - CJK (汉字)</Kb.Text>
            {chatCJKFontOptions.map(option => (
              <Kb.RadioButton
                key={option.id}
                label={option.label}
                selected={chatCJKFontID === option.id}
                onSelect={() => setChatCJKFontID(option.id)}
              />
            ))}
            <Kb.Box2 direction="vertical" gap="xtiny" style={styles.previewBox}>
              <Kb.Text type="BodySmallSemibold">Preview</Kb.Text>
              <Kb.Text type="Body" style={{fontFamily: previewFontFamily}}>
                The quick brown fox jumps over the lazy dog. 你好，世界！聊天字体预览。
              </Kb.Text>
            </Kb.Box2>
          </Kb.Box2>
          <Kb.Box2 direction="vertical" fullWidth={true} gap="tiny">
            <Kb.Text type="Header">Emoji</Kb.Text>
            <Kb.Checkbox
              label="Allow animated emoji"
              checked={allowAnimatedEmojis}
              onCheck={doToggleAnimatedEmoji}
            />
          </Kb.Box2>
          {C.isElectron && (
            <Kb.Box2 direction="vertical" fullWidth={true} gap="tiny">
              <Kb.Text type="Header">Navigation</Kb.Text>
              <Kb.Checkbox
                label="Force small navigation"
                checked={forceSmallNav}
                onCheck={toggleForceSmallNav}
              />
            </Kb.Box2>
          )}
        </Kb.Box2>
      </Kb.Box>
    </Kb.ScrollView>
  )
}

const styles = Kb.Styles.styleSheetCreate(() => ({
  container: {
    ...Kb.Styles.globalStyles.flexBoxColumn,
    flex: 1,
    padding: Kb.Styles.globalMargins.small,
    width: '100%',
  },
  scrollview: {
    width: '100%',
  },
  fontDivider: {
    marginBottom: Kb.Styles.globalMargins.xtiny,
    marginTop: Kb.Styles.globalMargins.tiny,
  },
  previewBox: {
    borderColor: Kb.Styles.globalColors.black_20,
    borderRadius: Kb.Styles.borderRadius,
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: Kb.Styles.globalMargins.xtiny,
    padding: Kb.Styles.globalMargins.tiny,
  },
}))

export default Display
