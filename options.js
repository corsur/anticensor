function getSites() {
  json = localStorage.getItem('sites') || '[]'; 
  return JSON.parse(json);
}

function setSites(list) {
  localStorage.setItem('sites', JSON.stringify(list));
  storageUpdate();
}

function add() {
  var $site = $('#site');
  if ($site.val() == '') {
    alert('Enter a url pattern', 'error');
    return;
  }
  try {
    new RegExp($site.val());
  } catch(err) {
    alert('Error: '+err, 'error');
    return;
  }
  sites = getSites();
  sites.push([$site.val()]);
  setSites(sites);
  $site.val('');
  alert('Site added.');
}

function remove() {
  sites = getSites();
  if (!sites) {
    // something odd happened, trigger storage update.
    storageUpdate();
    return;
  }
  sites.splice(this.value, 1);
  setSites(sites);
  alert('Site removed.');
}

function alert(msg, type) {
  var $alert = $('#alert');
  var timeout;
  type = type || 'success'
  $alert.find('span.msg').html(msg);
  $alert.attr('class', 'alert fade in alert-'+type);
  $alert.show();
  clearTimeout(timeout);
  timeout = setTimeout(function() {
    $alert.slideUp();
  }, 3000);
}

function storageUpdate() {
  var sites = getSites();
  var $tbody = $('#sites table tbody');
  $tbody.html('');
  $('#sites').toggle(sites.length>0);
  for (var i=0; i<sites.length; i++) {
    addToTable(i, sites[i]);
  }
}

function tmpl(id, context) {
  var tmpl = $('#'+id).html()
  for (var v in context) {
    tmpl = tmpl.replace('{{'+v+'}}', context[v]);
  }
  return $(tmpl);
}

function addToTable(id, site) {
  var $row = tmpl('table_row_tpl', {
    'id': id,
    'site': site,
  });
  $row.find('button.remove').on('click', remove);
  $row.appendTo($('#sites table tbody'));
}


$(document).ready(function(){
  $('#add').on('click', add);
  $('#alert').alert();
  storageUpdate();
});