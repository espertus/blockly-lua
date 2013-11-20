/**
 * Blockly Apps: Code
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly Lua's Code application.
 * @author fraser@google.com (Neil Fraser)
 */

/**
 * Create a namespace for the application.
 */
var Code = {};

/**
 * List of tab names.
 * @private
 */
Code.TABS_ = ['blocks', 'lua', 'xml'];

Code.selected = 'blocks';

Code.hideTab = function(name) {
  document.getElementById('tab_' + name).className = 'taboff';
  document.getElementById('content_' + name).style.visibility = 'hidden';
};

Code.displayTab = function(id) {
  // Select the active tab.
  Code.selected = id.replace('tab_', '');
  document.getElementById(id).className = 'tabon';
  // Show the selected pane.
  document.getElementById('content_' + Code.selected).style.visibility =
      'visible';
  Code.renderContent();
  Blockly.fireUiEvent(window, 'resize');
}

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} id ID of tab clicked.
 */
Code.tabClick = function(id) {
  // If the XML tab was open, save and render the content.
  if (document.getElementById('tab_xml').className == 'tabon') {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlText = xmlTextarea.value;
    var xmlDom = null;
    try {
      xmlDom = Blockly.Xml.textToDom(xmlText);
    } catch (e) {
      var q =
          window.confirm(
              "Error parsing XML:\n%1\n\nSelect 'OK' to abandon your changes or 'Cancel' to further edit the XML.".replace('%1', e));
      if (!q) {
        // Leave the user on the XML tab.
        return;
      }
    }
    if (xmlDom) {
      Blockly.mainWorkspace.clear();
      Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xmlDom);
    }
  }

  // Deselect all tabs and hide all panes.
  for (var x in Code.TABS_) {
    Code.hideTab(Code.TABS_[x]);
  }

  // If the Lua pane was selected, validate blocks before switching.
  if (id == 'tab_lua') {
    // Check for bad block configurations that make it unlikely that
    // the resulting code is correct.
    var badBlock = Blockly.Lua.getUnconnectedBlock();
    if (badBlock) {
      warningText = 'This block is not properly connected to other blocks.';
    } else {
      badBlock = Blockly.Lua.getBlockWithWarning();
      if (badBlock) {
        warningText = 'Please fix the warning on this block.';
      }
    }

    if (badBlock) {
      // Go to blocks pane.
      Code.displayTab('tab_blocks');
      // Pop up warning dialog, making an offending block blink.
      // If they close the dialog with "OK", they remain in the blocks pane.
      // If they choose the other option ("generate Lua anyway"), the fake
      // tab "tab_lua!" is selected, and this validation will get skipped.
      var style = {
        left: '25%',
        top: '5em'
      };
      document.getElementById('badBlockMsg').innerHTML = warningText;
      BlocklyApps.showDialog(document.getElementById('badBlockDiv'), null,
                             false, true, style, BlocklyApps.stopDialogKeyDown);
      BlocklyApps.startDialogKeyDown();
      var blink = function() {
        badBlock.select();
        if (BlocklyApps.isDialogVisible_) {
          window.setTimeout(function() {badBlock.unselect();}, 150);
          window.setTimeout(blink, 300);
        }
      };
      blink();
      return;
    }
  }

  // Hack: To skip the bad block checking, id = "tab_lua!".
  if (id == 'tab_lua!') {
    id = 'tab_lua';
  }
  Code.displayTab(id);
};

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
Code.renderContent = function() {
  var content = document.getElementById('content_' + Code.selected);
  // Initialize the pane.
  if (content.id == 'content_xml') {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    xmlTextarea.value = xmlText;
    xmlTextarea.focus();
  } else if (content.id == 'content_lua') {
    var code = Blockly.Lua.workspaceToCode();
    content.textContent = code;
    if (typeof prettyPrintOne == 'function') {
      code = content.innerHTML;
      code = prettyPrintOne(code, 'lang-lua');
      content.innerHTML = code;
    }
  }
};

/**
 * Initialize Blockly.  Called on page load.
 */
Code.init = function() {
  BlocklyApps.init();

  var toolbox = document.getElementById('toolbox');
  Blockly.inject(document.getElementById('content_blocks'),
      {path: '../../',
       toolbox: toolbox});

  var container = document.getElementById('content_area');
  var onresize = function(e) {
    var bBox = BlocklyApps.getBBox_(container);
    for (var x in Code.TABS_) {
      var el = document.getElementById('content_' + Code.TABS_[x]);
      el.style.top = bBox.y + 'px';
      el.style.left = bBox.x + 'px';
      // Height and width need to be set, read back, then set again to
      // compensate for scrollbars.
      el.style.height = bBox.height + 'px';
      el.style.height = (2 * bBox.height - el.offsetHeight) + 'px';
      el.style.width = bBox.width + 'px';
      el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
    }
    // Make the 'Blocks' tab line up with the toolbox.
    if (Blockly.Toolbox.width) {
      document.getElementById('tab_blocks').style.minWidth =
          (Blockly.Toolbox.width - 38) + 'px';
          // Account for the 19 pixel margin and on each side.
    }
  };
  window.addEventListener('resize', onresize, false);

  BlocklyApps.loadBlocks('');

  if ('BlocklyStorage' in window) {
    // Hook a save function onto unload.
    BlocklyStorage.backupOnUnload();
  }

  Code.tabClick('tab_' + Code.selected);
  Blockly.fireUiEvent(window, 'resize');

  BlocklyApps.bindClick('trashButton',
      function() {Code.discard(); Code.renderContent();});

  BlocklyApps.bindClick('pastebinButton',
      function() {
        if (Blockly.mainWorkspace.getTopBlocks(false).length == 0) {
          window.alert('You should write a program before saving it to Pastebin.');
        } else {
          BlocklyApps.showDialog(document.getElementById('pastebinDiv'),
                                 this, true, true, {}, null);
        }
      });
};

if (window.location.pathname.match(/readonly.html$/)) {
  window.addEventListener('load', BlocklyApps.initReadonly);
} else {
  window.addEventListener('load', Code.init);
}

/**
 * Discard all blocks from the workspace.
 */
Code.discard = function() {
  var count = Blockly.mainWorkspace.getAllBlocks().length;
  if (count < 2 ||
      window.confirm("Delete all %1 blocks?".replace('%1', count))) {
    Blockly.mainWorkspace.clear();
    window.location.hash = '';
  }
};
