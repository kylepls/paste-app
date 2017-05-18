/* global $, ace, paste, map */

var editor;
var find = $('#find');
var auto = true;

$(function() {
  ace.require("ace/ext/language_tools");
  editor = ace.edit('editor');
  
  if (paste.language) {
    editor.setValue(paste.content, 1);
    setMode(paste.language);
  }
  
  editor.setTheme('ace/theme/tomorrow_night_eighties');
  editor.setShowPrintMargin(false);

  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: false
  });

  $('select').change(function() {
    var element = $(this);
    auto = false;
    var opt = element.find(':selected');
    if (opt.hasClass("auto")) {
      auto = true;
      console.log('Enabled auto detect')
    }
    editor.getSession().setMode('ace/mode/' + opt.attr('value'));
  });
  
  $('#save').click(function() {
    save(null, null, null);
  })
  
  editor.commands.addCommand({
    name: 'saveFile',
    bindKey: {
      win: 'Ctrl-S',
      mac: 'Command-S',
      sender: 'editor|cli'
    },
    exec: save
  });
  
  editor.commands.addCommand({
    name: 'find',
    bindKey: {
      win: 'Ctrl-F',
      mac: 'Command-F',
      sender: 'editor|cli'
    },
    exec: find
  });
  
  $('#closeError').click(function() {
    $('#error').fadeOut(50);
  })
  
  editor.getSession().on('change', function() {
    if (!auto) {
      return;
    }
    var out = hljs.highlightAuto(editor.getValue());
    if (out && out.language) {
      var lang = out.language;
      console.log('lang', lang);
      if (map[lang]) {
        lang = map[lang];
      }
      
      if (lang === 'null') {
        return;
      }
      
      setMode(lang);
    }
  });
});

function setMode(mode) {
  editor.getSession().setMode('ace/mode/' + mode);
  $('select').val(mode);
}

function find(env, arge, request) {
  find.draggable();
  find.show();
}

function save(env, arge, request) {
  var lang = $('select').find(':selected').attr('value');
  if (lang === 'text') {
    lang = '';
  }
  console.log('lang', lang);
  $.ajax({
    type: 'POST',
    url: '/create',
    data: {
      content: editor.getValue(),
      language: lang
    },
    success: function(data) {
      window.location = '/' + data.id;
    },
    error: function(error) {
      
      $('#errorInfo').text(error.responseJSON.error);
      $('#error').fadeIn(50);
      
      console.log('er', error);
    }
  });
}