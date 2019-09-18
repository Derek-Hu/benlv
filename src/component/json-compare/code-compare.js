import styles from './style.module.less';

function diffSchema(one, other) {
  // <script src="https://cdnjs.cloudflare.com/ajax/libs/jsdiff/4.0.1/diff.min.js"></script>
  var diff = window.Diff.diffJson(one, other),
    fragment = [];

  var count = 1;
  diff.forEach(function(part) {
    var color = part.added ? 'green' : part.removed ? 'red' : 'grey';
    var indicator = part.added ? '+' : part.removed ? '-' : '&nbsp;';
    var datas = showCodeLine(part.value.split(/\n/), color, indicator, count);
    count = datas.count;
    fragment.push(datas.data);
  });
  return fragment.join('');
}
function showCodeLine(lines, color, indicator, count) {
  if (!count) {
    count = 1;
  }
  var decorateLines = [];
  for (var i = 0, len = lines.length; i < len; i++) {
    var data = '<span style="color:' + color + '">' + lines[i] + '</span>';
    if (lines[i]) {
      decorateLines.push(
        `<span class="${styles.row} ${styles[color]}"><span class="${styles.line} noselect">${count++}</span><span class="${
          styles.indicator
        } noselect">${indicator}&nbsp;</span>${data}</span>`
      );
    } else {
      decorateLines.push('');
    }
  }
  return {
    count: count,
    data: decorateLines.join('\n')
  };
}
export default function outDiffMessage(oldV, newV) {
  var isOldArray = Object.prototype.toString.call(oldV) === '[object Array]';
  var isOldObject = Object.prototype.toString.call(oldV) === '[object Object]';

  var isNewArray = Object.prototype.toString.call(newV) === '[object Array]';
  var isNewObject = Object.prototype.toString.call(newV) === '[object Object]';
  if (isNewArray || isNewObject || isOldArray || isOldObject) {
    if (oldV && newV) {
      return diffSchema(oldV, newV);
    } else if (oldV) {
      return showCodeLine(JSON.stringify(oldV, null, 2).split('\n'), 'red', '-').data;
    } else if (newV) {
      return showCodeLine(JSON.stringify(newV, null, 2).split('\n'), 'green', '+').data;
    }
  }
}
