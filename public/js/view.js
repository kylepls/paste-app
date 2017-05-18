/* global $, editor, paste, ace*/
$(function() {
  editor = ace.edit('editor');
  editor.setTheme('ace/theme/tomorrow_night_eighties');
  console.log('Loading...')
  if (paste.language) {
    editor.getSession().setMode('ace/mode/' + paste.language);
    console.log('Lang set to', lang)
  } else {
    var out = hljs.highlightAuto(paste.content);
    if (out && out.language) {
      var lang = out.language;
      console.log('lang', lang);
      if (map[lang]) {
        lang = map[lang];
      }
      
      if (lang === 'null') {
        console.log('Lang not found')
        return;
      }
      console.log('Lang set to', lang)
      editor.getSession().setMode('ace/mode/' + lang);
    } else {
      console.log('Lang cannot be detected')
    }
  }

  editor.setValue(paste.content, 1);
  editor.setReadOnly(true);
  editor.setHighlightActiveLine(false);
  editor.setShowPrintMargin(false);
});