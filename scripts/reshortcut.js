var currentShortcut = null;
var shortcuts = new Array();

var maxProgress = 0;
var currentProgress = 0;

var initLesson1 = function () {
    shortcuts = new Array();

    shortcuts.push({ short: 'ctrl-e u', name: 'Surround with', count: 0 });
    // shortcuts.push({ short: 'ctrl-t', name: 'Go to everything', count: 0 });
    shortcuts.push({ short: 'alt-enter', name: 'Available quick-fixes and context actions', count: 0 });
    shortcuts.push({ short: 'ctrl-space', name: 'Code completion', count: 0 });
    shortcuts.push({ short: 'ctrl-alt-space', name: 'Smart code completion', count: 0 });
    shortcuts.push({ short: 'alt-\\', name: 'Go to file member', count: 0 });
    shortcuts.push({ short: 'f12', name: 'Go to declaration', count: 0 });
    shortcuts.push({ short: 'ctrl-f12', name: 'Go to implementation', count: 0 });
    shortcuts.push({ short: 'ctrl-r r', name: 'Rename', count: 0 });

    maxProgress = shortcuts.length * 5;
}

var wrongHandler = function (e, shortcut) {
    $('#reshortcuts-key').removeClass();
    $('#reshortcuts-key').addClass('alert-danger text-center');
    $('#reshortcuts-key-value').text(e.wrong);

    setTimeout(function () {
        $('#reshortcuts-key').removeClass();
        $('#reshortcuts-key').addClass('alert-info text-center');
        $('#reshortcuts-key-value').text(displayShortcut(shortcut.short));
    }, 1000);
}

var updateProgress = function () {
    var progressPercentage = Math.floor(currentProgress / maxProgress * 100);
    var progressPercentageLeft = 100 - progressPercentage;

    $('#progress').width(progressPercentage + '%');
    $('#progress-left').width(progressPercentageLeft + '%');
}

var displayEndLesson = function () {
    keymage.clearChains();
    $('#thankYou').modal('show');
    $('#thankYou').on('hidden.bs.modal', function () {
        window.location = "./";
    })
}

var successHandler = function (shortcut) {
    $('#reshortcuts-key').removeClass();
    $('#reshortcuts-key').addClass('alert-success text-center');
    $('#reshortcuts-key-value').text(displayShortcut(shortcut.short));

    shortcut.count += 1;
    currentProgress += 1;

    updateProgress();


    if (currentProgress === maxProgress) {
        displayEndLesson();
    } else {
        setTimeout(initShortcut, 1000);
    }
}

var displayShortcut = function (short) {
    return short.replace(/-/g, "+").replace(/ /g, ", ").toUpperCase();
}

var getShortcut = function () {
    var i = Math.floor(Math.random() * shortcuts.length);
    var s = shortcuts[i];

    if (s.count >= 5) {
        shortcuts.splice(i, 1);

        console.log('remove ' + s.short);

        return getShortcut();
    }

    return s;
}

var initShortcut = function () {
    var shortcut = getShortcut();

    $('#reshortcuts-key').removeClass();
    $('#reshortcuts-key').addClass('alert-info text-center');
    $('#reshortcut-command').text(shortcut.name + ':');

    if (shortcut.count < 2) {
        $('#reshortcuts-key-value').text(displayShortcut(shortcut.short));
    } else {
        $('#reshortcuts-key-value').html('&nbsp;');
    }

    keymage.clearChains();

    keymage(shortcut.short, function (e) {
        successHandler(shortcut);
    }, { preventDefault: true });

    keymage.wrongHandler = function (e) {
        wrongHandler(e, shortcut);
    };
}

initLesson1();
initShortcut();