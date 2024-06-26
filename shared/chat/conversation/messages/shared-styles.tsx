import * as Kb from '@/common-adapters'
// TODO remove
export const sharedStyles = Kb.Styles.styleSheetCreate(() => {
  const editing = {
    borderRadius: 2,
    color: Kb.Styles.globalColors.blackOrBlack,
    paddingLeft: Kb.Styles.globalMargins.tiny,
    paddingRight: Kb.Styles.globalMargins.tiny,
  }
  const sent = Kb.Styles.platformStyles({
    isElectron: {
      // Make text selectable. On mobile we implement that differently.
      cursor: 'text',
      userSelect: 'text',
      whiteSpace: 'pre-wrap',
      width: '100%',
      wordBreak: 'break-word',
    } as const,
    isMobile: {
      ...Kb.Styles.globalStyles.flexBoxColumn,
    },
  })
  const sentEditing = {
    ...sent,
    ...editing,
  }
  const pendingFail = {
    ...sent,
  }
  const pendingFailEditing = {
    ...pendingFail,
    ...editing,
  }
  return {
    editing,
    highlighted: {
      color: Kb.Styles.globalColors.blackOrBlack,
    },
    pendingFail,
    pendingFailEditing,
    sent,
    sentEditing,
  } as const
})
