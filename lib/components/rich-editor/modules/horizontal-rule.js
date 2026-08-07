import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed')

class HorizontalRuleBlot extends BlockEmbed {}

HorizontalRuleBlot.blotName = 'hr'
HorizontalRuleBlot.tagName = 'hr'

export default HorizontalRuleBlot
