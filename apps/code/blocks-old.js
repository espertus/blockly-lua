/**
 * Blockly Lua
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
 * @fileoverview Deprecated blocks for ComputerCraft turtles.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';

Blockly.ComputerCraft.deprecatedOnChange = function(newBlock) {
  return function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    this.setWarningText('This block has been deprecated.  Please replace it with the "' + newBlock + '" block.');
  };
};


Blockly.Blocks['turtle_get_item_count'] = {
  // Block for returning the number of items in the supplied slot.
  init: function() {
    this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
    this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendTitle('get item count in slot');
    this.setOutput(true, 'Number');
    this.setTooltip('Get the count of items in the supplied slot number.');
  },
  onchange: Blockly.ComputerCraft.deprecatedOnChange('get [item count/free space] in slot')
};

Blockly.Lua['turtle_get_item_count'] = function(block) {
  // Generate Lua for getting the number of items in the supplied slot number
  var argument0 = Blockly.Lua.valueToCode(
    block, 'VALUE', Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.getItemCount(' + argument0 + ')';
  return [code, Blockly.Lua.ORDER_NONE];
}

Blockly.Blocks['turtle_get_item_space'] = {
  // Block for getting the number of items that can be put in the numbered
  // slot.
  init: function() {
    this.setColour(Blockly.ComputerCraft.TURTLE_BLOCK_COLOUR_);
    this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendTitle('get free space in slot');
    this.setOutput(true, 'Number');
    this.setTooltip('Get the number of items that can be placed in the numbered slot.');
  },
  onchange: Blockly.ComputerCraft.deprecatedOnChange('get [item count/free space] in slot')
};

Blockly.Lua['turtle_get_item_space'] = function(block) {
  // Generate Lua for getting the number of items that can be put in the
  // numbered slot.
  var argument0 = Blockly.Lua.valueToCode(
    block, 'VALUE', Blockly.Lua.ORDER_NONE) || '';
  var code = 'turtle.getItemSpace(' + argument0 + ')';
  return [code, Blockly.Lua.ORDER_NONE];
}
