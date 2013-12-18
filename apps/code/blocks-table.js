/**
 * Blockly Lua
 *
 * Copyright 2013 Google Inc.
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
 * @fileoverview Table blocks for Blockly Lua.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';

Blockly.ComputerCraft.TABLE_BLOCK_COLOUR_ = 230;

Blockly.Blocks['tables_create_empty'] = {
  // Create an empty table.
  init: function() {
    this.setHelpUrl(Blockly.Msg.LISTS_CREATE_EMPTY_HELPURL);
    this.setColour(260);
    this.setOutput(true, 'Array');
    this.appendDummyInput()
        .appendTitle(Blockly.Msg.LISTS_CREATE_EMPTY_TITLE);
    this.setTooltip(Blockly.Msg.LISTS_CREATE_EMPTY_TOOLTIP);
  }
};

Blockly.Blocks['lists_create_with'] = {
  // Create a list with any number of elements of any type.
  init: function() {
    this.setColour(260);
    this.appendValueInput('ADD0')
        .appendTitle(Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH);
    this.appendValueInput('ADD1');
    this.appendValueInput('ADD2');
    this.setOutput(true, 'Array');
    this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
    this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
    this.itemCount_ = 3;
  },
  mutationToDom: function(workspace) {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  domToMutation: function(container) {
    for (var x = 0; x < this.itemCount_; x++) {
      this.removeInput('ADD' + x);
    }
