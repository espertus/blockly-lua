/**
 * Blockly Apps: Blockly Lua
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
 * @fileoverview Blocks for ComputerCraft peripherals.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';

BlocklyLua.BASE_PERIPHERAL_HELP_URL_ = BlocklyLua.BASE_HELP_URL + 'Peripheral.';
BlocklyLua.PERIPHERAL_BLOCK_COLOUR_ = 65;

function BlockWithSide(blockName, title, outputType, tooltip, funcName) {
  this.blockName = blockName;
  this.title = title;
  this.outputType = outputType;
  this.tooltip = tooltip;
  this.funcName = funcName;
};

BlocklyLua.SIDES_ = [['in front', 'front'],
                     ['in back', 'back'],
                     ['to the left', 'left'],
                     ['to the right', 'right'],
                     ['above', 'top'],
                     ['below', 'bottom'],
                     ['through cable...', 'cable']];

BlockWithSide.prototype.init = function() {
  this.setColour(BlocklyLua.PERIPHERAL_BLOCK_COLOUR_);
  var thisBlock = this;
  this.appendDummyInput()
      .appendTitle(this.title);
  this.appendDummyInput()
      .appendTitle(
        new Blockly.FieldDropdown(
          BlocklyLua.SIDES_,
          function(value) {
            if (value == 'cable') {
              if (!thisBlock.cableMode) {
                thisBlock.enterCableMode();
              }
            } else {
              if (thisBlock.cableMode) {
                thisBlock.leaveCableMode();
              }
            }
          }),

        'SIDES');
  this.setOutput(true, this.outputType);
  this.cableMode = false;
  this.setInputsInline(true);
  this.setTooltip(this.tooltip);
  this.setHelpUrl(BlocklyLua.BASE_PERIPHERAL_HELP_URL_ + this.funcName);
  Blockly.Lua[this.blockName] = BlockWithSide.prototype.generateLua;

};

BlockWithSide.prototype.enterCableMode = function() {
  // Create child text block.  Perhaps this should only be done once per block?
  var textBlock = new Blockly.Block(this.workspace, 'text');
  textBlock.initSvg();
  textBlock.render();
  this.appendValueInput('TEXT')
      .setCheck('String')
      .connection.connect(textBlock.outputConnection);
  this.cableMode = true;
};

BlockWithSide.prototype.leaveCableMode = function() {
    this.removeInput('TEXT', true);
    this.cableMode = false;
  };

BlockWithSide.prototype.mutationToDom = function() {
  var container = document.createElement('mutation');
  container.setAttribute('cable_mode', this.cableMode);
  return container;
};

BlockWithSide.prototype.domToMutation = function(xmlElement) {
  this.cableMode = xmlElement.getAttribute('cable_mode') == 'true';
  if (this.cableMode) {
    this.appendValueInput('TEXT')
        .setCheck('String');
  }
};

BlockWithSide.prototype.generateLua = function(block) {
  var side = block.cableMode ?
      (Blockly.Lua.valueToCode(block, 'TEXT', Blockly.Lua.ORDER_NONE) || '')
      :  block.getTitleValue('SIDES');
  var code = 'peripheral.' + block.funcName + '(' + side + ')';
  return [code, Blockly.Lua.ORDER_HIGH];
};

Blockly.Blocks['peripheral_is_present'] = new BlockWithSide(
  'peripheral_is_present',
  'is peripheral present',
  'Boolean',
  'Return true if a peripheral is connected on the specified side.',
  'isPresent');

Blockly.Blocks['peripheral_get_type'] = new BlockWithSide(
  'peripheral_get_type',
  'get type of peripheral',
  'String',
  'Return the type of the connected peripheral or nil if none present',
  'getType');

Blockly.Blocks['peripheral_get_methods'] = new BlockWithSide(
  'peripheral_get_methods',
  'get method names of peripheral',
  'List',
  'Return a list of the names of the connected peripheral\'s methods,\n' +
      'or nil if no peripheral is connected.',
  'getMethods');

Blockly.Blocks['peripheral_wrap'] = new BlockWithSide(
  'peripheral_wrap',
  'wrap peripheral',
  'List',
  'Return the connected peripheral\'s methods so they can be called,\n' +
      'or nil if no peripheral is connected.',
  'wrap');

Blockly.Blocks['peripheral_get_names'] = {
  // Block for getting the names of connected peripherals.
  init: function() {
    this.setColour(BlocklyLua.PERIPHERAL_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle('get names of connected peripherals');
    this.setOutput(true, 'List');
    this.setTooltip('Returns the names of any peripherals connected \n' +
                    'directly or through a wired modem.');
  }
};

Blockly.Lua['peripheral_get_names'] = function(block) {
  // Generate Lua for getting the names of connected peripherals.
  var code = 'peripheral.getNames()';
  return BlocklyLua.HELPER_FUNCTIONS.generatedCode(block, code);
}
