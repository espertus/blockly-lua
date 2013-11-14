/**
 * Visual Blocks Editor
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
 * @fileoverview Variable blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.variables');

goog.require('Blockly.Blocks');


Blockly.Blocks['variables_get'] = {
  // Variable getter.
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setColour(330);
    this.appendDummyInput()
        .appendTitle(Blockly.Msg.VARIABLES_GET_TITLE)
        .appendTitle(new Blockly.FieldVariable(
        Blockly.Msg.VARIABLES_GET_ITEM), 'VAR')
        .appendTitle(Blockly.Msg.VARIABLES_GET_TAIL);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
    this.contextMenuType_ = 'variables_set';
  },
  getVars: function() {
    return [this.getTitleValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getTitleValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  },
  customContextMenu: function(options) {
    var option = {enabled: true};
    var name = this.getTitleValue('VAR');
    option.text = this.contextMenuMsg_.replace('%1', name);
    var xmlTitle = goog.dom.createDom('title', null, name);
    xmlTitle.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlTitle);
    xmlBlock.setAttribute('type', this.contextMenuType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  }
};

Blockly.Blocks['variables_set'] = {
  // Variable setter.
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(330);
    this.appendValueInput('VALUE')
        .appendTitle(Blockly.Msg.VARIABLES_SET_TITLE)
        .appendTitle(new Blockly.FieldVariable(
        Blockly.Msg.VARIABLES_SET_ITEM), 'VAR')
        .appendTitle(Blockly.Msg.VARIABLES_SET_TAIL);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_get';
  },
  getVars: function() {
    return [this.getTitleValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getTitleValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  },
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu
};

Blockly.Blocks['variables_set_two'] = {
  // Set two variables to the return values of a procedure call.
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendTitle('set variables');
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldVariable('x'), 'VAR1');
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldVariable('y'), 'VAR2');
    this.appendValueInput('VALUE');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
    this.setTooltip('Set variables to the two values returned by a procedure.');
  },
  renameVar: function(oldName, newName) {
    var var1 = this.getTitleValue('VAR1');
    var var2 = this.getTitleValue('VAR2');
    if ((var1 == oldName || var1 == newName) &&
        (var2 == oldName || var2 == newName)) {
      window.alert('Two variables in a set block may not have the same name.');
      return;
    }
    if (Blockly.Names.equals(oldName, var1)) {
      this.setTitleValue(newName, 'VAR1');
    }
    if (Blockly.Names.equals(oldName, var2)) {
      this.setTitleValue(newName, 'VAR2');
    }
  },
  onchange: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    // If the value input socket is populated, make sure that block produces
    // at least two values.
    var source = this.getInputTargetBlock('VALUE');
    if (source && !source.multipleOutputs) {
      this.setWarningText('The attached block only produces one value, ' +
                          'but this block requires two.');
    } else {
      this.setWarningText(null);
    }
  }
};

Blockly.Blocks['variables_set_three'] = {
  // Set three variables to the return values of a procedure call.
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendTitle('set variables');
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldVariable('x'), 'VAR1');
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldVariable('y'), 'VAR2');
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldVariable('z'), 'VAR3');
    this.appendValueInput('VALUE');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
    this.setTooltip(
      'Set variables to the three values returned by a procedure.');
  },
  renameVar: function(oldName, newName) {
    var var1 = this.getTitleValue('VAR1');
    var var2 = this.getTitleValue('VAR2');
    var var3 = this.getTitleValue('VAR3');
    var matches = 0;
    if (var1 == oldName || var1 == newName) {
      matches++;
    }
    if (var2 == oldName || var2 == newName) {
      matches++;
    }
    if (var3 == oldName || var3 == newName) {
      matches++;
    }
    if (matches > 1) {
      window.alert(
        'Multiple variables in a set block may not have the same name.');
      return;
    }
    if (Blockly.Names.equals(oldName, var1)) {
      this.setTitleValue(newName, 'VAR1');
    }
    if (Blockly.Names.equals(oldName, var2)) {
      this.setTitleValue(newName, 'VAR2');
    }
  },
  onchange: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    // If the value input socket is populated, make sure that block produces
    // at least three values.
    var source = this.getInputTargetBlock('VALUE');
    if (source && (!source.multipleOutputs || source.multipleOutputs < 3)) {
      this.setWarningText('The attached block only produces one value, ' +
                          'but this block requires three.');
    } else {
      this.setWarningText(null);
    }
  }
};
